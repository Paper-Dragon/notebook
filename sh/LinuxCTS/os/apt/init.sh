#!/usr/bin/env bash

app_path=/tmp/app
mkdir -p $app_path  
# Detect OS
OS="$(uname)"
case $OS in
    "Linux")
        # Detect Linux Distro
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            DISTRO=$ID
            VERSION=$VERSION_ID
            UBUNTU_CODENAME=$UBUNTU_CODENAME
        else
            echo "不支持这个 Linux 发行版"
            exit
        fi
        ;;
esac
# 更换系统源
case $DISTRO in
    "ubuntu")
        echo -e "${Green}您的系统是  Ubuntu $VERSION, 系统代号是 $UBUNTU_CODENAME, 正在换源...${Font}"
        if [[ "$VERSION" == "24.04" ]]; then
            sudo mv /etc/apt/sources.list.d/ubuntu.sources /etc/apt/sources.list.d/ubuntu.sources.bak
            udo wget -O /etc/apt/sources.list.d/ubuntu.sources  https://mirrors.ustc.edu.cn/repogen/conf/ubuntu-https-4-$UBUNTU_CODENAME
        else
            sudo mv /etc/apt/sources.list /etc/apt/sources.list.bak
            sudo wget -O /etc/apt/sources.list  https://mirrors.ustc.edu.cn/repogen/conf/ubuntu-https-4-$UBUNTU_CODENAME
            
        fi
        sudo apt update && sudo apt upgrade -y
        echo -e "${Green}系统源已更换为中科大源${Font}"
        echo -e "${Green}正在安装基础软件${Font}"
        sudo apt install curl git git-lfs build-essential ssh ntpdate -y
    ;;
esac

read -p "是否需要安装星火应用商店？<桌面版强烈推荐 >= 20.04 >(y/n): " install_star
if [[ "$install_star" == "y" ]]; then
    source <(curl -s ${download_url}/os/apt/spark.sh)
fi 


read -p "您是否需要安装Todesk远程控制？推荐安装一个，这样出错方便远程介入。(y/n): " install_todesk
if [[ "$install_todesk" == "y" ]]; then
    source <(curl -s ${download_url}/os/apt/todesk.sh)
fi

read -p "是否需要安装向日葵远程控制？此项与todesk二选一(y/n): " install_sun
if [[ "$install_sun" == "y" ]]; then
    wget -O $app_path/SunloginClien.deb https://dw.oray.com/sunlogin/linux/SunloginClient_15.2.0.63064_amd64.deb
    sudo apt install -y $app_path/SunloginClien.deb
fi

# read -p "是否需要安装搜狗输入法？(y/n): " sougou
# if [[ "$sougou" == "y" ]]; then
#     echo "正在下载安装搜狗输入法"
#     wget -O $app_path/sogou.deb https://minetest.top/upload/sogoupinyin_4.2.1.145_amd64.deb
#     sudo apt install fcitx libqt5qml5 libqt5quick5 libqt5quickwidgets5 qml-module-qtquick2 libgsettings-qt1 gnome-tweaks chrome-gnome-shell variety -y
#     sudo apt purge ibus* -y && sudo apt autoremove -y
#     sudo dpkg -i $app_path/sogou.deb
#     sudo apt install -f
#     rm $app_path/sogou.deb
# fi

read -p "是否需要安装微信？(y/n): " install_wechat
if [[ "$install_wechat" == "y" ]]; then
    wget -O $app_path/wechat.deb https://dldir1v6.qq.com/weixin/Universal/Linux/WeChatLinux_x86_64.deb
    sudo apt install -y $app_path/wechat.deb
fi 

read -p "您是否需要安装QQ？(y/n): " install_qq
if [[ "$install_qq" == "y" ]]; then
    wget -O $app_path/qq.deb https://dldir1.qq.com/qqfile/qq/QQNT/Linux/QQ_3.2.13_241023_amd64_01.deb
    sudo apt install -y $app_path/qq.deb
fi

read -p "您是否需要解决双系统时间问题? <双系统推荐 y> (y/n): " time_problem
if [[ "$time_problem" == "y" ]]; then
    echo "双系统会有时间不一致的问题，此项可以通过ntpdate和hwclock解决"
    sudo apt install ntpdate -y
    sudo ntpdate time.windows.com
    sudo hwclock --localtime --systohc
fi


read -p "您是否需要安装 grub 开机界面, 原神主题 <双系统推荐 y> (y/n): " yuanshen
if [[ "$yuanshen" == "y" ]]; then
    echo "双系统会有时间不一致的问题，此项可以通过ntpdate和hwclock解决"
    sudo apt install ntpdate -y
    sudo ntpdate time.windows.com
    sudo hwclock --localtime --systohc
fi


echo "基础配置已完成，系统将在5秒后重启，重启后驱动即可生效"
sleep 5
sudo reboot