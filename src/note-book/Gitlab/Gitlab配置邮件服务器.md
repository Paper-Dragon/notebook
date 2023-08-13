# Gitlab配置邮件服务器

## outlook



```bash
### Email Settings
gitlab_rails['gitlab_email_enabled'] = true
gitlab_rails['gitlab_email_from'] = 'gerrit@xxxx.com'
# gitlab_rails['gitlab_email_display_name'] = 'Example'
gitlab_rails['gitlab_email_reply_to'] = 'gerrit@xxxx.com'
# gitlab_rails['gitlab_email_subject_suffix'] = ''


### GitLab email server settings
###! Docs: https://docs.gitlab.com/omnibus/settings/smtp.html
###! **Use smtp instead of sendmail/postfix.**

gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.office365.com"
gitlab_rails['smtp_port'] = 587
gitlab_rails['smtp_user_name'] = "gerrit@xxxx.com"
gitlab_rails['smtp_password'] = "xxxx"
gitlab_rails['smtp_domain'] = "xxxx.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
#gitlab_rails['smtp_tls'] = false

###! **Can be: 'none', 'peer', 'client_once', 'fail_if_no_peer_cert'**
###! Docs: http://api.rubyonrails.org/classes/ActionMailer/Base.html
# gitlab_rails['smtp_openssl_verify_mode'] = 'none'

# gitlab_rails['smtp_ca_path'] = "/etc/ssl/certs"
# gitlab_rails['smtp_ca_file'] = "/etc/ssl/certs/ca-certificates.crt"

################################################################################
## Container Registry settings
##! Docs: https://docs.gitlab.com/ce/administration/container_registry.html
################################################################################

# registry_external_url 'https://registry.gitlab.example.com'

```

## QQ Mail

与Outlook不同的是 

- 密码填授权码

```bash

以QQ邮箱为例
    邮箱地址：xxxxxxxx@qq.com
    SMTP服务器地址：一般是smtp.qq.com
    SMTP服务器端口号：一般是456
    登录QQ邮箱并生成QQ邮箱第三方登录授权码
```

```bash
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "xxx@qq.com"
gitlab_rails['smtp_password'] = "从你的qq邮箱获得"
gitlab_rails['smtp_domain'] = "smtp.qq.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
##配置邮箱来源， 与展示的名称
gitlab_rails['gitlab_email_enabled'] = true
gitlab_rails['gitlab_email_from'] = 'xx@qq.com'
gitlab_rails['gitlab_email_display_name'] = 'Gitlab'
```





## 其他的都类似



# 测试是否配置成功



```bash
gitlab-rails console

#进入控制台，然后发送邮件
Notify.test_email('xxx@qq.com', '邮件标题', '邮件正文').deliver_now
```



