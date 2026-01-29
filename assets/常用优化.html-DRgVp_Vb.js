import{a as e,c as s,g as i,o as a}from"./app-BnyB4w0Z.js";const t={};function l(p,n){return a(),s("div",null,[...n[0]||(n[0]=[i(`<h1 id="常用优化" tabindex="-1"><a class="header-anchor" href="#常用优化"><span>常用优化</span></a></h1><h2 id="主机系统优化" tabindex="-1"><a class="header-anchor" href="#主机系统优化"><span>主机系统优化</span></a></h2><pre><code>limit优化

ulimit -SHn 65535
</code></pre><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">cat</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> &lt;&lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">EOF</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> &gt;&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">/etc/security/limits.conf</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">* soft nofile 655360</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">* hard nofile 131072</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">* soft nproc 655350</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">* hard nproc 655350</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">* soft memlock unlimited</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">* hard memlock unlimited</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">  EOF</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ipvs管理工具安装及模块加载" tabindex="-1"><a class="header-anchor" href="#ipvs管理工具安装及模块加载"><span>ipvs管理工具安装及模块加载</span></a></h2><pre><code>为集群节点安装，负载均衡节点不用安装

yum -y install ipvsadm ipset sysstat conntrack libseccomp
</code></pre><p>所有节点配置ipvs模块，在内核4.19+版本nf_conntrack_ipv4已经改为nf_conntrack， 4.18以下使用nf_conntrack_ipv4即可：</p><pre><code>modprobe -- ip_vs 
modprobe -- ip_vs_rr 
modprobe -- ip_vs_wrr 
modprobe -- ip_vs_sh 
modprobe -- nf_conntrack xxxxxxxxxx11 1modprobe -- ip_vs 2modprobe -- ip_vs_rr 3modprobe -- ip_vs_wrr 4modprobe -- ip_vs_sh 5modprobe -- nf_conntrack 162738495106117
</code></pre><p>创建 /etc/modules-load.d/ipvs.conf 并加入以下内容：</p><pre><code>cat &gt;/etc/modules-load.d/ipvs.conf &lt;&lt;EOF 
ip_vs 
ip_vs_lc 
ip_vs_wlc 
ip_vs_rr 
ip_vs_wrr 
ip_vs_lblc 
ip_vs_lblcr 
ip_vs_dh 
ip_vs_sh 
ip_vs_fo 
ip_vs_nq 
ip_vs_sed 
ip_vs_ftp 
ip_vs_sh 
nf_conntrack 
ip_tables 
ip_set 
xt_set 
ipt_set 
ipt_rpfilter 
ipt_REJECT 
ipip 
EOF
</code></pre><h2 id="_2-1-8-加载containerd相关内核模块" tabindex="-1"><a class="header-anchor" href="#_2-1-8-加载containerd相关内核模块"><span>2.1.8 加载containerd相关内核模块</span></a></h2><p>临时加载模块</p><pre><code>modprobe overlay
modprobe br_netfilter
</code></pre><p>永久性加载模块</p><pre><code>cat &gt; /etc/modules-load.d/containerd.conf &lt;&lt; EOF
overlay
br_netfilter
EOF
</code></pre><p>设置为开机启动</p><pre><code>systemctl enable --now systemd-modules-load.service
</code></pre><h2 id="linux内核升级" tabindex="-1"><a class="header-anchor" href="#linux内核升级"><span>Linux内核升级</span></a></h2><pre><code>在所有节点中安装,需要重新操作系统更换内核。

[root@localhost ~]# yum -y install perl

[root@localhost ~]# rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org

[root@localhost ~]# yum -y install https://www.elrepo.org/elrepo-release-7.0-4.el7.elrepo.noarch.rpm

[root@localhost ~]# yum  --enablerepo=&quot;elrepo-kernel&quot;  -y install kernel-ml.x86_64

[root@localhost ~]# grub2-set-default 0

[root@localhost ~]# grub2-mkconfig -o /boot/grub2/grub.cfg
</code></pre><p>2.1.10 Linux内核优化</p><pre><code>cat &lt;&lt;EOF &gt; /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
fs.may_detach_mounts = 1
vm.overcommit_memory=1
vm.panic_on_oom=0
fs.inotify.max_user_watches=89100
fs.file-max=52706963
fs.nr_open=52706963
net.netfilter.nf_conntrack_max=2310720

net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_probes = 3
net.ipv4.tcp_keepalive_intvl =15
net.ipv4.tcp_max_tw_buckets = 36000
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_max_orphans = 327680
net.ipv4.tcp_orphan_retries = 3
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.ip_conntrack_max = 131072
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.tcp_timestamps = 0
net.core.somaxconn = 16384
EOF
</code></pre><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sysctl</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --system</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>`,22)])])}const o=e(t,[["render",l]]),c=JSON.parse('{"path":"/note-book/Kubernetes/%E5%B8%B8%E7%94%A8%E4%BC%98%E5%8C%96.html","title":"常用优化","lang":"zh-CN","frontmatter":{"description":"常用优化 主机系统优化 ipvs管理工具安装及模块加载 所有节点配置ipvs模块，在内核4.19+版本nf_conntrack_ipv4已经改为nf_conntrack， 4.18以下使用nf_conntrack_ipv4即可： 创建 /etc/modules-load.d/ipvs.conf 并加入以下内容： 2.1.8 加载containerd相关...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"常用优化\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2026-01-29T05:47:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Kubernetes/%E5%B8%B8%E7%94%A8%E4%BC%98%E5%8C%96.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"常用优化"}],["meta",{"property":"og:description","content":"常用优化 主机系统优化 ipvs管理工具安装及模块加载 所有节点配置ipvs模块，在内核4.19+版本nf_conntrack_ipv4已经改为nf_conntrack， 4.18以下使用nf_conntrack_ipv4即可： 创建 /etc/modules-load.d/ipvs.conf 并加入以下内容： 2.1.8 加载containerd相关..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-01-29T05:47:01.000Z"}],["meta",{"property":"article:modified_time","content":"2026-01-29T05:47:01.000Z"}]]},"git":{"createdTime":1769665621000,"updatedTime":1769665621000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"}],"changelog":[{"hash":"a829cd938cdf675cffedf6e9971e16de5125d01d","time":1769665621000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"chore: linearize history — single root commit"}]},"readingTime":{"minutes":1.15,"words":344},"filePathRelative":"note-book/Kubernetes/常用优化.md","excerpt":"\\n<h2>主机系统优化</h2>\\n<pre><code>limit优化\\n\\nulimit -SHn 65535\\n</code></pre>\\n<div class=\\"language-bash line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"bash\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-bash\\"><span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">cat</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\"> &lt;&lt;</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\">EOF</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\"> &gt;&gt; </span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">/etc/security/limits.conf</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">* soft nofile 655360</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">* hard nofile 131072</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">* soft nproc 655350</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">* hard nproc 655350</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">* soft memlock unlimited</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">* hard memlock unlimited</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">  EOF</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{o as comp,c as data};
