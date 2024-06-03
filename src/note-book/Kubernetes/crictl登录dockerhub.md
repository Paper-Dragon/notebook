# crictl登录dockerhub

因为kubernets更改了cri为containerd，docker login失效，所以需要用下面的方式去解决拉取镜像超过频率限制的问题。



## crictl手动命令拉取

手动拉取

```bash
crictl pull --creds jockerdragon:xxxxxxx  eipwork/kuboard:v3

--cert username[:password] 
```



## kubernetes配置账户

永久配置

```bash
kubectl create secret docker-registry shoulong-docker-secret \
	--docker-username=1xxxxxxx1 \
	--docker-password=mdxxxxxxxxx \
	--docker-email=xxxxxxxxx@qq.com \
	-n kuboard
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: your-dockerhub-username/your-image
  imagePullSecrets:
  - name: shoulong-docker-secret
```

