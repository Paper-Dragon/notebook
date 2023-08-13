#!/bin/bash

#===============================#
#      linux服务器性能测试      #
#===============================#

# Check release
if [ -f /etc/redhat-release ]; then
    release="centos"
elif cat /etc/issue | grep -Eqi "debian"; then
    release="debian"
elif cat /etc/issue | grep -Eqi "ubuntu"; then
    release="ubuntu"
elif cat /etc/issue | grep -Eqi "centos|red hat|redhat"; then
    release="centos"
elif cat /proc/version | grep -Eqi "debian"; then
    release="debian"
elif cat /proc/version | grep -Eqi "ubuntu"; then
    release="ubuntu"
elif cat /proc/version | grep -Eqi "centos|red hat|redhat"; then
    release="centos"
fi


# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
SKYBLUE='\033[0;36m'
PLAIN='\033[0m'

rm -rf /tmp/report && mkdir /tmp/report

echo "正在安装必要的依赖，请耐心等待..."



# Install Virt-what
if  [ ! -e '/usr/sbin/virt-what' ]; then
    echo "Installing Virt-What......"
    if [ "${release}" == "centos" ]; then
        yum -y install virt-what > /dev/null 2>&1
    else
        apt-get update
        apt-get -y install virt-what > /dev/null 2>&1
    fi
fi

# Install uuid
echo "Installing uuid......"
if [ "${release}" == "centos" ]; then
    yum -y install uuid > /dev/null 2>&1
else
    apt-get -y install uuid > /dev/null 2>&1
fi


# Install curl
echo "Installing curl......"
if [ "${release}" == "centos" ]; then
    yum -y install curl > /dev/null 2>&1
else
    apt-get -y install curl > /dev/null 2>&1
fi

# Check Python
if  [ ! -e '/usr/bin/python' ]; then
    echo "Installing Python......"
    if [ "${release}" == "centos" ]; then
            yum update > /dev/null 2>&1
            yum -y install python
        else
            apt-get update > /dev/null 2>&1
            apt-get -y install python
    fi
fi

get_opsy() {
    [ -f /etc/redhat-release ] && awk '{print ($1,$3~/^[0-9]/?$3:$4)}' /etc/redhat-release && return
    [ -f /etc/os-release ] && awk -F'[= "]' '/PRETTY_NAME/{print $3,$4,$5}' /etc/os-release && return
    [ -f /etc/lsb-release ] && awk -F'[="]+' '/DESCRIPTION/{print $2}' /etc/lsb-release && return
}

next() {
    printf "%-74s\n" "-" | sed 's/\s/-/g'
}

io_test() {
    (LANG=C dd if=/dev/zero of=test_$$ bs=64k count=16k conv=fdatasync && rm -f test_$$ ) 2>&1 | awk -F, '{io=$NF} END { print io}' | sed 's/^[ \t]*//;s/[ \t]*$//'
}

calc_disk() {
    local total_size=0
    local array=$@
    for size in ${array[@]}
    do
        [ "${size}" == "0" ] && size_t=0 || size_t=`echo ${size:0:${#size}-1}`
        [ "`echo ${size:(-1)}`" == "K" ] && size=0
        [ "`echo ${size:(-1)}`" == "M" ] && size=$( awk 'BEGIN{printf "%.1f", '$size_t' / 1024}' )
        [ "`echo ${size:(-1)}`" == "T" ] && size=$( awk 'BEGIN{printf "%.1f", '$size_t' * 1024}' )
        [ "`echo ${size:(-1)}`" == "G" ] && size=${size_t}
        total_size=$( awk 'BEGIN{printf "%.1f", '$total_size' + '$size'}' )
    done
    echo ${total_size}
}

virt_check(){
	if [[ `virt-what` == "openvz" ]];then
		echo -e "${SKYBLUE}OVZ 虚拟架构${PLAIN}"
	elif [[ `virt-what` == "kvm" ]];then
		echo -e "${SKYBLUE}KVM 虚拟架构${PLAIN}"
	elif [[ `virt-what` == "vmware" ]];then
		echo -e "${SKYBLUE}VMware 虚拟架构${PLAIN}"
	elif [[ `virt-what` == "hyperv" ]];then
		echo -e "${SKYBLUE}Hyper-V 虚拟架构${PLAIN}"
	else
		echo -e "${SKYBLUE}未知 虚拟架构${PLAIN}"
	fi
}

cname=$( awk -F: '/model name/ {name=$2} END {print name}' /proc/cpuinfo | sed 's/^[ \t]*//;s/[ \t]*$//' )
cores=$( awk -F: '/model name/ {core++} END {print core}' /proc/cpuinfo )
freq=$( awk -F: '/cpu MHz/ {freq=$2} END {print freq}' /proc/cpuinfo | sed 's/^[ \t]*//;s/[ \t]*$//' )
tram=$( free -m | awk '/Mem/ {print $2}' )
uram=$( free -m | awk '/Mem/ {print $3}' )
swap=$( free -m | awk '/Swap/ {print $2}' )
uswap=$( free -m | awk '/Swap/ {print $3}' )
up=$( awk '{a=$1/86400;b=($1%86400)/3600;c=($1%3600)/60} {printf("%d 天, %d 时 %d 分\n",a,b,c)}' /proc/uptime )
load=$( w | head -1 | awk -F'load average:' '{print $2}' | sed 's/^[ \t]*//;s/[ \t]*$//' )
opsy=$( get_opsy )
arch=$( uname -m )
lbit=$( getconf LONG_BIT )
kern=$( uname -r )
disk_size1=($( LANG=C df -hPl | grep -wvE '\-|none|tmpfs|devtmpfs|by-uuid|chroot|Filesystem' | awk '{print $2}' ))
disk_size2=($( LANG=C df -hPl | grep -wvE '\-|none|tmpfs|devtmpfs|by-uuid|chroot|Filesystem' | awk '{print $3}' ))
disk_total_size=$( calc_disk ${disk_size1[@]} )
disk_used_size=$( calc_disk ${disk_size2[@]} )
IP=$(curl -s myip.ipip.net | awk -F ' ' '{print $2}' | awk -F '：' '{print $2}')
IPaddr=$(curl -s myip.ipip.net | awk -F '：' '{print $3}')
virt=$( virt_check )

next
echo -e "CPU 型号       : ${SKYBLUE}$cname${PLAIN}"
echo -e "CPU 核心数     : ${SKYBLUE}$cores 核${PLAIN}"
echo -e "CPU 频率       : ${SKYBLUE}$freq MHz${PLAIN}"
echo -e "硬盘大小       : ${SKYBLUE}$disk_total_size GB ($disk_used_size GB 已使用)${PLAIN}"
echo -e "内存大小       : ${SKYBLUE}$tram MB ($uram MB 已使用)${PLAIN}"
echo -e "SWAP大小       : ${SKYBLUE}$swap MB ($uswap MB 已使用)${PLAIN}"
echo -e "开机时长       : ${SKYBLUE}$up${PLAIN}"
echo -e "系统负载       : ${SKYBLUE}$load${PLAIN}"
echo -e "操作系统       : ${SKYBLUE}$opsy${PLAIN}"
echo -e "系统架构       : ${SKYBLUE}$arch ($lbit Bit)${PLAIN}"
echo -e "系统内核       : ${SKYBLUE}$kern${PLAIN}"
echo -e "服务器IP       : ${SKYBLUE}$IP${PLAIN}"
echo -e "机房位置       : ${SKYBLUE}$IPaddr${PLAIN}"
echo -e "虚拟化平台     : ${SKYBLUE}$virt${PLAIN}"

next
io1=$( io_test )
echo -e "硬盘I/O (第一次测试) : ${YELLOW}$io1${PLAIN}"
io2=$( io_test )
echo -e "硬盘I/O (第二次测试) : ${YELLOW}$io2${PLAIN}"
io3=$( io_test )
echo -e "硬盘I/O (第三次测试) : ${YELLOW}$io3${PLAIN}"
next
