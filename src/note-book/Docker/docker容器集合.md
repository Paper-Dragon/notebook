# docker容器集合

## docker 部署和镜像仓库优化

```bash
sudo curl -fsSL get.docker.com  && sudo sh
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
EOF
sudo systemctl enable docker
sudo systemctl start docker
```

### 普通用户使用docker

> 以下方法仅适用于单用户电脑，若为多用户，即有越权漏洞！！！！

```bash
#使用root增加docker组.rpm或deb包默认已经创建
sudo groupadd docker

# 方法①
# 普通用户加到docker组中
sudo gpasswd -a ${USER} docker
# 必须切换或者退出当前账户再从新登入才会生效

# 方法②
# 给ugo都增加读写权限
sudo chmod a+rw /var/run/docker.sock
```

##  docker 常用的容器

### mysql容器

```bash
docker run \
      --name mysql  \
      --privileged=true \
      -p 3306:3306 \
      -v /home/mysql:/val/lib/mysql \
      -e MYSQL_ROOT_PASSWORD="1mysql." \
      --restart=always \
      -d mysql:5.7
```

### 使用MySQL客户端连接到数据库

一旦数据库容器启动，就可以使用安装在主机上的任何MySQL客户端应用程序以用户ID `root` 和密码`websecret` 连接到 `localhost:3306`。

如果你手头没有MySQL客户端，[Admineris](https://www.adminer.org/)是一个轻量级的基于php的选项。它也可以作为 [Docker image](https://hub.docker.com/_/adminer) ,在另一个终端中运行以下命令：

```javascript
docker run \
  -it --rm --name adminer \
  -p 8080:8080 \
  adminer
```

启动后，在浏览器中打开 `http://localhost:8080` 并输入MySQL登录凭据：

### mongodb容器

```bash
docker run  -d \
     --name mongodb \
     -v /data/mongo:/data/db \
     -p 27017:27017 \
     --restart=always \
     mongo
```

```bash
#进入 `mongo`
mongosh
#进入 admin 的数据库
use admin
#创建管理员用户
db.createUser(
   {
     user: "root",
     pwd: "mongo",
     roles: [ { role: "root", db: "admin" } ]
   }
 )
```



### alist安装

```bash
docker run -d \
	--restart=always \
	-v /opt/alist:/opt/alist/data \
	-p 5244:5244 \
	--name="alist" \
	xhofe/alist:latest
```

获取alist密码

```bash
docker exec -it alist ./alist admin
```

###  中文版本的 portainer  

```bash
docker run -d \
	--restart=always \
	--name="portainer" \
	-p 9000:9000 \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-v ./portainer_data:/data \
	6053537/portainer-ce
```

### 英文版本portainer

```bash
docker run -d \
	-p 9000:9000 \
	-p 9443:9443 \
	--name portainer \
	--restart=always \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-v ./portainer_data:/data \
	portainer/portainer-ce:latest

```



### jupyter镜像

-----------------------

#### 官方镜像

```
docker run -p 8090:8000 -d --name jupyterhub001  --restart=always jupyterhub/jupyterhub:latest
```

#### 个人镜像  (GPU) 

```bash
docker run -p 8000:8000 -d --name jupyterhub  --restart=always --gpus all muaimingjun/jupyterhub:1.2.0
```



### WireGuard 

#### 服务器端

```bash
docker run -d \
  --name=wg-easy \
  -e WG_HOST=🚨YOUR_SERVER_IP \
  -e PASSWORD=🚨YOUR_ADMIN_PASSWORD \
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

#### 客户端

* windows 客户端下载  （科学上网）[Installation - WireGuard](https://www.wireguard.com/install/)

* ubuntu 

* ```bash
  sudo apt install -y iptables wireguard openresolv
  chmod 600 /etc/wireguard/wg0.conf
  wg-quick up wg0
  wg-quick down wg0
  systemctl enable wg-quick@wg0.service
  systemctl start wg-quick@wg0.service
  wg show
  ```



### frp docker

#### 服务端

限制端口版本frp

```bash

docker run -it -d \
	--restart always \
	-p 50000-50004:50000-50004 \
	-v ./frps.toml:/etc/frp/frps.toml \
	--name frp-20240111 \
	snowdreamtech/frps:0.52.3
```

```toml
[common]
bind_port = 50000
# 启用面板
dashboard_port = 50001
# 面板登录名和密码
dashboard_user = admin
dashboard_pwd = xxxxxx
# 使用http代理并使用8888端口进行穿透
#vhost_http_port = 8889
# 使用https代理并使用9999端口进行穿透
#vhost_https_port = 9999
# 日志路径
log_file = ./frps.log
# 日志级别
log_level = info
# 日志最大保存天数
log_max_days = 2
# 认证超时时间
authentication_timeout = 900
# 认证token，客户端需要和此对应
token=xxxxx
# 最大连接数
max_pool_count = 5
max_ports_per_client = 0

```



frp-restart.sh

```bash
NAME=frps
IMAGE=snowdreamtech/frps

docker stop $NAME
docker rm $NAME

docker run --restart=on-failure:3 --network host -v /home/docker/frp/frps.ini:/etc/frp/frps.ini -d --name $NAME $IMAGE

```

配置文件

```bash
[common]
bind_port = 7000
# 启用面板
dashboard_port = 7500
# 面板登录名和密码
dashboard_user = admin
dashboard_pwd = xxxxxxx
# 使用http代理并使用8888端口进行穿透
vhost_http_port = 8889
# 使用https代理并使用9999端口进行穿透
vhost_https_port = 9999
# 日志路径
log_file = ./frps.log
# 日志级别
log_level = info
# 日志最大保存天数
log_max_days = 2
# 认证超时时间
authentication_timeout = 900
# 认证token，客户端需要和此对应
token=123123123
# 最大连接数
max_pool_count = 5
max_ports_per_client = 0
```

#### 客户端

docker-compose.yml

```yaml
version: '3.3'
services:
    frpc:
        restart: always
        network_mode: host
        volumes:
            - './frpc.ini:/etc/frp/frpc.ini'
        container_name: frpc
        image: snowdreamtech/frpc
```



frpc.ini

```ini
[common]
server_addr= 127.0.0.1 #服务端服务器的公网ip
server_port= 5400 #监听端口
token = pwd123 #服务端与客户端的认证密钥

#[ssh] #ssh不建议轻易打开，被打的概率很高
#type = tcp
#local_ip = 127.0.0.1
#local_port = 22
#remote_port = 6000

[jellyfin] #tcp部署
type = tcp
local_ip = 127.0.0.1
local_port = 8096 #本地服务端口
remote_port = 6001 #远程服务器端口


#[https-web] #https部署
#type=https #协议
#local_port = 22300 #本地服务端口
#custom_domains = web.com #域名，要解析好的

#plugin= https2http #用于将本地的HTTP服务转为HTTPS的插件
#plugin_local_addr = 127.0.0.1:22300 #本地服务端口 
#plugin_crt_path = /root/ssl/web.top/web.com_bundle.crt #这两个HTTPS证书是nginx格式的,需要在证书颁发机构下载，然后放入容器内才能正常使用
#plugin_key_path = /root/ssl/web.top/web.com.key 
#plugin_host_header_rewrite = 127.0.0.1
#plugin_header_X-From-Where = frp
```



### docker ssh 探针

> 参考链接1： [sshd_config（5） - OpenBSD 手册页](https://man.openbsd.org/sshd_config#Match)
>
> 参考链接2： [Linux服务器/OpenSSH-server - LinuxServer.io](https://docs.linuxserver.io/images/docker-openssh-server)
>
> 参考链接3：[Detailed Description of How to Configure Authorized Keys for OpenSSH](https://www.ssh.com/academy/ssh/authorized-keys-openssh)
>
> 参考链接4：[Docker-Gitlab 与主机共用 ssh 的 22 端口 · Zs's Blog (zzsqwq.cn)](https://blog.zzsqwq.cn/posts/docker-gitlab-ssh/)

```yaml
---
version: "2.1"
services:
  openssh-server:
    image: linuxserver/openssh-server:latest
    container_name: openssh-server
    hostname: openssh-server #optional
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      #- PUBLIC_KEY=yourpublickey #optional
      #- PUBLIC_KEY_FILE=/path/to/file #optional
      #- PUBLIC_KEY_DIR=/path/to/directory/containing/_only_/pubkeys #optional
      #- PUBLIC_KEY_URL=https://github.com/username.keys #optional
      - SUDO_ACCESS=true #optional
      - PASSWORD_ACCESS=true #optional
      - USER_PASSWORD=password #optional
      #- USER_PASSWORD_FILE=/path/to/file #optional
      - USER_NAME=user #optional
    #volumes:
    #  - /path/to/appdata/config:/config
    #ports:
    #  - 2222:2222
    networks:
      front-net:
        ipv4_address: 173.18.0.100
    restart: unless-stopped
networks:
  front-net:
    ipam:
      driver: default
      config:
        - subnet: "173.18.0.0/24"

```



然后在宿主机运行以下脚本

方法1（两次密码认证）

```bash
useradd -m user
passwd user # 123

yum install -y sshpass
#编辑/etc/ssh/sshd_config

Match User user
  ForceCommand sshpass -p password ssh -v -o StrictHostKeyChecking=no user@173.18.0.100 -p 2222 $SSH_ORIGINAL_COMMAND $@
```

方法2（两次key透传）(未验证)

```bash
# 一段登陆脚本
#!/bin/sh

ssh -i /home/git/.ssh/id_rsa -p 4022 -o StrictHostKeyChecking=no git@127.0.0.1 # "SSH_ORIGINAL_COMMAND=\"$SSH_ORIGINAL_COMMAND\" $0 $@"



宿主机 ~/.ssh/authorized_keys: 格式
command="脚本.sh" ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC3... user@example.com


PS1='$ PWD $'
```



### poste.io

一键构建邮件服务器

```bash
docker run \
    --net=host \
    -itd \
    -e TZ=Asia/Shanghai \
    -v ./data:/data \
    --name "mailserver" \
    -h "mail.itgpt.com" \
    -t analogic/poste.io:2.3.13
```





### zero-ui

```yaml
version: "3"

services:
  zerotier:
    image: zyclonite/zerotier:1.10.6
    container_name: zu-controller
    restart: unless-stopped
    volumes:
      - ./zerotier-one:/var/lib/zerotier-one
    environment:
      - ZT_OVERRIDE_LOCAL_CONF=true
      - ZT_ALLOW_MANAGEMENT_FROM=0.0.0.0/0
    expose:
      - "9993/tcp"
    ports:
      - "9993:9993/udp"
  zero-ui:
    image: dec0dos/zero-ui:latest
    container_name: zu-main
    restart: unless-stopped
    depends_on:
      - zerotier
    volumes:
      - ./zerotier-one:/var/lib/zerotier-one
      - ./data:/app/backend/data
    environment:
      - ZU_CONTROLLER_ENDPOINT=http://zerotier:9993/
      - ZU_SECURE_HEADERS=false
      - ZU_DEFAULT_USERNAME=admin
      - ZU_DEFAULT_PASSWORD=admin
      - LISTEN_ADDRESS=0.0.0.0
    expose:
      - "4000"
    ports:
      - "33863:4000"
```

