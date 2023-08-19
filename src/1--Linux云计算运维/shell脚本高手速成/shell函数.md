shell脚本中的代码是按照执行的优先级的顺序从上往下抒写的，代码量越大，在脚本调试的时候就越难排错，当因执行需要调整代码执行顺序的时候就需要不断的复制粘贴，或者删除部分代码来完成，这和从写一个脚本花费的时候相比甚至需要更长的时间。

代码量大后遇到的问题：

- 单个脚本代码量大 （300-500行）
- 阅读修改耗时费力
- 排错困难
- 改变执行顺序困难

为了解决这些问题，我们可以把代码模块化，按需调用。

## 一、函数

### 1.1、函数介绍

shell中允许将**一组命令集合**或**语句**形成一段**可用代码**，这些代码块称为shell函数。给这段代码起个名字称为函数名，后续可以直接调用该段代码的功能。

将完成一个功能的一段代码进行命名、封装

函数的优点：

1. 代码模块化，调用方便，节省内存
2. 代码模块化，代码量少，排错简单
3. 代码模块化，可以改变代码的执行顺序

### 1.2、函数定义

```
语法一:

函数名 () {
    代码块
    return N
    }


语法二：
function 函数名 {
      代码块
      return N
      }
      
      
函数中return说明：
1.return可以结束一个函数，类似于前面讲的循环控制语句break(结束当前循环，执行循环体后面的代码)
2.return默认返回函数中最后一个命令的退出状态，也可以给定参数值，该参数值的范围是0-256之间。
3.如果没有return命令，函数将返回最后一个Shell的退出值。
```

### 1.3、函数调用

- 当前命令行调用

```
[root@zutuanxue shell04]# cat fun1.sh 
#!/bin/bash
hello(){
echo "hello zutuanxue $1"
hostname
}
menu(){
cat <<-EOF
1. mysql
2. web
3. app
4. exit
EOF
}

[root@zutuanxue shell04]# source fun1.sh 
[root@zutuanxue shell04]# . fun1.sh 

[root@zutuanxue shell04]# hello 888
hello zutuanxue 888
MissHou.zutuanxue.cc
[root@zutuanxue shell04]# menu
1. mysql
2. web
3. app
4. exit
```

- 定义到用户的环境变量中

```
/etc/profile	/etc/bashrc		~/.bash_profile	~/.bashrc

[root@zutuanxue shell04]# cat ~/.bashrc 
# .bashrc

# User specific aliases and functions

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

hello(){
echo "hello zutuanxue $1"
hostname
}
menu(){
cat <<-EOF
1. mysql
2. web
3. app
4. exit
EOF
}

注意：
当用户打开bash的时候会读取该文件
```

- 脚本中调用

```
#!/bin/bash
#打印菜单
source ./fun1.sh
menu(){
cat <<-END
	h	显示命令帮助
	f	显示磁盘分区
	d	显示磁盘挂载
	m	查看内存使用
	u	查看系统负载
	q	退出程序
	END
}
menu		//调用函数
```

## 二、学习视频

[视频：函数与case语句介绍](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=68)
[视频：函数介绍与定义](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=69)
[视频：函数调用](https://www.bilibili.com/video/BV1Tf4y1v7E2?p=70)