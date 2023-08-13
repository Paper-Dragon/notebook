# 华为服务器2288H V2的IPMI设置风扇转速和工作模式的命令

登录web imana--实时监控---部件---风扇--控制模式

首先用ssh登录服务器的idrac

原文：

设置风扇的官方命令
https://support.huawei.com/enterprise/zh/doc/EDOC1000038841/688375b5

```bash
设置风扇的工作模式为手动，并设置手动的时间为1亿秒，大概3年多
ipmcset -d fanmode -v 1 100000000
设置风扇转速是百分之多少，默认是20%，设置必须设置最少30。。。。。所以敲上面的命令即可。
ipmcset -d fanlevel -v 20

获取风扇的当前模式，自动还是手动，手动剩余多少秒，风扇当前？%
ipmcget -d fanmode

获取风扇的当前模式，自动还是手动，手动剩余多少秒，风扇当前？%
ipmcget -d fanlevel
```



