## 一、日志服务的介绍

### 日志介绍

程序执行的时候，可以通过标准输出（stdout, Standard Output）与标准错误输出 （stderr, Standard Error Output）来输送信息，用户就可以了解该程序执行时发生了什么状况；可是对于在后台执行的服务器程序，或者Linux 内核本身来说，就没有办法这样做了。服务与内核启动后，会切断与终端机（Terminal） 或控制台（Console）的联机，如此一来，即使有信息通过标准输出、标准错误输出传送出去，用户也未必能从屏幕上看到信息。

更何况，用户根本不可能全天候在计算机前面，盯着屏幕上显示的信息啊！为了让 管理者可以随时监控服务所产生的信息，Linux 提供了一个日志服务，该服务可以收集（Collect）任何服务传递过来的信息，储存成为记录文件（Log File） 、或直接传送给某些用户，甚至也可以传送到其他计算机的系统日志服务。

### 日志的作用

**系统方面的问题**

linux系统长时间运行，可能会出现一些软件，硬件方面的问题，这些问题都会记录到日志文件中，我们可以通过查看相应的日志文件，找出问题所在

**网络服务的问题**

网络服务在运行过程中产生的信息都会记录到日志文件中，一旦服务出现问题，无法正常运行，我们可以通过查看相应的日志文件就知道服务出现了什么问题

**历史事件查询**

由于日志服务每天都会将系统运行的信息保存到日志文件当中，所以我们也可以通过日志信息去追溯之前的系统运行状况

## 二、相关软件包和文件

### 软件包

```
[root@zutuanxue ~]# rpm -qa | grep rsyslog
rsyslog-gssapi-8.37.0-9.el8.x86_64
rsyslog-relp-8.37.0-9.el8.x86_64
rsyslog-8.37.0-9.el8.x86_64
rsyslog-gnutls-8.37.0-9.el8.x86_64
```

### 相关文件

```
配置文件：/etc/rsyslog.conf

辅助配置文件：/etc/rsyslog.d/*.conf

日志文件存放位置：	/var/log/

执行文件：/usr/sbin/rsyslogd

模块路径：/usr/lib64/rsyslog/

服务单元：/usr/lib/systemd/system/rsyslog.service
```

## 三、配置文件说明

### /etc/rsyslog.conf

```
[root@zutuanxue yum.repos.d]# grep '####' /etc/rsyslog.conf 
#### MODULES ####定义模块
#### GLOBAL DIRECTIVES ####定义全局环境
#### RULES ####	定义规则


模块定义
module(load="imuxsock"    # 提供对本地系统日志的支持
       SysSock.Use="off") # 关闭通过本地日志接口的信息接收功能，日志信息接收通过下面的imjournal模块
module(load="imjournal"             # 提供对systemd日志的访问
       StateFile="imjournal.state") # 定义状态文件，rsyslog用于记录文件上传进度，避免日志内容混乱


全局环境设置
# 定义工作目录
global(workDirectory="/var/lib/rsyslog")

# 使用默认的时间戳格式
module(load="builtin:omfile" Template="RSYSLOG_TraditionalFileFormat")

# 定义辅助配置文件位置
include(file="/etc/rsyslog.d/*.conf" mode="optional")

规则设置
信息来源.安全级别	 处理方式

信息来源
 	 kern：内核相关的日志
 	 user：用户相关的日志
        mail：邮件相关的日志
        daemon：系统服务相关的日志
        lpr： 打印相关的日志
        cron：计划任务相关的日志
        authpriv:认证相关的日志
        news：新闻相关的日志
        uucp：文件copy相关的日志
        local0-local7：自定义相关的日志信息
	*：		所有
安全级别
       debug:  调试
	info:   消息
	notice: 注意
    	warn,warning: 警告
	err,error: 错误
	crit: 严重级别
	alert: 需要立即修改该的信息
	emerg,panic: 内核崩溃，系统接近崩溃
	*：所有日志级别
       	none:没有任何级别，也就是不记录日志信息

表达形式
mail.err		err+crit+alert+emerg
mail.=err		err
mail.!err		除了err

处理方式
/PATH/FILENAME：将信息储存至 /PATH/FILENAME文件中。注意，如果要系统日志服务把信息储存到文件，该文件必须以
斜线（/） 开头的绝对路径命名之。
USERNAME：将信息送给已登录的用户。
@HOSTNAME：代表使用udp协议将信息转送到远端的日志服务器。
@@hostname：代表使用tcp协议将信息传送到远端的日志服务器
*：将信息传送给所有已登录的用户。
```

### 常见的日志文件及作用

/var/log/boot.log 系统启动时的日志。

/var/log/dnf.* dnf软件包管理器相关日志

/var/log/firewalld 防火墙日志

/var/log/lastlog 所有用户最后一次登录信息,需要使用lastlog命令查看

/var/log/maillog 电子邮件系统相关日志

/var/log/messages 整体的系统日志，具体记录范围取决于服务的配置文件

/var/log/wtmp 记录当前登录和过去登录的用户信息，使用last命令查看

### 日志文件的安全设置

```
[root@zutuanxue ~]# chattr +a /var/log/messages 
[root@zutuanxue ~]# lsattr /var/log/messages 
-----a------------ /var/log/messages
```

### 日志的格式

```
[root@zutuanxue ~]# tail /var/log/messages 
Dec  6 03:29:09 localhost systemd[1]: Started PackageKit Daemon.
Dec  6 03:43:44 localhost systemd[1]: Starting dnf makecache...
Dec  6 03:43:44 localhost dnf[7594]: 元数据缓存近期已刷新。
Dec  6 03:43:44 localhost systemd[1]: Started dnf makecache.


DATE  TIME  HOSTNAME  APP（NAME）[PID]: MESSAGES

每一个字段的意义如下说明：
DATE：信息发生的日期。
TIME：信息发生的时间。
HOSTNAME：信息发生的主机。
APP：产生信息的软件。
NAME：软件的名称，或是软件组件（Component）的名称。可以省略。
PID：进程标识符 （Process ID）。可以省略。
MESSAGES：信息的内容。 
```

## 四、日志切割

**日志切割介绍**

随着系统时间使用的增长，日志文件的体积会越来越大，过大的日志文件对于查看或者备份来讲都是极为不便的。所以linux系统提供了一个日志切割工具，这个工具就是logrotate，用户可以用过这个工具对日志文件进行切割，系统也利用这个工具配合计划任务服务，定期的对系统日志进行切割。

**相关文件**

```
/etc/logrotate.conf	主配置文件，定义日志切割规则
/etc/logrotate.d/	辅助配置文件，可以让用户针对不类型的信息，定义不同的切割规则
```

**主配置文件说明**

```
[root@zutuanxue ~]# vim /etc/logrotate.conf 
weekly	#定义切割周期为每周一次
rotate 4 #默认保留四个文件
create	 #切割完成后，建立一个新的文件继续存储日志信息
dateext	#定义切割后的文件名中要包含日期信息
include /etc/logrotate.d #辅助配置文件的存放位置
```

**辅助配置文件说明**

```
格式
日志文件的名称(绝对路径)	{
	额外的设置
}


[root@zutuanxue ~]# vim /etc/logrotate.d/syslog 
/var/log/cron
/var/log/maillog
/var/log/messages
/var/log/secure
/var/log/spooler
{
    missingok	 #如果文件丢失，转到下一个文件，不报告错误信息
    sharedscripts #定义执行的脚本，需要与endscript结合使用
    postrotate	#定义执行完logrotate操作之后，执行的操作
		/usr/bin/systemctl kill -s HUP rsyslog.service >/dev/null 2>&1 || true #重启日志服务
    endscript	#定义执行的脚本，需要sharedscripts结合使用。
}
```

**logrotate**

```
[root@zutuanxue ~]# logrotate -vf /etc/logrotate.conf 
#参数说明 
v	 显示详细信息
f	 强制切割

[root@zutuanxue ~]# logrotate -vf /etc/logrotate.conf
[root@zutuanxue log]# cd /var/log/
[root@zutuanxue log]# ls
secure-20191206		boot.log-20191206		maillog-20191206
btmp-20191206			messages-20191206		spooler-20191206
wtmp-20191206			cron-20191206
```

**系统如何使用logrotate**

```
linux系统通过计划任务去定期的执行切割动作
[root@zutuanxue ~]# cat /etc/cron.daily/logrotate
#!/bin/sh

/usr/sbin/logrotate /etc/logrotate.conf
EXITVALUE=$?
if [ $EXITVALUE != 0 ]; then
    /usr/bin/logger -t logrotate "ALERT exited abnormally with [$EXITVALUE]"
fi
exit $EXITVALUE
此文件定义了如果切割的操作执行成功的话，会调用logger命令记录一条标签为logrotate的日志信息到日志文件里
```

## 五、systemd-journald.service

很早之前，日志信息是需要等到开机完成并启动日志服务之后才会开始记录的，这种方式会导致开机过程中的信息无法记录，为了避免这种情况，内核用一个叫klogd的服务来记录开机过程中产生的日志信息，然后等到日志服务启动完再将这些信息交给日志服务。

 现在linux系统采用systemd来管理系统服务，而systemd又是第一个启动的服务，所以现在我们通过一个systemd自带的，名字叫systemd-journald的服务来协助记录日志信息。那是不是就意味着我们可以不使用rsyslog这个服务了呢？不能，因为systemd-journald服务使用内存来记录相关日志信息，断电之后内容消失，所以我们不能停止rsyslog服务，而且rsyslog服务有一个很重要的功能，可以对日志内容进行分类。

 **journalctl命令**

```
systemd-journald提供了一个叫journalctl的工具用来查询它所记录的信息
[root@zutuanxue ~]# journalctl 
 -n		显示最后的几行内容，默认为10行
 -r		倒序输出，最新的日志先输出
 -S/--since	开始的时间
 -U/--until	结束的时间
 -p		指定日志等级0-7，（0=emerg，1=alert，2=crit，3=err，4=warninig，5=notice，6=info，7=debug）如：4代表的就是0-4
-f		持续输出，类似于tail的-f	使用ctrl+c结束
--disk-usage	磁盘空间占用
-u		指定单元，如 -u crond.service
--vacuum-size	释放日志文件占用的空间，如	--vacuum-size 1G
_PID=0		查看指定PID的信息
_UID=0		查看指定UID的信息
		
[root@zutuanxue ~]# journalctl --since "YYYY-MM-DD 00:00:00" --until "YYYY-MM-DD 00:00:00"
[root@zutuanxue ~]# journalctl --since today
[root@zutuanxue ~]# journalctl --since yesterday --until today
[root@zutuanxue ~]# journalctl -u crond.service
[root@zutuanxue ~]# journalctl _SYSTEM_UNIT=crond.service
```

## 六、日志分析工具

虽然我们有相关的工具来查看日志信息，但是如果信息量过大的话查看起来也是比较费时的，所以linux系统给我们提供了一个日志分析工具，这个工具叫logwatch，它会每天分析日志信息，并将信息通过邮件的形式发送给root用户

**安装logwatch及相关软件包**

```
[root@zutuanxue ~]# dnf install logwatch -y
[root@zutuanxue ~]# dnf install sendmail -y
[root@zutuanxue ~]# systemctl start sendmail
[root@zutuanxue ~]# ll /etc/cron.daily/0logwatch 
-rwxr-xr-x 1 root root 434 5月  11 2019 /etc/cron.daily/0logwatch
[root@zutuanxue ~]# /etc/cron.daily/0logwatch 
[root@zutuanxue ~]# mail
Heirloom Mail version 12.5 7/5/10.  Type ? for help.
"/var/spool/mail/root": 2 messages 1 new
1 logwatch@zutuanxue.l Sat Dec 7 01:50 57/2011 "Logwatch for localhos"
>N 2 logwatch@zutuanxue.l Sat Dec 7 01:52 56/2000 "Logwatch for localhos"
输入数字查看对应的邮件，输入q退出
```