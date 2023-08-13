# grep 中级

## 开始结束符号

```bash
[root@oldboyedu59 ~]# #在 /etc/services 文件中过滤出包含3306的行
[root@oldboyedu59 ~]# grep '3306'   /etc/services 
mysql           3306/tcp                        # MySQL
mysql           3306/udp                        # MySQL
[root@oldboyedu59 ~]# #在这个文件中找出以ssh开头的行
[root@oldboyedu59 ~]# grep '^ssh' /etc/services
ssh             22/tcp                          # The Secure Shell (SSH) Protocol
ssh             22/udp                          # The Secure Shell (SSH) Protocol
ssh             22/sctp                 # SSH
sshell          614/tcp                 # SSLshell
sshell          614/udp                 #       SSLshell
ssh-mgmt        17235/tcp               # SSH Tectia Manager
ssh-mgmt        17235/udp               # SSH Tectia Manager 
```



## $符号

```bash
[root@oldboyedu59 /oldboy]# grep ' ' oldboy.txt
I am oldboy teacher!
I teach linux.
I like badminton ball ,billiard ball and chinese chess!
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my qq is 49000448
not 4900000448.
my god ,i am not oldbey,but OLDBOY! 
[root@oldboyedu59 /oldboy]# 
[root@oldboyedu59 /oldboy]# grep 'm$' oldboy.txt
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
[root@oldboyedu59 /oldboy]# cat -A oldboy.txt
I am oldboy teacher!$
I teach linux.$
$
I like badminton ball ,billiard ball and chinese chess!$
my blog is http://oldboy.blog.51cto.com $
our size is http://blog.oldboyedu.com $
my qq is 49000448$
$
not 4900000448.$
my god ,i am not oldbey,but OLDBOY! $ 
```



## 转义字符

```bash
[root@oldboyedu59 /oldboy]# echo -e  "oldboy\noldgirl\nalex\nlidao"
oldboy
oldgirl
alex
lidao
[root@oldboyedu59 /oldboy]# echo -e  "oldboy\noldgirl\nalex\n\t\t\tlidao"
oldboy
oldgirl
alex
```

## . 和*符号

```bash
grep '^.o*' oldboy.txt

^.o*
当表示出现0次 相当于 ^.
当表示出现0次以上 相当于 ^.o ^.oooo ^.oooooooooo
```

## () 小括号  花括号

### 作用1： 限定多选结构的范围

如：ab(c|d|e)fgh 。

### 作用2： 标注量词作用的元素

如：ab(cde)+fgh 。小括号里的内容是一个整体。

### 作用3：捕获组

捕获文本，加括号是为了引用匹配结果。
比如，当我使用([a-zA-Z](\d{2}))((-)\d{3})来进行正则匹配”B33-888”时，匹配情况如下：

```bash
group1：B33
group2：33
group3：-888
group4：-
```

可以看到：匹配的顺序等于左括号出现的顺序。

## [] 中括号



中括号
匹配范围。中括号里的内容代表一个范围，可以匹配这个范围内的任意一个元素。

```bash
grep '[a-z]' oldboy.txt
grep '[A-Z]' oldboy.txt
grep '[a-zA-Z]' oldboy.txt
grep '[a-z,A-Z]' oldboy.txt
```



## {} 大括号

大括号
匹配次数。匹配在它之前表达式匹配出来的元素出现的次数，{n}出现n次、{n,}匹配最少出现n次、{n,m}匹配最少出现n次，最多出现m次。





## 练习题:

显示以m或n或o开头的行
以m或n或点结尾的行
显示以m或n或o开头的 并且 以m或n或点结尾的行

### 显示以m或n或o开头的行

```bash
[root@oldboyedu59 /oldboy]# 
[root@oldboyedu59 /oldboy]# grep '^[mno]' oldboy.txt 
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my qq is 49000448
not 4900000448.
my god ,i am not oldbey,but OLDBOY! 
```



### 以m或n或点结尾的行

```bash
[root@oldboyedu59 /oldboy]# 
[root@oldboyedu59 /oldboy]# grep '[mn.]$' oldboy.txt
I teach linux.
not 4900000448.
```



### 显示以m或n或o开头的 并且 以m或n或点结尾的行

```bash
[root@oldboyedu59 /oldboy]# grep '^[mno].*[mn.]$' oldboy.txt 
not 4900000448.

grep '[mn\.]' oldboy.txt

#&&表示并且 命令 
grep '^[mno]' oldboy.txt && grep '[mno] $' oldboy.txt

grep '^[mon][mo.]$' /tmp/oldboy

[root@oldboyedu59 /oldboy]# grep '^[mno]'  oldboy.txt 
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my qq is 49000448
not 4900000448.
my god ,i am not oldbey,but OLDBOY! 
[root@oldboyedu59 /oldboy]# grep '^[mno]'  oldboy.txt |grep '[mn.]$'
not 4900000448.
```



### 找出oldboy.txt 中连续出现的字母（大写或小写）



```bash
grep '[^m^n^o]' oldboy.txt 
grep '^[mon]|[mo.]$' /tmp/oldboy
```



## 扩展正则表达式之 |

```bash
[root@oldboyedu59 /oldboy]# cat oldboy.txt 
I am oldboy teacher!
I teach linux.

I like badminton ball ,billiard ball and chinese chess!
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my qq is 49000448

not 4900000448.
my god ,i am not oldbey,but OLDBOY! 
\\\\\...???$$$$^^&^
[root@oldboyedu59 /oldboy]# egrep  'oldboy|linux' oldboy.txt
I am oldboy teacher!
I teach linux.
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com  
```



## 扩展正则表达式之 ()

```bash
[root@oldboyedu59 /oldboy]# egrep 'oldboy|oldbey' oldboy.txt
I am oldboy teacher!
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my god ,i am not oldbey,but OLDBOY! 
[root@oldboyedu59 /oldboy]# egrep 'oldb[oe]y' oldboy.txt
I am oldboy teacher!
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my god ,i am not oldbey,but OLDBOY! 
[root@oldboyedu59 /oldboy]# egrep 'oldbo|ey' oldboy.txt
I am oldboy teacher!
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my god ,i am not oldbey,but OLDBOY! 
[root@oldboyedu59 /oldboy]# egrep 'oldb(o|e)y' oldboy.txt
I am oldboy teacher!
my blog is http://oldboy.blog.51cto.com 
our size is http://blog.oldboyedu.com 
my god ,i am not oldbey,but OLDBOY! 
```

#### 取出文件中正确的身份证号码的行

id.txt
```bash
金 211324198705244720
万 500224197105168312
任 1231231231oldboy
任 3oldboy
任 lidao97303136098
任 alex2197303136098
任 350182197303oldgir
吕 211282199209113038
孔 150000198309176071
邹 371001197412221284
贺 130185200011215926
杜 362522198711278101
向 14052219961008852X
```

#### 

```bash
egrep '[0-9X]{18}' id.txt
egrep '[0-9]{17}[0-9X]$' id.txt
```

基础 扩展
含义
支持命令 grep/sed/awk grep -E/egrep 或 sed -r 或 awk