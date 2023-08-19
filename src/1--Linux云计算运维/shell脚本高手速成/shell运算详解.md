**计算机编程就是三大步：输入、运算、输出**

那么计算机运算有哪些呢，计算机能做哪些运算呢？

**我们来看看常见的计算机运算**

## 一、赋值运算

赋值运算符 =

```
 	a=10   
 	name='baism'
 
 重点：字符串必须用引号引起来
```

## 二、算术运算[四则运算]

### 2.1 运算符与命令

**四则运算符：** + - * \ 【加减乘除】
**扩展：** % ** 【取余 开方】

**运算命令:**

- 整形运算
	– expr
	– let
	– $(())
	– bc
- 浮点运算
	– bc

### 2.2 整形运算

expr 命令：只能做整数运算，格式比较古板，注意空格

```
[root@zutuanxue ~]# expr 1 + 1
2
[root@zutuanxue ~]# expr 5 - 2
3
[root@zutuanxue ~]# expr 5 \* 2  #注意*出现应该转义，否则认为是通配符
10
[root@zutuanxue ~]# expr 5 / 2
2
[root@zutuanxue ~]# expr 5 % 2
1
```

let命令:只能做整数运算，且运算元素必须是变量，无法直接对整数做运算

```
[root@zutuanxue ~]# let a=100+3;echo $a
103
root@zutuanxue ~]# let a=100-3;echo $a
97
[root@zutuanxue ~]# let a=100/3;echo $a
33
[root@zutuanxue ~]# let a=100*3;echo $a
300
[root@zutuanxue ~]# let a=100%3;echo $a
1
[root@zutuanxue ~]# let a=100**3;echo $a
1000000
[root@zutuanxue ~]# a=100
[root@zutuanxue ~]# let a++;echo $a
101
[root@zutuanxue ~]# let a--;echo $a
100
[root@zutuanxue ~]# let a-=3;echo $a
97
[root@zutuanxue ~]# let a+=5;echo $a
102
```

双小圆括号运算，在shell中(( ))也可以用来做数学运算

```
[root@zutuanxue ~]# echo $(( 100+3))
103
[root@zutuanxue ~]# echo $(( 100-3)) 
97
[root@zutuanxue ~]# echo $(( 100%3))
1
[root@zutuanxue ~]# echo $(( 100*3))
300
[root@zutuanxue ~]# echo $(( 100/3))
33
[root@zutuanxue ~]# echo $(( 100**3))     #开方运算
1000000
```

### 2.3 浮点运算

浮点运算是采用的命令组合的方式来实现的 echo “scale=N;表达式”|bc

```
[root@zutuanxue ~]# echo "scale=2;3+100"|bc
103
[root@zutuanxue ~]# echo "scale=2;100-3"|bc
97
[root@zutuanxue ~]# echo "scale=2;100/3"|bc
33.33
[root@zutuanxue ~]# echo "scale=2;100*3"|bc
300
```

### 2.4、练习案例

#### 2.4.1 实现一个四则运算计算器

**案例思考：** 计算器的功能: + - * \

**实现步骤：**
1、要求用户传输三个参数，num1 算术运算符 num2
2、运算输出结果

**实现代码**

```
##03_calculator.sh
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Release: 
#Description: 简单计算器

echo "$1 $2 $3"|bc
```

#### 2.4.2 内存使用率统计，要求打印内存使用率

**案例思考：**

- 物料1、内存总量 获得方式是什么 free top /proc/meminfo
- 物料2、内存使用量
- 物料3、内存使用率公式 使用量/总量*100%

**实现步骤：**

- 1、获取内存总量
- 2、获取内存使用量
- 3、运算输出结果

**实现代码**

```
#job实现代码  04_memory_use.sh
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Release: 
#Description:内存使用率计算脚本

#free
#1、获得内存总量
memory_total=`free -m|grep -i "mem"|tr -s " "|cut -d " " -f2`

#2、获得内存使用的量
memory_use=`free -m|grep -i "mem"|tr -s " "|cut -d " " -f3`

#3、计算输出
#运算的时候是否需要小数点 浮点运算，要考虑使用的命令 （难点 重点）
#echo "内存使用率: $((memory_use*100/memory_total))%"
#难点：浮点运算中，同优先级的情况下，大数除以小数 尽可能保证精确
echo "内存使用率: `echo "scale=2;$memory_use*100/$memory_total"|bc`%"
```

**实现效果**

```
#运算结果
[root@zutuanxue day2]# sh memory_use.sh 
Memory使用率: 2.61%
```

## 三、比较运算

计算机除了算术和赋值运算外，还有比较运算，比如说比较两个数的关系，比较两个字符串的关系【用户登录系统】等。接下来我们学习如何在shell中进行比较运算

### 3.1、整形比较运算

```
					运算符解释：

 精确比较
        -eq         等于 equal

        -gt         大于

        -lt         小于

 模糊比较
        -ge         大于或等于

        -le         小于或等于

        -ne         不等于
```

**通过test命令比较两个整数关系**

```
[root@zutuanxue ~]# test 100 -gt 300;echo $?
1
[root@zutuanxue ~]# test 100 -ge 300;echo $?
1
[root@zutuanxue ~]# test 100 -eq 300;echo $?
1
[root@zutuanxue ~]# test 100 -le 300;echo $?
0
[root@zutuanxue ~]# test 100 -lt 300;echo $?
0
[root@zutuanxue ~]# test 100 -ne 300;echo $?
0

备注：linux命令test只能比较两个整数的关系，不会返回结果，需要通过$?才能看到结果
```

### 3.2 练习案例

#### 3.2.1 写一个脚本实现对两个证书关系的判断

**案例思考：**
两个数有几种关系？

- 1、大于
- 2、小于
- 3、等于

**实现步骤**

- 1、交互或者外传参的方式获得两个整数
- 2、判断关系
- 3、输出结果

**实现代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#
#Release: 
#Description:判断两个数的关系

#1、输入两个数，$1 $2

#2、判断两个数关系
if [ $1 -gt $2 ];then
  #3、输出结果
  echo "$1 > $2 "
elif [ $1 -eq $2 ];then
  echo "$1 = $2"
else
  echo "$1 < $2"
fi
```

**实现结果：**

![比较两个数关系.gif](https://www.zutuanxue.com:8000/static/media/images/2020/9/24/1600942462497.gif)

#### 3.2.2 判断两个浮点数的关系

**案例思考**
shell中的浮点类型如何做比较运算？

```
默认情况下shell是不能判断浮点的，那么在linux中又避免不了需要进行浮点运算，那怎么解决

解决思路如下：
1）两个数据同时放大到整数倍
2）处理掉小数点位，保留整数位
3）进行整形判断
```

**实现代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#
#Release: 
#Description:判断两位小数点的关系

#1、交互或者外传参的方式获得两个整数
#$1 $2
[ $# -lt 2 ]&&echo "need two args"&&exit 1

#采用外传参的方式接收数据并放大100倍,并处理为整数
num1=`echo "scale=2;$1*100"|bc|cut -d "." -f1`
num2=`echo "scale=2;$2*100"|bc|cut -d "." -f1`

#2、比较运算
if [ $num1 -gt $num2 ];then
   #3、输出结果
   echo "$1 > $2"
elif [ $num1 -lt $num2 ];then
   echo "$1 < $2"
else
   echo "$1 = $2"
fi
```

**实现结果**

![比较两个浮点数关系.gif](https://www.zutuanxue.com:8000/static/media/images/2020/9/24/1600942985455.gif)

### 3.3、字符串比较运算

#### 3.3.1 字符串比较运算符

```
运算符解释，注意字符串一定别忘了使用引号引起来
  ==          等于   
  !=          不等于
  -n          检查字符串的长度是否大于0  
  -z          检查字符串的长度是否为0
```

#### 3.3.2 比较两个字符串关系

```
[root@zutuanxue ~]# test 'root' == 'root';echo $?
0
[root@zutuanxue ~]# test 'root' != 'root1';echo $?
0
[root@zutuanxue ~]# name=
[root@zutuanxue ~]# test -n "$name";echo $?
1
[root@zutuanxue ~]# test -z "$name";echo $?
0
```

#### 3.3.3 练习案例

**案例需求：**
模拟一个linux文本界面登陆程序，要求账号密码验证成功进入系统，账号密码验证失败退回登陆界面

**案例思考：**

- 1、熟悉linux文本界面登陆步骤
- 2、熟悉字符串比较运算

**案例步骤：**

- 1、预设正确账号、密码
- 2、输出提示登录信息并实现交互登录
- 3、输出密码输入信息并实现交互
- 4、判断输入是否正确
	– 4.1）正确，进入系统
	– 4.2）不正确 继续运行该脚本

**实现代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: 仿真登陆
####
default_account='root'
default_pw='123456'


######main
#1、清屏
clear
#2、输出提示信息
echo "CentOS Linux 7 (Core)"
echo -e "Kernel `uname -r` on an `uname -m`\n"

#3、交互输入登陆名
echo -n "$HOSTNAME login: "
read account

#4、交互输入密码
read -s -t30 -p "Password: " pw

#5、判断用户输入是否正确
if [ "$default_account" == "$account" ] && [ "$default_pw" == "$pw" ];then
   clear
   echo -e "\nwelcome to root"
else
   echo  "用户名或密码错误..."
   #输入错误，再次调用本脚本
   sh $0
fi
```

**实现效果**
账号:root 密码:123456

![仿真登陆01.gif](https://www.zutuanxue.com:8000/static/media/images/2020/9/24/1600943778077.gif)

## 四、逻辑运算

完成一个任务中需要多个条件都满足或者多个条件中只要满足一个即可，那么这就是我们的逻辑运算。
通过多个条件判断结果，才能得出结论

#### 4.1、逻辑运算应用场景

```
多条件同时判断
```

#### 4.2、逻辑运算符

-  逻辑与运算 &&
-  逻辑或运算 ||
-  逻辑非运算 ！

**逻辑运算秘籍**

```
逻辑运算注意事项：
    逻辑与 或 运算都需要两个或以上条件
    逻辑非运算只能一个条件。
    口诀:     逻辑与运算               真真为真 真假为假   假假为假
             逻辑或运算               真真为真 真假为真   假假为假
             逻辑非运算               非假为真   非真为假
             
             
逻辑与或的短路运算
逻辑与中靠前的条件中出现了假，后面的就不在判断了，因为已经是假的了
逻辑或中靠前的条件中出现了真，后不在往后判断了，结果已经为真了
```

### 4.3、练习案例

明白了逻辑运算符和逻辑运算的口诀和短路运算后，我们来通过练习加深理解，接下来我们来看一个案例。
上一个字符串运算练习案例(3.3.3)中我们练习的是仿真用户登录，判断登陆的方式是分步判断的，既先判断用户名，不管是否正确都会继续判断密码的正确性，这样是两步判断，既然已知用户名是错误的啦，完全没必要在判断密码的正确性了，因为结果都一样，你不能进入系统。既然判断一个用户输入的用户名和密码是否正确，且一个不正确就不能进入系统，那么我们可以这么去思考一下：**两个条件全为真则进入系统，两个条件一个为假则重新登陆**。这样是不是就满足了逻辑与运算了，同时思考逻辑与运算的短路运算，逻辑与条件中的判断顺序是从前往后，前边一个条件为假的时候，后边的条件就不用判断了，那么就减少了判断的次数，加快了运算速度。你品！你细品！！是不是这个道理。

#### 4.3.1、就按照刚才的思路再去写一个升级版的仿真用户登录系统。

**案例需求**
使用逻辑运算写一个仿真用户登录验证程序

**案例思路**

- 1、输入用户名
- 2、输入密码
- 3、与运算返回结果

**案例代码**

```
#!/bin/bash
echo "CentOS linux 8 (Core)"
echo -e "Kernel `uname -r` on an `uname -m` \n"

#1、输入用户名
echo -n "$HOSTNAME login: "
read myuser

#echo -n "password: "
#read -s -t 5 -n 2 pw

#2、输入密码
read -p "password: " -s -t 5 -n 6 pw

#3、与运算返回结果
[ $myuser == 'root' ] && [ $pw == '123456' ] && echo yes || echo no
```

#### 4.3.2 丈母娘择婿

**案例需求**
伟大、慈祥的丈母娘有女儿，她想给自己的女儿选一个女婿，所以就想通过网上招婿的方式去处理，为了节约成本，让你帮忙开发一个小程序来自动过滤一下不满足条件的男士。
改程序为了能够满足大量丈母娘的需求，所以可以根据女儿的年龄做出不同的判断

- 姑娘20岁 应征男士条件：房子需要两套及以上、存款100W及以上、车子1辆以上，条件必须全部满足
- 姑娘30岁 应征男士条件：房子需要两套及以上、存款100W及以上、车子1辆以上，条件满足其中一个即可
- 姑娘40岁 应征男士条件：是男的都可以报名
	注意：应征者必须全是男性

**案例思考**
因为是多条件判断，复合逻辑运算的条件，重点在不同年龄段的逻辑判断方式！

**案例步骤**

- 1、要求传入两个参数：姑娘年龄、应征者行吧
- 2、交互输入用户条件
- 3、判断用户条件并输出结果

**案例代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#
#Release: 
#Description: 丈母娘选女婿  练习逻辑运算

cat <<EOF
游戏规则:
    1）根据交互输入信息，让脚本去判断是否满足条件。
    2）判断条件如下:
        第一次 姑娘20岁    要求应征男子报名条件 房子需要两套及以上、存款100W及以上、车子1辆以上
	第二次 姑娘30岁               			以上条件满足一个即可
	第三次 姑娘40岁					是男的都可以报名
    3) 脚本执行方法  $0 姑娘年龄[20|30|40] 应征者性别[男|女]
EOF


#1、判断传递参数数量，要求两个
if [ $# -lt 2 ];then
   echo 'need two args $1 $2'
   exit 1
fi

#2、交互输入
read -p "请输入你的存款: " money
read -p "请输入你的房子数量: " zhangse
read -p "请输入你车子的数量: " car

#3、判断应征条件，并给出结果
#姑娘20岁代码
if [ $1 -eq 20 ] && [ $money -gt 1000000 ] && [ $zhangse -ge 2 ] && [ $car -ge 1 ] && [ "$2" == "男" ];then
    echo "初始通过，等待姑娘复试吧"
#姑娘30岁代码
elif [ $1 -eq 30 ] && [ "$2" == "男" ] && ( [ $money -gt 1000000 ] || [ $zhangse -ge 2 ] || [ $car -ge 1 ] );then
    echo "初始通过，等待姑娘复试吧"
#姑娘40岁代码
elif [ $1 -eq 40 ] && [ ! $2 == "女" ];then
    echo "初始通过，等待姑娘复试吧"
else
   echo "你不满足条件,byebye"
fi
```

## 五、文件判断[文件类型、权限、新旧判断]

linux的设计思路：一切皆文件，对文件系统的操作其实可以狭隘的理解为对文件的操作。如果希望对文件类型和权限或者两个文件做新旧或者是否同一个文件进行判断。

## 5.1、test判断命令

**命令功能：** 检测文件类型和比较运算

**命令用法**

```
			test [命令选项] 表达式
```

**命令选项**

```
-d  检查文件是否存在且为目录
-e  检查文件是否存在
-f  检查文件是否存在且为文件
-r  检查文件是否存在且可读
-s  检查文件是否存在且不为空
-w  检查文件是否存在且可写
-x  检查文件是否存在且可执行
-O  检查文件是否存在并且被当前用户拥有
-G  检查文件是否存在并且默认组为当前用户组
-nt file1 -nt file2  检查file1是否比file2新
-ot file1 -ot file2  检查file1是否比file2旧     
-ef file1 -ef file2  检查file1是否与file2是同一个文件，判定依据的是i节点

以上只列出部分命令选项，详细的可以通过:man test获得。
```

**命令用法练习**

```
文件类型
[root@zutuanxue ~]# test -f /etc/passwd;echo $?
0
[root@zutuanxue ~]# test -f /etc;echo $?
1
[root@zutuanxue ~]# test -d /etc;echo $?
0

权限判断
[root@zutuanxue ~]# test -x /root/anaconda-ks.cfg ;echo $?
1
[root@zutuanxue ~]# ll /root/anaconda-ks.cfg 
-rw-------. 1 root root 1216 6月  26 09:06 /root/anaconda-ks.cfg
[root@zutuanxue ~]# test -r /root/anaconda-ks.cfg ;echo $?
0

[root@zutuanxue ~]# test -w /root/anaconda-ks.cfg ;echo $?
0
```

## 5.2、练习案例

**案例需求**
写一个平滑关闭服务脚本。

**案例思路**

- 判断服务进程文件是否存在，存在读取PID并判断是否存在进程
- 进程存在就使用Kill命令结束服务
- 不存在就报“服务已经结束“

**案例步骤**
1、检查服务PID文件
2、检查进程是否存在
3、杀死进程

**案例代码**

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#
#Release: 
#Description:找到服务的PID号,如果服务开启则杀死，否则提示服务已经关闭或不存在

#1、判断PID
#注意PID的路径，如果服务的PID不在这里可以做个软连接
if [ -f /var/run/$1.pid ];then
   #2、如果存在
   PID=`cat /var/run/$1.pid`
   #3、统计进程数
   process_num=`ps aux|grep $PID|wc -l`
   #5、判断进程数大于2则杀死
   if [ $process_num -ge 2 ];then
       kill -s QUIT $PID 
   else
   #5、判断小于2则提示进程不存在,同时删除服务PID文件
   	echo "service $1 is close"
        rm -f /var/run/$1.pid
   fi
else
   #2、不存在
   echo "service $1 is close"
fi
```