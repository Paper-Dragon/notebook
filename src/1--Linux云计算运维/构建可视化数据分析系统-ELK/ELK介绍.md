## 一、项目背景

运维人员需要对系统和业务日志进行精准把控，便于分析系统和业务状态。日志分布在不同的服务器上，传统的使用传统的方法依次登录每台服务器查看日志，既繁琐又效率低下。所以我们需要**集中化**的日志管理工具将**位于不同服务器上的日志收集到一起, 然后进行分析,展示**。

前面我们学习过rsyslog,它就可以实现集中化的日志管理，可是rsyslog集中后的日志实现统计与检索又成了一个问题。使用wc, grep, awk等相关命令可以实现统计与检索，但如果要求更高的场景，这些命令也会力不从心。所以我们需要一套专业的日志收集分析展示系统。

## 二、项目分析

### 2.1、数据分析流程

1. 数据收集
2. 数据分析
3. 数据展示

明确数据分析流程后，我们来看一下能够进行数据处理的软件-ELK

ELK是一套开源的日志分析系统，由elasticsearch+logstash+Kibana组成。它可以实时的收集、处理、展示分析数据，可以让人通过图表直观的看到数据分析结果。

ELK一般应用数据分析领域比如：

 日志分析处理

 结合Hadoop实现大数据分析处理和展示

 数据搜索

## 三、认识ELK

**ELK介绍**

ELK是一套开源的日志分析系统，由elasticsearch+logstash+Kibana组成。

官网说明:https://www.elastic.co/cn/products

首先: 先一句话简单了解E,L,K这三个软件

Elasticsearch 垃圾处理厂
Elasticsearch 是基于 JSON 的分布式搜索和分析引擎，专为实现水平扩展、高可靠性和管理便捷性而设计

Elasticsearch 是一个分布式的 RESTful 风格的搜索和数据分析引擎，能够解决不断涌现出的各种用例。作为 Elastic Stack 的核心，它集中存储您的数据，帮助您发现意料之中以及意料之外的情况。

Logstash 垃圾中转站

Logstash 是动态数据收集管道，拥有可扩展的插件生态系统，能够与 Elasticsearch 产生强大的协同作用。
Logstash 是开源的服务器端数据处理管道，能够同时从多个来源采集数据，转换数据，然后将数据发送到您最喜欢的 “存储库” 中。（我们的存储库当然是 Elasticsearch）

Kibana 垃圾处理报表
Kibana 能够以图表的形式呈现数据，并且具有可扩展的用户界面，供您全方位配置和管理 Elastic Stack。

Kibana 让您能够自由地选择如何呈现您的数据。或许您一开始并不知道自己想要什么。不过借助 Kibana 的交互式可视化，您可以先从一个问题出发，看看能够从中发现些什么。
一张图片胜过千万行日志

Beats 垃圾桶 垃圾回收车
Beats 是轻量型采集器的平台，从边缘机器向 Logstash 和 Elasticsearch 发送数据。

Beats 是数据采集的得力工具。将这些采集器安装在您的服务器中，它们就会把数据汇总到 Elasticsearch。如果需要更加强大的处理性能，Beats 还能将数据输送到 Logstash 进行转换和解析。

![elk架构图.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601974367132.png)

ELK下载地址:https://www.elastic.co/cn/downloads

![elk_download_page.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601974302132.png)

## 四、ELK学习准备

### 4.1、实验拓扑图:

![elk部署图3933846.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601974397761.png)

- 收集系统日志

	 F-E-K

	 L-E-K

	 F-L-E-K

- 收集web服务器access.log日志

- 收集mysql slow日志

### 4.2、部署前准备

- 静态IP(要求能上公网,最好用虚拟机的NAT网络类型上网)
- 主机名及IP绑定
- 关闭防火墙和selinux
- 时间同步 chrony
- yum源(centos安装完系统后的默认yum源就OK)

1. 所有服务器全部采用静态ip

	| 主机名称 | IP地址            | 角色                 |
	| -------- | ----------------- | -------------------- |
	| manage01 | 192.168.98.200/24 | kibana数据展示       |
	| node1    | 192.168.98.201/24 | ES1                  |
	| node2    | 192.168.98.202/24 | ES2                  |
	| node3    | 192.168.98.203/24 | logstash或(业务机器) |
	| node4    | 192.168.98.204/24 | filebeat-业务机器    |

2. 主机名及IP互相绑定

	```
	[root@manage01 ~]# cat /etc/hosts
	127.0.0.1   localhost
	::1         localhost 
	192.168.98.200	manage01
	192.168.98.201	node1
	192.168.98.202	node2
	192.168.98.203	node3
	192.168.98.204	node4
	
	其他机器同理
	```

3. 关闭防火墙, selinux

	```
	[root@manage01 ~]# systemctl disable firewalld
	[root@manage01 ~]# iptables -F
	[root@manage01 ~]# iptables -t nat -F
	[root@manage01 ~]# sed -i -r '/SELINUX=/c\SELINUX=disabled' /etc/selinux/config
	[root@manage01 ~]# reboot
	
	
	其他机器同理
	```

4. 采用时间服务器，时间同步

	```
	1、修改配置文件，配置时间服务器为阿里云的时间服务器
	[root@manage01 ~]# egrep "^server" /etc/chrony.conf 
	server ntp1.aliyun.com
	server ntp2.aliyun.com
	server ntp3.aliyun.com
	server ntp4.aliyun.com
	
	#注释
	# pool 2.centos.pool.ntp.org iburst
	
	2、重启服务chronyd
	[root@manage01 ~]# systemctl restart chronyd.service 
	
	3、查看源信息
	#chronyc chrony的命令行客户端
	[root@manage01 ~]# chronyc sources -v
	210 Number of sources = 2
	
	  .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
	 / .- Source state '*' = current synced, '+' = combined , '-' = not combined,
	| /   '?' = unreachable, 'x' = time may be in error, '~' = time too variable.
	||                                                 .- xxxx [ yyyy ] +/- zzzz
	||      Reachability register (octal) -.           |  xxxx = adjusted offset,
	||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
	||                                \     |          |  zzzz = estimated error.
	||                                 |    |           \
	MS Name/IP address         Stratum Poll Reach LastRx Last sample               
	===============================================================================
	^? 120.25.115.20                 2   6     1     3   +663us[ +663us] +/-   23ms
	^? 203.107.6.88                  2   6     1     2  -1326us[-1326us] +/-   17ms
	```

5. yum源设置

	建议采用默认yum源就可以