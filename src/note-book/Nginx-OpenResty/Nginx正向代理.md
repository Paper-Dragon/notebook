# Nginx正向代理

>  nginx本身是不支持https协议请求转发，为了让nginx能达到这一效果需要借助第三方模块ngx_http_proxy_connect_module

## 配置

```bash
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
    #access_log  logs/access.log  main;
    sendfile        on;
    #tcp_nopush     on;
    keepalive_timeout  65;
    #gzip  on;
 
server {
        listen 88;                #监听端口
        resolver 183.60.82.98;   #dns解析地址
        server_name  _;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
             proxy_pass https://$host$request_uri;     #设定http代理服务器的协议和地址
             proxy_set_header HOST $host;
             proxy_buffers 256 4k;
             proxy_max_temp_file_size 0k;
             proxy_connect_timeout 30;
             proxy_send_timeout 60;
             proxy_read_timeout 60;
             proxy_next_upstream error timeout invalid_header http_502;
            #root   html;
            #index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
 
    }
 
 
 
server {
       resolver 8.8.8.8;   #dns解析地址
       listen 89;          #代理监听端口
       proxy_connect;
       proxy_connect_allow            443 563;
       location / {
             proxy_pass https://$host$request_uri;     #设定https代理服务器的协议和地址
             proxy_set_header HOST $host;
             proxy_buffers 256 4k;
             proxy_max_temp_file_size 0k;
             proxy_connect_timeout 30;
             proxy_send_timeout 60;
             proxy_read_timeout 60;
             proxy_next_upstream error timeout invalid_header http_502;
 
       }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
 
    }  
 
}　　
```



## 测试

```bash
vim  /etc/profile
...
...
#export https_proxy=正向代理IP:端口
export https_proxy=192.168.3.17:89
```



