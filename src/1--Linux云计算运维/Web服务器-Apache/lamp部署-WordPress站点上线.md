## 一、配置虚拟主机

#### 1）获得网站代码

[root@zutuanxue ~]# wget https://wordpress.org/latest.tar.gz

#### 2）将源文件拷贝到APACHE的htdocs目录

[root@zutuanxue ~]# mkdir /usr/local/apache/htdocs/wordpress/

[root@zutuanxue ~]# tar xf latest.tar.gz -C /opt

[root@zutuanxue ~]# mv /opt/wordpress/* /usr/local/apache/htdocs/wordpress/

[root@zutuanxue ~]# chown www.www /usr/local/apache/htdocs/wordpress -R

#### 3）配置虚拟主机

[root@zutuanxue htdocs]# cat /usr/local/apache/conf/extra/httpd-vhosts.conf

```
<VirtualHost *:80>
    DocumentRoot "/usr/local/apache/htdocs/wordpress"
</VirtualHost>


<Directory "/usr/local/apache/htdocs/wordpress">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>


<IfModule dir_module>
    DirectoryIndex phpinfo.php index.php index.html
</IfModule>


<FilesMatch "\.php$">
    # Unix sockets require 2.4.7 or later
    SetHandler  "proxy:unix:/usr/local/php/etc/php-fpm.socket|fcgi://localhost/"
</FilesMatch>
```

#### 4）重启生效

[root@zutuanxue ~]# killall httpd

[root@zutuanxue ~]# /usr/local/apache/bin/apachectl

## 二、安装wordpress

#### 1）登陆数据库

[root@zutuanxue ~]# mysql -u root -p123

#### 2）新建数据库 wordpress

mysql> create database wordpress;

Query OK, 1 row affected (0.01 sec)

#### 3）wordpress安装

打开浏览器输入[http://IP。我的IP地址是192.168.11.251 ，所以在地址栏中输入的是 http://192.168.11.251/assets/wordpress_install_01.png选择网站语言，我选择的简体中文，然后点继续](http://IP，我的IP地址是192.168.11.251，所以在地址栏中输入的是http://192.168.11.251!
![wordpress_install_01.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014837850.png)
选择网站语言，我选择的简体中文，然后点继续)

![wordpress_install_02.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014857570.png)

欢迎信息，同时告诉你准备连接数据库的相关信息和它的安装操作，直接点现在就开始，继续吧。

![wordpress_install_03.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014869861.png)

输入数据库的相关信息，点提交。如果这个过不去，说明你数据库连接有问题。请检查你使用上述信息是否手动能连接到数据库

```
检查方法
mysql -u root -p123 -h 127.0.0.1
```

![wordpress_install_05.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014893231.png)
数据库信息验证正确后，就要开始安装了。

![wordpress_install_06.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014905185.png)
安装前要求你设置wordpress的后台管理账户和密码，注意，这可是网站后台管理员啊，密码一定不能像我这么随意。输入完毕后点安装就开始安装了。

![wordpress_install_07.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014921496.png)
看到这个图片，恭喜你安装成功了。点登陆，去登陆后台设置网站吧。

![wordpress_install_08.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014933461.png)
登陆窗口，输入你的网站后台的管理员账号密码。

![wordpress_install_09.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014950019.png)
登陆成功，我们写一篇文章纪念一下吧。

根据步骤发布一篇文章吧！

![wordpress_install_11.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603014975124.png)
再一次在浏览器中输入HTTP://IP 你就能看到我们的文章了。