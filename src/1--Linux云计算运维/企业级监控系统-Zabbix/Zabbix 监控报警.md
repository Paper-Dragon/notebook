## 一、onealter 报警插件设置

告警插件安装成功了，接下来我们要设置告警通知了

告警通知有多种，比如：邮件、微信、钉钉、APP、电话、短信等

这里主要给大家介绍：邮件、微信、APP

![image20200213184629351.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532085724.png)

点击配置—通知策略进入通知页面

在这里可以设置邮件报警，同时右侧也给出了APP下载地址，下载后直接安装登陆即可。

这里我们先把告警状态、告警级别、通知方式、通知人都设置一下。

![image20200213194108292.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532099750.png)

好了，我点点添加，全部都设置成功了

### 添加多个人

**step 1** 为团队添加成员

![image20200213201420457.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532119396.png)

![image20200213200952058.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532136205.png)

![image20200213194416754.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532167206.png)

**step 2** 登录被邀请的用户邮箱选择接受邀请

![image20200213195116050.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532405930.png)

可以选择新用户，也可以选择已有账户，完成注册/登录的操作后使用被邀请的用户进入到配置中的团队管理界面，看下能否看到两个用户

![image20200213201542249.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532435392.png)

如果不可以看到的话就切换到添加成员的界面，刷新一下就可以看到成员已经添加进来了，并且在团队管理中也可以看到响应的用户

![image20200213200626704.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532461447.png)

![image20200213201741467.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532475611.png)

**step 3** 在配置，通知策略中可以新建通知了

![image20200213202254560.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532516890.png)

**step 4** 选择保存之后，就可以看到两个用户都有显示了

![image20200213202350511.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532561877.png)

以上就是单人通知和多人通知的设置方式。

接下来我们在设置一下微信报警

点击右上角的人头像—个人中心

![image20200213202703413.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532579455.png)

点击绑定微信，使用微信扫描即可绑定。

好了到此我们的告警插件就设置好了，接下来要设置zabbix-server平台。

## 二、zabbix监控平台调用报警插件

**案例: 监控平台调用onealter插件，实现报警**

点击管理—报警媒介类型

可以看到我们安装好的onealter，我们点击后边的测试，看看是否能正常工作

![onealter8.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603532954403.png)

```
如果测试失败，一般是找不到文件，做个链接
[root@manage01 bin]#  ln -s /usr/local/zabbix-server/share/zabbix/alertscripts/cloudalert /usr/lib/zabbix/alertscripts/
```

再次测试

![image20200215220103776.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603533012961.png)

输入收件人地址后，点击测试

![image20200215220148496.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603533038982.png)

如上图，测试成功了。

回到zabbix告警平台点击右上角 人头像—报警媒介—添加收件人

![image20200214161626166.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603533071992.png)

设置告警收件人，可以设置多个人。

![image20200214155900052.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603533104780.png)

ok，我们zabbix监控平台设置好了。

### 测试报警

之前设置过一个自定义监控，我们监控了登陆用户数量，我们通过同时登陆node1超过三个用户，验证报警。

![onealter12.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603533145726.png)

可以看到，node1的当前用户量已经超过了预警值

看看邮箱吧，是否收到报警

![image20200214155944190.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603533167741.png)

当你把多余的用户退出以后还会收到邮件

![image20200214161309486.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603533227451.png)

ok，完美了，如果你下载了APP和微信，看看他们是否也收到了，答案是肯定的。