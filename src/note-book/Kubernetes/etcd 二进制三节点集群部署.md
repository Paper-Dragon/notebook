# 在200的运维主机上创建生成CA证书的JSON配置文件

```bash
vi /opt/certs/ca-config.json
[root@master1 cert]# cat ca-config.json
{
    "signing": {
        "default": {
            "expiry": "175200h"
        },
        "profiles": {
            "kubernetes": {
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth",
                    "client auth"
                ],
                "expiry": "175200h"
            },
            "server": {
                "expiry": "175200h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth"
                ]
            },
            "client": {
                "expiry": "175200h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "client auth"
                ]
            },
            "peer": {
                "expiry": "175200h",
                "usages": [
                    "signing",
                    "key encipherment",
                    "server auth",
                    "client auth"
                ]
            }
        }
    }
}

创建生成证书签名请求的csr文件；
vi /opt/certs/etcd-peer-csr.json
{
    "CN": "etcd-peer",
    "hosts": [
        "10.4.7.11",
        "10.4.7.12",
        "10.4.7.21",
        "10.4.7.22"
    ],
    "key": {
        "algo": "rsa",
        "size": 2048
    },
    "names": [
        {
            "C": "CN",
            "ST": "beijing",
            "L": "beijing",
            "O": "od",
            "OU": "ops"
        }
    ]
}
生成证书：
cd /opt/certs
certs]# cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=peer etcd-peer-csr.json | cfssl-json -bare etcd-peer
```

# 在10.4.7.12 主机上按照架构设计，在hdss7-12，hdss7-21, hdss7-22三台上部署etcd服务：

首先创建etcd用户：
```bash
# useradd -s /sbin/nologin -M etcd
```
创建应用包存放目录
```
# mkdir -p /opt/src
# cd /opt/src
```
下载etcd组件：

地址：https://github.com/etcd-io/etcd/tags
```
# wget https://github.com/etcd-io/etcd/releases/download/v3.2.28/etcd-v3.2.28-linux-amd64.tar.gz
# tar -zxf etcd-v3.2.28-linux-amd64.tar.gz -C ../
# ln -s /opt/etcd-v3.2.28-linux-amd64/ /opt/etcd
# mkdir -p /opt/etcd/certs /data/etcd /data/logs/etcd-server
```


编辑etcd启动脚本：
```

# vim /opt/etcd/etcd-server-startup.sh
```

标红处在另外两台服务器上需要修改成对应自己的ip地址：


```bash
#!/bin/sh
./etcd --name etcd-server-7-12 \
       --data-dir /data/etcd/etcd-server \
       --listen-peer-urls https://10.4.7.12:2380 \
       --listen-client-urls https://10.4.7.12:2379,http://127.0.0.1:2379 \
       --quota-backend-bytes 8000000000 \
       --initial-advertise-peer-urls https://10.4.7.12:2380 \
       --advertise-client-urls https://10.4.7.12:2379,http://127.0.0.1:2379 \
       --initial-cluster  etcd-server-7-12=https://10.4.7.12:2380,etcd-server-7-21=https://10.4.7.21:2380,etcd-server-7-22=https://10.4.7.22:2380 \
       # --ca-file ./certs/ca.pem \
       # --cert-file ./certs/etcd-peer.pem \
       --key-file ./certs/etcd-peer-key.pem \
       --client-cert-auth  \
       --trusted-ca-file ./certs/ca.pem \
       --peer-ca-file ./certs/ca.pem \
       --peer-cert-file ./certs/etcd-peer.pem \
       --peer-key-file ./certs/etcd-peer-key.pem \
       --peer-client-cert-auth \
       --peer-trusted-ca-file ./certs/ca.pem \
       --log-output stdout

```

添加执行权限：
```
# chmod +x /opt/etcd/etcd-server-startup.sh
```
创建证书存放目录：
```
# mkdir /opt/etcd/certs

# cd /opt/etcd/certs
```
拷贝证书：
```
# scp hdss7-200:/opt/certs/ca.pem ./
# scp hdss7-200:/opt/certs/etcd-peer.pem ./
# scp hdss7-200:/opt/certs/etcd-peer-key.pem ./
```
给目录授权：

```
# chown -R etcd.etcd /opt/etcd/certs /data/etcd /data/logs/etcd-server
```

安装supervisor管理服务

```bash
# yum install supervisor -y
```

启动服务：

```
# systemctl start supervisord 
# systemctl enable supervisord
```

编辑etcd启动脚本：红色部分根据主机修改

```
# vi /etc/supervisord.d/etcd-server.ini
```



```
[program:etcd-server-7-12]
command=/opt/etcd/etcd-server-startup.sh                        ; the program (relative uses PATH, can take args)
numprocs=1                                                      ; number of processes copies to start (def 1)
directory=/opt/etcd                                             ; directory to cwd to before exec (def no cwd)
autostart=true                                                  ; start at supervisord start (default: true)
autorestart=true                                                ; retstart at unexpected quit (default: true)
startsecs=30                                                    ; number of secs prog must stay running (def. 1)
startretries=3                                                  ; max # of serial start failures (default 3)
exitcodes=0,2                                                   ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT                                                 ; signal used to kill process (default TERM)
stopwaitsecs=10                                                 ; max num secs to wait b4 SIGKILL (default 10)
user=etcd                                                       ; setuid to this UNIX account to run the program
redirect_stderr=true                                            ; redirect proc stderr to stdout (default false)
stdout_logfile=/data/logs/etcd-server/etcd.stdout.log           ; stdout log path, NONE for none; default AUTO
stdout_logfile_maxbytes=64MB                                    ; max # logfile bytes b4 rotation (default 50MB)
stdout_logfile_backups=4                                        ; # of stdout logfile backups (default 10)
stdout_capture_maxbytes=1MB                                     ; number of bytes in 'capturemode' (default 0)
stdout_events_enabled=false                                     ; emit events on stdout writes (default false)killasgroup=truestopasgroup=true
```



# 更新supervisord

```
# supervisorctl update
```

检查状态：

```bash
# supervisorctl status

[root@hdss7-12 logs]# supervisorctl status
etcd-server-7-12                 RUNNING   pid 73009, uptime 0:00:33
[root@hdss7-12 etcd]# ./etcdctl member list
988139385f78284: name=etcd-server-7-22 peerURLs=https://10.4.7.22:2380 clientURLs= isLeader=false
5a0ef2a004fc4349: name=etcd-server-7-21 peerURLs=https://10.4.7.21:2380 clientURLs=http://127.0.0.1:2379,https://10.4.7.21:2379 isLeader=false
f4a0cb0a765574a8: name=etcd-server-7-12 peerURLs=https://10.4.7.12:2380 clientURLs=http://127.0.0.1:2379,https://10.4.7.12:2379 isLeader=true
[root@hdss7-12 etcd]# ./etcdctl cluster-health
member 988139385f78284 is unreachable: no available published client urls
member 5a0ef2a004fc4349 is healthy: got healthy result from http://127.0.0.1:2379
member f4a0cb0a765574a8 is healthy: got healthy result from http://127.0.0.1:2379
cluster is healthy
[root@hdss7-12 etcd]#


```







