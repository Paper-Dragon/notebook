# Git拉取全部远程分支

## 命令

```bash
for i in `git branch -r`; do git checkout `basename $i` && git pull --all; done
```



