#!/bin/bash

GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"
OK="[OK]"
Error="[ERROR]"

show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --protocol <协议>   使用的协议 (http 或 https), 默认: https"
    echo "  --ip-version <版本> 使用的IP版本 (ipv4 或 ipv6), 默认: ipv4"
    echo "  --help              显示此帮助信息"
    exit 0
}

is_root() {
    if [ "$(id -u)" -ne 0 ]; then
        echo -e "${RedBG}请以root用户运行此脚本${Font}"
        exit
    fi
}

check_os() {
    source /etc/os-release
    OS_TYPE=$ID
    if [[ "$OS_TYPE" != "ubuntu" && "$OS_TYPE" != "debian" && "$OS_TYPE" != "arch" ]]; then
        judge "此脚本仅支持Ubuntu、Debian和ArchLinux操作系统"
    fi
}

judge() {
    if [ $? -eq 0 ]; then
        echo -e "${OK} ${GreenBG} $1 完成 ${Font}"
    else
        echo -e "${Error} ${RedBG} $1 失败 ${Font}"
        rm "$TEMP_FILE" &> /dev/null
        exit 1
    fi
}

is_root
check_os

PROTOCOL="https"
IP_VERSION="ipv4"

while [[ $# -gt 0 ]]; do
    case $1 in
        --protocol)
        PROTOCOL=$2
        shift
        ;;
        --ip-version)
        IP_VERSION=$2
        shift
        ;;
        --help)
        show_help
        ;;
        *)
        judge "未知参数: $1"
        ;;
    esac
    shift
done

if [[ "$PROTOCOL" != "http" && "$PROTOCOL" != "https" ]]; then
    judge "协议必须是 http 或 https"
fi

if [[ "$IP_VERSION" != "ipv4" && "$IP_VERSION" != "ipv6" ]]; then
    judge "IP版本必须是 ipv4 或 ipv6"
fi

source /etc/os-release
VERSION_CODENAME=$VERSION_CODENAME
ID=$ID
VERSION_ID=$VERSION_ID
#  判断是不是 x86_64 架构
download_source_list() {
    TEMP_FILE=$(mktemp)
    curl -s -o "$TEMP_FILE" "$URL"
    judge "Curl 命令执行"

    mv "$TEMP_FILE" "$CONFIG_FILE"
    judge "更新配置文件"
}

case $OS_TYPE in
    ubuntu|debian)
        echo -e "${GreenBG}正在进行换中科大镜像源....${Font}"
        sleep 1
        if [ "$(uname -m)" != "x86_64" ]; then
            if [ $OS_TYPE == "ubuntu" ] && [ $VERSION_ID == "24.04" ]; then
                sed -i 's@//ports.ubuntu.com@//mirrors.ustc.edu.cn@g' /etc/apt/sources.list.d/ubuntu.sources
            else 
                sed -i -e 's@//ports.ubuntu.com/\? @//ports.ubuntu.com/ubuntu-ports @g' -e 's@//ports.ubuntu.com@//mirrors.ustc.edu.cn@g' /etc/apt/sources.list
            fi
        else
            URL="${PROTOCOL}://mirrors.ustc.edu.cn/repogen/conf/${ID}-${PROTOCOL}-${IP_VERSION/*v/}-${VERSION_CODENAME}"
            CONFIG_FILE="/etc/apt/sources.list"
            download_source_list      
        fi
        ;;
    arch)
        URL="${PROTOCOL}://mirrors.ustc.edu.cn/repogen/conf/archlinux-${PROTOCOL}-${IP_VERSION/*v/}"
        CONFIG_FILE="/etc/pacman.d/mirrorlist"
        download_source_list
        ;;
esac



if [ "$OS_TYPE" == "ubuntu" ] || [ "$OS_TYPE" == "debian" ]; then
    apt-get update
elif [ "$OS_TYPE" == "arch" ]; then
    pacman -Sy
fi
judge "更新软件包列表"
