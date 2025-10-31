import{a as n,c as a,g as e,o as i}from"./app-aBoodkOW.js";const l={};function p(d,s){return i(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="jumpserver负载均衡部署" tabindex="-1"><a class="header-anchor" href="#jumpserver负载均衡部署"><span>JumpServer负载均衡部署</span></a></h1><h2 id="环境说明" tabindex="-1"><a class="header-anchor" href="#环境说明"><span>环境说明</span></a></h2><ul><li>除 JumpServer 自身组件外，其他组件的高可用请参考对应的官方文档进行部署</li><li>按照此方式部署后，后续只需要根据需要扩容 JumpServer 节点然后添加节点到 HAProxy 即可</li><li>如果已经有 HLB 或者 SLB 可以跳过 HAProxy 部署，第三方 LB 要注意 session 和 websocket 问题</li><li>如果已经有 云存储 (* S3/Ceph/Swift/OSS/Azure) 可以跳过 MinIO 部署，MySQL Redis 也一样</li><li>生产环境中，应该使用 Ceph 等替代 NFS，或者部署高可用的 NFS 防止单点故障</li><li><a href="https://github.com/wojiushixiaobai/redis-sentinel" target="_blank" rel="noopener noreferrer">Redis 高可用快速部署可以参考此项目</a></li></ul><table><thead><tr><th>DB</th><th>Version</th><th></th><th>Cache</th><th>Version</th></tr></thead><tbody><tr><td>MySQL</td><td>&gt;= 5.7</td><td></td><td>Redis</td><td>&gt;= 5.0</td></tr><tr><td>MariaDB</td><td>&gt;= 10.2</td><td></td><td></td><td></td></tr></tbody></table><table><thead><tr><th>Server Name</th><th>IP</th><th>Port</th><th>Use</th><th>Minimize Hardware</th><th>Standard Hardware</th></tr></thead><tbody><tr><td>NFS</td><td>192.168.100.11</td><td></td><td>Core</td><td>2Core/8GB RAM/100G HDD</td><td>4Core/16GB RAM/1T SSD</td></tr><tr><td>MySQL</td><td>192.168.100.11</td><td>3306</td><td>Core</td><td>2Core/8GB RAM/90G HDD</td><td>4Core/16GB RAM/1T SSD</td></tr><tr><td>Redis</td><td>192.168.100.11</td><td>6379</td><td>Core, Koko, Lion</td><td>2Core/8GB RAM/90G HDD</td><td>4Core/16GB RAM/1T SSD</td></tr><tr><td>HAProxy</td><td>192.168.100.100</td><td>80,443,2222,33060,33061</td><td>All</td><td>2Core/4GB RAM/60G HDD</td><td>4Core/8GB RAM/60G SSD</td></tr><tr><td>JumpServer 01</td><td>192.168.100.21</td><td>80,2222,33060,33061</td><td>HAProxy</td><td>2Core/8GB RAM/60G HDD</td><td>4Core/8GB RAM/90G SSD</td></tr><tr><td>JumpServer 02</td><td>192.168.100.22</td><td>80,2222,33060,33061</td><td>HAProxy</td><td>2Core/8GB RAM/60G HDD</td><td>4Core/8GB RAM/90G SSD</td></tr><tr><td>JumpServer 03</td><td>192.168.100.23</td><td>80,2222,33060,33061</td><td>HAProxy</td><td>2Core/8GB RAM/60G HDD</td><td>4Core/8GB RAM/90G SSD</td></tr><tr><td>JumpServer 04</td><td>192.168.100.24</td><td>80,2222,33060,33061</td><td>HAProxy</td><td>2Core/8GB RAM/60G HDD</td><td>4Core/8GB RAM/90G SSD</td></tr><tr><td>MinIO</td><td>192.168.100.41</td><td>9000,9001</td><td>Core, KoKo, Lion</td><td>2Core/4GB RAM/100G HDD</td><td>4Core/8GB RAM/1T SSD</td></tr><tr><td>Elasticsearch</td><td>192.168.100.51</td><td>9200,9300</td><td>Core, KoKo</td><td>2Core/4GB RAM/100G HDD</td><td>4Core/8GB RAM/1T SSD</td></tr></tbody></table><table><thead><tr><th>Server Name</th><th>Check Health</th><th>Example</th></tr></thead><tbody><tr><td>Core</td><td>http://core:8080/api/health/</td><td>https://demo.jumpserver.org/api/health/</td></tr><tr><td>KoKo</td><td>http://koko:5000/koko/health/</td><td>https://demo.jumpserver.org/koko/health/</td></tr><tr><td>Lion</td><td>http://lion:8081/lion/health/</td><td>https://demo.jumpserver.org/lion/health/</td></tr></tbody></table><h2 id="部署-nfs-服务" tabindex="-1"><a class="header-anchor" href="#部署-nfs-服务"><span>部署 NFS 服务</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>服务器: 192.168.100.11</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>安装依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install epel-release</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>安装 NFS</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install nfs-utils rpcbind</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>启动 NFS</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>systemctl enable rpcbind nfs-server nfs-lock nfs-idmap</span></span>
<span class="line"><span>systemctl start rpcbind nfs-server nfs-lock nfs-idmap</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置防火墙</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>firewall-cmd --add-service=nfs --permanent --zone=public</span></span>
<span class="line"><span>firewall-cmd --add-service=mountd --permanent --zone=public</span></span>
<span class="line"><span>firewall-cmd --add-service=rpc-bind --permanent --zone=public</span></span>
<span class="line"><span>firewall-cmd --reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 NFS</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>mkdir /data</span></span>
<span class="line"><span>chmod 777 -R /data</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vi /etc/exports</span></span>
<span class="line"><span># 设置 NFS 访问权限, /data 是刚才创建的将被共享的目录, 192.168.100.* 表示整个 192.168.100.* 的资产都有括号里面的权限</span></span>
<span class="line"><span># 也可以写具体的授权对象 /data 192.168.100.30(rw,sync,no_root_squash) 192.168.100.31(rw,sync,no_root_squash)</span></span>
<span class="line"><span>/data 192.168.100.*(rw,sync,all_squash,anonuid=0,anongid=0)</span></span>
<span class="line"><span>exportfs -a</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-mysql-服务" tabindex="-1"><a class="header-anchor" href="#部署-mysql-服务"><span>部署 MySQL 服务</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.11</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>设置 Repo</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y localinstall http://mirrors.ustc.edu.cn/mysql-repo/mysql57-community-release-el7.rpm</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>安装 MySQL</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum install -y mysql-community-server</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>配置 MySQL</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>if [ ! &quot;$(cat /usr/bin/mysqld_pre_systemd | grep -v ^\\# | grep initialize-insecure )&quot; ]; then</span></span>
<span class="line"><span>    sed -i &quot;s@--initialize @--initialize-insecure @g&quot; /usr/bin/mysqld_pre_systemd</span></span>
<span class="line"><span>fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 MySQL</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>systemctl enable mysqld</span></span>
<span class="line"><span>systemctl start mysqld</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>数据库授权</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>mysql -uroot</span></span>
<span class="line"><span>Welcome to the MySQL monitor.  Commands end with ; or \\g.</span></span>
<span class="line"><span>Your MySQL connection id is 2</span></span>
<span class="line"><span>Server version: 5.7.32 MySQL Community Server (GPL)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Oracle is a registered trademark of Oracle Corporation and/or its</span></span>
<span class="line"><span>affiliates. Other names may be trademarks of their respective</span></span>
<span class="line"><span>owners.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Type &#39;help;&#39; or &#39;\\h&#39; for help. Type &#39;\\c&#39; to clear the current input statement.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; create database jumpserver default charset &#39;utf8&#39;;</span></span>
<span class="line"><span>Query OK, 1 row affected (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; set global validate_password_policy=LOW;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; create user &#39;jumpserver&#39;@&#39;%&#39; identified by &#39;KXOeyNgDeTdpeu9q&#39;;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; grant all on jumpserver.* to &#39;jumpserver&#39;@&#39;%&#39;;</span></span>
<span class="line"><span>Query OK, 0 rows affected, 1 warning (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; flush privileges;</span></span>
<span class="line"><span>Query OK, 0 rows affected (0.00 sec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mysql&gt; exit</span></span>
<span class="line"><span>Bye</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置防火墙</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>firewall-cmd --permanent --add-rich-rule=&quot;rule family=&quot;ipv4&quot; source address=&quot;192.168.100.0/24&quot; port protocol=&quot;tcp&quot; port=&quot;3306&quot; accept&quot;</span></span>
<span class="line"><span>firewall-cmd --reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-redis-服务" tabindex="-1"><a class="header-anchor" href="#部署-redis-服务"><span>部署 Redis 服务</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.11</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>设置 Repo</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install epel-release https://repo.ius.io/ius-release-el7.rpm</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>安装 Redis</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum install -y redis5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>配置 Redis</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>sed -i &quot;s/bind 127.0.0.1/bind 0.0.0.0/g&quot; /etc/redis.conf</span></span>
<span class="line"><span>sed -i &quot;561i maxmemory-policy allkeys-lru&quot; /etc/redis.conf</span></span>
<span class="line"><span>sed -i &quot;481i requirepass KXOeyNgDeTdpeu9q&quot; /etc/redis.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 Redis</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>systemctl enable redis</span></span>
<span class="line"><span>systemctl start redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置防火墙</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>firewall-cmd --permanent --add-rich-rule=&quot;rule family=&quot;ipv4&quot; source address=&quot;192.168.100.0/24&quot; port protocol=&quot;tcp&quot; port=&quot;6379&quot; accept&quot;</span></span>
<span class="line"><span>firewall-cmd --reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-jumpserver-01" tabindex="-1"><a class="header-anchor" href="#部署-jumpserver-01"><span>部署 JumpServer 01</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.21</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 NFS</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install nfs-utils</span></span>
<span class="line"><span>showmount -e 192.168.100.11</span></span>
<span class="line"><span># 将 Core 持久化目录挂载到 NFS, 默认 /opt/jumpserver/core/data, 请根据实际情况修改</span></span>
<span class="line"><span># JumpServer 持久化目录定义相关参数为 VOLUME_DIR, 在安装 JumpServer 过程中会提示</span></span>
<span class="line"><span>mkdir /opt/jumpserver/core/data</span></span>
<span class="line"><span>mount -t nfs 192.168.100.11:/data /opt/jumpserver/core/data</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 可以写入到 /etc/fstab, 重启自动挂载. 注意: 设置后如果 nfs 损坏或者无法连接该服务器将无法启动</span></span>
<span class="line"><span>echo &quot;192.168.100.11:/data /opt/jumpserver/core/data nfs defaults 0 0&quot; &gt;&gt; /etc/fstab</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下载 jumpserver-install</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>cd /opt</span></span>
<span class="line"><span>yum -y install wget</span></span>
<span class="line"><span>wget https://github.com/jumpserver/installer/releases/download/v2.21.0/jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>tar -xf jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>cd jumpserver-installer-v2.21.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改配置文件</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>vi config-example.txt</span></span>
<span class="line"><span># 修改下面选项, 其他保持默认, 请勿直接复制此处内容</span></span>
<span class="line"><span>### 注意: SECRET_KEY 和要其他 JumpServer 服务器一致, 加密的数据将无法解密</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 安装配置</span></span>
<span class="line"><span>### 注意持久化目录 VOLUME_DIR, 如果上面 NFS 挂载其他目录, 此处也要修改. 如: NFS 挂载到 /data/jumpserver/core/data, 则 VOLUME_DIR=/data/jumpserver</span></span>
<span class="line"><span>VOLUME_DIR=/opt/jumpserver</span></span>
<span class="line"><span>DOCKER_DIR=/var/lib/docker</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Core 配置</span></span>
<span class="line"><span>### 启动后不能再修改，否则密码等等信息无法解密, 请勿直接复制下面的字符串</span></span>
<span class="line"><span>SECRET_KEY=kWQdmdCQKjaWlHYpPhkNQDkfaRulM6YnHctsHLlSPs8287o2kW    # 要其他 JumpServer 服务器一致 (*)</span></span>
<span class="line"><span>BOOTSTRAP_TOKEN=KXOeyNgDeTdpeu9q                                 # 要其他 JumpServer 服务器一致 (*)</span></span>
<span class="line"><span>LOG_LEVEL=ERROR                                                  # 日志等级</span></span>
<span class="line"><span># SESSION_COOKIE_AGE=86400</span></span>
<span class="line"><span>SESSION_EXPIRE_AT_BROWSER_CLOSE=true                             # 关闭浏览器 session 过期</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 配置</span></span>
<span class="line"><span>USE_EXTERNAL_MYSQL=1                                             # 使用外置 MySQL</span></span>
<span class="line"><span>DB_HOST=192.168.100.11</span></span>
<span class="line"><span>DB_PORT=3306</span></span>
<span class="line"><span>DB_USER=jumpserve</span></span>
<span class="line"><span>DB_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>DB_NAME=jumpserver</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Redis 配置</span></span>
<span class="line"><span>USE_EXTERNAL_REDIS=1                                             # 使用外置 Redis</span></span>
<span class="line"><span>REDIS_HOST=192.168.100.11</span></span>
<span class="line"><span>REDIS_PORT=6379</span></span>
<span class="line"><span>REDIS_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span></span></span>
<span class="line"><span># KoKo Lion 配置</span></span>
<span class="line"><span>SHARE_ROOM_TYPE=redis                                            # KoKo Lion 使用 redis 共享</span></span>
<span class="line"><span>REUSE_CONNECTION=false                                           # Koko 禁用连接复用</span></span>
<span class="line"><span>./jmsctl.sh install</span></span>
<span class="line"><span>       ██╗██╗   ██╗███╗   ███╗██████╗ ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗</span></span>
<span class="line"><span>       ██║██║   ██║████╗ ████║██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗</span></span>
<span class="line"><span>       ██║██║   ██║██╔████╔██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝</span></span>
<span class="line"><span>  ██   ██║██║   ██║██║╚██╔╝██║██╔═══╝ ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗</span></span>
<span class="line"><span>  ╚█████╔╝╚██████╔╝██║ ╚═╝ ██║██║     ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║</span></span>
<span class="line"><span>   ╚════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                                                                     Version:  v2.21.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 检查配置文件</span></span>
<span class="line"><span>配置文件位置: /opt/jumpserver/config</span></span>
<span class="line"><span>/opt/jumpserver/config/config.txt  [ √ ]</span></span>
<span class="line"><span>/opt/jumpserver/config/nginx/lb_rdp_server.conf  [ √ ]</span></span>
<span class="line"><span>/opt/jumpserver/config/nginx/lb_ssh_server.conf  [ √ ]</span></span>
<span class="line"><span>/opt/jumpserver/config/nginx/cert/server.crt  [ √ ]</span></span>
<span class="line"><span>/opt/jumpserver/config/nginx/cert/server.key  [ √ ]</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 备份配置文件</span></span>
<span class="line"><span>备份至 /opt/jumpserver/config/backup/config.txt.2021-07-15_22-26-13</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt;&gt;&gt; 安装配置 Docker</span></span>
<span class="line"><span>1. 安装 Docker</span></span>
<span class="line"><span>开始下载 Docker 程序 ...</span></span>
<span class="line"><span>开始下载 Docker Compose 程序 ...</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 配置 Docker</span></span>
<span class="line"><span>是否需要自定义 docker 存储目录, 默认将使用目录 /var/lib/docker? (y/n)  (默认为 n): n</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 启动 Docker</span></span>
<span class="line"><span>Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /etc/systemd/system/docker.service.</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt;&gt;&gt; 加载 Docker 镜像</span></span>
<span class="line"><span>Docker: Pulling from jumpserver/core:v2.21.0        [ OK ]</span></span>
<span class="line"><span>Docker: Pulling from jumpserver/koko:v2.21.0        [ OK ]</span></span>
<span class="line"><span>Docker: Pulling from jumpserver/web:v2.21.0         [ OK ]</span></span>
<span class="line"><span>Docker: Pulling from jumpserver/redis:6-alpine      [ OK ]</span></span>
<span class="line"><span>Docker: Pulling from jumpserver/mysql:5             [ OK ]</span></span>
<span class="line"><span>Docker: Pulling from jumpserver/lion:v2.21.0        [ OK ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt;&gt;&gt; 安装配置 JumpServer</span></span>
<span class="line"><span>1. 配置网络</span></span>
<span class="line"><span>是否需要支持 IPv6? (y/n)  (默认为 n): n</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 配置加密密钥</span></span>
<span class="line"><span>SECRETE_KEY:     YTE2YTVkMTMtMGE3MS00YzI5LWFlOWEtMTc2OWJlMmIyMDE2</span></span>
<span class="line"><span>BOOTSTRAP_TOKEN: YTE2YTVkMTMtMGE3</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 配置持久化目录</span></span>
<span class="line"><span>是否需要自定义持久化存储, 默认将使用目录 /opt/jumpserver? (y/n)  (默认为 n): n</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 配置 MySQL</span></span>
<span class="line"><span>是否使用外部 MySQL? (y/n)  (默认为 n): y</span></span>
<span class="line"><span>请输入 MySQL 的主机地址 (无默认值): 192.168.100.11</span></span>
<span class="line"><span>请输入 MySQL 的端口 (默认为3306): 3306</span></span>
<span class="line"><span>请输入 MySQL 的数据库(事先做好授权) (默认为jumpserver): jumpserver</span></span>
<span class="line"><span>请输入 MySQL 的用户名 (无默认值): jumpserver</span></span>
<span class="line"><span>请输入 MySQL 的密码 (无默认值): KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 配置 Redis</span></span>
<span class="line"><span>是否使用外部 Redis? (y/n)  (默认为 n): y</span></span>
<span class="line"><span>请输入 Redis 的主机地址 (无默认值): 192.168.100.11</span></span>
<span class="line"><span>请输入 Redis 的端口 (默认为6379): 6379</span></span>
<span class="line"><span>请输入 Redis 的密码 (无默认值): KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>6. 配置对外端口</span></span>
<span class="line"><span>是否需要配置 JumpServer 对外访问端口? (y/n)  (默认为 n): n</span></span>
<span class="line"><span>完成</span></span>
<span class="line"><span></span></span>
<span class="line"><span>7. 初始化数据库</span></span>
<span class="line"><span>Creating network &quot;jms_net&quot; with driver &quot;bridge&quot;</span></span>
<span class="line"><span>Creating jms_redis ... done</span></span>
<span class="line"><span>2021-07-15 22:39:52 Collect static files</span></span>
<span class="line"><span>2021-07-15 22:39:52 Collect static files done</span></span>
<span class="line"><span>2021-07-15 22:39:52 Check database structure change ...</span></span>
<span class="line"><span>2021-07-15 22:39:52 Migrate model change to database ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>475 static files copied to &#39;/opt/jumpserver/data/static&#39;.</span></span>
<span class="line"><span>Operations to perform:</span></span>
<span class="line"><span>  Apply all migrations: acls, admin, applications, assets, audits, auth, authentication, captcha, common, contenttypes, django_cas_ng, django_celery_beat, jms_oidc_rp, notifications, ops, orgs, perms, sessions, settings, terminal, tickets, users</span></span>
<span class="line"><span>Running migrations:</span></span>
<span class="line"><span>  Applying contenttypes.0001_initial... OK</span></span>
<span class="line"><span>  Applying contenttypes.0002_remove_content_type_name... OK</span></span>
<span class="line"><span>  Applying auth.0001_initial... OK</span></span>
<span class="line"><span>  Applying auth.0002_alter_permission_name_max_length... OK</span></span>
<span class="line"><span>  Applying auth.0003_alter_user_email_max_length... OK</span></span>
<span class="line"><span>  Applying auth.0004_alter_user_username_opts... OK</span></span>
<span class="line"><span>  Applying auth.0005_alter_user_last_login_null... OK</span></span>
<span class="line"><span>  Applying auth.0006_require_contenttypes_0002... OK</span></span>
<span class="line"><span>  Applying auth.0007_alter_validators_add_error_messages... OK</span></span>
<span class="line"><span>  Applying auth.0008_alter_user_username_max_length... OK</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>  Applying sessions.0001_initial... OK</span></span>
<span class="line"><span>  Applying terminal.0032_auto_20210302_1853... OK</span></span>
<span class="line"><span>  Applying terminal.0033_auto_20210324_1008... OK</span></span>
<span class="line"><span>  Applying terminal.0034_auto_20210406_1434... OK</span></span>
<span class="line"><span>  Applying terminal.0035_auto_20210517_1448... OK</span></span>
<span class="line"><span>  Applying terminal.0036_auto_20210604_1124... OK</span></span>
<span class="line"><span>  Applying terminal.0037_auto_20210623_1748... OK</span></span>
<span class="line"><span>  Applying tickets.0008_auto_20210311_1113... OK</span></span>
<span class="line"><span>  Applying tickets.0009_auto_20210426_1720... OK</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt;&gt;&gt; 安装完成了</span></span>
<span class="line"><span>1. 可以使用如下命令启动, 然后访问</span></span>
<span class="line"><span>cd /root/jumpserver-installer-v2.21.0</span></span>
<span class="line"><span>./jmsctl.sh start</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 其它一些管理命令</span></span>
<span class="line"><span>./jmsctl.sh stop</span></span>
<span class="line"><span>./jmsctl.sh restart</span></span>
<span class="line"><span>./jmsctl.sh backup</span></span>
<span class="line"><span>./jmsctl.sh upgrade</span></span>
<span class="line"><span>更多还有一些命令, 你可以 ./jmsctl.sh --help 来了解</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. Web 访问</span></span>
<span class="line"><span>http://192.168.100.212:80</span></span>
<span class="line"><span>默认用户: admin  默认密码: admin</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. SSH/SFTP 访问</span></span>
<span class="line"><span>ssh -p2222 admin@192.168.100.212</span></span>
<span class="line"><span>sftp -P2222 admin@192.168.100.212</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 更多信息</span></span>
<span class="line"><span>我们的官网: https://www.jumpserver.org/</span></span>
<span class="line"><span>我们的文档: https://docs.jumpserver.org/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 JumpServer</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>./jmsctl.sh start</span></span>
<span class="line"><span>Creating network &quot;jms_net&quot; with driver &quot;bridge&quot;</span></span>
<span class="line"><span>Creating jms_core      ... done</span></span>
<span class="line"><span>Creating jms_celery    ... done</span></span>
<span class="line"><span>Creating jms_lion      ... done</span></span>
<span class="line"><span>Creating jms_koko      ... done</span></span>
<span class="line"><span>Creating jms_magnus    ... done</span></span>
<span class="line"><span>Creating jms_web       ... done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-jumpserver-02" tabindex="-1"><a class="header-anchor" href="#部署-jumpserver-02"><span>部署 JumpServer 02</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.22</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 NFS</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install nfs-utils</span></span>
<span class="line"><span>showmount -e 192.168.100.11</span></span>
<span class="line"><span># 将 Core 持久化目录挂载到 NFS, 默认 /opt/jumpserver/core/data, 请根据实际情况修改</span></span>
<span class="line"><span># JumpServer 持久化目录定义相关参数为 VOLUME_DIR, 在安装 JumpServer 过程中会提示</span></span>
<span class="line"><span>mkdir /opt/jumpserver/core/data</span></span>
<span class="line"><span>mount -t nfs 192.168.100.11:/data /opt/jumpserver/core/data</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 可以写入到 /etc/fstab, 重启自动挂载. 注意: 设置后如果 nfs 损坏或者无法连接该服务器将无法启动</span></span>
<span class="line"><span>echo &quot;192.168.100.11:/data /opt/jumpserver/core/data nfs defaults 0 0&quot; &gt;&gt; /etc/fstab</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下载 jumpserver-install</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>cd /opt</span></span>
<span class="line"><span>yum -y install wget</span></span>
<span class="line"><span>wget https://github.com/jumpserver/installer/releases/download/v2.21.0/jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>tar -xf jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>cd jumpserver-installer-v2.21.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改配置文件</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>vi config-example.txt</span></span>
<span class="line"><span># 修改下面选项, 其他保持默认, 请勿直接复制此处内容</span></span>
<span class="line"><span>### 注意: SECRET_KEY 和要其他 JumpServer 服务器一致, 加密的数据将无法解密</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 安装配置</span></span>
<span class="line"><span>### 注意持久化目录 VOLUME_DIR, 如果上面 NFS 挂载其他目录, 此处也要修改. 如: NFS 挂载到/data/jumpserver/core/data, 则 DOCKER_DIR=/data/jumpserver</span></span>
<span class="line"><span>VOLUME_DIR=/opt/jumpserver</span></span>
<span class="line"><span>DOCKER_DIR=/var/lib/docker</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Core 配置</span></span>
<span class="line"><span>### 启动后不能再修改，否则密码等等信息无法解密, 请勿直接复制下面的字符串</span></span>
<span class="line"><span>SECRET_KEY=kWQdmdCQKjaWlHYpPhkNQDkfaRulM6YnHctsHLlSPs8287o2kW</span></span>
<span class="line"><span>BOOTSTRAP_TOKEN=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>LOG_LEVEL=ERROR</span></span>
<span class="line"><span># SESSION_COOKIE_AGE=86400</span></span>
<span class="line"><span>SESSION_EXPIRE_AT_BROWSER_CLOSE=true</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 配置</span></span>
<span class="line"><span>USE_EXTERNAL_MYSQL=1</span></span>
<span class="line"><span>DB_HOST=192.168.100.11</span></span>
<span class="line"><span>DB_PORT=3306</span></span>
<span class="line"><span>DB_USER=jumpserver</span></span>
<span class="line"><span>DB_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>DB_NAME=jumpserver</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Redis 配置</span></span>
<span class="line"><span>USE_EXTERNAL_REDIS=1</span></span>
<span class="line"><span>REDIS_HOST=192.168.100.11</span></span>
<span class="line"><span>REDIS_PORT=6379</span></span>
<span class="line"><span>REDIS_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span></span></span>
<span class="line"><span># KoKo Lion 配置</span></span>
<span class="line"><span>SHARE_ROOM_TYPE=redis</span></span>
<span class="line"><span>./jmsctl.sh install</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 JumpServer</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>./jmsctl.sh start</span></span>
<span class="line"><span>Creating network &quot;jms_net&quot; with driver &quot;bridge&quot;</span></span>
<span class="line"><span>Creating jms_core      ... done</span></span>
<span class="line"><span>Creating jms_celery    ... done</span></span>
<span class="line"><span>Creating jms_lion      ... done</span></span>
<span class="line"><span>Creating jms_koko      ... done</span></span>
<span class="line"><span>Creating jms_magnus    ... done</span></span>
<span class="line"><span>Creating jms_web       ... done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-jumpserver-03" tabindex="-1"><a class="header-anchor" href="#部署-jumpserver-03"><span>部署 JumpServer 03</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.23</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 NFS</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install nfs-utils</span></span>
<span class="line"><span>showmount -e 192.168.100.11</span></span>
<span class="line"><span># 将 Core 持久化目录挂载到 NFS, 默认 /opt/jumpserver/core/data, 请根据实际情况修改</span></span>
<span class="line"><span># JumpServer 持久化目录定义相关参数为 VOLUME_DIR, 在安装 JumpServer 过程中会提示</span></span>
<span class="line"><span>mkdir /opt/jumpserver/core/data</span></span>
<span class="line"><span>mount -t nfs 192.168.100.11:/data /opt/jumpserver/core/data</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 可以写入到 /etc/fstab, 重启自动挂载. 注意: 设置后如果 nfs 损坏或者无法连接该服务器将无法启动</span></span>
<span class="line"><span>echo &quot;192.168.100.11:/data /opt/jumpserver/core/data nfs defaults 0 0&quot; &gt;&gt; /etc/fstab</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下载 jumpserver-install</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>cd /opt</span></span>
<span class="line"><span>yum -y install wget</span></span>
<span class="line"><span>wget https://github.com/jumpserver/installer/releases/download/v2.21.0/jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>tar -xf jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>cd jumpserver-installer-v2.21.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改配置文件</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>vi config-example.txt</span></span>
<span class="line"><span># 修改下面选项, 其他保持默认, 请勿直接复制此处内容</span></span>
<span class="line"><span>### 注意: SECRET_KEY 和要其他 JumpServer 服务器一致, 加密的数据将无法解密</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 安装配置</span></span>
<span class="line"><span>### 注意持久化目录 VOLUME_DIR, 如果上面 NFS 挂载其他目录, 此处也要修改. 如: NFS 挂载到/data/jumpserver/core/data, 则 DOCKER_DIR=/data/jumpserver</span></span>
<span class="line"><span>VOLUME_DIR=/opt/jumpserver</span></span>
<span class="line"><span>DOCKER_DIR=/var/lib/docker</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Core 配置</span></span>
<span class="line"><span>### 启动后不能再修改，否则密码等等信息无法解密, 请勿直接复制下面的字符串</span></span>
<span class="line"><span>SECRET_KEY=kWQdmdCQKjaWlHYpPhkNQDkfaRulM6YnHctsHLlSPs8287o2kW</span></span>
<span class="line"><span>BOOTSTRAP_TOKEN=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>LOG_LEVEL=ERROR</span></span>
<span class="line"><span># SESSION_COOKIE_AGE=86400</span></span>
<span class="line"><span>SESSION_EXPIRE_AT_BROWSER_CLOSE=true</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 配置</span></span>
<span class="line"><span>USE_EXTERNAL_MYSQL=1</span></span>
<span class="line"><span>DB_HOST=192.168.100.11</span></span>
<span class="line"><span>DB_PORT=3306</span></span>
<span class="line"><span>DB_USER=jumpserver</span></span>
<span class="line"><span>DB_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>DB_NAME=jumpserver</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Redis 配置</span></span>
<span class="line"><span>USE_EXTERNAL_REDIS=1</span></span>
<span class="line"><span>REDIS_HOST=192.168.100.11</span></span>
<span class="line"><span>REDIS_PORT=6379</span></span>
<span class="line"><span>REDIS_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span></span></span>
<span class="line"><span># KoKo Lion 配置</span></span>
<span class="line"><span>SHARE_ROOM_TYPE=redis</span></span>
<span class="line"><span>REUSE_CONNECTION=false</span></span>
<span class="line"><span>./jmsctl.sh install</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 JumpServer</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>./jmsctl.sh start</span></span>
<span class="line"><span>Creating network &quot;jms_net&quot; with driver &quot;bridge&quot;</span></span>
<span class="line"><span>Creating jms_core      ... done</span></span>
<span class="line"><span>Creating jms_lion      ... done</span></span>
<span class="line"><span>Creating jms_koko      ... done</span></span>
<span class="line"><span>Creating jms_celery    ... done</span></span>
<span class="line"><span>Creating jms_magnus    ... done</span></span>
<span class="line"><span>Creating jms_web       ... done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-jumpserver-04" tabindex="-1"><a class="header-anchor" href="#部署-jumpserver-04"><span>部署 JumpServer 04</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.24</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 NFS</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install nfs-utils</span></span>
<span class="line"><span>showmount -e 192.168.100.11</span></span>
<span class="line"><span># 将 Core 持久化目录挂载到 NFS, 默认 /opt/jumpserver/core/data, 请根据实际情况修改</span></span>
<span class="line"><span># JumpServer 持久化目录定义相关参数为 VOLUME_DIR, 在安装 JumpServer 过程中会提示</span></span>
<span class="line"><span>mkdir /opt/jumpserver/core/data</span></span>
<span class="line"><span>mount -t nfs 192.168.100.11:/data /opt/jumpserver/core/data</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 可以写入到 /etc/fstab, 重启自动挂载. 注意: 设置后如果 nfs 损坏或者无法连接该服务器将无法启动</span></span>
<span class="line"><span>echo &quot;192.168.100.11:/data /opt/jumpserver/core/data nfs defaults 0 0&quot; &gt;&gt; /etc/fstab</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下载 jumpserver-install</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>cd /opt</span></span>
<span class="line"><span>yum -y install wget</span></span>
<span class="line"><span>wget https://github.com/jumpserver/installer/releases/download/v2.21.0/jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>tar -xf jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>cd jumpserver-installer-v2.21.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改配置文件</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>vi config-example.txt</span></span>
<span class="line"><span># 修改下面选项, 其他保持默认, 请勿直接复制此处内容</span></span>
<span class="line"><span>### 注意: SECRET_KEY 和要其他 JumpServer 服务器一致, 加密的数据将无法解密</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 安装配置</span></span>
<span class="line"><span>### 注意持久化目录 VOLUME_DIR, 如果上面 NFS 挂载其他目录, 此处也要修改. 如: NFS 挂载到/data/jumpserver/core/data, 则 DOCKER_DIR=/data/jumpserver</span></span>
<span class="line"><span>VOLUME_DIR=/opt/jumpserver</span></span>
<span class="line"><span>DOCKER_DIR=/var/lib/docker</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Core 配置</span></span>
<span class="line"><span>### 启动后不能再修改，否则密码等等信息无法解密, 请勿直接复制下面的字符串</span></span>
<span class="line"><span>SECRET_KEY=kWQdmdCQKjaWlHYpPhkNQDkfaRulM6YnHctsHLlSPs8287o2kW</span></span>
<span class="line"><span>BOOTSTRAP_TOKEN=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>LOG_LEVEL=ERROR</span></span>
<span class="line"><span># SESSION_COOKIE_AGE=86400</span></span>
<span class="line"><span>SESSION_EXPIRE_AT_BROWSER_CLOSE=true</span></span>
<span class="line"><span></span></span>
<span class="line"><span># MySQL 配置</span></span>
<span class="line"><span>USE_EXTERNAL_MYSQL=1</span></span>
<span class="line"><span>DB_HOST=192.168.100.11</span></span>
<span class="line"><span>DB_PORT=3306</span></span>
<span class="line"><span>DB_USER=jumpserver</span></span>
<span class="line"><span>DB_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span>DB_NAME=jumpserver</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Redis 配置</span></span>
<span class="line"><span>USE_EXTERNAL_REDIS=1</span></span>
<span class="line"><span>REDIS_HOST=192.168.100.11</span></span>
<span class="line"><span>REDIS_PORT=6379</span></span>
<span class="line"><span>REDIS_PASSWORD=KXOeyNgDeTdpeu9q</span></span>
<span class="line"><span></span></span>
<span class="line"><span># KoKo Lion 配置</span></span>
<span class="line"><span>SHARE_ROOM_TYPE=redis</span></span>
<span class="line"><span>REUSE_CONNECTION=false</span></span>
<span class="line"><span>./jmsctl.sh install</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 JumpServer</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>./jmsctl.sh start</span></span>
<span class="line"><span>Creating network &quot;jms_net&quot; with driver &quot;bridge&quot;</span></span>
<span class="line"><span>Creating jms_core      ... done</span></span>
<span class="line"><span>Creating jms_celery    ... done</span></span>
<span class="line"><span>Creating jms_lion      ... done</span></span>
<span class="line"><span>Creating jms_koko      ... done</span></span>
<span class="line"><span>Creating jms_magnus    ... done</span></span>
<span class="line"><span>Creating jms_web       ... done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-haproxy-服务" tabindex="-1"><a class="header-anchor" href="#部署-haproxy-服务"><span>部署 HAProxy 服务</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.100</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>安装依赖</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum -y install epel-release</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>安装 HAProxy</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum install -y haproxy</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>配置 HAProxy</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>vi /etc/haproxy/haproxy.cfg</span></span>
<span class="line"><span>global</span></span>
<span class="line"><span>    # to have these messages end up in /var/log/haproxy.log you will</span></span>
<span class="line"><span>    # need to:</span></span>
<span class="line"><span>    #</span></span>
<span class="line"><span>    # 1) configure syslog to accept network log events.  This is done</span></span>
<span class="line"><span>    #    by adding the &#39;-r&#39; option to the SYSLOGD_OPTIONS in</span></span>
<span class="line"><span>    #    /etc/sysconfig/syslog</span></span>
<span class="line"><span>    #</span></span>
<span class="line"><span>    # 2) configure local2 events to go to the /var/log/haproxy.log</span></span>
<span class="line"><span>    #   file. A line like the following can be added to</span></span>
<span class="line"><span>    #   /etc/sysconfig/syslog</span></span>
<span class="line"><span>    #</span></span>
<span class="line"><span>    #    local2.*                       /var/log/haproxy.log</span></span>
<span class="line"><span>    #</span></span>
<span class="line"><span>    log         127.0.0.1 local2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    chroot      /var/lib/haproxy</span></span>
<span class="line"><span>    pidfile     /var/run/haproxy.pid</span></span>
<span class="line"><span>    maxconn     4000</span></span>
<span class="line"><span>    user        haproxy</span></span>
<span class="line"><span>    group       haproxy</span></span>
<span class="line"><span>    daemon</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # turn on stats unix socket</span></span>
<span class="line"><span>    stats socket /var/lib/haproxy/stats</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#---------------------------------------------------------------------</span></span>
<span class="line"><span># common defaults that all the &#39;listen&#39; and &#39;backend&#39; sections will</span></span>
<span class="line"><span># use if not designated in their block</span></span>
<span class="line"><span>#---------------------------------------------------------------------</span></span>
<span class="line"><span>defaults</span></span>
<span class="line"><span>    log                     global</span></span>
<span class="line"><span>    option                  dontlognull</span></span>
<span class="line"><span>    option                  redispatch</span></span>
<span class="line"><span>    retries                 3</span></span>
<span class="line"><span>    timeout http-request    10s</span></span>
<span class="line"><span>    timeout queue           1m</span></span>
<span class="line"><span>    timeout connect         10s</span></span>
<span class="line"><span>    timeout client          1m</span></span>
<span class="line"><span>    timeout server          1m</span></span>
<span class="line"><span>    timeout http-keep-alive 10s</span></span>
<span class="line"><span>    timeout check           10s</span></span>
<span class="line"><span>    maxconn                 3000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>listen stats</span></span>
<span class="line"><span>    bind *:8080</span></span>
<span class="line"><span>    mode http</span></span>
<span class="line"><span>    stats enable</span></span>
<span class="line"><span>    stats uri /haproxy                      # 监控页面, 请自行修改. 访问地址为 http://192.168.100.100:8080/haproxy</span></span>
<span class="line"><span>    stats refresh 5s</span></span>
<span class="line"><span>    stats realm haproxy-status</span></span>
<span class="line"><span>    stats auth admin:KXOeyNgDeTdpeu9q       # 账户密码, 请自行修改. 访问 http://192.168.100.100:8080/haproxy 会要求输入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#---------------------------------------------------------------------</span></span>
<span class="line"><span># check  检活参数说明</span></span>
<span class="line"><span># inter  间隔时间, 单位: 毫秒</span></span>
<span class="line"><span># rise   连续成功的次数, 单位: 次</span></span>
<span class="line"><span># fall   连续失败的次数, 单位: 次</span></span>
<span class="line"><span># 例: inter 2s rise 2 fall 3</span></span>
<span class="line"><span># 表示 2 秒检查一次状态, 连续成功 2 次服务正常, 连续失败 3 次服务异常</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># server 服务参数说明</span></span>
<span class="line"><span># server 192.168.100.21 192.168.100.21:80 weight 1 cookie web01</span></span>
<span class="line"><span># 第一个 192.168.100.21 做为页面展示的标识, 可以修改为其他任意字符串</span></span>
<span class="line"><span># 第二个 192.168.100.21:80 是实际的后端服务端口</span></span>
<span class="line"><span># weight 为权重, 多节点时安装权重进行负载均衡</span></span>
<span class="line"><span># cookie 用户侧的 cookie 会包含此标识, 便于区分当前访问的后端节点</span></span>
<span class="line"><span># 例: server db01 192.168.100.21:3306 weight 1 cookie db_01</span></span>
<span class="line"><span>#---------------------------------------------------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>listen jms-web</span></span>
<span class="line"><span>    bind *:80                               # 监听 80 端口</span></span>
<span class="line"><span>    mode http</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # redirect scheme https if !{ ssl_fc }  # 重定向到 https</span></span>
<span class="line"><span>    # bind *:443 ssl crt /opt/ssl.pem       # https 设置</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    option httpclose</span></span>
<span class="line"><span>    option forwardfor</span></span>
<span class="line"><span>    option httpchk GET /api/health/         # Core 检活接口</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cookie SERVERID insert indirect</span></span>
<span class="line"><span>    hash-type consistent</span></span>
<span class="line"><span>    fullconn 500</span></span>
<span class="line"><span>    balance leastconn</span></span>
<span class="line"><span>    server 192.168.100.21 192.168.100.21:80 weight 1 cookie web01 check inter 2s rise 2 fall 3  # JumpServer 服务器</span></span>
<span class="line"><span>    server 192.168.100.22 192.168.100.22:80 weight 1 cookie web02 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.23 192.168.100.23:80 weight 1 cookie web03 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.23 192.168.100.24:80 weight 1 cookie web03 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>listen jms-ssh</span></span>
<span class="line"><span>    bind *:2222</span></span>
<span class="line"><span>    mode tcp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    option tcp-check</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fullconn 500</span></span>
<span class="line"><span>    balance source</span></span>
<span class="line"><span>    server 192.168.100.21 192.168.100.21:2222 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.22 192.168.100.22:2222 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.23 192.168.100.23:2222 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.24 192.168.100.23:2222 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>listen jms-koko</span></span>
<span class="line"><span>    mode http</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    option httpclose</span></span>
<span class="line"><span>    option forwardfor</span></span>
<span class="line"><span>    option httpchk GET /koko/health/ HTTP/1.1\\r\\nHost:\\ 192.168.100.100  # KoKo 检活接口, host 填写 HAProxy 的 ip 地址</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cookie SERVERID insert indirect</span></span>
<span class="line"><span>    hash-type consistent</span></span>
<span class="line"><span>    fullconn 500</span></span>
<span class="line"><span>    balance leastconn</span></span>
<span class="line"><span>    server 192.168.100.21 192.168.100.21:80 weight 1 cookie web01 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.22 192.168.100.22:80 weight 1 cookie web02 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.23 192.168.100.23:80 weight 1 cookie web03 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.24 192.168.100.23:80 weight 1 cookie web03 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>listen jms-lion</span></span>
<span class="line"><span>    mode http</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    option httpclose</span></span>
<span class="line"><span>    option forwardfor</span></span>
<span class="line"><span>    option httpchk GET /lion/health/ HTTP/1.1\\r\\nHost:\\ 192.168.100.100  # Lion 检活接口, host 填写 HAProxy 的 ip 地址</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    cookie SERVERID insert indirect</span></span>
<span class="line"><span>    hash-type consistent</span></span>
<span class="line"><span>    fullconn 500</span></span>
<span class="line"><span>    balance leastconn</span></span>
<span class="line"><span>    server 192.168.100.21 192.168.100.21:80 weight 1 cookie web01 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.22 192.168.100.22:80 weight 1 cookie web02 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.23 192.168.100.23:80 weight 1 cookie web03 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span>    server 192.168.100.24 192.168.100.23:80 weight 1 cookie web03 check inter 2s rise 2 fall 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>listen jms-mysql</span></span>
<span class="line"><span>    bind *:33060</span></span>
<span class="line"><span>    mode tcp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    option tcp-check</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fullconn 500</span></span>
<span class="line"><span>    balance source</span></span>
<span class="line"><span>    server 192.168.100.21 192.168.100.21:33060 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.22 192.168.100.22:33060 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.23 192.168.100.23:33060 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.24 192.168.100.23:33060 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>listen jms-mariadb</span></span>
<span class="line"><span>    bind *:33061</span></span>
<span class="line"><span>    mode tcp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    option tcp-check</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    fullconn 500</span></span>
<span class="line"><span>    balance source</span></span>
<span class="line"><span>    server 192.168.100.21 192.168.100.21:33061 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.22 192.168.100.22:33061 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.23 192.168.100.23:33061 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span>
<span class="line"><span>    server 192.168.100.24 192.168.100.23:33061 weight 1 check inter 2s rise 2 fall 3 send-proxy</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 Selinux</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>setsebool -P haproxy_connect_any 1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>启动 HAProxy</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>systemctl enable haproxy</span></span>
<span class="line"><span>systemctl start haproxy</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置防火墙</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>firewall-cmd --permanent --zone=public --add-port=80/tcp</span></span>
<span class="line"><span>firewall-cmd --permanent --zone=public --add-port=443/tcp</span></span>
<span class="line"><span>firewall-cmd --permanent --zone=public --add-port=2222/tcp</span></span>
<span class="line"><span>firewall-cmd --permanent --zone=public --add-port=33060/tcp</span></span>
<span class="line"><span>firewall-cmd --permanent --zone=public --add-port=33061/tcp</span></span>
<span class="line"><span>firewall-cmd --reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="部署-minio-服务" tabindex="-1"><a class="header-anchor" href="#部署-minio-服务"><span>部署 MinIO 服务</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.41</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 集群部署请参考 (http://docs.minio.org.cn/docs/master/minio-erasure-code-quickstart-guide)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装 Docker</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum install -y yum-utils device-mapper-persistent-data lvm2</span></span>
<span class="line"><span>yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</span></span>
<span class="line"><span>sed -i &#39;s+download.docker.com+mirrors.aliyun.com/docker-ce+&#39; /etc/yum.repos.d/docker-ce.repo</span></span>
<span class="line"><span>yum makecache fast</span></span>
<span class="line"><span>yum -y install docker-ce</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 Docker</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>mkdir /etc/docker/</span></span>
<span class="line"><span>vi /etc/docker/daemon.json</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;live-restore&quot;: true,</span></span>
<span class="line"><span>  &quot;registry-mirrors&quot;: [</span></span>
<span class="line"><span>    &quot;https://docker.zhai.cm&quot;,</span></span>
<span class="line"><span>    &quot;https://a.ussh.net&quot;,</span></span>
<span class="line"><span>    &quot;https://hub.littlediary.cn&quot;,</span></span>
<span class="line"><span>    &quot;https://hub.rat.dev&quot;,</span></span>
<span class="line"><span>    &quot;https://atomhub.openatom.cn&quot;,</span></span>
<span class="line"><span>    &quot;https://docker.m.daocloud.io&quot;,</span></span>
<span class="line"><span>    &quot;https://docker.1ms.run&quot;,</span></span>
<span class="line"><span>    &quot;https://dytt.online&quot;,</span></span>
<span class="line"><span>    &quot;https://func.ink&quot;,</span></span>
<span class="line"><span>    &quot;https://lispy.org&quot;,</span></span>
<span class="line"><span>    &quot;https://docker.xiaogenban1993.com&quot;,</span></span>
<span class="line"><span>    &quot;https://docker.mybacc.com&quot;,</span></span>
<span class="line"><span>    &quot;https://docker.yomansunter.com&quot;,</span></span>
<span class="line"><span>    &quot;https://dockerhub.websoft9.com&quot;</span></span>
<span class="line"><span>  ],</span></span>
<span class="line"><span>  &quot;log-driver&quot;: &quot;json-file&quot;,</span></span>
<span class="line"><span>  &quot;log-opts&quot;: {&quot;max-file&quot;: &quot;3&quot;, &quot;max-size&quot;: &quot;10m&quot;}</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 Docker</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>systemctl enable docker</span></span>
<span class="line"><span>systemctl start docker</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下载 MinIO 镜像</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>docker pull minio/minio:latest</span></span>
<span class="line"><span>latest: Pulling from minio/minio</span></span>
<span class="line"><span>a591faa84ab0: Pull complete</span></span>
<span class="line"><span>76b9354adec6: Pull complete</span></span>
<span class="line"><span>f9d8746550a4: Pull complete</span></span>
<span class="line"><span>890b1dd95baa: Pull complete</span></span>
<span class="line"><span>3a8518c890dc: Pull complete</span></span>
<span class="line"><span>8053f0501aed: Pull complete</span></span>
<span class="line"><span>506c41cb8532: Pull complete</span></span>
<span class="line"><span>Digest: sha256:e7a725edb521dd2af07879dad88ee1dfebd359e57ad8d98104359ccfbdb92024</span></span>
<span class="line"><span>Status: Downloaded newer image for minio/minio:latest</span></span>
<span class="line"><span>docker.io/minio/minio:latest</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>持久化数据目录</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>mkdir -p /opt/jumpserver/minio/data /opt/jumpserver/minio/config</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>启动 MinIO</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>## 请自行修改账号密码并牢记，丢失后可以删掉容器后重新用新密码创建，数据不会丢失</span></span>
<span class="line"><span># 9000                                  # api     访问端口</span></span>
<span class="line"><span># 9001                                  # console 访问端口</span></span>
<span class="line"><span># MINIO_ROOT_USER=minio                 # minio 账号</span></span>
<span class="line"><span># MINIO_ROOT_PASSWORD=KXOeyNgDeTdpeu9q  # minio 密码</span></span>
<span class="line"><span>docker run --name jms_minio -d -p 9000:9000 -p 9001:9001 -e MINIO_ROOT_USER=minio -e MINIO_ROOT_PASSWORD=KXOeyNgDeTdpeu9q -v /opt/jumpserver/minio/data:/data -v /opt/jumpserver/minio/config:/root/.minio --restart=always minio/minio:latest server /data --console-address &quot;:9001&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置 MinIO</p><ul><li>访问 http://192.168.100.41:9000，输入刚才设置的 MinIO 账号密码登录</li><li>点击左侧菜单的 Buckets，选择 Create Bucket 创建桶，Bucket Name 输入 jumpserver，然后点击 Save 保存</li></ul><p>设置 JumpServer</p><ul><li>访问 JumpServer Web 页面并使用管理员账号进行登录</li><li>点击左侧菜单栏的 [终端管理]，在页面的上方选择 [存储配置]，在 [录像存储] 下方选择 [创建] 选择 [Ceph]</li><li>根据下方的说明进行填写，保存后在 [终端管理] 页面对所有组件进行 [更新]，录像存储选择 [jms-mino]，提交</li></ul><table><thead><tr><th>选项</th><th>参考值</th><th>说明</th></tr></thead><tbody><tr><td>名称 (Name)</td><td>jms-minio</td><td>标识, 不可重复</td></tr><tr><td>类型 (Type)</td><td>Ceph</td><td>固定, 不可更改</td></tr><tr><td>桶名称 (Bucket)</td><td>jumpserver</td><td>Bucket Name</td></tr><tr><td>Access key</td><td>minio</td><td>MINIO_ROOT_USER</td></tr><tr><td>Secret key</td><td>KXOeyNgDeTdpeu9q</td><td>MINIO_ROOT_PASSWORD</td></tr><tr><td>端点 (Endpoint)</td><td>http://192.168.100.41:9000</td><td>minio 服务访问地址</td></tr><tr><td>默认存储</td><td></td><td>新组件将自动使用该存储</td></tr></tbody></table><h2 id="部署-elasticsearch-服务" tabindex="-1"><a class="header-anchor" href="#部署-elasticsearch-服务"><span>部署 Elasticsearch 服务</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span>服务器: 192.168.100.51</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 集群部署请参考 (https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装 Docker</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>yum install -y yum-utils device-mapper-persistent-data lvm2</span></span>
<span class="line"><span>yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo</span></span>
<span class="line"><span>sed -i &#39;s+download.docker.com+mirrors.aliyun.com/docker-ce+&#39; /etc/yum.repos.d/docker-ce.repo</span></span>
<span class="line"><span>yum makecache fast</span></span>
<span class="line"><span>yum -y install docker-ce</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置 Docker</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> mkdir</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/docker</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> tee</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/docker/daemon.json</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> &lt;&lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">EOF</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">{</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">  &quot;registry-mirrors&quot;: [</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://docker.zhai.cm&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://a.ussh.net&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://hub.littlediary.cn&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://hub.rat.dev&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://atomhub.openatom.cn&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://docker.m.daocloud.io&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://docker.1ms.run&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://dytt.online&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://func.ink&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://lispy.org&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://docker.xiaogenban1993.com&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://docker.mybacc.com&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://docker.yomansunter.com&quot;,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;https://dockerhub.websoft9.com&quot;</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">  ]</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">EOF</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> systemctl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> daemon-reload</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> systemctl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> restart</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> docker</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动 Docker</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>systemctl enable docker</span></span>
<span class="line"><span>systemctl start docker</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下载 Elasticsearch 镜像</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>docker pull docker.elastic.co/elasticsearch/elasticsearch:7.16.1</span></span>
<span class="line"><span>7a0437f04f83: Pull complete</span></span>
<span class="line"><span>7718d2f58c47: Pull complete</span></span>
<span class="line"><span>cc5c16bd8bb9: Pull complete</span></span>
<span class="line"><span>e3d829b4b297: Pull complete</span></span>
<span class="line"><span>1ad944c92c79: Pull complete</span></span>
<span class="line"><span>373fb8fbaf74: Pull complete</span></span>
<span class="line"><span>5908d3eb2989: Pull complete</span></span>
<span class="line"><span>Digest: sha256:81c126e4eddbc5576285670cb3e23d7ef7892ee5e757d6d9ba870b6fe99f1219</span></span>
<span class="line"><span>Status: Downloaded newer image for docker.elastic.co/elasticsearch/elasticsearch:7.16.1</span></span>
<span class="line"><span>docker.elastic.co/elasticsearch/elasticsearch:7.16.1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>持久化数据目录</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>mkdir -p /opt/jumpserver/elasticsearch/data /opt/jumpserver/elasticsearch/logs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>启动 Elasticsearch</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>## 请自行修改账号密码并牢记，丢失后可以删掉容器后重新用新密码创建，数据不会丢失</span></span>
<span class="line"><span># 9200                                  # Web 访问端口</span></span>
<span class="line"><span># 9300                                  # 集群通信</span></span>
<span class="line"><span># discovery.type=single-node            # 单节点</span></span>
<span class="line"><span># bootstrap.memory_lock=&quot;true&quot;          # 锁定物理内存, 不使用 swap</span></span>
<span class="line"><span># xpack.security.enabled=&quot;true&quot;         # 开启安全模块</span></span>
<span class="line"><span># TAKE_FILE_OWNERSHIP=&quot;true&quot;            # 自动修改挂载文件夹的所属用户</span></span>
<span class="line"><span># ES_JAVA_OPTS=&quot;-Xms512m -Xmx512m&quot;      # JVM 内存大小, 推荐设置为主机内存的一半</span></span>
<span class="line"><span># elastic                               # Elasticsearch 账号</span></span>
<span class="line"><span># ELASTIC_PASSWORD=KXOeyNgDeTdpeu9q     # Elasticsearch 密码</span></span>
<span class="line"><span>docker run --name jms_es -d -p 9200:9200 -p 9300:9300 -e cluster.name=docker-cluster -e discovery.type=single-node -e network.host=0.0.0.0 -e bootstrap.memory_lock=&quot;true&quot; -e xpack.security.enabled=&quot;true&quot; -e TAKE_FILE_OWNERSHIP=&quot;true&quot; -e ES_JAVA_OPTS=&quot;-Xms512m -Xmx512m&quot; -e ELASTIC_PASSWORD=KXOeyNgDeTdpeu9q -v /opt/jumpserver/elasticsearch/data:/usr/share/elasticsearch/data -v /opt/jumpserver/elasticsearch/logs:/usr/share/elasticsearch/logs --restart=always docker.elastic.co/elasticsearch/elasticsearch:7.16.1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置 JumpServer</p><ul><li>访问 JumpServer Web 页面并使用管理员账号进行登录</li><li>点击左侧菜单栏的 [终端管理]，在页面的上方选择 [存储配置]，在 [命令存储] 下方选择 [创建] 选择 [Elasticsearch]</li><li>根据下方的说明进行填写，保存后在 [终端管理] 页面对所有组件进行 [更新]，命令存储选择 [jms-es]，提交</li></ul><table><thead><tr><th>选项</th><th>参考值</th><th>说明</th></tr></thead><tbody><tr><td>名称 (Name)</td><td>jms-es</td><td>标识, 不可重复</td></tr><tr><td>类型 (Type)</td><td>Elasticsearch</td><td>固定, 不可更改</td></tr><tr><td>主机 (Hosts)</td><td>http://elastic:KXOeyNgDeTdpeu9q@192.168.100.51:9200</td><td>http://es_host:es_port</td></tr><tr><td>索引 (Index)</td><td>jumpserver</td><td>索引</td></tr><tr><td>忽略证书认证</td><td></td><td>https 自签 ssl 需要勾选</td></tr><tr><td>默认存储</td><td></td><td>新组件将自动使用该存储</td></tr></tbody></table><h2 id="升级-注意事项" tabindex="-1"><a class="header-anchor" href="#升级-注意事项"><span>升级 注意事项</span></a></h2><p>更新前请一定要做好备份工作</p><ul><li>升级前请关闭所有 JumpServer 节点</li><li>在任意一个 JumpServer 节点按照升级文档完成升级操作</li><li>仔细检查该节点升级过程确保无异常</li><li>然后按照升级文档对其他 JumpServer 节点升级即可</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>cd /opt</span></span>
<span class="line"><span>wget https://github.com/jumpserver/installer/releases/download/v2.21.0/jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>tar -xf jumpserver-installer-v2.21.0.tar.gz</span></span>
<span class="line"><span>cd jumpserver-installer-v2.21.0</span></span>
<span class="line"><span># 额外节点可以设置 SKIP_BACKUP_DB=1 跳过数据库备份, 第一个升级节点不要跳过备份</span></span>
<span class="line"><span>export SKIP_BACKUP_DB=1</span></span>
<span class="line"><span>./jmsctl.sh upgrade</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,142)])])}const c=n(l,[["render",p]]),t=JSON.parse('{"path":"/note-book/JumperServer/JumpServer%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E9%83%A8%E7%BD%B2.html","title":"JumpServer负载均衡部署","lang":"zh-CN","frontmatter":{"description":"JumpServer负载均衡部署 环境说明 除 JumpServer 自身组件外，其他组件的高可用请参考对应的官方文档进行部署 按照此方式部署后，后续只需要根据需要扩容 JumpServer 节点然后添加节点到 HAProxy 即可 如果已经有 HLB 或者 SLB 可以跳过 HAProxy 部署，第三方 LB 要注意 session 和 websoc...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JumpServer负载均衡部署\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-09-03T03:07:12.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/JumperServer/JumpServer%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1%E9%83%A8%E7%BD%B2.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"JumpServer负载均衡部署"}],["meta",{"property":"og:description","content":"JumpServer负载均衡部署 环境说明 除 JumpServer 自身组件外，其他组件的高可用请参考对应的官方文档进行部署 按照此方式部署后，后续只需要根据需要扩容 JumpServer 节点然后添加节点到 HAProxy 即可 如果已经有 HLB 或者 SLB 可以跳过 HAProxy 部署，第三方 LB 要注意 session 和 websoc..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-09-03T03:07:12.000Z"}],["meta",{"property":"article:modified_time","content":"2025-09-03T03:07:12.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1756868832000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":3,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":1,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"699fa95f0274bccb01f74b0e5d0d9e0673d9e369","time":1756868832000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"format index"},{"hash":"acc20ecd1bcdb70acdb85ab952a0db582179691b","time":1744337611000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Firefox密码提取"},{"hash":"ae29d7074d60015174d3e3db25f907d496a41df2","time":1710839506000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"标题格式化"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":17.02,"words":5106},"filePathRelative":"note-book/JumperServer/JumpServer负载均衡部署.md","excerpt":"\\n<h2>环境说明</h2>\\n<ul>\\n<li>除 JumpServer 自身组件外，其他组件的高可用请参考对应的官方文档进行部署</li>\\n<li>按照此方式部署后，后续只需要根据需要扩容 JumpServer 节点然后添加节点到 HAProxy 即可</li>\\n<li>如果已经有 HLB 或者 SLB 可以跳过 HAProxy 部署，第三方 LB 要注意 session 和 websocket 问题</li>\\n<li>如果已经有 云存储 (* S3/Ceph/Swift/OSS/Azure) 可以跳过 MinIO 部署，MySQL Redis 也一样</li>\\n<li>生产环境中，应该使用 Ceph 等替代 NFS，或者部署高可用的 NFS 防止单点故障</li>\\n<li><a href=\\"https://github.com/wojiushixiaobai/redis-sentinel\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Redis 高可用快速部署可以参考此项目</a></li>\\n</ul>","autoDesc":true}');export{c as comp,t as data};
