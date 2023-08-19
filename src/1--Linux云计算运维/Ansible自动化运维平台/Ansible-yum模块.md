## 一、yum模块

yum模块用于使用yum命令来实现软件包的安装与卸载。

https://docs.ansible.com/ansible/latest/modules/yum_module.html#yum-module

| 参数                                           | 说明                                         |
| ---------------------------------------------- | -------------------------------------------- |
| name                                           | 需要安装软件包的名称                         |
| list= installed, updates, available and repos  | 列出已安装 需要更新 可获得的 和 yum源        |
| state= absent removed installed present latest | 删除、删除、安装确认、安装确认、安装最新版本 |

list:列出包信息

```
[root@manage01 ~]# ansible -m yum group1 -a "list=repos"
192.168.98.201 | FAILED! => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false,
    "msg": "同步仓库 'dvd' 缓存失败",
    "rc": 1,
    "results": []
}


原因就是源不好用，这里是cdrom没有挂载光盘
```

使用yum安装一个软件（前提:group1的机器上的yum配置都已经OK）

```
[root@manage01 ~]# ansible -m yum group1 -a "name=vsftpd"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "msg": "",
    "rc": 0,
    "results": [
        "Installed: vsftpd",
        "Installed: vsftpd-3.0.3-28.el8.x86_64"
    ]
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "msg": "",
    "rc": 0,
    "results": [
        "Installed: vsftpd",
        "Installed: vsftpd-3.0.3-28.el8.x86_64"
    ]
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "msg": "",
    "rc": 0,
    "results": [
        "Installed: vsftpd",
        "Installed: vsftpd-3.0.3-28.el8.x86_64"
    ]
}
```

删除软件包

```
[root@manage01 ~]#  ansible -m yum 192.168.98.201 -a "state=absent name=vsftpd"
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "msg": "",
    "rc": 0,
    "results": [
        "Removed: vsftpd-3.0.3-28.el8.x86_64"
    ]
}
```

## 二、学习视频

[视频：yum模块](https://www.bilibili.com/video/BV19J41167sM?p=20)