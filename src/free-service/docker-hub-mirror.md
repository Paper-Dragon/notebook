---
title: DockerHub镜像加速
icon: fa-brands fa-docker
breadcrumb: false
---
# Docker镜像拉取加速服务及配置指南

免费Docker镜像拉取加速服务，需要按照以下步骤进行配置：

## Linux
在Linux系统中，运行以下命令来配置镜像加速服务：

```bash
curl -sSL https://www.geekery.cn/sh/docker/set_mirror.sh | bash
```

或者

```bash
#!/bin/sh
cat <<-EOF > /etc/docker/daemon.json 
{
  "registry-mirrors": ["https://hub.geekery.cn/"]
}
EOF
systemctl daemon-reload
systemctl restart docker
```

这适用于Ubuntu 14.04、Debian、CentOS 6、CentOS 7、Fedora、Arch Linux、openSUSE Leap 42.1等系统。其他版本可能有细微不同，请访问官方文档获取更多详情。

## macOS

### Docker For Mac

对于macOS上的Docker For Mac用户，您可以通过以下步骤配置镜像加速服务：

点击桌面顶栏的docker图标，选择Preferences。

在Daemon标签下的Registry mirrors列表中加入以下镜像地址：

```json
https://hub.geekery.cn/
```

点击Apply & Restart按钮使设置生效。

Docker Toolbox 等配置方法请参考官方文档

## Windows

### Docker For Windows

Windows系统上的Docker For Windows用户可以按照以下步骤配置镜像加速服务：

- 在桌面右下角状态栏中右键docker图标，修改在Docker Daemon标签页中的json。

- 将以下地址加入"registry-mirrors"的数组里。

  ```json
  https://hub.geekery.cn/
  ```

- 点击Apply，重新生成Docker环境以使配置生效。

如果您使用Docker Toolbox或其他配置方法，请参考官方文档获取详细指南。



感谢您选择我们提供的Docker镜像加速服务！如果您需要进一步的协助或有任何疑问，评论区联系我。