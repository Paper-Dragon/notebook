# 大型网站高并发解决方案LVS

# 负载均衡

## 集群功能分类：

### LB： Load Balance

有一定的高可用能力，但不是高可用集群，是以提高服务的并发处理能力为根本着眼点

负载均衡产品分类

![image-20211113162334546](ha-lvs-keepalived.assets\image-20211113162334546-16367918158651.png)

软件负载均衡设备： lvs（4层路由设备，ip、端口号）、haproxy、nginx、

对比：

软件负载均衡设备（廉价解决方案）：

![image-20211113163036742](ha-lvs-keepalived.assets\image-20211113163036742.png)

硬件负载均衡设备：

F5： BIG IP

Citrix，Netscaler

A10

深信服



### HA： High Avaliabillity

增加服务可用性

99% 一年3天不在线

99.9% 一年0.3天不在线

KeepAlived：

![image-20211113171035950](ha-lvs-keepalived.assets\image-20211113171035950-16367946376613.png)





### HPC High performance

高性能计算集群：尽量向上扩展，如果 cpu过多，在架构上纵然会有问题的并行处理集群

1、分布式文件系统

2、将大任务分割为小任务，分别进行处理的机制（Hadoop是并行处理集群）



## 负载均衡

### 主要方式：

LB 高性能 高可用 高并发

#### http重定向

rewrite方式

客户端压力大，性能差

302跳转： 有概率被seo引擎判断为作弊

![image-20211113175339554](ha-lvs-keepalived.assets\image-20211113175339554-16367972211964.png)

#### DNS负载均衡

DNS解析时提供负载能力

缺点：目前的DNS解析是多级解析，服务器下线，记录仍生效，导致无法访问

![image-20211113180301959](ha-lvs-keepalived.assets\image-20211113180301959-16367977839625.png)

#### 反向代理负载均衡

原理：squid ，nginx

![image-20211114085827104](ha-lvs-keepalived.assets\image-20211114085827104.png)



#### IP网络层负载均衡

![image-20211114090028397](ha-lvs-keepalived.assets\image-20211114090028397.png)

![image-20211114090041036](ha-lvs-keepalived.assets\image-20211114090041036-16368516423011.png)

![image-20211114090057988](ha-lvs-keepalived.assets\image-20211114090057988.png)

#### 数据链路层负载均衡

![image-20211114090845169](ha-lvs-keepalived.assets\image-20211114090845169-16368521267182.png)

#### F5硬件负载均衡

![image-20211114091053116](ha-lvs-keepalived.assets\image-20211114091053116.png)



#### 四层负载和七层负载

![image-20211114091217432](ha-lvs-keepalived.assets\image-20211114091217432-16368523387793.png)



#### 关于代理

![image-20211114091451393](ha-lvs-keepalived.assets\image-20211114091451393-16368524925614.png)

### lvs概述

![image-20211114092538677](ha-lvs-keepalived.assets\image-20211114092538677.png)

![image-20211114093043979](ha-lvs-keepalived.assets\image-20211114093043979-16368534454495.png)







### lvs工作模式

#### NAT转发模式

NAT：网络地址转换

![image-20211114093750021](ha-lvs-keepalived.assets\image-20211114093750021-16368538715346.png)

![image-20211114094615718](ha-lvs-keepalived.assets\image-20211114094615718-16368543772377.png)



#### DR直接路由模式（MAC）

![image-20211114145843200](ha-lvs-keepalived.assets\image-20211114145843200.png)

工作原理

![image-20211114145617062](ha-lvs-keepalived.assets\image-20211114145617062-163687297874110.png)



#### TUN-IP隧道模式

![image-20211114155619941](ha-lvs-keepalived.assets\image-20211114155619941-163687658220211.png)

![image](ha-lvs-keepalived.assets\image-20211114155828987.png)





#### FULL-NAT

![image](ha-lvs-keepalived.assets\image-20211114155937925.png)

![image](ha-lvs-keepalived.assets\image-20211114155924388.png)



#### 模式对比

![image](ha-lvs-keepalived.assets\image-20211114160032317.png)

### 轮询算法

Fixed Scheduling Method 静态调服方法

RR 轮询

![image-20211114160525159](ha-lvs-keepalived.assets\image-20211114160525159.png)

WRR 加权轮询

![image-20211114160530580](ha-lvs-keepalived.assets\image-20211114160530580.png)

DH 目标地址hash

![image-20211114160933272](ha-lvs-keepalived.assets\image-20211114160933272.png)

Dynamic Scheduling Method 动态调服方法

LC 最小连接数

![image-20211114160654786](ha-lvs-keepalived.assets\image-20211114160654786.png)

WLC 加权最小链接数

![image-20211114160828264](ha-lvs-keepalived.assets\image-20211114160828264.png)

LBLC 基于本地的最少链接

LBLCR 带复制的基于本地的最少链接

# LVS-DR实战案例

DR：direct route直连路由

环境：

```bash
web1
172.16.100.12
web2 
172.16.100.11
lvs-dr
172.16.100.21

vip 
172.16.100.22
```

配置：

1、lvs-dr准备vip和路由

添加vip

```bash
ifconfig ens32:0 172.16.100.22 broadcast 172.16.100.255 netmask 255.255.255.0 up
route add -host 172.16.100.22 dev ens32:0

VIP和RIP要配置到同一个网卡上
```

设置路由转发

```bash
vi /etc/sysctl.conf
net.ipv4.ip_forward=1 # 开启网络路由转发
net.ipv4.conf.all.send_redirects=0 # 禁止转发重定向报文
net.ipv4.conf.ens32.send_redirects=0 # 禁止ens32转发重定向报文
net.ipv4.conf.default.send_redirects=0 # 禁止默认转发重定向报文
```

2、lvs-dr设置负载均衡条目、规则

设置ipvsadm

```bash
yum -y install ipvsadm

ipvsamd -C
ipvsadm -A -t 172.16.100.22:80 -s rr
ipvsadm -a -t 172.16.100.22:80 -r 172.16.100.12:80 -g
ipvsadm -a -t 172.16.100.22:80 -r 172.16.100.11:80 -g



-a 对内的地址
-r route
-m nat模式Masq
-A   对外提供的地址
-t   TCP协议
-s   scr...策略  rr:roundrouding轮询 
-g 直连模式 gateway
```

3、lvs-dr让设置永久生效

```bash
ipvsadm-save > /etc/sysconfig/ipvsadm-config
systemctl enable ipvsadm
```

web集群

安装web访问

```bash
[root@web1 ~]# echo $HOSTNAME > /var/www/html/index.html
ifconfig lo:0 172.16.100.22/32


[root@web2 ~]# echo $HOSTNAME > /var/www/html/index.html
ifconfig lo:0 172.16.100.22/32

echo 1 > /proc/sys/net/ipv4/conf/all/arp_ignore 不理睬arp包
echo 1 > /proc/sys/net/ipv4/conf/all/arp_announce  如果给你包则回复
```

在lvs上查询链接

```bash
[root@lvs ~]# ipvsadm -Lnc
IPVS connection entries
pro expire state       source             virtual            destination
TCP 01:52  FIN_WAIT    172.16.100.1:54763 172.16.100.22:80   172.16.100.11:80

```



![image](ha-lvs-keepalived.assets\image-20211114155239150.png)

![image](ha-lvs-keepalived.assets\image-20211114155259269.png)

![image](ha-lvs-keepalived.assets\image-20211114161600562.png)





























# LVS-NAT实战案例

拓扑：

![image-20211114095244968](ha-lvs-keepalived.assets\image-20211114095244968.png)

WEB-server

![image-20211114110114691](ha-lvs-keepalived.assets\image-20211114110114691-16368588772758.png)

LVS

![image-20211114113808272](ha-lvs-keepalived.assets\image-20211114113808272-16368610905249.png)

```
ipvsadm -A -t 192.168.154.128:80 -s rr
-A   对外提供的地址
-t   TCP协议
-s   scr...策略  rr:roundrouding轮询 
ipvsadm -a -t 192.168.154.128:80 -r  172.16.100.29:80 -m 
-a 对内的地址
-r route
-m nat模式Masq
ipvsadm -a -t 192.168.154.128:80 -r  172.16.100.31:80 -m 


客户端测试即可
```

