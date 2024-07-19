# Midjourney-proxy代理Midjourney的Discord频道

> 代理 Midjourney 的 Discord 频道，实现 API 形式调用 AI 。
>
> 这个作者一个小时更新一次Release，带着bug就更了，太着急哈哈哈哈。
>
> 找到一个文档版本在部署免得时间上的浪费。
>
> 已测试 v2.3.0 为不稳定版本，存在进度卡住的问题。

## 主要功能

支持 Imagine 指令和相关动作 [V1/V2.../U1/U2.../R]

 Imagine 时支持添加图片 base64，作为垫图

 支持 Blend (图片混合)、Describe (图生文) 指令

 支持任务实时进度

 支持中文 prompt 翻译，需配置百度翻译

 prompt 敏感词预检测，支持覆盖调整

 user-token 连接 wss，可以获取错误信息和完整功能

 支持 Shorten(prompt分析) 指令

 支持焦点移动：Pan ⬅️➡⬆️⬇️

 支持局部重绘：Vary (Region) 🖌

 支持几乎所有的关联按钮动作和 🎛️ Remix 模式

 支持图片变焦，自定义变焦 Zoom 🔍

 支持获取图片的 seed 值

 支持账号指定生成速度模式 RELAX | FAST | TURBO

 支持多账号配置，每个账号可设置对应的任务队列，支持账号选择模式 BestWaitIdle | Random | Weight | Polling

 账号池持久化，动态维护

 支持获取账号 /info、/settings 信息

 账号 settings 设置

 支持 niji・journey Bot 和 Midjourney Bot

 zlib-stream 安全压缩传输 https://discord.com/developers/docs/topics/gateway

 内嵌MJ管理后台页面，支持多语言 https://github.com/trueai-org/midjourney-proxy-webui

 支持MJ账号的增删改查功能

 支持MJ账号的详细信息查询和账号同步操作

 支持MJ账号的并发队列设置

 支持MJ的账号settings设置

 支持MJ的任务查询

 提供功能齐全的绘图测试页面

 兼容支持市面上主流绘图客户端和 API 调用。

## 在线预览

公益接口为慢速模式，接口免费调用，账号池由赞助者提供，请大家合理使用。

- 管理后台：https://ai.trueai.org
- 账号密码：`无`
- 公益接口：https://ai.trueai.org/mj
- 接口文档：https://ai.trueai.org/swagger
- 接口密钥：`无`

## 部署项目

```bash
# 阿里云镜像（推荐国内使用）
docker pull registry.cn-guangzhou.aliyuncs.com/trueai-org/midjourney-proxy

# 公益演示站点启动配置示例

# 1.下载并重命名配置文件（示例配置）
wget -O /root/mjopen/appsettings.Production.json https://raw.githubusercontent.com/trueai-org/midjourney-proxy/main/src/Midjourney.API/appsettings.json

# 或使用 curl 下载并重命名配置文件（示例配置）
curl -o /root/mjopen/appsettings.Production.json https://raw.githubusercontent.com/trueai-org/midjourney-proxy/main/src/Midjourney.API/appsettings.json

# 2.停止并移除旧的 Docker 容器
docker stop mjopen && docker rm mjopen

# 3.启动新的 Docker 容器
docker run --name mjopen -d --restart=always \
 -e DEMO=true \
 -p 8086:8080 --user root \
 -v /root/mjopen/logs:/app/logs:rw \
 -v /root/mjopen/data:/app/data:rw \
 -v /root/mjopen/appsettings.Production.json:/app/appsettings.Production.json:ro \
 -e TZ=Asia/Shanghai \
 -v /etc/localtime:/etc/localtime:ro \
 -v /etc/timezone:/etc/timezone:ro \
 registry.cn-guangzhou.aliyuncs.com/trueai-org/midjourney-proxy

# 生产环境启动配置示例
docker run --name mjproxy -d --restart=always \
 -p 8088:8080 --user root \
 -v /root/mjproxy/logs:/app/logs:rw \
 -v /root/mjproxy/data:/app/data:rw \
 -v /root/mjproxy/appsettings.Production.json:/app/appsettings.Production.json:ro \
 -e TZ=Asia/Shanghai \
 -v /etc/localtime:/etc/localtime:ro \
 -v /etc/timezone:/etc/timezone:ro \
 registry.cn-guangzhou.aliyuncs.com/trueai-org/midjourney-proxy
```

### 参数配置

appsettings.Production.json

```json
{
  "Demo": null, // 网站配置为演示模式
  "UserToken": "", // 用户绘画令牌 token，可以用来访问绘画接口，可以不用设定
  "AdminToken": "", // 管理后台令牌 token，可以用来访问绘画接口和管理员账号等功能
  "mj": {
    "AccountChooseRule": "BestWaitIdle", // BestWaitIdle | Random | Weight | Polling = 最佳空闲规则 | 随机 | 权重 | 轮询
    "Discord": { // Discord 配置，默认可以为 null
      "GuildId": "125652671***", // 服务器 ID
      "ChannelId": "12565267***", // 频道 ID
      "PrivateChannelId": "1256495659***", // MJ 私信频道 ID，用来接受 seed 值
      "NijiBotChannelId": "1261608644***", // NIJI 私信频道 ID，用来接受 seed 值
      "UserToken": "MTI1NjQ5N***", // 用户 token
      "BotToken": "MTI1NjUyODEy***", // 机器人 token
      "UserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      "Enable": true, // 是否默认启动
      "CoreSize": 3, // 并发数
      "QueueSize": 10, // 队列数
      "MaxQueueSize": 100, // 最大队列数
      "TimeoutMinutes": 5, // 任务超时分钟数
      "Mode": null, // RELAX | FAST | TURBO 指定生成速度模式 --fast, --relax, or --turbo parameter at the end.
      "Weight": 1 // 权重
    },
    "NgDiscord": { // NG Discord 配置，默认可以为 null
      "Server": "",
      "Cdn": "",
      "Wss": "",
      "ResumeWss": "",
      "UploadServer": ""
    },
    "Proxy": { // 代理配置，默认可以为 null
      "Host": "",
      "Port": 10809
    },
    "Accounts": [], // 账号池配置
    "BaiduTranslate": { // 百度翻译配置，默认可以为 null
      "Appid": "", // your_appid
      "AppSecret": "" // your_app_secret
    },
    "TranslateWay": "NULL", // NULL | GTP | BAIDU, 翻译配置, 默认: NULL
    "ApiSecret": "", // your_api_secret
    "NotifyHook": "", // your_notify_hook, 回调配置
    "NotifyPoolSize": 10
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Default": "Warning",
        "System": "Warning",
        "Microsoft": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "logs/log.txt",
          "rollingInterval": "Day",
          "fileSizeLimitBytes": null,
          "rollOnFileSizeLimit": false,
          "retainedFileCountLimit": 31
        }
      },
      {
        "Name": "Console"
      }
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "urls": "http://*:8080" // 默认端口
}
```

### 实际例子

[http://midjounery.v-chat.cc](http://midjounery.v-chat.cc)