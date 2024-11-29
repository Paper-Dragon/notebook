#!/usr/bin/env bash

Green="\033[32m"
Red="\033[31m"
YellowBG="\033[43;37m"
Yellow="\033[33m"
blue="\033[44;37m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"

# 检查安装Docker
install_docker(){
  PACKAGE_NAME="docker"
  if ! command -v $PACKAGE_NAME &> /dev/null; then
    source <(curl -s ${download_url}/tools/get-docker.sh)
  else
    echo "$PACKAGE_NAME 已安装."
  fi
}

clear
#===============================#
#       linux系统实用功能       #
#===============================#
echo -e "${blue}=====================================================${Font}"
echo -e "${blue}=             LinuxCTS - 综合Linux脚本              =${Font}"
echo -e "${blue}=                                                   =${Font}"
echo -e "${blue}=                当前版本 V2.6                      =${Font}"
echo -e "${blue}=            更新时间 2024年11月29日                =${Font}"
echo -e "${blue}=                                                   =${Font}"
echo -e "${blue}=====================================================${Font}"
echo -e "—————————————————————————— 安装软件源 ——————————————————————————"
echo -e "${Green}1.${Font} centos添加epel软件源"
echo -e "${Green}2.${Font} ubuntu添加epel软件源"
echo -e "${Green}3.${Font} debian添加epel软件源"
echo -e "—————————————————————————— 系统升级 ——————————————————————————"
echo -e "${Green}4.${Font} centos升级软件和系统"
echo -e "${Green}5.${Font} ubuntu升级软件和系统"
echo -e "${Green}6.${Font} debian升级软件和系统"
echo -e "—————————————————————————— 安装1panel ——————————————————————————"
echo -e "${Green}7.${Font} centos安装1panel"
echo -e "${Green}8.${Font} ubuntu安装1panel"
echo -e "${Green}9.${Font} debian安装1panel"
echo -e "—————————————————————————— 系统功能 ——————————————————————————"
echo -e "${Green}10.${Font} 修改root密码"
echo -e "${Green}11.${Font} 修改时间为中国"
echo -e "${Green}12.${Font} 重启当前系统"
echo -e "${Green}13.${Font} 关闭当前系统"
echo -e "—————————————————————————— 安装软件包 ——————————————————————————"
echo -e "${Green}14${Font}  Frps服务端-管理脚本               ${Green}15${Font}  Todesk 安装 (debian/ubuntu)"
echo -e "${Green}16${Font}  Frps客户端-管理脚本               ${Green}17${Font}  "
echo -e "${Green}18${Font}  Nezha哪吒监控-云探针              ${Green}19${Font}  "
echo -e "${Green}20${Font}  ServerStatus-云探针               ${Green}21${Font}  "
echo -e "${Green}22${Font}  iptables-端口转发                 ${Green}23${Font}  "
echo -e "${Green}24${Font}  Docker 安装                       ${Green}25${Font}  "
echo -e "${Green}26${Font}  Nvidia显卡驱动安装                ${Green}27${Font}  "
echo -e "${Green}28${Font}  Nvidia-Docker安装                 ${Green}29${Font}  "
echo -e "${Green}30${Font}  Miniconda安装                     ${Green}31${Font}  "
echo -e "—————————————————————————— 附加脚本 ——————————————————————————"
echo -e "${Green}99.${Font} 返回综合脚本"
echo -e "${Green}0.${Font} 退出当前脚本\n"

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
    source <(curl -s ${download_url}/tools/frps.sh)
    ;;
15)
    source <(curl -s ${download_url}/tools/todesk.sh)
    ;;
16)
    source <(curl -s ${download_url}/tools/frpc.sh)
    ;;
18)
    source <(curl -s ${download_url}/tools/nezha.sh)
    ;;
20)
    source <(curl -s ${download_url}/tools/status.sh)
    ;;
22)
    source <(curl -s ${download_url}/tools/dkzf.sh)
    ;;
24)
    install_docker
    ;;
26)
    source <(curl -s ${download_url}/tools/nvidia-driver.sh)
    ;;
28)
    source <(curl -s ${download_url}/tools/nvidia-docker.sh)
    ;;
30)
    echo -e "${Yellow} 安装miniconda,首先需要您退出到普通用户使用下面连接一键安装....  ${Font}"
    echo -e "miniconda安装脚本:  ${Green} source <(curl -s ${download_url}/tools/nvidia-docker.sh) ${Font}"
    ;;
99)
    # wget -N https://gitee.com/muaimingjun/LinuxCTS/raw/main/linux.sh && chmod +x linux.sh && bash linux.sh
    source <(curl -s https://gitee.com/muaimingjun/LinuxCTS/raw/main/linux.sh)
    ;;
0)
    exit
    ;;
*)
    echo -e "${RedBG}请输入正确的数字${Font}"
    ;;
esac
