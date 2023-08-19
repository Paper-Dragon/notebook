由于gitlab中存放的都是开发人员的工作成果，所以为了保证数据安全，我们会定期对数据进行备份，对gitlab进行备份将会创建一个包含所有库和附件的归档文件。对备份的恢复只能恢复到与备份时的gitlab相同的版本。将gitlab迁移到另一台服务器上的最佳方法就是通过备份和还原。gitlab提供了一个简单的命令行来备份整个gitlab ，并且能灵活的满足需求。

## 一、备份

备份路径：

备份文件将保存在配置文件中定义的backup_path中 ，文件名为TIMESTAMP_gitlab_backup.tar,TIMESTAMP为备份时的时间戳。TIMESTAMP的格式为 ：EPOCH_YYYY_MM_DD_Gitlab‐version。

**备份配置：**

```
[root@zutuanxue git_data]# vim /etc/gitlab/gitlab.rb 
gitlab_rails['backup_path'] = "/opt/backups"
#备份路径
gitlab_rails['backup_keep_time'] = 604800
#备份周期-秒（7x24x3600）
[root@zutuanxue git_data]# gitlab-ctl reconfigure
```

**手动备份：**

```
[root@zutuanxue git_data]# gitlab-backup create
或者
[root@zutuanxue git_data]# gitlab-rake gitlab:backup:create
[root@zutuanxue git_data]# ls /opt/backups/
```

**定时备份：**

在定时任务里添加：

```
0 2 * * * /opt/gitlab/bin/gitlab-rake gitlab:backup:create
或
0 2 * * * /opt/gitlab/bin/gitlab-backup create
```

## 二、还原操作

只能还原到与备份文件相同的gitlab版本。执行恢复操作时，需要gitlab处于运行状态，备份文件位于gitlab_rails[‘backup_path’]。需要先停掉两个服务，停止连接到数据库的进程（也就是停止数据写入服务，如果是空主机，没有任何操作的话，可以不停止服务，停止相应服务的目的是为了保证数据移植），但是保持GitLab是运行的。

在web中删除项目

```
[root@zutuanxue backups]# gitlab-ctl stop unicorn
[root@zutuanxue backups]# gitlab-ctl stop sidekiq
```

指定时间戳你要从那个备份恢复：

```
[root@zutuanxue git_data]# cd /opt/backups/
[root@zutuanxue backups]# gitlab-ctl stop unicorn
ok: down: unicorn: 0s, normally up
[root@zutuanxue backups]# gitlab-ctl stop sidekiq
ok: down: sidekiq: 1s, normally up
[root@zutuanxue backups]# gitlab-rake gitlab:backup:restore BACKUP=1586328114_2020_04_08_12.9.2
（有的版本执行gitlab-rake gitlab:backup:restore BACKUP=1586328114即可）
Unpacking backup ... done
Before restoring the database, we will remove all existing
tables to avoid future upgrade problems. Be aware that if you have
custom tables in the GitLab database these tables and all data will be
removed.
Do you want to continue (yes/no)? yes
#提示移除所有存在的表
.
.
.
This task will now rebuild the authorized_keys file.
You will lose any data stored in the authorized_keys file.
Do you want to continue (yes/no)? yes
#提示移除所有验证秘钥
[root@zutuanxue backups]# gitlab-ctl restart#重启gitlab

注意：也可使用gitlab-rake gitlab:check SANITIZE=true验证下gitlab服务
```

浏览器重新打开gitlab页面，重新登录后查看到被还原的项目内容