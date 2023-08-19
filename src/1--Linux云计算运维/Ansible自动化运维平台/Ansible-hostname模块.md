## 一、hostname模块

hostname模块用于修改主机名（**注意**: 它不能修改/etc/hosts文件)

https://docs.ansible.com/ansible/latest/modules/hostname_module.html#hostname-module

```
将192.168.98.203机器的主机名修改为zutuanxue_node3

[root@manage01 ~]# ansible -m hostname -a "name=zutuanxue_node3" 192.168.98.203
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "ansible_domain": "",
        "ansible_fqdn": "zutuanxue_node3",
        "ansible_hostname": "zutuanxue_node3",
        "ansible_nodename": "zutuanxue_node3",
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "name": "zutuanxue_node3"
}


备注：批量修改需要使用playbook剧本
```

## 二、学习视频

[视频：hostname模块](https://www.bilibili.com/video/BV19J41167sM?p=12)