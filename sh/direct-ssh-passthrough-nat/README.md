# NAT 网络穿透

## 安装

### 下载并执行

```bash
wget https://gitee.com/PaperDragon/direct-ssh-passthrough-nat/raw/master/frpc_linux_install.sh
chmod +x frpc_linux_install.sh
./frpc_linux_install.sh
```

### 可选：关闭 Spy 模式

```bash
SPY_MODE=False ./frpc_linux_install.sh
```

## 配置

| 参数           | 说明                                                    | 默认值              |
|----------------|---------------------------------------------------------|---------------------|
| `FRPS_ADDRESS` | frps 服务地址。                                         | `frp.geekery.cn`    |
| `FRPS_PORT`    | frps 服务端口。                                         | `7000`              |
| `SPY_MODE`     | Spy 模式。                                              | `True`              |

## 卸载

### 下载并执行

```bash
wget https://gitee.com/PaperDragon/direct-ssh-passthrough-nat/raw/master/frpc_linux_uninstall.sh
chmod +x frpc_linux_uninstall.sh
./frpc_linux_uninstall.sh
```

### 可选：关闭 Spy 模式

```bash
SPY_MODE=False ./frpc_linux_uninstall.sh
```

## Docker 运行

```bash
docker run -itd --ipc=host \
    --pid=host \
    -v /:/host \
    jockerdragon/frpc-ssh-passthrough:latest
```
