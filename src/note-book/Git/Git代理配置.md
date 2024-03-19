# Git代理配置



Git 是我经常用的软件。出于某些原因我经常要从 GitHub 这些网站上下载文件。但是 Git 不会从终端中继承代理设置。所以我平时用 export 设置的代理就用不上了。之后在网上找了几种给 Git 设置代理的方法。

```bash
git config --global http.proxy 'http://192.168.0.1:1080'

git config --global https.proxy 'http://192.168.0.1:1080'
```

设置完之后可以使用这个命令查看 Git 的配置。

```bash
git config --list
```

想退出查看界面的话就按下 Q 键。

当然还可以使用这个命令直接编辑 Git 的配置文件。

```bash
git config --global --edit
```

打开配置文件之后会是这样的。

```json
[http]

proxy = http://192.168.0.1:1080

[https]

proxy = http://192.168.0.1:1080
```

这里的编辑器应该默认是 Vim ，据说可以根据自己爱好换成其他的编辑器。

