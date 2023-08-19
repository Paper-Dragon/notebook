## 一、VNC介绍

VNC (Virtual Network Console)是虚拟网络控制台的缩写。它 是一款优秀的远程控制工具软件，由著名的 AT&T 的欧洲研究实验室开发的。VNC 是在基于 UNIX和 Linux操作系统的免费的开源软件，远程控制能力强大，高效实用，其性能可以和 Windows和 MAC中的任何远程控制软件媲美。

平行软件：向日葵 teamview 远程桌面

C/S: client/server模式

## 二、VNC部署

**部署步骤：**

- 软件安装
- 连接验证配置
- VNC连接管理

#### 2.1、安装VNC

```
[root@zutuanxue ~]# yum -y install tigervnc-server tigervnc-server-module
```

#### 2.2、配置连接密码

```
[root@zutuanxue ~]# vncpasswd   $USERNAME
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
A view-only password is not used
```

#### 2.3、关闭Wayland

Wayland 是 GNOME 中的默认显示管理器 （GDM），并且未配置用于处理 Xorg 等远程渲染的 API。取消注释 `/etc/gdm/custom.conf` 中的 `WaylandEnable=false`，以使通过 vnc 进行的远程桌面会话请求由 GNOME 桌面的 xorg 处理，来代替 Wayland 显示管理器。

```
 [root@zutuanxue ~]# sed -i '/^#WaylandEnable=/cWaylandEnable=false' /etc/gdm/custom.conf
```

#### 2.4、VNC管理

**a、启动VNC**

```
[root@zutuanxue ~]# vncserver -autokill :1

New 'zutuanxue:1 (root)' desktop is zutuanxue:1

Starting applications specified in /root/.vnc/xstartup
Log file is /root/.vnc/zutuanxue:1.log

查看启动
[root@zutuanxue ~]# netstat -ntpl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN      1310/dnsmasq        
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      918/sshd            
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      917/cupsd           
tcp        0      0 0.0.0.0:5601            0.0.0.0:*               LISTEN      839/node            
tcp        0      0 0.0.0.0:5901            0.0.0.0:*               LISTEN      4848/Xvnc           
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      1/systemd           
tcp6       0      0 :::22                   :::*                    LISTEN      918/sshd            
tcp6       0      0 ::1:631                 :::*                    LISTEN      917/cupsd           
tcp6       0      0 :::5901                 :::*                    LISTEN      4848/Xvnc           
tcp6       0      0 :::111  

-autokill
退出图形桌面终止VNC
用户从图形环境注销  终止VNC
每当xstartup脚本退出时自动终止Xvnc。在大多数情况下，这具有终止当用户从窗口管理器注销时使用Xvnc。
```

**b、VNC管理-查看VNC**

```
[root@zutuanxue ~]# vncserver -list

TigerVNC server sessions:

X DISPLAY #	PROCESS ID
:1		2621
```

**c、VNC管理-关闭VNC**

```
[root@zutuanxue ~]# vncserver -kill :1
```