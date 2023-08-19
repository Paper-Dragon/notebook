

## 一、PHP介绍

PHP（外文名:PHP: Hypertext Preprocessor，中文名：“超文本预处理器”）是一种通用开源脚本语言。语法吸收了C语言、Java和Perl的特点，利于学习，使用广泛，主要适用于Web开发领域。PHP 独特的语法混合了C、Java、Perl以及PHP自创的语法。它可以比CGI或者Perl更快速地执行动态网页。用PHP做出的动态页面与其他的编程语言相比，PHP是将程序嵌入到HTML（标准通用标记语言下的一个应用）文档中去执行，执行效率比完全生成HTML标记的CGI要高许多；PHP还可以执行编译后代码，编译可以达到加密和优化代码运行，使代码运行更快。

优点：灵活，上手快，易修改，发布快捷，环境好部署

PHP主要用在服务器端上用于Web开发，约占网站总数的80%。 Facebook最初使用的就是PHP，PHP在WordPress内容管理系统中扮演的角色让它很受欢迎。

官网

[https://www.php.net](https://www.php.net/)

\#软件包获取

https://www.php.net/distributions/php-7.3.4.tar.bz2

## 二、PHP安装

1）依赖包安装

[root@zutuanxue ~]# yum install gcc-c++ libxml2 libxml2-devel openssl openssl-devel bzip2 bzip2-devel libcurl libcurl-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel gmp gmp-devel libmcrypt libmcrypt-devel readline readline-devel libxslt libxslt-devel gd net-snmp-*

libzip版本低问题处理

libzip要求1.1及以上，系统提供1.0需要升级

官方网站: https://libzip.org/

[root@zutuanxue ~]# wget https://libzip.org/download/libzip-1.5.2.tar.gz

[root@zutuanxue ~]# tar xf [libzip-1.5.2.tar.gz](https://libzip.org/download/libzip-1.5.2.tar.gz)

[root@zutuanxue ~]# cd [libzip-1.5.2](https://libzip.org/download/libzip-1.5.2.tar.gz)

[root@zutuanxue libzip-1.5.2]# mkdir build

[root@zutuanxue build]# cd build

[root@zutuanxue build]#cmake …

[root@zutuanxue build]#make

[root@zutuanxue build]#make install

2)配置

[root@zutuanxue ~]# tar xf php-7.3.4.tar.bz2

[root@zutuanxue php-7.3.4]# ./configure --prefix=/usr/local/php --with-config-file-path=/usr/local/php/etc --with-mysqli=mysqlnd --enable-pdo --with-pdo-mysql=mysqlnd --with-iconv-dir=/usr/local/ --enable-fpm --with-fpm-user=www --with-fpm-group=www --with-pcre-regex --with-zlib --with-bz2 --enable-calendar --disable-phar --with-curl --enable-dba --with-libxml-dir --enable-ftp --with-gd --with-jpeg-dir --with-png-dir --with-zlib-dir --with-freetype-dir --enable-gd-jis-conv --with-mhash --enable-mbstring --enable-opcache=yes --enable-pcntl --enable-xml --disable-rpath --enable-shmop --enable-sockets --enable-zip --enable-bcmath --with-snmp --disable-ipv6 --with-gettext --disable-rpath --disable-debug --enable-embedded-mysqli --with-mysql-sock=/usr/local/mysql/

```
配置参数说明
---prefix=/usr/local/php                             安装路径
--with-config-file-path=/usr/local/php/etc   配置文件路径
--with-mysqli=mysqlnd --enable-embedded-mysqli --with-mysql-sock=/usr/local/mysql/      mysql支持及客户端设置
--enable-pdo --with-pdo-mysql=mysqlnd                      开启php pdo,PDO一是PHP数据对象（PHP Data Object）的缩写
--with-iconv-dir=/usr/local/                         指定转码工具，各种字符集间的转换
--enable-fpm --with-fpm-user=www --with-fpm-group=www             支持php-fpm，允许以服务的方式启动PHP
--with-pcre-regex                             支持pcre正则表达式
--with-zlib --with-bz2  --with-zlib-dir  --enable-zip            支持压缩
--enable-calendar                             支持日历
--disable-phar                        PHAR (“Php ARchive”) 是PHP里类似于JAR的一种打包文件。如果你使用的是 PHP 5.3 或更高版本，那么Phar后缀文件是默认开启支持的.
--with-curl                                 支持curl
--enable-dba                                 开启dba函数支持
--with-libxml-dir                             支持xml文件库 对xml读取和查询
--enable-ftp                                 支持ftp
--with-gd --with-jpeg-dir --with-png-dir                  支持图片
--with-freetype-dir                             支持字库
--enable-gd-jis-conv                             支持gd库
--with-mhash --enable-mbstring                      支持加密
--enable-opcache=yes                             开启opcache
--enable-pcntl                                             开启PHP进程控制支持   默认是关闭的
--enable-xml                                 允许xml文件
--disable-rpath                             关闭额外的运行库文件
--enable-shmop                                 开启Shmop 是一个易用的允许PHP读取、写入、创建和删除Unix共享内存段的函数集
--enable-sockets                             打开 sockets 支持
--enable-bcmath                             增加bcmath扩展的支持，这是一个支持大整数计算的扩展。
--with-snmp                                 支持snmp
--disable-ipv6                                 关闭IPV6支持
--with-gettext                                 打开gnu 的gettext 支持，编码库用到
--disable-debug                              关闭调试模式
```

3)编译

[root@zutuanxue php-7.3.4]# make

4)安装

[root@zutuanxue php-7.3.4]# make install

5)拷贝一个配置文件

[root@zutuanxue php-7.3.4]# cp /usr/src/php-7.3.4/php.ini-production /usr/local/php/etc/php.ini

### 

## 三、PHP配置

#### **关于PHP工作方式**

- #### 作为模块运行

- #### 独立服务运行

1）作为apache模块运行

\#if bind to apache

–with-apxs2=/usr/local/apache2/bin/apxs

AddType application/x-httpd-php .php

\#if no mysql

./configure --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd

2）作为服务运行

思考问题 apache如何将PHP请求交给PHP呢 PHP是一门语言

```
    思路  CGI  fastcgi
```

CGI 公共网关接口 (COMMON GATEWAY INTERFACE)，是一个协议

```
 它的作用就是帮助服务器与语言通信. 就是apache和php进行通信，因为apache和php的语言不通，因此需要一个沟通转换的过程，而CGI就是这个
 沟通的协议。
```

FastCGI 快速通用网关接口（FastCommonGatewayInterface),是CGI的升级版，一种语言无关的协议，FastCGI是用来提高CGI程序性能的

缺点：传统的cgi协议在每次连接请求时，会开启一个进程进行处理，处理完毕会关闭该进程，因此下次连接，又要再次开启一个进程进行处理，因此有多少个连接就有多少个cgi进程，这也就是为什么传统的cgi会显得缓慢的原因，因此过多的进程会消耗资源和内存。而fast-cgi则是一个进程可以处理多个请求，和上面的cgi协议完全不一样，cgi是一个进程只能处理一个请求，这样就会导致大量的cgi程序，因此会给服务器带来负担。

php-fpm:是一个实现了FastCGI（协议）的程序

是php提供给http前端服务器(web serve)的fastcgi协议接口程序,允许一个进程对多个连接进行处理，而不会立即关闭这个进程，而是会接着处理下一个连接。

PHP-CGI：PHP-CGI是php自带的Fast-CGI管理器。

PHP-CGI的不足：

php-cgi变更php.ini配置后需重启php-cgi才能让新的php-ini生效，不可以平滑重启。

直接杀死php-cgi进程，php就不能运行了。(PHP-FPM和Spawn-FCGI就没有这个问题，守护进程会平滑从新生成新的子进程。）

PHP-FPM(FastCGI Process Manager：FastCGI进程管理器)是一个PHPFastCGI管理器，对于PHP 5.3.3之前的php来说，是一个补丁包 ，旨在将FastCGI进程管理整合进PHP包中。如果你使用的是PHP5.3.3之前的PHP的话，就必须将它patch到你的PHP源代码中，在编译安装PHP后才可以使用。从PHP 5.4 RC2开始，php-fpm已经转正了

**PHP-FPM特点**

1. listen：The address on which to accept FastCGI requests.它支持TCP Socket和unix socket两种通讯协议。可设置listen = [::]:9000。
2. listen.allowed_clients：List of addresses (IPv4/IPv6) of FastCGI clients which are allowed to connect. 该配置项为逗号分隔的列表，如listen.allowed_clients = 127.0.0.1,172.17.0.5。
3. pm：Choose how the process manager will control the number of child processes. 该配置项设置FPM管理进程池的方式，包括static、dynamic、ondemand三种。
4. pm.max_requests：The number of requests each child process should execute before respawning. This can be useful to work around memory leaks in 3rd party libraries.设置每个子进程处理请求数的上限，对于处理第三方库中的内存泄漏很有用。
5. pm.status_path：The URI to view the FPM status page. 支持状态页面监控php-fpm

**PHP-FPM工作原理：**

1、Web Server启动时载入FastCGI进程管理器（IIS ISAPI或Apache Module)

2、FastCGI进程管理器自身初始化，启动多个CGI解释器进程(可见多个php-cgi)并等待来自Web Server的连接。

3、当客户端请求到达Web Server时，FastCGI进程管理器选择并连接到一个CGI解释器。Web server将CGI环境变量和标准输入发送到FastCGI子进程php-cgi。

4、FastCGI子进程完成处理后将标准输出和错误信息从同一连接返回Web Server。当FastCGI子进程关闭连接时，请求便告处理完成。FastCGI子进程接着等待并处理来自FastCGI进程管理器(运行在Web Server中)的下一个连接。 在CGI模式中，php-cgi在此便退出了。

在上述情况中，你可以想象CGI通常有多慢。每一个Web请求PHP都必须重新解析php.ini、重新载入全部扩展并重初始化全部数据结构。使用FastCGI，所有这些都只在进程启动时发生一次。一个额外的好处是，持续数据库连接(Persistent database connection)可以工作。

\#php-fpm服务设置 pool

每个pool可以监听不同的sock、tcp/ip,pool池是支持定义多个pool的。所有的网站使用同一个池，那其中一个网站发生一些故障，比如程序员写的一些程序有问题，就会把php资源耗尽，这样的结果就是其他站点的php也会502。所以有必要把每一个站点隔离开。每个pool的名字要唯一。

#### PHP服务配置

\#主配置文件

```
[root@zutuanxue var]# egrep -v "^;|^$" /usr/local/php/etc/php-fpm.conf

[global]

pid = run/php-fpm.pid

error_log = log/php-fpm.log

daemonize = yes

include = /usr/local/php/etc/php-fpm.d/\*.conf
```

\#子配置文件

```
[root@zutuanxue var]# cp /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf

[root@zutuanxue var]# egrep -v "^;|^$" /usr/local/php/etc/php-fpm.d/www.conf

[www]

user = www

group = www

listen = 127.0.0.1:9000

listen.owner = www

listen.group = www

listen.mode = 0660

pm = dynamic

pm.max_children = 5

pm.start_servers = 2

pm.min_spare_servers = 1

pm.max_spare_servers = 3
```

\# 全局配置文件

```
注释
# 全局配置
[global]
# PID、可以不填
pid = /usr/local/php/var/run/php-fpm.pid
# 错误日志路径、可以不填
error_log = /usr/local/php/var/log/php-fpm.log


# www虚拟主机配置、可写多个
# pool命名：www
[www]
# 监听socket方式
# 可以写成listen = 127.0.0.1:9000
listen = /tmp/php-fcgi.sock
# 开启php-fpm的执行用户
user = www
# 开启php-fpm的所属组
group = www
# 监听socket listen的用户，和web服务器软件的一致
listen.owner = nobody
# 监听socket listen的组，和web服务器软件的一致
listen.group = nobody
# 怎样的形式启用进程
pm = dynamic
# 最大开启子进程数
pm.max_children = 50
# 一开始启动多少子进程
pm.start_servers = 20
# 空闲时保留多少个子进程
pm.min_spare_servers = 5
# 最多空闲子进程
pm.max_spare_servers = 35
# 进程处理多少个请求之后销毁重建
pm.max_requests = 500
# 限定打开最大的文件数
rlimit_files = 1024
```

## 四、PHP启动

[root@zutuanxue ~]# cp /usr/src/php-7.3.4/sapi/fpm/php-fpm.service /etc/systemd/system/

[root@zutuanxue ~]# systemctl daemon-reload

[root@zutuanxue ~]# systemctl enable php-fpm

[root@zutuanxue ~]# systemctl start php-fpm

## 五、相关知识补充

**#mysqli 说明**

MYSQL 也叫 Original MySQL，PHP4版本的MYSQL扩展，从PHP5起已经被废弃，并别从PHP7开始已经被移除。

MYSQLI 叫做 “MySQL增强扩展”。

MYSQLND MYSQL NATIVE DIRVER 叫做MYSQL “官方驱动”或者更加直接点的叫做“原生驱动”

PDO PHP Data Objects PHP数据对象，是PHP应用中的一个数据库抽象层规范。

**#opcache**

**原理：**

其实非常简单，opcache只是把把PHP执行后的数据（opcode）缓存到内存中从而避免重复的编译过程，能够直接使用缓冲区已编译的opcode代码从而提高速度，降低服务器负载

**效果: **在实际应用当中能使QPS数大致增加3倍以上

**注意：**

启用opcache后，典型的问题就是由于opcache的缓存加速机制导致的代码变更后无法立即看到效果。php代码被转换成可立即执行的“机器码”后会有一定的缓存时间后才会去检查原始的PHP文件是否变动过，具体视配置项opcache.revalidate_freq设置的秒数情况而定；这样就会导致某些情况下明明更新了PHP文件中的代码，但执行后却看不到改变后的效果，这就是因为opcache检查php文件变动的间隔时间尚未结束所导致。 这个问题并不是bug，而要视具体生产环境来设定opcache.revalidate_freq值，倘若php代码很少变动，建议该值设置的大一些，可减少opcahce由于检查php文件变动而带来的额外开销，比如7200 那么在变动php文件后如何才能快速降低opcache缓存带来的这种问题呢？最简单的方法就是更新代码后重启下php-fpm（nginx fast-cgi模式）或apache（apache-handler模式）。当然还可以自己书写一个php脚本，调用opcache_reset()函数重置所有opcache缓存字节码，或者使用opcache_invalidate(PHPfileDir,true)重置指定php文件的缓存字节码。

opcache配置指令详解

```
[Zend Opcache]

zend_extension = /usr/local/php/lib/php/extensions/no-debug-non-zts-20090626/opcache.so

opcache.enable=1 ;启用操作码缓存

opcache.enable_cli=1 ;仅针对CLI环境启用操作码缓存

opcache.memory_consumption=128 ;共享内存大小，单位MB

opcache.interned_strings_buffer=8 ;存储临时字符串的内存大小，单位MB

opcache.max_accelerated_files=4000 ;哈希表中可存储的脚本文件数量上限

;opcache.max_wasted_percentage=5 ;浪费内存的上限，以百分比计

;opcache.use_cwd=1;附加改脚本的工作目录,避免同名脚本冲突

opcache.validate_timestamps=1 ;每隔revalidate_freq 设定的秒数 检查脚本是否更新

opcache.revalidate_freq=60 ;

;opcache.revalidate_path=0 ;如果禁用此选项，在同一个 include_path 已存在的缓存文件会被重用

;opcache.save_comments=1 ;禁用后将也不会加载注释内容

opcache.fast_shutdown=1 ;一次释放全部请求变量的内存

opcache.enable_file_override=0 ; 如果启用，则在调用函数file_exists()， is_file() 以及 is_readable() 的时候， 都会检查操作码缓存

;opcache.optimization_level=0xffffffff ;控制优化级别的二进制位掩码。

;opcache.inherited_hack=1 ;PHP 5.3之前做的优化

;opcache.dups_fix=0 ;仅作为针对 “不可重定义类”错误的一种解决方案。

;opcache.blacklist_filename="" ;黑名单文件为文本文件，包含了不进行预编译优化的文件名

;opcache.max_file_size=0 ;以字节为单位的缓存的文件大小上限

;opcache.consistency_checks=0 ;如果是非 0 值，OPcache 将会每隔 N 次请求检查缓存校验和

opcache.force_restart_timeout=180 ; 如果缓存处于非激活状态，等待多少秒之后计划重启。

;opcache.error_log="" ;OPcache模块的错误日志文件

;opcache.log_verbosity_level=1 ;OPcache模块的日志级别。致命（0）错误（1) 警告（2）信息（3）调试（4）

;opcache.preferred_memory_model="" ;OPcache 首选的内存模块。可选值包括： mmap，shm, posix 以及 win32。

;opcache.protect_memory=0 ;保护共享内存，以避免执行脚本时发生非预期的写入。 仅用于内部调试。

;opcache.mmap_base=null ;在Windows 平台上共享内存段的基地址
```

## 六、FAQ

**问题一**

```
可能遇到的问题
centos7 编译libiconv ./stdio.h:1010:1: 错误： ‘gets’未声明(不在函数内)
make报错：
./stdio.h:1010:1: 错误： ‘gets’未声明(不在函数内)
make[2]: *** [progname.o] 错误 1
make[2]:正在离开目录 `/home/lmos/libiconv-1.14/srclib'
make[1]: *** [all] 错误 2make[1]:正在离开目录 `/home/lmos/libiconv-1.14/srclib'
make: *** [all] 错误 2
cd srclib  目录
sed -i -e '/gets is a security/d' ./stdio.in.h
```

**问题二**

```
checking size of off_t... 0
configure: error: off_t undefined; check your library configuration

# 添加搜索路径到配置文件
echo '/usr/local/lib64
/usr/local/lib
/usr/lib
/usr/lib64'>>/etc/ld.so.conf
# 更新配置
ldconfig -v
```