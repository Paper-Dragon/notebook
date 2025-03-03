# RemoteNetBridge - Remote Network Tunneling Tool

![GitHub](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey)

Secure and stable cross-platform network tunneling solution with SSH/RDP protocol support and Clash proxy integration

## Core Features

- ✅ Dual-end Architecture (Provider/Consumer)
- ✅ Native Windows/Linux Support
- ✅ Automatic Tunnel Maintenance
- ✅ Built-in Clash Core (v1.18.9)
- ✅ Smart Traffic Routing Engine
- ✅ Multi-protocol Support (Socks5/HTTP/SSH/RDP)

## Project Structure

```bash
project-root/
├── provider/                 # Service Provider End
│   ├── mihomo-*             # Multi-platform Clash binaries
│   ├── config.yaml          # Main configuration
│   └── geoip.metadb         # IP Geolocation Database
├── consumer/                # Client End
│   ├── resources/           # Resource configurations
│   │   └── config.yaml      # Client configuration
│   └── scripts/             # Operation scripts
└── README.md                # Documentation
```

## Quick Configuration

1. Provider Configuration (provider/config.yaml):
```yaml
mixed-port: 7890
mode: rule
log-level: debug
external-controller: 127.0.0.1:9090
```

2. Client Configuration (consumer/resources/config.yaml):
```yaml
proxies:
  - name: "secure-tunnel"
    type: socks5
    server: 127.0.0.1
    port: 1080
    skip-cert-verify: true
```

## Usage Guide

### Windows Environment
```powershell
# Configure RDP port forwarding (Admin required)
.\consumer\scripts\setup_consumer.ps1 `
    -RDPPort 53389 `
    -ForwardIP 192.168.1.150

# Verify network configuration:
netsh interface portproxy show v4tov4 | findstr "3389"
Get-NetTCPConnection -LocalPort 3389 -State Listen
```

### Linux Environment
```bash
# Establish SSH tunnel connection
chmod +x consumer/scripts/setup_consumer.sh
./consumer/scripts/setup_consumer.sh --server your.server.ip --port 22
```

## Maintenance Scripts

| Script Name               | Description                  |
|---------------------------|------------------------------|
| health_check.sh          | Service health monitoring    |
| traffic_monitor.ps1      | Traffic monitoring (Windows) |
| update_geoip.sh          | GeoIP database update        |

## License
[MIT License](LICENSE) © 2024 RemoteNetBridge
