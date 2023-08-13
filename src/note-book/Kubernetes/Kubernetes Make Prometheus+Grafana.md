# Kubernetes Make Prometheus+Grafana
### Kubernetes Create Prometheus+Grafana

#### 一、背景

Prometheus作为一个采用tidb时序数据库为数据存储的监控软件，因为嵌合当前主流容器化，所以一直处于广泛使用的状态，常用监控面板grafana，可以接收多种dataresource，结合数据源支持的语法可以对数据进行分析，实时展示监控值。

#### 二、准备工作

##### 1、主机分布
<th colspan="1" rowspan="1">192.168.52.135(master)</th><th colspan="1" rowspan="1">nfs-server</th>

nfs-server
<td colspan="1" rowspan="1">192.168.52.136(node01)</td><td colspan="1" rowspan="1">nfs-client</td>

nfs-client
<td colspan="1" rowspan="1">192.168.52.137(node02)</td><td colspan="1" rowspan="1">nfs-client</td>

nfs-client

```
[root@master ~]# kubectl get node  --show-labels
NAME     STATUS   ROLES                  AGE     VERSION   LABELS
master   Ready    control-plane,master   5h32m   v1.21.3   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=master,kubernetes.io/os=linux,node-exporter=true,node-role.kubernetes.io/control-plane=,node-role.kubernetes.io/master=,node.kubernetes.io/exclude-from-external-load-balancers=
node01   Ready    node                   3h7m    v1.21.3   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node01,kubernetes.io/os=linux,node-exporter=true,node-role.kubernetes.io/node=node01
node02   Ready    node                   3h6m    v1.21.3   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node02,kubernetes.io/os=linux,node-exporter=true,node-role.kubernetes.io/node=node02
```

kubeadm装机，roles不会显示node，操作如下即可。

```
[root@master ~]# kubectl label node node01 node-role.kubernetes.io/node=node01
[root@master ~]# kubectl label node node02 node-role.kubernetes.io/node=node02
```

```
[root@master ~]# kubectl get pods -A
NAMESPACE      NAME                             READY   STATUS    RESTARTS   AGE
kube-flannel   kube-flannel-ds-94z57            1/1     Running   1          3h5m
kube-flannel   kube-flannel-ds-v986m            1/1     Running   1          3h5m
kube-flannel   kube-flannel-ds-ztdz5            1/1     Running   1          3h5m
kube-system    coredns-59d64cd4d4-bhm59         1/1     Running   1          5h35m
kube-system    coredns-59d64cd4d4-wpk7n         1/1     Running   1          5h35m
kube-system    etcd-master                      1/1     Running   2          5h35m
kube-system    kube-apiserver-master            1/1     Running   2          5h35m
kube-system    kube-controller-manager-master   1/1     Running   1          174m
kube-system    kube-proxy-2rpld                 1/1     Running   1          3h10m
kube-system    kube-proxy-8fpbj                 1/1     Running   2          5h35m
kube-system    kube-proxy-gvwm5                 1/1     Running   1          3h10m
kube-system    kube-scheduler-master            1/1     Running   1          175m
```

2、master检查

```
#查询master是否正常 
kubectl get cs 
#若为unhealthy 
vim /etc/kubernetes/manifests/kube-scheduler.yaml 
vim /etc/kubernetes/manifests/kube-controller-manager.yaml
 #将- --port=0注释掉
```

##### 3、时间校准

因为Prometheus对时间一致要求很高，为保证浏览器和服务器时间一致，需要如下操作。所有节点都需要操作。

```
[root@master ~]# yum -y install ntp ntpdate
[root@master ~]# ntpdate ntp1.aliyun.com
```

#### 三、nfs本地存储

##### 1、部署NFS

192.168.52.135为nfs-server，其他俩个node为client，所有节点都需要安装，若node节点未安装，node会因无client挂载nfs失败。

```
[root@master ~]# yum -y install nfs-utils
[root@master ~]# systemctl enable nfs
[root@master ~]# systemctl start nfs
```

##### 2、创建共享目录

```
[root@master ~]# mkdir -p /data/nfs/{prometheus,grafana,grafana-plugin}
[root@master ~]# chown -R 65534.65534 /data/nfs/prometheus           #这里非常重要，否则prometheus无法启动，即便是设置了777权限也会报错
[root@master ~]# chmod 777 /data/nfs/{prometheus,grafana,grafana-plugin}    #这里需要打开所有用户可读写
[root@master nfs]# ll
总用量 0
drwxrwxrwx 4 root      root      28 4月  12 16:44 grafana
drwxrwxrwx 4 root      root      50 4月  12 17:37 grafana-plugin
drwxrwxrwx 4 nfsnobody nfsnobody 70 4月  12 15:33 prometheus
[root@master nfs]# pwd
/data/nfs
```

##### 3、设置nfs共享

```
[root@master ~]# echo "/data/nfs *(rw,no_root_squash,async,insecure)"&gt;&gt;/etc/exports
[root@master ~]# systemctl restart nfs
[root@master ~]# exportfs
/data/nfs       &lt;world&gt;
[root@master ~]# showmount -e 127.0.0.1
Export list for 127.0.0.1:
/data/nfs *
```

四、部署node-exporter

```
[root@master ~]# cat node-exporter.yaml
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: kube-system
  labels:
    k8s-app: node-exporter
spec:
  selector:
    matchLabels:
      k8s-app: node-exporter
  template:
    metadata:
      labels:
        k8s-app: node-exporter
    spec:
      hostNetwork: true
      hostPID: true
      hostIPC: true
      tolerations:
      - key: "disk"
        operator: "Equal"
        value: "ssd"
        effect: "NoSchedule"
      - key: "node-role.kubernetes.io/master"
        operator: "Equal"
        value: "true"
        effect: "PreferNoSchedule"
      - key: "esnode"
        operator: "Equal"
        value: "es"
        effect: "NoSchedule"
      containers:
      - image: prom/node-exporter
        name: node-exporter
        resources:
          requests:
            cpu: 128m
        securityContext:
          privileged: true
        args:
        - --path.procfs
        - /host/proc
        - --path.sysfs
        - /host/sys
        - --collector.filesystem.ignored-mount-points
        - '"^/(sys|proc|dev|host|etc)($|/)"'
        volumeMounts:
        - name: dev
          mountPath: /host/dev
        - name: proc
          mountPath: /host/proc
        - name: sys
          mountPath: /host/sys
        - name: rootfs
          mountPath: /host/rootfs
        ports:
        - containerPort: 9100
          protocol: TCP
          name: http
      volumes:
        - name: proc
          hostPath:
            path: /proc
        - name: dev
          hostPath:
            path: /dev
        - name: sys
          hostPath:
            path: /sys
        - name: rootfs
          hostPath:
            path: /
[root@master ~]# kubectl apply -f node-exporter.yaml
[root@master ~]# kubectl get pods -A | grep node
kube-system    node-exporter-4ltj5              1/1     Running   0          111m
kube-system    node-exporter-tbv66              1/1     Running   0          111m
```

上述生成了俩个pod，master节点没有数据上报，这时

- key: "node-role.kubernetes.io/master"         operator: "Equal"         value: "true"         effect: "PreferNoSchedule" 这个就起作用了，master做了taints限制。

```
[root@master ~]# kubectl describe node master | grep Taints
Taints:             node-role.kubernetes.io/master:NoSchedule
[root@master ~]# kubectl taint node master node-role.kubernetes.io/master:NoSchedule-
node/master untainted
[root@master ~]# kubectl taint node master node-role.kubernetes.io/master:NoSchedule
node/master tainted
[root@master ~]# kubectl get pods -A | grep node
kube-system    node-exporter-4ltj5              1/1     Running   0          115m
kube-system    node-exporter-7522q              1/1     Running   0          113m
kube-system    node-exporter-tbv66              1/1     Running   0          115m
```

#### 五、部署Prometheus

##### 1、configmap资源

生成configmap，便于挂载prometheus.yml内容

```
[root@master ~]# cat prometheus-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: kube-system
data:
  prometheus.yml: |
    global:
      scrape_interval:     15s
      evaluation_interval: 15s
    scrape_configs:

    - job_name: prometheus
      honor_timestamps: true
      scrape_interval: 15s
      scrape_timeout: 15s
      scheme: http
      metrics_path: /metrics
      static_configs:
      - targets:
        - localhost:9090

    - job_name: 'kubernetes-apiservers'
      kubernetes_sd_configs:
      - role: endpoints
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https
    - job_name: 'kubernetes-nodes'
      kubernetes_sd_configs:
      - role: node
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)
      - target_label: __address__
        replacement: kubernetes.default.svc:443
      - source_labels: [__meta_kubernetes_node_name]
        regex: (.+)
        target_label: __metrics_path__
        replacement: /api/v1/nodes/${1}/proxy/metrics

    - job_name: 'kubernetes-cadvisor'
      kubernetes_sd_configs:
      - role: node
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)
      - target_label: __address__
        replacement: kubernetes.default.svc:443
      - source_labels: [__meta_kubernetes_node_name]
        regex: (.+)
        target_label: __metrics_path__
        replacement: /api/v1/nodes/${1}/proxy/metrics/cadvisor

    - job_name: 'kubernetes-service-endpoints'
      kubernetes_sd_configs:
      - role: endpoints
      relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
        action: replace
        target_label: __scheme__
        regex: (https?)
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_service_name]
        action: replace
        target_label: kubernetes_name

    - job_name: 'kubernetes-services'
      kubernetes_sd_configs:
      - role: service
      metrics_path: /probe
      params:
        module: [http_2xx]
      relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_probe]
        action: keep
        regex: true
      - source_labels: [__address__]
        target_label: __param_target
      - target_label: __address__
        replacement: blackbox-exporter.example.com:9115
      - source_labels: [__param_target]
        target_label: instance
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_service_name]
        target_label: kubernetes_name

    - job_name: 'kubernetes-ingresses'
      kubernetes_sd_configs:
      - role: ingress
      relabel_configs:
      - source_labels: [__meta_kubernetes_ingress_annotation_prometheus_io_probe]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_ingress_scheme,__address__,__meta_kubernetes_ingress_path]
        regex: (.+);(.+);(.+)
        replacement: ${1}://${2}${3}
        target_label: __param_target
      - target_label: __address__
        replacement: blackbox-exporter.example.com:9115
      - source_labels: [__param_target]
        target_label: instance
      - action: labelmap
        regex: __meta_kubernetes_ingress_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_ingress_name]
        target_label: kubernetes_name

    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name
    - job_name: 'k8s-node'
      kubernetes_sd_configs:
      - role: node
      relabel_configs:
      - source_labels: [__address__]
        regex: '(.*):10250'
        replacement: '${1}:9100'
        target_label: __address__
        action: replace
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)
```

##### 2、rbac资源

生成一个Prometheus的用户，分发好角色。

```
[root@master ~]# cat prometheus-rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
- apiGroups: [""]
  resources:
  - nodes
  - nodes/proxy
  - services
  - endpoints
  - pods
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources:
  - configmaps
  verbs: ["get"]
- apiGroups:
  - extensions
  resources:
  - ingresses
  verbs: ["get", "list", "watch"]
- nonResourceURLs: ["/metrics"]
  verbs: ["get"]
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
- kind: ServiceAccount
  name: prometheus
  namespace: kube-system
```

##### 3、pvc资源

有状态服务，利用nfs目录，生成pv、pvc。

```
[root@master ~]# cat prometheus-pvc.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: kube-system

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv-prometheus
  labels:
    pv: nfs-pv-prometheus
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /data/nfs/prometheus
    server: 192.168.52.135

---

kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: nfs-pvc-prometheus
  namespace: kube-system
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  selector:
    matchLabels:
      pv: nfs-pv-prometheus
```

##### 4、deployment资源

```
[root@master ~]# cat prometheus-deploy.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    name: prometheus-deployment
  name: prometheus
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - image: prom/prometheus:v2.27.1
        name: prometheus
        command:
        - "/bin/prometheus"
        args:
        - "--config.file=/etc/prometheus/prometheus.yml"
        - "--storage.tsdb.path=/prometheus"
        - "--storage.tsdb.retention=24h"
        - "--web.enable-admin-api"
        - "--web.enable-lifecycle"
        ports:
        - containerPort: 9090
          protocol: TCP
        volumeMounts:
        - mountPath: "/prometheus"
          name: data
        - mountPath: "/etc/prometheus"
          name: config-volume
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
          limits:
            cpu: 500m
            memory: 1024Mi
      serviceAccountName: prometheus
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: nfs-pvc-prometheus
      - name: config-volume
        configMap:
          name: prometheus-config
```

##### 5、service资源

nodeport type提供外部入口

```
[root@master ~]# cat prometheus-svc.yaml
---
kind: Service
apiVersion: v1
metadata:
  labels:
    app: prometheus
  name: prometheus
  namespace: kube-system
spec:
  type: NodePort
  ports:
  - port: 9090
    targetPort: 9090
    nodePort: 30003
  selector:
    app: prometheus
```

```
[root@master ~]# kubectl apply -f prometheus-configmap.yaml
[root@master ~]# kubectl apply -f prometheus-rbac.yaml
[root@master ~]# kubectl apply -f prometheus-pvc.yaml
[root@master ~]# kubectl apply -f prometheus-deploy.yaml
[root@master ~]# kubectl apply -f prometheus-svc.yaml
[root@master ~]# kubectl get pod,pv,pvc,svc,cm,serviceaccount -A | grep prometheus
kube-system    pod/prometheus-854c547b7d-dc5gs      1/1     Running   0          153m
            persistentvolume/nfs-pv-prometheus       10Gi       RWX            Retain           Bound    kube-system/nfs-pvc-prometheus                               153m
kube-system   persistentvolumeclaim/nfs-pvc-prometheus       Bound    nfs-pv-prometheus       10Gi       RWX                           153m
kube-system   service/prometheus   NodePort    10.98.163.37   &lt;none&gt;        9090:30003/TCP           178m
kube-system       configmap/prometheus-config                    1      179m
kube-system       serviceaccount/prometheus                           1         179m
```

<img loading="lazy" src="https://www.chenjiao.cloud/upload/prometheus.png" alt="prometheus.png" width="100%" height="100%" style="display: inline-block">

#### 六、部署grafana

##### 1、grafana-configmap资源

 整合了datasource,dashboard， http://prometheus:9090(http://prometheus-service-name:port)

```
[root@master ~]# cat grafana-cm.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: kube-system
data:
  data_source.yaml: |
    {
        "apiVersion": 1,
        "datasources": [
            {
                "access": "proxy",
                "editable": false,
                "name": "Prometheus",
                "orgId": 1,
                "type": "prometheus",
                "url": "http://prometheus:9090",
                "version": 1
            }
        ]
    }

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  namespace: kube-system
data:
  dashboards.yaml: |-
    {
        "apiVersion": 1,
        "providers": [
            {
                "folder": "Default",
                "name": "0",
                "options": {
                    "path": "/grafana-dashboard-definitions/0"
                },
                "orgId": 1,
                "type": "file"
            }
        ]
    }

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-k8s-pod-resource
  namespace: kube-system
data:
  Kubernetes-Pod-Resources.json: |
    {
      "annotations": {
        "list": [
          {
            "builtIn": 1,
            "datasource": "-- Grafana --",
            "enable": true,
            "hide": true,
            "iconColor": "rgba(0, 211, 255, 1)",
            "name": "Annotations &amp; Alerts",
            "type": "dashboard"
          }
        ]
      },
      "description": "Shows resource usage of Kubernetes pods.",
      "editable": true,
      "gnetId": 737,
      "graphTooltip": 0,
      "id": 1,
      "iteration": 1624950781810,
      "links": [],
      "panels": [
        {
          "collapsed": false,
          "datasource": null,
          "gridPos": {
            "h": 1,
            "w": 24,
            "x": 0,
            "y": 0
          },
          "id": 35,
          "panels": [],
          "title": "节点资源统计",
          "type": "row"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "max": 100,
              "min": 0,
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "rgba(50, 172, 45, 0.97)",
                    "value": null
                  },
                  {
                    "color": "rgba(237, 129, 40, 0.89)",
                    "value": 65
                  },
                  {
                    "color": "rgba(245, 54, 54, 0.9)",
                    "value": 90
                  }
                ]
              },
              "unit": "percent"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 5,
            "w": 8,
            "x": 0,
            "y": 1
          },
          "id": 4,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "showThresholdLabels": false,
            "showThresholdMarkers": true,
            "text": {}
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum (container_memory_working_set_bytes{id=\"/\",instance=~\"^$instance$\"}) / sum (machine_memory_bytes{instance=~\"^$instance$\"}) * 100",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "",
              "refId": "A",
              "step": 2
            }
          ],
          "timeFrom": "1m",
          "timeShift": null,
          "title": "内存使用量",
          "type": "gauge"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "max": 100,
              "min": 0,
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "rgba(50, 172, 45, 0.97)",
                    "value": null
                  },
                  {
                    "color": "rgba(237, 129, 40, 0.89)",
                    "value": 65
                  },
                  {
                    "color": "rgba(245, 54, 54, 0.9)",
                    "value": 90
                  }
                ]
              },
              "unit": "percent"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 5,
            "w": 8,
            "x": 8,
            "y": 1
          },
          "id": 6,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "showThresholdLabels": false,
            "showThresholdMarkers": true,
            "text": {}
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum(rate(container_cpu_usage_seconds_total{id=\"/\",instance=~\"^$instance$\"}[1m])) / sum (machine_cpu_cores{instance=~\"^$instance$\"}) * 100",
              "interval": "10s",
              "intervalFactor": 1,
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "timeShift": null,
          "title": "Cpu 使用量",
          "type": "gauge"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "max": 100,
              "min": 0,
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "rgba(50, 172, 45, 0.97)",
                    "value": null
                  },
                  {
                    "color": "rgba(237, 129, 40, 0.89)",
                    "value": 65
                  },
                  {
                    "color": "rgba(245, 54, 54, 0.9)",
                    "value": 90
                  }
                ]
              },
              "unit": "percent"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 5,
            "w": 8,
            "x": 16,
            "y": 1
          },
          "id": 7,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "showThresholdLabels": false,
            "showThresholdMarkers": true,
            "text": {}
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum(container_fs_usage_bytes{id=\"/\",instance=~\"^$instance$\"}) / sum(container_fs_limit_bytes{id=\"/\",instance=~\"^$instance$\"}) * 100",
              "interval": "10s",
              "intervalFactor": 1,
              "legendFormat": "",
              "metric": "",
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "timeShift": null,
          "title": "磁盘使用量",
          "type": "gauge"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "green",
                    "value": null
                  },
                  {
                    "color": "red",
                    "value": 80
                  }
                ]
              },
              "unit": "bytes"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 0,
            "y": 6
          },
          "hideTimeOverride": true,
          "id": 9,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "none",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "text": {},
            "textMode": "auto"
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum(container_memory_working_set_bytes{id=\"/\",instance=~\"^$instance$\"})",
              "interval": "10s",
              "intervalFactor": 1,
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "title": "Used",
          "type": "stat"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "green",
                    "value": null
                  },
                  {
                    "color": "red",
                    "value": 80
                  }
                ]
              },
              "unit": "bytes"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 4,
            "y": 6
          },
          "hideTimeOverride": true,
          "id": 10,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "none",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "text": {},
            "textMode": "auto"
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum (machine_memory_bytes{instance=~\"^$instance$\"})",
              "interval": "10s",
              "intervalFactor": 1,
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "title": "Total",
          "type": "stat"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "green",
                    "value": null
                  },
                  {
                    "color": "red",
                    "value": 80
                  }
                ]
              },
              "unit": "none"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 8,
            "y": 6
          },
          "hideTimeOverride": true,
          "id": 11,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "none",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "text": {},
            "textMode": "auto"
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum (rate (container_cpu_usage_seconds_total{id=\"/\",instance=~\"^$instance$\"}[1m]))",
              "interval": "10s",
              "intervalFactor": 1,
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "timeShift": null,
          "title": "Used",
          "type": "stat"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "green",
                    "value": null
                  },
                  {
                    "color": "red",
                    "value": 80
                  }
                ]
              },
              "unit": "none"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 12,
            "y": 6
          },
          "hideTimeOverride": true,
          "id": 12,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "none",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "text": {},
            "textMode": "auto"
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum (machine_cpu_cores{instance=~\"^$instance$\"})",
              "interval": "10s",
              "intervalFactor": 1,
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "title": "Total",
          "type": "stat"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "green",
                    "value": null
                  },
                  {
                    "color": "red",
                    "value": 80
                  }
                ]
              },
              "unit": "bytes"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 16,
            "y": 6
          },
          "hideTimeOverride": true,
          "id": 13,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "none",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "text": {},
            "textMode": "auto"
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum(container_fs_usage_bytes{id=\"/\",instance=~\"^$instance$\"})",
              "interval": "10s",
              "intervalFactor": 1,
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "title": "Used",
          "type": "stat"
        },
        {
          "cacheTimeout": null,
          "datasource": "Prometheus",
          "fieldConfig": {
            "defaults": {
              "color": {
                "mode": "thresholds"
              },
              "decimals": 2,
              "mappings": [
                {
                  "options": {
                    "match": "null",
                    "result": {
                      "text": "N/A"
                    }
                  },
                  "type": "special"
                }
              ],
              "thresholds": {
                "mode": "absolute",
                "steps": [
                  {
                    "color": "green",
                    "value": null
                  },
                  {
                    "color": "red",
                    "value": 80
                  }
                ]
              },
              "unit": "bytes"
            },
            "overrides": []
          },
          "gridPos": {
            "h": 3,
            "w": 4,
            "x": 20,
            "y": 6
          },
          "hideTimeOverride": true,
          "id": 14,
          "interval": null,
          "links": [],
          "maxDataPoints": 100,
          "options": {
            "colorMode": "none",
            "graphMode": "none",
            "justifyMode": "auto",
            "orientation": "horizontal",
            "reduceOptions": {
              "calcs": [
                "lastNotNull"
              ],
              "fields": "",
              "values": false
            },
            "text": {},
            "textMode": "auto"
          },
          "pluginVersion": "8.0.3",
          "targets": [
            {
              "expr": "sum (container_fs_limit_bytes{id=\"/\",instance=~\"^$instance$\"})",
              "interval": "10s",
              "intervalFactor": 1,
              "refId": "A",
              "step": 10
            }
          ],
          "timeFrom": "1m",
          "title": "Total",
          "type": "stat"
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "Prometheus",
          "decimals": 2,
          "editable": true,
          "error": false,
          "fill": 1,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 5,
            "w": 24,
            "x": 0,
            "y": 9
          },
          "height": "200px",
          "hiddenSeries": false,
          "id": 32,
          "isNew": true,
          "legend": {
            "alignAsTable": true,
            "avg": true,
            "current": true,
            "max": false,
            "min": false,
            "rightSide": true,
            "show": true,
            "sideWidth": 200,
            "sort": "current",
            "sortDesc": true,
            "total": false,
            "values": true
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "8.0.3",
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "expr": "sum(rate(container_network_receive_bytes_total{instance=~\"^$instance$\",namespace=~\"^$namespace$\"}[1m]))",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "receive",
              "metric": "network",
              "refId": "A",
              "step": 240
            },
            {
              "expr": "- sum(rate(container_network_transmit_bytes_total{instance=~\"^$instance$\",namespace=~\"^$namespace$\"}[1m]))",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "transmit",
              "metric": "network",
              "refId": "B",
              "step": 240
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeRegions": [],
          "timeShift": null,
          "title": "网络",
          "tooltip": {
            "msResolution": false,
            "shared": true,
            "sort": 0,
            "value_type": "cumulative"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "Bps",
              "label": "transmit / receive",
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "Bps",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": false
            }
          ],
          "yaxis": {
            "align": false,
            "alignLevel": null
          }
        },
        {
          "collapsed": false,
          "datasource": null,
          "gridPos": {
            "h": 1,
            "w": 24,
            "x": 0,
            "y": 14
          },
          "id": 36,
          "panels": [],
          "title": "Pod 资源统计",
          "type": "row"
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "Prometheus",
          "decimals": 3,
          "editable": true,
          "error": false,
          "fill": 0,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 7,
            "w": 24,
            "x": 0,
            "y": 15
          },
          "height": "",
          "hiddenSeries": false,
          "id": 17,
          "isNew": true,
          "legend": {
            "alignAsTable": true,
            "avg": true,
            "current": true,
            "hideEmpty": true,
            "hideZero": true,
            "max": false,
            "min": false,
            "rightSide": true,
            "show": true,
            "sideWidth": null,
            "sort": "current",
            "sortDesc": true,
            "total": false,
            "values": true
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "8.0.3",
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "exemplar": true,
              "expr": "sum(rate(container_cpu_usage_seconds_total{image!=\"\",instance=~\"^$instance$\",namespace=~\"^$namespace$\"}[1m])) by (pod)",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "{{ pod }}",
              "metric": "container_cpu",
              "refId": "A",
              "step": 240
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeRegions": [],
          "timeShift": null,
          "title": "Cpu 使用量",
          "tooltip": {
            "msResolution": true,
            "shared": false,
            "sort": 2,
            "value_type": "cumulative"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "none",
              "label": "cores",
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": false
            }
          ],
          "yaxis": {
            "align": false,
            "alignLevel": null
          }
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "Prometheus",
          "decimals": 2,
          "editable": true,
          "error": false,
          "fill": 0,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 7,
            "w": 24,
            "x": 0,
            "y": 22
          },
          "hiddenSeries": false,
          "id": 33,
          "isNew": true,
          "legend": {
            "alignAsTable": true,
            "avg": true,
            "current": true,
            "hideEmpty": true,
            "hideZero": true,
            "max": false,
            "min": false,
            "rightSide": true,
            "show": true,
            "sideWidth": null,
            "sort": "current",
            "sortDesc": true,
            "total": false,
            "values": true
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "null",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "8.0.3",
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "exemplar": true,
              "expr": "sum (container_memory_working_set_bytes{image!=\"\",instance=~\"^$instance$\",namespace=~\"^$namespace$\"}) by (pod)",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "{{ pod }}",
              "metric": "",
              "refId": "A",
              "step": 240
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeRegions": [],
          "timeShift": null,
          "title": "内存使用量",
          "tooltip": {
            "msResolution": false,
            "shared": false,
            "sort": 2,
            "value_type": "cumulative"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "bytes",
              "label": "used",
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": false
            }
          ],
          "yaxis": {
            "align": false,
            "alignLevel": null
          }
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "Prometheus",
          "decimals": 2,
          "editable": true,
          "error": false,
          "fill": 1,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 7,
            "w": 24,
            "x": 0,
            "y": 29
          },
          "hiddenSeries": false,
          "id": 16,
          "isNew": true,
          "legend": {
            "alignAsTable": true,
            "avg": true,
            "current": true,
            "hideEmpty": true,
            "hideZero": true,
            "max": false,
            "min": false,
            "rightSide": true,
            "show": true,
            "sideWidth": 200,
            "sort": "avg",
            "sortDesc": true,
            "total": false,
            "values": true
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "null",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "8.0.3",
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "exemplar": true,
              "expr": "sum (rate (container_network_receive_bytes_total{image!=\"\",instance=~\"^$instance$\",namespace=~\"^$namespace$\"}[1m])) by (pod_name)",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "{{ pod }} &lt; in",
              "metric": "network",
              "refId": "A",
              "step": 240
            },
            {
              "exemplar": true,
              "expr": "- sum (rate (container_network_transmit_bytes_total{image!=\"\",instance=~\"^$instance$\",namespace=~\"^$namespace$\"}[1m])) by (pod_name)",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "{{ pod }} &gt; out",
              "metric": "network",
              "refId": "B",
              "step": 240
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeRegions": [],
          "timeShift": null,
          "title": "网络",
          "tooltip": {
            "msResolution": false,
            "shared": false,
            "sort": 2,
            "value_type": "cumulative"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "Bps",
              "label": "transmit / receive",
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": false
            }
          ],
          "yaxis": {
            "align": false,
            "alignLevel": null
          }
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "Prometheus",
          "decimals": 2,
          "editable": true,
          "error": false,
          "fill": 1,
          "fillGradient": 0,
          "grid": {},
          "gridPos": {
            "h": 7,
            "w": 24,
            "x": 0,
            "y": 36
          },
          "hiddenSeries": false,
          "id": 34,
          "isNew": true,
          "legend": {
            "alignAsTable": true,
            "avg": true,
            "current": true,
            "hideEmpty": true,
            "hideZero": true,
            "max": false,
            "min": false,
            "rightSide": true,
            "show": true,
            "sideWidth": 200,
            "sort": "current",
            "sortDesc": true,
            "total": false,
            "values": true
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "null",
          "options": {
            "alertThreshold": true
          },
          "percentage": false,
          "pluginVersion": "8.0.3",
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "exemplar": true,
              "expr": "sum(container_fs_usage_bytes{image!=\"\",instance=~\"^$instance$\",namespace=~\"^$namespace$\"}) by (pod)",
              "interval": "",
              "intervalFactor": 2,
              "legendFormat": "{{ pod }}",
              "metric": "network",
              "refId": "A",
              "step": 240
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeRegions": [],
          "timeShift": null,
          "title": "磁盘使用量",
          "tooltip": {
            "msResolution": false,
            "shared": false,
            "sort": 2,
            "value_type": "cumulative"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "bytes",
              "label": "used",
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": false
            }
          ],
          "yaxis": {
            "align": false,
            "alignLevel": null
          }
        }
      ],
      "refresh": false,
      "schemaVersion": 30,
      "style": "dark",
      "tags": [
        "kubernetes"
      ],
      "templating": {
        "list": [
          {
            "allValue": ".*",
            "current": {
              "selected": false,
              "text": "All",
              "value": "$__all"
            },
            "datasource": "Prometheus",
            "definition": "",
            "description": null,
            "error": null,
            "hide": 0,
            "includeAll": true,
            "label": "Instance",
            "multi": false,
            "name": "instance",
            "options": [],
            "query": {
              "query": "label_values(instance)",
              "refId": "Prometheus-instance-Variable-Query"
            },
            "refresh": 1,
            "regex": "master|node.*",
            "skipUrlSync": false,
            "sort": 0,
            "tagValuesQuery": "",
            "tagsQuery": "",
            "type": "query",
            "useTags": false
          },
          {
            "allValue": null,
            "current": {
              "selected": false,
              "text": "All",
              "value": "$__all"
            },
            "datasource": "Prometheus",
            "definition": "",
            "description": null,
            "error": null,
            "hide": 0,
            "includeAll": true,
            "label": "Namespace",
            "multi": true,
            "name": "namespace",
            "options": [],
            "query": {
              "query": "label_values(namespace)",
              "refId": "Prometheus-namespace-Variable-Query"
            },
            "refresh": 1,
            "regex": "",
            "skipUrlSync": false,
            "sort": 0,
            "tagValuesQuery": "",
            "tagsQuery": "",
            "type": "query",
            "useTags": false
          }
        ]
      },
      "time": {
        "from": "now-15m",
        "to": "now"
      },
      "timepicker": {
        "refresh_intervals": [
          "5s",
          "10s",
          "30s",
          "1m",
          "5m",
          "15m",
          "30m",
          "1h",
          "2h",
          "1d"
        ],
        "time_options": [
          "5m",
          "15m",
          "1h",
          "6h",
          "12h",
          "24h",
          "2d",
          "7d",
          "30d"
        ]
      },
      "timezone": "browser",
      "title": "Kubernetes Pod Resources",
      "uid": "0Mu1btknk",
      "version": 4
    }
```

##### 2、grafana-pvc资源

```
[root@master ~]# cat grafana-pvc.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: kube-system

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv-grafana
  labels:
    pv: nfs-pv-grafana
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /data/nfs/grafana
    server: 192.168.52.135

---

kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: nfs-pvc-grafana
  namespace: kube-system
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  selector:
    matchLabels:
      pv: nfs-pv-grafana
---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv-grafana-plugin
  labels:
    pv: nfs-pv-grafana-plugin
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /data/nfs/grafana-plugin
    server: 192.168.52.135

---

kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: nfs-pvc-grafana-plugin
  namespace: kube-system
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  selector:
    matchLabels:
      pv: nfs-pv-grafana-plugin
```

##### 3、grafana-deployment资源

configmap、pvc资源现在volume内进行声明，在由volumemount挂载到pod内。

```
[root@master ~]# cat grafana-deploy.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana-core
  namespace: kube-system
  labels:
    app: grafana
    component: core
spec:
  selector:
    matchLabels:
      app: grafana
      component: core
  replicas: 1
  template:
    metadata:
      labels:
        app: grafana
        component: core
    spec:
      containers:
      - image: grafana/grafana:7.5.6
        name: grafana-core
        imagePullPolicy: IfNotPresent
        resources:
          limits:
            cpu: 100m
            memory: 100Mi
          requests:
            cpu: 100m
            memory: 100Mi
        env:
          - name: GF_AUTH_BASIC_ENABLED
            value: "true"
          - name: GF_AUTH_ANONYMOUS_ENABLED
            value: "false"
        readinessProbe:
          httpGet:
            path: /login
            port: 3000
        volumeMounts:
        - name: grafana-persistent-storage
          mountPath: /var
        - name: grafana-plugin-storage
          mountPath: /var/lib/grafana
        - mountPath: /etc/grafana/provisioning/datasources
          name: grafana-datasources
          readOnly: false
        - mountPath: /etc/grafana/provisioning/dashboards
          name: grafana-dashboards
          readOnly: false
        - mountPath: /grafana-dashboard-definitions/0/podresource
          name: grafana-k8s-pod-resource
          readOnly: false
      volumes:
      - name: grafana-persistent-storage
        persistentVolumeClaim:
          claimName: nfs-pvc-grafana
      - name: grafana-plugin-storage
        persistentVolumeClaim:
          claimName: nfs-pvc-grafana-plugin
      - name: grafana-datasources
        configMap:
          name: grafana-datasources
      - configMap:
          name: grafana-dashboards
        name: grafana-dashboards
      - configMap:
          name: grafana-k8s-pod-resource
        name: grafana-k8s-pod-resource
```

##### 4、grafana-service资源

```
[root@master ~]# cat grafana-svc.yaml
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: kube-system
  labels:
    app: grafana
    component: core
spec:
  type: NodePort
  ports:
    - port: 3000
  selector:
    app: grafana
    component: core
```

```
[root@master ~]# kubectl apply -f grafana-cm.yaml
[root@master ~]# kubectl apply -f grafana-pvc.yaml
[root@master ~]# kubectl apply -f grafana-deploy.yaml
[root@master ~]# kubectl apply -f grafana-svc.yaml
[root@master ~]# kubectl get pod,svc,pv,pvc,cm -A | grep grafana
kube-system    pod/grafana-core-9cf6488c6-dddqv     1/1     Running   0          114m
kube-system   service/grafana      NodePort    10.106.6.209   &lt;none&gt;        3000:30583/TCP           113m
            persistentvolume/nfs-pv-grafana          10Gi       RWX            Retain           Bound    kube-system/nfs-pvc-grafana                                  103m
            persistentvolume/nfs-pv-grafana-plugin   10Gi       RWX            Retain           Bound    kube-system/nfs-pvc-grafana-plugin                           103m
kube-system   persistentvolumeclaim/nfs-pvc-grafana          Bound    nfs-pv-grafana          10Gi       RWX                           103m
kube-system   persistentvolumeclaim/nfs-pvc-grafana-plugin   Bound    nfs-pv-grafana-plugin   10Gi       RWX                           103m
kube-system       configmap/grafana-dashboards                   1      114m
kube-system       configmap/grafana-datasources                  1      114m
kube-system       configmap/grafana-k8s-pod-resource             1      114m
```

<img loading="lazy" src="https://www.chenjiao.cloud/upload/grafana.png" alt="grafana.png" width="100%" height="100%" style="display: inline-block">
