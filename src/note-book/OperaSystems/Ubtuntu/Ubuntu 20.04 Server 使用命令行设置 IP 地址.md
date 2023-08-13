# Ubuntu 20.04 Server 使用命令行设置 IP 地址

> 转载From ： https://blog.csdn.net/justidle/article/details/114372558

## 确认 IP 文件

我们只需要使用命令行来配置修改 IP 配置即可。

```cpp
~$ ls /etc/netplan
00-installer-config.yaml
```

我们可以看到，这里有一个 IP 配置方案文件，我们只需要修改这个 IP 配置方案文件即可。

## 修改 IP 方案

输入如下命令行：

```bash
$ sudo vi /etc/netplan/00-installer-config.yaml 
```



这样我们可以看到原有的 IP 配置方案，按照上面的配置，我们将该文件的内容修改如下：

```yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    eno1:
      addresses: [10.119.111.112/24]
      optional: true
      gateway4: 10.119.111.1
      nameservers:
        addresses: [8.8.8.8]
      dhcp4: no
 
        #dhcp4: true
    eno2:
      dhcp4: true
    eno33np0:
      dhcp4: true
    eno34np1:
      dhcp4: true
  version: 2
```

保存配置文件。

## 验证 IP 方案正确性

输入如下命令行：

```bash
$ sudo netplan try
```

然后耐心等待即可。


## 应用 IP 方案

输入如下命令行：

```bash
$ sudo netplan apply
```

这样就激活了当前的 IP 配置。如果需要验证 IP 地址，只需要重新输入以下命令行：

```bash
$ sudo ip addr show
```

