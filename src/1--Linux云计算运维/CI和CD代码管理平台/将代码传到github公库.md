## github使用

Github顾名思义是一个Git版本库的托管服务，是目前全球最大的软件仓库，拥有上百万的开发者用户，也是软件开发和寻找资源的最佳途径 ，Github不仅可以托管各种Git版本仓库，还拥有了更美观的Web界面，您的代码文件可以被任何人克隆 ，使得开发者为开源项贡献代码变得更加容易，当然也可以付费购买私有库，这样高性价比的私有库真的是帮助到了很多团队和企业

1、注册用户

2、配置ssh‐key

3、创建项目

4、克隆项目到本地

5、推送新代码到github

注册地址：https://github.com/

## 远程仓库

假设1：假设你准备开发一个新功能，但是需要两周才能完成。第一周写了50%，但是在第二周你的电脑粉碎了，并且还没有将上周工作代码存储到其他物理介质上，这样存在丢失的巨大风险

假设2：假设你是一个非常努力的程序员，除了在公司写代码外你还经常把代码用U盘拷贝回家继续工作，如果在通勤过程中U盘不小心丢了，回家之后你就不能工作了

- 配置Github

- 创建SSH Key

	```
	[root@zutuanxue ~]# ssh-keygen -t rsa
	Generating public/private rsa key pair.
	Enter file in which to save the key (/root/.ssh/id_rsa): 
	Enter passphrase (empty for no passphrase): 
	Enter same passphrase again: 
	Your identification has been saved in /root/.ssh/id_rsa.
	Your public key has been saved in /root/.ssh/id_rsa.pub.
	The key fingerprint is:
	SHA256:UiiQi1grvAo9YFXFkuSHObA8XI2Jkpk07bUf1hSLXSw songs-wmx@163.com
	The key's randomart image is:
	+---[RSA 2048]----+
	|.o*o++B. .o.     |
	| =*==*o+oEo.     |
	|oo+Bo=+o+o.      |
	|=oo..oo+ .       |
	|.+.   + S        |
	|..o    o         |
	|o  .             |
	|.                |
	|                 |
	+----[SHA256]-----+
	[root@zutuanxue ~]# cd .ssh/
	[root@zutuanxue .ssh]# ls
	id_rsa  id_rsa.pub  known_hosts
	```

	.ssh/id_rsa：私钥

	.ssh/id_res.pub：公钥

	```
	[root@zutuanxue .ssh]# cat id_rsa.pub 
	```

- 添加公有秘钥到github

![image20200407105944844.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603181654398.png)

![image20200407110032231.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603181667320.png)

![image20200407110138300.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603181678879.png)

```
    [root@zutuanxue .ssh]# ssh git@github.com #测试秘钥是否有效
    Warning: Permanently added the RSA host key for IP address '52.74.223.119' to the list of known hosts.
    PTY allocation request failed on channel 0
    Hi gongjunhe! You've successfully authenticated, but GitHub does not provide shell access.
    Connection to github.com closed.
```

### 创建远程仓库

返回github首页

![image20200407110632002.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603181750178.png)

![image20200407110822461.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603181782679.png)

**关联本地仓库和远程仓库**

在本地仓库中执行命令：`git remote add origin 远程仓库地址`

```
[root@zutuanxue git_data]# git remote add origin git@github.com:gongjunhe/gittest.git
```

![image20200407111123617.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603182093568.png)

```
[root@zutuanxue git_data]# git push -u origin master	#将本地仓库的内容推送到远程仓库
To github.com:gongjunhe/gittest.git
 ! [rejected]        master -> master (non-fast-forward)
error: 无法推送一些引用到 'git@github.com:gongjunhe/gittest.git'
提示：更新被拒绝，因为您当前分支的最新提交落后于其对应的远程分支。
提示：再次推送前，先与远程变更合并（如 'git pull ...'）。详见
提示：'git push --help' 中的 'Note about fast-forwards' 小节。
[root@zutuanxue git_data]# git fetch origin	#获取远程更新
[root@zutuanxue git_data]# git merge origin/master	#将更新的内容合并到本地
fatal: 拒绝合并无关的历史
[root@zutuanxue git_data]# git merge origin/master --allow-unrelated-histories 
Merge made by the 'recursive' strategy.
 README.md | 2 ++
 1 file changed, 2 insertions(+)
 create mode 100644 README.md
 
[root@zutuanxue git_data]# touch c
[root@zutuanxue git_data]# git add .
[root@zutuanxue git_data]# git commit -m "touch c"
[master 2ec770e] touch c
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 c
[root@zutuanxue git_data]# git push -u origin master
枚举对象: 3, 完成.
对象计数中: 100% (3/3), 完成.
Delta compression using up to 4 threads.
压缩对象中: 100% (2/2), 完成.
写入对象中: 100% (2/2), 274 bytes | 274.00 KiB/s, 完成.
Total 2 (delta 0), reused 0 (delta 0)
To github.com:gongjunhe/gittest.git
   e5d1eba..2ec770e  master -> master
分支 'master' 设置为跟踪来自 'origin' 的远程分支 'master'。
```

![image20200407113836692.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603181724025.png)

```
[root@zutuanxue git_data]# git log --oneline 
2ec770e (HEAD -> master, origin/master) touch c
e5d1eba Merge remote-tracking branch 'origin/master'
3964bca touch d
c2a2158 Initial commit
f3d6391 (tag: V1.0) add haha
2add75e add hello
[root@zutuanxue git_data]# git reset --hard f3d6
HEAD 现在位于 f3d6391 add haha
[root@zutuanxue git_data]# ls
a
[root@zutuanxue git_data]# git log --oneline 
f3d6391 (HEAD -> master, tag: V1.0) add haha
2add75e add hello
ff77333 aaa
dd7925f test head
e2e2131 head test
644d678 test head
326e57a v2 a
8f01c62 version2 a
a714e37 a
47a267c a.txt
6ac34be a
[root@zutuanxue git_data]# git pull origin
更新 f3d6391..2ec770e
Fast-forward
 README.md | 2 ++
 c         | 0
 d         | 0
 3 files changed, 2 insertions(+)
 create mode 100644 README.md
 create mode 100644 c
 create mode 100644 d
[root@zutuanxue git_data]# ls
a  c  d  README.md
删除本地仓库与远程仓库的关联
在本地仓库中执行命令：git remote rm origin

推送本地仓库内容到远程仓库
命令：git push origin 分支
注意：关联后第一次推到远程库前需要先拉取内容，否则报错

拉取远程仓库内容到本地仓库
命令：git pull origin 分支
存在本地库与远程库不一致情况：git pull origin 分支 --allow-unrelated-histories

克隆远程仓库到本地电脑形成本地仓库
格式：git clone 远程库地址
示例：[root@zutuanxue git_data]# git clone git@github.com:gongjunhe/gittest.git
```

## .gitignore文件

作用：忽略特殊文件。当工程中有些文件已经确定基本不会改变，所以不用每次推送时都推送，git在推送时会忽略.gitignore文件中列举的内容，可以提升推送效率
注意：文件名必须叫做.gitignore，.gitignore和.git文件夹是同一目录；
一定要push之前创建.gitignore文件，push之后创建.gitignore不用被git使用，因为git已经开始了版本控制。

```
文件内容说明

# 开头的行为注释，不生效

支持正则表达（简化的）

可以以(/)开头防止递归

最后有斜杠(/)的代表要忽略的是目录

加感叹号(!)表示取反
```

**支持的正则表达规范**

```
*	零个或多个字符
[]	匹配括号中的任意字符
?	匹配一字符
 [n-m]	匹配一个范围内的字符，[abc] 匹配 任何一个列在方括号中的字符 (这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c)

[^n-m]	不要匹配一个范围内的字符

**	表示匹配任意中间目录，比如 a/**/z 可以 匹配 a/z 、 a/b/z 或 a/b/c/z 等。

例如

a/：忽略任何目录下名为a的目录

/a.txt：只忽略当前目录下的a.txt，不忽略其它目录下的a.txt

 *.exe：忽略所有以.exe结尾的文件

 !/a/a.jpg：不忽略a目录下的a.jpg文件

 a/*.txt：忽略a目录下的以.txt结尾的文件,但不忽略其子目录下包含的以.txt结尾的文件

 *.[ao]:	忽略.a或.o结尾的文件
```