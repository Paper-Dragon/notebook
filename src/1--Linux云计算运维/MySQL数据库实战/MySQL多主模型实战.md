MySQL AB解决了数据备份的问题，但是当A由于某些原因宕机后，WEB服务器就没有办法在往数据库写或者读写了。线上业务中断了，完了，出事故了。这该怎么办呢？

本节课主要给大家讲解如果处理因为MySQL主服务器宕机造成的业务中断问题，保障MySQL业务高可用。

## 一、实验拓扑图

![mysql_aa拓扑图.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603973198714.png)

## 二、架构原理

1、MySQL互为主备，保障多台MySQL的数据强一致性。

2、VIP漂移，任何一台宕机都不影响数据读写

3、宕机服务器修复，自动同步故障间的缺失数据

## 三、实验准备

- 机器三台并设置好IP地址
- 关闭防火墙、selinux
- 时间同步
- node1、node2安装mysql
- manage01部署lamp
- 上线业务并进行容灾测试
- 知识储备点：MySQL AB复制

## 四、node1、node2互为主备

```
1、确认binlog开启
2、设置server-id
3、创建同步mysql用户
4、设置同步

#以node2为例
#创建用户
mysql> create user sko2 identified by "123456";
Query OK, 0 rows affected (0.00 sec)

mysql> grant replication slave on *.* to sko2;
Query OK, 0 rows affected (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)

#开始同步
#同步前    主服务器生成一个新binlog开始同步，防止之前的binlog中语句无法执行
mysql> stop slave;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> change master to 
-> master_host='192.168.98.202',
-> master_user='sko',
-> master_password='98989',
-> master_log_file='binlog.000002',
-> master_log_pos=xxx;
Query OK, 0 rows affected, 3 warnings (0.01 sec)

mysql> start slave;
Query OK, 0 rows affected (0.00 sec)
```

## 五、manage01-lamp

```
# 部署lamp业务环境
[root@manage01 ~]# yum -y install httpd php php-mysql
[root@manage01 ~]# systemctl start httpd
[root@manage01 ~]# systemctl start php-fpm
[root@manage01 ~]# vim /var/www/html/phpinfo.php

#测试
<?php phpinfo(); ?>
```

## 六、配置MySQL高可用

1、模拟故障，将配有VIP的mysql宕机，手动回收VIP并配给另外一个运行的mysql服务器，查看业务是否正常。

2、恢复宕机mysql，查看宕机过程中的产生的数据是否能够从另外一个运行的mysql中恢复回来。

```
参考nginx高可用部署
https://www.zutuanxue.com/home/4/58_388
```

## 七、上线业务测试

a、拷贝站点

```
[root@manage01 ~]# cp -r 测试站点html/* /var/www/html/
```

b、安装站点
打开浏览器输入 http://IP/install.php

c、根据站点提示输入数据并查询，查询数据库数据同步情况

d、停止主mysql继续测试业务，确保正常工作

e、启动宕机mysql，确保停机期间的数据同步