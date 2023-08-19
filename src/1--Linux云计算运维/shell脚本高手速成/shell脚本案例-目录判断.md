## 案例需求

判断/tmp/run目录是否存在，如果不存在就建立，如果存在就删除目录里所有文件

## 脚本应用场景：

脚本中对文件和文件夹类型的及权限的判断

## 解决问题

避免文件或者文件夹的重复建立问题

## 脚本思路

1. 判断文件夹/tmp/run目录是否存在
2. 存在 删除目录下内容
3. 不存在 退出脚本

## 实现代码

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 判断/tmp/run目录是否存在

#1、判断文件夹/tmp/run目录是否存在
if [ -d /tmp/run ];then
   #2、存在 删除目录下内容
   rm -rf /tmp/run/*
else
   #3、不存在 退出脚本
   exit 0
fi
```