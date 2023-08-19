## 一、if高级用法

### 1.1、条件符号使用双圆括号，可以在条件中植入数学表达式 if (())

```
#!/bin/bash
#Author: www.zutuanxue.com
#Created Time:
#Script Description: 

if (( (5+5-5)*5/5 > 10 ))
    then
        echo "yes"
else
        echo "no"
fi
```

### 1.2、使用双方括号,可以在条件中使用通配符

通过代码看下 ，为字符串提供高级功能，模式匹配 r* 匹配r开头的字符串

```
#!/bin/bash
#Author: www.zutuanxue.com
#Created Time: 
#Script Description: 
for var in  ab ac rx bx rvv vt
   do
       if [[ "$var" == r* ]]
	  then
		echo "$var"
       fi
done
```

## 二、简写if

省去了关键字，条件为真采用&&符号链接命令块，条件为假采用||链接命令块

简写if一般用在简单的判断中

```
if [ ! -d /tmp/baism ]
    then
        mkdir /tmp/baism
fi

可以简写为

[ ！ -d /tmp/baism ] && mkdir /tmp/baism

if [ $USER == 'root' ]
	  then
	      echo "hello root"
else
			  echo "hello guest"
fi

可以简写
[ $USER == 'root' ]&&echo "hello root" || echo "hello guest"
```

## 三、学习视频

[视频：if高级用法](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=49)
[视频：if知识图谱总结](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=50)