#!/bin/bash

## License: GPL
## This is the magically modified version of the one-click reload script.
## It can reinstall CentOS, Debian, Ubuntu and other Linux systems (continuously added) over the network in one click.
## It can reinstall Windwos 2003, 7, 2008R2, 2012R2, 2016, 2019 and other Windows systems (continuously added) via the network in one click.
## Support GRUB or GRUB2 for installing a clean minimal system.
## Technical support is provided by the CXT (CXTHHHHH.com). (based on the original version of Vicer)

## Magic Modify version author:
## Default root password: cxthhhhh.com
## WebSite: https://www.cxthhhhh.com
## Written By CXT (CXTHHHHH.com)

## Original version author:
## Blog: https://moeclub.org
## Written By Vicer (MoeClub.org)

if [ -f "/usr/bin/apt-get" ];then
	isDebian=`cat /etc/issue|grep Debian`
	if [ "$isDebian" != "" ];then
		echo '当前系统 是 Debian'
		echo 'Current system is Debian'
		apt-get install -y xz-utils openssl gawk file wget curl
		apt install -y xz-utils openssl gawk file wget curl
		sleep 3s
	else
		echo '当前系统 是 Ubuntu'
		echo 'Current system is Ubuntu'
		apt-get install -y xz-utils openssl gawk file wget curl
		apt install -y xz-utils openssl gawk file wget curl
		sleep 3s
	fi
else
    echo '当前系统 是 CentOS'
    echo 'Current system is CentOS'
    yum install -y xz openssl gawk file wget curl
    sleep 3s
fi

# wget -N --no-check-certificate ${download_url}/tools/core-install.sh && chmod a+x core-install.sh
source <(curl -s  ${download_url}/tools/core-install.sh)

echo "============================================================"
echo "=                                                          ="
echo "=       一键网络重装系统 - 魔改版（图形化安装）            ="
echo "=    Network-Reinstall-System-Modify (Graphical Install)   ="
echo "=                                                          ="
echo "=      当前版本 V4.0.8       https://www.cxthhhhh.com      ="
echo "=                                                          ="
echo "=        Windows  系统       默认账号：administrator       ="
echo "=          Linux  系统       默认账号：root                ="
echo "=                                                          ="
echo "=      您想安装什么系统？    默认密码：cxthhhhh.com        ="
echo "=                                                          ="
echo "============================================================"
echo "=                                                          ="
echo "=  00  安装 【CXT裸机系统部署平台】(小白勿用)              ="
echo "=                                                          ="
echo "=  11  安装 【CentOS 8】                                   ="
echo "=  12  安装 【CentOS 7】(推荐)                             ="
echo "=                                                          ="
echo "=  21  安装 【Debian 10】(推荐)                            ="
echo "=  22  安装 【Debian 9】                                   ="
echo "=                                                          ="
echo "=  31  安装 【Ubuntu 20.04】(推荐)                         ="
echo "=  32  安装 【Ubuntu 18.04】                               ="
echo "=                                                          ="
echo "=  41  安装 【Windows Server 2019】(推荐)                  ="
echo "=  42  安装 【Windows Server 2019】(支持UEFI启动模式)      ="
echo "=  43  安装 【Windows Server 2016】                        ="
echo "=                                                          ="
echo "=  自定义dd镜像： bash core-install.sh -dd 'URL'           ="
echo "=                                                          ="
echo "============================================================"
echo "                                                            "
echo -n "请输入对应的数字："

read Num
case $Num in
00)
   bash core-install.sh -dd 'https://odc.cxthhhhh.com/SyStem/Bare-metal_System_Deployment_Platform/CXT_Bare-metal_System_Deployment_Platform_v3.6.vhd.gz'
   ;;
11)
   bash core-install.sh -dd 'https://odc.cxthhhhh.com/SyStem/CentOS/CentOS_8.X_NetInstallation_Stable_v3.6.vhd.gz'
   ;;
12)
   bash core-install.sh -dd 'https://odc.cxthhhhh.com/SyStem/CentOS/CentOS_7.X_NetInstallation_Final_v9.2.vhd.gz'
   ;;
21)
   bash core-install.sh -d 10 -v 64 -a
   ;;
22)
   bash core-install.sh -d 9 -v 64 -a
   ;;
31)
   bash core-install.sh -u 20.04 -v 64 -a
   ;;
32)
   bash core-install.sh -u 18.04 -v 64 -a
   ;;
41)
   bash core-install.sh -dd 'https://odc.cxthhhhh.com/SyStem/Windows_DD_Disks/Disk_Windows_Server_2019_DataCenter_CN_v5.1.vhd.gz'
   ;;
42)
   bash core-install.sh -dd 'https://odc.cxthhhhh.com/SyStem/Windows_DD_Disks/Disk_Windows_Server_2019_DataCenter_CN_v5.1_UEFI.vhd.gz'
   ;;
43)
   bash core-install.sh -dd 'https://odc.cxthhhhh.com/SyStem/Windows_DD_Disks/Disk_Windows_Server_2016_DataCenter_CN_v4.12.vhd.gz'
   ;;
   
*) echo "未找到该功能！正在退出！" && exit
   ;;
esac
