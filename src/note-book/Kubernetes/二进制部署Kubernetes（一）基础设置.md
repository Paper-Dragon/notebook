# 二进制部署Kubernetes（一）基础设置

## 架构

| 主机名             | ip               |                         |
| ------------------ | ---------------- | ----------------------- |
| harbor.cidana.com  | 192.168.0.94/24  | 签发证书，容器仓库，NFS |
| master1.cidana.com | 192.168.0.84/24  |                         |
| master2.cidana.com | 192.168.0.172/24 |                         |
| worker1.cidana.com | 192.168.0.88/24  |                         |
| worker2.cidana.com | 192.168.0.86/24  |                         |
| DNS&&DHCP&&smb     | 192.168.0.543/24 | Fileserver              |


## 安装Docker
```bash 
curl -sSL https://get.docker.com | bash
systemctl start docker
docker info
```

## 关闭 swap 分区
1、如果开启了 swap 分区，kubelet 会启动失败(可以通过将参数 --fail-swap-on 设置为false 来忽略 swap on)，故需要在每台机器上关闭 swap 分区：
```bash
$ sudo swapoff -a
```

2、为了防止开机自动挂载 swap 分区，可以注释 /etc/fstab 中相应的条目：
```bash
$ sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

关闭 SELinux1、关闭 SELinux，否则后续 K8S 挂载目录时可能报错 Permission denied ：
```bash
$ sudo setenforce 0
```

2、修改配置文件，永久生效；
```bash
$ grep SELINUX /etc/selinux/config
SELINUX=disabled
```


## 加载内核模块
```bash
$ sudo modprobe br_netfilter
$ sudo modprobe ip_vs
```


## 设置系统参数
```bash
$ cat > kubernetes.conf <<EOF
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
net.ipv4.ip_forward=1
net.ipv4.tcp_tw_recycle=0
vm.swappiness=0
vm.overcommit_memory=1
vm.panic_on_oom=0
fs.inotify.max_user_watches=89100
fs.file-max=52706963
fs.nr_open=52706963
net.ipv6.conf.all.disable_ipv6=1
net.netfilter.nf_conntrack_max=2310720
EOF
$ sudo cp kubernetes.conf /etc/sysctl.d/kubernetes.conf
$ sudo sysctl -p /etc/sysctl.d/kubernetes.conf
$ sudo mount -t cgroup -o cpu,cpuacct none /sys/fs/cgroup/cpu,cpuacct
```


## 设置系统时区
1、调整系统 TimeZone
```bash
$ sudo timedatectl set-timezone Asia/Shanghai
```

2、将当前的 UTC 时间写入硬件时钟
```bash
$ sudo timedatectl set-local-rtc 0
```

3、重启依赖于系统时间的服务
```bash
$ sudo systemctl restart rsyslog
$ sudo systemctl restart crond
```

## 更新系统时间
```bash
$ yum -y install ntpdate
$ sudo ntpdate cn.pool.ntp.org
```


## 检查系统内核和模块是否适合运行
docker (仅适用于linux 系统)
```bash
$ curl https://raw.githubusercontent.com/docker/docker/master/contrib/check-config.sh > check-config.sh
$ chmod +x check-config.sh
$ bash ./check-config.sh
```
## 创建根证书 CA
### 创建CA配置文件

CA 配置文件用于配置根证书的使用场景 (profile) 和具体参数 (usage，过期时间、服务端认证、客户端认证、加密等)，后续在签名其它证书时需要指定特定场景。
```bash
[root@kube-master ~]# cd /opt/cert
[root@kube-master cert]# vim ca-config.json
{
    "signing": {
        "default": {
            "expiry": "175200h"
        },
        "profiles": {
            "kubernetes": {
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth",
                    "client auth"
                ],
                "expiry": "175200h"
            }
        }
    }
}
```
注：
① signing ：表示该证书可用于签名其它证书，生成的 ca.pem 证书中CA=TRUE ；
② server auth ：表示 client 可以用该该证书对 server 提供的证书进行验证；
③ client auth ：表示 server 可以用该该证书对 client 提供的证书进行验证；
### 创建生成CA证书签名请求（csr）的json配置文件
`/opt/cert/ca-csr.json`
```bash

{
    "CN": "kubernetes",
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "BeiJing",
            "L": "BeiJing",
            "O": "k8s",
            "OU": "4Paradigm"
        }
    ]
}
```

注：
① CN： Common Name ，kube-apiserver 从证书中提取该字段作为请求的用户名(User Name)，浏览器使用该字段验证网站是否合法；
② O： Organization ，kube-apiserver 从证书中提取该字段作为请求用户所属的组(Group)；
③ kube-apiserver 将提取的 User、Group 作为 RBAC 授权的用户标识；


### 生成 CA 证书和私钥
```bash

                                              证书和私钥放一起  |   分开 承载式证书
[root@harbor certs]# cfssl gencert -initca ca-csr.json | cfssljson -bare ca
2022/01/19 14:17:01 [INFO] generating a new CA key and certificate from CSR
2022/01/19 14:17:01 [INFO] generate received request
2022/01/19 14:17:01 [INFO] received CSR
2022/01/19 14:17:01 [INFO] generating key: rsa-2048
2022/01/19 14:17:01 [INFO] encoded CSR
2022/01/19 14:17:01 [INFO] signed certificate with serial number 313649323783493005105708325985612212721218233369

[root@harbor certs]# ll
total 20
-rw-r--r-- 1 root root  402 Jan 19 14:15 ca-config.json
-rw-r--r-- 1 root root 1005 Jan 19 14:17 ca.csr
-rw-r--r-- 1 root root  281 Jan 19 14:16 ca-csr.json
-rw------- 1 root root 1679 Jan 19 14:17 ca-key.pem
-rw-r--r-- 1 root root 1367 Jan 19 14:17 ca.pem
[root@harbor certs]#
```

### 分发证书文件

将生成的 CA 证书、秘钥文件、配置文件拷贝到所有节点的/opt/k8s/cert 目录下：

```bash
[root@kube-master ~]# vim /opt/k8s/script/scp_k8scert.sh

NODE_IPS=("192.168.10.108" "192.168.10.109" "192.168.10.110")
for node_ip in ${NODE_IPS[@]};do
    echo ">>> ${node_ip}"
    ssh root@${node_ip} "mkdir -p /opt/k8s/cert && chown -R k8s /opt/k8s"
    scp /opt/k8s/cert/ca*.pem /opt/k8s/cert/ca-config.json k8s@${node_ip}:/opt/k8s/cert
done



[root@kube-master ~]# chmod +x /opt/k8s/script/scp_k8scert.sh && /opt/k8s/script/scp_k8scert.sh
```
