## 一、BIOS与UEFI

**BIOS**

Basic Input Output System的缩写，翻译过来就是“基本输入输出系统”，是一种业界标准的固件接口，第一次出现在1975年，是计算机启动时加载的第一个程序，主要功能是检测和设置计算机硬件，引导系统启动。

**UEFI**
Unified Extensible Firmware interface的缩写，翻译过来为统一可扩展固件接口，是BIOS的替代方案，前身是Intel在1998年开始开发的Inter Bot Initiative，后来被命名为可扩展固件接口（Extensible Firmware Interface EFI），2005年交由统一可扩展固件接口论坛，并更名为UEFI

**UEFI的优势**

1、支持硬盘容量更大：相比于传统BIOS+MBR只能支持2048G的硬盘分区和4个主分区相比，UEFI+GPT不会受到硬盘容量大小、分区数量的限制，不过在Windows系统上由于系统的限制，支持最多128个GPT磁盘分区，最大分区18EB，并且GPT格式是没有主分区和逻辑分区这个概念的

2、容错特性：UEFI是模块化构建，比BIOS容错和纠错特性强。

3、鼠标操作：UEFI内置图形驱动，可以提供原生分辨率的图形环境，用户进入后可以使用鼠标调整。

4、扩展性强：UEFI包含一个可编程的开放接口，厂商利用这个接口可以对功能进行扩展，如：备份和诊断

5、支持联网：在不进入操作系统的前提下就可以通过网络进行远程故障诊断

## 二、CentOS8启动流程

现代计算机是软件与硬件的复杂组合，从接通电源开始，到可以登录到系统中，需要大量的软件和硬件的配合，我们一起来了解一下CentOS8的x86_64系统在启动过程中所涉及的任务，虚拟机的流程也是大致相同的，但是某些与硬件相关的步骤是由虚拟机的相关程序在软件中处理的。

**1、接通电源**

 系统固件（UEFI或BIOS初始化）运行开机自检，并初始化部分硬件

**2、系统固件搜索可启动设备**

 启动设备可能是UEFI启动固件中配置的，也可能是按照BIOS中配置的顺序搜索所有磁盘上的主启动记录（MBR）

**3、读取启动加载器**（boot loader）

 系统固件会从MBR中读取启动加载器，然后将控制权交给启动加载器，在CentOS8中启动加载器为GRUB2

**4、grub.cfg**

 GRUB2将从/boot/grub2/grub.cfg文件中加载配置并显示一个菜单，在这个菜单中可以选择要启动的内核，我们可以使用grub2-mkconfig命令配合/etc/grub.d/目录和/etc/default/grub文件生成grub.cfg文件。

```
[root@zutuanxue ~]# cd /boot/grub2/
[root@zutuanxue grub2]# ls
device.map  fonts  grub.cfg  grubenv  i386-pc
[root@zutuanxue grub2]# pwd
/boot/grub2
```

**5、initramfs**

 在选择内核或到达超时时间后，启动加载器会从磁盘加载内核(vmlinuz)和initramfs，并将它们放入内存中，initramfs中包含启动时所有必要硬件的内核模块（驱动）和初始化脚本等，使用lsinitrd和dracut命令配合/etc/dracut.conf.d/目录可以查看和配置initramfs文件

```
[root@zutuanxue grub2]# lsinitrd  | more
Image: /boot/initramfs-4.18.0-80.el8.x86_64.img: 27M
##可以在回显中看到系统的主要目录，包括/etc /usr /dev /lib /lib64等
```

**6、启动加载器放权**

 启动加载器将控制权交给内核

**7、内核初始化**

 内核会在initramfs中寻找硬件的相关驱动并初始化相关硬件，然后启动/usr/sbin/init（PID=1），在CentOS8中/sbin/init是systemd的链接

```
[root@zutuanxue grub2]# ll /sbin/init 
lrwxrwxrwx. 1 root root 22 5月  23 2019 /sbin/init -> ../lib/systemd/systemd
[root@zutuanxue grub2]# find / -name systemd
/usr/lib/systemd/systemd
```

**8、启动initrd.target并挂载**

 systemd会执行initrd.target包含的所有单元，并将根文件系统挂载到/sysroot/目录,在initrd.target启动时的依赖单元，会按照/etc/fstab设置对硬盘进行挂载

**9、切换根文件系统**

 内核将根文件系统从initramfs切换为/sysroot（硬盘上的根文件系统），systemd会找到磁盘上安装的systemd并自动重新执行

**10、启动相应目标**

 硬盘上安装的systemd会查找从内核命令行传递的目标或是系统中配置的默认目标并启动对应单元后就可以进入到对应的登录界面。默认目标是/etc/systemd/system/default.target，

**注意：**
字符界面：

 如果默认目标为multi-user.target（字符界面），systemd会先执行sysinit.target初始化系统之后执行basic.target与getty.target准备基本系统环境和终端，再启动multi-user.target下的相关应用，同时执行/etc/rc.d/rc.local(需要执行权限)与与登录服务（systemd-logind.service），开启登录界面

```
[root@zutuanxue ~]# systemctl list-dependencies multi-user.target | grep target
multi-user.target
● ├─basic.target
● │ ├─paths.target
● │ ├─slices.target
● │ ├─sockets.target
● │ ├─sysinit.target
● │ │ ├─cryptsetup.target
● │ │ ├─local-fs.target
● │ │ └─swap.target
● │ └─timers.target
● ├─getty.target
● ├─nfs-client.target
● │ └─remote-fs-pre.target
● └─remote-fs.target
●   └─nfs-client.target
●     └─remote-fs-pre.target
```

图形界面：

 在multi-user.target的基础上执行graphical.target启动所需要的服务，开启图形界面

```
[root@zutuanxue ~]# systemctl list-dependencies graphical.target | grep target
graphical.target
● └─multi-user.target
●   ├─basic.target
●   │ ├─paths.target
●   │ ├─slices.target
●   │ ├─sockets.target
●   │ ├─sysinit.target
●   │ │ ├─cryptsetup.target
●   │ │ ├─local-fs.target
●   │ │ └─swap.target
●   │ └─timers.target
●   ├─getty.target
●   ├─nfs-client.target
●   │ └─remote-fs-pre.target
●   └─remote-fs.target
●     └─nfs-client.target
●       └─remote-fs-pre.target
```

## 三、运行级别切换与相关配置文件

**运行级别切换**

 通过前面的课程我们了解到CentOS8在启动过程中需要判断对应的运行级别，在不同的运行级别中会启动不同的单元，那么运行级别如何切换呢？

 在CentOS8中运行级别的设置涉及到下面几个命令

```
systemctl isolate	.../init [0-6]	切换运行级别
systemctl	get-default				查看当前的默认运行级别
systemctl set-default ...		设置默认的运行级别
runlevel										查看之前的运行级别和当前的运行级别
```


运行级别对照

```
[root@localhost system]# cd /usr/lib/systemd/system
[root@localhost system]# ll runlevel*.target
runlevel0.target -> poweroff.target
runlevel1.target -> rescue.target
runlevel2.target -> multi-user.target
runlevel3.target -> multi-user.target
runlevel4.target -> multi-user.target
runlevel5.target -> graphical.target
runlevel6.target -> reboot.target
```

所以当我们使用init [0-6]切换运行级别的时候系统执行的是systemctl isolate runlevel[0-6].target

```
[root@zutuanxue ~]# runlevel #查看运行级别
N 5
[root@zutuanxue ~]# init 3	#切换到字符界面
[root@zutuanxue ~]# runlevel 	#查看运行级别
5 3
[root@zutuanxue ~]# systemctl isolate graphical.target 	#切换到图形界面
[root@zutuanxue ~]# runlevel 
3 5

#########
emergency.target
[root@zutuanxue ~]# systemctl isolate emergency.target 
```

![image20191224152253190.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602996176505.png)

注意：此为紧急模式，用于紧急处理系统的错误，无法使用rescue.target时，可以尝试使用此模式。

## 四、Boot Loader与GRUB2

前面的课程我们了解的CentOS8的启动流程，在这个流程中有一个叫启动加载器，也就是boot loader的工具，如果没有这个boot loader就无法加载内核。在CentOS8中使用的是启动加载器是Grub2，在了解Grub2之前，我们先聊一下boot loader

### 4.1、Boot Loader的两个阶段

我们知道在BIOS或者UEFI加载完成之后，会到MBR中读取boot loader，这个boot loader可以让用户选择加载的内核并且移交系统的控制权限等，而加载内核只能通过boot loader，但是boot loader在MBR中，这个MBR是硬盘的第一个扇区，一个扇区的大小是512字节，boot loader的大小只有446字节，即便是GPT磁盘也没有足够的空间存储boot loader所包含的内容，所以为了避免空间的限制，导致无法引导系统正常启动的问题，Linux将boot loader的工作过程分为了两步。

stage1 执行boot loader的主程序
主程序必须安装在MBR或者是启动扇区，由于空间限制，MBR或启动扇区仅存放最小化的boot loader，并不会存放相关的配置文件

stage2 通过主程序加载配置文件
通过boot loader的主程序加载所有相关的配置文件，这些配置文件中包括定义文件系统类型的和CentOS8中的grub.cfg文件，而这些文件通常都存放在/boot当中

```
[root@zutuanxue ~]# ll -F /boot/grub2/
总用量 32
-rw-r--r--. 1 root root    64 12月 13 21:50 device.map
drwxr-xr-x. 2 root root  4096 12月 13 21:50 fonts/
-rw-r--r--. 1 root root  5032 12月 13 21:50 grub.cfg
-rw-r--r--. 1 root root  1024 12月 13 21:50 grubenv
drwxr-xr-x. 2 root root 12288 12月 13 21:50 i386-pc/

device.map		设备对应文件，用来帮助系统判断磁盘与设备文件的对应关系
fonts					开机过程中用到的字体文件
grub.cfg			grub2的主配置文件
grubenv				grub环境区块文件大小为1K，用来记录GRUB环境变量
i386-PC				针对x86架构的电脑所需要的相关模块，包括电源管理支持，文件系统支持等模块
```

在这些文件中最重要的就是grub.cfg文件，以及文件系统支持的相关模块

### 4.2、GRUB2

**GRUB与LILO**
目前为止，linux下的启动加载器有两种，一种是LILO另外一种就是GRUB，由于GRUB的功能更强大，支持的文件系统较多，所以越来越多的操作系统使用GRUB做为boot loader，CentOS从7开始使用了功能更为强大的GRUB2

**GRUB2的优点**

- 支持更多的文件系统
- 开机时可以手动调整启动参数
- 动态更新配置文件，修改完配置文件后不需要重新安装

**GRUB2与硬盘**

由于grub2的主要任务是从硬盘当中加载内核，所以grub2必须要识别硬盘，但是grub2识别硬盘的方式与linux系统识别的方式还是有些区别的。在Linux系统中，硬盘一般会被识别为类似sda1这种形式，而在grub2中硬盘会统一被识别为hd的设备，排序方式全部是用数字进行排序，而不是用字母加数字的混合形式。这么做的目的是为了定义grub2的查找内核时的顺序。如：

```
hd0,1		搜索第一块硬盘的第一个分区
hd0,msdos1	搜索第一块MBR硬盘的第一个分区
hd0,gpt1	搜索第一块GPT磁盘的第一个分区
简单来说，两个数字，第一个数字表示硬盘序号，第二个数字表示分区序号
```

**grub2配置文件**

了解了grub2中的硬盘识别方式，我们就可以了解一下grub2的配置文件了，这个文件建议各位不要随意更改

```
#
# DO NOT EDIT THIS FILE
#
# It is automatically generated by grub2-mkconfig using templates
# from /etc/grub.d and settings from /etc/default/grub
#

此部分内容提示我们不要编辑这个文件，此文件是有grub2-mkconfig命令自动建立的，相关模板与设置存放在/etc/grub.d/目录以及/etc/default/grub中，也就是说grub.cfg文件的内容会调用/etc/grub.d目录下的内容，如果需要修改的话需要调整/etc/default/grub文件
```

基本上grub2不希望用户去修改grub.cfg这个文件，如果需要调整的话需要通过修改其它文件并配合grub2-mkconfig命令来生成新的grub.cfg文件，但是各位还是要了解一下这个文件的大致格式

### /etc/default/grub与/etc/grub.d/

在前面的课程中我们知道了grub2的配置文件是grub.cfg，但是此文件内容比较复杂，且官方不建议我们手动修改，如果需要修改的话需要通过/etc/default/grub文件以及/etc/grub.d/目录内的内容来实现，那我们一起来看一下

**/etc/default/grub**

```
[root@zutuanxue ~]# vim /etc/default/grub
GRUB_TIMEOUT=5	定义在启动菜单默认的等待时间，单位是秒
GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"		定义获取操作系统名称的方式
GRUB_DEFAULT=saved	定义开机时默认启动的项目，可以是数字，也可以是标题名称，(这个标题就是开机时看到的那个标题），还可以是saved（表示默认启动上次启动成功的操作系统）	
GRUB_DISABLE_SUBMENU=true	是否隐藏子菜单
GRUB_TERMINAL_OUTPUT="console"	定义启动时的界面使用哪种终端输出，值包含console，serial，gfxterm，vga_text等
GRUB_CMDLINE_LINUX="resume=/dev/mapper/cl-swap rd.lvm.lv=cl/root rd.lvm.lv=cl/swap rhgb quiet"	定义额外的启动参数
GRUB_DISABLE_RECOVERY="true"	是否启用修复模式
GRUB_ENABLE_BLSCFG=true	是否启用bootloader规范

修改完成之后需要使用
grub2-mkconfig -o /boot/grub2/grub.cfg,重新生成配置文件
```

**/etc/grub.d/**

00_header 设置默认参数

00_tuned 额外调整的值

01_menu_auto_hide 与菜单隐藏相关的设置

01_users 与用户相关的设置

10_linux 与内核相关的设置

20_ppc_terminfo 与终端相关的设置

20_linux_xen 与虚拟化相关的设置

30_os-prober 与操作系统检测相关

30_uefi-firmware 与UEFI启动设置相关，需要硬件支持

40_custom&41_custom 自定义设置

注：这些文件会按照数字的顺序由小到大加载