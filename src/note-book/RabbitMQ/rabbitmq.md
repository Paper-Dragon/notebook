# 大型网站高并发架构-RabbitMQ消息队列



## 消息队列/中间件

![image-20211120102031495](rabbitmq.assets\image-20211120102031495.png)

## RabbitMQ详解

### 传递模式

消息队列中间件有**两种传递模式**：【点对点 安全】 和 【发布/订阅(Pub/Sub)分支模式 并发】
 点对点依靠队列的原理；发布/订阅则可以用于一对多的广播

### 中间件作用

消息中间件的作用：解耦、冗余(存储)、扩展性、削峰、可恢复性、顺序保证、缓冲、异步通信

### RabbitMQ的具体特点

 可靠性，持久化、传输确认、发布确认
 灵活的路由，多个交换器可以绑定
 扩展性，可以组成集群
 高可用性，队列镜像
 多种协议，AMPQ，STOMP,MQTT
 多语言客户端，支持所有常用语言
 管理界面
 插件机制



### AMQP

![image-20211120103710289](rabbitmq.assets\image-20211120103710289.png)



### 应用场景

![image-20211120103801764](rabbitmq.assets\image-20211120103801764.png)

### 同类产品

![image-20211120103405952](rabbitmq.assets\image-20211120103405952.png)

![image-20211120103340249](rabbitmq.assets\image-20211120103340249.png)

![image-20211120103610159](rabbitmq.assets\image-20211120103610159.png)

### 架构

![image-20211120104154618](rabbitmq.assets\image-20211120104154618.png)

### 常用术语

- Message：消息，包含消息头（即附属的配置信息）和消息体（即消息的实体内容），消息体是不透明的，能看清路由键（routing-key）、优先级（priority）、持久性存储（delivery-mode）等
- Publisher：生产者（produce），向交换机发布消息的主体
- Exchange：交换机，用来接收生产者发送的消息并将这些消息路由给服务器中的队列（常见三种交换机模型 **direct** 发布和订阅，完全匹配   **fanout**广播，所有订阅广播 **topic**话题：规则匹配）
- Binding：绑定，用于**给Exchange和Queue建立关系**，就是我们熟知的配对的红娘
- Queue：消息队列，用来保存消息直到发送给消费者。它是**消息的容器**，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。
- Virtual Host: **虚拟主机{exchange + queue + message}**，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个  vhost 本质上就是一个 mini 版的 RabbitMQ 服务器，拥有自己的队列、交换器、绑定和权限机制。vhost 是 AMQP  概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是
- Broker：消息队列{RebbitMQ}服务器实体，可以理解为在Linux上创建的虚拟机实体
- Connection：连接：可以理解为，broker和app服务建立的TCP连接
- Channel：信道，MQ与外部打交道都是通过Channel来的，发布消息、订阅队列还是接收消息，这些动作都是通过Channel完成；简单来说就是消息通过Channel塞进队列或者流出队列{一条TCP连接包含多条channel}：tcp一旦打开就会创建AMQP信道
- Consumer：消费者，从消息队列中获取消息的主体



## 单机部署RabbitMQ





























## RabbitMQ集群部署 普通集群

**1. 环境信息**

| 主机名    | 操作系统版本                         | IP地址        | 安装软件                                   |
| --------- | ------------------------------------ | ------------- | ------------------------------------------ |
| rabbitmq1 | CentOS Linux release 7.6.1810 (Core) | 172.16.100.34 | haproxy-1.5.14                             |
| rabbitmq2 | CentOS Linux release 7.6.1810 (Core) | 172.16.100.21 | erlang、rabbitmq-server-3.5.0-1.noarch.rpm |
| rabbitmq3 | CentOS Linux release 7.6.1810 (Core) | 172.16.100.35 | erlang、rabbitmq-server-3.5.0-1.noarch.rpm |

【环境说明】:集群中有3台机器，console主机作为反向代理，另外两台是rabbitmq server，一台使用磁盘模式，一台使用内存模式。

【注意】:请确保两台rabbitmq server主机的/etc/hosts里有ip地址和主机名的对应关系。如：

vim /etc/hosts

```bash
172.16.100.34 rabbitmq1
172.16.100.21 rabbitmq2
172.16.100.35 rabbitmq3
```

**2. 集群每个节点安装rabbitmq server**

log1和log2分别安装rabbitmq server。

（1）配置好epel源

```bash
[root@rabbitmq2 rabbitmq]# cat /etc/yum.repos.d/rabbitmq.repo 
# In /etc/yum.repos.d/rabbitmq.repo

##
## Zero dependency Erlang
##

[rabbitmq_erlang]
name=rabbitmq_erlang
baseurl=https://packagecloud.io/rabbitmq/erlang/el/7/$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
# PackageCloud's repository key and RabbitMQ package signing key
gpgkey=https://packagecloud.io/rabbitmq/erlang/gpgkey
       https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[rabbitmq_erlang-source]
name=rabbitmq_erlang-source
baseurl=https://packagecloud.io/rabbitmq/erlang/el/7/SRPMS
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packagecloud.io/rabbitmq/erlang/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

##
## RabbitMQ server
##

[rabbitmq_server]
name=rabbitmq_server
baseurl=https://packagecloud.io/rabbitmq/rabbitmq-server/el/7/$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
# PackageCloud's repository key and RabbitMQ package signing key
gpgkey=https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey
       https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[rabbitmq_server-source]
name=rabbitmq_server-source
baseurl=https://packagecloud.io/rabbitmq/rabbitmq-server/el/7/SRPMS
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300
```

（2）安装依赖包

```bash
[root@log1 local]# yum install erlang –y
```

（3）安装rabbitMq

```bash'
[root@log1 local]# yum install rabbitmq-server-3.7.13
```

（4）添加开机启动

```bash
[root@log1 local]# chkconfig rabbitmq-server on
```

（5）启动

```html
[root@log1 local]# service rabbitmq-server start
Starting rabbitmq-server: SUCCESS
rabbitmq-server.
```

（6）开启web管理界面

```html
[root@log1 local]# rabbitmq-plugins enable rabbitmq_management
The following plugins have been enabled:
  mochiweb
  webmachine
  rabbitmq_web_dispatch
  amqp_client
  rabbitmq_management_agent
  rabbitmq_management
Applying plugin configuration to rabbit@log1... started 6 plugins.
```

（7）修改配置文件

```bash
[root@log1 local]# cp /usr/share/doc/rabbitmq-server-3.5.0/rabbitmq.config.example /etc/rabbitmq/rabbitmq.config
```

修改用户配置 让其可以通过远程访问 不限于localhost。注意：rabbitmq从3.3.0开始禁止使用guest/guest权限通过除localhost外的访问。

```erlang
[root@log1 local]# vim /etc/rabbitmq/rabbitmq.config

```

{loopback_users, []} 删除前面的注释%%，同时注意后面的逗号，只有一个配置项的时候，请删除后面的逗号。

![img](rabbitmq.assets\1132141-20170716161340457-1049750179.png)

**以上7步在log2主机上都要执行**

（8）因为默认用户为guest，要添加其他的管理账户

**注意:如果是集群的话，只要在一台主机设置即可，其它会自动同步。**

```html
[root@log1 local]# rabbitmqctl add_user zxadmin wisedu@2016
Creating user "zxadmin" ...
[root@rabbitmq1 rabbitmq]# rabbitmqctl set_user_tags zxadmin administrator
Setting tags for user "zxadmin" to [administrator] ...
[root@rabbitmq1 rabbitmq]# rabbitmqctl add_vhost  xvnizhuji
Adding vhost "xvnizhuji" ...
[root@rabbitmq1 rabbitmq]# rabbitmqctl set_permissions -p xvnizhuji zxadmin  ".*" ".*" ".*"
Setting permissions for user "zxadmin" in vhost "xvnizhuji" ...

```

（9）重启rabbitMQ

```html
[root@log1 local]# service rabbitmq-server restart
Restarting rabbitmq-server: SUCCESS
rabbitmq-server.
```

（10）访问管控台

浏览器输入URL：http://ip/15672

![image-20211120195905026](rabbitmq.assets\image-20211120195905026.png)



**3. 设置每个节点Cookie**

Rabbitmq的集群是依赖于erlang的集群来工作的，所以必须先构建起erlang的集群环境。Erlang的集群中各节点是通过一个magic cookie来实现的，这个cookie存放在  /var/lib/rabbitmq/.erlang.cookie  中，文件是400的权限。所以必须保证各节点cookie保持一致，否则节点之间就无法通信。

![img](rabbitmq.assets\1132141-20170716161835644-1187328631.png)

将其中一台节点上的.erlang.cookie值复制下来保存到其他节点上。或者使用scp的方法也可，但是要注意文件的权限和属主属组。我这里将log1中的cookie 复制到log2中。

（1）因为.erlang.cookie是只读的，先修改下log2中的.erlang.cookie权限

```html
[root@log2 rabbitmq]# chmod 777 .erlang.cookie
```

（2）copy log1主机上的.erlang.cookie到log2主机/var/lib/rabbitmq/目录下

```html
[root@log1 rabbitmq]# scp -p .erlang.cookie root@114.55.29.241:/var/lib/rabbitmq/
```

（3）停止所有节点RabbitMq服务，然后使用detached参数独立运行，这步很关键，尤其增加节点停止节点后再次启动遇到无法启动都可以参照这个顺序。

```html
[root@log1 rabbitmq]# service rabbitmq-server restart
[root@log2 rabbitmq]# service rabbitmq-server restart
```

```bash
rabbitmq2和rabbitmq3執行  rabbitmqctl stop # 關的不是服務，是集群功能


[root@rabbitmq2 ~]# rabbitmqctl stop
Stopping and halting node rabbit@rabbitmq2 ...

```



```bash
[rabbitmq2和rabbitmq3執行]# rabbitmq-server -detached
Warning: PID file not written; -detached was passed.


# 添加同步賬戶
rabbitmqctl add_user admin admin # 添加賬戶密碼
rabbitmqctl set_user_tags zxadmin administrator # 設置賬號標簽【權限】
rabbitmqctl set_permissions -p / admin  ".*" ".*" ".*" # 授權虛擬主機權限


```

（4）分别查看下每个节点

```html
[root@rabbitmq1 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@rabbitmq1 ...
[{nodes,[{disc,[rabbit@rabbitmq1]}]},
 {running_nodes,[rabbit@rabbitmq1]},
 {cluster_name,<<"rabbit@rabbitmq1">>},
 {partitions,[]},
 {alarms,[{rabbit@rabbitmq1,[]}]}]
[root@log2 rabbitmq]# rabbitmqctl cluster_status
```

（5）将rabbitmq2/rabbitmq3作为内存节点与rabbitmq1连接起来，在rabbitmq2/rabbitmq3上执行如下命令：

rabbitmq-server启动时，会一起启动节点和应用，它预先设置rabbitmq应用为{standlone}脱机模式，要将一个节点加入到现有集群中，你需要停止这个应用，并将节点设置为原始状态，如果使用rabbitmqctl stop ，应用和节点将会都关闭，所以使用rabbitmqctl stop_app仅仅关闭应用

```bash
    [root@log2 rabbitmq]# rabbitmqctl stop_app
    [root@log2 rabbitmq]# rabbitmqctl join_cluster  rabbit@rabbitmq1  # --ram
    [root@log2 rabbitmq]# rabbitmqctl start_app
```



上述命令先停掉rabbitmq应用，然后调用cluster命令，将log2连接到log1，使两者成为一个集群，最后重启log2的rabbitmq应用。在这个cluster命令下，log2是内存节点，log1是磁盘节点（RabbitMQ启动后，默认是磁盘节点）。

log1如果要使log2在集群里也是磁盘节点，join_cluster 命令去掉--ram参数即可：

```html
[root@log2 rabbitmq]# rabbitmqctl join_cluster rabbit@rabbitmq1
```

只要在节点列表里包含了自己，它就成为一个磁盘节点。在RabbitMQ集群里，必须至少有一个磁盘节点存在。

（6）再次查看各节点状态

```bash
[root@rabbitmq1 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@rabbitmq1 ...
[{nodes,[{disc,[rabbit@rabbitmq1,rabbit@rabbitmq2,rabbit@rabbitmq3]}]},
 {running_nodes,[rabbit@rabbitmq3,rabbit@rabbitmq2,rabbit@rabbitmq1]},
 {cluster_name,<<"rabbit@rabbitmq1">>},
 {partitions,[]},
 {alarms,[{rabbit@rabbitmq3,[]},{rabbit@rabbitmq2,[]},{rabbit@rabbitmq1,[]}]}]

[root@rabbitmq2 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@rabbitmq2 ...
[{nodes,[{disc,[rabbit@rabbitmq1,rabbit@rabbitmq2,rabbit@rabbitmq3]}]},
 {running_nodes,[rabbit@rabbitmq3,rabbit@rabbitmq1,rabbit@rabbitmq2]},
 {cluster_name,<<"rabbit@rabbitmq1">>},
 {partitions,[]},
 {alarms,[{rabbit@rabbitmq3,[]},{rabbit@rabbitmq1,[]},{rabbit@rabbitmq2,[]}]}]

[root@rabbitmq3 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@rabbitmq3 ...
[{nodes,[{disc,[rabbit@rabbitmq1,rabbit@rabbitmq2,rabbit@rabbitmq3]}]},
 {running_nodes,[rabbit@rabbitmq1,rabbit@rabbitmq2,rabbit@rabbitmq3]},
 {cluster_name,<<"rabbit@rabbitmq1">>},
 {partitions,[]},
 {alarms,[{rabbit@rabbitmq1,[]},{rabbit@rabbitmq2,[]},{rabbit@rabbitmq3,[]}]}]


```

这样RabbitMQ集群就正常工作了。可以访问任意一个web管控台：http://ip/15672

![img](rabbitmq.assets\1132141-20170716162446660-215618095.png)



## 镜像集群 RabbbitMQ+HAproxy

上面配置RabbitMQ默认集群模式，但并不保证队列的高可用性，尽管交换机、绑定这些可以复制到集群里的任何一个节点，但是队列内容不会复制，虽然该模式解决一部分节点压力，但队列节点宕机直接导致该队列无法使用，只能等待重启，所以要想在队列节点宕机或故障也能正常使用，就要复制队列内容到集群里的每个节点，需要创建镜像队列。

（1）安装haproxy

haproxy是在主机名为console上安装的。可以选择源代码编译安装或者yum安装，在这里我选择了yum安装。安装版本：haproxy-1.5.14-3.el7.x86_64

```html
[root@console ~]# yum install -y haproxy
```

（2）修改配置/etc/haproxy/haproxy.cfg

```html
[root@console ~]# vim /etc/haproxy/haproxy.cfg
```

删除 main frontend which proxys to the backends以下的所有内容，并添加

```html
listen rabbitmq_cluster 0.0.0.0:5672
   mode tcp
   balance roundrobin
   server   rqslave1 114.55.29.241:5672 check inter 2000 rise 2 fall 3
   server   rqmaster 114.55.29.86:5672 check inter 2000 rise 2 fall 3
```

如果有3台或3台以上，可以把disc节点注释掉，原因就是让rabbitmq性能最佳化。这样负载均衡器会监听5672端口，轮询多个内存节点的5672端口，磁盘节点可以只做备份不提供给生产者、消费者使用，当然如果我们服务器资源充足情况也可以配置多个磁盘节点。此外，还需要修改defaults段配置：

![img](https://images2015.cnblogs.com/blog/1132141/201707/1132141-20170716162835488-2106179332.png)

检查配置文件语法：

```html
[root@console ~]# haproxy -c -f /etc/haproxy/haproxy.cfg
```

启动haproxy：

```html
[root@console ~]# service haproxy start
Redirecting to /bin/systemctl start  haproxy.service
```

（3）配置策略：设置ha模式

使用Rabbit镜像功能，需要基于rabbitmq策略来实现，政策是用来控制和修改群集范围的某个vhost队列行为和Exchange行为。 其中ha-mode有三种模式:

- all: 同步至所有的；
- exactly: 同步最多N个机器. 当现有集群机器数小于N时,同步所有,大于等于N时则不进行同步. N需要额外通过ha-params来指定；
- nodes: 只同步至符合指定名称的nodes. N需要额外通过ha-params来指定。

在cluster中任意节点启用策略，策略会自动同步到集群节点。我这里设置的是同步全部的queue, 可以按需自己选择指定的queue。语法：

```html
rabbitmqctl set_policy  [-p  vhostpath ] { name } { pattern } { definition } [ priority ]
```

在log1主机上执行如下命令：

```html
[root@log1 ~]# rabbitmqctl set_policy ha-all "^" '{"ha-mode":"all"}'
```

这行命令创建了一个策略，策略名称为ha-all,策略模式为 all ，即复制到所有节点，包含新增节点，策略正则表达式为 “^” 表示所有匹配所有队列名称。

![image-20211120213908198](rabbitmq.assets\image-20211120213908198.png)

**5. 集群退出**

假设要把log2退出集群。 在log2上执行：

```html
#rabbitmqctl stop_app
#rabbitmqctl reset
#rabbitmqctl start_app
```

在集群主节点上执行：

```html
# rabbitmqctl forget_cluster_node rabbit@log2
```





## 问题反馈