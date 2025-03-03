# 一些问题

## CentOS7

mihomo不支持

### 强制使用

修改生成的规则表
```bash
ip rule del pref 9001 from all goto 9010
```

强制选择网卡
```bash
# interface-name: enp0s8
```

## AMD v3 不支持

mihomo-linux-amd64-go120-v1.18.9/