# zabbix的VMwareGuest补充缺陷

## 主机丢失

**删除**powerstate的自动删除机制，删除这个

```bash
Discard unchanged with heartbeat
```



名称： 主机丢失  Power state no data

表达式： 

```bash
nodata(/VMware Guest/vmware.vm.powerstate[{$VMWARE.URL},{$VMWARE.VM.UUID}],3m)=1
```

恢复表达式

```bash
nodata(/VMware Guest/vmware.vm.powerstate[{$VMWARE.URL},{$VMWARE.VM.UUID}],3m)=0
```

### VMware自动发现主机的自动发现硬盘的自动硬盘警戒

名称 {#FSNAME} 小于 80% 空间不足

问题表达式

```bash
last(/VMware Guest/vmware.vm.vfs.fs.size[{$VMWARE.URL},{$VMWARE.VM.UUID},{#FSNAME},pfree])<20
```

恢复表达式

```bash
last(/VMware Guest/vmware.vm.vfs.fs.size[{$VMWARE.URL},{$VMWARE.VM.UUID},{#FSNAME},pfree])>=20
```

