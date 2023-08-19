sentinel模式基本可以满足一般生产的需求，具备高可用性。但是当数据量过大到一台服务器存放不下的情况时，主从模式或sentinel模式就不能满足需求了，这个时候需要对存储的数据进行分片，将数据存储到多个Redis实例中。cluster模式的出现就是为了解决单机Redis容量有限的问题，将Redis的数据根据一定的规则分配到多台机器。

## 一、集群模式概述

### 1.1、什么是集群模式

Redis 的哨兵和主从模式基本已经可以实现高可用和读写分离 ，但是在这种模式下每台 Redis 服务器都存储相同的数据，浪费内存空间，所以在redis上加入了 Cluster 集群模式，实现了 Redis 的分布式存储，也就是说Redis 节点上存储不同的内容。

![image20200311161653767.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525043995.png)

### 1.2、集群模式特点

多个redis节点网络互联，数据共享

所有的节点都是一主一从（也可以是一主多从），其中从节点不提供服务，仅作为备用

不支持同时处理多个key（如MSET/MGET），因为redis需要把key均匀分布在各个节点上，并发量很高的情况下同时创建key-value会降低性能并导致不可预测的行为

支持在线增加、删除节点

客户端可以连接任何一个主节点进行读写

### 1.3、集群工作方式

**数据存取工作方式**

在 Redis 的每一个节点上，都有这么两个东西，一个是插槽（slot），一个是cluster。

插槽的取值范围是：0-16383。cluster，可以理解为是一个集群管理的插件。

当我们的存取 Key的时候，Redis 会根据算法得出一个结果，然后把结果对 16384 求余数，这样每个 key 都会对应一个编号在 0-16383 之间的哈希槽，通过这个值，去找到对应的插槽所对应的节点，然后直接自动跳转到这个对应的节点上进行存取操作。

**集群工作方式**

为了保证高可用，redis集群模式引入了主从模式，一个主节点对应一个或者多个从节点，当主节点宕机的时候，就会启用从节点。

那么如何发现主节点宕机？当其它主节点ping一个主节点C时，如果半数以上的主节点与C通信超时，那么认为主节点C宕机了。如果主节点C和它的从节点C1都宕机了，那么该集群就无法再提供服务了。

## 二、集群模式的搭建

### 2.1、搭建前的准备

集群搭建：至少要三个master

第一步：创建一个文件夹redis-cluster，然后在其下面分别创建6个文件夹如下：

```
[root@zutuanxue redis]# mkdir redis-cluster
[root@zutuanxue redis]# cd redis-cluster/
[root@zutuanxue redis-cluster]# mkdir 7001
[root@zutuanxue redis-cluster]# mkdir 7002
[root@zutuanxue redis-cluster]# mkdir 7003
[root@zutuanxue redis-cluster]# mkdir 7004
[root@zutuanxue redis-cluster]# mkdir 7005
[root@zutuanxue redis-cluster]# mkdir 7006
```

第二步：把之前的redis.conf配置文件分别copy到700*下

```
[root@zutuanxue redis]# cp redis.conf ./redis-cluster/7001/redis.conf
[root@zutuanxue redis]# cp redis.conf ./redis-cluster/7002/redis.conf
[root@zutuanxue redis]# cp redis.conf ./redis-cluster/7003/redis.conf
[root@zutuanxue redis]# cp redis.conf ./redis-cluster/7004/redis.conf
[root@zutuanxue redis]# cp redis.conf ./redis-cluster/7005/redis.conf
[root@zutuanxue redis]# cp redis.conf ./redis-cluster/7006/redis.conf
```

第三步：由于redis集群需要使用ruby命令，所以我们需要安装ruby

```
yum install ruby
yum install rubygems
gem install redis #（安装redis和ruby的接口）
```

### 2.2、修改集群配置

```
[root@zutuanxue redis]# vim ./redis-cluster/7001/redis.conf
#需要修改的配置
daemonize yes
port 700* #（分别对每个机器的端口号进行设置）
bind 192.168.1.171 #（必须要绑定当前机器的ip，不然会无限悲剧下去哇..深坑勿入！！！）
dir /usr/local/redis-cluster/700*/ #（指定数据文件存放位置，必须要指定不同的目录位置，不然会丢失数据，深坑勿入！！！）
appendonly yes
cluster-enabled yes  #（启动集群模式，开始玩耍）
cluster-config-file nodes700*.conf#（这里700x最好和port对应上）
cluster-node-timeout 5000  #redis节点宕机被发现的时间 
```

**注意：**

每个文件要修改端口号，bind的ip，数据存放的dir，并且nodes文件都需要进行修改！

### 2.3、启动redis服务

```
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7001/redis.conf
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7002/redis.conf
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7003/redis.conf
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7004/redis.conf
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7005/redis.conf
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7006/redis.conf
```

### 2.4、创建集群

执行redis-cli --cluster create命令

```
[root@zutuanxue redis]# ./src/redis-cli --cluster create 192.168.1.121:7001 192.168.1.121:7002 192.168.1.121:7003 192.168.1.121:7004 192.168.1.121:7005 192.168.1.121:7006 --cluster-replicas 1
```

**说明：**

create

表示创建一个redis集群。

–cluster-replicas 1

表示为集群中的每一个主节点指定一个从节点，即一比一的复制。

![image20200311021844778.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525088763.png)

### 2.5、查看redis服务状态

```
[root@zutuanxue redis]# ps -ef|grep redis
```

![image20200311022733954.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525120529.png)

### 2.6、进入一个节点

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7001
192.168.1.121:7001> info cluster
# Cluster
cluster_enabled:1 #节点是否为cluster模式 。1是0否
```

### 2.7、测试操作

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> set b fdfsfsd
-> Redirected to slot [3300] located at 192.168.1.121:7001
OK
192.168.1.121:7001> get b 
"fdfsfsd"
192.168.1.121:7001> set c fdsfdfdsfds
-> Redirected to slot [7365] located at 192.168.1.121:7002
OK
192.168.1.121:7002> get c
"fdsfdfdsfds"
192.168.1.121:7002> set x fdsfdsfsdf
-> Redirected to slot [16287] located at 192.168.1.121:7003
OK
192.168.1.121:7003> keys *
1) "x"
2) "a"
192.168.1.121:7003> get b
-> Redirected to slot [3300] located at 192.168.1.121:7001
"fdfsfsd"
192.168.1.121:7001> keys *
1) "b"
192.168.1.121:7001> set d fdsfdsfsd
-> Redirected to slot [11298] located at 192.168.1.121:7003
OK
192.168.1.121:7003> get d
"fdsfdsfsd"
192.168.1.121:7003> set x zhangsan
OK
192.168.1.121:7003> get x
"zhangsan"
```

## 三、集群操作

### 3.1、主从切换

查看节点信息

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7001
192.168.1.121:7001> cluster nodes #查看集群中的节点
```

![image20200311022119169.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525167260.png)

停掉7003，在查看节点信息

```
[root@zutuanxue redis]# ps -ef|grep redis
root      31370      1  0 21:04 ?        00:00:05 ./src/redis-server 192.168.1.121:7001 [cluster]
root      31375      1  0 21:04 ?        00:00:05 ./src/redis-server 192.168.1.121:7002 [cluster]
root      31380      1  0 21:04 ?        00:00:05 ./src/redis-server 192.168.1.121:7003 [cluster]
root      31385      1  0 21:05 ?        00:00:05 ./src/redis-server 192.168.1.121:7004 [cluster]
root      31394      1  0 21:05 ?        00:00:05 ./src/redis-server 192.168.1.121:7005 [cluster]
root      31399      1  0 21:05 ?        00:00:05 ./src/redis-server 192.168.1.121:7006 [cluster]
root      32361   2769  0 22:39 pts/0    00:00:00 grep --color=auto redis
[root@zutuanxue redis]# kill -s 9 31380
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311104105384.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525193743.png)

启动7003，查看节点信息

```
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7003/redis.conf 
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311104532681.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525212892.png)

### 3.2、从节点操作

#### 3.2.1、前期准备

准备一个新的Redis，7007

```
[root@zutuanxue redis]# cd redis-cluster/
[root@zutuanxue redis-cluster]# ls
7001  7002  7003  7004  7005  7006
[root@zutuanxue redis-cluster]# mkdir 7007
[root@zutuanxue redis-cluster]# cp ./7006/redis.conf ./7007/redis.conf
[root@zutuanxue redis-cluster]# cd ..
[root@zutuanxue redis]# vim ./redis-cluster/7007/redis.conf 
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7007/redis.conf
```

#### 3.2.2、增加从节点

```
[root@zutuanxue redis]# ./src/redis-cli --cluster add-node 192.168.1.121:7007 192.168.1.121:7004 --cluster-slave
```

![image20200311110027423.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525250988.png)

查看节点信息

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311110122577.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525267045.png)

#### 3.2.3、删除从节点

删除7007节点

```
[root@zutuanxue redis]# ./src/redis-cli --cluster del-node 192.168.1.121:7007 99d2ceb080ef0d701546dea0901d4784a201fc06
>>> Removing node 99d2ceb080ef0d701546dea0901d4784a201fc06 from cluster 192.168.1.121:7007
>>> Sending CLUSTER FORGET messages to the cluster...
>>> SHUTDOWN the node.
```

查看节点信息

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311111604404.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525295327.png)

### 3.3、主节点操作

#### 3.3.1、添加主节点

将7007设置为7006的主节点

保证7007服务是启动的

```
[root@zutuanxue redis]# ./src/redis-cli --cluster add-node 192.168.1.121:7007 192.168.1.121:7006
```

![image20200311113529372.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525349151.png)

查看节点信息，未分配槽位不能存储数据

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311113509393.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525366728.png)

重新分配槽位

```
[root@zutuanxue redis]# ./src/redis-cli --cluster reshard 192.168.1.121:7007
```

![image20200311114438978.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525385352.png)

查看节点信息

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311114537492.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525403580.png)

#### 3.3.2、给主节点加从节点

准备一个新的Redis，7008

```
[root@zutuanxue redis]# cd redis-cluster/
[root@zutuanxue redis-cluster]# ls
7001  7002  7003  7004  7005  7006  7007
[root@zutuanxue redis-cluster]# mkdir 7008
[root@zutuanxue redis-cluster]# cp ./7007/redis.conf ./7008/redis.conf
[root@zutuanxue redis-cluster]# vim ./7008/redis.conf
[root@zutuanxue redis-cluster]# cd ..
[root@zutuanxue redis]# ./src/redis-server ./redis-cluster/7008/redis.conf 
```

为7007添加从节点7008

```
[root@zutuanxue redis]# ./src/redis-cli --cluster add-node 192.168.1.121:7008 192.168.1.121:7007 --cluster-slave
```

查看节点信息

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311115414289.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525436695.png)

### 3.4、主节点操作

#### 3.4.1、删除主节点

删除从节点

```
[root@zutuanxue redis]# ./src/redis-cli --cluster del-node 192.168.1.121:7008 8e52c94dafa72df26b1eddf94363a4780bed9339
>>> Removing node 8e52c94dafa72df26b1eddf94363a4780bed9339 from cluster 192.168.1.121:7008
>>> Sending CLUSTER FORGET messages to the cluster...
>>> SHUTDOWN the node.
```

移动数据将7007移动到7001节点

```
[root@zutuanxue redis]# ./src/redis-cli --cluster reshard 192.168.1.121:7007
```

![image20200311120414164.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525488124.png)

查看节点信息

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311120554074.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525509641.png)

删除主节点

```
[root@zutuanxue redis]# ./src/redis-cli --cluster del-node 192.168.1.121:7007 d7a3e48cd142dce6566023fce21e31669e9fa3d5
>>> Removing node d7a3e48cd142dce6566023fce21e31669e9fa3d5 from cluster 192.168.1.121:7007
>>> Sending CLUSTER FORGET messages to the cluster...
>>> SHUTDOWN the node.
```

查看节点信息

```
[root@zutuanxue redis]# ./src/redis-cli -c -h 192.168.1.121 -p 7005
192.168.1.121:7005> cluster nodes
```

![image20200311120839746.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525527888.png)