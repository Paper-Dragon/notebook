# Docker一键部署Meta和MetacubexD面板

为了简化 MetacubexD 和 Meta 的部署过程，本文档将指导如何使用 Docker 快速部署这两个应用。

Docker 可以在任何支持它运行的环境中启动这些应用，从而避免复杂的环境配置。

## 准备工作

### 安装 Docker

访问Docker官方进行部署或者使用编写的一键安装脚本快速安装，如果你在中国的大陆地区，建议使用下面的一键部署脚本进行部署。

```bash
curl -sSL get-docker.geekery.cn | bash
```

### 配置文件设置

在开始部署前，需在 Meta 的配置文件中启用外部控制器，以便 MetacubexD 能够与 Meta 进行交互。请在配置文件中添加或修改以下内容：

```yaml
external-controller: 0.0.0.0:9090
```

## 使用 Docker 部署

### 使用 Docker CLI

#### 启动 MetacubexD 容器

执行以下命令以启动 MetacubexD 容器，该命令将容器内的 80 端口映射到主机的 80 端口：

```bash
docker run -d --restart always -p 80:80 --name metacubexd ghcr.geekery.cn/metacubex/metacubexd
```

#### 启动 Meta 容器

接着，执行以下命令以启动 Meta 容器。假设您已有一个名为 `config.yaml` 的配置文件位于当前目录下：

```bash
docker run -d --name meta \
  --network host \
  -v ./config.yaml:/root/.config/mihomo/config.yaml \
  -v /dev/net/tun:/dev/net/tun \
    hub.geekery.cn/metacubex/mihomo:Alpha
```

### 使用 Docker Compose

建议使用 Docker Compose 管理多个容器，可以创建一个 `docker-compose.yml` 文件，内容如下所示：

```yaml
version: '3'

services:
  metacubexd:
    container_name: metacubexd
    image: ghcr.geekery.cn/metacubex/metacubexd
    restart: always
    ports:
      - '80:80'

  meta:
    container_name: meta
    image: hub.geekery.cn/metacubex/mihomo:Alpha
    restart: always
    pid: host
    ipc: host
    network_mode: host
    cap_add:
      - ALL
    volumes:
      - ./config.yaml:/root/.config/mihomo/config.yaml
      - /dev/net/tun:/dev/net/tun
```

随后，在 `docker-compose.yml` 文件所在目录中执行以下命令启动服务：

```bash
docker compose up -d
```

## 访问 MetacubexD

当所有容器均成功启动后，可通过浏览器访问 `http://localhost`（若为本地部署）以打开 MetacubexD 的管理界面。在此界面中，可进行 Meta 实例的配置与管理。

## 备注

- 在生产环境中，建议使用更安全的网络配置和更严格的权限管理。