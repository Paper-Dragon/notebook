#!/bin/bash

# 检查当前用户是否为root
if [ "$(id -u)" != "0" ]; then
    echo "Error: This script must be run as root."
    exit 1
fi

# 检查系统是否为Ubuntu
if [ "$(lsb_release -si)" != "Ubuntu" ]; then
    echo "Error: This script is intended for Ubuntu only."
    exit 1
fi

# 定义要替换的域名和新的域名
old_domain="repo.radeon.com"
new_domain="radeon.geekery.cn"

# 遍历需要修改的文件列表
files=("/etc/source.list.d/amdgpu.list" "/etc/source.list.d/rocm.list" "/etc/source.list.d/amdgpu-proprietary.list")

for file in "${files[@]}"
do
    # 检查文件是否存在，如果不存在则输出错误信息并退出循环
    if [ ! -f "$file" ]; then
        echo "Error: File $file not found."
        exit 1
    fi

    # 替换文件中的域名
    sed -i "s/$old_domain/$new_domain/g" "$file"

    # 输出替换结果
    echo "Domain name in $file updated from $old_domain to $new_domain"
done
