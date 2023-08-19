哨兵是一个分布式系统，你可以在一个架构中运行多个哨兵进程，这些进程使用流言协议来接收关于Master主服务器是否下线的信息，并使用投票协议来决定是否执行自动故障迁移，以及选择哪个Slave作为新的Master。

## 一、哨兵模式概述

### 1.1、为什么要启动哨兵模式

当我们的主服务器宕机后，要手动的去切换主从模式，这样的人工干预，费事费力，还会造成一段时间我们的服务不能使用。所有我们要使用哨兵模式来解决这一问题。

### 1.2、什么是哨兵模式

哨兵是对Redis的系统的运行情况的监控，它是一个独立进程，功能有二个：

监控主机Redis和从机Redis是否运行正常；

主机Redis出现故障后自动将从机转化为主机；

### 1.3、哨兵工作原理

**单个哨兵的工作原理：**

![image20200308235519661.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524739859.png)

单个哨兵，只需要监控主Redis，就可能得到从Redis。

**多个哨兵的工作原理：**

![image20200309015254574.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524758323.png)

多个哨兵，不仅同时监控主从Redis，而且哨兵之间互为监控。

多个哨兵，防止哨兵单点故障。

### 1.4、哨兵功能

**集群监控**：负责监控主从集群中的Master和Slave进程是否正常工作。

**故障转移(failover)**：如果Master宕机，会自动从Slave中选举出新的Master，进行主从自动切换。

**配置中心**：如果发生了故障转移，Sentinel负责通知客户端新的Master的地址。

**消息通知**：如果某个redis节点有故障，那么Sentsinel会发送报警消息给系统管理员。

### 1.5、配置说明

```
protected-mode no 
#关闭保护模式，使外网能访问。
port 26379 
#修改端口。三份文件分别不同。
daemonize no 
#修改为后台运行。
pidfile /var/run/redis-sentinel.pid 
#指定不同pid文件，注意文件夹不存在自己要新建。
logfile ""
#配置哨兵日志文件。
dir "/tmp"
#配置哨兵工作路径。
sentinel monitor mymaster 192.167.1.123 6379 2
#配置哨兵需要监控的主节点ip和端口，2表示哨兵数（quorum）
sentinel auth-pass mymaster ibethfy
#配置哨兵连接主节点的认证密码。（主节点配置的requirepass）。
sentinel down-after-milliseconds mymaster 5000
#配置多少毫秒后没收到主节点的反馈，则主观认为主节点down了。
sentinel failover-timeout mymaster 30000
#表示如果30秒后,mysater仍没活过来，则启动failover，从剩下的slave中选一个升级为master
sentinel parallel-syncs mymaster 1
#parallel-syncs 指定了在执行故障转移时， 最多可以有多少个slave同时对新的master进行同步， 这个数字越小， 完成故障转移所需的时间就越长
```

**注意:**

majority表示大多数哨兵

quorum表示哨兵数

如果quorum < majority，比如5个哨兵，majority就是3，quorum设置为2，那么就3个哨兵授权就可以执行切换。

但是如果quorum >= majority，那么必须quorum数量的哨兵都授权，比如5个哨兵，quorum是5，那么必须5个哨兵都同意授权，才能执行切换。

## 二、单哨兵模式

在一主多从的环境中，125为主机，123、124为从机

哨兵主机121

### 2.1、设置哨兵

修改配置文件/usr/local/redis/sentinel.conf

```
[root@zutuanxue redis]# vim sentinel.conf

#修改配置
sentinel monitor mymaster 192.168.1.123 6379 1
```

**注意：**

mymaster：监控主数据的名称，命名时可以使用大小写字母和“.-_”符号

192.168.1.123 6379：主机的IP和端口号

### 2.2、启动哨兵

```
[root@zutuanxue redis]# ./src/redis-sentinel ./sentinel.conf
或
[root@zutuanxue redis]# ./src/redis-server ./sentinel.conf --sentinel
```

![image20200309004221200.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524787197.png)

看出：

125为主机，123、124为从机

### 2.3、从机宕机

杀死124从机进程，30秒后观察哨兵日志

```
[root@zutuanxue redis]# ps -ef|grep redis
root      18752  12399  0 06:35 pts/1    00:00:00 ./src/redis-cli
root      22163      1  0 12:18 ?        00:00:02 ./src/redis-server 0.0.0.0:6379
root      22392  22002  0 12:44 pts/2    00:00:00 grep --color=auto redis
[root@zutuanxue redis]# kill -s 9 22163
```

![image20200309004654315.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524805745.png)

启动124从机，观察哨兵日志

```
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
```

![image20200309004921484.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524827043.png)

### 2.4、主机宕机

杀死125主机进程，30秒后观察哨兵日志

```
[root@zutuanxue redis]# ps -ef|grep redis
root      14988      1  0 06:20 ?        00:01:15 ./src/redis-server 0.0.0.0:6379
root      15144   8874  0 06:35 pts/0    00:00:00 ./src/redis-cli
root      18527  18104  0 12:50 pts/1    00:00:00 grep --color=auto redis
[root@zutuanxue redis]# kill -s 9 14988
```

![image20200309005314573.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524845851.png)

日志状态说明：

```
+reset-master:
#主服务器已被重置。
+slave:
#一个新的从服务器已经被 Sentinel 识别并关联。
+failover-state-reconf-slaves: 
#故障转移状态切换到了 reconf-slaves 状态。
+failover-detected:
#另一个 Sentinel 开始了一次故障转移操作，或者一个从服务器转换成了主服务器。
+slave-reconf-sent:
#领头（leader）的 Sentinel 向实例发送了 [SLAVEOF](/commands/slaveof.html) 命令，为实例设置新的主服务器。
+slave-reconf-inprog:
#实例正在将自己设置为指定主服务器的从服务器，但相应的同步过程仍未完成。
+slave-reconf-done:
#从服务器已经成功完成对新主服务器的同步。
-dup-sentinel: 
#对给定主服务器进行监视的一个或多个 Sentinel 已经因为重复出现而被移除 —— 当 Sentinel 实例重启的时候，就会出现这种情况。
+sentinel:
#一个监视给定主服务器的新 Sentinel 已经被识别并添加。
+sdown:
#给定的实例现在处于主观下线状态。
-sdown:
#给定的实例已经不再处于主观下线状态。
+odown:
#给定的实例现在处于客观下线状态。
-odown:
#给定的实例已经不再处于客观下线状态。
+new-epoch:
#当前的纪元（epoch）已经被更新。
+try-failover:
#一个新的故障迁移操作正在执行中，等待被大多数 Sentinel 选中（waiting to be elected by the majority）。
+elected-leader:
#赢得指定纪元的选举，可以进行故障迁移操作了。
+failover-state-select-slave:
#故障转移操作现在处于 select-slave 状态 —— Sentinel 正在寻找可以升级为主服务器的从服务器。
no-good-slave:
#Sentinel 操作未能找到适合进行升级的从服务器。Sentinel 会在一段时间之后再次尝试寻找合适的从服务器来进行升级，又或者直接放弃执行故障转移操作。
selected-slave:
#Sentinel 顺利找到适合进行升级的从服务器。
failover-state-send-slaveof-noone:
#Sentinel 正在将指定的从服务器升级为主服务器，等待升级功能完成。
failover-end-for-timeout:
#故障转移因为超时而中止，不过最终所有从服务器都会开始复制新的主服务器（slaves will eventually be configured to replicate with the new master anyway）。
failover-end:
#故障转移操作顺利完成。所有从服务器都开始复制新的主服务器了。
+switch-master
#配置变更，主服务器的 IP 和地址已经改变。 这是绝大多数外部用户都关心的信息。
+tilt:
#进入 tilt 模式。
-tilt:
#退出 tilt 模式
```

启动125主机，观察哨兵日志

```
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
```

![image20200309005527164.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524868822.png)

## 三、多哨兵模式

在一主多从的环境中，123为主机，124、125为从机

121中设置三个哨兵sentinel-1.conf、sentinel-2.conf、sentinel-3.conf

### 3.1、设置哨兵

将哨兵文件sentinel.conf，复制三份sentinel-1.conf、sentinel-2.conf、sentinel-3.conf

```
[root@zutuanxue redis]# cp sentinel.conf sentinel-1.conf
[root@zutuanxue redis]# cp sentinel.conf sentinel-2.conf
[root@zutuanxue redis]# cp sentinel.conf sentinel-3.conf
```

修改配置文件/usr/local/redis/sentinel-1.conf

```
[root@zutuanxue redis]# vim sentine-l.conf

#修改配置
protected-mode no
port 27001
daemonize yes
pidfile "/var/run/redis-sentinel-27001.pid"
logfile "/usr/local/redis/log/27001.log"
sentinel monitor m1 192.168.1.123 6379 1
#sentinel myid c299ec06a9dde77dcbc086082e9d7e30a29615b7
```

修改配置文件/usr/local/redis/sentinel-2.conf

```
[root@zutuanxue redis]# vim sentine-2.conf

#修改配置
protected-mode no
port 27002
daemonize yes
pidfile "/var/run/redis-sentinel-27002.pid"
logfile "/usr/local/redis/log/27002.log"
sentinel monitor m2 192.168.1.123 6379 1
#sentinel myid c299ec06a9dde77dcbc086082e9d7e30a29615b7
```

修改配置文件/usr/local/redis/sentinel-3.conf

```
[root@zutuanxue redis]# vim sentine-3.conf

#修改配置
protected-mode no
port 27003
daemonize yes
pidfile "/var/run/redis-sentinel-27003.pid"
logfile "/usr/local/redis/log/27003.log"
sentinel monitor m3 192.168.1.123 6379 1
#sentinel myid c299ec06a9dde77dcbc086082e9d7e30a29615b7
```

### 3.2、启动哨兵

```
[root@zutuanxue redis]# ./src/redis-sentinel ./sentinel-1.conf
[root@zutuanxue redis]# ./src/redis-sentinel ./sentinel-2.conf
[root@zutuanxue redis]# ./src/redis-sentinel ./sentinel-3.conf
```

### 3.3、从机宕机

杀死125从机进程

```
[root@zutuanxue redis]# ps -ef|grep redis
root      20733      1  0 11:55 ?        00:00:00 ./src/redis-server 0.0.0.0:6379
root      20775  20646  0 11:59 pts/0    00:00:00 grep --color=auto redis
[root@zutuanxue redis]# kill -s 9 20733
```

启动125从机

```
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
```

### 3.4、主机宕机

杀死123主机进程，30秒后观察哨兵日志

```
[root@zutuanxue redis]# ps -ef|grep redis
root      27555      1  0 11:55 ?        00:00:01 ./src/redis-server 0.0.0.0:6379
root      27693  27393  0 12:08 pts/0    00:00:00 grep --color=auto redis
[root@zutuanxue redis]# kill -s 9 27555
```

启动123主机

```
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
```