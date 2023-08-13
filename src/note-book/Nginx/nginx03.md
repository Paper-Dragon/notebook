# Nginx Web架构实战

## 动态网站架构

| 文件       | 语言       | 架构                                 |
| ---------- | ---------- | ------------------------------------ |
| index.py   | 开源python | apache+python+mysql                  |
| index.jsp  | 商业java   | tomcat+jdk+oracle                    |
| index.asp  | 商业C#     | iis+asp.net+sqlserver/oracle/mongodb |
| index.html | html       | html                                 |
| index.php  | 开源php    | nginx+php+mysql                      |



## LNMP动态网站环境部署

···

Linux Nginx php-fpm mysql



php-fpm php接收动态请求的程序

php-mysql php连接mysql的程序

php-gd 图形库程序 gd库可以处理图片，或者生成图片

```php
<?php phpinfo() ?>
```

```bash
<?php
$dbhelper=mysql_connect('localhost','root','123456');
if($dbhelper){
	echo "Success";
}
else {
	echo "Fail";
}
mysql_close();
?>
~  
```



## fastcgi & php-fpm

模块：ngx_fastcgi_module

FastCGI & PHP-fpm

FastCGI => Fast Common Gateway Interface(快速通用网关接口)

    模块：ngx_fastcgi_modul
    
    原理：处理动态请求的接口、nginx 通过ngx_fastcgi_modul模块 链接 php-fpm处理动态请求。

PHP-fpm => php Pastcgi Process Manager(fastcgi进程管理器)

    原理：PHP通过php-fpm接收前台nginx的动态访问的请求，向后端Mysql进行查询请求后，将查询结果返回给前台nginx。

PHP-mysql

    原理：php连接mysql的独立子程序(接口程序)

LNMP运行原理

    环境：用户访问的http请求是由两种组成 => 静态请求、动态请求
    1. 当用户发起静态请求 => .txt .jpg .avi .css,这些都属于静态元素
        nginx是能够独立进行处理,并且将数据返还给用户。
    2. 当用户发起动态请求 => .php..... nginx程序是无法全面处理动态请求,
       nginx通过FastCGI模块连接PHP
    3. PHP接收用户的动态请求,再通过php-fpm处理动态请求
    4. 最后通过php-mysql连接数据库,进行动态存储数据,经查询的结果返还给用户。


## php-fpm初始化设置

### 核心配置文件

    vim /etc/php.ini
        # date.timezone = PRC  (Asia/Shanghai)    #设置PHP时区
        # open_basedir           #设置PHP脚本访问的目录

### 全局配置文件

    vim /etc/php-fpm.conf 
        # pid = /run/php-fpm/php-fpm.pid  //pid文件的位置
        # error_log = log/php-fpm.log    //错误日志的文件
        # log_level = notice　  //记录日志的等级
        # process.max = 3     //控制子进程最大数、0表示无限制、默认没设置
        # daemonize = yes    //经fpm转至后台运行(守护进程,执行后不会退出)

日志等级

      alert（必须立即处理）
      error（错误情况）
      warning（警告情况）
      notice（一般重要信息）        
      debug（调试信息）
    
      默认: notice.

### 扩展配置文件

    vim /etc/php-fpm.d/www.conf
        # user = nginx  //设置用户
        # group = nginx //设置用户组
        # listen.allowed_clients = 127.0.0.1  //分离式部署时填写的Nginx服务器地址
        # listen = 127.0.0.1:9000   //本机的监听地址:端口
        # slowlog = /var/log/php-fpm/$pool-slow.log  //开启慢日志
        # pm=dynamic   //动态模式进程管理开启(下列进程的数量可以调整)
        # start_servers=5  //初始化进程数量
        # min_spare_server =5  //最小空闲进程数(等待更多用户访问)、必须保证5个进程闲着
        # max_children = 50   // 最大进程数(防止多用户来时,服务器内存的负载)
        # max_spare_servers=10 //最大空闲进程数/消灭进程(高并发过后,子进程的剩余数)
        # max_requests = 500  //每个子进程能响应的请求数量，到达此数字，该PHP进程就被释放掉了。


max_spare_servers=10

    原理：只要是用在高并发场景/用户大规模，用户处理完请求后,有很多空闲的进程
         每个进程之间都会消耗服务器的内存资源，一个php进程占用20M-30M空间
         设置最大进程数,消灭多余的子进程,为服务器节省资源的消耗。

max_requests = 500

    原理：每一个进程在处理完用户的请求之后,会残留用户不用的数据,这些数据会滞留在内存中
         占用系统的资源,等待处理完500次请求后,在服务完成的最后一刻,释放掉,消灭该进程。
         等下一个用户来了,在分出一个子进程处理。
    滞留的数据：当你访问淘宝买东西,点一件商品,选好规格、颜色等信息后,你又不准备买,直接退出。
              等你下一个在选择这件商品时,还是你之前选好的规格、颜色等.....
              这些数据就滞留在服务器内存中。

优化php-fpm(生产环境)

    1. vim /etc/php-fpm.d/www.conf
            # pm = dynamic
            # pm.start_servers = 32
            # pm.max_children = 512
            # pm.min_spare_servers = 32
            # pm.max_spare_servers = 64
            # pm.max_requests = 1500
        
    2. 重启生效： systemctl  restart  php-fpm
    3. 查看进程数：ps aux|grep php|wc -l    
### 启动php状态监控页面功能

原理：通过Web前端展示页面详细显示PHP的状态,主要是给PHP工程师搭建

    1. 启动测试页面： vim  /etc/php-fpm.d/www.conf
        # pm.status_path = /php_status
    2. nginx配置页面转发：vim /etc/nginx/conf.d/default.conf
        location = /php_status {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_param SCRIPT_FILENAME $fastcgi_script_name;  #在运行时用的内置变量参数
            include fastcgi_params;  #包含了用到的变量
        }
    3. 配置生效： systemctl restart php-fpm 
                systemctl restart nginx
    4. 访问测试页面： http://本机IP/php_status

php_status参数解析

    pool                  #fpm池名称,大多数为www
    process manager       #进程管理方式dynamic或者static
    start time            #启动日志,如果reload了fpm，时间会更新
    start since           #运行时间
    accepted conn         #当前池接受的请求数
    listen queue          #请求等待队列,如果这个值不为0,那么需要增加FPM的进程数量
    max listen queue      #请求等待队列最高的数量
    listen queue len      #socket等待队列长度
    idle processes        #空闲进程数量
    active processes      #活跃进程数量
    total processes       #总进程数量
    max active processes  #最大的活跃进程数量（FPM启动开始计算）
    max children reached  #程最大数量限制的次数，如果这个数量不为0，那说明你的最大进程数量过小,可以适当调整。




## Nginx Location

### 语法规则

 location [=||*|^~] /uri/ {… }

| 符号                  | 含义                                                         |
| --------------------- | ------------------------------------------------------------ |
| =                     | = 开头表示精确匹配                                           |
| ^~                    | ^~开头表示uri以某个常规字符串开头，理解为匹配 url路径即可。nginx不对url做编码，因此请求为/static/20%/aa，可以被规则^~ /static/ /aa匹配到（注意是空格） |
| ~                     | ~ 开头表示区分大小写的正则匹配                               |
| ~*                    | ~* 开头表示不区分大小写的正则匹配                            |
| !~ 和 !~*             | !~ 和 !~*分别为区分大小写不匹配及不区分大小写不匹配的正则    |
| /                     | 用户所使用的代理（一般为浏览器）                             |
| $http_x_forwarded_for | 可以记录客户端IP，通过代理服务器来记录客户端的ip地址         |
| $http_referer         | 可以记录用户是从哪个链接访问过来的                           |

精确匹配》字符开头》正则匹配》通配



## Nginx Rewrite

### rewrite简介

```
 Rewrite对应URL Rewrite,即URL重写，就是把传入web的请求重定向到其他URL的过程.
# 当运维遇到要重写情况时，往往是要程序员把重写规则写好后，发给你，你再到生产环境下配置。对于重写规则
# 说到底就是正则匹配，做运维的岂能对正则表达式不了解的？最起码最基本的正则表达式会写。套用一句阿里的话(某网友说是阿里说的，不清楚到底是不是出自阿里)“不懂程序的运维，不是好运维；不懂运维的开发，不是好开发。”

# Nginx的重写模块rewrite是一个简单的正则表达式匹配与一个虚拟堆叠机结合，依赖于pcre库这也为我们之前安装的时候为什么需要安装pcre和pcre-devel软件的原因，rewrite会根据相关变量重定向和选择不同的配置，从一个 location跳转到另一个 location，不过这样的循环最多可以执行10次，超过后 nginx将返回500错误。同时，重写模块包含 set 指令，来创建新的变量并设其值，这在有些情景下非常有用的，如记录条件标识、传递参数到其他location、记录做了什么等等。
```

### 功能及范围

```
# 功能：实现URL的重写，通过Rewrite规则，可以实现规范的URL，根据变量来做URL转向及选择配置。

# 作用范围：server{},location{},if{}

# 优先级：执行server块的rewrite指令 > 执行location匹配 >执行选定的location中的rewrite指令。
```

### 应用场景

```
# nginx的rewrite功能在企业中应用非常广泛:
# 1. 可以调整用户用户浏览的URL，看起来更加规范，合乎开发以及产品人员的需求。
# 2. 为了让搜索引擎收录网站内容及用户体验更好，企业将动态URL地址伪装成静态地址提供服务
# 3. 网站换新域名后，让旧的域名的访问跳转到信息的域名上
# 4. 根据特殊变量、目录、客户端的信息进行URL跳转等。
```

> URL Rewrite最常见的应用是URL伪静态化，是将动态页面显示为静态页面的一种技术.

> 比如http://www.123.com/news/index.php?id=123 使用URLRewrite 转换后可以显示为 http://www.123.com/news/123.html对于追求完美主义的网站设计师，就算是网页的地址也希望看起来尽量简洁明快。理论上，搜索引擎更喜欢静态页面形式的网页，搜索引擎对静态页面的评分一般要高于动态页面。所以，UrlRewrite可以让我们网站的网页更容易被搜索引擎所收录。

> 从安全角度上讲，如果URL中暴露太多的参数，无疑会造成一定量的信息泄露，可能会被一些黑客利用，对你的系统造成一定的损坏，所以静态化的URL地址可以给我们带来更高的安全性.

> 实现网站地址跳转，例如用户访问360buy.com,将其跳转到jd.com,例如当用户访问flying.cn的80端口时，将其跳转到443端口.

Nginx Rewrite相关指令有重定向rewrite,if 语句，条件判断，全局变量，set,return

### Rewrite 相关指令

```
# if语句的应用环境和语法:
# 应用环境: server,location
if (condition) {
    # 代表条件为真时的nginx操作，可以是反向代理，也可以是URL重写
}

if 可以支持如下条件判断匹配符号
~                    # 正则匹配（区分大小写）
~*                   # 正则匹配（不区分大小写）
!~                   # 正则不匹配（区分大小写）
!~*                  # 正则不匹配（不区分大小写）
-f和!-f              # 用来判断是否存在文件
-d和!-d              # 用来判断是否存在目录
-e和!-e              # 用来判断是否存在文件或目录
-x和!-x              # 用来判断文件是否可执行

# 文件及目录匹配,其中:
# -f和!-f用来判断是否存在文件
# -d和!-d用来判断是否存在目录
# -e和!-e用来判断是否存在文件或目录
# -x和!-x用来判断文件是否可执行
```

### Rewrite flag

> rewrite:    指令根据表达式来重定向URI,或者修改字符串，可以应用于server,location,if环境下，每行rewrite指令最后跟一个跟一个flag标记，支持的flag标记有:

1. last:  相当于Apache里的[L]标记，表示终止继续在本location快中处理接收到的URI,并将此处重写的URI作为一个新的URI,使用下一个location块进行处理，处理完成再从第一个location开始，循环五次报500错误.
2. break: 将此处重写的URI作为一个新的URI,在本块中继续进行处理，该标识将重写后的地址在当前location块中执行，不会将新的URI转向到其他location块.
3. redirect:  返回302临时重定向，浏览器地址会显示跳转后的URL地址.
4. permanent:  返回301永久重定向，浏览器地址会显示跳转后URL地址.



```
location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
         rewrite ^/.* http://www.taobao.com;
}
```

### Rewrite参考实例

#### Example 1

```
# 有意思的域名跳转,39.108.140.0无论访问什么，最终都给跳转到www.taobao.com上**
vim /etc/nginx/conf.d/default.conf
    location    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
         rewrite ^/.* http://www.taobao.com;
    }
    
elinks --dump 39.108.140.0
     *?[14]亲，请登录
     *?? 消息  ?
     *?[15]手机逛淘宝
```

#### Example 2

```
# 访问http://39.108.140.0/abc/a/1.html ==> http://39.108.140.0/ccc/bbb/b.html
# 1./abc/a/1.html页面是否存在不重要
# 2./ccc/bbb/b.html页面必须存在

vim /etc/nginx/conf.d/default.conf
    location /abc {
        rewrite .* /ccc/bbb/b.html permanent;
    }

nginx -s reload
elinks --dump 39.108.140.0/abc/a/1.html     
b.html       
# 这个abc目录是没有的，但是只要符合匹配条件就会跳转走
tail -2 /var/log/nginx/access.log
49.233.69.195[04/Nov/2019:12:22:19]"GET /abc/a/1.html HTTP/1.1" 301 169 "-" 
49.233.69.195[04/Nov/2019:12:22:19]"GET /ccc/bbb/b.htmlHTTP/1.1" 200"http://39.108.140.0/abc/a/1.html"
# 无permanent，简单的rewrite请求一次
49.233.69.195 - - [04/Nov/2019:12:27:09 +0800] "GET /abc/a/1.html HTTP/1.1" 200 7 "-"
#有permanent,永久重定向301请求两次（成本高，容易看懂日志意思，友好）
```

#### Example 3

(.*) ==>$1

```
# 访问http://39.108.140.0/2015/ccc/bbb/b.html ==> http://39.108.140.0/2014/ccc/bbb/b.html
mkdir /usr/share/nginx/html/2015/ccc/bbb/ -p
mkdir /usr/share/nginx/html/2014/ccc/bbb/ -p
echo 2014 > 2014/ccc/bbb/b.html
echo 2015 > 2015/ccc/bbb/b.html
vim /etc/nginx/conf.d/default.conf
    location /2015 {
        rewrite ^/2015/(.*)$ /2014/$1 permanent;
    }
nginx -s reload
```

#### Example 4

if ($host ~* aaa.com ){}

$schemal$host$request_uri

```
# 访问http://www.flying.com ==> http://cloud.com
# 因为是测试环境,注意客户端解析
mkdir /cloryud
echo cloud > /cloud/index.html
vim /etc/nginx/conf.d/default.conf
    location / {
        root /cloud;
        index index.html;
    }
nginx -s reload

tail -2 /etc/hosts
39.108.140.0    cloud.com
39.108.140.0    flying.com
elinks --dump cloud.com
   cloud

vim /etc/nginx/conf.d/default.conf
    if ($host ~* flying.com){
        rewrite .* http://cloud.com permanent;
    }
elinks --dump flying.com
   cloud
```

#### Example 5



```
# 如果访问的.sh结尾的文件则返回403操作拒绝错误
return 指令用于返回状态码给客户端，应用于server,location,if环境
touch /usr/share/nginx/html/1.sh
vim /etc/nginx/conf.d/default.conf
    location ~* \.sh$ {
        return 403;
        #return 301 http://www.baidu.com;
    }
nginx -s reload
elinks --dump 39.108.140.0/index.html
   123
elinks --dump 39.108.140.0/index.sh
                                 403 Forbidden
域名跳转www
```

#### Example 6

换域名

```
# 主机记录就是域名前缀，常见用法有：
# www：解析后的域名为www.aliyun.com。
# @：直接解析主域名 aliyun.com。
# *：泛解析，匹配其他所有域名 *.aliyun.com。
# mail：将域名解析为mail.aliyun.com，通常用于解析邮箱服务器。
# 二级域名：如：abc.aliyun.com，填写abc。
# 手机网站：如：m.aliyun.com，填写m。
# 显性URL：不支持泛解析（泛解析：将所有子域名解析到同一地址）


# 方法1
server {
  listen         80;
  server_name    zcj.net.cn;
  rewrite ^(.*) $scheme://www.$server_name$1 permanent;
}

# 方法2
server {
        listen *:80;
        listen [::]:80;
        server_name zcj.net.cn;
        #告诉浏览器有效期内只准用 https 访问
        add_header Strict-Transport-Security max-age=15768000;
        # 永久重定向到https站点
        return 301 http://www.example.com$request_uri;
}
```

#### Example 7

不同浏览器

```
# 不同浏览器访问不同结果（实现不同客户端(PC,安卓,IOS)）访问不同的后端实例
if ($http_user_agent ~ Firefox) {
    rewrite ^(.*)$ /firefox/$1 break;
}
if ($http_user_agent ~ MSIE) {
    rewrite ^(.*)$ /msie/$1 break;
}
 
if ($http_user_agent ~ Chrome) {
    rewrite ^(.*)$ /chrome/$1 break;
}

# 防止盗链
location ~*\.(gif|jpg|png|swf|flv)${
    valid_referers none blocked www.cheng.com *.test.com;
	if ($invalid_referer) {
	    rewrite ^/(.*) http://www.lianggzone.com/error.html
	}
}

# 禁止访问以/data开头文件
location ~ ^/data {
    deny all;
}

# 设置某些类型文件的浏览器缓存时间
location ~ .*.(gif|jpg|jpeg|png|bmp)$ {
    expires 30d;
}
 
location ~ .*.(js|css)$ {
    expires 1h;
}

# 设置过期时间不记录日志
location ~(favicon.ico) {
    log_not_found off;
    expires 99d;
    break;
}
 
location ~(robots.txt) {
    log_not_found off;
    expires 7d;
    break;
}
```

#### Example 8

最后面加斜线

```bash
if ( -d $request_file ) {
  rewrite (.*)([^/]) http://$host$1$2/;
}
```



```
rewrite .* http://www.baidu.com permanent;
return 301 http://ww.baidu.com
#如果你只是想要返回一定的状态码，建议用return
#如果你想要进行地址重写，建议直接用rewrite
```



```
--ngx_http_rewrite_module        # rewrite重写模块
1> last:      # 匹配到规则重新向server发送请求，不会显示跳转之后的URL;
2> break:     # 匹配到这个规则终止匹配，不再匹配后面规则;
3> redirect:  # 返回302临时重定向，浏览器地址显示跳转之后URL: 
# redirect一般只需要临时跳转，这些跳转需要一定时间缓冲，如果跳转过长，可能被百度判断为作弊，会被k站;
4> permanent：返回301永久重定向，浏览器地址显示跳转后URL地址;
```

**last,break详解**



```
mkdir test
echo break > test/break.html
echo last > test/last.html
echo test > test/test.html
vim /etc/nginx/conf.d/default.conf
    location /break {
            root /usr/share/nginx/html;
        rewrite .* /test/break.html break;
    }
    location /last {
            #root /usr/share/nginx/html;
        rewrite .* /test/last.html last;
    }
    location /test {
            root /usr/share/nginx/html;
        rewrite .* /test/test.html break;
    }

nginx -s reload
elinks --dump 49.233.69.195/last
   test
elinks --dump 49.233.69.195/break
   break
elinks --dump 49.233.69.195/test
   test
```

1. 如果rewrite在匹配过程中，匹配结束了就必须声明root目录的位置，并显示root位置的url,如果没有匹配完成就不需要root目录
2. last标记在本条rewrite规则执行完后，会对其所在的server {...}标签重新发起请求.
3. break标记则在本次规则匹配完成后，停止匹配，不再做后续的匹配.
4. 有些时候必须使用last,比如使用alias指令时，而使用proxy_paas指令时必须使用break.



```
= 表示精确匹配，优先级也是最高的
^~ 表示uri以某个常规字符串开头,理解为匹配url路径即可（少用）
~ 表示区分大小写的正则匹配
~* 表示不区分大小写的正则匹配
!~ 表示区分大小写不匹配的正则
!~* 表示不区分大小写不匹配的正则
/ 通用匹配，任何请求都会匹配到
= 大于  ^~  大于  ~   ~*   !~  ！~*  大于  /
```

> nginx里面的变量和shell里面的不相同，nginx里面的所有变量在定义时需要使用$变量名定义，直接写变量名表示引用变量.



```
1> $args                # 请求中的参数,这个变量存放的是URL中的请求指令:
                        # 请求指令: 网址中？后面的一串字符，就是我们给网页传递过去的参数

2> $content_length            # 请求长度: 存放请求报文中content_length字段内容，代表报文有点多少字节

3> $content_type                # 请求类型: 存放请求报文中content_type字段内容

4> $document_root            # 网页目录: 存放当前请求的根路径，对于apache来首就是/var/www/html

5> $document_uri               # 存放请求报文中的当前URI，并且不包括请求指令

6> $host    # 主机: 代表URI地址中的主机部分，如果请求中没有host行，则等于设置的服务器名:

7> $http_user_agent     # 存放客户端代理信息(即客户端的浏览器类型)

8> $http_cookie         # 开发使用，表示client和server之间的会话信息，server返回的验证身份信息的一段字符串.
                        # 浏览器的缓存其中一个就是cookie,这个cookie就是访问某一台web服务器，网站服务器为了验证身份生成的一段字符串.

9> $limit_rate          # 用不到，nginx服务器对网络连接速率做限制的.

10> $remote_addr        # 存放客户端ip地址

11> $remote_port        # 存放客户端端口，即源端口: 客户端访问时，服务器收到的数据的源端口号是多少.

12> $remote_user        # 远程用户: 存放客户端的用户名，基于用于密码验证的用户名.

13> $request_body_file  # 表示nginx做反向代理时，nginx转给后端服务器的文件名称

14> $request_method     # 存放客户端请求资源的方法，就是GET,POST,PUT,DELETE,HEAD

15> $request_filename   # 存放当前请求的文件路径名(带网站的主目录/usr/local/nginx/html/images/a.jpg)

16> $request_uri        # 存放当前请求的URI地址，并且带有请求指令(不带网站的主目录/images/a.jpg)

17> $query_string       # 查询的字符串: 与变量$args含义相同，表示?后面一串

18> $scheme             # 存放客户端请求使用的协议,如http,https

19> $server_protocol    # 存放客户端请求协议的版本, http/1.0    http/1.1

20> $server_addr        # 存放服务器ip地址，如果没有用listen指明服务器地址，使用这个变量将发起一次系统调用以取得地址(造成资源浪费)

21> $server_name        # 存放了客户端请求到达的服务器的名称，配置虚拟主机时的虚拟主机名

22> $server_port        # 存放了客户端请求到达的服务器的端口号

23> $uri                # 与变量$document_uri含义相同，代表URI地址，不包括请求指令，问好后面的不包含
```

Example:



```
if ( -f $request_filename) {.....} 如果客户端请求的文件名存在，就做什么动作
if ($request_method = POST) {.....} 如果客户端请求方法是POST上传，做什么动作
if ($http_user_agent ~ MSIE) {.....} 如果客户端的浏览器名称里面带有MSIE字符就做什么操作
```



## CA & HTTPS

### 常见加密算法

HASH： MD5

非对称算法，RSA DH

对称： AES DES 

### CA

#### 私有CA

```bash
CA 证书颁发机构 （CA，Certificate Authority）
基于https的西医工作的一种虚拟主机，要构建这样的网站需要mod_ssl 模块支持。且需要提供两个文件：证书文件和私钥文件，证书文件是标识这个网站服务器身份的，私钥文件主要用来实现在服务器的端对端数据进行加密，然后在网站上传输的。证书在生产生活中需要对经营的机构去申请，在实验环境中应该搭建一台CA服务器
```

1、生成证书和私钥文件

```bash
1、准备存放证书和密钥的文件夹
[root@ca ~]# mkdir -p /etc/nginx/ssl

2、生成私钥
使用openssl生成基于rsa数学算法长度为1024bit的密钥，文件必须以key结尾

2.1 使用openssl工具生成一个RSA私钥
查看刚刚生成的私钥。使用命令如下：
openssl rsa -text -in server.key



[root@ca ~]# openssl genrsa 1024 >  /etc/nginx/ssl/server.key
Generating RSA private key, 1024 bit long modulus
......++++++
.++++++
e is 65537 (0x10001)
[root@ca ~]# cat /etc/nginx/ssl/server.key 
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCetXQ6NXmRY7WoIgN05Vpe3WWysaCn7v39Ag1RhauUWx8lWppD
B+J0P9pfoXqueq/9128OM5HgBg2DoQ24pWv7nVroocnqmQX+A5a4Dw4Q0ue3btTk
9/2RcuC7iDzllW5rrydzg3g3q+Fq59g69ZwjsjB4K6Jx4c0zHB8km9HkVQIDAQAB
AoGAaA8dR9UsAjHYN4clsQ14NV8AgSuJ5NIEYlFoHh2ApGMihsFjB7QxvHrpWW5t
G92BavRH8o3JhZMyZS3B62E67NSqMk+3hzcXDokuetQbU4smNxrCT9nWpFeD9sFe
dlZEZ9NaoJElC3Jdffjy23Dm6moNP+X9yVMuo3+P9Hwmo0ECQQDKSxRkL9+tMpms
zI1zGkEzxIJcdArFWqJ1qfyw2uiFKxvp7TXOijWSWOMmO18cPOM3TnIC2z+hTtQ8
vuIfXr69AkEAyNgkojQXAvOjD0eumnAvVZX8XHJ+yGWUpX3dwOpKDkfTsqw2FROV
43rflM5pguyts6Mu4Nv7CukpzPhbrKcBeQJBAJgecU0NewQA4vLANzXw7ksBYI4p
bNgPWc9lbnGHjAZn7muwRx/zammMkfNz/gd7+djjEnT3bhfc8VhkqiGw23kCQEn1
NcA5GEQw/VmSFtyt9PA6M9zDGKaoqU0rhS4V2EFb97uyqJOoS6ihxZUhUT8x8mDU
9V0+BDqnU4oz5mY0dVkCQQCRDXJJI5CeE2V0zUhlyTKvjKHDFzSMIlgA9Xph6RPp
4FtQRgt8XM8L9K2CqSd025adE4EmetsIcJMc9bIDjTqS
-----END RSA PRIVATE KEY-----

3、使用密钥文件生成证书
2.2  创建证书签名请求CSR文件

查看csr文件如下命令：
openssl req -text -in server.csr -noout



[root@ca ~]# openssl req -new -key /etc/nginx/ssl/server.key > /etc/nginx/ssl/server.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:CN    国家名字
State or Province Name (full name) []:Beijing 省会
Locality Name (eg, city) [Default City]:Beijing 城市
Organization Name (eg, company) [Default Company Ltd]:YUNJISUANGONGSI 组织名
Organizational Unit Name (eg, section) []:YUNJISUAN 组织单位名
Common Name (eg, your name or your server's hostname) []:nginx.linux.com 域名
Email Address []:2678885646@qq.com 联系方式

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []: 密码为空
An optional company name []: 公司为空
[root@ca ~]# cat /etc/nginx/ssl/server.csr 
-----BEGIN CERTIFICATE REQUEST-----
MIIB3DCCAUUCAQAwgZsxCzAJBgNVBAYTAkNOMRAwDgYDVQQIDAdCZWlqaW5nMRAw
DgYDVQQHDAdCZWlqaW5nMRgwFgYDVQQKDA9ZVU5KSVNVQU5HT05HU0kxEjAQBgNV
BAsMCVlVTkpJU1VBTjEYMBYGA1UEAwwPbmdpbngubGludXguY29tMSAwHgYJKoZI
hvcNAQkBFhEyNjc4ODg1NjQ2QHFxLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAw
gYkCgYEAnrV0OjV5kWO1qCIDdOVaXt1lsrGgp+79/QINUYWrlFsfJVqaQwfidD/a
X6F6rnqv/ddvDjOR4AYNg6ENuKVr+51a6KHJ6pkF/gOWuA8OENLnt27U5Pf9kXLg
u4g85ZVua68nc4N4N6vhaufYOvWcI7IweCuiceHNMxwfJJvR5FUCAwEAAaAAMA0G
CSqGSIb3DQEBCwUAA4GBAGYOzfcCO5pEJIXJbSnkL9nHiRbC4y2kZYmzILD3C+WN
3Jt8BVp3+EGEHNgBCLNz3aOY9oq79E+FEKrUeJjN/CR9Go8Cj+He04RqUCyaVEiq
24gUPxPp5/bDuVM+uAy77Lby1f4XxsMohYFL3wMMQk3uMvwLFX15GkwjU04D9h/r
-----END CERTIFICATE REQUEST-----

2.3  生成CA证书
[root@ca ~]# openssl req -x509  -key /etc/nginx/ssl/server.key -days 365  -in  /etc/nginx/ssl/server.csr > /etc/nginx/ssl/server.crt
openssl 
-x509 证书的格式：固定的
-days 证书的有效期，生产生活中时间不同，价格不同
-key 指定密钥文件 私钥
-in 指定证书的申请文件 公钥
[root@ca ~]# cat /etc/nginx/ssl/server.crt 
-----BEGIN CERTIFICATE-----
MIIDBjCCAm+gAwIBAgIJANOEcMZNxlhlMA0GCSqGSIb3DQEBCwUAMIGbMQswCQYD
VQQGEwJDTjEQMA4GA1UECAwHQmVpamluZzEQMA4GA1UEBwwHQmVpamluZzEYMBYG
A1UECgwPWVVOSklTVUFOR09OR1NJMRIwEAYDVQQLDAlZVU5KSVNVQU4xGDAWBgNV
BAMMD25naW54LmxpbnV4LmNvbTEgMB4GCSqGSIb3DQEJARYRMjY3ODg4NTY0NkBx
cS5jb20wHhcNMjExMTEwMDkzODUzWhcNMjIxMTEwMDkzODUzWjCBmzELMAkGA1UE
BhMCQ04xEDAOBgNVBAgMB0JlaWppbmcxEDAOBgNVBAcMB0JlaWppbmcxGDAWBgNV
BAoMD1lVTkpJU1VBTkdPTkdTSTESMBAGA1UECwwJWVVOSklTVUFOMRgwFgYDVQQD
DA9uZ2lueC5saW51eC5jb20xIDAeBgkqhkiG9w0BCQEWETI2Nzg4ODU2NDZAcXEu
Y29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCetXQ6NXmRY7WoIgN05Vpe
3WWysaCn7v39Ag1RhauUWx8lWppDB+J0P9pfoXqueq/9128OM5HgBg2DoQ24pWv7
nVroocnqmQX+A5a4Dw4Q0ue3btTk9/2RcuC7iDzllW5rrydzg3g3q+Fq59g69Zwj
sjB4K6Jx4c0zHB8km9HkVQIDAQABo1AwTjAdBgNVHQ4EFgQU50nM+gTczFyWbgZO
7fFfS1zoFMAwHwYDVR0jBBgwFoAU50nM+gTczFyWbgZO7fFfS1zoFMAwDAYDVR0T
BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOBgQBtQwX1KFOYjxkhOG6xe+6OKDp0wbrr
RzGKuAYfzZclP1LDOEiTpZBGu0WixLFKATbJIidNmn28cbebCxX9RGPTQhZp+nla
ZGasn9JLbTzFZeuNZ88NFV6ZAAHEA/hq9Du4cfp1XVYBFD+/KqFVb6N912wqyxd+
k39n3uBQkxT60A==
-----END CERTIFICATE-----





```

生成客户端证书】
4. 生成客户端证书

生成客户端证书与生成CA证书相似。

4.1. 先要生成私钥

使用命令：

openssl genrsa -out client.key 2048

如下图所示：

![img](nginx03.assets/561794-20190526213040477-1479819631.png)

4.2 生成请求文件

使用命令：

openssl req -new -key client.key -out client.csr

如下图所示：

![img](nginx03.assets/561794-20190526213132971-1527441055.png)

4.3 发给ca签名

使用命令： 

openssl x509 -req -days 365 -in client.csr -signkey client.key -out client.crt

如下图所示：

![img](nginx03.assets/561794-20190526213217410-883671983.png)

部署

```bash
http{
  server {
    listen 80;
    server_name nginx.linux.com;
    return 301 https://..../$request_uri;
    # rewrite .* https://..../$request_uri permanent;
  }
  server {
  	listen 443;
  	# server_name nginx.linux.com;
  	
  	ssl on;
  	ssl_certificate /etc/nginx/ssl/server.crt;
  	ssl_cretificate_key /etc/nginx/ssl/server.key;
  	
    location / {
      root /bj;
      index index.html;
      
    }
  }
}
```



2、私有CA的https部署实战

#### 公网CA

···

## Nginx平滑升级

编译安装nginx1.12

    1. 获取源码包：wget https://nginx.org/download/nginx-1.12.2.tar.gz
    2. 解压缩指定目录：tar -xvzf nginx-1.12.2.tar.gz -C /usr/local/src/
    3. 进入nginx目录：cd /usr/local/src/nginx-1.12.2/
    4. 配置编译安装：./configure --user=nginx --group=nginx --prefix=/usr/local/nginx12 --with-http_stub_status_module --with-http_ssl_module && make && make install

编译安装nginx1.14

    1. 获取源码包：wget https://nginx.org/download/nginx-1.14.2.tar.gz
    2. 解压缩指定目录：tar -xvzf nginx-1.14.2.tar.gz -C /usr/local/src/
    3. 进入nginx目录：cd /usr/local/src/nginx-1.14.2/
    4. 配置编译安装：./configure --user=nginx --group=nginx --prefix=/usr/local/nginx14 --with-http_stub_status_module --with-http_ssl_module && make && make install

进行平滑升级

```bash
kill -USR2 旧版本的主进程号 （让旧版本的worker进程不再接受请求）
kill -WINCH 旧版本的主进程号 （关闭旧版本的worker进程）

1. ps aux|grep ngin[x]     #查看nginx的主进程号和工作进程号

2. mv /usr/local/nginx12/sbin/nginx{,.bak}     #重命名nginx12的执行程序

3. cp /usr/local/nginx14/sbin/nginx  /usr/local/nginx12/sbin/nginx
                #复制nginx14的执行程序给nginx12

4. /usr/local/nginx12/sbin/nginx -V     #查看版本信息
    nginx version: nginx/1.14.2

5. 查看进程号：ps aux|grep ngin[x]
root      17266  0.0  0.0  45948  1124 ?        Ss   01:11   0:00 nginx: master 

6. 给主进程发送User2信号：kill -USR2 旧进程号(17266) 
   相对应 ls nginx12/logs/nginx.pid.oldbin    #pid文件被重命名

7. 发送WINCH信号： kill -WINCH 旧进程号(17266)

8. 重启nginx: pkill nignx
             /usr/local/nginx12/sbin/nginx

9. 访问网站查看版本号：curl -i http://IP
HTTP/1.1 200 OK
Server: nginx/1.14.2   
```

回退版本

Kill –HUP 旧的主进程号:Nginx将在不重载配置文件的情况下启动它的工作进程;

Kill –QUIT 新的主进程号:从容关闭其他工作进程(woker process);

Kill –TERM 新的主进程号:强制退出;

    1. 先查看进程：ps aux|grep nginx
    root      17266(旧)  0.0  0.0  46092  1904 ?        Ss   00:47   0:00 nginx:
    root      17279(新)  0.0  0.0  45956  3248 ?        S    00:53   0:00 nginx:
    nginx     17280  0.0  0.0  46404  1872 ?        S    00:53   0:00 nginx:.. 
    
    2. 开启旧进程：kill -HUP 17266
    
    3. 关闭新进程：kill -QUIT 17279
    
    4. 查看进程：ps aux|grep ngin[x]
    
    5. 恢复原来的执行文件：rm -rf  nginx12/sbin/nginx
                        mv nginx12/sbin/nginx.bak  nginx12/sbin/nginx
    
    6. 重启nginx: pkill nginx
                 /usr/local/nginx12/sbin/nginx
    
    7. 访问网站查看版本号：curl -i http://IP
    HTTP/1.1 200 OK
    Server: nginx/1.12.2 

总结

平滑升级

    作用：为nginx添加新的模块优化,版本性能、稳定性
    
    平滑升级也可以说是"热升级" => 在不停止对User的服务进行升级版本,继续对外服务,不受影响。
    原理：
    1. 在不停掉旧版本程序的运行进程的情况下,启动新版本的进程。
    2. 旧版本的进程负责处理之间没有处理完成的请求,但不接受任何请求
    3. 由新版本的进程接受用户的请求
    4. 当旧程序处理完之前的请求后,关闭所有连接、停止服务。

平滑回退

    作用：将新版本回滚至旧版本,主要是新本的稳定性与漏洞,在有些场景对版本的要求很高
    
    1. 将旧版本的进程重新拉起来
    2. 再将新版本的进程停止掉

技术总结

    -----------平滑升级-----------
    1. 先重命名旧版本的二进制.bak结尾的文件后,在将新版本的二进制执行文件复制到旧版本中。
    2. 给旧版本的进程发送USR2指令,让其不在接受请求后
    3. 再给旧版本的进程发送WINCH指令,让其停止服务,关闭
    4. 使得新版本来接受用户的请求
    
    -----------平滑回退-----------
    1. 使用HUP指令将旧版本的进程拉起来
    2. 使用QUIT指令将新版本的进程关闭
    3. 在将旧版本的二进制文件替换回来
    4. 使得旧版本重新对外提供服务
