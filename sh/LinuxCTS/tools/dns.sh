#!/bin/bash

Green="\033[32m"
Red="\033[41;37m"
Yellow="\033[43;37m"
blue="\033[44;37m"
GreenBG="\033[42;37m"
RedBG="\033[41;37m"
Font="\033[0m"

#===============================#
#     linux自助修改DNS脚本      #
#===============================#
	
dns_linux(){
if [ $1 != 'restore' ];then
    DNS1=$1
    DNS2=$2
fi

function Get_OSName(){
    if grep -Eqi "CentOS" /etc/issue || grep -Eq "CentOS" /etc/*-release; then
        DISTRO='CentOS'
    elif grep -Eqi "Debian" /etc/issue || grep -Eq "Debian" /etc/*-release; then
        DISTRO='Debian'
    elif grep -Eqi "Ubuntu" /etc/issue || grep -Eq "Ubuntu" /etc/*-release; then
        DISTRO='Ubuntu'
    else
        DISTRO='unknow'
    fi
    if [ $DISTRO != 'unknow' ]; then
        echo -e '检测到您的系统为: '$DISTRO''
    else
        echo -e '不支持的操作系统，请更换为 CentOS / Debian / Ubuntu 后重试。'
        exit;
    fi
}
function get_char(){
    SAVEDSTTY=`stty -g`
    stty -echo
    stty cbreak
    dd if=/dev/tty bs=1 count=1 2> /dev/null
    stty -raw
    stty echo
    stty $SAVEDSTTY
}
function Welcome(){
    echo -e '正在检测您的操作系统...'
    Get_OSName
    echo -e '您确定要使用下面的DNS地址吗？'
    echo -e '主DNS: '$DNS1''
    if [ "$DNS2" != '' ]; then
        echo -e '备DNS: '$DNS2''
    fi
    echo
    echo -e '请按任意键继续，如有配置错误请使用 Ctrl+C 退出。'
    char=`get_char`
}
function ChangeDNS(){
    if grep -Eqi "CentOS" /etc/issue || grep -Eq "CentOS" /etc/*-release; then
        echo
        echo -e '正在备份当前DNS配置文件...'
        cp /etc/resolv.conf /etc/resolv.conf.backup
        echo
        echo -e '备份完成，正在修改DNS配置文件...'
        if [ `cat /etc/redhat-release|sed -r 's/.* ([0-9]+)\..*/\1/'` == 7 ]; then
            sed -i '/\[main\]/a dns=none' /etc/NetworkManager/NetworkManager.conf
            systemctl restart NetworkManager.service
        fi
        echo -e 'nameserver '$DNS1'' > /etc/resolv.conf
        if [ "$DNS2" != '' ]; then
        echo -e 'nameserver '$DNS2'' >> /etc/resolv.conf
        fi
        echo
        echo -e 'DNS配置文件修改完成。'
    elif grep -Eqi "Debian" /etc/issue || grep -Eq "Debian" /etc/*-release; then
        echo
        echo -e '正在备份当前DNS配置文件...'
        cp /etc/resolv.conf /etc/resolv.conf.backup
        echo
        echo -e '备份完成，正在修改DNS配置文件...'
        echo -e 'nameserver '$DNS1'' > /etc/resolv.conf
        if [ "$DNS2" != '' ]; then
            echo -e 'nameserver '$DNS2'' >> /etc/resolv.conf
        fi
        echo
        echo -e 'DNS配置文件修改完成。'
    elif grep -Eqi "Ubuntu" /etc/issue || grep -Eq "Ubuntu" /etc/*-release; then
        echo
        echo -e '正在修改DNS配置文件...'
        if [ `cat /etc/issue|awk '{print $2}'|awk -F'.' '{print $1}'` -le 17 ]; then
            echo -e 'nameserver '$DNS1'' > /etc/resolvconf/resolv.conf.d/base
            if [ "$DNS2" != '' ]; then
                echo -e 'nameserver '$DNS2'' >> /etc/resolvconf/resolv.conf.d/base
            fi
            resolvconf -u
        else
            echo -e 'nameserver '$DNS1'' >> /etc/systemd/resolved.conf
            if [ "$DNS2" != '' ]; then
                echo -e 'nameserver '$DNS2'' >> /etc/systemd/resolved.conf
            fi
            systemctl restart systemd-resolved.service
        fi
        echo
        echo -e 'DNS配置文件修改完成。'
    fi
    echo
    echo -e '感谢您的使用, 如果您想恢复备份，请执行脚本恢复。'
}
function RestoreDNS(){
    if grep -Eqi "CentOS" /etc/issue || grep -Eq "CentOS" /etc/*-release; then
        echo -e '正在恢复默认DNS配置文件...'
        rm -rf /etc/resolv.conf
        mv /etc/resolv.conf.backup /etc/resolv.conf
        if [ `cat /etc/redhat-release|sed -r 's/.* ([0-9]+)\..*/\1/'` == 7 ]; then
            sed -i 's/dns=none//g' /etc/NetworkManager/NetworkManager.conf
            systemctl restart NetworkManager.service
        fi
        echo
        echo -e 'DNS配置文件恢复完成。'
    elif grep -Eqi "Debian" /etc/issue || grep -Eq "Debian" /etc/*-release; then
        echo -e '正在恢复默认DNS配置文件...'
        rm -rf /etc/resolv.conf
        mv /etc/resolv.conf.backup /etc/resolv.conf
        echo
        echo -e 'DNS配置文件恢复完成。'
    elif grep -Eqi "Ubuntu" /etc/issue || grep -Eq "Ubuntu" /etc/*-release; then
        echo -e '正在恢复默认DNS配置文件...'
        if [ `cat /etc/issue|awk '{print $2}'|awk -F'.' '{print $1}'` -le 17 ]; then
            echo -e '' > /etc/resolvconf/resolv.conf.d/base
            resolvconf -u
        else
            sed -i '/nameserver/d' /etc/systemd/resolved.conf
            systemctl restart systemd-resolved.service
        fi
        echo
        echo -e 'DNS配置文件恢复完成。'
    fi
}
function addDNS(){
    Welcome
    ChangeDNS
}
if [ $1 != 'restore' ];then
    addDNS
elif [ $1 == 'restore' ];then
    RestoreDNS
else
    echo '用法错误！'
fi
}

#=================================================

    echo -e "${Green}1.${Font} 设置阿里和腾讯的DNS"
	echo -e "${GreenBG}阿里 223.6.6.6 腾讯 119.29.29.29${Font}"
	echo -e "${Green}2.${Font} 设置百度和114的DNS"
	echo -e "${GreenBG}百度 180.76.76.76 114 114.114.114.114${Font}"
    echo -e "${Green}3.${Font} 设置谷歌和cloudflare的DNS"
	echo -e "${GreenBG}谷歌 8.8.8.8 cloudflare 1.1.1.1${Font}"
	echo -e "${Green}4.${Font} 恢复服务器之前的DNS"
	echo -e "${Green}5.${Font} 手动修改服务器的DNS"
    echo -e "${Green}6.${Font} 查看服务器当前的DNS"
    echo -e "${Green}7.${Font} 退出当前脚本\n"

    read -rp "请输入对应的数字：" num
    case $num in
    1)
        dns_linux 223.6.6.6 119.29.29.29
        ;;
    2)
        dns_linux 180.76.76.76 114.114.114.114
        ;;
    3)
        dns_linux 8.8.8.8 1.1.1.1
        ;;
    4)
        dns_linux restore
        ;;
    5)
        vi /etc/resolv.conf
        ;;
	6)
        cat /etc/resolv.conf
        ;;
    7)
        exit
        ;;
    *)
        echo -e "${RedBG}请输入正确的数字${Font}"
        ;;
    esac