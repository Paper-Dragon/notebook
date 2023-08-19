## 一、FTP介绍

FTP (File transfer protocol) 是TCP/IP 协议组中的协议之一。他最主要的功能是在服务器与客户端之间进行文件的传输。FTP就是实现两台计算机之间的拷贝，从远程计算机拷贝文件至自己的计算机上，称之为“下载 （download）”文件。将文件从自己计算机中拷贝至远程计算机上，则称之为“上传（upload）”文件。这个古老的协议使用的是明码传输方式，且过去有相当多的安全危机历史。为了更安全的使用 FTP 协议，我们主要介绍较为安全但功能较少的 vsftpd(very secure File transfer protocol ) 这个软件。FTP是一个C/S类型的软件，FTP监听TCP端口号为21，数据端口为20。

## 二、应用场景

下载服务器：提供对外的下载服务

文件服务器：提供上传和下载服务

## 三、FTP的权限

FTP 服务器的功能除了单纯的进行文件的传输与管理之外，依据服务器软件的设定架构，它还可以提供几个主要的功能。：
不同等级的用户身份：user, guest, anonymous
FTP 服务器在默认的情况下，依据使用者登录的情况而分为三种不同的身份，分别是：

(1)本地用户：系统中真实存在的用户

(2)来宾, guest；

(3)匿名登录者, anonymous

这三种身份的用户在系统上面的权限差异很大！例如实体用户取得系统的权限比较完整， 所以可以进行比较多的动作；至于匿名登录者，大概我们就仅提供他下载资源的能力而已，并不许匿名者使用太多主机的资源！ 当然，这三种人物因为权限的不同能够使用的【在线命令】自然也就不相同！

## 四、FTP的工作模式

FTP支持两种模式，一种方式叫做Standard (也就是 PORT方式，主动方式)，一种是 Passive (也就是PASV，被动方式)。 Standard模式 FTP的客户端发送 PORT 命令到FTP服务器。Passive模式FTP的客户端发送 PASV命令到 FTP Server。

下面介绍一个这两种方式的工作原理：

Port模式FTP 客户端首先和FTP服务器的TCP 21端口建立连接，通过这个通道发送命令，客户端需要接收数据的时候在这个通道上发送PORT命令。 PORT命令包含了客户端用什么端口接收数据。在传送数据的时候，服务器端通过自己的TCP 20端口连接至客户端的指定端口发送数据。 FTP server必须和客户端建立一个新的连接用来传送数据。

Passive模式在建立控制通道的时候和Standard模式类似，但建立连接后发送的不是Port命令，而是Pasv命令。FTP服务器收到Pasv命令后，随机打开一个高端端口（端口号大于1024）并且通知客户端在这个端口上传送数据的请求，客户端连接FTP服务器此端口，然后FTP服务器将通过这个端口进行数据的传送，这个时候FTP server不再需要建立一个新的和客户端之间的连接。

很多防火墙在设置的时候都是不允许接受外部发起的连接的，所以许多位于防火墙后或内网的FTP服务器不支持PASV模式，因为客户端无法穿过防火墙打开FTP服务器的高端端口；而许多内网的客户端不能用PORT模式登陆FTP服务器，因为从服务器的TCP 20无法和内部网络的客户端建立一个新的连接，造成无法工作。

## 五、FTP安装部署

**约定：本实验中使用过的机器为centos8.0_x86_64系统，IP地址192.168.11.16/24.请关闭防火墙和SELINUX。**

```
vsftp安装
[root@localhost ~]# dnf -y install vsftpd ftp

vsftp开机启动
[root@localhost ~]# systemctl enable vsftpd
Created symlink from /etc/systemd/system/multi-user.target.wants/vsftpd.service to 
/usr/lib/systemd/system/vsftpd.service.

启动vsftp服务
[root@localhost ~]# systemctl start vsftpd

验证启动
[root@localhost ~]# lsof -i :21
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
vsftpd  1951 root    4u  IPv6  32837      0t0  TCP *:ftp (LISTEN)
```

## 六、FTP配置文件

### 6.1）相关文件

主配文件:/etc/vsftpd/vsftpd.conf

下载目录:/var/ftp/

FTP日志:/var/log/xferlog

### 6.2）主配文件详解

```
# Example config file /etc/vsftpd/vsftpd.conf
#
# The default compiled in settings are fairly paranoid. This sample file
# loosens things up a bit, to make the ftp daemon more usable.
# Please see vsftpd.conf.5 for all compiled in defaults.
#
# READ THIS: This example file is NOT an exhaustive list of vsftpd options.
# Please read the vsftpd.conf.5 manual page to get a full idea of vsftpd's
# capabilities.
#
#匿名用户访问,YES是允许，NO是拒绝
# Allow anonymous FTP? (Beware - allowed by default if you comment this out).
anonymous_enable=NO
#
# Uncomment this to allow local users to log in.
# 本地用户登录,YES是允许，NO是拒绝.默认访问的是本地用户家目录，如果你开启了selinux
# 请设置开启布尔值ftp_home_dir为ON
# When SELinux is enforcing check for SE bool ftp_home_dir
local_enable=YES
#
#允许本地用户上传
# Uncomment this to enable any form of FTP write command.
write_enable=YES
#
# Default umask for local users is 077. You may wish to change this to 022,
# 上传的权限是022，使用的是umask权限。对应的目录是755，文件是644
# if your users expect that (022 is used by most other ftpd's)
local_umask=022

#
# Uncomment this to allow the anonymous FTP user to upload files. This only
# has an effect if the above global write enable is activated. Also, you will
# obviously need to create a directory writable by the FTP user.
# When SELinux is enforcing check for SE bool allow_ftpd_anon_write, allow_ftpd_full_access
# 开启匿名用户上传功能，默认是拒绝的
#anon_upload_enable=YES
#
# Uncomment this if you want the anonymous FTP user to be able to create
# new directories.
# 开启匿名用户创建文件或文件夹权限
#anon_mkdir_write_enable=YES
#
# Activate directory messages - messages given to remote users when they
# go into a certain directory.
# 开启目录欢迎消息，一般对命令行登陆有效
dirmessage_enable=YES
#
# Activate logging of uploads/downloads.
# 开启上传和下载日志记录功能
xferlog_enable=YES
#
#使用标准模式
# Make sure PORT transfer connections originate from port 20 (ftp-data).
connect_from_port_20=YES
#
# If you want, you can arrange for uploaded anonymous files to be owned by
# a different user. Note! Using "root" for uploaded files is not
# recommended!
# 声明匿名用户上传文件的所有者
# 允许更改匿名用户上传文件的所有者
#chown_uploads=YES
#所有者为whoever
#chown_username=whoever
#
# You may override where the log file goes if you like. The default is shown
# below.
# 日志文件路径
#xferlog_file=/var/log/xferlog
#
# If you want, you can have your log file in standard ftpd xferlog format.
# Note that the default log file location is /var/log/xferlog in this case.
# 日志文件采用标准格斯
xferlog_std_format=YES
#
# You may change the default value for timing out an idle session.
# 会话超时时间
#idle_session_timeout=600
#
# You may change the default value for timing out a data connection.
# 数据传输超时时间
#data_connection_timeout=120
#
# It is recommended that you define on your system a unique user which the
# ftp server can use as a totally isolated and unprivileged user.
# FTP子进程管理用户
#nopriv_user=ftpsecure
#
# Enable this and the server will recognise asynchronous ABOR requests. Not
# recommended for security (the code is non-trivial). Not enabling it,
# however, may confuse older FTP clients.
# 是否允许客户端发起“async ABOR”请求，该操作是不安全的默认禁止。
#async_abor_enable=YES
#
# By default the server will pretend to allow ASCII mode but in fact ignore
# the request. Turn on the below options to have the server actually do ASCII
# mangling on files when in ASCII mode. The vsftpd.conf(5) man page explains
# the behaviour when these options are disabled.
# Beware that on some FTP servers, ASCII support allows a denial of service
# attack (DoS) via the command "SIZE /big/file" in ASCII mode. vsftpd
# predicted this attack and has always been safe, reporting the size of the
# raw file.
# ASCII mangling is a horrible feature of the protocol.
# 该选项用于指定是否允许上传时以ASCII模式传输数据
#ascii_upload_enable=YES
#该选项用于指定是否允许下载时以ASCII模式传输数据
#ascii_download_enable=YES
#
# You may fully customise the login banner string:
# FTP文本界面登陆欢迎词
#ftpd_banner=Welcome to blah FTP service.
#
# You may specify a file of disallowed anonymous e-mail addresses. Apparently
# useful for combatting certain DoS attacks.
# 是否开启拒绝的Email功能
#deny_email_enable=YES
# (default follows)
# 指定保存被拒接的Email地址的文件
#banned_email_file=/etc/vsftpd/banned_emails
#
# You may specify an explicit list of local users to chroot() to their home
# directory. If chroot_local_user is YES, then this list becomes a list of
# users to NOT chroot().
# (Warning! chroot'ing can be very dangerous. If using chroot, make sure that
# the user does not have write access to the top level directory within the
# chroot)
# 是否开启对本地用户chroot的限制，YES为默认所有用户都不能切出家目录，NO代表默认用户都可以切出家目录
# 设置方法类似于：YES拒绝所有，允许个别    NO  允许所有拒绝个别
#chroot_local_user=YES
#开启特例列表
#chroot_list_enable=YES
# (default follows)
# 如果chroot_local_user的值是YES则该文件中的用户是可以切出家目录，如果是NO，该文件中的用户则不能切出家目录
# 一行一个用户。
#chroot_list_file=/etc/vsftpd/chroot_list
#
# You may activate the "-R" option to the builtin ls. This is disabled by
# default to avoid remote users being able to cause excessive I/O on large
# sites. However, some broken FTP clients such as "ncftp" and "mirror" assume
# the presence of the "-R" option, so there is a strong case for enabling it.
# 是否开启ls 递归查询功能 ls -R
#ls_recurse_enable=YES
#
# When "listen" directive is enabled, vsftpd runs in standalone mode and
# listens on IPv4 sockets. This directive cannot be used in conjunction
# with the listen_ipv6 directive.
# 是否开启ftp独立模式在IPV4
listen=NO
#
# This directive enables listening on IPv6 sockets. By default, listening
# on the IPv6 "any" address (::) will accept connections from both IPv6
# and IPv4 clients. It is not necessary to listen on *both* IPv4 and IPv6
# sockets. If you want that (perhaps because you want to listen on specific
# addresses) then you must run two copies of vsftpd with two configuration
# files.
# Make sure, that one of the listen options is commented !!
# 是否开启ftp独立模式在ipv6
listen_ipv6=YES


#启用pam模块验证
pam_service_name=vsftpd
#是否开启userlist功能.

#是否启用用户列表功能
userlist_enable=YES
```

通过配置文件的分析，VSFTP不允许匿名访问，本地用户可以下载和上传。如果允许匿名用户登录的话需要将anonymous_enable=YES，然后重新启动服务

我们可以通过修改配置文件的内容即可配置FTP的相关登陆情况。

## 七、FTP客户端访问

FTP是一个C/S类型的软件,连接服务端需要FTP客户端才能完成，常见的FTP客户端有以下几种:

浏览器：可以通过浏览器中输入 ftp://ip或者ftp://域名的方式来访问FTP

自带客户端:命令行下可以使用ftp命令去连接

三方客户端：FileZilla 8uftp 图形软件或者文本界面的lftp等

三种方式中，文本界面是比较麻烦的，无法鼠标流。所以我重点给大家讲解一下

### 7.1）文本界面登陆

```
文本界面匿名登陆
[root@localhost ~]# ftp 192.168.11.16
Connected to 192.168.11.16 (192.168.11.16).
220 (vsFTPd 3.0.3)
Name (192.168.11.16:root): ftp	#用户名可以是ftp也可以是anonymous
331 Please specify the password.
Password:							#密码为空
230 Login successful. #显示登陆成功
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
227 Entering Passive Mode (192,168,11,16,90,35).
150 Here comes the directory listing.
drwxr-xr-x    2 0        0               6 May 14  2019 pub
226 Directory send OK.
通过ls可以列出当前目录下有哪些内容 看到有一个目录叫pub
ftp> pwd
257 "/"   
通过pwd命令查看当前路径  注意这里显示的是FTP的根目录

ftp> bye
221 Goodbye.
退出使用bye命令

文本界面本地用户登录
[root@localhost ~]# ftp 192.168.11.16
Connected to 192.168.11.16 (192.168.11.16).
220 (vsFTPd 3.0.3)
Name (192.168.11.16:root): hello
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
227 Entering Passive Mode (192,168,11,16,130,240).
150 Here comes the directory listing.
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 下载
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 公共
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 图片
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 文档
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 桌面
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 模板
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 视频
drwxr-xr-x    2 1001     1001            6 Jan 15 08:56 音乐
226 Directory send OK.
ftp> pwd
257 "/home/hello" is the current directory
```

### 7.2）FTP客户端常用命令

```
键入help命令可以查看所有可使用的命令
ftp> help
Commands may be abbreviated.  Commands are:

!                debug         mdir           sendport     site
$                dir           mget           put          size
account          disconnect    mkdir          pwd          status
append           exit          mls            quit         struct
ascii            form          mode           quote        system
bell             get           modtime        recv         sunique
binary           glob          mput           reget        tenex
bye              hash          newer          rstatus      tick
case             help          nmap           rhelp        trace
cd               idle          nlist          rename       type
cdup             image         ntrans         reset        user
chmod            lcd           open           restart      umask
close            ls            prompt         rmdir        verbose
cr               macdef        passive        runique        ?
delete           mdelete       proxy          send


!+linux命令   执行系统命令
!ls /opt  显示linux系统中/opt目录下的内容
ftp> !ls /opt
dhcp  dns  rh


lcd linux系统中的当前目录
lcd /root  将linux系统中的当前目录切换到/root下
ftp> lcd /root
Local directory now /root


put 上传命令，mput批量上传命令
上传initial-setup-ks.cfg文件到hello家目录下
ftp> put initial-setup-ks.cfg 
local: initial-setup-ks.cfg remote: initial-setup-ks.cfg
227 Entering Passive Mode (192,168,11,16,96,132).
150 Ok to send data.
226 Transfer complete.
1803 bytes sent in 0.00135 secs (1333.58 Kbytes/sec)
可以看到上传成功了

验证一下上传结果
ftp> ls
227 Entering Passive Mode (192,168,11,16,173,142).
150 Here comes the directory listing.
-rw-r--r--    1 1000     1000         1803 Feb 26 07:01 initial-setup-ks.cfg
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 下载
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 公共
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 图片
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 文档
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 桌面
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 模板
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 视频
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 音乐
226 Directory send OK.
看见了吧

切换linux当前目录到/tmp
ftp> lcd /tmp
Local directory now /tmp



get下载命令，mget批量下载
下载initial-setup-ks.cfg到linux系统当前目录/tmp
ftp> get initial-setup-ks.cfg
local: initial-setup-ks.cfg remote: initial-setup-ks.cfg
227 Entering Passive Mode (192,168,11,16,229,134).
150 Opening BINARY mode data connection for initial-setup-ks.cfg (1803 bytes).
226 Transfer complete.
1803 bytes received in 2.9e-05 secs (62172.41 Kbytes/sec)

列出linux目录/tmp的内容，看到了下载的文件initial-setup-ks.cfg
ftp> !ls /tmp/
dhcp                                          tracker-extract-files.0
initial-setup-ks.cfg                                  VMwareDnD
systemd-private-8e7a99ea89c14ab396d66116970fe04d-chronyd.service-sghHHs       vmware-root
systemd-private-8e7a99ea89c14ab396d66116970fe04d-colord.service-wK7h08      yum_save_tx.2019-02-20.16-10.Z6uXqR.yumtx
systemd-private-8e7a99ea89c14ab396d66116970fe04d-cups.service-cokBro          yum_save_tx.2019-02-21.09-03.08zIbU.yumtx
systemd-private-8e7a99ea89c14ab396d66116970fe04d-rtkit-daemon.service-6wt1S0  yum_save_tx.2019-02-22.11-10.prawAT.yumtx

ftp> close
221 Goodbye.
ftp> ls
Not connected.
可以使用close断开连接，当连接断开希望再次连接直接使用open命令即可
ftp> open 192.168.11.16
Connected to 192.168.11.16 (192.168.11.16).
220 (vsFTPd 3.0.2)
Name (192.168.11.16:root): hello
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
227 Entering Passive Mode (192,168,11,16,192,88).
150 Here comes the directory listing.
-rw-r--r--    1 1000     1000         1803 Feb 26 07:01 initial-setup-ks.cfg
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 下载
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 公共
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 图片
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 文档
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 桌面
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 模板
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 视频
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 音乐
226 Directory send OK.



delete命令可以删除属于自己的文件
删除initial-setup-ks.cfg文件
ftp> delete initial-setup-ks.cfg
250 Delete operation successful.
ftp> ls
227 Entering Passive Mode (192,168,11,16,168,142).
150 Here comes the directory listing.
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 下载
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 公共
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 图片
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 文档
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 桌面
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 模板
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 视频
drwxr-xr-x    2 1000     1000            6 Jan 11 01:37 音乐
226 Directory send OK.
```

## 八、基于虚拟用户配置安全的ftp

在ftp中不论是匿名用户还是实名用户都是系统中真实存在的用户，或多或少都会有一些安全方面的风险，为了避免这个风险，开发者在ftp中加入了一个虚拟用户的概念，所有虚拟用户都会被统一映射为一个系统账号，免去了管理过多账户的麻烦，那么这个虚拟用户如何实现呢？

```
a、修改配置文件 
[root@zutuanxue pam.d]# egrep -v "^#" /etc/vsftpd/vsftpd.conf 
anonymous_enable=YES
local_enable=YES
write_enable=YES
local_umask=022
dirmessage_enable=YES
xferlog_enable=YES
connect_from_port_20=YES
xferlog_std_format=YES
chroot_local_user=YES
listen=NO
listen_ipv6=YES


#虚拟用户配置选项
#pam登陆验证
pam_service_name=vftp
#允许虚拟用户功能
guest_enable=YES
#虚拟用户映射到本地用户hello
guest_username=hello
#这里我通过指令改变了默认设置，允许虚拟用户写
allow_writeable_chroot=YES 

#本地用户的根目录
#这里是定义虚拟用户主目录，用户和组必须指定为宿主用户hello
local_root=/home/hello


#允许虚拟用户和本地用户权限一致
virtual_use_local_privs=YES

#如果虚拟用户和本地用户权限不同，可以通过以下的指令来设置指令，配置文件和登陆名同步即可。
#user_config_dir=/etc/vsftpd/vconf.d/




b、生成虚拟用户账号密码文件
奇数行数账户，偶数行是密码
[root@zutuanxue ~]# cat /etc/vsftpd/vuser
vuser01
123456
vuser02
123456

使用db_load转成db格式
[root@zutuanxue ~]# db_load -T -t hash -f /etc/vsftpd/vuser /etc/vsftpd/vuser.db
要求权限是600
[root@zutuanxue ~]# chmod 600 /etc/vsftpd/vuser.db

c、配置pam认证，注意先后顺序
[root@zutuanxue ~]# cat /etc/pam.d/vftp 
#虚拟用户登录
auth       sufficient     /lib64/security/pam_userdb.so db=/etc/vsftpd/vuser
account    sufficient     /lib64/security/pam_userdb.so db=/etc/vsftpd/vuser
#本地登陆
session    optional     pam_keyinit.so    force revoke
auth       required    pam_listfile.so item=user sense=deny file=/etc/vsftpd/ftpusers onerr=succeed
auth       required    pam_shells.so
auth       include    password-auth
account    include    password-auth
session    required     pam_loginuid.so
session    include    password-auth



d、重启服务生效
[root@zutuanxue ~]# systemctl restart vsftpd
[root@zutuanxue ~]# cat /etc/vsftpd/chroot_list 
vuser01
vuser02

e、验证登陆
[root@zutuanxue ~]# ftp 192.168.11.16
Connected to 192.168.11.16 (192.168.11.16).
220 Welcome to ayitula FTP service.
Name (192.168.11.16:root): vuser01
331 Please specify the password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
227 Entering Passive Mode (192,168,11,16,82,91).
150 Here comes the directory listing.
226 Transfer done (but failed to open directory).


登陆成功了.
```