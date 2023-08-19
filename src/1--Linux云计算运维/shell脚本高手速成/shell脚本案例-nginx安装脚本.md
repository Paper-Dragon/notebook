## 案例需求

通过shell脚本安装nginx

## 应用场景

web服务器业务初始化

## 案例思路

1、软件获得
2、源码安装

## 案例代码

```
#!/bin/bash
#Description: nginx install script from zutuanxue(http://www.zutuanxue.com)
#Release: 1.0
#Auther: www.zutuanxue.com
#Email: 
#OS: Centos 8.X

cat <<EOF
#Description: nginx install script from zutuanxue(http://www.zutuanxue.com)
#Release: 1.0
#Auther: www.zutuanxue.com
#Email: 
#OS: Centos 8.X
EOF


#nginx源码包下载路径
nginx_pkg_url=http://nginx.org/download/nginx-1.17.8.tar.gz

#nginx安装路径,安装路径为$nginx_install_doc/nginx
nginx_install_doc=/usr/local

#nginx服务管理用户
nginx_manage_user=www

#统计本机CPU核数
cpu_count=`grep -c "flags" /proc/cpuinfo`

check ()  {

#安装nginx需要管理员权限	
[ $UID -ne 0 ] && echo "need to be root so that" && exit 1

#安装前的依赖包解决
#wget 命令
#gcc  编译命令
#pcre-devel  URL重写功能
#zlib-devel  压缩支持
#make  编译命令

if ! (yum -y install wget gcc pcre-devel zlib-devel make &>/dev/null);then
	echo "yum install soft package fail"
        exit 1
fi	

if ! (egrep "^www" /etc/passwd &>/dev/null);then
	useradd -s /sbin/nologin -r -M www
fi
	
}



nginx_install () {
#1、下载软件包
#if wget $nginx_pkg_url &>/dev/null;then
	#2、解压软件包
	echo $nginx_pkg_url|awk -F "/" '{print $5}'|xargs tar xf
	nginx_source_doc=`echo $nginx_pkg_url|awk -F "/" '{print $5}'|cut -d "." -f 1-3`
	#3、进入软件包
  	if [ ! -d $nginx_source_doc ];then
	  echo "unzip `echo $nginx_pkg_url|awk -F "/" '{print $5}'` fail"
          exit 1
        fi	  
	
	cd $nginx_source_doc

	#4、configure nginx
	./configure --prefix=$nginx_install_doc/nginx --user=$nginx_manage_user --group=$nginx_manage_user 1>/dev/null
	[ $? -ne 0 ]&&echo "nginx configure fail"&&exit 1

	#5、make nginx
	make -j $cpu_count 1>/dev/null
	[ $? -ne 0 ]&&echo "nginx make fail"&&exit 1
	
        #6、install nginx
	make install 1>/dev/null
	[ $? -ne 0 ]&&echo "nginx install fail"&&exit 1||echo "`clear`nginx install success..."

	#7、delete nginx soft package
	cd ..
	rm -rf ${nginx_source_doc}*

#else
#   echo "$nginx_pkg_url download fail"
#   exit 1
#fi   

	
}

#####callable function
check;nginx_install
```