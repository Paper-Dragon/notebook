# Journal日志服务详解

## Journal日志服务

>  journalctl 用来查询 systemd-journald 服务收集到的日志。systemd-journald 服务是 systemd init 系统提供的收集系统日志的服务。

常用命令行

```bash
journalctl 查看所有日志

journalctl --disk-usage 用于查看目前日志占用了多少磁盘空间

journalctl -n 4 查看最新的4行日志

journalctl --since=2020-06-23 查看从2020-06-23开始的日志

journalctl --since=13:00 查看从13:00开始的日志

journalctl --until=2020-06-23 查看截止到2020-06-23的日志

journalctl --until=13:00 查看截止到13:00的日志

journalctl --since time --until time 查看某一时间段内的日志

journalctl -p err 查看error级别的日志（同理可改为info、warning等级别）

journalctl -o verbose 查看日志详细信息

journalctl _PID=num _COMM=sshd 查看特定pid和特定命令的日志信息

echo ""> /var/log/journal/2019100817110995251777489178452/system.journal 清空当前正在记录的日志文件

journalctl --vacuum-time=1m 仅保留最近一个月的日志文件

journalctl --vacuum-size=500M 仅保留500MB大小的日志文件

systemctl restart systemd-journald 服务控制
```



## 配置文件参数详解

>  配置文件所在位置：/etc/systemd/journald.conf默认状态所有选项均为注释状态

```bash
[Journal]
Storage=auto           #存储日志文件位置（"volatile" 表示仅保存在内存中，路径：/run/log/journal 、"persistent" 表示优先保存在磁盘上，路径：优先保存在 /var/log/journal、"auto"默认值、"none"不保存任何日志）
Compress=yes            #压缩存储大于特定阈值的对象
Seal=yes          #如果存在一个"sealing key"， 那么就为所有持久保存的日志文件启用 FSS验证
SplitMode=uid   #是否按用户进行日志分割（分割策略："uid" 表示每个用户都有专属日志文件系统用户仍写进系统日志，"none" 不进行日志分割，所有用户日志均写进系统日志
SyncIntervalSec=5m    #向磁盘刷写日志时间间隔（error以上，不含error级别日志会立即刷写）
RateLimitInterval=30s    
RateLimitBurst=1000    #上下两个选项表示在30s内每个服务最多纪录1000条日志，多余日志丢弃
SystemMaxUse=       #全部日志最大占用磁盘空间
SystemKeepFree=     #除日志文件之外，至少保留多少空间给其他用途（磁盘）
SystemMaxFileSize=     #单个日志文件最大占用磁盘空间
RuntimeMaxUse=      #全部日志最大占用内存空间
RuntimeKeepFree=    #除日志文件之外，至少保留多少空间给其他用途（内存）
RuntimeMaxFileSize=     #单个日志文件最大占用内存大小
MaxRetentionSec=      #日志文件最大保留期限（超过该时间自动删除）
MaxFileSec=1month     #日志滚动时间间隔
ForwardToSyslog=yes   #表示是否将接收到的日志消息转发给传统的 syslog 守护进程
ForwardToKMsg=no        #表示是否将接收到的日志消息转发给内核日志缓冲区(kmsg)
ForwardToConsole=no    #表示是否将接收到的日志消息转发给系统控制台
ForwardToWall=yes      #表示是否将接收到的日志消息作为警告信息发送给所有已登录用户
TTYPath=/dev/console     
MaxLevelStore=debug      #表示记录到日志中的最高日志等级
MaxLevelSyslog=debug     #转发给syslog进程的最高日志等级
MaxLevelKMsg=notice     #转发给内核日志缓冲区(kmsg)的最高日志等级
MaxLevelConsole=info     #转发给系统控制台的最高日志等级
MaxLevelWall=emerg     #置作为警告信息发送给所有已登录用户的最高日志等级
LineMax=48K     #每条日志记录最大的字节长度，超长部分自动打分割符进行分割
~

```

