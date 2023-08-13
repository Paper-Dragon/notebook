# 一键运行web版本的vscode



## 安装docker-compose

以centos上可以直接用yum安装docker-compose的，在rocky linux上有冲突，只好手动安装了。 手工安装的这个docker-compose版本，交互效果更好看些，不过也有问题“会多出一些莫名的空容器，状态为Created”。

```bash
docker_compose_version=v2.2.2 \
&& curl -L "https://github.com/docker/compose/releases/download/${docker_compose_version}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
&& chmod +x /usr/local/bin/docker-compose \
&& ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

自己搭建的加速链接，避免github龟速

```bsah
docker_compose_version=v2.2.2 \
&& curl -L "https://mirror-symbol.q32.top:8443/staticfile/software/%E8%99%9A%E6%8B%9F%E5%8C%96/docker/${docker_compose_version}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
&& chmod +x /usr/local/bin/docker-compose \
&& ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

## docker-compose

```yaml
---
version: "2.1"
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    container_name: code-server
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - PASSWORD=password #optional
      #- HASHED_PASSWORD= #optional
      - SUDO_PASSWORD=password #optional
      #- SUDO_PASSWORD_HASH= #optional
      #- PROXY_DOMAIN=code-server.my.domain #optional
      - DEFAULT_WORKSPACE=/config/workspace #optional
    volumes:
      - /opt/vscode/appdata/config:/config
    ports:
      - 8443:8443
    restart: unless-stopped

```

