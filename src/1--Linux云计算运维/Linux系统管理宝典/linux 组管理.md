## 组账号管理

本机的群组账号数据被储存在 /etc/group 文件中，权限也必须为0644，与 /etc/passwd 一样，这也是一个文本文件。

```
root:x:0:
bin:x:1:
daemon:x:2:
```

这与/etc/passwd文件的格式类似

```
GROUPNAME:PASSWORD:GID:MEMBERS 

- GROUPNAME:组名

- PASSWORD:组密码，这里也和passwd文件一样是个x

- GID：群组识别号

- MEMBERS：组成员
```

一起来看下组管理的相关命令

- **groupadd** 建立组

```
命令介绍
       groupadd - 创建一个新组

命令语法
       groupadd [选项] group

命令选项
-g GID     指定群组账号的标识符 

-r         指定添加的群组成为系统群组

-f         强制执行。  在一般的情况下，groupadd 不允许建立一个与使用过的 GID 相同的群组账号，而使用这个参数时，groupadd 将会建立相同 GID 的 群组账号。

-o         此选项允许添加一个使用非唯一 GID 的组。



#组相关文件
       /etc/group
           组账户信息。

       /etc/gshadow
           安全组账户信息。

       /etc/login.defs
           Shadow 密码套件配置。
```

- **groupmod** 修改群组信息

```
命令介绍
       groupmod - 修改组信息

命令语法
       groupmod [选项] GROUP

命令选项
-g GID       修改群组账号的标识符。GID 就是新的标识符。
-n NEWNAME   用来修改群组的名称。NEWNAME 就是新的组名。
```

- **groupdel** 删除群组账号

```
命令介绍
	groupdel - 删除一个组

命令语法
	groupdel [选项] GROUP

命令选项
-f   强制
```

**您不能移除现有用户的主组。在移除此组之前，必须先移除此用户。**