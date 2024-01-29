# Nginx正向代理高并发

## Proxy

```bash
#!/bin/bash
yum makecache && yum install epel-* -y && yum install nginx -y && yum clean all


systemctl start nginx
systemctl enable nginx
# 检查是否已经存在listen 3126;字段

if grep -q "listen 3126;" /etc/nginx/nginx.conf; then
  echo "代理服务器 listen 3126; 已经安装"
else
  # 在http字段后插入新的server块
  sed -i '/http {/a\    server {\n    listen 3126;\n    server_name _;\n    location / {\n    resolver 8.8.8.8;\n    proxy_pass $scheme://$http_host$request_uri;\n    }\n}' /etc/nginx/nginx.conf
  echo "已配置代理服务器"
fi
nginx -s reload

# 将以下配置写入 /etc/sysctl.conf

cat <<EOF >/etc/sysctl.conf
net.ipv4.tcp_fin_timeout = 5
net.ipv4.tcp_keepalive_time = 5
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_max_syn_backlog = 3240000
net.ipv4.tcp_max_tw_buckets = 10000

net.ipv4.tcp_mem = 768432 2097152 15242880
net.ipv4.tcp_rmem = 4096 4096 33554432
net.ipv4.tcp_wmem = 4096 4096 33554432
net.ipv4.ip_local_port_range = 2048 64500
net.core.wmem_default = 183888608
net.core.rmem_default = 183888608
net.core.rmem_max = 33554432
net.core.wmem_max = 33554432
net.core.netdev_max_backlog = 2621244

kernel.sem=250 65536 100 2048
kernel.msgmax = 65536
kernel.msgmnb = 65536
kernel.perf_cpu_time_max_percent = 60
kernel.perf_event_max_sample_rate = 6250
net.ipv4.tcp_max_orphans = 1048576
kernel.sched_migration_cost_ns = 5000000
net.core.optmem_max = 25165824
net.core.somaxconn = 60000
net.ipv4.tcp_window_scaling = 1
EOF

# 应用新的配置
sysctl -p && echo "应用系统优化策略成功" || echo "部分系统优化策略应用失败"
```

## Client && Server

```bash
#!/bin/bash
# 将以下配置写入 /etc/sysctl.conf  

cat <<EOF >/etc/sysctl.conf
net.ipv6.conf.all.accept_ra=1
net.ipv6.conf.default.accept_ra=1
net.ipv6.conf.eth0.accept_ra=1
net.ipv4.tcp_fin_timeout = 10
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.ip_local_port_range = 1024    65000
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_max_tw_buckets = 5000
EOF

# 应用新的配置  
sysctl -p && echo "应用系统优化策略成功" || echo "部分系统优化策略应用失败"

```

