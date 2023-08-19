# 一、Docker 网络

docker网络主要是解决容器联网问题，也是我们使用容器中最重要的一个环节，如果容器没有网络则无法向网络中提供服务。

### 网络管理命令：docker network

```
[root@zutuanxue ~]# docker network --help

Usage:	docker network COMMAND

Manage networks

Commands:
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks

Run 'docker network COMMAND --help' for more information on a command.
```

# 二、docker网络类型

创建容器的时候可以通过—network命令来指定容器的网络，网络类型有以下四种

- bridge
- host
- none
- 容器网络或联盟网络

### bridge

桥接网络是指容器通过桥接的方式将容器网卡桥接到宿主机的docker0网桥，然后在通过宿主机防火墙的NAT表实现与外网的联系。

##### 宿主机docker0网桥

```
[root@zutuanxue ~]# ifconfig 
#docker0网桥
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:c7ff:fe37:8e8  prefixlen 64  scopeid 0x20<link>
        ether 02:42:c7:37:08:e8  txqueuelen 0  (Ethernet)
        RX packets 6618  bytes 277975 (271.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8152  bytes 24675021 (23.5 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

.....省略了本机的网卡信息
#容器网卡，每创建一个桥接网络的容器就会生成一个对应的网卡
vethf75a942: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::9085:f5ff:fe34:77b5  prefixlen 64  scopeid 0x20<link>
        ether 92:85:f5:34:77:b5  txqueuelen 0  (Ethernet)
        RX packets 2850  bytes 158484 (154.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3397  bytes 11613136 (11.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
        
        
        
如果想看更清楚一下  可以使用  ip  add  show命令
[root@zutuanxue ~]# ip add show

4: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:c7:37:08:e8 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:c7ff:fe37:8e8/64 scope link 
       valid_lft forever preferred_lft forever

容器网卡
14: vethf75a942@if13: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default 
    link/ether 92:85:f5:34:77:b5 brd ff:ff:ff:ff:ff:ff link-netnsid 1
    inet6 fe80::9085:f5ff:fe34:77b5/64 scope link 
       valid_lft forever preferred_lft forever


注意：
这里的vethf75a942@if13指的就是容器网卡，V代表虚拟网卡的意思，eth 以太网卡，f75a942网卡编号，if13指的是宿主机网桥(docekr0)的一个端口，对应容器的网卡编号加一。
所以容器内的网卡编号应该是 eth0@if14

通过在容器中执行命令  ip add show 也可以看到
[root@zutuanxue ~]# docker exec centos1 ip add show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
13: eth0@if14: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:ac:11:00:03 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

### 防火墙的NAT表内容

```
[root@zutuanxue ~]# iptables -t nat -L
Chain PREROUTING (policy ACCEPT)
target     prot opt source               destination         
DOCKER     all  --  anywhere             anywhere             ADDRTYPE match dst-type LOCAL

Chain INPUT (policy ACCEPT)
target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination         
DOCKER     all  --  anywhere            !loopback/8           ADDRTYPE match dst-type LOCAL

Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination         
MASQUERADE  all  --  172.17.0.0/16        anywhere            

Chain DOCKER (2 references)
target     prot opt source               destination         
RETURN     all  --  anywhere             anywhere        
```

### docker0 与容器网卡桥接

```
通过brctl show命令可以看到容器网卡和docker0网卡的桥接信息
[root@zutuanxue ~]# brctl show
bridge name	bridge id		STP enabled	interfaces
docker0		8000.0242c73708e8	no		vethf75a942
```

**创建一个网络为bridge类型的容器，不指定默认也是这个类型**

```
[root@zutuanxue ~]# docker run -d --network bridge --name centos1 baishuming2020/centos_nginx
```

### host

**容器和真机共用网卡及对应的端口，缺点就是同一个端口只能宿主机或者某个容器使用，其他容器不能用。**

```
创建一个网络类型host的容器
[root@zutuanxue ~]# docker run -d --network host --name centos2 baishuming2020/centos_nginx
```

### none

**容器仅有lo网卡，是一个不能联网的本地容器**

```
创建一个网络类型为lo的容器
[root@zutuanxue ~]# docker run -d --network none --name centos3 baishuming2020/centos_nginx
```

### 2.1、实现网桥网络

目的：不同的服务容器组应用不同的网桥，避免同一网络内容器太多，保持容器网络独立性。

关于新网桥联网问题：创建网桥后，宿主机会自动帮你做NAT，所以不用担心联网问题

#### 查看网络-ls

```
[root@zutuanxue ~]# docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
80982d2613cd        bridge              bridge              local
40c179ab420a        docker1             bridge              local
04aadb7475c0        docker100           bridge              local
ce79e9d7525a        host                host                local
8f0358469e57        none                null                local

NETWORK ID     网桥ID   
NAME           名称
DRIVER         网络类型  
SCOPE					 作用范围
```

#### 创建网桥-create

```
[root@zutuanxue ~]# docker network create -d bridge --subnet 192.168.1.0/24 --gateway 192.168.1.1 mydocker0
6a410e27b66ea587142d967f7dff6f36c04ced3c27116a79831412f3743aba56

[root@zutuanxue ~]# docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
6ee1e928b710        bridge              bridge              local
ce79e9d7525a        host                host                local
6a410e27b66e        mydocker0           bridge              local
8f0358469e57        none                null                local


修改docker网桥名字
1、关闭新建网桥
[root@zutuanxue ~]# ip link set dev br-6a410e27b66e down
2、修改名字
[root@zutuanxue ~]# ip link set dev br-6a410e27b66e name  mydocker0
3、启动网桥
[root@zutuanxue ~]# ip link set dev mydocker0 up
4、重启docker服务
[root@zutuanxue ~]# systemctl restart docker
```

#### 删除未使用的网桥-prune

```
[root@zutuanxue ~]# docker network prune 
WARNING! This will remove all networks not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Networks:
docker1
```

#### 删除某个网桥-rm

```
[root@zutuanxue ~]# docker network rm docker100
docker100

注意：
不能被活动容器占用
```

#### 容器连接到网桥

前提是该容器是桥接网络

```
[root@zutuanxue ~]# docker network connect docker1 centos1
[root@zutuanxue ~]# docker exec centos1 ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)
        RX packets 8  bytes 656 (656.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
发现centos1容器多了一块网卡，使用的正是docker1的网段
eth1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.2  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 02:42:c0:a8:01:02  txqueuelen 0  (Ethernet)
        RX packets 16  bytes 1312 (1.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

#### 容器断开网桥

```
将centos1容器的网络从docker1网桥断开
[root@zutuanxue ~]# docker network disconnect docker1 centos1
```

### 常见故障

### FAQ1：使用改名后的新网桥的容器可能无法解析域名

原因：没有配置新网桥的DNS

解决方法：为容器手动配置一个DNS地址即可

### FAQ2：Networking will not work

```
[root@zutuanxue ~]# docker run -d --network docker100 --name centos4 baishuming2020/centos_nginx
WARNING: IPv4 forwarding is disabled. Networking will not work.
67f2c276123c993cd66b9d7a99ba22402331a13f9ea8817e57324a934896b805

解决方案
1、打开转发
[root@zutuanxue ~]# echo "net.ipv4.ip_forward=1" >>  /usr/lib/sysctl.d/00-system.conf

2、重启网络
[root@zutuanxue ~]# systemctl restart network
```

## 三、不同主机间的容器通信

### 3.1、 macvlan

在 Docker 中，macvlan 是众多 Docker 网络模型中的一种，并且是一种跨主机的网络模型，作为一种驱动启用，Docker macvlan 只支持 bridge 模式

```
#macvlan 需要一块独立的网卡来进行使用，所以我们需要新添加一块网卡

docker network create -d macvlan --subnet=172.16.10.0/24 --gateway=172.16.10.1  -o parent=ens224  mtacvlan-1

-o parent=网卡名称  指定用来给 macvlan 网络使用的物理网卡

注意，要在所有需要运行 macvlan 的主机上执行这条命令，但是要记得更改网关的地址，避免造成IP冲突

docker run -itd --network macvlan-1 centos /bin/bash
```

### 3.2、 overlay

在 Docker 中，overlay 是众多 Docker 网络模型中的一种，并且是一种跨主机的全局网络模型，有一个数据库专门的来存储网络分配信息，避免 IP 冲突，同时内部还有一个小型的 DNS 我们可以直接通过主机名进行访问

```
consul 服务端：
docker run -itd -h consul --name consul --restart=always -p 8500:8500 progrium/consul -server -bootstrap

-h 				主机名
–name 			容器名
–restart=always 重启策略
progrium/consul 镜像名称
-server 		以服务节点启动
-bootstrap		预期的启动节点数：自举

在浏览器内输入 IP地址+端口号 可以看到 web 页面

在所有主机上编辑 daemon.json 文件：
{
"hosts": ["tcp://0.0.0.0:2375","unix:///var/run/docker.sock"]， 监听相关端口
"cluster-store":"consul://192.168.1.150:8500",		   集群的主机地址
"cluster-advertise":"192.168.1.150:2375”		宣告自己的地址 
}

重启 docker 服务

创建 overlay 网络（全局网络）：一台主机上创建自动同步

	docker network create -d overlay overlay-1

启动容器测试：

	docker run -it --name docker-1 --network=overlay-1 centos /bin/bash
	
	docker run -it --name docker-2 --network=overlay-1 centos /bin/bash
	
验证：ping docker-1
```

### 常见故障

如发现各容器内分配的ip之间相互ping不通

```
原因：可能由于防火墙问题引起的,默认forward链是drop状态，需要打开才可以


解决方案:
执行下面操作，保证INPUT  FORWARD链都是ACCEPT状态
清除其他规则
[root@zutuanxue_node1 ~]# iptables -P INPUT ACCEPT
[root@zutuanxue_node1 ~]# iptables -P FORWARD ACCEPT
[root@zutuanxue_node1 ~]# iptables -F
[root@zutuanxue_node1 ~]# iptables -L -n


[root@zutuanxue_node2 ~]# iptables -P INPUT ACCEPT
[root@zutuanxue_node2 ~]# iptables -P FORWARD ACCEPT
[root@zutuanxue_node2 ~]# iptables -F
[root@zutuanxue_node2 ~]# iptables -L -n
```