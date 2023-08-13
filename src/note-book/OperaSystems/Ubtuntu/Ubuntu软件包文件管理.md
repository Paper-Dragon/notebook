# Ubuntu软件包文件管理

## Debian/Ubuntu Linux 如何查看文件属于哪个软件包

如何查找哪个软件包提供了/bin/ifconfig命令？
在Debian或Ubuntu Linux中，如何搜索某个命令所属的软件包？

在Red Hat CentOS Linux中，我们可以使用 `rpm -qf /bin/ls` 找出命令所在的软件包名称。

在Ubuntu中，
dpkg是一个命令行工具，可用于安装，构建，删除和管理Debian软件包。
dpkg维护有关可用软件包的一些可用信息。
dpkg-query是用于查看dpkg数据库中列出的软件包的信息的命令行工具。
apt-file是用于在APT软件包管理系统的软件包中搜索文件的命令行工具。

## 在Debian或Ubuntu Linux找出文件所属的软件包

    找出哪个软件包提供了/usr/bin/passwd文件：dpkg -S /usr/bin/passwd
    查看哪个软件包包含vim命令：apt-file search vim

## 如何查找包含某个文件的软件包名称

-S或--search选项从已安装的软件包中搜索文件名。

找出包含/bin/ls的软件包名称：
```bash
$ dpkg -S /bin/ls
```



输出示例：
```bash
coreutils: /bin/ls
```



查看有关coreutils软件包的详细状态信息：
```bash
$ dpkg -s coreutils
```



## dpkg-query命令

您还可以使用dpkg-query命令，该命令是显示有关dpkg数据库中列出的软件包的信息的工具。
-S选项从已安装的软件包中搜索文件名。

```bash
$ dpkg-query -S '/bin/ls'
$ dpkg-query -S 'passwd*'
$ dpkg-query --search '/path/to/file'
$ dpkg-query --search '/usr/bin/passwd'
$ dpkg-query --search '/etc/passwd'
```



## 如何使用apt-file在Debian/Ubuntu上进行软件包搜索

您需要安装apt-file命令，这是用于在APT软件包管理系统的软件包中搜索文件的命令行工具：
```bash
$ sudo apt-get install apt-file
$ sudo apt-file update
```



要搜索文件包含在哪个软件包中，请输入：
```bash
$ apt-file search date
$ apt-file search kvm-ok
```



输出示例：
```bash
cpu-checker: /usr/sbin/kvm-ok
cpu-checker: /usr/share/man/man1/kvm-ok.1.gz
```





## dpkg --help

```bash
adams@adams-VirtualBox:~$ dpkg --help
用法：dpkg [<选项> ...] <命令>

命令：
  -i|--install       <.deb 文件名> ... | -R|--recursive <目录> ...
  --unpack           <.deb 文件名> ... | -R|--recursive <目录> ...
  -A|--record-avail  <.deb 文件名> ... | -R|--recursive <目录> ...
  --configure        <软件包名>    ... | -a|--pending
  --triggers-only    <软件包名>    ... | -a|--pending
  -r|--remove        <软件包名>    ... | -a|--pending
  -P|--purge         <软件包名>    ... | -a|--pending
  -V|--verify <软件包名> ...       检查包的完整性。
  --get-selections [<表达式> ...]  把已选中的软件包列表打印到标准输出。
  --set-selections                 从标准输入里读出要选择的软件。
  --clear-selections               取消选中所有不必要的软件包。
  --update-avail <软件包文件>      替换现有可安装的软件包信息。
  --merge-avail  <软件包文件>      把文件中的信息合并到系统中。
  --clear-avail                    清除现有的软件包信息。
  --forget-old-unavail             忘却已被卸载的不可安装的软件包。
  -s|--status      <软件包名> ...  显示指定软件包的详细状态。
  -p|--print-avail <软件包名> ...  显示可供安装的软件版本。
  -L|--listfiles   <软件包名> ...  列出属于指定软件包的文件。
  -l|--list  [<表达式> ...]        简明地列出软件包的状态。
  -S|--search <表达式> ...         搜索含有指定文件的软件包。
  -C|--audit [<表达式> ...]        检查是否有软件包残损。
  --yet-to-unpack                  列出标记为待解压的软件包。
  --predep-package                 列出待解压的预依赖。
  --add-architecture    <体系结构> 添加 <体系结构> 到体系结构列表。
  --remove-architecture <体系结构> 从架构列表中移除 <体系结构>。
  --print-architecture             显示 dpkg 体系结构。
  --print-foreign-architectures    显示已启用的异质体系结构。
  --assert-<特性>                  对指定特性启用断言支持。
  --validate-<属性> <字符串>       验证一个 <属性>的 <字符串>。
  --compare-vesions <a> <关系> <b> 比较版本号 - 见下。
  --force-help                     显示本强制选项的帮助信息。
  -Dh|--debug=help                 显示有关出错调试的帮助信息。

  -?, --help                       显示本帮助信息。
      --version                    显示版本信息。

Assert 特性： support-predepends, working-epoch, long-filenames,
  multi-conrep, multi-arch, versioned-provides.

可验证的属性：pkgname, archname, trigname, version.

调用 dpkg 并带参数 -b, --build, -c, --contents, -e, --control, -I, --info,
  -f, --field, -x, --extract, -X, --vextract, --ctrl-tarfile, --fsys-tarfile
是针对归档文件的。 (输入 dpkg-deb --help 获取帮助)

选项：
  --admindir=<目录>          使用 <目录> 而非 /var/lib/dpkg。
  --root=<目录>              安装到另一个根目录下。
  --instdir=<目录>           改变安装目录的同时保持管理目录不变。
  --path-exclude=<表达式>    不要安装符合Shell表达式的路径。
  --path-include=<表达式>    在排除模式后再包含一个模式。
  -O|--selected-only         忽略没有被选中安装或升级的软件包。
  -E|--skip-same-version     忽略版本与已安装软件版本相同的软件包。
  -G|--refuse-downgrade      忽略版本早于已安装软件版本的的软件包。
  -B|--auto-deconfigure      就算会影响其他软件包，也要安装。
  --[no-]triggers            跳过或强制随之发生的触发器处理。
  --verify-format=<格式>     检查输出格式('rpm'被支持)。
  --no-debsig                不去尝试验证软件包的签名。
  --no-act|--dry-run|--simulate
                             仅报告要执行的操作 - 但是不执行。
  -D|--debug=<八进制数>      开启调试(参见 -Dhelp 或者 --debug=help)。
  --status-fd <n>            发送状态更新到文件描述符<n>。
  --status-logger=<命令>     发送状态更新到 <命令> 的标准输入。
  --log=<文件名>             将状态更新和操作信息到 <文件名>。
  --ignore-depends=<软件包>,...
                             忽略关于 <软件包> 的所有依赖关系。
  --force-...                忽视遇到的问题(参见 --force-help)。
  --no-force-...|--refuse-...
                             当遇到问题时中止运行。
  --abort-after <n>          累计遇到 <n> 个错误后中止。

可供--compare-version 使用的比较运算符有：
 lt le eq ne ge gt        (如果版本号为空，那么就认为它先于任意版本号)；
 lt-nl le-nl ge-nl gt-nl  (如果版本号为空，那么就认为它后于任意版本号)；
 < << <= = >= >> >        (仅仅是为了与主控文件的语法兼容)。

'apt' 和 'aptitude' 提供了更为便利的软件包管理。
adams@adams-VirtualBox:~$
```

