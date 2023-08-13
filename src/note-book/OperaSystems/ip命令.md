# 用IP命令管理网桥bridge
## link
```bash
# ip link add name bridge_name type bridge 也可以简化 ip link add bridge_name type bridge
# ip link set bridge_name up
想要添加Interface到网桥上，interface状态必须是Up
# ip link set eth0 up
添加eth0 interface到网桥上
# ip link set eth0 master bridge_name
从网桥解绑eth0
# ip link set eth0 nomaster
eth0 可以关闭的
# ip link set eth0 down
删除网桥可以用
# ip link delete bridge_name type bridge
也可以简化为
# ip link del bridge_name
```

## route
```bash
列出路由
ip route list
ip route show
ip route

查看指定网段的路由
ip route list 192.168.1.0/24

添加路由
ip route add 192.168.2.0/24 via 192.168.1.1

追加路由
ip route append 192.168.2.0/24 via 192.168.1.12 #追加一个指定网络的路由，为了平滑切换网关使用

修改路由
ip route change 192.168.2.0/24 via 192.168.1.11
ip route replace 192.168.2.0/24 via 192.168.1.111

删除路由
ip route del 192.168.2.0/24 via 192.168.1.1

清空指定网络的路由
ip route flush 192.168.2.0/24 #这个是清理所有192.168.2.0/24相关的所有路由，有时候设置错网关存在多条记录，就需要一次性清空相关路由再进行添加
添加默认路由
ip route add default via 192.168.1.1
指定路由metirc
ip route add 192.168.2.0/24 via 192.168.1.15 metric 10
```
