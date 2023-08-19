## git log

查看历史的git commit快照操作

```
[root@zutuanxue git_data]# git log
commit 326e57a3f87de546c8c17774f174192e280e36fc (HEAD -> master)
#哈希字符串的描述信息 HEAD->master表示当前工作目录所对应的commit，会随着新的commit变化（在个别版本中使用git log不会显示HEAD字样内容，需要使用git log --decorate）
Author: aaa <hello@localhost>
#作者
Date:   Mon Apr 6 01:00:27 2020 -0400
#时间

    v2 a	#git commit -m添加的描述信息

commit 8f01c62906ee7c06489aae7afb42adaa3da90fdc
Author: aaa <hello@localhost>
Date:   Mon Apr 6 00:43:55 2020 -0400

    version2 a

commit a714e37d98c3ab77cfa27f0d0a1ca773c6e4ce57
Author: aaa <hello@localhost>
Date:   Sun Apr 5 06:26:53 2020 -0400

    a

commit 47a267cc489a93f8fab100d7f945a15209f61240
Author: aaa <hello@localhost>
Date:   Sun Apr 5 06:25:51 2020 -0400

    a.txt

commit 6ac34be689eda430ffefc12114fde40759d536b0
Author: aaa <hello@localhost>
Date:   Sun Apr 5 06:21:02 2020 -0400

    a
[root@zutuanxue git_data]# git log --oneline	#简单的形式展示内容，只显示哈希标识符的前几位
326e57a (HEAD -> master) v2 a
8f01c62 version2 a
a714e37 a
47a267c a.txt
6ac34be a

############################
[root@zutuanxue git_data]# echo 123 >> a
[root@zutuanxue git_data]# git add a
[root@zutuanxue git_data]# git commit -m "test head"
[master 644d678] test head
 1 file changed, 1 insertion(+)
[root@zutuanxue git_data]# git log --oneline --decorate
644d678 (HEAD -> master) test head	#产生变化
326e57a v2 a
8f01c62 version2 a
a714e37 a
47a267c a.txt
6ac34be a
```

## git log -p

```
[root@zutuanxue git_data]# git log -p	#显示具体变化的内容，调用了git diff
commit 644d6785e33714f8f21a3767e39e2013540e1ee2 (HEAD -> master)
Author: aaa <hello@localhost>
Date:   Mon Apr 6 01:12:02 2020 -0400

    test head

diff --git a/a b/a
index b989558..864e0ba 100644
--- a/a
+++ b/a
@@ -1,3 +1,4 @@
 hello
 test
 test1
+123
```

## git log -n

```
[root@zutuanxue git_data]# git log -1	#只显示最近几条内容
commit 644d6785e33714f8f21a3767e39e2013540e1ee2 (HEAD -> master)
Author: aaa <hello@localhost>
Date:   Mon Apr 6 01:12:02 2020 -0400

    test head
[root@zutuanxue git_data]# git log -2
commit 644d6785e33714f8f21a3767e39e2013540e1ee2 (HEAD -> master)
Author: aaa <hello@localhost>
Date:   Mon Apr 6 01:12:02 2020 -0400

    test head

commit 326e57a3f87de546c8c17774f174192e280e36fc
Author: aaa <hello@localhost>
Date:   Mon Apr 6 01:00:27 2020 -0400

    v2 a
```