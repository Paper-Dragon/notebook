## 一、MySQL介绍

瑞典AB公司开发，后来卖给了oracle

一个关系型数据库

中小型数据库，表过大会出现IO性能瓶颈，树明建议单表600万条记录或2G以上就分表

分为企业版和社区版，目前两大版本mysql5.7 和mysql 8.0

## 二、MySQL安装

a、安装前依赖解决

1）cmake命令 2.8以上

https://cmake.org/download/

boost Boost库是一个可移植、提供源代码的C库，作为标准库的后备，是C标准化进程的开发引擎之一

https://www.boost.org/

mysql获得

https://dev.mysql.com/downloads/mysql/

b、MySQL 安装

[root@zutuanxue ~]# yum -y install ncurses-devel gcc-* bzip2-* bison

1)cmake 安装

```
[root@zutuanxue ~]# tar xf cmake-3.6.0-rc1.tar
[root@zutuanxue cmake-3.6.0-rc1]# cd cmake-3.6.0-rc1
[root@zutuanxue cmake-3.6.0-rc1]# ./configure
[root@zutuanxue cmake-3.6.0-rc1]# make
[root@zutuanxue cmake-3.6.0-rc1]# make install
```

2）boost 安装

```
[root@zutuanxue ~]# tar xf boost\_1\_59\_0.tar.bz2
[root@zutuanxue ~]# mv boost\_1\_59\_0 /usr/local/boost
```

3)mysql安装

```
[root@zutuanxue ~]# useradd -s /sbin/nologin -r mysql
[root@zutuanxue ~]# mkdir -pv /usr/local/mysql/data
[root@zutuanxue ~]# tar xf mysql...tar.xx

[root@zutuanxue mysql]# cmake . -DCMAKE\_INSTALL\_PREFIX=/usr/local/mysql  -DMYSQL\_DATADIR=/usr/local/mysql/data/ -DMYSQL\_UNIX\_ADDR=/usr/local/mysql/mysql.sock  -DWITH\_INNOBASE\_STORAGE\_ENGINE=1 -DWITH\_MYISAM\_STORAGE\_ENGINE=1  -DENABLED\_LOCAL\_INFILE=1 -DEXTRA\_CHARSETS=all -DDEFAULT\_CHARSET=utf8 -DDEFAULT\_COLLATION=utf8\_general\_ci -DMYSQL\_USER=mysql -DWITH\_DEBUG=0 -DWITH\_EMBEDDED\_SERVER=1 -DDOWNLOAD\_BOOST=1  -DENABLE\_DOWNLOADS=1 -DWITH\_BOOST=/usr/local/boost


[root@zutuanxue mysql]# cmake . \
-DCMAKE_INSTALL_PREFIX=/usr/local/mysql     指定安装路径
-DMYSQL_DATADIR=/usr/local/mysql/data/     指定数据目录
-DMYSQL_UNIX_ADDR=/usr/local/mysql/mysql.sock      指定sock文件路径
-DWITH_INNOBASE_STORAGE_ENGINE=1             安装Innodb存储引擎
-DWITH_MYISAM_STORAGE_ENGINE=1              安装myisam存储引擎
-DENABLED_LOCAL_INFILE=1                 允许使用Load data命令从本地导入数据
-DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci   安装所有字符集、默认字符集utf-8 、校验字符
-DMYSQL_USER=mysql   mysql用户名
-DWITH_DEBUG=0       关闭debug
-DWITH_EMBEDDED_SERVER=1   生成一个libmysqld.a(.so)的库，这个库同时集成了mysql服务与客户端API
-DDOWNLOAD_BOOST=1  -DENABLE_DOWNLOADS=1 -DWITH_BOOST=/usr/local/boost   允许boost 允许下载boost库文件。


[root@zutuanxue mysql]# make

[root@zutuanxue mysql]# make install
```

4)安装后操作

```
[root@zutuanxue ~]#  cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
[root@zutuanxue ~]# chmod 755 /etc/init.d/mysql
[root@zutuanxue ~]# chown mysql.mysql /usr/local/mysql/ -R
[root@zutuanxue ~]# ln -sf /usr/local/mysql/bin/\* /usr/bin/
[root@zutuanxue ~]# ln -sf /usr/local/mysql/lib/\* /usr/lib/
[root@zutuanxue ~]# ln -sf /usr/local/mysql/libexec/\*  /usr/local/libexec
[root@zutuanxue ~]# ln -sf /usr/local/mysql/share/man/man1/\*  /usr/share/man/man1
[root@zutuanxue ~]# ln -sf /usr/local/mysql/share/man/man8/\*  /usr/share/man/man8
```

修改配置文件 确保路径正确

```
egrep -v "^#|^$" /etc/my.cnf

[mysqld]

datadir=/usr/local/mysql/data

socket=/usr/local/mysql/mysql.sock

symbolic-links=0

[mysqld\_safe]

log-error=/var/log/mysql.log

pid-file=/var/run/mysql.pid

!includedir /etc/my.cnf.d
```

5)初始化数据库

```
[root@zutuanxue ~]# /usr/local/mysql/bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql/ --datadir=/usr/local/mysql/data/
```

临时密码

root@localhost: T6upu>pr+8,Z

## 三、启动mysql

```
[root@zutuanxue ~]# /etc/init.d/mysql start
```

1. 密码修改

```
[root@zutuanxue ~]# mysql_secure_installation
```

## 四、MySQL测试

mysql -u root -p’password’

mysql>