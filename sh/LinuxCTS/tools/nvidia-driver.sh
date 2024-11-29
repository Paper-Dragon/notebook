#!/bin/bash

# set -euxo pipefail

# export DEBIAN_FRONTEND=noninteractive
# sudo dpkg --set-selections <<< "cloud-init install" || true
Green="\033[32m"
Red="\033[31m"
Yellow="\033[43;37m"
blue="\033[44;37m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"

# Set Gloabal Variables
    # Detect OS
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
                    exit 1
                fi
                ;;
        esac

# Detect if an Nvidia GPU is present
NVIDIA_PRESENT=$(lspci | grep -i nvidia || true)

# Only proceed with Nvidia-specific steps if an Nvidia device is detected
if [[ -z "$NVIDIA_PRESENT" ]]; then
    
    echo -e "${RedBG} 未在设备上检测到 Nvidia 显卡设备 ${Font}"
    exit 1
    # source <(curl -s https://gitee.com/muaimingjun/LinuxCTS/raw/main/linux.sh)
else
# Check if nvidia-smi is available and working
    if command -v nvidia-smi &>/dev/null; then
        echo "CUDA drivers already installed as nvidia-smi works."
    else

                # Depending on Distro
                case $DISTRO in
                    "ubuntu")
                        # 定义NVIDIA驱动版本列表
                        nvidia_versions=(
                            "nvidia-driver-550"
                            "nvidia-driver-545"
                            "nvidia-driver-535"
                            "nvidia-driver-530"
                            "nvidia-driver-525"
                            "nvidia-driver-520"
                            "nvidia-driver-515"
                            "nvidia-driver-510"
                            "nvidia-driver-495"
                            "nvidia-driver-470"
                            "nvidia-driver-465"
                            "nvidia-driver-460"
                            "nvidia-driver-455"
                            "nvidia-driver-450"
                            "nvidia-driver-440"
                            "nvidia-driver-435"
                            "nvidia-driver-430"
                            "nvidia-driver-418"
                            "nvidia-driver-390"
                        )

                        # 显示可供选择的版本列表及序号
                        echo "请从以下NVIDIA驱动版本中选择一个："
                        for ((i = 0; i < ${#nvidia_versions[@]}; i++)); do
                            echo "$((i + 1)). ${nvidia_versions[i]}"
                        done

                        # 获取用户输入的序号
                        read -p "请输入你选择的版本对应的序号：" user_choice

                        # 判断用户输入是否有效并输出选择的版本
                        if [[ $user_choice =~ ^[0-9]+$ ]] && [ $user_choice -gt 0 ] && [ $user_choice -le ${#nvidia_versions[@]} ]; then
                            selected_version=${nvidia_versions[$((user_choice - 1))]}
                            # echo "你选择的版本是：$selected_version"
                        else
                            echo "输入的序号无效，请重新输入。"
                        fi
                        case $VERSION in
                            "18.04")
                                # Commands specific to Ubuntu 20.04
                                sudo apt-get update -y
                                sudo apt install $selected_version -y
                                ;;

                            "20.04")
                                # Commands specific to Ubuntu 20.04
                                sudo apt-get update -y
                                sudo apt install $selected_version -y
                                ;;

                            "22.04")
                                # Commands specific to Ubuntu 22.04
                                # 390/418/430/435/440/450/455/460/465/470/495/510/515/520/525/530/535/545/550
                                sudo apt-get update -y
                                sudo apt install $selected_version -y
                                ;;

                            "24.04")
                                # Commands specific to Ubuntu 18.04
                                sudo apt-get update -y
                                sudo apt install $selected_version -y
                                ;;

                            *)
                                echo "This version of Ubuntu is not supported in this script."
                                exit 1
                                ;;
                        esac
                        ;;

                    "debian")
                        case $VERSION in
                            "10"|"11")
                                # Commands specific to Debian 10 & 11
                                sudo -- sh -c 'apt update; apt upgrade -y; apt autoremove -y; apt autoclean -y'
                                sudo apt install linux-headers-$(uname -r) -y
                                sudo apt update -y
                                sudo apt install nvidia-driver firmware-misc-nonfree
                                wget https://nvidia-developer.geekery.cn/compute/cuda/repos/debian${VERSION}/x86_64/cuda-keyring_1.1-1_all.deb
                                sudo sed -i 's@//developer.download.nvidia.com@//nvidia-developer.geekery.cn@g' /etc/apt/sources.list.d/cuda-wsl-ubuntu-x86_64.list
                                sudo apt install nvidia-cuda-dev nvidia-cuda-toolkit
                                sudo apt update -y
                                ;;

                            *)
                                echo "This version of Debian is not supported in this script."
                                exit 1
                                ;;
                        esac
                        ;;

                    *)
                        echo "Your Linux distribution is not supported."
                        exit 1
                        ;;

            "Windows_NT")
                # For Windows Subsystem for Linux (WSL) with Ubuntu
                if grep -q Microsoft /proc/version; then
                    wget https://nvidia-developer.geekery.cn/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-keyring_1.1-1_all.deb
                    sudo dpkg -i cuda-keyring_1.1-1_all.deb
                    sudo sed -i 's@//developer.download.nvidia.com@//nvidia-developer.geekery.cn@g' /etc/apt/sources.list.d/cuda-wsl-ubuntu-x86_64.list
                    sudo apt-get update
                    sudo apt-get -y install cuda
                else
                    echo "This bash script can't be executed on Windows directly unless using WSL with Ubuntu. For other scenarios, consider using a PowerShell script or manual installation."
                    exit 1
                fi
                ;;

            *)
                echo "Your OS is not supported."
                exit 1
                ;;
        esac
	echo "System will now reboot !!! Please re-run this script after restart to complete installation !"
 	sleep 5s
        sudo reboot
    fi
fi