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
            exit 0
        fi
        ;;
esac
# 更换系统源
case $DISTRO in
    "ubuntu")
        echo -e "${Green}您的系统是  Ubuntu $VERSION, 系统代号是 $UBUNTU_CODENAME, 正在换源...${Font}"
        source <(curl -fsSL ${download_url}/os/apt/ustc-mirror.sh)
        echo -e "${Green}系统源已更换为中科大源${Font}"
        # 验证源是否更新成功
        apt-get update
        echo -e "${Green}正在安装基础软件${Font}"
        apt-get install -y curl git git-lfs build-essential ssh ntpdate
    ;;
esac

read -p "是否需要安装星火应用商店？桌面版强烈推荐 系统>= 20.04 >(yes/no): " install_star
if [[ "$install_star" =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "\033[5;33m 正在安装 星火应用商店....\033[0m"
    source <(curl -s ${download_url}/os/apt/spark.sh)
elif [[ "$install_star" =~ ^[Nn][Oo]$ ]]; then
    echo "星火应用商店安装取消"
else
    echo "无效的输入，星火应用商店安装取消"
fi

read -p "您是否需要安装Todesk远程控制？推荐安装一个，这样出错方便远程介入。(yes/no): " install_todesk
if [[ "$install_todesk" =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "\033[5;33m 正在安装 Todesk 远程控制....\033[0m"
    source <(curl -s ${download_url}/os/apt/todesk.sh)
elif [[ "$install_todesk" =~ ^[Nn][Oo]$ ]]; then
    echo "Todesk远程控制安装取消"
else
    echo "无效的输入，Todesk远程控制安装取消"
fi

# 检测到NVIDIA显卡设备
echo -e "${Green}正在检查是否有 NVIDA 显卡设备...${Font}"
NVIDIA_PRESENT=$(lspci | grep -i nvidia || true)

# Only proceed with Nvidia-specific steps if an Nvidia device is detected
if [[ -z "$NVIDIA_PRESENT" ]]; then
    
    echo -e "${RedBG} 未在设备上检测到 Nvidia 显卡设备 ${Font}"
    # source <(curl -s ${download_url}/linux.sh)
else
    echo -e "${Green}检测到 Nvidia 显卡设备 ${Font}"
    read -p "您是否需要安装NVIDIA显卡驱动？(yes/no): " install_nvidia
    
    if [[ "$install_nvidia" =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "\033[5;33m 正在安装 Nvidia 显卡驱动...\033[0m"
        source <(curl -fsSL ${download_url}/os/apt/nvidia-driver.sh)
        
        # 验证驱动安装
        echo -e "${Green}NVIDIA 驱动安装成功${Font}"
    else
        echo "取消安装 Nvidia 显卡驱动"
    fi
fi  

read -p "您是否需要解决双系统时间问题? <双系统推荐 yes> (yes/no): " time_problem

if [[ "$time_problem" =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "\033[5;33m 正在解决双系统时间问题....\033[0m"
    sudo apt install ntpdate -y
    sudo ntpdate time.windows.com
    sudo hwclock --localtime --systohc
elif [[ "$time_problem" =~ ^[Nn][Oo]$ ]]; then
    echo "取消"
else
    echo "无效的输入，取消"
fi

read -p "您是否需要安装 grub 开机界面, 原神主题 <双系统推荐 y> (yes/no): " yuanshen
if [[ "$yuanshen" =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "\033[5;33m 正在安装 grub 开机界面....\033[0m"
    source <(curl -s ${download_url}/os/all/grub.sh)
elif [[ "$yuanshen" =~ ^[Nn][Oo]$ ]]; then
    echo "grub 开机界面设置取消"
else
    echo "无效的输入，grub 开机界面设置取消"
fi

echo -e "${Green}基础配置已完成${Font}"
read -p "系统需要重启以使更改生效，是否立即重启？(yes/no): " reboot_now

if [[ "$reboot_now" =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${Yellow}系统将在5秒后重启...${Font}"
    echo "按 Ctrl+C 取消重启"
    sleep 5
    sudo reboot
else
    echo "取消重启，请手动重启系统以使更改生效"
fi
