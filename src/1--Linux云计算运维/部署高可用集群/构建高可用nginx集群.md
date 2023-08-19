## 案例需求

部署基于nginx分发器的高可用web集群

- 分发器故障自动切换
- 数据服务器自动容错
- 任何机器宕机不中断web业务

### 实验拓扑

![image20200221150137745.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603969889077.png)

### 实验环境

| 角色   | IP                             |
| ------ | ------------------------------ |
| client | 192.168.0.10                   |
| master | 192.168.0.40 VIP=192.168.0.150 |
| backup | 192.168.0.41 VIP=192.168.0.150 |
| web1   | 192.168.0.42                   |
| web2   | 192.168.0.43                   |

### 实验步骤

a、配置nginx集群

```
master&backup安装nginx和keepalived
修改nginx配置文件
[root@master ~]# vim /usr/local/nginx/conf/nginx.conf
worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
         upstream web {
                server 192.168.0.42 max_fails=2 fail_timeout=3;#3秒内失败2次，则认为此节点失效
                server 192.168.0.43 max_fails=2 fail_timeout=3;
        }
server {
        listen  80;
        server_name     localhost;
        location / {
        proxy_pass http://web;
        }
}
}
```

b、配置keepalived

```
[root@master ~]# vim /etc/keepalived/keepalived.conf 
! Configuration File for keepalived
global_defs {
    router_id NGINX_DEVEL
}
vrrp_script check_nginx {	#定义脚本的名称为check_nginx
    script "/etc/keepalived/nginx_pid.sh"	#检查对应位置的文件是否存在
    interval 2	#定义执行间隔为2秒
    fall 1	#失败次数为1次
}
vrrp_instance nginx {	#定义实例名称为nginx
    state MASTER	#定义主机状态
    interface ens33	#定义通信接口，VIP绑定的接口
    mcast_src_ip 192.168.0.40	#定义发送vrrp广播的源地址，模式使用VIP绑定网卡的主IP地址
    virtual_router_id 51#定义VRID，主从设备vrid要抑制
    priority 100#定义优先级
    advert_int 1	#定义检查间隔，默认1秒
    authentication {	#设置认证，同一vrid的设备要抑制
        auth_type PASS	#认证方式为PASS
        auth_pass 1111	#认证密码为1111
    }
    track_script {
        check_nginx	#调用在vrrp_script中定义的内容
    }
    virtual_ipaddress {
        192.168.0.150/24
    }
}



[root@backup ~]# vim /etc/keepalived/keepalived.conf 
! Configuration File for keepalived
global_defs {
    router_id NGINX_DEVEL
}
vrrp_script check_nginx {
    script "/etc/keepalived/nginx_pid.sh"
    interval 2
    fall 1
}
vrrp_instance nginx {
    state BACKUP
    interface ens33
    mcast_src_ip 192.168.0.41
    virtual_router_id 51
    priority 90
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    track_script {
        check_nginx
    }
    virtual_ipaddress {
        192.168.0.150/24
    }
}
```

c、构建关联脚本

```
[root@master ~]# vim /etc/keepalived/nginx_pid.sh
#!/bin/bash
nginx_kp_check () {
    nginxpid=`ps -C nginx --no-header |wc -l`
    if [ $nginxpid -eq 0 ];then
        /usr/local/nginx/sbin/nginx
        sleep 1
        nginxpid=`ps -C nginx --no-header |wc -l`
        if [ $nginxpid -eq 0 ];then
            systemctl stop keepalived
        fi
    fi
}

nginx_kp_check

[root@backup ~]# vim /etc/keepalived/nginx_pid.sh 
#!/bin/bash
nginx_kp_check () {
    nginxpid=`ps -C nginx --no-header |wc -l`
    if [ $nginxpid -eq 0 ];then
        /usr/local/nginx/sbin/nginx
        sleep 1
        nginxpid=`ps -C nginx --no-header |wc -l`
        if [ $nginxpid -eq 0 ];then
            systemctl stop keepalived
        fi
    fi
}

nginx_kp_check

脚本功能说明：统计nginx进程数量，如果进程数量的值等于0，说明nginx挂了，那么执行/usr/local/nginx/sbin/nginx去启动分发器，等待1秒后再次检查进程数量，如果进程数量的值还是等于0，则执行systemctl stop keepalived停止keepalived服务。这样就停止发组播，释放VIP，而备用服务器就开始接手工作了。
```

### 集群高可用性测试

**集群测试：使用客户端正常访问VIP**

```
[root@client ~]# curl 192.168.0.150
web1
[root@client ~]# curl 192.168.0.150
web2
```

在master上down掉nginx服务

```
[root@master ~]# watch -n1 'killall nginx'
每隔秒执行一次killall nginx命令
[root@master ~]# ip add #查看VIP是否还在
[root@backup ~]# ip add	#到backup主机上查看是否有VIP
```

继续测试

```
[root@client ~]# curl 192.168.0.150
web1
[root@client ~]# curl 192.168.0.150
web2
```

重启master上的keepalived服务

```
[root@master ~]# ip add	#查看VIP是否飘回来
[root@master ~]# lsof -i :80	#查看nginx是否被启
```

再次测试

```
[root@client ~]# curl 192.168.0.150
web1
[root@client ~]# curl 192.168.0.150
web2
```

**数据服务器宕机测试**

停止web1主机上的web服务

```
[root@web1 ~]# systemctl stop httpd
```

切换到client主机测试

```
[root@client ~]# curl 192.168.0.150
web2
[root@client ~]# curl 192.168.0.150
web2
```

启动web1主机上的web服务

```
[root@web1 ~]# systemctl start httpd
```

切换到client主机测试

```
[root@client ~]# curl 192.168.0.150
web2
[root@client ~]# curl 192.168.0.150
web1
```