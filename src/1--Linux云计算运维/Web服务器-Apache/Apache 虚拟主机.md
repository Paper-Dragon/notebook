## 一、虚拟主机介绍

默认情况下,一个web服务器软件只能定义一个默认网站，也就是说只能发布一个WEB站点，对于大网站还可以，有海量用户来消耗服务器的资源，但是小网站呢？一个服务器上只跑一个小网站，服务器资源使用约等于0，那就尴尬了。为了充分利用服务器资源，现实生产环境中一般都是采用一个WEB服务器软件发布多个站点。如何解决这个问题呢？那就是配置虚拟主机！

虚拟主机和默认网站在apache中不能同时存在，只能存在一种，当虚拟主机出现后，apache默认网站就失效了，如果你还需要默认网站，就拿虚拟主机在发布一次默认网站对应的站点即可解决。

#### 虚拟主机应用场景：一个WEB服务器同时发布多个WEB站点

一个站点出现在网络中需要三个条件：监听IP、监听port、域名。

so

虚拟主机有三种实现方式

基于IP地址

基于监听端口

基于域名(host)

接下来我们就可以使用虚拟主机发布多个网站吧，大家在学习的同时要总结每种实现方式的特点及应用场景

## 二、基于IP的虚拟主机

step 1 修改主配置文件，打开虚拟主机子配置文件

```
[root@zutuanxue apache]# egrep "Include" conf/httpd.conf
#Include conf/extra/httpd-mpm.conf
#Include conf/extra/httpd-multilang-errordoc.conf
#Include conf/extra/httpd-autoindex.conf
#Include conf/extra/httpd-languages.conf
#Include conf/extra/httpd-userdir.conf
#Include conf/extra/httpd-info.conf
#
#把本行的#去掉
Include conf/extra/httpd-vhosts.conf
#
#
#Include conf/extra/httpd-manual.conf
#Include conf/extra/httpd-dav.conf
#Include conf/extra/httpd-default.conf
Include conf/extra/proxy-html.conf
#Include conf/extra/httpd-ssl.conf
```

step 2 设置基于IP的虚拟主机

1）给服务器配置多个IP，有几个虚拟主机及配置几个IP地址，我们实验用了两个虚拟主机，所以我有两个IP即可 192.168.11.251 192.168.11.252

[root@zutuanxue ~]# ifconfig ens33:1 192.168.11.252

2)创建两个WEB站点 WEB1 WEB2

[root@zutuanxue extra]# mkdir /usr/local/apache/htdocs/web{1…2}

\#生成两个测试页面

[root@zutuanxue extra]# echo web1 > /usr/local/apache/htdocs/web1/index.html

[root@zutuanxue extra]# echo web2 > /usr/local/apache/htdocs/web2/index.html

3)设置子配置文件

```
[root@zutuanxue extra]# cat httpd-vhosts.conf
<VirtualHost 192.168.11.251:80>
    DocumentRoot "/usr/local/apache/htdocs/web1"
    #ServerName dummy-host.example.com
    #ErrorLog "logs/dummy-host.example.com-error_log"
    #CustomLog "logs/dummy-host.example.com-access_log" common
</VirtualHost>

<VirtualHost 192.168.11.252:80>
    DocumentRoot "/usr/local/apache/htdocs/web2"
    #ServerName dummy-host2.example.com
    #ErrorLog "logs/dummy-host2.example.com-error_log"
    #CustomLog "logs/dummy-host2.example.com-access_log" common
</VirtualHost>
```

4)重启apache

[root@zutuanxue extra]# /usr/local/apache/bin/apachectl -t

Syntax OK

[root@zutuanxue extra]# killall httpd

[root@zutuanxue extra]# /usr/local/apache/bin/apachectl

5)测试

[root@zutuanxue ~]# elinks [http://192.168.11.251](http://192.168.11.251/) -dump

web1

[root@zutuanxue ~]# elinks [http://192.168.11.252](http://192.168.11.252/) -dump

web2

#### 基于IP的虚拟主机特点

不同IP对应不同网站

访问方便，用户直接使用默认端口即可访问

服务器需要有多个IP地址（一个公网IP大概一年的费用是600左右）

适合IP充足环境

## 三、基于prot的虚拟主机

环境还原,清除上个实验中的252IP

[root@zutuanxue ~]# ifconfig ens33:1 down

1）修改子配置文件

```
[root@zutuanxue extra]# cat httpd-vhosts.conf
<VirtualHost *:80>
    DocumentRoot "/usr/local/apache/htdocs/web1"
    #ServerName dummy-host.example.com
    #ErrorLog "logs/dummy-host.example.com-error_log"
    #CustomLog "logs/dummy-host.example.com-access_log" common
</VirtualHost>

#切莫忘了开端口
Listen 81
<VirtualHost *:81>
    DocumentRoot "/usr/local/apache/htdocs/web2"
    #ServerName dummy-host2.example.com
    #ErrorLog "logs/dummy-host2.example.com-error_log"
    #CustomLog "logs/dummy-host2.example.com-access_log" common
</VirtualHost>
```

2）重启服务

[root@zutuanxue extra]# /usr/local/apache/bin/apachectl -t

Syntax OK

[root@zutuanxue extra]# killall httpd

[root@zutuanxue extra]# /usr/local/apache/bin/apachectl

3）测试

[root@zutuanxue extra]# elinks [http://192.168.11.251:80](http://192.168.11.251/) -dump

web1

[root@zutuanxue extra]# elinks [http://192.168.11.251:81](http://192.168.11.251:81/) -dump

web2

#### 基于端口的虚拟主机特点

不同端口对应不同网站

访问需要加端口

节省IP地址

适合私网运行

## 四、基于域名的虚拟主机

1)设置多个域名，生产环境中如果我们可以直接在dns解析域名到主机IP，但是实验中我们没有域名和DNS，我就自己使用hosts文件做了个解析。

修改客户端hosts文件,解析域名 web1.zutuanxue.com 192.168.11.251 web2.zutuanxue.com 192.168.11.252

我就用本机做服务端和客户端，所以我修改本机251的hosts文件

[root@zutuanxue extra]# cat /etc/hosts

127.0.0.1 localhost localhost.localdomain localhost4 localhost4.localdomain4

::1 localhost localhost.localdomain localhost6 localhost6.localdomain6

192.168.11.251 web1.zutuanxue.com

192.168.11.251 web2.zutuanxue.com

2)修改虚拟主机配置文件

```
[root@zutuanxue extra]# cat httpd-vhosts.conf
<VirtualHost *:80>
    DocumentRoot "/usr/local/apache/htdocs/web1"
    ServerName web1.ayitula.com
    #ErrorLog "logs/dummy-host.example.com-error_log"
    #CustomLog "logs/dummy-host.example.com-access_log" common
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "/usr/local/apache/htdocs/web2"
    ServerName web2.ayitula.com
    #ErrorLog "logs/dummy-host2.example.com-error_log"
    #CustomLog "logs/dummy-host2.example.com-access_log" common
</VirtualHost>
```

\3) 重启服务

[root@zutuanxue extra]# /usr/local/apache/bin/apachectl -t

Syntax OK

[root@zutuanxue extra]# killall httpd

[root@zutuanxue extra]# /usr/local/apache/bin/apachectl

4）测试



[root@zutuanxue extra]# elinks [http://web1.zutuanxue.com](http://web1.zutuanxue.com/) -dump

web1

[root@zutuanxue extra]# elinks [http://web2.zutuanxue.com](http://web2.zutuanxue.com/) -dump

web2

#### 基于域名的虚拟主机特点

不同域名对应不同网站

需要多个域名 可以是二级或三级域名

每个站点使用默认端口，方便用户访问

只需要一个IP地址，节约成本

适合公网环境