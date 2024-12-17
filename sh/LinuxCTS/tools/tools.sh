#!/usr/bin/env bash

clear
#===============================#
#       linux系统实用功能       #
#===============================#
headers
headers_tools="—————————————————————————— 安装软件源 ——————————————————————————
${Green}1.${Font} centos添加epel软件源
${Green}2.${Font} ubuntu添加epel软件源
${Green}3.${Font} debian添加epel软件源
—————————————————————————— 系统升级 ——————————————————————————
${Green}4.${Font} centos升级软件和系统
${Green}5.${Font} ubuntu升级软件和系统
${Green}6.${Font} debian升级软件和系统
—————————————————————————— 安装1panel ——————————————————————————
${Green}7.${Font} centos安装1panel
${Green}8.${Font} ubuntu安装1panel
${Green}9.${Font} debian安装1panel
—————————————————————————— 系统功能 ——————————————————————————
${Green}10.${Font} 修改root密码
${Green}11.${Font} 修改时间为中国
${Green}12.${Font} 重启当前系统
${Green}13.${Font} 关闭当前系统
—————————————————————————— 安装软件包 ——————————————————————————
${Green}14.${Font}  Frps服务端-管理脚本               ${Green}15.${Font}  Todesk 安装 (debian/ubuntu)
${Green}16.${Font}  Frps客户端-管理脚本               ${Green}17.${Font}  鱼香 ros 安装
${Green}18.${Font}  Nezha哪吒监控-云探针              ${Green}19.${Font}  星火应用商店 安装
${Green}20.${Font}  ServerStatus-云探针               ${Green}21.${Font}  
${Green}22.${Font}  iptables-端口转发                 ${Green}23.${Font}  
${Green}24.${Font}  Docker 安装                       ${Green}25.${Font}  
${Green}26.${Font}  Nvidia显卡驱动安装                ${Green}27.${Font}  
${Green}28.${Font}  Nvidia-Docker安装                 ${Green}29.${Font} 
${Green}30.${Font}  Miniconda安装                     ${Green}31.${Font}  
—————————————————————————— 附加脚本 ——————————————————————————
${Green}99.${Font} 返回综合脚本
${Green}0.${Font} 退出当前脚本
——————————————————————————————————————————————————————————————"

echo -e "$headers_tools"

echo -e -n "${Green}请输入对应功能的${Font}  ${Red}数字：${Font}"
read num
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
    passwd root
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
17)
    source <(curl -SLs http://fishros.com/install)
    ;;
18)
    source <(curl -s ${download_url}/tools/nezha.sh)
    ;;
19)
    source <(curl -s ${download_url}/tools/spark.sh)
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
    echo -e "miniconda安装脚本:  ${Green} source <(curl -s ${download_url}/tools/miniconda.sh) ${Font}"
    ;;
31)
    source <(curl -s ${download_url}/tools/clean_and_set_mirror_centos7.sh)
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
