## 概述

**什么是时间服务器**

NTP：Network Time Protocol 网络时间协议，用来同步网络中各主机的时间，在linux系统中早期使用ntp来实现，后来使用chrony来实现，Chrony 应用本身已经有几年了，其是是网络时间协议的 (NTP) 的另一种实现。

**Chrony可以同时做为ntp服务的客户端和服务端**

一直以来众多发行版里标配的都是ntpd对时服务，自rhel7/centos7 起，Chrony做为了发行版里的标配服务，不过老的ntpd服务依旧在rhel7/centos7里可以找到 。

**核心组件：**

chronyd：是守护进程，主要用于调整内核中运行的系统时间和时间服务器同步。它确定计算机增减时间的比率，并对此进行调整补偿。

chronyc：提供一个用户界面，用于监控性能并进行多样化的配置。它可以在chronyd实例控制的计算机上工作，也可以在一台不同的远程计算机上工作。

**优势**

chrony用来同步时间，来代替ntp服务，优点是很精巧的时间同步工具，更快响应时钟变化，在应对延时提供更好的稳定性能，不会出现时间空白，跨越互联网同步时间只需要几毫秒。

它的优势主要包括

```
#更快的同步：能在最大程度的减少时间和频率误差，这对于非全天运行的台式计算机或系统而言非常有用

#更快的响应速度：能够更好的响应时间频率的快速变化，这对于具备不稳定时钟的虚拟机或导致时钟频率发生变化的节能技术而言更有帮助

#稳定：在初始同步后，它并不会停止时钟，以防对需要系统时间的程序造成影响，以及可以更好的应对延迟
```

**相关文件说明**

/etc/chrony.conf 主配置文件

/usr/bin/chronyc 客户端程序工具

/usr/sbin/chronyd 服务端程序

**配置文件说明**

```
[root@zutuanxue ~]# vim /etc/chrony.conf
# Use public servers from the pool.ntp.org project.
# Please consider joining the pool (http://www.pool.ntp.org/join.html).
pool 2.centos.pool.ntp.org iburst
###指定时间服务器的地址，可以使用pool开始也可以使用server开始，iburst可以加速初始同步，perfer表示优先
# Record the rate at which the system clock gains/losses time.
driftfile /var/lib/chrony/drift
#用来记录时间差异，由于chrony是通过BIOS判断时间的，他会用这个时间与上层时间服务器进行对比，将差异记录下来
# Allow the system clock to be stepped in the first three updates
# if its offset is larger than 1 second.
makestep 1.0 3
#让chrony可以根据需求逐步进行时间的调整，避免在某些情况下时间差异较大，导致调整时间耗时过长，以上的设置表示在误差时间大于1.0秒的话，前三次使用update更新时间是使用step（分阶段）而不是slew(微调),如果最后一个值是负数的话，如-1则表示随时步进
# Enable kernel synchronization of the real-time clock (RTC).
rtcsync
#启用内核模式，在内核模式中，系统时间每11分钟会同步到实时时钟（RTC）
# Enable hardware timestamping on all interfaces that support it.
#hwtimestamp *
# 通过使用hwtimestamp指令启用硬件时间戳
# Increase the minimum number of selectable sources required to adjust
# the system clock.
#minsources 2

# Allow NTP client access from local network.
#allow 192.168.0.0/16
#允许同步的网段
# Serve time even if not synchronized to a time source.
#local stratum 10
#即时自己未能通过网络时间服务器同步时间，也允许将本地时间作为标准时间同步给其他客户端
# Specify file containing keys for NTP authentication.
keyfile /etc/chrony.keys
#验证的秘钥文件
# Get TAI-UTC offset and leap seconds from the system tz database.
leapsectz right/UTC
#从system tz数据库中获取TAI(国际原子时)和UTC（协调世界时）之间的时间偏移及闰秒
# Specify directory for log files.
logdir /var/log/chrony
#日志文件的位置
# Select which information is logged.
#log measurements statistics tracking
```

## 时间服务器实战

环境：两台主机，系统为CentOS8，IP地址为192.168.2.100,192.168.2.200,selinux和防火墙关闭

要求: 192.168.2.100为内网时间服务器，192.168.2.200为客户端，200的客户端的时间要与100的时间同步

```
在192.168.2.100主机上
step1	检查时间服务器上是否有相关软件包
[root@zutuanxue ~]# rpm -qa | grep chrony
chrony-3.3-3.el8.x86_64

step2	检查本机的时区
[root@zutuanxue ~]# timedatectl 
               Local time: 五 2020-01-17 17:36:14 CST
           Universal time: 五 2020-01-17 09:36:14 UTC
                 RTC time: 五 2020-01-17 09:36:56
                Time zone: Asia/Shanghai (CST, +0800)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
注：如果不是本地时区请设置时区
[root@zutuanxue ~]# timedatectl list-timezones | grep Shanghai
Asia/Shanghai
[root@zutuanxue ~]# timedatectl set-timezone Asia/Shanghai

step3	修改配置文件
[root@zutuanxue ~]# vim /etc/chrony.conf
server 192.168.2.100 iburst		#定义时间服务器的地址
driftfile /var/lib/chrony/drift	
makestep 1.0 3
rtcsync
allow 192.168.2.0/24	#定义允许谁来同步
local stratum 10	#允许将本地时间作为标准
leapsectz right/UTC	
logdir /var/log/chrony
bindaddress 192.168.2.100	#监听的网络接口

step4	启动服务&查看端口
[root@zutuanxue ~]# systemctl start chronyd
[root@zutuanxue ~]# lsof -i :123

在192.168.2.200主机上
step5	检查软件包
[root@slave ~]# rpm -qa | grep chrony
chrony-3.3-3.el8.x86_64

step6	检查并设置本机时区
[root@slave ~]# timedatectl 
               Local time: 五 2020-01-17 04:19:38 EST
           Universal time: 五 2020-01-17 09:19:38 UTC
                 RTC time: 五 2020-01-17 16:04:57
                Time zone: America/New_York (EST, -0500)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
[root@slave ~]# timedatectl list-timezones |grep Shanghai
Asia/Shanghai
[root@slave ~]# timedatectl set-time Asia/Shanghai

step7	修改配置文件
[root@zutuanxue ~]# vim /etc/chrony.conf
server 192.168.2.100 iburst
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
keyfile /etc/chrony.keys
leapsectz right/UTC
logdir /var/log/chrony

step8 启动服务&检查能否连接时间服务器
[root@slave ~]# systemctl start chronyd
[root@slave ~]# chronyc sources -v
210 Number of sources = 1

  .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
 / .- Source state '*' = current synced, '+' = combined , '-' = not combined,
| /   '?' = unreachable, 'x' = time may be in error, '~' = time too variable.
||                                                 .- xxxx [ yyyy ] +/- zzzz
||      Reachability register (octal) -.           |  xxxx = adjusted offset,
||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
||                                \     |          |  zzzz = estimated error.
||                                 |    |           \
MS Name/IP address         Stratum Poll Reach LastRx Last sample               
===============================================================================
^* 192.168.2.100                11   6   377    57    +13ms[ +278us] +/- 3718us

#可以在2.100上使用date -s命令修改时间，在2.200上重启服务，看到时间同步
chronyc命令

chronyc sources -v		查看时间同步源
chronyc sourcestats -v	查看时间同步源状态
timedatectl set-local-rtc 1	设置硬件时间硬件时间默认为UTC
timedatectl set-ntp yes	启用NTP时间同步：
chronyc tracking	校准时间服务器：
```