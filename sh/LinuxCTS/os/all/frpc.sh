#!/bin/bash

Green="\033[32m"
Red="\033[31m"
Yellow="\033[43;37m"
blue="\033[44;37m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"

#===============================#
#      frpc客户端安装脚本       #
#===============================#

version="0.61.1"
frpc_service="/etc/systemd/system/frpc.service"
frpc_home="/root/frpc"
frpc_ini="${frpc_home}/frpc.ini"


check_sys(){
    if [[ -f /etc/os-release ]]; then
        source /etc/os-release
        case $ID in
            centos|debian|ubuntu)
                echo "Detected OS: $ID"
                ;;
            *)
                echo -e "${RedBG}未知操作系统，可能会有报错${Font}\n"
                ;;
        esac
    fi
}

check_root(){
	if [[ $EUID != 0 ]];then
		echo -e "${RedBG}当前不是ROOT账号，建议更换ROOT账号使用。${Font}\n"
		countdown_sleep 5
	else
		echo -e "${GreenBG}ROOT账号权限检查通过，祝你使用愉快！${Font}\n"
		countdown_sleep 2
	fi
}

sys_install(){
    if ! type wget >/dev/null 2>&1; then
        echo 'wget 未安装 正在安装中'
	    apt-get install wget -y || yum install wget -y
    else
        echo 'wget 已安装，继续操作'
    fi
    
    if ! type curl >/dev/null 2>&1; then
        echo 'curl 未安装 正在安装中'
	    apt-get install curl -y || yum install curl -y
    else
        echo 'curl 已安装，继续操作'
    fi
    
    if ! type nano >/dev/null 2>&1; then
        echo 'nono 未安装 正在安装中';
	    apt-get install nano -y || yum install nano -y
    else
        echo 'nano 已安装，继续操作'
    fi
}

download_file(){
    rm -rf ${frpc_home}
    mkdir -p ${frpc_home} && cd ${frpc_home}
    wget --no-check-certificate ${download_url}/app/frp_${version}_linux_amd64.tar.gz
    tar -zxvf frp_${version}_linux_amd64.tar.gz
    mv frp_${version}_linux_amd64/frpc ${frpc_home}
    rm -fr frp_${version}_linux_amd64.tar.gz
    rm -fr frp_${version}_linux_amd64
    chown root:root -R ${frpc_home}
    chmod 755 -R ${frpc_home}
    echo -e "${GreenBG}下载frpc客户端完成${Font}"
}

write_service(){
    cat > $frpc_service <<-EOF
[Unit]
Description=frpc daemon
After=syslog.target  network.target
Wants=network.target

[Service]
Type=simple
ExecStart=${frpc_home}/frpc -c ${frpc_home}/frpc.ini
Restart= always
RestartSec=1min

[Install]
WantedBy=multi-user.target
EOF
    
    cat $frpc_service
    systemctl daemon-reload
    echo -e "${GreenBG}下载frpc守护服务完成${Font}"
}

write_ini(){
    cat > $frpc_ini <<-EOF
[common]
server_addr = ${frpsip}
server_port = ${port1}

user= ${user1}
token = ${key1}
login_fail_exit = false

admin_addr = 0.0.0.0
admin_port = ${port2}
admin_user = ${user2}
admin_pwd = ${key2}

[frpc-${SJ}]
type = tcp
local_ip = 127.0.0.1
local_port = ${port2}
remote_port = ${SJ}

#[tcp-1]
#type = tcp
#local_ip = 127.0.0.1
#local_port = 22
#remote_port = 2222

#[udp-1]
#type = udp
#local_ip = 127.0.0.1
#local_port = 19132
#remote_port = 19132

#[web-1]
#type = http
#local_ip = 127.0.0.1
#local_port = 80
#custom_domains = xxxx.cn
EOF
    
    echo -e "${GreenBG}下载frpc配置文件完成${Font}"
}

update_file(){
    mv ${frpc_home}/frpc.ini ${frpc_home}.ini
    rm -rf ${frpc_home}
    mkdir -p ${frpc_home} &&cd ${frpc_home}
    wget --no-check-certificate ${download_url}/app/frp_${version}_linux_amd64.tar.gz
    tar -zxvf frp_${version}_linux_amd64.tar.gz
    mv frp_${version}_linux_amd64/frpc ${frpc_home}
    mv ${frpc_home}.ini ${frpc_home}/frpc.ini
    rm -fr frp_${version}_linux_amd64.tar.gz
    rm -fr frp_${version}_linux_amd64
    chown root:root -R ${frpc_home}
    chmod 755 -R ${frpc_home}
    echo -e "${GreenBG}更新frpc客户端完成${Font}"
}

frpc_txt(){
    read -ep "请输入frps服务端IP(默认:没有)：" frpsip
    if [[ -z "${frpsip}" ]]; then
       frpsip=0.0.0.0
    fi
    read -ep "请输入frps监听端口(默认:7000)：" port1
    if [[ -z "${port1}" ]]; then
       port1=7000
    fi
    read -ep "请输入客户端备注(默认:${SJ})：" user1
    if [[ -z "${user1}" ]]; then
       user1=${SJ}
    fi
    read -ep "请输入token对接密钥(默认:123456)：" key1
    if [[ -z "${key1}" ]]; then
       key1=123456
    fi
    read -ep "请输入管理面板监听端口(默认:7400)：" port2
    if [[ -z "${port2}" ]]; then
       port2=7400
    fi
    read -ep "请输入管理面板账号(默认:admin)：" user2
    if [[ -z "${user2}" ]]; then
       user2=admin
    fi
    read -ep "请输入管理面板密码(默认:admin)：" key2
    if [[ -z "${key2}" ]]; then
       key2=admin
    fi
}

install_frpc(){
    frpc_txt
    download_file
    write_service
    write_ini
    echo -e "${GreenBG}安装frpc客户端完成${Font}"
    echo -e "${GreenBG}正在关闭各类防火墙${Font}"
    systemctl stop firewalld
    systemctl disable firewalld
    systemctl stop nftables
    systemctl disable nftables
    systemctl stop ufw
    systemctl disable ufw
    echo -e "${GreenBG}关闭各类防火墙完成${Font}"
    systemctl enable frpc
    systemctl start frpc
    echo -e "${GreenBG}启动frpc客户端完成${Font}"
    echo -e "管理面板：${GreenBG} ${frpsip}:${SJ} ${Font}"
    echo -e "管理账号：${GreenBG} ${user2} ${Font}"
    echo -e "管理密码：${GreenBG} ${key2} ${Font}"
    echo -e "对接密钥：${GreenBG} ${key1} ${Font}"
    echo -e "${GreenBG}建议使用frpc管理面板${Font}"
    echo -e "${GreenBG}可以快速加载配置文件${Font}"
}

update_frpc(){
    systemctl stop frpc
    update_file
    echo -e "${GreenBG}更新frpc客户端完成${Font}"
    systemctl start frpc
    echo -e "${GreenBG}启动frpc客户端完成${Font}"
}

uninstall_frpc(){
    systemctl disable frpc
    systemctl stop frpc
    echo -e "${GreenBG}停止frpc客户端完成${Font}"
    rm -rf $frpc_home
    rm -rf $frpc_service
    echo -e "${GreenBG}卸载frpc客户端完成${Font}"
}

PID=$(pgrep "frpc")
SJ=$(echo $RANDOM)

start_frpc(){
    echo
    echo -e "---linux-frpc客户端管理脚本---\n"
    
    echo -e "${Green}1.${Font} 安装frpc客户端"
    echo -e "${Green}2.${Font} 更新frpc客户端"
    echo -e "${Green}3.${Font} 卸载frpc客户端" 
    echo
    echo -e "${Green}4.${Font} 启动frpc客户端"
    echo -e "${Green}5.${Font} 重启frpc客户端"
    echo -e "${Green}6.${Font} 停止frpc客户端"
    echo
    echo -e "${Green}7.${Font} 修改frpc配置文件" 
    echo -e "${Green}8.${Font} 查看frpc运行日志"
    echo
    echo -e "${Green}9.${Font} 切换到服务端脚本"
    echo -e "${Green}10.${Font} 退出当前脚本\n"

    if [[ -n "${PID}" ]]; then
    echo -e "当前状态: frpc ${Green}已运行${Font}"
    else
    echo -e "当前状态: frpc ${Red}未运行${Font}"
    fi
    echo
    
    read -rp "请输入对应的数字：" num
    case $num in
    1)
        install_frpc
        ;;
    2)
        update_frpc
        ;;
    3)
        uninstall_frpc
        ;;
    4)
        systemctl start frpc && sleep 5 && echo -e 正在启动frpc && sleep 2 && start_frpc
        ;;
    5)
        systemctl restart frpc && sleep 5 && echo -e 正在重启frpc && sleep 2 && start_frpc
        ;;
    6)
        systemctl stop frpc && sleep 5 && echo -e 正在停止frpc && sleep 2 && start_frpc
        ;;
    7)
        nano ${frpc_home}/frpc.ini
        ;;
    8)
        systemctl status frpc
        ;;
    9)
        # curl -O -L ${download_url}/tools/frps.sh && chmod +x frps.sh && bash frps.sh
        source <(curl -s  ${download_url}/tools/frps.sh)
        ;;
    10)
        echo -e "\n${GreenBG}感谢使用！欢迎下次使用！${Font}\n" && exit
        ;;
    *)
        echo -e "\n${RedBG}请输入正确的数字！${Font}\n" && sleep 2 && start_frpc
        ;;
    esac
}

check_sys
check_root
sys_install
start_frpc
