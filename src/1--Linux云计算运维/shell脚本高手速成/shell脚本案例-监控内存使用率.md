## 案例需求

打印内存使用率脚本，打印内存使用率、swap使用率、buff&cache使用量

**实现效果**

```
#实现演示
内存使用率: 2.69%,buff&cache:535 MB
Swap使用率: 0%
```

## 脚本应用场景：

监控平台+内存监控脚本

手动监控

## 解决问题

随时掌握业务对内存的占用，合理使用内存资源

## 脚本思路

1、获取物理内存、swap的相关数据

 1.1通过数据检索获得物理内存总量、Swap的总量

 1.2通过数据检索获得物理内存的使用量，Swap的使用量

 1.3通过检索获得物理内存buff&cache的量

2、调用相关数据进行运算，并输出结果

## 实现代码

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description:内存使用率计算脚本

#1、通过free命令结合数据处理获得对应数据
#1.1、获得内存总量
memory_totle=`free -m|grep -i "mem"|tr -s " "|cut -d " " -f2`
swap_totle=`free -m|grep -i "swap"|tr -s " "|cut -d " " -f2`
#1.2、获得内存使用的量
memory_use=`free -m|grep -i "mem"|tr -s " "|cut -d " " -f3`
swap_use=`free -m|grep -i "swap"|tr -s " "|cut -d " " -f3`
#1.3、buff/cache
buff_cache=`free -m|grep -i "mem"|tr -s " "|cut -d " " -f6`

#2、计算输出
#运算的时候是否需要小数点 浮点运算，要考虑使用的命令 （难点 重点）
#echo "内存使用率: $((memory_use*100/memory_totle))%"
#难点：浮点运算中，同优先级的情况下，大数除以小数 尽可能保证精确
echo "内存使用率: `echo "scale=2;$memory_use*100/$memory_totle"|bc`%,buff&cache:$buff_cache MB"
echo "Swap使用率: `echo "scale=2;$swap_use*100/$swap_totle"|bc`%"
```

## 案例思考

```
内存获取的方式
内存占用的优先级
```