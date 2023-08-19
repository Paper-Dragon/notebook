在shell脚本编写中，时常会用到对文件的相关操作，比如增加内容，修改内容，删除部分内容，查看部分内容等，但是上述举例的这些操作一般都是需要在文本编辑器中才能操作，常用的文本编辑器如：gedit、vim、nano等又是交互式文本编辑器，脚本无法自己独立完成，必须有人参与才可以完成。如果这样的话又违背了我们编写脚本的意愿(全部由机器来完成，减少人的工作压力，提升工作效率)。emm…如何才能让这些操作全部脚本自己就搞定，而不需要人的参与，而且又能按照我们的脚本预案来完成呢？

为了解决上述问题，linux为大家提供了一些命令,比如Perl、sed等命令，今天我就着重为大家介绍一下sed命令。

## 一、sed介绍

sed是linux中提供的一个外部命令,它是一个行(流)编辑器，非交互式的对文件内容进行增删改查的操作，使用者只能在命令行输入编辑命令、指定文件名，然后在屏幕上查看输出。它和文本编辑器有本质的区别。

```
区别是：

文本编辑器: 编辑对象是文件

行编辑器：编辑对象是文件中的行
```

也就是前者一次处理一个文本，而后者是一次处理一个文本中的一行。这个是我们应该弄清楚且必须牢记的，否者可能无法理解sed的运行原理和使用精髓。

**sed数据处理原理**

![sed处理数据原理.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601961286169.png)

## 二、sed语法

**sed 命令语法：**

sed [options] ‘{command}[flags]’ [filename]

```
#命令选项
-e script 将脚本中指定的命令添加到处理输入时执行的命令中  多条件，一行中要有多个操作
-f script 将文件中指定的命令添加到处理输入时执行的命令中
-n        抑制自动输出
-i        编辑文件内容
-i.bak    修改时同时创建.bak备份文件。
-r        使用扩展的正则表达式
!         取反 （跟在模式条件后与shell有所区别）

#command   对文件干什么
sed常用内部命令
a   在匹配后面添加
i   在匹配前面添加

d   删除

s   查找替换  字符串
c   更改
y   转换   N D P 


p   打印



#flags
数字             表示新文本替换的模式
g：             表示用新文本替换现有文本的全部实例
p：             表示打印原始的内容
w filename:     将替换的结果写入文件
```

### 2.1）sed内部命令说明

**演示实例文档**

```
[root@zutuanxue ~]# cat data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
```

文件内容增加操作,将数据追加到某个位置之后，使用命令a。

**演示案例**

```
在data1的每行后追加一行新数据内容: append data "haha"
[root@zutuanxue ~]# sed 'a\append data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
append data "haha"
2 the quick brown fox jumps over the lazy dog.
append data "haha"
3 the quick brown fox jumps over the lazy dog.
append data "haha"
4 the quick brown fox jumps over the lazy dog.
append data "haha"
5 the quick brown fox jumps over the lazy dog.
append data "haha"


在第二行后新开一行追加数据: append data "haha"
[root@zutuanxue ~]# sed '2a\append data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
append data "haha"
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

在第二到四行每行后新开一行追加数据: append data "haha"
[root@zutuanxue ~]# sed '2,4a\append data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
append data "haha"
3 the quick brown fox jumps over the lazy dog.
append data "haha"
4 the quick brown fox jumps over the lazy dog.
append data "haha"
5 the quick brown fox jumps over the lazy dog.

匹配字符串追加: 找到包含"3 the"的行，在其后新开一行追加内容: append data "haha"
[root@zutuanxue ~]# sed '/3 the/a\append data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
append data "haha"
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

//开启匹配模式  /要匹配的字符串/
```

文件内容增加操作,将数据插入到某个位置之前，使用命令i。

**演示案例**

```
在data1的每行前插入一行新数据内容: insert data "haha"
[root@zutuanxue ~]# sed 'i\insert data "haha"' data1
insert data "haha"
1 the quick brown fox jumps over the lazy dog.
insert data "haha"
2 the quick brown fox jumps over the lazy dog.
insert data "haha"
3 the quick brown fox jumps over the lazy dog.
insert data "haha"
4 the quick brown fox jumps over the lazy dog.
insert data "haha"
5 the quick brown fox jumps over the lazy dog.


在第二行前新开一行插入数据: insert data "haha"
[root@zutuanxue ~]# sed '2i\insert data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
insert data "haha"
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.


在第二到四行每行前新开一行插入数据: insert data "haha"
[root@zutuanxue ~]# sed '2,4i\insert data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
insert data "haha"
2 the quick brown fox jumps over the lazy dog.
insert data "haha"
3 the quick brown fox jumps over the lazy dog.
insert data "haha"
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.


匹配字符串插入: 找到包含"3 the"的行，在其前新开一行插入内容: insert data "haha"
[root@zutuanxue ~]# sed '/3 the/i\insert data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
insert data "haha"
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
```

文件内容修改操作–替换,将一行中匹配的内容替换为新的数据，使用命令s。

**演示案例**

```
从标准输出流中做替换，将test替换为text
[root@zutuanxue ~]# echo "this is a test" |sed 's/test/text/'
this is a text

将data1中每行的dog替换为cat
[root@zutuanxue ~]# sed 's/dog/cat/' data1
1 the quick brown fox jumps over the lazy cat.
2 the quick brown fox jumps over the lazy cat.
3 the quick brown fox jumps over the lazy cat.
4 the quick brown fox jumps over the lazy cat.
5 the quick brown fox jumps over the lazy cat.

将data1中第二行的dog替换为cat
[root@zutuanxue ~]# sed '2s/dog/cat/' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy cat.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

将data1中第二到第四行的dog替换为cat
[root@zutuanxue ~]# sed '2,4s/dog/cat/' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy cat.
3 the quick brown fox jumps over the lazy cat.
4 the quick brown fox jumps over the lazy cat.
5 the quick brown fox jumps over the lazy dog.

匹配字符串替换:将包含字符串"3 the"的行中的dog替换为cat
[root@zutuanxue ~]# sed '/3 the/s/dog/cat/' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy cat.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
```

文件内容修改操作–更改,将一行中匹配的内容替换为新的数据，使用命令c。

**演示案例**

```
将data1文件中的所有行的内容更改为: change data "data"
[root@zutuanxue ~]# sed 'c\change data "haha"' data1
change data "haha"
change data "haha"
change data "haha"
change data "haha"
change data "haha"

将data1文件第二行的内容更改为: change data "haha"
[root@zutuanxue ~]# sed '2c\change data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
change data "haha"
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

将data1文件中的第二、三、四行的内容更改为：change data "haha"
[root@zutuanxue ~]# sed '2,4c\change data "haha"' data1
1 the quick brown fox jumps over the lazy dog.
change data "haha"
5 the quick brown fox jumps over the lazy dog.

将data1文件中包含"3 the"的行内容更改为: change data "haha"
[root@zutuanxue ~]# sed '/3 the/c\change data "data"' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
change data "data"
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
```

文件内容修改操作–字符转换，将一行中匹配的内容替换为新的数据，使用命令y。

**演示案例**

```
将data1中的a b c字符转换为对应的 A  B  C字符
[root@zutuanxue ~]# sed 'y/abc/ABC/' data1
1 the quiCk Brown fox jumps over the lAzy dog.
2 the quiCk Brown fox jumps over the lAzy dog.
3 the quiCk Brown fox jumps over the lAzy dog.
4 the quiCk Brown fox jumps over the lAzy dog.
5 the quiCk Brown fox jumps over the lAzy dog.
```

文件内容删除，将文件中的指定数据删除，使用命令d。

**演示案例**

```
删除文件data1中的所有数据
[root@zutuanxue ~]# sed 'd' data1

删除文件data1中的第三行数据
[root@zutuanxue ~]# sed '3d' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

删除文件data1第三到第四行的数据
[root@zutuanxue ~]# sed '3,4d' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

删除文件data1中包含字符串"3 the"的行
[root@zutuanxue ~]# sed '/3 the/d' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
```

文件内容查看，将文件内容输出到屏幕，使用命令p。

**演示案例**

```
打印data1文件内容
[root@zutuanxue ~]# sed 'p' data1
1 the quick brown fox jumps over the lazy dog.
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

打印data1文件第三行的内容
[root@zutuanxue ~]# sed '3p' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

打印data1文件第二、三、四行内容
[root@zutuanxue ~]# sed '2,4p' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.

打印data1文件包含字符串"3 the"的行
[root@zutuanxue ~]# sed '/3 the/p' data1
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog. 


可以看得出，打印内容是重复的行，原因是打印了指定文件内容一次，又将读入缓存的所有数据打印了一次，所以会看到这样的效果，
如果不想看到这样的结果，可以加命令选项-n抑制内存输出即可。
```

### 2.2）命令选项说明

**sed语法**
**在sed命令中，命令选项是对sed中的命令的增强**

在命令行中使用多个命令 -e

```
将brown替换为green dog替换为cat
[root@zutuanxue ~]# sed -e 's/brown/green/;s/dog/cat/' data1
1 the quick green fox jumps over the lazy cat.
2 the quick green fox jumps over the lazy cat.
3 the quick green fox jumps over the lazy cat.
4 the quick green fox jumps over the lazy cat.
5 the quick green fox jumps over the lazy cat.
```

从文件读取编辑器命令 -f 适用于日常重复执行的场景

```
1）将命令写入文件
[root@zutuanxue ~]# vim abc
s/brown/green/
s/dog/cat/
s/fox/elephant/

2）使用-f命令选项调用命令文件
[root@zutuanxue ~]# sed -f abc data1 
1 the quick green elephant jumps over the lazy cat.
2 the quick green elephant jumps over the lazy cat.
3 the quick green elephant jumps over the lazy cat.
4 the quick green elephant jumps over the lazy cat.
5 the quick green elephant jumps over the lazy cat.
```

抑制内存输出 -n

```
打印data1文件的第二行到最后一行内容  $最后的意思
[root@zutuanxue ~]# sed -n '2,$p' data1 
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
```

使用正则表达式 -r

```
打印data1中以字符串"3 the"开头的行内容
[root@zutuanxue ~]# sed -n  -r '/^(3 the)/p' data1
3 the quick brown fox jumps over the lazy dog.
```

从上述的演示中，大家可以看出，数据处理只是在缓存中完成的，并没有实际修改文件内容，如果需要修改文件内容可以直接使用-i命令选项。在这里我需要说明的是-i是一个不可逆的操作，一旦修改，如果想复原就很困难，几乎不可能，所以建议大家在操作的时候可以备份一下源文件。-i命令选项提供了备份功能，比如参数使用-i.bak，那么在修改源文件的同时会先备份一个以.bak结尾的源文件，然后再进行修改操作。

```
1）查看文件列表，没有发现data1.bak
[root@zutuanxue ~]# ls
abc  apache  data1  Dobby  file  node-v10.14.1  Python-3.7.1  soft1  vimset

2）执行替换命令并修改文件
[root@zutuanxue ~]# sed -i.bak 's/brown/green/' data1

3）发现文件夹中多了一个data1.bak文件
[root@zutuanxue ~]# ls
abc     data1      Dobby  node-v10.14.1  soft1
apache  data1.bak  file   Python-3.7.1   vimset

4）打印比较一下，发现data1已经被修改，data1.bak是源文件的备份。
[root@zutuanxue ~]# cat data1
1 the quick green fox jumps over the lazy dog.
2 the quick green fox jumps over the lazy dog.
3 the quick green fox jumps over the lazy dog.
4 the quick green fox jumps over the lazy dog.
5 the quick green fox jumps over the lazy dog.
[root@zutuanxue ~]# cat data1.bak 
1 the quick brown fox jumps over the lazy dog.
2 the quick brown fox jumps over the lazy dog.
3 the quick brown fox jumps over the lazy dog.
4 the quick brown fox jumps over the lazy dog.
5 the quick brown fox jumps over the lazy dog.
```

### 2.3）标志

**在sed命令中，标志是对sed中的内部命令做补充说明**

```
演示文档
[root@zutuanxue ~]# cat data2
1 the quick brown fox jumps over the lazy dog . dog
2 the quick brown fox jumps over the lazy dog . dog
3 the quick brown fox jumps over the lazy dog . dog
4 the quick brown fox jumps over the lazy dog . dog
5 the quick brown fox jumps over the lazy dog . dog
```

数字标志：此标志是一个非零正数，默认情况下，执行替换的时候，如果一行中有多个符合的字符串，如果没有标志位定义，那么只会替换第一个字符串，其他的就被忽略掉了，为了能精确替换，可以使用数字位做定义。

```
替换一行中的第二处dog为cat
[root@zutuanxue ~]# sed 's/dog/cat/2' data2
1 the quick brown fox jumps over the lazy dog . cat
2 the quick brown fox jumps over the lazy dog . cat
3 the quick brown fox jumps over the lazy dog . cat
4 the quick brown fox jumps over the lazy dog . cat
5 the quick brown fox jumps over the lazy dog . cat
```

g标志:将一行中的所有符合的字符串全部执行替换

```
将data1文件中的所有dog替换为cat
[root@zutuanxue ~]# sed 's/dog/cat/g' data2
1 the quick brown fox jumps over the lazy cat . cat
2 the quick brown fox jumps over the lazy cat . cat
3 the quick brown fox jumps over the lazy cat . cat
4 the quick brown fox jumps over the lazy cat . cat
5 the quick brown fox jumps over the lazy cat . cat
```

p标志：打印文本内容，类似于-p命令选项

```
[root@zutuanxue ~]# sed  '3s/dog/cat/p' data2
1 the quick brown fox jumps over the lazy dog . dog
2 the quick brown fox jumps over the lazy dog . dog
3 the quick brown fox jumps over the lazy cat . dog
3 the quick brown fox jumps over the lazy cat . dog
4 the quick brown fox jumps over the lazy dog . dog
5 the quick brown fox jumps over the lazy dog . dog
```

w filename标志:将修改的内容存入filename文件中

```
[root@zutuanxue ~]# sed  '3s/dog/cat/w text' data2
1 the quick brown fox jumps over the lazy dog . dog
2 the quick brown fox jumps over the lazy dog . dog
3 the quick brown fox jumps over the lazy cat . dog
4 the quick brown fox jumps over the lazy dog . dog
5 the quick brown fox jumps over the lazy dog . dog

可以看出，将修改的第三行内容存在了text文件中
[root@zutuanxue ~]# cat text 
3 the quick brown fox jumps over the lazy cat . dog
```

## 三、练习案例

3.1、写一个初始化系统的脚本
**案例需求**
1）自动修改主机名（如：ip是192.168.0.88，则主机名改为server88.zutuanxue.cc）

a. 更改文件非交互式 sed

/etc/sysconfig/network

b.将本主机的IP截取出来赋值给一个变量ip;再然后将ip变量里以.分割的最后一位赋值给另一个变量ip1

2）自动配置可用的yum源

3）自动关闭防火墙和selinux

```
1、关闭防火墙
2、关闭selinux
3、配置yum源
4、ntp时间服务器 
5、更新系统软件包
```

**3.2、写一个搭建ftp服务的脚本，要求如下：**
**案例需求**
1）不支持本地用户登录 local_enable=NO
2） 匿名用户可以上传 新建 删除 anon_upload_enable=YES anon_mkdir_write_enable=YES
3） 匿名用户限速500KBps anon_max_rate=500000

```
仅供参考：
#!/bin/bash
ipaddr=`ifconfig eth0|sed -n '2p'|sed -e 's/.*inet addr:\(.*\) Bcast.*/\1/g'`
iptail=`echo $ipaddr|cut -d'.' -f4`
ipremote=192.168.1.10
#修改主机名
hostname server$iptail.zutuanxue.com
sed -i "/HOSTNAME/cHOSTNAME=server$iptail.zutuanxue.com" /etc/sysconfig/network
echo "$ipaddr server$iptail.zutuanxue.cc" >>/etc/hosts
#关闭防火墙和selinux
service iptables stop
setenforce 0 >/dev/null 2>&1
sed -i '/^SELINUX=/cSELINUX=disabled' /etc/selinux/config
#配置yum源(一般是内网源)
#test network
ping -c 1 $ipremote > /dev/null 2>&1
if [ $? -ne 0 ];then
	echo "你的网络不通，请先检查你的网络"
	exit 1
else
	echo "网络ok."
fi
cat > /etc/yum.repos.d/server.repo << end
[server]
name=server
baseurl=ftp://$ipremote
enabled=1
gpgcheck=0
end

#安装软件
read -p "请输入需要安装的软件，多个用空格隔开：" soft
yum -y install $soft &>/dev/null

#备份配置文件
conf=/etc/vsftpd/vsftpd.conf
\cp $conf $conf.default
#根据需求修改配置文件
sed -ir '/^#|^$/d' $conf
sed -i '/local_enable/c\local_enable=NO' $conf
sed -i '$a anon_upload_enable=YES' $conf
sed -i '$a anon_mkdir_write_enable=YES' $conf
sed -i '$a anon_other_write_enable=YES' $conf
sed -i '$a anon_max_rate=512000' $conf
#启动服务
service vsftpd restart &>/dev/null && echo"vsftpd服务启动成功"

#测试验证
chmod 777 /var/ftp/pub
cp /etc/hosts /var/ftp/pub
#测试下载
cd /tmp
lftp $ipaddr <<end
cd pub
get hosts
exit
end

if [ -f /tmp/hosts ];then
	echo "匿名用户下载成功"
	rm -f /tmp/hosts
else
	echo "匿名用户下载失败"
fi
#测试上传、创建目录、删除目录等
cd /tmp
lftp $ipaddr << end
cd pub
mkdir test1
mkdir test2
put /etc/group
rmdir test2
exit
end

if [ -d /var/ftp/pub/test1 ];then
    echo "创建目录成功"
	if [ ! -d /var/ftp/pub/test2 ];then
    	echo "文件删除成功"
        fi
else
	if [ -f /var/ftp/pub/group ];then
	echo "文件上传成功"
        else
        echo "上传、创建目录删除目录部ok"
        fi 
fi   
[ -f /var/ftp/pub/group ] && echo "上传文件成功"
```