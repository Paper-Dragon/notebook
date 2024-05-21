# kubernetes会话保持（session）配置

在 Kubernetes 中，您可以通过在 Service 的 YAML 配置中添加 `sessionAffinity: ClientIP` 来实现会话保持（Session Affinity）。这种方式会将来自同一客户端 IP 地址的请求始终转发到相同的后端 Pod，从而维持会话。以下是对这个配置的详细解释：

通过在 Service 的 `spec` 中添加以下配置，可以启用会话保持：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
```
