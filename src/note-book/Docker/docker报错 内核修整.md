# bridge-nf-call-iptables

1）警告信息如下：

```bash
WARNING: bridge-nf-call-iptables is disabled

WARNING: bridge-nf-call-ip6tables is disabled
```

2）解决方法：

修改系统文件是的机器bridge模式开启

设置机器开机启动的时候执行下面两条命令

编辑vim /etc/rc.d/rc.local添加下面两条命令

```bash
echo 1 > /proc/sys/net/bridge/bridge-nf-call-iptables

echo 1 > /proc/sys/net/bridge/bridge-nf-call-ip6tables
```

centos7需要增加执行权限：
```bash
    chmod +x　/etc/rc,d/rc.local
```
3)I solve this problem by execting two commands:

```bash
sysctl net.bridge.bridge-nf-call-iptables=1
sysctl net.bridge.bridge-nf-call-ip6tables=1
```

4）I run my Docker on CentOS with SELinux enforcing and FirewallD on
To resolve this Warning I add those two lines info my /etc/sysctl.conf

```bash
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
```





# net.ipv4.ip_forward

解决方法：

```bash
sudo vim /usr/lib/sysctl.d/00-system.conf
#添加如下代码：
net.ipv4.ip_forward=1
```

