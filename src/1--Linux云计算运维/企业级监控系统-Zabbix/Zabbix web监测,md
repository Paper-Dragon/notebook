业务中总会让我们去监控一些URL，比如支付接口中的微信支付，支付宝支付，那么这些URL是怎么监控的呢？可以使用zabbix提供的web监测功能。

web监控一般在生产环境中一般不会配置到模板，一般都是某个业务机由于业务需要去监控本机或者下游某个机器的URL的，所以我这里配置也是针对某个机器来配置的。本实验中我是给node1来配置

**实验步骤**

1. 给node1安装一个web站点，然后用web监测来监控该web
2. 监控平台配置web监测

### a、为node1部署一个站点

```
#安装服务
[root@node1 ~]# dnf -y install httpd

#配置页面
[root@node1 ~]# echo haha > /var/www/html/index.html

#启动服务
[root@node1 ~]# systemctl start httpd
[root@node1 ~]# systemctl enable httpd
Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service.
```

### b、监控平台配置web监测

配置—主机—选择被监控机的web监测

![web_check1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603530856580.png)

点击web监测进入本机的web监测管理页面，这里继续选择创建 web场景

![web_check2.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603530869849.png)

点击 创建web场景

![web_check3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603530881058.png)

按要求填写内容后选择步骤

![web_check4.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603530893761.png)

点击添加后、web方案步骤就设置好了

![web_check5.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603530908605.png)

继续选择添加，WEB监测就做好了

测试一下，监测—web监测—node1_web，如下图

![web_check6.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603530925622.png)