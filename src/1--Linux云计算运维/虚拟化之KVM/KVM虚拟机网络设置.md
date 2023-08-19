## 一、虚拟机网络

- NAT
- 桥接

### 1.1、NAT网络

NAT网络是虚拟机默认的网络，安装好KVM后就会有一个网卡

![nat网卡.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601970856701.png)

默认使用的地址是:192.168.122.0网段，该virbr0 ip地址 也是使用nat网络虚拟机的网关.

虚拟机上网是通过防火墙配置nat转换规则实现的。

NAT拓展知识:

```
NAT（Network Address Translation，网络地址转换）
```

![nat5216339.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601970882307.png)

```
私网
A: 10.0.0.0   10.255.255.255
B: 172.16.0.0  172.31.255.255
C: 192.168.0.0  192.168.255.255


#发包
SIP 192.168.1.4   DIP 114.113.112.111
SPORT 6543				DPORT 80


SIP 202.106.1.3   DIP 114.113.112.111
SPORT 6543				DPORT 80


#回包
SIP 114.113.112.111   DIP 202.106.1.3
SPORT 80			      	DPORT 6543

SIP 114.113.112.111   DIP 192.168.1.4
SPORT 80			      	DPORT 6543
```

### 1.2、桥接网卡

1. 启用一个物理网卡网络
2. 创建一个桥接网卡
3. 将物理网卡和桥接网卡绑定

```
#1、给物理网卡设置IP信息
[root@zutuanxue ~]# nmcli connection add con-name eno1 ifname eno1 ipv4.addresses 192.168.1.200/24 ipv4.method manual ipv4.gateway 192.168.1.1 ipv4.dns 202.106.0.20 type 802-3-ethernet

#2、创建一个桥接网卡
[root@zutuanxue ~]# nmcli connection add con-name br0 ifname br0 type bridge ipv4.method manual ipv4.addresses 192.168.1.200/24 ipv4.gateway 192.168.1.1 ipv4.dns 202.106.0.20 autoconnect yes

#3、绑定物理网卡
[root@zutuanxue ~]# nmcli connection add type bridge-slave ifname eno1 master br0

#4、重启生效
[root@zutuanxue ~]# nmcli connection down eno1
[root@zutuanxue ~]# nmcli connection down br0
[root@zutuanxue ~]# nmcli connection up br0
```