#!/usr/bin/env bash


package_url=https://gitee.com/spark-store-project/spark-store/releases/download/4.5.2/spark-store_4.5.2-2_amd64.deb
dependencies=${download_url}/app/all.zip


OS="$(uname)"
case $OS in
    "Linux")
        # Detect Linux Distro
        if [ -f /etc/os-release ]; then
            source /etc/os-release
            DISTRO=$ID
            VERSION=$VERSION_ID
        else
            echo "Your Linux distribution is not supported."
            exit
        fi
        ;;
esac

install_spark(){
    wget --no-check-certificate ${package_url} -O /tmp/${package_url##*/}
    case $DISTRO in
    "ubuntu")
        case $VERSION in
        "24.04"|"22.04")
            apt install -y /tmp/${package_url##*/}
            echo "星火应用商店安装完成"
            ;;
        "20.04")
            wget --no-check-certificate ${dependencies} -O /tmp/all.zip
            apt install -y unzip
            unzip /tmp/all.zip -d /tmp/all
            apt install -y /tmp/all/all/*.deb
            apt install -y "/tmp/${dependencies}"
            echo "星火应用商店安装完成"
            ;;
        *)
            echo "${Red}不支持当前系统版本的安装，请检查系统版本是否为 Ubuntu 20.04、22.04 或 24.04。${Font}"
            ;;
        esac
        ;;
    esac
    # systemctl start todeskd.service
    rm -fr /tmp/${package_url##*/}
}

# 检查安装星火应用商店
check_spark(){
    PACKAGE_NAME="spark-store"
    if ! command -v $PACKAGE_NAME &> /dev/null; then
        install_spark
    else
        echo "$PACKAGE_NAME 已安装."
    fi
}



# 检查是否安装并运行了GNOME桌面环境
gnome_check=$(ps -ef | grep gnome-session | grep -v grep)
if [ -n "$gnome_check" ]; then
    check_spark
    echo -e "${Green}星火应用商店安装完成，5秒后返回...${Font}"
    sleep 5
    source <(curl -s ${download_url}/os/all/tools.sh)
    # 这里可以添加你想要在有GNOME桌面环境时执行的具体操作

else
    echo -e "${Red}当前没有GNOME桌面环境，无法安装 星火应用商店 。${Font}"
fi
