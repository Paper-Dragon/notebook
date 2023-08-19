为了方便在命令行下对集群、节点、pod进行管理，kubernetes官方提供了一个管理命令:kubectl

kubectl作为客户端CLI工具，可以让用户通过命令行对Kubernetes集群进行操作。

## 一、kubectl介绍

### kubectl命令行的语法：

```
kubectl   [command]   [TYPE]   [NAME]   [flags]


command：子命令，用于操作Kubernetes集群资源对象的命令，例如create、delete、describe、get、apply等

TYPE：资源对象的类型，区分大小写，能以单数、复数或简写形式表示。例如以下3种TYPE是等价的

	- kubectl   get   pod   pod-name

	- kubectl   get   pods   pod-name

	- kubectl   get   po   pod-name

NAME：资源对象的名称，区分大小写，如果不指定名称，系统将返回所有Pod的列表

flags：kubectl子命令的可选参数，比如可以使用 “-o  wide“ 来显示更多的信息
```

## 二、kubectl常用命令

- 新建资源：kubectl create -f pod.yaml

![19.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326563560.png)

- 删除资源-根据YAML文件: kubectl delete -f pod.yaml

![20.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326585774.png)

- 删除资源-根据pod名字: kubectl delete pod nginx

![21.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326600592.png)

- 删除资源-删除所有pod: kubectl delete pod --all

![22.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326653562.png)

- 查看node信息：kubectl get nodes

![23.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326678706.png)

- 查看pod信息：kubectl get pod -o wide/yaml

![24.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326699622.png)

- 查看所有信息：kubectl get all

![25.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326721496.png)

- 查看pod详细信息：kubectl describe pod nginx

![26.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326742365.png)

- 查看kube-system空间内的pod：kubectl get pod -n kube-system

![9.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326770788.png)

## 三、帮助

如果在使用命令过程中出现问题，那么我们也可以通过使用 --help来获取 kubectl 命令的使用说明：

- 获取 kubectl 的使用说明： kubectl --help
- 获取 kubectl 子命令的使用说明：kubectl get --help / kubectl delete --help
- 获取资源控制器说明： kubectl explain pod / rs / deployment / ·····