# Linux三剑客-sed

    19999,9999,9999,9999
    [root@handsome-man ~]# 

## sed命令执行过程

https://www.processon.com/view/link/5bea32c5e4b0ad314e894f53

sed -n '3 p' oldboy.txt
参数 条件 命令

print
sed取范围

    [root@oldboyedu59 /oldboy]# sed -n '5p' lidao.txt
    105,feixue,CIO
    [root@oldboyedu59 /oldboy]# sed -n '1,5p' lidao.txt
    101,oldboy,CEO
    102,zhangyao,CTO
    103,Alex,COO
    104,yy,CFO
    105,feixue,CIO

### 找出文件中包含lidao的行

    [root@handsome-man ~]# sed -n '/lidao/p' /oldboy/oldboy.txt
    110,lidao,COCO

### 找出文件中包含a-z的行

    [root@handsome-man ~]# sed -n '/[a-z]/p' /oldboy/oldboy.txt
    101,alex,CEO
    102,zhangyao,CTO
    103,Alex,COO
    104,yy,CFO
    104,yy,CFO
    104,yy,CFO
    105,feixue,CIO
    110,lidao,COCO

### 找出文件中包含lidao或yy的行 格式 sed -nr '/ / /' /

### sed➕-r的参数才能支持扩展正则

    [root@handsome-man ~]# sed -nr '/lidao|yy/p' /oldboy/oldboy.txt
    104,yy,CFO
    104,yy,CFO
    104,yy,CFO
    110,lidao,COCO

## 用egrep的方法

    [root@handsome-man ~]# egrep 'lidao|yy' /oldboy/oldboy.txt
    104,yy,CFO
    104,yy,CFO
    104,yy,CFO
    110,lidao,COCO

### 用grep的方法

    [root@handsome-man ~]# grep 'lidao\|yy'  /oldboy/oldboy.txt
    104,yy,CFO
    104,yy,CFO
    104,yy,CFO
    110,lidao,COCO

### 取/oldboy/oldboy.txt文件中102-105行

     sed -n '/102/,/105/p'  /oldboy/oldboy.txt
    102,zhangyao,CTO
    19999,9999,9999,9999
    188888,8888,8888
    103,Alex,COO
    104,yy,CFO
    118.1111,1111,2222
    104,yy,CFO
    104,yy,CFO
    105,feixue,CIO

### 在/oldboy/oldboy.txt文件第3行之后添加一行

    [root@handsome-man ~]# sed '3a119,hahaha,ooo'  /oldboy/oldboy.txt101,alex,CEO
    102,zhangyao,CTO
    19999,9999,9999,9999
    119,hahaha,ooo
    188888,8888,8888
    103,Alex,COO
    104,yy,CFO
    118.1111,1111,2222
    104,yy,CFO
    104,yy,CFO
    105,feixue,CIO
    110,lidao,COCO 

### 在/oldboy/oldboy.txt文件第3行之前添加一行

    [root@handsome-man ~]# sed '3i8888,8888,8888,8888'  /oldboy/oldboy.txt
    101,alex,CEO
    102,zhangyao,CTO
    8888,8888,8888,8888
    19999,9999,9999,9999
    188888,8888,8888
    103,Alex,COO
    104,yy,CFO
    118.1111,1111,2222
    104,yy,CFO
    104,yy,CFO
    105,feixue,CIO
    110,lidao,COCO

### 删除/oldboy/oldboy,txt文件中的空行

    [root@handsome-man ~]# sed '/^$/d'   /oldboy/oldboy.txt
    101,alex,CEO
    102,zhangyao,CTO
    19999,9999,9999,9999
    188888,8888,8888
    :103,Alex,COO
    104,yy,CFO
    118.1111,1111,2222
    104,yy,CFO
    104,yy,CFO
    105,feixue,CIO
    110,lidao,COCO

## awk 拓展

[root@handsome-man ~]# awk '/^$/' /oldboy/oldboy.txt

### 用awk 显示与不显示空行

    [root@handsome-man ~]# awk '!/^$/' /oldboy/oldboy.txt       
    101,alex,CEO
    102,zhangyao,CTO
    19999,9999,9999,9999
    188888,8888,8888
    :103,Alex,COO
    104,yy,CFO
    118.1111,1111,2222
    104,yy,CFO
    104,yy,CFO
    105,feixue,CIO
    110,lidao,COCO

### 不显示文件/etc/ssh/sshd_config 的空行或以#号开头的行

    egrep -v '^$|^#' /etc/ssh/sshd_config 
    sed -r '/^$|^#/d' /etc/ssh/sshd_config
    sed -rn '/^$|^#/!p' /etc/ssh/sshd_config
     
    grep '^[a-Z]' /etc/ssh/sshd_config
     
    awk '!/^$|^#/'  /etc/ssh/sshd_config

### 把文件中的lidao替换成alex

### 格式是 sed 's# # #g' / / 其中的#可以换成任意字符。

    [root@handsome-man ~]# sed 's#lidao#alex#g' /oldboy/oldboy.txt
    101,alex,CEO
    102,zhangyao,CTO


​     
    19999,9999,9999,9999
     
    188888,8888,8888
     
    :103,Alex,COO
    104,yy,CFO
    118.1111,1111,2222
    104,yy,CFO
    104,yy,CFO
    105,feixue,CIO
    110,alex,COCO
————————————————
版权声明：本文为CSDN博主「追梦娃」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_44922815/article/details/89391262