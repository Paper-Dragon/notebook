#!/bin/bash

# 遍历当前目录和子目录中所有.md文件
find . -type f -name "*.md" | while read file; do
    # 获取文件名（不包括路径）
    filename=$(basename -s .md "$file")
    
    # 检查文件名和文件的第一行剔除#字符串是否一致
    if [[ "$filename" != "${file%.md}" ]]; then
        first_line=$(grep '\#\ ' "$file" | head -n 1 | sed 's/^# //')
        if [[ "$filename" != "$first_line" ]]; then
            echo "文件 $file 内容不一致"
            echo -e "==文件名$filename\n==标题名$first_line"
        fi
    fi
done