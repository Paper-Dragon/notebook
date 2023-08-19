## 环境准备

添加一个20G的虚拟硬盘，分成10个2G的分区

## 一、创建raid0

```
系统中如果没有mdadm命令请安装相关工具：
[root@zutuanxue ~]# which mdadm
/usr/sbin/mdadm
[root@zutuanxue ~]# rpm -qf /usr/sbin/mdadm 
mdadm-4.1-4.el8.x86_64
[root@zutuanxue ~]# dnf install -y mdadm

创建raid0：
[root@zutuanxue ~]# mdadm --create /dev/md0 --raid-devices=2 /dev/sdb1 /dev/sdb2 --level=0
mdadm: Defaulting to version 1.2 metadata
mdadm: array /dev/md0 started.
或者
[root@zutuanxue ~]# mdadm -C /dev/md0 -l 0 -n 2 /dev/sdb1 /dev/sdb2
-C:创建软raid
-l：指定raid级别
-n：指定raid中设备个数

查看RAID信息：
/proc/mdstat文件记录了所有raid信息
[root@zutuanxue ~]# cat /proc/mdstat 
Personalities : [raid0] 
md0 : active raid0 sdb2[1] sdb1[0]
#md0为raid0，两个成员sdb2（第二个成员），sdb1（第一个成员）
      41905152 blocks super 1.2 512k chunks
#一共有多少个块（每块1K）	数据段的大小是512K
#chunk决定了阵列中每个成员盘写入的数据量，大于这个值才会到下一个盘读写
unused devices: <none>

查看指定的RAID信息：
[root@zutuanxue ~]# mdadm -D/--detail /dev/md0
[root@zutuanxue ~]# mdadm  --detail /dev/md0
/dev/md0:	#名称
         Version : 1.2	#工具版本
   Creation Time : Wed Dec 11 03:05:31 2019	#建立时间
   Raid Level : raid0	#类型
   Array Size : 41905152 (39.96 GiB 42.91 GB)#容量
   Raid Devices : 2	#组成RAID的硬盘数量
   Total Devices : 2#成员总数，包含备用磁盘
   Persistence : Superblock is persistent

   Update Time : Wed Dec 11 03:05:31 2019
   State : clean 	#raid的状态
   Active Devices : 2	#活跃的设备数量
   Working Devices : 2	#工作的设备数量
   Failed Devices : 0	#故障的数量
   Spare Devices : 0	#备用设备数量

   Chunk Size : 512K	

	 Consistency Policy : none

   Name : localhost.localdomain:0  (local to host localhost.localdomain)
   UUID : 06b2d3b2:3ace3ddf:b5b65dd7:eb40b040
   Events : 0

Number Major Minor RaidDevice State
 0     8     17    0      	active sync   /dev/sdb1
 1     8     33    1      	active sync   /dev/sdb2

格式化挂载使用：
[root@zutuanxue ~]# mkfs.ext4 /dev/md0
[root@zutuanxue ~]# mkdir /md0
[root@zutuanxue ~]# mount /dev/md0 /md0/


查看空间使用情况：
[root@zutuanxue ~]# df -h
文件系统             容量  已用  可用 已用% 挂载点
/dev/md0           3.9G  16M  3.7G    1% /md0
#可用空间100%


测试：
[root@zutuanxue ~]# iostat -m -d /dev/sdb1 /dev/sdb2 2
[root@zutuanxue ~]# dd if=/dev/zero of=/md0/file bs=1M count=1024
```

## 二、创建RAID1

```
创建raid1：
[root@zutuanxue ~]# mdadm -C /dev/md1 -l 1 -n 2 /dev/sdb3 /dev/sdb4 
查看状态信息：
root@zutuanxue ~]# watch -n1 "cat /proc/mdstat" 	watch命令监控该文件变化情况,1秒钟显示一次
或者直接查看
[root@zutuanxue ~]# cat /proc/mdstat 
Personalities : [raid0] [raid1] 
md1 : active raid1 sdb4[1] sdb3[0]
      20953024 blocks super 1.2 [2/2] [UU]
      #两个UU说明状态ok，一个盘故障则显示_U
      [==============>......]  resync = 73.5% (15404032/20953024) finish=0.4min speed=205582K/sec
unused devices: <none>
      #以上信息说明两块盘在进行同步，100%说明同步完成

查看raid1详细信息
[root@zutuanxue ~]# mdadm -D /dev/md1   

格式化挂载使用：
[root@zutuanxue ~]# mkfs.ext4 /dev/md1
[root@zutuanxue ~]# mount /dev/md1 /md1

查看空间使用情况：
[root@zutuanxue ~]# df -h
文件系统             容量  已用  可用 已用% 挂载点
/dev/md1            2.0G  6.0M  1.9G    1% /md1
#可用空间50%

测试验证热插拔：
1. 模拟一块盘故障（将磁盘标记为失效）
[root@zutuanxue ~]# mdadm /dev/md1 -f /dev/sdb3
mdadm: set /dev/sdb1 faulty in /dev/md1

#-f or --fail  表示失效

2. 查看raid1状态
[root@zutuanxue ~]# cat /proc/mdstat 
Personalities : [raid0] [raid1] 
md1 : active raid1 sdb4[1] sdb3[0](F)	F表示失效失败
      20953024 blocks super 1.2 [2/1] [_U]
      #_表示有一块盘失效
unused devices: <none>

[root@zutuanxue ~]# mdadm -D /dev/md1
。。。
Number Major Minor RaidDevice State
-      0     0     0      		removed
1      8     33    1          active sync  /dev/sdb4
0      8     17    -          faulty       /dev/sdb3
 #失效盘等待移除
       
3. 移除故障或者失效硬盘（热拔）
[root@zutuanxue ~]# mdadm /dev/md1 -r /dev/sdb3
mdadm: hot removed /dev/sdb3 from /dev/md1

#-r or --remove 表示移除

[root@zutuanxue ~]# mdadm -D /dev/md1
。。。
  Number   Major   Minor   RaidDevice State
       -       0        0        0      removed
       1       8       33        1      active sync   /dev/sdb4

4. 加入新的磁盘到raid1中（热插）
[root@zutuanxue ~]# mdadm  /dev/md1 -a /dev/sdb5
mdadm: added /dev/sdd5

#-a or --add 表示增加

[root@zutuanxue ~]# cat /proc/mdstat 
```

## 三、创建RAID5

```
创建raid5:
[root@zutuanxue ~]# mdadm -C /dev/md5 -l 5 -n 3 -x 1 /dev/sdb{6,7,8,9}

#-x, --spare-devices=  表示指定热备盘

[root@zutuanxue ~]# cat /proc/mdstat 
Personalities : [raid0] [raid1] [raid6] [raid5] [raid4] 
md5 : active raid5 sdb8[4] sdb9[3](S) sdb7[1] sdb6[0]	#S备用盘
      4188160 blocks super 1.2 level 5, 512k chunk, algorithm 2 [3/3] [UUU]
      
unused devices: <none>


说明：热备盘表示当其中一块盘故障后，热备盘会立马顶上去，而不需要人为手动干预。

[root@zutuanxue ~]# mdadm -D /dev/md5 		查看详细信息
。。。
    Number   Major   Minor   RaidDevice State
       0       8       22        0      active sync   /dev/sdb6
       1       8       23        1      active sync   /dev/sdb7
       4       8       24        2      active sync   /dev/sdb8

       3       8       25        -      spare   /dev/sdb9


格式化挂载使用：
[root@zutuanxue ~]# mkfs.ext4 /dev/md5
[root@zutuanxue ~]# mkdir /md5
[root@zutuanxue ~]# mount /dev/md5 /md5/


查看空间使用情况：
[root@zutuanxue ~]# df -h
文件系统             容量  已用  可用 已用% 挂载点
/dev/md5             3.9G   16M  3.7G    1% /md5
#可用空间 （磁盘数量-1）x 单一磁盘容量

测试热备磁盘作用：
1. 标记一块活动盘失效
[root@zutuanxue /]# mdadm /dev/md5 -f /dev/sdb6
mdadm: set /dev/sdb6 faulty in /dev/md5

立即查看状态：
[root@zutuanxue /]# cat /proc/mdstat 
Personalities : [raid0] [raid1] [raid6] [raid5] [raid4] 
md5 : active raid5 sdb8[4] sdb9[3] sdb7[1] sdb6[0](F)
说明：
sdb6(F)失效后，原来的sdb9(S)热备盘立马顶上去同步数据
      4188160 blocks super 1.2 level 5, 512k chunk, algorithm 2 [3/2] [_UU]
      [==>..................]  recovery = 13.0% ..          
unused devices: <none>

[root@zutuanxue /]# mdadm -D /dev/md5
...
      Number   Major   Minor   RaidDevice State
       3       8       25        0      active sync   /dev/sdb9
       1       8       23        1      active sync   /dev/sdb7
       4       8       24        2      active sync   /dev/sdb8

       0       8       22        -      faulty   /dev/sdb6

       
2. 移除失效的盘
[root@zutuanxue /]# mdadm  /dev/md5 -r /dev/sdb6 
mdadm: hot removed /dev/sdb6 from /dev/md5


3. 为了日后考虑，再次添加一个热备盘到raid5中
[root@zutuanxue /]# mdadm /dev/md5 -a /dev/sdb6
mdadm: added /dev/sdb6
```

## 四、 保存RAID信息

问：为什么要保存raid信息？
答：如果不做信息的保存，在CentOS6中，重启系统后raid不能自动被识别到，7,8系统中不会出现这种状况。

```
1. 创建配置文件
[root@zutuanxue ~]# mdadm -D --scan >> /etc/mdadm.conf 
[root@zutuanxue ~]# cat /etc/mdadm.conf 
ARRAY /dev/md/1 metadata=1.2 name=localhost.localdomain:1 UUID=170d690d:4f7ccd02:646c3ce0:8f6012be
ARRAY /dev/md/0 metadata=1.2 name=localhost.localdomain:0 UUID=a845702e:9251cae9:25d1bc8b:9a337df2
ARRAY /dev/md/5 metadata=1.2 spares=1 name=localhost.localdomain:5 UUID=d49e6cca:5312271b:7e8e83d5:adac4ed5
```

#### raid停止与启动

```
以RAID5为例说明：
停止raid:
1. 卸载raid
[root@zutuanxue ~]# umount /md5 
2. 使用命令停止raid
[root@zutuanxue ~]# mdadm --stop /dev/md5
mdadm: stopped /dev/md5

启动raid：
1. 配置文件(/etc/mdadm.conf)存在如下启动
[root@zutuanxue ~]# mdadm -A /dev/md5
mdadm: /dev/md5 has been started with 3 drives and 1 spare.

#-A：Assemble a pre-existing array  表示装载一个已存在的raid

2. 配置文件(/etc/mdadm.conf)不存在如下启动
[root@zutuanxue ~]# mdadm -A /dev/md5 /dev/sdb[6789]
mdadm: /dev/md5 has been started with 3 drives and 1 spare.

3. 如果设备名不知道，可以去查看每个设备的raid信息，使用uuid把raid设备重新组合
[root@zutuanxue ~]# mdadm -E /dev/sdb6 | grep UUID
     Array UUID : d49e6cca:5312271b:7e8e83d5:adac4ed5
    Device UUID : b933b8d5:04a6e003:90e9b230:d13cacf5

 说明：同一个raid里每个磁盘查看的UUID都是这个值
。。。
[root@zutuanxue ~]# mdadm -E /dev/sdb7 | grep UUID
     Array UUID : d49e6cca:5312271b:7e8e83d5:adac4ed5
    Device UUID : b8ca85bd:7809faa4:48882a21:98ef9349

通过以上方法找到后进行重新组合，如下：
[root@zutuanxue ~]# mdadm -A --uuid=d49e6cca:5312271b:7e8e83d5:adac4ed5 /dev/md5
mdadm: /dev/md5 has been started with 3 drives and 1 spare.
```

#### raid的删除

```
1. 卸载设备
[root@zutuanxue ~]# umount /md5/
2. 移除所有磁盘
[root@zutuanxue ~]# mdadm /dev/md5 -f /dev/sdb[6789]
mdadm: set /dev/sdb6 faulty in /dev/md5
mdadm: set /dev/sdb7 faulty in /dev/md5
mdadm: set /dev/sdb8 faulty in /dev/md5
mdadm: set /dev/sdb9 faulty in /dev/md5
[root@zutuanxue ~]# mdadm /dev/md5 -r /dev/sdb[6789]
mdadm: hot removed /dev/sdb6 from /dev/md5
mdadm: hot removed /dev/sdb7 from /dev/md5
mdadm: hot removed /dev/sdb8 from /dev/md5
mdadm: hot removed /dev/sdb9 from /dev/md5

3. 停止raid
[root@zutuanxue ~]# mdadm --stop /dev/md5
mdadm: stopped /dev/md5

4. 擦出超级块（superblock）清除相关信息
[root@zutuanxue ~]# mdadm --zero-superblock /dev/sdb[6789]
```