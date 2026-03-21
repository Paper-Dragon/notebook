#!/bin/bash

# 定义默认路径和命令
DEFAULT_EXEC="../mihomo-linux-amd64-v1.18.9/mihomo-linux-amd64 -d ../resources"
COMPATIBLE_EXEC="../mihomo-linux-amd64-compatible-v1.18.9/mihomo-linux-amd64-compatible -d ../resources"

# 定义一个函数来处理退出
cleanup() {
    echo "脚本被中断，正在清理..."
    exit 1
}

# 捕获 SIGINT 信号 (Ctrl+C)
trap cleanup SIGINT

# 尝试运行默认版本
echo "尝试运行默认版本..."
$DEFAULT_EXEC 

# 检查上一个命令的退出状态码，非零表示执行失败
if [ $? -ne 0 ]; then
    echo "默认版本无法启动，尝试运行兼容版本..."
    $COMPATIBLE_EXEC

    # 检查兼容版本是否成功运行
    if [ $? -ne 0 ]; then
        echo "兼容版本也无法启动，请检查问题。"
        exit 1
    else
        echo "兼容版本启动成功。"
    fi
else
    echo "默认版本启动成功。"
fi
