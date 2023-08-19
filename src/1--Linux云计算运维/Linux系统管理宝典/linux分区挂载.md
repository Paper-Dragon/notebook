磁盘在linux中经过分区、格式化后是无法直接使用的，因为该分区在系统中是以一个设备文件的形式存在的。我们如果希望使用这个磁盘分区还得经过最后一步，就是将这个分区设备挂载到系统中的某个文件夹下。这样你往这个挂载文件夹里存东西其实即使往分区里存东西了。
接下来我们来看看linux下挂载磁盘分区的方式

- 手动挂载
- 开机自动挂载
- 触发挂载

## 一、手动挂载

mount挂载命令

```
mount - mount a filesystem

命令语法
mount device dir

命令选项
-a   挂载所有文件系统，参考文件 /etc/fstab
-l   显示当前挂载
-t   文件系统类型
-o   指定挂载权限

##用法说明
mount   [options]     需要挂载的设备     挂载点
特点：系统重启后需要重新挂载；手动卸载后需要手动挂载

-o:挂载选项	ro,sync,rw,remount
-t:文件系统类型
mount -t nfs=mount.nfs
mount -t cifs=mount.cifs
```

挂载分区演示

```
#案列1：以只读的方式重新挂载/u02分区
[root@zutuanxue ~]# mount -o remount,ro /u02		//可以是挂载点也可以是设备
remount:重新挂载一个正在挂载的设备

# mount -o remount,ro /dev/sdb1		
# mount -o remount,ro /u01
注意：后面可以根挂载点也可以跟设备本身


#案例2: 如果希望将本机的某个文件夹挂到另一个文件夹
mount -o bind /etc /opt/data3
```

设备表示方法：

- 设备文件
- 设备UUID
- 设备的卷标

```
#设备文件：
/dev/sdb
/dev/sdb1

#通过UUID表示设备
[root@zutuanxue ~]# blkid /dev/sdb1				//查看设备的UUID和文件系统类型
/dev/sdb1: UUID="96b67b7b..." TYPE="xfs" PARTUUID="80e196f2-01"
[root@zutuanxue ~]# blkid /dev/sdb2
/dev/sdb2: UUID="6821-049E" TYPE="vfat" PARTUUID="80e196f2-02"


#通过卷标表示设备
#不同类型分区卷标管理与查看
ext*设置&查看卷标
[root@zutuanxue ~]# e2label /dev/sdb1 DISK1			ext*设置卷标
[root@zutuanxue ~]# e2label /dev/sdb1						ext*查看卷标

xfs设置&查看卷标
[root@zutuanxue ~]# xfs_admin -L DISK1 /dev/sdb1	xfs设置卷标
[root@zutuanxue ~]# xfs_admin -l /dev/sdb1				xfs查看卷标
label = "DISK1"

vfat设置&查看卷标
[root@zutuanxue ~]# dosfslabel /dev/sdb2 hello
[root@zutuanxue ~]# dosfslabel /dev/sdb2

也可以使用blkid查看卷标
[root@zutuanxue ~]# blkid /dev/sdb1
/dev/sdb1: LABEL="DISK1" UUID="96.." TYPE="xfs" PARTUUID="80..-01"
[root@zutuanxue ~]# blkid /dev/sdb2
/dev/sdb2: LABEL="disk2" UUID="6..." TYPE="vfat" PARTUUID="8e.2-02"
```

umount设备卸载命令
命令详解

```
umount - 卸载文件系统

umount 设备挂载点|设备源

-l  懒惰卸载
```

命令用法演示

```
卸载设备：umount
[root@zutuanxue ~]# umount /u01
[root@zutuanxue ~]# umount /dev/sdb2
```

## 二、开机自动挂载：

自动挂载 /etc/fstab文件
特点：系统开机或重启会自动挂载；手动卸载后，使用mount -a自动挂载

```
文件内容格式：
要挂载的资源路径	挂载点	文件系统类型	挂载选项	dump备份支持  文件系统检测
UUID=289370eb-9459-42a8-8cee-7006507f1477   /      ext4    defaults        1 1

#字段说明
1段：挂载的设备（磁盘设备的文件名或设备的卷标或者是设备的UUID）
2段：挂载点（建议用一个空目录），建议不要将多个设备挂载到同一个挂载点上
3段：文件系统类型（ext3、ext4、vfat、ntfs（安装软件包）、swap等等）
4段：挂载选项
dev/nodev		被挂载的设备上的设备文件，是否被识别为设备文件
async/sync  异步/同步 同步利于数据保存 异步利于提高性能
auto/noauto     自动/非自动：
rw/ro   读写/只读：
exec/noexec     被挂载设备中的可执行文件是否可执行
remount     重新挂在一个已经挂载的文件系统，常用于修改挂载参数
user/nouser     允许/不允许其他普通用户挂载：
suid/nosuid     具有/不具有suid权限：该文件系统是否允许SUID的存在。
usrquota    这个是在启动文件系统的时候，让其支持磁盘配额，这个是针对用户的。
grpquota    支持用户组的磁盘配额。
....
defaults 同时具有rw, dev, exec,  async,nouser等参数。
更多挂载选项可以通过 man mount  -o 命令选项可以找到详细信息

5段：是否支持dump备份。//dump是一个用来备份的命令，0代表不要做dump备份，1代表要每天进行dump的动作，2也代表其他不定日期的dump备份。通常这个数值不是0就是1。数字越小优先级越高。

6段：是否用 fsck 检验扇区。//开机的过程中，系统默认会用fsck检验文件系统是否完整。0是不要检验，1表示最先检验(一般只有根目录会设定为1)，2也是要检验，只是1是最先，2是其次才进行检验。

# fsck -f /dev/sdb2		强制检验/dev/sdb2上文件系统

说明：
要挂载的资源路径可以是文件系统的UUID，设备路径，文件系统的标签 ，光盘镜像文件（iso），亦或是来自网络的共享资源等
```

## 三、自动挂载 Automount：

特点：挂载是由访问产生；卸载是由超时产生；依赖于后台的autofs服务

思路：

1. 所有的监控都是由一个程序完成 autofs
2. 服务启动后才会监控挂载的设备
3. 修改配置文件来指定需要监控的设备

案例演示
需求：让系统自动挂载/dev/sdb2设备，如果2分钟没有被用自动卸载

```
步骤：
1）安装autofs软件
[root@zutuanxue ~]# rpm -q autofs
package autofs is not installed
[root@zutuanxue ~]# dnf install autofs

[root@zutuanxue ~]# rpm -q autofs
autofs-5.1.4-29.el8.x86_64
2）修改配置文件（指定需要监控的设备和挂载的目录）
vim /etc/auto.master		//定义一级挂载点/u01和子配置文件
/u01    /etc/auto.test	-t 120 或者 --timeout 120  单位秒   （设置超时时间去卸载）

vim /etc/auto.test			//子配置文件自己创建，定义二级挂载点和需要挂载的设备
test  -fstype=ext4,ro   :/dev/sdb2


3）重启服务
[root@zutuanxue ~]# systemctl restart autofs

4）测试验证
[root@zutuanxue ~]# ls /u01/test
[root@zutuanxue ~]# df -h


后续补充：
如果想要将/dev/sdb2挂载到/u01下，怎么做？
vim /etc/auto.master
/-		/etc/auto.test

vim /etc/auto.test
/u01	-fstype=ext4 :/dev/sdb2
```