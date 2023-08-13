# swapoff failed: Cannot allocate memory

##  一、报错：

```bash
swapoff -a -v
swapoff /www/swap
swapoff: /www/swap: swapoff failed: Cannot allocate memory
```



## 二、分析

swap分区被使用中，卸载swap分区后本机内存不足以支持现有服务运行

## 三、解决

```bash
[root@VM-17-4-centos ~]# ps auxw|sort -rn -k4|head -40
```



找到占用 swap分区的进程，然后杀掉！ ！