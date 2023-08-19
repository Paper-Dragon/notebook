看过了对本机的监控之后，我们来看一下zabbix的用户，Zabbix有多个默认的用户群组，其中最常用的是Zabbix administrators超级管理员组，其它的几乎没什么用。

安装完zabbix后，已经自带了两个用户

- Admin
- Guests

**超级管理员默认账号：** Admin，密码：zabbix，这是一个超级管理员。

**Guests用户:** 使用guest账号，密码为空，只能看到zabbix后台，没有具体内容。我们可以启用来宾账户，使用来宾账户登录到zabbix页面看一下。

**用户群组：** 群组的增删改查，和权限管理

**用户管理：** 用户增删改查、用户报警媒介管理、用户权限查看。

要添加一个用户，有三类属性要填写。

| 属性         | 描述                                     |
| ------------ | ---------------------------------------- |
| **用户信息** | 账号密码、所属组等基本信息               |
| **示警媒介** | 报警相关信息，例如邮箱地址、接受报警时段 |
| **许可权**   | 权限，当前用户对哪些主机有权限           |

zabbix 用户和权限类似windows，用户的有什么权限是组说了算

**案例：** 创建一个群组和用户

**群组创建**
选择 管理–>用户群组–>创建用户群组

![image20200206152939063.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529646527.png)

![image20200206153014812.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529662642.png)

![image20200206153034828.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529674722.png)

![image20200206153102222.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529685233.png)

**用户创建**

管理–>用户–>创建用户

![image20200206153449530.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529748943.png)

![image20200206153539824.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529760946.png)

![image20200206153750908.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529772009.png)

最后再点击添加

验证用户是否为只读权限

![image20200206154053192.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529783971.png)

由于新建的用户只有只读的权限，所以根本没有“配置”、“管理”字样的选项