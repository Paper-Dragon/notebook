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
ARCH=$(uname -m)

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

check_architecture() {
    if [[ "$ARCH" != "x86_64" && ! "$ARCH" =~ ^(aarch64|armhfp|i386|power9|ppc64|ppc64le)$ ]]; then
        echo -e "${Error} ${RedBG} 不支持的架构类型: $ARCH ${Font}"
        exit 1
    fi
    
    if [ "$ARCH" == "x86_64" ]; then
        echo -e "${OK} ${GreenBG} 确认当前系统架构为x86_64 ${Font}"
    else
        echo -e "${OK} ${GreenBG} 确认当前ALTARCH架构为$ARCH ${Font}"
    fi
}

ALIYUN_REPO_X86_64='
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

ALIYUN_REPO_ALTARCH='
[base]
name=CentOS-$releasever - base - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/$releasever/os/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[updates]
name=CentOS-$releasever - updates - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/$releasever/updates/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[extras]
name=CentOS-$releasever - extras - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/$releasever/extras/$basearch/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[centosplus]
name=CentOS-$releasever - centosplus - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/centos/$releasever/centosplus/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[fasttrack]
name=CentOS-$releasever - fasttrack - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/centos/$releasever/fasttrack/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[atomic]
name=CentOS-$releasever - atomic - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/centos/$releasever/atomic/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[dotnet]
name=CentOS-$releasever - dotnet - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/centos/$releasever/dotnet/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[rt]
name=CentOS-$releasever - rt - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/centos/$releasever/rt/$basearch/
enabled=0
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[sclo-rh]
name=CentOS-$releasever - sclo-rh - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/$releasever/sclo/$basearch/rh/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7

[sclo-sclo]
name=CentOS-$releasever - sclo-sclo - mirrors.aliyun.com
baseurl=http://mirrors.aliyun.com/centos-altarch/$releasever/sclo/$basearch/sclo/
enabled=1
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-altarch/RPM-GPG-KEY-CentOS-7
'


# 主函数
main() {

    check_version
    check_architecture

    REPO_DIR="/etc/yum.repos.d/"
    if [ "$ARCH" == "x86_64" ]; then
        ALIYUN_REPO_CONTENT="$ALIYUN_REPO_X86_64"
    else
        ALIYUN_REPO_CONTENT="$ALIYUN_REPO_ALTARCH"
    fi

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
