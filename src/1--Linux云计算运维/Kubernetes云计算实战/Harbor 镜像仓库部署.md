## 一、创建自签证书：

### 1.1、准备工作

- 检查是否已经安装 openssl： openssl version
- 创建存放证书目录并进入目录

```
[root@zutuanxue ~]# mkdir /opt/harbor-ca-key
[root@zutuanxue ~]# cd /opt/harbor-ca-key
```

### 1.2、创建秘钥

**生成私钥**

```
[root@zutuanxue harbor-ca-key]# openssl genrsa -des3 -out server.pass.key 2048

# genra	生成RSA私钥
# -des3	des3算法
# -out server.key 生成的私钥文件名
# 2048 私钥长度
# 设置密码，密麻麻长度不能少于4位
```

**去除私钥中的密码**

```
[root@zutuanxue harbor-ca-key]# openssl rsa -in server.pass.key -out server.key

# 有密码的私钥是server.pass.key，没有密码的私钥是server.key
```

**生成CSR(证书签名请求)**

```
[root@zutuanxue harbor-ca-key]# openssl req -new -key server.key -out server.csr -subj "/C=CN/ST=bj/L=bj/O=zutuanxue/OU=zutuanxue/CN=www.zutuanxue.com"

subj参数说明如下：

/C=国家
/ST=省
/L=城市
/O=组织或企业
/OU=部门
/CN=域名或IP

第四步：生成自签名SSL证书

openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# -days 证书有效期

# X.509证书包含三个文件：key，csr，crt。

# key是服务器上的私钥文件，用于对发送给客户端数据的加密，以及对从客户端接收到数据的解密

# csr是证书签名请求文件，用于提交给证书颁发机构（CA）对证书签名

# crt是由证书颁发机构（CA）签名后的证书，或者是开发者自签名的证书，包含证书持有人的信息，持有人的公钥，以及签署者的签名等信息

# 在密码学中，X.509是一个标准，规范了公开秘钥认证、证书吊销列表、授权凭证、凭证路径验证算法等。
```

## 二、部署 Harbor

**准备工作**

- Harbor 离线安装包
- docker-compose

### 2.1、部署前准备

解压 Harboe 离线安装包后，进入解压后的目录，编辑 harbor.yaml 文件

- 修改 hostname 字段,改为自己的主机名

```
	hostname: www.zutuanxue.com
```

- 修改 certificate 与 private_key 字段如下，修改为你自己环境下的证书存放目录：

```
  certificate: /opt/harbor-ca-key/server.crt
  private_key: /opt/harbor-ca-key/server.key
```

- 修改 harbor_admin_password 字段，设置管理员用户的密码

```
默认密码为 Harbor12345 ，如果配置文件内保持了默认密码的话，可以在搭建完成后在 web 页面进行密码修改操作。
```

### 2.2、安装Harbor

在解压后的 Harbor 目录内，有 “prepare” 初始化文件以及 ”install.sh“ 安装文件，先执行初始化操作 ./prepare 初始化完成以后执行安装操作 ./install.sh 然后等待安装完成即可。

```
[root@zutuanxue Harbor]# ./prepare
[root@zutuanxue Harbor]# ./install.sh
```

### 2.3、验证Harbor仓库

使用docker客户端连接Harbor仓库，验证是否能够正确连接

**设置仓库URL**
因为我们使用的是自签证书，所以我们要在需要进行 docker login 的节点上编辑 daemon.json 文件，添加信任，否则话我们将无法正常进行 docker login 的操作：

```
[root@zutuanxue Harbor]# vim /etc/docker/daemon.json

添加内容如下：

{

"insecure-registries": ["https://www.zutuanxue.com"]

}

保存退出，重启 docker 服务即可。
[root@zutuanxue docker]# systemctl restart docker 
```

如果你 hostname 字段设置的是域名，记得在 /etc/hosts 文件内添加解析，示例如下：

```
vim /etc/hosts
192.168.1.150	www.zutuanxue.com

添加完成后保存退出即可。
```

**登录验证**

```
完成后可以进行验证：

docker login www.zutuanxue.com

Username：admin
Password：Harbor12345

输入完密码后显示如下信息

Authenticating with existing credentials...
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

证明登录成功。
```

同样，如果你想 web 登录进行管理，那么你需要修改你宿主机的 hosts 文件,在里面添加对应的解析条目

**MAC 系统设置**

```
打开终端 → sudo vim /etc/hosts → 添加 IP 与 域名 的解析即可
```

**Windows 系统设置**

```
1、打开计算机后，点击进入C盘，找到 windows 文件夹
2、在windows文件中找到System32 → drivers → etc ，进入到 etc 文件夹中就能看到 hosts 文件
3、在末尾添加对应解析即可，然后保存退出
```

添加完解析后，打开浏览器，输入我们设置的域名即可访问，因为我们使用的是自签证书，所以浏览器会有安全提示，说我们访问的网站不安全，直接无视该信息，点击继续访问即可，然后输入我们的用户名 admin 密码 Harbor12345 即可成功登陆。