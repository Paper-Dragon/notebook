## 一、节点亲和性策略介绍

**pod.spec.nodeAffinity**

- preferredDuringSchedulingIgnoredDuringExecution：软策略
- requiredDuringSchedulingIgnoredDuringExecution：硬策略

```
preferred：首选，较喜欢
required：需要，必修
```

**键值运算关系：**

- In：label 的值在某个列表中
- NotIn：label 的值不在某个列表中
- Gt：label 的值大于某个值
- Lt：label 的值小于某个值
- Exists：某个 label 存在
- DoesNotExist：某个 label 不存在

## 二、节点与Pod硬亲和性

**requiredDuringSchedulingIgnoredDuringExecution**

```
#创建pod的模板yaml文件
vim affinity.yaml

apiVersion: v1
kind: Pod
metadata:
  name: affinity
  labels:
    app: node-affinity-pod
spec:
  containers:
  - name: with-node-affinity
    image: docker.io/nginx
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/hostname
            operator: NotIn
            values:
            - node-1
```

通过修改 Pod 名称的方式多创建几个 Pod 查看结果：
![119.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602265359628.png)

这个时候，我们将 operator 修改为 “In” ，node-1 修改为 node-3，

```
vim affinity.yaml

apiVersion: v1
kind: Pod
metadata:
  name: affinity-3
  labels:
    app: node-affinity-pod
spec:
  containers:
  - name: with-node-affinity
    image: docker.io/nginx
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/hostname
            operator: In
            values:
            - node-3
```

查看下结果：
![120.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602265434289.png)

这个时候可以看到，我们新创建的 Pod 一直处于 Pending 的状态，这是因为我们没有Node-3这个节点，且采用的是硬亲和性策略的原因所导致的。

## 三、节点与Pod软亲和性

**preferredDuringSchedulingIgnoredDuringExecution**
为了解决上述因为硬亲和性创建Pod不成功的问题，我们通过设置软亲和性策略后再次创建一个pod affinity-pod-a测试。

```
vim affinity-1.yaml

apiVersion: v1
kind: Pod
metadata:
  name: affinity-a
  labels:
    app: node-affinity-pod-a
spec:
  containers:
  - name: with-node-affinity-a
    image: docker.io/nginx
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: kubernetes.io/hostname
            operator: In
            values:
            - node-3
```

我们没有 node-3 节点，这个时候我们创建看一下：

![121.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602265504683.png)

我们再将 node-3 修改为 node-1 看一下：

![122.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602265522269.png)

**通过实验我们得出关于节点与pod亲和力策略**

- 硬限制是：我必须在某个节点或我必须不在某个节点。
- 软限制是：我想在某个节点或我不想在某个节点，实在不行，我也可以将就。

**软硬限制结合策略**
策略优先级：先满足硬限制，然后满足软限制

```
软硬限制可以结合使用，先满足硬限制，然后满足软限制=

apiVersion: v1
kind: Pod
metadata:
  name: affinity
  labels:
    app: node-affinity-pod
spec:
  containers:
  - name: with-node-affinity
    image: docker.io/nginx
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/hostname
            operator: NotIn
            values:
            - node-2
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: source
            operator: In
            values:
            - zutuanxue_com
```

## 四、Pod 亲和性

pod.spec.affinity.podAffinity/podAntiAffinity

- preferredDuringSchedulingIgnoredDuringExecution：软策略
- requiredDuringSchedulingIgnoredDuringExecution：硬策略

```
podAffinity: pod之间亲和，pod在同一网段
podAntiAffinity：pod之间反亲和，pod在不同网段
```

### 4.1、pod亲和性

```
vim test-pod.yaml

apiVersion: v1
kind: Pod
metadata:
  name: pod-1
  labels:
    app: pod-1
spec:
  containers:
  - name: pod-1
    image: docker.io/busybox
    command: [ "/bin/sh", "-c", "sleep 600s" ]
    
#-----------------------------# 分割线 #--------------------------------------#

vim affinity-pod.yaml

apiVersion: v1
kind: Pod
metadata:
  name: pod-3
  labels:
    app: pod-3
spec:
  containers:
  - name: pod-3
    image: docker.io/nginx
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - pod-1
        topologyKey: kubernetes.io/hostname
```

我们来看一下结果：

![123.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602265725369.png)

## 五、关于亲和性总结

| 调度策略        | 匹配标签 | 操作符                                 | 拓扑域支持 | 调度目标                   |
| --------------- | -------- | -------------------------------------- | ---------- | -------------------------- |
| nodeAffinity    | 主机     | In, NotIn, Exists,DoesNotExist, Gt, Lt | 否         | 指定主机                   |
| podAffinity     | POD      | In, NotIn, Exists,DoesNotExist         | 是         | POD与指定POD同一拓扑域     |
| podAnitAffinity | POD      | In, NotIn, Exists,DoesNotExist         | 是         | POD与指定POD不在同一拓扑域 |