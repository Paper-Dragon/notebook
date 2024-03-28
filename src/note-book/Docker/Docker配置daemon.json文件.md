# Docker配置daemon.json文件

## All

```json
{
  #用一组新的注册表替换守护程序将向其推送不可分发工件的注册表集
  "allow-nondistributable-artifacts": [],
  "api-cors-header": "",
  #指定要使用的授权插件
  "authorization-plugins": [],
  "bip": "",
  #标志设置docker0为默认桥接网络
  "bridge": "",
  "cgroup-parent": "",
  "cluster-advertise": "",
  #使用新地址重新加载发现存储。
  "cluster-store": "",
  #使用新选项重新加载发现存储。
  "cluster-store-opts": {},
  "containerd": "/run/containerd/containerd.sock",
  "containerd-namespace": "docker",
  "containerd-plugin-namespace": "docker-plugins",
  "data-root": "",
  #当设置为 true 时，它将守护程序更改为调试模式
  "debug": true,
  "default-address-pools": [
    {
      "base": "172.30.0.0/16",
      "size": 24
    },
    {
      "base": "172.31.0.0/16",
      "size": 24
    }
  ],
  "default-cgroupns-mode": "private",
  "default-gateway": "",
  "default-gateway-v6": "",
  "default-runtime": "runc",
  "default-shm-size": "64M",
  "default-ulimits": {
    "nofile": {
      "Hard": 64000,
      "Name": "nofile",
      "Soft": 64000
    }
  },
  #设定容器DNS的地址，在容器的 /etc/resolv.conf文件中可查看
  "dns": [],
  "dns-opts": [],
  #设定容器的搜索域
  "dns-search": [],
  "exec-opts": [],
  "exec-root": "",
  "experimental": false,
  #明确启用或禁用特定功能
  "features": {},
  "fixed-cidr": "",
  "fixed-cidr-v6": "",
  "group": "",
  "hosts": [],
  "icc": false,
  "init": false,
  "init-path": "/usr/libexec/docker-init",
  "insecure-registries": [],
  "ip": "0.0.0.0",
  "ip-forward": false,
  "ip-masq": false,
  #阻止 Docker 守护进程添加 iptables 规则
  "iptables": false,
  "ip6tables": false,
  "ipv6": false,
  #docker主机的标签，很实用的功能,例如定义：–label nodeName=host-121
  "labels": [],
  #启用在守护进程停机期间保持容器活动
  "live-restore": true,
  #Default driver for container logs (default "json-file")
  "log-driver": "json-file",
  "log-level": "",
  #日志配置
  "log-opts": {
    "cache-disabled": "false",
    "cache-max-file": "5",
    "cache-max-size": "20m",
    "cache-compress": "true",
    "env": "os,customer",
    "labels": "somelabel",
    "max-file": "5",
    "max-size": "10m"
  },
  #每次拉取的最大并发下载量
  "max-concurrent-downloads": 3,
  #每次推送的最大并发上传量
  "max-concurrent-uploads": 5,
  #每次拉取的最大下载尝试次数
  "max-download-attempts": 5,
  "mtu": 0,
  "no-new-privileges": false,
  "node-generic-resources": [
    "NVIDIA-GPU=UUID1",
    "NVIDIA-GPU=UUID2"
  ],
  "oom-score-adjust": -500,
  "pidfile": "",
  # 增加代理配置
  "proxies": {
    "http-proxy": "http://proxy.example.com:80",
    "https-proxy": "https://proxy.example.com:443",
    "no-proxy": "*.test.example.com,.example.org"
  },
  "raw-logs": false,
  #镜像源管理
  "registry-mirrors": [],
  #可用于运行容器的可用OCI运行时列表
  "runtimes": {
    "cc-runtime": {
      "path": "/usr/bin/cc-runtime"
    },
    "custom": {
      "path": "/usr/local/bin/my-runc-replacement",
      "runtimeArgs": [
        "--debug"
      ]
    }
  },
  "seccomp-profile": "",
  #默认 false，启用selinux支持
  "selinux-enabled": false,
  "shutdown-timeout": 15,
  "storage-driver": "",
  "storage-opts": [],
  "swarm-default-advertise-addr": "",
  #启动TLS认证开关
  "tls": true,
  "tlscacert": "",
  "tlscert": "",
  "tlskey": "",
  "tlsverify": true,
  "userland-proxy": false,
  "userland-proxy-path": "/usr/libexec/docker-proxy",
  "userns-remap": ""
}

```



## Simple1

```json
{
  "graph": "/data/docker", // 存储路径
  "storage-driver": "overlay2", // 存储驱动
  "storage-opts": [
    "overlay2.override_kernel_check=true" // overlay2 检查
  ],
  "insecure-registries": [
    "harbr.docker.com",
    "registry.access.redhat.com",
    "quay.io",
    "http://f1361db2.m.daocloud.io"
  ],
  "registry-mirrors": [
    "http://hub-mirror.c.163.com"
  ],
  "bip": "172.7.5.1/24", // bridge 的 ip
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ], //定义cgroup驱动
  "live-restore": true // docker容器不依赖与docker引擎  ，引擎死容器不死
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "data-root": "/data/docker" // docker数据存储在哪里
}
systemctl daemon-reload
systemctl restart docker
systemctl enable docker

```

## Simple2

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "exec-opts": [
    "native.cgroupdriver=systemd"
  ],
  "max-concurrent-downloads": 10, //下载并发
  "max-concurrent-uploads": 5,  //上传并发
  "log-opts": {
    "max-size": "300m",
    "max-file": "2"
  },
  "live-restore": true
}
```

## 镜像加速的解释

docker中国区官方镜像加速：

- https://registry.docker-cn.com

网易镜像加速：

- http://hub-mirror.c.163.com


腾讯云镜像加速： 

- https://mirror.ccs.tencentyun.com

阿里云镜像加速：

- https://ung2thfc.mirror.aliyuncs.com



创建或修改/etc/docker/daemon.json文件
默认没有daemon文件，先创建。

```shell
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "http://hub-mirror.c.163.com",
    "https://registry.docker-cn.com",
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}
EOF
```

