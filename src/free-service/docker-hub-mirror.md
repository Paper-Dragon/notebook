---
title: DockerHub镜像加速
icon: fa-brands fa-docker
breadcrumb: false
---
# Docker镜像拉取加速服务及配置指南

免费Docker镜像拉取加速服务，大陆地区无限速拉取。

私有镜像功能独家支持，源码闭源，防止滥用，按照以下步骤设置镜像站即可畅快使用。

功能独家支持：

- [支持Dockerhub账户直接登录镜像站](#步骤-1-登录到私有仓库)
- [支持拉取Dockerhub的私有仓库的镜像](#docker镜像站拉取私有账户的镜像)
- [支持推送镜像到Dockerhub账户](#docker通过镜像站推送镜像到dockerhub)
- [支持利用镜像站一键安装Docker](#一键安装docker)
- [支持一键配置Docker镜像加速](#Docker配置镜像dockerhub加速)

## Docker配置镜像Dockerhub加速

Docker镜像加速不同的操作系统有不同的设置方法，需要按照操作系统类型去设置，下面给出了Linux、Windows、Mac操作系统的设置方法。为了方便使用，Linux设置镜像站已经写为脚本。

### Linux

运行以下命令来配置镜像加速服务：

```bash
curl -sSL https://www.geekery.cn/sh/docker/set_docker_mirror.sh | bash
```

或者使用下面的命令进行配置

```bash
#!/bin/sh
cat <<-EOF > /etc/docker/daemon.json 
{
  "registry-mirrors": [
  	"https://hub.geekery.cn/",
  	"https://ghcr.geekery.cn"
  	]
}
EOF
systemctl daemon-reload
systemctl restart docker
```

这适用于Ubuntu 14.04、Debian、CentOS 6、CentOS 7、Fedora、Arch Linux、openSUSE Leap 42.1等系统。其他版本可能有细微不同，请访问官方文档获取更多详情。

### macOS

#### Docker For Mac

对于macOS上的Docker For Mac用户，您可以通过以下步骤配置镜像加速服务：

点击桌面顶栏的docker图标，选择Preferences。

在Daemon标签下的Registry mirrors列表中加入以下镜像地址：

```json
https://hub.geekery.cn/
https://ghcr.geekery.cn/
```

点击Apply & Restart按钮使设置生效。

Docker Toolbox 等配置方法请参考官方文档

### Windows

#### Docker For Windows

Windows系统上的Docker For Windows用户可以按照以下步骤配置镜像加速服务：

- 在桌面右下角状态栏中右键docker图标，修改在Docker Daemon标签页中的json。

- 将以下地址加入"registry-mirrors"的数组里。

  ```json
  https://hub.geekery.cn/
  https://ghcr.geekery.cn/
  ```

- 点击Apply，重新生成Docker环境以使配置生效。

如果您使用Docker Toolbox或其他配置方法，请参考官方文档获取详细指南。

## 一键安装Docker

一键安装脚本

```bash
curl -sSL get-docker.geekery.cn | bash
```

为了防止脚本卡住，于是我做了完整的镜像，包括脚本内的安装包仓库。

这个脚本会直接设置 [https://download-docker.geekery.cn](https://download-docker.geekery.cn) 为系统源的镜像加速。

然后替换掉原有的 [https://download.docker.com](https://download.docker.com) 域名。



## Docker镜像站拉取私有账户的镜像

### 步骤 1: 登录到私有仓库

首先，你需要登录到你的私有Docker仓库。在终端中运行以下命令，并替换 `[username]` 和 `[password]` 为你的用户名和密码：

```bash
docker login hub.geekery.cn -u [username] -p [password]
```

如果私有仓库使用了不同的认证机制，如Token认证，你也可以使用`--password-stdin`选项来输入你的Token：

```bash
docker login hub.geekery.cn -u [username] --password-stdin <<< "<token>"
```

### 步骤 2: 拉取镜像

一旦你成功登录，就可以从私有仓库中拉取镜像。使用`docker pull`命令加上仓库的完整URL以及镜像的名称和标签（如果有的话）。例如：

```bash
docker pull hub.geekery.cn/<namespace>/<imagename>:<tag>
```

这里 `<namespace>` 可以是用户名或组织名，`<imagename>` 是镜像的名字，`<tag>` 是镜像的版本标签。

### 步骤3：恢复默认镜像名

如果你想要如同DockerHub镜像一般直接不写域名直接跑，方便后面环境的使用，可以增加如下步骤恢复原有的镜像名称。

执行下面的命令将会更改Docker镜像的镜像站为Dockerhub，方便使用。

```bash
docker tag hub.geekery.cn/<namespace>/<imagename>:<tag> <namespace>/<imagename>:<tag>
```

这里 `<namespace>` 可以是用户名或组织名，`<imagename>` 是镜像的名字，`<tag>` 是镜像的版本标签。



## Docker通过镜像站推送镜像到Dockerhub

### 步骤 1: 确保已登录

首先，确保你已经登录到你的私有Docker仓库。如果还没有登录，可以使用以下命令：

```bash
docker login hub.geekery.cn
```

然后，系统会提示你输入用户名和密码。

### 步骤 2: 标记镜像

在推送镜像前，你需要标记（tag）镜像以便它知道应该被推送到哪个仓库。使用以下格式的命令来标记镜像：

```bash
docker tag <local-image-name>:<local-tag> hub.geekery.cn/<namespace>/<imagename>:<tag>
```

例如，如果你有一个名为 `myimage` 的本地镜像，并且你想将其推送到 `hub.geekery.cn` 上的 `myuser` 名下的 `myrepo` 仓库，使用如下命令：

```bash
docker tag myimage:latest hub.geekery.cn/myuser/myrepo:latest
```

### 步骤 3: 推送镜像

一旦镜像被正确标记，你就可以使用 `docker push` 命令将其推送到私有仓库：

```bash
docker push hub.geekery.cn/<namespace>/<imagename>:<tag>
```

例如：

```bash
docker push hub.geekery.cn/myuser/myrepo:latest
```

这将把标记过的镜像推送到你的私有仓库，然后回到dockerhub检查，镜像已经推送到dockerhub当中去了。



## 你用的节点在哪里？



::: info
<div id="mobaxterm">
    <iframe style="height:800px" src="https://cloudflare-cloudnative-pages.geekery.cn/docker"></iframe>
</div>


:::



