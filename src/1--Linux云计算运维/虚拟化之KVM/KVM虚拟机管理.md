## 一、虚拟机基本管理

虚拟机管理方法：

-  virt-manager
-  cockpit web控制台
-  virsh命令

### 1.1.1、virt-manager管理工具

### 1.1.2、cockpit管理工具

### 1.1.3、virsh命令用法

**a、virsh交互界面**

```
[root@zutuanxue ~]# virsh
欢迎使用 virsh，虚拟化的交互式终端。

输入：'help' 来获得命令的帮助信息
       'quit' 退出

virsh # list
 Id    名称                         状态
----------------------------------------------------
```

**b、shell 命令行使用virsh**

```
[root@zutuanxue ~]# virsh list
 Id    名称                         状态
----------------------------------------------------
```

**c、查看虚拟机**

```
virsh # list --all
 Id    名称                         状态
----------------------------------------------------
 -     rhel8                          关闭
 -     win10                          关闭
```

**d、虚拟机启动、关闭、重启**

```
虚拟机启动
virsh # start rhel8
域 rhel8 已开始

virsh # list --all
 Id    名称                         状态
----------------------------------------------------
 12    rhel8                          running
 -     win10                          关闭
 
虚拟机关闭 
virsh # shutdown rhel8
域 rhel8 被关闭

virsh # list --all
 Id    名称                         状态
----------------------------------------------------
 -     rhel8                          关闭
 -     win10                          关闭
 
#强制关闭
virsh # destroy rhel8
域 rhel8 被删除

virsh # list --all
 Id    名称                         状态
----------------------------------------------------
 -     rhel8                          关闭
 -     win10                          关闭
 
#重启虚拟机，前提是必须是启动状态 
virsh # reboot rhel8 
域 rhel8 正在被重新启动
```

**e、虚拟机挂起与恢复**

```
#挂起虚拟机
virsh # suspend --domain rhel8 
域 rhel8 被挂起

virsh # list --all
 Id    名称                         状态
----------------------------------------------------
 12    rhel8                          暂停
 -     win10                          关闭
 
#恢复虚拟机 
virsh # resume --domain rhel8 
域 rhel8 被重新恢复

virsh # list --all
 Id    名称                         状态
----------------------------------------------------
 12    rhel8                          running
 -     win10                          关闭
```

## 二、虚拟机模板

**模板介绍：**

模板类似于生活中的模具，可以根据模具制作出很多一模一样的产品。模板在计算机中应用是比较多的，用户可以根据模板去批量生成应用。

**虚拟机模板作用：**

-  批量生成虚拟机
-  缩短部署时间
-  提升工作效率

**模板制作步骤**

1. 删除 ssh 主机密钥：rm -rf /etc/ssh/ssh_host_*

2. 在 /etc/hostname 中设置 HOSTNAME=localhost.localdomain。

3. 从 /etc/sysconfig/network-scripts/==ifcfg-ens*==中删除 HWADDR 行和 UUID 行。

4. 另外，从 /var/log 中删除所有日志，从 /root 中删除 build 日志。

5. 关机，备份模板机硬盘

	```
	生成模板硬盘，保存，用于后续可以复制出来N多个这样的硬盘，让虚拟机直接导入使用
	```

**根据模板机生成虚拟机**

- 复制模板硬盘
- 创建虚拟机，导入硬盘

```
virt-install --name centos8-3 --memory 1024 --vcpus 2 --disk /var/lib/libvirt/images/centos8-3.qcow2,bus=virtio,format=qcow2 --import  --os-variant win10   --network network=default
```

## 三、虚拟机快照管理

-  创建快照
-  查看快照
-  删除快照
-  还原快照

**快照创建方法：**

1. LVM快照
2. 基于qcow2磁盘格式创建快照

### 3.1、 基于KVM的虚拟机快照

**创建快照**

KVM快照是基于LVM快照来实现的，具体操作方法是：

- 创建一个LV，假设为node1_disk
- 创建虚拟机使用现有LV:node1_disk
- 安装系统并做好应用 [创建快照之前]
- 关闭虚拟机
- 创建kvm的快照：node1_disk_snap
- 修改虚拟机磁盘使用快照磁盘:node1_disk_snap

```
虚拟机使用的是快照盘 
还原虚拟机就是基于原盘再做一次快照，继续使用快照就可以了
```

**还原快照**

- 关闭虚拟机
- 删除kvm的快照:node1_disk_snap
- 创建新快照：node1_disk_snap
- 开机

**拓展知识点-lvm**

```
#创建lv kvm_disk
[root@zutuanxue ~]# lvcreate -n kvm_disk -L5G  cl 
  Logical volume "kvm_disk" created.
 
#生成lv快照
[root@zutuanxue ~]# lvcreate -n kvm_disk_snap -L 5G -s /dev/cl/kvm_disk 

#删除快照
[root@zutuanxue ~]# lvremove /dev/cl/kvm_disk_snap 
Do you really want to remove active logical volume cl/kvm_disk_snap? [y/n]: y
  Logical volume "kvm_disk_snap" successfully removed
```

### 3.2、KVM自带快照功能

**创建快照: snapshot-create-as**

```
命令格式	
virsh   snapshot-create-as   虚拟机的名称  snapshot的名称

#为rhel8创建一个快照
virsh # snapshot-create-as rhel8 web01
已生成域快照 web01
```

**查看快照**

```
#查看快照
virsh # snapshot-list rhel8
 名称               生成时间              状态
------------------------------------------------------------
 web01                2020-03-21 00:37:35 -0400 running
 

#查看快照信息
virsh # snapshot-info --domain rhel8 --snapshotname web01 
名称：       web01
域：          rhel8
当前：       是
状态：       running
位置：       内部
上级：       -
下级：       0
降序：       0
元数据：    是 
```

**还原快照**

```
#命令格式
virsh snapshot-revert 虚拟机的名称 --snapshotname  快照名称

#还原快照web01
virsh # snapshot-revert --domain rhel8 --snapshotname web01 
```

**删除快照**

```
virsh # snapshot-delete --domain rhel8 web01 
已删除域快照 web01
```

**扩展：raw磁盘转换qcow2方法**

```
qemu-img命令
-f  源镜像的格式   
-O 目标镜像的格式

#a、转换磁盘格式
[root@zutuanxue ~]# qemu-img convert -fraw -O qcow2 /var/lib/libvirt/images/win10.img /var/lib/libvirt/images/win10.qcow2

#b、修改xml文件定义磁盘格式
[root@zutuanxue ~]# vim /etc/libvirt/qemu/win10.xml
<disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='/var/lib/libvirt/images/win10.qcow2'/>
      <target dev='vda' bus='virtio'/>
      <address type='pci' domain='0x0000' bus='0x04' slot='0x00' function='0x0'/>
    </disk>

#c、重启服务生效
[root@zutuanxue ~]# systemctl restart libvirtd.service
```

**思考**：如何将其他格式的磁盘 转换为qcow2

```
qemu-img  -f原格式 -O转换后的格式  源磁盘路径   转换后的磁盘路径
```