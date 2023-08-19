## 一、TUN模式集群

在NAT模式中，由于所有的请求及响应的数据包都需要经过LVS调度器，如果后端的服务器数量较大，则调度器就会成为整个集群环境的瓶颈。而请求包的大小往往小于响应包，因为响应数据包中包含有客户需要的具体数据，所以TUN模式的思路就是将请求与响应分离，让调度器仅处理请求，让真实服务器将响应数据包直接返回给客户端。在TUN模式中有一个IP隧道，这个IP隧道是一种数据包封装技术，可以将原始数据包封装并添加新的包头（包头内容包括新的源地址和端口，新的目标地址和端口），从而实现将一个目标为调度器VIP地址的数据包封装，通过隧道转发给后端的真实服务器，通过将客户端发往调度器的原始数据封装，并在其基础上添加新的包头（修改目标地址为调度器选择出来的真实服务器的地址及端口），TUN模式要求真实服务器可以直接与外部网络连接，真实服务器在收到请求数据包后直接给客户端主机响应数据

![image20200204135136495.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603968291812.png)

### 工作原理

基于NAT机制实现。当用户请求到达director之后，director将请求报文的目标地址（即VIP）改成选定的realserver地址，同时将报文的目标端口也改成选定的realserver的相应端口，最后将报文请求发送到指定的realserver。在服务器端得到数据后，realserver将数据返给director，而director将报文的源地址和源端口改成VIP和相应端口，然后把数据发送给用户，完成整个负载调度过程。

### 特点

1、所有的realserver和director要在同一个网段内
2、RIP是私有地址，仅用于集群节点之间进行通信
3、director同时处理请求和应答数据包
4、realserver的网关要指向DIP
5、可以实现端口映射
6、readlserver可以是任意操作系统
7、director很可能成为系统性能瓶颈

**优点：** 负载均衡器只负责将请求包分发给后端节点服务器，而RS将应答包直接发给用户。所以，减少了负载均衡器的大量数据流动，负载均衡器不再是系统的瓶颈，就能处理很巨大的请求量，这种方式，一台负载均衡器能够为很多RS进行分发。而且跑在公网上就能进行不同地域的分发。

**缺点：** 隧道模式的RS节点需要合法IP，这种方式需要所有的服务器支持”IP Tunneling”(IP Encapsulation)协议，服务器可能只局限在部分Linux系统上。

## 二、实战案例

### 案例需求

部署基于LVS TUN模式的Web集群

### 实验环境

五台安装CentOS8的虚拟机一台测试机，一台LVS分发器，一台路由器，两台web服务器
![image20200215203423650.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603968541949.png)

### 注意事项

- 关闭selinux
- 关闭防火墙
- 停止libvirtd.service服务

### 实验拓扑图

![image20200215203218254.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603968531606.png)

### 实验步骤

a、配置路由，开启转发

```
ens33=192.168.1.1
ens160=192.168.2.1

[root@route ~]# echo 1 > /proc/sys/net/ipv4/ip_forward
```

b、配置客户端

```
ens33=192.168.1.200
[root@client ~]# route add default gw 192.168.1.1
```

c、LVS负载均衡器设置

```
ens33=192.168.2.200
ens37=192.168.2.100(VIP)
[root@lvs ~]# route add default gw 192.168.2.1
[root@lvs ~]# ipvsadm -A -t 192.168.2.100:80 -s rr
[root@lvs ~]# ipvsadm -a -t 192.168.2.100:80 -r 192.168.2.220:80 -i
[root@lvs ~]# ipvsadm -a -t 192.168.2.100:80 -r 192.168.2.210:80 -i
```

d、RS1&RS2设置

```
RS1=192.168.2.220
RS2=192.168.2.210

添加VIP并设置网关，调整内核参数

RS1
[root@rs1 ~]# route add default gw 192.168.2.1
[root@rs1 ~]# ifconfig tunl0 192.168.2.100 netmask 255.255.255.255 up
[root@rs1 ~]# echo 1 > /proc/sys/net/ipv4/conf/all/arp_ignore 
[root@rs1 ~]# echo 2 > /proc/sys/net/ipv4/conf/all/arp_announce 
[root@rs1 ~]# echo 0 > /proc/sys/net/ipv4/conf/all/rp_filter
RS2
[root@rs2 ~]# route add default gw 192.168.2.1
[root@rs2 ~]# ifconfig tunl0 192.168.2.100 netmask 255.255.255.255 up
[root@rs2 ~]# echo 1 > /proc/sys/net/ipv4/conf/all/arp_ignore 
[root@rs2 ~]# echo 2 > /proc/sys/net/ipv4/conf/all/arp_announce 
[root@rs2 ~]# echo 0 > /proc/sys/net/ipv4/conf/all/rp_filter
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

e、客户端测试

```
[root@client ~]# elinks http://192.168.2.100 --dump
   rs2
[root@client ~]# elinks http://192.168.2.100 --dump
   rs1
[root@client ~]# elinks http://192.168.2.100 --dump
   rs2
[root@client ~]# elinks http://192.168.2.100 --dump
   rs1
```