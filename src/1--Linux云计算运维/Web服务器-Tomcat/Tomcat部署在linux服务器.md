## 一、下载软件包

tomcat：https://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/tomcat-9/v9.0.31/bin/apache-tomcat-9.0.31.zip

jdk：https://www.oracle.com/java/technologies/javase-downloads.html

如何想使用tomcat9的话，官方要求JRE的版本必须是8以上的，所以在安装之前，我们需要确认一下本机的版本,如果满足需求的话可以直接安装tomcat



## 二、安装JDK

```
# 1、查看当前是否安装过jdk
[root@zutuanxue ~]# java -version
bash: java: 未找到命令...
文件搜索失败: Cannot update read-only repo
#系统提示没有找到命令，意味着没有安装相关软件包，所以我们要安装

# 2、安装jdk
[root@zutuanxue ~]# rpm -ivh jdk-13.0.2_linux-x64_bin.rpm 
警告：jdk-13.0.2_linux-x64_bin.rpm: 头V3 RSA/SHA256 Signature, 密钥 ID ec551f03: NOKEY
Verifying...                          ################################# [100%]
准备中...                          ################################# [100%]
正在升级/安装...
   1:jdk-13.0.2-2000:13.0.2-ga        ################################# [100%]


# 3、验证：安装完成后再次查看
[root@zutuanxue ~]# java -version
java version "13.0.2" 2020-01-14
Java(TM) SE Runtime Environment (build 13.0.2+8)#java的运行环境，也叫jre
Java HotSpot(TM) 64-Bit Server VM (build 13.0.2+8, mixed mode, sharing) 

#JVM java的虚拟机，可以使Java语言在不同平台上运行时不需要重新编译。Java语言使用Java虚拟机屏蔽了与具体平台相关的信息，
使得Java语言编译程序只需生成在Java虚拟机上运行的字节码就可以了，这样就可以在多种平台上不加修改地运行。很多语言都采用了
这种类似的思路，才使得他们具有可移植性，比如说python
```

## 三、安装Tomcat

```
# 1、tomcat 安装
我们可以看到tomcat软件包的名称包含有apache字样，原因很简单，它是由apache资助的项目
[root@zutuanxue ~]# unzip apache-tomcat-9.0.31.zip -d /opt/
[root@zutuanxue ~]# cd /opt/
[root@zutuanxue opt]# mv apache-tomcat-9.0.31 tomcat1
解压完成，改个名就可以使用了，因为tomcat是一个二进制包，什么意思呢？就类似于我们下载游戏的时候的硬盘版，什么是硬盘版？解压就能玩，
所以这个tomcat我们就压之后就可以使用了，不需要安装。


[root@zutuanxue bin]# sh startup.sh 
Cannot find ./catalina.sh
The file is absent or does not have execute permission
This file is needed to run this program

# 2、启动tomcat

  ## tomcat启动命令目录
[root@zutuanxue bin]# pwd
/opt/tomcat1/bin

  ## 启动tomcat
[root@zutuanxue bin]# chmod +x catalina.sh 
[root@zutuanxue bin]# sh startup.sh 
Using CATALINA_BASE:   /opt/tomcat1
Using CATALINA_HOME:   /opt/tomcat1
Using CATALINA_TMPDIR: /opt/tomcat1/temp
Using JRE_HOME:        /usr
Using CLASSPATH:       /opt/tomcat1/bin/bootstrap.jar:/opt/tomcat1/bin/tomcat-juli.jar
Tomcat started.
[root@zutuanxue webapps]# netstat -antp | grep java
tcp6       0      0 127.0.0.1:8005          :::*                    LISTEN      46987/java          
tcp6       0      0 :::8080                 :::*                    LISTEN      46987/java    

tomcat的两个端口
8005 是关闭tomcat使用的端口，可以使用telnet serverip 8005 然后输入大写的SHUTDOWN关闭tomcat，所以建议
更改端口 或者把引号中了命令改成不容易记忆的，个人推荐改命令，因为改端口没有告诉负责网络安全的同事就会给你屏蔽掉
………

8080 连接端口

8009 AJP协议使用的端口，tomcat的优势是处理jsp页面 但是对于图片，静态页面处理能力特别差，相对于apache来说，
那么这个时候怎么办 做个分流 jsp页面由tomcat完成，静态的页面 图片由AJP来完成，AJP是定向包协议 使用二进制格式
来传输可读性文本，在server.xml配置文件中默认不生效
```

**访问默认首页** [http://localhost:8080](http://localhost:8080/)
![tomcat默认页.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/19/1603105819709.png)

注意: tomcat的访问端口是8080

```
提示：如果之前系统中安装过java环境的话，可能会出现即便安装完成新的jdk之后，使用java -version命令所查询的结果依然是老版本的，
这个问题是由于环境变量引起的，所以需要修改环境变量设置文件

[root@zutuanxue ~]# vim /root/.bash_profile 
#####java
JAVA_HOME=/usr/java/jdk-13.0.2#对应自己安装的版本
PATH=$JAVA_HOME/bin:$PATH:$HOME/bin
CLASSPATH=.:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar
export PATH JAVA_HOME CLASSPATH CATALINA_HOME
```