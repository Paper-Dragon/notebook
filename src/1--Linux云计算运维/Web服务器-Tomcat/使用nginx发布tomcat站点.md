之前我们在访问的时候使用的都是类似http://serverip/test或者http://serverip/jpress这种字样的URL，使用起来比较麻烦，所以呢，我们可以将tomcat和nginx结合在一起，可以通过nginx以下功能发布：

- 使用nginx url重写
- 使用nginx的反向代理功能

## 一、部署tomcat网站

通过部署两个tomcat站点，分别采用nginx url rewrite方法和反向代理发布。

- 设置tomcat1

```
[root@zutuanxue ~]# cd /opt/tomcat1/webapps/
[root@zutuanxue webapps]# mv ROOT tomcat
[root@zutuanxue webapps]# mv jpress ROOT
```

- 设置tomcat2

```
[root@zutuanxue ~]# cd /opt/tomcat2/webapps/
[root@zutuanxue webapps]# mv ROOT tomcat
[root@zutuanxue webapps]# mv test ROOT
```

## 二、使用rewrite实现

### 2.1、部署nginx

```
[root@zutuanxue ~]# dnf install nginx -y
```

### 2.2、设置nginx配置文件

```
[root@zutuanxue ~]# vim /etc/nginx/nginx.conf
[root@zutuanxue ~]# sed -i '/#/d' /etc/nginx/nginx.conf
[root@zutuanxue ~]# sed -i '/^$/d' /etc/nginx/nginx.conf
server {
        listen       80;
        listen       [::]:80;
        server_name  www.a.com;
        location / {
                rewrite ^/$ http://127.0.0.1:8080/jpress break;
        }
    }
    server {
        listen       80;
        listen       [::]:80;127.0.0.1
        server_name  www.b.com;
        location / {
                rewrite ^/$ http://127.0.0.1:8081/test break;
        }
    }
[root@zutuanxue ~]# systemctl restart nginx
```

### 2.3、修改测试机的hosts文件

```
[root@zutuanxue conf]# vim /etc/hosts
192.168.98.200  www.a.com
192.168.98.200  www.b.com
```

### 2.4、 打开浏览器直接访问域名测试

测试方法：
打开浏览器输入之前设置好的域名
http://www.a.com
http://www.b.com
查看是否能访问到对应的网站内容，能看到说明实验成功。

## 三、使用反向代理实现

### 3.1、设置nginx配置文件

```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;
include /usr/share/nginx/modules/*.conf;
events {
    worker_connections 1024;
}
http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;
    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;
    include /etc/nginx/conf.d/*.conf;
    server {
        listen       80;
        listen       [::]:80;
        server_name  www.a.com;
        location / {
                proxy_pass http://127.0.0.1:8080;
        }
    }
    server {
        listen       80;
        listen       [::]:80;
        server_name  www.b.com;
        location / {
                proxy_pass http://127.0.0.1:8081;
        }
    }
}
```

### 3.2、打开浏览器直接访问域名测试

测试方法：
打开浏览器输入之前设置好的域名
http://www.a.com
http://www.b.com
查看是否能访问到对应的网站内容，能看到说明实验成功。