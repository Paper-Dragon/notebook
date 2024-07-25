# Cisco交换机Vlan中继配置

> 在以太网交换机的网络中，中继（Trunking）是一个关键概念，用于在交换机之间传输多个VLAN的数据流。配置中继可以确保不同VLAN之间的流量能够跨越多个交换机进行传输。中继端口通常用于连接交换机、路由器或其他网络设备，以支持跨VLAN的通信。
>
> 在本文档中，我们将介绍如何在Cisco交换机上配置中继端口，包括二层交换机和三层交换机的不同配置步骤。 

## 配置步骤

### 1. 进入接口配置模式

首先，你需要进入你要配置的接口模式。假设我们配置的是接口 `fa0/1`，输入以下命令：

```bash
S1(config)# interface fa0/1
```

### 2. 配置为中继模式

将接口模式设置为中继模式，这样可以允许多个VLAN通过此接口传输：

```bash
S1(config-if)# switchport mode trunk
```

### 3. 允许所有VLAN通过中继

配置中继接口允许所有VLAN通过：

```bash
S1(config-if)# switchport trunk allow vlan all
```

### 4. 设置本地VLAN（Native VLAN）

指定一个本地VLAN（Native VLAN），这是未标记的流量将会使用的VLAN。我们将本地VLAN设置为99：

```bash
S1(config-if)# switchport trunk native vlan 99
```

### 5. （仅适用于三层交换机）配置封装类型

如果你正在配置三层交换机，还需要指定封装类型。在这种情况下，我们使用IEEE 802.1Q封装：

```
S1(config-if)# switchport trunk encapsulation dot1q
```

## 配置示例

完整的配置示例如下：

```bash
S1(config)# interface fa0/1
S1(config-if)# switchport mode trunk
S1(config-if)# switchport trunk allow vlan all
S1(config-if)# switchport trunk native vlan 99
S1(config-if)# switchport trunk encapsulation dot1q
```