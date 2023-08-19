## 一、istio分布式追踪

**官方网站：https://www.jaegertracing.io/**

```
修改 tracing 的 svc 模式由 ClusterIP 为 NodePort

kubectl edit svc tracing -n istio-system

查看 tracing 的端口

kubectl get svc -n istio-system

通过浏览器进行访问

http://IP:PORT/jaeger
```

![23.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491765466.png)

![24.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491771037.png)

![25.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491777987.png)

![26.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491787087.png)

![27.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491795646.png)

## 二、 网络可视化

```
首先，定义要用作 Kiali 用户名和密码的凭据。

KIALI_USERNAME=$(read -p 'Kiali Username: ' uval && echo -n $uval | base64)
当提示出现时输入 Kiali 用户名：

KIALI_PASSPHRASE=$(read -sp 'Kiali Passphrase: ' pval && echo -n $pval | base64)
当提示出现时输入 Kiali 密码：

运行以下命令创建 secret：

NAMESPACE=istio-system

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: kiali
  namespace: $NAMESPACE
  labels:
    app: kiali
type: Opaque
data:
  username: $KIALI_USERNAME
  passphrase: $KIALI_PASSPHRASE
EOF

修改 kiali 的 svc 模式由 ClusterIP 为 NodePort

kubectl edit svc kiali -n istio-system

查看 kiali 的端口

kubectl get svc -n istio-system

通过浏览器进行访问

http://IP:PORT
```