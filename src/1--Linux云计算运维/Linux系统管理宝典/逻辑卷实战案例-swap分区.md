swap分区在系统的运行内存不够用的时候，把运行内存中的一部分空间释放出来，以供当前运行的程序使用。那些被释放的空间可能来自一些很长时间没有什么操作的程序，这些被释放的空间被临时保存到swap分区中，等到那些程序要运行时，再从Swap分区中恢复保存的数据到内存中。可以缓解物理内存不足的压力，如果物理内存不足，还没有swap空间，会宕机

## 扩容swap空间

方法1： 增加一个设备（硬盘，分区，逻辑卷）来扩容swap空间

```
查看swap空间大小：
[root@zutuanxue ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           3918        1309        2002          15         606        2358
Swap:          2047           0        2047

[root@zutuanxue ~]# swapon -s
文件名				类型					大小			已用	权限
/dev/dm-1   partition		2097148			0		-2
[root@zutuanxue ~]# mkswap /dev/sdb4
正在设置交换空间版本 1，大小 = 2 GiB (2147479552  个字节)
无标签，UUID=8235e59a-1043-4251-8694-ba619cb36f1c

[root@zutuanxue ~]# blkid /dev/sdb4
/dev/sdb4: UUID="8...c" TYPE="swap" PARTUUID="b...e"

//激活swap分区。swap空间不能手动挂载
[root@zutuanxue ~]# swapon /dev/sdb4
[root@zutuanxue ~]# swapon -s
文件名						类型				大小		已用	权限
/dev/dm-1       partition	2097148		0		-2
/dev/sdb4       partition	2097148		0		-3


[root@zutuanxue ~]# free -m
      total  used  free shared buff/cache available
Swap:  4095   0    4095

LVM形式
[root@zutuanxue ~]# mkswap /dev/vg1/swap		#创建swap
[root@zutuanxue ~]# swapon /dev/vg1/swap		#开启swap
[root@zutuanxue ~]# lvextend -L 4G	/dev/vg1/swap	#放大LVM形式的swap
[root@zutuanxue ~]# swapoff /dev/vg1/swap		#关闭lvm形式的swap
[root@zutuanxue /]# mkswap /dev/vg1/lv-swap	#重新制作swap
[root@zutuanxue ~]# swapon /dev/vg1/swap		#开启lvm形式的swap
[root@zutuanxue ~]# free -m	#确认swap分区是否放大
```

方法2： 使用dd命令模拟大文件来扩容swap

```
[root@zutuanxue ~]# dd if=/dev/zero of=/tmp/swapfile bs=1M count=2048

if=源文件,in file指定从哪里读入数据
of=目标文件，out file指定将数据写入什么位置
bs=复制数据的大小，block size
count=复制的个数

注意：
1. 一般可以使用dd命令做块设备文件的备份
2. /dev/zero 特殊设备，一般用来模拟一个大文件，源源不断的二进制的数据流;
/dev/null  空设备，类似黑洞

步骤：
1. 使用dd命令模拟大文件
# dd if=/dev/zero of=/tmp/swapfile bs=1M count=2048
2. 格式化大文件
[root@zutuanxue ~]# mkswap /tmp/swapfile 
mkswap: /tmp/swapfile：不安全的权限 0644，建议使用 0600。
正在设置交换空间版本 1，大小 = 2 GiB (2147479552  个字节)
无标签，UUID=3d855316-c97c-42ca-9c52-9df26a4517a0 
[root@zutuanxue ~]# ll /tmp/swapfile 
-rw-r--r-- 1 root root 2147483648 12月 10 21:02 /tmp/swapfile
[root@zutuanxue ~]# chmod 600 /tmp/swapfile 

3.激活大文件
[root@zutuanxue ~]# swapon -p1 /tmp/swapfile
-p：指定优先级，数字越大优先级越高，-1~32767

4. 查看
[root@zutuanxue ~]# swapon -s
文件名							类型				大小			已用	权限
/dev/dm-1         partition	2097148		 268	-2
/dev/sdb4         partition	2097148		 0		-3
/tmp/swapfile     file    	2097148		 0		 1
[root@zutuanxue ~]# free -m
      total used  free  shared  buff/cache available
Swap:  6143  0    6143



如果开机自动挂载，需要修改文件：/etc/fstab
[root@zutuanxue ~]# vim /etc/fstab 
/dev/sda4  			swap    swap     defaults       0 0
/tmp/swapfile   swap    swap     dfaults,pri=1  0 0
[root@zutuanxue ~]# swapon -a

关闭swap
[root@zutuanxue ~]# swapoff /dev/sdb4
[root@zutuanxue ~]# swapoff /tmp/swapfile
或者
#关闭所有swap****慎用*****
[root@zutuanxue ~]# swapoff -a	
```