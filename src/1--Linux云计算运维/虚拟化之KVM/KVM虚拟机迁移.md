## 一、KVM宿主机高可用架构设计

- 宿主机故障，内部虚拟机可以不受影响，可以迁移走
- 负载均衡，当某个宿主机压力过大，可以将部分虚拟机迁移到其他机器，降低其负载。

### 1.1、架构设计

![KVM虚拟机容灾架构.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601971892584.png)

### 1.2、实验机器

|   机器    |       IP        |   角色    |
| :-------: | :-------------: | :-------: |
|   node1   | 192.168.122.100 | KVM宿主机 |
|   node2   | 192.168.122.200 | KVM宿主机 |
| zutuanxue |  192.168.122.1  |  NFS存储  |

### 1.3、架构部署

**部署前准备**

1. IP地址设置，保障机器间的通信
2. 主机名设置与解析
3. 关闭防火墙与selinux
4. 时间同步
5. 安装KVM虚拟化
6. KVM宿主机实现SSH证书互信任

**机器准备**

```
[root@zutuanxue ~]# virt-clone --auto-clone -o rhel8 -n node1
正在分配 'node1.qcow2'                                                                                     |  10 GB  00:00:00     

成功克隆 'node1'。
[root@zutuanxue ~]# virt-clone --auto-clone -o rhel8 -n node2
正在分配 'node2.qcow2'                                                                                     |  10 GB  00:00:00     

成功克隆 'node2'。
```

**部署**

设置存储，开启nfs服务

```
[root@zutuanxue ~]# cat /etc/exports
/var/lib/libvirt/images     0.0.0.0/0.0.0.0(rw,sync,no_root_squash)
[root@zutuanxue ~]# systemctl start nfs-server.service
```

KVM宿主机连接NFS存储，要求开机挂载

```
[root@node1 ~]# mount -t nfs 192.168.122.250:/images /var/lib/libvirt/images/

[root@node2 ~]# mount -t nfs 192.168.122.250:/images /var/lib/libvirt/images/
```

创建一个KVM虚拟机

```
[root@node1 ~]# virt-install --name xx --memory 512 --vcpus=1 --disk /var/lib/libvirt/images/rhel8-clone.qcow2 --import --network network=default
```

### 1.4、虚拟机迁移

模拟一台KVM宿主机故障，KVM虚拟机实现迁移

```
[root@node1 ~]# virsh migrate --live --verbose xx qemu+ssh://192.168.122.200/system --unsafe
setlocale: No such file or directory
root@192.168.122.200's password: 
Migration: [100 %]


--live 在线迁移
--verbose  显示迁移进度
qemu+ssh://  libvirt提供的连接方式、
--unsafe 允许不安全迁移
```

## 二、vmware 虚拟机迁移到KVM

- 修剪虚拟机文件
- 将vmware磁盘格式转换为kvm磁盘格式
- 创建虚拟机验证

a、修剪虚拟机文件

```
#删除缓存文件
[root@zutuanxue CentOS_8_node3.vmwarevm]# rm -rf caches/
#删除快照文件
[root@zutuanxue CentOS_8_node3.vmwarevm]# rm -rf CentOS_8_node3-Snapshot*
#删除日志文件
[root@zutuanxue CentOS_8_node3.vmwarevm]# rm -rf vmware-[0-9].log
```

b、将vmware磁盘格式导成kvm磁盘格式

```
[root@zutuanxue CentOS_8_node3.vmwarevm]# qemu-img convert 虚拟磁盘.vmdk -O qcow2 /var/lib/libvirt/images/centos_8_node3.qcow2
```

c、创建虚拟机加载磁盘，验证

```
[root@zutuanxue CentOS_8_node3.vmwarevm]# virt-install --name qy1 --memory 1024 --vcpus=2 --disk=/var/lib/libvirt/images/centos_8_node3.qcow2 --
```