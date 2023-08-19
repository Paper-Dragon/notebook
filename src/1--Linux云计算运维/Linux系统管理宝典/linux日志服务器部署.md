## 集中式日志服务器介绍

如果你负责管理数台的 Linux，你得登录每一台Linux 后，才能阅读其中的信息！ 这样是不是很麻烦？？ 那有没有什么更好的方案呢？

Linux 的系统日志服务，允许你把信息传递到某一台 Linux 的系统日志服务中；那你就可以把一台 Linux 作为日志服务器 （*Log Server*），而其他的 Linux 则当作日志客户端。此时，在作为日志服务器中就可以保存所有日志客户端产生的信息，因此，你就可以在日志服务器中阅读信息，而不用登录到其他的主机了。

### **搭建流程**

#### 环境准备：

server：192.168.1.55

client：192.168.1.18

#### 关闭SELinux和防火墙

```
关闭SELinux
[root@zutuanxue ~]# vim /etc/sysconfig/selinux
SELINUX=disabled
[root@zutuanxue ~]# reboot

关闭防火墙
[root@zutuanxue ~]# systemctl stop firewalld
[root@zutuanxue ~]# systemctl disable firewalld
```

#### 流程

**setp 1 修改server端rsyslog服务配置文件**

```
server
[root@zutuanxue ~]# vim /etc/rsyslog.conf
开放通过UDP协议514端口接收日志信息功能
 19 module(load="imudp") 
 20 input(type="imudp" port="514")
开放通过TCP协议514端口接收日志信息功能
 24 module(load="imtcp")
 25 input(type="imtcp" port="514")
```


**step 2 重启server端rsyslog服务**

```
[root@zutuanxue ~]# systemctl restart rsyslog		#重启日志服务
[root@zutuanxue ~]# systemctl status rsyslog		#确认服务启动状态
```

**step 3 修改client端rsyslog服务配置文件**

```
client
[root@zutuanxue ~]# vim /etc/rsyslog.conf 
 67 *.*   			@192.168.1.55			
 #告知客户端将所有日志信息使用UDP协议传送到日志服务器，日志服务器的ip地址为192.168.1.55
 

 
 68 #*.*              @@192.168.1.55
 #也可以使用@@告诉客户端将所有日志信息使用TCP协议传送到日志服务器
```

**step 4 重启client端rsyslog服务**

```
[root@zutuanxue ~]# systemctl restart rsyslog		#重启日志服务
[root@zutuanxue ~]# systemctl status rsyslog		#查看服务状态
```

 **step 5 测试**

```
server端使用tail命令查看日志信息
[root@zutuanxue ~]# tail -f /var/log/messages 

client使用logger工具产生测试日志
[root@zutuanxue ~]# logger "this is a test from 192.168.1.18"

如果在server端能查看到logger工具产生的内容就证明集中式日志服务器搭建成功
Dec  6 21:18:21 localhost root[2519]: this is a test from 192.168.1.18


注：其它的client端的设置都是相同的，这样我们就可以将很多台linux主机的日志信息都收集到一台主机上，方便查阅和后期的日志备份
工作。
```