## 一、磁盘介绍

磁盘：计算机中的外部存储设备，负责存储计算机数据，并且断电后也能保持数据不丢失。

**磁盘分类：**

按照物理结构：

- 机械磁盘
- 固态磁盘

按照接口:

- IDE
- SCSI
- SATA
- SAS
- mSATA
- M.2
- NVME
- PCIe

按照尺寸：

- 机械硬盘：1.8寸 2.5寸 3.5寸
- 固态硬盘：SATA: 2.5寸
- M.2： 2242、2260、2280

## 二、熟悉磁盘的工作原理

**机械磁盘的读写数据依靠电机带动盘片转动来完成数据读写的。**

#### 机械磁盘剖析图

![机械硬盘结构.jpeg](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602986110096.jpeg)

```
为了使磁盘内部清洁，磁盘是在真空特殊环境中制作的，不能随意拆卸，拆开后基本报废了
```

机械磁盘工作是依靠马达带动盘片转动，通过磁头来读取磁盘上的数据。

### 磁盘术语

##### 磁盘

硬盘中一般会有多个盘片组成，每个盘片包含两个面，每个盘面都对应地有一个读/写磁头。受到硬盘整体体积和生产成本的限制，盘片数量都受到限制，一般都在5片以内。盘片的编号自下向上从0开始，如最下边的盘片有0面和1面，再上一个盘片就编号为2面和3面。

##### 磁头

负责读取盘面数据的设备

##### 磁道

从盘片的最内侧向外有很多同心圆圈，我们称为磁道

##### 扇区

从圆心向外画直线，可以将磁道划分为若干个弧段，称之为扇区，一个扇区通常为**512B**

![disk2.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602986039811.png)

##### 磁柱

硬盘通常由重叠的一组盘片构成，每个盘面都被划分为数目相等的磁道，并从外缘的“0”开始编号，具有相同编号的磁道形成一个圆柱，称之为磁盘的柱面。磁盘的柱面数与一个盘面上的磁道数是相等的。由于每个盘面都有自己的磁头，因此，盘面数等于总的磁头数。

![disk3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602986025858.png)

## 三、磁盘的性能指标

#### 影响磁盘性能的指标

**寻道时间（seek time）**【和 转速 相关】：Tseek，是指将读写磁头移动至正确的磁道上所需要的时间。寻道时间越短，I/O操作越快，目前磁盘的平均寻道时间一般在3-15ms

**旋转延迟**：Trotation，是指盘片旋转将请求数据所在的扇区移动到读写磁头下方所需要的时间。旋转延迟取决于磁盘转速，通常用磁盘旋转一周所需时间的1/2表示。比如：7200rpm的磁盘平均旋转延迟大约为60*1000/7200/2 = 4.17ms，而转速为15000rpm的磁盘其平均旋转延迟为2ms。

**数据传输时间**：Ttransfer，是指完成传输所请求的数据所需要的时间

#### 衡量磁盘性能的指标

**IOPS**：IOPS（Input/Output Per Second）即每秒的输入输出量（或读写次数），即指每秒内系统能处理的I/O请求数量。随机读写频繁的应用，如小文件存储等，关注随机读写性能，IOPS是关键衡量指标。可以推算出磁盘的IOPS = 1000ms / (Tseek + Trotation + Transfer)，如果忽略数据传输时间，理论上可以计算出随机读写最大的IOPS。常见磁盘的随机读写最大IOPS为：

- 7200rpm的磁盘 IOPS = 76 IOPS
- 10000rpm的磁盘IOPS = 111 IOPS
- 15000rpm的磁盘IOPS = 166 IOPS

**throughput ：** 吞吐量指单位时间内可以成功传输的数据数量。 单位为（m/s G/s）

![3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1602986155314.png)

**文件系统：**是告知操作系统使用何种方法和数据结构在存储设备或分区上读写数据的；是分区数据管家，负责如何将数据写入磁盘或者从磁盘读出

NTFS EXT3 EXT4 XFS ISO9660

具体有多少 man mount -t

```
 adfs,  affs,  autofs,  cifs,  coda,  coherent, cramfs,debugfs, devpts, efs, ext, ext2, ext3, ext4, hfs, hfsplus, hpfs,iso9660,  jfs, minix, msdos, ncpfs, nfs, nfs4, ntfs, proc, qnx4,ramfs, reiserfs, romfs, squashfs,  smbfs,  sysv,  tmpfs,  ubifs,udf,  ufs,  umsdos,  usbfs,  vfat, xenix, xfs, xiafs.
```

**文件系统可以根据应用场景去选择使用哪一款，如果不会选择，推荐ext4或者XFS**

**page cache**

其实就是内存上空闲的部分 用来缓存数据，比如buffer cache

作用：对IO读写做优化

测试缓存对读写的影响

```
写
[root@zutuanxue ~]# echo 3 > /proc/sys/vm/drop_caches
[root@zutuanxue ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           1980          95        1807           9          77        1754
Swap:          2047           0        2047
[root@zutuanxue ~]# dd if=/dev/zero of=/tmp/big bs=1M count=1000
记录了1000+0 的读入
记录了1000+0 的写出
1048576000字节(1.0 GB)已复制，10.2412 秒，102 MB/秒
[root@zutuanxue ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           1980          95         779           9        1105        1698
Swap:          2047           0        2047
[root@zutuanxue ~]# dd if=/dev/zero of=/tmp/big1 bs=1M count=1000
记录了1000+0 的读入
记录了1000+0 的写出
1048576000字节(1.0 GB)已复制，7.89978 秒，133 MB/秒

读
[root@zutuanxue ~]# echo 3 > /proc/sys/vm/drop_caches 
[root@zutuanxue ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           1980          95        1805           9          79        1753
Swap:          2047           0        2047
[root@zutuanxue ~]# dd if=/tmp/big of=/dev/null 
记录了2048000+0 的读入
记录了2048000+0 的写出
1048576000字节(1.0 GB)已复制，2.23965 秒，468 MB/秒
[root@zutuanxue ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           1980          95         800           9        1084        1710
Swap:          2047           0        2047
[root@zutuanxue ~]# dd if=/tmp/big of=/dev/null 
记录了2048000+0 的读入
记录了2048000+0 的写出
1048576000字节(1.0 GB)已复制，1.92811 秒，544 MB/秒
```

## 四、linux磁盘的使用方法

### **4.1、磁盘初始化**

 **一块新的磁盘使用必须初始化为MBR或者GPT分区。**

- **MBR <2TB fdisk** **4个主分区或者3个主分区+1个扩展分区（N个逻辑分区）**

MBR(Master Boot Record)的缩写，由三部分组成，即：

1. Bootloader（主引导程序）=

	446字节

	- 引导操作系统的主程序

2. DPT分区表（Disk Partition Table）=

	64字节

	- 分区表保存了硬盘的分区信息，操作系统通过读取分区表内的信息，就能够获得该硬盘的分区信息
	- 每个分区需要占用16个字节大小，保存有文件系统标识、起止柱面号、磁头号、扇区号、起始扇区位置（4个字节）、分区总扇区数目（4个字节）等内容
	- 分区表中保存的分区信息都是主分区与扩展分区的分区信息，扩展分区不能直接使用，需要在扩展分区内划分一个或多个逻辑分区后才能使用
	- 逻辑分区的分区信息保存在扩展分区内而不是保存在MBR分区表内，这样，就可以突破MBR分区表只能保存4个分区的限制

3. 硬盘有效标志（校验位）=2个字节

- **GPT >2TB gdisk(parted) 128个主分区**

注意：从MBR转到GPT，或从GPT转换到MBR会导致**数据全部丢失**！

### **4.2、分区**

 **将磁盘合理分区，能使计算机或者使用者更快的存取数据**

 MBR 主分区+扩展分区<=4

 GPT 主分区<=128

### **4.3、格式化**

 **装载文件系统(相当于库管，负责数据的写入和读出)。**

 常见的文件系统:NTFS EXT EXT2 EXT3 EXT4 XFS vfat

### **4.4、挂载**

 **linux中设备不能直接使用，需要挂载到文件夹才可以。**

挂载方式：

1. 手动挂载
2. 开机挂载
3. 自动挂载