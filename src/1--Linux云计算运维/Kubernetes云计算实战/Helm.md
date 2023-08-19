## 一、Helm 是什么

在没使用 helm 之前，向 kubernetes 部署应用，我们要依次部署 deployment、svc 等，步骤较繁琐。况且随着很多项目微服务化，复杂的应用在容器中部署以及管理显得较为复杂，helm 通过打包的方式，支持发布的版本管理和控制，很大程度上简化了 Kubernetes 应用的部署和管理。

Helm 本质就是让 K8s 的应用管理（Deployment,Service 等 ) 可配置，能动态生成。通过动态生成 K8s 资源清单文件（deployment.yaml，service.yaml）。然后调用 Kubectl 自动执行 K8s 资源部署。

Helm 是官方提供的类似于 YUM 的包管理器，是部署环境的流程封装。Helm 有两个重要的概念：chart 和release。

## 二、Helm 相关组件

**Helm 包含两个组件，分别是 helm 客户端 和 Tiller 服务器：**

**helm ：** 是一个命令行工具，用于本地开发及管理chart，chart仓库管理等

**Tiller：** 是 Helm 的服务端。Tiller 负责接收 Helm 的请求，与 k8s 的 apiserver 交互，根据chart来生成一个 release 并管理 release

**chart：** Helm的打包格式叫做chart，所谓chart就是一系列文件, 它描述了一组相关的 k8s 集群资源

**release：** 使用 helm install 命令在 Kubernetes 集群中部署的 Chart 称为 Release

## 三、Helm 原理

![150.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602486104098.png)

**创建 或 删除 release**

helm 客户端从指定的目录或本地tar文件或远程repo仓库解析出chart的结构信息

helm 客户端指定的 chart 结构和 values 信息通过 gRPC 传递给 Tiller

Tiller 服务端根据 chart 和 values 生成一个 release

Tiller 将install release请求直接传递给 kube-apiserver

**更新release**

helm 客户端将需要更新的 chart 的 release 名称 chart 结构和 value 信息传给 Tiller

Tiller 将收到的信息生成新的 release，并同时更新这个 release 的 history

Tiller 将新的 release 传递给 kube-apiserver 进行更新

## 四、Helm 部署

```
wget https://storage.googleapis.com/kubernetes-helm/helm-v2.16.7-linux-amd64.tar.gz

tar zxvf helm-v2.16.7-linux-amd64.tar.gz 

cd linux-amd64/

ls
LICENSE  README.md  helm  tiller

cp helm /usr/local/bin/

安装好 helm 客户端后，就可以通过以下命令将 Tiller 安装在 kubernetes 集群中 ：

helm init

# 这个地方默认使用 “https://kubernetes-charts.storage.googleapis.com” 作为缺省的 stable repository 的地址，但由于国内有一张无形的墙的存在，googleapis.com 是不能访问的。

可以使用阿里云的源来配置 ：

helm init --upgrade -i registry.cn-hangzhou.aliyuncs.com/google_containers/tiller:v2.16.7  --stable-repo-url https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts

执行上面命令后，可以通过 kubectl get pod -n kube-system 来查看 tiller 的安装情况 ： 

由于 kubernetes 从1.6 版本开始加入了 RBAC 授权。当前的 Tiller 没有定义用于授权的ServiceAccount， 访问 API Server 时会被拒绝，需要给 Tiller 加入授权:

创建 Kubernetes 的服务帐号和绑定角色:

kubectl create serviceaccount --namespace kube-system tiller
# serviceaccount "tiller" created

kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
# clusterrolebinding.rbac.authorization.k8s.io "tiller-cluster-rule" created

给 Tiller 的 deployments 添加刚才创建的 ServiceAccount :

kubectl patch deploy --namespace kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
# deployment.extensions "tiller-deploy" patched

查看 Tiller deployments 资源是否绑定 ServiceAccount :

kubectl get deploy -n kube-system tiller-deploy -o yaml | grep serviceAccount
# serviceAccount: tiller
# serviceAccountName: tiller

查看 Tiller 是否安装成功 ： 

helm version 
# Client: &version.Version{SemVer:"v2.16.7", 
# Server: &version.Version{SemVer:"v2.16.7", 

helm 有很多子命令和参数，为了提高使用命令行的效率，通常建议安装 helm 的 bash 命令补全脚本：

source <(helm completion bash)
echo "source <(helm completion bash)" >> ~/.bashrc

添加 helm chart 仓库：

helm repo add stable  https://kubernetes-charts.storage.googleapis.com

helm repo add aliyun  https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts

helm repo add alihub  https://apphub.aliyuncs.com

helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com

helm repo add weiruan-1  http://mirror.azure.cn/kubernetes/charts

helm repo add weiruan-2 http://mirror.azure.cn/kubernetes/charts-incubator

helm repo add weiruan-3 http://mirror.azure.cn/kubernetes/svc-catalog-charts

helm repo add bitnami https://charts.bitnami.com/bitnami

helm repo add elastic https://helm.elastic.co

helm repo add kiwigrid https://kiwigrid.github.io

helm repo add jetstack https://charts.jetstack.io

更新仓库：

helm repo update
```

![149.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602486127780.png)

**Helm 常用命令**

```
# 创建一个chart范例
helm create HELM-NAME

# 检查chart语法
helm lint ./HELM-NAME

# 使用默认chart部署到k8s
helm install --name RELEASE-NAME ./HELM-NAME --set service.type=NodePort

# 查看当前的部署列表
helm ls

# 查询一个特定的 Release 的状态
helm status RELEASE-NAME

# 打包chart
helm package ./HELM-NAME --debug

# 使用包去做release部署
helm install --name RELEASE-NAME HELM-NAME-0.1.0.tgz --set service.type=NodePort

# 升级当前release
helm upgrade RELEASE-NAME ./HELM-NAME

# 回滚当前release
helm rollback RELEASE-NAME 3（版本号）

# 删除该release
helm delete RELEASE-NAME
helm del --purge RELEASE-NAME
```

## 五、Helm 自定义模板

```
创建自描述文件 Chart.yaml , 这个文件必须有 name 和 version 定义：

vim Chart.yaml

name: hello-world
version: 1.0


创建模板文件， 用于生成 Kubernetes 资源清单,模板文件名必须为 templates：

mkdir templates

vim templates/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: helm-nginx
spec:
  selector:
    matchLabels:
      app: helm-nginx
  replicas: 3
  template:
    metadata:
      labels:
        app: helm-nginx
    spec:
      containers:
        - name: helm-nginx
          image: docker.io/nginx
          imagePullPolicy: IfNotPresent
          ports:
          - containerPort: 80



vim templates/service.yaml

apiVersion: v1
kind: Service
metadata:
  name: helm-nginx-svc
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  selector:
    app: helm-nginx


使用命令 helm install RELATIVE_PATH_TO_CHART 创建一次Release

helm install .
```

![151.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602486151896.png)

查看下我们创建以后的资源：

![152.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602486158573.png)

访问测试：

![153.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602486165093.png)

```
通过 values.yaml 配置 helm 应用：


vim values.yaml

image:
  repository: docker.io/nginx
  tag: latest
  pullPolicy: IfNotPresent


vim templates/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: helm-nginx-1
spec:
  selector:
    matchLabels:
      app: helm-nginx-1
  replicas: 3
  template:
    metadata:
      labels:
        app: helm-nginx-1
    spec:
      containers:
        - name: helm-nginx
          image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
          imagePullPolicy: IfNotPresent
          ports:
          - containerPort: 80
          
vim templates/service.yaml

apiVersion: v1
kind: Service
metadata:
  name: helm-nginx-svc-1
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  selector:
    app: helm-nginx-1
```

使用模板动态生成K8s资源清单，非常需要能提前预览生成的结果，使用 --dry-run 选项来打印出生成的清单文件内容，而不执行部署：

**helm install . --dry-run**

![154.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602486177990.png)

这里看见报错了，这是因为，我们刚刚已经创了对应的资源，所以报错说 service “helm-nginx-svc” 已经存在了。