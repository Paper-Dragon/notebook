# date 显示或设置时间

## 显示时间

按照我们要求的格式显示当前日期: 年-月-日

```bash
2019-04-10
[root@oldboyedu59 ~]# date  +%Y-%m-%d
2019-04-10
[root@oldboyedu59 ~]# date +%T
09:57:23
[root@oldboyedu59 ~]# date +%H:%M:%S
09:57:39
[root@oldboyedu59 ~]# date +%w
3
    
+%F === +%Y-%m-%d
            year month  day 
+%T === +%H:%M:%S
            hour min(minute)  sec(second)       
+%w === week 周几 
```

## 例题:

显示当前时间以年月日-小时格式
20190101-10
显示当前时间以年月日-小时_周几 格式
2019_01_01-10_3

```bash
[root@oldboyedu59 ~]# #显示当前时间以年月日-小时格式
[root@oldboyedu59 ~]# date +%Y%m%d
20190410
[root@oldboyedu59 ~]# date +%Y%m%d-%H
20190410-10
[root@oldboyedu59 ~]# #显示当前时间以年_月_日-小时_周几 格式
[root@oldboyedu59 ~]# date +%Y_%m_%d-%H_%w
2019_04_10-10_3


​     
[root@oldboyedu59 ~]# date -d "10day"
Sat Apr 20 10:10:12 CST 2019
[root@oldboyedu59 ~]# date -d "10day" +%F
2019-04-20
```

显示1天前时间以年月日-周几格式
20190101-3
显示7天前时间 以年月日-小时_周几 格式
2019_01_01-10_3

```bash
[root@oldboyedu59 ~]# #显示1天前时间以年月日-周几格式
[root@oldboyedu59 ~]# 
[root@oldboyedu59 ~]# 
[root@oldboyedu59 ~]# date +%Y%m%d-%w -d  "-1day"
20190409-2
[root@oldboyedu59 ~]# #显示7天前时间 以年_月_日-小时_周几 格式
[root@oldboyedu59 ~]# 
[root@oldboyedu59 ~]# date +%Y_%m_%d-%H_%w -d '-7day'
2019_04_03-10_3
```

备份
设置时间

set
date -s
