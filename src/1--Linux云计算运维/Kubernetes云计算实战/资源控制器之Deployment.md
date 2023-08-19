Deployment 为 Pod 和 ReplicaSet 提供了一个声明式定义(declarative)方法，用来替代以前的ReplicationController 来方便的管理应用。典型的应用场景包括：

- 定义 Deployment 来创建 Pod 和 ReplicaSet

- 滚动升级和回滚应用

- 扩容和缩容

![49.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328553716.png)

**Deployment 应用示例：**

```
vim deploy.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      app: web-nginx
  replicas: 3
  template:
    metadata:
      labels:
        app: web-nginx
    spec:
      containers:
        - name: web-nginx
          image: docker.io/nginx
          imagePullPolicy: IfNotPresent
          ports:
          - containerPort: 80


kubectl create -f deploy.yaml --record
	## --record参数可以记录命令，我们可以很方便的查看每次 revision 的变化
```

**创建完成后，我们可以查看下我们的 Pod 状态：**

![50.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328566876.png)


**我们可以通过命令 kubectl scale deployment my-nginx --replicas=5 将副本数量扩容到 5 个：**

![53.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328576964.png)

**也可以通过该命令 kubectl scale deployment my-nginx --replicas=2 缩容到 2 个：**

![54.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328582504.png)

**这个时候我们注意一下，在缩容的时候，优先删除的是创建时间短的 Pod 。下面我们在来看一下 deployment 的升级与回滚：**

**查看当前的 Pod 当中的 nginx 的版本： kubectl exec Pod-name -it – nginx -v**

**升级 images 版本： kubectl set image deployment/my-nginx web-nginx=nginx:1.9.1**

![55.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328593851.png)

**使用命令 kubectl get rs 命令查看 Pod 的更新过程：**

![56.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328600900.png)

**当升级完成后，查看一下当前 Pod 的 nginx 的版本：**

![57.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328607639.png)

**通过命令查看 deployment 的历史记录： kubectl rollout history deployment my-nginx**

![58.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328614191.png)

**回滚到之前的版本： kubectl rollout undo deployment --to-revision=1**

![59.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328621007.png)

**回滚完成后，查看一下当前 Pod 的 nginx 的版本：**

![60.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602328627324.png)

**清理 Policy ：**

可以通过设置 spec.revisonHistoryLimit 项来指定 deployment 最多保留多少 revision 历史记录。默认的会保留所有的 revision，如果将该项设置为 0，Deployment 就不允许回退了。