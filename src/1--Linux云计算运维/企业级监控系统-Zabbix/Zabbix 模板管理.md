**模板(template)**: 对于我们来说是非常重要的，因为它保存了监控项，应用集（给监控项分的组），触发器，图形，聚合图形，自动发现规则，web监测等的一组实体。最主要的是给懒人们提供了方便

我们使用模板可以方便应用到主机，更改模板也会将更改应用到所有链接的主机。避免了每一台主机都需要手动去添加，手动去更改的麻烦

参考: https://www.zabbix.com/documentation/3.4/zh/manual/config/templates

在工作中，我们也可以根据自己公司的实际情况去创建模板，然后将目标应用到公司的服务器上去

## 一、创建一个模板

配置—模板

![模板1.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603593961462.png)

点击创建模板进入模板菜单

![模板2.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603593971773.png)

模板创建成功后，需要设置模板中的相关属性

![模板3.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603593979759.png)

由于我们之前修改过系统自带的模板，我们现在把他还原，也就是把之前我们添加的那个查看用户数量的相关信息都删除，然后再将监控用户数量这个设置添加到自己的模板中

首先找到之前添加的位置

![image20200215142907258.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594059969.png)

选择“监控项”把之前我们手动添加的内容并删除

![image20200215143108427.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594004364.png)

注意：如果是先删除“监控项”中的记录，那么“触发器”和“图形”中的也会跟着删除，如果是先删除“触发器”和“图形”中的记录，一定要记得回到“监控项”中将记录删除，删除完成之后，找到我们自己的模板选择监控项

![image20200215153151362.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594087710.png)

然后我们创建一个监控项

![image20200215153833443.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594114851.png)

监控项添加好了我们接着添加图形

点击图形–创建图形

![image20200215154057905.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594145519.png)

接下来是触发器–创建触发器

![image20200215154323984.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594169936.png)

设置完成之后点击“插入”和“添加”

现在这个模板我就定义完成了，那这个模板怎么使用呢？

直接点击配置–主机，选择node2

![image20200215155458753.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594203095.png)

然后选择模板，取消并清理，选择我们自己创建的模板，点击更新

![image20200215155614926.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594219316.png)

然后你就可以看到了

![image20200215155638220.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594230717.png)

切换到监测–图形就可以查看到图形内容了

```
注意：设置完成之后建议重新启动zabbix-proxy和zabbix-agent服务，如果是新的主机，新的主机上要存在相关的脚本和配置文件，相关操作还记得吧
mkdir /etc/zabbix/libexec

cat/etc/zabbix/libexec/check_user_number.sh
#!/bin/bash
#Description: 登陆用户监控脚本
count=`who |wc -l`
echo $count

chmod 755 /etc/zabbix/libexec/check_user_number.sh

/etc/zabbix/libexec/check_user_number.sh

vim /etc/zabbix/zabbix_agentd.d/check_user.conf

UserParameter=check.user,/etc/zabbix/libexec/check_user_number.sh
 
systemctl restart zabbix-agent zabbix-proxy
```

## 二、导出一个模板

导入导出模式是一个非常好的功能，在一台监控主机上的设置如果想用再其它监控主机而不想从头建立模板的时候，就需要用到这个功能

**导入导出**可以帮你轻松实现，导出的是**xml**格式文件.

配置－－主机－－选取要导出的主机（前面打勾）－－下面选择导出

![image20200215175546553.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594286591.png)

各位要注意，导出的只是模板，如果想拿到其它主机上使用的话，模板里面所涉及到的key，插件也需要一起保存，所谓的插件就是存放在/etc/zabbix/libexec目录下的内容，而key就是存放在/etc/zabbix/zabbix_agent.d/*.conf文件

## 三、导入一个模板

你可以在网上下载好zabbix的监控模板，下载的时候记得把相关的key文件和插件文件一同下载,下载完成之后将对应的key文件和插件拷贝到对应目录

在被监控主机上添加key和插件

```
[root@node2 ~]# cd znginx-master/
[root@node2 znginx-master]# ls
Readme.txt  userparameter_znginx.conf.sample  zbx_export_templates.xml  znginx
[root@node2 znginx-master]# cp znginx /etc/zabbix/libexec/
[root@node2 znginx-master]# cp userparameter_znginx.conf.sample /etc/zabbix/zabbix_agentd.d/
[root@node2 znginx-master]# cd /etc/zabbix/zabbix_agentd.d/
[root@node2 zabbix_agentd.d]# mv userparameter_znginx.conf.sample userparameter_znginx.conf
```

配置—模板—导入

![image20200215182702772.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594316548.png)

点击导入文件部分的按钮，选择对应的xml文件，点击导入

![image20200215182818104.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594328789.png)

返回模板中看下是否有新导入的模板

![image20200215182935259.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603594344461.png)

然后你就可以正常使用了

注意：在导入过程中记得选择xml文件，而下载模板文件的时候注意版本跨度不要太大，否则模板会无法正常使用。