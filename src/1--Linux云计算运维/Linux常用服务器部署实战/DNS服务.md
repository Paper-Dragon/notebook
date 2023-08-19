DNS：域名系统（英文：Domain Name System)是一个域名系统，是万维网上作为域名和IP地址相互映射的一个分布式数据库，能够使用户更方便的访问互联网，而不用去记住能够被机器直接读取的IP数串。类似于生活中的114服务，可以通过人名找到电话号码，也可以通过电话号码找到人名(生活中没有那么准确的原因是人名有重名，而域名是全世界唯一的)。

DNS协议运行在UDP协议之上，使用端口号53

```
域名:
域名是一个网站的逻辑地址，比如www.zutuanxue.com，相比IP地址更加方便人类记忆，所以被广泛使用。
```

## 一、DNS介绍

计算机的发展起源于上世纪60年代，最初只有美国的几所高校在使用，计算机之间通信需要知道对方的地址(IP地址)，但是人们对IP地址的记忆又是不敏感的(就像生活中你能记住多少个好友的手机号码一样)。为了方便人类记忆，大学的科学家们把计算机的名字和对应的IP地址写入到计算机中的hosts文件，以此文件来做解析。

但是随着计算机和网络的发展出现了局域网，计算机的数量随之增加；后来为了解决方便通信问题，我们使用了wins服务器来进行计算机名和IP的注册服务，通过一个名称服务器来自动管理局域网中的计算机，并提供解析服务。人们在局域网中通过计算机名就能连接到了对应的计算机。该技术中要求计算机名称必须唯一，正是由于这个原因使得局域网中的计算机又不能太多。

微型计算机的出现和局域网的发展推动了广域网的发展，hosts文件只能针对极少的计算机网络，wins可以管理局域网的解析。到了广域网，人们就迫切需要一个新的服务做解析服务器，使解析方便、快速、高效的应对广域网环境。为了解决广域网解析问题，美国人研发出了DNS服务，以及成立了管理DNS相关的机构，并提出了域名命名规则。

```
域名管理机构
Internet 域名与地址管理机构（ICANN）是为承担域名系统管理，IP地址分配，协议参数配置，以及主服务器系统管理等职能而设立的非盈利机构.
现由IANA和其他实体与美国政府约定进行管理。

域名分国际域名和国内域名两种，对于国际域名而言，其命名规则是：
域名可以由（a-z、A-Z大小写等价）26个英文字母、数字（0-9）以及连接符“-”组成，但是域名的首位必须是字母或数字。对于域名的长度也有一定
的限制：国际通用顶级域名长度不得超过26个字符，中国国家顶级域名长度不得超过20个字符
```

## 二、DNS的解析原理

目前，因特网的命名方法是层次树状结构的方法。采用这种命名方法，任何一个连接在因特网上的主机或设备，都有一个某一的层次结构的名字，即域名(domain name)。域是名字空间中一个可被管理的划分。域可以继续按层次划分为子域，如二级域、三级域等等。

![image20200114172132398.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602998062358.png)

## 三、DNS查询

递归查询:一般客户机和服务器之间属递归查询，即当客户机向DNS服务器发出请求后,若DNS服务器本身不能解析,则会向另外的DNS服务器发出查询请求，得到结果后转交给客户机；如果主机所询问的本地域名服务器不知道被查询的域名的IP地址，那本地 DNS就会扮演DNS客户的角色，去代理原客户去帮忙找根域名服务器发出请求，递归即递给服务器，所有操作都有服务器来完成。

迭代查询:一般DNS服务器之间属迭代查询，如：DNS1问DNS2,DNS2不知道会告诉DNS1一个DNS3的IP地址，让DNS1去问问DNS3知不知道，以此类推，就是迭代查询。

关于递归和迭代举个生活例子帮助大家理解：比如你问张老师一个问题，张老师告诉他答案这之间的叫递归查询。这期间也许张老师也不会，这时张老师问李老师，张老师去问崔老师，这之间的查询叫迭代查询！

![image20200114180942259.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602998078641.png)

正向查找：将域名解析为IP

```
  www.zutuanxue.com  ---> 118.190.209.153
```

反向查找：将IP解析为域名

```
  118.290.209.153  ---> www.zutuanxue.com
```

## 四、DNS服务器部署

**约定：本实验中使用过的机器为centos8.0_x86_64系统，IP地址192.168.11.16/24.请关闭防火墙和SELINUX。**

### 4.1）DNS安装

DNS服务是由bind程序提供的，所以要实现DNS服务就需要安装bind程序包。

```
[root@zutuanxue ~]# dnf -y install bind bind-chroot
bind  DNS主程序包
bind-chroot DNS安全包，改变默认DNS根目录，将DNS运行在监牢模式

说明:chroot监牢模式
监牢是一个软件机制，其功能是使得某个程序无法访问规定区域之外的资源，同样也为了增强安全性（LCTT 译注：chroot “监牢”，所谓“监牢”就是指通过chroot机制来更改某个进程所能看到的根目录，即将某进程限制在指定目录中，保证该进程只能对该目录及其子目录的文件进行操作，从而保证整个服务器的安全）。Bind Chroot DNS 服务器的默认“监牢”为 /var/named/chroot。
```

### 4.2）DNS启动

DNS的守护进程叫做named,DNS是以named用户身份来运行，named用户在安装包的时候会在系统中自动创建。

```
CentOS8下安装了bind-chroot之后，若要使用named-chroot.service，则需要关闭named.service。两者只能运行一个

方法一: 不使用chroot模式启动DNS
开启开机启动
[root@zutuanxue ~]# systemctl enable named
Created symlink from /etc/systemd/system/multi-user.target.wants/named.service to /usr/lib/systemd/system/named.service.

启动DNS服务
[root@zutuanxue ~]# systemctl start named

验证启动
[root@zutuanxue ~]# lsof -i :53
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
dnsmasq 1520 nobody    5u  IPv4  27001      0t0  UDP bogon:domain 
dnsmasq 1520 nobody    6u  IPv4  27002      0t0  TCP bogon:domain (LISTEN)
named   2553  named   21u  IPv4  38662      0t0  TCP localhost:domain (LISTEN)
named   2553  named   22u  IPv6  38664      0t0  TCP localhost:domain (LISTEN)
named   2553  named  512u  IPv4  38660      0t0  UDP localhost:domain 
named   2553  named  513u  IPv4  38660      0t0  UDP localhost:domain 
named   2553  named  514u  IPv4  38660      0t0  UDP localhost:domain 
named   2553  named  515u  IPv4  38660      0t0  UDP localhost:domain 
named   2553  named  516u  IPv6  38663      0t0  UDP localhost:domain 
named   2553  named  517u  IPv6  38663      0t0  UDP localhost:domain 
named   2553  named  518u  IPv6  38663      0t0  UDP localhost:domain 
named   2553  named  519u  IPv6  38663      0t0  UDP localhost:domain

方法二: 使用chroot模式DNS
将对应的文件移动到chroot根目录
主配文件
[root@zutuanxue ~]# cp /etc/named.conf /var/named/chroot/etc/
[root@zutuanxue ~]# chgrp named /var/named/chroot/etc/named.conf
[root@zutuanxue ~]# named-checkconf /var/named/chroot/etc/named.conf

区域数据库文件
[root@zutuanxue named]# cd /var/named/
[root@zutuanxue named]# cp -r data /var/named/chroot/var/named/
[root@zutuanxue named]# cp -r dynamic /var/named/chroot/var/named/
[root@zutuanxue named]# cp named.* /var/named/chroot/var/named/
[root@zutuanxue named]# cd /var/named/chroot/var/named/
[root@zutuanxue named]# chown -R named.named *


启动DNS服务
开机启动
[root@zutuanxue ~]# systemctl enable named-chroot.service 
Created symlink from /etc/systemd/system/multi-user.target.wants/named-chroot.service to /usr/lib/systemd/system/named-chroot.service.
启动服务
[root@zutuanxue ~]# mv /etc/named.conf /root/
[root@zutuanxue ~]# systemctl start named-chroot

验证启动
[root@zutuanxue ~]# lsof -i :53
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
dnsmasq 1525 nobody    5u  IPv4  27359      0t0  UDP bogon:domain 
named   2877  named   21u  IPv4  44717      0t0  TCP localhost:domain (LISTEN)
named   2877  named   22u  IPv4  44719      0t0  TCP bogon:domain (LISTEN)
named   2877  named   23u  IPv4  44721      0t0  TCP bogon:domain (LISTEN)
named   2877  named  512u  IPv4  44715      0t0  UDP localhost:domain 
named   2877  named  513u  IPv4  44715      0t0  UDP localhost:domain 
named   2877  named  514u  IPv4  44715      0t0  UDP localhost:domain 
named   2877  named  515u  IPv4  44715      0t0  UDP localhost:domain 
named   2877  named  516u  IPv4  44718      0t0  UDP bogon:domain 
named   2877  named  517u  IPv4  44718      0t0  UDP bogon:domain 
named   2877  named  518u  IPv4  44718      0t0  UDP bogon:domain 
named   2877  named  519u  IPv4  44718      0t0  UDP bogon:domain 
named   2877  named  520u  IPv4  44720      0t0  UDP bogon:domain 
named   2877  named  521u  IPv4  44720      0t0  UDP bogon:domain 
named   2877  named  522u  IPv4  44720      0t0  UDP bogon:domain 
named   2877  named  523u  IPv4  44720      0t0  UDP bogon:domain
```

### 4.3）DNS配置文件

默认情况下，如果不安装bind-chroot这个包，配置文件的路径如下：

配置文件:/etc/named.conf

区域数据库文件:/var/named/

由于我们安装了bind-chroot这个用于改变默认DNS配置文件的路径的包，所以相对应的配置文件的路径也发生了变化。

变化如下：

配置文件:/var/named/chroot/etc/named.conf

区域数据库文件:/var/named/chroot/var/named/

a、主配文件详解

```
//
// named.conf
//
// Provided by Red Hat bind package to configure the ISC BIND named(8) DNS
// server as a caching only nameserver (as a localhost DNS resolver only).
//
// See /usr/share/doc/bind*/sample/ for example named configuration files.
//


options
{
		
    #IPv4监听端口为53，只允许本机连接
    listen-on port 53    { 127.0.0.1; };
    #IPv6监听端口为53，只允许本机连接
    listen-on-v6 port 53    { ::1; };
		#定义工作目录
    directory         "/var/named"; 
    #CACHE文件路径,指定服务器在收到rndc dump命令时，转储数据到文件的路径。默认cache_dump.db
    dump-file         "data/cache_dump.db";
    #静态文件路径,指定服务器在收到rndc stats命令时，追加统计数据的文件路径。默认named.stats
    statistics-file     "data/named_stats.txt";
    #内存静态文件路径,服务器在退出时，将内存统计写到文件的路径。默认named.mem_stats
    memstatistics-file     "data/named_mem_stats.txt";
        #在收到rndc secroots指令后，服务器转储安全根的目的文件的路径名。默认named.secroots
    secroots-file        "data/named.secroots";
    # 指定服务器在通过rndc recursing命令指定转储当前递归请求到的文件路径。默认named.recursing
    recursing-file        "data/named.recursing";
    
    #指定允许哪些主机可以进行普通的DNS查询,可以是关键字:any/localhost/none,也可以是IPV4,IPV6地址
    allow-query        { localhost; };
    #指定允许哪些主机可以对缓存的访问
    allow-query-cache    { localhost; };

    /*
     - If you are building an AUTHORITATIVE DNS server, do NOT enable recursion.
    假如你建立的是一个权威DNS你不需要开启递归
     - If you are building a RECURSIVE (caching) DNS server, you need to enable recursion. 
    假如你建立的是一个递归DNS,你需要开启递归服务
     - If your recursive DNS server has a public IP address, you MUST enable access control to limit queries to your legitimate users. Failing to do so will
     如果你的递归DNS是具有公网IP，你必须要设置访问控制来限制对合法用户的查询.
       cause your server to become part of large scale DNS amplification 
    否则你的DNS会被大规模的攻击
       attacks. Implementing BCP38 within your network would greatly
    在您的网络中实现BCP38将非常重要减少此类攻击面
       reduce such attack surface 
     */
    #开启递归
    recursion yes;

    #开启DNSSEC在权威或者递归服务器之间信任服务
    dnssec-enable yes;

    #开启DNSSEC验证在递归服务器
    dnssec-validation yes;

    #指定目录，其中保存着跟踪被管理DNSSEC密钥文件。默认为工作目录。
    managed-keys-directory "/var/named/dynamic";
    
    #PID文件路径
    pid-file "/run/named/named.pid";
    #session-keyfile文件路径
    session-keyfile "/run/named/session.key";
};

logging 
{
#开启DNS日志记录
        channel default_debug {
                file "data/named.run";
                severity dynamic;
        };
};


   
    #定义一个根域
zone "." IN {
        #域类型为hint,还有master slave forward等类型
            type hint;
        #区域数据库文件路径
            file "/var/named/named.ca";
    };
};
    #包含两个子配置文件
    include "/etc/named.rfc1912.zones";
    include "/etc/named.root.key";
```

b、区域数据库文件详解

```
正向解析
[root@zutuanxue ~]# cat /var/named/named.localhost 
;缓存时间
$TTL 1D
;@表示相应的域名
	@    				IN 	SOA        @ 					rname.invalid. (
;解析的域名   类型 授权域    授权域名服务器   管理员邮箱
                    0    ; serial  
         序列号,每次更新该文件系列号都应该变大
                    1D    ; refresh 
刷新时间,即规定从域名服务器多长时间查询一个主服务器，以保证从服务器的数据是最新的
                    1H    ; retry   
重试时间,即当从服务试图在主服务器上查询更时，而连接失败了，则这个值规定了从服务多长时间后再试 
                    1W    ; expire  
   过期时间,从服务器在向主服务更新失败后多长时间后清除对应的记录
                    3H )    ; minimum 
   这个数据用来规定缓存服务器不能与主服务联系上后多长时间清除相应的记录
    NS   				@
    ;NS 名称服务器，表示这个主机为域名服务器
    			A    		127.0.0.1
;主机头  	A记录   	IP
    AAAA    		::1
;   AAAA 				解析为IPV6地址

#反向解析
[root@zutuanxue ~]# cat named.loopback 
$TTL 1D
@    IN SOA    @ rname.invalid. (
                    0    ; serial
                    1D    ; refresh
                    1H    ; retry
                    1W    ; expire
                    3H )    ; minimum
    NS    		@
    PTR    		localhost
;IP 反向指针     主机名
;PTR 反向指针 反解
```

## 五、部署一个正向解析

### 5.1）教学案例

**对zutuanxue.com域名做解析，解析要求如下：**

**www 解析为A记录 IP地址为 192.168.11.88**

**news 做别名解析CNAME 解析为 www**

```
1）主配置文件
[root@zutuanxue ~]# cat /var/named/chroot/etc/named.conf 
options {
    listen-on port 53 { any; };
    directory     "/var/named";
};

//定义根域
//用于DNS向根递归查询
zone "." IN {
    type hint;
    //保存了DNS根级服务器的地址
    file "named.ca";
};

//定义一个主域
//注意每行都要;结尾
zone "zutuanxue.com" IN {
//类型为master
    type master;
//区域数据库文件名称
    file "zutuanxue.com.zone";
};


2）区域数据库文件
[root@zutuanxue named]# cat zutuanxue.com.zone 
$TTL 1D
zutuanxue.com.    IN SOA    ns1.zutuanxue.com. rname.invalid. (
                    0    ; serial
                    1D    ; refresh
                    1H    ; retry
                    1W    ; expire
                    3H )    ; minimum
;zutuanxue.com.  需要做解析的域名
;ns1.zutuanxue.com.  为zutuanxue.com.做解析的DNS    这里我们既是DNS也同时为自己域名做了解析

    NS    ns1.zutuanxue.com.


;A         域名机械为IP
;PTR        IP解析为域名
;MX        邮件标记
;CNAME        别名


ns1    A    192.168.11.16
www    A    192.168.11.88
news  CNAME    www
```

### 5.2）测试方法

域名解析linux系统为大家提供了三个命令，看大家喜欢用哪个都可以。

a、host采用非交互式解析，

b、nslookup可以采用交互或非交互式解析

c、dig显示详细的解析流程

```
测试注意：请将你的测试客户端机器的DNS指向你自己的DNS服务器的IP地址。本例中我使用DNS服务器给自己当测试端，我修改了自己的DNS服务器地址
[root@zutuanxue ~]# cat /etc/resolv.conf 
# Generated by NetworkManager
nameserver 192.168.11.16

#host命令
[root@zutuanxue ~]# host news.zutuanxue.com
news.zutuanxue.com is an alias for www.zutuanxue.com.
www.zutuanxue.com has address 192.168.11.88


#nslookup 命令---交互式解析
[root@zutuanxue ~]# nslookup
> news.zutuanxue.com
Server:        192.168.11.16
Address:    192.168.11.16#53

news.zutuanxue.com    canonical name = www.zutuanxue.com.
Name:    www.zutuanxue.com
Address: 192.168.11.88
> exit

#nslookup 命令---非交互式解析
[root@zutuanxue ~]# nslookup news.zutuanxue.com
Server:        192.168.11.16
Address:    192.168.11.16#53

news.zutuanxue.com    canonical name = www.zutuanxue.com.
Name:    www.zutuanxue.com
Address: 192.168.11.88


#dig命令
[root@zutuanxue ~]# dig news.zutuanxue.com

; <<>> DiG 9.9.4-RedHat-9.9.4-73.el7_6 <<>> news.zutuanxue.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 28487
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 1, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;news.zutuanxue.com.        IN    A

;; ANSWER SECTION:
news.zutuanxue.com.    86400    IN    CNAME    www.zutuanxue.com.
www.zutuanxue.com.    86400    IN    A    192.168.11.88

;; AUTHORITY SECTION:
zutuanxue.com.        86400    IN    NS    www.zutuanxue.com.

;; Query time: 0 msec
;; SERVER: 192.168.11.16#53(192.168.11.16)
;; WHEN: 一 2月 25 10:52:19 CST 2019
;; MSG SIZE  rcvd: 93


技巧：
在dig解析中，后面跟上+trace来显示详细解析流程
[root@zutuanxue ~]# dig www.zutuanxue.com +trace
```

## 六、部署一个反向解析

**案例:对www.zutuanxue.com做反向解析，其对应的IP地址为192.168.11.88**

```
1）主配置文件添加反向解析zone
[root@zutuanxue ~]# cat /var/named/chroot/etc/named.conf 
options {
    listen-on port 53 { any; };
    directory     "/var/named";
};

//定义根域
//用于DNS向根递归查询
zone "." IN {
    type hint;
    //保存了DNS根级服务器的地址
    file "named.ca";
};

//定义一个主域
//注意每行都要;结尾
zone "zutuanxue.com" IN {
//类型为master
    type master;
//区域数据库文件名称
    file "zutuanxue.com.zone";
};

//定义一个反向解析
//此处需要倒写网段
zone "11.168.192.in-addr.arpa" IN {
    type master;
    file "192.168.11.arpa";
};



2）区域数据库文件设置
[root@zutuanxue named]# cat 192.168.11.arpa 
$TTL 1D
11.168.192.in-addr.arpa.    IN SOA    ns1.zutuanxue.com. rname.invalid. (
                    0    ; serial
                    1D    ; refresh
                    1H    ; retry
                    1W    ; expire
                    3H )    ; minimum
    NS    ns1.zutuanxue.com.
88    PTR    www.zutuanxue.com.

注意：文件的所有者和所有者组都是named
3）使用nslookup测试
[root@zutuanxue ~]# nslookup 192.168.11.88
Server:        192.168.11.16
Address:    192.168.11.16#53

88.11.168.192.in-addr.arpa    name = www.zutuanxue.com.
```

## 七、DNS服务器冗余

![image20200114172337009.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602998138816.png)

DNS服务器在网络中为全世界的服务器提供了域名解析服务，扮演着至关重要的角色。网络中的某台DNS一旦宕机，就会造成部分域名无法解析，用户无法顺利访问到对应的服务器。但是我们学习的过程中也发现了，我们的DNS部署在单台服务器上，如果出现单点故障，我们应该如何应对呢？我们可以通过部署多台相同解析的DNS来解决单点故障，就算一台DNS服务器出现问题，也不会影响解析服务。怎么部署呢？如何保障多台之间的解析一致？这就是我们要讨论的问题了。我们来学习辅助DNS吧！

辅助DNS是从主DNS拉取区域数据库文件的的，当主DNS解析的域名对应的区域数据库文件发生变化，辅助就会去找主DNS拉取新的区域数据库文件，保证和主的解析一致，而且是自动的不需要人为干预的，确保了主从DNS的区域数据库文件的一致性。

**教学案例:按照图例,为主DNS(192.168.11.16）部署一台辅助DNS(192.168.11.116)，实现数据同步。**

```
辅助DNS设置
a、软件包安装
[root@slave ~]# dnf -y install bind bind-chroot

b、设置主配文件
[root@slave etc]# cat /var/named/chroot/etc/named.conf
options {
    listen-on port 53 { any; };
    directory     "/var/named";
};

//定义根域
//用于DNS向根递归查询
zone "." IN {
    type hint;
    //保存了DNS根级服务器的地址
    file "named.ca";
};

//定义一个主域
//注意每行都要;结尾
zone "zutuanxue.com" IN {
//类型为slave  代表辅助
    type slave;
//区域数据库文件名称
    file "zutuanxue.com.zone";
//设置主DNS IP,向该IP去同步数据
    masters { 192.168.11.16; };
};

//定义一个反向解析
//此处需要倒写网段
zone "11.168.192.in-addr.arpa" IN {
//类型写slave  代表辅助
    type slave;
    file "192.168.11.arpa";
//设置主DNS IP,向该IP去同步数据
    masters { 192.168.11.16; };
};


修改权限
[root@slave etc]# chgrp named named.conf 


c、启动服务
[root@slave chroot]# systemctl enable named-chroot.service 
Created symlink from /etc/systemd/system/multi-user.target.wants/named-chroot.service to
 /usr/lib/systemd/system/named-chroot.service.
[root@slave chroot]# systemctl start named-chroot


d、验证
[root@slave ~]# ls /var/named/chroot/var/named/
192.168.11.arpa  zutuanxue.com.zone  chroot  data  dynamic  named.ca  named.empty  named.localhost  named.loopback  slaves


发现192.168.11.arpa  zutuanxue.com.zone 这两个数据库文件已经同步过来了，解析一下看看吧！


设置客户端的DNS IP为192.168.11.116，我的测试机就是这台slave机器，所以设置为192.168.11.116即可
[root@slave ~]# cat /etc/resolv.conf 
nameserver 192.168.11.116

使用nslookup验证一下
[root@slave ~]# nslookup news.zutuanxue.com
Server:        192.168.11.116
Address:    192.168.11.116#53

news.zutuanxue.com    canonical name = www.zutuanxue.com.
Name:    www.zutuanxue.com
Address: 192.168.11.88

[root@slave ~]# nslookup 192.168.11.88
Server:        192.168.11.116
Address:    192.168.11.116#53

88.11.168.192.in-addr.arpa    name = www.11.168.192.in-addr.arpa.

看到结果了，完美！！
```

## 八、智能DNS

在我们访问WEB的时候，发现有的网站打开的速度非常快，有的网站打开的非常慢，这是为什么呢？原因就是很多公司为了提升用户的体验，自己的网站使用了CDN内容加速服务，让你直接在你本地城市的服务器上拿数据并展示给你看。什么是CDN我们暂且理解为本地缓存服务器就好，那么你是怎么准确知道你本地的缓存服务器的呢！因为很多CDN公司的DNS使用了智能解析服务，根据你的源IP判断你属于哪个城市，让后再把本地的缓存服务器解析给你，你就会直接去找该服务器拿数据了。

智能解析原理

在DNS中植入全世界的IP库以及IP对应的地域，当用户来请求解析时，DNS会根据其源IP来定位他属于哪个区域，然后去找这个区域的view视图查询对应的域名的区域数据库文件做解析。从而使得不同地域的用户解析不同。

**教学案例:部署一台DNS智能解析服务器，对zutuanxue.com域名做智能解析：**

**上海的用户解析IP为 1.1.1.1**

**北京的用户解析IP为 2.2.2.2**

**其他用户解析为 3.3.3.3**

```
智能解析
a、设置主配文件
定义IP库，DNS根据IP库判断源IP属于哪个区域
根据地域定义视图，将该区域的客户端的解析请求都由该视图中的zone来解析

[root@master named]# cat /var/named/chroot/etc/named.conf
options {
    directory     "/var/named";
};

//定义IP库

acl shanghai { 192.168.11.50; };
acl beijing { 192.168.11.100; };

//定义视图，通过IP匹配后，通过不同的区域数据库文件进行解析
view sh {
	match-clients { shanghai; };
	zone "zutuanxue.com" IN {
    type master;
    file "zutuanxue.com.zone.sh";
};
};

view bj {
	match-clients { beijing; };
	zone "zutuanxue.com" IN {
        type master;
        file "zutuanxue.com.zone.bj";
};
};


view other {
	match-clients { any; };
  zone "zutuanxue.com" IN {
        type master;
        file "zutuanxue.com.zone.any";
};
};



b、根据主配文件设置不同的区域数据库文件
[root@master named]# cd /var/named/chroot/var/named
[root@master named]# cp zutuanxue.com.zone zutuanxue.com.zone.bj
[root@master named]# cp zutuanxue.com.zone zutuanxue.com.zone.sh
[root@master named]# cp zutuanxue.com.zone zutuanxue.com.zone.any
[root@master named]# chgrp named  zutuanxue.com.zone.*



[root@master named]# cat /var/named/chroot/var/named/zutuanxue.com.zone.sh 
$TTL 1D
@    IN SOA    zutuanxue.com. rname.invalid. (
                    0    ; serial
                    1D    ; refresh
                    1H    ; retry
                    1W    ; expire
                    3H )    ; minimum
    NS    www.zutuanxue.com.
www    A    1.1.1.1

[root@master named]# cat /var/named/chroot/var/named/zutuanxue.com.zone.bj
$TTL 1D
@    IN SOA    zutuanxue.com. rname.invalid. (
                    0    ; serial
                    1D    ; refresh
                    1H    ; retry
                    1W    ; expire
                    3H )    ; minimum
    NS    www.zutuanxue.com.
www    A    2.2.2.2

[root@master named]# cat /var/named/chroot/var/named/zutuanxue.com.zone.any 
$TTL 1D
@    IN SOA    zutuanxue.com. rname.invalid. (
                    0    ; serial
                    1D    ; refresh
                    1H    ; retry
                    1W    ; expire
                    3H )    ; minimum
    NS    www.zutuanxue.com.
www    A    3.3.3.3



c、测试
依次修改主配的IP库中的IP为本机，观看解析情况

[root@master named]# nslookup www.zutuanxue.com
Server:        192.168.11.16
Address:    192.168.11.16#53

Name:    www.zutuanxue.com
Address: 1.1.1.1
```