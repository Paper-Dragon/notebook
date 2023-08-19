说到用户管理，就不得不提到shadow这个文件，shadow有三个功能：

- 隐藏密码
- 扩充密码的功能
- 提供账号管理工具

**隐藏密码：** 因为/etc/passwd和/etc/group文件的权限必须是0644，这意味着所有的用户都能读取到内容，所以为了安全起见，我们通过shaodw把用户和组的密码分别隐藏在/etc/shadow,/etc/gshadow文件中，且这两个文件只有管理员，也就是root能调用

**提供账号管理工具** ：我们之前所介绍的用户和组管理的相关命令，都是shadow所提供的工具

**扩充密码功能**： 这个扩充密码功能就是除了密码之外的额外功能，如，密码的有效期限，设置群组管理员（组长）等，这些都是记录在/etc/shadow,/etc/gshadow文件中

**/etc/shadow:** 存储用户密码及密码额外功能的文件

```
文件内容：
root:$6$T52Xvk7zu84.tDXp$nfXcm6LTfUx.ZviEo7Eq1bPjDO...::0:99999:7:::
bin:*:18027:0:99999:7:::
```

/etc/shadow文件的格式与/etc/passwd类似，也是每一行代表一个账号的数据，使用：进行分隔.

**内容详解**

```
USERNAME:PASSWORD:LAST_CHANGED:MIN_DAYS:MAX_DAYS:WARNNING:EXPIRES:INVALID:RESERVED

1、USERNAME：用户账号名称。

2、PASSWORD：加密后的密码。

3、LAST_CHANGED：密码最后一次修改的日期。

4、MIN_DAYS：密码修改的最小间隔天数。

5、MAX_DAYS：密码修改的最大天数。

6、WARNNING：密码过期前警告的天数。

7、EXPIRES：密码过期的日期

8、INVALID:	账号失效日期

9、RESERVED：保留位，未定义功能
```

这里面我们所提到的日期都是从1970年1月1日起经过的天数，所以我们看到的不是日期的格式，而是一组数字，我们接下来看下另一个文件

**/etc/gshadow:** 存储组密码及密码额外功能的文件

```
文件内容：
root:::
bin:::
daemon:::
```

**内容详解**

```
GROUPNAME:PASSWORD:ADMINISTRATORS:MEMBERS   

GROUPNAME:	组名

PASSWORD：	组密码

ADMINISTRATORS： 组长

MEMBERS：	组成员
```

除此之外用户管理还有一个简单的方法，那就是以root用户身份登录图形界面

![1571302990425.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602399129291.png)

![1571303014802.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602399151313.png)

**cockpit**

```
# systemctl start cockpit
http://localhost:9090
```

![image20200331143440902.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602399169696.png)

![image20200331143459395.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602399191502.png)

**管理密码的有效期限**

Shadow除了会把密码数据隐藏到其他文件、提供许多账号管理工具外，还允许你为账号或密码设置有效期限，以提高Linux 的安全性。目前的 Shadow 可以设置下列两种期限：

密码过期

一旦超过密码过期日期，用户成功的登录Linux 时，会强迫用户设置一个新的密码。设置完毕后，才会开启用户的 Shell 程序。设置密码过期的目的，在于提高 Linux 的安全性。

账号过期

若超过账号过期日期，Linux 会禁止用户登录系统，即使输入正确的密码，也无法登录。当账号过期时，Linux 会提示用户联系管理员修改账号过期日期。

```
Your account has expired; please contact your system administrator 	
```

我们可以使用chage命令来查看或调整这些相关的期限

- chage命令

```
[root@zutuanxue ~]# chage -l hello
最近一次密码修改时间					：从不
密码过期时间					：从不
密码失效时间					：从不
帐户过期时间						：从不
两次改变密码之间相距的最小天数		：0
两次改变密码之间相距的最大天数		：99999
在密码过期之前警告的天数	：7

chage
  -m	设置密码修改的最小天数
  -M	设置密码修改的最大天数
  -d	设置密码最后修改日期
  -I	设置密码过期后，锁定账号的天数
  -E	设置账号过期日期，0=立即过期，-1=永不过期
  -W	设置密码过期前的警告天数
  -l	查看指定用户的相关信息
  -h	帮助
```

![image20200331164400723.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602399247448.png)