## 一、elasticsearch-head介绍

elasticsearch-head是 ES集群管理、索引数据可视化、增删改查、查询语句可视化 工具。

ES集群管理 ES集群上的数据索引管理和查询 查看索引中的某条数据

从ES5版本后安装方式和ES2以上的版本有很大的不同,在ES2中可以直接在bin目录下执行plugin install xxxx 来进行安装,但是在ES5中这种安装方式变了,要想在ES5中安装Elasticsearch Head必须要安装NodeJs,然后通过NodeJS来启动Head。

**官网下载地址**:https://github.com/mobz/elasticsearch-head

**安装机器**:node1 集群机器，生产环境下建议两台或多天进行容灾

安装方法：

- nodejs
- es-head

## 二、elasticsearch-head部署

### 2.1、安装依赖包-node.js

a、下载软件包

```
[root@node1 ~]# wget https://nodejs.org/dist/v13.8.0/node-v13.8.0-linux-x64.tar.xz
```

b、安装node.js

```
[root@node1 ~]# tar xf node-v13.8.0-linux-x64.tar.xz 
[root@node1 ~]# mv node-v13.8.0-linux-x64 /usr/local/nodejs

#可以看出是免安装版的软件
[root@node1 ~]# cd /usr/local/nodejs/
[root@node1 nodejs]# ls
bin  CHANGELOG.md  include  lib  LICENSE  README.md  share

#链接命令
[root@node1 nodejs]# ln -sf /usr/local/nodejs/bin/* /usr/local/bin/

#验证链接，确保正确
[root@node1 nodejs]# ll /usr/local/bin/node
lrwxrwxrwx 1 root root 26 2月  14 12:01 /usr/local/bin/node -> /usr/local/nodejs/bin/node
[root@node1 nodejs]# ll /usr/local/bin/npm 
lrwxrwxrwx 1 root root 25 2月  14 12:01 /usr/local/bin/npm -> /usr/local/nodejs/bin/npm

#验证node版本
[root@node1 nodejs]# node -v
v13.8.0

#升级npm为最新,npm是 Node.js 的包管理器，类似于yum
[root@node1 nodejs]# npm update -g npm
/usr/local/nodejs/bin/npm -> /usr/local/nodejs/lib/node_modules/npm/bin/npm-cli.js
/usr/local/nodejs/bin/npx -> /usr/local/nodejs/lib/node_modules/npm/bin/npx-cli.js
+ npm@6.13.7
added 7 packages from 3 contributors, removed 3 packages and updated 11 packages in 7.6s
```

### 2.2、elasticsearch-head部署

es-head是基于nodejs开发的一个前端网站

官网有安装说明,可以通过git安装,也可以下载zip包解压安装

这里去下载相应的软件包,并拷贝到ES集群的一个节点上(我这里拷贝到192.168.98.202这台,也就是node2上)

a、下载ES-head

```
[root@node1 ~]# git clone git://github.com/mobz/elasticsearch-head.git
正克隆到 'elasticsearch-head'...
remote: Enumerating objects: 77, done.
remote: Counting objects: 100% (77/77), done.
remote: Compressing objects: 100% (57/57), done.
remote: Total 4337 (delta 38), reused 46 (delta 17), pack-reused 4260
接收对象中: 100% (4337/4337), 2.51 MiB | 26.00 KiB/s, 完成.
处理 delta 中: 100% (2411/2411), 完成.
```

b、安装es-head

```
安装grunt服务
#grunt作为一个前端构建工具，有资源压缩，代码检查，文件合并等功能。
#构建nodejs代码 es-head并发布代码
[root@node1 ~]# cd elasticsearch-head/
[root@node1 elasticsearch-head]# npm install -g grunt-cli
/usr/local/nodejs/bin/grunt -> /usr/local/nodejs/lib/node_modules/grunt-cli/bin/grunt
+ grunt-cli@1.3.2
added 150 packages from 121 contributors in 32.255s
```

c、安装插件

```
[root@node1 elasticsearch-head]# npm install
#安装不成功的插件，手动在单独安装一下，依赖存在源码根目录package.json文件中
npm WARN deprecated http2@3.3.7: Use the built-in module in node 9.0.0 or newer, instead
npm WARN deprecated coffee-script@1.10.0: CoffeeScript on NPM has moved to "coffeescript" (no hyphen)
npm WARN deprecated core-js@2.6.11: core-js@<3 is no longer maintained and not recommended for usage due to the number of issues. Please, upgrade your dependencies to the actual version of core-js@3.
npm WARN deprecated phantomjs-prebuilt@2.1.16: this package is now deprecated
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated json3@3.3.2: Please use the native JSON object instead of JSON 3
npm WARN deprecated json3@3.2.6: Please use the native JSON object instead of JSON 3

> phantomjs-prebuilt@2.1.16 install /root/elasticsearch-head/node_modules/phantomjs-prebuilt
> node install.js

PhantomJS not found on PATH
Downloading https://github.com/Medium/phantomjs/releases/download/v2.1.1/phantomjs-2.1.1-linux-x86_64.tar.bz2
Saving to /tmp/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2
Receiving...
  [==================================------] 84%
Received 22866K total.
Extracting tar contents (via spawned process)
Removing /root/elasticsearch-head/node_modules/phantomjs-prebuilt/lib/phantom
Copying extracted folder /tmp/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2-extract-1581725015606/phantomjs-2.1.1-linux-x86_64 -> /root/elasticsearch-head/node_modules/phantomjs-prebuilt/lib/phantom
Phantom installation failed [Error: EACCES: permission denied, link '/tmp/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2-extract-1581725015606/phantomjs-2.1.1-linux-x86_64' -> '/root/elasticsearch-head/node_modules/phantomjs-prebuilt/lib/phantom'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'link',
  path: '/tmp/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2-extract-1581725015606/phantomjs-2.1.1-linux-x86_64',
  dest: '/root/elasticsearch-head/node_modules/phantomjs-prebuilt/lib/phantom'
} Error: EACCES: permission denied, link '/tmp/phantomjs/phantomjs-2.1.1-linux-x86_64.tar.bz2-extract-1581725015606/phantomjs-2.1.1-linux-x86_64' -> '/root/elasticsearch-head/node_modules/phantomjs-prebuilt/lib/phantom'
npm WARN notsup Unsupported engine for karma@1.3.0: wanted: {"node":"0.10 || 0.12 || 4 || 5 || 6"} (current: {"node":"13.8.0","npm":"6.13.6"})
npm WARN notsup Not compatible with your version of node/npm: karma@1.3.0
npm WARN notsup Unsupported engine for http2@3.3.7: wanted: {"node":">=0.12.0 <9.0.0"} (current: {"node":"13.8.0","npm":"6.13.6"})
npm WARN notsup Not compatible with your version of node/npm: http2@3.3.7
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@^1.0.0 (node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.11: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN elasticsearch-head@0.0.0 license should be a valid SPDX license expression
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: abbrev@1.1.1 (node_modules/fsevents/node_modules/abbrev):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/abbrev' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.abbrev.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: ansi-regex@2.1.1 (node_modules/fsevents/node_modules/ansi-regex):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/ansi-regex' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.ansi-regex.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: aproba@1.2.0 (node_modules/fsevents/node_modules/aproba):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/aproba' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.aproba.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: balanced-match@1.0.0 (node_modules/fsevents/node_modules/balanced-match):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/balanced-match' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.balanced-match.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: chownr@1.1.3 (node_modules/fsevents/node_modules/chownr):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/chownr' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.chownr.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: code-point-at@1.1.0 (node_modules/fsevents/node_modules/code-point-at):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/code-point-at' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.code-point-at.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: concat-map@0.0.1 (node_modules/fsevents/node_modules/concat-map):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/concat-map' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.concat-map.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: console-control-strings@1.1.0 (node_modules/fsevents/node_modules/console-control-strings):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/console-control-strings' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.console-control-strings.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: core-util-is@1.0.2 (node_modules/fsevents/node_modules/core-util-is):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/core-util-is' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.core-util-is.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: deep-extend@0.6.0 (node_modules/fsevents/node_modules/deep-extend):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/deep-extend' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.deep-extend.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: delegates@1.0.0 (node_modules/fsevents/node_modules/delegates):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/delegates' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.delegates.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: detect-libc@1.0.3 (node_modules/fsevents/node_modules/detect-libc):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/detect-libc' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.detect-libc.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fs.realpath@1.0.0 (node_modules/fsevents/node_modules/fs.realpath):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/fs.realpath' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.fs.realpath.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: has-unicode@2.0.1 (node_modules/fsevents/node_modules/has-unicode):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/has-unicode' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.has-unicode.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: inherits@2.0.4 (node_modules/fsevents/node_modules/inherits):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/inherits' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.inherits.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: ini@1.3.5 (node_modules/fsevents/node_modules/ini):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/ini' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.ini.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: isarray@1.0.0 (node_modules/fsevents/node_modules/isarray):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/isarray' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.isarray.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: minimist@0.0.8 (node_modules/fsevents/node_modules/minimist):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/minimist' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.minimist.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: ms@2.1.2 (node_modules/fsevents/node_modules/ms):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/ms' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.ms.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: npm-normalize-package-bin@1.0.1 (node_modules/fsevents/node_modules/npm-normalize-package-bin):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/npm-normalize-package-bin' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.npm-normalize-package-bin.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: number-is-nan@1.0.1 (node_modules/fsevents/node_modules/number-is-nan):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/number-is-nan' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.number-is-nan.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: object-assign@4.1.1 (node_modules/fsevents/node_modules/object-assign):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/object-assign' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.object-assign.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: os-homedir@1.0.2 (node_modules/fsevents/node_modules/os-homedir):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/os-homedir' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.os-homedir.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: os-tmpdir@1.0.2 (node_modules/fsevents/node_modules/os-tmpdir):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/os-tmpdir' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.os-tmpdir.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: path-is-absolute@1.0.1 (node_modules/fsevents/node_modules/path-is-absolute):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/path-is-absolute' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.path-is-absolute.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: process-nextick-args@2.0.1 (node_modules/fsevents/node_modules/process-nextick-args):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/process-nextick-args' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.process-nextick-args.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: minimist@1.2.0 (node_modules/fsevents/node_modules/rc/node_modules/minimist):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/rc/node_modules/minimist' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/rc/node_modules/.minimist.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: safe-buffer@5.1.2 (node_modules/fsevents/node_modules/safe-buffer):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/safe-buffer' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.safe-buffer.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: safer-buffer@2.1.2 (node_modules/fsevents/node_modules/safer-buffer):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/safer-buffer' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.safer-buffer.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: sax@1.2.4 (node_modules/fsevents/node_modules/sax):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/sax' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.sax.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: semver@5.7.1 (node_modules/fsevents/node_modules/semver):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/semver' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.semver.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: set-blocking@2.0.0 (node_modules/fsevents/node_modules/set-blocking):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/set-blocking' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.set-blocking.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: signal-exit@3.0.2 (node_modules/fsevents/node_modules/signal-exit):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/signal-exit' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.signal-exit.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: strip-json-comments@2.0.1 (node_modules/fsevents/node_modules/strip-json-comments):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/strip-json-comments' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.strip-json-comments.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: util-deprecate@1.0.2 (node_modules/fsevents/node_modules/util-deprecate):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/util-deprecate' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.util-deprecate.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: wrappy@1.0.2 (node_modules/fsevents/node_modules/wrappy):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/wrappy' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.wrappy.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: yallist@3.1.1 (node_modules/fsevents/node_modules/yallist):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/root/elasticsearch-head/node_modules/fsevents/node_modules/yallist' -> '/root/elasticsearch-head/node_modules/fsevents/node_modules/.yallist.DELETE'

#报错
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! phantomjs-prebuilt@2.1.16 install: `node install.js`
npm ERR! Exit status 1
npm ERR!    #phantomjs-prebuilt@2.1.16 install script  安装脚本失败
npm ERR! Failed at the phantomjs-prebuilt@2.1.16 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /root/.npm/_logs/2020-02-14T23_45_53_948Z-debug.log

#收到安装一下，忽略脚本
[root@node1 elasticsearch-head]# npm install phantomjs-prebuilt@2.1.16 --ignore-script
npm WARN deprecated phantomjs-prebuilt@2.1.16: this package is now deprecated
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@^1.0.0 (node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.11: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN elasticsearch-head@0.0.0 license should be a valid SPDX license expression
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: abbrev@1.1.1 (node_modules/chokidar/node_modules/fsevents/node_modules/abbrev):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/abbrev' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.abbrev.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: ansi-regex@2.1.1 (node_modules/chokidar/node_modules/fsevents/node_modules/ansi-regex):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/ansi-regex' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.ansi-regex.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: aproba@1.2.0 (node_modules/chokidar/node_modules/fsevents/node_modules/aproba):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/aproba' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.aproba.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: balanced-match@1.0.0 (node_modules/chokidar/node_modules/fsevents/node_modules/balanced-match):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/balanced-match' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.balanced-match.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: chownr@1.1.3 (node_modules/chokidar/node_modules/fsevents/node_modules/chownr):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/chownr' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.chownr.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: code-point-at@1.1.0 (node_modules/chokidar/node_modules/fsevents/node_modules/code-point-at):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/code-point-at' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.code-point-at.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: concat-map@0.0.1 (node_modules/chokidar/node_modules/fsevents/node_modules/concat-map):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/concat-map' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.concat-map.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: console-control-strings@1.1.0 (node_modules/chokidar/node_modules/fsevents/node_modules/console-control-strings):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/console-control-strings' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.console-control-strings.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: core-util-is@1.0.2 (node_modules/chokidar/node_modules/fsevents/node_modules/core-util-is):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/core-util-is' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.core-util-is.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: deep-extend@0.6.0 (node_modules/chokidar/node_modules/fsevents/node_modules/deep-extend):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/deep-extend' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.deep-extend.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: delegates@1.0.0 (node_modules/chokidar/node_modules/fsevents/node_modules/delegates):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/delegates' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.delegates.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: detect-libc@1.0.3 (node_modules/chokidar/node_modules/fsevents/node_modules/detect-libc):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/detect-libc' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.detect-libc.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fs.realpath@1.0.0 (node_modules/chokidar/node_modules/fsevents/node_modules/fs.realpath):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/fs.realpath' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.fs.realpath.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: has-unicode@2.0.1 (node_modules/chokidar/node_modules/fsevents/node_modules/has-unicode):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/has-unicode' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.has-unicode.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: inherits@2.0.4 (node_modules/chokidar/node_modules/fsevents/node_modules/inherits):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/inherits' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.inherits.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: ini@1.3.5 (node_modules/chokidar/node_modules/fsevents/node_modules/ini):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/ini' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.ini.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: isarray@1.0.0 (node_modules/chokidar/node_modules/fsevents/node_modules/isarray):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/isarray' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.isarray.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: minimist@0.0.8 (node_modules/chokidar/node_modules/fsevents/node_modules/minimist):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/minimist' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.minimist.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: ms@2.1.2 (node_modules/chokidar/node_modules/fsevents/node_modules/ms):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/ms' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.ms.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: npm-normalize-package-bin@1.0.1 (node_modules/chokidar/node_modules/fsevents/node_modules/npm-normalize-package-bin):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/npm-normalize-package-bin' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.npm-normalize-package-bin.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: number-is-nan@1.0.1 (node_modules/chokidar/node_modules/fsevents/node_modules/number-is-nan):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/number-is-nan' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.number-is-nan.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: object-assign@4.1.1 (node_modules/chokidar/node_modules/fsevents/node_modules/object-assign):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/object-assign' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.object-assign.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: os-homedir@1.0.2 (node_modules/chokidar/node_modules/fsevents/node_modules/os-homedir):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/os-homedir' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.os-homedir.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: os-tmpdir@1.0.2 (node_modules/chokidar/node_modules/fsevents/node_modules/os-tmpdir):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/os-tmpdir' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.os-tmpdir.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: path-is-absolute@1.0.1 (node_modules/chokidar/node_modules/fsevents/node_modules/path-is-absolute):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/path-is-absolute' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.path-is-absolute.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: process-nextick-args@2.0.1 (node_modules/chokidar/node_modules/fsevents/node_modules/process-nextick-args):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/process-nextick-args' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.process-nextick-args.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: minimist@1.2.0 (node_modules/chokidar/node_modules/fsevents/node_modules/rc/node_modules/minimist):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/rc/node_modules/minimist' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/rc/node_modules/.minimist.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: safe-buffer@5.1.2 (node_modules/chokidar/node_modules/fsevents/node_modules/safe-buffer):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/safe-buffer' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.safe-buffer.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: safer-buffer@2.1.2 (node_modules/chokidar/node_modules/fsevents/node_modules/safer-buffer):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/safer-buffer' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.safer-buffer.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: sax@1.2.4 (node_modules/chokidar/node_modules/fsevents/node_modules/sax):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/sax' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.sax.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: semver@5.7.1 (node_modules/chokidar/node_modules/fsevents/node_modules/semver):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/semver' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.semver.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: set-blocking@2.0.0 (node_modules/chokidar/node_modules/fsevents/node_modules/set-blocking):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/set-blocking' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.set-blocking.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: signal-exit@3.0.2 (node_modules/chokidar/node_modules/fsevents/node_modules/signal-exit):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/signal-exit' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.signal-exit.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: strip-json-comments@2.0.1 (node_modules/chokidar/node_modules/fsevents/node_modules/strip-json-comments):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/strip-json-comments' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.strip-json-comments.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: util-deprecate@1.0.2 (node_modules/chokidar/node_modules/fsevents/node_modules/util-deprecate):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/util-deprecate' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.util-deprecate.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: wrappy@1.0.2 (node_modules/chokidar/node_modules/fsevents/node_modules/wrappy):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/wrappy' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.wrappy.DELETE'
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: yallist@3.1.1 (node_modules/chokidar/node_modules/fsevents/node_modules/yallist):
npm WARN enoent SKIPPING OPTIONAL DEPENDENCY: ENOENT: no such file or directory, rename '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/yallist' -> '/usr/local/elasticsearch-head/node_modules/chokidar/node_modules/fsevents/node_modules/.yallist.DELETE'

+ phantomjs-prebuilt@2.1.16
added 61 packages from 63 contributors, removed 6 packages and audited 1736 packages in 10.371s

3 packages are looking for funding
  run `npm fund` for details

found 40 vulnerabilities (18 low, 2 moderate, 20 high)
  run `npm audit fix` to fix them, or `npm audit` for details
  
#安装完成，后台grunt启动，发布ES-head 前端web
[root@node1 elasticsearch-head]# nohup npm run start &
[1] 38691
[root@node1 elasticsearch-head]# nohup: 忽略输入并把输出追加到'nohup.out'

[root@node1 elasticsearch-head]# jobs
[1]+  运行中               nohup npm run start &
```

**测试es-head发布**

```
[root@node1 ~]# netstat -ntpl
```

![07_grunt_启动验证.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601975985832.png)

web测试

```
浏览器中输入：http://192.168.98.201:9100/
```

![08_grunt_web启动验证.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601975973100.png)

**FAQ：连接失败解决方法**

ES安装成功后，从另外一个域的浏览器访问ES服务器数据，会出现跨域的问题。

**解决方案**

1）修改elasticsearch.yml末尾添加：跨域访问

```
跨域访问
http.cors.enabled: true
http.cors.allow-origin: "*"
```

2）重启elasticsearch服务

```
[root@node1 ~]# systemctl restart elasticsearch
```

再次测试

![09_grunt_web启动验证成功.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/6/1601976000242.png)