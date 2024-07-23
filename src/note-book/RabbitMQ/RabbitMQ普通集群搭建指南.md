# RabbitMQ普通集群搭建指南

## 目标架构

本次搭建的目标是构建一个由三个节点组成的RabbitMQ集群，节点信息如下：

- **rabbit02**: IP地址 `192.168.10.132`
- **rabbit03**: IP地址 `192.168.10.133`
- **rabbit04**: IP地址 `192.168.10.134`

## 预备工作

在开始之前，确保所有节点上都已安装RabbitMQ Server。如果尚未安装，可以通过以下命令进行安装：

```bash
yum install -y epel-release
yum install -y rabbitmq-server
```

同时，设置主机名和修改`/etc/hosts`文件以正确解析各节点的名称。

## 同步.erlang.cookie

为了允许节点间通信，需要确保所有节点上的.erlang.cookie文件内容相同。使用以下命令从`rabbit02`节点复制cookie到其他节点

```bash
[root@rabbit02 ~]# scp /var/lib/rabbitmq/.erlang.cookie rabbit03:/var/lib/rabbitmq/
The authenticity of host 'rabbit03 (192.168.10.133)' can't be established.
ECDSA key fingerprint is SHA256:ImtbIE2DzY9M7yqwTDfMn3EzHOjk0CGowUigMe00exk.
ECDSA key fingerprint is MD5:23:d8:46:37:71:8b:e3:56:d1:48:d4:f5:a9:64:80:f0.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'rabbit03,192.168.10.133' (ECDSA) to the list of known hosts.
root@rabbit03's password: 
.erlang.cookie                                                                                                                                             100%   20    24.5KB/s   00:00    
[root@rabbit02 ~]# scp /var/lib/rabbitmq/.erlang.cookie rabbit04:/var/lib/rabbitmq/
The authenticity of host 'rabbit04 (192.168.10.134)' can't be established.
ECDSA key fingerprint is SHA256:ImtbIE2DzY9M7yqwTDfMn3EzHOjk0CGowUigMe00exk.
ECDSA key fingerprint is MD5:23:d8:46:37:71:8b:e3:56:d1:48:d4:f5:a9:64:80:f0.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'rabbit04,192.168.10.134' (ECDSA) to the list of known hosts.
root@rabbit04's password: 
.erlang.cookie                                                                                                                                             100%   20    21.1KB/s   00:00    
[root@rabbit02 ~]# 
```

## 集群配置

在`rabbit03`和`rabbit04`上执行以下步骤：

```bash
[root@rabbit03 ~]# rabbitmqctl stop_app
Stopping node rabbit@rabbit03 ...
...done.
[root@rabbit03 ~]# rabbitmqctl reset
Resetting node rabbit@rabbit03 ...
...done.
[root@rabbit03 ~]# systemctl stop firewalld
[root@rabbit03 ~]# rabbitmqctl join_cluster --ram rabbit@rabbit02
Clustering node rabbit@rabbit03 with rabbit@rabbit02 ...
...done.
```

```bash
[root@rabbit04 ~]# rabbitmqctl stop_app
Stopping node rabbit@rabbit04 ...
...done.
[root@rabbit04 ~]# systemctl stop firewalld
[root@rabbit04 ~]# rabbitmqctl stop_app
Stopping node rabbit@rabbit04 ...
...done.
[root@rabbit04 ~]# rabbitmqctl reset
Resetting node rabbit@rabbit04 ...
...done.
[root@rabbit04 ~]# rabbitmqctl join_cluster --ram rabbit@rabbit02
Clustering node rabbit@rabbit04 with rabbit@rabbit02 ...
...done.
```

## 最终确认

在`rabbit02`上执行以下步骤来确认集群状态：

这表明集群已经成功建立，并且`rabbit02`作为磁盘节点，`rabbit03`和`rabbit04`作为RAM节点加入了集群。

```bash
[root@rabbit02 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@rabbit02 ...
[{nodes,[{disc,[rabbit@rabbit02]},{ram,[rabbit@rabbit04,rabbit@rabbit03]}]},
 {running_nodes,[rabbit@rabbit02]},
 {cluster_name,<<"rabbit@rabbit02">>},
 {partitions,[]}]
...done.
[root@rabbit02 ~]# 

[root@rabbit03 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@rabbit03 ...
[{nodes,[{disc,[rabbit@rabbit02]},{ram,[rabbit@rabbit03]}]}]
...done.
[root@rabbit03 ~]# 

[root@rabbit03 ~]# rabbitmqctl cluster_status
Cluster status of node rabbit@rabbit03 ...
[{nodes,[{disc,[rabbit@rabbit02]},{ram,[rabbit@rabbit03]}]}]
...done.
```

## END

一些有用没用的历史命令！！！可以不用看了

```bash
yum install -y epel* ;yum install -y rabbitmq-server
vi /etc/hosts
hostnamectl set-hostname rabbit02
vi /etc/hosts
find / -name *.cookie
man rabbitmq-server
rabbitmq-server -detached
scp /var/lib/rabbitmq/.erlang.cookie rabbit03:/var/lib/rabbitmq/
scp /var/lib/rabbitmq/.erlang.cookie rabbit04:/var/lib/rabbitmq/
systemctl status rabbitmq-server
systemctl restart rabbitmq-server.service
systemctl status rabbitmq-server.service
chmod 400 /var/lib/rabbitmq/.erlang.cookie
systemctl restart rabbitmq-server.service
systemctl status rabbitmq-server.service
find / -name *.cookie
systemctl stop firewalld
rabbitmqctl cluster_status
history 

yum install -y epel* ;yum install -y rabbitmq-server
hostnamectl set-hostname rabbit03
vi /etc/hosts
 rabbitmq-server -detached
chmod 400 /var/lib/rabbitmq/.erlang.cookie
systemctl restart rabbitmq-server.service
systemctl status rabbitmq-server.service
systemctl restart rabbitmq-server.service
systemctl status rabbitmq-server.service
chmod 400 /var/lib/rabbitmq/.erlang.cookie
systemctl restart rabbitmq-server.service
rabbitmq-server -detached 
systemctl start rabbitmq-server.service
systemctl status rabbitmq-server.service
ps -ef | grep rabbit
kill -9 1969 
ps -ef | grep rabbit
kill -9 1999
ps -ef | grep rabbit
systemctl start rabbitmq-server.service
systemctl status rabbitmq-server.service
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl join_cluster --ram rabbit@rabbit02
systemctl stop firewalld
rabbitmqctl join_cluster --ram rabbit@rabbit02
rabbitmqctl cluster_status
history 

yum install -y epel* ;yum install -y rabbitmq-server
hostnamectl set-hostname rabbit04
vi /etc/hosts
 rabbitmq-server -detached
chmod 400 /var/lib/rabbitmq/.erlang.cookie
systemctl restart rabbitmq-server
systemctl status rabbitmq-server
rabbitmq-server -detached
systemctl status rabbitmq-server
systemctl restart rabbitmq-server
find / -name *.cookie
ps -ef | grep rabbit
kill -9  1960 1990  
ps -ef | grep rabbit
systemctl restart rabbitmq-server
systemctl status rabbitmq-server
rabbitmqctl stop_app
systemctl stop firewalld
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl join_cluster --ram rabbit@rabbit02
rabbitmqctl cluster_status

```