## 一、stat模块

stat模块类似linux的stat命令，用于获取文件的状态信息。

https://docs.ansible.com/ansible/latest/modules/stat_module.html#stat-module

获取/etc/fstab文件的状态信息

```
[root@manage01 ~]#  ansible -m stat 192.168.98.201 -a "path=/etc/fstab"
192.168.98.201 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": false,
    "stat": {
        "atime": 1571386074.1020715,
        "attr_flags": "",
        "attributes": [],
        "block_size": 4096,
        "blocks": 8,
        "charset": "us-ascii",
        "checksum": "554e387b5bde93c05baa689312e9a8db5579629e",
        "ctime": 1570636725.1020045,
        "dev": 64768,
        "device_type": 0,
        "executable": false,
        "exists": true,
        "gid": 0,
        "gr_name": "root",
        "inode": 16777347,
        "isblk": false,
        "ischr": false,
        "isdir": false,
        "isfifo": false,
        "isgid": false,
        "islnk": false,
        "isreg": true,
        "issock": false,
        "isuid": false,
        "mimetype": "text/plain",
        "mode": "0644",
        "mtime": 1570636308.3990006,
        "nlink": 1,
        "path": "/etc/fstab",
        "pw_name": "root",
        "readable": true,
        "rgrp": true,
        "roth": true,
        "rusr": true,
        "size": 579,
        "uid": 0,
        "version": "1364475400",
        "wgrp": false,
        "woth": false,
        "writeable": true,
        "wusr": true,
        "xgrp": false,
        "xoth": false,
        "xusr": false
    }
}
```

## 二、学习视频

[视频：ansible常用模块知识图谱](https://www.bilibili.com/video/BV19J41167sM?p=25)