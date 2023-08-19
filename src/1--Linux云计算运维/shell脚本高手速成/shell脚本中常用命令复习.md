shell脚本可以让降低大家的工作强度，提升大家的管理能力和薪资报酬，还可以让大家有时间学习提升自己，更能让你有时间喝茶撩妹子。所以，学好shell那就是非常必要的啦，那么在学习shell之前我们得热热身，做一下准备工作了。

```
学习之前首先要弄清什么是shell脚本：

	shell脚本本质上就是要将完成一件事情的所有命令按照执行的先后顺序写入一个文件，并给予文件执行权限
```

so！想学好shell脚本首先要考核一下自己的linux命令学的是否扎实，接下来为了能让大家学习shell更加顺畅，我把常用的一些数据处理的命令给大家回顾一下。

```
我们重点回顾以下几类命令

数据检索命令

         行检索：grep  egrep

         字符串检索:cut  tr

数据处理命令       

	数据排序：sort

  	数据去重: uniq

  	文本数据合并: paste

  	数据输出: tee

  	数据处理: xargs    
```

![image-20220604181148091](C:\Users\MISSXP\AppData\Roaming\Typora\typora-user-images\image-20220604181148091.png)

## 一、 数据处理命令

### 1、grep: 负责从数据源中检索对应的字符串，行过滤。

```
grep用于根据关键字进行行过滤
grep options 'keys' filename
OPTIONS:
    -i: 不区分大小写
    -v: 查找不包含指定内容的行,反向选择
    -w: 按单词搜索
    -n: 显示行号
    -A: 显示匹配行及后面多少行 -A 5
    -B: 显示匹配行及前面多少行
    
    
    -o: 打印匹配关键字
    -c: 统计匹配到的次数
    -r: 逐层遍历目录查找
    -C: 显示匹配行前后多少行
    -l：只列出匹配的文件名
    -L：列出不匹配的文件名
    -e: 使用正则匹配
    -E:使用扩展正则匹配
    ^key:以关键字开头
    key$:以关键字结尾
    ^$:匹配空行
    --color=auto ：可以将找到的关键词部分加上颜色的显示


常用命令选项必知必会  示例：
# grep -i root passwd 忽略大小写匹配包含root的行
# grep -w ftp passwd 精确匹配ftp单词
# grep -wo ftp passwd 打印匹配到的关键字ftp
# grep -n root passwd 打印匹配到root关键字的行好
# grep -ni root passwd 忽略大小写匹配统计包含关键字root的行
# grep -nic root passwd 忽略大小写匹配统计包含关键字root的行数
# grep -i ^root passwd 忽略大小写匹配以root开头的行
# grep bash$ passwd 匹配以bash结尾的行
# grep -n ^$ passwd 匹配空行并打印行号
# grep ^# /etc/vsftpd/vsftpd.conf 匹配以#号开头的行
# grep -v ^# /etc/vsftpd/vsftpd.conf 匹配不以#号开头的行
# grep -A 5 mail passwd   匹配包含mail关键字及其后5行
# grep -B 5 mail passwd   匹配包含mail关键字及其前5行
# grep -C 5 mail passwd 匹配包含mail关键字及其前后5行



centos8中已经为大家设置了，存放在/etc/profile.d/colorgrep.sh文件中，如若大家使用的系统中没有设置颜色输出，
可以使用以下方法来自行设置

临时设置：
# alias grep='grep --color=auto' //只针对当前终端和当前用户生效

永久设置：
1）全局（针对所有用户生效）
vim /etc/bashrc
alias grep='grep --color=auto'
source /etc/bashrc

2）局部（针对具体的某个用户）
vim ~/.bashrc
alias grep='grep --color=auto'

注意：如果希望你对环境变量的设置立刻生效，可以使用以下命令而不需要重启计算机
source ~/.bashrc
```

### 2、cut数据截取

```
cut用于列截取
-c: 以字符为单位进行分割。
-d: 自定义分隔符，默认为制表符。\t
-f: 与-d一起使用，指定显示哪个区域。

# cut -d: -f1 1.txt 以:冒号分割，截取第1列内容
# cut -d: -f1,6,7 1.txt 以:冒号分割，截取第1,6,7列内容
# cut -c4 1.txt 截取文件中每行第4个字符
# cut -c1-4 1.txt 截取文件中每行的1-4个字符
# cut -c4-10 1.txt 
# cut -c5- 1.txt 从第5个字符开始截取后面所有字符
```

### 3、tr 字符转换：替换，删除

```
tr用来从标准输入中通过替换或删除操作进行字符转换；主要用于删除文件中控制字符或进行字符转换。
使用tr时要转换两个字符串：字符串1用于查询，字符串2用于处理各种转换。

语法：
commands|tr  'string1'  'string2'
tr  'string1'  'string2' < filename

tr options 'string1' < filename

-d 删除字符串1中所有输入字符。
-s 删除所有重复出现字符序列，只保留第一个；即将重复出现字符串压缩为一个字符串。


a-z 任意小写
A-Z 任意大写
0-9 任意数字

[root@zutuanxue shell01]# cat 3.txt 自己创建该文件用于测试
ROOT:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucp:/sbin/nologin
boss02:x:516:511::/home/boss02:/bin/bash
vip:x:517:517::/home/vip:/bin/bash
stu1:x:518:518::/home/stu1:/bin/bash
mailnull:x:47:47::/var/spool/mqueue:/sbin/nologin
smmsp:x:51:51::/var/spool/mqueue:/sbin/nologin
aaaaaaaaaaaaaaaaaaaa
bbbbbb111111122222222222233333333cccccccc
hello world 888
666
777
999


# tr -d '[:/]' < 3.txt 删除文件中的:和/
# cat 3.txt |tr -d '[:/]' 删除文件中的:和/
# tr '[0-9]' '@' < 3.txt 将文件中的数字替换为@符号
# tr '[a-z]' '[A-Z]' < 3.txt 将文件中的小写字母替换成大写字母
# tr -s '[a-z]' < 3.txt 匹配小写字母并将重复的压缩为一个
# tr -s '[a-z0-9]' < 3.txt 匹配小写字母和数字并将重复的压缩为一个
```

### 4、sort排序

```
sort：将文件的每一行作为一个单位，从首字符向后，依次按ASCII码值进行比较，最后将他们按升序输出。

语法：
sort [options] [filename]

-u ：去除重复行
-r ：降序排列，默认是升序
-o : 将排序结果输出到文件中  类似 重定向符号 >
-n ：以数字排序，默认是按字符排序
-t ：分隔符
-k ：第N列

-b ：忽略前导空格。
-R ：随机排序，每次运行的结果均不同。
 
 示例：
# sort -n -t: -k3 1.txt 按照用户的uid进行升序排列
# sort -nr -t: -k3 1.txt 按照用户的uid进行降序排列
# sort -n 2.txt 按照数字排序
# sort -nu 2.txt 按照数字排序并且去重
# sort -nr 2.txt 
# sort -nru 2.txt 
# sort -nru 2.txt 
# sort -n 2.txt -o 3.txt 按照数字排序并将结果重定向到文件
# sort -R 2.txt 
# sort -u 2.txt 
```

### 5、uniq 去除连续的重复行

**应用技巧：去重前先使用sort排序**

```
uniq：去除连续重复行

语法：
uniq [options] [filename]

-i: 忽略大小写
-c: 统计重复行次数
-d:只显示重复行

# uniq 2.txt 
# uniq -d 2.txt 
# uniq -dc 2.txt 
```

### 6、tee 双向输出

```
tee工具从标准输入读取并写入标准输出和文件，即：双向覆盖重定向<屏幕输出|文本输入>
somecommand |tee filename

-a 双向追加重定向

# echo hello world
# echo hello world|tee file1
# cat file1 
# echo 999|tee -a file1
# cat file1 
```

### 7、paste

```
paste工具用于合并文件行输出到屏幕，不会改动源文件

-d：自定义间隔符，默认是tab,只接受一个字符
-s：将每个文件中的所有内容按照一行输出，文件中的行与行以TAB间隔。

[root@zutuanxue shell01]# cat a.txt 
hello
[root@zutuanxue  shell01]# cat b.txt 
hello world
888
999
[root@zutuanxue  shell01]# paste a.txt b.txt 
hello   hello world
        888
        999
[root@zutuanxue  shell01]# paste b.txt a.txt   
hello world     hello
888
999

[root@zutuanxue shell01]# paste -d'@' b.txt a.txt 
hello world@hello
888@
999@

[root@zutuanxue shell01]# paste -s b.txt a.txt 
hello world     888     999
hello
```

### 8、xargs 上一个命令的输出作为下一个命令的命令行参数

管道(|):上一个命令的输出作为下一个命令的输入，做的是**数据源**。

```
[root@manage01 ~]# sort -n 2.txt |uniq 
1
2
3
5
6
10
99
9999

如何将上一个命令的输出，作为下一个命令的参数呢？

xargs 上一个命令的输出作为下一个命令的命令行参数

回顾:
linux 命令格式
命令   命令选项   参数
ls -l /
========================
xargs 可以将管道或标准输入（stdin）数据转换成命令行参数，也能够从文件的输出中读取数据。

xargs 一般是和管道一起使用。

命令格式：
''[somecommand]|[filename]'' |xargs -item  command

OPTIONS:
-a file 从文件中读入作为sdtin
-E flag flag必须是一个以空格分隔的标志，当xargs分析到含有flag这个标志的时候就停止。
-p 当每次执行一个argument的时候询问一次用户。
-n num 后面加次数，表示命令在执行的时候一次用的argument的个数，默认是用所有的。
-t 表示先打印命令，然后再执行。
-i 或者是-I，这得看linux支持了，将xargs的每项名称，一般是一行一行赋值给 {}，可以用 {} 代替。
-r no-run-if-empty 当xargs的输入为空的时候则停止xargs，不用再去执行了。
-d delim 分隔符，默认的xargs分隔符是回车，argument的分隔符是空格，这里修改的是xargs的分隔符。


注意：linux命令格式一般为
命令    命令选项     参数
上一个命令的输出就是下一个命令的参数  这句话结合命令语法  应该知道输出的内容在下一个命令的位置了吧。


案例
[root@zutuanxue  ~]# find / -name zutuanxue |xargs gzip 
[root@zutuanxue  ~]# cat 1
1
2
3
4
5
6
7
8
9
10
[root@zutuanxue  ~]# xargs -a 1 
1 2 3 4 5 6 7 8 9 10

[root@zutuanxue  ~]# xargs -a 1 -E 5 
1 2 3 4

这样就明白使用xargs -a 为什么读取文件的时候会把文件中的所有内容都输出了吧
[root@zutuanxue  ~]# xargs -a 1 -p
echo 1 2 3 4 5 6 7 8 9 10 ?...y
1 2 3 4 5 6 7 8 9 10
[root@zutuanxue  ~]# xargs -a 1 -p
echo 1 2 3 4 5 6 7 8 9 10 ?...n

同理为什么把文件中的所有行按一行输出呢，原因就是默认输出所有
[root@zutuanxue  ~]# xargs -a 1 -n3
1 2 3
4 5 6
7 8 9
10
[root@zutuanxue  ~]# xargs -a 1 -n3 -p
echo 1 2 3 ?...y
echo 4 5 6 ?...1 2 3
y
echo 7 8 9 ?...4 5 6
y
echo 10 ?...7 8 9
y
10

和-p命令选项一样，显示他是怎么执行的，只不过这个不需要确认。
[root@zutuanxue  ~]# cat 1 |xargs -t
echo 1 2 3 4 5 6 7 8 9 10 
1 2 3 4 5 6 7 8 9 10

为何读入文件会把所有行都放在一行呢？这个和xargs的列分割符有关系
默认是回车
我们可以使用-d 改掉默认列与列的默认分割符为其他，自然就会换行了
[root@zutuanxue  ~]# xargs -a 1 -d "@"
1
2
3
4
5
6
7
8
9
10
```

### 9、shell字符

```
有基础的同学不要和正则表达式中的符号含义搞混淆了。    
    !:                执行历史命令   !! 执行上一条命令
    $:                变量中取内容符
    + - * / %:        对应数学运算  加 减 乘 除 取余数  
    &:                后台执行
    ;：               分号可以在shell中一行执行多个命令，命令之间用分号分割    
    \:                转义字符
    ``:               反引号 命令中执行命令    echo "today is `date +%F`"
    ' ':              单引号，脚本中字符串要用单引号引起来，但是不同于双引号的是，单引号不解释变量
    " ":              双引号，脚本中出现的字符串可以用双引号引起来

通配符    
    ~:                家目录    # cd ~ 代表进入用户家目录
    *:                星号是shell中的通配符  匹配所有
    ?:                问号是shell中的通配符  匹配除回车以外的一个字符
    [list]: 匹配[list]中的任意单个字符
[!list]: 匹配除list中的任意单个字符
{string1,string2,...}： 匹配string1,string2或更多字符串


重定向
>      覆盖输入 
>> 追加输入
< 输出
<< 追加输出

管道命令
|：               管道符 上一个命令的输出作为下一个命令的输入   cat filename | grep "abc"
```

### 10、组合命令实战

```
job1: 检索本机的IP、NETMASK、MAC地址、广播地址
IP:  172.20.10.3
NetMask:  255.255.255.240
Broadcast:  172.20.10.15
MAC Address:  00:0c:29:8d:49:ea


job2: 将系统中所有普通用户的用户名、密码和默认shell保存到一个文件中，要求用户名密码和默认shell之间用tab键分割
ayitula x /bin/bash

组合命令实战代码

job1: 检索本机的IP、NETMASK、MAC地址、广播地址
[root@zutuanxue  ~]# ifconfig ens33   检索网卡信息
[root@zutuanxue  ~]# ifconfig ens33|grep -w inet|tr -d '[a-zA-Z]'|tr -s " "  处理检索行

IP地址
[root@zutuanxue  ~]# ifconfig ens33|grep -w inet|tr -d [a-zA-Z]|tr -s " "|cut -d " " -f2|xargs echo "IP: "
IP:  172.20.10.3

NetMask地址
[root@zutuanxue  ~]# ifconfig ens33|grep -w inet|tr -d [a-zA-Z]|tr -s " "|cut -d " " -f3|xargs echo "NetMask: "
NetMask:  255.255.255.240

广播地址
[root@zutuanxue  ~]# ifconfig ens33|grep -w inet|tr -d [a-zA-Z]|tr -s " "|cut -d " " -f4|xargs echo "Broadcast: "
Broadcast:  172.20.10.15

MAC地址
[root@zutuanxue  ~]# ifconfig ens33|grep -w ether|tr -s " "|cut -d " " -f3|xargs echo "MAC Address: "
MAC Address:  00:0c:29:8d:49:ea

job2: 将系统中所有普通用户的用户名、密码和默认shell保存到一个文件中，要求用户名密码和默认shell之间用tab键分割
[root@zutuanxue  ~]# cut -d ":" -f1,2,7 /etc/passwd|tr ":" "\t"|grep -i "bash"|grep -v "root"
ayitula x /bin/bash
```