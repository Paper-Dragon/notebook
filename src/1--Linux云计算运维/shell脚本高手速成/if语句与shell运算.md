if是一个条件判断语句，判断的前提是得有个条件。so，条件就显得格外重要了，if中可以有哪些条件呢？接下来我们就来聊一聊if条件的问题。
我们在之前的课程中学习了shell的运算，有比较运算、逻辑运算、文件运算等，这些运算可以植入到if条件中吗？答案是肯定的，接下来我就给大家演示一下如何在if条件中植入shell运算条件

## 一、与文件存在与否的判断

```
-e	是否存在   不管是文件还是目录，只要存在，条件就成立
-f	是否为普通文件
-d	是否为目录
-S	socket
-p	pipe
-c	character
-b	block
-L	软link
```

- **文件权限相关的判断**

```l
-r	当前用户对其是否可读
-w	当前用户对其是否可写
-x	当前用户对其是否可执行
-u	是否有suid
-g	是否sgid
-k	是否有t位
```

- **两个文件的比较判断**

```
file1 -nt  file2	比较file1是否比file2新	
file1 -ot  file2 	比较file1是否比file2旧
file1 -ef  file2	比较是否为同一个文件，或者用于判断硬连接，是否指向同一个inode
```

- **整数之间的判断**

```
-eq	相等
-ne	不等
-gt	大于
-lt	小于
-ge   大于等于
-le	小于等于


浮点比较运算
比较两个浮点数字的大小
给脚本两个浮点数字   返回他两的关系


#思路
1、获得两个浮点数字
2、处理为整形
3、比较
4、输出
```

- **字符串之间的判断**

```
-z  是否为空字符串   		字符串长度为0，就成立
-n  是否为非空字符串    	只要字符串非空，就是成立
string1 == string2 		是否相等
string1 != string2 		不等


#用户登录验证

[root@zutuanxue ~]# cat if-6.sh 
#!/bin/bash
#1、交互式输入用户名 密码
read -p "user: " myuser
if [ -z "$myuser" ];then
	echo "用户名为空"
	exit 1
fi

#从外往里写
read -p "password: " mypw
if [ -n "$mypw" ];then
       #2、判断是否正确
         #2.1 判断用户名
	if [ $myuser == "root" ];then
	   #2.2判断密码
	   if [ $mypw == "abc-123" ];then
		   echo "welcome root"
	   else
		   echo "密码错误"
		   exit 1
	   fi
        
 	else
     	 echo "用户名错误"
		exit 1
	fi		

else
	echo "密码不能为空"
	exit 1
fi
```

- **多重条件判断**

```shell
逻辑判断符号：
&&  	(and 逻辑与) 		两个条件同时满足，整个大条件为真
||	(or 逻辑或)		两个条件满足任意一个，整个大条件为真
！ 	非运算

#用户登录验证
[root@zutuanxue ~]# cat if-6.sh 
#!/bin/bash
#1、交互式输入用户名 密码
read -p "user: " myuser
if [ -z "$myuser" ];then
	echo "用户名为空"
	exit 1
fi

#从外往里写
read -p "password: " mypw
if [ -n "$mypw" ];then
       #2、判断是否正确
         #2.1 判断用户名
	#if [ $myuser == "root" ];then
	   #2.2判断密码
	  # if [ $mypw == "abc-123" ];then
	#	   echo "welcome root"
	   #else
	#	   echo "密码错误"
	#	   exit 1
	#   fi
        #
 	#else
     	#	echo "用户名错误"
	#	exit 1
	#fi		

	if [ $myuser == 'root' ] && [ $mypw == 'abc-123' ];then
		echo "welcome root"
	else
		echo "用户名或密码错误"
		exit 1
	fi

else
	echo "密码不能为空"
	exit 1
fi
```

## 二、课后练习

```
练习题1、判断/tmp/tyschool目录，如果没有则创建它
练习题2、判断是否有/usr/bin/wget命令，没有则安装他
练习题3、判断当前用户是否为管理员，UID为0或者为root都算管理员
练习题4、打印物理内存使用率
```

## 三、学习视频

[视频：if与shell运算01](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=47)
[视频：if与shell运算02](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=48)