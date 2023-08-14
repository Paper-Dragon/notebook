# 在Dockerfile里调整时区
## docker已运行容器里的时区修改
```yaml
ln -sf /usr/share/zoneinfo/Asia/Shanghai    /etc/localtime
或者
cp /usr/share/zoneinfo/Asia/Shanghai    /etc/localtime
重启容器即可 # 创建并运行容器，通过 -e TZ="Asia/Shanghai" 设置时区 docker run -e TZ="Asia/Shanghai" -d -p 80:80 --name nginx nginx
```

在docker container 中不能自动识别宿主机的时区，可通过安装tzdata软件包，配置TZ环境变量识别正确时区．
 使用tzdata设置时区`dpkg-reconfigure tzdata`

```dockerfile
# for ubuntu 
RUN apt-get update && apt-get install -y --no-install-recommends tzdata  && rm -rf /var/lib/apt/lists/*
ENV TZ Asia/Shanghai

# for alpine
RUN apk add --no-cache tzdata
ENV TZ Asia/Shanghai
```

当在个性化需求是可在docker run命令或docker-compose文件增加环境变量 -e TZ=Asia/Shanghai(其他时区)

本人测试文件
 ubuntu/Dockerfile

```dockerfile
FROM ubuntu
RUN apt update && apt install -y tzdata
ENV TZ Asia/Shanghai
WORKDIR /app
COPY . /app
ENV NAME World
```

alpine/Dockerfile

```dockerfile
FROM python:3.6-alpine
WORKDIR /app
COPY . /app
ENV NAME World
RUN apk add --no-cache tzdata
ENV TZ Asia/Shanghai
CMD ["python", "app.py"]
```

测试用的复制粘贴

```bash
docker build -t t-u  study_days/docker/ubuntu
docker build -t t-a  study_days/docker/alpine

docker run --entrypoint /bin/sh -it t-a
docker run --entrypoint /bin/bash -it t-s

# tzdata 设置时区
dpkg-reconfigure tzdata
```