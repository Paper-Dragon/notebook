# HAproxy 七层负载均衡

## 概述

![image-20211115094625216](haproxy.assets\image-20211115094625216.png)





## 特点

![image-20211115103530945](haproxy.assets\image-20211115103530945-16369437325881.png)



## 实例1

环境

![image-20211115110133707](haproxy.assets\image-20211115110133707-16369452956832.png)

```bash
172.16.100.14 web1
172.16.100.15 web2
172.16.100.21 haproxy

172.16.100.13 windows client
```

步骤

WEB

```bash
# 优化系统
systemctl stop firewalld ;systemctl disable firewalld
sed -i 's/SELINUX=.*/SELINUX=disabled/g' /etc/selinux/config

# ntp核对时间

# 创建测试页面
yum -y install httpd
echo $HOSTNAME > /var/www/html/index.html
```

HA

```bash
yum install epel-* -y
yum install haproxy -y
```

配置haproxy



```bash
vim /etc/haproxy/haproxy.cfg
```

haproxy 5大部分内容

![image-20211115114154315](haproxy.assets\image-20211115114154315.png)



```text
global					# 全局配置
	log 127.0.0.1 local3 info					# 日志配置 ，记录到本机
	maxconn 4096					# 最大连接限制（优先级低）
	user nobody					# 用户 uid 123
	group nobody					# 用户组 
	deamon 					# 守护进程形式运行
	nbproc 1					# haproxy的进程数，该值设置为cpu核心数一致过多的进程数导致进程崩溃
	pidfile /var/run/haproxy.pid		# pid
	
defaults
	log global					# 跟global一样
	mode http					# 工作层次 7层http或者4层tcp
	maxconn 2048				# 越往下优先级越高最大连接数（优先级中）
    retries 3					# 健康检查 二次连接失败就是不可用
    option redispatch					# 服务不可用后的操作 重新定向到其他健康服务器，重新匹配
    contimeout 5000					# （重传计时器）定义haoroxy将客户端!!!请求!!!转发至后端服务器，所等待的超时时长
    clitimeout 50000					# (向后长连接) haproxy作为服务器，和用户之间的空闲时间超时，到时候发送fin指令
	srvtimeout 50000					# （向前长连接）haproxy作为服务器，和用户之间的空闲连接的超时时间，到时候发送超时指令
	
    #timeout connect         10s # 等于contimeout
    #timeout client          1m # clitimeout
    #timeout server          1m	# srvtimeout

	option abortonclose					# 当服务器负载很高时，自动结束掉当前队列处理比较久的连接
	
	
	stats uri /admin?stats					# 设置url观察状态uri为 admin?stats
	stats realm Private lands					# 设置统计页面认证时的统计信息
	stats auth admin:password					# 设置统计页面认证的用户名和密码，如果设置多个，另起一行写入即可
	stats hide-version					# 隐藏统计页面的haproxy的版本信息


frontend http-in
	bind 0.0.0.0:80
	mode http
	log global					# 使用global设置
	option httplog				# 
	option httpclose					# 
    acl html url_reg -i \.html$					# 1.访问控制列表名称html，正则规则要求访问以html结尾的url时
    use_backend html-server if html					# 2.如果满足html规则，则推送给后端服务器html-server
    default_backend html-server
backend html-server
	mode http
	balance roundrobin
	option httpchk GET /index.html
	cookie SERVERID insert indirect nocache
	server html-A web1:80 weight 1 cookie 3 check inter 2000 rise 2 fall 5
	server html-B web2:80 weight 1 cookie 4 check inter 2000 rise 2 fall 5



systemctl start haproxy
```

















测试结果

![image-20211115133138012](haproxy.assets\image-20211115133138012.png)

![image-20211115133730736](haproxy.assets\image-20211115133730736.png)











## 实例2

拓扑

![image-20211115135352489](haproxy.assets\image-20211115135352489.png)

环境

```bash
haproxy
htmla
htmlb
phpa
phpb

```









# Nginx七层负载均衡



特点

![image-20211115141935128](haproxy.assets\image-20211115141935128.png)

优势

![image-20211115141948678](haproxy.assets\image-20211115141948678.png)

架构

![image-20211115142055972](haproxy.assets\image-20211115142055972.png)

![image-20211115142837094](haproxy.assets\image-20211115142837094.png)

![image-20211115142856927](haproxy.assets\image-20211115142856927.png)

语法实例

![image-20211115143046597](haproxy.assets\image-20211115143046597.png)

nginx负载均衡算法

![image-20211115143211572](haproxy.assets\image-20211115143211572.png)

环境



![image-20211115143505329](haproxy.assets\image-20211115143505329.png)

案例

vim /etc/nginx/nginx.conf

```c
upstream html {
	server web1:80;
	server web2:80;
	rr;
}
	server {
        location / {
            proxy_pass http://html;
        }
}
```



面试：

![image-20211115144532449](haproxy.assets\image-20211115144532449.png)

```bash
内容概述:
       静态调度算法：
       1.rr轮询(默认调度算法)       顺序分配逐一请求
       2.wrr权重轮询算法           权重大转发次数多
       3.ip_hash                 相同ip固定转发
       动态调度算法:
       1.fair调度算法              响应时间短的优先分配
       2.least_conn               连接请求少的优先分配
       3.一致HASH 和url_hash       后台为缓存服务器时效果好

```

状态参数

![image-20211115144606043](haproxy.assets\image-20211115144606043.png)

