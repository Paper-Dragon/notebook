import{ah as i,ai as a,ar as n,am as l}from"./app-C9yoftjo.js";const e="/assets/image-20211116145510909-16370457460581-G5eQ5LpB.png",t="/assets/image-20211116145621627-BkN9L6q3.png",h="/assets/image-20211116151442638-PXTHFINz.png",p="/assets/image-20211117083904657-CqsDFcNx.png",k="/assets/image-20211117231143675-TFiEJl54.png",d="/assets/image-20211117231243044-BeqQx1GM.png",r="/assets/image-20211117231251486-Bve6ZOLW.png",c="/assets/image-20211117231308169-CIEZNvXw.png",g="/assets/image-20211117235501571-D1Yx6qav.png",o="/assets/image-20211118000511866-C2-Pr4Se.png",F="/assets/image-20211118000504423-BE_vty5Z.png",u="/assets/image-20211118000526400-ArLCOjOE.png",A="/assets/image-20211118000641707-DJbQqY-S.png",y={};function v(m,s){return l(),a("div",null,s[0]||(s[0]=[n('<h1 id="elk日志分析系统" tabindex="-1"><a class="header-anchor" href="#elk日志分析系统"><span>ELK日志分析系统</span></a></h1><p><img src="'+e+'" alt="image-20211116145510909"></p><p><img src="'+t+'" alt="image-20211116145621627"></p><h1 id="e-elasticsearch" tabindex="-1"><a class="header-anchor" href="#e-elasticsearch"><span>E Elasticsearch</span></a></h1><p>弹性搜索，日志<strong>存储</strong></p><h1 id="l-logstash" tabindex="-1"><a class="header-anchor" href="#l-logstash"><span>L Logstash</span></a></h1><p>日志收集</p><h1 id="k-kibana" tabindex="-1"><a class="header-anchor" href="#k-kibana"><span>K Kibana</span></a></h1><p>日志展示</p><p><img src="'+h+`" alt=""></p><h1 id="实战" tabindex="-1"><a class="header-anchor" href="#实战"><span>实战</span></a></h1><h2 id="环境" tabindex="-1"><a class="header-anchor" href="#环境"><span>环境</span></a></h2><p>操作系统优化</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> stop</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> firewalld</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> disable</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> firewalld</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">setenforce</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sed</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -i</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;s/SELINUX.*/SELINUX=disabled/g&#39;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/selinux/conf</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 时间一致</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 域名解析</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">172.16.100.18</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> elk-node1</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">172.16.100.21</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> elk-node2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>master-slave模式</p><p><img src="`+p+`" alt="image-20211117083904657"></p><p>内存：大于2G</p><h2 id="elasticsearch" tabindex="-1"><a class="header-anchor" href="#elasticsearch"><span>Elasticsearch</span></a></h2><h3 id="基础环境安装-node1-node2同时进行" tabindex="-1"><a class="header-anchor" href="#基础环境安装-node1-node2同时进行"><span>基础环境安装 node1 node2同时进行</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# cd /etc/yum.repos.d/</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# vi elasticsearch.repo</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[elasticsearch-2.x]</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">Elasticsearch</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> repository</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> for</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 2.x</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> packages</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">baseurl</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">http://packages.elastic.co/elasticsearch/2.x/centos</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">gpgcheck</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">gpgkey</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">http://packages.elastic.co/GPG-KEY-elasticsearch</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">enable</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# yum list       </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#查看yum清单</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# yum install elasticsearch -y    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#安装elasticsearch</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# yum install java -y      </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#安装Java</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# java -version           </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#查看Java版本</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">openjdk</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> version</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;1.8.0_131&quot;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">OpenJDK</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Runtime</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Environment</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (build </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">1.8.0_131-b12</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">OpenJDK</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 64-Bit</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> VM</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (build </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">25.131-b12,</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> mixed</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> mode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">修改配置文件</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# vi /etc/elasticsearch/elasticsearch.yml</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">17行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 集群名称</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">cluster.name:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> elastic</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">23行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 节点名称</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">node.name:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> linux-node1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">33行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 工作目录</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">path.data:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /data/es-data</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">path.logs:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /var/log/elasticsearch/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">43行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 防止交换swap分区</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">bootstrap.memory_lock:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">54行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 监听网络</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">network.host:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0.0.0.0</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">58行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 端口</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">http.port:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 9200</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">关闭组播</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">discovery.zen.ping.multicast.enabled:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> false</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">单播</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">discuvery.zen.ping.unicast.hosts:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;elk-host1&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;elk-host2&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">创建目录及开启服务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# mkdir -p /data/es-data</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# chown -R elasticsearch:elasticsearch /data/es-data</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# systemctl start elasticsearch.service </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# netstat -anpt | </span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 9200</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">tcp6</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">       0</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">      0</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :::9200</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                 :::</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">*</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                    LISTEN</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">      54134/java</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">测试</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">http://20.0.0.10:9200</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# curl -i -XGET </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;http://20.0.0.20:9200/_count?pretty&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> -d </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;{</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt; &quot;query&quot;: {</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt;     &quot;match_all&quot;: {}</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt; }</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt; }&#39;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">HTTP/1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 200</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> OK</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">       #输出项</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Content-Type:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> application/json</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">charset</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">UTF-8</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Content-Length:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 95</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  &quot;count&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  &quot;_shards&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    &quot;total&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    &quot;successful&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    &quot;failed&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node2 yum.repos.d]# curl -i -XGET </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;http://20.0.0.10:9200/_count?pretty&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> -d </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;{</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt; &quot;query&quot;: {</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt;     &quot;match_all&quot;: {}</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt; }</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&gt; }&#39;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">HTTP/1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 200</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> OK</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">      #输出项</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Content-Type:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> application/json</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">charset</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">UTF-8</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Content-Length:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 95</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  &quot;count&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  &quot;_shards&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    &quot;total&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    &quot;successful&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 0,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    &quot;failed&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> :</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装插件1" tabindex="-1"><a class="header-anchor" href="#安装插件1"><span>安装插件1</span></a></h3><p>elk-node1/node2都安装</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">安装Elasticsearch插件</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# /usr/share/elasticsearch/bin/plugin install mobz/elasticsearch-head</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">测试</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">http://20.0.0.10:9200/_plugin/head/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>elasticsearch集群部署</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# vi /etc/elasticsearch/elasticsearch.yml</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">69行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 单播列表自动发现机制</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">discovery.zen.ping.unicast.hosts:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;20.0.0.10&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;20.0.0.20&quot;]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">重启服务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 yum.repos.d]# systemctl restart elasticsearch.service</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">测试</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">http://20.0.0.10:9200/_plugin/head/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装插件2" tabindex="-1"><a class="header-anchor" href="#安装插件2"><span>安装插件2</span></a></h3><p>安装监控组件</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 elasticsearch]# /usr/share/elasticsearch/bin/plugin install lmenezes/elasticsearch-kopf</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">chown</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -R</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> elasticsearch:elasticsearch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/share/elasticsearch/plugins</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="两台服务器均可插件测试" tabindex="-1"><a class="header-anchor" href="#两台服务器均可插件测试"><span>两台服务器均可插件测试</span></a></h3><p><img src="`+k+'" alt="image-20211117231143675"></p><p><img src="'+d+'" alt="image-20211117231243044"></p><p><img src="'+r+'" alt="image-20211117231251486"></p><p><img src="'+c+`" alt="image-20211117231308169"></p><h2 id="logstash" tabindex="-1"><a class="header-anchor" href="#logstash"><span>Logstash</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Apache</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">安装httpd并开启服务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 elasticsearch]# rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 elasticsearch]# vi /etc/yum.repos.d/logstash.repo</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[logstash-2.1]</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">Logstash</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> repository</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> for</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 2.1.x</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> packages</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">baseurl</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">http://packages.elastic.co/logstash/2.1/centos</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">gpgcheck</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">gpgkey</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">http://packages.elastic.co/GPG-KEY-elasticsearch</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">enable</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">安装Logstash</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 elasticsearch]# yum install logstash -y</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">安装java环境，没有自带安装使用yum</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -y</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> java安装</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache ~]# yum -y install java</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache ~]# java -version</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">openjdk</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> version</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;1.8.0_131&quot;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">OpenJDK</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Runtime</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Environment</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (build </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">1.8.0_131-b12</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">OpenJDK</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 64-Bit</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> VM</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (build </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">25.131-b12,</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> mixed</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> mode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache bin]# ln -s /opt/logstash/bin/logstash /usr/local/bin/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">logstash（apache）与elasticsearch（node）功能是否正常，做对接测试</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache bin]# logstash -e </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;input { stdin{} } output { stdout{} }&#39;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Settings:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Default</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> filter</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> workers:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Logstash</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> startup</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> completed</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">www.baidu.com</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">                       </span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">2020-11-18T07:53:59.480Z</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> apache</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> www.baidu.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>logstash命令选项解释：</p><pre><code>-f：指定logstash的配置文件，根据配置文件配置logstash
-e：后面跟着字符串，该字符串可以被当做logstash的配置（如果是“ ”，则默认使用stdin做输入，stdout为输出）
-t：测试配置文件是否正确，然后退出
#输入采用标准输入，输出采用标准输出
</code></pre><p>使用rubydebug显示详细输出</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache bin]# logstash -e </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;input { stdin{} } output { stdout{ codec =&gt; rubydebug } }&#39;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Settings:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Default</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> filter</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> workers:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Logstash</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> startup</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> completed</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">www.baidu.com</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">       &quot;message&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;www.baidu.com&quot;,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">      &quot;@version&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;1&quot;,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    &quot;@timestamp&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;2020-11-18T08:40:57.598Z&quot;,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          &quot;host&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;apache&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">使用logstash将信息输出给elasticsearch</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache bin]# logstash -e </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;input { stdin{} } output { elasticsearch { hosts =&gt; [&quot;20.0.0.10:9200&quot;] } }&#39;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Settings:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Default</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> filter</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> workers:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Logstash</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> startup</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> completed</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">abc123</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">      #输入内容</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">tom456</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">123jerry</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在logstash收集系统日志</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">logstash配置文件主要由三部分组成：input、output、filter</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache bin]# chmod o+r /var/log/messages   </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#允许其他用户访问</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache bin]#  ll /var/log/messages</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-rw----r--.</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> root</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> root</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 250721</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 11月</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 18</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 16:40</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /var/log/message</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache ~]# vi /etc/logstash/conf.d/system.conf</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">input</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">                    #logstash输入：从/var/log/messages输入，类型为system，起始位                     置为从头开始</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">        file</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/var/log/messages&quot;</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">          type</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;system&quot;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          start_position</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;beginning&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">output</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">                #logstash输出：输出给elasticsearch（以IP地址指定位置）</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">        elasticsearch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">        hosts</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; [</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;20.0.0.10:9200&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">        index</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;system-%{+YYY.MM.dd}&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache ~]# systemctl restart logstash.service</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模块总结</p><p><img src="`+g+`" alt="image-20211117235501571"></p><h2 id="kibana" tabindex="-1"><a class="header-anchor" href="#kibana"><span>Kibana</span></a></h2><p>添加logstash配置，收集apache服务的访问日志和错误日志中的数据</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">上传kibana-4.3.1-linux-x64.tar.gz到/root下</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">wget</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> https://download.elastic.co/kibana/kibana/kibana-4.3.1-linux-x64.tar.gz</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# tar zxf kibana-4.3.1-linux-x64.tar.gz</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# mv kibana-4.3.1-linux-x64 kibana</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# mv kibana /usr/local/</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 ~]# cd /usr/local/kibana/</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 kibana]# vi config/kibana.yml</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">//2行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> kibana打开的端口</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">server.port:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 5601</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">//5行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> kibana侦听的地址</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">server.host:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;0.0.0.0&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">//12行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 和elasticsearch建立联系</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">elasticsearch.url:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;http://20.0.0.10:9200&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">//20行</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 在elasticsearch中添加.kibana索引</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">kibana.index:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;.kibana&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 kibana]# yum -y install screen</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">启动kibana</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@node1 kibana]# /usr/local/kibana/bin/kibana</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache ~]# cd /etc/logstash/conf.d/</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache conf.d]# vi apache_log.conf</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">input</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">        file</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/etc/httpd/logs/access_log&quot;</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">          type</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;access&quot;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          start_position</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;beginning&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">        file</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;/etc/httpd/logs/error_log&quot;</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">          type</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;error&quot;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          start_position</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;beginning&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">output</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [type] </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">==</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;access&quot;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          elasticsearch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">            hosts</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; [</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;20.0.0.10:9200&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">            index</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;apache_access-%{+YYY.MM.dd}&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">          }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [type] == </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;error&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">          elasticsearch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">            hosts</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; [</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;20.0.0.10:9200&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">            index</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> =&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;apache_error-%{+YYY.MM.dd}&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">          }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@apache conf.d]# logstash -f apache_log.conf    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#指定logstash的配置文件，根据apache_log.conf配置logstash（-f可以不重启加载）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+o+'" alt="image-20211118000511866"></p><p><img src="'+F+'" alt="image-20211118000504423"></p><p><img src="'+u+'" alt="image-20211118000526400"></p><p><img src="'+A+`" alt="image-20211118000641707"></p><h1 id="elasticsearch-redis" tabindex="-1"><a class="header-anchor" href="#elasticsearch-redis"><span>Elasticsearch + Redis</span></a></h1><p>首先从redis这台服务器下手吧</p><pre><code>yum install -y redis

关于redis的具体操作以后的文章会讲到

vim /etc/redis.conf
修改
bind 0.0.0.0
保存退出，启动
/etc/init.d/redis start

ss -tanl查看redis启动端口6379
</code></pre><p>web server （192.168.1.13）：</p><pre><code>yum install -y httpd
/etc/init.d/httpd start
ss -tanl 查看一下80端口是否启动
</code></pre><p>安装logstash</p><pre><code>rpm -ivh logstash-1.5.4-1.noarch.rpm

vim /etc/logstash/conf.d/full.conf #full.conf这个你可以随意起名字
input { 
        file {
                path =&gt; &quot;/var/log/httpd/access_log&quot;
                type =&gt; &quot;Apache&quot;
                start_position =&gt; &quot;beginning&quot;
        }
}

output {
        redis {
                port =&gt; &quot;6379&quot;
                host =&gt; [&quot;192.168.1.12&quot;]
                data_type =&gt; &quot;list&quot;
                key =&gt; &quot;logstash-%{type}&quot;
        }
}

保存退出！

测试一下语法有没有错误：
[root@linux-node4 ~]# logstash -f /etc/logstash/conf.d/full.conf --configtest
Configuration OK

没有错误可以启动了
[root@linux-node4 ~]# logstash -f /etc/logstash/conf.d/full.conf
Logstash startup completed
</code></pre><p>至此，我们可以测试一下，是否把收集到的日志数据发送到了redis。</p><pre><code>#redis-cli
127.0.0.1:6379&gt; LLEN logstash-Apache
(integer) 38
127.0.0.1:6379&gt; LINDEX logstash-Apache 1
&quot;{\\&quot;message\\&quot;:\\&quot;192.168.1.159 - - [16/May/2018:19:29:39 +0800] \\\\\\&quot;GET / HTTP/1.1\\\\\\&quot; 304 - \\\\\\&quot;-\\\\\\&quot; \\\\\\&quot;Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0\\\\\\&quot;\\&quot;,\\&quot;@version\\&quot;:\\&quot;1\\&quot;,\\&quot;@timestamp\\&quot;:\\&quot;2018-05-16T13:13:48.004Z\\&quot;,\\&quot;host\\&quot;:\\&quot;0.0.0.0\\&quot;,\\&quot;path\\&quot;:\\&quot;/var/log/httpd/access_log\\&quot;,\\&quot;type\\&quot;:\\&quot;Apache\\&quot;}&quot;
127.0.0.1:6379&gt; 
由此说明已经产生数据到redis了。
</code></pre><p>接下来在logstash server这台机器上操作</p><p>logstash安装不再演示</p><pre><code>vim fromredis.conf
input {
        redis {
                port =&gt; &quot;6379&quot;
                host =&gt; &quot;192.168.1.12&quot;
                data_type =&gt; &quot;list&quot;
                key =&gt; &quot;logstash-Apache&quot;
        }
}

output {
        stdout {
                codec =&gt; rubydebug
        }
}

测试语法是否正确：
[root@linux-node2 conf.d]# logstash -f /etc/logstash/conf.d/fromredis.conf --configtest
Configuration OK
运行：
[root@linux-node2 conf.d]# logstash -f /etc/logstash/conf.d/fromredis.conf
</code></pre><p>至这里，运行结果会把收集到的日志信息，标准输入至屏幕；</p><p>打开浏览器输入&quot; <a href="http://192.168.1.13" target="_blank" rel="noopener noreferrer">http://192.168.1.13</a>&quot; 刷新几次，你会发现logstach server 这台服务器的屏幕会出现日志滚动信息，都是刚刚刷新收集到的最新日志信息；</p><p>最后,在es这台机器上，安装elasticsearch + kibana,安装方法不再演示:</p><pre><code>vim /etc/elasticsearch/elasticsearch.yml
cluster.name: myes
node.name: &quot;linux-node1&quot;
保存退出，并启动

编辑kibana的配置文件：
/usr/local/kibana/config/kibana.yml
elasticsearch_url: &quot; #这一项非常重要 

启动kibana：
/usr/local/kibana/bin/kibana

复制一个终端
ss -tanl 查看5601端口是否开启
</code></pre><p>浏览器输入&quot; <a href="http://192.168.1.10:5601%22%E6%89%93%E5%BC%80kibana%E7%95%8C%E9%9D%A2" target="_blank" rel="noopener noreferrer">http://192.168.1.10:5601&quot;打开kibana界面</a></p><p>接下来还返回logstash server服务器</p><p>前面，我们是将结果标准输出到了屏幕，这次我们需要把结果输出到elasticsearch服务器</p><pre><code>vim /etc/logstash/conf.d/fromredis.conf 
修改为：
input {
        redis {
                port =&gt; &quot;6379&quot;
                host =&gt; &quot;192.168.1.12&quot;
                data_type =&gt; &quot;list&quot;
                key =&gt; &quot;logstash-Apache&quot;
        }
}

output {
        elasticsearch {
                cluster =&gt; &quot;myes&quot;
                index =&gt; &quot;logstash-%{YYYY.MM.dd}&quot;
        }
}

测试语法，没有问题就运行：
[root@linux-node2 conf.d]# logstash -f /etc/logstash/conf.d/fromredis.conf --configtest
Configuration OK
[root@linux-node2 conf.d]# logstash -f /etc/logstash/conf.d/fromredis.conf
</code></pre><p>想要知道是否成功的信息输出到了es上，可以验证</p><pre><code>[root@linux-node1 ~]# curl -XGET &#39;localhost:9200/_cat/indices&#39;
yellow open .kibana             1 1   2 2  10.3kb  10.3kb 
yellow open logstash-2018.05.16 5 1 389 0 170.5kb 170.5kb 
[root@linux-node1 ~]# curl -XGET &#39;localhost:9200/logstash-2018.05.16/_search?pretty&#39;
</code></pre><p>接下来在kibana上显示：</p><p>浏览器&quot; <a href="http://192.168.1.10:5601/" target="_blank" rel="noopener noreferrer">http://192.168.1.10:5601/</a>&quot;</p><h1 id="面试题" tabindex="-1"><a class="header-anchor" href="#面试题"><span>面试题</span></a></h1><p>ELK插件</p><p><a href="https://blog.csdn.net/sinat_35930259/article/details/81052139" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/sinat_35930259/article/details/81052139</a></p>`,78)]))}const B=i(y,[["render",v]]),C=JSON.parse(`{"path":"/note-book/ELK/ELK.html","title":"ELK日志分析系统","lang":"zh-CN","frontmatter":{"description":"ELK日志分析系统 image-20211116145510909 image-20211116145621627 E Elasticsearch 弹性搜索，日志存储 L Logstash 日志收集 K Kibana 日志展示 实战 环境 操作系统优化 master-slave模式 image-20211117083904657 内存：大于2G Ela...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ELK日志分析系统\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-04-11T02:13:31.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/ELK/ELK.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"ELK日志分析系统"}],["meta",{"property":"og:description","content":"ELK日志分析系统 image-20211116145510909 image-20211116145621627 E Elasticsearch 弹性搜索，日志存储 L Logstash 日志收集 K Kibana 日志展示 实战 环境 操作系统优化 master-slave模式 image-20211117083904657 内存：大于2G Ela..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-04-11T02:13:31.000Z"}],["meta",{"property":"article:modified_time","content":"2025-04-11T02:13:31.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1744337611000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":2,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":1,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"acc20ecd1bcdb70acdb85ab952a0db582179691b","time":1744337611000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Firefox密码提取"},{"hash":"e62d801e02931b6acb97ded0454ab8b57b11e033","time":1718594929000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"解决一些用tab符合代替代码类型的markdown符号错误"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":5.98,"words":1793},"filePathRelative":"note-book/ELK/ELK.md","excerpt":"\\n<p></p>\\n<p></p>\\n<h1>E Elasticsearch</h1>\\n<p>弹性搜索，日志<strong>存储</strong></p>\\n<h1>L Logstash</h1>\\n<p>日志收集</p>\\n<h1>K Kibana</h1>\\n<p>日志展示</p>\\n<p></p>\\n<h1>实战</h1>\\n<h2>环境</h2>\\n<p>操作系统优化</p>\\n<div class=\\"language-bash line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"bash\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-bash\\"><span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">systemctl</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> stop</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> firewalld</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">systemctl</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> disable</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> firewalld</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">setenforce</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> 0</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">sed</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> -i</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> 's/SELINUX.*/SELINUX=disabled/g'</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> /etc/selinux/conf</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 时间一致</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 域名解析</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">172.16.100.18</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> elk-node1</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">172.16.100.21</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> elk-node2</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{B as comp,C as data};
