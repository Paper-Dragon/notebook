## 一、script模块

**如何通过ansible执行一个脚本：lamp安装脚本**

script模块：用于在远程机器上执行**本地**脚本。

https://docs.ansible.com/ansible/latest/modules/script_module.html#script-module

```
在manage01上创建脚本，通过ansible将脚本分发到被管理端
[root@manage01 ~]# cat ansible_test.sh 
#!/bin/bash
#ansible script module test script
mkdir /opt/log
find / -name "*.log" -exec cp -rpf {} /opt/log \;


#脚本不用给执行权限
[root@manage01 ~]# ansible -m script group1 -a "/root/ansible_test.sh"


192.168.98.203 | CHANGED => {
    "changed": true,
    "rc": 0,
    "stderr": "Shared connection to 192.168.98.203 closed.\r\n",
    "stderr_lines": [
        "Shared connection to 192.168.98.203 closed."
    ],
    "stdout": "cp: '/opt/log/sssd.log' 与'/opt/log/sssd.log' 为同一文件\r\ncp: '/opt/log/sssd_implicit_files.log' 与'/opt/log/sssd_implicit_files.log' 为同一文件\r\ncp: '/opt/log/sssd_nss.log' 与'/opt/log/sssd_nss.log' 为同一文件\r\ncp: '/opt/log/tuned.log' 与'/opt/log/tuned.log' 为同一文件\r\ncp: '/opt/log/audit.log' 与'/opt/log/audit.log' 为同一文件\r\ncp: '/opt/log/anaconda.log' 与'/opt/log/anaconda.log' 为同一文件\r\ncp: '/opt/log/X.log' 与'/opt/log/X.log' 为同一文件\r\ncp: '/opt/log/program.log' 与'/opt/log/program.log' 为同一文件\r\ncp: '/opt/log/packaging.log' 与'/opt/log/packaging.log' 为同一文件\r\ncp: '/opt/log/storage.log' 与'/opt/log/storage.log' 为同一文件\r\ncp: '/opt/log/ifcfg.log' 与'/opt/log/ifcfg.log' 为同一文件\r\ncp: '/opt/log/lvm.log' 与'/opt/log/lvm.log' 为同一文件\r\ncp: '/opt/log/dnf.librepo.log' 与'/opt/log/dnf.librepo.log' 为同一文件\r\ncp: '/opt/log/hawkey.log' 与'/opt/log/hawkey.log' 为同一文件\r\ncp: '/opt/log/dbus.log' 与'/opt/log/dbus.log' 为同一文件\r\ncp: '/opt/log/ks-script-5r3m4old.log' 与'/opt/log/ks-script-5r3m4old.log' 为同一文件\r\ncp: '/opt/log/ks-script-h97m_bc_.log' 与'/opt/log/ks-script-h97m_bc_.log' 为同一文件\r\ncp: '/opt/log/journal.log' 与'/opt/log/journal.log' 为同一文件\r\ncp: '/opt/log/boot.log' 与'/opt/log/boot.log' 为同一文件\r\ncp: '/opt/log/vmware-vmsvc.log' 与'/opt/log/vmware-vmsvc.log' 为同一文件\r\ncp: '/opt/log/dnf.log' 与'/opt/log/dnf.log' 为同一文件\r\ncp: '/opt/log/dnf.rpm.log' 与'/opt/log/dnf.rpm.log' 为同一文件\r\ncp: '/opt/log/vmware-network.3.log' 与'/opt/log/vmware-network.3.log' 为同一文件\r\ncp: '/opt/log/vmware-network.2.log' 与'/opt/log/vmware-network.2.log' 为同一文件\r\ncp: '/opt/log/vmware-network.1.log' 与'/opt/log/vmware-network.1.log' 为同一文件\r\ncp: '/opt/log/vmware-network.log' 与'/opt/log/vmware-network.log' 为同一文件\r\ncp: '/opt/log/rpm.log' 与'/opt/log/rpm.log' 为同一文件\r\n",
    "stdout_lines": [
        "cp: '/opt/log/sssd.log' 与'/opt/log/sssd.log' 为同一文件",
        "cp: '/opt/log/sssd_implicit_files.log' 与'/opt/log/sssd_implicit_files.log' 为同一文件",
        "cp: '/opt/log/sssd_nss.log' 与'/opt/log/sssd_nss.log' 为同一文件",
        "cp: '/opt/log/tuned.log' 与'/opt/log/tuned.log' 为同一文件",
        "cp: '/opt/log/audit.log' 与'/opt/log/audit.log' 为同一文件",
        "cp: '/opt/log/anaconda.log' 与'/opt/log/anaconda.log' 为同一文件",
        "cp: '/opt/log/X.log' 与'/opt/log/X.log' 为同一文件",
        "cp: '/opt/log/program.log' 与'/opt/log/program.log' 为同一文件",
        "cp: '/opt/log/packaging.log' 与'/opt/log/packaging.log' 为同一文件",
        "cp: '/opt/log/storage.log' 与'/opt/log/storage.log' 为同一文件",
        "cp: '/opt/log/ifcfg.log' 与'/opt/log/ifcfg.log' 为同一文件",
        "cp: '/opt/log/lvm.log' 与'/opt/log/lvm.log' 为同一文件",
        "cp: '/opt/log/dnf.librepo.log' 与'/opt/log/dnf.librepo.log' 为同一文件",
        "cp: '/opt/log/hawkey.log' 与'/opt/log/hawkey.log' 为同一文件",
        "cp: '/opt/log/dbus.log' 与'/opt/log/dbus.log' 为同一文件",
        "cp: '/opt/log/ks-script-5r3m4old.log' 与'/opt/log/ks-script-5r3m4old.log' 为同一文件",
        "cp: '/opt/log/ks-script-h97m_bc_.log' 与'/opt/log/ks-script-h97m_bc_.log' 为同一文件",
        "cp: '/opt/log/journal.log' 与'/opt/log/journal.log' 为同一文件",
        "cp: '/opt/log/boot.log' 与'/opt/log/boot.log' 为同一文件",
        "cp: '/opt/log/vmware-vmsvc.log' 与'/opt/log/vmware-vmsvc.log' 为同一文件",
        "cp: '/opt/log/dnf.log' 与'/opt/log/dnf.log' 为同一文件",
        "cp: '/opt/log/dnf.rpm.log' 与'/opt/log/dnf.rpm.log' 为同一文件",
        "cp: '/opt/log/vmware-network.3.log' 与'/opt/log/vmware-network.3.log' 为同一文件",
        "cp: '/opt/log/vmware-network.2.log' 与'/opt/log/vmware-network.2.log' 为同一文件",
        "cp: '/opt/log/vmware-network.1.log' 与'/opt/log/vmware-network.1.log' 为同一文件",
        "cp: '/opt/log/vmware-network.log' 与'/opt/log/vmware-network.log' 为同一文件",
        "cp: '/opt/log/rpm.log' 与'/opt/log/rpm.log' 为同一文件"
    ]
}



192.168.98.202 | CHANGED => {
    "changed": true,
    "rc": 0,
    "stderr": "Shared connection to 192.168.98.202 closed.\r\n",
    "stderr_lines": [
        "Shared connection to 192.168.98.202 closed."
    ],
    "stdout": "cp: '/opt/log/home-75a175cb.log' 与'/opt/log/home-75a175cb.log' 为同一文件\r\ncp: '/opt/log/root-648d48b0.log' 与'/opt/log/root-648d48b0.log' 为同一文件\r\ncp: '/opt/log/audit.log' 与'/opt/log/audit.log' 为同一文件\r\ncp: '/opt/log/sssd.log' 与'/opt/log/sssd.log' 为同一文件\r\ncp: '/opt/log/sssd_implicit_files.log' 与'/opt/log/sssd_implicit_files.log' 为同一文件\r\ncp: '/opt/log/sssd_nss.log' 与'/opt/log/sssd_nss.log' 为同一文件\r\ncp: '/opt/log/sssd_kcm.log' 与'/opt/log/sssd_kcm.log' 为同一文件\r\ncp: '/opt/log/tuned.log' 与'/opt/log/tuned.log' 为同一文件\r\ncp: '/opt/log/anaconda.log' 与'/opt/log/anaconda.log' 为同一文件\r\ncp: '/opt/log/X.log' 与'/opt/log/X.log' 为同一文件\r\ncp: '/opt/log/program.log' 与'/opt/log/program.log' 为同一文件\r\ncp: '/opt/log/packaging.log' 与'/opt/log/packaging.log' 为同一文件\r\ncp: '/opt/log/storage.log' 与'/opt/log/storage.log' 为同一文件\r\ncp: '/opt/log/ifcfg.log' 与'/opt/log/ifcfg.log' 为同一文件\r\ncp: '/opt/log/lvm.log' 与'/opt/log/lvm.log' 为同一文件\r\ncp: '/opt/log/dnf.librepo.log' 与'/opt/log/dnf.librepo.log' 为同一文件\r\ncp: '/opt/log/hawkey.log' 与'/opt/log/hawkey.log' 为同一文件\r\ncp: '/opt/log/dbus.log' 与'/opt/log/dbus.log' 为同一文件\r\ncp: '/opt/log/ks-script-fx6j2w7d.log' 与'/opt/log/ks-script-fx6j2w7d.log' 为同一文件\r\ncp: '/opt/log/ks-script-igqtd8i1.log' 与'/opt/log/ks-script-igqtd8i1.log' 为同一文件\r\ncp: '/opt/log/journal.log' 与'/opt/log/journal.log' 为同一文件\r\ncp: '/opt/log/boot.log' 与'/opt/log/boot.log' 为同一文件\r\ncp: '/opt/log/vmware-vmsvc.log' 与'/opt/log/vmware-vmsvc.log' 为同一文件\r\ncp: '/opt/log/Xorg.9.log' 与'/opt/log/Xorg.9.log' 为同一文件\r\ncp: '/opt/log/vmware-vmusr.log' 与'/opt/log/vmware-vmusr.log' 为同一文件\r\ncp: '/opt/log/dnf.log' 与'/opt/log/dnf.log' 为同一文件\r\ncp: '/opt/log/dnf.rpm.log' 与'/opt/log/dnf.rpm.log' 为同一文件\r\ncp: '/opt/log/vmware-network.3.log' 与'/opt/log/vmware-network.3.log' 为同一文件\r\ncp: '/opt/log/vmware-network.2.log' 与'/opt/log/vmware-network.2.log' 为同一文件\r\ncp: '/opt/log/vmware-network.1.log' 与'/opt/log/vmware-network.1.log' 为同一文件\r\ncp: '/opt/log/vmware-network.log' 与'/opt/log/vmware-network.log' 为同一文件\r\ncp: '/opt/log/rpm.log' 与'/opt/log/rpm.log' 为同一文件\r\n",
    "stdout_lines": [
        "cp: '/opt/log/home-75a175cb.log' 与'/opt/log/home-75a175cb.log' 为同一文件",
        "cp: '/opt/log/root-648d48b0.log' 与'/opt/log/root-648d48b0.log' 为同一文件",
        "cp: '/opt/log/audit.log' 与'/opt/log/audit.log' 为同一文件",
        "cp: '/opt/log/sssd.log' 与'/opt/log/sssd.log' 为同一文件",
        "cp: '/opt/log/sssd_implicit_files.log' 与'/opt/log/sssd_implicit_files.log' 为同一文件",
        "cp: '/opt/log/sssd_nss.log' 与'/opt/log/sssd_nss.log' 为同一文件",
        "cp: '/opt/log/sssd_kcm.log' 与'/opt/log/sssd_kcm.log' 为同一文件",
        "cp: '/opt/log/tuned.log' 与'/opt/log/tuned.log' 为同一文件",
        "cp: '/opt/log/anaconda.log' 与'/opt/log/anaconda.log' 为同一文件",
        "cp: '/opt/log/X.log' 与'/opt/log/X.log' 为同一文件",
        "cp: '/opt/log/program.log' 与'/opt/log/program.log' 为同一文件",
        "cp: '/opt/log/packaging.log' 与'/opt/log/packaging.log' 为同一文件",
        "cp: '/opt/log/storage.log' 与'/opt/log/storage.log' 为同一文件",
        "cp: '/opt/log/ifcfg.log' 与'/opt/log/ifcfg.log' 为同一文件",
        "cp: '/opt/log/lvm.log' 与'/opt/log/lvm.log' 为同一文件",
        "cp: '/opt/log/dnf.librepo.log' 与'/opt/log/dnf.librepo.log' 为同一文件",
        "cp: '/opt/log/hawkey.log' 与'/opt/log/hawkey.log' 为同一文件",
        "cp: '/opt/log/dbus.log' 与'/opt/log/dbus.log' 为同一文件",
        "cp: '/opt/log/ks-script-fx6j2w7d.log' 与'/opt/log/ks-script-fx6j2w7d.log' 为同一文件",
        "cp: '/opt/log/ks-script-igqtd8i1.log' 与'/opt/log/ks-script-igqtd8i1.log' 为同一文件",
        "cp: '/opt/log/journal.log' 与'/opt/log/journal.log' 为同一文件",
        "cp: '/opt/log/boot.log' 与'/opt/log/boot.log' 为同一文件",
        "cp: '/opt/log/vmware-vmsvc.log' 与'/opt/log/vmware-vmsvc.log' 为同一文件",
        "cp: '/opt/log/Xorg.9.log' 与'/opt/log/Xorg.9.log' 为同一文件",
        "cp: '/opt/log/vmware-vmusr.log' 与'/opt/log/vmware-vmusr.log' 为同一文件",
        "cp: '/opt/log/dnf.log' 与'/opt/log/dnf.log' 为同一文件",
        "cp: '/opt/log/dnf.rpm.log' 与'/opt/log/dnf.rpm.log' 为同一文件",
        "cp: '/opt/log/vmware-network.3.log' 与'/opt/log/vmware-network.3.log' 为同一文件",
        "cp: '/opt/log/vmware-network.2.log' 与'/opt/log/vmware-network.2.log' 为同一文件",
        "cp: '/opt/log/vmware-network.1.log' 与'/opt/log/vmware-network.1.log' 为同一文件",
        "cp: '/opt/log/vmware-network.log' 与'/opt/log/vmware-network.log' 为同一文件",
        "cp: '/opt/log/rpm.log' 与'/opt/log/rpm.log' 为同一文件"
    ]
}


192.168.98.201 | CHANGED => {
    "changed": true,
    "rc": 0,
    "stderr": "Shared connection to 192.168.98.201 closed.\r\n",
    "stderr_lines": [
        "Shared connection to 192.168.98.201 closed."
    ],
    "stdout": "cp: '/opt/log/home-2b167fc1.log' 与'/opt/log/home-2b167fc1.log' 为同一文件\r\ncp: '/opt/log/root-836d3cf3.log' 与'/opt/log/root-836d3cf3.log' 为同一文件\r\ncp: '/opt/log/audit.log' 与'/opt/log/audit.log' 为同一文件\r\ncp: '/opt/log/sssd_implicit_files.log' 与'/opt/log/sssd_implicit_files.log' 为同一文件\r\ncp: '/opt/log/sssd_kcm.log' 与'/opt/log/sssd_kcm.log' 为同一文件\r\ncp: '/opt/log/sssd_nss.log' 与'/opt/log/sssd_nss.log' 为同一文件\r\ncp: '/opt/log/sssd.log' 与'/opt/log/sssd.log' 为同一文件\r\ncp: '/opt/log/tuned.log' 与'/opt/log/tuned.log' 为同一文件\r\ncp: '/opt/log/anaconda.log' 与'/opt/log/anaconda.log' 为同一文件\r\ncp: '/opt/log/X.log' 与'/opt/log/X.log' 为同一文件\r\ncp: '/opt/log/program.log' 与'/opt/log/program.log' 为同一文件\r\ncp: '/opt/log/packaging.log' 与'/opt/log/packaging.log' 为同一文件\r\ncp: '/opt/log/storage.log' 与'/opt/log/storage.log' 为同一文件\r\ncp: '/opt/log/ifcfg.log' 与'/opt/log/ifcfg.log' 为同一文件\r\ncp: '/opt/log/lvm.log' 与'/opt/log/lvm.log' 为同一文件\r\ncp: '/opt/log/dnf.librepo.log' 与'/opt/log/dnf.librepo.log' 为同一文件\r\ncp: '/opt/log/hawkey.log' 与'/opt/log/hawkey.log' 为同一文件\r\ncp: '/opt/log/dbus.log' 与'/opt/log/dbus.log' 为同一文件\r\ncp: '/opt/log/ks-script-ai28ecf4.log' 与'/opt/log/ks-script-ai28ecf4.log' 为同一文件\r\ncp: '/opt/log/ks-script-k4vgo8wr.log' 与'/opt/log/ks-script-k4vgo8wr.log' 为同一文件\r\ncp: '/opt/log/journal.log' 与'/opt/log/journal.log' 为同一文件\r\ncp: '/opt/log/boot.log' 与'/opt/log/boot.log' 为同一文件\r\ncp: '/opt/log/vmware-vmsvc.log' 与'/opt/log/vmware-vmsvc.log' 为同一文件\r\ncp: '/opt/log/Xorg.9.log' 与'/opt/log/Xorg.9.log' 为同一文件\r\ncp: '/opt/log/vmware-vmusr.log' 与'/opt/log/vmware-vmusr.log' 为同一文件\r\ncp: '/opt/log/dnf.log' 与'/opt/log/dnf.log' 为同一文件\r\ncp: '/opt/log/dnf.rpm.log' 与'/opt/log/dnf.rpm.log' 为同一文件\r\ncp: '/opt/log/vmware-network.6.log' 与'/opt/log/vmware-network.6.log' 为同一文件\r\ncp: '/opt/log/vmware-network.5.log' 与'/opt/log/vmware-network.5.log' 为同一文件\r\ncp: '/opt/log/vmware-network.4.log' 与'/opt/log/vmware-network.4.log' 为同一文件\r\ncp: '/opt/log/vmware-network.3.log' 与'/opt/log/vmware-network.3.log' 为同一文件\r\ncp: '/opt/log/vmware-network.2.log' 与'/opt/log/vmware-network.2.log' 为同一文件\r\ncp: '/opt/log/vmware-network.1.log' 与'/opt/log/vmware-network.1.log' 为同一文件\r\ncp: '/opt/log/vmware-network.log' 与'/opt/log/vmware-network.log' 为同一文件\r\ncp: '/opt/log/rpm.log' 与'/opt/log/rpm.log' 为同一文件\r\ncp: '/opt/log/error.log' 与'/opt/log/error.log' 为同一文件\r\ncp: '/opt/log/access.log' 与'/opt/log/access.log' 为同一文件\r\n",
    "stdout_lines": [
        "cp: '/opt/log/home-2b167fc1.log' 与'/opt/log/home-2b167fc1.log' 为同一文件",
        "cp: '/opt/log/root-836d3cf3.log' 与'/opt/log/root-836d3cf3.log' 为同一文件",
        "cp: '/opt/log/audit.log' 与'/opt/log/audit.log' 为同一文件",
        "cp: '/opt/log/sssd_implicit_files.log' 与'/opt/log/sssd_implicit_files.log' 为同一文件",
        "cp: '/opt/log/sssd_kcm.log' 与'/opt/log/sssd_kcm.log' 为同一文件",
        "cp: '/opt/log/sssd_nss.log' 与'/opt/log/sssd_nss.log' 为同一文件",
        "cp: '/opt/log/sssd.log' 与'/opt/log/sssd.log' 为同一文件",
        "cp: '/opt/log/tuned.log' 与'/opt/log/tuned.log' 为同一文件",
        "cp: '/opt/log/anaconda.log' 与'/opt/log/anaconda.log' 为同一文件",
        "cp: '/opt/log/X.log' 与'/opt/log/X.log' 为同一文件",
        "cp: '/opt/log/program.log' 与'/opt/log/program.log' 为同一文件",
        "cp: '/opt/log/packaging.log' 与'/opt/log/packaging.log' 为同一文件",
        "cp: '/opt/log/storage.log' 与'/opt/log/storage.log' 为同一文件",
        "cp: '/opt/log/ifcfg.log' 与'/opt/log/ifcfg.log' 为同一文件",
        "cp: '/opt/log/lvm.log' 与'/opt/log/lvm.log' 为同一文件",
        "cp: '/opt/log/dnf.librepo.log' 与'/opt/log/dnf.librepo.log' 为同一文件",
        "cp: '/opt/log/hawkey.log' 与'/opt/log/hawkey.log' 为同一文件",
        "cp: '/opt/log/dbus.log' 与'/opt/log/dbus.log' 为同一文件",
        "cp: '/opt/log/ks-script-ai28ecf4.log' 与'/opt/log/ks-script-ai28ecf4.log' 为同一文件",
        "cp: '/opt/log/ks-script-k4vgo8wr.log' 与'/opt/log/ks-script-k4vgo8wr.log' 为同一文件",
        "cp: '/opt/log/journal.log' 与'/opt/log/journal.log' 为同一文件",
        "cp: '/opt/log/boot.log' 与'/opt/log/boot.log' 为同一文件",
        "cp: '/opt/log/vmware-vmsvc.log' 与'/opt/log/vmware-vmsvc.log' 为同一文件",
        "cp: '/opt/log/Xorg.9.log' 与'/opt/log/Xorg.9.log' 为同一文件",
        "cp: '/opt/log/vmware-vmusr.log' 与'/opt/log/vmware-vmusr.log' 为同一文件",
        "cp: '/opt/log/dnf.log' 与'/opt/log/dnf.log' 为同一文件",
        "cp: '/opt/log/dnf.rpm.log' 与'/opt/log/dnf.rpm.log' 为同一文件",
        "cp: '/opt/log/vmware-network.6.log' 与'/opt/log/vmware-network.6.log' 为同一文件",
        "cp: '/opt/log/vmware-network.5.log' 与'/opt/log/vmware-network.5.log' 为同一文件",
        "cp: '/opt/log/vmware-network.4.log' 与'/opt/log/vmware-network.4.log' 为同一文件",
        "cp: '/opt/log/vmware-network.3.log' 与'/opt/log/vmware-network.3.log' 为同一文件",
        "cp: '/opt/log/vmware-network.2.log' 与'/opt/log/vmware-network.2.log' 为同一文件",
        "cp: '/opt/log/vmware-network.1.log' 与'/opt/log/vmware-network.1.log' 为同一文件",
        "cp: '/opt/log/vmware-network.log' 与'/opt/log/vmware-network.log' 为同一文件",
        "cp: '/opt/log/rpm.log' 与'/opt/log/rpm.log' 为同一文件",
        "cp: '/opt/log/error.log' 与'/opt/log/error.log' 为同一文件",
        "cp: '/opt/log/access.log' 与'/opt/log/access.log' 为同一文件"
    ]
}
```

## 二、学习视频

[视频：script模块](https://www.bilibili.com/video/BV19J41167sM?p=22)