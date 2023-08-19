学习数据采集、数据分析的时候，我们一般验证都是通过ES-head来查看的，虽然解决了验证问题，但是界面友好度还是比较差，为了解决这个问题，我们可以通过学习kibana之后，通过kibana进行数据展示。

## 一、kibana部署

### 1.1、kibana介绍

Kibana是一个开源的可视化web平台,【是什么】

可以为ElasticSearch集群的管理提供友好的Web界面,帮助汇总,分析和搜索重要的日志数据。【干什么】

文档路径: https://www.elastic.co/guide/en/kibana/current/setup.html

### 1.2、kibana安装部署

**部署前准备**

- 机器准备
- 初始化设置【参考4.2】

**安装方法**

- yum
- rpm
- 源码包

**kibana安装**

```
[root@manage01 elk_7.6_soft]# rpm -ivh kibana-7.6.0-x86_64.rpm 
警告：kibana-7.6.0-x86_64.rpm: 头V4 RSA/SHA512 Signature, 密钥 ID d88e42b4: NOKEY
Verifying...       ################################# [100%]
准备中...          ################################# [100%]
正在升级/安装...
   1:kibana-7.6.0-1     ################################# [100%]
```

**相关目录**

```
安装目录:/usr/share/kibana
配置文件目录:/etc/kibana
配置文件：/etc/kibana/kibana.yml
```

### 1.3、kibana数据导入

```
[root@manage01 ~]# egrep -v "^#|^$" /etc/kibana/kibana.yml 
#kibana监听端口
server.port: 5601
#kibana监听地址
server.host: "0.0.0.0"
#ES主机地址，用于取数据
elasticsearch.hosts: ["http://192.168.98.201:9200"]
#PID文件
pid.file: /tmp/kibana.pid
#日志文件路径
logging.dest: /var/log/kibana.log
#汉化中文
i18n.locale: "zh-CN"
```

**创建日志文件**

```
注意:日志文件kibana不会自己创建的，必须手动创建
[root@manage01 ~]# touch /var/log/kibana.log
[root@manage01 ~]# chown kibana.kibana /var/log/kibana.log
```

**kibana启动**

```
[root@manage01 ~]# systemctl enable kibana
Synchronizing state of kibana.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable kibana
Created symlink /etc/systemd/system/multi-user.target.wants/kibana.service → /etc/systemd/system/kibana.service.

[root@manage01 ~]# systemctl start kibana
```

**启动验证**

```
[root@manage01 ~]# netstat -ntpl
tcp   0   0 0.0.0.0:5601       0.0.0.0:*        LISTEN      2351/node
```

### 1.4、kibana web界面

**项目案例：**

收集业务机器的messages日志,通过kibana数据分析，实时查看的数据增长量。

数据索引为zutuanxue-主机名-messages-YYYY-MM-DD.以node4为例。

**实验架构**

![FEK1986104.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977772335.png)

1、filebeat设置，收集日志给ES

2、索引管理-通过鼠标流展示

登陆kibana:http://192.168.98.200:5601

索引添加

 1、输入索引名称：xxxx-*

 2、输入索引中筛选字段名

```
注意：第一次登陆，必须设置索引数据后才能使用web工具栏上的工具
```

WEB界面介绍

![33kibanaweb_ui.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977849838.png)

索引查看

![34kibanaindex1992790.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977822314.png)

索引管理

![35kibanaindex管理.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977868506.png)

### 1.5、kibana图表

参考文档：https://www.elastic.co/guide/cn/kibana/current/createvis.html

发现工具：可以展示索引中的数据，以及按时间统计增长数量

![36发现.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977919596.png)

**图表管理**

创建图表

![37创建图表.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977930781.png)

选择图表样式(柱形图)

![36创建图表1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977947668.png)

选择索引数据

![38创建图表索引选择.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977963135.png)

设置图形数据x-y轴

![39创建图表xy轴1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977980097.png)

x轴添加及设置

![40创建图表x轴.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601977994112.png)

图形保存

![41创建图形图形保存.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978008221.png)

可视化图表管理

![42可视化管理图形.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978021588.png)

在可视化中可以对图表进行查看、修改、删除

我们再练习一个图表创建，说一下图表的选项设置。

仪表盘图形设置—创建仪表盘图形

![43仪表盘图形创建.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978043013.png)

仪表盘图形索引选择

![44仪表盘索引选择1995682.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978059245.png)

图形选项设置

![46仪表盘图形选项设置.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978089815.png)

保存仪表盘图形

![47仪表盘保存.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978104853.png)

**仪表盘管理**

将多个图表放在一个页面展示给用户

仪表盘-创建仪表盘

![48仪表盘创建.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978120788.png)

添加图形

![49添加图形到仪表盘.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978134035.png)

选择图形的同时，图表就会展示出来，选择完毕，点右上角叉号关闭即可

仪表盘内容查看

![仪表盘查看.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978150997.png)

保存仪表盘

![50仪表盘保存.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978164600.png)

仪表盘管理

![51仪表盘管理.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601978179720.png)

在本页面可以对仪表盘进行查看，修改，删除。