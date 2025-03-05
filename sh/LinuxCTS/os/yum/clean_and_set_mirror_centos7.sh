#!/bin/bash

Green="\033[32m"
Red="\033[31m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
YellowBG="\033[43;37m"
Font="\033[0m"

Info="${Green}[信息]${Font}"
OK="${Green}[OK]${Font}"
Error="${Red}[错误]${Font}"
Warning="${Red}[警告]${Font}"

source '/etc/os-release'
VERSION="${VERSION_ID}"

judge() {
    if [[ $? -eq 0 ]]; then
        echo -e "${OK} ${GreenBG} $1 完成 ${Font}"
        sleep 1
    else
        echo -e "${Error} ${RedBG} $1 失败 ${Font}"
        exit
    fi
}

check_version() {
    if [ "$VERSION" != "7" ]; then
        echo -e "${Error} ${RedBG} 该脚本仅适用于CentOS 7，当前系统版本为: $VERSION ${Font}"
        exit
    fi
    echo -e "${OK} ${GreenBG} 确认当前系统版本为CentOS 7 ${Font}"
}


# 主函数
main() {

    check_version

    REPO_DIR="/etc/yum.repos.d/"
    ALIYUN_REPO_CONTENT='
[base]
name=CentOS-$releasever - base - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/os/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[updates]
name=CentOS-$releasever - updates - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/updates/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[extras]
name=CentOS-$releasever - extras - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/extras/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[centosplus]
name=CentOS-$releasever - centosplus - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/centosplus/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[fasttrack]
name=CentOS-$releasever - fasttrack - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/fasttrack/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[atomic]
name=CentOS-$releasever - atomic - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/atomic/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[dotnet]
name=CentOS-$releasever - dotnet - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/dotnet/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[rt]
name=CentOS-$releasever - rt - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/rt/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[sclo-rh]
name=CentOS-$releasever - sclo-rh - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/sclo/$basearch/rh/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7

[sclo-sclo]
name=CentOS-$releasever - sclo-sclo - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-vault/centos/$releasever/sclo/$basearch/sclo/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-7
'

    echo -e "${Info} 正在删除原有的repo文件..."
    rm -f "$REPO_DIR"*.repo
    judge "删除原有的repo文件"

    echo -e "${Info} 正在将阿里云源写入repo文件..."
    echo "$ALIYUN_REPO_CONTENT" > "$REPO_DIR/CentOS-Base.repo"
    judge "写入阿里云源"

    echo -e "${Info} 创建新的yum缓存..."
    yum makecache
    judge "创建新的yum缓存"

    echo -e "${OK} 阿里云源配置完成！"
}

main
