## 一、DHCP介绍

在LAN(局域网)中我们常会遇到以下的情况：

```
1）不知道如何配置IP地址及相关信息的员工，无法上网；

2）IP地址配置冲突，无法上网；

3）来访用户因不熟悉公司网络情况无法上网；
```

以上这些情况都是日常最常见也是最无脑的工作，公司网络管理员需要不停的去帮忙去解决这些问题，以此来保障公司网络的正常使用及员工的正常用网需求。而这些工作对于网络管理员来说实在是太低级、太无脑、太繁琐了，会消耗网络管理员的大量工作时间，也会影响公司员工的工作效能。那么如何通过其他的方法让计算机就能直接解决了上述问题，从而解放网络管理员呢？DHCP就是一个不二的选择。

DHCP(Dynamic Host Configuration Protocol，动态主机配置协议),通常被应用在局域网络环境中，主要作用是集中的管理、分配IP地址，使网络环境中的主机动态的获得IP地址、Gateway地址、DNS服务器地址等信息，并能够提升地址的使用率。由于DHCP是一个UDP协议，所以运行起来更加高效。

DHCP协议采用客户端/服务器模型(C/S模型)，服务端可以为客户端提供IP、掩码、网关、主机名、DNS等信息。客户端只需将IP获得方式设置为自动获取即可。

目前可以提供DHCP服务的设备有很多，比如:

- DHCP服务器(windows server、linux)
- 硬件路由器
- 家用宽带路由

## 二、DHCP应用场景

1）公司局域网环境

2）家庭局域网环境

3）公共场合的wifi环境

4）宽带环境网络

```
使用DHCP的优点：

1）傻瓜式接入：用户只需懂得插网线到电脑，或者输入WiFi密码接入网络即可实现联网

2）IP高效利用：及时回收IP机制，保证IP的高利用性，特别是对IP不足的网络

3）避免IP冲突：避免IP冲突，保证网络的高效利用，保证公司员工及临时人员高效工作

4）降低了公司网络管理员的工作量，提升了工作效率
```

## 三、DHCP工作原理

![image20200113193556339.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602997688363.png)

### 3.1）工作方式

IP获得需要通过发广播来实现客户端和服务器的通信，所以DHCP只能工作在局域网。

### 3.2）工作原理解析

1、Client：向网络中发送广播，通过自己的UDP协议的68号端口向网络中发送DHCP Discover包，用来寻找网络中的DHCP Server.类似于你在你的公司大喊一声:"谁是公司老板"一样的道理。

2、Server：局域网中的所有DHCP服务器都能收到该Client发送的广播包，然后DHCP Server会检查自己的IP池中(也叫做作用域)是否还有可用IP可以分发。如果有的话，会直接将这个IP地址从池中拿出来，避免在发给别的客户端，并且通过自己的UDP协议的67号端口给Client发一个响应包DHCP Offer,同样通信是采用广播的方式，明确告诉其可以提供哪个IP给Client使用。类似于公司的几个老板都在公司喊了一声：“我是X老板，我有时间在哪个办公室接待你”。

3、Client：Client会收到局域网中的所有DHCP服务器发给自己的DHCP Offer包，默认选一个最优的DHCP Server进行IP获取（在这里就是第一个发送给他DHCP Offer的服务器算作最优）。然后继续向网络中通过UDP的68号端口发广播DHCP Resquest，明确指定DHCP Server IP地址和需要租用的IP地址,告诉它要从他这里获得IP信息。自然其他DHCP Server也能收到广播，确认不从自己这里拿IP信息后，会将上步从IP池中拿出来的IP在释放到池中，以便别人使用。类似于你在公司大喊一声：“李老板，我找你接待”，那么其他老板刚才计划接待你的时间就会被释放出来，用于接待别的客户。

4、Server：被确认的DHCP Server就会通过其UDP协议的67号端口发送DHCP ACK确认包，采用广播将IP、掩码、网关、DNS等信息还有IP租约一起发送给DHCP Client，Client确认IP可用后，根据IP租约开始计算使用时间。类似于李老板把你请进他的办公室，开始和你聊天，并计算聊天时间为30分钟，开始倒计时。

### 3.3)计算机获得IP的时间点

a、计算机开机

b、网卡接通网络

c、重启网卡服务

### 3.4）租约更新阶段

a、租约完成1/2

b、租约完成7/8

c、租约到期

## 四、DHCP服务器部署

**约定：本实验中使用过的机器为centos8.0_x86_64系统，计算机名称:localhost.localdomain,IP地址192.168.11.16/24.请关闭防火墙和SELINUX。**

### 4.1）DHCP安装

```
[root@zutuanxue ~]# dnf -y install dhcp-server
```

### 4.2）DHCP配置文件详解

默认情况下，dhcp服务并没有提供配置文件，只是给提供了一个demo,存放在/usr/share/doc/dhcp-server/目录下.我们将demo文件拷贝到/etc/dhcp目录下，并且命名为dhcpd.conf。

```
[root@zutuanxue ~]# cp /usr/share/doc/dhcp-server/dhcpd.conf.example /etc/dhcp/dhcpd.conf 
cp：是否覆盖"/etc/dhcp/dhcpd.conf" y
```

配置文件详解

```
[root@zutuanxue ~]# cat /etc/dhcp/dhcpd.conf
# #号代表注释
# DHCP服务配置文件分为全局配置和作用域配置，很好区分：subnet的就是作用域 不在subnet里面的就是全局设置。
# dhcpd.conf
#
# Sample configuration file for ISC dhcpd
#

#DNS全局选项，指定DNS服务器的地址，可以是IP，也可以是域名。
# option definitions common to all supported networks...
# DNS的域名
option domain-name "example.org";

#具体的DNS服务器
option domain-name-servers ns1.example.org, ns2.example.org;

#默认租约为600s
default-lease-time 600;
#最大租约为7200s，客户机会在default-lease-time快到期时向服务器续租，如果此时客户机死机/重启，而默认租约时间到期了，服务器并不会立即回收IP地址，而是等到最大租约时间到期，客户机还没有过来续约，才会回收IP地址。
max-lease-time 7200;

#动态DNS更新方式(none:不支持；interim:互动更新模式；ad-hoc:特殊更新模式)
# Use this to enble / disable dynamic dns updates globally.
#ddns-update-style none;

#如果该DHCP服务器是本地官方DHCP就将此选项打开，避免其他DHCP服务器的干扰。
#当一个客户端试图获得一个不是该DHCP服务器分配的IP信息，DHCP将发送一个拒绝消息，而不会等待请求超时。当请求被拒绝，客户端会重新向当前DHCP发送IP请求获得新地址。保证IP是自己发出去的
#
# If this DHCP server is the official DHCP server for the local
# network, the authoritative directive should be uncommented.
#authoritative;

# Use this to send dhcp log messages to a different log file (you also
# have to hack syslog.conf to complete the redirection).
# 日志级别
log-facility local7;

# No service will be given on this subnet, but declaring it helps the 
# DHCP server to understand the network topology.

#作用域相关设置指令
#subnet 定义一个作用域
#netmask 定义作用域的掩码
#range 允许发放的IP范围
#option routers 指定网关地址
#option domain-name-servers 指定DNS服务器地址
#option broadcast-address 广播地址
#
#
#案例:定义一个作用域 网段为10.152.187.0 掩码为255.255.255.0
#此作用域不提供任何服务
subnet 10.152.187.0 netmask 255.255.255.0 {
}

# This is a very basic subnet declaration.

#案例:定义一个基本的作用域
#网段10.254.239.0 掩码255.255.255.224
#分发范围10.254.239.10-20
#网关为rtr-239-0-1.example.org, rtr-239-0-2.example.org
subnet 10.254.239.0 netmask 255.255.255.224 {
  range 10.254.239.10 10.254.239.20;
  option routers rtr-239-0-1.example.org, rtr-239-0-2.example.org;
}

# This declaration allows BOOTP clients to get dynamic addresses,
# which we don't really recommend.
#案例:允许采用bootp协议的客户端动态获得地址
#bootp DHCP的前身
#BOOTP用于无盘工作站的局域网中，可以让无盘工作站从一个中心服务器上获得IP地址。通过BOOTP协议可以为局域网中的无盘工作站分配动态IP地址，
#这样就不需要管理员去为每个用户去设置静态IP地址。
subnet 10.254.239.32 netmask 255.255.255.224 {
  range dynamic-bootp 10.254.239.40 10.254.239.60;
  option broadcast-address 10.254.239.31;
  option routers rtr-239-32-1.example.org;
}


#案例:一个简单的作用域案例
# A slightly different configuration for an internal subnet.
subnet 10.5.5.0 netmask 255.255.255.224 {
  range 10.5.5.26 10.5.5.30;
  option domain-name-servers ns1.internal.example.org;
  option domain-name "internal.example.org";
  option routers 10.5.5.1;
  option broadcast-address 10.5.5.31;
  default-lease-time 600;
  max-lease-time 7200;
}

# Hosts which require special configuration options can be listed in
# host statements.   If no address is specified, the address will be
# allocated dynamically (if possible), but the host-specific information
# will still come from the host declaration.
#
#保留地址:可以将指定的IP分发给指定的机器，根据网卡的MAC地址来做触发
#host: 启用保留。
#hardware:指定客户端的mac地址
#filename:指定文件名
#server-name:指定下一跳服务器地址
#fixed-address: 指定保留IP地址
#
#
#案例:这个案例中分发给客户端的不是IP地址信息，而是告诉客户端去找toccata.fugue.com服务器，并且下载vmunix.passacaglia文件
host passacaglia {
  hardware ethernet 0:0:c0:5d:bd:95;
  filename "vmunix.passacaglia";
  server-name "toccata.fugue.com";
}

# Fixed IP addresses can also be specified for hosts.   These addresses
# should not also be listed as being available for dynamic assignment.
# Hosts for which fixed IP addresses have been specified can boot using
# BOOTP or DHCP.   Hosts for which no fixed address is specified can only
# be booted with DHCP, unless there is an address range on the subnet
# to which a BOOTP client is connected which has the dynamic-bootp flag
# set.
# 案例:保留地址，将指定IP(fantasia.fugue.com对应的IP)分给指定客户端网卡(MAC:08:00:07:26:c0:a5)
host fantasia {
  hardware ethernet 08:00:07:26:c0:a5;
  fixed-address fantasia.fugue.com;
}

#超级作用域
#超级作用域是DHCP服务中的一种管理功能，使用超级作用域，可以将多个作用域组合为单个管理实体。
# You can declare a class of clients and then do address allocation
# based on that.   The example below shows a case where all clients
# in a certain class get addresses on the 10.17.224/24 subnet, and all
# other clients get addresses on the 10.0.29/24 subnet.


#在局域网中，可以配置策略根据各个机器的具体信息分配IP地址和其他的网络参数，客户机的具体信息：客户机能够给dhcp服务提供的信息由有两个，
#第一个就是网卡的dhcp-client-identifier（mac地址），
#第二个就是设备的vendor-class-identifier。
#管理员可以根据这两个信息给不同的机器分组。

#案例:
#按client某种类型分组DHCP,而不是按物理接口网段
#例子: SUNW 分配地址段10.17.224.0/24
# 非SUNW的主机,分配地址段10.0.29.0/24
#定义一个dhcp类:foo
#request广播中vendor-class-identifier字段对应的值前四个字节如果是"SUNW",则视合法客户端.
class "foo" {
  match if substring (option vendor-class-identifier, 0, 4) = "SUNW";
}

#定义一个超级作用域: 224-29
shared-network 224-29 {
#定义第一个作用域
  subnet 10.17.224.0 netmask 255.255.255.0 {
    option routers rtr-224.example.org;
  }
#定义第二个作用域
  subnet 10.0.29.0 netmask 255.255.255.0 {
    option routers rtr-29.example.org;
  }

#关连池,如果客户端匹配foo类，将获得该池地址
  pool {
    allow members of "foo";
    range 10.17.224.10 10.17.224.250;
  }
#关连池,如果客户端配置foo类，则拒绝获得该段地址
  pool {
    deny members of "foo";
    range 10.0.29.10 10.0.29.230;
  }
}
```

### 4.3）DHCP启动

```
[root@zutuanxue ~]# systemctl enable dhcpd
Created symlink from /etc/systemd/system/multi-user.target.wants/dhcpd.service to /usr/lib/systemd/system/dhcpd.service.
[root@zutuanxue ~]# systemctl start dhcpd

注意：可能发现无法启动DHCP服务，原因是DHCP在启动的时候检查配置文件，发现并没有有效作用域（和服务器同网段的作用域）。
```

## 五、DHCP作用域

**教学案例一、配置一个作用域，用于为本地局域网中的计算机发放IP信息。要求：**

本地网段:192.168.11.0/24

发放IP地址：192.168.11.153–252

网关：192.168.11.254

DNS1：202.106.0.20

DNS2：114.114.114.114

默认租约为两个小时

最大租约为3个小时

**本DHCP服务器为本地权威DHCP，要求可以本地所有计算机获得IP都是由本DHCP发放**

### 5.1)DHCP服务配置

```
[root@zutuanxue dhcp]# cat /etc/dhcp/dhcpd.conf
option domain-name-servers 202.106.0.20, 114.114.114.114;
#声明DNS服务器
default-lease-time 7200;  #定义默认租约时间
max-lease-time 10800;		#定义最大租约时间
authoritative;	#拒绝不正确的IP地址的要求
log-facility local7;	#定义日志

subnet 192.168.11.0 netmask 255.255.255.0 {
  range 192.168.11.153 192.168.11.252;
  option routers 192.168.11.254;
  option broadcast-address 192.168.11.255;
  default-lease-time 7200;
  max-lease-time 10800;
}

请根据4.2中的讲解理解配置文件内容。
```

### 5.2）重启DHCP服务，生效配置

```
#重启dhcpd服务
[root@zutuanxue dhcp]# systemctl restart dhcpd

#查看启动情况，同时也验证了客户端使用的是68端口，服务端使用的是67端口
[root@zutuanxue dhcp]# lsof -i :68
COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
dhclient 55234 root    6u  IPv4 110700      0t0  UDP *:bootpc 
[root@zutuanxue dhcp]# lsof -i :67
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
dnsmasq  1507 nobody    3u  IPv4  27149      0t0  UDP *:bootps 
dhcpd   56570  dhcpd    7u  IPv4 129157      0t0  UDP *:bootps
```

### 5.3）测试IP分发

打开一个客户端机器，IP获得方式为自动获取，测试是否获得到了自己这个DHCP服务器发放的IP地址。本例子中测试机使用了centos 8系统。来看下测试结果吧！

```
1) 查看一下当前eth0的IP地址、MAC地址，并保证其IP获得方式为:DHCP
[root@test 桌面]# ifconfig eth0
eth0      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:BD  
          inet addr:172.16.44.132  Bcast:172.16.44.255  Mask:255.255.255.0
          inet6 addr: fe80::20c:29ff:fe1a:f8bd/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:86 errors:0 dropped:0 overruns:0 frame:0
          TX packets:63 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:15294 (14.9 KiB)  TX bytes:6769 (6.6 KiB)


2）使用dhclient命令来获得IP，看一下重要输出
[root@test 桌面]# dhclient -d eth0
Internet Systems Consortium DHCP Client 4.1.1-P1
Copyright 2004-2010 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth0/00:0c:29:1a:f8:bd
Sending on   LPF/eth0/00:0c:29:1a:f8:bd
Sending on   Socket/fallback
DHCPDISCOVER on eth0 to 255.255.255.255 port 67 interval 6 (xid=0x316768c3)      发广播寻找DHCP服务器
DHCPOFFER from 192.168.11.16                                                     192.168.11.16DHCP服务器应答
DHCPREQUEST on eth0 to 255.255.255.255 port 67 (xid=0x316768c3)                  client向服务器请求IP地址
DHCPACK from 192.168.11.16 (xid=0x316768c3)                                      确认租赁关系
bound to 192.168.11.156 -- renewal in 2983 seconds.                              client分得IP:192.168.11.156

注意：看到这些信息后，按CTRL+C退出。
dhclient是一个DHCP协议客户端，它使用DHCP协议或者BOOTP协议或在这两个协议都不可用时使用静态地址来配置一个或多个网络接口
dhclient -r 释放IP地址
dhclient -d 强制dhclient作为前台进程运行。 通常情况下，DHCP客户端将在前台运行,直到配置了一个接口,此时它将恢复为在后
            台运行。               




3) 服务器日志查看验证获取信息
[root@zutuanxue ~]# tailf /var/log/messages
Feb 21 13:40:44 baism dhcpd: DHCPDISCOVER from 00:0c:29:1a:f8:bd via ens33
Feb 21 13:40:45 baism dhcpd: DHCPOFFER on 192.168.11.156 to 00:0c:29:1a:f8:bd via ens33
Feb 21 13:40:45 baism dhcpd: DHCPREQUEST for 192.168.11.156 (192.168.11.16) from 00:0c:29:1a:f8:bd via ens33
Feb 21 13:40:45 baism dhcpd: DHCPACK on 192.168.11.156 to 00:0c:29:1a:f8:bd via ens33

4) 在client上通过ifconfig命令再次查看eth0 IP地址，验证是否为192.168.11.156
[root@test 桌面]# ifconfig eth0
eth0      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:BD  
          inet addr:192.168.11.156  Bcast:192.168.11.255  Mask:255.255.255.0
          inet6 addr: fe80::20c:29ff:fe1a:f8bd/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:97 errors:0 dropped:0 overruns:0 frame:0
          TX packets:67 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:17364 (16.9 KiB)  TX bytes:7537 (7.3 KiB)


5）查看网关，确定网关为192.168.11.254
[root@test 桌面]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
192.168.11.0    0.0.0.0         255.255.255.0   U     0      0        0 eth1
192.168.11.0    0.0.0.0         255.255.255.0   U     0      0        0 eth0
169.254.0.0     0.0.0.0         255.255.0.0     U     1003   0        0 eth1
0.0.0.0         192.168.11.254  0.0.0.0         UG    0      0        0 eth0


6）查看DNS配置文件，看DNS是否为DHCP服务器发放的DNS服务器IP
[root@test 桌面]# cat /etc/resolv.conf 
; generated by /sbin/dhclient-script
nameserver 202.106.0.20
nameserver 114.114.114.114
```

### 5.4）通过DHCP服务器租约文件查看具体租约

租约文件的路径: /var/lib/dhcpd/dhcpd.leases

```
[root@zutuanxue ~]# cat /var/lib/dhcpd/dhcpd.leases
# The format of this file is documented in the dhcpd.leases(5) manual page.
# This lease file was written by isc-dhcp-4.3.6

# authoring-byte-order entry is generated, DO NOT DELETE
authoring-byte-order little-endian;

server-duid "\000\001\000\001%\257\376\022\000\014)c.\345";

lease 192.168.11.153 {
  starts 2 2020/01/14 04:21:04;	#开始时间
  ends 2 2020/01/14 06:21:04;		#结束时间
  cltt 2 2020/01/14 04:21:04;
  binding state active;
  next binding state free;
  rewind binding state free;
  hardware ethernet 00:0c:29:6d:1c:b3;
  uid "\001\000\014)m\034\263";
}



注意：当你发现这里的时间和你的服务器时间不一致的时候，建议你修改时区解决问题，一般是差8个小时，大家明白就好。
```

### 5.5）保留IP

在IP租约到期后，如果无法续订租约，client只能乖乖交出IP地址，重新获得一个其他IP使用。但是在公司有些服务器的IP地址是不能变化的，因为变了用户就无法连接到服务器了，比如公司文件服务器、打印服务器等等。那么在这种环境中我们既想使用DHCP管理公司IP，又想实现部分机器的IP永久不变，那么怎么实现呢。

DHCP的作者在写DHCP的时候也想到了这个问题，提出了保留IP的概念，就是将某些IP保留，然后服务器来获得IP的时候，根据其MAC地址做匹配，将对应的IP分给它即可。

**教学案例:希望这个MAC地址为00:0C:29:1A:F8:C7的网卡能永久获得IP 192.168.11.252，实现方式如下:**

```
 a、在配置文件/etc/dhcp/dhcpd.conf末尾添加以下内容
 host print {         
  hardware ethernet 00:0C:29:1A:F8:C7;
  fixed-address 192.168.11.252;
}

host print    host为指令，print是个名字，随便起，但是最好有意义，要不过一段你也记不住了。
hardware ethernet 指定以太网网卡MAC地址
fixed-address 指定要绑定的IP

b、重启DHCP服务
[root@zutuanxue ~]# systemctl restart dhcpd

c、测试，登陆测试机，释放挡墙IP，重新获得新的IP，查看IP地址是否正确分发
[root@test 桌面]# ifconfig eth1
eth1      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:C7  
          inet addr:192.168.11.155  Bcast:192.168.11.255  Mask:255.255.255.0
          inet6 addr: fe80::20c:29ff:fe1a:f8c7/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:4071 errors:0 dropped:0 overruns:0 frame:0
          TX packets:187 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:433880 (423.7 KiB)  TX bytes:16888 (16.4 KiB)

[root@test 桌面]# dhclient -r eth1

[root@test 桌面]# dhclient -d eth1
Internet Systems Consortium DHCP Client 4.1.1-P1
Copyright 2004-2010 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth1/00:0c:29:1a:f8:c7
Sending on   LPF/eth1/00:0c:29:1a:f8:c7
Sending on   Socket/fallback
DHCPDISCOVER on eth1 to 255.255.255.255 port 67 interval 4 (xid=0x45c162c2)
DHCPOFFER from 192.168.11.16
DHCPREQUEST on eth1 to 255.255.255.255 port 67 (xid=0x45c162c2)
DHCPACK from 192.168.11.16 (xid=0x45c162c2)
bound to 192.168.11.252 -- renewal in 2881 seconds.
^C

[root@test 桌面]# ifconfig eth1
eth1      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:C7  
          inet addr:192.168.11.252  Bcast:192.168.11.255  Mask:255.255.255.0
          inet6 addr: fe80::20c:29ff:fe1a:f8c7/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:4081 errors:0 dropped:0 overruns:0 frame:0
          TX packets:191 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:436337 (426.1 KiB)  TX bytes:17656 (17.2 KiB)


完美！
```

## 六、DHCP超级作用域

体验了DHCP服务器给大家带来的方便后，我们工作轻松了很多，但是随着时间的推移，突然有这么一个问题急需你解决，由于公司的发展壮大，公司人员数量越来越多，公司一个网段的IP无法满足日常使用，所以又加了一个网段。但是默认情况下，DHCP服务器只能发放和自己网卡在同一网段的IP地址，目前我们DHCP的网卡IP地址为192.168.11.0段，我们新加的网段为192.168.12.0，那么怎么能让DHCP服务器既能发11网段，又能发放12网段呢？学会超级作用域就可以解决这个问题。

超级作用域：将两个或以上的不同网段的作用域合成一个作用域既是超级作用域。

**案例:部署一个超级作用域，作用域是192.168.11.0/24网段，192.168.12.0/24网段。**

```
a、编辑配置文件
[root@zutuanxue ~]# cat /etc/dhcp/dhcpd.conf
option domain-name-servers 4.2.2.2, 4.2.2.1;

default-lease-time 28800;
max-lease-time 43200;
#authoritative;
log-facility local7;

#share-network 部署一个超级作用域
#supper 超级作用域名称，随便起，但是建议有意义。
shared-network supper {
#192.168.11.0作用域
subnet 192.168.11.0 netmask 255.255.255.0 {
range 192.168.11.150 192.168.11.150;
option domain-name-servers 202.106.0.20, 114.114.114.114;
option routers 192.168.11.254;
default-lease-time 7200;
max-lease-time 10800;
}

#192.168.12.0作用域
subnet 192.168.12.0 netmask 255.255.255.0 {
range 192.168.12.150 192.168.12.150;
option domain-name-servers 202.106.0.20, 114.114.114.114;
option routers 192.168.12.254;
default-lease-time 7200;
max-lease-time 10800;
}

}


注意：案例中为了方便验证，我每个作用域只发布一个IP，否者测试无法保证能100%分到两个网段。

b、重启DHCP服务，生效配置文件
[root@zutuanxue dhcp]# systemctl restart dhcpd

c、验证
#释放两网卡IP
[root@test 桌面]# dhclient -r eth0
[root@test 桌面]# dhclient -r eth1

#释放成功
[root@test 桌面]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:BD  
          inet6 addr: fe80::20c:29ff:fe1a:f8bd/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:1591 errors:0 dropped:0 overruns:0 frame:0
          TX packets:162 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:282324 (275.7 KiB)  TX bytes:30619 (29.9 KiB)

eth1      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:C7  
          inet6 addr: fe80::20c:29ff:fe1a:f8c7/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:4719 errors:0 dropped:0 overruns:0 frame:0
          TX packets:216 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:559954 (546.8 KiB)  TX bytes:19582 (19.1 KiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:12 errors:0 dropped:0 overruns:0 frame:0
          TX packets:12 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:720 (720.0 b)  TX bytes:720 (720.0 b)

#分别获取IP地址 
[root@test 桌面]# dhclient -d eth0
Internet Systems Consortium DHCP Client 4.1.1-P1
Copyright 2004-2010 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth0/00:0c:29:1a:f8:bd
Sending on   LPF/eth0/00:0c:29:1a:f8:bd
Sending on   Socket/fallback
DHCPDISCOVER on eth0 to 255.255.255.255 port 67 interval 6 (xid=0x2574199a)
DHCPOFFER from 192.168.11.16
DHCPREQUEST on eth0 to 255.255.255.255 port 67 (xid=0x2574199a)
DHCPACK from 192.168.11.16 (xid=0x2574199a)
bound to 192.168.11.150 -- renewal in 3026 seconds.
^C
#确保都是来自我们实验中的DHCP服务器
[root@test 桌面]# dhclient -d eth1
Internet Systems Consortium DHCP Client 4.1.1-P1
Copyright 2004-2010 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth1/00:0c:29:1a:f8:c7
Sending on   LPF/eth1/00:0c:29:1a:f8:c7
Sending on   Socket/fallback
DHCPDISCOVER on eth1 to 255.255.255.255 port 67 interval 7 (xid=0x2cebde11)
DHCPOFFER from 192.168.11.16
DHCPREQUEST on eth1 to 255.255.255.255 port 67 (xid=0x2cebde11)
DHCPACK from 192.168.11.16 (xid=0x2cebde11)
bound to 192.168.12.150 -- renewal in 3102 seconds.

#确保都是来自我们实验中的DHCP服务器


#查看IP情况，发现实验成功了，分别获得到了不同网段IP
[root@test 桌面]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:BD  
          inet addr:192.168.11.150  Bcast:192.168.11.255  Mask:255.255.255.0
          inet6 addr: fe80::20c:29ff:fe1a:f8bd/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:1613 errors:0 dropped:0 overruns:0 frame:0
          TX packets:166 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:287076 (280.3 KiB)  TX bytes:31387 (30.6 KiB)

eth1      Link encap:Ethernet  HWaddr 00:0C:29:1A:F8:C7  
          inet addr:192.168.12.150  Bcast:192.168.12.255  Mask:255.255.255.0
          inet6 addr: fe80::20c:29ff:fe1a:f8c7/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:4741 errors:0 dropped:0 overruns:0 frame:0
          TX packets:220 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:564706 (551.4 KiB)  TX bytes:20350 (19.8 KiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:12 errors:0 dropped:0 overruns:0 frame:0
          TX packets:12 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:720 (720.0 b)  TX bytes:720 (720.0 b)
```

## 七、补充

### 7.1) 如果客户端获得不到 IP会怎么办

当客户端获得不到IP地址，会得到一个169.254开头的临时IP，此IP不能和其他网段通信，但是Client会继续向网络中发DHCP广播，继续坚持不懈申请IP。

### 7.2）DHCP会面临单机故障，如何解决

两台设备互相分发对方网段一段IP，将作用域采用8/2原则，彼此互相冗余，当一台服务器出现问题，不至于整个网段故障。

### 7.3）抓包验证方法

```
[root@zutuanxue dhcp]# tcpdump -nn -vvv -s 1500 -i ens33 host 192.168.11.16 and udp port 67 or udp port 68
```

### 7.4）如何发放计算机名称

发放计算机名称只能在保留中完成，要求Client的计算机名配置文件中将对应字段删除。

```
option domain-name-servers 4.2.2.2, 4.2.2.1;

default-lease-time 28800;
max-lease-time 43200;
authoritative;
log-facility local7;

subnet 192.168.11.0 netmask 255.255.255.0 {
  range 192.168.11.153 192.168.11.252;
  option domain-name-servers 202.106.0.20, 114.114.114.114;
  option routers 192.168.11.254;
  option broadcast-address 192.168.11.255;
  default-lease-time 7200;
  max-lease-time 10800;
}

host print {
  #指定计算机名称
  option host-name "test.hello.com";
  hardware ethernet 00:0c:29:af:f1:84;
  fixed-address 192.168.11.252;
}

注意：请把/etc/hostname 中的计算机名称清除
      /etc/sysconfig/network中的hostname字段清除
```