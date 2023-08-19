## 一、循环语句-until

系统中还有一个类似while的循环语句，大家可以看看until语句，不同于while的是，当条件为假时开始until循环。

### 1.1、until介绍

特点：条件为假就进入循环；条件为真就退出循环

### 1.2、until语法

```
until expression   [ 1 -eq 1 ]  (( 1 >= 1 ))
	do
		command
		command
		...
	done
```

## 二、案例：

使用while循环和until循环打印数字接龙，要求while循环输出1-5，until循环输出6-9.

**案例代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 数字接龙

i=1
while [ $i -le 5 ]
do
	echo $i
	let i++
	until [ $i -le 5 ]
		do
		    echo $i
	            let i++
	            [ $i -eq 10 ]&&break
	done
done
```

## 三、学习视频

[视频：until语句](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=66)
[视频：shell循环知识图谱总结](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=67)