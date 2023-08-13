# 一次构建出x86及arm镜像

## CPU指令集介绍及不同的指令集的使用场景

![image-20230220093413271](一次构建出x86及arm镜像.assets/image-20230220093413271.png)

![image-20230220093440387](一次构建出x86及arm镜像.assets/image-20230220093440387.png)



![image-20230220093458512](一次构建出x86及arm镜像.assets/image-20230220093458512.png)



![image-20230220093511276](一次构建出x86及arm镜像.assets/image-20230220093511276.png)







## 镜像构建基础环境及不同CPU指令集实现环境准备

### 安装Docker

```bash
curl -sSL get.docker.com | bash
```

### 安装CPU指令集模拟平台

```bash
qemu-user-static: 是一个可以在当前操作系统来运行其他架构的一个仿真器，可以通过x86的机器编译出其他不同架构的docker镜像
binfmt-support: 解析不同系统的二进制文件给内核运行，再将执行结果给用户进程
```

![image-20230220094027454](一次构建出x86及arm镜像.assets/image-20230220094027454.png)

![image-20230220094041191](一次构建出x86及arm镜像.assets/image-20230220094041191.png)

![image-20230220094052077](一次构建出x86及arm镜像.assets/image-20230220094052077.png)









## 同时构建x86_64及ARM平台容器镜像

![image-20230220094104848](一次构建出x86及arm镜像.assets/image-20230220094104848.png)





