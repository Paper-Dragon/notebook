# Cisco路由器OSPF配置

本文档将详细介绍如何配置 OSPF（开放最短路径优先）协议，使用三个路由器：RA、RB 和 RC。一步一步说明每个路由器的配置、设置 IPv4 和 IPv6 地址的、配置OSPF 的启用以及特定接口。

## RA 路由器配置

### 1. 配置接口

为 RA 路由器的接口配置 IP 地址，并确保接口处于启用状态。

```bash
enable
configure terminal

interface GigabitEthernet0/0
ip address 172.31.0.1 255.255.254.0
no shutdown

interface Serial0/0/0
ip address 172.31.4.1 255.255.255.252
no shutdown
```

### 2. 配置 OSPF

配置 OSPF 协议，指定路由器 ID 和网络区域。

```bash
router ospf 1
router-id 1.1.1.1
network 172.31.0.0 0.0.1.255 area 0
passive-interface GigabitEthernet0/0
network 172.31.4.0 0.0.0.3 area 0
```

## RB 路由器配置

### 1. 配置接口

RB 路由器的接口配置 IPv4 和 IPv6 地址，配置接口处于启用状态。

```bash
enable
configure terminal

ipv6 unicast-routing

interface Serial0/0/0
ip address 172.31.4.2 255.255.255.252
no shutdown

interface GigabitEthernet0/0
ipv6 address FE80::1 link-local
ip address 172.31.2.1 255.255.254.0
ipv6 ospf 1 area 0
no shutdown

interface Serial0/0/1
ipv6 address 2001:DB8:2::1/64
ipv6 ospf 1 area 0
no shutdown
```

### 2. 配置 OSPF

配置 OSPF 协议，指定路由器 ID 和网络区域，同时为 IPv6 配置 OSPF。

```bash
router ospf 1
router-id 2.2.2.2
network 172.31.4.0 0.0.0.3 area 0
network 172.31.2.0 0.0.1.255 area 0
passive-interface GigabitEthernet0/0

ipv6 router ospf 1
router-id 3.3.3.3
```

## RC 路由器配置

### 1. 配置接口

为 RC 路由器的接口配置 IPv6 地址，配置接口处于启用状态。

```bash
enable
configure terminal

interface GigabitEthernet0/0
ipv6 address 2001:DB8:3::1/64
ipv6 address FE80::3 link-local
ipv6 ospf 1 area 0
no shutdown

interface Serial0/0/0
ipv6 address 2001:DB8:2::2/64
ipv6 ospf 1 area 0
no shutdown
```

### 2. 配置 OSPF

启用 IPv6 单播路由并配置 OSPF 协议，指定路由器 ID。

```bash
ipv6 unicast-routing

ipv6 router ospf 1
router-id 3.3.3.3
```

## 总结

通过以上配置步骤，为每个路由器配置了 OSPF 协议，支持 IPv4 和 IPv6 路由。每个路由器的接口均已分配相应的 IP 地址，并已启用 OSPF 来支持区域 0 的路由。



![ba4b930c7b0175e117286a93e790d73a](Cisco路由器OSPF配置.assets/ba4b930c7b0175e117286a93e790d73a.png)