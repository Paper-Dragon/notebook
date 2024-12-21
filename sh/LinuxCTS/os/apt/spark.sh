#!/usr/bin/env bash

Green="\033[32m"
Red="\033[31m"
YellowBG="\033[43;37m"
Yellow="\033[33m"
blue="\033[44;37m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"
shanshuo1="\033[5m"
shanshuo2="\033[0m"

Version=4.3.3.1
package="spark-store_${Version}-fix3_amd64.deb" 
package_url=https://gitee.com/spark-store-project/spark-store/releases/download/4.3.3.1-fix2
yilai_url=https://gitee.com/muaimingjun/LinuxCTS/releases/download/v1.0.1/all.zip


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


# 检查安装todesk
install_spark(){
    PACKAGE_NAME="spark-store"
    if ! command -v $PACKAGE_NAME &> /dev/null; then
        wget --no-check-certificate ${package_url}/${package} -O /tmp/${package}
        
        case $DISTRO in
        "ubuntu")
            case $VERSION in
            "24.04"|"22.04")
                apt install -y /tmp/${package}
                echo "星火应用商店安装完成"
                ;;
            "20.04")
                wget --no-check-certificate ${yilai_url} -O /tmp/all.zip
                apt install -y unzip
                unzip /tmp/all.zip -d /tmp/all
                apt install -y /tmp/all/*.deb
                apt install -y /tmp/${package}
                echo "星火应用商店安装完成"
                ;;
            *)
                echo "${Red}不支持当前系统版本的安装，请检查系统版本是否为 Ubuntu 20.04、22.04 或 24.04。${Font}"
                ;;
            esac
            ;;
        esac
        # systemctl start todeskd.service
        rm -fr /tmp/${package}
    else
    echo "$PACKAGE_NAME 已安装."
    fi
}



# 检查是否安装并运行了GNOME桌面环境
gnome_check=$(ps -ef | grep gnome-session | grep -v grep)
if [ -n "$gnome_check" ]; then
    install_spark
    # 这里可以添加你想要在有GNOME桌面环境时执行的具体操作
    exit
else
    echo "当前没有GNOME桌面环境，无法安装 星火应用商店 。"
fi


