在前面的课程中我们已经知道zabbix是一个分布式的监控软件，是一个高度集成的网络监控解决方案,简单来说就是一个监控平台，并且可以提供企业级的开源(免费)分布式监控解决方案,由一个国外的团队持续维护更新,软件可以自由下载使用,运作团队靠提供收费的技术支持赢利。它支持分布式监控，使用简单方便，比nagios更加容易上手，又拥有cacti那样支持数据持久化保存。Zabbix 通过 C/S 模式采集数据,通过 B/S 模式在 web 端展示和配置。

官方下载地址：[https://www.zabbix.com](https://www.zabbix.com/)

![image20200215233224237.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/24/1603528388290.png)

LTS=Long Term Support 长期支持 zabbix将为客户提供5年的支持服务。前三年完全支持与后两年有限制支持。前三年包括一般、关键、安全性问题解决，后两年包括关键、安全性问题解决。超出时间不提供技术支持服务。然而标准版，只提供6+1月支持。zabbix LTS与zabbix标准发行版本的生命周期区别，普通版本6个月开发发行，支持6个月无限制支持，外加一个月有限制支持。然后LTS版本1.5年开发发行，3年无限制支持，2年有限制支持。

**监控原理**

```
zabbix-server平台根据监控项发指令给zabbix-agent
zabbix-agent执行key对应的脚本，并把值返回给zabbix-server
zabbix-server接收数据并绘图
```

1、user—>web—>zabbix-server[监控平台]

用户通过web界面对zabbix监控平台进行操作

2、zabbix-server[监控平台]—>监控插件[被监控机]执行

zabbix监控平台会执行任务，也就是调用对应的插件在被监控主机上执行(告诉被监控机去执行xx插件)

3、监控插件[被监控机]执行–>zabbix-server

被监控机执行完成后将结果反馈给zabbix-server

4、zabbix-server—>zabbix-web—>user

zabbix-server通过web界面展现，最终用户查看到相应信息

**监控主机和被监控主机是如何通信的？**

- zabbix-server—zabbix-agent

	在被监控主机上安装一个zabbix-agent软件包，所有的动作都由agent去执行，并将结果反馈给server

- snmp协议 简单网络管理协议 缺点是无法自定义监控