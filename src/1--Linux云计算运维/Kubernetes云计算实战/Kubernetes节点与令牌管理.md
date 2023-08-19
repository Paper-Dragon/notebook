## 一、令牌管理

**查看令牌**

```
[root@master ~]# kubeadm token list
```

**删除令牌**

```
[root@master ~]# kubeadm token delete <令牌值>
```

**创建令牌-临时令牌**

```
临时 token 生成：
[root@master ~]# kubeadm token create 
此 token 的有效期为 24 小时，过期后需要重新生成 token 。
```

**创建令牌-临时令牌**

```
永久 token 生成：
[root@master ~]# kubeadm token create --ttl 0
此 token 的有有效期为永久有效。

为了安全起见，建议使用临时 token ，而不要使用永久的 token 。
```

## 二、K8S节点管理

### 2.1、查看节点

```
查看当前的节点信息：
[root@master ~]# kubectl get nodes

NAME     STATUS   ROLES    AGE     VERSION
master   Ready    master   4h40m   v1.18.1
node-1   Ready    <none>   4h39m   v1.18.1
node-2   Ready    <none>   3h58m   v1.18.1
```

### 2.2、删除节点

**驱逐即将删除node节点上的pod**

如果需要从集群中移除 node-2 这个 Node ，在 master上执行下面的命令，安全驱逐节点上面所有的 pod,该命令执行成功后 node节点开始释放所有 pod ，并且不接收新的 pod 进程

```
[root@master ~]# kubectl drain node-2 --delete-local-data --force --ignore-daemonsets
注：默认情况下，kubectl drain 会忽略那些不能杀死的系统类型的 pod


参数说明：

--force：当一些pod不是经 ReplicationController, ReplicaSet, Job, DaemonSet 或者 StatefulSet 管理的时候
就需要用 --force 来强制执行 (例如:kube-proxy)
 
--ignore-daemonsets：无视 DaemonSet 管理下的 Pod
 
--delete-local-data：如果有 mount local volumn 的 pod，会强制杀掉该 pod 并把料清除掉，另外如果跟本身的配置信息有冲突时，drain就不会执行

该命令会安全驱逐节点上面所有的 pod ，安全驱逐的方式将会允许 pod 里面的容器遵循指定的 Pod DisruptionBudgets 执行优雅的中止。
```

kubectl drain 返回成功表明所有的 pod （除了前面排除的那些）已经被安全驱逐（遵循期望优雅的中止期，并且没有违反任何应用程序级别的中断预算）。然后，通过对物理机断电或者在云平台上删除节点所在的虚拟机，都能安全的将节点移除。

**恢复node，继续接收新pod**
节点上的pod被驱逐后，如果不删除node的话，进行完对应的升级或维护后可以恢复node,恢复接收新的pod进程

```
[root@master ~]# kubectl uncordon node-2
```

**删除节点**

```
[root@master ~]# kubectl delete node <节点名称>
```

**删除后进行查看**

```
[root@master ~]# kubectl get nodes 

NAME     STATUS   ROLES    AGE     VERSION
master   Ready    master   4h40m   v1.18.1
node-1   Ready    <none>   4h39m   v1.18.1
```

### 2.3、集群节点扩展

**Master 节点加入集群**

```
  kubeadm join 192.168.2.100:6444 \
  --token abcdef.0123456789abcdef \
  --discovery-token-ca-cert-hash sha256:ec36d9832497453d5297e86f13928a3374e831da8861372f2086ea79c000bad7 \
  --control-plane --certificate-key 80847d457d198a8ce1483817e11de8a472ff68b94410db2574e55c2f56f1b7be
```

**Node节点加入集群**

```
kubeadm join 192.168.2.100:6444 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:ec36d9832497453d5297e86f13928a3374e831da8861372f2086ea79c000bad7
    
```

以上信息为高可用的加入信息，这里所显示的 token 的有效期为 24 小时，在有效期内，可以直接使用命令加入我们的集群，如果超过了有效期的话，那么我们的 token 已经过期，就需要我们重新生成 token ，然后在进行加入。

### 2.4、token过期的解决方案

token 过期后，生成新的token

**2.4.1、节点加入单master集群**

- 创建新的token

```
[root@master ~]# kubeadm token create

W0410 16:22:44.706213   11426 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
oqghzy.40dftxcaeegan10t < 这一条信息是我们新生成的 token >
```

- 获取ca证书的hash值
	token 生成完后，我们还需要获取 ca 证书 sha256 编码 hash 值，查看当前 k8s 集群的 ca 证书 sha256 编码 hash 值，我们的 ca 证书默认存放在 /etc/kubernetes/pki 目录下：

```
[root@master ~]# openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'

a5a41919d1200e21bcafe066a1423ca904aaa70a9dd1582ea668993e8e831fc7   < 这一条信息就是我们的 hash 值 >
```

- 将新master加入单master的集群
	然后我们通过新生成的 token 和 ca 证书 sha256 编码 hash 值重新组装得到有效的 work node 加入集群命令：

```
[root@master ~]# kubeadm join 192.168.2.20:6443 --token oqghzy.40dftxcaeegan10t \
    --discovery-token-ca-cert-hash sha256:a5a41919d1200e21bcafe066a1423ca904aaa70a9dd1582ea668993e8e831fc7
    
这里需要注意一下，如果是加入单 master 集群，那么我们使用的 IP 地址为我们 master 的 IP 地址与 6443 端口。
    

#或者我们也可以使用命令，直接生成出包含新的token与hash值的完整加入命令，这样更加轻松有效。

[root@master ~]# kubeadm token create --print-join-command

kubeadm join 192.168.2.100:6444 --token 1kuag1.elna9kktnznxr50m     --discovery-token-ca-cert-hash sha256:a5a41919d1200e21bcafe066a1423ca904aaa70a9dd1582ea668993e8e831fc7
```

**2.4.2、节点加入高可用集群**

高可用集群与单master集群不同的地方在于还要生成用于新master加入的证书

- 首先生成新的 token

```
[root@master ~]# kubeadm token create --print-join-command
```

- 生成新的用于 master 加入的证书

```
[root@master ~]# kubeadm init phase upload-certs --upload-certs

W0410 16:49:45.773081   21497 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
[upload-certs] Storing the certificates in Secret "kubeadm-certs" in the "kube-system" Namespace
[upload-certs] Using certificate key:
1d57c7bbf579b9bdcf3441cd45dd01a2a066e75b45fe672a0f5295e07a337d0d    < 这一条信息是用于 master 加入的证书信息 >
```

然后我们通过新生成的 token 和 ca 证书 sha256 编码 hash 值还有新生成的 master 证书的值，重新组装得到有效的 master 加入集群命令：

```
kubeadm join 192.168.2.100:6444 \
  --token 1kuag1.elna9kktnznxr50m \
  --discovery-token-ca-cert-hash sha256:a5a41919d1200e21bcafe066a1423ca904aaa70a9dd1582ea668993e8e831fc7 \
  --control-plane --certificate-key 1d57c7bbf579b9bdcf3441cd45dd01a2a066e75b45fe672a0f5295e07a337d0d
```