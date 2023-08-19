在前面的课程中我们知道使用route命令可以添加主机的路由信息，但是一旦系统重启相关的设置信息就会丢失,那么如何设置一个重启也不会丢失的路由信息呢?

```
[root@zutuanxue ~]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.98.200  netmask 255.255.255.0  broadcast 192.168.98.255
        inet6 fe80::2386:3dbd:531c:7bc1  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:a6:ad:95  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 37  bytes 4386 (4.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.123.123  netmask 255.255.255.0  broadcast 192.168.123.255
        inet6 fe80::a848:f674:db3b:a83e  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:a6:ad:9f  txqueuelen 1000  (Ethernet)
        RX packets 5  bytes 1758 (1.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 38  bytes 4390 (4.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

#我现在有两块网卡,这两块网卡的ip地址分别是192.168.98.200和192.168.123.123,假如发送到192.168.1.0/24这个网段的数据包需要通过200这块网卡发送出去,而发送到192.168.100.0/24这个网段的数据包需要通过123这块网卡发送出去,我该如何设置呢?使用命令的话我们可以
[root@zutuanxue ~]# route add -net 192.168.1.0/24 gateway 192.168.98.1 dev ens33
[root@zutuanxue ~]# route add -net 192.168.100.0/24 gateway 192.168.123.1 dev ens37
[root@zutuanxue ~]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
192.168.1.0     192.168.98.1    255.255.255.0   UG    0      0        0 ens33
192.168.98.0    0.0.0.0         255.255.255.0   U     100    0        0 ens33
192.168.100.0   192.168.123.1   255.255.255.0   UG    0      0        0 ens37
192.168.123.0   0.0.0.0         255.255.255.0   U     101    0        0 ens37
#这种方式只是临时的,我们来看一下该如何永久添加
[root@zutuanxue ~]# route del -net 192.168.100.0/24 gateway 192.168.123.1 dev ens37
[root@zutuanxue ~]# route del -net 192.168.1.0/24 gateway 192.168.98.1 dev ens33
[root@zutuanxue ~]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
192.168.98.0    0.0.0.0         255.255.255.0   U     100    0        0 ens33
192.168.123.0   0.0.0.0         255.255.255.0   U     101    0        0 ens37



[root@zutuanxue ~]# vim /etc/sysconfig/network-scripts/route-ens33
192.168.1.0/24 via 192.168.98.1 dev ens33
[root@zutuanxue ~]# vim /etc/sysconfig/network-scripts/route-ens37
192.168.100.0/24 via 192.168.123.1 dev ens37
[root@zutuanxue ~]# systemctl restart NetworkManager

[root@zutuanxue ~]# nmcli connection down ens33 ens37 
成功停用连接 "ens33"（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/1）

成功停用连接 "ens37"（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/2）

[root@zutuanxue ~]# nmcli connection up ens33 
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/3）
[root@zutuanxue ~]# nmcli connection up ens37
连接已成功激活（D-Bus 活动路径：/org/freedesktop/NetworkManager/ActiveConnection/4）
[root@zutuanxue network-scripts]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
192.168.1.0     192.168.98.1    255.255.255.0   UG    100    0        0 ens33
192.168.98.0    0.0.0.0         255.255.255.0   U     100    0        0 ens33
192.168.100.0   192.168.123.1   255.255.255.0   UG    101    0        0 ens37
192.168.123.0   0.0.0.0         255.255.255.0   U     101    0        0 ens37
```