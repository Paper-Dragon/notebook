## 一、group模块

group模块用于管理用户组和用户组属性。

https://docs.ansible.com/ansible/latest/modules/group_module.html#group-module

| 参数                   | 说明         |
| ---------------------- | ------------ |
| name=                  | 组名         |
| state= persent\|absent | 创建\|删除   |
| system= yes\|no        | 是否为系统组 |
| gid                    | gid          |

```
#组创建
[root@manage01 ~]# ansible -m group group1 -a "name=admin gid=4444 state=present"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 4444,
    "name": "admin",
    "state": "present",
    "system": false
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 4444,
    "name": "admin",
    "state": "present",
    "system": false
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 4444,
    "name": "admin",
    "state": "present",
    "system": false
}

#删除组
[root@manage01 ~]# ansible -m group group1 -a "name=admin state=absent"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "name": "admin",
    "state": "absent"
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "name": "admin",
    "state": "absent"
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "name": "admin",
    "state": "absent"
}
```

## 二、学习视频

[视频：group模块](https://www.bilibili.com/video/BV19J41167sM?p=17)