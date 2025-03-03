# RemoteNetBridge - 远程网络隧道工具

![GitHub](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey)

安全稳定的跨平台网络隧道解决方案，支持SSH/RDP协议和Clash代理集成

## 核心功能

- ✅ 双端架构（Provider/Consumer）
- ✅ 原生支持Windows/Linux
- ✅ 自动隧道维护机制
- ✅ 集成Clash核心（v1.18.9）
- ✅ 智能流量规则引擎
- ✅ 多协议支持（Socks5/HTTP/SSH/RDP）

## 项目结构

```bash
project-root/
├── provider/                 # 服务提供端
│   ├── mihomo-*             # 多平台Clash二进制
│   ├── config.yaml          # 主配置文件
│   └── geoip.metadb         # IP地理数据库
├── consumer/                # 客户端
│   ├── resources/           # 资源配置
│   │   └── config.yaml      # 客户端配置
│   └── scripts/             # 操作脚本
└── README.md                # 项目文档
```

## 快速配置

1. 服务端配置（provider/config.yaml）：

```yaml
mixed-port: 7890
mode: rule
log-level: debug
external-controller: 127.0.0.1:9090
```

2. 客户端配置（consumer/resources/config.yaml）：

```yaml
proxies:
  - name: "secure-tunnel"
    type: socks5
    server: 127.0.0.1
    port: 1080
    skip-cert-verify: true
```

## 操作指南

### Windows环境

```powershell
# 配置RDP端口转发 (需管理员权限)
.\consumer\scripts\setup_consumer.ps1 `
    -RDPPort 53389 `
    -ForwardIP 192.168.1.150

# 验证网络配置：
netsh interface portproxy show v4tov4 | findstr "3389"
Get-NetTCPConnection -LocalPort 3389 -State Listen
```

### Linux环境

```bash
# 建立SSH隧道连接
chmod +x consumer/scripts/setup_consumer.sh
./consumer/scripts/setup_consumer.sh --server your.server.ip --port 22
```

## 维护脚本

| 脚本名称                  | 功能描述                     |
|---------------------------|----------------------------|
| health_check.sh          | 服务健康监测                |
| traffic_monitor.ps1      | 流量监控（Windows）         |
| update_geoip.sh          | 地理数据库更新              |

## 授权许可

[MIT License](LICENSE) © 2024 RemoteNetBridge
