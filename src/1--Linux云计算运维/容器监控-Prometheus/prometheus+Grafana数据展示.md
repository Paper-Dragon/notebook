通过前面课程的学习我们知道了如何部署和设置prometheus，但是这个监控软件的展示界面实在是有些难看，所以我们换一个展示方式Grafana，是一个开源的度量分析和可视化工具（没有监控功能），可以通过将采集的数据分析，查询，然后进行可视化的展示,并能实现报警。

## 一、部署grafana

### 1.1、grafana安装

软件包获得

官方网站: grafana:https://grafana.com/

**软件包安装**

```
[root@manage01 ~]# dnf -y localinstall grafana-6.6.1-1.x86_64...
```

**服务启动**

```
#服务启动
[root@manage01 ~]# systemctl enable grafana-server
Created symlink from /etc/systemd/system/multi-user.target.wants/grafana-server.service to /usr/lib/systemd/system/grafana-server.service.
[root@manage01 ~]# systemctl start grafana-server

#验证启动
[root@manage01 ~]# lsof -i :3000
COMMAND     PID    USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
grafana-s 17154 grafana    8u  IPv6  53939      0t0  TCP *:hbci (LISTEN)
```

grafana启动成功后，可以通过页面访问到grafana页面

**在浏览器中输入http://IP或者域名:3000**

![grafana1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603596947237.png)

**要求输入账号密码：** admin/admin（默认）

当看到这个页面说明grafana已经安装成功并且工作了。

输入账号密码登录时，由于是第一次登录，为了安全要求必须更改密码后才能登录

![grafana2.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603596961840.png)

输入两次新密码后，点击save即可登录

### 1.2、grafana页面设置-添加prometheus数据源

登录成功后，会发现页面为你提供了一个使用引导线，按着引导我们需要都设置一下，首先第一步就是告诉grafana，他需要展示谁的数据。也就是说数据源是谁

![image20200225145354437.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603597166730.png)

从图标上可以看出，我们需要设置数据源—展示仪表盘—添加用户这些操作，我们先来完成添加数据源吧。

点击Add data source 增加数据源

![image20200225145454014.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603597180856.png)

看到主角了把，Prometheus出现了。赶快点击进入下一步吧。

![image20200225153536052.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598098895.png)

auth部分的设置，主要是与HTTPS配合使用的，如果使用的是https的话就需要证书啊，认证啊这些，需要对此部分内容进行一些配置

按照页面要求填入对应信息即可，一般错误都是因为输入错误造成的。点击Save & Test后保存成功

![grafana6.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598136429.png)

我们可以通过左侧导航栏中的齿轮图标下拉菜单中的Data Source看到我们刚才添加的数据源

## 二、绘制图形

### 2.1 仪表盘管理

![grafana7.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598153820.png)

添加完数据源后，可以继续添加仪表盘了，这样我们就能以图表的方式看到数据了，继续点击New Dshboard

![grafana8.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598164980.png)

图上显示你可以增加一个图形到仪表盘，也可以选择一个样式图标

这里任选一个都可以，这个版本不知道作者怎么想的，其实功能都能实现

我选择第一个 Add query

![grafana9.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598174144.png)

进入页面后，左侧有四个标识，分别是

数据源
![image20200225154121203.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598195711.png)

图表
![image20200225154146665.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598252585.png)

设置
![image20200225154213541.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598296388.png)

告警
![image20200225154254663.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598314569.png)

我们按照图标步骤先来设置数据源吧

如上图，在A项中根据需求，匹配你的监控项，如果有多项，可以通过右上角的add query增加，设置完成后就可以设置图表样式了，点击图表

![grafana10.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598371614.png)

图表主要说的就是图表的样式，主要的我给大家展示一下

第一个Draw Modes 说的是图表中图的展示方式，有条状 线 点三种，看你喜好了

第二个Mode Options 说的是图表的填充阴影透明度 图上线的粗细

最后一个 是否开启图表堆叠和显示百分比

设置完成后再看看设置图标

该页面主要是设置图表名称和注释的

![grafana11_1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598409137.png)

设置好后我们图表设置就暂时这样，后续告警再细说告警设置。

点击保存后图表就保存好了。

![grafana11.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598419929.png)

保存图表时会要求你输入仪表盘名称。这里输入Node2

![grafana12.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598428790.png)

确认无误后，点击保存

![grafana13.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598439982.png)

仪表盘做好了，同时也看到我们的图形了。

接下来应该设置用户了，这个用户添加，采用的是邀请机制，也就是需要我们生成邀请链接，然后发给对应的用户，然后对方访问相应的链接注册，这样，这个用户才能添加成功 点击Add users按钮

![grafana14.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598459372.png)

按照要求添加一个用户

![grafana15.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598467834.png)

点击邀请用户

![image20200225161454447.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603598506824.png)

输入用户名称、用户角色点击邀请

![image20200225161653564.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603599969045.png)

点击邀请后，需要将邀请链接发给用户或者自己在浏览器中打开确认邀请

我们切换到另一台主机在浏览器中打开

![image20200225162223119.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603599989091.png)

输入email地址和用户密码第几注册即可成功

![image20200225162409462.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603600009892.png)

回到使用admin账号登录grafana的主机，刷新后就可以看到新注册的用户，也可以对用户进行删除，修改权限的操作

### 2.2、grafana设置–添加监控cpu负载的图形

点击左边侧栏：➕—Choose Visualization(这次练习这个)

选择graph图表样式

按照要求输入数据项:

- node_load1 CPU一分钟平均负载
- node_load5 CPU五分钟平均负载
- node_load15 CPU十五分钟平均负载

注意：如果同时监控了多个机器，图表会显示所有机器的，如果只想显示某个机器的可以使用监控匹配。

输入方法如下：

监控项{instance=“被监控机IP:port”}

如下图

![image20200225163828382.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603600129701.png)

这样就可以显示一台机器了。

### 2.3、grafana设置—使用模板图表展示MySQL监控

**mysql监控模板下载**
https://github.com/percona/grafana-dashboards

模板设置

```
#在grafana配置文件中添加插件信息
[root@manage01 ~]# vim /etc/grafana/grafana.ini 
[root@manage01 grafana]# tail -3 /etc/grafana/grafana.ini 
[dashboards.json]
enabled = true
path = /var/lib/grafana/dashboards

#下载插件
[root@manage01 ~]# unzip grafana-dashboards-master.zip 


#拷贝插件到指定位置
[root@manage01 ~]# cd grafana-dashboards-master/
[root@manage01 grafana-dashboards-master]# cp -r dashboards /var/lib/grafana/
[root@manage01 dashboards]# vim /var/lib/grafana/dashboards/MySQL_Overview.json
#搜索pmm-singlestat-panel替换为singlestat
#重启生效
[root@manage01 grafana]# systemctl restart grafana-server.service 
```

web界面导入模板

![grafana20.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603600176233.png)

选择左侧菜单—➕—Import

选择对应的json文件，然后导入即可

![grafana21.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603600190604.png)

点击导入后就可以看到图片了

![image20200225171755015.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603600206867.png)