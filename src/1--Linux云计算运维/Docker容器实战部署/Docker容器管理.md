# 一、docker容器管理

### 1.1 容器查看-ps命令

显示本地容器列表，但是默认不显示关闭的容器，只显示运行中的容器，除非加上命令选项 -a

用法:
**docker ps [-a 显示所有容器，默认只显示运行的]**

```
root@zutuanxue ~]# docker ps
CONTAINER ID      IMAGE   COMMAND           CREATED    STATUS     PORTS      NAMES
8f4c3f823843    centos  "/bin/bash"  3 seconds ago  Exited(0) 3 seconds ago     centos7_6
```

### 1.2、容器详细信息-inspect命令

显示容器的详细信息

用法:
**docker inspect [容器名称或者ID]**

```
[root@zutuanxue ~]# docker inspect centos
[
    {
        "Id": "sha256:0f3e07c0138fbe05abcb7a9cc7d63d9bd4c980c3f61fea5efa32e7c4217ef4da",
        "RepoTags": [
            "centos:latest",
            "zutuanxue_centos:v1"
        ],
        "RepoDigests": [],
        "Parent": "",
        "Comment": "",
        "Created": "2019-10-01T23:19:57.105928163Z",
        "Container": "711572e3c0c1ac06d5c13c4e668ec170b8ad8786b5f0949f884a5f7fd350d856",
        "ContainerConfig": {
            "Hostname": "711572e3c0c1",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/sh",
                "-c",
                "#(nop) ",
                "CMD [\"/bin/bash\"]"
            ],
            "ArgsEscaped": true,
            "Image": "sha256:c0bda62fdbad65a3c6a1843d293a3a47d8233115cc6d384e3cb07c53580a2b43",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20190927",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS"
            }
        },
        "DockerVersion": "18.06.1-ce",
        "Author": "",
        "Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/bash"
            ],
            "ArgsEscaped": true,
            "Image": "sha256:c0bda62fdbad65a3c6a1843d293a3a47d8233115cc6d384e3cb07c53580a2b43",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {
                "org.label-schema.build-date": "20190927",
                "org.label-schema.license": "GPLv2",
                "org.label-schema.name": "CentOS Base Image",
                "org.label-schema.schema-version": "1.0",
                "org.label-schema.vendor": "CentOS"
            }
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 219583055,
        "VirtualSize": 219583055,
        "GraphDriver": {
            "Data": {
                "MergedDir": "/var/lib/docker/overlay2/7e9695593c24efc2b9e7cbe8ee2ce7c299e8cde85d73668b94f91284554d3e57/merged",
                "UpperDir": "/var/lib/docker/overlay2/7e9695593c24efc2b9e7cbe8ee2ce7c299e8cde85d73668b94f91284554d3e57/diff",
                "WorkDir": "/var/lib/docker/overlay2/7e9695593c24efc2b9e7cbe8ee2ce7c299e8cde85d73668b94f91284554d3e57/work"
            },
            "Name": "overlay2"
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:9e607bb861a7d58bece26dd2c02874beedd6a097c1b6eca5255d5eb0d2236983"
            ]
        },
        "Metadata": {
            "LastTagTime": "2019-11-15T05:18:05.72378385-05:00"
        }
    }
]
```

### 1.3、容器创建-run命令

容器创建命令

用法:
**docker run [options] 镜像名称**

```
#后台执行容器

[root@zutuanxue ~]# docker run -d --name centos7_6 centos 

#前台执行的容器

[root@zutuanxue ~]# docker run -it --name centos7_5  centos /bin/bash

[root@5a1f02b4041c /]# 

-i 交互式创建
-t 创建一个伪终端
-d 后台执行
--name 容器名称
/bin/bash 在伪终端中执行的命令
```

### 1.4、容器删除-rm命令

删除一个本地容器

用法:
**docker rm [容器名称或者ID] [–force]**

```
[root@zutuanxue ~]# docker rm centos7_5
centos7_5

默认删除的容器必须是关闭状态，建议如果希望删除一个运行的容器，可以先关闭在删除。
当然也可以在后面直接加上--force 强制删除一个运行中的容器
```

### 1.5、容器执行命令-exec命令

在运行容器中执行一个命令，如果想在容器中执行一个命令，那么这个exec命令就很有用了。

用法:
**docker exec [容器名称或者ID] 命令**

```
[root@zutuanxue ~]# docker exec centos7_6 ls /
bin
dev
etc
home
lib
lib64
lost+found
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
```

### 1.6、容器信息输出-attach命令

将一个运行容器的标准输出、错误输出、标准输入调入前台
默认容器都会在后台运行，如果你想进入容器内，就可以使用该命令。这样你就可以交互式的在容器中执行命令了。

用法:
**docker attach [容器名称或者ID]**

```
[root@zutuanxue ~]# docker attach centos7_6

[root@128dc0ffc489 /]# 
```

### 1.7、容器启动-start命令

启动一个容器

用法:
**docker start [容器名称或者ID]**

```
[root@zutuanxue ~]# docker start centos7_6
centos7_6
```

### 1.8、停止一个容器-stop命令

关闭一个容器

用法:
**docker stop [容器名称或者ID]**

```
[root@zutuanxue ~]# docker stop centos7_6
centos7_6
```

### 1.9、重启一个容器-restart命令

重启一个容器

用法:
**docker restart [容器名称或者ID]**

```
[root@zutuanxue ~]# docker restart centos7_6
centos7_6
```

### 1.10、容器挂起-pause命令

挂起运行中的容器

用法：
**docker pause [容器名称或者ID]**

```
[root@zutuanxue ~]# docker pause centos7_6

centos7_6

[root@zutuanxue ~]# docker ps

CONTAINER ID     IMAGE     COMMAND     CREATED  STATUS    PORTS  NAMES
128dc0ffc489  centos "/bin/bash" 19 minutes ago  Up 14 minutes (Paused)    centos7_6
```

### 1.11、容器恢复-unpause命令

恢复挂起容器

用法:
**docker unpause [容器名称或者ID]**

```
[root@zutuanxue ~]# docker unpause centos7_6
centos7_6
```

### 1.12、容器重命名-rename命令

重命名容器

用法:
**docker rename 容器名称 容器新名称**

```
[root@zutuanxue ~]# docker rename centos7_6 centos76
```

### 1.13、容器端口映射信息-port命令

显示容器与宿主机的端口隐射信息

用法:
**docker port [容器名称或者ID]**

```
[root@zutuanxue ~]# docker port 32fd02f05446
5000/tcp -> 0.0.0.0:5000

容器的TCP 5000端口与宿主机的所有IP的5000端口绑定
```

### 1.14、杀死一个或多个容器-kill命令

杀死运行的容器

用法:
**docker kill [镜像名称或者ID]**

```
[root@zutuanxue ~]# docker kill centos76
centos76
```

### 1.15、容器导出-export命令

将一个容器导出一个镜像为压缩文件

用法:
**docker export -o 导出后镜像文件名 [容器名称或者ID]**

```
[root@zutuanxue ~]# docker export -o zutuanxue_centos.tar centos76

[root@zutuanxue ~]# ls

anaconda-ks.cfg  centos_base.tar  Docker  zutuanxue_centos.tar
```

### 1.16、容器镜像导入到镜像库-import命令

将容器镜像导入到镜像库

用法:
**docker import 镜像文件名 镜像名:tag**

```
[root@zutuanxue ~]# docker import zutuanxue_centos.tar zutuanxue/centos7_6:latest
sha256:659fb2fca656430822627685ba4f29d09ae619cd9f2b42ef52d47003c8af8d11
```

### 1.17、将容器生成镜像-commit命令

将改变后的容器直接变成镜像，一般指的是封装好业务的容器，直接封装成镜像

用法:
**docker commit [容器名称或者ID] 导出后镜像的名字:tag**

```
[root@zutuanxue ~]# docker commit  centos76   zutuanxue/centos_7_6:v1

sha256:1f078c1d94dd641c65495bd91d3e471593c5ec60ecbb4492cfa18a161448dd3a
```