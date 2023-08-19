## 一、git仓库初始化

```
git init	把当前所在目录变成git工作目录
git config	
	‐‐global       使用全局配置文件
	‐‐system       使用系统级配置文件
	‐‐local        使用版本库级配置文件

#定义git用户
[root@zutuanxue ~]# git config --global user.name "hello"

#定义git使用的邮箱
[root@zutuanxue ~]# git config --global user.email "hello@localhost

#定义语法高亮
[root@zutuanxue ~]# git config --global color.ui true


#查看定义的信息
[root@zutuanxue ~]# git config --list
user.name=hello
user.email=hello@localhost
color.ui=true
```

**git 配置文件管理**

```
1、新建配置文件
git config --global --add configName configValue
解释:给指定的级别的指定config增加一个值
示例:
[root@zutuanxue git_data]# git config --global --add user.name test
[root@zutuanxue git_data]# git config --global --list
user.name=hello
user.email=hello@localhost
user.name=test
color.ui=true


2、删除配置文件
git config --global --unset configName  (只针对存在唯一值的情况)
为了测试先增加一个
[root@zutuanxue git_data]# git config --global --add alias.test "aaaaa"
[root@zutuanxue git_data]# git config --global --list
user.name=hello
user.email=hello@localhost
user.name=test
color.ui=true
alias.test=aaaaa

删除这个唯一值,查看效果
[root@zutuanxue git_data]# git config --global --unset alias.test 
[root@zutuanxue git_data]# git config --global --list
user.name=hello
user.email=hello@localhost
user.name=test
color.ui=true


3、修改配置文件
git config --global configName configValue
[root@zutuanxue git_data]# git config --global --list
user.name=hello
user.email=hello@localhost
user.name=test
color.ui=true
[root@zutuanxue git_data]# git config --global user.name aaa
warning: user.name 有多个取值
error: 无法用一个值覆盖多个值
       使用一个正则表达式、--add 或 --replace-all 来修改 user.name。
[root@zutuanxue git_data]# git config --global --replace-all user.name aaa
[root@zutuanxue git_data]# git config --global --list
user.email=hello@localhost
user.name=aaa
color.ui=true


4、查看配置文件
git config --global configName
查询指定级别下: 实际生效的配置值
[root@zutuanxue git_data]# git config --global user.name 
aaa
```

## 二、git仓库数据管理机状态

**创建数据-提交数据**

![image20200405175817262.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603166365630.png)

本地仓库可以理解为工作目录下.git/objects

- git提交数据到仓库流程：

```
1. 先git add把新文件提交到暂存区
2. 再git commit 存到仓库
3. 最后使用git push提交到远程仓库；
```

- 用户使用则通过以下命令拉取到本地

```
1. 使用git clone/git pull将数据同步到本地仓库，再使用相关命令进行操作
```

**git四种状态**

![image20200405165323247.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603166335306.png)

- untracked：未跟踪的，也就是一个文件没有被git管理、监控起来
- unmodified：未修改的
- modified：已修改的
- staged：已暂存的

你工作目录下的每一个文件都不外乎这两种状态:已跟踪 或 未跟踪。 已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后， 它们的状态可能是未修改，已修改或已放入暂存区。简而言之，已跟踪的文件就是 Git 已经知道的文件。

工作目录中除已跟踪文件外的其它所有文件都属于未跟踪文件，它们既不存在于上次快照的记录中，也没有被放 入暂存区。 初次克隆某个仓库的时候，工作目录中的所有文件都属于已跟踪文件，并处于未修改状态，因为 Git 刚刚检出了它们， 而你尚未编辑过它们。

编辑过某些文件之后，由于自上次提交后你对它们做了修改，Git 将它们标记为已修改文件。 在工作时，你可以 选择性地将这些修改过的文件放入暂存区，然后提交所有已暂存的修改，如此反复。

**检查当前文件状态**

我们可以使用git status检查文件的状态

```
[root@zutuanxue git]# git status 
位于分支 master
尚无提交
无文件要提交（创建/拷贝文件并使用 "git add" 建立跟踪）

#这说明你现在的工作目录相当干净。换句话说，所有已跟踪文件在上次提交后都未被更改过。 此外，上面的信 息还表明，当前目录下没有出现任何处于未跟踪状态的新文件，否则 Git 会在这里列出来。
```

在项目下创建一个新的 README 文件。 如果之前并不存在这个文件，使用 git status 命令，你将看到一个新的未跟踪文件:

```
[root@zutuanxue git]# echo test > README
[root@zutuanxue git]# git status 
位于分支 master
尚无提交
未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）
	README
提交为空，但是存在尚未跟踪的文件（使用 "git add" 建立跟踪）
```

在状态报告中可以看到新建的 README 文件出现在 “未跟踪的文件” 下面。 未跟踪的文件意味着 Git 在之前 的快照(提交)中没有这些文件;Git 不会自动将之纳入跟踪范围，除非你明明白白地告诉它“我需要跟踪该文件”。

**跟踪新文件**

```
[root@zutuanxue git]# git add README 
[root@zutuanxue git]# git status
位于分支 master
尚无提交
要提交的变更：
  （使用 "git rm --cached <文件>..." 以取消暂存）
	新文件：   README
```

只要在 Changes to be committed 或者“要提交的变更”这行下面的，就说明是已暂存状态。 如果此时提交，那么该文件在你运 行git add时的版本将被留存在后续的历史记录中。

**暂存已修改的文件**

```
[root@zutuanxue git]# echo aaa >> README 
[root@zutuanxue git]# git status
位于分支 master
尚无提交
要提交的变更：
  （使用 "git rm --cached <文件>..." 以取消暂存）
	新文件：   README
尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git checkout -- <文件>..." 丢弃工作区的改动）
	修改：     README
```

现在我们来修改一个已被跟踪的文件。出现在Changes not staged for commit或者“尚未暂存以备提交的变更”这行下面，说明已跟踪文件的内容发生了变化，但还没有放到暂存区。 要暂存这次更新，需要运行 git add 命令。 这是个多功能命令:可以用它开 始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。再次使用git status -s查看

```
[root@zutuanxue git]# git status -s
A  README
################
?? 	新添加的未跟踪文件
A	新添加到暂存区中的文件
M	修改过的文件
```