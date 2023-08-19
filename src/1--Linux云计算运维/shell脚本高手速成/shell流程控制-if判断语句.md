## 一、if介绍

如何写一个高可用性的脚本，赋予脚本智能化，赋予脚本执行逻辑。

比如nginx安装脚本中

- configure执行成功在执行make,
- make执行成功在执行make install
- 上一步错误就不需要执行后面的代码了。

answer: 加入判断

只要你想在代码中判断一下的时候就第一时间想到if就行了，适用于99%的语言。

当我们在写程序的时候，时常对上一步执行是否成功如何判断苦恼，当我们今天学习了if就可以解决你的苦恼。if语句在我们程序中就是用来做判断的，以后大家不管学习什么语言，以后只要涉及到判断的部分，大家就可以直接拿if来使用，不同的语言之间的if只是语法不同，原理是相同的。

## 二、单if语法

适用范围:只需要一步判断，条件返回真干什么。

语句格式

```
if [ condition ]           #condition 值为true or false
   then                    #条件为真的时候执行
      commands             #代码块 一行或者多行代码
fi			   #语句的结束
```

![流程判断11.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601016825298.png)

该语句翻译成汉语大意如下：

```
假如  条件为真
 那么
    执行commands代码块
结束
```

通过一段代码来演示一下吧，判断 当前用户是不是root，如果不是那么返回”ERROR: need to be root so that!“

```
#!/bin/bash
#Author: www.zutuanxue.com
#Created Time: 
#Script Description: 

if [ $USER != 'root' ]
   then
	echo "ERROR: need to be root so that"
	exit 1
fi
```

## 三、if…else语句

适用范围==:两步判断，条件为真干什么，条件为假干什么。

```
if [ condition ]     
     then           	条件为真
          commands1     	真  要执行代码块
else                	条件为假
          commands2     	假   要执行的代码块
fi         		结束
```

![流程判断2.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601016994805.png)

该语句翻译成汉语大意如下：

```
假如条件为真
  那么

        执行commands1代码块
否则
        执行commands2代码块
结束
```

通过一段代码演示一下吧，判断当前登录用户是管理员还是普通用户,如果是管理员输出”hey admin“ 如果是普通用户输出”hey guest“

```
#!/bin/bash
#Author:www.zutuanxue.com
#Created Time:
#Script Description: 

if [ $USER == 'root' ]
   then
	echo "hey admin"
else
	echo "hey guest"
fi
```

## 四、if…elif…else

适用范围:多于两个以上的判断结果，也就是多于一个以上的判断条件。

```
if [ condition 1]     满足第一个条件

     then          真

            command1    执行command1代码块
elif [ condition 2]   满足第二个条件
 
     then           真

             commands2    执行command2代码块

  .......
else      如果条件都不满足

            commandsX      执行commandX代码块
fi    结束判断
```

![流程判断3.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601017300715.png)

该语句翻译成汉语大意如下：

```
假如 条件1 为真

      那么

             执行代码块1
假如 条件2 为真

      那么

            执行代码块2

      以此类推的N个条件及对应的执行代码块
否则 【以上所有条件中没有一个满足的】

           执行代码块X
结束
```

通过一段代码演示一下吧，通过一个脚本，判断两个整数的关系

**案例需求**
判断内存的使用率
60以下 ok
60以上 黄色警告
70以上 橙色严重警告
80以上 红色警告

**案例思考**

- 内存使用率获得方式
	– 手动给出
	– 通过内存查看命令运算得出

**案例代码**

```
#!/bin/bash
#1、条件
#判断内存的使用率
#60以下    ok 绿色  32m
#60以上    黄色警告   33m
#70以上    粉色严重警告 35m 
#80以上    红色警告 31m

#2、算法
#收集内存使用率  $1 
#
#多条件判断

if [ $1 -gt 80 ]
then
	echo -e "\033[31m 警告 \033[0m"
elif [ $1 -gt 70 ]
then
	echo -e "\033[35m 警告 \033[0m"
elif [ $1 -gt 60 ]
then
	echo -e "\033[33m 警告 \033[0m"
else
	echo -e "\033[32m OK \033[0m"
fi


#注意事项
#多条件判断  需要从最严格开始判断  否者 后面的就不会生效
#如果你第一个判断的是60以上，那么 70 80 都符合第一个条件。所以后面的判断70  80 就没有任何意义
```

## 五、练习案例

**案例需求**
比较两个整数的关系

**案例思考**

- 两个整数有几种关系
	– 大于
	– 等于
	– 小于

**案例代码**

```
#!/bin/bash
#Author: www.zutuanxue.com
#Created Time:
#Script Description: 

if [ $1 -gt $2 ]
   then
	echo "$1 > $2"
elif [ $1 -eq $2 ]
   then
        echo "$1 = $2"
else
        echo "$1 < $2"
fi
```

## 六、if嵌套if

当有多步判断的时候，可以使用if嵌套

**1、多步判断 类似于多条件if**
**2、依赖执行的环境 configure->make->make install**

#### 6.1、使用if嵌套if的方式判断两个整数的关系

```
#!/bin/bash
#Author: 
#Created Time: 
#Script Description: 

if [ $1 -ne $2 ]
   then
       if [ $1 -gt $2 ]
  	  then
		echo " $1 > $2 "
       else
		echo " $1 < $2 "
       fi
else
       echo " $1 = $2 "
fi
```

#### 6.2、写一个nginx安装初始化脚本

**案例需求**
写一个nginx业务初始化脚本，完成nginx软件自动安装。

**案例思考**

- 1、nginx软件包获得方式
- 2、nginx安装流程
- 3、nginx安装依赖关系

**案例步骤**

- 1、软件包下载
- 2、软件包解压
- 3、安装依赖包
- 4、安装nginx
- 5、返回结果

**案例代码**

```
#!/bin/bash
#Author: www.zutuanxue.com
#Created Time: 
#Script Description: nginx aoto install script


source_pkg=nginx-1.19.2.tar.gz
#1、软件包下载
wget http://nginx.org/download/$source_pkg 
#2、解压
if [ -f $source_pkg ];then
	tar xf $source_pkg && cd nginx-1.19.2
else
        echo "not found $source_pkg"
	exit 1
fi

#3、安装依赖包
if ! ( yum -y install pcre-devel zlib-devel );then
      echo "yum: install soft error"
      exit 1
fi

#4、配置
#判断配置语句执行结果
if ./configure 1>/dev/null        
	then
	#判断make执行结果
	     if make 1>/dev/null
		 then
		 #判断make install安装结果
			if make install 1>/dev/null
			   then
			 	echo "nginx 安装成功"
			else
			 	echo "nginx 安装失败"
				exit 1
		        fi
		else
			echo "make fail"
			exit 1
		fi
else
		echo "configure fail"
		exit 1
fi



#./configure
#if [ $? -eq 0 ];then

#注意: 1>/dev/null
1  标准输出
2  标准错误输出
```

## 七、if高级用法

#### 7.1、条件符号使用双圆括号，可以在条件中植入数学表达式 if (())

```
#!/bin/bash
#Author:
#Created Time:
#Script Description: 

if (( (5+5-5)*5/5 > 10 ))
    then
        echo "yes"
else
        echo "no"
fi
```

#### 7.2、使用双方括号,可以在条件中使用通配符

通过代码看下 ，为字符串提供高级功能，模式匹配 r* 匹配r开头的字符串

```
#!/bin/bash
#Author: 
#Created Time: 
#Script Description: 
for var in  ab ac rx bx rvv vt
   do
       if [[ "$var" == r* ]]
	  then
		echo "$var"
       fi
done
```

## 八、简写if

省去了关键字，条件为真采用&&符号链接命令块，条件为假采用||链接命令块

简写if一般用在简单的判断中

```
if [ ! -d /tmp/baism ]
    then
        mkdir /tmp/baism
fi

可以简写为

[ ！ -d /tmp/baism ] && mkdir /tmp/baism

if [ $USER == 'root' ]
	  then
	      echo "hello root"
else
			  echo "hello guest"
fi

可以简写
[ $USER == 'root' ]&&echo "hello root" || echo "hello guest"
```

## 九、课后练习

```
1、计算机状态监控。能ping通就算up，不通为down,需要考虑网络延迟问题造成的假报警问题。
#1、分别ping  取三个值  判断三个值的结果
    1.1 ping 3次 并取值
    1.2 三次结果与运算  得出结论


2、监控一个服务端口,判断其状态

3、打印内存使用率脚本，打印内存使用率、swap使用率、buff&cache使用量

4、打印磁盘使用率脚本，对本机的磁盘使用率统计并打印结果
     使用率小于80，绿色输出
     使用率小于90，大于80，黄色输出
     使用率小于95，大于90，红色输出

5、网卡发送和就收数据量监控，按秒统计。

6、URL监控脚本，对某个URL进行监控，返回值为200则代表成功访问。

7、写一个mysql binlog备份脚本，要求每天0点0分，计算机自动备份前一天的binlog日志，打包后发送给备份服务器。

8、闰年判断

9、判断/tmp/run目录是否存在，如果不存在就建立，如果存在就删除目录里所有文件

10、写一个nginx安装脚本
```