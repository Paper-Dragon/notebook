前面的分发方式都是基于一个集群分发的，nginx是一个基于7层的分发也就是可以实现基于主机头的分发，这种分发一般都是用于多集群环境中。

## 一、HTTP请求头和响应头

客户端浏览器开发者工具network工具下，获取请求的请求头信息如下所示：

```
Request URL: http://192.168.0.40	#请求的URL
Request method:GET	#请求的方法，GET是获取数据
Remote address:192.168.0.40:80#远程主机的地址
Status code: 200 OK	#请求代码，200表示正常，如果页面无法打开会显示404，403等
Version: HTTP/1.1#HTTP协议的版本


Response headers (235 B)	#响应头	
Accept-Ranges：bytes#接受范围，如果出现此字段表示，这是一个续传的下载（断点续传），bytes表示服务器可接受范围请求的单位是bytes，none表示不支持
Connection：keep-alive #是否支持长连接，从HTTP1.1开始默认
Content-Length：5	#返回的数据长度，单位为字节
Content-Type：text/html#页面类型，文本、图片、视频、音频
Date：Fri, 21 Feb 2020 01:37:17 GMT#返回的时间
ETag："5e4e2e62-5"#验证标签，用来帮助控制缓存验证，当浏览器请求服务器的某项资源(A)时, 服务器根据A算出一个哈希值，并通过 ETag 返回给浏览器，浏览器把对应的哈希值和A同时缓存在本地，当下次再次向服务器请求A时，会把这个哈希值发送给服务器，服务器再次计算A的哈希值并和刚刚接收到的哈希值做比较，如果发现A发生了变化就把A返回给浏览器(200)，如果发现A没有变化就给浏览器返回一个304未修改。这样通过控制浏览器端的缓存，可以节省服务器的带宽，因为服务器不需要每次都把全量数据返回给客户端
Last-Modified：Thu, 20 Feb 2020 06:59:46 GMT#服务器认定的资源做出修改的日期及时间。 它通常被用作判断接收到的或者存储的资源是否一致。由于精确度比ETag要低，所以这是一个备用机制。
Server：nginx/1.15.12	#服务器的软件类型和版本


Request headers (355 B)	#请求头
Accept：text/html,application/xhtml+xm… #接受的数据类型
Accept-Encoding：gzip, deflate	#是否支持压缩，及类型
Accept-Language：en-US,en;q=0.5	#语言环境
Cache-Control：no-cache#缓存实现的机制。
Connection：keep-alive
Host：192.168.0.40#访问的名称（主机名还是IP地址），虚拟主机就是依靠这个字段来判断返回哪个页面内容
Pragma：no-cache#http1.0使用的字段，如果是no-cache与cache-control功能一致
Upgrade-Insecure-Requests：1 #客户端优先选择加密及带有身份验证的响应
User-Agent：Mozilla/5.0 (X11; Linux x86_64…) Firefox/60.0	#客户端浏览器类型和版本
```

以上只是对在发者工具中看到的内容进行的说明，有需要的同学，或者是如果以后看到了其它额外字段的内容可以参看https://developer.mozilla.org/zh-CN/docs/Web/HTTP，里面有详细的说明

## 二、基于请求头的分发

### 2.1、基于host分发

基于host分发这种分发方式适用于多集群分发。例如：一个公司有多个网站，每个网站就是一个集群。

```
#nginx分发器设置
http {
    upstream web1 {   # 名为web1的反向代理群组
        server 192.168.0.42;
    }
    upstream web2 {   # 名为web2的反向代理群组
        server 192.168.0.43;
    }
    server {    # web1虚拟主机
        listen 80;
        server_name www.web1.com;    # 基于域名分发必须有域名
        location / {
            proxy_pass http://web1; 
        }
    }
    server {    # web2虚拟主机
        listen 80;
        server_name www.web2.com;    # 基于域名分发必须有域名 
        location / {
            proxy_pass http://web2; 
        }
    }
}
```

### 2.2、基于域名的分发测试：

```
#客户端测试机设置
[root@client ~]# vim /etc/hosts
168.0.40 www.web1.com
192.168.0.40 www.web2.com
[root@client ~]# curl www.web1.com
web1
[root@client ~]# curl www.web2.com
web2
```

### 2.3、基于开发语言分发

这种分发方式适用于混合开发的网站，某些大型网站既有php也有jsp，就可以基于开发语言分发。

```
# 192.168.0.40分发器上nginx配置
http {
    upstream php {
        server 192.168.0.42; 
    }
    upstream html {
        server 192.168.0.43;
    }
    server {
        location ~* \.php$ {    # 以php结尾的
            proxy_pass http://php;
        } 
        location ~* \.html$ {   # 以html结尾的
            proxy_pass http://html;
        }
    }
}
```

测试验证：

```
# 在web1这台主机上安装php环境
[root@web1 ~]# dnf -y install php# 安装php
# 启动apache，自带php
[root@web1 ~]# systemctl restart httpd

# 编写php文件
[root@web1 ~]# echo "<?php phpinfo(); ?>" > /var/www/html/index.php

# 访问192.168.0.40/index.php 可以看到php-info信息页面
# 访问192.168.0.40/index.html 可以看到web2
```

### 2.4、基于浏览器分发

这种基于浏览器的分发，常应用于PC端和移动端区分或浏览器适配。

**部署第三台业务主机**

```
[root@web3 ~]# dnf install httpd -y
[root@web3 ~]# echo web3 > /var/www/html/index.html
[root@web3 ~]# systemctl restart httpd
[root@web3 ~]# curl localhost
```

**配置基于浏览器的分发**

```
upstream curl { server 192.168.0.42; }
upstream firefox { server 192.168.0.43; }
upstream other { server 192.168.0.44; }
server {
    listen 80;
    server_name www.web1.com;
    location / {
        proxy_pass http://other;
        if ( $http_user_agent ~* curl ) {
            proxy_pass http://curl;
        }
        if ( $http_user_agent ~* firefox ) {
            proxy_pass http://firefox;
        }
    }
}
```

**测试**

使用不同的浏览器访问分发器会得到不同的页面

### 2.5、基于源IP分发

像腾讯新闻，网易，58同城，真爱，百合，赶集，智联等等很多网站,这种网站都有一个特性，你一访问，就知道你的位置，然后根据你的位置，给你推荐或者展示相关内容。很多APP也是这样的，只不过，网站是通过你的源IP来确定你的位置，APP的则更为直接一些，通过定位数据获取位置。比如说，你去新闻类的网站，这些网站的本地新版板块显示的都是你所在地的相关信息。也就是说我们可以让服务器对源IP进行判断，根据判断的结果不同，再返回不同的数据给客户端；如果判断不出来，就按照默认去处理。如果想实现基于源IP的分发我们需要一个叫geo的参数，这个参数可以要根据客户端ip访问到不同的server，它是通过一个叫ngx_http_geo_module模块提供的。默认情况下，nginx安装时是会自动加载这个模块，除非安装时人为的手动添加–without-http_geo_module。

**配置**

```
upstream bj.server {
    server 192.168.0.42;    # web01
}
upstream sh.server {
    server 192.168.0.43;      # web02
}
upstream default.server {
    server 192.168.0.44;      # web03
}
geo $geo {       # IP库
    default default;
    192.168.0.10/32 bj;    # 北京
    192.168.0.20/32 sh;   # 上海
}
server {
    listen  80;
    server_name   www.web1.com;

    location / {
        proxy_pass http://$geo.server$request_uri;
    }
}
```

如果客户端地址是0.10 就访问北京，如果是0.20就访问上海，如果不是0.10也不是0.20就按照default处理，线上环境这里面就是个IP库 我现在没有ip库只能写两个IP来代表看下后面的掩码是32表示这一个网段只有这一个IP吧，当然你也可以换成网段。

http后面加上$request_uri的原因就是避免客户 找你拿数据的时候一指定URI你就无法正常代理了，目的就是保证客户在访问类似http://www.a.com/a/b/c/d.jpg这样的网址的时候可以正常访问 也就是说当用户请求的URL当中的URI跟着变化的时候你的代理服务器一样可以正常工作

重启nginx服务器，切换到客户端测试

```
[root@client ~]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.0.10  netmask 255.255.255.0  broadcast 192.168.0.255
        inet6 fe80::2386:3dbd:531c:7bc1  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:a6:ad:95  txqueuelen 1000  (Ethernet)
        RX packets 1177  bytes 280850 (274.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1115  bytes 111602 (108.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 7080  bytes 601912 (587.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 7080  bytes 601912 (587.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@client ~]# curl 192.168.0.40
web1
[root@client ~]# nmcli connection modify ens33 ipv4.addresses 192.168.0.20/24 ipv4.method manual autoconnect yes
[root@client ~]# nmcli connection down ens33
成功停用连接 "ens33"（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/16）

[root@client ~]# nmcli connection up ens33
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/17）
[root@client ~]# curl 192.168.0.40
web2
[root@client ~]# nmcli connection modify ens33 ipv4.addresses 192.168.0.30/24 ipv4.method manual autoconnect yes
[root@client ~]# nmcli connection down ens33
成功停用连接 "ens33"（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/17）

[root@client ~]# nmcli connection up ens33
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/18）
[root@client ~]# curl 192.168.0.40
web3
```