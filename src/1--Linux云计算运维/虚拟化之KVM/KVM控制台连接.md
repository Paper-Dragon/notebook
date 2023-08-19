## 1、虚拟机连接-开启虚拟机控制台连接

```
[root@localhost ~]# systemctl start serial-getty@ttyS0.service

[root@localhost ~]# systemctl enable serial-getty@ttyS0.service
Created symlink /etc/systemd/system/getty.target.wants/serial-getty@ttyS0.service → /usr/lib/systemd/system/serial-getty@.service.


[root@zutuanxue ~]# virsh console node1
连接到域 node1
换码符为 ^]
CentOS Linux 8 (Core)
Kernel 4.18.0-147.el8.x86_64 on an x86_64

localhost login: root
Password: 
Last login: Fri Mar 27 11:48:19 from 192.168.122.1
[root@localhost ~]# 



提示：进去之后回车多次即可通过账号密码登录，退出执行Ctrl+]
```