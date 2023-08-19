## 一、 Docker-Compose

### 1.1、 什么是Docker Compose

Compose 项目是 Docker 官方的开源项目，负责实现 Docker 容器集群的快速编排，开源代码在 **https://github.com/docker/compose** 上

我们知道使用 Dockerfile 模板文件可以让用户很方便的定义一个单独的应用容器，其实在工作中，经常会碰到需要多个容器相互配合来完成的某项任务情况，例如工作中的 web 服务容器本身，往往会在后端加上数据库容器，甚至会有负责均衡器，比如 LNMP 服务

Compose 就是来做这个事情的，它允许用户通过一个单独的 docker-compose.yml 模板文件 YAML格式 来定义一组相关联的应用容器为一个项目 project

Compose 中有两个重要的概念：

**服务 service :一个应用的容器，实际上可以包括若干运行相同镜像的容器实例**
**项目 project :由一组关联的应用容器组成的一个完整业务单元，在docker-compose.yml中定义**

### 1.2、 安装

```
# docker-compose版本选择:https://github.com/docker/compose/releases
# curl -L https://github.com/docker/compose/releases/download/1.25.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
# chmod +x /usr/local/bin/docker-compose
```

### 1.3、 命令

```
Compose 大部分命令的对象即可以是项目的本身，也可以是指定为项目中的服务或者容器
执行docker-compose [COMMAND] --help 或者docker-compose help [COMMAND]可以查看命令的帮助信息
具体的使用格式
docker-compose [-f=<arg>...] [options] [COMMAND] [ARGS]
参数选项
-f,--file file指定模板文件，默认是docker-compose.yml模板文件,可以多次指定
-p,--project-name name指定项目名称，默认使用所在目录名称作为项目名称
--x-networking 使用Docker的后端可插拔网络特性
--x-networking-driver driver指定网络的后端驱动，默认使用bridge
--verbose 输入更多的调试信息
-v,--version 输出版本信息


Compose所支持的命令：

build			 构建项目中的服务容器 
bundle     从Compose文件生成分布式应用程序包 
config     验证并查看Compose文件 
create     为服务创建容器 
down       停止容器并删除由其创建的容器，网络，卷和图像up 
events     为项目中的每个容器流式传输容器事件 
exec       这相当于docker exec。 
help       获得一个命令的帮助 
kill       通过发送SIGKILL信号来强制停止服务容器 
logs       查看服务容器的输出 
pause      暂停一个容器 
port       打印某个容器端口所映射的公共端口 
ps         列出项目中目前所有的容器 
pull       拉取服务依赖镜像 
push       推送服务镜像 
restart    重启项目中的服务 
rm         删除所有停止状态的服务容器 
run        在指定服务上执行一个命令 
scale      设置指定服务执行的容器个数 
start      启动已存在的服务容器 
stop       停止已存在的服务容器 
top        显示容器正在运行的进程 
unpause    恢复处于暂停状态的容器 
up         自动完成包括构建镜像、创建服务、启动服务并关联服务相关容器的一系列操作 
version    输出版本 
```

### 1.4、模板文件

排版问题，请看单独的文件。
官网链接：https://docs.docker.com/compose/compose-file/#compose-file-structure-and-examples

### 1.5、 示例

```
举个简单的例子来具有的说明一下 Compose 的使用

1. 创建一个目录(里面包含需要的文件)

[root@zutuanxue] mkdir compose-py

2. 创建一个 Python 应用， 使用 Flask ，将数值记入 Redis

[root@zutuanxue compose-py] cat app.py

import time
 
import redis
from flask import Flask
 
 
app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)
 
 
def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)
 
 
@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

3. 创建 requirements.txt 文件，里面是需要安装的 Python 包

[root@zutuanxue compose-py] cat requirements.txt
flask
redis

4. 创建 Dockerfile 文件

[root@zutuanxue compose-py] cat Dockerfile
FROM python
ADD . /code
WORKDIR /code
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
 
# 这告诉Docker：
    从 Python 开始构建镜像
    将当前目录 . 添加到 /code 镜像中的路径
    将工作目录设置为 /code
    安装 Python 依赖项
    将容器的默认命令设置为 python app.py
    
5. 创建 docker-compose.yml 文件

[root@zutuanxue compose-py] cat docker-compose.yml
version: '3'
services:
  web:
    build: .
    ports:
     - "5000:5000"
    volumes:
     - .:/code
  redis:
    image: "redis"
 
此 Compose 文件定义了两个服务，web 和 redis 
该web服务：
	使用从 Dockerfile 当前目录中构建的镜像
	将容器上的公开端口 5000 转发到主机上的端口 5000 我们使用 Flask Web 服务器的默认端口 5000
	该 redis 服务使用从 Docker Hub 中提取的公共 Redis 映像
	
6. 使用 Compose 构建并运行您的应用程序

[root@zutuanxue compose-py] docker-compose up

7. 测试访问，在浏览器访问 IP:5000 每刷新一次就会加一
```