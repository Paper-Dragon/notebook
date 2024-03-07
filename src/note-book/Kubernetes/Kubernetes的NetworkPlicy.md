# Kubernetes的NetworkPlicy

## 简介

网络策略（NetworkPolicy）是一种关于 Pod 间及与其他网络端点间所允许的通信规则的规范。

NetworkPolicy 资源使用 标签 选择 Pod，并定义选定 Pod 所允许的通信规则。
## 语法
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
 - Ingress
 - Egress
    ingress:
 - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
        ports:
    - protocol: TCP
      port: 6379
    egress:
 - to:
    - ipBlock:
        cidr: 10.0.0.0/24
        ports:
    - protocol: TCP
      port: 5978

```
说明：

    spec: NetworkPolicy 规约 中包含了在一个命名空间中定义特定网络策略所需的所有信息。
    podSelector: 每个 NetworkPolicy 都包括一个 podSelector ，它对该策略所应用的一组 Pod进行选择。示例中的策略选择带有 "role=db" 标签的 Pod。空的 podSelector 选择命名空间下的所有 Pod。
    policyTypes: 每个 NetworkPolicy 都包含一个 policyTypes 列表，其中包含 Ingress 或 Egress 或两者兼具。policyTypes 字段表示给定的策略是否应用于进入所选 Pod 的入口流量或者来自所选 Pod的出口流量，或两者兼有。如果 NetworkPolicy 未指定 policyTypes 则默认情况下始终设置 Ingress，如果NetworkPolicy 有任何出口规则的话则设置 Egress。
    ingress: 每个 NetworkPolicy 可包含一个 ingress 规则的白名单列表。每个规则都允许同时匹配 from 和ports 部分的流量。示例策略中包含一条简单的规则： 它匹配一个单一的端口，来自三个来源中的一个， 第一个通过 ipBlock指定，第二个通过namespaceSelector 指定，第三个通过 podSelector 指定。
    egress: 每个 NetworkPolicy 可包含一个 egress 规则的白名单列表。每个规则都允许匹配 to 和 port部分的流量。该示例策略包含一条规则，该规则将单个端口上的流量匹配到 10.0.0.0/24 中的任何目的地。

所以，该网络策略示例:

    隔离 “default” 命名空间下 “role=db” 的 Pod (如果它们不是已经被隔离的话)。
    （Ingress 规则）允许以下 Pod 连接到 “default” 命名空间下的带有 “role=db” 标签的所有 Pod 的6379 TCP 端口：
    
        “default” 命名空间下任意带有 “role=frontend” 标签的 Pod
        带有 “project=myproject” 标签的任意命名空间中的 Pod
        IP 地址范围为 172.17.0.0–172.17.0.255 和 172.17.2.0–172.17.255.255（即，除了
        172.17.1.0/24 之外的所有 172.17.0.0/16）
    
    （Egress 规则）允许从带有 “role=db” 标签的命名空间下的任何 Pod 到 CIDR 10.0.0.0/24 下 5978TCP 端口的连接。

## 选择器 to 和 from 的行为

可以在 ingress from 部分或 egress to 部分中指定四种选择器：

第一种
podSelector: 这将在与 NetworkPolicy 相同的命名空间中选择特定的 Pod，应将其允许作为入口源或出口目的地。

第二种
namespaceSelector: 这将选择特定的命名空间，应将所有 Pod 用作其输入源或输出目的地。

第三种
namespaceSelector 和 podSelector: 一个指定 namespaceSelector 和 podSelector
的 to/from 条目选择特定命名空间中的特定 Pod。注意使用正确的 YAML 语法；这项策略：

```yaml
...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
...
```


在 from 数组中仅包含一个元素，只允许来自标有 role=client 的 Pod 且该 Pod 所在的命名空间中标有 user=alice 的连接。但是 这项 策略：

```yaml
 ...
  ingress:
 - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
    ...
```

在 from 数组中包含两个元素，允许来自本地命名空间中标有 role=client 的 Pod 的连接，或 来自任何命名空间中标有 user = alice 的任何 Pod 的连接。
这两种定义方式的区别，请你一定要分清楚。

第四种：
ipBlock: 这将选择特定的 IP CIDR 范围以用作入口源或出口目的地。 这些应该是群集外部 IP，因为 Pod IP 存在时间短暂的且随机产生。
群集的入口和出口机制通常需要重写数据包的源 IP 或目标 IP。在发生这种情况的情况下，不确定在 NetworkPolicy 处理之前还是之后发生，并且对于网络插件，云提供商，Service 实现等的不同组合，其行为可能会有所不同。

在进入的情况下，这意味着在某些情况下，您可以根据实际的原始源 IP 过滤传入的数据包，而在其他情况下，NetworkPolicy 所作用的 源IP 则可能是 LoadBalancer 或 Pod 的节点等。

对于出口，这意味着从 Pod 到被重写为集群外部 IP 的 Service IP 的连接可能会或可能不会受到基于 ipBlock 的策略的约束
## 默认策略

默认情况下，如果命名空间中不存在任何策略，则所有进出该命名空间中的 Pod 的流量都被允许。以下示例使您可以更改该命名空间中的默认行为。

### 4.1 默认拒绝所有入口流量

您可以通过创建选择所有容器但不允许任何进入这些容器的入口流量的 NetworkPolicy 来为命名空间创建 “default” 隔离策略。
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

这样可以确保即使容器没有选择其他任何 NetworkPolicy，也仍然可以被隔离。此策略不会更改默认的出口隔离行为。

### 4.2 默认允许所有入口流量

如果要允许所有流量进入某个命名空间中的所有 Pod（即使添加了导致某些 Pod 被视为“隔离”的策略），则可以创建一个策略来明确允许该命名空间中的所有流量。
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-ingress
spec:
  podSelector: {}
  ingress:
  - {}
    policyTypes:
  - Ingress
```

### 4.3 默认拒绝所有出口流量

您可以通过创建选择所有容器但不允许来自这些容器的任何出口流量的 NetworkPolicy 来为命名空间创建 “default” egress 隔离策略。
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

### 4.4 默认允许所有出口流量

如果要允许来自命名空间中所有 Pod 的所有流量（即使添加了导致某些 Pod 被视为“隔离”的策略），则可以创建一个策略，该策略明确允许该命名空间中的所有出口流量。
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-egress
spec:
  podSelector: {}
  egress:
  - {}
    policyTypes:
  - Egress
```

### 4.5 默认拒绝所有入口和所有出口流量

您可以为命名空间创建 “default” 策略，以通过在该命名空间中创建以下 NetworkPolicy 来阻止所有入站和出站流量。
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

## 实战示例

  ### 5.1 创建一个nginx Deployment 并且通过服务将其暴露

```bash
$ kubectl create deployment nginx --image=nginx
$ kubectl expose deployment nginx --port=80   #此 Deployment 以名为 nginx 的 Service 暴露出来
$ kubectl get svc,pod

$ kubectl run busybox --rm -ti --image=busybox /bin/sh  # 创建测试工具的pod
$ wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
remote file exists
```

### 5.2 限制 nginx 服务的访问

如果想限制对 nginx 服务的访问，只让那些拥有标签 access: true 的 Pod 访问它， 那么可以创建一个如下所示的 NetworkPolicy 对象：
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: access-nginx
spec:
  podSelector:
    matchLabels:
      app: nginx
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: "true"
```

注意： NetworkPolicy 中包含选择策略所适用的 Pods 集合的 podSelector。 你可以看到上面的策略选择的是带有标签 app=nginx 的 Pods。 此标签是被自动添加到 nginx Deployment 中的 Pod 上的。 如果 podSelector 为空，则意味着选择的是名字空间中的所有 Pods。
```bash
$ kubectl apply -f https://k8s.io/examples/service/networking/nginx-policy.yaml

$ kubectl run busybox --rm -ti --image=busybox -- /bin/sh  #创建测试工具的pod

$ wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
wget: download timed out

定义访问标签后再次测试
创建一个拥有正确标签的 Pod，你将看到请求是被允许的：

$ kubectl run busybox --rm -ti --labels="access=true" --image=busybox -- /bin/sh
在 Shell 中运行命令：

$ wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
remote file exists
```

6. # networkpolicy原理

在具体实现上，凡是支持 NetworkPolicy 的 CNI 网络插件，都维护着一个 NetworkPolicy Controller，通过控制循环的方式对 NetworkPolicy 对象的增删改查做出响应，然后在宿主机上完成 iptables 规则的配置工作。

在 Kubernetes 生态里，目前已经实现了 NetworkPolicy 的网络插件包括 Calico、Weave 和 kube-router 等多个项目，但是并不包括 Flannel 项目。所以说，如果想要在使用 Flannel 的同时还使用 NetworkPolicy 的话，你就需要再额外安装一个网络插件，比如 Calico 项目，来负责执行 NetworkPolicy。

安装 Flannel + Calico 的流程非常简单，你直接参考这个文档一键安装即可。

那么，这些网络插件，又是如何根据 NetworkPolicy 对 Pod 进行隔离的呢？

接下来，我就以三层网络插件为例（比如 Calico 和 kube-router），来为你分析一下这部分的原理。为了方便讲解，这一次我编写了一个比较简单的 NetworkPolicy 对象，如下所示：
```yaml
apiVersion: extensions/v1beta1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  ingress:
   - from:
     - namespaceSelector:
         matchLabels:
           project: myproject
     - podSelector:
         matchLabels:
           role: frontend
       ports:
       - protocol: tcp
         port: 6379
```

可以看到，我们指定的 ingress“白名单”，是任何 Namespace 里，携带 project=myproject 标签的 Namespace 里的 Pod；以及 default Namespace 里，携带了 role=frontend 标签的 Pod。允许被访问的端口是：6379。

而被隔离的对象，是所有携带了 role=db 标签的 Pod。

那么这个时候，Kubernetes 的网络插件就会使用这个 NetworkPolicy 的定义，在宿主机上生成 iptables 规则。这个过程，我可以通过如下所示的一段 Go 语言风格的伪代码来为你描述：
```bash
for dstIP := range 所有被networkpolicy.spec.podSelector选中的Pod的IP地址
  for srcIP := range 所有被ingress.from.podSelector选中的Pod的IP地址
    for port, protocol := range ingress.ports {
      iptables -A KUBE-NWPLCY-CHAIN -s $srcIP -d $dstIP -p $protocol -m $protocol --dport $port -j ACCEPT 
    }
  }
} 
```

可以看到，这是一条最基本的、通过匹配条件决定下一步动作的 iptables 规则。这条规则的名字是 KUBE-NWPLCY-CHAIN，含义是：当 IP 包的源地址是 srcIP、目的地址是 dstIP、协议是 protocol、目的端口是 port 的时候，就允许它通过（ACCEPT）。

而正如这段伪代码所示，匹配这条规则所需的这四个参数，都是从 NetworkPolicy 对象里读取出来的。

可以看到，Kubernetes 网络插件对 Pod 进行隔离，其实是靠在宿主机上生成 NetworkPolicy 对应的 iptable 规则来实现的。

此外，在设置好上述“隔离”规则之后，网络插件还需要想办法，将所有对被隔离 Pod 的访问请求，都转发到上述 KUBE-NWPLCY-CHAIN 规则上去进行匹配。并且，如果匹配不通过，这个请求应该被“拒绝”。

在 CNI 网络插件中，上述需求可以通过设置两组 iptables 规则来实现。

第一组规则，负责“拦截”对被隔离 Pod 的访问请求。生成这一组规则的伪代码，如下所示：

```bash
for pod := range 该Node上的所有Pod {
    if pod是networkpolicy.spec.podSelector选中的 {
        iptables -A FORWARD -d $podIP -m physdev --physdev-is-bridged -j KUBE-POD-SPECIFIC-FW-CHAIN
        iptables -A FORWARD -d $podIP -j KUBE-POD-SPECIFIC-FW-CHAIN
        ...
    }
}
```

可以看到，这里的的 iptables 规则使用到了内置链：FORWARD。它是什么意思呢？说到这里，我就得为你稍微普及一下 iptables 的知识了。

实际上，iptables 只是一个操作 Linux 内核 Netfilter 子系统的“界面”。顾名思义，Netfilter 子系统的作用，就是 Linux 内核里挡在“网卡”和“用户态进程”之间的一道“防火墙”。它们的关系，可以用如下的示意图来表示：

![t_70](Kubernetes的NetworkPlicy.assets/t_70.png)
可以看到，这幅示意图中，IP 包“一进一出”的两条路径上，有几个关键的“检查点”，它们正是 Netfilter 设置“防火墙”的地方。在 iptables 中，这些“检查点”被称为：链（Chain）。这是因为这些“检查点”对应的 iptables 规则，是按照定义顺序依次进行匹配的。这些“检查点”的具体工作原理，可以用如下所示的示意图进行描述：
![image-20220611130437987](Kubernetes的NetworkPlicy.assets/image-20220611130437987.png)
可以看到，当一个 IP 包通过网卡进入主机之后，它就进入了 Netfilter 定义的流入路径（Input Path）里。在这个路径中，IP 包要经过路由表路由来决定下一步的去向。而在这次路由之前，Netfilter 设置了一个名叫 PREROUTING 的“检查点”。在 Linux 内核的实现里，所谓“检查点”实际上就是内核网络协议栈代码里的 Hook（比如，在执行路由判断的代码之前，内核会先调用 PREROUTING 的 Hook)。
而在经过路由之后，IP 包的去向就分为了两种：

    第一种，继续在本机处理；
    第二种，被转发到其他目的地。

我们先说一下 IP 包的第一种去向。这时候，IP 包将继续向上层协议栈流动。在它进入传输层之前，Netfilter 会设置一个名叫 INPUT 的“检查点”。到这里，IP 包流入路径（Input Path）结束。接下来，这个 IP 包通过传输层进入用户空间，交给用户进程处理。而处理完成后，用户进程会通过本机发出返回的 IP 包。这时候，这个 IP 包就进入了流出路径（Output Path）。

此时，IP 包首先还是会经过主机的路由表进行路由。路由结束后，Netfilter 就会设置一个名叫 OUTPUT 的“检查点”。然后，在 OUTPUT 之后，再设置一个名叫 POSTROUTING“检查点”。你可能会觉得奇怪，为什么在流出路径结束后，Netfilter 会连着设置两个“检查点”呢？

这就要说到在流入路径里，路由判断后的第二种去向了。在这种情况下，这个 IP 包不会进入传输层，而是会继续在网络层流动，从而进入到转发路径（Forward Path）。在转发路径中，Netfilter 会设置一个名叫 FORWARD 的“检查点”。而在 FORWARD“检查点”完成后，IP 包就会来到流出路径。而转发的 IP 包由于目的地已经确定，它就不会再经过路由，也自然不会经过 OUTPUT，而是会直接来到 POSTROUTING“检查点”。所以说，POSTROUTING 的作用，其实就是上述两条路径，最终汇聚在一起的“最终检查点”。

需要注意的是，在有网桥参与的情况下，上述 Netfilter 设置“检查点”的流程，实际上也会出现在链路层（二层），并且会跟我在上面讲述的网络层（三层）的流程有交互。这些链路层的“检查点”对应的操作界面叫作 ebtables。所以，准确地说，数据包在 Linux Netfilter 子系统里完整的流动过程，其实应该如下所示:

![image-20220611130508989](Kubernetes的NetworkPlicy.assets/image-20220611130508989.png)
以看到，我前面为你讲述的，正是上图中绿色部分，也就是网络层的 iptables 链的工作流程。另外，你应该还能看到，每一个白色的“检查点”上，还有一个绿色的“标签”，比如：raw、nat、filter 等等。在 iptables 里，这些标签叫作：表。比如，同样是 OUTPUT 这个“检查点”，filter Output 和 nat Output 在 iptables 里的语法和参数，就完全不一样，实现的功能也完全不同。所以说，iptables 表的作用，就是在某个具体的“检查点”（比如 Output）上，按顺序执行几个不同的检查动作（比如，先执行 nat，再执行 filter).

在理解了 iptables 的工作原理之后，我们再回到 NetworkPolicy 上来。这时候，前面由网络插件设置的、负责“拦截”进入 Pod 的请求的三条 iptables 规则，就很容易读懂了：
```bash
iptables -A FORWARD -d $podIP -m physdev --physdev-is-bridged -j KUBE-POD-SPECIFIC-FW-CHAIN
iptables -A FORWARD -d $podIP -j KUBE-POD-SPECIFIC-FW-CHAIN
...
```

其中，第一条 FORWARD 链“拦截”的是一种特殊情况：它对应的是同一台宿主机上容器之间经过 CNI 网桥进行通信的流入数据包。其中，--physdev-is-bridged 的意思就是，这个 FORWARD 链匹配的是，通过本机上的网桥设备，发往目的地址是 podIP 的 IP 包。

当然，如果是像 Calico 这样的非网桥模式的 CNI 插件，就不存在这个情况了。kube-router 其实是一个简化版的 Calico，它也使用 BGP 来维护路由信息，但是使用 CNI bridge 插件负责跟 Kubernetes 进行交互。

而第二条 FORWARD 链“拦截”的则是最普遍的情况，即：容器跨主通信。这时候，流入容器的数据包都是经过路由转发（FORWARD 检查点）来的。

不难看到，这些规则最后都跳转（即：-j）到了名叫 KUBE-POD-SPECIFIC-FW-CHAIN 的规则上。它正是网络插件为 NetworkPolicy 设置的第二组规则。

而这个 KUBE-POD-SPECIFIC-FW-CHAIN 的作用，就是做出“允许”或者“拒绝”的判断。这部分功能的实现，可以简单描述为下面这样的 iptables 规则：



```bash
iptables -A KUBE-POD-SPECIFIC-FW-CHAIN -j KUBE-NWPLCY-CHAIN
iptables -A KUBE-POD-SPECIFIC-FW-CHAIN -j REJECT --reject-with icmp-port-unreachable
```

可以看到，首先在第一条规则里，我们会把 IP 包转交给前面定义的 KUBE-NWPLCY-CHAIN 规则去进行匹配。按照我们之前的讲述，如果匹配成功，那么 IP 包就会被“允许通过”。而如果匹配失败，IP 包就会来到第二条规则上。可以看到，它是一条 REJECT 规则。通过这条规则，不满足 NetworkPolicy 定义的请求就会被拒绝掉，从而实现了对该容器的“隔离”。

以上，就是 CNI 网络插件实现 NetworkPolicy 的基本方法了。
7. # 总结

    Kubernetes 对 Pod 进行“隔离”的手段，即：NetworkPolicy。

而基于上述讲述，你就会发现这样一个事实：

Kubernetes 的网络模型以及大多数容器网络实现，其实既不会保证容器之间二层网络的互通，也不会实现容器之间的二层网络隔离。这跟 IaaS 项目管理虚拟机的方式，是完全不同的。所以说，Kubernetes 从底层的设计和实现上，更倾向于假设你已经有了一套完整的物理基础设施。然后，Kubernetes 负责在此基础上提供一种“弱多租户”（soft multi-tenancy）的能力。

并且，基于上述思路，Kubernetes 将来也不大可能把 Namespace 变成一个具有实质意义的隔离机制，或者把它映射成为“子网”或者“租户”。毕竟你可以看到，NetworkPolicy 对象的描述能力，要比基于 Namespace 的划分丰富得多。这也是为什么，到目前为止，Kubernetes 项目在云计算生态里的定位，其实是基础设施与 PaaS 之间的中间层。这是非常符合“容器”这个本质上就是进程的抽象粒度的。当然，随着 Kubernetes 社区以及 CNCF 生态的不断发展，Kubernetes 项目也已经开始逐步下探，“吃”掉了基础设施领域的很多“蛋糕”。这也正是容器生态继续发展的一个必然方向。

参考连接：
https://kubernetes.io/zh/docs/concepts/services-networking/network-policies/