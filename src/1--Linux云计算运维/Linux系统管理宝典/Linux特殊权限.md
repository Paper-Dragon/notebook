linux基本权限只是规定了所有者、属组、其他人三种用户的权限，如果希望对文件或文件夹做一些特殊的权限设置呢？
比如：

- 设置属组继承权限
- 为执行文件设置临时超管执行权限
- 公共文件夹中的文件谁建立谁删除
	这些任务基本权限就解决不聊了，需要解决这个问题得靠特殊权限。

## 一、特殊权限的介绍

之前我们提到了特殊权限有三个，这三个特殊权限是在可执行程序运行时影响操作权限的，它们分别是SUID,SGID,sticky-bit位

| 特殊权限  | 说明                                                         |
| --------- | ------------------------------------------------------------ |
| SUID      | 当一个设置了SUID 位的可执行文件被执行时，该文件将以所有者的身份运行，也就是说无论谁来执行这个文件，他都有文件所有者的特权。任意存取该文件拥有者能使用的全部系统资源。如果所有者是 root 的话，那么执行人就有超级用户的特权了。 |
| SGID      | 当一个设置了SGID 位的可执行文件运行时，该文件将具有所属组的特权，任意存取整个组所能使用的系统资源；若一个目录设置了SGID，则所有被复制到这个目录下的文件，其所属的组都会被重设为和这个目录一样，除非在复制文件时保留文件属性，才能保留原来所属的群组设置。 |
| stickybit | 对一个文件设置了sticky-bit之后，尽管其他用户有写权限，也必须由属主执行删除、移动等操作；对一个目录设置了sticky-bit之后，存放在该目录的文件仅准许其属主执行删除、移动等操作。 |

一个典型的例子就是passwd命令，这个命令允许用户修改自己的密码。我们可以看到本来是rwx的权限表示形式变成了rws，同样如果/usr/bin/passwd这个文件同时被设置了三个特殊权限，那么权限的格式就会变成rwsrwsrwt,需要注意的是特殊权限设置的前置要求是可执行，也就是如果没有x权限位，是不要设置的，即便你使用root用户设置上了特殊权限，也不会生效。

```
[root@zutuanxue test]# ll /usr/bin/passwd 
-rwsr-xr-x. 1 root root 34928 5月  11 11:14 /usr/bin/passwd
```

## 二、特殊权限的设置和查看

**特殊权限的设置也是使用chmod**

```
[root@zutuanxue test]# ll
总用量 0
-rwxr-xr-x 1 oracle oracle 0 10月 18 01:26 file1
[root@zutuanxue test]# chmod u+s file1
[root@zutuanxue test]# ll
总用量 0
-rwsr-xr-x 1 oracle oracle 0 10月 18 01:26 file1
[root@zutuanxue test]# chmod g+s file1
[root@zutuanxue test]# ll
总用量 0
-rwsr-sr-x 1 oracle oracle 0 10月 18 01:26 file1
[root@zutuanxue test]# chmod o+t file1
[root@zutuanxue test]# ll
总用量 0
-rwsr-sr-t 1 oracle oracle 0 10月 18 01:26 file1
```

或者使用数字

```
[root@zutuanxue test]# chmod u-s,g-s,o-t file1
[root@zutuanxue test]# ll
总用量 0
-rwxr-xr-x 1 oracle oracle 0 10月 18 01:26 file1
[root@zutuanxue test]# chmod 7755 file1
[root@zutuanxue test]# ll
总用量 0
-rwsr-sr-t 1 oracle oracle 0 10月 18 01:26 file1
```