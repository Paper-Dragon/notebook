## 一、概念介绍

**PersistentVolume （PV）** 是由管理员设置的存储，它是群集的一部分。就像节点是集群中的资源一样，PV 也是集群中的资源。 PV 是Volume 之类的卷插件，但具有独立于使用 PV 的 Pod 的生命周期。此 API 对象包含存储实现的细节，即 NFS、iSCSI 或特定于云供应商的存储系统。

**PersistentVolumeClaim （PVC）** 是用户存储的请求。它与 Pod 相似。Pod 消耗节点资源，PVC 消耗 PV 资源。Pod 可以请求特定级别的资源（CPU 和内存）。声明可以请求特定的大小和访问模式（例如，可以以读/写一次或 只读多次模式挂载）。

**静态 pv**

集群管理员创建一些 PV。它们带有可供群集用户使用的实际存储的细节。它们存在于 Kubernetes API 中，可用于消费。

**动态**

当管理员创建的静态 PV 都不匹配用户的 PersistentVolumeClaim 时，集群可能会尝试动态地为 PVC 创建卷。此配置基于 StorageClasses ：PVC 必须请求 [存储类]，并且管理员必须创建并配置该类才能进行动态创建。声明该类为 “” 可以有效地禁用其动态配置

要启用基于存储级别的动态存储配置，集群管理员需要启用 API server 上的 DefaultStorageClass [准入控制器]。例如，通过确保 DefaultStorageClass 位于 API server 组件的 --admission-control 标志，使用逗号分隔的有序值列表中，可以完成此操作。

**绑定**

master 中的控制环路监视新的 PVC，寻找匹配的 PV（如果可能），并将它们绑定在一起。如果为新的 PVC 动态调配 PV，则该环路将始终将该 PV 绑定到 PVC。否则，用户总会得到他们所请求的存储，但是容量可能超出要求的数量。一旦 PV 和 PVC 绑定后， PersistentVolumeClaim 绑定是排他性的，不管它们是如何绑定的。 PVC 跟PV 绑定是一对一的映射。

## 二、持久化卷

**持久化卷声明的保护**

PVC 保护的目的是确保由 pod 正在使用的 PVC 不会从系统中移除，因为如果被移除的话可能会导致数据丢失

```
# 注意 ：当 pod 状态为 “pending” 并且 Pod 已经分配给节点 或者 Pod 为 “running” 状态时，pvc 处于活动状态。
```

当启用PVC 保护 alpha 功能时，如果用户删除了一个 pod 正在使用的 PVC，则该 PVC 不会被立即删除。PVC 的删除将被推迟，直到 PVC 不再被任何 pod 使用。

**持久化卷类型**

PersistentVolume 类型以插件形式实现。Kubernetes 目前支持以下插件类型：

```
GCEPersistentDisk、AWSElasticBlockStore、AzureFile、AzureDisk、FC(Fibre Channel)、FlexVolume、Flocker、NFS、iSCSI、RBD、(Ceph Block Device)、CephFS、Cinder、(OpenStack block storage)、Glusterfs、VsphereVolume、Quobyte、Volumes、HostPath等等**
```

**持久卷演示代码：**

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 192.168.1.169
```

## 三、访问模式

**PV 访问模式**

PersistentVolume 可以以资源提供者支持的任何方式挂载到主机上。如下表所示，供应商具有不同的功能，每个 PV 的访问模式都将被设置为该卷支持的特定模式。例如，NFS 可以支持多个读/写客户端，但特定的 NFS PV 可能以只读方式导出到服务器上。每个 PV 都有一套自己的用来描述特定功能的访问模式。

- ReadWriteOnce——该卷可以被单个节点以读/写模式挂载
- ReadOnlyMany——该卷可以被多个节点以只读模式挂载
- ReadWriteMany——该卷可以被多个节点以读/写模式挂载

**在命令行中，访问模式缩写为：**

- RWO - ReadWriteOnce
- ROX - ReadOnlyMany
- RWX - ReadWriteMany

```
# ！注意 ：一个卷一次只能使用一种访问模式进行挂载，即使它支持很多访问模式，GCEPersistentDisk 可以由单个节点做为 ReadWriteOnce 模式挂载，或者由多个节点以 ReadOnlyMany 模式挂载，但是不能同时挂载。
```

|               Volume 插件                | ReadWriteOnce | ReadOnlyMany |      ReadWriteMany      |
| :--------------------------------------: | :-----------: | :----------: | :---------------------: |
| AWSElasticBlockStoreAWSElasticBlockStore |       ✓       |      -       |            -            |
|                AzureFile                 |       ✓       |      ✓       |            ✓            |
|                AzureDisk                 |       ✓       |      -       |            -            |
|                  CephFS                  |       ✓       |      ✓       |            ✓            |
|                  Cinder                  |       ✓       |      -       |            -            |
|                    FC                    |       ✓       |      ✓       |            -            |
|                FlexVolume                |       ✓       |      ✓       |            -            |
|                 Flocker                  |       ✓       |      -       |            -            |
|            GCEPersistentDisk             |       ✓       |      ✓       |            -            |
|                Glusterfs                 |       ✓       |      ✓       |            ✓            |
|                 HostPath                 |       ✓       |      -       |            -            |
|                  iSCSI                   |       ✓       |      ✓       |            -            |
|           PhotonPersistentDisk           |       ✓       |      -       |            -            |
|                 Quobyte                  |       ✓       |      ✓       |            ✓            |
|                   NFS                    |       ✓       |      ✓       |            ✓            |
|                   RBD                    |       ✓       |      ✓       |            -            |
|              VsphereVolume               |       ✓       |      -       | - （当 pod 并列时有效） |
|              PortworxVolume              |       ✓       |      -       |            ✓            |
|                 ScaleIO                  |       ✓       |      ✓       |            -            |
|                 ScaleIO                  |       ✓       |      -       |            -            |

## 四、回收策略

**Retain（保留）——手动回收**

**Recycle（回收）——基本擦除（ rm -rf /thevolume/\* ）【已被废弃】**

**Delete（删除）——关联的存储资产（例如 AWS EBS、GCE PD、Azure Disk 和 OpenStack Cinder 卷）将被删除**



## 五、状态

**卷可以处于以下的某种状态：**

**Available（可用）——一块空闲资源还没有被任何声明绑定**

**Bound（已绑定）——卷已经被声明绑定**

**Released（已释放）——声明被删除，但是资源还未被集群重新声明**

**Failed（失败）——该卷的自动回收失败**

**命令行会显示绑定到 PV 的 PVC 的名称**