学会了输出，那么输出什么呢？当然是人类让计算机运算的数据，那么运算的数据来自哪里？

可以肯定是你或其他人给的，那如何给程序数据呢？

**那么我们就得看看如何实现人机交互了。**

- 比如计算机程序
- 比如信息录入系统

## 一、read命令

功能：默认接受键盘的输入，回车符代表输入结束
应用场景：人机交互
命令选项

```
-p打印信息
-t限定时间
-s不回显
-n输入字符个数
```

## 二、交互输入案例

**案例需求：**
写一个系统用户交互登录界面脚本，仿linux文本界面登录
**案例要点：**
了解linux文本界面登陆所需要的输出信息及界面布局

![login.gif](https://www.zutuanxue.com:8000/static/media/images/2020/9/24/1600910891275.gif)

**job实现步骤：**
1、根据linux文本界面登陆窗口输出信息，打印登陆提示信息
2、交互输入登陆账号
3、交互输入登陆密码

**代码实现：**

```
#job实现代码   02_login.sh
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Release: 
#Description: 仿真登陆

IP=`ifconfig ens33|egrep -w "inet"|awk '{print $2}'`

#1、清屏
clear
#2、输出提示信息
echo "CentOS Linux 8 (Core)"
echo -e "Kernel `uname -r` on an `uname -m`\n"

echo -e "Web console: https://localhost:9090/ or https://$IP:9090/ \n"

#3、交互输入登陆名
echo -n "$HOSTNAME login: "
read account

#4、交互输入密码
read -s -t30 -p "Password: " pw
echo
```

**实现效果：**

![login2.gif](https://www.zutuanxue.com:8000/static/media/images/2020/9/24/1600912191604.gif)