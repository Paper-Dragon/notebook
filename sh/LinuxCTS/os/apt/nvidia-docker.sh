#!/bin/bash

# set -euxo pipefail
# export DEBIAN_FRONTEND=noninteractive
# sudo dpkg --set-selections <<< "cloud-init install" || true

# 检查是否安装成功

country=$(curl -s https://ifconfig.icu/country)
if [[ $country == *"China"* ]]; then
    docker_image=swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nvidia/cuda:12.4.1-base-ubuntu22.04
    judge "设置Docker镜点 "
else
    docker_image=nvidia/cuda:12.4.1-base-ubuntu22.04
fi

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
        exit
    fi
    ;;
esac

# Detect if an Nvidia GPU is present
NVIDIA_PRESENT=$(lspci | grep -i nvidia || true)

# Only proceed with Nvidia-specific steps if an Nvidia device is detected
if [[ -z "$NVIDIA_PRESENT" ]]; then
    echo "No NVIDIA device detected on this system."
else
# Check if nvidia-smi is available and working
    if command -v nvidia-smi &>/dev/null; then
        echo "CUDA drivers already installed as nvidia-smi works."
    else
        # Depending on Distro
        case $DISTRO in
            "ubuntu")
                case $VERSION in
                    "20.04")
                        # Commands specific to Ubuntu 20.04
                        sudo -- sh -c 'apt-get update; apt-get upgrade -y; apt-get autoremove -y; apt-get autoclean -y'
                        sudo -- sh -c 'apt-get update; apt-get upgrade -y; apt-get autoremove -y; apt-get autoclean -y'
                        # sudo apt install linux-headers-$(uname -r) -y
                        sudo apt del 7fa2af80 || true
                        sudo apt remove 7fa2af80 || true
                        sudo apt install build-essential cmake gpg unzip pkg-config software-properties-common ubuntu-drivers-common -y
                        sudo apt install libxmu-dev libxi-dev libglu1-mesa libglu1-mesa-dev -y || true
                        sudo apt install libjpeg-dev libpng-dev libtiff-dev -y || true
                        sudo apt install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev -y || true
                        sudo apt install libxvidcore-dev libx264-dev -y || true
                        sudo apt install libopenblas-dev libatlas-base-dev liblapack-dev gfortran -y || true
                        sudo apt install libhdf5-serial-dev -y || true
                        sudo apt install python3-dev python3-tk python-imaging-tk curl cuda-keyring gnupg-agent dirmngr alsa-utils -y || true
                        sudo apt install libgtk-3-dev -y || true
                        sudo apt update -y
                        sudo dirmngr </dev/null
                        if sudo apt-add-repository -y ppa:graphics-drivers/ppa && sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys FCAE110B1118213C; then
                            echo "Alternative method succeeded."
                        else
                            echo "Alternative method failed. Trying the original method..."
                            sudo dirmngr </dev/null
                            sudo apt-add-repository -y ppa:graphics-drivers/ppa
                            sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/graphics-drivers.gpg --keyserver keyserver.ubuntu.com --recv-keys FCAE110B1118213C
                            sudo chmod 644 /etc/apt/trusted.gpg.d/graphics-drivers.gpg
                        fi
                        sudo ubuntu-drivers autoinstall
                        sudo apt update -y
                        wget https://nvidia-developer.geekery.cn/compute/cuda/repos/ubuntu2004/x86_64/cuda-keyring_1.1-1_all.deb
                        sudo dpkg -i cuda-keyring_1.1-1_all.deb
                        sudo sed -i 's@//developer.download.nvidia.com@//nvidia-developer.geekery.cn@g' /etc/apt/sources.list.d/cuda-ubuntu2004-x86_64.list
                        sudo apt update -y
                        sudo apt -y install cuda-toolkit
                        export LD_LIBRARY_PATH=/usr/local/cuda-12.2/lib64:${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
                        sudo apt-get update
                        ;;

                    "22.04")
                        # Commands specific to Ubuntu 22.04
                        sudo -- sh -c 'apt-get update; apt-get upgrade -y; apt-get autoremove -y; apt-get autoclean -y'
                        sudo -- sh -c 'apt-get update; apt-get upgrade -y; apt-get autoremove -y; apt-get autoclean -y'
                        # sudo apt install linux-headers-$(uname -r) -y
                        sudo apt del 7fa2af80 || true
                        sudo apt remove 7fa2af80 || true
                        sudo apt install build-essential cmake gpg unzip pkg-config software-properties-common ubuntu-drivers-common -y
                        sudo apt install libxmu-dev libxi-dev libglu1-mesa libglu1-mesa-dev -y
                        sudo apt install libjpeg-dev libpng-dev libtiff-dev -y 
                        sudo apt install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev -y 
                        sudo apt install libxvidcore-dev libx264-dev -y
                        sudo apt install libopenblas-dev libatlas-base-dev liblapack-dev gfortran -y 
                        sudo apt install libhdf5-serial-dev -y 
                        sudo apt install python3-dev python3-tk curl gnupg-agent dirmngr alsa-utils -y
                        sudo apt install libgtk-3-dev -y 
                        sudo apt update -y
                        sudo dirmngr </dev/null
                        if sudo apt-add-repository -y ppa:graphics-drivers/ppa && sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys FCAE110B1118213C; then
                            echo "Alternative method succeeded."
                        else
                            echo "Alternative method failed. Trying the original method..."
                            sudo dirmngr </dev/null
                            sudo apt-add-repository -y ppa:graphics-drivers/ppa
                            sudo gpg --no-default-keyring --keyring gnupg-ring:/etc/apt/trusted.gpg.d/graphics-drivers.gpg --keyserver keyserver.ubuntu.com --recv-keys FCAE110B1118213C
                            sudo chmod 644 /etc/apt/trusted.gpg.d/graphics-drivers.gpg
                        fi
                        sudo ubuntu-drivers autoinstall
                        sudo apt update -y
                        wget https://nvidia-developer.geekery.cn/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
                        sudo dpkg -i cuda-keyring_1.1-1_all.deb
                        sudo sed -i 's@//developer.download.nvidia.com@//nvidia-developer.geekery.cn@g' /etc/apt/sources.list.d/cuda-ubuntu2204-x86_64.list
                        sudo apt update -y
                        sudo apt -y install cuda-toolkit
                        export LD_LIBRARY_PATH=/usr/local/cuda-12.2/lib64:${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
                        sudo apt update -y
                        ;;

                    "18.04")
                        # Commands specific to Ubuntu 18.04
                        sudo -- sh -c 'apt-get update; apt-get upgrade -y; apt-get autoremove -y; apt-get autoclean -y'
                        # sudo apt-get install linux-headers-$(uname -r) -y
                        sudo apt del 7fa2af80 || true
                        sudo apt remove 7fa2af80 || true
                        sudo apt install build-essential cmake gpg unzip pkg-config software-properties-common ubuntu-drivers-common alsa-utils -y
                        sudo apt install libxmu-dev libxi-dev libglu1-mesa libglu1-mesa-dev -y || true
                        sudo apt install libjpeg-dev libpng-dev libtiff-dev -y || true
                        sudo apt install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev -y || true
                        sudo apt install libxvidcore-dev libx264-dev -y || true
                        sudo apt install libopenblas-dev libatlas-base-dev liblapack-dev gfortran -y || true
                        sudo apt install libhdf5-serial-dev -y || true
                        sudo apt install python3-dev python3-tk python-imaging-tk curl cuda-keyring -y || true
                        sudo apt install libgtk-3-dev -y || true
                        sudo apt update -y
                        sudo ubuntu-drivers install
                        sudo apt update -y
                        wget https://nvidia-developer.geekery.cn/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
                        sudo dpkg -i cuda-keyring_1.1-1_all.deb
                        sudo sed -i 's@//developer.download.nvidia.com@//nvidia-developer.geekery.cn@g' /etc/apt/sources.list.d/cuda-ubuntu1804-x86_64.list
                        sudo apt update -y
                        sudo apt -y install cuda-toolkit
                        export LD_LIBRARY_PATH=/usr/local/cuda-12.2/lib64:${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
                        sudo apt update -y
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
                        # sudo apt install linux-headers-$(uname -r) -y
                        sudo apt update -y
                        sudo apt install nvidia-driver firmware-misc-nonfree
                        wget https://nvidia-developer.geekery.cn/compute/cuda/repos/debian${VERSION}/x86_64/cuda-keyring_1.1-1_all.deb
                        sudo sed -i 's@//developer.download.nvidia.com@//nvidia-developer.geekery.cn@g' /etc/apt/sources.list.d/cuda-*.list
                        sudo apt install nvidia-cuda-dev nvidia-cuda-toolkit
                        sudo apt update -y
                        ;;

                    *)
                        echo "This version of Debian is not supported in this script."
                        exit
                        ;;
                esac
                ;;

            *)
                        echo "Your Linux distribution is not supported."
                        exit 
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
                    exit 
                fi
                ;;

            *)
                echo "Your OS is not supported."
                exit
                ;;
        esac
	echo "System will now reboot !!! Please re-run this script after restart to complete installation !"
    sleep 5s
    sudo reboot
    fi
fi
# For testing purposes, this should output NVIDIA's driver version
if [[ ! -z "$NVIDIA_PRESENT" ]]; then
    nvidia-smi
fi

curl -SsL get-docker.geekery.cn | bash

# Test / Install nvidia-docker
if [[ ! -z "$NVIDIA_PRESENT" ]]; then
    if sudo docker run --rm --gpus all $docker_image nvidia-smi &>/dev/null; then
        echo "nvidia-docker is enabled and working. Exiting script."
    else
        echo "nvidia-docker does not seem to be enabled. Proceeding with installations..."
        distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
        # nvidia.github.io <- nvidia-docker.geekery.cn
        curl -s -L https://nvidia-docker.geekery.cn/nvidia-docker/gpgkey | sudo apt-key add
        curl -s -L https://nvidia-docker.geekery.cn/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
        sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
        judge "nvidia-container-toolkit 安装 "
        sudo systemctl restart docker 
        sudo docker run --rm --gpus all $docker_image nvidia-smi
    fi
fi
sudo apt-mark hold "nvidia*" "libnvidia*"
# # Add docker group and user to group docker
# sudo groupadd docker || true
# sudo usermod -aG docker $USER || true
# newgrp docker || true
# Workaround for NVIDIA Docker Issue
echo "Applying workaround for NVIDIA Docker issue as per https://github.com/NVIDIA/nvidia-docker/issues/1730"
# Summary of issue and workaround:

sudo mkdir -pv /etc/docker/ || true

echo "你所在的国家是:${country}"
if [[ $country == *"China"* ]]; then
    sudo bash -c 'cat <<EOF > /etc/docker/daemon.json
    {
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    },
    "exec-opts": ["native.cgroupdriver=cgroupfs"],
    "registry-mirrors": ["https://docker.ketches.cn/"]
    }
EOF'
    sudo systemctl daemon-reload

    judge "设置Docker镜点 "
else
    sudo bash -c 'cat <<EOF > /etc/docker/daemon.json
    {
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    },
    "exec-opts": ["native.cgroupdriver=cgroupfs"]
    }
EOF'
    echo "当前国家不是China，未执行Docker镜点设置。"
fi

# Restart Docker to apply changes.
sudo systemctl restart docker
