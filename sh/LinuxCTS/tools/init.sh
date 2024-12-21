#!/usr/bin/env bash

# 全局变量
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
Red_font_prefix="\033[31m"
Font_color_suffix="\033[0m"
Error="${Red_font_prefix}[错误]${Font_color_suffix}"

#核心文件
get_opsy(){
    [ -f /etc/redhat-release ] && awk '{print ($1,$3~/^[0-9]/?$3:$4)}' /etc/redhat-release && return
    [ -f /etc/os-release ] && awk -F'[= "]' '/PRETTY_NAME/{print $3,$4,$5}' /etc/os-release && return
    [ -f /etc/lsb-release ] && awk -F'[="]+' '/DESCRIPTION/{print $2}' /etc/lsb-release && return
}
#变量引用
opsy=$( get_opsy )
cores=$( awk -F: '/model name/ {core++} END {print core}' /proc/cpuinfo )
tram=$( free -m | awk '/Mem/ {print $2}' )
uram=$( free -m | awk '/Mem/ {print $3}' )
ipaddr=$(curl -s myip.ipip.net | awk -F ' ' '{print $2}' | awk -F '：' '{print $2}')
ipdz=$(curl -s myip.ipip.net | awk -F '：' '{print $3}')

#检查账号
check_root(){
	if [[ $EUID != 0 ]];then
		echo -e "${RedBG}当前不是ROOT账号，建议更换ROOT账号使用。${Font}"
		echo -e "${Yellow}不要是用 sudo 执行脚本，直接使用 ROOT 账号执行。${Font} "
		countdown_sleep 5
        exit
	fi
}

#安装依赖
sys_install(){
    if ! type wget >/dev/null 2>&1; then
        echo -e "${RedBG}wget 未安装，准备安装！${Font}"
	    apt-get install wget -y || yum install wget -y
        judge "wget 安装"
    fi
}

# 定义函数，使用tput命令实现更美观的倒计时
function countdown_sleep() {
    local countdown_time="$1"  # 接收倒计时总时长作为参数

    for ((i = countdown_time; i >= 1; i--)); do
        echo -ne "\r 倒计时还剩: ${Yellow} $i ${Font} 秒 "
        sleep 1
    done
    clear
}

# 检查是否安装成功
judge() {
  if [[ $? -eq 0 ]]; then
    echo -e "${OK} ${GreenBG} $1 完成 ${Font}"
    sleep 1
  else
    echo -e "${Error} ${RedBG} $1 失败 ${Font}"
    exit
  fi
}

# 定义函数，使其可以接受参数
function gpt_style_output() {
    local text="$1"
    for ((i = 0; i < ${#text}; i++)); do
        echo -n "${text:$i:1}"
        sleep 0.05
    done
    echo ""
}

# 检查安装Docker
install_docker(){
    PACKAGE_NAME="docker"
    if ! command -v $PACKAGE_NAME &> /dev/null; then
        source <(curl -s ${download_url}/tools/get-docker.sh)
    else
        echo "$PACKAGE_NAME 已安装."
    fi
}
