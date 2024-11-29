#!/bin/bash

#===============================#
#       linux设置虚拟内存       #
#===============================#

# 判断系统版本
check_system_os(){
	if [[ -f /etc/redhat-release ]];then
		release="CentOS"
# -q 执行本条语句的时候不输出，-i 不区分大小写
	elif cat /etc/issue | grep -q -i "debian";then
		release="Debian"
	elif cat /etc/issue | grep -q -i "ubuntu";then
		release="Ubuntu"
	else
		release="Unknown"
		echo -e "\n 系统不受支持，安装失败 \n"
		exit 1
	fi
}

# 检查是否是root账户
check_root(){
	if [[ $EUID != 0 ]];then
		echo -e " 当前非ROOT账号，无法继续操作。\n 请更换ROOT账号登录服务器。 " 
		exit 1
	else
		echo -e "\n 管理员权限检查通过 "
	fi
}

# 安装系统依赖
dependent_install(){
	if [[ $release == "CentOS" ]];then
		yum -y makecache
		yum -y install virt-what
	elif [[ $release == "Debian" ]] || [[ $release == "Ubuntu" ]];then
		apt-get -y update
		apt-get -y install virt-what
	else
		echo -e " 系统不受支持，退出...... \n"
		exit 1
	fi
}

# 检查虚拟化
virt_check(){
	if [[ `virt-what` == "openvz" ]];then
		echo -e "\n 当前虚拟化为OVZ，不支持本脚本 \n"
	elif [[ `virt-what` == "kvm" ]];then
		echo -e "\n 当前虚拟化为KVM，可以使用本脚本 \n"
	elif [[ `virt-what` == "vmware" ]];then
		echo -e "\n 当前虚拟化为VMware，可以使用本脚本 \n"
	elif [[ `virt-what` == "hyperv" ]];then
		echo -e "\n 当前虚拟化为Hyper-V，可以使用本脚本 \n"
	else
		echo -e "\n 当前虚拟化未知，正在退出脚本...... \n"
		exit
	fi
}

# 取消交换分区
unset_swap(){
	if [[ -e /swap/swapfile ]] || [[ -e /swap ]] || [[ `free | grep -i swap | awk -F " " '{print $2}'` -ne 0 ]];then
		swapoff -a
		rm -rf /swap
		sed -i '/swap/d' /etc/fstab
		if [[ -e /swap/swapfile ]] || [[ -e /swap ]] || [[ `free | grep -i swap | awk -F " " '{print $2}'` -ne 0 ]];then
			echo -e "\n 删除失败，写保护 \n"
		else
			echo -e "\n 删除完成 \n"
		fi
	else
		echo -e "\n 删除失败，没有找到虚拟内存 \n"
	fi
}

# 设置交换分区
set_swap(){
	echo -e " 开始设置虚拟内存容量，建议为内存的2倍。但过大的交换分区会影响磁盘IO，请悉知。 "
	read -p " 请输入需要添加的虚拟内存容量，单位MB: " swap_capacity
	if [[ -e /swap/swapfile ]] || [[ -e /swap ]] || [[ `free | grep -i swap | awk -F " " '{print $2}'` -ne 0 ]];then
		read -e -p " 交换分区文件已存在，继续创建会删除以前的交换分区，是否继续创建？ [Y/n] :" yn
		[[ -z "${yn}" ]] && yn="y"
		if [[ $yn == [Yy] ]]; then
			unset_swap
			mkdir /swap
			dd if=/dev/zero of=/swap/swapfile bs=1MB count=$swap_capacity
			mkswap /swap/swapfile
			chmod 600 /swap/swapfile
			swapon /swap/swapfile
			sed -i '/swap/d' /etc/fstab
			echo "/swap/swapfile swap swap defaults 0 0" >>/etc/fstab
			if [[ -e /swap/swapfile ]] || [[ -e /swap ]] || [[ `free | grep -i swap | awk -F " " '{print $2}'` -ne 0 ]];then
				echo -e "\n 新的虚拟内存设置完成 \n"
			else
				echo -e "\n 设置失败，启动删除程序 \n"
				unset_swap
			fi
		else
			echo -e "\n 用户取消，程序退出 \n"
			exit 1
		fi
	else
		echo " " # 为了美观输出一个空行 
		mkdir /swap
		dd if=/dev/zero  of=/swap/swapfile bs=1MB count=$swap_capacity
		mkswap /swap/swapfile
		chmod 600 /swap/swapfile
		swapon /swap/swapfile
		sed -i '/swap/d' /etc/fstab
		echo "/swap/swapfile swap swap defaults 0 0" >>/etc/fstab
		if [[ -e /swap/swapfile ]] || [[ -e /swap ]] || [[ `free | grep -i swap | awk -F " " '{print $2}'` -ne 0 ]];then
			echo -e "\n 虚拟内存设置完成 \n"
		else
			echo -e "\n 设置失败，启动删除程序 \n"
			unset_swap
		fi
	fi
}

# 设置交换分区前的环境检查
before_set_swap(){
	echo -e "\n 开始检查系统 "
	check_system_os
	check_root
	dependent_install >/dev/null 2>&1 &
	virt_check
	set_swap
}


############################################################
 
echo -e " -------------------------"
echo -e " 设置虚拟内存"
echo -e " -------------------------"
echo -e " 1、添加虚拟内存"
echo -e " 2、取消虚拟内存"
echo -e " 3、退出脚本"
echo -e " -------------------------"
 
read -p " 请输入要执行的操作:" num
case "$num" in
1)
	before_set_swap
	;;
2)
	unset_swap
	;;
3)
	exit
	;;
	
esac
 
############################################################
