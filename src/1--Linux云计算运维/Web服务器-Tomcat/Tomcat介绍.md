## 一、Tomcat介绍

Apache Tomcat最早是由Sun开发的，在1999年被捐献给ASF（Apache 软件基金会 Apache Software Foundation），隶属于Jakarta(雅加达)项目，现在已经独立为一个顶级项目。因为Tomcat 技术先进、性能稳定，同时也是一个免费的开放源代码的Web 应用服务器，因而深受Java 爱好者的喜爱并得到了部分软件开发商的认可，被很多企业普遍使用，也是开发和调试JSP程序的首选。成为目前比较流行的Web 应用服务器。

官方网站：http://tomcat.apache.org/

### **tomcat的同类产品**

- Resin 服务器

Resin是Caucho公司的产品，速度非常快。可以显示动态内容，也可以显示静态内容，但是用户数量少，参考文档也少，使用起来不太方便，一旦涉及到相关文件和内容的更新，系统会自动重新部署并重启。

- Jetty 服务器

Jetty是一个纯粹的基于Java的web服务器，也是一个开源项目。架构简单，速度快，修改简单，但是对java的支持不如tomcat全面，

- WebLogic 服务器

WebLogic 是BEA公司的产品，可进一步细分为 WebLogic Server、WebLogic Enterprise 和 WebLogic Portal 等系列，其中 WebLogic Server 的功能特别强大。WebLogic 支持企业级的、多层次的和完全分布式的Web应用，并且服务器的配置简单、界面友好。对于那些正在寻求能够提供Java平台所拥有的一切应用服务器的用户来说，WebLogic是一个十分理想的选择。但是不开源且收费

JBoss、WebSphere

## 二、Apache nginx tomcat比较

Apache是用C写的；
Nigix是用C写的；
Tomcat是用Java写的。

Tomcat是Apache的拓展，更实质的说是Java应用服务器，用于处理JSP后台语言开发的应用，主要用于处理JSP动态网页。Tomcat 服务器是一个免费的开放源代码的Web 应用服务器（主要用于解析servlet/JSP,同时具备http服务）,单纯的Tomcat性能有限，在很多地方表现有欠缺，如活动连接支持、静态内容、大文件和HTTPS等，因此多数都是Apache+Tomcat+JavaSDK的集成。严格的来说，Apache/Nginx 应该叫做[HTTP Server]而Tomcat 则是一个「Application Server」，或者更准确的来说，是一个「Servlet/JSP」应用的容器（Ruby/Python 等其他语言开发的应用也无法直接运行在 Tomcat 上）。

**Apache**

优点：模块多，功能全面，性能稳定，适合静态HTML

缺点：配置相对复杂，自身不支持动态页面

**Nginx**

优点：功能较多，负载均衡、反向代理等，速度比Apache快

缺点：轻量级web服务器，功能不如Apache全面

**Tomcat**

优点：能够处理动态请求，可以独立于Apache运行，支持JSP

缺点：对静态内容和大文件的支持有所欠缺