## 一、cron模块

cron模块用于管理周期性时间任务。

https://docs.ansible.com/ansible/latest/modules/cron_module.html#cron-module

| 参数         | 说明                     |
| ------------ | ------------------------ |
| name         | 计划任务的名称           |
| user         | 执行计划任务的用户       |
| job          | 计划任务命令             |
| minute       | 执行计划任务的分 默认为* |
| hour         | 执行计划任务的时 默认为* |
| day          | 执行计划任务的日 默认为* |
| month        | 执行计划任务的月 默认为* |
| week         | 执行计划任务的周 默认为* |
| state absent | 删除计划任务             |

创建一个cron任务,不指定user的话,默认就是root（因为我这里是用root操作的)。
如果minute,hour,day,month,week不指定的话，默认都为*

每天14:23 执行echo “haha”>/tmp/test

```
[root@manage01 ~]# ansible -m cron group1 -a 'name="cron test" user=root job="echo haha > /tmp/test" minute=23 hour=12'
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "envs": [],
    "jobs": [
        "cron test"
    ]
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "envs": [],
    "jobs": [
        "cron test"
    ]
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "envs": [],
    "jobs": [
        "cron test"
    ]
}
```

删除cron任务

```
[root@manage01 ~]# ansible -m cron group1 -a 'name="cron test" state=absent'
192.168.98.203 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "envs": [],
    "jobs": []
}
192.168.98.202 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "envs": [],
    "jobs": []
}
192.168.98.201 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/libexec/platform-python"
    },
    "changed": true,
    "envs": [],
    "jobs": []
}
```

## 二、学习视频

[视频：cron模块](https://www.bilibili.com/video/BV19J41167sM?p=18)