## 一、Secret 存在意义

Secret 解决了密码、token、密钥等敏感数据的配置问题，而不需要把这些敏感数据暴露到镜像或者 Pod Spec中。Secret 可以以 Volume 或者环境变量的方式使用。

**Secret 有三种类型：**

**Service Account ：** 用来访问 Kubernetes API，由 Kubernetes 自动创建，并且会自动挂载到 Pod 的/run/secrets/kubernetes.io/serviceaccount 目录中。

**Opaque：base64** 编码格式的Secret，用来存储密码、密钥等

**kubernetes.io/dockerconfigjson：** 用来存储私有 docker registry 的认证信息

### 1.1、Service Account

Service Account 用来访问 Kubernetes API，由 Kubernetes 自动创建，并且会自动挂载到 Pod的/run/secrets/kubernetes.io/serviceaccount 目录中。

```
kubectl exec kube-proxy-hz44s -n kube-system -it -- /bin/sh

cd /run/secrets/kubernetes.io/serviceaccount
```

来看一下查看到的结果：

![111.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602332669830.png)

**ca.crt**

![112.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602332679776.png)

**token**

![113.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602332688822.png)

### 1.2、Opaque Secret

**1.2.1、创建说明：**

Opaque 类型的数据是一个 map 类型，要求 value 是 base64 编码格式：

```
echo -n "admin" | base64
YWRtaW4=

echo -n "123456789" | base64
MTIzNDU2Nzg5

#-----------------------------# 分割线 #--------------------------------------#

vim secrets.yaml

apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: MTIzNDU2Nzg5
  username: YWRtaW4=
```

**1.2.2、使用方式**

**a、将 Secret 挂载到 Volume 中：**

```
apiVersion: v1
kind: Pod
metadata:
  name: seret-test
  labels:
    name: seret-test
spec:
  volumes:
  - name: secrets
    secret:
      secretName: mysecret
  containers:
  - name: db
    image: docker.io/nginx
    volumeMounts:
    - name: secrets
      mountPath: "/etc/secret"
      readOnly: true
```

我们来看一下结果：

![114.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602332700206.png)

**b、将 Secret 导出到环境变量中**：

```
vim secret-pod-1.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: pod-deployment
spec:
  selector:
    matchLabels:
      app: pod-deployment
  replicas: 2
  template:
    metadata:
      labels:
        app: pod-deployment
    spec:
      containers:
      - name: pod-1
        image: docker.io/nginx
        ports:
        - containerPort: 80
        env:
        - name: TEST_USER
          valueFrom:
            secretKeyRef:
              name: mysecret
              key: username
        - name: TEST_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysecret
              key: password
```

**我们来看一下结果：**

![115.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602332707405.png)