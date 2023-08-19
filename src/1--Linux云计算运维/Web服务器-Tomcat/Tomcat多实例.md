Tomcat是一个单进程多线程的软件，在很早之前，我们都认为这种模式挺好的，因为早些年的CPU都是单核的，但是现在都是多核心的CPU了,如果还是一个进程的话呢，就比较浪费CPU资源，所以本节课我们要讨论下如果多开几个tomcat，也就是我们本节课要实现的是tomcat的多实例，这样可以提高资源的利用率，在之前的课程中我们提到过tomcat有三个端口8005 8009 8080，其中8005是用来关闭tomcat的端口，8080是访问端口，8009是ajp协议使用的端口，如果我想在一台机器上开启多个tomcat的话，首先要保证的就是端口不能冲突，否则开不了。

## Tomcat多实例实现

- 将之前部署好的tomcat复制一份

```
[root@zutuanxue webapps]# cd /opt/
[root@zutuanxue opt]# ls
tomcat1
[root@zutuanxue opt]# cp -r tomcat1 tomcat2
[root@zutuanxue opt]# ls
tomcat1  tomcat2
```

- 修改刚刚部署完成的tomcat的相关配置文件

```
[root@zutuanxue opt]# vim tomcat2/conf/server.xml 
<Server port="8006" shutdown="SHUTDOWN">
<Connector port="8081" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8444" />
#修改端口
```

- 启动tomcat

```
[root@zutuanxue opt]# sh /opt/tomcat1/bin/startup.sh 
[root@zutuanxue opt]# sh /opt/tomcat2/bin/startup.sh 

[root@zutuanxue opt]# netstat -atnp
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp6       0      0 127.0.0.1:8005          :::*                    LISTEN      16801/java          
tcp6       0      0 127.0.0.1:8006          :::*                    
tcp6       0      0 :::8080                 :::*                    LISTEN      16801/java          
tcp6       0      0 :::8081                 :::*                    LISTEN      17776/java          
```

- 打开浏览器访问测试

![image20200313144207263.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162375841.png)
![image20200313144222035.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162404686.png)

```
注意：如果是不同用户使用的话，考虑到安全方面的问题，记得修改tomcat的用户管理文件。
[root@zutuanxue conf]# pwd
/opt/tomcat2/conf
[root@zutuanxue conf]# vim tomcat-users.xml 

<role rolename="manager-gui"/>
  <role rolename="manager-script"/>
  <role rolename="manager-jmx"/>
  <role rolename="manager-status"/>
  <role rolename="admin-gui"/>
  <role rolename="admin-script"/>
  <user username="tomcat" password="tomcat" roles="manager-gui,manager-script,manager-jmx,manager-status,admin-gui,admin-script"/>
```