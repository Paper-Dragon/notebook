# Ubuntu安装OpenResty教程

> 参考链接： https://blog.openresty.com.cn/cn/ubuntu20-or-install/
>
> 适合于Ubuntu各个版本，并非只有20.04。都可以被成功an'z

今天我想演示一下如何通过 `apt-get` 在 Ubuntu 20.04 上安装 OpenResty 。

 ![截图 1](apt安装OpenResty教程.assets/screen1.jpg) 

我们将在这个视频中使用这个全新安装的 Ubuntu 20.04 。

我们可以到 [openresty.org 网站](http://openresty.org/cn/linux-packages.html#ubuntu)上找到相关的说明，这里可以找到所有启用 APT 仓库和安装 OpenResty Deb 包的命令。

![截图 3](apt安装OpenResty教程.assets/screen3.jpg) 

回到我们的 Ubuntu 20.04 系统。如果你已经有服务监听本地 80 端口，那么你应该先禁用它。

```bash
sudo lsof -i:80
```

![截图 4](apt安装OpenResty教程.assets/screen4.jpg) 



在这里，我们没有任何这样的服务。

首先，要确保系统时间正确。

```bash
sudo ntpdate -v time.google.com
```

![截图 6](apt安装OpenResty教程.assets/screen6.jpg) 



你可能想在这里使用你附近的其他 NTP 服务器。

我们应该通过添加 GPG 公钥来安装一些需要的组件。这些可以在之后删除。

```bash
sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates
```





![截图 8](apt安装OpenResty教程.assets/screen8.jpg) 

然后导入我们的 GPG 密钥。

```bash
wget -O - https://openresty.org/package/pubkey.gpg | sudo apt-key add -
```





![截图 9](apt安装OpenResty教程.assets/screen9.jpg) 



接着添加我们的官方 APT 库。

```bash
echo "deb http://openresty.org/package/ubuntu $(lsb_release -sc) main" > openresty.list
sudo cp openresty.list /etc/apt/sources.list.d/
```





 ![截图 10](apt安装OpenResty教程.assets/screen10.jpg) 



请注意，这是针对 `x86_64` 或 `amd64` 系统的。

对于 Aarch64 或 ARM64 系统，你应该使用这个 URL 来代替。

```bash
echo "deb http://openresty.org/package/arm64/ubuntu $(lsb_release -sc) main"
```





![截图 12](apt安装OpenResty教程.assets/screen12.jpg) 

现在更新 APT 索引。

```bash
sudo apt-get update
```





![截图 13](apt安装OpenResty教程.assets/screen13.jpg) 

请注意，这里我们需要 `sudo`。

现在是时候安装我们的主要 RPM 包，`openresty`。

```bash
sudo apt-get -y install --no-install-recommends openresty
```





![截图 15](apt安装OpenResty教程.assets/screen15.jpg) 



检查 `openresty` 可执行文件是否可用。

```bash
which openresty
```





![截图 16](apt安装OpenResty教程.assets/screen16.jpg)



这个 `openresty` 可执行文件只是一个符号链接。

```bash
file `which openresty`
```





![截图 17](apt安装OpenResty教程.assets/screen17.jpg)



并检查其版本。

```bash
openresty -V
```





![截图 18](apt安装OpenResty教程.assets/screen18.jpg)



我们可以像这样启动默认的 openresty 服务。

```bash
sudo systemctl start openresty
```





![截图 19](apt安装OpenResty教程.assets/screen19.jpg)



检查 nginx 进程是否启动并运行。

```bash
ps aux|grep nginx
```





![截图 20](apt安装OpenResty教程.assets/screen20.jpg)



完美。

用 `curl` 命令测试默认主页。

```bash
curl 127.0.0.1/
```





![截图 22](apt安装OpenResty教程.assets/screen22.jpg)



是的，它的工作。

但请注意，resty 命令行工具还没有安装。

```bash
which resty
```





![截图 24](apt安装OpenResty教程.assets/screen24.jpg)



如果你想要它，那么你可以从同一个仓库安装 `openresty-resty` RPM 包。

```bash
sudo apt-get -y install openresty-resty
```





![截图 25](apt安装OpenResty教程.assets/screen25.jpg)



现在应该可以了。

```bash
which resty
resty -e 'print("Hello Resty")'
```





![截图 26](apt安装OpenResty教程.assets/screen26.jpg)



同样，如果你想使用 `restydoc` 命令行工具，你应该安装 `openresty-doc` 包。

```bash
sudo apt-get -y install openresty-restydoc
```





![截图 27](apt安装OpenResty教程.assets/screen27.jpg)



现在也有了。

```bash
restydoc -s content_by_lua_file
```





![截图 28](apt安装OpenResty教程.assets/screen28.jpg)



我们也可以安装 OPM 来安装更多由 OpenResty 社区贡献的 Lua 模块。

```bash
sudo apt-get -y install openresty-opm
```





![截图 29](apt安装OpenResty教程.assets/screen29.jpg)



现在可以尝试安装 James Hurst 编写的 `lua-resty-http` 库。

```bash
sudo opm get pintsized/lua-resty-http
```





![截图 30](apt安装OpenResty教程.assets/screen30.jpg)



试着用 `resty` 工具加载它。

```bash
resty -e 'require "resty.http"'
```





![截图 31](apt安装OpenResty教程.assets/screen31.jpg)



成功了！

还有一个 OpenResty 的调试构建，其中包括调试日志和所有启用的内部断言。

```bash
sudo apt-get -y install openresty-debug
```





![截图 33](apt安装OpenResty教程.assets/screen33.jpg)



我们可以这样调用这个调试版的 openresty 。

```bash
which openresty-debug
```

这个 `openresty-debug` 可执行文件也是一个符号链接。

```bash
file `which openresty-debug`
```





![截图 35](apt安装OpenResty教程.assets/screen35.jpg)



我们不应该在生产中使用它，因为它比发行版慢得多。

此外，还有可以通过 Valgrind 检查内存问题的特殊构建。

```bash
sudo apt list openresty-valgrind
```





![截图 37](apt安装OpenResty教程.assets/screen37.jpg)



当你有内存问题要调试时，可以试试这些。我们可能会在以后的教程中涉及这些内容。

要将 OpenResty 包升级到最新版本，只需运行这些命令。

```bash
sudo apt-get update
sudo apt-get --only-upgrade -y install 'openresty*'
```





![截图 39](apt安装OpenResty教程.assets/screen39.jpg)



检查我们 openresty 仓库中所有可用的软件包。

```bash
apt list 'openresty*' | less
```





![截图 40](apt安装OpenResty教程.assets/screen40.jpg)



这里有很多二进制包。

可以在网页上找到所有这些 Deb 包的详细文档，https://openresty.org/en/deb-packages.html ，有很多软件包供用户选择。





![截图 42](apt安装OpenResty教程.assets/screen42.jpg)



