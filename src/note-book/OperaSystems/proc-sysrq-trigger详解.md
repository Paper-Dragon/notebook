# /proc/sysrq-trigger详解

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

