## 一、NAT模式集群

NAT也就是网络地址转换，其作用是通过数据报头的修改，使位于企业内部的私有IP可以访问外网，以及外部用户可以访问位于公司内部的私有IP主机，在nat模式中LVS负载均衡器需要使用两块网卡配置不同的IP地址,第一块网卡与内部的web服务器连接，第二块网卡与公网用户连接

![image20200204131325307.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603966584168.png)

### 工作原理

基于NAT机制实现。当用户请求到达director之后，director将请求报文的目标地址（即VIP）改成选定的realserver地址，同时将报文的目标端口也改成选定的realserver的相应端口，最后将报文请求发送到指定的realserver。在服务器端得到数据后，realserver将数据返给director，而director将报文的源地址和源端口改成VIP和相应端口，然后把数据发送给用户，完成整个负载调度过程。

### 特点

1，所有的realserver和director要在同一个网段内
2，RIP是私有地址，仅用于集群节点之间进行通信
3，director同时处理请求和应答数据包
4，realserver的网关要指向DIP
5，可以实现端口映射
6，readlserver可以是任意操作系统
7，director很可能成为系统性能瓶颈

**优点：** 集群中的物理服务器可以使用任何支持TCP/IP操作系统它只需要一个公网 IP 地址配置在调度器上，服务器组可以用私有的 IP 地址。

**缺点：** 扩展性有限。当服务器节点（普通PC服务器）增长过多时,负载均衡器将成为整个系统的瓶颈，因为所有的请求包和应答包的流向都经过负载均衡器。当服务器节点过多时，大量的数据包都交汇在负载均衡器那，速度就会变慢。

## 二、实战案例

### 案例需求

配置一个基于LVS NAT的web集群

### 实验环境

四台安装CentOS8的虚拟机一台测试机，一台LVS分发器，两台web服务器

### 注意事项

- 在做实验的时候在CLIENT上抓包的时候会发现LVS给CLIENT回复了请求页面，也看到了RS给了CLIENT页面，但是现实环境中是不会让RS给CLIENT页面的，因为RS在私网，他的数据包不会出现在公网，所以CLIENT自然就收不到RS给的包了，实验中能收到是因为没有公私网的概念，自然就没有合法不合法数据包，当然就能收到。
- 在做这个实验的时候，LVS要用两个独立网卡，不要将VIP当成逻辑网卡绑定到一块物理网卡，TCP半链接太多了。无法测试
- 关闭selinux关闭防火墙，停止libvirtd.service服务

### 实验架构

![image20200215194949204.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603966889055.png)

| 角色名称 | 接口和IP                                |
| -------- | --------------------------------------- |
| client   | ens33=192.168.1.200                     |
| LVS      | ens33=192.168.1.100;ens37=192.168.2.200 |
| RS1      | ens33=192.168.2.210                     |
| RS2      | ens33=192.168.2.220                     |

### 实验步骤

a、设置LVS主机

```
LVS配置IP地址
ens33=192.168.2.200
ens37=192.168.1.100

安装ipvsadm软件包
[root@lvs ~]# dnf install ipvsadm -y

开启转发
[root@lvs ~]#	echo 1 > /proc/sys/net/ipv4/ip_forward
```

b、真实服务器设置

```
配置IP地址
ens33=192.168.2.210&192.168.2.220

添加网关	网关指向LVS主机
[root@rs1 ~]# route add default gw 192.168.2.200
[root@rs2 ~]# route add default gw 192.168.2.200

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

c、客户端设置

```
ens33=192.168.1.200

设置网关
[root@client ~]# route add default gw 192.168.1.100


安装elinks软件包（这里面选择使用没有缓存的elinks浏览器进行测试）
[root@client ~]# wget http://www.elinks.or.cz/download/elinks-current-unstable.tar.gz
[root@client ~]# tar fx elinks-current-unstable.tar.gz 
[root@client elinks-0.12-20200204]# ./configure
[root@client elinks-0.12-20200204]# make && make install

访问web服务器测试
[root@client ~]# elinks http://192.168.2.210 --dump
   rs2
[root@client ~]# elinks http://192.168.2.220 --dump
   rs1
注意：也可以使用curl进行访问测试
```

d、lvs服务器上添加分发规则

```
[root@lvs ~]# ipvsadm -A -t 192.168.1.100:80 -s rr
[root@lvs ~]# ipvsadm -a -t 192.168.1.100:80 -r 192.168.2.210:80 -m
[root@lvs ~]# ipvsadm -a -t 192.168.1.100:80 -r 192.168.2.220:80 -m
```

e、测试结果

```
[root@client elinks-0.12-20200204]# elinks http://192.168.1.100 --dump
   rs1
[root@client elinks-0.12-20200204]# elinks http://192.168.1.100 --dump
   rs2
[root@client elinks-0.12-20200204]# elinks http://192.168.1.100 --dump
   rs1
[root@client elinks-0.12-20200204]# elinks http://192.168.1.100 --dump
   rs2
```