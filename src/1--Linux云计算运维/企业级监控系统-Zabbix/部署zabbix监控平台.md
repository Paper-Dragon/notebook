通过前面的课程我们知道了zabbix的官网给我们提供了一个安装的指导流程，那我们按照这个流程来部署一下zabbix

- 部署zabbix监控平台
- 站点设置
- 界面介绍与用户管理

## 一、部署zabbix监控平台

a. 安装zabbix下载源

```
[root@zutuanxue ~]# rpm -Uvh https://repo.zabbix.com/zabbix/4.4/rhel/8/x86_64/zabbix-release-4.4-1.el8.noarch.rpm
[root@zutuanxue ~]# dnf clean all
```

b. 安装Zabbix server，Web前端，agent

```
[root@zutuanxue ~]# dnf -y install zabbix-server-mysql zabbix-web-mysql zabbix-apache-conf zabbix-agent

##
注意：如果国外的官方源下载失败或者速度慢，直接切换阿里的源即可
[root@zutuanxue ~]# cat /etc/yum.repos.d/zabbix.repo 
[zabbix]
name=Zabbix Official Repository - $basearch
baseurl=https://mirrors.aliyun.com/zabbix/zabbix/4.4/rhel/8/$basearch/
enabled=1
gpgcheck=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX-A14FE591

[zabbix-non-supported]
name=Zabbix Official Repository non-supported - $basearch 
baseurl=http://repo.zabbix.com/non-supported/rhel/8/$basearch/
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-ZABBIX
gpgcheck=1
##
```

c. 创建初始数据库

```
[root@zutuanxue ~]# systemctl restart mariadb.service 
[root@zutuanxue ~]# mysqladmin -u root password '123456'
[root@zutuanxue ~]# mysql -u root -p
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 9
Server version: 10.3.11-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> create database zabbix character set utf8 collate utf8_bin;
Query OK, 1 row affected (0.001 sec)

MariaDB [(none)]> grant all privileges on zabbix.* to zabbix@localhost identified by '123456';
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> quit
Bye

导入初始架构和数据
[root@zutuanxue ~]# zcat /usr/share/doc/zabbix-server-mysql/create.sql.gz | mysql -uzabbix -p zabbix
Enter password: 
```

d. 为Zabbix server配置数据库
编辑配置文件 /etc/zabbix/zabbix_server.conf

```
[root@zutuanxue ~]# vim /etc/zabbix/zabbix_server.conf 
DBPassword=123456
```

e. 为Zabbix前端配置PHP
编辑配置文件 /etc/php-fpm.d/zabbix.conf

```
[root@zutuanxue ~]# vim /etc/php-fpm.d/zabbix.conf 
php_value[date.timezone] = Asia/Shanghai
```

f. 启动Zabbix server和agent进程
启动Zabbix server和agent进程，并为它们设置开机自启：

```
[root@zutuanxue ~]# systemctl restart zabbix-server zabbix-agent httpd php-fpm
[root@zutuanxue ~]# systemctl enable zabbix-server zabbix-agent httpd php-fpm
[root@zutuanxue ~]# netstat -ntlp	#zabbix_server的端口是10051
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:10051           0.0.0.0:*               LISTEN      2106/zabbix_server  
tcp6       0      0 :::10051                :::*                    LISTEN      2106/zabbix_server  
```

g. 配置Zabbix前端
连接到新安装的Zabbix前端： http://server_ip_or_name/zabbix

## 二、站点设置

![image20200206131850564.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529129928.png)

图：zabbix-web-setup-01

![image20200206132044127.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528792468.png)

图：zabbix-web-setup-02

![zabbix_web3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528835307.png)

图：zabbix-web-setup-03

![zabbix_web4.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528855897.png)

图：zabbix-web-setup-04

![zabbix_web5.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528868438.png)

图：zabbix-web-setup-05

![zabbix_web6.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528880574.png)

图：zabbix-web-setup-06

![image20200206132343605.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528902697.png)

图：zabbix-web-setup-07

![image20200206132450564.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528915822.png)

图：zabbix-web-setup-08

![image20200206132720327.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528929618.png)

![image20200206132751747.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528945191.png)

![image20200206132813412.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528963513.png)

## 三、zabbix web界面介绍

我们现在已经登录了zabbix的页面，并且设置成了中文，那我们一起来看一下这个设置成中文后的界面

监测—仪表盘

 在仪表板当中我们可以查看到很多信息，如果感觉信息不够丰富的话，在右上角可以选择编辑仪表盘，添加新的内容。

可以挨着点一下后面的选项，都是没有内容的，这个我们后面都会说到

监测—图形

在这里可以查看各种类型的图表，比如

![image20200206133841844.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529260849.png)

通过右上方的时间选项你可以获取到不同时间范围的信息，这就是可持续化的体现，因为这些数据都存放到数据库里面了，但是不管选择哪个时间范围的，你都会发现有乱码，为什么会有乱码？因为没有相关的字库，所以我们要解决乱码的问题

关于zabbix web设置成中文后图形上的汉字显示乱码问题-解决方案。

```
复制本地电脑C:\Windows\Fonts\simkai.ttf（楷体）上传到zabbix服务器
[root@zutuanxue ~]# cp SIMKAI.TTF /usr/share/fonts/dejavu/
[root@zutuanxue ~]# chmod 644 /usr/share/fonts/dejavu/SIMKAI.TTF 
[root@zutuanxue ~]# cd /etc/alternatives/
[root@zutuanxue alternatives]# rm -fr zabbix-web-font
[root@zutuanxue alternatives]# ln -s /usr/share/fonts/dejavu/SIMKAI.TTF /etc/alternatives/zabbix-web-font

刷新页面
```

## 四、监控本机

zabbix默认就是对本机进行监控的，但是一定要开启zabbix-agent服务，在对应的界面，我们可以看到，zabbix的监控有四种：

- ZBX
- SNMP
- JMX
- IPMI

![image20200216003900217.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529384793.png)

- 绿色表示正常
- 红色则表示有问题
	如果出现红色了，首先要检查系统中是否安装了zabbix-agent软件包，然后再确认服务是否开启，第三个要检查状态是否已启用。各位可以尝试停止zabbix-agent服务，并且点击一下状态下的已启用按钮改为停用，看一下彻底不好用是什么样的。

```
systemctl stop zabbix-agent
```

![image20200216004245599.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603529402589.png)