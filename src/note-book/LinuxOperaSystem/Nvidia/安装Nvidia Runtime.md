# 安装Nvidia Runtime



> 参考链接
>
> - https://nvidia.github.io/nvidia-container-runtime/
> - https://github.com/NVIDIA/nvidia-container-runtime

## 导入软件库

### 根据操作系统分类导入

#### 基于Debian的操作系统

```
curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | \
  sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
sudo apt-get update
```

For pre-releases, you need to enable the experimental repos of all dependencies:

```
sudo sed -i -e '/experimental/ s/^#//g' /etc/apt/sources.list.d/nvidia-container-runtime.list
sudo apt-get update
```

To later disable the experimental repos of all dependencies, you can run:

```
sudo sed -i -e '/experimental/ s/^/#/g' /etc/apt/sources.list.d/nvidia-container-runtime.list
sudo apt-get update
```

#### 基于RHEL的操作系统

```
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.repo | \
  sudo tee /etc/yum.repos.d/nvidia-container-runtime.repo
```

For pre-releases, you need to enable the experimental repos of all dependencies:

```
sudo yum-config-manager --enable libnvidia-container-experimental
sudo yum-config-manager --enable nvidia-container-experimental
```

To later disable the experimental repos of all dependencies, you can run:

```
sudo yum-config-manager --disable libnvidia-container-experimental
sudo yum-config-manager --disable nvidia-container-runtime-experimental
```

### 更新仓库的验证key

In order to update the nvidia-container-runtime repository key for your distribution, follow the instructions below.

#### 基于RHEL的操作系统

```
DIST=$(sed -n 's/releasever=//p' /etc/yum.conf)
DIST=${DIST:-$(. /etc/os-release; echo $VERSION_ID)}
sudo rpm -e gpg-pubkey-f796ecb0
sudo gpg --homedir /var/lib/yum/repos/$(uname -m)/$DIST/nvidia-container-runtime/gpgdir --delete-key f796ecb0
sudo yum makecache
```

#### 基于Debian的操作系统

```
curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | \
  sudo apt-key add -
```

## 安装Nvidia Runtime

### 安装

#### 基于Debian的操作系统

1. Install the repository for your distribution by following the instructions [here](http://nvidia.github.io/nvidia-container-runtime/).
2. Install the `nvidia-container-runtime` package:

```
sudo apt-get install nvidia-container-runtime
```

#### 基于RHEL的操作系统

1. Install the repository for your distribution by following the instructions [here](http://nvidia.github.io/nvidia-container-runtime/).
2. Install the `nvidia-container-runtime` package:

```
sudo yum install nvidia-container-runtime
```

### 配置Docker引擎

#### 方法一

> 直接将Runtime增加进Docker

##### Systemd drop-in file

```
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/override.conf <<EOF
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd --host=fd:// --add-runtime=nvidia=/usr/bin/nvidia-container-runtime
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

##### Daemon configuration file

```
sudo tee /etc/docker/daemon.json <<EOF
{
    "runtimes": {
        "nvidia": {
            "path": "/usr/bin/nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
EOF
sudo pkill -SIGHUP dockerd
```

You can optionally reconfigure the default runtime by adding the following to `/etc/docker/daemon.json`:

```
"default-runtime": "nvidia"
```

##### Command line

```
sudo dockerd --add-runtime=nvidia=/usr/bin/nvidia-container-runtime [...]
```



#### 方法二

> 在docker 运行时增加nvidia设备

example

```bash
docker run -p 8000:8000 -d --name jupyterhub  --restart=always --gpus all muaimingjun/jupyterhub:1.0.0

```

## 重启Dockerd进程

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

