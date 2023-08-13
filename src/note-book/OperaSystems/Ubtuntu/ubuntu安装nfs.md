# ubuntu安装nfs

1. ## 安装
```
# 安装nfs服务端
apt-get install nfs-kernel-server -y
```
2. ## 修改配置
```
vim /etc/exports

# 添加数据
# 路径为挂载路径
/data/nfs/sshw *(async,insecure,no_root_squash,no_subtree_check,rw)
```
3. ## 重启nfs
```
# 重启
/etc/init.d/nfs-kernel-server restart
# 校验配置
showmount -e 
```

4. ## liunx连接nfs
```
# 安装连接客户端
apt install nfs-common -y
mount 10.24.1.235:/data/nfs/sshw /home/ubuntu/yyl2/sshw
```
4. ## MacOS连接nfs(有一些额外参数，否则可能会出现异常)
```
sudo mount -t nfs -o nolock,nfsvers=3,vers=3  10.24.1.235:/data/nfs/sshw /Users/yyl/sshw
```