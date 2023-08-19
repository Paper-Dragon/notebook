## git status/git status -s

查看状态

```
[root@zutuanxue git_data]# git status
位于分支 master
尚无提交
无文件要提交（创建/拷贝文件并使用 "git add" 建立跟踪）
[root@zutuanxue git_data]# touch a b c
[root@zutuanxue git_data]# ls
a  b  c
[root@zutuanxue git_data]# git status 
位于分支 master
尚无提交
未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）
	a
	b
	c
提交为空，但是存在尚未跟踪的文件（使用 "git add" 建立跟踪） 
```

## git add

暂存内容

```
[root@zutuanxue git_data]# git add a
[root@zutuanxue git_data]# git status 
位于分支 master
尚无提交
要提交的变更：
  （使用 "git rm --cached <文件>..." 以取消暂存）
	新文件：   a
未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）
	b
	c
[root@zutuanxue git_data]# ll .git/
总用量 16
drwxr-xr-x 2 root root   6 4月   3 05:34 branches
-rw-r--r-- 1 root root  92 4月   3 05:34 config
-rw-r--r-- 1 root root  73 4月   3 05:34 description
-rw-r--r-- 1 root root  23 4月   3 05:34 HEAD
drwxr-xr-x 2 root root 301 4月   3 05:34 hooks
-rw-r--r-- 1 root root  96 4月   5 06:05 index
#你会发现index的时间产生了变化，这意味着，我们使用git add命令将文件提交到了暂存区域
drwxr-xr-x 2 root root  21 4月   3 05:34 info
drwxr-xr-x 5 root root  40 4月   5 06:05 objects
drwxr-xr-x 4 root root  31 4月   3 05:34 refs
[root@zutuanxue git_data]# ll .git/objects/
总用量 0
drwxr-xr-x 2 root root 52 4月   5 06:05 e6
drwxr-xr-x 2 root root  6 4月   3 05:34 info
drwxr-xr-x 2 root root  6 4月   3 05:34 pack
[root@zutuanxue objects]# ls e6
9de29bb2d1d6434b8b29ae775ad8c2e48c5391
[root@zutuanxue objects]# cat e6/9de29bb2d1d6434b8b29ae775ad8c2e48c5391 
#在objects目录中可以看到已元数据形式存储的a文件，这个我们看不懂，我们可以将数据都添加
 

[root@zutuanxue git_data]# git add .  #可以使用.也可以使用*
[root@zutuanxue git_data]# git status
位于分支 master
尚无提交
要提交的变更：
  （使用 "git rm --cached <文件>..." 以取消暂存）
	新文件：   a
	新文件：   b
	新文件：   c
```

## git rm

将文件从暂存区撤回到工作区（变成未跟踪的）、然后再删除文件；也可以直接从暂存区删除

```
[root@zutuanxue git_data]# git rm --cached c
rm 'c'
[root@zutuanxue git_data]# git status 
位于分支 master
尚无提交
要提交的变更：
  （使用 "git rm --cached <文件>..." 以取消暂存）
	新文件：   a
	新文件：   b
未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）
	c
[root@zutuanxue git_data]# rm -fr c
[root@zutuanxue git_data]# git status 
位于分支 master
尚无提交
要提交的变更：
  （使用 "git rm --cached <文件>..." 以取消暂存）
	新文件：   a
	新文件：   b
[root@zutuanxue git_data]# git rm -f b
rm 'b'
[root@zutuanxue git_data]# git status 
位于分支 master
尚无提交
要提交的变更：
  （使用 "git rm --cached <文件>..." 以取消暂存）
	新文件：   a
[root@zutuanxue git_data]# git commit -m " new a"	#提交到本地仓库
[master（根提交） 6ac34be] a
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 a
[root@zutuanxue git_data]# git status
位于分支 master
无文件要提交，干净的工作区
```

## git mv

将暂存区里的数据改名或移动

```
1.使用mv命令配合git
[root@zutuanxue git_data]# mv a a.txt
[root@zutuanxue git_data]# git status
位于分支 master
尚未暂存以备提交的变更：
  （使用 "git add/rm <文件>..." 更新要提交的内容）
  （使用 "git checkout -- <文件>..." 丢弃工作区的改动）

	删除：     a

未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）

	a.txt

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
[root@zutuanxue git_data]# git rm --cached a	###从暂存区删除a
rm 'a'
[root@zutuanxue git_data]# git status 
位于分支 master
要提交的变更：
  （使用 "git reset HEAD <文件>..." 以取消暂存）

	删除：     a

未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）

	a.txt

[root@zutuanxue git_data]# git add a.txt
[root@zutuanxue git_data]# git status
位于分支 master
要提交的变更：
  （使用 "git reset HEAD <文件>..." 以取消暂存）

	重命名：   a -> a.txt	########识别到a和a.txt是重命名的文件
[root@zutuanxue git_data]# git commit -m "rename a to a.txt"
#提交到本地仓库
[master 47a267c] a.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 rename a => a.txt (100%)


2.使用git mv直接重命名
[root@zutuanxue git_data]# git mv a.txt a	#将工作区域和暂存区域的文件同时重命名
[root@zutuanxue git_data]# git status
位于分支 master
要提交的变更：
  （使用 "git reset HEAD <文件>..." 以取消暂存）

	重命名：   a.txt -> a

[root@zutuanxue git_data]# git commit -m "rename a.txt to a"
[master a714e37] a
 1 file changed, 0 insertions(+), 0 deletions(-)
 rename a.txt => a (100%)
```

## git diff

git status 只能查看区域状态的不同 ，不能查看文件内容的变化。

git diff 查看内容的不同

```
[root@zutuanxue git_data]# git diff #没有变化时不显示内容
[root@zutuanxue git_data]# vim a
hello
abc
[root@zutuanxue git_data]# git add a
[root@zutuanxue git_data]# vim a
hello
test
test1
[root@zutuanxue git_data]# git diff a	#调整完成文件后，对比本地工作目录和暂存区文件的差异
diff --git a/a b/a
#git格式的diff命令，进行比较的是a版本的a文件和b版本的a文件
index e69de29..ce01362 100644
#两个版本的哈希值，100644表示是对象是普通文件，权限是644
--- a/a			#---表示变动前，也就是a版本的a文件
+++ b/a			#+++表示变动后，也就是b版本的a文件
@@ -1,2 +1,3 @@	## 以@符号开始和结束“-1，2”表示前一个文件从第一行开始的连续两行；“+1，3”表示后一个文件的从第一行开始连续的3行（-表示前一个文件，+表示后一个文件）
hello			
-abc			#-表示去掉的内容
+test
+test1		#+表示新增的内容

[root@zutuanxue git_data]# git diff --cached a	#对比暂存区和本地仓库的差异
diff --git a/a b/a
index e69de29..0e3af97 100644
--- a/a
+++ b/a
@@ -0,0 +1,2 @@
+hello
+abc
```

## git commit -m

将暂存区内容提交到本地仓库-m后面是描述信息

```
[root@zutuanxue git_data]# git commit -m "version2 a"
[master 8f01c62] version2 a
 1 file changed, 2 insertions(+)
[root@zutuanxue git_data]# git diff --cached a
git commit # 相当于虚拟机的镜像、任何操作都被做了一次快照 ，可恢复到任意一个位置
```

## git commit -am

快速提交到本地仓库

```
[root@zutuanxue git_data]# cat a
haha
[root@zutuanxue git_data]# git diff
[root@zutuanxue git_data]# echo hello >> a
[root@zutuanxue git_data]# git diff
diff --git a/a b/a
index 5ad28e2..5c06d49 100644
--- a/a
+++ b/a
@@ -1 +1,2 @@
 haha
+hello
[root@zutuanxue git_data]# git status 
位于分支 master
尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git checkout -- <文件>..." 丢弃工作区的改动）

	修改：     a

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
[root@zutuanxue git_data]# git add a
[root@zutuanxue git_data]# git commit -m "add hello"
[master 2add75e] add hello
 1 file changed, 1 insertion(+)
[root@zutuanxue git_data]# git diff
######在a文件中添加hello并提交到仓库
[root@zutuanxue git_data]# echo haha >> a
[root@zutuanxue git_data]# git commit -am "add haha"#也可以使用-am直接提交到仓库，相当于先git add再git commit -m，但必须是跟踪状态的文件，参数a必须在m前面，否则会报错，无法提交。
[master f3d6391] add haha
 1 file changed, 1 insertion(+)
[root@zutuanxue git_data]# git diff
[root@zutuanxue git_data]# git status 
位于分支 master
无文件要提交，干净的工作区
[root@zutuanxue git_data]# git log --oneline 
f3d6391 (HEAD -> master) add haha
2add75e add hello
```

## git checkout –

检出，重写工作区数据

```
[root@zutuanxue git_data]# echo haha >> a
[root@zutuanxue git_data]# cat a
hello
test
test1
123
haha
[root@zutuanxue git_data]# git status 
位于分支 master
尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git checkout -- <文件>..." 丢弃工作区的改动）

	修改：     a

修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
[root@zutuanxue git_data]# git  checkout -- a
[root@zutuanxue git_data]# git status 
位于分支 master
无文件要提交，干净的工作区
[root@zutuanxue git_data]# cat a
hello
test
test1
123
```

## git reset HEAD

本地仓库覆盖暂存区域

```
[root@zutuanxue git_data]# echo "" > a	#将a的内容清空
[root@zutuanxue git_data]# git add a	#提交到暂存区
[root@zutuanxue git_data]# git commit -m "test head"	#提交到仓库
[master dd7925f] test head
 1 file changed, 1 insertion(+), 1 deletion(-)
[root@zutuanxue git_data]# echo haha > a	#添加内容到a
[root@zutuanxue git_data]# git add a	#提交到暂存区
[root@zutuanxue git_data]# git diff a	#确认没有差异
[root@zutuanxue git_data]# git reset HEAD a	#用本地仓库的数据将暂存区数据覆盖
重置后取消暂存的变更：
M	a
[root@zutuanxue git_data]# git diff a	#比较工作区和暂存区的数据差异
diff --git a/a b/a
index 8b13789..5ad28e2 100644
--- a/a
+++ b/a
@@ -1 +1 @@
-
+haha
```

## git reset --hard 哈希头名

Git服务程序中有一个叫做HEAD的版本指针，当用户申请还原数据时，其实就是将HEAD指针指向到某个特定的提交版本，但是因为Git是分布式版本控制系统，为了避免历史记录冲突，故使用了SHA‐1计算出十六进制的哈希字串来区分每个提交版本，另外默认的HEAD版本指针会指向到最近的一次提交版本记录，，注意恢复版本后代表的是在这个版本之前的内容全在（包括工作目录和暂存），本版本之后的都没了

```
[root@zutuanxue git_data]# git log --oneline 
f3d6391 (HEAD -> master) add haha
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
[root@zutuanxue git_data]# git reset --hard e2e2
HEAD 现在位于 e2e2131 head test
[root@zutuanxue git_data]# git log --oneline 
2add75e (HEAD -> master) add hello
ff77333 aaa
dd7925f test head
e2e2131 head test
644d678 test head
326e57a v2 a
8f01c62 version2 a
a714e37 a
47a267c a.txt
6ac34be a
[root@zutuanxue git_data]# cat a
test


#git reset --mixed：此为默认方式，不带任何参数的git reset，即是这种方式，移动head指针，改变暂存区内容，但不会改变工作区
#git reset  --soft：回退到某个版本，仅移动当前Head指针，不会改变工作区和暂存区的内容  
#git reset --hard：彻底回退到某个版本，head指针、工作区和暂存区内容全部改变

--soft用处不是很多；当执行git commit之后想撤回，但还不想覆盖工作区内容时，使用--mixed；当想完全回滚时，使用--hard来覆盖工作区。
```

## git reflog

```
[root@zutuanxue git_data]# cat a		#查看文件内容，发现恢复错了，本来是想恢复到“add haha”这个位置的
test
[root@zutuanxue git_data]# git log --oneline #使用log查看，发现没有“add haha”的内容了
e2e2131 (HEAD -> master) head test
644d678 test head
326e57a v2 a
8f01c62 version2 a
a714e37 a
47a267c a.txt
6ac34be a
#原因很简单，因为我们当前的工作版本是历史的一个提交点，这个历史提交点还没有发生过add bbb更新记录，所以当然就看不到了 ，要是想”还原到未来”的历史更新点 ，可以用git reflog命令来查看所有的历史记录
[root@zutuanxue git_data]# git reflog 
# 使用git reflog 可查看总历史内容（注意这里面也是所有的commit之后，也就是放到本地仓后的记录）再结合git reset --hard 哈希头部恢复版本快照 ，所有的数据根本就不可能丢失，随便删除，随便恢复（前提是已提交仓库的的内容）

e2e2131 (HEAD -> master) HEAD@{0}: reset: moving to e2e2
2add75e HEAD@{1}: reset: moving to 2add75e
f3d6391 HEAD@{2}: commit: add haha
2add75e HEAD@{3}: commit: add hello
ff77333 HEAD@{4}: commit: aaa
dd7925f HEAD@{5}: commit: test head
e2e2131 (HEAD -> master) HEAD@{6}: commit: head test
644d678 HEAD@{7}: commit: test head
326e57a HEAD@{8}: commit: v2 a
8f01c62 HEAD@{9}: commit: version2 a
a714e37 HEAD@{10}: commit: a
47a267c HEAD@{11}: commit: a.txt
6ac34be HEAD@{12}: commit (initial): a
[root@zutuanxue git_data]# git reset --hard f3d6	#使用reset恢复到“add haha”的版本
HEAD 现在位于 f3d6391 add haha
[root@zutuanxue git_data]# cat a
haha
hello
haha
```