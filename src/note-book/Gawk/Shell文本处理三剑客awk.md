# Shell文本处理三剑客awk

## **2.1awk简介**

```text
awk 是一种编程语言，用于在linux/unix下对文本和数据进行处理。数据可以来自标准输入、一个或多个文件，或其它命令的输出。它支持用户自定义函数和动态正则表达式等先进功能，是linux/unix下的一个强大编程工具。它在命令行中使用，但更多是作为脚本来使用。awk的处理文本和数据的方式是这样的，它逐行扫描文件，从第一行到最后一行，寻找匹配的特定模式的行，并在这些行上进行你想要的操作。如果没有指定处理动作，则把匹配的行显示到标准输出(屏幕)，如果没有指定模式，则所有被操作所指定的行都被处理。awk分别代表其作者姓氏的第一个字母。因为它的作者是三个人，分别是Alfred Aho、Brian Kernighan、Peter Weinberger。gawk是awk的GNU版本，它提供了Bell实验室和GNU的一些扩展。
```

## **2.2awk的语法格式**

```text
awk [options] 'commands' filenames
awk [options] -f awk-script-file filenames

options：
-F   定义输入字段分隔符，默认的分隔符是空格或制表符(tab)
command：
BEGIN{}       {}                END{}
行处理前      行处理       行处理后
[root@xulei ~]# awk 'BEGIN{print 1/2} {print "ok"} END{print "-----------"}' /etc/hosts
0.5
ok
ok
ok
-----------
BEGIN{} 通常用于定义一些变量，例如BEGIN{FS=":";OFS="---"}
awk命令格式：
awk 'pattern' filename  
示例：awk -F: '/root/' /etc/passwd     
awk '{action}' filename                     
示例：awk -F: '{print $1}' /etc/passwd         
awk 'pattern {action}' filename         
示例：awk -F: '/root/{print $1,$3}' /etc/passwd        
示例：awk 'BEGIN{FS=":"} /root/{print $1,$3}' /etc/passwd
command |awk 'pattern {action}'      
示例：df -P| grep  '/' |awk '$4 > 25000 {print $4}'

```

## **2.3awk工作原理**

```text
[root@xulei ~}# awk -F: '{print $1,$3}' /etc/passwd
(1)awk使用一行作为输入，并将这一行赋给内部变量$0，每一行也可称为一个记录，以换行符结束
(2)然后，行被:（默认为空格或制表符）分解成字段（或域），每个字段存储在已编号的变量中，从$1开始，
最多达100个字段
(3)awk如何知道用空格来分隔字段的呢？ 因为有一个内部变量FS来确定字段分隔符。初始时，FS赋为空格
(4)awk打印字段时，将以设置的方法使用print函数打印，awk在打印的字段间加上空格，因为$1,$3之间有一个逗号。逗号比较特殊，它映射为另一个内部变量，称为输出字段分隔符OFS，OFS默认为空格
(5)awk输出之后，将从文件中获取另一行，并将其存储在$0中，覆盖原来的内容，然后将新的字符串分隔成字段并进行处理。该过程将持续到所有行处理完毕
```

## **2.4记录与字段相关内部变量：man awk**

```text
$0：     awk变量$0保存当前记录的内容                             [root@xulei ~]# awk -F: '{print $0}' /etc/passwd
NR：     The total number of input records seen so far.      [root@xulei ~]# awk -F: '{print NR, $0}' /etc/passwd /etc/hosts
FNR：   The input record number in the current input file    [root@xulei ~]# awk -F: '{print FNR, $0}' /etc/passwd /etc/hosts
NF：     保存记录的字段数，$1,$2...$100                           [root@xulei ~]# awk -F: '{print $0,NF}' /etc/passwd
FS：     输入字段分隔符，默认空格                                 [root@xulei ~]# awk -F: '/alice/{print $1, $3}' /etc/passwd
[root@xulei ~]# awk -F'[ :\t]' '{print $1,$2,$3}' /etc/passwd   
[root@xulei ~]# awk 'BEGIN{FS=":"} {print $1,$3}' /etc/passwd
OFS：     输出字段分隔符                                       [root@xulei ~]# awk -F: '/alice/{print $1,$2,$3,$4}' /etc/passwd
[root@xulei ~]# awk 'BEGIN{FS=":"; OFS="+++"} /^root/{print $1,$2,$3,$4}' passwd
RS:       The input record separator, by default a newline. [root@xulei ~]# awk -F: 'BEGIN{RS=" "} {print $0}' a.txt
ORS:      The output record separator, by default a newline. [root@xulei ~]# awk -F: 'BEGIN{ORS=""} {print $0}' passwd
区别：
字段分隔符: FS OFS  默认空格或制表符
记录分隔符: RS ORS 默认换行符

lab1:
[root@xulei ~]# awk 'BEGIN{ORS=" "} {print $0}' /etc/passwd 
将文件每一行合并为一行,ORS默认输出一条记录应该回车，加了一个空格
lab2:
[root@xulei ~]# head -1 /etc/passwd > passwd1
[root@xulei ~]# cat passwd1 
root:x:0:0:root:/root:/bin/bash
[root@xulei ~]# awk 'BEGIN{RS=":"} {print $0}' passwd1 
root
x
0
0
root
/root
/bin/bas
[root@xulei ~]# awk 'BEGIN{RS=":"} {print $0}' passwd1 |grep -v '^$' > passwd2
```

## **2.5格式化输出**

```text
print函数
[root@xulei ~]# date |awk '{print "Month: " $2 "\nYear: " $NF}'
[root@xulei ~]# awk -F: '{print "username is: " $1 "\t uid is: " $3}' /etc/passwd
[root@xulei ~]# awk -F: '{print "\tusername and uid: " $1,$3 "!"}' /etc/passwd

printf函数
[root@xulei ~]# awk -F: '{printf "%-15s %-10s %-15s\n", $1,$2,$3}'  /etc/passwd
[root@xulei ~]# awk -F: '{printf "|%-15s| %-10s| %-15s|\n", $1,$2,$3}' /etc/passwd

%s 字符类型
%d 数值类型
%f 浮点类型
占15字符
- 表示左对齐，默认是右对齐
printf默认不会在行尾自动换行，加\n
```

## **2.6awk模式和动作**

```text
    任何awk语句都由模式和动作组成。模式部分决定动作语句何时触发及触发事件。处理即对数据进行的操作。如果省略模式部分，动作将时刻保持执行状态。模式可以是任何条件语句或复合语句或正则表达式。模式包括两个特殊字段 BEGIN和END。使用BEGIN语句设置计数和打印头。BEGIN语句使用在任何文本浏览动作之前，之后文本浏览动作依据输入文本开始执行。END语句用来在awk完成文本浏览动作后打印输出文本总数和结尾状态。
模式可以是：

1.正则表达式：
匹配记录（整行）：
[root@xulei ~]# awk '/^alice/'  /etc/passwd
[root@xulei ~]# awk '$0 ~ /^alice/'  /etc/passwd
[root@xulei ~]# awk '!/alice/' passwd
[root@xulei ~]# awk '$0 !~ /^alice/'  /etc/passwd

匹配字段：匹配操作符（~ !~）
[root@xulei ~]# awk -F: '$1 ~ /^alice/'  /etc/passwd
[root@xulei ~]# awk -F: '$NF !~ /bash$/'  /etc/passwd

比较表达式：
比较表达式采用对文本进行比较，只有当条件为真，才执行指定的动作。比较表达式使用关系运算符,用于比较数字与字符串。

关系运算符
运算符         含义                           示例
<             小于                           x<y
<=          小于或等于                        x<=y
==            等于                           x==y
!=           不等于                           x!=y
>=          大于等于                          x>=y
>             大于                            x>y

[root@xulei ~]# awk -F: '$3 == 0' /etc/passwd
[root@xulei ~]# awk -F: '$3 < 10' /etc/passwd
[root@xulei ~]# awk -F: '$NF == "/bin/bash"' /etc/passwd
[root@xulei ~]# awk -F: '$1 == "alice"' /etc/passwd
[root@xulei ~]# awk -F: '$1 ~ /alic/ ' /etc/passwd
[root@xulei ~]# awk -F: '$1 !~ /alic/ ' /etc/passwd
[root@xulei ~]# df -P | grep  '/' |awk '$4 > 25000'

条件表达式：
[root@xulei ~]# awk -F: '$3>300 {print $0}' /etc/passwd
[root@xulei ~]# awk -F: '{ if($3>300) print $0 }' /etc/passwd
[root@xulei ~]# awk -F: '{ if($3>300) {print $0} }' /etc/passwd
[root@xulei ~]# awk -F: '{ if($3>300) {print $3} else{print $1} }' /etc/passwd

算术运算：+ - * / %(模) ^(幂2^3)
可以在模式中执行计算，awk都将按浮点数方式执行算术运算
[root@xulei ~]# awk -F: '$3 * 10 > 500' /etc/passwd
[root@xulei ~]# awk -F: '{ if($3*10>500){print $0} }' /etc/passwd

逻辑操作符和复合模式
&&          逻辑与     a&&b
||          逻辑或     a||b
!           逻辑非     !a
[root@xulei ~]# awk -F: '$1~/root/ && $3<=15' /etc/passwd
[root@xulei ~]# awk -F: '$1~/root/ || $3<=15' /etc/passwd
[root@xulei ~]# awk -F: '!($1~/root/ || $3<=15)' /etc/passwd

范围模式
[root@xulei ~]# awk '/Tom/,/Suzanne/' filename  

```

## **2.7awk脚本编程**

```text
条件判断
if语句：
格式
{if(表达式)｛语句;语句;...｝}
awk -F: '{if($3==0) {print $1 " is administrator."}}' /etc/passwd
awk -F: '{if($3>0 && $3<1000){count++;}}  END{print count}' /etc/passwd 　　//统计系统用户数

if...else语句:
格式
{if(表达式)｛语句;语句;...｝else{语句;语句;...}}
awk -F: '{if($3==0){print $1} else {print $7}}' /etc/passwd
awk -F: '{if($3==0) {count++} else{i++} }' /etc/passwd
awk -F: '{if($3==0){count++} else{i++}} END{print "管理员个数: "count ; print "系统用户数: "i}' /etc/passwd

if...else if...else语句：
格式
{if(表达式1)｛语句;语句；...｝else if(表达式2)｛语句;语句；...｝else if(表达式3)｛语句;语句；...｝else｛语句;语句；...｝}
awk -F: '{if($3==0){i++} else if($3>999){k++} else{j++}} END{print i; print k; print j}' /etc/passwd
awk -F: '{if($3==0){i++} else if($3>999){k++} else{j++}} END{print "管理员个数: "i; print "普通用个数: "k; print "系统用户: "j}' /etc/passwd 

循环
while:
[root@blackmed ~]# awk 'BEGIN{ i=1; while(i<=10){print i; i++}  }'
[root@blackmed ~]# awk -F: '/^root/{i=1; while(i<=7){print $i; i++}}' passwd
[root@blackmed ~]# awk  '{i=1; while(i<=NF){print $i; i++}}' /etc/hosts
[root@blackmed ~]# awk -F: '{i=1; while(i<=10) {print $0;  i++}}' /etc/passwd      //将每行打印10次
[root@blackmed ~]# cat b.txt 
111 222
333 444 555
666 777 888 999
[root@blackmed ~]# awk '{i=1; while(i<=NF){print $i; i++}}' b.txt                       //分别打印每行的每列
111
222
333
444
555
666
777
888
999

for:
[root@blackmed ~]# awk 'BEGIN{for(i=1;i<=5;i++){print i} }' //C风格for
1
2
3
4
5
[root@blackmed ~]# awk -F: '{ for(i=1;i<=10;i++) {print $0} }' /etc/passwd          //将每行打印10次
[root@blackmed ~]# awk -F: '{ for(i=1;i<=NF;i++) {print $i} }' passwd               //分别打印每行的每列
root
x
0
0
root
/root
/bin/bash
bin
x
1
1
bin
/bin
/sbin/nologin

数组
[root@xulei ~]# awk -F: '{username[++i]=$1} END{print username[1]}' /etc/passwd
root
[root@xulei ~]# awk -F: '{username[i++]=$1} END{print username[1]}' /etc/passwd 
bin
[root@xulei ~]# awk -F: '{username[i++]=$1} END{print username[0]}' /etc/passwd 
root

数组遍历：
1. 按索引遍历
2. 按元数个数遍历

按元数个数遍历
[root@xulei ~]# awk -F: '{username[x++]=$1} END{for(i=0;i<x;i++) print i,username[i]}' /etc/passwd
[root@xulei ~]# awk -F: '{username[++x]=$1} END{for(i=1;i<=x;i++) print i,username[i]}' /etc/passwd

按索引遍历
[root@xulei ~]# awk -F: '{username[x++]=$1} END{for(i in username) {print i,username[i]} }' /etc/passwd
[root@xulei ~]# awk -F: '{username[++x]=$1} END{for(i in username) {print i,username[i]} }' /etc/passwd
注：变量i是索引
```



