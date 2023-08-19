## 压缩工具的介绍

说到文件管理，就不得不说到tar，因为tar可以压缩和解压缩linux文件，所以要先了解一下压缩和解压缩。

由于以前的计算机磁盘容量比较小，业内人士绞尽脑汁，终于开发出了一个能帮助用户节省磁盘的工具，就是压缩工具，我们知道计算机在存储数据的时候都是使用bytes来计算的，但是实际上1byte=8bits，在日常使用中并不是所有的数据都能把这个1byte用完，有的可能用了三个bits，有的可能用了四个bits，而他们的实际占用空间是2bytes=16bits，剩余的空间就浪费了，压缩工具就是通过算法，将占用三个bits的数据和占用四个bits的数据放在一个byte里，这样我们就能节省出来1byte，这种空间的节省，当你在压缩一个包含了很多文本文件的目录时是非常明显的。其实就像没有人知道早高峰的公交车里有多少人一样，一个人理论上占用的公交车内的空间，跟实际占用的空间，往往有很大差别，因为挤挤总能上去的。

压缩工具诞生的初衷和原理我们说完了，那现在它就没用了么？依然有用，只不过现在我们使用压缩工具的目的，更多的是便于存储和传输，在linux系统中压缩工具有很多，不同的工具压缩后的后缀名和大小都有差异，从远古时代说起，linux都出现了以下这些格式的压缩文件

*.Z 使用compress压缩的文件

*.zip 使用zip压缩的文件

*.gz 使用gzip压缩

*.bz2 使用bzip2压缩

*.xz 使用xz压缩

*.tar 使用tar工具打包，没有压缩

*.tar.gz 使用tar工具打包，经过gzip压缩

*.tar.bz2 使用tar工具打包，经过bzip2压缩

*.tar.xz 使用tar工具打包，经过xz压缩

其中，compress已经过时了，因为太老，个别版本的linux已经不支持了，linux下的压缩工具还是以gzip和bzip2以及后加入的xz作为主力，但是由于这些工具，最早不能压缩目录，只能针对单一文件进行压缩，所以在日常使用中，他们都是配合着tar这个打包工具，由tar把目录中的很多文件打包成一个文件，再经由对应的工具进行压缩，所以我们会看上面的那些tar.*的压缩包。好了我们先来学习下这些压缩工具如何使用

```
压缩文件的好处有如下几点：

- 文件更小，便于网络传输，效率高；
- 避免杂乱，可以减少文件个数，多个文件一起压缩；
- 有些文件不能直接传输，比如安装程序，压缩后就可以传输了
```

### 压缩工具的使用

- gzip

```
[root@zutuanxue ~]# gzip -h
Usage: gzip [OPTION]... [FILE]...
  -c	保留源文件	
  -d	解压缩
  -h	显示帮助
  -t	检查压缩文件的数据一致性，用来确定压缩文件是否有错误
  -v	显示压缩包的相关信息，包括压缩比等
  -V	显示版本号
  -1	压缩最快，压缩比低
  -9	压缩最慢，压缩比高
例子：
[root@zutuanxue test]# pwd
/root/test
[root@zutuanxue test]# cp /etc/services ./
[root@zutuanxue test]# gzip -v services 
services:	 79.4% -- replaced with services.gz
[root@zutuanxue test]# ll /etc/services services.gz 
-rw-r--r--. 1 root root 692241 Sep 10  2018 /etc/services
-rw-r--r--  1 root root 142549 Oct 20 23:32 services.gz
[root@zutuanxue test]# zcat services.gz 
由于service文件本来就是一个文本文档，所以还可以使用zmore，zless去查看内容
[root@zutuanxue test]# ls
services.gz
[root@zutuanxue test]# gzip -d services.gz 
[root@zutuanxue test]# ls
services
我们可以看到，gzip这个工具压缩文件和源文件默认只保留一个，所以还可以
[root@zutuanxue test]# gzip -1 -c services > test.gz
[root@zutuanxue test]# ls
services  test.gz
[root@zutuanxue test]# zgrep -n ssh test.gz 
44:ssh             22/tcp                          # The Secure Shell (SSH) Protocol
45:ssh             22/udp                          # The Secure Shell (SSH) Protocol
你也可以使用zgrep找出指定的关键字在压缩文件的那几行
```

- bzip2

```
[root@zutuanxue test]# bzip2 -h
   -h		帮助
   -d		解压
   -z 		压缩 默认值
   -k		保留源文件
   -v		查看版本信息
   -1 ..-9   同gzip相同
   bzip2的使用与gzip相同，两种工具的区别就是压缩算法不同，bzip2的压缩比更好一些，bzip的包查看的时候使用的是bzcat,bzmore,bzless,bzgrep同gzip用法相同
[root@zutuanxue test]# gzip -c services > services.gz
[root@zutuanxue test]# bzip2 -k services
[root@zutuanxue test]# ll
总用量 948
-rw-r--r-- 1 root root 692241 10月 21 01:31 services
-rw-r--r-- 1 root root 129788 10月 21 01:31 services.bz2
-rw-r--r-- 1 root root 142549 10月 21 01:32 services.gz
```

- xz
	虽然bzip2的压缩效果相对比gzip已经提升很多，但是技术是永无止境的，于是出现了xz，它的用法跟gzip和bzip2一样

```
[root@zutuanxue test]# xz -h
  -d				解压缩
  -t				检查压缩文件的完整性
  -l				查看压缩文件的相关信息
  -k				保留源文件
  -c				将信息输出到显示器上
  -0 ... -9			指定压缩级别
  -h				显示帮助
[root@zutuanxue test]# xz -k services
[root@zutuanxue test]# ll
总用量 1052
-rw-r--r-- 1 root root 692241 10月 21 01:31 services
-rw-r--r-- 1 root root 129788 10月 21 01:31 services.bz2
-rw-r--r-- 1 root root 142549 10月 21 01:32 services.gz
-rw-r--r-- 1 root root 105872 10月 21 01:31 services.xz
可以看到，在使用默认压缩比压缩的情况下，xz压缩完的文件体积更小
[root@zutuanxue test]# xz -l services.xz		查看相关信息
Strms  Blocks   Compressed Uncompressed  Ratio  Check   Filename
    1       1    103.4 KiB    676.0 KiB  0.153  CRC64   services.xz
[root@zutuanxue test]# xzcat services.xz		查看文件内容
[root@zutuanxue test]# xz -d services.xz		解压缩

虽然xz的压缩算法更好，但是相对来说时间也比较长
[root@zutuanxue test]# time gzip -c services > services.gz
real	0m0.023s
user	0m0.020s
sys	0m0.003s
[root@zutuanxue test]# time bzip2 -k services
real	0m0.047s
user	0m0.043s
sys	0m0.003s
[root@zutuanxue test]# time xz -k services
real	0m0.264s
user	0m0.258s
sys	0m0.003s
我们可以使用time这个命令去对比一下时间gzip，bzip2，xz的时间分别是0.023,0.047,0.264，可以看到xz所使用的时间是比较长的，而这个时间会跟文件体积成正比，所以这三种压缩方式大家在使用的时候也要把时间成本考虑在内，除非你很富有。
```

- tar
	前面我们提到了，大多数压缩工具只能针对单一文件进行操作，如果你要压缩目录的话就会很麻烦，这时候我们可以使用tar这个打包工具，将目录内的多个文件打包成一个文件，再进行压缩。

```
[root@zutuanxue test]# tar --help
用法: tar [选项...] [FILE]...
  -C		解压到指定目录
  -c		建立tar包
  -t		查看tar包内的文件
  -x		解压tar包
  -p		不修改文件属性
  -f		指定文件名称
  -j		使用bzip2算法
  -J		使用xz算法
  -z		使用gzip算法
  -P		允许压缩路径中包含有"/"
  -v		显示详细信息
  -?, --help 查看帮助
  --exclude	压缩过程中排除指定的文件
例：
压缩
[root@zutuanxue test]# tar -czf etc.tar.gz etc
[root@zutuanxue test]# ls
etc  etc.tar.gz
解压缩
[root@zutuanxue test]# ls
etc.tar.gz
[root@zutuanxue test]# tar -xf etc.tar.gz 
[root@zutuanxue test]# ls
etc  etc.tar.gz
查看压缩包内容
[root@zutuanxue test]# tar -tf etc.tar.gz
etc/
etc/libreport/
etc/libreport/workflows.d/
etc/libreport/workflows.d/report_uploader.conf
etc/libreport/workflows.d/anaconda_event.conf
.
.
.
查询压缩包里面的文件信息
[root@zutuanxue test]# tar -tvf etc.tar.gz |more
drwxr-xr-x root/root         0 2019-10-21 04:35 etc/
drwxr-xr-x root/root         0 2019-10-21 04:35 etc/libreport/
drwxr-xr-x root/root         0 2019-10-21 04:35 etc/libreport/workflows.d/
.
.
.
解压压缩包指定的文件
[root@zutuanxue test]# tar -tvf etc.tar.gz | grep shadow
---------- root/root       792 2019-10-21 04:35 etc/gshadow
---------- root/root      1506 2019-10-21 04:35 etc/shadow
---------- root/root       781 2019-10-21 04:35 etc/gshadow-
---------- root/root      1374 2019-10-21 04:35 etc/shadow-
-rw-r--r-- root/root       214 2019-10-21 04:35 etc/pam.d/sssd-shadowutils
[root@zutuanxue test]# tar -xf etc.tar.gz etc/shadow
[root@zutuanxue test]# ls
etc  etc.tar.gz
[root@zutuanxue test]# ls etc
shadow
```