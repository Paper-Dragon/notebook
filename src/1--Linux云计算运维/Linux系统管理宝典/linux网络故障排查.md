在日常使用中，经常会出现无法连通的情况，这个时候我们就需要找到问题出在哪里，这里面给各位提供一个生产环境排查网络故障的大体思路，一般情况下如果遇到网络故障，都是通过筛选的方式一点一点的确定问题所在，首先判断是本机的问题还是网络上其它设备的问题，如果同一网络环境中的其它主机正常的，要去其它网络设备（路由器）上查看一下是否对网络有问题的主机设置了限制，如果没有的话，问题出在本机，这里面我们主要看下下本机容易出现哪些问题导致页面无法访问

## 一、网线和网卡设置

检查网卡的灯是否亮起，普通服务器的话应该是绿灯常亮为正常，交换机绿灯闪烁表示正在传输数据。也可以通过命令ethtool ethX来查看某一网卡的链路是否物理连通。

命令介绍

ethtool

```
[root@zutuanxue ~]# ethtool ens33
Settings for ens33:
	Supported ports: [ TP ]
	#接口类型
	#TP 	RJ45接口双绞线
	#AUI 	“D”型15针接口
	#BNC 	细同轴电缆接口，类似于以前的有线电视	
	#MII 	媒体独立接口，一种以太网行业标准
	#FIBRE	光纤
	Supported link modes:   10baseT/Half 10baseT/Full 
	                        100baseT/Half 				    																						100baseT/Full 
	                        1000baseT/Full 
	#支持的链接模式
	Supported pause frame use: No
	#是否支持暂停帧--一种网卡流量控制技术
	Supports auto-negotiation: Yes
	#是否支持自动协商，网络设备相互告知对方自己的工作方式，包括传输速度，双工状态等，然后选择一个最佳的
	Supported FEC modes: Not reported
	#编码纠错模式，支持编码纠错可提高数据通讯可信度
	Advertised link modes:  10baseT/Half 10baseT/Full 
	                        100baseT/Half
                          100baseT/Full 
	                        1000baseT/Full
  #宣告的链接模式
	Advertised pause frame use: No
	#宣告的是否支持帧暂停
	Advertised auto-negotiation: Yes
	#宣告的是否支持自动协商
	Advertised FEC modes: Not reported
	#宣告的是否FEC
	Speed: 1000Mb/s
	#当前速度
	Duplex: Full
	#全双工还是半双工
	Port: Twisted Pair
	#线缆类型为双绞线
	PHYAD: 0
	#PHY地址，主要指PHY芯片，用来发送和接收数据帧
	Transceiver: internal
	#收发器类型 internal/external（内部外部）是否是板载的
	Auto-negotiation: on
	#自动协商功能开启
	MDI-X: off (auto)
	#自适应功能
	Supports Wake-on: d
	#是否支持远程唤醒 d=禁用，p\u\m\b\a\g=不同唤醒方式
	Wake-on: d
	Current message level: 0x00000007 (7)	drv probe link
	Link detected: yes
	#网卡已连接
	
	
	##############常用参数
#-a 查看网卡中 接收模块RX、发送模块TX和Autonegotiate模块的状态：启动on 或 停用off。主要指接收暂停，发送暂停和自动协商暂停功能，也就是暂停帧，主要用于控制数据路停止发送，可以防止瞬间压力过大导致缓冲区溢出而引发的帧丢失（丢包）
#[root@zutuanxue ~]# ethtool -a ens33
Pause parameters for ens33:
Autonegotiate:	on
RX:		off
TX:		off

#-A 修改网卡中 接收模块RX、发送模块TX和Autonegotiate模块的状态：启动on 或 停用off。
[root@zutuanxue ~]# ethtool -A ens33 rx/tx/autoneg on

#-i 显示网卡驱动的信息，如驱动的名称、版本等。
[root@zutuanxue ~]# ethtool -i ens33
driver: e1000
version: 7.3.21-k8-NAPI
firmware-version: 
expansion-rom-version: 
bus-info: 0000:02:01.0
supports-statistics: yes
supports-test: yes
supports-eeprom-access: yes
supports-register-dump: yes
supports-priv-flags: no

#-k 显示网卡各项功能的支持和协议状态，如支持某个协议的功能是否开启等
#-p 用于区别不同ethX对应网卡的物理位置，常用的方法是使网卡port上的led不断的闪；N为网卡闪的持续时间，以秒为单位。
[root@zutuanxue ~]# ethtool -p ens33 10

#-r 如果自动协商状态为on，则重启自动协商功能。
[root@zutuanxue ~]# ethtool -r ens33

#-S 显示统计参数，如网卡接收/发送的字节数、接收/发送的广播包个数等。
[root@zutuanxue ~]# ethtool -S ens33
NIC statistics:
     rx_packets: 609
     tx_packets: 130
     rx_bytes: 121330
     tx_bytes: 16066
     rx_broadcast: 0

#-s 修改网卡的部分配置，包括网卡速度、单工/全双工模式、mac地址等。
	ethtool –s ethX [speed 10|100|1000]
									#设置网口速率10/100/1000M
									[duplex half|full]
									#设置网口半/全双工
									[autoneg on|off]
									#设置网口是否自协商
									[port tp|aui|bnc|mii]
									#设置网口类型
[root@zutuanxue ~]# ethtool -s ens33 speed 1000 duplex full autoneg on port tp
```

## 二、selinux&防火墙

这两个是最容易产生干扰的项目，selinux和防火墙如何关闭，我们在前面的课程中有涉及，这里就不重复了

## 三、查看网卡ip地址，网关设置

使用ifconfig或者nmcli命令查看/设置ip地址和网关

## 四、使用ping命令测试连通性

```
-c<完成次数>：设置完成要求回应的次数；
-f：洪水ping只有root可以使用
-i<间隔秒数>：指定收发信息的间隔时间；
-n：只输出数值,不尝试去查找主机名
-s<数据包大小>：设置数据包的大小；
-I 指定源地址（源地址必须是本地网卡上存在的配置）
[root@zutuanxuers1 ~]# ping -c 3 -i 0.5 -n  -s 1024 -I 192.168.2.220 192.168.2.220
PING 192.168.2.220 (192.168.2.220) from 192.168.2.220 : 1024(1052) bytes of data.
1032 bytes from 192.168.2.220: icmp_seq=1 ttl=64 time=0.047 ms
1032 bytes from 192.168.2.220: icmp_seq=2 ttl=64 time=0.060 ms
1032 bytes from 192.168.2.220: icmp_seq=3 ttl=64 time=0.053 ms

--- 192.168.2.220 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 13ms
rtt min/avg/max/mdev = 0.047/0.053/0.060/0.008 ms
```

## 五、路由

使用route命令查看或设置路由及网关，也可以通过修改静态路由配置文件实现

## 六、DNS

- /etc/hosts&/etc/resolv.conf
- nslookup
- dig
- host

## 七、追踪数据包

```
tracepath  [参数选项]  hostname，域名或 IP地址
#替代了以前的traceroute
参数选项：
-4	使用IPV4
-6	使用IPV6=tracepath6
-l	设置初始包的大小 默认IPV4 65535，ipv6 128000
-m 	设置检测数据包的TTL，默认值为30次；
-n 	显示IP地址，不查主机名。当DNS不起作用时常用到这个参数；
-b	显示主机名和IP地址
-p 	port 探测包使用的基本UDP端口设置为port ，默认值是33434
[root@zutuanxuers1 ~]# tracepath -b www.baidu.com -l 1000 -m 5
 1:  localhost (192.168.0.1)                              18.324ms 
 2:  localhost (192.168.1.1)                              15.622ms 
 3:  localhost (10.70.0.1)                                18.640ms 
 4:  114.244.94.25 (114.244.94.25)                         7.213ms 
 5:  124.65.56.141 (124.65.56.141)                        16.020ms 
     Too many hops: pmtu 1000
     Resume: pmtu 1000 
```

## 八、硬件故障

更换硬件