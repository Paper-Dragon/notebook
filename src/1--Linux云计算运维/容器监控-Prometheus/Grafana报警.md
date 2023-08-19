接下来设置grafana的报警通道

![image20200225174606552.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603600915168.png)

点击左侧铃铛图表—notification channels—Add channel

![image20200225175559736.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603600940885.png)

- Name 部分：填一个名字
- Type 部分：选择 **webhook** 方式
- Send on all alerts：勾选后表示默认所有的报警都会通过这个通道发
- Include image：勾选后表示在报警的时候同时截图发送，因为目前的报警通知不支持图片，所以这里不用勾选
- Disable Resolve Message：勾选后表示当状态从报警中恢复到正常时，不再发送信息，即不告知恢复正常，这里不用勾选
- Send reminders：勾选后表示除了状态刚变成报警中时会发报警消息，过后每隔一段时间，如果依然处于报警中的状态，那么还会发一次重复报警
- Send reminder every：表示每隔多长时间发送重复报警，这里填默认30分钟
- Url：正式服的报警服务器
- Http Method：选择 POST

设置完成后点击send test可以去注册账号时使用的邮箱查看报警邮件

![image20200225175125898.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601003371.png)

设置好通道并完成验证后，为图表设置报警

![onealter7.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601023842.png)

选择图表 点击图表名称的下拉菜单—edit 进入编辑菜单

![onealter8.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601034286.png)

选择铃铛图表—create alert 设置图表报警

![onealter9.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601048614.png)

这里报警阈值设置的是取CPU Load平均值 因为是实验，所以预警值是0.5方便测试报警

![onealter10.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601059715.png)

设置完成后，发现图表上出现了预警线，点击保存吧

接下来在node2上搞大CPU的负载吧

![image20200225220905872.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601078926.png)

![image20200225222218919.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/25/1603601092958.png)

报警了，完美。