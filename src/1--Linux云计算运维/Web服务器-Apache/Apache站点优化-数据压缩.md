## 一、数据压缩介绍

数据从服务器传输到客户端，需要传输时间，文件越大传输时间就越长，为了减少传输时间，我们一般把数据压缩后在传给客户端。

apache支持两种压缩:deflate、gzip

#### mod_gzip 和mod_deflate比较

首先一个区别是安装它们的Apache Web服务器版本的差异。Apache 1.x系列没有内建网页压缩技术，所以才去用额外的第三方mod_gzip 模块来执行压缩。而Apache 2.x官方在开发的时候，就把网页压缩考虑进去，内建了mod_deflate 这个模块，用以取代mod_gzip。虽然两者都是使用的Gzip压缩算法，它们的运作原理是类似的。

第二个区别是压缩质量。mod_deflate 压缩速度略快而mod_gzip 的压缩比略高。一般默认情况下，mod_gzip 会比mod_deflate 多出4%~6％的压缩量。

那么，为什么使用mod_deflate？第三个区别是对服务器资源的占用。 一般来说mod_gzip 对服务器CPU的占用要高一些。mod_deflate 是专门为确保服务器的性能而使用的一个压缩模块，mod_deflate 需要较少的资源来压缩文件。这意味着在高流量的服务器，使用mod_deflate 可能会比mod_gzip 加载速度更快。

#### **应用场景：数据压缩传输**

#### **优化目的：提升用户访问页面加载速度，节约带宽**

## 二、数据压缩实现

1）开启模块

LoadModule deflate_module modules/mod_deflate.so

2）调用模块

`<IfModule deflate_module>`

DeflateCompressionLevel 4

AddOutputFilterByType DEFLATE text/html text/plain text/xml application/x-javascript application/x-httpd-php

AddOutputFilter DEFLATE js css

BrowserMatch \bMSIE\s[1-6] dont-vary

SetEnvIfNoCase Request_URI .(?:gif|jpe?g|png)$ no-gzip dont-vary

SetEnvIfNoCase Request_URI .(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary

SetEnvIfNoCase Request_URI .(?:pdf|doc)$ no-gzip dont-vary

```
`<IfModule deflate_module>`
# 压缩等级 4       1-9，数字越大压缩的越好，也越占用CPU时间
DeflateCompressionLevel 4
# 压缩类型 html、xml、php、css、js
AddOutputFilterByType DEFLATE text/html text/plain text/xml application/x-javascript application/x-httpd-php
AddOutputFilter DEFLATE js css
#浏览器匹配 IE1-6的不压缩
BrowserMatch \bMSIE\s[1-6] dont-vary
#设置不压缩的文件，注意图片本身就是压缩过的，所以不需要再压缩
SetEnvIfNoCase Request_URI .(?:gif|jpe?g|png)$ no-gzip dont-vary
SetEnvIfNoCase Request_URI .(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
SetEnvIfNoCase Request_URI .(?:pdf|doc)$ no-gzip dont-vary
</IfModule>
```

## 三、测试

1）生成HTML数据页面

```
for i in `seq 1 20`;do
    cat /etc/passwd >> /usr/local/apache/htdocs/test_deflate.html
done
```

2）未启用压缩前通过浏览器访问该页面，通过开发者工具查看页面大小

![deflate_01.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603015649123.png)

3）启用压缩再次通过浏览器访问该页面，通过开发者工具查看页面大小，如果明显变小了则说明压缩成功。也可以从响应头中看出多了压缩字段。

![deflate_02.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603015669906.png)

![deflate_response_headers03.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603015686310.png)