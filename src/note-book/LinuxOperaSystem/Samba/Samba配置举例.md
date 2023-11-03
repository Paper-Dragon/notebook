# Samba配置举例

```bash
[YOUR-SHARE-NAME]
        path = /home/NAME/
        available = yes
        browsable = yes
        public    = yes
        writable  = yes
```

```c
[YOUR-SHARE-NAME]
	comment = arm ubuntu samba dir
  path = /home	#共享路径
  available = yes
  browseable = yes
  public = yes
  writable = yes
  create mask = 0755
  security = share
#  force user = root				# 若想以root权限登录samba则可以打开这两个注释
#  arm force group = root
  vaild user = “你的用户名”	#用户名
  guest ok = no
```

# samba添加用户

## 1.添加用户

```java
sudo useradd 用户名（用于登录的）
```

## 2.添加samba用户和密码

```java
smbpasswd -a 与步骤一相同的用户名
```

## 3.检查是否添加成功

```java
pdbedit -L
```
