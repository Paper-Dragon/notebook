宿主机主要为虚拟机提供硬件资源，要尽可能将硬件资源都给VM，所以尽量不要在宿主机和VM中混合跑程序。

## 宿主机硬件配置

```
Lenovo thinkcentre 7-4770 16G 240G固态
```

## 宿主机系统

```
CentOS Linux release 8.1.1911 (Core) 
```

## 宿主机的要求

```
以下最小系统资源可用：
主机有6 GB的可用磁盘空间，每个预期的VM还有6 GB的可用磁盘空间。
2 GB用于主机的RAM，另外2 GB用于每个预期的VM。
```

## 宿主机设置

a、BIOS中开启CPU VT技术

![cpuVT.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601028311026.png)

VT-D:如果BIOS中有就打开，优化IO

![VTD.jpg](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601028364217.jpg)

b、修改主机名

```
[root@localhost ~]# echo "tyschool_com" > /etc/hostname 
```

c、设置网络为静态IP,并能实现联网

```
[root@localhost ~]# nmcli connection add con-name eno1 ifname eno1 ipv4.method manual \
 ipv4.addresses 192.168.1.200/24 ipv4.gateway 192.168.1.1 ipv4.dns 202.106.0.20 \
+ipv4.dns 114.114.114.114 type 802-3-ethernet

连接 "eno1" (d1339ed8-c981-4103-b493-c5cf9dc6d28e) 已成功添加。
```

d、升级系统

```
[root@localhost ~]# dnf update -y
```

e、关闭防火墙、关闭selinux

```
#防火墙
[root@localhost ~]# systemctl disable firewalld.service 
Removed /etc/systemd/system/multi-user.target.wants/firewalld.service.
Removed /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.
[root@localhost ~]# iptables -F
[root@localhost ~]# iptables -t nat -F

#selinux
[root@localhost ~]# sed -r -i '/^(SELINUX)=(.*)/cSELINUX=disabled' /etc/selinux/config
```

f、重启生效

```
[root@localhost ~]# reboot
```