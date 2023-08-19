什么是服务？在linux系统中，有一些特殊程序，启动后就会持续在后台执行，等待用户或者其他软件调用使用，这种程序我们称为服务。

linux系统中服务的管理工具

- systemV
- systemd

## 一、systemV与init

systemV，systemV当中有一个叫init的程序，这个程序可以让系统中的service命令去调用/etc/init.d/目录下的服务脚本，我们可以通过service命令去控制服务的启动与关闭,或者找到服务相应的执行文件，然后执行，比如/usr/sbin/httpd,这样才能启动一个服务，如果想要停止一个服务则需要使用kill命令去停止
该服务管理方式从RHEL7之前的系统中默认

### init的特点

- 启动/停止/查看
	/etc/init.d/servername start/stop/restart/status
	​ 或
	​service servername start/stop/restart/status
- 开机启动管理与查看
	chkconfig --level 0-6 servername on/off 指定一个服务在哪个运行级别启动
	chkconfig --list servername 查看一个服务在哪些运行级别启动

#### 分类

按照功能分类

- 系统服务：这些服务的服务对象是linux系统本身，或者linux系统的用户
- 网络服务：网络服务的服务对象是网络中的其他客户端

按照启动方法分类

- 独立系统服务：这类服务一经启动，除非系统关闭或者管理者手动结束，否则会一直在后台执行，不管是否用到。由于这类服务一直在后台执行，所以响应速度快，同时也会占用系统资源
- 临时服务：跟独立的服务不同，临时服务是用到的时候启动，使用完毕后服务会停止，所以临时服务响应速度慢，但是节省系统资源

##### 手动解决服务的依赖关系

 服务之间是有依赖关系的，比如说，联网的服务如果想正常运行的话，就必须启动网络服务。而这些服务就需要用户手动去处理

#### 运行级别分类

 init会根据用户指定的运行级别，来启动不同的服务，在linux系统中包含了0-6，一共7个运行级别

0 关机

1 单用户

2 无网络的多用户

3 字符模式

4 保留

5 图形模式

6 重启

## 二、systemd与unit

从CentOS7开始SystemV，也就是init服务，被效率更高的systemd所替代，而这个systemd对应的管理命令就是systemctl，并且systemctl命令也兼容了service（service命令做为systemd的入口，是systemctl命令的封装）。

#### systemd的优势

- 并行处理所有服务，缩短开机时间
- 响应速度快，通过systemctl命令就可以完成所有操作
- 自动解决服务的依赖关系，类似yum
- 方便记忆，按照类型对服务进行分类
- 兼容init

#### 相关文件

/usr/lib/systemd/system/ 服务的启动脚本，包含所有安装完成的服务设置文件

/run/systemd/system/ 系统运行过程中的服务脚本优先级高于上一个文件

/etc/systemd/system/ 管理员手动建立的服务启动脚本，优先级最高

/etc/sysconfig/* 系统功能的默认设置

#### 服务分类

```
[root@zutuanxue ~]# systemctl -t  help
service				服务单元，用于控制服务
socket				套接字单元，用于进程间通信
target				目标单元，用于控制一组其它单元
device				设备单元，用于控制动态的设备
mount				挂载单元，用于管理文件系统挂载点
automount			自动挂载单元，用于管理文件系统自动挂载点
swap				交换分区单元，用于管理swap设备或swap文件
timer				定时器单元，用于管理基于时间触发的动作
path				路径单元，用于监视文件系统路径，以用于基于路径的启动
slice				范围单元，用于管理与控制一组特定进程的资源占用
scope				范围单元，与service类似，系统自动创建
```