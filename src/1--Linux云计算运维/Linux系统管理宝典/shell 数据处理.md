## 一、linux中的常用符号

|                                       |                                                              |
| ------------------------------------- | ------------------------------------------------------------ |
| *                                     | 代表任意字符串                                               |
| ？                                    | 代表任意字符                                                 |
| /                                     | 代表根目录或作为路径间隔符使用                               |
| \                                     | 转义字符。                                                   |
| \<ENTER>                              | 续行符。可以使用续行符将一个命令行分写在多行上               |
| $                                     | 变量值置换，如：$PATH表示环境变量PATH的值                    |
| ’                                     | 在’…'中间的字符都会被当做普通字符处理                        |
| ‘’                                    | 在’’…’'中间的字符会被当做文字处理并允许变量值置换            |
| `| 命令替换，置换\`…`中命令的执行结果 |                                                              |
| <                                     | 输入重定向字符                                               |
| >                                     | 输出重定向字符                                               |
| \|                                    | 管道字符                                                     |
| &                                     | 后台执行字符。在一个命令之后加上字符“&”，该命令就会以后台方式执行 |
| ;                                     | 按照顺序执行的多个命令                                       |
| ()                                    | 在子Shell中执行命令                                          |
| {}                                    | 在当前Shell中执行命令                                        |
| !                                     | 执行命令历史记录中的命令                                     |
| ~                                     | 代表登录用户的宿主目录（自家目录）                           |

## 二、历史记录

linux系统在shell中保留了用户键入的每一个命令的历史记录，并且提供了很多种方法让用户通过历史记录找到曾经使用过的命令，并且调用这个历史记录的命令。

```
[root@zutuanxue ~]# history
    1  ifconfig
    2  nmcli connection modify ens33 ipv4.addresses 192.168.2.220/24 ipv4.gateway 192.168.2.1 ipv4.method manual autoconnect yes
    3  route -n
    4  nmcli connection down ens33
   .
   .
   .
```

| 语法  | 替换                  |
| ----- | --------------------- |
| ！！  | 前一个命令            |
| ！n   | 命令号n               |
| ！-n  | 倒数第n个命令         |
| ！cmd | 最后用来启动cmd的命令 |

**与历史记录相关的文件和变量**

```
[root@zutuanxue ~]# echo $HISTFILE
/root/.bash_history
#用户的历史记录保存的位置
[root@zutuanxue ~]# echo $HISTFILESIZE
1000
#启动时，从历史记录中读取的记录条数
[root@zutuanxue ~]# echo $HISTSIZE
1000
#退出时，被写入历史记录的最大条数
```

**历史记录技巧**

```
esc+./alt+.	调用上一条命令的最后一部分内容
ctrl+r	在历史记录中搜索给出关键字的命令
```

## 三、标准输入、标准输出、标准错误

在linux系统中，大多数时候我们从键盘读取输入，在终端显示输出，而我们在键盘中输入的内容，多数都是执行命令，这些命令属于终端程序，除了终端程序还有图形程序和屏幕程序（如vim），不管是哪一种程序都会涉及到输入，输出，错误，多数情况下，我们在键盘输入信息，在显示器查看信息（正确的信息和错误的信息），这些输入的信息我们称之为标准输入（可以用0表示），输出的信息我们称之为标准输出（可以用1表示），而错误的信息（可以用2表示），我们称之为标准错误。在日常使用中我们除了可以使用键盘输入信息，从显示器读取信息之外，还可以指定程序从键盘以外的地方读取需要输入的内容，也可以让程序将信息输出到显示器以外的地方。

**重定向输入和输出**

```
#重定向输出
[root@zutuanxue ~]# mkdir a
[root@zutuanxue ~]# cd a
[root@zutuanxue a]# mkdir aa ab ac
[root@zutuanxue a]# cd aa
[root@zutuanxue aa]# touch bb bc bd
[root@zutuanxue ~]# ls a/ > test	
[root@zutuanxue ~]# cat test
aa
ab
ac
[root@zutuanxue ~]# ls a/aa/ >> test
[root@zutuanxue ~]# cat test
aa
ab
ac
bb
bc
bd

>覆盖
>>追加
#重定向输入
[root@zutuanxue ~]# wc -l test
6 hello
[root@zutuanxue ~]# wc -l < test 
6
注意：第一个例子，会输出文件名；第二个不会，因为它仅仅知道从标准输入读取内容。
```

我们知道标准输入可以用0来表示，标准输出可以用1来表示，标准错误可以用2来表示，而有些时候这些输出的信息中即包含了正确的信息，也包含了错误的信息，如：

```
[root@zutuanxue ~]# ls /etc/rc.d/
init.d  rc0.d  rc1.d  rc2.d  rc3.d  rc4.d  rc5.d  rc6.d  rc.local
[root@zutuanxue ~]# head -1 /etc/rc.d/*
==> /etc/rc.d/init.d <==
head: 读取'/etc/rc.d/init.d' 时出错: 是一个目录

==> /etc/rc.d/rc0.d <==
head: 读取'/etc/rc.d/rc0.d' 时出错: 是一个目录

==> /etc/rc.d/rc1.d <==
head: 读取'/etc/rc.d/rc1.d' 时出错: 是一个目录

==> /etc/rc.d/rc2.d <==
head: 读取'/etc/rc.d/rc2.d' 时出错: 是一个目录

==> /etc/rc.d/rc3.d <==
head: 读取'/etc/rc.d/rc3.d' 时出错: 是一个目录

==> /etc/rc.d/rc4.d <==
head: 读取'/etc/rc.d/rc4.d' 时出错: 是一个目录

==> /etc/rc.d/rc5.d <==
head: 读取'/etc/rc.d/rc5.d' 时出错: 是一个目录

==> /etc/rc.d/rc6.d <==
head: 读取'/etc/rc.d/rc6.d' 时出错: 是一个目录

==> /etc/rc.d/rc.local <==
#!/bin/bash
```

我们通过ls命令查看/etc/rc.d这个目录的时候，我们发现，这个目录中即有目录，也有文件，而当我们使用“head -1”命令去查看文件的第一行内容的时候， 很显然目录是无法查看第一行的，这时就会有报错，当我想把这些信息都写入到一个指定的文件中而不想看到这些内容我该如何去做？

```
[root@zutuanxue ~]# head -1 /etc/rc.d/* > test
head: 读取'/etc/rc.d/init.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc0.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc1.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc2.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc3.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc4.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc5.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc6.d' 时出错: 是一个目录
[root@zutuanxue ~]# cat test
==> /etc/rc.d/init.d <==
==> /etc/rc.d/rc0.d <==
==> /etc/rc.d/rc1.d <==
==> /etc/rc.d/rc2.d <==
==> /etc/rc.d/rc3.d <==
==> /etc/rc.d/rc4.d <==
==> /etc/rc.d/rc5.d <==
==> /etc/rc.d/rc6.d <==
==> /etc/rc.d/rc.local <==
#!/bin/bash
```

我们可以利用之前的>将输出的信息重定向到一个指定的文件，但是仍然会收到错误提示，这是为什么呢？因为在linux当中正确的输出和错误的输出实际上是两种数据流，默认情况下这两种数据流都会在显示器上打印出来，而我们使用的>相当于1>,也就是将正确的信息写入到了test文件中，错误的信息依旧会看到。利用前面的提到0，1，2这三个数字，我们可以这样做

```
[root@zutuanxue ~]# head -1 /etc/rc.d/* > test 2> test.err
[root@zutuanxue ~]# cat test
==> /etc/rc.d/init.d <==
==> /etc/rc.d/rc0.d <==
==> /etc/rc.d/rc1.d <==
==> /etc/rc.d/rc2.d <==
==> /etc/rc.d/rc3.d <==
==> /etc/rc.d/rc4.d <==
==> /etc/rc.d/rc5.d <==
==> /etc/rc.d/rc6.d <==
==> /etc/rc.d/rc.local <==
#!/bin/bash
[root@zutuanxue ~]# cat test.err 
head: 读取'/etc/rc.d/init.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc0.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc1.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc2.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc3.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc4.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc5.d' 时出错: 是一个目录
head: 读取'/etc/rc.d/rc6.d' 时出错: 是一个目录
```

但是这依然是两个文件，能不能将这些信息都写入到一个文件中呢？

```
[root@zutuanxue ~]# head -1 /etc/rc.d/* > test.both 2>&1
[root@zutuanxue ~]# cat test.both 
==> /etc/rc.d/init.d <==
head: 读取'/etc/rc.d/init.d' 时出错: 是一个目录
==> /etc/rc.d/rc0.d <==
head: 读取'/etc/rc.d/rc0.d' 时出错: 是一个目录
==> /etc/rc.d/rc1.d <==
head: 读取'/etc/rc.d/rc1.d' 时出错: 是一个目录
==> /etc/rc.d/rc2.d <==
head: 读取'/etc/rc.d/rc2.d' 时出错: 是一个目录
==> /etc/rc.d/rc3.d <==
head: 读取'/etc/rc.d/rc3.d' 时出错: 是一个目录
==> /etc/rc.d/rc4.d <==
head: 读取'/etc/rc.d/rc4.d' 时出错: 是一个目录
==> /etc/rc.d/rc5.d <==
head: 读取'/etc/rc.d/rc5.d' 时出错: 是一个目录
==> /etc/rc.d/rc6.d <==
head: 读取'/etc/rc.d/rc6.d' 时出错: 是一个目录
==> /etc/rc.d/rc.local <==
#!/bin/bash

或者

[root@zutuanxue ~]# head -1 /etc/rc.d/* >& test.both1
[root@zutuanxue ~]# cat test.both1 
==> /etc/rc.d/init.d <==
head: 读取'/etc/rc.d/init.d' 时出错: 是一个目录
==> /etc/rc.d/rc0.d <==
head: 读取'/etc/rc.d/rc0.d' 时出错: 是一个目录
==> /etc/rc.d/rc1.d <==
head: 读取'/etc/rc.d/rc1.d' 时出错: 是一个目录
==> /etc/rc.d/rc2.d <==
head: 读取'/etc/rc.d/rc2.d' 时出错: 是一个目录
==> /etc/rc.d/rc3.d <==
head: 读取'/etc/rc.d/rc3.d' 时出错: 是一个目录
==> /etc/rc.d/rc4.d <==
head: 读取'/etc/rc.d/rc4.d' 时出错: 是一个目录
==> /etc/rc.d/rc5.d <==
head: 读取'/etc/rc.d/rc5.d' 时出错: 是一个目录
==> /etc/rc.d/rc6.d <==
head: 读取'/etc/rc.d/rc6.d' 时出错: 是一个目录
==> /etc/rc.d/rc.local <==
#!/bin/bash

这两种使用方式都是告诉shell将错误信息写入到正确信息所写入的文件中。
如果这些错误信息是我们早就知道的，并且还不想看到的呢？
[root@zutuanxue ~]# head -1 /etc/rc.d/* 2> /dev/null 
==> /etc/rc.d/init.d <==
==> /etc/rc.d/rc0.d <==
==> /etc/rc.d/rc1.d <==
==> /etc/rc.d/rc2.d <==
==> /etc/rc.d/rc3.d <==
==> /etc/rc.d/rc4.d <==
==> /etc/rc.d/rc5.d <==
==> /etc/rc.d/rc6.d <==
==> /etc/rc.d/rc.local <==
#!/bin/bash

/dev/null:表示的是一个黑洞，通常用于丢弃不需要的数据输出
```

综上所述针对于输入输出重定向与合并的用法有

| 语法          | 作用                                                       |
| ------------- | ---------------------------------------------------------- |
| cmd < file    | 从file重定向标准输入                                       |
| cmd > file    | 把标准输出重定向到file中，如果file存在的话，覆盖（损坏）它 |
| cmd>>file     | 把标准输出重定向到file中，如果file存在，附加给它           |
| cmd 2>file    | 把标准错误重定向到file，如果file 存在，覆盖（损坏）它      |
| cmd 2>> file  | 把标准错误重定向到file中，如果file 存在，附加给他          |
| cmd>file 2>&1 | 合并标准输出和标准错误，并且重定向到file中（可移植的语法） |
| cmd >& file   | 合并标准输出和标准错误，并且重定向到file中（方便的语法）   |

## 四、管道

在前面，我们已经看到，进程的输出可以被重定向到终端显示器以外的地方，或者可以让进程从终端键盘以外的地方读取输入。一种最常用，最有力的重定向形式是把这二者结合起来，在这种形式下，一个命令的输出（标准输出）被直接“用管道输送”到另一个命令的输入（标准输入）中，从而构成了 Linux（和Unix）所谓的管道（pipe）。当两个命令用管道连接起来时，第一个进程的标准输出流被直接连接到第二个进程的标准输入序列。为了用bash创建管道，用一个垂直的小节线 | 把这两个命令连接起来。

![image20200323144226709.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601398337.png)

```
[root@zutuanxue ~]# pwd
/root
[root@zutuanxue ~]# ls | grep ana
anaconda-ks.cfg
注意：从管道读数据是一次性操作，数据一旦被读，它就从管道中被抛弃，释放空间以便写更多的数据。它只能处理经由前面一个指令传出的正确输出信息，对错误信息信息没有直接处理能力。然后，传递给下一个命令，作为标准的输入。
```

## 五、数据处理常用工具

### 5.1、find文件查找命令

. 代表当前目录

~ 代表用户家目录

**find命令选项**

```
-name	按照文件名查找文件。
[root@zutuanxue ~]# find ~ -name "test.*"
/root/test.err
/root/test.both
/root/test.both1


-perm	按照文件权限来查找文件。
[root@zutuanxue ~]# chmod 777 hello
[root@zutuanxue ~]# find . -perm 777
./hello


-user	按照文件属主来查找文件。
-group	按照文件所属的组来查找文件。
-uid	查找指定uid
-gid	查找指定gid
[root@zutuanxue ~]# chown hello.hello test
[root@zutuanxue ~]# find . -user hello
./test
[root@zutuanxue ~]# find . -group hello
./test
[root@zutuanxue ~]# chown root.hello hello
[root@zutuanxue ~]# find . -user root -group hello
./hello
[root@zutuanxue ~]# find . -uid 1000
./test
[root@zutuanxue ~]# find . -gid 1000
./test


-mtime -n +n	按照文件的更改时间来查找文件， -n表示n天以内，+n表示n天以前。还有-atime和-ctime 选项
-amin/-cmin/-mmin n		 查找系统中最后N分钟

　　
#如果-mtime +2 表示当前时间-2day以前的mtime的文件。即文件的mtime小于 sysdate -2
#如果-mtime -2 表示当前时间-2day以后的mtime的文件。即文件的mtime大于 sysdate -2
#如果-mtime  2 表示文件mtime在sysdate -2 与 sysdate-1 之间的文件。
#！！！！！实际上再记不住，记住一般删除旧数据，一定是选择+。

[root@zutuanxue ~]# find /etc -mtime -2 
/etc
/etc/cups
/etc/cups/subscriptions.conf
/etc/resolv.conf



-nogroup	查找无有效所属组的文件，即该文件所属的组在/etc/groups中不存在。
-nouser	查找无有效属主的文件，即该文件的属主在/etc/passwd中不存在。
[root@zutuanxue ~]# chown 1400.1400 hello
[root@zutuanxue ~]# ll hello
-rwxrwxrwx 1 1400 1400 8 3月  22 23:25 hello
[root@zutuanxue ~]# find . -nogroup
./hello
[root@zutuanxue ~]# find . -nouser
./hello

-newer file1 查找更改时间比文件file1新的文件。
[root@zutuanxue ~]# find /etc -newer initial-setup-ks.cfg 
/etc
/etc/dnf/modules.d
/etc/dnf/modules.d/httpd.module
/etc/logrotate.d
还有anewer和cnewer




-type	查找某一类型的文件，诸如：
b - 块设备文件。
d - 目录。
c - 字符设备文件。
p - 管道文件。
l - 符号链接文件。
f - 普通文件。


[root@zutuanxue ~]# find /etc -newer initial-setup-ks.cfg -type f
/etc/dnf/modules.d/httpd.module
/etc/logrotate.d/glusterfs
/etc/pki/nssdb/cert9.db
/etc/pki/nssdb/key4.db
/etc/yum.repos.d/server.repo


-size n[bcwkMG] 查找文件长度为n块的文件，带有c时表示文件长度以字节计。
			b	512字节一块
			c	字节
			w	字（2字节）
			k	k字节（1024）
			M	M字节（1024x1024字节）
			G	G字节（1024x1024x1024字节）
[root@zutuanxue ~]# find . -size +1M
./.cache/tracker/meta.db
./.cache/tracker/meta.db-wal
./.cache/mozilla/firefox/mduza4q4.default/startupCache/startupCache.8.little
./.cache/mozilla/firefox/mduza4q4.default/startupCache/scriptCache-child-current.bin
./.cache/mozilla/firefox/mduza4q4.default/startupCache/scriptCache-current.bin
./.mozilla/firefox/mduza4q4.default/places.sqlite
./.mozilla/firefox/mduza4q4.default/favicons.sqlite
# 在使用的时候注意一下单位，如find . -size 4k使用4k时会显示所有大与3k小于等于4k的文件，如果使用的是4096c则是查找大小为4k的文件
[root@zutuanxue ~]# find . -size 4k
.
./.cache/mozilla/firefox/mduza4q4.default/startupCache/urlCache-current.bin
./.cache/mozilla/firefox/mduza4q4.default/startupCache/urlCache.bin
./.cache/mozilla/firefox/mduza4q4.default/safebrowsing
./.config/pulse
./.mozilla/firefox/mduza4q4.default
./.mozilla/firefox/mduza4q4.default/datareporting/archived/2020-02
./.mozilla/firefox/mduza4q4.default/saved-telemetry-pings
[root@zutuanxue ~]# find . -size 4096c
.
./.cache/mozilla/firefox/mduza4q4.default/safebrowsing
./.config/pulse
./.mozilla/firefox/mduza4q4.default
./.mozilla/firefox/mduza4q4.default/datareporting/archived/2020-02
./.mozilla/firefox/mduza4q4.default/saved-telemetry-pings
[root@zutuanxue ~]# find . -size 4k |wc -l
8
[root@zutuanxue ~]# find . -size 4096c |wc -l
6
[root@zutuanxue ~]# ll -h .cache/mozilla/firefox/mduza4q4.default/startupCache/urlCache-current.bin 
-rw-r--r-- 1 root root 3.1K 2月  24 02:34 .cache/mozilla/firefox/mduza4q4.default/startupCache/urlCache-current.bin


-follow：如果find命令遇到符号链接文件，就跟踪至链接所指向的文件。
[root@zutuanxue ~]# ln -s /etc/ linketc
[root@zutuanxue ~]# find . -name passwd
[root@zutuanxue ~]# find . -name passwd -follow
./linketc/pam.d/passwd
./linketc/passwd

-exec   command   {} \;      —–将查到的文件执行command操作,{} 和 \;之间有空格
-ok 和-exec相同，只不过在操作前要询用户
[root@zutuanxue ~]# find /etc -name passwd -exec grep "hello" {} \;
hello:x:1000:1000:hello:/home/hello:/bin/bash
[root@zutuanxue ~]# find /etc -name passwd -ok grep "hello" {} \;
< grep ... /etc/pam.d/passwd > ? y
< grep ... /etc/passwd > ? y
hello:x:1000:1000:hello:/home/hello:/bin/bash


-empty	查找空文件或目录
[root@zutuanxue ~]# find /etc -empty
/etc/crypttab
/etc/dnf/aliases.d
/etc/dnf/modules.defaults.d


-inum	查找i节点编号为指定数值的文件
-samefile	查找相同的文件

[root@zutuanxue ~]# ln hello hello1
[root@zutuanxue ~]# ln hello hello2
[root@zutuanxue ~]# ll -i hello
34510098 -rwxrwxrwx 3 1400 1400 8 3月  22 23:25 hello
[root@zutuanxue ~]# find . -inum 34510098
./hello
./hello1
./hello2

[root@zutuanxue ~]# find . -samefile hello
./hello
./hello1
./hello2
```

### 5.2、grep&egrep 数据检索命令

一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来，最常用。egrep是grep的扩展，支持更多的正则表达式元字符,等同于grep -E。

useradd HELLO

useradd helo

useradd helllo

**grep 与 正则表达式符号**

```
^ 行的开始 如：'^grep'匹配所有以grep开头的行。
[root@zutuanxue ~]# grep '^he' /etc/passwd

$	行的结束 如：'grep$'匹配所有以grep结尾的行。
[root@zutuanxue ~]# grep 'sh$' /etc/passwd

.	匹配一个非换行符('\n')的字符如：'gr.p'匹配gr后接一个任意字符，然后是p。
[root@zutuanxue ~]# grep 't.e' /etc/passwd

* 匹配零个或多个先前字符 如：' *grep' (注意*前有空格)匹配所有零个或多个空格后紧跟grep的行，需要用egrep 或者grep带上 -E 选项。 .*一起用代表任意字符。
[root@zutuanxue ~]# grep -E 'el*lo' /etc/passwd

[]	匹配一个指定范围内的字符，如'[Gg]rep'匹配Grep和grep。
[root@zutuanxue ~]# grep '[Hh]el' /etc/passwd

[^] 匹配一个不在指定范围内的字符，如：'[^A-FH-Z]rep'匹配不包含A-F和H-Z的一个字母开头，紧跟rep的行。
[root@zutuanxue ~]# grep '[^A-Z]ello' /etc/passwd
[root@zutuanxue ~]# grep '[^a-z]ello' /etc/passwd

\?	匹配零个或一个先前的字符。如：'gre\?p'匹配gr后跟一个或零个e字符，然后是p的行。
[root@zutuanxue ~]# grep 'hell\?o' /etc/passwd
hello:x:1000:1000:hello:/home/hello:/bin/bash
helo:x:1002:1002::/home/helo:/bin/bash

x\{m\} 重复字符x，m次，如：'o\{5\}'匹配包含5个o的行。
[root@zutuanxue ~]# grep 'l\{2\}' /etc/passwd

x\{m,\} 重复字符x,至少m次，如：'o\{5,\}'匹配至少有5个o的行。
[root@zutuanxue ~]# grep 'l\{2,\}' /etc/passwd

x\{m,n\} 重复字符x，至少m次，不多于n次，如：'o\{5,10\}'匹配5--10个o的行。
[root@zutuanxue ~]# grep 'l\{1,3\}' /etc/passwd

\b 单词锁定符，如: '\bgrep\b'只匹配grep。
[root@zutuanxue ~]# grep 'hell' /etc/passwd
hello:x:1000:1000:hello:/home/hello:/bin/bash
helllo:x:1003:1003::/home/helllo:/bin/bash
[root@zutuanxue ~]# grep '\bhell\b' /etc/passwd


egrep和 grep -E的扩展集
+	匹配一个或多个先前的字符。如：'[a-z]+able'，匹配一个或多个小写字母后跟able的串.
[root@zutuanxue ~]# grep -E '[a-z]+llo' /etc/passwd
hello:x:1000:1000:hello:/home/hello:/bin/bash
helllo:x:1003:1003::/home/helllo:/bin/bash
[root@zutuanxue ~]# grep -E '[a-z]+lo' /etc/passwd

?	作用同\?,如：'gre?p'匹配gr后跟一个或零个e字符，然后是p的行。
[root@zutuanxue ~]# grep -E 'hel?lo' /etc/passwd
hello:x:1000:1000:hello:/home/hello:/bin/bash
helo:x:1002:1002::/home/helo:/bin/bash
[root@zutuanxue ~]# grep 'hel?lo' /etc/passwd
[root@zutuanxue ~]# grep 'hel\?lo' /etc/passwd
hello:x:1000:1000:hello:/home/hello:/bin/bash
helo:x:1002:1002::/home/helo:/bin/bash

a|b|c 匹配a或b或c。如：grep|sed匹配grep或sed
[root@zutuanxue ~]# grep -E 'llo|lllo' /etc/passwd
hello:x:1000:1000:hello:/home/hello:/bin/bash
helllo:x:1003:1003::/home/helllo:/bin/bash

*	0次或多次
?	0次或1次
+	1次或多次

-E		支持扩展正则，相当于egrep
-i		不区分大小写
-v		取反，显示不匹配的
--color=auto	高亮显示
```

### 5.3、sort 对文件内容进行排序

**常用命令选项**

```
-b 忽略每行前面开始出的空格字符。
[root@zutuanxue ~]# sort passwd
apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
 hello:x:1000:1000:hello:/home/hello:/bin/bash
    HELLO:x:1001:1001::/home/HELLO:/bin/bash
      helo:x:1002:1002::/home/helo:/bin/bash
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
root:x:0:0:root:/root:/bin/bash
[root@zutuanxue ~]# sort -b passwd
apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
 hello:x:1000:1000:hello:/home/hello:/bin/bash
    HELLO:x:1001:1001::/home/HELLO:/bin/bash
      helo:x:1002:1002::/home/helo:/bin/bash
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
root:x:0:0:root:/root:/bin/bash

-c 检查文件是否已经按照顺序排序。
[root@zutuanxue ~]# sort -c passwd 
sort：passwd:2：无序： bin:x:1:1:bin:/bin:/sbin/nologin

-t	用指定的符号做为分隔符
-k	指定区间
-n 	依照数值的大小排序。
-r 以相反的顺序来排序。
[root@zutuanxue ~]# sort -t ':' -k 3 -r -n  passwd 
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
      helo:x:1002:1002::/home/helo:/bin/bash
    HELLO:x:1001:1001::/home/HELLO:/bin/bash
 hello:x:1000:1000:hello:/home/hello:/bin/bash
dbus:x:81:81:System message bus:/:/sbin/nologin
   apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
bin:x:1:1:bin:/bin:/sbin/nologin
root:x:0:0:root:/root:/bin/bash
或者
[root@zutuanxue ~]# sort -t ':' -k 3rn passwd 
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
      helo:x:1002:1002::/home/helo:/bin/bash
    HELLO:x:1001:1001::/home/HELLO:/bin/bash
 hello:x:1000:1000:hello:/home/hello:/bin/bash
dbus:x:81:81:System message bus:/:/sbin/nologin
   apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
bin:x:1:1:bin:/bin:/sbin/nologin
root:x:0:0:root:/root:/bin/bash


-o<输出文件> 将排序后的结果存入指定的文件。
[root@zutuanxue ~]# sort -t ':' -k 3 -r -n  passwd -o /root/passwd-sort
[root@zutuanxue ~]# cat /root/passwd-sort 
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
      helo:x:1002:1002::/home/helo:/bin/bash
    HELLO:x:1001:1001::/home/HELLO:/bin/bash
 hello:x:1000:1000:hello:/home/hello:/bin/bash
dbus:x:81:81:System message bus:/:/sbin/nologin
   apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
bin:x:1:1:bin:/bin:/sbin/nologin
root:x:0:0:root:/root:/bin/bash
```

### 5.4、uniq 数据去重

一般配合sort使用

**案例文档**

```
[root@zutuanxue ~]# cat testuniq
192.168.98.2
192.168.98.8
192.168.98.3
192.168.98.3
192.168.98.9
192.168.98.8
192.168.98.8
192.168.98.0
192.168.98.3
```

**常用命令选项**

```
-c	在每列旁边显示该行重复出现的次数。
[root@zutuanxue ~]# uniq -c testuniq 
      1 192.168.98.2
      1 192.168.98.8
      2 192.168.98.3
      1 192.168.98.9
      2 192.168.98.8
      1 192.168.98.0
      1 192.168.98.3

[root@zutuanxue ~]# uniq -c testuniq | sort
      1 192.168.98.0
      1 192.168.98.2
      1 192.168.98.3
      1 192.168.98.8
      1 192.168.98.9
      2 192.168.98.3
      2 192.168.98.8

-d	仅显示重复出现的行列。
[root@zutuanxue ~]# uniq -d testuniq 
192.168.98.3
192.168.98.8

-u	仅显示出一次的行列。
[root@zutuanxue ~]# uniq -u testuniq 
192.168.98.2
192.168.98.8
192.168.98.9
192.168.98.0
192.168.98.3
[root@zutuanxue ~]# uniq -u testuniq | sort
192.168.98.0
192.168.98.2
192.168.98.3
192.168.98.8
192.168.98.9
```

### 5.5、tree 以树状结构列出目录内容

```
-a 显示所有文件和目录,默认不显示隐藏文件
[root@zutuanxue ~]# tree -a

-C 在文件和目录清单加上色彩，便于区分各种类型。
[root@zutuanxue ~]# tree -C

-d 只显示目录。
[root@zutuanxue ~]# tree -d

-D 列出文件或目录的更改时间。
[root@zutuanxue ~]# tree -D
.
├── [Feb  4 15:07]  公共
├── [Feb  4 15:07]  模板

-f 在每个文件或目录之前，显示完整的路径名称。
[root@zutuanxue ~]# tree -f
.
├── ./公共
├── ./模板

-F 加上文件类型标记，在执行文件，目录，Socket，管道名称名称，各自加上"*","/","@","|"号。
[root@zutuanxue ~]# tree -F
.
├── 公共/
├── 模板/

-g -u 列出文件或目录的所属群组、主名称，没有对应的名称时，则显示群组、主的识别码。
[root@zutuanxue ~]# tree -g
.
├── [root    ]  公共
├── [root    ]  模板

-i 不以阶梯状列出文件或目录名称。
[root@zutuanxue ~]# tree -i
.
公共
模板
视频

-n 不在文件和目录清单加上色彩。
[root@zutuanxue ~]# tree -n
.
├── 公共
├── 模板

-p 列出权限标示。
[root@zutuanxue ~]# tree -p
.
├── [drwxr-xr-x]  公共
├── [drwxr-xr-x]  模板

-s 列出文件或目录大小。
[root@zutuanxue ~]# tree -s
.
├── [          6]  公共
├── [          6]  模板

-t 用文件和目录的更改时间排序。
[root@zutuanxue ~]# tree -t
.
├── anaconda-ks.cfg
├── initial-setup-ks.cfg
├── 公共

-u 列出文件或目录的拥有者名称，没有对应的名称时，则显示用户识别码。
[root@zutuanxue ~]# tree -u
.
├── [root    ]  公共
├── [root    ]  模板

-L 显示目录层数，数值为正整数
[root@zutuanxue ~]# tree -a -L 2
.
├── .cache
│   ├── dconf
│   ├── event-sound-cache.tdb.d5b6fe70a77f4945aa0999abdd33e686.x86_64-redhat-linux-gnu
│   ├── evolution
│   ├── gnome-shell
│   ├── gnome-software
```

### 5.6、xargs命令

xargs 是给命令传递参数的一个过滤器，也是组合多个命令的一个工具。用于一些不支持管道输入的命令如ls

**案例文件**

```
[root@zutuanxue ~]# cat xargtest 
a a a
b b b
c c c
d d d
e
f
g
h
i
j
k
l
```

**常用命令选项**

```
-n num 后面加列数
[root@zutuanxue ~]# cat xargtest | xargs -n 2
a a
a b
b b
c c
c d
d d
e f
g h
i j
k l
[root@zutuanxue ~]# cat xargtest | xargs
a a a b b b c c c d d d e f g h i j k l

-I	指定替换的字符串，并在后续的命令中用指定的字符串表示接收到的输入内容，并执行，可以用任意字符代替（不推荐有特殊含义的字符，如*等，如果使用请记得转意），一般为[]或{}
[root@zutuanxue ~]# mkdir testx
[root@zutuanxue ~]# find /var/ -name "*.log" | xargs  -I a cp a ./testx
[root@zutuanxue ~]# ls testx | wc -l
39

-i	类似-I，相当于固定就是使用{}来表示接收到的输入内容
[root@zutuanxue ~]# find /var/ -name "*.log" | xargs  -i cp {} ./testx
[root@zutuanxue ~]# ls testx | wc -l
39


-d 指定分隔符
[root@zutuanxue ~]# echo "a9b9c9d9" | xargs -d 9
a b c d 
```