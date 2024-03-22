# Docker的Pull和Push

## docker pull

```bash
docker pull --help

Usage:  docker pull [OPTIONS] NAME[:TAG|@DIGEST]
  
  从注册表中拉取镜像或镜像仓库

选项：
   -a, --all-tags 下载存储库中所有标记的镜像
       --disable-content-trust 跳过镜像验证（默认为 true）
       --platform string 如果服务器支持多平台则设置平台
   -q, --quiet 抑制详细输出
```

### 并发下载

默认情况下，Docker守护程序将一次提取图像的三个层。 如果您使用的是低带宽连接，这可能会导致超时问题，您可能需要降低这个选项 `--max-concurrent-downloads` daemon 选项.请参阅 [daemon documentation](https://docs.docker.com/engine/reference/commandline/dockerd/) 获得更多信息.



## docker push

```bash
docker push --help

Usage:  docker push [OPTIONS] NAME[:TAG]

将镜像或存储库推送到注册表

选项：
   -a, --all-tags 将所有标记的镜像推送到存储库中
       --disable-content-trust 跳过镜像签名（默认为真）
   -q, --quiet 抑制详细输出



```

### 并发推送

默认情况下，Docker守护程序将一次推送图像的五个层。 如果您使用的是低带宽连接，这可能会导致超时问题，您可能需要降低 this via the `--max-concurrent-uploads` daemon option.请参阅 [daemon documentation](https://docs.docker.com/engine/reference/commandline/dockerd/) for more details.