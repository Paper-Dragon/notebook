#!/usr/bin/env bash

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

# 判断并输出结果的函数
judge() {
    if [[ 0 -eq $? ]]; then
        echo -e "${OK} ${GreenBG} $1 完成${Font}"
    else
        echo -e "${Error} ${RedBG} $1 失败${Font}"
        exit 1
    fi
}

# 检查 root 权限
is_root() {
    if [[ $EUID -eq 0 ]]; then
        judge "检查root权限: 现在的权限是 $EUID"
    else
        echo -e "${Error}当前用户不是root用户，请切换到root用户后重新执行脚本${Font}"
    fi
}

# 检测是否为 OpenVZ 虚拟化
ovz_no() {
    if [[ -d "/proc/vz" ]]; then
        echo -e "${Error}你的 VPS 基于 OpenVZ，不支持此脚本！${Font}"
    fi
}

# 添加 swap 文件
add_swap() {
    echo -e "${Info} 请输入需要添加的 swap 大小，建议为内存的 1.5-2 倍！${Font}"
    read -p "请输入 swap 大小 (MB): " swapsize

    # 检查是否存在 swapfile
    if ! grep -q "swapfile" /etc/fstab; then
        echo -e "${Warning} 未检测到 swapfile，正在创建 swapfile...${Font}"
        fallocate -l ${swapsize}M /swapfile
        judge "创建 swapfile"

        chmod 600 /swapfile
        judge "设置 swapfile 权限"

        mkswap /swapfile
        judge "设置 swapfile"

        swapon /swapfile
        judge "启用 swapfile"

        echo '/swapfile none swap defaults 0 0' >> /etc/fstab
        judge "写入 /etc/fstab"

        echo -e "${OK} swap 创建成功，信息如下：${Font}"
        cat /proc/swaps
        grep Swap /proc/meminfo
    else
        echo -e "${Error}swapfile 已存在，请先删除现有 swapfile 再重新设置！${Font}"
    fi
}

# 删除 swap 文件
del_swap() {
    # 检查是否存在 swapfile
    if grep -q "swapfile" /etc/fstab; then
        echo -e "${Info} 检测到 swapfile，正在移除...${Font}"

        echo "3" > /proc/sys/vm/drop_caches
        judge "迁移swap数据到内存"

        sed -i '/swapfile/d' /etc/fstab
        judge "从 /etc/fstab 移除 swapfile"

        swapoff /swapfile
        judge "关闭 swapfile"

        rm -f /swapfile
        judge "删除 swapfile"

        echo -e "${OK} swap 删除成功！${Font}"
    else
        echo -e "${Error}未检测到 swapfile，无法删除 swap！${Front}"
    fi
}

# 主菜单
main() {
    is_root
    ovz_no
    clear
    echo -e "———————————————————————————————————————"
    echo -e "${Green}Linux VPS 一键添加/删除 swap 脚本${Font}"
    echo -e "${Green}1. 添加 swap${Font}"
    echo -e "${Green}2. 删除 swap${Font}"
    echo -e "———————————————————————————————————————"
    read -p "请输入数字 [1-2]: " num
    case "$num" in
        1)
            add_swap
            ;;
        2)
            del_swap
            ;;
        *)
            echo -e "${Warning} 请输入正确的数字 [1-2]${Font}"
            sleep 2s
            main
            ;;
    esac
}

main
