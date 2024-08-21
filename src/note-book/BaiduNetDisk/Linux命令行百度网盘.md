# Linux命令行百度网盘

## bypy 简介

bypy 是一个基于 Python 的命令行工具，用于操作百度网盘（百度云），它为用户提供了丰富的命令行操作接口。bypy 适合在 Linux 服务器环境中使用，能够高效地进行大文件传输，支持多线程操作，具备上传、下载、同步等功能。

## 安装 bypy

要在 Linux 系统中安装 bypy，可以通过 pip（Python 包管理器）来实现：

```bash
pip install bypy
```

## 使用 bypy

## 登录配置

首次使用 bypy 之前，需要先进行配置。运行以下命令开始配置过程：

```bash
bypy -t
```

根据提示访问授权页面并获取授权码，然后将授权码输入到终端中完成配置。

## 命令

bypy 提供了多种操作命令，例如：

`quota`: 显示百度云存储配额信息。

`list`: 列出指定目录下的文件列表。

`upload`: 上传本地文件到百度云。

`download`: 从百度云下载文件到本地。

`syncup`: 将本地文件同步到百度云。

`syncdown`: 将百度云文件同步到本地。

`delete`: 删除百度云上的文件。

`makedir`: 在百度云上创建目录。

`move`: 移动百度云上的文件。

`copy`: 复制百度云上的文件。

`compare`: 比较本地和云文件的差异。

## 调试

添加 `-v` 参数，会显示进度详情。

添加 `-d`，会显示一些调试信息。

添加 `-ddd`，显示 HTTP 通讯信息。

## 使用示例

## 登录配置示例

```bash
(test) [user @ cloud 20:17:08 /mnt/data/]
$ bypy info
Please visit:
https://openapi.baidu.com/oauth/2.0/authorize?client_id=q8W
And authorize this app
Paste the Authorization Code here within 10 minutes.
Press [Enter] when you are done
c5c3085d143f880df0727d3f
Authorizing, please be patient, it may take upto 300 seconds...
Quota: 10.010TB
Used: 1.332TB
```

登录验证后会显示当前剩余存储空间和已用空间。

### 主要参数

```bash
bypy -h
```

此命令会显示所有可用的命令行参数及其描述。

**命令行参数解释**

| 参数                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `-h`, `--help`                  | 显示帮助信息。                                               |
| `-V`, `--version`               | 显示版本信息。                                               |
| `-d`, `--debug`                 | 设置调试级别。                                               |
| `-v`, `--verbose`               | 设置详细程度。                                               |
| `-r`, `--retry`                 | 网络错误时重试的次数。                                       |
| `-q`, `--quit-when-fail`        | 最大重试次数失败时退出。                                     |
| `-t`, `--timeout`               | 网络超时时间（秒）。                                         |
| `-s`, `--slice`                 | 文件上传切片大小。                                           |
| `--chunk`                       | 文件下载块大小。                                             |
| `-e`, `--verify`                | 验证上传/下载。                                              |
| `-f`, `--force-hash`            | 强制文件 MD5/CRC32 计算而不使用缓存值。                      |
| `--no-resume-download`          | 如果本地文件已经存在，则恢复而不是重新开始下载。             |
| `--include-regex`               | 要包括的文件的正则表达式。                                   |
| `--on-dup`                      | 在目标中存在相同的文件/文件夹时要执行的操作。                |
| `--no-symlink`                  | 上传/同步时不要跟随符号链接。                                |
| `--disable-ssl-check`           | 不要验证主机 SSL 证书。                                      |
| `--cacerts`                     | 指定 CA Bundle 的路径。                                      |
| `--mirror`                      | 指定 PCS 镜像。                                              |
| `--select-fastest-mirror`       | 让程序运行一些测试并选择它检测到的最快的 PCS 镜像。          |
| `--rapid-upload-only`           | 仅上传可以快速上传的大文件。                                 |
| `--resume-download-revert-back` | 恢复下载时至少回退 RCOUNT 下载块并对齐到块边界。负值表示不回退。 |
| `--move`                        | 在下载/上传/syncdown/syncup 成功后删除源文件/目录（这将强制验证文件）。 |
| `--processes`                   | 并行进程数。（仅适用于目录同步/下载/上传）。                 |
| `--downloader`                  | 要使用的下载程序（如果未指定，则使用 Python）。              |
| `--downloader-arguments`        | 下载程序的参数。                                             |
| `--config-dir`                  | 指定配置路径。                                               |
| `-c`, `--clean`                 | 删除令牌文件（需要重新认证）和上传进度文件。                 |

#### 上传文件

```bash
bypy upload /path/to/local/file /remote/path
```

#### 下载文件

```bash
bypy download /remote/path /path/to/local/file
```

#### 同步文件

```bash
bypy syncup /local/path /remote/path
bypy syncdown /remote/path /local/path
```

## 参考文档

```bash
https://blog.csdn.net/weixin_42232041/article/details/106816582
https://github.com/houtianze/bypy
https://developer.aliyun.com/article/1316132
```

