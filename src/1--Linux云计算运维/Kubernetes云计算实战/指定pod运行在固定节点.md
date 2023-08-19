## 一、指定固定节点：Pod.spec.nodeName

**Pod.spec.nodeName 将 Pod 直接调度到指定的 Node 节点上，会跳过 Scheduler 的调度策略，该匹配规则是强制匹配:**

```
vim node-1.yaml 

apiVersion: apps/v1
kind: Deployment
metadata:
  name: myweb
spec:
  selector:
    matchLabels:
      app: myweb
  replicas: 6
  template:
    metadata:
      labels:
        app: myweb
    spec:
      nodeName: zutuanxue-node-1
      containers:
      - name: myweb
        image: docker.io/nginx
        ports:
        - containerPort: 80
```

![130.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326019117.png)

正常情况下，创建 6 个副本，应该是两个节点进行平分，因为我们指定了具体的运行节点，所以全部在 node-1 上进行了创建。

## 二、指定固定节点标签：Pod.spec.nodeSelector

**Pod.spec.nodeSelector：通过 kubernetes 的 label-selector 机制选择节点，由调度器调度策略匹配 label，而后调度 Pod 到目标节点，该匹配规则属于强制约束:**

```
vim node-2.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: myweb
spec:
  selector:
    matchLabels:
      app: myweb
  replicas: 4
  template:
    metadata:
      labels:
        app: myweb
    spec:
      nodeSelector:
        cname: zutuanxue
      containers:
      - name: myweb
        image: docker.io/nginx
        ports:
        - containerPort: 80
```

这个时候我们来看一下创建的情况：

![131.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326100231.png)

因为没有对应标签的节点，所以创建卡主了，那么我们给 node-2 创建一个 “ cname：zutuanxue ” 这样的一个标签后，看下结果：

![132.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326186231.png)