**案例要求：**
通过prometheus监控业务机器192.168.98.202(node2)

## 一、案例实现

### a、安装监控客户端

```
[root@node2 ~]# tar xf node_exporter-0.18.1.linux-amd64.tar.gz -C /usr/local/
[root@node2 ~]# cd /usr/local/node_exporter-0.18.1.linux-amd64/
[root@node2 node_exporter-0.18.1.linux-amd64]# ls
LICENSE  node_exporter  NOTICE

#后台启动
[root@node2 node_exporter-0.18.1.linux-amd64]# nohup /usr/local/node_exporter-0.18.1.linux-amd64/node_exporter &
[1] 7281
[root@node2 node_exporter-0.18.1.linux-amd64]# nohup: 忽略输入并把输出追加到"nohup.out"


#业务机器监控插件服务端口
[root@node2 node_exporter-0.18.1.linux-amd64]# lsof -i :9100
COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node_expo 7281 root    3u  IPv6  42486      0t0  TCP *:jetdirect (LISTEN)

#验证  http://被监控机名称:9100/metrics
http://192.168.98.202:9100/metrics
现在我们这台机器上的数据被打包成了一个可以访问的页面，所以我们可以使用浏览器去访问这个页面，看下能否获取到相关的数据，如果能够获取的话就表示没有问题了。 
```

### b、在prometheus添加监控信息

```
#被监控主机设置完成之后，需要在prometeus主配置文件中添加被监控机信息
[root@node1 prometheus-2.11.1.linux-amd64]# tail -4  prometheus.yml 

  - job_name: 'node2'	#定义名称
    static_configs:#定义具体配置
    - targets: ['192.168.98.202:9100']#定义目标
 
 ####注意缩进  两个空格
     
 #重启服务    
[root@node1 prometheus-2.11.1.linux-amd64]# pkill prometheus
[root@node1 prometheus-2.11.1.linux-amd64]# ./prometheus --config.file=prometheus.yml &


注意：prometheus启动报错
**lock DB directory: resource temporarily unavailable"** 
原因:prometheus没有正常关闭，锁文件存在
rm $prometheus_dir/data/lock
```

## 二、测试验证

设置完毕看看prometheus页面吧

![Prometheus_6.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595672827.png)

查看Status-Targets页面后可以看到被监控机node2(192.168.98.202)已经在监控列表中了，同时可以通过浏览器看看其监控数据。

![Prometheus_node2_metrics5.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603595697191.png)

在浏览器中输入http://192.168.98.202:9100/metrics 既可以看到数据了