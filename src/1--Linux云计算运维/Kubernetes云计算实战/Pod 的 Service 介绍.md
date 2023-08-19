## 一、Service 介绍

**Kubernetes Service 定义了这样一种抽象：**

一个 Pod 的逻辑分组，一种可以访问它们的策略，通常称为微服务。 这一组 Pod 能够被 Service 访问到，通常是通过 Label Selector 。

![69.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328903734.png)

**Service能够提供负载均衡的能力，但是在使用上有以下限制：**

只提供4层负载均衡能力，而没有7层功能，但有时我们可能需要更多的匹配规则来转发请求，这点上 4 层负载均衡是不支持的

**Service的网络类型**

**ClusterIp：** 默认类型，自动分配一个仅 Cluster 内部可以访问的虚拟 IP

![70.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328914937.png)

**NodePort：** 在 ClusterIP 基础上为 Service 在每台机器上绑定一个端口，这样就可以通过 : NodePort 来访问该服务

![71.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328923772.png)

**LoadBalancer：** 在 NodePort 的基础上，借助 cloud provider 创建一个外部负载均衡器，并将请求转发到: NodePort

**ExternalName：** 把集群外部的服务引入到集群内部来，在集群内部直接使用。没有任何类型代理被创建，这只有 kubernetes 1.7 或更高版本的 kube-dns 才支持

## 二、Service 的代理模式分类

**VIP 和 Service 代理**

在 Kubernetes 集群中，每个 Node 运行一个 kube-proxy 进程。 kube-proxy 负责为 Service 实现了一种VIP（虚拟 IP）的形式，而不是 ExternalName 的形式。 在 Kubernetes v1.0 版本，代理完全在 userspace。在Kubernetes v1.1 版本，新增了 iptables 代理，但并不是默认的运行模式。 从 Kubernetes v1.2 起，默认就是iptables 代理。

**在 Kubernetes v1.8.0-beta.0 中，添加了 ipvs 代理**

**在 Kubernetes 1.14 版本开始默认使用 ipvs 代理**

**在 Kubernetes v1.0 版本， Service 是 “4层”（TCP/UDP over IP）概念**

**在 Kubernetes v1.1 版本，新增了 Ingress API（beta 版），用来表示 “7层”（HTTP）服务**

**userspace 代理模式**

![72.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328942567.png)

**iptables 代理模式**

![73.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328949839.png)

**ipvs 代理模式**

这种模式，kube-proxy 会监视 Kubernetes Service 对象和 Endpoints ，调用 netlink 接口以相应地创建ipvs 规则并定期与 Kubernetes Service 对象和 Endpoints 对象同步 ipvs 规则，以确保 ipvs 状态与期望一致。访问服务时，流量将被重定向到其中一个后端 Pod

与 iptables 类似，ipvs 于 netfilter 的 hook 功能，但使用哈希表作为底层数据结构并在内核空间中工作。这意味着 ipvs 可以更快地重定向流量，并且在同步代理规则时具有更好的性能。此外，ipvs 为负载均衡算法提供了更多选项，例如：

**rr ：轮询调度**

**lc ：最小连接数**

**dh ：目标哈希**

**sh ：源哈希**

**sed ：最短期望延迟**

**nq ： 不排队调度**