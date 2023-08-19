## 一、Nginx介绍

Nginx(“engine x”)是一款是由俄罗斯的程序设计师Igor Sysoev所开发高性能的 Web和 反向代理服务器，也是一个 IMAP/POP3/SMTP 代理服务器。和apache一样，都是web服务器软件，因为其性能优异，所以被广大运维喜欢。又因为nginx是一个轻量级的web服务器，相比apache来说**资源消耗更低**。

延伸版本：**tengine（淘宝）、openresrt（章亦春）等**

- http://nginx.org 官网
- http://www.nginx.cn/doc/index.html 中文文档

**最近大事记：**

锤子科技在 T2 鸟巢发布会上将门票收入捐赠给了 OpenResty 开源项目
OpenResty(又称：ngx_openresty) 是一个基于 NGINX 的可伸缩的 Web 平台，由中国人章亦春发起，提供了很多高质量的第三方模块

## 二、为什么选择Nginx

Nginx 是一个高性能的 Web 和反向代理服务器, 它具有有很多非常优越的特性:

作为 Web 服务器：相比 Apache，Nginx 使用更少的资源，支持更多的并发连接，体现更高的效率，这点使 Nginx 尤其受到虚拟主机提供商的欢迎。能够支持高达 50,000 个并发连接数的响应，感谢 Nginx 为我们选择了 epoll and kqueue 作为开发模型.

作为负载均衡服务器：Nginx 既可以在内部直接支持 Rails 和 PHP，也可以支持作为 HTTP代理服务器 对外进行服务。Nginx 用 C 编写, 不论是系统资源开销还是 CPU 使用效率都比 Perlbal 要好的多。

作为邮件代理服务器: Nginx 同时也是一个非常优秀的邮件代理服务器（最早开发这个产品的目的之一也是作为邮件代理服务器），Last.fm 描述了成功并且美妙的使用经验。

Nginx 安装非常的简单，配置文件 非常简洁（还能够支持perl语法），Bugs非常少的服务器: Nginx 启动特别容易，并且几乎可以做到7*24不间断运行，即使运行数个月也不需要重新启动。你还能够在 不间断服务的情况下进行软件版本的升级。

## 三、Nginx和Apache对比

- 静态文件处理能力：nginx高于apache
- 资源消耗：nginx优于apache,因为nginx是异步处理模型，只需要几个进程就能够处理大量在线请求，而apache 2.4仍然是进程模型或者线程模型，即仍然采用大量线程来处理大量在线请求。
- Apache支持的模块很多，而且也比较稳定。而nginx由于出现的比较晚，所以在这方面可能比不上Apache。
- nginx本身就是一个反向代理服务器，而且支持7层负载均衡。
- nginx处理动态页面很鸡肋，一般只用与处理静态页面和反向代理。