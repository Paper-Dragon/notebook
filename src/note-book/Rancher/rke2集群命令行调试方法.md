# rke2集群命令行调试方法

## CLI 工具

RKE2 附带了多个 CLI 工具来帮助你访问和调试集群。启动时，它们会被提取到 `/var/lib/rancher/rke2/bin`。

### kubectl

admin kubeconfig 在 `/etc/rancher/rke2/rke2.yaml` 处生成。

示例：

```text
export KUBECONFIG=/etc/rancher/rke2/rke2.yaml
/var/lib/rancher/rke2/bin/kubectl get nodes
```

### Containerd

RKE2 附带了 `ctr` 和 `crictl`。Containerd 套接字位于 `/run/k3s/containerd/containerd.sock`。

示例：

```text
/var/lib/rancher/rke2/bin/ctr --address /run/k3s/containerd/containerd.sock --namespace k8s.io container ls
export CRI_CONFIG_FILE=/var/lib/rancher/rke2/agent/etc/crictl.yaml
/var/lib/rancher/rke2/bin/crictl ps
```