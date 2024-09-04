# 从SVN迁移仓库到Git

## 建立 SVN 用户到 Git 用户的映射

**查看 SVN 用户**

首先检出全部 SVN 用户列表：

```bash
svn log --xml | grep "^<author" | sort -u | \awk -F '<author>' '{print $2}' | awk -F '</author>' '{print $1}' > userinfo.txt
```

输出的 userinfo.txt 文件内容如下：

```ba'sh
edmond
```

**描述映射关系**

接着按以上格式描述映射关系：

```bash
edmond = edmond <edmond@geekery.cn>
cc = cc <cc@geekery.cn>
dd = dd <dd@geekery.cn>
```

此时，userinfo.txt 就准备好了，接下来开始克隆 SVN 地址。

## 下载 SVN 代码库

操作之前，你需要了解 SVN 目录和 Git 的关系：

**SVN目录**

- /trunk：开发主线，相当于 Git 中的 Master 分支；
- /branches：支线副本，相当于 Git 中的其余分支；
- /tags：标签，与 Git中的标签一样；

**下载 SVN 仓库**

把上一步准备好的 userinfo.txt 拷贝到准备克隆 SVN 代码的目录下，然后执行git svn clone命令克隆一个 Git 版本库。

如果你的项目是完全按照 trunk，branches，tags 来管理的，只需使用--stdlayout进行范围指定，迁移的命令可以写作如下：

```bash
git svn clone ["SVN repo URL"] --prefix=svn/ --no-metadata --authors-file=userinfo.txt --stdlayout
```

如果是非标准格式的仓库，可以通过 --trunk，--branches 和 --tags 去指定：

```bash
git svn clone ["SVN repo URL"] --prefix=svn/ --no-metadata --authors-file=userinfo.txt --trunk=trunk --tags=tags --branches=branches
```

- 参数 –no-metadata 表示阻止 Git 导出 SVN 包含的一些无用信息；
- 参数 –authors-file 表示 SVN 用户映射到 Git 用户的说明文件；
- 参数 –trunk 表示指定 SVN 的 trunk 分支；
- 参数 –branches 表示指定 SVN 的支线分支；
- 参数 –tags 表示指定 SVN 的标签；

**ignore 文件转换**

如果 SVN 库使用 svn：ignore 属性，可以使用以下命令将其转换为 .gitignore 文件：

```bash
cd [下载后目录]
git svn show-ignore > .gitignore
git add .gitignore
git commit -m 'Convert svn:ignore properties to .gitignore.'
```

**“ trunk”分支重命名为“ master”**

转换后，您的主要开发分支将被命名为“ trunk”，即 SVN 中的开发分支。

可以使用以下命令将其重命名为 Git 标准的“ master”分支：

```bash
git branch -m trunk master
```

**清理标签**

git-svn使所有 SVN 标签变成了 Git 中非常短的分支，形式为“标签/名称”，因此需要将这些短分支转换为实际的 Git 标签或删除掉它们，转换为 Git 标签的命令如下：

```bash
git for-each-ref --format='%(refname)' refs/heads/tags | % { $_.Replace('refs/heads/tags/','') } | % { git tag $_ "refs/heads/tags/$_"; git branch -D "tags/$_" }
```

**转换其他分支为本地 Git 分支**

除了标签转换外，还可以把远端剩下的分支变成本地 Git 分支：

```bash
git for-each-ref --format='%(refname)' refs/remotes | % { $_.Replace('refs/remotes/','') } | % { git branch "$_" "refs/remotes/$_"; git branch -r -d "$_"; }
```

## 推送至 Git 服务器

VN 代码已经 clone 到本地了，接着需要 push 到 服务端

```bash
git remote add origin git@xxxx.git
```

```bash
git push -u origin --tags
```

