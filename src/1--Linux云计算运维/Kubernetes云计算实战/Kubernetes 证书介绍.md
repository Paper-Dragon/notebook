## 一、证书机制说明

Kubernetes 作为一个分布式集群的管理工具，保证集群的安全性是其一个重要的任务。API Server 是集群内部各个组件通信的中介，也是外部控制的入口。所以 Kubernetes 的安全机制基本就是围绕保护 API Server 来设计的，Kubernetes 使用了认证（Authentication）、鉴权（Authorization）、准入控制（AdmissionControl）三步来保证API Server的安全 。

## 二、证书认证（Authentication）

**HTTP Token 认证：**

通过一个 Token 来识别合法用户，HTTP Token 的认证是用一个很长的特殊编码方式的并且难以被模仿的字符串 - Token 来表达客户的一种方式。Token 是一个很长的很复杂的字符串，每一个 Token 对应一个用户名存储在 API Server 能访问的文件中，当客户端发起 API 调用请求时，需要在 HTTP Header 里放入 Token。

**HTTP Base 认证：**

通过用户名+密码的方式进行认证，用户名+密码用 BASE64 算法进行编码后的字符串放在 HTTP Request 中的 Heather Authorization 域里发送给服务端，服务端收到后进行编码，获取用户名及密码。

**HTTPS 证书认证：**

HTTPS 证书认证是最严格的认证，基于 CA 根证书签名的客户端身份认证方式。

## 三、证书授权与鉴权（Authorization）

AlwaysDeny：表示拒绝所有的请求，一般用于测试

AlwaysAllow：允许接收所有请求，如果集群不需要授权流程，则可以采用该策略

Webbook：**通过调用外部 REST 服务对用户进行授权

RBAC（Role-Based Access Control）：基于角色的访问控制，现行默认规则

ABAC（Attribute-Based Access Control）： 基于属性的访问控制，表示使用用户配置的授权规则对用户请求进行匹配和控制

## 四、证书准入控制

准入控制是API Server的插件集合，通过添加不同的插件，实现额外的准入控制规则。甚至于API Server的一些主要的功能都需要通过 Admission Controllers 实现，这里我们列举几个插件的功能：

NamespaceLifecycle：防止在不存在的 namespace 上创建对象，防止删除系统预置 namespace，删除namespace 时，连带删除它的所有资源对象

LimitRanger：确保请求的资源不会超过资源所在 Namespace 的 LimitRange 的限制。

ResourceQuota：确保请求的资源不会超过资源的 ResourceQuota 限制。

ServiceAccount：为Pod中的进程和外部用户提供身份信息。