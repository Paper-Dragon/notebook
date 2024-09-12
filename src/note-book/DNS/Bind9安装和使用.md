# Bind9安装和使用

CentOS下， yum install bind安装bind软件来实现DNS服务, yum info bind可以查看到描述：

```bash
Description : BIND (Berkeley Internet Name Domain) is an implementation of the DNS
            : (Domain Name System) protocols. BIND includes a DNS server (named),
            : which resolves host names to IP addresses; a resolver library
            : (routines for applications to use when interfacing with DNS); and
            : tools for verifying that the DNS server is operating properly.
```

BIND是DNS协议的一种实现。BIND包含了一个DNS Server（服务名叫named）,用来解析主机名到ip地址；一个解析库；一些辅助工具，还有一个安全目录工具，分别属于下面几个包：

```bash
bind：包里主要包含：
    named DNS服务
    named-chkconfig（named.conf文件检查工具）
    named-checkzone(zone文件检车工具）
    rndc（本地和远程dns控制工具）
bind-libs：named DNS服务的库
bind-utils：包含一系列辅助工具来测试
    host
    dig
    nslookup
    nsupdate
bind-chroot：切根程序，用来切换默认目录到另外一个深层的安全的目录/var/named/chroot，类似于前面光盘进入救援模式的那种情况。
```

## named 涉及的文件

```bash
/etc/named.conf              # bind主配置文件
/etc/named.rfc1912.zones     # 定义zone的文件
/etc/rc.d/init.d/named       # bind脚本文件
/etc/rndc.conf               # rndc配置文件
/usr/sbin/named-checkconf    # 检测/etc/named.conf文件语法
/usr/sbin/named-checkzone    # 检测zone和对应zone文件的语法
/usr/sbin/rndc               # 远程dns管理工具
/usr/sbin/rndc-confgen       # 生成rndc密钥
/var/named/named.ca          # 根解析库
/var/named/named.localhost   # 本地主机解析库
/var/named/slaves            # 从ns服务器文件夹
```

可以查看/usr/share/doc/bind-9.9.4/sample/下有各种例子可以参考：

```bash
[root@centos7 sample]#tree
.
├── etc
│   ├── named.conf
│   └── named.rfc1912.zones
└── var
    └── named
        ├── data
        ├── my.external.zone.db
        ├── my.internal.zone.db
        ├── named.ca
        ├── named.empty
        ├── named.localhost
        ├── named.loopback
        └── slaves
            ├── my.ddns.internal.zone.db
            └── my.slave.internal.zone.db
```

根据参考来配置各个文件。

## named主配置文件

主配置文件/etc/named.conf包括：

```bash
监听端口(listen-on port)和ip地址
服务作用范围（本机还是指定网段还是全网）（allow-query）
递归还是迭代查询(recursion)
根区域解析文件（zone），其他区域文件可以看到有个include “/etc/named.rfc1912.zones”;，这下面保存了localhost的区域文件，如果新添加的，卸载这个zones文件里，里面指向了zone文件地址。然后每一个zone文件，是在/var/named下面。
```

下面是原配置文件的部分：

```bash
[root@centos7 named]#cat /etc/named.conf 
options {
   listen-on port 53 { 127.0.0.1; };// ipv4监听端口和ip地址，默认只有本地的
   listen-on-v6 port 53 { ::1; }; // ipv6的监听端口和ip地址
   directory    "/var/named";
   dump-file    "/var/named/data/cache_dump.db";
   statistics-file "/var/named/data/named_stats.txt";
   memstatistics-file "/var/named/data/named_mem_stats.txt";
   allow-query     { localhost; };

   /* 
    - If you are building an AUTHORITATIVE DNS server, do NOT enable recursion.
    - If you are building a RECURSIVE (caching) DNS server, you need to enable 
      recursion. 
    - If your recursive DNS server has a public IP address, you MUST enable access 
      control to limit queries to your legitimate users. Failing to do so will
      cause your server to become part of large scale DNS amplification 
      attacks. Implementing BCP38 within your network would greatly
      reduce such attack surface 
   */
   recursion yes; // 递归还是迭代查询

   dnssec-enable yes; // dns安全扩展,可以改为no关闭
   dnssec-validation yes; //可以改为no关闭

   /* Path to ISC DLV key */
   bindkeys-file "/etc/named.iscdlv.key";

   managed-keys-directory "/var/named/dynamic";

   pid-file "/run/named/named.pid";
   session-keyfile "/run/named/session.key";
};

logging {
        channel default_debug {
                file "data/named.run";
                severity dynamic;
        };
};

zone "." IN { // 定义zone文件，这里是定义的根域的文件位置
   type hint;
   file "named.ca";
};

include "/etc/named.rfc1912.zones"; // 把named.rfc1912.zones文件包含进来
include "/etc/named.root.key"; // 把/etc/named.root.key文件包含进来
```

下面贴出一个修改后的区域文件：

```bash
options {
    listen-on port 53 { 192.168.111.254; 127.0.0.1; };  //监听端口修改为某一网卡地址，和回环地址。
    listen-on-v6 port 53 { ::1; };
    directory   "/var/named";
    dump-file   "/var/named/data/cache_dump.db";
    statistics-file "/var/named/data/named_stats.txt";
    memstatistics-file "/var/named/data/named_mem_stats.txt";
    allow-query     { 192.168.111.0/24; }; //查询范围只允许192.168.111.0网段查询。
    recursion yes;
    dnssec-enable no;  //关闭dnssec
    dnssec-validation no;  //关闭dnssec
    bindkeys-file "/etc/named.iscdlv.key";
    managed-keys-directory "/var/named/dynamic";
    pid-file "/run/named/named.pid";
    session-keyfile "/run/named/session.key";
};
logging {
        channel default_debug {
                file "data/named.run";
                severity dynamic;
        };
};
zone "." IN {
    type hint;
    file "named.ca";
};
include "/etc/named.rfc1912.zones";
include "/etc/named.root.key";
```

配置解析库文件（Zone files）,一般是在/var/named下写，文件名格式一般写为ZONE_NAME.zone

| named.conf配置文件所有的配置语句 | 含义 |
| -------------------------------- | ---- |
| acl	| 定义一个主机匹配列表，用户访问控制权限 |
| controls	| 定义rndc工具与bind服务进程的通信 |
| include	| 把其他文件的内容包含进来 |
| key	| 定义加密秘钥 |
| logging	| 定义系统日志信息 |
| lwres	| 把named配置为轻量级解析器 |
| masters	| 定义主域列表 |
| options	| 设置全局选项 |
| server	| 定义服务器属性 |
| trusted-keys	| 定义信任的dnssec秘钥 |
| view	| 定义视图 |
| zone	| 定义区域 |


- named.rfc1912.zones主配置文件

```bash
    zone "ZONE_NAME" IN {
        type {master|slave|hint|forward};
        file "ZONE_NAME.zone";
    };
    zone "ZONE_NAME“：定义解析库名字，通常和解析库文件前缀对应起来。
    type：
        master指的是主dns解析
        slave指的是从dns解析
        hint指的是根域名解析（根提示域）
        forward指的是转发，转发不使用file
    file ：定义区域解析库文件名字（位置默认在/var/named下面）,file的前缀通常和zone的名字通常对应起来，然后加一个.zone的后缀。
    
```
这里给出一个自定义的总的区域定义文件，新加一个区域文件的定义：

```bash
zone "zhangqifei.top" IN {
    type master;
    file "zhangqifei.top.zone";
};
```

## 区域配置文件

**/var/named/ZONE_NAME.zone**区域配置文件

## 正向区域文件

这里给出我一个自定义的区域文件：zhangqifei.top.zone


```bash

$TTL 1D
@    IN  SOA  ns1.zhangqifei.top. me.zhangqifei.top ( 0 1H 10M 1D 3H)
     IN  NS   ns1.zhangqifei.top
     IN  NS   ns2
         MX 10 mail1
         MX 20 mail2
ns1.zhangqifei.top  IN  A  192.168.111.254
ns2  IN  A  192.168.111.253  
db1   A    192.168.111.100
db2   A    192.168.111.111
web1  A    192.168.111.200
web2  A    192.168.111.222
mail1 A    192.168.111.10
mail2 A    192.168.111.20
www   CNAME   web1
```

```bash
$ORIGIN host.com.
$TTL 600    ; 10 minutes
@       IN SOA  dns.host.com. dnsadmin.host.com. (
                2022022801 ; serial
                10800      ; refresh (3 hours)
                900        ; retry (15 minutes)
                604800     ; expire (1 week)
                86400      ; minimum (1 day)
                )
           NS   dns.host.com.

$TTL 60 ; 1 minute
dns             A       10.4.7.11
HDSS7-11        A       10.4.7.11
HDSS7-12        A       10.4.7.12
HDSS7-21        A       10.4.7.21
HDSS7-22        A       10.4.7.22
HDSS7-200       A       10.4.7.200

```
- 具体配置选项意义，见前一节DNS记录类型。

```bash
分号代表注释
TTL 过期时间
@指的就是本域 zhangqifei.top
SOA记录    代表区域授权文件的开始
IN ns2.zhangqifei.top可以省略写成IN ns2
IN都可以省略不写,比如直接写MX mail
设置.zone文件权限（参照/var/named/name.xxxx的权限来设置，这里xxx为任意字符）

chmod 640 zhangqifei.top.zone
chown :named zhangqifei.top.zone

配置完毕后，启动或重启(已启动的话）服务。

service named start|restart
```

## **反向区域**



```bash
区域名称：是网络地址的犯些.in-addr.arpa.

192.168.111. –> 111.168.192.in-addr.arpa.

配置方法：

先在/etc/named.rfc1512.zones文件下插入下面内容：
zone "Reverse_Net_Addr.in-addr.arpa" IN {
    type {master|slave|forward};
    file "Net_Addr.zone"
}
```

例子：

```bash
zone "111.168.192.in-addr.arpa" IN {
    type master;
    file "192.168.111.zone";
};
配置/var/named/ZONE_NAME.zone
不需要MX、A、AAAA，要有NS记录，以PTR记录为主。
```

例子：

```bash
配置192.168.111.zone：

$TTL 1D
@   IN  SOA ns1.magedu.com. me.zhangqifei.top (
                    20170001
                    1H
                    5M
                    7D
                    1D)
    IN NS ns1.zhangqifei.top.
    IN NS ns2.zhangqifei.top.
254 IN PTR ns1.zhangqifei.top.
253 IN PTR ns2.zhangqifei.top.
100 IN PTR db1.magedu.com.
111 IN PTR db2.magedu.com.
200 IN PTR web1.magedu.com.
222 IN PTR web2.magedu.com.
10  IN PTR mail1.magedu.com.
20  IN PTR mail2.magedu.com.
```



## 测试

```bash

[root@hdss7-11 named]# dig -t A hdss7-21.host.com @10.4.7.11

; <<>> DiG 9.11.4-P2-RedHat-9.11.4-26.P2.el7_9.9 <<>> -t A hdss7-21.host.com @10.4.7.11
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 10788
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 1, ADDITIONAL: 2

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;hdss7-21.host.com.             IN      A

;; ANSWER SECTION:
HDSS7-21.host.com.      60      IN      A       10.4.7.21

;; AUTHORITY SECTION:
host.com.               600     IN      NS      dns.host.com.

;; ADDITIONAL SECTION:
dns.host.com.           60      IN      A       10.4.7.11

;; Query time: 0 msec
;; SERVER: 10.4.7.11#53(10.4.7.11)
;; WHEN: Mon Feb 28 17:13:07 CST 2022
;; MSG SIZE  rcvd: 105

[root@hdss7-11 named]# dig -t A hdss7-21.host.com @10.4.7.11 +short
10.4.7.21

```