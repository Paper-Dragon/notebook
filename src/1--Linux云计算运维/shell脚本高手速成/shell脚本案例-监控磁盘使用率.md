# job-监控磁盘使用率

## 案例需求

打印磁盘使用率脚本，对本机的磁盘使用率统计并打印结果
使用率小于80，绿色输出
使用率小于90，大于80，黄色输出
使用率小于95，大于90，红色输出

## 脚本应用场景：

磁盘使用率监控一般周期为小时、天，不会太频繁。

监控平台+监控脚本

计划任务+监控脚本

手动监控

## 解决问题

及时掌握磁盘容量，防止100%造成磁盘无法读取。

## 脚本思路

1. 检索本机磁盘
2. 判断磁盘使用率
3. 输出结果

## 实现代码

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 

#指定for条件的分割符为回车，一行一个条件
IFS=$'\n'

#1、遍历符合条件的每一行磁盘数据
for i in `df -Th|egrep -v "(tmpfs|sr0)"|tail -n +2|tr -s " "`;do
size=`echo $i|cut -d " " -f6|tr -d "%"`
name=`echo $i|cut -d " " -f1`

#2、判断每行中的磁盘使用率并输出结果
 if [ $size -ge 95 ];then
    #3、输出日志并关机，不许在写入数据
    logger "ERROR:$name use is $size.halt"
    halt -p
 elif [ $size -ge 90 ];then
 
    echo -e "\033[31m $name use is ${size}%\033[0m"
 elif [ $size -ge 80 ];then
    echo -e "\033[33m $name use is ${size}%\033[0m"
 else
    echo -e "\033[32m$name use is ${size}%\033[0m"
 fi
done
```

## 案例思考

```
思考磁盘IO队列、吞吐率、IOPS的监控方法
```