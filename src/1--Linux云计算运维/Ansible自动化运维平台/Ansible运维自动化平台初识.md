## 一、运维自动化平台介绍

### 1.1、自动化运维平台介绍

运维自动化平台是由管理机器[S]和业务机器[C]组成的,C/S。

管理机器：任务定制及发布；

业务机器：接收任务并执行任务。

![运维自动化平台组成.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601965978453.png)

### 1.2、运维自动化平台的优势：

- 一次性任务定制：任务一次性发布给所有机器
- 节省任务执行时间：任务主机并发完成任务，节省部署时间
- 错误率低：避免重复，保证一次任务定制准确即可

## 二、常见的自动化运维工具

### 2.1、常见的运维自动化工具

- **Puppet**
- **Ansible**
- **SaltStack**

```
puppet：
基于Ruby开发，有产品线已经在用，优点是历史悠久，比较成熟，在可远程可本地，功能强劲，批量执行需要写专门的配置文件，费力费时。而且有客户端在，和授权系统结合比较麻烦。

saltstack:
saltstack和ansible都是python流的，而且就功能上来讲，两者也极为相似，不同之处是salt stack是有客户端的，并且execution模块还用0MQ实现了pub-sub，命令和执行结果因此可以高效并行传输，不过成也萧何败也萧何，第一个sub阶段（将querystring下发到所有机器，然后收集机器响应的阶段）太依赖与客户端返回了，如果客户端未能及时返回或未响应的话，playbook执行阶段可能会直接漏掉这部分机器而没有任何提示，这对于运维来说是不可接受的。

ansible:
与前两者比起来，在特性上似乎并不抢眼，配置管理方面（playbook）绝对比不过老大哥puppet，批量执行方面也只是多线程，不像saltstack那么高大上，不过ansible搜索热度高出saltstack三倍多，显然靠的不是吹牛，至少，ansible至少不会悄悄的丢机器，这给了我们一个定心丸，而且仅依赖ssh，与登录授权管理系统天然集成，简单即有效，没有比这更美妙的事情了。
```

### 2.2、ansible介绍

ansible是一种由Python开发的自动化运维工具，集合了众多运维工具（puppet、cfengine、chef、func、fabric）的优点，实现了批量系统配置、批量程序部署、批量运行命令等功能。**ansible是基于模块工作的，本身没有批量部署的能力**。**真正具有批量部署的是ansible所运行的模块，ansible只是提供一种框架**。主要包括：

1. 连接插件connection plugins：负责和被监控端实现通信；**ansible管理端和客户端基于ssh协议通信**
2. host inventory：指定操作的主机，是一个配置文件里面定义监控的主机；**提供主机管理列表，定义管理谁**
3. 各种模块核心模块、command模块、自定义模块；**提供了日常模块**
4. 借助于插件完成记录日志邮件等功能； **根据需求后续添加模块，邮件、日志模块**
5. playbook：剧本执行多个任务时，非必需可以让节点一次性运行多个任务。**一次发布多条指令给客户端**

**特性**

1. no agents：不需要在被管控主机上安装任何客户端；
2. no server：无服务器端，使用时直接运行命令即可；
3. modules in any languages：基于模块工作，可使用任意语言开发模块；
4. yaml，not code：使用yaml语言定制剧本playbook；
5. ssh by default：基于SSH工作；
6. strong multi-tier solution：可实现多级指挥。

**优点**

1. 轻量级，无需在客户端安装agent，更新时，只需在操作机上进行一次更新即可；
2. 批量任务执行可以写成脚本，而且不用分发到远程就可以执行；
3. 使用python编写，维护更简单，ruby语法过于复杂；
4. 支持sudo

**基本架构**

![ansible3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601966026674.png)

```
· 核心引擎：即ansible
· 核心模块（core modules）：这些都是ansible自带的模块，ansible模块资源分发到远程节点使其执行特定任务或匹配一个特定的状态。
· 自定义模块（custom modules）：如果核心模块不足以完成某种功能，可以添加自定义模块。
· 插件（plugins）：完成模块功能的补充，借助于插件完成记录日志、邮件等功能
· 剧本（playbook）：定义ansible任务的配置文件，可以将多个任务定义在一个剧本中，由ansible自动执行，剧本执行支持多个任务，可以由控制主机运行多个任务，同时对多台远程主机进行管理。
· playbook是ansible的配置、部署和编排语言，可以描述一个你想要的远程系统执行策略，或一组步骤的一般过程。如果ansible模块作为你的工作室工具，playbook就是设计方案。在基本层面上，剧本可以用于管理配置和部署远程机器。在更高级的应用中，可以序列多层应用及滚动更新，并可以把动作委托给其他主机，与监控服务器和负载平衡器交互。
· 连接插件（connection plugins）：ansible基于连接插件连接到各个主机上，负责和被管理节点实现通信。虽然ansible是使用ssh连接到各被管理节点，但它还支持其他的连接方法，所以需要有连接插件。
· 主机清单（host inventory）：定义ansible管理的主机策略，默认是在ansible的hosts配置文件中定义被管节点，同时也支持自定义动态主机清单和指定配置文件路径。
 
```

ansible采用paramiko协议库（Fabric也使用这个，基于python开发，支持SSHV2），通过ssh或者ZeroMQ等连接主机。ansible在控制主机主机将ansible模块通过ssh协议（或者Kerberos、LDAP）推送到被管节点执行，执行完之后自动删除。控制主机与被管理节点之间支持local、SSH、ZeroMQ三种连接方式，默认使用基于SSH的连接。在规模较大的情况下使用ZeroMQ连接方式会明显改善执行速度。

## 三、ansible运行原理

ansible是如何工作的呢？我们通过一个图片来说明一下

![ansible工作原理1132928.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601966060853.png)

```
工作原理：
1、用户登录管理机器：通过ansible剧本或者单行命令针对业务机器组或者单个机器部署任务

2、管理机器读取用户的部署任务：根据自己hosts文件中定义的业务机器组查找对应的机器地址(ip或者域名)

3、管理机下发任务：管理机通过ssh免密连接业务机器，下发任务给业务机器

4、业务机器执行任务

5、业务机器将执行结果发送给ansible管理机器
	反馈字体颜色
	绿色  未发生变化
	黄色  更改生效
	红色  执行错误
```

## 四、学习视频

[视频：ansible课程介绍](https://www.bilibili.com/video/BV19J41167sM/)
[视频：自动化运维平台课程介绍](https://www.bilibili.com/video/BV19J41167sM?p=2)
[视频：自动化运维平台介绍](https://www.bilibili.com/video/BV19J41167sM?p=3)
[视频：ansible介绍](https://www.bilibili.com/video/BV19J41167sM?p=4)
[视频：ansible工作原理](https://www.bilibili.com/video/BV19J41167sM?p=5)