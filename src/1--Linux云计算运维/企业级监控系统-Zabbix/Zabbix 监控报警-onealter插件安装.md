监控报警机制是我们四要素中的一个重要要素，当机器或者监控资源达到阈值，就应该受到管理员关注。但是那么多的机器靠管理员去用眼睛看肯定是不行的，那么怎么能做到管理员只看有问题的机器呢，大家可能都能想到筛选机制吧！对的，我们把有问题的筛选出来就可以了，怎么筛选呢？那就让监控平台根据触发器筛选出来，并通过邮件、微信、钉钉等方式推送给管理员就可以了，做到有的放矢。

关于监控报警有很多种方式，常见的有两种

1）通过本机邮件客户端生成邮件，

 - 通过传输代理发给邮件服务器，

 - 通过邮件投递代理发给管理员。

2）三方报警插件：如 onealter

由于自己配置报警比较复杂，而且邮件容易被拒或当做垃圾邮件。有些专业的报警平台就可以帮你简单实现。

如:onealeart
参考:https://www.aiops.com/

## onealter报警设置

### 1、 onealter设置

访问官网

可以访问http://www.onealert.com/；也可以访问https://www.aiops.com/，注册账户

如果访问的是http://www.onealert.com/，点击免费试用之后注册

![image20200213164140494.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603531757916.png)

如果访问的是https://www.aiops.com/，直接注册

![image20200213193407234.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603531778720.png)

注册一个账号并登陆

![image20200213164226522.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603531793906.png)

登陆后选择CA

![image20200213164348628.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603531813053.png)

点击集成–选择zabbix

![image20200213164622598.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603531830834.png)

可以看到onealter很强大，支持多种监控类型，课程中用的是zabbix，所有我们选项zabbix，然后点击配置。

![image20200213164941337.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603531851905.png)

应用名称：为这个应用起一个名字

自动关闭时间：如果没有手动关闭告警，多久内自动关闭

点击保存应获取应用Key,为该应用生成一个key

![image20200213165138456.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603531864612.png)

key生成成功了，接下来就要在监控平台按照上述的命令执行安装告警插件了。

```
#zabbix 监控平台 插件目录
[root@zabbix ~]# mkdir -p /usr/local/zabbix-server/share/zabbix/alertscripts

[root@zabbix ~]# cd /usr/local/zabbix-server/share/zabbix/alertscripts


#下载监控插件
[root@zabbix alertscripts]# wget https://download.aiops.com/ca_agent/zabbix/ca_zabbix_release-2.1.0.tar.gz

#安装监控插件
[root@zabbix alertscripts]# tar -xzf ca_zabbix_release-2.1.0.tar.gz

[root@zabbix alertscripts]# cd cloudalert/bin 

[root@zabbix bin]# bash install.sh 188728c3-c12b-fd2f-f3fd-bf8eb761e919 

./log.sh:行6: /etc/zabbix/libexec/cloudalert/bin/cloudalert.conf: 没有那个文件或目录
start to create config file...

##输入交互信息
Zabbix管理地址: http://192.168.98.200/zabbix
Zabbix管理员账号: Admin
Zabbix管理员密码: 
.
.
.
create action success!
安装成功.
```