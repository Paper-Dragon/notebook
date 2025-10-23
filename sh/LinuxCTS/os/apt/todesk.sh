#!/usr/bin/env bash

Version=v4.7.2.0
package="todesk-${Version}-amd64.deb" 

OS="$(uname)"
case $OS in
    "Linux")
        # Detect Linux Distro
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            DISTRO=$ID
            VERSION=$VERSION_ID
        else
            echo "Your Linux distribution is not supported."
            exit
        fi
        ;;
esac

install_todesk(){
    wget --no-check-certificate https://dl.todesk.com/linux/${package} -O /tmp/${package}
    apt install /tmp/${package}
    case $DISTRO in
    "ubuntu")
        case $VERSION in
        "24.04"|"22.04")
            sed -i 's/#WaylandEnable=false/WaylandEnable=false/' /etc/gdm3/custom.conf
            read -p "当前系统 安装完 todesk 需要重启？ (yes/no): " answer
            if [[ "$answer" =~ ^[Yy][Ee][Ss]$ ]]; then
                echo -e "\033[5;33m 当前系统 安装完 todesk 需要重启\033[0m"
                echo -e "\033[5;33m 5秒之后系统将会, 重启..... \033[0m"
                sleep 5
                reboot
            elif [[ "$answer" =~ ^[Nn][Oo]$ ]]; then
                echo "取消系统重启"
            else
                echo "无效的输入，取消系统重启"
            fi
            ;;
        esac
        ;;
    esac
    systemctl start todeskd.service
    rm -fr /tmp/${package}
}


# 检查安装todesk
check_todesk(){
    PACKAGE_NAME="todesk"
    if ! command -v $PACKAGE_NAME &> /dev/null; then
        install_todesk
    else
    echo "$PACKAGE_NAME 已安装."
    fi
}

# 检查是否安装并运行了GNOME桌面环境
gnome_check=$(ps -ef | grep gnome-session | grep -v grep)
if [ -n "$gnome_check" ]; then
    check_todesk
    echo -e "${Green}todesk 安装完成，5秒后返回...${Font}"
    sleep 5
    source <(curl -s ${download_url}/os/all/tools.sh)
    # 这里可以添加你想要在有GNOME桌面环境时执行的具体操作
else
    echo -e "${Red}当前没有GNOME桌面环境，无法安装Todesk。${Font}"
fi
