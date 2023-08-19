工作中总是有很多工作需要重复性来完成，比如每天都需要执行一次备份、每天都需要分析一次业务的access.log日志，每分钟都需要监测一次主机的状态等等工作，这些重复性的工作我们一般都是使用脚本来完成，对于不需要频繁执行的任务，可以结合计划任务➕脚本完成，但是系统的计划任务只能精确到分，不能满足更频繁的重复工作。

这个时候我们除了依赖计划任务之外还有很多选择，比如脚本中的循环语句。

循环的优点

- 1）节省内存 10M脚本 1M脚本 哪个更剩内存 完成同一个任务
- 2）结构更清晰
- 3）节省开发时间成本

## 一、循环语句-for

### 1.1、for介绍

脚本在执行任务的时候，总会遇到需要循环执行的时候，比如说我们需要脚本每隔五分钟执行一次ping的操作，除了计划任务，我们还可以使用脚本来完成，那么我们就用到了循环语句。

### 1.2、for基本语法 for条件循环

- 列表for循环：用于将一组命令执行**已知的次数**，下面给出了for循环语句的基本格式：

```
for variable_name in {list}
     do
          command 
          command
          …
     done
或者
for variable in a b c
     do
         command
         command
     done
```

### 1.3、for条件应用

for条件不同的赋值方式
a、赋值来自一个范围

```
for var in {1..10}
	do 
			echo $var
done
```

b、直接赋值

```
for var in 1 2 3 4 5
	do 
			echo $var
done
```

c、赋值来自命令

```
for var in `seq  10`
	do 
			echo $var
done
```

体验不同的方式

```
赋值来自一个范围
for var in $(seq 10)
	do 
			echo $var
done

for var in {0..10..2}
	do 
			echo $var
done


for var in {10..1}
	do 
			echo $var
done


for var in {10..1..-2}
	do 
			echo $var
done


for var in `seq 10 -2 1`
	do 
			echo $var
done
```

- 不带列表循环

不带列表的for循环执行时由**用户指定参数和参数的个数**，下面给出了不带列表的for循环的基本格式：

```
for variable
    do
        command 
        command
        …
   done
```

语法结构举例说明：

```
#!/bin/bash
for var
do
echo $var
done

echo "脚本后面有$#个参数"
```

### 1.4、for C格式语法

- 类C风格的for循环

```
for(( expr1;expr2;expr3 ))
	do
		command
		command
		…
	done
for (( i=1;i<=5;i++))  
	do
		echo $i
	done


expr1：定义变量并赋初值   变量初始值
expr2：决定是否进行循环（条件）  变量的条件
expr3：决定循环变量如何改变,决定循环什么时候退出 自增或自减运算



多变量用法
for ((A=1,B=10;A<10,B>1;A++,B--))
```

**语法结构举例说明：**

```
for ((i=1;i<=5;i++));do echo $i;done
for ((i=1;i<=10;i+=2));do echo $i;done
for ((i=2;i<=10;i+=2));do echo $i;done
```

## 二、练习案例

**jobs: 写一个扫描软件，扫描本地网络中存活的机器**

**案例需求：**
判断本地网络中哪些IP被使用

**案例分析：**
采用ping的方式判断IP是否被占用

```
 a、能ping通说明占用
 b、不能ping通说明未被占用
```

b、命令

```
ping -c1 IP
```

**算法：**
1、ping ip
2、分析ping结果
3、输出结果

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 扫描本地网络中存活的主机，以C类地址为例


#variables
netsub="192.168.1."

#main
#1、循环ping IP地址，能ping通说明IP存在。
for ip in `seq 1 254`
  do
  (  
     #2、判断Ping结果
     if ping -c1 $netsub$ip &>/dev/null;then
          #3、输出结果
          echo "$netsub$ip is open"
     else
          echo "$netsub$ip is close"
     fi
   ) & 
done
```

## 三、学习视频

[视频：流程控制-循环课程介绍](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=51)
[视频：for循环介绍](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=52)
[视频：for条件赋值](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=53)
[视频：for仿C语法](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=54)
[视频：job-扫描局域网IP](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=55)