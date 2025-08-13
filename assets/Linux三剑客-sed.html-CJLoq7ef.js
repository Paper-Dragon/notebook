import{ah as o,ai as n,ar as a,am as d}from"./app-brKYsD9u.js";const t={};function s(r,e){return d(),n("div",null,e[0]||(e[0]=[a(`<h1 id="linux三剑客-sed" tabindex="-1"><a class="header-anchor" href="#linux三剑客-sed"><span>Linux三剑客-sed</span></a></h1><pre><code>19999,9999,9999,9999
[root@handsome-man ~]# 
</code></pre><h2 id="sed命令执行过程" tabindex="-1"><a class="header-anchor" href="#sed命令执行过程"><span>sed命令执行过程</span></a></h2><p>https://www.processon.com/view/link/5bea32c5e4b0ad314e894f53</p><p>sed -n &#39;3 p&#39; oldboy.txt 参数 条件 命令</p><p>print sed取范围</p><pre><code>[root@oldboyedu59 /oldboy]# sed -n &#39;5p&#39; lidao.txt
105,feixue,CIO
[root@oldboyedu59 /oldboy]# sed -n &#39;1,5p&#39; lidao.txt
101,oldboy,CEO
102,zhangyao,CTO
103,Alex,COO
104,yy,CFO
105,feixue,CIO
</code></pre><h3 id="找出文件中包含lidao的行" tabindex="-1"><a class="header-anchor" href="#找出文件中包含lidao的行"><span>找出文件中包含lidao的行</span></a></h3><pre><code>[root@handsome-man ~]# sed -n &#39;/lidao/p&#39; /oldboy/oldboy.txt
110,lidao,COCO
</code></pre><h3 id="找出文件中包含a-z的行" tabindex="-1"><a class="header-anchor" href="#找出文件中包含a-z的行"><span>找出文件中包含a-z的行</span></a></h3><pre><code>[root@handsome-man ~]# sed -n &#39;/[a-z]/p&#39; /oldboy/oldboy.txt
101,alex,CEO
102,zhangyao,CTO
103,Alex,COO
104,yy,CFO
104,yy,CFO
104,yy,CFO
105,feixue,CIO
110,lidao,COCO
</code></pre><h3 id="找出文件中包含lidao或yy的行-格式-sed-nr" tabindex="-1"><a class="header-anchor" href="#找出文件中包含lidao或yy的行-格式-sed-nr"><span>找出文件中包含lidao或yy的行 格式 sed -nr &#39;/ / /&#39; /</span></a></h3><h3 id="sed➕-r的参数才能支持扩展正则" tabindex="-1"><a class="header-anchor" href="#sed➕-r的参数才能支持扩展正则"><span>sed➕-r的参数才能支持扩展正则</span></a></h3><pre><code>[root@handsome-man ~]# sed -nr &#39;/lidao|yy/p&#39; /oldboy/oldboy.txt
104,yy,CFO
104,yy,CFO
104,yy,CFO
110,lidao,COCO
</code></pre><h2 id="用egrep的方法" tabindex="-1"><a class="header-anchor" href="#用egrep的方法"><span>用egrep的方法</span></a></h2><pre><code>[root@handsome-man ~]# egrep &#39;lidao|yy&#39; /oldboy/oldboy.txt
104,yy,CFO
104,yy,CFO
104,yy,CFO
110,lidao,COCO
</code></pre><h3 id="用grep的方法" tabindex="-1"><a class="header-anchor" href="#用grep的方法"><span>用grep的方法</span></a></h3><pre><code>[root@handsome-man ~]# grep &#39;lidao\\|yy&#39;  /oldboy/oldboy.txt
104,yy,CFO
104,yy,CFO
104,yy,CFO
110,lidao,COCO
</code></pre><h3 id="取-oldboy-oldboy-txt文件中102-105行" tabindex="-1"><a class="header-anchor" href="#取-oldboy-oldboy-txt文件中102-105行"><span>取/oldboy/oldboy.txt文件中102-105行</span></a></h3><pre><code> sed -n &#39;/102/,/105/p&#39;  /oldboy/oldboy.txt
102,zhangyao,CTO
19999,9999,9999,9999
188888,8888,8888
103,Alex,COO
104,yy,CFO
118.1111,1111,2222
104,yy,CFO
104,yy,CFO
105,feixue,CIO
</code></pre><h3 id="在-oldboy-oldboy-txt文件第3行之后添加一行" tabindex="-1"><a class="header-anchor" href="#在-oldboy-oldboy-txt文件第3行之后添加一行"><span>在/oldboy/oldboy.txt文件第3行之后添加一行</span></a></h3><pre><code>[root@handsome-man ~]# sed &#39;3a119,hahaha,ooo&#39;  /oldboy/oldboy.txt101,alex,CEO
102,zhangyao,CTO
19999,9999,9999,9999
119,hahaha,ooo
188888,8888,8888
103,Alex,COO
104,yy,CFO
118.1111,1111,2222
104,yy,CFO
104,yy,CFO
105,feixue,CIO
110,lidao,COCO 
</code></pre><h3 id="在-oldboy-oldboy-txt文件第3行之前添加一行" tabindex="-1"><a class="header-anchor" href="#在-oldboy-oldboy-txt文件第3行之前添加一行"><span>在/oldboy/oldboy.txt文件第3行之前添加一行</span></a></h3><pre><code>[root@handsome-man ~]# sed &#39;3i8888,8888,8888,8888&#39;  /oldboy/oldboy.txt
101,alex,CEO
102,zhangyao,CTO
8888,8888,8888,8888
19999,9999,9999,9999
188888,8888,8888
103,Alex,COO
104,yy,CFO
118.1111,1111,2222
104,yy,CFO
104,yy,CFO
105,feixue,CIO
110,lidao,COCO
</code></pre><h3 id="删除-oldboy-oldboy-txt文件中的空行" tabindex="-1"><a class="header-anchor" href="#删除-oldboy-oldboy-txt文件中的空行"><span>删除/oldboy/oldboy,txt文件中的空行</span></a></h3><pre><code>[root@handsome-man ~]# sed &#39;/^$/d&#39;   /oldboy/oldboy.txt
101,alex,CEO
102,zhangyao,CTO
19999,9999,9999,9999
188888,8888,8888
:103,Alex,COO
104,yy,CFO
118.1111,1111,2222
104,yy,CFO
104,yy,CFO
105,feixue,CIO
110,lidao,COCO
</code></pre><h2 id="awk-拓展" tabindex="-1"><a class="header-anchor" href="#awk-拓展"><span>awk 拓展</span></a></h2><p>[root@handsome-man ~]# awk &#39;/^$/&#39; /oldboy/oldboy.txt</p><h3 id="用awk-显示与不显示空行" tabindex="-1"><a class="header-anchor" href="#用awk-显示与不显示空行"><span>用awk 显示与不显示空行</span></a></h3><pre><code>[root@handsome-man ~]# awk &#39;!/^$/&#39; /oldboy/oldboy.txt       
101,alex,CEO
102,zhangyao,CTO
19999,9999,9999,9999
188888,8888,8888
:103,Alex,COO
104,yy,CFO
118.1111,1111,2222
104,yy,CFO
104,yy,CFO
105,feixue,CIO
110,lidao,COCO
</code></pre><h3 id="不显示文件-etc-ssh-sshd-config-的空行或以-号开头的行" tabindex="-1"><a class="header-anchor" href="#不显示文件-etc-ssh-sshd-config-的空行或以-号开头的行"><span>不显示文件/etc/ssh/sshd_config 的空行或以#号开头的行</span></a></h3><pre><code>egrep -v &#39;^$|^#&#39; /etc/ssh/sshd_config 
sed -r &#39;/^$|^#/d&#39; /etc/ssh/sshd_config
sed -rn &#39;/^$|^#/!p&#39; /etc/ssh/sshd_config
 
grep &#39;^[a-Z]&#39; /etc/ssh/sshd_config
 
awk &#39;!/^$|^#/&#39;  /etc/ssh/sshd_config
</code></pre><h3 id="把文件中的lidao替换成alex" tabindex="-1"><a class="header-anchor" href="#把文件中的lidao替换成alex"><span>把文件中的lidao替换成alex</span></a></h3><h3 id="格式是-sed-s-g-其中的-可以换成任意字符。" tabindex="-1"><a class="header-anchor" href="#格式是-sed-s-g-其中的-可以换成任意字符。"><span>格式是 sed &#39;s# # #g&#39; / / 其中的#可以换成任意字符。</span></a></h3><pre><code>[root@handsome-man ~]# sed &#39;s#lidao#alex#g&#39; /oldboy/oldboy.txt
101,alex,CEO
102,zhangyao,CTO
</code></pre><p>19999,9999,9999,9999</p><pre><code>188888,8888,8888
 
:103,Alex,COO
104,yy,CFO
118.1111,1111,2222
104,yy,CFO
104,yy,CFO
105,feixue,CIO
110,alex,COCO
</code></pre>`,37)]))}const l=o(t,[["render",s]]),y=JSON.parse(`{"path":"/note-book/Linux%E4%B8%89%E5%89%91%E5%AE%A2/Sed/Linux%E4%B8%89%E5%89%91%E5%AE%A2-sed.html","title":"Linux三剑客-sed","lang":"zh-CN","frontmatter":{"description":"Linux三剑客-sed sed命令执行过程 https://www.processon.com/view/link/5bea32c5e4b0ad314e894f53 sed -n '3 p' oldboy.txt 参数 条件 命令 print sed取范围 找出文件中包含lidao的行 找出文件中包含a-z的行 找出文件中包含lidao或yy的行 格...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Linux三剑客-sed\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-25T08:29:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Linux%E4%B8%89%E5%89%91%E5%AE%A2/Sed/Linux%E4%B8%89%E5%89%91%E5%AE%A2-sed.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"Linux三剑客-sed"}],["meta",{"property":"og:description","content":"Linux三剑客-sed sed命令执行过程 https://www.processon.com/view/link/5bea32c5e4b0ad314e894f53 sed -n '3 p' oldboy.txt 参数 条件 命令 print sed取范围 找出文件中包含lidao的行 找出文件中包含a-z的行 找出文件中包含lidao或yy的行 格..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-25T08:29:56.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-25T08:29:56.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1711355396000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":1,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"b1df1de0f82c85fe7f9afc5937f0b8af9255a5dc","time":1711355396000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"修正Markdown语法错误"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":2.01,"words":602},"filePathRelative":"note-book/Linux三剑客/Sed/Linux三剑客-sed.md","excerpt":"\\n<pre><code>19999,9999,9999,9999\\n[root@handsome-man ~]# \\n</code></pre>\\n<h2>sed命令执行过程</h2>\\n<p>https://www.processon.com/view/link/5bea32c5e4b0ad314e894f53</p>\\n<p>sed -n '3 p' oldboy.txt\\n参数 条件 命令</p>\\n<p>print\\nsed取范围</p>\\n<pre><code>[root@oldboyedu59 /oldboy]# sed -n '5p' lidao.txt\\n105,feixue,CIO\\n[root@oldboyedu59 /oldboy]# sed -n '1,5p' lidao.txt\\n101,oldboy,CEO\\n102,zhangyao,CTO\\n103,Alex,COO\\n104,yy,CFO\\n105,feixue,CIO\\n</code></pre>","autoDesc":true}`);export{l as comp,y as data};
