Redis有两种不同的持久化方式，Redis服务器通过持久化，把Redis内存中持久化到硬盘当中，当Redis宕机时，我们重启Redis服务器时，可以由RDB文件或AOF文件恢复内存中的数据。

不过持久化后的数据仍然只在一台机器上，因此当硬件发生故障时，比如主板或CPU坏了，这时候无法重启服务器，有什么办法可以保证服务器发生故障时数据的安全性？或者可以快速恢复数据呢？想做到这一点，我们需要再了解Redis另外一种机制：主从复制。

## 一、主从复制概述

### 1.1、单机问题

#### 1.1.1、机器宕机

如果发生机器宕机（主板烧坏、硬盘损坏、内存损坏等），短时间内我们也无法修复，我们就会考虑将redis迁移到另外一台机器上，并且还要考虑数据同步问题。

#### 1.1.2、容器瓶颈

一台机器内存是16G，redis使用12个G内存，除了redis还要使用其他的应用，这个时候，我们可能需要32个G内存才能使用，但是redis的应用对内存的增加也会提交，我们不能一直去提高单机的内存？

#### 1.1.3、QPS瓶颈

redis官方数据显示redis可以处理达到10w的QPS，如果业务需要50w、100w的QPS时我们怎么办？

关于容量瓶颈、QPS瓶颈和机器宕机，这就是redis分布式和高可用需要解决的问题。

### 1.2、什么是主从复制

Master可以拥有多个slave；多个slave可以连接同一个Master外，还可以连接到其他的slave；主从复制不会阻塞Master，在主从复制时，Master可以处理client请求。

### 1.3、主从复制形式

#### 1.3.1、一主一从

![image20200304135049546.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524494515.png)

左边是Master节点，右边是slave节点，即主节点和从节点。主节点是数据写入，从节点可以通过复制操作将主节点的数据同步过来，并且随着主节点数据不断写入，从节点数据也会做同步的更新。

#### 1.3.2、一主多从

![image20200304135547579.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524507422.png)

一个master可以有多个slave，也就相当于有了多份的数据副本。这样可以做一个更加高可用的选择，例如一个master和一个slave挂掉了，还能有其他的slave数据备份。

### 1.4、主从复制作用

**数据备份**

将master的数据，备份到slave

**读写分离**

用master来写入数据，用slave完成备份后，来完成只读的功能。

**注意：**

当master宕机后，不会去选择slave作为master。需要手动将一台slave使用slaveof on one提升为master，要想自动实现提升，我们就需要使用哨兵。

## 二、单机主从

配置一主二从

### 2.1、复制redis.conf

在/usr/local/redis目下，将redis.conf复制成三份分别取名为：redis-8000.conf、redis-8001.conf、redis-8002.conf三个配置文件

```
[root@zutuanxue redis]# cp redis.conf redis-8000.conf
[root@zutuanxue redis]# cp redis.conf redis-8001.conf
[root@zutuanxue redis]# cp redis.conf redis-8002.conf
```

### 2.2、配置主机

以redis-8000为主机

```
#bind 127.0.0.1  #将bind注释掉 或 bind 0.0.0.0
port 8000  #改变其服务端口
daemonize yes   #修改服务为后台运行
pidfile /var/run/redis_8000.pid   #指定不同的pid文件，注意三份配置文件不同。
logfile "/usr/local/redis/log/redis_8000.log"  #指定log日志路径，自己配，要求不同。
dir ./data/redis_8000  #这个指定rdb文件和aof文件的路径配置，要求改成不同。
masterauth ibethfy  #都配上吧，从服务到主服务的认证密码。
requirepass ibethfy  #三份文件都配置，客户端访问需要密码验证。
```

### 2.3、配置从机

以redis-8001，redis-8002为从机

```
#bind 127.0.0.1  #将bind注释掉 或 bind 0.0.0.0
port 8001  #改变其服务端口
daemonize yes   #修改服务为后台运行
pidfile /var/run/redis_8001.pid   #指定不同的pid文件，注意三份配置文件不同。
logfile "/usr/local/redis/log/redis_8001.log"  #指定log日志路径，自己配，要求不同。
dir ./data/redis_8001  #这个指定rdb文件和aof文件的路径配置，要求改成不同。
replicaof 127.0.0.1 8000  #主服务这句话注释，从服务配置的两台需要开启。配置主服务的ip的port。
masterauth ibethfy  #都配上吧，从服务到主服务的认证密码。
requirepass ibethfy  #三份文件都配置，客户端访问需要密码验证。
#bind 127.0.0.1  #将bind注释掉 或 bind 0.0.0.0
port 8002  #改变其服务端口
daemonize yes   #修改服务为后台运行
pidfile /var/run/redis_8002.pid   #指定不同的pid文件，注意三份配置文件不同。
logfile "/usr/local/redis/log/redis_8002.log"  #指定log日志路径，自己配，要求不同。
dir ./data/redis_8002  #这个指定rdb文件和aof文件的路径配置，要求改成不同。
replicaof 127.0.0.1 8000  #主服务这句话注释，从服务配置的两台需要开启。配置主服务的ip的port。
masterauth ibethfy  #从服务到主服务的认证密码。
requirepass ibethfy  #三份文件都配置，客户端访问需要密码验证。
```

**注意：**

replicaof 127.0.0.1 8000 在以前的版本中用的是slaveof 127.0.0.1 8000，这个配置现在也可以使用

### 2.4、启动服务

开启服务

```
[root@zutuanxue redis]# ./src/redis-server ./redis-8000.conf
[root@zutuanxue redis]# ./src/redis-server ./redis-8001.conf
[root@zutuanxue redis]# ./src/redis-server ./redis-8002.conf
```

查看服务是否启动

```
[root@zutuanxue redis]# ps -ef|grep redis
root      14464      1  0 11:58 ?        00:00:00 ./src/redis-server 0.0.0.0:8000
root      14477      1  0 11:58 ?        00:00:00 ./src/redis-server 0.0.0.0:8001
root      14484      1  0 11:58 ?        00:00:00 ./src/redis-server 0.0.0.0:8002
root      14491  13960  0 11:58 pts/1    00:00:00 grep --color=auto redis
```

开启三个客户端

```
[root@zutuanxue redis]# ./src/redis-cli -h 127.0.0.1 -p 8000
[root@zutuanxue redis]# ./src/redis-cli -h 127.0.0.1 -p 8001
[root@zutuanxue redis]# ./src/redis-cli -h 127.0.0.1 -p 8002
```

查看主从信息info replication

```
127.0.0.1:8000> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=127.0.0.1,port=8001,state=online,offset=392,lag=1
slave1:ip=127.0.0.1,port=8002,state=online,offset=392,lag=1
master_replid:9e9ab9f313fae877e7330507fd7b4ce99bc98124
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:392
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:392
127.0.0.1:8001> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:8000
master_link_status:up
master_last_io_seconds_ago:6
master_sync_in_progress:0
slave_repl_offset:434
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:9e9ab9f313fae877e7330507fd7b4ce99bc98124
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:434
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:434
127.0.0.1:8002> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:8000
master_link_status:up
master_last_io_seconds_ago:4
master_sync_in_progress:0
slave_repl_offset:420
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:9e9ab9f313fae877e7330507fd7b4ce99bc98124
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:420
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:420
```

### 2.5、读写分离

主机写入信息

```
[root@zutuanxue redis]# ./src/redis-cli -h 127.0.0.1 -p 8000
127.0.0.1:8000> set str helloworld
OK
```

从机查看信息

```
[root@zutuanxue redis]# ./src/redis-cli -h 127.0.0.1 -p 8001
127.0.0.1:8001> get str
"helloworld"
127.0.0.1:8001> set h 123
(error) READONLY You can't write against a read only replica.
[root@zutuanxue redis]# ./src/redis-cli -h 127.0.0.1 -p 8002
127.0.0.1:8002> get str
"helloworld"
127.0.0.1:8002> set h 123
(error) READONLY You can't write against a read only replica.
```

## 三、多机主从

配置一主二从

### 3.1、准备工作

开启三台虚拟主机123、124、125，分别安装redis

关闭主机防火墙

```
firewall-cmd --state  #查看防火墙状态
service firewalld stop  #关闭防火墙
```

### 3.2、配置主机和从机

123为主机，修改配置文件redis.conf

```
主机配置
#bind 127.0.0.1  #将bind注释掉 或 bind 0.0.0.0
port 6379  #改变其服务端口
daemonize yes   #修改服务为后台运行
pidfile /var/run/redis_6379.pid   #指定不同的pid文件，注意三份配置文件不同。
logfile "/usr/local/redis/log/redis.log"  #指定log日志路径，自己配，要求不同。
dir ./  #这个指定rdb文件和aof文件的路径配置，要求改成不同。
masterauth ibethfy  #都配上吧，从服务到主服务的认证密码。
requirepass ibethfy  #三份文件都配置，客户端访问需要密码验证。

从机配置
replicaof 192.168.1.123 6379  #主服务这句话注释，从服务配置的两台需要开启。配置主服务的ip的port。
```

### 3.3、启动服务

分别启动三台主机的redis服务器端服务

```
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
[root@zutuanxue redis]# ps -ef|grep redis
```

分别启动三台主机客户端服务

```
[root@zutuanxue redis]# ./src/redis-cli
```

查看主从信息info replication

```
127.0.0.1:6379> info replication
```

### 3.4、读写分离

123为Master，124、125为Slave

Master为写

```
127.0.0.1:6379> set str helloworld
OK
```

Slave为读

```
127.0.0.1:6379> get str
"helloworld"
127.0.0.1:6379> set ss fdfd
(error) READONLY You can't write against a read only replica.
```

## 四、手动设置主从

当123虚拟机死机后，如何去手动设置我们的主从，124为主，125为从

**124执行slaveof no one**

执行命令 SLAVEOF NO ONE 将使得这个从属服务器关闭复制功能，并从从属服务器转变回主服务器，原来同步所得的数据集不会被丢弃。

```
127.0.0.1:6379> slaveof no one
OK
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0
master_replid:edb62cdf853a4c9caeab077005a58a3633cb55d0
master_replid2:4bf0fb1edcb4ed661b919c0d10e6be193c63ccd1
master_repl_offset:1630
second_repl_offset:1631
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:1630
```

**125执行slaveof host port**

执行 SLAVEOF host port 将使当前服务器停止对旧主服务器的同步，丢弃旧数据集，转而开始对新主服务器进行同步。

```
127.0.0.1:6379> slaveof 192.168.1.124 6379
OK
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:192.168.1.124
master_port:6379
master_link_status:up
master_last_io_seconds_ago:3
master_sync_in_progress:0
slave_repl_offset:1701
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:edb62cdf853a4c9caeab077005a58a3633cb55d0
master_replid2:4bf0fb1edcb4ed661b919c0d10e6be193c63ccd1
master_repl_offset:1701
second_repl_offset:1631
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:1701
```