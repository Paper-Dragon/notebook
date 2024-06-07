# 更改docker服务网段分配地址

## 在docker配置文件中追加参数

```json
# cat /etc/docker/daemon.json
{
  "bip": "172.66.1.1/24"
}
```

## 更改docker-compose网桥地址

使用单机容器编码工具，docker-compose时，容器之间的通信网络会用到br-xxx网桥，该网桥会在宿主机建立，示例如下：

```bash
[root@xingyongsheng ~]# ifconfig | headbr-35fc9d6212bd: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.16.238.1  netmask 255.255.255.0  broadcast 172.16.238.255
        ether 02:42:7a:4f:9a:b9  txqueuelen 0  (Ethernet)
        RX packets 6441897  bytes 8754859570 (8.1 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1525889  bytes 953197479 (909.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

   该网段也有可能与，已有网段重复，若要修改此网段，可按如下步骤进行。安全停掉所有用docker-compose编排的容器，这里建议使用docker-compose down来彻底停掉容器，并自动帮你移除docker-compose之前创建的网桥。之后修改docker-compose.yml文件，增加自定义网络段，如下所示。

```yaml
  version: '2.1'services:
  test-service:
    image: xxx
    container_name: xxxxx
    restart: always
    networks:
      - as4k-test

networks:
  as4k-test:
    ipam:
      config:
        - subnet: 172.16.238.0/24
          gateway: 172.16.238.1
```

用新的docker-compose文件，启动容器。
