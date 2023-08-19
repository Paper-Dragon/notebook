Pod 我们可以分为两类，一种属于自主式 Pod ，还有一种属于控制器管理的 Pod 。

## 一、Pod 的 initContainers

**基本概念：**

Pod能够具有多个容器，应用运行在容器里面，但是它也可能有一个或多个先于应用容器启动的Init容器，Init容器与普通的容器非常像，除了如下两点:

- Init容器总是运行到成功完成为止
- 每个Init容器都必须在下一个Init容器启动之前成功完成

如果Pod的Init容器失败, Kubernetes 会不断地重启该Pod,直到Init容器成功为止。然而，如果Pod对应的restartPolicy为Never，它不会重新启动。

**它的优势：**

因为Init容器具有与应用程序容器分离的单独镜像，所以它们的启动相关代码具有如下优势:

1、它们可以包含并运行实用工具， 但是出于安全考虑，是不建议在应用程序容器镜像中包含这些实用工具的

2、它们可以包含使用工具和定制化代码来安装，但是不能出现在应用程序镜像中。例如，创建 镜像没必要FROM另一个镜像，只需要在安装过程中使用类似sed、 awk、python或dig这样的工具。

3、应用程序镜像可 以分离出创建和部署的角色，而没有 必要联合它们构建一个单独的镜像。

4、Init容器使用Linux Namespace, 所以相对应用程序容器来说具有不同的文件系统视图。因此，它们能够具有访问Secret 的权限，而应用程序容器则不能。

5、它们必须在应用程序 容器启动之前运行完成， 而应用程序容器是并行运行的， 所以Init容器能够提供了-种简单的阻塞或延迟应用容器的启动的方法，直到满足了一组先决条件。

**initContainers示例：**

```
apiVersion: v1
kind: Pod
metadata:
  name: initc-demo
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: docker.io/busybox
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: docker.io/busybox
    command: ['sh', '-c', 'until nslookup myservice; do echo waiting for myservice; sleep 2; done;']
  - name: init-mydb
    image: busybox
    command: ['sh', '-c', 'until nslookup mydb; do echo waiting for mydb; sleep 2; done;']
```

**我们创建模版资源后查看结果为：**

![29.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327495326.png)

**我们查看一下日志：**

![30.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327507111.png)

这个时候我们可以看到因为解析不成功，所以初始化程序卡住了，那么先创建满足第一个解析的service资源：

```
kind: Service
apiVersion: v1
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

创建完成后我们在查看一下 Pod 的状态：

![31.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327523513.png)

第一个 init 初始化程序已经成功，这是因为，我们创建名为“myservice”的 SVC 的数据会写到我们内部的DNS（coreDNS） 上，因为可以正常的解析了，所以第一个 init 初始化程序完成，同理我们加入第二个 init 初始化程序的 SVC 后查看 Pod 状态：

```
kind: Service
apiVersion: v1
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

![32.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327544223.png)

 这个时候我们可以看到，第二个 init 初始化程序已经完成，我们的主容器 Pod 开始初始化，最后成功开始运行。

**initContainers特殊说明（重要点）**

1、在 Pod 启动过程中，Init 容器会按顺序在网络和数据卷初始化之后启动。每个容器必须在下一个容器启动之前成功退出。

2、如果由于运行时或失败退出，将导致容器启动失败，它会根据 Pod 的 restartPolicy 指定的策略进行重试。然而，如果 Pod 的 restartPolicy 设置为 Always , Init 容器失败时会使用 RestartPolicy 策略。

3、在所有的Init容器没有成功之前，Pod 将不会变成 Ready 状态。Init 容器的端口将不会在 Service 中进行聚集。正在初始化中的 Pod 处于 Pending 状态，但会将 Initializing 状态设置为 true。

4、如果 Pod 重启，所有 Init 容器必须重新执行。

5、对 Init 容器 spec 的修改被限制在容器 image 字段， 修改其他字段都不会生效。 更改 Init 容器的 image字段，等价于重启该 Pod。

6、Init 容器具有应用容器的所有字段。除了 readinessProbe , 因为Init容器无法定义不同于完成 (completion) 的就绪 (readiness) 之外的其他状态。这会在验证过程中强制执行。

7、在 Pod 中的每个 app 和 Init 容器的名称必须唯一，与任何其它容器共享同个名称，会在验证时抛出错误。