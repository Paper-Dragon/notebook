# Nginx-Plus的动态模块Lua

> 将Lua联合例程集成到NGINX事件处理模型中，使用由NGINX,Inc。编写和支持的Lua动态模块。
>
> http://openresty.org
>
> 这个开源 Web 平台主要由章亦春（[agentzh](http://agentzh.org)）维护。在 2011 年之前曾由雅虎中国和[淘宝网](http://www.taobao.com)赞助，在后来的 2012 ~ 2016 年间主要由美国的 [CloudFlare 公司](http://www.cloudflare.com) 提供支持。目前，OpenResty® 主要由 OpenResty 软件基金会和 OpenResty Inc. 公司提供支持。
>
> 2009年，agentzh & chaoslawful一起基于Nginx用C语言开发OpenResty
> 2011年，agentzh离职专心维护OpenResty
> 2012-2016年，Cloudflare赞助支持agentzh专心开发OpenResty，快速发展
> 2016年，锤子科技赞助OpenResty软件基金会（发布会的门票收入100万元）以支持OpenResty开发
>
> https://blog.csdn.net/shasharoman/article/details/120069206



## 安装过程

### 安装NDK模块

> 因为Lua依赖于NDK，安装NDK模块

https://docs.nginx.com/nginx/admin-guide/dynamic-modules/ndk/

#### installation Instructions  

1. Install the NDK module.

   For Amazon Linux, CentOS, Oracle Linux, and RHEL:

   ```shell
   $ yum install nginx-plus-module-ndk
   ```

   For Debian and Ubuntu:

   ```shell
   $ apt-get install nginx-plus-module-ndk
   ```

   For SLES:

   ```shell
   $ zypper install nginx-plus-module-ndk
   ```

   For Alpine:

   ```shell
   $ apk add nginx-plus-module-ndk
   ```

2. Put the [`load_module`](https://nginx.org/en/docs/ngx_core_module.html#load_module) directive in the top‑level (“`main`”) context of NGINX Plus configuration file, **nginx.conf**:

   ```nginx
   load_module modules/ndk_http_module.so;
   ```

3. Perform additional configuration as required by the [module](https://github.com/vision5/ngx_devel_kit).

4. Reload NGINX Plus to enable the module:

   ```shell
   $ nginx -t && nginx -s reload
   ```



### nginx安装Lua模块

https://docs.nginx.com/nginx/admin-guide/dynamic-modules/lua/

1. Prior to installing the Lua module, verify that the [NDK](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/ndk/) module is already installed.

2. Install the Lua module.

   For Amazon Linux, CentOS, Oracle Linux, and RHEL:

   ```shell
   $ yum install nginx-plus-module-lua
   ```

   For Debian and Ubuntu:

   ```shell
   $ apt-get install nginx-plus-module-lua
   ```

   For SLES:

   ```shell
   $ zypper install nginx-plus-module-lua
   ```

   For Alpine:

   ```shell
   $ apk add nginx-plus-module-lua
   ```

3. Put the [`load_module`](https://nginx.org/en/docs/ngx_core_module.html#load_module) directives for NDK and Lua modules in the top‑level (“`main`”) context of NGINX Plus configuration file, **nginx.conf**:

   ```nginx
   load_module modules/ndk_http_module.so;
   load_module modules/ngx_http_lua_module.so;
   ```

   > **Note:** The directives must be in this order.

4. Perform additional configuration as required by the [module](https://github.com/openresty/lua-nginx-module).

5. Reload NGINX Plus to enable the module:

   ```shell
   $ nginx -t && nginx -s reload
   
   ```

## 怎么去使用

- [NGINX Lua Module Reference](https://github.com/openresty/lua-nginx-module)

- https://github.com/openresty/lua-nginx-module#directives



### set_by_lua_block

```text
syntax: set_by_lua_block $res { lua-script }

context: server, server if, location, location if

phase: rewrite

执行一对大括号（｛｝）内指定的代码，并将字符串输出返回$res。一对大括号（｛｝）内的代码可以进行API调用，并可以从ngx.arg表中检索输入参数（索引从1开始，按顺序递增）。

当Nginx事件循环在代码执行期间被阻塞时，该指令被设计为执行短的、快速运行的代码块。因此，应避免使用耗时的代码序列。
该指令通过将自定义命令注入标准ngx_http_rewrite_module的命令列表来实现。由于ngx_http_rewrite_module在其命令中不支持非阻塞I/O，因此要求生成当前Lua“轻线程”的Lua API无法在此指令中工作。

在set_by_lua_block的上下文中，当前至少禁用了以下API函数：
输出API函数（例如，ngx.say和ngx.send_headers）
控制API函数（例如，ngx.exit）
子请求API函数（例如，ngx.location.capture和ngx.location/capture_multi）
Cosocket API函数（例如，ngx.socket.tcp和ngx.req.socket）。
休眠API函数ngx.sleep。
此外，请注意，该指令一次只能将值写入单个Nginx变量。但是，可以使用ngx.var.VARIABLE接口解决问题。
```

例子

```nginx

 location /foo {
     set $diff ''; # we have to predefine the $diff variable here

     set_by_lua_block $sum {
         local a = 32
         local b = 56

         ngx.var.diff = a - b  -- write to $diff directly
         return a + b          -- return the $sum value normally
     }

     echo "sum = $sum, diff = $diff";
 }
```



This directive can be freely mixed with all directives of the [ngx_http_rewrite_module](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html), [set-misc-nginx-module](http://github.com/openresty/set-misc-nginx-module), and [array-var-nginx-module](http://github.com/openresty/array-var-nginx-module) modules. All of these directives will run in the same order as they appear in the config file.

```nginx
 set $foo 32;
 set_by_lua_block $bar { return tonumber(ngx.var.foo) + 1 }
 set $baz "bar: $bar";  # $baz == "bar: 33"
```

No special escaping is required in the Lua code block.

This directive requires the [ngx_devel_kit](https://github.com/simplresty/ngx_devel_kit) module.

This directive was first introduced in the `v0.9.17` release.