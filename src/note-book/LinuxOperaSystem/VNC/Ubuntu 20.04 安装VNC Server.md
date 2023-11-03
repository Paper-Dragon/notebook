# Ubuntu 20.04 安装VNC Server超简单教程

## 1.确保安装了GNOME DESKTOP

对于桌面版是不用说了，服务器版操作系统需要安装一下桌面

    # apt install ubuntu-gnome-desktop
     
    # systemctl set-default multi-user.target
     
    $ startx

## 2.Installing VNC

不要安装tigervncserver

一定要安装这个 standalone的，会有一点区别（不识别 下面的 -localhost no)

```bash
apt install tigervnc-standalone-server
```



## 3.Configuring the VNC Server

如果你希望用某个用户比如 demo登录，就用su切换到这个用户。

如果想用root登录就直接使用root账号进行操作。

```bash
# su - demo
demo@demoserver:~$ vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
A view-only password is not used
```

上面的命令会在~/.vnc/目录下生成一个 passwd文件。里面是加密的密码。

然后需要cd 到 ~/.vnc目录下，新建一个xstartup 文件

输入以下内容：

```bash
#!/bin/sh
# Start Gnome 3 Desktop 
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
vncconfig -iconic &
dbus-launch --exit-with-session gnome-session &
```

作用是vncserver启动的时候运行这些命令，把桌面程序启动起来。
4. ## Starting the VNC Server

$ vncserver

即可启动vnc server ,但是连不上，因为只监听了127.0.0.1，所以需要以下命令

$ vncserver -localhost no

查看全部的vnc会话 

```bash
$ vncserver -list
TigerVNC server sessions:
 
X DISPLAY #	PROCESS ID
:1		1607
:2		4726
```

 关闭某个会话可以用下面的命令

```bash
$ vncserver -kill :1
```



## 5.客户端选择

vncviewer

下载页面：

Download VNC Viewer for Windows | VNC® Connect

VNC Viewer - Download

具体使用不讲了，默认端口是5901


