## 一、Pod 的资源控制器类型

什么是控制器呢？简单来说，控制器就好比是影视剧里面的剧本，演员会根据剧本所写的内容来针对不同的角色进行演绎，而我们的控制器就好比是剧本，Kubernetes 会根据我们所定义的规则，或者是按照我们写好的 “剧本” 来完成创建我们的 Pod 。

**控制器类型**

1. **ReplicationController 与 ReplicaSet**

	Replicationcontroller (RC) 用来确保容器应用的副本数始终保持在用户定义的副本数，即如果有容器异常退出，会自动创建新的 Pod 来替代，而如果异常多出来的容器也会自动回收。

	在新版本的 Kubernetes 中建议使用 Replicaset 来取代 ReplicationController . Replicaset 跟ReplicationController 没有本质的不同，只是名字不一样，并且 Replicaset 支持集合式的 selector。

2. **Deployment**

	 Deployment 为 Pod 和 Replicaset 提供了一个声明式定义 declarative 方法，用来替代以前的ReplicationController 来方便的管理应用。

3. **DaemonSet**

	 DoernonSet 确保全部(或者一些) Node 上运行一个 Pod 的副本，当有 Node 加入集群时，也会为他们新增一个 Pod，当有 Node 从集群移除时，这些 Pod 也会被回收。删除 DaemonSet 将会删除它创建的所有Pod。

4. **StateFulSet（适用于有状态服务）**

	 StatefulSet 作为 Controller 为 Pod 提供唯-的标识。 它可以保证部署和 scale 的顺序
	StatefulSet 是为了解决有状态服务的问题(对应 Deployments 和 ReplicaSets 是为无状态服务而设计)。

5. **Job 与 cronJob**

	 Job 负责批处理任务，即仅执行一次的任务，它保证批处理任务的一个或多个 Pod 成功结束， Cron Job 管理基于时间的 Job ，其作用与计划任务类似。

6. **Horizontal Pod Autoscaling**

	 应用的资源使用率通常都有高峰和低谷的时候，如何削峰填谷，提高集群的整体资源利用率，让 service 中的 Pod 个数自动调整呢？这就有赖于 Horizontal Pod Autoscaling 了，顾名思义，使 Pod 水平自动缩放