# Docker的Pull和Push接口调用流程

找了很多的资料，没有人写过Docker接口逆向的教程。国家封锁了海外的Dockerhub镜像站，而且禁止国内的各大高校和企业镜像官方仓库。这下技术人员犯了难，所需要的镜像都没有了，趁手的工具都没有了，怎么去搞技术，于是乎开始有民间制作的Dockerhub镜像加速地址。这些加速地址优良参差不齐，有的速度极慢、有的要趁机收费发一笔横财、有的被滥用（白嫖过度）甚至过不了几天就要跑路。我配置在docker damon进程里的镜像加速地址换了又换，自己的实验地址这样操作是没问题的，可是业务容器不能容忍重启daemon进程，会导致整个namespace重置，业务中断，这就让人犯了难，于是乎我就根据大佬的教程搭建了一个镜像站，加速是实现了，速度也还能够满足，利用全球网络流量占比20%的CloudFlare Worker每天100,000次的免费请求进行无成本构建，满足了需求，并打通了Dockerhub的高速流量隧道。

可是我并不满足这些仅仅支持下载加速的地址，Dockerhub的免费无限存储空间呢？Docker私有账户存储的镜像怎么办？我想要一个支持登录和上传的镜像地址，于是我又找了网上几乎所有的教程，他们的实现方式要么成本较高，实现方法需要自己的服务器来做，难以承受巨额的流量费；要么用的是Github Action来做，等待Action去下载然后打包，你在本地导入，这丧失了很多优点，不具备实时性、无法与Linux里面安装的Docker客户端进行交互。于是我做了同时支持账户登录，账户私有镜像加速，推送到官方Dockerhub的镜像站，同时无成本实现。这篇文章用来记录逆向过程、账户推送镜像的原理和过程，顺带讲一点点DockerHub镜像站的架构、原理。

## 伪造证书认证中心的安装

因为Docker强制使用tls加密，无法解析到数据包里面的内容，则无法进行数据的逆向查看。这里利用伪造证书认证中心（CA）的方式让他使用指定的证书认证机构进行数据加密，而这个认证中心是假的，我具有这个认证中心的数据解码方法，这个tls无法解密的问题就解决了。

### 启动BurpSuite并导出CA

打开设置

![image-20240723001740440](Docker的Push的接口过程逆向.assets/image-20240723001740440.png)

导出证书

![image-20240723001943818](Docker的Push的接口过程逆向.assets/image-20240723001943818.png)

导出的文件名我设置的是

- burpsuite-cacert.der
- burpsuite-cakey.der

### CA证书解析为系统可识别的格式

仅需要安装CA证书即可，不需要安装ca密钥！！！

#### 证书解析和安装进操作系统

详细过程和另一种不适用dpkg-reconfigure的方法

```bash
openssl x509 -inform der -in burpsuite-cacert.der -out burpsuite-ca.crt
mkdir /usr/share/ca-certificates/extra
cp burpsuite-ca.crt /usr/share/ca-certificates/extra/
dpkg-reconfigure ca-certificates
```

在这里勾选你的证书并下一步，直到完成就结束了

![image-20240722224550408](Docker的Push的接口过程逆向.assets/image-20240722224550408.png)



## Docker CS架构抓包的困难性和解决方法

我想了各种办去做docker本身的流量拦截定向到burp正向代理里解析，我尝试了常用的proxychain4去单程序拦截可是不奏效，甚至我都要扒出tun网卡来拦截了，恰好找到了Docker Daemon进程写进配置文件的方式，数据果然出来的，Docker Dameon进程跟Dockerhub交互的流量全部被抓取出来（经过后续的查看，这个东西没有代理Dockerfile编译成镜像过程当时产生的流量，请知悉）。

### proxychain4的尝试（失败）

在配置文件里设置代理

```bash
┌──(root㉿localhost)-[~]
└─# cat -n /etc/proxychains4.conf | tail
   154  #         * raw: The traffic is simply forwarded to the proxy without modification.
   155  #        ( auth types supported: "basic"-http  "user/pass"-socks )
   156  #
   157  [ProxyList]
   158  # add proxy here ...
   159  # meanwile
   160  # defaults set to "tor"
   161  #socks4         127.0.0.1 9050
   162  http 127.0.0.1 8080
   163

```

测试，结果失败，burp里没获取到任何流量

```bash
┌──(root㉿localhost)-[~]
└─# proxychains docker login hub.geekery.cn
```



### Daemon进程直接对接正向代理

（失败）在daemon配置文件里配置，这种设置方法我认为是一种正确的设置方法，但是不知道为什么会报错。于是乎我换了一种方式，

```bash
{
  "proxies": {
    "http-proxy": "http://proxy.example.com:3128",
    "https-proxy": "https://proxy.example.com:3129",
    "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
  }
}
```

直接在systemd service里设置，注意看第17、18行是我新加的。这样设置之后即可抓取daemon流量。

```bash
┌──(root㉿localhost)-[~]
└─# systemctl cat docker
# /usr/lib/systemd/system/docker.service
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target docker.socket firewalld.service containerd.service
Wants=network-online.target containerd.service
Requires=docker.socket

[Service]
Type=notify
# the default is not to use systemd for cgroups because the delegate issues still
# exists and systemd currently does not support the cgroup feature set required
# for containers run by docker
EnvironmentFile=-/etc/default/docker
Environment="HTTP_PROXY=http://127.0.0.1:8080"
Environment="HTTPS_PROXY=http://127.0.0.1:8080"
ExecStart=/usr/sbin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock $DOCKER_OPTS
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=1048576
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNPROC=infinity
LimitCORE=infinity
# Uncomment TasksMax if your systemd version supports it.
# Only systemd 226 and above support this version.
TasksMax=infinity
TimeoutStartSec=0
# set delegate yes so that systemd does not reset the cgroups of docker containers
Delegate=yes
# kill only the docker process, not all processes in the cgroup
KillMode=process
# restart the docker process if it exits prematurely
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s

[Install]
WantedBy=multi-user.target


```



## 利用BurpSuite进行记录和解析流量

#### 初始设置

关闭这个选项，不然出一个请求停一下抓取。实话说这个工具挺难用的，java编写的程序，4G内存占用先不说，在分析具备blob数据的时候经常性卡顿，南勇的一逼，不知道是否是我没买企业版的原因哈哈哈。

![image-20240723005003786](Docker的Push的接口过程逆向.assets/image-20240723005003786.png)

![image-20240723005359414](Docker的Push的接口过程逆向.assets/image-20240723005359414.png)



#### Login流量过程

第一个直接登录流量包，先试探是否为无密码登录，返回401代码未授权，并且通过location触发跳转登录链接



![image-20240723005519930](Docker的Push的接口过程逆向.assets/image-20240723005519930.png)

客户端携带用户名密码加密的base64字符串去请求接口，返回一个具有期限的token

![image-20240723005703806](Docker的Push的接口过程逆向.assets/image-20240723005703806.png)

![image-20240723005804850](Docker的Push的接口过程逆向.assets/image-20240723005804850.png)

![image-20240723005841433](Docker的Push的接口过程逆向.assets/image-20240723005841433.png)

再次请求镜像站，这次会携带token进行球球，返回200状态码，则登录成功

![image-20240723005938492](Docker的Push的接口过程逆向.assets/image-20240723005938492.png)



![image-20240723005950596](Docker的Push的接口过程逆向.assets/image-20240723005950596.png)



#### Push流量过程

编译一个新的镜像进行测试

```bash
┌──(root㉿kali)-[~/ifconfig.icu]
└─# docker build -t hub.geekery.cn/jockerdragon/test:0.0.0.3 --no-cache .
Sending build context to Docker daemon  58.26MB
Step 1/8 : FROM python:3.12.3-alpine3.18
 ---> c692e99e7633
Step 2/8 : LABEL org.opencontainers.image.authors="<PaperDragon&&2678885646@qq.com>"
 ---> Running in 076a28b7242f
Removing intermediate container 076a28b7242f
 ---> b2254bf15177
Step 3/8 : WORKDIR /app
 ---> Running in 910ae15bcdeb
Removing intermediate container 910ae15bcdeb
 ---> 7024f52ed628
Step 4/8 : COPY . /app
 ---> ed5b51167133
Step 5/8 : RUN chmod +x entrypoint.sh
 ---> Running in 62cd697e5508
Removing intermediate container 62cd697e5508
 ---> ee501f4c9f13
Step 6/8 : RUN pip install --no-cache-dir -r requirements.txt && rm -rf requirements.txt
 ---> Running in 3def86822d95
Collecting fastapi==0.111.1 (from -r requirements.txt (line 1))
  Downloading fastapi-0.111.1-py3-none-any.whl.metadata (26 kB)
Collecting uvicorn==0.30.1 (from -r requirements.txt (line 2))
  Downloading uvicorn-0.30.1-py3-none-any.whl.metadata (6.3 kB)
Collecting geoip2==4.8.0 (from -r requirements.txt (line 3))
  Downloading geoip2-4.8.0-py2.py3-none-any.whl.metadata (18 kB)
Collecting jinja2==3.1.4 (from -r requirements.txt (line 4))

 ................................
Downloading mdurl-0.1.2-py3-none-any.whl (10.0 kB)
Installing collected packages: websockets, uvloop, urllib3, typing-extensions, sniffio, shellingham, pyyaml, python-multipart, python-dotenv, pygments, multidict, mdurl, maxminddb, MarkupSafe, idna, httptools, h11, frozenlist, dnspython, click, charset-normalizer, certifi, attrs, annotated-types, yarl, uvicorn, requests, pydantic-core, markdown-it-py, jinja2, httpcore, email_validator, anyio, aiosignal, watchfiles, starlette, rich, pydantic, httpx, aiohttp, typer, geoip2, fastapi-cli, fastapi
Successfully installed MarkupSafe-2.1.5 aiohttp-3.9.5 aiosignal-1.3.1 annotated-types-0.7.0 anyio-4.4.0 attrs-23.2.0 certifi-2024.7.4 charset-normalizer-3.3.2 click-8.1.7 dnspython-2.6.1 email_validator-2.2.0 fastapi-0.111.1 fastapi-cli-0.0.4 frozenlist-1.4.1 geoip2-4.8.0 h11-0.14.0 httpcore-1.0.5 httptools-0.6.1 httpx-0.27.0 idna-3.7 jinja2-3.1.4 markdown-it-py-3.0.0 maxminddb-2.6.2 mdurl-0.1.2 multidict-6.0.5 pydantic-2.8.2 pydantic-core-2.20.1 pygments-2.18.0 python-dotenv-1.0.1 python-multipart-0.0.9 pyyaml-6.0.1 requests-2.32.3 rich-13.7.1 shellingham-1.5.4 sniffio-1.3.1 starlette-0.37.2 typer-0.12.3 typing-extensions-4.12.2 urllib3-2.2.2 uvicorn-0.30.1 uvloop-0.19.0 watchfiles-0.22.0 websockets-12.0 yarl-1.9.4
WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv
                                                                                                                                                                                                                                           
[notice] A new release of pip is available: 24.0 -> 24.1.2                                                                                                                                                                                 
[notice] To update, run: pip install --upgrade pip                                                                                                                                                                                         
Removing intermediate container 3def86822d95                                                                                                                                                                                               
 ---> 8802aa36cd80
Step 7/8 : EXPOSE 8000
 ---> Running in 3f08ba09c39b
Removing intermediate container 3f08ba09c39b
 ---> d9bc475e34ed
Step 8/8 : CMD ["/app/entrypoint.sh"]
 ---> Running in 3f53a33715a9
Removing intermediate container 3f53a33715a9
 ---> 459bcc4789fe
Successfully built 459bcc4789fe
Successfully tagged hub.geekery.cn/jockerdragon/test:0.0.0.3

```



设置单线程上传方便测试

```bash
┌──(root㉿kali)-[~/ifconfig.icu]
└─# cat -n /etc/docker/daemon.json                                          
     1  {
     2      "max-concurrent-downloads": 1,
     3      "max-concurrent-uploads": 1
     4  }
                
```

推送测试

```bash
docker push hub.geekery.cn/jockerdragon/test:0.0.0.3
```

第1、2请求会发起登录，并获取一个临时的登录密钥

![image-20240723010901654](Docker的Push的接口过程逆向.assets/image-20240723010901654.png)

认证完了会携带token，进行upload请求，返回一个blob uuid和上传地址。

```bash
POST /v2/jockerdragon/test/blobs/uploads/ HTTP/2

Host: hub.geekery.cn

User-Agent: docker/20.10.25+dfsg1 go/go1.22.3 git-commit/5df983c kernel/6.8.11-amd64 os/linux arch/amd64 UpstreamClient(Docker-Client/20.10.25+dfsg1 \(linux\))

Content-Length: 0

Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1YyI6WyJNSUlFRmpDQ0F2NmdBd0lCQWdJVVZOajJRbU1JWnUzeGl0NUJ1RTlvRWdoVU5KUXdEUVlKS29aSWh2Y05BUUVMQlFBd2dZWXhDekFKQmdOVkJBWVRBbFZUTVJNd0VRWURWUVFJRXdwRFlXeHBabTl5Ym1saE1SSXdFQVlEVlFRSEV3bFFZV3h2SUVGc2RHOHhGVEFUQmdOVkJBb1RERVJ2WTJ0bGNpd2dTVzVqTGpFVU1CSUdBMVVFQ3hNTFJXNW5hVzVsWlhKcGJtY3hJVEFmQmdOVkJBTVRHRVJ2WTJ0bGNpd2dTVzVqTGlCRmJtY2dVbTl2ZENCRFFUQWVGdzB5TkRBeE1UWXdOak0yTURCYUZ3MHlOVEF4TVRVd05qTTJNREJhTUlHRk1Rc3dDUVlEVlFRR0V3SlZVekVUTUJFR0ExVUVDQk1LUTJGc2FXWnZjbTVwWVRFU01CQUdBMVVFQnhNSlVHRnNieUJCYkhSdk1SVXdFd1lEVlFRS0V3eEViMk5yWlhJc0lFbHVZeTR4RkRBU0JnTlZCQXNUQzBWdVoybHVaV1Z5YVc1bk1TQXdIZ1lEVlFRREV4ZEViMk5yWlhJc0lFbHVZeTRnUlc1bklFcFhWQ0JEUVRDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTWI4eHR6ZDQ1UWdYekV0bWMxUEJsdWNGUnlzSUF4UUJCN3lSNjdJemdMd05IS24rbUdKTzV5alh6amtLZm5zWm1JRURnZFlraEpBbGNYYTdQa1BFaCtqcTRGNWNaaWtkTmFUQmM3alNkTFJzTVlVa3dwWTl4WUVqYitCYnVGUWVxa0R2RXNqbFJJTzRQK0FsRlhNMDhMYlpIZ3hFWUdkbFk3WFlhT1BLMmE1aUd2eVFRb09GVmZjZDd2ekhaREVBMHZqVmU1M0xLdjVMYmh6TzcxZHRxS0RwNEhnVWR5N1pENDFNN3I1bTd5eE1LeFNpQmJHZTFvem5Wamh1ck5GNHdGSml5bVU4YkhTV2tVTXVLQ3JTbEd4d1NCZFVZNDRyaEh2UW5zYmgzUFF2TUZTWTQ4REdoNFhUUldjSzFWUVlSTnA2ZWFXUVg1RUpJSXVJbjJQOVBzQ0F3RUFBYU43TUhrd0RnWURWUjBQQVFIL0JBUURBZ0dtTUJNR0ExVWRKUVFNTUFvR0NDc0dBUVVGQndNQk1CSUdBMVVkRXdFQi93UUlNQVlCQWY4Q0FRQXdIUVlEVlIwT0JCWUVGSnVRYXZTZHVScm5kRXhLTTAwV2Z2czh5T0RaTUI4R0ExVWRJd1FZTUJhQUZGSGVwRE9ZQ0Y5Qnc5dXNsY0RVUW5CalU3MS9NQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUNDWW0xUVorUUZ1RVhkSWpiNkg4bXNyVFBRSlNnR0JpWDFXSC9QRnpqZlJGeHc3dTdDazBRb0FXZVNqV3JWQWtlVlZQN3J2REpwZ0ZoeUljdzNzMXRPVjN0OGp3cXJTUmc2R285dUd2OG9IWUlLTm9YaDErUFVDTG44b0JwYUJsOUxzSWtsL2FHMG9lY0hrcDVLYmtBNjN6eTFxSUVXNFAzWVJLSk9hSGoxYWFiOXJLc3lRSHF6SUl4TnlDRVVINTMwU1B4RUNMbE53YWVKTDVmNXIxUW5wSi9GM3Q5Vk8xZ0Y2RFpiNitPczdTV29ocGhWZlRCOERkL1VjSk1VOGp2YlF3MWRVREkwelNEdXo2aHNJbGdITk0yak04M0lOS1VqNjNaRDMwRG15ejQvczFFdGgyQmlKK2RHdnFpQkRzaWhaR0tyQnJzUzhWVkRBd3hDeDVRMyJdfQ.eyJhY2Nlc3MiOlt7ImFjdGlvbnMiOlsicHVsbCIsInB1c2giXSwibmFtZSI6ImpvY2tlcmRyYWdvbi90ZXN0IiwicGFyYW1ldGVycyI6eyJwdWxsX2xpbWl0IjoiMjAwIiwicHVsbF9saW1pdF9pbnRlcnZhbCI6IjIxNjAwIn0sInR5cGUiOiJyZXBvc2l0b3J5In1dLCJhdWQiOiJyZWdpc3RyeS5kb2NrZXIuaW8iLCJleHAiOjE3MjE2NjgzMDIsImh0dHBzOi8vYXV0aC5kb2NrZXIuaW8iOnsicGxhbl9uYW1lIjoiZnJlZSIsInVzZXJuYW1lIjoiam9ja2VyZHJhZ29uIn0sImlhdCI6MTcyMTY2ODAwMiwiaXNzIjoiYXV0aC5kb2NrZXIuaW8iLCJqdGkiOiJkY2tyX2p0aV8tSWs4cFdyUk5rVllmeFJsRXA0WmI0NnFCTjg9IiwibmJmIjoxNzIxNjY3NzAyLCJzdWIiOiI5MDE5NDY1YS1jZTgwLTRmOTAtOWM4NS03NjI2NjVjM2VhM2QifQ.GXCo-bhNjbAUopm-8PikvNeciwADB6LL7VZhMRuHNhAet2O1-1ZsRnQAbkBdrX6tOs39BLkefer1Ps_HwYjwLi3PCx6y6y3j20P-OckeXC59whGfihH51jkJq7WSBBrXkU4k5TNceGnCQxtR1p2z1LkXewfS0Jnwxz2P1TmUV2EUKlxLwZwSTSg-NlH3AqW6OclcmV_sA95NgmRp4BnKrkQOTiUdz2xTjA7vELA2q3VptYdcORZAyI1NIMdwBfMCw-gPiz-PQnBt93AoPCoHkcjuzZVTfxrCrg480m7BiWnOHTdgKhH0UasLdhKg5ys0fw95_nIKgTI4iIzlQ-teIg

Accept-Encoding: gzip, deflate, br

Connection: close


HTTP/2 202 Accepted

Date: Mon, 22 Jul 2024 17:06:43 GMT

Content-Length: 0

Location: https://hub.geekery.cn/v2/jockerdragon/test/blobs/uploads/8429c964-3a56-46e5-9512-f5c9559f2179?_state=nkCV87II1yHCU_48NVc21qHc7HPq7oEf1DIKZmuCwTp7Ik5hbWUiOiJqb2NrZXJkcmFnb24vdGVzdCIsIlVVSUQiOiI4NDI5Yzk2NC0zYTU2LTQ2ZTUtOTUxMi1mNWM5NTU5ZjIxNzkiLCJPZmZzZXQiOjAsIlN0YXJ0ZWRBdCI6IjIwMjQtMDctMjJUMTc6MDY6NDMuNTY1ODcxNTU3WiJ9

Host: registry-1.docker.io

Range: 0-0

Cf-Ray: 8a7505dccb0f77b7-LHR

Cf-Cache-Status: DYNAMIC

Strict-Transport-Security: max-age=31536000

Docker-Distribution-Api-Version: registry/2.0

Docker-Upload-Uuid: 8429c964-3a56-46e5-9512-f5c9559f2179

Report-To: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v4?s=B7%2FiBGoGkgqffejfiHuBu%2FuyJrGmNRAg6XAZ5NTj5sO%2FuQEZlwuSePqq3kYh0A34WG5PRO22S%2Bni0JiIagWLEOx5XG%2FsmIBuYYptQd0scR9HU4B7sCHvngDcSrVftzOo9A%3D%3D"}],"group":"cf-nel","max_age":604800}

Nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}

Vary: Accept-Encoding

Server: cloudflare

Alt-Svc: h3=":443"; ma=86400




```



客户端发起PATCH请求，这时body里会携带全部的这层镜像的压缩包，太大了会分段传输，range表示传递了多少段,上传完毕会200代码，若没有则继续通过location进行传递下一段，直到完全传完。

```bash
PATCH /v2/jockerdragon/test/blobs/uploads/f7b19f97-233b-4d29-93dd-721b20e6d6f8?_state=ifxCfGeZFk6-9Ww1vmIz20QeKa5mafNkGZHm6SPQKYJ7Ik5hbWUiOiJqb2NrZXJkcmFnb24vdGVzdCIsIlVVSUQiOiJmN2IxOWY5Ny0yMzNiLTRkMjktOTNkZC03MjFiMjBlNmQ2ZjgiLCJPZmZzZXQiOjAsIlN0YXJ0ZWRBdCI6IjIwMjQtMDctMjJUMTc6MDc6MjAuNjQyMzIzNDhaIn0%3D HTTP/2

Host: hub.geekery.cn

User-Agent: docker/20.10.25+dfsg1 go/go1.22.3 git-commit/5df983c kernel/6.8.11-amd64 os/linux arch/amd64 UpstreamClient(Docker-Client/20.10.25+dfsg1 \(linux\))

Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1YyI6WyJNSUlFRmpDQ0F2NmdBd0lCQWdJVVZOajJRbU1JWnUzeGl0NUJ1RTlvRWdoVU5KUXdEUVlKS29aSWh2Y05BUUVMQlFBd2dZWXhDekFKQmdOVkJBWVRBbFZUTVJNd0VRWURWUVFJRXdwRFlXeHBabTl5Ym1saE1SSXdFQVlEVlFRSEV3bFFZV3h2SUVGc2RHOHhGVEFUQmdOVkJBb1RERVJ2WTJ0bGNpd2dTVzVqTGpFVU1CSUdBMVVFQ3hNTFJXNW5hVzVsWlhKcGJtY3hJVEFmQmdOVkJBTVRHRVJ2WTJ0bGNpd2dTVzVqTGlCRmJtY2dVbTl2ZENCRFFUQWVGdzB5TkRBeE1UWXdOak0yTURCYUZ3MHlOVEF4TVRVd05qTTJNREJhTUlHRk1Rc3dDUVlEVlFRR0V3SlZVekVUTUJFR0ExVUVDQk1LUTJGc2FXWnZjbTVwWVRFU01CQUdBMVVFQnhNSlVHRnNieUJCYkhSdk1SVXdFd1lEVlFRS0V3eEViMk5yWlhJc0lFbHVZeTR4RkRBU0JnTlZCQXNUQzBWdVoybHVaV1Z5YVc1bk1TQXdIZ1lEVlFRREV4ZEViMk5yWlhJc0lFbHVZeTRnUlc1bklFcFhWQ0JEUVRDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTWI4eHR6ZDQ1UWdYekV0bWMxUEJsdWNGUnlzSUF4UUJCN3lSNjdJemdMd05IS24rbUdKTzV5alh6amtLZm5zWm1JRURnZFlraEpBbGNYYTdQa1BFaCtqcTRGNWNaaWtkTmFUQmM3alNkTFJzTVlVa3dwWTl4WUVqYitCYnVGUWVxa0R2RXNqbFJJTzRQK0FsRlhNMDhMYlpIZ3hFWUdkbFk3WFlhT1BLMmE1aUd2eVFRb09GVmZjZDd2ekhaREVBMHZqVmU1M0xLdjVMYmh6TzcxZHRxS0RwNEhnVWR5N1pENDFNN3I1bTd5eE1LeFNpQmJHZTFvem5Wamh1ck5GNHdGSml5bVU4YkhTV2tVTXVLQ3JTbEd4d1NCZFVZNDRyaEh2UW5zYmgzUFF2TUZTWTQ4REdoNFhUUldjSzFWUVlSTnA2ZWFXUVg1RUpJSXVJbjJQOVBzQ0F3RUFBYU43TUhrd0RnWURWUjBQQVFIL0JBUURBZ0dtTUJNR0ExVWRKUVFNTUFvR0NDc0dBUVVGQndNQk1CSUdBMVVkRXdFQi93UUlNQVlCQWY4Q0FRQXdIUVlEVlIwT0JCWUVGSnVRYXZTZHVScm5kRXhLTTAwV2Z2czh5T0RaTUI4R0ExVWRJd1FZTUJhQUZGSGVwRE9ZQ0Y5Qnc5dXNsY0RVUW5CalU3MS9NQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUNDWW0xUVorUUZ1RVhkSWpiNkg4bXNyVFBRSlNnR0JpWDFXSC9QRnpqZlJGeHc3dTdDazBRb0FXZVNqV3JWQWtlVlZQN3J2REpwZ0ZoeUljdzNzMXRPVjN0OGp3cXJTUmc2R285dUd2OG9IWUlLTm9YaDErUFVDTG44b0JwYUJsOUxzSWtsL2FHMG9lY0hrcDVLYmtBNjN6eTFxSUVXNFAzWVJLSk9hSGoxYWFiOXJLc3lRSHF6SUl4TnlDRVVINTMwU1B4RUNMbE53YWVKTDVmNXIxUW5wSi9GM3Q5Vk8xZ0Y2RFpiNitPczdTV29ocGhWZlRCOERkL1VjSk1VOGp2YlF3MWRVREkwelNEdXo2aHNJbGdITk0yak04M0lOS1VqNjNaRDMwRG15ejQvczFFdGgyQmlKK2RHdnFpQkRzaWhaR0tyQnJzUzhWVkRBd3hDeDVRMyJdfQ.eyJhY2Nlc3MiOlt7ImFjdGlvbnMiOlsicHVsbCIsInB1c2giXSwibmFtZSI6ImpvY2tlcmRyYWdvbi90ZXN0IiwicGFyYW1ldGVycyI6eyJwdWxsX2xpbWl0IjoiMjAwIiwicHVsbF9saW1pdF9pbnRlcnZhbCI6IjIxNjAwIn0sInR5cGUiOiJyZXBvc2l0b3J5In1dLCJhdWQiOiJyZWdpc3RyeS5kb2NrZXIuaW8iLCJleHAiOjE3MjE2NjgzMDIsImh0dHBzOi8vYXV0aC5kb2NrZXIuaW8iOnsicGxhbl9uYW1lIjoiZnJlZSIsInVzZXJuYW1lIjoiam9ja2VyZHJhZ29uIn0sImlhdCI6MTcyMTY2ODAwMiwiaXNzIjoiYXV0aC5kb2NrZXIuaW8iLCJqdGkiOiJkY2tyX2p0aV8tSWs4cFdyUk5rVllmeFJsRXA0WmI0NnFCTjg9IiwibmJmIjoxNzIxNjY3NzAyLCJzdWIiOiI5MDE5NDY1YS1jZTgwLTRmOTAtOWM4NS03NjI2NjVjM2VhM2QifQ.GXCo-bhNjbAUopm-8PikvNeciwADB6LL7VZhMRuHNhAet2O1-1ZsRnQAbkBdrX6tOs39BLkefer1Ps_HwYjwLi3PCx6y6y3j20P-OckeXC59whGfihH51jkJq7WSBBrXkU4k5TNceGnCQxtR1p2z1LkXewfS0Jnwxz2P1TmUV2EUKlxLwZwSTSg-NlH3AqW6OclcmV_sA95NgmRp4BnKrkQOTiUdz2xTjA7vELA2q3VptYdcORZAyI1NIMdwBfMCw-gPiz-PQnBt93AoPCoHkcjuzZVTfxrCrg480m7BiWnOHTdgKhH0UasLdhKg5ys0fw95_nIKgTI4iIzlQ-teIg

Accept-Encoding: gzip, deflate, br

Connection: close

Content-Length: 0



HTTP/2 202 Accepted

Date: Mon, 22 Jul 2024 17:07:21 GMT

Content-Length: 0

Location: https://hub.geekery.cn/v2/jockerdragon/test/blobs/uploads/f7b19f97-233b-4d29-93dd-721b20e6d6f8?_state=eIbb6aiCKJ4yvBm73PQwwMK9oPGXr1l3F66xUAE6ZPd7Ik5hbWUiOiJqb2NrZXJkcmFnb24vdGVzdCIsIlVVSUQiOiJmN2IxOWY5Ny0yMzNiLTRkMjktOTNkZC03MjFiMjBlNmQ2ZjgiLCJPZmZzZXQiOjAsIlN0YXJ0ZWRBdCI6IjIwMjQtMDctMjJUMTc6MDc6MjBaIn0%3D

Host: registry-1.docker.io

Range: 0-0

Cf-Ray: 8a7506c888f877b7-LHR

Cf-Cache-Status: DYNAMIC

Strict-Transport-Security: max-age=31536000

Docker-Distribution-Api-Version: registry/2.0

Docker-Upload-Uuid: f7b19f97-233b-4d29-93dd-721b20e6d6f8

Report-To: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v4?s=lMuAl0UgmHfUdIxLJEOM5CeeqKvoGrWyjIUWWjfyUfWZaO65Z9ss1qo%2Bypcr7bbpG0b1tK8bXvJFZjkMXDUal9y56PPaoBA%2BqIQ9H2%2Fn3QHRKaA0HVM5Bdoq4LpWZUc6Gg%3D%3D"}],"group":"cf-nel","max_age":604800}

Nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}

Vary: Accept-Encoding

Server: cloudflare

Alt-Svc: h3=":443"; ma=86400




```





## 解析登录和推送过程并在云端重写

。。。传递上边过程中提到的body和head里面的数据。改写location里的跳转为自己的地址。。。。。



## DockerHub架构解析

### 认证过程

![image-20240723011558478](Docker的Push的接口过程逆向.assets/image-20240723011558478.png)

1. 尝试与仓库开始推送/拉取操作。
2. 如果仓库需要授权，它将返回一个401未授权的HTTP响应，并附带如何进行认证的信息。
3. 仓库客户端向授权服务请求一个Bearer令牌。
4. 授权服务返回一个不透明的Bearer令牌，代表客户端已获授权的访问权限。
5. 客户端使用在请求的Authorization头中嵌入的Bearer令牌重试原始请求。
6. 仓库通过验证Bearer令牌及其内嵌的有效声明集来授权客户端，并像往常一样开始推送/拉取会话。

### Push过程

>  [API文档](https://distribution.github.io/distribution/spec/api/)



####  Api 版本确认

registry 服务器会通过/v2/接口根据返回的状态码来提供api的版本信息，请求格式如下

```bash
GET /v2
```

如果返回200 OK 则表明registry实现了V2接口，并且客户端可以安全的去使用其他所有的v2接口
如果返回401 Unauthorized, 则表示客户端需要根据WWW-Authenticate header 重新请求接口。根据访问控制设置，用户即使这里通过验证，在访问不同的资源的时候可能仍需身份验证
如果返回404 NOT FOUND ,则客户端应认为registry未实现v2接口

#### 校验layer是否存在

可以通过一个HEAD 请求来校验一个layer是否存在。 请求格式如下：

```bash
HEAD /v2/<name>/blobs/<digest> 
```

如果返回的状态码为200 OK ,则表示指定的layer已存在，若已存在则client 则跳过该layer的上传。由于HEAD 请求根据HTTP规范没有body,因此HEADER中带了以下信息

```bash
200
Content-Length: <length of blob>
Docker-Content-Digest: <digest> 
```

看上边burp的抓包结果

#### 发送post请求

该请求的参数是镜像命名空间，layer将在该命名空间被链接。该请求的格式是：

```bash
POST  /v2/<name>/blobs/uploads/
```

如果返回202 Accepted 则表明请求成功，其HEADER携带了以下信息：

```bash
202 Accepted
Location: /v2/<name>/blobs/uploads/<uuid>
Range: bytes=0-<offset>
Content-Length: 0
Docker-Upload-UUID: <uuid>
```

其中Location 返回下一步镜像上传的地址,其API格式为/v2/<name>/blobs/uploads/<uuid>
如果本地客户端想和远程registry的上传状态相关联，可以使用Docker-Upload-UUID中的值。这个id可以作为上一次 location header 的key 来实现可恢复上传。

```bash
POST /v2/hello-world/blobs/uploads/ HTTP/1.1
Host: hub.vic.com
User-Agent: docker/17.12.0-ce go/go1.9.2 git-commit/c97c6d6 kernel/3.10.0-693.el7.x86
```

