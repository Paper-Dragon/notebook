# 使用Docker部署minio



```bash
ENGINE=docker
MINIO_ROOT=/local_data/minio
${ENGINE} run \
    --name s3_minio \
    --restart always \
    -p 9005:9005 \
    -p 9006:9006 \
    -e "MINIO_ROOT_USER=shoulong.zhang" \
    -e "MINIO_ROOT_PASSWORD=Sz@20211217" \
    -v ${MINIO_ROOT}/data:/data \
    -v ${MINIO_ROOT}/config:/root/.minio \
    -d \
    minio/minio:RELEASE.2022-01-04T07-41-07Z server /data --console-address ":9006" --address ":9005"
    

```

# 官方说明文档

​    

```html
https://docs.min.io/docs/minio-server-configuration-guide.html
```