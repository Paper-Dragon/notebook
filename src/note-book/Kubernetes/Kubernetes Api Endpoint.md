# API规范

## 总体检查



### /livez?verbose 存活检查

```bash
curl https://127.0.0.1:6443/livez?verbose -k

#--cacert /etc/kubernetes/pki/ca.pem 
#--cert /etc/kubernetes/pki/apiserver.pem 
#--key /etc/kubernetes/pki/apiserver-key.pem

# 不加verbose只会打印OK
```

显示如下结果

```bash
[+]ping ok
[+]log ok
[+]etcd ok
[+]poststarthook/start-kube-apiserver-admission-initializer ok
[+]poststarthook/generic-apiserver-start-informers ok
[+]poststarthook/priority-and-fairness-config-consumer ok
[+]poststarthook/priority-and-fairness-filter ok
[+]poststarthook/storage-object-count-tracker-hook ok
[+]poststarthook/start-apiextensions-informers ok
[+]poststarthook/start-apiextensions-controllers ok
[+]poststarthook/crd-informer-synced ok
[+]poststarthook/bootstrap-controller ok
[+]poststarthook/rbac/bootstrap-roles ok
[+]poststarthook/scheduling/bootstrap-system-priority-classes ok
[+]poststarthook/priority-and-fairness-config-producer ok
[+]poststarthook/start-cluster-authentication-info-controller ok
[+]poststarthook/aggregator-reload-proxy-client-cert ok
[+]poststarthook/start-kube-aggregator-informers ok
[+]poststarthook/apiservice-registration-controller ok
[+]poststarthook/apiservice-status-available-controller ok
[+]poststarthook/kube-apiserver-autoregistration ok
[+]autoregister-completion ok
[+]poststarthook/apiservice-openapi-controller ok
[+]poststarthook/apiservice-openapiv3-controller ok
livez check passed


```

### /healthz?verbose  健康检查

```bash
curl https://127.0.0.1:6443/healthz?verbose -k

# 不加verbose只会打印OK

```

显示如下结果

```bash

[+]ping ok
[+]log ok
[+]etcd ok
[+]poststarthook/start-kube-apiserver-admission-initializer ok
[+]poststarthook/generic-apiserver-start-informers ok
[+]poststarthook/priority-and-fairness-config-consumer ok
[+]poststarthook/priority-and-fairness-filter ok
[+]poststarthook/storage-object-count-tracker-hook ok
[+]poststarthook/start-apiextensions-informers ok
[+]poststarthook/start-apiextensions-controllers ok
[+]poststarthook/crd-informer-synced ok
[+]poststarthook/bootstrap-controller ok
[+]poststarthook/rbac/bootstrap-roles ok
[+]poststarthook/scheduling/bootstrap-system-priority-classes ok
[+]poststarthook/priority-and-fairness-config-producer ok
[+]poststarthook/start-cluster-authentication-info-controller ok
[+]poststarthook/aggregator-reload-proxy-client-cert ok
[+]poststarthook/start-kube-aggregator-informers ok
[+]poststarthook/apiservice-registration-controller ok
[+]poststarthook/apiservice-status-available-controller ok
[+]poststarthook/kube-apiserver-autoregistration ok
[+]autoregister-completion ok
[+]poststarthook/apiservice-openapi-controller ok
[+]poststarthook/apiservice-openapiv3-controller ok
healthz check passed

```

### /readyz?verbose 存活检查

```bash
curl https://127.0.0.1:6443/readyz?verbose -k

# 不加verbose只会打印OK
```

显示如下结果

```bash
[root@k8s-master01 bootstrap]# curl --cacert /etc/kubernetes/pki/ca.pem --cert /etc/kubernetes/pki/apiserver.pem --key /etc/kubernetes/pki/apiserver-key.pem
[+]ping ok
[+]log ok
[+]etcd ok
[+]etcd-readiness ok
[+]informer-sync ok
[+]poststarthook/start-kube-apiserver-admission-initializer ok
[+]poststarthook/generic-apiserver-start-informers ok
[+]poststarthook/priority-and-fairness-config-consumer ok
[+]poststarthook/priority-and-fairness-filter ok
[+]poststarthook/storage-object-count-tracker-hook ok
[+]poststarthook/start-apiextensions-informers ok
[+]poststarthook/start-apiextensions-controllers ok
[+]poststarthook/crd-informer-synced ok
[+]poststarthook/bootstrap-controller ok
[+]poststarthook/rbac/bootstrap-roles ok
[+]poststarthook/scheduling/bootstrap-system-priority-classes ok
[+]poststarthook/priority-and-fairness-config-producer ok
[+]poststarthook/start-cluster-authentication-info-controller ok
[+]poststarthook/aggregator-reload-proxy-client-cert ok
[+]poststarthook/start-kube-aggregator-informers ok
[+]poststarthook/apiservice-registration-controller ok
[+]poststarthook/apiservice-status-available-controller ok
[+]poststarthook/kube-apiserver-autoregistration ok
[+]autoregister-completion ok
[+]poststarthook/apiservice-openapi-controller ok
[+]poststarthook/apiservice-openapiv3-controller ok
[+]shutdown ok
readyz check passed

```

## kube-controller-manager

### 健康检查 10257

```bash
curl -k https://11.0.1.201:10257/healthz 
curl -k https://11.0.1.201:10257/healthz?verbose
-k 允许不验证ssl证书
```



```json
[+]leaderElection ok
[+]podgc ok
[+]horizontalpodautoscaling ok
[+]csrcleaner ok
[+]clusterrole-aggregation ok
[+]ephemeral-volume ok
[+]endpointslicemirroring ok
[+]garbagecollector ok
[+]daemonset ok
[+]csrapproving ok
[+]attachdetach ok
[+]serviceaccount ok
[+]resourcequota ok
[+]disruption ok
[+]cronjob ok
[+]ttl ok
[+]persistentvolume-binder ok
[+]endpoint ok
[+]pv-protection ok
[+]nodeipam ok
[+]ttl-after-finished ok
[+]tokencleaner ok
[+]csrsigning ok
[+]endpointslice ok
[+]deployment ok
[+]bootstrapsigner ok
[+]nodelifecycle ok
[+]persistentvolume-expander ok
[+]replicationcontroller ok
[+]job ok
[+]replicaset ok
[+]statefulset ok
[+]pvc-protection ok
[+]root-ca-cert-publisher ok
[+]namespace ok
healthz check passed
```

## kube-scheduler

### 健康检查 10259

```bash
curl -k https://11.0.1.201:10259/healthz?verbose
```

结果

```bash
[+]leaderElection ok
healthz check passed
```



## kubelet

### 健康检查 10248

```bash
curl 127.0.0.1:10248/healthz?verbose

```

```bash
 curl 127.0.0.1:10248/healthz?verbose
[+]ping ok
healthz check passed

```

### 只读端口 10255

```bash
curl http://11.0.1.201:10255/healthz?verbose
```

```bash
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed
```



### 加密端口 10250

```bash
curl -k https://11.0.1.201:10250/healthz?verbose --cacert /etc/kubernetes/pki/ca.pem  --cert /etc/kubernetes/pki/apiserver.pem --key /etc/kubernetes/pki/apiserver-key.pem
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed

```

## kube-proxy

### **metrics** 10249

```bash
curl 127.0.0.1:10249/healthz?verbose
[+]ping ok
healthz check passed

```

### 健康检查 10256

```bash
curl http://11.0.1.201:10256/healthz?verbose

{"lastUpdated": "2022-12-11 15:57:27.988339654 +0800 CST m=+12402.346822757","currentTime": "2022-12-11 15:57:27.988339654 +0800 CST m=+12402.346822757"}
```

