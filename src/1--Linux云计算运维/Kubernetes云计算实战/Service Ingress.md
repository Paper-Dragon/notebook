![87.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329577997.png)

![88.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329586972.png)

Ingress-Nginx github 地址：https://github.com/kubernetes/ingress-nginx

Ingress-Nginx 官方网站：https://kubernetes.github.io/ingress-nginx

**部署 Ingress-Nginx**

```
https://kubernetes.github.io/ingress-nginx/deploy/

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.27.0/deploy/static/mandatory.yaml

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.27.0/deploy/static/provider/baremetal/service-nodeport.yaml
```

**Ingress HTTP 代理访问**

```
vim ingress-nginx.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      name: nginx
  replicas: 2
  template:
    metadata:
      labels:
        name: nginx
    spec:
      containers:
      - name: nginx
        image: docker.io/nginx
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  selector:
    name: nginx
    
#-----------------------------# 分割线 #--------------------------------------#

vim ingress-nginx-svc.yaml

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: nginx-test
spec:
  rules:
  - host: aaa.zutuanxue.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-svc
          servicePort: 80
```

**我们可以通过命令 kubectl get svc -n ingress-nginx 查看对外宣告的端口：**

![89.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602329870836.png)

**然后使用浏览器通过域名：http://aaa.zutuanxue.com:31363/ 进行访问，因为需要进行域名解析，记得现在 hosts 文件内添加我们使用的域名的解析：**

![90.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331552519.png)

**通过 Ingress 实现虚拟主机：**

```
vim ingress-nginx-1.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-1
spec:
  selector:
    matchLabels:
      name: nginx-1
  replicas: 2
  template:
    metadata:
      labels:
        name: nginx-1
    spec:
      containers:
      - name: nginx-1
        image: docker.io/nginx
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc-1
spec:
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  selector:
    name: nginx-1
 
 #-----------------------------# 分割线 #--------------------------------------#
 
vim ingress-nginx-2.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-2
spec:
  selector:
    matchLabels:
      name: nginx-2
  replicas: 2
  template:
    metadata:
      labels:
        name: nginx-2
    spec:
      containers:
      - name: nginx-2
        image: docker.io/nginx
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc-2
spec:
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  selector:
    name: nginx-2
    
#-----------------------------# 分割线 #--------------------------------------#

vim ingress-nginx-svc-1.yaml

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-1
spec:
  rules:
  - host: bbb.zutuanxue.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-svc-1
          servicePort: 80
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-2
spec:
  rules:
  - host: ccc.zutuanxue.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-svc-2
          servicePort: 80
```

**创建完成后，我们来查看下一下相关的信息：**

![91.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331570318.png)

**为了区分，我们对 Pod 内的 index.html 文件进行了对应的修改，然后我们通过不同的域名进行访问：**

![92.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331579254.png)

**Ingress HTTPS 代理访问**

```
创建证书，以及 cert 存储方式:

openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=nginxsvc/O=nginxsvc"

kubectl create secret tls tls-secret --key tls.key --cert tls.crt
```

![93.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602330583290.png)

```
创建deployment、Service、Ingress Yaml 文件：

vim ingress-nginx-3.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-3
spec:
  selector:
    matchLabels:
      name: nginx-3
  replicas: 2
  template:
    metadata:
      labels:
        name: nginx-3
    spec:
      containers:
      - name: nginx-3
        image: docker.io/nginx
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc-3
spec:
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  selector:
    name: nginx-3
    
#-----------------------------# 分割线 #--------------------------------------#

vim ingress-nginx-svc-2.yaml

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-3
spec:
  tls:
  - hosts:
    - ddd.zutuanxue.com
    secretName: tls-secret
  rules:
  - host: ddd.zutuanxue.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-svc-3
          servicePort: 80
```

**创建完成后我们来查看一下效果：**

![94.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331601964.png)

![95.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331609166.png)

**Nginx 进行 BasicAuth**

```
安装 httpd ，因为我们要使用相关的功能模块：

yum -y install httpd

htpasswd -c auth 用户名

kubectl create secret generic basic-auth --from-file=auth
```

![96.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331621504.png)

```
创建 Ingress Yaml 文件：

vim ingress-nginx-svc-3.yaml

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-with-auth
  annotations:
    nginx.ingress.kubernetes.io/auth-type: basic
    nginx.ingress.kubernetes.io/auth-secret: basic-auth
    nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required - tyschool'
spec:
  rules:
  - host: eee.zutuanxue.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-svc
          servicePort: 80
          
官方参考文档：https://kubernetes.github.io/ingress-nginx/examples/auth/basic/
```

**创建完成后，我们来看一下相关的信息：**

![97.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331637455.png)

**因为是重复使用的 aaa.zutuanxue.com 的信息，所以可以看到，域名是 “eee” 的，但是内容是 “aaa” 的。**

![98.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331678070.png)

**Nginx 重定向：**

|                      名称                      |                             描述                             |  值  |
| :--------------------------------------------: | :----------------------------------------------------------: | :--: |
|   nginx.ingress.kubernetes.io/rewrite-target   |                   必须重定向流量的目标URI                    |  串  |
|    nginx.ingress.kubernetes.io/ssl-redirect    | 指示位置部分是否仅可访问SSL（当Ingress包含证书时默认为True） | 布尔 |
| nginx.ingress.kubernetes.io/force-ssl-redirect |          即使Ingress未启用TLS，也强制重定向到HTTPS           | 布尔 |
|      nginx.ingress.kubernetes.io/app-root      |  定义Controller必须重定向的应用程序根，如果它在’/'上下文中   |  串  |
|     nginx.ingress.kubernetes.io/use-regex      |          指示Ingress上定义的路径是否使用正则表达式           | 布尔 |

```
vim rewrite-ingress-nginx-svc.yaml

apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: nginx-rewrite
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: https://eee.zutuanxue.com:31434
spec:
  rules:
  - host: fff.zutuanxue.com
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-svc
          servicePort: 80
```

我们来看一下效果：

![99.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331694901.png)

跳转到了：

![100.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602331701071.png)