## 一、file模块(重点)

file模块用于对文件或文件夹相关的操作，主要用来设置文件、链接、目录的属性，或者移除文件、链接、目录，很多其他的模块也会包含这种作用，例如copy，assemble和template。

https://docs.ansible.com/ansible/latest/modules/file_module.html#file-module

| 参数    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| path    | 文件绝对路径                                                 |
| state   | 操作(touch文件新建、absent删除、link软连接、hard硬链接、directory目录创建) |
| owner   | 设置所有者                                                   |
| group   | 设置所属的组                                                 |
| mode    | 权限 0000                                                    |
| recurse | 递归 yes or no                                               |

**文件的创建**

在所有的业务机器的/tmp下创建一个文件：zutuanxue

```
[root@manage01 ~]# ansible -m file group1 -a "path=/tmp/zutuanxue state=touch"
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "dest": "/tmp/zutuanxue",
    "gid": 0,
    "group": "root",
    "mode": "0644",
    "owner": "root",
    "size": 0,
    "state": "file",
    "uid": 0
}
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "dest": "/tmp/zutuanxue",
    "gid": 0,
    "group": "root",
    "mode": "0644",
    "owner": "root",
    "size": 0,
    "state": "file",
    "uid": 0
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "dest": "/tmp/zutuanxue",
    "gid": 0,
    "group": "root",
    "mode": "0644",
    "owner": "root",
    "size": 0,
    "state": "file",
    "uid": 0
}
```

**文件的删除**

将node1(192.168.98.201)机器的/tmp/zutuanxue文件删除

```
[root@manage01 ~]# ansible -m file 192.168.98.201 -a "path=/tmp/zutuanxue state=absent"
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "path": "/tmp/zutuanxue",
    "state": "absent"
}
```

**文件权限**

修改node2机器文件/tmp/zutuanxue:

所有者:sko

所属组:nobody

权限:600

```
[root@manage01 ~]# ansible -m file 192.168.98.202 -a "path=/tmp/zutuanxue owner=sko group=nobody mode=0600"
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 65534,
    "group": "nobody",
    "mode": "0600",
    "owner": "sko",
    "path": "/tmp/zutuanxue",
    "size": 0,
    "state": "file",
    "uid": 1001
}

###执行前提:192.168.98.202 有sko用户
```

**创建链接文件[软连接、硬链接]**

为node2机器的/tmp/zutuanxue文件创建以下链接

软连接 /tmp/zutuanxue_com

硬链接 /tmp/zutuanxue_com_cn

```
#软连接
[root@manage01 ~]# ansible -m file 192.168.98.202 -a "src=/tmp/zutuanxue path=/tmp/zutuanxue_com state=link"
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "dest": "/tmp/zutuanxue_com",
    "gid": 0,
    "group": "root",
    "mode": "0777",
    "owner": "root",
    "size": 13,
    "src": "/tmp/zutuanxue",
    "state": "link",
    "uid": 0
}

#硬链接
[root@manage01 ~]# ansible -m file 192.168.98.202 -a "src=/tmp/zutuanxue path=/tmp/zutuanxue_com_cn state=hard"
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "dest": "/tmp/zutuanxue_com_cn",
    "gid": 65534,
    "group": "nobody",
    "mode": "0600",
    "owner": "sko",
    "size": 0,
    "src": "/tmp/zutuanxue",
    "state": "hard",
    "uid": 1001
}
```

**创建一个目录**

为所有的业务机器创建一个目录: /tmp/zutuanxue123

```
[root@manage01 ~]# ansible -m file group1 -a "path=/tmp/zutuanxue123 state=directory"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 0,
    "group": "root",
    "mode": "0755",
    "owner": "root",
    "path": "/tmp/zutuanxue123",
    "size": 6,
    "state": "directory",
    "uid": 0
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 0,
    "group": "root",
    "mode": "0755",
    "owner": "root",
    "path": "/tmp/zutuanxue123",
    "size": 6,
    "state": "directory",
    "uid": 0
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 0,
    "group": "root",
    "mode": "0755",
    "owner": "root",
    "path": "/tmp/zutuanxue123",
    "size": 6,
    "state": "directory",
    "uid": 0
}
```

**修改目录及子文件权限**

设置业务机器的/tmp/zutuanxue123目录及子文件的权限

所有者设置为sko

权限为2775

```
[root@manage01 ~]# ansible -m file group1 -a "path=/tmp/zutuanxue123 owner=sko mode=2755 recurse=yes"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 0,
    "group": "root",
    "mode": "02755",
    "owner": "sko",
    "path": "/tmp/zutuanxue123",
    "size": 19,
    "state": "directory",
    "uid": 1000
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 0,
    "group": "root",
    "mode": "02755",
    "owner": "sko",
    "path": "/tmp/zutuanxue123",
    "size": 19,
    "state": "directory",
    "uid": 1001
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "gid": 0,
    "group": "root",
    "mode": "02755",
    "owner": "sko",
    "path": "/tmp/zutuanxue123",
    "size": 19,
    "state": "directory",
    "uid": 1001
}
```

**删除一个目录[包括子文件全部删除]**

删除所有业务机器的/tmp/zutuanxue123目录

```
[root@manage01 ~]# ansible -m file group1 -a "path=/tmp/zutuanxue123 state=absent"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "path": "/tmp/zutuanxue123",
    "state": "absent"
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "path": "/tmp/zutuanxue123",
    "state": "absent"
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "path": "/tmp/zutuanxue123",
    "state": "absent"
}
```

## 二、学习视频

[视频：file模块](https://www.bilibili.com/video/BV19J41167sM?p=13)