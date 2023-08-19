## 一、虚拟机系统安装

### 1.1、安装步骤

1. 虚拟机硬件设置
2. 系统安装方法—CD
3. 安装系统
4. 测试系统

### 1.2、为虚拟机安装一个linux系统

 a、新创建虚拟机并安装系统

 virt-install

 virt-manager

 cockpit web控制台

```
同时都具备  第一次开机光驱启动功能
```

 b、已经创建并且开机过，需要安装系统。思考哪个虚拟机工具具备开机调整启动项

 virt-manager



演示

### 1.3、为虚拟机安装一个windowns系统

**安装方法**

```
virt-install --name win10 --memory 4096 --vcpus 2 --disk size=40,bus=virtio,format=raw --os-variant win10 --cdrom /cache/iso/Windows10.iso  --network network=default
```

**注意：windows的virtio总线驱动**

```
virtio-win-1.9.9-3.el8.noarch.rpm   这个必须装
```

演示安装

## 二、总结

### **系统安装思考与经验**

为虚拟机安装系统在运维工作中会出现，但是不是常态化的工作，我们只需要能够清楚不同的安装场景怎么应对就行了。

 新建虚拟机安装系统

 为虚拟机重载系统—需要思考如何调整启动项—**virt-manager**

**线上虚拟机都是通过模板机批量创建的，省时省力。**

 阿里云购买了ECS后需要等待3-5分钟为什么？

 阿里云购买ECS只有特定的系统，不是所有都有的？为什么

就是给你准备了模板机，你买我就给你根据模板机克隆一个虚拟机，当然克隆需要时间。

### linux系统安装要点：

 1、CPU选择 数量不要超过真机

 2、内存选择 建议1G以上，如果需要图形界面

 3、硬盘选择 建议5G以上

 4、io总线：virtio

 5、连接方式：VNC spice

### windows系统安装要点：

 1、CPU选择 数量不要超过真机

 2、内存选择 建议2G以上

 3、硬盘选择 建议30G以上

 4、**io总线：virtio总线驱动安装** 难点

```
/usr/share/virtio-win/virtio-win-1.9.9.iso
/usr/share/virtio-win/virtio-win.iso
在安装过程中需要切换光盘安装驱动
```

 5、连接方式：VNC