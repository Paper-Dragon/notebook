# 一、docker镜像管理

### 1.1、镜像搜索-search

```
从docker镜像仓库模糊搜索镜像
用法：
	docker search 镜像关键字

[root@zutuanxue ~]# docker search centos

NAME          DESCRIPTION           STARS     OFFICIAL        AUTOMATED
centos   The official build of CentOS.   5674   [OK]                


#字段说明：
NAME:镜像名称
DESCRIPTION:镜像描述 
STARS：镜像星级，数字越大表示用的人越多
OFFICIAL:是否为官方  跟[OK]说明是官方
AUTOMATED: 是否为自动化构建的镜像
```

### 1.2、镜像下载-pull命令

从docker指定的仓库下载镜像到本地
用法:
**docker pull 镜像名称**

```
[root@zutuanxue ~]# docker pull centos

Using default tag: latest
latest: Pulling from library/centos
729ec3a6ada3: Pull complete 
Digest: sha256:f94c1d992c193b3dc09e297ffd54d8a4f1dc946c37cbeceb26d35ce1647f88d9
Status: Downloaded newer image for centos:latest
docker.io/library/centos:latest
```

### 1.3、本地镜像查看-images命令

查看本地存储的镜像

```
[root@zutuanxue ~]# docker images
REPOSITORY                   TAG                 IMAGE ID            CREATED             SIZE
docker.io/gitlab/gitlab-ce   latest              515ad1a75677        7 weeks ago         1.9 GB
docker.io/redis              latest              1319b1eaa0b7        7 weeks ago         104 MB

#字段说明：
REPOSITORY:镜像的名字
TAG：镜像的标签
IMAGE ID：镜像的ID号
CREATED：镜像建立时间
SIZE: 镜像大小
```

### 1.4、镜像详细信息-inspect命令

显示镜像的详细导入由save保存出来的压缩文件镜像

用法:
**docker load -i 镜像压缩文件名称 [镜像名称或者ID]**

```
[root@zutuanxue ~]# docker load -i centos_base.tar 

Loaded image: centos:latest信息

用法:
	docker inspect [镜像名称或者ID]

[root@zutuanxue ~]# docker inspect 0f3e07c0138f 
[
    {
        "Id": "sha256:0f3e07c0138fbe05abcb7a9cc7d63d9bd4c980c3f61fea5efa32e7c4217ef4da",
        "RepoTags": [
            "centos:latest"
        ],
        "RepoDigests": [
            "centos@sha256:f94c1d992c193b3dc09e297ffd54d8a4f1dc946c37cbeceb26d35ce1647f88d9"
        ],
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
                "MergedDir": "/var/lib/docker/overlay2/e84fb0b30e3f1cd4a40d2ee6ed522736aedad13fcfce3571075ebbbd665aab4a/merged",
                "UpperDir": "/var/lib/docker/overlay2/e84fb0b30e3f1cd4a40d2ee6ed522736aedad13fcfce3571075ebbbd665aab4a/diff",
                "WorkDir": "/var/lib/docker/overlay2/e84fb0b30e3f1cd4a40d2ee6ed522736aedad13fcfce3571075ebbbd665aab4a/work"
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
            "LastTagTime": "0001-01-01T00:00:00Z"
        }
    }
]
```

### 1.5、本地镜像删除-rmi命令

删除本地镜像库中的某个镜像

用法:
**docker rmi [镜像名称或者ID]**

```
[root@zutuanxue ~]# docker rmi centos

Untagged: centos:latest
Untagged: centos@sha256:f94c1d992c193b3dc09e297ffd54d8a4f1dc946c37cbeceb26d35ce1647f88d9
Deleted: sha256:0f3e07c0138fbe05abcb7a9cc7d63d9bd4c980c3f61fea5efa32e7c4217ef4da
Deleted: sha256:9e607bb861a7d58bece26dd2c02874beedd6a097c1b6eca5255d5eb0d2236983
```

### 1.6、镜像保存-save命令

保存镜像为压缩文件

用法:
**docker save -o 压缩文件名称 [镜像名称或者ID]**

```
[root@zutuanxue ~]# docker save -o centos_base.tar centos

[root@zutuanxue ~]# ls

anaconda-ks.cfg  centos_base.tar
```

### 1.7、镜像载入-load命令

导入由save保存出来的压缩文件镜像

用法:
**docker load -i 镜像压缩文件名称 [镜像名称或者ID]**

```
[root@zutuanxue ~]# docker load -i centos_base.tar 

Loaded image: centos:latest
```

### 1.8、镜像管理命令-image命令

镜像管理命令，和上面的命令相似

```
[root@zutuanxue ~]# docker image --help
Usage:	docker image COMMAND
Manage images

Commands:
  build       Build an image from a Dockerfile
  history     Show the history of an image
  import      Import the contents from a tarball to create a filesystem image
  inspect     Display detailed information on one or more images
  load        Load an image from a tar archive or STDIN
  ls          List images
  prune       Remove unused images
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rm          Remove one or more images
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
```