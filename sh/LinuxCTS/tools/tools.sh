#!/usr/bin/env bash

Green="\033[32m"
Red="\033[31m"
Yellow="\033[33m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"

#===============================#
#       linux系统实用功能       #
#===============================#

echo -e "————————————— 安装软件源 —————————————"
echo -e "${Green}1.${Font} centos添加epel软件源"
echo -e "${Green}2.${Font} ubuntu添加epel软件源"
echo -e "${Green}3.${Font} debian添加epel软件源"
echo -e "—————————————— 系统升级 ——————————————"
echo -e "${Green}4.${Font} centos升级软件和系统"
echo -e "${Green}5.${Font} ubuntu升级软件和系统"
echo -e "${Green}6.${Font} debian升级软件和系统"
echo -e "—————————————— 安装宝塔 ——————————————"
echo -e "${Green}7.${Font} centos安装1panel"
echo -e "${Green}8.${Font} ubuntu安装1panel"
echo -e "${Green}9.${Font} debian安装1panel"
echo -e "—————————————— 系统功能 ——————————————"
echo -e "${Green}10.${Font} 修改root密码"
echo -e "${Green}11.${Font} 修改时间为中国"
echo -e "${Green}12.${Font} 重启当前系统"
echo -e "${Green}13.${Font} 关闭当前系统"
echo -e "—————————————— 附加脚本 ——————————————"
echo -e "${Green}14.${Font} 返回综合脚本"
echo -e "${Green}15.${Font} 退出当前脚本\n"

read -rp "请输入对应的数字：" num
case $num in
1)
    yum install epel-release -y
    ;;
2)
    apt install epel-release -y
    ;;
3)
    apt install epel-release -y
    ;;
4)
    yum update
    ;;
5)
    apt update && apt upgrade
    ;;
6)
    apt update && apt upgrade
    ;;
7)
    source <(curl -s https://resource.fit2cloud.com/1panel/package/quick_start.sh)
    ;;
8)
    source <(curl -s https://resource.fit2cloud.com/1panel/package/quick_start.sh)
    ;;
9)
    source <(curl -s https://resource.fit2cloud.com/1panel/package/quick_start.sh)
    ;;
10)
    sudo passwd root
    ;;
11)
    rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
    ;;
12)
    reboot
    ;;
13)
    poweroff
    ;;
14)
    # wget -N https://gitee.com/muaimingjun/LinuxCTS/raw/main/linux.sh && chmod +x linux.sh && bash linux.sh
    source <(curl -s https://gitee.com/muaimingjun/LinuxCTS/raw/main/linux.sh)
    ;;
15)
    exit
    ;;
*)
    echo -e "${RedBG}请输入正确的数字${Font}"
    ;;
esac
