#!/bin/bash

# 定义颜色输出
Green="\033[32m"
Red="\033[31m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"

# 通知信息样式
Info="${Green}[信息]${Font}"
OK="${Green}[成功]${Font}"
Error="${Red}[错误]${Font}"
Warning="${Red}[警告]${Font}"

# 显示启动横幅
echo -e "\n${GreenBG}
 ███████                    ██                    ████     ████ ██                              
░██░░░░██                  ░██                   ░██░██   ██░██░░                               
░██    ░██  ██████   █████ ░██  ██  █████  ██████░██░░██ ██ ░██ ██ ██████ ██████  ██████  ██████
░██    ░██ ██░░░░██ ██░░░██░██ ██  ██░░░██░░██░░█░██ ░░███  ░██░██░░██░░█░░██░░█ ██░░░░██░░██░░█
░██    ░██░██   ░██░██  ░░ ░████  ░███████ ░██ ░ ░██  ░░█   ░██░██ ░██ ░  ░██ ░ ░██   ░██ ░██ ░ 
░██    ██ ░██   ░██░██   ██░██░██ ░██░░░░  ░██   ░██   ░    ░██░██ ░██    ░██   ░██   ░██ ░██   
░███████  ░░██████ ░░█████ ░██░░██░░██████░███   ░██        ░██░██░███   ░███   ░░██████ ░███   
░░░░░░░    ░░░░░░   ░░░░░  ░░  ░░  ░░░░░░ ░░░    ░░         ░░ ░░ ░░░    ░░░     ░░░░░░  ░░░    

${Font}Docker 镜像源配置助手
\n"


judge() {
    if [[ 0 -eq $? ]]; then
        echo -e "${OK} ${GreenBG} $1 ${Font}"
    else
        echo -e "${Error} ${RedBG} $2 失败${Font}"
        exit 1
    fi
}


install_jq() {
    if command -v jq &> /dev/null; then
		echo -e "${Info} jq 已经安装了。"
	else
		echo -e "${Warning} 检测到未安装 jq 命令，开始安装。"
        OS=$(uname -s | tr '[:upper:]' '[:lower:]')
        case "$OS" in
            linux*)
                if [ -f /etc/os-release ]; then
                    if grep -qi '^ID=ubuntu' /etc/os-release; then
                        apt update && apt install -y jq
                    elif grep -qi '^ID="centos"' /etc/os-release || grep -qi '^NAME="CentOS Stream"' /etc/os-release; then
                        yum install -y epel-release && yum install -y jq
                    fi
                elif [ -f /etc/alpine-release ]; then
                    apk add jq
                fi
            ;;
            *)
                echo -e "${Error} 不支持的操作系统。请手动安装jq。"
                exit 1
            ;;
        esac
    fi
}


check_docker_installed() {
    if ! command -v dockerd &> /dev/null; then
        echo -e "${Error} Docker 未安装。请先安装 Docker 再继续。"
        exit 1
    fi
}


configure_daemon_json() {
    if [ ! -f "$DAEMON_JSON_PATH" ]; then
        echo '{}' > "$DAEMON_JSON_PATH"
    fi
    
    for MIRROR in "${MIRRORS[@]}"; do
        TMP_FILE=$(mktemp)
        jq --arg mirror "$MIRROR" '.["registry-mirrors"] += [$mirror] | .["registry-mirrors"] |= unique' "$DAEMON_JSON_PATH" > "$TMP_FILE"
        mv "$TMP_FILE" "$DAEMON_JSON_PATH"
        judge "添加镜像站 $MIRROR"
    done
}


manage_systemd() {
    if ! systemctl daemon-reload &> /dev/null; then
        echo -e "${Error} 重载 systemd 配置失败${Font}"
        exit 1
    fi
    judge "重载 systemd 配置"
    
    if ! systemctl restart docker &> /dev/null; then
        echo -e "${Error} 重启 Docker 服务失败${Font}"
        exit 1
    fi
    judge "重启 Docker 服务"
}

# 主程序
install_jq
check_docker_installed
configure_daemon_json
manage_systemd

echo -e "${OK} Docker 镜像站配置完成。已添加（如未存在）: ${MIRRORS[*]} ${Font}"
