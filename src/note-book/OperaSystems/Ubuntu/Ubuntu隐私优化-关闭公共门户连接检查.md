# Ubuntu隐私优化-关闭公共门户连接检查

> 在研究 Ubuntu 的连接检查功能之前，让我们首先了解一下 Captive Portals。当尝试访问咖啡店、机场、商务中心、酒店大堂等处的  Wifi 设施时，我们发现自己登陆了一个要求身份验证、付款和/或接受协议条款的网页。只有当我们提供所需的信息时，我们才能访问 Wifi  设施。这种登录页面称为强制门户。
>
> 在 Ubuntu 17.10 及更高版本中，每当检测到强制门户时，您都会在网络状态中看到一个问号。这项新功能的工作原理是不时 ping [http://connectivity-check.ubuntu.com](http://connectivity-check.ubuntu.com) URL，以检测强制门户。
>
> 为了更好的保证隐私，我将这个进行禁用。



## 通过命令行禁用连接检查

通过 /var/lib/NetworkManager/NetworkManager-intern.conf 文件更改此功能的配置。

```bash
# Internal configuration file. This file is written and read
# by NetworkManager and its configuration values are merged
# with the configuration from 'NetworkManager.conf'.
#
# Keys with a ".set." prefix specify the value to set.
# A corresponding key with a ".was." prefix records the value
# of the user configuration at the time of storing the file.
# The value from internal configuration is rejected if the corresponding
# ".was." key no longer matches the configuration from 'NetworkManager.conf'.
# That means, if you modify a value in 'NetworkManager.conf', the internal
# overwrite no longer matches and is ignored.
#
# Certain sections can only be overwritten whole, not on a per key basis.
# Such sections are marked with a ".was" key that records the user configuration
# at the time of writing.
#
# Internal sections of the form [.intern.*] cannot
# be set by user configuration.
#
# CHANGES TO THIS FILE WILL BE OVERWRITTEN
#

# ------ 添加下面的字段 ------- #
[connectivity]
.set.enabled=false
# ------ 添加上面的字段 ------- #
```

## 重启网络服务

```bash
systemctl restart NetworkManager.service
```

