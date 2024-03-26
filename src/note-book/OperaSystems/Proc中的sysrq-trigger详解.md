# Proc中的sysrq-trigger详解

## 立即重新启动计算机

```bash
echo b > /proc/sysrq-trigger
```



## 立即关闭计算机

```bash
echo o > /proc/sysrq-trigger
```



## 导出内存分配的信息 （可以用/var/log/message 查看）

```bash
echo m > /proc/sysrq-trigger
```



## 导出当前CPU寄存器信息和标志位的信息

```bash
echo p > /proc/sysrq-trigger
```



## 导出线程状态信息

```bash
echo t > /proc/sysrq-trigger
```



## 故意让系统崩溃

```bash
echo c > /proc/sysrq-trigger
```



## 立即重新挂载所有的文件系统 

```bash
echo s > /proc/sysrq-trigger
```



## 立即重新挂载所有的文件系统为只读

```bash
echo u > /proc/sysrq-trigger
```




为了安全起见，在红帽企业版Linux里面，默认SysRq组合键是关闭的。 打开这个功能，运行：

```bash
# echo 1 > /proc/sys/kernel/sysrq
```

关闭这个功能：
```bash
# echo 0 > /proc/sys/kernel/sysrq
```
如果想让此功能一直生效，在/etc/sysctl.conf里面设置kernel.sysrq的值为1. 重新启动以后，此功能将会自动打开。