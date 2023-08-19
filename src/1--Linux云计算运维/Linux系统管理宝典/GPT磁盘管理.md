GPT分区工具：gdisk gdisk

**gdisk分区**

```
GPT  128个主分区
[root@zutuanxue ~]# gdisk -l /dev/sdc
[root@zutuanxue ~]# gdisk -l /dev/sdc   查看sdc信息
GPT fdisk (gdisk) version 1.0.3

Partition table scan:
  MBR: MBR only
  BSD: not present
  APM: not present
  GPT: not present			###GPT分区无法使用


***************************************************************
Found invalid GPT and valid MBR; converting MBR to GPT format
in memory. 
***************************************************************

Disk /dev/sdc: 41943040 sectors, 20.0 GiB
Model: VMware Virtual S
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): B228357D-34EC-4E47-BB81-A7312F3BCF8D
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 41943006
Partitions will be aligned on 2048-sector boundaries
Total free space is 37748669 sectors (18.0 GiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048         2099199   1024.0 MiB  8300  Linux filesystem
   2         2099200         4196351   1024.0 MiB  8300  Linux filesystem




将MBR转换成GPT分区
[root@zutuanxue ~]# gdisk /dev/sdc
GPT fdisk (gdisk) version 1.0.3

Partition table scan:
  MBR: MBR only
  BSD: not present
  APM: not present
  GPT: not present


***************************************************************
Found invalid GPT and valid MBR; converting MBR to GPT format
in memory. THIS OPERATION IS POTENTIALLY DESTRUCTIVE! Exit by
typing 'q' if you don't want to convert your MBR partitions
to GPT format!
***************************************************************


Command (? for help): o
This option deletes all partitions and creates a new protective MBR.
Proceed? (Y/N): y

Command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): y
OK; writing new GUID partition table (GPT) to /dev/sdc.
The operation has completed successfully.



[root@zutuanxue ~]# gdisk -l /dev/sdc
GPT fdisk (gdisk) version 1.0.3

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present			###GPT可用了

Found valid GPT with protective MBR; using GPT.
Disk /dev/sdc: 41943040 sectors, 20.0 GiB
Model: VMware Virtual S
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): 7CA4232A-4A9E-467D-AADD-BB84DB2126E3
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 41943006
Partitions will be aligned on 2048-sector boundaries
Total free space is 41942973 sectors (20.0 GiB)

Number  Start (sector)    End (sector)  Size       Code  Name



#再次分区
[root@zutuanxue ~]# gdisk /dev/sdc
GPT fdisk (gdisk) version 1.0.3

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.

Command (? for help): n
Partition number (1-128, default 1): 1
First sector (34-41943006, default = 2048) or {+-}size{KMGTP}: 
Last sector (2048-41943006, default = 41943006) or {+-}size{KMGTP}: +2G
Current type is 'Linux filesystem'
Hex code or GUID (L to show codes, Enter = 8300): 
Changed type of partition to 'Linux filesystem'

Command (? for help): p
Disk /dev/sdc: 41943040 sectors, 20.0 GiB
Model: VMware Virtual S
Sector size (logical/physical): 512/512 bytes
Disk identifier (GUID): 7CA4232A-4A9E-467D-AADD-BB84DB2126E3
Partition table holds up to 128 entries
Main partition table begins at sector 2 and ends at sector 33
First usable sector is 34, last usable sector is 41943006
Partitions will be aligned on 2048-sector boundaries
Total free space is 37748669 sectors (18.0 GiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048         4196351   2.0 GiB     8300  Linux filesystem
Command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): y
OK; writing new GUID partition table (GPT) to /dev/sdc.
The operation has completed successfully.


[root@zutuanxue ~]# partprobe /dev/sdc

2.创建文件系统（格式化）CentOS8默认使用xfs
[root@zutuanxue ~]# mkfs.xfs -f /dev/sdc1


3.挂载
[root@zutuanxue ~]# mkdir /disk1
[root@zutuanxue ~]# mount -t xfs -o ro /dev/sdc1 /disk1		//手动挂载
[root@zutuanxue ~]# umount /disk1		##卸载
```