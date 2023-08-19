Service是Kubernetes的核心概念，通过创建Service，可以为一组具有相同功能的容器应用提供一个统一的入口地址，并且将请求负载分发到后端的各个容器应用上。

Kubernetes 的网络模型假定了所有 Pod 都在一个可以直接连通的扁平的网络空间中，这在GCE （ Google Compute Engine ）里面是现成的网络模型， Kubernetes 假定这个网络已经存在。而在私有云里搭建Kubernetes 集群，就不能假定这个网络已经存在了。我们需要自己实现这个网络假设，将不同节点上的 Docker 容器之间的互相访问先打通，然后运行 Kubernetes。

## 一、Flannel 网络

Flannel 是 CoreOS 团队针对 Kubernetes 设计的一个网络规划服务，简单来说，它的功能是让集群中的不同节点主机创建的 Docker 容器都具有全集群唯一的虚拟 IP 地址。而且它还能在这些 IP 地址之间建立一个覆盖网络（ Overlay Network ），通过这个覆盖网络，将数据包原封不动地传递到目标容器内。

ETCD 与 Flannel 之间的关系：

- 存储管理 Flannel 可分配的 IP 地址段资源
- 监控 ETCD 中每个 Pod 的实际地址，并在内存中建立维护 Pod

### 1.1、Flannel 网络流程图：

![4.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602262833553.png)

### 1.2、 Service 不同情况下网络通信方式

同Pod内部通讯：同一个 Pod 共享同一个网络命名空间，共享同一个 Linux 协议栈。

**不同pod通讯：**

不在同一台主机：docker0 网段与宿主机网卡是两个完全不同的 IP 网段，不同 Node 之间的通信只能通过宿主机的物理网卡进行

同一台机器：由 Docker0 网桥直接转发请求

Pod与Service： 目前基于性能考虑，全部为 iptables 维护和转发

Pod与外网：Pod 向外网发送请求，查找路由表 , 转发数据包到宿主机的网卡，宿主网卡完成路由选择后，iptables行Masquerade ，把源 IP 更改为宿主网卡的 IP ，然后向外网服务器发送请求。