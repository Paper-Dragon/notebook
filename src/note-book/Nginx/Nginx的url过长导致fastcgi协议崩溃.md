# Nginx的url过长出现的问题 414 Request-URI Too Large

> 研发写了个非常脑残的功能，竟然要把图片变成base64编码然后通过patch方法去发送给服务端。我人麻了。竟然要把这么复制的东西放到http head里，这尼玛离谱。下面是这件事的解决过程。

## 事件原因

研发的postman发出了414错误，报错内容如下：

```bash
414 Request-URI Too Large
# 414请求url太大
```

我看到之后，看了他的请求结构，直说他疯了。但是我有不能骂，我怕骂不过他。

然后我尝试调试这个问题

## 调试过程

从网上搜了很多资料都让调试一些nginx配置，实测不生效（nginx模块化设计，在某些模块内已经生效）

```bash
client_header_buffer_size 512k;
large_client_header_buffers 4 512k;
client_max_body_size 100m;
```

设置了这些参数之后，报错变成了500 服务器内部错误，我心想，问题更严重了，我日！

```bash
[alert] 8300#0: *17306727 fastcgi request record is too big: 66431, client: 192.168.*, server: 192.168.0.183, request: "GET xxxx....";
```

## 原因解决

从大佬 潘广宇 博客中看到，他翻看了nginx源码，找到原因，代码写死了长度。



https://github.com/nginx/nginx/blob/f255815f5d161fab0dd310fe826d4f7572e141f2/src/http/modules/ngx_http_fastcgi_module.c#L994



```bash
if (len > 65535) {
    ngx_log_error(NGX_LOG_ALERT, r->connection->log, 0,
                  "fastcgi request record is too big: %uz", len);
    return NGX_ERROR;
}
```

## 深入探究

当GET请求的参数大于65535字节时，Nginx 转发给 FastCGI 的请求头将会大于65535字节，**FastCGI 协议限制 64k 数据**，Nginx会自动抛出异常并中断了请求。