# Linux解释etc下面rc.local的含义

> rc.local是在系统启动过程中不起眼的一个文件，现在对这个文件进行解释。

## 初探这个文件

> 这个配置文件会在用户登陆之前读取，这个文件中写入了什么命令，在每次系统启动时都会执行一次。也就是说，如果有任何需要在系统启动时运行的工作，则只需写入 /etc/rc.d/rc.local 配置文件即可。这个文件的内容如下：



```bash
[root@hcss-ecs-3689 etc]# cat /etc/rc.local
#!/bin/bash
# THIS FILE IS ADDED FOR COMPATIBILITY PURPOSES
#
# It is highly advisable to create own systemd services or udev rules
# to run scripts during boot instead of using this file.
#
# In contrast to previous versions due to parallel execution during boot
# this script will NOT be run after all other services.
#
# Please note that you must run 'chmod +x /etc/rc.d/rc.local' to ensure
# that this script will be executed during boot.

touch /var/lock/subsys/local
```

## 解释语句

整个文件只有一个语句，作用是**系统的启动时间。**

```bash
touch /var/lock/subsys/local
```

默认会touch这个文件，每次系统启动时都会touch这个文件，这个文件的修改时间就是**记录系统的启动时间**

然后我查看了touch命令的man页，touch不止有创建文件的作用还有创建文件时更改日期的作用。

用法奇特。



## 解释

这句指令的作用只有一个，就是记录开机时间的隐形命令，touch完了立马rm.

