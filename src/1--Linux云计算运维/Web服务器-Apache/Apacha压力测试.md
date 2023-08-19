## 一、ab命令

ab工具

Apache服务器的性能测试工具,它可以测试安装Web服务器每秒处理的HTTP请求.

语法

ab {选项} {参数}

选项

-A：指定连接服务器的基本的认证凭据；

-c：指定一次向服务器发出请求数；

-C：添加cookie；

-g：将测试结果输出为“gnuolot”文件；

-h：显示帮助信息；

-H：为请求追加一个额外的头；

-i：使用“head”请求方式；

-k：激活HTTP中的“keepAlive”特性；

-n：指定测试会话使用的请求数；

-p：指定包含数据的文件；

-q：不显示进度百分比；

-T：使用POST数据时，设置内容类型头；

-v：设置详细模式等级；

-w：以HTML表格方式打印结果；

-x：以表格方式输出时，设置表格的属性；

-X：使用指定的代理服务器发送请求；

-y：以表格方式输出时，设置表格属性。

参数

主机：被测试主机。

## 二、ab压力测试

[root@zutuanxue apache]# ./bin/ab -n 10000 -c 200 http://192.168.11.251/index.php

```
[root@apache_251 apache]# ./bin/ab -n 10000   -c 200  http://192.168.11.251/index.php 
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 192.168.11.251 (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        Apache/2.4.39              web服务器软件版本
Server Hostname:        192.168.11.251             web服务器地址
Server Port:            80                         web服务器端口

Document Path:          /index.php                  URI
Document Length:        0 bytes

Concurrency Level:      200
Time taken for tests:   238.891 seconds        完成请求总共用的时间
Complete requests:      10000                  完成10000个请求
Failed requests:        0                      失败0个请求
Non-2xx responses:      10000                  非2xx返回码请求
Total transferred:      3300000 bytes          总共传输字节数
HTML transferred:       0 bytes
Requests per second:    41.86 [#/sec] (mean)     并发数,反应服务器的性能，并发数=Complete requests/Time taken for tests
Time per request:       4777.821 [ms] (mean)     用户平均请求等待时间
Time per request:       23.889 [ms] (mean, across all concurrent requests) 服务器平均请求等待时间
Transfer rate:          13.49 [Kbytes/sec] received    传输速率

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       3
Processing:    91 4729 1932.0   4717   21860
Waiting:       89 4729 1932.0   4717   21860
Total:         92 4729 1931.9   4717   21860

Percentage of the requests served within a certain time (ms)
  50%   4717
  66%   4784
  75%   4977
  80%   6294
  90%   7809
  95%   8018
  98%   9788
  99%  11148
 100%  21860 (longest request)
```