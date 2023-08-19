## 一、istio 流量管理

### 1、配置请求路由

 Istio Bookinfo 示例包含四个独立的微服务，每个微服务都有多个版本。 其中一个微服务 reviews 的三个不同版本已经部署并同时运行。 为了说明这导致的问题，在浏览器中访问 Bookinfo 应用程序的 /productpage 并刷新几次。 您会注意到，有时书评的输出包含星级评分，有时则不包含。 这是因为没有明确的默认服务版本路由，Istio 将以循环方式请求路由到所有可用版本，此任务的最初目标是应用将所有流量路由到微服务的 v1 （版本 1）的规则。

```
运行以下命令以应用 virtual services

kubectl apply -f virtual-service-all-v1.yaml

在浏览器中打开 Bookinfo 站点，请注意，无论您刷新多少次，页面的评论部分都不会显示评级星标。这是因为您将 Istio 配置为 将评论服务的所有流量路由到版本 reviews:v1，而此版本的服务不访问星级评分服务，您已成功完成此任务的第一部分：将流量路由到服务的某一个版本。
cat virtual-service-all-v1.yaml

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: productpage
spec:
  hosts:
  - productpage
  http:
  - route:
    - destination:
        host: productpage
        subset: v1
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - route:
    - destination:
        host: ratings
        subset: v1
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: details
spec:
  hosts:
  - details
  http:
  - route:
    - destination:
        host: details
        subset: v1
```

**基于用户身份的路由**

 接下来，我们将更改路由配置，以便将来自特定用户的所有流量路由到特定服务版本。在这，来自名为 Jason 的用户的所有流量将被路由到服务 reviews:v2，请注意，Istio 对用户身份没有任何特殊的内置机制。事实上，productpage 服务在所有到 reviews 服务的 HTTP 请求中都增加了一个自定义的 end-user 请求头，从而达到了本例子的效果，请记住，reviews:v2 是包含星级评分功能的版本。

```
运行以下命令以启用基于用户的路由

kubectl apply -f virtual-service-reviews-test-v2.yaml

在 Bookinfo 应用程序的 /productpage 上，以用户 jason 身份登录，刷新浏览器。你看到了什么？星级评分显示在每个评论旁边，以其他用户身份登录（选择您想要的任何名称），刷新浏览器。现在星星消失了。这是因为除了 Jason 之外，所有用户的流量都被路由到 reviews:v1，您已成功配置 Istio 以根据用户身份路由流量
cat virtual-service-reviews-test-v2.yaml

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
```

### 2、故障注入

 为了测试微服务应用程序 Bookinfo 的弹性，我们将为用户 jason 在 reviews:v2 和 ratings 服务之间注入一个 7 秒的延迟。 这个测试将会发现一个故意引入 Bookinfo 应用程序中的 bug，注意 reviews:v2 服务对 ratings 服务的调用具有 10 秒的硬编码连接超时。 因此，尽管引入了 7 秒的延迟，我们仍然期望端到端的流程是没有任何错误的。

```
创建故障注入规则以延迟来自测试用户 jason 的流量

kubectl apply -f virtual-service-ratings-test-delay.yaml

打开浏览器的 开发工具 菜单，打开 网络 标签，重新加载 productpage 页面。你会看到页面加载实际上用了大约 6s
cat virtual-service-ratings-test-delay.yaml

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    fault:
      delay:
        percentage:
          value: 100.0
        fixedDelay: 7s
    route:
    - destination:
        host: ratings
        subset: v1
  - route:
    - destination:
        host: ratings
        subset: v1
```

![11.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491506327.png)

![12.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491517600.png)

### 3、流量转移

 一个常见的用例是将流量从一个版本的微服务逐渐迁移到另一个版本。在 Istio 中，您可以通过配置一系列规则来实现此目标， 这些规则将一定百分比的流量路由到一个或另一个服务。在本任务中，您将会把 50％ 的流量发送到 reviews:v1，另外 50％ 的流量发送到 reviews:v3。然后，再把 100％ 的流量发送到 reviews:v3 来完成迁移。

```
开始之前
	按照安装指南中的说明安装 Istio。
	部署 Bookinfo 示例应用程序。
	
首先，运行此命令将所有流量路由到各个微服务的 v1 版本。

kubectl apply virtual-service-all-v1.yaml

在浏览器中打开 Bookinfo 站点，请注意，不管刷新多少次，页面的评论部分都不会显示评级星号。 这是因为 Istio 被配置为将 reviews 服务的的所有流量都路由到了 reviews:v1 版本， 而该版本的服务不会访问带星级的 ratings 服务。

使用下面的命令把 50% 的流量从 reviews:v1 转移到 reviews:v3

kubectl apply -f virtual-service-reviews-50-v3.yaml

等待几秒钟以让新的规则传播到代理中生效，刷新浏览器中的 /productpage 页面，大约有 50% 的几率会看到页面中出带 红色 星级的评价内容。这是因为 v3 版本的 reviews 访问了带星级评级的 ratings 服务，但 v1 版本却没有。
cat networking/virtual-service-reviews-50-v3.yaml

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 50
    - destination:
        host: reviews
        subset: v3
      weight: 50
如果您认为 reviews:v3 微服务已经稳定，你可以通过应用此 virtual service 规则将 100% 的流量路由到 reviews:v3

kubectl apply -f virtual-service-reviews-v3.yaml

现在，当您刷新 /productpage 时，您将始终看到带有 红色 星级评分的书评
cat virtual-service-reviews-v3.yaml

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v3
```