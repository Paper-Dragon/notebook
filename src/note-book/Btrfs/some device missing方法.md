# *** Some devices missing

## 问题原因：

因为创建btrfs时使用了-f，所以硬盘被另一个btrfs抢走了，blkid改变

## 问题描述

```bash
[root@fedora ~]# btrfs fi show
warning, device 2 is missing
warning, device 1 is missing
WARNING: could not setup csum tree, skipping it
Label: 'mydata'  uuid: b2daf230-bd04-4ca5-ac2f-2b7c4a8f1ac4
        Total devices 3 FS bytes used 256.00KiB
        devid    3 size 20.00GiB used 144.00MiB path /dev/nvme0n4
        *** Some devices missing

```

## 问题解决

```bash
# blkid
发现uuid被更改


# 清理旧的 super block 
[root@fedora ~]# wipefs -o 0x10040  /dev/nvme0n4
/dev/nvme0n4: 8 bytes were erased at offset 0x00010040 (btrfs): 5f 42 48 52 66 53 5f 4d
[root@fedora ~]# btrfs fi show
Label: 'mydata'  uuid: 92aac6fd-d7c5-4ac3-9ba6-acbe13071611
        Total devices 2 FS bytes used 144.00KiB
        devid    1 size 20.00GiB used 272.00MiB path /dev/nvme0n2
        devid    2 size 20.00GiB used 264.00MiB path /dev/nvme0n3



```

## 参考连接

https://btrfs.wiki.kernel.org/index.php/Problem_FAQ#I_can.27t_mount_my_filesystem.2C_and_I_get_a_kernel_oops.21

https://stackoverflow.com/questions/22390676/how-to-get-rid-of-some-devices-missing-in-btrfs-after-reuse-of-devices