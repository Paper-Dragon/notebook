## 一、连接命令

**ping**

通常用于测试与服务器的连接是否仍然生效，或者用于测量延迟值。

如果连接正常就返回一个PONG ，否则返回一个连接错误。

```
127.0.0.1:6379> ping
PONG
```

**echo m**

打印一个特定的信息 m ，测试时使用。

```
127.0.0.1:6379> echo 'hello world'
"hello world"
```

**select i**

切换到指定的数据库，数据库索引号 i 用数字值指定，以 0 作为起始索引值。默认使用 0号数据库。

```
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]> 
```

**案例：**

在0号数据库中设置键a为‘hello world’，在1号数据库中调用

```
127.0.0.1:6379> set a 'hello world'
OK
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]> get a
(nil)
```

**auth pword**

开启了密码保护，在每次连接 Redis 服务器之后，就要使用auth命令解锁，解锁之后才能使用其他 Redis 命令。密码匹配时返回 `OK` ，否则返回一个错误。

设置密码

```
127.0.0.1:6379> config set requirepass redis123456
OK   #requirepass的值就是密码
127.0.0.1:6379> quit
```

在次登录

```
[root@localhost redis]# ./src/redis-cli
127.0.0.1:6379> ping
(error) NOAUTH Authentication required.
127.0.0.1:6379> auth redis123456
OK
127.0.0.1:6379> ping
PONG
```

清空密码

```
127.0.0.1:6379> config set requirepass “”
OK   #requirepass的值就是密码
127.0.0.1:6379> quit
```

**quit**

请求服务器关闭与当前客户端的连接。总是返回 `OK` (但是不会被打印显示，因为当时 Redis-cli 已经退出)。

```
127.0.0.1:6379[1]> quit
[root@localhost redis]# 
```

## 二、键命令

**set key value**

将字符串值 value关联到 key 。

```
127.0.0.1:6379> set key1 1  #传入的都是字符串
OK
```

**get key**

返回 key所关联的字符串值。如果 key 不存在那么返回特殊值 nil 。

```
127.0.0.1:6379> get key1
"1"
```

**del key1 [key2 … keyn]**

删除给定的一个或多个 key 。没有的key忽略，返回被删除 key 的数量。

```
127.0.0.1:6379> del key1
(integer) 1
```

**案例：**

声明key1,key2,key3，删除key1,key2,key4

```
127.0.0.1:6379> set key1 1
OK
127.0.0.1:6379> set key2 1
OK
127.0.0.1:6379> set key3 1
OK
127.0.0.1:6379> del key1 key2 key4
(integer) 2
```

**exists key**

检查给定 key 是否存在。若 key 存在，返回 1 ，否则返回 0 。

```
127.0.0.1:6379> exists key3
(integer) 1
```

**type key**

返回 key 所储存的值的类型。none (key不存在)、string (字符串)、list (列表)、set (集合)、zset (有序集)、hash (哈希表)

```
127.0.0.1:6379> type key1
string
```

**expire key seconds**

为给定 key 设置生存时间，以秒为单位，当 key 过期时(生存时间为 0 )，它会被自动删除。设置成功返回 1 。其他为0。

```
127.0.0.1:6379> expire key3 30
(integer) 1
127.0.0.1:6379> ttl key3  #查看有效时间
(integer) 24
127.0.0.1:6379> exists key3 #验证是否存在
(integer) 0
```

**pexpire key mseconds**

这个命令和 EXPIRE 命令的作用类似，但是它以毫秒为单位设置 key 的生存时间，而不像 EXPIRE 命令那样，以秒为单位。设置成功，返回 1。key不存在或设置失败，返回0

```
127.0.0.1:6379> set key1 abc
OK
127.0.0.1:6379> pexpire key1 10000
(integer) 1
127.0.0.1:6379> ttl key1
(integer) 5
127.0.0.1:6379> pttl key1
(integer) 746
```

**persist key**

移除给定 key 的生存时间，将这个 key 从易失的转换成持久的。当生存时间移除成功时，返回 1 .如果 key 不存在或 key 没有设置生存时间，返回 0 。

```
127.0.0.1:6379> set zhangwu 1
OK
127.0.0.1:6379> persist zhangwu
(integer) 0
127.0.0.1:6379> expire zhangwu 30
(integer) 1
127.0.0.1:6379> persist zhangwu
(integer) 1
127.0.0.1:6379> ttl zhangwu
(integer) -1
```

**ttl key**

以秒为单位，返回给定 key 的剩余生存时间(TTL, time to live)。当 key 不存在时，返回 -2 。当 key 存在但没有设置剩余生存时间时，返回 -1 。

```
127.0.0.1:6379> set key1 helloworld
OK
127.0.0.1:6379> ttl key1
(integer) -1
127.0.0.1:6379> expire key1 50
(integer) 1
127.0.0.1:6379> ttl key1
(integer) 44
127.0.0.1:6379> ttl key1
(integer) -2
```

**pttl key**

这个命令类似于 TTL 命令，但它以毫秒为单位返回 key 的剩余生存时间，而不是像 TTL 命令那样，以秒为单位。当 key 不存在时，返回 -2 。当 key 存在但没有设置剩余生存时间时，返回 -1 。

```
127.0.0.1:6379> pttl key1
(integer) -2
127.0.0.1:6379> set key1 abc
OK
127.0.0.1:6379> pexpire key1 30000
(integer) 1
127.0.0.1:6379> pttl key1
(integer) 27345
```

**keys pattern**

查找所有符合给定模式 pattern 的 key 。符合给定模式的 key 列表。

**通配符**

```
* 表示多个字符
? 表示一个字符
[] 表示只能是[]里面的字符
\ 表示指定特殊字符
127.0.0.1:6379> mset zhangsan 1 zhangsi 2 zhangwu 3
OK
127.0.0.1:6379> keys *
1) "zhangwu"
2) "zhangsan"
3) "zhangsi"
127.0.0.1:6379> keys ng*
(empty list or set)
127.0.0.1:6379> keys *ng*
1) "zhangwu"
2) "zhangsan"
3) "zhangsi"
127.0.0.1:6379> keys zhang??
1) "zhangwu"
2) "zhangsi"
127.0.0.1:6379> keys zha[ng]si
(empty list or set)
127.0.0.1:6379> keys zhan[ng]si
1) "zhangsi"
```

**move key db**

将当前数据库的 key 移动到给定的数据库 db 当中。移动成功返回 1 ，失败则返回 0 。

```
127.0.0.1:6379> keys *
1) "zhangwu"
2) "zhangsan"
3) "zhangsi"
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]> keys *
(empty list or set)
127.0.0.1:6379[1]> select 0
OK
127.0.0.1:6379> move zhangsan 1
(integer) 1
127.0.0.1:6379> select 1
OK
127.0.0.1:6379[1]> keys *
1) "zhangsan"
127.0.0.1:6379[1]> select 0
OK
127.0.0.1:6379> keys *
1) "zhangwu"
2) "zhangsi"
```

**注意：**

key不存在时，移动失败

key移动到1库时，1库中出现同名的key，移动失败

**random key**

从当前数据库中随机返回(不删除)一个 key 。当数据库不为空时，返回一个 key 。当数据库为空时，返回 nil 。

```
127.0.0.1:6379> randomkey
"zhangwu"
127.0.0.1:6379> randomkey
"key"
127.0.0.1:6379> randomkey
"key"
127.0.0.1:6379> randomkey
"zhangwu"
```

**rename key newkey**

将 key 改名为 newkey 。改名成功时提示 OK ，失败时候返回一个错误。

```
127.0.0.1:6379> rename key key1
OK
127.0.0.1:6379> keys *
1) "key1"
2) "zhangwu"
3) "zhangsi"
```

**注意：**

当 key 和 newkey 相同，或者 key 不存在时，返回一个错误。

当 newkey 已经存在时， RENAME 命令将覆盖旧值。

**renamenx key newkey**

当且仅当 newkey 不存在时，将 key 改名为 newkey 。修改成功时，返回 1 。如果 newkey 已经存在，返回 0 。

```
127.0.0.1:6379> renamenx zhangsi zhangwu
(integer) 0
127.0.0.1:6379> renamenx zhangsi zhangsan
(integer) 1
127.0.0.1:6379> keys *
1) "zhangsan"
2) "key1"
3) "zhangwu"
```