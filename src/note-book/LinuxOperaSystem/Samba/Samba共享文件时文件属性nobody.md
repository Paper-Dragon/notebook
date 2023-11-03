# Linux samba服务器设置简单匿名共享

inux下面的samba非常的好用，很多人拿它来作共享文件服务器，

缺省配置下，samba必须提供用户名密码来访问，如果是所有人都可以访问的内容，那么是比较麻烦的，其实通过一个设置，即可实现不用输入用户名密码的匿名访问

```bash
[root@linux-01 ~]#mkdir /home/myshare //建立共享文件夹share
[root@linux-01 ~]#vi /etc/samba/smb.conf //打开smb.conf配置文件
workgroup = WORKGROUP //修改为与windows主机同一个默认工作组
security = share //将安全级别修改为“share”然后按PageDown键到文件末尾添加如下配置内容：[myshare]comment = This is myshare //文件夹注释信息
path = /home/myshare //设置共享文件夹在服务器重的路径
browseable = yes //设置该共享文件夹在“网上邻居”中是否可见，设置为no时相当于隐藏共享文件夹。
guest ok = yes //设置该共享文件夹是否所有人都可以访问，同public配置项
read only = yes //设置该共享文件夹权限为只读
writeable = yes  //设置匿名用户可写
```

配置完成后按Esc键进入命令模式，再按wq保存退出。配置完毕后，

启动smb服务，命令如下：

```bash
[root@linux-01 ~]#service smb restart
```

