## 一、Apache介绍

Apache HTTP Server（简称Apache）是Apache软件基金会的一个开放源码的网页服务器，是世界使用排名第一的Web服务器软件。它可以运行在几乎所有广泛使用的计算机平台上，由于其跨平台和安全性被广泛使用，是最流行的Web服务器端软件之一。它快速、可靠并且可通过简单的API扩充，将Perl/Python等解释器编译到服务器中。

Apache HTTP服务器是一个模块化的服务器，源于NCSAhttpd服务器，经过多次修改，成为世界使用排名第一的Web服务器软件。

apache当前版本:2.4.X

- 官方网站:www.apache.org
- 学习手册:http://httpd.apache.org/docs/2.4/

## 二、Apache特点

**Apacheweb服务器软件拥有以下特性：**

1.支持最新的HTTP/2通信协议（2.4.17及以后版本）

2.拥有简单而强有力的基于文件的配置过程

3.支持通用网关接口

4.支持基于IP和基于域名的虚拟主机

5.支持多种方式的HTTP认证

6.集成Perl处理模块

7.集成代理服务器模块

8.支持实时监视服务器状态和定制服务器日志

9.支持服务器端包含指令(SSI)

10.支持安全Socket层(SSL)

11.提供用户会话过程的跟踪

12.支持FastCGI

13.通过第三方模块可以支持JavaServlets

14.跨平台

**平行软件**

- IIS
- Nginx
- tengine
- Lighttpd
- Tomcat
- Resin

## 三、部分Apache2.4新特性

**新增模块**

- Mod_proxy_fcgi：提供fcgi代理
- Mod_ratelimit：限制用户带宽
- Mod_request：过滤客户机请求
- Mod_remoteip：匹配客户端的IP

**新特性**

- Mpm（工作模式）：支持工作模式在apache运行时更改
- 但是要开启这种特性，在编译安装要启用这三种功能：–enable-mpms-shared=all --with-mpm=event
- 完善了event模式
- 支持使用自定义变量
- 基于FQDN的虚拟主机不再需要NameVirtualHost指令
- 增强版的表达式分析器
- 支持异步读写
- 毫秒级别的keepalivetimeout