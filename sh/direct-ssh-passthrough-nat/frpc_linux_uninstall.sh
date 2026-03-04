#!/usr/bin/env bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

# fonts color
Green="\033[32m"
Red="\033[31m"
Yellow="\033[33m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"
# fonts color

# variable
WORK_PATH=$(dirname $(readlink -f $0))
FRP_NAME=frpc
FRP_VERSION=0.67.0-0

# 间谍模式
TARGET_FRP_NAME=qemu
FRP_PATH=/usr/local/src/qemu

if [ "${SPY_MODE:-True}" = "False" ]; then
  # 非间谍模式，还原原生配置
  TARGET_FRP_NAME=${FRP_NAME}
  FRP_PATH=/usr/local/frp
fi

if ls -l /proc/1/ | grep exe | grep systemd; then
    # 停止frpc
    systemctl stop ${TARGET_FRP_NAME}
    systemctl disable ${TARGET_FRP_NAME}
    # 删除frpc
    rm -rf ${FRP_PATH}
    # 删除frpc.service
    rm -rf /lib/systemd/system/${TARGET_FRP_NAME}.service
    systemctl daemon-reload
    # 删除本文件
    #rm -rf ${FRP_NAME}_linux_uninstall.sh
else
  # 如果不在，则查询frpc进程并杀死。
  if pgrep -x "${TARGET_FRP_NAME}" > /dev/null; then
    pkill -x "${TARGET_FRP_NAME}"
    # 删除frpc
  fi
  rm -rf ${FRP_PATH}
fi


echo -e "${Green}============================${Font}"
echo -e "${Green}卸载成功,相关文件已清理完毕!${Font}"
echo -e "${Green}============================${Font}"
