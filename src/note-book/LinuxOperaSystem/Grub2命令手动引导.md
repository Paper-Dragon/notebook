# Grub2命令手动引导

## 手动引导ubuntu的iso镜像文件

从而安装ubuntu，grub>代表命令的开始

假设ubuntu镜像在U盘的第一个分区的根目录下即：(hd0,1)/ubuntu-18.04-desktop-amd64.iso

手动引导下可以按TAB键补全命令、目录以及文件名

    #查询所有已安装磁盘并打印详细信息
    grub>ls -l
     
     #设置根目录分区
    grub>set root=(hd0,1)
     
    #将Ubuntu.iso位置赋值给变量isofile （这里用变量方便下面不用打一长串文件名）
    grub>set isofile=/ubuntu-18.04-desktop-amd64.iso
     
    #使用grub2的回放技术，把ubuntu.iso的文件内容，投射（挂载）到loop上。在使用这个命令时，你得考虑你的内存足够的大。(hd0,1)iso镜像文件所在分区
    grub>loopback loop (hd0,1)$isofile
     
    #加载内核，其中(loop),是使用了上一句所投射的设备，其访问的是ubuntu.iso文件的内容，boor=casper将目录casper挂载为boot，iso-scan/filename=$isofile 是利用iso-scan来寻找到你的ubuntu.iso文件所在位置并把所找到的iso文件挂到光驱设备
    grub>linux (loop)/casper/vmlinuz boot=casper iso-scan/filename=$isofile quiet splash
     
    #initrid.lz是一个镜象文件，里面存的是一些内核要加载的重要文件
    grub>initrd (loop)/casper/initrd.lz
     
    #根据上面的参数启动系统
    grub>boot

-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------

## 手动引导archlinux的iso镜像文件从而安装archlinux

，grub>代表命令的开始

假设archlinux镜像在U盘的第一个分区的根目录下即：(hd0,1)/archlinux-2018.07.01-x86_64.iso

    grub>set root=(hd0,1)
    grub>set isofile=/archlinux-2018.07.01-x86_64.iso
    grub>loopback loop (hd0,1)$isofile
     #img_dev=/dev/sda1 镜像文件所在分区设备，如果不清楚所在设备是怎么排序的可以使用img_dev=/dev/disk/by-uuid/分区的UUID 关于UUID可以用"grub>ls -l" 指令查询,或者可以用img_dev=/dev/disk/by-labe/分区卷标 
    grub>linux (loop)/arch/boot/x86_64/vmlinuz img_dev=/dev/sda1 img_loop=$isofile earlymodules=loop
    grub>initrd (loop)/arch/boot/x86_64/archiso.img
    grub>boot

方法二：

    grub>set root=(hd0,1)
    grub>set isofile=/arch.iso
    grub>loopback loop (hd0,1)$isofile
    grub>linux (loop)/arch/boot/x86_64/vmlinuz img_loop=$isofile archisobasedir=arch  archisolabel=ARCH_XXXXXX #此处为发布年月
    grub>initrd (loop)/arch/boot/x86_64/archiso.img

 



-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------

## 手动引导Ubuntu

假设ubuntu安装在第一块硬盘的第一个分区即：(hd0,1)

    grub>root=(hd0,1)
    grub>linux /boot/vmlinuz-xxx
    grub>initrd /boot/initrd.img-xxx
    grub>boot

XXX是内核版本号

关于linux的通用引导方法其实与上面差不多，就是在“grub>linux /boot/vmlinuz-xxx”这一句加载内核的文件与后面跟的参数有所不同，不同的linux发行版会有不同的参数，有些可以也不加参数启动

-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------

## 手动引导uefi启动模式下的Windows。

winPE也可以用此方法引导

假设windows安装在第一块硬盘的第一个分区即：(hd0,1)

    #加载ntfs文件系统
    grub>insmod ntfs
    grub>set root=(hd0,1)
    #grub>chainloader +1 是引导传统bios启动的Windows
    #如果不成功则可能是efi文件被替换用换个目录试试如：chainloader/EFI/microsoft/boot/bootmgfw.efi
    grub>chainloader /EFI/boot/bootx64.efi
    grub>boot

-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------

##  手动引导bios启动模式下的Windows。

winPE也可以用此方法引导

假设windows安装在第一块硬盘的第一个分区即：(hd0,1)

chainloader /bootmgr 命令会报签名错误，即使关闭签名验证也无法启动(chainloader +1也可启动系统但不可启动U盘pe)

    grub>set root=(hd0,1)
    # /bootmgr 是一个在根目录下的引导文件，bootmgr是在Windows Vista、Windows 7、windows 8/8.1和windows 10中使用的新的启动管理器，就相当于Win NT/Win 2000/Win XP时代的NTLDR。
    grub>ntldr /bootmgr
    grub>boot

 