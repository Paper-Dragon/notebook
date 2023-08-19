## 一 Rsync概述

### 1.1、什么是Rsync

rsync是一款开源，快速，多功能的可实现增量的本地或远程的数据镜像同步备份的优秀工具。适用于多个平台。从软件名称可以看出来是远程同步的意思（remote sync）可实现全量备份与增量备份，因此非常适合用于架构集中式备份或异地备份等应用。

**官网：** http://rsync.samba.org/

**端口：** 873

**运行模式：** C/S B/S

### 1.2、rsync特性

1、支持拷贝特殊文件如链接文件、设备等

2、可以有排除指定文件或目录同步的功能，相当于tar的排除功能

3、可以做到保持原文件或目录的权限、时间、软硬链接、属主、组等所有属性均不改变

4、可以实现增量同步，即只同步发生变化的数据，因此数据传输效率很高

5、可以使用rcp，rsh，ssh等方式来配合传输文件（rsync本身不对数据加密）

6、可以通过socket（进程方式）传输文件和数据（服务端和客户端）。

7、支持匿名的或认证（无须系统用户）的进程模式传输，可实现方便安全的进行数据备份及镜像

### 1.3、传输方式

**拉复制(下载)：** rsync备份服务器定期去所有主机上拉取数据

![image20200116202338681.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603525992068.png)

**推复制（上传）：** 所有主服务器将本地数据推送至从服务器

![image20200116202157436.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603526014361.png)

在日常使用中，这两种形式都是混合使用的如：

**大量数据备份**

![image20200116202528449.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603526031950.png)

**异地备份**

![image20200116202556118.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603526050140.png)

## 二 rsync拉复制实战

**环境：**

- 两台主机，IP地址为192.168.11.16，192.168.11.100
- 操作系统为CentOS8
- 关闭selinux和防火墙

**需求：** 希望192.168.11.100这台主机/cache目录的数据与192.168.11.16这台主机/cache目录中的数据保持一致

```
step1	在192.168.11.16这台主机上制作rsync服务
[root@zutuanxue ~]# rpm -qa | grep rsync
rsync-3.1.3-4.el8.x86_64
#检查是或否安装的相关软件包
[root@zutuanxue ~]# mkdir /etc/rsyncd
[root@zutuanxue ~]# vim rsyncd.conf
uid=root			#定义以哪个用户的身份启动进程	
gid=root			#定义以哪个组的身份启动进程
port=873			#此服务默认端口873
max connections=0		#最大连接数（正整数），0代表不限制。
log file=/var/log/rsyncd.log	#定义日志文件位置
pid file=/var/run/rsyncd.pid	#定义pid文件位置
lock file=/var/run/rsyncd.lock	#定义锁定文件位置，避免多开
motd file=/etc/rsyncd/rsyncd.motd	#定义欢迎信息
read only=yes		#权限为只读
hosts allow=192.168.11.0/24		#允许的网段
hosts deny=*						#拒绝所有，允许个别
[www]	#定义共享名称为www
path=/cache				#路径
list=yes					#允许别人看到
ignore errors			#忽略错误
auth users=hello		#授权的账号
secrets file=/etc/rsyncd/rsyncd.secrets	#密码文件

setp2	建立欢迎信息文件，内容随意
[root@zutuanxue ~]# vim /etc/rsyncd/rsyncd.motd


step3	建立密码文件
[root@zutuanxue ~]# vim /etc/rsyncd/rsyncd.secrets
hello：123456
[root@zutuanxue ~]# chmod 600 rsyncd.secrets

step4	建立cache目录和文件
[root@zutuanxue ~]# mkdir /cache
[root@zutuanxue ~]# touch /cache/file{1..10}

step5启动服务
[root@zutuanxue ~]# rsync	--daemon		--config=/etc/rsyncd/rsyncd.conf
[root@zutuanxue ~]# lsof	-i	:873

step6	在192.168.11.100上建立密码文件并修改权限
[root@slave ~]# vim /etc/rsync.pw
123456
[root@slave ~]# chmod 600 /etc/rsync.pw
[root@slave ~]#	mkdir /cache
step7	同步测试
[root@slave ~]#	rsync -avzP	--delete --password-file=/etc/rsync.pw hello@192.168.11.16::www /cache 

rsync参数
-a	归档模式传输，相当于-rlptgoD一起使用
-v	详细模式输出
-z	传输时进行压缩以提高效率
-r	递归传输目录及子目录，即目录下得所有目录都同样传输
-t	保持文件时间信息
-o	保持文件属主信息
-p	保持文件权限
-g	保持文件属组信息
-l 	保留软连接
-P	显示同步的过程及传输时的进度等信息
-D	保持设备文件信息
-L	保留软连接指向的目标文件
--exclude=PATTERN	指定排除不需要传输的文件模式
--bwlimit=1m	限速传输
--delete	让目标目录和源目录数据保持一致
--password-file	指定密码文件位置

step8	定义计划任务
[root@slave ~]#	crontab -e
* * * * * rsync -avzP	--delete --password-file=/etc/rsync.pw hello@192.168.11.16::www /cache

step9	将11.16主机上文件进行调整，观察是否改变
```

## 三 Rsync推复制

**环境：**

- 两台主机，IP地址为192.168.11.16，192.168.11.100
- 操作系统为CentOS8
- 关闭selinux和防火墙

**需求：** 希望192.168.11.100这台主机/cache目录的数据与192.168.11.16这台主机/cache目录中的数据保持一致

```
注：停止192.168.11.16主机上的rsync服务
step1	在192.168.11.100这台主机上制作rsync服务
[root@slave ~]# rpm -qa | grep rsync
rsync-3.1.3-4.el8.x86_64
#检查是或否安装的相关软件包
[root@slave ~]# mkdir /etc/rsyncd
[root@slave ~]# vim rsyncd.conf
uid=root			#定义以哪个用户的身份启动进程	
gid=root			#定义以哪个组的身份启动进程
port=873			#此服务默认端口873
max connections=0		#最大连接数（正整数），0代表不限制。
log file=/var/log/rsyncd.log	#定义日志文件位置
pid file=/var/run/rsyncd.pid	#定义pid文件位置
lock file=/var/run/rsyncd.lock	#定义锁定文件位置，避免多开
motd file=/etc/rsyncd/rsyncd.motd	#定义欢迎信息
read only=no		#权限为不只读（可写）
hosts allow=192.168.11.0/24		#允许的网段
hosts deny=*						#拒绝所有，允许个别
[www]	#定义共享名称为www
path=/cache				#路径
list=yes					#允许别人看到
ignore errors			#忽略错误
auth users=hello		#授权的账号
secrets file=/etc/rsyncd/rsyncd.secrets	#密码文件

setp2	建立欢迎信息文件，内容随意
[root@slave ~]# vim /etc/rsyncd/rsyncd.motd


step3	建立密码文件
[root@slave ~]# vim /etc/rsyncd/rsyncd.secrets
hello：123456
[root@slave ~]# chmod 600 rsyncd.secrets

step4	建立cache目录
[root@slave ~]# mkdir /cache


step5启动服务
[root@slave ~]# rsync	--daemon		--config=/etc/rsyncd/rsyncd.conf
[root@slave ~]# lsof	-i	:873

step6	在192.168.11.16上安装监控软件
[root@zutuanxue ~]# tar fx sersync2.5_32bit_binary_stable_final.tar.gz -C /usr/src/
[root@zutuanxue ~]# cd /usr/src/GNU-Linux-x86/

step7	配置监控软件
[root@zutuanxue ~]# vim confxml.xml 
<sersync>
        <localpath watch="/cache">
            <remote ip="192.168.11.100" name="www"/>
						.
						.
						.
					<rsync>
            <commonParams params="-artuz"/>
            <auth start="true" users="hello" passwordfile="/etc/rsync.pw"/>

[root@zutuanxue ~]# vim /etc/rsync.pw
123456
[root@zutuanxue ~]# chmod 600 rsync.pw 

step8	启动监控软件
[root@zutuanxue ~]# ./sersync2	-r	#第一次启动加-r 可以查看到工作流程

step9	重新打开一个终端，在192.168.11.16上建立、删除文件，去192.168.11.100上查看是否同步成功
```