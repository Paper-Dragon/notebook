## 案例需求

URL监控脚本，对某个URL进行监控，返回值为200则代表成功访问。

## 脚本应用场景：

WEB站点监控

## 解决问题

URL监控

页面监控

## 脚本思路

1、使用curl访问一次URL，并将输出保存

2、访问输出文件，获取返回值

3、判断返回值是否和初始预设的返回值相等，并对应输出

## 实现代码

```
#!/bin/bash
# 
#Author: www.zutuanxue.com
#Created Time: 
#Release: 
#Description: URL监控脚本
#监控阈值可以是: 状态码、页面字符串、页面所有内容
#本例以状态码为例

#variables
init_url_status=200
temp_file=`mktemp /tmp/check_url.XXX`

#help
if [ -z "$1" ]||[ "$1" == "--help" ];then
   echo "$0 url"
   echo "--help: 打印该帮助"
fi

#如果用户没有传参则退出
[ $# -lt 1 ]&&exit 1
#main

#1、使用curl命令访问一次URL
#1.1 判断脚本依赖命令是否存在
[ ! -x /usr/bin/curl ]&&echo "curl: not found command"&&exit 1

#1.2 访问一次URL
curl -I $1 &> $temp_file


#2、从输出中截取状态码
url_status=`grep "HTTP/1.1" $temp_file|cut -d " " -f2`

#2.1如果取值失败直接报错(测试发现当无法访问URL时会在第三步中报比较错误，所以这里取不到值就不往下走了)
[ -z "$url_status" ]&&echo -e "\033[31mstatus:NULL\033[0m"&&exit 1


#3、判断状态码是否和预设的一致
    #3.1 一致  输出绿色字体 "status:200"
    #3.2 不一致 输出红色字体 "status:XXX"

if [ $init_url_status -eq $url_status ];then
    echo -e "\033[32mstatus:$url_status\033[0m"
else
    echo -e "\033[31mstatus:$url_status\033[0m"
fi

#4、删除临时文件
rm -f $temp_file
```

## 案例思考

```
页面监控方法(监控页面字符串或全页内容)
```