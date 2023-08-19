Redis（全称：Remote Dictionary Server 远程字典服务）是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。从2010年3月15日起，Redis的开发工作由VMware主持。从2013年5月开始，Redis的开发由Pivotal赞助。

Redis是一个开源的使用ANSI C语言编写、遵守BSD协议、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。它通常被称为数据结构服务器，因为值（value）可以是 字符串(String), 哈希(Map), 列表(list), 集合(sets)和有序集合(sorted sets)等类型。

## 一、Redis概述

### 1.1、NoSQL

NoSQL，泛指非关系型的数据库，是不同于传统的关系型数据库的数据库管理系统的统称。

NoSQL用于超大规模数据的存储，收集万亿比特的数据。这些类型的数据存储没有固定的形式，没有多余操作就可以横向扩展。

### 1.2、什么是Redis

Redis是NoSQL中的一种存储工具，他是一个key-value存储系统。默认有16个数据库从0到15来进行表示。Redis的存储类型：包括string(字符串)、list(链表)、set(集合)、zset(sorted set --有序集合)和hash（哈希类型）。在此基础上，Redis支持各种不同方式的排序。

Redis 被广泛应用在缓存方向，与传统数据库不同的是 Redis 的数据是存在内存中的，因此读写速度非常快。

Redis为分布式缓存，在多客户端的情况下，共用一份缓存数据，缓存具有一致性。

Redis会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了master-slave(主从)同步，为了可靠性。

### 1.3、Redis特点

**性能极高** – Redis读的速度是11W次/s,写的速度是81K次/s

**支持数据的持久化**，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。

**丰富的数据类型**，Redis不仅仅支持简单的key-value类型的数据，同时还提供Strings, Lists, Hashes, Sets 及 Ordered Sets 等数据结构的存储。

**支持数据的备份**，即master-slave模式的数据备份。

### 1.4、Redis优缺点

**优点：**

- 对数据高并发读写
- 对海量数据的高效率存储和访问
- 对数据具有的可扩展性和高可用性

**缺点：**

- redis(ACID)处理非常简单
- 无法做到太复杂的关系数据库模型

## 二、Redis下载与安装

### 2.1、Redis下载

**下载地址:** http://www.redis.cn/download.html

![image20200223232710202.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522538421.png)

### 2.2、Redis安装

#### 2.2.1、指定redis存放位置

/usr/local/目录下

![image20200223233057457.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522573612.png)

#### 2.2.2、解压

```
[root@localhost local]# tar xzf redis-5.0.5.tar.gz 
```

#### 2.2.3、改名

```
[root@localhost local]# mv redis-5.0.5 redis
```

#### 2.2.3、安装

进入redis目录，输入make

```
[root@localhost /]# cd /usr/local/redis
[root@localhost redis]# make
```

#### 2.2.4、启动服务

进入src目录，输入./redis-server

```
[root@localhost redis]# cd src
[root@localhost src]# ./redis-server
```

![image20200223235132859.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522620683.png)

#### 2.2.5、使用客户端程序

进入src目录，输入./redis-cli

```
[root@localhost ~]# cd /usr/local/redis/src
[root@localhost src]# ./redis-cli
```

![image20200223235513766.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522636085.png)

## 三、服务器操作

### 3.1、服务器端

#### 3.1.1、查看是否启动

```
[root@localhost redis]# ps -ef|grep redis
```

或

```
[root@localhost redis]# ./src/redis-cli ping
```

#### 3.1.2、启动

**前台启动**

```
[root@localhost redis]# ./src/redis-server
```

**后台启动**

修改/usr/local/redis/redis.conf文件

```
daemonize yes  #前台启动，改后台启动
```

指定配置文件，启动

```
[root@localhost redis]# ./src/redis-server ./redis.conf
```

#### 3.1.3、关闭

```
[root@localhost redis]# ./src/redis-cli shutdown
```

### 3.2、客户端

#### 3.2.1、启动

```
[root@localhost redis]# ./src/redis-cli
127.0.0.1:6379> 
```

#### 3.2.2、关闭

方式一：指令ctrl+c

方式二：执行指令quit

方式三：执行指令exit

### 3.3、设置远程访问

修改/usr/local/redis/redis.conf文件

```
#bind 127.0.0.1  #注释掉允许本地连接 
protected-mode no  #允许远程访问
```

## 四、Redis客户端

### 4.1、Redis客户端下载

**下载地址:** https://redisdesktop.com/pricing

![image20200224004947866.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522698044.png)

### 4.2、安装

双击打开程序，选择“下一步”

![image20200224005136221.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522739448.png)

继续选择“我同意”

![image20200224005207896.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522754703.png)

选择安装路径，点击“安装”

![image20200224005249413.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522775709.png)

安装中。。。。。。。

![image20200224005325342.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522788655.png)

安装完成，点击“下一步”

![image20200224005411045.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522805312.png)

选择“桌面快捷”，点击“完成”

![image20200224005451664.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522822832.png)

## 五、Redis客户端应用

### 5.1、连接Redis服务端

打开客户端

![image20200225125542277.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522842260.png)

点击“Connect to Redis Server”,创建连接

![image20200225125723427.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522858849.png)

### 5.2、客户端操作

![image20200225130032651.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603522873998.png)