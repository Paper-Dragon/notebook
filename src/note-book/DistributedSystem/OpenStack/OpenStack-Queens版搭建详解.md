# 1.基础环境配置

## 1.1 节点硬件规划

本次搭建使用VMware Workstation虚拟出3台CentOS7虚拟机作为主机节点，节点架构：1个controller控制节点、1个compute计算节点、1个cinder块存储节点。硬件配置具体如下：

|节点名称 	| CPU	| 内存 |	磁盘 |	操作系统镜像|
| ------------- |-------------| -----|----|----|
|controller节点 |	2VCPU	|	4GB	|50GB	|CentOS-7-x86_64-Minimal-1804.iso|
|compute1节点 |	2VCPU	|4GB	|50GB|	CentOS-7-x86_64-Minimal-1804.iso|
|cinder1节点 |2VCPU	|4GB|	50GB系统盘，50GB存储盘|	CentOS-7-x86_64-Minimal-1804.iso|



说明：硬件规划可以根据自己需求灵活调整，这里使用CentOS-7-x86_64-Minimal-1804，minimal版占用资源更少，下载地址：https://www.centos.org/。

**Vmware Workstation虚拟机开启虚拟化引擎：**
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70.png)
**查看操作系统及内核版本：**

```bash
[root@controller ~]# cat /etc/redhat-release 
CentOS Linux release 7.5.1804 (Core)
[root@controller ~]# uname -sr
Linux 4.16.11-1.el7.elrepo.x86_64
```

## 1.2 节点网络规划
本次搭建网络使用linuxbridge+vxlan模式，包含三个网络平面：管理网络，外部网络和租户隧道网络，具体规划如下：

| 节点名称	| 网卡编号| 	网卡名称	| 网卡模式| 	虚拟交换机	| 网络类型| 	IP地址| 	网关|
|-------------|:-------------:| -----:|
| controller节点 | 网卡1| ens33| 仅主机模式| vmnet1| 管理网络| 	192.168.90.70|无|
|  |	网卡2	| ens37	| 仅主机模式	|vmnet2|	隧道网络|	192.168.91.70	|无|
| | 	网卡3	|ens38|	NAT模式|	vmnet8	|外部网络|	192.168.92.70	|192.168.92.2/24|
| compute1节点|	网卡1	|ens33	|仅主机模式	|vmnet1	|管理网络|	192.168.90.71	|无|
| 	|网卡2	|ens37|	仅主机模式	|vmnet2	|隧道网络|	192.168.91.71|	无|
| 	|网卡3|	ens38|	NAT模式|	vmnet8	|部署网络|	192.168.92.71	|192.168.92.2/24|
| cinder1节点	|网卡1	|ens33	|仅主机模式|	vmnet1	|管理网络	|192.168.90.72	|无|
| |	网卡2	|ens37	|NAT模式	|vmnet8	|部署网络|	192.168.92.72	|192.168.92.2/24|
VMware Workstation虚拟网络编辑器配置信息，这里新创建VMnet2作为隧道网络：
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-16919211029113.png)
**网络规划说明：**

 - 控制节点3块网卡，计算节点3块网卡，存储节点2块网卡。特别注意，计算节点和存储节点的最后一块网卡仅用于连接互联网部署Oenstack软件包，如果搭建有本地yum源，这两块网卡是不需要的，不属于openstack架构体系中的网络。
 - 管理网络配置为仅主机模式，官方解释通过管理网络访问互联网安装软件包，如果搭建的有内部yum源，管理网络是不需要访问互联网的，配置成hostonly模式也可以。
 - 隧道网络配置为仅主机模式，因为隧道网络不需要访问互联网，仅用来承载openstack内部租户的网络流量。
 - 外部网络配置为NAT模式，控制节点的外部网络主要是实现openstack租户网络对外网的访问，另外openstack软件包的部署安装也走这个网络，
 - 特别注意：计算节点和存储节点的外部网络仅用来部署openstack软件包，没有其他用途。

**三种网络平面说明：**

 - 管理网络（management/API网络）：
   提供系统管理相关功能，用于节点之间各服务组件内部通信以及对数据库服务的访问，所有节点都需要连接到管理网络，这里管理网络也承载了API网络的流量，将API网络和管理网络合并，OpenStack各组件通过API网络向用户暴露API服务。
 - 隧道网络（tunnel网络或self-service网络）： 
提供租户虚拟网络的承载网络（VXLAN or   GRE）。openstack里面使用gre或者vxlan模式，需要有隧道网络；隧道网络采用了点到点通信协议代替了交换连接，在openstack里，这个tunnel就是虚拟机走网络数据流量用的。这个网络所承载的网络和官方文档Networking Option 2: Self-service networks相对应。 

 - 外部网络(external网络或者provider网络)：   
openstack网络至少要包括一个外部网络，这个网络能够访问OpenStack安装环境之外的网络，并且非openstack环境中的设备能够访问openstack外部网络的某个IP。另外外部网络为OpenStack环境中的虚拟机提供浮动IP，实现openstack外部网络对内部虚拟机实例的访问。这个网络和官方文档Networking Option 1: Provider networks相对应。

 - 注意，这里没有规划存储平面网络，cinder存储节点使用管理网络承载存储网络数据。

**本次搭建Openstack网络结构图：**
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-16919211066396.png)
**本次搭建环境整体网络图：**
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-16919211097279.png)
**搭建完成后的内部网络图：**
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192111306412.png)

![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192111592815.png)

## 1.3 关闭防火墙
1.关闭selinux

```bash
# sed -i 's/enforcing/disabled/g' /etc/selinux/config
# setenforce 0
```
2.关闭firewalld防火墙
```bash
# systemctl stop firewalld.service && systemctl disable firewalld.service
# firewall-cmd --state  #查看是否关闭
```
## 1.4 配置yum源

> **以下操作在所有节点执行**

配置国内阿里云yum源以获取更快的下载速度：

1.备份CentOS官方源：

```bash
# mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

2.下载阿里云yum源：

```
# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

3.测试yum源是否正常

```bash
# yum clean all && yum makecache
```
也可以搭建本地yum源，参考链接：https://blog.csdn.net/networken/article/details/80729234

## 1.5 配置节点IP
1.控制节点网络配置：

```bash
[root@controller ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens33
ONBOOT=yes
#####################
IPADDR=192.168.90.70
PREFIX=24
[root@controller ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens37
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens37
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens37
ONBOOT=yes
#####################
IPADDR=192.168.91.70
PREFIX=24
[root@controller ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens38
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens38
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens38
ONBOOT=yes
#####################
IPADDR=192.168.92.70
PREFIX=24
GATEWAY=192.168.92.2
DNS1=114.114.114.114
DNS2=1.1.1.1

[root@controller ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:cb:a5:19 brd ff:ff:ff:ff:ff:ff
    inet 192.168.90.70/24 brd 192.168.90.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::2801:f5c2:4e5a:d003/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
3: ens37: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:cb:a5:23 brd ff:ff:ff:ff:ff:ff
    inet 192.168.91.70/24 brd 192.168.91.255 scope global noprefixroute ens37
       valid_lft forever preferred_lft forever
    inet6 fe80::8af8:8b5c:793f:e719/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
4: ens38: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:cb:a5:2d brd ff:ff:ff:ff:ff:ff
    inet 192.168.92.70/24 brd 192.168.92.255 scope global noprefixroute ens38
       valid_lft forever preferred_lft forever
    inet6 fe80::e8d3:6442:89c0:cd4a/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```

2.计算节点网络配置：

```
[root@compute1 ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens33
ONBOOT=yes
#####################
IPADDR=192.168.90.71
PREFIX=24
[root@compute1 ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens37
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens37
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens37
ONBOOT=yes
#####################
IPADDR=192.168.91.71
PREFIX=24
[root@compute1 ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens38
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens38
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens38
ONBOOT=yes
#####################
IPADDR=192.168.92.71
PREFIX=24
GATEWAY=192.168.92.2
DNS1=114.114.114.114
DNS2=1.1.1.1

[root@compute1 ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:c7:ba:9b brd ff:ff:ff:ff:ff:ff
    inet 192.168.90.71/24 brd 192.168.90.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::ffb5:9b12:f911:89ec/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::b01a:e132:1923:175/64 scope link tentative noprefixroute dadfailed 
       valid_lft forever preferred_lft forever
    inet6 fe80::2801:f5c2:4e5a:d003/64 scope link tentative noprefixroute dadfailed 
       valid_lft forever preferred_lft forever
3: ens37: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:c7:ba:a5 brd ff:ff:ff:ff:ff:ff
    inet 192.168.91.71/24 brd 192.168.91.255 scope global noprefixroute ens37
       valid_lft forever preferred_lft forever
    inet6 fe80::e8fe:eea6:f4f:2d85/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::8af8:8b5c:793f:e719/64 scope link tentative noprefixroute dadfailed 
       valid_lft forever preferred_lft forever
4: ens38: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:c7:ba:af brd ff:ff:ff:ff:ff:ff
    inet 192.168.92.71/24 brd 192.168.92.255 scope global noprefixroute ens38
       valid_lft forever preferred_lft forever
    inet6 fe80::e64:a89f:4312:ea34/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::e8d3:6442:89c0:cd4a/64 scope link tentative noprefixroute dadfailed 
       valid_lft forever preferred_lft forever
```

3.存储节点网络配置：

```
[root@cinder1 ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens33
ONBOOT=yes
#####################
IPADDR=192.168.90.72
PREFIX=24
[root@cinder1 ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens37
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens37
#UUID=162a12c5-b271-4a13-865e-0fdb876e64b8
DEVICE=ens37
ONBOOT=yes
#####################
IPADDR=192.168.92.72
PREFIX=24
GATEWAY=192.168.92.2
DNS1=114.114.114.114
DNS2=1.1.1.1

[root@cinder1 ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:97:4f:52 brd ff:ff:ff:ff:ff:ff
    inet 192.168.90.72/24 brd 192.168.90.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::b01a:e132:1923:175/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::2801:f5c2:4e5a:d003/64 scope link tentative noprefixroute dadfailed 
       valid_lft forever preferred_lft forever
3: ens37: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:97:4f:5c brd ff:ff:ff:ff:ff:ff
    inet 192.168.92.72/24 brd 192.168.92.255 scope global noprefixroute ens37
       valid_lft forever preferred_lft forever
    inet6 fe80::8af8:8b5c:793f:e719/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```

4.验证网络是否正常：

```bash
[root@controller ~]# ping –c 4 openstack.org  #控制节点访问互联网
[root@compute1 ~]# ping –c 4 openstack.org    #计算节点访问互联网
[root@cinder1 ~]# ping –c 4 openstack.org     #存储节点访问互联网
[root@controller ~]# ping –c 4 192.168.90.71  #访问计算节点管理网络
[root@controller ~]# ping –c 4 192.168.91.71  #访问计算节点隧道网络
[root@controller ~]# ping –c 4 192.168.92.71  #访问计算节点外部网络
```

## 1.6 配置主机名

控制节点执行：
```bash
[root@localhost ~]# hostnamectl set-hostname controller
```
计算节点执行：
```bash
[root@localhost ~]# hostnamectl set-hostname compute1
```
存储节点执行：
```bash
[root@localhost ~]# hostnamectl set-hostname cinder1
```
所有节点执行，注销账号重新登录，验证主机名是否配置成功： 
```bash
[root@localhost ~]# exit
```

## 1.7	配置主机名解析
所有节点执行，配置相同，注意这里使用管理网络IP地址：

```bash
[root@controller ~]# cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
# controller
192.168.90.70 controller
# compute1
192.168.90.71 compute1
#cinder1
192.168.90.72 cinder1
```

2.验证主机名解析是否正常：

ping计算节点：
```bash
[root@controller ~]# ping -c 4 compute1
PING compute1 (190.168.90.71) 56(84) bytes of data.
64 bytes from compute1 (190.168.90.71): icmp_seq=1 ttl=64 time=0.301 ms
64 bytes from compute1 (190.168.90.71): icmp_seq=2 ttl=64 time=0.990 ms
64 bytes from compute1 (190.168.90.71): icmp_seq=3 ttl=64 time=0.376 ms
64 bytes from compute1 (190.168.90.71): icmp_seq=4 ttl=64 time=0.321 ms

--- compute1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3102ms
rtt min/avg/max/mdev = 0.301/0.497/0.990/0.285 ms
```
ping存储节点：
```bash
[root@controller ~]# ping -c 4 cinder1
PING cinder1 (190.168.90.72) 56(84) bytes of data.
64 bytes from cinder1 (190.168.90.72): icmp_seq=1 ttl=64 time=0.262 ms
64 bytes from cinder1 (190.168.90.72): icmp_seq=2 ttl=64 time=0.388 ms
64 bytes from cinder1 (190.168.90.72): icmp_seq=3 ttl=64 time=1.11 ms
64 bytes from cinder1 (190.168.90.72): icmp_seq=4 ttl=64 time=0.796 ms

--- cinder1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3057ms
rtt min/avg/max/mdev = 0.262/0.640/1.115/0.338 ms
```

## 1.8	配置NTP服务

> **以下在控制节点进行配置**

1.安装软件包：

```bash
[root@controller ~]# yum install chrony
```

2.修改配置文件：

```bash
[root@controller ~]# vim /etc/chrony.conf
allow 192.168.0.0/16  去掉注释，允许其他节点网段同步时间，请配置为对应网段
```

3.重启服务并加入开机启动项：

```bash
[root@controller ~]# systemctl enable chronyd.service && systemctl start chronyd.service
```

4查看时间同步状态:
MS列中包含^*的行，指明NTP服务当前同步的服务器。当前同步的源为time5.aliyun.com：

```bash
[root@controller ~]# chronyc sources      
210 Number of sources = 4
MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^? 85.199.214.101                1   6     3    36    -24ms[  -24ms] +/-  114ms
^* time5.aliyun.com              2   6    77    37  +4343us[  +22ms] +/-   43ms
^- ntp1.ams1.nl.leaseweb.net     2   6    77    35    -43ms[  -43ms] +/-  367ms
^? ntp.de.fdw.no                 0   8     0     -     +0ns[   +0ns] +/-    0ns
```

5.查看当前时间是否准确，其中NTP synchronized: yes说明同步成功

```
[root@controller ~]# timedatectl 
      Local time: Fri 2018-06-08 10:36:39 CST
  Universal time: Fri 2018-06-08 8:36:39 UTC
        RTC time: Fri 2018-06-08 8:36:39
       Time zone: Asia/Shanghai (CST, +0800)
     NTP enabled: yes
NTP synchronized: yes
 RTC in local TZ: no
      DST active: n/a
```

> **以下在计算节点进行配置：**

1.安装软件包：

```bash
[root@compute1 ~]# yum install chrony
```

2.修改配置文件，使计算节点与控制节点同步时间：

```bash
[root@compute1 ~]# vim /etc/chrony.conf   #注释3-6行，并增加第7行内容
  1 # Use public servers from the pool.ntp.org project.
  2 # Please consider joining the pool (http://www.pool.ntp.org/join.html).
  3 #server 0.centos.pool.ntp.org iburst
  4 #server 1.centos.pool.ntp.org iburst
  5 #server 2.centos.pool.ntp.org iburst
  6 #server 3.centos.pool.ntp.org iburst
  7 server 192.168.92.70 iburst
```

3.重启服务并设置开机启动

```bash
[root@compute1 ~]# systemctl enable chronyd.service && systemctl start chronyd.service
```

4.查看时间同步状态，当前同步的源为controller
```bash
[root@compute1 ~]# chronyc sources
210 Number of sources = 1
MS Name/IP address         Stratum Poll Reach LastRx Last sample               

^* controller                    3   6   377    21  +7732us[+9937us] +/-   24ms
```
5.查看时间是否与控制节点一致 
```bash
[root@compute1 ~]# timedatectl
      Local time: Sat 2018-06-09 10:09:32 CST
  Universal time: Fri 2018-06-08 8:09:32 UTC
        RTC time: Fri 2018-06-08 8:09:32
       Time zone: Asia/Shanghai (CST, +0800)
     NTP enabled: yes
NTP synchronized: yes
 RTC in local TZ: no
      DST active: n/a
```

> **存储节点配置同计算节点，这里省略**

NTP的其他操作命令：
```bash
# timedatectl set-ntp yes                 #启用ntp同步服务
# timedatectl set-timezone Asia/Shanghai  #设置时区
# yum install –y ntpdate                  #安装时间同步工具
# ntpdate 0.centos.pool.ntp.org           #强制与网络NTP服务器同步时间
# ntpdate 192.168.92.70                   #强制与控制节点同步时间
```

注意：各个节点时间不同步后续可能出现各种问题，建议配置准确在进行后续操作。

# 2.安装基础软件包

## 2.1	安装OpenStack软件包


> **以下操作在所有节点执行**

1.启用OpenStack存储库，安装queens版本的存储库

```bash
# yum install centos-release-openstack-queens
```

2.升级所有软件包，如果升级后内核更新，请重启节点启用新内核。

```bash
# yum upgrade
```

3.安装openstack客户端

```bash
# yum install python-openstackclient
```

4.安装 openstack-selinux软件包以自动管理OpenStack服务的安全策略：

```bash
# yum install openstack-selinux
```

## 2.2	安装mariadb数据库


> **以下操作在控制节点执行**

大多数OpenStack服务使用SQL数据库来存储信息。数据库通常在控制器节点上运行。本次搭建使用MariaDB数据库， OpenStack服务还支持其他SQL数据库，包括 PostgreSQL等。

1.安装软件包

```bash
# yum install mariadb mariadb-server python2-PyMySQL
```

2.创建并编辑/etc/my.cnf.d/openstack.cnf文件并完成以下操作：

配置以下内容， bind-address设置为控制节点的管理IP地址，以使其他节点能够通过管理网络进行访问：
```bash
[root@controller ~]# vim /etc/my.cnf.d/openstack.cnf    
[mysqld]
bind-address = 192.168.90.70
default-storage-engine = innodb
innodb_file_per_table = on
max_connections = 4096
collation-server = utf8_general_ci
character-set-server = utf8
```

3.启动数据库服务并设置服务开机启动：

```bash
# systemctl start mariadb.service && systemctl enable mariadb.service 
```

4.运行mysql_secure_installation 脚本初始化数据库服务，并为数据库root帐户设置密码(这里设为123456)：

```bash
[root@controller ~]# mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we'll need the current
password for the root user.  If you've just installed MariaDB, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.

Enter current password for root (enter for none): 
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.

Set root password? [Y/n] Y
New password: 
Re-enter new password: 
Password updated successfully!
Reloading privilege tables..
 ... Success!


By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] Y
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] Y
 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] Y
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] Y
 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
```

## 2.3	安装RabbitMQ消息队列

> **以下在控制节点执行**

OpenStack使用消息队列（Message queue）来协调服务之间的操作和状态信息，消息队列服务通常在控制节点上运行，OpenStack支持多种消息队列服务，包括RabbitMQ， Qpid和ZeroMQ。

1．安装软件包：

```bash
# yum install rabbitmq-server
```

2.启动消息队列服务并设置服务开机启动

```bash
# systemctl enable rabbitmq-server.service && systemctl start rabbitmq-server.service
```

3.添加openstack 用户，并设置密码，这里设置为123456

```bash
# rabbitmqctl add_user openstack 123456
```
4.为openstack用户增加配置、读取及写入相关权限

```bash
# rabbitmqctl set_permissions openstack ".*" ".*" ".*"
Setting permissions for user "openstack" in vhost "/" ...
```

## 2.4	安装Memcached缓存数据库


> **以下在控制节点执行**

身份认证服务使用Memcached缓存令牌，memcached服务通常在控制节点上运行。
1.安装软件包

```bash
# yum install memcached python-memcached
```

2.编辑/etc/sysconfig/memcached文件并完成以下操作：
使用控制节点的管理IP地址配置服务。这使其他节点能够通过管理网络进行访问：

```bash
[root@controller ~]# vim  /etc/sysconfig/memcached
PORT="11211"
USER="memcached"
MAXCONN="1024"
CACHESIZE="64"
OPTIONS="-l 192.168.90.70,::1"    #增加一行
```

3.启动Memcached服务并将其配置为在系统引导时启动：

```bash
# systemctl enable memcached.service && systemctl start memcached.service
```

## 2.5	安装Etcd服务


> **以下操作在控制节点执行**

OpenStack服务可能使用Etcd，这是一个可靠的分布式键值存储，用于分布式密钥锁定，存储配置，跟踪服务的实时性和其他场景。
1.安装软件包

```bash
[root@controller ~]# yum install etcd
```

2.编辑/etc/etcd/etcd.conf文件，以控制节点管理IP地址设置相关选项，以使其他节点通过管理网络进行访问
```bash
[root@controller ~]# vim /etc/etcd/etcd.conf
#[Member]
#ETCD_CORS=""
ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
#ETCD_WAL_DIR=""
ETCD_LISTEN_PEER_URLS="http://192.168.90.70:2380"
ETCD_LISTEN_CLIENT_URLS="http://192.168.90.70:2379"
#ETCD_MAX_SNAPSHOTS="5"
#ETCD_MAX_WALS="5"
ETCD_NAME="controller"
#ETCD_SNAPSHOT_COUNT="100000"
#ETCD_HEARTBEAT_INTERVAL="100"
#ETCD_ELECTION_TIMEOUT="1000"
#ETCD_QUOTA_BACKEND_BYTES="0"
#ETCD_MAX_REQUEST_BYTES="1572864"
#ETCD_GRPC_KEEPALIVE_MIN_TIME="5s"
#ETCD_GRPC_KEEPALIVE_INTERVAL="2h0m0s"
#ETCD_GRPC_KEEPALIVE_TIMEOUT="20s"
#
#[Clustering]
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.90.70:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://192.168.90.70:2379"
#ETCD_DISCOVERY=""
#ETCD_DISCOVERY_FALLBACK="proxy"
#ETCD_DISCOVERY_PROXY=""
#ETCD_DISCOVERY_SRV=""
ETCD_INITIAL_CLUSTER="controller=http://192.168.90.70:2380"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster-01"
ETCD_INITIAL_CLUSTER_STATE="new"
#ETCD_STRICT_RECONFIG_CHECK="true"
#ETCD_ENABLE_V2="true"
```

3.启动etcd服务并设为开机启动：

```bash
[root@controller ~]# systemctl enable etcd && systemctl start etcd
```

# 3	安装OpenStack服务

1.Openstack Queens部署时至少需要安装以下服务，按照下面指定的顺序安装服务：

 - 认证服务（Identity service）– keystone installation for Queens

 - 镜像服务（Image service）– glance installation for Queens
 - 计算服务（Compute service）– nova installation for Queens
 - 网络服务（Networking service）– neutron installation for Queens

2.我们建议在最小部署以上服务后也安装以下组件：

 - 仪表盘（Dashboard）– horizon installation for Queens
 - 块存储服务（Block Storage service）– cinder installation for Queens

## 3.1	安装keystone服务


> **以下在控制节点执行**

本节描述如何在控制节点上安装和配置OpenStack身份认证服务，即称为keystone。出于可扩展性的目的，此配置部署了Fernet tokens和Apache HTTP服务器来处理请求。

### 3.1.1	认证服务概述


&emsp;OpenStack认证服务提供单一的集成点，用于管理身份验证、授权和服务目录。
&emsp;认证服务通常是用户与之交互的第一个服务。一旦经过身份验证，最终用户可以使用其身份来访问其他OpenStack服务。同样，其他OpenStack服务利用认证服务来确保用户是他们本人，并且发现部署中的其他服务在哪里。认证服务还可以与一些外部用户管理系统（如LDAP）集成。
&emsp;用户和服务可以通过使用由认证服务管理的服务目录来定位其他服务。顾名思义，服务目录是OpenStack部署中可用服务的集合。每个服务可以有一个或多个端点，每个端点可以是三种类型之一：管理员、内部或公共。在生产环境中，出于安全原因，不同的端点类型可能驻留在暴露给不同类型用户的单独网络上。例如，公共API网络可能从因特网上可见，因此客户可以管理他们的云。管理API网络可能局限于管理云基础设施的组织内的操作员。内部API网络可能局限于包含OpenStack服务的主机。此外，OpenStack支持多个区域的可扩展性。为了简单起见，本指南使用管理网络来实现所有端点类型和默认的TrimOne区域。在认证服务中创建的区域、服务和端点一起构成部署的服务目录。部署中的每个OpenStack服务需要一个服务条目，其中存储在标识服务中的相应端点。这一切都可以在认证服务安装和配置之后完成。
认证服务包含这些组件：
**Server**
一个中央服务器使用RESTful接口提供认证和授权服务。
**Drivers**
驱动程序或服务后端集成到中央服务器。它们用于访问OpenStack外部的库中的身份信息，并且可能已经存在于部署OpenStack的基础设施中（例如，SQL数据库或LDAP服务器）。
**Modules**
中间件模块运行在使用认证服务的OpenStack组件的地址空间中。这些模块拦截服务请求，提取用户凭据，并将其发送到集中式服务器进行授权。中间件模块和OpenStack组件之间的集成使用Python Web服务器网关接口。

### 3.1.2	安装和配置keystone
**创建keystone数据库**

1.以root用户连接到数据库服务器：

```bash
$ mysql -u root -p
```

2.创建keystone数据库：

```bash
MariaDB [(none)]> CREATE DATABASE keystone;
```

3.授予keystone数据库适当的访问权限：

```bash
MariaDB [(none)]> GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'localhost' \
IDENTIFIED BY '123456';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%' \
IDENTIFIED BY '123456';
```

注意：这里密码设置为123456

**安装和配置keystone组件**

1.安装软件包

```bash
# yum install openstack-keystone httpd mod_wsgi
```

2.编辑并修改/etc/keystone/keystone.conf配置文件
```bash
[root@controller ~]# vim /etc/keystone/keystone.conf
```
在 [database]部分, 配置数据库访问权限:
```bash
[database]
# ...
connection = mysql+pymysql://keystone:123456@controller/keystone
```
注意这里的密码为123456

在[token] 部分, 配置Fernet token provider
```bash
[token]
# ...
provider = fernet
```

3.同步认证服务数据库：

```bash
# su -s /bin/sh -c "keystone-manage db_sync" keystone
```

4.初始化Fernet key库：

```bash
# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone
```

5.引导身份认证服务：

```bash
# keystone-manage bootstrap --bootstrap-password 123456 \
  --bootstrap-admin-url http://controller:35357/v3/ \
  --bootstrap-internal-url http://controller:5000/v3/ \
  --bootstrap-public-url http://controller:5000/v3/ \
  --bootstrap-region-id RegionOne
```

替换ADMIN_PASS为管理用户的合适密码，这里为123456

**配置apache http服务**

1.编辑/etc/httpd/conf/httpd.conf文件并配置ServerName选项以引用控制节点：

```bash
[root@controller ~]# vim /etc/httpd/conf/httpd.conf
ServerName controller
```

2.创建到/usr/share/keystone/wsgi-keystone.conf文件的链接：

```bash
[root@controller ~]# ln -s /usr/share/keystone/wsgi-keystone.conf /etc/httpd/conf.d/
```

3.启动Apache HTTP服务并配置开机启动

```bash
[root@controller ~]# systemctl enable httpd.service && systemctl start httpd.service
```

4.配置administrative 账户

```bash
export OS_USERNAME=admin
export OS_PASSWORD=123456
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://controller:35357/v3
export OS_IDENTITY_API_VERSION=3
```

注意这里admin密码为123456，这里的密码要和keystone-manage bootstrap命令中使用的密码相同
### 3.1.3	创建项目和用户
身份服务为每个OpenStack服务提供身份验证服务。身份验证服务使用域，项目，用户和角色的组合（domain, projects, users, and roles）。
1.创建域,尽管上面keystone-manage bootstrap步骤已经存在“default”域，但创建新域的正式方法是：

```bash
[root@controller ~]# openstack domain create --description "Domain" example           
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Domain                           |
| enabled     | True                             |
| id          | 2cb7b71c381c49179ad106c53fc78f20 |
| name        | example                          |
| tags        | []                               |
+-------------+----------------------------------+
```

2.创建服务项目，本指南使用一个服务项目，其中包含您添加到环境中的每项服务的唯一用户。

[root@controller ~]# openstack project create - -domain default \
 - -description "Service Project" service

```bash
[root@controller ~]# openstack project create --domain default \
>   --description "Service Project" service
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Service Project                  |
| domain_id   | default                          |
| enabled     | True                             |
| id          | 2699a653508e4300946837b129c3dcac |
| is_domain   | False                            |
| name        | service                          |
| parent_id   | default                          |
| tags        | []                               |
+-------------+----------------------------------+
```

3.创建平台demon项目，普通（非管理员）任务应该使用非特权项目和用户。 作为示例，这里创建演示项目和用户。创建演示项目：
[root@controller ~]# openstack project create - -domain default \
   - -description "Demo Project" demo

执行结果：
```bash
[root@controller ~]# openstack project create --domain default \
>   --description "Demo Project" demo
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Demo Project                     |
| domain_id   | default                          |
| enabled     | True                             |
| id          | f3f0c1a2a9f74aa6ac030671f4c7ec33 |
| is_domain   | False                            |
| name        | demo                             |
| parent_id   | default                          |
| tags        | []                               |
+-------------+----------------------------------+
```

4.创建demo用户
[root@controller ~]# openstack user create - -domain default \
- -password-prompt demo

执行结果：
```bash
[root@controller ~]# openstack user create --domain default \
>   --password-prompt demo
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | a331e97f2ac6444484371a70e1299636 |
| name                | demo                             |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
```

5.创建用户角色：

```bash
[root@controller ~]# openstack role create user
+-----------+----------------------------------+
| Field     | Value                            |
+-----------+----------------------------------+
| domain_id | None                             |
| id        | 8e50219ae4a44daea5fba43dc3a3bdbc |
| name      | user                             |
+-----------+----------------------------------+
```

6.将用户角色添加到demo项目和用户：

```bash
$ openstack role add --project demo --user demo user
```

注意：该命令没有输出，另外您可以重复此过程来创建其他项目和用户。
### 3.1.4	验证认证服务操作
1.取消设置临时OS_AUTH_URL和OS_PASSWORD环境变量：

```bash
$ unset OS_AUTH_URL OS_PASSWORD
```

2.作为管理员用户，请求身份验证令牌

``` bash
[root@controller ~]# openstack --os-auth-url http://controller:35357/v3 \
--os-project-domain-name Default --os-user-domain-name Default \
--os-project-name admin --os-username admin token issue ```
```
执行结果：
```bash
[root@controller ~]# openstack --os-auth-url http://controller:35357/v3 \
>   --os-project-domain-name Default --os-user-domain-name Default \
>   --os-project-name admin --os-username admin token issue
Password: 
+------------+-----------------------------------------------------------------------
| Field      | Value                                                                                                                                                                                   |
+------------+-----------------------------------------------------------------------
| expires    | 2018-06-09T04:16:32+0000                                                                                                                                                                |
| id         | gAAAAABbG0aQ7FW5iNpQsV6GeG3MScdTa-5R1X6P50quK1upikbaaRjGLyHjJ9DGAhYxwIRS5EQbFowGM48ihU--S5okbkP97my7WftHu3R13KV1aOClwT9zYKPziyoHuL4jUKLABtxAfDktz4He1BDrzA5EuQUnFlVTIv6plTWUJQUVHIpSGGs |
| project_id | 9a8169bc534e4705816e97bff4d2866b                                                                                                                                                        |
| user_id    | fd008b033f4f48e2a17fc88686d89e88                                                                                                                                                        |
+------------+-----------------------------------------------------------------------
```

3.作为demo用户，请求身份验证令牌：
[root@controller ~]# openstack --os-auth-url http://controller:5000/v3 \
 - -os-project-domain-name Default --os-user-domain-name Default \
- -os-project-name demo --os-username demo token issue

执行结果：

```bash
[root@controller ~]# openstack --os-auth-url http://controller:5000/v3 \
>   --os-project-domain-name Default --os-user-domain-name Default \
>   --os-project-name demo --os-username demo token issue
Password: 
+------------+-----------------------------------------------------------------------
| Field      | Value                                                                                                                                                                                   |
+------------+-----------------------------------------------------------------------
| expires    | 2018-06-09T04:17:53+0000                                                                                                                                                                |
| id         | gAAAAABbG0bhmKyZk9WcBA79JucaEcdhkKh0Da5Fu1QfyukeajZEfHPb3ElV1wuRzn59qeL0Oz-AbzScWWodoAYiYRuRFPCL1aesbItKeBGDFSbd54bng4lsHmqSMmZ-lViOEkAZAcKNAU5Tp-sd4LmGSMsHC2mgffhjOFim4gcLFoWVT2Kq2u8 |
| project_id | f3f0c1a2a9f74aa6ac030671f4c7ec33                                                                                                                                                        |
| user_id    | a331e97f2ac6444484371a70e1299636                                                                                                                                                        |
+------------+-----------------------------------------------------------------------
```

注意：此命令使用演示用户和API端口5000的密码，该端口只允许对Identity Service API进行常规（非管理员）访问。

### 3.1.5	创建客户端环境脚本

前面几节使用了环境变量和命令选项的组合，通过openstack客户端与Identity服务进行交互。 为了提高客户端操作的效率，OpenStack支持简单的客户端环境脚本，也称为OpenRC文件。 这些脚本通常包含所有客户端的常用选项，但也支持独特的选项。 
**创建脚本**
为管理员和演示项目和用户创建客户端环境脚本。后续所有操作将引用这些脚本来为客户端操作加载适当的凭据。
1.创建并编辑admin-openrc文件并添加以下内容：

```bash
[root@controller ~]# vim admin-openrc
export OS_PROJECT_DOMAIN_NAME=Default
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_NAME=admin
export OS_USERNAME=admin
export OS_PASSWORD=123456
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2
```

注意这里的admin用户密码为123456，替换为您在Identity Service中为admin用户设置的密码。

2.创建并编辑demo-openrc文件并添加以下内容：

```bash
[root@controller ~]# vim demo-openrc
export OS_PROJECT_DOMAIN_NAME=Default
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_NAME=demo
export OS_USERNAME=demo
export OS_PASSWORD=123456
export OS_AUTH_URL=http://controller:5000/v3
export OS_IDENTITY_API_VERSION=3
export OS_IMAGE_API_VERSION=2
```

注意这里的demo用户密码为123456，替换为您在Identity Service中为demo用户设置的密码。
完成以后如下，我这里创建在/root目录下：
```bash
[root@controller ~]# ll
-rw-r--r--  1 root root  262 Jun  9 11:20 admin-openrc
-rw-r--r--  1 root root  259 Jun  9 11:22 demo-openrc
```
**使用脚本**
要以特定项目和用户身份运行客户端，只需在运行客户端环境脚本之前加载相关的客户端环境脚本即可。 例如：

1.加载admin-openrc文件以使用Identity服务的位置以及管理项目和用户凭据执行环境变量：

```bash
[root@controller ~]# . admin-openrc
Request an authentication token:
```

2.请求身份验证令牌：

```bash
[root@controller ~]# openstack token issue
+------------+-----------------------------------------------------------------------
| Field      | Value                                                                                                                                                                                   |
+------------+-----------------------------------------------------------------------
| expires    | 2018-06-09T04:25:27+0000                                                                                                                                                                |
| id         | gAAAAABbG0inBBbRy30qPo674Pg5b6bxWNqRvtaOtc4j4U_88qtk_4U9xViPO3au2e_cGQw8s7b0mst9abScy6dEUVsEzQ042XgYnxarB-V7mAVXUevJCn9OV-FQdMlULZXcM0d4w4iVosOLpLdfsS27ZsVwYs_-r1_AohNGKAYAN2g77AOE_OY |
| project_id | 9a8169bc534e4705816e97bff4d2866b                                                                                                                                                        |
| user_id    | fd008b033f4f48e2a17fc88686d89e88                                                                                                                                                        |
+------------+-----------------------------------------------------------------------
```

## 3.2	安装Glance服务

> **以下操作在控制节点执行**

本节介绍如何在控制节点上安装和配置镜像服务，即glance。 为了简单起见，该配置将镜像存储在本地文件系统上。

### 3.2.1	镜像服务概述
&emsp;镜像服务（glance）使用户能够发现，注册和检索虚拟机镜像。 它提供了一个REST API，使您可以查询虚拟机镜像元数据并检索实际镜像。 您可以将通过镜像服务提供的虚拟机映像存储在各种位置，从简单的文件系统到对象存储系统（如OpenStack对象存储）。
&emsp;为了简单起见，本指南描述了将Image服务配置为使用文件后端，该后端上载并存储在托管Image服务的控制节点上的目录中。 默认情况下，该目录是/ var / lib / glance / images /。
OpenStack Image服务是基础架构即服务（IaaS）的核心。 它接受磁盘或服务器映像的API请求，以及来自最终用户或OpenStack Compute组件的元数据定义。 它还支持在各种存储库类型（包括OpenStack对象存储）上存储磁盘或服务器映像。
**OpenStack镜像服务包括以下组件：**

**glance-api** 
接受镜像API调用以进行镜像发现，检索和存储。

**glance-registry**
存储，处理和检索有关镜像的元数据。 元数据包括例如大小和类型等项目。

**Database**
存储镜像元数据，您可以根据自己的喜好选择数据库。 大多数部署使用MySQL或SQLite。

**Storage repository for image files（镜像文件的存储库）**
支持各种存储库类型，包括常规文件系统（或安装在glance-api控制节点上的任何文件系统），Object Storage，RADOS块设备，VMware数据存储和HTTP。 请注意，某些存储库仅支持只读用法。

**Metadata definition service（元数据定义服务）**
用于供应商，管理员，服务和用户的通用API来有意义地定义他们自己的定制元数据。 此元数据可用于不同类型的资源，如镜像，开发，卷，定制和聚合。 定义包括新属性的关键字，描述，约束和它可以关联的资源类型。

### 3.2.2	创建glance数据库
1.创建glance数据库 
以root用户连接到数据库：

```bash
# mysql -u root -p
```
创建glance数据库：

```bash
MariaDB [(none)]> CREATE DATABASE glance;
```

授予对glance数据库的正确访问权限：

```bash
MariaDB [(none)]> GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'localhost' \
  IDENTIFIED BY '123456';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON glance.* TO 'glance'@'%' \
  IDENTIFIED BY '123456';
```

2.获取admin用户的环境变量

```bash
$ . admin-openrc
```

3.要创建服务凭据，请完成以下步骤
创建glance用户：

```bash
[root@controller ~]#  openstack user create --domain default --password-prompt glance
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | 5480c338e19f42e59b35c7965d950fa6 |
| name                | glance                           |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+

```

把admin角色添加到glance用户和项目中

```bash
$ openstack role add --project service --user glance admin
```

说明：此条命令执行不返回信息
创建glance服务实体：



```bash
[root@controller ~]# openstack service create --name glance \
--description "OpenStack Image" image
```
执行结果：

```bash
[root@controller ~]# openstack service create --name glance --description "OpenStack Image" image
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Image                  |
| enabled     | True                             |
| id          | f776846b998a41859d7f93cac56cf4c0 |
| name        | glance                           |
| type        | image                            |
+-------------+----------------------------------+
```

4.创建镜像服务API端点
```bash
[root@controller ~]# openstack endpoint create --region RegionOne \
image public http://controller:9292
[root@controller ~]# openstack endpoint create --region RegionOne \
image internal http://controller:9292
[root@controller ~]# openstack endpoint create --region RegionOne \
image admin http://controller:9292
```



执行结果：

```bash
[root@controller ~]# openstack endpoint create --region RegionOne image public http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 253e29a9b76648b1919d374eb10e152f |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | f776846b998a41859d7f93cac56cf4c0 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   image internal http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | a4e5834004af45279b20008f16bcb4b9 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | f776846b998a41859d7f93cac56cf4c0 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   image admin http://controller:9292
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 46707abe74924e5096b150b70056247c |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | f776846b998a41859d7f93cac56cf4c0 |
| service_name | glance                           |
| service_type | image                            |
| url          | http://controller:9292           |
+--------------+----------------------------------+
```

### 3.2.3	安装和配置组件

1.安装软件包：

```bash
# yum install openstack-glance
```

2.编辑/etc/glance/glance-api.conf文件，完成以下操作
```bash
# vim /etc/glance/glance-api.conf
```
在[database] 部分，配置数据库访问：

```bash
[database]
#..
connection = mysql+pymysql://glance:123456@controller/glance
```

在[keystone_authtoken] and [paste_deploy]部分,配置认证服务访问：

```bash
[keystone_authtoken]

auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = glance
password = 123456

[paste_deploy]

flavor = keystone
```

在 [glance_store]部分, 配置本地文件系统存储和映像文件的位置：

```bash
[glance_store]

stores = file,http
default_store = file
filesystem_store_datadir = /var/lib/glance/images/
```

3.编辑/etc/glance/glance-registry.conf配置文件

```bash
# vim /etc/glance/glance-registry.conf
```

在[database]部分, 配置数据库访问：

```bash
[database]

connection = mysql+pymysql://glance:123456@controller/glance
```

在[keystone_authtoken] 和 [paste_deploy] 部分, 配置认证服务访问：

```bash
[keystone_authtoken]

auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = glance
password = 123456

[paste_deploy]

flavor = keystone
```

4.同步镜像服务数据库

```bash
# su -s /bin/sh -c "glance-manage db_sync" glance
```

5.完成安装,启动镜像服务并设为开机启动：

```bash
# systemctl enable openstack-glance-api.service \
  openstack-glance-registry.service
# systemctl start openstack-glance-api.service \
  openstack-glance-registry.service
```

### 3.2.4	验证操作

使用CirrOS验证Image服务的操作，这是一个小型Linux映像，可帮助您测试OpenStack部署。
有关如何下载和构建映像的更多信息，请参阅OpenStack虚拟机映像指南https://docs.openstack.org/image-guide/。有关如何管理映像的信息，请参阅OpenStack最终用户指南https://docs.openstack.org/queens/user/

1.获取admin用户的环境变量

```bash
# . admin-openrc
```

2.下载镜像

```bash
# wget http://download.cirros-cloud.net/0.4.0/cirros-0.4.0-x86_64-disk.img
```

3.将镜像上传到image服务，指定磁盘格式为QCOW2，指定裸容器格式和公开可见性，以便所有项目都可以访问它：

```bash
[root@controller ~]# openstack image create "cirros" --file cirros-0.4.0-x86_64-disk.img --disk-format qcow2 --container-format bare --public
```

执行结果：
```bash
[root@controller ~]# openstack image create "cirros" \
>   --file cirros-0.4.0-x86_64-disk.img \
>   --disk-format qcow2 --container-format bare \
>   --public
+------------------+------------------------------------------------------+
| Field            | Value                                                |
+------------------+------------------------------------------------------+
| checksum         | 443b7623e27ecf03dc9e01ee93f67afe                     |
| container_format | bare                                                 |
| created_at       | 2018-06-09T07:25:34Z                                 |
| disk_format      | qcow2                                                |
| file             | /v2/images/de140769-4ce3-4a1b-9651-07a915b21caa/file |
| id               | de140769-4ce3-4a1b-9651-07a915b21caa                 |
| min_disk         | 0                                                    |
| min_ram          | 0                                                    |
| name             | cirros                                               |
| owner            | 9a8169bc534e4705816e97bff4d2866b                     |
| protected        | False                                                |
| schema           | /v2/schemas/image                                    |
| size             | 12716032                                             |
| status           | active                                               |
| tags             |                                                      |
| updated_at       | 2018-06-09T07:25:34Z                                 |
| virtual_size     | None                                                 |
| visibility       | public                                               |
+------------------+------------------------------------------------------+
```

3.查看上传的镜像，镜像状态应为active状态

```bash
[root@controller ~]# openstack image list
+--------------------------------------+--------+--------+
| ID                                   | Name   | Status |
+--------------------------------------+--------+--------+
| de140769-4ce3-4a1b-9651-07a915b21caa | cirros | active |
+--------------------------------------+--------+--------+
```

glance具体配置选项可参考：
https://docs.openstack.org/glance/queens/configuration/index.html

## 3.3	安装compute服务

本节介绍如何在控制节点上安装和配置计算服务，代号为nova 
### 3.3.1	计算服务概述

&emsp;使用OpenStack Compute来托管和管理云计算系统。OpenStack Compute是基础架构即服务（IaaS）系统的重要组成部分。主要模块是用Python实现的。
&emsp;OpenStack Compute与OpenStack Identity进行交互以进行身份验证; 用于磁盘和服务器映像的OpenStack映像服务; 和用于用户和管理界面的OpenStack Dashboard。镜像访问受到项目和用户的限制; 每个项目的限额是有限的（例如，实例的数量）。OpenStack Compute可以在标准硬件上水平扩展，并下载映像以启动实例。
**OpenStack Compute包含以下内容及组件：**
**nova-api service**
接受并响应最终用户计算API调用。该服务支持OpenStack Compute API。它执行一些策略并启动大多数编排活动，例如运行实例。
**nova-api-metadata service**
接受来自实例的元数据请求。nova-api-metadata通常在nova-network 安装多主机模式下运行时使用该服务。有关详细信息，请参阅计算管理员指南中的元数据服务。
**nova-compute service**
通过管理程序API创建和终止虚拟机实例的工作守护程序。例如：

 - XenAPI for XenServer/XCP
 - libvirt for KVM or QEMU
 - VMwareAPI for VMware

处理相当复杂。基本上，守护进程接受来自队列的动作并执行一系列系统命令，例如启动KVM实例并更新其在数据库中的状态。
**nova-placement-api service**
跟踪每个提供者的库存和使用情况。有关详情，请参阅 Placement API。
**nova-scheduler service**
从队列中获取虚拟机实例请求，并确定它在哪个计算服务器主机上运行。
**nova-conductor module**
调解nova-compute服务和数据库之间的交互。它消除了由nova-compute服务直接访问云数据库的情况 。该nova-conductor模块水平缩放。但是，请勿将其部署到nova-compute运行服务的节点上。有关更多信息，请参阅配置选项中的conductor部分 。
**nova-consoleauth daemon（守护进程）**
为控制台代理提供的用户授权令牌。见 nova-novncproxy和nova-xvpvncproxy。此服务必须运行以使控制台代理正常工作。您可以在群集配置中针对单个nova-consoleauth服务运行任一类型的代理。有关信息，请参阅关于nova-consoleauth。
**nova-novncproxy daemon**
提供通过VNC连接访问正在运行的实例的代理。支持基于浏览器的novnc客户端。
**nova-spicehtml5proxy daemon**
提供通过SPICE连接访问正在运行的实例的代理。支持基于浏览器的HTML5客户端。
**nova-xvpvncproxy daemon**
提供通过VNC连接访问正在运行的实例的代理。支持OpenStack特定的Java客户端。
**The queue队列**
守护进程之间传递消息的中心集线器。通常用RabbitMQ实现 ，也可以用另一个AMQP消息队列实现，例如ZeroMQ。
**SQL database**
存储云基础架构的大部分构建时间和运行时状态，其中包括：

 - Available instance types  可用的实例类型
 - Instances in use  正在使用的实例
 - Available networks 可用的网络
 - Projects  项目

理论上，OpenStack Compute可以支持SQLAlchemy支持的任何数据库。通用数据库是用于测试和开发工作的SQLite3，MySQL，MariaDB和PostgreSQL。

### 3.3.2	安装和配置控制节点

> **以下在控制节点执行**

#### 3.3.2.1	创建数据库

1.以root账户登录数据库

```bash
# mysql -u root –p
```

2.创建nova_api, nova, nova_cell0数据库

```bash
MariaDB [(none)]> CREATE DATABASE nova_api;
MariaDB [(none)]> CREATE DATABASE nova;
MariaDB [(none)]> CREATE DATABASE nova_cell0;
```

数据库登录授权

```bash
MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'localhost' \
  IDENTIFIED BY '123456';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova_api.* TO 'nova'@'%' \
  IDENTIFIED BY '123456';

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'localhost' \
  IDENTIFIED BY '123456';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova.* TO 'nova'@'%' \
  IDENTIFIED BY '123456';

MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova_cell0.* TO 'nova'@'localhost' \
  IDENTIFIED BY '123456';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON nova_cell0.* TO 'nova'@'%' \
  IDENTIFIED BY '123456';
```

2.执行admin-openrc凭证

```bash
[root@controller ~]# . admin-openrc
```

3.创建计算服务凭证

创建nova用户：

```bash
[root@controller ~]# openstack user create --domain default --password-prompt nova
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | fb6776d19862405ba0c42ec91b6282a0 |
| name                | nova                             |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
```

为nova用户添加admin角色：

```bash
# openstack role add --project service --user nova admin
```

创建nova服务端点：

[root@controller ~]# openstack service create --name nova \

- -description "OpenStack Compute" compute

执行结果：
```bash
[root@controller ~]# openstack service create --name nova \
>   --description "OpenStack Compute" compute
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Compute                |
| enabled     | True                             |
| id          | f162653676dd41a2a4faa98ae64c33f1 |
| name        | nova                             |
| type        | compute                          |
+-------------+----------------------------------+
```

4.创建compute API 服务端点：
```bash
[root@controller ~]# openstack endpoint create --region RegionOne \
   compute public http://controller:8774/v2.1
[root@controller ~]# openstack endpoint create --region RegionOne \
compute admin http://controller:8774/v2.1
[root@controller ~]# openstack endpoint create --region RegionOne \
compute admin http://controller:8774/v2.1
```
执行结果：
```bash
[root@controller ~]# openstack endpoint create --region RegionOne \
>   compute public http://controller:8774/v2.1
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 84b34dc0bedc483990e32c48830368ab |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | f162653676dd41a2a4faa98ae64c33f1 |
| service_name | nova                             |
| service_type | compute                          |
| url          | http://controller:8774/v2.1      |
+--------------+----------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   compute internal http://controller:8774/v2.1
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 2c253051b30444d9807a37bdb05c4c66 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | f162653676dd41a2a4faa98ae64c33f1 |
| service_name | nova                             |
| service_type | compute                          |
| url          | http://controller:8774/v2.1      |
+--------------+----------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   compute admin http://controller:8774/v2.1
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 5aefc27a9f0440e2a95f1189e25f3822 |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | f162653676dd41a2a4faa98ae64c33f1 |
| service_name | nova                             |
| service_type | compute                          |
| url          | http://controller:8774/v2.1      |
+--------------+----------------------------------+
```

5.创建一个placement服务用户

```bash
[root@controller ~]# openstack user create --domain default --password-prompt placement
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | eb7cae6117f74fa6990f8e234efc9c82 |
| name                | placement                        |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
```

6.添加placement用户为项目服务admin角色

```bash
# openstack role add --project service --user placement admin
```
7.在服务目录中创建Placement API条目：
```bash
[root@controller ~]# openstack service create --name placement --description "Placement API" placement
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | Placement API                    |
| enabled     | True                             |
| id          | 656007c5c64d4c3f91fd0dff1a32a754 |
| name        | placement                        |
| type        | placement                        |
+-------------+----------------------------------+
```

8.创建Placement API服务端点

```bash
[root@controller ~]# openstack endpoint create --region RegionOne placement public http://controller:8778
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 4a5b28fe29a94c03a4059d37388f88f1 |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 656007c5c64d4c3f91fd0dff1a32a754 |
| service_name | placement                        |
| service_type | placement                        |
| url          | http://controller:8778           |
+--------------+----------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne placement internal http://controller:8778
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 0f554f27f16c4387ac6a88e9f98697c4 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 656007c5c64d4c3f91fd0dff1a32a754 |
| service_name | placement                        |
| service_type | placement                        |
| url          | http://controller:8778           |
+--------------+----------------------------------+
[root@controller ~]#  openstack endpoint create --region RegionOne placement admin http://controller:8778
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 3aa80b39dc244907a034bf6b4fcd12e2 |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | 656007c5c64d4c3f91fd0dff1a32a754 |
| service_name | placement                        |
| service_type | placement                        |
| url          | http://controller:8778           |
+--------------+----------------------------------+
```

#### 3.3.2.2	安装和配置组件
1.安装软件包

```bash
# yum install openstack-nova-api openstack-nova-conductor \
  openstack-nova-console openstack-nova-novncproxy \
  openstack-nova-scheduler openstack-nova-placement-api
```

2.编辑 /etc/nova/nova.conf文件并完成以下操作	

```bash
# vim /etc/nova/nova.conf
```

在 [DEFAULT] 部分, 只启用计算和元数据API：

```bash
[DEFAULT]
# ...
enabled_apis = osapi_compute,metadata
```

在[api_database] 和 [database] 部分, 配置数据库访问:

```bash
[api_database]
# ...
connection = mysql+pymysql://nova:123456@controller/nova_api

[database]
# ...
connection = mysql+pymysql://nova:123456@controller/nova
```

在 [DEFAULT] 部分, 配置RabbitMQ 消息队列访问:

```bash
[DEFAULT]
# ...
transport_url = rabbit://openstack:123456@controller
```

在[api] 和 [keystone_authtoken] 部分, 配置认证服务访问:

```bash
[api]
# ...
auth_strategy = keystone

[keystone_authtoken]
# ...
auth_url = http://controller:5000/v3
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = nova
password = 123456
```

在[DEFAULT] 部分,使用控制节点的管理接口IP地址配置my_ip选项：

```bash
[DEFAULT]
# ...
my_ip = 192.168.90.70
```

在[DEFAULT] 部分, 启用对网络服务的支持：

```bash
[DEFAULT]
# ...
use_neutron = True
firewall_driver = nova.virt.firewall.NoopFirewallDriver
```
在 [vnc] 部分,使用控制节点的管理接口IP地址配置VNC代理：

```bash
[vnc]
enabled = true
# ...
server_listen = $my_ip
server_proxyclient_address = $my_ip
```

在[glance] 部分, 配置Image服务API的位置：

```bash
[glance]
# ...
api_servers = http://controller:9292
```

在 [oslo_concurrency] 部分, 配置锁定路径：

```bash
[oslo_concurrency]
# ...
lock_path = /var/lib/nova/tmp
```

在 [placement] 部分, 配置 Placement API:

```bash
[placement]
# ...
os_region_name = RegionOne
project_domain_name = Default
project_name = service
auth_type = password
user_domain_name = Default
auth_url = http://controller:5000/v3
username = placement
password = 123456
```

由于软件包的一个bug，需要在/etc/httpd/conf.d/00-nova-placement-api.conf文件中添加如下配置，来启用对Placement API的访问：
```bash
<Directory /usr/bin>
   <IfVersion >= 2.4>
      Require all granted
   </IfVersion>
   <IfVersion < 2.4>
      Order allow,deny
      Allow from all
   </IfVersion>
</Directory>
```
添加配置：
```bash
[root@controller ~]# vim /etc/httpd/conf.d/00-nova-placement-api.conf
Listen 8778

<VirtualHost *:8778>
  WSGIProcessGroup nova-placement-api
  WSGIApplicationGroup %{GLOBAL}
  WSGIPassAuthorization On
  WSGIDaemonProcess nova-placement-api processes=3 threads=1 user=nova group=nova
  WSGIScriptAlias / /usr/bin/nova-placement-api
  <IfVersion >= 2.4>
    ErrorLogFormat "%M"
  </IfVersion>
  ErrorLog /var/log/nova/nova-placement-api.log #这里放在此行之后
  <Directory /usr/bin>
   <IfVersion >= 2.4>
      Require all granted
   </IfVersion>
   <IfVersion < 2.4>
      Order allow,deny
      Allow from all
   </IfVersion>
  </Directory>
  #SSLEngine On
  #SSLCertificateFile ...
  #SSLCertificateKeyFile ...
</VirtualHost>

Alias /nova-placement-api /usr/bin/nova-placement-api
<Location /nova-placement-api>
  SetHandler wsgi-script
  Options +ExecCGI
  WSGIProcessGroup nova-placement-api
  WSGIApplicationGroup %{GLOBAL}
  WSGIPassAuthorization On
</Location>
```


重新启动httpd服务

```bash
 systemctl restart httpd
```

3.同步nova-api数据库

```bash
[root@controller ~]# su -s /bin/sh -c "nova-manage api_db sync" nova
/usr/lib/python2.7/site-packages/oslo_db/sqlalchemy/enginefacade.py:332: NotSupportedWarning: Configuration option(s) ['use_tpool'] not supported
  exception.NotSupportedWarning
```

忽略此输出中的任何弃用消息。

4.注册cell0数据库

```bash
[root@controller ~]# su -s /bin/sh -c "nova-manage cell_v2 map_cell0" nova
/usr/lib/python2.7/site-packages/oslo_db/sqlalchemy/enginefacade.py:332: NotSupportedWarning: Configuration option(s) ['use_tpool'] not supported
  exception.NotSupportedWarning
```

5.创建cell1 cell

```bash
[root@controller ~]# su -s /bin/sh -c "nova-manage cell_v2 create_cell --name=cell1 --verbose" nova
/usr/lib/python2.7/site-packages/oslo_db/sqlalchemy/enginefacade.py:332: NotSupportedWarning: Configuration option(s) ['use_tpool'] not supported
  exception.NotSupportedWarning
f1c7672c-8127-4bc0-9f60-acc5364222dc
```

6.同步nova数据库

```bash
[root@controller ~]# su -s /bin/sh -c "nova-manage db sync" nova
/usr/lib/python2.7/site-packages/oslo_db/sqlalchemy/enginefacade.py:332: NotSupportedWarning: Configuration option(s) ['use_tpool'] not supported
  exception.NotSupportedWarning
/usr/lib/python2.7/site-packages/pymysql/cursors.py:166: Warning: (1831, u'Duplicate index `block_device_mapping_instance_uuid_virtual_name_device_name_idx`. This is deprecated and will be disallowed in a future release.')
  result = self._query(query)
/usr/lib/python2.7/site-packages/pymysql/cursors.py:166: Warning: (1831, u'Duplicate index `uniq_instances0uuid`. This is deprecated and will be disallowed in a future release.')
  result = self._query(query)
```

7.验证 nova、 cell0、 cell1数据库是否注册正确

```bash
[root@controller ~]# nova-manage cell_v2 list_cells
/usr/lib/python2.7/site-packages/oslo_db/sqlalchemy/enginefacade.py:332: NotSupportedWarning: Configuration option(s) ['use_tpool'] not supported
  exception.NotSupportedWarning
+-------+--------------------------------------+------------------------------------
|  Name |                 UUID                 |           Transport URL            |               Database Connection               |
+-------+--------------------------------------+------------------------------------
| cell0 | 00000000-0000-0000-0000-000000000000 |               none:/               | mysql+pymysql://nova:****@controller/nova_cell0 |
| cell1 | f1c7672c-8127-4bc0-9f60-acc5364222dc | rabbit://openstack:****@controller |    mysql+pymysql://nova:****@controller/nova    |
+-------+--------------------------------------+------------------------------------
```

#### 3.3.2.3	完成安装启动服务
启动计算服务并配置为开机启动

```bash
# systemctl enable openstack-nova-api.service \
  openstack-nova-consoleauth.service openstack-nova-scheduler.service \
  openstack-nova-conductor.service openstack-nova-novncproxy.service
# systemctl start openstack-nova-api.service \
  openstack-nova-consoleauth.service openstack-nova-scheduler.service \
  openstack-nova-conductor.service openstack-nova-novncproxy.service
```

### 3.3.3	安装和配置计算节点

> **以下操作在计算节点执行**

#### 3.3.3.1	安装和配置组件
1.安装软件包

```bash
# yum install openstack-nova-compute
```

2.编辑/etc/nova/nova.conf配置文件并完成以下操作

```bash
# vim /etc/nova/nova.conf
```

在[DEFAULT] 部分, 只启用计算和元数据API：

```bash
[DEFAULT]
# ...
enabled_apis = osapi_compute,metadata
```

在[DEFAULT] 部分, 配置RabbitMQ 消息队列访问:

```bash
[DEFAULT]
# ...
transport_url = rabbit://openstack:123456@controller
```

在[api] 和 [keystone_authtoken] 部分, 配置认证服务访问:

```bash
[api]
# ...
auth_strategy = keystone

[keystone_authtoken]
# ...
auth_url = http://controller:5000/v3
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = nova
password = 123456
```

在[DEFAULT] 部分, 配置 my_ip选项:

```bash
[DEFAULT]
# ...
my_ip = 192.168.90.71
```
这里使用计算节点管理IP地址

在 [DEFAULT] 部分, 启用对网络服务的支持：

```bash
[DEFAULT]
# ...
use_neutron = True
firewall_driver = nova.virt.firewall.NoopFirewallDriver
```

在 [vnc] 部分, 启用和配置远程控制台访问：

```bash
[vnc]
# ...
enabled = True
server_listen = 0.0.0.0
server_proxyclient_address = $my_ip
novncproxy_base_url = http://controller:6080/vnc_auto.html
```

服务器组件侦听所有IP地址，并且代理组件只侦听计算节点的管理接口IP地址。 基本URL指示您可以使用Web浏览器访问此计算节点上实例的远程控制台的位置。
如果用于访问远程控制台的Web浏览器驻留在无法解析控制器主机名的主机上，则必须用控制节点的管理接口IP地址替换控制器。

在 [glance] 部分, 配置Image服务API的位置：

```bash
[glance]
# ...
api_servers = http://controller:9292
```

在 [oslo_concurrency]部分, 配置锁定路径：

```bash
[oslo_concurrency]
# ...
lock_path = /var/lib/nova/tmp
```

在 [placement] 部分, 配置 Placement API:

```bash
[placement]
# ...
os_region_name = RegionOne
project_domain_name = Default
project_name = service
auth_type = password
user_domain_name = Default
auth_url = http://controller:5000/v3
username = placement
password = 123456
```

#### 3.3.3.2	完成配置启动服务
1.确定您的计算节点是否支持虚拟机的硬件加速：

```bash
$ egrep -c '(vmx|svm)' /proc/cpuinfo
```

如果此命令返回值为1或更大，则您的计算节点支持通常不需要额外配置的硬件加速。
如果此命令返回零值，则您的计算节点不支持硬件加速，并且您必须配置libvirt才能使用QEMU而不是KVM。**（我这里返回值为2，所有并没有执行下面这一步，配置文件未做任何更改）**
在/etc/nova/nova.conf文件中编辑 [libvirt] 部分:

```bash
# vim /etc/nova/nova.conf
[libvirt]
# ...
virt_type = qemu
```

2.启动计算服务（包括其相关性），并将其配置为在系统引导时自动启动：

```bash
# systemctl enable libvirtd.service openstack-nova-compute.service
# systemctl start libvirtd.service openstack-nova-compute.service
```

注意：如果NOVA计算服务无法启动，检查/var/log/nova/nova-compute.log。控制节点上的错误消息AMQP服务器：5672是不可达的，可能指示控制节点上的防火墙阻止对端口5672的访问。配置防火墙以打开控制节点上的端口5672，并重新启动计算节点上的Nova计算服务。
如果想要清除防火墙规则执行以下命令：
```bash

# iptables -F
# iptables -X
# iptables -Z
```

#### 3.3.3.3	添加compute节点到cell数据库

> **以下在控制节点上执行**

1. 执行admin-openrc，验证有几个计算节点在数据库中

```bash
[root@controller ~]. admin-openrc
[root@controller ~]# openstack compute service list --service nova-compute
+----+--------------+----------+------+---------+-------+----------------------------
| ID | Binary       | Host     | Zone | Status  | State | Updated At                 |
+----+--------------+----------+------+---------+-------+----------------------------+
|  7 | nova-compute | compute1 | nova | enabled | up    | 2018-06-09T16:57:28.000000 |
+----+--------------+----------+------+---------+-------+----------------------------
```

2.发现计算节点

```bash
[root@controller ~]# su -s /bin/sh -c "nova-manage cell_v2 discover_hosts --verbose" nova
/usr/lib/python2.7/site-packages/oslo_db/sqlalchemy/enginefacade.py:332: NotSupportedWarning: Configuration option(s) ['use_tpool'] not supported
  exception.NotSupportedWarning
Found 2 cell mappings.
Skipping cell0 since it does not contain hosts.
Getting computes from cell 'cell1': f1c7672c-8127-4bc0-9f60-acc5364222dc
Checking host mapping for compute host 'compute1': 8ca1dfdc-5ed4-456b-a10e-a74b645fdbf8
Creating host mapping for compute host 'compute1': 8ca1dfdc-5ed4-456b-a10e-a74b645fdbf8
Found 1 unmapped computes in cell: f1c7672c-8127-4bc0-9f60-acc5364222dc
```

添加新计算节点时，必须在控制节点上运行nova-manage cell_v2 discover_hosts以注册这些新计算节点。 或者，您可以在/etc/nova/nova.conf中设置适当的时间间隔：

```bash
[scheduler]
discover_hosts_in_cells_interval = 300
```

### 3.3.4	验证计算服务操作


> **以下操作在控制节点执行**

1.列出服务组件以验证每个进程成功启动和注册：

```bash
[root@controller ~]#. admin-openrc
[root@controller ~]# openstack compute service list
+----+------------------+------------+----------+---------+-------+------------------
| ID | Binary           | Host       | Zone     | Status  | State | Updated At                 |
+----+------------------+------------+----------+---------+-------+------------------
|  1 | nova-consoleauth | controller | internal | enabled | up    | 2018-06-09T17:02:22.000000 |
|  2 | nova-scheduler   | controller | internal | enabled | up    | 2018-06-09T17:02:14.000000 |
|  3 | nova-conductor   | controller | internal | enabled | up    | 2018-06-09T17:02:23.000000 |
|  7 | nova-compute     | compute1   | nova     | enabled | up    | 2018-06-09T17:02:18.000000 |
+----+------------------+------------+----------+---------+-------+------------------
```

此输出应显示在控制节点上启用三个服务组件，并在计算节点上启用一个服务组件。

2.列出身份服务中的API端点以验证与身份服务的连接：

```bash
[root@controller ~]#  openstack catalog list
+-----------+-----------+-----------------------------------------+
| Name      | Type      | Endpoints                               |
+-----------+-----------+-----------------------------------------+
| keystone  | identity  | RegionOne                               |
|           |           |   admin: http://controller:35357/v3/    |
|           |           | RegionOne                               |
|           |           |   public: http://controller:5000/v3/    |
|           |           | RegionOne                               |
|           |           |   internal: http://controller:5000/v3/  |
|           |           |                                         |
| placement | placement | RegionOne                               |
|           |           |   internal: http://controller:8778      |
|           |           | RegionOne                               |
|           |           |   admin: http://controller:8778         |
|           |           | RegionOne                               |
|           |           |   public: http://controller:8778        |
|           |           |                                         |
| nova      | compute   | RegionOne                               |
|           |           |   internal: http://controller:8774/v2.1 |
|           |           | RegionOne                               |
|           |           |   admin: http://controller:8774/v2.1    |
|           |           | RegionOne                               |
|           |           |   public: http://controller:8774/v2.1   |
|           |           |                                         |
| glance    | image     | RegionOne                               |
|           |           |   public: http://controller:9292        |
|           |           | RegionOne                               |
|           |           |   admin: http://controller:9292         |
|           |           | RegionOne                               |
|           |           |   internal: http://controller:9292      |
|           |           |                                         |
+-----------+-----------+-----------------------------------------+
```

3.列出Image服务中的镜像以验证与Image服务的连通性：

```bash
[root@controller ~]# openstack image list
+--------------------------------------+--------+--------+
| ID                                   | Name   | Status |
+--------------------------------------+--------+--------+
| de140769-4ce3-4a1b-9651-07a915b21caa | cirros | active |
+--------------------------------------+--------+--------+
```

4.检查cells和placement API是否正常运行

```bash
[root@controller ~]# nova-status upgrade check
/usr/lib/python2.7/site-packages/oslo_db/sqlalchemy/enginefacade.py:332: NotSupportedWarning: Configuration option(s) ['use_tpool'] not supported
  exception.NotSupportedWarning
Option "os_region_name" from group "placement" is deprecated. Use option "region-name" from group "placement".
+---------------------------+
| Upgrade Check Results     |
+---------------------------+
| Check: Cells v2           |
| Result: Success           |
| Details: None             |
+---------------------------+
| Check: Placement API      |
| Result: Success           |
| Details: None             |
+---------------------------+
| Check: Resource Providers |
| Result: Success           |
| Details: None             |
+---------------------------+
```

nova配置参考：https://docs.openstack.org/nova/queens/admin/index.html
## 3.4	安装neutron服务
### 3.4.1	网络服务概述

&emsp;OpenStack Networking（neutron）允许您创建由其他OpenStack服务管理的接口设备并将其连接到网络。可以实现插件以适应不同的网络设备和软件，为OpenStack架构和部署提供灵活性。
**网络服务包含以下组件：**
**neutron-server**
接受API请求并将其路由到适当的OpenStack Networking插件以便采取行动。
**OpenStack Networking plug-ins and agents**
插拔端口，创建网络或子网，并提供IP地址。这些插件和代理根据特定云中使用的供应商和技术而有所不同。OpenStack Networking带有用于思科虚拟和物理交换机，NEC OpenFlow产品，Open vSwitch，Linux桥接和VMware NSX产品的插件和代理。
通用代理是L3（第3层），DHCP（动态主机IP寻址）和插件代理。
**Messaging queue**
大多数OpenStack Networking安装用于在neutron-server和各种代理之间路由信息。还充当存储特定插件的网络状态的数据库。
OpenStack Networking主要与OpenStack Compute进行交互，为其实例提供网络和连接。

### 3.4.3	安装和配置controller节点

> **以下操作在控制节点执行**

#### 3.4.3.1	创建数据库

1.	要创建数据库，需要完成以下操作
以root用户使用数据库连接客户端连接到数据库服务器：

```bash
$ mysql -u root –p
```

创建neutron数据库:

```bash
MariaDB [(none)] CREATE DATABASE neutron;
```

授予neutron数据库适当访问权，这里密码为123456:

```bash
MariaDB [(none)]> GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'localhost' \
  IDENTIFIED BY '123456';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON neutron.* TO 'neutron'@'%' \
  IDENTIFIED BY '123456';
```

2.加载管理员凭据以获得仅管理员访问的CLI命令：

```bash
$ . admin-openrc
```

3.创建服务凭证，完成以下操作
创建neutron用户

```bash
[root@controller ~]# openstack user create --domain default --password-prompt neutron
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | 988aa6330c27474bb54b662aeb7173a7 |
| name                | neutron                          |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
```

添加admin角色到neutron用户

```bash
# openstack role add --project service --user neutron admin
```

创建neutron服务实体
[root@controller ~]# openstack service create --name neutron \

  - -description "OpenStack Networking" network

执行结果：
```bash
[root@controller ~]# openstack service create --name neutron \
>   --description "OpenStack Networking" network
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Networking             |
| enabled     | True                             |
| id          | 2547ba8ceeb1436184e78e29017f8930 |
| name        | neutron                          |
| type        | network                          |
+-------------+----------------------------------+
```

4.创建网络服务API端点
```bash
$ openstack endpoint create --region RegionOne \
  network public http://controller:9696
$ openstack endpoint create --region RegionOne \
  network internal http://controller:9696
$ openstack endpoint create --region RegionOne \
  network admin http://controller:9696
```

执行结果：
```bash
[root@controller ~]# openstack endpoint create --region RegionOne  network public http://controller:9696
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 4008ce59ae324f59a1bcafd3d68df1b2 |
| interface    | public                           |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | cd9f54256386473b9a98a9422e274c5a |
| service_name | neutron                          |
| service_type | network                          |
| url          | http://controller:9696           |
+--------------+----------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne  network internal http://controller:9696
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 8d8aed23061a48f3a7b0a8aefb8d5681 |
| interface    | internal                         |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | cd9f54256386473b9a98a9422e274c5a |
| service_name | neutron                          |
| service_type | network                          |
| url          | http://controller:9696           |
+--------------+----------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne  network admin http://controller:9696
+--------------+----------------------------------+
| Field        | Value                            |
+--------------+----------------------------------+
| enabled      | True                             |
| id           | 4bdb3e41746e4b2cbeadcf1fc5227363 |
| interface    | admin                            |
| region       | RegionOne                        |
| region_id    | RegionOne                        |
| service_id   | cd9f54256386473b9a98a9422e274c5a |
| service_name | neutron                          |
| service_type | network                          |
| url          | http://controller:9696            |
+--------------+----------------------------------+
```

#### 3.4.3.2	配置网络部分
您可以使用选项1和2所代表的两种体系结构之一来部署网络服务。

 - 选项1部署了仅支持将实例附加到提供者（外部）网络的最简单的可能架构。 没有自助服务（专用）网络，路由器或浮动IP地址。
   只有管理员或其他特权用户才能管理提供商网络。
 - 选项2增加了选项1，其中支持将实例附加到自助服务网络的第3层服务。
   演示或其他非特权用户可以管理自助服务网络，包括提供自助服务和提供商网络之间连接的路由器。此外，浮动IP地址可提供与使用来自外部网络（如Internet）的自助服务网络的实例的连接。 自助服务网络通常使用隧道网络。隧道网络协议（如VXLAN），选项2还支持将实例附加到提供商网络。

**以下两项配置二选一：**
	Networking Option 1: Provider networks
	Networking Option 2: Self-service networks

**这里选择Networking Option 2: Self-service networks**

1.安装组件

```bash
# yum install openstack-neutron openstack-neutron-ml2 \
  openstack-neutron-linuxbridge ebtables
```

2.配置服务组件
编辑/etc/neutron/neutron.conf配置文件，并完成以下操作：

```bash
# vim /etc/neutron/neutron.conf
```

在[database]部分, 配置数据库访问:

```bash
[database]

connection = mysql+pymysql://neutron:123456@controller/neutron
```

在[DEFAULT]部分, 启用模块化第2层（ML2）插件，路由器服务和overlapping IP addresses：

```bash
[DEFAULT]
# ...
core_plugin = ml2
service_plugins = router
allow_overlapping_ips = true
```

在 [DEFAULT] 部分, 配置RabbitMQ消息队列访问:
```bash
[DEFAULT]
# ...
transport_url = rabbit://openstack:123456@controller
```
在 [DEFAULT]和 [keystone_authtoken]部分, 配置认证服务访问:

```bash
[DEFAULT]
# ...
auth_strategy = keystone

[keystone_authtoken]
# ...
auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = neutron
password = 123456
```

在 [DEFAULT] 和[nova] 部分, 配置网络通知计算网络拓扑更改：

```bash
[DEFAULT]
# ...
notify_nova_on_port_status_changes = true
notify_nova_on_port_data_changes = true

[nova]
# ...
auth_url = http://controller:35357
auth_type = password
project_domain_name = default
user_domain_name = default
region_name = RegionOne
project_name = service
username = nova
password = 123456
```

在 [oslo_concurrency] 部分,配置锁定路径：

```bash
[oslo_concurrency]
# ...
lock_path = /var/lib/neutron/tmp
```

3.配置网络二层插件

ML2插件使用Linux桥接机制为实例构建第2层（桥接和交换）虚拟网络基础结构。

编辑/etc/neutron/plugins/ml2/ml2_conf.ini 文件并完成以下操作:

```bash
# vim /etc/neutron/plugins/ml2/ml2_conf.ini
```

在 [ml2]部分,启用 flat, VLAN, and VXLAN 网络:

```bash
[ml2]
# ...
type_drivers = flat,vlan,vxlan
```

在 [ml2]部分,启用VXLAN 自助服务网络:

```bash
[ml2]
# ...
tenant_network_types = vxlan
```

在 [ml2]部分, 启用Linux网桥和第2层集群机制：

```bash
[ml2]
# ...
mechanism_drivers = linuxbridge,l2population
```

在 [ml2]部分, 启用端口安全扩展驱动程序：

```bash
[ml2]
# ...
extension_drivers = port_security
```

在 [ml2_type_flat] 部分, 将提供者虚拟网络配置为扁平网络：

```bash
[ml2_type_flat]
# ...
flat_networks = provider
```

在 [ml2_type_vxlan] 部分,  为自助服务网络配置VXLAN网络标识符范围：

```bash
[ml2_type_vxlan]
# ...
vni_ranges = 1:1000
```

在 [securitygroup] 部分, 启用ipset以提高安全组规则的效率：

```bash
[securitygroup]
# ...
enable_ipset = true
```

4.配置linux网桥代理

Linux桥接代理为实例构建层-2（桥接和交换）虚拟网络基础结构，并处理安全组

编辑/etc/neutron/plugins/ml2/linuxbridge_agent.ini 文件并完成以下操作:

```bash
# vim /etc/neutron/plugins/ml2/linuxbridge_agent.ini
```

在 [linux_bridge]部分, 将提供者虚拟网络映射到提供者物理网络接口

```bash
[linux_bridge]
physical_interface_mappings = provider:ens38
```

注意：这里的ens38物理网卡是外部网络的网卡(underlying provider physical network interface)。
在[vxlan]部分中，启用vxlan隧道网络，配置处理隧道网络的物理网络接口的IP地址，并启用

```bash
layer-2 population：
[vxlan]
enable_vxlan = true
local_ip = 192.168.91.70
l2_population = true
```

注意这里的ip地址192.168.91.70为隧道网络的ip地址（IP address of the underlying physical network interface that handles overlay networks）

在 [securitygroup]部分, 启用安全组并配置Linux网桥iptables防火墙驱动程序：

```bash
[securitygroup]
# enable_security_group = true
firewall_driver = neutron.agent.linux.iptables_firewall.IptablesFirewallDriver
```

通过验证下列所有SysTL值设置为1以确保Linux操作系统内核支持网桥过滤器：

```bash
net.bridge.bridge-nf-call-iptables
net.bridge.bridge-nf-call-ip6tables
```

```bash
$ vim /usr/lib/sysctl.d/00-system.conf 
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
$ sysctl -p
```



5.配置三层代理

Layer-3（L3）代理为自助虚拟网络提供路由和NAT服务。

编辑/etc/neutron/l3_agent.ini 文件并完成以下操作：

```bash
$ vim /etc/neutron/l3_agent.ini
```

在 [DEFAULT]部分, 配置Linux网桥接口驱动程序和外部网络桥接器：

```bash
[DEFAULT]
interface_driver = linuxbridge
```

7.配置DHCP代理
DHCP代理为虚拟网络提供DHCP服务。
编辑/etc/neutron/dhcp_agent.ini文件并完成以下操作：
```bash
$ vim /etc/neutron/dhcp_agent.ini
```
在[DEFAULT]部分，配置Linux网桥接口驱动程序，Dnsmasq DHCP驱动程序，并启用隔离的元数据，以便提供商网络上的实例可以通过网络访问元数据：

```bash
[DEFAULT]
# ...
interface_driver = linuxbridge
dhcp_driver = neutron.agent.linux.dhcp.Dnsmasq
enable_isolated_metadata = true
```

#### 3.4.3.5	配置metadata
元数据代理为实例提供配置信息，例如凭据。
编辑 /etc/neutron/metadata_agent.ini文件并完成以下操作：
```bash
# vim /etc/neutron/metadata_agent.ini
```
```bash
[DEFAULT]

nova_metadata_host = controller
metadata_proxy_shared_secret = 123456
```

#### 3.4.3.6	配置计算服务使用网络服务
编辑/etc/nova/nova.conf文件并执行以下操作：
```bash
# vim /etc/nova/nova.conf
```
在[neutron]部分，配置访问参数，启用元数据代理并配置秘密：

```bash
[neutron]
url = http://controller:9696
auth_url = http://controller:35357
auth_type = password
project_domain_name = default
user_domain_name = default
region_name = RegionOne
project_name = service
username = neutron
password = 123456
service_metadata_proxy = true
metadata_proxy_shared_secret = 123456
```

#### 3.4.3.7	完成安装启动服务
1.网络服务初始化脚本需要一个指向ML2插件配置文件/etc/neutron/plugins/ml2/ml2_conf.ini的符号链接/etc/neutron/plugin.ini。 如果此符号链接不存在，请使用以下命令创建它：

```bash
# ln -s /etc/neutron/plugins/ml2/ml2_conf.ini /etc/neutron/plugin.ini
```

2.同步数据库

```bash
# su -s /bin/sh -c "neutron-db-manage --config-file /etc/neutron/neutron.conf   --config-file /etc/neutron/plugins/ml2/ml2_conf.ini upgrade head" neutron
```

3.重启compute API服务
```bash
#systemctl restart openstack-nova-api.service
```
4.启动网络服务并设为开机启动

```bash
# systemctl enable neutron-server.service \
  neutron-linuxbridge-agent.service neutron-dhcp-agent.service \
  neutron-metadata-agent.service
# systemctl start neutron-server.service \
  neutron-linuxbridge-agent.service neutron-dhcp-agent.service \
  neutron-metadata-agent.service
```

5.对于联网选项2，还启用并启动第三层服务：

```bash
# systemctl enable neutron-l3-agent.service && systemctl start neutron-l3-agent.service
```

### 3.4.4	安装和配置compute节点

> **以下操作在计算节点执行**

计算节点处理实例的连接和安全组。
#### 3.4.4.1	安装和配置组件
1.安装组件

```ruby
# yum install openstack-neutron-linuxbridge ebtables ipset
```

2.配置公共组件
网络通用组件配置包括身份验证机制，消息队列和插件。
编辑/etc/neutron/neutron.conf文件并完成以下操作：
在[database]部分，注释掉任何connection选项，因为计算节点不直接访问数据库。

```bash
# vim /etc/neutron/neutron.conf
```

在[DEFAULT]部分中，配置RabbitMQ 消息队列访问：

```bash
[DEFAULT] 
... 
transport_url = rabbit://openstack:123456@controller
```

在[DEFAULT]和[keystone_authtoken]部分中，配置身份服务访问：

```bash
[DEFAULT] 
＃... 
auth_strategy = keystone
[keystone_authtoken] 
＃... 
auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_name = default
user_domain_name = default
project_name = service
username = neutron
password = 123456
```

在[oslo_concurrency]部分中，配置锁定路径：

```bash
[oslo_concurrency] 
＃... 
lock_path = /var/lib/neutron/tmp
```
#### 3.4.4.2	配置网络部分
选择您为控制器节点选择的相同网络选项以配置特定的服务。 之后，返回此处并继续配置计算服务以使用网络服务。
	网络选项1：提供商网络
	网络选项2：自助服务网络

**这里选择网络选项2：自助服务网络**

1.配置Linux网桥
编辑/etc/neutron/plugins/ml2/linuxbridge_agent.ini文件并完成以下操作：

```bash
# vim /etc/neutron/plugins/ml2/linuxbridge_agent.ini
```
在[vxlan]部分中，启用VXLAN隧道网络，配置处理隧道网络的物理网络接口的IP地址，并启用第2层群体：

```bash
[vxlan]
enable_vxlan = true
local_ip = 192.168.91.71
l2_population = true
```

注意：这里的192.168.91.71为计算节点隧道网络的IP地址（underlying physical network interface that handles overlay networks）
在[securitygroup]节中，启用安全组并配置Linux网桥iptables防火墙驱动程序：

```bash
[securitygroup]
# ...
enable_security_group = true
firewall_driver = neutron.agent.linux.iptables_firewall.IptablesFirewallDriver
```

2.	配置计算服务使用网络服务
编辑/etc/nova/nova.conf

```bash
vim /etc/nova/nova.conf
[neutron]

url = http://controller:9696
auth_url = http://controller:35357
auth_type = password
project_domain_name = default
user_domain_name = default
region_name = RegionOne
project_name = service
username = neutron
password = 123456
```

确保您的Linux操作系统内核支持网桥过滤器，方法是验证以下所有sysctl值均设置为1：

```bash
net.bridge.bridge-nf-call-iptables
net.bridge.bridge-nf-call-ip6tables
```

```bash
$ vim /usr/lib/sysctl.d/00-system.conf 
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
$ sysctl -p
```

#### 3.4.4.5	完成安装启动服务
1.重启compute服务

```bash
# systemctl restart openstack-nova-compute.service
```

2.设置网桥服务开机启动

```bash
# systemctl enable neutron-linuxbridge-agent.service && systemctl start neutron-linuxbridge-agent.service
```

## 3.5	安装Horizon服务

> **以下操作在控制节点执行**

本节介绍如何在控制节点上安装和配置仪表板。
仪表板所需的唯一核心服务是身份服务。 您可以将仪表板与其他服务结合使用，例如镜像服务，计算和网络。 您还可以在具有独立服务（如对象存储）的环境中使用仪表板。
### 3.5.1	安装和配置组件
1.安装软件包

```bash
# yum install openstack-dashboard -y
```

2.编辑 /etc/openstack-dashboard/local_settings 文件并完成以下操作：

```bash
# vim /etc/openstack-dashboard/local_settings
```

配置仪表板以在controller节点上使用OpenStack服务 ：

```bash
OPENSTACK_HOST = "controller"
```

允许您的主机访问仪表板：

```bash
ALLOWED_HOSTS = ['*']
```

或者ALLOWED_HOSTS = ['one.example.com', 'two.example.com']
ALLOWED_HOSTS也可以['*']接受所有主机。这对开发工作可能有用，但可能不安全，不应用于生产。

配置memcache会话存储服务：

```bash
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

CACHES = {
    'default': {
         'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
         'LOCATION': 'controller:11211',
    }
}
```

注释掉任何其他会话存储配置。
开启身份认证API 版本v3
```bash
OPENSTACK_KEYSTONE_URL = "http://%s:5000/v3" % OPENSTACK_HOST
```
启用对域的支持：
```bash
OPENSTACK_KEYSTONE_MULTIDOMAIN_SUPPORT = True
```
配置API版本:

```bash
OPENSTACK_API_VERSIONS = {
    "identity": 3,
    "image": 2,
    "volume": 2,
}
```

配置Default为您通过仪表板创建的用户的默认域：

```bash
OPENSTACK_KEYSTONE_DEFAULT_DOMAIN = "Default"
```

将用户配置为通过仪表板创建的用户的默认角色：

```bash
OPENSTACK_KEYSTONE_DEFAULT_ROLE = "user"
```

配置时区（可选）

```bash
TIME_ZONE = "Asia/Shanghai"
```

4.如果未包括，则将以下行添加到/etc/httpd/conf.d/openstack-dashboard.conf。

```bash
# vim /etc/httpd/conf.d/openstack-dashboard.conf
WSGIApplicationGroup %{GLOBAL}
```

### 3.5.2	完成安装启动服务
1.完成安装，重启web服务和会话存储

```bash
# systemctl restart httpd.service memcached.service
```

### 3.5.3	登录web验证配置
在浏览器中输入http://192.168.90.70/dashboard.,访问openstack的dashboard界面，

 - domain:default
 - 用户名（管理员）:admin（管理员），demo(租户)
 - 密码:123456

**登录界面如下：**
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70.png)
**当前的项目信息：**
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-16919212183123.png)
 **当前上传的镜像**：
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-16919212206216.png)

## 3.6	安装Cinder服务

&emsp;块存储服务（cinder）为访客实例提供块存储设备。 存储配置和使用的方法由块存储驱动程序确定，或者在多后端配置的情况下由驱动程序确定。 有多种可用的驱动程序：NAS / SAN，NFS，iSCSI，Ceph等。
&emsp;块存储API和调度程序服务通常在控制节点上运行。 根据所使用的驱动程序，卷服务可以在控制节点，计算节点或独立存储节点上运行。
&emsp;一旦能够在OpenStack环境中“启动实例”，请按照以下说明将Cinder添加到基本环境。

### 3.6.1	块存储服务概述

&emsp;OpenStack块存储服务（Cinder）将持久性存储添加到虚拟机。块存储为管理卷提供基础架构，并与OpenStack Compute进行交互以提供实例卷。该服务还支持管理卷快照和卷类型。
**块存储服务包含以下组件：**
**cinder-api**
接受API请求，并将它们路由到cinder-volume操作。
**cinder-volume**
直接与Block Storage服务进行交互，以及诸如cinder-scheduler。它也通过消息队列与这些进程交互。该cinder-volume服务响应发送到块存储服务的读取和写入请求以保持状态。它可以通过驱动程序架构与各种存储提供商进行交互。
**cinder-scheduler daemon守护进程**
选择要在其上创建卷的最佳存储提供者节点。 与nova-scheduler类似的组件。
**cinder-backup daemon守护进程**
该cinder-backup服务可将任何类型的卷备份到备份存储提供程序。与cinder-volume服务一样，它可以通过驱动程序体系结构与各种存储提供商进行交互。
**Messaging queue消息队列**
路由块存储过程之间的信息。

### 3.6.2	安装和配置cinder节点

> **以下操作在cinder节点执行**

#### 3.6.2.1	安装配置LVM

&emsp;本节介绍如何为Block Storage服务安装和配置存储节点。 为简单起见，此配置引用具有空本地块存储设备的一个存储节点。 这些指令使用/ dev / sdb，但您可以将特定节点的值替换为不同的值。
&emsp;该服务使用LVM驱动程序在该设备上配置逻辑卷，并通过iSCSI传输将其提供给实例。 您可以按照这些说明进行小的修改，以便使用其他存储节点水平扩展您的环境。

1.安装支持的软件包

 - 安装LVM软件包

```bash
# yum install lvm2 device-mapper-persistent-data
```

 - 启动LVM元数据服务并将其配置为在系统引导时启动：

```bash
# systemctl enable lvm2-lvmetad.service && systemctl start lvm2-lvmetad.service
```
说明：一些发行版默认包含LVM。

2.创建LVM物理逻辑卷/dev/sdb

```bash
[root@cinder1 ~]# pvcreate /dev/sdb
  Physical volume "/dev/sdb" successfully created.
```

3.创建cinder-volumes逻辑卷组

```bash
[root@cinder ~]# vgcreate cinder-volumes /dev/sdb
Volume group "cinder-volumes" successfully created
```

4 .只有实例才能访问块存储卷。 但是，底层操作系统管理与卷关联的设备。 默认情况下，LVM卷扫描工具会扫描包含卷的块存储设备的/ dev目录。 如果项目在其卷上使用LVM，则扫描工具将检测这些卷并尝试缓存它们，这可能会导致底层操作系统和项目卷出现各种问题。 您必须重新配置LVM以仅扫描包含cinder-volumes卷组的设备。 编辑/etc/lvm/lvm.conf文件并完成以下操作：
在devices部分中，添加一个接受/ dev / sdb设备的过滤器并拒绝所有其他设备：

```bash
# vim /etc/lvm/lvm.conf
devices {
...
filter = [ "a/sdb/", "r/.*/"]
```

Each item in the filter array begins with a for accept or r for reject and includes a regular expression for the device name. The array must end with r/.*/ to reject any remaining devices. You can use the vgs -vvvv command to test filters.
过滤器数组中的每个项目都以for接受或r为拒绝开头，并包含设备名称的正则表达式。 该阵列必须以r /.*/结尾以拒绝任何剩余的设备。 您可以使用vgs -vvvv命令来测试过滤器。
如果您的存储节点在操作系统磁盘上使用LVM，则还必须将关联的设备添加到过滤器。 例如，如果/ dev / sda设备包含操作系统：

```bash
filter = [ "a/sda/", "a/sdb/", "r/.*/"]
```

同样，如果您的计算节点在操作系统磁盘上使用LVM，则还必须修改这些节点上/etc/lvm/lvm.conf文件中的筛选器以仅包含操作系统磁盘。 例如，如果/ dev / sda设备包含操作系统：

```bash
filter = [ "a/sda/", "r/.*/"]
```

#### 3.6.2.2	安装和配置组件
1.安装软件包

```bash
# yum install openstack-cinder targetcli python-keystone -y
```

2.	编辑/etc/cinder/cinder.conf文件并完成以下操作：

```bash
# vim /etc/cinder/cinder.conf
```

在[database]部分中，配置数据库访问：

```bash
[database]

connection = mysql+pymysql://cinder:123456@controller/cinder
```

在该[DEFAULT]部分中，配置RabbitMQ 消息队列访问：

```bash
[DEFAULT]
transport_url = rabbit://openstack:123456@controller
```

在[DEFAULT]和[keystone_authtoken]部分中，配置身份服务访问：

```bash
[DEFAULT]

auth_strategy = keystone

[keystone_authtoken]

auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_id = default
user_domain_id = default
project_name = service
username = cinder
password = 123456
```

在[DEFAULT]部分中，配置my_ip选项：

```bash
my_ip = 192.168.90.72
```

注意这里的192.168.90.72为存储节点上管理网络接口的IP地址
在[lvm]部分中，使用LVM驱动程序，cinder-volumes卷组，iSCSI协议和相应的iSCSI服务配置LVM后端。如果该[lvm]部分不存在，请创建它：

```bash
[lvm] 
volume_driver  =  cinder.volume.drivers.lvm.LVMVolumeDriver 
volume_group  =  cinder-volumes 
iscsi_protocol  =  iscsi 
iscsi_helper  =  lioadm
```

在[DEFAULT]部分中，启用LVM后端：

```bash
[DEFAULT] 
＃... 
enabled_backends  =  lvm
```

后端名称是任意的。作为示例，本指南使用驱动程序的名称作为后端的名称。
在[DEFAULT]部分中，配置Image Service API的位置：

```bash
[DEFAULT] 
＃... 
glance_api_servers = http://controller:9292
```
在[oslo_concurrency]部分中，配置锁定路径：

```bash
[oslo_concurrency] 
＃... 
lock_path = /var/lib/cinder/tmp
```

#### 3.6.2.3	完成安装启动服务
设置存储服务开机启动

```bash
# systemctl enable openstack-cinder-volume.service target.service 
# systemctl start openstack-cinder-volume.service target.service
```

### 3.6.3	安装和配置controller节点
本节介绍如何在控制节点上安装和配置代码为cinder的块存储服务。 此服务至少需要一个为实例提供卷的额外存储节点。

> **以下操作在控制节点执行**

#### 3.6.3.1	创建cinder数据库
在安装和配置块存储服务之前，您必须创建数据库，服务凭据和API端点。
要创建数据库，请完成以下步骤：
1.使用数据库访问客户端以root用户身份连接到数据库服务器：

```bash
$ mysql -u root -p
```

创建cinder数据库：

```bash
MariaDB [(none)]> CREATE DATABASE cinder;
```

授予对cinder数据库的适当访问权限：

```
MariaDB [(none)]> GRANT ALL PRIVILEGES ON cinder.* TO 'cinder'@'localhost' \
  IDENTIFIED BY '123456';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON cinder.* TO 'cinder'@'%' \
  IDENTIFIED BY '123456';
```

2.加载admin凭据

```bash
$ . admin-openrc
```

3.要创建服务凭据，请完成以下步骤：
创建一个cinder用户：

```bash
[root@controller ~]# openstack user create --domain default --password-prompt cinder
User Password:
Repeat User Password:
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | 2df1d57dd00a418080d3b5ed8eb4c2a0 |
| name                | cinder                           |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
```
添加admin角色到cinder用户：

```bash
$ openstack role add --project service --user cinder admin
```

注意，此命令无输出结果

创建cinderv2和cinderv3服务实体：
```bash
# openstack service create --name cinderv2 \
- -description "OpenStack Block Storage" volumev2
# openstack service create --name cinderv3 \
- -description "OpenStack Block Storage" volumev3
```
执行结果：
```bash
[root@controller ~]# openstack service create --name cinderv2 \
>   --description "OpenStack Block Storage" volumev2
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Block Storage          |
| enabled     | True                             |
| id          | 3644ab2053cb4ab5b5e754548f6276fa |
| name        | cinderv2                         |
| type        | volumev2                         |
+-------------+----------------------------------+

[root@controller ~]# openstack service create --name cinderv3 \
>   --description "OpenStack Block Storage" volumev3
+-------------+----------------------------------+
| Field       | Value                            |
+-------------+----------------------------------+
| description | OpenStack Block Storage          |
| enabled     | True                             |
| id          | a220c2f4900c4622a6cd65a5f093cddb |
| name        | cinderv3                         |
| type        | volumev3                         |
+-------------+----------------------------------+
```

注意：块存储服务需要两个服务实体。

4.创建块存储服务API端点：
```bash
[root@controller ~]# openstack endpoint create --region RegionOne \
volumev2 public http://controller:8776/v2/%\(project_id\)s
[root@controller ~]# openstack endpoint create --region RegionOne \
volumev2 internal http://controller:8776/v2/%\(project_id\)s
[root@controller ~]# openstack endpoint create --region RegionOne \
volumev2 admin http://controller:8776/v2/%\(project_id\)s
[root@controller ~]# openstack endpoint create --region RegionOne \
volumev3 public http://controller:8776/v3/%\(project_id\)s
[root@controller ~]# openstack endpoint create --region RegionOne \
volumev3 internal http://controller:8776/v3/%\(project_id\)s
[root@controller ~]# openstack endpoint create --region RegionOne \
volumev3 admin http://controller:8776/v3/%\(project_id\)s
```

执行结果：
```bash
[root@controller ~]# openstack endpoint create --region RegionOne \
>   volumev2 public http://controller:8776/v2/%\(project_id\)s
+--------------+------------------------------------------+
| Field        | Value                                    |
+--------------+------------------------------------------+
| enabled      | True                                     |
| id           | d79c21958c104b73998b8a0a2656ac1a         |
| interface    | public                                   |
| region       | RegionOne                                |
| region_id    | RegionOne                                |
| service_id   | 3644ab2053cb4ab5b5e754548f6276fa         |
| service_name | cinderv2                                 |
| service_type | volumev2                                 |
| url          | http://controller:8776/v2/%(project_id)s |
+--------------+------------------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   volumev2 internal http://controller:8776/v2/%\(project_id\)s
+--------------+------------------------------------------+
| Field        | Value                                    |
+--------------+------------------------------------------+
| enabled      | True                                     |
| id           | f267e9427c8d4087b457a5ec7342ace4         |
| interface    | internal                                 |
| region       | RegionOne                                |
| region_id    | RegionOne                                |
| service_id   | 3644ab2053cb4ab5b5e754548f6276fa         |
| service_name | cinderv2                                 |
| service_type | volumev2                                 |
| url          | http://controller:8776/v2/%(project_id)s |
+--------------+------------------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   volumev2 admin http://controller:8776/v2/%\(project_id\)s
+--------------+------------------------------------------+
| Field        | Value                                    |
+--------------+------------------------------------------+
| enabled      | True                                     |
| id           | c89c663ccee14ecd826f3402446f9f74         |
| interface    | admin                                    |
| region       | RegionOne                                |
| region_id    | RegionOne                                |
| service_id   | 3644ab2053cb4ab5b5e754548f6276fa         |
| service_name | cinderv2                                 |
| service_type | volumev2                                 |
| url          | http://controller:8776/v2/%(project_id)s |
+--------------+------------------------------------------+

[root@controller ~]# openstack endpoint create --region RegionOne \
>   volumev3 public http://controller:8776/v3/%\(project_id\)s
+--------------+------------------------------------------+
| Field        | Value                                    |
+--------------+------------------------------------------+
| enabled      | True                                     |
| id           | 03ffabf166eb4d51959f9bafd9b75ad4         |
| interface    | public                                   |
| region       | RegionOne                                |
| region_id    | RegionOne                                |
| service_id   | a220c2f4900c4622a6cd65a5f093cddb         |
| service_name | cinderv3                                 |
| service_type | volumev3                                 |
| url          | http://controller:8776/v3/%(project_id)s |
+--------------+------------------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   volumev3 internal http://controller:8776/v3/%\(project_id\)s
+--------------+------------------------------------------+
| Field        | Value                                    |
+--------------+------------------------------------------+
| enabled      | True                                     |
| id           | 8aca3fa06384499fbcec3f6ed5fb6299         |
| interface    | internal                                 |
| region       | RegionOne                                |
| region_id    | RegionOne                                |
| service_id   | a220c2f4900c4622a6cd65a5f093cddb         |
| service_name | cinderv3                                 |
| service_type | volumev3                                 |
| url          | http://controller:8776/v3/%(project_id)s |
+--------------+------------------------------------------+
[root@controller ~]# openstack endpoint create --region RegionOne \
>   volumev3 admin http://controller:8776/v3/%\(project_id\)s
+--------------+------------------------------------------+
| Field        | Value                                    |
+--------------+------------------------------------------+
| enabled      | True                                     |
| id           | 3cef8b97ec5543a1a3435c6f2df133db         |
| interface    | admin                                    |
| region       | RegionOne                                |
| region_id    | RegionOne                                |
| service_id   | a220c2f4900c4622a6cd65a5f093cddb         |
| service_name | cinderv3                                 |
| service_type | volumev3                                 |
| url          | http://controller:8776/v3/%(project_id)s |
+--------------+------------------------------------------+
```

#### 3.6.3.2	安装和配置组件
1.安装软件包：

```bash
# yum install openstack-cinder
```

2.编辑/etc/cinder/cinder.conf文件并完成以下操作：

```bash
# vim /etc/cinder/cinder.conf
```

在[database]部分中，配置数据库访问：

```bash
[database]
# ...
connection = mysql+pymysql://cinder:123456@controller/cinder
```

在[DEFAULT]部分中，配置RabbitMQ 消息队列访问：

```bash
[DEFAULT]
# ...
transport_url = rabbit://openstack:123456@controller
```

在[DEFAULT]和[keystone_authtoken]部分中，配置身份服务访问：

```bash
[DEFAULT]
# ...
auth_strategy = keystone
[keystone_authtoken]
# ...
auth_uri = http://controller:5000
auth_url = http://controller:35357
memcached_servers = controller:11211
auth_type = password
project_domain_id = default
user_domain_id = default
project_name = service
username = cinder
password = 123456
```

在[DEFAULT]部分中，将该my_ip选项配置为使用控制节点的管理接口IP地址：

```bash
[DEFAULT]
# ...
my_ip = 192.168.90.70
```

在该[oslo_concurrency]部分中，配置锁定路径：

```bash
[oslo_concurrency] 
＃... 
lock_path = /var/lib/cinder/tmp
```

4.同步块存储数据库：

```bash
# su -s /bin/sh -c "cinder-manage db sync" cinder
Option "logdir" from group "DEFAULT" is deprecated. Use option "log-dir" from group "DEFAULT".
```

忽略此输出中的任何弃用消息。
#### 3.6.3.3	配置计算服务使用块存储
编辑/etc/nova/nova.conf文件并添加以下内容：

```bash
# vim /etc/nova/nova.conf
[cinder]
os_region_name = RegionOne
```
#### 3.6.3.4	完成安装启动服务
重新启动Compute API服务：

```bash
# systemctl restart openstack-nova-api.service
```

启动块存储服务并将其配置为在系统引导时启动：

```bash
# systemctl enable openstack-cinder-api.service openstack-cinder-scheduler.service
# systemctl start openstack-cinder-api.service openstack-cinder-scheduler.service
```

###3.6.4 验证cinder配置
验证Cinder操作,在控制器节点上执行这些命令。
1.输入管理员凭据以访问仅限管理员的CLI命令：
$ . admin-openrc
列出服务组件以验证每个进程的成功启动：

```bash
[root@controller ~]# openstack volume service list
+------------------+-------------+------+---------+-------+--------------------------
| Binary           | Host        | Zone | Status  | State | Updated At                 |
+------------------+-------------+------+---------+-------+--------------------------
| cinder-volume    | cinder1@lvm | nova | enabled | up    | 2018-06-10T10:35:37.000000 |
| cinder-scheduler | controller  | nova | enabled | up    | 2018-06-10T10:35:38.000000 |
+------------------+-------------+------+---------+-------+--------------------------
```

# 4	创建虚拟机实例

**创建过程:**
1)	创建虚拟网络
2)	创建m1.nano规格的主机（相等于定义虚拟机的硬件配置）
3)	生成一个密钥对（openstack的原理是不使用密码连接，而是使用密钥对进行连接）
4)	增加安全组规则（用iptables做的安全组）
5)	启动一个实例（启动虚拟机有三种类型：1.命令CLI 2.api 3.Dashboard）实际上Dashboard也是通过api进行操作
6)	虚拟网络分为提供者网络和私有网络，提供者网络就是跟主机在同一个网络里，私有网络自定义路由器等，跟主机不在一个网络

## 4.1	创建外部网络

> **以下所有操作在控制节点执行**

为配置Neutron时选择的网络选项创建虚拟网络。 如果您选择选项1，则只创建提供商网络。 如果您选择了选项2，请创建提供商和自助服务网络。
	Provider network
	Self-service network

在为您的环境创建适当的网络后，您可以继续准备环境以启动实例。

提供者网络-provider网络
在启动实例之前，您必须创建必要的虚拟网络基础结构,管理员或其他特权用户必须创建此网络，因为它直接连接到物理网络基础结构。

### 4.1.1	创建provider外部网络

在控制节点上，获取admin用户凭证以访问仅管理员的CLI命令：

```bash
$ . admin-openrc
```

创建虚拟网络（网络名为provider）：

```bash
$ openstack network create --share --external \
  --provider-physical-network provider \
  --provider-network-type flat provider
```
执行结果：
```bash
[root@controller ~]#  openstack network create --share --external \
>   --provider-physical-network provider \
>   --provider-network-type flat provider
+---------------------------+--------------------------------------+
| Field                     | Value                                |
+---------------------------+--------------------------------------+
| admin_state_up            | UP                                   |
| availability_zone_hints   |                                      |
| availability_zones        |                                      |
| created_at                | 2018-06-10T14:25:42Z                 |
| description               |                                      |
| dns_domain                | None                                 |
| id                        | 891787bb-ce4a-4b41-b222-1493ec30035c |
| ipv4_address_scope        | None                                 |
| ipv6_address_scope        | None                                 |
| is_default                | False                                |
| is_vlan_transparent       | None                                 |
| mtu                       | 1500                                 |
| name                      | provider                             |
| port_security_enabled     | True                                 |
| project_id                | 9a8169bc534e4705816e97bff4d2866b     |
| provider:network_type     | flat                                 |
| provider:physical_network | provider                             |
| provider:segmentation_id  | None                                 |
| qos_policy_id             | None                                 |
| revision_number           | 5                                    |
| router:external           | External                             |
| segments                  | None                                 |
| shared                    | True                                 |
| status                    | ACTIVE                               |
| subnets                   |                                      |
| tags                      |                                      |
| updated_at                | 2018-06-10T14:25:43Z                 |
+---------------------------+--------------------------------------+
```

参数说明：
- -share选项允许所有项目使用虚拟网络。
- -external选项将虚拟网络定义为外部。 如果你想创建一个内部网络，你可以使用--internal代替。 默认值是内部的。
--provider-physical-network提供者和--provider-network-type平面选项使用来自以下文件的信息将扁平虚拟网络连接到主机上eth1接口上的扁平（本地/非标记）物理网络：

```bash
ml2_conf.ini:
[ml2_type_flat]
flat_networks = provider
linuxbridge_agent.ini:
[linux_bridge]
physical_interface_mappings = provider:ens38
```

使用命令查看创建的网络：

```bash
[root@controller ~]# openstack network list
+--------------------------------------+----------+--------------------------------------+
| ID                                   | Name     | Subnets                              |
+--------------------------------------+----------+--------------------------------------+
| 891787bb-ce4a-4b41-b222-1493ec30035c | provider | 20b98341-041f-4b66-973d-ebb3a42415a2 |
+--------------------------------------+----------+--------------------------------------+
```

以admin用户登录dashboard查看创建的网络：
 ![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192131232721.png)
查看网络拓扑图：
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192131460724.png)

### 4.1.2	网络中创建子网
在外部网络上创建一个子网：

```bash
# openstack subnet create --network provider \
  --allocation-pool start=192.168.92.80,end=192.168.92.90 \
  --dns-nameserver 114.114.114.114 --gateway 192.168.92.2 \
  --subnet-range 192.168.92.0/24 provider
```
执行结果：
```bash
[root@controller ~]# openstack subnet create --network provider \
>   --allocation-pool start=192.168.92.80,end=192.168.92.90 \
>   --dns-nameserver 114.114.114.114 --gateway 192.168.92.2 \
>   --subnet-range 192.168.92.0/24 provider
+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| allocation_pools  | 192.168.92.80-192.168.92.90          |
| cidr              | 192.168.92.0/24                      |
| created_at        | 2018-06-10T14:48:05Z                 |
| description       |                                      |
| dns_nameservers   | 114.114.114.114                      |
| enable_dhcp       | True                                 |
| gateway_ip        | 192.168.92.2                         |
| host_routes       |                                      |
| id                | 639dcbb3-9bdf-4db8-9734-c4556f1e7972 |
| ip_version        | 4                                    |
| ipv6_address_mode | None                                 |
| ipv6_ra_mode      | None                                 |
| name              | provider                             |
| network_id        | 891787bb-ce4a-4b41-b222-1493ec30035c |
| project_id        | 9a8169bc534e4705816e97bff4d2866b     |
| revision_number   | 0                                    |
| segment_id        | None                                 |
| service_types     |                                      |
| subnetpool_id     | None                                 |
| tags              |                                      |
| updated_at        | 2018-06-10T14:48:05Z                 |
+-------------------+--------------------------------------+
```

参数说明
用CIDR表示法将PROVIDER_NETWORK_CIDR替换为提供商物理网络上的子网。
将START_IP_ADDRESS和END_IP_ADDRESS替换为要为实例分配的子网内范围的第一个和最后一个IP地址。 该范围不得包含任何现有的活动IP地址。
将DNS_RESOLVER替换为DNS解析器的IP地址。 在大多数情况下，您可以使用主机上/etc/resolv.conf文件中的一个。
将PROVIDER_NETWORK_GATEWAY替换为提供商网络上的网关IP地址，通常为“.1”IP地址。

- -network，指定创建的子网名称
- -subnet-range 后边的provider为要创建子网的网络（要跟上面创建网络的名称对应起来）
查看创建的子网

```bash
[root@controller ~]# openstack subnet list
+--------------------------------------+----------+----------------------------------
| ID                                   | Name     | Network                              | Subnet          |
+--------------------------------------+----------+----------------------------------
| 639dcbb3-9bdf-4db8-9734-c4556f1e7972 | provider | 891787bb-ce4a-4b41-b222-1493ec30035c | 192.168.92.0/24 |
+--------------------------------------+----------+----------------------------------
```

以admin用户登录dashboard查看创建的子网
 ![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192133741827.png)
查看网络拓扑图变化：
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192133997130.png)

### 4.1.3	查看节点网卡变化
OpenStack中创建的实例想要访问外网必须要创建外部网络（即provider network），然后通过虚拟路由器连接外部网络和租户网络，Neutron网桥的方式实现外网的访问，当Neutron创建外部网络并创建子网后会创建一个新的网桥，并且将ens38这块外部网卡加入网桥，执行ifconfig可以看到多了一个brq891787bb-ce的网桥：
```bash
[root@controller ~]# ifconfig
brq891787bb-ce: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.92.70  netmask 255.255.255.0  broadcast 192.168.92.255
        inet6 fe80::ad:b4ff:fedb:b57d  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:2d  txqueuelen 1000  (Ethernet)
        RX packets 156  bytes 17533 (17.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 252  bytes 17252 (16.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.90.70  netmask 255.255.255.0  broadcast 192.168.90.255
        inet6 fe80::ffb5:9b12:f911:89ec  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::b01a:e132:1923:175  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::2801:f5c2:4e5a:d003  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:19  txqueuelen 1000  (Ethernet)
        RX packets 21335  bytes 7687186 (7.3 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 24227  bytes 20874223 (19.9 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.91.70  netmask 255.255.255.0  broadcast 192.168.91.255
        inet6 fe80::e8fe:eea6:f4f:2d85  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::8af8:8b5c:793f:e719  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:23  txqueuelen 1000  (Ethernet)
        RX packets 22  bytes 3098 (3.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 61  bytes 5818 (5.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens38: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::e64:a89f:4312:ea34  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::e8d3:6442:89c0:cd4a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:2d  txqueuelen 1000  (Ethernet)
        RX packets 2750  bytes 234108 (228.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4445  bytes 4676164 (4.4 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
查看该网桥信息，其中，该网桥的 tapcf05d8bf-49和 tapf7f21425-dd接口分别连接了ens38物理网卡和dhcp节点
```bash
[root@controller ~]#  brctl show
bridge name     bridge id               STP enabled     interfaces
brq891787bb-ce 8000.000c29cba52d       no               ens38
                                                        tapcf05d8bf-49
                                                        tapf7f21425-dd
```

## 4.2	创建租户网络

如果选择联网选项2，则还可以创建通过NAT连接到物理网络基础结构的自助服务（专用）网络。该网络包括一个为实例提供IP地址的DHCP服务器。此网络上的实例可以自动访问外部网络，如Internet。但是，从外部网络（例如Internet）访问此网络上的实例需要浮动IP地址
这个demo或其他非特权用户可以创建这个网络，因为它仅提供与demo项目内实例的连接。
Warning

您必须在自助服务网络之前创建提供商网络。

### 4.2.1	创建self-service网络

1.在控制节点上，获取凭据demo-openrc：

```bash
$ . demo-openrc
```

2.创建网络：

```bash
[root@controller ~]# openstack network create selfservice1
+---------------------------+--------------------------------------+
| Field                     | Value                                |
+---------------------------+--------------------------------------+
| admin_state_up            | UP                                   |
| availability_zone_hints   |                                      |
| availability_zones        |                                      |
| created_at                | 2018-06-13T06:14:20Z                 |
| description               |                                      |
| dns_domain                | None                                 |
| id                        | 0e728aa4-d9bd-456b-ba0b-dd7df5e15c96 |
| ipv4_address_scope        | None                                 |
| ipv6_address_scope        | None                                 |
| is_default                | False                                |
| is_vlan_transparent       | None                                 |
| mtu                       | 1450                                 |
| name                      | selfservice1                         |
| port_security_enabled     | True                                 |
| project_id                | f3f0c1a2a9f74aa6ac030671f4c7ec33     |
| provider:network_type     | None                                 |
| provider:physical_network | None                                 |
| provider:segmentation_id  | None                                 |
| qos_policy_id             | None                                 |
| revision_number           | 2                                    |
| router:external           | Internal                             |
| segments                  | None                                 |
| shared                    | False                                |
| status                    | ACTIVE                               |
| subnets                   |                                      |
| tags                      |                                      |
| updated_at                | 2018-06-13T06:14:20Z                 |
+---------------------------+--------------------------------------+
```

非特权用户通常不能为该命令提供额外的参数。该服务使用来自以下文件的信息自动选择参数：

```bash
# cat /etc/neutron/plugins/ml2/ml2_conf.ini
ml2_conf.ini:
[ml2]
tenant_network_types = vxlan
[ml2_type_vxlan]
vni_ranges = 1:1000
```

创建的内部网络类型是由tenant_network_types中指定，为vxlan。该配置能指定内部网络类型，如flat，vlan，gre等。
查看创建的网络：

```bash
[root@controller ~]# openstack network list
+--------------------------------------+-------------+-------------------------------
| ID                                   | Name        | Subnets                              |
+--------------------------------------+-------------+-------------------------------
| 891787bb-ce4a-4b41-b222-1493ec30035c | provider     | 639dcbb3-9bdf-4db8-9734-c4556f1e7972 |
| a248893f-0267-4aa4-8766-ac87e525a057 | selfservice1 |                                      |
+--------------------------------------+-------------+-------------------------------
```

在dashboard上查看创建的网络：
 ![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192136674333.png)

### 4.2.2	网络中创建子网
在网络上创建子网：

```bash
$ openstack subnet create --network selfservice1 \
  --dns-nameserver 114.114.114.114 --gateway 172.16.1.1 \
  --subnet-range 172.16.1.0/24 selfservice1-net1
```
执行结果：
```bash
[root@controller ~]# openstack subnet create --network selfservice1 \
>   --dns-nameserver 114.114.114.114 --gateway 172.16.1.1 \
>   --subnet-range 172.16.1.0/24 selfservice1-net1
+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| allocation_pools  | 172.16.1.2-172.16.1.254              |
| cidr              | 172.16.1.0/24                        |
| created_at        | 2018-06-13T06:16:13Z                 |
| description       |                                      |
| dns_nameservers   | 114.114.114.114                      |
| enable_dhcp       | True                                 |
| gateway_ip        | 172.16.1.1                           |
| host_routes       |                                      |
| id                | e96f6670-3208-40bb-a4f8-21beb37382db |
| ip_version        | 4                                    |
| ipv6_address_mode | None                                 |
| ipv6_ra_mode      | None                                 |
| name              | selfservice1-net1                    |
| network_id        | 0e728aa4-d9bd-456b-ba0b-dd7df5e15c96 |
| project_id        | f3f0c1a2a9f74aa6ac030671f4c7ec33     |
| revision_number   | 0                                    |
| segment_id        | None                                 |
| service_types     |                                      |
| subnetpool_id     | None                                 |
| tags              |                                      |
| updated_at        | 2018-06-13T06:16:13Z                 |
+-------------------+--------------------------------------+
```

查看创建的子网：

```bash
[root@controller ~]# openstack subnet list
+--------------------------------------+-------------+-------------------------------
| ID                                   | Name        | Network                              | Subnet          |
+--------------------------------------+-------------+-------------------------------
| 639dcbb3-9bdf-4db8-9734-c4556f1e7972 | provider    | 891787bb-ce4a-4b41-b222-1493ec30035c | 192.168.92.0/24 |
| b378617e-8ba0-439b-95a9-b4d2c5df10aa | selfservice | a248893f-0267-4aa4-8766-ac87e525a057 | 172.16.1.0/24   |
+--------------------------------------+-------------+-------------------------------
```

切换到demo用户登录dashboard查看网络拓扑图：
 ![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192137052736.png)

查看计算节点网卡变化

```bash
[root@compute1 ~]# ifconfig
brq891787bb-ce: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.91.71  netmask 255.255.255.0  broadcast 192.168.91.255
        ether 00:0c:29:c7:ba:a5  txqueuelen 1000  (Ethernet)
        RX packets 107  bytes 15563 (15.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 130  bytes 17653 (17.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.90.71  netmask 255.255.255.0  broadcast 192.168.90.255
        inet6 fe80::b01a:e132:1923:175  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::2801:f5c2:4e5a:d003  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:c7:ba:9b  txqueuelen 1000  (Ethernet)
        RX packets 2591  bytes 1036598 (1012.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2555  bytes 2019296 (1.9 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::8af8:8b5c:793f:e719  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:c7:ba:a5  txqueuelen 1000  (Ethernet)
        RX packets 105  bytes 16893 (16.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 165  bytes 21265 (20.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens38: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.92.71  netmask 255.255.255.0  broadcast 192.168.92.255
        inet6 fe80::e8d3:6442:89c0:cd4a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:c7:ba:af  txqueuelen 1000  (Ethernet)
        RX packets 110  bytes 12508 (12.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 173  bytes 12172 (11.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

### 4.2.3	创建路由器

自助服务网络使用通常执行双向NAT的虚拟路由器连接到提供商网络。每个路由器至少包含一个自助服务网络上的接口和提供商网络上的网关。

提供商网络必须包含router:external选项以使自助服务路由器能够使用它来连接到外部网络，例如互联网。这个admin或其他特权用户必须在网络创建期间包含此选项或稍后添加它。在这种情况下，该 router:external选项--external在创建provider网络时通过使用该参数进行设置。

1.在控制节点上，demo获取凭据以访问仅限用户的CLI命令：

```bash
$ . demo-openrc
```

2.创建路由器:

```bash
[root@controller ~]# openstack router create router
+-------------------------+--------------------------------------+
| Field                   | Value                                |
+-------------------------+--------------------------------------+
| admin_state_up          | UP                                   |
| availability_zone_hints |                                      |
| availability_zones      |                                      |
| created_at              | 2018-06-11T04:58:58Z                 |
| description             |                                      |
| distributed             | False                                |
| external_gateway_info   | None                                 |
| flavor_id               | None                                 |
| ha                      | False                                |
| id                      | be1a4882-bc3f-43b4-9570-1414e1fae952 |
| name                    | router                               |
| project_id              | f3f0c1a2a9f74aa6ac030671f4c7ec33     |
| revision_number         | 1                                    |
| routes                  |                                      |
| status                  | ACTIVE                               |
| tags                    |                                      |
| updated_at              | 2018-06-11T04:58:58Z                 |
+-------------------------+--------------------------------------+
```

查看创建的路由器：

```bash
[root@controller ~]# openstack router list
+--------------------------------------+--------+--------+-------+-------------+-----
| ID                                   | Name   | Status | State | Distributed | HA    | Project                          |
+--------------------------------------+--------+--------+-------+-------------+-----
| be1a4882-bc3f-43b4-9570-1414e1fae952 | router | ACTIVE | UP    | False       | False | f3f0c1a2a9f74aa6ac030671f4c7ec33 |
+--------------------------------------+--------+--------+-------+-------------+-----
```

登录dashboard查看创建的路由器:

![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192137483539.png)

### 4.2.4	租户网络添加到路由器
将自助服务网络子网添加为路由器上的接口：

```bash
[root@controller ~]# neutron router-interface-add router selfservice
neutron CLI is deprecated and will be removed in the future. Use openstack CLI instead.
Added interface d6ef6924-a4a2-4746-9bf7-9c7c1b13f32c to router router.
```

###4.2.5	路由器连接到外部网络
在路由器上的提供商网络上设置网关：

```bash
[root@controller ~]# neutron router-gateway-set router provider
neutron CLI is deprecated and will be removed in the future. Use openstack CLI instead.
Set gateway for router router
```

切换demo用户登录dashboard查看网络拓扑图变化：
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192127704418.png)

###4.2.6	验证操作
我们建议您在继续之前验证操作并解决所有问题。 以下步骤使用网络和子网创建示例中的IP地址范围。
1.在控制器节点上，输入管理员凭据以访问仅限管理员的CLI命令：

```bash
$ . admin-openrc
```

2.列出网络名称空间。你应该看到一个qrouter命名空间和两个 qdhcp命名空间。

```bash
[root@controller ~]# ip netns
qrouter-be1a4882-bc3f-43b4-9570-1414e1fae952 (id: 2)
qdhcp-a248893f-0267-4aa4-8766-ac87e525a057 (id: 1)
qdhcp-891787bb-ce4a-4b41-b222-1493ec30035c (id: 0)
List ports on the router to determine the gateway IP address on the provider network:
```

3.列出路由器上的端口以确定提供商网络上的网关IP地址：

```bash
[root@controller ~]# neutron router-port-list router
neutron CLI is deprecated and will be removed in the future. Use openstack CLI instead.
+--------------------------------------+------+----------------------------------+---
| id                                   | name | tenant_id                        | mac_address       | fixed_ips                                                                            |
+--------------------------------------+------+----------------------------------+---
| d6ef6924-a4a2-4746-9bf7-9c7c1b13f32c |      | f3f0c1a2a9f74aa6ac030671f4c7ec33 | fa:16:3e:c1:7a:17 | {"subnet_id": "b378617e-8ba0-439b-95a9-b4d2c5df10aa", "ip_address": "172.16.1.1"}    |
| f7f21425-dd38-435c-85a7-4842106e1d7a |      |                                  | fa:16:3e:d5:3e:63 | {"subnet_id": "639dcbb3-9bdf-4db8-9734-c4556f1e7972", "ip_address": "192.168.92.90"} |
+--------------------------------------+------+----------------------------------+---
```

4.从控制节点或物理提供商网络上的任何主机ping此IP地址：

```bash
[root@controller ~]# ping -c 4 192.168.92.90 
PING 192.168.92.90 (192.168.92.90) 56(84) bytes of data.
64 bytes from 192.168.92.90: icmp_seq=1 ttl=64 time=0.136 ms
64 bytes from 192.168.92.90: icmp_seq=2 ttl=64 time=0.052 ms
64 bytes from 192.168.92.90: icmp_seq=3 ttl=64 time=0.062 ms
64 bytes from 192.168.92.90: icmp_seq=4 ttl=64 time=0.053 ms

--- 192.168.92.90 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3108ms
rtt min/avg/max/mdev = 0.052/0.075/0.136/0.036 ms
```

## 4.3	创建实例类型

最小的默认flavor消耗每个实例512 MB的内存。 对于包含少于4 GB内存的计算节点的环境，我们建议创建每个实例仅需要64 MB的m1.nano特征。 为了测试目的，请仅将CirrOS图像用于此flavor。

```bash
[root@controller ~]# openstack flavor create --id 0 --vcpus 1 --ram 64 --disk 1 m1.nano
+----------------------------+---------+
| Field                      | Value   |
+----------------------------+---------+
| OS-FLV-DISABLED:disabled   | False   |
| OS-FLV-EXT-DATA:ephemeral  | 0       |
| disk                       | 1       |
| id                         | 0       |
| name                       | m1.nano |
| os-flavor-access:is_public | True    |
| properties                 |         |
| ram                        | 64      |
| rxtx_factor                | 1.0     |
| swap                       |         |
| vcpus                      | 1       |
+----------------------------+---------+
```
这里创建两种规格的实例类型：
```bash
[root@controller ~]# openstack flavor create --id 1 --vcpus 1 --ram 1024 --disk 10 m2.nano 
+----------------------------+---------+
| Field                      | Value   |
+----------------------------+---------+
| OS-FLV-DISABLED:disabled   | False   |
| OS-FLV-EXT-DATA:ephemeral  | 0       |
| disk                       | 10      |
| id                         | 1       |
| name                       | m2.nano |
| os-flavor-access:is_public | True    |
| properties                 |         |
| ram                        | 1024    |
| rxtx_factor                | 1.0     |
| swap                       |         |
| vcpus                      | 1       |
+----------------------------+---------+
```

参数说明：
openstack flavor create 创建主机
- -id 主机ID
- -vcpus cpu数量
- -ram 64（默认是MB，可以写成G）
- -disk 磁盘（默认单位是G）
查看创建的实例类型：

```bash
[root@controller ~]# openstack flavor list
+----+---------+------+------+-----------+-------+-----------+
| ID | Name    |  RAM | Disk | Ephemeral | VCPUs | Is Public |
+----+---------+------+------+-----------+-------+-----------+
| 0  | m1.nano |   64 |    1 |         0 |     1 | True      |
| 1  | m2.nano | 1024 |   10 |         0 |     1 | True      |
+----+---------+------+------+-----------+-------+-----------+
```

切换到admin用户查看创建的实例类型：
 ![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-16919212478959.png)

## 4.4	生成秘钥对

大多数云镜像支持公钥认证，而不是传统的密码认证。 在启动实例之前，您必须将公钥添加到Compute服务。
1.加载demo项目凭证：

```bash
$ . demo-openrc
```

2.生成密钥对并添加公钥：
生成密钥文件（一个公钥文件和一个私钥文件），保存在/root/.ssh/id

```bash
[root@controller ~]# ssh-keygen -q -N ""
Enter file in which to save the key (/root/.ssh/id_rsa): 
```

```bash
[root@controller ~]# ll /root/.ssh/
total 12
-rw------- 1 root root 1675 Jun 11 13:26 id_rsa        #生成的私钥文件
-rw-r--r-- 1 root root  397 Jun 11 13:26 id_rsa.pub    #生成的公钥文件
```

创建秘钥对，并将生成的公钥文件添加到秘钥对：

```bash
 [root@controller ~]# openstack keypair create --public-key ~/.ssh/id_rsa.pub mykey
+-------------+-------------------------------------------------+
| Field       | Value                                           |
+-------------+-------------------------------------------------+
| fingerprint | 6a:2a:05:f3:a8:98:c8:23:65:00:92:6d:24:ee:60:f4 |
| name        | mykey                                           |
| user_id     | a331e97f2ac6444484371a70e1299636                |
+-------------+-------------------------------------------------+
```

3.验证密钥对是否添加成功：

```bash
[root@controller ~]# openstack keypair list  
+-------+-------------------------------------------------+
| Name  | Fingerprint                                     |
+-------+-------------------------------------------------+
| mykey | 6a:2a:05:f3:a8:98:c8:23:65:00:92:6d:24:ee:60:f4 |
+-------+-------------------------------------------------+
```
登录dashboard查看创建的秘钥对：
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192125181212.png)


## 4.5	添加安全组规则
默认情况下，默认安全组适用于所有实例，并包含拒绝对实例进行远程访问的防火墙规则。 对于像CirrOS这样的Linux映像，我们建议至少允许ICMP（ping）和安全shell（SSH）。
向default安全组添加规则：
1.允许ICMP（ping）：

```bash
[root@controller ~]# openstack security group rule create --proto icmp default
+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| created_at        | 2018-06-11T05:32:26Z                 |
| description       |                                      |
| direction         | ingress                              |
| ether_type        | IPv4                                 |
| id                | 30510627-2cfc-4028-9e38-a99a2a581f16 |
| name              | None                                 |
| port_range_max    | None                                 |
| port_range_min    | None                                 |
| project_id        | f3f0c1a2a9f74aa6ac030671f4c7ec33     |
| protocol          | icmp                                 |
| remote_group_id   | None                                 |
| remote_ip_prefix  | 0.0.0.0/0                            |
| revision_number   | 0                                    |
| security_group_id | f2a06fdc-0799-4289-b758-eeec43c16a55 |
| updated_at        | 2018-06-11T05:32:26Z                 |
+-------------------+--------------------------------------+
```

2.允许安全shell（SSH）访问：

```bash
[root@controller ~]#  openstack security group rule create --proto tcp --dst-port 22 default
+-------------------+--------------------------------------+
| Field             | Value                                |
+-------------------+--------------------------------------+
| created_at        | 2018-06-11T05:33:30Z                 |
| description       |                                      |
| direction         | ingress                              |
| ether_type        | IPv4                                 |
| id                | 0f19058a-0bfd-424e-bedd-6249e00d7043 |
| name              | None                                 |
| port_range_max    | 22                                   |
| port_range_min    | 22                                   |
| project_id        | f3f0c1a2a9f74aa6ac030671f4c7ec33     |
| protocol          | tcp                                  |
| remote_group_id   | None                                 |
| remote_ip_prefix  | 0.0.0.0/0                            |
| revision_number   | 0                                    |
| security_group_id | f2a06fdc-0799-4289-b758-eeec43c16a55 |
| updated_at        | 2018-06-11T05:33:30Z                 |
+-------------------+--------------------------------------+
```

查看安全组及创建的安全组规则：

```bash
[root@controller ~]# openstack security group list
+--------------------------------------+---------+------------------------+----------
| ID                                   | Name    | Description            | Project                          |
+--------------------------------------+---------+------------------------+----------
| f2a06fdc-0799-4289-b758-eeec43c16a55 | default | Default security group | f3f0c1a2a9f74aa6ac030671f4c7ec33 |
+--------------------------------------+---------+------------------------+----------
```

```bash
[root@controller ~]# openstack security group rule list
+--------------------------------------+-------------+-----------+------------+------
| ID                                   | IP Protocol | IP Range  | Port Range | Remote Security Group                | Security Group                       |
+--------------------------------------+-------------+-----------+------------+------
| 0f19058a-0bfd-424e-bedd-6249e00d7043 | tcp         | 0.0.0.0/0 | 22:22      | None                                 | f2a06fdc-0799-4289-b758-eeec43c16a55 |
| 20b109d3-bdf1-419e-87d7-1836313b208b | None        | None      |            | f2a06fdc-0799-4289-b758-eeec43c16a55 | f2a06fdc-0799-4289-b758-eeec43c16a55 |
| 30510627-2cfc-4028-9e38-a99a2a581f16 | icmp        | 0.0.0.0/0 |            | None                                 | f2a06fdc-0799-4289-b758-eeec43c16a55 |
| 6772b2c2-c5fc-4eea-bfe3-b9f2a8dad0cb | None        | None      |            | None                                 | f2a06fdc-0799-4289-b758-eeec43c16a55 |
| 97e3620d-6f2a-459a-b712-257fa6e31f9d | None        | None      |            | f2a06fdc-0799-4289-b758-eeec43c16a55 | f2a06fdc-0799-4289-b758-eeec43c16a55 |
| e7dcfc28-924f-455b-b8dd-cfe3e1325c9f | None        | None      |            | None                                 | f2a06fdc-0799-4289-b758-eeec43c16a55 |
+--------------------------------------+-------------+-----------+------------+------
```

切换到demo用户登录dashboard查看创建的安全组规则：
![这里写图片描述](OpenStack-Queens版搭建详解.assets/70-169192125497315.png)

## 4.6	确认实例选项
要启动实例，必须至少指定flavor、镜像名称、网络、安全组、密钥和实例名称。
1.在控制器节点上，获取演示凭据以访问仅限用户的CLI命令：

```bash
$ . demo-openrc
```

2.flavor指定了包括处理器，内存和存储的虚拟资源分配概要文件。
列出可用的flavor：

```bash
[root@controller ~]# openstack flavor list
+----+---------+------+------+-----------+-------+-----------+
| ID | Name    |  RAM | Disk | Ephemeral | VCPUs | Is Public |
+----+---------+------+------+-----------+-------+-----------+
| 0  | m1.nano |   64 |    1 |         0 |     1 | True      |
| 1  | m2.nano | 1024 |   10 |         0 |     1 | True      |
+----+---------+------+------+-----------+-------+-----------+

```

3.列出镜像

```bash
[root@controller ~]# openstack image list
+--------------------------------------+--------+--------+
| ID                                   | Name   | Status |
+--------------------------------------+--------+--------+
| de140769-4ce3-4a1b-9651-07a915b21caa | cirros | active |
+--------------------------------------+--------+--------+
```

本实例使用cirros镜像
4.列出可用的网络

```bash
[root@controller ~]# openstack network list
+--------------------------------------+--------------+------------------------------
| ID                                   | Name         | Subnets                              |
+--------------------------------------+--------------+------------------------------
| 0e728aa4-d9bd-456b-ba0b-dd7df5e15c96 | selfservice1 | e96f6670-3208-40bb-a4f8-21beb37382db |
| 891787bb-ce4a-4b41-b222-1493ec30035c | provider     | 639dcbb3-9bdf-4db8-9734-c4556f1e7972 |
| ded70080-a8d2-41fc-8351-2cf2eb45c308 | selfservice2 | 5137d1b5-f697-4e9a-b0ea-8981e1f1dd3d |
+--------------------------------------+--------------+------------------------------
```

这个实例使用provider提供者网络。但是，您必须使用ID而不是名称来引用此网络。
如果您选择了选项2，则输出还应包含 selfservice自助服务网络。
5.列出可用的安全组：

```bash
[root@controller ~]# openstack security group list
+--------------------------------------+---------+------------------------+----------
| ID                                   | Name    | Description            | Project                          |
+--------------------------------------+---------+------------------------+----------
| 0b8e6943-af2e-4b16-9f06-da3ceb17e105 | default | Default security group | 07f75876b05945e0816b6e219ee6c9f7 |
+--------------------------------------+---------+------------------------+----------
```

此实例使用default安全组。
6.列出可用的秘钥对：

```bash
[root@controller ~]# openstack keypair list  
+-------+-------------------------------------------------+
| Name  | Fingerprint                                     |
+-------+-------------------------------------------------+
| mykey | 6a:2a:05:f3:a8:98:c8:23:65:00:92:6d:24:ee:60:f4 |
+-------+-------------------------------------------------+
```

## 4.7	创建实例
租户网络selfservice1上创建实例：

```bash
$ openstack server create --flavor m1.nano --image cirros \
  --nic net-id=0e728aa4-d9bd-456b-ba0b-dd7df5e15c96 --security-group default \
  --key-name mykey selfservice1-cirros1
```
执行结果：
```bash
[root@controller ~]# openstack server create --flavor m1.nano --image cirros \
>   --nic net-id=0e728aa4-d9bd-456b-ba0b-dd7df5e15c96 --security-group default \
>   --key-name mykey selfservice1-cirros1
+-----------------------------+-----------------------------------------------+
| Field                       | Value                                         |
+-----------------------------+-----------------------------------------------+
| OS-DCF:diskConfig           | MANUAL                                        |
| OS-EXT-AZ:availability_zone |                                               |
| OS-EXT-STS:power_state      | NOSTATE                                       |
| OS-EXT-STS:task_state       | scheduling                                    |
| OS-EXT-STS:vm_state         | building                                      |
| OS-SRV-USG:launched_at      | None                                          |
| OS-SRV-USG:terminated_at    | None                                          |
| accessIPv4                  |                                               |
| accessIPv6                  |                                               |
| addresses                   |                                               |
| adminPass                   | tBi28a8xEiQ9                                  |
| config_drive                |                                               |
| created                     | 2018-06-14T06:59:03Z                          |
| flavor                      | m1.nano (0)                                   |
| hostId                      |                                               |
| id                          | 497b11d9-711d-467d-a1d0-acbebee22f6b          |
| image                       | cirros (de140769-4ce3-4a1b-9651-07a915b21caa) |
| key_name                    | mykey                                         |
| name                        | selfservice1-cirros1                          |
| progress                    | 0                                             |
| project_id                  | f3f0c1a2a9f74aa6ac030671f4c7ec33              |
| properties                  |                                               |
| security_groups             | name='f2a06fdc-0799-4289-b758-eeec43c16a55'   |
| status                      | BUILD                                         |
| updated                     | 2018-06-14T06:59:05Z                          |
| user_id                     | a331e97f2ac6444484371a70e1299636              |
| volumes_attached            |                                               |
+-----------------------------+-----------------------------------------------+
```

参数说明：
openstack server create 创建实例
--flavor 主机类型名称
--image 镜像名称
--nic net-id=网络ID
--security-group 安全组名称
--key-name key名称
最后一个是自定义实例名称
检查实例状态：

```bash
[root@controller ~]# openstack server list
+--------------------------------------+----------------------+--------+-------------
| ID                                   | Name                 | Status | Networks                | Image  | Flavor  |
+--------------------------------------+----------------------+--------+-------------
| 23f3ac0c-4e6f-46be-8a3d-9e291343b441 | selfservice2-cirros2 | ACTIVE | selfservice2=172.16.2.6 | cirros | m1.nano |
| 31f2e6ac-3743-43f6-b6b2-49e22d63373b | selfservice2-cirros1 | ACTIVE | selfservice2=172.16.2.9 | cirros | m1.nano |
| 025d22b8-fd71-4eae-912e-6f54ee4e956f | selfservice1-cirros2 | ACTIVE | selfservice1=172.16.1.5 | cirros | m1.nano |
| 497b11d9-711d-467d-a1d0-acbebee22f6b | selfservice1-cirros1 | ACTIVE | selfservice1=172.16.1.8 | cirros | m1.nano |
+--------------------------------------+----------------------+--------+-------------
```

目前实例地址无法ping通
## 4.8	虚拟控制台访问实例
加载demo-openrc环境

```bash
$ . demo-openrc
```

为您的实例获取虚拟网络计算（VNC）会话URL并从Web浏览器访问它：

```bash
[root@controller ~]# openstack console url show selfservice1-cirros1
+-------+----------------------------------------------------------------------------
| Field | Value                                                                           |
+-------+----------------------------------------------------------------------------
| type  | novnc                                                                           |
| url   | http://controller:6080/vnc_auto.html?token=5dcf9b77-297c-4d6d-9445-f6ba77cb8a18 |
+-------+----------------------------------------------------------------------------
```

如果您的Web浏览器在无法解析控制器主机名的主机上运行，则可以使用控制节点上的管理接口的IP地址替换控制器。

测试实例对外网的访问：

```bash
	ping 172.16.1.1    租户网络网关
	ping 192.168.92.2  本地外部网络网关
	ping www.baidu.com 外部互联网
```

测试全部能够正常ping通

CirrOS映像包含传统的用户名/密码认证，并在登录提示符处提供这些凭据。 登录到CirrOS后，我们建议您使用ping验证网络连接。默认用户名cirros，默认密码gocubsgo

## 4.9	为实例分配浮动IP地址
如果想通过外网远程连接到实例，需要在外部网络上创建浮动IP地址，并将浮动ip地址关联到实例上，然后通过访问外部的浮动ip地址来访问实例：
1.在外部网络上生成浮动ip地址：

```bash
[root@controller ~]# openstack floating ip create provider
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| created_at          | 2018-06-14T07:27:59Z                 |
| description         |                                      |
| fixed_ip_address    | None                                 |
| floating_ip_address | 192.168.92.86                        |
| floating_network_id | 891787bb-ce4a-4b41-b222-1493ec30035c |
| id                  | 0aa48060-ed79-4f60-baa7-0cba7be74ac2 |
| name                | 192.168.92.86                        |
| port_id             | None                                 |
| project_id          | f3f0c1a2a9f74aa6ac030671f4c7ec33     |
| qos_policy_id       | None                                 |
| revision_number     | 0                                    |
| router_id           | None                                 |
| status              | DOWN                                 |
| subnet_id           | None                                 |
| updated_at          | 2018-06-14T07:27:59Z                 |
+---------------------+--------------------------------------+
```

2.将浮动IP地址与实例关联

```bash
$ openstack server add floating ip selfservice1-cirros1 192.168.92.86
```

3.检查浮动IP地址的关联状态

```bash
[root@controller ~]# openstack server list
+--------------------------------------+----------------------+--------+-------------
| ID                                   | Name                 | Status | Networks                               | Image  | Flavor  |
+--------------------------------------+----------------------+--------+-------------
| 23f3ac0c-4e6f-46be-8a3d-9e291343b441 | selfservice2-cirros2 | ACTIVE | selfservice2=172.16.2.6                | cirros | m1.nano |
| 31f2e6ac-3743-43f6-b6b2-49e22d63373b | selfservice2-cirros1 | ACTIVE | selfservice2=172.16.2.9                | cirros | m1.nano |
| 025d22b8-fd71-4eae-912e-6f54ee4e956f | selfservice1-cirros2 | ACTIVE | selfservice1=172.16.1.5                | cirros | m1.nano |
| 497b11d9-711d-467d-a1d0-acbebee22f6b | selfservice1-cirros1 | ACTIVE | selfservice1=172.16.1.8, 192.168.92.86 | cirros | m1.nano |
+--------------------------------------+----------------------+--------+-------------
```

依次生成多个浮动ip对其他实例进行相同操作
3.在控制节点或者外部网络上通过floating IP验证对实例的访问是否正常：
通过来自控制器节点或供应商物理网络上的任何主机的浮动IP地址验证与实例的连接性：
控制节点测试：

```bash
[root@controller ~]# ping 192.168.92.86
PING 192.168.92.86 (192.168.92.86) 56(84) bytes of data.
64 bytes from 192.168.92.86: icmp_seq=1 ttl=63 time=1.59 ms
64 bytes from 192.168.92.86: icmp_seq=2 ttl=63 time=0.856 ms
```

本地主机测试：

```bash
C:\Users\zwpos>ping 192.168.92.86
正在 Ping 192.168.92.86 具有 32 字节的数据:bash
来自 192.168.92.86 的回复: 字节=32 时间=1ms TTL=63
来自 192.168.92.86 的回复: 字节=32 时间=1ms TTL=63
```

## 4.10	远程SSH访问实例
通过控制节点或者远程主机登录实例：

```
[root@controller ~]# ssh cirros@192.168.92.86
The authenticity of host '192.168.92.86 (192.168.92.86)' can't be established.
ECDSA key fingerprint is SHA256:GiuwydTpzXUrQ0K7DYTv7+sJXA5afNJpCnU+t/xsgvE.
ECDSA key fingerprint is MD5:20:a9:81:33:16:0b:34:8e:2f:b6:42:8f:d2:3b:72:7c.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.92.86' (ECDSA) to the list of known hosts.
$ 
$ 
$ ifconfig
eth0      Link encap:Ethernet  HWaddr FA:16:3E:DF:35:7D  
          inet addr:172.16.1.8  Bcast:172.16.1.255  Mask:255.255.255.0
          inet6 addr: fe80::f816:3eff:fedf:357d/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1450  Metric:1
          RX packets:216 errors:0 dropped:0 overruns:0 frame:0
          TX packets:219 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:27246 (26.6 KiB)  TX bytes:23095 (22.5 KiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
$ exit
Connection to 192.168.92.86 closed
[root@controller ~]#
```

## 4.11	网卡变化
创建好内部网络和实例之后，vxlan隧道就建立起来。系统会在控制节点创建一个vxlan 的VTEP，在计算节点创建一个vxlan的VTEP。
如下图，第一张为控制节点，创建vxlan21；第二张为计算节点创建也为vxlan21。这两个VTEP设备组成了vxlan隧道的两个端点。

```bash
[root@controller ~]#  brctl show
bridge name     bridge id               STP enabled     interfaces
brqa248893f-02  8000.02516746fd7d       no             tapcae7f217-1e
                                                        vxlan-21
[root@compute1 ~]# brctl show
bridge name     bridge id               STP enabled     interfaces
brqa248893f-02  8000.a6aaa0e77f45       no              tap8cb57c9e-a7
                                                        vxlan-21
```

通过查看计算节点上vxlan21的详细信息可以看到其连接ens37网卡。

```bash
[root@compute1 ~]# ip -d link show dev vxlan-21 
10: vxlan-21: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1450 qdisc noqueue master brqa248893f-02 state UNKNOWN mode DEFAULT group default qlen 1000
    link/ether a6:aa:a0:e7:7f:45 brd ff:ff:ff:ff:ff:ff promiscuity 1 
vxlan id 21 dev ens37 srcport 0 0 dstport 8472 ageing 300 udpcsum noudp6zerocsumtx noudp6zerocsumrx
```

## 4.12	块存储

### 4.12.1	创建一个卷

```bash
$ . demo-openrc
```
创建1GB大小的卷：

```bash
[root@controller ~]# openstack volume create --size 1 volume1
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| attachments         | []                                   |
| availability_zone   | nova                                 |
| bootable            | false                                |
| consistencygroup_id | None                                 |
| created_at          | 2018-05-15T01:53:57.000000           |
| description         | None                                 |
| encrypted           | False                                |
| id                  | e3d30f58-6c0a-4f13-8433-c274e014fc3f |
| multiattach         | False                                |
| name                | volume1                              |
| properties          |                                      |
| replication_status  | None                                 |
| size                | 1                                    |
| snapshot_id         | None                                 |
| source_volid        | None                                 |
| status              | creating                             |
| type                | None                                 |
| updated_at          | None                                 |
| user_id             | 19ba7d00b87c4132b4fc0c6ee8555fef     |
+---------------------+--------------------------------------+
```
在短时间内，卷状态应该从创建变为可用：
```bash
$ openstack volume list
[root@controller ~]# openstack volume list
+--------------------------------------+---------+-----------+------+-------------+
| ID                                   | Name    | Status    | Size | Attached to |
+--------------------------------------+---------+-----------+------+-------------+
| e3d30f58-6c0a-4f13-8433-c274e014fc3f | volume1 | available |    1 |             |
+--------------------------------------+---------+-----------+------+-------------+
```

### 4.12.2	将卷添加到实例
```bash
$ openstack server add volume INSTANCE_NAME VOLUME_NAME
Replace INSTANCE_NAME with the name of the instance and VOLUME_NAME with the name of the volume you want to attach to it.

Example
Attach the volume1 volume to the provider-instance instance:
$ openstack server add volume provider-instance volume1
Note
This command provides no output.
List volumes:
```

```bash
$ openstack volume list

[root@controller ~]# openstack server add volume provider-vm3 volume1     
[root@controller ~]# openstack volume list
+--------------------------------------+------+-----------+------+---------------------------------------------------------------+
| ID                                   | Name | Status    | Size | Attached to                                                   |
+--------------------------------------+------+-----------+------+---------------------------------------------------------------+
| 5e3c9ff9-dd13-402e-9377-065df66c3960 |      | in-use    |   10 | Attached to cde97911-dc1c-4265-8f14-2bc20ae77973 on /dev/vda  |
| b59a916f-7663-4bee-825f-1c6c240ac49b |      | available |   10 |                                                               |
+--------------------------------------+------+-----------+------+---------------------------------------------------------------+
```

Access your instance using SSH and use the fdisk command to verify presence of the volume as the /dev/vdb block storage device:

```bash
$ sudo fdisk -l
[root@provider-vm3 ~]# fdisk -l

Disk /dev/vda: 10.7 GB, 10737418240 bytes, 20971520 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000b2f10

   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *        2048    20971486    10484719+  83  Linux

Disk /dev/vdb: 1073 MB, 1073741824 bytes, 2097152 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes

[root@provider-vm3 ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        10G  1.1G  9.0G  11% /
devtmpfs        476M     0  476M   0% /dev
tmpfs           497M     0  497M   0% /dev/shm
tmpfs           497M   13M  484M   3% /run
tmpfs           497M     0  497M   0% /sys/fs/cgroup
tmpfs           100M     0  100M   0% /run/user/0

[root@provider-vm3 ~]# lsblk
NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
vda    253:0    0  10G  0 disk 
└─vda1 253:1    0  10G  0 part /
vdb    253:16   0   1G  0 disk 
```

You must create a file system on the device and mount it to use the volume.

```bash
[root@provider-vm3 ~]# parted /dev/vdb
(parted) mkpart primary 0 -1
(parted) toggle 1 lvm  

[root@provider-vm3 ~]# mkfs.xfs /dev/vdb1
meta-data=/dev/vdb1              isize=512    agcount=4, agsize=65474 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=0, sparse=0
data     =                       bsize=4096   blocks=261895, imaxpct=25
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
log      =internal log           bsize=4096   blocks=855, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0 

[root@provider-vm3 ~]# fdisk -l

Disk /dev/vda: 10.7 GB, 10737418240 bytes, 20971520 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000b2f10

   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *        2048    20971486    10484719+  83  Linux
WARNING: fdisk GPT support is currently new, and therefore in an experimental phase. Use at your own discretion.

Disk /dev/vdb: 1073 MB, 1073741824 bytes, 2097152 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: gpt
Disk identifier: 8D328EE8-2A24-4F42-954A-3B817470C5AC


#         Start          End    Size  Type            Name
 1           34      2095199   1023M  Linux LVM       primary
[root@provider-vm3 ~]# lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
vda    253:0    0   10G  0 disk 
└─vda1 253:1    0   10G  0 part /
vdb    253:16   0    1G  0 disk 
└─vdb1 253:17   0 1023M  0 part 
[root@provider-vm3 ~]# mount /dev/vdb1 /data/
[root@provider-vm3 ~]# df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        10G  1.1G  9.0G  11% /
devtmpfs        476M     0  476M   0% /dev
tmpfs           497M     0  497M   0% /dev/shm
tmpfs           497M   13M  484M   3% /run
tmpfs           497M     0  497M   0% /sys/fs/cgroup
tmpfs           100M     0  100M   0% /run/user/0
/dev/vdb1      1020M   33M  988M   4% /data

For more information about how to manage volumes, see the python-openstackclient documentation for Pike or the python-openstackclient documentation for Queens.
```

Return to Launch an instance.
# 5 使用官方云镜像创建实例
在openstack中，glance负责image，即镜像相关的服务，镜像是一个已经打包好的文件，内置有操作系统和预先部署好的软件。基于image创建虚拟机，在openstack中是以backing file的形式创建的，即新建的虚拟机和镜像文件之间建立一个连接。
OpenStack 的 instance(实例，就是虚拟机/云主机) 是通过 Glance 镜像部署的，下载clould 镜像使用标准镜像。主流的Linux发行版都提供可以在 OpenStack 中直接使用的cloud镜像。
## 5.1	下载官方通用云镜像
1、执行环境变量

```bash
[root@controller ~]# . admin-openrc
```

2、centos官网下载qcow2格式的openstack镜像：

```bash
wget http://cloud.centos.org/centos/7/images/CentOS-7-x86_64-GenericCloud-1802.qcow2c
```

官方链接：http://cloud.centos.org/centos/7/images
## 5.2	上传镜像到Glance
```bash
openstack image create "CentOS7-image" \
  --file CentOS-7-x86_64-GenericCloud-1802.qcow2c \
  --disk-format qcow2 --container-format bare \
  --public
```

```bash
[root@controller ~]# openstack image create "CentOS7-image" \
>   --file CentOS-7-x86_64-GenericCloud-1802.qcow2c \
>   --disk-format qcow2 --container-format bare \
>   --public
+------------------+------------------------------------------------------+
| Field            | Value                                                |
+------------------+------------------------------------------------------+
| checksum         | c5e362d0fb6e367ab16a5fbbed2ec1ce                     |
| container_format | bare                                                 |
| created_at       | 2018-06-11T08:40:16Z                                 |
| disk_format      | qcow2                                                |
| file             | /v2/images/5a07a066-31f6-4096-a89c-51e66848523c/file |
| id               | 5a07a066-31f6-4096-a89c-51e66848523c                 |
| min_disk         | 0                                                    |
| min_ram          | 0                                                    |
| name             | CentOS7-image                                        |
| owner            | 9a8169bc534e4705816e97bff4d2866b                     |
| protected        | False                                                |
| schema           | /v2/schemas/image                                    |
| size             | 394918400                                            |
| status           | active                                               |
| tags             |                                                      |
| updated_at       | 2018-06-11T08:40:20Z                                 |
| virtual_size     | None                                                 |
| visibility       | public                                               |
+------------------+------------------------------------------------------+
```

查看上传的镜像

```bash
[root@controller ~]# openstack image list
+--------------------------------------+---------------+--------+
| ID                                   | Name          | Status |
+--------------------------------------+---------------+--------+
| 5a07a066-31f6-4096-a89c-51e66848523c | CentOS7-image | active |
| de140769-4ce3-4a1b-9651-07a915b21caa | cirros        | active |
+--------------------------------------+---------------+--------+
```
## 5.3 创建实例

```bash
# openstack server create --flavor m2.nano --image CentOS7-image \
  --nic net-id=ded70080-a8d2-41fc-8351-2cf2eb45c308 --security-group default \
  --key-name mykey centos7-cloudvm1
```
执行结果：
```bash
[root@controller ~]# openstack server create --flavor m2.nano --image CentOS7-image \
>   --nic net-id=0e728aa4-d9bd-456b-ba0b-dd7df5e15c96 --security-group default \
>   --key-name mykey centos7-cloudvm1
+-----------------------------+------------------------------------------------------+
| Field                       | Value                                                |
+-----------------------------+------------------------------------------------------+
| OS-DCF:diskConfig           | MANUAL                                               |
| OS-EXT-AZ:availability_zone |                                                      |
| OS-EXT-STS:power_state      | NOSTATE                                              |
| OS-EXT-STS:task_state       | scheduling                                           |
| OS-EXT-STS:vm_state         | building                                             |
| OS-SRV-USG:launched_at      | None                                                 |
| OS-SRV-USG:terminated_at    | None                                                 |
| accessIPv4                  |                                                      |
| accessIPv6                  |                                                      |
| addresses                   |                                                      |
| adminPass                   | 9AQfV3mbTdT3                                         |
| config_drive                |                                                      |
| created                     | 2018-06-14T07:40:31Z                                 |
| flavor                      | m2.nano (1)                                          |
| hostId                      |                                                      |
| id                          | d1cf9463-13a2-4066-9d9a-9198b94657d3                 |
| image                       | CentOS7-image (5a07a066-31f6-4096-a89c-51e66848523c) |
| key_name                    | mykey                                                |
| name                        | centos7-cloudvm1                                     |
| progress                    | 0                                                    |
| project_id                  | f3f0c1a2a9f74aa6ac030671f4c7ec33                     |
| properties                  |                                                      |
| security_groups             | name='f2a06fdc-0799-4289-b758-eeec43c16a55'          |
| status                      | BUILD                                                |
| updated                     | 2018-06-14T07:40:31Z                                 |
| user_id                     | a331e97f2ac6444484371a70e1299636                     |
| volumes_attached            |                                                      |
+-----------------------------+------------------------------------------------------
```

## 5.4	为实例分配浮动IP地址
1.在外部网络上生成浮动ip地址：

```bash
[root@controller ~]# openstack floating ip create provider
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| created_at          | 2018-06-14T07:49:42Z                 |
| description         |                                      |
| fixed_ip_address    | None                                 |
| floating_ip_address | 192.168.92.88                        |
| floating_network_id | 891787bb-ce4a-4b41-b222-1493ec30035c |
| id                  | bd9d50fe-12ae-47bd-b79e-a92b8d6fe742 |
| name                | 192.168.92.88                        |
| port_id             | None                                 |
| project_id          | f3f0c1a2a9f74aa6ac030671f4c7ec33     |
| qos_policy_id       | None                                 |
| revision_number     | 0                                    |
| router_id           | None                                 |
| status              | DOWN                                 |
| subnet_id           | None                                 |
| updated_at          | 2018-06-14T07:49:42Z                 |
+---------------------+--------------------------------------+
```

2.将浮动IP地址与实例关联

```bash
$ openstack server add floating ip centos7-cloudvm1 192.168.92.88
```

3.检查浮动IP地址的关联状态

```bash
[root@controller ~]# openstack server list
+--------------------------------------+----------------------+--------+-----------------------------------------+---------------+---------+
| ID                                   | Name                 | Status | Networks                                | Image         | Flavor  |
+--------------------------------------+----------------------+--------+-----------------------------------------+---------------+---------+
| 80fbaee9-e43f-48a0-bbda-c397b0baa9f9 | centos7-cloudvm2     | ACTIVE | selfservice2=172.16.2.5, 192.168.92.87  | CentOS7-image | m2.nano |
| d1cf9463-13a2-4066-9d9a-9198b94657d3 | centos7-cloudvm1     | ACTIVE | selfservice1=172.16.1.13, 192.168.92.88 | CentOS7-image | m2.nano |
| 23f3ac0c-4e6f-46be-8a3d-9e291343b441 | selfservice2-cirros2 | ACTIVE | selfservice2=172.16.2.6, 192.168.92.83  | cirros        | m1.nano |
| 31f2e6ac-3743-43f6-b6b2-49e22d63373b | selfservice2-cirros1 | ACTIVE | selfservice2=172.16.2.9, 192.168.92.89  | cirros        | m1.nano |
| 025d22b8-fd71-4eae-912e-6f54ee4e956f | selfservice1-cirros2 | ACTIVE | selfservice1=172.16.1.5, 192.168.92.85  | cirros        | m1.nano |
| 497b11d9-711d-467d-a1d0-acbebee22f6b | selfservice1-cirros1 | ACTIVE | selfservice1=172.16.1.8, 192.168.92.86  | cirros        | m1.nano |
+--------------------------------------+----------------------+--------+-----------------------------------------+---------------+---------+
```

3.在控制节点或者外部网络上通过floating IP验证对实例的访问是否正常：
通过来自控制器节点或供应商物理网络上的任何主机的浮动IP地址验证与实例的连接性：
控制节点测试：

```bash
[root@controller ~]# ping 192.168.92.88
PING 192.168.92.88 (192.168.92.88) 56(84) bytes of data.
64 bytes from 192.168.92.88: icmp_seq=1 ttl=63 time=1.10 ms
64 bytes from 192.168.92.88: icmp_seq=2 ttl=63 time=1.70 ms
```

本地主机测试：

```bash
C:\Users\zwpos>ping 192.168.92.88
正在 Ping 192.168.92.88 具有 32 字节的数据:
来自 192.168.92.88 的回复: 字节=32 时间=1ms TTL=63
来自 192.168.92.88 的回复: 字节=32 时间=1ms TTL=63
```

## 5.5	远程SSH访问实例
通过控制节点登录实例：

```bash
[root@controller ~]# ssh centos@192.168.92.88
The authenticity of host '192.168.92.88 (192.168.92.88)' can't be established.
ECDSA key fingerprint is SHA256:f/E3cmKXJ8b5uq6rdG7uuaYrAIbN3fh5JOiE14DBM1s.
ECDSA key fingerprint is MD5:b9:15:3a:e0:a3:fc:02:e3:a5:72:96:db:19:62:d4:5d.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.92.88' (ECDSA) to the list of known hosts.
[centos@centos7-cloudvm1 ~]$ 
[centos@centos7-cloudvm1 ~]$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet 172.16.1.13  netmask 255.255.255.0  broadcast 172.16.1.255
        inet6 fe80::f816:3eff:feb1:57c7  prefixlen 64  scopeid 0x20<link>
        ether fa:16:3e:b1:57:c7  txqueuelen 1000  (Ethernet)
        RX packets 312  bytes 34866 (34.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 399  bytes 38141 (37.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1  (Local Loopback)
        RX packets 6  bytes 416 (416.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 6  bytes 416 (416.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[centos@centos7-cloudvm1 ~]$ 
[centos@centos7-cloudvm1 ~]$ ping www.baidu.com
PING www.a.shifen.com (111.13.100.91) 56(84) bytes of data.
64 bytes from 111.13.100.91 (111.13.100.91): icmp_seq=1 ttl=127 time=79.8 ms
64 bytes from 111.13.100.91 (111.13.100.91): icmp_seq=2 ttl=127 time=86.8 ms
[centos@centos7-cloudvm1 ~]$ exit
logout
Connection to 192.168.92.88 closed.
[root@controller ~]# 
```

修改实例root密码并开启SSH远程密码登录：

```bash
[root@controller ~]# ssh centos@192.168.92.88
Last login: Thu Jun 14 08:05:06 2018 from 192.168.92.70
[centos@centos7-cloudvm1 ~]$ 
[centos@centos7-cloudvm1 ~]$ 
[centos@centos7-cloudvm1 ~]$ sudo su root
[root@centos7-cloudvm1 centos]# passwd root
Changing password for user root.
New password: 
BAD PASSWORD: The password is shorter than 8 characters
Retype new password: 
passwd: all authentication tokens updated successfully.
[root@centos7-cloudvm1 centos]# vi /etc/ssh/sshd_config  
     63 PasswordAuthentication yes
     64 #PermitEmptyPasswords no
     65 #PasswordAuthentication no
[root@centos7-cloudvm1 centos]# systemctl restart sshd
[root@centos7-cloudvm1 centos]# exit
exit
[centos@centos7-cloudvm1 ~]$ exit
logout
Connection to 192.168.92.88 closed.
[root@controller ~]#
```

使用root账号及设置的密码访问实例：

# 6	查看当前网卡状态
## 6.1	控制节点

```bash
[root@controller ~]# nmcli connection show 
NAME            UUID                                  TYPE      DEVICE         
brq0e728aa4-d9  b29ab3b7-6eb6-40f4-8360-6fea6620ccef  bridge    brq0e728aa4-d9 
brq891787bb-ce  600d2b50-9521-4e6f-a50f-3bf9b3db00bf  bridge    brq891787bb-ce 
brqded70080-a8  65dccec5-374e-4a5d-a03f-b2d5b665f089  bridge    brqded70080-a8 
ens33           c96bc909-188e-ec64-3a96-6a90982b08ad  ethernet  ens33          
ens37           4a5516a4-dfa4-24af-b1c4-e843e312e2fd  ethernet  ens37          
ens38           be9e2b6b-674b-771d-7251-f3b49b3d23e0  ethernet  ens38 

[root@controller ~]# ifconfig
brq0e728aa4-d9: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::ac39:edff:fec6:c45f  prefixlen 64  scopeid 0x20<link>
        ether 3a:68:b1:d8:6d:9b  txqueuelen 1000  (Ethernet)
        RX packets 33  bytes 3664 (3.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 17  bytes 1306 (1.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

brq891787bb-ce: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.92.70  netmask 255.255.255.0  broadcast 192.168.92.255
        inet6 fe80::fc86:9ff:fe03:c43f  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:2d  txqueuelen 1000  (Ethernet)
        RX packets 5719  bytes 557494 (544.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 4793  bytes 1033122 (1008.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

brqded70080-a8: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::6c74:8eff:fe52:6442  prefixlen 64  scopeid 0x20<link>
        ether 0a:10:fd:ab:d1:c3  txqueuelen 1000  (Ethernet)
        RX packets 33  bytes 3664 (3.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 17  bytes 1306 (1.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.90.70  netmask 255.255.255.0  broadcast 192.168.90.255
        inet6 fe80::b01a:e132:1923:175  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::2801:f5c2:4e5a:d003  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:19  txqueuelen 1000  (Ethernet)
        RX packets 35429  bytes 10882222 (10.3 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 36847  bytes 21538725 (20.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.91.70  netmask 255.255.255.0  broadcast 192.168.91.255
        inet6 fe80::e8fe:eea6:f4f:2d85  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::8af8:8b5c:793f:e719  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:23  txqueuelen 1000  (Ethernet)
        RX packets 2074  bytes 315225 (307.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1955  bytes 300345 (293.3 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens38: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::e64:a89f:4312:ea34  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::e8d3:6442:89c0:cd4a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:cb:a5:2d  txqueuelen 1000  (Ethernet)
        RX packets 6508  bytes 707299 (690.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 5151  bytes 1209445 (1.1 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 330429  bytes 152354583 (145.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 330429  bytes 152354583 (145.2 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tap14879488-27: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether 0a:10:fd:ab:d1:c3  txqueuelen 1000  (Ethernet)
        RX packets 14  bytes 2860 (2.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 43  bytes 4742 (4.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tap4ec496dd-eb: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether f2:c7:25:13:9f:a8  txqueuelen 1000  (Ethernet)
        RX packets 396  bytes 42433 (41.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 605  bytes 53467 (52.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tapab188c3f-b3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether 3a:68:b1:d8:6d:9b  txqueuelen 1000  (Ethernet)
        RX packets 1394  bytes 154190 (150.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1349  bytes 158192 (154.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tapcf05d8bf-49: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        ether 02:58:51:86:86:42  txqueuelen 1000  (Ethernet)
        RX packets 5  bytes 446 (446.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 506  bytes 67655 (66.0 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tape509b650-a8: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether b6:49:0f:82:12:66  txqueuelen 1000  (Ethernet)
        RX packets 14  bytes 2862 (2.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 45  bytes 4938 (4.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tapf7f21425-dd: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        ether be:90:00:50:f1:c7  txqueuelen 1000  (Ethernet)
        RX packets 1092  bytes 130261 (127.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1618  bytes 195371 (190.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

vxlan-15: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether 26:1e:8c:c6:00:dd  txqueuelen 1000  (Ethernet)
        RX packets 593  bytes 44165 (43.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 395  bytes 38529 (37.6 KiB)
        TX errors 0  dropped 13 overruns 0  carrier 0  collisions 0

vxlan-60: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether 76:a4:93:79:a9:25  txqueuelen 1000  (Ethernet)
        RX packets 1337  bytes 138474 (135.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1394  bytes 136372 (133.1 KiB)
        TX errors 0  dropped 12 overruns 0  carrier 0  collisions 0
```

## 6.2	计算节点

```bash
[root@compute1 ~]# nmcli connection show 
NAME            UUID                                  TYPE      DEVICE         
brq0e728aa4-d9  431e9bbf-693c-4d98-8286-589c7ecbee0d  bridge    brq0e728aa4-d9 
brqded70080-a8  8675b492-79c5-45c8-8400-f3936482954f  bridge    brqded70080-a8 
ens33           c96bc909-188e-ec64-3a96-6a90982b08ad  ethernet  ens33          
ens37           4a5516a4-dfa4-24af-b1c4-e843e312e2fd  ethernet  ens37          
ens38           be9e2b6b-674b-771d-7251-f3b49b3d23e0  ethernet  ens38          
tap1a3efab6-a1  f5b8cfef-da22-482e-98bf-ee3137e31c9f  tun       tap1a3efab6-a1 
tap408bc2a8-be  4cad16d6-b230-403f-8437-7f2d98058125  tun       tap408bc2a8-be 
tap6b748b48-0d  93d4510d-2561-40e6-8ed9-4562f256ae49  tun       tap6b748b48-0d 
tap6d4494a7-e1  dcc21992-40e3-4518-a886-16e41cb51c45  tun       tap6d4494a7-e1 
tapcde22017-68  badb01a0-2873-413a-9ad5-b2865015501d  tun       tapcde22017-68 
tape805da2d-7d  8b65da89-d6ef-424b-8399-3c0756c7b4ad  tun       tape805da2d-7d 

[root@compute1 ~]# ifconfig
brq0e728aa4-d9: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether 5a:c1:f3:b2:68:3b  txqueuelen 1000  (Ethernet)
        RX packets 37  bytes 3888 (3.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

brqded70080-a8: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether ea:e2:23:3f:a9:bb  txqueuelen 1000  (Ethernet)
        RX packets 36  bytes 3832 (3.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.90.71  netmask 255.255.255.0  broadcast 192.168.90.255
        inet6 fe80::2801:f5c2:4e5a:d003  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:c7:ba:9b  txqueuelen 1000  (Ethernet)
        RX packets 21122  bytes 8993984 (8.5 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 21860  bytes 13934762 (13.2 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.91.71  netmask 255.255.255.0  broadcast 192.168.91.255
        inet6 fe80::8af8:8b5c:793f:e719  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:c7:ba:a5  txqueuelen 1000  (Ethernet)
        RX packets 1950  bytes 300027 (292.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2098  bytes 317035 (309.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens38: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.92.71  netmask 255.255.255.0  broadcast 192.168.92.255
        inet6 fe80::e8d3:6442:89c0:cd4a  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:c7:ba:af  txqueuelen 1000  (Ethernet)
        RX packets 857  bytes 81958 (80.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 871  bytes 60043 (58.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 47342  bytes 2485515 (2.3 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 47342  bytes 2485515 (2.3 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tap1a3efab6-a1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::fc16:3eff:fe31:3c68  prefixlen 64  scopeid 0x20<link>
        ether fe:16:3e:31:3c:68  txqueuelen 1000  (Ethernet)
        RX packets 366  bytes 32031 (31.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 256  bytes 27425 (26.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tap408bc2a8-be: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::fc16:3eff:feeb:f259  prefixlen 64  scopeid 0x20<link>
        ether fe:16:3e:eb:f2:59  txqueuelen 1000  (Ethernet)
        RX packets 117  bytes 10449 (10.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 96  bytes 10262 (10.0 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tap6b748b48-0d: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::fc16:3eff:fedc:83c4  prefixlen 64  scopeid 0x20<link>
        ether fe:16:3e:dc:83:c4  txqueuelen 1000  (Ethernet)
        RX packets 128  bytes 11365 (11.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 107  bytes 11298 (11.0 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tap6d4494a7-e1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::fc16:3eff:feb1:57c7  prefixlen 64  scopeid 0x20<link>
        ether fe:16:3e:b1:57:c7  txqueuelen 1000  (Ethernet)
        RX packets 986  bytes 120892 (118.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1107  bytes 119680 (116.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tapcde22017-68: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::fc16:3eff:fef1:bb5f  prefixlen 64  scopeid 0x20<link>
        ether fe:16:3e:f1:bb:5f  txqueuelen 1000  (Ethernet)
        RX packets 115  bytes 10293 (10.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 95  bytes 10212 (9.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

tape805da2d-7d: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet6 fe80::fc16:3eff:fedf:357d  prefixlen 64  scopeid 0x20<link>
        ether fe:16:3e:df:35:7d  txqueuelen 1000  (Ethernet)
        RX packets 228  bytes 25193 (24.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 236  bytes 29034 (28.3 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

vxlan-15: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether ea:e2:23:3f:a9:bb  txqueuelen 1000  (Ethernet)
        RX packets 396  bytes 38557 (37.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 596  bytes 44345 (43.3 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

vxlan-60: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        ether 5a:c1:f3:b2:68:3b  txqueuelen 1000  (Ethernet)
        RX packets 1397  bytes 136480 (133.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1340  bytes 138606 (135.3 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

##  6.3	存储节点

```bash
[root@cinder1 ~]# nmcli connection show 
NAME   UUID                                  TYPE      DEVICE 
ens33  c96bc909-188e-ec64-3a96-6a90982b08ad  ethernet  ens33  
ens37  4a5516a4-dfa4-24af-b1c4-e843e312e2fd  ethernet  ens37  

[root@cinder1 ~]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.90.72  netmask 255.255.255.0  broadcast 192.168.90.255
        inet6 fe80::ffb5:9b12:f911:89ec  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::b01a:e132:1923:175  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::2801:f5c2:4e5a:d003  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:97:4f:52  txqueuelen 1000  (Ethernet)
        RX packets 26610  bytes 7137357 (6.8 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 32848  bytes 8610398 (8.2 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.92.72  netmask 255.255.255.0  broadcast 192.168.92.255
        inet6 fe80::8af8:8b5c:793f:e719  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:97:4f:5c  txqueuelen 1000  (Ethernet)
        RX packets 2718  bytes 210586 (205.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1972  bytes 142053 (138.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 95  bytes 8360 (8.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 95  bytes 8360 (8.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```