# Awk案例入门

## 简介

- awk 擅长对列进行操作/进行数据信息操作
- awk 的基本使用（高级使用在shell)
- awk把文本文档看作是数据库，每一行看作一条数据库中的记录，可以指定数据列的分隔符，默认的分隔符是”\t”,即Tab。
- awk工作流程是这样的：读入有’\n’换行符分割的一条记录，然后将记录按指定的域分隔符划分域，填充域，$0则表示所有域, 1 表 示
- 第 一 个 域 , 1表示第一个域, 1表示第一个域,n表示第n个域。默认域分隔符是”空白键” 或 “[tab]键”
- awk的执行模式是： awk '{pattern + action}' {filenames}

```bash
sed [参数] ‘条件-处理方式 文件

sed [参数]  ’模式-动作'  文件

awk [-F|-f|-v] ‘BEGIN{} //{command1; command2} END{}’ file

```

## awk 变量

|变量 | 描述|
|--|--|
|$n | 当前记录的第n个字段，字段间由FS分隔|
|$0 | 完整的输入记录（默认就是文本的每一行）|
|ARGC | 命令行参数的数目|
|ARGIND | 命令行中当前文件的位置(从0开始算)|
|ARGV | 包含命令行参数的数组|
|CONVFMT | 数字转换格式(默认值为%.6g)ENVIRON环境变量关联数组|
|ERRNO | 最后一个系统错误的描述|
|FIELDWIDTHS | 字段宽度列表(用空格键分隔)|
|FILENAME | 当前文件名|
|FS | 字段分隔符(默认是任何空格) Field Separator|
|IGNORECASE | 如果为真，则进行忽略大小写的匹配|
|NF | 一条记录的字段的数目 Number for Field，表示的是浏览记录的域的个数，即被分隔符切开以后，一共有多少列|
|$NF | 从后往前数， N F 表 示 的 最 后 一 个 F i e l d （ 列 ） ， 即 输 出 最 后 一 个 字 段 的 内 容 ， 倒 数 第 二 列 ‘ NF 表示的最后一个Field（列），即输出最后一个字段的内容，倒数第二列`NF表示的最后一个Field（列），即输出最后一个字段的内容，倒数第二列‘(NF-1)`|
|NR | 已经读出的记录数，就是行号，从1开始 Number of Record|
|FNR | 各文件分别计数的行号 FILE Number of Record|
|OFMT | 数字的输出格式(默认值是%.6g)|
|OFS | 输出记录分隔符（输出换行符），输出时用指定的符号代替换行符 Output Field Separator|
|ORS | 输出记录分隔符(默认值是一个换行符) Output Record Separator|
|RLENGTH | 由match函数所匹配的字符串的长度|
|RS | 记录分隔符(默认是一个换行符) Record Separator|
|RSTART | 由match函数所匹配的字符串的第一个位置|
|SUBSEP | 数组下标分隔符(默认值是/034)|
|~ | 匹配，与==相比不是精确比较|
|!~ | 不匹配，不精确比较|
|== | 等于，必须全部相等，精确比较|
|!= | 不等于，精确比较|
|&& | 逻辑与|
|\|\||逻辑或|
|+ | 匹配时表示1个或1个以上|
|/[0-9][0-9]+/ | 两个或两个以上数字|
|/[0-9][0-9]*/ | 一个或一个以上数字|

### $n

$1这种内置变量的外侧不能加入双引号，否则$1会被当做文本输出

```
[root@boy ~]# cat test 
abc 123 iuy ddd
8ua 456 auv php 7y7

[root@boy ~]# awk '{print $1}' test 
abc
8ua
[root@boy ~]# awk '{print "$1"}' test
$1
$1

awk '{print $1; print $2}' test
=
awk '{print $1} {print $2}'

    1
    2
    3
```

### OFS

```
[root@boy ~]# cat test 
abc 123 iuy ddd
8ua 456 auv php 7y7

[root@boy ~]# awk -v FS=' ' -v OFS='---' '{print $1,$2}' test
abc---123
8ua---456

```

### FNR

```
[root@boy ~]# cat test test1
abc 123 iuy ddd
8ua 456 auv php 7y7
abc 123 iuy ddd
8ua 456 auv php 7y7

# awk处理多个文件的时候，如果使用NR显示行号，那么，多个文件的所有行会按照顺序进行排序
[root@boy ~]# awk '{print NR,$0}' test test1
1 abc 123 iuy ddd
2 8ua 456 auv php 7y7
3 abc 123 iuy ddd
4 8ua 456 auv php 7y7

# FNR的作用就是当awk处理多个文件时，分别对每个文件的行数进行计数
[root@boy ~]# awk '{print FNR,$0}' test test1
1 abc 123 iuy ddd
2 8ua 456 auv php 7y7
1 abc 123 iuy ddd
2 8ua 456 auv php 7y7
```

### RS

```
# RS是输入行分隔符，如果不指定，默认的”行分隔符”就是我们所理解的”回车换行
# 假设，我们不想以默认的”回车换行”作为”行分隔符”，而是想使用空格作为所谓的行分隔符，也就是说，我们想让awk认为，每遇到一个空格，就换行，换句话说，我们想让awk以为每次遇到一个空格就是新的一行

[root@boy ~]# awk '{print NR,$0}' test 
1 abc 123 iuy ddd
2 8ua 456 auv php 7y7
[root@boy ~]# awk -v  RS=" " '{print NR,$0}' test 
1 abc
2 123
3 iuy
4 ddd
8ua
5 456
6 auv
7 php
8 7y7
```

### ORS

```
# awk将人类眼中的”回车换行”，当做”输出行分隔符”，此时，awk的”世界观”与人类的”世界观”是相同的。现在，我们改变一下awk的想法，我们让awk认为，”+++”才是真正的输出行分隔符

[root@boy ~]# awk '{print NR,$0}' test 
1 abc 123 iuy ddd
2 8ua 456 auv php 7y7

[root@boy ~]# awk -v ORS="+++" '{print NR,$0}' test
1 abc 123 iuy ddd+++2 8ua 456 auv php 7y7+++[root@boy ~]#

[root@boy ~]# awk -v RS=" " -v ORS="+++" '{print NR,$0}' test
1 abc+++2 123+++3 iuy+++4 ddd
8ua+++5 456+++6 auv+++7 php+++8 7y7
+++[root@boy ~]# 
```

### FILENAME

```
# FILENAME这个内置变量，从字面上，就能看出是什么意思，没错，就是显示文件名，演示效果如下
[root@boy ~]# cat test test1
abc 123 iuy ddd
8ua 456 auv php 7y7
abc 123 iuy ddd
8ua 456 auv php 7y7

[root@boy ~]# awk '{print FILENAME,FNR,$0}' test test1
test 1 abc 123 iuy ddd
test 2 8ua 456 auv php 7y7
test1 1 abc 123 iuy ddd
test1 2 8ua 456 auv php 7y7
```

### ARGC&ARGV

```
# ARGV内置变量表示的是一个数组，这个数组中保存的是命令行所给定的参数
# ARGV内置变量表示的是一个数组，既然是数组，就需要用下标的方式，引用对应元素的值，因为数组的索引都是从0开始的，所以，ARGV[1]表示引用ARGV数组中的第二个元素的值，从返回结果可以看出，ARGV[1]对应的值为test，同理，我们又使用第三条命令，多打印了一个ARGV[2]的值，发现ARGV[2]对应的值为test1，这个时候，你明白ARGV内置变量的含义了吗，说白了，ARGV内置变量表示的是：所有参数组成的数组,ARGV[0]: awk本身

[root@boy ~]# awk 'BEGIN{print "aaa"}' test test1
aaa
[root@boy ~]# awk 'BEGIN{print "aaa",ARGV[1]}' test test1
aaa test
[root@boy ~]# awk 'BEGIN{print "aaa",ARGV[1],ARGV[2]}' test test1
aaa test test1
[root@boy ~]# awk 'BEGIN{print "aaa",ARGV[1],ARGV[2],ARGV[0]}' test test1
aaa test test1 awk
```

```
# awk、test1、test2，这三个参数作为数组的元素存放于ARGV中，现在，而ARGC则表示参数的数量，也可以理解为ARGV数组的长度
[root@boy ~]# awk 'BEGIN{print "aaa",ARGV[1],ARGV[2],ARGV[0],ARGC}' test test1
aaa test test1 awk 3
```

### 自定义变量

有两种方法可以自定义变量

- -v varname=value 变量名区分字符大小写
- 在program中直接定义

```
# -v varname=value 自定义变量
[root@boy ~]# awk -v myVar="test var" 'BEGIN{print myVar}'
test var

# 当我们需要在awk中引用shell中的变量的时候，则可以通过方法一间接的引用
[root@boy ~]# aaa=111
[root@boy ~]# awk -v myvar=$aaa 'BEGIN{print myvar}'
111
```

```
# 直接在program中定义即可，但是注意，变量定义与动作之间需要用分号”;”隔开

[root@boy ~]# awk 'BEGIN{myvar="ttt"; print myvar}'
ttt

# 定义多个变量
[root@boy ~]# awk 'BEGIN{myvar1="ttt"; myvar2="ttt";  print myvar1,myvar2}'
ttt ttt

```

## awk -f

```
-f指定脚本文件

awk -f script.awk  file

BEGIN{
FS=":"

}

{print $1}               //效果与awk -F":" '{print $1}'相同,只是分隔符使用FS在代码自身中指定
```

## awk -F

```
# 选取二个作为分隔符,用:和,二个作为分隔符
awk -F ":|," XXX  

# 将每一行的前二个字段，分行输出，进一步理解一行一行处理文本
awk -F: '{print $1; print $2}'   /etc/passwd                   

# 输出字段1,3,6，以制表符作为分隔符
awk  -F: '{print $1,$3,$6}' OFS="\t" /etc/passwd
```

```
# -F指定分隔符,$1 指指定分隔符后，第一个字段，$3第三个字段， \t是制表符
# 一个或多个连续的空格或制表符看做一个定界符，即多个空格看做一个空格

# 姓氏是zhang的人,显示他的第二次捐款金额及他的名字,[ :]+这个是正则表达式，+表示一个或多个，这里就表示一个或多个空格或冒号
awk -F "[ :]+" '/Zhang/{print $1,$2,$(NF-1)}' reg.txt

awk -F":" '{print $1 $3}'  /etc/passwd                       # $1与$3相连输出，不分隔

awk -F":" '{print $1,$3}'  /etc/passwd                      # 多了一个逗号，$1与$3使用空格分隔

awk -F":" '{print $1 " " $3}'  /etc/passwd                  # $1与$3之间手动添加空格分隔

awk -F":" '{print "Username:" $1 "\t\t Uid:" $3 }' /etc/passwd   # 自定义输出  

awk -F: '{print NF}' /etc/passwd                                 # 显示每行有多少字段

awk -F: '{print $NF}' /etc/passwd                               # 将每行第NF个字段的值打印出来

 awk -F: 'NF==4 {print }' /etc/passwd                       # 显示只有4个字段的行

awk -F: 'NF>2{print $0}' /etc/passwd                        # 显示每行字段数量大于2的行

awk '{print NR,$0}' /etc/passwd                             # 输出每行的行号

awk -F: '{print NR,NF,$NF,"\t",$0}' /etc/passwd             # 依次打印行号，字段数，最后字段值，制表符，每行内容

awk -F: 'NR==5{print}'  /etc/passwd                         # 显示第5行

awk -F: 'NR==5 || NR==6{print}'  /etc/passwd                # 显示第5行和第6行

```

```
awk -F: '{if($3>100) print "large"; else print "small"}' /etc/passwd

#  ID大于100,A加1，否则B加1
awk -F: 'BEGIN{A=0;B=0} {if($3>100) {A++; print "large"} else {B++; print "small"}} END{print A,"\t",B}' /etc/passwd                         
awk -F: '{if($3<100) next; else print}' /etc/passwd                         # 小于100跳过，否则显示

awk -F: 'BEGIN{i=1} {if(i<NF) print NR,NF,i++ }' /etc/passwd   

awk -F: 'BEGIN{i=1} {if(i<NF) {print NR,NF} i++ }' /etc/passwd

# 另一种形式

awk -F: '{print ($3>100 ? "yes":"no")}'  /etc/passwd 

awk -F: '{print ($3>100 ? $3":\tyes":$3":\tno")}'  /etc/passwd
```

```
awk -F'[:#]' '{print NF}'  helloworld.sh          # 指定多个分隔符: #，输出每行多少字段

awk -F'[:#]' '{print $1,$2,$3,$4,$5,$6,$7}' OFS='\t' helloworld.sh   //制表符分隔输出多字段

```

## awk 匹配

```
# 第一种语法是正则模式的语法，表示被正则表达式匹配到的行，将会执行对应的动作
 awk '/正则表达式/{动作}'  /xxx/

# 二种语法是行范围模式的语法，它表示，从被正则1匹配到的行开始，到被正则2匹配到的行结束，之间的所有行都会执行对应的动作，所以，这种模式被称为行范围模式，因为它对应的是一个范围以内的所有行，但是需要注意的是，在行范围模式中，不管是正则1，还是正则2，都以第一次匹配到的行为准，就像上述示例中，即使Lee在第2行与第3行中都出现了，但是由于正则1先匹配到第2行中的lee，所以，最终打印出的内容从第2行开始，即使Kevin在第5行与第7行中都出现了，但是由于Kevin第一次出现在第5行，所以最终打印出的内容到第5行结束，也就是说，最终打印出了第2行到第5行以内的所有行
 awk '/正则1/,/正则2/{动作}'  /xxx/
```

```
# 匹配代码块，//纯字符匹配   !//纯字符不匹配   ~//字段值匹配    !~//字段值不匹配   ~/a1|a2/字段值匹配a1或a2   

cat /etc/passwd | awk '$NF !~/nologin|sync|shutdown|halt/'

lastlog | awk '$1 ~/'$i'/ {printf "用户名: %5s 端口：%5s 源IP：%5s 最后登录时间：%s-%s-%s日 %s\n",$1,$2,$3,$NF,$(NF-4),$(NF-3),$(NF-2)}'

awk '/mysql/' /etc/passwd

awk '/mysql/{print }' /etc/passwd

awk '/mysql/{print $0}' /etc/passwd                   //三条指令结果一样

awk '!/mysql/{print $0}' /etc/passwd                  //输出不匹配mysql的行

awk '/mysql|mail/{print}' /etc/passwd

awk '!/mysql|mail/{print}' /etc/passwd

awk -F: '/mail/,/mysql/{print}' /etc/passwd         //区间匹配

awk '/[2][7][7]*/{print $0}' /etc/passwd               //匹配包含27为数字开头的行，如27，277，2777...

awk -F: '$1~/mail/{print $1}' /etc/passwd           //$1匹配指定内容才显示

awk -F: '{if($1~/mail/) print $1}' /etc/passwd     //与上面相同

awk -F: '$1!~/mail/{print $1}' /etc/passwd          //不匹配

awk -F: '$1!~/mail|mysql/{print $1}' /etc/passwd        

# ~//字段值匹配
awk -F: '$1~/mail/' /etc/passwd#显示$1字段匹配mail的行
awk -F: '$1~/mail|sshd/' /etc/passwd#显示$1字段匹配mail或sshd的行

# !~//字段值不匹配
awk -F: '$1!~/mail/' /etc/passwd#显示$1字段不匹配mail的行
awk -F: '$1!~/mail|sshd/' /etc/passwd#显示$1字段不匹配mail或sshd的行
```

## awk begin&end

- BEGIN 模式：读入第一行文本之前执行的语句，一般用来初始化操作(后续读取不会执行了，只第一次执行)
- END 模式：处理完最后以行文本后执行，一般用来处理输出结果：被放置在所有的数据读取完成以后执行
- {}: 逐行处理

### exit

    它表示不再执行awk命令，相当于退出了当前的awk命，当在awk中使用了END模式时，exit的作用并不是退出整个awk命令，而是直接执行END模式中的动作

```
# 当在awk中执行了exit语句以后，之后的所有动作都不会再被执行，相当于退出了整个awk命令
[root@boy ~]# awk 'BEGIN{print 1 ; exit ; print 2 ; print 3 }'
1

# 在awk中使用了END模式时，exit的作用并不是退出整个awk命令，而是直接执行END模式中的动作
[root@boy ~]# awk 'BEGIN{print "start"; exit} { print "123" } END{ print "456" }'
start
456
```

### next

    next命令即可让awk直接从下一行开始处理，换句话说就是，next命令可以促使awk不对当前行执行对应的动作，而是直接处理下一行
    next与continue有些类似，只是，continue是针对”循环”而言的，continue的作用是结束”本次循环”，而next是针对”逐行处理”而言的，next的作用是结束”对当前行的处理”，从而直接处理”下一行”，其实，awk的”逐行处理”也可以理解成为一种”循环”，因为awk一直在”循环”处理着”每一行”

```
[root@boy ~]# awk '{ if(NR>1){ next } print $0 }' /etc/passwd
root:x:0:0:root:/root:/bin/bash
=
[root@boy ~]# awk '{ if(NR>1){ next } ; print $0 }' /etc/passwd
root:x:0:0:root:/root:/bin/bash
```

### 实例

```
# 文件开头加REDHAT，末尾加WESTOS，打印行号和内容
 awk -F: 'BEGIN {print "REDHAT"} {print NR;print} END {print "WESTOS"}' passwd 

[root@server19 mnt]# awk 'BEGIN{i=0}{i+=NF}END{print i}' test.txt 
7 
# 统计Nginx连接数
 netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a,S[a]}'
```

## awk if

### if 分支

```
# IF语句,必须用在{}中，且比较内容用()扩起来

awk -F: '{if($1~/mail/) print $1}' /etc/passwd                                       //简写

awk -F: '{if($1~/mail/) {print $1}}'  /etc/passwd                                   //全写

awk -F: '{if($1~/mail/) {print $1} else {print $2}}' /etc/passwd            //if...else...
```

```
# 统计登录shell为bash的用户
 awk -F: 'BEGIN{i=0}{if($7~/bash$/){i++}}END{print i}' /etc/passwd
# 统计/etc/passwd下uid小于500的用户个数
 awk -F: 'BEGIN{i=0}{if($3<500){i++}}END{print i}' /etc/passwd
```

### if 双分支

```
# 统计uid小于等于500和大于500的用户个数
 awk -F: 'BEGIN{i=0;j=0}{if($3<=500){i++}else{j++}}END{print i,j}' /etc/passwd
```

### 实例

```
# ”if”对应的大括号中有多条语句，所以”if”语法中的大括号不能省略，但是，如果”if”对应的大括号中只有一条命令，那么”if”对应的大括号则可以省略

awk '{ if(NR == 1){ print $0 }}' xxx
=
awk '{ if(NR == 1) print $0}'  xxx


# 判断出/etc/passwd文件中的哪些用户属于系统用户，哪些用户属于普通用户
awk -F ":" '{ if($3 < 500) {print $1,"系统用户"}} else{ print $1,"普通用户"}' xxx

awk 'NR != 1 {if($2 <= 30){print $1,"年轻人"} else if($2>=30 && $2<=50){print $1,"中年人"} else{print $1,"老年人"}}' xxx
```

## awk for

- continue的作用：跳出”当前”循环

- break的作用：跳出”整个”循环

```
# 生成1-5序列
 awk 'BEGIN{for(i=1;i<=5;i++){print i}}'

# 
 awk 'BEGIN{ for(i=1;i<=6;i++){print i}}'


[root@boy ~]# awk 'BEGIN{ for(i=0;i<=6;i++){if(i==3){continue}; print i}}'
0
1
2
4
5
6


```

## awk while

- continue的作用：跳出”当前”循环
- break的作用：跳出”整个”循环

### while

```
# 实例一：
 awk 'i=1 {} BEGIN {while (i<3) {++i;print i}}' test.txt 

# 实例二：
 awk 'BEGIN {do {++i;print i} while (i<3)}' test.txt 


awk -F: 'BEGIN{i=1} {while(i<NF) print NF,$i,i++}' /etc/passwd 


[root@boy ~]# awk -v i=1 'BEGIN{ while(i<=5){print i; i++}}'


[root@boy ~]# awk 'BEGIN{i=1;while(i<=5){print i;i++}}'
```

### do while

 do…while循环则是无论是否满足条件，都会先执行一遍do对应的代码，然后再判断是否满足while中对应的条件，满足条件，则执行do对应的代码，如果不满足条件，则不再执行do对应的代码

```
[root@boy ~]# awk 'BEGIN{i=1; do{print "test",i;i++}while(i<=5)}'
test 1
test 2
test 3
test 4
test 5

# i如果没有默认赋值，初始为空，i++后从1开始
[root@boy ~]# awk 'BEGIN{do{print "test",i;i++}while(i<=5)}'
test 
test 1
test 2
test 3
test 4
test 5
```

## awk 条件表达式

```
# 条件表达式    ==   !=   >   >=  

awk -F":" '$1=="mysql"{print $3}' /etc/passwd  

awk -F":" '{if($1=="mysql") print $3}' /etc/passwd          //与上面相同 

awk -F":" '$1!="mysql"{print $3}' /etc/passwd                 //不等于

awk -F":" '$3>1000{print $3}' /etc/passwd                      //大于

awk -F":" '$3>=100{print $3}' /etc/passwd                     //大于等于

awk -F":" '$3<1{print $3}' /etc/passwd                            //小于

awk -F":" '$3<=1{print $3}' /etc/passwd                         //小于等于
```

## awk 逻辑运算符

```
# 逻辑运算符 ，&&　|| 

awk -F: '$1~/mail/ && $3>8 {print }' /etc/passwd         //逻辑与，$1匹配mail，并且$3>8

awk -F: '{if($1~/mail/ && $3>8) print }' /etc/passwd

awk -F: '$1~/mail/ || $3>1000 {print }' /etc/passwd       //逻辑或

awk -F: '{if($1~/mail/ || $3>1000) print }' /etc/passwd 

```

## awk 数值运算

```


awk -F: '$3 > 100' /etc/passwd    

awk -F: '$3 > 100 || $3 < 5' /etc/passwd  

awk -F: '$3+$4 > 200' /etc/passwd

awk -F: '/mysql|mail/{print $3+10}' /etc/passwd                    # 第三个字段加10打印 

awk -F: '/mysql/{print $3-$4}' /etc/passwd                         # 减法

awk -F: '/mysql/{print $3*$4}' /etc/passwd                         # 求乘积

awk '/MemFree/{print $2/1024}' /proc/meminfo                       # 除法

awk '/MemFree/{print int($2/1024)}' /proc/meminfo                  # 取整
```

```
# 计算/home目录下，普通文件的大小，使用KB作为单位
ls -l|awk 'BEGIN{sum=0} !/^d/{sum+=$5} END{print "total size is:",sum/1024,"KB"}'

ls -l|awk 'BEGIN{sum=0} !/^d/{sum+=$5} END{print "total size is:",int(sum/1024),"KB"}'      # int是取整的意思


# 统计netstat -anp 状态为LISTEN和CONNECT的连接数量分别是多少
netstat -anp|awk '$6~/LISTEN|CONNECTED/{sum[$6]++} END{for (i in sum) printf "%-10s %-6s %-3s \n", i," ",sum[i]}'

# 统计/home目录下不同用户的普通文件的总数是多少？
ls -l|awk 'NR!=1 && !/^d/{sum[$3]++} END{for (i in sum) printf "%-6s %-5s %-3s \n",i," ",sum[i]}'   

# 统计/home目录下不同用户的普通文件的大小总size是多少？
ls -l|awk 'NR!=1 && !/^d/{sum[$3]+=$5} END{for (i in sum) printf "%-6s %-5s %-3s %-2s \n",i," ",sum[i]/1024/1024,"MB"}'
```

```
# 输出成绩表
[root@localhost home]# cat test0 
Marry   2143 78 84 77
Jack    2321 66 78 45
Tom     2122 48 77 71
Mike    2537 87 97 95
Bob     2415 40 57 62

awk 'BEGIN{math=0;eng=0;com=0;printf "Lineno.   Name    No.    Math   English   Computer    Total\n";printf "------------------------------------------------------------\n"}{math+=$3; eng+=$4; com+=$5;printf "%-8s %-7s %-7s %-7s %-9s %-10s %-7s \n",NR,$1,$2,$3,$4,$5,$3+$4+$5} END{printf "------------------------------------------------------------\n";printf "%-24s %-7s %-9s %-20s \n","Total:",math,eng,com;printf "%-24s %-7s %-9s %-20s \n","Avg:",math/NR,eng/NR,com/NR}' test0
```

## awk 数组

### 数组遍历

```
[root@boy ~]# cat test.sh 
#!/bin/awk

BEGIN{
 array[1]="boy1";
 array[2]="boy2";
 array[3]="boy3";
 for(key in array)
  print key,array[key];
}
[root@boy ~]# awk -f test.sh 
1 boy1
2 boy2
3 boy3

# 和下面效果一样，如果for只有后边只有一条命令{}可以不用加
[root@boy ~]# awk 'BEGIN{ array[1]="boy1"; array[2]="boy2"; array[3]="boy3"; for(key in array){print key,array[key]}}'
1 boy1
2 boy2
3 boy3

```

```
[root@boy ~]# cat test
1 test1
2 test2
[root@boy ~]# awk '{S[$1]=$2}END{for(key in S) print key,S[key]}' test
1 test1
2 test2
```

```
# 统计每个域名次数
[root@boy ~]# cat test
http://www.a.com/index.html
http://www.x.com/index.html
http://www.y.com/index.html
http://www.z.com/index.html
http://www.z.com/index.html
http://www.a.com/index.html
http://www.b.com/index.html
http://www.d.com/index.html
http://www.c.com/index.html
http://www.r.com/index.html
http://www.r.com/index.html

[root@boy ~]# awk -F"/" '{S[$3]=S[$3]+1}END{for(key in S) print S[key],key}' test
1 www.c.com
1 www.y.com
2 www.r.com
1 www.x.com
1 www.d.com
2 www.z.com
1 www.b.com
2 www.a.com

[root@boy ~]# awk -F"/" '{S[$3]++}END{for(key in S) print S[key],key}' test
1 www.c.com
1 www.y.com
2 www.r.com
1 www.x.com
1 www.d.com
2 www.z.com
1 www.b.com
2 www.a.com
```

```
# 统计网络套接字情况
[root@boy ~]# netstat -tunlp | awk 'NR>2 && NF==7 && /^tcp/ {S[$6]++}END{for(key in S){print key,S[key]}}' | sort -rn -k2 | head
LISTEN 4
```

### 实例

```
netstat -anp|awk 'NR!=1{a[$6]++} END{for (i in a) print i,"\t",a[i]}'

netstat -anp|awk 'NR!=1{a[$6]++} END{for (i in a) printf "%-20s %-10s %-5s \n", i,"\t",a[i]}'

```

## awk 分隔符

- awk内置变量FS可以用于指定输入分隔符，但是在使用变量时，需要使用-v选项，用于指定对应的变量，比如 -v FS=’#’，效果与-F一样
- 内置变量OFS来设定awk的输出分隔符，当然，使用变量的时候要配合使用-v选项

```
[root@boy ~]# cat test 
abc 123 iuy ddd
8ua 456 auv php 7y7

[root@boy ~]# awk -v FS=' ' -v OFS='---' '{print $1,$2}' test
abc---123
8ua---456

```

```
# 输出分隔符OFS,输出字段6匹配WAIT的行，其中输出每行行号，字段4，5,6，并使用制表符分割字段
awk '$6 ~ /FIN/ || NR==1 {print NR,$4,$5,$6}' OFS="\t" netstat.txt

awk '$6 ~ /WAIT/ || NR==1 {print NR,$4,$5,$6}' OFS="\t" netstat.txt     
```

## awk 内置函数

#### awk 三目运算符

- 条件 ？ 结果1 ： 结果2
- 在awk中，0或者空字符串表示”假”，非0值或者非空字符串表示”真”

```
# ”$3<500″就是上述语法中的”条件”，”系统用户”就是上述语法中”?”后面的”结果1″，”普通用户”就是上述语法中”:”后面的”结果2″  ，同时，在上例中我们使用usertype变量接收了三元运算后的返回值，所以，当条件成立时，usertype变量被赋值为”系统用户”，当条件不成立时，usertype变量被赋值为”普通用户”
[root@boy ~]# awk -F: '{ usertype=$3<500?"系统用户":"普通用户"; print $1,usertype}' /etc/passwd
root 系统用户
bin 系统用户


# 可见a,b默认是空的
[root@boy ~]# awk -F: 'BEGIN{print a;b} {$3<500?a++:b++;print $0,a,b}END{print a,b}' /etc/passwd

root:x:0:0:root:/root:/bin/bash 1 
bin:x:1:1:bin:/bin:/sbin/nologin 2 
daemon:x:2:2:daemon:/sbin:/sbin/nologin 3 
adm:x:3:4:adm:/var/adm:/sbin/nologin 4 
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin 5 
sync:x:5:0:sync:/sbin:/bin/sync 6 
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown 7 
halt:x:7:0:halt:/sbin:/sbin/halt 8 
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin 9 
operator:x:11:0:operator:/root:/sbin/nologin 10 
games:x:12:100:games:/usr/games:/sbin/nologin 11 
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin 12 
nobody:x:99:99:Nobody:/:/sbin/nologin 13 
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin 14 
dbus:x:81:81:System message bus:/:/sbin/nologin 15 
polkitd:x:999:998:User for polkitd:/:/sbin/nologin 15 1
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin 16 1
postfix:x:89:89::/var/spool/postfix:/sbin/nologin 17 1
chrony:x:998:996::/var/lib/chrony:/sbin/nologin 17 2
17 2

```

```
[root@boy ~]# awk '1{print $0}' test 
name   sex    age
jack   men    18
cnm    women  18
[root@boy ~]# awk '0{print $0}' test
[root@boy ~]# awk '!0{print $0}' test
name   sex    age
jack   men    18
cnm    women  18

[root@boy ~]# awk '0' test 
[root@boy ~]# awk '!0' test 
name   sex    age
jack   men    18
cnm    women  18


# 当awk开始处理第一行时，变量 i 被初始化，变量 i 在被初始化时，值为”空”，而awk中，数字0或者”空字符串”表示假，所以可以认为模式为假，但是 i 直接取反了，对假取反后的值为真，将取反后的值又赋值给了变量i，此刻，变量i的值为真，所以当awk处理第一行文本时，变量i的值被赋值为真，模式成立则需要执行对应的动作，而上例中又省略了动作，所以默认动作为”{print $0}”，所以，第一行被整行打印了
# 当第一行文本处理完毕后，awk开始处理第二行文本，此时，i 为真，但是取反后，i 为假，所以第二行没有被输出，依次类推，最终只打印了奇数行
[root@boy ~]# awk 'i=!i{print NR}' /etc/passwd
1
3
5
7
9
11
13
15
17
19

```

## awk printf

#### printf

```
# 格式
 %s 字符串
 %f 浮点格式（也就是我们概念中的float或者double）
 %b 相对应的参数中包含转义字符时，可以使用此替换符进行替换，对应的转义字符会被转义。
 %c ASCII字符。显示相对应参数的第一个字符
 %d, %i 十进制整数
 %o 不带正负号的八进制值
 %u 不带正负号的十进制值
 %x 不带正负号的十六进制值，使用a至f表示10至15
 %X 不带正负号的十六进制值，使用A至F表示10至15
 %% 表示”%”本身

# 转义字符
    \a 警告字符，通常为ASCII的BEL字符
    \b 后退
    \c 抑制（不显示）输出结果中任何结尾的换行字符（只在%b格式指示符控制下的参数字符串中有效），而且，任何留在参数里的字符、任何接下来的参数以及任何留在格式字符串中的字符，都被忽略
    \f 换页（formfeed）
    \n 换行
    \r 回车（Carriage return）
    \t 水平制表符
    \v 垂直制表符
    \\ 一个字面上的反斜杠字符，即”\”本身。
    \ddd 表示1到3位数八进制值的字符，仅在格式字符串中有效
    \0ddd 表示1到3位的八进制值字符

# 对齐
 ”-“：表示左对齐，默认不加”-“时表示右对齐，其实”-“也是修饰符
 “+”：在默认没有添加”+”作为修饰符时，烈火兽的体温输出为180，而使用了”+”修饰符以后，烈火兽的体温输出为+180，看到这里你应该明白了，当替换符对应的参数为数字时，可以使用”+”作为修饰符，输出”正数”前面的”正号”
 “%12.3”：第一条命令的数字修饰符为12，表示对应的替换符”%f”的输出宽度为12个字符，第二条命令的数字修饰符为12.3 ，表示对应的替换符”%f”的输出宽度为12个字符，并且小数点的精度为3
 ”%d”：如果数字修饰符带有小数点，则数字修饰符小数点后的数字表示整数的长度，长度不够时，高位用0补全
 
```

```
[root@boy ~]# printf "(%s)" 1 19 18 16 ; echo ""
(1)(19)(18)(16)

[root@boy ~]# printf "%s %s\n" a b c d e f
a b
c d
e f
```

```
# 我们只是在原来的”格式替换符”中间加入了特定的数字，貌似显示效果就比刚才好了一点，起码年龄字段对应数字与”年龄”两个字对齐了。那么这些数字是什么意思呢？上图中第一个”%7s”中间的7表示当前替换符对应的输出宽度为7个字符宽，如果对应的输出不足7个字符，则用空格补全，如果输出的长度超过7个字符，超出的部分也会显示。同理”%5s”表示当前替换符对应的输出宽度为5个字符的宽度。而这些数字，我们可以将其称之为”修饰符”，修饰符会对相应的”替换符”进行修饰

[root@boy ~]# printf "%s %s %s\n" 姓名 性别 年龄 尼玛 男 20 你妹 女 18
姓名 性别 年龄
尼玛 男 20
你妹 女 18

[root@boy ~]# printf "%7s %5s %4s\n" 姓名 性别 年龄 尼玛 男 20 你妹 女 18
 姓名 性别 年龄
 尼玛   男   20
 你妹   女   18
```

#### awk

我们来总结一下，在awk中使用printf动作时，需要注意以下3点。

- 使用printf动作输出的文本不会换行，如果需要换行，可以在对应的”格式替换符”后加入”\n”进行转义。

- 使用printf动作时，”指定的格式” 与 “被格式化的文本” 之间，需要用”逗号”隔开。

- 使用printf动作时，”格式”中的”格式替换符”必须与 “被格式化的文本” 一一对应

```
netstat -anp|awk '{printf "%-8s %-8s %-10s\n",$1,$2,$3}' 

printf表示格式输出

%格式化输出分隔符

-8长度为8个字符

s表示字符串类型

打印每行前三个字段，指定第一个字段输出字符串类型(长度为8)，第二个字段输出字符串类型(长度为8),

第三个字段输出字符串类型(长度为10)

netstat -anp|awk '$6=="LISTEN" || NR==1 {printf "%-10s %-10s %-10s \n",$1,$2,$3}'

netstat -anp|awk '$6=="LISTEN" || NR==1 {printf "%-3s %-10s %-10s %-10s \n",NR,$1,$2,$3}'

```

```
# 查看文件
[root@boy ~]# cat test
abc 123 iuy ddd
8ua 456 auv php 7y7

[root@boy ~]# awk '{printf "%s\n",$1}' test
abc
8ua

[root@boy ~]# awk 'BEGIN{printf "%s\n%s\n%s\n",1,2,3}'
1
2
3

[root@boy ~]# awk -v FS=":" 'BEGIN{printf "%-10s\t %s\n","用户名称","用户ID"} {printf "%-10s\t %s\n",$1,$3}' /etc/passwd
用户名称        用户ID
root        0
bin         1
daemon      2
adm         3
lp          4
```

输出处理结果到文件

```
# 输出处理结果到文件

①在命令代码块中直接输出    route -n|awk 'NR!=1{print > "./fs"}'   

②使用重定向进行输出           route -n|awk 'NR!=1{print}'  > ./fs

```

## awk 替换

```
# sub匹配第一次出现的符合模式的字符串，相当于 sed 's//' 
# gsub匹配所有的符合模式的字符串，相当于 sed 's//g' 

awk -F '|'  '{sub(/[0-9]+/,"",$2);print $0}' data.test 

awk '{sub(/Mac/,"Macintosh");print}' urfile    用Macintosh替换Mac
awk '{sub(/Mac/,"MacIntosh",$1); print}' file    第一个域内用Macintosh替换Mac

# sub函数匹配指定域/记录中最大、最靠左边的子字符串的正则表达式，并用替换字符串替换这些字符串,如果没有指定目标字符串就默认使用整个记录。替换只发生在第一次匹配的时候。格式如下
    sub (regular expression, substitution string):
    sub (regular expression, substitution string, target string)
    $ awk '{ sub(/test/, "mytest"); print }' testfile  #在整个记录中匹配，替换只发生在第一次匹配发生的时候
    $ awk '{ sub(/test/, "mytest", $1); print }' testfile #在整个记录的第一个域中进行匹配，替换只发生在第一次匹配发生的时候


​ 
# 如要在整个文件中进行匹配需要用到gsubgsub函数作用如sub，但它在整个文档中进行匹配。格式如下：
 gsub (regular expression, substitution string)
 gsub (regular expression, substitution string, target string)
 $ awk '{ gsub(/test/, "mytest"); print }' testfile #在整个文档中匹配test，匹配的都被替换成mytest
 $ awk '{ gsub(/test/, "mytest", $1); print }' testfile #在整个文档的第一个域中匹配，所有匹配的都被替换成mytest


​ 
# 删除所有空白：（空格、TAB等）【注：三条语句等效】：
    [oracle@localhost 201402261951.script]$ echo 'a bc  d' | awk '{gsub(/[[:blank:]]/, "",$0)}'
    abcd
    [oracle@localhost 201402261951.script]$ echo 'a bc  d' | awk 'gsub(/[[:blank:]]/, "",$0)'
abcd
```
