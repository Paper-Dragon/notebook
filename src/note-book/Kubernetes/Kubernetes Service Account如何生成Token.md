# Kubernetes Service Account如何生成Token

果然两天不看就跟不上了，我的集群版本是 1.25.3，今天需要用 token 来做些事情，创建 serviceAccount 的时候发现没有生成 secret，查了一下发现从 1.24 开始就不会自动生成 secret 了，[chanagelog 在这里.](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#urgent-upgrade-notes)

内容如下 LegacyServiceAccountTokenNoAutoGeneration 功能门是测试版，默认启用。启用后，不再为每个 ServiceAccount 自动生成包含服务帐户令牌的 Secret API 对象。使用 [TokenRequest API](https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) 获取服务帐户令牌，或者如果需要未过期的令牌，请按照[本指南](https://kubernetes.io/docs/concepts/configuration/secret/#service-account-token-secrets)为令牌控制器创建一个 Secret API 对象以填充服务帐户令牌

pr: https://github.com/kubernetes/kubernetes/pull/108309

在上面提到的两种方式要怎么用呢

## 方式 1 

使用 `TokenRequest API` 来生成 token，获取方式如下

- 使用 client-go 或者其他 api 调用工具来获取某个 serviceaccount 的 token
-  创建 yaml，使用 kubectl apply -f
-  使用 `kubectl create token -n xxx <serviceaccount-name>` 来获取一个临时的 token, 默认 1 小时

## 方式 2 

创建 secret token，创建后从 secret 的 token 字段拿就可以了

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-sa-sample
  annotations:
    kubernetes.io/service-account.name: "sa-name"   # 这里填写serviceAccountName
type: kubernetes.io/service-account-token
```

