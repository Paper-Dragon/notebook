# **防火墙状态及规则**

1、查看防火墙状态：`firewall-cmd --state`

```bash
[root@localhost ~]# firewall-cmd --state 
running
[root@localhost ~]# 
```

2、查看防火墙：firewall-[cmd](https://so.csdn.net/so/search?q=cmd&spm=1001.2101.3001.7020) --list-all

```bash
[root@localhost ~]# firewall-cmd --list-all
public (active)
  target: default
  icmp-block-inversion: no
  interfaces: eth0
  sources:
  services: dhcpv6-client http
  ports: 999/tcp
  protocols:
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
        rule family="ipv4" source address="10.45.148.240" accept
        rule family="ipv4" source address="10.45.152.0/24" accept
        rule family="ipv4" source address="10.45.149.59" accept
        rule family="ipv4" source address="10.72.55.99" accept
        rule family="ipv4" source address="10.45.148.44" accept
        rule family="ipv4" source address="10.45.149.2" accept
        rule family="ipv4" source address="10.45.149.124" accept
        rule family="ipv4" source address="10.45.148.184" accept
        rule family="ipv4" source address="10.45.148.143" accept
        rule family="ipv4" source address="10.45.148.18" accept
        rule family="ipv4" source address="172.16.3.18" accept
        rule family="ipv4" source address="10.45.152.225" accept
        rule family="ipv4" source address="10.45.152.104" accept
        rule family="ipv4" source address="10.45.156.169" accept
        rule family="ipv4" source address="10.72.55.10" accept
        rule family="ipv4" source address="10.72.55.108" accept
        rule family="ipv4" source address="10.45.149.15" accept
        rule family="ipv4" source address="10.45.148.16" accept
        rule family="ipv4" source address="10.45.148.239" accept
        rule family="ipv4" source address="10.45.146.51" accept
        rule family="ipv4" source address="10.45.157.70" accept
        rule family="ipv4" source address="10.45.2.0/24" accept
        rule family="ipv4" source address="10.45.2.49" accept
        rule family="ipv4" source address="10.45.2.47" accept
        rule family="ipv4" source address="10.45.2.48" accept
        rule family="ipv4" source address="10.45.2.21" accept
        rule family="ipv4" source address="10.45.2.63" accept
        rule family="ipv4" source address="10.45.132.34" accept
        rule family="ipv4" source address="10.72.90.250" accept
[root@localhost ~]#
```

3、更新防火墙规则：firewall-cmd --reload

```bash
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# 
```

# 端口

1、临时增加(`reload`之后消失)：不需要`reload`

```bash
[root@localhost ~]# firewall-cmd --add-port=999/tcp
success
[root@localhost ~]# firewall-cmd --query-port=999/tcp
yes
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --query-port=999/tcp
no
[root@localhost ~]#
```

2、永久增加：reload后生效

```bash
[root@localhost ~]# firewall-cmd --permanent --add-port=999/tcp
success
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --query-port=999/tcp
yes
```

3、临时删除端口：reload后消失

```bash
[root@localhost ~]# firewall-cmd --remove-port=999/tcp
success
[root@localhost ~]# firewall-cmd --query-port=999/tcp
no
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --query-port=999/tcp
yes
[root@localhost ~]#
```

4、永久删除端口：reload后生效

```bash
[root@localhost ~]# firewall-cmd --permanent --remove-port=999/tcp
success
[root@localhost ~]# firewall-cmd --query-port=999/tcp
yes
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --query-port=999/tcp
no
[root@localhost ~]#
```

5、查询端口 

```bash
[root@localhost ~]# firewall-cmd --query-port=999/tcp
yes
[root@localhost ~]#
```

 6、查看所有放行的端口：

```bash
[root@localhost ~]# firewall-cmd --permanent --add-port=999/tcp
success
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --list-ports
999/tcp
[root@localhost ~]# 
```

# IP

1、防火墙添加允许访问的IP

注：添加允许访问的IP后，需要reload才能生效

```bash
[root@localhost logs]# firewall-cmd --zone=public --add-rich-rule 'rule family="ipv4" source address="10.45.2.35" accept' --permanent
success
 
[root@localhost logs]# firewall-cmd  --reload
success
```

# **服务**

1、防火墙服务的状态

```bash
[root@localhost ~]# systemctl status firewalld.service
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; vendor preset: enabled)
   Active: active (running) since 五 2021-10-29 11:09:30 CST; 3 days ago
     Docs: man:firewalld(1)
 Main PID: 42215 (firewalld)
   CGroup: /system.slice/firewalld.service
           └─42215 /usr/bin/python -Es /usr/sbin/firewalld --nofork --nopid
 
10月 29 11:09:30 localhost.localdomain systemd[1]: Starting firewalld - dyna...
10月 29 11:09:30 localhost.localdomain systemd[1]: Started firewalld - dynam...
11月 02 10:22:44 localhost.localdomain firewalld[42215]: WARNING: ALREADY_EN...
11月 02 10:23:29 localhost.localdomain firewalld[42215]: WARNING: ALREADY_EN...
Hint: Some lines were ellipsized, use -l to show in full.
[root@localhost ~]#
```

2、启动/关闭防火墙

```bash
[root@localhost ~]# systemctl stop firewalld.service
[root@localhost ~]# systemctl start firewalld.service
```

3、获取所有支持的服务

```bash
[root@localhost ~]# firewall-cmd --get-services
RH-Satellite-6 amanda-client amanda-k5-client bacula bacula-client bgp bitcoin bitcoin-rpc bitcoin-testnet bitcoin-testnet-rpc ceph ceph-mon cfengine condor-collector ctdb dhcp dhcpv6 dhcpv6-client dns docker-registry docker-swarm dropbox-lansync elasticsearch freeipa-ldap freeipa-ldaps freeipa-replication freeipa-trust ftp ganglia-client ganglia-master git gre high-availability http https imap imaps ipp ipp-client ipsec irc ircs iscsi-target jenkins kadmin kerberos kibana klogin kpasswd kprop kshell ldap ldaps libvirt libvirt-tls managesieve mdns minidlna mongodb mosh mountd ms-wbt mssql murmur mysql nfs nfs3 nmea-0183 nrpe ntp openvpn ovirt-imageio ovirt-storageconsole ovirt-vmconsole pmcd pmproxy pmwebapi pmwebapis pop3 pop3s postgresql privoxy proxy-dhcp ptp pulseaudio puppetmaster quassel radius redis rpc-bind rsh rsyncd samba samba-client sane sip sips smtp smtp-submission smtps snmp snmptrap spideroak-lansync squid ssh syncthing syncthing-gui synergy syslog syslog-tls telnet tftp tftp-client tinc tor-socks transmission-client upnp-client vdsm vnc-server wbem-https xmpp-bosh xmpp-client xmpp-local xmpp-server zabbix-agent zabbix-server
[root@localhost ~]# 
```

4、增加服务（临时增加）

```bash
[root@localhost ~]# firewall-cmd --add-service=https
success
[root@localhost ~]# firewall-cmd --query-service=https
yes
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --query-service=https
no
[root@localhost ~]#
```

5、删除服务（临时删除）

```bash
[root@localhost ~]# firewall-cmd --query-service=https
yes
[root@localhost ~]# firewall-cmd --remove-service=https
success
[root@localhost ~]# firewall-cmd --query-service=https
no
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --query-service=https
no
[root@localhost ~]#
```

6、查询服务

```bash
[root@localhost ~]# firewall-cmd --query-service=https
yes
[root@localhost ~]#
```

7、增加服务（永久）

```coffeescript
[root@localhost bin]# firewall-cmd --permanent --add-service=http
success
[root@localhost bin]# firewall-cmd --reload
success
[root@localhost bin]# firewall-cmd --query-service=http
yes
```

8、删除服务（永久）

```perl
[root@localhost bin]# firewall-cmd --permanent --remove-service=ssh
success
[root@localhost bin]# firewall-cmd --reload
success
[root@localhost bin]# firewall-cmd --query-servicessh
no
```