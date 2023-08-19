在Docker中，当我们执行 docker pull xxx 的时候 ，它实际上是从 hub.docker.com 这个地址去查找，这就是 Docker 公司为我们提供的公共仓库。在工作中，我们不可能把企业项目 push 到公有仓库进行管理。所以为了更好的管理镜像，Docker 不仅提供了一个中央仓库，同时也允许我们搭建本地私有仓库。

docker容器镜像仓库分类：

- 公网仓库：docker hub
- 私网仓库: registry、harbor

## 一、registry镜像仓库

### 1.1、 registry 仓库搭建

**搭建步骤**

- 拉取 registry 容器镜像
- 创建 registry 仓库容器
- 测试容器应用

**搭建过程**
a、拉取registry容器镜像

```
docker pull registry 
```

b、创建registry仓库容器

```
1、创建持久化存储，将容器镜像存储目录/var/lib/registry挂载到本地/opt/myregistry下：

mkdir /opt/myregistry

2、创建 registry 容器：

docker run -d -p 5000:5000 -v /opt/myregistry:/var/lib/registry  --restart=always registry:latest

3、查看容器是否运行

docker ps

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
6b20b55fe6f8        registry:latest     "/entrypoint.sh /etc…"   2 minutes ago       Up 2 minutes        0.0.0.0:5000->5000/tcp   busy_mclean
```

c、测试容器应用

```
[root@zutuanxue_manage01 ~]# curl http://192.168.1.150:5000/v2/_catalog
{"repositories":[]}

显示仓库中没有任何镜像
```

### 1.2、registry仓库应用-上传镜像

**上传镜像步骤**

- 设置docker仓库为registry本地仓库
- 给需要存储的镜像打tag
- 上传镜像到registry仓库

**演示案例**

**将baishuming2020/centos_nginx:latest上传到仓库**

**查看当前本地镜像**

```
[root@zutuanxue_manage01 ~]# docker images
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
baishuming2020/centos_nginx    latest              bcd9f28f6126        33 minutes ago      447MB
baishuming2020/centos_8_base   latest              3e9f682f8459        47 minutes ago      200MB
centos                         latest              0f3e07c0138f        6 weeks ago         220MB
registry                       latest              f32a97de94e1        8 months ago        25.8MB
```

a、设置docker仓库为registry本地仓库

```
#1、修改docker进程启动文件，修改其启动方式，目的是为了让通过docker配置文件启动
[root@zutuanxue_manage01 ~]# sed -i.bak '/^ExecStart=/c\ExecStart=\/usr\/bin\/dockerd' /usr/lib/systemd/system/docker.service

#2、设置docker 守护进程的配置文件 /etc/docker/daemon.json,默认没有该文件
[root@zutuanxue_manage01 ~]# cat /etc/docker/daemon.json 
{
 "insecure-registries": ["http://192.168.1.150:5000"]
}

insecure-registries 指定非安全的仓库地址，多个用逗号隔开

#3、重启docker生效配置文件
[root@zutuanxue_manage01 ~]# systemctl daemon-reload
[root@zutuanxue_manage01 ~]# systemctl restart docker
```

b、给需要存储的镜像打tag

```
[root@zutuanxue_manage01 ~]# docker tag baishuming2020/centos_nginx:latest 192.168.1.150:5000/centos_nginx:v1

[root@zutuanxue_manage01 ~]# docker images
REPOSITORY                         TAG                 IMAGE ID            CREATED             SIZE
192.168.98.240:5000/centos_nginx   v1                  bcd9f28f6126        45 minutes ago      447MB
baishuming2020/centos_nginx        latest              bcd9f28f6126        45 minutes ago      447MB
baishuming2020/centos_8_base       latest              3e9f682f8459        59 minutes ago      200MB
centos                             latest              0f3e07c0138f        6 weeks ago         220MB
registry                           latest              f32a97de94e1        8 months ago        25.8MB
```

c、上传镜像到registry仓库

```
#1、上传镜像
[root@zutuanxue_manage01 ~]# docker push 192.168.98.240:5000/centos_nginx:v1
The push refers to repository [192.168.98.240:5000/centos_nginx]
1da799aaf1ec: Pushed 
f598357997c6: Pushed 
630012d2d35b: Pushed 
4dcde7ab808a: Pushed 
64dc1b92ebb6: Pushed 
7db2133dafb9: Pushed 
fd05189e6e81: Pushed 
ee645629aa71: Pushed 
v1: digest: sha256:507a5ad9dd5771cdf461a6fa24c3fff6ea9eabd6945abf03e9264d3130fe816b size: 1996

#2、查看上传
[root@zutuanxue_manage01 ~]# curl http://192.168.98.240:5000/v2/_catalog
{"repositories":["centos_nginx"]}

#查看存储文件夹
[root@zutuanxue_manage01 ~]# ls /opt/docker_repos/docker/registry/v2/repositories/centos_nginx/
_layers  _manifests  _uploads
```

### 1.3、 registry仓库应用-客户端下载镜像

- 设置客户端docker仓库为registry仓库
- 拉取镜像到本地

**演示案例**

**要求192.168.98.241[hostname:zutuanxue_node1]机器的容器可以下载registry仓库中的镜像**

a、设置192.168.1.151[hostname:zutuanxue_node1]机器的docker仓库为registry仓库

```
#1、设置docker启动文件
[root@zutuanxue_node1 ~]# sed -i.bak '/^ExecStart=/c\ExecStart=\/usr\/bin\/dockerd' /usr/lib/systemd/system/docker.service

#2、设置docker配置文件
[root@zutuanxue_node1 ~]# cat  /etc/docker/daemon.json 
{
 "insecure-registries": ["http://192.168.1.150:5000"]
}
```

b、下载镜像
192.168.1.151[hostname:zutuanxue_node1]机器上的docker可以拉取registry仓库中的192.168.1.150:5000/centos_nginx:v1容器镜像

```
[root@zutuanxue_node1 ~]# docker pull 192.168.1.150:5000/centos_nginx:v1
v1: Pulling from centos_nginx
dcd04d454f16: Pull complete 
5cb2e05aa6e1: Pull complete 
870634eb98b4: Pull complete 
0fae9697ee4b: Pull complete 
18ad57cfcecb: Pull complete 
64dd6f0d85c1: Pull complete 
7178b0b4388e: Pull complete 
34de8795cd41: Pull complete 
Digest: sha256:507a5ad9dd5771cdf461a6fa24c3fff6ea9eabd6945abf03e9264d3130fe816b
Status: Downloaded newer image for 192.168.98.240:5000/centos_nginx:v1
192.168.98.240:5000/centos_nginx:v1

#验证下载
[root@zutuanxue_node1 ~]# docker images
REPOSITORY                         TAG                 IMAGE ID            CREATED             SIZE
192.168.1.150:5000/centos_nginx   v1                  bcd9f28f6126        4 hours ago         447MB
```

### 1.4、registry带basic认证的仓库

**实现步骤**

- 安装需要认证的包
- 创建存放认证信息的文件
- 创建认证信息
- 创建带认证的registry容器
- 指定仓库地址
- 登录认证

**实现过程**
a、安装需要认证的包

```
yum -y install httpd-tools
```

b、创建存放认证信息的文件

```
mkdir -p /opt/registry-var/auth
```

c、创建认证信息

```
htpasswd -Bbn zutuanxue 123456 >> /opt/registry-var/auth/htpasswd
```

d、创建带认证的registry容器

```
docker run -d -p 10000:5000 --restart=always --name registry \
-v  /opt/registry-var/auth:/auth \
-v /opt/myregistry:/var/lib/registry \
-e "REGISTRY_AUTH=htpasswd" \
-e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
-e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \
registry:latest
```

e、指定仓库地址

```
cat /etc/docker/daemon.json 
{
 "insecure-registries": ["http://192.168.1.150:5000","http://192.168.1.150:10000"]
}
```

f、登录认证

```
docker login 192.168.1.150:10000
Username：zutuanxue
Password：123456
```

### 二、 harbor镜像仓库

Harbor离线安装包下载地址：https://github.com/goharbor/harbor

docker-compose版本选择:https://github.com/docker/compose/releases

### 2.1 harbor下载

```
[root@centos8_manage01 ~]# wget https://storage.googleapis.com/harbor-releases/release-1.9.0/harbor-offline-installer-v1.9.2-rc1.tgz
```

### 2.2 docker-compose安装

容器编排工具，执行./install.sh时需要。如果不安装，一会重启docker服务，相关的harbor容器会死掉，安装后就会被随着docker重启

```
curl -L https://github.com/docker/compose/releases/download/1.25.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2.3 harbor安装

```
[root@centos8_manage01 ~]# tar xf harbor-offline-installer-v1.9.2-rc1.tgz 

[root@centos8_manage01 ~]# mv harbor /opt/
[root@centos8_manage01 ~]# /opt/harbor/prepare 
prepare base dir is set to /opt/harbor
Unable to find image 'goharbor/prepare:v1.9.2' locally
v1.9.2: Pulling from goharbor/prepare
b950b5dd94ab: Pull complete 
cc7bb94ca291: Pull complete 
d6a642502e65: Pull complete 
21510274066b: Pull complete 
04998692a2c0: Pull complete 
ae8f4647fe53: Pull complete 
cee24c721c12: Pull complete 
Digest: sha256:a647780bcd7f5fdcc9696332c9bca90f290912ecb41bd15c4c1a516450597bc2
Status: Downloaded newer image for goharbor/prepare:v1.9.2
Generated configuration file: /config/log/logrotate.conf
Generated configuration file: /config/log/rsyslog_docker.conf
Generated configuration file: /config/nginx/nginx.conf
Generated configuration file: /config/core/env
Generated configuration file: /config/core/app.conf
Generated configuration file: /config/registry/config.yml
Generated configuration file: /config/registryctl/env
Generated configuration file: /config/db/env
Generated configuration file: /config/jobservice/env
Generated configuration file: /config/jobservice/config.yml
Generated and saved secret to file: /secret/keys/secretkey
Generated certificate, key file: /secret/core/private_key.pem, cert file: /secret/registry/root.crt
Generated configuration file: /compose_location/docker-compose.yml
Clean up the input dir



修改配置文件中的主机名为本机域名或IP
[root@centos8_manage01 ~]# grep "^hostname" /opt/harbor/harbor.yml 
hostname: 192.168.98.240



[root@centos8_manage01 ~]# /opt/harbor/install.sh 

[Step 0]: checking installation environment ...

Note: docker version: 19.03.1
/usr/lib/python2.7/site-packages/requests/__init__.py:91: RequestsDependencyWarning: urllib3 (1.24.3) or chardet (2.2.1) doesn't match a supported version!
  RequestsDependencyWarning)

Note: docker-compose version: 1.24.1

[Step 1]: loading Harbor images ...
6ef530defbe4: Loading layer  63.49MB/63.49MB
55872518448e: Loading layer  54.42MB/54.42MB
070787ce276e: Loading layer  5.632kB/5.632kB
1ddc8ebef7e9: Loading layer  2.048kB/2.048kB
94ec70036213: Loading layer   2.56kB/2.56kB
87f88832870d: Loading layer   2.56kB/2.56kB
208968317bf9: Loading layer   2.56kB/2.56kB
ab6259c81a01: Loading layer  10.24kB/10.24kB
Loaded image: goharbor/harbor-db:v1.9.2
92e51ca4c459: Loading layer  9.005MB/9.005MB
9e12eb4a5a82: Loading layer  3.072kB/3.072kB
913c064dae30: Loading layer  21.76MB/21.76MB
b28cae8255d8: Loading layer  3.072kB/3.072kB
890572f32fd2: Loading layer  8.661MB/8.661MB
6f00be7ade9a: Loading layer  30.42MB/30.42MB
Loaded image: goharbor/harbor-registryctl:v1.9.2
51bada9a03ba: Loading layer  78.25MB/78.25MB
bdd423614a28: Loading layer  3.072kB/3.072kB
e44c809a7328: Loading layer   59.9kB/59.9kB
07d91c85aa68: Loading layer  61.95kB/61.95kB
Loaded image: goharbor/redis-photon:v1.9.2
e0a372c4d5d3: Loading layer  10.84MB/10.84MB
Loaded image: goharbor/nginx-photon:v1.9.2
99f324455426: Loading layer  115.7MB/115.7MB
dbde533bd1f2: Loading layer  12.29MB/12.29MB
32adabde1b24: Loading layer  2.048kB/2.048kB
cdedbb7b738d: Loading layer  48.13kB/48.13kB
60eb6ca8f5f9: Loading layer  3.072kB/3.072kB
05fadada21a7: Loading layer  12.34MB/12.34MB
Loaded image: goharbor/clair-photon:v2.0.9-v1.9.2
fbe05936a49e: Loading layer  12.77MB/12.77MB
8dc691e9365f: Loading layer  55.38MB/55.38MB
c83233ecc176: Loading layer  5.632kB/5.632kB
de775c6f50f5: Loading layer  36.35kB/36.35kB
525709237f01: Loading layer  55.38MB/55.38MB
Loaded image: goharbor/harbor-core:v1.9.2
734abd864add: Loading layer  12.77MB/12.77MB
74033d37bf08: Loading layer  48.13MB/48.13MB
Loaded image: goharbor/harbor-jobservice:v1.9.2
6677f529d41e: Loading layer  9.005MB/9.005MB
019a95ff5e80: Loading layer  3.072kB/3.072kB
4b3792cedc69: Loading layer   2.56kB/2.56kB
274f5851694b: Loading layer  21.76MB/21.76MB
68e937b2af9e: Loading layer  21.76MB/21.76MB
Loaded image: goharbor/registry-photon:v2.7.1-patch-2819-2553-v1.9.2
Loaded image: goharbor/prepare:v1.9.2
0566b1894f2e: Loading layer  9.009MB/9.009MB
b99c86e48679: Loading layer  44.41MB/44.41MB
283ba1db5c52: Loading layer  2.048kB/2.048kB
701de676a8f6: Loading layer  3.072kB/3.072kB
c923d0b0255c: Loading layer  44.41MB/44.41MB
Loaded image: goharbor/chartmuseum-photon:v0.9.0-v1.9.2
ef4a961407c7: Loading layer  9.004MB/9.004MB
7cf94e5011b7: Loading layer  6.239MB/6.239MB
5c984b34ecb2: Loading layer   16.4MB/16.4MB
f06fb877e324: Loading layer  29.21MB/29.21MB
ae07ec384ebd: Loading layer  22.02kB/22.02kB
864698f2b94d: Loading layer  51.85MB/51.85MB
Loaded image: goharbor/notary-server-photon:v0.6.1-v1.9.2
c953b6400a8b: Loading layer   50.3MB/50.3MB
2ee784d17d84: Loading layer  3.584kB/3.584kB
c71f6b26fd01: Loading layer  3.072kB/3.072kB
bb6389098841: Loading layer   2.56kB/2.56kB
b63da553de9f: Loading layer  3.072kB/3.072kB
62a479d14974: Loading layer  3.584kB/3.584kB
aa3fee5917b8: Loading layer  12.29kB/12.29kB
Loaded image: goharbor/harbor-log:v1.9.2
691af8d2c981: Loading layer   14.9MB/14.9MB
7878347ee491: Loading layer  29.21MB/29.21MB
433f16e7c539: Loading layer  22.02kB/22.02kB
ad0202306aed: Loading layer  50.34MB/50.34MB
Loaded image: goharbor/notary-signer-photon:v0.6.1-v1.9.2
62247cb7cb19: Loading layer  337.8MB/337.8MB
d8b748aaf7dd: Loading layer  119.8kB/119.8kB
Loaded image: goharbor/harbor-migrator:v1.9.2
d9705202f79f: Loading layer  7.036MB/7.036MB
3fdb77b47894: Loading layer  196.6kB/196.6kB
8901bb1db41e: Loading layer    172kB/172kB
baf9307d1844: Loading layer  15.36kB/15.36kB
1dcfba9b1bd1: Loading layer  3.584kB/3.584kB
90a90fef2f80: Loading layer  10.84MB/10.84MB
Loaded image: goharbor/harbor-portal:v1.9.2


[Step 2]: preparing environment ...
prepare base dir is set to /opt/harbor
Clearing the configuration file: /config/log/logrotate.conf
Clearing the configuration file: /config/log/rsyslog_docker.conf
Clearing the configuration file: /config/nginx/nginx.conf
Clearing the configuration file: /config/core/env
Clearing the configuration file: /config/core/app.conf
Clearing the configuration file: /config/registry/config.yml
Clearing the configuration file: /config/registryctl/env
Clearing the configuration file: /config/registryctl/config.yml
Clearing the configuration file: /config/db/env
Clearing the configuration file: /config/jobservice/env
Clearing the configuration file: /config/jobservice/config.yml
Generated configuration file: /config/log/logrotate.conf
Generated configuration file: /config/log/rsyslog_docker.conf
Generated configuration file: /config/nginx/nginx.conf
Generated configuration file: /config/core/env
Generated configuration file: /config/core/app.conf
Generated configuration file: /config/registry/config.yml
Generated configuration file: /config/registryctl/env
Generated configuration file: /config/db/env
Generated configuration file: /config/jobservice/env
Generated configuration file: /config/jobservice/config.yml
loaded secret from file: /secret/keys/secretkey
Generated configuration file: /compose_location/docker-compose.yml
Clean up the input dir

/usr/lib/python2.7/site-packages/requests/__init__.py:91: RequestsDependencyWarning: urllib3 (1.24.3) or chardet (2.2.1) doesn't match a supported version!
  RequestsDependencyWarning)


[Step 3]: starting Harbor ...
/usr/lib/python2.7/site-packages/requests/__init__.py:91: RequestsDependencyWarning: urllib3 (1.24.3) or chardet (2.2.1) doesn't match a supported version!
  RequestsDependencyWarning)
Creating network "harbor_harbor" with the default driver
Creating harbor-log ... done
Creating harbor-portal ... done
Creating redis         ... done
Creating registryctl   ... done
Creating registry      ... done
Creating harbor-db     ... done
Creating harbor-core   ... done
Creating nginx             ... done
Creating harbor-jobservice ... done

✔ ----Harbor has been installed and started successfully.----

Now you should be able to visit the admin portal at http://192.168.98.240. 
For more details, please visit https://github.com/goharbor/harbor .
```

### 2.4 docker设置仓库为harbor

```
1、docker服务启动文件
#ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock   注释或者将[-H fd:// --containerd=/run/containerd/containerd.sock]删除
ExecStart=/usr/bin/dockerd         
这样做的目的是让daemon.json管理docker进程

2、创建docker守护进程配置文件
[root@centos8_manage01 harbor]# cat /etc/docker/daemon.json 
{
        "insecure-registries": ["http://192.168.98.240"]
}
```

### 2.5 镜像上传到harbor

```
#登陆harbor
[root@centos8_manage01 harbor]# docker login http://192.168.98.240 -u admin -p Harbor12345
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded


#修改镜像name:tag为harbor仓库名
[root@centos8_manage01 harbor]# docker tag baishuming2020:latest 192.168.98.240/library/centos_web:v1

#上传镜像
[root@centos8_manage01 harbor]# docker push 192.168.98.240/library/centos_web:v1
The push refers to repository [192.168.98.240/library/centos_web]
968786242e9d: Pushed 
v1: digest: sha256:d204253a33c6c2c74273fbd003cf3e14a48bcdd5c7bc10f51ccbad9e4dd39699 size: 528
```

## 常见问题

docker-compose命令无法使用
[root@centos8_manage01 ~]# docker-compose ps
ERROR:
Can’t find a suitable configuration file in this directory or any
parent. Are you in the right directory?

```
    Supported filenames: docker-compose.yml, docker-compose.yaml
```

原因： **当前目录没有配置文件**

```
正确执行路径   harbor安装目录
[root@centos8_manage01 harbor]# docker-compose ps 
      Name                     Command                State               Ports          
-----------------------------------------------------------------------------------------
harbor-core         /harbor/harbor_core              Up                                  
harbor-db           /docker-entrypoint.sh            Up         5432/tcp                 
harbor-jobservice   /harbor/harbor_jobservice  ...   Up                                  
harbor-log          /bin/sh -c /usr/local/bin/ ...   Up         127.0.0.1:1514->10514/tcp
harbor-portal       nginx -g daemon off;             Up         8080/tcp                 
nginx               nginx -g daemon off;             Up         0.0.0.0:80->8080/tcp     
redis               redis-server /etc/redis.conf     Up         6379/tcp                 
registry            /entrypoint.sh /etc/regist ...   Up         5000/tcp                 
registryctl         /harbor/start.sh                 Exit 137        
```