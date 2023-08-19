## 案例需求

使用shell脚本安装Python环境

## 应用场景

服务器业务初始化

## 解决问题

避免人工多次安装，节省人工成本
避免人工错误，提高工作效率

## 脚本思路

1、获得软件包
2、源码安装
3、升级pip命令

## 案例代码

```
#!/bin/bash
#Description: python install from zutuanxue(http://www.zutuanxue.com)
#Release: python 3.7.6
#Auther: zutuanxue
#Email: 
#OS: Centos 8.X


#variables
python_download_url=https://www.python.org/ftp/python/3.7.6/Python-3.7.6.tgz
python_source_pkg=Python-3.7.6.tgz
python_code=Python-3.7.6


#functions
#安装前准备,安装必要依赖包
per_install () {
	if  ( ! yum -y install gcc-* openssl-* libffi-devel sqlite-devel &>/dev/null );then
	#if  ( ! yum -y install gcc-* openssl-* libffi-devel sqlite-devel ) &>/dev/null ;then
	echo -e "\033[31m network connection error,exit... \033[0m"
	exit 130
fi
}

#安装python
install () {
	#下载软件包
	wget $python_download_url
	#解压软件包
	if [ -f $python_source_pkg ];then
		tar xf $python_source_pkg
		[ $? -ne 0 ]&&echo "$python_source_pkg unzip fail"&&exit 1
		cd $python_code
		#配置,开启ssl支持https
		if ./configure --with-openssl=/usr/bin/openssl 1>/dev/null;then
			#mv Modules/Setup Modules/Setup.bak
			cp -f ../Setup Modules/
			if make 1>/dev/null;then
			#if make ;then
				if make install 1>/dev/null;then
				#if make install ;then
					#if pip3 install --upgrade pip 1>/dev/null;then
					#安装完成后更新pip
					if pip3 install --upgrade pip;then
						echo "python install success"
					else
						echo "pip3 install fail"
						exit 1
					fi
				else
					echo "python install fail"
					exit 1
				fi
			else
				echo "python make fail"
				exit 1
			fi
		else
			echo "python configure fail"
			exit
		fi
	else
		echo "not found $python_source_pkg"
		exit 1
	fi
}

	

per_install;install
rm -rf $python_code
rm -rf python_source_pkg
```