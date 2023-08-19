RC （ReplicationController ）主要的作用就是用来确保容器应用的副本数始终保持在用户定义的副本数 。即如果有容器异常退出，会自动创建新的 Pod 来替代；而如果异常多出来的容器也会自动回收（已经成为过去时）。

**Kubernetes 官方建议使用 RS（ReplicaSet ） 替代 RC （ReplicationController ） 进行部署，RS 跟 RC 没有本质的不同，只是名字不一样，并且 RS 支持集合式的 selector。**

![48.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328407339.png)


**RS 用示例：**

```
vim rs.yaml

apiVersion: apps/v1
kind: ReplicaSet
metadata:
   name: myweb
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: myweb
  template:
    metadata:
      labels:
        tier: myweb
    spec:
      containers:
        - name: nginx
          image: docker.io/nginx
          imagePullPolicy: IfNotPresent
          ports:
          - containerPort: 80
```

**我们来查看下我们的 Pod 信息：**

![46.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328432263.png)

**这个时候我们来随便删除一个其中的 Pod 后在查看下我们的 Pod 信息：**

![47.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328445225.png)

通过上述操作，我们可以看到，当我们定义了一个 RS 控制器的副本数目为 3 以后，那么，系统会始终保持我们的副本数为，不管是多了还是少了，系统始终会保持我们的副本数量与我们定义的数量一致（多删少建）。这个时候我们可以通过 kubectl get pod --show-labels 来查看我们 Pod 的标签：

![51.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328453093.png)

这个时候可以看到我们在 **rs.yanl** 文件内所定义的标签，这个时候，我们来通过命令 kubectl label pod myweb-rkqjz tier=my-nginx --overwrite=True 修改我们 myweb-rkqjz 这个Pod 的标签然后看下效果：

![52.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328460412.png)

这个时候我们需要注意一下

```
“error: 'tier' already has a value (myweb), and --overwrite is false“ 
```

因为标签已经存在，所以后面需要接上 --overwrite=True 才能修改，我们的标签，但是修改玩以后，因为 RS 是通过 Pod 的标签来确定哪些 Pod 是我管理的， 哪些 Pod 不是我管理的，当我们修改了其中一个 Pod 的标签以后，RS 发现我所管理的 Pod 数量与副本定义数量不符，所以会创建一个新的 Pod 来补足，这也就是为什么，当使用删除 RS 的命令 kubectl delete rs --all 以后，会有一个 Pod 没有被删除，因为该 Pod 标签与 rs.yaml 内定义的标签不符，所以不归该 RS 管理器管辖。