tomcat的优化可以提高网站的并发能力，体现个人的价值，tomcat在java项目中的使用率非常高，所以在生产环境对tomcat的优化也就变得非常必要了，一般情况下tomcat的优化主要从两个方面入手，一个是自身配置，另一个是tomcat所运行的jvm虚拟机的优化，优化的工作可以从安装完tomcat就开始着手

## 一、AJP优化

在前面的课程中我们提到了一个叫AJP的协议，同时我们也知道了这个AJP的作用，但是在生产环境中一般使用的是nginx+tomcat的架构，所以大多数时候用不到AJP协议，所以我们可以禁用它，而在我们的server.xml文件中这个AJP默认就是禁用的,如果是其它版本最好看一下

```
 [root@zutuanxue conf]# vim /opt/tomcat1/conf/server.xml 

 <!--
    <Connector protocol="AJP/1.3"
               address="::1"
               port="8009"
               redirectPort="8443" />
    -->
```

## 二、运行模式优化

tomcat的运行模式有3种：

**bio**

性能非常低下，没有经过任何优化处理和支持，适用于连接数目比较小且固定的架构，这种方式对服务器资源要求比较高，并发局限于应用中，JDK1.4以前的唯一选择，但程序直观简单易理解。

**nio**

nio(new I/O)，是Java SE 1.4及后续版本提供的一种新的I/O操作方式它拥有比传统I/O操作(bio)更好的并发运行性能。Tomcat9默认使用nio运行模式。适用于连接数目多且连接比较短（轻操作）的架构，比如聊天服务器，并发局限于应用中，编程比较复杂。AIO(NIO2)使用于连接数目多且连接比较长（重操作）的架构，比如相册服务器，充分调用OS参与并发操作，编程比较复杂，JDK7开始支持。

**apr**

安装起来最困难，但是从操作系统级别来解决异步的IO问题，大幅度的提高性能

进入tomcat的服务器状态页面查看默认的模式

![image20200313202144717.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162047961.png)

如果默认使用的是bio模式

```
设置使用nio模式
[root@zutuanxue logs]# vim /opt/tomcat1/conf/server.xml
<Connector  port="8080"protocol="org.apache.coyote.http11.Http11NioProtocol" connectionTimeout="20000"
               redirectPort="8443" />
```

### apr运行模式

APR(Apache portable Run-time libraries，Apache可移植运行库)的目的如其名称一样，主要为上层的应用程序提供一个可以跨越多操作系统平台使用的底层支持接口库。可以大大地提高Tomcat对静态文件的处理性能。 也是在Tomcat上运行高并发应用的首选模式。

系统自带的软件包不是最新的，且缺少相关软件包，所以我们选择源码包安装

所需软件包

apr-1.7.0.tar.gz 主程序包 包含了通用开发组件

apr-iconv-1.2.2.tar.gz 用于实现iconv编码

apr-util-1.6.1.tar.gz 额外的开发组件

tomcat-native.tar.gz 关联tomcat和apr的组件

arp相关软件包下载 https://mirrors.cnnic.cn/apache/apr/

tomcat-native在tomcat安装目录的bin下

### 部署apr环境

**step 1** 环境准备

```
[root@zutuanxue ~]# dnf install -y apr-devel openssl-devel gcc make expat-devel libtool 
```

**step 2** 安装apr主程序包

```
[root@zutuanxue ~]# tar fx apr-1.7.0.tar.gz 
[root@zutuanxue ~]# cd apr-1.7.0/
[root@zutuanxue ~]# ./configure --prefix=/usr/local/apr
[root@zutuanxue apr-1.7.0]# make -j4 && make install
```

**step 3** 安装apr-iconv

```
[root@zutuanxue ~]# tar fx apr-iconv-1.2.2.tar.gz 
[root@zutuanxue ~]# cd apr-iconv-1.2.2/
[root@zutuanxue ~]# ./configure   --with-apr=/usr/local/apr  --prefix=/usr/local/apr-iconv
[root@zutuanxue apr-iconv-1.2.2]# make -j4 && make install
```

**step 4** 安装apr-util

```
[root@zutuanxue ~]# tar fx apr-util-1.6.1.tar.gz 
[root@zutuanxue ~]# cd apr-util-1.6.1/
[root@zutuanxue ~]# ./configure --prefix=/usr/local/apr-util  --with-apr=/usr/local/apr   --with-apr-iconv=/usr/local/apr-iconv/bin/apriconv
[root@zutuanxue apr-util-1.6.1]# make -j4 && make install
```

**step 5** 安装tomcat-native

```
[root@zutuanxue ~]# cd /opt/tomcat1/bin/
[root@zutuanxue bin]# tar fx tomcat-native.tar.gz 
[root@zutuanxue bin]# cd tomcat-native-1.2.23-src/native
[root@zutuanxue tomcat-native-1.2.23-src]# ./configure --with-apr=/usr/local/apr  --with-java-home=/usr/java/jdk-13.0.2
[root@zutuanxue tomcat-native-1.2.23-src]# make -j4 && make install
```

**step 6** 修改并加载环境变量

```
[root@zutuanxue ~]# echo 'export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/apr/lib
export LD_RUN_PATH=$LD_RUN_PATH:/usr/local/apr/lib' >> /etc/profile
[root@zutuanxue ~]# source /etc/profile
```

**step 7** 修改tomcat配置文件

```
[root@zutuanxue ~]# vim /opt/tomcat1/conf/server.xml 
   protocol="org.apache.coyote.http11.Http11AprProtocol"
               connectionTimeout="20000"
               redirectPort="8443" />
```

**step 8** 测试

```
#为了避免干扰先执行关闭
[root@zutuanxue ~]# sh /opt/tomcat1/bin/shutdown.sh 
#测试
[root@zutuanxue ~]# sh /opt/tomcat1/bin/catalina.sh run
#如果没有问题可以看到
14-Mar-2020 00:22:23.894 信息 [main] org.apache.coyote.AbstractProtocol.start 开始协议处理句柄["http-apr-8080"]
```

![image20200314122328676.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162079362.png)

```
注意：如果非root用户启动失败，把apr环境变量在当前用户的.bash_profile中写一份
[root@zutuanxue ~]# echo 'export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/apr/lib
export LD_RUN_PATH=$LD_RUN_PATH:/usr/local/apr/lib' >> /root/.bash_profile
[root@zutuanxue ~]# source /root/.bash_profile
```

### 其它优化参数

```
[root@zutuanxue logs]# vim /opt/tomcat1/conf/server.xml 
 <Connector  port="8080"            			protocol="HTTP/1.1              enableLookups="false"                maxThreads="1000"                minSpareThreads="100"                acceptCount="900"                disableUploadTimeout="true"                connectionTimeout="20000"                URIEncoding="UTF-8"                redirectPort="8443"
compression="on"                compressionMinSize="1024"                useSendfile="false"                noCompressionUserAgents="mozilla, traviata"                compressibleMimeType="text/html,text/xml,text/plain,text/css,text/javascript,application/javascript "  />

maxThreads：最大线程数，默认150。增大值避免队列请求过多，导致响应缓慢。
minSpareThreads：最小空闲线程数。
acceptCount：当处理请求超过此值时，将后来请求放到队列中等待。
disableUploadTimeout：禁用上传超时时间
connectionTimeout：连接超时，单位毫秒，0代表不限制
URIEncoding：URI地址编码使用UTF-8
enableLookups：关闭dns解析，提高响应时间
compression：启用压缩功能
compressionMinSize：最小压缩大小，单位Byte
compressibleMimeType ：压缩的文件类型

官方参数文档：http://tomcat.apache.org/tomcat-9.0-doc/config/http.html
```