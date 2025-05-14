#!/bin/bash
## 服务器硬件信息
# 定义颜色变量
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 获取当前日期和时间
current_date=$(date "+%Y年%m月%d日 %A %H:%M:%S")
# 获取主机名
hostname=$(hostname)

# 获取主板信息
get_pm_info() {
    echo -e "${YELLOW}主板信息:${NC}"
    dmidecode -t 1 | grep -E "Manufacturer|Product Name|Serial Number"
}

# 获取CPU信息
get_cpu() {
    echo -e "${YELLOW}CPU信息:${NC}"
    dmidecode -t processor | grep -E 'Socket|Core Count|Version'
}

# 获取内存信息
get_mem() {
    echo -e "${YELLOW}内存信息:${NC}"
    dmidecode_output=$(dmidecode -t memory)

    # 计算总内存，正确处理MB和GB单位
    total_memory=$(echo "$dmidecode_output" | grep -A 10 "Memory Device" | grep "Size:" | grep -v "No Module Installed" | awk '{
        if ($3 == "MB") total += $2 / 1024
        else if ($3 == "GB") total += $2
    } END {printf "%.2f GiB", total}')
    echo -e "${GREEN}当前总内存: $total_memory${NC}"

    # 提取内存槽位总数
    total_slots=$(echo "$dmidecode_output" | grep "Number Of Devices" | awk '{print $NF}')
    echo -e "${GREEN}内存槽位总数: $total_slots${NC}"

    # 提取已安装的内存模块数量
    installed_memory=$(echo "$dmidecode_output" | grep -v Volatile | grep -c "Size: [0-9]")
    echo -e "${GREEN}已安装的内存模块数量: $installed_memory${NC}"

    # 计算未使用的槽位数量
    unused_slots=$((total_slots - installed_memory))
    echo -e "${GREEN}未使用的槽位数量: $unused_slots${NC}"

    # 提取每根内存的详细信息
    echo -e "${GREEN}已安装内存的详细信息：${NC}"
    echo "$dmidecode_output" | grep -A 32 "Memory Device" | head -22 | grep -E -w "Manufacturer|Type:|Size|Speed|Part Number" | sed '/No Module Installed/d'
}

# 获取磁盘信息
get_disk() {
    echo -e "${YELLOW}磁盘信息:${NC}"
    lsblk -d -o NAME,TYPE,SIZE | grep -v loop
}

# 获取GPU信息
get_gpu() {
    echo -e "${YELLOW}GPU信息:${NC}"
    if command -v nvidia-smi &> /dev/null; then
        nvidia-smi -L
    else
        echo -e "${RED}未检测到NVIDIA GPU或nvidia-smi命令不可用。${NC}"
        echo -e "${GREEN}尝试使用lspci查找其他GPU设备：${NC}"
        lspci | grep -i vga
    fi
}

# 主函数
main() {
    echo -e "${YELLOW}==================== 服务器硬件信息报告 ====================${NC}"
    echo -e "${YELLOW}日期: $current_date${NC}"
    echo -e "${YELLOW}主机名: $hostname${NC}"
    echo -e "${YELLOW}============================================================${NC}"
    get_pm_info
    get_cpu
    get_mem
    get_disk
    get_gpu
}

# 执行主函数并将输出保存到文件
main | tee /tmp/server-$(date +%F_%H-%M-%S).txt
