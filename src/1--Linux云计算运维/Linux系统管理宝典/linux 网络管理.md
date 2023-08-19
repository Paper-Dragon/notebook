现代人的生活越来越依赖网络，对于一个操作系统来讲，网络功能的支持和管理就更为重要了，本节课我们一起来看一下在CentOS8中如何对网络进行管理

## NetworkManager和常用工具和基本用法

### NetworkManager介绍

在linux系统中传统的网络管理方法是用过一个叫network的服务来实现，在CentOS7中依然有这个服务的身影，但是到了CentOS8中已经不使用network这个服务了，而是使用了一个叫NetworkManager的服务，这个服务可以简化我们管理有线和无线连接的工作，除此之外它还能管理不同类型的网络，包括物理网卡，虚拟网卡，以太网，非以太网等



#### 常用工具

- nmcli：命令行工具
- nmtui：文本图形界面工具
- cockpit：基于web的管理工具

#### nmcli基本用法

nmcli命令的用法类似linux中以前的ip命令，而且支持tab补全，另外也可以使用-h或者–help获取帮助

```
[root@zutuanxue ~]# nmcli -h
[root@zutuanxue ~]# nmcli connection -h
可以看到，在不同的阶段获取到的帮助内容是不一样的，具体的用法我们后面会看到

nmcli这个工具有两个常用的命令
nmcli connection（nmcli c）	与连接相关的操作
[root@zutuanxue network-scripts]# nmcli connection 
NAME   UUID                                  TYPE      DEVICE
连接名	 设备的UUID（通用唯一识别码）							设备类型		设备名称
ens33  b5ecf570-543c-4da7-b082-bdc073b56acb  ethernet  ens33  
ens37  077945cb-1d12-4c06-bba3-562426336b67  ethernet  -- 
在查看时，有颜色的字体标注的是处于活跃状态的网卡，也就是连接的，正常颜色字体标记的是非活跃状态的网卡，也就是未连接的，未连接的不生效
nmcli device	（nmcli d）		与设备相关的操作
[root@zutuanxue network-scripts]# nmcli device 
DEVICE  TYPE      STATE   CONNECTION 
设备名		设备类型	 设备状态	 连接名称
ens33   ethernet  已连接  ens33      
ens37   ethernet  已断开  --         
lo      loopback  未托管  -- 

在日常使用中这两个命令相互配合，通过nmcli device可以查看到有哪些网络设备是被NetworkManager托管，通过nmcli connection控制网络设备的连接状态
```

### 使用nmcli命令设置网卡信息

```
查看网卡信息
[root@zutuanxue ~]# nmcli 
ens33: 已连接 to ens33	#设备状态和名称
  "Intel 82545EM"	#设备型号
  ethernet (e1000), 00:0C:29:11:47:97, 硬件, mtu 1500
  ip4 默认
  inet4 192.168.1.55/24
  route4 0.0.0.0/0
  route4 192.168.1.0/24
  inet6 fe80::ea62:91c6:114:18bb/64
  route6 fe80::/64
  route6 ff00::/8

为网卡设置静态IP
[root@zutuanxue ~]# nmcli connection add type ethernet con-name ens-test1 ifname ens37 ipv4.addresses 192.168.18.100/24 ipv4.gateway 192.168.18.1 ipv4.method manual 
连接 "ens-test1" (da7fdc9a-e7cc-4a1c-8b2c-7751ed2fc4d2) 已成功添加。


启用新添加的连接
[root@zutuanxue ~]# nmcli connection up ens-test1 
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/16） 


查看连接状态
[root@zutuanxue ~]# nmcli connection 
NAME       UUID            TYPE      DEVICE 
ens33      b5ecf5...		  ethernet  ens33  
ens-test1  da7fdc...		  ethernet  ens37  
ens37      077945...		  ethernet  --     

为网卡设置动态IP
[root@zutuanxue ~]# nmcli connection add type ethernet con-name ens-test2 ifname ens37 ipv4.method auto
连接 "ens-test2" (25b9dd2f-a4c0-452d-bd22-992cf12b55b2) 已成功添加。
[root@zutuanxue ~]# nmcli connection up ens-test2 
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/17）
[root@zutuanxue ~]# nmcli connection 
NAME       UUID              TYPE      DEVICE 
ens33      b5ec...					 ethernet  ens33  
ens-test2  25b9...					 ethernet  ens37  
ens37      0779...					 ethernet  --     
ens-test1  da7f...					 ethernet  --     


交互式设置IP地址
[root@zutuanxue ~]# nmcli connection edit ens-test1 
nmcli> goto ipv4.addresses 
nmcli ipv4.addresses> change
编辑 "addresses" 值：192.168.20.100/24
您是否也要将 "ipv4.method" 设为 "manual"？[yes]：yes
nmcli ipv4.addresses> back
nmcli ipv4> save
成功地更新了连接 "ens-test1" (da7fdc9a-e7cc-4a1c-8b2c-7751ed2fc4d2)。
nmcli ipv4> activate 
正在监视连接激活（按任意键继续）
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/18）

nmcli ipv4> quit

[root@zutuanxue ~]# nmcli 
ens37: 已连接 to ens-test1
  "Intel 82545EM"
  ethernet (e1000), 00:0C:29:11:47:A1, 硬件, mtu 1500
  ip4 默认
  inet4 192.168.20.100/24
  route4 192.168.20.0/24
  route4 192.168.18.1/32
  route4 0.0.0.0/0
  inet6 fe80::11c3:e0a4:f62e:9f31/64
  route6 fe80::/64
  route6 ff00::/8


启用和停用
[root@zutuanxue ~]# nmcli connection up ens-test1 
连接已成功激活（D-Bus 活动路径：...
[root@zutuanxue ~]# nmcli connection down ens-test1 
成功停用连接 "ens-test1"（D-Bus 活动路...

删除连接
[root@zutuanxue ~]# nmcli connection delete ens-test1 
成功删除连接 "ens-test1" (4fc43f65-ea53-43a1-85d4-692e425fcd7d)。
[root@zutuanxue ~]# nmcli connection 
NAME   UUID     TYPE      DEVICE 
ens33  b5ec...	ethernet  ens33  
ens37  0779...	ethernet  ens37  
[root@zutuanxue ~]# nmcli connection show
NAME   UUID     TYPE      DEVICE 
ens33  b5ec...  ethernet  ens33  
ens37  0779...  ethernet  ens37  

重新加载设置(不会立即生效)
[root@zutuanxue ~]# nmcli connection reload

重新加载指定的设置(不会立即生效)
[root@zutuanxue ~]# nmcli connection load /etc/sysconfig/network-scripts/ifcfg-ens37


生效方法
			
启用设备
[root@zutuanxue ~]# nmcli connection up  ens37
连接已成功激活（D-Bus 活动路径...

或者

连接设备并更新设备
[root@zutuanxue ~]# nmcli device connect ens37			
[root@zutuanxue ~]# nmcli device reapply ens37


查看设备&查看设备的详细信息
[root@zutuanxue ~]# nmcli device 
DEVICE  TYPE      STATE   CONNECTION 
ens37   ethernet  已连接  ens37      
ens33   ethernet  已连接  ens33      
lo      loopback  未托管  --         
[root@zutuanxue ~]# nmcli device show ens33
GENERAL.DEVICE:                         ens33
GENERAL.TYPE:                           ethernet
GENERAL.HWADDR:                         00:0C:29:11:47:97
GENERAL.MTU:                            1500
GENERAL.STATE:                          100（已连接）
GENERAL.CONNECTION:                     ens33
GENERAL.CON-PATH:         /org/freedesktop/NetworkMana...
WIRED-PROPERTIES.CARRIER:               开
IP4.ADDRESS[1]:                         192.168.1.55/24
IP4.GATEWAY:                            --
IP4.ROUTE[1]:           dst = 192.168.1.0/24, nh = 0.0.0.0, mt = 102
IP4.DNS[1]:             202.106.0.20
IP4.DNS[2]:             114.114.114.114
IP6.ADDRESS[1]:         fe80::ea62:91c6:114:18bb/64
IP6.GATEWAY:            --
IP6.ROUTE[1]:           dst = fe80::/64, nh = ::, mt = 102
IP6.ROUTE[2]:           dst = ff00::/8, nh = ::, mt = 256, table=255

连接/断开网卡
[root@zutuanxue ~]# nmcli device connect/disconnect ens37

开启/关闭无线网络
[root@zutuanxue ~]# nmcli radio all on/off

开启/关闭NetworkManager的网络管理功能
[root@zutuanxue ~]# nmcli networking on/off

监控网络状态
[root@zutuanxue ~]# nmcli monitor (ctrl+c结束)
ens37: 停用中
网络管理器现在处于 "已连接（仅本地）" 状态
连接性现在是 "受限"
ens37: 已断开

询问NetworkManager网络连接状态(默认等待30秒)
[root@zutuanxue ~]# nm-online 
正在连接...............   30s [online]
```

### 使用其他网络管理方式配置网络

- nmtui

```
[root@zutuanxue ~]# nmtui
```

![image20191128171950048.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602407640250.png)

- cockpit

```
[root@zutuanxue ~]# rpm -qa | grep cockpit
cockpit-packagekit-184.1-1.el8.noarch
cockpit-system-185-2.el8.noarch
cockpit-185-2.el8.x86_64
cockpit-bridge-185-2.el8.x86_64
cockpit-ws-185-2.el8.x86_64
cockpit-storaged-184.1-1.el8.noarch
[root@zutuanxue ~]# systemctl start cockpit
```

![image20191128172456779.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602407654490.png)

![image20191128172540728.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602407665857.png)