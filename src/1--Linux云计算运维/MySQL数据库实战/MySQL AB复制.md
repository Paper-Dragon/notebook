# mysql AB复制实战

mysqldump解决了mysql数据库的备份，它只是基于某个时间点做备份，无法解决实时备份的问题，为了解决mysql实时备份的问题，mysql官方推出了mysql主从备份机制，可以让用户通过设置mysql主从来实现数据库实时备份。

1、MySQL服务器宕机怎么 单点故障

2、数据的安全

## 一、mysql AB复制

通过多台机器实现一主多从的方式来实现数据备份，主服务器负责让用户读写数据，从服务器负责同步主服务器数据，也可以承担用户读的任务。

至少两台机器

## 二、AB复制原理

![mysql_ab_原理.jpg](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603972949435.jpg)

1、用户or web 对主服务器的所有修改操作都会记录在binary log日志

成功的修改操作【增加 修改 删除】 记录的是SQL语句 主上的一个线程

2、从 有两个线程

IO线程：负责连接主mysql【AB通信 A授权账号】提取binlog中的SQL语句到relay log

SQL线程：在本地执行relay log中新增的SQL语句

注意：AB是异步

## 三、master服务器设置

**实验拓扑**

![mysql_ab拓扑图.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/29/1603972978082.png)

-  安装mysql并启动
-  关闭防火墙,selinux
-  设置时间服务器
-  修改配置文件 设置server-id=N
-  创建slave连接master的账号，用于取SQL语句

### 3.1、安装mysql并启动

a、安装mysql

```
官网下载mysql yum源，安装
安装方法：yum -y install mysql-server mysql
```

b、启动mysql

```
systemctl enable mysqld;systemctl start mysqld
```

c、修改root密码

```
mysql> alter user 'root'@'localhost' identified by '98989';
Query OK, 0 rows affected (0.01 sec)
```

### 3.2、关闭防火墙,selinux

```
[root@node1 ~]# systemctl disable firewalld
[root@node1 ~]# iptables -F
[root@node1 ~]# iptables -t nat -F
[root@node1 ~]# sed -i -r '/SELINUX=/c\SELINUX=disabled' /etc/selinux/config
[root@node1 ~]# reboot


其他机器同理
```

### 3.3、设置时间服务器

```
禁止向centos默认时间服务器同步时间
[root@node1 ~]# sed -i.bak '/^pool 2.centos.pool.ntp.org iburst$/s//#/' /etc/chrony.conf 

设置时间服务器为阿里云的
[root@node1 ~]# cat >> /etc/chrony.conf <<EOF
> server ntp1.aliyun.com
> server ntp2.aliyun.com
> server ntp3.aliyun.com
> server ntp4.aliyun.com
> EOF

重启服务生效
[root@node1 ~]# systemctl restart chronyd
查看命令，看一下时间服务器IP地址
[root@node1 ~]# chronyc sources -v
```

### 3.4、修改配置文件 设置server-id=N

server-id的数字越小，优先级越高。

```
[root@node1 ~]# echo "server-id=1"  >> /etc/my.cnf.d/mysql-server.cnf 
```

确认binlog是开启的

```
如果没有开启   log-bin=binlog
```

### 3.5、创建slave连接master的账号，用于取SQL语句

**登陆进入mysql: mysql -u root -p**

**password:**

```
mysql> create user sko identified by "98989";
Query OK, 0 rows affected (0.00 sec)

mysql> grant replication slave on *.* to sko;
Query OK, 0 rows affected (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

查看主的状态

```
mysql> show master status \G;
*************************** 1. row ***************************
             File: binlog.000002
         Position: 155
     Binlog_Do_DB: 
 Binlog_Ignore_DB: 
Executed_Gtid_Set: 
1 row in set (0.00 sec)

ERROR: 
No query specified

mysql> 
mysql> create database db1;
Query OK, 1 row affected (0.00 sec)


File: binlog.000002  当前主的binlog日志
Position: 155        当前binlog日志的SQL语句记录点
```

## 四、slave设置

**实验步骤**

-  安装mysql并启动
-  关闭防火墙、selinux
-  设置时间服务器
-  修改配置文件 设置server-id=N+x
-  设置master主信息
-  测试同步

```
- [4.1] 安装mysql并启动
- [4.2] 关闭防火墙、selinux
- [4.3] 设置时间服务器

省略......
```

### 4.3、修改配置文件 设置server-id=N+x

从服务器的server-id要比主的数字大。

```
[root@node2 ~]# echo "server-id=2"  >> /etc/my.cnf.d/mysql-server.cnf 
```

### 4.4、设置slave同步

```
mysql> stop slave;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> change master to master_host='192.168.98.201',master_user='sko',master_password='98989',master_log_file='binlog.000002';
Query OK, 0 rows affected, 3 warnings (0.01 sec)

mysql> start slave;
Query OK, 0 rows affected (0.00 sec)
```

### 4.5、验证slave

```
mysql> show slave status \G;
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.98.201
                  Master_User: sko
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: binlog.000002
          Read_Master_Log_Pos: 337
               Relay_Log_File: node2-relay-bin.000002
                Relay_Log_Pos: 545
        Relay_Master_Log_File: binlog.000002
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 337
              Relay_Log_Space: 753
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 1
                  Master_UUID: ae106b21-59c3-11ea-aa77-000c29b8d045
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 
     Last_SQL_Error_Timestamp: 
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
       Master_public_key_path: 
        Get_master_public_key: 0
            Network_Namespace: 
1 row in set (0.00 sec)

ERROR: 
No query specified
```

### 4.6、干货分享，如何解决AB不同步的问题

```
Slave_IO_Running: Yes
#该线程负责从master上拿binlog日志到relaylog，复制线程
#该线程如果是NO，如何排除
#1、查主从网络是否能通信，iptables  selinux
#2、查你的repl账号在slave上是否能连接master

Slave_SQL_Running: Yes
#该线程负责将本机relaylog中的SQL语句执行一次
#该线程为NO,如何排除
#该线程为NO说明relaylog中的SQL语句在本地无法执行
#1、查看mysql> show slave status \G; 找到不能执行的语句


mysql> show slave status \G;
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.98.201
                  Master_User: sko
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: binlog.000002
          Read_Master_Log_Pos: 515
               Relay_Log_File: node2-relay-bin.000002
                Relay_Log_Pos: 545
        Relay_Master_Log_File: binlog.000002
             Slave_IO_Running: Yes
            Slave_SQL_Running: No
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 1008
                   Last_Error: Error 'Can't drop database 'db1'; database doesn't exist' on query. Default database: 'db1'. Query: 'drop database db1'
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 337
              Relay_Log_Space: 931
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: NULL
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 1008
               Last_SQL_Error: Error 'Can't drop database 'db1'; database doesn't exist' on query. Default database: 'db1'. Query: 'drop database db1'
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 1
                  Master_UUID: ae106b21-59c3-11ea-aa77-000c29b8d045
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: 
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 
     Last_SQL_Error_Timestamp: 200227 20:36:57
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
       Master_public_key_path: 
        Get_master_public_key: 0
            Network_Namespace: 
1 row in set (0.00 sec)

ERROR: 
No query specified

#这段就能看到为何不能执行，原因是slave上没有db1数据库，所以不能删除。
 Last_SQL_Error: Error 'Can't drop database 'db1'; database doesn't exist' on query. Default database: 'db1'. Query: 'drop database db1'
 
#2、最关键的一步，如何定位错误点 
#Read_Master_Log_Pos: 515   找到目前复制的master Binlog日志的pos位置，从这个位置开始,后续在slave上做差异还原同步。
		
#拓展：如何找下一个POS位置，去看你master的当前binlog日志 
#定位错误点SQL语句的位置号
[root@node1 ~]# mysqlbinlog /var/lib/mysql/binlog.000002|egrep -B 30 "drop database db1"
.........
# at 414    错误点SQL语句的位置号
#200227 20:36:57 server id 1  end_log_pos 515 CRC32 0x683207a9 	Query	thread_id=8	exec_time=0	error_code=0	Xid = 17
SET TIMESTAMP=1582853817/*!*/;
drop database db1
..........

#定位错误点SQL语句之后一条的位置号
[root@node1 ~]# mysqlbinlog /var/lib/mysql/binlog.000002|egrep -A 30 "drop database db1"
drop database db1
/*!*/;
# at 515   发现下一条SQL语句是515
#200227 20:42:37 server id 1  end_log_pos 592 CRC32 0x2677edde 	Anonymous_GTID	last_committed=2	sequence_number=3	rbr_only=no	original_committed_timestamp=1582854157245396	immediate_commit_timestamp=1582854157245396	transaction_length=182
# original_commit_timestamp=1582854157245396 (2020-02-27 20:42:37.245396 EST)
# immediate_commit_timestamp=1582854157245396 (2020-02-27 20:42:37.245396 EST)
/*!80001 SET @@session.original_commit_timestamp=1582854157245396*//*!*/;
/*!80014 SET @@session.original_server_version=80017*//*!*/;
/*!80014 SET @@session.immediate_server_version=80017*//*!*/;
SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;

# at 592
#200227 20:42:37 server id 1  end_log_pos 697 CRC32 0x3624f753 	Query	thread_id=11	exec_time=0	error_code=0	Xid = 24
SET TIMESTAMP=1582854157/*!*/;
/*!80016 SET @@session.default_table_encryption=0*//*!*/;
create database db2
/*!*/;
....................
#发现下一条SQL语句是515


#通过上述命令可以查看pos 515之后的语句，-A 30 是指往后30行   -B 30是看往前30行，根据自己的需求设置
		
		
#3、重新设置同步指令
mysql> stop slave;
Query OK, 0 rows affected (0.01 sec)

mysql> change master to master_host='192.168.98.201',master_user='sko',master_password='98989',master_log_file='binlog.000002',master_log_pos=515;
Query OK, 0 rows affected, 2 warnings (0.01 sec)

mysql> start slave;
Query OK, 0 rows affected (0.00 sec)
```