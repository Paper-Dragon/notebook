假设我们要写一个playbook来安装管理lamp环境，那么这个playbook就会写很长。所以我们希望把这个很大的文件分成多个功能拆分, 分成apache管理,php管理,mysql管理，然后在需要使用的时候直接调用就可以了，以免重复写。就类似编程里的模块化的概念，以达到代码复用的效果。

## 一、roles介绍

**roles：** ansible模块，类似于函数，完成一个任务的指令。每一个roles都有自己特定的目录结构，就是通过分别将variables, tasks及handlers等放置于单独的目录中,并可以便捷地调用它们的一种机制。

**roles优点：**

 1）模块中指令较少，方便编写

 2）重复调用方便

3）排错方便

## 二、创建roles的目录结构

```
files：用来存放由copy模块或script模块调用的文件。
tasks：至少有一个main.yml文件，定义各tasks。
handlers:有一个main.yml文件，定义各handlers。
templates：用来存放jinjia2模板。
vars：有一个main.yml文件，定义变量。
meta：有一个main.yml文件，定义此角色的特殊设定及其依赖关系。
```

**注意:** 在每个角色的目录中分别创建files, tasks,handlers,templates,vars和meta目录，用不到的目录可以创建为空目录.

## 三、案例：通过roles实现lamp

分析：需定制三个角色: httpd,mysql,php

### 3.1） 创建roles目录及文件,并确认目录结构

roles/
├── httpd
│ ├── files
│ ├── handlers
│ │ └── main.yml
│ ├── meta
│ │ └── main.yml
│ ├── tasks
│ │ └── main.yml
│ ├── templates
│ └── vars
│ └── main.yml
├── mysql
│ ├── files
│ ├── handlers
│ │ └── main.yml
│ ├── meta
│ │ └── main.yml
│ ├── tasks
│ │ └── main.yml
│ ├── templates
│ └── vars
│ └── main.yml
└── php
├── files
├── handlers
│ └── main.yml
├── meta
│ └── main.yml
├── tasks
│ └── main.yml
├── templates
└── vars
└── main.yml

```
[root@manage01 ansible]# mkdir -p roles/{httpd,mysql,php}/{files,tasks,handlers,templates,vars,meta}
[root@manage01 ansible]# touch roles/{httpd,mysql,php}/{tasks,handlers,vars,meta}/main.yml
[root@manage01 ansible]# tree roles/
roles/
├── httpd
│   ├── files
│   ├── handlers
│   │   └── main.yml
│   ├── meta
│   │   └── main.yml
│   ├── tasks
│   │   └── main.yml
│   ├── templates
│   └── vars
│       └── main.yml
├── mysql
│   ├── files
│   ├── handlers
│   │   └── main.yml
│   ├── meta
│   │   └── main.yml
│   ├── tasks
│   │   └── main.yml
│   ├── templates
│   └── vars
│       └── main.yml
└── php
    ├── files
    ├── handlers
    │   └── main.yml
    ├── meta
    │   └── main.yml
    ├── tasks
    │   └── main.yml
    ├── templates
    └── vars
        └── main.yml

21 directories, 12 files
```

### 3.2）准备httpd服务器的主页文件,php测试页和配置文件等

```
[root@manage01 files]# ls
httpd.conf  phpinfo.php
```

### 3.3）编写httpd角色的main.yml文件

```
[root@manage01 roles]# cat httpd/tasks/main.yml 
- name: httpd httpd-devel httpd-manual软件包安装
  yum: name={{item}} state=latest
  with_items:
    - httpd
    - httpd-devel
    - httpd-manual

- name: 创建apache管理用户 www
  user: name={{user}} state=present


- name: 设置apache开机启动，并启动服务
  service: name=httpd enabled=yes state=started

- name: 拷贝配置文件，初始化业务
  copy: src=/etc/ansible/roles/httpd/files/httpd.conf dest=/etc/httpd/conf/httpd.conf
  #定义通知调用，当配置文件更新,需要重启服务
  notify: 
    - restart apache

- name: 拷贝php测试页面
  copy: src=/etc/ansible/roles/httpd/files/phpinfo.php dest=/var/www/html/

[root@manage01 roles]# cat httpd/vars/main.yml
user: www


[root@manage01 roles]# cat httpd/handlers/main.yml 
- name: restart apache
  service: name=httpd state=restarted
```

### 3.4）编写mysql角色的main.yml文件

```
[root@manage01 ansible]# ls roles/php/files/
www.conf

[root@manage01 roles]# cat mysql/tasks/main.yml 
- name: mysql 用户创建
  user: name={{user}} state=present

- name: mysql 软件安装
  yum: name={{item}} state=latest
  with_items:
    - mariadb
    - mariadb-server

- name: 启动服务，并设置开机启动
  service: name=mariadb enabled=yes state=started

- name: 改变mysql文件的所有者为mysql
  file: path='/usr/lib/mysql' owner={{user}} group={{user}} recurse=yes


[root@manage01 roles]# cat mysql/vars/main.yml 
user: mysql
```

### 3.5）:编写php角色的main.yml文件

```
[root@manage01 ansible]# cat roles/php/tasks/main.yml 
- name: 安装php
  yum: name={{item}} state=latest
  with_items:
    - php
    - php-mysqlnd
    - php-gd
    - php-ldap
    - php-odbc
    - php-pear
    - php-xml
    - php-xmlrpc
    - php-mbstring
    - php-snmp
    - php-soap
    - curl
    - curl-devel 
    - php-bcmath
    - php-fpm

- name: copy www.conf to /etc/php-fpm.d
  copy: src=/etc/ansible/roles/php/files/www.conf dest=/etc/php-fpm.d force=yes
  notify:
    - restart php-fpm


[root@manage01 ansible]# cat roles/php/handlers/main.yml 
- name: restart php-fpm
  service: name=php-fpm state=restarted
    
```

### 3.6）编写lamp的playbook文件调用前面定义好的三个角色

```
[root@manage01 yaml]# cat lamp.yml 
---
- hosts: group1
  remote_user: root
  roles:
  - httpd
  - mysql
  - php
```

### 3.7） 执行lamp的playbook文件

```
[root@manage01 yaml]# ansible-playbook -C lamp.yml
[root@manage01 yaml]# ansible-playbook lamp.yml
```

### 3.8） 测试业务机器

![lamp_test.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601969569380.png)