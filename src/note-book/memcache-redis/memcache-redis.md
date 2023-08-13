# Memcache-Redis缓解数据库压力

# 前言

![image-20211117093651109](memcache-redis.assets\image-20211117093651109.png)

# 简介

## 缓存服务器作用

加快访问速度，缓解数据库压力

## NoSQL 

net only sql

![image-20211117094009409](memcache-redis.assets\image-20211117094009409.png)

## nosql产品

redis

memcached

mongodb

# memcached

## 特点

**内置内存存储方式** : 重启操作系统导致数据全部丢失

**key/value**  : 服务器不需要关心数据本身的意义和结构，只要是可序列化数据即可。存储由键、过期时间、可选标志及数据四个部分组成

**不互相通信的分布式** : 

![image-20211117100128558](memcache-redis.assets\image-20211117100128558.png)

## 支持的平台

多平台支持

## 服务框架

![image-20211117100243328](memcache-redis.assets\image-20211117100243328.png)

## 实施

### 安装

```bash
yum install memchched -y 
```

![image-20211117101044738](memcache-redis.assets\image-20211117101044738.png)

### 修改配置文件

```bash
PORT="11211"    # 监听端口，同台机器编译多实例
USER="memcached"
MAXCONN="1024"
CACHESIZE="1500" # MB
OPTIONS="" 	# 监听网络地址
```



### 启动

```bash
[root@localhost ~]# systemctl start memcached 
[root@localhost ~]# p

```



### 测试



```bash
yum install telnet

telnet 127.0.0.1 11211

# 设置名称为name的key
set name 0 900 5
xvlei
# 给name的值
get name # 获取值
```

![image-20211117101741080](memcache-redis.assets\image-20211117101741080.png)

### 生产环境

web+memcached

前端部署apache mysql php服务器  

需要安装memcache客户端 php-memcached

独立部署memcached服务器



# redis

## 简介

C语言写的

![image-20211117102324814](memcache-redis.assets\image-20211117102324814.png)

![image-20211117102405840](memcache-redis.assets\image-20211117102405840.png)

![image-20211117102501293](memcache-redis.assets\image-20211117102501293.png)









## 安装

```bash
[root@redis-master ~]# mkdir -p /data/application —创建工作目录
[root@redis-master ~]# wget http://download.redis.io/releases/redis-4.0.9.tar.gz —下载redis
[root@redis-master ~]# tar xzf redis-4.0.9.tar.gz -C /data/application/ —解压
[root@redis-master ~]# cd /data/application/
[root@redis-master application]# mv redis-4.0.9/ redis
[root@redis-master application]# cd redis/
[root@redis-master redis]# yum install -y gcc make #安装编译工具
[root@redis-master redis]# make
注：如果报错请将刚才解压的安装包删除掉，再次重新解压并进行make安装即可。
[root@redis-master redis]# cp redis.conf redis.conf.bak
[root@redis-master redis]# vim redis.conf —修改如下
bind 192.168.246.202　　#只监听内网IP
daemonize yes　　　　　#开启后台模式将on改为yes
port 6379 #端口号
dir /data/application/redis/data　　#本地数据库存放持久化数据的目录该目录-----需要存在
创建存放数据的目录
[root@redis-master redis]# mkdir /data/application/redis/data
配置redis为systemctl启动
[root@redis-master redis]# cd /lib/systemd/system
[root@redis-master system]# vim redis.service
[Unit]
Description=Redis
After=network.target

[Service]
ExecStart=/data/application/redis/src/redis-server /data/application/redis/redis.conf --daemonize no
ExecStop=/data/application/redis/src/redis-cli -h 127.0.0.1 -p 6379 shutdown
[Install]
WantedBy=multi-user.target

参数详解:
• [Unit] 表示这是基础信息
• Description 是描述
• After 是在那个服务后面启动，一般是网络服务启动后启动

• [Service] 表示这里是服务信息
• ExecStart 是启动服务的命令
• ExecStop 是停止服务的指令
• [Install] 表示这是是安装相关信息
• WantedBy 是以哪种方式启动：multi-user.target表明当系统以多用户方式（默认的运行级别）启动时，这个服务需要被自动运行。

8.启动服务:
[root@redis-master system]# systemctl daemon-reload #重新加载
[root@redis-master system]# systemctl start redis.service 
[root@redis-master system]# ss -lnta  #查看6379端口是否启动

登陆redis
[root@redis-master redis]# vim /etc/profile
PATH=$PATH:/data/application/redis/src/
[root@redis-master redis]# source /etc/profile

[root@redis-master redis]# redis-cli -h 192.168.94.134 -p 6379
192.168.94.134:6379> ping     ---测试redis是否可以用
PONG
192.168.94.134:6379> set name newrain    #设置key--name，并设置值
OK
192.168.94.134:6379> get name    #获取到key
"newrain"
192.168.94.134:6379>
单机版redis已经部署完成。将ip和端口发给开发就可以了。
```

**redis的相关工具**

```bash
redis-benchmark     #用于进行redis性能测试的工具
redis-check-dump    #用于修复出问题的dump.rdb文件
redis-cli           #redis的客户端
redis-server        #redis的服务端
redis-check-aof     #用于修复出问题的AOF文件
redis-sentinel      #用于集群管理
```



## 持久化

开启持久化功能后，重启redis，数据会自动通过持久化文件恢复！！

```bash
一、redis提供了两种持久化的方式，分别是RDB（Redis DataBase）和AOF（Append Only File）。
RDB（Redis DataBase）：是在不同的时间点，将redis存储的数据生成快照并存储到磁盘等介质上；
特点:
1.周期性
2.不影响数据写入  #RDB会启动子进程，备份所有数据。当前进程，继续提供数据的读写。当备份完成，才替换老的备份文件。(老版本不会)
3.高效     #一次性还原所有数据
4.完整性较差 #故障点到上一次备份，之间的数据无法恢复。
====================================================================================
AOF（Append Only File）则是换了一个角度来实现持久化，那就是将redis执行过的所有写指令记录下来，在下次redis重新启动时，只要把这
些写指令从前到后再重复执行一遍，就可以实现数据恢复了。
特点:
1.实时性
2.完整性较好
3.体积大  #记录数据的指令，删除数据的指令都会被记录下来。
====================================================================================
二、RDB和AOF两种方式也可以同时使用，在这种情况下，如果redis重启的话，则会优先采用AOF方式来进行数据恢复，这是因为AOF方式的数据恢
复完整度更高。
如果你没有数据持久化的需求，也完全可以关闭RDB和AOF方式，这样的话，redis将变成一个纯内存数据库，就像memcache一样。
三、如何选择方式？
缓存：不用开启任何持久方式
双开:因RDB数据不实时，但同时使用两者时服务器只会找AOF文件,所以RDB留作万一的手段。
redis持久化 – 如何选择RDB和AOF
对于我们应该选择RDB还是AOF，官方的建议是两个同时使用。这样可以提供更可靠的持久化方案。
写入速度快 ------------AOF
写入速度慢 ------------RDB

```



### 持久化配置（快照模式）

```bash
1、RDB默认开启：
[root@redis-master src]# cd ..
[root@redis-master redis]# vim redis.conf
#dbfilename：持久化数据存储在本地的文件
dbfilename dump.rdb
#dir：持久化数据存储在本地的路径
dir /data/application/redis/
##snapshot触发的时机，save <seconds> <changes>  
##如下为900秒后，至少有一个变更操作，才会snapshot  
##对于此值的设置，需要谨慎，评估系统的变更操作密集程度  
##可以通过“save “”来关闭snapshot功能  
#save时间，以下分别表示更改了1个key时间隔900s进行持久化存储；更改了10个key300s进行存储；更改10000个key60s进行存储。
save <seconds> <changes>
save 900 1
save 300 10
save 60 10000
##当snapshot时出现错误无法继续时，是否阻塞客户端“变更操作”，“错误”可能因为磁盘已满/磁盘故障/OS级别异常等  
stop-writes-on-bgsave-error yes  
##是否启用rdb文件压缩，默认为“yes”，压缩往往意味着“额外的cpu消耗”，同时也意味这较小的文件尺寸以及较短的网络传输时间  
rdbcompression yes 
2、客户端使用命令进行持久化save存储：
方式一
[root@redis-master src]# redis-cli -h 192.168.94.134 -p 6379 save   #前台进行存储  指的是当前终端的前后台
OK
方式二
redis-cli -h ip -p port bgsave  #后台进行存储
注意:每次快照持久化都是将内存数据完整写入到磁盘一次，并不是增量的只同步新数据。如果数据量大的话，而且写操作比较多，必然会引起大量
的磁盘io操作，可能会严重影响性能。
save方式：持久化前面的所有数据(rdb模式没开时，后续的数据不会进行备份)
3、AOF默认关闭--开启
[root@redis-master src]# cd ..
[root@redis-master redis]# vim redis.conf
修改如下:
appendonly yes
1、此选项为aof功能的开关，默认为“no”，可以通过“yes”来开启aof功能,只有在“yes”下，aof重写/文件同步等特性才会生效
2、指定aof文件名称
appendfilename appendonly.aof  
3、指定aof操作中文件同步策略，有三个合法值：always everysec no,默认为everysec
appendfsync everysec  
4、在aof-rewrite期间，appendfsync是否暂缓文件同步，"no"表示“不暂缓”，“yes”表示“暂缓”，默认为“no”
no-appendfsync-on-rewrite no  
5、触发aof rewrite的最小文件尺寸 
auto-aof-rewrite-min-size 64mb
6、当Aof log增长超过指定比例时，重写log file， 设置为0表示不自动重写Aof 日志，重写是为了使aof体积保持最小，而确保保存最完整的数据。
auto-aof-rewrite-percentage 100

修改完配置文件后重启生效

```



## 主从

**主从简介**

**1、主从 – 用法**

> 像MySQL一样，redis是支持主从同步的，而且也支持一主多从以及多级从结构。
> 主从结构，一是为了纯粹的冗余备份，二是为了提升读性能，比如很消耗性能的SORT就可以由从服务器来承担。
> redis的主从同步是异步进行的，这意味着主从同步不会影响主逻辑，也不会降低redis的处理性能。
> 主从架构中，可以考虑关闭主服务器的数据持久化功能，只让从服务器进行持久化，这样可以提高主服务器的处理性能。
> 在主从架构中，从服务器通常被设置为只读模式，这样可以避免从服务器的数据被误修改。但是从服务器仍然可以接受CONFIG等指令，所以还是不应该将从服务器直接暴露到不安全的网络环境中。

**2、主从同步原理**

> 主从 – 同步原理
>  从服务器会向主服务器发出SYNC指令，当主服务器接到此命令后，就会调用BGSAVE指令来创建一个子进程专门进行数据持久化工作，也就是将主服务器的数据写入RDB文件中。在数据持久化期间，主服务器将执行的写指令都缓存在内存中。
> 在BGSAVE指令执行完成后，主服务器会将持久化好的RDB文件发送给从服务器，从服务器接到此文件后会将其存储到磁盘上，然后再将其读取到内存中。这个动作完成后，主服务器会将这段时间缓存的写指令再以redis协议的格式发送给从服务器。
> 另外，要说的一点是，即使有多个从服务器同时发来SYNC指令，主服务器也只会执行一次BGSAVE，然后把持久化好的RDB文件发给多个下游。在redis2.8版本之前，如果从服务器与主服务器因某些原因断开连接的话，都会进行一次主从之间的全量的数据同步；而在2.8版本之后，redis支持了效率更高的增量同步策略，这大大降低了连接断开的恢复成本。
> 主服务器会在内存中维护一个缓冲区，缓冲区中存储着将要发给从服务器的内容。从服务器在与主服务器出现网络瞬断之后，从服务器会尝试再次与主服务器连接，一旦连接成功，从服务器就会把“希望同步的主服务器ID”和“希望请求的数据的偏移位置（replication offset）”发送出去。主服务器接收到这样的同步请求后，首先会验证主服务器ID是否和自己的ID匹配，其次会检查“请求的偏移位置”是否存在于自己的缓冲区中，如果两者都满足的话，主服务器就会向从服务器发送增量内容。
> 增量同步功能，需要服务器端支持全新的PSYNC指令。这个指令，只有在redis-2.8之后才具有。

**3、部署三台机器redis---主从同步**

```bash
redis-master----192.168.94.134
redis-slave-1-----192.168.94.133
redis-slave-2-----192.168.94.135
1.首先三台服务器将redis部署完成。
2.编辑master的redis配置文件:
[root@redis-master ~]# cd /data/application/redis/
[root@redis-master redis]# vim redis.conf
#bind 127.0.0.1
bind 0.0.0.0
protected-mode no

2.修改slave的配置文件(两台机器一样)：
[root@redis-slave-1 ~]# cd /data/application/redis/
[root@redis-slave-1 redis]# vim redis.conf      ---修改如下：
#bind 127.0.0.1
bind 0.0.0.0
protected-mode no
# slaveof <masterip> <masterprot>
slaveof 192.168.94.134 6379

3.重启三台redis
systemctl restart redis  #忘了看前面
systemctl stop firewalld && setenforce 0

```

**测试**

```bash
1.在master上面执行
[root@redis-master ~]# redis-cli
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> set name duan
OK
127.0.0.1:6379> get name
"duan"

2.分别在slave-1和slave-2上面执行:
[root@redis-slave-1]# ./redis-cli 
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> get name
"duan"
127.0.0.1:6379>
[root@redis-slave-2]# redis-cli 
127.0.0.1:6379> ping
PONG
127.0.0.1:6379> get name
"duan"

查看复制状态
master执行：
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.94.133,port=6379,state=online,offset=323490,lag=1
slave1:ip=192.168.94.135,port=6379,state=online,offset=323490,lag=1
---------------------------------------------
slave上面执行
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:192.168.94.134
master_port:6379
master_link_status:up
master_last_io_second

```



## redis-sentinel---哨兵模式

**1、哨兵简介:Redis Sentinel**

> Sentinel(哨兵)是用于监控redis集群中Master状态的工具，其已经被集成在redis2.4+的版本中是Redis官方推荐的高可用性(HA)解决方案。

**2、作用**

> 1)：Master状态检测
> 2)：如果Master异常，则会进行Master-Slave切换，将其中一个Slave作为Master，将之前的Master作为Slave
> 3)：Master-Slave切换后，master_redis.conf、slave_redis.conf和sentinel.conf的内容都会发生改变，即master_redis.conf中会多一行slaveof的配置，sentinel.conf的监控目标会随之调换

**3、工作模式**

> 1)：每个Sentinel以每秒钟一次的频率向它所知的Master，Slave以及其他 Sentinel 实例发送一个 PING 命令
> 2)：如果一个实例（instance）距离最后一次有效回复 PING 命令的时间超过 down-after-milliseconds 选项所指定的值， 则这个实例会被 Sentinel 标记为主观下线。
> 3)：如果一个Master被标记为主观下线，则正在监视这个Master的所有 Sentinel 要以每秒一次的频率确认Master的确进入了主观下线状态。
> 4)：当有足够数量的 Sentinel（大于等于配置文件指定的值）在指定的时间范围内确认Master的确进入了主观下线状态， 则Master会被标记为客观下线

**4、主观下线和客观下线**

> 主观下线：Subjectively Down，简称 SDOWN，指的是当前 Sentinel 实例对某个redis服务器做出的下线判断。
> 客观下线：Objectively Down， 简称 ODOWN，指的是多个 Sentinel 实例在对Master Server做出 SDOWN  判断，并且通过 SENTINEL is-master-down-by-addr 命令互相交流之后，得出的Master  Server下线判断，然后开启failover

**5、配置哨兵模式**

```bash
1.每台机器上修改redis主配置文件redis.conf文件设置：bind 0.0.0.0   ---已经操作
2.每台机器上修改sentinel.conf配置文件：修改如下配置
[root@redis-master src]# cd ..
[root@redis-master redis]# vim sentinel.conf
sentinel monitor mymaster 10.0.0.137 6379 2 #当集群中有2个sentinel认为master死了时，才能真正认为该master已经不可用了。
 (slave上面写的是master的ip，master写自己ip)
sentinel down-after-milliseconds mymaster 3000   #单位毫秒
sentinel failover-timeout mymaster 10000   #若sentinel在该配置值内未能完成failover(故障转移)操作（即故障时master/slave自动切换）
，则认为本次failover失败。
protected-mode no  #关闭加密模式--新添加到sentinel配置文件中

如果Redis加了密码，哨兵配置文件中也要指定
3.每台机器启动哨兵服务：
[root@redis-master redis]# redis-sentinel /data/application/redis/sentinel.conf
注意:在生产环境下将哨兵模式启动放到后台执行:     
redis-sentinel /data/application/redis/sentinel.conf &

```

![img](memcache-redis.assets\1200.png)

将master的哨兵模式退出，再将redis服务stop了，在两台slave上面查看其中一台是否切换为master:(没有优先级，为随机切换)

```bash
[root@redis-master ~]# systemctl stop redis

```

![img](memcache-redis.assets\1200-16371342662862.png)

**登陆slave服务器查看有没有切换**

```bash
[root@real_server1 ~]# redis-cli 
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:192.168.94.135
master_port:6379
master_link_status:up

```

登陆**当前**master机器查看:

```bash
[root@linux ~]# redis-cli 
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:1
slave0:ip=192.168.94.133,port=6379,state=online,offset=43552,lag=1

另外一台机器stop了，所以没有显示

```



### 五、Redis缓存测试（基于LAMP）

```bash
基于上面的Redis主从：
编辑Redis主：
[root@redis-master ~]# redis-cli 
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.94.133,port=6379,state=online,offset=5814,lag=0
slave1:ip=192.168.94.135,port=6379,state=online,offset=5814,lag=1

# 部署mariadb
[root@redis-master ~]# yum install -y mariadb mariadb-server mariadb-devel
[root@redis-master ~]# systemctl start mariadb
[root@redis-master ~]# mysqladmin -uroot password 123456
[root@redis-master ~]# mysql -uroot -p123456
mysql> create database test;
mysql> use test
mysql> create table t1(id int,name varchar(50));
mysql> insert into t1 values(1,"tom"),(2,"jack");
mysql> flush privileges;
# 部署apache
[root@redis-master ~]# yum install -y httpd
[root@redis-master ~]# vim /etc/httpd/conf/httpd.conf
DirectoryIndex index.html index.php
# 部署php
[root@redis-master ~]# rpm -Uvh https://mirror.webtatic.com/yum/el7/epel-release.rpm
[root@redis-master ~]# rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
[root@redis-master ~]# yum install php70w.x86_64 php70w-cli.x86_64 php70w-common.x86_64 php70w-gd.x86_64 php70w-ldap.x86_64 php70w-mbstring.x86_64 php70w-mcrypt.x86_64 php70w-mysql.x86_64 php70w-pdo.x86_64 php70w-devel zlib-devel php70w-fpm php70w-pecl-redis  -y
[root@redis-master ~]# vim /etc/php.ini
878 date.timezone =Asia/Shanghai
display_errors = Off，把Off修改为On
[root@redis-master ~]# systemctl start php-fpm httpd

[root@redis-master ~]# vim /var/www/html/index.php
<?php
$redishost = '127.0.0.1';
$redisport = 6379;
$redis = new Redis;
$redis->connect($redishost,$redisport) or die ("Could not connect");
#$query="select emp_no,salary from salaries where emp_no = 10001";
$query="select id,name from t1";
$key=md5($query);
if(!$redis->get($key))
{
                $conn=mysqli_connect("localhost","root","123456","test");
                $result=mysqli_query($conn,$query);
                while ($row=mysqli_fetch_assoc($result))
                {
                        $arr[]=$row;
                }
                $f = 'mysql';
                $redis->set($key,serialize($arr));
                $data = $arr ;
}
else{
        $f = 'redis';
        $data_mem=$redis->get($key);
        $data = unserialize($data_mem);
}
echo $f;
echo "<br>";
echo "$key";
echo "<br>";
//print_r($data);
foreach($data as $a)
{
                echo "key is  <b><font color=#FF0000>$a[id]</font></b>";
                echo "<br>";
                echo "value is <b><font color=#FF0000>$a[name]</font></b>";
                echo "<br>";
}
?>

```



**测试访问：**

> 第一次头部是mysql，之后刷新一直是Redis

![img](memcache-redis.assets\1200-16371365201854.png)



**redis--快照**

```bash
快照，主要涉及的是redis的RDB持久化相关的配置

用如下的指令来让数据保存到磁盘上，即控制RDB快照功能：

save <seconds> <changes>

举例
save 900 1 //表示每15分钟且至少有1个key改变，就触发一次持久化
save 300 10 //表示每5分钟且至少有10个key改变，就触发一次持久化
save 60 10000 //表示每60秒至少有10000个key改变，就触发一次持久化

如果想禁用RDB持久化的策略，只要不设置任何save指令就可以，或者给save传入一个空字符串参数也可以达到相同效果，就像这样：

save ""

如果用户开启了RDB快照功能，那么在redis持久化数据到磁盘时如果出现失败，默认情况下，redis会停止接受所有的写请求。这样做
的好处在于可以让用户很明确的知道内存中的数据和磁盘上的数据已经存在不一致了。如果redis不顾这种不一致，一意孤行的继续接
收写请求，就可能会引起一些灾难性的后果。
如果下一次RDB持久化成功，redis会自动恢复接受写请求。

当然，如果你不在乎这种数据不一致或者有其他的手段发现和控制这种不一致的话，你完全可以关闭这个功能，以便在快照写入失败时，
也能确保redis继续接受新的写请求。配置项如下：

stop-writes-on-bgsave-error yes

对于存储到磁盘中的快照，可以设置是否进行压缩存储。如果是的话，redis会采用LZF算法进行压缩。如果你不想消耗CPU来进行压缩的
话，可以设置为关闭此功能，但是存储在磁盘上的快照会比较大。

rdbcompression yes

在存储快照后，我们还可以让redis使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果你希望获取到最大的性
能提升，可以关闭此功能。

rdbchecksum yes

设置快照文件的名称，默认配置：

dbfilename dump.rdb

设置这个快照文件存放的路径。默认设置就是当前文件夹：

dir ./

```



**安全:为redis加密：**

```bash
可以要求redis客户端在向redis-server发送请求之前，先进行密码验证。当你的redis-server处于一个不太可信的网络环境中时，相信你会用上这个功能。由于redis性能非常高，所以每秒钟可以完成多达15万次的密码尝试，所以你最好设置一个足够复杂的密码，否则很容易被黑客破解。

requirepass 1122334

这里我们通过requirepass将密码设置成“1122334”。

```



## 课外资料

![image-20211117160047246](memcache-redis.assets\image-20211117160047246.png)



![image-20211117160104710](memcache-redis.assets\image-20211117160104710.png)

# 面试题

![image-20211117160310357](memcache-redis.assets\image-20211117160310357.png)

![image-20211117160340557](memcache-redis.assets\image-20211117160340557.png)



![image-20211117160428838](memcache-redis.assets\image-20211117160428838.png)



![image-20211117160445302](memcache-redis.assets\image-20211117160445302.png)



![image-20211117160708876](memcache-redis.assets\image-20211117160708876.png)









