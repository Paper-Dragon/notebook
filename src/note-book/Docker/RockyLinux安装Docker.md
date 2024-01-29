# 一键安装docker



```shell
yum -y install epel-release \
  && yum install -y yum-utils device-mapper-persistent-data lvm2 \
  && yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo \
  && yum makecache \
  && yum -y install docker-ce \
  && systemctl enable docker \
  && systemctl start docker \
  && systemctl status docker -l
```

# 安装docker-compose

> 以centos上可以直接用yum安装docker-compose的，在rocky linux上有冲突，只好手动安装了。
>  手工安装的这个docker-compose版本，交互效果更好看些，不过也有问题“会多出一些莫名的空容器，状态为Created”。

```shell
docker_compose_version=v2.2.2 \
&& curl -L "https://github.com/docker/compose/releases/download/${docker_compose_version}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
&& chmod +x /usr/local/bin/docker-compose \
&& ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

> 自己搭建的加速链接，避免github龟速

```shell
 docker_compose_version=v2.2.2 \
&& curl -L "https://mirror-symbol.q32.top:8443/staticfile/software/虚拟化/docker/${docker_compose_version}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
&& chmod +x /usr/local/bin/docker-compose \
&& ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```