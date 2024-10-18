#!/bin/bash

#check linux Gentoo os 
var=`lsb_release -a | grep Gentoo`
if [ -z "${var}" ]; then 
	var=`cat /etc/issue | grep Gentoo`
fi

if [ -d "/etc/runlevels/default" -a -n "${var}" ]; then
	LINUX_RELEASE="GENTOO"
else
	LINUX_RELEASE="OTHER"
fi

stop_aegis(){
	killall -9 aegis_cli >/dev/null 2>&1
	killall -9 aegis_update >/dev/null 2>&1
	killall -9 AliYunDun >/dev/null 2>&1
	killall -9 AliHids >/dev/null 2>&1
	killall -9 AliHips >/dev/null 2>&1
	killall -9 AliYunDunUpdate >/dev/null 2>&1
    
    if [ -d /usr/local/aegis/aegis_debug ];then
        if [ -d /usr/local/aegis/aegis_debug/tracing/instances/aegis ];then
            echo > /usr/local/aegis/aegis_debug/tracing/instances/aegis/set_event
        else
            echo > /usr/local/aegis/aegis_debug/tracing/set_event
        fi
    fi
    
    if [ -d /sys/kernel/debug ];then
        if [ -d /sys/kernel/debug/tracing/instances/aegis ];then
            echo > /sys/kernel/debug/tracing/instances/aegis/set_event
        else
            echo > /sys/kernel/debug/tracing/set_event
        fi
    fi
    
    printf "%-40s %40s\n" "Stopping aegis" "[  OK  ]"
}

remove_aegis(){
if [ -d /usr/local/aegis ];then
    rm -rf /usr/local/aegis/aegis_client
    rm -rf /usr/local/aegis/aegis_update
	rm -rf /usr/local/aegis/alihids
fi

if [ -d /usr/local/aegis/aegis_debug ];then
    umount /usr/local/aegis/aegis_debug
    rm -rf /usr/local/aegis/aegis_debug
fi
}

uninstall_service() {
   
   if [ -f "/etc/init.d/aegis" ]; then
		/etc/init.d/aegis stop  >/dev/null 2>&1
		rm -f /etc/init.d/aegis 
   fi

	if [ $LINUX_RELEASE = "GENTOO" ]; then
		rc-update del aegis default 2>/dev/null
		if [ -f "/etc/runlevels/default/aegis" ]; then
			rm -f "/etc/runlevels/default/aegis" >/dev/null 2>&1;
		fi
    elif [ -f /etc/init.d/aegis ]; then
         /etc/init.d/aegis  uninstall
	    for ((var=2; var<=5; var++)) do
			if [ -d "/etc/rc${var}.d/" ];then
				 rm -f "/etc/rc${var}.d/S80aegis"
		    elif [ -d "/etc/rc.d/rc${var}.d" ];then
				rm -f "/etc/rc.d/rc${var}.d/S80aegis"
			fi
		done
    fi

}

stop_aegis
uninstall_service
remove_aegis


printf "%-40s %40s\n" "Uninstalling aegis"  "[  OK  ]"


