## 一、glances介绍

glances是一个基于python语言开发，可以为linux或者UNIX性能提供监视和分析性能数据的功能。glances在用户的终端上显示重要的系统信息，并动态的进行更新，让管理员实时掌握系统资源的使用情况，而动态监控并不会消耗大量的系统资源，比如CPU资源，通常消耗小于2%，glances默认每两秒更新一次数据。同时glances还可以将相同的数据捕获到一个文件，便于以后对报告进行分析和图形绘制，支持的文件格式有.csv电子表格格式和和html格式。

glances可以分析系统的：

- CPU使用率
- 内存使用率
- 内核统计信息和运行队列信息
- 磁盘I/O速度、传输和读/写比率
- 磁盘适配器
- 网络I/O速度、传输和读/写比率
- 页面监控
- 进程监控-消耗资源最多的进程
- 计算机信息和系统资源

## 二、glances安装方式

1. 源码安装
2. 基于pip命令安装
3. 基于epel公网yum源

由于源码安装需要解决大量的依赖包的问题，对于小白同学学习压力较大，所以本文将重点介绍基于yum的安装方法，让大家快速安装，并能及时体验到glances监控的强大和高效。

## 三、基于epel公网源安装glances

由于glances运行需要python环境，所以我们需要首先安装好python环境，这里我给大家使用的是一个脚本安装python3.7.3，目前的最新版本。

#### 3.1、python3.7.3安装脚本

```
#!/bin/bash
# 
#Name: 
#Author: zutuanxue_com
#Created Time: 2019/10/1 11:20
#Release: 
#Description:python 3.7.3安装脚本

#变量
source_url="https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tgz"
source_pkg="Python-3.7.3.tgz"
source_doc="Python-3.7.3"

cpu_count=`egrep "flags" /proc/cpuinfo |wc -l`

#程序
check () {
  [ "$USER" != "root" ]&&echo "need be root so that"&&exit 1
  [ ! -x /usr/bin/wget ]&&echo "not found command: wget"&&exit 1 
}


install_python () {

check

#1、download python source package
if ! (wget $source_url &>/dev/null) ;then
   echo "$source_pkg download fail"
   exit 1
fi
#2、Decompression source package
if [ -f $source_pkg ];then
    tar xf $source_pkg
else
    echo "not found package: $source_pkg"
    exit 1
fi

#3、python install pre
if ! (yum -y install gcc-* openssl-* libffi-devel  curses-devel lm_sensors sqlite-devel &>/dev/null);then
    echo "yum install software package fail"
    exit 1
fi



#4、configure python install env
if [ -d $source_doc ];then
    
 
   #5、python configure
   cd $source_doc
   
   sed -i.bak '212s/#//' Modules/Setup.dist
   sed -i '213s/#//' Modules/Setup.dist
   sed -i '214s/#//' Modules/Setup.dist
   
   echo "python configure...please waiting"
   if ./configure --enable-optimizations --with-openssl=/usr/bin/openssl &>/dev/null ;then
 
           #6、python make 
           echo "python make...please waiting"
           if make -j $cpu_count &>/dev/null ;then
          
                #7、python install
                echo "python install...please waiting"
                if make install & > /dev/null;then
                    echo "$source_doc install success"
                else
                    echo "python make install fail"
                    exit 1
                fi
            else
                echo "python make fail"
                exit 1
            fi
    else
         echo "python configure fail"
         exit 1
    fi
else
   echo "not found $source_doc"
   exit 1
fi


post_install

}

 
#Post-installation settings
post_install () {
#update pip tool
pip3 install --upgrade pip

}


#函数调用

install_python && rm -rf $source_doc
```

#### 3.2、glances 安装

```
[root@manager01 ~]# pip install glances
Collecting glances
  Downloading https://files.pythonhosted.org/packages/32/34/72f9202ad5b7ada314507a50b9ab1fb604d2f468b138679e0a4fedeb91fa/Glances-3.1.0.tar.gz (6.7MB)
     |████████████████████████████████| 6.7MB 659kB/s 
Collecting psutil>=5.3.0 (from glances)
  Downloading https://files.pythonhosted.org/packages/1c/ca/5b8c1fe032a458c2c4bcbe509d1401dca9dda35c7fc46b36bb81c2834740/psutil-5.6.3.tar.gz (435kB)
     |████████████████████████████████| 440kB 575kB/s 
Installing collected packages: psutil, glances
  Running setup.py install for psutil ... done
  Running setup.py install for glances ... done
Successfully installed glances-3.1.0 psutil-5.6.3
```

#### 3.3、温度监控工具安装

```
[root@manager01 ~]# yum -y install lm_sensors
```

#### 3.4、epel公网源安装

```
[root@manager01 ~]# yum install epel* -y
[root@manager01 ~]# yum -y install glances
```

## 四、glances监控

#### 4.1、开启glances监控

```
[root@manager01 ~]# glances
```

![glances_1.png](https://www.zutuanxue.com:8000/static/media/images/2020/12/7/1607301391828.png)

**glances 工作界面的说明 :**
在上图 的上部是 CPU 、Load（负载）、Mem（内存使用）、 Swap（交换分区）的使用情况。在上图的中上部是网络接口、Processes（进程）的使用情况。通常包括如下字段：

```
 %CPU：该进程占用的 CPU 使用率
 %MEM：该进程占用的物理内存和总内存的百分比
 VIRT: 虚拟内存大小
 RES: 进程占用的物理内存值
 PID: 进程 ID 号
 USER: 进程所有者的用户名
 NI: 进程优先级
 S: 进程状态，其中 S 表示休眠，R 表示正在运行，Z 表示僵死状态。
 TIME+: 该进程启动后占用的总的 CPU 时间
 IO_R 和 IO_W: 进程的读写 I/O 速率
 Command: 进程名称
```

在上图的左侧是网络、磁盘IO、磁盘分区使用情况。 另外 glances 可以使用交互式的方式运行该工具，用户可以使用如下快捷键：

```
 h ： 显示帮助信息
 q ： 离开程序退出
 c ：按照 CPU 实时负载对系统进程进行排序
 m ：按照内存使用状况对系统进程排序
 i：按照 I/O 使用状况对系统进程排序
 p： 按照进程名称排序
 d ： 显示磁盘读写状况 
 w ： 删除日志文件
 l ：显示日志
 s： 显示传感器信息
 f ： 显示系统信息
 1 ：轮流显示每个 CPU 内核的使用情况（次选项仅仅使用在多核 CPU 系统）
```

#### 4.2、glances 使用方法

```
 glances 是一个命令行工具包括如下命令选项：
 -b：显示网络连接速度 Byte/ 秒
 -B @IP|host ：绑定服务器端 IP 地址或者主机名称
 -c @IP|host：连接 glances 服务器端
 -C file：设置配置文件默认是 /etc/glances/glances.conf 
 -d：关闭磁盘 I/O 模块
 -e：显示传感器温度
 -f file：设置输出文件（格式是 HTML 或者 CSV）
 -m：关闭挂载的磁盘模块
 -n：关闭网络模块
 -p PORT：设置运行端口默认是 61209 
 -P password：设置客户端 / 服务器密码
 -s：设置 glances 运行模式为服务器
 -t sec：设置屏幕刷新的时间间隔，单位为秒，默认值为 2 秒，数值许可范围：1~32767 
 -h : 显示帮助信息
 -v : 显示版本信息
```

## 五、glances C/S模式

glances还支持C/S模式监控，被监控机运行服务端，监控端运行客户端既可以实现远程监控。

![glances_cs.png](https://www.zutuanxue.com:8000/static/media/images/2020/12/7/1607301423160.png)

注意：C/S模式都必须安装glances才可以实现

#### 5.1、服务端启动

**服务端使用的端口默认是61209,如果使用服务端请注意开启防火墙。**
![glances_服务端.png](https://www.zutuanxue.com:8000/static/media/images/2020/12/7/1607301474604.png)

#### 5.2、客户端访问

```
[root@zutuanxue ~]# glances -c 192.168.10.100
```

## 六、其他数据保存方式

#### 6.1、导出数据为CSV电子表格

```
[root@manager01 ~]# glances --export-csv /tmp/1.csv
```