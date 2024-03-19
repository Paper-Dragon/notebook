# Centos7.x安装Python3.9.7和Ansible4.5

## 1、环境信息

前期安装Ansible失败报"Failed to validate the SSL certificate"，可能前期安装python3时有问题，后索性升级SSH/SSL后再重新安装Python3,然后再升级pip,最后再安装Ansible

```bash
安装环境： 　Centos7.9
SSH/SSL:　　OpenSSH_8.7p1, OpenSSL 1.1.1l  24 Aug 2021

#Python版本(3.9.7为此文章第2步安装后的版本信息)：

# python --version

Python 2.7.5

# python3 --version

Python 3.9.7
```

## 2、安装步骤



```bash
##安装依赖
yum install -y gcc gcc-c++ ncurses ncurses-devel unzip zlib-devel zlib openssl-devel openssl libffi-devel

##源码安装Python3.9.7
cd /opt && wget https://www.python.org/ftp/python/3.9.7/Python-3.9.7.tgz
cd /opt; tar -zxvf Python-3.9.7.tgz ; cd /opt/Python-3.9.7
./configure --prefix=/usr/local/python/ && make -j4 && make install

##设置命令环境
/usr/local/python/bin/python3 --version
ln -sf /usr/local/python/bin/python3 /usr/local/bin/
python3 --version

##升级pip
/usr/local/python/bin/pip3 install --upgrade pip
ln -sf /usr/local/python/bin/pip3 /usr/local/bin/

##安装最新版本ansible4.5.0
pip3 install ansible
/usr/local/python/bin/ansible --version
ln -s /usr/local/python/bin/ansible /usr/local/bin/
ansible --version
```

## 3、问题解决

有些文章在安装Python后，会在/usr/bin下把python的软链接指向python3
注意：如果不修改默认python的软链接，无需修改相应yum配置。

```bash
# ll /usr/bin|grep python

lrwxrwxrwx. 1 root root       7 Sep 13 20:10 python -> python3
lrwxrwxrwx. 1 root root       9 Sep 13 20:10 python2 -> python2.7
-rwxr-xr-x. 1 root root    7144 Oct 14  2020 python2.7
-rwxr-xr-x. 1 root root    7144 Oct 14  2020 python3->/usr/local/python/bin/python3.9
```

此时yum会无法使用
yum需要用python2编译，如果服务器安装的是python3并作为默认编译器的话，yum会无法使用，修改如下：



```bash
vim /usr/bin/yum

##修改第一行解释器为python2
#!/usr/bin/python2
import sys
try:
    import yum
except ImportError:
    print >> sys.stderr, """\
```



还需要修改 /usr/libexec/urlgrabber-ext-down脚本，同样需要python2作为编译器

```bash
vim /usr/libexec/urlgrabber-ext-down
　
##修改第一行解释器为python2
#! /usr/bin/python2

#  A very simple external downloader

#  Copyright 2011-2012 Zdenek Pavlas
```

