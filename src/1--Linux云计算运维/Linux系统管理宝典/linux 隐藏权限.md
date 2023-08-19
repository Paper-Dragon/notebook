## 隐藏权限的介绍

有时候你发现即时使用的是root用户也不能修改某个文件，大部分原因是因为使用过chattr命令锁定了该文件，这个命令的作用很大，通过chattr可以提高系统的安全性，但是这个命令并不适合所有的目录，如/dev,/tmp,/var。与我们前面看到的chmod这些命令修改权限不同的是chattr修改的是更底层的属性，这里面我们所提到的隐藏权限指的就是使用chattr来设置属性

## 隐藏权限的设置和查看

chattr的用户与我们之前讲的chmod，chow这些命令相似，都是直接对需要修改的文件进行操作就可以了

- **chattr命令：为文件设置隐藏权限**

```
命令选项
+ 增加权限
- 删除权限
= 赋予什么权限，文件最终权限
A 文件或目录的atime不可被修改
S 硬盘I/O同步选项，功能类似sync。
a 只能向文件中添加数据，而不能删除，多用于服务器日志文件安全，只有root才能设定这个属性。
d 文件不能成为dump程序的备份目标。
i 设定文件不能被删除、改名、设定链接关系，同时不能写入或新增内容。
```

- **lsattr命令: 查看文件隐藏权限**

通过案例学习命令用法：

```
给file1文件添加AaiSd权限
[root@zutuanxue test]# chattr +AaiSd file1

查看文件file1隐藏权限
[root@zutuanxue test]# lsattr file1 
--S-iadA---------- file1

设置删除file1文件隐藏权限
- 可以使用-号  
- 可以使用=为空设置
[root@zutuanxue test]# chattr = file1
[root@zutuanxue test]# lsattr file1 
------------------ file1
```

通过上面的例子可以看到查看的时候使用的是lsattr，chattr还有很多参数，各位可以在man手册中获取到帮助，另外有些参数的使用是有局限性的。