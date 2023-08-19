## 一、部署前准备

- 部署机器准备
- 计算机名解析
- 关闭防火墙、selinux
- 时间同步
- 软件包获得
- ssh免密登陆

**约定事项：**

1. 所有服务器全部采用静态ip

	| 主机名称 | IP地址            |
	| -------- | ----------------- |
	| manage01 | 192.168.98.200/24 |
	| node1    | 192.168.98.201/24 |
	| node2    | 192.168.98.202/24 |
	| node3    | 192.168.98.203/24 |

2. 主机名及主机名互相绑定

	```
	[root@manage01 ~]# cat /etc/hosts
	127.0.0.1   localhost
	::1         localhost 
	192.168.98.200	manage01
	192.168.98.201	node1
	192.168.98.202	node2
	192.168.98.203	node3
	
	其他机器同理
	```

3. 关闭防火墙, selinux

	```
	[root@manage01 ~]# systemctl disable firewalld
	[root@manage01 ~]# sed -i -r '/SELINUX=/c\SELINUX=disabled' /etc/selinux/config
	[root@manage01 ~]# reboot
	
	
	其他机器同理
	```

4. 采用时间服务器，时间同步

	```
	1、修改配置文件，配置时间服务器为阿里云的时间服务器
	[root@manage01 ~]# egrep "^server" /etc/chrony.conf 
	server ntp1.aliyun.com
	server ntp2.aliyun.com
	server ntp3.aliyun.com
	server ntp4.aliyun.com
	
	#注释
	# pool 2.centos.pool.ntp.org iburst
	
	2、重启服务chronyd
	[root@manage01 ~]# systemctl restart chronyd.service 
	
	3、查看源信息
	#chronyc chrony的命令行客户端
	[root@manage01 ~]# chronyc sources -v
	210 Number of sources = 2
	
	  .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
	 / .- Source state '*' = current synced, '+' = combined , '-' = not combined,
	| /   '?' = unreachable, 'x' = time may be in error, '~' = time too variable.
	||                                                 .- xxxx [ yyyy ] +/- zzzz
	||      Reachability register (octal) -.           |  xxxx = adjusted offset,
	||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
	||                                \     |          |  zzzz = estimated error.
	||                                 |    |           \
	MS Name/IP address         Stratum Poll Reach LastRx Last sample               
	===============================================================================
	^? 120.25.115.20                 2   6     1     3   +663us[ +663us] +/-   23ms
	^? 203.107.6.88                  2   6     1     2  -1326us[-1326us] +/-   17ms
	```

5. 确认和配置yum源(需要epel源)

	```
	[root@manage01 ~]# yum -y install epel-*
	```

	6.ssh远程连接

	管理端和被管理端连接时基于ssh的，所以有两种连接方式

	1）基于ssh口令

	2）基于ssh证书（重点讲解）

	如果想不需要运维人员干预，被管理端必须允许管理端证书免密登陆。

6. ```
	#管理端manage01生成ssh公私钥
	[root@manage01 ~]# ssh-keygen 
	Generating public/private rsa key pair.
	Enter file in which to save the key (/root/.ssh/id_rsa): 
	Enter passphrase (empty for no passphrase): 
	Enter same passphrase again: 
	Your identification has been saved in /root/.ssh/id_rsa.
	Your public key has been saved in /root/.ssh/id_rsa.pub.
	The key fingerprint is:
	SHA256:aufJno2QjPK/V63/PVW13h5oWlKu0jk7HesXYTho0gM root@manage01
	The key's randomart image is:
	+---[RSA 2048]----+
	|                 |
	|         E      .|
	|          o . . o|
	|         . = + +.|
	|        S o.+ = +|
	|     o o  ...* +o|
	|  . . * ....O o.+|
	|   o . =.*.B o +.|
	|    ..o+B oo*oo o|
	+----[SHA256]-----+
	
	#将公钥传给node1
	[root@manage01 ~]# ssh-copy-id -i .ssh/id_rsa.pub root@192.168.98.201
	/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: ".ssh/id_rsa.pub"
	The authenticity of host '192.168.98.201 (192.168.98.201)' can't be established.
	ECDSA key fingerprint is SHA256:u+yOQz+E+eF7Oixdz/vClLXlAEu/7K8jy783gzk20dQ.
	ECDSA key fingerprint is MD5:c0:80:1b:ae:93:32:c2:66:f5:da:2f:1c:26:1e:7e:f8.
	Are you sure you want to continue connecting (yes/no)? yes
	/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
	/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
	root@192.168.98.201's password: 
	
	Number of key(s) added: 1
	
	Now try logging into the machine, with:   "ssh 'root@192.168.98.201'"
	and check to make sure that only the key(s) you wanted were added.
	
	#将公钥传给node2
	[root@manage01 ~]# ssh-copy-id -i .ssh/id_rsa.pub root@192.168.98.202
	/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: ".ssh/id_rsa.pub"
	The authenticity of host '192.168.98.202 (192.168.98.202)' can't be established.
	ECDSA key fingerprint is SHA256:X4JeiiFuwV0cja81veAyGCosriEfZm/zv34cfYkuxmU.
	ECDSA key fingerprint is MD5:7d:17:0f:80:d5:2b:30:ec:2c:62:f9:79:6b:fb:5f:bc.
	Are you sure you want to continue connecting (yes/no)? yes
	/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
	/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
	root@192.168.98.202's password: 
	
	Number of key(s) added: 1
	
	Now try logging into the machine, with:   "ssh 'root@192.168.98.202'"
	and check to make sure that only the key(s) you wanted were added.
	
	#将公钥传给node3
	[root@manage01 ~]# ssh-copy-id -i .ssh/id_rsa.pub root@192.168.98.203
	/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: ".ssh/id_rsa.pub"
	The authenticity of host '192.168.98.203 (192.168.98.203)' can't be established.
	ECDSA key fingerprint is SHA256:PtpsYBjaXkE+o3j8QYU5Ju8uPgcW2lVW8wsx4X1PV/c.
	ECDSA key fingerprint is MD5:50:a1:63:a0:ef:e7:61:26:11:25:ae:06:ec:93:cb:18.
	Are you sure you want to continue connecting (yes/no)? yes
	/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
	/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
	root@192.168.98.203's password: 
	
	Number of key(s) added: 1
	
	Now try logging into the machine, with:   "ssh 'root@192.168.98.203'"
	and check to make sure that only the key(s) you wanted were added.
	
	
	
	
	小窍门
	免交互创建公私钥
	[root@manage01 ansible]# ssh-keygen -f /root/.ssh/id_rsa -N ""   
	-f 指定密钥存放路径
	-N ""  新密码设置问空
	-P ""  老密码是什么
	
	
	如何可以非交互式传公钥呢
	[root@manage01 ansible]# yum -y install sshpass
	[root@manage01 ansible]# sshpass -p111111 ssh-copy-id -o StrictHostKeyChecking=no -i /root/.ssh/id_rsa.pub root@192.168.98.202 
	
	
	StrictHostKeyChecking   严厉的主机监测=no  就不会问你yes|no了 
	sshpass 非交互式传密码
	
	
	测试证书是否生效
	[root@manage01 ~]# for i in `seq 201 203`;do
	> ssh root@192.168.98.$i "hostname"
	> done
	node1
	node2
	node3
	
	看到返回客户端的计算机名称
	```

## 二、ansible管理端部署

### 2.1）管理端安装ansible

安装方式:

1）yum

```
[root@manage01 ~]# yum -y install ansible
[root@manage01 ~]# ansible --version
ansible 2.8.5
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python3.6/site-packages/ansible
  executable location = /usr/bin/ansible
  python version = 3.6.8 (default, May 21 2019, 23:51:36) [GCC 8.2.1 20180905 (Red Hat 8.2.1-3)]
```

2） 源码

```
1、官网下载地址：https://releases.ansible.com/ansible
[root@manage01 ~]# wget https://releases.ansible.com/ansible/ansible-2.9.3.tar.gz
2、安装ansible
[root@manage01 ~]# tar xf ansible-2.9.3.tar.gz 
[root@manage01 ~]# mv ansible-2.9.3 /opt/ansible
[root@manage01 ~]# cd /opt/ansible-2.9.3
#python软件包安装--1、安装依赖
[root@manage01 ansible-2.9.0rc3]# pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
[root@manage01 ansible]# ln -s /usr/bin/pip3 /usr/bin/pip
#python软件包安装--2、安装软件
[root@manage01 ansible-2.9.0rc3]# pip install --user ansible -i https://pypi.tuna.tsinghua.edu.cn/simple/

#安装后设置
[root@manage01 ~]# ln -s /usr/bin/python3 /usr/bin/python
[root@manage01 ~]# ln -s /opt/ansible/bin/* /usr/bin/
[root@manage01 ~]# cp /opt/ansible/examples/ansible.cfg /etc/ansible/
[root@manage01 ~]# cp /opt/ansible/examples/hosts /etc/ansible/
```

**FAQ1**

```
[root@manage01 ansible-2.9.0rc3]# ./bin/ansible -m ping 192.168.98.201
 [WARNING]: No inventory was parsed, only implicit localhost is available

 [WARNING]: provided hosts list is empty, only localhost is available. Note that
the implicit localhost does not match 'all'

 [WARNING]: Could not match supplied host pattern, ignoring: 192.168.98.201
 
 触发原因
 执行ansible的时候回去读取客户端文件hosts，如果没有把客户端加入到hosts文件，就说明无法ansible无法管理。
 
 解决方案
 [root@manage01 ansible]# mkdir /etc/ansible
 [root@manage01 ansible]# cp examples/hosts /etc/ansible/
 #将需要管理的客户端IP地址写入hosts文件,可以分组或者直接写
 [root@manage01 ~]# cat /etc/ansible/hosts 
 192.168.98.[201:203]
 
 分组
 [group1]
192.168.98.[201:203]
```

### 2.2）ansible管理服务器部署

管理端ansible目录：/etc/ansible

```
[root@manage01 ansible]# tree 
.
├── ansible.cfg           #ansible配置文件,不需要配置
├── hosts									#主机列表
└── roles                 #角色列表

1 directory, 2 files
```

### 2.3）部署主机列表，定义被监控机

```
[root@manage01 ansible]# egrep -v "(^#|^$)" /etc/ansible/hosts 
[group1]					#名字可以随便起  后面跟上业务机器的IP地址或者域名
192.168.98.201
192.168.98.202
192.168.98.203
```

**关于业务机器分组**

```
分组中使用范围
[nginx]					组名
apache[1:10].aaa.com	表示apache1.aaa.com到apache10.aaa.com这10台机器
nginx[a:z].aaa.com		表示nginxa.aaa.com到nginxz.aaa.com共26台机器
10.1.1.[11:15]			表示10.1.1.11到10.1.1.15这5台机器



如果业务机器的SSH端口不是22
10.1.1.13:2222			表示10.1.1.13这台，但ssh端口为2222


指定业务机器别名，未做免密登陆的机器可以通过下面的机器设置账号密码
nginx1  ansible_ssh_host=10.1.1.13 ansible_ssh_port=2222 ansible_ssh_user=root ansible_ssh_pass="123456"

ansible_ssh_host  指定业务机器的IP或域名
ansible_ssh_port  指定业务机器的ssh端口
ansible_ssh_user  指定业务机器的ssh用户名
ansible_ssh_pass  指定业务机器的ssh用户名密码


利用机器别名分组
nginx1  ansible_ssh_host=10.1.1.13 ansible_ssh_port=2222 ansible_ssh_user=root ansible_ssh_pass="123456"
nginx2  ansible_ssh_host=10.1.1.12

[nginx]
nginx1    #写服务器别名
nginx2


[root@manage01 ansible]# egrep -v "(^#|^$)" /etc/ansible/hosts 
#别名定义
web1 ansible_ssh_host=192.168.98.203 ansible_ssh_port=12121

#分组
[group1]
192.168.98.201
#未做免密登陆机器
192.168.98.202:12121 ansible_ssh_user=sko ansible_ssh_pass='123'
#别名机器
web1 ansible_ssh_user=sko ansible_ssh_pass='123'
```

### 2.4）测试管理机和业务机器的联通性

```
我们可以使用ansible通过调用ping模块来测试分组机器或某个机器
-m 指定使用的模块   group1  业务机器分组
#测试单个机器
#测试主机列表中的机器


#测试单个机器方法
[root@manage01 ~]# ansible -m ping 192.168.98.201
192.168.98.201 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false,
    "ping": "pong"
}

#测试主机列表中的机器方法
[root@manage01 ~]# ansible -m ping group1
192.168.98.201 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false,
    "ping": "pong"
}
192.168.98.203 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false,
    "ping": "pong"
}
192.168.98.202 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false,
    "ping": "pong"
}
```

## 三、学习视频

[视频：部署前准备](https://www.bilibili.com/video/BV19J41167sM?p=6)
[视频：ssh证书互信设置](https://www.bilibili.com/video/BV19J41167sM?p=7)
[视频：ansible平台部署](https://www.bilibili.com/video/BV19J41167sM?p=8)
[视频：主机列表文件hosts文件](https://www.bilibili.com/video/BV19J41167sM?p=9)
[视频：ansible自动化平台部署知识图谱](https://www.bilibili.com/video/BV19J41167sM?p=10)