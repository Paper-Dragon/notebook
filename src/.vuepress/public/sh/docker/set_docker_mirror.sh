#!/bin/sh
cat <<-EOF > /etc/docker/daemon.json 
{
  "registry-mirrors": ["https://hub.geekery.cn/"]
}
EOF
systemctl daemon-reload
systemctl restart docker