## 一、user模块

user模块用于管理用户账号和用户属性

https://docs.ansible.com/ansible/latest/modules/user_module.html#user-module

| 常用参数                  | 说明                                                       |
| ------------------------- | ---------------------------------------------------------- |
| name=""                   | 指定用户名                                                 |
| password=""               | 指定密码,必须是密文                                        |
| state= absent\|present    | 删除\|创建                                                 |
| system= yes\|no           | 是否为系统用户                                             |
| shell=""                  | 指定登陆shell                                              |
| generate_ssh_key= yes\|no | 是否创建秘钥对                                             |
| uid=                      | 指定用户的uid                                              |
| append= yes\|no           | 用户是否追加到其他组                                       |
| group=                    | 用户属组                                                   |
| groups=                   | 将现有用户加入到某个组，空值就会把该用户从所有所属组中删除 |
| create_home= yes\|no      | 是否建立家目录                                             |
| remove= yes\|no           | 删除家目录                                                 |

**创建一个用户sky，密码是123**

**要求是系统用户**

**非交互式登陆**

**要求生成自己的秘钥对**

**不创建家目录**

```
#密码必须是密文，所以先要把明文转换一下，生成md5密文
[root@manage01 ~]# echo 123|openssl passwd -1 -stdin
$1$5V.qzSEd$Yr08MU8K.vXeBZcmavypk1
[root@manage01 ~]# ansible -m user group1 -a 'name=sky password="$1$5V.qzSEd$Yr08MU8K.vXeBZcmavypk1" state=present system=yes shell=/sbin/nologin generate_ssh_key=yes'
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "comment": "",
    "create_home": true,
    "group": 991,
    "home": "/home/sky",
    "name": "sky",
    "password": "NOT_LOGGING_PASSWORD",
    "shell": "/sbin/nologin",
    "ssh_fingerprint": "2048 SHA256:b2umG0XfPW0cGAFBFDBNBNbtgaY+s1X4cM334JCGGOo ansible-generated on node3 (RSA)",
    "ssh_key_file": "/home/sky/.ssh/id_rsa",
    "ssh_public_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDIvVcTDxT4GotFYolpPPJUS2XYEmgaxCj/YLXfW2vllXJSfa3TwBLN6kJnPBabVFSYCiGRzci28f/rx4chm9TuVsNx6TozzUpolD+T3vzO/rcLdaIEzw+JYXGtqpaTapuuhm6pdQBx04TLmO3pVWBCdbJum0paMIXwPDcGPGz6JwGXWTdA5AXfvWmOZ5ChwwLDUau84R47FHfj9EisclYM3Yt3WfcVp+waSd23BBRj86jh+veL9BR7OnDmmj7YZkOxAqnU/TjuOW1uiGCB91Flgku7fPR3jmbXXrd+Ql9vWlGe22+xgYYjT4KVzlHAr3lE/HZQu49Vz/N78ZnJ1rX3 ansible-generated on node3",
    "state": "present",
    "system": true,
    "uid": 994
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "comment": "",
    "create_home": true,
    "group": 974,
    "home": "/home/sky",
    "name": "sky",
    "password": "NOT_LOGGING_PASSWORD",
    "shell": "/sbin/nologin",
    "ssh_fingerprint": "2048 SHA256:D2ZhPJV9bdFMtf7EBo3Y5w023xqxDppZxqoe5Z3NVus ansible-generated on node1 (RSA)",
    "ssh_key_file": "/home/sky/.ssh/id_rsa",
    "ssh_public_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD1swS5MAox4o2f3rxe9TPz+AFDnB5Jt+X6Yygpphfetfds37SHSP5K4QcAd1SO6OlHopB3x9FQklS3z6C4bfz5trbK/PR9RCzkkzLamC5BKhNXEV2ozj1m2J/F10umZLSvd3ElEJubkyzV383x7sVi5VtQycemoDLiJiWjHTEcKu/I0bSCliODe57nqgM9+5V+nfeih56Vs+vhTGIxqZ/6FZXKGM9iDiI8VokUlMjhOJz5MuFRr4XsgBvtGNyu/bCbjr8QPdDNX/Wl8IZDjLJNHDno8ixc7Bp6ME2hEr9pnpe+DuKJmsAwl+A52E7eAlm/0pp573mZ4ObHRTQwdgQT ansible-generated on node1",
    "state": "present",
    "system": true,
    "uid": 976
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "comment": "",
    "create_home": true,
    "group": 975,
    "home": "/home/sky",
    "name": "sky",
    "password": "NOT_LOGGING_PASSWORD",
    "shell": "/sbin/nologin",
    "ssh_fingerprint": "2048 SHA256:/VBzZUWcHnLOpMNxq9OXIwD/5IkI9r7smp50s6lByZs ansible-generated on node2 (RSA)",
    "ssh_key_file": "/home/sky/.ssh/id_rsa",
    "ssh_public_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDT/+8y3omHiWSOS9dX1AYcADRp7ZUszOBqZV0/77TZ7mV5X1/T+cdZrsnwAiNbXosjDQjKj0qtIJQR3rLuCv08DV6gjlP4bzDodSekfh1mbGu9EkDu0HD+qmW0/y5Mb4lJbBCMHCVJFrwBnH2+AfVezTVgcf4NHh4zJvASnSfmecmyfFEDEVZIozd0z8hw8NcgcYn8MeDrMhVN+y3xj0IXKwg6E0NindBuxkMYbwehcQo6Sscx9YdCv05SXVU+FjyPOQNzZZUQkmp+5GDy1dib1m5GJ5yIf8IzOh1FISoKz8/FqORRIEp55NRgrGw3ZU/weK0RL9SkXhUc29gcN1ON ansible-generated on node2",
    "state": "present",
    "system": true,
    "uid": 977
}



创建用户baishuming  密码为123456
[root@manage01 ~]# echo "123456"|openssl passwd -1 -stdin
$1$BMPgiHeV$GskMFnvqBL17gTe/us5yK.
[root@manage01 ~]# ansible -m user group1 -a 'name=baishuming password="$1$BMPgiHeV$GskMFnvqBL17gTe/us5yK." uid=4423'

不创建家目录
[root@manage01 ~]# ansible -m user 192.168.98.201 -a "name=baism create_home=no"

要求属组为root
附加组为sko
```

用户删除

```
[root@manage01 ~]# ansible -m user 192.168.98.201 -a "name=baishuming1 state=absent remove=yes"
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    }, 
    "changed": true, 
    "force": false, 
    "name": "baishuming1", 
    "remove": true, 
    "state": "absent"
}
```

## 二、学习视频

[视频：user模块](https://www.bilibili.com/video/BV19J41167sM?p=16)