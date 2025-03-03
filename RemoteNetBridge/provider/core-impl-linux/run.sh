#!/bin/bash
set -euo pipefail

# 必须root权限执行
if [[ $(id -u) -ne 0 ]]; then
    echo "错误: 必须使用root权限执行本脚本" >&2
    exit 1
fi

# 全局配置
readonly SERVICE_NAME="netbridge-provider"
readonly INSTALL_DIR="/usr/local/src/core"
readonly SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
readonly DOWNLOAD_URL="https://www.geekery.cn/RemoteNetBridge/provider/core-impl-linux/"

# 初始化环境
init_environment() {
    echo "初始化安装环境..."
    mkdir -p "${INSTALL_DIR}"
}

# 下载组件
download_components() {
    echo "正在下载必要组件..."
    
    local components=("core" "config.json")
    
    for component in "${components[@]}"; do
        echo "下载 ${component}..."
        if ! curl -fL "${DOWNLOAD_URL}${component}" -o "./${component}"; then
            echo "错误: ${component} 下载失败"
            return 1
        fi
    done
    
    chmod +x "./core"
    echo "组件下载完成"
}

# 系统服务配置
setup_systemd_service() {
    echo "正在初始化系统服务..."
    mkdir -p "${INSTALL_DIR}"
    mv "./core" "${INSTALL_DIR}/" && \
    mv "./config.json" "${INSTALL_DIR}/" || {
        echo "错误: 文件移动失败"
        exit 3
    }
    
    # 生成服务单元文件
    tee "${SERVICE_FILE}" > /dev/null << EOL
[Unit]
Description=Remote Network Bridge Core Service
After=network.target

[Service]
Type=simple
ExecStart="${INSTALL_DIR}/core" -c "${INSTALL_DIR}/config.json"
Restart=always
RestartSec=30
User=root

[Install]
WantedBy=multi-user.target
EOL

    # 设置权限
    chmod 644 "${SERVICE_FILE}"
    chmod 755 "${INSTALL_DIR}/core"
    chmod 600 "${INSTALL_DIR}/config.json"
    
    # 重载服务配置
    systemctl daemon-reload
    systemctl enable "${SERVICE_NAME}"
    systemctl start "${SERVICE_NAME}"
}

# 主安装流程
install_service() {
    init_environment
    download_components
    setup_systemd_service
    echo "服务安装完成"
}

# 参数验证
if [[ $# -eq 0 ]]; then
    echo "错误：缺少操作参数"
    echo "用法：$0 {install|start|stop|status}"
    exit 2
fi

# 执行操作
case "$1" in
    install)
        install_service
        ;;
    start)
        systemctl start "${SERVICE_NAME}"
        ;;
    stop)
        systemctl stop "${SERVICE_NAME}"
        ;;
    status)
        systemctl status "${SERVICE_NAME}" --no-pager
        ;;
    *)
        echo "错误：无效参数 '$1'"
        echo "可用参数：install | start | stop | status"
        exit 1
esac

echo "操作执行成功"
