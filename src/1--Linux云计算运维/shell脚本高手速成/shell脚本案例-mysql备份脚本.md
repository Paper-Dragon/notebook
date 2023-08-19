## 案例需求

写一个mysql binlog备份脚本，要求每天0点0分，计算机自动备份前一天的binlog日志，打包后发送给备份服务器。

## 脚本应用场景：

文件备份

## 解决问题

日常文件备份

日常数据备份

## 脚本思路

1、确定binlog的位置及备份时间间隔 每天

 当前要备份的binlog是谁

 刷新binlog日志，生成新的binlog用于存储备份节点后的数据

2、打包binlog日志 以年-月-日_binlog.tar.gz格式

3、生成校验码 md5sum

4、将校验码和压缩包存入到文件夹 文件夹命名 年-月-日 再次打包

5、使用scp拷贝到备份机器

6、备份机器解压收到的目录压缩包 通过校验码 教研binlog压缩包是否完整

 完整 完成备份 -----发邮件给管理员，明确备份成功

 不完整 报错------发邮件给管理员，要求手动备份

## 实现代码

```
#!/bin/bash
#Description: 
#Author: www.zutuanxue.com
#Created Time: 
#将mysql的binlog日志备份到备份服务器


########variables
db_user='root'
db_password=''
log='/var/log/mysql_backup.log'



###main
#获得信息
binlog_dir='/var/lib/mysql'
current_binlog=`mysql -u $db_user -e "show master status"|egrep "binlog.[[:digit:]]*"|awk '{print $1}'`

date >> $log
#准备备份
#1 刷新binlog    
mysql -u $db_user -e "flush logs"
#2 打包要备份的binlog
tar czf `date +%F`_binlog.tar.gz $binlog_dir/$current_binlog &>>$log
#3 生成校验码
md5sum `date +%F`_binlog.tar.gz > "`date +%F`_md5sum.txt"
#4 存入文件夹
[ ! -d `date +%F` ]&&mkdir `date +%F`
mv  `date +%F`_binlog.tar.gz `date +%F`
mv `date +%F`_md5sum.txt `date +%F`

# 打包目录
tar czf `date +%F`.tar.gz `date +%F` &>>$log

#5 拷贝
#要求提前做证书信任
scp `date +%F`.tar.gz root@192.168.11.241:/opt/backup &>>$log
if [ $? -ne 0 ];then
    echo "ERROR:scp `date +%F`.tar.gz fail" &>>$log
    exit 1
fi

#6 校验
ssh root@192.168.11.241 "tar xf /opt/backup/`date +%F`.tar.gz -C /opt"
#ssh root@192.168.11.241 "cd /opt/backup`date +%F`"
ssh root@192.168.11.241 "cd /opt/`date +%F`;md5sum -c `date +%F`_md5sum.txt" &>>$log
if [ $? -eq 0 ];then
   echo "success" &>>$log
   ssh root@192.168.11.241 "rm -rf /opt/`date +%F`"
else
   echo "fail" &>>$log
fi
```

## 案例思考

```
双机同步实现方式
```