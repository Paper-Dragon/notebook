## 一、调优的必要性

在聊调优之前，我们先要知道为何调优，业务运行和调优的关系。

![42967083431970b0eb40b3949278a0d1.png](https://www.zutuanxue.com:8000/static/media/images/2020/12/6/1607251234038.png)

业务运行：线上业务正常运行，承载了公司业务。
监控业务：通过监控业务对线上业务进行监控，及时发现问题。
优化业务：通过监控分析，发现业务问题或者瓶颈，及时对业务或者软件就行调整、优化。
测试优化：优化完成后，需要对现有的优化进行测试，保证业务在当前优化模式中稳定、高效，能够解决当前问题。
这就是业务运行的一个流程，也是我们保证业务稳定、高效、高可用的运维之道。

## 二、调优的维度和见解分歧

 调优类的文章是最难写的，因为我只能告诉你调优的选项，无法告诉你具体的阈值，因为不同的业务运行在不同的机器，所消耗的资源是不同的；又因为场景不同，对应的调优项及阈值是千变万化的，就好比你和你上铺的兄弟都是感冒了，去医院看病开的药却是截然不同的。正是如此，才会出现当很多人看到调优的文章，看到了具体的调优项或者阈值就会浮现出两个字，我不好意思说，配个图吧！大家意会就好。

![28a4aaa7cf00a2483492b17857a75176.png](https://www.zutuanxue.com:8000/static/media/images/2020/12/6/1607251822347.png)

## Nginx跳跃

### 1、并发优化

nginx工作模式：主进程+工作进程

```
启动工作进程数量
worker_processes  4;
#指定运行的核的编号，采用掩码的方式设置编号
worker_cpu_affinity   0001 0010 0100 1000;


events {
单个工作进程维护的请求队列长度
    worker_connections  1024;
}
```

### 2、长连接

减少服务器维护因为与客户端建立http连接产生的大量tcp三次握手四次断开的开销

```
keepalive_timeout  0;  0代表关闭
#keepalive_timeout  100;
#keepalive_requests 8192;
```

### 3、压缩

降低传输时间，增加用户体验度；降低公司带宽费用。

```
gzip  on;
gzip_proxied any;
gzip_min_length 1k;
gzip_buffers 4 8k;
gzip_comp_level 6;
gzip_types text/plain text/css application/x-javascript application/javascript application/xml;


    # 开启gzip
    gzip off;

    #Nginx做为反向代理的时候启用：
	off – 关闭所有的代理结果数据压缩
	expired – 如果header中包含”Expires”头信息，启用压缩
	no-cache – 如果header中包含”Cache-Control:no-cache”头信息，启用压缩
	no-store – 如果header中包含”Cache-Control:no-store”头信息，启用压缩
	private – 如果header中包含”Cache-Control:private”头信息，启用压缩
	no_last_modified – 启用压缩，如果header中包含”Last_Modified”头信息，启用压缩
	no_etag – 启用压缩，如果header中包含“ETag”头信息，启用压缩
	auth – 启用压缩，如果header中包含“Authorization”头信息，启用压缩
	any – 无条件压缩所有结果数据


    gzip_proxied any;


    # 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
    gzip_min_length 1k;

    # gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，后面会有详细说明
    gzip_comp_level 1;

    # 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;

    # 增加响应头”Vary: Accept-Encoding”
    # 是否在http header中添加Vary: Accept-Encoding，建议开启
    gzip_vary on;

    # 禁用IE 6 gzip
    gzip_disable "MSIE [1-6]\.";

    # 设置压缩所需要的缓冲区大小     
    gzip_buffers 32 4k;

    # 设置gzip压缩针对的HTTP协议版本
    gzip_http_version 1.0;
```

### 4、静态缓存

将部分数据缓存在用户本地磁盘，用户加载时，如果本地和服务器的数据一致，则从本地加载。提升用户访问速度，提升体验度。节省公司带宽成本。

```
expires指令：开启缓存并指定静态缓存时间

location ~*  \.(png|gif)$ {
              expires 1h;
         }
```