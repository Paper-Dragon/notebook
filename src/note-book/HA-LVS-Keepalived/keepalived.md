# HA

![image-20211114172234554](keepalived.assets\image-20211114172234554.png)

## 什么是高可用集群HA

![image-20211114172407050](keepalived.assets\image-20211114172407050.png)

## 高可用集群衡量标准

![image-20211114172435055](keepalived.assets\image-20211114172435055.png)

### 具体衡量标准

![image-20211114172601221](keepalived.assets\image-20211114172601221.png)

## 自动切换/故障转移(FailOver)

![image-20211114173341961](keepalived.assets\image-20211114173341961.png)



## 自动侦测

![image-20211114173520843](keepalived.assets\image-20211114173520843.png)



### 脑裂

#### 简介

![image-20211114173845171](keepalived.assets\image-20211114173845171.png)

#### 脑裂的产生原因



#### 常见问题解决方案

![image-20211114174801294](keepalived.assets\image-20211114174801294.png)



![image-20211114175603252](keepalived.assets\image-20211114175603252.png)



## 其他高可用方案

![image-20211114175816916](keepalived.assets\image-20211114175816916.png)

# Keepalived

## keepalived是什么

![image-20211114180302909](keepalived.assets\image-20211114180302909.png)



## keepalived工作原理

![image-20211114180318411](keepalived.assets\image-20211114180318411.png)

## VRRP协议

路由器上

## keepalived主要有三个模块

![image-20211114181924344](keepalived.assets\image-20211114181924344.png)



## 实战案例1

### 环境

```bash
web1 172.16.100.12
web2 172.16.100.11
vip  172.16.100.21
```



### server1

```bash
yum install -y keepalived
vi /etc/keepalived/keepalived.conf
安装nginx



!Configuration File for keepalived
global_defs {
        router_id 1  #设备在组中的id，设置不一样
}

#vrrp_script chk_nginx {                                        # 健康检查
#   script "/etc/keepalived/ch_ng.sh"            # 检查脚本
#       interval 2                                                         # 检查频率 秒
#       weight -5                                                          # priority 减少5
#       fall 3                                                          #失败3次
#}

vrrp_instance VI_1 {                            # 实例名字两台路由器相同
        state MASTER                                    # 主或从状态
        interface ens32                                 # 监控网卡
        mcast_src_ip 172.16.100.12              # 心跳源ip
        virtual_router_id 55                    # 虚拟路由编号，主备要一致
        priority 100                            # 优先级
        advert_int 1                            # 心跳间隔

        authentication {                        # 密钥认证 1-8位
                auth_type PASS
                auth_pass 123456
        }

        virtual_ipaddress {
        	172.16.100.12					# VIP
        }
#        track_script {						# 引用脚本
#        	chk_nginx
#        }
}
```

### server2

```bash
yum install -y keepalived
vi /etc/keepalived/keepalived.conf
安装nginx



!Configuration File for keepalived
global_defs {
        router_id 1  #设备在组中的id，设置不一样
}

#vrrp_script chk_nginx {                                        # 健康检查
#   script "/etc/keepalived/ch_ng.sh"            # 检查脚本
#       interval 2                                                         # 检查频率 秒
#       weight -5                                                          # priority 减少5
#       fall 3                                                          #失败3次
#}

vrrp_instance VI_1 {                            # 实例名字两台路由器相同
        state BACKUP                                    # 主或从状态
        interface ens32                                 # 监控网卡
        mcast_src_ip 172.16.100.12              # 心跳源ip
        virtual_router_id 55                    # 虚拟路由编号，主备要一致
        priority 100                            # 优先级
        advert_int 1                            # 心跳间隔

        authentication {                        # 密钥认证 1-8位
                auth_type PASS
                auth_pass 123456
        }

        virtual_ipaddress {
        	172.16.100.12					# VIP
        }
#        track_script {						# 引用脚本
#        	chk_nginx
#        }
}
```



### client

自动跳节点

### 关于keepalived对nginx状态未知的问题

vim /etc/keepalived/ck_ng.sh

```bash
#!/bin/bash                                                                                                                                              
# 检查Nginx是否存在
COUNT1=`ss -anpt | grep nginx | wc -l `
if [ $COUNT1 -eq 0 ] ; then
    /usr/local/sbin/nginx -s start
    sleep 2
        COUNT2=`ss -anpt | grep nginx | wc -l`
        if [ $COUNT2 -eq 0 ] ; then
            /usr/bin/kill -15 `cat /var/run/keepalived.pid`
            echo -e "keeplived is stoped"
        else
            exit 0
        fi  
fi



apache

#!/bin/bash                                                                                                                                              
# 检查Apache是否存在
COUNT1=`ss -anpt | grep httpd | wc -l `
if [ $COUNT1 -eq 0 ] ; then
    systemctl restart httpd
    sleep 2
        COUNT2=`ss -anpt | grep httpd | wc -l`
        if [ $COUNT2 -eq 0 ] ; then
            /usr/bin/kill -15 `cat /var/run/keepalived.pid`
            echo -e "keeplived is stoped"
        else
            exit 0
        fi  
fi


chmod +x /etc/keepalived/ck_ng.sh
```



## 实战案例2

lvs+keepalived

![image-20211114210613877](keepalived.assets\image-20211114210613877-16368951757981.png)



1、在master上安装配置keepalived

```bash
yum install ipvsadm keepalived
```

2、在master\backup上修改配置文件

```bash
[root@dir1 ~]# 
[root@dir1 ~]# 
[root@dir1 ~]# cat /etc/keepalived/keepalived.conf
!Configuration File for keepalived
global_defs {
        router_id 1  #设备在组中的id，设置不一样
}

#vrrp_script chk_nginx {                                        # 健康检查
#   script "/etc/keepalived/ch_ng.sh"            # 检查脚本
#       interval 2                                                         # 检查频率 秒
#       weight -5                                                          # priority 减少5
#       fall 3                                                          #失败3次
#}

vrrp_instance VI_1 {                            # 实例名字两台路由器相同
        state MASTER                                    # 主或从状态
        interface ens32                                 # 监控网卡
        mcast_src_ip 172.16.100.21              # 心跳源ip
        virtual_router_id 55                    # 虚拟路由编号，主备要一致
        priority 150                            # 优先级
        advert_int 1                            # 心跳间隔

        authentication {                        # 密钥认证 1-8位
                auth_type PASS
                auth_pass 123456
        }

        virtual_ipaddress {
        	172.16.100.22/24 dev ens32 					# VIP
        }

#        track_script {						# 引用脚本
#        	chk_nginx
#        }
}
virtual_server 172.16.100.22 80 {       # LVS配置
        delay_loop 3                    # 服务轮询的时间间隔
        lb_algo rr                      # LVS调度算法
        lb_kind DR                      # LVS集群模式
        protocol TCP
        real_server 172.16.100.14 80 {
                weight 1
                TCP_CHECK {
                        connect_timeout 3       # 健康检查方式，连接超时时间
                }
        }
        real_server 172.16.100.15 80 {
                weight 1
                TCP_CHECK {
                        connect_timeout 3
                }
        }
}

[root@dir1 ~]# 



[root@dir2 ~]# 
[root@dir2 ~]# cat /etc/keepalived/keepalived.conf
!Configuration File for keepalived
global_defs {
        router_id 2  #设备在组中的id，设置不一样
}

#vrrp_script chk_nginx {                                        # 健康检查
#   script "/etc/keepalived/ch_ng.sh"            # 检查脚本
#       interval 2                                                         # 检查频率 秒
#       weight -5                                                          # priority 减少5
#       fall 3                                                          #失败3次
#}

vrrp_instance VI_1 {                            # 实例名字两台路由器相同
        state BACKUP                                    # 主或从状态
        interface ens32                                 # 监控网卡
        mcast_src_ip 172.16.100.16              # 心跳源ip
        virtual_router_id 55                    # 虚拟路由编号，主备要一致
        priority 100                            # 优先级
        advert_int 1                            # 心跳间隔

        authentication {                        # 密钥认证 1-8位
                auth_type PASS
                auth_pass 123456
        }

        virtual_ipaddress {
        	172.16.100.22/24 dev ens32 					# VIP
        }

#        track_script {						# 引用脚本
#        	chk_nginx
#        }
}
virtual_server 172.16.100.22 80 {       # LVS配置
        delay_loop 3                    # 服务轮询的时间间隔
        lb_algo rr                      # LVS调度算法
        lb_kind DR                      # LVS集群模式
        protocol TCP
        real_server 172.16.100.14 80 {
                weight 1
                TCP_CHECK {
                        connect_timeout 3       # 健康检查方式，连接超时时间
                }
        }
        real_server 172.16.100.15 80 {
                weight 1
                TCP_CHECK {
                        connect_timeout 3
                }
        }
}

[root@dir2 ~]# 


```

6、master和backup上启动服务

```bash
[root@dir1 ~]# systemctl status keepalived
\● keepalived.service - LVS and VRRP High Availability Monitor
   Loaded: loaded (/usr/lib/systemd/system/keepalived.service; enabled; vendor preset: disabled)
   Active: active (running) since Sun 2021-11-14 21:53:56 CST; 1min 42s ago
  Process: 6821 ExecStart=/usr/sbin/keepalived $KEEPALIVED_OPTIONS (code=exited, status=0/SUCCESS)
 Main PID: 6822 (keepalived)
   CGroup: /system.slice/keepalived.service
           ├─6822 /usr/sbin/keepalived -D
           ├─6823 /usr/sbin/keepalived -D
           └─6824 /usr/sbin/keepalived -D

Nov 14 21:53:58 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:53:58 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:53:58 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:53:58 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:54:03 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:54:03 dir1 Keepalived_vrrp[6824]: VRRP_Instance(VI_1) Sending/queueing gratuitous ARPs on ens32 f...00.22
Nov 14 21:54:03 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:54:03 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:54:03 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Nov 14 21:54:03 dir1 Keepalived_vrrp[6824]: Sending gratuitous ARP on ens32 for 172.16.100.22
Hint: Some lines were ellipsized, use -l to show in full.
[root@dir1 ~]# 


[root@dir2 ~]# systemctl status keepalived
\● keepalived.service - LVS and VRRP High Availability Monitor
   Loaded: loaded (/usr/lib/systemd/system/keepalived.service; enabled; vendor preset: disabled)
   Active: active (running) since Sun 2021-11-14 21:53:56 CST; 1min 42s ago
  Process: 6805 ExecStart=/usr/sbin/keepalived $KEEPALIVED_OPTIONS (code=exited, status=0/SUCCESS)
 Main PID: 6806 (keepalived)
   CGroup: /system.slice/keepalived.service
           ├─6806 /usr/sbin/keepalived -D
           ├─6807 /usr/sbin/keepalived -D
           └─6808 /usr/sbin/keepalived -D

Nov 14 21:53:56 dir2 Keepalived_vrrp[6808]: Registering gratuitous ARP shared channel
Nov 14 21:53:56 dir2 Keepalived_vrrp[6808]: Opening file '/etc/keepalived/keepalived.conf'.
Nov 14 21:53:56 dir2 Keepalived_vrrp[6808]: VRRP_Instance(VI_1) removing protocol VIPs.
Nov 14 21:53:56 dir2 Keepalived_vrrp[6808]: Using LinkWatch kernel netlink reflector...
Nov 14 21:53:56 dir2 Keepalived_vrrp[6808]: VRRP_Instance(VI_1) Entering BACKUP STATE
Nov 14 21:53:56 dir2 Keepalived_vrrp[6808]: VRRP sockpool: [ifindex(2), proto(112), unicast(0), fd(10,11)]
Nov 14 21:53:56 dir2 Keepalived_healthcheckers[6807]: Initializing ipvs
Nov 14 21:53:56 dir2 Keepalived_healthcheckers[6807]: Opening file '/etc/keepalived/keepalived.conf'.
Nov 14 21:53:56 dir2 Keepalived_healthcheckers[6807]: Activating healthchecker for service [172.16.100.22]:80
Nov 14 21:53:56 dir2 Keepalived_healthcheckers[6807]: Activating healthchecker for service [172.16.100.22]:80
[root@dir2 ~]# 

```



7、web服务器配置

配置虚拟地址

```bash
[root@web1 ~]# cp /etc/sysconfig/network-scripts/ifcfg-lo /etc/sysconfig/network-scripts/ifcfg-lo:0
[root@web2 ~]# cp /etc/sysconfig/network-scripts/ifcfg-lo /etc/sysconfig/network-scripts/ifcfg-lo:0




[root@web2 ~]# vim /etc/sysconfig/network-scripts/ifcfg-lo:0
[root@web2 ~]# cat /etc/sysconfig/network-scripts/ifcfg-lo:0
DEVICE=lo:0
IPADDR=172.16.100.22
NETMASK=255.255.255.255
ONBOOT=yes
[root@web2 ~]# 

[root@web1 ~]# vim /etc/sysconfig/network-scripts/ifcfg-lo:0
[root@web1 ~]# cat /etc/sysconfig/network-scripts/ifcfg-lo:0
DEVICE=lo:0
IPADDR=172.16.100.22
NETMASK=255.255.255.255
ONBOOT=yes
[root@web1 ~]# 




[root@web1 ~]# systemctl restart network
[root@web1 ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet 172.16.100.22/32 brd 172.16.100.22 scope global lo:0
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:a4:e1:a2 brd ff:ff:ff:ff:ff:ff
    inet 172.16.100.14/24 brd 172.16.100.255 scope global noprefixroute dynamic ens32
       valid_lft 1799sec preferred_lft 1799sec
    inet6 fe80::ad01:cb2d:3f81:c89/64 scope link tentative noprefixroute dadfailed 
       valid_lft forever preferred_lft forever
    inet6 fe80::717d:2c3a:555f:6c78/64 scope link tentative noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::efd2:927c:ee23:747c/64 scope link tentative noprefixroute 
       valid_lft forever preferred_lft forever
[root@web1 ~]# 

[root@web2 ~]# systemctl restart network
[root@web2 ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet 172.16.100.22/32 brd 172.16.100.22 scope global lo:0
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens32: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:32:9a:09 brd ff:ff:ff:ff:ff:ff
    inet 172.16.100.15/24 brd 172.16.100.255 scope global noprefixroute dynamic ens32
       valid_lft 1799sec preferred_lft 1799sec
    inet6 fe80::ad01:cb2d:3f81:c89/64 scope link tentative noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::717d:2c3a:555f:6c78/64 scope link tentative noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::efd2:927c:ee23:747c/64 scope link tentative noprefixroute 
       valid_lft forever preferred_lft forever
[root@web2 ~]# 

```

配置路由

vim /etc/rc.local   [web1 and web2]

```bash
/sbin/route add -host  172.16.100.22 dev lo:0
```

![image-20211114220407845](keepalived.assets\image-20211114220407845.png)

配置ARP

```bash
net.ipv4.conf.all.arp_ignore=1
net.ipv4.conf.all.arp_announce=2
net.ipv4.conf.default.arp_ignore= 1
net.ipv4.conf.default.arp_announce=2
net.ipv4.conf.lo.arp_ignore=1
net.ipv4.conf.lo.arp_announce=2



[root@web1 ~]# vim /etc/sysctl.conf 
[root@web1 ~]# sysctl -p
net.ipv4.conf.all.arp_ignore = 1
net.ipv4.conf.all.arp_announce = 2
net.ipv4.conf.default.arp_ignore = 1
net.ipv4.conf.default.arp_announce = 2
net.ipv4.conf.lo.arp_ignore = 1
net.ipv4.conf.lo.arp_announce = 2
[root@web1 ~]# 


[root@web2 ~]# vim /etc/sysctl.conf 
[root@web2 ~]# sysctl -p
net.ipv4.conf.all.arp_ignore = 1
net.ipv4.conf.all.arp_announce = 2
net.ipv4.conf.default.arp_ignore = 1
net.ipv4.conf.default.arp_announce = 2
net.ipv4.conf.lo.arp_ignore = 1
net.ipv4.conf.lo.arp_announce = 2
[root@web2 ~]# 

```



8、测试





## 思考





