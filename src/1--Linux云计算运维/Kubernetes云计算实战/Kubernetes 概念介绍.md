## 一、Master

 Master指的是集群控制节点，在每个Kubernetes集群里都需要有一个Master来负责整个集群的管理和控制，基本上Kubernetes的所有控制命令都发给它，它负责具体的执行过程，我们后面执行的所有命令基本都是在Master上运行的

**Master上运行的核心组件：**

**Kubernetes API Server（kube-apiserver）：**

提供了HTTP Rest接口的关键服务进程，是Kubernetes里所有资源的增、删、改、查等操作的唯一入口，也是集群控制的入口进程。

**Kubernetes Controller Manager（kube-controller-manager）：**

Kubernetes里所有资源对象的自动化控制中心，可以将其理解为资源对象的“大总管”。

**Kubernetes Scheduler（kube-scheduler）：**

负责资源调度（Pod调度）的进程，相当于公交公司的“调度室”。

## 二、Node

 Node是Kubernetes集群中的工作负载节点，每个Node都会被Master分配一些工作负载（Docker容器），当某个Node宕机时，其上的工作负载会被Master自动转移到其他节点上。

**Node上运行的核心组件：**

**kubelet：** 负责Pod对应的容器的创建、启停等任务，同时与Master密切协作，实现集群管理的基本功能。

**kube-proxy：** 实现Kubernetes Service的通信与负载均衡机制的重要组件。

## 三、Etcd

etcd 的官方将它定位成一个可信赖的分布式键值存储服务，保存了整个集群的状态，它能够为整个分布式集群存储一些关键数据，协助分布式集群的正常运转。

## 四、Pod

Pod是Kubernetes最重要的基本概念，我们看到每个Pod都有一个特殊的被称为“根容器”的Pause容器。Pause容器对应的镜像属于Kubernetes平台的一部分，除了Pause容器，每个Pod还包含一个或多个紧密相关的用户业务容器。

## 五、Label

 Label（标签）是Kubernetes系统中另外一个核心概念。一个Label是一个key=value的键值对，其中key与value由用户自己指定。Label可以被附加到各种资源对象上，例如Node、Pod、Service、RC等，一个资源对象可以定义任意数量的Label，同一个Label也可以被添加到任意数量的资源对象上。Label通常在资源对象定义时确定，也可以在对象创建后动态添加或者删除。

#### 6、ReplicationController（RC）

用来确保容器应用的副本数始终保持在用户定义的副本数，即如果有容器异常退出，会自动创建新的 Pod 来替代；而如果异常多出来的容器也会自动回收。在新版本的 Kubernetes 中建议使用 ReplicaSet 来取代 ReplicationControlle。

## 七、ReplicaSet（RS）

ReplicaSet 跟 ReplicationController 没有本质的不同，只是名字不一样，并且ReplicaSet 支持集合式的 selector虽然 ReplicaSet 可以独立使用，但一般还是建议使用 Deployment 来自动管理ReplicaSet ，这样就无需担心跟其他机制的不兼容问题（比如 ReplicaSet 不支持rolling-update 但 Deployment 支持）。

## 八、Deployment

Deployment 为 Pod 和 ReplicaSet 提供了一个 声明式定义 (declarative) 方法，用来替代以前的 ReplicationController 来方便的管理应用。典型的应用场景包括：

1、定义 Deployment 来创建 Pod 和 ReplicaSet

2、滚动升级和回滚应用

3、扩容和缩容

4、暂停和继续 Deployment

## 九、DaemonSet

DaemonSet 确保全部（或者一些） Node 上运行一个 Pod 的副本。当有 Node 加入集群时，也会为他们新增一个 Pod 。当有 Node 从集群移除时，这些 Pod 也会被回收。删除 DaemonSet 将会删除它创建的所有 Pod，使用 DaemonSet 的一些典型用法：

1、运行集群存储 daemon ，例如在每个 Node 上运行 glusterd 、 ceph 。

2、在每个 Node 上运行日志收集 daemon ，例如 fluentd 、 logstash 。

3、在每个 Node 上运行监控 daemon ，例如 Prometheus Node Exporter

## 十、Horizontal Pod Autoscaling

Horizontal Pod Autoscaling 仅适用于 Deployment 和 ReplicaSet ，在 V1 版本中仅支持根据 Pod的 CPU 利用率扩所容，在 v1alpha 版本中，支持根据内存和用户自定义的 metric 扩缩容。

## 十一、StatefulSet

StatefulSet 是为了解决有状态服务的问题（对应 Deployments 和 ReplicaSets 是为无状态服务而设计），其应用场景包括：

1、稳定的持久化存储，即 Pod 重新调度后还是能访问到相同的持久化数据，基于 PVC 来实现

2、稳定的网络标志，即 Pod 重新调度后其 PodName 和 HostName 不变，基于 Headless Service（即没有 Cluster IP 的 Service ）来实现

3、有序部署，有序扩展，即 Pod 是有顺序的，在部署或者扩展的时候要依据定义的顺序依次依次进行（即从 0 到 N-1 ，在下一个 Pod 运行之前所有之前的 Pod 必须都是 Running 和 Ready 状态），基于 init containers 来实现

4、有序收缩，有序删除（即从 N-1 到 0 0 ）

## 十二、Job

Job 负责批处理任务，即仅执行一次的任务，它保证批处理任务的一个或多个 Pod 。

## 十三、Cron Job

Cron Job 管理基于时间的 Job ，即：

1、在给定时间点只运行一次
2、周期性地在给定时间点运行

## 十四、ConfigMap

ConfigMap 功能在 Kubernetes1.2 版本中引入，许多应用程序会从配置文件、命令行参数或环境变量中读取配置信息。ConfigMap API 给我们提供了向容器中注入配置信息的机制，ConfigMap 可以被用来保存单个属性，也可以用来保存整个配置文件或者 JSON 二进制大对象。

## 十五、Secret

Secret 解决了密码、token、密钥等敏感数据的配置问题，而不需要把这些敏感数据暴露到镜像或者 Pod Spec中。Secret 可以以 Volume 或者环境变量的方式使用。

## 十六、Volume

容器磁盘上的文件的生命周期是短暂的，这就使得在容器中运行重要应用时会出现一些问题。首先，当容器崩溃时，kubelet 会重启它，但是容器中的文件将丢失——容器以干净的状态（镜像最初的状态）重新启动。其次，在Pod 中同时运行多个容器时，这些容器之间通常需要共享文件。Kubernetes 中的 Volume 就很好的解决了这些问题

## 十七、PersistentVolume （PV）

PersistentVolume是由管理员设置的存储，它是群集的一部分。就像节点是集群中的资源一样，PV 也是集群中的资源。 PV 是Volume 之类的卷插件，但具有独立于使用 PV 的 Pod 的生命周期。此 API 对象包含存储实现的细节，即 NFS、iSCSI 或特定于云供应商的存储系统。

## 十八、PersistentVolumeClaim （PVC）

PersistentVolumeClaim是用户存储的请求。它与 Pod 相似。Pod 消耗节点资源，PVC 消耗 PV 资源。Pod 可以请求特定级别的资源（CPU 和内存）。声明可以请求特定的大小和访问模式（例如，可以以读/写一次或 只读多次模式挂载）。

## 十九、Service

Service是Kubernetes的核心概念，通过创建Service，可以为一组具有相同功能的容器应用提供一个统一的入口地址，并且将请求负载分发到后端的各个容器应用上。

## 二十、NameSpace

Namespace（命名空间）是Kubernetes系统中的另一个非常重要的概念，Namespace在很多情况下用于实现多租户的资源隔离。