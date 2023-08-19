## 聚合链路

聚合链路是将多块网卡逻辑地连接到一起从而允许故障转移或者提高吞吐率的方法。提高服务器网络可用性。

**bond**是将多块网卡虚拟成为一块网卡的技术，通过bond技术让多块网卡看起来是一个单独的以太网接口设备并具有相同的ip地址。在linux下配置bond，通过网卡绑定技术既能增加服务器的可靠性，又增加了可用网络宽带，为用户提供不间断的网络服务。
**team**是另一种用来实现连路聚合和方法，类似于bond，team和bond的区别在于，支持hash加密，支持负载均衡，支持8块网卡，更好地支持IPV6

**实现方式**

- bond
- team

## bond聚合链路

### bond聚合链路模式

- mod=0 ，即：(balance-rr) Round-robin policy（轮询）
	聚合口数据报文按包轮询从物理接口转发。
	– 负载均衡—所有链路处于负载均衡状态，轮询方式往每条链路发送报文这模式的特点增加了带宽，同时支持容错能力，当有链路出问题，会把流量切换到正常的链路上。
	– 性能问题—一个连接或者会话的数据包如果从不同的接口发出的话，中途再经过不同的链路，在客户端很有可能会出现数据包无序到达的问题，而无序到达的数据包需要重新要求被发送，这样网络的吞吐量就会下降。Bond0在大压力的网络传输下，性能增长的并不是很理想。
	– 需要交换机进行端口绑定
- mod=1，即： (active-backup) Active-backup policy（主-备份策略）只有Active状态的物理接口才转发数据报文。
	– 容错能力—只有一个slave是激活的(active)。也就是说同一时刻只有一个网卡处于工作状态，其他的slave都处于备份状态，只有在当前激活的slave故障后才有可能会变为激活的(active)。
	– 无负载均衡—此算法的优点是可以提供高网络连接的可用性，但是它的资源利用率较低，只有一个接口处于工作状态，在有 N 个网络接口的情况下，资源利用率为1/N。
- mod=2，即：(balance-xor) XOR policy（平衡策略）
	聚合口数据报文按源目MAC、源目IP、源目端口进行异或HASH运算得到一个值，根据该值查找接口转发数据报文
	– 负载均衡—基于指定的传输HASH策略传输数据包。
	容错能力—这模式的特点增加了带宽，同时支持容错能力，当有链路出问题，会把流量切换到正常的链路上。
	– 性能问题—该模式将限定流量，以保证到达特定对端的流量总是从同一个接口上发出。既然目的地是通过MAC地址来决定的，因此该模式在“本地”网络配置下可以工作得很好。如果所有流量是通过单个路由器，由于只有一个网关，源和目标mac都固定了，那么这个算法算出的线路就一直是同一条，那么这种模式就没有多少意义了。
	– 需要交换机配置为port channel
- mod=3，即：broadcast（广播策略）
	这种模式的特点是一个报文会复制两份往bond下的两个接口分别发送出去，当有对端交换机失效，我们感觉不到任何downtime，但此法过于浪费资源；不过这种模式有很好的容错机制。此模式适用于金融行业，因为他们需要高可靠性的网络，不允许出现任何问题。
- mod=4，即：(802.3ad) IEEE 802.3ad Dynamic link aggregation（IEEE 802.3ad 动态链接聚合）
	在动态聚合模式下，聚合组内的成员端口上均启用LACP（链路汇聚控制协议）协议，其端口状态通过该协议自动进行维护。
	– 负载均衡—基于指定的传输HASH策略传输数据包。默认算法与blance-xor一样。
	– 容错能力—这模式的特点增加了带宽，同时支持容错能力，当有链路出问题，会把流量切换到正常的链路上。对比blance-xor，这种模式定期发送LACPDU报文维护链路聚合状态，保证链路质量。
	– 需要交换机支持LACP协议
- mod=5，即：(balance-tlb) Adaptive transmit load balancing（适配器传输负载均衡）
	在每个物理接口上根据当前的负载（根据速度计算）分配外出流量。如果正在接收数据的物理接口口出故障了，另一个物理接口接管该故障物理口的MAC地址。
	需要ethtool支持获取每个slave的速率
- mod=6，即：(balance-alb) Adaptive load balancing（适配器适应性负载均衡）
	该模式包含了balance-tlb模式，同时加上针对IPV4流量的接收负载均衡，而且不需要任何switch(交换机)的支持。接收负载均衡是通过ARP协商实现的。bonding驱动截获本机发送的ARP应答，并把源硬件地址改写为bond中某个物理接口的唯一硬件地址，从而使得不同的对端使用不同的硬件地址进行通信。

```
其实mod=6与mod=0的区别：mod=6，先把eth0流量占满，再占eth1，….ethX；而mod=0的话，会发现2个口的流量都很稳定，基本一
样的带宽。而mod=6，会发现第一个口流量很高，第2个口只占了小部分流量

常用的模式为 0136
mode 1、5、6不需要交换机设置
mode 0、2、3、4需要交换机设置
```

**案例:使用Bond方式设置聚合链路**

**环境**
系统：CentOS8
网卡名称： ens33（vmnet4） ens37（vmnet4）

**step 1：** 查看环境

```
[root@zutuanxue ~]# nmcli connection 
NAME   UUID                                  TYPE      DEVICE 
ens33  f035d150-9e89-4ee9-a657-03598d4b0940  ethernet  ens33  
ens37  7726249d-8281-45e8-a8e3-a6a023c64c66  ethernet  ens37
```

**step 2：** 创建bond虚拟网卡

```
[root@zutuanxue ~]# nmcli connection add type bond con-name bond0 ifname bond0 mode 1 ipv4.addresses 192.168.98.200/24 ipv4.method manual autoconnect yes

#type：创建的类型，这里选择bond类型
#con-name:这里写链接名，就是show中第一列，这里写什么生成的文件就是什么名字
#ifname:网卡名，这里bond0是虚拟出来的
#mode:选择bond模式，常用的有主备，轮询，广播，还有其他模式，用tab补全可以看到所有，也可以使用数字0-6表示
#ipv4.mehod:表示自动还是手动，就是使用dhcp还是自己配置地址，关联配置文件中的BOOTPROTO段
#ipv4.address：设置ip地址，注意记得加上掩码
#autoconnect 自动连接
```

**step 3：** 为bond网卡添加成员（真实网卡）

```
[root@zutuanxue ~]# nmcli connection add type bond-slave ifname ens33 master bond0
连接 "bond-slave-ens33" (9fb9b3fa-a477-4a6f-a3c1-79cbfe351c7d) 已成功添加。
[root@zutuanxue ~]# nmcli connection add type bond-slave ifname ens37 master bond0
连接 "bond-slave-ens37" (2b047e49-b606-4b67-9e5c-f721f1e2ff7a) 已成功添加。
#类型为bond-slave,表示这块真实网卡属于一块附属的网卡，原有配置的属性都不能使用了，master表示这块从属网卡属于bond0这个组
注意：如果你的网卡没有启用的话需要启用
[root@zutuanxue ~]# nmcli connection 
NAME              UUID                                  TYPE      DEVICE 
bond0             55e0afdc-d2a6-4c93-b346-0ce207947b81  bond      bond0  
bond-slave-ens33  9fb9b3fa-a477-4a6f-a3c1-79cbfe351c7d  ethernet  ens33  
bond-slave-ens37  2b047e49-b606-4b67-9e5c-f721f1e2ff7a  ethernet  ens37  
ens33             f035d150-9e89-4ee9-a657-03598d4b0940  ethernet  --     
ens37             7726249d-8281-45e8-a8e3-a6a023c64c66  ethernet  --     
[root@zutuanxue ~]# ifconfig
bond0: ether 00:0c:29:a6:ad:95  txqueuelen 1000  (Ethernet)
       
ens33: ether 00:0c:29:a6:ad:95  txqueuelen 1000  (Ethernet)
       
ens37: ether 00:0c:29:a6:ad:95  txqueuelen 1000  (Ethernet)
[root@zutuanxue ~]# nmcli connection up bond-slave-ens33
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/81）
[root@zutuanxue ~]# nmcli connection up bond-slave-ens37
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/82）
[root@zutuanxue ~]# nmcli connection up bond0
连接已成功激活（master waiting for slaves）（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/83）
```

**step 4：** 查看链接信息并测试

```
#查看信息
[root@zutuanxue ~]# cat /proc/net/bonding/bond0 
Ethernet Channel Bonding Driver: v3.7.1 (April 27, 2011)

Bonding Mode: fault-tolerance (active-backup)#模式
Primary Slave: None
Currently Active Slave: ens33	#当前设备
MII Status: up	#启用状态
MII Polling Interval (ms): 100
Up Delay (ms): 0
Down Delay (ms): 0

Slave Interface: ens33	#从接口信息
MII Status: up
Speed: 1000 Mbps
Duplex: full
Link Failure Count: 0
Permanent HW addr: 00:0c:29:a6:ad:95
Slave queue ID: 0

Slave Interface: ens37	#另外一个从接口信息
MII Status: up
Speed: 1000 Mbps
Duplex: full
Link Failure Count: 0
Permanent HW addr: 00:0c:29:a6:ad:9f
Slave queue ID: 0

或者

[root@zutuanxue ~]# ip add

ens33: <BROADCAST,MULTICAST,SLAVE,UP,LOWER_UP> mtu 1500 qdisc fq_codel master bond0 state UP group default qlen 1000
		link/ether 00:0c:29:a6:ad:95 brd ff:ff:ff:ff:ff:ff

ens37: <BROADCAST,MULTICAST,SLAVE,UP,LOWER_UP> mtu 1500 qdisc fq_codel master bond0 state UP group default qlen 1000
    link/ether 00:0c:29:a6:ad:95 brd ff:ff:ff:ff:ff:ff

bond0: <BROADCAST,MULTICAST,MASTER,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 00:0c:29:a6:ad:95 brd ff:ff:ff:ff:ff:ff
    inet 192.168.98.200/24 brd 192.168.98.255 scope global noprefixroute bond0
       valid_lft forever preferred_lft forever
#找到另外一台主机使用ping进行测试
[root@zutuanxue ~]# nmcli connection down bond-slave-xxx
或者直接断开虚拟的网络连接测试还能否ping通
```

**删除**

```
nmcli connection delete bond0 bond-slave-ens33 bond-slave-ens37
注意：在配置聚合链路的时候如果使用虚拟机可能会弹出与mac地址相关的信息提示，可以暂时不用去管，如果测试的时候发现断网卡之后无法ping通，则需要在相关网卡配置文件中添加参数，如：
[root@zutuanxue ~]# vim /etc/sysconfig/network-scripts/ifcfg-bond0
#添加一行内容
BONDING_OPTS="miimon=100 mode=1 fail_over_mac=1"
#miimon：链路检查时间为100ms
#mode：模式为1，要与bond的模式相同
#fail_over_mac=1 mac地址跟随正常工作的网卡，当第一块网卡挂掉之后，自动将mac地址调整为第二块网卡的mac

以上操作只有在虚拟机的环境中使用，生产环境一般不需要
```

## team聚合链路

案例:使用team方式设置聚合链路

环境
系统：CentOS8
网卡名称： ens33（vmnet4） ens37（vmnet4）

**step 1：** 建立

```
[root@zutuanxue ~]# nmcli connection add type team con-name team0 ifname team0 config '{"runner":{"name":"activebackup","hwaddr_policy":"by_active"}}' ipv4.addresses 192.168.98.200/24 ipv4.method manual autoconnect yes

#JSON语法格式如下：’{“runner”:{“name”:“METHOD”}}’其中METHOD 是以下的其中一个
broadcast=mode3
roundrobin=mode0
activebackup=mode1
loadbalance=mode256
lacp=mode4
#"hwaddr_policy":"by_active"：硬件地址跟随活跃的网卡，也就是未故障的网卡
#聚合链路获取mac的地址有两种方式,一种是从第一个活跃网卡中获取mac地址，然后其余的SLAVE网卡的mac地址都使用该mac地址;另一种是使用hwaddr_policy参数，team使用当前活跃网卡的mac地址，mac地址随活跃网卡的转换而变，虚机不支持第一种获取MAC地址的方式。
```

**step 2：** 添加网卡

```
[root@zutuanxue ~]# nmcli connection add type team-slave ifname ens33 master team0
[root@zutuanxue ~]# nmcli connection add type team-slave ifname ens37 master team0
```

**step 3：** 启用连接

```
[root@zutuanxue ~]# nmcli connection up team-slave-ens33
[root@zutuanxue ~]# nmcli connection up team-slave-ens37
[root@zutuanxue ~]# nmcli connection up team0
```

**step 4：** 查看状态

```
[root@zutuanxue ~]# teamdctl team0 stat
setup:
  runner: activebackup
ports:
  ens33
    link watches:
      link summary: up
      instance[link_watch_0]:
        name: ethtool
        link: up
        down count: 0
  ens37
    link watches:
      link summary: up
      instance[link_watch_0]:
        name: ethtool
        link: up
        down count: 0
runner:
  active port: ens37
```