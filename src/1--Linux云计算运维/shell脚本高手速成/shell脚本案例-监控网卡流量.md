# job-网卡流量监控

## 案例需求

网卡发送和就收数据量监控，按秒统计。

**思考:** 如何获取某块网卡上一秒的流入、流出数据流量
ifconfig中可以获得，你知道吗？

![网卡流量.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601963911887.png)

## 脚本应用场景：

动态监控网卡的流量

## 解决问题

实时掌握网卡的流量，掌握带宽使用情况

## 脚本思路

1、获得网卡当前流入流出总量

2、休息一秒

3、获得网卡当前流入流出总量

4、运算得出上一秒网卡流量

5、输出结果

## 实现代码

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 网卡流量监控


#脚本用法
#判断用户是否传参
if [ -z "$1"] || [ "$1" == "--help" ];then
  cat << EOF
$0 网卡名称
--help 打印帮助菜单
EOF
fi



#如果用户没有传参，则退出脚本
[ $# -lt 1 ]&&exit 1

#第一次取值
#1、获得当前网卡流量 初始化值
NIC_RX=`ifconfig $1|grep "RX packets"|tr -s " "|cut -d " " -f6`
NIC_TX=`ifconfig $1|grep "TX packets"|tr -s " "|cut -d " " -f6`

#休息一秒开始循环
sleep 1


#循环开始监控网卡流量 监控频率 1s
while :
  do
     #2、监控当前网络的流量,第二次取值
     NIC_RX_1=`ifconfig $1|grep "RX packets"|tr -s " "|cut -d " " -f6`
     NIC_TX_1=`ifconfig $1|grep "TX packets"|tr -s " "|cut -d " " -f6`  
     
     #3、制作输出
     #3.1、清屏输出下文
     clear
     echo -e "\t$1 网卡流量监控"
     echo "----------------------------------------"
     echo -e "网卡: $1\n"
     #3.2、运算得出结论
      echo -e "发送:\t$((NIC_TX_1-NIC_TX))B/s\t接收:\t$((NIC_RX_1-NIC_RX))B/s"
     
     #重新赋值网卡初始化流入流出变量
     NIC_RX=$NIC_RX_1
     NIC_TX=$NIC_TX_1
     
     #休眠1秒,进入下一次循环
     sleep 1
done
```

## 案例思考

```
如何采用图表的方式输出网卡信息
```