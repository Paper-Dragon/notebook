## 案例需求

闰年判断:判断某年是否问闰年

## 闰年判断方法：

普通闰年:能被4整除但不能被100整除的年份为普通闰年。（如2004年就是闰年，1900年不是闰年）
世纪闰年:能被400整除的为世纪闰年。（如2000年是世纪闰年，1900年不是世纪闰年）

## 脚本应用场景：

时间类型脚本总总时间的统计。

## 解决问题

时间计算中从某一年到某一年天数的统计 ，解决了闰年、平年的天数不同的问题。

## 脚本思路

1、交互输入year

2、根据公式判断输出

3、输出判断结果

## 实现代码

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description:闰年判断脚本

#variables


#main
#1、交互输入要判断的年
read -p "输入一个年份: " year



#2、判断
if [ -z "$year" ];then
   echo "$0 year"
   exit 1
elif (($year%400==0));then
#3、输出结果
   echo "$year: 闰年"
elif (($year%4==0));then
   echo "$year: 闰年"
else
   echo "$year: 平年"
fi
```