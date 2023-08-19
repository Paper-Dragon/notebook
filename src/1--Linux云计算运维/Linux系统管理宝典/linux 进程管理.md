## 一、进程介绍

在说进程如何管理之前我们要涉及到进程的一些相关概念

**什么是进程**？进程（Process）是一个程序在其自身的虚拟地址空间中的一次执行活动。之所以要创建进程，就是为了使多个程序可以并发的执行，从而提高系统的资源利用率和吞吐量。简单来说进程就是一个程序的执行活动。

**进程和程序有什么不同？**

程序：只是一个静态的指令集合；而进程是一个程序的动态执行过程，它具有生命期，是动态的产生和消亡的。

进程：是资源申请、调度和独立运行的单位，因此，它使用系统中的运行资源；而程序不能申请系统资源、不能被系统调度、也不能作为独立运行的单位，因此，它不占用系统的运行资源。

程序和进程无一一对应的关系。一方面一个程序可以由多个进程所共用，即一个程序在运行过程中可以产生多个进程；另一方面，一个进程在生命期内可以顺序的执行若干个程序。

**进程的属性**

 在Linux系统中总是有很多进程同时在运行，每一个进程都有一个识别号，叫做PID（Process ID），用以区分不同的进程。

除了进程识别号外，每个进程还有另外四个识别号。它们是实际用户识别号（real user ID）、实际组识别号以及有效用户识别号（effect user ID），和有效组识别号（effect group ID）。实际用户识别号和实际组识别号的作用是识别正在运行此进程的用户和组。一个进程的实际用户识别号和实际组识别号就是运行此进程的用户的识别号（UID）和组的识别号（GID）。有效用户识别号和有效组识别号的作用是确定一个进程对其访问的文件的权限和优先权。一般有效用户识别号和有效组识别号和实际用户识别号及实际组识别号相同。除非程序被设置了SUID位或SGID位。

**进程间的父子关系**

进程之间是有关联性的，有的进程会衍生出额外的进程，这时，这组进程之间就存在了父子关系，衍生出来的进程叫子进程，而原本的进程叫做父进程。

## 二、linux的工作调度

由于linux是一个多人多任务的操作系统，所以用户在使用linux的时候就会出现有些工作我们需要盯着完成的进度，而有些工作我们直接放在后台执行就可以了，这里面我们就涉及到任务的前后台执行的问题，那么，如何将一个任务放到后台去执行呢？

#### 开启一个在后台执行的工作

```
[root@zutuanxue ~]# cd /
[root@zutuanxue /]# tar -czf /tmp/test.tar.gz etc &	（&表示后台执行）
[1] 13568				[1]工作序号；13568进程号（PID）
[root@zutuanxue /]# ls tmp/ | grep test
test.tar.gz

执行完成后，会在下次敲回车的时候给用户一个反馈
[1]+  已完成               tar -czpf /tmp/test.tar.gz etc
```

#### 将当前的工作调到后台

```
[root@zutuanxue /]# cd
[root@zutuanxue ~]# ls
公共  视频  文档  音乐  anaconda-ks.cfg
模板  图片  下载  桌面  initial-setup-ks.cfg
[root@zutuanxue ~]# vim anaconda-ks.cfg 		按键盘上的ctrl+z是调到后台

[1]+  已停止               vim anaconda-ks.cfg		
注意由ctrl+z调到后台的工作状态为暂停
```

那么如何将后台工作的状态更改为运行？如何查看后台有哪些工作呢？

#### 后台工作的查看及状态的更改

```
[root@zutuanxue ~]# jobs					查看后台工作
[1]-  已停止               vim anaconda-ks.cfg
[2]+  已停止               find / -print
[root@zutuanxue ~]# jobs -l				查看后台工作，并显示进程号
[1]- 13663 停止                  vim anaconda-ks.cfg
[2]+ 13732 停止                  find / -print
[root@zutuanxue ~]# jobs -s				仅查看状态为停止的后台工作
[1]-  已停止               vim anaconda-ks.cfg
[2]+  已停止               find / -print
[root@zutuanxue ~]# jobs -r				仅查看状态为运行的后台工作

+：	当使用命令将后台任务调到前台时，默认调用有此标记的任务，也就是最近被调到后台的
-：	倒数第二个被调到后台的任务


[root@zutuanxue ~]# fg %工作序号(%可省略)	将后台指定的工作调到前台
[root@zutuanxue ~]# find / -name \*a\* > /tmp/test.txt
^Z		执行一个命令，迅速使用ctrl+z将任务调到后台
[2]+  已停止               find / -name \*a\* > /tmp/test.txt
[root@zutuanxue ~]# bg %2;jobs 连续执行两条命令，1.使用bg命令将之前的工作状态更改为运行；2.立即使用jobs命令查看状态
[2]+ find / -name \*a\* > /tmp/test.txt &
[1]+  已停止               vim anaconda-ks.cfg
[2]-  运行中               find / -name \*a\* > /tmp/test.txt &

注意：更改后台工作状态和查看后台工作状态的命令也可以在终端分别输入，但是如果命令执行的较快的话可能会出现下面的这种情况，也就是状态显示为已完成
[root@zutuanxue ~]# find / -name \*a\* > /tmp/test.txt
^Z
[2]+  已停止               find / -name \*a\* > /tmp/test.txt
[root@zutuanxue ~]# jobs
[1]-  已停止               vim anaconda-ks.cfg
[2]+  已停止               find / -name \*a\* > /tmp/test.txt
[root@zutuanxue ~]# bg %2
[2]+ find / -name \*a\* > /tmp/test.txt &
[root@zutuanxue ~]# jobs
[1]+  已停止               vim anaconda-ks.cfg
[2]-  已完成               find / -name \*a\* > /tmp/test.txt
```

#### 管理后台工作

我们可以通过kill命令配合适当的信号来管理后台的工作，信号是进程间通信的最原始机制，不同的信号，有不同的作用，比如说，一个进程接收到了一个让它打开指定文件的信号，那这个进程就去打开这个文件，而不会去考虑原因

```
[root@zutuanxue ~]# kill %工作序号
		-l				查看
		-1				重新加载，systemctl reload servername
		-2				保存数据并结束	ctrl+c			
		-9				强制结束不管其状态		常用在无法正常终止的程序上
		-15				正常结束(默认值)		systemctl stop servername
[root@zutuanxue ~]# jobs
[1]+  已停止               vim anaconda-ks.cfg
[root@zutuanxue ~]# kill -9 %1
[1]+  已停止               vim anaconda-ks.cfg
[root@zutuanxue ~]# jobs
[1]+  已杀死               vim anaconda-ks.cfg
[root@zutuanxue ~]# jobs
```

## 三、进程的查看与管理

在linux中，我们可以通过fg、bg、jobs、kill等来对工作进行管理和调度，这些工作都是我们手动执行的，而那些由系统开启的工作该如何管理呢？管理这些后台工作我们可以使用两种命令ps和top

```
[root@zutuanxue ~]# ps	  #静态进程管理命令,可以帮助我们查看到ps命令在执行那一刻后台进程的状态
-A			所有进程，等同于-ax
-a			显示所有进程（与终端有关的除外）
-x			与参数a一起使用等同于-A
-u			显示指定用户的进程
-l			长格式
-f			完整输出
-t			从指定终端启动的进程
-C			执行指定命令的进程
[root@zutuanxue ~]# ps aux		#查看系统后台的所有进程
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.1 252828 11580 ?        Ss   10月23   0:04 /us...
root          2  0.0  0.0      0     0 ?        S    10月23   0:00 [kthreadd]
root          3  0.0  0.0      0     0 ?        I<   10月23   0:00 [rcu_gp]
root          4  0.0  0.0      0     0 ?        I<   10月23   0:00 [rcu_par_gp]
root          6  0.0  0.0      0     0 ?        I<   10月23   0:00 [kworker/0:0H-kblockd]
root          8  0.0  0.0      0     0 ?        I<   10月23   0:00 [mm_percpu_wq]
root          9  0.0  0.0      0     0 ?        S    10月23   0:00 [ksoftirqd/0]


USER			开启进程的用户
PID				进程的识别号
%CPU			进程的cpu占用率
%MEM			进程的物理内存占用率
VSZ				虚拟内存用量，单位Kbytes
RSS				物理内存占用量	Kbytes
TTY				那个终端开启的
STAT			进程的状态
START			开启时间
TIME			CPU占用时间
COMMAND			执行具体内容

[root@zutuanxue ~]# ps -l		查看当前用户开启的进程
F S  UID    PID  PPID  C PRI  NI ADDR SZ WCHAN  	TTY    TIME 	CMD
0 S   0   5191   5189  0  80   0 	-  6994 -      pts/1 00:00:02 bash
0 R   0  14972   5191  0  80   0 	- 11240 -      pts/1 00:00:00 ps

F	进程标识	4=权限为root		1=从父进程派生出来但是没有执行	5=1+4		0=没有被设置
S	进程状态	R=运行	S=睡眠，可被唤醒	D=睡眠，不可被唤醒（资源不足引起）T=停止
				 	 Z=僵尸进程
UID	用户识别号
PID	进程识别号
PPID	父进程号
C			cpu使用率 %
PRI		内核调度优先级
NI		用户设置优先级
ADDR	加载到内存的位置，如果是运行的会用-表示
SZ		用掉的内存页的大小，1个内存页=4096Bytes 也就是6994x4=27976K内存
WCHAN	当前进程在哪个内核函数上睡眠，-表示正在运行，没有睡眠
TTY		由哪个终端开启的	pts/n=图形界面或远程		ttyn=字符界面		?=系统进程
TIME	用掉的CPU时间
CMD		执行的命令
```

ps只能显示它运行的那一刻的进程的统计信息，如果你想动态的查看就需要使用top

top动态查看

```
[root@zutuanxue ~]# top
-d			指定两次刷新的时间间隔,默认是3秒
-p			后面跟进程号，查看指定进程的状态,最多20个PID
-n			刷新指定次数后退出
-b			批量模式，可以让top将内容输出到指定的位置
top的按键
?				显示帮助
空格&enter			   刷新
E				切换统计信息部分，内存显示的单位
e				切换任务列表的内存显示的单位
l				显示或隐藏摘要信息中的负载统计(第一行内容)
t				切换显示或隐藏摘要信息中任务和CPU统计信息(第2，3行内容)
m				切换显示或隐藏摘要信息中内存统计(第4，5行内容)
u				查看指定用户的进程
M				根据内存排序
P				根据cpu排序
N				根据PID排序
R				反向排序
F/f			调整任务列表显示的内容，默认只有PID，USER，PR，NI....COMMAND等这些，可				以自定义还需要显示哪些内容，如果显示的列比较多可以使用</>进行左右移动
shift+</>按照下一列的内容排序，比如说当前按照PID排序如果按下shift+>，则按照用户名					排序，再次按下就会按照PR排序，一次类推 
T				根据cpu使用时间排序
k				杀死进程
r				修改进程的nice值（优先级）
z				将不同的位置标记颜色
x				高亮显示排序字段
y				高亮显示正在运行的任务
b				将高亮显示部分加上背景色
Z				自定义颜色
L				搜索指定字段，&下一个
H				在进程和线程间切换显示和统计方式，默认为进程
V				树形显示统计信息
J				显示内容左对齐或右对齐
c				切换COMMAND列的显示形式，程序名/命令格式
i				显示或隐藏空闲进程
u/U			查看指定用户的进程
d				设置刷新间隔,默认3秒刷新一次
W				将当前的设置写入到~/.config/procps/toprc中
q				退出top
[root@zutuanxue ~]# top -d 1
1 top - 18:57:05 up 12:56,  3 users,  load average: 0.00, 0.00, 0.00
2 Tasks: 280 total,   1 running, 279 sleeping,   0 stopped,   0 zombie
3 %Cpu(s): 1.5 us,1.5 sy,0.0 ni,97.0 id,0.0 wa,0.0 hi,0.0 si,0.0 st
4 MiB Mem : 3918.6 total, 160.1 free, 1264.5 used, 2494.0 buff/cache
5 MiB Swap: 2048.0 total, 2048.0 free, 0.0 used. 2356.6 avail Mem 
6
7PID USER  PR  NI VIRT    RES    SHR  S  %CPU  %MEM   TIME+  COMMAND  
 1   root  20  0  244408  13740  9100 S  0.0   0.3   0:08.77 systemd
 2   root  20  0  0       0      0    S  0.0   0.0   0:00.04 kthreadd  3   root  0  -20 0       0      0    I  0.0   0.0   0:00.00 rcu_gp    4   root  0  -20 0       0      0    I  0.0   0.0   0:00.00 cu_par_gp 

1-6行显示的内容为
1	当前时间为18：57：05；系统一共开机12小时56分；当前有3个用户登录；系统在1，5，15分钟的平均负载，越小表示系统越空闲

2	系统中进程的统计信息 总计280个，1个运行，279睡眠，0个停止，0个僵尸

3	cpu的负载	按键盘上的“1”可以按照CPU核心数显示
			us: 用户空间进程占用CPU时间百分比
			sy:	内核进程占用CPU时间百分比
			ni:	用户空间内改变过优先级的进程占用CPU时间百分比
			id:	空闲CPU时间百分比(100%表示系统完全空闲)
			wa: I/O等待占用的CPU时间百分比
			hi: 硬件中断占用CPU时间百分比
			si:	软件中断占用CPU时间百分比
			st:	虚拟化hypervisor从当前虚拟机偷走的时间（如果这个值很高的话,说明你的提					供商的CPU资源有限,而你没能抢过别人,很有可能就是VPS提供商超售了.）
4&5	物理内存和虚拟内存相关的统计信息，尤其要注意swap，如果被大量占用，说明你物理内			存不足了
6	在top中输入命令时，会显示在这里
7	系统进程的信息
	PID:	进程ID 
	USER  	进程所有者
	PR  	进程优先级
	NI 	nice值，负数表示高优先级，正数表示低优先级
	VIRT    虚拟内存使用量，单位为KB。
	RES    进程使用的、未被换出的物理内存大小，单位为KB。
	SHR  	进程使用共享内存大小，单位为KB。
	S  	进程状态
	%CPU  	进程对CPU的使用率。
	%MEM   进程对内存的使用率
	TIME+  进程使用CPU时间总结，单位秒。
	COMMAND	命令
		
top显示的内容有些看不到怎么办？
[root@zutuanxue ~]# top -b -n1 > /tmp/top.txt
有些时候想查看的进程资源占用很低，在top中显示的比较靠后，怎么办？
[root@zutuanxue ~]# top -d 2 -p 3562
Tasks:   1 total,   0 running,   1 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.2 us,  3.9 sy,  0.0 ni, 93.3 id,  0.0 wa,  0.5 hi,  0.1 si,  0.0 st
MiB Mem : 3918.6 total, 1495.1 free, 1407.0 used, 1016.5 buff/cache
MiB Swap: 2048.0 total, 2048.0 free, 0.0 used.   2258.4 avail Mem 

PID USER   PR  NI   VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND  
3562 root  20   0   49296   6380   4448 S   0.0   0.2   0:00.08 bash
```

上面所提到的两个查看系统进程的命令，静态的ps和动态的top，他们所显示的内容比较多，有的时候我只想查看一下进程之间的关系，这个时候我可以使用另外的一条命令

```
[root@zutuanxue ~]# pstree
	A				进程之间使用ASCII字符连接
	U				进程之间使用UTF-8编码连接
	p				显示进程号
	u				显示用户
[root@zutuanxue ~]# pstree -A | more
systemd-+-ModemManager---2*[{ModemManager}]
        |-NetworkManager---2*[{NetworkManager}]
        |-VGAuthService
        |-accounts-daemon---2*[{accounts-daemon}]
        |-alsactl
        |-atd
        |-auditd-+-sedispatch
        |        `-2*[{auditd}]
[root@zutuanxue ~]# pstree -U | more
systemd─┬─ModemManager───2*[{ModemManager}]
        ├─NetworkManager───2*[{NetworkManager}]
        ├─VGAuthService
        ├─accounts-daemon───2*[{accounts-daemon}]
        ├─alsactl
        ├─atd
        ├─auditd─┬─sedispatch
        │        └─2*[{auditd}]
[root@zutuanxue ~]# pstree -pu | more
systemd(1)-+-ModemManager(916)-+-{ModemManager}(943)
           |                   `-{ModemManager}(949)
           |-NetworkManager(1040)-+-{NetworkManager}(1050)
           |                      `-{NetworkManager}(1053)
           |-VGAuthService(902)
           |-accounts-daemon(1010)-+-{accounts-daemon}(1013)
           |                       `-{accounts-daemon}(1015)
           |-alsactl(909)
           |-atd(1076)
           |-auditd(862)-+-sedispatch(864)
           |             |-{auditd}(863)
           |             `-{auditd}(865)
           |-avahi-daemon(910,avahi)---avahi-daemon(953)
```

我们现在可以通过三种方法来查看后台的进程，那么后台的进程该如何管理呢？管理后台的进程，除了我们前面提到的kill命令之外还可以使用killall

```
[root@zutuanxue ~]# kill PID
需要注意的是，kill后面如果加的是%num代表杀死后台指定序号的工作，如果不加%代表的是杀死指定进程号的进程，这两个是有区别的
[root@zutuanxue ~]# killall
	e		精确匹配，最多不能超过15个字符
	i		询问用户是否杀死指定名称的进程
	I		进程的名称忽略大小写
[root@zutuanxue ~]# cat /dev/zero > /dev/null &
[1] 102245
[root@zutuanxue ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S     0   3562   3559  0  80   0 - 12324 -      pts/1    00:00:00 bash
0 R     0 102245   3562 97  80   0 -  1908 -      pts/1    00:00:01 cat
0 R     0 102246   3562  0  80   0 - 11240 -      pts/1    00:00:00 ps
[root@zutuanxue ~]# killall -ei cat
杀死 cat(102870) ? (y/N) y
[1]+  已终止               cat /dev/zero > /dev/null
```

## 四、进程的优先级

之前我们在查看进程的时候看到两个东西，一个是PRI一个是NI，这两个东西是用来控制进程的优先级，而优先级又决定了CPU先处理谁的数据，后处理谁的数据。一起来看下如何调整进程的优先级

```
[root@zutuanxue ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY     TIME 		CMD
0 S     0   3562   3559  0  80   0 - 12522 -      pts/1  00:00:00 bash
0 R     0  85520   3562  0  80   0 - 11240 -      pts/1  00:00:00 ps
```

linux当中的每一个程序都有一个优先级，也就是PRI，这个数值越小则代表优先级越高，而PRI这个值是由内核控制的，用户无法更改，用户如果想调整程序的优先级就只能调整NI的值，所以linux中优先级的算法就是 新的优先级=旧的优先级+NI的值，比如说我bash那个进程，PRI是80，并且假定内核不会动态调整这个值，如果我将NI值更改为-10的话，那么新的PRI的值就是70，数值变小，意味着这个进程的优先级提高了。但是如果内核在这个过程中动态调整了，最终的值就不确定了。

这个NI的值都可以设置成多少呢？

root用户：-20~19

普通用户：0~19

```
[root@zutuanxue ~]# nice 	指定新执行的进程的优先级
	-n 	指定优先级
[root@zutuanxue ~]# vim 1&
[1] 108831
[root@zutuanxue ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY    TIME 		CMD
0 S     0   3562   3559  0  80   0 - 12522 -      pts/1  00:00:00 bash
0 T     0 108831   3562  0  80   0 -  9058 -      pts/1  00:00:00 vim
0 R     0 108832   3562  0  80   0 - 11240 -      pts/1  00:00:00 ps

[1]+  已停止               vim 1
[root@zutuanxue ~]# nice -n 10 vim 2&
[2] 109328
[root@zutuanxue ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY    TIME 		CMD
0 S     0   3562   3559  0  80   0 - 12522 -      pts/1  00:00:00 bash
0 T     0 108831   3562  0  80   0 -  9058 -      pts/1  00:00:00 vim
0 T     0 109328   3562  0  90  10 -  9058 -      pts/1  00:00:00 vim
0 R     0 109396   3562  0  80   0 - 11240 -      pts/1  00:00:00 ps

[2]+  已停止               nice -n 10 vim 2
[root@zutuanxue ~]# nice -n -20 vim 3 &
[3] 109470
[root@zutuanxue ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY    TIME 		CMD
0 S     0   3562   3559  0  80   0 - 12522 -      pts/1  00:00:00 bash
0 T     0 108831   3562  0  80   0 -  9058 -      pts/1  00:00:00 vim
0 T     0 109328   3562  0  90  10 -  9058 -      pts/1  00:00:00 vim
4 T     0 109470   3562  0  60 -20 -  9058 -      pts/1  00:00:00 vim
0 R     0 109471   3562  0  80   0 - 11240 -      pts/1  00:00:00 ps

[3]+  已停止               nice -n -20 vim 3

那如何调整一个已经启动的进程的优先级呢？
[root@zutuanxue ~]# vim 1 &
[1] 115098
[root@zutuanxue ~]# vim 2 &
[2] 115099

[1]+  已停止               vim 1
[root@zutuanxue ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S     0   3562   3559  0  80   0 - 12522 -      pts/1    00:00:00 bash
0 T     0 115098   3562  0  80   0 -  9058 -      pts/1    00:00:00 vim
0 T     0 115099   3562  0  80   0 -  9058 -      pts/1    00:00:00 vim
0 R     0 115100   3562  0  80   0 - 11240 -      pts/1    00:00:00 ps

[2]+  已停止               vim 2
[root@zutuanxue ~]# renice 10 115098
115098 (process ID) 旧优先级为 0，新优先级为 10
[root@zutuanxue ~]# renice -10 115099
115099 (process ID) 旧优先级为 0，新优先级为 -10
[root@zutuanxue ~]# ps -l
F S   UID    PID   PPID  C PRI  NI ADDR SZ WCHAN  TTY    TIME 		CMD
0 S     0   3562   3559  0  80   0 - 12522 -      pts/1  00:00:00 bash
0 T     0 115098   3562  0  90  10 -  9058 -      pts/1  00:00:00 vim
0 T     0 115099   3562  0  70 -10 -  9058 -      pts/1  00:00:00 vim
0 R     0 115736   3562  0  80   0 - 11240 -      pts/1  00:00:00 ps 
```