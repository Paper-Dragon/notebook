# LFS编译笔记以深入了解Linux

## LF规定的包

| 类型                             | 包                                                           |
| --------------------------------------------------- | ------------------------------------------------------------ |
| *LSB Core:* | Bash, Bc, Binutils, Coreutils, Diffutils, File, Findutils,Gawk, Grep, Gzip, M4, Man-DB, Ncurses, Procps, Psmisc, Sed,Shadow, Tar, Util-linux, Zlib |
| *LSB Desktop:* | 无                                                           |
| *LSB Runtime Languages:* | Perl, Python                                                 |
| *LSB Imaging:* | 无                                                           |
| *LSB Gtk3和LSB Graphics (试用):* | 无                                                           |

## LFS宿主机体质要求

```bash
Bash-3.2 (/bin/sh 必须是到 bash 的符号链接或硬连接)
Binutils-2.13.1 (比 2.39 更新的版本未经测试，不推荐使用)
Bison-2.7 (/usr/bin/yacc 必须是到 bison 的链接，或者是一个执行 bison 的小脚本)
Coreutils-6.9
Diffutils-2.8.1
Findutils-4.2.31
Gawk-4.0.1 (/usr/bin/awk 必须是到 gawk 的链接)
GCC-4.8，包括 C++ 编译器 g++ (比 12.2.0 更新的版本未经测试，不推荐使用)。C 和 C++ 标准库 (包括头文件) 也必须可用，这样 C++ 编译器才能构建宿主环境的程序
Grep-2.5.1a
Gzip-1.3.12
Linux Kernel-3.2
内核版本的要求是为了符合第 5 章和第 8 章中编译 glibc 时开发者推荐的配置选项。udev也要求一定的内核版本。
如果宿主内核比 3.2 更早，您需要将内核升级到较新的版本。升级内核有两种方法，如果您的发行版供应商提供了 3.2 或更新的内核软件包，您可以直接安装它。如果供应商没有提供一个足够新的内核包，或者您不想安装它，您可以自己编译内核。编译内核和配置启动引导器 (假设宿主使用 GRUB) 的步骤在第 10 章中。
M4-1.4.10
Make-4.0
Patch-2.5.4
Perl-5.8.8
Python-3.4
Sed-4.1.5
Tar-1.22
Texinfo-4.7
Xz-5.0.0
```

## 宿主机体检

```bash
cat > version-check.sh << "EOF"
#!/bin/bash
# Simple script to list version numbers of critical development tools
export LC_ALL=C
bash --version | head -n1 | cut -d" " -f2-4
MYSH=$(readlink -f /bin/sh)
echo "/bin/sh -> $MYSH"
echo $MYSH | grep -q bash || echo "ERROR: /bin/sh does not point to bash"
unset MYSH

echo -n "Binutils: "; ld --version | head -n1 | cut -d" " -f3-
bison --version | head -n1

if [ -h /usr/bin/yacc ]; then
 echo "/usr/bin/yacc -> `readlink -f /usr/bin/yacc`";
elif [ -x /usr/bin/yacc ]; then
 echo yacc is `/usr/bin/yacc --version | head -n1`
else
 echo "yacc not found"
fi

echo -n "Coreutils: "; chown --version | head -n1 | cut -d")" -f2
diff --version | head -n1
find --version | head -n1
gawk --version | head -n1

if [ -h /usr/bin/awk ]; then
 echo "/usr/bin/awk -> `readlink -f /usr/bin/awk`";
elif [ -x /usr/bin/awk ]; then
 echo awk is `/usr/bin/awk --version | head -n1`
else
 echo "awk not found"
fi

gcc --version | head -n1
g++ --version | head -n1
grep --version | head -n1
gzip --version | head -n1
cat /proc/version
m4 --version | head -n1
make --version | head -n1
patch --version | head -n1
echo Perl `perl -V:version`
python3 --version
sed --version | head -n1
tar --version | head -n1
makeinfo --version | head -n1 # texinfo version
xz --version | head -n1

echo 'int main(){}' > dummy.c && g++ -o dummy dummy.c
if [ -x dummy ]
 then echo "g++ compilation OK";
 else echo "g++ compilation failed"; fi
rm -f dummy.c dummy
EOF

bash version-check.sh
```

## Linux 常用分区(科普)

还有其他几个并非必须，但在设计磁盘布局时应当考虑的分区。下面的列表并不完整，但可以作为一个参考。

- /boot – 高度推荐。这个分区可以存储内核和其他引导信息。为了减少大磁盘可能引起的问题，建议将 /boot 分区设为第一块磁盘的第一个分区。为它分配 200 MB 就绰绰有余。

- /boot/efi – EFI 系统分区，在使用 UEFI 引导系统时是必要的。阅读 BLFS 页面 以获得详细信息。

- /home – 高度推荐。独立的 /home 分区可以在多个发行版或 LFS 系统之间共享 home 目录和用户设置。它的尺寸一般很大，取决于硬盘的可用空间。

- /usr – 在 LFS 中，/bin，/lib，以及 /sbin 是指向 /usr 中对应目录的符号链接。因此，/usr 包含系统运行需要的所有二进制程序和库。对于 LFS，通常不需要为 /usr 创建单独的分区。如果仍然需要这种配置，需要为其建立一个能够容纳系统中所有程序和库的分区。同时，在这种配置下，根分区可以非常小 (可能只需要一吉字节)，因此它适用于瘦客户端或者无盘工作站 (此时 /usr 从远程服务器挂载)。然而，需要注意的是，必须使用 initramfs (LFS 没有包含)，才能引导具有单独的 /usr 分区的系统。

- /opt – 这个目录往往被用于在 BLFS 中安装 Gnome 或 KDE 等大型软件，以免把大量文件塞进 /usr 目录树。如果将它划分为独立分区，5 到 10 GB 一般就足够了。

- /tmp – 一个独立的 /tmp 分区是很少见的，但在配置瘦客户端时很有用。如果分配了这个分区，大小一般不会超过几个 GB。

- /usr/src – 将它划分为独立分区，可以用于存储 BLFS 源代码，并在多个 LFS 系统之间共享它们。它也可以用于编译 BLFS 软件包。30-50 GB 的分区可以提供足够的空间。

如果您希望在启动时自动挂载任何一个独立的分区，就要在 /etc/fstab 文件中说明。有关指定分区的细节将在第 10.2 节 “创建 /etc/fstab 文件” 中讨论。 

## 第一步创建的分区和用途

### 创建一个有限的目录树

以 `root` 身份，执行以下命令创建所需的目录布局： 

```bash
mkdir -pv $LFS/{etc,var} $LFS/usr/{bin,lib,sbin}

for i in bin lib sbin; do
 ln -sv usr/$i $LFS/$i
done

case $(uname -m) in
 x86_64) mkdir -pv $LFS/lib64 ;;
esac
```

### 创建交叉编译器目录

```bash
mkdir -pv $LFS/tools
```

## 第一步创建非特权用户

#### 添加非特权用户

```bash
groupadd lfs
useradd -s /bin/bash -g lfs -m -k /dev/null lfs


-s /bin/bash
 设置 bash 为用户 lfs 的默认 shell。
-g lfs
 添加用户 lfs 到组 lfs。
-m
 为用户 lfs 创建一个主目录。
-k /dev/null
 将模板目录设置为空设备文件，从而不从默认模板目录 (/etc/skel) 复制文件到新的主目录。
lfs
 要创建的用户的名称。
```

#### 给非特权用户授权控制lfs

 将 `lfs` 设为 `$LFS` 中所有目录的所有者，使 `lfs` 对它们拥有完全访问权： 

```
chown -v lfs $LFS/{usr{,/*},lib,var,etc,bin,sbin,tools}
case $(uname -m) in
 x86_64) chown -v lfs $LFS/lib64 ;;
esac
```

#### 非特权用户环境变量

> **bash** 创建两个新的启动脚本
>
> 初始的 shell一般是一个*登录* shell。它读取宿主系统的 `/etc/profile` 文件 (可能包含一些设置和环境变量)，然后读取 `.bash_profile`。

创建.bash_profile

```bash
cat > ~/.bash_profile << "EOF"
exec env -i HOME=$HOME TERM=$TERM PS1='\u:\w\$ ' /bin/bash
EOF


exec env -i.../bin/bash 命令，新建一个除了 HOME, TERM 以及 PS1 外没有任何环境变量的 shell
```

创建.bashrc ( *非登录* shell)

```bash
cat > ~/.bashrc << "EOF"
set +h
umask 022
LFS=/mnt/lfs
LC_ALL=POSIX
LFS_TGT=$(uname -m)-lfs-linux-gnu
PATH=/usr/bin
if [ ! -L /bin ]; then PATH=/bin:$PATH; fi
PATH=$LFS/tools/bin:$PATH
CONFIG_SITE=$LFS/usr/share/config.site
export LFS LC_ALL LFS_TGT PATH CONFIG_SITE
EOF

set +h
 set +h 命令关闭 bash 的散列功能。一般情况下，散列是很有用的 —— bash 使用一个散列表维护各个可执行文件的完整路径，这样就不用每次都在 PATH 指定的目录中搜索可执行文件。然而，在构建 LFS 时，我们希望总是使用最新安装的工具。因此，需要关闭散列功能，使得 shell 在运行程序时总是搜索 PATH。这样，一旦$LFS/tools/bin 中有新的工具可用，shell 就能够找到它们，而不是使用之前记忆在散列表中，由宿主发行版提供的 /usr/bin 或 /bin 中的工具。
umask 022
 将用户的文件创建掩码 (umask) 设定为 022，保证只有文件所有者可以写新创建的文件和目录，但任何人都可读取、执行它们。(如果 open(2) 系统调用使用默认模式，则新文件将具有权限模式 644，而新目录具有权限模式 755)。
LFS=/mnt/lfs
 LFS 环境变量必须被设定为之前选择的挂载点。
LC_ALL=POSIX
 LC_ALL 环境变量控制某些程序的本地化行为，使得它们以特定国家的语言和惯例输出消息。将 LC_ALL 设置为 “POSIX” 或者 “C”(这两种设置是等价的) 可以保证在 chroot 环境中所有命令的行为完全符合预期，而与宿主的本地化设置无关。
LFS_TGT=(uname -m)-lfs-linux-gnu
 LFS_TGT变量设定了一个非默认，但与宿主系统兼容的机器描述符。该描述符被用于构建交叉编译器和交叉编译临时工具链。工具链技术说明包含了关于这个描述符的更多信息。
PATH=/usr/bin
 许多现代 Linux 发行版合并了 /bin 和 /usr/bin。在这种情况下，标准 PATH 变量只需要被设定为 /usr/bin，即可满足第 6 章的环境。否则，后续命令将会增加 /bin 到搜索路径中。
if [ ! -L /bin ]; then PATH=/bin:$PATH; fi
 如果 /bin 不是符号链接，则它需要被添加到 PATH 变量中。
PATH=$LFS/tools/bin:$PATH
 我们将 $LFS/tools/bin 附加在默认的 PATH 环境变量之前，这样在第 5 章中，我们一旦安装了新的程序，shell 就能立刻使用它们。这与关闭散列功能相结合，降低了在第 5 章环境中新程序可用时错误地使用宿主系统中旧程序的风险。
CONFIG_SITE=$LFS/usr/share/config.site
 在第 5 章和第 6 章中，如果没有设定这个变量，configure 脚本可能会从宿主系统的 /usr/share/config.site 加载一些发行版特有的配置信息。覆盖这一默认路径，避免宿主系统可能造成的污染。

```

#### 调整某些Linux自己造了个环境变量对过程产生影响

```bash
[ ! -e /etc/bash.bashrc ] || mv -v /etc/bash.bashrc /etc/bash.bashrc.NOUSE
```



#### 登录shell和非登陆shell读取配置文件的区别

- https://gitee.com/link?target=https%3A%2F%2Fwww.cnblogs.com%2Fpigwan7%2Fp%2F9593540.html

## 交叉工具链相关的内容

### 交叉工具链

- binutils 包含汇编器、链接器以及其他用于处理目标文件的工具。
- GCC 软件包包含 GNU 编译器集合，其中有 C 和 C++ 编译器。
- Linux API 头文件 (在 linux-5.19.2.tar.xz 中) 导出内核 API 供 Glibc 使用。
- Glibc 软件包包含主要的 C 语言库。它提供用于分配内存、检索目录、打开和关闭文件、读写文件、字符串处理、模式匹配、算术等用途的基本子程序。
- Libstdc++ 是 C++ 标准库。我们需要它才能编译 C++ 代码 (GCC 的一部分用 C++编写)。但在构建[第一遍的GCC](https://lfs.xry111.site/zh_CN/11.2-systemd/chapter05/gcc-pass1.html)时我们不得不暂缓安装它，因为它依赖于当时还没有安装到目标目录的 Glibc。 

### 交叉工具链相关工具

- M4 软件包包含一个宏处理器。
- Ncurses 软件包包含使用时不需考虑终端特性的字符屏幕处理函数库
- Bash 软件包包含 Bourne-Again SHell
- Coreutils 软件包包含用于显示和设定系统基本属性的工具。
- Diffutils 软件包包含显示文件或目录之间差异的程序。
- File 软件包包含用于确定给定文件类型的工具。
- Findutils 软件包包含用于查找文件的程序。这些程序能够递归地搜索目录树，以及创建、维护和搜索文件数据库 (一般比递归搜索快，但在数据库最近没有更新时不可靠)。
- Gawk 软件包包含操作文本文件的程序。
- Grep 软件包包含在文件内容中进行搜索的程序。
- Gzip 软件包包含压缩和解压缩文件的程序。
- Make 软件包包含一个程序，用于控制从软件包源代码生成可执行文件和其他非源代码文件的过程。
- Patch 软件包包含通过应用 “补丁” 文件，修改或创建文件的程序，补丁文件通常是 **diff** 程序创建的。
- Sed 软件包包含一个流编辑器。
- Tar 软件包提供创建 tar 归档文件，以及对归档文件进行其他操作的功能。Tar 可以对已经创建的归档文件进行提取文件，存储新文件，更新文件，或者列出文件等操作。
- Xz 软件包包含文件压缩和解压缩工具，它能够处理 lzma 和新的 xz 压缩文件格式。使用 **xz** 压缩文本文件，可以得到比传统的 **gzip** 或 **bzip2** 更好的压缩比。
- 2 - Binutils 包含汇编器、链接器以及其他用于处理目标文件的工具。 
  - Binutils 的源码包中内置了一份陈旧的 libtool 拷贝。这个版本的 libtool 没有 sysroot 支持，因此产生的二进制代码会错误地链接到宿主系统提供的库。绕过这个问题：
- 2 - GCC 软件包包含 GNU 编译器集合，其中有 C 和 C++ 编译器。
  - 由于我们正在交叉编译 GCC，此时不可能用编译得到的 GCC 二进制程序构建用于目标系统的运行库(`libgcc` 和 `libstdc++`)，这是因为交叉编译得到的二进制程序无法在宿主系统运行。GCC构建系统在默认情况下会试图使用宿主系统提供的 C 和 C++ 编译器来绕过这个问题。但是，由于 GCC的运行库未必能用不同版本的 GCC 构建，使用宿主系统的编译器可能导致构建失败。该选项保证使用第一遍构建的 GCC编译运行库，以防止出现此问题。



## 在Chroot中构建

### 改变权限

```bash
chown -R root:root $LFS/{usr,lib,var,etc,bin,sbin,tools}
case $(uname -m) in
 x86_64) chown -R root:root $LFS/lib64 ;;
esac
```

### 与正在运行的内核之间建立一些通信机制

内核对外提供了一些文件系统，以便自己和用户空间进行通信。它们是虚拟文件系统，并不占用磁盘空间，其内容保留在内存中。 

#### 首先创建这些文件系统的挂载点：

```
mkdir -pv $LFS/{dev,proc,sys,run}
```

正常的引导过程中，内核自动挂载 `devtmpfs` 到 `/dev`，并允许在设备被发现或访问时动态地创建设备节点。设备节点通常由内核和 Udev 在系统引导时创建。然而，我们的新系统还没有 Udev，也没有经过引导过程，因此必须手工挂载和填充 `/dev`。这可以通过绑定挂载宿主系统的 `/dev` 目录来实现。绑定挂载是一种特殊挂载类型，它允许在另外的位置创建某个目录或挂载点的映像。运行以下命令进行绑定挂载： 

```
mount -v --bind /dev $LFS/dev
```

#### 挂载其余的虚拟内核文件系统:

```
mount -v --bind /dev/pts $LFS/dev/pts
mount -vt proc proc $LFS/proc
mount -vt sysfs sysfs $LFS/sys
mount -vt tmpfs tmpfs $LFS/run
```

在某些宿主系统上，`/dev/shm` 是一个指向 `/run/shm` 的符号链接。我们已经在 /run 下挂载了 tmpfs 文件系统，因此在这里只需要创建一个目录。 

```
if [ -h $LFS/dev/shm ]; then
 mkdir -pv $LFS/$(readlink $LFS/dev/shm)
fi
```

### 进入chroot

#### 运行命令进入root

```bash
chroot "$LFS" /usr/bin/env -i \
 HOME=/root \
 TERM="$TERM" \
 PS1='(lfs chroot) \u:\w\$ ' \
 PATH=/usr/bin:/usr/sbin \
 /bin/bash --login
 
 
 
传递 -i 选项给 env 命令，可以清除 chroot 环境中的所有环境变量
```

#### 创建一些位于根目录中的目录

```bash
mkdir -pv /{boot,home,mnt,opt,srv}


mkdir -pv /etc/{opt,sysconfig}
mkdir -pv /lib/firmware
mkdir -pv /media/{floppy,cdrom}
mkdir -pv /usr/{,local/}{include,src}
mkdir -pv /usr/local/{bin,lib,sbin}
mkdir -pv /usr/{,local/}share/{color,dict,doc,info,locale,man}
mkdir -pv /usr/{,local/}share/{misc,terminfo,zoneinfo}
mkdir -pv /usr/{,local/}share/man/man{1..8}
mkdir -pv /var/{cache,local,log,mail,opt,spool}
mkdir -pv /var/lib/{color,misc,locate}

ln -sfv /run /var/run
ln -sfv /run/lock /var/lock

install -dv -m 0750 /root
install -dv -m 1777 /tmp /var/tmp
```



LF规定的目录结构 https://refspecs.linuxfoundation.org/fhs.shtml



#### 创建必要的文件和符号链接

##### /etc/mtab

```bash
ln -sv /proc/self/mounts /etc/mtab
```

#####  /etc/hosts

```bash
cat > /etc/hosts << EOF
127.0.0.1 localhost $(hostname)
::1 localhost
EOF
```

##### /etc/passwd

```bash
cat > /etc/passwd << "EOF"
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/dev/null:/usr/bin/false
daemon:x:6:6:Daemon User:/dev/null:/usr/bin/false
messagebus:x:18:18:D-Bus Message Daemon User:/run/dbus:/usr/bin/false
systemd-journal-gateway:x:73:73:systemd Journal Gateway:/:/usr/bin/false
systemd-journal-remote:x:74:74:systemd Journal Remote:/:/usr/bin/false
systemd-journal-upload:x:75:75:systemd Journal Upload:/:/usr/bin/false
systemd-network:x:76:76:systemd Network Management:/:/usr/bin/false
systemd-resolve:x:77:77:systemd Resolver:/:/usr/bin/false
systemd-timesync:x:78:78:systemd Time Synchronization:/:/usr/bin/false
systemd-coredump:x:79:79:systemd Core Dumper:/:/usr/bin/false
uuidd:x:80:80:UUID Generation Daemon User:/dev/null:/usr/bin/false
systemd-oom:x:81:81:systemd Out Of Memory Daemon:/:/usr/bin/false
nobody:x:65534:65534:Unprivileged User:/dev/null:/usr/bin/false
EOF
```

##### /etc/group

```bash
cat > /etc/group << "EOF"
root:x:0:
bin:x:1:daemon
sys:x:2:
kmem:x:3:
tape:x:4:
tty:x:5:
daemon:x:6:
floppy:x:7:
disk:x:8:
lp:x:9:
dialout:x:10:
audio:x:11:
video:x:12:
utmp:x:13:
usb:x:14:
cdrom:x:15:
adm:x:16:
messagebus:x:18:
systemd-journal:x:23:
input:x:24:
mail:x:34:
kvm:x:61:
systemd-journal-gateway:x:73:
systemd-journal-remote:x:74:
systemd-journal-upload:x:75:
systemd-network:x:76:
systemd-resolve:x:77:
systemd-timesync:x:78:
systemd-coredump:x:79:
uuidd:x:80:
systemd-oom:x:81:
wheel:x:97:
users:x:999:
nogroup:x:65534:
EOF
```

#### 刷新环境变量

```bash
exec /usr/bin/bash --login
```

#### 初始化日志文件

```bash
touch /var/log/{btmp,lastlog,faillog,wtmp}
chgrp -v utmp /var/log/lastlog
chmod -v 664 /var/log/lastlog
chmod -v 600 /var/log/btmp
```

### 构建临时工具

- Gettext 软件包包含国际化和本地化工具，它们允许程序在编译时加入 NLS (本地语言支持) 功能，使它们能够以用户的本地语言输出消息
- Bison 软件包包含语法分析器生成器。
- Perl 软件包包含实用报表提取语言。
- Python 3 软件包包含 Python 开发环境。它被用于面向对象编程，编写脚本，为大型程序建立原型，或者开发完整的应用。 
- Texinfo 软件包包含阅读、编写和转换 info 页面的程序。 
- Util-linux 软件包包含一些工具程序。



### 安装基本系统软件

https://lfs.xry111.site/zh_CN/11.2-systemd/chapter08/chapter08.html

- Man-pages 软件包包含 2,200 多个 man 页面。
- Iana-Etc 软件包包含网络服务和协议的数据。
- Glibc 软件包包含主要的 C语言库。它提供用于分配内存、检索目录、打开和关闭文件、读写文件、字符串处理、模式匹配、算术等用途的基本子程序。
- Zlib 软件包包含一些程序使用的压缩和解压缩子程序。 
- Bzip2 软件包包含用于压缩和解压缩文件的程序。使用 **bzip2** 压缩文本文件可以获得比传统的 **gzip** 优秀许多的压缩比。
- Xz 软件包包含文件压缩和解压缩工具，它能够处理 lzma 和新的 xz 压缩文件格式。使用 **xz** 压缩文本文件，可以得到比传统的 **gzip** 或 **bzip2** 更好的压缩比。
- Zstandard 是一种实时压缩算法，提供了较高的压缩比。它具有很宽的压缩比/速度权衡范围，同时支持具有非常快速的解压缩。
- File 软件包包含用于确定给定文件类型的工具。
- Readline 软件包包含一些提供命令行编辑和历史记录功能的库。
- M4 软件包包含一个宏处理器。
- Bc 软件包包含一个任意精度数值处理语言。
- Flex 软件包包含一个工具，用于生成在文本中识别模式的程序。
- Tcl 软件包包含工具命令语言，它是一个可靠的通用脚本语言。Except 软件包是用 Tcl 语言编写的. 
- Expect 软件包包含通过脚本控制的对话，自动化 **telnet**，**ftp**，**passwd**，**fsck**，**rlogin**，以及 **tip** 等交互应用的工具。Expect 对于测试这类程序也很有用，它简化了这类通过其他方式很难完成的工作。DejaGnu 框架是使用 Expect 编写的。
- DejaGnu 包含使用 GNU 工具运行测试套件的框架。它是用expect 编写的，后者又使用Tcl (工具命令语言)。
- Binutils 包含汇编器、链接器以及其他用于处理目标文件的工具。
- GMP 软件包包含提供任意精度算术函数的数学库。
- MPFR 软件包包含多精度数学函数。
- MPC 软件包包含一个任意高精度，且舍入正确的复数算术库。
- Attr 软件包包含管理文件系统对象扩展属性的工具。
- Acl 软件包包含管理访问控制列表的工具，访问控制列表能够更细致地自由定义文件和目录的访问权限。
- ibcap 软件包为 Linux 内核提供的 POSIX 1003.1e 权能字实现用户接口。这些权能字是 root 用户的最高特权分割成的一组不同权限。
- Shadow 软件包包含安全地处理密码的程序。
- GCC 软件包包含 GNU 编译器集合，其中有 C 和 C++ 编译器。
- pkg-config 软件包提供一个在软件包安装的配置和编译阶段，向构建工具传递头文件和/或库文件路径的工具。
- Ncurses 软件包包含使用时不需考虑终端特性的字符屏幕处理函数库。
- Sed 软件包包含一个流编辑器。
- Psmisc 软件包包含显示正在运行的进程信息的程序。
- Gettext 软件包包含国际化和本地化工具，它们允许程序在编译时加入 NLS (本地语言支持) 功能，使它们能够以用户的本地语言输出消息。
- Bison 软件包包含语法分析器生成器。
- Grep 软件包包含在文件内容中进行搜索的程序。
- Bash 软件包包含 Bourne-Again SHell。
- Libtool 软件包包含 GNU 通用库支持脚本。它在一个一致、可移植的接口下隐藏了使用共享库的复杂性。
- GDBM 软件包包含 GNU 数据库管理器。它是一个使用可扩展散列的数据库函数库，工作方法和标准 UNIX dbm 类似。该库提供用于存储键值对、通过键搜索和获取数据，以及删除键和对应数据的原语。
- Gperf 根据一组键值，生成完美散列函数。
- Expat 软件包包含用于解析 XML 文件的面向流的 C 语言库。
- Inetutils 软件包包含基本网络程序。
- Less 软件包包含一个文本文件查看器。
- Perl 软件包包含实用报表提取语言。
- XML::Parser 模块是 James Clark 的 XML 解析器 Expat 的 Perl 接口。
- Intltool 是一个从源代码文件中提取可翻译字符串的国际化工具
- Autoconf 软件包包含生成能自动配置软件包的 shell 脚本的程序。
- Automake 软件包包含自动生成 Makefile，以便和 Autoconf 一同使用的程序。
- OpenSSL 软件包包含密码学相关的管理工具和库。它们被用于向其他软件包提供密码学功能，例如 OpenSSH，电子邮件程序和 Web 浏览器 (以访问 HTTPS 站点)。
- Kmod 软件包包含用于加载内核模块的库和工具。
- Libelf 是一个处理 ELF (可执行和可链接格式) 文件的库。
- Libffi 库提供一个可移植的高级编程接口，用于处理不同调用惯例。这允许程序在运行时调用任何给定了调用接口的函数。
- Python 3 软件包包含 Python 开发环境。它被用于面向对象编程，编写脚本，为大型程序建立原型，或者开发完整的应用。 
- Wheel 是 Python wheel 软件包标准格式的参考实现。
- Ninja 是一个注重速度的小型构建系统。 
- Meson 是一个开放源代码构建系统，它的设计保证了非常快的执行速度，和尽可能高的用户友好性。
- Coreutils 软件包包含用于显示和设定系统基本属性的工具。
- Check 是一个 C 语言单元测试框架。
- Diffutils 软件包包含显示文件或目录之间差异的程序。
- Gawk 软件包包含操作文本文件的程序。
- Findutils 软件包包含用于查找文件的程序。这些程序能够递归地搜索目录树，以及创建、维护和搜索文件数据库 (一般比递归搜索快，但在数据库最近没有更新时不可靠)。
- Groff 软件包包含处理和格式化文本的程序。
- GRUB 软件包包含 “大统一” (GRand Unified) 启动引导器。
- Gzip 软件包包含压缩和解压缩文件的程序。
- IPRoute2 软件包包含基于 IPv4 的基本和高级网络程序。
- Kbd 软件包包含按键表文件、控制台字体和键盘工具。
- Libpipeline 软件包包含用于灵活、方便地处理子进程流水线的库。
- Make 软件包包含一个程序，用于控制从软件包源代码生成可执行文件和其他非源代码文件的过程。
- Patch 软件包包含通过应用 “补丁” 文件，修改或创建文件的程序，补丁文件通常是 **diff** 程序创建的。
- Tar 软件包提供创建 tar 归档文件，以及对归档文件进行其他操作的功能。Tar 可以对已经创建的归档文件进行提取文件，存储新文件，更新文件，或者列出文件等操作。
- Texinfo 软件包包含阅读、编写和转换 info 页面的程序。
- Vim 软件包包含强大的文本编辑器。
- MarkupSafe 是一个为 XML/HTML/XHTML 标记语言实现字符串安全处理的 Python 模块。
- Jinja2 是一个实现了简单的，Python 风格的模板语言的 Python 模块。
- Systemd 软件包包含控制系统引导、运行和关闭的程序。
- D-bus 是一个消息总线系统，即应用程序之间互相通信的一种简单方式。D-Bus 提供一个系统守护进程 (负责 “添加了新硬件” 或 “打印队列发生改变” 等事件)，并对每个用户登录会话提供一个守护进程 (负责一般用户程序的进程间通信)。另外，消息总线被构建在一个通用的一对一消息传递网络上，它可以被任意两个程序用于直接通信 (不需通过消息总线守护进程)。
- Man-DB 软件包包含查找和阅读 man 页面的程序。
- Procps-ng 软件包包含监视进程的程序。
- Util-linux 软件包包含若干工具程序。这些程序中有处理文件系统、终端、分区和消息的工具。
- E2fsprogs 软件包包含处理 `ext2`文件系统的工具。此外它也支持 `ext3` 和 `ext4` 日志文件系统。
- 

### 软件包管理

https://lfs.xry111.site/zh_CN/11.2-systemd/chapter08/pkgmgt.html

## 系统配置

### 一般网络配置

网络接口配置文件

- 209 版本开始，systemd 提供一个名为 **systemd-networkd** 的网络配置守护进程，它能够用于基础网络配置。
- 213 版本起，可以用 **systemd-resolved** 代替静态 `/etc/resolv.conf` 文件处理域名解析。

**systemd-networkd** (以及 **systemd-resolved**) 的配置文件可以放置在 `/usr/lib/systemd/network` 或 `/etc/systemd/network` 中。

`/etc/systemd/network` 中的配置文件优先级高于 `/usr/lib/systemd/network` 中的配置文件。有三种类型的配置文件：`.link`、`.netdev` 和 `.network` 文件。

要获得它们的详细描述和内容示例，参阅 `systemd-link(5)`、`systemd-netdev(5)` 和 `systemd-network(5)` man 手册页面。 

#### 网络设备命名

##### 自定义网络接口名

可以使用三种不同方式： 

- 覆盖 udev 提供默认策略的 .link 文件： 

  ```
  ln -s /dev/null /etc/systemd/network/99-default.link
  ```

- 手动创建命名架构，例如将网络接口命名为“internet0”、“dmz0” 或 “lan0”。为此，在 /etc/systemd/network 中创建 .link 文件，为您的一个、一些或全部网络接口直接选择名称，或选择更好的命名架构。例如： 

  ```
  cat > /etc/systemd/network/10-ether0.link << "EOF"
  [Match]
  # 将 MAC 地址替换为适用于您的网络设备的值
  MACAddress=12:34:45:78:90:AB
  
  [Link]
  Name=ether0
  EOF
  ```

  参阅 man 页面 systemd.link(5) 获得更多信息。 

-  在 /boot/grub/grub.cfg 的内核命令行中传递选项 net.ifnames=0。 

##### 静态 IP 配置

```bash
cat > /etc/systemd/network/10-eth-static.network << "EOF"
[Match]
Name=<网络设备名>

[Network]
Address=192.168.0.2/24
Gateway=192.168.0.1
DNS=192.168.0.1
Domains=<您的域名>
EOF
```

##### DHCP 配置

```bash
cat > /etc/systemd/network/10-eth-dhcp.network << "EOF"
[Match]
Name=<网络设备名>

[Network]
DHCP=ipv4

[DHCP]
UseDomains=true
EOF
```

#### 创建/etc/resolv.conf

##### systemd-resloved配置

```bash
[root@fedora ~]# ll /run/systemd/resolve/stub-resolv.conf
-rw-r--r-- 1 systemd-resolve systemd-resolve 920 Feb 2 17:44 /run/systemd/resolve/stub-resolv.conf
[root@fedora ~]# ll /etc/resolv.conf
lrwxrwxrwx. 1 root root 39 Feb 2 10:06 /etc/resolv.conf -> ../run/systemd/resolve/stub-resolv.conf

```

静态配置

```bash

cat > /etc/resolv.conf << "EOF"
# Begin /etc/resolv.conf

domain <您的域名>
nameserver <您的主要域名服务器 IP 地址>
nameserver <您的次要域名服务器 IP 地址>

# End /etc/resolv.conf
EOF

可以省略 domain 语句，或使用一条 search 语句代替它。
```

#### 配置系统主机名

在引导过程中，`/etc/hostname` 被用于设定系统主机名。 

```bash
echo "<lfs>" > /etc/hostname
```

#### 自定义/etc/hosts 文件

选择一个全限定域名 (FQDN)，和可能的别名，以供 `/etc/hosts`文件使用。如果使用静态 IP 地址，您还需要确定要使用的 IP 地址。hosts 文件条目的语法是： 

```
IP_地址 主机名.域名 别名
```

除非该计算机可以从 Internet 访问 (即拥有一个注册域名，并分配了一个有效的 IP 地址段 —— 多数用户没有分配有效IP)，确认使用的 IP 地址属于私网 IP 范围。有效的范围是： 

```
私网地址范围 公共前缀长度
10.0.0.1 - 10.255.255.254 8
172.x.0.1 - 172.x.255.254 16
192.168.y.1 - 192.168.y.254 24
```

 x 可以是 16-31 之间的任何数字。y 可以是 0-255 之间的任何数字。 

有效的私网 IP 地址的一个例子是 192.168.1.1。与之对应的 FQDN 可以是 lfs.example.org。 

即使没有网卡，也要提供一个有效的 FQDN。某些程序，如 MTA（**Mail Transfer Agent**），需要它才能正常工作。 

执行以下命令，创建 `/etc/hosts` 文件：

```
cat > /etc/hosts << "EOF"
# Begin /etc/hosts

127.0.0.1 localhost.localdomain localhost
127.0.1.1 <FQDN> <HOSTNAME>
<192.168.0.2> <FQDN> <HOSTNAME> [alias1] [alias2] ...
::1 localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

# End /etc/hosts
EOF
```

其中 *`<192.168.0.2>`*，*`<FQDN>`*，以及*`<主机名>`* 的值需要为特定使用环境和需求进行修改 (如果系统或网络管理员分配了 IP 地址，且本机将被连接到现有的网络中)。可以略去可选的别名 (alias)，如果使用支持 DHCP或者 IPv6 自动配置的连接，则包含 *`<192.168.0.2>`* 的一行也可以省略。 

::1 是 127.0.0.1 在 IPv6 中的对应，即 IPv6 回环接口。 

###  设备和模块管理概述

#### Udev的实现

##### Sysfs

有些读者可能好奇，`sysfs` 是如何知道系统中存在哪些设备，以及应该为它们使用什么设备号的。答案是，那些编译到内核中的驱动程序在它们的对象被内核检测到时，直接将它们注册到 `sysfs` (内部的 devtmpfs)。对于那些被编译为模块的驱动程序，注册过程在模块加载时进行。只要 `sysfs` 文件系统被挂载好 (位于 /sys)，用户空间程序即可使用驱动程序注册在 `sysfs` 中的数据，Udev 就能够使用这些数据对设备进行处理(包括修改设备节点)。

##### 设备节点的创建

内核通过 `devtmpfs` 直接创建设备文件，任何希望注册设备节点的驱动程序都要通过 `devtmpfs` (经过驱动程序核心) 实现。当一个 `devtmpfs` 实例被挂载到 `/dev` 时，设备节点将被以固定的名称、访问权限和所有者首次创建。 

很快，内核会向 **udevd** 发送一个 uevent。根据 `/etc/udev/rules.d`，`/usr/lib/udev/rules.d`，以及 `/run/udev/rules.d` 目录中文件指定的规则，**udevd** 将为设备节点创建额外的符号链接，修改其访问权限，所有者，或属组，或者修改该对象的 **udevd** 数据库条目 (名称)。 

 以上三个目录中的规则都被编号，且这三个目录的内容将合并处理。如果 **udevd** 找不到它正在创建的设备对应的规则，它将会沿用 `devtmpfs` 最早使用的配置。 

##### 模块加载 

 编译为内核模块的设备驱动程序可能有内建的别名。别名可以通过 **modinfo** 程序查询，它通常和该模块支持的设备的总线相关标识符有关。例如，*snd-fm801* 驱动程序支持厂商 ID 为 0x1319，设备 ID 为 0x0801 的 PCI 设备，其别名为“pci:v00001319d00000801sv*sd*bc04sc01l*”。对于多数设备，总线驱动程序会通过 `sysfs` 导出应该处理该设备的驱动程序别名，例如 `/sys/bus/pci/devices/0000:00:0d.0/modalias` 文件应该包含字符串“pci:v00001319d00000801sv00001319sd00001319bc04sc01i00”。Udev 附带的默认规则会导致 **udevd** 调用 **/sbin/modprobe** 时传递 `MODALIAS` uevent 环境变量 (它的值应该和 sysfs 中 `modalias` 文件的内容相同)，从而加载那些在通配符扩展后别名与这个字符串匹配的模块。 

 在本例中，这意味着除了 *snd-fm801* 外，过时 (且不希望) 的 *forte* 如果可用，也会被加载。之后将介绍防止加载不希望的驱动程序的方法。 

 内核本身也能够在需要时为网络协议，文件系统，以及 NLS 支持加载模块。 

##### 处理热插拔/动态设备

当您插入一个设备，例如通用串行总线 (USB) MP3 播放器时，内核能够发现该设备现在已经被连接到系统，并生成一个 uevent 事件。之后 **udevd** 像前面描述的一样，处理该 uevent 事件。

#### 加载模块和创建设备时的问题 

##### 内核模块没有自动加载 

 Udev 只加载拥有总线特定别名，且总线驱动程序正确地向 `sysfs` 导出了必要别名的模块。如果情况不是这样，您应该考虑用其他方法加载模块。在 Linux-5.19.2 中，已知 Udev 可以加载编写正确的 INPUT，IDE，PCI，USB，SCSI，SERIO，以及 FireWire 驱动程序。 

 为了确定您需要的设备驱动程序是否包含 Udev 支持，以模块名为参数运行 **modinfo** 命令。然后试着在 `/sys/bus` 中找到设备对应的目录，并检查其中是否有 `modalias` 文件。 

 如果 `modalias` 文件存在于 `sysfs` 中，说明驱动程序支持该设备，并能够直接和设备交互，但却没有正确的别名。这是驱动程序的 bug，您需要不通过 Udev 直接加载驱动，并等待这个问题日后被解决。 

 如果 `modalias` 文件不存在于 `/sys/bus` 下的对应目录中，说明内核开发者尚未对该总线类型增加 modalias 支持。在 Linux-5.19.2 中，ISA 总线不受支持。只能等待这个问题在日后被解决。 

 Udev 根本不会尝试加载“包装器” 驱动程序，比如 *snd-pcm-oss* 等，或 *loop* 等非硬件驱动程序。 

##### 内核模块没有自动加载，且 Udev 不尝试加载它 

 如果“包装器”仅仅用于增强其他模块的功能 (例如，*snd-pcm-oss* 增强 *snd-pcm* 的功能，使 OSS 应用程序能够使用声卡)，需要配置 **modprobe**，使其在 Udev 加载被包装的模块时，自动加载包装器。为此，需要将“softdep”行添加到对应的 `/etc/modprobe.d/*`\<filename\>`*.conf` 中。例如： 

```
softdep snd-pcm post: snd-pcm-oss
```

 注意“softdep”命令也允许 `pre:` 依赖项，或混合使用 `pre:` 和 `post:` 依赖项。参阅 `modprobe.d(5)` man 手册页面，了解更多关于“softdep”语法和功能的信息。 

##### Udev 加载了不希望的模块 

 不要构建该模块，或者在 `/etc/modprobe.d/blacklist.conf` 文件中禁用它。以 *forte* 为例，下面一行禁用了该模块： 

```
blacklist forte
```

 被禁用的模块仍然可以通过直接执行 **modprobe** 手动加载。 

##### Udev 创建了错误的设备或错误的符号链接 

 这一般是由于一条规则意外地匹配了某个设备。例如，一个写得不好的规则可能同时匹配到 SCSI 磁盘 (正确的) 和对应厂商的 SCSI 通用设备 (不正确的)。找到引起问题的规则，并通过 **udevadm info** 的帮助，将它进一步细化。

##### Udev 规则工作不可靠 

这可能是前一个问题的另一个表现形式。如果不是，而且您的规则使用了 `sysfs` 属性，这个问题可能由内核计时问题引发，这类问题需要在新的内核版本中修复。目前，您可以创建一条规则以等待被使用的 `sysfs` 属性，并将它附加到 `/etc/udev/rules.d/10-wait-for-sysfs.rules` 文件中 (如果不存在就创建一个文件)，绕过这个问题。如果您通过这种方法解决了问题，请通知 LFS 开发邮件列表。 

##### Udev 没有创建设备 

 以下内容假设驱动程序已经被编译到内核中，或作为模块被加载，而且您已经检查过并确认 Udev 没有创建命名错误的设备。 

 如果驱动程序没有将它的信息导出到 `sysfs`，Udev 就无法获得创建设备节点必需的信息。这种问题往往出现在内核源代码树以外的第三方驱动程序中。这时，需要在 `/usr/lib/udev/devices` 中使用正确的主设备号和次设备号，创建一个静态设备节点 (参考内核文档中的 `devices.txt` 或第三方驱动厂商提供的文档)，该静态设备节点将被复制到 `/dev`，**udev** 会自动完成复制。 

##### 重启后设备命名顺序随机变化 

 这是由于 Udev 从设计上就是并行加载模块的，因此无法预测加载顺序。这个问题永远也不会被 “修复”。您不应该指望内核提供稳定的设备命名，而是应该创建您自己的规则，以根据设备的一些稳定属性，例如设备序列号或 Udev 安装的一些 *_id 工具的输出，来创建具有稳定名称的符号链接。

### 管理设备

#### 处理重复设备

那些功能相同的设备在 `/dev` 中的顺序是随机的。

 对于您的每个可能有这类问题的设备 (即使在您当前使用的 Linux 发行版上并没有问题)，找到 `/sys/class` 或 `/sys/block` 中的对应目录。对于视频设备，目录可能是 `/sys/class/video4linux/video*`X`*`。找出能够唯一确认该设备的属性 (通常是厂商和产品 ID，或者序列号)： 

```
udevadm info -a -p /sys/class/video4linux/video0
```

 然后编写创建符号链接的规则，例如： 

```
cat > /etc/udev/rules.d/83-duplicate_devs.rules << "EOF"

# 摄像头和电视棒的持久化符号链接
KERNEL=="video*", ATTRS{idProduct}=="1910", ATTRS{idVendor}=="0d81", SYMLINK+="webcam"
KERNEL=="video*", ATTRS{device}=="0x036f", ATTRS{vendor}=="0x109e", SYMLINK+="tvtuner"

EOF
```

 结果是，`/dev/video0` 和 `/dev/video1` 仍然会随机指向电视棒和摄像头 (因此不应直接使用它们)，但符号链接 `/dev/tvtuner` 和 `/dev/webcam` 总会指向正确设备。

### 配置系统时钟 

配置 **systemd-timedated** 系统服务，它的作用是配置系统时钟和时区。

 如果您不确定您的硬件时钟是否设置为 UTC，运行 **`hwclock --localtime --show`** 命令，它会显示硬件时钟给出的当前时间。如果这个时间和您的手表显示的一致，则说明硬件时钟被设定为本地时间。相反，如果 **hwclock** 输出的时间不是本地时间，则硬件时钟很可能被设定为 UTC 时间。根据您的时区，在 **hwclock** 显示的时间上加减对应的小时数，进行进一步的验证。例如，如果您现在处于莫斯科时区，即 GMT -0700，在本地时间上加 7 小时，再进行比较。 

 **systemd-timedated** 读取 `/etc/adjtime`，并根据其内容将硬件时钟设定为 UTC 或本地时间。 

 如果您的硬件时钟设置为本地时间，以下列内容创建 `/etc/adjtime` 文件： 

```
cat > /etc/adjtime << "EOF"
0.0 0 0.0
0
LOCAL
EOF
```

 如果 `/etc/adjtime` 在初次引导时不存在，**systemd-timedated** 会假设硬件时钟使用 UTC，并据此调整该文件。 

 您也可以使用 **timedatectl** 工具告诉 **systemd-timedated** 您的硬件时钟是 UTC 还是本地时间： 

```
timedatectl set-local-rtc 1
```

 **timedatectl** 也能修改系统时间和时区。 

 如果要修改系统时间，执行以下命令： 

```
timedatectl set-time YYYY-MM-DD HH:MM:SS
```

 硬件时钟也会同时被更新。 

 要修改当前时区，执行以下命令： 

```
timedatectl set-timezone TIMEZONE
```

 您可以通过运行以下命令查看可用的时区列表： 

```
timedatectl list-timezones
```

#### 网络时钟同步

 从版本 213 开始，systemd 附带了一个名为 **systemd-timesyncd** 的守护程序，可以用于将系统时间与远程 NTP 服务器同步。 

 该守护程序没有被设计为替代现有成熟的 NTP 守护程序，而是一个仅仅实现了 SNTP 协议的客户端，可以用于一些不太复杂的任务，或是资源紧张的系统。 

 从 systemd 版本 216 开始，**systemd-timesyncd** 守护进程被默认启用。如果希望禁用它，执行以下命令： 

```
systemctl disable systemd-timesyncd
```

 可以在 `/etc/systemd/timesyncd.conf` 中修改 **systemd-timesyncd** 使用的服务器。 

 注意，当系统时钟设定为本地时间时，**systemd-timesyncd** 不会更新硬件时钟。 



### 配置 Linux 控制台 

 **systemd-vconsole-setup** 服务从 `/etc/vconsole.conf` 文件中读取配置信息。它根据配置确定使用的键映射和控制台字体。一些与特定语言相关的 HOWTO 文档可以帮助您进行配置，参阅 http://www.tldp.org/HOWTO/HOWTO-INDEX/other-lang.html。浏览 **localectl list-keymaps** 输出的可用控制台键映射列表。在 `/usr/share/consolefonts` 目录中寻找可用的控制台字体。 

 `/etc/vconsole.conf` 文件的每一行都应该符合格式：变量名="值"， 

-  KEYMAP 

   该变量指定键盘的键映射表。如果没有设定，默认为 `us`。 

-  KEYMAP_TOGGLE 

   该变量可以用于配置第二切换键盘映射，没有默认设定值。 

-  FONT 

   该变量指定虚拟控制台使用的字体。 

-  FONT_MAP 

   该变量指定控制台字体映射。 

-  FONT_UNIMAP 

   该变量指定 Unicode 字体映射。 

 下面的例子可以用于德文键盘和控制台： 

```
cat > /etc/vconsole.conf << "EOF"
KEYMAP=de-latin1
FONT=Lat2-Terminus16
EOF
```

 在系统运行时，可以使用 **localectl** 工具修改 KEYMAP 变量值： 

```
localectl set-keymap MAP
```

####  注意 

 请注意 **localectl** 命令在 chroot 环境无法工作。只有在使用 systemd 引导 LFS 系统后才能使用它。 

 也可以通过指定 **localectl** 工具的参数，修改 X11 键盘布局，模型，变体和选项设置： 

```
localectl set-x11-keymap 布局 [模型] [变体] [选项]
```

 如果需要列出可用的 **localectl set-x11-keymap** 参数值，可以使用下列参数运行 **localectl** 命令： 

-  list-x11-keymap-models 

   列出已知的 X11 键盘映射模型。 

-  list-x11-keymap-layouts 

   列出已知的 X11 键盘映射布局。 

-  list-x11-keymap-variants 

   列出已知的 X11 键盘映射变体。 

-  list-x11-keymap-options 

   列出已知的 X11 键盘映射选项。 



####  注意 

 上面给出的参数都需要 BLFS 中的 XKeyboard-Config 软件包。 

### 配置系统 Locale

 下面将创建的 `/etc/locale.conf` 设定本地语言支持需要的若干环境变量，正确设定它们可以带来以下好处： 

-  程序输出被翻译成本地语言
-  字符被正确分类为字母、数字和其他类别，这对于使 **bash** 正确接受命令行中的非 ASCII 本地非英文字符来说是必要的
-  根据所在地区惯例排序字母
-  适用于所在地区的默认纸张尺寸
-  正确格式化货币、时间和日期值

 将下面的 *`<ll>`* 替换为所需语言的双字符代号 (例如“en”)，*`<CC>`* 替换为国家或地区的双字符代号 (例如“GB”)，*`<charmap>`* 替换为您选定的 locale 的标准字符映射。另外，还可以加入 “@euro” 等可选修饰符。 

 Glibc 支持的所有 locale 可以用以下命令列出： 

```
locale -a
```

 字符映射可能有多个别名，例如“ISO-8859-1”也可以称为“iso8859-1”或者“iso88591”。某些程序不能正确处理一些别名 (例如，“UTF-8”必须写作“UTF-8”才能识别，而不能识别“utf8”)，因此在多数情况下，为了保险起见，最好使用 locale 的规范名称。为了确定规范名称，执行以下命令，将 *`<locale 名>`* 替换成 **locale -a** 对于您希望的 locale 的输出 (以“en_GB.iso88591”为例)。 

```
LC_ALL=<locale 名> locale charmap
```

 对于“en_GB.iso88591”locale，以上命令输出： 

```
ISO-8859-1
```

 这样就最终确定 locale 应设置为“en_GB.ISO-8859-1”。在将以上启发方法获得的 locale 添加到 Bash 启动文件之前，一定要进行下列测试： 

```
LC_ALL=<locale 名> locale language
LC_ALL=<locale 名> locale charmap
LC_ALL=<locale 名> locale int_curr_symbol
LC_ALL=<locale 名> locale int_prefix
```

 以上命令应该输出语言名称，选定 locale 使用的字符编码，本地货币符号，以及所在国家或地区的国际电话区号。如果以上某个命令失败并输出类似下面这样的消息，意味着您的 locale 在第 8 章中没有安装，或者不被 Glibc 的默认安装支持。 

```
locale: Cannot set LC_* to default locale: No such file or directory
```

 如果出现了这种消息，您应该用 **localedef** 命令安装所需的 locale，或重新选择一个不同的 locale。后文假设 Glibc 没有输出类似错误消息。 

 某些 LFS 以外的软件包可能缺乏对您选择的 locale 的支持，例如 X 库 (X 窗口系统的一部分)，它在您的 locale 与它内部文件中的字符映射表名不完全匹配时，会输出以下错误消息： 

```
Warning: locale not supported by Xlib, locale set to C
```

 某些情况下 Xlib 期望字符映射以带有规范连字符的大写形式给出，例如应该使用 “ISO-8859-1”而不是“iso88591”。有时也可以通过去除 locale 规范中的字符映射部分找到合适的规范，可以通过运行 **locale charmap** 确认。例如，您需要将“de_DE.ISO-8859-15@euro”替换成“de_DE@euro”，以获得 Xlib 能够识别的 locale。 

 其他软件包在 locale 名不符合它们的期望时可能工作不正常(但未必输出错误消息)。在这种情况下，探索一下其他 Linux 发行版是如何支持您的 locale 的，可以得到一些有用的信息。 

 在确定了正确的 locale 设置后，创建 `/etc/locale.conf` 文件： 

```
cat > /etc/locale.conf << "EOF"
LANG=<ll>_<CC>.<charmap><@modifiers>
EOF
```

 修改 `/etc/locale.conf` 的另一种方法是使用 systemd 的 **localectl** 工具。例如，要使用 **localectl** 完成上面给出的 locale 设置，运行命令： 

```
localectl set-locale LANG="<ll>_<CC>.<charmap><@modifiers>"
```

 您也可以指定其他语言相关的环境变量，例如 `LANG`，`LC_CTYPE`，`LC_NUMERIC`，或 **locale** 输出的其他环境变量，用空格将它们分割即可。例如，将 `LANG` 设置为 en_US.UTF-8，`LC_CTYPE` 设置为 en_US： 

```
localectl set-locale LANG="en_US.UTF-8" LC_CTYPE="en_US"
```

####  注意 

 请注意 **localectl** 命令在 chroot 环境无法工作。只有在使用 systemd 引导 LFS 系统后才能使用它。 

 “C” (默认 locale) 和“en_US”(推荐美式英语用户使用的 locale) 是不同的。“C” locale 使用 US-ASCII 7 位字符集，并且将最高位为 1 的字节视为无效字符。因此，**ls** 等命令会将它们替换为问号。另外，如果试图用 Mutt 或 Pine 发送包含这些字符的邮件，会发出不符合 RFC 标准的消息 (发出邮件的字符集会被标为“未知 8 位”)。因此，您只能在确信自己永远不会使用 8 位字符时才能使用“C” locale。 

### 创建 /etc/inputrc 文件

 `inputrc` 文件是 Readline 库的配置文件，该库在用户从终端输入命令行时提供编辑功能。它的工作原理是将键盘输入翻译为特定动作。Readline 被 Bash 和大多数其他 shell，以及许多其他程序使用。 

 多数人不需要 Readline 的用户配置功能，因此以下命令创建全局的 `/etc/inputrc` 文件，供所有登录用户使用。如果您之后决定对于某个用户覆盖掉默认值，您可以在该用户的主目录下创建 `.inputrc` 文件，包含需要修改的映射。 

 关于更多如何编写 `inputrc` 文件的信息，参考 **info bash** 中 *Readline Init File* 一节。**info readline** 也是一个很好的信息源。 

 下面是一个通用的全局 `inputrc` 文件，包含解释一些选项含义的注释。注意注释不能和命令写在同一行。执行以下命令创建该文件： 

```
cat > /etc/inputrc << "EOF"
# Begin /etc/inputrc
# Modified by Chris Lynn <roryo@roryo.dynup.net>

# Allow the command prompt to wrap to the next line
set horizontal-scroll-mode Off

# Enable 8-bit input
set meta-flag On
set input-meta On

# Turns off 8th bit stripping
set convert-meta Off

# Keep the 8th bit for display
set output-meta On

# none, visible or audible
set bell-style none

# All of the following map the escape sequence of the value
# contained in the 1st argument to the readline specific functions
"\eOd": backward-word
"\eOc": forward-word

# for linux console
"\e[1~": beginning-of-line
"\e[4~": end-of-line
"\e[5~": beginning-of-history
"\e[6~": end-of-history
"\e[3~": delete-char
"\e[2~": quoted-insert

# for xterm
"\eOH": beginning-of-line
"\eOF": end-of-line

# for Konsole
"\e[H": beginning-of-line
"\e[F": end-of-line

# End /etc/inputrc
EOF
```

### 创建 /etc/shells 文件

 `shells` 文件包含系统登录 shell 的列表，应用程序使用该文件判断 shell 是否合法。该文件中每行指定一个 shell，包含该 shell 相对于目录树根 (/) 的路径。 

 例如 **chsh** 使用该文件判断一个非特权用户是否可以修改自己的登录 shell。如果命令没有在 /etc/shell 中找到，就会拒绝修改操作。 

 这个文件对某些程序是必要的。例如 GDM 在找不到 `/etc/shells` 时不会填充登录界面，FTP 守护进程通常禁止那些使用未在此文件列出的终端的用户登录。 

```
cat > /etc/shells << "EOF"
# Begin /etc/shells

/bin/sh
/bin/bash

# End /etc/shells
EOF
```

### Systemd 使用和配置

#### 基础设置 

 `/etc/systemd/system.conf` 文件包含一组控制 systemd 基本功能的选项。默认文件中所有条目都被注释掉，并标明了默认值。可以在这里修改日志级别，以及其他一些基本日志设定。参阅 `systemd-system.conf(5)` man 手册页面了解每个选项的详细信息。 

#### 禁用引导时自动清屏 

 Systemd 的默认行为是在引导过程结束时清除屏幕。如果希望的话，您可以运行以下命令，修改这一行为： 

```
mkdir -pv /etc/systemd/system/getty@tty1.service.d

cat > /etc/systemd/system/getty@tty1.service.d/noclear.conf << EOF
[Service]
TTYVTDisallocate=no
EOF
```

 您总是可以用 `root` 身份运行 **`journalctl -b`** 命令，查阅引导消息。 

#### 禁止将 tmpfs 挂载到 /tmp 

 默认情况下，`/tmp` 将被挂载 tmpfs 文件系统。如果不希望这样，可以执行以下命令覆盖这一行为： 

```
ln -sfv /dev/null /etc/systemd/system/tmp.mount
```

 或者，如果希望使用一个单独的 `/tmp` 分区，在 `/etc/fstab` 中为其添加一个条目。 

#####  警告 

 如果使用了单独的 `/tmp` 分区，不要创建上面的符号链接。这会导致根文件系统 (/) 无法重新挂载为可读写，使得系统在引导后不可用。 

#### 配置文件自动创建和删除 

 有一些创建或删除文件、目录的服务： 

-  systemd-tmpfiles-clean.service
-  systemd-tmpfiles-setup-dev.service
-  systemd-tmpfiles-setup.service

 它们的系统配置文件位于 `/usr/lib/tmpfiles.d/*.conf`。本地配置文件位于 `/etc/tmpfiles.d`。`/etc/tmpfiles.d` 中的文件覆盖 `/usr/lib/tmpfiles.d` 中的同名文件。参阅 `tmpfiles.d(5)` man 手册页面，了解配置文件格式的细节。 

 注意 `/usr/lib/tmpfiles.d/*.conf` 文件的语法较难理解。例如，删除 /tmp 目录下文件的默认规则是文件 `/usr/lib/tmpfiles.d/tmp.conf` 的一行： 

```
q /tmp 1777 root root 10d
```

 类别字段 q 表示创建一个带有配额的子卷，它实际上只适用于 btrfs 文件系统。它引用类别 v，类别 v 又引用类别 d (目录)。对于类别 d，会在目录不存在时自动创建它，并根据配置文件调整其权限和所有者。如果 age 参数被指定，该目录中较老的文件会被自动清理。 

 如果默认参数不符合您的期望，您可以将文件复制到 `/etc/tmpfiles.d` 目录，再编辑复制得到的副本。例如： 

```
mkdir -p /etc/tmpfiles.d
cp /usr/lib/tmpfiles.d/tmp.conf /etc/tmpfiles.d
```

#### 覆盖系统服务默认行为 

 Systemd 单元的参数可以通过在 `/etc/systemd/system` 中创建一个包含配置文件的目录而覆盖。例如： 

```
mkdir -pv /etc/systemd/system/foobar.service.d

cat > /etc/systemd/system/foobar.service.d/foobar.conf << EOF
[Service]
Restart=always
RestartSec=30
EOF
```

 参阅 `systemd.unit(5)` man 手册页面获取更多信息。在创建配置文件后，执行 **`systemctl daemon-reload`** 和 **`systemctl restart foobar`**，激活对服务进行的修改。 

#### 调试引导过程

 与 SysVinit 或 BSD 风格 init 系统不同，systemd 使用统一格式处理不同种类的引导文件 (或称为单元)。命令 **systemctl** 能够启用、禁用单元文件，或控制、查询单元文件的状态。以下是一些常用的命令：

-  **systemctl list-units -t \*`<service>`\* [--all]**: 列出已加载的服务 (service) 类型单元文件。 
-  **systemctl list-units -t \*`<target>`\* [--all]**: 列出已加载的引导目标 (target) 类型单元文件。 
-  **systemctl show -p Wants \*`<multi-user.target>`\***: 显示所有依赖于 multi-user 引导目标的单元，引导目标 (target)是一种和 SysVinit 中运行级别 (runlevel) 地位相同的特殊单元文件。 
-  **systemctl status \*`<servicename.service>`\***: 显示名为 servicename 的服务的状态。如果没有同名的其他类型单元文件，可以省略 .service 后缀。其他类型的单元文件有 .socket 文件 (它创建一个监听套接字，提供和 inetd/xinetd 类似的功能)。 

#### 使用 systemd 日志

 (默认情况下) 在使用 systemd 引导的系统上，systemd-journald 服务负责处理日志，它取代了传统的 Unix syslog 守护进程。如果您希望的话，也可以添加一个普通 syslog 守护进程，它和 systemd-journald 可以一起工作。systemd-journald 程序将日志项储存为二进制格式，而不是纯文本日志文件。为了解析日志文件，需要使用 systemd 提供的 **journalctl** 命令。下面是该命令的常见用法：

-  **journalctl -r**：按时间顺序，倒序显示所有日志内容。 
-  **journalctl -u \*`UNIT`\***: 显示与给定单元文件 UNIT 关联的日志。 
-  **journalctl -b[=ID] -r**: 按时间倒序，显示自上次引导以来 (或编号为 ID 的引导中) 的所有日志。 
-  **journalctl -f**: 提供类似 tail -f 的功能 (不断将新日志项输出到屏幕)。 

#### 处理核心转储

 核心转储在调试崩溃的程序时非常有用，特别是对于守护进程崩溃的情况。在 systemd 引导的系统上，核心转储由 **systemd-coredump** 处理。它会在日志中记录核心转储，并且将核心转储文件本身存储到 `/var/lib/systemd/coredump` 中。如果要获取和处理核心转储文件，可以使用 **coredumpctl** 工具。下面给出它的常用命令的示例：

-  **coredumpctl -r**：按时间顺序，倒序显示所有核心转储记录。 
-  **coredumpctl -1 info**：显示最近一次核心转储的信息。 
-  **coredumpctl -1 debug**：将最后一次核心转储加载到 [GDB](https://www.linuxfromscratch.org/blfs/view/stable-systemd/general/gdb.html) 中。 

 核心转储可能使用大量磁盘空间。为了限制核心转储使用的最大磁盘空间，可以在 `/etc/systemd/coredump.conf.d` 中创建一个配置文件。例如：

```
mkdir -pv /etc/systemd/coredump.conf.d

cat > /etc/systemd/coredump.conf.d/maxuse.conf << EOF
[Coredump]
MaxUse=5G
EOF
```

 参阅 man 手册页面 `systemd-coredump(8)`，`coredumpctl(1)`，以及 `coredump.conf.d(5)` 了解更多信息。

####  持续运行进程

 从 systemd 的 230 版本开始，在用户会话结束时，所有用户进程都被杀死，即使使用了 nohup 或 `daemon()` 、`setsid` 等函数也不例外。这是开发者有意做出的修改，将传统的宽松环境改为更加严格的环境。如果您需要让持续运行的程序 (例如 **screen** 或 **tmux**) 在用户会话结束后保持运行，这项新的行为会导致问题。有三种方法使得这类驻留进程在用户会话结束后继续运行：

-  *仅为选定的用户启用进程驻留*：普通用户有执行命令 **loginctl enable-linger** 启用进程驻留的权限，管理员可以使用带 *`user`* 参数的该命令，为特定用户启用进程驻留。在启用进程驻留后，可以使用 **systemd-run** 命令启动持续运行的进程。例如，**systemd-run --scope --user /usr/bin/screen**。如果您为您的用户启用了进程驻留，则 user@.service 将持续运行，甚至在所有登录会话关闭后仍然运行，而且会在系统引导时自动启动。这种方法的好处是可以显式地允许或禁止进程在用户会话结束后继续运行，但却破坏了和 **nohup** 等工具，和使用 `daemon()` 函数的工具的兼容性。 
-  *为整个系统启用进程驻留*：您可以在将*`KillUserProcesses=no`* 设置行加入 `/etc/systemd/logind.conf`，为所有用户全局地启用进程驻留。它的好处是允许所有用户继续使用旧方法，但无法进行明确控制。 
-  *在编译时禁用该功能*：您可以在构建 systemd 时传递参数 *`-Ddefault-kill-user-process=no`* 给 **meson**，使得 systemd 默认启用进程驻留。这完全禁用了 systemd 在会话结束时杀死用户进程的功能。 

## 使 LFS 系统可引导

### 创建 /etc/fstab 文件 

 一些程序使用 `/etc/fstab` 文件，以确定哪些文件系统是默认挂载的，和它们应该按什么顺序挂载，以及哪些文件系统在挂载前必须被检查 (确定是否有完整性错误)。参考以下命令，创建一个新的文件系统表： 

```
cat > /etc/fstab << "EOF"
# Begin /etc/fstab

# 文件系统 挂载点类型 选项转储检查
#顺序

/dev/<xxx> /<fff>defaults1 1
/dev/<yyy> swapswap pri=1 0 0

# End /etc/fstab
EOF
```

 将 *`<xxx>`*、*`<yyy>`* 和 *`<fff>`* 替换为适用于您的系统的值，例如 `sda2`、`sda5` 和 `ext4`。参阅 **man 5 fstab** 了解该文件中 6 个域的详细信息。 

 在挂载来源于 MS-DOS 或 Windows 的文件系统 (如 vfat、ntfs、smbfs、cifs、iso9660、udf) 时，需要一个特殊的挂载选项 —— utf8，才能正常解析文件名中的非 ASCII 字符。对于非 UTF-8 locale，选项 `iocharset` 的值应该和您的 locale 字符集设定一致，但改写成内核可以识别的写法。该选项能够正常工作的前提是，将相关的字符集定义 (在内核配置选项的 File Systems -> Native Language Support 子菜单中) 编译到内核中，或构建为内核模块。然而，如果使用了 UTF-8 locale，对应的 `iocharset=utf8` 会导致文件系统变得大小写敏感。为了避免这个问题，在使用 UTF-8 locale 时，需要用特殊选项 `utf8` 代替 `iocharset=utf8`。另外，vfat 和 smbfs 文件系统还需要“codepage”选项，它应该被设定为您的语言在 MS-DOS 下的代码页编号。例如，为了挂载一个 USB 闪存盘，一个 ru_RU.KOI8-R 用户应该在 `/etc/fstab` 中对应于闪存盘的行添加下列挂载选项： 

```
noauto,user,quiet,showexec,codepage=866,iocharset=koi8r
```

 相应的，ru_RU.UTF-8 用户应该使用下列选项： 

```
noauto,user,quiet,showexec,codepage=866,utf8
```

 注意此时使用的 `iocharset` 默认为 `iso8859-1` (这保证文件系统是大小写不敏感的)，而 `utf8` 选项告诉内核使用 UTF-8 编码转换文件名，这样它们就能在 UTF-8 locale 中被正确解析。 

 也可以在内核配置中，为一些文件系统指定默认 codepage 和 iocharset 选项值。相关的配置参数名为“Default NLS Option” (`CONFIG_NLS_DEFAULT`)，“Default Remote NLS Option” (`CONFIG_SMB_NLS_DEFAULT`)，“Default codepage for FAT” (`CONFIG_FAT_DEFAULT_CODEPAGE`)，以及 “Default iocharset for FAT” (`CONFIG_FAT_DEFAULT_IOCHARSET`)。无法在编译内核时为 ntfs 文件系统指定这些默认值。 

 在某些硬盘上，通过将 `barrier=1` 挂载选项加入 `/etc/fstab`，可以使得 ext3 文件系统在发生电源故障时更可靠。为了检查磁盘驱动器是否支持该选项，在可用的磁盘驱动器上运行 [hdparm](https://www.linuxfromscratch.org/blfs/view/stable-systemd/general/hdparm.html)。例如： 

```
hdparm -I /dev/sda | grep NCQ
```

 如果输出内容不为空，说明该选项可用。 

 注意：基于逻辑卷管理 (LVM) 的分区不能使用 `barrier` 选项。 

### Linux-5.19.2

#### 安装内核

 构建内核需要三步 —— 配置、编译、安装。阅读内核源代码树中的 `README` 文件，了解不同于本手册的内核配置方法。

 运行以下命令，准备编译内核：

```
make mrproper
```

 该命令确保内核源代码树绝对干净，内核开发组建议在每次编译内核前运行该命令。尽管内核源代码树在解压后应该是干净的，但这并不完全可靠。

 有多种配置内核选项的方法。例如，通常我们通过目录驱动的界面完成这一工作：

```
make menuconfig
```

 **以上命令中可选的 make 环境变量及含义：** 

-  *`LANG=<host_LANG_value> LC_ALL=`* 

     它们根据宿主使用的 locale 建立 locale 设定。在 UTF-8 Linux 文本终端下，有时必须这样做才能正确绘制基于 ncurses 的配置菜单接口。在这种情况下，一定要将 *`<host_LANG_value>`* 替换成宿主环境中的 `$LANG` 变量值。您也可以使用宿主环境中 `$LC_ALL` 或 `$LC_CTYPE` 的值代替。

-  **make menuconfig** 

     这会启动 ncurses 目录驱动的界面。如果希望了解其他 (图形) 界面，可以输入 **make help**。

 阅读 [https://www.linuxfromscratch.org/hints/downloads/files/kernel-configuration.txt](https://www.linuxfromscratch.org/hints/downloads/files/kernel-configuration.txt) 了解关于内核配置的一般信息。BLFS 包含一些关于 LFS 之外的软件包需要的特定内核配置的信息，位于https://www.linuxfromscratch.org/blfs/view/stable-systemd/longindex.html#kernel-config-index。另外在 http://www.kroah.com/lkn/ 也有一些关于配置和构建内核的信息。

#####    注意 

 一个较好的初始内核配置可以通过运行 **make defconfig** 获得。它会考虑您的当前系统体系结构，将基本内核配置设定到较好的状态。 

 一定要按照以下列表启用/禁用/设定其中列出的内核特性，否则系统可能不能正常工作，甚至根本无法引导： 

```
General setup -->
 [ ] Compile the kernel with warnings as errors [CONFIG_WERROR]
 [ ] Auditing Support [CONFIG_AUDIT]
 < > Enable kernel headers through /sys/kernel/kheaders.tar.xz [CONFIG_IKHEADERS]
 [*] Control Group support [CONFIG_CGROUPS]
[*] Memory controller [CONFIG_MEMCG]
 [ ] Enable deprecated sysfs features to support old userspace tools [CONFIG_SYSFS_DEPRECATED]
 [*] Configure standard kernel features (expert users) [CONFIG_EXPERT] --->
[*] open by fhandle syscalls [CONFIG_FHANDLE]
 CPU/Task time and stats accounting --->
[*] Pressure stall information tracking [CONFIG_PSI]
General architecture-dependent options--->
 [*] Enable seccomp to safely compute untrusted bytecode [CONFIG_SECCOMP]
Networking support--->
Networking options--->
 <*> The IPv6 protocol [CONFIG_IPV6]
Device Drivers--->
Firmware Drivers--->
 [*] Export DMI identification via sysfs to userspace [CONFIG_DMIID]
Graphics support --->
 Frame buffer Devices --->
[*] Support for frame buffer devices ----
Generic Driver Options--->
 [ ] Support for uevent helper [CONFIG_UEVENT_HELPER]
 [*] Maintain a devtmpfs filesystem to mount at /dev [CONFIG_DEVTMPFS]
 [*] Automount devtmpfs at /dev, after the kernel mounted the rootfs [CONFIG_DEVTMPFS_MOUNT]
 Firmware Loader --->
[ ] Enable the firmware sysfs fallback mechanism [CONFIG_FW_LOADER_USER_HELPER]
File systems--->
 [*] Inotify support for userspace [CONFIG_INOTIFY_USER]
Pseudo filesystems--->
 [*] Tmpfs POSIX Access Control Lists [CONFIG_TMPFS_POSIX_ACL]
```

 如果在构建 64 位系统，还需要启用一些特性。如果使用 menuconfig 进行配置，需要首先启用 *`CONFIG_PCI_MSI`*，然后启用 *`CONFIG_IRQ_REMAP`*，最后启用 *`CONFIG_X86_X2APIC`*，这是因为只有选定了一个选项的所有依赖项后，该选项才会出现。 

```
Processor type and features --->
[*] Support x2apic [CONFIG_X86_X2APIC]
Memory Management options--->
[ ] Enable userfaultfd() system call [CONFIG_USERFAULTFD]
Device Drivers --->
[*] PCI Support ---> [CONFIG_PCI]
[*] Message Signaled Interrupts (MSI and MSI-X) [CONFIG_PCI_MSI]
[*] IOMMU Hardware Support ---> [CONFIG_IOMMU_SUPPORT]
[*] Support for Interrupt Remapping [CONFIG_IRQ_REMAP]
```

#####    注意 

 尽管 “The IPv6 Protocol” (IPv6 协议支持) 并不是严格要求的，但是 systemd 开发者强烈推荐启用它。 

#####    注意 

 如果您的硬件支持 UEFI，且您希望通过 UEFI 引导 LFS 系统，则您需要按照 [BLFS 页面](https://www.linuxfromscratch.org/blfs/view/stable-systemd/postlfs/grub-setup.html#uefi-kernel) 的说明，调整一些内核配置选项。 

 **上述配置选项的含义：** 

-  *`Compile the kernel with warnings as errors`* 

     如果使用了和内核开发者不同的编译器和/或配置，启用该选项可能导致构建失败。

-  *`Enable kernel headers through /sys/kernel/kheaders.tar.xz`* 

     启用该选项将会导致构建内核需要 **cpio**。LFS 没有安装 **cpio**。

-  *`Support for uevent helper`* 

     如果启用了该选项，它可能干扰 Udev/Eudev 的设备管理。

-  *`Maintain a devtmpfs`* 

     该选项会使内核自动创建设备节点，即使 Udev 没有运行。Udev 之后才在这些设备节点的基础上运行，管理它们的访问权限并为它们建立符号链接。所有 Udev/Eudev 用户都需要启用该选项。

-  *`Automount devtmpfs at /dev`* 

     该选项使得内核在切换到根文件系统之后，执行 init 前，将内核获知的设备信息挂载到 /dev。

-  *`Support x2apic`* 

     支持以 x2APIC 模式运行 64 位 x86 处理器的中断控制器。64 位 x86 系统的固件可能启用了 x2APIC，此时未启用该选项的内核在引导时会发生内核恐慌。该选项在固件禁用 x2APIC 时没有作用，但无害。

-  *`Enable userfaultfd() system call`* 

     如果启用该选项，则会暴露一项在 Linux-5.19.2 中尚未解决的安全缺陷。禁用该选项以避免安全缺陷。userfaultfd() 系统调用并未被 LFS 或 BLFS 中的任何组件使用。

 某些情况下，**make oldconfig** 更为合适。阅读 `README` 文件了解更多信息。

 如果希望的话，也可以将宿主系统的内核配置文件 `.config` 拷贝到解压出的 `linux-5.19.2` 目录 (前提是可以找到该文件)。然而我们不推荐这样做，一般来说，浏览整个配置目录，并从头创建内核配置是更好的选择。

 编译内核映像和模块：

```
make
```

 如果要使用内核模块，可能需要在 `/etc/modprobe.d` 中写入模块配置。讨论模块和内核配置的信息位于[第 9.3 节 “设备和模块管理概述”](https://lfs.xry111.site/zh_CN/11.2-systemd/chapter09/udev.html)和 `linux-5.19.2/Documentation` 目录下的内核文档中。另外 `modprobe.d(5)` 也可以作为参考。

 如果内核配置使用了模块，安装它们：

```
make modules_install
```

 在内核编译完成后，需要进行额外步骤完成安装，一些文件需要拷贝到 `/boot` 目录中。

#####    小心 

 如果宿主系统有单独的 /boot 分区，需要将这些文件拷贝到该分区中。最简单的方法是将宿主系统的 /boot (在 chroot 之外) 绑定到 /mnt/lfs/boot 再拷贝文件，在*宿主系统*中，以 `root` 身份执行： 

```
mount --bind /boot /mnt/lfs/boot
```

 指向内核映像的路径可能随机器平台的不同而变化。下面使用的文件名可以依照您的需要改变，但文件名的开头应该保持为 *vmlinuz*，以保证和下一节描述的引导过程自动设定相兼容。下面的命令假定是机器是 x86 体系结构：

```
cp -iv arch/x86/boot/bzImage /boot/vmlinuz-5.19.2-lfs-11.2-systemd
```

 `System.map` 是内核符号文件，它将内核 API 的每个函数入口点和运行时数据结构映射到它们的地址。它被用于调查分析内核可能出现的问题。执行以下命令安装该文件：

```
cp -iv System.map /boot/System.map-5.19.2
```

 内核配置文件 `.config` 由上述的 **make menuconfig** 步骤生成，包含编译好的内核的所有配置选项。最好能将它保留下来以供日后参考：

```
cp -iv .config /boot/config-5.19.2
```

 安装 Linux 内核文档：

```
install -d /usr/share/doc/linux-5.19.2
cp -r Documentation/* /usr/share/doc/linux-5.19.2
```

 需要注意的是，在内核源代码目录中可能有不属于 *root* 的文件。在以 *root* 身份解压源代码包时 (就像我们在 chroot 环境中所做的那样)，这些文件会获得它们之前在软件包创建者的计算机上的用户和组 ID。这一般不会造成问题，因为在安装后通常会删除源代码目录树。然而，Linux 源代码目录树一般会被保留较长时间，这样创建者当时使用的用户 ID 就可能被分配给本机的某个用户，导致该用户拥有内核源代码的写权限。

#####    注意 

 之后在 BLFS 中安装软件包时往往需要修改内核配置。因此，和其他软件包不同，我们在安装好内核后可以不移除源代码树。 

 如果要保留内核源代码树，对内核源代码目录运行 **chown -R 0:0** 命令，以保证 `linux-5.19.2` 目录中所有文件都属于 *root*。 

#####    警告 

 有的内核文档建议创建符号链接 `/usr/src/linux` 指向内核源代码目录，这仅仅适用于 2.6 系列之前的内核。在 LFS 系统上*绝对不要*创建它，因为在构建完基本 LFS 系统后，它可能在您构建其他软件包时引起问题。 

#####    警告 

 在系统 `include` 目录 (即 `/usr/include`) 中的内核头文件应该*总是*与构建 Glibc 时使用的内核头文件一致，即保持为[第 5.4 节 “Linux-5.19.2API 头文件”](https://lfs.xry111.site/zh_CN/11.2-systemd/chapter05/linux-headers.html)中安装的净化头文件。换句话说，*永远不要*用原始内核头文件，或其他版本内核的净化头文件替换它们。 

#### 配置 Linux 内核模块加载顺序 

 多数情况下 Linux 内核模块可以自动加载，但有时需要指定加载顺序。负责加载内核模块的程序 **modprobe** 和 **insmod** 从 `/etc/modprobe.d` 下的配置文件中读取加载顺序，例如，如果 USB 驱动程序 (ehci_hcd、ohci_hcd 和 uhci_hcd) 被构建为模块，则必须按照先加载 echi_hcd，再加载 ohci_hcd 和 uhci_hcd 的正确顺序，才能避免引导时出现警告信息。 

 为此，执行以下命令创建文件 `/etc/modprobe.d/usb.conf`： 

```
install -v -m755 -d /etc/modprobe.d
cat > /etc/modprobe.d/usb.conf << "EOF"
# Begin /etc/modprobe.d/usb.conf

install ohci_hcd /sbin/modprobe ehci_hcd ; /sbin/modprobe -i ohci_hcd ; true
install uhci_hcd /sbin/modprobe ehci_hcd ; /sbin/modprobe -i uhci_hcd ; true

# End /etc/modprobe.d/usb.conf
EOF
```

#### Linux 的内容 

 **安装的文件:** config-5.19.2, vmlinuz-5.19.2-lfs-11.2-systemd, 以及 System.map-5.19.2 

 **安装的目录:** /lib/modules 和 /usr/share/doc/linux-5.19.2 

#####    简要描述 

| `config-5.19.2`                   | 包含所有内核配置选项的值                                     |
| --------------------------------- | ------------------------------------------------------------ |
| `vmlinuz-5.19.2-lfs-11.2-systemd` | Linux系统的引擎，在启动计算机时，它是操作系统中被最早加载的部分。它检测并初始化计算机硬件，将它们以目录树的形式提供给软件，并将单个CPU 封装成多任务系统，使多个用户程序看上去在同时执行 |
| `System.map-5.19.2`               | 地址和符号列表；它将内核函数和数据结构映射为入口点和地址     |

### 使用 GRUB设定引导过程

#### 概述

##### 警告

如果您不小心错误地配置了 GRUB，可能导致您的系统完全无法使用，除非使用 CD-ROM 或可引导的 USB存储器等备用引导设备。本节不是引导您的 LFS 系统的唯一方案，您可能只要修改现有的启动加载器 (如Grub-Legacy、GRUB2 或 LILO) 配置即可引导 LFS。

您务必保证自己拥有一个紧急引导磁盘，它在计算机不可用 (无法引导) 时能够 “抢修”计算机。如果您现在还没有引导设备，您可以执行以下命令创建一个。在运行下列命令前，您需要跳到 BLFS，安装包含**`xorriso`** 的 [ libisoburn](https://www.linuxfromscratch.org/blfs/view/stable-systemd/multimedia/libisoburn.html) 软件包：

```
cd /tmp
grub-mkrescue --output=grub-img.iso
xorriso -as cdrecord -v dev=/dev/cdrw blank=as_needed grub-img.iso
```

####  GRUB 命名惯例

GRUB 使用一种独特的命名结构，为驱动器和分区命名。分区名的形式为 *(hdn,m)*，这里 *n* 是硬盘驱动器编号，*m* 是分区编号。硬盘驱动器编号从 0 开始，但分区号对于主分区来说从 1开始，而对于扩展分区来说从 5 开始。例如，分区 `sda1` 在 GRUB中的名字是 *(hd0,1)*，而 `sdb3` 的名字是 *(hd1,3)*。和 Linux 不同，GRUB 不认为 CD-ROM驱动器属于硬盘驱动器。例如，如果在 `hdb` 上有一个 CD-ROM驱动器，而 `hdc` 上有第二个硬盘驱动器，则第二个硬盘驱动器仍然名为*hd1*。

#### 设定 GRUB 配置

GRUB 的工作方式是，将数据写入硬盘的第一个物理磁道。这里不属于任何文件系统，在启动时，第一个物理磁道中的程序从引导分区加载GRUB 模块，默认在 /boot/grub 中查找模块。

引导分区的位置由负责进行配置的用户自己决定，作者推荐创建一个小的 (建议大小为 200 MB) 分区，专门存放引导信息。这样，不同的Linux 系统 (无论是 LFS 还是商业发行版)在启动时和启动后都能访问相同的引导文件。如果您选择这样做，您需要挂载这个单独的分区，将 `/boot` 中已有的文件 (例如上一节中构建的内核)移动到新的分区中。之后，解除该分区的挂载，并将它挂载为 `/boot`。另外，还要注意更新 `/etc/fstab`。

直接使用 LFS 分区也是可以的，但这样在配置多系统启动时比较麻烦。

根据以上信息，确定 LFS 根分区 (或 boot 分区，如果使用了独立的 boot 分区) 的名称。下面假设 LFS 根分区 (或boot 分区) 是 `sda2`。

将 GRUB 文件安装到 `/boot/grub` 并设定引导磁道：

##### 警告

以下命令会覆盖当前启动引导器，如果这不是您希望的，不要运行该命令。例如，如果您使用第三方启动引导器管理主引导记录 (MBR)。

```
grub-install /dev/sda
```

##### 注意

如果系统是使用 UEFI 引导的，**grub-install** 会试图为 *x86_64-efi* 目标安装文件，但它们并未在[第 8 章](https://lfs.xry111.site/zh_CN/11.2-systemd/chapter08/chapter08.html)中安装。如果出现了这类问题，请在以上命令中添加`--target i386-pc` 选项。

#### 创建 GRUB 配置文件

生成 `/boot/grub/grub.cfg`：

```
cat > /boot/grub/grub.cfg << "EOF"
# Begin /boot/grub/grub.cfg
set default=0
set timeout=5

insmod ext2
set root=(hd0,2)

menuentry "GNU/Linux, Linux 5.19.2-lfs-11.2-systemd" {
linux /boot/vmlinuz-5.19.2-lfs-11.2-systemd root=/dev/sda2 ro
}
EOF
```

##### 注意

从 GRUB的视角来看，内核文件的位置相对于它使用的分区。如果您使用了单独的 /boot分区，需要从上面的 *linux* 行删除/boot，然后修改 *set root* 行，指向/boot 分区。

##### 注意

如果新增或移除了一些存储设备 (包括 USB 闪存盘等可移动存储设备)，则 GRUB赋予分区的编号可能发生改变。这可能导致引导失败，因为 `grub.cfg`仍然在使用“旧的”编号。如果希望避免这种问题，可以使用分区和文件系统的 UUID 指定分区，以代替GRUB 编号。运行 **lsblk -o UUID,PARTUUID,PATH,MOUNTPOINT** 以显示文件系统 (在`UUID` 列) 和分区 (在 `PARTUUID` 列) 的 UUID。之后将 `setroot=(hdx,y)` 替换为 `search --set=root--fs-uuid *`<内核所在文件系统的UUID`*` ，并将 `root=/dev/sda2` 替换为 `root=PARTUUID=*`<构建 LFS使用的分区的 UUID`*`。

注意分区的 UUID 和该分区中文件系统的 UUID 是完全不同的。一些在线资料可能建议使用 `root=UUID=*`<文件系统UUID>`*` 代替`root=PARTUUID=*`<分区UUID>`*`，但是这种方法依赖于 initramfs，而 initramfs 超出了LFS 的范畴。

`/dev` 中分区对应的设备节点名也可能发生改变 (尽管和 GRUB分区编号的变化相比较为少见)。在 `/etc/fstab` 中，也可以将`/dev/sda1` 这样的设备节点路径改为 `PARTUUID=*`<分区UUID>`*`，从而避免设备节点命名发生改变时可能导致的引导失败。

GRUB是一个很强大的程序，它提供了非常多的选项，可以支持多种设备、操作系统和分区类型，还有很多用于定制启动屏幕、声音、鼠标输入等的选项。这些选项的细节超过了本书的范围，不予讨论。

##### 小心

有一个命令 grub-mkconfig被用于自动创建配置文件。它使用 /etc/grub.d 中的脚本创建新配置文件，这会覆盖您手动编写的grub.cfg。这些脚本主要是为非源代码发行版设计的，在 LFS中不推荐使用。但是，如果您安装了商业发行版，它很可能在发行版中被运行，记得备份 grub.cfg 以防它被覆盖。



