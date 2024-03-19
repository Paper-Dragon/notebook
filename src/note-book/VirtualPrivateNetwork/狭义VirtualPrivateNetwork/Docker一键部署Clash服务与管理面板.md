# Docker一键部署Clash服务与管理面板

> 转载自： https://blog.laoyutang.cn/linux/clash.html

官方Clash部署需要采用两个镜像分别启动服务和面板，博主使用官方server镜像和官方管理面板前端代码，重新修改打包构建，使用一个镜像可以直接启动服务和管理面板，简单轻量。

## 镜像地址

[laoyutang/clash-and-dashboard](https://hub.docker.com/r/laoyutang/clash-and-dashboard)

## 修改后源码地址

[Github:clash-and-dashboard](https://github.com/LaoYutang/clash-and-dashboard)
谨慎的同学可以查看源码，自行打包

## 修改内容

- 修改前端接口baseurl，不再通过用户配置，使用页面相对路径`/api`。
- 去除clash服务接口配置框。
- docker镜像增加nginx和前端打包文件。
- nginx反代clash管理接口，实现管理页面无需配置直接管理容器内clash服务。

## 启动容器



```
docker run -d \
  --name clash \
  --restart=always \
  --log-opt max-size=1m \
  -v /data/clash/clash.yaml:/root/.config/clash/config.yaml \
  -p 7888:8080 -p 7890:7890 \
  laoyutang/clash-and-dashboard:latest
```

- -v /data/clash/clash.yaml:/root/.config/clash/config.yaml 提供clash的yaml文件，文件如何获取请读者自行解决
- -p 7888:8080 管理**页面端口**
- -p 7890:7890 http**代理端口** socks端口使用7891
- laoyutang/clash-and-dashboard:latest 博主修改后的镜像

访问Ip:7888管理页面即可，注意非本机使用，请勾选**允许局域网连接**![管理版面预览](Docker一键部署Clash服务与管理面板.assets/156b7412eefd0609.jpg)

## 自动更新yaml文件

建议直接使用crontab启动定时任务每日更新，脚本可参考如下：

sh

```
#!/bin/bash
curl -o /data/clash/clash.yaml https://cloudupup05.com/auth/register?code=g9Rq
docker restart clash
```

更换存储位置和链接地址即可。