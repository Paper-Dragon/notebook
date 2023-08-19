## 一、案例应用场景

生产环境中的服务器一般会分为系统盘和数据盘两种磁盘，以dell R730举例，该服务器是一个2U的机架式服务器，满载可以挂载14块磁盘[2块在机箱内做系统盘，12块在面板做数据盘]，我们一般的策略是系统盘做raid1，保障系统稳定性12块数据磁盘我们做raid10 或者 raid50，保障数据盘容错的同时还能做到优化IO的效果。

raid磁盘的容量是一定的，线上的数据又是不断增长的，也就是说总有一天会把你的数据磁盘填满，那怎么办？为了解决这个问题，人们想到了LVM[逻辑卷管理系统]，当前数据盘容量不够用的时候，我们可以通过san存储获得网络磁盘，然后将该网络存储动态加入LVM中的卷组后就可以扩大LV了。整个过程采用在线扩容的方式，不会影响线上业务正是基于这个原因，我们又在系统中把raid数据盘在存数据之前做成了LVM磁盘，方便后续的扩容。

注意：有数据的磁盘不能再做LVM，因为需要格式化，数据会全部丢失。必须提前布局，否则就得提前准备跑路资金了。

## 二、案例需求

```
给虚拟机添加一块磁盘(以sdb为例)，要求使用脚本对该磁盘分三个区：

 1）主分区 /dev/sdb3 543M 文件系统 ext4 要求开机自动挂载到/data/data1目录

 2) 逻辑分区 /dev/sdb5 2G

 3) 逻辑分区 /dev/sdb6 3G

使用/dev/sdb5 /dev/sdb6 新建卷组vg100，并创建一个PE为16M,容量为2.5G的逻辑卷lv100，
格式化为xfs,默认开机自动挂载到/data/data2目录
```

## 三、案例算法

算法：完成一个任务的代码思路。

```
脚本思路---算法
1、分区
2、创建逻辑卷
    2.1  创建物理卷
    2.2  创建卷组
    2.3  创建逻辑卷
3、格式化 /dev/sdb3   /dev/vg100/lv100
4、修改/etc/fstab文件
5、挂载分区
6、验证并输出挂载结果
```

## 四、代码实现

代码实现的要点：要清楚每一步的步骤，不同的系统可能有细微的差别，一味的复制可不行的，需要提前手动做一下，把步骤捋清楚。

```
实验代码    01_disk_partition.sh
#!/bin/bash
# 
#Author: Bai Shuming
#Created Time: 2019/11/1 21:05
#Release: 
#Description:
#
#给虚拟机添加一块磁盘(以sdb为例)，要求使用脚本对该磁盘分三个区：
#  1）主分区 /dev/sdb3   543M   文件系统 ext4  要求开机自动挂载到/data/data1目录
#  2)   逻辑分区  /dev/sdb5   2G
#  3)   逻辑分区  /dev/sdb6   3G
#使用/dev/sdb5   /dev/sdb6   新建卷组vg100，并创建一个PE为16M,容量为2.5G的逻辑卷lv100，
#格式化为xfs,默认开机自动挂载到/data/data2目录

#1、分区
fdisk /dev/sdb <<EOF
n
p
3

+543M
n
e
4


n

+2G
n

+3G
w
EOF

#2、创建逻辑卷
   #2.1 创建物理卷
    pvcreate /dev/sdb5 /dev/sdb6
   #2.2 创建卷组
    vgcreate -s 16M vg100 /dev/sdb{5..6}
   #2.3 创建逻辑卷
    lvcreate -L 2.5G -n lv100 vg100
#3、格式化
mkfs.ext4 /dev/sdb3
mkfs.xfs /dev/vg100/lv100

#4、修改/etc/fstab,实现自动挂载
echo  "/dev/sdb3   /data/data1 ext4  defaults   0 0" >> /etc/fstab
echo "/dev/vg100/lv100 /data/data2  xfs   defaults 0 0" >> /etc/fstab

#5、挂载分区
mkdir -p /data/data{1..2}
mount -a

#6、验证并输出挂载结果
mount |grep "/dev/sdb3"
test $? -eq 0&&echo "/dev/sdb3 挂载成功" || echo "/dev/sdb3挂载失败"

##注意检索的时候，mount输出中LV的表示方式，或者直接检索挂载点/data/data2也可以。
mount |grep "vg100-lv100"
test $? -eq 0&&echo "/dev/vg100/lv100 挂载成功" || echo "/dev/vg100/lv100挂载失败"
```

## 五、实现验证

```
使用如下命令查看是否挂载成功
[root@zutuanxue ~]# df -Th
```