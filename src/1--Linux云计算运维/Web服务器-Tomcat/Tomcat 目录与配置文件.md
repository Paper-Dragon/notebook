## 一、tomcat目录说明

**tomcat主目录**

```
bin：命令，存放不同平台上启动或关闭的脚本
BUILDING.txt&RUNNING.txt：使用文档，告诉用户如何搭建
conf：各种全局配置文件，最主要的是server.xml和web.xml	
CONTRIBUTING.md：捐赠
lib：tomcat需要用到的库，主要是各种jar包
LICENSE：许可
logs：存放tomcat的日志
NOTICE：通知信息
README.md：读我文档
RELEASE-NOTES：版本信息
temp：临时文件  	
webapps：tomcat的web发布目录，类似于nginx或者apache的html目录  
work：tomcat的工作目录，存放的是jsp编译后产生的.class文件及.java文件。清空work目录，然后重启tomcat，可以达到清除缓存的作用。
```

**bin目录**

```
bin目录下的文件主要有两类，一个是Linux使用的.sh结尾的文件，另外一个是windows使用的.bat结尾的文件，
catalina	tomcat的设置脚本，也可以启动&关闭tomcat
[root@zutuanxue bin]# sh catalina.sh help
Using CATALINA_BASE:   /opt/tomcat1
Using CATALINA_HOME:   /opt/tomcat1
Using CATALINA_TMPDIR: /opt/tomcat1/temp
Using JRE_HOME:        /usr
Using CLASSPATH:       /opt/tomcat1/bin/bootstrap.jar:/opt/tomcat1/bin/tomcat-juli.jar
Usage: catalina.sh ( commands ... )
commands:
  debug             Start Catalina in a debugger
  debug -security   Debug Catalina with a security manager
  jpda start        Start Catalina under JPDA debugger
  run               Start Catalina in the current window
  run -security     Start in the current window with security manager
  start             Start Catalina in a separate window
  start -security   Start in a separate window with security manager
  stop              Stop Catalina, waiting up to 5 seconds for the process to end
  stop n            Stop Catalina, waiting up to n seconds for the process to end
  stop -force       Stop Catalina, wait up to 5 seconds and then use kill -KILL if still running
  stop n -force     Stop Catalina, wait up to n seconds and then use kill -KILL if still running
  configtest        Run a basic syntax check on server.xml - check exit code for result
  version           What version of tomcat are you running?
Note: Waiting for the process to end and use of the -force option require that $CATALINA_PID is defined
[root@zutuanxue bin]# sh catalina.sh stop
[root@zutuanxue bin]# sh catalina.sh help


startup		启动脚本
shutdown	关闭脚本
```

**conf目录**

```
这个目录下主要存放的是与tomcat设置相关的文件，常用的配置文件主要包含

server.xml	可以设置端口号、设置域名或IP、默认加载的项目、请求编码 
web.xml	可以设置tomcat支持的文件类型 
context.xml	可以用来配置数据源之类的 
tomcat-users.xml	用来配置管理tomcat的用户与权限 
Catalina					此目录下可以设置默认加载的项目 
```

**webapps目录**

```
ROOT	tomcat默认的页面
docs	使用说明文档
examples	例子--tomcat首页中的examples按钮对应的内容
host-manager	首页Host Manager按钮对应的内容
manager  	首页 Manager App按钮对应的内容
```

## 二、tomcat相关配置文件简介

**server.xml**

| 元素名                                                       | 属性              | 解释                                                         |
| ------------------------------------------------------------ | ----------------- | ------------------------------------------------------------ |
| server                                                       | port              | 指定一个端口，这个端口负责监听关闭tomcat的请求               |
|                                                              | shutdown          | 指定向端口发送的命令字符串                                   |
| service                                                      | name              | 指定service的名字                                            |
| Connector(表示客户端和service之间的连接)                     | port              | 指定服务器端要创建的端口号，并在这个断口监听来自客户端的请求 |
|                                                              | minProcessors     | 服务器启动时创建的处理请求的线程数                           |
|                                                              | maxProcessors     | 最大可以创建的处理请求的线程数                               |
|                                                              | enableLookups     | 如果为true，则可以通过调用request.getRemoteHost()进行DNS查询来得到远程客户端的实际主机名，若为false则不进行DNS查询，而是返回其ip地址 |
|                                                              | redirectPort      | 指定服务器正在处理http请求时收到了一个SSL传输请求后重定向的端口号 |
|                                                              | acceptCount       | 指定当所有可以使用的处理请求的线程数都被使用时，可以放到处理队列中的请求数，超过这个数的请求将不予处理 |
|                                                              | connectionTimeout | 指定超时的时间数(以毫秒为单位)                               |
| Engine(表示指定service中的请求处理引擎，接收和处理来自Connector的请求) | defaultHost       | 指定缺省的处理请求的主机名，它至少与其中的一个host元素的name属性值是一样的 |
| Context(表示一个web应用程序，通常为WAR文件，关于WAR的具体信息见servlet规范) | docBase           | 应用程序的路径或者是WAR文件存放的路径                        |
|                                                              | path              | 表示此web应用程序的url的前缀，这样请求的url为http://localhost:8080/path/ |
|                                                              | reloadable        | 这个属性非常重要，如果为true，则tomcat会自动检测应用程序的/WEB-INF/lib 和/WEB-INF/classes目录的变化，自动装载新的应用程序，我们可以在不重起tomcat的情况下改变应用程序 |
| host(表示一个虚拟主机)                                       | name              | 指定主机名                                                   |
|                                                              | appBase           | 应用程序基本目录，即存放应用程序的目录                       |
|                                                              | unpackWARs        | 如果为true，则tomcat会自动将WAR文件解压，否则不解压，直接从WAR文件中运行应用程序 |
| Logger(表示日志，调试和错误信息)                             | className         | 指定logger使用的类名，此类必须实现org.apache.catalina.Logger 接口 |
|                                                              | prefix            | 指定log文件的前缀                                            |
|                                                              | suffix            | 指定log文件的后缀                                            |
|                                                              | timestamp         | 如果为true，则log文件名中要加入时间，如下例:localhost_log.004-mm-dd.txt |
| Realm(表示存放用户名，密码及role的数据库)                    | className         | 指定Realm使用的类名，此类必须实现org.apache.catalina.Realm接口 |
| Valve(功能与Logger差不多，其prefix和suffix属性解释和Logger 中的一样) | className         | 指定Valve使用的类名，如用org.apache.catalina.valves.AccessLogValve类可以记录应用程序的访问信息 |
|                                                              | directory         | 指定log文件存放的位置                                        |
|                                                              | pattern           | 有两个值，common方式记录远程主机名或ip地址，用户名，日期，第一行请求的字符串，HTTP响应代码，发送的字节数。combined方式比common方式记录的值更多 |

**web.xml**

默认Web应用的首页文件的设置

报错文件的设置

session 会话过期时间的设置,单位是分钟

servlet的设置(Java Servlet的简称，称为小服务程序或服务连接器，用Java编写的服务器端程序，具有独立于平台和协议的特性，主要功能在于交互式地浏览和生成数据，生成动态Web内容。)

**tomcat-users.xml**

管理用户配置文件

rolename 定义角色，不同的角色管理权限不同，相当于组

```
manager-gui	允许访问html接口(即URL路径为/manager/html/*)
manager-script	允许访问纯文本接口(即URL路径为/manager/text/*)
manager-jmx	允许访问JMX代理接口(即URL路径为/manager/jmxproxy/*)
manager-status	允许访问Tomcat只读状态页面(即URL路径为/manager/status/*)
admin-gui 允许访问html管理界面
admin-script 允许访问文本管理界面
```

user 定义用户名

```
username	定义用户名
password	设置密码
roles		属于那些角色/组
```