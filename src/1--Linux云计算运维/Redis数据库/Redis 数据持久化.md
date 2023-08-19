Redis支持两种数据持久化方式：RDB方式和AOF方式。前者会根据配置的规则定时将内存中的数据持久化到硬盘上，后者则是在每次执行写命令之后将命令记录下来。两种持久化方式可以单独使用，但是通常会将两者结合使用。

## 一、持久化

### 1.1、什么是持久化

持久化功能有效地避免因进程退出造成的数据丢失问题，当下次重启时利用之前持久化的文件即可实现数据恢复。

### 1.2、持久化方式

Redis支持RDB和AOF两种持久化机制：

**RDB（快照方式）：** RDB方式是一种快照式的持久化方法，将某一时刻的数据持久化到磁盘中。这种方式就是将内存中数据以快照的方式写入到二进制文件中 ，默认的文件名为dump.rdb。

**AOF（日志追加）：** AOF方式是将执行过的写指令记录下来，在数据恢复时按照从前到后的顺序再将指令执行一遍。这种方式 redis 会将每一个收到的写命令都通过 write 函数追加到文件中(默认appendonly.aof)。

### 1.3、RDB优缺点

**优点：**

RDB是一个紧凑的单一文件,方便传送，适用于灾难恢复。

与AOF相比,在恢复大的数据集的时候，RDB方式会更快一些。

**缺点：**

Redis意外宕机,可能会丢失几分钟的数据（取决于配置的save时间点）。RDB方式需要保存珍整个数据集，是一个比较繁重的工作，通常需要设置5分钟或者更久做一次完整的保存。

针对RDB不适合实时持久化的问题，Redis提供了AOF持久化方式来解决。

### 1.4、AOF优缺点

**优点：**

AOF只是追加日志文件，因此对服务器性能影响较小，速度比RDB要快，消耗的内存较少。

**缺点：**

AOF方式生成的日志文件太大，即使通过AOF重写，文件体积仍然很大。

恢复数据的速度比RDB慢。

## 二、RDB持久化触发机制

触发RDB持久化过程分为手动触发和自动触发

### 2.1、手动触发

手动触发持久化的操作有二个：save和bgsave。它们主要区别体现在：是否阻塞 Redis 主线程的执行。

**save命令**

在客户端中执行 save 命令，就会触发 Redis 的持久化，但同时也是使 Redis 处于阻塞状态，直到 RDB 持久化完成，才会响应其他客户端发来的命令，所以在生产环境一定要慎用。

![image20200229001933749.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603523916780.png)

执行过程：

查看/usr/local/redis/dump.rdb文件保存时间

```
[root@zutuanxue redis]# ls dump.rdb -l
-rw-r--r--. 1 root root 92 2月  28 03:37 dump.rdb
[root@zutuanxue redis]# ./src/redis-cli 
127.0.0.1:6379> save
OK
127.0.0.1:6379> exit
[root@zutuanxue redis]# ls dump.rdb -l
-rw-r--r--. 1 root root 92 2月  28 11:08 dump.rdb
```

当执行完 save 命令之后，持久化文件 dump.rdb 的修改时间就变了，这就表示 save 成功的触发了 RDB 持久化。

**bgsave命令**

bgsave（background save）既后台保存的意思， 它和 save 命令最大的区别就是 bgsave 会 fork() 一个子进程来执行持久化，整个过程中只有在 fork() 子进程时有短暂的阻塞，当子进程被创建之后，Redis 的主进程就可以响应其他客户端的请求了，相对于整个流程都阻塞的 save 命令来说，显然 bgsave 命令更适合我们使用。

![image20200229003129948.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603523960708.png)

执行过程

```
127.0.0.1:6379> bgsave
Background saving started
127.0.0.1:6379> exit
[root@zutuanxue redis]# ls dump.rdb -l
-rw-r--r--. 1 root root 92 2月  28 11:29 dump.rdb
```

### 2.2、自动触发

自动触发持久化，本质是 Redis 通过判断，如果满足设置的触发条件，自动执行一次 bgsave 命令。

RDB 自动持久化主要来源于以下几种情况:

**save m n**

表示的是在 m 秒内，如果有 n 个键发生改变，则自动触发持久化。

如：

配置文件（/usr/local/redis/redis.conf）中的默认配置

![image20200229011458921.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603523982153.png)

当 900s 内如果有 1次 Redis 键值发生改变，就会触发持久化；

当 300s 内如果有 10次 Redis 键值发生改变，就会触发持久化；

当 60s 内如果有 10000次 Redis 键值发生改变，就会触发持久化；

**注意：**

当设置多个 save m n 命令时，满足任意一个条件都会触发持久化。

**flushall**

清空 Redis 数据库，在生产环境下一定慎用，当 Redis 执行了 flushall 命令之后，则会触发自动持久化，把 RDB 文件清空。

```
127.0.0.1:6379> flushall
OK
```

## 三、RDB持久化配置

### 3.1、配置文件

vim /usr/local/redis/redis.conf

```
#RDB持久化自动触发条件
save 900 1
save 300 10
save 60 10000
#bgsave持久化失败，是否停止持久化数据到磁盘，yes 表示停止持久化，no 表示忽略错误继续写文件
stop-writes-on-bgsave-error yes
#rdb文件是否压缩
rdbcompression yes
#写入文件和读取文件时是否开启rdb文件检查，检查是否有无损坏，如果在启动是检查发现损坏，则停止启动。
rdbchecksum yes
#rdb持久化后存放的文件名
dbfilename dump.rdb
#rdb持久化后文件的存放路径
dir ./
```

**注意：**

文件压缩要是开启的话：Redis 会采用 LZF 算法进行压缩。如果不想消耗 CPU 性能来进行文件压缩的话，可以设置为关闭此功能，这样的缺点是需要更多的磁盘空间来保存文件。

### 3.2、配置查询/设置

**config get xxx**

```
127.0.0.1:6379> config get dir
1) "dir"
2) "/usr/local/redis"
127.0.0.1:6379> config get dbfilename
1) "dbfilename"
2) "dump.rdb"
127.0.0.1:6379> config get stop-writes-on-bgsave-error
1) "stop-writes-on-bgsave-error"
2) "yes"
```

**config set xxx**

```
[root@zutuanxue redis]# mkdir data
[root@zutuanxue redis]# ./src/redis-cli 
127.0.0.1:6379> config set dir "/usr/local/redis/data"
OK
127.0.0.1:6379> config get dir
1) "dir"
2) "/usr/local/redis/data"
```

**注意：**

使用命令修改的方式，马上生效，在 Redis 重启之后就会丢失。手动修改 Redis 配置文件，想要立即生效需要重启 Redis 服务器，会一直有效。

### 3.3、禁用持久化

```
127.0.0.1:6379> config set save ""
OK
```

### 3.4、RDB文件恢复

当 Redis 服务器启动时，Redis 就会自动加载 RDB 文件恢复持久化数据。

**验证加载**

启动redis时

![image20200229014938758.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524030551.png)

## 四、RDB持久化案例

### 4.1、手动持久化

```
127.0.0.1:6379> config set save ""
OK
127.0.0.1:6379> set s helloworld!
OK
127.0.0.1:6379> get s
"helloworld!"
127.0.0.1:6379> save
OK
127.0.0.1:6379> del s
(integer) 1
127.0.0.1:6379> get s
(nil)
127.0.0.1:6379> exit
[root@zutuanxue redis]# ./src/redis-cli shutdown
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
#Redis服务端启动成功提示信息
[root@zutuanxue redis]# ./src/redis-cli 
127.0.0.1:6379> get s
"helloworld!"
```

### 4.2、自动持久化案例

```
#新建log文件夹
[root@zutuanxue redis]# mkdir log
#配置日志文件
[root@zutuanxue redis]# vim redis.conf
#配置：logfile "/usr/local/redis/log/redis.log"
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
[root@zutuanxue redis]# ./src/redis-cli 
127.0.0.1:6379> config set save "10 1"
OK
127.0.0.1:6379> config get save
1) "save"
2) "10 1"
127.0.0.1:6379> set a 123
OK
127.0.0.1:6379> set b 456
OK
127.0.0.1:6379> set c 789
OK
127.0.0.1:6379> set d 8910
OK
127.0.0.1:6379> exit
[root@zutuanxue redis]# cd log
[root@zutuanxue log]# ls
redis.log
[root@zutuanxue log]# vim redis.log
```

![image20200229024640021.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524065211.png)

## 五、AOF持久化

AOF方式在使用Redis存储非临时数据时，一般都需要打开AOF持久化来降低进程终止导致的数据丢失，AOF可以将Redis执行的每一条写命令追加到硬盘文件中，这一过程显然会降低Redis的性能，但是大部分情况下这个影响是可以接受的，另外，使用较快的硬盘能提高AOF的性能。

### 5.1、AOF工作流

命令写入 （append）、文件同步（sync）、文件重写（rewrite）、重启加载 （load）

![image20200303224156711.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524103564.png)

### 5.2、AOF特点

默认文件名是 appendonly.aof。保存的位置由配置中 dir 来配置目录。

AOF 每次都会保存写命令，数据实时性更高。

AOF 需要使用“重写机制”来优化，每次记录写命令，文件会很大的问题。

AOF 根据不同的“缓冲区同步策略”将我们缓冲区中写入的命令，同步到磁盘。

**重写机制**

![image20200303233558568.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524125650.png)

**缓冲区同步策略**

设置appendfsync 控制，一共3种：

always：客户端的每一个写操作都保存到aof文件当，这种策略很安全，但是每个写都会有IO操作，所以也很慢。

everysec：每秒写入一次aof文件，因此，最多可能会丢失1s的数据。 推荐使用这种方式。

no: 交由操作系统来处理什么时候写入aof文件。更快，但也是最不安全的选择，不推荐使用。

### 5.3、持久化恢复

在重启redis服务时，rdb与aof如何执行？

![image20200303235441014.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524148069.png)

## 六、开启AOF持久化

### 6.1、修改配置

修改配置文件/usr/local/redis/redis.conf

```
appendonly yes #表示开启AOF持久化，默认是no表示关闭
appendfilename "appendonly.aof" #AOF持久化文件名
appendfsync everysec #缓冲同步策略，默认值
no-appendfsync-on-rewrite no  #是否重写，默认不重写
```

### 6.2、测试aof

开启之后，Redis每执行一条写命令就会将该命令写入硬盘中的AOF文件。AOF文件保存路径和RDB文件路径是一致的，都是通过dir参数配置 ， 默 认文 件 名 是 ： appendonly.aof

```
[root@zutuanxue redis]# ./src/redis-server ./redis.conf
[root@zutuanxue redis]# ./src/redis-cli 
127.0.0.1:6379> set x 123
OK
127.0.0.1:6379> set y 345
OK
127.0.0.1:6379> exit
[root@zutuanxue redis]# cat appendonly.aof
*2 #表示有二个参数，注意命令本身也是参数的一部份
$6 #第一个参数，长度为6（字节数）
SELECT #第一个参数，总是命令本身
$1 #第二个参数，长度为1
0 #第二个参数
*3
$3
set
$1
x
$3
123
*3
$3
set
$1
y
$3
345
```

在次测试

```
[root@zutuanxue redis]# ./src/redis-cli
127.0.0.1:6379> set z 23
OK
127.0.0.1:6379> get z
"23"
127.0.0.1:6379> exit
[root@zutuanxue redis]# cat appendonly.aof 
/*前面有以前的写命令,aof文件只会存储写命令*/
*2
$6
SELECT
$1
0
*3
$3
set
$1
z
$2
23
```

## 七、AOF重写

### 7.1、为什么要重写

随着aof文件越来越大，需要定期对aof文件进行重写，达到压缩的目的。

### 7.2、重写aof改变

进程内已经超时的数据不再写入文件。

旧的aof有无效命令（如：set k1 hello ex 10000），新的aof文件只保留最终数据的写入命令。

多条写命令可以合并为一个（如：lpush list a、lpush list b、lpush list c可以转化为：lpush list a b c）。但也不能将整个lpush生成的元素全部写在一起，所以对于list、set、hash、zset等类型操作，以64个元素为界拆分为多条。来防止客户端缓冲区溢出。

AOF重写降低了文件占用空间，更小的aof 文件启动redis时，加载更快。

### 7.3、重写方式

AOF重写过程可以手动触发和自动触发：

**手动触发：**直接调用bgrewriteaof命令。

**自动触发：**根据auto-aof-rewrite-min-size和auto-aof-rewrite-percentage参数确定自动触发时机

![image20200303233558568.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524191402.png)

### 7.4、手动触发

```
127.0.0.1:6379> bgrewriteaof
Background append only file rewriting started
```

![image20200304005133531.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524208890.png)

```
[root@zutuanxue redis]# ./src/redis-cli
127.0.0.1:6379> keys *
1) "k2"
2) "ff"
3) "h"
4) "k3"
5) "k1"
6) "fds"
7) "hfds"
8) "z"
9) "k"
127.0.0.1:6379> set a 1231
OK
127.0.0.1:6379> set b 12321
OK
127.0.0.1:6379> exit
[root@zutuanxue redis]# cat appendonly.aof 
```

![image20200304012220240.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524240666.png)

### 7.5、自动触发

#### 7.5.1、配置文件

修改配置文件/usr/local/redis/redis.conf

```
auto-aof-rewrite-percentage 100 #AOF文件增长率(当前AOF文件大小超过上一次重写的AOF文件大小的百分之多少才会重写)
auto-aof-rewrite-min-size 64mb #表示运行AOF重写时文件最小体积，默认为64MB。
```

**注意：**

aof_current_size: aof当前尺寸（单位：字节）

aof_base_size: aof上次启动和重写的尺寸（单位：字节）

#### 7.5.2、自动触发时机

当前 AOF 文件大小超过最小重写尺寸

当前 AOF 文件大小超过上次重写完的 AOF 尺寸*的百分之多少（*auto-aof-rewrite-percentage）

**换算**

自动触发时机=aof_current_size>auto-aof-rewrite-min-size&&（aof_current_size-aof_base_size）/aof_base_size>=auto-aof-rewrite-percentage

**查看aof_current_size和aof_base_size的值**

```
127.0.0.1:6379> info persistence
# Persistence
loading:0
rdb_changes_since_last_save:1
rdb_bgsave_in_progress:0
rdb_last_save_time:1583254417
rdb_last_bgsave_status:ok
rdb_last_bgsave_time_sec:0
rdb_current_bgsave_time_sec:-1
rdb_last_cow_size:188416
aof_enabled:1
aof_rewrite_in_progress:0
aof_rewrite_scheduled:0
aof_last_rewrite_time_sec:0
aof_current_rewrite_time_sec:-1
aof_last_bgrewrite_status:ok
aof_last_write_status:ok
aof_last_cow_size:2330624
aof_current_size:295
aof_base_size:211
aof_pending_rewrite:0
aof_buffer_length:0
aof_rewrite_buffer_length:0
aof_pending_bio_fsync:0
aof_delayed_fsync:0
```

**295>64M &&(295-211)/211>=100**

只有当这二个条件同时成立，我们才会去触发我们的重写AOF

### 7.6、aof文件恢复

在写入aof日志文件时，如果Redis服务器宕机，则aof日志文件文件会出格式错误，在重启Redis服务器时，Redis服务器会拒绝载入这个aof文件，可以通过以下步骤修复aof并恢复数据。

备份现在aof文件，以防万一。

出现以下提示：

![image20200310153632470.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603524305793.png)

使用redis-check-aof命令修复aof文件，该命令格式如下：

```
# 修复aof日志文件
$ redis-check-aof -fix file.aof
```

重启Redis服务器，加载已经修复的aof文件，恢复数据。