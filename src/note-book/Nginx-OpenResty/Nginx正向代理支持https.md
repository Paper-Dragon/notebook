---
category: Nginx
# category: 网络安全
# category: 数据库
---

# Nginx正向代理支持https

> [脚本中用到的文件压缩包](/nginx正向代理https.zip)
>
> 模块：https://github.com/chobits/ngx_http_proxy_connect_module
>
> nginx源码： http://nginx.org/download/
>
> tcp优化文档： https://blog.csdn.net/guyue35/article/details/131465652





## 环境搭建

以CentOS 7的环境为例。

1. 安装
   对于新安装的环境，参考正常的安装步骤，把对应版本的patch打上之后，在configure的时候加上参数--add-module=/path/to/ngx_http_proxy_connect_module，示例如下：

```text
./configure \
--user=www \
--group=www \
--prefix=/usr/local/nginx \
--with-http_ssl_module \
--with-http_stub_status_module \
--with-http_realip_module \
--with-threads \
--add-module=/root/src/ngx_http_proxy_connect_module
```

对于已经安装编译安装完的环境，需要加入以上模块，步骤如下：

```text
# 停止NGINX服务
# systemctl stop nginx
# 备份原执行文件
# cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.bak
# 在源代码路径重新编译
# cd /usr/local/src/nginx-1.16.0
./configure \
--user=www \
--group=www \
--prefix=/usr/local/nginx \
--with-http_ssl_module \
--with-http_stub_status_module \
--with-http_realip_module \
--with-threads \
--add-module=/root/src/ngx_http_proxy_connect_module
# make
# 不要make install
# 将新生成的可执行文件拷贝覆盖原来的nginx执行文件
# cp objs/nginx /usr/local/nginx/sbin/nginx
# /usr/bin/nginx -V
nginx version: nginx/1.16.0
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-36) (GCC)
built with OpenSSL 1.0.2k-fips  26 Jan 2017
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/usr/local/nginx --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-threads --add-module=/root/src/ngx_http_proxy_connect_module
```

1. nginx.conf文件配置

```text
server {
     listen  443;

     # dns resolver used by forward proxying
     resolver  114.114.114.114;

     # forward proxy for CONNECT request
     proxy_connect;
     proxy_connect_allow            443;
     proxy_connect_connect_timeout  10s;
     proxy_connect_read_timeout     10s;
     proxy_connect_send_timeout     10s;

     # forward proxy for non-CONNECT request
     location / {
         proxy_pass http://$host;
         proxy_set_header Host $host;
     }
 }
```

## 使用场景

7层需要通过HTTP CONNECT来建立隧道，属于客户端有感知的普通代理方式，需要在客户端手动配置HTTP(S)代理服务器IP和端口。在客户端用curl 加-x参数访问如下：

```text
# curl https://www.baidu.com -svo /dev/null -x 39.105.196.164:443
* About to connect() to proxy 39.105.196.164 port 443 (#0)
*   Trying 39.105.196.164...
* Connected to 39.105.196.164 (39.105.196.164) port 443 (#0)
* Establish HTTP proxy tunnel to www.baidu.com:443
> CONNECT www.baidu.com:443 HTTP/1.1
> Host: www.baidu.com:443
> User-Agent: curl/7.29.0
> Proxy-Connection: Keep-Alive
>
< HTTP/1.1 200 Connection Established
< Proxy-agent: nginx
<
* Proxy replied OK to CONNECT request
* Initializing NSS with certpath: sql:/etc/pki/nssdb
*   CAfile: /etc/pki/tls/certs/ca-bundle.crt
  CApath: none
* SSL connection using TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* Server certificate:
*     subject: CN=baidu.com,O="Beijing Baidu Netcom Science Technology Co., Ltd",OU=service operation department,L=beijing,ST=beijing,C=CN
...
> GET / HTTP/1.1
> User-Agent: curl/7.29.0
> Host: www.baidu.com
> Accept: */*
>
< HTTP/1.1 200 OK
...
{ [data not shown]
```

从上面-v参数打印出的细节，可以看到客户端先往代理服务器39.105.196.164建立了HTTP CONNECT隧道，代理回复HTTP/1.1 200 Connection Established后就开始交互TLS/SSL握手和流量了。

## 编译和打补丁脚本

```bash
#!/bin/bash

#Disable SELinux
if [ -s /etc/selinux/config ] && grep 'SELINUX=enforcing' /etc/selinux/config; then
    sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
    setenforce 0
fi

# 停止firewalld
systemctl stop firewalld.service
# 禁止firewalld服务开机启动
systemctl disable firewalld.service



yum install gcc git patch  cmake make cmake unzip zlib zlib-devel openssl openssl-devel ncurses-devel gcc gcc-c++  wget  pcre pcre-devel -y

tar -zxvf  nginx-1.24.0.tar.gz
tar -zxvf  ngx_http_proxy_connect_module.tar.gz

cd $PWD/nginx-1.24.0
patch -p1 < $PWD/../ngx_http_proxy_connect_module/patch/proxy_connect_rewrite_102101.patch

#添加用户和组
groupadd www
useradd -g www www

./configure --prefix=/usr/local/nginx --add-module=$PWD/../ngx_http_proxy_connect_module --user=www --group=www --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-threads 
make && make install


cp ../nginx /etc/init.d/ -v

chmod a+x /etc/init.d/nginx

chkconfig --add /etc/init.d/nginx
chkconfig nginx on
# 启动
systemctl start nginx

mv -v /usr/local/nginx/conf/nginx.conf /usr/local/nginx/conf/nginx.conf.bak
cp -v ../nginx.conf /usr/local/nginx/conf/nginx.conf
/usr/local/nginx/sbin/nginx -s reload
# 将以下配置写入 /etc/sysctl.conf

cat <<EOF >/etc/sysctl.conf
net.ipv4.tcp_fin_timeout = 5
net.ipv4.tcp_keepalive_time = 5
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_max_syn_backlog = 3240000
net.ipv4.tcp_max_tw_buckets = 10000

net.ipv4.tcp_mem = 768432 2097152 15242880
net.ipv4.tcp_rmem = 4096 4096 33554432
net.ipv4.tcp_wmem = 4096 4096 33554432
net.ipv4.ip_local_port_range = 2048 64500
net.core.wmem_default = 183888608
net.core.rmem_default = 183888608
net.core.rmem_max = 33554432
net.core.wmem_max = 33554432
net.core.netdev_max_backlog = 2621244

kernel.sem=250 65536 100 2048
kernel.msgmax = 65536
kernel.msgmnb = 65536
kernel.perf_cpu_time_max_percent = 60
kernel.perf_event_max_sample_rate = 6250
net.ipv4.tcp_max_orphans = 1048576
kernel.sched_migration_cost_ns = 5000000
net.core.optmem_max = 25165824
net.core.somaxconn = 60000
net.ipv4.tcp_window_scaling = 1
EOF

# 应用新的配置
sysctl -p && echo "应用系统优化策略成功" || echo "部分系统优化策略应用失败"
```

## nginx启动文件

```bash
#!/bin/sh
#
# nginx - this script starts and stops the nginx daemon
#
# chkconfig:   - 85 15
# description:  NGINX is an HTTP(S) server, HTTP(S) reverse \
#               proxy and IMAP/POP3 proxy server
# processname: nginx
# config:      /usr/local/nginx/conf/nginx.conf
# config:      /etc/sysconfig/nginx
# pidfile:     /usr/local/nginx/logs/nginx.pid
# Source function library.
. /etc/rc.d/init.d/functions
# Source networking configuration.
. /etc/sysconfig/network
# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0
nginx="/usr/local/nginx/sbin/nginx"
prog=$(basename $nginx)
NGINX_CONF_FILE="/usr/local/nginx/conf/nginx.conf"
[ -f /etc/sysconfig/nginx ] && . /etc/sysconfig/nginx
lockfile=/var/lock/subsys/nginx
make_dirs() {
   # make required directories
   user=`$nginx -V 2>&1 | grep "configure arguments:" | sed 's/[^*]*--user=\([^ ]*\).*/\1/g' -`
   if [ -z "`grep $user /etc/passwd`" ]; then
       useradd -M -s /bin/nologin $user
   fi
   options=`$nginx -V 2>&1 | grep 'configure arguments:'`
   for opt in $options; do
       if [ `echo $opt | grep '.*-temp-path'` ]; then
           value=`echo $opt | cut -d "=" -f 2`
           if [ ! -d "$value" ]; then
               # echo "creating" $value
               mkdir -p $value && chown -R $user $value
           fi
       fi
   done
}
start() {
    [ -x $nginx ] || exit 5
    [ -f $NGINX_CONF_FILE ] || exit 6
    make_dirs
    echo -n $"Starting $prog: "
    daemon $nginx -c $NGINX_CONF_FILE
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}
stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -QUIT
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}
restart() {
    configtest || return $?
    stop
    sleep 1
    start
}
reload() {
    configtest || return $?
    echo -n $"Reloading $prog: "
    killproc $nginx -HUP
    RETVAL=$?
    echo
}
force_reload() {
    restart
}
configtest() {
  $nginx -t -c $NGINX_CONF_FILE
}
rh_status() {
    status $prog
}
rh_status_q() {
    rh_status >/dev/null 2>&1
}
case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart|configtest)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
            ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}"
        exit 2
esac


```

## nginx配置文件

```nginx

user  www;
worker_processes  auto;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  102400;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;
    server {
          listen  3126;
     
          # dns resolver used by forward proxying
          resolver  114.114.114.114 ipv6=off ipv4=on;
     
          # forward proxy for CONNECT request
          proxy_connect;
          proxy_connect_allow            443;
          proxy_connect_connect_timeout  10s;
          proxy_connect_read_timeout     10s;
          proxy_connect_send_timeout     10s;
     
          # forward proxy for non-CONNECT request
          location / {
              proxy_pass $scheme://$http_host$request_uri;
              proxy_set_header Host $host;
          }
      }
    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

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


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}

```

