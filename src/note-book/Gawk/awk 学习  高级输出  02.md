## awk高级输入输出 读取下一条记录

awk中`next`语句使用：在循环逐行匹配，如果遇到next，就会跳过当前行，直接忽略下面语句。而进行下一行匹配。net语句一般用于多行合并：

```abap
cat text.txt
a
b
c
d
e

awk 'NR%2==1{next}{print NR,$0;}' text.txt
2 b
4 d
```

当记录行号除以2余1，就跳过当前行。下面的`print NR,$0`也不会执行。下一行开始，程序有开始判断`NR%2`值。这个时候记录行号是`：2`，就会执行下面语句块：`'print NR,$0'`

 分析发现需要将包含有“web”行进行跳过，然后需要将内容与下面行合并为一行：

```text
at text.txt
web01[192.168.2.100]
httpd            ok
tomcat               ok
sendmail               ok
web02[192.168.2.101]
httpd            ok
postfix               ok
web03[192.168.2.102]
mysqld            ok
httpd               ok
0
awk '/^web/{T=$0;next;}{print T":t"$0;}' test.txt
web01[192.168.2.100]:   httpd            ok
web01[192.168.2.100]:   tomcat               ok
web01[192.168.2.100]:   sendmail               ok
web02[192.168.2.101]:   httpd            ok
web02[192.168.2.101]:   postfix               ok
web03[192.168.2.102]:   mysqld            ok
web03[192.168.2.102]:   httpd               ok
```

### 简单地读取一条记录 

`awk getline`用法：输出重定向需用到`getline函数`。getline从标准输入、管道或者当前正在处理的文件之外的其他输入文件获得输入。它负责从输入获得下一行的内容，并给NF,NR和FNR等内建变量赋值。如果得到一条记录，getline函数返回1，如果到达文件的末尾就返回0，如果出现错误，例如打开文件失败，就返回-1。

getline语法：getline var，变量var包含了特定行的内容。

awk getline从整体上来说，用法说明：

- **当其左右无重定向符`|`或`<`时：**getline作用于当前文件，读入当前文件的第一行给其后跟的变量`var`或`$0`（无变量），应该注意到，由于awk在处理getline之前已经读入了一行，所以getline得到的返回结果是隔行的。
- **当其左右有重定向符`|`或`<`时：**getline则作用于定向输入文件，由于该文件是刚打开，并没有被awk读入一行，只是getline读入，那么getline返回的是该文件的第一行，而不是隔行。

**示例：**

执行linux的`date`命令，并通过管道输出给`getline`，然后再把输出赋值给自定义变量out，并打印它：

```text
awk 'BEGIN{ "date" | getline out; print out }' test
```

执行shell的date命令，并通过管道输出给getline，然后getline从管道中读取并将输入赋值给out，[split](http://man.linuxde.net/split)函数把变量out转化成数组mon，然后打印数组mon的第二个元素：

```text
awk 'BEGIN{ "date" | getline out; split(out,mon); print mon[2] }' test
```

命令[ls](http://man.linuxde.net/ls)的输出传递给geline作为输入，循环使getline从ls的输出中读取一行，并把它打印到屏幕。这里没有输入文件，因为BEGIN块在打开输入文件前执行，所以可以忽略输入文件。

```text
awk 'BEGIN{ while( "ls" | getline) print }'
```

### 关闭文件

awk中允许在程序中关闭一个输入或输出文件，方法是使用awk的close语句。

```text
close("filename")
```

filename可以是getline打开的文件，也可以是stdin，包含文件名的变量或者getline使用的确切命令。或一个输出文件，可以是stdout，包含文件名的变量或使用管道的确切命令。

### 输出到一个文件

awk中允许用如下方式将结果输出到一个文件：

```text
echo | awk '{printf("hello word!n") > "datafile"}'
或
echo | awk '{printf("hello word!n") >> "datafile"}'
```

## 设置字段定界符

默认的字段定界符是空格，可以使用`-F "定界符"` 明确指定一个定界符：

```text
awk -F: '{ print $NF }' /etc/passwd
或
awk 'BEGIN{ FS=":" } { print $NF }' /etc/passwd
```

在`BEGIN语句块`中则可以用`OFS=“定界符”`设置输出字段的定界符。

## 流程控制语句 

在linux awk的while、do-while和for语句中允许使用break,continue语句来控制流程走向，也允许使用[exit](http://man.linuxde.net/exit)这样的语句来退出。break中断当前正在执行的循环并跳到循环外执行下一条语句。if 是流程选择用法。awk中，流程控制语句，语法结构，与c语言类型。有了这些语句，其实很多shell程序都可以交给awk，而且性能是非常快的。下面是各个语句用法。

### 条件判断语句 

```text
if(表达式)
  语句1
else
  语句2
```

格式中语句1可以是多个语句，为了方便判断和阅读，最好将多个语句用{}括起来。awk分枝结构允许嵌套，其格式为：

```text
if(表达式)
  {语句1}
else if(表达式)
  {语句2}
else
  {语句3}
```

示例：

```text
awk 'BEGIN{
test=100;
if(test>90){
  print "very good";
  }
  else if(test>60){
    print "good";
  }
  else{
    print "no pass";
  }
}'

very good
```

每条命令语句后面可以用`;`**分号**结尾。

### 循环语句 

### while语句 

```text
while(表达式)
  {语句}
```

示例：

```text
awk 'BEGIN{
test=100;
total=0;
while(i<=test){
  total+=i;
  i++;
}
print total;
}'
5050
```

### for循环 

for循环有两种格式：

格式1：

```text
for(变量 in 数组)
  {语句}
```

示例：

```text
awk 'BEGIN{
for (k in ENVIRON) {
}
}'
TERM=linux
G_BROKEN_FILENAMES=1
SHLVL=1
pwd=/root/text
...
logname=root
HOME=/root
SSH_CLIENT=192.168.1.21 53087 22
```

注：ENVIRON是awk常量，是子典型数组。

格式2：

```text
for(变量;条件;表达式)
  {语句}
```

示例：

```text
awk 'BEGIN{
total=0;
for(i=0;i<=100;i++){
  total+=i;
}
print total;
}'
5050
```

### do循环 

```text
do
{语句} while(条件)
```

例子：

```text
awk 'BEGIN{ 
total=0;
i=0;
do {total+=i;i++;} while(i<=100)
  print total;
}'
5050
```

### 其他语句 

- **break** 当 break 语句用于 while 或 for 语句时，导致退出程序循环。
- **continue** 当 continue 语句用于 while 或 for 语句时，使程序循环移动到下一个迭代。
- **next** 能能够导致读入下一个输入行，并返回到脚本的顶部。这可以避免对当前输入行执行其他的操作过程。
- **exit** 语句使主输入循环退出并将控制转移到END,如果END存在的话。如果没有定义END规则，或在END中应用exit语句，则终止脚本的执行。

## 数组应用

数组是awk的灵魂，处理文本中最不能少的就是它的数组处理。因为数组索引（下标）可以是数字和字符串在awk中数组叫做关联数组(associative arrays)。awk 中的数组不必提前声明，也不必声明大小。数组元素用0或空字符串来初始化，这根据上下文而定。

### 数组的定义 

数字做数组索引（下标）：

```text
Array[1]="sun"
Array[2]="kai"
```

字符串做数组索引（下标）：

```text
Array["first"]="www"
Array["last"]="name"
Array["birth"]="1987"
```

使用中`print Array[1]`会打印出sun；使用`print Array[2]`会打印出kai；使用`print["birth"]`会得到1987。

**读取数组的值**

```text
{ for(item in array) {print array[item]}; }       #输出的顺序是随机的
{ for(i=1;i<=len;i++) {print array[i]}; }         #Len是数组的长度
```

### 数组相关函数 

**得到数组长度：**

```text
awk 'BEGIN{info="it is a test";lens=split(info,tA," ");print length(tA),lens;}'
4 4
```

length返回字符串以及数组长度，split进行分割字符串为数组，也会返回分割得到数组长度。

```text
awk 'BEGIN{info="it is a test";split(info,tA," ");print asort(tA);}'
4
```

asort对数组进行排序，返回数组长度。

**输出数组内容（无序，有序输出）：**

```text
awk 'BEGIN{info="it is a test";split(info,tA," ");for(k in tA){print k,tA[k];}}'
4 test
1 it
2 is
3 a 
```

`for…in`输出，因为数组是关联数组，默认是无序的。所以通过`for…in`得到是无序的数组。如果需要得到有序数组，需要通过下标获得。

```text
awk 'BEGIN{info="it is a test";tlen=split(info,tA," ");for(k=1;k<=tlen;k++){print k,tA[k];}}'
1 it
2 is
3 a
4 test
```

注意：数组下标是从1开始，与C数组不一样。****