# Tomcat构建企业级高负载服务器

## 前言

### 什么是JAVA虚拟机

    所谓虚拟机，就是一台虚拟的计算机。他是一款软件，用来执行一系列虚拟计算机指令。大体上，虚拟机可以分为系统虚拟机和程序虚拟机。大名鼎鼎的VisualBox、VMware就属于系统虚拟机。他们完全是对物理计算机的仿真。提供了一个可以运行完整操作系统的软件平台。
    程序虚拟机的典型代表就是Java虚拟机，它专门为执行单个计算机程序而设计，在Java虚拟机中执行的指令我们称为Java字节码指令。无论是系统虚拟机还是程序虚拟机，在上面运行的软件都呗限制于虚拟机提供的资源中。

### JAVA 如何做到跨平台

    同一个JAVA程序(JAVA字节码的集合)，通过JAVA虚拟机(JVM)运行于各大主流操作系统平台比如Windows、CentOS、Ubuntu等。程序以虚拟机为中介，来实现跨平台。
![img](Tomcat构建企业级高负载服务器.assets\1.png)

## Tomcat部署

官网地址

    tomcat下载地址
    http://tomcat.apache.org/
    
    JDK下载地址
    http://www.oracle.com/technetwork/java/javase/downloads/index.html

### 部署

#### 一、Tomcat Http Server

环境

```
5到8G内存
```

1. 部署JAVA环境

提示
建议卸载默认安装openjdk软件
①解压安装包

tar xf jdk-8u151-linux-x64.tar.gz -C /usr/local
②多版本部署java

ln -s /usr/local/jdk1.8.0_151/ /usr/local/java


3配置环境变量

```bash
vim /etc/profile
		JAVA_HOME=/usr/local/java
		PATH=$JAVA_HOME/bin:$PATH
		export JAVA_HOME PATH
source /etc/profile
env |grep JAVA
		JAVA_HOME=/usr/local/java
```

在这里插入图片描述
4测试java

```bash
java -version

java version "1.8.0_151"Java(TM) SE Runtime Environment (build 1.8.0_151-b12)Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)
```



2. 安装Tomcat:

```bash
tar xf apache-tomcat-7.0.42.tar.gz  -C /usr/local/
ln -s /usr/local/apache-tomcat-7.0.42/ /usr/local/tomcat
```

定义Tomcat所需环境变量:
vim /etc/profile	

```bash
CATALINA_HOME=/usr/local/tomcat    //Tomcat安装目录
export CATALINA_HOME

source /etc/profile
```

在这里插入图片描述
3.启动Tomcat

```bash
启动tomcat
#bash /usr/local/tomcat/bin/startup.sh

检查端口
# netstat -tnlp |grep java
[root@tomcat ~]# netstat -tlunp | grep java
tcp6       0      0 :::8080                 :::*                    LISTEN      10180/java          
tcp6       0      0 127.0.0.1:8005          :::*                    LISTEN      10180/java  


关于tomcat端口：
8005

是tomcat本身的端口
8080

tomcat负责建立HTTP连接。在通过浏览器访问Tomcat服务器的Web应用时，使用的就是这个连接器。　
8009

tomcat负责和其他的HTTP服务器建立连接。
如nginx和apache互通时使用
```

访问
	http://192.168.0.104:8080/
		注意服务器地址，注意端口
	浏览器访问tomcat主页。注意关闭防火墙
关闭tomcat（切记，否则你会遇见500）
	

    #bash  /usr/local/tomcat/bin/shutdown.sh

在这里插入图片描述在这里插入图片描述
4.关于tomcat

```bash
[root@web ~]# cd /usr/local/tomcat/
[root@web tomcat]# tree -L 1
.
├── bin              #存放tomcat管理脚本
├── conf             # tomcat 配置文件存放目录
├── lib              # web应用调用的jar包存放路径
├── LICENSE
├── logs        # tomcat 日志存放目录，catalina.out 为主要输出日志
├── NOTICE
├── RELEASE-NOTES
├── RUNNING.txt
├── temp             # 存放临时文件
├── webapps         # web程序存放目录
└── work             # 存放编译产生的.java 与 .class文件


[root@web03 tomcat]# cd webapps/
[root@web03 webapps]# tree -L 1
.
├── docs            # tomcat 帮助文档
├── examples       # web应用示例
├── host-manager  # 主机管理
├── manager         # 管理
└── ROOT             # 默认站点根目录

默认网站的主目录（主页）
ls /usr/local/tomcat/webapps/ROOT

[root@web03 conf]# tree -L 1
.
├── Catalina
├── catalina.policy
├── catalina.properties
├── context.xml
├── logging.properties
├── logs
├── server.xml           # tomcat 主配置文件
├── server.xml.bak
├── server.xml.bak2
├── tomcat-users.xml    # tomcat 管理用户配置文件
├── tomcat-users.xsd
└── web.xml

```

#### 二、安装MySQL

1.创建数据库：

```bash
创建jspgou数据库，字符集为utf-8
yum install -y mariadb-server mariadb
该步骤出错。请您检查YUM源配置

systemctl start mariadb
[root@localhost ~]# mysqladmin -u root password 123
	注意如果有密码
	mysqladmin -u root -p老密码 password 新密码
[root@localhost ~]# mysql -u root -p123
MariaDB [(none)]> create database jspgou character set = utf8;

```

#### 三、部署jspgou（电子商城）

1.解压源码包
unzip jspgouV6-ROOT.zip在这里插入图片描述
2.更改数据库链接：

提示：在解压缩后的文件中，修改连接数据库的信息


    [root@localhost ~]# vim ROOT/WEB-INF/config/jdbc.properties
    jdbc.url=jdbc:mysql://127.0.0.1:3306/jspgou?characterEncoding=UTF-8
    jdbc.username=root
    jdbc.password=123

3.导入数据：

[root@localhost ~]# mysql -u root -p123 -D jspgou < DB/jspgou.sql

    使用MYSQL数据库时，会发生的错误
    使用mysql作为数据库时，如果导入数据失败
    1.修改mysql配置文件
    my.cnf中max_allowed_packet参数为64m，默认为1m
    2.DB/jspgou.sql里面的默认值改一下
    把所有datetime类型的字段默认值改成CURRENT_TIMESTAMP
    将程序解压后的ROOT文件夹,拷贝到tomcat安装目录下的webapps文件夹下
    [root@localhost ~]# \cp -r ROOT /usr/local/tomcat/webapps/
    不使用cp 的别名。 alias cp=‘cp -i’


4.部署网站：

	启动tomcat
	#bash /usr/local/tomcat/bin/startup.sh
	输入以下地址
	http://192.168.75.226:8080/jeeadmin/jspgou/index.do
	注意服务器地址
	用户名：admin
	密 码：123456
	点击上图右上角浏览器图标访问网站首页



## Tomcat多实例

关闭主站

    bash /usr/local/tomcat/bin/shutdown.sh

准备多实例主目录

    mkdir /usr/local/tomcat/instance{1…3} 

制作实例工作目录

    cp -r /usr/local/tomcat/{conf,logs,temp,work} /usr/local/tomcat/instance1/
    # cp -r /usr/local/tomcat/{conf,logs,temp,work} /usr/local/tomcat/instance2/
    # cp -r /usr/local/tomcat/{conf,logs,temp,work} /usr/local/tomcat/instance3/
    查看目录结构
    [root@www ~]# tree -d -L 2 /usr/local/tomcat/
    [root@tomcat tomcat]#  tree -d -L 2 /usr/local/tomcat/
    /usr/local/tomcat/
    ├── bin
    ├── conf
    │   └── Catalina
    ├── instance1
    │   ├── conf
    │   ├── logs
    │   ├── temp
    │   └── work
    ├── instance2
    │   ├── conf
    │   ├── logs
    │   ├── temp
    │   └── work
    ├── instance3
    │   ├── conf
    │   ├── logs
    │   ├── temp
    │   └── work
    ├── lib
    ├── logs
    ├── temp
    ├── webapps
    │   ├── docs
    │   ├── examples
    │   ├── host-manager
    │   ├── manager
    │   └── ROOT
    └── work
        └── Catalina
    
    29 directories


修改端口
将web配置文件拷贝三份。分别修改为不同端口

```bash
vim /usr/local/tomcat/instance1/conf/server.xml
服务端口 8080 替换成 8081
修改前
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />

修改后
    <Connector port="8081" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />


程序工作端口：8005替换成 8091
修改前
<Server port="8005" shutdown="SHUTDOWN">

修改后
<Server port="8091" shutdown="SHUTDOWN">


网站目录：webapps 替换成 另一个目录
     <Host name="localhost"  appBase="webapps"

修改后
     <Host name="localhost"  appBase="/webapps"

其他两个也相应不同修改在这里插入图片描述
[root@tomcat tomcat]# vim /usr/local/tomcat/instance1/conf/server.xml
[root@tomcat tomcat]# cp instance1/conf/server.xml instance2/conf/
cp: overwrite ‘instance2/conf/server.xml’? y
[root@tomcat tomcat]# cp instance1/conf/server.xml instance3/conf/
cp: overwrite ‘instance3/conf/server.xml’? y
[root@tomcat tomcat]# 

```

启动脚本
vim /usr/local/tomcat/instance1/ins1.sh

```bash
#!/bin/bash
#instance1
. /etc/init.d/functions
export CATALINA_BASE="/usr/local/tomcat/instance1"

case "$1" in
start)
        $CATALINA_HOME/bin/startup.sh
        ;;
stop)
        $CATALINA_HOME/bin/shutdown.sh
        ;;
restart)
        $CATALINA_HOME/bin/shutdown.sh
        sleep 5
        $CATALINA_HOME/bin/startup.sh
        ;;
esac
export JAVA_OPTS='-Xms64m -Xmx128m'
```

vim /usr/local/tomcat/instance2/ins2.sh

```bash
#!/bin/bash
#instance2              #####
. /etc/init.d/functions
export CATALINA_BASE="/usr/local/tomcat/instance2"    #####

case "$1" in
start)
        $CATALINA_HOME/bin/startup.sh
        ;;
stop)
        $CATALINA_HOME/bin/shutdown.sh
        ;;
restart)
        $CATALINA_HOME/bin/shutdown.sh
        sleep 5
        $CATALINA_HOME/bin/startup.sh
        ;;
esac
```

vim /usr/local/tomcat/instance3/ins3.sh

```bash
#!/bin/bash
#instance3
. /etc/init.d/functions
export CATALINA_BASE="/usr/local/tomcat/instance3"

case "$1" in
start)
        $CATALINA_HOME/bin/startup.sh
        ;;
stop)
        $CATALINA_HOME/bin/shutdown.sh
        ;;
restart)
        $CATALINA_HOME/bin/shutdown.sh
        sleep 5
        $CATALINA_HOME/bin/startup.sh
        ;;
esac
export JAVA_OPTS='-Xms64m -Xmx128m'
```



赋权

    chmod +x /usr/local/tomcat/instance1/ins1.sh
     chmod +x /usr/local/tomcat/instance2/ins2.sh
    chmod +x /usr/local/tomcat/instance3/ins3.sh

网站源码

    mkdir /webapps
    cp -r /usr/local/tomcat/webapps/ROOT/ /webapps/

启动

    /usr/local/tomcat/instance1/ins1.sh start
     /usr/local/tomcat/instance2/ins2.sh start
     /usr/local/tomcat/instance3/ins3.sh start
    等5秒

测试

    netstat -antp | grep 8081
    在这里插入图片描述

浏览

    http://192.168.75.226:8081
    http://192.168.75.226:8082
    http://192.168.75.226:8083
## JVM常用分析工具

![image-20211110215222063](Tomcat构建企业级高负载服务器.assets\image-20211110215222063.png)



命令行工具

### jps

Java虚拟机进程状态工具

    jps [options] [hostid]
      -q 显示进程ID
      -m 显示进程ID、主类名、传入主方法的参数
      -l 显示进程ID、全类名
      -v 显示进程ID、主类名、虚拟机参数
      -V 显示进程ID、主类名【默认】

### jstat

Java虚拟机统计监控工具

    jstat [ generalOption | outputOptions vmid [ interval [ s|ms ] [ count ] ] ]
      -generalOption通用信息，可传入-help(显示帮助信息) -version(显示版本信息[测试过，无效]) -options(显示可用的统计选项)
          -outputOptions一个或者多个输出选项，常用的如
          -class 类加载的统计信息
          -complier 即时编译器统计信息
      -gc 垃圾收集器统计
      -vmid 本地虚拟机进程的话，则为对应进程ID(可通过jps查进程ID)。另外，也可以查看远程虚拟机进程
      -interval 统计的时间间隔，默认为微秒
      -count 总共统计次数

案例

~ jstat -class 1251

    ➜  ~ jstat -class 1251
    加载的类 加载类的总大小   卸载的类     卸载类的总大小		 类加载和卸载总花费时间
    Loaded  Bytes  				Unloaded  	Bytes     			Time   
      4426  8085.9      	182   			214.5       		5.79

~ jstat -gc 1251

    ➜  ~ jstat -gc 1251
     S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
     0.0    0.0    0.0    0.0   11264.0   2048.0   16384.0     7254.0   27440.0 26286.1 3200.0 2789.7      7    0.072  13      0.360    0.433
    
     各列含义：
    |SOC    | 幸存区0大小(KB)|
    |S1C    | 幸存区1大小(KB)|
    |S0U    | 幸存区0使用大小(KB)|
    |S1U    | 幸存区1使用大小(KB)|
    |EC     | eden区空间大小(KB)|
    |EU     | eden区空间使用大小(KB)|
    |OC     | 老年代大小(KB)|
    |OU     | 老年代使用大小(KB)|
    |MC     | 元空间大小(KB)-1.8版本之后，用于存放方法区数据|
    |MU     | 元空间使用大小(KB)|
    |CCSC   | 压缩类空间大小(KB)|
    |CCSU   | 压缩类空间使用大小(KB)|
    |PC     | 永久区大小(KB)|
    |PU     | 永久区使用大小(KB)|
    |YGC    | 发生young GC次数|
    |YGCT   | young GC所使用时间|
    |FGC    | 发生full GC次数|
    |FGCT   | full GC所使用时间|
    |GCT    | 总共垃圾回收时间|

~ jstat -gcutil 1251

    ➜  ~ jstat -gcutil 1251
      S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT   
      0.00   0.00  27.27  44.27  95.79  87.18      7    0.072    13    0.360    0.433
    
     各列含义：
    |S0     | 幸存区0使用百分比|
    |S1     | 幸存区1使用百分比|
    |E      | eden区使用百分比|
    |O      | 老年代使用百分比|
    |M      | 元空间使用百分比|
    |CCS    | 压缩类空间使用百分比|
    |YGC    | 发生young GC次数|
    |YGCT   | young GC所使用时间|
    |FGC    | 发生full GC次数|
    |FGCT   | full GC所使用时间|
    |GCT    | 总共垃圾回收时间|

### jinfo

打印配置信息【重点其实是可以动态设置虚拟机参数】



    jinfo [ option ] pid
      -flags 可以动态的设置或者取消或者变更JVM参数
      默认输出系统属性、JVM信息(官方目前推荐用jcmd替代jinfo，以减少影响当前进程性能)

案例

jinfo 6564(这个命令jdk1.8报各种错，暂未解决)

```bash
➜  ~ jinfo 6564
Java System Properties:
#Mon Mar 23 23:47:56 CST 2020
gopherProxySet=false
socksProxyHost=127.0.0.1
awt.toolkit=sun.lwawt.macosx.LWCToolkit
http.proxyHost=127.0.0.1
java.specification.version=11
sun.cpu.isalist=
sun.jnu.encoding=UTF-8
java.class.path=/Users/laicreasy/github/peach/classical/target/test-classes\:/Users/laicreasy/github/peach/classical/target/classes\:/Users/laicreasy/.m2/repository/junit/junit/4.13/junit-4.13.jar\:/Users/laicreasy/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar\:/Users/laicreasy/.m2/repository/org/apache/logging/log4j/log4j-api/2.13.1/log4j-api-2.13.1.jar\:/Users/laicreasy/.m2/repository/org/apache/logging/log4j/log4j-core/2.13.1/log4j-core-2.13.1.jar
https.proxyPort=8001
java.vm.vendor=Oracle Corporation
sun.arch.data.model=64
java.vendor.url=http\://java.oracle.com/
user.timezone=Asia/Shanghai
java.vm.specification.version=11
os.name=Mac OS X
sun.java.launcher=SUN_STANDARD
user.country=CN
sun.boot.library.path=/Library/Java/JavaVirtualMachines/jdk-11.0.5.jdk/Contents/Home/lib
sun.java.command=com.creasy.Concurrency
jdk.debug=release
sun.cpu.endian=little
user.home=/Users/laicreasy
user.language=en
java.specification.vendor=Oracle Corporation
java.version.date=2019-10-15
java.home=/Library/Java/JavaVirtualMachines/jdk-11.0.5.jdk/Contents/Home
file.separator=/
https.proxyHost=127.0.0.1
java.vm.compressedOopsMode=Zero based
line.separator=\n
java.specification.name=Java Platform API Specification
java.vm.specification.vendor=Oracle Corporation
java.awt.graphicsenv=sun.awt.CGraphicsEnvironment
sun.management.compiler=HotSpot 64-Bit Tiered Compilers
java.runtime.version=11.0.5+10-LTS
user.name=laicreasy
path.separator=\:
os.version=10.15.2
java.runtime.name=Java(TM) SE Runtime Environment
file.encoding=UTF-8
java.vm.name=Java HotSpot(TM) 64-Bit Server VM
java.vendor.version=18.9
java.vendor.url.bug=http\://bugreport.java.com/bugreport/
java.io.tmpdir=/var/folders/w9/1vphl83x0rz54l_x9p118n5w0000gn/T/
java.version=11.0.5
user.dir=/Users/laicreasy/github/peach/classical
os.arch=x86_64
socksProxyPort=1081
java.vm.specification.name=Java Virtual Machine Specification
java.awt.printerjob=sun.lwawt.macosx.CPrinterJob
sun.os.patch.level=unknown
java.library.path=/Users/laicreasy/Library/Java/Extensions\:/Library/Java/Extensions\:/Network/Library/Java/Extensions\:/System/Library/Java/Extensions\:/usr/lib/java\:.
java.vendor=Oracle Corporation
java.vm.info=mixed mode
java.vm.version=11.0.5+10-LTS
sun.io.unicode.encoding=UnicodeBig
java.class.version=55.0
http.proxyPort=8001

VM Flags:
-XX:CICompilerCount=3 -XX:ConcGCThreads=1 -XX:G1ConcRefinementThreads=4 -XX:G1HeapRegionSize=1048576 -XX:GCDrainStackTargetSize=64 -XX:InitialHeapSize=134217728 -XX:MarkStackSize=4194304 -XX:MaxHeapSize=2147483648 -XX:MaxNewSize=1287651328 -XX:MinHeapDeltaBytes=1048576 -XX:NonNMethodCodeHeapSize=5830732 -XX:NonProfiledCodeHeapSize=122913754 -XX:ProfiledCodeHeapSize=122913754 -XX:ReservedCodeCacheSize=251658240 -XX:+SegmentedCodeCache -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseG1GC 

VM Arguments:
jvm_args: -javaagent:/Applications/IntelliJ IDEA.app/Contents/lib/idea_rt.jar=49825:/Applications/IntelliJ IDEA.app/Contents/bin -Dfile.encoding=UTF-8 
java_command: com.creasy.Concurrency
java_class_path (initial): /Users/laicreasy/github/peach/classical/target/test-classes:/Users/laicreasy/github/peach/classical/target/classes:/Users/laicreasy/.m2/repository/junit/junit/4.13/junit-4.13.jar:/Users/laicreasy/.m2/repository/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar:/Users/laicreasy/.m2/repository/org/apache/logging/log4j/log4j-api/2.13.1/log4j-api-2.13.1.jar:/Users/laicreasy/.m2/repository/org/apache/logging/log4j/log4j-core/2.13.1/log4j-core-2.13.1.jar
Launcher Type: SUN_STANDARD
```

### jmap

查看堆内存信息，可以生成dump文件

    jmap [ option ] pid
    常用如
    	jmap -heap pid显示堆配置和使用情况
    	jmap -clstats <pid>显示类加载器信息
        jmap -finalizerinfo <pid>打印等会finalization的对象信息
        jmap -histo[:live] <pid>堆中对象的统计，如果加上了[:live]，那么只统计当前存活的对象
        jmap -dump:<dump-options> <pid>生成堆转储快照
    	    dump-options:
      	    -live        只包括当前存活的对象
        	-format=b     二进制格式
          	-file=<file>  保存的文件名

案例

~ jhsdb jmap --heap --pid 7157(jdk11下，jmap -heap pid无效)

    ➜  ~ jhsdb jmap --heap --pid 7157
    Attaching to process ID 7157, please wait...
    Debugger attached successfully.
    Server compiler detected.
    JVM version is 11.0.5+10-LTS
    
    using thread-local object allocation.
    Garbage-First (G1) GC with 4 thread(s)
    
    Heap Configuration:
       MinHeapFreeRatio         = 40
       MaxHeapFreeRatio         = 70
       MaxHeapSize              = 2147483648 (2048.0MB)
       NewSize                  = 1363144 (1.2999954223632812MB)
       MaxNewSize               = 1287651328 (1228.0MB)
       OldSize                  = 5452592 (5.1999969482421875MB)
       NewRatio                 = 2
       SurvivorRatio            = 8
       MetaspaceSize            = 21807104 (20.796875MB)
       CompressedClassSpaceSize = 1073741824 (1024.0MB)
       MaxMetaspaceSize         = 17592186044415 MB
       G1HeapRegionSize         = 1048576 (1.0MB)
    
    Heap Usage:
    G1 Heap:
       regions  = 2048
       capacity = 2147483648 (2048.0MB)
       used     = 3145728 (3.0MB)
       free     = 2144337920 (2045.0MB)
       0.146484375% used
    G1 Young Generation:
    Eden Space:
       regions  = 4
       capacity = 15728640 (15.0MB)
       used     = 4194304 (4.0MB)
       free     = 11534336 (11.0MB)
       26.666666666666668% used
    Survivor Space:
       regions  = 0
       capacity = 0 (0.0MB)
       used     = 0 (0.0MB)
       free     = 0 (0.0MB)
       0.0% used
    G1 Old Generation:
       regions  = 0
       capacity = 118489088 (113.0MB)
       used     = 0 (0.0MB)
       free     = 118489088 (113.0MB)
       0.0% used

~ jmap -histo:live 7588

    ➜  ~ jmap -histo:live 7588
    
     num     #instances         #bytes  class name (module)
    -------------------------------------------------------
    
       1:          7610         607736  [B (java.base@11.0.5)
       2:          7069         169656  java.lang.String (java.base@11.0.5)
       3:          1201         146592  java.lang.Class (java.base@11.0.5)
       4:          3640         116480  java.util.HashMap$Node (java.base@11.0.5)
       5:          1166          98920  [Ljava.lang.Object; (java.base@11.0.5)
       6:           379          53792  [Ljava.util.HashMap$Node; (java.base@11.0.5)
       7:            12          50104  [C (java.base@11.0.5)
       8:           332          41120  [I (java.base@11.0.5)
       9:          1232          39424  java.util.concurrent.ConcurrentHashMap$Node (java.base@11.0.5)
      10:           645          25800  java.util.LinkedHashMap$Entry (java.base@11.0.5)
      11:           392          18816  java.util.HashMap (java.base@11.0.5)
      12:            46          17440  [Ljava.util.concurrent.ConcurrentHashMap$Node; (java.base@11.0.5)
      13:           289          13792  [Ljava.lang.String; (java.base@11.0.5)
    ...
     511:             1             16  sun.nio.fs.NativeBuffers$1 (java.base@11.0.5)
     512:             1             16  sun.util.calendar.Gregorian (java.base@11.0.5)
     513:             1             16  sun.util.cldr.CLDRBaseLocaleDataMetaInfo (java.base@11.0.5)
     514:             1             16  sun.util.locale.InternalLocaleBuilder$CaseInsensitiveChar (java.base@11.0.5)
     515:             1             16  sun.util.locale.provider.TimeZoneNameUtility$TimeZoneNameGetter (java.base@11.0.5)
     516:             1             16  sun.util.resources.LocaleData$LocaleDataStrategy (java.base@11.0.5)
     517:             1             16  sun.util.resources.cldr.provider.CLDRLocaleDataMetaInfo (jdk.localedata@11.0.5)
    Total         30567        1623664

~ jmap -dump:live,format=b,file=heap.bin 7588

    ➜  ~ jmap -dump:live,format=b,file=heap.bin 7588 
    Heap dump file created

### jhat

java堆分析工具，上述dump文件可以通过这个工具进行分析。这个工具会启动一个小型http服务器，可以通过浏览器查看分析结果。JDK11已经去掉了这个工具，直接用visual vm可视化工具分析

案例

jhat heap.bin

    ➜  ~ jhat heap.bin
    Reading from heap.bin...
    Dump file created Tue Mar 24 02:06:41 CST 2020
    Snapshot read, resolving...
    Resolving 30513 objects...
    Chasing references, expect 6 dots......
    Eliminating duplicate references......
    Snapshot resolved.
    Started HTTP server on port 7000
    Server is ready.

打开浏览器，http://localhost:7000/ 即可看到分析信息

### jstack

打印线程栈信息，如可用来分析死循环、死锁等

    jstack [ option ] pid
    	-m 打印Java和C++栈信息
    	-l 额外打印关于锁的信息

案例

jstack -l 7588

```bash
➜  ~ jstack -l 7588
2020-03-24 02:38:42
Full thread dump Java HotSpot(TM) 64-Bit Server VM (11.0.5+10-LTS mixed mode):

Threads class SMR info:
_java_thread_list=0x00007fb213e2d690, length=11, elements={
0x00007fb215805800, 0x00007fb21404a800, 0x00007fb21483a000, 0x00007fb21404f000,
0x00007fb21501d800, 0x00007fb214064000, 0x00007fb215018000, 0x00007fb2140d3000,
0x00007fb214943000, 0x00007fb214810000, 0x00007fb214150800
}

"main" #1 prio=5 os_prio=31 cpu=314.71ms elapsed=2576.00s tid=0x00007fb215805800 nid=0x2703 runnable  [0x000070000439c000]
   java.lang.Thread.State: RUNNABLE
	at java.io.FileInputStream.readBytes(java.base@11.0.5/Native Method)
	at java.io.FileInputStream.read(java.base@11.0.5/FileInputStream.java:279)
	at java.io.BufferedInputStream.fill(java.base@11.0.5/BufferedInputStream.java:252)
	at java.io.BufferedInputStream.read(java.base@11.0.5/BufferedInputStream.java:271)
	- locked <0x00000007801261e8> (a java.io.BufferedInputStream)
	at com.creasy.Concurrency.main(Concurrency.java:24)

   Locked ownable synchronizers:
	- None

"Reference Handler" #2 daemon prio=10 os_prio=31 cpu=0.36ms elapsed=2575.95s tid=0x00007fb21404a800 nid=0x3403 waiting on condition  [0x0000700004ab1000]
   java.lang.Thread.State: RUNNABLE
	at java.lang.ref.Reference.waitForReferencePendingList(java.base@11.0.5/Native Method)
	at java.lang.ref.Reference.processPendingReferences(java.base@11.0.5/Reference.java:241)
	at java.lang.ref.Reference$ReferenceHandler.run(java.base@11.0.5/Reference.java:213)

   Locked ownable synchronizers:
	- None

"Finalizer" #3 daemon prio=8 os_prio=31 cpu=0.46ms elapsed=2575.95s tid=0x00007fb21483a000 nid=0x4903 in Object.wait()  [0x0000700004bb4000]
   java.lang.Thread.State: WAITING (on object monitor)
	at java.lang.Object.wait(java.base@11.0.5/Native Method)
	- waiting on <0x00000007801218f8> (a java.lang.ref.ReferenceQueue$Lock)
	at java.lang.ref.ReferenceQueue.remove(java.base@11.0.5/ReferenceQueue.java:155)
	- waiting to re-lock in wait() <0x00000007801218f8> (a java.lang.ref.ReferenceQueue$Lock)
	at java.lang.ref.ReferenceQueue.remove(java.base@11.0.5/ReferenceQueue.java:176)
	at java.lang.ref.Finalizer$FinalizerThread.run(java.base@11.0.5/Finalizer.java:170)

   Locked ownable synchronizers:
	- None

...

"VM Thread" os_prio=31 cpu=150.43ms elapsed=2575.96s tid=0x00007fb214002800 nid=0x4d03 runnable  

"GC Thread#0" os_prio=31 cpu=12.00ms elapsed=2575.99s tid=0x00007fb215005000 nid=0x2d03 runnable  

"GC Thread#1" os_prio=31 cpu=6.44ms elapsed=2425.77s tid=0x00007fb215896000 nid=0x4207 runnable  

"GC Thread#2" os_prio=31 cpu=8.37ms elapsed=2425.77s tid=0x00007fb214075000 nid=0x5f03 runnable  

"G1 Main Marker" os_prio=31 cpu=0.91ms elapsed=2575.99s tid=0x00007fb214022800 nid=0x5203 runnable  

"G1 Conc#0" os_prio=31 cpu=0.04ms elapsed=2575.99s tid=0x00007fb215005800 nid=0x5003 runnable  

"G1 Refine#0" os_prio=31 cpu=0.71ms elapsed=2575.99s tid=0x00007fb215836800 nid=0x3103 runnable  

"G1 Young RemSet Sampling" os_prio=31 cpu=386.00ms elapsed=2575.99s tid=0x00007fb214041800 nid=0x3203 runnable  
"VM Periodic Task Thread" os_prio=31 cpu=2000.79ms elapsed=2575.55s tid=0x00007fb214149800 nid=0x5b03 waiting on condition  

JNI global refs: 18, weak refs: 0
```

### 可视化工具

jconsole

可以监控CPU、内存、线程等情况

~jconsole

![在这里插入图片描述](Tomcat构建企业级高负载服务器.assets\2.png)


reference：

    https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jps.html
    https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstat.html
    https://docs.oracle.com/en/java/javase/11/troubleshoot/diagnostic-tools.html#GUID-CBC97A20-7379-4762-BA17-FB1A560D02E4


## JVM运维使用监控工具

### Visual VM

Visual VM是一款All-in-One的Java分析工具，堆栈信息、线程信息等都可以分析，而且还支持装插件。但jdk1.9之后默认JDK不再支持，可以通过https://visualvm.github.io/download.html这里下载

在1.8环境下执行

~ jvisualvm

![在这里插入图片描述](Tomcat构建企业级高负载服务器.assets\3.png)