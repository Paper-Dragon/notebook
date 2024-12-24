#!/bin/bash

# 检查并停止所有正在运行的 Docker 容器
docker_ps=$(docker ps -q)
if [ -n "$docker_ps" ]; then
    echo "正在停止 Docker 容器..."
    docker stop $docker_ps
fi

# 检查并删除所有已停止的容器
docker_rm=$(docker ps -aq)
if [ -n "$docker_rm" ]; then
    echo "正在删除 Docker 容器..."
    docker rm $docker_rm
fi

# 检查并删除所有未被使用的镜像
docker_rmi=$(docker images -q -f dangling=true)
if [ -n "$docker_rmi" ]; then
    echo "正在删除 Docker 镜像..."
    docker rmi $docker_rmi
fi

# 卸载 Docker 相关软件包
if command -v yum &>/dev/null; then
    yum list installed | grep docker > /tmp/docker_deps.txt
    if [ -s "/tmp/docker_deps.txt" ]; then
        echo "正在卸载 Docker 软件包（yum）..."
        yum remove -y $(cut -d'' -f 1 /tmp/docker_deps.txt)
    else
        echo "未找到要卸载的 Docker 软件包（yum）。"
    fi
    rm -f /tmp/docker_deps.txt
elif command -v apt-get &>/dev/null; then
    apt list --installed | grep docker > /tmp/docker_deps.txt
    if [ -s "/tmp/docker_deps.txt" ]; then
        echo "正在卸载 Docker 软件包（apt-get）..."
        apt-get purge -y $(cut -d'/' -f 1 /tmp/docker_deps.txt)
    else
        echo "未找到要卸载的 Docker 软件包（apt-get）。"
    fi
    rm -f /tmp/docker_deps.txt
else
    echo "不支持的包管理器。请手动卸载 Docker。"
    exit 1
fi

# 删除 Docker 相关目录
rm -rf /var/lib/docker
rm -rf /var/run/docker

echo "Docker 已成功卸载。"