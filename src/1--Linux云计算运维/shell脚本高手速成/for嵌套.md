## 一、for嵌套

**1.1、for嵌套if**

**案例:**
输出1-9，当输出5时停止输出

**案例代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description:输出1-9，当输出5时停止输出

for ((num=1;num<10;num++))
   do
     echo $num
     [ $num -eq 5 ]&& break
done
```

**1.2、for嵌套for**
**案例:**
打印99乘法表

**案例代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 
#打印99乘法表，思考A*B的关系
for ((A=1;A<=9;A++))
  do
     for ((B=1;B<=$A;B++))
        do
           echo -n -e "$B*$A=$((A*B)) \t"
     done
     #换行
     echo 
done
```

## 二、for与数组

**for循环与数组**

2.1、使用for循环遍历读出数组

```
name=('tom' 'jarry' 'harry' 'barry')
for i in 0 1 2 3
  do
      echo ${name[$i]}
 done
```

2.2、使用for循环进行数组存值

```
for i in `seq 0 9`
  do
     read -p "name: " name[$i]
 done
 echo ${name[@]}
```

## 三、学习视频

[视频：for嵌套](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=60)
[视频：for实战](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=61)