import{a as e,c as n,g as t,o as i}from"./app-DxvO_rR7.js";const r={};function a(u,o){return i(),n("div",null,[...o[0]||(o[0]=[t(`<h1 id="grub2命令手动引导" tabindex="-1"><a class="header-anchor" href="#grub2命令手动引导"><span>Grub2命令手动引导</span></a></h1><h2 id="手动引导ubuntu的iso镜像文件" tabindex="-1"><a class="header-anchor" href="#手动引导ubuntu的iso镜像文件"><span>手动引导ubuntu的iso镜像文件</span></a></h2><p>从而安装ubuntu，grub&gt;代表命令的开始</p><p>假设ubuntu镜像在U盘的第一个分区的根目录下即：(hd0,1)/ubuntu-18.04-desktop-amd64.iso</p><p>手动引导下可以按TAB键补全命令、目录以及文件名</p><pre><code>#查询所有已安装磁盘并打印详细信息
grub&gt;ls -l
 
 #设置根目录分区
grub&gt;set root=(hd0,1)
 
#将Ubuntu.iso位置赋值给变量isofile （这里用变量方便下面不用打一长串文件名）
grub&gt;set isofile=/ubuntu-18.04-desktop-amd64.iso
 
#使用grub2的回放技术，把ubuntu.iso的文件内容，投射（挂载）到loop上。在使用这个命令时，你得考虑你的内存足够的大。(hd0,1)iso镜像文件所在分区
grub&gt;loopback loop (hd0,1)$isofile
 
#加载内核，其中(loop),是使用了上一句所投射的设备，其访问的是ubuntu.iso文件的内容，boor=casper将目录casper挂载为boot，iso-scan/filename=$isofile 是利用iso-scan来寻找到你的ubuntu.iso文件所在位置并把所找到的iso文件挂到光驱设备
grub&gt;linux (loop)/casper/vmlinuz boot=casper iso-scan/filename=$isofile quiet splash
 
#initrid.lz是一个镜象文件，里面存的是一些内核要加载的重要文件
grub&gt;initrd (loop)/casper/initrd.lz
 
#根据上面的参数启动系统
grub&gt;boot
</code></pre><p>-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------</p><h2 id="手动引导archlinux的iso镜像文件从而安装archlinux" tabindex="-1"><a class="header-anchor" href="#手动引导archlinux的iso镜像文件从而安装archlinux"><span>手动引导archlinux的iso镜像文件从而安装archlinux</span></a></h2><p>，grub&gt;代表命令的开始</p><p>假设archlinux镜像在U盘的第一个分区的根目录下即：(hd0,1)/archlinux-2018.07.01-x86_64.iso</p><pre><code>grub&gt;set root=(hd0,1)
grub&gt;set isofile=/archlinux-2018.07.01-x86_64.iso
grub&gt;loopback loop (hd0,1)$isofile
 #img_dev=/dev/sda1 镜像文件所在分区设备，如果不清楚所在设备是怎么排序的可以使用img_dev=/dev/disk/by-uuid/分区的UUID 关于UUID可以用&quot;grub&gt;ls -l&quot; 指令查询,或者可以用img_dev=/dev/disk/by-labe/分区卷标 
grub&gt;linux (loop)/arch/boot/x86_64/vmlinuz img_dev=/dev/sda1 img_loop=$isofile earlymodules=loop
grub&gt;initrd (loop)/arch/boot/x86_64/archiso.img
grub&gt;boot
</code></pre><p>方法二：</p><pre><code>grub&gt;set root=(hd0,1)
grub&gt;set isofile=/arch.iso
grub&gt;loopback loop (hd0,1)$isofile
grub&gt;linux (loop)/arch/boot/x86_64/vmlinuz img_loop=$isofile archisobasedir=arch  archisolabel=ARCH_XXXXXX #此处为发布年月
grub&gt;initrd (loop)/arch/boot/x86_64/archiso.img
</code></pre><p>-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------</p><h2 id="手动引导ubuntu" tabindex="-1"><a class="header-anchor" href="#手动引导ubuntu"><span>手动引导Ubuntu</span></a></h2><p>假设ubuntu安装在第一块硬盘的第一个分区即：(hd0,1)</p><pre><code>grub&gt;root=(hd0,1)
grub&gt;linux /boot/vmlinuz-xxx
grub&gt;initrd /boot/initrd.img-xxx
grub&gt;boot
</code></pre><p>XXX是内核版本号</p><p>关于linux的通用引导方法其实与上面差不多，就是在“grub&gt;linux /boot/vmlinuz-xxx”这一句加载内核的文件与后面跟的参数有所不同，不同的linux发行版会有不同的参数，有些可以也不加参数启动</p><p>-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------</p><h2 id="手动引导uefi启动模式下的windows。" tabindex="-1"><a class="header-anchor" href="#手动引导uefi启动模式下的windows。"><span>手动引导uefi启动模式下的Windows。</span></a></h2><p>winPE也可以用此方法引导</p><p>假设windows安装在第一块硬盘的第一个分区即：(hd0,1)</p><pre><code>#加载ntfs文件系统
grub&gt;insmod ntfs
grub&gt;set root=(hd0,1)
#grub&gt;chainloader +1 是引导传统bios启动的Windows
#如果不成功则可能是efi文件被替换用换个目录试试如：chainloader/EFI/microsoft/boot/bootmgfw.efi
grub&gt;chainloader /EFI/boot/bootx64.efi
grub&gt;boot
</code></pre><p>-----------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------</p><h2 id="手动引导bios启动模式下的windows。" tabindex="-1"><a class="header-anchor" href="#手动引导bios启动模式下的windows。"><span>手动引导bios启动模式下的Windows。</span></a></h2><p>winPE也可以用此方法引导</p><p>假设windows安装在第一块硬盘的第一个分区即：(hd0,1)</p><p>chainloader /bootmgr 命令会报签名错误，即使关闭签名验证也无法启动(chainloader +1也可启动系统但不可启动U盘pe)</p><pre><code>grub&gt;set root=(hd0,1)
# /bootmgr 是一个在根目录下的引导文件，bootmgr是在Windows Vista、Windows 7、windows 8/8.1和windows 10中使用的新的启动管理器，就相当于Win NT/Win 2000/Win XP时代的NTLDR。
grub&gt;ntldr /bootmgr
grub&gt;boot
</code></pre>`,30)])])}const p=e(r,[["render",a]]),b=JSON.parse('{"path":"/note-book/LinuxOperaSystem/Grub2%E5%91%BD%E4%BB%A4%E6%89%8B%E5%8A%A8%E5%BC%95%E5%AF%BC.html","title":"Grub2命令手动引导","lang":"zh-CN","frontmatter":{"description":"Grub2命令手动引导 手动引导ubuntu的iso镜像文件 从而安装ubuntu，grub>代表命令的开始 假设ubuntu镜像在U盘的第一个分区的根目录下即：(hd0,1)/ubuntu-18.04-desktop-amd64.iso 手动引导下可以按TAB键补全命令、目录以及文件名 --------------------------------...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Grub2命令手动引导\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-26T05:41:05.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/LinuxOperaSystem/Grub2%E5%91%BD%E4%BB%A4%E6%89%8B%E5%8A%A8%E5%BC%95%E5%AF%BC.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"Grub2命令手动引导"}],["meta",{"property":"og:description","content":"Grub2命令手动引导 手动引导ubuntu的iso镜像文件 从而安装ubuntu，grub>代表命令的开始 假设ubuntu镜像在U盘的第一个分区的根目录下即：(hd0,1)/ubuntu-18.04-desktop-amd64.iso 手动引导下可以按TAB键补全命令、目录以及文件名 --------------------------------..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-26T05:41:05.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-26T05:41:05.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1711431665000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":2,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"e18707b4abacb009f69df6c80823f3294650cc74","time":1711431665000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"Markdown 格式规范化"},{"hash":"b93dc3fce09b07da1973c2c3e27e352936cc292c","time":1698989873000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"删除不必要的分隔符，清理部分todo"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":2.95,"words":885},"filePathRelative":"note-book/LinuxOperaSystem/Grub2命令手动引导.md","excerpt":"\\n<h2>手动引导ubuntu的iso镜像文件</h2>\\n<p>从而安装ubuntu，grub&gt;代表命令的开始</p>\\n<p>假设ubuntu镜像在U盘的第一个分区的根目录下即：(hd0,1)/ubuntu-18.04-desktop-amd64.iso</p>\\n<p>手动引导下可以按TAB键补全命令、目录以及文件名</p>\\n<pre><code>#查询所有已安装磁盘并打印详细信息\\ngrub&gt;ls -l\\n \\n #设置根目录分区\\ngrub&gt;set root=(hd0,1)\\n \\n#将Ubuntu.iso位置赋值给变量isofile （这里用变量方便下面不用打一长串文件名）\\ngrub&gt;set isofile=/ubuntu-18.04-desktop-amd64.iso\\n \\n#使用grub2的回放技术，把ubuntu.iso的文件内容，投射（挂载）到loop上。在使用这个命令时，你得考虑你的内存足够的大。(hd0,1)iso镜像文件所在分区\\ngrub&gt;loopback loop (hd0,1)$isofile\\n \\n#加载内核，其中(loop),是使用了上一句所投射的设备，其访问的是ubuntu.iso文件的内容，boor=casper将目录casper挂载为boot，iso-scan/filename=$isofile 是利用iso-scan来寻找到你的ubuntu.iso文件所在位置并把所找到的iso文件挂到光驱设备\\ngrub&gt;linux (loop)/casper/vmlinuz boot=casper iso-scan/filename=$isofile quiet splash\\n \\n#initrid.lz是一个镜象文件，里面存的是一些内核要加载的重要文件\\ngrub&gt;initrd (loop)/casper/initrd.lz\\n \\n#根据上面的参数启动系统\\ngrub&gt;boot\\n</code></pre>","autoDesc":true}');export{p as comp,b as data};
