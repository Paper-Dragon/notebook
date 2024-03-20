# Linux的sysstat系统状态工具包

## 简介

sysstat提供了Linux性能监控的工具集，包括sar、sadf、mpstat、iostat、pidstat等，这些工具可以监控系统性能和使用情况。各工具的作用如下：
iostat - 提供CPU统计，存储I/O统计（磁盘设备，分区及网络文件系统）
mpstat - 提供单个或组合CPU相关统计
pidstat - 提供Linux进程级别统计：I/O、CPU、内存等
sar - 收集、报告、保存系统活动信息：CPU、内存、磁盘、中断、网络接口、TTY、内核表等
sadc - 系统活动数据收集器，作为sar后端使用
sa1 - 收集系统活动日常数据，并二进制格式存储，它作为sadc的工具的前端，可以通过cron来调用
sa2 - 生成系统每日活动报告，同样可作为sadc的工具的前端，可以通过cron来调用
sadf - 可以以CSV、XML格式等显示sar收集的性能数据，这样非常方便的将系统数据导入到数据库中，或导入到Excel中来生成图表
nfsiostat-sysstat: 提供NFS I/O统计
cifsiostat: 提供CIFS统计
sysstat功能强大，功能也在不断的增强，每个版本提供了不同的功能，用户可以到sysstat官网了解工具最先发展情况和获得相应的帮助手册。官网地址： http://sebastien.godard.pagesperso-orange.fr/

## 安装

    网络安装
    对于大多数Linux系统，都有sysstat安装包，可以通过网络来进行安装：
    以CentOS系统为例，可以通过yum来进行安装：
    [plain] view plain copy
    [root@centos ~]# yum install sysstat
    以Ubuntu系统为例, 可以通过apt-get来进行安装：
    [plain] view plain copy
    [root@localhost ~]# apt-get install sysstat
    源码安装
    可以在官网： http://sebastien.godard.pagesperso-orange.fr/download.html或GITHUB：https://github.com/sysstat/sysstat下载sysstat的源码。
    按照下面的步骤来进行源码安装(以Ubuntu系统为例)：
    [plain] view plain copy
    root@ubuntu:~# apt-get install xz-utils
    root@ubuntu:~# xz -d sysstat-11.0.5.tar.xz
    root@ubuntu:~# tar -xvf sysstat-11.0.5.tar
    root@ubuntu:~# cd sysstat-11.0.5
    root@ubuntu:~/sysstat-11.0.5# ./configure --disable-nls
    root@ubuntu:~/sysstat-11.0.5# make
    root@ubuntu:~/sysstat-11.0.5# make install
    注释1：从官网中下载的源码包为.tar.xz压缩文件，需要安装xz-utils工具包，先通过xz -d解压为tar文件，然后再通过tar命令解压
    注释2：编译过程中如果遇到问题，可以查看源码根目录下的FAQ文件获取帮助信息
    注释3：如果需要多语言支持，需要安装GNU gettext包，否则可能遇到”make: ***[locales] Error 127“错误，本例子中通过”–disable-nls"配置项禁用了该选项。可以参考FAQ中的信息来解决相应问题:
    [plain] view plain copy
    1.1. When I compile sysstat, it fails with the following message:
    make: msgfmt: Command not found
    make: ***[locales] Error 127

The msgfmt command belongs to the GNU gettext package.
If you don’t have it on your system, just configure sysstat with
NLS disabled like this:

$ ./configure --disable-nls

or answer ‘y’ (for “yes”) to the question
“Disable National Language Support (NLS)? (y/n) [–disable-nls]”
if you use the Interactive Configuration script (iconfig),
then compile sysstat as usual (make ; make install).
Please read the README-nls file included in sysstat source package to learn
## some more about National Language Support.

Linux性能监控工具sysstat系列：介绍与安装
https://blog.51cto.com/fangwei009/2088551