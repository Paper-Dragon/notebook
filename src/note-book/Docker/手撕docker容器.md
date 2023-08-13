# 纯手工制作容器【Docker原理】

## 前提

```bsah
# 删除share选项防止mnt共享
[root@out-container ~]# grep root /proc/self/mountinfo
40 0 253:0 / / rw,relatime shared:1 - xfs /dev/mapper/centos_monther-root rw,seclabel,attr2,inode64,noquota
[root@out-container ~]# mount --make-rprivate /
[root@out-container ~]# grep root /proc/self/mountinfo
40 0 253:0 / / rw,relatime - xfs /dev/mapper/centos_monther-root rw,seclabel,attr2,inode64,noquota
```

## 准备rootfs文件系统

> 因为手工制作优化过程繁琐，请看我的另一篇文档手工制作
>
> 本文章使用 Docker 镜像解压出来作为rootfs

```bash
docker export $(docker create centos:8.3.2011) | tar -C . -xvf -


[root@out-container rootfs]# pwd
/root/mkRootfs/rootfs
[root@out-container rootfs]# ls
anaconda-post.log  bin  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var

```

## 准备一个NameSpace

```bash
[root@out-container mkRootfs]# echo $$
1593
[root@out-container mkRootfs]# unshare --mount --uts --ipc --net --pid --fork /bin/bash
[root@out-container mkRootfs]# echo $$
1
[root@out-container mkRootfs]#
```

### USER隔离

```bsah
# 默认已经隔离
[root@out-container ~]# id
uid=0(root) gid=0(root) groups=0(root) context=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023
[root@out-container ~]#
[root@out-container ~]#
[root@out-container ~]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
chrony:x:998:996::/var/lib/chrony:/sbin/nologin
[root@out-container ~]#


[root@in-container /]# id
uid=0(root) gid=0(root) groups=0(root)
[root@in-container /]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
systemd-coredump:x:999:997:systemd Core Dumper:/:/sbin/nologin
systemd-resolve:x:193:193:systemd Resolver:/:/sbin/nologin

```



### UTS隔离

实验过程

```bsah
# 标记宿主机主机名
[root@monther mkRootfs]# hostnamectl set-hostname out-container
[root@monther mkRootfs]# exec bash
[root@out-container mkRootfs]#

# 标记容器主机名
[root@out-container mkRootfs]# hostname in-container && exec bash
[root@in-container rootfs]#
```

测试过程

```bash
[root@out-container ~]# hostname
out-container
```

### MNT/IPC/PID隔离

```bash

[root@in-container mkRootfs]# mount -t proc none /proc
[root@in-container mkRootfs]# ps -ef
UID         PID   PPID  C STIME TTY          TIME CMD
root          1      0  0 09:55 pts/0    00:00:00 bash
root         21      1  0 10:10 pts/0    00:00:00 ps -ef

[root@in-container rootfs]# mount --bind /root/mkRootfs/rootfs/ /root/mkRootfs/rootfs/
[root@in-container rootfs]# cd /root/mkRootfs/rootfs/
[root@in-container rootfs]# mkdir oldroot
[root@in-container rootfs]# pivot_root . oldroot/
[root@in-container rootfs]# cd /
[root@in-container /]# export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
[root@in-container /]# mount -t proc none /proc
[root@in-container /]# ps -ef
UID         PID   PPID  C STIME TTY          TIME CMD
root          1      0  0 01:55 ?        00:00:00 bash
root         28      1  0 02:14 ?        00:00:00 ps -ef

[root@in-container /]# umount -a
umount: /: target is busy.
        (In some cases useful info about processes that use
         the device is found by lsof(8) or fuser(1))
umount: /oldroot/dev: target is busy.
        (In some cases useful info about processes that use
         the device is found by lsof(8) or fuser(1))
umount: /oldroot: target is busy.
        (In some cases useful info about processes that use
         the device is found by lsof(8) or fuser(1))
[root@in-container /]# mount
/dev/mapper/centos_monther-root on /oldroot type xfs (rw,relatime,seclabel,attr2,inode64,logbufs=8,logbsize=32k,noquota)
devtmpfs on /oldroot/dev type devtmpfs (rw,nosuid,seclabel,size=1982216k,nr_inodes=495554,mode=755)
devpts on /oldroot/dev/pts type devpts (rw,nosuid,noexec,relatime,seclabel,gid=5,mode=620,ptmxmode=000)
proc on /oldroot/proc type proc (rw,nosuid,nodev,noexec,relatime)
sysfs on /oldroot/sys type sysfs (rw,nosuid,nodev,noexec,relatime,seclabel)
selinuxfs on /oldroot/sys/fs/selinux type selinuxfs (rw,relatime)
/dev/mapper/centos_monther-root on / type xfs (rw,relatime,seclabel,attr2,inode64,logbufs=8,logbsize=32k,noquota)
none on /proc type proc (rw,relatime)
[root@in-container /]# df -h
Filesystem                       Size  Used Avail Use% Mounted on
/dev/mapper/centos_monther-root   49G  8.4G   41G  18% /oldroot
devtmpfs                         1.9G     0  1.9G   0% /oldroot/dev
[root@in-container /]#

[root@in-container /]# mount -t proc none /proc
[root@in-container /]# ls /proc/
1          cgroups   devices        execdomains  iomem     keys         kpageflags  misc     pagetypeinfo  slabinfo  sysrq-trigger  uptime
34         cmdline   diskstats      fb           ioports   key-users    loadavg     modules  partitions    softirqs  sysvipc        version
acpi       consoles  dma            filesystems  irq       kmsg         locks       mounts   schedstat     stat      thread-self    vmallocinfo
buddyinfo  cpuinfo   driver         fs           kallsyms  kpagecgroup  mdstat      mtrr     scsi          swaps     timer_list     vmstat
bus        crypto    dynamic_debug  interrupts   kcore     kpagecount   meminfo     net      self          sys       tty            zoneinfo
[root@in-container /]# umount -l oldroot/
[root@in-container /]# mount
/dev/mapper/centos_monther-root on / type xfs (rw,relatime,seclabel,attr2,inode64,logbufs=8,logbsize=32k,noquota)
none on /proc type proc (rw,relatime)
```

### NET隔离



```bash
# 宿主机
[root@out-container ~]# pidof unshare
2390
[root@out-container ~]# CPID=2390
[root@out-container ~]# ip link add name h$CPID type veth peer name c$CPID
[root@out-container ~]# ip l
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether 00:0c:29:7c:f4:a1 brd ff:ff:ff:ff:ff:ff
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default
    link/ether 02:42:12:70:3f:6e brd ff:ff:ff:ff:ff:ff
13: veth5472ca8@if12: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP mode DEFAULT group default
    link/ether ca:5b:ee:25:7e:17 brd ff:ff:ff:ff:ff:ff link-netnsid 0
14: c2390@h2390: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 7a:16:72:92:97:ea brd ff:ff:ff:ff:ff:ff
15: h2390@c2390: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether ca:c2:d1:86:8c:e1 brd ff:ff:ff:ff:ff:ff
[root@out-container ~]# ip link set c$CPID netns $CPID
[root@out-container ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:0c:29:7c:f4:a1 brd ff:ff:ff:ff:ff:ff
    inet 192.168.23.129/24 brd 192.168.23.255 scope global noprefixroute dynamic ens160
       valid_lft 1235sec preferred_lft 1235sec
    inet6 fe80::d72d:aac0:a50c:7cd8/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:12:70:3f:6e brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:12ff:fe70:3f6e/64 scope link
       valid_lft forever preferred_lft forever
13: veth5472ca8@if12: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether ca:5b:ee:25:7e:17 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::c85b:eeff:fe25:7e17/64 scope link
       valid_lft forever preferred_lft forever
15: h2390@if14: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether ca:c2:d1:86:8c:e1 brd ff:ff:ff:ff:ff:ff link-netnsid 1
[root@out-container ~]#
[root@out-container ~]#
[root@out-container ~]# ip link set h$CPID master docker0 up
[root@out-container ~]# ip l
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT group default qlen 1000
    link/ether 00:0c:29:7c:f4:a1 brd ff:ff:ff:ff:ff:ff
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default
    link/ether 02:42:12:70:3f:6e brd ff:ff:ff:ff:ff:ff
13: veth5472ca8@if12: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP mode DEFAULT group default
    link/ether ca:5b:ee:25:7e:17 brd ff:ff:ff:ff:ff:ff link-netnsid 0
15: h2390@if14: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue master docker0 state LOWERLAYERDOWN mode DEFAULT group default qlen 1000
    link/ether ca:c2:d1:86:8c:e1 brd ff:ff:ff:ff:ff:ff link-netnsid 1
[root@out-container ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:0c:29:7c:f4:a1 brd ff:ff:ff:ff:ff:ff
    inet 192.168.23.129/24 brd 192.168.23.255 scope global noprefixroute dynamic ens160
       valid_lft 1187sec preferred_lft 1187sec
    inet6 fe80::d72d:aac0:a50c:7cd8/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:12:70:3f:6e brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:12ff:fe70:3f6e/64 scope link
       valid_lft forever preferred_lft forever
13: veth5472ca8@if12: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
    link/ether ca:5b:ee:25:7e:17 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::c85b:eeff:fe25:7e17/64 scope link
       valid_lft forever preferred_lft forever
15: h2390@if14: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue master docker0 state LOWERLAYERDOWN group default qlen 1000
    link/ether ca:c2:d1:86:8c:e1 brd ff:ff:ff:ff:ff:ff link-netnsid 1

# 容器内
[root@in-container /]# ping 8.8.8.8
connect: Network is unreachable
[root@in-container /]# ip a
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
[root@in-container /]# ip l
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
14: c2390@if15: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 7a:16:72:92:97:ea brd ff:ff:ff:ff:ff:ff link-netnsid 0
[root@in-container /]# ip link set lo up
[root@in-container /]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
14: c2390@if15: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 7a:16:72:92:97:ea brd ff:ff:ff:ff:ff:ff link-netnsid 0
[root@in-container /]# ip link set c2390@if15 name eth0 up
Cannot find device "c2390@if15"
[root@in-container /]# ip link set c2390 name eth0 up
[root@in-container /]#
[root@in-container /]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
14: eth0@if15: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 7a:16:72:92:97:ea brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::7816:72ff:fe92:97ea/64 scope link
       valid_lft forever preferred_lft forever
[root@in-container /]# ip addr add 172.17.0.10/16 dev eth0
[root@in-container /]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
14: eth0@if15: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 7a:16:72:92:97:ea brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.1/16 scope global eth0
       valid_lft forever preferred_lft forever
    inet 172.17.0.10/16 scope global secondary eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::7816:72ff:fe92:97ea/64 scope link
       valid_lft forever preferred_lft forever

[root@in-container /]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
14: eth0@if15: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 7a:16:72:92:97:ea brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.10/16 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::7816:72ff:fe92:97ea/64 scope link
       valid_lft forever preferred_lft forever
[root@in-container /]# ip route add default via 172.17.0.1
[root@in-container /]# ping 8.8.8.8
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=127 time=28.8 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=127 time=28.3 ms
^C
--- 8.8.8.8 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 4ms
rtt min/avg/max/mdev = 28.257/28.522/28.787/0.265 ms


```

# 检查



```bash
# user
[root@in-container /]# id
uid=0(root) gid=0(root) groups=0(root)

# mnt 
[root@in-container /]# mount
/dev/mapper/centos_monther-root on / type xfs (rw,relatime,seclabel,attr2,inode64,noquota)
none on /proc type proc (rw,relatime)
[root@in-container /]#
# uts
[root@in-container /]# hostname
in-container
# ipc / pid
[root@in-container /]# ps -aux
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.0 115652  2144 ?        S    02:40   0:00 bash
root         68  0.0  0.0  47532  2052 ?        R+   02:55   0:00 ps -aux
# net
[root@in-container /]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
14: eth0@if15: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 7a:16:72:92:97:ea brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.10/16 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::7816:72ff:fe92:97ea/64 scope link
       valid_lft forever preferred_lft forever
[root@in-container /]# echo "nameserver 8.8.8.8" > /etc/resolv.conf
[root@in-container /]# ping baidu.com
PING baidu.com (110.242.68.66) 56(84) bytes of data.
64 bytes from 110.242.68.66 (110.242.68.66): icmp_seq=1 ttl=127 time=137 ms
64 bytes from 110.242.68.66 (110.242.68.66): icmp_seq=2 ttl=127 time=141 ms
64 bytes from 110.242.68.66 (110.242.68.66): icmp_seq=3 ttl=127 time=137 ms
^C
--- baidu.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 4ms
rtt min/avg/max/mdev = 136.686/138.160/140.786/1.885 ms
[root@in-container /]#



```



