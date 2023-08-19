# 一、docker安装

Docker 是管理容器的工具， Docker 不等于 容器。

### 1.1、docker yum源设置

```
#step 1 download docker-ce.repo file

[root@zutuanxue ~]# wget https://download.docker.com/linux/centos/docker-ce.repo -P /etc/yum.repos.d/

--2019-11-14 20:46:09--  https://download.docker.com/linux/centos/docker-ce.repo
正在解析主机 download.docker.com (download.docker.com)... 13.35.50.117, 13.35.50.10, 13.35.50.93, ...
正在连接 download.docker.com (download.docker.com)|13.35.50.117|:443... 已连接。
已发出 HTTP 请求，正在等待回应... 200 OK
长度：2424 (2.4K) [binary/octet-stream]
正在保存至: “/etc/yum.repos.d/docker-ce.repo.1”

100%[==================================================>] 2,424       --.-K/s 用时 0s      

2019-11-14 20:46:09 (210 MB/s) - 已保存 “/etc/yum.repos.d/docker-ce.repo.1” [2424/2424])

#step 2 change docker yum repo from tsinghua web

[root@zutuanxue ~]# sed -i 's#download.docker.com#mirrors.tuna.tsinghua.edu.cn/docker-ce#g' /etc/yum.repos.d/docker-ce.repo
```

### 1.2、docker 安装

#### 1.2.1、卸载旧版本

```
[root@zutuanxue ~]#  yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
```

#### 1.2.2、安装docker

```
[root@zutuanxue ~]# yum -y install  https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm

[root@zutuanxue ~]# yum -y install docker-ce
```

#### 1.2.3、启动docker

```
[root@zutuanxue ~]# systemctl enable docker

Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.

[root@zutuanxue ~]# systemctl start docker
```

### 1.3、验证启动

```
[root@zutuanxue ~]# systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since 四 2019-11-14 20:53:12 EST; 14s ago
     Docs: https://docs.docker.com
 Main PID: 1584 (dockerd)
    Tasks: 12
   Memory: 60.7M
   CGroup: /system.slice/docker.service
           └─1584 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock

11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.366007531-05:00" level=info msg="scheme \"unix\" not registered, fallback to defau...odule=grpc
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.366028377-05:00" level=info msg="ccResolverWrapper: sending update to cc: {[{unix:...odule=grpc
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.366036593-05:00" level=info msg="ClientConn switching balancer to \"pick_first\"" module=grpc
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.404043665-05:00" level=info msg="Loading containers: start."
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.547472878-05:00" level=info msg="Default bridge (docker0) is assigned with an IP a...P address"
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.588359436-05:00" level=info msg="Loading containers: done."
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.733704268-05:00" level=info msg="Docker daemon" commit=a872fc2f86 graphdriver(s)=o...on=19.03.3
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.733826656-05:00" level=info msg="Daemon has completed initialization"
11月 14 20:53:12 zutuanxue systemd[1]: Started Docker Application Container Engine.
11月 14 20:53:12 zutuanxue dockerd[1584]: time="2019-11-14T20:53:12.753929596-05:00" level=info msg="API listen on /var/run/docker.sock"
Hint: Some lines were ellipsized, use -l to show in full.
```

### 1.4、验证版本

```
[root@zutuanxue ~]# docker -v

Docker version 19.03.1, build 74b1e89
```

# 二、docker client 和 daemon分离

### docker client 与 daemon分离

```
1、关闭docker

[root@zutuanxue ~]# systemctl stop docker

2、修改docker启动方式，要求加载配置文件启动

[root@zutuanxue ~]# sed -i.bak '/^ExecStart=/c\ExecStart=\/usr\/bin\/dockerd' /usr/lib/systemd/system/docker.service

3、设置docker配置文件,默认没有

设置允许监听地址和端口，以及sock文件连接

默认是使用sock方式连接，加tcp：//0.0.0.0:2375可实现远程管理

[root@zutuanxue ~]# cat /etc/docker/daemon.json 
{
 "hosts": ["tcp://0.0.0.0:2375","unix:///var/run/docker.sock"]
}

4、重载docker服务、重启docker生效配置

[root@zutuanxue ~]# systemctl daemon-reload

[root@zutuanxue ~]# systemctl restart docker

5、查看docker的监听地址和端口

[root@zutuanxue ~]# netstat -ntpl |grep 2375

tcp6   0  0 :::2375  :::*   LISTEN 21219/dockerd 

6、客户端连接docker daemon，执行命令

[root@zutuanxue ~]# docker -H 192.168.98.240 images
```