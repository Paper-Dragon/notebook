# docker log配置不生效



## 在/etc/docker/daemon.json中修改或添加log-opts参数

```bash
"log-driver":"json-file",
  "log-opts":{ "max-size" :"50m","max-file":"1"}
```

网上很多帖子都说了怎么做，但是发现少提了一句。

## **那就是已经创建了的容器，该选项的修改【重启daemon】是无法生效的。**

**我们来看官方文档：**

[**https://docs.docker.com/config/containers/logging/configure/**](https://docs.docker.com/config/containers/logging/configure/)





## 检测方法

```bash
docker inspect -f '{{.HostConfig.LogConfig}}' 容器名xxx

```



