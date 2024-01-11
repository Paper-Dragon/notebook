# zabbix使用容器方式部署

> 近期做了一些民间项目，不需要极好的可靠性，要求快速部署和删除。所以做了个Docker方案。进行记录
>
> 参考资料： 
>
> - zabbix-docker镜像构建的文档在这里
>   - https://github.com/zabbix/zabbix-docker
> - 该页面所有资料来自官网
>   - https://www.zabbix.com/documentation/current/zh/manual/installation/containers

## Zabbix-Server

Zabbix 组件支持 MySQL 和 PostgreSQL 数据库、Apache2 和 Nginx Web 服务器。这些 image 被分成多个不同的 image。

> 组件化和降低耦合度能够更加缩小软件的体积。更容易部署和升级。更容易实现负载均衡和高可用。

### 变量列表



| **变量**                 | **组件**              | **描述**                                                     |
| ------------------------ | --------------------- | ------------------------------------------------------------ |
| `DB_SERVER_HOST`         | Server Proxy Web 界面 | 这个变量指的是 MySQL 或 PostgreSQL 的 IP 或 DNS。 默认情况下，这个值根据 MySQL 和 PostgreSQL，分别为mysql-server 或 postgres-server |
| `DB_SERVER_PORT`         | Server Proxy Web 界面 | 这个变量指的是 MySQL 或 PostgreSQL 的端口。 默认情况下，这个值根据 MySQL 和 PostgreSQL，分别为 '3306' 或 '5432' 。 |
| `MYSQL_USER`             | Server Proxy Web 界面 | MySQL 数据库用户。 默认情况下，这个值为 'zabbix'。           |
| `MYSQL_PASSWORD`         | Server Proxy Web 界面 | MySQL 数据库密码。 默认情况下，这个值为 'zabbix'。           |
| `MYSQL_DATABASE`         | Server Proxy Web 界面 | Zabbix 数据库库名。 默认情况下，这个值根据 Zabbix server 和 Zabbix proxy，分别为 'zabbix' 和 'zabbix_proxy' 。 |
| `POSTGRES_USER`          | Server Web 界面       | PostgreSQL 数据库用户。 默认情况下，这个值为 'zabbix'。      |
| `POSTGRES_PASSWORD`      | Server Web 界面       | PostgreSQL 数据库密码。 默认情况下，这个值为 'zabbix'。      |
| `POSTGRES_DB`            | Server Web 界面       | Zabbix 数据库库名。 默认情况下，这个值根据 Zabbix server 和 Zabbix proxy，分别为 'zabbix' 和 'zabbix_proxy' 。 |
| `PHP_TZ`                 | Web 界面              | PHP 时区格式。支持时区的完整列表参照 [php.net](http://php.net/manual/en/timezones.php)。 默认情况下，这个值为 'Europe/Riga' 。 |
| `ZBX_SERVER_NAME`        | Web 界面              | Web 界面右上角显示的安装名称。 默认情况下，这个值为 'Zabbix Docker' 。 |
| `ZBX_JAVAGATEWAY_ENABLE` | Server Proxy          | 是否启用 Zabbix Java 网关 以采集与 Java 相关的检查数据。 默认情况下，这个值为 "false" 。 |
| `ZBX_ENABLE_SNMP_TRAPS`  | Server Proxy          | 是否启用 SNMP trap 功能。 这需要存在 zabbix-snmptraps 容器实例，并共享 /var/lib/zabbix/snmptraps volume 到 Zabbix server 或 proxy。 |

### Volumes

Image 中允许使用一些挂载点。根据 Zabbix 组件类型，这些挂载点各不相同：

| **Volume**                                    | **描述**                                                     |
| --------------------------------------------- | ------------------------------------------------------------ |
| **Zabbix agent**                              |                                                              |
| */etc/zabbix/zabbix_agentd.d*                 | 这个 volume 允许包含 **.conf* 文件并使用 `UserParameter` 扩展 Zabbix agent。 |
| */var/lib/zabbix/modules*                     | 这个 volume 允许加载其它 module 并使用 [LoadModule](https://www.zabbix.com/documentation/current/zh/manual/config/items/loadablemodules) 功能扩展 Zabbix agent。 |
| */var/lib/zabbix/enc*                         | 这个 volume 用于存放 TLS 相关的文件。这些文件名使用 `ZBX_TLSCAFILE`, `ZBX_TLSCRLFILE`, `ZBX_TLSKEY_FILE` ，`ZBX_TLSPSKFILE` 等环境变量指定。 |
| **Zabbix server**                             |                                                              |
| */usr/lib/zabbix/alertscripts*                | 这个 volume 用于自定义告警脚本。即 [zabbix_server.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_server) 中的 `AlertScriptsPath` 参数。 |
| */usr/lib/zabbix/externalscripts*             | 这个 volume 用于 [外部检查](https://www.zabbix.com/documentation/current/zh/manual/config/items/itemtypes/external)。即 [zabbix_server.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_server) 中的 `ExternalScripts` 参数。 |
| */var/lib/zabbix/modules*                     | 这个 volume 允许通过 [LoadModule](https://www.zabbix.com/documentation/current/zh/manual/config/items/loadablemodules) 功能加载额外的模块以扩展 Zabbix server。 |
| */var/lib/zabbix/enc*                         | 这个 volume 用于存放 TLS 相关的文件。这些文件名使用 `ZBX_TLSCAFILE`, `ZBX_TLSCRLFILE`, `ZBX_TLSKEY_FILE` ，`ZBX_TLSPSKFILE` 等环境变量指定。 |
| */var/lib/zabbix/ssl/certs*                   | 这个 volume 用于存放客户端认证的 SSL 客户端认证文件。即 [zabbix_server.conf] 中的 `SSLCertLocation` 参数。 |
| */var/lib/zabbix/ssl/keys*                    | 这个 volume 用于存放客户端认证的 SSL 私钥文件。即 [zabbix_server.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_server) 中的 `SSLKeyLocation` 参数。 |
| */var/lib/zabbix/ssl/ssl_ca*                  | 这个 volume 用于存放 SSL 服务器证书认证的证书颁发机构(CA)文件。即 [zabbix_server.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_server) 中的 `SSLCALocation` 参数。 |
| */var/lib/zabbix/snmptraps*                   | 这个 volume 用于存放 snmptraps.log 文件。它可由 zabbix-snmptraps 容器共享，并在创建 Zabbix server 新实例时使用 Docker 的 `--volumes-from` 选项继承。可以通过共享 volume ，并将 ZBX_ENABLE_SNMP_TRAPS 环境变量切换为 'true' 以启用 SNMP trap 处理功能。 |
| */var/lib/zabbix/mibs*                        | 这个 volume 允许添加新的 MIB 文件。它不支持子目录，所有的 MIB 文件必须位于 `/var/lib/zabbix/mibs` 下。 |
| **Zabbix proxy**                              |                                                              |
| */usr/lib/zabbix/externalscripts*             | 这个 volume 用于 [外部检查](https://www.zabbix.com/documentation/current/zh/manual/config/items/itemtypes/external)。即 [zabbix_proxy.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_proxy) 中的 `ExternalScripts` 参数。 |
| */var/lib/zabbix/modules*                     | 这个 volume 允许通过 [LoadModule](https://www.zabbix.com/documentation/current/zh/manual/config/items/loadablemodules) 功能加载额外的模块以扩展 Zabbix server。 |
| */var/lib/zabbix/enc*                         | 这个 volume 用于存放 TLS 相关的文件。这些文件名使用 `ZBX_TLSCAFILE`, `ZBX_TLSCRLFILE`, `ZBX_TLSKEY_FILE` ，`ZBX_TLSPSKFILE` 等环境变量指定。 |
| */var/lib/zabbix/ssl/certs*                   | 这个 volume 用于存放客户端认证的 SSL 客户端认证文件。即 [zabbix_proxy.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_proxy) 中的 `SSLCertLocation` 参数。 |
| */var/lib/zabbix/ssl/keys*                    | 这个 volume 用于存放客户端认证的 SSL 私钥文件。即 [zabbix_proxy.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_proxy) 中的 `SSLKeyLocation` 参数。 |
| */var/lib/zabbix/ssl/ssl_ca*                  | 这个 volume 用于存放 SSL 服务器证书认证的证书颁发机构(CA)文件。即[zabbix_proxy.conf](https://www.zabbix.com/documentation/current/zh/manual/appendix/config/zabbix_proxy) 中的 `SSLCALocation` 参数。 |
| */var/lib/zabbix/snmptraps*                   | 这个 volume 用于存放 snmptraps.log 文件。它可由 zabbix-snmptraps 容器共享，并在创建 Zabbix server 新实例时使用 Docker 的 `--volumes-from` 选项继承。可以通过共享 volume ，并将 ZBX_ENABLE_SNMP_TRAPS 环境变量切换为 'true' 以启用 SNMP trap 处理功能。 |
| */var/lib/zabbix/mibs*                        | 这个 volume 允许添加新的 MIB 文件。它不支持子目录，所有的 MIB 文件必须位于 `/var/lib/zabbix/mibs` 下。 |
| **基于 Apache2 web 服务器的 Zabbix web 界面** |                                                              |
| */etc/ssl/apache2*                            | 这个 volume 允许为 Zabbix Web 界面启用 HTTPS。这个 volume 必须包含为 Apache2 SSL 连接准备的 `ssl.crt` 和 `ssl.key` 两个文件。 |
| **基于 Nginx web 服务器的 Zabbix web 界面**   |                                                              |
| */etc/ssl/nginx*                              | 这个 volume 允许为 Zabbix Web 接口启用 HTTPS。这个 volume 必须包含为 Nginx SSL 连接装备的 `ssl.crt` 和 `ssl.key` 两个文件。 |
| **Zabbix snmptraps**                          |                                                              |
| */var/lib/zabbix/snmptraps*                   | 这个 volume 包含了已接收到的 SNMP traps 命名的 `snmptraps.log`日志文件。 |
| */var/lib/zabbix/mibs*                        | 这个 volume 允许添加新的 MIB 文件。它不支持子目录，所有的 MIB 文件必须位于 `/var/lib/zabbix/mibs` 下。 |

### 案例来自官网

#### 示例1

该示例示范了如何运行 MySQL 数据库支持的 Zabbix Server 、基于 Nginx Web 服务器的 Zabbix Web 界面和 Zabbix Java 网关。

1. 创建专用于 Zabbix 组件容器的网络：

```
# docker network create --subnet 172.20.0.0/16 --ip-range 172.20.240.0/20 zabbix-net
```

2. 启动空的 MySQL 服务器实例：

```
# docker run --name mysql-server -t \
             -e MYSQL_DATABASE="zabbix" \
             -e MYSQL_USER="zabbix" \
             -e MYSQL_PASSWORD="zabbix_pwd" \
             -e MYSQL_ROOT_PASSWORD="root_pwd" \
             --network=zabbix-net \
             -d mysql:8.0 \
             --restart unless-stopped \
             --character-set-server=utf8 --collation-server=utf8_bin \
             --default-authentication-plugin=mysql_native_password
```

3. 启动 Zabbix Java 网关实例：

```
# docker run --name zabbix-java-gateway -t \
             --network=zabbix-net \
             --restart unless-stopped \
             -d zabbix/zabbix-java-gateway:alpine-5.4-latest
```

4. 启动 Zabbix server 实例，并将其关联到已创建的 MySQL server 实例：

```
# docker run --name zabbix-server-mysql -t \
             -e DB_SERVER_HOST="mysql-server" \
             -e MYSQL_DATABASE="zabbix" \
             -e MYSQL_USER="zabbix" \
             -e MYSQL_PASSWORD="zabbix_pwd" \
             -e MYSQL_ROOT_PASSWORD="root_pwd" \
             -e ZBX_JAVAGATEWAY="zabbix-java-gateway" \
             --network=zabbix-net \
             -p 10051:10051 \
             --restart unless-stopped \
             -d zabbix/zabbix-server-mysql:alpine-5.4-latest
```

Zabbix server 实例将 10051/TCP 端口（Zabbix trapper）暴露给主机。

5. 启动 Zabbix Web 界面，并将其关联到已创建的 MySQL server 和 Zabbix server 实例：

```
# docker run --name zabbix-web-nginx-mysql -t \
             -e ZBX_SERVER_HOST="zabbix-server-mysql" \
             -e DB_SERVER_HOST="mysql-server" \
             -e MYSQL_DATABASE="zabbix" \
             -e MYSQL_USER="zabbix" \
             -e MYSQL_PASSWORD="zabbix_pwd" \
             -e MYSQL_ROOT_PASSWORD="root_pwd" \
             --network=zabbix-net \
             -p 80:8080 \
             --restart unless-stopped \
             -d zabbix/zabbix-web-nginx-mysql:alpine-5.4-latest
```

Zabbix web 界面实例将 80/TCP 端口（HTTP）暴露给主机。

#### **示例 2**

该示例示范了如何运行 PostgreSQL 数据库支持的 Zabbix server、基于 Nginx Web 服务器的 Zabbix Web 界面和 SNMP trap功能。

1. 创建专用于 Zabbix 组件容器的网络：

```
# docker network create --subnet 172.20.0.0/16 --ip-range 172.20.240.0/20 zabbix-net
```

2. 启动空的 PostgreSQL server 实例：

```
# docker run --name postgres-server -t \
             -e POSTGRES_USER="zabbix" \
             -e POSTGRES_PASSWORD="zabbix_pwd" \
             -e POSTGRES_DB="zabbix" \
             --network=zabbix-net \
             --restart unless-stopped \
             -d postgres:latest
```

3. 启动 Zabbix snmptraps 实例：

```
# docker run --name zabbix-snmptraps -t \
             -v /zbx_instance/snmptraps:/var/lib/zabbix/snmptraps:rw \
             -v /var/lib/zabbix/mibs:/usr/share/snmp/mibs:ro \
             --network=zabbix-net \
             -p 162:1162/udp \
             --restart unless-stopped \
             -d zabbix/zabbix-snmptraps:alpine-5.4-latest
```

Zabbix snmptrap 实例将 162/UDP 端口（SNMP traps）暴露给主机。

4. 启动 Zabbix server 实例，并将其关联到已创建的 PostgreSQL server 实例：

```
# docker run --name zabbix-server-pgsql -t \
             -e DB_SERVER_HOST="postgres-server" \
             -e POSTGRES_USER="zabbix" \
             -e POSTGRES_PASSWORD="zabbix_pwd" \
             -e POSTGRES_DB="zabbix" \
             -e ZBX_ENABLE_SNMP_TRAPS="true" \
             --network=zabbix-net \
             -p 10051:10051 \
             --volumes-from zabbix-snmptraps \
             --restart unless-stopped \
             -d zabbix/zabbix-server-pgsql:alpine-5.4-latest
```

Zabbix server 实例将 10051/TCP 端口（Zabbix trapper）暴露给主机。

5. 启动 Zabbix Web 界面，并将其关联到已创建的 PostgreSQL server 和 Zabbix server 实例：

```
# docker run --name zabbix-web-nginx-pgsql -t \
             -e ZBX_SERVER_HOST="zabbix-server-pgsql" \
             -e DB_SERVER_HOST="postgres-server" \
             -e POSTGRES_USER="zabbix" \
             -e POSTGRES_PASSWORD="zabbix_pwd" \
             -e POSTGRES_DB="zabbix" \
             --network=zabbix-net \
             -p 443:8443 \
             -p 80:8080 \
             -v /etc/ssl/nginx:/etc/ssl/nginx:ro \
             --restart unless-stopped \
             -d zabbix/zabbix-web-nginx-pgsql:alpine-5.4-latest
```

Zabbix web 界面实例将 443/TCP 端口（HTTPS）暴露给主机。
       */etc/ssl/nginx* 目录必须包含具有所需名称的证书。

## Zabbix-Agent



```bash
docker run --name zabbix-agent -e ZBX_HOSTNAME="some-hostname" -e ZBX_SERVER_HOST="some-zabbix-server" -p 10050:10050 -d zabbix/zabbix-agent:5.0.15-ubuntu
 
some-hostname是主机名，是 Zabbix 代理配置文件中的主机名参数，some-zabbix-server是 Zabbix 服务器或代理的 IP 或 DNS 名称
```



## 一键部署

### zabbix-server 5.2,mysql 8.0.23

```yaml
version: '3'

services:
	# web界面
  zabbix-web-nginx-mysql:
    image: zabbix/zabbix-web-nginx-mysql:centos-5.2-latest
    restart: always
    environment:
      - DB_SERVER_HOST=zabbix-mysql
      - MYSQL_DATABASE=zabbix
      - MYSQL_USER=zabbix
      - MYSQL_PASSWORD=zabbix
      - MYSQL_ROOT_PASSWORD=123qwe
      - ZBX_SERVER_HOST=zabbix-server-mysql
    ports:
      - 8080:8080
    volumes:
      - /etc/localtime:/etc/localtime
      - /data2/zabbix/fonts/DejaVuSans.ttf:/usr/share/zabbix/assets/fonts/DejaVuSans.ttf
    networks:
      - zbx_net
    depends_on:
      - zabbix-server-mysql
      - zabbix-mysql
  # 数据库
  zabbix-mysql:
    image: mysql:8.0.23
    restart: always
    ports:
      - 3306:3306
    environment:
      - MYSQL_DATABASE=zabbix
      - MYSQL_USER=zabbix
      - MYSQL_PASSWORD=zabbix
      - MYSQL_ROOT_PASSWORD=123qwe
    command:
      - mysqld
      - --default-authentication-plugin=mysql_native_password
      - --character-set-server=utf8
      - --collation-server=utf8_bin
    volumes:
      - /etc/localtime:/etc/localtime
      - /data2/zabbix/db:/var/lib/mysql
    networks:
      - zbx_net
  #  Java 网关容器
  zabbix-java-gateway:
    image: zabbix/zabbix-java-gateway:centos-5.2-latest
    restart: always
    volumes:
      - /etc/localtime:/etc/localtime
    networks:
      - zbx_net
  # Zabbix server容器
  zabbix-server-mysql:
    image: zabbix/zabbix-server-mysql:centos-5.2-latest
    restart: always
    volumes:
      - zabbix-server-vol:/etc/zabbix
      - /data2/zabbix/alertscripts:/usr/lib/zabbix/alertscripts
      - /etc/localtime:/etc/localtime
    ports:
      - 10051:10051
    environment:
      - DB_SERVER_HOST=zabbix-mysql
      - MYSQL_DATABASE=zabbix
      - MYSQL_USER=zabbix
      - MYSQL_PASSWORD=zabbix
      - MYSQL_ROOT_PASSWORD=123qwe
      - ZBX_JAVAGATEWAY=zabbix-java-gateway
      - ZBX_JAVAGATEWAY_ENABLE=true
      - ZBX_JAVAGATEWAYPORT=10052
    depends_on:
      - zabbix-mysql
    networks:
      - zbx_net
  # 探针
  zabbix-agent:
    image: zabbix/zabbix-agent:centos-5.2-latest
    restart: always
    ports:
      - 10050:10050
    environment:
      - ZBX_HOSTNAME=Zabbix server
      - ZBX_SERVER_HOST=zabbix-server-mysql
      - ZBX_SERVER_PORT=10051
    networks:
      - zbx_net

networks:
  zbx_net:
    driver: bridge

volumes:
  zabbix-server-vol:
```

解决汉化bug

```bash
mkdir alertscripts db fonts

cd fonts
wget https://dl.cactifans.com/zabbix_docker/msty.ttf
mv msty.ttf DejaVuSans.ttf
```

~~原x启动~~ 错台了，启动容器

```bash
docker compose up -d
```

访问浏览器8080端口

```bash
用户名Admin
密码zabbix
```

### Agent

```bash
version: "3"
services:
  zabbix-agent:
    container_name: zabbix-agent
    environment:
      - ZBX_HOSTNAME=some-hostname
      - ZBX_SERVER_HOST=some-zabbix-server
    ports:
      - 10050:10050
    image: zabbix/zabbix-agent:5.2-ubuntu-latest
```





