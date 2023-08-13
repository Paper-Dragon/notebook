# Nginx的负载均衡和故障转移

## 1、轮询（默认）

每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。

```nginx
upstream tomcatserver {
                      server 11.11.11.11:8081 ;
                      server 12.12.12.12:8082 ;
					  server 13.13.13.13:8083 ;
					  server 14.14.14.14:8085 ;
                    }
    server {
        listen       8080;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        location /smartupdate {
            #proxy_pass   http://11.12.12.12:8081;
			proxy_pass   http://tomcatserver;
			proxy_set_header  Host $host:8080;
			#proxy_connect_timeout 20000;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

```

## 2、weight

指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。

```nginx
upstream backserver { 
	server 192.168.0.14 weight=10; 
	server 192.168.0.15 weight=10; 
} 
```

## 3、ip_hash

每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。



```nginx
upstream bakend {
    ip_hash;
    server 192.168.203.14:88;
    server 192.168.203.15:80;
}
```

## 4、fair（第三方）

按后端服务器的响应时间来分配请求，响应时间短的优先分配。



```nginx
upstream backserver { 
	server server1; 
	server server2; 
	fair; 
}
```

## 5、url_hash（第三方）

按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。

```nginx
upstream backserver { 
	server squid1:3128; 
	server squid2:3128; 
	hash $request_uri; 
	hash_method crc32; 
} 
```

## 6、负载均衡&故障转移的的配置 ：

```nginx
 
worker_processes  1;
 
events {
    worker_connections  1024;
}
# https://www.jianshu.com/p/4c250c1cd6cd
http {
	# 1. 轮询模式
	# upstream  ban-server {
    #    server    localhost:8086;
    #    server    localhost:8087;
    # }
	
	# 2. 权重模式
	# upstream  ban-server {
    #    server    localhost:8086 weight=1;
    #    server    localhost:8087 weight=2;
    # }
	
	# max_fails = number; # 熔断机制的错误次数 阈值（默认1）
	# fail_timeout = time #熔断时间（nginx标记服务器不可用的持续时间，默认10s）
	# 示例： server 192.168.1.100 max_fails=3 fail_timeout= 10s;
	
 	   #server localhost:8091 max_fails=1 fail_timeout=60s;
　　　　#server localhost:8092 max_fails=1 fail_timeout=60s;
　　　　#server localhost:8093 max_fails=1 fail_timeout=60s;
　　　　
	# 3. iphash  
	upstream  ban-server {
	   # ip_hash; 
       server localhost:8086 weight=1 max_fails=3 fail_timeout=20s;
       server localhost:8087 weight=2 max_fails=3 fail_timeout=20s;
    }
 
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
 
    server {
        listen       8080;
        server_name  localhost;
 
      location / {
		#故障转移的条件：如果后端的服务器返回502、504、执行超时等错误，自动将请求转发到upstream负载均衡池中的另一台服务器，实现故障转移。  
		proxy_next_upstream http_502 http_504 error timeout invalid_header ;  
		proxy_send_timeout 60s;    # 代理发送超时时间
		proxy_read_timeout 60s;    # 代理接收超时时间
		proxy_next_upstream_tries 3;      # 重试次数(针对当前超时、不可用节点的重试次数)
		
		proxy_pass http://ban-server;
		proxy_redirect default;
      }
 
      #error_page   500 502 503 504  /50x.html;
      #location = /50x.html {
      #    root   html;
      #}
 
    }
 
}

	
注释说明:　
例如:
　　upstream bakend
　　{#定义负载均衡设备的Ip及设备状态
	server 127.0.0.1:9090 down;
	server 127.0.0.1:8080 weight=2;
	server 127.0.0.1:6060;
	server 127.0.0.1:7070 backup;
	}
	proxy_connect_timeout 3;#后端服务器连接的超时时间_发起握手等候响应超时时间
　　proxy_read_timeout 3;#连接成功后等候后端服务器响应时间其实已经进入后端的排队之中等候处理（也可以说是后端服务器处理请求的时间）
　　proxy_send_timeout 3;#后端服务器数据回传时间_就是在规定时间之内后端服务器必须传完所有的数据
　　
	upstream: 还可以为每个设备设置状态值，这些状态值的含义分别如下：
	down: 表示单前的server暂时不参与负载.
	weight: 默认为1.weight越大，负载的权重就越大。
	max_fails: 允许请求失败的次数默认为1.当超过最大次数时，返回proxy_next_upstream 模块定义的错误.
	fail_timeout: max_fails次失败后，暂停的时间。
	backup: 其它所有的非backup机器down或者忙的时候，请求backup机器。所以这台机器压力会最轻。



```



## Nginx常用的超时配置说明:



```nginx
client_header_timeout
语法 client_header_timeout time
默认值 60s
上下文 http server

说明 指定等待client发送一个请求头的超时时间（例如：GET / HTTP/1.1）.仅当在一次read中，没有收到请求头，才会算成超时。如果在超时时间内，client没发送任何东西，nginx返回HTTP状态码408(“Request timed out”)

client_body_timeout
语法 client_body_timeout time
默认值 60s
上下文 http server location

说明 该指令设置请求体（request body）的读超时时间。仅当在一次readstep中，没有得到请求体，就会设为超时。超时后，nginx返回HTTP状态码408(“Request timed out”)

keepalive_timeout
语法 keepalive_timeout timeout [ header_timeout ]
默认值 75s
上下文 http server location

说明 第一个参数指定了与client的keep-alive连接超时时间。服务器将会在这个时间后关闭连接。可选的第二个参数指定了在响应头Keep-Alive: timeout=time中的time值。这个头能够让一些浏览器主动关闭连接，这样服务器就不必要去关闭连接了。没有这个参数，nginx不会发送Keep-Alive响应头（尽管并不是由这个头来决定连接是否“keep-alive”）
两个参数的值可并不相同

注意不同浏览器怎么处理“keep-alive”头
MSIE和Opera忽略掉"Keep-Alive: timeout=<N>" header.
MSIE保持连接大约60-65秒，然后发送TCP RST
Opera永久保持长连接
Mozilla keeps the connection alive for N plus about 1-10 seconds.
Konqueror保持长连接N秒

lingering_timeout
语法 lingering_timeout time
默认值 5s
上下文 http server location

说明 lingering_close生效后，在关闭连接前，会检测是否有用户发送的数据到达服务器，如果超过lingering_timeout时间后还没有数据可读，就直接关闭连接；否则，必须在读取完连接缓冲区上的数据并丢弃掉后才会关闭连接。

resolver_timeout
语法 resolver_timeout time
默认值 30s
上下文 http server location

说明 该指令设置DNS解析超时时间

proxy_connect_timeout
语法 proxy_connect_timeout time
默认值 60s
上下文 http server location

说明 该指令设置与upstream server的连接超时时间，有必要记住，这个超时不能超过75秒。
这个不是等待后端返回页面的时间，那是由proxy_read_timeout声明的。如果你的upstream服务器起来了，但是hanging住了（例如，没有足够的线程处理请求，所以把你的请求放到请求池里稍后处理），那么这个声明是没有用的，由于与upstream服务器的连接已经建立了。

proxy_read_timeout
语法 proxy_read_timeout time
默认值 60s
上下文 http server location
说明 该指令设置与代理服务器的读超时时间。它决定了nginx会等待多长时间来获得请求的响应。这个时间不是获得整个response的时间，而是两次reading操作的时间。

proxy_send_timeout

语法 proxy_send_timeout time
默认值 60s
上下文 http server location
说明 这个指定设置了发送请求给upstream服务器的超时时间。超时设置不是为了整个发送期间，而是在两次write操作期间。如果超时后，upstream没有收到新的数据，nginx会关闭连接

proxy_upstream_fail_timeout（fail_timeout）

语法 server address [fail_timeout=30s]
默认值 10s
上下文 upstream
说明 Upstream模块下 server指令的参数，设置了某一个upstream后端失败了指定次数（max_fails）后，该后端不可操作的时间，默认为10秒

```
