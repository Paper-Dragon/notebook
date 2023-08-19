## 一、istio 部署

下载地址：https://github.com/istio/istio/releases

网盘链接:https://pan.baidu.com/s/1L4CK2icK6teT5Ef4eiJwKw 密码:i16u

**资源配置：**

**master 2U2G**

**node 2U8G**

```
curl -L https://git.io/getLatestIstio | ISTIO_VERSION=1.5.4 sh -

kubectl create namespace istio-system

cd istio-1.5.4

使用 helm template 生成配置文件进行安装：

初始化：

helm template install/kubernetes/helm/istio-init --name istio-init --namespace istio-system > init.yaml

kubectl apply -f init.yaml
等初始化 pod 完成后，就可以执行 istio 安装了

安装：

vim install/kubernetes/helm/istio/values.yaml
编辑 valuse.yaml 文件，确认需要安装启动的组件

helm template install/kubernetes/helm/istio --name istio --namespace istio-system > istio.yaml

kubectl apply -f istio.yaml

或

使用 helm install 由 helm 服务来进行安装：

初始化：

helm install install/kubernetes/helm/istio-init --name istio-init --namespace istio-system

vim install/kubernetes/helm/istio/values.yaml
编辑 valuse.yaml 文件，确认需要安装启动的组件

安装：

helm install install/kubernetes/helm/istio --name istio --namespace istio-system

查看 istio 的状态 

kubectl get pod -n istio-system
kubectl get svc -n istio-system

这里需要注意，因为是实验环境，如果集群运行在一个不支持外部负载均衡器的环境中，istio-ingressgateway 的 EXTERNAL-IP 将显示为 <pending> 状态。我们需要使用服务的 NodePort 或 端口转发来访问网关，我们这里使用 NodePort 来进行访问，所以需要进行如下修改：

kubectl edit svc istio-ingressgateway -n istio-system
在文件末尾将 LoadBalancer 修改为 NodePort 后保存退出即可。
```

![4.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491354708.png)

![5.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491367469.png)

**Istio 对 Pod 和服务的要求**

**要成为服务网格的一部分，Kubernetes 集群中的 Pod 和服务必须满足以下几个要求：**

**需要给端口正确命名:**服务端口必须进行命名。端口名称只允许是<协议>[-<后缀>-]模式，其中<协议>部分可选择范围包括 grpc、http、http2、https、mongo、redis、tcp、tls 以及 udp，Istio 可以通过对这些协议的支持来提供路由能力。例如 name: http2-foo 和 name: http 都是有效的端口名，但 name: http2foo 就是无效的。如果没有给端口进行命名，或者命名没有使用指定前缀，那么这一端口的流量就会被视为普通 TCP 流量（除非显式的用 Protocol: UDP 声明该端口是 UDP 端口）。

**Pod 端口:**Pod 必须包含每个容器将监听的明确端口列表。在每个端口的容器规范中使用 containerPort。任何未列出的端口都将绕过 Istio Proxy。

**关联服务:**Pod 不论是否公开端口，都必须关联到至少一个 Kubernetes 服务上，如果一个 Pod 属于多个服务，这些服务不能在同一端口上使用不同协议，例如 HTTP 和 TCP。

**Deployment 应带有 app 以及 version 标签:**在使用 Kubernetes Deployment 进行 Pod 部署的时候，建议显式的为 Deployment 加上 app 以及 version 标签。每个 Deployment 都应该有一个有意义的 app 标签和一个用于标识 Deployment 版本的 version 标签。app 标签在分布式追踪的过程中会被用来加入上下文信息。Istio 还会用 app 和 version 标签来给遥测指标数据加入上下文信息。

**Application UID:**不要使用 ID（UID）值为 1337 的用户来运行应用。

**NET_ADMIN 功能:**如果您的集群中实施了 Pod 安全策略，除非您使用 Istio CNI 插件，您的 pod 必须具有NET_ADMIN功能。

## 二、部署 Bookinfo 示例

这个示例部署了一个用于演示多种 Istio 特性的应用，该应用由四个单独的微服务构成。 这个应用模仿在线书店的一个分类，显示一本书的信息。 页面上会显示一本书的描述，书籍的细节（ISBN、页数等），以及关于这本书的一些评论。

Bookinfo 应用分为四个单独的微服务：

- `productpage`. 这个微服务会调用 `details` 和 `reviews` 两个微服务，用来生成页面。
- `details`. 这个微服务中包含了书籍的信息。
- `reviews`. 这个微服务中包含了书籍相关的评论。它还会调用 `ratings` 微服务。
- `ratings`. 这个微服务中包含了由书籍评价组成的评级信息。

`reviews` 微服务有 3 个版本：

- v1 版本不会调用 `ratings` 服务。
- v2 版本会调用 `ratings` 服务，并使用 1 到 5 个黑色星形图标来显示评分信息。
- v3 版本会调用 `ratings` 服务，并使用 1 到 5 个红色星形图标来显示评分信息。

下图展示了这个应用的端到端架构。

![6.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491397770.png)

Bookinfo 应用中的几个微服务是由不同的语言编写的。 这些服务对 Istio 并无依赖，但是构成了一个有代表性的服务网格的例子：它由多个服务、多个语言构成，并且 `reviews` 服务具有多个版本。

```
部署前准备：
	1、kubernetes 集群部署完成
	2、helm 部署完成

# Istio 默认自动注入 Sidecar. 请为 default 命名空间打上标签 istio-injection=enabled
kubectl label namespace default istio-injection=enabled

# 使用 kubectl 部署应用
kubectl apply -f bookinfo.yaml

# 确认 Bookinfo 应用是否正在运行，请在某个 Pod 中用 curl 命令对应用发送请求，例如 ratings
kubectl exec -it $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"

现在 Bookinfo 服务启动并运行中，我们需要使应用程序可以从外部访问 Kubernetes 集群，例如使用浏览器。可以用 Istio Gateway 来实现这个目标。

# 为应用程序定义 Ingress 网关
kubectl apply -f bookinfo-gateway.yaml

# 在 Kubernetes 环境中，使用 Kubernetes Ingress 资源来指定需要暴露到集群外的服务。 在 Istio 服务网格中，更好的选择（同样适用于 Kubernetes 及其他环境）是使用一种新的配置模型，名为 Istio Gateway。 Gateway 允许应用一些诸如监控和路由规则的 Istio 特性来管理进入集群的流量

启动 httpbin 样例程序

kubectl apply -f httpbin.yaml

执行如下指令，明确自身 Kubernetes 集群环境支持外部负载均衡

kubectl get svc istio-ingressgateway -n istio-system

若自身环境未使用外部负载均衡器，需要通过 NodePort 访问,执行如下命令,设置 ingress 端口：

export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')

export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')

在使用 Istio 控制 Bookinfo 版本路由之前，我们需要在目标规则中定义好可用的应用默认目标规则，命名为 subsets 

kubectl apply -f destination-rule-all.yaml

浏览器访问测试：

http://IP:port/productpage
```

![10.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491409437.png)

![7.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491423328.png)

![8.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491430887.png)

![9.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491438284.png)