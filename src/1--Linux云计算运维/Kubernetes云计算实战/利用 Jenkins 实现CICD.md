## 一、什么是 CI/CD

持续集成（CI）与持续交付（CD）是软件开发和交付中的实践。

**什么是持续集成？**

软件开发中，集成是一个很可能发生未知错误的过程。持续集成是一种软件开发实践，希望团队中的成员频繁提交代码到代码仓库，且每次提交都能通过自动化测试进行验证，从而使问题尽早暴露和解决。

**持续集成的好处是什么？**

持续集成可以使问题尽早暴露，从而也降低了解决问题的难度，持续集成无法消除bug，但却能大大降低修复的难度和时间。

**什么是持续交付？**

持续交付是持续集成的扩展，指的是将通过自动化测试的软件部署到产品环境。持续交付的本质是把每个构建成功的应用更新交付给用户使用。

**持续交付的好处是什么？**

持续交付的好处在于快速获取用户反馈；适应市场变化和商业策略的变化。开发团队保证每次提交的修改都是可上线的修改，那么决定何时上线，上线哪部分功能则完全由产品业务团队决定。

## 二、环境准备

|     节点名称     |    IP地址     | 资源配置 |
| :--------------: | :-----------: | :------: |
| zutuanxue-master | 192.168.1.160 |   4U4G   |
| zutuanxue-node-1 | 192.168.1.161 |   2U4G   |
| zutuanxue-node-2 | 192.168.1.162 |   2U4G   |
| zutuanxue-gitlab | 192.168.1.168 |   4U4G   |
|  zutuanxue-nfs   | 192.168.1.169 |   2U2G   |
| zutuanxue-harbor | 192.168.1.240 |   2U2G   |

```
Master 节点配置 ：

安装 Java ：

yum -y install java-1.8.0-*

java -version

openjdk version "1.8.0_252"
OpenJDK Runtime Environment (build 1.8.0_252-b09)
OpenJDK 64-Bit Server VM (build 25.252-b09, mixed mode)


安装 maven ：

官方下载地址： http://maven.apache.org/download.cgi

wget https://mirror.bit.edu.cn/apache/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz

tar -xf  apache-maven-3.6.3-bin.tar.gz

mv -f apache-maven-3.6.3 /usr/local/

编辑 /etc/profile ，在文件末尾添加如下代码：

export MAVEN_HOME=/usr/local/apache-maven-3.6.3
export PATH=${PATH}:${MAVEN_HOME}/bin

保存文件，并运行如下命令使环境变量生效： source /etc/profile

mvn -v

Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: /usr/local/apache-maven-3.6.3
Java version: 1.8.0_252, vendor: Oracle Corporation, runtime: /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.252.b09-3.el8_2.x86_64/jre
Default locale: en_US, platform encoding: ANSI_X3.4-1968
OS name: "linux", version: "4.18.0-147.8.1.el8_1.x86_64", arch: "amd64", family: "unix"


安装 jenkins ：

官方网站：https://www.jenkins.io/zh/

wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war

nohup java -jar jenkins.war --httpPort=8080 > myout.file 2>&1 &

打开浏览器进入链接 http://IP:8080

根据浏览器提示完成后续安装

cat /root/.jenkins/secrets/initialAdminPassword

e8ec34c745064620a3f88ced0b522692
```

![12.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490364054.png)

![13.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490661759.png)

![14.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490383882.png)

![15.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490393305.png)

![16.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490695223.png)

![17.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490407199.png)

![18.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490413548.png)

![19.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/12/1602490706017.png)

## 三、流水线示例

```
jenkins 流水线代码：

node {
    env.BUILD_DIR = "/opt/build-work/"
    env.HOST = "aaa.zutuanxue.com"
   stage('Preparation') { // for display purposes
      // Get some code from a GitHub repository
      git 'http://192.168.1.168/root/spring-web.git'
   }
   stage('Maven Build') {
      // Run the maven build
      sh "mvn  package"
   }
   stage('Build Image') {
      sh "/opt/jenkins/script/build-image-web.sh"
   }
   stage('Deploy') {
       sh "/opt/jenkins/script/deploy.sh"
   }
}

-------------------------------------------------------------------
说明：

node {
    env.BUILD_DIR = "/opt/build-work/"  定义build的工作目录
    env.HOST = "aaa.zutuanxue.com"    	定义 ingress 的域名

  下载我们需要的代码：
  
   stage('Preparation') { // for display purposes
      // Get some code from a GitHub repository
      git 'http://192.168.1.168/root/spring-web.git'
   }

  通过 maven 工具进行构建：
  
   stage('Maven Build') {
      // Run the maven build
      sh "mvn package"
   }

   通过脚本构建我们需要的镜像：
   
   stage('Build Image') {
      sh "/opt/jenkins/script/build-image-web.sh"
   }

  通过脚本在k8s集群内部署我们的业务：
  
   stage('Deploy') {
       sh "/opt/jenkins/script/deploy.sh"
   }
}
build 脚本：

#!/bin/bash

#先判断一下我们 build 的工作目录是否存在，如果不存的话，那么就去创建对应的目录
if [ "${BUILD_DIR}" == "" ];then
    echo "env 'BUILD_DIR' There is no such directory"
    exit 1
fi

DOCKER_DIR=${BUILD_DIR}/${JOB_NAME}

if [ ! -d ${DOCKER_DIR} ];then
    mkdir -p ${DOCKER_DIR}
fi

# jenkins 的工作空间下的哪一个项目目录
JENKINS_DIR=${WORKSPACE}/

#进入我们 build 的工作目录，清除不需要的文件，将我们要用到的文件移动过来
cd ${DOCKER_DIR}
rm -rf *
mv ${JENKINS_DIR}/target ${DOCKER_DIR}
mv ${JENKINS_DIR}/dockerfile ${DOCKER_DIR}

#以当前的时间当做我们镜像的版本号
VERSION=$(date +%Y%m%d%H%M%S)
#定义我们镜像的名称：harbor地址/仓库项目名称/镜像项目名称：版本号
IMAGE_NAME=www.zutuanxue.com.cn/library/${JOB_NAME}:${VERSION}
#将构建的镜像名称输入到文件，方便部署的时候进行调用
echo "${IMAGE_NAME}" > ${WORKSPACE}/IMAGE
#构建镜像
docker build -t ${IMAGE_NAME} .
#上传镜像到 harbor
docker push ${IMAGE_NAME}
k8s 部署脚本：

#!/bin/bash

name=${JOB_NAME}
image=$(cat ${WORKSPACE}/IMAGE)
host=${HOST}

cd /opt/jenkins/script/template/

echo "deploying ... name: ${name}, image: ${image}, host: ${host}"

sed -i "s,{{name}},${name},g" web.yaml
sed -i "s,{{image}},${image},g" web.yaml
sed -i "s,{{host}},${host},g" web.yaml
echo "ready to apply"
kubectl apply -f web.yaml
# yaml 模板文件：

apiVersion: v1
kind: Service
metadata:
  name: {{name}}
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: {{name}}
  type: ClusterIP
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: {{name}}
spec:
  rules:
  - host: {{host}}
    http:
      paths:
      - path: /
        backend:
          serviceName: {{name}}
          servicePort: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{name}}
spec:
  selector:
    matchLabels:
      app: {{name}}
  replicas: 1
  template:
    metadata:
      labels:
        app: {{name}}
    spec:
      containers:
      - name: {{name}}
        image: {{image}}
        ports:
        - containerPort: 8080
```