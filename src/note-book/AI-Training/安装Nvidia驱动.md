# 安装Nvidia驱动

## 安装驱动依赖

```bash
apt install gcc g++ make -y

# 删除原有开源驱动包
apt-get remove --purge nvidia*
```

## 安装驱动

```bash
apt install nvidia-driver-470 -y  # 其中470 为版本号

# 重启来激活启动
reboot
```

## 检查是否安装成功

```bash
nvidia-smi


wwh@wwh-desktop:~$ nvidia-smi
Sun Dec  4 15:18:47 2022
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 470.161.03   Driver Version: 470.161.03   CUDA Version: 11.4     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
| 32%   11C    P8     5W / 200W |    143MiB /  7979MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A       760      G   /usr/lib/xorg/Xorg                 98MiB |
|    0   N/A  N/A      1037      G   /usr/bin/gnome-shell               43MiB |
+-----------------------------------------------------------------------------+

```





