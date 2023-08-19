## 一、yum_repository模块

yum_repository模块用于配置yum仓库。

https://docs.ansible.com/ansible/latest/modules/yum_repository_module.html

| 参数              | 说明                             |
| ----------------- | -------------------------------- |
| name              | 仓库名 name.repo 源的名称 [name] |
| description       | 描述                             |
| baseurl           | 包下载路径                       |
| gpgcheck= 1 or 0  | 包gpg验证                        |
| enabled = yes\|no | 是否开启本源                     |
| state= absent     | 删除源                           |

增加一个/etc/yum.repos.d/dvd.repo配置文件

```
[root@manage01 ~]# ansible -m yum_repository group1 -a "name=dvd description=BaseOS baseurl=file:///mnt/BaseOS gpgcheck=0 enabled=yes"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "repo": "dvd",
    "state": "present"
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "repo": "dvd",
    "state": "present"
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "repo": "dvd",
    "state": "present"
}
```

删除某个yum源

```
[root@manage01 ~]# ansible -m yum_repository group1 -a "name=dvd state=absent"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "repo": "dvd",
    "state": "absent"
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "repo": "dvd",
    "state": "absent"
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "repo": "dvd",
    "state": "absent"
}
```

## 二、学习视频

[视频：yum_repository模块](https://www.bilibili.com/video/BV19J41167sM?p=19)