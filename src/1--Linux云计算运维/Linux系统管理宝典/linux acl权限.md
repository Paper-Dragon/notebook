linux的权限非常重要，我们之前所说的几种权限中，但是并不能只针对一个用户或者一个组进行单独设置，而ACL权限可以帮助我们实现这个功能，比如说有一个文件的所有者和所有者组都是a，这个文件的权限是660，我可以让b这个用户可以对文件进行读写的操作，而b这个用户并不属于a组的成员。那我们来看下如何使用

## ACL权限的设置和查看

如果要使用acl权限，首先要确定你的文件系统支持acl权限,如果再Default mount options字段出现acl字样就意味着你的文件系统支持acl，不过在CentOS8中默认是都支持的。

```
[root@zutuanxue test]# tune2fs -l /dev/sda1
tune2fs 1.44.3 (10-July-2018)
Filesystem volume name:   <none>
Last mounted on:          /boot
Filesystem UUID:          be03eaec-6474-42ea-8f79-06e7198f5155
Filesystem magic number:  0xEF53
Filesystem revision #:    1 (dynamic)
Filesystem features:      has_journal ext_attr resize_inode dir_index filetype needs_recovery extent 64bit flex_bg sparse_super large_file huge_file dir_nlink extra_isize metadata_csum
Filesystem flags:         signed_directory_hash 
Default mount options:    user_xattr acl
Filesystem state:         clean
.
.
.
```

配置acl权限我们需要使用两个命令一个是setfacl用来设置acl权限，另一个是getfacl用来查看acl权限

- **setfacl命令：设置文件或文件夹的ACL权限**

```
命令选项：
-m ：设置acl
-x ：删除指定的acl
-b ：删除所有的acl
```

- **getfacl命令：用来查看文件的acl权限**
	现在我们来看下如何设置

```
[root@zutuanxue test]# ls
file  file1
[root@zutuanxue test]# ll file1
-rw-r--r-- 1 root root 0 10月 18 02:48 file1
[root@zutuanxue test]# setfacl -m u:oracle:rw file1	为指定的用户配置一个rw的权限
[root@zutuanxue test]# setfacl -m u::rwx file1		如果没有指定用户则默认是为该文件的所有者设置
[root@zutuanxue test]# ll file1
-rwxrw-r--+ 1 root root 0 10月 18 02:48 file1	所有者权限变成的rwx而且后面多了一个+号
```

你会发现使用ll（等同于ls -l）命令查看时会发现多了一个+号，这只是提醒我们此文件被设置了acl权限，但是具体是什么样的，我们还需要使用getfacl来查看

```
[root@zutuanxue test]# getfacl file1
# file: file1			文件名
# owner: root			所有者
# group: root			所有者组
user::rwx				user：后面是空的，代表的是所有者的权限
user:oracle:rw-			我们之前给额外用户设置的权限
group::r--				所有者组的权限
mask::rw-				默认的有效权限
other::r--				其他人的权限
```

以上是我们针对一个额外的用户设置的权限，同理可以设置针对组和其他人的acl权限

**为不同用户或组设置不同权限**

```
[root@zutuanxue test]# setfacl -m g:oracle:rw file1
[root@zutuanxue test]# setfacl -m o:rw file1
[root@zutuanxue test]# getfacl file1
# file: file1
# owner: root
# group: root
user::rwx
user:oracle:rw-
group::r--
group:oracle:rw-
mask::rw-
other::rw-
```

**删除指定的acl**

```
[root@zutuanxue test]# setfacl -x u:oracle file1		删除用户acl
[root@zutuanxue test]# getfacl file1
# file: file1
# owner: root
# group: root
user::rwx
group::r--
group:oracle:rw-
mask::rw-
other::rw-
[root@zutuanxue test]# setfacl -x g:oracle file1		删除组acl
[root@zutuanxue test]# getfacl file1
# file: file1
# owner: root
# group: root
user::rwx
group::r--
mask::r--
other::rw-
[root@zutuanxue test]# chmod o=r file1				删除其他人直接使用chmod就可以
[root@zutuanxue test]# ll file1
-rw-r--r-- 1 root root 0 10月 18 04:21 file1
[root@zutuanxue test]# getfacl file1
# file: file1
# owner: root
# group: root
user::rw-
group::r--
other::r--
```

**删除所有acl**

```
[root@zutuanxue test]# setfacl -m u:oracle:rw,g:oracle:rw,o:rwx file1
[root@zutuanxue test]# getfacl file1
# file: file1
# owner: root
# group: root
user::rw-
user:oracle:rw-
group::r--
group:oracle:rw-
mask::rw-
other::rwx

[root@zutuanxue test]# setfacl -b file1
[root@zutuanxue test]# getfacl file1
# file: file1
# owner: root
# group: root
user::rw-
group::r--
other::rwx
```