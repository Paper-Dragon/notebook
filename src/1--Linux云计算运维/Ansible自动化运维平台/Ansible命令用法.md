ansible是基于模块工作的，本身没有批量部署的能力。真正具有批量部署的是ansible所运行的模块，ansible只是提供一种框架。

ansible支持的模块非常的多，我们并不需要把每个模块都记住，而只需要熟悉一些常见的模块，其它的模块在需要用到时再查询即可。

## 一、ansible命令用法

```
ansible 机器  -m 模块名称 -a '模块参数'
基本格式为: ansible 操作的机器名或组名 -m 模块名 -a "参数1=值1 参数2=值2"
```

**查看所有支持的模块**

```
# ansible-doc -l		
a10_server                                           Manage A10 Networks AX/SoftAX...
a10_server_axapi3                                    Manage A10 Networks AX/SoftAX...
a10_service_group                                    Manage A10 Networks AX/SoftAX...
a10_virtual_server                                   Manage A10 Networks AX/SoftAX...
aci_aaa_user                                         Manage AAA users (aaa:User)
.......

如果要查看ping模块的用法，使用下面命令（其它模块以此类推)
# ansible-doc ping
```

官网模块文档地址: https://docs.ansible.com/ansible/latest/modules/list_of_all_modules.html

## 二、ansible常见模块

- hostname模块
- file模块
- copy模块
- fetch模块
- user模块
- group模块
- cron模块
- yum_repository模块
- yum模块
- service模块
- script模块
- command模块
- shell模块
- setup模块
- stat模块

## 三、学习视频

[视频：ansible 命令语法与常见模块介绍](https://www.bilibili.com/video/BV19J41167sM?p=11)