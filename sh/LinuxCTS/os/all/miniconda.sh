#!/bin/bash
set -euo pipefail

CONDA_DIR="$HOME/miniconda3"
CONDA_URL="https://repo.anaconda.com/miniconda/Miniconda3-py311_24.3.0-0-Linux-x86_64.sh"
CONDA_SCRIPT="${CONDA_DIR}/miniconda.sh"

setup_environment() {
    echo "正在验证Conda安装环境依赖..."
    command -v wget >/dev/null 2>&1 || { 
        echo >&2 "错误：安装Conda需要先安装wget工具"; 
        exit 1
    }
    
    echo "创建安装目录: ${CONDA_DIR}"
    mkdir -p "${CONDA_DIR}"
}

download_miniconda() {
    echo "正在下载Conda官方安装脚本..."
    if ! wget -q "${CONDA_URL}" -O "${CONDA_SCRIPT}"; then
        echo >&2 "错误：下载失败，请检查网络连接"
        exit 1
    fi
}

install_miniconda() {
    echo "正在执行Conda自动化安装流程..."
    bash "${CONDA_SCRIPT}" -b -u -p "${CONDA_DIR}"
}

configure_conda() {
    echo "正在初始化Conda环境并配置自动激活..."
    source "${CONDA_DIR}/bin/activate"
    conda init --all
    
    echo "# Conda环境路径配置" >> ~/.bashrc
    echo "export PATH=\"${CONDA_DIR}/bin:\$PATH\"" >> ~/.bashrc
}

show_post_install() {
    echo -e "\nConda环境已成功部署！请按顺序执行以下命令："
    echo "1. 激活环境配置: source ~/.bashrc"
    echo "2. 启动基础环境: conda activate base"
    echo -e "\n如需禁用自动激活，执行:"
    echo "conda config --set auto_activate_base false"
    echo -e "\n进行Conda环境清理维护:"
    echo "conda clean -y --all"
}

main() {
    setup_environment
    download_miniconda
    install_miniconda
    configure_conda
    show_post_install
}

main "$@"
