# Git创建一个空分支

## 创建新分支

打开你的命令行界面（比如终端或Git Bash），进入你的Git仓库所在的目录。

```bash
git checkout --orphan <branch-name>
```

在这个命令中，`<branch-name>` 是你想要创建的新分支的名称。

## 清空工作区

在新分支上，你可能希望清空所有文件，以确保它是一个空的分支。

```bash
git rm -rf .
```

这会删除当前分支下的所有文件。

## 提交更改

提交清空工作区后的更改。

```bash
git commit -m "Initial commit"
```

现在，你就创建了一个无根的空的新分支，可以在这个分支上开始新的工作了。