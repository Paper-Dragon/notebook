## 一、fetch模块

fetch模块与copy模块类似，但作用相反。用于把远程机器的文件拷贝到本地。

https://docs.ansible.com/ansible/latest/modules/fetch_module.html#fetch-module

将group1组机器的/opt/readme 拷贝到manage01的/opt目录

注意:不管是拷贝多个机器还是一个机器的文件，在管理机本地目录都会按照

 IP/路径/文件名

的方式命名，防止冲突

```
[root@manage01 ~]#  ansible -m fetch group1 -a "src=/opt/readme dest=/opt"
192.168.98.203 | CHANGED => {
    "changed": true,
    "checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "dest": "/opt/192.168.98.203/opt/readme",
    "md5sum": "f8c2686842f9fa79361e8928867a1983",
    "remote_checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "remote_md5sum": null
}
192.168.98.202 | CHANGED => {
    "changed": true,
    "checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "dest": "/opt/192.168.98.202/opt/readme",
    "md5sum": "f8c2686842f9fa79361e8928867a1983",
    "remote_checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "remote_md5sum": null
}
192.168.98.201 | CHANGED => {
    "changed": true,
    "checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "dest": "/opt/192.168.98.201/opt/readme",
    "md5sum": "f8c2686842f9fa79361e8928867a1983",
    "remote_checksum": "f8182e9ccdbe6efd13eb36a056a7db203fe66e40",
    "remote_md5sum": null
}
```

## 二、学习视频

[视频：fetch模块](https://www.bilibili.com/video/BV19J41167sM?p=15)