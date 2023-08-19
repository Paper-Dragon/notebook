## nmcli connection及常用选项

```
[root@zutuanxue ~]# nmcli connection 
add		添加
delete 		删除
edit   		编辑
help   		帮助
load   		加载
monitor  	监控
show     	查看
clone  		克隆
down		停用
modify 		修改
reload		重载
up    		启用
		
[root@zutuanxue ~]# nmcli connection modify ens37 ipv4.addresses 192.168.18.100/24 ipv4.gateway 192.168.18.1 ipv4.method manual autoconnect yes
[root@zutuanxue ~]# nmcli connection down ens37
成功停用连接 "ens37"（D-Bus 活动路径：...
[root@zutuanxue ~]# nmcli connection up ens37
连接已成功激活（D-Bus 活动路径：...
[root@zutuanxue ~]# nmcli 
ens37: 已连接 to ens37
        "Intel 82545EM"
        ethernet (e1000), 00:0C:29:11:47:A1, 硬件, mtu 1500
        ip4 默认
        inet4 192.168.18.100/24
        route4 192.168.18.0/24
        route4 0.0.0.0/0
        inet6 fe80::4283:ec57:8781:deff/64
        route6 fe80::/64
        route6 ff00::/8

[root@zutuanxue ~]# nmcli connection clone ens37 ens-test1
ens37 (077945cb-1d12-4c06-bba3-562426336b67) 已克隆为 ens-test1 (ab1cc22a-21b5-4059-9b3e-b9d14b1084fe)。
[root@zutuanxue ~]# nmcli connection 
NAME       UUID 				TYPE      DEVICE 
ens33      b5ecf...			ethernet  ens33  
ens37      07794...			ethernet  ens37  
ens-test1  ab1cc...			ethernet  --  

！！！！		此命令在使用时，可以加设备名称，UUID，配置文件
如
[root@zutuanxue ~]# nmcli connection down ens37
[root@zutuanxue ~]# nmcli connection up ens37

[root@zutuanxue ~]# nmcli connection down 077945cb-1d12-4c06-bba3-562426336b67 
[root@zutuanxue ~]# nmcli connection up 077945cb-1d12-4c06-bba3-562426336b67 

[root@zutuanxue ~]# nmcli connection down /etc/sysconfig/network-scripts/ifcfg-ens37 
[root@zutuanxue ~]# nmcli connection up /etc/sysconfig/network-scripts/ifcfg-ens37 

这三种方式都可以，其中最后一种是网卡配置文件存放的位置，都会以ifcfg-开头，后面加上设备名
```

## nmcli device及常用选项

```
[root@zutuanxue ~]# nmcli device 
connect     		连接
disconnect  		断开
lldp        		显示通过lldp协议学习到的相邻设备信息
monitor     		监控设备
set         		设置设备
status      		显示设备状态
delete      		删除设备 只能删除软件设备
help        		帮助
modify      		修改
reapply     		更新
show        		查看详细信息
wifi        		无线网络管理

例：
[root@zutuanxue ~]# nmcli device modify ens37 +ipv4.addresses 192.168.20.100/24
成功重新应用连接到设备 "ens37"。
[root@zutuanxue ~]# nmcli 
ens37: 已连接 to ens37
  "Intel 82545EM"
  ethernet (e1000), 00:0C:29:11:47:A1, 硬件, mtu 1500
  ip4 默认
  inet4 192.168.20.100/24
  inet4 192.168.17.131/24
  route4 0.0.0.0/0
  route4 192.168.17.0/24
  route4 192.168.20.0/24
  inet6 fe80::f91c:608a:8381:2cb4/64
  route6 fe80::/64
```

## nmcli的其他常用设置

```
[root@zutuanxue ~]# nmcli 
-t		简洁输出	与-p冲突
-p		人性化输出 与-t冲突
-c		颜色开关 auto/on/off
-f		过滤字段	all查看所有字段       
connection 	连接 
device      	设备
general     	全局
monitor     	监控
networking  	网络
radio       	无线广播
			
例：
[root@zutuanxue ~]# nmcli  -t connection 
ens33:b5ecf570-543c-4da7-b082-bdc073b56acb:802-3-ethernet:ens33
ens37:5b91e453-1130-48ce-a2a1-f6f728e072ed:802-3-ethernet:ens37
ens37:077945cb-1d12-4c06-bba3-562426336b67:802-3-ethernet:

[root@zutuanxue ~]# nmcli -p connection 
========================
  网络管理器连接配置集
========================
NAME   UUID          TYPE      DEVICE 
----------------------------------------------------
ens33  b5ec...			 ethernet  ens33  
ens37  5b91...			 ethernet  ens37  
ens37  0779...			 ethernet  --     

[root@zutuanxue ~]# nmcli -f STATE connection 
STATE  
已激活 
已激活 
--     

[root@zutuanxue ~]# nmcli general hostname 
localhost.localdomain
[root@zutuanxue ~]# nmcli general hostname hello
[root@zutuanxue ~]# nmcli general hostname 
hello
```

### nmcli的返回值

```
0: 成功-指示操作已成功
1: 位置或指定的错误
2: 无效的用户输入，错误的nmcli调用
3: 超时了（请参阅 --wait 选项）
4: 连接激活失败
5: 连接停用失败
6: 断开设备失败
7: 连接删除失败
8: 网络管理器没有运行
10: 连接、设备或接入点不存在
```