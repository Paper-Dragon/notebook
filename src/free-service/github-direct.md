---
title: GitHub加速下载
icon: fa-brands fa-github
breadcrumb: false
---

# GitHub加速下载

在Linux上下载GitHub文件太慢了，直接受不了。于是我做了一个用于加速 GitHub 文件下载速度的代理服务，旨在帮助用户更快地获取 GitHub 上的文件、Releases、archive、gist以及raw.githubusercontent.com 文件。通过我们的代理服务，您可以更快地下载这些文件，提高效率，节省时间。

- 地址： https://github.geekery.cn/

- 项目源码： https://github.com/Paper-Dragon/github-proxy

## 主要功能

- 加速 GitHub 文件下载
- 提供对 Releases 的加速访问
- 加速 archive 和 gist 的下载
- 优化 raw.githubusercontent.com 文件的下载速度
- 加速 https://codeload.github.com 的下载

## 如何使用

您只需将原始URL替换为我们代理服务的地址，即可享受到加速下载的便利。举个例子：


- 分支源码

  ```bash
  https://github.geekery.cn/https://github.com/user/project/archive/master.zip
  ```

  

- release源码

  ```bash
  https://github.geekery.cn/https://github.com/user/project/archive/v0.1.0.tar.gz
  ```

  

- release文件

  ```bash
  https://github.geekery.cn/https://github.com/user/project/releases/download/v0.1.0/example.zip
  ```

  

- 分支文件

  ```bash
  https://github.geekery.cn/https://github.com/user/project/blob/master/filename
  ```

  

- Raw

  ```bash
  https://github.geekery.cn/https://raw.githubusercontent.com/user/project/archive/master.zip
  ```

  

- 使用Git

  ```bash
  git clone https://github.geekery.cn/https://github.com/user/project
  ```

  


## 联系我们

如果您有任何问题或建议，请随时评论区联系我。仅供学习使用，非法使用必追究法律责任！