# Btrfs使用和简介

了解了 btrfs 的特性，想必您一定想亲身体验一下 btrfs 的使用。本章将简要介绍如何使用 btrfs 。

## 创建文件系统

mkfs.btrfs 命令建立一个 btrfs 格式的文件系统。可以用如下命令在设备 nvme0n2,nvme0n3上建立一个 btrfs 文件系统，并将其挂载到 /mnt 目录下：

```bash
[root@fedora ~]# mkfs.btrfs -f -L mydata /dev/nvme0n2 /dev/nvme0n3
btrfs-progs v6.0
See http://btrfs.wiki.kernel.org for more information.

NOTE: several default settings have changed in version 5.15, please make sure
      this does not affect your deployments:
      - DUP for metadata (-m dup)
      - enabled no-holes (-O no-holes)
      - enabled free-space-tree (-R free-space-tree)

Label:              mydata
UUID:               92aac6fd-d7c5-4ac3-9ba6-acbe13071611
Node size:          16384
Sector size:        4096
Filesystem size:    40.00GiB
Block group profiles:
  Data:             single            8.00MiB
  Metadata:         RAID1           256.00MiB
  System:           RAID1             8.00MiB
SSD detected:       yes
Zoned device:       no
Incompat features:  extref, skinny-metadata, no-holes
Runtime features:   free-space-tree
Checksum:           crc32c
Number of devices:  2
Devices:
   ID        SIZE  PATH
    1    20.00GiB  /dev/nvme0n2
    2    20.00GiB  /dev/nvme0n3


-f 是 --force的意思
-L Labels

[root@fedora ~]# mkfs.btrfs --help
用法：mkfs.btrfs [选项] dev [ dev ... ]
选项：
   分配概况：
         -d|--data PROFILE 数据配置文件，raid0, raid1, raid1c3, raid1c4, raid5, raid6, raid10, dup or single
         -m|--metadata PROFILE 元数据配置文件，类似于数据配置文件的值
         -M|--mixed 将元数据和数据混合在一起
   特征：
         --csum 类型
         --checksum TYPE 使用的校验和算法，crc32c（默认），xxhash，sha256，blake2
         -n|--nodesize SIZE btree节点的大小
         -s|--sectorsize SIZE 数据块大小（当前内核可能无法挂载）
         -O|--features LIST 逗号分隔的文件系统功能列表（使用“-O list-all”列出功能）
         -R|--runtime-features LIST 逗号分隔的运行时特性列表（使用“-R list-all”列出运行时特性）
         -L|--label LABEL 设置文件系统标签
         -U|--uuid UUID 指定文件系统的UUID（必须是唯一的）
   创建：
         -b|--byte-count SIZE 将每个设备的大小设置为 SIZE（文件系统大小是所有设备大小的总和）
         -r|--rootdir DIR 从DIR复制文件到镜像根目录
         --shrink (with --rootdir) 将填充的文件系统缩小到最小尺寸
         -K|--nodiscard 不执行整个设备TRIM
         -f|--force 强制覆盖现有文件系统
   一般的：
         -q|--quiet 除错误外没有消息
         -v|--verbose 增加详细级别，默认为1
         -V|--version 打印 mkfs.btrfs 版本并退出
         --help 打印帮助并退出
   弃用：
         -l|--leafsize SIZE 在 6.0 中移除，使用 --nodesize
[root@fedora ~]# mkfs.btrfs -O list-all
可用的文件系统功能：
mixed-bg - 混合数据和元数据块组（compat=2.6.37，safe=2.6.37）
extref - 将每个文件的硬链接限制增加到 65536（compat=3.7，safe=3.12，默认=3.12）
raid56 - raid56 扩展格式 (compat=3.9)
skinny-metadata - 减小大小的元数据范围 refs（compat=3.10，safe=3.18，default=3.18）
no-holes - 文件没有明确的洞范围（compat=3.14，safe=4.0，默认=5.15）
raid1c34 - 具有 3 或 4 个副本的 RAID1 (compat=5.5)
zoned - 支持分区设备 (compat=5.12)

[root@fedora ~]# btrfs fi show
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 2 FS bytes used 144.00KiB
        devid    1 size 20.00GiB used 272.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 264.00MiB path /dev/nvme0n3

mount -t btrfs /dev/nvme0n2 /mnt

#支持多种透明压缩机制
  - zlib
  - lzo
  - zstd
mount -t btrfs -o compress=<type[:level]>, compress-force, compress-force=<type[:level]>

#If compression is enabled, nodatacow and nodatasum are disabled.

# SSD支持
用户可以使用 mount 参数打开 btrfs 针对 SSD 的优化。命令如下：
mount – t btrfs – o SSD /dev/sda5 /btrfsdisk

#同步文件系统
为了提高效率，btrfs 的 IO 操作由一些内核线程异步处理。这使得用户对文件的操作并不会立即反应到磁盘上。您可以做一个实验，在 btrfs 上创建一个文件后，稍等 5 到 10 秒将系统电源切断，再次重启后，新建的文件并没有出现。
对于多数应用这并不是问题，但有些时候用户希望 IO 操作立即执行，此时就需要对文件系统进行同步。下面的 btrfs 命令用来同步文件系统：
btrfsctl –c /btrfsdisk
```

这样一个 Btrfs 就在设备 nvme0n2,nvme0n3上建立好了。值得一提的是在这种缺省情况下，即使只有一个设备，Btrfs 也会对 metadata 进行冗余保护。如果有多个设备，那么您可以在创建文件系统的时候进行 RAID 设置。详细信息请参见后续的介绍。

这里介绍其他几个 mkfs.btrfs 的参数。

- Nodesize 和 leafsize 用来设定 btrfs 内部 BTree 节点的大小，缺省为一个 page 大小。但用户也可以使用更大的节点，以便增加 fanout，减小树的高度，当然这只适合非常大的文件系统。

- Alloc-start 参数用来指定文件系统在磁盘设备上的起始地址。这使得用户可以方便的预留磁盘前面的一些特殊空间。

- Byte-count 参数设定文件系统的大小，用户可以只使用设备的一部分空间，当空间不足时再增加文件系统大小。

## 修改文件系统的大小

当文件系统建立好之后，您可以修改文件系统的大小。 /dev/nvme0n2挂载到了 /mnt下，大小为 40G。假如您希望只使用其中的 37G，则需要减小当前文件系统的大小，这可以通过如下命令实现：

```bash
[root@fedora ~]# df -h
Filesystem                               Size  Used Avail Use% Mounted on
devtmpfs                                 4.0M     0  4.0M   0% /dev
tmpfs                                    1.9G     0  1.9G   0% /dev/shm
tmpfs                                    777M  1.7M  775M   1% /run
/dev/mapper/fedora_localhost--live-root   48G  4.9G   41G  11% /
tmpfs                                    1.9G   16K  1.9G   1% /tmp
/dev/nvme0n1p2                           974M  243M  664M  27% /boot
tmpfs                                    389M   88K  389M   1% /run/user/0
/dev/nvme0n2                              40G  3.8M   40G   1% /mnt

[root@fedora ~]# btrfs filesystem show
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 2 FS bytes used 144.00KiB
        devid    1 size 20.00GiB used 272.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 264.00MiB path /dev/nvme0n3

[root@fedora ~]# btrfs filesystem resize -3G /mnt/
Resize device id 1 (/dev/nvme0n2) from 20.00GiB to 17.00GiB
[root@fedora ~]# df -h
Filesystem                               Size  Used Avail Use% Mounted on
devtmpfs                                 4.0M     0  4.0M   0% /dev
tmpfs                                    1.9G     0  1.9G   0% /dev/shm
tmpfs                                    777M  1.7M  775M   1% /run
/dev/mapper/fedora_localhost--live-root   48G  4.9G   41G  11% /
tmpfs                                    1.9G   16K  1.9G   1% /tmp
/dev/nvme0n1p2                           974M  243M  664M  27% /boot
tmpfs                                    389M   88K  389M   1% /run/user/0
/dev/nvme0n2                              37G  3.8M   37G   1% /mnt
[root@fedora ~]#


btrfs filesystem resize [options] [<devid>:][+/-]<size>[kKmMgGtTpPeE]|[<devid>:]max <path>
```

同样的，您可以使用 btrfsctl 命令增加文件系统的大小。

## 添加设备（热）

```bash
[root@fedora ~]# lsblk
NAME                            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sr0                              11:0    1  1.6G  0 rom
zram0                           252:0    0  3.8G  0 disk [SWAP]
nvme0n1                         259:0    0   50G  0 disk
├─nvme0n1p1                     259:1    0    1M  0 part
├─nvme0n1p2                     259:2    0    1G  0 part /boot
└─nvme0n1p3                     259:3    0   49G  0 part
  └─fedora_localhost--live-root 253:0    0   49G  0 lvm  /
nvme0n2                         259:4    0   20G  0 disk /mnt
nvme0n3                         259:5    0   20G  0 disk
nvme0n4                         259:6    0   20G  0 disk
nvme0n5                         259:7    0   20G  0 disk
nvme0n6                         259:8    0   20G  0 disk
[root@fedora ~]# btrfs fi show
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 2 FS bytes used 144.00KiB
        devid    1 size 17.00GiB used 272.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 264.00MiB path /dev/nvme0n3

[root@fedora ~]# btrfs device add /dev/nvme0n4 /mnt/
[root@fedora ~]# btrfs fi show
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 3 FS bytes used 144.00KiB
        devid    1 size 17.00GiB used 272.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 264.00MiB path /dev/nvme0n3
        devid    3 size 20.00GiB used 0.00B path /dev/nvme0n4

[root@fedora ~]# df -h
Filesystem                               Size  Used Avail Use% Mounted on
devtmpfs                                 4.0M     0  4.0M   0% /dev
tmpfs                                    1.9G     0  1.9G   0% /dev/shm
tmpfs                                    777M  1.7M  775M   1% /run
/dev/mapper/fedora_localhost--live-root   48G  4.9G   41G  11% /
tmpfs                                    1.9G   16K  1.9G   1% /tmp
/dev/nvme0n1p2                           974M  243M  664M  27% /boot
tmpfs                                    389M   88K  389M   1% /run/user/0
/dev/nvme0n2                              57G  3.8M   57G   1% /mnt



```

## 均衡数据（热）

```bash
添加新磁盘后数据不均匀

[root@fedora ~]# btrfs filesystem show /mnt/
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 3 FS bytes used 144.00KiB
        devid    1 size 17.00GiB used 272.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 264.00MiB path /dev/nvme0n3
        devid    3 size 20.00GiB used 0.00B path /dev/nvme0n4

[root@fedora ~]# btrfs balance start /mnt/
WARNING:

        Full balance without filters requested. This operation is ve                                                                           ry
        intense and takes potentially very long. It is recommended t                                                                           o
        use the balance filters to narrow down the scope of balance.
        Use 'btrfs balance start --full-balance' option to skip this
        warning. The operation will start in 10 seconds.
        Use Ctrl-C to stop it.
10 9 8 7 6 5 4 3 2 1
Starting balance without any filters.
Done, had to relocate 3 out of 3 chunks
[root@fedora ~]# btrfs filesystem show /mnt/
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 3 FS bytes used 144.00KiB
        devid    1 size 17.00GiB used 0.00B path /dev/nvme0n2
        devid    2 size 20.00GiB used 288.00MiB path /dev/nvme0n3
        devid    3 size 20.00GiB used 1.28GiB path /dev/nvme0n4




```

## 移除设备(热)

```bash
[root@fedora ~]# btrfs filesystem show /mnt/
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 3 FS bytes used 144.00KiB
        devid    1 size 17.00GiB used 0.00B path /dev/nvme0n2
        devid    2 size 20.00GiB used 288.00MiB path /dev/nvme0n3
        devid    3 size 20.00GiB used 1.28GiB path /dev/nvme0n4

[root@fedora ~]# btrfs device delete /dev/nvme0n4 /mnt/
[root@fedora ~]# btrfs filesystem show /mnt/
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 2 FS bytes used 144.00KiB
        devid    1 size 17.00GiB used 288.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 1.28GiB path /dev/nvme0n3

```



## 查看设备状态

```bash
[root@fedora ~]# btrfs device stats /mnt/
[/dev/nvme0n2].write_io_errs    0
[/dev/nvme0n2].read_io_errs     0
[/dev/nvme0n2].flush_io_errs    0
[/dev/nvme0n2].corruption_errs  0
[/dev/nvme0n2].generation_errs  0
[/dev/nvme0n3].write_io_errs    0
[/dev/nvme0n3].read_io_errs     0
[/dev/nvme0n3].flush_io_errs    0
[/dev/nvme0n3].corruption_errs  0
[/dev/nvme0n3].generation_errs  0
[/dev/nvme0n4].write_io_errs    0
[/dev/nvme0n4].read_io_errs     0
[/dev/nvme0n4].flush_io_errs    0
[/dev/nvme0n4].corruption_errs  0
[/dev/nvme0n4].generation_errs  0

```

## 修改硬件组合模式

```bash
[root@fedora ~]# btrfs filesystem df /mnt | column -t
Data,           single:  total=1.00GiB,    used=0.00B  
System,         RAID1:   total=32.00MiB,   used=16.00KiB
Metadata,       RAID1:   total=256.00MiB,  used=128.00KiB# RAID1
GlobalReserve,  single:  total=3.50MiB,    used=0.00B
[root@fedora ~]# btrfs balance start -mconvert=raid5 /mnt/
WARNING:

        RAID5/6 support has known problems and is strongly discourag                                                                           ed
        to be used besides testing or evaluation. It is recommended                                                                            that
        you use one of the other RAID profiles.
        The operation will continue in 10 seconds.
        Use Ctrl-C to stop.
10 9 8 7 6 5 4 3 2 1
Starting conversion to RAID5/6.
Done, had to relocate 2 out of 3 chunks
[root@fedora ~]# btrfs filesystem df /mnt | column -t
Data,           single:  total=1.00GiB,    used=0.00B
System,         RAID5:   total=32.00MiB,   used=16.00KiB
Metadata,       RAID5:   total=512.00MiB,  used=128.00KiB
GlobalReserve,  single:  total=3.50MiB,    used=0.00B




改 Data 是 -dconvert
改 Metadata 是 -mconvert

							-d[<filters>]
                     act on data block groups, see FILTERS section for details about filters

              -m[<filters>]
                     act on metadata chunks, see FILTERS section for details about filters

              -s[<filters>]
                     act on system chunks (requires -f), see FILTERS section for details about filters.


```





## 创建 subvolume和查询

使用 btrfs 命令，用户可以方便的建立 subvolume 。假设 /btrfsdisk 已经挂载到了 btrfs  文件系统，则用户可以在这个文件系统内创建新的 subvolume 。比如建立一个 /sub1 的 subvolume，并将 sub1 挂载到  /mnt/test 下：



Subvolme  可以方便管理员在文件系统上创建不同用途的子文件系统，并对其进行一些特殊的配置，比如有些目录下的文件关注节约磁盘空间，因此需要打开压缩，或者配置不同的 RAID 策略等。目前 btrfs 尚处于开发阶段，创建的 subvolme 和 snapshot 还无法删除。此外针对 subvolume  的磁盘 quota 功能也未能实现。但随着 btrfs 的不断成熟，这些功能必然将会进一步完善。

```text
[root@fedora ~]# btrfs subvolume create /mnt/logs
Create subvolume '/mnt/logs'
[root@fedora ~]# btrfs subvolume list /mnt
ID 256 gen 75 top level 5 path logs
[root@fedora ~]# btrfs subvolume create /mnt/cache
Create subvolume '/mnt/cache'
[root@fedora ~]# btrfs subvolume list /mnt
ID 256 gen 75 top level 5 path logs
ID 257 gen 76 top level 5 path cache




#mkdir /mnt/test 
 #btrfsctl – S sub1 /btrfsdisk 
 #mount – t btrfs – o subvol=sub1 /dev/sda5 /mnt/test

```

## 单独挂载子卷

```bash
[root@fedora ~]# mkdir -p /data/{logs,cache}
[root@fedora ~]# mount -o subvol=logs /dev/nvme0n2 /data/logs
[root@fedora ~]# df -h
Filesystem                               Size  Used Avail Use% Mounted on
devtmpfs                                 4.0M     0  4.0M   0% /dev
tmpfs                                    1.9G     0  1.9G   0% /dev/shm
tmpfs                                    777M  1.7M  775M   1% /run
/dev/mapper/fedora_localhost--live-root   48G  4.9G   41G  11% /
tmpfs                                    1.9G   16K  1.9G   1% /tmp
/dev/nvme0n1p2                           974M  243M  664M  27% /boot
tmpfs                                    389M   88K  389M   1% /run/user/0
/dev/nvme0n2                              57G  3.7M   57G   1% /mnt
/dev/nvme0n2                              57G  3.7M   57G   1% /data/logs
[root@fedora ~]# cp /var/log/messages /data/logs/
[root@fedora ~]# ls /mnt/logs/
messages
# 查看
[root@fedora ~]# btrfs subvolume show /mnt/logs
logs
        Name:                   logs
        UUID:                   2b85bcf8-9302-0f47-86c1-cc95d34f371b
        Parent UUID:            -
        Received UUID:          -
        Creation time:          2023-01-13 17:22:38 +0800
        Subvolume ID:           256
        Generation:             77
        Gen at creation:        75
        Parent ID:              5
        Top level ID:           5
        Flags:                  -
        Send transid:           0
        Send time:              2023-01-13 17:22:38 +0800
        Receive transid:        0
        Receive time:           -
        Snapshot(s):
[root@fedora ~]# btrfs subvolume show /data/logs
logs
        Name:                   logs
        UUID:                   2b85bcf8-9302-0f47-86c1-cc95d34f371b
        Parent UUID:            -
        Received UUID:          -
        Creation time:          2023-01-13 17:22:38 +0800
        Subvolume ID:           256
        Generation:             77
        Gen at creation:        75
        Parent ID:              5
        Top level ID:           5
        Flags:                  -
        Send transid:           0
        Send time:              2023-01-13 17:22:38 +0800
        Receive transid:        0
        Receive time:           -
        Snapshot(s):
[root@fedora ~]#


# 如果子卷重名 使用子卷id进行挂载


```



## 删除子卷



```bash
[root@fedora ~]# btrfs subvolume delete /mnt/logs
Delete subvolume (no-commit): '/mnt/logs'
[root@fedora ~]#


```



## 创建 Snapshot

下面的例子中，创建快照 snap1 时系统存在 2 个文件。创建快照之后，对 test1 的内容进行修改。再回到 snap1，打开 test1 文件，可以看到 test1 的内容依旧是之前的内容。

```text
[root@fedora ~]# btrfs subvolume snapshot /mnt/cache/ /mnt/cache_snapshot
Create a snapshot of '/mnt/cache/' in '/mnt/cache_snapshot'
[root@fedora ~]#




#ls /btrfsdisk 
 test1 test2 
 #vi test1 
 This is a test 
 #btrfsctl – s snap1 /btrfsdisk 
 #vi test1 
 Test1 is modified 
 #cd /btrfsdisk/snap1 
 #cat test1 
 This is a test
```

可以从上面的例子看到，快照 snap1 保存的内容不会被后续的写操作所改变。

## btrfs，ext4文件系统相互转化

```bash
[root@fedora ~]# lsblk
NAME                            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sr0                              11:0    1  1.6G  0 rom
zram0                           252:0    0  3.8G  0 disk [SWAP]
nvme0n1                         259:0    0   50G  0 disk
├─nvme0n1p1                     259:1    0    1M  0 part
├─nvme0n1p2                     259:2    0    1G  0 part /boot
└─nvme0n1p3                     259:3    0   49G  0 part
  └─fedora_localhost--live-root 253:0    0   49G  0 lvm  /
nvme0n2                         259:4    0   20G  0 disk /data/logs
                                                         /mnt
nvme0n3                         259:5    0   20G  0 disk
nvme0n4                         259:6    0   20G  0 disk
nvme0n5                         259:7    0   20G  0 disk
nvme0n6                         259:8    0   20G  0 disk
[root@fedora ~]# mkfs.ext4 /dev/nvme0n5
mke2fs 1.46.5 (30-Dec-2021)
/dev/nvme0n5 contains a ext4 file system
        created on Fri Jan 13 17:46:54 2023
Proceed anyway? (y,N) y
Creating filesystem with 5242880 4k blocks and 1310720 inodes
Filesystem UUID: d0f52ff3-b84a-4698-bb69-208d550a4b57
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000

Allocating group tables: done
Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done

[root@fedora ~]# mount /dev/nvme0n5 /ext4/
[root@fedora ~]# df -h
Filesystem                               Size  Used Avail Use% Mounted on
devtmpfs                                 4.0M     0  4.0M   0% /dev
tmpfs                                    1.9G     0  1.9G   0% /dev/shm
tmpfs                                    777M  1.7M  775M   1% /run
/dev/mapper/fedora_localhost--live-root   48G  4.9G   41G  11% /
tmpfs                                    1.9G   16K  1.9G   1% /tmp
/dev/nvme0n1p2                           974M  243M  664M  27% /boot
tmpfs                                    389M   88K  389M   1% /run/user/0
/dev/nvme0n2                              57G  4.2M   57G   1% /mnt
/dev/nvme0n2                              57G  4.2M   57G   1% /data/logs
/dev/nvme0n5                              20G   24K   19G   1% /ext4
[root@fedora ~]# echo 111 > /ext4/111
[root@fedora ~]# btrfs
btrfs               btrfs-convert       btrfs-image         btrfs-select-super
btrfsck             btrfs-find-root     btrfs-map-logical   btrfstune
[root@fedora ~]# umount /ext4
[root@fedora ~]# btrfs-convert /dev/nvme0n5
btrfs-convert from btrfs-progs v6.0

Source filesystem:
  Type:           ext2
  Label:
  Blocksize:      4096
  UUID:           d0f52ff3-b84a-4698-bb69-208d550a4b57
Target filesystem:
  Label:
  Blocksize:      4096
  Nodesize:       16384
  UUID:           68f5d99f-e845-4fd7-8f84-701604f07604
  Checksum:       crc32c
  Features:       extref, skinny-metadata, no-holes (default)
    Data csum:    yes
    Inline data:  yes
    Copy xattr:   yes
Reported stats:
  Total space:     21474836480
  Free space:      20693188608 (96.36%)
  Inode count:         1310720
  Free inodes:         1310708
  Block count:         5242880
Create initial btrfs filesystem
Create ext2 image file
Create btrfs metadata
Copy inodes [o] [         3/        12]
Conversion complete
[root@fedora ~]# btrfs filesystem show
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 3 FS bytes used 640.00KiB
        devid    1 size 17.00GiB used 272.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 272.00MiB path /dev/nvme0n3
        devid    3 size 20.00GiB used 1.27GiB path /dev/nvme0n4

Label: none  uuid: 68f5d99f-e845-4fd7-8f84-701604f07604
        Total devices 1 FS bytes used 494.20MiB
        devid    1 size 20.00GiB used 780.30MiB path /dev/nvme0n5

[root@fedora ~]# mount /dev/nvme0n5 /ext4/
[root@fedora ~]# ls /ext4/
111  ext2_saved  lost+found




```

恢复

```bash
[root@fedora ~]# umount /ext4
[root@fedora ~]# btrfs-convert -r /dev/nvme0n5
btrfs-convert from btrfs-progs v6.0

Open filesystem for rollback:
  Label:
  UUID:            68f5d99f-e845-4fd7-8f84-701604f07604
  Restoring from:  ext2_saved/image
Rollback succeeded

```





## Debug 功能

```
Btrfs 提供了一定的 debug 功能，对于想了解 Btrfs 内部实现原理的读者，debug 将是您最喜欢的工具。这里简单介绍一下 debug 功能的命令使用。
下面的命令将设备 sda5 上的 btrfs 文件系统中的元数据打印到屏幕上。
1#btrfs-debug-tree /dev/sda5
通过对打印信息的分析，您将能了解 btrfs 内部各个 BTree 的变化情况，从而进一步理解每一个文件系统功能的内部实现细节。
比如您可以在创建一个文件之前将 BTree 的内容打印出来，创建文件后再次打印。通过比较两次的不同来了解 btrfs 创建一个文件需要修改哪些元数据。进而理解 btrfs 内部的工作原理。
```



