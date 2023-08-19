## 一、lvs+keepalived高可用集群部署

### 案例需求

部署基于LVS DR模式的web高可用集群，实现：

- 实现数据服务器容错
- 实现分发器故障切换
- 任何机器宕机不中断web业务

### 实验环境

六台安装CentOS8的虚拟机一台测试机，两台LVS分发器，一台路由器，两台web服务器，关闭selinux关闭防火墙，停止libvirtd.service服务

| 角色名称 | 接口名称      | IP地址                              |
| -------- | :------------ | ----------------------------------- |
| client   | ens33         | 192.168.1.200                       |
| route    | ens33，ens160 | 192.168.1.1，192.168.2.1            |
| lvs1     | ens33         | 192.168.2.200，192.168.2.100（VIP） |
| lvs2     | ens33         | 192.168.2.150，192.168.2.100（VIP） |
| rs1      | ens33，lo:0   | 192.168.2.220，192.168.2.100（VIP） |
| rs2      | ens33，lo:0   | 192.168.2.210，192.168.2.100（VIP） |

### 实验拓扑图

![image20200205130755595.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603969166770.png)

### 实验步骤

a、配置客户端

```
ens33=192.168.1.200
[root@client ~]# route add default gw 192.168.1.1
```

b、设置路由

```
ens33=192.168.1.1
ens160=192.168.2.1

[root@route ~]# echo 1 > /proc/sys/net/ipv4/ip_forward
```

c、设置RS的VIP、网关、内核参数

```
RS1
[root@rs1 ~]# route add default gw 192.168.2.1
[root@rs1 ~]# ifconfig lo:0 192.168.2.100 netmask 255.255.255.255 up
[root@rs1 ~]# echo 1 > /proc/sys/net/ipv4/conf/all/arp_ignore 
[root@rs1 ~]# echo 2 > /proc/sys/net/ipv4/conf/all/arp_announce 

RS2
[root@rs2 ~]# route add default gw 192.168.2.1
[root@rs2 ~]# ifconfig lo:0 192.168.2.100 netmask 255.255.255.255 up
[root@rs2 ~]# echo 1 > /proc/sys/net/ipv4/conf/all/arp_ignore 
[root@rs2 ~]# echo 2 > /proc/sys/net/ipv4/conf/all/arp_announce 

安装web服务，生成测试页面
RS1
[root@rs1 ~]# dnf install httpd -y
[root@rs1 ~]# echo "rs1" > /var/www/html/index.html
[root@rs1 ~]# systemctl start httpd.service
RS2
[root@rs2 ~]# dnf install httpd -y
[root@rs2 ~]# echo "rs2" > /var/www/html/index.html
[root@rs2 ~]# systemctl start httpd.service
```

d、设置LVS

```
### LVS1 安装软件包，修改配置文件
[root@lvs1 ~]# dnf install ipvsadm keepalived -y
[root@lvs1 ~]# vim /etc/keepalived/keepalived.conf 
! Configuration File for keepalived

global_defs {
   router_id lvs_1
}
vrrp_instance apache {
    state MASTER
    interface ens33
    virtual_router_id 51
    priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        192.168.2.100/24
    }
}

virtual_server 192.168.2.100 80 {
    delay_loop 6
    lb_algo rr
    lb_kind DR
    nat_mask 255.255.255.0
#    persistence_timeout 50
    protocol TCP

    real_server 192.168.2.210 80 {
        weight 1
        TCP_CHECK {
              connect_timeout 3
              connect_port 80
            }
        }
    real_server 192.168.2.220 80 {
        weight 1
        TCP_CHECK {
              connect_timeout 3
              connect_port 80
            }
        }
}

### 重启keepalived服务
[root@lvs1 ~]# systemctl start keepalived.service 

### 使用ip add命令查看所设置的VIP是否被设置
[root@lvs1 ~]# ip add
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:6d:1c:b3 brd ff:ff:ff:ff:ff:ff
    inet 192.168.2.200/24 brd 192.168.2.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet 192.168.2.100/24 scope global secondary ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::474:99dd:c899:455f/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever


### LVS2	安装软件包，修改配置文件
[root@lvs2 ~]# dnf install ipvsadm keepalived -y
[root@lvs2 ~]# vim /etc/keepalived/keepalived.conf 
! Configuration File for keepalived

global_defs {
   router_id lvs_1
}
vrrp_instance apache {
    state BACKUP
    interface ens33
    virtual_router_id 51
    priority 10
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        192.168.2.100/24
    }
}

virtual_server 192.168.2.100 80 {
    delay_loop 6
    lb_algo rr
    lb_kind DR
    nat_mask 255.255.255.0
#    persistence_timeout 50
    protocol TCP

    real_server 192.168.2.210 80 {
        weight 1
        TCP_CHECK {
              connect_timeout 3
              connect_port 80
            }
        }
    real_server 192.168.2.220 80 {
        weight 1
        TCP_CHECK {
              connect_timeout 3
              connect_port 80
            }
        }
}

### 重启keepalived服务
[root@lvs2 ~]# systemctl start keepalived.service
```

e、客户端测试

```
### 客户端验证分发
[root@client ~]# elinks http://192.168.2.100 --dump
   rs1
[root@client ~]# elinks http://192.168.2.100 --dump
   rs2

### 停止lvs1的keepalived服务  验证分发器故障切换
[root@lvs1 ~]# systemctl stop keepalived.service 

使用ip add命令查看VIP是否被释放
[root@lvs1 ~]# ip add
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:6d:1c:b3 brd ff:ff:ff:ff:ff:ff
    inet 192.168.2.200/24 brd 192.168.2.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::474:99dd:c899:455f/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever


切换到lvs2查看VIP是否被设置
[root@lvs2 ~]# ip add
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:5c:a0:66 brd ff:ff:ff:ff:ff:ff
    inet 192.168.2.150/24 brd 192.168.2.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet 192.168.2.100/24 scope global secondary ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::5726:cbb9:c37b:d898/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever


切换到客户端测试
[root@client ~]# elinks http://192.168.2.100 --dump
   rs1
[root@client ~]# elinks http://192.168.2.100 --dump
   rs2


### 停止RS1数据服务器查看数据服务器容错
[root@rs1 ~]#  systemctl stop httpd

切换到客户端测试:用户只能访问到RS1的页面
[root@client ~]# elinks http://192.168.2.100 --dump
   rs1
[root@client ~]# elinks http://192.168.2.100 --dump
   rs1
```

提示：使用tcpdump命令可以看到vrrp的相关信息发送信息，深度理解VRRP协议

```
[root@lvs1 ~]# tcpdump -nn -vvv vrrp
```