#!/bin/bash

Green="\033[32m"
Red="\033[31m"
Yellow="\033[43;37m"
blue="\033[44;37m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"
url=https://ifconfig.icu

#全局参数
country=$(curl -s ${url}/country)
echo -e "${Green}您计算机所在的国家是:${country} ${Font}"
if [[ $country == *"China"* ]]; then
    download_url=https://gitee.com/muaimingjun/LinuxCTS/raw/main
else
    download_url=https://raw.githubusercontent.com/hyh1750522171/LinuxCTS/main
fi

# Detect if an Nvidia GPU is present
NVIDIA_PRESENT=$(lspci | grep -i nvidia || true)

# Only proceed with Nvidia-specific steps if an Nvidia device is detected
if [[ -z "$NVIDIA_PRESENT" ]]; then
    
    echo -e "${RedBG} 未在设备上检测到 Nvidia 显卡设备 ${Font}"
    exit 1
if command -v nvidia-smi &>/dev/null; then
    echo "CUDA drivers already installed as nvidia-smi works."
else
    echo "您设备上没有显卡驱动,接下来安装它...."
    source <(curl -s ${download_url}/tools/nvidia-driver.sh)
fi

# For testing purposes, this should output NVIDIA's driver version
if [[ ! -z "$NVIDIA_PRESENT" ]]; then
    nvidia-smi
fi

# Workaround for NVIDIA Docker Issue

# Test / Install nvidia-docker
if [[ ! -z "$NVIDIA_PRESENT" ]] || true; then
    if sudo docker run --gpus all --rm hub.geekery.cn/nvidia/nvidia/cuda:11.0.3-base-ubuntu18.04 nvidia-smi &>/dev/null; then
        echo "nvidia-docker is enabled and working. Exiting script."
    else
        echo "nvidia-docker does not seem to be enabled. Proceeding with installations..."
        distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
        # nvidia.github.io <- nvidia-docker.geekery.cn
        curl -s -L https://nvidia-docker.geekery.cn/nvidia-docker/gpgkey | sudo apt-key add
        curl -s -L https://nvidia-docker.geekery.cn/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
        sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
        mkdir -pv /etc/docker/ || true
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
        sudo systemctl restart docker
        sudo docker run --gpus all --rm hub.geekery.cn/nvidia/cuda:11.0.3-base-ubuntu18.04 nvidia-smi
    fi
fi

sudo apt-mark hold 'nvidia*' 'libnvidia*'
# Add docker group and user to group docker
sudo groupadd docker || true
sudo usermod -aG docker $USER || true
newgrp docker || true
