#!/usr/bin/env bash

#===============================#
#      Bench服务器测试工具      #
#===============================#

# === 全局定义 =====================================

# 全局参数定义
WorkDir="/tmp/.Bench"
UA_Browser="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"
UA_Dalvik="Dalvik/2.1.0 (Linux; U; Android 9; ALP-AL00 Build/HUAWEIALP-AL00)"

# 字体颜色定义
Font_Black="\033[30m"
Font_Red="\033[31m"
Font_Green="\033[32m"
Font_Yellow="\033[33m"
Font_Blue="\033[34m"
Font_Purple="\033[35m"
Font_SkyBlue="\033[36m"
Font_White="\033[37m"
Font_Suffix="\033[0m"

# 消息提示定义
Msg_Info="${Font_Blue}[Info] ${Font_Suffix}"
Msg_Warning="${Font_Yellow}[Warning] ${Font_Suffix}"
Msg_Debug="${Font_Yellow}[Debug] ${Font_Suffix}"
Msg_Error="${Font_Red}[Error] ${Font_Suffix}"
Msg_Success="${Font_Green}[Success] ${Font_Suffix}"
Msg_Fail="${Font_Red}[Failed] ${Font_Suffix}"

# === 全局模块 =====================================

# Trap终止信号捕获
trap "Global_TrapSigExit_Sig1" 1
trap "Global_TrapSigExit_Sig2" 2
trap "Global_TrapSigExit_Sig3" 3
trap "Global_TrapSigExit_Sig15" 15

# Trap终止信号1 - 处理
Global_TrapSigExit_Sig1() {
    echo -e "\n\n${Msg_Error}Caught Signal SIGHUP, Exiting ...\n"
    Global_TrapSigExit_Action
    exit 1
}

# Trap终止信号2 - 处理 (Ctrl+C)
Global_TrapSigExit_Sig2() {
    echo -e "\n\n${Msg_Error}Caught Signal SIGINT (or Ctrl+C), Exiting ...\n"
    Global_TrapSigExit_Action
    exit 1
}

# Trap终止信号3 - 处理
Global_TrapSigExit_Sig3() {
    echo -e "\n\n${Msg_Error}Caught Signal SIGQUIT, Exiting ...\n"
    Global_TrapSigExit_Action
    exit 1
}

# Trap终止信号15 - 处理 (进程被杀)
Global_TrapSigExit_Sig15() {
    echo -e "\n\n${Msg_Error}Caught Signal SIGTERM, Exiting ...\n"
    Global_TrapSigExit_Action
    exit 1
}

# 新版JSON解析
PharseJSON() {
    # 使用方法: PharseJSON "要解析的原JSON文本" "要解析的键值"
    # Example: PharseJSON ""Value":"123456"" "Value" [返回结果: 123456]
    echo -n $1 | jq -r .$2
}

# 程序启动动作
Global_StartupInit_Action() {
    # 清理残留, 为新一次的运行做好准备
    echo -e "${Msg_Info}Initializing Running Enviorment, Please wait ..."
    rm -rf ${WorkDir}
    rm -rf /.tmp_Bench/
    mkdir ${WorkDir}/
    echo -e "${Msg_Info}Checking Dependency ..."
    Check_Virtwhat
    Check_JSONQuery
    Check_Speedtest
    Check_BestTrace
    Check_SysBench
}

# 程序结束动作
Global_Exit_Action() {
    rm -rf ${WorkDir}/
    rm -rf /.tmp_Bench/
}

# 捕获异常信号后的动作
Global_TrapSigExit_Action() {
    rm -rf ${WorkDir}
    rm -rf /.tmp_Bench/
}

# =============== SystemInfo模块 部分 ===============

SystemInfo_GetCPUInfo() {
    mkdir -p ${WorkDir}/data >/dev/null 2>&1
    cat /proc/cpuinfo >${WorkDir}/data/cpuinfo
    local ReadCPUInfo="cat ${WorkDir}/data/cpuinfo"
    Bench_Result_CPUModelName="$($ReadCPUInfo | awk -F ': ' '/model name/{print $2}' | sort -u)"
    local CPUFreqCount="$($ReadCPUInfo | awk -F ': ' '/cpu MHz/{print $2}' | sort -run | wc -l)"
    if [ "${CPUFreqCount}" -ge "2" ]; then
        local CPUFreqArray="$(cat /proc/cpuinfo | awk -F ': ' '/cpu MHz/{print $2}' | sort -run)"
        local CPUFreq_Min="$(echo "$CPUFreqArray" | grep -oE '[0-9]+.[0-9]{3}' | awk 'BEGIN {min = 2147483647} {if ($1+0 < min+0) min=$1} END {print min}')"
        local CPUFreq_Max="$(echo "$CPUFreqArray" | grep -oE '[0-9]+.[0-9]{3}' | awk 'BEGIN {max = 0} {if ($1+0 > max+0) max=$1} END {print max}')"
        Bench_Result_CPUFreqMinGHz="$(echo $CPUFreq_Min | awk '{printf "%.2f\n",$1/1000}')"
        Bench_Result_CPUFreqMaxGHz="$(echo $CPUFreq_Max | awk '{printf "%.2f\n",$1/1000}')"
        Flag_DymanicCPUFreqDetected="1"
    else
        Bench_Result_CPUFreqMHz="$($ReadCPUInfo | awk -F ': ' '/cpu MHz/{print $2}' | sort -u)"
        Bench_Result_CPUFreqGHz="$(echo $Bench_Result_CPUFreqMHz | awk '{printf "%.2f\n",$1/1000}')"
        Flag_DymanicCPUFreqDetected="0"
    fi
    Bench_Result_CPUCacheSize="$($ReadCPUInfo | awk -F ': ' '/cache size/{print $2}' | sort -u)"
    Bench_Result_CPUPhysicalNumber="$($ReadCPUInfo | awk -F ': ' '/physical id/{print $2}' | sort -u | wc -l)"
    Bench_Result_CPUCoreNumber="$($ReadCPUInfo | awk -F ': ' '/cpu cores/{print $2}' | sort -u)"
    Bench_Result_CPUThreadNumber="$($ReadCPUInfo | awk -F ': ' '/cores/{print $2}' | wc -l)"
    Bench_Result_CPUProcessorNumber="$($ReadCPUInfo | awk -F ': ' '/processor/{print $2}' | wc -l)"
    Bench_Result_CPUSiblingsNumber="$($ReadCPUInfo | awk -F ': ' '/siblings/{print $2}' | sort -u)"
    Bench_Result_CPUTotalCoreNumber="$($ReadCPUInfo | awk -F ': ' '/physical id/&&/0/{print $2}' | wc -l)"
    
    # 虚拟化能力检测
    SystemInfo_GetVirtType
    if [ "${Var_VirtType}" = "dedicated" ] || [ "${Var_VirtType}" = "wsl" ]; then
        Bench_Result_CPUIsPhysical="1"
        local VirtCheck="$(cat /proc/cpuinfo | grep -oE 'vmx|svm' | uniq)"
        if [ "${VirtCheck}" != "" ]; then
            Bench_Result_CPUVirtualization="1"
            local VirtualizationType="$(lscpu | awk /Virtualization:/'{print $2}')"
            Bench_Result_CPUVirtualizationType="${VirtualizationType}"
        else
            Bench_Result_CPUVirtualization="0"
        fi
    elif [ "${Var_VirtType}" = "kvm" ] || [ "${Var_VirtType}" = "hyperv" ] || [ "${Var_VirtType}" = "microsoft" ] || [ "${Var_VirtType}" = "vmware" ]; then
        Bench_Result_CPUIsPhysical="0"
        local VirtCheck="$(cat /proc/cpuinfo | grep -oE 'vmx|svm' | uniq)"
        if [ "${VirtCheck}" = "vmx" ] || [ "${VirtCheck}" = "svm" ]; then
            Bench_Result_CPUVirtualization="2"
            local VirtualizationType="$(lscpu | awk /Virtualization:/'{print $2}')"
            Bench_Result_CPUVirtualizationType="${VirtualizationType}"
        else
            Bench_Result_CPUVirtualization="0"
        fi        
    else
        Bench_Result_CPUIsPhysical="0"
    fi
}

SystemInfo_GetCPUStat() {
    local CPUStat_Result="$(top -bn1 | grep Cpu)"
    # 原始数据
    Bench_Result_CPUStat_user="$(Function_ReadCPUStat "${CPUStat_Result}" "us")"
    Bench_Result_CPUStat_system="$(Function_ReadCPUStat "${CPUStat_Result}" "sy")"
    Bench_Result_CPUStat_anice="$(Function_ReadCPUStat "${CPUStat_Result}" "ni")"
    Bench_Result_CPUStat_idle="$(Function_ReadCPUStat "${CPUStat_Result}" "id")"
    Bench_Result_CPUStat_iowait="$(Function_ReadCPUStat "${CPUStat_Result}" "wa")"
    Bench_Result_CPUStat_hardint="$(Function_ReadCPUStat "${CPUStat_Result}" "hi")"
    Bench_Result_CPUStat_softint="$(Function_ReadCPUStat "${CPUStat_Result}" "si")"
    Bench_Result_CPUStat_steal="$(Function_ReadCPUStat "${CPUStat_Result}" "st")"
    # 加工后的数据
    Bench_Result_CPUStat_UsedAll="$(echo ${Bench_Result_CPUStat_user} ${Bench_Result_CPUStat_system} ${Bench_Result_CPUStat_nice} | awk '{printf "%.1f\n",$1+$2+$3}')"
}

Function_ReadCPUStat() {
    if [ "$1" == "" ]; then
        echo -n "nil"
    else
        local result="$(echo $1 | grep -oE "[0-9]{1,2}.[0-9]{1} $2" | awk '{print $1}')"
        echo $result
    fi
}

SystemInfo_GetKernelVersion() {
    local version="$(uname -r)"
    Bench_Result_KernelVersion="${version}"
}

SystemInfo_GetNetworkCCMethod() {
    local val_cc="$(sysctl -n net.ipv4.tcp_congestion_control)"
    local val_qdisc="$(sysctl -n net.core.default_qdisc)"
    Bench_Result_NetworkCCMethod="${val_cc} + ${val_qdisc}"
}

SystemInfo_GetSystemBit() {
    local sysarch="$(uname -m)"
    if [ "${sysarch}" = "unknown" ] || [ "${sysarch}" = "" ]; then
        local sysarch="$(arch)"
    fi
    if [ "${sysarch}" = "x86_64" ]; then
        # X86平台 64位
        Bench_Result_SystemBit_Short="64"
        Bench_Result_SystemBit_Full="amd64"
    elif [ "${sysarch}" = "i386" ] || [ "${sysarch}" = "i686" ]; then
        # X86平台 32位
        Bench_Result_SystemBit_Short="32"
        Bench_Result_SystemBit_Full="i386"
    elif [ "${sysarch}" = "armv7l" ] || [ "${sysarch}" = "armv8" ] || [ "${sysarch}" = "armv8l" ] || [ "${sysarch}" = "aarch64" ]; then
        # ARM平台 暂且将32位/64位统一对待
        Bench_Result_SystemBit_Short="arm"
        Bench_Result_SystemBit_Full="arm"
    else
        Bench_Result_SystemBit_Short="unknown"
        Bench_Result_SystemBit_Full="unknown"                
    fi
}

SystemInfo_GetMemInfo() {
    mkdir -p ${WorkDir}/data >/dev/null 2>&1
    cat /proc/meminfo >${WorkDir}/data/meminfo
    local ReadMemInfo="cat ${WorkDir}/data/meminfo"
    # 获取总内存
    Bench_Result_MemoryTotal_KB="$($ReadMemInfo | awk '/MemTotal/{print $2}')"
    Bench_Result_MemoryTotal_MB="$(echo $Bench_Result_MemoryTotal_KB | awk '{printf "%.2f\n",$1/1024}')"
    Bench_Result_MemoryTotal_GB="$(echo $Bench_Result_MemoryTotal_KB | awk '{printf "%.2f\n",$1/1048576}')"
    # 获取可用内存
    local MemFree="$($ReadMemInfo | awk '/MemFree/{print $2}')"
    local Buffers="$($ReadMemInfo | awk '/Buffers/{print $2}')"
    local Cached="$($ReadMemInfo | awk '/Cached/{print $2}')"
    Bench_Result_MemoryFree_KB="$(echo $MemFree $Buffers $Cached | awk '{printf $1+$2+$3}')"
    Bench_Result_MemoryFree_MB="$(echo $Bench_Result_MemoryFree_KB | awk '{printf "%.2f\n",$1/1024}')"
    Bench_Result_MemoryFree_GB="$(echo $Bench_Result_MemoryFree_KB | awk '{printf "%.2f\n",$1/1048576}')"
    # 获取已用内存
    local MemUsed="$(echo $Bench_Result_MemoryTotal_KB $Bench_Result_MemoryFree_KB | awk '{printf $1-$2}')"
    Bench_Result_MemoryUsed_KB="$MemUsed"
    Bench_Result_MemoryUsed_MB="$(echo $Bench_Result_MemoryUsed_KB | awk '{printf "%.2f\n",$1/1024}')"
    Bench_Result_MemoryUsed_GB="$(echo $Bench_Result_MemoryUsed_KB | awk '{printf "%.2f\n",$1/1048576}')"
    # 获取Swap总量
    Bench_Result_SwapTotal_KB="$($ReadMemInfo | awk '/SwapTotal/{print $2}')"
    Bench_Result_SwapTotal_MB="$(echo $Bench_Result_SwapTotal_KB | awk '{printf "%.2f\n",$1/1024}')"
    Bench_Result_SwapTotal_GB="$(echo $Bench_Result_SwapTotal_KB | awk '{printf "%.2f\n",$1/1048576}')"
    # 获取可用Swap
    Bench_Result_SwapFree_KB="$($ReadMemInfo | awk '/SwapFree/{print $2}')"
    Bench_Result_SwapFree_MB="$(echo $Bench_Result_SwapFree_KB | awk '{printf "%.2f\n",$1/1024}')"
    Bench_Result_SwapFree_GB="$(echo $Bench_Result_SwapFree_KB | awk '{printf "%.2f\n",$1/1048576}')"
    # 获取已用Swap
    local SwapUsed="$(echo $Bench_Result_SwapTotal_KB $Bench_Result_SwapFree_KB | awk '{printf $1-$2}')"
    Bench_Result_SwapUsed_KB="$SwapUsed"
    Bench_Result_SwapUsed_MB="$(echo $Bench_Result_SwapUsed_KB | awk '{printf "%.2f\n",$1/1024}')"
    Bench_Result_SwapUsed_GB="$(echo $Bench_Result_SwapUsed_KB | awk '{printf "%.2f\n",$1/1048576}')"
}

SystemInfo_GetOSRelease() {
    if [ -f "/etc/centos-release" ]; then # CentOS
        Var_OSRelease="centos"
        local Var_OSReleaseFullName="$(cat /etc/os-release | awk -F '[= "]' '/PRETTY_NAME/{print $3,$4}')"
        if [ "$(rpm -qa | grep -o el6 | sort -u)" = "el6" ]; then
            Var_CentOSELRepoVersion="6"
            local Var_OSReleaseVersion="$(cat /etc/centos-release | awk '{print $3}')"
        elif [ "$(rpm -qa | grep -o el7 | sort -u)" = "el7" ]; then
            Var_CentOSELRepoVersion="7"
            local Var_OSReleaseVersion="$(cat /etc/centos-release | awk '{print $4}')"
        elif [ "$(rpm -qa | grep -o el8 | sort -u)" = "el8" ]; then
            Var_CentOSELRepoVersion="8"
            local Var_OSReleaseVersion="$(cat /etc/centos-release | awk '{print $4}')"
        else
            local Var_CentOSELRepoVersion="unknown"
            local Var_OSReleaseVersion="<Unknown Release>"
        fi
        local Var_OSReleaseArch="$(arch)"
        Bench_Result_OSReleaseFullName="$Var_OSReleaseFullName $Var_OSReleaseVersion ($Var_OSReleaseArch)"
    elif [ -f "/etc/redhat-release" ]; then # RedHat
        Var_OSRelease="rhel"
        local Var_OSReleaseFullName="$(cat /etc/os-release | awk -F '[= "]' '/PRETTY_NAME/{print $3,$4}')"
        if [ "$(rpm -qa | grep -o el6 | sort -u)" = "el6" ]; then
            Var_RedHatELRepoVersion="6"
            local Var_OSReleaseVersion="$(cat /etc/redhat-release | awk '{print $3}')"
        elif [ "$(rpm -qa | grep -o el7 | sort -u)" = "el7" ]; then
            Var_RedHatELRepoVersion="7"
            local Var_OSReleaseVersion="$(cat /etc/redhat-release | awk '{print $4}')"
        elif [ "$(rpm -qa | grep -o el8 | sort -u)" = "el8" ]; then
            Var_RedHatELRepoVersion="8"
            local Var_OSReleaseVersion="$(cat /etc/redhat-release | awk '{print $4}')"
        else
            local Var_RedHatELRepoVersion="unknown"
            local Var_OSReleaseVersion="<Unknown Release>"
        fi
        local Var_OSReleaseArch="$(arch)"
        Bench_Result_OSReleaseFullName="$Var_OSReleaseFullName $Var_OSReleaseVersion ($Var_OSReleaseArch)"
    elif [ -f "/etc/fedora-release" ]; then # Fedora
        Var_OSRelease="fedora"
        local Var_OSReleaseFullName="$(cat /etc/os-release | awk -F '[= "]' '/PRETTY_NAME/{print $3}')"
        local Var_OSReleaseVersion="$(cat /etc/fedora-release | awk '{print $3,$4,$5,$6,$7}')"
        local Var_OSReleaseArch="$(arch)"
        Bench_Result_OSReleaseFullName="$Var_OSReleaseFullName $Var_OSReleaseVersion ($Var_OSReleaseArch)"
    elif [ -f "/etc/lsb-release" ]; then # Ubuntu
        Var_OSRelease="ubuntu"
        local Var_OSReleaseFullName="$(cat /etc/os-release | awk -F '[= "]' '/NAME/{print $3}' | head -n1)"
        local Var_OSReleaseVersion="$(cat /etc/os-release | awk -F '[= "]' '/VERSION/{print $3,$4,$5,$6,$7}' | head -n1)"
        local Var_OSReleaseArch="$(arch)"
        Bench_Result_OSReleaseFullName="$Var_OSReleaseFullName $Var_OSReleaseVersion ($Var_OSReleaseArch)"
        Var_OSReleaseVersion_Short="$(cat /etc/lsb-release | awk -F '[= "]' '/DISTRIB_RELEASE/{print $2}')"
    elif [ -f "/etc/debian_version" ]; then # Debian
        Var_OSRelease="debian"
        local Var_OSReleaseFullName="$(cat /etc/os-release | awk -F '[= "]' '/PRETTY_NAME/{print $3,$4}')"
        local Var_OSReleaseVersion="$(cat /etc/debian_version | awk '{print $1}')"
        local Var_OSReleaseVersionShort="$(cat /etc/debian_version | awk '{printf "%d\n",$1}')"
        if [ "${Var_OSReleaseVersionShort}" = "7" ]; then
            Var_OSReleaseVersion_Short="7"
            Var_OSReleaseVersion_Codename="wheezy"
            local Var_OSReleaseFullName="${Var_OSReleaseFullName} \"Wheezy\""
        elif [ "${Var_OSReleaseVersionShort}" = "8" ]; then
            Var_OSReleaseVersion_Short="8"
            Var_OSReleaseVersion_Codename="jessie"
            local Var_OSReleaseFullName="${Var_OSReleaseFullName} \"Jessie\""
        elif [ "${Var_OSReleaseVersionShort}" = "9" ]; then
            Var_OSReleaseVersion_Short="9"
            Var_OSReleaseVersion_Codename="stretch"
            local Var_OSReleaseFullName="${Var_OSReleaseFullName} \"Stretch\""
        elif [ "${Var_OSReleaseVersionShort}" = "10" ]; then
            Var_OSReleaseVersion_Short="10"
            Var_OSReleaseVersion_Codename="buster"
            local Var_OSReleaseFullName="${Var_OSReleaseFullName} \"Buster\""
        else
            Var_OSReleaseVersion_Short="sid"
            Var_OSReleaseVersion_Codename="sid"
            local Var_OSReleaseFullName="${Var_OSReleaseFullName} \"Sid (Testing)\""
        fi
        local Var_OSReleaseArch="$(arch)"
        Bench_Result_OSReleaseFullName="$Var_OSReleaseFullName $Var_OSReleaseVersion ($Var_OSReleaseArch)"
    elif [ -f "/etc/alpine-release" ]; then # Alpine Linux
        Var_OSRelease="alpinelinux"
        local Var_OSReleaseFullName="$(cat /etc/os-release | awk -F '[= "]' '/NAME/{print $3,$4}' | head -n1)"
        local Var_OSReleaseVersion="$(cat /etc/alpine-release | awk '{print $1}')"
        local Var_OSReleaseArch="$(arch)"
        Bench_Result_OSReleaseFullName="$Var_OSReleaseFullName $Var_OSReleaseVersion ($Var_OSReleaseArch)"
    else
        Var_OSRelease="unknown" # 未知系统分支
        Bench_Result_OSReleaseFullName="[Error: Unknown Linux Branch !]"
    fi
}

SystemInfo_GetVirtType() {
    if [ -f "/usr/bin/systemd-detect-virt" ]; then
        Var_VirtType="$(/usr/bin/systemd-detect-virt)"
        # 虚拟机检测
        if [ "${Var_VirtType}" = "qemu" ]; then
            Bench_Result_VirtType="QEMU"
        elif [ "${Var_VirtType}" = "kvm" ]; then
            Bench_Result_VirtType="KVM"
        elif [ "${Var_VirtType}" = "zvm" ]; then
            Bench_Result_VirtType="S390 Z/VM"
        elif [ "${Var_VirtType}" = "vmware" ]; then
            Bench_Result_VirtType="VMware"
        elif [ "${Var_VirtType}" = "microsoft" ]; then
            Bench_Result_VirtType="Microsoft Hyper-V"
        elif [ "${Var_VirtType}" = "xen" ]; then
            Bench_Result_VirtType="Xen Hypervisor"
        elif [ "${Var_VirtType}" = "bochs" ]; then
            Bench_Result_VirtType="BOCHS"   
        elif [ "${Var_VirtType}" = "uml" ]; then
            Bench_Result_VirtType="User-mode Linux"   
        elif [ "${Var_VirtType}" = "parallels" ]; then
            Bench_Result_VirtType="Parallels"   
        elif [ "${Var_VirtType}" = "bhyve" ]; then
            Bench_Result_VirtType="FreeBSD Hypervisor"
        # 容器虚拟化检测
        elif [ "${Var_VirtType}" = "openvz" ]; then
            Bench_Result_VirtType="OpenVZ"
        elif [ "${Var_VirtType}" = "lxc" ]; then
            Bench_Result_VirtType="LXC"        
        elif [ "${Var_VirtType}" = "lxc-libvirt" ]; then
            Bench_Result_VirtType="LXC (libvirt)"        
        elif [ "${Var_VirtType}" = "systemd-nspawn" ]; then
            Bench_Result_VirtType="Systemd nspawn"        
        elif [ "${Var_VirtType}" = "docker" ]; then
            Bench_Result_VirtType="Docker"        
        elif [ "${Var_VirtType}" = "rkt" ]; then
            Bench_Result_VirtType="RKT"
        # 特殊处理
        elif [ -c "/dev/lxss" ]; then # 处理WSL虚拟化
            Var_VirtType="wsl"
            Bench_Result_VirtType="Windows Subsystem for Linux (WSL)"
        # 未匹配到任何结果, 或者非虚拟机 
        elif [ "${Var_VirtType}" = "none" ]; then
            Var_VirtType="dedicated"
            Bench_Result_VirtType="None"
            local Var_BIOSVendor="$(dmidecode -s bios-vendor)"
            if [ "${Var_BIOSVendor}" = "SeaBIOS" ]; then
                Var_VirtType="Unknown"
                Bench_Result_VirtType="Unknown with SeaBIOS BIOS"
            else
                Var_VirtType="dedicated"
                Bench_Result_VirtType="Dedicated with ${Var_BIOSVendor} BIOS"
            fi
        fi
    elif [ ! -f "/usr/sbin/virt-what" ]; then
        Var_VirtType="Unknown"
        Bench_Result_VirtType="[Error: virt-what not found !]"
    elif [ -f "/.dockerenv" ]; then # 处理Docker虚拟化
        Var_VirtType="docker"
        Bench_Result_VirtType="Docker"
    elif [ -c "/dev/lxss" ]; then # 处理WSL虚拟化
        Var_VirtType="wsl"
        Bench_Result_VirtType="Windows Subsystem for Linux (WSL)"
    else # 正常判断流程
        Var_VirtType="$(virt-what | xargs)"
        local Var_VirtTypeCount="$(echo $Var_VirtTypeCount | wc -l)"
        if [ "${Var_VirtTypeCount}" -gt "1" ]; then # 处理嵌套虚拟化
            Bench_Result_VirtType="echo ${Var_VirtType}"
            Var_VirtType="$(echo ${Var_VirtType} | head -n1)" # 使用检测到的第一种虚拟化继续做判断
        elif [ "${Var_VirtTypeCount}" -eq "1" ] && [ "${Var_VirtType}" != "" ]; then # 只有一种虚拟化
            Bench_Result_VirtType="${Var_VirtType}"
        else
            local Var_BIOSVendor="$(dmidecode -s bios-vendor)"
            if [ "${Var_BIOSVendor}" = "SeaBIOS" ]; then
                Var_VirtType="Unknown"
                Bench_Result_VirtType="Unknown with SeaBIOS BIOS"
            else
                Var_VirtType="dedicated"
                Bench_Result_VirtType="Dedicated with ${Var_BIOSVendor} BIOS"
            fi
        fi
    fi
}

SystemInfo_GetLoadAverage() {
    local Var_LoadAverage="$(cat /proc/loadavg)"
    Bench_Result_LoadAverage_1min="$(echo ${Var_LoadAverage} | awk '{print $1}')"
    Bench_Result_LoadAverage_5min="$(echo ${Var_LoadAverage} | awk '{print $2}')"
    Bench_Result_LoadAverage_15min="$(echo ${Var_LoadAverage} | awk '{print $3}')"
}

SystemInfo_GetUptime() {
    local ut="$(cat /proc/uptime | awk '{printf "%d\n",$1}')"
    local ut_day="$(echo $result | awk -v ut="$ut" '{printf "%d\n",ut/86400}')"
    local ut_hour="$(echo $result | awk -v ut="$ut" -v ut_day="$ut_day" '{printf "%d\n",(ut-(86400*ut_day))/3600}')"
    local ut_minute="$(echo $result | awk -v ut="$ut" -v ut_day="$ut_day" -v ut_hour="$ut_hour" '{printf "%d\n",(ut-(86400*ut_day)-(3600*ut_hour))/60}')"
    local ut_second="$(echo $result | awk -v ut="$ut" -v ut_day="$ut_day" -v ut_hour="$ut_hour" -v ut_minute="$ut_minute" '{printf "%d\n",(ut-(86400*ut_day)-(3600*ut_hour)-(60*ut_minute))}')"
    Bench_Result_SystemInfo_Uptime_Day="$ut_day"
    Bench_Result_SystemInfo_Uptime_Hour="$ut_hour"
    Bench_Result_SystemInfo_Uptime_Minute="$ut_minute"
    Bench_Result_SystemInfo_Uptime_Second="$ut_second"
}


SystemInfo_GetDiskStat() {
    Bench_Result_DiskRootPath="$(df -x tmpfs / | awk "NR>1" | sed ":a;N;s/\\n//g;ta" | awk '{print $1}')"
    local Var_DiskTotalSpace_KB="$(df -x tmpfs / | grep -oE "[0-9]{4,}" | awk 'NR==1 {print $1}')"
    Bench_Result_DiskTotal_KB="${Var_DiskTotalSpace_KB}"
    Bench_Result_DiskTotal_MB="$(echo ${Var_DiskTotalSpace_KB} | awk '{printf "%.2f\n",$1/1000}')"
    Bench_Result_DiskTotal_GB="$(echo ${Var_DiskTotalSpace_KB} | awk '{printf "%.2f\n",$1/1000000}')"
    Bench_Result_DiskTotal_TB="$(echo ${Var_DiskTotalSpace_KB} | awk '{printf "%.2f\n",$1/1000000000}')"
    local Var_DiskUsedSpace_KB="$(df -x tmpfs / | grep -oE "[0-9]{4,}" | awk 'NR==2 {print $1}')"
    Bench_Result_DiskUsed_KB="${Var_DiskUsedSpace_KB}"
    Bench_Result_DiskUsed_MB="$(echo ${Bench_Result_DiskUsed_KB} | awk '{printf "%.2f\n",$1/1000}')"
    Bench_Result_DiskUsed_GB="$(echo ${Bench_Result_DiskUsed_KB} | awk '{printf "%.2f\n",$1/1000000}')"
    Bench_Result_DiskUsed_TB="$(echo ${Bench_Result_DiskUsed_KB} | awk '{printf "%.2f\n",$1/1000000000}')"
    local Var_DiskFreeSpace_KB="$(df -x tmpfs / | grep -oE "[0-9]{4,}" | awk 'NR==3 {print $1}')"
    Bench_Result_DiskFree_KB="${Var_DiskFreeSpace_KB}"
    Bench_Result_DiskFree_MB="$(echo ${Bench_Result_DiskFree_KB} | awk '{printf "%.2f\n",$1/1000}')"
    Bench_Result_DiskFree_GB="$(echo ${Bench_Result_DiskFree_KB} | awk '{printf "%.2f\n",$1/1000000}')"
    Bench_Result_DiskFree_TB="$(echo ${Bench_Result_DiskFree_KB} | awk '{printf "%.2f\n",$1/1000000000}')"
}

SystemInfo_GetNetworkInfo() {
    local Result_IPV4="$(curl --connect-timeout 10 -A tianyu-bench -fsL4 https://api.ip.sb/geoip)"
    local Result_IPV6="$(curl --connect-timeout 10 -A tianyu-bench -fsL6 https://api.ip.sb/geoip)"
    if [ "${Result_IPV4}" != "" ] && [ "${Result_IPV6}" = "" ]; then
        Bench_Result_NetworkStat="ipv4only"
    elif [ "${Result_IPV4}" = "" ] && [ "${Result_IPV6}" != "" ]; then
        Bench_Result_NetworkStat="ipv6only"
    elif [ "${Result_IPV4}" != "" ] && [ "${Result_IPV6}" != "" ]; then
        Bench_Result_NetworkStat="dualstack"
    else
        Bench_Result_NetworkStat="unknown"
    fi
    if [ "${Bench_Result_NetworkStat}" = "ipv4only" ] || [ "${Bench_Result_NetworkStat}" = "dualstack" ]; then
        IPAPI_IPV4_ip="$(PharseJSON "${Result_IPV4}" "ip")"
        local IPAPI_IPV4_country_name="$(PharseJSON "${Result_IPV4}" "country")"
        local IPAPI_IPV4_region_name="$(PharseJSON "${Result_IPV4}" "region")"
        local IPAPI_IPV4_city_name="$(PharseJSON "${Result_IPV4}" "city")"
        IPAPI_IPV4_location="${IPAPI_IPV4_country_name} ${IPAPI_IPV4_region_name} ${IPAPI_IPV4_city_name}"
        IPAPI_IPV4_country_code="$(PharseJSON "${Result_IPV4}" "country_code")"
        IPAPI_IPV4_asn="$(PharseJSON "${Result_IPV4}" "asn")"
        IPAPI_IPV4_organization="$(PharseJSON "${Result_IPV4}" "organization")"
    fi
    if [ "${Bench_Result_NetworkStat}" = "ipv6only" ] || [ "${Bench_Result_NetworkStat}" = "dualstack" ]; then
        IPAPI_IPV6_ip="$(PharseJSON "${Result_IPV6}" "ip")"
        local IPAPI_IPV6_country_name="$(PharseJSON "${Result_IPV6}" "country")"
        local IPAPI_IPV6_region_name="$(PharseJSON "${Result_IPV6}" "region")"
        local IPAPI_IPV6_city_name="$(PharseJSON "${Result_IPV6}" "city")"
        IPAPI_IPV6_location="${IPAPI_IPV6_country_name} ${IPAPI_IPV6_region_name} ${IPAPI_IPV6_city_name}"
        IPAPI_IPV6_country_code="$(PharseJSON "${Result_IPV6}" "country_code")"
        IPAPI_IPV6_asn="$(PharseJSON "${Result_IPV6}" "asn")"
        IPAPI_IPV6_organization="$(PharseJSON "${Result_IPV6}" "organization")"
    fi
    if [ "${Bench_Result_NetworkStat}" = "unknown" ]; then
        IPAPI_IPV4_ip="-"
        IPAPI_IPV4_location="-"
        IPAPI_IPV4_country_code="-"
        IPAPI_IPV4_asn="-"
        IPAPI_IPV4_organization="-"
        IPAPI_IPV6_ip="-"
        IPAPI_IPV6_location="-"
        IPAPI_IPV6_country_code="-"
        IPAPI_IPV6_asn="-"
        IPAPI_IPV6_organization="-"
    fi
}

Function_GetSystemInfo() {
    echo -e "${Msg_Info}Collecting System Info ..."
    Check_Virtwhat
    echo -e "${Msg_Info}Collecting CPU Info ..."
    SystemInfo_GetCPUInfo
    SystemInfo_GetLoadAverage
    SystemInfo_GetSystemBit
    SystemInfo_GetCPUStat
    echo -e "${Msg_Info}Collecting Memory Info ..."
    SystemInfo_GetMemInfo
    echo -e "${Msg_Info}Collecting Virtualization Info ..."
    SystemInfo_GetVirtType
    echo -e "${Msg_Info}Collecting System Info ..."
    SystemInfo_GetUptime
    SystemInfo_GetKernelVersion
    echo -e "${Msg_Info}Collecting OS Release Info ..."
    SystemInfo_GetOSRelease
    echo -e "${Msg_Info}Collecting Disk Info ..."
    SystemInfo_GetDiskStat
    echo -e "${Msg_Info}Collecting Network Info ..."
    SystemInfo_GetNetworkCCMethod
    SystemInfo_GetNetworkInfo
    echo -e "${Msg_Info}Starting Test ..."
}

# 系统信息检测

Function_ShowSystemInfo() {
    echo -e "\n ${Font_Yellow}-> System Information${Font_Suffix}\n"
    if [ "${Var_OSReleaseVersion_Codename}" != "" ]; then
        echo -e " ${Font_Yellow}OS Release:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_OSReleaseFullName}${Font_Suffix}"
    else
        echo -e " ${Font_Yellow}OS Release:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_OSReleaseFullName}${Font_Suffix}"
    fi
    if [ "${Flag_DymanicCPUFreqDetected}" = "1" ]; then
        echo -e " ${Font_Yellow}CPU Model:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_CPUModelName}${Font_Suffix}  ${Font_White}${Bench_Result_CPUFreqMinGHz}~${Bench_Result_CPUFreqMaxGHz}${Font_Suffix}${Font_SkyBlue} GHz${Font_Suffix}"
    elif [ "${Flag_DymanicCPUFreqDetected}" = "0" ]; then
        echo -e " ${Font_Yellow}CPU Model:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_CPUModelName}  ${Bench_Result_CPUFreqGHz} GHz${Font_Suffix}"
    fi
    if [ "${Bench_Result_CPUCacheSize}" != "" ]; then
        echo -e " ${Font_Yellow}CPU Cache Size:${Font_Suffix}\t${Font_SkyBlue}${Bench_Result_CPUCacheSize}${Font_Suffix}"
    else
        echo -e " ${Font_Yellow}CPU Cache Size:${Font_Suffix}\t${Font_SkyBlue}None${Font_Suffix}"
    fi
    # CPU数量 分支判断
    if [ "${Bench_Result_CPUIsPhysical}" = "1" ]; then
        # 如果只存在1个物理CPU (单路物理服务器)
        if [ "${Bench_Result_CPUPhysicalNumber}" -eq "1" ]; then
            echo -e " ${Font_Yellow}CPU Number:${Font_Suffix}\t\t${Bench_Result_CPUPhysicalNumber} ${Font_SkyBlue}Physical CPU${Font_Suffix}, ${Bench_Result_CPUCoreNumber} ${Font_SkyBlue}Cores${Font_Suffix}, ${Bench_Result_CPUThreadNumber} ${Font_SkyBlue}Threads${Font_Suffix}"
        # 存在多个CPU, 继续深入分析检测 (多路物理服务器)
        elif [ "${Bench_Result_CPUPhysicalNumber}" -ge "2" ]; then
            echo -e " ${Font_Yellow}CPU Number:${Font_Suffix}\t\t${Bench_Result_CPUPhysicalNumber} ${Font_SkyBlue}Physical CPU(s)${Font_Suffix}, ${Bench_Result_CPUCoreNumber} ${Font_SkyBlue}Cores/CPU${Font_Suffix}, ${Bench_Result_CPUSiblingsNumber} ${Font_SkyBlue}Threads/CPU${Font_Suffix} (Total ${Font_SkyBlue}${Bench_Result_CPUTotalCoreNumber}${Font_Suffix} Cores, ${Font_SkyBlue}${Bench_Result_CPUProcessorNumber}${Font_Suffix} Threads)"
        # 针对树莓派等特殊情况做出检测优化
        elif [ "${Bench_Result_CPUThreadNumber}" = "0" ] && [ "${Bench_Result_CPUProcessorNumber} " -ge "1" ]; then
             echo -e " ${Font_Yellow}CPU Number:${Font_Suffix}\t\t${Bench_Result_CPUProcessorNumber} ${Font_SkyBlue}Cores${Font_Suffix}"
        fi
        if [ "${Bench_Result_CPUVirtualization}" = "1" ]; then
            echo -e " ${Font_Yellow}VirtReady:${Font_Suffix}\t\t${Font_SkyBlue}Yes${Font_Suffix} ${Font_SkyBlue}(Based on${Font_Suffix} ${Bench_Result_CPUVirtualizationType}${Font_SkyBlue})${Font_Suffix}"
        else
            echo -e " ${Font_Yellow}VirtReady:${Font_Suffix}\t\t${Font_SkyRed}No${Font_Suffix}"
        fi
    elif [ "${Var_VirtType}" = "openvz" ]; then
        echo -e " ${Font_Yellow}CPU Number:${Font_Suffix}\t\t${Bench_Result_CPUThreadNumber} ${Font_SkyBlue}vCPU${Font_Suffix} (${Bench_Result_CPUCoreNumber} ${Font_SkyBlue}Host Core/Thread${Font_Suffix})"
    else
        if [ "${Bench_Result_CPUVirtualization}" = "2" ]; then
            echo -e " ${Font_Yellow}CPU Number:${Font_Suffix}\t\t${Bench_Result_CPUThreadNumber} ${Font_SkyBlue}vCPU${Font_Suffix}"
            echo -e " ${Font_Yellow}VirtReady:${Font_Suffix}\t\t${Font_SkyBlue}Yes${Font_Suffix} ${Font_SkyBlue}(Nested Virtualization)${Font_Suffix}"
        else
            echo -e " ${Font_Yellow}CPU Number:${Font_Suffix}\t\t${Bench_Result_CPUThreadNumber} ${Font_SkyBlue}vCPU${Font_Suffix}"
        fi
    fi
    echo -e " ${Font_Yellow}Virt Type:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_VirtType}${Font_Suffix}"
    # 内存使用率 分支判断
    if [ "${Bench_Result_MemoryUsed_KB}" -lt "1024" ] && [ "${Bench_Result_MemoryTotal_KB}" -lt "1048576" ]; then
        Bench_Result_Memory="${Bench_Result_MemoryUsed_KB} KB / ${Bench_Result_MemoryTotal_MB} MB"
        echo -e " ${Font_Yellow}Memory Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_MemoryUsed_MB} KB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_MemoryTotal_MB} MB${Font_Suffix}"
    elif [ "${Bench_Result_MemoryUsed_KB}" -lt "1048576" ] && [ "${Bench_Result_MemoryTotal_KB}" -lt "1048576" ]; then
        Bench_Result_Memory="${Bench_Result_MemoryUsed_MB} MB / ${Bench_Result_MemoryTotal_MB} MB"
        echo -e " ${Font_Yellow}Memory Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_MemoryUsed_MB} MB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_MemoryTotal_MB} MB${Font_Suffix}"
    elif [ "${Bench_Result_MemoryUsed_KB}" -lt "1048576" ] && [ "${Bench_Result_MemoryTotal_KB}" -lt "1073741824" ]; then
        Bench_Result_Memory="${Bench_Result_MemoryUsed_MB} MB / ${Bench_Result_MemoryTotal_GB} GB"
        echo -e " ${Font_Yellow}Memory Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_MemoryUsed_MB} MB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_MemoryTotal_GB} GB${Font_Suffix}"
    else
        Bench_Result_Memory="${Bench_Result_MemoryUsed_GB} GB / ${Bench_Result_MemoryTotal_GB} GB"
        echo -e " ${Font_Yellow}Memory Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_MemoryUsed_GB} GB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_MemoryTotal_GB} GB${Font_Suffix}"
    fi
    # Swap使用率 分支判断
    if [ "${Bench_Result_SwapTotal_KB}" -eq "0" ]; then
        Bench_Result_Swap="[ No Swapfile / Swap partition ]"
        echo -e " ${Font_Yellow}Swap Usage:${Font_Suffix}\t\t${Font_SkyBlue}[ No Swapfile/Swap Partition ]${Font_Suffix}"
    elif [ "${Bench_Result_SwapUsed_KB}" -lt "1024" ] && [ "${Bench_Result_SwapTotal_KB}" -lt "1048576" ]; then
        Bench_Result_Swap="${Bench_Result_SwapUsed_KB} KB / ${Bench_Result_SwapTotal_MB} MB"
        echo -e " ${Font_Yellow}Swap Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_SwapUsed_KB} KB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_SwapTotal_MB} MB${Font_Suffix}"
    elif [ "${Bench_Result_SwapUsed_KB}" -lt "1024" ] && [ "${Bench_Result_SwapTotal_KB}" -lt "1073741824" ]; then
        Bench_Result_Swap="${Bench_Result_SwapUsed_KB} KB / ${Bench_Result_SwapTotal_GB} GB"
        echo -e " ${Font_Yellow}Swap Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_SwapUsed_KB} KB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_SwapTotal_GB} GB${Font_Suffix}"
    elif [ "${Bench_Result_SwapUsed_KB}" -lt "1048576" ] && [ "${Bench_Result_SwapTotal_KB}" -lt "1048576" ]; then
        Bench_Result_Swap="${Bench_Result_SwapUsed_MB} MB / ${Bench_Result_SwapTotal_MB} MB"
        echo -e " ${Font_Yellow}Swap Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_SwapUsed_MB} MB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_SwapTotal_MB} MB${Font_Suffix}"
    elif [ "${Bench_Result_SwapUsed_KB}" -lt "1048576" ] && [ "${Bench_Result_SwapTotal_KB}" -lt "1073741824" ]; then
        Bench_Result_Swap="${Bench_Result_SwapUsed_MB} MB / ${Bench_Result_SwapTotal_GB} GB"
        echo -e " ${Font_Yellow}Swap Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_SwapUsed_MB} MB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_SwapTotal_GB} GB${Font_Suffix}"
    else
        Bench_Result_Swap="${Bench_Result_SwapUsed_GB} GB / ${Bench_Result_SwapTotal_GB} GB"
        echo -e " ${Font_Yellow}Swap Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_SwapUsed_GB} GB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_SwapTotal_GB} GB${Font_Suffix}"
    fi
    # 启动磁盘
    echo -e " ${Font_Yellow}Boot Device:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_DiskRootPath}${Font_Suffix}"
    # 磁盘使用率 分支判断
    if [ "${Bench_Result_DiskUsed_KB}" -lt "1000000" ]; then
        Bench_Result_Disk="${Bench_Result_DiskUsed_MB} MB / ${Bench_Result_DiskTotal_MB} MB"
        echo -e " ${Font_Yellow}Disk Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_DiskUsed_MB} MB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_DiskTotal_MB} MB${Font_Suffix}"
    elif [ "${Bench_Result_DiskUsed_KB}" -lt "1000000" ] && [ "${Bench_Result_DiskTotal_KB}" -lt "1000000000" ]; then
        Bench_Result_Disk="${Bench_Result_DiskUsed_MB} MB / ${Bench_Result_DiskTotal_GB} GB"
        echo -e " ${Font_Yellow}Disk Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_DiskUsed_MB} MB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_DiskTotal_GB} GB${Font_Suffix}"
    elif [ "${Bench_Result_DiskUsed_KB}" -lt "1000000000" ] && [ "${Bench_Result_DiskTotal_KB}" -lt "1000000000" ]; then
        Bench_Result_Disk="${Bench_Result_DiskUsed_GB} GB / ${Bench_Result_DiskTotal_GB} GB"
        echo -e " ${Font_Yellow}Disk Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_DiskUsed_GB} GB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_DiskTotal_GB} GB${Font_Suffix}"
    elif [ "${Bench_Result_DiskUsed_KB}" -lt "1000000000" ] && [ "${Bench_Result_DiskTotal_KB}" -ge "1000000000" ]; then
        Bench_Result_Disk="${Bench_Result_DiskUsed_GB} GB / ${Bench_Result_DiskTotal_TB} TB"
        echo -e " ${Font_Yellow}Disk Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_DiskUsed_GB} GB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_DiskTotal_TB} TB${Font_Suffix}"
    else
        Bench_Result_Disk="${Bench_Result_DiskUsed_TB} TB / ${Bench_Result_DiskTotal_TB} TB"
        echo -e " ${Font_Yellow}Disk Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_DiskUsed_TB} TB${Font_Suffix} / ${Font_SkyBlue}${Bench_Result_DiskTotal_TB} TB${Font_Suffix}"
    fi
    # CPU状态
    echo -e " ${Font_Yellow}CPU Usage:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_CPUStat_UsedAll}% used${Font_Suffix}, ${Font_SkyBlue}${Bench_Result_CPUStat_iowait}% iowait${Font_Suffix}, ${Font_SkyBlue}${Bench_Result_CPUStat_steal}% steal${Font_Suffix}"
    # 系统负载
    echo -e " ${Font_Yellow}Load (1/5/15min):${Font_Suffix}\t${Font_SkyBlue}${Bench_Result_LoadAverage_1min} ${Bench_Result_LoadAverage_5min} ${Bench_Result_LoadAverage_15min} ${Font_Suffix}"
    # 系统开机时间
    echo -e " ${Font_Yellow}Uptime:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_SystemInfo_Uptime_Day} Days, ${Bench_Result_SystemInfo_Uptime_Hour} Hours, ${Bench_Result_SystemInfo_Uptime_Minute} Minutes, ${Bench_Result_SystemInfo_Uptime_Second} Seconds${Font_Suffix}"
    # 内核版本
    echo -e " ${Font_Yellow}Kernel Version:${Font_Suffix}\t${Font_SkyBlue}${Bench_Result_KernelVersion}${Font_Suffix}"
    # 网络拥塞控制方式
    echo -e " ${Font_Yellow}Network CC Method:${Font_Suffix}\t${Font_SkyBlue}${Bench_Result_NetworkCCMethod}${Font_Suffix}"
    # 执行完成, 标记FLAG
    Bench_Flag_FinishSystemInfo="1"
}

# IP地址查询检测

Function_ShowNetworkInfo() {
    echo -e "\n ${Font_Yellow}-> Network Infomation${Font_Suffix}\n"
    if [ "${Bench_Result_NetworkStat}" = "ipv4only" ] || [ "${Bench_Result_NetworkStat}" = "dualstack" ]; then
        if [ "${IPAPI_IPV4_ip}" != "" ]; then
            echo -e " ${Font_Yellow}IPV4 - IP Address:${Font_Suffix}\t${Font_SkyBlue}[${IPAPI_IPV4_country_code}] ${IPAPI_IPV4_ip}${Font_Suffix}"
            echo -e " ${Font_Yellow}IPV4 - ASN Info:${Font_Suffix}\t${Font_SkyBlue}AS${IPAPI_IPV4_asn} (${IPAPI_IPV4_organization})${Font_Suffix}"
            echo -e " ${Font_Yellow}IPV4 - Region:${Font_Suffix}\t\t${Font_SkyBlue}${IPAPI_IPV4_location}${Font_Suffix}"
        else
            echo -e " ${Font_Yellow}IPV6 - IP Address:${Font_Suffix}\t${Font_Red}Error: API Query Failed${Font_Suffix}"
        fi
    fi
    if [ "${Bench_Result_NetworkStat}" = "ipv6only" ] || [ "${Bench_Result_NetworkStat}" = "dualstack" ]; then
        if [ "${IPAPI_IPV6_ip}" != "" ]; then
            echo -e " ${Font_Yellow}IPV6 - IP Address:${Font_Suffix}\t${Font_SkyBlue}[${IPAPI_IPV6_country_code}] ${IPAPI_IPV6_ip}${Font_Suffix}"
            echo -e " ${Font_Yellow}IPV6 - ASN Info:${Font_Suffix}\t${Font_SkyBlue}AS${IPAPI_IPV6_asn} (${IPAPI_IPV6_organization})${Font_Suffix}"
            echo -e " ${Font_Yellow}IPV6 - Region:${Font_Suffix}\t\t${Font_SkyBlue}${IPAPI_IPV6_location}${Font_Suffix}"
        else
            echo -e " ${Font_Yellow}IPV6 - IP Address:${Font_Suffix}\t${Font_Red}Error: API Query Failed${Font_Suffix}"
        fi
    fi
    # 执行完成, 标记FLAG
    Bench_Flag_FinishNetworkInfo="1"
}

# =============== Speedtest 部分 ===============
Run_Speedtest() {
    # 调用方式: Run_Speedtest "服务器ID" "节点名称(用于显示)"
    sleep 1
    # 超时时间, 防止Speedtest卡死
    local timeout_sec="60"
    echo -n -e " $2\t\t->\c"
    mkdir -p ${WorkDir}/result/speedtest/ >/dev/null 2>&1
    if [ "$1" = "default" ]; then
        local result="$(timeout ${timeout_sec} /usr/local/Bench/bin/speedtest --accept-license --accept-gdpr --format=json --unit=MiB/s --progress=no 2>/dev/null || echo "Error-TimeoutExceeded")"
    elif [ "$1" = "" ]; then
        echo -n -e "\r $2\t\t${Font_Red}Fail: Invalid Speedtest Server (No servers defined)${Font_Suffix}\n"
        echo -e " $2\t\tFail: Invalid Speedtest Server (No servers defined)" >>${WorkDir}/Speedtest/result.txt
    else
        local result="$(timeout ${timeout_sec} /usr/local/Bench/bin/speedtest --accept-license --accept-gdpr --format=json --unit=MiB/s --progress=no --server-id $1 2>/dev/null || echo "Error-TimeoutExceeded")"
    fi
    if [ "${result}" = "Error-TimeoutExceeded" ]; then
        echo -n -e "\r $2\t\t${Font_Red}Fail: Timeout Exceeded after ${timeout_sec} seconds${Font_Suffix}\n"
        echo -e " $2\t\tFail: Timeout Exceeded after ${timeout_sec} seconds" >>${WorkDir}/Speedtest/result.txt
    else
        # 处理结果
        local getresultid="$(echo $result | jq -r .result.id 2>/dev/null | grep -v null)"
        if [ "${getresultid}" != "" ]; then
            # 上传速度 (Raw Data, 单位: bytes)
            local rr_upload_bandwidth="$(echo $result | jq -r .upload.bandwidth 2>/dev/null)"
            # 下载速度 (Raw Data, 单位: bytes)
            local rr_download_bandwidth="$(echo $result | jq -r .download.bandwidth 2>/dev/null)"
            # Ping 延迟 (Raw Data, 单位: ms)
            local rr_ping_latency="$(echo $result | jq -r .ping.latency 2>/dev/null)"
             # 获取测速节点名称
            local rr_server_name="$(echo $result | jq -r .server.name 2>/dev/null)"
            local rr_server_country="$(echo $result | jq -r .server.country 2>/dev/null)"
            local rr_server_location="$(echo $result | jq -r .server.location 2>/dev/null)"
            # 处理上传速度与下载速度，从B/s转换成MB/s
            local fr_upload_bandwidth="$(echo $rr_upload_bandwidth | awk '{printf"%.2f",$1/1024/1024}')"
            local fr_download_bandwidth="$(echo $rr_download_bandwidth | awk '{printf"%.2f",$1/1024/1024}')"
            # 处理Ping值数据，如果大于1000，只输出整位，否则保留两位小数
            local fr_ping_latency="$(echo $rr_ping_latency | awk '{if($1>=1000){printf"%d",$1}else{printf"%.2f",$1}}')"
            # 合并测速节点名称信息
            local fr_server_name="$rr_server_name ($rr_server_country $rr_server_location)"
            # 输出结果
            local test_latency_charlength="$(echo "$fr_ping_latency ms" | grep -oE "\b[0-9]{1}\.[0-9]{2} ms" >/dev/null && echo "0" || echo "1")"
            if [ "$test_latency_charlength" = "0" ]; then
                echo -n -e "\r $2\t\t${Font_SkyBlue}${fr_upload_bandwidth}${Font_Suffix} MB/s\t${Font_SkyBlue}${fr_download_bandwidth}${Font_Suffix} MB/s\t${Font_SkyBlue}${fr_ping_latency}${Font_Suffix} ms\t\t${Font_SkyBlue}${fr_server_name}${Font_Suffix}\n"
                echo -e " $2\t\t${fr_upload_bandwidth} MB/s\t${fr_download_bandwidth} MB/s\t${fr_ping_latency} ms\t\t${fr_server_name}" >>${WorkDir}/Speedtest/result.txt
            else
                echo -n -e "\r $2\t\t${Font_SkyBlue}${fr_upload_bandwidth}${Font_Suffix} MB/s\t${Font_SkyBlue}${fr_download_bandwidth}${Font_Suffix} MB/s\t${Font_SkyBlue}${fr_ping_latency}${Font_Suffix} ms\t${Font_SkyBlue}${fr_server_name}${Font_Suffix}\n"
                echo -e " $2\t\t${fr_upload_bandwidth} MB/s\t${fr_download_bandwidth} MB/s\t${fr_ping_latency} ms\t${fr_server_name}" >>${WorkDir}/Speedtest/result.txt
            fi
        else
            local getlevel="$(echo $result | jq -r .level 2>/dev/null)"
            if [ "${getlevel}" = "error" ]; then
                local getmessage="$(echo $result | jq -r .message 2>/dev/null)"
                echo -n -e "\r $2\t\t${Font_Red}Fail: ${getmessage}${Font_Suffix}\n"
                echo -e " $2\t\tFail: ${getmessage}" >>${WorkDir}/Speedtest/result.txt
            else
                local geterror="$(echo $result | jq -r .error 2>/dev/null)"
                if [ "${geterror}" != "null" ]; then
                    echo -n -e "\r $2\t\t${Font_Red}Fail: ${geterror}${Font_Suffix}\n"
                    echo -e " $2\t\tFail: ${geterror}" >>${WorkDir}/Speedtest/result.txt
                else
                    echo -n -e "\r $2\t\t${Font_Red}Fail: ${result}${Font_Suffix}\n"
                    echo -e " $2\t\tFail: ${result}" >>${WorkDir}/Speedtest/result.txt
                fi
            fi
        fi      
    fi
}

#Speedtest节点api
#https://www.speedtest.net/api/js/servers?search=China
Function_Speedtest_Fast() {
    mkdir -p ${WorkDir}/Speedtest/ >/dev/null 2>&1
    echo -e "\n ${Font_Yellow}-> Network Speed Test${Font_Suffix}\n"
    echo -e "\n -> Network Speed Test\n" >>${WorkDir}/Speedtest/result.txt
    Check_JSONQuery
    Check_Speedtest
    echo -e " ${Font_Yellow}Node Name\t\t\tUpload Speed\tDownload Speed\tPing Latency\tServer Name${Font_Suffix}"
    echo -e " Node Name\t\t\tUpload Speed\tDownload Speed\tPing Latency\tServer Name" >>${WorkDir}/Speedtest/result.txt
    # 默认测试
    Run_Speedtest "default" "Speedtest Default"
    # 国内测试 - 移动组
    Run_Speedtest "4575" "China Sichuan CM"
    Run_Speedtest "16398" "China Guizhou CM"
    Run_Speedtest "25858" "China Beijing CM"
    # 国内测试 - 联通组
    Run_Speedtest "13704" "China Nanjing CU"
    Run_Speedtest "24447" "China Shanghai CU"
    Run_Speedtest "36646" "China Zhengzhou CU"
    # 国内测试 - 电信组
    Run_Speedtest "3633" "China Shanghai CT"
    Run_Speedtest "3973" "China Lanzhou CT"
    Run_Speedtest "5396" "China Jiangsu CT"
    # 执行完成, 标记FLAG
    Bench_Flag_FinishSpeedtestFull="1"
    sleep 1
}

# =============== 磁盘测试 部分 ===============
Run_DiskTest_DD() {
    # 调用方式: Run_DiskTest_DD "测试文件名" "块大小" "写入次数" "测试项目名称"
    mkdir -p ${WorkDir}/DiskTest/ >/dev/null 2>&1
    SystemInfo_GetVirtType
    mkdir -p /.tmp_Bench/DiskTest >/dev/null 2>&1
    mkdir -p ${WorkDir}/data >/dev/null 2>&1
    local Var_DiskTestResultFile="${WorkDir}/data/disktest_result"
    # 将先测试读, 后测试写
    echo -n -e " $4\t\t->\c"
    # 清理缓存, 避免影响测试结果
    sync
    if [ "${Var_VirtType}" != "docker" ] && [ "${Var_VirtType}" != "openvz" ] && [ "${Var_VirtType}" != "lxc" ] && [ "${Var_VirtType}" != "wsl" ]; then
        echo 3 >/proc/sys/vm/drop_caches
    fi
    # 避免磁盘压力过高, 启动测试前暂停1s
    sleep 1
    # 正式写测试
    dd if=/dev/zero of=/.tmp_Bench/DiskTest/$1 bs=$2 count=$3 oflag=direct 2>${Var_DiskTestResultFile}
    local DiskTest_WriteSpeed_ResultRAW="$(cat ${Var_DiskTestResultFile} | grep -oE "[0-9]{1,4} kB\/s|[0-9]{1,4}.[0-9]{1,2} kB\/s|[0-9]{1,4} KB\/s|[0-9]{1,4}.[0-9]{1,2} KB\/s|[0-9]{1,4} MB\/s|[0-9]{1,4}.[0-9]{1,2} MB\/s|[0-9]{1,4} GB\/s|[0-9]{1,4}.[0-9]{1,2} GB\/s|[0-9]{1,4} TB\/s|[0-9]{1,4}.[0-9]{1,2} TB\/s|[0-9]{1,4} kB\/秒|[0-9]{1,4}.[0-9]{1,2} kB\/秒|[0-9]{1,4} KB\/秒|[0-9]{1,4}.[0-9]{1,2} KB\/秒|[0-9]{1,4} MB\/秒|[0-9]{1,4}.[0-9]{1,2} MB\/秒|[0-9]{1,4} GB\/秒|[0-9]{1,4}.[0-9]{1,2} GB\/秒|[0-9]{1,4} TB\/秒|[0-9]{1,4}.[0-9]{1,2} TB\/秒")"
    DiskTest_WriteSpeed="$(echo "${DiskTest_WriteSpeed_ResultRAW}" | sed "s/秒/s/")"
    local DiskTest_WriteTime_ResultRAW="$(cat ${Var_DiskTestResultFile} | grep -oE "[0-9]{1,}.[0-9]{1,} s|[0-9]{1,}.[0-9]{1,} s|[0-9]{1,}.[0-9]{1,} 秒|[0-9]{1,}.[0-9]{1,} 秒")"
    DiskTest_WriteTime="$(echo ${DiskTest_WriteTime_ResultRAW} | awk '{print $1}')"
    DiskTest_WriteIOPS="$(echo ${DiskTest_WriteTime} $3 | awk '{printf "%d\n",$2/$1}')"
    DiskTest_WritePastTime="$(echo ${DiskTest_WriteTime} | awk '{printf "%.2f\n",$1}')"
    if [ "${DiskTest_WriteIOPS}" -ge "10000" ]; then
        DiskTest_WriteIOPS="$(echo ${DiskTest_WriteIOPS} 1000 | awk '{printf "%.2f\n",$2/$1}')"
        echo -n -e "\r $4\t\t${Font_SkyBlue}${DiskTest_WriteSpeed} (${DiskTest_WriteIOPS}K IOPS, ${DiskTest_WritePastTime}s)${Font_Suffix}\t\t->\c"
    else
        echo -n -e "\r $4\t\t${Font_SkyBlue}${DiskTest_WriteSpeed} (${DiskTest_WriteIOPS} IOPS, ${DiskTest_WritePastTime}s)${Font_Suffix}\t\t->\c"
    fi
    # 清理结果文件, 准备下一次测试
    rm -f ${Var_DiskTestResultFile}
    # 清理缓存, 避免影响测试结果
    sync
    if [ "${Var_VirtType}" != "docker" ] && [ "${Var_VirtType}" != "wsl" ]; then
        echo 3 >/proc/sys/vm/drop_caches
    fi
    sleep 0.5
    # 正式读测试
    dd if=/.tmp_Bench/DiskTest/$1 of=/dev/null bs=$2 count=$3 iflag=direct 2>${Var_DiskTestResultFile}
    local DiskTest_ReadSpeed_ResultRAW="$(cat ${Var_DiskTestResultFile} | grep -oE "[0-9]{1,4} kB\/s|[0-9]{1,4}.[0-9]{1,2} kB\/s|[0-9]{1,4} KB\/s|[0-9]{1,4}.[0-9]{1,2} KB\/s|[0-9]{1,4} MB\/s|[0-9]{1,4}.[0-9]{1,2} MB\/s|[0-9]{1,4} GB\/s|[0-9]{1,4}.[0-9]{1,2} GB\/s|[0-9]{1,4} TB\/s|[0-9]{1,4}.[0-9]{1,2} TB\/s|[0-9]{1,4} kB\/秒|[0-9]{1,4}.[0-9]{1,2} kB\/秒|[0-9]{1,4} KB\/秒|[0-9]{1,4}.[0-9]{1,2} KB\/秒|[0-9]{1,4} MB\/秒|[0-9]{1,4}.[0-9]{1,2} MB\/秒|[0-9]{1,4} GB\/秒|[0-9]{1,4}.[0-9]{1,2} GB\/秒|[0-9]{1,4} TB\/秒|[0-9]{1,4}.[0-9]{1,2} TB\/秒")"
    DiskTest_ReadSpeed="$(echo "${DiskTest_ReadSpeed_ResultRAW}" | sed "s/秒/s/")"
    local DiskTest_ReadTime_ResultRAW="$(cat ${Var_DiskTestResultFile} | grep -oE "[0-9]{1,}.[0-9]{1,} s|[0-9]{1,}.[0-9]{1,} s|[0-9]{1,}.[0-9]{1,} 秒|[0-9]{1,}.[0-9]{1,} 秒")"
    DiskTest_ReadTime="$(echo ${DiskTest_ReadTime_ResultRAW} | awk '{print $1}')"
    DiskTest_ReadIOPS="$(echo ${DiskTest_ReadTime} $3 | awk '{printf "%d\n",$2/$1}')"
    DiskTest_ReadPastTime="$(echo ${DiskTest_ReadTime} | awk '{printf "%.2f\n",$1}')"
    rm -f ${Var_DiskTestResultFile}
    # 输出结果
    echo -n -e "\r $4\t\t${Font_SkyBlue}${DiskTest_WriteSpeed} (${DiskTest_WriteIOPS} IOPS, ${DiskTest_WritePastTime}s)${Font_Suffix}\t\t${Font_SkyBlue}${DiskTest_ReadSpeed} (${DiskTest_ReadIOPS} IOPS, ${DiskTest_ReadPastTime}s)${Font_Suffix}\n"
    echo -e " $4\t\t${DiskTest_WriteSpeed} (${DiskTest_WriteIOPS} IOPS, ${DiskTest_WritePastTime} s)\t\t${DiskTest_ReadSpeed} (${DiskTest_ReadIOPS} IOPS, ${DiskTest_ReadPastTime} s)" >>${WorkDir}/DiskTest/result.txt
    rm -rf /.tmp_Bench/DiskTest/
}

Function_DiskTest_Fast() {
    mkdir -p ${WorkDir}/DiskTest/ >/dev/null 2>&1
    echo -e "\n ${Font_Yellow}-> Disk Speed Test ${Font_Suffix}\n"
    echo -e "\n -> Disk Speed Test (4K Block/1M Block, Direct Mode)\n" >>${WorkDir}/DiskTest/result.txt
    SystemInfo_GetVirtType
    SystemInfo_GetOSRelease
    if [ "${Var_VirtType}" = "docker" ] || [ "${Var_VirtType}" = "wsl" ]; then
        echo -e " ${Msg_Warning}Due to virt architecture limit, the result may affect by the cache !\n"
    fi
    echo -e " ${Font_Yellow}Test Name\t\tWrite Speed\t\t\t\tRead Speed${Font_Suffix}"
    echo -e " Test Name\t\tWrite Speed\t\t\t\tRead Speed" >>${WorkDir}/DiskTest/result.txt
    Run_DiskTest_DD "100MB.test" "4k" "25600" "100MB-4K Block"
    Run_DiskTest_DD "1GB.test" "1M" "1000" "1GB-1M Block"
    # 执行完成, 标记FLAG
    Bench_Flag_FinishDiskTestFast="1"
    sleep 1
}

# =============== SysBench - CPU性能 部分 ===============
Run_SysBench_CPU() {
    # 调用方式: Run_SysBench_CPU "线程数" "测试时长(s)" "测试遍数" "说明"
    # 变量初始化
    mkdir -p ${WorkDir}/SysBench/CPU/ >/dev/null 2>&1
    maxtestcount="$3"
    local count="1"
    local TestScore="0"
    local TotalScore="0"
    # 运行测试
    while [ $count -le $maxtestcount ]; do
        echo -e "\r ${Font_Yellow}$4: ${Font_Suffix}\t\t$count/$maxtestcount \c"
        local TestResult="$(sysbench --test=cpu --num-threads=$1 --cpu-max-prime=10000 --max-requests=1000000 --max-time=$2 run 2>&1)"
        local TestScore="$(echo ${TestResult} | grep -oE "events per second: [0-9]+" | grep -oE "[0-9]+")"
        local TotalScore="$(echo "${TotalScore} ${TestScore}" | awk '{printf "%d",$1+$2}')"
        let count=count+1
        local TestResult=""
        local TestScore="0"
    done
    local ResultScore="$(echo "${TotalScore} ${maxtestcount}" | awk '{printf "%d",$1/$2}')"
    if [ "$1" = "1" ]; then
        echo -e "\r ${Font_Yellow}$4: ${Font_Suffix}\t\t${Font_SkyBlue}${ResultScore}${Font_Suffix} ${Font_Yellow}Scores${Font_Suffix}"
        echo -e " $4:\t\t\t${ResultScore} Scores" >>${WorkDir}/SysBench/CPU/result.txt
    elif [ "$1" -ge "2" ]; then
        echo -e "\r ${Font_Yellow}$4: ${Font_Suffix}\t\t${Font_SkyBlue}${ResultScore}${Font_Suffix} ${Font_Yellow}Scores${Font_Suffix}"
        echo -e " $4:\t\t${ResultScore} Scores" >>${WorkDir}/SysBench/CPU/result.txt
    fi
}

Function_SysBench_CPU_Fast() {
    mkdir -p ${WorkDir}/SysBench/CPU/ >/dev/null 2>&1
    echo -e "\n ${Font_Yellow}-> CPU Performance Test ${Font_Suffix}\n"
    echo -e "\n -> CPU Performance Test \n" >>${WorkDir}/SysBench/CPU/result.txt
    Run_SysBench_CPU "1" "5" "1" "1 Thread Test"
    if [ "${Bench_Result_CPUThreadNumber}" -ge "2" ]; then
        Run_SysBench_CPU "${Bench_Result_CPUThreadNumber}" "5" "1" "${Bench_Result_CPUThreadNumber} Threads Test"
    elif [ "${Bench_Result_CPUProcessorNumber}" -ge "2" ]; then
        Run_SysBench_CPU "${Bench_Result_CPUProcessorNumber}" "5" "1" "${Bench_Result_CPUProcessorNumber} Threads Test"
    fi
    # 完成FLAG
    Bench_Flag_FinishSysBenchCPUFast="1"
}

# =============== SysBench - 内存性能 部分 ===============
Run_SysBench_Memory() {
    # 调用方式: Run_SysBench_Memory "线程数" "测试时长(s)" "测试遍数" "测试模式(读/写)" "读写方式(顺序/随机)" "说明"
    # 变量初始化
    mkdir -p ${WorkDir}/SysBench/Memory/ >/dev/null 2>&1
    maxtestcount="$3"
    local count="1"
    local TestScore="0.00"
    local TestSpeed="0.00"
    local TotalScore="0.00"
    local TotalSpeed="0.00"
    if [ "$1" -ge "2" ]; then
        MultiThread_Flag="1"
    else
        MultiThread_Flag="0"
    fi
    # 运行测试
    while [ $count -le $maxtestcount ]; do
        if [ "$1" -ge "2" ] && [ "$4" = "write" ]; then
            echo -e "\r ${Font_Yellow}$6:${Font_Suffix}\t$count/$maxtestcount \c"
        else
            echo -e "\r ${Font_Yellow}$6:${Font_Suffix}\t\t$count/$maxtestcount \c"
        fi
        local TestResult="$(sysbench --test=memory --num-threads=$1 --memory-block-size=1M --memory-total-size=102400G --memory-oper=$4 --max-time=$2 --memory-access-mode=$5 run 2>&1)"
        # 判断是MB还是MiB
        echo "${TestResult}" | grep -oE "MiB" >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            local MiB_Flag="1"
        else
            local MiB_Flag="0"
        fi
        local TestScore="$(echo "${TestResult}" | grep -oE "[0-9]{1,}.[0-9]{1,2} ops\/sec|[0-9]{1,}.[0-9]{1,2} per second" | grep -oE "[0-9]{1,}.[0-9]{1,2}")"
        local TestSpeed="$(echo "${TestResult}" | grep -oE "[0-9]{1,}.[0-9]{1,2} MB\/sec|[0-9]{1,}.[0-9]{1,2} MiB\/sec" | grep -oE "[0-9]{1,}.[0-9]{1,2}")"
        local TotalScore="$(echo "${TotalScore} ${TestScore}" | awk '{printf "%.2f",$1+$2}')"
        local TotalSpeed="$(echo "${TotalSpeed} ${TestSpeed}" | awk '{printf "%.2f",$1+$2}')"
        let count=count+1
        local TestResult=""
        local TestScore="0.00"
        local TestSpeed="0.00"
    done
    ResultScore="$(echo "${TotalScore} ${maxtestcount} 1000" | awk '{printf "%.2f",$1/$2/$3}')"
    if [ "${MiB_Flag}" = "1" ]; then
        # MiB to MB
        ResultSpeed="$(echo "${TotalSpeed} ${maxtestcount} 1048576‬ 1000000" | awk '{printf "%.2f",$1/$2/$3*$4}')"
    else
        # 直接输出
        ResultSpeed="$(echo "${TotalSpeed} ${maxtestcount}" | awk '{printf "%.2f",$1/$2}')"
    fi
    # 1线程的测试结果写入临时变量，方便与后续的多线程变量做对比
    if [ "$1" = "1" ] && [ "$4" = "read" ]; then
        Bench_Result_MemoryReadSpeedSingle="${ResultSpeed}"
    elif [ "$1" = "1" ] &&[ "$4" = "write" ]; then
        Bench_Result_MemoryWriteSpeedSingle="${ResultSpeed}"
    fi
    if [ "${MultiThread_Flag}" = "1" ]; then
        # 如果是多线程测试，输出与1线程测试对比的倍率
        if [ "$1" -ge "2" ] && [ "$4" = "read" ]; then
            Bench_Result_MemoryReadSpeedMulti="${ResultSpeed}"
            local readmultiple="$(echo "${Bench_Result_MemoryReadSpeedMulti} ${Bench_Result_MemoryReadSpeedSingle}" | awk '{printf "%.2f", $1/$2}')"
            echo -e "\r ${Font_Yellow}$6:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_MemoryReadSpeedMulti}${Font_Suffix} ${Font_Yellow}MB/s${Font_Suffix} (${readmultiple} x)"
        elif [ "$1" -ge "2" ] && [ "$4" = "write" ]; then
            Bench_Result_MemoryWriteSpeedMulti="${ResultSpeed}"
            local writemultiple="$(echo "${Bench_Result_MemoryWriteSpeedMulti} ${Bench_Result_MemoryWriteSpeedSingle}" | awk '{printf "%.2f", $1/$2}')"
            echo -e "\r ${Font_Yellow}$6:${Font_Suffix}\t\t${Font_SkyBlue}${Bench_Result_MemoryWriteSpeedMulti}${Font_Suffix} ${Font_Yellow}MB/s${Font_Suffix} (${writemultiple} x)"
        fi
    else
        if [ "$4" = "read" ]; then
            echo -e "\r ${Font_Yellow}$6:${Font_Suffix}\t\t${Font_SkyBlue}${ResultSpeed}${Font_Suffix} ${Font_Yellow}MB/s${Font_Suffix}"
        elif [ "$4" = "write" ]; then
            echo -e "\r ${Font_Yellow}$6:${Font_Suffix}\t\t${Font_SkyBlue}${ResultSpeed}${Font_Suffix} ${Font_Yellow}MB/s${Font_Suffix}"
        fi
    fi
    # Fix
    if [ "$1" -ge "2" ] && [ "$4" = "write" ]; then
        echo -e " $6:\t${ResultSpeed} MB/s" >>${WorkDir}/SysBench/Memory/result.txt
    else
        echo -e " $6:\t\t${ResultSpeed} MB/s" >>${WorkDir}/SysBench/Memory/result.txt
    fi
    sleep 1
}

Function_SysBench_Memory_Fast() {
    mkdir -p ${WorkDir}/SysBench/Memory/ >/dev/null 2>&1
    echo -e "\n ${Font_Yellow}-> Memory Performance Test ${Font_Suffix}\n"
    echo -e "\n -> Memory Performance Test \n" >>${WorkDir}/SysBench/Memory/result.txt
    Run_SysBench_Memory "1" "5" "1" "read" "seq" "1 Thread - Read Test "
    Run_SysBench_Memory "1" "5" "1" "write" "seq" "1 Thread - Write Test"
    # 完成FLAG
    Bench_Flag_FinishSysBenchMemoryFast="1"
    sleep 1
}

# =============== 检查 Virt-what 组件 ===============
Check_Virtwhat() {
    if [ ! -f "/usr/sbin/virt-what" ]; then
        SystemInfo_GetOSRelease
        if [ "${Var_OSRelease}" = "centos" ] || [ "${Var_OSRelease}" = "rhel" ]; then
            echo -e "${Msg_Warning}Virt-What Module not found, Installing ..."
            yum -y install virt-what
        elif [ "${Var_OSRelease}" = "ubuntu" ] || [ "${Var_OSRelease}" = "debian" ]; then
            echo -e "${Msg_Warning}Virt-What Module not found, Installing ..."
            apt-get update
            apt-get install -y virt-what dmidecode
        elif [ "${Var_OSRelease}" = "fedora" ]; then
            echo -e "${Msg_Warning}Virt-What Module not found, Installing ..."
            dnf -y install virt-what
        elif [ "${Var_OSRelease}" = "alpinelinux" ]; then
            echo -e "${Msg_Warning}Virt-What Module not found, Installing ..."
            apk update
            apk add virt-what
        else
            echo -e "${Msg_Warning}Virt-What Module not found, but we could not find the os's release ..."
        fi
    fi
    # 二次检测
    if [ ! -f "/usr/sbin/virt-what" ]; then
        echo -e "Virt-What Moudle install Failure! Try Restart Bench or Manually install it! (/usr/sbin/virt-what)"
        exit 1
    fi
}

# =============== 检查 Speedtest 组件 ===============
Check_Speedtest() {
    if [ -f "/usr/local/Bench/bin/speedtest" ]; then
        chmod +x /usr/local/Bench/bin/speedtest >/dev/null 2>&1
        /usr/local/Bench/bin/speedtest --version >/dev/null 2>&1
        if [ "$?" = "0" ]; then
            return 0
        else
            rm -f /usr/local/Bench/bin/speedtest
            Check_Speedtest_GetComponent
        fi
    else
        Check_Speedtest_GetComponent
    fi
}

Check_Speedtest_GetComponent() {
    SystemInfo_GetOSRelease
    SystemInfo_GetSystemBit
    if [ "${Bench_Result_SystemBit_Full}" = "amd64" ]; then
        local DownloadSrc="https://tx.hk47.cc/deb-rpm/speedtest/speedtest-amd64.tar.gz"
    elif [ "${Bench_Result_SystemBit_Full}" = "arm" ]; then
        local DownloadSrc="https://tx.hk47.cc/deb-rpm/speedtest/speedtest-arm.tar.gz"
    else
        local DownloadSrc="https://tx.hk47.cc/deb-rpm/speedtest/speedtest-amd64.tar.gz"
    fi
    if [ "${Var_OSRelease}" = "centos" ] || [ "${Var_OSRelease}" = "rhel" ]; then
        echo -e "${Msg_Warning}Speedtest Module not found, Installing ..."
        echo -e "${Msg_Info}Installing Dependency ..."
        yum makecache fast
        yum -y install curl
        echo -e "${Msg_Info}Installing Speedtest Module ..."
        mkdir -p ${WorkDir}/.DownTmp >/dev/null 2>&1
        pushd ${WorkDir}/.DownTmp >/dev/null
        curl ${DownloadSrc} -o ${WorkDir}/.DownTmp/speedtest.tar.gz
        tar xf ${WorkDir}/.DownTmp/speedtest.tar.gz
        mkdir -p /usr/local/Bench/bin/ >/dev/null 2>&1
        mv ${WorkDir}/.DownTmp/speedtest /usr/local/Bench/bin/
        chmod +x /usr/local/Bench/bin/speedtest
        echo -e "${Msg_Info}Cleaning up ..."
        popd >/dev/null
        rm -rf ${WorkDir}/.DownTmp
    elif [ "${Var_OSRelease}" = "ubuntu" ] || [ "${Var_OSRelease}" = "debian" ]; then
        echo -e "${Msg_Warning}Speedtest Module not found, Installing ..."
        echo -e "${Msg_Info}Installing Dependency ..."
        apt-get update
        apt-get --no-install-recommends -y install curl
        echo -e "${Msg_Info}Installing Speedtest Module ..."
        mkdir -p ${WorkDir}/.DownTmp >/dev/null 2>&1
        pushd ${WorkDir}/.DownTmp >/dev/null
        curl ${DownloadSrc} -o ${WorkDir}/.DownTmp/speedtest.tar.gz
        tar xf ${WorkDir}/.DownTmp/speedtest.tar.gz
        mkdir -p /usr/local/Bench/bin/ >/dev/null 2>&1
        mv ${WorkDir}/.DownTmp/speedtest /usr/local/Bench/bin/
        chmod +x /usr/local/Bench/bin/speedtest
        echo -e "${Msg_Info}Cleaning up ..."
        popd >/dev/null
        rm -rf ${WorkDir}/.DownTmp
    elif [ "${Var_OSRelease}" = "fedora" ]; then
        echo -e "${Msg_Warning}Speedtest Module not found, Installing ..."
        echo -e "${Msg_Info}Installing Dependency ..."
        dnf -y install curl
        echo -e "${Msg_Info}Installing Speedtest Module ..."
        mkdir -p ${WorkDir}/.DownTmp >/dev/null 2>&1
        pushd ${WorkDir}/.DownTmp >/dev/null
        curl ${DownloadSrc} -o ${WorkDir}/.DownTmp/speedtest.tar.gz
        tar xf ${WorkDir}/.DownTmp/speedtest.tar.gz
        mkdir -p /usr/local/Bench/bin/ >/dev/null 2>&1
        mv ${WorkDir}/.DownTmp/speedtest /usr/local/Bench/bin/
        chmod +x /usr/local/Bench/bin/speedtest
        echo -e "${Msg_Info}Cleaning up ..."
        popd >/dev/null
        rm -rf ${WorkDir}/.DownTmp
    elif [ "${Var_OSRelease}" = "alpinelinux" ]; then
        echo -e "${Msg_Warning}Speedtest Module not found, Installing ..."
        echo -e "${Msg_Info}Installing Dependency ..."
        apk update
        apk add curl
        echo -e "${Msg_Info}Installing Speedtest Module ..."
        mkdir -p ${WorkDir}/.DownTmp >/dev/null 2>&1
        pushd ${WorkDir}/.DownTmp >/dev/null
        curl ${DownloadSrc} -o ${WorkDir}/.DownTmp/speedtest.tar.gz
        tar xf ${WorkDir}/.DownTmp/speedtest.tar.gz
        mkdir -p /usr/local/Bench/bin/ >/dev/null 2>&1
        mv ${WorkDir}/.DownTmp/speedtest /usr/local/Bench/bin/
        chmod +x /usr/local/Bench/bin/speedtest
        echo -e "${Msg_Info}Cleaning up ..."
        popd >/dev/null
        rm -rf ${WorkDir}/.DownTmp
    else
        echo -e "${Msg_Warning}Speedtest Module not found, trying direct download ..."
        mkdir -p ${WorkDir}/.DownTmp >/dev/null 2>&1
        pushd ${WorkDir}/.DownTmp >/dev/null
        curl ${DownloadSrc} -o ${WorkDir}/.DownTmp/speedtest.tar.gz
        tar xf ${WorkDir}/.DownTmp/speedtest.tar.gz
        mkdir -p /usr/local/Bench/bin/ >/dev/null 2>&1
        mv ${WorkDir}/.DownTmp/speedtest /usr/local/Bench/bin/
        chmod +x /usr/local/Bench/bin/speedtest
        echo -e "${Msg_Info}Cleaning up ..."
        popd >/dev/null
        rm -rf ${WorkDir}/.DownTmp
    fi
    /usr/local/Bench/bin/speedtest --version >/dev/null 2>&1
    if [ "$?" != "0" ]; then
        echo -e "Speedtest Moudle install Failure! Try Restart Bench or Manually install it!"
        exit 1
    fi
}

# =============== 检查 BestTrace 组件 ===============
Check_BestTrace() {
    if [ ! -f "/usr/local/Bench/bin/besttrace" ]; then
        SystemInfo_GetOSRelease
        SystemInfo_GetSystemBit
        if [ "${Bench_Result_SystemBit_Full}" = "amd64" ]; then
            local BinaryName="besttrace64"
            local DownloadSrc="https://tx.hk47.cc/deb-rpm/besttrace/besttrace64.tar.gz"
        elif [ "${Bench_Result_SystemBit_Full}" = "i386" ]; then
            local BinaryName="besttrace32"
            local DownloadSrc="https://tx.hk47.cc/deb-rpm/besttrace/besttrace32.tar.gz"
        elif [ "${Bench_Result_SystemBit_Full}" = "arm" ]; then
            local BinaryName="besttracearm"
            local DownloadSrc="https://tx.hk47.cc/deb-rpm/besttrace/besttracearm.tar.gz"
        else
            local BinaryName="besttrace32"
            local DownloadSrc="https://tx.hk47.cc/deb-rpm/besttrace/besttrace32.tar.gz"
        fi
        mkdir -p ${WorkDir}/ >/dev/null 2>&1
        mkdir -p /usr/local/Bench/bin/ >/dev/null 2>&1
        if [ "${Var_OSRelease}" = "centos" ] || [ "${Var_OSRelease}" = "rhel" ]; then
            echo -e "${Msg_Warning}BestTrace Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            yum -y install curl unzip
            echo -e "${Msg_Info}Downloading BestTrace Module ..."
            curl ${DownloadSrc} -o ${WorkDir}/besttrace.tar.gz
            echo -e "${Msg_Info}Installing BestTrace Module ..."
            pushd ${WorkDir} >/dev/null
            tar xf besttrace.tar.gz
            mv ${BinaryName} /usr/local/Bench/bin/besttrace
            chmod +x /usr/local/Bench/bin/besttrace
            popd >/dev/null
            echo -e "${Msg_Info}Cleaning up ..."
            rm -rf ${WorkDir}/besttrace.tar.gz
        elif [ "${Var_OSRelease}" = "ubuntu" ] || [ "${Var_OSRelease}" = "debian" ]; then
            echo -e "${Msg_Warning}BestTrace Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            apt-get update
            apt-get --no-install-recommends -y install wget unzip curl ca-certificates
            echo -e "${Msg_Info}Downloading BestTrace Module ..."
            curl ${DownloadSrc} -o ${WorkDir}/besttrace.tar.gz
            echo -e "${Msg_Info}Installing BestTrace Module ..."
            pushd ${WorkDir} >/dev/null
            tar xf besttrace.tar.gz
            mv ${BinaryName} /usr/local/Bench/bin/besttrace
            chmod +x /usr/local/Bench/bin/besttrace
            popd >/dev/null
            echo -e "${Msg_Info}Cleaning up ..."
            rm -rf ${WorkDir}/besttrace.tar.gz
        elif [ "${Var_OSRelease}" = "fedora" ]; then
            echo -e "${Msg_Warning}BestTrace Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            dnf -y install wget unzip curl
            echo -e "${Msg_Info}Downloading BestTrace Module ..."
            curl  ${DownloadSrc} -o ${WorkDir}/besttrace.tar.gz
            echo -e "${Msg_Info}Installing BestTrace Module ..."
            pushd ${WorkDir} >/dev/null
            tar xf besttrace.tar.gz
            mv ${BinaryName} /usr/local/Bench/bin/besttrace
            chmod +x /usr/local/Bench/bin/besttrace
            popd >/dev/null
            echo -e "${Msg_Info}Cleaning up ..."
            rm -rf ${WorkDir}/besttrace.tar.gz
        elif [ "${Var_OSRelease}" = "alpinelinux" ]; then
            echo -e "${Msg_Warning}BestTrace Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            apk update
            apk add wget unzip curl
            echo -e "${Msg_Info}Downloading BestTrace Module ..."
            curl ${DownloadSrc} -o ${WorkDir}/besttrace.tar.gz
            echo -e "${Msg_Info}Installing BestTrace Module ..."
            pushd ${WorkDir} >/dev/null
            tar xf besttrace.tar.gz
            mv ${BinaryName} /usr/local/Bench/bin/besttrace
            chmod +x /usr/local/Bench/bin/besttrace
            popd >/dev/null
            echo -e "${Msg_Info}Cleaning up ..."
            rm -rf ${WorkDir}/besttrace.tar.gz
        else
            echo -e "${Msg_Warning}BestTrace Module not found, but we could not find the os's release ..."
        fi
    fi
    # 二次检测
    if [ ! -f "/usr/local/Bench/bin/besttrace" ]; then
        echo -e "BestTrace Moudle install Failure! Try Restart Bench or Manually install it! (/usr/local/Bench/bin/besttrace)"
        exit 1
    fi
}

# =============== 检查 JSON Query 组件 ===============
Check_JSONQuery() {
    if [ ! -f "/usr/bin/jq" ]; then
        SystemInfo_GetOSRelease
        SystemInfo_GetSystemBit
        if [ "${Bench_Result_SystemBit_Short}" = "64" ]; then
            local DownloadSrc="https://tx.hk47.cc/deb-rpm/jsonquery/jq-amd64.tar.gz"
        elif [ "${Bench_Result_SystemBit_Short}" = "32" ]; then
            local DownloadSrc="https://tx.hk47.cc/deb-rpm/jsonquery/jq-i386.tar.gz"
        else
            local DownloadSrc="https://tx.hk47.cc/deb-rpm/jsonquery/jq-i386.tar.gz"
        fi
        mkdir -p ${WorkDir}/
        if [ "${Var_OSRelease}" = "centos" ] || [ "${Var_OSRelease}" = "rhel" ]; then
            echo -e "${Msg_Warning}JSON Query Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            yum install -y epel-release
            yum install -y jq
        elif [ "${Var_OSRelease}" = "ubuntu" ] || [ "${Var_OSRelease}" = "debian" ]; then
            echo -e "${Msg_Warning}JSON Query Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            apt-get update
            apt-get install -y jq
        elif [ "${Var_OSRelease}" = "fedora" ]; then
            echo -e "${Msg_Warning}JSON Query Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            dnf install -y jq
        elif [ "${Var_OSRelease}" = "alpinelinux" ]; then
            echo -e "${Msg_Warning}JSON Query Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            apk update
            apk add jq
        else
            echo -e "${Msg_Warning}JSON Query Module not found, Installing ..."
            echo -e "${Msg_Info}Installing Dependency ..."
            apk update
            apk add wget unzip curl
            echo -e "${Msg_Info}Downloading Json Query Module ..."
            curl ${DownloadSrc} -o ${WorkDir}/jq.tar.gz
            echo -e "${Msg_Info}Installing JSON Query Module ..."
            tar xvf ${WorkDir}/jq.tar.gz
            mv ${WorkDir}/jq /usr/bin/jq
            chmod +x /usr/bin/jq
            echo -e "${Msg_Info}Cleaning up ..."
            rm -rf ${WorkDir}/jq.tar.gz
        fi
    fi
    # 二次检测
    if [ ! -f "/usr/bin/jq" ]; then
        echo -e "JSON Query Moudle install Failure! Try Restart Bench or Manually install it! (/usr/bin/jq)"
        exit 1
    fi
}

# =============== 检查 SysBench 组件 ===============
Check_SysBench() {
    if [ ! -f "/usr/bin/sysbench" ] && [ ! -f "/usr/local/bin/sysbench" ]; then
        SystemInfo_GetOSRelease
        SystemInfo_GetSystemBit
        if [ "${Var_OSRelease}" = "centos" ] || [ "${Var_OSRelease}" = "rhel" ]; then
            echo -e "${Msg_Warning}Sysbench Module not found, installing ..."
            yum -y install epel-release
            yum -y install sysbench
        elif [ "${Var_OSRelease}" = "ubuntu" ]; then
            echo -e "${Msg_Warning}Sysbench Module not found, installing ..."
            curl -s https://packagecloud.io/install/repositories/akopytov/sysbench/script.deb.sh | bash
            apt -y install sysbench
        elif [ "${Var_OSRelease}" = "debian" ]; then
            echo -e "${Msg_Warning}Sysbench Module not found, installing ..."
            curl -s https://packagecloud.io/install/repositories/akopytov/sysbench/script.deb.sh | bash
            apt -y install sysbench
        elif [ "${Var_OSRelease}" = "fedora" ]; then
            echo -e "${Msg_Warning}Sysbench Module not found, installing ..."
            dnf -y install sysbench
        elif [ "${Var_OSRelease}" = "alpinelinux" ]; then
            echo -e "${Msg_Warning}Sysbench Module not found, installing ..."
            echo -e "${Msg_Warning}SysBench Current not support Alpine Linux, Skipping..."
            Var_Skip_SysBench="1"
        fi
    fi
    # 最终检测
    if [ ! -f "/usr/bin/sysbench" ] && [ ! -f "/usr/local/bin/sysbench" ]; then
        echo -e "${Msg_Error}SysBench Moudle install Failure! Try Restart Bench or Manually install it! (/usr/bin/sysbench)"
        exit 1
    fi
}

Global_StartupInit_Action
Function_GetSystemInfo
Function_ShowSystemInfo
Function_ShowNetworkInfo
Function_SysBench_CPU_Fast
Function_SysBench_Memory_Fast
Function_DiskTest_Fast
Function_Speedtest_Fast
Global_Exit_Action
echo -e "\n ${Font_Yellow}-> Exit after testing ${Font_Suffix}\n"