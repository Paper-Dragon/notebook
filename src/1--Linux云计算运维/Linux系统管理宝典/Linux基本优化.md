## 一、selinux和防火墙优化

### 1、SElinux

selinux 安全增强型 Linux（Security-Enhanced Linux）简称 SELinux，它是一个 Linux 内核模块，也是 Linux 的一个安全子系统。SELinux 主要由美国国家安全局开发。它的主要 作用就是最大限度地减小系统中服务进程可访问的资源（最小权限原则）。也由于它的这个原则，导致我们很多操作无法正确的执行，所以对于初学者而言在会用selinux之前我们要把这个子系统关闭

**SELinux 的工作模式**

SELinux 有三种工作模式，分别是：

```
- enforcing：强制模式。违反 SELinux 规则的行为将被阻止并记录到日志中。

- permissive：宽容模式。违反 SELinux 规则的行为只会记录到日志中。一般为调试用。

- disabled：关闭 SELinux。
```

**SElinux工作模式设置方法**

- 临时设置
	enforcing 和 permissive 模式可以通过 setenforce 1|0 命令快速切换,重启系统后失效。
- 永久生效
	SELinux 工作模式可以在 /etc/selinux/config 中设定。

```
如果想从 disabled 切换到 enforcing 或者 permissive 的话，需要重启系统。反过来也一样。
```

需要注意的是，如果系统已经在关闭 SELinux 的状态下运行了一段时间，在打开 SELinux 之后的第一次重启速度可能会比较慢。因为系统必须为磁盘中的文件创建安全上下文，我们现在来看一下如何关闭selinux，首先用root的身份登录系统，打开一个终端输入gedit /etc/selinux/config命令，回车之后会打开一个文件，将所标记出来部分的enforcing改为disabled，保存之后重启linux系统

```
[root@zutuanxue ~]# gedit /etc/selinux/config

##/etc/selinux/config  内容
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=enforcing     #这里定义selinux是否为开启状态

# SELINUXTYPE= can take one of these three values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected. 
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted   #这里定义的是selinux保护级别
```

重启登录之后可以使用sestatus -v命令去查看是否成功，如果看到的状态不是disabled则需要重新操作

```
[root@zutuanxue ~]# sestatus -v
SELinux status:                 disabled
```

### 2、防火墙

防火墙技术是通过有机结合各类用于安全管理与筛选的软件和硬件设备，帮助计算机网络于其内、外网之间构建一道相对隔绝的保护屏障，以保护用户资料与信息安全性的一种技术。 在CentOS8中使用firewalld作为防火墙，基于iptables的防火墙被默认不启动，但仍然可以继续使用。CentOS8中有几种防火墙共存：firewalld、iptables、ebtables等，默认使用firewalld作为防火墙，通过firewall-cmd工具来管理netfilter,不过底层调用的命令仍然是iptables，虽然防火墙是安全软件，但是它的一些默认设置会对初学者造成困扰，所以我们要先关闭firewalld。通过systemctl stop firewalld.service停止防火墙，systemctl disable firewalld.service禁止防火墙服务开机启动，接下来我们看一下如何设置中文

![1571044294838.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389727708.png)

## 二、中文设置优化

我们在安装系统选择的是中文，但是我们系统当中并没有中文输入法，所以如果要想输入中文的话需要添加中文输入法，以root用户身份登录系统之后我们使用gedit /etc/yum.repos.d/server.repo,输入如下内容保存退出，确保虚拟机的光驱中加载的是CentOS8的光盘镜像，并且已连接
![1571048414719.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389773586.png)
![1571047694890.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389785159.png)

设置完成之后执行mkdir命令建立目录，然后挂载光盘

![1571047821170.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389813049.png)

光盘挂载完成之后执行输入法安装命令，如果只要拼音则安装的是： ibus-libpinyin.x86_64

```
# 安装所有支持的输入法
[root@zutuanxue ~]# dnf install ibus* -y

# 或者 精准安装拼音输入法
[root@zutuanxue ~]#  dnf install ibus-libpinyin.x86_64 -y
```

等待软件包安装完成之后重启系统然后重新登录

```
如果不想重启系统可以使用

[root@zutuanxue ~]# ibus restart 

命令重启ibus-daemon进程来实现
```

![1571048752409.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389829983.png)

安装完成之后点击右上角的按钮然后点击设置

![1571048826875.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389850869.png)

在新打开的窗口中找到语言，选择添加，选择汉语，然后选择一个适合自己的中文输入法点击添加之后就可以使用中文输入法了

![1571048904227.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389866470.png)

![1571049215146.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389893147.png)

![1571049244944.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389909572.png)

输入法设置完成之后，我们来看下时间相关的设置

## 三、网络时间服务器优化

如果系统的时间不准，自己手动设置起来比较麻烦，我们可以看下怎么来优化一下

同样还是找到设置，在里面找到详细信息，展开之后可以看到日期和时间的设置，两个自动设置的选项打开，如果你的虚拟机可以联网的话，过一会就会看到时间正常了

![1571049564017.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389925235.png)

![1571049605979.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389936841.png)
![1571049727212.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389949009.png)

## 四、自启动服务优化

自启动服务优化的方式类似我们之前提到的停止firewalld，但是首先我们要确认一下有哪些服务是开机启动的，然后利用之前用过的systemctl stop servername和systemctl disabled servername这两条命令停止相应的服务，比如说蓝牙服务和防火墙服务，但是各位需要注意的是，这里面所涉及的服务在你不了解的前提下不要乱停止，否则可能会导致系统功能失灵，甚至是崩溃
![1571050099841.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/11/1602389969693.png)