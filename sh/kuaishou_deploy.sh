#!/bin/bash
export ROOT=/usr/local
export TMP=/tmp
export KSP2PSERVICEFILE=/etc/systemd/system/ksp2p-server.service
export KSP2PSERVICEAGENTFILE=/etc/systemd/system/ksp2p-agent.service
#this script is just for deploy kuaishou business
kuaishou_getbinary(){
    curl https://devops.pcdncom.com/kuaishou/ksp2p.tar.gz --output ${TMP}/ksp2p.tar.gz
    tar -xf /tmp/ksp2p.tar.gz -C ${ROOT}/
    mv ${ROOT}/ksp2p/ksp2p-server.service /etc/systemd/system/ksp2p-server.service
    mv ${ROOT}/ksp2p/ksp2p-agent.service /etc/systemd/system/ksp2p-agent.service
}

kuaishou_changebusiness(){
    case $1 in
    1)
    PROVIDER_ID=168
    PROVIDER=njsh_zx
    sed -i "s/__KSP2PSERVER__/\/usr\/local\/ksp2p\/ksp2p-big\/ksp2p-server-x86/g" ${KSP2PSERVICEFILE}
    sed -i "s/__KSP2PAGENT__/\/usr\/local\/ksp2p\/ksp2p-big\/ks-agent-x86/g"  ${KSP2PSERVICEAGENTFILE}
    sed -i "s/__TCP_CONF_PATH__/\/usr\/local\/ksp2p\/ksp2p-big\/etc/g" ${KSP2PSERVICEFILE}

    ;;
    2)
    PROVIDER_ID=68
    PROVIDER=njsh
    sed -i "s/__KSP2PSERVER__/\/usr\/local\/ksp2p\/ksp2p-big\/ksp2p-server-x86/g" ${KSP2PSERVICEFILE}
    sed -i "s/__KSP2PAGENT__/\/usr\/local\/ksp2p\/ksp2p-big\/ks-agent-x86/g"  ${KSP2PSERVICEAGENTFILE}
    sed -i "s/__TCP_CONF_PATH__/\/usr\/local\/ksp2p\/ksp2p-big\/etc/g" ${KSP2PSERVICEFILE}
    ;;
    3)
    PROVIDER_ID=266
    PROVIDER=njsh
    sed -i "s/__KSP2PSERVER__/\/usr\/local\/ksp2p\/ksp2p-small\/ksp2p-server-x86_small/g" ${KSP2PSERVICEFILE}
    sed -i "s/__KSP2PAGENT__/\/usr\/local\/ksp2p\/ksp2p-small\/ks-agent-x86_small/g" ${KSP2PSERVICEAGENTFILE}
    sed -i "s/__TCP_CONF_PATH__/\/usr\/local\/ksp2p\/ksp2p-small\/etc/g" ${KSP2PSERVICEFILE}
    ;;
    esac
    machine_id=$(cat /etc/machine-id)
    sed -i "s/__GUID__/${machine_id}:000/g" ${KSP2PSERVICEAGENTFILE}
    sed -i "s/__GUID__/${machine_id}:000/g" ${KSP2PSERVICEFILE}
    sed -i "s/__PROVIDER_ID__/${PROVIDER_ID}/g" ${KSP2PSERVICEFILE}
    sed -i "s/__PROVIDER_ID__/${PROVIDER_ID}/g" ${KSP2PSERVICEAGENTFILE}
    sed -i "s/__PROVIDER__/${PROVIDER}/g" ${KSP2PSERVICEFILE}
    sed -i "s/__PROVIDER__/${PROVIDER}/g" ${KSP2PSERVICEAGENTFILE}
    systemctl daemon-reload
}

kuaishou_select_business_type(){
    echo ""
    echo "=================> Please Select Business TYPE <======================"
    echo "1.X86-ZX-node(static ip and single line > 1Gbps)"
    echo "2.X86-big-node(single line > 100Mbps)"
    echo "3.X86-small-node(sing line > 30Mbps)"
    BUSINESS_TYPE=0
    NAT_TYPE=4
    MULTI_LINE_SPEED=0
    while ! echo ${BUSINESS_TYPE} | grep -q '^[1-3]$'; do
        read -p "Please Input a Valid Business_TYPE------>:" BUSINESS_TYPE
    done
    while ! echo ${NAT_TYPE} | grep -q '^[0-3]$'; do
        read -p "Please Input a Valid NAT Type------>:" NAT_TYPE
    done
    while ! echo ${MULTI_LINE_SPEED} | grep -qE '^[1-9]+'; do
        read -p "Please Input a Valid MULTI LINE SPEED ------>:" MULTI_LINE_SPEED
    done
    LINE_SPEED=$(echo "scale=2; $MULTI_LINE_SPEED / 8" | bc)
    sed -i "s/__NAT__/${NAT_TYPE}/g" ${KSP2PSERVICEFILE}
    sed -i "s/__MULTI_LINE_SPEED__/${LINE_SPEED}/g" ${KSP2PSERVICEFILE}
    linecount=$( ip a | grep ppp | grep -v inet | grep -v link | wc -l)
    ppps=$(for i in $(seq 0 $((${linecount}-1)));do if [ ${i} -eq $((${linecount}-1)) ];then printf ppp${i};else printf ppp${i},;fi done)
    sed -i "s/__NIC_OUT__/${ppps}/g" ${KSP2PSERVICEFILE}
    sed -i "s/__NIC_IN__/${ppps}/g" ${KSP2PSERVICEFILE}
    kuaishou_changebusiness ${BUSINESS_TYPE}
}

kuaishou_main(){
    kuaishou_getbinary
    kuaishou_select_business_type
}
kuaishou_main
