同事创建出新的分支后，我这边用sourcetree刷新，始终看不到最新的。上网查了一下，可以用命令刷新，刷新之后就可以看到新创建的分支了。

```bash
git remote update origin --prune
```



或者

```bash
git remote update origin -p
```



![img](git更新远程分支.assets/16508655505992-16919218019251.png)