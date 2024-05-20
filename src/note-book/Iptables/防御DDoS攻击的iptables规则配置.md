# 防御DDoS攻击的iptables规则配置

## 目的

这份笔记记录了如何在Ubuntu 20.04服务器上使用iptables配置防御Ping of Death、SYN Flood和HTTP Flood攻击的规则。我们将通过配置iptables规则来实现这些防御，并确保规则在系统重启后依然有效。

## 防御Ping of Death攻击

Ping of Death攻击通过发送超大数据包来崩溃目标系统。我们通过限制ICMP请求的速率和数据包大小来防御这种攻击。

1. **创建一个新的链来处理ICMP请求：**


```bash
sudo iptables -N ICMP_CHECK
```

**在新的链中添加规则：**

- 限制ICMP请求的速率
- 限制ICMP数据包的大小
- 丢弃不符合上述条件的ICMP请求

```bash
sudo iptables -A ICMP_CHECK -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 4 -j RETURN
sudo iptables -A ICMP_CHECK -p icmp --icmp-type echo-request -m length --length 0:100 -j RETURN
sudo iptables -A ICMP_CHECK -j DROP
```

**在主链中调用新的链：**

```bash
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ICMP_CHECK
```

## 防御SYN Flood攻击

SYN Flood攻击通过发送大量SYN请求来消耗服务器资源。我们通过启用SYN cookies和限制SYN请求的速率来防御这种攻击。

**启用SYN cookies并永久保存设置：**

```bash
echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.conf
sudo sysctl -p
```

**限制SYN请求的速率：**


```bash
sudo iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
sudo iptables -A INPUT -p tcp --syn -j DROP
```

## 防御HTTP Flood攻击

HTTP Flood攻击通过发送大量HTTP请求来消耗服务器资源。我们通过限制HTTP请求的速率来防御这种攻击。

限制HTTP请求的速率：

```bash
sudo iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j DROP
```

## 保存iptables规则

为了确保iptables规则在系统重启后依然有效，我们需要安装并使用`iptables-persistent`包。

**安装`iptables-persistent`：**


```bash
sudo apt-get update
sudo apt-get install iptables-persistent
```

**手动保存当前的iptables规则：**

 ```bash
 sudo iptables-save > /etc/iptables/rules.v4
 sudo ip6tables-save > /etc/iptables/rules.v6
 ```

## 汇总命令

下面是所有配置命令的完整总结：

```bash
# 创建新的链ICMP_CHECK
sudo iptables -N ICMP_CHECK

# 在ICMP_CHECK链中添加规则
sudo iptables -A ICMP_CHECK -p icmp --icmp-type echo-request -m limit --limit 1/s --limit-burst 4 -j RETURN
sudo iptables -A ICMP_CHECK -p icmp --icmp-type echo-request -m length --length 0:100 -j RETURN
sudo iptables -A ICMP_CHECK -j DROP

# 在主链中调用新的链
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ICMP_CHECK

# 启用SYN cookies并永久保存设置
echo "net.ipv4.tcp_syncookies = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 防御SYN Flood
sudo iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
sudo iptables -A INPUT -p tcp --syn -j DROP

# 防御HTTP Flood
sudo iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j DROP

# 安装iptables-persistent以保存并在启动时恢复规则
sudo apt-get update
sudo apt-get install iptables-persistent

# 手动保存当前的iptables规则
sudo iptables-save > /etc/iptables/rules.v4
sudo ip6tables-save > /etc/iptables/rules.v6
```

## 检查和应用配置

确保您正确配置了所有规则并且它们按照正确的顺序执行。使用以下命令检查当前的iptables规则：

```bash
sudo iptables -L -v
```

通过这些步骤，可以有效地防御Ping of Death、SYN Flood和HTTP Flood攻击，并确保规则在系统重启后仍然生效。