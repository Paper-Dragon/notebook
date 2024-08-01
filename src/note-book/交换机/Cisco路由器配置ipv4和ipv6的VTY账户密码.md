# Cisco路由器配置ipv4和ipv6的VTY账户密码

> 本指南旨在详细描述如何配置两个分支机构的网络设备。分支机构 A 和 B 分别采用 IPv4 和 IPv6 地址方案。学习本文档，帮助网络管理员可以了解如何设置主机名、密码、接口 IP 地址以及其他基本的网络配置，以确保网络的安全性和稳定性。

## Branch-A IPv4 配置

### 进入特权模式

在开始配置之前，需要进入设备的特权模式。可以使用以下命令：

```bash
enable
```

### 进入全局配置模式

进入全局配置模式后，可以进行设备的全局设置：

```bash
configure terminal
```

### 设置主机名

设置主机名有助于网络管理和识别：

```bash
hostname Branch-A
```

### 设置公告标语

公告标语用于在用户连接到设备时显示重要信息：

```bash
banner motd #Branch-A#
```

### 配置特权 EXEC 密码

为确保安全，设置特权 EXEC 密码：

```bash
enable secret class
```

### 配置控制台密码

控制台密码用于本地设备访问的身份验证：

```bash
line console 0
password cisco
login
```

### 加密所有密码

为提高安全性，加密所有已设置的密码：

```bash
service password-encryption
```

### 配置 VTY 密码

VTY 密码用于远程访问的身份验证：

```bash
line vty 0 15
password cisco
```

### 1.9 配置接口 IP 地址

配置每个接口的 IP 地址以便于网络通信：

接口 g0/2：

```bash
int g0/2
ip address 172.20.31.254 255.255.255.252
no shutdown
```

接口 g0/0：

```bash
int g0/0
ip address 172.20.16.1 255.255.254.0
no shutdown
```

接口 g0/1：

```bash
int g0/1
ip address 172.20.18.1 255.255.255.0
no shutdown
```

## Branch-B IPv6 配置

### 进入特权模式

与分支 A 相同，首先进入特权模式：

```bash
enable
```

### 进入全局配置模式

进入全局配置模式后开始配置：

```bash
configure terminal
```

### 设置主机名

设置主机名为 Branch-B：

```bash
hostname Branch-B
```

### 设置公告标语

设置公告标语：

```bash
banner motd #Branch-B#
```

### 配置特权 EXEC 密码

设置特权 EXEC 密码以保护设备：

```bash
enable secret class
```

### 配置控制台密码

配置控制台密码以保护本地访问：

```bash
line console 0
password cisco
login
```

### 加密所有密码

加密所有密码以防止未授权访问：

```bash
service password-encryption
```

### 配置 VTY 密码

配置 VTY 密码以保护远程访问：

```bash
line vty 0 15
password cisco
```

### 配置接口 IPv6 地址

配置每个接口的 IPv6 地址：

接口 g0/2：

```bash
int g0/2
ipv6 address 2001:DB8:FFFF:FFFF::2/64
ipv6 address FE80::B link-local
no shutdown
```

接口 g0/0：

```bash
int g0/0
ipv6 address 2001:DB8:FADE:00FF::1/64
ipv6 address FE80::B link-local
no shutdown
```

接口 g0/1：

```bash
int g0/1
ipv6 address 2001:DB8:FADE:0100::1/64
ipv6 address FE80::B link-local
no shutdown
```
