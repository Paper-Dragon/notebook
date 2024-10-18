#!/bin/bash

set -e

check_root() {
    if [ "$(id -u)" != "0" ]; then
        echo "此脚本必须以root身份运行。"
        exit 1
    fi
}

get_ports() {
    read -p "请输入需要保护的端口号（用空格分隔，例如：80 443）: " PORTS
    PORTS=$(echo $PORTS | tr ' ' '\n')
    echo "$PORTS"
}

get_time_window() {
    read -p "请输入时间窗口（单位：秒）: 600?" TIME_WINDOW
    echo "$TIME_WINDOW"
}

get_hitcount() {
    read -p "请输入最大连接数限制（hitcount）: 1000?" HITCOUNT
    echo "$HITCOUNT"
}

detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$NAME $VERSION_ID"
    else
        OS_NAME=$(uname -s)
        OS_VERSION=$(uname -r)
        echo "$OS_NAME $OS_VERSION"
    fi
}

clear_script_rules() {
    echo "清除与脚本相关的iptables限制规则..."

    # 获取所有包含 cc-attack 的规则的行号，从后向前删除
    while read -r line; do
        rule_num=$(echo "$line" | awk '{print $1}')
        iptables -D INPUT "$rule_num"
    done < <(iptables -L INPUT --line-numbers | grep "cc-attack" | sort -r -n)

    echo "所有与脚本相关的iptables规则已清除。"
}

clear_all_rules() {
    echo "清除全部iptables规则..."
    iptables -F
    iptables -X
    iptables -t nat -F
    iptables -t mangle -F
    iptables -t security -F
    iptables -P INPUT ACCEPT
    iptables -P FORWARD ACCEPT
    iptables -P OUTPUT ACCEPT
}

clear_default_rules() {
    echo "清除默认的iptables规则..."
    
    # 获取所有相关的规则的行号，从后向前删除
    while read -r line; do
        rule_num=$(echo "$line" | awk '{print $1}')
        iptables -D INPUT "$rule_num"
    done < <(iptables -L INPUT --line-numbers | grep -E "ESTABLISHED,RELATED|ACCEPT" | sort -r -n)

    echo "默认的iptables规则已清除。"
}

load_module() {
    MOD_NAME="nf_conntrack"
    if ! lsmod | grep -q "$MOD_NAME"; then
        modprobe $MOD_NAME
        if ! lsmod | grep -q "$MOD_NAME"; then
            echo "无法加载模块 $MOD_NAME。"
            exit 1
        fi
    fi
}

set_connection_limits() {
    local ports=$1
    local time_window=$2
    local hitcount=$3

    for port in $ports; do
        iptables -I INPUT -p tcp --dport $port -m recent --set --name cc-attack --rsource
        iptables -I INPUT -p tcp --dport $port -m recent --update --seconds $time_window --hitcount $hitcount --rttl --name cc-attack --rsource -j DROP
        iptables -I INPUT -p tcp --dport $port -m recent --update --seconds $time_window --hitcount $hitcount --rttl --name cc-attack --rsource -j LOG --log-prefix "CC_ATTACK: "
    done
}

allow_established_connections() {
    iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
}

allow_other_traffic() {
    iptables -A INPUT -j ACCEPT
}

save_rules() {
    echo "保存iptables规则..."

    if command -v iptables-save &> /dev/null; then
        # 检查是否存在 /etc/iptables 目录，如果不存在则创建
        if [ ! -d /etc/iptables ]; then
            mkdir -p /etc/iptables
        fi
        iptables-save > /etc/iptables/rules.v4
        if command -v iptables-restore &> /dev/null; then
            echo "规则已保存到 /etc/iptables/rules.v4。"
        else
            echo "iptables-restore 命令不可用。请手动检查规则。"
        fi
    else
        echo "iptables-save 命令不可用。"
    fi
}

main() {
    check_root
    OS_INFO=$(detect_os)
    echo "检测到的操作系统: $OS_INFO"
    load_module

    read -p "请选择模式（1. 插入一个限制 2. 清除限制规则 3. 清空全部规则）: " MODE
    case $MODE in
        1)
            PORTS=$(get_ports)
            TIME_WINDOW=$(get_time_window)
            HITCOUNT=$(get_hitcount)
            set_connection_limits "$PORTS" "$TIME_WINDOW" "$HITCOUNT"
            ;;
        2)
            clear_script_rules
            clear_default_rules
            ;;
        3)
            clear_all_rules
            ;;
        *)
            echo "无效的选项。"
            exit 1
            ;;
    esac

    allow_established_connections
    allow_other_traffic

    save_rules
    echo "iptables规则已设置完成。"
}

main
