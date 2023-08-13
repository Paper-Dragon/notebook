# 配置

    虚拟机 – VMware Workstation Pro 16
    Linux系统 – Ubuntu 20.04 LTS

# 目的

    硬盘扩容
    硬盘容量从40G 扩容到 100G

效果

查看硬盘大小及使用情况

    终端：df -h

没有扩容前：
![image-20221119125553250](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125553250.png)
成功扩容后：

![image-20221119125601328](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125601328.png)

主要流程

    扩展硬盘大小到100G
    将未分配的60G分配到主分区
    更新UUID值

超详细图文详解扩容步骤

查看磁盘的情况后，关闭客户机，可以看到现在硬盘大小为 ：40G
（注释：虚拟机关机后修改硬盘容量才有效，必须无快照）
![image-20221119125626452](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125626452.png)
步骤说明：

红色下划线表示要操作的部分
红色数字表示操作顺序

鼠标点击硬盘，弹出对话框后，点击扩展，输入扩展后的硬盘大小，我这里扩展到100G
（注释：这里的100G，并不是在原有40G的基础加上100G，而是100G包括了原有的40G）
![image-20221119125643361](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125643361.png)
点击确定（发现 5 写漏了，直接跳到6了，尴尬，但是步骤没错，不用担心)
![image-20221119125652431](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125652431.png)
确认后就可以开启虚拟机了,扩容前需要在虚拟机中安装一个软件 ”Gparted”
终端命令进行安装：

    终端： sudo apt-get install gparted

安装完成后，搜索gparted软件，打开gparted

![image-20221119125703912](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125703912.png)
打开后，可以看到从40G 扩展到 100G 的 60G 处于未分配状态，
现在要做的就是把这60G分配到原有硬盘大小40G的主分区/dev/sda1中
此处分区介绍：

    /dev/sda1 为主分区
    /dev/sda2 为扩展分区
    /dev/sda5 为逻辑分区

磁盘容量与主分区、扩展分区、逻辑分区的关系：
硬盘容量 ＝ 主分区容量 ＋ 扩展分区容量
扩展分区容量 ＝ 各个逻辑分区容量之和

![image-20221119125716225](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125716225.png)
要将未分配的部分，分配到主分区/dev/sda1中，未分配和主分区/dev/sda1之间不能有其他分区，所以我们需要将他们之间的分区删除掉，首先鼠标移动到逻辑分区linux-swap所在区域，单击右键，禁用交换空间
（注释：扩展分区和逻辑分区的功能自行查资料，删除后，我后面会重新创建)
![image-20221119125724526](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125724526.png)

点击右键删除掉linux-swap,再点击右键删除extended
![image-20221119125757804](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125757804.png)

此时可以看到扩展分区和逻辑分区已经被删除了，
并且分配给扩展分区的容量增加到了未分配中
![image-20221119125814127](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125814127.png)

![image-20221119125830867](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125830867.png)



此时单击右键主分区/dev/sda1区域，点击更改大小在



将之后的空余空间修改成2000（用来创建刚被删了扩展分区和逻辑分区）
点击新大小的输入框后会自动更新数值，然后点击调整大小
![image-20221119125847455](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125847455.png)



现在将剩下未分配的容量，创建为扩展分区，单击右键未分配区域，点击新建

![image-20221119125902511](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125902511.png)

将主分区修改为扩展分区在

![image-20221119125939038](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125939038.png)

修改成扩展分区后，文件系统默认为extend，然后点击添加
![image-20221119125947547](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125947547.png)

同理再创建逻辑分区linux-swap，单击右键未分配区域，点击新建

![image-20221119125959374](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119125959374.png)



此时默认为逻辑分区，将文件系统：ext4修改为linux-swap
![image-20221119130016113](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130016113.png)



点击linux-swap，然后再点击添加
![image-20221119130027026](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130027026.png)

点击绿√，扩容最重要的步骤大概就是红框区域的内容

![image-20221119130039494](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130039494.png)

点击应用，等待完成操作，大概两三秒钟

![image-20221119130046446](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130046446.png)



点击关闭
![image-20221119130121181](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130121181.png)

关闭后会看到如下界面，扩展分区和逻辑分区创建完成
![image-20221119130136833](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130136833.png)
最后将新建的 linux-swap 中的UUID值更新到/etc下fstab文件中
右键单击linux-swap，点击信息，查看UUID值

![image-20221119130150377](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130150377.png)

复制UUID的值

![image-20221119130207553](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119130207553.png)

打开fstab文件，用 vi 或编辑器等都可以
我这里用code打开

    终端： code /etc/fstab

![image-20221119131217145](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119131217145.png)
注意：fstab文件中有两个UUID，需要更新的是swap下逻辑分区的UUID值，
将原来的UUID值删除，更新为刚复制的UUID值
![image-20221119131225237](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119131225237.png)

更新完成后，保存文件
![image-20221119131233114](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119131233114.png)
现在我们再来查看硬盘容量，成功扩容，到此扩容结束！！

    终端： df -h

![image-20221119131238504](VMware虚拟机 Linux系统 Ubuntu 20.04 硬盘-磁盘扩容.assets/image-20221119131238504.png)
THE END