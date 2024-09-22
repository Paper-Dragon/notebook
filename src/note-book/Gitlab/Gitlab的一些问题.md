# 第一次使用gitlab登陆网页没有提示更改密码

破案了,新版本从命令行看： 

```bash
cat /etc/gitlab/init_xxx  
```

以下是更改的方法：：

进入 GitLab 控制台

```bash
gitlab-rails console -e production
```

执行命令： user = User.where(id: 1).first，此 user 则表示 root 用户

```bash
user = User.where(id: 1).first
```

执行命令：user.password = 'secret_pass’修改密码， user.password_confirmation = ‘secret_pass’ 确认密码

```bash
user.password = 'secret_pass’
user.password_confirmation = ‘secret_pass’
```

执行命令： user.save!

```bash
user.save!
```

执行命令： exit

```bash
exit
```

# warning: redis: unable to open supervise/ok: file does not exist

gitlab启动报warning: redis: unable to open supervise/ok: file does not exist；解决如下：
 1、按住CTRL+C强制结束；
 2、运行：sudo systemctl restart gitlab-runsvdir；
 3、再次执行：sudo gitlab-ctl reconfigure



# gitlab执行gitlab-ctl reconfigure 后卡在bruby_block[wait for logrotate service socket] action run解决方案。

- 新打开一个窗口

- 执行systemctl restart gitlab-runsvdir命令

解决方案:
在另外开启一个终端启动如下命令

```bash
sudo /opt/gitlab/embedded/bin/runsvdir-start
```

或者在当前的终端窗口中后台执行上述命令

```bash
nohup /opt/gitlab/embedded/bin/runsvdir-start &
```

然后再执行

```bash
sudo gitlab-ctl reconfigure
```

# GitLab 未启动 systemctl start gitlab-runsvdir.service 无反应

重启了一台服务器，发现配置的 Gitlab 没有启动。手动启动`sudo gitlab-ctl start`提示一堆`runsv not running`的信息。



```
$ sudo gitlab-ctl start
fail: alertmanager: runsv not running
fail: gitaly: runsv not running
fail: gitlab-exporter: runsv not running
fail: gitlab-workhorse: runsv not running
fail: grafana: runsv not running
fail: logrotate: runsv not running
fail: nginx: runsv not running
fail: node-exporter: runsv not running
fail: postgres-exporter: runsv not running
fail: postgresql: runsv not running
fail: prometheus: runsv not running
fail: puma: runsv not running
fail: redis: runsv not running
fail: redis-exporter: runsv not running
fail: sidekiq: runsv not running
```

然后手工重启`runsv`服务：



```
$ sudo systemctl start gitlab-runsvdir.service
```

结果一直停在这个地方，没有输出也不退出，感觉像在等待什么东西。在网上搜索[答案](https://clay-atlas.com/us/blog/2022/07/15/solved-gitlab-cannot-startup-and-freeze-at-systemctl-start-gitlab-runsvdir-service/)之后，定位在一个叫做 plymouth-quit-wait.service 的启动服务，该服务未被正确启动，从而把别的任务都堵死了。用`sudo systemctl list-jobs`可以查看正在启动的任务：



```
$ sudo systemctl list-jobs
JOB UNIT                                 TYPE  STATE
232 watchdog.service                     start waiting
61  setvtrgb.service                     start waiting
2   multi-user.target                    start waiting
206 gitlab-runsvdir.service              start waiting
136 system-getty.slice                   start waiting
214 systemd-update-utmp-runlevel.service start waiting
225 ureadahead-stop.timer                start waiting
141 plymouth-quit-wait.service           start running
1   graphical.target                     start waiting

9 jobs listed.
```

我们可以手工杀死这个任务：



```
$ sudo systemctl stop plymouth-quit-wait.service
```

接下来就没有正在启动的任务了：



```
$ sudo systemctl list-jobs
No jobs running.
```

然后可以正常启动 gitlab-runsvdir.service 和 gitlab ：



```
$ sudo systemctl start gitlab-runsvdir.service
$ sudo gitlab-ctl start
```

从这个案例也可以看出，所有不能正常启动的服务，都可以到`systemctl list-jobs`这里看启动状态，查看异常任务。

现在还有最后一个问题， plymouth-quit-wait.service 是做什么用的，可以随便 stop 吗，为什么它会造成这个结果？

[Slow boot issue due to plymouth-quit-wait.service + ubuntu 18.04](https://askubuntu.com/questions/1119167/slow-boot-issue-due-to-plymouth-quit-wait-service-ubuntu-18-04)对作用有一些解释。但未能解释为什么 plymouth-quit-wait.service 会堵塞启动（而且 stop 之后就能跑通）。
