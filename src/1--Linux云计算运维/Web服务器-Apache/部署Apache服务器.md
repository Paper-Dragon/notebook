## 安装步骤

- 安装apr
- 安装apr-util
- 安装apr-iconv
- 安装apache
- 启动apache
- 测试apache
- MPM

## 一、安装依赖

安装依赖

[root@zutuanxue ~]# yum install -y pcre-devel libxml2 expat-devel

## 二、 apr介绍及安装

APR(Apache portable Run-time libraries，Apache可移植运行库)的目的如其名称一样，主要为上层的应用程序提供一个可以跨越多操作系统平台使用的底层支持接口库。在早期 的Apache版本中，应用程序本身必须能够处理各种具体操作系统平台的细节，并针对不同的平台调用不同的处理函数。

[root@zutuanxue ~]# wget https://www.apache.org/dist/apr/apr-1.7.0.tar.bz2

[root@zutuanxue ~]# tar xf apr-1.7.0.tar.bz2

[root@zutuanxue ~]# cd apr-1.7.0

[root@zutuanxue apr-1.7.0]# ./configure --prefix=/usr/local/apr

[root@zutuanxue apr-1.7.0]# make

[root@zutuanxue apr-1.7.0]# make install

## 三、APR-util介绍及安装

apr-util该目录中也是包含了一些常用的开发组件。这些组件与apr目录下的相比，它们与apache的关系更加密切一些。比如存储段和存储段组，加密等等。

[root@zutuanxue ~]# wget https://www.apache.org/dist/apr/apr-util-1.6.1.tar.bz2

[root@zutuanxue ~]# tar xf apr-util-1.6.1.tar.bz2

[root@zutuanxue ~]# cd apr-util-1.6.1

[root@zutuanxue apr-util-1.6.1]# yum install -y expat-devel

[root@zutuanxue apr-util-1.6.1]# ./configure --prefix=/usr/local/apr-util --with-apr=/usr/local/apr/

[root@zutuanxue apr-util-1.6.1]# make

[root@zutuanxue apr-util-1.6.1]# make install

## 四、apr-iconv介绍及安装

apr-iconv包中的文件主要用于实现iconv编码。目前的大部分编码转换过程都是与本地编码相关的。在进行转换之前必须能够正确地设置本地编码。因此假如两个非本地编码A和B需要转换，则转换过程大致为A->Local以及Local->B或者B->Local以及Local->A。

[root@zutuanxue ~]# wget https://www.apache.org/dist/apr/apr-iconv-1.2.2.tar.bz2

[root@zutuanxue ~]# tar xf apr-iconv-1.2.2.tar.bz2

[root@zutuanxue ~]# cd apr-iconv-1.2.2

[root@zutuanxue apr-iconv-1.2.2]# ./configure --prefix=/usr/local/apr-iconv --with-apr=/usr/local/apr

[root@zutuanxue apr-iconv-1.2.2]# make

[root@zutuanxue apr-iconv-1.2.2]# make install

## 五、apache安装

[root@zutuanxue ~]# wget https://www.apache.org/dist/httpd/httpd-2.4.39.tar.gz

[root@zutuanxue ~]# tar xf httpd-2.4.39.tar.gz

[root@zutuanxue ~]# cd httpd-2.4.39

[root@zutuanxue httpd-2.4.39]# ./configure --prefix=/usr/local/apache --enable-mpms-shared=all --with-mpm=event --with-apr=/usr/local/apr --with-apr-util=/usr/local/apr-util --enable-so --enable-remoteip --enable-proxy --enable-proxy-fcgi --enable-proxy-uwsgi --enable-deflate=shared --enable-expires=shared --enable-rewrite=shared --enable-cache --enable-file-cache --enable-mem-cache --enable-disk-cache --enable-static-support --enable-static-ab --disable-userdir --enable-nonportable-atomics --disable-ipv6 --with-sendfile

```
--prefix=/usr/local/apache                         指定安装目录
--enable-mpms-shared=all --with-mpm=event                 开启动态MPM切换        
--with-apr=/usr/local/apr --with-apr-util=/usr/local/apr-util         指定依赖包apr apr-util安装路径
--enable-so                                  打开 so 模块，so 模块是用来提 dso 支持的 apache 核心模块
--enable-remoteip                             支持基于客户端IP做访问控制                        
--enable-proxy --enable-proxy-fcgi --enable-proxy-uwsgi         启用代理支持PHP Python网站
--enable-deflate=shared                         开启压缩
--enable-expires=shared                          开启客户端缓存
--enable-rewrite=shared                         开启URL重写
--enable-cache --enable-file-cache --enable-mem-cache --enable-disk-cache 开启服务器缓存    
--enable-static-support                         支持静态连接
--enable-static-ab                             使用静态连接编译 ab - apache http 服务器性能测试工具
--disable-userdir                             禁用用户主目录提供页面访问
--enable-nonportable-atomics                         对新式CPU支持，支持原子的比较交换(compare-and -swap, CAS)操作指令
--disable-ipv6                              禁用IPV6
--with-sendfile                             开启sendfile 0复制机制
```

[root@zutuanxue httpd-2.4.39]# make

[root@zutuanxue httpd-2.4.39]# make install

\##相关目录

[root@zutuanxue apache]# tree -L 1

.

├── bin 二进制命令

├── build

├── cgi-bin cgi脚本目录

├── conf 配置文件目录

├── error 错误记录

├── htdocs 默认网站根目录

├── icons 小图标

├── include 一些C语言文件

├── logs 日志目录

├── man 帮助手册

├── manual 在线手册

└── modules 存放apache运行需要的模块

## 六、apache启动

[root@zutuanxue ~]# /usr/local/apache/bin/httpd

## 七、apache状态测试

[root@zutuanxue ~]# elinks [http://192.168.11.251](http://192.168.11.251/) -dump

```
                               It works!
```

## 八、MPM多处理模块

Apache HTTP 服务器被设计为一个功能强大，并且灵活的 web 服务器， 可以在很多平台与环境中工作。不同平台和不同的环境往往需要不同 的特性，或可能以不同的方式实现相同的特性最有效率。Apache httpd 通过模块化的设计来适应各种环境。这种设计允许网站管理员通过在 编译时或运行时，选择哪些模块将会加载在服务器中，来选择服务器特性。

Apache HTTP 服务器 2.0 扩展此模块化设计到最基本的 web 服务器功能。 它提供了可以选择的多处理模块(MPM)，用来绑定到网络端口上，接受请求， 以及调度子进程处理请求。

扩展到这一级别的服务器模块化设计，带来两个重要的好处:

Apache httpd 能更优雅，更高效率的支持不同的平台。尤其是 Apache httpd 的 Windows 版本现在更有效率了，因为 mpm_winnt 能使用原生网络特性取代在 Apache httpd 1.3 中使用的 POSIX 层。它也可以扩展到其它平台 来使用专用的 MPM。

Apache httpd 能更好的为有特殊要求的站点定制。例如，要求 更高伸缩性的站点可以选择使用线程的 MPM，即 worker 或 event； 需要可靠性或者与旧软件兼容的站点可以使用 prefork。

在用户看来，MPM 很像其它 Apache httpd 模块。主要是区别是，在任何时间， 必须有一个，而且只有一个 MPM 加载到服务器中。可用的 MPM 列表位于 模块索引页面。

**默认MPM**

下表列出了不同系统的默认 MPM。如果你不在编译时选择，那么它就是你将要使用的 MPM。

Netware mpm_netware

OS/2 mpmt_os2

Unix prefork，worker 或 event，取决于平台特性

Windows mpm_winnt

**构建 MPM 为静态模块**

在全部平台中，MPM 都可以构建为静态模块。在构建时选择一种 MPM，链接到服务器中。如果要改变 MPM，必须重新构建。

为了使用指定的 MPM，请在执行 configure 脚本 时，使用参数 --with-mpm=NAME。NAME 是指定的 MPM 名称。

编译完成后，可以使用 ./httpd -l 来确定选择的 MPM。 此命令会列出编译到服务器程序中的所有模块，包括 MPM。

**构建 MPM 为动态模块**

在 Unix 或类似平台中，MPM 可以构建为动态模块，与其它动态模块一样在运行时加载。 构建 MPM 为动态模块允许通过修改 LoadModule 指令内容来改变 MPM，而不用重新构建服务器程序。

在执行 configure 脚本时，使用 --enable-mpms-shared 选项可以启用此特性。 当给出的参数为 all 时，所有此平台支持的 MPM 模块都会被安装。还可以在参数中给出模块列表。

默认 MPM，可以自动选择或者在执行 configure 脚本时通过 --with-mpm 选项来指定，然后出现在生成的服务器配置文件中。 编辑 LoadModule 指令内容可以选择不同的 MPM。

**–enable-mpms-shared=all --with-mpm=event**

**Apache三种MPM介绍**

**Prefork MPM **: 这个多路处理模块(MPM)实现了一个非线程型的、预派生的web服务器，它的工作方式类似于Apache 1.3。它适合于没有线程安全库，需要避免线程兼容性问题的系统。它是要求将每个请求相互独立的情况下最好的MPM，这样若一个请求出现问题就不会影响到其他请求。

这个MPM具有很强的自我调节能力，只需要很少的配置指令调整。最重要的是将MaxClients设置为一个足够大的数值以处理潜在的请求高峰，同时又不能太大，以致需要使用的内存超出物理内存的大小。

**Worker MPM** : 此多路处理模块(MPM)使网络服务器支持混合的多线程多进程。由于使用线程来处理请求，所以可以处理海量请求，而系统资源的开销小于基于进程的MPM。但是，它也使用了多进程，每个进程又有多个线程，以获得基于进程的MPM的稳定性。

每个进程可以拥有的线程数量是固定的。服务器会根据负载情况增加或减少进程数量。一个单独的控制进程(父进程)负责子进程的建立。每个子进程可以建立ThreadsPerChild数量的服务线程和一个监听线程，该监听线程监听接入请求并将其传递给服务线程处理和应答。

不管是Worker模式或是Prefork 模式，Apache总是试图保持一些备用的(spare)或者是空闲的子进程（空闲的服务线程池）用于迎接即将到来的请求。这样客户端就不需要在得到服务前等候子进程的产生。

**Event MPM**：以上两种稳定的MPM方式在非常繁忙的服务器应用下都有些不足。尽管HTTP的Keepalive方式能减少TCP连接数量和网络负载，但是 Keepalive需要和服务进程或者线程绑定，这就导致一个繁忙的服务器会耗光所有的线程。 Event MPM是解决这个问题的一种新模型，它把服务进程从连接中分离出来。在服务器处理速度很快，同时具有非常高的点击率时，可用的线程数量就是关键的资源限制，此时Event MPM方式是最有效的。一个以Worker MPM方式工作的繁忙服务器能够承受每秒好几万次的访问量（例如在大型新闻服务站点的高峰时），而Event MPM可以用来处理更高负载。在event工作模式中，会有一些专门的线程用来管理这些keep-alive类型的线程，当有真实请求过来的时候，将请求传递给服务器的线程，执行完毕后，又允许它释放。这增强了在高并发场景下的请求处理

![apachempm.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603010761940.png)