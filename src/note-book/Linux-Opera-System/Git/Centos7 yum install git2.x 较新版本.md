# Centos7 yum install git2.x(较新版本)

centos7 默认的git版本是1.8.x

    # git --version
    git version 1.8.3.1

升级依然没有升级到2.x版本

    yum -y upgrade git

在Git的官网上，对Red Hat Linux安装git建议有两种

    1、下载源代码、编译、构建、配置环境变量
    2、第三方仓库IUS

对于第一种方式，可以参考其他人的博客，例如https://blog.csdn.net/Juladoe/article/details/76170193
Git第三方仓库安装方式（IUS）

这里是 ius 官方的安装说明及使用说明

1.安装使用里面说的自动化安装脚本

    curl https://setup.ius.io | sh

2.然后可以看到 git2u相关内容

    # yum search git 
    
    ...
    git.x86_64 : Fast Version Control System
    git2u.x86_64 : Fast Version Control System
    gitflow.noarch : Extensions providing operations for V. Driessen's branching model
    ...

3.执行安装，并查看下版本

    # yum remove -y git | yum -y install git2u
    
    # git --version
    
    git version 2.16.4

关于IUS

IUS第三方仓库不仅仅用于 git 的安装，它是包含了很多软件工具，它的使用指南里说明了一切

    redis40u、redis32u、mysql56u、python36u、、 