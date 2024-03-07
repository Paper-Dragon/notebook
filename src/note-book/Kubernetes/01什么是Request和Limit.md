# 什么是Requests和Limits

一个问题是K8s里在定义容器资源时候的Request和Limit有啥联系和区别。

就是字面上的意思，request里定义的是k8s必须要保证的启动资源，limit是将来容器运行可能使用的资源上限。

Kube-scheduler通过request的定义来寻找一个可以满足需求的node，从而在node上启动对应的pod里所用的容器；但是容器运行之后因为业务的增长是可以使用超过request的资源的，但是最高只能用到limit里定义的资源，但是limit里定义的资源k8s是不能给确保提供的。

![img](Request和Limit.assets/v2-8ef5fd1752ab31d50e3039efc9b17e6f_720w.jpg)

- https://zhuanlan.zhihu.com/p/513490855