## 案例需求

判断计算机某个端口是否为OPEN状态,且能正常访问

## 脚本应用场景：

服务监控脚本+监控平台

手动监控

## 解决问题

实时掌握服务的运行状态，及时处理问题。

## 脚本思路

1、使用telnet命令连接远端机器的远端端口

2、接收连接反馈并分析结果

3、分析文件内容

4、打印结果

## 实现代码

```
#!/bin/bash
#Description: 
#Author: www.zutuanxue.com
#Created Time: 
#监控一个服务端口


#main

temp_file=`mktemp port_status.XXX`

#1、判断依赖命令telnet是否存在
[ ! -x /usr/bin/telnet ]&&echo "telnet: not found command"&& exit 1

#2、测试端口 $1 IP    $2 port
( telnet $1 $2 <<EOF
quit
EOF
) &>$temp_file

#3、分析文件中的内容，判断结果
if egrep "\^]" $temp_file &>/dev/null;then
	 #4、打印结果
   echo "$1 $2 is open"
else
   echo "$1 $2 is close"
fi

#5、删除临时文件
rm -f $temp_file
```

## 案例思考

```
#监控方法
#1）通过systemctl  service   服务启动状态  
#2）lsof 查看端口是否存在
#3）查看进程是否存在
   注意  压力过大 无法响应 |  服务down了  上述东西还在  监测不准确

#4）测试端口是否有响应    推荐
    #telnet 协议 
```