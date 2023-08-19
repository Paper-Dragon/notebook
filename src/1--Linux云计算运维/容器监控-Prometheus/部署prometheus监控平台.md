## 部署prometheus监控平台

- 安装部署prometheus服务监控端
- 监控一个远端机器
- 监控一个服务—mysql

## 一、软件获得

官方网站：https://prometheus.io/download/

```
prometheus 主程序包：wget https://github.com/prometheus/prometheus/releases/download/v2.11.1/prometheus-2.16.0.linux-amd64.tar.gz

远端主机监控插件(类似于zabbix-agent): wget  https://github.com/prometheus/node_exporter/releases/download/v0.18.1/node_exporter-1.0.0-rc.0linux-amd64.tar.gz

mysql业务监控插件: wget   https://github.com/prometheus/mysqld_exporter/releases/download/v0.12.0/mysqld_exporter-0.12.1.linux-amd64.tar.gz
```

## 二、实验拓扑图

![prometheus实验图.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595224470.png)

## 三、软件安装与启动

```
[root@node1 ~]# tar xf prometheus-2.11.1.linux-amd64.tar.gz -C /usr/local/


[root@node1 ~]# cd /usr/local/prometheus-2.11.1.linux-amd64/
[root@node1 prometheus-2.11.1.linux-amd64]# ./prometheus --config.file=prometheus.yml &
```

## 四、启动测试

![Prometheus_1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595254983.png)

看到这个页面说明prometheus启动成功了，默认监控了自己，我们来看一下本机的监控状态

![Prometheus_2.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595266461.png)

点击 status—targets即可看到监控的机器或者资源

![Prometheus_3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595289849.png)

看到本机了，同时也可以根据提示在浏览器中输入http://IP或者域名:9090/metrics查看监控数据。

```
显示监控数据

http://192.168.98.201:9090/metrics
```

![Prometheus_node1_metrics4.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595312946.png)

如果能看到这些信息就说明监控拿到了数据，拿到数据就可以正常显示了。通过这个URL我们可以知道prometheus把监控的数据都统一存放在一起,然后生成一个web页面,用户可以通过web页面查看相关的数据,这些数据遵循了时序数据库的格式,也就是key=value的形式.这些数据就是我们的监控指标,只不过现在我们还没有办法分析,借助图形展示才会更方便阅读

prometheus显示同样也提供了图表，可以通过图表很直观的看到监控项的状态，只不过自带的图形实在是不怎么好看。

通过点击Graph可以显示到下列图表，在搜索栏中输入关键字可以匹配出你想看的监控项

![image20200225140312916.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595335039.png)

这里输入的是process_cpu_seconds_total，CPU使用状态表就出现了，注意要点一下图表左上角的Graph按钮，默认是在console按钮页面。

至于报警，这里我们就不介绍了，因为我们不用prometheus自带的报警功能