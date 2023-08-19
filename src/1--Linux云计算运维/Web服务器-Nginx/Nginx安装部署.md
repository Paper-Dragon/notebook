## 一、nginx源码下载

**官网：**http://nginx.org/

**源码包：** nginx-1.19.3.tar.gz

**源码包下载：** wget http://nginx.org/download/nginx-1.19.3.tar.gz -P /usr/src

## 二、nginx安装

```
2.1、下载nginx源码包
[root@zutuanxue ~]# wget http://nginx.org/download/nginx-1.19.3.tar.gz -P /usr/src
[root@zutuanxue src]# cd /usr/src

2.2、安装nginx依赖包
[root@zutuanxue ~]# yum -y install gcc pcre-devel zlib-devel
  - gcc: 源码编译工具 
  - pcre-devel： nginx url_rewrite 功能提供包 
  - zlib-devel： nginx 压缩功能提供包	

2.3、解压nginx源码，并进入源码包
[root@zutuanxue src]# tar xf nginx-1.19.3.tar.gz
[root@zutuanxue src]# cd nginx-1.19.3


2.4、配置nginx源码

[root@zutuanxue nginx-1.19.3]# ./configure --prefix=/usr/local/nginx
    配置目的：
      1）检查环境 是否 满足安装条件     依赖解决
      2）指定安装方式    配置文件   命令文件  各种文件放哪里   开启模块功能【内置模块  三方模块】
      3）指定软件安装在那里


2.5、编译nginx源码
[root@zutuanxue nginx-1.19.3]# make -j4

2.6、安装nginx
[root@zutuanxue nginx-1.19.3]# make install
```

## 三、nginx相关目录

nginx path prefix: “/usr/local/nginx”

nginx binary file: “/usr/local/nginx/sbin/nginx”

nginx modules path: “/usr/local/nginx/modules”

nginx configuration prefix: “/usr/local/nginx/conf”

nginx configuration file: “/usr/local/nginx/conf/nginx.conf”

nginx pid file: “/usr/local/nginx/logs/nginx.pid”

nginx error log file: “/usr/local/nginx/logs/error.log”

nginx http access log file: “/usr/local/nginx/logs/access.log”

## 四、nginx启动管理

配置文件测试：/usr/local/nginx/sbin/nginx -t

Nginx启动：/usr/local/nginx/sbin/nginx

Nginx关闭：killall –s QUIT nginx

## 五、nginx启动测试

nginx安装完毕，接下来就可以启动nginx了，nginx启动后如何测试nginx的启动状态呢？可以通过以下三种方式去测试，这个可以根据自己的习惯选择一种测试就行了。

- 使用netsata命令查看启动端口
	[root@zutuanxue ~]# netstat –ntpl
- 使用losf命令查看启动端口
	[root@zutuanxue ~]# lsof -i :80
- 使用文本浏览器访问nginx默认网站
	[root@zutuanxue ~]# elinks [http://IP](http://ip/)

测试页面内容如下

![nginx默认网站页.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/19/1603105516493.png)