## 案例分析

开发和DBA为了能够实时掌握mysql的运行情况，需要对mysql中执行的sql指令大于1秒的统计出来，并且通过ELK分析，统计，实时查看。通过分析可以让DBA能够优化数据库，能够提升运行速度。

## 一、MySQL设置

**a、mysql安装**

```
安装脚本
```

mysql默认root密码更改

```
[root@node4 mysql]# mysql_secure_installation
```

**b、mysql slow日志开启**

```
#开启slow log
slow_query_log=1
slow_query_log_file=/usr/local/mysql/mysql-slow.log
long-query-time=1

#允许使用Load data命令
secure_file_priv=''
```

重启mysql生效

```
[root@node4 mysql]# /etc/init.d/mysql.server restart
Shutting down MySQL.. SUCCESS! 
Starting MySQL. SUCCESS!
```

**c、生成测试数据**

```
[root@node4 mysql]# seq 1 10000000 > /tmp/big
```

导入数据

```
mysql> create table db1.t1(id int(11));
mysql> load data infile '/tmp/big' into table db1.t1;
Query OK, 10000000 rows affected (21.73 sec)
Records: 10000000  Deleted: 0  Skipped: 0  Warnings: 0
```

生成slow日志

```
mysql> select * from db1.t1 where id=8;
+------+
| id   |
+------+
|    8 |
+------+
1 row in set (3.46 sec)
```

查看slow 日志

```
[root@node4 mysql]# cat mysql-slow.log 
/usr/local/mysql/bin/mysqld, Version: 5.7.28-log (MySQL Community Server (GPL)). started with:
Tcp port: 0  Unix socket: /tmp/mysql.sock
Time                 Id Command    Argument
/usr/local/mysql/bin/mysqld, Version: 5.7.28-log (MySQL Community Server (GPL)). started with:
Tcp port: 0  Unix socket: /tmp/mysql.sock
Time                 Id Command    Argument
# Time: 2020-02-18T13:15:34.406907Z
# User@Host: root[root] @ localhost []  Id:     2
# Query_time: 21.729690  Lock_time: 0.005813 Rows_sent: 0  Rows_examined: 0
SET timestamp=1582031734;
load data infile '/tmp/big' into table db1.t1;
# Time: 2020-02-18T13:16:03.022224Z
# User@Host: root[root] @ localhost []  Id:     2
# Query_time: 3.458640  Lock_time: 0.004334 Rows_sent: 1  Rows_examined: 10000000
SET timestamp=1582031763;
select * from db1.t1 where id=8;
# Time: 2020-02-18T13:23:11.893639Z
# User@Host: root[root] @ localhost []  Id:     3
# Query_time: 3.583976  Lock_time: 0.000412 Rows_sent: 1  Rows_examined: 10000000
SET timestamp=1582032191;
select * from db1.t1 where id=88;
# Time: 2020-02-18T13:23:17.347380Z
# User@Host: root[root] @ localhost []  Id:     3
# Query_time: 3.557843  Lock_time: 0.000113 Rows_sent: 1  Rows_examined: 10000000
SET timestamp=1582032197;
select * from db1.t1 where id=888;
# Time: 2020-02-18T13:23:22.470483Z
# User@Host: root[root] @ localhost []  Id:     3
# Query_time: 3.498105  Lock_time: 0.000173 Rows_sent: 1  Rows_examined: 10000000
SET timestamp=1582032202;
select * from db1.t1 where id=8888;
```

## 二、数据收集

\###a、mysql slow日志格式整理收集

通过filebeat多行模式收集mysql slow日志

```
[root@node4 ~]# egrep -v "^#|^$|  #" /etc/filebeat/filebeat.yml 
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /usr/local/mysql/mysql-slow.log
  #开启多行收集
  multiline.pattern: "^# User@Host:"
  multiline.negate: true
  multiline.match: after
  
filebeat.config.modules:
  path: ${path.config}/modules.d/*.yml
  reload.enabled: false
setup.template.settings:
  index.number_of_shards: 1
setup.kibana:
output.logstash:
   hosts: ["192.168.98.203:5044"]
processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~

参数说明
multiline.pattern：正则表达式，去匹配指定的一行，这里去匹配的以“# User@Host:”开头的那一行；
multiline.negate：取值true 或 false；
默认是false，就是将multiline.pattern匹配到的那一行合并到上一行；
如果配置是true，就是将除了multiline.pattern匹的那一行的其他所有行合并到其上一行；
multiline.match：after 或 before，就是指定将要合并到上一行的内容，合并到上一行的末尾或开头；
```

logstash中的数据是这样存储的

```
{
          "host" => {
             "hostname" => "node4",
                 "name" => "node4",
                   "os" => {
              "family" => "redhat",
                "name" => "CentOS Linux",
              "kernel" => "4.18.0-80.el8.x86_64",
            "codename" => "Core",
             "version" => "8 (Core)",
            "platform" => "centos"
        },
        "containerized" => false,
                   "id" => "d8100d9fc21041ae9364bbb1ca84da02",
         "architecture" => "x86_64"
    },
           "log" => {
        "offset" => 4629,
          "file" => {
            "path" => "/usr/local/mysql/mysql-slow.log"
        }
    },
          "tags" => [
        [0] "beats_input_codec_plain_applied"
    ],
    "@timestamp" => 2020-02-19T02:50:06.763Z,
         "input" => {
        "type" => "log"
    },
    	#这里有一个message行，记录了时间
       "message" => "# Time: 2020-02-19T02:50:05.740090Z",
           "ecs" => {
        "version" => "1.4.0"
    },
         "agent" => {
            "hostname" => "node4",
                "type" => "filebeat",
        "ephemeral_id" => "3736821d-5c17-429a-a8af-0a9b28ba87b7",
             "version" => "7.6.0",
                  "id" => "060fdb52-cc79-463e-9cbf-f7d8fee5db89"
    },
      "@version" => "1"
}
{
           "log" => {
          "file" => {
            "path" => "/usr/local/mysql/mysql-slow.log"
        },
        "offset" => 4665,
         "flags" => [
            [0] "multiline"
        ]
    },
          "host" => {
             "hostname" => "node4",
                 "name" => "node4",
                   "os" => {
              "family" => "redhat",
                "name" => "CentOS Linux",
              "kernel" => "4.18.0-80.el8.x86_64",
            "codename" => "Core",
             "version" => "8 (Core)",
            "platform" => "centos"
        },
        "containerized" => false,
                   "id" => "d8100d9fc21041ae9364bbb1ca84da02",
         "architecture" => "x86_64"
    },
          "tags" => [
        [0] "beats_input_codec_plain_applied"
    ],
    "@timestamp" => 2020-02-19T02:50:06.763Z,
         "input" => {
        "type" => "log"
    },
       ####看这里message!mysql slow日志这样才的
       "message" => "# User@Host: root[root] @ localhost []  Id:     2\n# Query_time: 4.764090  Lock_time: 0.001112 Rows_sent: 1  Rows_examined: 10000000\nSET timestamp=1582080605;\nselect * from db1.t1 where id=1;",
           "ecs" => {
        "version" => "1.4.0"
    },
         "agent" => {
            "hostname" => "node4",
                "type" => "filebeat",
             "version" => "7.6.0",
        "ephemeral_id" => "3736821d-5c17-429a-a8af-0a9b28ba87b7",
                  "id" => "060fdb52-cc79-463e-9cbf-f7d8fee5db89"
    },
      "@version" => "1"
}
```

**b、使用grok插件格式化数据**

**grok**是一种采用组合多个预定义的正则表达式，用来匹配分割文本并映射到关键字的工具。通常用来对日志数据进行预处理。logstash的filter模块中grok插件是其实现之一。

处理思路：

```
1、第一个message数据行，没有用到，删除；
2、第二个message数据行的数据做json格式；
3、时间根据第二个message数据行中的时间戳转换；
4、数据已经做成json格式了，自然第二个message也没用了，删除第二个message行；
```

**通过不断测试，查看Logstash中的数据存储**

1、第一个message数据行，没有用到，删除；

2、第二个message数据行的数据做json格式；

3、时间根据第二个message数据行中的时间戳转换；

```
filter {
#2、将第二个message数据格式化为json格斯
grok {
        match => [ "message", "(?m)^# User@Host: %{USER:query_user}\[[^\]]+\] @ (?:(?<query_host>\S*) )?\[(?:%{IP:query_ip})?\]\s+Id:\s+%{NUMBER:row_id:int}\s*# Query_time: %{NUMBER:query_time:float}\s+Lock_time: %{NUMBER:lock_time:float}\s+Rows_sent: %{NUMBER:rows_sent:int}\s+Rows_examined: %{NUMBER:rows_examined:int}\s*(?:use %{DATA:database};\s*)?SET timestamp=%{NUMBER:timestamp};\s*(?<query>(?<action>\w+)\s+.*)" ]
    }

#1、匹配"message" => "# Time: "数据行[第一个message]，添加一个标签 drop
grok {
        match => { "message" => "# Time: " }
        add_tag => [ "drop" ]
        tag_on_failure => []
    }

#1、删除标签为drop的数据行
    if  "drop" in [tags] {
        drop {}
    }

#3、匹配message中的时间戳，根据亚洲/上海的格式生成本地时间
    date {
        match => ["mysql.slowlog.timestamp", "UNIX", "YYYY-MM-dd HH:mm:ss"]
        target => "@timestamp"
        timezone => "Asia/Shanghai"
    }
    ruby {
        code => "event.set('[@metadata][today]', Time.at(event.get('@timestamp').to_i).localtime.strftime('%Y.%m.%d'))"
    }



}
```

**logstash中数据存储**

```
{
            "agent" => {
        "ephemeral_id" => "3736821d-5c17-429a-a8af-0a9b28ba87b7",
                "type" => "filebeat",
            "hostname" => "node4",
             "version" => "7.6.0",
                  "id" => "060fdb52-cc79-463e-9cbf-f7d8fee5db89"
    },
       #看这里，根据时间戳生成的时间
       "@timestamp" => 2020-02-19T03:01:46.833Z,
            "input" => {
        "type" => "log"
    },
       "query_host" => "localhost",
             "tags" => [
        [0] "beats_input_codec_plain_applied"
    ],
           "row_id" => 2,
           ###看这里，第二个message数据
          "message" => "# User@Host: root[root] @ localhost []  Id:     2\n# Query_time: 4.448631  Lock_time: 0.000213 Rows_sent: 1  Rows_examined: 10000000\nSET timestamp=1582081300;\nselect * from db1.t1 where id=1;",
         "@version" => "1",
         ###从这往下看，能看到这里面夹杂这生成的json数据
         #row_id   query_time   lock_time  rows_examined query query_user等都是
       "query_time" => 4.448631,
        "lock_time" => 0.000213,
              "ecs" => {
        "version" => "1.4.0"
    },
    "rows_examined" => 10000000,
            "query" => "select * from db1.t1 where id=1;",
              "log" => {
         "flags" => [
            [0] "multiline"
        ],
        "offset" => 5346,
          "file" => {
            "path" => "/usr/local/mysql/mysql-slow.log"
        }
    },
             "host" => {
                 "name" => "node4",
                   "os" => {
            "codename" => "Core",
                "name" => "CentOS Linux",
              "family" => "redhat",
             "version" => "8 (Core)",
              "kernel" => "4.18.0-80.el8.x86_64",
            "platform" => "centos"
        },
             "hostname" => "node4",
         "architecture" => "x86_64",
                   "id" => "d8100d9fc21041ae9364bbb1ca84da02",
        "containerized" => false
    },
           "action" => "select",
        "rows_sent" => 1,
        "timestamp" => "1582081300",
       "query_user" => "root"
}
```

**通过grok插件，实现日志过滤**

关于正则表达式内容，参考shell脚本中的正则表达式一章

```
补充知识点
空格匹配   \s
回车匹配   \s*
非空格匹配  \S [大写]
```

grok中的语法

```
grok匹配规则
%{数据类型：变量名}
例如 5.12 可能是一个事件的持续时间,192.168.98.200可能是请求的client地址。所以这两个值可以用 %{NUMBER:duration} %{IP:client} 来匹配。

自定义数据类型
(?<字段名>表达式)

例如，日志有一个student_id 为一个长度为10或11个字符的十六进制值。使用下列语法可以获取该片段，并把值赋予student_id
(?<student_id>[0-9A-F]{10,11})

具体参考
https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html
```

删除第二个message数据

```
filter {
#1、将第二个message数据格式化为json格斯
grok {
        match => [ "message", "(?m)^# User@Host: %{USER:query_user}\[[^\]]+\] @ (?:(?<query_host>\S*) )?\[(?:%{IP:query_ip})?\]\s+Id:\s+%{NUMBER:row_id:int}\s*# Query_time: %{NUMBER:query_time:float}\s+Lock_time: %{NUMBER:lock_time:float}\s+Rows_sent: %{NUMBER:rows_sent:int}\s+Rows_examined: %{NUMBER:rows_examined:int}\s*(?:use %{DATA:database};\s*)?SET timestamp=%{NUMBER:timestamp};\s*(?<query>(?<action>\w+)\s+.*)" ]
    }

#匹配"message" => "# Time: "数据行[第一个message]，添加一个标签 drop
grok {
        match => { "message" => "# Time: " }
        add_tag => [ "drop" ]
        tag_on_failure => []
    }

#删除标签为drop的数据行
    if  "drop" in [tags] {
        drop {}
    }

#匹配message中的时间戳，根据亚洲/上海的格式生成本地时间
    date {
        match => ["mysql.slowlog.timestamp", "UNIX", "YYYY-MM-dd HH:mm:ss"]
        target => "@timestamp"
        timezone => "Asia/Shanghai"
    }
    ruby {
        code => "event.set('[@metadata][today]', Time.at(event.get('@timestamp').to_i).localtime.strftime('%Y.%m.%d'))"
    }

#删除message字段
 mutate {
        remove_field => [ "message" ]
    }


}
```

**实现过滤后，logstash数据存储状态**

```
{
        "lock_time" => 0.000226,
             "host" => {
                 "name" => "node4",
         "architecture" => "x86_64",
                   "os" => {
                "name" => "CentOS Linux",
              "family" => "redhat",
            "platform" => "centos",
              "kernel" => "4.18.0-80.el8.x86_64",
             "version" => "8 (Core)",
            "codename" => "Core"
        },
             "hostname" => "node4",
                   "id" => "d8100d9fc21041ae9364bbb1ca84da02",
        "containerized" => false
    },
    "rows_examined" => 10000000,
           "action" => "select",
        "rows_sent" => 1,
             "tags" => [
        [0] "beats_input_codec_plain_applied"
    ],
           "row_id" => 2,
              "log" => {
          "file" => {
            "path" => "/usr/local/mysql/mysql-slow.log"
        },
         "flags" => [
            [0] "multiline"
        ],
        "offset" => 5119
    },
         "@version" => "1",
              "ecs" => {
        "version" => "1.4.0"
    },
            "input" => {
        "type" => "log"
    },
       ###看这里下面数据,数据已经被定义为json格式了，
       "query_host" => "localhost",
       "@timestamp" => 2020-02-19T02:57:11.812Z,
       "query_time" => 4.377673,
       "query_user" => "root",
            "query" => "select * from db1.t1 where id=1;",
        "timestamp" => "1582081027",
            "agent" => {
                "type" => "filebeat",
             "version" => "7.6.0",
            "hostname" => "node4",
                  "id" => "060fdb52-cc79-463e-9cbf-f7d8fee5db89",
        "ephemeral_id" => "3736821d-5c17-429a-a8af-0a9b28ba87b7"
    }
}
```

**c、logstash将数据交给elasticsearch**

```
[root@node3 conf.d]# cat mysql_logstash_es.conf
#采集数据
input {
	beats {
        port => 5044
    }
}

#过滤
filter {
grok {
        match => [ "message", "(?m)^# User@Host: %{USER:query_user}\[[^\]]+\] @ (?:(?<query_host>\S*) )?\[(?:%{IP:query_ip})?\]\s+Id:\s+%{NUMBER:row_id:int}\s*# Query_time: %{NUMBER:query_time:float}\s+Lock_time: %{NUMBER:lock_time:float}\s+Rows_sent: %{NUMBER:rows_sent:int}\s+Rows_examined: %{NUMBER:rows_examined:int}\s*(?:use %{DATA:database};\s*)?SET timestamp=%{NUMBER:timestamp};\s*(?<query>(?<action>\w+)\s+.*)" ]
    }

    grok {
        match => { "message" => "# Time: " }
        add_tag => [ "drop" ]
        tag_on_failure => []
    }

    if  "drop" in [tags] {
        drop {}
    }

    date {
        match => ["mysql.slowlog.timestamp", "UNIX", "YYYY-MM-dd HH:mm:ss"]
        target => "@timestamp"
        timezone => "Asia/Shanghai"
    }
    ruby {
        code => "event.set('[@metadata][today]', Time.at(event.get('@timestamp').to_i).localtime.strftime('%Y.%m.%d'))"
    }

 mutate {
        remove_field => [ "message" ]
    }


}


#输出到es
output {
    elasticsearch{
        hosts => ["192.168.98.201:9200"]
        index => "zutuanxue_node4_mysql-%{+YYYY.MM.dd}"   
    }
   
stdout {
	      codec => rubydebug
    }
}
```

## 三、kibana展示

绘制图表

- query_time分布
- 统计slow日志数量