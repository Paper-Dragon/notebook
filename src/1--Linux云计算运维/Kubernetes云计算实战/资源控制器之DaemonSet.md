DaemonSet 确保全部(或者一些) Node上运行一个 Pod 的副本，当有 Node 加入集群时，也会为他们新增一个 Pod，当有 Node 从集群移除时，这些 Pod 也会被回收。删除 DaemonSet 将会删除它创建的所有 Pod 。

![61.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328744399.png)

**DaemonSet 应用示例：**

```
vim daemonset.yaml

apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: deamonset
  labels:
    app: daemonset
spec:
  selector:
    matchLabels:
      name: deamonset
  template:
    metadata:
      labels:
        name: deamonset
    spec:
      containers:
      - name: daemonset
        image: docker.io/nginx
```

创建完成后，查看pod状态：

![62.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328751642.png)