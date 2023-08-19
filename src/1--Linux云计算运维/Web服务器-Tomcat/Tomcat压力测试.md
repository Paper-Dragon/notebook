Apache JMeter是Apache组织开发的基于Java的压力测试工具。用于对软件做压力测试，它最初被设计用于Web应用测试，但后来扩展到其他测试领域。 它可以用于测试静态和动态资源，例如静态文件、Java 小服务程序、CGI 脚本、Java 对象、数据库、FTP 服务器， 等等。JMeter 可以用于对服务器、网络或对象模拟巨大的负载，来自不同压力类别下测试它们的强度和分析整体性能

### JMeter的作用

能够对HTTP和FTP服务器进行压力和性能测试， 也可以对任何数据库进行同样的测试（通过JDBC）。

完全的可移植性和100% 纯java。

完全多线程 框架允许通过多个线程并发取样和 通过单独的线程组对不同的功能同时取样。

精心的GUI设计允许快速操作和更精确的计时。

缓存和离线分析/回放测试结果。

```
下载地址：http://jmeter.apache.org/download_jmeter.cgi
```

### JMeter安装使用

将下载好的压缩包在windows中解压（需要先安装JDK），解压后进入到bin目录双击jmeter.bat，等待启动

![image202003132046066284103573.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162643439.png)

设置中文

![image20200313204658512.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162670876.png)

创建测试

![image20200313205020894.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162712089.png)

添加线程组，使用线程模拟用户的并发

![image20200313205150993.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162732432.png)

![image20200313205306242.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162745836.png)

1000个线程循环10次，tomcat会收到10000个请求

添加并设置http请求

![image20200313205429005.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162768123.png)

![image20200313205601358.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162783074.png)

添加监控

![image20200313205836519.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162795573.png)

启动测试

![image20200313205920252.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162808359.png)

查看结果

![image20200313210311135.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/20/1603162821286.png)

```
标签：说明是请求类型，如Http，FTP等请求。

样本总数：也就是图形报表中的样本数目，总共发送到服务器的样本数目。

平均值：也就是图形报表中的平均值，是总运行时间除以发送到服务器的请求数。

居中的数值：也就是图形报表中的中间值，是代表时间的数字，有一半的服务器响应时间低于该值而另一半高于该值。

90%&95%&99%：有多少请求的响应时间比给出的数值还要小。

最小：是代表时间的数字,是服务器响应的最短时间。

最大: 是代表时间的数字,是服务器响应的最长时间。

异常%:请求的错误百分比。

吞吐量:也就是图形报表中的吞吐量，这里是服务器每单位时间处理的请求数，注意查看是秒或是分钟。

发送/接收KB/sec:是每秒钟发送/接收的字节数。（时间的单位为ms）
```

通过上面测试可以看出，tomcat在不做任何调整时，吞吐量为587次/秒。这个吞吐量跟接口的业务逻辑关系很大，如果业务逻辑复杂，需要比较长时间计算的，可能吞吐量只有几十次/秒，我这里测试的时候没有添加任务业务逻辑，才会出现吞吐量为587次/秒的情况。这里的吞吐量最好是经过多次测试取平均值，因为单次测试具有一定的随机性

### 调整tomcat线程池

```
[root@zutuanxue bin]# vim /opt/tomcat1/conf/server.xml    
<Connector port="8080" protocol="HTTP/1.1" maxThreads="1000" minSpareThreads="200" prestartminSpareThreads="true" connectionTimeout="20000" redirectPort="8443" />
#调整最大线程数为1000，最小为200，这个线程的数量要反复调整，然后对比测试结果，找出一个适合自己的值
```

### 调整队列

```
[root@zutuanxue bin]# vim /opt/tomcat1/conf/server.xml 
<Connector port="8080" protocol="HTTP/1.1" maxThreads="1000" minSpareThreads="200" prestartminSpareThreads="true"	maxQueueSize="100" connectionTimeout="20000" redirectPort="8443" />

默认情况下，请求发送到tomcat，如果tomcat正忙，那么该请求会一直等待。这样虽然可以保证每个请求都能请求到，但是请求时间就会边长。有些时候，我们也不一定要求请求一定等待，可以设置最大等待队列大小，如果超过就不等待了。这样虽然有些请求是失败的，但是请求时间会虽短。典型的是12306。
```

参数介绍可以去官网查看：https://tomcat.apache.org/tomcat-9.0-doc/config/executor.html