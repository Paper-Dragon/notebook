## 一、模块介绍

apache是一个补丁服务器，在安装apache的时候就为用户提供了很多常用模块供用户使用。但是，在生产环境中，很多模块是没有用的，如果apache开启的时候加载了这些模块，就会造成资源的浪费，所以我要告诉大家的是：找到你业务中需要的模块，将不需要的模块全部注释掉，不要让apache在加载这些模块，节省运行apache服务器资源。

那么如何找到你哪些是你需要的模块呢？请参考apache在线手册，对服务器中你使用的功能做分解，然后在对模块进行区分，筛选后做出模块使用列表，不用的就注释掉。

## 二、部分模块介绍

**core**

Apache HTTP服务器核心提供的功能，始终有效。

**mpm_common**

收集了被多个多路处理模块(MPM)实现的公共指令。

**beos**

专门针对BeOS优化过的多路处理模块(MPM)

**event**

一个标准workerMPM的实验性变种。

**mpm_netware**

Novell NetWare优化过的线程化的多路处理模块(MPM)

**mpmt_os2**

专门针对OS/2优化过的混合多进程多线程多路处理模块(MPM)

**prefork**

一个非线程型的、预派生的MPM

**mpm_winnt**

用于Windows NT/2000/XP/2003 系列的MPM

**worker**

线程型的MPM，实现了一个混合的多线程多处理MPM，允许一个子进程中包含多个线程。

**mod_actions**

基于媒体类型或请求方法，为执行CGI脚本而提供

**mod_alias**

提供从文件系统的不同部分到文档树的映射和URL重定向

**mod_asis**

发送自己包含HTTP头内容的文件

**mod_auth_basic**

使用基本认证

**mod_auth_digest**

使用MD5摘要认证(更安全，但是只有最新的浏览器才支持)

**mod_authn_alias**

基于实际认证支持者创建扩展的认证支持者，并为它起一个别名以便于引用

**mod_authn_anon**

提供匿名用户认证支持

**mod_authn_dbd**

使用SQL数据库为认证提供支持

**mod_authn_dbm**

使用DBM数据库为认证提供支持

**mod_authn_default**

在未正确配置认证模块的情况下简单拒绝一切认证信息

**mod_authn_file**

使用纯文本文件为认证提供支持

**mod_authnz_ldap**

允许使用一个LDAP目录存储用户名和密码数据库来执行基本认证和授权

**mod_authz_dbm**

使用DBM数据库文件为组提供授权支持

**mod_authz_default**

在未正确配置授权支持模块的情况下简单拒绝一切授权请求

**mod_authz_groupfile**

使用纯文本文件为组提供授权支持

**mod_authz_host**

供基于主机名、IP地址、请求特征的访问控制

**mod_authz_owner**

基于文件的所有者进行授权

**mod_authz_user**

基于每个用户提供授权支持

**mod_autoindex**

自动对目录中的内容生成列表，类似于"ls"或"dir"命令

**mod_cache**

基于URI键的内容动态缓冲(内存或磁盘)

**mod_cern_meta**

允许Apache使用CERN httpd元文件，从而可以在发送文件时对头进行修改

**mod_cgi**

在非线程型MPM(prefork)上提供对CGI脚本执行的支持

**mod_cgid**

在线程型MPM(worker)上用一个外部CGI守护进程执行CGI脚本

**mod_charset_lite**

允许对页面进行字符集转换

**mod_dav**

允许Apache提供DAV协议支持

**mod_dav_fs**

为mod_dav访问服务器上的文件系统提供支持

**mod_dav_lock**

为mod_dav锁定服务器上的文件提供支持

**mod_dbd**

管理SQL数据库连接，为需要数据库功能的模块提供支持

**mod_deflate**

压缩发送给客户端的内容

**mod_dir**

指定目录索引文件以及为目录提供"尾斜杠"重定向

**mod_disk_cache**

基于磁盘的缓冲管理器

**mod_dumpio**

将所有I/O操作转储到错误日志中

**mod_echo**

一个很简单的协议演示模块

**mod_env**

允许Apache修改或清除传送到CGI脚本和SSI页面的环境变量

**mod_example**

一个很简单的Apache模块API演示模块

**mod_expires**

允许通过配置文件控制HTTP的"Expires:"和"Cache-Control:"头内容

**mod_ext_filter**

使用外部程序作为过滤器

**mod_file_cache**

提供文件描述符缓存支持，从而提高Apache性能

**mod_filter**

根据上下文实际情况对输出过滤器进行动态配置

**mod_headers**

允许通过配置文件控制任意的HTTP请求和应答头信息

**mod_ident**

实现RFC1413规定的ident查找

**mod_imagemap**

处理服务器端图像映射

**mod_include**

实现服务端包含文档(SSI)处理

**mod_info**

生成Apache配置情况的Web页面

**mod_isapi**

仅限于在Windows平台上实现ISAPI扩展

**mod_ldap**

为其它LDAP模块提供LDAP连接池和结果缓冲服务

**mod_log_config**

允许记录日志和定制日志文件格式

**mod_log_forensic**

实现"对比日志"，即在请求被处理之前和处理完成之后进行两次记录

**mod_logio**

对每个请求的输入/输出字节数以及HTTP头进行日志记录

**mod_mem_cache**

基于内存的缓冲管理器

**mod_mime**

根据文件扩展名决定应答的行为(处理器/过滤器)和内容(MIME类型/语言/字符集/编码)

**mod_mime_magic**

通过读取部分文件内容自动猜测文件的MIME类型

**mod_negotiation**

提供内容协商支持

**mod_nw_ssl**

仅限于在NetWare平台上实现SSL加密支持

**mod_proxy**

提供HTTP/1.1的代理/网关功能支持

**mod_proxy_ajp**

mod_proxy的扩展，提供Apache JServ Protocol支持

**mod_proxy_balancer**

mod_proxy的扩展，提供负载平衡支持

**mod_proxy_connect**

mod_proxy的扩展，提供对处理HTTP CONNECT方法的支持

**mod_proxy_ftp**

mod_proxy的FTP支持模块

**mod_proxy_http**

mod_proxy的HTTP支持模块

**mod_rewrite**

一个基于一定规则的实时重写URL请求的引擎

**mod_setenvif**

根据客户端请求头字段设置环境变量

**mod_so**

允许运行时加载DSO模块

**mod_speling**

自动纠正URL中的拼写错误

**mod_ssl**

使用安全套接字层(SSL)和传输层安全(TLS)协议实现高强度加密传输

**mod_status**

生成描述服务器状态的Web页面

**mod_suexec**

使用与调用web服务器的用户不同的用户身份来运行CGI和SSI程序

**mod_unique_id**

为每个请求生成唯一的标识以便跟踪

**mod_userdir**

允许用户从自己的主目录中提供页面(使用"/~username")

**mod_usertrack**

使用Session跟踪用户(会发送很多Cookie)，以记录用户的点击流

**mod_version**

提供基于版本的配置段支持

**mod_vhost_alias**

提供大批量虚拟主机的动态配置支持