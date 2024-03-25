# 制作CentOS操作系统RootFS

## 基础安装

```bash
[root@monther ~]# mkdir mkRootfs
[root@monther ~]#
[root@monther ~]# cd mkRootfs/
[root@monther mkRootfs]# mount /dev/sr0 /root/mkRootfs/iso/
mount: /dev/sr0 is write-protected, mounting read-only
[root@monther mkRootfs]# ls iso/
CentOS_BuildTag  EFI  EULA  GPL  images  isolinux  LiveOS  Packages  repodata  RPM-GPG-KEY-CentOS-7  RPM-GPG-KEY-CentOS-Testing-7  TRANS.TBL
[root@monther mkRootfs]# mkdir rootfs
[root@monther mkRootfs]# ls
iso  rootfs
[root@monther mkRootfs]# cp iso/Packages/centos-release-7-7.1908.0.el7.centos.x86_64.rpm .
[root@monther mkRootfs]# ls
centos-release-7-7.1908.0.el7.centos.x86_64.rpm  iso  rootfs
[root@monther mkRootfs]# rpm --root=/root/mkRootfs/rootfs/ -ivh --nodeps /root/mkRootfs/centos-release-7-7.1908.0.el7.centos.x86_64.rpm
warning: /root/mkRootfs/centos-release-7-7.1908.0.el7.centos.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:centos-release-7-7.1908.0.el7.cen################################# [100%]
[root@monther mkRootfs]# ls rootfs/
etc  usr  var
[root@monther mkRootfs]# yum -y --installroot=/root/mkRootfs/rootfs/ install basesystem filesystem bash kernel passwd @base @core
Loaded plugins: fastestmirror
Determining fastest mirrors
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
base                                                                                                                                                 | 3.6 kB  00:00:00
extras                                                                                                                                               | 2.9 kB  00:00:00
updates                                                                                                                                              | 2.9 kB  00:00:00
(1/4): base/7/x86_64/primary_db                                                                                                                      | 6.1 MB  00:00:00
(2/4): base/7/x86_64/group_gz                                                                                                                        | 153 kB  00:00:01
(3/4): extras/7/x86_64/primary_db                                                                                                                    | 250 kB  00:00:01
(4/4): updates/7/x86_64/primary_db                                                                                                                   |  17 MB  00:01:56
                                           |  17 MB  00:01:56
Resolving Dependencies
--> Running transaction check
-> Processing Dependency: libglib-2.0.so.0()(64bit) for package: 1:NetworkManager-1.18.8-2.el7_9.x86_64
.....


```

## 初始化

> 手动创建用户初始化程序init的链接，并设置用于解压到Client上的CentOS的口令。

```bash
tar -cvf 11.tar .
docker import 11.tar centos:custom
[root@monther rootfs]# docker run -it --rm --privileged centos:custom init


```

