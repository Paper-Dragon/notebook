# Radeon镜像站

最近在使用Ubuntu安装Amd显卡驱动的时候访问国外镜像站网速特别慢，于是乎我自己做了个镜像站，用于加速驱动的下载。

## 镜像内容

镜像站内容

```bash
radeon.geekery.cn	<--> https://repo.radeon.com
```

一键设置脚本

```bash
curl -sSL https://www.geekery.cn/sh/radeo/set_radeon_mirror.sh | bash
```

​	

## 安装教程

### 安装工具

使用如下命令下载安装器并设置镜像源，这时设置的镜像源是国外的镜像源。

```bash
wget https://repo.radeon.com/amdgpu-install/23.40.2/ubuntu/jammy/amdgpu-install_6.0.60002-1_all.deb
apt install ./amdgpu-install_6.0.60002-1_all.deb
```

### 切换镜像站

打开 /etc/apt/source.list.d/

```bash
root@b550m:/etc/apt/sources.list.d# cat rocm.list
deb [arch=amd64] https://repo.radeon.com/rocm/apt/6.0.2 jammy main
root@b550m:/etc/apt/sources.list.d# cat amdgpu.list
deb https://repo.radeon.com/amdgpu/6.0.2/ubuntu jammy main
#deb-src https://repo.radeon.com/amdgpu/6.0.2/ubuntu jammy main

```

编辑里面的域名并替换为镜像的域名

rocm.list

```bash
deb [arch=amd64] https://radeon.geekery.cn/rocm/apt/6.0.2 jammy main
```

amdgpu.list

```bash
deb https://radeon.geekery.cn/amdgpu/6.0.2/ubuntu jammy main
#deb-src https://repo.radeon.com/amdgpu/6.0.2/ubuntu jammy main
```

### 执行安装

```bash
amdgpu-install
```



