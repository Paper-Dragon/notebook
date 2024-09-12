# Apt查询某个软件有哪些版本

> https://blog.csdn.net/quantum7/article/details/103417643

安装默认，有时候会出问题。怎么办？查询一下版本：

```bash
sudo apt update
sudo apt-cache madison g++
    
g++ |  4:8.3.0-1 | http://deb.debian.org/debian buster/main amd64 Packages
g++ |  4:6.3.0-4 | https://mirrors.ustc.edu.cn/debian stretch/main amd64 Packages
g++ |  4:6.3.0-4 | https://mirrors.tuna.tsinghua.edu.cn/debian stretch/main amd64 Packages
g++ |  4:6.3.0-4 | https://mirror.sjtu.edu.cn/debian stretch/main amd64 Packages
g++ |  4:6.3.0-4 | http://mirrors.aliyun.com/debian stretch/main amd64 Packages
g++ |  4:6.3.0-4 | https://mirrors.huaweicloud.com/debian stretch/main amd64 Packages
g++ |  4:6.3.0-4 | http://mirrors.163.com/debian stretch/main amd64 Packages
gcc-defaults |      1.168 | https://mirrors.ustc.edu.cn/debian stretch/main Sources
gcc-defaults |      1.168 | https://mirrors.tuna.tsinghua.edu.cn/debian stretch/main Sources
gcc-defaults |      1.168 | https://mirror.sjtu.edu.cn/debian stretch/main Sources
gcc-defaults |      1.168 | http://mirrors.aliyun.com/debian stretch/main Sources
gcc-defaults |      1.168 | https://mirrors.huaweicloud.com/debian stretch/main Sources
gcc-defaults |      1.168 | http://mirrors.163.com/debian stretch/main Sources
gcc-defaults |      1.181 | http://deb.debian.org/debian buster/main Sources
```

安装低版本：

```bash
apt install g++=4:6.3.0-4
```