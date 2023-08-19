## 案例需求

通过脚本判断远程计算机的存活状态

## 脚本应用场景

1、通过监控平台调用监控脚本对服务器进行监控

2、机器扫描

## 解决问题

1、运维人员实时掌控机器的状态，防止宕机或者由于压力过大造成请求处理延时,保障业务的稳定、高效运行

## 脚本思路

1、通过ICMP协议的ping命令ping目标主机

```
网络延迟，假报警如何解决？
  3次  
```

2、分析ping结果

3、给出结论

```
全部ping结果为假，报宕机
全部ping成功，报正常
否则报警告
```



## 实现代码

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 


#1、ping 目标主机三次，并接收每次的状态值,ping成功返回1，不成功返回0
for ((i=1;i<4;i++));do
#测试代码
   if ping -c1 $1 &>/dev/null;then

	#分析结果
        export ping_count"$i"=1

   else
        export ping_count"$i"=0
   fi

#时间间隔
   sleep 0.3
done

#3、分析结果
#  3次ping失败报警
# 
if [ $ping_count1 -eq $ping_count2 ] && [ $ping_count2 -eq $ping_count3 ]&&[ $ping_count1 -eq 0 ];then
    echo "$1  宕机"
elif [ $ping_count1 -eq $ping_count2 ] && [ $ping_count2 -eq $ping_count3 ]&&[ $ping_count1 -eq 1 ];then
    echo "$1  正常"
else
    echo "warn: $1 网络延迟"
fi 

#4、释放变量
unset ping_count1 
unset ping_count2  
unset ping_count3
```

## 案例思考

```
当你的机器放在IDC机房的时候，你如何判断各个运营商的用户到你服务器的以下数据。

网络延迟如何获得

网络丢包率如何获得
```