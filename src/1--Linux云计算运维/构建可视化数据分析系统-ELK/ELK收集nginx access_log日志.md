## 一、案例分析

公司为了每天都能够随时看到公司WEB业务的实时运行情况，希望运维通过分析access.log日志信息，实时展示一下数据给公司的运营部门：

- 统计不同返回值的数量
- 统计访问前5名的IP地址
- 统计每日PV
- 统计每日UV
- …….

## 二、nginx access_log定义json格式日志

- 部署nginx
- 设置nginx 访问日志为json格式

a、部署nginx服务

```
[root@node4 ~]# tar xf nginx-*.rpm
[root@node4 ~]# cd nginx-*.rpm
[root@node4 ~]# yum -y install pcre-devel zlib-devel gcc-*
[root@node4 ~]# ./configure --prefix=/usr/local
[root@node4 ~]# make
[root@node4 ~]# make install
```

b、设置nginx 访问日志为json格式

由于ES是基于json来处理数据的，所以给ES的数据就必须是JSON数据，只有这样才能通过json将数据进行分析、统计。为了能让ES能分析access.log日志，我们让nginx直接将该日志的格式设置为json格式。

```
[root@node4 ~]# vim /usr/local/nginx/conf/nginx.conf

log_format main_json '{"@timestamp":"$time_local",'
'"N_client_ip": "$remote_addr",'
'"N_request": "$request",'
'"N_request_time": "$request_time",'
'"N_status": "$status",'
'"N_bytes": "$body_bytes_sent",'
'"N_user_agent": "$http_user_agent",'
'"N_x_forwarded": "$http_x_forwarded_for",'
'"N_referer": "$http_referer"'
'}';

    access_log  logs/access.log  main_json;
```

## 三、日志收集

filebeat设置-修改配置文件定义日志收集

```
[root@node4 ~]# egrep -v "(#|^$)" /etc/filebeat/filebeat.yml 
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /usr/local/nginx/logs/access.log
  #添加以下两行，定义收集的是json日志
  json.keys_under_root: true
  json.overwrite_keys:  true
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.template.settings:
  index.number_of_shards: 1
setup.kibana:
  host: "192.168.98.200:5601"
output.logstash:
  hosts: ["192.168.98.203:5044"]
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
```

logstash设置-配置业务文件，接收Filebeat发送的数据，然后将数据发送给ES

```
[root@node3 conf.d]# cat f_to_e.conf 
input {
    beats {
        port => 5044
    }
}

output {
    elasticsearch {
        hosts => ["192.168.98.202:9200"]
        index => "nginx-%{+YYYY.MM.dd}"
    }
    stdout {
      codec => rubydebug
    }
}
```

#### kibana

创建索引，添加nginx数据

## 四、kibana展示

统计不同返回值的数量 饼图

统计访问前5名的IP地址 柱形图

统计每日PV 仪表盘

统计每日UV 计数
![52nginx_access.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978343835.png)