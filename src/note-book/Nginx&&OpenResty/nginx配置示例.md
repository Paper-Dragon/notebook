# Nginx配置示例

## book.itrusts.top.conf

    server {
        listen 80;
       listen 443 ssl http2;
        server_name book.itools.top book.itrusts.top book.todesk.top 42.192.117.251;
        index index.php index.html index.htm default.php default.htm default.html;
        root /www/wwwroot/book.itools.top;
    
        #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
        #error_page 404/404.html;
        ssl_certificate    /www/server/panel/vhost/cert/book.itools.top/fullchain.pem;
        ssl_certificate_key    /www/server/panel/vhost/cert/book.itools.top/privkey.pem;
        ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        add_header Strict-Transport-Security "max-age=31536000";
        error_page 497  https://$host$request_uri;
    
        #SSL-END
       #Directory protection rules, do not manually delete
       include /www/server/panel/vhost/nginx/dir_auth/book.itools.top/*.conf;
    
        #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
        #error_page 404 /404.html;
        #error_page 502 /502.html;
        #ERROR-PAGE-END
    
        #PHP-INFO-START  PHP引用配置，可以注释或修改
        include enable-php-00.conf;
        #PHP-INFO-END
    
        #REWRITE-START URL重写规则引用,修改后将导致面板设置的伪静态规则失效
        include /www/server/panel/vhost/rewrite/book.itools.top.conf;
        #REWRITE-END
    
        #禁止访问的文件或目录
        location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md)
        {
            return 404;
        }
    
        #一键申请SSL证书验证目录相关设置
        location ~ \.well-known{
            allow all;
        }
    
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
            error_log /dev/null;
            access_log /dev/null;
        }
    
        location ~ .*\.(js|css)?$
        {
            expires      12h;
            error_log /dev/null;
            access_log /dev/null;
        }
        access_log  /www/wwwlogs/book.itools.top.log;
        error_log  /www/wwwlogs/book.itools.top.error.log;
    }

# 实例

## 配置密码

## log-html.conf

```
location ~* ^/log.html* {
    #AUTH_START
    auth_basic "Authorization";
    auth_basic_user_file /www/server/pass/book.itools.top/log-html.pass;
    include enable-php-00.conf;
    #AUTH_END
}
```

log-html.pass

```bash
test:teH0wLIpW0gyQ
```

## root_admin.conf

```bash
location ~* ^/* {
    #AUTH_START
    auth_basic "Authorization";
    auth_basic_user_file /www/server/pass/book.itools.top/rootadmin.pass;
    include enable-php-00.conf;
    #AUTH_END
}
```

roota_dmin.pass

```bash
admin:mdDbj0Wo3q.oU
```

## Lua动态模块set_by_lua_block，解决bind ipv6

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
load_module /etc/nginx/modules/ngx_stream_module.so;
error_log /dev/null;
events {
    worker_connections 4096;
}
http {
    sendfile on;  # 是否使用sendfile传输文件
    tcp_nopush on; # 包攒到一定数量再发。若不开启，典型情况携带40字的包头，于是产生4000%过载，网络堵塞
    types_hash_max_size 2048; # 设置 types 哈希表的最大大小，默认1024
    include /etc/nginx/mime.types; # mime.types # 文件程序关联
    default_type application/octet-stream; # 未知的应用程序文件
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # 指定SSL协议
    ssl_prefer_server_ciphers on; # 如果不指定默认为off，当为on时，在使用SSLv3和TLS协议时，服务器加密算法将优于客户端加密算法。
    gzip on; # 启用压缩
    include /etc/nginx/conf.d/*.conf;
    server {
        listen 80;
        # Better practice: only listen to localhost, or use a firewall.
    
      # 反向代理的场景，upstream后端用域名时，配置resolver以便于nginx能够解析该域名
        resolver 1.1.1.1 ipv6=on ipv4=off valid=60s; # 在 resolver 后面可以配置多个 DNS 地址，nginx 会采用轮询的方式去访问，并对解析结果缓存，这里的 valid 就是指定缓存的时间。
        resolver_timeout 1s; # 该参数是用于指定 DNS 解析的超时时间
    
    
        location / {
    
      # lua 脚本，设置变量bind_ip
        set_by_lua_block $bind_ip {           
        return '2602:fb26:09'.. string.format('%x', math.random(1, 255)) ..':'.. string.format('%x', math.random(1, 65535)) ..':'.. string.format('%x', math.random(1, 65535)) ..':'.. string.format('%x', math.random(1, 65535)) ..':'.. string.format('%x', math.random(1, 65535)) ..':'.. string.format('%x', math.random(1, 65535))
        }
        # 配置代理服务器的出口地址
            proxy_bind $bind_ip;
            proxy_set_header Host $http_host;
            proxy_pass http://$http_host;
            proxy_buffering off;
        }
        access_log off;
    }
}
stream {
    #  创建一个新变量，其值取决于第一个参数中指定的一个或多个源变量的值，根据后面花括号内的内容，赋值给第二个变量。 
    #  ngx_stream_ssl_preread_module 允许从clienthello中提取信息，而不会终止SSL/TLS,例如通过sni请求的服务器名称
    # 相当于通过域名解析进行负载均衡
    map $ssl_preread_server_name $ssl_target {
      # ~ 代表这行要用正则表达式，大小写敏感
      # 
        ~^ipv4-(?<suffix>.*)    ipv6-${suffix}:443;
        default $ssl_preread_server_name:443;
    }
    server {
        listen 443;
        resolver 1.1.1.1 ipv6=on ipv4=off valid=60s;
        resolver_timeout 1s;
        proxy_pass $ssl_target;
        ssl_preread on;
        access_log off;
    }
}
```

## Nginx限速

```c
http {
    limit_conn_zone $binary_remote_addr zone=addr:10m; # 根据来源地址生产容器
    limit_req_zone $binary_remote_addr zone=baism:10m rate=1r/s; # 现在连接速率 
    server {
        listen       80;
        server_name  _;
        root         /opt;
        autoindex on;

        limit_rate 100k; # 单线程最高速度
#       limit_rate_after 10240; # 允许超速多少
        limit_conn addr 3; # 并发量
    }
}
```

## Nginx 实现偷站Windy.com

DNS解析

```bash
account.geekery.cn.	600	IN	A	23.225.xx.85
embed.geekery.cn.	600	IN	A	23.225.xx.85
img.geekery.cn.		600	IN	A	23.225.xx.85
ims.geekery.cn.		600	IN	A	23.225.xx.85
ims-s.geekery.cn.	600	IN	A	23.225.xx.85
node.geekery.cn.	600	IN	A	23.225.xx.85
tiles.geekery.cn.	600	IN	A	23.225.xx.85
www.geekery.cn.		600	IN	A	23.225.xx.85
```

nginx 配置

```nginx
user www-data;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid /run/nginx.pid;


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

    #gzip  on;

    resolver 8.8.8.8;

    server {
            listen       80;
            server_name  windy.itgpt.com;

            proxy_set_header Host www.windy.com;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header x-forwarded-for  $remote_addr;

            #access_log  /var/log/nginx/host.access.log  main;

            location / {
                #root   /usr/share/nginx/html/windy.com;
                #index  index.html index.htm;
                proxy_pass https://www.windy.com;
                proxy_ssl_server_name on; # 不透传sni并且设置sni为proxy_pass 域名
                sub_filter_types *;
                sub_filter windy.com itgpt.com;
                sub_filter https http;
                sub_filter_once off;

            }

            #error_page  404              /404.html;

            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }

            # proxy the PHP scripts to Apache listening on 127.0.0.1:80
            #
            #location ~ \.php$ {
            #    proxy_pass   http://127.0.0.1;
            #}
    }
    server {
            listen       80;
            server_name  ~^(?<subdomain>.+)\.itgpt\.com$;

            proxy_set_header Host $subdomain.windy.com;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header x-forwarded-for  $remote_addr;

            #access_log  /var/log/nginx/host.access.log  main;

            location / {
                #root   /usr/share/nginx/html/windy.com;
                #index  index.html index.htm;
                proxy_pass https://$subdomain.windy.com;
                proxy_ssl_server_name on;
                sub_filter_types *;
                sub_filter windy.com itgpt.com;
                sub_filter https http;
                sub_filter_once off;

            }

            #error_page  404              /404.html;

            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }

            # proxy the PHP scripts to Apache listening on 127.0.0.1:80
            #
            #location ~ \.php$ {
            #    proxy_pass   http://127.0.0.1;
            #}
    }
    server {
            listen       80;
            server_name  ~^(?<subdomain>.+)\.geekery\.cn$;

            proxy_set_header Host $subdomain.windy.com;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header x-forwarded-for  $remote_addr;

            #access_log  /var/log/nginx/host.access.log  main;

            location / {
                #root   /usr/share/nginx/html/windy.com;
                #index  index.html index.htm;
                proxy_pass https://$subdomain.windy.com;
                proxy_ssl_server_name on;
                sub_filter_types *;
                sub_filter windy.com geekery.cn;
                sub_filter https http;
                sub_filter_once off;

            }

            #error_page  404              /404.html;

            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }

            # proxy the PHP scripts to Apache listening on 127.0.0.1:80
            #
            #location ~ \.php$ {
            #    proxy_pass   http://127.0.0.1;
            #}
    }
    include /etc/nginx/conf.d/*.conf;
}
    
    
    
#!/bin/bash

#docker run -it --rm \
    -v ./nginx.conf:/etc/nginx/nginx.conf \
    nginx


```

## nginx实现缓存服务器

```nginx

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    proxy_cache_path /cache/myhcache levels=1:2 keys_zone=my_cache:100m max_size=200m inactive=60m;
    

    sendfile        on;
    keepalive_timeout  65;
    #gzip  on; 
    server {
        listen 80;
        server_name 127.0.0.1;
        location / {
           proxy_cache my_cache;
            proxy_cache_valid 200 302 10m;  
            proxy_cache_valid 404      1m;
            proxy_pass http://222.31.96.81:20281;
            proxy_cache_key $scheme$host$request_uri;

        }
    }


}

```

## Nginx Stream模块的日志配置

```nginx

stream {
    log_format proxy '$remote_addr [$time_local] '
                 '$protocol $status $bytes_sent $bytes_received '
                 '$session_time -> $upstream_addr '
                 '$upstream_bytes_sent $upstream_bytes_received $upstream_connect_time';

    access_log /var/log/nginx/tcp-access.log proxy;
    # open_log_file_cache off;

    include /etc/nginx/stream.d/*.conf;
}
```

## Nginx Stream实现四层网络连续端口批量代理

```nginx
server {
    listen 1000-2000;
    listen 1000-2000 udp reuseport;
    proxy_pass xxx.f3322.net:$server_port;
    resolver 1.1.1.1;
    resolver_timeout 1s;
}

server {
    listen 80;
    listen 443;
    proxy_pass xxx.f3322.net:2$server_port;
    #return 200 1$server_port;
    resolver 1.1.1.1;
    resolver_timeout 1s;
}

```

## Nginx在yum和apt安装，超过1015个端口监听

**报错**

```nginx
socket() failed (24: Too many open files) while connecting to upstream
```

**解决方法**

为CentOS/RHEL等发行版中的systemd服务配置ulimit限制

[为CentOS/RHEL等发行版中的systemd服务配置ulimit限制 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/111364906)

众所周知，大部分Linux发行版中的默认最大打开文件数都是1024，可以使用`ulimit -a`查看

实际上`/etc/security/limits.conf`是`pam_limits.so`的配置文件，可以通过`man limits.conf`看到

```text
LIMITS.CONF(5)                 Linux-PAM Manual                 LIMITS.CONF(5)

NAME
       limits.conf - configuration file for the pam_limits module

DESCRIPTION
       The pam_limits.so module applies ulimit limits, nice priority
       and number of simultaneous login sessions limit to user login
       sessions. This description of the configuration file syntax
       applies to the /etc/security/limits.conf file and *.conf files
       in the /etc/security/limits.d directory.
```

PAM全称为插入式验证模块（Pluggable Authentication Module，PAM），主要目的是为Linux下不同依赖用户体系的应用程序提供统一身份认证和用户资料读写API。

通过`man 8 pam`可以看到关于PAM模块的描述如下：

```text
PAM(8)                         Linux-PAM Manual                         PAM(8)

NAME
       PAM, pam - Pluggable Authentication Modules for Linux

DESCRIPTION
       This manual is intended to offer a quick introduction to Linux-PAM.
       For more information the reader is directed to the Linux-PAM system
       administrators´ guide.

       Linux-PAM is a system of libraries that handle the authentication
       tasks of applications (services) on the system. The library provides
       a stable general interface (Application Programming Interface - API)
       that privilege granting programs (such as login(1) and su(1)) defer
       to to perform standard authentication tasks.
```

描述中明确表示PAM既可以用于应用程序鉴权，也可以用于服务鉴权。这里的服务指的是以`init`进程为根进程的，被称作`SysV`的机制，也就是各发行版在使用`systemd`之前广泛使用的服务机制。

那么问题来了：对于`systemd`，到底是否依旧沿用PAM模块实现资源限制呢？我在RedHat Bugzilla找到了Systemd最初被引入时的一篇Ticket：[Bug 754285 - Hint that /etc/security/limits.conf does not apply to systemd services](https://link.zhihu.com/?target=https%3A//bugzilla.redhat.com/show_bug.cgi%3Fid%3D754285)。帖子中提到了一模一样的问题。Systemd的作者之一Kay Sievers当时给与了以下回复：

> Systemd does not support global limits, the file is intentionally ignored. LimitNOFILE= in the service file can be set to specify the number of open file descriptors for a specific service.

也就是说，Systemd设计的时候故意忽略了全局限制，转而在配置文件中配置对每个服务的资源限制，结合`/etc/security/limits.conf`文件开头的注释来看，果然如此：

```text
# /etc/security/limits.conf
#
#This file sets the resource limits for the users logged in via PAM.
#It does not affect resource limits of the system services.
...
```

既然了解了Systemd不会遵循PAM模块的配置，那么接下来要做的就是思考如何在Systemd的配置文件中设置资源限制。

0x03 问题解决

要想知道Systemd配置资源限制的方法，还得求助于`man`。这里我在命令行输入`man systemd.exec`，看到了以下信息:

```text
LimitCPU=, LimitFSIZE=, LimitDATA=, LimitSTACK=, LimitCORE=, LimitRSS=, LimitNOFILE=, LimitAS=,
LimitNPROC=, LimitMEMLOCK=, LimitLOCKS=, LimitSIGPENDING=, LimitMSGQUEUE=, LimitNICE=,
LimitRTPRIO=, LimitRTTIME=
    These settings set both soft and hard limits of various resources for executed processes. See
setrlimit(2) for details. The resource limit is possible to specify in two formats, value to
set soft and hard limits to the same value, or soft:hard to set both limits individually
(e.g. LimitAS=4G:16G). Use the string infinity to configure no limit on a specific resource.
    The multiplicative suffixes K (=1024), M (=1024*1024) and so on for G, T, P and E may be used
for resource limits measured in bytes (e.g. LimitAS=16G). For the limits referring to time
values, the usual time units ms, s, min, h and so on may be used (see systemd.time(7) for
    details). Note that if no time unit is specified for LimitCPU= the default unit of seconds is
implied, while for LimitRTTIME= the default unit of microseconds is implied. Also, note that
the effective granularity of the limits might influence their enforcement. For example, time
limits specified for LimitCPU= will be rounded up implicitly to multiples of 1s. For
LimitNICE= the value may be specified in two syntaxes: if prefixed with "+" or "-", the value
is understood as regular Linux nice value in the range -20..19. If not prefixed like this the
value is understood as raw resource limit parameter in the range 0..40 (with 0 being
equivalent to 1).

Note that most process resource limits configured with these options are per-process, and
processes may fork in order to acquire a new set of resources that are accounted
independently of the original process, and may thus escape limits set. Also note that
LimitRSS= is not implemented on Linux, and setting it has no effect. Often it is advisable to
prefer the resource controls listed in systemd.resource-control(5) over these per-process
limits, as they apply to services as a whole, may be altered dynamically at runtime, and are
generally more expressive. For example, MemoryLimit= is a more powerful (and working)
replacement for LimitRSS=.
```

关于这一段的讲解非常详细且复杂，但我们只要知道以下映射关系即可：

```text
Table 1. Limit directives and their equivalent with ulimit
┌─────────────────┬───────────────────┬────────────────────────────┐
│Directive        │ ulimit equivalent │ Unit                       │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitCPU=        │ ulimit -t         │ Seconds                    │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitFSIZE=      │ ulimit -f         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitDATA=       │ ulimit -d         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitSTACK=      │ ulimit -s         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitCORE=       │ ulimit -c         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitRSS=        │ ulimit -m         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitNOFILE=     │ ulimit -n         │ Number of File Descriptors │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitAS=         │ ulimit -v         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitNPROC=      │ ulimit -u         │ Number of Processes        │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitMEMLOCK=    │ ulimit -l         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitLOCKS=      │ ulimit -x         │ Number of Locks            │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitSIGPENDING= │ ulimit -i         │ Number of Queued Signals   │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitMSGQUEUE=   │ ulimit -q         │ Bytes                      │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitNICE=       │ ulimit -e         │ Nice Level                 │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitRTPRIO=     │ ulimit -r         │ Realtime Priority          │
├─────────────────┼───────────────────┼────────────────────────────┤
│LimitRTTIME=     │ No equivalent     │ Microseconds               │
└─────────────────┴───────────────────┴────────────────────────────┘
```

从表格中可以看到，这里我们需要修改的是最大打开文件数，也就是`LimitNOFILE`。

```nginx
编辑nginx.service添加下面一行
LimitNOFILE=20480

```

我最近也被这个问题折腾了一遍。 不过我的解决办法比较野蛮 ，

sed -i 's|#DefaultLimitNOFILE=|DefaultLimitNOFILE=65535|g' /etc/systemd/system.conf

还有一个办法就是不直接修改service， 使用 systemctl edit xxxx.service 进行参数覆盖

## 日志切割

```nginx
http {
    # 定义日志格式
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';
 
    # 定义日志路径及文件名
    access_log /var/log/nginx/access.log main;
 
    # 定义日志切割规则
    logrotate 14;  # 按14天切割日志
    gzip on;  # 切割后压缩日志文件
    create 0644 nginx nginx;  # 创建新的日志文件权限
 
    # 其他配置项...
}
```

