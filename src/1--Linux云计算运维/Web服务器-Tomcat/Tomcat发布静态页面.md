## 访问tomcat网站管理页面

打开浏览器，在地址栏中输入 http://localhost:8080
看到如下页面，该页面是tomcat的默认网站，同时还提供了以下功能

- server status 查看服务器的状态，包括linux主机的信息，tomcat的版本信息，资源使用情况等
- manager app 管理网站
- host manager 虚拟主机的管理

![image20200312154145218.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160256413.png)

默认使用这三个功能需要提供账号密码，如果没有可以采用以下的方式去修改配置文件，设置用以访问的账号密码。

在提示登录的界面点击取消，会看到提示

![image20200312154227858.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160330788.png)

```
[root@zutuanxue ~]# vim /opt/tomcat1/conf/tomcat-users.xml 
<role rolename="manager-gui"/>
  <role rolename="manager-script"/>
  <role rolename="manager-jmx"/>
  <role rolename="manager-status"/>
  <role rolename="admin-gui"/>
  <role rolename="admin-script"/>
  <user username="tomcat" password="tomcat" roles="manager-gui,manager-script,manager-jmx,manager-status,admin-gui,admin-script"/>
```

设置完成之后重启tomcat就可以登录后台管理页面了，其中在manager app中主要管理的是网站是否发布的操作，start=发布网站

stop=停止发布网站，reload=重新加载，undeploy=卸载/删除网站（慎用），expire session=会话过期时间

![image20200312160956755.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160530000.png)

与war文件部署相关的设置，包括定义war文件存放的位置，和上传war文件

```
war是一个可以直接运行的web模块，通常用于网站，打包部署。以Tomcat来说，将war包放置在其\webapps\目录下，然后启动Tomcat，
这个包就会自动解压，就相当于发布了。war包是Sun提出的一种web应用程序格式，与jar类似，是很多文件的压缩包。war包中的文件按
照一定目录结构来组织。简单来说，war包是JavaWeb程序打的包，war包里面包括写的代码编译成的class文件，依赖的包，配置文件，
所有的网站页面，包括html，jsp等等。一个war包可以理解为是一个web项目，里面是项目的所有东西。
```

![image20200312161045722.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160554207.png)

configuration 定义TLS(安全传输协议)配置文件

diagnostics 检查网站在启动，重新加载或卸载时，是否造成内存溢出，这个操作会触发垃圾回收机制，生产环境中慎用

TLS connector configuration diagnostics 加密诊断，可以帮助用户诊断加密是否有问题

### firefox设置中文

```
[root@zutuanxue ~]# dnf install ibus* -y
```

添加完整的中文环境后重启

![image20200313163452841.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160597852.png)

重启完成为浏览器添加中文后重启浏览器

![image20200313163127816.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160616038.png)

再次访问tomcat管理界面就会变成中文

![image20200313163617973.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160631864.png)

### **发布静态页面**

```
[root@zutuanxue webapps]# pwd
/opt/tomcat1/webapps
[root@zutuanxue webapps]# mkdir test
[root@zutuanxue webapps]# echo '<%= new java.util.Date() %>'  > test/index.jsp
```

使用浏览器访问http://ip:8080/test,每次刷新时间都会改变