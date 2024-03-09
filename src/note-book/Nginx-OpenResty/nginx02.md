# Nginx高级进阶篇

## Nginx Web服务器

## Nginx Proxy 服务器

### 原理

#### 正向代理

```bash
内网客户机通过代理访问互联网，通常需要设置代理服务器的地址和端口
```

![image-20211109120422697](nginx02.assets\image-20211109120422697.png)

squid：



#### 反向代理

```bash
外网用户通过代理访问内网服务器，内网服务器无感知
```



![image-20211109120844510](nginx02.assets\image-20211109120844510.png)

#### 正向代理和反向代理的区别是什么

```bash
--------正代--------
1. 为客户端做代理,代理客户端去访问后方的Web服务器(VPN翻墙)
2. 任何可以连接到该代理服务器的软件，就可以通过代理访问任何的其他服务器，然后把数据返回给客户端

--------反代--------
1. 为服务器做代理,代理服务器接受用户的请求,能够将用户的请求平均分发给后方的Web集群。
2. 具有缓冲服务器内容的空间,会将一些简单的用户请求数据存储到本地,让用户能够快速得到信息。
3. 用户与服务器之间是无感知的,是通过反代进行联系在一起,反代会去监听双方的状态
   客户端向服务端请求数据时,发送完http请求后关机了,这时我们的服务器没有感知,但反代通过监    
   听状态会直接将客户端的请求丢弃,不在后方的web服务器发送,避免的垃圾信息的网络拥塞。
```





### Proxy代理

#### 模块

```bash
ngx_http_proxy_module
```

#### 语法

代理

```bash
Syntax: 	proxy_pass URL; 代理后端服务器URL
Default: 	—
Context: 	location, if in location, limit_except
```

缓冲区

```bash
Syntax: 	proxy_buffering on | off; 缓冲开关
Default: 	proxy_buffering on;
Context: 	http, server, location	
proxy_buffing 开启的情况下，nginx后吧后端返回的内容先放到缓冲区当中，然后再返回给客户端（边收边传）

Syntax: 	proxy_buffer_size size; 缓冲区大小
Default: 	proxy_buffer_size 4k|8k;
Context: 	http, server, location

Syntax: 	proxy_buffers number size; 缓冲区数量
Default: 	proxy_buffers 8 4k|8k;
Context: 	http, server, location

Syntax: 	proxy_busy_buffers_size size; 忙碌的缓冲区大小，控制同时传给客户端的buffer的数量
Default: 	proxy_busy_buffers_size 8k|16k;
Context: 	http, server, location

Syntax: 	proxy_set_header field value; 设置真实客户端地址
Default: 	proxy_set_header Host $proxy_host;
			proxy_set_header Connection close;
Context: 	http, server, location

Syntax: 	proxy_connect_timeout time;
Default: 	proxy_connect_timeout 60s;
Context: 	http, server, location

Syntax: 	proxy_send_timeout time; nginx进程向fastcgi进程发送request的整个过程的超时时间
Default: 	proxy_send_timeout 60s;
Context: 	http, server, location
```



#### 启用代理

```bash
location / {
  proxy_pass http://172.16.100.16:81;
  proxy_redirect default; 转发时是否使用默认端口
  proxy_set_header Host $http_host;    #重新定义或者添加后端服务器的请求头(源IP....)
  proxy_set_header   X-Real-IP $remote_addr; #启用客户端真实IP(不启用在日志中显示为代理器访问的网站)
  proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for; #记录代理地址
  ​
  proxy_connect_timeout 30;  #后端服务器连接的超时时间(发起三次握手后的响应时间 TCP连接)
  proxy_send_timeout 60;  #后端服务器数据回传时间(在规定时间内必须传完所有数据)
  proxy_read_timeout 60;  #Nginx负载均衡时,对后方的Web服务器进行监控(连续60秒没收到1个字节,连接关闭)
  ​
  proxy_buffering on;   #开启缓存
  proxy_buffer_size 32k;  #响应头的缓冲区
  proxy_buffers 4 128k;   #内容的缓冲区域大小(4个缓冲区,每个缓冲区大小为128K)
  proxy_busy_buffers_size 256k;  #从proxy_buffers划出一部分缓冲区来专门向客户端传送数据的地方
  proxy_max_temp_file_size 256k; #超大响应头存储成文件

}
```



### Proxy缓存

![image-20211109132501205](nginx02.assets\image-20211109132501205.png)

#### 缓存类型

网页缓存 CDN

数据库缓存 memcache redis

网页缓存 nginx-proxy

客户端缓存，浏览器缓存

#### 模块

ngx_http_proxy_module

```bash
原理：将Proxy服务器作为realServer的缓存服务器，加速用户的访问过程
      将realServer上的一部分数据放到Proxy服务器上
      当用户请求数据时,realServer将数据返回时,先将数据在Proxy上进行暂存,在发送给用户。
      当用户第二次访问时,访问到缓存的数据,可直接返回,加速用户对服务器的访问。
```



#### 语法

```bash
缓存开关
Syntax: 	proxy_cache zonename | off;
Default: 	proxy_cache off;
Context: 	http, server, location

代理缓存
Syntax: 	proxy_cache_path path [levels=levels] [use_temp_path=on|off] keys_zone=name:size [inactive=time] [max_size=size] [min_free=size] [manager_files=number] [manager_sleep=time] [manager_threshold=time] [loader_files=number] [loader_sleep=time] [loader_threshold=time] [purger=on|off] [purger_files=number] [purger_sleep=time] [purger_threshold=time];
Default: 	—
Context: 	http
example proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=zonename:10m;

缓存维度
Syntax: 	proxy_cache_key string; 定义缓存唯一key，通过唯一key进行hash读取缓存文件名
Default: 	proxy_cache_key $scheme$proxy_host$request_uri;
Context: 	http, server, location

缓存过期
Syntax: 	proxy_cache_valid [code ...] time;
Default: 	—
Context: 	http, server, location
proxy_cache_valid 200 302 10m;
proxy_cache_valid 404      1m;
```



#### 启动缓存

```bash
http {
  ...
  proxy_cache_path /app/qianfeng/cache levels=1:2 keys_zone=proxy_cache:10m max_size=10G inactive=60m use_temp_path=off;
  ...
  
参数解析：/app/qianfeng/cache => 用户自定义缓存文件夹,需提前创建
     levels=1:2 => 缓存 存放的2级目录(将每次用户的请求放到一个文件夹中,一个用户一个文件夹)结构分明,用户查找更准确
     keys_zone=proxy_cache => 缓存区的名字/规则
     :10m => 10m空间,用来存放Key(一个Key代表一个用户的请求)
     max_size=10g => 具体的缓存空间(上限的空间,如果不设置,默认服务器有多大磁盘就存多大)
     inactive=60m => 存放60分钟,超过时间被清理,清理不需要的内容
     use_temp_path=off => 不使用临时缓存路径

  server {
    location / {
    ...
      proxy_cache proxy_cache;  #第一个是命令主体 第二个是上面定义的策略名 
      proxy_cache_valid 200 304 12h; #用户访问的状态码为200 304的能缓存12h
      proxy_cache_valid any 10m;  #除了上面的状态码,其他都存储10分钟
      proxy_cache_key $host$uri$is_args$args; #URL进行hash得到Key,对比Key,得到对应数据
      add_header  Nginx-Cache "$upstream_cache_status"; #标识缓存的状态(有没有缓中)
      proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;  #对后方Web服务器进行监控,当后方的realServer出现5系错误时,直接将用户的请求分发给另外服务器
      ...
    }
  }
}

mkdir -p /app/qianfeng/cache
systemctl  restart  nginx
```

proxy_cache_path命令中的参数及对应配置说明如下：

```bash
1.用于缓存的本地磁盘目录是/app/tianyun.me/cache
2.levels在/app/tianyun.me/cache/设置了一个两级层次结构的目录。
将大量的文件放置在单个目录中会导致文件访问缓慢，所以针对大多数部署，我们推荐使用两级目录层次结构。
如果levels参数没有配置，则NGINX会将所有的文件放到同一个目录中。
3.keys_zone设置一个共享内存区，该内存区用于存储缓存键和元数据，有些类似计时器的用途。将键的拷贝放入内存可以使NGINX在不检索磁盘的情况下快速决定一个请求是HIT还是MISS，这样大大提高了检索速度。一个1MB的内存空间可以存储大约8000个key，那么上面配置的10MB内存空间可以存储差不多80000个key。
4.max_size设置了缓存的上限（在上面的例子中是10G）。这是一个可选项；如果不指定具体值，那就是允许缓存不断增长，占用所有可用的磁盘空间。当缓存达到这个上线，处理器便调用cache manager来移除最近最少被使用的文件，这样把缓存的空间降低至这个限制之下。
5.inactive指定了项目在不被访问的情况下能够在内存中保持的时间。在上面的例子中，如果一个文件在60分钟之内没有被请求，则缓存管理将会自动将其在内存中删除，不管该文件是否过期。该参数默认值为10分钟（10m）。注意，非活动内容有别于过期内容。NGINX不会自动删除由缓存控制头部指定的过期内容（本例中Cache-Control:max-age=120）。过期内容只有在inactive指定时间内没有被访问的情况下才会被删除。如果过期内容被访问了，那么NGINX就会将其从原服务器上刷新，并更新对应的inactive计时器。

6.NGINX最初会将注定写入缓存的文件先放入一个临时存储区域， use_temp_path=off命令指示NGINX将在缓存这些文件时将它们写入同一个目录下。我们强烈建议你将参数设置为off来避免在文件系统中不必要的数据拷贝。use_temp_path在NGINX1.7版本和NGINX Plus R6中有所介绍。
```



#### 课后题

### 负载均衡部分详解



## Nginx Email

