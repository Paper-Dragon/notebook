**案例需求**

通过prometheus监控MariaDB业务

**案例分析**
要监控mysql需要两个条件，一个是系统中有mysql，另一个是要有监控插件，现在监控插件我已经下载好了，所以我们要先安装mysql，然后进行相应的授权，让插件可以获取到所需要的信息，然后再设置相关插件，修改prometheus配置文件

## 案例实现

### a、部署mysql业务

```
[root@node2 node_exporter-0.18.1.linux-amd64]# dnf -y install mariadb-server mariadb
[root@node2 mysqld_exporter-0.12.0.linux-amd64]# systemctl enable mariadb
Created symlink from /etc/systemd/system/multi-user.target.wants/mariadb.service to /usr/lib/systemd/system/mariadb.service.
[root@node2 mysqld_exporter-0.12.0.linux-amd64]# systemctl start mariadb

#创建监控用户
MariaDB [(none)]> grant select,replication client,process on *.* to 'hello'@'localhost' identified by '123456';
Query OK, 0 rows affected (0.00 sec)

MariaDB [(none)]> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

### b、部署监控插件

```
[root@node2 ~]# tar xf mysqld_exporter-0.12.1.linux-amd64.tar.gz -C /usr/local
[root@node2 ~]# vim /usr/local/mysqld_exporter-0.12.1.linux-amd64/.my.cnf
[root@node2 ~]# cat /usr/local/mysqld_exporter-0.12.1.linux-amd64/.my.cnf
[client]
user=hello
password=123456

#启动
[root@node2 ~]# nohup /usr/local/mysqld_exporter-0.12.1.linux-amd64/mysqld_exporter --config.my-cnf=/usr/local/mysqld_exporter-0.12.1.linux-amd64/.my.cnf &

[root@node2 ~]# lsof -i :9104
COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
mysqld_ex 7698 root    3u  IPv6  46415      0t0  TCP *:peerwire (LISTEN)
```

### c、在prometheus主配置文件中添加监控

```
#
[root@node1 prometheus-2.11.1.linux-amd64]# tail -10 prometheus.yml 
    static_configs:
    - targets: ['localhost:9090']

  - job_name: 'node2'
    static_configs:
    - targets: ['192.168.98.202:9100']
  
  - job_name: 'mariadb'
    static_configs:
    - targets: ['192.168.98.202:9104']
```

### d、重启prometheus服务

```
[root@node1 prometheus-2.11.1.linux-amd64]# pkill prometheus
[root@node1 prometheus-2.11.1.linux-amd64]# ./prometheus --config.file=prometheus.yml &
```

### e、通过监控页面查看服务

![Prometheus_node2_mysql9.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603596540745.png)

通过Graph页面看看相关图表吧

![Prometheus_node2_mysql8.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603596551382.png)

出图了，可以勾选stacked将图形显示为堆叠状。