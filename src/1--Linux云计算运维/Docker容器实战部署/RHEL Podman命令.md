# Podman介绍

Podman 是一个开源的容器运行时项目，可在大多数 Linux 平台上使用。Podman 提供与 Docker 非常相似的功能。正如前面提到的那样，它不需要在你的系统上运行任何守护进程，并且它也可以在没有 root 权限的情况下运行。
Podman 可以管理和运行任何符合 OCI（Open Container Initiative）规范的容器和容器镜像。Podman 提供了一个与 Docker 兼容的命令行前端来管理 Docker 镜像。

> 1. Podman 官网地址：https://podman.io/
> 2. Podman 项目地址：https://github.com/containers/libpod

#### Podman 和docker不同之处？

1. docker 需要在我们的系统上运行一个守护进程(docker daemon)，而podman 不需要
2. 启动容器的方式不同：
	`docker cli` 命令通过API跟 `Docker Engine(引擎)`交互告诉它我想创建一个container，然后`docker Engine`才会调用`OCI container runtime(runc)`来启动一个container。这代表container的process(进程)不会是`Docker CLI`的`child process(子进程)`，而是`Docker Engine`的`child process`。
	`Podman`是直接给`OCI containner runtime(runc)`进行交互来创建container的，所以`container process`直接是`podman`的`child process`。
3. 因为docke有docker daemon，所以docker启动的容器支持`--restart`策略，但是podman不支持，如果在k8s中就不存在这个问题，我们可以设置pod的重启策略，在系统中我们可以采用编写systemd服务来完成自启动
4. docker需要使用root用户来创建容器，但是podman不需要

## Podman安装

```
# yum -y install podman
```

## Podman命令

### 镜像管理命令

#### 镜像搜索 podman search

```
[root@node4 ~]# podman search centos
INDEX    NAME      DESCRIPTION           STARS   OFFICIAL   AUTOMATED                            
Podman.io  Podman.io/blacklabelops/centos CentOS Base Image! Built and Updates Daily!       1                  [OK]        

INDEX
NAME     镜像名字
DESCRIPTION	描述
SATRS				星级  数字越大代表使用人数越多
OFFICIAL		是否为官方镜像
AUTOMATED		


拓展知识：
根据本地的/etc/containers/registries.conf文件中定义的去搜索
#默认情况下，使用podman搜索从容器仓库中搜索镜像时，基于registries.conf文件，podman按顺序在registry.redhat.io、registry.access.redhat.com、quay.io和docker.io中查找请求的镜像。
[registries.search]
registries = ['registry.redhat.io', 'registry.access.redhat.com', 'quay.io', 'docker.io']

#要添加对不需要身份验证的容器仓库（不安全容器仓库）的访问，必须在[registries.Unsecure]部分下添加该容器仓库的名称。
[registries.insecure] 
registries = []

#要禁止从本地系统访问的任何容器仓库都需要添加到[registries.block]部分下。
[registries.block] 
registries = []


关于配置容器容器仓库，您还应该了解以下几点：
1、确保每个容器仓库都用单引号括起来。
2、如果为registries=值设置了多个仓库，则必须用逗号分隔这些仓库。
3、仓库可以通过IP地址或主机名来标识。
4、如果仓库使用非标准端口（即，安全端口不是TCP端口443，不安全端口不是80），则应使用仓库名输入该端口号。例如：host.example.com:9999
5、按照Registries.conf文件每个部分的显示顺序搜索仓库。
6、如果您是运行podman和相关工具的普通用户（无根），则可以创建自己的registries.conf文件来覆盖默认设置。
```

#### 本地镜像查看 podman images

```
[root@node4 ~]# podman images
REPOSITORY                    TAG      IMAGE ID       CREATED         SIZE
Podman.io/blacklabelops/centos latest   73f5fb57a402   13 months ago   391 MB
```

#### 从仓库镜像拉取 podman pull [imange_name]

```
[root@node4 ~]# podman pull Podman.io/blacklabelops/centos
Trying to pull Podman.io/blacklabelops/centos...Getting image source signatures
Copying blob 18b8eb7e7f01: 69.75 MiB / 69.96 MiB [=============================]
Copying blob 18b8eb7e7f01: 69.96 MiB / 69.96 MiB [=========================] 33s
Copying blob 18b8eb7e7f01: 69.96 MiB / 69.96 MiB [=========================] 33s
Copying blob 9d438d3ad7e8: 61.22 MiB / 61.22 MiB [=========================] 33s
Copying config 73f5fb57a402: 3.98 KiB / 3.98 KiB [==========================] 0s
Writing manifest to image destination
Storing signatures
73f5fb57a402c17df1a74ddb154c4d2e2cd30c366e224d9cb6087ab9c6339d58
```

#### 本地镜像删除 podman rmi [IMAGE_ID|REPOSITORY]

```
方法一: podman rmi IMAGE_ID
[root@node4 ~]# podman rmi 73f5fb57a402
73f5fb57a402c17df1a74ddb154c4d2e2cd30c366e224d9cb6087ab9c6339d58
方法二: podman rmi REPOSITORY
[root@node4 ~]# podman rmi Podman.io/blacklabelops/centos
73f5fb57a402c17df1a74ddb154c4d2e2cd30c366e224d9cb6087ab9c6339d58
```

#### 镜像上传到仓库 podman push

#### 镜像管理综合命令 podman image

```
[root@node4 ~]# podman image
NAME:
   podman image - Manage images

USAGE:
   podman image command [command options] [arguments...]

COMMANDS:
     build     Build an image using instructions from Podmanfiles
     #根据Podmanfiles创建image
     history   Show history of a specified image
     #显示指定镜像的历史信息
     import    Import a tarball to create a filesystem image
     #导入一个文件系统压缩包
     exists    Check if an image exists in local storage
     #检查本地是否存在某个镜像
     inspect   Displays the configuration of a container or image
     #显示容器或镜像的详细信息
     load      Load an image from Podman archive
     #将镜像文件导入到镜像仓库
     list, ls  list images in local storage
     #列出本地存储中的镜像
     prune     Remove unused images
     #移除未使用的镜像
     pull      Pull an image from a registry
     #下载一个镜像到本地
     push      Push an image to a specified destination
     #上传一个镜像到仓库
     rm        removes one or more images from local storage
     #删除一个或多个本地镜像
     save      Save image to an archive
     #将一个镜像保存为一个镜像文件
     tag       Add an additional name to a local image
     #添加一个额外的名称给本地镜像
     trust     Manage container image trust policy
     #信任容器镜像
     sign      Sign an image
     #生成镜像签名，可以根据签名验证镜像的完整性

OPTIONS:
   --help, -h  show help
   
   
镜像历史信息
[root@node4 ~]# podman image history 73f5fb57a402
ID             CREATED         CREATED BY                                      SIZE      COMMENT
73f5fb57a402   13 months ago   /bin/sh -c #(nop) LABEL maintainer=Steffen...   0B        
<missing>      13 months ago   |1 BUILD_DATE=06/10/2018-01:06+0200 /bin/s...   64.2MB    
<missing>      13 months ago   /bin/sh -c #(nop) ARG BUILD_DATE=undefined      64.2MB    
<missing>      15 months ago   /bin/sh -c #(nop) CMD ["/bin/bash"]             64.2MB    
<missing>      15 months ago   /bin/sh -c #(nop) LABEL name=CentOS Base I...   64.2MB    
<missing>      15 months ago   /bin/sh -c #(nop) ADD file:d6a1da927f0b7a7...   73.36MB   


镜像导入来自系统压缩包 导入时文件越大越慢
[root@node4 ~]# podman image import centos8.tar
Getting image source signatures
Copying blob 84d82847ae58: 1.29 GiB / 1.31 GiB [===============================]
Copying blob 84d82847ae58: 1.31 GiB / 1.31 GiB [===========================] 14s
Copying config 2d42f6c756bc: 419 B / 419 B [================================] 0s
Writing manifest to image destination
Storing signatures
2d42f6c756bc02640bbb77319b5f1b3a2c51f70fd64d4919d8eb5c0d078c87a7


监测本地镜像是否存在，结合$?
[root@node4 ~]# podman image exists 2d42f6c756bc;echo $?
0
[root@node4 ~]# podman image exists 2d42f6c756bcxxxx;echo $?
1



镜像下载
[root@node4 ~]# podman image pull Podman.io/blacklabelops/centos
Trying to pull Podman.io/blacklabelops/centos...Getting image source signatures
Copying blob 18b8eb7e7f01: 69.92 MiB / 69.96 MiB [=============================]
Copying blob 18b8eb7e7f01: 69.96 MiB / 69.96 MiB [=========================] 23s
Copying blob 18b8eb7e7f01: 69.96 MiB / 69.96 MiB [=========================] 24s
Copying blob 9d438d3ad7e8: 61.22 MiB / 61.22 MiB [=========================] 24s
Copying config 73f5fb57a402: 3.98 KiB / 3.98 KiB [==========================] 0s
Writing manifest to image destination
Storing signatures
73f5fb57a402c17df1a74ddb154c4d2e2cd30c366e224d9cb6087ab9c6339d58

镜像查看  list
[root@node4 ~]# podman image list
REPOSITORY                       TAG      IMAGE ID       CREATED         SIZE
Podman.io/blacklabelops/centos   latest   73f5fb57a402   13 months ago   391 MB

镜像查看  ls
[root@node4 ~]# podman image ls
REPOSITORY                       TAG      IMAGE ID       CREATED         SIZE
Podman.io/blacklabelops/centos   latest   73f5fb57a402   13 months ago   391 MB

镜像删除
[root@node4 ~]# podman image rm 73f5fb57a402
73f5fb57a402c17df1a74ddb154c4d2e2cd30c366e224d9cb6087ab9c6339d58




[root@node4 ~]# podman image tag 2d42f6c756bc tyschool_centos8_1905
[root@node4 ~]# podman image list
REPOSITORY                        TAG      IMAGE ID       CREATED       SIZE
localhost/tyschool_centos8_1905   latest   2d42f6c756bc   5 hours ago   1.4 GB


导出一个镜像到文件 -o output
[root@node4 ~]# podman image save -o centos_7_base Podman.io/blacklabelops/centos
Getting image source signatures
Copying blob 129b697f70e9: 194.43 MiB / 195.64 MiB [===========================]
Copying blob 129b697f70e9: 195.64 MiB / 195.64 MiB [========================] 6s
Copying blob 129b697f70e9: 195.64 MiB / 195.64 MiB [========================] 6s
Copying blob a39553b46393: 177.41 MiB / 177.41 MiB [========================] 6s
Copying config 73f5fb57a402: 3.98 KiB / 3.98 KiB [==========================] 0s
Writing manifest to image destination
Storing signatures


导入一个镜像文件到本地仓库   -i  input 
[root@node4 ~]# podman image load -i centos_7_base 
Getting image source signatures
Copying blob 129b697f70e9: 183.88 MiB / 195.64 MiB [=========================>-]
Copying blob a39553b46393: 171.16 MiB / 177.41 MiB [===========================]
Copying blob 129b697f70e9: 195.64 MiB / 195.64 MiB [========================] 4s
Copying blob a39553b46393: 177.41 MiB / 177.41 MiB [========================] 4s
Copying config 73f5fb57a402: 3.98 KiB / 3.98 KiB [==========================] 0s
Writing manifest to image destination
Storing signatures
Loaded image(s): docker.io/blacklabelops/centos:latest


删除未使用的镜像
[root@node4 ~]# podman image prune --all
2d42f6c756bc02640bbb77319b5f1b3a2c51f70fd64d4919d8eb5c0d078c87a7
b9e394903cd716d89ca1fb6758bfa08dd6ec6a5966fa925c9cf58738062eba05
73f5fb57a402c17df1a74ddb154c4d2e2cd30c366e224d9cb6087ab9c6339d58
```

### 容器管理命令

#### 容器查看 ps

```
#显示开机容器
[root@node4 ~]# podman ps   
CONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES

#显示所有容器，包括没开机的
[root@node4 ~]# podman ps -a
CONTAINER ID  IMAGE                                    COMMAND    CREATED         STATUS                         PORTS  NAMES
344ce4a0a6b4  localhost/tyschool_centos8_1905:latest   /bin/bash  54 seconds ago  Exited (0) 50 seconds ago             ty2
78c97bb19bec  docker.io/mcnaughton/centos-base:latest  /bin/bash  3 minutes ago   Exited (0) About a minute ago         ty1
```

#### 容器创建 run

方法一：根据本地镜像创建容器

```
[root@node4 ~]# podman images
REPOSITORY                         TAG      IMAGE ID       CREATED         SIZE
localhost/tyschool_centos8_1905    latest   2d42f6c756bc   7 hours ago     1.4 GB
docker.io/blacklabelops/centos     latest   73f5fb57a402   13 months ago   391 MB
[root@node4 ~]# podman run -it -name ty2 localhost/tyschool_centos8_1905 /bin/bash

-i 开启容器交互
-t 分配一个TTY终端[假的]

拓展
--privileged  扩展容器权限
```

方法二: 容器创建的时候，优先从本地仓库找镜像，本地没有就回去远程仓库拉取到本地

```
本地仓库没有镜像
[root@node4 ~]# podman run --name ty1 -it docker.io/mcnaughton/centos-base /bin/bash
Trying to pull docker.io/mcnaughton/centos-base...Getting image source signatures
Copying blob a02a4930cb5d: 0 B / 71.68 MiB [-----------------------------------]
Copying blob a02a4930cb5d: 30.30 MiB / 71.68 MiB [============>----------------]
Copying blob a02a4930cb5d: 71.27 MiB / 71.68 MiB [=============================]
Copying blob a02a4930cb5d: 71.68 MiB / 71.68 MiB [=========================] 34s
Copying blob a02a4930cb5d: 71.68 MiB / 71.68 MiB [=========================] 34s
Copying blob f6168f316445: 23.45 MiB / 23.45 MiB [=========================] 34s
Copying blob cf55ab518523: 99.57 MiB / 99.57 MiB [=========================] 34s
Copying blob 68b1bf62d7e6: 1.19 KiB / 1.19 KiB [===========================] 34s
Copying config b9e394903cd7: 4.99 KiB / 4.99 KiB [==========================] 0s
Writing manifest to image destination
Storing signatures
```

#### 容器启动、关闭、重启、暂停、恢复

```
#启动容器  start
[root@node4 ~]# podman start ty1
ty1
查看容器开启了
[root@node4 ~]# podman ps
CONTAINER ID  IMAGE                                    COMMAND    CREATED        STATUS            PORTS  NAMES
78c97bb19bec  docker.io/mcnaughton/centos-base:latest  /bin/bash  4 minutes ago  Up 5 seconds ago         ty1


#关闭容器  stop
[root@node4 ~]# podman stop ty1
78c97bb19bec488b8bf5a6f68cdff9ecc20980b3c2c9e2d4c56a0946f539bd02
查看容器关闭了
[root@node4 ~]# podman ps
CONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES

#重启容器  restart
[root@node4 ~]# podman restart ty1
78c97bb19bec488b8bf5a6f68cdff9ecc20980b3c2c9e2d4c56a0946f539bd02
[root@node4 ~]# 
[root@node4 ~]# podman ps
CONTAINER ID  IMAGE                                    COMMAND    CREATED        STATUS            PORTS  NAMES
78c97bb19bec  docker.io/mcnaughton/centos-base:latest  /bin/bash  6 minutes ago  Up 2 seconds ago         ty1


#暂停容器  pause
[root@node4 ~]# podman pause ty1
78c97bb19bec488b8bf5a6f68cdff9ecc20980b3c2c9e2d4c56a0946f539bd02
查看状态
[root@node4 ~]# podman ps -a
CONTAINER ID  IMAGE                                    COMMAND    CREATED        STATUS                    PORTS  NAMES
344ce4a0a6b4  localhost/tyschool_centos8_1905:latest   /bin/bash  4 minutes ago  Exited (0) 4 minutes ago         ty2
78c97bb19bec  docker.io/mcnaughton/centos-base:latest  /bin/bash  6 minutes ago  Paused                           ty1

#恢复暂停容器  unpause
[root@node4 ~]# podman unpause ty1
78c97bb19bec488b8bf5a6f68cdff9ecc20980b3c2c9e2d4c56a0946f539bd02
查看状态
[root@node4 ~]# podman ps 
CONTAINER ID  IMAGE                                    COMMAND    CREATED        STATUS             PORTS  NAMES
78c97bb19bec  docker.io/mcnaughton/centos-base:latest  /bin/bash  6 minutes ago  Up 25 seconds ago         ty1
```

#### 容器性能查看 top

```
podman top 容器名称

[root@node4 ~]# podman top ty1
USER   PID   PPID   %CPU    ELAPSED          TTY     TIME   COMMAND
root   1     0      0.000   6m9.377354027s   pts/0   0s     /bin/bash
```

#### 容器连接 exec

```
连接一个运行容器，执行/bin/bash命令
[root@node4 ~]# podman exec -it ty1 /bin/bash
[root@78c97bb19bec /]# 
```

#### 容器连接 attach

```
将一个运行容器的标准输出、标准错误输出、标准输入调到前台
[root@node4 ~]# podman attach ty1
[root@78c97bb19bec /]# 
```

#### 根据容器生成镜像 export

```
[root@node4 ~]# podman export -o ty1.tar ty1

[root@node4 ~]# podman import  ty1.tar  baism:ty1
Getting image source signatures
Copying blob 854836d1c5c3: 491.28 MiB / 505.18 MiB [===========================]
Copying blob 854836d1c5c3: 505.18 MiB / 505.18 MiB [========================] 5s
Copying config 25581780c97b: 419 B / 419 B [================================] 0s
Writing manifest to image destination
Storing signatures
25581780c97b41ed62e0d6a9e41f8725cfaa93653e32adbb65369d3e527d235c



podman import  ty1.tar  baism:ty1

baism:ty1 自定义仓库的名称:标签
```

#### 打包更改过的容器为镜像 commit

```
[root@node4 ~]# podman commit ty1 baism:latest
Getting image source signatures
Skipping blob 071d8bd76517 (already present): 200.44 MiB / 200.44 MiB [=====] 0s
Skipping blob 3c8ab5053a82 (already present): 57.01 MiB / 57.01 MiB [=======] 0s
Skipping blob ba3cdff1294c (already present): 286.14 MiB / 286.14 MiB [=====] 0s
Skipping blob e25e400e5c38 (already present): 28.50 KiB / 28.50 KiB [=======] 0s
Skipping blob 071d8bd76517 (already present): 200.44 MiB / 200.44 MiB [=====] 1s
Skipping blob 071d8bd76517 (already present): 200.44 MiB / 200.44 MiB [=====] 1s
Skipping blob 3c8ab5053a82 (already present): 57.01 MiB / 57.01 MiB [=======] 1s
Skipping blob ba3cdff1294c (already present): 286.14 MiB / 286.14 MiB [=====] 1s
Skipping blob e25e400e5c38 (already present): 28.50 KiB / 28.50 KiB [=======] 1s
Copying blob 83e9209f930c: 114.44 MiB / 114.44 MiB [========================] 1s
Copying config d558217acef1: 4.08 KiB / 4.08 KiB [==========================] 0s
Writing manifest to image destination
Storing signatures
d558217acef109e465d5ce65d60de7c8619cc3c8cbbcde57e418555516ba3ec0
```