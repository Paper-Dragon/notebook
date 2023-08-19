单节点的ES需要在处理大量数据的时候需要消耗大量内存和CPU资源，数据量大到一定程度就会产生处理瓶颈，甚至会出现宕机。为了解决单节点ES的处理能力的瓶颈及单节点故障问题，我们考虑使用ES集群。

## 一、ES集群的优点：

优化数据处理能力：通过多台ES共同处理数据，提升处理能力，节省时间。

容错能力增强：解决了ES单点故障问题，让架构更稳定。

数据安全：分布式数据存储，数据更安全

**实验部署准备**

两台ES机器：node1、node2

同步时间：chrony

静态IP：192.168.98.201 192.168.98.202

关闭防火墙、selinux

配置ES yum源

```
准备工作参考https://www.zutuanxue.com/home/4/52_138
   - ELK学习准备
```

## 二、集群部署

部署步骤:

1. node1、node2安装jdk、Elasticsearch软件包
2. node1、node2设置配置文件配置集群
3. 启动ES验证集群

### 2.1、软件包安装

```
软件包安装,机器node1 node2

以node1为例
jdk安装通过rpm软件包
[root@node1 ~]# rpm -ivh jdk-13.0.2_linux-x64_bin.rpm

Elasticsearch安装通过rpm软件包
[root@node1 ~]# rpm -ivh elasticsearch-7.6.0-x86_64.rpm 
```

### 2.2、node1、node2设置配置文件配置集群

```
配置文件修改
[root@node1 ~]# egrep -v "(^#|^$)" /etc/elasticsearch/elasticsearch.yml 
cluster.name: zutuanxue_elk					集群名称,所有节点必须一样
node.name: node1											节点名称
#node.master: true											定义为主 
path.data: /var/lib/elasticsearch			数据路径
path.logs: /var/log/elasticsearch			日志路径
network.host: 0.0.0.0									监听地址
http.port: 9200												监听端口
discovery.seed_hosts: ["node1", "node2"]    可扫描监控的主机
cluster.initial_master_nodes: ["node1", "node2"]  开启服务的时候谁可以竞选为主[第一次启动集群]

node2配置文件
[root@node2 elasticsearch]# egrep -v "(^#|^$)" /etc/elasticsearch/elasticsearch.yml 
cluster.name: zutuanxue_elk
node.name: node2
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 192.168.98.202
discovery.seed_hosts: ["node1", "node2"]
cluster.initial_master_nodes: ["node1", "node2"]

拓展
当您想要与其他主机上的节点组成群集时，你必须使用 discovery.seed_hosts 来提供群集中可以成为master ，可能存在并且可以连接到的其他节点的列表，使得 discovery process 能够发现节点)。此设置通常应包含群集中所有可以成为master节点的地址。需要注意的是，IPv6主机必须放在括号内。此设置的默认值为127.0.0.1，[::1]。


cluster.initial_master_nodes
当你第一次启动全新的Elasticsearch集群时，会有一个集群引导(cluster bootstrapping)步骤，这个步骤会确定一个在第一次选举中投票被计数的、并且可以成为master节点的集合。
cluster.initial_master_nodes参数说明：es7 引用了 [Bootstrapping a cluster](https://www.elastic.co/guide/en/elasticsearch/reference/master/modules-discovery-bootstrap-cluster.html) 后，首次启动Elasticsearch集群需要在集群中的一个或多个符合主节点的节点上显式定义初始的符合主节点的节点集。这称为群集自举，这仅在群集首次启动时才需要。
```

### 2.3 启动ES验证集群

```
启动ES
[root@node1 ~]# systemctl restart elasticsearch
[root@node2 ~]# systemctl restart elasticsearch
确保服务正常启动：端口正常打开
```

### 2.4 集群测试

web站点测试方法：http://192.168.98.201:9200/_cluster/health?pretty

![04_es_cluster.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601974986968.png)

```
页面输出介绍
{
  "cluster_name" : "zutuanxue_elk",   #集群名称
  "status" : "green",									 #集群状态
  "timed_out" : false,								 #超时设置
  "number_of_nodes" : 2,							 #集群节点数量
  "number_of_data_nodes" : 2,          #集群数据节点数量
  "active_primary_shards" : 0,
  "active_shards" : 0,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 0,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 100.0
}
```