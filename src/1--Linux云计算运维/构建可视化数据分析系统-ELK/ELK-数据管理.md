## 一、elasticsearch基础概念

主要的基础概念有: Index,Type,Document,Field,shard和replicas.

Index(索引): 是具有相似特性的文档集合。

Type(类型): 在一个索引中可以定义一个或多个类型。

Documenet(文档): 索引信息的基本单位。

Field(字段): ES里更小的信息单位。

shard(分片)： 数据存储的方式

replicas(副本)：副本 数据备份

为了便于理解,我们和mysql这种关系型数据库做一个对比:

| 关系型数据库(如mysql,oracle等) | elasticsearch |
| :----------------------------- | :------------ |
| database                       | index         |
| table                          | type          |
| row                            | document      |
| column                         | field         |

ES是分布式搜索引擎，每个索引有一个或多个分片(shard)，索引的数据被分配到各个分片上。你可以看作是一份数据分成了多份给不同的节点。

## 二、elaticsearch基础API操作

**如果有ES集群,则为ES任意节点IP都可以**

前面我们通过http://192.168.98.201:9200/_cluster/health?pretty查看ES集群状态,其实就是它的一种API操作。

```
什么是API?
API(Application Programming Interface)应用程序编程接口,就是无需访问程序源码或理解内部工作机制就能实现一些相关功能的接口。
```

elasticseearch的API很多, 我们运维人员主要用到以下几个要介绍的较简单的API。

更多API参考: https://www.elastic.co/guide/en/elasticsearch/reference/6.2/index.html

##### **查看节点信息**

通过curl或浏览器访问http://192.168.98.202:9200/_cat/nodes?v ip为ES节点IP,如果有ES集群,则为ES任意节点IP都可以)

```
[root@node1 ~]# curl http://192.168.98.202:9200/_cat/nodes?v   
ip             heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
192.168.98.201            9          94   0    0.09    0.06     0.06 dilm      *      node1
192.168.98.202           15          92   4    0.12    0.14     0.11 dilm      -      node2
```

使用浏览器访问

![05_api_查看节点信息.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601975332241.png)

## 三、索引管理

- 文本界面API管理索引
- web图形ES-head管理索引

### 文本界面管理索引

- 查看索引信息

通过curl或浏览器访问http://192.168.98.201:9200/_cat/indices?v

```
[root@node1 ~]# curl http://192.168.98.201:9200/_cat/indices?v
health status index uuid pri rep docs.count docs.deleted store.size pri.store.size
默认现在没有任何索引
```

- 新增索引

```
[root@node1 ~]# curl -X PUT http://192.168.98.201:9200/zutuanxue_com_access_log 
[root@node1 ~]#


输出信息
{"acknowledged":true,"shards_acknowledged":true,"index":"zutuanxue_com_access_log"}

[root@node1 ~]# curl http://192.168.98.201:9200/_cat/indices?v
health status index                   uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   zutuanxue_com_access_log A_keWJh4RSOUS3gKCX2AwA   1   1          0            0       460b           230b
```

![06_api_查看索引.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601975369276.png)

green:表示每个index的shard和replica都是活跃状态的。

yellow:表示每个index的shard是活跃状态的，replica是不可用状态的。

red：表示索引中有些shard是不可用状态，导致数据丢失。

- 删除索引

```
[root@node1 ~]#  curl -X DELETE http://192.168.98.201:9200/zutuanxue_com_access_log 
{"acknowledged":true}
```

当ES集群增加或删除节点时,shard会在多个节点中均衡分配。7.0之前，默认是5个primary shard(主分片)和1个replica shard(副本,用于容错)。7.x之后是1个主分片 1个副本分片