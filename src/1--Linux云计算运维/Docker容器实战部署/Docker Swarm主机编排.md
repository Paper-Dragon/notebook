## 一、 什么是Docker Swarm

Swarm 是 Docker 公司推出的用来管理 docker 集群的平台，几乎全部用GO语言来完成的开发的，代码开源在https://github.com/docker/swarm， 它是将一群 Docker 宿主机变成一个单一的虚拟主机，Swarm 使用标准的 Docker API 接口作为其前端的访问入口，换言之，各种形式的Docker Client (compose,docker-py等) 均可以直接与 Swarm 通信，甚至 Docker 本身都可以很容易的与 Swarm 集成，这大大方便了用户将原本基于单节点的系统移植到 Swarm 上，同时 Swarm 内置了对 Docker 网络插件的支持，用户也很容易的部署跨主机的容器集群服务。

Docker Swarm 和 Docker Compose 一样，都是 Docker 官方容器编排项目，但不同的是，Docker Compose 是一个在单个服务器或主机上创建多个容器的工具，而 Docker Swarm 则可以在多个服务器或主机上创建容器集群服务，对于微服务的部署，显然 Docker Swarm 会更加适合。

从 Docker 1.12.0 版本开始，Docker Swarm 已经包含在 Docker 引擎中（docker swarm），并且已经内置了服务发现工具，我们就不需要像之前一样，再配置 Etcd 或者 Consul 来进行服务发现配置了。

Swarm deamon 只是一个调度器(Scheduler)加路由器(router), Swarm 自己不运行容器，它只是接受 Docker 客户端发来的请求，调度适合的节点来运行容器，这就意味着，即使 Swarm 由于某些原因挂掉了，集群中的节点也会照常运行，当 Swarm 重新恢复运行之后，他会收集重建集群信息。

## 二、 Swarm的几个关键概念

**Swarm**
集群的管理和编排是使用嵌入docker引擎的SwarmKit，可以在docker初始化时启动swarm模式或者加入已存在的swarm

**Node**
一个节点是docker引擎集群的一个实例。您还可以将其视为Docker节点。您可以在单个物理计算机或云服务器上运行一个或多个节点，但生产群集部署通常包括分布在多个物理和云计算机上的Docker节点。
要将应用程序部署到swarm，请将服务定义提交给 管理器节点。管理器节点将称为任务的工作单元分派 给工作节点。
Manager节点还执行维护所需群集状态所需的编排和集群管理功能，Manager节点选择单个领导者来执行编排任务，工作节点接收并执行从管理器节点分派的任务。默认情况下，管理器节点还将服务作为工作节点运行，但您可以将它们配置为仅运行管理器任务并且是仅管理器节点。代理程序在每个工作程序节点上运行，并报告分配给它的任务。工作节点向管理器节点通知其分配的任务的当前状态，以便管理器可以维持每个工作者的期望状态。

**Service**
一个服务是任务的定义，管理机或工作节点上执行。它是群体系统的中心结构，是用户与群体交互的主要根源。创建服务时，你需要指定要使用的容器镜像。

**Task**
任务是在docekr容器中执行的命令，Manager节点根据指定数量的任务副本分配任务给worker节点

## 三、相关命令

```
docker swarm：
	集群管理，子命令有init, ``join``, leave, update。（docker swarm --help查看帮助）

docker service：
	服务创建，子命令有create, inspect, update, remove, tasks。（docker service--help查看帮助）

docker node：
	节点管理，子命令有accept, promote, demote, inspect, update, tasks, ``ls``, ``rm``。
（docker node --help查看帮助）
```

## 四、swarm集群部署

### 4.1、 部署前准备

```
以下操作在所有节点上进行：

| IP地址         | 计算机名          | 角色          |
| ------------- | ----------- ---- | ------------ |
| 192.168.1.150 | zutuanxue-manage01 | swarm_manager |
| 192.168.1.151 | zutuanxue-node-1   | swarm_node    |
| 192.168.1.152 | zutuanxue-node-2   | swarm_node    |

安装 docker

hosts 解析

[root@zutuanxue-manage01 ~]# cat /etc/hosts

192.168.1.150 zutuanxue-manage01
192.168.1.151 zutuanxue-node-1
192.168.1.152 zutuanxue-node-2

[root@zutuanxue-manage01 ~]# systemctl disable firewalld
[root@zutuanxue-manage01 ~]# systemctl stop firewalld
[root@zutuanxue-manage01 ~]# iptables -F

关闭 selinux

#设置为 disabled 后需要重启计算机生效
SELINUX=disabled
```

### 4.2、 创建swarm集群

```
初始化集群-init

[root@zutuanxue-manage01 ~]# docker swarm init --advertise-addr 192.168.1.150

#--advertise-addr参数表示其它swarm中的worker节点使用此ip地址与manager联系


Swarm initialized: current node (dh6qthwwctbrl0y3hx1k41icl) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-0vdbyxq80uk8sf9nlnahsnkv6w3gaf5necl992ia0g8dmc5x8c-bkenoigc7kwizoch08r3fc4wq 192.168.1.150:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

### 4.3、添加worker（node工作节点）到swarm

```
[root@zutuanxue-node-1 ~]# docker swarm join --token SWMTKN-1-0vdbyxq80uk8sf9nlnahsnkv6w3gaf5necl992ia0g8dmc5x8c-bkenoigc7kwizoch08r3fc4wq 192.168.1.150:2377
This node joined a swarm as a worker.

[root@zutuanxue-node-2 ~]# docker swarm join --token SWMTKN-1-0vdbyxq80uk8sf9nlnahsnkv6w3gaf5necl992ia0g8dmc5x8c-bkenoigc7kwizoch08r3fc4wq 192.168.1.150:2377
This node joined a swarm as a worker.
```

### 4.4、 验证加入情况

```
 [root@zutuanxue-manage01 ~]# docker node ls
```

### 4.5、 在Swarm中部署服务(nginx为例)

```
创建网络在部署服务
# 创建网络
[root@zutuanxue-manage01 ~]# docker network create -d overlay nginx_net
a52jy33asc5o0ts0rq823bf0m

[root@zutuanxue-manage01 ~]# docker network ls | grep nginx_net
a52jy33asc5o        nginx_net           overlay             swarm
 
# 部署服务
[root@zutuanxue-manage01 ~]# docker service create --replicas 1 --network nginx_net --name my_nginx -p 80:80 nginx    # 就创建了一个具有一个副本（--replicas 1 ）的nginx服务，使用镜像nginx

olexfmtdf94sxyeetkchwhehg
overall progress: 1 out of 1 tasks
1/1: running   [==================================================>]
verify: Service converged

在 manager与node 节点上使用上面这个覆盖网络创建 nginx 服务
其中，--replicas 参数指定服务由几个实例组成
注意：不需要提前在节点上下载 nginx 镜像，这个命令执行后会自动下载这个容器镜像

# 使用 docker service ls 查看正在运行服务的列表
[root@zutuanxue-manage01 ~]# docker service ls
ID                  NAME                MODE                REPLICAS            IMAGE               PORTS
olexfmtdf94s        my_nginx            replicated          1/1                 nginx:latest        *:80->80/tcp
 
2) 查询Swarm中服务的信息 -pretty 使命令输出格式化为可读的格式，不加 --pretty 可以输出更详细的信息：

[root@zutuanxue-manage01 ~]# docker service inspect --pretty my_nginx

ID:             zs7fw4ereo5w7ohd4n9ii06nt
Name:           my_nginx
Service Mode:   Replicated
 Replicas:      1
Placement:
UpdateConfig:
 Parallelism:   1
 On failure:    pause
 Monitoring Period: 5s
 Max failure ratio: 0
 Update order:      stop-first
RollbackConfig:
 Parallelism:   1
 On failure:    pause
 Monitoring Period: 5s
 Max failure ratio: 0
 Rollback order:    stop-first
ContainerSpec:
 Image:         nginx:latest@sha256:b73f527d86e3461fd652f62cf47e7b375196063bbbd503e853af5be16597cb2e
 Init:          false
Resources:
Networks: nginx_net
Endpoint Mode:  vip
Ports:
 PublishedPort = 80
  Protocol = tcp
  TargetPort = 80
  PublishMode = ingress
  
# 查询到哪个节点正在运行该服务
[root@zutuanxue-manage01 ~]# docker service ps my_nginx


在 Swarm 中动态扩展服务 (scale) 当然，如果只是通过 service 启动容器，swarm 也算不上什么新鲜东西了。Service 还提供了复制（类似 kubernetes 里的副本）功能。可以通过 docker service scale 命令来设置服务中容器的副本数，比如将上面的 my_nginx 容器动态扩展到 4 个

[root@manager43 ~]# docker service scale my_nginx=4
my_nginx scaled to 4
overall progress: 4 out of 4 tasks
1/4: running   [==================================================>]
2/4: running   [==================================================>]
3/4: running   [==================================================>]
4/4: running   [==================================================>]
verify: Service converged
 
和创建服务一样，增加 scale 数之后，将会创建新的容器，这些新启动的容器也会经历从准备到运行的过程，过一分钟左右，服务应该就会启动完成，这时候可以再来看一下 nginx 服务中的容器

[root@manager43 ~]# docker service ps my_nginx


升级镜像/升级业务/回滚业务
docker service update --image nginx:new my_nginx

删除服务
[root@manager43 ~]# docker service rm my_nginx
```