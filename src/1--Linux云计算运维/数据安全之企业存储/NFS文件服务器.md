```
一、NFS介绍
NFS就是Network File System的缩写，最早由Sun公司所发展出来的.最大的功能就是可以通过网络，让不同的主机能共享文件。在NFS的应用中，本地NFS的客户端应用可以透明地读写位于远端NFS服务器上的文件，就像访问本地文件一样。

NFS优势：

可以把服务器上的文件像本地一样的操作，节省本地的存储空间

nfs配置简单，而且服务本身对系统资源占用较少

nfs服务可以支持很多其它的服务，如kickstart，配合在一起，可以实现更多功能

应用场景

共享存储服务器： 图片服务器、视频服务器等

家目录漫游：域用户家目录服务器

文件服务器：内容文件存储服务器

工作原理

NFS体系有两个主要部分：

NFS服务端机器：通过NFS协议将文件共享到网络。

NFS客户端机器：通过网络挂载NFS共享目录到本地。

NFS服务器与客户端在进行数据传输时，需要先确定端口，而这个端口的确定需要借助RPC(Remote Procedure Call,远程过程调用)协议的协助。RPC最主要的功能就是在指定每个NFS服务所对应的端口号，并且告知客户端，让客户端可以连接到正确的端口上去。当我们启动NFS服务时会随机取用数个端口，并主动向RPC注册，因此RPC可以知道每个端口对应的NFS，而RPC又是固定使用 port 111监听客户端的需求并且能够准确的告知客户端正确的端口。

image20200307151530148.png

1.客户端向服务器的111端口发送nfs请求

2.RPC找到对应的nfs端口并告知客户端

3.客户端知道正确的端口后，直接与nfs server端建立连接

二、安装部署
[root@zutuanxue ~]# rpm -qa | grep nfs-utils
nfs-utils-2.3.3-14.el8.x86_64
#管理用户登录及文件权限
[root@zutuanxue ~]# rpm -qa | grep rpcbind
rpcbind-1.2.5-3.el8.x86_64
#管理端口


[root@zutuanxue ~]# systemctl is-enabled rpcbind
enabled
#检查rpcbind服务的状态

[root@zutuanxue ~]# systemctl enable nfs-server.service 
Created symlink /etc/systemd/system/multi-user.target.wants/nfs-server.service → /usr/lib/systemd/system/nfs-server.service. 
[root@zutuanxue ~]# systemctl start nfs-server.service 
#设置开机启动，并启动nfs服务
相关文件

/etc/exports： 共享配置文件，用来设置共享

/etc/nfs.conf： nfs服务的配置文件，可以设置端口和超时时间等，大多数时候不需要修改

/etc/sysconfig/nfs： 端口设置文件，重启服务后系统会自动调整nfs.conf内容

/var/lib/nfs/etab: 记录nfs共享的完整权限设定值

三、配置说明
/etc/exports

格式：

共享目录    客户端(权限1，权限2）

共享目录：在本地的位置（绝对路径）
客户端：一台主机，一群主机（IP地址、网段、主机名、域名）
权限：
ro    
	只读访问（默认） 
rw    
	读写访问  
sync 	
	将数据同步写入内存缓冲区与磁盘中，效率低，但可以保证数据的一致性；（默认）  
async   
	将数据先保存在内存缓冲区中，必要时才写入磁盘；
secure  
	客户端只能使用小于1024的端口连接（默认）  
insecure  
	允许客户端使用大于1024的端口连接  
wdelay   
	检查是否有相关的写操作，如果有则将这些写操作一起执行，这样可以提高效率（默认）；
no_wdelay  
	若有写操作则立即执行，应与sync配合使用；
hide       
	在NFS共享目录中不共享其子目录（默认）  
no_hide    
	共享NFS目录的子目录  
subtree_check     
	如果共享目录是子目录时，强制NFS检查父目录的权限（默认）  
no_subtree_check  
	和上面相对，不检查父目录权限  
all_squash      
	共享文件的UID和GID映射匿名用户anonymous，适合公用目录。  
no_all_squash    
	保留共享文件的UID和GID（默认）  
root_squash 		
	root用户的所有请求映射成如anonymous用户一样的权限（默认）  
no_root_squash    
	root用户具有根目录的完全管理访问权限  
anonuid=xxx       
	指定NFS服务器/etc/passwd文件中匿名用户的UID  
anongid=xxx       
	指定NFS服务器/etc/passwd文件中匿名用户的GID
相关命令

exportfs - 管理NFS共享文件系统列表
	-a     发布获取消所有目录共享。
	-r     重新挂载/etc/exports里面的共享目录,同时更新/etc/exports 和/var/lib/nfs/xtab的内容
	-u     取消一个或多个目录的共享。
	-v     输出详细信息。
	-o options,...	指定一系列共享选项(如rw,async,root_squash)
	-i     忽略/etc/exports和/etc/exports.d目录下文件。此时只有命令行中给定选项和默认选项会生效。


例如：
#exportfs   -rv		//重新挂载共享目录，并且显示。
#exportfs   -au	//卸载所有共享目录。



showmount	可以在server/client上使用此命令来查看server
#showmount	[-ae]	hostname/ip
-a或--all
    以 host:dir 这样的格式来显示客户主机名和挂载点目录。
-d或--directories
    仅显示被客户挂载的目录名。
-e或--exports

[root@zutuanxue ~]# showmount -e
Export list for manage01:
/opt *

四、NFS共享案例
案例需求

新建目录/ro，/rw

以只读的方式共享目录 /ro 同时只能被 192.168.98.0 域中的系统访问

以读写的方式共享目录 /rw 能被 192.168.98.0 域中的系统访问

实验环境

两台安装了CentOS8的主机，关闭selinux，关闭防火墙

zutuanxue: NFS server
node1: NFS client
image20200307195109955.png

创建共享目录
[root@zutuanxue ~]# mkdir /ro
[root@zutuanxue ~]# mkdir /rw
由于客户端挂载用户是nfsnobody，本题要求客户端挂载后可读写，我们是用root用户建立的目录，所以要给其他人7的权限
[root@zutuanxue ~]# chmod 757 /rw/  

通过/etc/exports文件定义共享目录
[root@zutuanxue ~]# cat /etc/exports
/ro 192.168.98.0/24(ro)
/rw 192.168.98.0/24(rw)

启动nfs服务
[root@zutuanxue ~]# systemctl restart nfs-server.service 


[root@zutuanxue opt]# ps aux | egrep "rpc|nfs"
rpc.nfsd（nfsd）：基本的NFS守护进程（2049端口），主要负责登录权限检测。
rpc.mountd（mountd）：负责管理NFS的文件系统，对客户端存取服务器的文件进行一系列的管理。
rpc.rquotad（rquotad）：提供远程磁盘限额服务。
rpc.lockd（nlockmgr）：用于管理文件的锁定，防止多个客户端同时写入某个文件时产生的冲突。
rpc.statd（staus）：用来检查共享目录的一致性


如果服务之前已经启动可以重新加载所有共享
[root@zutuanxue ~]# exportfs -rv
exporting 192.168.98.0/24:/rw
exporting 192.168.98.0/24:/ro

查看共享目录
[root@zutuanxue ~]# exportfs -v
/ro       	192.168.98.0/24(sync,wdelay,hide,no_subtree_check,sec=sys,ro,secure,root_squash,no_all_squash)
/rw    	192.168.98.0/24(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)
五、客户端访问
使用showmount命令查看远程nfs服务器共享目录
[root@node1 ~]# showmount -e 192.168.98.200
Export list for 192.168.98.200:
/protected 192.168.98.0/24
/public    192.168.98.0/24

新建挂载点
[root@node1 ~]# mkdir /mnt/ro
[root@node1 ~]# mkdir /mnt/rw

挂载NFS服务器共享目录
[root@node1 ~]# mount -t nfs 192.168.98.200:/ro /mnt/ro/
[root@node1 ~]# mount -t nfs 192.168.98.200:/rw /mnt/rw/

验证挂载
[root@node1 ~]# mount | grep mnt


测试权限
[root@node1 ~]# touch /mnt/ro/test
touch: 无法创建"/mnt/public/test": 只读文件系统
[root@node1 ~]# touch /mnt/rw/test
[root@node1 ~]# ls  /mnt/rw/ -l
总用量 0
-rw-r--r-- 1 nfsnobody nfsnobody 0 2月  28 11:52 test

如果需要开机挂载的话可以修改/etc/fstab
192.168.98.200:/ro      /mnt/ro nfs     defaults        0 0
192.168.98.200:/rw      /mnt/rw nfs     defaults        0 0

温馨提示：还可以使用前面课程提到过的autofs实现自动挂载
六、nfs固定端口
nfs工作需要的端口除了2049和111之外还有额外的端口，而这些端口都是随机的，所以在有安全防护的时候，为了保证NFS可以正常工作就需要将这些随机的端口固定

我们可以使用rpcinfo命令来查看nfs的端口
[root@zutuanxue ~]# rpcinfo -p
   program vers proto   port  service
    100000    4   tcp    111  portmapper
    100000    3   tcp    111  portmapper
    100000    2   tcp    111  portmapper
    100000    4   udp    111  portmapper
    100000    3   udp    111  portmapper
    100000    2   udp    111  portmapper
    100024    1   udp  37242  status
    100024    1   tcp  39231  status
    100005    1   udp  20048  mountd
    100005    1   tcp  20048  mountd
    100005    2   udp  20048  mountd
    100005    2   tcp  20048  mountd
    100005    3   udp  20048  mountd
    100005    3   tcp  20048  mountd
    100003    3   tcp   2049  nfs
    100003    4   tcp   2049  nfs
    100227    3   tcp   2049  nfs_acl
    100021    1   udp  41958  nlockmgr
    100021    3   udp  41958  nlockmgr
    100021    4   udp  41958  nlockmgr
    100021    1   tcp  35847  nlockmgr
    100021    3   tcp  35847  nlockmgr
    100021    4   tcp  35847  nlockmgr
重启nfs服务
[root@zutuanxue ~]# systemctl restart nfs-server.service 
再次查看端口
[root@zutuanxue ~]# rpcinfo -p
   program vers proto   port  service
    100000    4   tcp    111  portmapper
    100000    3   tcp    111  portmapper
    100000    2   tcp    111  portmapper
    100000    4   udp    111  portmapper
    100000    3   udp    111  portmapper
    100000    2   udp    111  portmapper
    100024    1   udp  37242  status
    100024    1   tcp  39231  status
    100005    1   udp  20048  mountd
    100005    1   tcp  20048  mountd
    100005    2   udp  20048  mountd
    100005    2   tcp  20048  mountd
    100005    3   udp  20048  mountd
    100005    3   tcp  20048  mountd
    100003    3   tcp   2049  nfs
    100003    4   tcp   2049  nfs
    100227    3   tcp   2049  nfs_acl
    100021    1   udp  45032  nlockmgr
    100021    3   udp  45032  nlockmgr
    100021    4   udp  45032  nlockmgr
    100021    1   tcp  36303  nlockmgr
    100021    3   tcp  36303  nlockmgr
    100021    4   tcp  36303  nlockmgr
你会发现除了2049和111之外的端口都是在随机变化的，而这些随机变化的端口会在我们进行安全设置的时候带来困扰，所以我们需要讲端口固定

[root@zutuanxue ~]# vim /etc/sysconfig/nfs
MOUNTD_PORT=10001　#　rpc.mountd使用的端口
STATD_PORT=10002	#		rpc.statd使用的端口
LOCKD_TCPPORT=10003	#		nlockmgr使用的TCP端口（rpc.lockd）
LOCKD_UDPPORT=10003	#		nlockmgr使用的UDP端口
RQUOTAD_PORT=10004	#	rpc.rquotad使用的端口
重新启动服务

[root@zutuanxue ~]# systemctl restart nfs-server.service nfs-convert.service 
[root@zutuanxue ~]# rpcinfo -p
   program vers proto   port  service
    100000    4   tcp    111  portmapper
    100000    3   tcp    111  portmapper
    100000    2   tcp    111  portmapper
    100000    4   udp    111  portmapper
    100000    3   udp    111  portmapper
    100000    2   udp    111  portmapper
    100005    1   udp  10001  mountd
    100005    1   tcp  10001  mountd
    100005    2   udp  10001  mountd
    100005    2   tcp  10001  mountd
    100005    3   udp  10001  mountd
    100005    3   tcp  10001  mountd
    100024    1   udp  10002  status
    100024    1   tcp  10002  status
    100003    3   tcp   2049  nfs
    100003    4   tcp   2049  nfs
    100227    3   tcp   2049  nfs_acl
    100021    1   udp  10003  nlockmgr
    100021    3   udp  10003  nlockmgr
    100021    4   udp  10003  nlockmgr
    100021    1   tcp  10003  nlockmgr
    100021    3   tcp  10003  nlockmgr
    100021    4   tcp  10003  nlockmgr
注意：如果之前没有启动过nfs服务的话，直接启动就可以，如果之前启动过nfs服务，需要同时重启nfs-convert服务，将我们刚才调整的设置写入到nfs.conf配置文件中，启动完成之后我们之前设置的/etc/sysconfig/nfs文件的名称会改为nfs.rpmsavexxxxxxxxxx27 1[root@zutuanxue ~]# systemctl restart nfs-server.service nfs-convert.service 2[root@zutuanxue ~]# rpcinfo -p3   program vers proto   port  service4    100000    4   tcp    111  portmapper5    100000    3   tcp    111  portmapper6    100000    2   tcp    111  portmapper7    100000    4   udp    111  portmapper8    100000    3   udp    111  portmapper9    100000    2   udp    111  portmapper10    100005    1   udp  10001  mountd11    100005    1   tcp  10001  mountd12    100005    2   udp  10001  mountd13    100005    2   tcp  10001  mountd14    100005    3   udp  10001  mountd15    100005    3   tcp  10001  mountd16    100024    1   udp  10002  status17    100024    1   tcp  10002  status18    100003    3   tcp   2049  nfs19    100003    4   tcp   2049  nfs20    100227    3   tcp   2049  nfs_acl21    100021    1   udp  10003  nlockmgr22    100021    3   udp  10003  nlockmgr23    100021    4   udp  10003  nlockmgr24    100021    1   tcp  10003  nlockmgr25    100021    3   tcp  10003  nlockmgr26    100021    4   tcp  10003  nlockmgr27注意：如果之前没有启动过nfs服务的话，直接启动就可以，如果之前启动过nfs服务，需要同时重启nfs-convert服务，将我们刚才调整的设置写入到nfs.conf配置文件中，启动完成之后我们之前设置的/etc/sysconfig/nfs文件的名称会改为nfs.rpmsave
```