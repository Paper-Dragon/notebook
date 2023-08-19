## 系统环境准备

系统：CentOS8

```
[root@zutuanxue ~]# sestatus -v
SELinux status:                 disabled
[root@zutuanxue ~]# systemctl status firewalld
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
     Docs: man:firewalld(1)
[root@zutuanxue ~]# dnf repolist
上次元数据过期检查：6:26:44 前，执行于 2020年04月02日 星期四 23时17分37秒。
仓库标识                    仓库名称                    状态
app                          app                      4,681
os           									os                      1,655
```

### Git安装部署

```
[root@zutuanxue ~]# dnf install git
Git 自带一个 git config 的工具来帮助设置控制 Git 外观和行为的配置变量。 这些变量存储在三个不同的位置:
[root@zutuanxue ~]# git config
--system	系统配置文件	配置内容会存放在/etc/gitconfig中，包含系统上每一个用户及他们的仓库的通用配置，需要管理员权限
--global	全局配置文件	配置内容会存放在~/.gitconfig或者~/.config/git/gitconfig中
--local		本地的配置文件 配置文件存放在git工作目录的.git/config中

注：配置文件的优先级local>global>system，可以使用git config -h去获取相关帮助，也可以使用git config --list --show-origin查看所有的配置及所在的文件。


[root@zutuanxue ~]# git config --global user.name "hello"
#定义git用户
[root@zutuanxue ~]# git config --global user.email "hello@localhost
#定义git使用的邮箱
[root@zutuanxue ~]# git config --global color.ui true
#定义语法高亮
[root@zutuanxue ~]# git config --list
user.name=hello
user.email=hello@localhost
color.ui=true
#查看定义的信息

[root@zutuanxue ~]# pwd
/root
[root@zutuanxue ~]# cat .gitconfig 
[user]
	name = hello
	email = hello@localhost
[color]
	ui = true
```

### git初始化

初始化工作目录、主要用来初始化一个空的git本地仓库。执行完上面的命令，当前目录下会自动生成.git隐藏文件夹，

```
#建立工作目录
mkdir git_data
cd git_data/

#初始化
git init

#查看工作区状态
git status
[root@zutuanxue git_data]# pwd
/root/git_data
[root@zutuanxue git_data]# git status 
位于分支 master
尚无提交
无文件要提交（创建/拷贝文件并使用 "git add" 建立跟踪）
隐藏文件介绍：
[root@zutuanxue git_data]# pwd
/root/git_data
[root@zutuanxue git_data]# ls -a
.  ..  .git
[root@zutuanxue git_data]# cd .git/
[root@zutuanxue .git]# ls
branches  config  description  HEAD  hooks  info  objects  refs

branches # 分支目录 
config  # 保存配置信息 
description # 仅供git web程序使用 
HEAD # 记录当前的分支指向 
hooks # 包含脚本文件 
info # 包含一个全局排除文件(exclude文件)，可以将不想被git处理的文件定义到exclude文件中 
objects # 存放所有数据内容 ，有info和pack两个子文件夹（实际也就是本地仓库的目录）
refs # 这个目录一般包括三个子文件夹，heads、remotes和tags，heads中的文件标识了项目中的各个分支指向的当前哪一个提交记录
index # 保存暂存区信息 ，在执行git init的时候 ，这个文件还没有（也就是暂存区的内容） 
```