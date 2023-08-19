##  一、Pod 的健康检查-探针

### 1.1、探针基本概念

探针是由 kubelet 对容器执行的定期诊断。要执行诊断，kubelet 调用由容器实现的 Handler 有三种类型的处理程序:

1、**ExecAction**: 在容器内执行指定命令。如果命令退出时返回码为0则认为诊断成功。

2、**TCPSocketAction**: 对指定端口上的容器的IP地址进行 TCP 检查，如果端口打开则诊断被认为是成功的。

3、**HTTPGetAction**: 对指定的端口和路径上的容器的IP地址执行 HTTP Get 请求。如果响应的状态码大于等于 200 且小于 400，则诊断被认为是成功的。

每次探测都将获得以下三种结果之:

- 成功:容器通过了诊断。
- 失败:容器未通过诊断。
- 未知:诊断失败，因此不会采取任何行动。

**探测方式**

1、**livenessProbe**: 指示容器是否正在运行。如果存活探测失败，则 kubelet 会杀死容器，并且容器将受到其重启策略的影响。如果容器不提供存活探针，则默认状态为 Success 。

2、**readinessProbe**: 指示容器是否准备好服务请求。如果就绪探测失败，端点控制器将从与 Pod 匹配的所有 Service 的端点中删除该 Pod 的 IP 地址。初始延迟之前的就绪状态默认为 Failure 如果容器不提供就绪探针，则默认状态为 Success 。

### 1.2、探针实现

**就绪检测：**

```
vim readinessProbe-httpget.yaml

apiVersion: v1
kind: Pod
metadata:
  name: readiness-httpget-pod
spec:
  containers:
  - name: readiness-httpget-container
    image: docker.io/nginx
    imagePullPolicy: IfNotPresent
    readinessProbe:
      httpGet:
        port: 80
        path: /index.html
      initialDelaySeconds: 1
      periodSeconds: 3
```

**我们先运行该 Pod 然后查看其状态：**

![33.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327611392.png)

**已经成功开始运行，这个时候我们进入到该 Pod 然后将其 index.html 文件删除后，在看其状态：**

![34.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327618520.png)

**这个时候我们可以看到，虽然容器处于 Running 状态，但是却处于 No Ready 的状态，这个时候我们通过kubectl describe pod readiness-httpget-pod 命令，查看一下具体的信息：**

![35.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327625620.png)

**我们看到，显示 “Readiness probe failed: HTTP probe failed with statuscode: 404” 就绪探测失败，错误代码 404 表明页面不存在。**

### 1.3、存活检测：

- EXEC

```
vim livenessProbe-exec.yaml

apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec-pod
spec:
  containers:
  - name: liveness-exec-container
    image: docker.io/busybox
    imagePullPolicy: IfNotPresent
    command: ["/bin/sh","-c","touch /tmp/live ; sleep 60; rm -rf /tmp/live; sleep 3600"]
    livenessProbe:
      exec:
        command: ["test","-e","/tmp/live"]
      initialDelaySeconds: 1
      periodSeconds: 3
```

**然后查看下我们 Pod 的实时状态：**

![36.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327643605.png)

经过一段时间等待，我们发现 liveness-exec-pod 出现了重启的现象，这是因为，在我们创建这个 Pod 的时候，我们会在 /tmp 下创建一个 live 的文件，60 秒以后会将其删除，当进行存活检测的时候发现该文件没有了，那么 Pod 认为里面的容器死亡了，就会重启，那么就会重新执行一遍 yaml 文件内的配置，这个时候 live 文件又存在了，但是 60 秒以后，又会被删除，就会在重启一遍，以此类推。

- HTTPGET

```
vim livenessProbe-httpget.yaml

apiVersion: v1
kind: Pod
metadata:
  name: liveness-httpget-pod
spec:
  containers:
  - name: liveness-httpget-container
    image: docker.io/nginx
    imagePullPolicy: IfNotPresent
    ports:
    - name: http
      containerPort: 80
    livenessProbe:
      httpGet:
        port: http
        path: /index.html
      initialDelaySeconds: 1
      periodSeconds: 3
      timeoutSeconds: 10
```

**然后我们查看一下 Pod 的状态：**

![37.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327654983.png)

**这个时候我们通过 “kubectl exec liveness-httpget-pod -it – rm -rf /usr/share/nginx/html/index.html” 命令将 index.html 文件删除掉，我们在进行查看 Pod 的状态：**

![38.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327663027.png)

经过一段时间等待，我们发现 liveness-httpget-pod 出现了重启的现象，这是因为，当我们手动删除了 index.html 文件后，当进行存活检测的时候发现该文件没有了，那么 Pod 认为里面的容器死亡了，就会重启，那么就会重新执行一遍 yaml 文件内的配置，这个时候 index.html 文件又存在了，如果我们再次删除该文件，就会在重启一遍，以此类推。

- TCPSocket

```
vim livenessProbe-tcp.yaml

apiVersion: v1
kind: Pod
metadata:
  name: probe-tcp
spec:
  containers:
  - name: nginx
    image: docker.io/nginx
    livenessProbe:
      initialDelaySeconds: 5
      timeoutSeconds: 1
      tcpSocket:
        port: 808
```

**然后我们查看一下 Pod 的状态：**

![39.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327672456.png)

我们可以看到，开始的时候，Pod 创建成功，但是 30 秒以后，重启了第一次，在经过 30 秒以后，又重启了一次，这是因为， nginx 默认开启的端口为 80 ，而当我们开始存活检测的时候，端口为 808 ，因为没有这个端口，所以认定 Pod 死亡，所以重启，当又开始存活检测的时候，依然没有端口，所以继续重启，以此类推。