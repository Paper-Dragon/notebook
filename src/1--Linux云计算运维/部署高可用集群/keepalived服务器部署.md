## 一、什么是高可用

通过前面课程的学习，我们知道LVS、Nginx可以实现很多种不同类型的分发，我们还知道，集群系统存在的作用就是为了解决单点故障的问题。

### LVS、Nginx集群的单点故障问题

这个单点故障主要体现在两个方面

- 分发器宕机怎么处理？
	假如nginx服务器挂掉了，那么所有的服务也会跟着瘫痪 。
	一种方法是人为监控，发现主分发器宕机后，立马登录备分发器，并给它分配虚ip。

	另一种办法是用软件来替代人来监控，自动登录备分发器，分配虚ip。

- 数据服务器宕机怎么处理？
	分发器可以自动判断数据服务器的存活状态，不对宕机服务器要数据。

## 二、Keepalived介绍

keepalived是使用C语言编写的路由热备软件，该项目主要目标是为linux系统提供简单高效的负载均衡及高可用解决方案。keepalived由一组检查器，根据服务器的健康状况动态的维护和管理服务器池，另外keepalived通过vrrp协议实现高可用架构，vrrp是路由灾备的实现基础。通过前面的课程我们知道，在lvs中只解决了真实服务器的单点故障，但是如果分发器也就是lvs主机发生故障的话，整个集群系统都会崩溃，所以我们需要keepalived来实现集群系统的高可用。我们可以部署两台或更多的分发器，仅有一台调度器做为主服务器，其它的做为备用，当主调度器发生故障时，keepalived可以自动将备用调度器升级为主调度器，从而实现整个集群系统的高负载，高可用。

## 三、vrrp协议

vrrp协议是为了静态路由环境下防止单点故障而设计的主从灾备协议，在主设备发生故障时业务自动切换至从设备，而这一切对于用户而言是透明的。vrrp将两台或多台设备虚拟成一个设备，对外仅提供一个虚拟的IP地址，这些设备在同一时刻仅有一台设备可有拥有该IP地址，而拥有该IP地址的设备就是主设备,其它的就是备用设备。主设备会不断发送自己的状态信息给备用设备，当备用设备接收不到主设备的状态信息时，多个备用设备会根据自身的优先级选择出新的主设备，并拥有所有的业务功能。vrrp协议需要为每个路由设备定义一个虚拟路由ID（VRID）以及优先，所有主备路由设备的VRID必须一样，这样才会被视为同一组设备，而优先级最高的设备就是主路由设备，VRID和优先级的范围为0-255之间的整数，数值越大优先级越高，如果优先级相等，则会对比IP地址，地址越大优先级越高

## 四、部署keepalived

```
[root@lvs1 ~]# dnf install keepalived -y
```

**配置文件说明**

```
[root@lvs1 ~]# vim /etc/keepalived/keepalived.conf
! Configuration File for keepalived
 
global_defs {					#全局配置
	notification_email {		#指定keepalived在发生切换时需要发送email到的对象，一行一个
		acassen@firewall.loc	#指定收件人邮箱
		failover@firewall.loc
		sysadmin@firewall.loc
	}
	notification_email_from Alexandre.Cassen@firewall.loc #指定发件人
	smtp_server 192.168.200.1	#指定smtp服务器地址
	smtp_connect_timeout 30		#指定smtp连接超时时间
	router_id LVS_DEVEL			#此处注意router_id为负载均衡标识，在局域网内应该是唯一的。
	vrrp_skip_check_adv_addr
	vrrp_strict
	vrrp_garp_interval 0
	vrrp_gna_interval 0
}
vrrp_instance VI_1 {		#虚拟路由的标识符
	state MASTER			#状态只有MASTER和BACKUP两种，并且要大写，MASTER为工作状态，BACKUP是备用状态
	interface eth0			#通信所使用的网络接口
  virtual_router_id 51	#虚拟路由的ID号，是虚拟路由MAC的最后一位地址
  priority 100			#此节点的优先级，主节点的优先级需要比其他节点高
  advert_int 1			#通告的间隔时间
  authentication {		#认证配置
				auth_type PASS		#认证方式
        auth_pass 1111		#认证密码
    }
    virtual_ipaddress {		#虚拟ip地址,可以有多个地址，每个地址占一行，不需要子网掩码，同时这个ip 必须与我们在lvs 客户端设定的vip 相一致！
        192.168.200.16
        192.168.200.17
        192.168.200.18
    }
}
 
virtual_server 192.168.200.100 443 { #集群所使用的VIP和端口
    delay_loop 6					#健康检查间隔，单位为秒
    lb_algo rr						#lvs调度算法rr|wrr|lc|wlc|lblc|sh|dh
    nat_mask 255.255.255.0			#VIP掩码
    lb_kind NAT						#负载均衡转发规则。一般包括DR,NAT,TUN 3种
    persistence_timeout 50			#会话保持时间，会话保持，就是把用户请求转发给同一个服务器，不然刚在1上提交完帐号密码，就跳转到另一台服务器2上了
    protocol TCP					#转发协议，有TCP和UDP两种，一般用TCP，没用过UDP
    real_server 192.168.200.100 443 { #真实服务器，包括IP和端口号
        weight 1					#权重
		TCP_CHECK {					#通过tcpcheck判断RealServer的健康状态
            connect_timeout 3		#连接超时时间
            nb_get_retry 3			#重连次数
            delay_before_retry 3	#重连间隔时间
            connect_port 23			#健康检查的端口的端口
            bindto <ip>  
        }
           
        HTTP_GET  {		#健康检测方式，可选有 SSL_GET、TCP_CHECK、HTTP_GET
            url {					#检查url，可以指定多个
              path /		#检查的url路径
              digest ff20ad2481f97b1754ef3e12ecd3a9cc  #需要检查到的内容。检查后的摘要信息。
            }
            url {
              path /mrtg
              digest 9b3a0c85a887a256d6939da88aabd8cd
            }
            url {
              path /testurl3/test.jsp
              digest 640205b7b0fc66c1ea91c463fac6334d
            }

            connect_timeout 3		#连接超时时间
            nb_get_retry 3			#检测尝试几次
            delay_before_retry 3	#检测的时间间隔
        }
    }
}
```