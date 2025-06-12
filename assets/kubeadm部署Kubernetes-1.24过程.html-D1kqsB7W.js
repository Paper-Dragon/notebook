import{ah as n,ai as o,ar as t,am as r}from"./app-9iAvcpSg.js";const a="/assets/d77e768317fdf704128c6a92a58bfd41-C4yQGIe6.png",s={};function i(c,e){return r(),o("div",null,e[0]||(e[0]=[t(`<h1 id="kubeadm部署kubernetes-1-24过程" tabindex="-1"><a class="header-anchor" href="#kubeadm部署kubernetes-1-24过程"><span>kubeadm部署Kubernetes-1.24过程</span></a></h1><h1 id="前言" tabindex="-1"><a class="header-anchor" href="#前言"><span>前言</span></a></h1><p>kubeadm 是 Kubernetes 官方提供的用于快速安部署 Kubernetes 集群的工具，伴随 Kubernetes 每个版本的发布都会同步更新，kubeadm 会对集群配置方面的一些实践做调整，通过实验 kubeadm 可以学习到 Kubernetes 官方在集群配置上一些新的最佳实践。</p><h1 id="一、准备" tabindex="-1"><a class="header-anchor" href="#一、准备"><span>一、准备</span></a></h1><h2 id="_1-1、系统配置" tabindex="-1"><a class="header-anchor" href="#_1-1、系统配置"><span>1.1、系统配置</span></a></h2><p>在安装之前，需要先做好如下准备。3 台 CentOS 7.9 主机如下：</p><pre><code>cat /etc/hosts
192.168.96.151    node1
192.168.96.152    node2
192.168.96.153    node3
</code></pre><p>在各个主机上完成下面的系统配置。如果各个主机启用了防火墙策略，需要开放 Kubernetes 各个组件所需要的端口，可以查看 Ports and Protocols 中的内容, 开放相关端口或者关闭主机的防火墙。</p><p>禁用SELINUX：</p><p>setenforce 0</p><pre><code>vi /etc/selinux/config
SELINUX=disabled
</code></pre><p>创建 /etc/modules-load.d/containerd.conf 配置文件:</p><pre><code>cat &lt;&lt; EOF &gt; /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF
</code></pre><p>执行以下命令使配置生效:</p><pre><code>modprobe overlay
modprobe br_netfilter
</code></pre><p>创建 /etc/sysctl.d/99-kubernetes-cri.conf 配置文件：</p><pre><code>cat &lt;&lt; EOF &gt; /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
user.max_user_namespaces=28633
EOF
</code></pre><p>执行以下命令使配置生效:</p><p>sysctl -p /etc/sysctl.d/99-kubernetes-cri.conf</p><h2 id="_1-2、配置服务器支持开启ipvs的前提条件" tabindex="-1"><a class="header-anchor" href="#_1-2、配置服务器支持开启ipvs的前提条件"><span>1.2、配置服务器支持开启ipvs的前提条件</span></a></h2><p>由于 ipvs 已经加入到了内核的主干，所以为 kube-proxy 开启 ipvs 的前提需要加载以下的内核模块：</p><pre><code>ip_vs
ip_vs_rr
ip_vs_wrr
ip_vs_sh
nf_conntrack_ipv4
</code></pre><p>在各个服务器节点上执行以下脚本:</p><pre><code>cat &gt; /etc/sysconfig/modules/ipvs.modules &lt;&lt;EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF
chmod 755 /etc/sysconfig/modules/ipvs.modules &amp;&amp; bash /etc/sysconfig/modules/ipvs.modules &amp;&amp; lsmod | grep -e ip_vs -e nf_conntrack_ipv4
</code></pre><p>上面脚本创建了的 /etc/sysconfig/modules/ipvs.modules 文件，保证在节点重启后能自动加载所需模块。 使用 lsmod | grep -e ip_vs -e nf_conntrack_ipv4 命令查看是否已经正确加载所需的内核模块。接下来还需要确保各个节点上已经安装了 ipset 软件包，为了便于查看 ipvs 的代理规则，最好安装一下管理工具 ipvsadm。</p><p>yum install -y ipset ipvsadm</p><p>如果不满足以上前提条件，则即使 kube-proxy 的配置开启了 ipvs 模式，也会退回到 iptables 模式。</p><h2 id="_1-3、部署容器运行时-containerd" tabindex="-1"><a class="header-anchor" href="#_1-3、部署容器运行时-containerd"><span>1.3、部署容器运行时 Containerd</span></a></h2><p>在各个服务器节点上安装容器运行时 Containerd。下载Containerd的二进制包:</p><p>wget https://github.com/containerd/containerd/releases/download/v1.6.4/cri-containerd-cni-1.6.4-linux-amd64.tar.gz</p><p>cri-containerd-cni-1.6.4-linux-amd64.tar.gz 压缩包中已经按照官方二进制部署推荐的目录结构布局好。 里面包含了 systemd 配置文件，containerd 以及 cni 的部署文件。 将解压缩到系统的根目录 / 中:</p><pre><code>tar -zxvf cri-containerd-cni-1.6.4-linux-amd64.tar.gz -C /
 
etc/
etc/systemd/
etc/systemd/system/
etc/systemd/system/containerd.service
etc/crictl.yaml
etc/cni/
etc/cni/net.d/
etc/cni/net.d/10-containerd-net.conflist
usr/
usr/local/
usr/local/sbin/
usr/local/sbin/runc
usr/local/bin/
usr/local/bin/critest
usr/local/bin/containerd-shim
usr/local/bin/containerd-shim-runc-v1
usr/local/bin/ctd-decoder
usr/local/bin/containerd
usr/local/bin/containerd-shim-runc-v2
usr/local/bin/containerd-stress
usr/local/bin/ctr
usr/local/bin/crictl
......
opt/cni/
opt/cni/bin/
opt/cni/bin/bridge
......
</code></pre><p>注意经测试 cri-containerd-cni-1.6.4-linux-amd64.tar.gz 包中包含的 runc 在 CentOS 7 下的动态链接有问题，这里从 runc 的 github 上单独下载 runc，并替换上面安装的 containerd 中的 runc:</p><p>wget https://github.com/opencontainers/runc/releases/download/v1.1.2/runc.amd64</p><p>接下来生成 containerd 的配置文件:</p><pre><code>mkdir -p /etc/containerd
containerd config default &gt; /etc/containerd/config.toml
</code></pre><p>根据文档 Container runtimes 中的内容，对于使用 systemd 作为 init system 的 Linux 的发行版，使用 systemd 作为容器的 cgroup driver 可以确保服务器节点在资源紧张的情况更加稳定，因此这里配置各个节点上 containerd 的 cgroup driver 为 systemd。修改前面生成的配置文件 /etc/containerd/config.toml：</p><pre><code>[plugins.&quot;io.containerd.grpc.v1.cri&quot;.containerd.runtimes.runc]
  ...
  [plugins.&quot;io.containerd.grpc.v1.cri&quot;.containerd.runtimes.runc.options]
    SystemdCgroup = true
</code></pre><p>再修改 /etc/containerd/config.toml 中的</p><pre><code>[plugins.&quot;io.containerd.grpc.v1.cri&quot;]
  ...
  # sandbox_image = &quot;k8s.gcr.io/pause:3.6&quot;
  sandbox_image = &quot;registry.aliyuncs.com/google_containers/pause:3.7&quot;
</code></pre><p>配置 containerd 开机启动，并启动 containerd</p><p>systemctl enable containerd --now</p><p>使用 crictl 测试一下，确保可以打印出版本信息并且没有错误信息输出:</p><pre><code>crictl version
Version:  0.1.0
RuntimeName:  containerd
RuntimeVersion:  v1.6.4
RuntimeApiVersion:  v1alpha2
</code></pre><h1 id="二、使用-kubeadm-部署-kubernetes" tabindex="-1"><a class="header-anchor" href="#二、使用-kubeadm-部署-kubernetes"><span>二、使用 kubeadm 部署 Kubernetes</span></a></h1><h2 id="_2-1、安装-kubeadm-和-kubelet" tabindex="-1"><a class="header-anchor" href="#_2-1、安装-kubeadm-和-kubelet"><span>2.1、安装 kubeadm 和 kubelet</span></a></h2><p>下面在各节点安装 kubeadm 和 kubelet：</p><pre><code>cat &lt;&lt;EOF &gt; /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
        http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

yum makecache fast
yum install kubelet kubeadm kubectl
</code></pre><p>运行 kubelet --help 可以看到原来 kubelet 的绝大多数命令行 flag 参数都被 DEPRECATED 了，官方推荐我们使用 --config 指定配置文件，并在配置文件中指定原来这些 flag 所配置的内容。具体内容可以查看这里 Set Kubelet parameters via a config file。最初 Kubernetes 这么做是为了支持动态 Kubelet 配置（Dynamic Kubelet Configuration），但动态 Kubelet 配置特性从 k8s 1.22 中已弃用，并在 1.24 中被移除。如果需要调整集群汇总所有节点 kubelet 的配置，还是推荐使用 ansible 等工具将配置分发到各个节点。kubelet 的配置文件必须是 json 或 yaml 格式，具体可查看这里。Kubernetes 1.8 开始要求关闭系统的 Swap，如果不关闭，默认配置下 kubelet 将无法启动。 关闭系统的 Swap 方法如下:</p><p>swapoff -a</p><p>修改 /etc/fstab 文件，注释掉 SWAP 的自动挂载，使用 free -m 确认 swap 已经关闭。swappiness 参数调整，修改 /etc/sysctl.d/99-kubernetes-cri.conf 添加下面一行：</p><p>vm.swappiness=0</p><p>执行 sysctl -p /etc/sysctl.d/99-kubernetes-cri.conf 使修改生效。</p><h2 id="_2-2、使用-kubeadm-init-初始化集群" tabindex="-1"><a class="header-anchor" href="#_2-2、使用-kubeadm-init-初始化集群"><span>2.2、使用 kubeadm init 初始化集群</span></a></h2><p>在各节点开机启动 kubelet 服务：</p><p>systemctl enable kubelet.service</p><p>使用 kubeadm config print init-defaults --component-configs KubeletConfiguration 可以打印集群初始化默认的使用的配置：</p><pre><code>apiVersion: kubeadm.k8s.io/v1beta3
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
  advertiseAddress: 1.2.3.4
  bindPort: 6443
nodeRegistration:
  criSocket: unix:///var/run/containerd/containerd.sock
  imagePullPolicy: IfNotPresent
  name: node
  taints: null
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta3
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns: {}
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: k8s.gcr.io
kind: ClusterConfiguration
kubernetesVersion: 1.24.0
networking:
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12
scheduler: {}
---
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging:
  flushFrequency: 0
  options:
    json:
      infoBufferSize: &quot;0&quot;
  verbosity: 0
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s
</code></pre><p>从默认的配置中可以看到，可以使用 imageRepository 定制在集群初始化时拉取 k8s 所需镜像的地址。基于默认配置定制出本次使用 kubeadm 初始化集群所需的配置文件 kubeadm.yaml：</p><pre><code>apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: 192.168.96.151
  bindPort: 6443
nodeRegistration:
  criSocket: unix:///run/containerd/containerd.sock
  taints:
  - effect: PreferNoSchedule
    key: node-role.kubernetes.io/master
---
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.24.0
imageRepository: registry.aliyuncs.com/google_containers
networking:
  podSubnet: 10.244.0.0/16
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
failSwapOn: false
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: ipvs
</code></pre><p>这里定制了 imageRepository 为阿里云的 registry，避免因 gcr 被墙，无法直接拉取镜像。criSocket 设置了容器运行时为 containerd。 同时设置 kubelet 的 cgroupDriver 为 systemd，设置 kube-proxy 代理模式为 ipvs。在开始初始化集群之前可以使用 kubeadm config images pull --config kubeadm.yaml 预先在各个服务器节点上拉取所 k8s 需要的容器镜像。</p><pre><code>kubeadm config images pull --config kubeadm.yaml
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-apiserver:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-controller-manager:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-scheduler:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/kube-proxy:v1.24.0
[config/images] Pulled registry.aliyuncs.com/google_containers/pause:3.7
[config/images] Pulled registry.aliyuncs.com/google_containers/etcd:3.5.3-0
[config/images] Pulled registry.aliyuncs.com/google_containers/coredns:v1.8.6
</code></pre><p>接下来使用 kubeadm 初始化集群，选择 node1 作为 Master Node，在 node1 上执行下面的命令：</p><pre><code>kubeadm init --config kubeadm.yaml
W0526 10:22:26.657615   24076 common.go:83] your configuration file uses a deprecated API spec: &quot;kubeadm.k8s.io/v1beta2&quot;. Please use &#39;kubeadm config migrate --old-config old.yaml --new-config new.yaml&#39;, which will write the new, similar spec using a newer API version.
W0526 10:22:26.660300   24076 initconfiguration.go:120] Usage of CRI endpoints without URL scheme is deprecated and can cause kubelet errors in the future. Automatically prepending scheme &quot;unix&quot; to the &quot;criSocket&quot; with value &quot;/run/containerd/containerd.sock&quot;. Please update your configuration!
[init] Using Kubernetes version: v1.24.0
[preflight] Running pre-flight checks
 [WARNING Swap]: swap is enabled; production deployments should disable swap unless testing the NodeSwap feature gate of the kubelet
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using &#39;kubeadm config images pull&#39;
[certs] Using certificateDir folder &quot;/etc/kubernetes/pki&quot;
[certs] Generating &quot;ca&quot; certificate and key
[certs] Generating &quot;apiserver&quot; certificate and key
[certs] apiserver serving cert is signed for DNS names [kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local node1] and IPs [10.96.0.1 192.168.96.151]
[certs] Generating &quot;apiserver-kubelet-client&quot; certificate and key
[certs] Generating &quot;front-proxy-ca&quot; certificate and key
[certs] Generating &quot;front-proxy-client&quot; certificate and key
[certs] Generating &quot;etcd/ca&quot; certificate and key
[certs] Generating &quot;etcd/server&quot; certificate and key
[certs] etcd/server serving cert is signed for DNS names [localhost node1] and IPs [192.168.96.151 127.0.0.1 ::1]
[certs] Generating &quot;etcd/peer&quot; certificate and key
[certs] etcd/peer serving cert is signed for DNS names [localhost node1] and IPs [192.168.96.151 127.0.0.1 ::1]
[certs] Generating &quot;etcd/healthcheck-client&quot; certificate and key
[certs] Generating &quot;apiserver-etcd-client&quot; certificate and key
[certs] Generating &quot;sa&quot; key and public key
[kubeconfig] Using kubeconfig folder &quot;/etc/kubernetes&quot;
[kubeconfig] Writing &quot;admin.conf&quot; kubeconfig file
[kubeconfig] Writing &quot;kubelet.conf&quot; kubeconfig file
[kubeconfig] Writing &quot;controller-manager.conf&quot; kubeconfig file
[kubeconfig] Writing &quot;scheduler.conf&quot; kubeconfig file
[kubelet-start] Writing kubelet environment file with flags to file &quot;/var/lib/kubelet/kubeadm-flags.env&quot;
[kubelet-start] Writing kubelet configuration to file &quot;/var/lib/kubelet/config.yaml&quot;
[kubelet-start] Starting the kubelet
[control-plane] Using manifest folder &quot;/etc/kubernetes/manifests&quot;
[control-plane] Creating static Pod manifest for &quot;kube-apiserver&quot;
[control-plane] Creating static Pod manifest for &quot;kube-controller-manager&quot;
[control-plane] Creating static Pod manifest for &quot;kube-scheduler&quot;
[etcd] Creating static Pod manifest for local etcd in &quot;/etc/kubernetes/manifests&quot;
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory &quot;/etc/kubernetes/manifests&quot;. This can take up to 4m0s
[apiclient] All control plane components are healthy after 17.506804 seconds
[upload-config] Storing the configuration used in ConfigMap &quot;kubeadm-config&quot; in the &quot;kube-system&quot; Namespace
[kubelet] Creating a ConfigMap &quot;kubelet-config&quot; in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node node1 as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node node1 as control-plane by adding the taints [node-role.kubernetes.io/master:PreferNoSchedule]
[bootstrap-token] Using token: uufqmm.bvtfj4drwfvvbcev
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the &quot;cluster-info&quot; ConfigMap in the &quot;kube-public&quot; namespace
[kubelet-finalize] Updating &quot;/etc/kubernetes/kubelet.conf&quot; to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy
 
Your Kubernetes control-plane has initialized successfully!
 
To start using your cluster, you need to run the following as a regular user:
 
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
 
Alternatively, if you are the root user, you can run:
 
  export KUBECONFIG=/etc/kubernetes/admin.conf
 
You should now deploy a pod network to the cluster.
Run &quot;kubectl apply -f [podnetwork].yaml&quot; with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/
 
Then you can join any number of worker nodes by running the following on each as root:
 
kubeadm join 192.168.96.151:6443 --token uufqmm.bvtfj4drwfvvbcev \\
 --discovery-token-ca-cert-hash sha256:5814415567d93f6d2d41fe4719be8221f45c29c482b5059aec2e27a832ac36e6
</code></pre><p>上面记录了完成的初始化输出的内容，根据输出的内容基本上可以看出手动初始化安装一个 Kubernetes 集群所需要的关键步骤。 其中有以下关键内容：</p><pre><code>    [certs]生成相关的各种证书
    [kubeconfig]生成相关的kubeconfig文件
    [kubelet-start] 生成kubelet的配置文件&quot;/var/lib/kubelet/config.yaml&quot;
    [control-plane]使用/etc/kubernetes/manifests目录中的yaml文件创建apiserver、controller-manager、scheduler的静态pod
    [bootstraptoken]生成token记录下来，后边使用kubeadm join往集群中添加节点时会用到
    下面的命令是配置常规用户如何使用kubectl访问集群：mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    最后给出了将节点加入集群的命令kubeadm join 192.168.96.151:6443 --token uufqmm.bvtfj4drwfvvbcev \\ --discovery-token-ca-cert-hash sha256:5814415567d93f6d2d41fe4719be8221f45c29c482b5059aec2e27a832ac36e6
</code></pre><p>查看一下集群状态，确认个组件都处于 healthy 状态，结果出现了错误:</p><pre><code>kubectl get cs
Warning: v1 ComponentStatus is deprecated in v1.19+
NAME                 STATUS    MESSAGE                         ERROR
scheduler            Healthy   ok
controller-manager   Healthy   ok
etcd-0               Healthy   {&quot;health&quot;:&quot;true&quot;,&quot;reason&quot;:&quot;&quot;}
</code></pre><p>集群初始化如果遇到问题，可以使用 kubeadm reset 命令进行清理。</p><h2 id="_2-3、安装包管理器-helm-3" tabindex="-1"><a class="header-anchor" href="#_2-3、安装包管理器-helm-3"><span>2.3、安装包管理器 helm 3</span></a></h2><p>Helm 是 Kubernetes 的包管理器，后续流程也将使用 Helm 安装 Kubernetes 的常用组件。 这里先在 master 节点 node1 上安装 helm。</p><pre><code>wget https://get.helm.sh/helm-v3.9.0-linux-amd64.tar.gz
tar -zxvf helm-v3.9.0-linux-amd64.tar.gz
mv linux-amd64/helm  /usr/local/bin/
</code></pre><p>执行 helm list 确认没有错误输出。</p><h2 id="_2-4、部署-pod-network-组件-calico" tabindex="-1"><a class="header-anchor" href="#_2-4、部署-pod-network-组件-calico"><span>2.4、部署 Pod Network 组件 Calico</span></a></h2><p>选择 calico 作为 k8s 的 Pod 网络组件，下面使用 helm 在 k8s 集群中安装 calico。下载 tigera-operator 的 helm chart:</p><p>wget https://github.com/projectcalico/calico/releases/download/v3.23.1/tigera-operator-v3.23.1.tgz</p><p>查看这个 chart 的中可定制的配置:</p><pre><code>helm show values tigera-operator-v3.23.1.tgz
 
imagePullSecrets: {}
 
installation:
  enabled: true
  kubernetesProvider: &quot;&quot;
 
apiServer:
  enabled: true
 
certs:
  node:
    key:
    cert:
    commonName:
  typha:
    key:
    cert:
    commonName:
    caBundle:
 
resources: {}
 
# Configuration for the tigera operator
tigeraOperator:
  image: tigera/operator
  version: v1.27.1
  registry: quay.io
calicoctl:
  image: docker.io/calico/ctl
  tag: v3.23.1
</code></pre><p>定制的 values.yaml 如下:</p><pre><code># 可针对上面的配置进行定制,例如 calico 的镜像改成从私有库拉取。
# 这里只是个人本地环境测试 k8s 新版本，因此保留 value.yaml 为空即可
</code></pre><p>使用 helm 安装 calico：</p><p>helm install calico tigera-operator-v3.23.1.tgz -n kube-system --create-namespace -f values.yaml</p><p>等待并确认所有 pod 处于 Running状态:</p><pre><code>kubectl get pod -n kube-system | grep tigera-operator
tigera-operator-5fb55776df-wxbph   1/1     Running   0             5m10s
 
kubectl get pods -n calico-system
NAME                                       READY   STATUS    RESTARTS   AGE
calico-kube-controllers-68884f975d-5d7p9   1/1     Running   0          5m24s
calico-node-twbdh                          1/1     Running   0          5m24s
calico-typha-7b4bdd99c5-ssdn2              1/1     Running   0          5m24s
</code></pre><p>查看一下 calico 向 k8s 中添加的 api 资源:</p><pre><code>kubectl api-resources | grep calico
bgpconfigurations                                                                 crd.projectcalico.org/v1               false        BGPConfiguration
bgppeers                                                                          crd.projectcalico.org/v1               false        BGPPeer
blockaffinities                                                                   crd.projectcalico.org/v1               false        BlockAffinity
caliconodestatuses                                                                crd.projectcalico.org/v1               false        CalicoNodeStatus
clusterinformations                                                               crd.projectcalico.org/v1               false        ClusterInformation
felixconfigurations                                                               crd.projectcalico.org/v1               false        FelixConfiguration
globalnetworkpolicies                                                             crd.projectcalico.org/v1               false        GlobalNetworkPolicy
globalnetworksets                                                                 crd.projectcalico.org/v1               false        GlobalNetworkSet
hostendpoints                                                                     crd.projectcalico.org/v1               false        HostEndpoint
ipamblocks                                                                        crd.projectcalico.org/v1               false        IPAMBlock
ipamconfigs                                                                       crd.projectcalico.org/v1               false        IPAMConfig
ipamhandles                                                                       crd.projectcalico.org/v1               false        IPAMHandle
ippools                                                                           crd.projectcalico.org/v1               false        IPPool
ipreservations                                                                    crd.projectcalico.org/v1               false        IPReservation
kubecontrollersconfigurations                                                     crd.projectcalico.org/v1               false        KubeControllersConfiguration
networkpolicies                                                                   crd.projectcalico.org/v1               true         NetworkPolicy
networksets                                                                       crd.projectcalico.org/v1               true         NetworkSet
bgpconfigurations                 bgpconfig,bgpconfigs                            projectcalico.org/v3                   false        BGPConfiguration
bgppeers                                                                          projectcalico.org/v3                   false        BGPPeer
caliconodestatuses                caliconodestatus                                projectcalico.org/v3                   false        CalicoNodeStatus
clusterinformations               clusterinfo                                     projectcalico.org/v3                   false        ClusterInformation
felixconfigurations               felixconfig,felixconfigs                        projectcalico.org/v3                   false        FelixConfiguration
globalnetworkpolicies             gnp,cgnp,calicoglobalnetworkpolicies            projectcalico.org/v3                   false        GlobalNetworkPolicy
globalnetworksets                                                                 projectcalico.org/v3                   false        GlobalNetworkSet
hostendpoints                     hep,heps                                        projectcalico.org/v3                   false        HostEndpoint
ippools                                                                           projectcalico.org/v3                   false        IPPool
ipreservations                                                                    projectcalico.org/v3                   false        IPReservation
kubecontrollersconfigurations                                                     projectcalico.org/v3                   false        KubeControllersConfiguration
networkpolicies                   cnp,caliconetworkpolicy,caliconetworkpolicies   projectcalico.org/v3                   true         NetworkPolicy
networksets                       netsets                                         projectcalico.org/v3                   true         NetworkSet
profiles                                                                          projectcalico.org/v3                   false        Profile
</code></pre><p>这些 api 资源是属于 calico 的，因此不建议使用 kubectl 来管理，推荐按照 calicoctl 来管理这些 api 资源。 将 calicoctl 安装为 kubectl 的插件:</p><pre><code>cd /usr/local/bin
curl -o kubectl-calico -O -L  &quot;https://github.com/projectcalico/calicoctl/releases/download/v3.21.5/calicoctl-linux-amd64&quot; 
chmod +x kubectl-calico
</code></pre><p>验证插件正常工作:</p><p>kubectl calico -h</p><h2 id="_2-5、验证-k8s-dns-是否可用" tabindex="-1"><a class="header-anchor" href="#_2-5、验证-k8s-dns-是否可用"><span>2.5、验证 k8s DNS 是否可用</span></a></h2><pre><code>kubectl run curl --image=radial/busyboxplus:curl -it
If you don&#39;t see a command prompt, try pressing enter.
[ root@curl:/ ]$
</code></pre><p>进入后执行 nslookup kubernetes.default 确认解析正常:</p><pre><code>nslookup kubernetes.default
Server:    10.96.0.10
Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local
 
Name:      kubernetes.default
Address 1: 10.96.0.1 kubernetes.default.svc.cluster.local
</code></pre><h2 id="_2-6、向-kubernetes-集群中添加-node-节点" tabindex="-1"><a class="header-anchor" href="#_2-6、向-kubernetes-集群中添加-node-节点"><span>2.6、向 Kubernetes 集群中添加 Node 节点</span></a></h2><p>下面将 node2, node3 添加到 Kubernetes 集群中，分别在 node2, node3 上执行:</p><pre><code>kubeadm join 192.168.96.151:6443 --token uufqmm.bvtfj4drwfvvbcev \\
 --discovery-token-ca-cert-hash sha256:5814415567d93f6d2d41fe4719be8221f45c29c482b5059aec2e27a832ac36e6
</code></pre><p>node2 和 node3 加入集群很是顺利，在 master 节点上执行命令查看集群中的节点：</p><pre><code>kubectl get node
NAME    STATUS   ROLES                  AGE     VERSION
node1   Ready    control-plane,master   29m     v1.24.0
node2   Ready    &lt;none&gt;                 70s     v1.24.0
node3   Ready    &lt;none&gt;                 58s     v1.24.0
</code></pre><h1 id="三、kubernetes-常用组件部署" tabindex="-1"><a class="header-anchor" href="#三、kubernetes-常用组件部署"><span>三、Kubernetes 常用组件部署</span></a></h1><h2 id="_3-1、使用-helm-部署-ingress-nginx" tabindex="-1"><a class="header-anchor" href="#_3-1、使用-helm-部署-ingress-nginx"><span>3.1、使用 Helm 部署 ingress-nginx</span></a></h2><p>为了便于将集群中的服务暴露到集群外部，需要使用 Ingress。接下来使用 Helm 将 ingress-nginx 部署到 Kubernetes上。 Nginx Ingress Controller 被部署在 Kubernetes 的边缘节点上。</p><p>这里将 node1(192.168.96.151) 作为边缘节点，打上 Label：</p><p>kubectl label node node1 node-role.kubernetes.io/edge=</p><p>下载 ingress-nginx 的 helm chart:</p><p>wget https://github.com/kubernetes/ingress-nginx/releases/download/helm-chart-4.1.2/ingress-nginx-4.1.2.tgz</p><p>查看 ingress-nginx-4.1.2.tgz 这个 chart 的可定制配置:</p><p>helm show values ingress-nginx-4.1.2.tgz</p><p>对 values.yaml 配置定制如下:</p><pre><code>controller:
  ingressClassResource:
    name: nginx
    enabled: true
    default: true
    controllerValue: &quot;k8s.io/ingress-nginx&quot;
  admissionWebhooks:
    enabled: false
  replicaCount: 1
  image:
    # registry: k8s.gcr.io
    # image: ingress-nginx/controller
    # tag: &quot;v1.1.0&quot;
    registry: docker.io
    image: unreachableg/k8s.gcr.io_ingress-nginx_controller
    tag: &quot;v1.2.0&quot;
    digest: sha256:314435f9465a7b2973e3aa4f2edad7465cc7bcdc8304be5d146d70e4da136e51
  hostNetwork: true
  nodeSelector:
    node-role.kubernetes.io/edge: &#39;&#39;
  affinity:
    podAntiAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchExpressions:
            - key: app
              operator: In
              values:
              - nginx-ingress
            - key: component
              operator: In
              values:
              - controller
          topologyKey: kubernetes.io/hostname
  tolerations:
      - key: node-role.kubernetes.io/master
        operator: Exists
        effect: NoSchedule
      - key: node-role.kubernetes.io/master
        operator: Exists
        effect: PreferNoSchedule
</code></pre><p>nginx ingress controller 的副本数 replicaCount 为 1，将被调度到 node1 这个边缘节点上。这里并没有指定 nginx ingress controller service 的 externalIPs，而是通过 hostNetwork: true 设置 nginx ingress controller 使用宿主机网络。 因为 k8s.gcr.io 被墙，这里替换成 unreachableg/k8s.gcr.io_ingress-nginx_controller 提前拉取一下镜像:</p><p>crictl pull unreachableg/k8s.gcr.io_ingress-nginx_controller:v1.2.0</p><p>helm install ingress-nginx ingress-nginx-4.1.2.tgz --create-namespace -n ingress-nginx -f values.yaml</p><pre><code>kubectl get pod -n ingress-nginx
NAME                                        READY   STATUS    RESTARTS   AGE
ingress-nginx-controller-7f574989bc-xwbf4   1/1     Running   0          117s
</code></pre><p>测试访问 http://192.168.96.151 返回默认的 nginx 404 页，则部署完成。</p><h2 id="_3-2、使用-helm-部署-dashboard" tabindex="-1"><a class="header-anchor" href="#_3-2、使用-helm-部署-dashboard"><span>3.2、使用 Helm 部署 dashboard</span></a></h2><p>先部署 metrics-server：</p><p>wget https://github.com/kubernetes-sigs/metrics-server/releases/download/metrics-server-helm-chart-3.8.2/components.yaml</p><p>修改 components.yaml 中的 image 为 docker.io/unreachableg/k8s.gcr.io_metrics-server_metrics-server:v0.5.2。 修改 components.yaml 中容器的启动参数，加入 --kubelet-insecure-tls。</p><p>kubectl apply -f components.yaml</p><p>metrics-server 的 pod 正常启动后，等一段时间就可以使用 kubectl top 查看集群和 pod 的 metrics 信息:</p><pre><code>kubectl top node
NAME    CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
node1   509m         12%    3654Mi          47%
node2   133m         3%     1786Mi          23%
node3   117m         2%     1810Mi          23%
 
kubectl top pod -n kube-system
NAME                               CPU(cores)   MEMORY(bytes)
coredns-74586cf9b6-575nl           6m           16Mi
coredns-74586cf9b6-mbn8s           5m           17Mi
etcd-node1                         49m          91Mi
kube-apiserver-node1               142m         490Mi
kube-controller-manager-node1      38m          54Mi
kube-proxy-k5lzs                   26m          19Mi
kube-proxy-rb5pf                   9m           15Mi
kube-proxy-w5zpk                   27m          16Mi
kube-scheduler-node1               7m           18Mi
metrics-server-8dfd488f5-r8pbh     8m           21Mi
tigera-operator-5fb55776df-wxbph   10m          38Mi
</code></pre><p>接下来使用 helm 部署 k8s 的 dashboard，添加 chart repo:</p><pre><code>helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
helm repo update
</code></pre><p>查看 chart 的可定制配置:</p><p>helm show values kubernetes-dashboard/kubernetes-dashboard</p><p>对 values.yaml 定制配置如下:</p><pre><code>image:
  repository: kubernetesui/dashboard
  tag: v2.5.1
ingress:
  enabled: true
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: &quot;true&quot;
    nginx.ingress.kubernetes.io/backend-protocol: &quot;HTTPS&quot;
  hosts:
  - k8s.example.com
  tls:
    - secretName: example-com-tls-secret
      hosts:
      - k8s.example.com
metricsScraper:
  enabled: true
</code></pre><p>先创建存放 k8s.example.comssl 证书的 secret:</p><pre><code>kubectl create secret tls example-com-tls-secret \\
  --cert=cert.pem \\
  --key=key.pem \\
  -n kube-system
</code></pre><p>使用 helm 部署 dashboard:</p><pre><code>helm install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard \\
-n kube-system \\
-f values.yaml
</code></pre><p>确认上面的命令部署成功。创建管理员 sa:</p><pre><code>kubectl create serviceaccount kube-dashboard-admin-sa -n kube-system
 
kubectl create clusterrolebinding kube-dashboard-admin-sa \\
--clusterrole=cluster-admin --serviceaccount=kube-system:kube-dashboard-admin-sa
</code></pre><p>创建集群管理员登录 dashboard 所需 token:</p><pre><code>kubectl create token kube-dashboard-admin-sa -n kube-system --duration=87600h
 
eyJhbGciOiJSUzI1NiIsImtpZCI6IlU1SlpSTS1YekNuVzE0T1k5TUdTOFFqN25URWxKckt6OUJBT0xzblBsTncifQ.eyJhdWQiOlsiaHR0cHM6Ly9rdWJlcm5ldGVzLmRlZmF1bHQuc3ZjLmNsdXN0ZXIubG9jYWwiXSwiZXhwIjoxOTY4OTA4MjgyLCJpYXQiOjE2NTM1NDgyODIsImlzcyI6Imh0dHBzOi8va3ViZXJuZXRlcy5kZWZhdWx0LnN2Yy5jbHVzdGVyLmxvY2FsIiwia3ViZXJuZXRlcy5pbyI6eyJuYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsInNlcnZpY2VhY2NvdW50Ijp7Im5hbWUiOiJrdWJlLWRhc2hib2FyZC1hZG1pbi1zYSIsInVpZCI6IjY0MmMwMmExLWY1YzktNDFjNy04Mjc5LWQ1ZmI3MGRjYTQ3ZSJ9fSwibmJmIjoxNjUzNTQ4MjgyLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06a3ViZS1kYXNoYm9hcmQtYWRtaW4tc2EifQ.Xqxlo2vJ9Hb6UUVIqwvc8I5bahdxKzSRSaQI_67Yt7_YEHmkkHApxUGlwJYTKF9ufww3btlCmM8PtRn5_Q1yv-HAFyTOYKo8WHZ9UCm1bT3X8V8g4GQwZIl2dwmlUmKb1unBz2-em2uThQ015bMPDE8a42DV_bOwWjljVXat0nwV14nGorC8vKLjXbohrIJ3G1pgCJvlBn99F1RelmSUSQLlolUFoxpN6MamYTElwR6FfD-AGmFXvZSbcFaqVW0oxJHV70Gjs2igOtpqHFxxPlHT8aQzlRiybPtFyBf9Ll87TmVJimT89z8wv2si2Nee8bB2jhsApLn8TJyUSlbTXA
</code></pre><p>使用上面的 token 登录 k8s dashboard。</p><p><img src="`+a+`" alt="img"></p><p>参考</p><pre><code>    Installing kubeadm
    Creating a cluster with kubeadm
    https://github.com/containerd/containerd
    https://pkg.go.dev/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2
    https://docs.projectcalico.org/
</code></pre>`,140)]))}const u=n(s,[["render",i]]),d=JSON.parse('{"path":"/note-book/Kubernetes/kubeadm%E9%83%A8%E7%BD%B2Kubernetes-1.24%E8%BF%87%E7%A8%8B.html","title":"kubeadm部署Kubernetes-1.24过程","lang":"zh-CN","frontmatter":{"description":"kubeadm部署Kubernetes-1.24过程 前言 kubeadm 是 Kubernetes 官方提供的用于快速安部署 Kubernetes 集群的工具，伴随 Kubernetes 每个版本的发布都会同步更新，kubeadm 会对集群配置方面的一些实践做调整，通过实验 kubeadm 可以学习到 Kubernetes 官方在集群配置上一些新的最...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"kubeadm部署Kubernetes-1.24过程\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-07T07:39:57.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Kubernetes/kubeadm%E9%83%A8%E7%BD%B2Kubernetes-1.24%E8%BF%87%E7%A8%8B.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"kubeadm部署Kubernetes-1.24过程"}],["meta",{"property":"og:description","content":"kubeadm部署Kubernetes-1.24过程 前言 kubeadm 是 Kubernetes 官方提供的用于快速安部署 Kubernetes 集群的工具，伴随 Kubernetes 每个版本的发布都会同步更新，kubeadm 会对集群配置方面的一些实践做调整，通过实验 kubeadm 可以学习到 Kubernetes 官方在集群配置上一些新的最..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-07T07:39:57.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-07T07:39:57.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1709797197000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":2,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"376633e4dbe87adb48a2f46b21e02c267aba34e3","time":1709797197000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"kubeadm部署Kubernetes-1.24过程"},{"hash":"ce21b1f4c7499c2cd93940a628674b72b00133eb","time":1693278768000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"kubeadm部署Kubernetes 1.24步骤"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":13.78,"words":4134},"filePathRelative":"note-book/Kubernetes/kubeadm部署Kubernetes-1.24过程.md","excerpt":"\\n<h1>前言</h1>\\n<p>kubeadm 是 Kubernetes 官方提供的用于快速安部署 Kubernetes 集群的工具，伴随 Kubernetes 每个版本的发布都会同步更新，kubeadm 会对集群配置方面的一些实践做调整，通过实验 kubeadm 可以学习到 Kubernetes 官方在集群配置上一些新的最佳实践。</p>\\n<h1>一、准备</h1>\\n<h2>1.1、系统配置</h2>\\n<p>在安装之前，需要先做好如下准备。3 台 CentOS 7.9 主机如下：</p>\\n<pre><code>cat /etc/hosts\\n192.168.96.151    node1\\n192.168.96.152    node2\\n192.168.96.153    node3\\n</code></pre>","autoDesc":true}');export{u as comp,d as data};
