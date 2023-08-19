ansible command与shell模块

两个模块都是用于执行linux命令的,这对于命令熟悉的工程师来说，用起来非常high。

shell模块与command模块差不多（command模块不能执行一些类似$HOME,>,<,|等符号，但shell可以)

https://docs.ansible.com/ansible/latest/modules/command_module.html

https://docs.ansible.com/ansible/latest/modules/shell_module.html

## 一、shell模块

```
[root@manage01 ~]# ansible -m shell 192.168.98.201 -a "ls /root"
192.168.98.201 | CHANGED | rc=0 >>
公共
模板
视频
图片
文档
下载
音乐
桌面
anaconda-ks.cfg
initial-setup-ks.cfg
nginx.service
nginx_study


[root@manage01 ~]# ansible -m shell 192.168.98.201 -a "echo 'hello world' > /tmp/baishuming"
192.168.98.201 | CHANGED | rc=0 >>


[root@manage01 ~]# ansible -m shell 192.168.98.201 -a "cat /tmp/baishuming"
192.168.98.201 | CHANGED | rc=0 >>
hello world


注意shell模块不是什么命令都能使用，比如vim这样的交互命令,不建议大家去记忆哪些命令不可以，大家只要养成任何在生产环境里的命令都要先在测试环境里测试一下的习惯就好。
```

## 二、command模块

```
[root@manage01 ~]# ansible -m command 192.168.98.201 -a "ls /root"
192.168.98.201 | CHANGED | rc=0 >>
公共
模板
视频
图片
文档
下载
音乐
桌面
anaconda-ks.cfg
initial-setup-ks.cfg
nginx.service
nginx_study

[root@manage01 ~]# ansible -m command 192.168.98.201 -a "echo 'baism hello' > /tmp/baism_123"
192.168.98.201 | CHANGED | rc=0 >>
baism hello > /tmp/baism_123

[root@manage01 ~]# ansible -m command 192.168.98.201 -a "cat /tmp/baism_123"
192.168.98.201 | FAILED | rc=1 >>
cat: /tmp/baism_123: 没有那个文件或目录non-zero return code



发现没有/tmp/baism_123 证明上一条命令未能执行成功
```

## 三、学习视频

[视频： command与shell模块](https://www.bilibili.com/video/BV19J41167sM?p=23)