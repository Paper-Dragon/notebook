# /proc详解

> 如果哪里都找不到就来内核文档看看吧
> - https://docs.kernel.org/filesystems/proc.html


> - 内容摘要：Linux系统上的/proc目录是一种文件系统，即proc文件系统。
>
> Linux系统上的/proc目录是一种文件系统，即proc文件系统。与其它常见的文件系统不同的是，/proc是一种伪文件系统（也即虚拟文件系统），存储的是当前内核运行状态的一系列特殊文件，用户可以通过这些文件查看有关系统硬件及当前正在运行进程的信息，甚至可以通过更改其中某些文件来改变内核的运行状态。
>
> 基于/proc文件系统如上所述的特殊性，其内的文件也常被称作虚拟文件，并具有一些独特的特点。例如，其中有些文件虽然使用查看命令查看时会返回大量信息，但文件本身的大小却会显示为0字节。此外，这些特殊文件中大多数文件的时间及日期属性通常为当前系统时间和日期，这跟它们随时会被刷新（存储于RAM中）有关。
>
> 为了查看及使用上的方便，这些文件通常会按照相关性进行分类存储于不同的目录甚至子目录中，如/proc/scsi目录中存储的就是当前系统上所有SCSI设备的相关信息，/proc/N中存储的则是系统当前正在运行的进程的相关信息，其中N为正在运行的进程（可以想象得到，在某进程结束后其相关目录则会消失）。
>
> 大多数虚拟文件可以使用文件查看命令如cat、more或者less进行查看，有些文件信息表述的内容可以一目了然，但也有文件的信息却不怎么具有可读性。不过，这些可读性较差的文件在使用一些命令如apm、free、lspci或top查看时却可以有着不错的表现。



## 一、     进程目录中的常见文件介绍

/proc目录中包含许多以数字命名的子目录，这些数字表示系统当前正在运行进程的进程号，里面包含对应进程相关的多个信息文件。



```bash
[root@nfs-service ~]# ll /proc/
total 0
dr-xr-xr-x  9 root    root                  0 Sep  4 07:54 1
dr-xr-xr-x  9 root    root                  0 Sep  4 07:54 10
......
dr-xr-xr-x  9 nginx   nginx                 0 Sep  4 07:54 995
dr-xr-xr-x  9 root    root                  0 Sep  4 07:54 996
dr-xr-xr-x  2 root    root                  0 Sep  4 07:54 acpi
dr-xr-xr-x  5 root    root                  0 Sep  4 07:54 asound
-r--r--r--  1 root    root                  0 Sep  4 08:03 buddyinfo
dr-xr-xr-x  4 root    root                  0 Sep  4 07:54 bus
-r--r--r--  1 root    root                  0 Sep  4 07:54 cgroups
-r--r--r--  1 root    root                  0 Sep  4 07:54 cmdline
-r--r--r--  1 root    root                  0 Sep  4 08:03 consoles
-r--r--r--  1 root    root                  0 Sep  4 07:54 cpuinfo
-r--r--r--  1 root    root                  0 Sep  4 08:03 crypto
-r--r--r--  1 root    root                  0 Sep  4 07:54 devices
-r--r--r--  1 root    root                  0 Sep  4 07:54 diskstats
-r--r--r--  1 root    root                  0 Sep  4 08:03 dma
dr-xr-xr-x  2 root    root                  0 Sep  4 08:03 driver
-r--r--r--  1 root    root                  0 Sep  4 08:03 execdomains
-r--r--r--  1 root    root                  0 Sep  4 08:03 fb
-r--r--r--  1 root    root                  0 Sep  4 07:54 filesystems
dr-xr-xr-x  8 root    root                  0 Sep  4 07:54 fs
-r--r--r--  1 root    root                  0 Sep  4 07:54 interrupts
-r--r--r--  1 root    root                  0 Sep  4 07:54 iomem
-r--r--r--  1 root    root                  0 Sep  4 08:03 ioports
dr-xr-xr-x 29 root    root                  0 Sep  4 07:54 irq
-r--r--r--  1 root    root                  0 Sep  4 07:54 kallsyms
-r--------  1 root    root    140737477890048 Sep  4 07:54 kcore
-r--r--r--  1 root    root                  0 Sep  4 08:03 keys
-r--r--r--  1 root    root                  0 Sep  4 08:03 key-users
-r--------  1 root    root                  0 Sep  4 08:03 kmsg
-r--------  1 root    root                  0 Sep  4 08:03 kpagecgroup
-r--------  1 root    root                  0 Sep  4 08:03 kpagecount
-r--------  1 root    root                  0 Sep  4 08:03 kpageflags
-r--r--r--  1 root    root                  0 Sep  4 07:54 loadavg
-r--r--r--  1 root    root                  0 Sep  4 08:03 locks
-r--r--r--  1 root    root                  0 Sep  4 08:03 mdstat
-r--r--r--  1 root    root                  0 Sep  4 07:54 meminfo
-r--r--r--  1 root    root                  0 Sep  4 07:54 misc
-r--r--r--  1 root    root                  0 Sep  4 08:03 modules
lrwxrwxrwx  1 root    root                 11 Sep  4 07:54 mounts -> self/mounts
-rw-r--r--  1 root    root                  0 Sep  4 07:54 mtrr
lrwxrwxrwx  1 root    root                  8 Sep  4 07:54 net -> self/net
-r--------  1 root    root                  0 Sep  4 08:03 pagetypeinfo
-r--r--r--  1 root    root                  0 Sep  4 08:03 partitions
-r--r--r--  1 root    root                  0 Sep  4 08:03 sched_debug
-r--r--r--  1 root    root                  0 Sep  4 08:03 schedstat
dr-xr-xr-x  3 root    root                  0 Sep  4 07:54 scsi
lrwxrwxrwx  1 root    root                  0 Sep  4 07:54 self -> 2954555
-r--------  1 root    root                  0 Sep  4 08:03 slabinfo
-r--r--r--  1 root    root                  0 Sep  4 08:03 softirqs
-r--r--r--  1 root    root                  0 Sep  4 07:54 stat
-r--r--r--  1 root    root                  0 Sep  4 07:54 swaps
dr-xr-xr-x  1 root    root                  0 Sep  4 07:54 sys
--w-------  1 root    root                  0 Sep  4 07:54 sysrq-trigger
dr-xr-xr-x  2 root    root                  0 Sep  4 08:03 sysvipc
lrwxrwxrwx  1 root    root                  0 Sep  4 07:54 thread-self -> 2954555/task/2954555
-r--------  1 root    root                  0 Sep  4 08:03 timer_list
dr-xr-xr-x  4 root    root                  0 Sep  4 07:54 tty
-r--r--r--  1 root    root                  0 Sep  4 08:00 uptime
-r--r--r--  1 root    root                  0 Sep  4 08:03 version
-r--------  1 root    root                  0 Sep  4 08:03 vmallocinfo
-r--r--r--  1 root    root                  0 Sep  4 08:00 vmstat
-r--r--r--  1 root    root                  0 Sep  4 08:03 zoneinfo
[root@nfs-service ~]#
```



上面列出的是/proc目录中一些进程相关的目录，每个目录中是当程本身相关信息的文件。下面是作者系统（RHEL8.5）上运行的一个PID为955的进程sshd的相关文件，其中有些文件是每个进程都会具有的，后文会对这些常见文件做出说明。

```bash
[root@nfs-service ~]# ll /proc/955/
total 0
dr-xr-xr-x 2 root root 0 Sep  4 07:54 attr
-rw-r--r-- 1 root root 0 Sep  9 09:36 autogroup
-r-------- 1 root root 0 Sep  9 09:36 auxv
-r--r--r-- 1 root root 0 Sep  4 07:54 cgroup
--w------- 1 root root 0 Sep  9 09:36 clear_refs
-r--r--r-- 1 root root 0 Sep  4 07:54 cmdline
-rw-r--r-- 1 root root 0 Sep  4 07:54 comm
-rw-r--r-- 1 root root 0 Sep  9 09:36 coredump_filter
-r--r--r-- 1 root root 0 Sep  9 09:36 cpu_resctrl_groups
-r--r--r-- 1 root root 0 Sep  9 09:36 cpuset
lrwxrwxrwx 1 root root 0 Sep  9 09:36 cwd -> /
-r-------- 1 root root 0 Sep  9 09:36 environ
lrwxrwxrwx 1 root root 0 Sep  4 07:54 exe -> /usr/sbin/sshd
dr-x------ 2 root root 0 Sep  4 07:54 fd
dr-x------ 2 root root 0 Sep  9 09:36 fdinfo
-rw-r--r-- 1 root root 0 Sep  9 09:36 gid_map
-r-------- 1 root root 0 Sep  9 09:36 io
-r--r--r-- 1 root root 0 Sep  9 09:36 limits
-rw-r--r-- 1 root root 0 Sep  4 07:54 loginuid
dr-x------ 2 root root 0 Sep  9 09:36 map_files
-r--r--r-- 1 root root 0 Sep  9 09:36 maps
-rw------- 1 root root 0 Sep  9 09:36 mem
-r--r--r-- 1 root root 0 Sep  9 09:36 mountinfo
-r--r--r-- 1 root root 0 Sep  9 09:36 mounts
-r-------- 1 root root 0 Sep  9 09:36 mountstats
dr-xr-xr-x 6 root root 0 Sep  9 09:36 net
dr-x--x--x 2 root root 0 Sep  7 13:14 ns
-r--r--r-- 1 root root 0 Sep  9 09:36 numa_maps
-rw-r--r-- 1 root root 0 Sep  9 09:36 oom_adj
-r--r--r-- 1 root root 0 Sep  9 09:36 oom_score
-rw-r--r-- 1 root root 0 Sep  4 07:54 oom_score_adj
-r-------- 1 root root 0 Sep  9 09:36 pagemap
-r-------- 1 root root 0 Sep  9 09:36 patch_state
-r-------- 1 root root 0 Sep  9 09:36 personality
-rw-r--r-- 1 root root 0 Sep  9 09:36 projid_map
lrwxrwxrwx 1 root root 0 Sep  9 09:36 root -> /
-rw-r--r-- 1 root root 0 Sep  9 09:36 sched
-r--r--r-- 1 root root 0 Sep  9 09:36 schedstat
-r--r--r-- 1 root root 0 Sep  4 07:54 sessionid
-rw-r--r-- 1 root root 0 Sep  9 09:36 setgroups
-r--r--r-- 1 root root 0 Sep  9 09:36 smaps
-r--r--r-- 1 root root 0 Sep  9 09:36 smaps_rollup
-r-------- 1 root root 0 Sep  9 09:36 stack
-r--r--r-- 1 root root 0 Sep  4 07:54 stat
-r--r--r-- 1 root root 0 Sep  9 09:36 statm
-r--r--r-- 1 root root 0 Sep  4 07:54 status
-r-------- 1 root root 0 Sep  9 09:36 syscall
dr-xr-xr-x 3 root root 0 Sep  9 09:36 task
-rw-r--r-- 1 root root 0 Sep  9 09:36 timens_offsets
-r--r--r-- 1 root root 0 Sep  9 09:36 timers
-rw-rw-rw- 1 root root 0 Sep  9 09:36 timerslack_ns
-rw-r--r-- 1 root root 0 Sep  9 09:36 uid_map
-r--r--r-- 1 root root 0 Sep  9 09:36 wchan

```

### 1.1、cmdline

> cmdline — 启动当前进程的完整命令，但僵尸进程目录中的此文件不包含任何信息；

```bash
[root@nfs-service ~]# more /proc/955/cmdline
/usr/sbin/sshdh.com,umac-128-etm@openssh.com,hmac-sha2-512-etm@openssh.com,hmac-sha2-256,hmac-sha1,umac-128@openssh.com,hmac-sha2-5126-,gss-group16-sha512-,gss-gex-sha1-,gss-group14-sha1-e-sha256,diffie-hellman-group14-sha256,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512,diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1cdsa-sha2-nistp256-cert-v01@openssh.com,ecdsa-sha2-nistp384,ecdsa-sha2-nistp384-cert-v01@openssh.com,ecdsa-sha2-nistp521,ecdsa-sha2-nistp521-cert-v01@openssh.com,ssh-ed25519,ssh-ed25519-cert-v01@openssh
.com,rsa-sha2-256,rsa-sha2-256-cert-v01@openssh.com,rsa-sha2-512,rsa-sha2-512-cert-v01@openssh.com,ssh-rsa,ssh-rsa-cert-v01@openssh.comrt-v01@openssh.com,ecdsa-sha2-nistp384,ecdsa-sha2-nistp384-cert-v01@openssh.com,ecdsa-sha2-nistp521,ecdsa-sha2-nistp521-cert-v01@openssh.com,ssh-ed25519,ssh-ed25519-cert-v01@openssh.com,rsa-sha2-256,rsa
-sha2-256-cert-v01@openssh.com,rsa-sha2-512,rsa-sha2-512-cert-v01@openssh.com,ssh-rsa,ssh-rsa-cert-v01@openssh.comed25519,rsa-sha2-256,rsa-sha2-512,ssh-rsa
[root@nfs-service ~]#

```

### 1.2、cwd

>  cwd — 指向当前进程运行目录的一个符号链接；

```bash
[root@nfs-service ~]# ll /proc/955/ | grep cwd
lrwxrwxrwx 1 root root 0 Sep  9 09:36 cwd -> /
[root@nfs-service ~]#
```

### 1.3、environ

> environ — 当前进程的环境变量列表，彼此间用空字符（NULL）隔开；变量用大写字母表示，其值用小写字母表示；

```bash
[root@nfs-service ~]# more /proc/955/environ
LANG=en_US.UTF-8gcm@openssh.com,chacha20-poly1305@openssh.com,aes256-ctr,aes256-cbc,aes128-gcm@openssh.com,aes128-ctr,aes128-cbc -oMACs=hmac-sha2-256-etm@openssh.com,hmac-sha1-etm@openssh.com,umac-128-etm@openssh.com,h
mac-sha2-512-etm@openssh.com,hmac-sha2-256,hmac-sha1,umac-128@openssh.com,hmac-sha2-512 -oGSSAPIKexAlgorithms=gss-curve25519-sha256-,gss-nistp256-sha256-,gss-group14-sha256-,gss-group16-sha512-,gss-gex-
sha1-,gss-group14-sha1- -oKexAlgorithms=curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group-exchange-sha256,diffie-hellman-group1
4-sha256,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512,diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1 -oHostKeyAlgorithms=ecdsa-sha2-nistp256,ecdsa-sha2-nistp256-cert-v01@o
penssh.com,ecdsa-sha2-nistp384,ecdsa-sha2-nistp384-cert-v01@openssh.com,ecdsa-sha2-nistp521,ecdsa-sha2-nistp521-cert-v01@openssh.com,ssh-ed25519,ssh-ed25519-cert-v01@openssh.com,rsa-sha2-256,rsa-sha2-25
6-cert-v01@openssh.com,rsa-sha2-512,rsa-sha2-512-cert-v01@openssh.com,ssh-rsa,ssh-rsa-cert-v01@openssh.com -oPubkeyAcceptedKeyTypes=ecdsa-sha2-nistp256,ecdsa-sha2-nistp256-cert-v01@openssh.com,ecdsa-sha
2-nistp384,ecdsa-sha2-nistp384-cert-v01@openssh.com,ecdsa-sha2-nistp521,ecdsa-sha2-nistp521-cert-v01@openssh.com,ssh-ed25519,ssh-ed25519-cert-v01@openssh.com,rsa-sha2-256,rsa-sha2-256-cert-v01@openssh.c
om,rsa-sha2-512,rsa-sha2-512-cert-v01@openssh.com,ssh-rsa,ssh-rsa-cert-v01@openssh.com -oCASignatureAlgorithms=ecdsa-sha2-nistp256,ecdsa-sha2-nistp384,ecdsa-sha2-nistp521,ssh-ed25519,rsa-sha2-256,rsa-sh
a2-512,ssh-rsa
[root@nfs-service ~]#
```

### 1.4、exe 

> exe — 指向启动当前进程的可执行文件（完整路径）的符号链接，通过/proc/N/exe可以启动当前进程的一个拷贝；

```bash
[root@nfs-service ~]# ll /proc/955/ | grep exe
lrwxrwxrwx 1 root root 0 Sep  4 07:54 exe -> /usr/sbin/sshd
```

### 1.5、fd 

> fd — 这是个目录，包含当前进程打开的每一个文件的文件描述符（file descriptor），这些文件描述符是指向实际文件的一个符号链接；

```bash
[root@nfs-service ~]# ll /proc/955/fd
total 0
lr-x------ 1 root root 64 Sep  4 07:54 0 -> /dev/null
lrwx------ 1 root root 64 Sep  4 07:54 1 -> 'socket:[29238]'
lrwx------ 1 root root 64 Sep  4 07:54 2 -> 'socket:[29238]'
lr-x------ 1 root root 64 Sep  4 07:54 3 -> '/var/lib/sss/mc/passwd (deleted)'
lrwx------ 1 root root 64 Sep  4 07:54 4 -> 'socket:[29351]'
lr-x------ 1 root root 64 Sep  4 07:54 5 -> '/var/lib/sss/mc/group (deleted)'
lrwx------ 1 root root 64 Sep  4 07:54 6 -> 'socket:[29353]'
```

### 1.6、limits

> limits — 当前进程所使用的每一个受限资源的软限制、硬限制和管理单元；此文件仅可由实际启动当前进程的UID用户读取；（2.6.24以后的内核版本支持此功能）；

```bash
[root@nfs-service ~]# more /proc/955/limits
Limit                     Soft Limit           Hard Limit           Units
Max cpu time              unlimited            unlimited            seconds
Max file size             unlimited            unlimited            bytes
Max data size             unlimited            unlimited            bytes
Max stack size            8388608              unlimited            bytes
Max core file size        0                    unlimited            bytes
Max resident set          unlimited            unlimited            bytes
Max processes             14390                14390                processes
Max open files            1024                 262144               files
Max locked memory         65536                65536                bytes
Max address space         unlimited            unlimited            bytes
Max file locks            unlimited            unlimited            locks
Max pending signals       14390                14390                signals
Max msgqueue size         819200               819200               bytes
Max nice priority         0                    0
Max realtime priority     0                    0
Max realtime timeout      unlimited            unlimited            us

```



1.7、maps

> maps — 当前进程关联到的每个可执行文件和库文件在内存中的映射区域及其访问权限所组成的列表；

```bash
[root@nfs-service ~]# cat /proc/955/maps
559725e27000-559725ef7000 r-xp 00000000 fd:00 884543                     /usr/sbin/sshd
5597260f6000-5597260fa000 r--p 000cf000 fd:00 884543                     /usr/sbin/sshd
5597260fa000-5597260fb000 rw-p 000d3000 fd:00 884543                     /usr/sbin/sshd
5597260fb000-559726100000 rw-p 00000000 00:00 0
5597269a6000-5597269e8000 rw-p 00000000 00:00 0                          [heap]
7fa8b5acd000-7fa8b616c000 r--s 00000000 fd:00 201914714                  /var/lib/sss/mc/group (deleted)
7fa8b616c000-7fa8b6177000 r-xp 00000000 fd:00 1603                       /usr/lib64/libnss_files-2.28.so
7fa8b6177000-7fa8b6377000 ---p 0000b000 fd:00 1603                       /usr/lib64/libnss_files-2.28.so
7fa8b6377000-7fa8b6378000 r--p 0000b000 fd:00 1603                       /usr/lib64/libnss_files-2.28.so
7fa8b6378000-7fa8b6379000 rw-p 0000c000 fd:00 1603                       /usr/lib64/libnss_files-2.28.so
7fa8b6379000-7fa8b637f000 rw-p 00000000 00:00 0
7fa8b637f000-7fa8b6c53000 r--s 00000000 fd:00 201914704                  /var/lib/sss/mc/passwd (deleted)
7fa8b6c53000-7fa8b6c5d000 r-xp 00000000 fd:00 744775                     /usr/lib64/libnss_sss.so.2
7fa8b6c5d000-7fa8b6e5c000 ---p 0000a000 fd:00 744775                     /usr/lib64/libnss_sss.so.2
7fa8b6e5c000-7fa8b6e5d000 r--p 00009000 fd:00 744775                     /usr/lib64/libnss_sss.so.2
7fa8b6e5d000-7fa8b6e5e000 rw-p 0000a000 fd:00 744775                     /usr/lib64/libnss_sss.so.2
7fa8b6e5e000-7fa8b6e7d000 r-xp 00000000 fd:00 1764                       /usr/lib64/libgpg-error.so.0.24.2
7fa8b6e7d000-7fa8b707d000 ---p 0001f000 fd:00 1764                       /usr/lib64/libgpg-error.so.0.24.2
7fa8b707d000-7fa8b707e000 r--p 0001f000 fd:00 1764                       /usr/lib64/libgpg-error.so.0.24.2
7fa8b707e000-7fa8b707f000 rw-p 00020000 fd:00 1764                       /usr/lib64/libgpg-error.so.0.24.2
7fa8b707f000-7fa8b7085000 r-xp 00000000 fd:00 1788                       /usr/lib64/libuuid.so.1.3.0
7fa8b7085000-7fa8b7285000 ---p 00006000 fd:00 1788                       /usr/lib64/libuuid.so.1.3.0
7fa8b7285000-7fa8b7286000 r--p 00006000 fd:00 1788                       /usr/lib64/libuuid.so.1.3.0
7fa8b7286000-7fa8b7287000 rw-p 00000000 00:00 0
7fa8b7287000-7fa8b72d4000 r-xp 00000000 fd:00 581003                     /usr/lib64/libblkid.so.1.1.0
7fa8b72d4000-7fa8b74d3000 ---p 0004d000 fd:00 581003                     /usr/lib64/libblkid.so.1.1.0
7fa8b74d3000-7fa8b74d8000 r--p 0004c000 fd:00 581003                     /usr/lib64/libblkid.so.1.1.0
7fa8b74d8000-7fa8b74d9000 rw-p 00051000 fd:00 581003                     /usr/lib64/libblkid.so.1.1.0
7fa8b74d9000-7fa8b74da000 rw-p 00000000 00:00 0
7fa8b74da000-7fa8b74dd000 r-xp 00000000 fd:00 2048                       /usr/lib64/libkeyutils.so.1.6
7fa8b74dd000-7fa8b76dc000 ---p 00003000 fd:00 2048                       /usr/lib64/libkeyutils.so.1.6
7fa8b76dc000-7fa8b76dd000 r--p 00002000 fd:00 2048                       /usr/lib64/libkeyutils.so.1.6
7fa8b76dd000-7fa8b76de000 rw-p 00000000 00:00 0
7fa8b76de000-7fa8b76ed000 r-xp 00000000 fd:00 580933                     /usr/lib64/libkrb5support.so.0.1
7fa8b76ed000-7fa8b78ed000 ---p 0000f000 fd:00 580933                     /usr/lib64/libkrb5support.so.0.1
7fa8b78ed000-7fa8b78ee000 r--p 0000f000 fd:00 580933                     /usr/lib64/libkrb5support.so.0.1
7fa8b78ee000-7fa8b78ef000 rw-p 00010000 fd:00 580933                     /usr/lib64/libkrb5support.so.0.1
7fa8b78ef000-7fa8b7972000 r-xp 00000000 fd:00 1365                       /usr/lib64/libpcre2-8.so.0.7.1
7fa8b7972000-7fa8b7b71000 ---p 00083000 fd:00 1365                       /usr/lib64/libpcre2-8.so.0.7.1
7fa8b7b71000-7fa8b7b72000 r--p 00082000 fd:00 1365                       /usr/lib64/libpcre2-8.so.0.7.1
7fa8b7b72000-7fa8b7b73000 rw-p 00083000 fd:00 1365                       /usr/lib64/libpcre2-8.so.0.7.1
7fa8b7b73000-7fa8b7b8e000 r-xp 00000000 fd:00 1605                       /usr/lib64/libpthread-2.28.so
7fa8b7b8e000-7fa8b7d8d000 ---p 0001b000 fd:00 1605                       /usr/lib64/libpthread-2.28.so
7fa8b7d8d000-7fa8b7d8e000 r--p 0001a000 fd:00 1605                       /usr/lib64/libpthread-2.28.so
7fa8b7d8e000-7fa8b7d8f000 rw-p 0001b000 fd:00 1605                       /usr/lib64/libpthread-2.28.so
7fa8b7d8f000-7fa8b7d93000 rw-p 00000000 00:00 0
7fa8b7d93000-7fa8b7daa000 r-xp 00000000 fd:00 1600874                    /usr/lib64/libgcc_s-8-20210514.so.1
7fa8b7daa000-7fa8b7fa9000 ---p 00017000 fd:00 1600874                    /usr/lib64/libgcc_s-8-20210514.so.1
7fa8b7fa9000-7fa8b7faa000 r--p 00016000 fd:00 1600874                    /usr/lib64/libgcc_s-8-20210514.so.1
7fa8b7faa000-7fa8b7fab000 rw-p 00017000 fd:00 1600874                    /usr/lib64/libgcc_s-8-20210514.so.1
7fa8b7fab000-7fa8b80c3000 r-xp 00000000 fd:00 1906                       /usr/lib64/libgcrypt.so.20.2.5
7fa8b80c3000-7fa8b82c2000 ---p 00118000 fd:00 1906                       /usr/lib64/libgcrypt.so.20.2.5
7fa8b82c2000-7fa8b82c4000 r--p 00117000 fd:00 1906                       /usr/lib64/libgcrypt.so.20.2.5
7fa8b82c4000-7fa8b82c9000 rw-p 00119000 fd:00 1906                       /usr/lib64/libgcrypt.so.20.2.5
7fa8b82c9000-7fa8b831f000 r-xp 00000000 fd:00 581213                     /usr/lib64/libmount.so.1.1.0
7fa8b831f000-7fa8b851e000 ---p 00056000 fd:00 581213                     /usr/lib64/libmount.so.1.1.0
7fa8b851e000-7fa8b8521000 r--p 00055000 fd:00 581213                     /usr/lib64/libmount.so.1.1.0
7fa8b8521000-7fa8b8522000 rw-p 00058000 fd:00 581213                     /usr/lib64/libmount.so.1.1.0
7fa8b8522000-7fa8b8523000 rw-p 00000000 00:00 0
7fa8b8523000-7fa8b852a000 r-xp 00000000 fd:00 1742                       /usr/lib64/libcap.so.2.48
7fa8b852a000-7fa8b8729000 ---p 00007000 fd:00 1742                       /usr/lib64/libcap.so.2.48
7fa8b8729000-7fa8b872a000 r--p 00006000 fd:00 1742                       /usr/lib64/libcap.so.2.48
7fa8b872a000-7fa8b872b000 rw-p 00007000 fd:00 1742                       /usr/lib64/libcap.so.2.48
7fa8b872b000-7fa8b8747000 r-xp 00000000 fd:00 1834                       /usr/lib64/liblz4.so.1.8.3
7fa8b8747000-7fa8b8946000 ---p 0001c000 fd:00 1834                       /usr/lib64/liblz4.so.1.8.3
7fa8b8946000-7fa8b8947000 r--p 0001b000 fd:00 1834                       /usr/lib64/liblz4.so.1.8.3
7fa8b8947000-7fa8b8948000 rw-p 00000000 00:00 0
7fa8b8948000-7fa8b896d000 r-xp 00000000 fd:00 1659                       /usr/lib64/liblzma.so.5.2.4
7fa8b896d000-7fa8b8b6d000 ---p 00025000 fd:00 1659                       /usr/lib64/liblzma.so.5.2.4
7fa8b8b6d000-7fa8b8b6e000 r--p 00025000 fd:00 1659                       /usr/lib64/liblzma.so.5.2.4
7fa8b8b6e000-7fa8b8b6f000 rw-p 00000000 00:00 0
7fa8b8b6f000-7fa8b8b76000 r-xp 00000000 fd:00 1609                       /usr/lib64/librt-2.28.so
7fa8b8b76000-7fa8b8d75000 ---p 00007000 fd:00 1609                       /usr/lib64/librt-2.28.so
7fa8b8d75000-7fa8b8d76000 r--p 00006000 fd:00 1609                       /usr/lib64/librt-2.28.so
7fa8b8d76000-7fa8b8d77000 rw-p 00007000 fd:00 1609                       /usr/lib64/librt-2.28.so
7fa8b8d77000-7fa8b8d7c000 r-xp 00000000 fd:00 1910                       /usr/lib64/libcap-ng.so.0.0.0
7fa8b8d7c000-7fa8b8f7b000 ---p 00005000 fd:00 1910                       /usr/lib64/libcap-ng.so.0.0.0
7fa8b8f7b000-7fa8b8f7c000 r--p 00004000 fd:00 1910                       /usr/lib64/libcap-ng.so.0.0.0
7fa8b8f7c000-7fa8b8f7d000 rw-p 00000000 00:00 0
7fa8b8f7d000-7fa8b9139000 r-xp 00000000 fd:00 1591                       /usr/lib64/libc-2.28.so
7fa8b9139000-7fa8b9338000 ---p 001bc000 fd:00 1591                       /usr/lib64/libc-2.28.so
7fa8b9338000-7fa8b933c000 r--p 001bb000 fd:00 1591                       /usr/lib64/libc-2.28.so
7fa8b933c000-7fa8b933e000 rw-p 001bf000 fd:00 1591                       /usr/lib64/libc-2.28.so
7fa8b933e000-7fa8b9342000 rw-p 00000000 00:00 0
7fa8b9342000-7fa8b9345000 r-xp 00000000 fd:00 1779                       /usr/lib64/libcom_err.so.2.1
7fa8b9345000-7fa8b9544000 ---p 00003000 fd:00 1779                       /usr/lib64/libcom_err.so.2.1
7fa8b9544000-7fa8b9545000 r--p 00002000 fd:00 1779                       /usr/lib64/libcom_err.so.2.1
7fa8b9545000-7fa8b9546000 rw-p 00003000 fd:00 1779                       /usr/lib64/libcom_err.so.2.1
7fa8b9546000-7fa8b955b000 r-xp 00000000 fd:00 580925                     /usr/lib64/libk5crypto.so.3.1
7fa8b955b000-7fa8b975a000 ---p 00015000 fd:00 580925                     /usr/lib64/libk5crypto.so.3.1
7fa8b975a000-7fa8b975c000 r--p 00014000 fd:00 580925                     /usr/lib64/libk5crypto.so.3.1
7fa8b975c000-7fa8b975d000 rw-p 00016000 fd:00 580925                     /usr/lib64/libk5crypto.so.3.1
7fa8b975d000-7fa8b9836000 r-xp 00000000 fd:00 580931                     /usr/lib64/libkrb5.so.3.3
7fa8b9836000-7fa8b9a36000 ---p 000d9000 fd:00 580931                     /usr/lib64/libkrb5.so.3.3
7fa8b9a36000-7fa8b9a45000 r--p 000d9000 fd:00 580931                     /usr/lib64/libkrb5.so.3.3
7fa8b9a45000-7fa8b9a47000 rw-p 000e8000 fd:00 580931                     /usr/lib64/libkrb5.so.3.3
7fa8b9a47000-7fa8b9a99000 r-xp 00000000 fd:00 580921                     /usr/lib64/libgssapi_krb5.so.2.2
7fa8b9a99000-7fa8b9c99000 ---p 00052000 fd:00 580921                     /usr/lib64/libgssapi_krb5.so.2.2
7fa8b9c99000-7fa8b9c9b000 r--p 00052000 fd:00 580921                     /usr/lib64/libgssapi_krb5.so.2.2
7fa8b9c9b000-7fa8b9c9c000 rw-p 00054000 fd:00 580921                     /usr/lib64/libgssapi_krb5.so.2.2
7fa8b9c9c000-7fa8b9cc3000 r-xp 00000000 fd:00 1371                       /usr/lib64/libselinux.so.1
7fa8b9cc3000-7fa8b9ec2000 ---p 00027000 fd:00 1371                       /usr/lib64/libselinux.so.1
7fa8b9ec2000-7fa8b9ec3000 r--p 00026000 fd:00 1371                       /usr/lib64/libselinux.so.1
7fa8b9ec3000-7fa8b9ec4000 rw-p 00027000 fd:00 1371                       /usr/lib64/libselinux.so.1
7fa8b9ec4000-7fa8b9ec6000 rw-p 00000000 00:00 0
7fa8b9ec6000-7fa8b9eda000 r-xp 00000000 fd:00 1607                       /usr/lib64/libresolv-2.28.so
7fa8b9eda000-7fa8ba0d9000 ---p 00014000 fd:00 1607                       /usr/lib64/libresolv-2.28.so
7fa8ba0d9000-7fa8ba0da000 r--p 00013000 fd:00 1607                       /usr/lib64/libresolv-2.28.so
7fa8ba0da000-7fa8ba0db000 rw-p 00014000 fd:00 1607                       /usr/lib64/libresolv-2.28.so
7fa8ba0db000-7fa8ba0dd000 rw-p 00000000 00:00 0
7fa8ba0dd000-7fa8ba0fd000 r-xp 00000000 fd:00 1677                       /usr/lib64/libcrypt.so.1.1.0
7fa8ba0fd000-7fa8ba2fc000 ---p 00020000 fd:00 1677                       /usr/lib64/libcrypt.so.1.1.0
7fa8ba2fc000-7fa8ba2fd000 r--p 0001f000 fd:00 1677                       /usr/lib64/libcrypt.so.1.1.0
7fa8ba2fd000-7fa8ba306000 rw-p 00000000 00:00 0
7fa8ba306000-7fa8ba31c000 r-xp 00000000 fd:00 1655                       /usr/lib64/libz.so.1.2.11
7fa8ba31c000-7fa8ba51c000 ---p 00016000 fd:00 1655                       /usr/lib64/libz.so.1.2.11
7fa8ba51c000-7fa8ba51d000 r--p 00016000 fd:00 1655                       /usr/lib64/libz.so.1.2.11
7fa8ba51d000-7fa8ba51e000 rw-p 00000000 00:00 0
7fa8ba51e000-7fa8ba520000 r-xp 00000000 fd:00 1613                       /usr/lib64/libutil-2.28.so
7fa8ba520000-7fa8ba720000 ---p 00002000 fd:00 1613                       /usr/lib64/libutil-2.28.so
7fa8ba720000-7fa8ba721000 r--p 00002000 fd:00 1613                       /usr/lib64/libutil-2.28.so
7fa8ba721000-7fa8ba722000 rw-p 00003000 fd:00 1613                       /usr/lib64/libutil-2.28.so
7fa8ba722000-7fa8ba725000 r-xp 00000000 fd:00 1593                       /usr/lib64/libdl-2.28.so
7fa8ba725000-7fa8ba924000 ---p 00003000 fd:00 1593                       /usr/lib64/libdl-2.28.so
7fa8ba924000-7fa8ba925000 r--p 00002000 fd:00 1593                       /usr/lib64/libdl-2.28.so
7fa8ba925000-7fa8ba926000 rw-p 00003000 fd:00 1593                       /usr/lib64/libdl-2.28.so
7fa8ba926000-7fa8babda000 r-xp 00000000 fd:00 581432                     /usr/lib64/libcrypto.so.1.1.1k
7fa8babda000-7fa8badda000 ---p 002b4000 fd:00 581432                     /usr/lib64/libcrypto.so.1.1.1k
7fa8badda000-7fa8bae06000 r--p 002b4000 fd:00 581432                     /usr/lib64/libcrypto.so.1.1.1k
7fa8bae06000-7fa8bae0a000 rw-p 002e0000 fd:00 581432                     /usr/lib64/libcrypto.so.1.1.1k
7fa8bae0a000-7fa8bae0f000 rw-p 00000000 00:00 0
7fa8bae0f000-7fa8baf4f000 r-xp 00000000 fd:00 580996                     /usr/lib64/libsystemd.so.0.23.0
7fa8baf4f000-7fa8bb14f000 ---p 00140000 fd:00 580996                     /usr/lib64/libsystemd.so.0.23.0
7fa8bb14f000-7fa8bb157000 r--p 00140000 fd:00 580996                     /usr/lib64/libsystemd.so.0.23.0
7fa8bb157000-7fa8bb158000 rw-p 00148000 fd:00 580996                     /usr/lib64/libsystemd.so.0.23.0
7fa8bb158000-7fa8bb159000 rw-p 00000000 00:00 0
7fa8bb159000-7fa8bb167000 r-xp 00000000 fd:00 581565                     /usr/lib64/libpam.so.0.84.2
7fa8bb167000-7fa8bb367000 ---p 0000e000 fd:00 581565                     /usr/lib64/libpam.so.0.84.2
7fa8bb367000-7fa8bb368000 r--p 0000e000 fd:00 581565                     /usr/lib64/libpam.so.0.84.2
7fa8bb368000-7fa8bb369000 rw-p 0000f000 fd:00 581565                     /usr/lib64/libpam.so.0.84.2
7fa8bb369000-7fa8bb388000 r-xp 00000000 fd:00 1912                       /usr/lib64/libaudit.so.1.0.0
7fa8bb388000-7fa8bb588000 ---p 0001f000 fd:00 1912                       /usr/lib64/libaudit.so.1.0.0
7fa8bb588000-7fa8bb589000 r--p 0001f000 fd:00 1912                       /usr/lib64/libaudit.so.1.0.0
7fa8bb589000-7fa8bb58a000 rw-p 00020000 fd:00 1912                       /usr/lib64/libaudit.so.1.0.0
7fa8bb58a000-7fa8bb59a000 rw-p 00000000 00:00 0
7fa8bb59a000-7fa8bb5c7000 r-xp 00000000 fd:00 1584                       /usr/lib64/ld-2.28.so
7fa8bb7b1000-7fa8bb7c2000 rw-p 00000000 00:00 0
7fa8bb7c7000-7fa8bb7c8000 r--p 0002d000 fd:00 1584                       /usr/lib64/ld-2.28.so
7fa8bb7c8000-7fa8bb7ca000 rw-p 0002e000 fd:00 1584                       /usr/lib64/ld-2.28.so
7fffce643000-7fffce664000 rw-p 00000000 00:00 0                          [stack]
7fffce778000-7fffce77c000 r--p 00000000 00:00 0                          [vvar]
7fffce77c000-7fffce77e000 r-xp 00000000 00:00 0                          [vdso]
ffffffffff600000-ffffffffff601000 r-xp 00000000 00:00 0                  [vsyscall]
[root@nfs-service ~]#

```

### 1.8、mem

> mem — 当前进程所占用的内存空间，由open、read和lseek等系统调用使用，不能被用户读取；

```bash
[root@nfs-service ~]# more /proc/955/mem
[root@nfs-service ~]# ll /proc/955/mem
-rw------- 1 root root 0 Sep  9 09:36 /proc/955/mem
```

### 1.9、root

> root — 指向当前进程运行根目录的符号链接；在Unix和Linux系统上，通常采用chroot命令使每个进程运行于独立的根目录；

### 1.10、stat

> stat — 当前进程的状态信息，包含一系统格式化后的数据列，可读性差，通常由ps命令使用；
>
> 

```bash
[root@nfs-service ~]# cat /proc/955/stat
955 (sshd) S 1 955 955 0 -1 4210944  //1~9
773 64864 18 19 0 0 273 106 //10~17
20 0 1 0 412 96800768 1916 18446744073709551615 //18~25
94107664019456 94107664870728 140736656186656 0 0 0 0 4096 81925 1 0 0 17 1 0 0 2 0 0 94107666968080 94107666982612 94107676073984 140736656192036 140736656193702 140736656193702 140736656195561 0

```

 pid： 进程ID. 
 comm: task_struct结构体的进程名 
 state: 进程状态, 此处为S 
 ppid: 父进程ID （父进程是指通过fork方式，通过clone并非父进程） 
 pgrp：进程组ID 
 session：进程会话组ID 
 tty_nr：当前进程的tty终点设备号 
 tpgid：控制进程终端的前台进程号 
 flags：进程标识位，定义在include/linux/sched.h中的PF_*, 此处等于1077952832 
 minflt： 次要缺页中断的次数，即无需从磁盘加载内存页. 比如COW和匿名页 
 cminflt：当前进程等待子进程的minflt 
 majflt：主要缺页中断的次数，需要从磁盘加载内存页. 比如map文件 
 majflt：当前进程等待子进程的majflt 
 utime: 该进程处于用户态的时间，单位jiffies，此处等于166114 
 stime: 该进程处于内核态的时间，单位jiffies，此处等于129684 
 cutime：当前进程等待子进程的utime 
 cstime: 当前进程等待子进程的utime 
 priority: 进程优先级, 此次等于10. 
 nice: nice值，取值范围[19, -20]，此处等于-10 
 num_threads: 线程个数, 此处等于221 
 itrealvalue: 该字段已废弃，恒等于0 
 starttime：自系统启动后的进程创建时间，单位jiffies，此处等于2284 
 vsize：进程的虚拟内存大小，单位为bytes 
 rss: 进程独占内存+共享库，单位pages，此处等于93087 
 rsslim: rss大小上限 
 说明：

第10~17行主要是随着时间而改变的量； 
 内核时间单位，sysconf(_SC_CLK_TCK)一般地定义为jiffies(一般地等于10ms) 
 starttime: 此值单位为jiffies, 结合/proc/stat的btime，可知道每一个线程启动的时间点 
 1500827856 + 2284/100 = 1500827856, 转换成北京时间为2017/7/24 0:37:58 
 第四行数据很少使用,只说一下该行第7至9个数的含义:

signal：即将要处理的信号，十进制，此处等于6660 
 blocked：阻塞的信号，十进制 
 sigignore：被忽略的信号，十进制，此处等于36088

### 1.11、statm

> statm — 当前进程占用内存的状态信息，通常以“页面”（page）表示；

### 1.12、status

> status — 与stat所提供信息类似，但可读性较好，如下所示，每行表示一个属性信息；其详细介绍请参见 proc的man手册页；

```bash
[root@nfs-service ~]# more /proc/955/status
Name:   sshd
Umask:  0022
State:  S (sleeping)
Tgid:   955
Ngid:   0
Pid:    955
PPid:   1
TracerPid:      0
Uid:    0       0       0       0
Gid:    0       0       0       0
FDSize: 64
Groups:
NStgid: 955
NSpid:  955
NSpgid: 955
NSsid:  955
VmPeak:    94532 kB
VmSize:    94532 kB
VmLck:         0 kB
VmPin:         0 kB
VmHWM:      7892 kB
VmRSS:      7664 kB
RssAnon:             944 kB
RssFile:            6720 kB
RssShmem:              0 kB
VmData:      728 kB
VmStk:       132 kB
VmExe:       832 kB
VmLib:     11092 kB
VmPTE:       196 kB
VmSwap:        0 kB
HugetlbPages:          0 kB
CoreDumping:    0
THP_enabled:    1
Threads:        1
SigQ:   2/14390
SigPnd: 0000000000000000
ShdPnd: 0000000000000000
SigBlk: 0000000000000000
SigIgn: 0000000000001000
SigCgt: 0000000180014005
CapInh: 0000000000000000
CapPrm: 000001ffffffffff
CapEff: 000001ffffffffff
CapBnd: 000001ffffffffff
CapAmb: 0000000000000000
NoNewPrivs:     0
Seccomp:        0
Speculation_Store_Bypass:       thread vulnerable
Cpus_allowed:   3
Cpus_allowed_list:      0-1
Mems_allowed:   00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,000000
00,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000001
Mems_allowed_list:      0
voluntary_ctxt_switches:        86
nonvoluntary_ctxt_switches:     24
[root@nfs-service ~]#
```



### 1.13、task

> task — 目录文件，包含由当前进程所运行的每一个线程的相关信息，每个线程的相关信息文件均保存在一个由线程号（tid）命名的目录中，这类似于其内容类似于每个进程目录中的内容；（内核2.6版本以后支持此功能）

```bash
[root@nfs-service ~]# ll /proc/955/task/
total 0
dr-xr-xr-x 7 root root 0 Sep  9 09:51 955
```



## 二、/proc目录下常见的文件介绍

### 2.1、/proc/apm

高级电源管理（APM）版本信息及电池相关状态信息，通常由apm命令使用；

### 2.2、/proc/buddyinfo

用于诊断内存碎片问题的相关信息文件；

### 2.3、/proc/cmdline

在启动时传递至内核的相关参数信息，这些信息通常由lilo或grub等启动管理工具进行传递；

```bash
[root@nfs-service ~]#  more /proc/cmdline
BOOT_IMAGE=(hd2,gpt2)/vmlinuz-4.18.0-372.9.1.el8.x86_64 root=/dev/mapper/rl-root ro crashkernel=auto resume=/dev/mapper/rl-swap rd.lvm.lv=rl/root rd.lvm.lv=rl/swap rhgb quiet
[root@nfs-service ~]#
```

### 2.4、/proc/cpuinfo

处理器的相关信息的文件；

```bash
[root@nfs-service ~]# cat /proc/cpuinfo
processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 60
model name      : Intel(R) Pentium(R) CPU G3220 @ 3.00GHz
stepping        : 3
microcode       : 0x28
cpu MHz         : 2993.090
cache size      : 3072 KB
physical id     : 0
siblings        : 2
core id         : 0
cpu cores       : 2
apicid          : 0
initial apicid  : 0
fpu             : yes
fpu_exception   : yes
cpuid level     : 13
wp              : yes
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx est tm2 ssse3 sdbg cx16 xtpr pdcm pcid sse4_1 sse4_2 movbe popcnt tsc_deadline_timer xsave rdrand lahf_lm abm cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust erms invpcid xsaveopt dtherm arat pln pts md_clear flush_l1d
bugs            : cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit srbds
bogomips        : 5986.10
clflush size    : 64
cache_alignment : 64
address sizes   : 39 bits physical, 48 bits virtual
power management:

processor       : 1
vendor_id       : GenuineIntel
.................................
```



### 2.5、/proc/crypto

系统上已安装的内核使用的密码算法及每个算法的详细信息列表；

```bash
[root@nfs-service ~]#  more /proc/crypto
name         : crct10dif
driver       : crct10dif-pclmul
module       : crct10dif_pclmul
priority     : 200
refcnt       : 2
selftest     : passed
internal     : no
type         : shash
blocksize    : 1
digestsize   : 2

name         : crc32
driver       : crc32-pclmul
module       : crc32_pclmul
priority     : 200
refcnt       : 1
selftest     : passed
internal     : no
type         : shash
blocksize    : 1
digestsize   : 4

name         : __ghash
driver       : cryptd(__ghash-pclmulqdqni)
module       : kernel
priority     : 50
refcnt       : 1
selftest     : passed
internal     : yes
type         : ahash
async        : yes
blocksize    : 16
digestsize   : 16

name         : ghash
driver       : ghash-clmulni

```



### 2.6、/proc/devices

系统已经加载的所有块设备和字符设备的信息，包含主设备号和设备组（与主设备号对应的设备类型）名；

```bash
[root@nfs-service ~]# more  /proc/devices
Character devices:
  1 mem
  4 /dev/vc/0
  4 tty
  4 ttyS
  5 /dev/tty
  5 /dev/console
  5 /dev/ptmx
  7 vcs
 10 misc
 13 input
 14 sound
 21 sg
 29 fb
116 alsa
128 ptm
136 pts
162 raw
180 usb
188 ttyUSB
189 usb_device
202 cpu/msr
203 cpu/cpuid
226 drm
241 mei
242 cec
243 aux
244 ipmidev
245 hidraw
246 usbmon
247 bsg
248 watchdog
249 ptp
250 pps
251 rtc
252 dax
253 tpm
254 gpiochip

Block devices:
  8 sd
  9 md
 65 sd
 66 sd
 67 sd
 68 sd
 69 sd
 70 sd
 71 sd
128 sd
129 sd
130 sd
131 sd
132 sd
133 sd
134 sd
135 sd
253 device-mapper
254 mdp
259 blkext

```


### 2.7、/proc/diskstats

每块磁盘设备的磁盘I/O统计信息列表；（内核2.5.69以后的版本支持此功能）

```bash
[root@nfs-service ~]#  cat /proc/diskstats
   8       0 sda 2030 584 435506 13205 1116887 1365054 21010720 7210996 0 6609766 7224202 0 0 0 0
   8       1 sda1 1968 584 431752 13111 833468 1365054 21010720 3229906 0 3099524 3243017 0 0 0 0
   8      16 sdb 141 0 9200 155 0 0 0 0 0 168 155 0 0 0 0
   8      17 sdb1 78 0 5406 85 0 0 0 0 0 104 85 0 0 0 0
   8      32 sdc 12343 1007 2184181 17347 88066 19976 1915607 273116 0 139805 290463 0 0 0 0
   8      33 sdc1 439 916 12562 361 2 0 2 3 0 94 364 0 0 0 0
   8      34 sdc2 227 1 88282 1124 10 0 4171 32 0 349 1157 0 0 0 0
   8      35 sdc3 11590 90 2078527 15828 72197 19976 1911434 219617 0 94978 235445 0 0 0 0
   8      48 sdd 141 0 9200 257 0 0 0 0 0 266 257 0 0 0 0
   8      49 sdd1 78 0 5406 84 0 0 0 0 0 103 84 0 0 0 0
 253       0 dm-0 11204 0 2068823 13161 107843 0 1911434 309011 0 139544 322172 0 0 0 0
 253       1 dm-1 97 0 4184 27 0 0 0 0 0 22 27 0 0 0 0
 253       2 dm-2 2367 0 426138 16314 2481449 0 21010720 8034669 0 6610107 8050983 0 0 0 0

```



### 2.8、/proc/dma

每个正在使用且注册的ISA DMA通道的信息列表；

```bash
[root@nfs-service ~]# cat /proc/dma
 4: cascade
```



### 2.9、/proc/execdomains

内核当前支持的执行域（每种操作系统独特“个性”）信息列表；

```bash
[root@nfs-service ~]#  more /proc/execdomains
0-0     Linux                   [kernel]

```





### 2.10、/proc/fb

帧缓冲设备列表文件，包含帧缓冲设备的设备号和相关驱动信息；

### 2.11、/proc/filesystems

当前被内核支持的文件系统类型列表文件，被标示为nodev的文件系统表示不需要块设备的支持；通常mount一个设备时，如果没有指定文件系统类型将通过此文件来决定其所需文件系统的类型；

```bash
[root@nfs-service ~]# more /proc/filesystems
nodev   sysfs
nodev   tmpfs
nodev   bdev
nodev   proc
nodev   cgroup
nodev   cgroup2
nodev   cpuset
nodev   devtmpfs
nodev   configfs
nodev   debugfs
nodev   tracefs
nodev   securityfs
nodev   sockfs
nodev   bpf
nodev   pipefs
nodev   ramfs
nodev   hugetlbfs
nodev   devpts
nodev   autofs
nodev   pstore
nodev   efivarfs
nodev   mqueue
        xfs
        fuseblk
nodev   fuse
nodev   fusectl
nodev   rpc_pipefs
nodev   nfsd
        vfat
        ext3
        ext2
        ext4
nodev   overlay
[root@nfs-service ~]#
```



### 2.12、/proc/interrupts

X86或X86_64体系架构系统上每个IRQ相关的中断号列表；多路处理器平台上每个CPU对于每个I/O设备均有自己的中断号；

```bash
[root@nfs-service ~]# more /proc/interrupts
           CPU0       CPU1
  0:         12          0   IO-APIC   2-edge      timer
  8:          0          1   IO-APIC   8-edge      rtc0
  9:          0          5   IO-APIC   9-fasteoi   acpi
 16:         29          0   IO-APIC  16-fasteoi   ehci_hcd:usb1
 18:          0          0   IO-APIC  18-fasteoi   i801_smbus
 23:          0         33   IO-APIC  23-fasteoi   ehci_hcd:usb2
 24:          0          0   PCI-MSI 458752-edge      PCIe PME
 25:          0          0   PCI-MSI 460800-edge      PCIe PME
 26:          0          0   PCI-MSI 327680-edge      xhci_hcd
 27:        449    6547313   PCI-MSI 409600-edge      eno1
 28:    1489574       7248   PCI-MSI 512000-edge      ahci[0000:00:1f.2]
 29:         41          0   PCI-MSI 32768-edge      i915
 30:          0         23   PCI-MSI 360448-edge      mei_me
 31:          0        241   PCI-MSI 442368-edge      snd_hda_intel:card0
NMI:        724        731   Non-maskable interrupts
LOC:  109800211  109964191   Local timer interrupts
SPU:          0          0   Spurious interrupts
PMI:        724        731   Performance monitoring interrupts
IWI:    3605065    3593859   IRQ work interrupts
RTR:          1          0   APIC ICR read retries
RES:    7980157    8085633   Rescheduling interrupts
CAL:    3924751    4032757   Function call interrupts
TLB:    3914417    4025149   TLB shootdowns
TRM:          0          0   Thermal event interrupts
THR:          0          0   Threshold APIC interrupts
DFR:          0          0   Deferred Error APIC interrupts
MCE:          0          0   Machine check exceptions
MCP:       1352       1353   Machine check polls
HYP:          0          0   Hypervisor callback interrupts
HRE:          0          0   Hyper-V reenlightenment interrupts
HVS:          0          0   Hyper-V stimer0 interrupts
ERR:          0
MIS:          0
PIN:          0          0   Posted-interrupt notification event
NPI:          0          0   Nested posted-interrupt event
PIW:          0          0   Posted-interrupt wakeup event

```



### 2.13、/proc/iomem

每个物理设备上的记忆体（RAM或者ROM）在系统内存中的映射信息；

```bash
[root@nfs-service ~]# more /proc/iomem
00000000-00000fff : Reserved
00001000-00057fff : System RAM
00058000-00058fff : Reserved
00059000-0009efff : System RAM
0009f000-0009ffff : Reserved
000a0000-000bffff : PCI Bus 0000:00
000c0000-000cebff : Video ROM
000cf000-000cffff : Adapter ROM
000d0000-000d0fff : Adapter ROM
000d8000-000dbfff : PCI Bus 0000:00
000dc000-000dffff : PCI Bus 0000:00
000f0000-000fffff : System ROM
00100000-d08b5fff : System RAM
  bc600000-bd201400 : Kernel code
  bd201401-be3ba6ff : Kernel data
  be9fd000-bf7fffff : Kernel bss
  c3000000-ceffffff : Crash kernel
d08b6000-d08fbfff : Reserved
d08fc000-d2eb0fff : System RAM
d2eb1000-d2eb7fff : ACPI Non-volatile Storage
d2eb8000-d32e7fff : System RAM
d32e8000-d3752fff : Reserved
d3753000-d5478017 : System RAM
d5478018-d5481257 : System RAM
d5481258-d5482017 : System RAM
d5482018-d5492057 : System RAM
d5492058-d7ed7fff : System RAM
d7ed8000-d7ffffff : Reserved
d8000000-d8760fff : System RAM
d8761000-d87fffff : Reserved
d8800000-d8faffff : System RAM
d8fb0000-d8ffffff : ACPI Tables
d9000000-da71ffff : System RAM
da720000-da7fffff : ACPI Non-volatile Storage
da800000-dbe0bfff : System RAM
dbe0c000-dbffffff : Reserved
  dbf79018-dbf7903e : APEI ERST
  dbf7903f-dbf7b03e : APEI ERST
dd000000-df1fffff : Reserved
  dd200000-df1fffff : Graphics Stolen Memory
df200000-feafffff : PCI Bus 0000:00
  df200000-df200fff : pnp 00:07
  e0000000-efffffff : 0000:00:02.0
  f7800000-f7bfffff : 0000:00:02.0
  f7c00000-f7c1ffff : 0000:00:19.0
    f7c00000-f7c1ffff : e1000e
  f7c20000-f7c2ffff : 0000:00:14.0
    f7c20000-f7c2ffff : xhci-hcd
  f7c30000-f7c33fff : 0000:00:1b.0
    f7c30000-f7c33fff : ICH HD audio
  f7c35000-f7c350ff : 0000:00:1f.3
  f7c36000-f7c367ff : 0000:00:1f.2
    f7c36000-f7c367ff : ahci
  f7c37000-f7c373ff : 0000:00:1d.0
    f7c37000-f7c373ff : ehci_hcd
  f7c38000-f7c383ff : 0000:00:1a.0
    f7c38000-f7c383ff : ehci_hcd
  f7c39000-f7c39fff : 0000:00:19.0
    f7c39000-f7c39fff : e1000e
  f7c3c000-f7c3c00f : 0000:00:16.0
    f7c3c000-f7c3c00f : mei_me
  f7ff0000-f7ff0fff : pnp 00:07
  f8000000-fbffffff : PCI MMCONFIG 0000 [bus 00-3f]
    f8000000-fbffffff : Reserved
      f8000000-fbffffff : pnp 00:07
fec00000-fec00fff : Reserved
  fec00000-fec003ff : IOAPIC 0
fed00000-fed03fff : Reserved
  fed00000-fed003ff : HPET 0
    fed00000-fed003ff : PNP0103:00
fed10000-fed17fff : pnp 00:07
fed18000-fed18fff : pnp 00:07
fed19000-fed19fff : pnp 00:07
fed1c000-fed1ffff : Reserved
  fed1c000-fed1ffff : pnp 00:07
    fed1f410-fed1f414 : iTCO_wdt.0.auto
      fed1f410-fed1f414 : iTCO_wdt.0.auto iTCO_wdt.0.auto
    fed1f800-fed1f9ff : intel-spi
fed20000-fed3ffff : pnp 00:07
fed40000-fed44fff : pnp 00:00
fed45000-fed8ffff : pnp 00:07
fed90000-fed93fff : pnp 00:07
fee00000-fee00fff : Local APIC
  fee00000-fee00fff : Reserved
ff000000-ffffffff : Reserved
  ff000000-ffffffff : INT0800:00
    ff000000-ffffffff : pnp 00:07
100000000-11edfffff : System RAM
11ee00000-11fffffff : RAM buffer
[root@nfs-service ~]#

```





### 2.14、/proc/ioports

当前正在使用且已经注册过的与物理设备进行通讯的输入-输出端口范围信息列表；如下面所示，第一列表示注册的I/O端口范围，其后表示相关的设备；

```bash
[root@nfs-service ~]# cat /proc/ioports
0000-0cf7 : PCI Bus 0000:00
  0000-001f : dma1
  0020-0021 : pic1
  0040-0043 : timer0
  0050-0053 : timer1
  0060-0060 : keyboard
  0064-0064 : keyboard
  0070-0077 : rtc0
  0080-008f : dma page reg
  00a0-00a1 : pic2
  00b2-00b2 : APEI ERST
  00c0-00df : dma2
  00f0-00ff : fpu
    00f0-00f0 : PNP0C04:00
  03f8-03ff : serial
  04d0-04d1 : pnp 00:05
  0680-069f : pnp 00:01
  0a00-0a0f : pnp 00:04
0cf8-0cff : PCI conf1
0d00-ffff : PCI Bus 0000:00
  164e-164f : pnp 00:01
  1800-18fe : pnp 00:01
    1800-1803 : ACPI PM1a_EVT_BLK
    1804-1805 : ACPI PM1a_CNT_BLK
    1808-180b : ACPI PM_TMR
    1820-182f : ACPI GPE0_BLK
    1830-1833 : iTCO_wdt.0.auto
      1830-1833 : iTCO_wdt
    1850-1850 : ACPI PM2_CNT_BLK
    1854-1857 : pnp 00:03
    1860-187f : iTCO_wdt.0.auto
      1860-187f : iTCO_wdt
  1c00-1cfe : pnp 00:01
  1d00-1dfe : pnp 00:01
  1e00-1efe : pnp 00:01
  1f00-1ffe : pnp 00:01
  f000-f03f : 0000:00:02.0
  f040-f05f : 0000:00:1f.3
    f040-f05f : i801_smbus
  f060-f07f : 0000:00:1f.2
    f060-f07f : ahci
  f080-f09f : 0000:00:19.0
  f0a0-f0a3 : 0000:00:1f.2
    f0a0-f0a3 : ahci
  f0b0-f0b7 : 0000:00:1f.2
    f0b0-f0b7 : ahci
  f0c0-f0c3 : 0000:00:1f.2
    f0c0-f0c3 : ahci
  f0d0-f0d7 : 0000:00:1f.2
    f0d0-f0d7 : ahci
  ffff-ffff : pnp 00:01
    ffff-ffff : pnp 00:01
      ffff-ffff : pnp 00:01

```



### 2.15、/proc/kallsyms

模块管理工具用来动态链接或绑定可装载模块的符号定义，由内核输出；（内核2.5.71以后的版本支持此功能）；通常这个文件中的信息量相当大；

```bash
[root@nfs-service ~]# head /proc/kallsyms
0000000000000000 A fixed_percpu_data
0000000000000000 A __per_cpu_start
0000000000001000 A cpu_debug_store
0000000000002000 A irq_stack_backing_store
0000000000006000 A cpu_tss_rw
0000000000009000 A gdt_page
000000000000a000 A exception_stacks
000000000000e000 A entry_stack_storage
000000000000f000 A espfix_waddr
000000000000f008 A espfix_stack
......
```



### 2.16、/proc/kcore

系统使用的物理内存，以ELF核心文件（core file）格式存储，其文件大小为已使用的物理内存（RAM）加上4KB；这个文件用来检查内核数据结构的当前状态，因此，通常由GBD通常调试工具使用，但不能使用文件查看命令打开此文件；

### 2.17、/proc/kmsg

此文件用来保存由内核输出的信息，通常由/sbin/klogd或/bin/dmsg等程序使用，**不要试图使用查看命令打开此文件**；

### 2.18、/proc/loadavg

保存关于CPU和磁盘I/O的负载平均值，其前三列分别表示每1秒钟、每5秒钟及每15秒的负载平均值，类似于uptime命令输出的相关信息；第四列是由斜线隔开的两个数值，前者表示当前正由内核调度的实体（进程和线程）的数目，后者表示系统当前存活的内核调度实体的数目；第五列表示此文件被查看前最近一个由内核创建的进程的PID；

```bash
[root@nfs-service ~]# more /proc/loadavg
0.02 0.02 0.00 1/261 2993987
[root@nfs-service ~]#

```



### 2.19、/proc/locks

保存当前由内核锁定的文件的相关信息，包含内核内部的调试数据；每个锁定占据一行，且具有一个惟一的编号；如下输出信息中每行的第二列表示当前锁定使用的锁定类别，

POSIX表示目前较新类型的文件锁，由lockf系统调用产生，

FLOCK是传统的UNIX文件锁，由flock系统调用产生；第三列也通常由两种类型，

ADVISORY表示不允许其他用户锁定此文件，但允许读取，

MANDATORY表示此文件锁定期间不允许其他用户任何形式的访问；

```bash
[root@nfs-service ~]# more /proc/locks
1: DELEG  ACTIVE    READ  1365 fd:02:141822312 0 EOF
2: DELEG  ACTIVE    READ  1365 fd:02:141821961 0 EOF
3: DELEG  ACTIVE    READ  1365 fd:02:141821962 0 EOF
4: DELEG  ACTIVE    READ  1365 fd:02:141822313 0 EOF
5: DELEG  ACTIVE    READ  1365 fd:02:141821670 0 EOF
6: DELEG  ACTIVE    READ  1365 fd:02:141821671 0 EOF
7: DELEG  ACTIVE    READ  1365 fd:02:141558759 0 EOF
8: DELEG  ACTIVE    READ  1365 fd:02:141558745 0 EOF
9: FLOCK  ADVISORY  WRITE 1194 fd:00:794298 0 EOF
10: FLOCK  ADVISORY  WRITE 1194 fd:00:794297 0 EOF
11: FLOCK  ADVISORY  WRITE 1194 fd:00:794296 0 EOF
12: FLOCK  ADVISORY  WRITE 1194 fd:00:794295 0 EOF
13: FLOCK  ADVISORY  WRITE 962 fd:00:134731997 0 EOF
14: FLOCK  ADVISORY  WRITE 1001 00:18:30203 0 EOF
15: POSIX  ADVISORY  WRITE 979 fd:00:202493831 0 0
16: DELEG  ACTIVE    READ  1365 fd:02:141822717 0 EOF
17: DELEG  ACTIVE    READ  1365 fd:02:141822510 0 EOF
18: DELEG  ACTIVE    READ  1365 fd:02:141822451 0 EOF
19: DELEG  ACTIVE    READ  1365 fd:02:141822720 0 EOF
20: FLOCK  ADVISORY  WRITE 1194 fd:00:202556082 0 EOF
21: POSIX  ADVISORY  WRITE 979 fd:00:202493826 0 0
22: POSIX  ADVISORY  WRITE 979 fd:00:202493824 0 0
23: FLOCK  ADVISORY  WRITE 856 00:18:25427 0 EOF
[root@nfs-service ~]#

```



### 2.20、/proc/mdstat

保存RAID相关的多块磁盘的当前状态信息，在没有使用RAID机器上，其显示为如下状态：

```bash
[root@nfs-service ~]# cat /proc/mdstat
Personalities :
unused devices: <none>

```





### 2.21、/proc/meminfo

系统中关于当前内存的利用状况等的信息，常由free命令使用；可以使用文件查看命令直接读取此文件，其内容显示为两列，前者为统计属性，后者为对应的值；

```bash
[root@nfs-service ~]# cat /proc/meminfo
MemTotal:        3727476 kB
MemFree:          385664 kB
MemAvailable:    2765716 kB
Buffers:          966540 kB
Cached:          1732128 kB
SwapCached:            0 kB
Active:          1568884 kB
Inactive:        1482712 kB
Active(anon):     120000 kB
Inactive(anon):   413684 kB
Active(file):    1448884 kB
Inactive(file):  1069028 kB
Unevictable:         136 kB
Mlocked:               0 kB
SwapTotal:             0 kB
SwapFree:              0 kB
Dirty:                36 kB
Writeback:             0 kB
AnonPages:        336668 kB
Mapped:           332412 kB
Shmem:            180752 kB
KReclaimable:     128016 kB
Slab:             177308 kB
SReclaimable:     128016 kB
SUnreclaim:        49292 kB
KernelStack:        4180 kB
PageTables:        10372 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:     1863736 kB
Committed_AS:    1403452 kB
VmallocTotal:   34359738367 kB
VmallocUsed:           0 kB
VmallocChunk:          0 kB
Percpu:             2656 kB
HardwareCorrupted:     0 kB
AnonHugePages:    176128 kB
ShmemHugePages:        0 kB
ShmemPmdMapped:        0 kB
FileHugePages:         0 kB
FilePmdMapped:         0 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
Hugetlb:               0 kB
DirectMap4k:      150156 kB
DirectMap2M:     3950592 kB
DirectMap1G:           0 kB

```



### 2.22、/proc/mounts

在内核2.4.29版本以前，此文件的内容为系统当前挂载的所有文件系统，在2.4.19以后的内核中引进了每个进程使用独立挂载名称空间的方式，此文件则随之变成了指向/proc/self/mounts（每个进程自身挂载名称空间中的所有挂载点列表）文件的符号链接；/proc/self是一个独特的目录，后文中会对此目录进行介绍；

```bash
[root@nfs-service ~]#  ll /proc |grep mount
lrwxrwxrwx  1 root    root                 11 Sep  4 07:54 mounts -> self/mounts

```

如下所示，其中第一列表示挂载的设备，第二列表示在当前目录树中的挂载点，第三点表示当前文件系统的类型，第四列表示挂载属性（ro或者rw），第五列和第六列用来匹配/etc/mtab文件中的转储（dump）属性；

 ```bash
 [root@nfs-service ~]# more /proc/mounts
 sysfs /sys sysfs rw,nosuid,nodev,noexec,relatime 0 0
 proc /proc proc rw,nosuid,nodev,noexec,relatime 0 0
 devtmpfs /dev devtmpfs rw,nosuid,size=1842060k,nr_inodes=460515,mode=755 0 0
 securityfs /sys/kernel/security securityfs rw,nosuid,nodev,noexec,relatime 0 0
 tmpfs /dev/shm tmpfs rw,nosuid,nodev 0 0
 devpts /dev/pts devpts rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000 0 0
 tmpfs /run tmpfs rw,nosuid,nodev,mode=755 0 0
 tmpfs /sys/fs/cgroup tmpfs ro,nosuid,nodev,noexec,mode=755 0 0
 cgroup /sys/fs/cgroup/systemd cgroup rw,nosuid,nodev,noexec,relatime,xattr,release_agent=/usr/lib/systemd/systemd-cgroups-agent,name=systemd 0 0
 pstore /sys/fs/pstore pstore rw,nosuid,nodev,noexec,relatime 0 0
 efivarfs /sys/firmware/efi/efivars efivarfs rw,nosuid,nodev,noexec,relatime 0 0
 bpf /sys/fs/bpf bpf rw,nosuid,nodev,noexec,relatime,mode=700 0 0
 cgroup /sys/fs/cgroup/perf_event cgroup rw,nosuid,nodev,noexec,relatime,perf_event 0 0
 cgroup /sys/fs/cgroup/cpuset cgroup rw,nosuid,nodev,noexec,relatime,cpuset 0 0
 cgroup /sys/fs/cgroup/devices cgroup rw,nosuid,nodev,noexec,relatime,devices 0 0
 cgroup /sys/fs/cgroup/blkio cgroup rw,nosuid,nodev,noexec,relatime,blkio 0 0
 cgroup /sys/fs/cgroup/pids cgroup rw,nosuid,nodev,noexec,relatime,pids 0 0
 cgroup /sys/fs/cgroup/hugetlb cgroup rw,nosuid,nodev,noexec,relatime,hugetlb 0 0
 cgroup /sys/fs/cgroup/net_cls,net_prio cgroup rw,nosuid,nodev,noexec,relatime,net_cls,net_prio 0 0
 cgroup /sys/fs/cgroup/memory cgroup rw,nosuid,nodev,noexec,relatime,memory 0 0
 cgroup /sys/fs/cgroup/cpu,cpuacct cgroup rw,nosuid,nodev,noexec,relatime,cpu,cpuacct 0 0
 cgroup /sys/fs/cgroup/freezer cgroup rw,nosuid,nodev,noexec,relatime,freezer 0 0
 cgroup /sys/fs/cgroup/rdma cgroup rw,nosuid,nodev,noexec,relatime,rdma 0 0
 none /sys/kernel/tracing tracefs rw,relatime 0 0
 configfs /sys/kernel/config configfs rw,relatime 0 0
 /dev/mapper/rl-root / xfs rw,relatime,attr2,inode64,logbufs=8,logbsize=32k,noquota 0 0
 systemd-1 /proc/sys/fs/binfmt_misc autofs rw,relatime,fd=28,pgrp=1,timeout=0,minproto=5,maxproto=5,direct,pipe_ino=20750 0 0
 mqueue /dev/mqueue mqueue rw,relatime 0 0
 hugetlbfs /dev/hugepages hugetlbfs rw,relatime,pagesize=2M 0 0
 debugfs /sys/kernel/debug debugfs rw,relatime 0 0
 fusectl /sys/fs/fuse/connections fusectl rw,relatime 0 0
 nfsd /proc/fs/nfsd nfsd rw,relatime 0 0
 /dev/sdc2 /boot xfs rw,relatime,attr2,inode64,logbufs=8,logbsize=32k,noquota 0 0
 /dev/sdc1 /boot/efi vfat rw,relatime,fmask=0077,dmask=0077,codepage=437,iocharset=ascii,shortname=winnt,errors=remount-ro 0 0
 /dev/mapper/data--storge--vg-data--storge--lv /data/nfs ext4 rw,relatime 0 0
 
 ```





### 2.23、/proc/modules

当前装入内核的所有模块名称列表，可以由lsmod命令使用，也可以直接查看；如下所示

第一列表示模块名，

第二列表示此模块占用内存空间大小，

第三列表示此模块有多少实例被装入，

第四列表示此模块依赖于其它哪些模块，

第五列表示此模块的装载状态（Live：已经装入；Loading：正在装入；Unloading：正在卸载），

第六列表示此模块在内核内存（kernel memory）中的偏移量；

```bash
[root@nfs-service ~]# more /proc/modules
xt_statistic 16384 6 - Live 0xffffffffc0e4a000
xt_nat 16384 11 - Live 0xffffffffc0e45000
ipt_REJECT 16384 0 - Live 0xffffffffc0e40000
nf_reject_ipv4 16384 1 ipt_REJECT, Live 0xffffffffc0cd8000
ip_set 49152 0 - Live 0xffffffffc0ccb000
ip_vs_sh 16384 0 - Live 0xffffffffc0cc3000
ip_vs_wrr 16384 0 - Live 0xffffffffc0cbb000
ip_vs_rr 16384 0 - Live 0xffffffffc0cb6000
ip_vs 172032 6 ip_vs_sh,ip_vs_wrr,ip_vs_rr, Live 0xffffffffc0e15000
ip6t_MASQUERADE 16384 1 - Live 0xffffffffc0cb1000
xt_comment 16384 80 - Live 0xffffffffc0cac000
xt_mark 16384 12 - Live 0xffffffffc0a5d000
xt_conntrack 16384 14 - Live 0xffffffffc0e10000
ipt_MASQUERADE 16384 4 - Live 0xffffffffc0e0b000
nf_conntrack_netlink 49152 0 - Live 0xffffffffc0dfe000
nft_counter 16384 109 - Live 0xffffffffc0df9000
xt_addrtype 16384 4 - Live 0xffffffffc0df4000
nft_compat 20480 155 - Live 0xffffffffc0ddf000
nft_chain_nat 16384 8 - Live 0xffffffffc0dda000
nf_nat 45056 4 xt_nat,ip6t_MASQUERADE,ipt_MASQUERADE,nft_chain_nat, Live 0xffffffffc0de8000
nf_conntrack 172032 7 xt_nat,ip_vs,ip6t_MASQUERADE,xt_conntrack,ipt_MASQUERADE,nf_conntrack_netlink,nf_nat, Live 0xffffffffc0daf000
nf_defrag_ipv6 20480 2 ip_vs,nf_conntrack, Live 0xffffffffc0d71000
nf_defrag_ipv4 16384 1 nf_conntrack, Live 0xffffffffc0d6c000
nf_tables 180224 248 nft_counter,nft_compat,nft_chain_nat, Live 0xffffffffc0d7e000
nfnetlink 16384 5 ip_set,nf_conntrack_netlink,nft_compat,nf_tables, Live 0xffffffffc0d67000
br_netfilter 24576 0 - Live 0xffffffffc0d77000
bridge 278528 1 br_netfilter, Live 0xffffffffc0d22000
stp 16384 1 bridge, Live 0xffffffffc0d1d000
llc 16384 2 bridge,stp, Live 0xffffffffc0d14000
overlay 139264 4 - Live 0xffffffffc0c89000
ext4 761856 1 - Live 0xffffffffc0bce000
vfat 20480 1 - Live 0xffffffffc0a55000
fat 81920 1 vfat, Live 0xffffffffc0bb9000
mbcache 16384 1 ext4, Live 0xffffffffc0a33000
jbd2 131072 1 ext4, Live 0xffffffffc0b98000
intel_rapl_msr 16384 0 - Live 0xffffffffc0a50000
intel_rapl_common 24576 1 intel_rapl_msr, Live 0xffffffffc0a3d000
x86_pkg_temp_thermal 16384 0 - Live 0xffffffffc0a38000
intel_powerclamp 16384 0 - Live 0xffffffffc0a2e000
coretemp 16384 0 - Live 0xffffffffc0a29000
kvm_intel 339968 0 - Live 0xffffffffc0b44000
kvm 905216 1 kvm_intel, Live 0xffffffffc0a66000
snd_hda_codec_realtek 147456 1 - Live 0xffffffffc0a04000
snd_hda_codec_generic 86016 1 snd_hda_codec_realtek, Live 0xffffffffc09ee000
iTCO_wdt 16384 0 - Live 0xffffffffc09e9000
ledtrig_audio 16384 1 snd_hda_codec_generic, Live 0xffffffffc09e4000
iTCO_vendor_support 16384 1 iTCO_wdt, Live 0xffffffffc09d7000
mei_wdt 16384 0 - Live 0xffffffffc09df000
snd_hda_intel 53248 0 - Live 0xffffffffc09b9000
snd_intel_dspcfg 24576 1 snd_hda_intel, Live 0xffffffffc08d3000
irqbypass 16384 1 kvm, Live 0xffffffffc09d2000
snd_intel_sdw_acpi 16384 1 snd_intel_dspcfg, Live 0xffffffffc09cd000
crct10dif_pclmul 16384 1 - Live 0xffffffffc09c8000
snd_hda_codec 155648 3 snd_hda_codec_realtek,snd_hda_codec_generic,snd_hda_intel, Live 0xffffffffc0992000
crc32_pclmul 16384 0 - Live 0xffffffffc098d000
snd_hda_core 102400 4 snd_hda_codec_realtek,snd_hda_codec_generic,snd_hda_intel,snd_hda_codec, Live 0xffffffffc0973000
......
```





### 2.24、/proc/partitions

块设备每个分区的主设备号（major）和次设备号（minor）等信息，同时包括每个分区所包含的块（block）数目（如下面输出中第三列所示）；

```bash
[root@nfs-service ~]# more /proc/partitions
major minor  #blocks  name

   8        0 3907018584 sda
   8        1 3907017543 sda1
   8       16 2930266584 sdb
   8       17 2930265543 sdb1
   8       32  125034840 sdc
   8       33     614400 sdc1
   8       34    1048576 sdc2
   8       35  123370496 sdc3
   8       48 2930266584 sdd
   8       49 2930265543 sdd1
 253        0  114978816 dm-0
 253        1    8388608 dm-1
 253        2 3850371072 dm-2

```



### 2.25、/proc/pci

内核初始化时发现的所有PCI设备及其配置信息列表，其配置信息多为某PCI设备相关IRQ信息，可读性不高，可以用“/sbin/lspci –vb”命令获得较易理解的相关信息；在2.6内核以后，此文件已为/proc/bus/pci目录及其下的文件代替；

```bash
[root@nfs-service ~]# ll /proc/bus/pci/
total 0
dr-xr-xr-x 2 root root 0 Sep  9 11:23 00
dr-xr-xr-x 2 root root 0 Sep  9 11:23 02
-r--r--r-- 1 root root 0 Sep  9 11:23 devices
[root@nfs-service ~]#

```



### 2.26、/proc/slabinfo

在内核中频繁使用的对象（如inode、dentry等）都有自己的cache，即slab pool，而/proc/slabinfo文件列出了这些对象相关slap的信息；详情可以参见内核文档中slapinfo的手册页；

```bash
[root@nfs-service ~]# more /proc/slabinfo
slabinfo - version: 2.1
# name            <active_objs> <num_objs> <objsize> <objperslab> <pagesperslab> : tunables <limit> <batchcount> <sharedfactor> : slabdata <active_slabs> <num_slabs> <share
davail>
ip_vs_conn             0      0    320   12    1 : tunables    0    0    0 : slabdata      0      0      0
pid_2                 96     96    128   32    1 : tunables    0    0    0 : slabdata      3      3      0
nf_conntrack_expect      0      0    248   16    1 : tunables    0    0    0 : slabdata      0      0      0
nf_conntrack         144    144    320   12    1 : tunables    0    0    0 : slabdata     12     12      0
nf-frags               0      0    224   18    1 : tunables    0    0    0 : slabdata      0      0      0
bridge_fdb_cache      32     32    128   32    1 : tunables    0    0    0 : slabdata      1      1      0
ovl_aio_req            0      0    128   32    1 : tunables    0    0    0 : slabdata      0      0      0
ovl_inode            308    308    736   22    4 : tunables    0    0    0 : slabdata     14     14      0
ext4_groupinfo_4k  29400  29400    144   28    1 : tunables    0    0    0 : slabdata   1050   1050      0
ext4_inode_cache    4617   4617   1176   27    8 : tunables    0    0    0 : slabdata    171    171      0
ext4_free_data       146    146     56   73    1 : tunables    0    0    0 : slabdata      2      2      0
ext4_allocation_context     64     64    128   32    1 : tunables    0    0    0 : slabdata      2      2      0
ext4_prealloc_space     78     78    104   39    1 : tunables    0    0    0 : slabdata      2      2      0
ext4_system_zone    1938   1938     40  102    1 : tunables    0    0    0 : slabdata     19     19      0
ext4_io_end          128    128     64   64    1 : tunables    0    0    0 : slabdata      2      2      0
ext4_pending_reservation      0      0     32  128    1 : tunables    0    0    0 : slabdata      0      0      0
ext4_extent_status   2244   2244     40  102    1 : tunables    0    0    0 : slabdata     22     22      0
fat_inode_cache       40     40    792   20    4 : tunables    0    0    0 : slabdata      2      2      0
fat_cache              0      0     40  102    1 : tunables    0    0    0 : slabdata      0      0      0
mbcache                0      0     56   73    1 : tunables    0    0    0 : slabdata      0      0      0
jbd2_transaction_s    208    208    256   16    1 : tunables    0    0    0 : slabdata     13     13      0
jbd2_inode           448    448     64   64    1 : tunables    0    0    0 : slabdata      7      7      0
jbd2_journal_handle    146    146     56   73    1 : tunables    0    0    0 : slabdata      2      2      0
jbd2_journal_head    170    170    120   34    1 : tunables    0    0    0 : slabdata      5      5      0
jbd2_revoke_table_s    256    256     16  256    1 : tunables    0    0    0 : slabdata      1      1      0
jbd2_revoke_record_s    256    256     32  128    1 : tunables    0    0    0 : slabdata      2      2      0
kvm_async_pf           0      0    168   24    1 : tunables    0    0    0 : slabdata      0      0      0
kvm_vcpu               0      0  10880    3    8 : tunables    0    0    0 : slabdata      0      0      0
kvm_mmu_page_header      0      0    184   22    1 : tunables    0    0    0 : slabdata      0      0      0
pte_list_desc          0      0    128   32    1 : tunables    0    0    0 : slabdata      0      0      0
x86_emulator           0      0   2672   12    8 : tunables    0    0    0 : slabdata      0      0      0
nfsd_drc               0      0    128   32    1 : tunables    0    0    0 : slabdata      0      0      0
nfs4_layout_stateid      0      0    312   13    1 : tunables    0    0    0 : slabdata      0      0      0
nfs4_layout            0      0     48   85    1 : tunables    0    0    0 : slabdata      0      0      0
nfsd4_odstate          0      0     40  102    1 : tunables    0    0    0 : slabdata      0      0      0
nfsd4_delegations     75     75    264   15    1 : tunables    0    0    0 : slabdata      5      5      0
nfsd4_stateids       216    216    168   24    1 : tunables    0    0    0 : slabdata      9      9      0
nfsd4_files          195    195    304   13    1 : tunables    0    0    0 : slabdata     15     15      0
nfsd4_lockowners      40     40    392   20    2 : tunables    0    0    0 : slabdata      2      2      0
nfsd4_openowners      36     36    432   18    2 : tunables    0    0    0 : slabdata      2      2      0
nfsd4_clients         22     22   1440   22    8 : tunables    0    0    0 : slabdata      1      1      0
rpc_inode_cache       46     46    704   23    4 : tunables    0    0    0 : slabdata      2      2      0
rpc_buffers           32     32   2048   16    8 : tunables    0    0    0 : slabdata      2      2      0
rpc_tasks             32     32    256   16    1 : tunables    0    0    0 : slabdata      2      2      0
fuse_request           0      0    152   26    1 : tunables    0    0    0 : slabdata      0      0      0
fuse_inode             0      0    896   18    4 : tunables    0    0    0 : slabdata      0      0      0
xfs_dqtrx              0      0    528   15    2 : tunables    0    0    0 : slabdata      0      0      0
xfs_dquot              0      0    496   16    2 : tunables    0    0    0 : slabdata      0      0      0
xfs_buf             3744   3744    448   18    2 : tunables    0    0    0 : slabdata    208    208      0
xfs_bui_item          20     20    200   20    1 : tunables    0    0    0 : slabdata      1      1      0
xfs_bud_item          24     24    168   24    1 : tunables    0    0    0 : slabdata      1      1      0
xfs_cui_item          38     38    424   19    2 : tunables    0    0    0 : slabdata      2      2      0
xfs_cud_item          48     48    168   24    1 : tunables    0    0    0 : slabdata      2      2      0

```





### 2.27、/proc/stat

实时追踪自系统上次启动以来的多种统计信息；如下所示，其中，
“cpu”行后的值分别表示以1/100（jiffies）秒为单位的统计值

实时追踪自系统上次启动以来的多种统计信息；如下所示，其中，
cpu指标 含义 
 user 用户态时间 
 nice 用户态时间(低优先级，nice>0) 
 system 内核态时间 
 idle 空闲时间 
 iowait I/O等待时间 
 irq 硬中断 
 softirq 软中断 

iowait时间是不可靠值，理由如下：

CPU不会等待I/O执行完成，而iowait是等待I/O完成的时间。 当CPU进入idle状态，很可能会调度另一个task执行，所以iowait计算时间偏小； 
 多核CPU，iowait的计算并非某一个核，因此计算每一个cpu的iowait非常困难； 
 相关资料：http://man7.org/linux/man-pages/man5/proc.5.html



“intr”行给出中断的信息，第一个为自系统启动以来，发生的所有的中断的次数；然后每个数对应一个特定的中断自系统启动以来所发生的次数；
“ctxt”给出了自系统启动以来CPU发生的上下文交换的次数。
“btime”给出了从系统启动到现在为止的时间，单位为秒；

另外：

```
cat /proc/uptime
82044.14 215440.9412
```

第一个值代表从开机到现在的累积时间(单位为秒), 开机后运行82044秒 
 第二个值代表从开机到现在的CPU空闲时间，单位为秒 
 技巧：结合btime获取当前的绝对时间,1500827856 + 82044 = 1500909900， 转换成北京时间2017/7/24 23:25:00，也就是当前执行命令cat /proc/uptime的时间点。“processes (total_forks) 自系统启动以来所创建的任务的个数目；

“procs_running”：当前运行队列的任务的数目；
“procs_blocked”：当前被阻塞的任务的数目；

```bash

[root@nfs-service ~]# more /proc/stat
cpu  707939 6801 332421 87034258 559799 158433 41805 0 0 0
cpu0 355382 2348 167099 43470316 329043 78069 17860 0 0 0
cpu1 352557 4452 165322 43563941 230756 80363 23944 0 0 0
intr 260183889 12 0 0 0 0 0 0 0 1 5 0 0 0 0 0 0 29 0 0 0 0 0 0 33 0 0 0 6602427 1503061 41 23 241 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
ctxt 504260613
btime 1662249280
processes 3002431
procs_running 1
procs_blocked 0
softirq 118450282 6 22747755 97770 6602430 1502432 0 71856 56172181 5087 31250765

```



### 2.28、/proc/swaps

当前系统上的交换分区及其空间利用信息，如果有多个交换分区的话，则会每个交换分区的信息分别存储于/proc/swap目录中的单独文件中，而其优先级数字越低，被使用到的可能性越大；下面是作者系统中只有一个交换分区时的输出信息；

```bash
[root@nfs-service ~]# more /proc/swaps
Filename                                Type            Size            Used            Priority
[root@nfs-service ~]#

```



### 2.29、/proc/uptime

系统上次启动以来的运行时间，如下所示，其第一个数字表示系统运行时间，第二个数字表示系统空闲时间，单位是秒；

```bash
[root@nfs-service ~]# more /proc/uptime
449092.43 880841.80
[root@nfs-service ~]#
```



### 2.30、/proc/version

当前系统运行的内核版本号，在作者的RHEL8.6上还会显示系统安装的gcc版本，如下所示；

```bash
[root@nfs-service ~]# more /proc/version
Linux version 4.18.0-372.9.1.el8.x86_64 (mockbuild@dal1-prod-builder001.bld.equ.rockylinux.org) (gcc version 8.5.0 20210514 (Red Hat 8.5.0-10) (GCC)) #1 SMP Tue May 10 14:4
8:47 UTC 2022
[root@nfs-service ~]#

```



### 2.31、/proc/vmstat

当前系统虚拟内存的多种统计数据，信息量可能会比较大，这因系统而有所不同，可读性较好；下面为作者机器上输出信息的一个片段；（2.6以后的内核支持此文件）

```bash
[root@nfs-service ~]# more /proc/vmstat
nr_free_pages 95069
nr_zone_inactive_anon 103504
nr_zone_active_anon 30000
nr_zone_inactive_file 267089
nr_zone_active_file 363547
nr_zone_unevictable 34
nr_zone_write_pending 8
nr_mlock 0
nr_bounce 0
nr_zspages 0
nr_free_cma 0
numa_hit 307003067
numa_miss 0
numa_foreign 0
numa_interleave 24517
numa_local 307003067
numa_other 0
nr_inactive_anon 103504
nr_active_anon 30000
nr_inactive_file 267089
nr_active_file 363547
nr_unevictable 34
nr_slab_reclaimable 32026
nr_slab_unreclaimable 12350
nr_isolated_anon 0
nr_isolated_file 0
workingset_nodes 1661
workingset_refault_anon 0
workingset_refault_file 14698
workingset_activate_anon 0
workingset_activate_file 11041
workingset_restore_anon 0
workingset_restore_file 2974
workingset_nodereclaim 128
nr_anon_pages 84208
nr_mapped 83769
nr_file_pages 675824
nr_dirty 8
nr_writeback 0
nr_writeback_temp 0
nr_shmem 45188
nr_shmem_hugepages 0
nr_shmem_pmdmapped 0
nr_file_hugepages 0
nr_file_pmdmapped 0
nr_anon_transparent_hugepages 86
nr_vmscan_write 0
nr_vmscan_immediate_reclaim 100
nr_dirtied 965473
nr_written 946309
nr_kernel_misc_reclaimable 0
nr_foll_pin_acquired 0
nr_foll_pin_released 0
nr_kernel_stack 4176
nr_page_table_pages 2609
nr_swapcached 0
[root@nfs-service ~]#

```





### 2.32、/proc/zoneinfo

内存区域（zone）的详细信息列表，信息量较大，下面列出的是一个输出片段：

```bash
[root@nfs-service ~]# more /proc/zoneinfo
Node 0, zone      DMA
  per-node stats
      nr_inactive_anon 103458
      nr_active_anon 30000
      nr_inactive_file 267094
      nr_active_file 363555
      nr_unevictable 34
      nr_slab_reclaimable 32027
      nr_slab_unreclaimable 12357
      nr_isolated_anon 0
      nr_isolated_file 0
      workingset_nodes 1661
      workingset_refault_anon 0
      workingset_refault_file 14698
      workingset_activate_anon 0
      workingset_activate_file 11041
      workingset_restore_anon 0
      workingset_restore_file 2974
      workingset_nodereclaim 128
      nr_anon_pages 84154
      nr_mapped    83752
      nr_file_pages 675837
      nr_dirty     20
      nr_writeback 0
      nr_writeback_temp 0
      nr_shmem     45188
      nr_shmem_hugepages 0
      nr_shmem_pmdmapped 0
      nr_file_hugepages 0
      nr_file_pmdmapped 0
      nr_anon_transparent_hugepages 86
      nr_vmscan_write 0
      nr_vmscan_immediate_reclaim 100
      nr_dirtied   965632
      nr_written   946453
      nr_kernel_misc_reclaimable 0
      nr_foll_pin_acquired 0
      nr_foll_pin_released 0
      nr_kernel_stack 4160
      nr_page_table_pages 2596
      nr_swapcached 0
  pages free     3712
        min      70
        low      87
        high     104
        spanned  4095
        present  3997
        managed  3840
        protection: (0, 3154, 3582, 3582, 3582)
      nr_free_pages 3712
      nr_zone_inactive_anon 0
      nr_zone_active_anon 0
      nr_zone_inactive_file 0
      nr_zone_active_file 0
      nr_zone_unevictable 0
      nr_zone_write_pending 0
      nr_mlock     0
      nr_bounce    0
      nr_zspages   0
      nr_free_cma  0
      numa_hit     329
      numa_miss    0
      numa_foreign 0
      numa_interleave 1
      numa_local   329
      numa_other   0
  pagesets
    cpu: 0
              count: 0
              high:  0
              batch: 1
  vm stats threshold: 4
    cpu: 1
              count: 0
              high:  0
              batch: 1
  vm stats threshold: 4
  node_unreclaimable:  0
  start_pfn:           1
Node 0, zone    DMA32
  pages free     88987
        min      14812
        low      18515
        high     22218
        spanned  1044480
        present  894627
        managed  818317
        protection: (0, 0, 428, 428, 428)
      nr_free_pages 88987
      nr_zone_inactive_anon 80893
      nr_zone_active_anon 27977
      nr_zone_inactive_file 241280
      nr_zone_active_file 336515
      nr_zone_unevictable 0
      nr_zone_write_pending 13
      nr_mlock     0
      nr_bounce    0
      nr_zspages   0
      nr_free_cma  0
      numa_hit     301745583
      numa_miss    0
      numa_foreign 0
      numa_interleave 1
      numa_local   301745583
      numa_other   0
  pagesets
    cpu: 0
              count: 141
              high:  378
              batch: 63
  vm stats threshold: 24
    cpu: 1
              count: 278
              high:  378
              batch: 63
  vm stats threshold: 24
  node_unreclaimable:  0
  start_pfn:           4096
Node 0, zone   Normal
  pages free     2515
        min      2012
        low      2515
        high     3018
        spanned  126464
        present  126464
        managed  109712
        protection: (0, 0, 0, 0, 0)
      nr_free_pages 2515
      nr_zone_inactive_anon 22565
      nr_zone_active_anon 2023
      nr_zone_inactive_file 25814
      nr_zone_active_file 27040
      nr_zone_unevictable 34
      nr_zone_write_pending 7
      nr_mlock     0
      nr_bounce    0
      nr_zspages   0
      nr_free_cma  0
      numa_hit     5305395
      numa_miss    0
      numa_foreign 0
      numa_interleave 24515
      numa_local   5305395
      numa_other   0
  pagesets
    cpu: 0
              count: 18
              high:  42
              batch: 7
  vm stats threshold: 12
    cpu: 1
              count: 41
              high:  42
              batch: 7
  vm stats threshold: 12
  node_unreclaimable:  0
  start_pfn:           1048576
Node 0, zone  Movable
  pages free     0
        min      0
        low      0
        high     0
        spanned  0
        present  0
        managed  0
        protection: (0, 0, 0, 0, 0)
Node 0, zone   Device
  pages free     0
        min      0
        low      0
        high     0
        spanned  0
        present  0
        managed  0
        protection: (0, 0, 0, 0, 0)
[root@nfs-service ~]#

```



## 三、/proc/sys目录详解

与/proc下其它文件的“只读”属性不同的是，管理员可对/proc/sys子目录中的许多文件内容进行修改以更改内核的运行特性，事先可以使用“ls -l”命令查看某文件是否“可写入”。写入操作通常使用类似于“echo DATA >  /path/to/your/filename”的格式进行。需要注意的是，即使文件可写，其一般也不可以使用编辑器进行编辑。

### 3.1、/proc/sys/debug 子目录

此目录通常是一空目录；

### 3.2、/proc/sys/dev 子目录

为系统上特殊设备提供参数信息文件的目录，其不同设备的信息文件分别存储于不同的子目录中，如大多数系统上都会具有的/proc/sys/dev/cdrom和/proc/sys/dev/raid（如果内核编译时开启了支持raid的功能） 目录，其内存储的通常是系统上cdrom和raid的相关参数信息文件。

 https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/5/html/deployment_guide/s3-proc-sys-fs

