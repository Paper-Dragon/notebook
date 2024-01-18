



# Harbor离线搭建

> 使用离线安装包安装Harbor和

# 先要条件

## 1.下载haobor安装包和docker-compose安装包

harbor载地址：http://harbor.orientsoft.cn/

本次下载后放入的目录是/home/carter，解压安装包

    tar xf harbor-offline-installer-v1.10.10.tgz

下载docker-composer，存放到/usr/local/bin目录下。

    # 这个是官方地址，可能比较慢，推荐使用下面的国内镜像地址
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # 国内镜像地址
    curl -L https://get.daocloud.io/docker/compose/releases/download/1.29.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
    
    # 下载完之后可以看下 /usr/local/bin 这个目录有没有 docker-compose 这个文件

## 2.安装docker-compose

    chmod +x /usr/local/bin/docker-compose
    
    ll /usr/local/bin/ |grep docker-compose

检查docker-compose是否安装成功：

    [root@harbor ~]# docker-compose --version
    docker-compose version 1.29.1, build c34c88b2
    [root@harbor ~]#

## 3.修改barbor默认端口和设置管理后台的admin密码

harbor的默认服务端口是80端口，但一般服务器上的80端口会被其他的服务占用，所以最后修改harbor的默认端口，这里修改为5000端口。

1）编辑/home/carter/harbor/docker-compose.yml文件：

    cd /home/carter/harbor/
    vi docker-compose.yml


# 安装

环境：centos7.6

## 1、安装docker

详情见：https://www.cnblogs.com/wukc/p/13265528.html

2、配置时区 

```
timedatectl set-timezone Asia/Shanghai
```

## 3、修改主机名称

```
hostnamectl set-hostname harbor
```

## 4、创建磁盘并挂载



```
pvcreate /dev/vdb
vgcreate data /dev/vdb
lvcreate -l 100%VG -n lv_harbor data 
mkdir /harbor
mkfs.xfs /dev/mapper/data-lv_harbor
more /etc/fstab                       #配置开机挂载磁盘
UUID=f81a1f4f-5608-46bc-b4ef-6d0f675eeacd  /harbor   xfs  defaults        0 0
mount -a
[root@harbor-20 harbor]#  df /harbor
Filesystem                 1K-blocks    Used Available Use% Mounted on
/dev/mapper/data-lv_harbor 209608708 1415772 208192936   1% /harbor
```



## 5、harbor安装

wget https://github.com/goharbor/harbor/releases/download/v1.10.1/harbor-offline-installer-v1.10.1.tgz #下载文件

```bash

common  common.sh  docker-compose.yml  harbor.v1.10.10.tar.gz  harbor.yml  install.sh  LICENSE  prepare
[root@harbor harbor]#
[root@harbor harbor]# cat harbor.yml
# Configuration file of Harbor

# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: harbor.cidana.com

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 180

# https related config
# https:
#   # https port for harbor, default is 443
#   port: 443
#   # The path of cert and key files for nginx
#   certificate: /your/certificate/path
#   private_key: /your/private/key/path

# Uncomment external_url if you want to enable external proxy
# And when it enabled the hostname will no longer used
# external_url: https://reg.mydomain.com:8433

# The initial password of Harbor admin
# It only works in first time to install harbor
# Remember Change the admin password from UI after launching Harbor.
harbor_admin_password: Harbor12345

# Harbor DB configuration
database:
  # The password for the root user of Harbor DB. Change this before any production use.
  password: root123
  # The maximum number of connections in the idle connection pool. If it <=0, no idle connections are retained.
  max_idle_conns: 50
  # The maximum number of open connections to the database. If it <= 0, then there is no limit on the number of open connections.
  # Note: the default number of connections is 100 for postgres.
  max_open_conns: 100

# The default data volume
data_volume: /data/harbor

# Harbor Storage settings by default is using /data dir on local filesystem
# Uncomment storage_service setting If you want to using external storage
# storage_service:
#   # ca_bundle is the path to the custom root ca certificate, which will be injected into the truststore
#   # of registry's and chart repository's containers.  This is usually needed when the user hosts a internal storage with self signed certificate.
#   ca_bundle:

#   # storage backend, default is filesystem, options include filesystem, azure, gcs, s3, swift and oss
#   # for more info about this configuration please refer https://docs.docker.com/registry/configuration/
#   filesystem:
#     maxthreads: 100
#   # set disable to true when you want to disable registry redirect
#   redirect:
#     disabled: false

# Clair configuration
clair:
  # The interval of clair updaters, the unit is hour, set to 0 to disable the updaters.
  updaters_interval: 12

jobservice:
  # Maximum number of job workers in job service
  max_job_workers: 10

notification:
  # Maximum retry count for webhook job
  webhook_job_max_retry: 10

chart:
  # Change the value of absolute_url to enabled can enable absolute url in chart
  absolute_url: disabled

# Log configurations
log:
  # options are debug, info, warning, error, fatal
  level: info
  # configs for logs in local storage
  local:
    # Log files are rotated log_rotate_count times before being removed. If count is 0, old versions are removed rather than rotated.
    rotate_count: 50
    # Log files are rotated only if they grow bigger than log_rotate_size bytes. If size is followed by k, the size is assumed to be in kilobytes.
    # If the M is used, the size is in megabytes, and if G is used, the size is in gigabytes. So size 100, size 100k, size 100M and size 100G
    # are all valid.
    rotate_size: 200M
    # The directory on your host that store log
    location: /data/logs/harbor

  # Uncomment following lines to enable external syslog endpoint.
  # external_endpoint:
  #   # protocol used to transmit log to external endpoint, options is tcp or udp
  #   protocol: tcp
  #   # The host of external endpoint
  #   host: localhost
  #   # Port of external endpoint
  #   port: 5140

#This attribute is for migrator to detect the version of the .cfg file, DO NOT MODIFY!
_version: 1.10.0

# Uncomment external_database if using external database.
# external_database:
#   harbor:
#     host: harbor_db_host
#     port: harbor_db_port
#     db_name: harbor_db_name
#     username: harbor_db_username
#     password: harbor_db_password
#     ssl_mode: disable
#     max_idle_conns: 2
#     max_open_conns: 0
#   clair:
#     host: clair_db_host
#     port: clair_db_port
#     db_name: clair_db_name
#     username: clair_db_username
#     password: clair_db_password
#     ssl_mode: disable
#   notary_signer:
#     host: notary_signer_db_host
#     port: notary_signer_db_port
#     db_name: notary_signer_db_name
#     username: notary_signer_db_username
#     password: notary_signer_db_password
#     ssl_mode: disable
#   notary_server:
#     host: notary_server_db_host
#     port: notary_server_db_port
#     db_name: notary_server_db_name
#     username: notary_server_db_username
#     password: notary_server_db_password
#     ssl_mode: disable

# Uncomment external_redis if using external Redis server
# external_redis:
#   host: redis
#   port: 6379
#   password:
#   # db_index 0 is for core, it's unchangeable
#   registry_db_index: 1
#   jobservice_db_index: 2
#   chartmuseum_db_index: 3
#   clair_db_index: 4

# Uncomment uaa for trusting the certificate of uaa instance that is hosted via self-signed cert.
# uaa:
#   ca_file: /path/to/ca

# Global proxy
# Config http proxy for components, e.g. http://my.proxy.com:3128
# Components doesn't need to connect to each others via http proxy.
# Remove component from `components` array if want disable proxy
# for it. If you want use proxy for replication, MUST enable proxy
# for core and jobservice, and set `http_proxy` and `https_proxy`.
# Add domain to the `no_proxy` field, when you want disable proxy
# for some special registry.
proxy:
  http_proxy:
  https_proxy:
  # no_proxy endpoints will appended to 127.0.0.1,localhost,.local,.internal,log,db,redis,nginx,core,portal,postgresql,jobservice,registry,registryctl,clair,chartmuseum,notary-server
  no_proxy:
  components:
    - core
    - jobservice
    - clair

```





```
解压tar -zxvf /harbor/harbor-offline-installer-v1.10.1.tgz
加载镜像 cd harbor/&& docker load -i harbor.v1.10.1.tar.gz
将docker-compose 放到/usr/local/bin 目录下 并赋权
mv docker-compose  /usr/local/bin  && chmod u+x /usr/local/bin/docker-compose
进入解压目录,配置harbor.yml(修改ip、web密码、数据目录、注释https)
      hostname: 
       # https related config
       #https:
       # https port for harbor, default is 443
       #  port: 443
       # The path of cert and key files for nginx
       #  certificate: /your/certificate/path
       #  private_key: /your/private/key/path
      harbor_admin_password: Harbor12345
      data_volume: /data/harbor
新建数据目录 mkdir /data/harbor
环境预配          ./prepare
habbor安装        ./install.sh
       
Creating network "harbor_harbor" with the default driver
Creating harbor-log ... done
Creating harbor-portal ... done
Creating registry      ... done
Creating redis         ... done
Creating harbor-db     ... done
Creating registryctl   ... done
Creating harbor-core   ... done
Creating harbor-jobservice ... done
Creating nginx             ... done
✔ ----Harbor has been installed and started successfully.----
```

`nginx`

```bash
nginx/conf.d/harbor.conf

[root@harbor harbor]# cat /etc/nginx/conf.d/harbor.conf
server {
    listen       80;
    server_name  harbor.cidana.com;
    client_max_body_size 1000m;
    
    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    location / {
        # root   html;
       # index  index.html index.htm;
        proxy_pass   http://127.0.0.1:180;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}




```



## 6、登录验证

http://ip  账号密码为上面配置文件中：admin：Harbor12345

## 7、配置docker使用harbor仓库



```
修改配置文件
vi /etc/docker/daemon.json 
{
 "insecure-registries":["172.20.210.20"]  #添加harbor仓库地址
}
systemctl restart docker
docker login:172.21.210.20
```



##  8、harbor启动和重启

```
cd /harbor/harbor
docker-compose up -d     #后台启动
docker-compose restart   #重启
```