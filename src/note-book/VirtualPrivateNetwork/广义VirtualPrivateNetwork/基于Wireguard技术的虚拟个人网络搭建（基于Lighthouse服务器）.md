# 基于Wireguard技术的虚拟个人网络搭建（基于Lighthouse服务器）



## 服务端安装 （强烈推荐 docker 安装）

## Docker安装Wireguard  (更简单更方便)

### 通过容器安装wg-easy 

括号里面的的是你需要修改的，修改完删掉就可以了

#### 关于CentOS7 模块安装
```bash
$ sudo yum install epel-release elrepo-release
$ sudo yum install yum-plugin-elrepo
$ sudo yum install kmod-wireguard wireguard-tools
```

```
docker run -d \
  --name=wg-easy \
  -e WG_HOST=123.123.123.123 (🚨这里输入服务器的公网IP) \
  -e PASSWORD=passwd123 (🚨这里输入你的密码) \
  -e WG_DEFAULT_ADDRESS=10.0.8.x （🚨默认IP地址）\
  -e WG_DEFAULT_DNS=114.114.114.114 （🚨默认DNS）\
  -e WG_ALLOWED_IPS=10.0.8.0/24 （🚨允许连接的IP段）\
  -e WG_PERSISTENT_KEEPALIVE=25 （🚨重连间隔）\
  -v ~/.wg-easy:/etc/wireguard \
  -p 51820:51820/udp \
  -p 51821:51821/tcp \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_MODULE \
  --sysctl="net.ipv4.conf.all.src_valid_mark=1" \
  --sysctl="net.ipv4.ip_forward=1" \
  --restart unless-stopped \
  weejewel/wg-easy
```

### 更新容器命令

```
docker stop wg-easy
docker rm wg-easy
docker pull weejewel/wg-easy
```



## 客户端下载与配置

客户端的下载（需要有科学上网条件）：[Installation - WireGuard](https://www.wireguard.com/install/)



## 手动安装Wireguard

### 安装Wireguard（以ubuntu20.04为基础）
```
#root权限
sudo -i

#安装wireguard软件
apt install wireguard resolvconf -y

#开启IP转发
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
```

### 进入配置存储路径，调整目录权限
```
cd /etc/wireguard/
chmod 0777 /etc/wireguard

#调整目录默认权限
umask 077
```

### 生成服务器秘钥
```
#生成私钥
wg genkey > server.key

#通过私钥生成公钥
wg pubkey < server.key > server.key.pub
```

### 生成客户端(client1)秘钥
```
#生成私钥
wg genkey > client1.key

#通过私钥生成公钥
wg pubkey < client1.key > client1.key.pub
```

### 显示所有生成的秘钥
```
cat server.key && cat server.key.pub && cat client1.key && cat client1.key.pub
```

### 自动创建服务器配置文件
```
echo "
[Interface]
PrivateKey = $(cat server.key) # 填写本机的privatekey 内容
Address = 10.0.8.1 #本机虚拟局域网IP

PostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
#注意eth0需要为本机网卡名称

ListenPort = 50814 # 监听端口
DNS = 8.8.8.8
MTU = 1420
[Peer]
PublicKey =  $(cat client1.key.pub)  #自动client1的公钥
AllowedIPs = 10.0.8.10/32 #客户端所使用的IP" > wg0.conf
```

### 设置服务器开机自启动
```
systemctl enable wg-quick@wg0
```

### 启动wireguard
```
#启动wg0
wg-quick up wg0
#关闭wg0
wg-quick down wg0
```

### 手动创建服务器配置文件（待完成）
```
nano /etc/wireguard/wg0.conf
```

### wireguard客户端下载地址
```
https://www.wireguard.com/install/
```
### 客户端配置（以client1为例）
```
[Interface]
PrivateKey = 6M8HEZioew+vR3i53sPc64Vg40YsuMzh4vI1Lkc88Xo= #此处为client1的私钥
Address = 10.0.8.10 #此处为peer规定的客户端IP
MTU = 1500

[Peer]
PublicKey = Tt5WEa0Vycf4F+TTjR2TAHDfa2onhh+tY8YOIT3cKjI= #此处为server的公钥
AllowedIPs = 10.0.8.0/24 #此处为允许的服务器IP
Endpoint = 114.132.56.178:50814 #服务器对端IP+端口
```

### 增加服务器客户端节点client2
```
#生成私钥
wg genkey > client2.key

#通过私钥生成公钥
wg pubkey < client2.key > client2.key.pub

#将peer公钥加入wg0.conf配置
echo "
[Peer]
PublicKey =  $(cat client2.key.pub)  #自动client1的公钥
AllowedIPs = 10.0.8.11/32 #客户端Client2所使用的IP" >> wg0.conf

```

