# JumperServer的Docker容器部署

## 环境展示和配置如下

```bash
[root@localhost ~]# cat /etc/redhat-release
Rocky Linux release 8.5 (Green Obsidian)
[root@localhost ~]# sed -i 's/SELINUX=.*$/SELINUX=disabled/g' /etc/selinux/config
[root@localhost ~]# grep SELINUX /etc/selinux/config
# SELINUX=disabled
SELINUX=disabled
# SELINUXTYPE= can take one of these three values:
SELINUXTYPE=targeted
[root@localhost ~]# setenforce 0
[root@localhost ~]# getenforce
Permissive
[root@localhost ~]# systemctl status firewalld
● firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; vendor preset: enabled)
   Active: active (running) since Sat 2022-04-23 12:21:01 CST; 3min 39s ago
     Docs: man:firewalld(1)
 Main PID: 1011 (firewalld)
    Tasks: 2 (limit: 24736)
   Memory: 30.5M
   CGroup: /system.slice/firewalld.service
           └─1011 /usr/libexec/platform-python -s /usr/sbin/firewalld --nofork --nopid

Apr 23 12:21:01 localhost.localdomain systemd[1]: Starting firewalld - dynamic firewall daemon...
Apr 23 12:21:01 localhost.localdomain systemd[1]: Started firewalld - dynamic firewall daemon.
Apr 23 12:21:01 localhost.localdomain firewalld[1011]: WARNING: AllowZoneDrifting is enabled. This is considered an insecure configuration option. It will be removed in a future release. Please consider di>
[root@localhost ~]#
[root@localhost ~]#
[root@localhost ~]# firewall-cmd --list-all
public (active)
  target: default
  icmp-block-inversion: no
  interfaces: ens160
  sources:
  services: cockpit dhcpv6-client ssh
  ports:
  protocols:
  forward: no
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
[root@localhost ~]#

```

## 上传脚本

### 脚本实例

JumperServer\others\jumper_bin_deploy.sh

```bash
#!/usr/bin/env bash
# 因为使用了国外网络，实际使用仁者见仁

Version=v2.21.0 #版本

function install_soft() {
    if command -v dnf > /dev/null; then
      dnf -q -y install "$1"
    elif command -v yum > /dev/null; then
      yum -q -y install "$1"
    elif command -v apt > /dev/null; then
      apt-get -qqy install "$1"
    elif command -v zypper > /dev/null; then
      zypper -q -n install "$1"
    elif command -v apk > /dev/null; then
      apk add -q "$1"
      command -v gettext >/dev/null || {
      apk add -q gettext-dev python2
    }
    else
      echo -e "[\033[31m ERROR \033[0m] Please install it first (请先安装) $1 "
      exit 1
    fi
}

function prepare_install() {
  for i in curl wget tar; do
    command -v $i &>/dev/null || install_soft $i
  done
}

function get_installer() {
  echo "download install script to /opt/jumpserver-installer-${Version} (开始下载安装脚本到 /opt/jumpserver-installer-${Version})"
  cd /opt || exit 1
  if [ ! -d "/opt/jumpserver-installer-${Version}" ]; then
    timeout 60 wget -qO jumpserver-installer-${Version}.tar.gz https://github.com/jumpserver/installer/releases/download/${Version}/jumpserver-installer-${Version}.tar.gz || {
      rm -rf /opt/jumpserver-installer-${Version}.tar.gz
      echo -e "[\033[31m ERROR \033[0m] Failed to download jumpserver-installer-${Version} (下载 jumpserver-installer-${Version} 失败, 请检查网络是否正常或尝试重新执行脚本)"
      exit 1
    }
    tar -xf /opt/jumpserver-installer-${Version}.tar.gz -C /opt || {
      rm -rf /opt/jumpserver-installer-${Version}
      echo -e "[\033[31m ERROR \033[0m] Failed to unzip jumpserver-installer-${Version} (解压 jumpserver-installer-${Version} 失败, 请检查网络是否正常或尝试重新执行脚本)"
      exit 1
    }
    rm -rf /opt/jumpserver-installer-${Version}.tar.gz
  fi
}

function config_installer() {
  cd /opt/jumpserver-installer-${Version} || exit 1
  shopt -s expand_aliases
  if [[ $(uname) == 'Darwin' ]]; then
    alias sedi='sed -i ""'
  else
    alias sedi='sed -i'
  fi
  sed -i "s/VERSION=.*/VERSION=${Version}/g" /opt/jumpserver-installer-${Version}/static.env
  ./jmsctl.sh install
  ./jmsctl.sh start
}

function main(){
  prepare_install
  get_installer
  config_installer
}

main

```



### 脚本运行过程





- 注意第23行，出现错误，这个是因为官方脚本不对，需要修改sed -i 
- 

```bash
[root@localhost ~]# ls -l
total 8
-rw-------. 1 root root 1154 Apr 23 12:20 anaconda-ks.cfg
-rw-r--r--. 1 root root 2249 Apr 23 12:28 jumper_bin_deploy.sh
[root@localhost ~]#
[root@localhost ~]#
[root@localhost ~]# chmod +x jumper_bin_deploy.sh
[root@localhost ~]# ls -l
total 8
-rw-------. 1 root root 1154 Apr 23 12:20 anaconda-ks.cfg
-rwxr-xr-x. 1 root root 2249 Apr 23 12:28 jumper_bin_deploy.sh
[root@localhost ~]# ./jumper_bin_deploy.sh
Importing GPG key 0x6D745A60:
 Userid     : "Release Engineering <infrastructure@rockylinux.org>"
 Fingerprint: 7051 C470 A929 F454 CEBE 37B7 15AF 5DAC 6D74 5A60
 From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-rockyofficial

Installed:
  libmetalink-0.1.3-7.el8.x86_64                                                                           wget-1.19.5-10.el8.x86_64

download install script to /opt/jumpserver-installer-v2.21.0 (开始下载安装脚本到 /opt/jumpserver-installer-v2.21.0)

Redirecting output to ‘wget-log’.
./jumper_bin_deploy.sh: line 58: sedi: command not found


       ██╗██╗   ██╗███╗   ███╗██████╗ ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗
       ██║██║   ██║████╗ ████║██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
       ██║██║   ██║██╔████╔██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
  ██   ██║██║   ██║██║╚██╔╝██║██╔═══╝ ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
  ╚█████╔╝╚██████╔╝██║ ╚═╝ ██║██║     ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
   ╚════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝

                                                                   Version:  v2.21.0

1. Check Configuration File
Path to Configuration file: /opt/jumpserver/config
/opt/jumpserver/config/config.txt  [ √ ]
/opt/jumpserver/config/nginx/cert/server.crt   [ √ ]
/opt/jumpserver/config/nginx/cert/server.key   [ √ ]
complete

>>> Install and Configure Docker
1. Install Docker
Starting to download Docker engine ...
Starting to download Docker Compose binary ...
complete

2. Configure Docker
Do you want to support IPv6? (y/n)  (default n): n
complete

3. Start Docker
Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /etc/systemd/system/docker.service.
^C
[root@localhost ~]# ^C
[root@localhost ~]# ^C
作如下修改

function config_installer() {
  cd /opt/jumpserver-installer-${Version} || exit 1
  shopt -s expand_aliases
  if [[ $(uname) == 'Darwin' ]]; then
    alias sedi='sed -i ""'
  else
    alias sedi='sed -i'
  fi
  sed - i "s/VERSION=.*/VERSION=${Version}/g" /opt/jumpserver-installer-${Version}/static.env
  ./jmsctl.sh install
  ./jmsctl.sh start
}


如果因为网络问题可以多跑几次
[root@localhost ~]# ./jumper_bin_deploy.sh
download install script to /opt/jumpserver-installer-v2.21.0 (开始下载安装脚本到 /opt/jumpserver-installer-v2.21.0)
sed: -e expression #1, char 1: unknown command: `-'


       ██╗██╗   ██╗███╗   ███╗██████╗ ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗
       ██║██║   ██║████╗ ████║██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
       ██║██║   ██║██╔████╔██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
  ██   ██║██║   ██║██║╚██╔╝██║██╔═══╝ ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
  ╚█████╔╝╚██████╔╝██║ ╚═╝ ██║██║     ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
   ╚════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝

                                                                   Version:  v2.21.0

1. Check Configuration File
Path to Configuration file: /opt/jumpserver/config
/opt/jumpserver/config/config.txt  [ √ ]
/opt/jumpserver/config/core/config.yml  [ √ ]
/opt/jumpserver/config/koko/config.yml  [ √ ]
/opt/jumpserver/config/mariadb/mariadb.cnf  [ √ ]
/opt/jumpserver/config/mysql/my.cnf  [ √ ]
/opt/jumpserver/config/nginx/lb_http_server.conf  [ √ ]
/opt/jumpserver/config/redis/redis.conf  [ √ ]
/opt/jumpserver/config/nginx/cert/server.crt   [ √ ]
/opt/jumpserver/config/nginx/cert/server.key   [ √ ]
complete

>>> Install and Configure Docker
1. Install Docker
complete

2. Configure Docker
Do you want to support IPv6? (y/n)  (default n):
complete

3. Start Docker
complete

>>> Loading Docker Image
[jumpserver/redis:6-alpine]
6-alpine: Pulling from jumpserver/redis
Digest: sha256:8300b885570faad626e569e7b8cfef3407c87050d705ff26e243200cb3f84da8
Status: Image is up to date for jumpserver/redis:6-alpine
docker.io/jumpserver/redis:6-alpine

[jumpserver/mysql:5]
5: Pulling from jumpserver/mysql
Digest: sha256:b3b2703de646600b008cbb2de36b70b21e51e7e93a7fca450d2b08151658b2dd
Status: Image is up to date for jumpserver/mysql:5
docker.io/jumpserver/mysql:5

[jumpserver/web:v2.21.0]
v2.21.0: Pulling from jumpserver/web
Digest: sha256:1fdbb613c610b1a9131d586716a98d8655fe7022b2ef9376aca35601b3f7a697
Status: Image is up to date for jumpserver/web:v2.21.0
docker.io/jumpserver/web:v2.21.0

[jumpserver/core:v2.21.0]
v2.21.0: Pulling from jumpserver/core
Digest: sha256:9d71ab8155c80f30af2c29ed4c93b738a2f05589259e5f3f06a111aaae8f44b8
Status: Image is up to date for jumpserver/core:v2.21.0
docker.io/jumpserver/core:v2.21.0

[jumpserver/koko:v2.21.0]
v2.21.0: Pulling from jumpserver/koko
a2abf6c4d29d: Already exists
2c1a7e91d4e4: Pull complete
96de146d0b8c: Pull complete
b4f8dcc8c180: Pull complete
d04025369df5: Pull complete
ff7eca95c753: Pull complete
9ed1a3e05bfa: Pull complete
76f894474555: Pull complete
f55ed9d8f2da: Pull complete
6754e6167f39: Pull complete
187761dc098e: Pull complete
3bc030919db1: Pull complete
Digest: sha256:32636524d6395ef645dc931cebd83f1617417786f32ef7537d07d14920ce7454
Status: Downloaded newer image for jumpserver/koko:v2.21.0
docker.io/jumpserver/koko:v2.21.0

[jumpserver/lion:v2.21.0]
v2.21.0: Pulling from jumpserver/lion
72a69066d2fe: Pull complete
01971ece8edb: Pull complete
00efad7f1f86: Pull complete
ac262804a75a: Pull complete
0688de3fd063: Pull complete
2e94ff443643: Pull complete
d4b1196ea6e9: Pull complete
f7b6cdb41d27: Pull complete
15b59ceecb8f: Pull complete
a1a72a5d006a: Pull complete
104f6af46917: Pull complete
734049daf1ee: Pull complete
872a952e8fc8: Pull complete
54365e38ac80: Pull complete
462e43406301: Pull complete
Digest: sha256:0c0c4ebacf2641843bebd34493d0b53813e51c5d6bbeda2fc2d2c3771739e8d4
Status: Downloaded newer image for jumpserver/lion:v2.21.0
docker.io/jumpserver/lion:v2.21.0

[jumpserver/magnus:v2.21.0]
v2.21.0: Pulling from jumpserver/magnus
a2abf6c4d29d: Already exists
dd890438b467: Pull complete
7089ae322f82: Pull complete
870d44bc43dd: Pull complete
500ad50c6bd6: Pull complete
f7a09e01efd6: Pull complete
Digest: sha256:edee98923b5fc3081aa49f66ce045c087ed6467764b88ba2478d5fe471c92bba
Status: Downloaded newer image for jumpserver/magnus:v2.21.0
docker.io/jumpserver/magnus:v2.21.0

complete

>>> Install and Configure JumpServer
1. Configure Private Key
SECRETE_KEY:     OWIxMjRkNTYtY2I1NC0zNDhkLTlmMDYtYWIxODViOTE5MGVk
BOOTSTRAP_TOKEN: OWIxMjRkNTYtY2I1NC0zNDhk
complete

2. Configure Persistent Directory
Do you need custom persistent store, will use the default directory /opt/jumpserver? (y/n)  (default n): y

To modify the persistent directory such as logs video, you can select your largest disk and create a directory in it, such as /data/jumpserver
Note: you can not change it after installation, otherwise the database may be lost

Filesystem           Size  Used Avail Use% Mounted on

Persistent storage directory (default /opt/jumpserver):
complete

3. Configure MySQL
Do you want to use external MySQL? (y/n)  (default n):
complete

4. Configure Redis
Do you want to use external Redis? (y/n)  (default n):
complete

5. Configure External Port
Do you need to customize the JumpServer external port? (y/n)  (default n):
complete

6. Init JumpServer Database
Creating network "jms_net" with driver "bridge"
Creating jms_mysql ... done
Creating jms_redis ... done
Creating jms_core  ... done
2022-04-23 13:13:51 Collect static files
2022-04-23 13:13:51 Collect static files done
2022-04-23 13:13:51 Check database structure change ...
2022-04-23 13:13:51 Migrate model change to database ...
Operations to perform:
  Apply all migrations: acls, admin, applications, assets, audits, auth, authentication, captcha, common, contenttypes, django_cas_ng, django_celery_beat, jms_oidc_rp, notifications, ops, orgs, perms, rbac, sessions, settings, terminal, tickets, users
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
......
Fill ticket serial number ... 0 OK
  Applying tickets.0014_auto_20220217_2135... OK
  Applying tickets.0015_superticket... OK
  Applying users.0037_user_secret_key... OK
  Applying users.0038_auto_20211209_1140... OK
  Applying users.0039_auto_20211229_1852... OK
After migration, update builtin role permissions
complete

>>> The Installation is Complete
1. You can use the following command to start, and then visit
cd /opt/jumpserver-installer-v2.21.0
./jmsctl.sh start

2. Other management commands
./jmsctl.sh stop
./jmsctl.sh restart
./jmsctl.sh backup
./jmsctl.sh upgrade
For more commands, you can enter ./jmsctl.sh --help to understand

3. Web access
http://10.4.7.129:80
Default username: admin  Default password: admin
 
4. SSH/SFTP access
ssh -p2222 admin@10.4.7.129
sftp -P2222 admin@10.4.7.129

5. More information
Official Website: https://www.jumpserver.org/
Documentation: https://docs.jumpserver.org/


jms_redis is up-to-date
jms_mysql is up-to-date
Creating jms_core ... done
Creating jms_lion   ... done
Creating jms_celery ... done
Creating jms_magnus ... done
Creating jms_koko   ... done
Creating jms_web    ... done
[root@localhost ~]# docker ps
CONTAINER ID   IMAGE                       COMMAND                  CREATED              STATUS                            PORTS                                                                              NAMES
ae1497b2801d   jumpserver/web:v2.21.0      "/docker-entrypoint.…"   6 seconds ago        Up 4 seconds (health: starting)   0.0.0.0:80->80/tcp, :::80->80/tcp                                                  jms_web
86e2da92ec2d   jumpserver/magnus:v2.21.0   "./entrypoint.sh"        6 seconds ago        Up 4 seconds (health: starting)   0.0.0.0:33060-33061->33060-33061/tcp, :::33060-33061->33060-33061/tcp, 54320/tcp   jms_magnus
4ae17327680d   jumpserver/koko:v2.21.0     "./entrypoint.sh"        6 seconds ago        Up 4 seconds (health: starting)   0.0.0.0:2222->2222/tcp, :::2222->2222/tcp, 5000/tcp                                jms_koko
c296dca6f372   jumpserver/lion:v2.21.0     "./entrypoint.sh"        6 seconds ago        Up 4 seconds (health: starting)   4822/tcp                                                                           jms_lion
ca4b03a976bd   jumpserver/core:v2.21.0     "./entrypoint.sh sta…"   6 seconds ago        Up 4 seconds (health: starting)   8070/tcp, 8080/tcp                                                                 jms_celery
fb41c4e52bef   jumpserver/core:v2.21.0     "./entrypoint.sh sta…"   18 seconds ago       Up 17 seconds (healthy)           8070/tcp, 8080/tcp                                                                 jms_core
ab2adfdfd389   jumpserver/redis:6-alpine   "docker-entrypoint.s…"   About a minute ago   Up About a minute (healthy)       6379/tcp                                                                           jms_redis
c622150334e4   jumpserver/mysql:5          "docker-entrypoint.s…"   About a minute ago   Up About a minute (healthy)       3306/tcp, 33060/tcp                                                                jms_mysql
[root@localhost ~]# docker ps  -a
CONTAINER ID   IMAGE                       COMMAND                  CREATED              STATUS                            PORTS                                                                              NAMES
ae1497b2801d   jumpserver/web:v2.21.0      "/docker-entrypoint.…"   8 seconds ago        Up 5 seconds (health: starting)   0.0.0.0:80->80/tcp, :::80->80/tcp                                                  jms_web
86e2da92ec2d   jumpserver/magnus:v2.21.0   "./entrypoint.sh"        8 seconds ago        Up 5 seconds (health: starting)   0.0.0.0:33060-33061->33060-33061/tcp, :::33060-33061->33060-33061/tcp, 54320/tcp   jms_magnus
4ae17327680d   jumpserver/koko:v2.21.0     "./entrypoint.sh"        8 seconds ago        Up 6 seconds (health: starting)   0.0.0.0:2222->2222/tcp, :::2222->2222/tcp, 5000/tcp                                jms_koko
c296dca6f372   jumpserver/lion:v2.21.0     "./entrypoint.sh"        8 seconds ago        Up 6 seconds (health: starting)   4822/tcp                                                                           jms_lion
ca4b03a976bd   jumpserver/core:v2.21.0     "./entrypoint.sh sta…"   8 seconds ago        Up 6 seconds (health: starting)   8070/tcp, 8080/tcp                                                                 jms_celery
fb41c4e52bef   jumpserver/core:v2.21.0     "./entrypoint.sh sta…"   20 seconds ago       Up 19 seconds (healthy)           8070/tcp, 8080/tcp                                                                 jms_core
ab2adfdfd389   jumpserver/redis:6-alpine   "docker-entrypoint.s…"   About a minute ago   Up About a minute (healthy)       6379/tcp                                                                           jms_redis
c622150334e4   jumpserver/mysql:5          "docker-entrypoint.s…"   About a minute ago   Up About a minute (healthy)       3306/tcp, 33060/tcp                                                                jms_mysql
[root@localhost ~]#
[root@localhost ~]#
[root@localhost ~]# ls
anaconda-ks.cfg  jumper_bin_deploy.sh


```

