## 一、GitLab简介

GitLab 是一个用于仓库管理系统的开源项目。使用Git作为代码管理工具，并在此基础上搭建起来的web服务。可通过Web界面进行访问公开的或者私人项目。它拥有与Github类似的功能，能够浏览源代码，管理缺陷和注释。可以管理团队对仓库的访问，它非常易于浏览提交过的版本并提供一个文件历史库。团队成员可以利用内置的简单聊天程序(Wall)进行交流。它还提供一个代码片段收集功能可以轻松实现代码复用。

gitlab主要用于私用，github主要用于公网，都可看成web版的git

Community Edition or Enterprise Edition，ce和ee分别指的是社区版和企业版，毫无疑问社区版已经能满足我们的需求了。

**常用的网站**

官网 ： https://about.gitlab.com/

https://packages.gitlab.com/gitlab/gitlab-ce CE版下载地址

https://packages.gitlab.com/gitlab/gitlab-ee EE版下载地址

国内镜像 ：https://mirrors.tuna.tsinghua.edu.cn/gitlab‐ce/yum/

![image20200407140627737.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603182391691.png)

![image20200407140745198.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603182403362.png)

## 二、安装与配置

- 环境：CentOS 8
- 关闭selinux和防火墙

**2.1、** 安装依赖包

```
dnf install -y curl policycoreutils openssh-server postfix
systemctl enable sshd
systemctl start sshd
systemctl enable postfix
systemctl start postfix
```

**2.2、** 联网安装

```
[root@zutuanxue ~]# vim /etc/yum.repos.d/gitlab-ce.repo 
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el$releasever/
gpgcheck=0
enabled=1

[root@zutuanxue ~]# dnf install gitlab-ce -y


（
如果安装比较慢的话也可以从https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el8/下载rpm包到本地进行安装
[root@zutuanxue ~]# yum localinstall gitlab-ce-12.9.2-ce.0.el8.x86_64.rpm 
）
```

**2.3**、配置

```
[root@zutuanxue ~]# vim /etc/gitlab/gitlab.rb 
external_url 'http://192.168.2.100'


#修改为本机的名称或者IP地址

###(
GitLab默认会占用80、8080和9090端口，如果服务器上还有tomcat、Jenkins等其他服务，可能会遇到端口冲突,如果想修改端口的话可以
external_url 'http://192.168.2.100:自定义端口'
unicorn['port'] = xxx
prometheus['listen_address'] = 'localhost:xxx'
将xxx更换成自己需要使用的端口
###)
[root@zutuanxue ~]# gitlab-ctl reconfigure
#修改完成之后重新配置gitlab
```

#### 命令和目录

/opt/gitlab/ # gitlab的程序安装目录

/var/opt/gitlab # gitlab数据目录

/var/opt/gitlab/git‐data # 存放仓库数据

| 命令          | function                   |
| :------------ | :------------------------- |
| start         | 启动所有服务               |
| stop          | 关闭所有服务               |
| restart       | 重启所有服务               |
| status        | 查看所有服务状态           |
| tail          | 查看日志信息               |
| service-list  | 查看所有启动服务           |
| graceful-kill | 平稳停止一个服务           |
| help          | 帮助                       |
| reconfigure   | 修改配置文件之后，重新加载 |
| show-config   | 查看所有服务配置文件信息   |
| uninstall     | 卸载这个软件               |
| cleanse       | 清空gitlab数据             |

```
[root@zutuanxue ~]# gitlab-ctl start
ok: run: alertmanager: (pid 1564) 3804s
ok: run: gitaly: (pid 1550) 3804s
[root@zutuanxue ~]# gitlab-ctl start nginx
ok: run: nginx: (pid 1531) 3823s

#这些操作指令，如果不指定名称的话，默认会操作所有
```

#### Gitlab的服务构成

```
[root@zutuanxue ~]# gitlab-ctl service-list
gitaly*	git RPC服务，用于处理gitlab发出的git调用
gitlab-workhorse*	轻量级的反向代理服务器
logrotate*	日志文件管理工具
nginx*	静态web服务
postgresql*	数据库
redis*	缓存数据库
sidekiq*	用于在后台执行队列任务
unicorn*	用Ruby编写的web server，GitLab Rails应用是托管在这个服务器上面
alertmanager*，gitlab-exporter*，grafana*，node-exporter*，postgres-exporter*，prometheus*，redis-exporter*	#与监控相关的插件
```

在浏览器中访问本机，就可以打开登录界面，初次登录必须修改密码（不能少于8位），更改完成后可以使用管理员账号登录，用户名为root

**2.4**、gitlab汉化

1、浏览器设置中文后重新打开

2、点击右上角头像，选择设置（settings）

3、左边选择preferences–>languages—>save

4、刷新页面

如果还是有问题

```
[root@zutuanxue ~]# dnf groupinstall chinese-support#安装中文支持
[root@zutuanxue ~]# dnf install ibus*	#安装输入法
#重启后在系统设置更改语言环境为中文
```

![image20200407163323541.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603182523810.png)