## 一、集群部署准备

Kubernetes有三种安装方式：

1、通过yum进行安装

2、通过二进制文件进行安装

3、命令行工具kubeadm进行安装

kubeadm是Kubernetes官方提供的用于快速安装Kubernetes集群的工具，致力于简化集群的安装过程，并解决Kubernetes集群的高可用问题。

```
安装 kubernetes 所需软件包：
链接:https://pan.baidu.com/s/1GoxSWAHkB3AVn9aRzGMjkQ  
密码:az0o
```

## 二、部署kubernetes集群

### 2.1、环境准备

**准备好三台虚拟机分别做为 master、node-1、node-2**

**虚拟机硬件配置：**

master：2CPU、4G

node-1：2CPU、2G
node-2：2CPU、2G

![5.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263258940.png)

**网络配置：**
master：192.168.2.20
node-1：192.168.2.21
node-2：192.168.2.22
**操作系统：**
Centos-8 最小化安装

**主机名设置：**

```
# hostnamectl  set-hostname  master

# hostnamectl  set-hostname  node-1

# hostnamectl  set-hostname  node-2
```

**设置Hosts文件的相互解析：**

```
# cat /etc/hosts

192.168.2.20	master
192.168.2.21	node-1
192.168.2.22	node-2
```

![6.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263331272.png)

### 2.2、操作系统初始化

a、关闭swap

```
# swapoff -a && sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab 
```

b、关闭Selinux

```
# setenforce 0 && sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config
```

c、关闭firewalld

```
# systemctl stop firewalld && systemctl disable firewalld
```

d、重置Iptables并设置空规则：

```
# yum -y install iptables-services && systemctl start iptables && systemctl enable iptables && iptables -F && service iptables save
```

e、关闭不需要的服务：

```
# systemctl stop postfix && systemctl disable postfix
```

### 2.3、配置网络源

```
- 下载阿里云的yum源文件：
# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-8.repo

- 安装epel源：
# yum install -y https://mirrors.aliyun.com/epel/epel-release-latest-8.noarch.rpm

- 将repo 配置中的地址替换为阿里云镜像站地址：
# sed -i 's|^#baseurl=https://download.fedoraproject.org/pub|baseurl=https://mirrors.aliyun.com|' /etc/yum.repos.d/epel*
# sed -i 's|^metalink|#metalink|' /etc/yum.repos.d/epel*

- 配置docker源：

# yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

- 设置kubernetes源：

# cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

### 2.4、操作系统环境优化

```
- 安装依赖包：

# yum makecache && yum -y update

# yum -y install conntrack ipvsadm ipset jq iptables curl sysstat libseccomp wget vim-enhanced lrzsz  net-tools git net-tools psmisc bash-completion yum-utils.noarch nmap bind-utils

- 设置系统时区：中国/上海

# timedatectl set-timezone Asia/Shanghai  

- 将当前的 UTC 时间写入硬件时钟：

# timedatectl set-local-rtc 0

- 重启依赖于系统时间的服务：

# systemctl restart rsyslog

# systemctl restart crond
```

### 2.5、针对Kubernetes调整内核参数

```
# cat > kubernetes.conf <<EOF
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
net.ipv4.ip_forward=1
net.ipv4.tcp_tw_recycle=0
vm.swappiness=0 					# 禁止使用 swap 空间，只有当系统 OOM 时才允许使用它
vm.overcommit_memory=1 					# 不检查物理内存是否够用
vm.panic_on_oom=0 					# 开启 OOM
fs.inotify.max_user_instances=8192
fs.inotify.max_user_watches=1048576
fs.file-max=52706963
fs.nr_open=52706963
net.ipv6.conf.all.disable_ipv6=1
net.netfilter.nf_conntrack_max=2310720
EOF

# cp kubernetes.conf /etc/sysctl.d/kubernetes.conf

# sysctl -p /etc/sysctl.d/kubernetes.conf
```

### 2.6、设置 rsyslogd 和 systemd journald

```
# mkdir /var/log/journal 					# 持久化保存日志的目录
# mkdir /etc/systemd/journald.conf.d
# cat > /etc/systemd/journald.conf.d/99-prophet.conf <<EOF
[Journal]
Storage=persistent					# 持久化保存到磁盘
Compress=yes						# 压缩历史日志
SyncIntervalSec=5m					# 写入硬盘间隔
RateLimitInterval=30s					# 限制日志的生成速率-时间段内
RateLimitBurst=1000					# 限制日志的生成速率-每个服务最多允许产生的日志数量(条数)
SystemMaxUse=10G					# 最大占用空间 10G
SystemMaxFileSize=200M					# 单日志文件最大 200M
MaxRetentionSec=2week					# 日志保存时间 2 周
ForwardToSyslog=no					# 不将日志转发到 syslog
EOF

# systemctl restart systemd-journald
```

### 2.7、设置kube-proxy开启ipvs的前置条件

```
# modprobe br_netfilter

# cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF

# chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

### 2.8、安装 Docker 软件

```
# yum -y install yum-utils device-mapper-persistent-data lvm2
#yum -y install  https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm

# yum -y install docker-ce

# mkdir /etc/docker		创建 /etc/docker 目录

配置 daemon：
# cat > /etc/docker/daemon.json <<EOF
{
"exec-opts": ["native.cgroupdriver=systemd"],
"registry-mirrors": ["https://v16stybc.mirror.aliyuncs.com"],
"log-driver": "json-file",
"log-opts": {
"max-size": "100m"
}
}
EOF

# mkdir -p /etc/systemd/system/docker.service.d

# systemctl daemon-reload && systemctl restart docker && systemctl enable docker
```

### 2.9、安装 Kubeadm

```
# yum -y install kubeadm-1.18.0 kubectl-1.18.0 kubelet-1.18.0
# systemctl enable kubelet.service
```

### 2.10、初始化Master节点

```
# kubeadm config print init-defaults > kubeadm-config.yaml

进行如下修改：

localAPIEndpoint:
advertiseAddress: 192.168.2.20
···
kubernetesVersion: v1.15.1
···
networking:
podSubnet: "10.244.0.0/16"
serviceSubnet: 10.96.0.0/12
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
featureGates:
SupportIPVSProxyMode: true
mode: ipvs
```

完整配置文件如下（注意格式）：

```
apiVersion: kubeadm.k8s.io/v1beta2
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: 192.168.2.20
  bindPort: 6443
nodeRegistration:
  criSocket: /var/run/dockershim.sock
  name: master
  taints:
  - effect: NoSchedule
    key: node-role.kubernetes.io/master
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta2
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns:
  type: CoreDNS
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: k8s.gcr.io
kind: ClusterConfiguration
kubernetesVersion: v1.15.1
networking:
  dnsDomain: cluster.local
  podSubnet: "10.244.0.0/16"
  serviceSubnet: 10.96.0.0/12
scheduler: {}
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
featureGates:
  SupportIPVSProxyMode: true
mode: ipvs
```

### 2.11、安装配置集群

```powersell
- 安装Master：
# kubeadm init --config=kubeadm-config.yaml --upload-certs | tee kubeadm-init.log

- 添加 --upload-certs 参数可以在后续执行加入节点时自动分发证书文件。追加的 tee kubeadm-init.log 用以输出日志

# mkdir -p $HOME/.kube
# cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
# chown $(id -u):$(id -g) $HOME/.kube/config

- 安装flannel网络：
(官网地址：https://github.com/coreos/flannel)

# wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# kubectl apply -f kube-flannel.yml

- Node节点加入： 注意下面这条命令在安装完Master后会输出在屏幕上

# kubeadm join 192.168.2.20:6443 --token abcdef.0123456789abcdef \
--discovery-token-ca-cert-hash sha256:424676564f3a33bc1d7d9451a322613188e39dcaa004386b453794d8135adaad

- kubectl有很多子命令和参数，为了提高使用命令行的效率，通常建议安装 kebectl 的 bash 命令补全脚本：

# source <(kubectl completion bash)
# echo "source <(kubectl completion bash)" >> ~/.bashrc
```

![7.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263691236.png)

2.12、查看集群状态

```
# kuberctl  get  nodes  -o  wide
```

**集群可用性验证**

```
# cat pod.yaml

apiVersion: v1
kind: Pod
metadata:
 name: nginx
 labels:
    app: web
spec:
 containers:
    - name: nginx
      image: docker.io/nginx
      ports:
       - containerPort: 80


# kubectl  create  -f   pod.yaml
```

通过命令查看是否创建成功： kubectl get pod -o wide

![10.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263894333.png)

通过修改容器名称将nginx修改为nginx-1后，创建第二个pod资源后查看：

![11.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263911832.png)

通过curl命令查看服务是否可以正常被访问：

![12.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263931169.png)

## 三、集群版本更新

这里演示的是以 K8S 1.15版本为例，具体的版本升级以你们自己实验机上安装的版本号为准！！！

kubeadm提供了upgrade命令用于对kubeadm安装的Kubernetes集群进行升级，但是开始之前需要注意，虽然kubeadm的升级不会触及工作负载，但还是要在升级之前做好备份，升级过程可能会因为Pod的变化而造成容器重启。

首先执行 kubeadm upgrade plan 命令：

![13.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263954459.png)

可以看到，我们当前使用的版本为1.15.1，最新的稳定版本为1.15.7，并且告知我们，如果想要进行升级操作，那么首先我们需要将kubeadm升级为1.15.7版本，然后执行升级命令。

执行命令 yum -y install kubeadm-1.15.7 进行升级

![14.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263982064.png)

将kubeadm升级完成后我们执行 kubeadm upgrade apply v1.15.7 升级命令，系统询问，是否进行更新输入 Y 回车

![15.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602263998442.png)

等待片刻后，升级完成

![16.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602264017416.png)

然后再将 kubectl 与 kubelet 进行升级，然后重启 kubelet 后，查看节点版本已经升级为1.15.7

![17.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602264037871.png)

查看组件状态

![18.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/10/1602264052827.png)