# 二进制部署

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
  Applying auth.0001_initial... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying users.0001_initial... OK
  Applying users.0002_auto_20171225_1157_squashed_0019_auto_20190304_1459... OK
  Applying authentication.0001_initial... OK
  Applying authentication.0002_auto_20190729_1423... OK
  Applying authentication.0003_loginconfirmsetting... OK
  Applying authentication.0004_ssotoken... OK
  Applying acls.0001_initial... OK
  Applying acls.0002_auto_20210926_1047... OK
  Applying acls.0003_auto_20211130_1037... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying users.0020_auto_20190612_1825... OK
  Applying users.0021_auto_20190625_1104... OK
  Applying users.0022_auto_20190625_1105... OK
  Applying users.0023_auto_20190724_1525... OK
  Applying users.0024_auto_20191118_1612... OK
  Applying users.0025_auto_20200206_1216... OK
  Applying users.0026_auto_20200508_2105... OK
  Applying users.0027_auto_20200616_1503... OK
  Applying users.0028_auto_20200728_1805... OK
  Applying users.0029_auto_20200814_1650... OK
  Applying users.0030_auto_20200819_2041... OK
  Applying users.0031_auto_20201118_1801... OK
  Applying tickets.0001_initial... OK
  Applying tickets.0002_auto_20200728_1146... OK
  Applying tickets.0003_auto_20200804_1551... OK
  Applying tickets.0004_ticket_comment... OK
  Applying tickets.0005_ticket_meta_confirmed_system_users... OK
  Applying tickets.0006_auto_20201023_1628... OK
  Applying tickets.0007_auto_20201224_1821... OK
  Applying terminal.0001_initial... OK
  Applying terminal.0002_auto_20171228_0025_squashed_0009_auto_20180326_0957... OK
  Applying terminal.0010_auto_20180423_1140... OK
  Applying terminal.0011_auto_20180807_1116... OK
  Applying terminal.0012_auto_20180816_1652... OK
  Applying terminal.0013_auto_20181123_1113... OK
  Applying terminal.0014_auto_20181226_1441... OK
  Applying terminal.0015_auto_20190923_1529... OK
  Applying terminal.0016_commandstorage_replaystorage... OK
  Applying common.0001_initial... OK
  Applying common.0002_auto_20180111_1407... OK
  Applying common.0003_setting_category... OK
  Applying common.0004_setting_encrypted... OK
  Applying common.0005_auto_20190221_1902... OK
  Applying common.0006_auto_20190304_1515... OK
  Applying settings.0001_initial... OK
  Applying terminal.0017_auto_20191125_0931... OK
  Applying terminal.0018_auto_20191202_1010... OK
  Applying terminal.0019_auto_20191206_1000... OK
  Applying terminal.0020_auto_20191218_1721... OK
  Applying terminal.0021_auto_20200213_1316... OK
  Applying terminal.0022_session_is_success... OK
  Applying terminal.0023_command_risk_level... OK
  Applying terminal.0024_auto_20200715_1713... OK
  Applying terminal.0025_auto_20200810_1735... OK
  Applying terminal.0026_auto_20201027_1905... OK
  Applying terminal.0027_auto_20201102_1651... OK
  Applying terminal.0028_auto_20201110_1918... OK
  Applying terminal.0029_auto_20201116_1757... OK
  Applying terminal.0030_terminal_type... OK
  Applying terminal.0031_auto_20210113_1356... OK
  Applying assets.0001_initial... OK
  Applying perms.0001_initial... OK
  Applying assets.0002_auto_20180105_1807_squashed_0009_auto_20180307_1212... OK
  Applying assets.0010_auto_20180307_1749_squashed_0019_auto_20180816_1320... OK
  Applying perms.0002_auto_20171228_0025_squashed_0009_auto_20180903_1132... OK
  Applying perms.0003_action... OK
  Applying perms.0004_assetpermission_actions... OK
  Applying assets.0020_auto_20180816_1652... OK
  Applying assets.0021_auto_20180903_1132... OK
  Applying assets.0022_auto_20181012_1717... OK
  Applying assets.0023_auto_20181016_1650... OK
  Applying assets.0024_auto_20181219_1614... OK
  Applying assets.0025_auto_20190221_1902... OK
  Applying assets.0026_auto_20190325_2035... OK
  Applying applications.0001_initial... OK
  Applying perms.0005_auto_20190521_1619... OK
  Applying perms.0006_auto_20190628_1921... OK
  Applying perms.0007_remove_assetpermission_actions... OK
  Applying perms.0008_auto_20190911_1907... OK
  Applying assets.0027_auto_20190521_1703... OK
  Applying assets.0028_protocol... OK
  Applying assets.0029_auto_20190522_1114... OK
  Applying assets.0030_auto_20190619_1135... OK
  Applying assets.0031_auto_20190621_1332... OK
  Applying assets.0032_auto_20190624_2108... OK
  Applying assets.0033_auto_20190624_2108... OK
  Applying assets.0034_auto_20190705_1348... OK
  Applying assets.0035_auto_20190711_2018... OK
  Applying assets.0036_auto_20190716_1535... OK
  Applying assets.0037_auto_20190724_2002... OK
  Applying assets.0038_auto_20190911_1634... OK
  Applying perms.0009_remoteapppermission_system_users... OK
  Applying assets.0039_authbook_is_active... OK
  Applying assets.0040_auto_20190917_2056... OK
  Applying assets.0041_gathereduser... OK
  Applying assets.0042_favoriteasset... OK
  Applying assets.0043_auto_20191114_1111... OK
  Applying assets.0044_platform... OK
  Applying assets.0045_auto_20191206_1607... OK
  Applying assets.0046_auto_20191218_1705... OK
  Applying applications.0002_remove_remoteapp_system_user... OK
  Applying applications.0003_auto_20191210_1659... OK
  Applying applications.0004_auto_20191218_1705... OK
  Applying perms.0010_auto_20191218_1705... OK
  Applying perms.0011_auto_20200721_1739... OK
  Applying assets.0047_assetuser... OK
  Applying assets.0048_auto_20191230_1512... OK
  Applying assets.0049_systemuser_sftp_root... OK
  Applying assets.0050_auto_20200711_1740... OK
  Applying assets.0051_auto_20200713_1143... OK
  Applying assets.0052_auto_20200715_1535... OK
  Applying assets.0053_auto_20200723_1232... OK
  Applying assets.0054_auto_20200807_1032... OK
  Applying applications.0005_k8sapp... OK
  Applying perms.0012_k8sapppermission... OK
  Applying assets.0055_auto_20200811_1845... OK
  Applying assets.0056_auto_20200904_1751... OK
  Applying assets.0057_fill_node_value_assets_amount_and_parent_key...

  ................................................................. OK
  Applying perms.0013_rebuildusertreetask_usergrantedmappingnode... OK
  Applying perms.0014_build_users_perm_tree... OK
  Applying perms.0015_auto_20200929_1728... OK
  Applying assets.0058_auto_20201023_1115... OK
  Applying assets.0059_auto_20201027_1905... OK
  Applying applications.0006_application... OK
  Applying perms.0016_applicationpermission... OK
  Applying perms.0017_auto_20210104_0435... OK
  Applying assets.0060_node_full_value...
- Start migrate node value if has /
- Start migrate node full value
 OK
  Applying assets.0061_auto_20201116_1757... OK
  Applying assets.0062_auto_20201117_1938... OK
  Applying assets.0063_migrate_default_node_key...
Check old default node `key=0 value=Default` not exists
 OK
  Applying assets.0064_auto_20201203_1100... OK
  Applying assets.0065_auto_20210121_1549... OK
  Applying perms.0018_auto_20210208_1515... OK
  Applying orgs.0001_initial... OK
  Applying orgs.0002_auto_20180903_1132... OK
  Applying orgs.0003_auto_20190916_1057... OK
  Applying orgs.0004_organizationmember... OK
  Applying orgs.0005_auto_20200721_1937... OK
  Applying orgs.0006_auto_20200721_1937... OK
  Applying orgs.0007_auto_20200728_1805... OK
  Applying orgs.0008_auto_20200819_2041... OK
  Applying orgs.0009_auto_20201023_1628... OK
  Applying ops.0001_initial... OK
  Applying ops.0002_celerytask... OK
  Applying ops.0003_auto_20181207_1744... OK
  Applying ops.0004_adhoc_run_as... OK
  Applying ops.0005_auto_20181219_1807... OK
  Applying ops.0006_auto_20190318_1023... OK
  Applying ops.0007_auto_20190724_2002... OK
  Applying ops.0008_auto_20190919_2100... OK
  Applying ops.0009_auto_20191217_1713... OK
  Applying ops.0010_auto_20191217_1758... OK
  Applying ops.0011_auto_20200106_1534... OK
  Applying ops.0012_auto_20200108_1659... OK
  Applying ops.0013_auto_20200108_1706... OK
  Applying ops.0014_auto_20200108_1749... OK
  Applying ops.0015_auto_20200108_1809... OK
  Applying ops.0016_commandexecution_org_id... OK
  Applying ops.0017_auto_20200306_1747... OK
  Applying ops.0018_auto_20200509_1434... OK
  Applying ops.0019_adhocexecution_celery_task_id... OK
  Applying audits.0001_initial... OK
  Applying audits.0002_ftplog_org_id... OK
  Applying audits.0003_auto_20180816_1652... OK
  Applying audits.0004_operatelog_passwordchangelog_userloginlog... OK
  Applying audits.0005_auto_20190228_1715... OK
  Applying audits.0006_auto_20190726_1753... OK
  Applying audits.0007_auto_20191202_1010... OK
  Applying audits.0008_auto_20200508_2105... OK
  Applying audits.0009_auto_20200624_1654... OK
  Applying audits.0010_auto_20200811_1122... OK
  Applying audits.0011_userloginlog_backend... OK
  Applying assets.0066_auto_20210208_1802... OK
  Applying applications.0007_auto_20201119_1110... OK
  Applying applications.0008_auto_20210104_0435... OK
  Applying orgs.0010_auto_20210219_1241...
Migrate model org id: Application done, use 0.99 ms
Migrate model org id: AdminUser done, use 0.9 ms
Migrate model org id: Asset done, use 1.06 ms
Migrate model org id: AuthBook done, use 1.12 ms
Migrate model org id: CommandFilter done, use 0.83 ms
Migrate model org id: CommandFilterRule done, use 0.8 ms
Migrate model org id: Domain done, use 0.69 ms
Migrate model org id: Gateway done, use 0.81 ms
Migrate model org id: GatheredUser done, use 0.69 ms
Migrate model org id: Label done, use 0.78 ms
Migrate model org id: Node done, use 0.79 ms
Migrate model org id: SystemUser done, use 0.74 ms
Migrate model org id: FTPLog done, use 0.88 ms
Migrate model org id: OperateLog done, use 0.72 ms
Migrate model org id: AdHoc done, use 0.71 ms
Migrate model org id: AdHocExecution done, use 0.66 ms
Migrate model org id: CommandExecution done, use 0.74 ms
Migrate model org id: Task done, use 0.9 ms
Migrate model org id: ApplicationPermission done, use 0.71 ms
Migrate model org id: AssetPermission done, use 0.7 ms
Migrate model org id: UserAssetGrantedTreeNodeRelation done, use 0.74 ms
Migrate model org id: Session done, use 0.74 ms
Migrate model org id: Command done, use 0.73 ms
Migrate model org id: Ticket done, use 0.73 ms
Migrate model org id: UserGroup done, use 0.77 ms
Will add users to default org: 1
Add users to default org: 1-1
done, use 3.72 ms
 OK
  Applying assets.0067_auto_20210311_1113... OK
  Applying assets.0068_auto_20210312_1455... OK
  Applying assets.0069_change_node_key0_to_key1...
--> Not exist key=0 nodes, do nothing.
 OK
  Applying assets.0070_auto_20210426_1515... OK
  Applying assets.0071_systemuser_type...
 OK
  Applying assets.0072_historicalauthbook...
 OK
  Applying assets.0073_auto_20210606_1142...

 OK
  Applying assets.0074_remove_systemuser_assets... OK
  Applying assets.0075_auto_20210705_1759... OK
  Applying assets.0076_delete_assetuser... OK
  Applying applications.0009_applicationuser... OK
  Applying applications.0010_appaccount_historicalappaccount... OK
  Applying applications.0011_auto_20210826_1759... OK
  Applying applications.0012_auto_20211014_2209... OK
  Applying applications.0013_auto_20211026_1711... OK
  Applying applications.0014_auto_20211105_1605... OK
  Applying applications.0015_auto_20220112_2035... OK
  Applying applications.0016_auto_20220118_1455... OK
  Applying applications.0017_auto_20220217_2135... OK
  Applying applications.0018_auto_20220223_1539... OK
  Applying applications.0019_auto_20220310_1853... OK
  Applying applications.0020_auto_20220316_2028... OK
  Applying assets.0077_auto_20211012_1642... OK
  Applying assets.0078_auto_20211014_2209... OK
  Applying assets.0079_auto_20211102_1922... OK
  Applying assets.0080_auto_20211104_1347... OK
  Applying assets.0081_auto_20211105_1605... OK
  Applying assets.0082_auto_20211209_1440... OK
  Applying assets.0083_auto_20211215_1436... OK
  Applying assets.0084_auto_20220112_1959... OK
  Applying assets.0085_commandfilterrule_ignore_case... OK
  Applying assets.0086_auto_20220217_2135... OK
  Applying assets.0087_auto_20220223_1539... OK
  Applying assets.0088_auto_20220303_1612... OK
  Applying assets.0089_auto_20220310_0616... OK
  Applying assets.0090_auto_20220412_1145... OK
  Applying audits.0012_auto_20210414_1443... OK
  Applying audits.0013_auto_20211130_1037... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying authentication.0005_delete_loginconfirmsetting... OK
  Applying authentication.0006_auto_20211227_1059... OK
  Applying authentication.0007_connectiontoken... OK
  Applying authentication.0008_superconnectiontoken... OK
  Applying authentication.0009_auto_20220310_0616... OK
  Applying authentication.0010_temptoken... OK
  Applying captcha.0001_initial... OK
  Applying django_cas_ng.0001_initial... OK
  Applying django_celery_beat.0001_initial... OK
  Applying django_celery_beat.0002_auto_20161118_0346... OK
  Applying django_celery_beat.0003_auto_20161209_0049... OK
  Applying django_celery_beat.0004_auto_20170221_0000... OK
  Applying django_celery_beat.0005_add_solarschedule_events_choices... OK
  Applying django_celery_beat.0006_auto_20180322_0932... OK
  Applying django_celery_beat.0007_auto_20180521_0826... OK
  Applying django_celery_beat.0008_auto_20180914_1922... OK
  Applying django_celery_beat.0006_auto_20180210_1226... OK
  Applying django_celery_beat.0006_periodictask_priority... OK
  Applying django_celery_beat.0009_periodictask_headers... OK
  Applying django_celery_beat.0010_auto_20190429_0326... OK
  Applying django_celery_beat.0011_auto_20190508_0153... OK
  Applying django_celery_beat.0012_periodictask_expire_seconds... OK
  Applying django_celery_beat.0013_auto_20200609_0727... OK
  Applying django_celery_beat.0014_remove_clockedschedule_enabled... OK
  Applying django_celery_beat.0015_edit_solarschedule_events_choices... OK
  Applying jms_oidc_rp.0001_initial... OK
  Applying users.0032_userpasswordhistory... OK
  Applying users.0033_user_need_update_password... OK
  Applying users.0034_auto_20210506_1448... OK
  Applying users.0035_auto_20210526_1100... OK
  Applying users.0036_user_feishu_id... OK
  Applying notifications.0001_initial... OK
  Applying notifications.0002_auto_20210909_1946...
  Init user message subscription: 1
 OK
  Applying ops.0020_adhoc_run_system_user... OK
  Applying ops.0021_auto_20211130_1037... OK
  Applying rbac.0001_initial... OK
  Applying rbac.0002_auto_20210929_1409... OK
  Applying rbac.0003_auto_20211130_1037...Update builtin Role: SystemAdmin - True
Update builtin Role: SystemAuditor - True
Update builtin Role: SystemComponent - True
Update builtin Role: User - True
Update builtin Role: OrgAdmin - True
Update builtin Role: OrgAuditor - True
Update builtin Role: OrgUser - True
 OK
  Applying rbac.0004_auto_20211201_1901... OK
  Applying orgs.0011_auto_20211223_1913... OK
  Applying orgs.0012_auto_20220118_1054... OK
  Applying perms.0019_auto_20210906_1044... OK
  Applying perms.0020_auto_20210910_1103... OK
  Applying perms.0021_auto_20211105_1605... OK
  Applying perms.0022_applicationpermission_actions... OK
  Applying perms.0023_auto_20220112_2035... OK
  Applying perms.0024_auto_20220217_2135... OK
  Applying perms.0025_auto_20220223_1539... OK
  Applying perms.0026_auto_20220307_1500... OK
  Applying perms.0027_auto_20220310_1802... OK
  Applying perms.0028_auto_20220316_2028... OK
  Applying rbac.0005_auto_20220307_1524... OK
  Applying rbac.0006_auto_20220310_0616... OK
  Applying rbac.0007_auto_20220314_1525... OK
  Applying rbac.0008_auto_20220411_1709... OK
  Applying rbac.0009_auto_20220411_1724... OK
  Applying sessions.0001_initial... OK
  Applying settings.0002_auto_20210729_1546... OK
  Applying settings.0003_auto_20210901_1035... OK
  Applying settings.0004_auto_20220211_1401... OK
  Applying settings.0005_auto_20220310_0616... OK
  Applying terminal.0032_auto_20210302_1853... OK
  Applying terminal.0033_auto_20210324_1008... OK
  Applying terminal.0034_auto_20210406_1434... OK
  Applying terminal.0035_auto_20210517_1448... OK
  Applying terminal.0036_auto_20210604_1124... OK
  Applying terminal.0037_auto_20210623_1748... OK
  Applying terminal.0038_task_kwargs... OK
  Applying terminal.0039_auto_20210805_1552... OK
  Applying terminal.0040_sessionjoinrecord_sessionsharing... OK
  Applying terminal.0041_auto_20211105_1605... OK
  Applying terminal.0042_auto_20211229_1619... OK
  Applying terminal.0043_auto_20220217_2135... OK
  Applying terminal.0044_auto_20220223_1539... OK
  Applying terminal.0045_auto_20220228_1144... OK
  Applying terminal.0046_auto_20220228_1744... OK
  Applying terminal.0047_auto_20220302_1951... OK
  Applying terminal.0048_endpoint_endpointrule... OK
  Applying tickets.0008_auto_20210311_1113... OK
  Applying tickets.0009_auto_20210426_1720... OK
  Applying tickets.0010_auto_20210812_1618... OK
  Applying tickets.0011_remove_approvalrule_assignees_display... OK
  Applying tickets.0012_ticketsession... OK
  Applying tickets.0013_ticket_serial_num...
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

