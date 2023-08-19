## 一、Pod 的 NameSpace

使用 kubectl 管理命名空间及其包含的资源相当简单。在这一节中，我们将演示一些最常见的命名空间操作，便于你开始有效地分割资源。

在我们进行创建命名空间之前，先说一下 Kubernetes 是如何自动设置它的，在默认情况下，新的集群上有三个命名空间：

**default：** 向集群中添加对象而不提供命名空间，这样它会被放入默认的命名空间中。在创建替代的命名空间之前，该命名空间会充当用户新添加资源的主要目的地，无法删除。

**kube-public：** 此命名空间是自动创建的，并且所有用户（包括未经过身份验证的用户）都可以读取。此命名空间主要用于群集使用，以防某些资源在整个群集中可见且可公开读取。此命名空间的公共方面只是一个约定，而不是一个要求。

**kube-system：** kube-system 命名空间用于 Kubernetes 管理的 Kubernetes 组件，一般规则是，避免向该命名空间添加普通的工作负载。它一般由系统直接管理，因此具有相对宽松的策略。

**要显示集群中可用的所有命名空间，使用 kubectl get namespaces 命令：**

![40.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327687759.png)

**使用 kubectl get namespaces kube-system 指定namespaces 查看：**

![41.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327697548.png)

**使用 kubectl describe namespaces kube-system 指定namespaces查看详情：**

![42.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327705291.png)

**namespaces status 有两个状态：**

- Active ： 命名空间正在使用中
- Terminating ： 正在删除命名空间，不能用于新对象

**使用 kubectl create namespace test 创建 namespaces ：**

![43.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327714091.png)

**使用 kubectl delete namespaces test 删除 namespaces ：**

![44.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327720750.png)

**正常使用 namespaces ，只需要在我们创建的资源清单内指定即可：**

```
apiVersion: v1
kind: Pod
metadata:
 name: nginx
 namespaces: test			# 指定所属 namespaces
 labels:
    app: web
spec:
 containers:
    - name: nginx
      image: docker.io/nginx
      ports:
       - containerPort: 80
```

![45.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327731423.png)

可以看到，如果我们不指定查看具体是那个命名空间的 Pod ，那么会默认显示为 default 空间内的 Pod 信息。