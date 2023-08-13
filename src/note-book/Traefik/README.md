# Traefik

## 概览

Traefik 是一种开源*边缘路由器*，它使您发布服务成为一种有趣而轻松的体验。它代表您的系统接收请求并找出哪些组件负责处理它们。

支持以下路由转发

- 4层（数据链路层）

- 7层（应用层）

具有

- 拦截和路由每个传入请求，通过规则：  <https://doc.traefik.io/traefik/routing/routers/#rule>
- 自动服务发现，通过provider，基础组件被删除，规则也会被删除
- 中间件实现功能： 调整请求，比如授权等等的。
- 丰富的插件

## 兼容性

### Provider

<https://doc.traefik.io/traefik/providers/overview/#supported-providers>

- Kubernetes
- Docker
- Docker Swarm
- AWS
- Mesos
- Marathon

## 特性

- 动态加载配置
- 动态加载模块
- 无连接中断
