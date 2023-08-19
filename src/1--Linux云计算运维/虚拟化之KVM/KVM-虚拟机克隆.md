我们学习了使用模板创建虚拟机，除此之外还有另外的一种方法可以批量创建虚拟机，那就是克隆

## 一、克隆分类

完整克隆：对原始虚拟机完整拷贝，删除原始虚拟机，对克隆机器不影响，需要较多的空间。类似于我们之前学到的基于模板创建虚拟机。

链接克隆：对原始虚拟机[硬盘]的链接，原始虚拟机删除，链接失败

## 二、完整克隆

完整克隆和根据模板机创建虚拟机的步骤是一样的。

a、复制一个磁盘文件

b、创建一个虚拟机的xml文件

使用克隆的方法的好处是以上的步骤不需要手动完成了。

**注意事项：被克隆的机器最好先做成模板机，否者很多唯一性的东西还得手动删除，就是制作模板机的那些删除数据。**

### 2.1、自动克隆

```
[root@zutuanxue ~]# virt-clone --auto-clone -o rhel8 -n rhel8-clone

-o 原始虚拟机
-n 克隆后的新虚拟机
```

### 2.2、手动克隆

-  复制一个磁盘
-  生成一个xml文件
-  修改xml文件
-  导入xml文件

a、使用cp命令复制一个磁盘

```
[root@zutuanxue ~]# cp /var/lib/libvirt/images/rhel8.qcow2 /var/lib/libvirt/images/rhel8_clone1.qcow2
```

b、复制一个虚拟机的xml文件

```
[root@zutuanxue ~]# virsh dumpxml --domain rhel8 > /etc/libvirt/qemu/rhel8_clone1.xml
```

c、修改xml文件 将原始机器的唯一性配置删除

```
xml文件修改
#修改虚拟机名字
#删除UUID
#删除mac地址
#修改磁盘路径
```

d、导入虚拟机

```
根据xml文件导入机器
[root@zutuanxue ~]# virsh define --file /etc/libvirt/qemu/rhel8_clone1.xml 
定义域 rhel8_clone1（从 /etc/libvirt/qemu/rhel8_clone1.xml）
```

## 链接克隆

-  创建一个链接克隆磁盘，必须是qcow2格式磁盘
-  生成一个xml文件
-  修改xml文件
-  导入xml文件

a、 创建一个链接克隆磁盘，必须是qcow2格式磁盘

```
[root@zutuanxue ~]# qemu-img create -b /var/lib/libvirt/images/rhel8.qcow2 -f qcow2 /var/lib/libvirt/images/rhel8_clone2.qcow2
Formatting '/var/lib/libvirt/images/rhel8_clone2.qcow2', fmt=qcow2 size=10737418240 backing_file=/var/lib/libvirt/images/rhel8.qcow2 cluster_size=65536 lazy_refcounts=off refcount_bits=16

查看
[root@zutuanxue ~]# ll -h /var/lib/libvirt/images/rhel8_clone2.qcow2 
-rw-r--r-- 1 root root 193K 3月  24 00:49 /var/lib/libvirt/images/rhel8_clone2.qcow2

显示仅有193K，ok


[root@zutuanxue ~]# qemu-img info /var/lib/libvirt/images/rhel8_clone2.qcow2 
image: /var/lib/libvirt/images/rhel8_clone2.qcow2
file format: qcow2
virtual size: 10G (10737418240 bytes)
disk size: 196K
cluster_size: 65536
backing file: /var/lib/libvirt/images/rhel8.qcow2  #显示链接后端磁盘
Format specific information:
    compat: 1.1
    lazy refcounts: false
    refcount bits: 16
    corrupt: false
```

b、生成一个xml文件

```
[root@zutuanxue ~]# virsh dumpxml --domain rhel8 > /etc/libvirt/qemu/rhel8_clone2.xml
```

c、修改xml

```
修改虚拟机名字
删除UUID
删除mac地址
修改磁盘路径
```

d、导入虚拟机

```
[root@zutuanxue ~]# virsh define /etc/libvirt/qemu/rhel8_clone2.xml
定义域 rhel8_clone2（从 /etc/libvirt/qemu/rhel8_clone2.xml）

[root@zutuanxue ~]# virsh list --all
 Id    名称                         状态
----------------------------------------------------
 6     rhel8-clone                    running
 -     centos8-3                      关闭
 -     centos8-4                      关闭
 -     rhel8                          关闭
 -     rhel8-2                        关闭
 -     rhel8_clone2                   关闭
 -     win10                          关闭
```