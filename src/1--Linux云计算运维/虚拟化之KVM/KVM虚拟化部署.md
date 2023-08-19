## 一、 安装配置KVM 相关软件

**检查本机CPU是否支持虚拟化**

intel: 最新linux内核的Intel处理器(含VT虚拟化技术) vmx nx lm

AMD: 含SVM安全虚拟机技术的AMD处理器, 也叫AMD-V svm nx lm

可以使用如下命令检查：

```
[root@zutuanxue ~]# egrep "(vmx|svm)" /proc/cpuinfo|uniq 
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov 
pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb 
rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc 
cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma 
cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave 
avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp 
tpr_shadow vnmi flexpriority ept vpid fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms 
invpcid xsaveopt dtherm ida arat pln pts md_clear flush_l1d
```

如果输出的结果包含 vmx，它是 Intel处理器虚拟机技术标志;如果包含 svm，它是 AMD处理器虚拟机技术标志;。如果你甚么都得不到，那应你的系统并没有支持虚拟化的处理 ，不能使用kvm。另外Linux 发行版本必须在64bit环境中才能使用KVM。

## 二、安装KVM

- 方法一：针对性安装
- 方法二：组包安装

### 2.1、方法一、针对性安装

适合小白理解KVM及每个包的作用，安装更有针对性。

a、安装虚拟化模块

```
[root@zutuanxue ~]# yum module install virt 
```

b、安装 `virt-install` and `virt-viewer` 虚拟机管理工具

```
[root@zutuanxue ~]# yum install virt-install virt-viewer  libvirt virtio-win

##安装包说明
virt    KVM 模块
virt-install	新建虚拟机命令
virt-viewer   连接虚拟机窗口命令
libvirt       核心组件
virtio-win    windows虚拟机的总线
```

c、验证系统虚拟化环境

```
[root@zutuanxue ~]# virt-host-validate
  QEMU: 正在检查 for hardware virtualization                                 : PASS
  QEMU: 正在检查 if device /dev/kvm exists                                   : PASS
  QEMU: 正在检查 if device /dev/kvm is accessible                            : PASS
  QEMU: 正在检查 if device /dev/vhost-net exists                             : PASS
  QEMU: 正在检查 if device /dev/net/tun exists                               : PASS
  QEMU: 正在检查 for cgroup 'cpu' controller support                         : PASS
  QEMU: 正在检查 for cgroup 'cpuacct' controller support                     : PASS
  QEMU: 正在检查 for cgroup 'cpuset' controller support                      : PASS
  QEMU: 正在检查 for cgroup 'memory' controller support                      : PASS
  QEMU: 正在检查 for cgroup 'devices' controller support                     : PASS
  QEMU: 正在检查 for cgroup 'blkio' controller support                       : PASS
  QEMU: 正在检查 for device assignment IOMMU support                         : PASS
  QEMU: 正在检查 if IOMMU is enabled by kernel                               : WARN (IOMMU appears to be disabled in kernel. Add intel_iommu=on to kernel cmdline arguments)
```

**FAQ：警告,提示BIOS没有开启IOMMU**

```
 QEMU: 正在检查 for device assignment IOMMU support                         : WARN (No ACPI DMAR table found, IOMMU either disabled in BIOS or not supported by this hardware platform)
```

**解决方案**

```
开启BIOS中CPU的VT-D
```

![VTD.jpg](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601028908483.jpg)

**FAQ:警告，提示系统不支持IOMMU**

```
QEMU: 正在检查 if IOMMU is enabled by kernel                               : WARN (IOMMU appears to be disabled in kernel. Add intel_iommu=on to kernel cmdline arguments)
```

**解决方案**

```
#修改grub配置文件
[root@zutuanxue ~]# cat /etc/default/grub 
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"
GRUB_DEFAULT=saved
GRUB_DISABLE_SUBMENU=true
GRUB_TERMINAL_OUTPUT="console"
GRUB_CMDLINE_LINUX="resume=/dev/mapper/cl-swap rd.lvm.lv=cl/root rd.lvm.lv=cl/swap rhgb quiet intel_iommu=on"
GRUB_DISABLE_RECOVERY="true"
GRUB_ENABLE_BLSCFG=true


倒数第三行
GRUB_CMDLINE_LINUX=    将intel_iommu=on追加到最后

#生效配置文件，会重新生成一个/boot/grub2/grub.cfg
[root@zutuanxue ~]# grub2-mkconfig 


完美解决
[root@zutuanxue ~]# virt-host-validate
  QEMU: 正在检查 for hardware virtualization                                 : PASS
  QEMU: 正在检查 if device /dev/kvm exists                                   : PASS
  QEMU: 正在检查 if device /dev/kvm is accessible                            : PASS
  QEMU: 正在检查 if device /dev/vhost-net exists                             : PASS
  QEMU: 正在检查 if device /dev/net/tun exists                               : PASS
  QEMU: 正在检查 for cgroup 'cpu' controller support                         : PASS
  QEMU: 正在检查 for cgroup 'cpuacct' controller support                     : PASS
  QEMU: 正在检查 for cgroup 'cpuset' controller support                      : PASS
  QEMU: 正在检查 for cgroup 'memory' controller support                      : PASS
  QEMU: 正在检查 for cgroup 'devices' controller support                     : PASS
  QEMU: 正在检查 for cgroup 'blkio' controller support                       : PASS
  QEMU: 正在检查 for device assignment IOMMU support                         : PASS
  QEMU: 正在检查 if IOMMU is enabled by kernel                               : PASS
```

### 2.2、方法二、组包安装

通过yum grouplist 命令直接安装虚拟化一组包，最省事，但是对于小白还是不理解里面到底做了什么。方法一安装几次后熟悉了后续可以直接使用这种方法。

```
[root@zutuanxue ~]# dnf grouplist
上次元数据过期检查：0:21:58 前，执行于 2020年03月11日 星期三 03时37分36秒。
可用环境组：
   服务器
   最小安装
   工作站
   虚拟化主机
   定制操作系统
已安装的环境组：
   带 GUI 的服务器
已安装组：
   容器管理
   无头系统管理
可用组：
   .NET 核心开发
   RPM 开发工具
   开发工具
   图形管理工具
   传统 UNIX 兼容性
   网络服务器
   科学记数法支持
   安全性工具
   智能卡支持
   系统工具
   
 [root@zutuanxue ~]#  yum -y groupinstall  "虚拟化主机"
```

## 三、安装虚拟化管理工具

- virsh
- virt-manager
- web控制台

### 3.1、virsh

命令行下输入virsh命令进入交互模式

```
virsh是由libvirt组件提供，在libvirt-client包中。

#virsh交互界面
virsh # list --all
 Id    名称                         状态
----------------------------------------------------

virsh # list
 Id    名称                         状态
----------------------------------------------------

#shell 命令行下

[root@zutuanxue ~]# virsh list
 Id    名称                         状态
----------------------------------------------------

[root@zutuanxue ~]# virsh list --all
 Id    名称                         状态
----------------------------------------------------
```

### 3.2、virt-manager

```
[root@zutuanxue ~]# yum -y install virt-manager
```

### 3.3、安装web控制台

**a、web控制台介绍**

Web控制台是基于Red Hat Enterprise Linux 8 Web的界面，旨在管理和监视本地系统以及位于网络环境中的Linux服务器。

Web控制台使您可以执行多种管理任务，包括：

- 管理服务
- 管理用户帐号
- 管理和监视系统服务
- 配置网络接口和防火墙
- 查看系统日志
- 管理虚拟机
- 创建诊断报告
- 设置内核转储配置
- 配置SELinux
- 更新软件
- 管理系统订阅

Web控制台使用与终端相同的系统API，并且在终端中执行的操作会立即反映在RHEL Web控制台中。

您可以监视网络环境中系统的日志及其性能（以图形形式显示）。另外，您可以直接在Web控制台中或通过终端更改设置。

**b、查看web控制台式是否安装**

```
[root@zutuanxue ~]# yum info cockpit
上次元数据过期检查：0:04:04 前，执行于 2020年03月11日 星期三 06时34分43秒。
已安装的软件包
名称         : cockpit
版本         : 196.3
发布         : 1.el8
架构         : x86_64
大小         : 52 k
源           : cockpit-196.3-1.el8.src.rpm
仓库         : @System
来自仓库     : BaseOS
概况         : Web Console for Linux servers
URL          : https://cockpit-project.org/
协议         : LGPLv2+
描述         : The Cockpit Web Console enables users to administer GNU/Linux servers using a
             : web browser.
             : 
             : It offers network configuration, log inspection, diagnostic reports, SELinux
             : troubleshooting, interactive command-line sessions, and more.
```

**c、安装cockpit-machines插件**

```
[root@zutuanxue ~]# yum install cockpit
[root@zutuanxue ~]# yum install cockpit-machines -y
[root@zutuanxue ~]#systemctl enable --now cockpit.socket
```

**d、访问web控制台**

```
浏览器选择
```

- 使用以下浏览器之一打开Web控制台：

	- Mozilla Firefox 52及更高版本
	- Google Chrome 57及更高版本
	- Microsoft Edge 16及更高版本

- 系统用户帐户凭据

	RHEL Web控制台使用位于的特定PAM堆栈`/etc/pam.d/cockpit`。通过PAM身份验证，您可以使用系统上任何本地帐户的用户名和密码登录。

	`访问方式`

1. 在网络浏览器中打开网络控制台：

	- 本地： `https://localhost:9090`

	- 远程使用服务器的主机名： `https://example.com:9090`

	- 使用服务器的IP地址远程： `https://192.0.2.2:9090`

		如果使用自签名证书，浏览器将发出警告。检查证书并接受安全例外以继续登录。

		控制台从`/etc/cockpit/ws-certs.d`目录中加载证书，并使用最后一个文件`.cert`（按字母顺序扩展名）。为避免必须授予安全例外，请安装由证书颁发机构（CA）签名的证书。

2. 在登录屏幕中，输入您的系统用户名和密码

![cockpit_web登陆1.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601028974752.png)

登陆成功

![cockpit_web登陆成功.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/25/1601028993558.png)