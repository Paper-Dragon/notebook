# 一次kubeadm添加节点出现etcd检查错误

> 错误关键字
>
> 执行 kubeadm join... 时
>
> [check-etcd] Checking that the etcd cluster is healthy
>
> error execution phase check-etcd: etcd cluster is not healthy: failed to dial endpoint https://10.8.18.105:2379 with maintenance client: context deadline exceeded To see the stack trace of this error execute with --v=5 or higher

## 一 问题描述

Kubernetes 集群中总共有三台 Master，分别是：

- k8s-master01
- k8s-master02
- k8s-master03

对其中 `k8s-master02`
 Master 节点服务器进行了内核和软件升级操作，从而先将其暂时剔出集群，然后进行升级，完成后准备重新加入到 Kubernetes 集群，通过 Kubeadm 执行，输入下面命令：

```
kubeadm join k8s-lb:16443 --token j7p6dr.zx0rh80lqn8unpty     --discovery-token-ca-cert-hash sha256:41a1353a03c99f46868294c28f9948bbc2cca957d98eb010435a493112ec7caa     --control-plane --certificate-key 5990f26f91d034a464692c13b31160d6d20df54fd8e3988d560e315c6ddb61aa
```

在执行过程中，输出下面日志，提示 etcd 监控检查失败：

```
......
[control-plane] Creating static Pod manifest for "kube-controller-manager"
W0329 00:01:51.364121   19209 manifests.go:214] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
[control-plane] Creating static Pod manifest for "kube-scheduler"
W0329 00:01:51.373807   19209 manifests.go:214] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
[check-etcd] Checking that the etcd cluster is healthy

error execution phase check-etcd: etcd cluster is not healthy: failed to dial endpoint https://10.8.18.105:2379 
with maintenance client: context deadline exceeded
To see the stack trace of this error execute with --v=5 or higher
```

根据关键信息 `"error execution phase check-etcd"`
 可知，可能是在执行加入 `etcd`
 时候出现的错误，导致 `master`
 无法加入原先的 `kubernetes`
 集群。

## 二 分析问题

### 1 查看集群节点列表

```
[root@k8s-master01 ~]# kubectl get nodes
NAME           STATUS   ROLES    AGE     VERSION
k8s-master01   Ready    master   4d20h   v1.18.2
k8s-master03   Ready    master   4d20h   v1.18.2
k8s-node01     Ready    worker   4d18h   v1.18.2
```

可以看到，`k8s-master02`
 节点确实不在节点列表中

### 2 查看 Kubeadm 配置信息

```
ClusterStatus:
----
apiEndpoints:
  k8s-master01:
    advertiseAddress: 172.20.5.11
    bindPort: 6443
  k8s-master02:
    advertiseAddress: 172.20.5.12
    bindPort: 6443
  k8s-master03:
    advertiseAddress: 172.20.5.13
    bindPort: 6443
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterStatus
```

可也看到 `k8s-master02`
 节点信息还存在与 `kubeadm`
 配置中，说明 `etcd`
 中还存储着 `k8s-master02`
 相关信息。

### 3 分析问题所在及解决方案

因为集群是通过 `kubeadm`
 工具搭建的，且使用了 `etcd`
 镜像方式与 `master`
 节点一起，所以每个 `Master`
 节点上都会存在一个 `etcd`
 容器实例。当剔除一个 `master`
 节点时 `etcd`
 集群未删除剔除的节点的 `etcd`
 成员信息，该信息还存在 `etcd`
 集群列表中。

所以，我们需要 **进入 etcd 手动删除 etcd 成员信息**。

## 三 解决问题

### 1 获取 Etcd 镜像列表

```
[root@k8s-master01 ~]# kubectl get pods -n kube-system | grep etcd
etcd-k8s-master01                         1/1     Running            4          4d20h
etcd-k8s-master03                         1/1     Running            1          4d20h
```

### 2 进入 Etcd 容器并删除节点信息

选择上面两个 etcd 中任意一个 pod，通过 kubectl 工具进入 pod 内部

```
[root@k8s-master01 ~]# kubectl exec -it -n kube-system etcd-k8s-master01 sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl kubectl exec [POD] -- [COMMAND] instead.
```

进入容器后，按下面步执行

```
## 配置环境
# export ETCDCTL_API=3
# alias etcdctl='etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key'

## 查看 etcd 集群成员列表
# etcdctl member list
a9b6a1341829d62a, started, k8s-master03, https://172.20.5.13:2380, https://172.20.5.13:2379, false
d1c737a26ea4dd70, started, k8s-master01, https://172.20.5.11:2380, https://172.20.5.11:2379, false
fe2d4a2a33304913, started, k8s-master02, https://172.20.5.12:2380, https://172.20.5.12:2379, false

## 删除 etcd 集群成员 k8s-master02
# etcdctl member remove fe2d4a2a33304913
Member fe2d4a2a33304913 removed from cluster 36067d1f1ca3f1db

## 退出容器
# exit
```

### 3 再次尝试加入集群

通过 `kubeadm`
 命令再次尝试将 `k8s-master02`
 节点加入集群，在执行前首先进入到 `k8s-master02`
 节点服务器，执行 `kubeadm`
 的清除命令：

```
$ kubeadm reset
```

然后尝试加入 kubernetes 集群：

```
[check-etcd] Checking that the etcd cluster is healthy
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.18" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...
[etcd] Announced new etcd member joining to the existing etcd cluster
[etcd] Creating static Pod manifest for "etcd"
[etcd] Waiting for the new etcd member to join the cluster. This can take up to 40s
{"level":"warn","ts":"2020-12-22T11:26:23.560+0800","caller":"clientv3/retry_interceptor.go:61","msg":"retrying of unary invoker failed","target":"passthrough:///https://172.20.5.12:2379","attempt":0,"error":"rpc error: code = DeadlineExceeded desc = context deadline exceeded"}
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[mark-control-plane] Marking the node k8s-master02 as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node k8s-master02 as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]

This node has joined the cluster and a new control plane instance was created:

* Certificate signing request was sent to apiserver and approval was received.
* The Kubelet was informed of the new secure connection details.
* Control plane (master) label and taint were applied to the new node.
* The Kubernetes control plane instances scaled up.
* A new etcd member was added to the local/stacked etcd cluster.

To start administering your cluster from this node, you need to run the following as a regular user:

        mkdir -p $HOME/.kube
        sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
        sudo chown $(id -u):$(id -g) $HOME/.kube/config

Run 'kubectl get nodes' to see this node join the cluster.
[root@k8s-master01 ~]# kubectl get nodes
NAME           STATUS   ROLES    AGE     VERSION
k8s-master01   Ready    master   4d20h   v1.18.2
k8s-master02   Ready    master   7m38s   v1.18.2
k8s-master03   Ready    master   4d20h   v1.18.2
k8s-node01     Ready    worker   4d18h   v1.18.2
```

