# Nginx初级篇

# 1、Nginx 的优势

Nginx (engine x) 是一个高性能的HTTP(解决C10k的问题)和反向代理服务器，也是一个IMAP/POP3/SMTP服务器。反代图示

nginx的web优势

## 1、io多路复用

理论方法

### 第一种方法：

最传统的多进程并发模型 (每进来一个新的I/O流会分配一个新的进程管理）。

### 第二种方法：

I/O多路复用 (单个线程，通过记录跟踪每个I/O流(sock)的状态，来同时管理多个I/O流 。)发明它的原因，是尽量多的提高服务器的吞吐能力。在同一个线程里面， 通过拨开关的方式，来同时传输多个I/O流

技术类型

#### select

    select是第一个实现 (1983 左右在BSD里面实现的)。 
    select 被实现以后，很快就暴露出了很多问题。
    • select 会修改传入的参数数组，这个对于一个需要调用很多次的函数，是非常不友好的。
    • select 如果任何一个sock(I/O stream)出现了数据，select 仅仅会返回，但是并不会告诉你是那个sock上有数
    据，于是你只能自己一个一个的找，10几个sock可能还好，要是几万的sock每次都找一遍...
    • select 只能监视1024个链接。
    • select 不是线程安全的，如果你把一个sock加入到select, 然后突然另外一个线程发现，这个sock不用，要收
    回，这个select 不支持的，如果你丧心病狂的竟然关掉这个sock, select的标准行为是不可预测的

#### poll

    于是14年以后(1997年）一帮人又实现了poll, poll 修复了select的很多问题，比如
    • poll 去掉了1024个链接的限制，于是要多少链接呢， 主人你开心就好。
    • poll 从设计上来说，不再修改传入数组，不过这个要看你的平台了，所以行走江湖，还是小心为妙。
    其实拖14年那么久也不是效率问题， 而是那个时代的硬件实在太弱，一台服务器处理1千多个链接简直就是神
    一样的存在了，select很长段时间已经满足需求。 
    但是poll仍然不是线程安全的， 这就意味着，不管服务器有多强悍，你也只能在一个线程里面处理一组I/O流。
    你当然可以那多进程来配合了，不过然后你就有了多进程的各种问题。

#### epoll

    于是5年以后, 在2002, 大神 Davide Libenzi 实现了epoll. 
    epoll 可以说是I/O 多路复用最新的一个实现，epoll 修复了poll 和select绝大部分问题, 比如：
    • epoll 现在是线程安全的。 
    • epoll 现在不仅告诉你sock组里面数据，还会告诉你具体哪个sock有数据，你不用自己去找了。

特点：

异步非阻塞

    $ pstree |grep nginx
    |-+= 81666 root nginx: master process nginx
    | |--- 82500 nobody nginx: worker process
    | \--- 82501 nobody nginx: worker process
    1个master进程，2个work进程
    每进来一个request，会有一个worker进程去处理。但不是全程的处理，处理到什么程度呢？处理到可能发生阻塞的地方，比如向上游（后端）服务器转发request，并等待请求返回。那么，这个处理的worker不会这么一直等着，他会在发送完请求后，注册一个事件：“如果upstream返回了，告诉我一声，我再接着干”。于是他就休息去了。这就是异步。此时，如果再有request 进来，他就可以很快再按这种方式处理。这就是非阻塞和IO多路复用。而一旦上游服务器返回了，就会触发这个事件，worker才会来接手，这个request才会接着往下走。这就是异步回调。

## 2、时分多路复用

CPU时钟/中断设计

## 3、频分多路复用

ADSL


# 2、HTTP协议详解

## 1、http协议概述

HTTP--Hyper Text Transfer Protocol，超文本传输协议，是一种建立在TCP上的无状态连接，整个基本的工作流程是客户端发送一个HTTP请求，说明客户端想要访问的资源和请求的动作，服务端收到请求之后，服务端开始处理请求，并根据请求做出相应的动作访问服务器资源，最后通过发送HTTP响应把结果返回给客户端。其中一个请求的开始到一个响应的结束称为事务，当一个事物结束后还会在服务端添加一条日志条目。

## 2、URI

统一资源标识符(Uniform Resource Identifier,或URI)
 HTTP 请求的内容通称为"资源"。”资源“这一概念非常宽泛，它可以是你能够想到的格式。每个资源都由一个 (URI) 来进行标识。URL即统一资源定位符，它是 URI 的一种。一份文档，一张图片，或所有其他。URI包含URL,URN

### ① URL

URL 用于定位
    全称叫做:统一资源定位符(URL,英语Uniform Resource Locator的缩写)也被称为网页地址

示例

    https://developer.mozilla.org
    https://developer.mozilla.org/en-US/docs/Learn/
    https://developer.mozilla.org/en-US/search?q=URL在浏览器的地址栏中输入上述任一地址，浏览器就会加载相应的网页（资源）。
    URL 由多个必须或可选的组件构成。下面给出了一个复杂的 URL：
    http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument

### ② URN

   用于区分
    URN仅用于命名，而不指定地址。用于标识唯一书目的ISBN系统是一个典型的URN使用范例。例如，ISBN 0486275574(urn:isbn:0-486-27557-4)无二义性地标识出莎士比亚的戏剧《罗密欧与朱丽叶》的某一特定版本。
    URN 是另一种形式的 URI，它通过特定命名空间中的唯一名称来标识资源。
    urn:isbn:9780141036144
    urn:ietf:rfc:7230
    上面两个 URN 标识了下面的资源：
     • 乔治·奥威尔所著的《1984》
     • IETF规范7230，超文本传输协议 (HTTP/1.1)：Message Syntax and Routing.

### ③ 三者关系图

​                          

### ④ 统一资源标识符的语法（URL）

URL分为6个部分，分别是协议、主机、端口、路径、查询、片段。 

协议

     "http://" 告诉浏览器使用何种协议。对于大部分 Web 资源，通常使用 HTTP 协议或其安全版本，HTTPS 协议。另外，浏览器也知道如何处理其他协议。例如， “mailto:” 协议指示浏览器打开邮件客户端；“ftp:”协议指示浏览器处理文件传输。

主机

    www.example.com 既是一个域名，也代表管理该域名的机构。它指示了需要向网络上的哪一台主机发起请求。当然，也可以直接向主机的 IP address 地址发起请求。但直接使用 IP 地址的场景并不常见。

端口

  :80 是端口。它表示用于访问 Web 服务器上资源的技术“门”。如果访问的该 Web 服务器使用HTTP协议的标准端口（HTTP为80，HTTPS为443）授予对其资源的访问权限，则通常省略此部分。否则修改了端口的话，端口就是 URI 必须的部分。在访问的时候必须加上端口。

路径

   /path/to/myfile.html 是 Web 服务器上资源的路径。在 Web 的早期，类似这样的路径表示 Web 服务器上的物理文件位置。现在，它主要是由没有任何物理实体的 Web 服务器抽象处理而成的。

查询

  ?key1=value1&key2=value2 是提供给 Web 服务器的额外参数。这些参数是用 & 符号分隔的键/值对列表。Web 服务器可以在将资源返回给用户之前使用这些参数来执行额外的操作。每个 Web 服务器都有自己的参数规则，想知道特定 Web 服务器如何处理参数的唯一可靠方法是询问该 Web 服务器所有者。

片段

    #SomewhereInTheDocument 是资源本身的某一部分的一个锚点。锚点代表资源内的一种“书签”，它给予浏览器显示位于该“加书签”点的内容的指示。 例如，在HTML文档上，浏览器将滚动到定义锚点的那个点上；在视频或音频文档上，浏览器将转到锚点代表的那个时间。值得注意的是 # 号后面的部分，也称为片段标识符，永远不会与请求一起发送到服务器。

## 3、HTTP协议概述

图示

      HTTP是一种能够获取如 HTML 这样的网络资源的通讯协议。它是 Web 上数据交换的基础，是一种 client-server 协议，也就是说请求通常是由像浏览器这样的接受方发起的。一个完整的web文档是由不同的子文档重新组建而成的，像是文本、布局描述、图片、视频、脚本等等。
    
     HTTP被设计于上20世纪90年代初期，是一种可扩展性的协议。它是应用层的协议，虽然理论上它可以通过任何可靠的传输协议来发送，但是它还是通过TCP，或者是TLS－加密的TCP连接来发送。因为它很好的扩展性，时至今日它不仅被用来传输超文本文档，还用来传输图片、视频或者向服务器发送如HTML表单这样的信息。HTTP还可以根据网页需求，来获取部分web文档的内容来更新网页。

requests

    客户端和服务端通过交换各自的消息来进行交互。通常由像浏览器这样的客户端发出的消息叫做 requests，那么被服务端回应的消息就叫做 responses。

组件系统

      HTTP是一个client-server协议：请求通过一个实体被发出，实体也就是用户代理。大多数情况下，这个用户代理都是指浏览器，当然它也可能是任何东西，比如一个爬取网页来生成和维护搜索引擎索引的机器。每一个发送到服务器的请求，都会被服务器处理并且返回一个消息，也就是response。在client与server之间，还有许许多多的被称为proxies的实体，他们的作用与表现各不相同，比如有些是网关，还有些是caches等。

①  客户端：user-agent

    严格意义来说，user-agent就是任何能够为用户发起行为的工具。但实际上，这个角色通常都是由浏览器来扮演。对于发起请求来说，浏览器总是作为发起一个请求的实体。
    要渲染出一个网页，浏览器首先要发送第一个请求来获取这个页面的HTML文档，再解析它并根据文档中的资源信息发送其他的请求来获取脚本信息，或者CSS来进行页面布局渲染，还有一些其它的页面资源（如图片和视频等）。然后，它把这些资源结合到一起，展现出来一个完整的文档，也就是网页。打开一个网页后，浏览器还可以根据脚本内容来获取更多的资源来更新网页。
     一个网页就是一个超文本文档，也就是说有一部分显示的文本可能是链接，启动它（通常是鼠标的点击）就可以获取一个新的网页。网页使得用户可以控制它的user-agent来导航Web。浏览器来负责翻译HTTP请求的命令，并翻译HTTP的返回消息让用户能明白返回消息的内容。

②  Web服务端
    在上述通信过程的另一端，就是一个Web Server来服务并提供客户端请求的文档。Server只是虚拟意义上：它可以是许多共同分担负载（负载平衡）的一组服务器组成的计算机群，也可以是一种复杂的软件，通过向其他计算机发起请求来获取部分或全部资源的软件。

③  Proxies
     在浏览器和服务器之间，有许多计算机和其他设备转发了HTTP的消息。因为Web栈层次结构的原因，它们大多数都出现在传输层、网络层和物理层上，对于HTTP的应用层来说就是透明的（虽然它们可能会对应用层的性能有重要影响）。而还有一部分表现在应用层上的，就叫做proxies了。Proxies既可以表现得透明，又可以不透明（看请求是否通过它们），主要表现在这几个功能上。

报文 

请求：

eg：

元素： • 一个HTTP的method，经常是由一个动词像GET, POST 或者一个名词像OPTIONS，HEAD来定义客户端的动
 作行为的。通常客户端的操作都是获取资源（用GET方法）或者发送一个HTML form表单的值（用POST方法），
 虽然在一些情况下也会有其他的操作。
 • 要获取的资源的路径，通常是上下文中就很明显的元素资源的URL，它没有protocol （http://），domain（developer.mozilla.org），或是TCP的port（HTTP是80端口）。
 • HTTP协议的版本号。
 • 为服务端表达其他信息的可选择性的headers。

回应：

eg：

元素： • HTTP的版本号。
 • 一个状态码（status code），来告知对应的请求发送成功或失败，以及失败的原因。
 • 一个状态信息，这个信息是非权威的状态码描述信息，也就是说可以由服务端自行设定的。
 • HTTP headers，与请求的很像。
 • 可选的，但是比在请求报文中更加常见地包含获取资源的body。

三、HTTP headers

实验分析http报头信息

1、下载一个源码包

wget -d http://nginx.org/download/nginx-1.12.1.tar.gz

2、分析debug信息

    DEBUG output created by Wget 1.14 on linux-gnu.
    ---request begin---                                            请求开始
    GET /download/nginx-1.12.1.tar.gz HTTP/1.1       动作下载 页面地址 HTTP版本
    User-Agent: Wget/1.14 (linux-gnu)                       代理程序：wget
    Accept: */*                                                     接收的类型：任何类型
    Host: nginx.org                                                目标主机：nginxorg
    Connection: Keep-Alive                                      链接类型：启动长连接
    ---request end---                                          请求结束
    HTTP request sent, awaiting response...                    发送请求中
    
    ---response begin---                                            响应开始
    HTTP/1.1 200 OK                                             协议版本 状态码 结果
    Server: nginx/1.13.3                                           服务器版本
    Date: Fri, 06 Oct 2017 09:05:15 GMT                     相应时间
    Content-Type: application/octet-stream                   接收应用类型：字节流（软件类）
    Content-Length: 981093                                      文档大小
    Last-Modified: Tue, 11 Jul 2017 15:45:09 GMT        资源最后修改的时间（stat文件即可查看）
    Connection: keep-alive                                          长连接开启
    Keep-Alive: timeout=15                                          长连接有效期
    ETag: "5964f285-ef865"                                         校验值
    Accept-Ranges: bytes                                            接收范围：字节的范围
    ---response end---
    200 OK
    Registered socket 3 for persistent reuse.
    Saving to: ‘nginx-1.12.1.tar.gz’

3、相关资料

    HTTP/1.1          HTTP协议版本1.1；
    200 OK             响应的状态码是200，即正常返回数据，不同场景会有其它如2xx、3xx、4xx、5xx；
    Server               服务器软件是Nginx，版本是1.13.3；
    Date                 从服务器获取该资源时间，时间差8小时，时区不同；
    Content-Type    响应的数据类型，这里的资源是文件，则是application/octet-stream了，其它还有图片，
                            视频、json、html、xml、css等；
    Content-Length  response body的长度，也就是源码包的字节大小；
    Last-Modified     即下载的文件在服务器端最后修改的时间；
    Connection        keep-alive Nginx开启了TCP长连接；
    ETag                 ETag HTTP响应头是资源的特定版本的标识符。这可以让缓存更高效，并节省带宽，
                            因为如果内容没有改变，Web服务器不需要发送完整的响应；
    Accept-Ranges  响应头 Accept-Range 标识自身支持范围请求，字段值用于定义范围请求的单位。
    206 Partial Content 
    Accept-Ranges   告诉我们服务器是否支持指定范围请求及哪种类型的分段请求，这里是byte
    Content-Range   告诉我们在整个返回体中本部分的字节位置，我们请求的是图片的前100字节


# 3、Nginx 部署 Yum

## 官网链接

https://nginx.org

### nginx 版本类型

- Mainline Version：主线版，即开发版

- ♥Stable Version：最新稳定版，生产环境使用

- Legacy version：遗留老版本的稳定版

配置yum源

```bash
nginx.org -> documents -> install -> linux -> RHEL


Install the prerequisites:

sudo yum install yum-utils
To set up the yum repository, create the file named /etc/yum.repos.d/nginx.repo with the following contents:

[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
By default, the repository for stable nginx packages is used. If you would like to use mainline nginx packages, run the following command:

sudo yum-config-manager --enable nginx-mainline
To install nginx, run the following command:

sudo yum install nginx
When prompted to accept the GPG key, verify that the fingerprint matches 573B FD6B 3D8F BC64 1079 A6AB ABF5 BD82 7BD9 BF62, and if so, accept it.
```





# 4、Nginx 配置文件

## 全部文件

```bash
[root@nginx-server ~]# rpm -ql nginx
/etc/logrotate.d/nginx # 日志轮转
/etc/nginx # 主配置文件夹
/etc/nginx/conf.d # 子配置文件
/etc/nginx/conf.d/default.conf # 默认子配置，默认网站
/etc/nginx/fastcgi_params # 动态网站模块 -python，php所需要的变量
/etc/nginx/mime.types # 文件程序关联 
/etc/nginx/modules	# nginx模块
/etc/nginx/nginx.conf	# 主配置
/etc/nginx/scgi_params	# 动态网站模块
/etc/nginx/uwsgi_params # 动态网站模块 python相关
/usr/lib/systemd/system/nginx-debug.service	# 服务debug脚本
/usr/lib/systemd/system/nginx.service	# 服务脚本
/usr/lib64/nginx
/usr/lib64/nginx/modules
/usr/libexec/initscripts/legacy-actions/nginx # 启动脚本
/usr/libexec/initscripts/legacy-actions/nginx/check-reload# 启动脚本
/usr/libexec/initscripts/legacy-actions/nginx/upgrade# 启动脚本
/usr/sbin/nginx # 主程序
/usr/sbin/nginx-debug # 调试nginx
/usr/share/doc/nginx-1.20.1 # 文档
/usr/share/doc/nginx-1.20.1/COPYRIGHT # 文档
/usr/share/man/man8/nginx.8.gz # 文档
/usr/share/nginx # 文档
/usr/share/nginx/html # 文档
/usr/share/nginx/html/50x.html # 文档
/usr/share/nginx/html/index.html # 文档
/var/cache/nginx # 缓存
/var/log/nginx # 日志
```



# 5、Nginx编译参数

yum参数

```bash
[root@nginx-server ~]# nginx -V
nginx version: nginx/1.20.1
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-44) (GCC) 
built with OpenSSL 1.0.2k-fips  26 Jan 2017
TLS SNI support enabled
configure arguments: --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/lib64/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp --http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp --user=nginx --group=nginx --with-compat --with-file-aio --with-threads --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-mail --with-mail_ssl_module --with-stream --with-stream_realip_module --with-stream_ssl_module --with-stream_ssl_preread_module --with-cc-opt='-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector-strong --param=ssp-buffer-size=4 -grecord-gcc-switches -m64 -mtune=generic -fPIC' --with-ld-opt='-Wl,-z,relro -Wl,-z,now -pie'


configure arguments: # 编译参数./configure --help 查询帮助
--prefix=/etc/nginx # 安装路径
--sbin-path=/usr/sbin/nginx # 执行程序
--modules-path=/usr/lib64/nginx/modules # 模块位置
--conf-path=/etc/nginx/nginx.conf 著配置文件
--error-log-path=/var/log/nginx/error.log  错误日志
--http-log-path=/var/log/nginx/access.log 访问日志
--pid-path=/var/run/nginx.pid  pid
--lock-path=/var/run/nginx.lock  锁文件
--http-client-body-temp-path=/var/cache/nginx/client_temp 用户缓存位置 
--http-proxy-temp-path=/var/cache/nginx/proxy_temp 代理缓存
--http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp  中间件缓存
--http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp 中间件缓存
--http-scgi-temp-path=/var/cache/nginx/scgi_temp 中间件缓存

--user=nginx 用户
--group=nginx 组

--with-compat 启用动态模块支持

--with-file-aio 使用aio会大大提高性能，epoll模型等等 
--with-threads 多线程
--with-http_addition_module # css js 响应追加 响应之前或之后追加文本内容
--with-http_auth_request_module 认证模块
--with-http_dav_module 增加上传put，delete，mkcol，创建集合，copy，和move方法，默认情况下是关闭
--with-http_flv_module 增加mp4 flv视频支持模块
--with-http_gunzip_module 压缩模块
--with-http_gzip_static_module 压缩
--with-http_mp4_module 多媒体模块 mp4
--with-http_random_index_module 随机主页模块
--with-http_realip_module 获取真实ip
--with-http_secure_link_module 安全链接 nginx安全下载模块
--with-http_slice_module nginx中文文档
--with-http_ssl_module ssl加密
--with-http_stub_status_module 访问状态模块 
--with-http_sub_module 替换网站响应内容
--with-http_v2_module httpv2
--with-mail 邮件
--with-mail_ssl_module 邮件加密
--with-stream 负载均衡
--with-stream_realip_module 负载均衡
--with-stream_ssl_module 负载均衡
--with-stream_ssl_preread_module 负载均衡
--with-cc-opt='-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector-strong --param=ssp-buffer-size=4 -grecord-gcc-switches -m64 -mtune=generic -fPIC' cpu优化参数
--with-ld-opt='-Wl,-z,relro -Wl,-z,now -pie' 其他参数
```



# 6、Nginx基本配置

## 观察主配置

### 1、全局、核心块

配置影响nginx全局的指令，一般有运行nginx服务器的用户组，nginx进程pid存放路径日志存放路径，配置文件引入，允许生成worker process数等

### 2、events块

配置影响服务器与用户的网络连接，有每天个进程的最大连接数，选取哪种事务驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化

### 3、http块

可以嵌套多个server，配置代理、缓存，日志定义等大多数动能和第三方模块的配置。如文件引入，mine-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等

### 4、server块

配置虚拟主机的相关参数，一个http中有多个server

### 5、location块

配置请求的路由，以及各种页面的处理情况



## 观察默认虚拟主机配置文件

```bash
[root@nginx-server ~]# cat /etc/nginx/conf.d/default.conf 
server {
    listen       80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main; # 日志

    location / {
        root   /usr/share/nginx/html; 网页目录
        index  index.html index.htm; 网站主页的名字
    }

    #error_page  404              /404.html;	# 404页面

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html; # 500错误
    location = /50x.html { # 50*页面
        root   /usr/share/nginx/html;
    }

# 动态页面
    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}

```



## 观察一个新的虚拟主机

```bash
[root@nginx-server ~]# cat /etc/nginx/conf.d/net_map.conf 
server{
  server_name 127.0.0.1;
  listen      81;
  
  location / {
    root /www/wwwroot/net_map;
    index index.html;
	}


}

```



# 7、Nginx日志Log

## 日志设置

### 日志模块

#### 官方文档

nginx.org/us/docs/http/ngx_http_log_module

#### 日志模块名称

ngx_http_log_module

### 相关指令

#### log_format

日志格式

nginx有非常灵活的日志记录模式，每个级别的配置跨行业有地里的访问日志，

语法

Syntax： log_format name [escape=default|json] string # name是名称 string是定义

### 日志的格式和命令

```bash
格式

默认值

log_format main '$remote_address - $remote_user [$time_local] "$request" ' ‘$status $body_type_sent "$http_referer"''$http_user_agent $http_x_forwarded_for"';


```



### 访问日志和错误日志

#### access_log

```bash
$remote_address 远程地址
$remote_user 远程用户（得验证）
$time_local 本地时间
$request 请求的方式 GET、POST 路由地址 HTTP版本 
$status 状态代码200
$body_type_sent 发送文件大小
$http_referer 记录从哪个页面链接访问过来 
$http_user_agent UA
$http_x_forwarded_for 代理ip
```



#### error_log

var/log/nginx/error.log-20211108

404 Not found

403 forbidden

### 日志缓存

open_log_file_cache

默认是关闭的。。占用内存，减少磁盘占有量

```bash
syntac: open_log_file_cache max=1000 inactive=20s min_uses=3 valid=1m

max=1000 是指文件日志的FD，最大缓存是1000次，超了怎么办

min_user=3 20秒小于三次访问FD，就给清理掉，结合inactive 20s

valid 1m 检查周期是1分钟

总结：缓存最多为1分钟，到了极限，每分钟开始清除掉，20秒内小于3次FD
```



## 日志轮转、切割

[root@nginx-server ~]# rpm -ql nginx | grep log
/etc/logrotate.d/nginx
/var/log/nginx



default:vim /etc/logrotate.d/nginx 

```bash
/var/log/nginx/*.log {
        daily # 每天备份
        missingok # 丢失不提示
        rotate 52 # 保留52天的
        compress # 压缩
        delaycompress # 延迟压缩
        notifempty # 空文件不轮转
        create 640 nginx adm  # 创建 640 权限 nginx用户 
        sharedscripts
        postrotate # 重启nginx
                if [ -f /var/run/nginx.pid ]; then
                        kill -USR1 `cat /var/run/nginx.pid`
                fi
        endscript
}

```



## 日志分析

常用变量

```bash
$remote_addr, 远程地址： 记录客户端IP地址
$remote_user，远程用户：记录客户端用户名称
[$time_local]，本地时间：服务器自身时间
$request， 请求：记录请求的URL和HTTP协议
$status 状态：记录请求状态
$body_bytes_sent 发送给客户端的字节数，不包括响应头的大小
$http_referer 记录从哪个页面链接访问过来的  （超链接）（referer引用）
$http_user_agent ，记录客户端浏览器相关信息
$http_x_forwarded_for，代理IP
$request_length 请求的长度（包括请求行，请求头和请求正文）
$time_iso8601 ISO8601标准格式下的本地时间。
$bytes_sent 发送给客户端的总字节数    （可在主配置文件中，增加此项观c）
$msec 日志写入时间。单位为秒，精度是毫秒。
```

\1. 统计2017年9月5日 PV量（网页页面访问量）

8点-9点间 

```
grep '05/Sep/2017:08' sz.mobiletrain.org.log |wc -l 
awk '$4>="[05/Sep/2017:08:00:00" && $4<="[05/Sep/2017:09:00:00" {print $0}' sz.mobiletrain.org.log | wc -l
```

\2. 统计2017年9月5日 一天内访问最多的10个IP（ip top10）

```
grep '05/Sep/2017' cd.mobiletrain.org.log | awk '{ ips[$1]++ } END{for(i in ips){print i,ips[i]} } '| sort -k2 -rn | head -n10 （end小写不显示）
```

\3. 统计2017年9月5日 访问大于100次的IP

```
grep '05/Sep/2017' cd.mobiletrain.org.log | awk '{ ips[$1]++ } END{for(i in ips){ if(ips[i]>100) {print i,ips[i]}} } '| sort -k2 -rn | head -n10
```

\4. 统计2017年9月5日 访问最多的10个页面（$request top 10）

```
grep '05/Sep/2017' cd.mobiletrain.org.log |awk '{urls[$7]++} END{for(i in urls){print urls[i],i}}' |sort -k1 -rn |head -n10
```

\5. 统计2017年9月5日 每个URL访问内容总大小（$body_bytes_sent）

```
grep '05/Sep/2017' sz.mobiletrain.org.log |awk '{ urls[$7]++; size[$7]+=$10}END{for(i in urls){print urls[i],size[i],i}}'|sort -k1 -rn | head -n10
```

\6. 统计2017年9月5日 每个IP访问状态码数量（$status）

```
grep '05/Sep/2017' cd.mobiletrain.org.log | awk '{ ip_code[$1" "$9]++}END{ for(i in ip_code){print i,ip_code[i]} }' | sort -k1 -rn | head -n10
```

\7. 统计2017年9月5日 每个IP访问状态码为404及出现次数（$status）

```
grep '05/Sep/2017' cd.mobiletrain.org.log |awk '$9=="404"{ccc[$1" "$9]++}END{for(i in ccc){print i,ccc[i]}}' | sort -k3 -rn grep '05/Sep/2017' sz.mobiletrain.org.log | awk '{if($9="404"){ip_code[$1" "$9]++}}END{for(i in ip_code){print i,ip_code[i]}}'
```

\8. 统计前一分钟的PV量

```
date=$(date -d '-1 minute' +%d/%b/%Y:%H:%M);awk -v date=$date '$0 ~ date {i++} END{print i}' sz.mobiletrain.org.log
```

shell中的变量在awk程序中无法使用，因为在执行AWK时，是一个新的进程去处理的，因此就需要-v 来向awk程序中传参数了，

你比如在shell程序中有一个变量a=15，你在awk程序中直接使用变量a是不行的，而你用awk -v b=a， 这样在AWK程序中就可以使用变量b了！也就相当于使用a了！

```
# date=$(date -d '-1 minute' +%Y:%H:%M); awk -v date=$date '$0 ~ date{i++}END{print i}' /var/log/nginx/xuleilinux.access.log 
```

\9. 统计2017年9月5日 8:30－9:00，每个IP，出现404状态码的数量

```
awk '$4>="[05/Sep/2017:08:30:00" && $4<="[05/Sep/2017:09:00:00" {if($9="404"){ip_code[$1" "$9]++}}END{for(i in ip_code){print i,ip_code[i]}}' sz.mobiletrain.org.log
```

\10. 统计2017年9月5日 各种状态码数量

```
grep '05/Sep/2017' sz.mobiletrain.org.log |awk '{code[$9]++} END{for(i in code){print i,code[i]}}'
```

百分比

```
grep '05/Sep/2017' sz.mobiletrain.org.log | awk '{code[$9]++;total++} END{for(i in code){printf i" ";printf code[i]"\t";printf "%.2f",code[i]/total*100;print "%"}}'
```

 

```bash
cat << EOF
 
=============================================================
 
1.  一天内访问最多的10个IP（ip top10）
 
2.  访问大于100次的IP
 
3.  PV量总量
 
4.  访问最多的10个页面（$request top 10）
 
5.  每个URL访问内容总大小（$body_bytes_sent）
 
6.  IP访问状态码为404及出现次数（$status）
 
7.  统计某天 每个IP访问状态码数量（$status）
 
8.  统计前一分钟的PV量
 
9. 统计某天 各种状态码数量
 
===============================================================
 
EOF
 
read -p "输入查询的日志目录的位置: " b
 
read -p "输入查询的时间 格式:如 05/Sep/2017 : " a
 
read -p "输入选项：" n
 
case "$n" in
 
        1)
 
        echo "正在查询一天内访问最多的10个IP"
 
        sleep 1
 
        #一天内访问最多的10个IP（ip top10）
 
        grep $a $b | awk '{ ips[$1]++ } END{for(i in ips){print i,ips[i]} } '| sort -k2 -rn | head -n10
 
        ;;
 
        2)
 
        echo " 访问大于100次的IP"
 
        #访问大于100次的IP
 
        grep $a $b | awk '{ ips[$1]++ } END{for(i in ips){ if(ips[i]>100)  {print i,ips[i]}} } '| sort -k2 -rn | head -n10
 
        ;;
 
        3)
 
        echo "pv总量"
 
        #pv总量
 
        grep $a $b |wc -l
 
        ;;
 
        4)
 
        echo "访问最多的10个页面（$request top 10）"
 
        #访问最多的10个页面（$request top 10）
 
        grep $a $b |awk '{urls[$7]++} END{for(i in urls){print urls[i],i}}' |sort -k1 -rn |head -n10
 
        ;;
 
        5)
 
        echo "每个URL访问内容总大小（$body_bytes_sent）"
 
        #每个URL访问内容总大小（$body_bytes_sent）
 
        grep $a $b |awk '{ urls[$7]++; size[$7]+=$10}END{for(i in urls){print urls[i],size[i],i}}'|sort -k1 -rn | head -n10
 
        ;;
 
        6)
 
        echo "IP访问状态码为404及出现次数（$status）"
 
        #IP访问状态码为404及出现次数（$status）
 
        grep $a $b | awk '{if($9="404"){ip_code[$1" "$9]++}}END{for(i in ip_code){print i,ip_code[i]}}'
 
        ;;
 
        7)
 
        echo " 统计$a 每个IP访问状态码数量（$status）"
 
        # 统计某天 每个IP访问状态码数量（$status）
 
        grep $a $b | awk '{ ip_code[$1" "$9]++}END{ for(i in ip_code){print i,ip_code[i]} }' | sort -k1 -rn | head -n10
 
        ;;
 
        8)
 
        echo "统计前一分钟的PV量"
 
        #8. 统计前一分钟的PV量
 
        date=$(date -d '-1 minute' +%d/%b/%Y:%H:%M);awk  -v date=$date '$0 ~ date {i++} END{print i}'  $b
 
        ;;
 
        9)
 
        echo "统计$a 各种状态码数量"
 
        #统计某天 各种状态码数量
 
        grep $a $b  | awk '{code[$9]++} END{for(i in code){print i,code[i]}}'
 
        echo "统计$a 各种状态码数量 百分比形式"
 
        #统计某天 各种状态码数量
 
        grep $a $b | awk '{code[$9]++;total++} END{for(i in code){printf i" ";printf code[i]"\t";printf "%.2f",code[i]/total*100;print "%"}}'
 
        ;;
 
esac
```



统计 pv 量

统计 一天内访问最多的10个ip

统计访问量超过100次的ip



# 8、Nginx WEB模块

## 连接状态

### stub_status_module

```
[root@nginx-server ~]# cat /etc/nginx/conf.d/net_map.conf 
server{
  open_log_file_cache max=1000 inactive=20s min_uses=3 valid=1m;


  server_name 127.0.0.1;
  listen      81;
  
  location / {
    root /www/wwwroot/net_map;
    index index.html;
  }

  location /nginx_stus {
    stub_status;
    allow all;
  }
}
```



![image-20211108175559426](nginx01.assets\image-20211108175559426-16363653618291.png)

![image-20211108175735388](nginx01.assets\image-20211108175735388.png)

Active connections 当前活动连接数

发起连接数 成功连接数 请求书

读 写 写

### 什么是连接

TCP机制

重传计时器 Retransmession

持久计时器 Persistance

保活计时器 keep-alive

时间等待 time-wait

### 什么是长连接

只握手不不挥手

[root@nginx-server ~]# vim /etc/nginx/nginx.conf 
[root@nginx-server ~]# 

``` bash
 keepalive_timeout  65;
```

## 随机主页

### 目的

random_index_module

将主页设置为随机页面，是一种微调机制

### 启动随机主页

- 创建主页目录

```bash
[root@nginx-server ~]# pwd
/root
[root@nginx-server ~]# mkdir app
[root@nginx-server ~]# touch app/{blue.html,.yellow.html,red.html,green.html}
[root@nginx-server ~]# ls app/
blue.html  green.html  red.html
[root@nginx-server ~]# ls -a app/
.  ..  blue.html  green.html  red.html  .yellow.html
```

- 创建多个主页

- ```bash
  [root@nginx-server ~]# echo blue >> app/blue.html 
  [root@nginx-server ~]# echo green >> app/green.html 
  [root@nginx-server ~]# echo red >> app/red.html 
  [root@nginx-server ~]# echo yellow >> app/.yellow.html 
  ```

- 启动随机主页

- ```bash
  [root@nginx-server ~]# cat /etc/nginx/conf.d/net_map.conf 
  server{
    open_log_file_cache max=1000 inactive=20s min_uses=3 valid=1m;
  
  
    server_name 127.0.0.1;
    listen      81;
    
    location / {
      root /www/wwwroot/app;
      random_index on;
    }  
  
    location /111 {
      root /www/wwwroot/net_map;
      index index.html;
    }
  
    location /nginx_stus {
      stub_status;
      allow all;
    }
  }
  [root@nginx-server ~]# 
  ```

- 

- 请注意隐藏文件并不会被随机选取

- **隐藏文件不会被读取**

## 替换模块

sub_module

网站可能由模板生成,实现纠错，文字校验

  sub_filter 云透视 'somestring';
  #sub_filter_once on; #只换一次

```bash
[root@nginx-server ~]# cat /etc/nginx/conf.d/net_map.conf 
server{
  open_log_file_cache max=1000 inactive=20s min_uses=3 valid=1m;


  server_name 127.0.0.1;
  listen      81;
  
  sub_filter 云透视 'somestring';
  #sub_filter_once on; #只换一次

  location / {
    root /www/wwwroot/net_map;
    index index.html;
    
  }  


  location /222 {
    root /www/wwwroot/app;
    random_index on;
  }  

  location /111 {
    root /www/wwwroot/net_map;
    index index.html;
  }

  location /nginx_stus {
    stub_status;
    allow all;
  }
}

```





## 文件读取

ngx_http_core_module

### 语法

#### sendfile [on] | off;

文件传输过程

未使用sendfile【默认】

硬盘 >> kernel buffer >> user buffer >> kernel socket buffer >> 协议栈

使用sendfile()

硬盘 >> kernel buffer 快速拷贝到kernelsocket buffer >> 协议栈

#### tcp_nopush

未使用tcp_nopush，网络资源浪费

应用操作每产生一次操作就发送一个包，典型情况携带40字的包头，于是产生4000%过载，网络堵塞

使用tcp_nopush ，网络传输效率提升

tcp_nopush on | [default off];

包攒到一定数量再发

#### tcp_nodelay

开启或关闭nginx使用tcp_nodelay选项的功能。这个选项仅在连接编程**长连接**时候才能被启用，

tcp_nodelay 是禁用nagle算法，即数据包立即发送出去

由于Nagle 和DelayedACK的原因，数据包的确认信息需要积攒到两个时才发送，长连接情况下，奇数包会造成延时40ms，所以tcp_nodelay会将ack立刻发送除去，如果不在长连接时，可以关闭此模块，因为ack会被立刻发送出去

```bash
server {
...

tcp_nodelay on;
...
}

或者 

location /video/ {
...
  sendfile on;
  tcp_nopush on;
...
}
```





## 文件压缩

ngx_http_gzip_module

gzip on|[default off]

context:http,server,location, if in location



gzip_comp_level [level 1-9]

context http,server,location



gzip_http_version 1.0|[default 1.1]

context http,server,location

```bash

    gzip  on;
    gzip_http_version 1.1;
    gzip_comp_level 9;
    gzip_types  text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
```



```bash
[root@nginx-server ~]# cat /etc/nginx/nginx.conf 

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    gzip  on;
    gzip_http_version 1.1;
    gzip_comp_level 9;
    gzip_types  text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;

    include /etc/nginx/conf.d/*.conf;
}
[root@shell ~]# systemctl restart nginx
```



## 页面缓存

ngx_http_headers_module

http段或者server段或者location段

expires [modified] time;

expires epoch |max十年 | off;

default expires off;

context http,server,location,if in location



1、开启浏览器缓存，浏览页面

第一次返货状态码200，页面对象全文传输

第二次返回状态304，页面对象部分传输

2、金庸缓存，访问

状态码200

vim /etc/nginx/conf.d/net_map.conf

```bash
location / {
...
  expeires 24h;
...
}
```

​	浏览器缓存head中 有一个 

cache-control: 86400 单位秒

## 防盗链

模块： ngx_

```bash
location / {
  root /a.com;
  index index.html;
  valid_referer none block *.a.com;
  if ($invalid_referer){
    retuen 403;
  }
}
```

白名单

写法： server_name 192.168.100.* ~tianyun ~\.google\. ~\.baidu\. b.com;

```bash
location / {
  root /a.com;
  index index.html;
  valid_referer none blocked *.b.com server_name 192.168.100.* ~tianyun ~\.google\. ~\.baidu\. b.com;
  if($invalid_referer) {
    return 403;
  }
}
```

生产环境

```bash
location ~*\.(jpg|png|gif|bmp)$ {
  root /a.com;
  index index.html;
  valid_referer none blocked *.b.com server_name 192.168.100.* ~tianyun ~\.google\. ~\.baidu\. b.com;
  if($invalid_referer) {
    #return 403;
    rewrite .* http://a.com/403.jpg;
  }
}
```



# 9、Nginx访问限制

一定程度防泛洪攻击：ngx_http_limit_req_module  ngx_http_limit_conn_module

测试：

```
yum install -t httpd-tools
ab -n 100 -c 10 http://a.com/
选项是：
    -n requests 要执行的请求数
    -c concurrency 一次发出的多个请求的数量
    -t timelimit 秒到最大值。花在基准测试上
                    这意味着 -n 50000
    -s timeout 秒到最大值。等待每个响应
                    默认为 30 秒
    -b windowsize TCP 发送/接收缓冲区的大小，以字节为单位
    -B address 进行传出连接时绑定的地址
    -p postfile 包含要 POST 的数据的文件。还记得设置 -T
    -u putfile 包含要 PUT 的数据的文件。还记得设置 -T
    -T content-type 用于 POST/PUT 数据的内容类型标头，例如。
                    '应用程序/x-www-form-urlencoded'
                    默认为“文本/纯文本”
    -v verbosity 要打印多少故障排除信息
    -w 在 HTML 表格中打印结果
    -i 使用 HEAD 而不是 GET
    -x 属性 要作为表属性插入的字符串
    -y 属性字符串作为 tr 属性插入
    -z 属性字符串作为 td 或 th 属性插入
    -C 属性 添加 cookie，例如。 '阿帕奇= 1234'。 （可重复）
    -H 属性添加任意标题行，例如。 '接受编码：gzip'
                    在所有正常标题行之后插入。 （可重复）
    -A 属性 添加 Basic WWW Authentication，属性
                    是冒号分隔的用户名和密码。
    -P 属性 添加Basic Proxy Authentication，属性
                    是冒号分隔的用户名和密码。
    -X proxy:port 代理服务器和要使用的端口号
    -V 打印版本号并退出
    -k 使用 HTTP KeepAlive 功能
    -d 不显示百分位数服务表。
    -S 不显示置信度估计值和警告。
    -q 执行超过 150 个请求时不显示进度
    -g filename 将收集到的数据输出到 gnuplot 格式文件。
    -e filename 输出带有百分比的 CSV 文件
    -r 不要在套接字接收错误时退出。
    -h 显示使用信息（此消息）
    -Z ciphersuite 指定 SSL/TLS 密码套件（参见 openssl 密码）
    -f protocol 指定 SSL/TLS 协议
                    （SSL3、TLS1、TLS1.1、TLS1.2 或 ALL）
                    \
             
-N|--count 总请求数，缺省 : 5w
-C|--clients 并发数, 缺省 : 100
-R|--rounds 测试次数, 缺省 : 10 次
-S|-sleeptime 间隔时间, 缺省 : 10 秒
-I|--min 最小并发数,　缺省: 0
-X|--max 最大并发数，缺省: 0
-J|--step 次递增并发数
-T|--runtime 总体运行时间,设置此项时最大请求数为5w
-P|--postfile post数据文件路径
-U|--url 测试地址
```

```bash
#!/bin/bash
echo '*==========================================================*'
echo '|  本脚本工具基于ab(Apache benchmark)，请先安装好ab, awk   |'
echo '|  注意：                                                  |'    
echo '|     shell默认最大客户端数为1024                          |'
echo '|     如超出此限制，请使用管理员执行以下命令：             |'
echo '|     ulimit -n 655350                                 |'
echo '*==========================================================*'

function usage() {
    echo '  命令格式：'
    echo '  ab-test-tools.sh'
    echo '      -N|--count 总请求数，缺省 : 5w'
    echo '      -C|--clients 并发数, 缺省 : 100'
    echo '      -R|--rounds 测试次数, 缺省 : 10 次'
    echo '      -S|-sleeptime 间隔时间, 缺省 : 10 秒'
    echo '      -I|--min 最小并发数,　缺省: 0'
    echo '      -X|--max 最大并发数，缺省: 0'
    echo '      -J|--step 次递增并发数'
    echo '      -T|--runtime 总体运行时间,设置此项时最大请求数为5w' 
    echo '      -P|--postfile post数据文件路径'
    echo '      -U|--url 测试地址'
    echo ''
    echo '  测试输出结果*.out文件'

    exit;
}


# 定义默认参数量
# 总请求数
count=50000
# 并发数
clients=100O
# 测试轮数
rounds=10
# 间隔时间
sleeptime=10
# 最小并发数
min=0
# 最大数发数
max=0
# 并发递增数
step=0
# 测试地址
url=''
# 测试限制时间
runtime=0
# 传输数据
postfile=''


ARGS=`getopt -a -o N:C:R:S:I:X:J:U:T:P:h -l count:,client:,round:,sleeptime:,min:,max:,step:,runtime:,postfile:,help -- "$@"`
[ $? -ne 0 ] && usage
eval set -- "${ARGS}" 

while true 
do
    case "$1" in
    -N|--count)
        count="$2"
        shift
        ;;
        
    -C|--client)
        clients="$2"
        shift
        ;;

    -R|--round)
        rounds="$2"
        shift
        ;;

    -S|--sleeptime)
        sleeptime="$2"
        shift
        ;;

    -I|--min)
        min="$2"
        shift
        ;;

    -X|--max)
        max="$2"
        shift
        ;;

    -J|--step)
        step="$2"
        shift
        ;;

    -U|--url)
        url="$2"
        shift
        ;;

    -T|--runtime)
        runtime="$2"
        shift
        ;;

    -P|--postfile)
        postfile="$2"
        shift
        ;;

    -h|--help)
        usage
        ;;

    --)
        shift
        break
        ;;
    esac
shift
done

# 参数检查
if [ x$url = x ]
then
    echo '请输入测试url，非文件/以为结束'
    exit
fi

flag=0
if [ $min != 0 -a $max != 0 ]
then 
    if [ $max -le $min ] 
    then
        echo '最大并发数不能小于最小并发数'
        exit
    fi

    if [ $step -le 0 ]
    then
        echo '并发递增步长不能<=0'
        exit
    fi

    if [ $min -lt $max ]
    then
        flag=1
    fi
fi


# 生成ab命令串
cmd="ab -k -r"

#　数据文件
if [ x$postf != x ]
then
    cmd="$cmd -p $postf"
fi

if [ x$tl != x -a $tl != 0 ]
then 
    max=50000;
    cmd="$cmd -t$tl"
fi
cmd="$cmd -n$count"

echo '-----------------------------';
echo '测试参数';
echo "  总请求数：$count";
echo "  并发数：$clients";
echo "  重复次数：$rounds 次";
echo "  间隔时间：$sleeptime 秒";
echo "  测试地址：$url";

if [ $min != 0 ];then
echo "  最小并发数：$min";
fi

if [ $max != 0 ];then
echo "  最大并发数：$max";
fi

if [ $step != 0 ];then
echo " 每轮并发递增：$step" 
fi


# 指定输出文件名
datestr=`date +%Y%m%d%H%I%S`
outfile="$datestr.out";

# runtest $cmd $outfile $rounds $sleeptime
function runtest() {
    # 输出命令
    echo "";
    echo '  当前执行命令：'
    echo "  $cmd"
    echo '------------------------------'

    # 开始执行测试
    cnt=1
    while [ $cnt -le $rounds ];
    do
        echo "第 $cnt 轮 开始"
        $cmd >> $outfile 
        echo "\n\n" >> $outfile
        echo "第 $cnt 轮 结束"
        echo '----------------------------'

        cnt=$(($cnt+1))

        if [ $cnt -le $rounds ]; then
            echo "等待 $sleeptime 秒"
            sleep $sleeptime
        fi 
    done
}


temp=$cmd;
if [ $flag != 0 ]; then
    cur=$min
    over=0
    while [ $cur -le $max ]
    do
        cmd="$temp -c$cur $url"
        runtest $cmd $outfile $rounds $sleeptime 

        cur=$(($cur+$step))
        if [ $cur -ge $max -a $over != 1 ]; then
           cur=$max 
           over=1
        fi
    done
else 
    cmd="$cmd -c$clients $url"
    runtest $cmd $outfile $rounds $sleeptime 
fi


# 分析结果
if [ -f $outfile ]; then
echo '本次测试结果如下：'
echo '+------+----------+----------+---------------+---------------+---------------+--------------------+--------------------+'
echo '| 序号 | 总请求数 |  并发数  |   失败请求数  |   每秒事务数  |  平均事务(ms) | 并发平均事务数(ms) |　  总体传输字节数  |'
echo '+------+----------+----------+---------------+---------------+---------------+--------------------+--------------------+'

comp=(`awk '/Complete requests/{print $NF}' $outfile`) 
concur=(`awk '/Concurrency Level:/{print $NF}' $outfile`)
fail=(`awk '/Failed requests/{print $NF}' $outfile`)
qps=(`awk '/Requests per second/{print $4F}' $outfile`)
tpr=(`awk '/^Time per request:(.*)\(mean\)$/{print $4F}' $outfile`)
tpr_c=(`awk '/Time per request(.*)(mean, across all concurrent requests)/{print $4F}' $outfile`)
trate=(`awk '/Transfer rate/{print $3F}' $outfile`)

for ((i=0; i<${#comp[@]}; i++))
do
    echo -n "|"
    printf '%6s' $(($i+1)) 
    printf "|"

    printf '%10s' ${comp[i]}
    printf '|'
    
    printf '%10s' ${concur[i]}
    printf '|'

    printf '%15s' ${fail[i]}
    printf '|'

    printf '%15s' ${qps[i]}
    printf '|'

    printf '%15s' ${tpr[i]}
    printf '|'

    printf '%20s' ${tpr_c[i]}
    printf '|'

    printf '%20s' ${trate[i]}
    printf '|'

    echo '';
    echo '+-----+----------+----------+---------------+---------------+---------------+--------------------+--------------------+'
done
echo ''
fi
```

怎么用

vim /etc/nginx/nginx.conf

## request限制

定义：

```bash
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s
限制请求         二进制地址            限制策略的名称  占用10M空间 允许每秒1次请求
```

引用

```bash
http {
  limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s;
  server {
    location / {
      root /usr/...;
      index ...;
       limit_req zone=req_zone;
       # limit_req zone=req_zone burst=5;
       # limit_req zone=req_zone burst=5 nodelay;
    }
  }
}

limit_req zone=req_zone
```

## 限制tcp连接

[单个ip，同时只有一个连接]

```bash
http {
  limit_conn_zone $binary_remote_addr zone=conn_zone:10m;
  server {
    location / {
      limit_conn conn_zone 1;
    }
  }
}
```

# 10、Nginx访问控制

## 基于主机（ip）

module : ngx_http_access_module

Directives：

Allow：

```bash
allow 
```

Deny:

```bash
deny
```

Syntax：

```bash
 allow address | CIDR | unix: |all;
 context: http,server,location,limit_except
```

启用控制

```bash
http {
  ...
  allow 192.168.100.10;
  deny all;
  ...
}
```



## 基于用户（username&password)

module: 

```bash
ngx_http_auth_basic_module
```

Syntax 1:

```bash
auth_basic string | off;
context: http,server,location,limit_expcet
```

Syntax 2:

```bash
auth_basic_user_file file
context: http,server,location,limit_except
```

启用控制：

```bash
yum install httpd-tools
htpasswd -cm /etc/nginx/conf.d/passwd username10
-c 新的
-m  Force MD5 encryption of the password (default)
htpasswd -m /etc/nginx/conf.d/passwd username20
cat /etc/nginx/conf.d/passwd
```

```bash
server {
  auth_basic "来了老铁,对一下暗号！！";
  auth_basic_user_file /etc/nginx/conf.d/passwd;
}
```

