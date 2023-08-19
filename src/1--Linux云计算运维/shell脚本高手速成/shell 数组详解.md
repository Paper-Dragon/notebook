有这样一个现实问题：一个班级学员信息系统，要求存储学员ID、NAME、SCORE、AGE、GENDER，班级有50个人，思考如何解决交互中数据存储的问题。很多人可能直接说或定义变量接收数据不就行了！nice，你很棒！！
解决方案如下：
1）每个学生通过5个变量，一个班级50个学生，5*50=250，妥妥的！我定义250个变量接收就可以了，美美哒！

兄弟，现在不是全班了是全校的学生需要录入你这个信息系统，你写变量吧！！当我提出这个需求的时候，作为开发你会不会想骂娘呢？

2）使用数组来定义，我只需要定义5个数组来接收所有用户的数据就可以了，5个数组就能解决一切，你觉得你会不会想了解下数组是什么呢？

## 一、数组介绍

数组可以让用户一次赋予多个值，需要读取数据时只需通过索引调用就可以方便读出了。

普通数组：只能使用整数作为数组索引(元素的索引)
关联数组：可以使用字符串作为数组索引(元素的索引)

## 二、数组定义

```
				数组名称=(元素1 元素2 元素3 ...)
```

## 三、数组赋值方式

- 一次附一个值

```
变量名=变量值
array[0]=v1
array[1]=v2
array[3]=v3
```

- 一次附多个值

```
array=(var1 var2 var3 var4)
array1=(`cat /etc/passwd`)			//将文件中每一行赋值给array1数组
array2=(`ls /root`)
array3=(harry amy jack "Miss zhang")
array4=(1 2 3 4 "hello world" [10]=linux)
```

四、数组取值
**取值方式:** ${数组名称[索引]}

**索引:** 默认情况下索引是指数组中的元素[存的值]在数组中的顺序，从0开始计数，关联数组除外。比如：
array=(var1 var2 var3 var4)
array数组中存有4个元素，分别是：var1 var2 var3 var4
那么我想取出var2这个元素，那么就得先看看他在数组中的位置，数组中的元素索引如下:

```
		元素	var1 var2 var3 var4
		索引	0     1     2    3
```

所以正确表示array数组中元素var2的方式是：${array[1]}

**数组取值练习**

```
${array[i]}  i表示元素的索引
使用@ 或 * 可以获取数组中的所有元素：
获取第一个元素
echo ${array[0]}
echo ${array[*]}			获取数组里的所有元素
echo ${#array[*]}			获取数组里所有元素个数
echo ${!array[@]}    	获取数组元素的索引索引
echo ${array[@]:1:2}    访问指定的元素；1代表从索引为1的元素开始获取；2代表获取后面几个元素
```

## 五、关联数组

### 5.1 定义管理数组

关联数组使用首先需要申明该数组为关联数组，申明方式： declare -A 数组名称

```
首先声明关联数组
declare -A asso_array1
declare -A asso_array2
declare -A asso_array3
```

### 5.2关联数组赋值

- 一次赋一个值

```
数组名[索引]=变量值
[root@zutuanxue ~]# asso_array1[linux]=one
[root@zutuanxue ~]# asso_array1[java]=two
[root@zutuanxue ~]# asso_array1[php]=three
```

- 一次附多个值

```
[root@zutuanxue ~]# asso_array2=([name1]=harry [name2]=jack [name3]=amy [name4]="Miss zhang")
```

- 查看关联数组

```
[root@zutuanxue ~]# declare -A
declare -A asso_array1='([php]="three" [java]="two" [linux]="one" )'
declare -A asso_array2='([name3]="amy" [name2]="jack" [name1]="harry" [name4]="Miss zhang" )'
```

### 管理数组取值

```
[root@zutuanxue ~]# echo ${asso_array1[linux]}
one
[root@zutuanxue ~]# echo ${asso_array1[php]}
three
[root@zutuanxue ~]# echo ${asso_array1[*]}
three two one
[root@zutuanxue ~]# echo ${!asso_array1[*]}
php java linux
[root@zutuanxue ~]# echo ${#asso_array1[*]}
3
[root@zutuanxue ~]# echo ${#asso_array2[*]}
4
[root@zutuanxue ~]# echo ${!asso_array2[*]}
name3 name2 name1 name4
```

## 六、课堂练习

#### 2.1 写一个监控CPU 平均负载值的脚本

**案例需求**
分别打印CPU 1min 5min 15min load负载值

**案例思路**

- 1、如何取CPU负载值，有哪些命令
- 2、如果存储在内存中，变量、数组

**案例步骤**

- 1、收集cpu load 平均负载值到数组
- 2、打印输出对应的负载值

**代码实现**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#
#Release: 
#Description: 打印cpu 1min 5min 15min的负载值

#1、收集负载值
cpu_load=(`uptime|tr -s " "|cut -d " " -f9-11|tr "," " "`)
#2、输出负载值
echo "CPU 1 min平均负载为: ${cpu_load[0]}"
echo "CPU 5 min平均负载为: ${cpu_load[1]}"
echo "CPU 15 min平均负载为: ${cpu_load[2]}"
```

**代码效果**

```
[root@zutuanxue day2]# sh cpu_load.sh 
CPU 1 min平均负载为: 0.00
CPU 5 min平均负载为: 0.01
CPU 15 min平均负载为: 0.05
```