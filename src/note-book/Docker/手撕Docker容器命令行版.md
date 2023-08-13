# 手撕Docker容器





```bash
# 宿主机
# 防止namespace共享，默认创建新的rootfs，会被复制过去
mount --make-rprivate /
unshare --mount --uts --ipc --net --pid --fork /bin/bash
# bind mount 为当前挂载点绑定一个新的挂载点。
mount --bind /root/alpine-3.17.3 /root/alpine-3.17.3

# 交换rootfs挂载点
mkdir oldroot
# 更新挂载点
cd ..
cd alpine-3.17.3/
# 交换rootfs挂载点
pivot_root . oldroot/
------------进入容器---------

# 更新环境变量
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# 挂入内存
mount -t proc none /proc

# 删除无效挂载点
umount -a


# lazy mount 删除老的rootfs挂载点
umount -l oldroot/



# 网络

root@k8s-master:~# pidof unshare
12202
# CPID=12202
ip link add name h$CPID type veth peer name c$CPID
ip link
ip link set c$CPID netns $CPID
ip link set h$CPID master docker0 up

# 容器内执行
ip link set lo up
ip link set c12202 name eth0 up
ip addr add 172.17.0.10/16 dev eth0
ip route add default via 172.17.0.1
ping 8.8.8.8
echo "nameserver 8.8.8.8" > /etc/resolv.conf
ping baidu.com


```

