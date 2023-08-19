## systemctl命令

### 管理服务

我们一起来看一下在服务管理方面systemctl这个工具如何使用

```
[root@zutuanxue ~]# systemctl start servername
start            	启动服务
stop             	停止服务
restart          	重启服务(没启动的服务会启动)
try-restart		只重启正在运行的服务(没有运行则不启动)
reload          	重载配置文件(修改完服务的配置文件后使用)
status         	 	检查服务状态
is-active        	检查服务是否已经启动
enable          	设置服务开机时启动
disable          	设置服务开机时不启动
is-enabled       	查看服务是否开机自动启动
mask		        屏蔽一个服务
unmask		        取消屏蔽


[root@zutuanxue ~]# systemctl status httpd
● httpd.service - The Apache HTTP Server		服务名称
   Loaded: loaded	加载到内存中；error加载失败；bad-setting无法理解单元配置文件中的设置；masked被屏蔽	 	(/usr/lib/systemd/system/httpd.service; disabled; vendor preset: disabled) 服务开机时是否启动 enabled为启动；disabled为不启动
   Active: active (running) since Mon 2019-11-18 15:56:46 CST; 1h 11min ago		服务当前的状态，active(running)为运行；active(exited)运行一次就退出了；active(waiting)运行中，但是再等待其它程序结束才能继续；inactive(dead)为没有运行；activating为启动中，deactivating停止中；failed启动失败
     Docs: man:httpd.service(8)	服务的帮助文档	
 Main PID: 57779 (httpd)	服务的主进程号
   Status: "Running, listening on: port 80" 额外的状态信息
    Tasks: 213 (limit: 24882) 任务数量，含进程+线程
   Memory: 22.4M		当前占用的内存
   CGroup: /system.slice/httpd.service
           ├─57779 /usr/sbin/httpd -DFOREGROUND
           ├─57780 /usr/sbin/httpd -DFOREGROUND
           ├─57781 /usr/sbin/httpd -DFOREGROUND
           ├─57782 /usr/sbin/httpd -DFOREGROUND
           └─57783 /usr/sbin/httpd -DFOREGROUND
		Control Groups额外信息
11月 18 15:56:46 localhost.localdomain systemd[1]: Starting The Apache HTTP Server...
11月 18 15:56:46 localhost.localdomain httpd[57779]: AH00558: httpd: Could not reliably determ>
11月 18 15:56:46 localhost.localdomain httpd[57779]: Server configured, listening on: port 80
11月 18 15:56:46 localhost.localdomain systemd[1]: Started The Apache HTTP Server.


例：
[root@zutuanxue ~]# systemctl is-active atd	
inactive
[root@zutuanxue ~]# systemctl start atd
[root@zutuanxue ~]# systemctl status atd
● atd.service - Job spooling tools
   Loaded: loaded (/usr/lib/systemd/system/atd.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2019-11-18 18:36:26 CST; 7s ago
 Main PID: 60620 (atd)
    Tasks: 1 (limit: 24882)
   Memory: 504.0K
   CGroup: /system.slice/atd.service
           └─60620 /usr/sbin/atd -f

11月 18 18:36:26 localhost.localdomain systemd[1]: Started Job spooling tools.
[root@zutuanxue ~]# systemctl stop atd
[root@zutuanxue ~]# systemctl status atd
● atd.service - Job spooling tools
   Loaded: loaded (/usr/lib/systemd/system/atd.service; enabled; vendor preset: enabled)
   Active: inactive (dead) since Mon 2019-11-18 18:36:43 CST; 6s ago
  Process: 60620 ExecStart=/usr/sbin/atd -f $OPTS (code=exited, status=0/SUCCESS)
 Main PID: 60620 (code=exited, status=0/SUCCESS)

11月 18 18:36:26 localhost.localdomain systemd[1]: Started Job spooling tools.
11月 18 18:36:43 localhost.localdomain systemd[1]: Stopping Job spooling tools...
11月 18 18:36:43 localhost.localdomain systemd[1]: Stopped Job spooling tools.
[root@zutuanxue ~]# systemctl is-enabled atd
enabled
[root@zutuanxue ~]# systemctl disable atd
Removed /etc/systemd/system/multi-user.target.wants/atd.service.
[root@zutuanxue ~]# systemctl is-enabled atd
disabled
[root@zutuanxue ~]# systemctl enable atd
Created symlink /etc/systemd/system/multi-user.target.wants/atd.service → /usr/lib/systemd/system/atd.service.
[root@zutuanxue ~]# systemctl is-enabled atd
enabled

[root@zutuanxue ~]# systemctl stop atd
[root@zutuanxue ~]# systemctl mask atd
Created symlink /etc/systemd/system/atd.service → /dev/null.
[root@zutuanxue ~]# systemctl status atd
● atd.service
   Loaded: masked (Reason: Unit atd.service is masked.)
   Active: inactive (dead)

11月 05 18:12:41 localhost.localdomain systemd[1]: Started Job spooling tools.
11月 18 18:34:15 localhost.localdomain systemd[1]: Stopping Job spooling tools...
11月 18 18:34:15 localhost.localdomain systemd[1]: Stopped Job spooling tools.
11月 18 18:36:26 localhost.localdomain systemd[1]: Started Job spooling tools.
11月 18 18:36:43 localhost.localdomain systemd[1]: Stopping Job spooling tools...
11月 18 18:36:43 localhost.localdomain systemd[1]: Stopped Job spooling tools.
[root@zutuanxue ~]# systemctl unmask atd
Removed /etc/systemd/system/atd.service.
[root@zutuanxue ~]# systemctl status atd
● atd.service - Job spooling tools
   Loaded: loaded (/usr/lib/systemd/system/atd.service; enabled; vendor preset: enabled)
   Active: inactive (dead)

11月 05 18:12:41 localhost.localdomain systemd[1]: Started Job spooling tools.
11月 18 18:34:15 localhost.localdomain systemd[1]: Stopping Job spooling tools...
11月 18 18:34:15 localhost.localdomain systemd[1]: Stopped Job spooling tools.
11月 18 18:36:26 localhost.localdomain systemd[1]: Started Job spooling tools.
11月 18 18:36:43 localhost.localdomain systemd[1]: Stopping Job spooling tools...
11月 18 18:36:43 localhost.localdomain systemd[1]: Stopped Job spooling tools
```

### 查看服务

```
[root@zutuanxue ~]#systemctl command --type=xxx --all
list-units				查看所有加载到内存中的单元				
list-unit-files	查看系统中所有安装的单元文件（存放在/usr/lib/systemd/system）的启用状态
--type=xxx			单元类型
--all						列出系统中所有加载的，不管状态为何
[root@zutuanxue ~]# systemctl 
UNIT	LOAD   ACTIVE SUB       DESCRIPTION                                                      
sys.. loaded active plugged 	/sys.....
sys.. loaded active plugged   /sys.....
sys.. loaded active plugged   /sys.....
sys.. loaded active plugged   /sys.....
sys.. loaded active plugged   /sys.....
sys.. loaded active plugged   /sys.....

UNIT：	单元名称
LOAD：	是否被加载
ACTIVE：	高优先级单元状态，与SUB结合就是使用status查看的状态
SUB：	低优先级单元状态		
DESCRIPTION：简介

[root@zutuanxue ~]# systemctl list-unit-files 
UNIT	FILE					STATE    
proc...     				static 
-.mount							generated
boot.mount					generated
dev-hugepages.mount	static   
dev-mqueue.mount	  static   
proc-fs-nfsd.mount	static   
proc-...            static   
sys-f...            static   
sys-...						  static   
sys-ke..            static   
tmp.mount						static   
var-lib..						static   
var-lib..						static   
cups.path..					enabled  
systemd..						static

查看指定类型的服务
[root@zutuanxue ~]# systemctl --type target --all
  UNIT                      LOAD      ACTIVE   SUB    DESCRIPTION                  
  basic.target              loaded    active   active Basic System                 
  bluetooth.target          loaded    active   active Bluetooth                    
  cryptsetup.target         loaded    active   active Local...      
● dbus.target               not-found inactive dead   dbus.target                  
[root@zutuanxue ~]# systemctl --type=target --all
  UNIT                      LOAD      ACTIVE   SUB    DESCRIPTION                  
  basic.target              loaded    active   active Basic System                 
  bluetooth.target          loaded    active   active Bluetooth                    
  cryptsetup.target         loaded    active   active Local...
● dbus.target               not-found inactive dead   dbus.target
[root@zutuanxue ~]# systemctl list-units --type=target --all
  UNIT                      LOAD      ACTIVE   SUB    DESCRIPTION                  
  basic.target              loaded    active   active Basic System                 
  bluetooth.target          loaded    active   active Bluetooth                    
  cryptsetup.target         loaded    active   active Local...
● dbus.target               not-found inactive dead   dbus.target                  

使用systemctl切换运行级别
[root@zutuanxue ~]# systemctl list-units --type target --all
  UNIT                   LOAD      ACTIVE   SUB    DESCRIPTION                  
  basic.target           loaded    active   active Basic System                 
  bluetooth.target       loaded    inactive dead   Bluetooth                    
  cryptsetup.target      loaded    active   active Local ..
● dbus.target            not-found inactive dead   dbus.target                  
  emergency.target       loaded    inactive dead   Emergency Mode               
  getty-pre.target       loaded    inactive dead   Login..
  getty.target           loaded    active   active Login Prompts                
  graphical.target       loaded    inactive dead   Graphica..Interface          
常用的target
graphical.target：图形模式
multi-user.target：字符模式
rescue.target：救援模式
emergency.target：紧急模式，无法进入到救援模式时使用
shutdown.target：关机

[root@zutuanxue ~]# systemctl get-default	查看默认运行级别
graphical.target     
[root@zutuanxue ~]# systemctl set-default multi-user.target	设置 
Removed /etc/systemd/system/default.target.
Created symlink /etc/systemd/system/default.target → /usr/lib/systemd/system/multi-user.target.
[root@zutuanxue ~]# systemctl isolate multi-user.target 切换


除了可以使用上述方法设置和查看之外 系统还给我们提供了几个简单的命令，方便操作
[root@zutuanxue ~]# systemctl poweroff		关机
[root@zutuanxue ~]# systemctl reboot			重启
[root@zutuanxue ~]# systemctl suspend			挂起
[root@zutuanxue ~]# systemctl hibernate		休眠
[root@zutuanxue ~]# systemctl rescue			进入到救援模式
[root@zutuanxue ~]# systemctl emergency		进入到紧急模式


查看服务之间的依赖关系
[root@zutuanxue ~]# systemctl list-dependencies multi-user.target
查看multi-user.target依赖谁
multi-user.target
● ├─atd.service
.
.
.
● ├─basic.target
● │ ├─-.mount
● │ ├─microcode.service
● │ ├─paths.target
● │ ├─slices.target
● │ │ ├─-.slice
● │ │ └─system.slice
● │ ├─sockets.target
● │ │ ├─avahi-daemon.socket
.
.
.
[root@zutuanxue ~]# systemctl list-dependencies multi-user.target --reverse 	查看谁依赖multi-user.target
multi-user.target
● └─graphical.target
```

### 服务与端口

 我们知道在服务中分为系统服务和网络服务，系统服务是本机使用的，网络服务是给网络中的其它客户端使用的，那其它客户端是如何连接上的网络服务的呢？端口和协议，协议在我们之前的课程中了解过，那端口是什么呢？

端口：设备与外界通讯的出口，分为虚拟端口和物理端口，物理端口又叫接口，比如电脑中可以插网线的RJ45接口等,而虚拟端口指的就是网络服务使用的通讯接口，是不可见的，这些每个虚拟端口都有一个编号，我们称之为端口号，系统当中有一个文件记录的服务和端口号以及协议的对应关系

```
[root@zutuanxue ~]# cat /etc/services  | more
服务名称				端口号/协议				描述			
ftp-data        20/tcp
ftp-data        20/udp
# 21 is registered to ftp, but also used by fsp
ftp             21/tcp
ftp             21/udp          fsp fspd
ssh             22/tcp                          
ssh             22/udp                         
telnet          23/tcp
telnet          23/udp

我们还可以使用netstat工具去查看自己的系统打开了哪些端口
[root@zutuanxue ~]# netstat -antulp
a			查看所有服务以及对应的端口号
n			将输出结果以数字的形式表示，而不是主机名，服务名等
t			使用tcp协议
u			使用udp协议
l			只显示处于监听状态的
p			显示程序的名称与进程号
c			指定自动更新的间隔时间  秒
r			查看路由表信息
[root@zutuanxue ~]# netstat -antlup 
Proto：协议
Recv-Q：接收队列，如果接收队列阻塞，可能是受到拒绝服务攻击								
Send-Q：发送队列，如果发送队列不能很快清零，可能是有应用向外发送数据包过快，或者对方接收数据包不够快
Recv-Q和Send-Q通常应该为0，如果不为0可能意味着有问题，数据包有堆积状态，可以接受短暂的非0状态
Local Address：本地的地址和端口号
Foreign Address：	外部地址和状态
State：						端口状态
			 CLOSED 			端口未被使用中。
			 LISTEN 			监听中，可以连接
			 SYN_SEND   	处在TCP三次握手期间，已经发送SYN包后，等待对方的ACK包。
       SYN_RECV   	处在TCP三次握手期间，已经收到SYN包后，进入SYN_RECV状态。
       ESTABLISHED	完成TCP三次握手，进入ESTABLISHED状态。可以进行通信。
       FIN_WAIT_1   在TCP四次挥手时，主动关闭端发送FIN包后，进入此状态。
       FIN_WAIT_2   在TCP四次挥手时，主动关闭端收到ACK包后，进入此状态。
       TIME_WAIT    在TCP四次挥手时，主动关闭端发送了ACK包之后，进入此状态，
       							等待一段时间，让被动关闭端收到ACK包。
       CLOSING      在TCP四次挥手时，主动关闭端发送了FIN包后，没有收到对应的ACK										包，却收到对方的FIN包，此时，进入CLOSING状态。
       CLOSE_WAIT   在TCP四次挥手期间，被动关闭端收到FIN包后，进入此状态。
       LAST_ACK     在TCP四次挥手时，被动关闭端发送FIN包后，等待对方的ACK包。
       UNKNOWN			未知状态
PID/Program name： 进程号/程序名称


通过netstat命令可以看到自己的linux系统打开了哪些服务及端口号，如果有些端口不想被占用可以关闭相应的网络服务
[root@zutuanxue ~]# systemctl list-units --all | grep avahi
avahi-daemon.service loaded active running Avahi mDNS/DNS-SD Stack                                                                                          
avahi-daemon.socket loaded active running Avahi mDNS/DNS-SD Stack Activation Socket                                                                        
可以看到这个服务的作用是为内网提供域名解析的
[root@zutuanxue ~]# systemctl stop avahi-daemon.service 
Warning: Stopping avahi-daemon.service, but it can still be activated by:
  avahi-daemon.socket
[root@zutuanxue ~]# systemctl stop avahi-daemon.socket                   
[root@zutuanxue ~]# systemctl disable avahi-daemon.service avahi-daemon.socket 
Removed /etc/systemd/system/multi-user.target.wants/avahi-daemon.service.
Removed /etc/systemd/system/sockets.target.wants/avahi-daemon.socket.
Removed /etc/systemd/system/dbus-org.freedesktop.Avahi.service.
```

### 服务设置相关文件

我们现在知道了服务的管理是通过systemctl，而它的设置文件存放在/usr/lib/systemd/system/目录下，但是官方不建议我们修改这个目录下的文件，如果需要修改的话，建议我们修改/etc/systemd/system/目录内的相关文件

```
[root@zutuanxue ~]# yum install dhcp-server
[root@zutuanxue ~]# systemctl enable dhcpd
Created symlink /etc/systemd/system/multi-user.target.wants/dhcpd.service → /usr/lib/systemd/system/dhcpd.service.
[root@zutuanxue ~]# cd /etc/systemd/system/
[root@zutuanxue system]# ls
在此目录中包含的文件有三种功能
*.service  服务的设置文件
*.wants	  此单元可选的依赖，启动指定单元后，建议启动此目录内的单元
*.requires			此单元必要的依赖，启动指定单元前，需要启动此目录内的单元

服务的设置文件
[root@zutuanxue system]# vim /etc/systemd/system/multi-user.target.wants/dhcpd.service 

[Unit]		对于此单元的简介
Description=DHCPv4 Server Daemon
Documentation=man:dhcpd(8) man:dhcpd.conf(5)
Wants=network-online.target	
After=network-online.target
After=time-sync.target

Unit部分会出现的常见内容
	Description			简介
	Documentation		如何进一步查询相关信息
	Wants						与当前单元配合的单元，如果这些单元没有运行，此单元不会启动失败
	After						在哪些单元之后启动此单元
	Befor						在哪些单元之前启动此单元
	Requires				当前单元依赖的单元，如果这些单元没有运行，此单元启动失败
	Conflicts				哪些单元与此单元冲突
[Service]	这是一个服务还可能是Socket、Timer、Mount等
Type=notify
EnvironmentFile=-/etc/sysconfig/dhcpd
ExecStart=/usr/sbin/dhcpd -f -cf /etc/dhcp/dhcpd.conf -user dhcpd -group dhcpd --no-pid $DHCPDARGS
StandardError=null

Service部分会出现的内容
	Type			启动时，相关进程的行为
			simple		默认值
			oneshot		一次性进程，systemd会等待当前服务结束，再继续执行
			notify		启动完毕后通知systemd
			idle		所有其它任务执行完毕后，此服务才会运行
	EnviromentFile	指定环境变量配置文件
	Enviroment	指定环境变量
	ExecStart	执行什么命令启动当前服务
	ExecStartPre	启动当前服务之前执行什么命令
	ExecStartPost	启动当前服务之后执行什么命令
	ExecStop	执行什么命令停止当前服务
	ExecStopPost	停止当前服务后执行什么命令
	ExecReload	执行什么命令重新加载服务的配置文件
	Restart		服务正常退出、异常退出、被杀死、超时的时候是否重启。常用值
			no				不重启
			always		无条件重启
			on-failure	异常退出时重启
	RestartSec	自动重启服务的间隔时间
	RemainAfterExit	此服务的进程全部退出之后，是否依然将服务的状态视为active状态
	TimeoutSec	定义服务启动或停止的超时时间
	KillMode	服务停止时，杀死进程的方法
	
[Install]	将此单元放到哪一个目标（target）当中
WantedBy=multi-user.target	此服务所在的target，当执行systemctl enabled dhcpd时，dhcpd.service的链接会放在/etc/systemd/system/multi-user.target.wants/中

Install字段出现的内容
WantedBy=multi-user.target	此服务所在的target，当执行systemctl 																			enabled dhcpd时，dhcpd.service的链接会放																	在/etc/systemd/system/multi-user.target.wants/中Also附加单元，当用户使用systemctl enable/disabled时，也自动启用或者停用附加单元
Alias		定义别名
```

### 服务多实例

```
[root@zutuanxue yum.repos.d]# dnf install vsftpd -y		安装一个服务
[root@zutuanxue yum.repos.d]# systemctl start vsftpd
[root@zutuanxue yum.repos.d]# netstat -antulp | grep vsftpd
tcp6       0      0 :::21      :::*     LISTEN      6331/vsftpd         
[root@zutuanxue yum.repos.d]# cd /etc/systemd/system/
[root@zutuanxue system]# cp /usr/lib/systemd/system/vsftpd.service ./vsftpd2.service
[root@zutuanxue system]# cd /etc/vsftpd/
[root@zutuanxue vsftpd]# cp vsftpd.conf vsftpd2.conf
[root@zutuanxue vsftpd]# vim vsftpd2.conf 
listen_port=2100

[root@zutuanxuet vsftpd]# vim /etc/systemd/system/vsftpd2.service 
[Unit]
Description=the second Vsftpd ftp daemon			修改简介
After=network.target

[Service]
Type=forking
ExecStart=/usr/sbin/vsftpd /etc/vsftpd/vsftpd2.conf		修改配置文件

[Install]
WantedBy=multi-user.target
[root@zutuanxue system]# systemctl list-unit-files  | grep vsftpd
vsftpd.service                              disabled 
vsftpd2.service                             disabled 
vsftpd@zutuanxue.service                    indirect 
vsftpd.target                               disabled 
[root@zutuanxue system]# systemctl start vsftpd
[root@zutuanxue system]# systemctl start vsftpd2
[root@zutuanxue system]# netstat -antulp | grep vsftpd
tcp6       0      0 :::21          :::*        LISTEN      7388/vsftpd         
tcp6       0      0 :::2100        :::*        LISTEN      7392/vsftpd         
```