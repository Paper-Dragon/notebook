# CICD-jenkins构建持续化集成平台

# 一、CI/CD持续集成/持续发布

开发(git) -->git主库–>jenkins(git+jdk+tomcat+maven打包+测试）–>发布到tomcat服务器
英文全称：Continuous Integration
　　CI：中文全称：持续集成工具
　　持续集成是一种软件开发实践。在持续集成中，团队成员频繁集成他们的工作成果，一般每人每天至少集成一次，也可以多次。每次集成会经过自动构建（包括自动测试）的检验，以尽快发现集成错误。

# 二、Jenkins

## １、Jenkins概述

Jenkins是帮我们将代码进行统一的编译打包、还可以放到tomcat容器中进行发布。意思是我们通过配置，将以前：编译、打包、上传、部署到Tomcat中的过程交由Jenkins，Jenkins通过给定的代码地址URL，将代码拉取到其“宿主服务器”（Jenkins的安装位置），进行编译、打包和发布到web容器中。 是一个开源的、提供友好操作界面的持续集成(CI)工具，起源于Hudson(Hudson是商用的)，主要用于持续、自动的构建/测试软件项目、监控一些定时执行的任务。Jenkins用Java语言编写，可在Tomcat等流行的servlet容器中运行，也可独立运行。

jenkins通常与版本管理工具(SCM)、构建工具结合使用；常用的版本控制工具有SVN、GIT。

jenkins构建工具有Maven、Ant、Gradle。

SCM英文全称：Source Control Management (Software Version Control)中文全称：源码控制管理软件 版本控制

## ２、Jenkins目标

监控软件开发流程、快速显示问题、提高开发效率、过程控制

## ３、Jenkins特性

易于安装： 不需要安装、不需要数据库，只需通过java -jar jenkins.war或部署到一个servlet容器中
易于配置：所有的配置都可能通过jenkins提供的web界面完成，当然如果你喜欢，也可以通过手动修改xml文件进行配置
检测报告：生成JUnit或TestNG的测试报告.集成RSS/E-mail通过RSS发布构建结果或当构建完成时通过e-mail通知
文件识别：jenkins能跟踪每次构建生成哪些jar包以及使用哪个版本的jar包
分布式构建： 支持Jenkins能够让多台计算机一起构建/测试
插件支持： jenkins可以通过第三方插件扩展，也可以根据团队需要开发插件
任务（Job）和构建(build)：
　　任务：(Job)是Jenkins的一个执行计划，是一系列操作的集合
　　构建：是Jenkins的任务的一次运行
工作流程： Jenkins就是这么一个CI系统。之前叫做Hudson
　　１、开发者检入代码到源代码仓库。
　　２、CI系统会为每一个项目创建了一个单独的工作区。当预设或请求一次新的构建时，它将把源代码仓库的源码存放到对应的工作区。
　　３、CI系统会在对应的工作区内执行构建过程。
　　４、（配置如果存在）构建完成后，CI系统会在一个新的构件中执行定义的一套测试。完成后触发通知(Email,RSS等等)给相关的当事人。
　　５、（配置如果存在）如果构建成功，这个构件会被打包并转移到一个部署目标(如应用服务器)或存储为软件仓库中的一个新版本。软件仓库可以是CI系统的一部分，也可以是一个外部的仓库，诸如一个文件服务器或者像Java.net、 SourceForge之类的网站。
　　６、CI系统通常会根据请求发起相应的操作，诸如即时构建、生成报告，或者检索一些构建好的构件。





# gitlab

清华镜像站

```bash
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el$releasever/
gpgcheck=0
enabled=1
```

1、优化系统

```bash
systemctl stop firewalld.service
systemctl disable firewalld
sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
setenforce 0
hostnamectl set-hostname gitlab
hostname gitlab
```

2、安装必要依赖

```bash
yum install curl policycoreutils openssh-clients postfix -y
```

3、\#启动postfix

```bash
[root@gitlab ~]# systemctl start postfix
[root@gitlab ~]# systemctl status postfix
```

4、安装依赖

```bash
#安装依赖包
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | bash
或者
直接下载gitlab-ce包进行安装

```

5、安装gitlab

```bash
yum install gitlab-ce -y
```

6、初始化

```bash
 gitlab-ctl reconfigure
```

7、创建密钥

```bash
[root@gitlab ~]# ssh-keygen 
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:hz+xJTh4qMNcvw1aktiNvWsxSzSQPlIpYxrWdS5T9SI root@gitlab
The key's randomart image is:
+---[RSA 2048]----+
|   . ..oo..      |
|  o = =+   .     |
| . + =o.E . .    |
|  . . o=o+ .     |
|     .+oS.+ .    |
|   o = B++ =     |
|    * =.*++      |
|     . +o= .     |
|      ..+..      |
+----[SHA256]-----+
[root@gitlab ~]# 

# 修改配置文件

[root@gitlab ~]# vi /etc/gitlab/gitlab.rb
external_url 'http://gitlab.example.com' 改成：external_url 'http://gitlab.nulige.com'

#配置域名解析
echo "192.168.56.32 gitlab.nulige.com" >>/etc/hosts

#查看解析
[root@gitlab ~]# tail -1 /etc/hosts
192.168.56.32 gitlab.nulige.com

#初始化
[root@node1 ~]# gitlab-ctl reconfigure
时间可能比较长,请你耐心等待即可!

#gitlab命令
关闭：gitlab-ctl stop
启动：gitlab-ctl start
重启：gitlab-ctl restart
状态：gitlab-ctl status

#在windows本地配置域名解析
C:\Windows\System32\drivers\etc\hosts
192.168.56.32 gitlab.nulige.com


#登录网站
http://gitlab.nulige.com
username: root
password: xxxxxxxx

#注册普通用户
username: nulige
password: xxxxxxxx
```



# 三、Jenkins实战部署

环境，两台虚拟机
　　有github账号，用作代码仓库
　　10.11.67.38　4G内存的Centos7部署Jenkins
　　10.11.67.42　2G内存的Centos7部署Tomcat

下面的部署是在10.11.67.38上部署Jenkins

## １、部署GIT



安装依赖包：
```bash
[root@jenkins-server ~]# yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker -y
官网下载GIT最新的版本：
[root@jenkins-server ~]# wget https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.9.5.tar.gz
解压GIT并且cd到解压目录进行编译安装：
[root@jenkins-server ~]# tar -xvf git-2.9.5.tar.gz -C /usr/local
[root@jenkins-server ]# cd git-2.9.5/
编译源码包、源码安装
[root@jenkins-server git-2.9.5]# make prefix=/usr/local/git all
[root@jenkins-server git-2.9.5]# make prefix=/usr/local/git install
添加GIT所需要的环境变量：
[root@jenkins-server ~]# vim /etc/bashrc
PATH=$PATH:$HOME/bin:/usr/local/git/bin
[root@jenkins-server ~]# source /etc/bashrc
关于bashrc和profile：
/etc/profile：此文件为系统的每个用户设置环境信息,当用户第一次！！！登录！！！时,该文件被执行。 并从/etc/profile.d目录的配置文件中搜集shell的设置.
/etc/bashrc：为每一个运行bash shell的用户执行此文件.当bash shell被打开时,该文件被读取.
测试GIT是否安装成功：
[root@jenkins-server ~]# git --version
git version 1.8.3.1
```


## ２、部署JDK环境

下载解压JDK并且cd到解压目录改名，注意不能用JDK9和JDK10:
```bash
[root@jenkins-server ~]# tar -xvf jdk-8u151-linux-x64.tar.gz -C /usr/local
[root@jenkins-server ~]# cd /usr/local/
[root@jenkins-server local]# mv jdk1.8.0_151/ jdk
```

添加JDK所需要的环境变量：

```bash
[root@jenkins-server local]# cd
[root@jenkins-server ~]# vim /etc/bashrc
JAVA_HOME=/usr/local/java
export PATH=$PATH:$JAVA_HOME/bin
[root@jenkins-server ~]# source /etc/bashrc
```

测试JDK环境是否安装成功：

```bash
[root@jenkins-server ~]# java -version
java version “1.8.0_151”
Java™ SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot™ 64-Bit Server VM (build 25.151-b12, mixed mode)
```

如果系统中已安装java-1.8.0-openjdk。java-1.8.0-openjdk 。java-1.8.0-openjdk请卸载他们。

## ３、部署maven

下载和解压Maven：

```bash
[root@jenkins-server ~]# # wget http://mirror.bit.edu.cn/apache/maven/maven-3/3.5.3/binaries/apache-maven-3.5.3-bin.tar.gz
[root@jenkins-server ~]# tar -xvf apache-maven-3.5.3-bin.tar.gz -C /usr/local
[root@jenkins-server ~]# cd /usr/local/
[root@jenkins-server local]# mv apache-maven-3.5.3/ maven
[root@jenkins-server local]# cd
```

添加maven所需要的环境变量：

```bash
[root@jenkins-server ~]# vim /etc/bashrc
export M2_HOME=/usr/local/maven
export M2=$M2_HOME/bin
export PATH=$M2:$PATH
[root@jenkins-server ~]# source /etc/bashrc测试maven是否安装成功：
```


```bash
[root@jenkins-server ~]# mvn -version
Apache Maven 3.5.3 (3383c37e1f9e9b3bc3df5050c29c8aff9f295297; 2018-02-25T03:49:05+08:00)
Maven home: /usr/local/maven
Java version: 1.8.0_151, vendor: Oracle Corporation
Java home: /usr/local/jdk/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: “linux”, version: “3.10.0-693.el7.x86_64”, arch: “amd64”, family: “unix”
```

## ４、部署Tomcat

官网下载Tomcat解压Tomcat并且cd到解压目录改名：

```bash
[root@jenkins-server ~]# tar -xvf apache-tomcat-9.0.1.tar.gz -C /usr/local
[root@jenkins-server ~]# cd /usr/local/
[root@jenkins-server local]# mv apache-tomcat-9.0.1/ tomcat
[root@jenkins-server local]# cd
```

添加Tomcat所需要的环境变量：

```bash
[root@jenkins-server ~]# vim /etc/bashrc
CATALINA_HOME=/usr/local/tomcat
export CATALINA_HOME
[root@jenkins-server ~]# source /etc/bashrc
启动Tomcat：
[root@jenkins-server ~]# /usr/local/tomcat/bin/startup.sh
浏览器访问Tomcat是否安装成功：
http://10.11.67.38:8080
先关闭Tomcat：
[root@jenkins-server ~]# /usr/local/tomcat/bin/shutdown.sh
补充：配置Tomcat的角色和用户：
[root@jenkins-server ~]# vim /usr/local/tomcat/conf/tomcat-users.xml
````


## ５、部署Jenkins

官网下载Jenkins：

```bash
[root@jenkins-server ~]# http://updates.jenkins-ci.org/download/war/2.130
部署Jenkins.war到Tomcat的网站发布目录下：
[root@jenkins-server ~]# cp jenkins.war /usr/local/tomcat/webapps/
补充：如果Jenkins密码忘记了的重置方法：
关闭tomcat /usr/local/tomcat/bin/shutdown.sh
rm -rf /usr/local/tomcat/webapp/jenkins*
rm -rf ~/.jenkins*
cp jenkins.war /usr/local/tomcat/webapps/
启动tomcat即可访问jenkins
启动Tomcat：启动Tomcat会自动解压webapps下的war包：
[root@jenkins-server ~]# /usr/local/tomcat/bin/startup.sh
浏览器登录Jenkins：
http://10.11.67.38:8080/jenkins
```

复制自己的初始密码到页面：

```bash
[root@jenkins-server ~]# cat /root/.jenkins/secrets/initialAdminPassword
30783eda4f2a46c2bb5056d2e4aaf885
```

选择suggested的插件进行下载：
等待插件安装完成：
　　因为网速原因，插件可能下载失败，重试两次(不要重新安装，这样会把已经下载好的插件重新下载)，仍然失败。没关系，把他们记录下来，点击继续，进去之后手动重新安装未安装好的插件
点点点就安装成功了

![image-20220815160422584](jenkins构建持续化集成平台.assets/image-20220815160422584.png)



![image-20220815160434975](jenkins构建持续化集成平台.assets/image-20220815160434975.png)



![image-20220815160446804](jenkins构建持续化集成平台.assets/image-20220815160446804.png)



![image-20220815160454586](jenkins构建持续化集成平台.assets/image-20220815160454586.png)

如果这个页面过一会消失了。并且常时间空白。可能需要你登录了。换个浏览器，打开相同的地址就会出现认证页面。



![image-20220815160503841](jenkins构建持续化集成平台.assets/image-20220815160503841.png)

![image-20220815160511469](jenkins构建持续化集成平台.assets/image-20220815160511469.png)

# 四、Jenkins插件管理

Deploy to container
Maven Integration
GitHub Authentication
GitHub Branch Source
GitHub Organization Folder
Publish Over SSH

## １、插件管理插件管理简介

我们配置的是 git + maven 方式的 自动化部署 所以git和maven的相关插件是必须的 还有一个ssh用于机器间的文件传送。安装的过程请耐心等待

## ２、安装插件Deploy to container

作用：
支持自动化将代码部署到tomcat容器
安装过程：
　　系统管理–>插件管理–>可选插件–>过滤Deploy to container–>勾选，点击下边的按钮：直接安装，这个可能时间较久，等待即可（过滤不到就换个过滤项继续过滤，也许已经安装了）
![image-20220815160521600](jenkins构建持续化集成平台.assets/image-20220815160521600.png)

![image-20220815160528591](jenkins构建持续化集成平台.assets/image-20220815160528591.png)

## ３、安装插件Maven Integration

作用：
jenkins 利用maven编译，打包，所需插件
安装过程：同第一个插件

## ４、安装git相关3个插件GIT plugin(过程一样)

GitHub Authentication
GitHub Branch Source
GitHub Organization Folder

![image-20220815160537269](jenkins构建持续化集成平台.assets/image-20220815160537269.png)



## ５、安装和SSH相关的插件

Publish Over SSH

![image-20220815160547155](jenkins构建持续化集成平台.assets/image-20220815160547155.png)



# 五、检查错误配置

左侧：点击“系统管理”
１、如果有“编码问题”错误，在Tomcat–>conf–>server.xml文件中修改即可

[root@localhost ~]# head -1 /usr/local/tomcat/conf/server.xml
２、如果有”反向代理设置有误“错误，请忽略

# 六、Jenkins系统设置

这里没有强调的都设置为默认即可
系统管理->（全局工具配置）Global Tool Configuration,配置jdk,git,maven的根目录
１、找到全局配置工具

![image-20220815160556059](jenkins构建持续化集成平台.assets/image-20220815160556059.png)

![image-20220815160604061](jenkins构建持续化集成平台.assets/image-20220815160604061.png)

## ２、配置JDK目录

![image-20220815160612264](jenkins构建持续化集成平台.assets/image-20220815160612264.png)



## ３、配置GIT目录

![image-20220815160620458](jenkins构建持续化集成平台.assets/image-20220815160620458.png)



## ４、配置maven并保存

![image-20220815160628203](jenkins构建持续化集成平台.assets/image-20220815160628203.png)

![image-20220815160636287](jenkins构建持续化集成平台.assets/image-20220815160636287.png)

## ５、关于Jenkins设置中文语言

![image-20220815160643103](jenkins构建持续化集成平台.assets/image-20220815160643103.png)

![image-20220815160650285](jenkins构建持续化集成平台.assets/image-20220815160650285.png)

６、关于Jenkins重启

http://192.168.43.114:8080/jenkins/restart
http://192.168.43.114:8080/jenkins/exit
http://192.168.43.114:8080/jenkins/reload

# 七、SSH设置

１、SSH设置的目的

jenkins服务器(10.11.67.38)上的maven将开发产生的*.war包。通过SSH自动推送到远程tomcat服务器上(10.11.67.42)需要手工配置ssh key。配合自动化推送
　　10.11.67.38　4G内存的Centos7部署Jenkins
　　10.11.67.42　2G内存的Centos7部署Tomcat（业务主机）
２、Jenkins服务器准备秘钥认证

```bash
[root@jenkins-server ~]# ssh-keygen
[root@jenkins-server ~]# ssh-copy-id -i 10.11.67.42
[root@jenkins-server ~]# ssh 10.11.67.42
Jenkins-server登录Tomcat业务主机不需要密码即可
准备SSH私钥，把私钥上传服务器
[root@jenkins-server ~]# cat ~/.ssh/id_rsa
```

![image-20220815160705027](jenkins构建持续化集成平台.assets/image-20220815160705027.png)

![image-20220815160714879](jenkins构建持续化集成平台.assets/image-20220815160714879.png)

# 八、最重要的浏览器点点点新增任务

## １、创建任务

![image-20220815160721386](jenkins构建持续化集成平台.assets/image-20220815160721386.png)

## ２、定义名称和类型

![image-20220815160728706](jenkins构建持续化集成平台.assets/image-20220815160728706.png)

## ３、设置maven(共有GIT仓库)

设置描述
![image-20220815160735695](jenkins构建持续化集成平台.assets/image-20220815160735695.png)

选择版本控制器和仓库地址
![image-20220815160743464](jenkins构建持续化集成平台.assets/image-20220815160743464.png)

设置触发器
![image-20220815160751186](jenkins构建持续化集成平台.assets/image-20220815160751186.png)

设置构建(编译打包)

![image-20220815160758847](jenkins构建持续化集成平台.assets/image-20220815160758847.png)

在构建后设置中 选择：(send build artifacts over ssh)通过SSH发送构建工件

![image-20220815160805310](jenkins构建持续化集成平台.assets/image-20220815160805310.png)


![image-20220815160812403](jenkins构建持续化集成平台.assets/image-20220815160812403.png)



应用保存即可，下面是参数说明
![image-20220815160819098](jenkins构建持续化集成平台.assets/image-20220815160819098.png)

# 九、新增任务之后，构建任务



## １、立即构建

![image-20220815160829120](jenkins构建持续化集成平台.assets/image-20220815160829120.png)

![image-20220815160835052](jenkins构建持续化集成平台.assets/image-20220815160835052.png)
![image-20220815160842435](jenkins构建持续化集成平台.assets/image-20220815160842435.png)

## ２、查构建结果

果

在这里插入图片描述

出错也在这里看

```bash
Started by user kakaops
Started by user kakaops
Running as SYSTEM
Building in workspace /root/.jenkins/workspace/kakaops-job
The recommended git tool is: NONE
No credentials specified
```


```bash
/usr/local/git/bin/git rev-parse --is-inside-work-tree # timeout=10
Fetching changes from the remote Git repository
/usr/local/git/bin/git config remote.origin.url https://github.com/bingyue/easy-springmvc-maven # timeout=10
Fetching upstream changes from https://github.com/bingyue/easy-springmvc-maven
/usr/local/git/bin/git --version # timeout=10
git --version # ‘git version 2.9.5’
/usr/local/git/bin/git fetch --tags --progress – https://github.com/bingyue/easy-springmvc-maven +refs/heads/:refs/remotes/origin/ # timeout=10
/usr/local/git/bin/git rev-parse refs/remotes/origin/master^{commit} # timeout=10
Checking out Revision 67604f7f9f30505e3bb3e8935c745154f04aa372 (refs/remotes/origin/master)
/usr/local/git/bin/git config core.sparsecheckout # timeout=10
/usr/local/git/bin/git checkout -f 67604f7f9f30505e3bb3e8935c745154f04aa372 # timeout=10
Commit message: “修改standard/1.1.2的依赖”
/usr/local/git/bin/git rev-list --no-walk 67604f7f9f30505e3bb3e8935c745154f04aa372 # timeout=10
Parsing POMs
Established TCP socket on 45997
[kakaops-job] $ /usr/local/jdk/bin/java -cp /root/.jenkins/plugins/maven-plugin/WEB-INF/lib/maven35-agent-1.13.jar:/usr/local/maven/boot/plexus-classworlds-2.5.2.jar:/usr/local/maven/conf/logging jenkins.maven3.agent.Maven35Main /usr/local/maven /usr/local/tomcat/webapps/jenkins/WEB-INF/lib/remoting-4.5.jar /root/.jenkins/plugins/maven-plugin/WEB-INF/lib/maven35-interceptor-1.13.jar /root/.jenkins/plugins/maven-plugin/WEB-INF/lib/maven3-interceptor-commons-1.13.jar 45997
<=[JENKINS REMOTING CAPACITY]=>channel started
Executing Maven: -B -f /root/.jenkins/workspace/kakaops-job/pom.xml clean package -Dmaven.test.skip=true
[INFO] Scanning for projects…
[WARNING]
[WARNING] Some problems were encountered while building the effective model for springmvc-maven:easy-springmvc-maven:war:0.0.1-SNAPSHOT
[WARNING] ‘build.plugins.plugin.version’ for org.apache.maven.plugins:maven-war-plugin is missing. @ line 22, column 15
[WARNING]
[WARNING] It is highly recommended to fix these problems because they threaten the stability of your build.
[WARNING]
[WARNING] For this reason, future Maven versions might no longer support building such malformed projects.
[WARNING]
[INFO]
[INFO] ----------------< springmvc-maven:easy-springmvc-maven >----------------
[INFO] Building springmvc-maven 0.0.1-SNAPSHOT
[INFO] --------------------------------[ war ]---------------------------------
[INFO]
[INFO] — maven-clean-plugin:2.5:clean (default-clean) @ easy-springmvc-maven —
[INFO] Deleting /root/.jenkins/workspace/kakaops-job/target
[INFO]
[INFO] — maven-resources-plugin:2.6:resources (default-resources) @ easy-springmvc-maven —
[INFO] Using ‘UTF-8’ encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /root/.jenkins/workspace/kakaops-job/src/main/resources
[INFO]
[INFO] — maven-compiler-plugin:3.1:compile (default-compile) @ easy-springmvc-maven —
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 2 source files to /root/.jenkins/workspace/kakaops-job/target/classes
[INFO]
[INFO] — maven-resources-plugin:2.6:testResources (default-testResources) @ easy-springmvc-maven —
[INFO] Not copying test resources
[INFO]
[INFO] — maven-compiler-plugin:3.1:testCompile (default-testCompile) @ easy-springmvc-maven —
[INFO] Not compiling test sources
[INFO]
[INFO] — maven-surefire-plugin:2.12.4:test (default-test) @ easy-springmvc-maven —
[INFO] Tests are skipped.
[INFO]
[INFO] — maven-war-plugin:2.2:war (default-war) @ easy-springmvc-maven —
[INFO] Packaging webapp
[INFO] Assembling webapp [easy-springmvc-maven] in [/root/.jenkins/workspace/kakaops-job/target/easy-springmvc-maven]
[INFO] Processing war project
[INFO] Copying webapp resources [/root/.jenkins/workspace/kakaops-job/src/main/webapp]
[INFO] Webapp assembled in [122 msecs]
[INFO] Building war: /root/.jenkins/workspace/kakaops-job/target/easy-springmvc-maven.war
[INFO] WEB-INF/web.xml already added, skipping
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 5.713 s
[INFO] Finished at: 2020-10-31T18:06:26+08:00
[INFO] ------------------------------------------------------------------------
Waiting for Jenkins to finish collecting data
[JENKINS] Archiving /root/.jenkins/workspace/kakaops-job/pom.xml to springmvc-maven/easy-springmvc-maven/0.0.1-SNAPSHOT/easy-springmvc-maven-0.0.1-SNAPSHOT.pom
[JENKINS] Archiving /root/.jenkins/workspace/kakaops-job/target/easy-springmvc-maven.war to springmvc-maven/easy-springmvc-maven/0.0.1-SNAPSHOT/easy-springmvc-maven-0.0.1-SNAPSHOT.war
channel stopped
SSH: Connecting from host [jenkins-server]
SSH: Connecting with configuration [tomcat] …
SSH: EXEC: completed after 215 ms
SSH: Disconnecting configuration [tomcat] …
SSH: Transferred 1 file(s)
Finished: SUCCESS
```

# 十、排错

问题1：jenkins访问一直处于等待状态

![image-20220815160857515](jenkins构建持续化集成平台.assets/image-20220815160857515.png)
tomcat日志显示如下信息：

```bash
[root@jenkins logs]# tail -f /usr/local/tomcat/logs/catalina.out
WARNING [Handling GET /jenkins/login from 10.0.0.174 : http-nio-8080-exec-3 HudsonIsLoading/index.jelly] org.apache.catalina.webresources.Cache.getResource Unable to add the resource at [/WEB-INF/classes/lib/layout/breadcrumbs.jelly] to the cache for web application [/jenkins] because there was insufficient free space available after evicting expired cache entries - consider increasing the maximum size of the cache
```



只要在$CATALINA_BASE/conf/context.xml里增加资源最大可缓存的大小就行了，大小可按自己的需要定义

\#vim /usr/local/tomcat/conf/context.xml

```xml
<Context>

<!-- Default set of monitored resources. If one of these changes, the    -->
<!-- web application will be reloaded.                                   -->
<WatchedResource>WEB-INF/web.xml</WatchedResource>
<WatchedResource>WEB-INF/tomcat-web.xml</WatchedResource>
<WatchedResource>${catalina.base}/conf/web.xml</WatchedResource>
<Resources
    cachingAllowed="true"
    cacheMaxSize="100000"
/>
</Context>

```

最后重起tomcat，问题解决！

## 问题2：剩余内存必须大于2G

tomcat启动之前的内存：
 ![在这里插入图片描述](jenkins构建持续化集成平台.assets/20201031184908194.png)
 tomcat启动之后的内存：
 ![在这里插入图片描述](jenkins构建持续化集成平台.assets/20201031184930141.png)

## 问题3：插件下载后继续下面初始化完成点开始的时候跳到一个空白页面

解决：点击地址栏左边的后退按钮即可进入正常页面

![image-20220815160942062](jenkins构建持续化集成平台.assets/image-20220815160942062.png)
 接着上面的错误，返回之后虽然进入正常界面，但是会有如下提示：
![image-20220815160952953](jenkins构建持续化集成平台.assets/image-20220815160952953.png)
 手动安装这些插件

## 问题4：脚本权限

![image-20220815161015100](jenkins构建持续化集成平台.assets/image-20220815161015100.png)
 尝试修改构建后脚本的权限



问题5：构建个人的github库时，缺失pom文件

可以用公共库中拷贝，传到自己的GitHub上。
![在这里插入图片描述](jenkins构建持续化集成平台.assets/20201031185221622.png)



# 解决jenkins报错：AWT is not properly configured on this server

```bash
#Ubuntu9以上
apt-get install ttf-dejavu

#CentOS 6
yum install dejavu-sans-fonts

#CentOS 7
yum install fontconfig

```

