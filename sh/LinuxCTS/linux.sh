#!/usr/bin/env bash

echo "正在检测机器所在国家和地区...请稍后...." 
sleep 1
# url=https://ifconfig.icu
# country=$(curl -s ${url}/country)
# if [[ $country == *"China"* ]]; then
#     download_url=https://gitee.com/muaimingjun/LinuxCTS/raw/main
# else
#     download_url=https://raw.githubusercontent.com/hyh1750522171/LinuxCTS/main
# fi
download_url=https://gitee.com/muaimingjun/LinuxCTS/raw/main
# 引用全局初始化脚本
source <(curl -s ${download_url}/os/all/init.sh)


# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RedBG}Error: $1 没装 ${Font}"
    fi
}

#脚本菜单
start_linux(){
    clear
    echo -e "${GreenBG}您计算机所在的国家地区:${Font} ${Green} ${ipdz} ${Font}"
    headers
    # echo -en "=  ${Green}11${Font}  " && gpt_style_output 'VPS信息和性能测试 VPS information test'
    table_linux="=  ${Green}11${Font}  Linux信息和性能测试 VPS information test
=  ${Green}12${Font}  Bench系统性能测试  Bench performance test  
=  ${Green}13${Font}  Linux常用工具安装  Linux utility function  
=  ${Green}14${Font}  Linux路由追踪检测  Linux traceroute test  
=  ${Green}15${Font}  Ubuntu 新安装系统初始化配置  Initial configuration of a newly Ubuntu system  
=
=  ${Green}21${Font}  Linux修改交换内存  Modify swap memory  
=  ${Green}22${Font}  Linux修改服务器DNS  Modify server DNS  
=  ${Green}23${Font}  流媒体区域限制测试  Streaming media testing  
=  ${Green}24${Font}  Linux系统bbr-tcp加速  System bbr-tcp speed up  
=  ${Green}25${Font}  Linux网络重装dd系统  Network reloading system  
=
=  ${Green}99${Font}  退出当前脚本  Exit the current script  
====================================================="
    echo -e "$table_linux"
    echo -e -n "${Green}请输入对应功能的${Font}  ${Red}数字：${Font}"
    
    read num
    case $num in
    11)
        source <(curl -s ${download_url}/tools/xncs.sh)
        ;;
    12)
        source <(curl -s ${download_url}/tools/bench.sh)
        ;;
    13)
        source <(curl -s ${download_url}/os/all/tools.sh)
        ;;
    14)
        source <(curl -s ${download_url}/tools/lyzz.sh)
        ;;
    15)
        source <(curl -s ${download_url}/os/apt/init.sh)
        ;;
    21)
        source <(curl -s ${download_url}/tools/swap.sh)
        ;;
    22)
        source <(curl -s ${download_url}/tools/dns.sh)
        ;;
    23)
        source <(curl -s ${download_url}/tools/check.sh)
        ;;
    24)
        source <(curl -s ${download_url}/tools/tcp.sh)
        ;;
    25)
        source <(curl -s https://www.cxthhhhh.com/CXT-Library/Network-Reinstall-System-Modify/Network-Reinstall-System-Modify.sh )
        ;;
    99)
        echo -e "\n${GreenBG}感谢使用！欢迎下次使用！${Font}\n" && exit
        ;;
    *)
        clear
        echo -e "${Error}:请输入正确数字 [0-99],${Font} 5秒后刷新"
        countdown_sleep 5
        start_linux
        ;;
    esac
}

check_root
echo "正在检测机器所在国家和地区...请稍后...." 
check_command curl
check_command wget
echo
start_linux
