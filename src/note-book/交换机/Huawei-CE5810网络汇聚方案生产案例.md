

# Huawei-CE5810网络汇聚方案生产案例



```bash
[~HUAWEI]display current-configuration
!Software Version V100R003C00SPC600
!Last configuration was updated at 2023-09-21 05:46:58+00:00 by admin
!Last configuration was saved at 2023-09-21 05:47:09+00:00 by admin
#
sysname HUAWEI
#
drop-profile default
#
vlan batch 101 to 130
#
stp disable
#
netstream timeout ip inactive 100
netstream timeout ip tcp-session
netstream export ip version 9 origin-as
netstream export ip template timeout-rate 1
netstream export ip source 192.168.101.102
netstream export ip host 192.168.101.200 2055
#
telnet ipv6 server disable
#
diffserv domain default
#
aaa
 undo local-user policy security-enhance
 local-user admin password irreversible-cipher $1a$fb:J!Rwy*H$Dda$+.%mP.5;L/~*JWA7R|S!3}7[B*zMm{J@IYO=$
 local-user admin service-type telnet
 local-user admin level 15
 #
 authentication-scheme default
 #
 authorization-scheme default
 #
 accounting-scheme default
 #
 domain default
 #
 domain default_admin
#
stack
#
interface Vlanif1
 ip address 192.168.101.101 255.255.255.0
#
interface MEth0/0/0
 ip address 192.168.0.233 255.255.255.0
#
interface GE1/0/1
 port default vlan 101
 qos lr cir 390 mbps outbound
#
interface GE1/0/2
 port default vlan 102
#
interface GE1/0/3
 port default vlan 103
#
interface GE1/0/4
 port default vlan 104
#
interface GE1/0/5
 port default vlan 105
#
interface GE1/0/6
 port default vlan 106
#
interface GE1/0/7
 port default vlan 107
#
interface GE1/0/8
 port default vlan 108
#
interface GE1/0/9
 port default vlan 109
#
interface GE1/0/10
 port default vlan 110
#
interface GE1/0/11
 port default vlan 111
#
interface GE1/0/12
 port default vlan 112
#
interface GE1/0/13
 port default vlan 113
#
interface GE1/0/14
 port default vlan 114
#
interface GE1/0/15
 port default vlan 115
#
interface GE1/0/16
 port default vlan 116
#
interface GE1/0/17
 port default vlan 117
#
interface GE1/0/18
 port default vlan 118
#
interface GE1/0/19
 port default vlan 119
#
interface GE1/0/20
 port default vlan 120
#
interface GE1/0/21
 port default vlan 121
#
interface GE1/0/22
 port default vlan 122
#
interface GE1/0/23
 port default vlan 123
#
interface GE1/0/24
 port default vlan 124
#
interface GE1/0/25
 port default vlan 125
#
interface GE1/0/26
 port default vlan 126
#
interface GE1/0/27
 port default vlan 127
#
interface GE1/0/28
 port default vlan 128
#
interface GE1/0/29
 port default vlan 129
#
interface GE1/0/30
 port default vlan 130
#
interface GE1/0/31
#
interface GE1/0/32
#
interface GE1/0/33
#
interface GE1/0/34
#
interface GE1/0/35
#
interface GE1/0/36
#
interface GE1/0/37
#
interface GE1/0/38
#
interface GE1/0/39
#
interface GE1/0/40
#
interface GE1/0/41
#
interface GE1/0/42
#
interface GE1/0/43
#
interface GE1/0/44
#
interface GE1/0/45
#
interface GE1/0/46
#
interface GE1/0/47
#
interface GE1/0/48
#
interface 10GE1/0/1
 port link-type trunk
 port trunk allow-pass vlan 2 to 4094
 netstream inbound ip
 netstream outbound ip
 netstream sampler random-packets 1 inbound
 netstream sampler random-packets 1 outbound
#
interface 10GE1/0/2
 port link-type trunk
 port trunk allow-pass vlan 2 to 4094
#
interface 10GE1/0/3
 port link-type trunk
 port trunk allow-pass vlan 2 to 4094
#
interface 10GE1/0/4
 port link-type trunk
 port trunk allow-pass vlan 2 to 4094
#
interface NULL0
#
snmp-agent
snmp-agent local-engineid 800007DB0304F938EBDC11
snmp-agent community read cipher %@%@5Oo|+77#A0K'$Q,6"&#$,r2;#cJH0/"_.&<:NYGur(PNr2>,nK"H/9P{#S6@._S-zbwC2G,r%@%@
#
snmp-agent sys-info version v2c v3
#
lldp enable
#
user-interface con 0
#
user-interface vty 0 4
 authentication-mode aaa
 user privilege level 15
 protocol inbound all
#
vm-manager
#
return
[~HUAWEI]

```

