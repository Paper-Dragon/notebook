# 环境变量

## 修改环境变量

export PS1="[[\e[34;1m]\u@[\e[0m][\e[32;1m]\H[\e[0m] [\e[31;1m]\w[\e[0m]]\$ " 基本优化命令行 颜色

### 1、临时-重新登录系统后失效。

export PS1="[\[\e[34;1m\]\u@\[\e[0m\]\[\e[32;1m\]\H\[\e[0m\] \[\e[31;1m\]\w\[\e[0m\]]\\$ "

### 2、永久-写入文件/etc/profile 与生效

    [root@VM-4-4-centos ~]# tail -1  /etc/profile
    export PS1="[\[\e[34;1m\]\u@\[\e[0m\]\[\e[32;1m\]\H\[\e[0m\] \[\e[31;1m\]\w\[\e[0m\]]\\$ "
    [root@VM-4-4-centos ~]# source  /etc/profile

### 3、检查

    [root@VM-4-4-centos ~]# echo $PS1
    [\[\e[34;1m\]\u@\[\e[0m\]\[\e[32;1m\]\H\[\e[0m\] \[\e[31;1m\]\w\[\e[0m\]]\\$
