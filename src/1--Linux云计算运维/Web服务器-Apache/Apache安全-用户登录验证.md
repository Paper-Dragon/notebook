## 一、登录验证

当用户访问网站或者网站某个目录时，如果希望用户提供授权才能登录，那么就需要针对该站或者该目录设置登录验证了。apache提供了该功能，可以让我们针对站点或目录设置登录验证。这样用户访问网站时需要提交账号密码才能登录。

## 二、登录验证实现

#### 1）修改apache配置文件

```
<Directory "/usr/local/apache/htdocs/web1/a">

AuthName "Private"

AuthType Basic

AuthUserFile "/usr/local/apache/user.dbm"

#访问控制
<RequireAll>

Require valid-user

Require not ip 192.168.11.251

</RequireAll>




#访问控制
#Order deny,allow

#Deny from all

#Allow from 192.168.11.23

</Directory>


# 1) AuthName：定义提示信息，用户访问时提示信息会出现在认证的对话框中
# 2) AuthType：定义认证类型，在HTTP1.0中，只有一种认证类型：basic。在HTTP1.1中有几种认证类型，如：MD5
# 3) AuthUserFile：定义包含用户名和密码的文本文件，每行一对
# 4) AuthGroupFile：定义包含用户组和组成员的文本文件。组成员之间用空格分开，如：group1:user1 user2
# 5) require命令：定义哪些用户或组才能被授权访问。如：
#　　require user user1 user2 (只有用户user1和user2可以访问)
#　　requires groups group1 (只有group1中的成员可以访问)
#　　require valid-user (在AuthUserFile指定的文件中的所有用户都可以访问)
```

#### 2）生成用户验证文件

[root@apache_251 extra]# /usr/local/apache/bin/htpasswd -cm /usr/local/apache/user.dbm baism

New password:

Re-type new password:

Adding password for user baism

#### 3）查看文件内容 用户名：秘钥

[root@apache_251 extra]# cat /usr/local/apache/user.dbm

baism:apr1apr1.XawVas2$8Bn7rJFJjGLDZ.63fSiYV1

#### 4）设置站点验证目录

[root@apache_251 extra]# mkdir /usr/local/apache/htdocs/web1/a

[root@apache_251 extra]# touch /usr/local/apache/htdocs/web1/a/file{a…z}

#### 5）重启apache并测试