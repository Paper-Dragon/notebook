我们知道tomcat是用来发布jsp网站的，jsp的网站，页面漂亮还安全，上节课我们已经知道如何发布静态页面了，本节课我们一起来看一下如何发布动态页面，我们通过jpress一个使用java开发的建站软件来实现jsp页面

```
jpress下载地址：http://jpress.io/download
```

**step 1** 准备jsp页面

```
[root@zutuanxue ~]# mv jpress-v3.2.1.war jpress.war

[root@zutuanxue ~]# cp jpress.war /opt/tomcat1/webapps/

#重启tomcat
[root@zutuanxue ~]# cp jpress.war /opt/tomcat1/webapps/
[root@zutuanxue ~]# sh /opt/tomcat1/bin/shutdown.sh 

[root@zutuanxue ~]# sh /opt/tomcat1/bin/startup.sh 
#重启之后tomcat会自己将这个war的压缩包解压，生成一个同名的目录
```

**step 2** 准备数据库

```
[root@zutuanxue yum.repos.d]# dnf install mariadb mariadb-server -y

[root@zutuanxue yum.repos.d]# systemctl restart mariadb.service 

[root@zutuanxue ~]# mysql -u root -p
Enter password: 

MariaDB [(none)]> create database jpress charset utf8;
MariaDB [(none)]> grant all on jpress.* to jpress@'localhost' identified by '123456';
```

**step 3** 安装jpress

![image20200313141545372.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160976235.png)

![image20200313141616340.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603160997472.png)

![image20200313141647962.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603161027211.png)

![image20200313141659536.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603161051771.png)

![image20200313141725515.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603161069805.png)

![image20200313141752995.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603161088428.png)

![image20200313141822315.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603161108200.png)