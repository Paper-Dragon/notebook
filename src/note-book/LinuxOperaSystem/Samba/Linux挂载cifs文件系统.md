# Linux挂cifs共享存储

## 1、挂载方法

```
# mount -t cifc "windows共享文件夹" "Linux /mnt路径"


```

Linux 会要求输入访问Windows 共享文件夹上的密码。

注意：

如果Linux中提示：

```
Unable to find suitable address. 
```

说明远程共享文件夹路径不存在请进行更正。

如果Linux中提示：

```
mount error(13): Permission denied

Refer to the mount.cifs(8) manual page (e.g. man mount.cifs)
```

解决方案：将访问Windows共享目录的用户名和密码直接加入到命令中

## 2、直接添加账号密码挂载（两种挂载载方式）

```
# mount -t cifs -o username=admin,password="P@ssw0rd" //172.20.10.20/test /mnt/test

# mount.cifs -o username=admin,password="P@ssw0rd" //172.20.10.20/test /mnt/test
```

该命令中，username为windows上的用户；password为window用户对应的密码

通过以上操作可以成功将windows共享文件夹挂载在/mnt/test目录下，不过由于mount命令只能由root权限用户使用。其挂载文件夹的默认owner和group都为root，并且不能通过chmod命令更改权限。

## 3、添加账号密码以及指定权限挂载

使用mount命令，给挂载共享文件夹指定owner和group.

```
# mount.cifs -o username=admin,password="P@ssw0rd",uid=test,gid=test //172.20.10.20/test /mnt/test
```

## 4、更改文件夹权限，给mount共享文件夹所在组的写权限

```
# mount.cifs -o username=admin,password="P@ssw0rd",uid=test,gid=test,dir_mode=0777 //172.20.10.20/test /mnt/test
```

