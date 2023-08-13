## step1：查看提交记录，获得版本号

`git log`

```bash
commit 36cc122f5a2218d2b2d4109593a4ec5de589f807
Author: yhl <xxx.com>
Date:   Thu Sep 23 09:51:54 2021 +0800
 
    ignore
 
commit 203738c9ccad7d95b728c8d9d287f2ff24eaaca2
Author: chen1234520 <xxx.com.cn>
Date:   Wed Sep 22 18:14:18 2021 +0800
 
    更新头文件路径
 
commit a9b26683996b88c2bb87cff9cc1bdae38b9c5708
Author: chen1234520 <xxx.com.cn>
Date:   Wed Sep 22 17:30:07 2021 +0800
 
    上传测试样例图
```

commit后面的一串数字就是版本号

## step2：本地回退到相应的版本

```bash
git reset --hard <版本号>

git reset --hard 203738c9ccad7d95b728c8d9d287f2ff24eaaca2
```

## step3：远程仓库也退到相应的版本

```bash
git push origin <分支名> --force

git push origin master --force

```

