#!/bin/bash

Green="\033[32m"
Red="\033[31m"
Yellow="\033[43;37m"
blue="\033[44;37m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"

#===============================#
#      frps服务端安装脚本       #
#===============================#

version="0.61.1"
frps_service="/etc/systemd/system/frps.service"
frps_home="/opt/frps"
frps_ini="${frps_home}/frps.ini"


check_sys(){
	if [[ -f /etc/redhat-release ]];then
		release="CentOS"
	elif cat /etc/issue | grep -q -i "debian";then
		release="Debian"
	elif cat /etc/issue | grep -q -i "ubuntu";then
		release="Ubuntu"
	else
		release="Unknown"
		echo -e "${RedBG}未知操作系统，可能会有报错${Font}\n"
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
    rm -rf ${frps_home}
    mkdir -p ${frps_home}
    cd ${frps_home}
    wget --no-check-certificate ${download_url}/app/frp_${version}_linux_amd64.tar.gz
    tar -zxvf frp_${version}_linux_amd64.tar.gz
    mv frp_${version}_linux_amd64/frps ${frps_home}
    rm -fr frp_${version}_linux_amd64.tar.gz
    rm -fr frp_${version}_linux_amd64
    chown root:root -R ${frps_home}
    chmod 755 -R ${frps_home}
    echo -e "${GreenBG}下载frps服务端完成${Font}"
}

write_service(){
    cat > $frps_service <<-EOF
[Unit]
Description=frps daemon
After=syslog.target  network.target
Wants=network.target

[Service]
Type=simple
ExecStart=${frps_home}/frps -c ${frps_home}/frps.ini
Restart= always
RestartSec=1min

[Install]
WantedBy=multi-user.target
EOF

    cat $frps_service
    systemctl daemon-reload
    echo -e "${GreenBG}下载frps守护服务完成${Font}"
}

write_ini(){
    cat > $frps_ini <<-EOF
[common]
bind_addr = 0.0.0.0
bind_port = ${port1}
bind_udp_port = ${port1}
vhost_http_port = ${port2}
vhost_https_port = ${port3}

tcp_mux = true
#allow_ports = 1-65535
max_pool_count = 100
#max_ports_per_client = 0
token = ${key1}

dashboard_port = ${port4}
dashboard_user = ${user1}
dashboard_pwd = ${key2}
EOF
    
    echo -e "${GreenBG}下载frps配置文件完成${Font}"
}

update_file(){
    mv ${frps_home}/frps.ini ${frps_home}.ini
    rm -rf ${frps_home}
    mkdir -p ${frps_home}
    cd ${frps_home}
    wget --no-check-certificate ${download_url}/app/frp_${version}_linux_amd64.tar.gz
    tar -zxvf frp_${version}_linux_amd64.tar.gz
    mv frp_${version}_linux_amd64/frps ${frps_home}
    mv ${frps_home}.ini ${frps_home}/frps.ini
    rm -fr frp_${version}_linux_amd64.tar.gz
    rm -fr frp_${version}_linux_amd64
    chown root:root -R ${frps_home}
    chmod 755 -R ${frps_home}
    echo -e "${GreenBG}更新frps服务端完成${Font}"
}

frps_txt(){
    read -ep "请输入frps监听端口(默认:7000)：" port1
    if [[ -z "${port1}" ]]; then
       port1=7000
    fi
    read -ep "请输入http监听端口(默认:80)：" port2
    if [[ -z "${port2}" ]]; then
       port2=80
    fi
    read -ep "请输入https监听端口(默认:443)：" port3
    if [[ -z "${port3}" ]]; then
       port3=443
    fi
    read -ep "请输入token对接密钥(默认:123456)：" key1
    if [[ -z "${key1}" ]]; then
       key1=123456
    fi
    read -ep "请输入管理面板监听端口(默认:7500)：" port4
    if [[ -z "${port4}" ]]; then
       port4=7500
    fi
    read -ep "请输入管理面板账号(默认:admin)：" user1
    if [[ -z "${user1}" ]]; then
       user1=admin
    fi
    read -ep "请输入管理面板密码(默认:admin)：" key2
    if [[ -z "${key2}" ]]; then
       key2=admin
    fi
}

install_frps(){
    frps_txt
    download_file
    write_service
    write_ini
    echo -e "${GreenBG}安装frps服务端完成${Font}"
    echo -e "${GreenBG}正在关闭各类防火墙${Font}"
    systemctl stop firewalld
    systemctl disable firewalld
    systemctl stop nftables
    systemctl disable nftables
    systemctl stop ufw
    systemctl disable ufw
    echo -e "${GreenBG}关闭各类防火墙完成${Font}"
    systemctl enable frps
    systemctl start frps
    echo -e "${GreenBG}启动frps服务端完成${Font}"
    echo -e "管理面板：${GreenBG} $IP:${port4} ${Font}"
    echo -e "管理账号：${GreenBG} ${user1} ${Font}"
    echo -e "管理密码：${GreenBG} ${key2} ${Font}"
    echo -e "对接密钥：${GreenBG} ${key1} ${Font}"
    echo -e "${GreenBG}如果frps服务端未运行${Font}"
    echo -e "${GreenBG}自行查看frps运行日志${Font}"
}

update_frps(){
    systemctl stop frps
    update_file
    systemctl start frps
    echo -e "${GreenBG}启动frps服务端完成${Font}"
}

uninstall_frps(){
    systemctl disable frps
    systemctl stop frps
    echo -e "${GreenBG}停止frps服务端完成${Font}"
    rm -rf $frps_home
    rm -rf $frps_service
    echo -e "${GreenBG}卸载frps服务端完成${Font}"
}

PID=$(pgrep "frps")
IP=$(curl -s myip.ipip.net | awk -F ' ' '{print $2}' | awk -F '：' '{print $2}')

start_frps(){
    echo
    echo -e "---linux-frps服务端管理脚本---\n"
    
    echo -e "${Green}1.${Font} 安装frps服务端"
    echo -e "${Green}2.${Font} 更新frps服务端"
    echo -e "${Green}3.${Font} 卸载frps服务端" 
    echo
    echo -e "${Green}4.${Font} 启动frps服务端"
    echo -e "${Green}5.${Font} 重启frps服务端"
    echo -e "${Green}6.${Font} 停止frps服务端"
    echo
    echo -e "${Green}7.${Font} 修改frps配置文件" 
    echo -e "${Green}8.${Font} 查看frps运行日志"
    echo
    echo -e "${Green}9.${Font} 切换到客户端脚本"
    echo -e "${Green}10.${Font} 退出当前脚本\n"

    if [[ -n "${PID}" ]]; then
    echo -e "当前状态: frps ${Green}已运行${Font}"
    else
    echo -e "当前状态: frps ${Red}未运行${Font}"
    fi
    echo
    
    read -rp "请输入对应的数字：" num
    case $num in
    1)
        install_frps
        ;;
    2)
        update_frps
        ;;
    3)
        uninstall_frps
        ;;
    4)
        systemctl start frps && sleep 5 && echo -e 正在启动frps && sleep 2 && start_frps
        ;;
    5)
        systemctl restart frps && sleep 5 && echo -e 正在重启frps && sleep 2 && start_frps
        ;;
    6)
        systemctl stop frps && sleep 5 && echo -e 正在停止frps && sleep 2 && start_frps
        ;;
    7)
        nano ${frps_home}/frps.ini
        ;;
    8)
        systemctl status frps
        ;;
    9)
        # curl -O -L ${download_url}/tools/frpc.sh && chmod +x frpc.sh && bash frpc.sh
        source <(curl -s  ${download_url}/tools/frpc.sh)
        ;;
    10)
        echo -e "\n${GreenBG}感谢使用！欢迎下次使用！${Font}\n" && exit
        ;;
    *)
        echo -e "\n${RedBG}请输入正确的数字！${Font}\n" && sleep 2 && start_frps
        ;;
    esac
}

check_sys
check_root
sys_install
start_frps
