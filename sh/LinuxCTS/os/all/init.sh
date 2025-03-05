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
# tram=$( free -m | awk '/Mem|内存/ {print $2}' )
# uram=$( free -m | awk '/Mem|内存/ {print $3}' )
tram=$( awk '/MemTotal/{total=$2;unit=$3;if(unit=="kB"){total/=1024;}else if(unit=="bytes"){total/=(1024*1024);}print int(total)}' /proc/meminfo )
uram=$( awk '/MemTotal/{total=$2;unit=$3;if(unit=="kB"){total/=1024;}else if(unit=="bytes"){total/=(1024*1024);}print int(total)}' /proc/meminfo )
ipaddr=$(curl -s myip.ipip.net | awk -F ' ' '{print $2}' | awk -F '：' '{print $2}')
ipdz=$(curl -s myip.ipip.net | awk -F '：' '{print $3}')
sysarch="$(uname -m)"


#检查账号
check_root(){
	if [[ $EUID != 0 ]];then
		echo -e "${RedBG}当前不是ROOT账号，建议更换ROOT账号使用。${Font}"
		echo -e "${Yellow}不要是用 sudo 执行脚本，直接使用 ROOT 账号执行。${Font} "
		countdown_sleep 5
        exit
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
        source <(curl -s ${download_url}/os/all/get-docker.sh)
    else
        echo "$PACKAGE_NAME 已安装."
    fi
}



# 安装软件包
install() {
	if [ $# -eq 0 ]; then
		echo "未提供软件包参数!"
		return
	fi

	for package in "$@"; do
		if ! command -v "$package" &>/dev/null; then
			echo -e "${gl_huang}正在安装 $package...${gl_bai}"
			if command -v dnf &>/dev/null; then
				dnf -y update
				dnf install -y epel-release
				dnf install -y "$package"
			elif command -v yum &>/dev/null; then
				yum -y update
				yum install -y epel-release
				yum -y install "$package"
			elif command -v apt &>/dev/null; then
				apt update -y
				apt install -y "$package"
			elif command -v apk &>/dev/null; then
				apk update
				apk add "$package"
			elif command -v pacman &>/dev/null; then
				pacman -Syu --noconfirm
				pacman -S --noconfirm "$package"
			elif command -v zypper &>/dev/null; then
				zypper refresh
				zypper install -y "$package"
			elif command -v opkg &>/dev/null; then
				opkg update
				opkg install "$package"
			else
				echo "未知的包管理器!"
				return
			fi
		else
			echo -e "${gl_lv}$package 已经安装${gl_bai}"
		fi
	done

	return
}

# 卸载软件包
remove() {
	if [ $# -eq 0 ]; then
		echo "未提供软件包参数!"
		return
	fi

	for package in "$@"; do
		echo -e "${gl_huang}正在卸载 $package...${gl_bai}"
		if command -v dnf &>/dev/null; then
			dnf remove -y "${package}"*
		elif command -v yum &>/dev/null; then
			yum remove -y "${package}"*
		elif command -v apt &>/dev/null; then
			apt purge -y "${package}"*
		elif command -v apk &>/dev/null; then
			apk del "${package}*"
		elif command -v pacman &>/dev/null; then
			pacman -Rns --noconfirm "${package}"
		elif command -v zypper &>/dev/null; then
			zypper remove -y "${package}"
		elif command -v opkg &>/dev/null; then
			opkg remove "${package}"
		else
			echo "未知的包管理器!"
			return
		fi
	done

	return
}

# 虚拟化判断
virt_check() {
    if [ -f "/usr/bin/systemd-detect-virt" ]; then
    Var_VirtType="$(/usr/bin/systemd-detect-virt)"
    # 虚拟机检测
    if [ "${Var_VirtType}" = "qemu" ]; then
        virtual="QEMU"
    elif [ "${Var_VirtType}" = "kvm" ]; then
        virtual="KVM"
    elif [ "${Var_VirtType}" = "zvm" ]; then
        virtual="S390 Z/VM"
    elif [ "${Var_VirtType}" = "vmware" ]; then
        virtual="VMware"
    elif [ "${Var_VirtType}" = "microsoft" ]; then
        virtual="Microsoft Hyper-V"
    elif [ "${Var_VirtType}" = "xen" ]; then
        virtual="Xen Hypervisor"
    elif [ "${Var_VirtType}" = "bochs" ]; then
        virtual="BOCHS"
    elif [ "${Var_VirtType}" = "uml" ]; then
        virtual="User-mode Linux"
    elif [ "${Var_VirtType}" = "parallels" ]; then
        virtual="Parallels"
    elif [ "${Var_VirtType}" = "bhyve" ]; then
        virtual="FreeBSD Hypervisor"
    # 容器虚拟化检测
    elif [ "${Var_VirtType}" = "openvz" ]; then
        virtual="OpenVZ"
    elif [ "${Var_VirtType}" = "lxc" ]; then
        virtual="LXC"
    elif [ "${Var_VirtType}" = "lxc-libvirt" ]; then
        virtual="LXC (libvirt)"
    elif [ "${Var_VirtType}" = "systemd-nspawn" ]; then
        virtual="Systemd nspawn"
    elif [ "${Var_VirtType}" = "docker" ]; then
        virtual="Docker"
    elif [ "${Var_VirtType}" = "rkt" ]; then
        virtual="RKT"
    # 特殊处理
    elif [ -c "/dev/lxss" ]; then # 处理WSL虚拟化
        Var_VirtType="wsl"
        virtual="Windows Subsystem for Linux (WSL)"
    # 未匹配到任何结果, 或者非虚拟机
    elif [ "${Var_VirtType}" = "none" ]; then
        Var_VirtType="dedicated"
        virtual="None"
        local Var_BIOSVendor
        Var_BIOSVendor="$(dmidecode -s bios-vendor)"
        if [ "${Var_BIOSVendor}" = "SeaBIOS" ]; then
        Var_VirtType="Unknown"
        virtual="Unknown with SeaBIOS BIOS"
        else
        Var_VirtType="dedicated"
        virtual="Dedicated with ${Var_BIOSVendor} BIOS"
        fi
    fi
    elif [ ! -f "/usr/sbin/virt-what" ]; then
    Var_VirtType="Unknown"
    virtual="[Error: virt-what not found !]"
    elif [ -f "/.dockerenv" ]; then # 处理Docker虚拟化
    Var_VirtType="docker"
    virtual="Docker"
    elif [ -c "/dev/lxss" ]; then # 处理WSL虚拟化
    Var_VirtType="wsl"
    virtual="Windows Subsystem for Linux (WSL)"
    else # 正常判断流程
    Var_VirtType="$(virt-what | xargs)"
    local Var_VirtTypeCount
    Var_VirtTypeCount="$(echo $Var_VirtTypeCount | wc -l)"
    if [ "${Var_VirtTypeCount}" -gt "1" ]; then # 处理嵌套虚拟化
        virtual="echo ${Var_VirtType}"
        Var_VirtType="$(echo ${Var_VirtType} | head -n1)"                          # 使用检测到的第一种虚拟化继续做判断
    elif [ "${Var_VirtTypeCount}" -eq "1" ] && [ "${Var_VirtType}" != "" ]; then # 只有一种虚拟化
        virtual="${Var_VirtType}"
    else
        local Var_BIOSVendor
        Var_BIOSVendor="$(dmidecode -s bios-vendor)"
        if [ "${Var_BIOSVendor}" = "SeaBIOS" ]; then
        Var_VirtType="Unknown"
        virtual="Unknown with SeaBIOS BIOS"
        else
        Var_VirtType="dedicated"
        virtual="Dedicated with ${Var_BIOSVendor} BIOS"
        fi
    fi
    fi
}
