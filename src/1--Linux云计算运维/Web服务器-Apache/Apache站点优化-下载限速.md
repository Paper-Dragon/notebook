## 一、限速介绍

网站除了能共享页面给用户外，还能作为下载服务器存在。但是作为下载服务器时，我们应该考虑服务器的带宽和IO的性能，防止部分邪恶分子会通过大量下载的方式来攻击你的带宽和服务器IO性能。

假如你的服务器被邪恶分子通过下载的方式把带宽占满了，那么你或其他用户在访问的时候就会造成访问慢或者根本无法访问。

假如你的服务器被邪恶分子通过下载的方式把服务器IO占满了，那么你的服务器将会无法处理用户请求或宕机。

以上的两个问题在我们生产环境下是很可能也是很容易被攻击的，为了保护我们的带宽资源，我们可以通过限制下载速度来解决，防止某个用户下载占用大量带宽。同时，也可以通过限制连接数的上限来控制一个用户同一时间内同时发起的连接数做限制。

#### 使用场景：资源下载服务器

#### 优化目的：保护带宽及服务器IO资源合理使用

## 二、限速方法

apache自带了基于带宽限速的模块

ratelimit_module 该模块只能对连接下载速度做限制，且是单线程的下载，迅雷等下载工具使用的是多线程下载。

mod_limitipconn ：限制每 IP 的连接数 。需要额外安装该模块

## 三、限速实现

1）mod_limitipconn模块下载

wget https://dominia.org/djao/limit/mod_limitipconn-0.24.tar.bz2

2）模块安装

1. tar -zxvf mod_limitipconn-0.24.tar.gz
2. cd mod_limitipconn-0.24
3. vim Makefile
4. 修改如下行

```
       修改：apxs = “/usr/local/apache/bin/apxs” 
       指定apache命令apxs的路径
```

1. make
2. make install

3）查看apache主配置文件,是否有了该模块

LoadModule limitipconn_module modules/mod_limitipconn.so

有说明模块安装成功

4）实现限速

限速针对目录或者数据类型

针对目录 <Location /baism>…… ;

针对数据类型<Location /baism/*.mp4>……

```
LoadModule ratelimit_module modules/mod_ratelimit.so
LoadModule limitipconn_module modules/mod_limitipconn.so

<Location /baism>
 SetOutputFilter RATE_LIMIT
 SetEnv rate-limit 100 #限速100k
MaxConnPerIP 3 #限制的线程数
NoIPLimit index.htm #对此文件不做限制
</Location>
```

## 四、测试

1）生成下载数据

dd if=/dev/zero of=/usr/local/apache/htdocs/web1/baism/bigfile bs=1M count=300

2）使用wget下载数据

wget http://192.168.11.251/baism/bigfile

测试方法：
并发下载3个以上看是否有限制
查看下载速率是否在100K左右

测试图片

未限制限速前下载速度展示

![下载限速1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603016107738.png)

)
开启下载速度限速，限制下载速度100KB

![限速2.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603015916218.png)

基于IP的并发下载限制，同一客户端下载并发为3

![限速3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603015930532.png)