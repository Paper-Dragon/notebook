## 一、编程语言介绍

编程语言是指计算机能理解的语言，人类通过使用计算机语言可以给计算机批量下达任务，让其按照人类的思想去完成工作。最常见的语言有：汇编语言、C语言、java语言、php语言、Python语言、golang语言等等。

编程语言分类：

- 编译型语言
	程序在执行之前需要一个专门的编译过程，把程序编译成为机器语言文件，运行时不需要重新翻译，直接使用编译的结果就行了。程序执行效率高，依赖编译器，跨平台性差些。如C、C++、java
- 解释型语言
	程序不需要编译，程序在运行时由解释器翻译成机器语言，每执行一次都要翻译一次。因此效率比较低。比如Python/JavaScript/ Perl /ruby/Shell等都是解释型语言。

## 二、shell介绍

shell在计算机中起到什么作用呢？为什么要求shell呢，我们可以看看计算机操作系统的组成：

![OS分层.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/14/1600050867343.png)

看图之前问大家个问题，两个人在电话聊天：只会说法语的法国人，只会说汉语的你。如何沟通呢？

请个翻译在你两中间

同理，系统内核只知道二进制

如果你想给计算机内核下任务，让其驱动硬件干活，那么有两种选择

1、你学会二进制

2、找个翻译

### 1、shell介绍

shell就是我们找来的翻译

shell是一个程序，采用C语言编写，是用户和linux内核沟通的桥梁。它既是一种命令语言，又是一种解释性的编程语言。通过一个图表来查看一下shell的作用。

![00_shell.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/14/1600050927043.png)

### 2、bash shell基本特性

知己知彼方可百战百胜，如何应用Bash shell，我们先看看他的特性，有助于我们快速应用。

2.1、 命令和文件自动补全

Tab只能补全命令和文件 （RHEL6/Centos6）

2.2、 常见的快捷键—提升操作熟练度

```
^c    终止前台运行的程序
^z    将前台运行的程序挂起到后台
^d    退出 等价exit
^l    清屏 
^a |home   光标移到命令行的最前端
^e |end   光标移到命令行的后端
^u    删除光标前所有字符
^k    删除光标后所有字符
^r   搜索历史命令
```

### 3、shell脚本介绍

shell脚本是什么

简单来说就是将需要完成某个任务所执行的命令按照执行顺序保存到文本中，并给予执行权限。

```
                                                 shell脚本精髓 学会60%
```

按照顺序执行。

它是解释型的，意味着不需要编译。

准确来说

若干命令 + 脚本的基本格式 + 脚本特定语法 + 思想= shell脚本

```
脚本命令演示
创建一个用户：harry     useradd harry
密码设置为:yunwei.98989 echo "yunwei.98989"|passwd --stdin harry
该用户创建文件夹/tmp/zutuanxue   mkdir /tmp/zutuanxue
该用户创建文件/tmp/zutuanxue/README  touch /tmp/zutuanxue/README
将“hello world“输入到/tmp/zutuanxue/README  echo 'hello world' > /tmp/zutuanxue/README

实现代码 01_task.sh
#!/bin/bash

#DESC: this is a test script 
#AUTHOR: Bai Shuming
#RELEASE: 1.0

#main 

#创建用户harry
useradd harry

#设置用户密码 yunwei.98989
echo "yunwei.98989"|passwd --stdin harry


#使用harry创建文件夹，文件，输入文件中内容
su - harry -c "mkdir /tmp/zutuanxue"
su - harry -c "touch /tmp/zutuanxue/README"
su - harry -c "echo 'hello world' > /tmp/zutuanxue/README"
```

什么时候用到脚本？

重复化、复杂化的工作，通过把工作的命令写成脚本，以后仅仅需要执行脚本就能完成这些工作。

①自动化分析处理

②自动化备份

③自动化批量部署安装

④等等…

如何学习shell脚本？

尽可能记忆更多的命令

掌握脚本的标准的格式（指定魔法字节、使用标准的执行方式运行脚本）

必须熟悉掌握脚本的基本语法（重点)

学习脚本的秘诀：

多看（看懂）——>多模仿（多练）——>多思考

### 4、shell脚本语法

来吧，光说不练嘴把式，我们来看看如何书写一个脚本呢，写好一个脚本有哪些规范呢？

- shell脚本组成

![shell程序组成.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/14/1600051087772.png)

- 脚本命名
	nginx_install.sh 脚本名称 脚本扩展名 .sh
	名字不要太长 26个字节内
- 代码规范：

```
1、#!/bin/bash
//脚本第一行， #！魔法字符，指定脚本代码执行的程序。即它告诉系统这个脚本需要什么解释器来执行，也就是使用
哪一种Shell

2、#代表注释，#！特例 

3、//以下内容是对脚本的基本信息的描述,大家可以根据实际情况尽可能的写详细一些，方便后续使用者
# Name: 脚本名字
# Desc:描述describe
# Path:存放路径
# Usage:用法
# Update:更新时间
# Author:作者
# Release: 分发版本

//下面就是脚本的具体内容
commands
...
```

- 脚本执行方法：
	– 标准脚本执行方法（建议）：

```
[root@zutuanxue shell01]# cat 1.sh 
#!/bin/bash
#xxxx
#xxx
#xxx
hostname
date
[root@zutuanxue shell01]# chmod +x 1.sh 
[root@zutuanxue shell01]# ll
total 4
-rwxr-xr-x 1 root root 42 Jul 22 14:40 1.sh
[root@zutuanxueshell01]# /shell/shell01/1.sh 
zutuanxue
Sun Jul 22 14:41:00 CST 2018
[root@zutuanxue shell01]# ./1.sh 
zutuanxue
Sun Jul 22 14:41:30 CST 2018
```

– 非标准的执行方法（不建议）：

```
[root@zutuanxue shell01]# bash 1.sh 
zutuanxue
Sun Jul 22 14:42:51 CST 2018
[root@zutuanxue shell01]# sh 1.sh
zutuanxue
Sun Jul 22 14:43:01 CST 2018
[root@zutuanxue shell01]# 
[root@zutuanxue shell01]# bash -x 1.sh
+ hostname
zutuanxue
+ date
Sun Jul 22 14:43:20 CST 2018

-x:一般用于排错，查看脚本的执行过程
-n:用来查看脚本的语法是否有问题

注意：如果脚本没有加可执行权限，不能使用标准的执行方法执行，bash 1.sh

其他：
[root@zutuanxueshell01]# source 2.sh
server
Thu Nov 22 15:45:50 CST 2018
[root@zutuanxue shell01]# . 2.sh
server
Thu Nov 22 15:46:07 CST 2018

source 和 . 表示读取文件，执行文件里的命令
```

– 命令式脚本执行方法：

```
定义命令路径变量  PATH
PATH=$PATH:脚本路径

备注：脚本必须给执行权限
```