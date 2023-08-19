KVM虚拟化部署完成了，接下来我们要做的就是创建一个KVM虚拟机，如何创建呢？本节课程主要讨论。

## 一、创建虚拟机方法

1. 通过virt-manager虚拟机管理工具创建
2. 通过web控制台创建虚拟机
3. 使用virt-install命令创建

### 1.1、通过virt-manager虚拟机管理工具创建

a、打开虚拟机管理工具(virt-manager),新建一个虚拟机

![virtmanager01.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029281905.png)

b、设置虚拟机的安装方法

![virtmanager02.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029292676.png)

c、设置虚拟机的安装光盘与安装系统类型

![virtmanager03.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029304562.png)

d、设置虚拟机的内存与CPU

![virtmanager04.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029318016.png)

e、设置虚拟机的磁盘

![virtmanager05.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029329814.png)

f、设置虚拟机的名称及网络

![virtmanager06.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029343926.png)

h、创建成功

![virtmanager07.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029354805.png)

### 1.2、使用web 控制台创建一个虚拟机

a、登陆cockpit web控制台

![cockpit_web登陆1.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029371661.png)

b、创建虚拟机

![cockpit_web创建虚拟机01.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029386547.png)

c、设置虚拟机硬件

![cockpit_web创建虚拟机02.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029401551.png)

d、创建成功

![cockpit_web创建虚拟机03.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601029412949.png)

### 1.3、使用virt-install创建一个虚拟机

virt-install是一个命令行工具，用于使用“libvirt”创建新的KVM、Xen或Linux容器guest

管理程序管理库。

virt-install命令是用来让用户可以通过shell命令行创建KVM虚拟机。

**创建虚拟机使用virt-install命令**

```
[root@zutuanxue ~]# virt-install --name tyschool_web1 --memory 2048 --vcpus 2 \
--disk size=10 --os-variant rhel8.0 --cdrom /cache/iso/CentOS-8-x86_64-1905-dvd1.iso  \
--graphics vnc,port=5980,listen=192.168.1.200,password=123456 --network \
network=default,mac=52:54:00:A7:9C:01 

--name 指定虚拟机名称 
--memory 内存容量  默认单位为MB
--vcpus  虚拟机CPU的数量，不要超过真机的核数   
--disk size=  虚拟机磁盘容量   默认单位GB
--os-variant  虚拟机系统版本
--cdrom  指定光驱中的光盘  
--graphics vnc,port=5980,listen=192.168.1.200,password=123456 VNC设置
--network network=default,mac=52:54:00:A7:9C:01    网络设置
```

**virt-install命令的用法**

```
virt-install {Options}

1、通用命令Options:
-n NAME, --name=NAME
新客户虚拟机实例名字，在连接的hypervisor已知的所有虚拟机中必须唯一，包括那些当前未活动的虚拟机。想要重新定义一个已存在的虚拟机，在运行‘virt-install’之前
使用virsh工具关闭（‘virsh shutdown’）和删除（‘virsh undefine’）此虚拟机。
 
-r MEMORY, --ram=MEMORY
以M为单位指定分配给虚拟机的内存大小，如果hypervisor没有足够的可用内存，它通常自动从主机操作系统使用的内存中获取，以满足此操作分配需要。

2、cpu设置
--arch=ARCH
为虚拟机请求一个非本地CPU架构，这个选项当前只对qemu客户机有效，但是不能够使用加速机制。如果忽略，在虚拟机中将使用主机CPU架构。
 
--vcpus=VCPUS
虚拟机的虚拟CPU数。不是所有hypervisor都支持SMP虚拟机，在这种情况下这个变量将被忽略。
 
--cpuset=CPUSET
设置哪个物理CPU能够被虚拟机使用。“CPUSET”是一个逗号分隔数字列表，也可以指定范围，例如：
 
0,2,3,5     : Use processors 0,2,3 and 5  --使用0，2，3 和5 处理器
1-3,5,6-8   : Use processors 1,2,3,5,6,7 and 8  --使用1，2，3，5，6，7，8
1-5，^3,8    : 使用处理器1、2、4、5和8
处理器
如果此参数值为‘auto’，virt-install将使用NUMA（非一致性内存访问）数据试图自动确定一个优化的CPU定位。

3、系统类型指定
--os-type=OS_TYPE
针对一类操作系统优化虚拟机配置（例如：‘linux’，‘windows’），这将试图选择最适合的ACPI与APIC设置，支持优化鼠标驱动，virtio以及通常适应其他操作系统特性。
参见"--os-variant" 选项
     
--os-variant=OS_VARIANT
针对特定操作系统变体（例如’fedora8’, ’winxp’）进一步优化虚拟机配置，这个参数是可选的并且不需要与 "--os-type"选项并用，有效值包括：
         linux
             debianetch
                 Debian Etch

             debianlenny
                 Debian Lenny

             fedora5
                 Fedora Core 5

             fedora6
                 Fedora Core 6

             fedora7
                 Fedora 7

             fedora8
                 Fedora 8

             fedora9
                 Fedora 9

             fedora10
                 Fedora 10

             fedora11
                 Fedora 11

             fedora12
                 Fedora 12

             generic24
                 Generic 2.4.x kernel
             
             generic26
                 Generic 2.6.x kernel

             virtio26
                 Generic 2.6.25 or later kernel with virtio

             rhel2.1
                 Red Hat Enterprise Linux 2.1

             rhel3
                 Red Hat Enterprise Linux 3

             rhel4
                 Red Hat Enterprise Linux 4

             rhel5
                 Red Hat Enterprise Linux 5

             rhel5.4
                 Red Hat Enterprise Linux 5.4 or later

             rhel6
                 Red Hat Enterprise Linux 6

             sles10
                 Suse Linux Enterprise Server

             ubuntuhardy
                 Ubuntu 8.04 LTS (Hardy Heron)

             ubuntuintrepid
                 Ubuntu 8.10 (Intrepid Ibex)

             ubuntujaunty
                 Ubuntu 9.04 (Jaunty Jackalope)

         other
             generic
                 Generic

             msdos
                 MS-DOS

             netware4
                 Novell Netware 4

             netware5
                 Novell Netware 5

             netware6
                 Novell Netware 6

         solaris
             opensolaris
                 Sun OpenSolaris

             solaris10
                 Sun Solaris 10

             solaris9
                 Sun Solaris 9

         unix
             freebsd6
                 Free BSD 6.x

             freebsd7
                 Free BSD 7.x

             openbsd4
                 Open BSD 4.x

         windows
             vista
                 Microsoft Windows Vista

             win2k
                 Microsoft Windows 2000

             win2k3
                 Microsoft Windows 2003

             win2k8
                 Microsoft Windows 2008

             winxp
                 Microsoft Windows XP (x86)

             winxp64
                 Microsoft Windows XP (x86_64)
       
--host-device=HOSTDEV
附加一个物理主机设备到客户机。HOSTDEV是随着libvirt使用的一个节点设备名（具体设备如’virsh nodedev-list’的显示的结果）
  
4、完全虚拟化特定选项（Full Virtualization specific options）
       在完全虚拟化客户机安装时的特定参数。
       --sound
         附加一个虚拟音频设备到客户机

       --noapic 
         覆盖操作系统类型/变体使APIC（Advanced Programmable Interrupt Controller）设置对全虚拟化无效。
        
       --noacpi
         覆盖操作系统类型/变体使ACPI（Advanced Configuration and Power Interface）设置对全虚拟化无效。
         

5、虚拟化类型选项（Virtualization Type options）
       这些选项覆盖默认虚拟化类型选择。      
       -v, --hvm
         如果在主机上全虚拟化和para 虚拟化（para-irtualization如何解释还没有定论，有人称之为半虚拟化），请求使用全虚拟化（full virtualization）。如果在
         一个没有硬件虚拟化支持的机器上连接Xen hypervisor，这个参数不可用，这个参数意指连接到一个基于qemu的hypervisor。
         
       -p, --paravirt
         这个参数意指构建一个paravirtualized客户机。如何主机既支持para又支持 full虚拟化，并且既没有指定本选项也没有指定"--hvm"选项，这个选项是假定选项。
         
       --accelerate
         当安装QEMU客户机时，如果支持可用KVM或KQEMU内核加速能力。除非一个客户机操作系统不兼容加速，这个选项是推荐最好加上。如果KVM和KQEMU都支持，KVM加速器优先使用。
      
6、安装方法选项（Installation Method options）

       -c CDROM, --cdrom=CDROM
         对应全虚拟化客户机，文件或设备作为一个虚拟化CD-ROM设备使用，可以是ISO映像路径或者一个CDROM设备，它也可以是一个能够提取/访问最小引导ISO映像的URL，
         URL使用与在 "--location" 选项中说明的相同的格式。如果一个CDROM已经通过 "--disk"选项指定，并且 "--cdrom"和其他任何选项都没有指定，"--disk" cdrom将作为安装媒介使用。
        
       -l LOCATION, --location=LOCATION
         客户虚拟机kernel+initrd 安装源。LOCATION使用以下格式：
         
         DIRECTORY
             指向一个包含可安装发行版映像的目录。
            
         nfs:host:/path or nfs://host/path
             指向包含可安装发行版映像的NFS服务器位置。
           
         http://host/path
             指向包含可安装发行版映像的http服务器位置。         

         ftp://host/path
             指向包含可安装发行版映像的FTP服务器位置。
       
         下面是指定几个特定发行版url的例子：        
Fedora/Red Hat Based:            			 https://download.fedoraproject.org/pub/fedora/linux/releases/29/Server/x86_64/os
Debian: https://ftp.us.debian.org/debian/dists/stable/main/installer-amd64/
Ubuntu: https://us.archive.ubuntu.com/ubuntu/dists/wily/main/installer-amd64/
Suse:              https://download.opensuse.org/pub/opensuse/distribution/leap/42.3/repo/oss/

       --pxe
         使用PXE（preboot execute environment）加载初始ramdisk 和 kernel，从而起动客户机安装过程。
        
       --import
         跳过操作系统安装过程，围绕一个存在的磁盘映像建立客户机。引导使用的设备是通过"--disk" or "--file"指定的第一个设备。
         
       --livecd
         指定安装媒介是一个可引导操作系统CD，因此需要将虚拟机配置成永不从CDROM引导。这也许需要与"--nodisks" 标准组合使用。
       
       -x EXTRA, --extra-args=EXTRA
         当执行从"--location"选项指定位置的客户机安装时，附加内核命令行参数到安装程序。
        
7、存储配置选项（Storage Configuration）

       --disk=DISKOPTS
         用不同的选项，指定作为客户机存储的媒介。通常的磁盘串格式是：
             --disk opt1=val1,opt2=val2,...

         要知道媒介，必须提供下面选项其中之一：
        
         path
             要使用的一个指向某些存在后不存在存储媒介的路径。存在的媒介可以是文件或块设备。如在远程主机安装，存在的媒介必须被共享为一个libvirt存储卷。
          
             指定一个不存在的路径意指试图建立一个新的存储，并且需要知道一个‘size’值。如果路径的基目录是一个在主机上的libvirt存储池，新存储将被建立为一个
             libvirt存储卷。对于远程主机，如果使用此方法，基目录需要是一个存储池。

         pool
             一个要在其上建立新存储的已有的libvirt存储池名，需要指定一个‘size’值。
         
         vol 
             要使用的一个已有的libvirt存储卷，指定格式类似’poolname/volname’
           
8、其他可用选项（Other available options）

         device
             磁盘设备类型。取值是’cdrom’, ’disk’, or ’floppy’，默认为 ’disk’。如果’cdrom’作为指定值并且没有选择安装方法，cdrom将被作为安装媒介。
           
         bus 
             磁盘总线类型，取值是’ide’, ’scsi’,’usb’, ’virtio’ 或 ’xen’，由于不是所有的hypervisor对所有总线类型都支持，因此默认值为依赖于所使用的hypervisor。

         perms
             磁盘权限，取值为’rw’ (读/写), ’ro’ (只读), or ’sh’ (共享 读/写)，默认值为’rw'
            
        size
             以GB为单位的新建存储大小。

         sparse
             指定建立的存储是否跳过完全分配。取值为 ’true’ 或 ’false’。           
             --所谓的完全分配是指在建立文件后即分配给其规定的所有空间，所谓的sparse是指根据使用情况逐渐增加空间。          
             初始时对客户机虚拟磁盘采用全分配策略（sparse=false）通常在客户机内部通过提供更快的安装时间获得平衡。因此在主机文件系统可能被填满时推荐使用
             此选项以确保高性能和避免I/O错误。
            
         cache
             使用缓存模式，，主机页面缓存提供内存缓存。此选项取值包括’none’, ’writethrough’, 或 ’writeback’， ’writethrough’提供读缓存，’writeback’提供
             读和写缓存。
         
         参加例子一节中的一些使用。这个选项屏蔽 "--file", "--file-size"和 "--nonsparse"选项。

       -f DISKFILE, --file=DISKFILE
         指向作为客户机虚拟磁盘后台存储的文件、磁盘分区或逻辑卷。这个选项与"--disk"选项指定一个即可。
        
         favor of "--disk".

       -s DISKSIZE, --file-size=DISKSIZE
         作为客户机虚拟磁盘的文件大小。这个选项不能与"--disk"选项同时使用。

       --nonsparse
         指定在建立存储时机分配全部空间。这个选项不能与"--disk"选项同时使用。
        
       --nodisks
         请求一个没有任何本地磁盘存储的虚拟机，典型应用在运行’Live CD’映像或安装到网络存储（iSCSI或NFS root）时。  
         
9、网络配置选项（Networking Configuration）

       -w NETWORK, --network=NETWORK
         连接客户机到主机网络。"NETWORK"可采用一下任何一种值：
        
         bridge:BRIDGE
             连接到主机上名称为"BRIDGE"的桥接设备。如果主机具有静态网络配置和客户机需要与局域网进行全面的入站出站连接时使用此选项。在客户机使用在线迁移时也使用此选项。
         
         network:NAME
             连接到主机上名称为"NAME"的虚拟网络。虚拟网络可以使用"virsh"命令行工具列出、建立和删除。未经修改的“libvirt”安装通常有一个名字为“default”的虚拟
             网络。在主机使用动态网络或无线网时使用虚拟网络。任何一个连接活动时客户机将通过地址转换将连接请求转到局域网。
             
         user
             使用SLIRP连接到局域网。只有没有特权的用户运行一个QEMU客户机时才使用本选项。这种方法从网络地址转换（NAT）提供了非常有限的方式。

         如果忽略此选项，将在客户机中建立一个单网络接口卡（NIC），如果在主机中有一个与物理网卡绑定的桥接设备，将用此设备进行网络连接。做不到这一点，被成之为
         "default"的虚拟网络将被使用。这个选项可以被指定多次从而设置多个网卡。

       -b BRIDGE, --bridge=BRIDGE
         指定连接客户机网卡的桥接设备。这个参数不能与 "--network"选项共同使用。指定
        
       -m MAC, --mac=MAC
         指定客户机网卡物理地址；如果忽略这个参数或者指定了值"RANDOM"，将随机产生一个适当的地址。对应基于Xen的虚拟机，物理地址中最先的3对必须是’00:16:3e’，
         而QEMU或KVM虚拟机必须是’54:52:00’。

       --nonetworks
         请求一个没有任何网卡的虚拟机。

10、图形化配置（Graphics Configuration）

       如果没有指定图形选项，在DISPLAY环境变量已经设置的情况下，"virt-install" 将默认使用--vnc选项，否则将使用--nographics选项。

       --vnc
         在客户机中设置一个虚拟控制台并且将其导出为一个VNC服务。除非"--vncport" 参数也已提供，VNC服务将运行在5900或其之上第一个未用的端口号。实际的VNC显示
         可以使用"virsh"的"vncdisplay"命令（或者使用virt-viewer处理这个细节）。
  
       --vncport=VNCPORT
         为客户机VNC控制台请求一个永久、静态的指定端口号。当其他客户机自动选择端口号时不鼓励使用此选项，因为可能产生冲突。
        
       --sdl
         在客户机中设置一个虚拟控制台并且在主机中显示一个SDL窗口来呈现输出。如果SDL窗口被关闭，客户机将被无条件终止。
      
       --nographics
         指定没有控制台被分配给客户机。全虚拟化客户机（Xen FV或者QEMU/KVM）将需要在客户机第一个串口有一个文本控制台配置（这可以通过--extra-args选项实现）。
         Xen PV将自动进行设置。命令’virsh console NAME’被用来连接串行设备。

       --noautoconsole
         使用本选项指定不自动试图连接到客户机控制台。默认行为是调用一个VNC客户端显示图形控制台，或者运行 "virsh" "console"命令显示文本控制台。
        
       -k KEYMAP, --keymap=KEYMAP
         请求将虚拟VNC控制台配置为非英语键盘布局。
        
11、Miscellaneous Options

       -d, --debug
         在安装过程中，打印调试信息到终端。即使忽略此选项，调试信息也保存在当前用户home目录下的.virtinst/virt-install.log文件中。 

       --noreboot
         防止域（虚拟机）在安装完成后自动重启。
         
       --wait=WAIT
         设置以分钟为单位的等待虚拟机完成其安装的时间。没有这个的选项，virt-install将等待控制台关闭（不必要指示客户机已经关闭），或者在--noautoconsole选项
         指定的情况下，简单地开始安装并退出。任何负值将使virt-install无限等待，0值将触发与--noauotoconsole选项相同的结果。如果超出时间限制，virt-install只是简单的退出，保留虚拟机在其当前状态。

       --force
         防止交互式提示。如果预期的提示为是/否，总是回答是。对应任何其他提示，应用将退出。
         
       --prompt
         提供交互模式，提示选择和输入建立虚拟机必要的信息。默认情况下提示功能是关闭的。
        
12、例子（EXAMPLES）
virt-install --name rhel9 \
--vcpus 2 \
--ram 1024 \
--disk  /var/lib/libvirt/images/rhel8.img --import  \
--graphics vnc,port=5909,listen=192.168.19.254 \
--os-variant rhel6 \
--virt-type kvm \
--network brIdge="br0",mac=52:54:00:A7:9C:09



--network network=defalut


#从物理机的光驱开始安装
virt-install --name rhel9 \
--vcpus 2 \
--ram 1024 \
--disk  /var/lib/libvirt/images/rhel8.img
--graphics vnc,port=5909,listen=192.168.19.254 \
--os-variant rhel6 \
--virt-type kvm \
--network network=default
--cdrom /dev/cdrom   

##使用镜像安装
virt-install --name rhel9 \
--vcpus 2 \
--ram 1024 \
--disk  /var/lib/libvirt/images/rhel8.img
--graphics vnc,port=5909,listen=192.168.19.254 \
--os-variant rhel6 \
--virt-type kvm \
--network network=default
--cdrom /tmp/rhel6.iso


##使用PXE安装

virt-install --name rhel9 \
--vcpus 2 \
--ram 1024 \
--disk  /var/lib/libvirt/images/rhel8.img,size=10,format=raw \
--graphics vnc,port=5909,listen=192.168.19.254 \
--os-variant rhel6 \
--virt-type kvm \
--network network=default
--location ftp://192.168.122.1/pub 
```

## 二、KVM相关目录及虚拟机配置文件

### 2.1、相关目录及文件

KVM虚拟机目录: /var/lib/libvirt/

镜像及磁盘目录: /var/lib/libvirt/images

libvirt目录：/etc/libvirt

```
[root@zutuanxue libvirt]# tree
.
├── libvirt-admin.conf
├── libvirt.conf	针对virsh命令主要是关于客户端的配置文件,一般默认的就满足要求了
├── libvirtd.conf 主要是针对服务器端的配置文件,它提供了不同的安全选项,请求限制和日志选项。
├── nwfilter   网络管理
│   ├── allow-arp.xml
│   ├── allow-dhcp-server.xml
│   ├── allow-dhcp.xml
│   ├── allow-incoming-ipv4.xml
│   ├── allow-ipv4.xml
│   ├── clean-traffic-gateway.xml
│   ├── clean-traffic.xml
│   ├── no-arp-ip-spoofing.xml
│   ├── no-arp-mac-spoofing.xml
│   ├── no-arp-spoofing.xml
│   ├── no-ip-multicast.xml
│   ├── no-ip-spoofing.xml
│   ├── no-mac-broadcast.xml
│   ├── no-mac-spoofing.xml
│   ├── no-other-l2-traffic.xml
│   ├── no-other-rarp-traffic.xml
│   ├── qemu-announce-self-rarp.xml
│   └── qemu-announce-self.xml
├── qemu  
│   ├── networks   虚拟机网络相关配置文件
│   │   ├── autostart
│   │   │   └── default.xml -> ../default.xml
│   │   └── default.xml
│   └── tyschool_web1.xml   虚拟机配置文件
├── qemu.conf			qemu配置文件
├── qemu-lockd.conf
├── secrets
├── storage				虚拟机存储域
│   ├── autostart
│   │   ├── default.xml -> /etc/libvirt/storage/default.xml
│   │   └── ISO.xml -> /etc/libvirt/storage/ISO.xml
│   ├── default.xml
│   └── ISO.xml
├── virtlockd.conf
└── virtlogd.conf
```

### 2.2、虚拟机配置文件

[root@zutuanxue ~]# cat /etc/libvirt/qemu/tyschool_web1.xml

```
[root@zutuanxue ~]# cat /etc/libvirt/qemu/tyschool_web1.xml 
<!--
WARNING: THIS IS AN AUTO-GENERATED FILE. CHANGES TO IT ARE LIKELY TO BE
OVERWRITTEN AND LOST. Changes to this xml configuration should be made using:
  virsh edit tyschool_web1
or other application using the libvirt API.
-->
虚拟化类型  kvm
<domain type='kvm'>
	虚拟机名字
  <name>tyschool_web1</name>
  虚拟机UUID
  <uuid>78d9ca74-3ab3-44b3-99f6-12ca3e315fab</uuid>
  <metadata>
    <libosinfo:libosinfo xmlns:libosinfo="http://libosinfo.org/xmlns/libvirt/domain/1.0">
      <libosinfo:os id="http://redhat.com/rhel/8.0"/>
    </libosinfo:libosinfo>
  </metadata>
  
  内存单位 最大分配内存数量
  <memory unit='KiB'>2097152</memory>
  当前内存
  <currentMemory unit='KiB'>2097152</currentMemory>
  CPU数量
  <vcpu placement='static'>2</vcpu>
  <resource>
    <partition>/machine</partition>
  </resource>
  
  <os>
    虚拟机架构
    <type arch='x86_64' machine='pc-q35-rhel7.6.0'>hvm</type>
    引导方式启动设备
    <boot dev='hd'/>
  </os>
  <features>
    <acpi/>
    <apic/>
  </features>
 
 CPU功能
  <cpu mode='custom' match='exact' check='full'>
    <model fallback='forbid'>Haswell-noTSX-IBRS</model>
    <vendor>Intel</vendor>
    <feature policy='require' name='vme'/>
    <feature policy='require' name='ss'/>
    <feature policy='require' name='vmx'/>
    <feature policy='require' name='f16c'/>
    <feature policy='require' name='rdrand'/>
    <feature policy='require' name='hypervisor'/>
    <feature policy='require' name='arat'/>
    <feature policy='require' name='tsc_adjust'/>
    <feature policy='require' name='umip'/>
    <feature policy='require' name='md-clear'/>
    <feature policy='require' name='stibp'/>
    <feature policy='require' name='arch-capabilities'/>
    <feature policy='require' name='ssbd'/>
    <feature policy='require' name='xsaveopt'/>
    <feature policy='require' name='pdpe1gb'/>
    <feature policy='require' name='abm'/>
    <feature policy='require' name='skip-l1dfl-vmentry'/>
  </cpu>
  
  时钟设置
  <clock offset='utc'>
    <timer name='rtc' tickpolicy='catchup'/>
    <timer name='pit' tickpolicy='delay'/>
    <timer name='hpet' present='no'/>
  </clock>
 
 面板按钮
  <on_poweroff>destroy</on_poweroff>
  <on_reboot>restart</on_reboot>
  <on_crash>destroy</on_crash>
  <pm>
    <suspend-to-mem enabled='no'/>  
    <suspend-to-disk enabled='no'/>
  </pm>
  
 虚拟机设备
  <devices>
    <emulator>/usr/libexec/qemu-kvm</emulator>   仿真
    
    磁盘来自系统文件
    <disk type='file' device='disk'>
    	磁盘类型为qcow2
      <driver name='qemu' type='qcow2'/>
      磁盘文件的位置
      <source file='/var/lib/libvirt/images/tyschool_web1.qcow2'/>
      磁盘总线使用的是virtio
      <target dev='vda' bus='virtio'/>
      <address type='pci' domain='0x0000' bus='0x04' slot='0x00' function='0x0'/>
    </disk>
    
    光驱设置 
    <disk type='file' device='cdrom'>
      <driver name='qemu' type='raw'/>
      <target dev='sda' bus='sata'/>
      <readonly/>
      <address type='drive' controller='0' bus='0' target='0' unit='0'/>
    </disk>
    
    接口设置
    usb总线
    <controller type='usb' index='0' model='qemu-xhci' ports='15'>
      <address type='pci' domain='0x0000' bus='0x02' slot='0x00' function='0x0'/>
    </controller>
    
    sata总线
    <controller type='sata' index='0'>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x1f' function='0x2'/>
    </controller>
    
    <controller type='pci' index='0' model='pcie-root'/>
    <controller type='pci' index='1' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='1' port='0x10'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x0' multifunction='on'/>
    </controller>
    <controller type='pci' index='2' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='2' port='0x11'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x1'/>  第一个PCI接口
    </controller>
    <controller type='pci' index='3' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='3' port='0x12'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x2'/>  第二个PCI接口
    </controller>
    <controller type='pci' index='4' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='4' port='0x13'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x3'/>   第三个PCI接口
    </controller>
    <controller type='pci' index='5' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='5' port='0x14'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x4'/>    第四个PCI接口
    </controller>
    <controller type='pci' index='6' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='6' port='0x15'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x5'/>    第五个PCI接口
    </controller>
    <controller type='pci' index='7' model='pcie-root-port'>
      <model name='pcie-root-port'/>
      <target chassis='7' port='0x16'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x6'/>    第六个PCI接口
    </controller>
    <controller type='virtio-serial' index='0'>
      <address type='pci' domain='0x0000' bus='0x03' slot='0x00' function='0x0'/>
    </controller>
    
    网卡设置
    <interface type='network'>
      <mac address='52:54:00:a7:9c:01'/>   MAC地址
      <source network='default'/>					网络连接方式
      <model type='virtio'/>							网卡总线
      <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
    </interface>
    
    串口设置
    <serial type='pty'>
      <target type='isa-serial' port='0'>
        <model name='isa-serial'/>
      </target>
    </serial>
    <console type='pty'>
      <target type='serial' port='0'/>
    </console>
    信道qemu-ga
    <channel type='unix'>
      <target type='virtio' name='org.qemu.guest_agent.0'/>
      <address type='virtio-serial' controller='0' bus='0' port='1'/>
    </channel>
    USB设置
    <input type='tablet' bus='usb'>
      <address type='usb' bus='0' port='1'/>
    </input>
    
    <input type='mouse' bus='ps2'/>   鼠标
    <input type='keyboard' bus='ps2'/>  键盘
    
    图形设置
    <graphics type='vnc' port='5980' autoport='no' listen='192.168.1.200' passwd='123456'>  图形VNC设置
      <listen type='address' address='192.168.1.200'/>
    </graphics>
    
    <video> 声卡设置
      <model type='qxl' ram='65536' vram='65536' vgamem='16384' heads='1' primary='yes'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x0'/>
    </video>    
    
    <memballoon model='virtio'>
      <address type='pci' domain='0x0000' bus='0x05' slot='0x00' function='0x0'/>
    </memballoon>
    
    随机数生成器
    <rng model='virtio'>
      <backend model='random'>/dev/urandom</backend>
      <address type='pci' domain='0x0000' bus='0x06' slot='0x00' function='0x0'/>
    </rng>
  </devices>
</domain>
```