## 一、Kubernetes 集群高可用

下载链接：

链接:https://pan.baidu.com/s/1U3UWaZSA5b5bf3QnR_XZGw 密码:2flw

### 1.1、环境准备

**准备好五台虚拟机分别做为 master、master-1、master-2、node-1、node-2**

**虚拟机硬件配置：**

master-1：2CPU、2G

master-2：2CPU、2G

master-3：2CPU、2G

node-1：2CPU、2G

node-2：2CPU、2G

**网络配置：**

master-1：192.168.1.160

master-2：192.168.1.161

master-3：192.168.1.162

node-1：192.168.1.163

node-2：192.168.1.164

**操作系统：**

Centos-8.1 最小化安装

**主机名设置：**

hostnamectl set-hostname zutuanxue-master-1

hostnamectl set-hostname zutuanxue-master-2

hostnamectl set-hostname zutuanxue-master-3

hostnamectl set-hostname zutuanxue-node-1

hostnamectl set-hostname zutuanxue-node-2

**设置Hosts文件的相互解析：**

vim /etc/hosts

192.168.1.160 zutuanxue-master-1

192.168.1.161 zutuanxue-master-2

192.168.1.162 zutuanxue-master-3

192.168.1.163 zutuanxue-node-1

192.168.1.164 zutuanxue-node-2

192.168.1.170 zutuanxue-master-vip

### 1.2、操作系统初始化 (所有节点)

> ```
> 关闭swap：
> 
> swapoff -a && sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab 
> 
> 关闭Selinux：
> 
> setenforce 0 && sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config
> 
> 关闭firewalld：
> 
> systemctl stop firewalld && systemctl disable firewalld
> 
> 重置Iptables并设置空规则：
> 
> yum -y install iptables-services && systemctl start iptables && systemctl enable iptables && iptables -F && service iptables save
> 
> 关闭不需要的服务：
> 
> systemctl stop postfix && systemctl disable postfix
> ```

### 1.3、配置网络源 (所有节点)

> ```
> yum源：
> 
> wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-8.repo
> 
> repo源：
> 
> yum install -y https://mirrors.aliyun.com/epel/epel-release-latest-8.noarch.rpm
> 
> 将 repo 配置中的地址替换为阿里云镜像站地址：
> 
> sed -i 's|^#baseurl=https://download.fedoraproject.org/pub|baseurl=https://mirrors.aliyun.com|' /etc/yum.repos.d/epel*
> 
> sed -i 's|^metalink|#metalink|' /etc/yum.repos.d/epel*
> 
> 
> docker源：
> 
> yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
> 
> kubernetes源：
> 
> cat <<EOF > /etc/yum.repos.d/kubernetes.repo
> [kubernetes]
> name=Kubernetes
> baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
> enabled=1
> gpgcheck=1
> repo_gpgcheck=1
> gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
> EOF
> ```

### 1.4、操作系统环境优化 (所有节点)

> ```
> 11、安装依赖包：
> 
> yum -y makecache && yum -y update
> 
> yum -y install conntrack ipvsadm ipset jq iptables curl sysstat libseccomp wget vim-enhanced lrzsz  net-tools git net-tools psmisc bash-completion yum-utils.noarch nmap bind-utils
> 
> 12、设置系统时区：中国/上海
> 
> timedatectl set-timezone Asia/Shanghai  
> 
> 13、将当前的 UTC 时间写入硬件时钟：
> 
> timedatectl set-local-rtc 0
> 
> 14、重启依赖于系统时间的服务：
> 
> systemctl restart rsyslog
> 
> systemctl restart crond
> ```

### 1.5、针对Kubernetes调整内核参数 (所有节点)

> ```
> cat > kubernetes.conf <<EOF
> net.bridge.bridge-nf-call-iptables=1
> net.bridge.bridge-nf-call-ip6tables=1
> net.ipv4.ip_forward=1
> net.ipv4.tcp_tw_recycle=0
> vm.swappiness=0 						# 禁止使用 swap 空间，只有当系统 OOM 时才允许使用它
> vm.overcommit_memory=1 			# 不检查物理内存是否够用
> vm.panic_on_oom=0 					# 开启 OOM
> fs.inotify.max_user_instances=8192
> fs.inotify.max_user_watches=1048576
> fs.file-max=52706963
> fs.nr_open=52706963
> net.ipv6.conf.all.disable_ipv6=1
> net.netfilter.nf_conntrack_max=2310720
> EOF
> 
> cp kubernetes.conf /etc/sysctl.d/kubernetes.conf
> 
> sysctl -p /etc/sysctl.d/kubernetes.conf
> ```

### 1.6、设置 rsyslogd 和 systemd journald (所有节点)

> ```
> mkdir /var/log/journal 				# 持久化保存日志的目录
> 
> mkdir /etc/systemd/journald.conf.d
> 
> cat > /etc/systemd/journald.conf.d/99-prophet.conf <<EOF
> [Journal]
> Storage=persistent					# 持久化保存到磁盘
> Compress=yes								# 压缩历史日志
> SyncIntervalSec=5m					# 写入硬盘间隔
> RateLimitInterval=30s				# 限制日志的生成速率-时间段内
> RateLimitBurst=1000					# 限制日志的生成速率-每个服务最多允许产生的日志数量(条数)
> SystemMaxUse=10G						# 最大占用空间 10G
> SystemMaxFileSize=200M			# 单日志文件最大 200M
> MaxRetentionSec=2week				# 日志保存时间 2 周
> ForwardToSyslog=no					# 不将日志转发到 syslog
> EOF
> 
> systemctl restart systemd-journald
> ```

### 1.7、关闭 NUMA (所有节点)

```
cp /etc/default/grub{,.bak}

vim /etc/default/grub # 在 GRUB_CMDLINE_LINUX 一行添加 `numa=off` 参数，如下所示：

GRUB_CMDLINE_LINUX="crashkernel=auto rd.lvm.lv=centos/root rhgb quiet numa=off"
 
cp /boot/grub2/grub.cfg{,.bak}

grub2-mkconfig -o /boot/grub2/grub.cfg
```

### 1.8、设置kube-proxy开启ipvs的前置条件 (所有节点)

```
modprobe br_netfilter

cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF

chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

### 1.9、安装 Docker 软件 (所有节点)

```
yum -y install yum-utils device-mapper-persistent-data lvm2

yum -y install  https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm

yum -y install docker-ce

mkdir /etc/docker		创建 /etc/docker 目录

touch /etc/docker/daemon.json

配置 daemon：

cat > /etc/docker/daemon.json <<EOF
{
"exec-opts": ["native.cgroupdriver=systemd"],
"registry-mirrors": ["https://v16stybc.mirror.aliyuncs.com"],
"log-driver": "json-file",
"log-opts": {
"max-size": "100m"
}
}
EOF

mkdir -p /etc/systemd/system/docker.service.d

systemctl daemon-reload && systemctl restart docker && systemctl enable docker
```

### 1.10、启动 Haproxy 与 Keepalived 容器 (在主节点)

```
mkdir /opt/test

cd /opt/test

将我们的镜像等文件上传到该目录

导入镜像：

docker load -i haproxy.tar.gz

docker load -i keepalived.tar 

tar zxvf start.keep.tar.gz

mv data /

cd /data/lb

ls
# etc  start-haproxy.sh  start-keepalived.sh

vim etc/haproxy.cfg 在文件底部修改相关参数：

server rancher01 192.168.1.160:6443
# server rancher02 192.168.1.161:6443
# server rancher03 192.168.1.162:6443
# 为了避免将主 Master 初始化为其他的节点 全部操作完成之前，先不写从节点 IP 地址。


vim start-haproxy.sh  在文件开头修改相关参数

MasterIP1=192.168.1.160
MasterIP2=192.168.1.161
MasterIP3=192.168.1.162


 ./start-haproxy.sh
 
 netstat -anpt | grep 6444
# tcp6       0      0 :::6444    :::*         LISTEN      32525/docker-proxy


vim start-keepalived.sh 修改网卡等相关信息

VIRTUAL_IP=192.168.1.170
INTERFACE=ens160

./start-keepalived.sh 

ip addr show

ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether fa:16:3e:c0:d5:a6 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.160/24 brd 192.168.2.255 scope global noprefixroute eth0
       valid_lft forever preferred_lft forever
    inet 192.168.1.170/24 scope global secondary eth0
       valid_lft forever preferred_lft forever
```

### 1.11、安装 Kubeadm (在主节点)

```
yum -y install kubeadm-1.18.1 kubectl-1.18.1 kubelet-1.18.1

systemctl enable kubelet.service
```

### 1.12、初始化Master节点 (主节点)

```
kubeadm config print init-defaults > kubeadm-config.yaml

进行如下修改：

localAPIEndpoint:
advertiseAddress: 192.168.1.160
···
controlPlaneEndpoint: "192.168.1.170:6444"
···
kubernetesVersion: v1.18.1
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

完整配置如下：

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
  advertiseAddress: 192.168.1.160
  bindPort: 6443
nodeRegistration:
  criSocket: /var/run/dockershim.sock
  name: zutuanxue-master-1
  taints:
  - effect: NoSchedule
    key: node-role.kubernetes.io/master
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta2
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controlPlaneEndpoint: "192.168.1.170:6444"
controllerManager: {}
dns:
  type: CoreDNS
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: k8s.gcr.io
kind: ClusterConfiguration
kubernetesVersion: v1.18.1
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

### 1.13、安装配置集群 (主节点)

```
安装Master：

kubeadm init --config=kubeadm-config.yaml --upload-certs | tee kubeadm-init.log

mkdir -p $HOME/.kube

cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

chown $(id -u):$(id -g) $HOME/.kube/config

安装flannel网络：

wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

kubectl apply -f kube-flannel.yml
```

![194.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490973408.png)

### 1.14、将从节点加入集群

```
#---------------------Master 节点使用下面这条命令加入集群------------------------------#
  kubeadm join 192.168.1.170:6444 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:ec36d9832497453d5297e86f13928a3374e831da8861372f2086ea79c000bad7 \
    --control-plane --certificate-key 80847d457d198a8ce1483817e11de8a472ff68b94410db2574e55c2f56f1b7be
#----------------------------------------------------------------------------------#

#------------------------Node 节点使用下面这条命令加入集群------------------------------#
kubeadm join 192.168.1.170:6444 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:ec36d9832497453d5297e86f13928a3374e831da8861372f2086ea79c000bad7
#---------------------------------------------------------------------------------#


在主服务器上将 /data 推送到从服务器上：

scp -r  /data root@192.168.1.161:/

scp -r  /data root@192.168.1.162:/


分别在每台从服务器上执行下列命令

cd /data/lb

./start-haproxy.sh

./start-keepalived.sh 

yum -y install kubeadm-1.18.1 kubectl-1.18.1 kubelet-1.18.1

systemctl enable kubelet.service

# 注意，不要执行错命令，千万别复制成 Node 加入集群的命令在辅服务器上执行！！！

kubeadm join 192.168.1.170:6444 --token abcdef.0123456789abcdef \
    --discovery-token-ca-cert-hash sha256:ec36d9832497453d5297e86f13928a3374e831da8861372f2086ea79c000bad7 \
    --control-plane --certificate-key 80847d457d198a8ce1483817e11de8a472ff68b94410db2574e55c2f56f1b7be

mkdir -p $HOME/.kube

cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

chown $(id -u):$(id -g) $HOME/.kube/config
```

![195.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490985331.png)

### 1.15、在所有节点执行

```
vim /data/lb/etc/haproxy.cfg 在文件底部修改相关参数（要么自己补齐，要么将#号去掉）：

server rancher01 192.168.1.160:6443
server rancher02 192.168.1.161:6443
server rancher03 192.168.1.162:6443

删掉老的 HAProxy ，重新启动一个：

docker rm -f HAProxy-K8S && bash /data/lb/start-haproxy.sh

所有 Master 上执行下列命令：

# kubectl有很多子命令和参数，为了提高使用命令行的效率，通常建议安装 kebectl 的 bash 命令补全脚本
source <(kubectl completion bash)

echo "source <(kubectl completion bash)" >> ~/.bashrc
```