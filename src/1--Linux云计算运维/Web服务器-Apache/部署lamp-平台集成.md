## 一、平台集成

单个软件是无法直接完成我们发布PHP站点的既定任务的，需要我们通过多个软件的通力合作才可以完成，所以我们需要将多个软件关联起来，让彼此各司其职，各干其活。一起完成我们的工作。

linux：系统软件，应用软件平台

apache：接受用户请求，处理静态数据，响应用户请求

php：处理用户的PHP请求

mysql：存储数据

## 二、平台集成方法

- PHP作为模块
- PHP作为服务

#### 1.PHP作为模块

这种方式是历史最悠久的关联方法，PHP模块默认出于休眠状态，和apache是上下级关系。apache接受了用户PHP请求后去唤醒PHP模块，PHP模块再去处理请求。

#### 2.PHP作为服务

这种是apache2.4新增功能，PHP是一个服务，常驻内存。和apache是平级关系，apache接受了用户请求直接通过socket或tcp/ip的方式发送给PHP服务，PHP服务直接处理。如果是在同一台机器安装了apache和php建议使用socket方式关联，系统开销最小，并发更大。

## 三、PHP作为模块

[root@zutuanxue php-7.3.4]# ./configure --prefix=/usr/local/php --with-config-file-path=/usr/local/php/etc --with-mysqli=mysqlnd --enable-pdo --with-pdo-mysql=mysqlnd --with-iconv-dir=/usr/local/ --enable-fpm --with-fpm-user=www --with-fpm-group=www --with-pcre-regex --with-zlib --with-bz2 --enable-calendar --disable-phar --with-curl --enable-dba --with-libxml-dir --enable-ftp --with-gd --with-jpeg-dir --with-png-dir --with-zlib-dir --with-freetype-dir --enable-gd-jis-conv --with-mhash --enable-mbstring --enable-opcache=yes --enable-pcntl --enable-xml --disable-rpath --enable-shmop --enable-sockets --enable-zip --enable-bcmath --with-snmp --disable-ipv6 --with-gettext --disable-rpath --disable-debug --enable-embedded-mysqli --with-mysql-sock=/usr/local/mysql/** --with-apxs2=/usr/local/apache2/bin/apxs**

在PHP编译的时候需要加上–with-apxs2=/usr/local/apache2/bin/apxs语句，意思是通过apache的apxs命令将PHP生成为一个apache模块。

配置方法

```
apache修改主配置文件，添加以下行
Include conf/extra/php.conf


[root@zutuanxue conf]# cat extra/php.conf 
LoadModule php7_module        modules/libphp7.so

AddType application/x-httpd-php .php

<VirtualHost *:80>
    DocumentRoot "/usr/local/apache/htdocs/web1"
</VirtualHost>

<Directory "/usr/local/apache/htdocs/web1">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>

<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>
```

## 四、PHP作为服务

#### tcp sock 模式

```
1）修改apache子配置文件
apache修改主配置文件，添加以下行
Include conf/extra/php-fpm.conf

[root@zutuanxue conf]# cat extra/php-fpm.conf
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so


2）设置虚拟主机 关联php
<VirtualHost *:80>
    DocumentRoot "/usr/local/apache/htdocs/web1"
</VirtualHost>

<Directory "/usr/local/apache/htdocs/web1">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>

<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>



<FilesMatch \.php$>
         SetHandler "proxy:fcgi://127.0.0.1:9000"
</FilesMatch>
```

#### unix sock模式

```
1）apache修改主配置文件，添加以下行
Include conf/extra/php-fpm.conf

[root@zutuanxue conf]# cat extra/php-fpm.conf
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so


2）修改PHP-FPM配置文件
[root@zutuanxue extra]# egrep "^listen" /usr/local/php/etc/php-fpm.d/www.conf
listen = /usr/local/php/etc/php-fpm.socket
listen.backlog = 511
#设置UNIX socket 权限
listen.owner = www     
listen.group = www
listen.mode = 0660


3）设置虚拟主机 关联php-fpm
<VirtualHost *:80>
    DocumentRoot "/usr/local/apache/htdocs/web1"


<FilesMatch "\.php$">
    # Unix sockets require 2.4.7 or later
    SetHandler  "proxy:unix:/usr/local/php/etc/php-fpm.socket|fcgi://localhost/"
</FilesMatch>

</VirtualHost>
```

## 五、测试页面

1）生成测试页面

echo “<?php phpinfo(); ?>” /DR/phpinfo.php

2）测试

打开浏览器输入

[http://ip或者域名/phpinfo.php](http://xn--ip-on6cx8lt2pxx7b/phpinfo.php)

![phpinfo.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014638162.png)