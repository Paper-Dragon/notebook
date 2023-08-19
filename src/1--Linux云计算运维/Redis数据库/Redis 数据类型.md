Redis支持五种数据类型：String（字符串），Hash（哈希），List（列表），Set（集合）及Zset(sorted set：有序集合)。

## 一、字符串类型概述

### 1.1、数据类型

Redis支持五种数据类型：String（字符串），Hash（哈希），List（列表），Set（集合）及Zset(sorted set：有序集合)。

### 1.2、字符串简介

字符串类型是redis最基础的数据结构，首先键是字符串类型，而且其他几种结构都是在字符串类型基础上构建的，所以字符串类型为其他四种数据结构尊定了基础。

字符串类型实际上可以是简单的字符串、复杂的字符串（xml、json）、数字（整数、浮点数）、二进制（图片、音频、视频）。

### 1.3、字符串应用场景

**共享session：**

用户登录后，用户刷新一次可能会重复登录，这个时候我们就将用户session集中管理，在这种模式下每次获取和更新用户信息都可以从redis中获取。

**限速：**

当我们在登录时，用来限制为我手机接到验证码的时间，防止我们的短信接口不被频繁访问，会限制用户每分钟获取验证码的频率。

## 二、字符串命令

**set key value [EX seconds] [PX milliseconds] [NX|XX]**

将字符串值 value 关联到 key

**注意：**

EX:设置键的过期时间为 second 秒

PX:设置键的过期时间为 millisecond 毫秒

NX:只在键不存在时，才对键进行设置操作。

XX:只在键已经存在时，才对键进行设置操作。

```
# EX 秒
127.0.0.1:6379> set key1 hello EX 1000
OK
127.0.0.1:6379> get key1
"hello"
127.0.0.1:6379> ttl key1
(integer) 992

# PX 毫秒
127.0.0.1:6379> set key2 hello PX 100000
OK
127.0.0.1:6379> get key2
"hello"
127.0.0.1:6379> pttl key2
(integer) 89973

#NX 键不存在设置成功
127.0.0.1:6379> set key3 hello NX
OK
127.0.0.1:6379> get key3
"hello"
127.0.0.1:6379> set key3 helloworld NX
(nil)
127.0.0.1:6379> get key3
"hello"

#XX 键存在设置成功
127.0.0.1:6379> set key4 helloworld XX
(nil)
127.0.0.1:6379> set key3 helloworld XX
OK
127.0.0.1:6379> get key3
"helloworld"
127.0.0.1:6379> get key4
(nil)
```

**注意：**

因为 SET 命令可以通过参数来实现和 SETNX 、 SETEX 和 PSETEX 三个命令的效果:

SETNX:若给定的 key 已经存在，则 SETNX 不做任何动作

SETEX:如果 key 已经存在， SETEX 命令将覆写旧值。

PSETEX:这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，而不是像 SETEX 命令那样，以秒为单位。

**get key**

返回 key 所关联的字符串值。

当 key 不存在时，返回 nil ，否则，返回 key 的值。如果 key 不是字符串类型，那么返回一个错误。

```
127.0.0.1:6379> set key1 hello
OK
127.0.0.1:6379> get key1
"hello"
127.0.0.1:6379> get key2
(nil)
```

**mset key value [key value …]**

同时设置一个或多个 key-value 对。

```
127.0.0.1:6379> mset k1 zhangsan k2 lisi k3 wangwu
OK
127.0.0.1:6379> get k1
"zhangsan"
127.0.0.1:6379> mget k1 k2 k3
1) "zhangsan"
2) "lisi"
3) "wangwu"
```

**mget key [key …]**

返回所有(一个或多个)给定 key 的值。

如果给定的 key 里面，有某个 key 不存在，那么这个 key 返回特殊值 nil 。因此，该命令永不失败。

```
127.0.0.1:6379> del k1 k2 k3
(integer) 3
127.0.0.1:6379> keys *
1) "key1"
2) "key3"
127.0.0.1:6379> set k1 zhangsan
OK
127.0.0.1:6379> set k2 lisi
OK
127.0.0.1:6379> mget k1 k2 k3
1) "zhangsan"
2) "lisi"
3) (nil)
```

**append key value**

如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。

如果 key 不存在， APPEND 就简单地将给定 key 设为 value ，就像执行 SET key value 一样。

```
127.0.0.1:6379> append k1 zhang
(integer) 5
127.0.0.1:6379> get k1
"zhang"
127.0.0.1:6379> append k1 san
(integer) 8
127.0.0.1:6379> get k1
"zhangsan"
```

**decr key**

将 key 中储存的数字值减一。

如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 DECR 操作。

如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。

```
127.0.0.1:6379> set k2 10
OK
127.0.0.1:6379> decr k2
(integer) 9
127.0.0.1:6379> get k2
"9"
127.0.0.1:6379> set k3 zhangsan
OK
127.0.0.1:6379> decr k3
(error) ERR value is not an integer or out of range
127.0.0.1:6379> decr k4
(integer) -1
127.0.0.1:6379> get k4
"-1"
127.0.0.1:6379> keys *
1) "k4"
2) "k2"
3) "k1"
4) "k3"
```

**decrby key decrement**

将 key 所储存的值减去减量 decrement 。

如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 DECRBY 操作。

如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。

```
127.0.0.1:6379> set k1 100
OK
127.0.0.1:6379> decrby k1 20
(integer) 80
127.0.0.1:6379> get k1
"80"
127.0.0.1:6379> decrby k2 20
(integer) -20
127.0.0.1:6379> get k2
"-20"
127.0.0.1:6379> set k3 zhangsan
OK
127.0.0.1:6379> decrby k3 10
(error) ERR value is not an integer or out of range
```

**incr key**

将 key 中储存的数字值增一。

如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作。

如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。

```
127.0.0.1:6379> set n 10
OK
127.0.0.1:6379> incr n
(integer) 11
127.0.0.1:6379> get n
"11"
127.0.0.1:6379> incr m
(integer) 1
127.0.0.1:6379> get m
"1"
127.0.0.1:6379> set s 'zhangsan'
OK
127.0.0.1:6379> incr s
(error) ERR value is not an integer or out of range
```

**incrby key increment**

将 key 所储存的值加上增量 increment 。

如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCRBY 命令。

如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。

```
127.0.0.1:6379> set n 10
OK
127.0.0.1:6379> incrby n 10
(integer) 20
127.0.0.1:6379> get n
"20"
127.0.0.1:6379> incrby m -20
(integer) -20
127.0.0.1:6379> get m
"-20"
127.0.0.1:6379> set s abc
OK
127.0.0.1:6379> incrby s 10
(error) ERR value is not an integer or out of range
```

**incrbyfloat key increment**

为 key 中所储存的值加上浮点数增量 increment 。

如果 key 不存在，那么 INCRBYFLOAT 会先将 key 的值设为 0 ，再执行加法操作。

```
127.0.0.1:6379> set m 10.05
OK
127.0.0.1:6379> incrbyfloat m 0.1
"10.15"
```

**getrange key start end**

返回 key 中字符串值的子字符串，字符串的截取范围由 start 和 end 两个偏移量决定(包括 start 和 end 在内)。

负数偏移量表示从字符串最后开始计数， -1 表示最后一个字符， -2 表示倒数第二个，以此类推。

```
127.0.0.1:6379> set str 'hello world!'
OK
127.0.0.1:6379> getrange str 0 4
"hello"
127.0.0.1:6379> getrange str -4 -1
"rld!"
127.0.0.1:6379> getrange str -1 -5
""
127.0.0.1:6379> getrange str 0 -1
"hello world!"
127.0.0.1:6379> getrange str 0 20
"hello world!"
```

**注意：**

substr与getrange一样

**getset key value**

将给定 key 的值设为 value ，并返回 key 的旧值(old value)。

返回给定 key 的旧值。当 key 没有旧值时，也即是， key 不存在时，返回 nil 。

```
127.0.0.1:6379> getset db mysql
(nil)
127.0.0.1:6379> get db
"mysql"
127.0.0.1:6379> getset db oracle
"mysql"
127.0.0.1:6379> get db
"oracle"
```

**strlen key**

返回 key 所储存的字符串值的长度。

当 key 储存的不是字符串值时，返回一个错误。

```
127.0.0.1:6379> set s 'hello world!'
OK
127.0.0.1:6379> strlen s
(integer) 12
```

## 三、哈希类型概述

### 3.1、哈希介绍

在redis中哈希类型是指键本身又是一种键值对结构：

value格式：{{key1,value1},…{keyn,valuen}}

### 3.2、哈希类型应用场景

适合存储对象，并且可以像数据库中update一样，去修改其中的一个属性中的一个值。比如：用户（姓名、性别、年龄等），文章（标题、发布时间、作者、内容），那么我们就可以对用户里面的性别，年龄等属性做到一对一的修改、存储、读取。

### 3.3、哈希命令

**hset key field value**

将哈希表 key 中的域 field 的值设为 value 。

如果 key 不存在，一个新的哈希表被创建并进行 HSET 操作。

如果域 field 已经存在于哈希表中，旧值将被覆盖。

如果 field 是哈希表中的一个新建域，并且值设置成功，返回 1 。

如果哈希表中域 field 已经存在且旧值已被新值覆盖，返回 0 。

```
127.0.0.1:6379> hset k1 xm zhangsan xb '男'
(integer) 2
127.0.0.1:6379> hget k1 xb
"\xe7\x94\xb7"
127.0.0.1:6379> hget k1 xm
"zhangsan"
127.0.0.1:6379> hset k1 xb nan
(integer) 0
127.0.0.1:6379> hget k1 xb
"nan"
```

**hget key field**

返回哈希表 key 中给定域 field 的值。

给定域的值。

当给定域不存在或是给定 key 不存在时，返回 nil 。

```
127.0.0.1:6379> hset k2 xm lisi
(integer) 1
127.0.0.1:6379> hget k2 xm
"lisi"
127.0.0.1:6379> hget k2
(error) ERR wrong number of arguments for 'hget' command
```

**hdel key field [field …]**

删除哈希表 key 中的一个或多个指定域，不存在的域将被忽略。

```
127.0.0.1:6379> del k1
(integer) 1
127.0.0.1:6379> keys *
1) "s"
2) "k2"
3) "m"
127.0.0.1:6379> hdel k2
(error) ERR wrong number of arguments for 'hdel' command
127.0.0.1:6379> hdel k2 xm
(integer) 1
127.0.0.1:6379> keys *
1) "s"
2) "m"
```

**注意：**

HDEL 每次只能删除单个域，如果你需要在一个原子时间内删除多个域，请将命令包含在 MULTI / EXEC 块内（事务）。

**hexists key field**

查看哈希表 key 中，给定域 field 是否存在。

如果哈希表含有给定域，返回 1 。

如果哈希表不含有给定域，或 key 不存在，返回 0 。

```
127.0.0.1:6379> hset k1 xm zhangsan xb nan
(integer) 2
127.0.0.1:6379> hexists k1 xm
(integer) 1
127.0.0.1:6379> hdel k1 xb
(integer) 1
127.0.0.1:6379> hexists k1 xb
(integer) 0
```

**hgetall key**

返回哈希表 key 中，所有的域和值。

以列表形式返回哈希表的域和域的值。

若 key不存在，返回空列表。

```
127.0.0.1:6379> hgetall k1
1) "xm"
2) "zhangsan"
127.0.0.1:6379> hset k1 xb nan
(integer) 1
127.0.0.1:6379> hgetall k1
1) "xm"
2) "zhangsan"
3) "xb"
4) "nan"
```

**hincrby key field increment**

为哈希表 key 中的域 field 的值加上增量 increment 。

增量也可以为负数，相当于对给定域进行减法操作。

```
127.0.0.1:6379> hset count h_i 100
(integer) 1
127.0.0.1:6379> hincrby count h_i 1
(integer) 101
127.0.0.1:6379> hincrby count h_i -10
(integer) 91
127.0.0.1:6379> hincrby count n_i -10
(integer) -10
127.0.0.1:6379> hgetall count
1) "h_i"
2) "91"
3) "n_i"
4) "-10"
```

**hincrbyfloat key field increment**

为哈希表 key 中的域 field 加上浮点数增量 increment 。

```
127.0.0.1:6379> hset count m_i 11.56
(integer) 1
127.0.0.1:6379> hincrbyfloat count m_i 11.2
"22.76"
```

**hkeys key**

返回哈希表 key 中的所有域。

一个包含哈希表中所有域的表。

当 key 不存在时，返回一个空表。

```
127.0.0.1:6379> hset stu xm zhangsan xb nan 
(integer) 0
127.0.0.1:6379> hkeys *
(empty list or set)
127.0.0.1:6379> hkeys stu
1) "xm"
2) "xb"
```

**hlen key**

返回哈希表 key 中域的数量。

当 key 不存在时，返回 0 。

```
127.0.0.1:6379> hlen stu
(integer) 2
```

**hmset key field value [field value …]**

同时将多个 field-value (域-值)对设置到哈希表 key 中。

此命令会覆盖哈希表中已存在的域。

```
127.0.0.1:6379> hmset www baidu www.baidu.com jd www.jd.com 
OK
127.0.0.1:6379> hget www baidu
"www.baidu.com"
127.0.0.1:6379> hget www jd
"www.jd.com"
```

**hmget key field [field …]**

返回哈希表 key 中，一个或多个给定域的值。

如果给定的域不存在于哈希表，那么返回一个 nil 值。

```
127.0.0.1:6379> hmget www baidu jd
1) "www.baidu.com"
2) "www.jd.com"
```

**hsetnx key field value**

将哈希表 key 中的域 field 的值设置为 value ，当且仅当域 field 不存在。

若域 field 已经存在，该操作无效。

```
127.0.0.1:6379> hsetnx ww taobao www.taobao.com
(integer) 1
127.0.0.1:6379> hsetnx ww taobao www.taobao.com
(integer) 0
```

**hvals key**

返回哈希表 key 中所有域的值。

```
127.0.0.1:6379> hvals www
1) "www.baidu.com"
2) "www.jd.com"
```

## 四、列表类型概述

### 4.1、列表简介

列表类型是用来储存多个有序的字符串，列表类型中字符串称之为元素，一个列表最多可以储存2的32次方-1个元素。我们可以对列表两端插入和弹出操作，还可以通过索引下标获取指定范围的元素列表、获取指定索引下标元素等。

优点：

列表类型中的元素可以重复。

列表类型中的元素是有序的。

列表类型中的元素可以通过索引下标获取某个或某个范围内的元素列表。

### 4.2、使用场景

栈：先进后出

队列：先进先出

消息队列： 主要表现在生产者与消费者之间。比如：小红希望小明多读书，常寻找好书给小明看，之前的方式是这样：小红问小明什么时候有空，把书给小明送去，并亲眼监督小明读完书才走。久而久之，两人都觉得麻烦。

后来的方式改成了：小红对小明说：“我放到书架上的书你都要看“，然后小红每次发现不错的书都放到书架上，小明则看到书架上有书就拿下来看。
书架就是一个消息队列，小红是生产者，小明是消费者。

最新列表：例如新闻列表页面最新的新闻列表，如果总数量很大的情况下，尽量不要使用select a from A limit 10这种low货，用 LPUSH命令构建List，一个个顺序都塞进去就可以啦。

我们可以通过列表操作来模拟以下情况：
lpush+lpop=Stack(栈)
lpush+rpop=Queue（队列）
lpush+ltrim=Capped Collection（有限集合）
lpush+brpop=Message Queue（消息队列）

### 4.3、列表命令

**lpush key value [value …]**

将一个或多个值 value 插入到列表 key 的表头

如果有多个 value 值，那么各个 value 值按从左到右的顺序依次插入到表头。

**如：**

```
lpush k a b c #他的值为:c  b  a 
#相当于
lpush k a
lpush k b
lpush k c
```

如果 key 不存在，一个空列表会被创建并执行 LPUSH 操作。

当 key 存在但不是列表类型时，返回一个错误。

```
127.0.0.1:6379> lpush k1 a b c
(integer) 3
127.0.0.1:6379> lpush k1 a
(integer) 4
127.0.0.1:6379> lrange k1 0 -1
1) "a"
2) "c"
3) "b"
4) "a"
```

**注意：**
lpush可以重复，写在前面的在底部，后进来的在前面

**rpush key value [value …]**

将一个或多个值 value 插入到列表 key 的表尾(最右边)。

如果有多个 value 值，那么各个 value 值按从左到右的顺序依次插入到表尾。

如：

```
rpush k a b c #他的值为:a  b  c 
#相当于
rpush k a
rpush k b
rpush k c
```

如果 key 不存在，一个空列表会被创建并执行 RPUSH 操作。

当 key 存在但不是列表类型时，返回一个错误。

```
127.0.0.1:6379> rpush k2 a b c 
(integer) 3
127.0.0.1:6379> rpush k2 a
(integer) 4
127.0.0.1:6379> lrange k2 0 -1
1) "a"
2) "b"
3) "c"
4) "a"
```

**llen key**

返回列表 key 的长度。

如果 key 不存在，则 key 被解释为一个空列表，返回 0 .

如果 key 不是列表类型，返回一个错误。

```
127.0.0.1:6379> llen k3
(integer) 0
127.0.0.1:6379> lpush k3 "hello world" "what you name"
(integer) 2
127.0.0.1:6379> llen k3
(integer) 2
```

**lrange key start stop**

返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定。

下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。

你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。

```
127.0.0.1:6379> lrange k3 1 2
1) "hello world"
127.0.0.1:6379> lrange k3 0 2
1) "what you name"
2) "hello world"
127.0.0.1:6379> lrange k2 0 2
1) "a"
2) "b"
3) "c"
127.0.0.1:6379> lrange k2 0 -1
1) "a"
2) "b"
3) "c"
4) "a"
```

**ltrim key start stop**

让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。

如：

```
ltrim k1 0 2 #表示只保留列表 list 的前三个元素，其余元素全部删除。
```

下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。

你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。

当 key 不是列表类型时，返回一个错误。

```
127.0.0.1:6379> lpush k4 a b c d e f g
(integer) 7
127.0.0.1:6379> lrange k4 0 -1
1) "g"
2) "f"
3) "e"
4) "d"
5) "c"
6) "b"
7) "a"
127.0.0.1:6379> ltrim k4 1 -1
OK
127.0.0.1:6379> lrange k4 0 -1
1) "f"
2) "e"
3) "d"
4) "c"
5) "b"
6) "a"
127.0.0.1:6379> ltrim k4 1000 2000
OK
127.0.0.1:6379> lrange k4 0 -1
(empty list or set)
127.0.0.1:6379> rpush k5 a b c d e f g
(integer) 7
127.0.0.1:6379> ltrim k5 1000 2000
OK
127.0.0.1:6379> lrange k5 0 -1
(empty list or set)
```

**lset key index value**

将列表 key 下标为 index 的元素的值设置为 value 。

当 index 参数超出范围，或对一个空列表( key 不存在)进行 LSET 时，返回一个错误。

```
127.0.0.1:6379> exists k1
(integer) 0
127.0.0.1:6379> lset k1 0 item1
(error) ERR no such key
127.0.0.1:6379> lpush k1 item1 item2
(integer) 2
127.0.0.1:6379> lset k1 0 item0
OK
127.0.0.1:6379> lrange k1 0 -1
1) "item0"
2) "item1"
127.0.0.1:6379> rpush k2 item1 item2 
(integer) 2
127.0.0.1:6379> lset k2 0 item0
OK
127.0.0.1:6379> lrange k2 0 -1
1) "item0"
2) "item2"
127.0.0.1:6379> lset k1 5 item5
(error) ERR index out of range
127.0.0.1:6379> lset k2 5 item5
(error) ERR index out of range
```

**lrem key count value**

根据参数 count 的值，移除列表中与参数 value 相等的元素。

count 的值可以是以下几种：

count > 0: 从表头开始向表尾搜索，移除与value相等的元素，数量为count 。

count < 0: 从表尾开始向表头搜索，移除与value相等的元素，数量为count的绝对值。

count = 0 : 移除表中所有与 value 相等的值。

```
127.0.0.1:6379> lpush k3 a b d f a d f b e c 
(integer) 10
127.0.0.1:6379> lrange k3 0 -1
 1) "c"
 2) "e"
 3) "b"
 4) "f"
 5) "d"
 6) "a"
 7) "f"
 8) "d"
 9) "b"
10) "a"
127.0.0.1:6379> lrem k3 1 a
(integer) 1
127.0.0.1:6379> lrange k3 0 -1
1) "c"
2) "e"
3) "b"
4) "f"
5) "d"
6) "f"
7) "d"
8) "b"
9) "a"
127.0.0.1:6379> lrem k3 1 f
(integer) 1
127.0.0.1:6379> lrange k3 0 -1
1) "c"
2) "e"
3) "b"
4) "d"
5) "f"
6) "d"
7) "b"
8) "a"
127.0.0.1:6379> lrem k3 2 d
(integer) 2
127.0.0.1:6379> lrange k3 0 -1
1) "c"
2) "e"
3) "b"
4) "f"
5) "b"
6) "a"
127.0.0.1:6379> lrem k3 -1 a
(integer) 1
127.0.0.1:6379> lrange k3 0 -1
1) "c"
2) "e"
3) "b"
4) "f"
5) "b"
127.0.0.1:6379> lrem k3 0 b
(integer) 2
127.0.0.1:6379> lrange k3 0 -1
1) "c"
2) "e"
3) "f"
```

**lpop key**

移除并返回列表 key 的头元素。

```
127.0.0.1:6379> lpush a 212 fdsf fds fd fsd fds 
(integer) 6
127.0.0.1:6379> lrange a 0 -1
1) "fds"
2) "fsd"
3) "fd"
4) "fds"
5) "fdsf"
6) "212"
127.0.0.1:6379> lpop a 
"fds"
127.0.0.1:6379> lrange a 0 -1
1) "fsd"
2) "fd"
3) "fds"
4) "fdsf"
5) "212"
127.0.0.1:6379> rpush b fdsf fds  fd s fd f d
(integer) 7
127.0.0.1:6379> lrange b 0 -1
1) "fdsf"
2) "fds"
3) "fd"
4) "s"
5) "fd"
6) "f"
7) "d"
127.0.0.1:6379> lpop b
"fdsf"
127.0.0.1:6379> lrange b 0 -1
1) "fds"
2) "fd"
3) "s"
4) "fd"
5) "f"
6) "d"
```

**rpop key**

移除并返回列表 key 的尾元素。

```
127.0.0.1:6379> lrange a 0 -1
1) "fsd"
2) "fd"
3) "fds"
4) "fdsf"
5) "212"
127.0.0.1:6379> rpop a
"212"
127.0.0.1:6379> lrange a 0 -1
1) "fsd"
2) "fd"
3) "fds"
4) "fdsf"
127.0.0.1:6379> lrange b 0 -1
1) "fds"
2) "fd"
3) "s"
4) "fd"
5) "f"
6) "d"
127.0.0.1:6379> rpop b
"d"
127.0.0.1:6379> lrange b 0 -1
1) "fds"
2) "fd"
3) "s"
4) "fd"
5) "f"
127.0.0.1:6379> 
```

**blpop key [key …] timeout**

当给定多个 key 参数时，按参数 key 的先后顺序依次检查各个列表，弹出第一个非空列表的头元素。

当key元素存在，非阻塞行为

```
127.0.0.1:6379> lpush a hello
(integer) 1
127.0.0.1:6379> lpush b world
(integer) 1
127.0.0.1:6379> blpop a b 0
1) "a"
2) "hello"
127.0.0.1:6379> blpop c a b 0
1) "b"
2) "world"
```

当key元素不存在，阻塞行为

```
127.0.0.1:6379> blpop a b c 0
```

**brpop key [key …] timeout**

当给定多个 key 参数时，按参数 key 的先后顺序依次检查各个列表，弹出第一个非空列表的尾部元素。

```
127.0.0.1:6379> llen a
(integer) 0
127.0.0.1:6379> rpush a java
(integer) 1
127.0.0.1:6379> rpush a python
(integer) 2
127.0.0.1:6379> brpop a 30
1) "a"
2) "python"
```

## 五、集合概述

### 5.1、集合简介

集合类型也是用来保存多个字符串的元素，集合类型中不允许有重复的元素，集合类型中元素是无序的，不能通过索引下标获取元素。在redis除了学习集合的增删改查，同时还可以对集合类型进行取交集、并集、差集。

### 5.2、使用场景

兴趣标签（tag）：兴趣标签可以用来标记一个用户对什么样的活动感兴趣，如：唱歌、跳舞、爬山等都是我们的兴趣标签。如果我们有很多用户都 有这些兴趣标签的话，有了这些数据就可以得到同一标签的人，以及用户的共同爱好的标签，这些数据对于用户体验以及曾强用户粘度比较重要。

我们可以通过集合操作来模拟以下情况：

sadd=tagging（标签）

spop/srandmember=random item（生成随机数，比如抽奖）

sadd+sinter=social Graph(社交需求)

### 5.3、集合命令

**sadd key member [member …]**

将一个或多个 member 元素加入到集合 key 当中，已经存在于集合的 member 元素将被忽略。

假如 key 不存在，则创建一个只包含 member 元素作成员的集合。

当 key 不是集合类型时，返回一个错误。

```
127.0.0.1:6379> sadd s_a 123 234 345
(integer) 3
127.0.0.1:6379> smembers s_a
1) "123"
2) "234"
3) "345"
127.0.0.1:6379> sadd s_a 123 987
(integer) 1
127.0.0.1:6379> smembers s_a
1) "123"
2) "234"
3) "345"
4) "987"
```

**smembers key**

返回集合 key 中的所有成员。

不存在的 key 被视为空集合。

```
127.0.0.1:6379> sadd s_d dfs fds fds
(integer) 2
127.0.0.1:6379> smembers s_d
1) "dfs"
2) "fds"
```

**srem key member [member …]**

移除集合 key 中的一个或多个 member 元素，不存在的 member 元素会被忽略。

当 key 不是集合类型，返回一个错误。

```
127.0.0.1:6379> smembers s_a
1) "123"
2) "234"
3) "345"
4) "987"
127.0.0.1:6379> srem s_a 234
(integer) 1
127.0.0.1:6379> smembers s_a
1) "123"
2) "345"
3) "987"
127.0.0.1:6379> srem s_a 134
(integer) 0
127.0.0.1:6379> srem s_a 123 987
(integer) 2
127.0.0.1:6379> smembers s_a
1) "345"
```

**spop key**

移除并返回集合中的一个随机元素。

```
127.0.0.1:6379> sadd s_b abc bcd fd sfds fdfd
(integer) 5
127.0.0.1:6379> smembers s_b
1) "sfds"
2) "bcd"
3) "abc"
4) "fd"
5) "fdfd"
127.0.0.1:6379> spop s_b
"fd"
127.0.0.1:6379> smembers s_b
1) "sfds"
2) "abc"
3) "bcd"
4) "fdfd"
127.0.0.1:6379> spop s_b
"sfds"
127.0.0.1:6379> smembers s_b
1) "abc"
2) "bcd"
3) "fdfd"
```

**srandmember key [count]**

如果命令执行时，只提供了 key 参数，那么返回集合中的一个随机元素，不删除。

如果 count 为正数，且小于集合基数，那么命令返回一个包含 count 个元素的数组，数组中的元素各不相同。如果 count 大于等于集合基数，那么返回整个集合。

如果 count 为负数，那么命令返回一个数组，数组中的元素可能会重复出现多次，而数组的长度为 count 的绝对值。

```
127.0.0.1:6379> sadd s_c afd fds fd s fds dfs dfs fd sfds
(integer) 6
127.0.0.1:6379> srandmember s_c
"s"
127.0.0.1:6379> srandmember s_c
"sfds"
127.0.0.1:6379> smembers s_c
1) "sfds"
2) "s"
3) "fd"
4) "dfs"
5) "afd"
6) "fds"
127.0.0.1:6379> srandmember s_c 3
1) "sfds"
2) "s"
3) "afd"
127.0.0.1:6379> srandmember s_c 3
1) "sfds"
2) "s"
3) "fd"
127.0.0.1:6379> srandmember s_c -3
1) "dfs"
2) "s"
3) "s"
127.0.0.1:6379> srandmember s_c -3
1) "fd"
2) "afd"
3) "s"
127.0.0.1:6379> srandmember s_c 10
1) "fd"
2) "sfds"
3) "s"
4) "dfs"
5) "afd"
6) "fds"
127.0.0.1:6379> srandmember s_c -10
 1) "fd"
 2) "dfs"
 3) "s"
 4) "s"
 5) "fds"
 6) "s"
 7) "fds"
 8) "sfds"
 9) "fds"
10) "fd"
127.0.0.1:6379> smembers s_c
1) "sfds"
2) "s"
3) "fd"
4) "dfs"
5) "afd"
6) "fds"
```

**smove source destination member**

将 member 元素从 source 集合移动到 destination 集合。

```
127.0.0.1:6379> smembers s_a
1) "345"
127.0.0.1:6379> smembers s_b
1) "abc"
2) "bcd"
3) "fdfd"
127.0.0.1:6379> smove s_b s_a abc
(integer) 1
127.0.0.1:6379> smembers s_a
1) "abc"
2) "345"
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
```

**scard key**

返回集合 key 的基数(集合中元素的数量)。

```
127.0.0.1:6379> smembers s_c
1) "sfds"
2) "s"
3) "fd"
4) "dfs"
5) "afd"
6) "fds"
127.0.0.1:6379> scard s_c
(integer) 6
127.0.0.1:6379> del s_c
(integer) 1
127.0.0.1:6379> scard s_c
(integer) 0
```

**sismember key member**

判断 member 元素是否集合 key 的成员。

```
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
127.0.0.1:6379> sismember s_b bcd
(integer) 1
127.0.0.1:6379> sismember s_b bcf
(integer) 0
```

**sinter key [key …]**

返回一个集合的全部成员，该集合是所有给定集合的交集。

不存在的 key 被视为空集。

当给定集合当中有一个空集时，结果也为空集(根据集合运算定律)。

```
127.0.0.1:6379> smembers s_a
1) "abc"
2) "345"
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
127.0.0.1:6379> sinter s_a s_b
(empty list or set)
127.0.0.1:6379> sadd s_a bcd
(integer) 1
127.0.0.1:6379> sinter s_a s_b
1) "bcd"
```

**sinterstore destination key [key …]**

这个命令类似于 [SINTER key key …] 命令，但它将结果保存到 destination 集合，而不是简单地返回结果集。

如果 destination 集合已经存在，则将其覆盖。

destination 可以是 key 本身。

```
127.0.0.1:6379> smembers s_a
1) "bcd"
2) "abc"
3) "345"
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
127.0.0.1:6379> sinterstore s_c s_a s_b
(integer) 1
127.0.0.1:6379> smembers s_c
1) "bcd"
127.0.0.1:6379> sinterstore s_a s_a s_b
(integer) 1
127.0.0.1:6379> smembers s_a
1) "bcd"
```

**sunion key [key …]**

返回一个集合的全部成员，该集合是所有给定集合的并集。

不存在的 key被视为空集。

```
127.0.0.1:6379> smembers s_a
1) "bcd"
2) "fd"
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
127.0.0.1:6379> sunion s_a s_b
1) "bcd"
2) "fdfd"
3) "fd"
```

**sunionstore destination key [key …]**

这个命令类似于 [SUNION key key …] 命令，但它将结果保存到 destination 集合，而不是简单地返回结果集。

如果 destination 已经存在，则将其覆盖。

destination 可以是 key 本身。

```
127.0.0.1:6379> smembers s_a
1) "bcd"
2) "fd"
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
127.0.0.1:6379> sunionstore s_c s_a s_b
(integer) 3
127.0.0.1:6379> smembers s_c
1) "bcd"
2) "fdfd"
3) "fd"
127.0.0.1:6379> sunionstore s_a s_a s_b
(integer) 3
127.0.0.1:6379> smembers s_a
1) "bcd"
2) "fdfd"
3) "fd"
```

**sdiff key [key …]**

返回一个集合的全部成员，该集合是所有给定集合之间的差集。

不存在的 key 被视为空集。

```
127.0.0.1:6379> smembers s_a
1) "bcd"
2) "fdfd"
3) "fd"
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
127.0.0.1:6379> sdiff s_a s_b
1) "fd"
```

**sdiffstore destination key [key …]**

这个命令的作用和 [SDIFF key key …] 类似，但它将结果保存到 destination 集合，而不是简单地返回结果集。

如果 destination 集合已经存在，则将其覆盖。

destination 可以是 key 本身。

```
127.0.0.1:6379> smembers s_a
1) "bcd"
2) "fdfd"
3) "fd"
127.0.0.1:6379> smembers s_b
1) "bcd"
2) "fdfd"
127.0.0.1:6379> sdiffstore s_c s_a s_b
(integer) 1
127.0.0.1:6379> smembers s_c
1) "fd"
127.0.0.1:6379> sdiffstore s_a s_a s_b
(integer) 1
127.0.0.1:6379> smembers s_a
1) "fd"
```

## 六、有序集合概述

### 6.1、有序集合简介

有序集合保留了集合中不能有重复成员的特性，与集合不同的是有序集合中的元素是可以进行排序，他的排序方式是给每个元素设置一个分数，作为排序的依据。

有序集合中的元素不可以重复，但是score可以重复，就和一个人的身份证号不能重复一样，但姓名是可以重复的。

### 6.2、使用场景

排行榜：有序集合经典使用场景。比如说朋友圈集赞排行榜，我们以用户的点赞数作为score,在按照点赞数来进行排序，这样我们就可以按照点赞数获取排行榜了。

### 6.3、有序集合命令

**zadd key score member [[score member] …]**

将一个或多个 member 元素及其 score 值加入到有序集 key 当中。

如果某个 member 已经是有序集的成员，那么更新这个 member 的 score 值，并通过重新插入这个 member 元素，来保证该 member 在正确的位置上。

score 值可以是整数值或双精度浮点数。

如果 key 不存在，则创建一个空的有序集并执行 ZADD 操作。

当 key 存在但不是有序集类型时，返回一个错误。

```
127.0.0.1:6379> zadd z_a 9 abc 10 def
(integer) 2
127.0.0.1:6379> zadd z_a 8 fdfd
(integer) 1
127.0.0.1:6379> zrange z_a 0 -1
1) "fdfd"
2) "abc"
3) "def"
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "fdfd"
2) "8"
3) "abc"
4) "9"
5) "def"
6) "10"
127.0.0.1:6379> zadd z_a 7 abc
(integer) 0
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "abc"
2) "7"
3) "fdfd"
4) "8"
5) "def"
6) "10"
127.0.0.1:6379> zadd z_a 4 afdsc
(integer) 1
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "abc"
4) "7"
5) "fdfd"
6) "8"
7) "def"
8) "10"
127.0.0.1:6379> zadd z_a 9 afddsc
(integer) 1
127.0.0.1:6379> zrange z_a 0 -1 withscores
 1) "afdsc"
 2) "4"
 3) "abc"
 4) "7"
 5) "fdfd"
 6) "8"
 7) "afddsc"
 8) "9"
 9) "def"
10) "10"
```

**zrange key start stop [withscores]**

返回有序集 key 中，指定区间内的成员。

其中成员的位置按 score 值递增(从小到大)来排序。

具有相同 score 值的成员按字典序(lexicographical order )来排列。

如果你需要成员按 score 值递减(从大到小)来排列，请使用 [ZREVRANGE key start stop WITHSCORES] 命令。

下标参数 start 和 stop 都以 0 为底，也就是说，以 0 表示有序集第一个成员，以 1 表示有序集第二个成员，以此类推。 你也可以使用负数下标，以 -1 表示最后一个成员， -2 表示倒数第二个成员，以此类推。

超出范围的下标并不会引起错误。 比如说，当 start 的值比有序集的最大下标还要大，或是 start > stop 时， ZRANGE 命令只是简单地返回一个空列表。 另一方面，假如 stop 参数的值比有序集的最大下标还要大，那么 Redis 将 stop 当作最大下标来处理。

可以通过使用 WITHSCORES 选项，来让成员和它的 score 值一并返回，返回列表以 value1,score1, …, valueN,scoreN 的格式表示。 客户端库可能会返回一些更复杂的数据类型，比如数组、元组等。

```
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "fdfd"
4) "8"
5) "afddsc"
6) "9"
127.0.0.1:6379> zrange z_a 1 2 withscores
1) "fdfd"
2) "8"
3) "afddsc"
4) "9"
127.0.0.1:6379> zrange z_a 0 200 withscores
1) "afdsc"
2) "4"
3) "fdfd"
4) "8"
5) "afddsc"
6) "9"
127.0.0.1:6379> zrange z_a 200 300 withscores
(empty list or set)
```

**zrevrange key start stop [withscores]**

返回有序集 key 中，指定区间内的成员。

其中成员的位置按 score 值递减(从大到小)来排列。 具有相同 score 值的成员按字典序的逆序(reverse lexicographical order)排列。

```
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "aaa"
2) "2"
3) "afdsc"
4) "4"
5) "fdfd"
6) "4"
7) "afddsc"
8) "9"
127.0.0.1:6379> zrevrange z_a 0 -1 withscores
1) "afddsc"
2) "9"
3) "fdfd"
4) "4"
5) "afdsc"
6) "4"
7) "aaa"
8) "2"
```

**zscore key member**

返回有序集 key 中，成员 member 的 score 值。

如果 member 元素不是有序集 key 的成员，或 key 不存在，返回 nil 。

```
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "fdfd"
4) "8"
5) "afddsc"
6) "9"
127.0.0.1:6379> zscore z_a fdfd
"8"
```

**zrem key member [member …]**

移除有序集 key 中的一个或多个成员，不存在的成员将被忽略。

当 key 存在但不是有序集类型时，返回一个错误。

```
127.0.0.1:6379> zrange z_a 0 -1 withscores
 1) "afdsc"
 2) "4"
 3) "abc"
 4) "7"
 5) "fdfd"
 6) "8"
 7) "afddsc"
 8) "9"
 9) "def"
10) "10"
127.0.0.1:6379> zrem z_a 4
(integer) 0
127.0.0.1:6379> zrem z_a abc def
(integer) 2
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "fdfd"
4) "8"
5) "afddsc"
6) "9"
```

**zincrby key increment member**

为有序集 key 的成员 member 的 score 值加上增量 increment 。

可以通过传递一个负数值 increment ，让 score 减去相应的值，比如 ZINCRBY key -5 member ，就是让 member 的 score 值减去 5 。

当 key 不存在，或 member 不是 key 的成员时， ZINCRBY key increment member 等同于 ZADD key increment member 。

当 key 不是有序集类型时，返回一个错误。

score 值可以是整数值或双精度浮点数。

```
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "fdfd"
4) "8"
5) "afddsc"
6) "9"
127.0.0.1:6379> zscore afdsc
(error) ERR wrong number of arguments for 'zscore' command
127.0.0.1:6379> zscore z_a fdfd
"8"
127.0.0.1:6379> zincrby z_a 2 fdfd
"10"
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "afddsc"
4) "9"
5) "fdfd"
6) "10"
127.0.0.1:6379> zincrby z_a -6 fdfd
"4"
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "fdfd"
4) "4"
5) "afddsc"
6) "9"
```

**zrank key member**

返回有序集 key 中成员 member 的排名。其中有序集成员按 score 值递增(从小到大)顺序排列。

排名以 0 为底，也就是说， score 值最小的成员排名为 0 。

```
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "afdsc"
2) "4"
3) "fdfd"
4) "4"
5) "afddsc"
6) "9"
127.0.0.1:6379> zrank z_a fdfd
(integer) 1
127.0.0.1:6379> zrank z_a afdsc
(integer) 0
127.0.0.1:6379> zrank z_a afddsc
(integer) 2
127.0.0.1:6379> zadd z_a 2 aaa
(integer) 1
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "aaa"
2) "2"
3) "afdsc"
4) "4"
5) "fdfd"
6) "4"
7) "afddsc"
8) "9"
127.0.0.1:6379> zrank z_a fdfd
(integer) 2
```

**zrevrank key member**

返回有序集 key 中成员 member 的排名。其中有序集成员按 score 值递减(从大到小)排序。

排名以 0 为底，也就是说， score 值最大的成员排名为 0 。

```
127.0.0.1:6379> zrange z_a 0 -1 withscores
1) "aaa"
2) "2"
3) "afdsc"
4) "4"
5) "fdfd"
6) "4"
7) "afddsc"
8) "9"
127.0.0.1:6379> zrevrank z_a fdfd
(integer) 1
127.0.0.1:6379> zrevrank z_a afddsc
(integer) 0
127.0.0.1:6379> zrevrank z_a aaa
(integer) 3
```

**zrangebyscore key min max [withscores] [limit offset count]**

返回有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员。有序集成员按 score 值递增(从小到大)次序排列。

具有相同 score 值的成员按字典序(lexicographical order)来排列(该属性是有序集提供的，不需要额外的计算)。

可选的 LIMIT 参数指定返回结果的数量及区间(就像SQL中的 SELECT LIMIT offset, count )，注意当 offset 很大时，定位 offset 的操作可能需要遍历整个有序集，此过程最坏复杂度为 O(N) 时间。

可选的 WITHSCORES 参数决定结果集是单单返回有序集的成员，还是将有序集成员及其 score 值一起返回。

```
127.0.0.1:6379> zadd salary 5000 zhangsan  2500 lisi  12000 wangwu
(integer) 3
127.0.0.1:6379> zrangebyscore salary -inf +inf
1) "lisi"
2) "zhangsan"
3) "wangwu"
127.0.0.1:6379> zrangebyscore salary -inf +inf withscores
1) "lisi"
2) "2500"
3) "zhangsan"
4) "5000"
5) "wangwu"
6) "12000"
127.0.0.1:6379> zrangebyscore salary -inf +inf withscores limit 0 2
1) "lisi"
2) "2500"
3) "zhangsan"
4) "5000"
127.0.0.1:6379> zrangebyscore salary -inf +inf withscores limit 2 2
1) "wangwu"
2) "12000"
127.0.0.1:6379> zrangebyscore salary -inf +inf withscores limit 1 2
1) "zhangsan"
2) "5000"
3) "wangwu"
4) "12000"
127.0.0.1:6379> zrangebyscore salary 2500 6000
1) "lisi"
2) "zhangsan"
127.0.0.1:6379> zrangebyscore salary (2500 6000
1) "zhangsan"
127.0.0.1:6379> zrangebyscore salary (2500 (5000
(empty list or set)
127.0.0.1:6379> zrangebyscore salary (2500 5000
1) "zhangsan"
```

**zcount key min max**

返回有序集 key 中， score 值在 min 和 max 之间(默认包括 score 值等于 min 或 max )的成员的数量。

```
127.0.0.1:6379> zadd salary 5000 zhangsan  2500 lisi  12000 wangwu
(integer) 3
127.0.0.1:6379> zcount salary -inf +inf
(integer) 3
127.0.0.1:6379> zcount salary 2500 5000
(integer) 2
127.0.0.1:6379> zcount salary 2500 (5000
(integer) 1
```

**zcard key**

返回有序集 key的基数。

```
127.0.0.1:6379> zcard z_a
(integer) 4
127.0.0.1:6379> zcard salary
(integer) 3
```