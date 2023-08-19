zabbix在监控的时候有两种模式，一种是主动模式，另外一种是被动模式

## 一、被动模式

所谓的被动模式，是以zabbix-agent做为参考对象，也就是表示是server或proxy去找agent拿数据，agent被动的等待指令的下达，让我干什么活，我就去干什么活，这也是zabbix server的默认模式，为什么这么说？我们可以随便找一台主机的查看它的监控项中在名称下面有一个类型，在这里面我们看到的是“zabbix客户端”这个值

![image20200215184213711.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594519820.png)

这个值在已经设置好的监控项当中是不能更改的，但是如果我们新建监控项的时候你就会发现，类型里面还有一个叫“zabbix客户端（主动式）”的选项。所以说zabbix默认的都是被动模式

配置方法如下:

```
agent端配置被动模式的参数如下
[root@agent1 ~]# vim /etc/zabbix/zabbix_agentd.conf
Server=10.1.1.13		--IP为zabbix_proxy的ip(如果没有proxy，则直接为zabbix_server的ip)
[root@agent1 ~]# systemctl restart zabbix-agent
```

## 二、主动模式

也就是agent主动把数据传给server或proxy

agent主动模式的优点是: 当agent太多的情况下，server或proxy去找这么多agent搜集数据，压力负载过大。用主动模式就可以缓解server或proxy的压力。

但用主动模式的问题是: 监控项当中的类型，也要转为主动式才行，而且很多zabbix自带模板里的监控项不支持转为主动式.

```
agent端配置主动模式的参数如下
[root@agent1 ~]# vim /etc/zabbix/zabbix_agentd.conf
Serveractive=10.1.1.13	 --IP为zabbix_proxy的ip(如果没有proxy，则直接为zabbix_server的ip)
[root@agent1 ~]# systemctl restart zabbix-agent
```