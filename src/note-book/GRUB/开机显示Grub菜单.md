# 开机显示Grub菜单

## 开机显示菜单

/etc/default/grub

```c
GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=menu # default:menu config hidden
GRUB_TIMEOUT=6 # default:0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT=""
GRUB_CMDLINE_LINUX=""
```

```bash
update-grub
```

## 让用户在Grub开机菜单选定的开机项目自动成为默认值

```c
GRUB_SAVEDEFAULT=true
GRUB_DEFAULT=saved
```

```bash
 grub-mkconfig -o /boot/grub/grub.cfg 
```

