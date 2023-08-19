## 一、copy模块(重点)

copy模块用于对文件的远程拷贝操作（如把本地的文件拷贝到远程的机器上)

https://docs.ansible.com/ansible/latest/modules/copy_module.html#copy-module

| 参数     | 说明                                                   |
| -------- | ------------------------------------------------------ |
| src      | 文件源路径                                             |
| dest     | 目标路径                                               |
| content  | 往目标文件输入内容                                     |
| force    | 强制 yes or no                                         |
| backup   | 是否备份有冲突的源文件[文件名相同，内容不同] yes or no |
| checksum | 拷贝完整性校验，使用sha1sum生成校验码                  |
| owner    | 目标文件所有者                                         |
| group    | 目标文件所属组                                         |
| mode     | 目标文件权限                                           |

**拷贝manage01机器/root/readme文件到group1组的机器。**

1. 要求校验完整性，注意[checksum 是根据sha1算法做校验的]
2. 所有者、所属组都是sko
3. 权限0400

```
[root@manage01 ~]# sha1sum readme 
f8182e9ccdbe6efd13eb36a056a7db203fe66e40  readme
[root@manage01 ~]# ansible -m copy group1 -a "src=/root/readme dest=/opt checksum=f8182e9ccdbe6efd13eb36a056a7db203fe66e40 owner=sko group=sko mode=0400"
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "dest": "/opt/readme",
    "gid": 1000,
    "group": "sko",
    "md5sum": "f8c2686842f9fa79361e8928867a1983",
    "mode": "0400",
    "owner": "sko",
    "size": 1214,
    "src": "/root/.ansible/tmp/ansible-tmp-1571366236.6664524-201027506158575/source",
    "state": "file",
    "uid": 1000
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "dest": "/opt/readme",
    "gid": 1001,
    "group": "sko",
    "md5sum": "f8c2686842f9fa79361e8928867a1983",
    "mode": "0400",
    "owner": "sko",
    "size": 1214,
    "src": "/root/.ansible/tmp/ansible-tmp-1571366236.6522918-97522631781022/source",
    "state": "file",
    "uid": 1001
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "dest": "/opt/readme",
    "gid": 1001,
    "group": "sko",
    "md5sum": "f8c2686842f9fa79361e8928867a1983",
    "mode": "0400",
    "owner": "sko",
    "size": 1214,
    "src": "/root/.ansible/tmp/ansible-tmp-1571366236.6274443-88161541412737/source",
    "state": "file",
    "uid": 1001
}
```

copy模块拷贝时要注意拷贝目录后面是否带"/"符号

```
/etc/yum.repos.d后面不带/符号，则表示把/etc/yum.repos.d整个目录拷贝到/tmp/目录下
[root@manage01 ~]# ansible group1 -m copy -a 'src=/etc/yum.repos.d dest=/tmp/'
/etc/yum.repos.d/后面带/符号，则表示把/etc/yum.repos.d/目录里的所有文件拷贝到/tmp/目录下
[root@manage01 ~]# ansible group1 -m copy -a 'src=/etc/yum.repos.d/ dest=/tmp/'
```

使用content参数直接往远程文件里写内容（会覆盖原内容）

```
[root@manage01 ~]# ansible -m file group1 -a "path=/tmp/zutuanxue_333 state=touch"
[root@manage01 ~]# ansible -m copy group1 -a "content='baism\nhello world\n' dest=/tmp/zutuanxue_333"
注意:ansible中-a后面的参数里也有引号时，记得要单引双引交叉使用，如果都为双引会出现问题
```

使用force参数控制是否强制覆盖

```
如果目标文件已经存在，则不覆盖
[root@manage01 ~]# ansible group1 -m copy -a "src=/tmp/zutuanxue_222 dest=/tmp/zutuanxue_333 force=no"
如果目标文件已经存在，则会强制覆盖
[root@manage01 ~]# ansible group1 -m copy -a "src=/tmp/zutuanxue_222 dest=/tmp/zutuanxue_333 force=yes"
```

使用backup参数控制是否备份文件

```
backup=yes表示如果拷贝的文件内容与原内容不一样，则会备份一份

如果拷贝过来的文件本机存在，group1的机器上会将/tmp/333备份一份（备份文件命名加上时间），再远程拷贝新的文件为/tmp/333
[root@manage01 ~]# ansible group1 -m copy -a "src=/etc/fstab dest=/tmp/zutuanxue_333 backup=yes"
```

## 二、学习视频

[视频：copy模块](https://www.bilibili.com/video/BV19J41167sM?p=14)