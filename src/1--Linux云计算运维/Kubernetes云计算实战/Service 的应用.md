**ClusterIP**

clusterIP 主要在每个 node 节点使用 ipvs，将发向 clusterIP 对应端口的数据，转发到 kube-proxy 中。然后 kube-proxy 自己内部实现有负载均衡的方法，并可以查询到这个 service 下对应 pod 的地址和端口，进而把数据转发给对应的 pod 的地址和端口。

![74.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329041269.png)

**为了实现图上的功能，主要需要以下几个组件的协同工作：**

- apiserver 用户通过kubectl命令向apiserver发送创建service的命令，apiserver接收到请求后将数据存储到etcd中。
- kube-proxy kubernetes的每个节点中都有一个叫做kube-porxy的进程，这个进程负责感知service，pod的变化，并将变化的信息写入本地的iptables规则中。
- ipvs 使用NAT等技术将virtualIP的流量转至endpoint中

示例：

```
vim nginx.yaml

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
          
#-----------------------------# 分割线 #--------------------------------------#
          
vim nginx-svc.yaml

apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  type: ClusterIP
  selector:
    app: web-nginx
  ports:
  - name: http
    port: 80
    targetPort: 80
```

我们先运行我们的资源清单，然后查看下是否可以正常访问：

![75.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329052731.png)

为了方便分别当前是哪个 Pod 给我们提供的服务，我们依次将三个 Pod 内 index.html 的文件内容修改为 “1”、“2”、“3”，然后从新看一下：

![76.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329061534.png)

我们在来看一下我们的 Pod 的 IP 地址 与 ipvs 的转发关系：

![77.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329067298.png)

![78.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329073337.png)

**Headless Service**

有时不需要或不想要负载均衡，以及单独的 Service IP 。遇到这种情况，可以通过指定 Cluster IP(spec.clusterIP) 的值为 “None” 来创建 Headless Service 。这类 Service 并不会分配 Cluster IP， kube-proxy 不会处理它们，而且平台也不会为它们进行负载均衡和路由

```
vim headless.yaml

apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: web-nginx
  clusterIP: "None"
  ports:
  - name: http
    port: 80
    targetPort: 80

dig -t A myapp.default.svc.cluster.local. @10.244.0.3
```

![79.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329083379.png)

通过 dig 命令，我们可以看到，即使没有 SVC 的 IP 我们也可以通过域名的方式访问到我们的 Pod

![80.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329090527.png)

**NodePort**

nodePort 的原理在于在 node 上开了一个端口，将向该端口的流量导入到 kube-proxy，然后由 kube-proxy 进一步到给对应的 pod

```
vim nodeport.yaml

apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  type: NodePort
  selector:
    app: web-nginx
  ports:
  - name: http
    port: 80
    targetPort: 80
    nodePort: 31000		# 可以通过宿主机的的31000端口访问nginx服务
    									# 有效端口范围为30000-32767
```

我们来查看一下相关的信息：

![81.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329099291.png)

验证一下：

![82.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329104915.png)

![83.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329110866.png)

![84.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329117343.png)

**LoadBalancer**

loadBalancer 和 nodePort 其实是同一种方式。区别在于 loadBalancer 比 nodePort 多了一步，就是可以调用cloud provider 去创建 LB 来向节点导流

**ExternalName**

这种类型的 Service 通过返回 CNAME 和它的值，可以将服务映射到 externalName 字段的内容( 例如：www.zutuanxue.com )。ExternalName Service 是 Service 的特例，它没有 selector，也没有定义任何的端口和Endpoint。相反的，对于运行在集群外部的服务，它通过返回该外部服务的别名这种方式来提供服务。

```
vim external.yaml

kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  type: ExternalName
  externalName: www.zutuanxue.com
```

我们来查看一下：

![85.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329424397.png)

![86.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329437386.png)

当查询主机 my-service.defalut.svc.cluster.local ( SVC_NAME.NAMESPACE.svc.cluster.local )时，集群的DNS 服务将返回一个值 my.database.example.com 的 CNAME 记录。访问这个服务的工作方式和其他的相同，唯一不同的是重定向发生在 DNS 层，而且不会进行代理或转发。