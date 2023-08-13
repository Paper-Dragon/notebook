# Gitlab备份和恢复

## 配置备份

> 参考链接 https://docs.gitlab.com/omnibus/settings/backups.html

编辑用户根目录的 cron 表

```bash
sudo crontab -e -u root
```

备份etc配置文件

```bash
15 04 * * 2-6  gitlab-ctl backup-etc 
### && cd /etc/gitlab/config_backup && cp $(ls -t | head -n1) /secret/gitlab/backups/ #异地备份
```



## 配置恢复

解压压缩包到gitlab目录

```bash
/etc/gitlab
```



## 数据备份

> 参考链接
>
> - [备份 GitLab ](https://docs.gitlab.com/ee/raketasks/backup_gitlab.html)

### 手动备份

#### 运行命令：

```bash
gitlab-backup create
```



### 自动备份



 编辑crontab配置:

```
sudo su -
crontab -e
```

 在配置文件中添加：

```
0 2 * * * /opt/gitlab/bin/gitlab-backup create CRON=1 # 每天2点进行自动备份
```

#### 详细配置

##### 限制备份的存活日期

```r
gitlab_rails['backup_keep_time'] = 604800  #  7 days 
```

##### 数据保存目录

```r
gitlab_rails['backup_path'] = "/var/opt/gitlab/backups"
```

##### 备份文件权限

```bash
gitlab_rails['backup_archive_permissions'] = 0644
```

##### 使用Gitaly创建和恢复仓库的备份

```
gitlab_rails['backup_gitaly_backup_path'] = /opt/gitlab/embedded/bin/gitaly-backup
```

##### 异地备份

xxxx



## 数据恢复



### 准备好压缩包，例如

```bash
/var/opt/gitlab/backups/xxxxxxxxxxxxxxxxxxxxxxxxx-ce_gitlab_backup.tar
```

### 暂停puma和sidekiq

```
sudo gitlab-ctl stop puma
sudo gitlab-ctl stop sidekiq
```

### 恢复

```
gitlab-backup restore BACKUP=xxxxxxxxxxxxxxxxxxxxxxxxx-ce
```

### 重启服务

```
sudo gitlab-ctl restart
sudo gitlab-ctl status
```