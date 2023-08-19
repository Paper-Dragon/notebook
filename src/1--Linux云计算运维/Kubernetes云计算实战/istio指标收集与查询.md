## 一、istio指标收集与查询

### 1、通过 Prometheus 查询度量指标

```
采集新的指标

应用配置新指标的 YAML 文件，该指标将由 Istio 自动生成和采集

kubectl apply -f metrics.yaml

修改 prometheus 的 svc 模式由 ClusterIP 为 NodePort

kubectl edit svc prometheus -n istio-system

查看 prometheus 的端口

kubectl get svc -n istio-system

通过浏览器进行访问

http://IP:PORT

上述链接打开 Prometheus 并执行对 istio_double_request_count 指标值的查询语句

因为没有数据，我们通过下列命令模拟产生数据，随便打开一个终端，执行以下命令

watch -n 1 curl -o /dev/null -s -w %{http_code} http://182.61.167.80:31380/productpage

其他查询：

请求 productpage 服务的总次数：

istio_requests_total{destination_service="productpage.default.svc.cluster.local"}

请求 reviews 服务 V3 版本的总次数：

istio_requests_total{destination_service="reviews.default.svc.cluster.local", destination_version="v3"}

该查询返回所有请求 reviews 服务 v3 版本的当前总次数。

过去 5 分钟 productpage 服务所有实例的请求频次：

rate(istio_requests_total{destination_service=~"productpage.*", response_code="200"}[5m])
```

![13.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491623709.png)

![14.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491631556.png)

![15.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491639376.png)

![16.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491645968.png)

### 2、使用 Grafana 可视化指标

```
修改 grafana 的 svc 模式由 ClusterIP 为 NodePort

kubectl edit svc grafana -n istio-system

查看 grafana 的端口

kubectl get svc -n istio-system

通过浏览器进行访问

http://IP:PORT
```

![17.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491655036.png)

![18.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491662130.png)

![19.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491669091.png)

![20.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491675884.png)

![21.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491682601.png)

![22.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602491690656.png)