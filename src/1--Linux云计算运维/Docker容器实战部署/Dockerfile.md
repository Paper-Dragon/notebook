## 一、什么是镜像？

镜像可以看成是由多个镜像层叠加起来的一个文件系统（通过UnionFS与AUFS文件联合系统实现），镜像层也可以简单理解为一个基本的镜像，而每个镜像层之间通过指针的形式进行叠加。

![1.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/29/1601374665130.png)

![2.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/29/1601374678766.png)

根据上图，镜像层的主要组成部分包括镜像层 ID、镜像层指针 「指向父层」、元数据「 Layer Metadata，包含了 Docker 构建和运行的信息和父层的层次信息」。只读层和读写层「Top Layer」的组成部分基本一致，同时读写层可以转换成只读层「 通过docker commit 操作实现」。

元数据（metadata）就是关于这个层的额外信息，它不仅能够让Docker获取运行和构建时的信息，还包括父层的层次信息。需要注意，只读层和读写层都包含元数据。

![3.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/29/1601374695966.png)

每一层都包括了一个指向父层的指针。如果一个层没有这个指针，说明它处于最底层。

![4.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/29/1601374711947.png)

在docker主机中镜像层（image layer）的元数据被保存在名为”json”的文件中，一个容器的元数据好像是被分成了很多文件，但或多或少能够在/var/lib/docker/containers/目录下找到，就是一个可读层的id。这个目录下的文件大多是运行时的数据，比如说网络，日志等等。

镜像是一堆只读层的统一视角，除了最底层没有指向外，每一层都指向它的父层。统一文件系统（ Union File System）技术能够将不同的层整合成一个文件系统，为这些层提供了一个统一的视角，这样就隐藏了多层的存在。在用户的角度看来，只存在一个文件系统。镜像每一层都是不可写的，都是只读层。

![5.png](https://www.zutuanxue.com:8000/static/media/images/2020/9/29/1601374727228.png)

我们可以看到镜像包含多个只读层，它们重叠在一起。除了最下面一层，其它层都会有一个指针指向下一层。这些层是Docker内部的实现细节，并且能够在docker主机的文件系统上访问到。统一文件系统（union file system，升级版为AUFS）技术能够将不同的层整合成一个文件系统，为这些层提供了一个统一的视角，这样就隐藏了多层的存在，在用户的角度看来，只存在一个文件系统。

## 二、什么是Dockerfile

Dockerfile 是由一系列命令和参数构成的脚本，这些命令应用于基础镜像并最终创建一个新的镜像。它们简化了从头到尾的流程并极大的简化了部署工作。Dockerfile 从 FROM 命令开始，紧接着跟随着各种方法，命令和参数。其产出为一个新的可以用于创建容器的镜像。

Dockerfile 语法由两部分构成，注释和命令+参数，注释是不能少的,因为明天可能就忘记写的是什么了。说白了, Dockerfile 是告诉 docker 怎么样制作一个镜像,就像我们写代码告诉应用怎么执行一条逻辑,这样应该好理解了，所以可以在 Dockerfile 中写明,我们需要怎么个执行方式的某个镜像,最后执行 docker build 命令构建写好的Dockerfile 成镜像。

## 三、 Dockerfile基础命令

### 3.1、 FROM：

功能为指定基础镜像，并且必须是第一条指令。

如果不以任何镜像为基础，写法为：FROM scratch。

同时意味着接下来所写的指令将作为镜像的第一层开始

语法：

FROM ![img]()

FROM ![img]():

其中 是可选项，如果没有选择，那么默认值为latest

### 3.2、 MAINTAINER

指定作者

语法：

MAINTAINER

### 3.3、 LABEL

功能是为镜像指定标签

语法：

LABEL = = = …

一个Dockerfile种可以有多个LABEL，如下：

```
LABEL "com.example.vendor"="ACME Incorporated"

LABEL com.example.label-with-value="foo"

LABEL version="1.0"

LABEL description="This text illustrates \
that label-values can span multiple lines."

但是并不建议这样写，最好就写成一行，如太长需要换行的话则使用\符号

如下：

LABEL multi.label1="value1" \
multi.label2="value2" \
other="value3"

注意：LABEL会继承基础镜像种的LABEL，如遇到key相同，则值覆盖
```

### 3.4、 RUN

功能为运行指定的命令

RUN命令有两种格式

RUN

RUN [“executable”, “param1”, “param2”]

第一种后边直接跟shell命令

在linux操作系统上默认 /bin/sh -c

第二种是类似于函数调用。

可将executable理解成为可执行文件，后面就是两个参数。

两种写法比对：

RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME

RUN ["/bin/bash", “-c”, “echo hello”]

注意：多行命令不要写多个RUN，原因是Dockerfile中每一个指令都会建立一层. RUN书写时的换行符是 \ 多少个RUN就构建了多少层镜像，会造成镜像的臃肿、多层，不仅仅增加了构件部署的时间，还容易出错。

### 3.5、 ADD

一个复制命令，把文件复制到镜像中

如果把虚拟机与容器想象成两台linux服务器的话，那么这个命令就类似于scp，只是scp需要加用户名和密码的权限验证，而ADD不用

```
语法如下：

ADD <src>... <dest>

<src>可以是一个本地文件或者是一个本地压缩文件，还可以是一个url
<dest>路径的填写可以是容器内的绝对路径，也可以是相对于工作目录的相对路径

ADD test1.txt test1.txt

ADD test1.txt test1.txt.bak

ADD test1.txt /mydir/

ADD data1 data1

ADD zip.tar /myzip

有如下注意事项：

1、如果源路径是个文件，且目标路径是以 / 结尾， 则docker会把目标路径当作一个目录，会把源文件拷贝到该目录下。如果目标路径不存在，则会自动创建目标路径。

2、如果源路径是个文件，且目标路径不是以 / 结尾，则docker会把目标路径当作一个文件。

3、如果目标路径不存在，会以目标路径为名创建一个文件，内容同源文件；

4、如果目标文件是个存在的文件，会用源文件覆盖它，当然只是内容覆盖，文件名还是目标文件名。

5、如果目标文件实际是个存在的目录，则会源文件拷贝到该目录下。 注意，这种情况下，最好显示的以 / 结尾，以避免混淆。

6、如果源路径是个目录，且目标路径不存在，则docker会自动以目标路径创建一个目录，把源路径目录下的文件拷贝进来。如果目标路径是个已经存在的目录，则docker会把源路径目录下的文件拷贝到该目录下。

7、如果源文件是个归档文件（压缩文件），则docker会自动帮解压。尽量不要把<scr>写成一个文件夹，如果<src>是一个文件夹了，复制整个目录的内容,包括文件系统元数据
```

### 3.6、COPY

复制命令

语法如下：

COPY …

COPY ["",… “”]

与ADD的区别, COPY的只能是本地文件，其他用法一致

### 3.7、 VOLUME

可实现挂载功能，可以将内地文件夹或者其他容器种得文件夹挂在到这个容器种

语法为：

VOLUME ["/data"]

说明：

["/data"]可以是一个JsonArray ，也可以是多个值。所以如下几种写法都是正确的

VOLUME ["/var/log/"]

VOLUME /var/log

VOLUME /var/log /var/db

一般的使用场景为需要持久化存储数据时, 容器使用的是AUFS，这种文件系统不能持久化数据，当容器关闭后，所有的更改都会丢失，所以当数据需要持久化时用这个命令。

### 3.8、 EXPOSE

功能为暴漏容器运行时的监听端口给外部

但是EXPOSE并不会使容器访问主机的端口

如果想使得容器与主机的端口有映射关系，必须在容器启动的时候加上 -P参数

### 3.9、 WORKDIR

设置工作目录

语法：

WORKDIR /usr/bin/

### 3.10、 ENV

功能为设置环境变量

语法有两种

ENV

ENV = …

两者的区别就是第一种是一次设置一个，第二种是一次设置多个

### 3.11、 CMD

功能为容器启动时要运行的命令

语法有三种写法

CMD [“executable”,“param1”,“param2”]

CMD [“param1”,“param2”]

CMD command param1 param2

第三种比较好理解了，就时shell这种执行方式和写法

第一种和第二种其实都是可执行文件加上参数的形式

举例说明两种写法：

CMD [ “sh”, “-c”, “echo $HOME”

CMD [ “echo”, “$HOME” ]

注意：

1、这里边包括参数的一定要用双引号，就是 " 不能是单引号, 原因是参数传递后，docker解析的是一个JSON Array

2、不要把RUN和CMD搞混了。

RUN：是构件容器时就运行的命令以及提交运行结果

CMD：是容器启动时执行的命令，在构件时并不运行

### 3.12、 ENTRYPOINT

功能是启动时的默认命令

语法如下：

ENTRYPOINT [“executable”, “param1”, “param2”]

ENTRYPOINT command param1 param2

如果从上到下看到这里的话，那么你应该对这两种语法很熟悉啦。

第一种就是可执行文件加参数

第二种就是写shell

```
与 CMD 比较说明：

相同点：

只能写一条，如果写了多条，那么只有最后一条生效，容器启动时才运行，运行时机相同

不同点：

ENTRYPOINT 不会被运行的 command 覆盖，而 CMD 则会被覆盖


如果我们在 Dockerfile 时同时写了 ENTRYPOINT 和 CMD ，并且 CMD 指令不是一个完整的可执行命令，那么CMD 指定的内容将会作为 ENTRYPOINT 的参数, 如下：

FROM centos
ENTRYPOINT ["top", "-b"]
CMD ["-c"]



如果我们在 Dockerfile 种同时写了 ENTRYPOINT 和 CMD ，并且 CMD 是一个完整的指令，那么它们两个会互相覆盖，谁在最后谁生效, 如下：

FROM centos
ENTRYPOINT ["top", "-b"]
CMD ls -al

那么将执行 ls -al , top -b 不会执行
```

## 四、 Dockerfile 案例

```
1、创建目录，用于存放 dockerfile 所使用的文件
2、在此目录中创建 dockerfile 文件
3、在此目录中使用 docker build 创建镜像
4、使用创建的镜像启动容器

准备启动文件：
vim httpd-run.sh
#!/bash
rm -rf /run/httpd/*
exec /usr/sbin/httpd -D FOREGROUND

准备网页测试文件
vim index.html
hello welcome to zutuanxue!!!

准备 dockerfile 文件

FROM centos:latest

MAINTAINER "zutuanxue admin@163.com" 

ADD httpd-run.sh /httpd-run.sh

ADD index.html /var/www/html/index.html

RUN yum -y install httpd && chmod -v +x /httpd-run.sh

EXPOSE 80

WORKDIR /

CMD ["/bin/bash","/httpd-run.sh"]

创建镜像：
docker build -t centos-httpd:v1 .

 -t: 镜像的名字及标签，通常 name:tag 或者 name 格式
#定义基础镜像 FROM
FROM centos
#定义作者 MAINTAINER
MAINTAINER BaiShuming

#上传文件到容器 COPY  or ADD
#COPY 从当前目录复制文件到容器. 只是单纯地复制文件. 格式为 COPY <src> <dest>。
#ADD 从当前目录复制文件到容器. 会自动处理目录, 压缩包等情况.格式为 ADD <src> <dest>。
ADD nginx-1.17.6.tar.gz /root


#生成镜像时运行的命令 RUN
#shell 写法
RUN yum -y install pcre-devel zlib-devel openssl lsof iproute net-tools gcc make
#exec写法
#["命令","命令选项","参数"]


#解压压缩文件
#RUN ["tar","xf","nginx-1.17.6.tar.gz"]

#创建管理用户www
RUN useradd -r -s/sbin/nologin -M www

#进入nginx源码文件WORKDIR
WORKDIR /root/nginx-1.17.6

#安装nginx
RUN ./configure --prefix=/usr/local/nginx --user=www --group=www && make && make install

#定义变量 ENV
ENV PATH /usr/local/nginx/sbin:$PATH

#业务初始化
#COPY 从当前目录复制文件到容器. 只是单纯地复制文件. 格式为 COPY <src> <dest>。
COPY nginx.conf /usr/local/nginx/conf
COPY index.html /usr/local/nginx/html

#输出端口 EXPOSE
EXPOSE 80

#挂载本地目录VOLUME
#创建一个可以从本地主机或其他容器挂载的挂载点
#一般用来存放数据库和需要保持同步的数据
VOLUME ["/data"]

#容器启动后执行的命令  CMD
#只能执行一个，如果有多个，同一时间只有最后一个生效
CMD ["nginx","-g","daemon off;"]
```