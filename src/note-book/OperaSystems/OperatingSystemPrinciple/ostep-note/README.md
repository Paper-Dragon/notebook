操作系统相关 Operating Systems: Three Easy Pieces 学习笔记
===



作者地址  https://github.com/koihuang/ostep-note

Operating Systems: Three Easy Pieces这本书从 虚拟化(virtualization), 并发(concurrency), 持久化(persistent) 三方面对操作系统在抽象层面上做了很好的分析介绍.
此书能让读者对操作系统有一个综合的感性认识,特别是在抽象层面上,关键还免费,免费,免费!!!. 
感兴趣的读者可以读一下 http://pages.cs.wisc.edu/~remzi/OSTEP/

作为学习巩固,分享一下自己的学习笔记,有兴趣的也可以看一下.(蓝色有链接的为已经写好的笔记,后面逐步更新中,有些不重要的选择性跳过)

| intro           | virtualization          |                                  | concurrency                | persistence                         | appendices       |
| --------------- | ----------------------- | -------------------------------- | -------------------------- | ----------------------------------- | ---------------- |
| Preface| 3 Dialogue | 12 Dialogue | 25 Dialogue | 35 Dialogue| Dialogue | 
| TOC | 4 [Processes](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/4 Processes.md) | 13 [Address Spaces](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/13 Address Spaces.md) | 26 [Concurrency and Threads](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/26 Concurrency and Threads.md) | 36 [I/O Devices](https://github.com/koihuang/ostep-note/blob/master/3  persistent/36 IO Devices.md) | Virtual Machines | 
| 1 Dialogue | 5 [Process API](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/5 Process API.md) | 14 [Memory API](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/14 Memory API.md) | 27 [Thread API](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/27 Thread API.md)| 37 [Hard Disk Drives](https://github.com/koihuang/ostep-note/blob/master/3  persistent/37 Hard Disk Drives.md) | Dialogue | 
| 2 Introduction | 6 [Direct Execution](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/6 Direct Execution.md) | 15 [Address Translation](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/15 Address Translation.md) | 28 [Locks](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/28 Locks.md) | 38 Redundant Disk Arrays (RAID) | Monitors | 
|  | 7 [CPU Scheduling](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/7 CPU Scheduling.md) | 16 [Segmentation](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/16 Segmentation.md) | 29 [Locked Data Structures](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/29 Locked Data Structures.md) | 39 [Files and Directories](https://github.com/koihuang/ostep-note/blob/master/3  persistent/39 Files and Directories.md) | Dialogue | 
|  | 8 [Multi-level Feedback](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/8 Multi-level Feedback.md) | 17 [Free Space Management](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/17 Free Space Management.md) | 30 [Condition Variables](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/30 Condition Variables.md)| 40 [File System Implementation](https://github.com/koihuang/ostep-note/blob/master/3  persistent/40 File System Implementation.md) | Lab Tutorial | 
|  | 9 Lottery Scheduling | 18 [Introduction to Paging](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/18 Introduction to Paging.md)| 31 [Semaphores](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/31 Semaphores.md)| 41 Fast File System (FFS) | Systems Labs | 
|  | 10 [Multi-CPU Scheduling](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/10 Multi-CPU Scheduling.md) | 19 [Translation Lookaside Buffers](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/19 Translation Lookaside Buffers.md) | 32 [Concurrency Bugs](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/32 Concurrency Bugs.md) | 42 FSCK and Journaling | xv6 Labs | 
|  | 11 Summary | 20 [Advanced Page Tables](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/20 Advanced Page Tables.md)| 33 [Event-based Concurrency](https://github.com/koihuang/ostep-note/blob/master/2  concurrency/33 Event-based Concurrency.md)| 43 Log-Structured File System (LFS) |  | 
|  |  | 21 [Swapping: Mechanisms](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/21 Swapping Mechanisms.md) | 34 Summary | 44 Data Integrity and Protection|  | 
|  |  | 22 [Swapping: Policies](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/22 Swapping Policies.md) |  | 45 Summary|  | 
|  |  | 23 [Complete VM Systems](https://github.com/koihuang/ostep-note/blob/master/1 virtualization/23 Complete VM Systems.md) |  | 46 Dialogue |  |
|  |  | 24 Summary |  | 47 Distributed Systems|  | 
|  |  |  |  | 48 Network File System (NFS)|  | 
|  |  |  |  | 49 Andrew File System (AFS)|  | 
|  |  |  |  | 50 Summary |  | 