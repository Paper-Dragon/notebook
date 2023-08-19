## 一、访问控制介绍

生产环境中，我们的网站分为公站和私站，公站我们巴不得所有人都能来访问，所以不会做任何访问限制。但是私站只是内部人访问，越安全越好，比如网站后台、比如公司数据站等等。所以我们需要通过设置访问控制来允许自己公司电脑或者IP登陆访问，其他人不能访问。

其实这个功能类似于防火墙，可以但是使用起来更加灵活。只针对本站做限制，不影响其他业务。

## 二、访问控制实现

#### 指令介绍

**Require 指令**

\#Require all denied 拒绝所有

\#Require all granted 允许所有

\#Require host address 允许主机域名 多个空格空开

\#Require ip ip.address 允许ip或网段 多个空格空开

**容器<RequireAny> <RequireAll> <requirenone>**

只要一个成功即可就通过

<RequireAny>和</RequireAny>用于包含一组授权指令，其中一个指令必须成功才能使<RequireAny>指令成功。

所有指令都生效才通过

<RequireAll>和</RequireAll>用于包含一组授权指令，其中无一个指令必须失败，并且至少有一个指令必须成功才能使<RequireAll>指令成功。

所有指令都不生效才通过

<requirenone>和</requirenone>用于包含一组授权指令，其中无一个指令必须成功才能使<requirenone>指令不失败。

#### 实现代码

```
<Directory "/usr/local/apache/htdocs/web1/b">
    AllowOverride None
    #apache2.4新方法
    Require all denied
    Require ip 192.168.11.24 192.168.11.251
    Require host www.ayitula.com

    #apache2.2老方法
    ##The Allow, Deny, and Order directives, provided by mod_access_compat
    #Order deny,allow
    #Deny from all
    #Allow from 192.168.11.23

</Directory>
```