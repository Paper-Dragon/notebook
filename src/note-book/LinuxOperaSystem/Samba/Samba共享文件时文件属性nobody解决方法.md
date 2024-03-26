# Samba共享文件时文件属性nobody解决方法



Linux于Windows使用Samba共享文件时文件属性nobody nogroup的解决办法

```bash
vim /etc/samba/smb.conf修改配置文件如下:
在 [global] 放入以下内容
force user = 帐号
force group = 群组
create mask = 0664
directory mask = 0775
存档，重启smbd
sudo service smbd restart
```

