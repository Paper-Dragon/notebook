# 跨宿主机通信overlay和macvlay

# 前言

> 本讲是从Docker系列讲解课程，单独抽离出来的一个小节，带你一起 深入了解在编排工具出现前，跨宿主机通信的两大得力干将overlay、macvlay，这也会后期学好K8s做好基本功铺垫，打下一个坚实的基础。

# 一、overlay

> Overlay网络模式相比于桥接模式的特别之处在于，它可以自定多个--subnet子网网段，只有同一网络/段中的容器才可以相互交换信息（相互通信）。
>
> 需要注意的是如果设置了多个--subnet，也需要同步设定对应个数的--gateway网关，需要确保各子网网段不重叠。
>
> 如何查看容器的子网网段，docker insect contain_name即可，当然在docker run 容器时，也可以通过--subnet 指定子网网段 。
>
> 示例（了解范畴）：

```bash


    docker network create -d overlay\
    --subnet 192.168.0.0./16\
    --subnet 192.170.0.0./16\
     
    --gateway = 192.168.0.100\
    --gateway = 192.170.0.100\
     
    --ip-range=192.168.1.0/24\
     
    --aux-address="my-router=192.168.1.5" --aux-adress="my-switch=192.168.1.16" \
    --aux-address="my-router=192.170.1.5" --aux-adress="my-switch=192.170.1.16" \
    myoverlaynet
```

## 预告

    通过对本知识点的学习，你将掌握，通过docker create 自定义网络-d自定义网络指定为overlay 网络模式，从而实现跨宿主机通信，同时可以了解一下consul镜像的使用。

注： Consul是一个分布式、高可用性和多数据中心感知工具，用于服务发现、配置和编排。Consul 支持大规模快速部署、配置和维护面向服务的架构。欲了解更多信息，请参阅 Consul架构指南。

## 1.docker pull 拉取consul镜像，并运行容器

    docker pull consul  #拉取镜像
    docker images
    docker run -d -p 8500:8500 --name consul consul:latest  #启动sonsul容器
    netstat -nalpt  #查看端口占用情况

## 2.修改主/从节点的daemon.json，并重启docker和consul服务

### 1）修改主节点CentOS7.9

vim /etc/docker/daemon.json

注：在修改之前，你本地的这个文件可能只有一行，大概应该是仅配了（阿里）镜像加速。可参考如下配置，前两行可以不配置，使用默认的就可以。最后三行是要配的。

    {
    "graph":"/var/lib/docker",
    "storage-driver":"overlay",
    "registry-mirrors": ["https://2jdmaxpc.mirror.aliyuncs.com"],
    "cluster-store":"consul://192.168.31.100:8500",
    "cluster-advertise":"192.168.31.100:2375",
    "live-restore":true
    }

注意：修改的时候，注意引号要是英文的，除最后一行外，前面的每行尾部都有一个英文逗号（否则docker服务将无法正常启动！！）。

首行的graph是配置docker数据（镜像、容器等）默认存储位置，可以据需修改，默认位置就是/var/lib/docker，（有人习惯修改为/data/docker）。
第二行的storage-driver，是驱动模式指定为overlay。
第三行是配置的阿里云镜像仓库地址
第四行cluster-store，是配置sonsul集群的访问地址
第五行cluster-advertise，是广播通信地址和端口。

    "live-restore":true 和  –restart=always用法和意义各不相同。
    
    配置前者的意义在于即使docker的daemon守护进程关闭，其里面的容器依然保持运行，后者是指容器在docker run 启动时，佩带了该参数，则在出现故障（内存泄露等）时，自动重启容器。
    
    systemctl daemon-reload  #使daemon.json重新生效
    systemctl restart docker #重启docker
    docker ps -a   #可以看到consul的状态是Exited
    docker start consul  #再次手动启动consul容器

<http://192.168.31.100:8500> 访问consul（这个IP地址是在上面的/etc/docker/daemon.json中配置的）

### 2）修改从节点CentOS8.4

vim /etc/docker/daemon.json

有了上面配置的基础，从节点配置简单一点，其他配使用默认就可以。仅配置下面的三行。需要注意的是集群广播监听的地址cluster-advertise，要配置为从节点自己的IP。

    "cluster-store":"consul://192.168.31.100:8500",
    "cluster-advertise":"192.168.31.130:2375",
    "live-restore":true

切记：除最后一行外，每行配置末尾都有英文逗号！！！cluster-store是集群中主节点访问地址；cluster-advertise是当前节点的IP和广播端口，别误写成主节点的IP了，否则docker无法重启 ,错误如下: "systemctl status network.service" and "journalctl -xe" for details。

    systemctl daemon-reload  #使daemon.json重新生效
    systemctl restart docker #重启docker

## 3.在主节点创建overlay网络后，分别在主、从节点查看

1）创建前自定义网络前，分别查看主从节点的已有网络（便于对比效果）

docker network ls  #分别在主从节点执行该查代码

2）在master主节点CentOS7.9上创建自定义网络mynet

    #在主节点创建自定义网络：分别指定网络模式、子网网段、网关、网卡最大传输单元 ，更详细参数见：docker network create --help 
    docker network create --driver overlay --ingress --subnet=172.31.0.0/16 --gateway=172.31.0.2  --opt com.docker.network.driver.mtu=1200  mynet 
    #docker network ls

注： com.docker.network.driver.mtu 等价于--mtu，用来设置容器网卡最大传输单元

可以看到自定义网络mynet创建成功，创建时指定网络模式为overlay

提示：如果创建时错误提示Error response from daemon: error getting pools config from store: could not get pools config from store，docker start consul 重新启动容器服务即可。
3）切回从节点CentOS8.4，查看在CentOS7.9主节点创建的网络

发现，从节点CentOS8.4上，可以看到主节点创建的mynet自定义网络，而本身并没有创建这个网络，原理就是通过/etc/docker/daemon.json中的配置集群信息的集群地址cluster-store和广播cluster-advertise来实现主从共享网络的。

## 4.在主节点使用自定义的overlay网络模式启动nginx，并查看其I

    docker images 
    docker run -d --network mynet --name nginx nginx:alpine   #主节点使用自定义网络启动
    docker inspect nginx #查看网络详细信息

   主节点nginx的虚拟IP地址：172.31.0.1

## 5.在从节点上使用自定义的overlay网络模式开启tomcat，尝试和nginx互通

    docker images
    docker ps -a
    docker run -d --name tomcat --network mynet -p 8080:8080 tomcat:alpine #和主节点指定同一个网络
    ping -w 3 172.31.0.1  #尝试在从节点上去ping主节点的nginx的虚拟ip

发现，通过该方式（在/etc/docker/daemon.json中配置）是可以实现跨宿主机通信的。

注：该方式，在容器内部不能使用容器别名相互识别，也就是说A容器内部，不识别B容器的别名，尽管他们都共同链接一个网络mynet，但是仅能够通过各自的虚拟IP互通。如要实现容器内部互认别名，点进入点击进入。

## 6.在从节点上不使用自定义的overlay网络模式开启tomcat，尝试和nginx互通

    exit
    docker rm -f tomcat
    docker run -it --name tomcat  -p 8080:8080 tomcat:alpine  /bin/bash
    ping -w 3 172.31.0.1

发现从节点，在启动tomcat时不指定network为(主节点)自定义的mynet网络，也是可以ping通nginx的虚拟IP，从而实现跨宿主机通信。

## 7.扩展

    上例配置的是overlay，实验结果表明，只要在daemon.json中配置了集群的主节点和广播节点，无论子节点容器启动时，是否用--network ，从节点都可以正常访问访问主节点，从而实现了跨宿主机通信。
    
    但是，在跟随老师的课程学习中，老师的主节点、从节点的daemon.json中配置的网络模式是overlay2（见下图），老师的实验结果和我的实验结果是有出入的，也就是，当从节点的容器启动时不用--network mynet来指定和主节点同一个网络，那么在从节点中就无法实现跨宿主机通信（不能在从节点ping通主节点）。
    
    奇葩的是，按老师的配置overlay2,经过反复实验，关键的几个步骤入下：
    
    1.docker rm -f $(docker ps -qa)   #在主从节点都执行，清空容器
    
    2.vim /etc/docker/daemon.json  #把里面的overlay修改为overlay
    
    3.docker network rm mynet 
    
    4.systemctl daemon-reload 
    
    5.systemctl restart docker 
    
    ...其他步骤和上面都一致，重新创建mynet报错时，docker ps -a 看一下consul启动没，没有启动的话，启动一下。
    
    最终无法得到老师的答案，无论配置overlay2还是overlay，都可以实现跨宿主机通信，而不是老师的，只要从节点不用--network指定和主节点同一个网络，就不能实现跨宿主机通信。
    
    如果你的时间和精力允许，并且对这个点比较好奇，自己可以尝试一下，看一下我们实验结果是否一致。

注：在反复实验过程中，偶尔有一次，不带--network，在从节点的容器内部不能ping通主节点nginx的虚拟ip，奇怪的是，反复，多次实验，这个仅有1次的ping不通，竟然还原不了，每次又都能ping通了。
8.小结

    overlay网络模式，核心三步：
    
    1.修改主、从节点的daemon.json，使主从节点通过ip 集群信息关联；
    
    2.在master节点创建自定义网络mynet并指定网络模式为overlay;
    
    3.让主、从节点的容器启动时，都指定该自定义网络mynet。
    
    好处：在主节点创建overlay网络，从节点自动可以通过daemon.json获取主节点创建的自定义网络。
    
    最终，只要在daemon.json中配置好了集群信息，主节点的容器启动时，指定自定义网络mynet(创建时用-d指定为overlay或者overlay2)主从节点就可以愉快的实现跨宿主机通信。

# 二、macvlan

- Macvlan的4种模式
  - Bridge
  - Private
  - VEPA
  - Passthrough

    该模式现在用的比较少，作为了解内容可以拓展一下知识面。v

    它本身不创建网络，使用的是物理机的网卡，它会导致物理机物理网卡失效，借此会创建虚拟网卡，给虚拟网卡分配网络资源，IP等。

    macvlan这种技术能将一块物理网卡虚拟成多块虚拟网卡 ，相当于物理网卡施展了多重影分身之术 ，由一个变多个。

    弊端：可能会耗尽物理IP地址，网段内接入的物理机越多，广播的效率/性能就会下降。

    该模式，对linux系统的内核版本是有要求的，支持的版本有 v3.9-3.19 和 4.0+，比较稳定的版本推荐 4.0+。它一般是以内核模块的形式存在，我们可以通过以下方法判断当前系统是否支持：

        modprobe macvlan  #如果没有返回任何信息，代表支持
        lsmod | grep macvlan  #如果返回如下信息，代表支持
        macvlan                19239  0 

## 1.据需清理掉上面的实验数据，并还原daemon.json实验前的默认配置

    #如果是实验数据，可以清除，清除前请确保你明白下面命令的含义，否则不要这么清除
    docker rm -f $(docker ps -qa)  #清除所有的容器
    docker rmi $(docker images -qa) #清除掉所有镜像
    docker network rm mynet  #在主节点清除掉自定义的网络
    systemctl daemon-reload  #重启配置
    systemctl restart docker  #重启docker服务
    
    提示，我的本地daemon.json里，只有一行，是配置阿里云加速镜像时创建的。 
    
        sudo mkdir -p /etc/docker
        sudo tee /etc/docker/daemon.json .......

## 2.分别在主从节点上，开启网卡混合模式，开启前先ip a查看网卡信息

    ip a
    ip link set ens33 promisc on  #特别注意，你的物理虚拟网卡名称可能是eth0（可以在network-script里修改）
    ip a

开启混合模式前，先查看一下网卡信息

分别给主从节点，开启混合网卡模式

## 3.分别在主从节点上，通过docker create -d 创建macvlan网络

    分别在主、从节点上创建macvlan，并通过 parent指定其真身爸爸是物理网卡ens33。
    
    #部分主机的虚拟物理网卡不是ens33,部分名称是eth0 ,(我自定义名称是myMaclan，不是myMacvlan，叫什么随意)
    docker network create -d macvlan --subnet 172.30.0.0/16 --gateway 172.30.0.2 -o parent=ens33 myMaclan  
    docker network create -d macvlan --subnet=ip段（10.10.10.0/24） --gateway=网关 -o parent=网卡名称 -o macvlan_mode=bridge bridgemacvlan（网络名称）
    
    
    docker network ls

注：对该命令的参数不了解的小伙伴，可以通过docker network create  --help来获悉更多的参数。细心的小伙伴发现，第一个案例该命令创建overlay网络时，使用的是--opt，此处使用的是-o，它们两个是一个命令，-o等价于--opt，使用场景主要是用于多个参数时，放到对应参数前面。它是一个map[]集合，也就是说，每个参数的前面都添加-o，则这些参数同属于一个-o的集合。

## 4.在主节点CentOS7.9上使用macvlan网络模式，启动nginx并指定IP

    docker run -d --name nginx --network myMacvlan --ip 172.30.0.3 nginx:alpine
    --net=bridgemacvlan --ip=10.10.10.XXX
    docker run -d --name XXX --net=bridgemacvlan --ip=容器ip XXX/XXX:latest
    docker ps

注意：这里自定义nginx容器的ip是172.30.0.3，下个步骤在从节点tomcat容器内会用到。

## 5.在从节点CentOS8.4上，启动tomcat容器时，分别暂不/指定网络模式为macvlan，ping主节点的nginx

    docker images #查看镜像列表（什么镜像不重要，重要的是在容器内部，是可以实现跨宿主机通信）
    docker run -it tomcat:alpine bash  #第一次进入从节点容器内部，不指定--network
    ping -w 3 172.30.0.3   #尝试去ping主节点容器内的nginx的ip，发现不能ping通
    exit
     
    docker run -it --network myMaclan tomcat:alpine bash  #第二次进入从节点容器内部，指定--network
    ping -w 3 172.30.0.3   #尝试去ping主节点容器内的nginx的ip，发现可以ping通
    exit

 注：如果你对尾部的bash感兴趣，点击进入（从文章尾部开始向上看）

## 6.收尾工作，关闭虚拟网卡混合模式，清除容器

    docker rm -f $(docker ps -qa)   #清除容器
    docker network ls
    docker network rm myMaclan      #清除自定义网卡
    ip link set ens33 promisc off   #取消网卡的混合模式
    ip a  #验证是否已取消

## 7.小节

     该模式的小实验比较简单，3个核心步骤：
    
    1、主、从节点分别创建macvlan网络
    
    2、主节点启动容器(nginx)时，指定网络模式为自定义的网络
    
    3、从节点启动容器(tomcat)时，分别先不指定/指定自定义网络后，进入(tomcat)容器，去尝试ping主节点容器(nginx)IP。
    
    该方式，一样可以实现跨节点通信，但只是昙花一现，满足了特定时期需求。
    
    弊端：主从节点上都需要创建macvlan的自定义网络，容器启动时也都需要指定网络模式为macvlan，不难但是比较low稍显繁琐。
    
    macvlan的通信原理，主从节点都需要创建完全相同的自定义网络，都通过-d或者--driver指定为macvlan，同时指定--subnet子网网段和--gateway网关，当然如果创建自定义网络时你不指定，在docker run命令时，你依然可以指定。
    
    但是，需要注意的是，主从节点各自定义的macvan的网关和子网网段要相同，从而造成两个不同的宿主机的自定义网卡都处于同一个网段，给人的错觉就是他们就是1个小的局域网，在主从节点中的容器在docker run时，都通过--network指定这个自定义的网络。
    
    这样，就自然而然的实现了跨宿主机通信。

# 总结

    尽管overlay（overlay2）和macvlan都可以实现跨宿主机通信，但是相对的前者更为便捷一些，但是随着新容器编排技术的不断涌现，这些当时时髦的技术也终将被替代。就连docker官网自己推出的Docker-compose[官网]（它是一个单机多容器部署工具，不支持多机）编排工具，也正在被k8s（支持多容器、多机部署）替代，后续将陆续对这些编排工具做具体介绍。
    
    不过这些不重要，长江后浪推前浪，k8s终究是配置太多，强大的同时也太繁琐，终将会被更强大的其他替代，万变不离其宗，了解了这些底层些的知识，再学习其他编排工具时，也更加是游刃有余。

# 附注

1、Docker容器 | Dockerfile优化

2、Docker容器的生命周期 | kill和stop | pause 和 unpause

3、 Docker容器五种(3+2)网络模式 | bridge模式 | host模式 | none模式 | container 模式 | 自定义网络模式详解

4、Docker外部浏览器访问容器 | 容器访问容器 | 访问容器的常用5种方式 | -p -P 详解

5、Docker容器之间单/双向通信 |--link /自定义网络实现互认容器别名

6、Docker容器间数据挂载与共享 | 远程共享&挂载数据卷
