# NameSpace 资源隔离

- 只有实现如下隔离才能说应用程序是完全隔离的

| 内容  | 备注                       | 内核版本 |
| ----- | -------------------------- | -------- |
| PID   | 进程编号                   | 2.6.24   |
| NET   | 网络设备、网络协议栈、端口 | 2.6.29   |
| IPC   | 信号量、消息队列、共享内存 | 2.6.19   |
| MOUNT | 文件系统                   | 2.4.19   |
| UTS   | 用户名和主机域             | 2.6.19   |
| USER  | 操作系统的用户和用户组     | 3.8.x    |


容器技术发展 
```mermaid
graph TD
A[1979年  chroot技术] --> B(2000年 FreeBSD Jails)
B --> C[2004 Solaris Containers]
C -->D(2005 OpenVZ)
D -->E[2008 LXC Linux Container]
E -->F[2013 Docker]
F --> G[2014 Rocket]
G --> H[2016 Windows Containers]
H --> I[2017 Kubernetes]
```