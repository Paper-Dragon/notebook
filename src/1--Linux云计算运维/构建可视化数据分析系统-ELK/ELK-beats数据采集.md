## 一、beats介绍

因为**logstash太费内存**了,如果在要采集的服务上都安装logstash,你可以想象这样这样资源消耗多高。所以我们要用**轻量级**的采集工具才更高效,更省资源。

![ELKfilebeat架构.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977321444.png)

beats是轻量级的日志收集处理工具，Beats占用资源少

- Packetbeat： 网络数据（收集网络流量数据）
- Metricbeat： 指标 （收集系统、进程和文件系统级别的 CPU 和内存使用情况等数据）
- Filebeat： 文件（收集日志文件数据）
- Winlogbeat： windows事件日志（收集 Windows 事件日志数据）
- Auditbeat：审计数据 （收集审计日志）
- Heartbeat：运行时间监控 （收集系统运行时的数据）

我们这里主要是收集日志信息, 所以只讨论filebeat。

filebeat可以直接将采集的日志数据传输给ES集群（EFK), 也可以给logstash(**5044**端口接收)。

## 二、 filebeat

**准备工作**

机器：node4(192.168.98.204)

```
部署前准备参考https://www.zutuanxue.com/home/4/52_138
```

**filebeat安装**

a、yum安装

b、rpm安装

c、源码安装

a、yum安装

如果你安装ES的时候设置过yum源可以直接使用yum命令:

```
 # yum -y install filebeat
```

b、rpm安装

```
[root@node4 ~]# rpm -i filebeat-7.6.0-x86_64.rpm 
警告：filebeat-7.6.0-x86_64.rpm: 头V4 RSA/SHA512 Signature, 密钥 ID d88e42b4: NOKEY

-i install
```

c、源码安装

```
参考官方手册
```

**相关文件及目录**

安装目录: /usr/share/filebeat

配置文件目录: /etc/filebeat

配置文件:/etc/filebeat/filebeat.yml

服务启动管理

```
[root@node4 ~]# systemctl enable filebeat
Synchronizing state of filebeat.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable filebeat
Created symlink /etc/systemd/system/multi-user.target.wants/filebeat.service → /usr/lib/systemd/system/filebeat.service.

#没有修改配置文件，起不来
[root@node4 ~]# systemctl start filebeat
```

## 三、filebeat配置文件

```
[root@node4 ~]# cat /etc/filebeat/filebeat.yml |grep -v '#' |grep -v '^$'
filebeat.inputs:
- type: log
  enabled: false			#默认false，修改为true
  paths:
    - /var/log/*.log		#收集日志的路径
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.template.settings:
  index.number_of_shards: 1
#定义kibana地址
setup.kibana:
#定义ES地址接收数据
output.elasticsearch:
  hosts: ["192.168.98.201:9200"]		
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~
```

## 四、收集日志给ES集群

**案例：filebeat收集本机messages日志到ES，通过ES-head查看**

**业务拓扑**

![FEK.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977445213.png)

```
注意：每做下一个实验前，建议大家把之前的索引数据清除，通过es-head，这样没有干扰，也好验证效果。否则那么多索引信息，对前期学习的你来说，干扰太多了。
```

a、设置filebeat配置文件

```
[root@node4 ~]# cat /etc/filebeat/filebeat.yml |grep -v '#' |grep -v '^$'
filebeat.inputs:
- type: log
  enabled: true			#默认false，修改为true
  paths:
    - /var/log/messages		#收集日志的路径
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.template.settings:
  index.number_of_shards: 1
#定义kibana地址
setup.kibana:
#定义ES地址接收数据
output.elasticsearch:
  hosts: ["192.168.98.201:9200"]		
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~
```

b、重启filebeat服务，生效配置

```
[root@node4 ~]# systemctl restart filebeat
```

c、通过ES-head验证日志收集

![31_es-filebeat验证](https://www.zutuanxue.com:8000%E6%9E%84%E5%BB%BA%E5%8F%AF%E8%A7%86%E5%8C%96%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E7%B3%BB%E7%BB%9F.assets/31_es-filebeat%E9%AA%8C%E8%AF%81.png)

**拓展：关于filebeat设置数据索引**

```
[root@node4 ~]# cat /etc/filebeat/filebeat.yml |grep -v '#' |grep -v '^$'
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/messages
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.template.settings:
  index.number_of_shards: 1
setup.kibana:
#在output.*输出全局中插入这行插入，下面三行
#禁用ilm
setup.ilm.enabled: false
#设置索引模板名
setup.template.name: "node4_messages"
#索引前缀
setup.template.pattern: "node4_messages-*"
output.elasticsearch:
  hosts: ["192.168.98.201:9200"]
  #定义索引
  index: "node4_messages-%{+yyyy.MM.dd}"
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~
```

## 五、收集日志给logstash

**案例：收集本机messages日志到logstash，通过ES-head查看,要求索引为zutuanxue_node4_messages**

**业务拓扑：**

![elk部署图3933846.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977492712.png)

**案例分析：**

a、设置filebeat配置文件，将采集的日志发送给logstash

b、logstash收到日志添加索引后给ES

c、ES-head验证

a、设置filebeat配置文件，将采集的日志发送给logstash

```
[root@node4 ~]# cat /etc/filebeat/filebeat.yml |grep -v '#' |grep -v '^$'
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/messages
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.template.settings:
  index.number_of_shards: 1
setup.kibana:
#定义输出到logstash
output.logstash:
  hosts: ["192.168.98.203:5044"]
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~
```

b、logstash收到日志添加索引后给ES

```
[root@node3 conf.d]# cat filebeat_to_logstash_es.conf 
input {
    beats {
        port => 5044
    }
}

output {
    elasticsearch {
        hosts => ["192.168.98.201:9200"]
        index => "zutuanxue_node4-%{+YYYY.MM.dd}"  #定义索引
    }
}
```

重启filebeat、logstash服务生效配置

```
[root@node4 ~]# systemctl restart filebeat
[root@node3 ~]# systemctl restart logstash
```

c、ES-head验证

![32_esheadfilebeat_logstat验证.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977514250.png)

完美，实验完成