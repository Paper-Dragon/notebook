账号犹如一张通行证，有了账号你才能顺利的使用Linux。不过 Linux 怎么确认使用某账号的人，是这个账号的真正拥有者呢？此时Linux 会根据用户的密码，来确认用户的身份。Linux 的用户账号与群组账号都可设置密码。用户账号的密码用来验证用户的身份；而群组账号的密码则是用来确认用户是否为该群组的成员，以及确认是否为该群组的管理者。

在 Linux 中，使用 useradd 新建一个用户账号时，useradd 会锁定用户的密码，如此一来，用户暂时不能使用 。你必须要修改其密码后，新建的用户才能用他的账号登录。要修改用户账号的密码需要使用passwd命令

- passwd命令

```
命令介绍
	修改用户密码

命令语法
	passwd [选项] 用户

命令选项
-d     删除用户密码，亦即把文件中的密码字段清空。

-l     这个参数用来锁定账号，账号一经锁定，用户再怎样输入密码，都会被判断为错误。这个参数只能由 root 使用，普通用户无法用来锁定自己的账号。

-u     解锁用户
```

除了可以修改用户账号的密码外，你也可以为每一个群组设置一个密码，这个密码称为群组密码（Group Password）。Linux 的用户，可以通过 newgrp 暂时修改其主要群组的身份。执行 newgrp 时，会以指定的群组身份，开启一个登录 Shell，这样就可以获得暂时修改主要群组之功效。此时，如果该群组没有指定密码，那么 Linux 只允许群组的成员可以使用 newgrp修改主要群组的身份；如果群组设置了密码，群组成员仍可以不用密码就可切换主要群组身份，但非群组的成员，则必须要提供正确的密码才行。

- gpasswd命令

```
命令介绍
	修改组密码,对群组管理

命令选项
-r     用来删除群组的密码。

-R     锁定 GROUP 的群组密码。

-A     设置组管理员

-a     添加组成员到组

-d     从组中 删除组成员


命令用法
指派群组管理员，如果有多个管理员用“，”分隔，如果想删除群组管理员，保持位置为空


组管理员用法案例
创建组admin

[root@zutuanxue ~]# groupadd admin

创建用户 ztxa ztxb ztxc

[root@zutuanxue ~]# useradd ztxa

[root@zutuanxue ~]# useradd ztxb

[root@zutuanxue ~]# useradd ztxc

设置ztxa为admin组的组管理员

[root@zutuanxue ~]# gpasswd -A ztxa admin


切换到ztxa   将ztxb ztxc加入 admin组

[root@zutuanxue ~]# su - ztxa -c "gpasswd -a ztxb admin"

正在将用户“ztxb”加入到“admin”组中

[root@zutuanxue ~]# su - ztxa -c "gpasswd -a ztxc admin"

正在将用户“ztxc”加入到“admin”组中


切换到ztxa  从admin组中删除ztxc

[root@zutuanxue ~]# su - ztxa -c "gpasswd -d ztxc admin"

正在将用户“ztxc”从“admin”组中删除
```