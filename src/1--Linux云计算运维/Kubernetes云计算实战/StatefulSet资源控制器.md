## 一、statefulset介绍

StatefulSet 是为了解决有状态服务的问题而设计的资源控制器。

- 匹配 Pod name ( 网络标识 ) 的模式为：(statefulset名称)-(序号)，比如上面的示例：web-0，web-1，web-2
- StatefulSet 为每个 Pod 副本创建了一个 DNS 域名，这个域名的格式为： $(podname).(headless server name)，也就意味着服务间是通过Pod域名来通信而非 Pod IP，因为当Pod所在Node发生故障时， Pod 会被飘移到其它 Node 上，Pod IP 会发生变化，但是 Pod 域名不会有变化

![141.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602333569719.png)

**删除 web-0 后查看：**

![142.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602333577229.png)



- StatefulSet 使用 Headless 服务来控制 Pod 的域名，这个域名的 FQDN 为：(service name).(namespace).svc.cluster.local，其中，“cluster.local” 指的是集群的域名

![143.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602333583439.png)

- 根据 volumeClaimTemplates，为每个 Pod 创建一个 pvc，pvc 的命名规则匹配模式：(volumeClaimTemplates.name)-(pod_name)，比如上面的 volumeMounts.name=www， Podname=web-[0-2]，因此创建出来的 PVC 是 www-web-0、www-web-1、www-web-2
- 删除 Pod 不会删除其 pvc，手动删除 pvc 将自动释放 pv

## 二、Statefulset的启停顺序

- 有序部署：部署StatefulSet时，如果有多个Pod副本，它们会被顺序地创建（从0到N-1）并且，在下一个Pod运行之前所有之前的Pod必须都是Running和Ready状态。
- 有序删除：当Pod被删除时，它们被终止的顺序是从N-1到0。
- 有序扩展：当对Pod执行扩展操作时，与部署一样，它前面的Pod必须都处于Running和Ready状态。

## 三、StatefulSet使用场景

- 稳定的持久化存储，即Pod重新调度后还是能访问到相同的持久化数据，基于 PVC 来实现。
- 稳定的网络标识符，即 Pod 重新调度后其 PodName 和 HostName 不变。
- 有序部署，有序扩展，基于 init containers 来实现。
- 有序收缩。