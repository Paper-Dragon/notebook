## 一、什么是 Pod

Pod 是 kubernetes 集群中最小的部署和管理的基本单元，协同寻址，协同调度。

Pod 是一个或多个容器的集合，是一个或一组服务（进程）的抽象集合。

Pod 中可以共享网络和存储（可以简单理解为一个逻辑上的虚拟机，但并不是虚拟机）。

Docker 是目前 Pod 最常用的容器环境，但仍支持其他容器环境。

![27.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602327208631.png)

**我们可以看到，当我们启动一个 Pod 以后，每个 Pod 内都会有一个 Pause 的容器**

每个 Pod 里运行着一个特殊的被称之为 Pause 的容器，其他容器则为业务容器，这些业务容器共享 Pause 容器的网络栈和 Volume 挂载卷，因此他们之间通信和数据交换更为高效，在设计时我们可以充分利用这一特性将一组密切相关的服务进程放入同一个 Pod 中。同一个 Pod 里的容器之间仅需通过 localhost 就能互相通信。

## 二、Pod 的网络

- 每个Pod被分配了唯一的IP地址，该Pod内的所有容器共享一个网络空间，包括IP和端口。
- 同个Pod不同容器之间通过localhost通信，Pod内端口不能冲突。
- 不同Pod之间的通信则通过IP+端口的形式来访问到Pod内的具体服务（容器）。

![28.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602326898782.png)

## 三、Pod 的用法

Pod 实际上是容器的集合，在 kubernetes 中对运行容器的要求为 “容器的主程序需要一直在前台运行，而不是后台运行“ 当多个应用之间是紧耦合的关系时，可以将多个应用一起放在一个Pod中，同个Pod中的多个容器之间互相访问可以通过localhost来通信。

 相关命令：

|     操作     | 命令                                                         |
| :----------: | :----------------------------------------------------------- |
|     创建     | kubectl create -f 文件名.yaml                                |
| 查询运行状态 | kubectl get pods -n 空间名称，如果不指定则默认显示default空间内的 pod |
|   查询详情   | kebectl describe pod Pod名称 -n 空间名称，如果不指定则默认显示default空间内的 pod |
|     删除     | kubectl delete pod Pod名称 / kubectl delete pod --all        |
|     更新     | kubectl replace 文件名.yaml                                  |

## 四、Pod 定义文件

在 kubernetes 中，一般使用 **yaml** 格式的文件来创建符合我们预期期望的 pod

基本语法为：

- 缩进时不允许使用Tab键，只允许使用空格
- 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可
- \#标识注释，从这个字符一直到行尾，都会被解释器忽略

这样的 yaml 文件我们一般称为资源清单，如下表所示：

```
必选字段：

apiVersion: v1       		        #必选，版本号，例如v1
kind: Pod       			#必选，资源类别
metadata:       			#必选，元数据
  name: string       		        #必选，Pod名称
  namespace: string    	                #创建资源所属于的命名空间，不写的话默认创建在default空间
  labels:      				#自定义标签
    - name: string     	                #自定义标签名称
spec:         				#必选，Pod中容器的详细定义
  containers:      			#必选，Pod中容器列表
  - name: string     		        #必选，容器名称
    image: string    		        #必选，容器的镜像名称
```

**示例文件：**

```
apiVersion: v1
kind: Pod
metadata:
   name: nginx
   labels:
      app: web
spec:
   containers:
      - name: nginx
        image: docker.io/nginx
        ports:
         - containerPort: 80
```

**完整资源清单详情示例：**

```
apiVersion: v1       					#必选，版本号，例如v1
kind: Pod       					#必选，Pod
metadata:       					#必选，元数据
  name: string       					#必选，Pod名称
  namespace: string    					#创建资源所属于的命名空间，不写的话默认创建在default空间
  labels:      						#自定义标签
    - name: string     		                        #自定义标签名字
  annotations:       					#自定义注释列表
    - name: string
spec:         						#必选，Pod中容器的详细定义
  containers:      					#必选，Pod中容器列表
  - name: string     			                #必选，容器名称
    image: string    			                #必选，容器的镜像名称
    imagePullPolicy: [Always | Never | IfNotPresent]    #获取镜像的策略 Alawys表示下载镜像 IfnotPresent表示优先使用本地镜像，否则下载镜像，Nerver表示仅使用本地镜像
    command: [string]    				#容器的启动命令列表，如不指定，使用打包时使用的启动命令
    args: [string]     					#容器的启动命令参数列表
    workingDir: string    				#容器的工作目录
    volumeMounts:    					#挂载到容器内部的存储卷配置
    - name: string     		                        #引用pod定义的共享存储卷的名称，需用volumes[]部分定义的的卷名
      mountPath: string   				#存储卷在容器内mount的绝对路径，应少于512字符
      readOnly: boolean   				#是否为只读模式
    ports:       					#需要暴露的端口库号列表
    - name: string     		                        #端口号名称
      containerPort: int  				#容器需要监听的端口号
      hostPort: int    					#容器所在主机需要监听的端口号，默认与Container相同
      protocol: string    				#端口协议，支持TCP和UDP，默认TCP
    env:       						#容器运行前需设置的环境变量列表
    - name: string     		                        #环境变量名称
      value: string    					#环境变量的值
    resources:       					#资源限制和请求的设置
      limits:      					#资源限制的设置
        cpu: string    					#Cpu的限制，单位为core数，将用于docker run --cpu-shares参数
        memory: string    				#内存限制，单位可以为Mib/Gib，将用于docker run --memory参数
      requests:      					#资源请求的设置
        cpu: string    					#Cpu请求，容器启动的初始可用数量
        memory: string    				#内存清楚，容器启动的初始可用数量
    livenessProbe:     					#对Pod内个容器健康检查的设置，当探测无响应几次后将自动重启该容器，检查方法有exec、httpGet和tcpSocket，对一个容器只需设置其中一种方法即可
      exec:      					#对Pod容器内检查方式设置为exec方式
        command: [string] 				#exec方式需要制定的命令或脚本
      httpGet:       					#对Pod内个容器健康检查方法设置为HttpGet，需要制定Path、port
        path: string
        port: number
        host: string
        scheme: string
        HttpHeaders:
        - name: string
          value: string
      tcpSocket:     					#对Pod内个容器健康检查方式设置为tcpSocket方式
         port: number
       initialDelaySeconds: 0  				#容器启动完成后首次探测的时间，单位为秒
       timeoutSeconds: 0  				#对容器健康检查探测等待响应的超时时间，单位秒，默认1秒
       periodSeconds: 0   				#对容器监控检查的定期探测时间设置，单位秒，默认10秒一次
       successThreshold: 0
       failureThreshold: 0
       securityContext:
         privileged:false
    restartPolicy: [Always | Never | OnFailure]		#Pod的重启策略，Always表示一旦不管以何种方式终止运行，kubelet都将重启，OnFailure表示只有Pod以非0退出码退出才重启，Nerver表示不再重启该Pod
    nodeSelector: obeject 				#设置NodeSelector表示将该Pod调度到包含这个label的node上，以key：value的格式指定
    imagePullSecrets:    				#Pull镜像时使用的secret名称，以key：secretkey格式指定
    - name: string
    hostNetwork:false     				#是否使用主机网络模式，默认为false，如果设置为true，表示使用宿主机网络
    volumes:       					#在该pod上定义共享存储卷列表
    - name: string     		                        #共享存储卷名称 （volumes类型有很多种）
      emptyDir: {}     					#类型为emtyDir的存储卷，与Pod同生命周期的一个临时目录。为空值
      hostPath: string   				#类型为hostPath的存储卷，表示挂载Pod所在宿主机的目录
        path: string     				#Pod所在宿主机的目录，将被用于同期中mount的目录
      secret:      					#类型为secret的存储卷，挂载集群与定义的secre对象到容器内部
        scretname: string  
        items:     
        - key: string
          path: string
      configMap:     					#类型为configMap的存储卷，挂载预定义的configMap对象到容器内部
        name: string
        items:
        - key: string
          path: string
```