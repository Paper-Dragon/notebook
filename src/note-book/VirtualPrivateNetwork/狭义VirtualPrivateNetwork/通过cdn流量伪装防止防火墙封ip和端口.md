---
category: 
  - VirtualPrivateNetwork
---

# 通过cdn流量伪装防止防火墙封ip和端口


## 边缘计算系统构建

### 将域名绑定到CDN上

#### 1.[登录CDN网站](https://dash.cloudflare.com/login/)，找到增加域名选项

![image-20220819194959187](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819194959187.png)

#### 2.点击添加域名

![image-20220819195044991](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819195044991.png)

#### 3.选择Free计划

![image-20220819195120435](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819195120435.png)

#### 4.临时添加一条记录，让CDN去验证域名合法性

![image-20220819195321479](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819195321479.png)



#### 5.复制新生成的两个ns服务器备用

![image-20220819195427838](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819195427838.png)





#### 6.登录域名服务厂商，找到域名管理处，修改ns服务器为CloudFlare服务器

![image-20220819195544445](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819195544445.png)

![image-20220819200101082](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819200101082.png)



#### 7.等待全球DNS记录刷新，在CloudFlare见到此页面为 ns服务器绑定成功



![image-20220819201003518](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819201003518.png)



## 节点增加

### 在Server端安装x-ui

```bash
输入以下代码自动安装x-ui服务器
bash <(curl -Ls https://raw.githubusercontent.com/chenyue168881/x-ui/master/install.sh)
```

#### 1.登录服务器并确认配置

内存大于500M，硬盘大于5G

![image-20220819201800853](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819201800853.png)

#### 2.运行脚本并安装x-ui，看到如下图为安装成功

如果出现 -bash: curl: command not found

运行

```bash
apt-get update
apt-get install curl -y
```



![image-20220819202106697](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819202106697.png)



安装成功

![image-20220819202309901](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819202309901.png)

#### 3.修改x-ui web密码

```bash
apt-get install sqlite3 -y && \
sqlite3 /etc/x-ui/x-ui.db <<EOF
select * from users where id=1;
update users set username='chenyue' where id = 1;
update users set password='ac147258@' where id = 1;
select * from users where id=1;
.q
EOF
```

出现这个界面为运行成功

![image-20220819202652563](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819202652563.png)



#### 4.登录web界面

> url类似于 http://xxx.xxx.xxx.xxx:54321/

![image-20220819215155571](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819215155571.png)

### 在CDN上增加域名

打开此界面，点击增加A记录

![image-20220819203228352](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819203228352.png)

如图配置，获得的域名应该是 `example-1111.456987.top`  指向 `45.91.82.122` 并通过`cf`伪装所有流量

如下图为成功配置

```bash
测试网站 ping.chinaz.com
```

![image-20220819203606534](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819203606534.png)

![image-20220819203635664](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819203635664.png)





### 生成加密证书(已生成）

![image-20220820011711344](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220820011711344.png)

![image-20220820011541397](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220820011541397.png)



泛解析

以下正式用于*.456987.top, 456987.top 有效期15年)

crt.pem（公钥）

```bash
-----BEGIN CERTIFICATE-----
MIIEoDCCA4igAwIBAgIUZa0sSNhVpNZglPxxhKF1+M3ANSUwDQYJKoZIhvcNAQEL
BQAwgYsxCzAJBgNVBAYTAlVTMRkwFwYDVQQKExBDbG91ZEZsYXJlLCBJbmMuMTQw
MgYDVQQLEytDbG91ZEZsYXJlIE9yaWdpbiBTU0wgQ2VydGlmaWNhdGUgQXV0aG9y
aXR5MRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMRMwEQYDVQQIEwpDYWxpZm9ybmlh
MB4XDTIyMDgxOTEyNTQwMFoXDTM3MDgxNTEyNTQwMFowYjEZMBcGA1UEChMQQ2xv
dWRGbGFyZSwgSW5jLjEdMBsGA1UECxMUQ2xvdWRGbGFyZSBPcmlnaW4gQ0ExJjAk
BgNVBAMTHUNsb3VkRmxhcmUgT3JpZ2luIENlcnRpZmljYXRlMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEAte6+DhUZ6M3n+ni3YB03VrxaSLvnhE9bP8jH
21kVk7oNiGP3NiQgcSdKiWGQP80qmF/g4MK+M1iteKKJL4x1OR6goUe0nE9heUrF
LZ18fGMvZsVQXtDMgEGbimMI7O0RXIBfiO1ZJK4RUL3VesxCf//g8u3oBQ+JEKbw
0MeDyZpJzyDfq4gbAdaxFdTFPLw6mCa8xilCmgLF9QqwTm5yutHiZHf2LFfnObFc
ROToYmnDlujjMxAr9X9qOdq5KXpXl6/byAHN5FEX5jfye31Bs5dvKSAitFxSjmXJ
kmuOLm7xrSWONfmXUIFicaZ23AWo9dB1SdQ2qU06EVAsFbgqSQIDAQABo4IBIjCC
AR4wDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcD
ATAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBSJElqAdN4qAlioXVUn5N05HP0tZjAf
BgNVHSMEGDAWgBQk6FNXXXw0QIep65TbuuEWePwppDBABggrBgEFBQcBAQQ0MDIw
MAYIKwYBBQUHMAGGJGh0dHA6Ly9vY3NwLmNsb3VkZmxhcmUuY29tL29yaWdpbl9j
YTAjBgNVHREEHDAaggwqLjQ1Njk4Ny50b3CCCjQ1Njk4Ny50b3AwOAYDVR0fBDEw
LzAtoCugKYYnaHR0cDovL2NybC5jbG91ZGZsYXJlLmNvbS9vcmlnaW5fY2EuY3Js
MA0GCSqGSIb3DQEBCwUAA4IBAQCHUhZ0xSjFeUE1NyyB0bsMeO/JGMepqkLd5FZ1
T0HZ3ULMS5oAOr4XvWKlGkJQfwagSCJLKtwbgdp4cAsyAl4nrICxnvyAR8njo8+m
o4E6cwW6pNrd792WlfK0LKgQVXIo8dZJcnfHyw4qFjABvFJKRp95L3nhxB7o4h9z
d56EW1hJp3RzDd8t0g2KUFnr8pCKZZ5A4mkofqPFUM+Ff8ntTw5q98dqC43DKkc2
nTz4tSBXREvyrj0glgKlVP73SJJKtruwBVZlueENa9E4GyvaeAg1O+PY6cfEycHl
VBGMOfoNx1Lqi7Uuh0Uul+YjvncFymhrcWc/B2h2XvmjMOVF
-----END CERTIFICATE-----

```

key.pem（密钥）

```bash
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC17r4OFRnozef6
eLdgHTdWvFpIu+eET1s/yMfbWRWTug2IY/c2JCBxJ0qJYZA/zSqYX+Dgwr4zWK14
ookvjHU5HqChR7ScT2F5SsUtnXx8Yy9mxVBe0MyAQZuKYwjs7RFcgF+I7VkkrhFQ
vdV6zEJ//+Dy7egFD4kQpvDQx4PJmknPIN+riBsB1rEV1MU8vDqYJrzGKUKaAsX1
CrBObnK60eJkd/YsV+c5sVxE5OhiacOW6OMzECv1f2o52rkpeleXr9vIAc3kURfm
N/J7fUGzl28pICK0XFKOZcmSa44ubvGtJY41+ZdQgWJxpnbcBaj10HVJ1DapTToR
UCwVuCpJAgMBAAECggEAHdRuyg1Qqbi1G/7WBkbUD38jiIByteFzEzK+/iqNnKKp
XF8TpgdnYFYyZPMfvS5NGR3DV+bmW7HjA4AW4Tp07/AjIz6IEQb88u+9A70qL5Tt
rTqV8m3m0fKv55FUYdB/A70yrNdJwfdedHAjxBYgoy8XuY0jeUzySs4sdvb3l0LT
n9G52/Qk3z6ZswZHjQV6geQFoPtZlQBDqUf0Qekj2JAAIDSJKjc1/nYo17vzhxNW
/0VUOweH2g1d+AzJgyMZq/kxIb96IcLwmYGGqDUnJXw1Co6hPn8DpspsPcJx3Iiy
Kd7kfCFPjQkUGAqoqvnq38ZYKKg/cYyExiJVVmkO/wKBgQDez49/oEfCXDBLKxrL
IKASiT/A5N87Rl1ymX0rhNHGTF0VsRhVIteXNjF/jv49OHxooFNmlE/pgwcb86P2
x6I38rhMyQYvY/oZIXDJbfXf5wO6qxcpwIrIgOJKt86cvKizRWQqA3TwPETlp8Fk
NBc/+5M0cC0kDsXVPIWQNQzZxwKBgQDRCF/XSlM7G6mXg+0+iW/xzWXPY4Xurzd7
RgZvpaPr/Sc/jQl5EQVH4rbOBo/WCMeCYJSqMtuvCN18R76T+ZmXIa02qIkBTi1F
WSyZSCPlk/BnP7UkDAFr/dwMXR24cjnF8CJYp3Nsc7gwqxirpmeO7KeIj2hXhOjZ
kJfH/mRbbwKBgQCN0koBr5DdivaGchps3whkpA37hvL8dM54anB86d7ovKSncQEO
982Ih0s8aVU0vKabpilP6ulutiMpTIy6QNnliM58uZwBQD7qDhoPbLmLWi1KfSqS
PedYtojTjGmr5H3xFiMqhubBH2uvTndPg8Skykopn5lsESclko9leg8C8wKBgHex
mue1eJlVCrRm57eyjTZhjdXGQE/fZx6gh1jw+T9NU2cRhIYdl++Ew3aPzVca6dsf
IKGgw6ijo+fhUSB8gVVIBF5S/TiRIl0eZepTo7J3FuaYVUoR0dKbp6Awxa7zQV+1
VIV9RRup26OKpXLMs2nk2z3YGEBdK9RA9pifc6njAoGBAMyruw1f+5VH+fAoSH+K
3HEgMdL4VKKE25WfzDCyN3s/2A1YNsABCzqQdDY07ROB/yy/AHkKc9dIZLrV7XHB
VAfnTf71SFv+phdbLEJIXQEVtnhCTewUCNVNh5TAnykKne3fBbz1lvIkq4I7W0r4
lE+ACh0f58oLg7eOwJu7CpZj
-----END PRIVATE KEY-----

```



### 在x-ui上配置节点

输入CDN增加的域名

输入上一个步骤的加密证书



![image-20220819214643980](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819214643980.png)









## 测试和对比

第一条为走CDN（本地测试速度减小了，因地而异，不一定会慢）

第二条为裸奔

第三条为CDN并为随机端口（无法使用）



![image-20220819214729276](通过cdn流量伪装防止防火墙封ip和端口.assets/image-20220819214729276.png)