import{ah as n,ai as a,ar as i,am as p}from"./app-Dv5AG7hI.js";const e="/assets/561794-20190526213040477-1479819631-D0vRPQur.png",l="/assets/561794-20190526213132971-1527441055-CpWQA6jm.png",t="/assets/561794-20190526213217410-883671983-B-1aTf3C.png",h={};function r(k,s){return p(),a("div",null,s[0]||(s[0]=[i(`<h1 id="nginx-web架构实战" tabindex="-1"><a class="header-anchor" href="#nginx-web架构实战"><span>Nginx Web架构实战</span></a></h1><h2 id="动态网站架构" tabindex="-1"><a class="header-anchor" href="#动态网站架构"><span>动态网站架构</span></a></h2><table><thead><tr><th>文件</th><th>语言</th><th>架构</th></tr></thead><tbody><tr><td>index.py</td><td>开源python</td><td>apache+python+mysql</td></tr><tr><td>index.jsp</td><td>商业java</td><td>tomcat+jdk+oracle</td></tr><tr><td>index.asp</td><td>商业C#</td><td>iis+asp.net+sqlserver/oracle/mongodb</td></tr><tr><td>index.html</td><td>html</td><td>html</td></tr><tr><td>index.php</td><td>开源php</td><td>nginx+php+mysql</td></tr></tbody></table><h2 id="lnmp动态网站环境部署" tabindex="-1"><a class="header-anchor" href="#lnmp动态网站环境部署"><span>LNMP动态网站环境部署</span></a></h2><p>···</p><p>Linux Nginx php-fpm mysql</p><p>php-fpm php接收动态请求的程序</p><p>php-mysql php连接mysql的程序</p><p>php-gd 图形库程序 gd库可以处理图片，或者生成图片</p><div class="language-php line-numbers-mode" data-highlighter="shiki" data-ext="php" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-php"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">?</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">php</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> phpinfo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() </span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">?</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;?php</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">$dbhelper</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=mysql_connect(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">&#39;localhost&#39;</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">,</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">&#39;root&#39;</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">,</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">&#39;123456&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">if($dbhelper</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">){</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">	echo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;Success&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">else</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">	echo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;Fail&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">mysql_close</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">?</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="fastcgi-php-fpm" tabindex="-1"><a class="header-anchor" href="#fastcgi-php-fpm"><span>fastcgi &amp; php-fpm</span></a></h2><p>模块：ngx_fastcgi_module</p><p>FastCGI &amp; PHP-fpm</p><p>FastCGI =&gt; Fast Common Gateway Interface(快速通用网关接口)</p><pre><code>模块：ngx_fastcgi_modul

原理：处理动态请求的接口、nginx 通过ngx_fastcgi_modul模块 链接 php-fpm处理动态请求。
</code></pre><p>PHP-fpm =&gt; php Pastcgi Process Manager(fastcgi进程管理器)</p><pre><code>原理：PHP通过php-fpm接收前台nginx的动态访问的请求，向后端Mysql进行查询请求后，将查询结果返回给前台nginx。
</code></pre><p>PHP-mysql</p><pre><code>原理：php连接mysql的独立子程序(接口程序)
</code></pre><p>LNMP运行原理</p><pre><code>环境：用户访问的http请求是由两种组成 =&gt; 静态请求、动态请求
1. 当用户发起静态请求 =&gt; .txt .jpg .avi .css,这些都属于静态元素
    nginx是能够独立进行处理,并且将数据返还给用户。
2. 当用户发起动态请求 =&gt; .php..... nginx程序是无法全面处理动态请求,
   nginx通过FastCGI模块连接PHP
3. PHP接收用户的动态请求,再通过php-fpm处理动态请求
4. 最后通过php-mysql连接数据库,进行动态存储数据,经查询的结果返还给用户。
</code></pre><h2 id="php-fpm初始化设置" tabindex="-1"><a class="header-anchor" href="#php-fpm初始化设置"><span>php-fpm初始化设置</span></a></h2><h3 id="核心配置文件" tabindex="-1"><a class="header-anchor" href="#核心配置文件"><span>核心配置文件</span></a></h3><pre><code>vim /etc/php.ini
    # date.timezone = PRC  (Asia/Shanghai)    #设置PHP时区
    # open_basedir           #设置PHP脚本访问的目录
</code></pre><h3 id="全局配置文件" tabindex="-1"><a class="header-anchor" href="#全局配置文件"><span>全局配置文件</span></a></h3><pre><code>vim /etc/php-fpm.conf 
    # pid = /run/php-fpm/php-fpm.pid  //pid文件的位置
    # error_log = log/php-fpm.log    //错误日志的文件
    # log_level = notice　  //记录日志的等级
    # process.max = 3     //控制子进程最大数、0表示无限制、默认没设置
    # daemonize = yes    //经fpm转至后台运行(守护进程,执行后不会退出)
</code></pre><p>日志等级</p><pre><code>  alert（必须立即处理）
  error（错误情况）
  warning（警告情况）
  notice（一般重要信息）        
  debug（调试信息）

  默认: notice.
</code></pre><h3 id="扩展配置文件" tabindex="-1"><a class="header-anchor" href="#扩展配置文件"><span>扩展配置文件</span></a></h3><pre><code>vim /etc/php-fpm.d/www.conf
    # user = nginx  //设置用户
    # group = nginx //设置用户组
    # listen.allowed_clients = 127.0.0.1  //分离式部署时填写的Nginx服务器地址
    # listen = 127.0.0.1:9000   //本机的监听地址:端口
    # slowlog = /var/log/php-fpm/$pool-slow.log  //开启慢日志
    # pm=dynamic   //动态模式进程管理开启(下列进程的数量可以调整)
    # start_servers=5  //初始化进程数量
    # min_spare_server =5  //最小空闲进程数(等待更多用户访问)、必须保证5个进程闲着
    # max_children = 50   // 最大进程数(防止多用户来时,服务器内存的负载)
    # max_spare_servers=10 //最大空闲进程数/消灭进程(高并发过后,子进程的剩余数)
    # max_requests = 500  //每个子进程能响应的请求数量，到达此数字，该PHP进程就被释放掉了。
</code></pre><p>max_spare_servers=10</p><pre><code>原理：只要是用在高并发场景/用户大规模，用户处理完请求后,有很多空闲的进程
     每个进程之间都会消耗服务器的内存资源，一个php进程占用20M-30M空间
     设置最大进程数,消灭多余的子进程,为服务器节省资源的消耗。
</code></pre><p>max_requests = 500</p><pre><code>原理：每一个进程在处理完用户的请求之后,会残留用户不用的数据,这些数据会滞留在内存中
     占用系统的资源,等待处理完500次请求后,在服务完成的最后一刻,释放掉,消灭该进程。
     等下一个用户来了,在分出一个子进程处理。
滞留的数据：当你访问淘宝买东西,点一件商品,选好规格、颜色等信息后,你又不准备买,直接退出。
          等你下一个在选择这件商品时,还是你之前选好的规格、颜色等.....
          这些数据就滞留在服务器内存中。
</code></pre><p>优化php-fpm(生产环境)</p><pre><code>1. vim /etc/php-fpm.d/www.conf
        # pm = dynamic
        # pm.start_servers = 32
        # pm.max_children = 512
        # pm.min_spare_servers = 32
        # pm.max_spare_servers = 64
        # pm.max_requests = 1500

2. 重启生效： systemctl  restart  php-fpm
3. 查看进程数：ps aux|grep php|wc -l    
</code></pre><h3 id="启动php状态监控页面功能" tabindex="-1"><a class="header-anchor" href="#启动php状态监控页面功能"><span>启动php状态监控页面功能</span></a></h3><p>原理：通过Web前端展示页面详细显示PHP的状态,主要是给PHP工程师搭建</p><pre><code>1. 启动测试页面： vim  /etc/php-fpm.d/www.conf
    # pm.status_path = /php_status
2. nginx配置页面转发：vim /etc/nginx/conf.d/default.conf
    location = /php_status {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $fastcgi_script_name;  #在运行时用的内置变量参数
        include fastcgi_params;  #包含了用到的变量
    }
3. 配置生效： systemctl restart php-fpm 
            systemctl restart nginx
4. 访问测试页面： http://本机IP/php_status
</code></pre><p>php_status参数解析</p><pre><code>pool                  #fpm池名称,大多数为www
process manager       #进程管理方式dynamic或者static
start time            #启动日志,如果reload了fpm，时间会更新
start since           #运行时间
accepted conn         #当前池接受的请求数
listen queue          #请求等待队列,如果这个值不为0,那么需要增加FPM的进程数量
max listen queue      #请求等待队列最高的数量
listen queue len      #socket等待队列长度
idle processes        #空闲进程数量
active processes      #活跃进程数量
total processes       #总进程数量
max active processes  #最大的活跃进程数量（FPM启动开始计算）
max children reached  #程最大数量限制的次数，如果这个数量不为0，那说明你的最大进程数量过小,可以适当调整。
</code></pre><h2 id="nginx-location" tabindex="-1"><a class="header-anchor" href="#nginx-location"><span>Nginx Location</span></a></h2><h3 id="语法规则" tabindex="-1"><a class="header-anchor" href="#语法规则"><span>语法规则</span></a></h3><p>location [=||*|^~] /uri/ {… }</p><table><thead><tr><th>符号</th><th>含义</th></tr></thead><tbody><tr><td>=</td><td>= 开头表示精确匹配</td></tr><tr><td>^~</td><td>^~开头表示uri以某个常规字符串开头，理解为匹配 url路径即可。nginx不对url做编码，因此请求为/static/20%/aa，可以被规则^~ /static/ /aa匹配到（注意是空格）</td></tr><tr><td>~</td><td>~ 开头表示区分大小写的正则匹配</td></tr><tr><td>~*</td><td>~* 开头表示不区分大小写的正则匹配</td></tr><tr><td>!~ 和 !~*</td><td>!~ 和 !~*分别为区分大小写不匹配及不区分大小写不匹配的正则</td></tr><tr><td>/</td><td>用户所使用的代理（一般为浏览器）</td></tr><tr><td>$http_x_forwarded_for</td><td>可以记录客户端IP，通过代理服务器来记录客户端的ip地址</td></tr><tr><td>$http_referer</td><td>可以记录用户是从哪个链接访问过来的</td></tr></tbody></table><p>精确匹配》字符开头》正则匹配》通配</p><h2 id="nginx-rewrite" tabindex="-1"><a class="header-anchor" href="#nginx-rewrite"><span>Nginx Rewrite</span></a></h2><h3 id="rewrite简介" tabindex="-1"><a class="header-anchor" href="#rewrite简介"><span>rewrite简介</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span> Rewrite对应URL Rewrite,即URL重写，就是把传入web的请求重定向到其他URL的过程.</span></span>
<span class="line"><span># 当运维遇到要重写情况时，往往是要程序员把重写规则写好后，发给你，你再到生产环境下配置。对于重写规则</span></span>
<span class="line"><span># 说到底就是正则匹配，做运维的岂能对正则表达式不了解的？最起码最基本的正则表达式会写。套用一句阿里的话(某网友说是阿里说的，不清楚到底是不是出自阿里)“不懂程序的运维，不是好运维；不懂运维的开发，不是好开发。”</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Nginx的重写模块rewrite是一个简单的正则表达式匹配与一个虚拟堆叠机结合，依赖于pcre库这也为我们之前安装的时候为什么需要安装pcre和pcre-devel软件的原因，rewrite会根据相关变量重定向和选择不同的配置，从一个 location跳转到另一个 location，不过这样的循环最多可以执行10次，超过后 nginx将返回500错误。同时，重写模块包含 set 指令，来创建新的变量并设其值，这在有些情景下非常有用的，如记录条件标识、传递参数到其他location、记录做了什么等等。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="功能及范围" tabindex="-1"><a class="header-anchor" href="#功能及范围"><span>功能及范围</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 功能：实现URL的重写，通过Rewrite规则，可以实现规范的URL，根据变量来做URL转向及选择配置。</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 作用范围：server{},location{},if{}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 优先级：执行server块的rewrite指令 &gt; 执行location匹配 &gt;执行选定的location中的rewrite指令。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景"><span>应用场景</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># nginx的rewrite功能在企业中应用非常广泛:</span></span>
<span class="line"><span># 1. 可以调整用户用户浏览的URL，看起来更加规范，合乎开发以及产品人员的需求。</span></span>
<span class="line"><span># 2. 为了让搜索引擎收录网站内容及用户体验更好，企业将动态URL地址伪装成静态地址提供服务</span></span>
<span class="line"><span># 3. 网站换新域名后，让旧的域名的访问跳转到信息的域名上</span></span>
<span class="line"><span># 4. 根据特殊变量、目录、客户端的信息进行URL跳转等。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p>URL Rewrite最常见的应用是URL伪静态化，是将动态页面显示为静态页面的一种技术.</p></blockquote><blockquote><p>比如 http://www.123.com/news/index.php?id=123 使用URLRewrite 转换后可以显示为 http://www.123.com/news/123.html 对于追求完美主义的网站设计师，就算是网页的地址也希望看起来尽量简洁明快。理论上，搜索引擎更喜欢静态页面形式的网页，搜索引擎对静态页面的评分一般要高于动态页面。所以，UrlRewrite可以让我们网站的网页更容易被搜索引擎所收录。</p></blockquote><blockquote><p>从安全角度上讲，如果URL中暴露太多的参数，无疑会造成一定量的信息泄露，可能会被一些黑客利用，对你的系统造成一定的损坏，所以静态化的URL地址可以给我们带来更高的安全性.</p></blockquote><blockquote><p>实现网站地址跳转，例如用户访问360buy.com,将其跳转到jd.com,例如当用户访问flying.cn的80端口时，将其跳转到443端口.</p></blockquote><p>Nginx Rewrite相关指令有重定向rewrite,if 语句，条件判断，全局变量，set,return</p><h3 id="rewrite-相关指令" tabindex="-1"><a class="header-anchor" href="#rewrite-相关指令"><span>Rewrite 相关指令</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># if语句的应用环境和语法:</span></span>
<span class="line"><span># 应用环境: server,location</span></span>
<span class="line"><span>if (condition) {</span></span>
<span class="line"><span>    # 代表条件为真时的nginx操作，可以是反向代理，也可以是URL重写</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if 可以支持如下条件判断匹配符号</span></span>
<span class="line"><span>~                    # 正则匹配（区分大小写）</span></span>
<span class="line"><span>~*                   # 正则匹配（不区分大小写）</span></span>
<span class="line"><span>!~                   # 正则不匹配（区分大小写）</span></span>
<span class="line"><span>!~*                  # 正则不匹配（不区分大小写）</span></span>
<span class="line"><span>-f和!-f              # 用来判断是否存在文件</span></span>
<span class="line"><span>-d和!-d              # 用来判断是否存在目录</span></span>
<span class="line"><span>-e和!-e              # 用来判断是否存在文件或目录</span></span>
<span class="line"><span>-x和!-x              # 用来判断文件是否可执行</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 文件及目录匹配,其中:</span></span>
<span class="line"><span># -f和!-f用来判断是否存在文件</span></span>
<span class="line"><span># -d和!-d用来判断是否存在目录</span></span>
<span class="line"><span># -e和!-e用来判断是否存在文件或目录</span></span>
<span class="line"><span># -x和!-x用来判断文件是否可执行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="rewrite-flag" tabindex="-1"><a class="header-anchor" href="#rewrite-flag"><span>Rewrite flag</span></a></h3><blockquote><p>rewrite: 指令根据表达式来重定向URI,或者修改字符串，可以应用于server,location,if环境下，每行rewrite指令最后跟一个跟一个flag标记，支持的flag标记有:</p></blockquote><ol><li>last: 相当于Apache里的[L]标记，表示终止继续在本location快中处理接收到的URI,并将此处重写的URI作为一个新的URI,使用下一个location块进行处理，处理完成再从第一个location开始，循环五次报500错误.</li><li>break: 将此处重写的URI作为一个新的URI,在本块中继续进行处理，该标识将重写后的地址在当前location块中执行，不会将新的URI转向到其他location块.</li><li>redirect: 返回302临时重定向，浏览器地址会显示跳转后的URL地址.</li><li>permanent: 返回301永久重定向，浏览器地址会显示跳转后URL地址.</li></ol><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>location / {</span></span>
<span class="line"><span>        root   /usr/share/nginx/html;</span></span>
<span class="line"><span>        index  index.html index.htm;</span></span>
<span class="line"><span>         rewrite ^/.* http://www.taobao.com;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="rewrite参考实例" tabindex="-1"><a class="header-anchor" href="#rewrite参考实例"><span>Rewrite参考实例</span></a></h3><h4 id="example-1" tabindex="-1"><a class="header-anchor" href="#example-1"><span>Example 1</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 有意思的域名跳转,39.108.140.0无论访问什么，最终都给跳转到www.taobao.com上**</span></span>
<span class="line"><span>vim /etc/nginx/conf.d/default.conf</span></span>
<span class="line"><span>    location    location / {</span></span>
<span class="line"><span>        root   /usr/share/nginx/html;</span></span>
<span class="line"><span>        index  index.html index.htm;</span></span>
<span class="line"><span>         rewrite ^/.* http://www.taobao.com;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>elinks --dump 39.108.140.0</span></span>
<span class="line"><span>     *?[14]亲，请登录</span></span>
<span class="line"><span>     *?? 消息  ?</span></span>
<span class="line"><span>     *?[15]手机逛淘宝</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="example-2" tabindex="-1"><a class="header-anchor" href="#example-2"><span>Example 2</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 访问http://39.108.140.0/abc/a/1.html ==&gt; http://39.108.140.0/ccc/bbb/b.html</span></span>
<span class="line"><span># 1./abc/a/1.html页面是否存在不重要</span></span>
<span class="line"><span># 2./ccc/bbb/b.html页面必须存在</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vim /etc/nginx/conf.d/default.conf</span></span>
<span class="line"><span>    location /abc {</span></span>
<span class="line"><span>        rewrite .* /ccc/bbb/b.html permanent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>nginx -s reload</span></span>
<span class="line"><span>elinks --dump 39.108.140.0/abc/a/1.html     </span></span>
<span class="line"><span>b.html       </span></span>
<span class="line"><span># 这个abc目录是没有的，但是只要符合匹配条件就会跳转走</span></span>
<span class="line"><span>tail -2 /var/log/nginx/access.log</span></span>
<span class="line"><span>49.233.69.195[04/Nov/2019:12:22:19]&quot;GET /abc/a/1.html HTTP/1.1&quot; 301 169 &quot;-&quot; </span></span>
<span class="line"><span>49.233.69.195[04/Nov/2019:12:22:19]&quot;GET /ccc/bbb/b.htmlHTTP/1.1&quot; 200&quot;http://39.108.140.0/abc/a/1.html&quot;</span></span>
<span class="line"><span># 无permanent，简单的rewrite请求一次</span></span>
<span class="line"><span>49.233.69.195 - - [04/Nov/2019:12:27:09 +0800] &quot;GET /abc/a/1.html HTTP/1.1&quot; 200 7 &quot;-&quot;</span></span>
<span class="line"><span>#有permanent,永久重定向301请求两次（成本高，容易看懂日志意思，友好）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="example-3" tabindex="-1"><a class="header-anchor" href="#example-3"><span>Example 3</span></a></h4><p>(.*) ==&gt;$1</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 访问http://39.108.140.0/2015/ccc/bbb/b.html ==&gt; http://39.108.140.0/2014/ccc/bbb/b.html</span></span>
<span class="line"><span>mkdir /usr/share/nginx/html/2015/ccc/bbb/ -p</span></span>
<span class="line"><span>mkdir /usr/share/nginx/html/2014/ccc/bbb/ -p</span></span>
<span class="line"><span>echo 2014 &gt; 2014/ccc/bbb/b.html</span></span>
<span class="line"><span>echo 2015 &gt; 2015/ccc/bbb/b.html</span></span>
<span class="line"><span>vim /etc/nginx/conf.d/default.conf</span></span>
<span class="line"><span>    location /2015 {</span></span>
<span class="line"><span>        rewrite ^/2015/(.*)$ /2014/$1 permanent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>nginx -s reload</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="example-4" tabindex="-1"><a class="header-anchor" href="#example-4"><span>Example 4</span></a></h4><p>if ($host ~* aaa.com ){}</p><p>$schemal$host$request_uri</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 访问http://www.flying.com ==&gt; http://cloud.com</span></span>
<span class="line"><span># 因为是测试环境,注意客户端解析</span></span>
<span class="line"><span>mkdir /cloryud</span></span>
<span class="line"><span>echo cloud &gt; /cloud/index.html</span></span>
<span class="line"><span>vim /etc/nginx/conf.d/default.conf</span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>        root /cloud;</span></span>
<span class="line"><span>        index index.html;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>nginx -s reload</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tail -2 /etc/hosts</span></span>
<span class="line"><span>39.108.140.0    cloud.com</span></span>
<span class="line"><span>39.108.140.0    flying.com</span></span>
<span class="line"><span>elinks --dump cloud.com</span></span>
<span class="line"><span>   cloud</span></span>
<span class="line"><span></span></span>
<span class="line"><span>vim /etc/nginx/conf.d/default.conf</span></span>
<span class="line"><span>    if ($host ~* flying.com){</span></span>
<span class="line"><span>        rewrite .* http://cloud.com permanent;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>elinks --dump flying.com</span></span>
<span class="line"><span>   cloud</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="example-5" tabindex="-1"><a class="header-anchor" href="#example-5"><span>Example 5</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 如果访问的.sh结尾的文件则返回403操作拒绝错误</span></span>
<span class="line"><span>return 指令用于返回状态码给客户端，应用于server,location,if环境</span></span>
<span class="line"><span>touch /usr/share/nginx/html/1.sh</span></span>
<span class="line"><span>vim /etc/nginx/conf.d/default.conf</span></span>
<span class="line"><span>    location ~* \\.sh$ {</span></span>
<span class="line"><span>        return 403;</span></span>
<span class="line"><span>        #return 301 http://www.baidu.com;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>nginx -s reload</span></span>
<span class="line"><span>elinks --dump 39.108.140.0/index.html</span></span>
<span class="line"><span>   123</span></span>
<span class="line"><span>elinks --dump 39.108.140.0/index.sh</span></span>
<span class="line"><span>                                 403 Forbidden</span></span>
<span class="line"><span>域名跳转www</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="example-6" tabindex="-1"><a class="header-anchor" href="#example-6"><span>Example 6</span></a></h4><p>换域名</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 主机记录就是域名前缀，常见用法有：</span></span>
<span class="line"><span># www：解析后的域名为www.aliyun.com。</span></span>
<span class="line"><span># @：直接解析主域名 aliyun.com。</span></span>
<span class="line"><span># *：泛解析，匹配其他所有域名 *.aliyun.com。</span></span>
<span class="line"><span># mail：将域名解析为mail.aliyun.com，通常用于解析邮箱服务器。</span></span>
<span class="line"><span># 二级域名：如：abc.aliyun.com，填写abc。</span></span>
<span class="line"><span># 手机网站：如：m.aliyun.com，填写m。</span></span>
<span class="line"><span># 显性URL：不支持泛解析（泛解析：将所有子域名解析到同一地址）</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 方法1</span></span>
<span class="line"><span>server {</span></span>
<span class="line"><span>  listen         80;</span></span>
<span class="line"><span>  server_name    zcj.net.cn;</span></span>
<span class="line"><span>  rewrite ^(.*) $scheme://www.$server_name$1 permanent;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 方法2</span></span>
<span class="line"><span>server {</span></span>
<span class="line"><span>        listen *:80;</span></span>
<span class="line"><span>        listen [::]:80;</span></span>
<span class="line"><span>        server_name zcj.net.cn;</span></span>
<span class="line"><span>        #告诉浏览器有效期内只准用 https 访问</span></span>
<span class="line"><span>        add_header Strict-Transport-Security max-age=15768000;</span></span>
<span class="line"><span>        # 永久重定向到https站点</span></span>
<span class="line"><span>        return 301 http://www.example.com$request_uri;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="example-7" tabindex="-1"><a class="header-anchor" href="#example-7"><span>Example 7</span></a></h4><p>不同浏览器</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 不同浏览器访问不同结果（实现不同客户端(PC,安卓,IOS)）访问不同的后端实例</span></span>
<span class="line"><span>if ($http_user_agent ~ Firefox) {</span></span>
<span class="line"><span>    rewrite ^(.*)$ /firefox/$1 break;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>if ($http_user_agent ~ MSIE) {</span></span>
<span class="line"><span>    rewrite ^(.*)$ /msie/$1 break;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>if ($http_user_agent ~ Chrome) {</span></span>
<span class="line"><span>    rewrite ^(.*)$ /chrome/$1 break;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 防止盗链</span></span>
<span class="line"><span>location ~*\\.(gif|jpg|png|swf|flv)\${</span></span>
<span class="line"><span>    valid_referers none blocked www.cheng.com *.test.com;</span></span>
<span class="line"><span>	if ($invalid_referer) {</span></span>
<span class="line"><span>	    rewrite ^/(.*) http://www.lianggzone.com/error.html</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 禁止访问以/data开头文件</span></span>
<span class="line"><span>location ~ ^/data {</span></span>
<span class="line"><span>    deny all;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 设置某些类型文件的浏览器缓存时间</span></span>
<span class="line"><span>location ~ .*.(gif|jpg|jpeg|png|bmp)$ {</span></span>
<span class="line"><span>    expires 30d;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>location ~ .*.(js|css)$ {</span></span>
<span class="line"><span>    expires 1h;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 设置过期时间不记录日志</span></span>
<span class="line"><span>location ~(favicon.ico) {</span></span>
<span class="line"><span>    log_not_found off;</span></span>
<span class="line"><span>    expires 99d;</span></span>
<span class="line"><span>    break;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>location ~(robots.txt) {</span></span>
<span class="line"><span>    log_not_found off;</span></span>
<span class="line"><span>    expires 7d;</span></span>
<span class="line"><span>    break;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="example-8" tabindex="-1"><a class="header-anchor" href="#example-8"><span>Example 8</span></a></h4><p>最后面加斜线</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> ( </span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-d</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> $request_file</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> ) {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  rewrite</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (.*)([^/]) http://</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">$host</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">$1$2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">/;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>rewrite .* http://www.baidu.com permanent;</span></span>
<span class="line"><span>return 301 http://ww.baidu.com</span></span>
<span class="line"><span>#如果你只是想要返回一定的状态码，建议用return</span></span>
<span class="line"><span>#如果你想要进行地址重写，建议直接用rewrite</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>--ngx_http_rewrite_module        # rewrite重写模块</span></span>
<span class="line"><span>1&gt; last:      # 匹配到规则重新向server发送请求，不会显示跳转之后的URL;</span></span>
<span class="line"><span>2&gt; break:     # 匹配到这个规则终止匹配，不再匹配后面规则;</span></span>
<span class="line"><span>3&gt; redirect:  # 返回302临时重定向，浏览器地址显示跳转之后URL: </span></span>
<span class="line"><span># redirect一般只需要临时跳转，这些跳转需要一定时间缓冲，如果跳转过长，可能被百度判断为作弊，会被k站;</span></span>
<span class="line"><span>4&gt; permanent：返回301永久重定向，浏览器地址显示跳转后URL地址;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>last,break详解</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>mkdir test</span></span>
<span class="line"><span>echo break &gt; test/break.html</span></span>
<span class="line"><span>echo last &gt; test/last.html</span></span>
<span class="line"><span>echo test &gt; test/test.html</span></span>
<span class="line"><span>vim /etc/nginx/conf.d/default.conf</span></span>
<span class="line"><span>    location /break {</span></span>
<span class="line"><span>            root /usr/share/nginx/html;</span></span>
<span class="line"><span>        rewrite .* /test/break.html break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    location /last {</span></span>
<span class="line"><span>            #root /usr/share/nginx/html;</span></span>
<span class="line"><span>        rewrite .* /test/last.html last;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    location /test {</span></span>
<span class="line"><span>            root /usr/share/nginx/html;</span></span>
<span class="line"><span>        rewrite .* /test/test.html break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>nginx -s reload</span></span>
<span class="line"><span>elinks --dump 49.233.69.195/last</span></span>
<span class="line"><span>   test</span></span>
<span class="line"><span>elinks --dump 49.233.69.195/break</span></span>
<span class="line"><span>   break</span></span>
<span class="line"><span>elinks --dump 49.233.69.195/test</span></span>
<span class="line"><span>   test</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ol><li>如果rewrite在匹配过程中，匹配结束了就必须声明root目录的位置，并显示root位置的url,如果没有匹配完成就不需要root目录</li><li>last标记在本条rewrite规则执行完后，会对其所在的server {...}标签重新发起请求.</li><li>break标记则在本次规则匹配完成后，停止匹配，不再做后续的匹配.</li><li>有些时候必须使用last,比如使用alias指令时，而使用proxy_paas指令时必须使用break.</li></ol><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>= 表示精确匹配，优先级也是最高的</span></span>
<span class="line"><span>^~ 表示uri以某个常规字符串开头,理解为匹配url路径即可（少用）</span></span>
<span class="line"><span>~ 表示区分大小写的正则匹配</span></span>
<span class="line"><span>~* 表示不区分大小写的正则匹配</span></span>
<span class="line"><span>!~ 表示区分大小写不匹配的正则</span></span>
<span class="line"><span>!~* 表示不区分大小写不匹配的正则</span></span>
<span class="line"><span>/ 通用匹配，任何请求都会匹配到</span></span>
<span class="line"><span>= 大于  ^~  大于  ~   ~*   !~  ！~*  大于  /</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p>nginx里面的变量和shell里面的不相同，nginx里面的所有变量在定义时需要使用$变量名定义，直接写变量名表示引用变量.</p></blockquote><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>1&gt; $args                # 请求中的参数,这个变量存放的是URL中的请求指令:</span></span>
<span class="line"><span>                        # 请求指令: 网址中？后面的一串字符，就是我们给网页传递过去的参数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2&gt; $content_length            # 请求长度: 存放请求报文中content_length字段内容，代表报文有点多少字节</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3&gt; $content_type                # 请求类型: 存放请求报文中content_type字段内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4&gt; $document_root            # 网页目录: 存放当前请求的根路径，对于apache来首就是/var/www/html</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5&gt; $document_uri               # 存放请求报文中的当前URI，并且不包括请求指令</span></span>
<span class="line"><span></span></span>
<span class="line"><span>6&gt; $host    # 主机: 代表URI地址中的主机部分，如果请求中没有host行，则等于设置的服务器名:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>7&gt; $http_user_agent     # 存放客户端代理信息(即客户端的浏览器类型)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>8&gt; $http_cookie         # 开发使用，表示client和server之间的会话信息，server返回的验证身份信息的一段字符串.</span></span>
<span class="line"><span>                        # 浏览器的缓存其中一个就是cookie,这个cookie就是访问某一台web服务器，网站服务器为了验证身份生成的一段字符串.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>9&gt; $limit_rate          # 用不到，nginx服务器对网络连接速率做限制的.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>10&gt; $remote_addr        # 存放客户端ip地址</span></span>
<span class="line"><span></span></span>
<span class="line"><span>11&gt; $remote_port        # 存放客户端端口，即源端口: 客户端访问时，服务器收到的数据的源端口号是多少.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>12&gt; $remote_user        # 远程用户: 存放客户端的用户名，基于用于密码验证的用户名.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>13&gt; $request_body_file  # 表示nginx做反向代理时，nginx转给后端服务器的文件名称</span></span>
<span class="line"><span></span></span>
<span class="line"><span>14&gt; $request_method     # 存放客户端请求资源的方法，就是GET,POST,PUT,DELETE,HEAD</span></span>
<span class="line"><span></span></span>
<span class="line"><span>15&gt; $request_filename   # 存放当前请求的文件路径名(带网站的主目录/usr/local/nginx/html/images/a.jpg)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>16&gt; $request_uri        # 存放当前请求的URI地址，并且带有请求指令(不带网站的主目录/images/a.jpg)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>17&gt; $query_string       # 查询的字符串: 与变量$args含义相同，表示?后面一串</span></span>
<span class="line"><span></span></span>
<span class="line"><span>18&gt; $scheme             # 存放客户端请求使用的协议,如http,https</span></span>
<span class="line"><span></span></span>
<span class="line"><span>19&gt; $server_protocol    # 存放客户端请求协议的版本, http/1.0    http/1.1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>20&gt; $server_addr        # 存放服务器ip地址，如果没有用listen指明服务器地址，使用这个变量将发起一次系统调用以取得地址(造成资源浪费)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>21&gt; $server_name        # 存放了客户端请求到达的服务器的名称，配置虚拟主机时的虚拟主机名</span></span>
<span class="line"><span></span></span>
<span class="line"><span>22&gt; $server_port        # 存放了客户端请求到达的服务器的端口号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>23&gt; $uri                # 与变量$document_uri含义相同，代表URI地址，不包括请求指令，问好后面的不包含</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Example:</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>if ( -f $request_filename) {.....} 如果客户端请求的文件名存在，就做什么动作</span></span>
<span class="line"><span>if ($request_method = POST) {.....} 如果客户端请求方法是POST上传，做什么动作</span></span>
<span class="line"><span>if ($http_user_agent ~ MSIE) {.....} 如果客户端的浏览器名称里面带有MSIE字符就做什么操作</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="ca-https" tabindex="-1"><a class="header-anchor" href="#ca-https"><span>CA &amp; HTTPS</span></a></h2><h3 id="常见加密算法" tabindex="-1"><a class="header-anchor" href="#常见加密算法"><span>常见加密算法</span></a></h3><p>HASH： MD5</p><p>非对称算法，RSA DH</p><p>对称： AES DES</p><h3 id="ca" tabindex="-1"><a class="header-anchor" href="#ca"><span>CA</span></a></h3><h4 id="私有ca" tabindex="-1"><a class="header-anchor" href="#私有ca"><span>私有CA</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">CA</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 证书颁发机构</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> （CA，Certificate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Authority）</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">基于https的西医工作的一种虚拟主机，要构建这样的网站需要mod_ssl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 模块支持。且需要提供两个文件：证书文件和私钥文件，证书文件是标识这个网站服务器身份的，私钥文件主要用来实现在服务器的端对端数据进行加密，然后在网站上传输的。证书在生产生活中需要对经营的机构去申请，在实验环境中应该搭建一台CA服务器</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>1、生成证书和私钥文件</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">1、准备存放证书和密钥的文件夹</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@ca ~]# mkdir -p /etc/nginx/ssl</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">2、生成私钥</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">使用openssl生成基于rsa数学算法长度为1024bit的密钥，文件必须以key结尾</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">2.1</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 使用openssl工具生成一个RSA私钥</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">查看刚刚生成的私钥。使用命令如下：</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">openssl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> rsa</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -text</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -in</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> server.key</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@ca ~]# openssl genrsa 1024 &gt;  /etc/nginx/ssl/server.key</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Generating</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> RSA</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> private</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> key,</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1024</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> bit</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> long</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> modulus</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">......</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">++++++</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">++++++</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">e</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> is</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 65537</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (0x10001)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@ca ~]# cat /etc/nginx/ssl/server.key </span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-----BEGIN</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> RSA</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> PRIVATE</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> KEY-----</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">MIICXQIBAAKBgQCetXQ6NXmRY7WoIgN05Vpe3WWysaCn7v39Ag1RhauUWx8lWppD</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">B+J0P9pfoXqueq/9128OM5HgBg2DoQ24pWv7nVroocnqmQX+A5a4Dw4Q0ue3btTk</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">9/2RcuC7iDzllW5rrydzg3g3q+Fq59g69ZwjsjB4K6Jx4c0zHB8km9HkVQIDAQAB</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">AoGAaA8dR9UsAjHYN4clsQ14NV8AgSuJ5NIEYlFoHh2ApGMihsFjB7QxvHrpWW5t</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">G92BavRH8o3JhZMyZS3B62E67NSqMk+3hzcXDokuetQbU4smNxrCT9nWpFeD9sFe</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">dlZEZ9NaoJElC3Jdffjy23Dm6moNP+X9yVMuo3+P9Hwmo0ECQQDKSxRkL9+tMpms</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">zI1zGkEzxIJcdArFWqJ1qfyw2uiFKxvp7TXOijWSWOMmO18cPOM3TnIC2z+hTtQ8</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">vuIfXr69AkEAyNgkojQXAvOjD0eumnAvVZX8XHJ+yGWUpX3dwOpKDkfTsqw2FROV</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">43rflM5pguyts6Mu4Nv7CukpzPhbrKcBeQJBAJgecU0NewQA4vLANzXw7ksBYI4p</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">bNgPWc9lbnGHjAZn7muwRx/zammMkfNz/gd7+djjEnT3bhfc8VhkqiGw23kCQEn1</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">NcA5GEQw/VmSFtyt9PA6M9zDGKaoqU0rhS4V2EFb97uyqJOoS6ihxZUhUT8x8mDU</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">9V0+BDqnU4oz5mY0dVkCQQCRDXJJI5CeE2V0zUhlyTKvjKHDFzSMIlgA9Xph6RPp</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">4FtQRgt8XM8L9K2CqSd025adE4EmetsIcJMc9bIDjTqS</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-----END</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> RSA</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> PRIVATE</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> KEY-----</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">3、使用密钥文件生成证书</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">2.2</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">  创建证书签名请求CSR文件</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">查看csr文件如下命令：</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">openssl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> req</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -text</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -in</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> server.csr</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -noout</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[root@ca ~]# openssl req -new -key /etc/nginx/ssl/server.key &gt; /etc/nginx/ssl/server.csr</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">You</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> are</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> about</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> to</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> be</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> asked</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> to</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> enter</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> information</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> that</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> will</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> be</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> incorporated</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">into</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> your</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> certificate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> request.</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">What</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> you</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> are</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> about</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> to</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> enter</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> is</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> what</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> is</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> called</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> a</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Distinguished</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Name</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> or</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> a</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> DN.</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">There</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> are</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> quite</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> a</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> few</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> fields</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> but</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> you</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> can</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> leave</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> some</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> blank</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">For</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> some</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> fields</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> there</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> will</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> be</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> a</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> default</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> value,</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">If</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> you</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> enter</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;.&#39;,</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> the</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> field</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> will</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> be</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> left</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> blank.</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-----</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Country</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (2 </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">letter</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> code</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) [XX]:CN    国家名字</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">State</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> or</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Province</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (full </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) []:Beijing 省会</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Locality</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (eg, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">city</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) [Default City]:Beijing 城市</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Organization</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (eg, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">company</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) [Default Company Ltd]:YUNJISUANGONGSI 组织名</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Organizational</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Unit</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (eg, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">section</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) []:YUNJISUAN 组织单位名</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Common</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> Name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (eg, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">your</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> name</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> or</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> your</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> server&#39;s hostname) []:nginx.linux.com 域名</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">Email Address []:2678885646@qq.com 联系方式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">Please enter the following &#39;extra&#39; attributes</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">to be sent with your certificate request</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">A challenge password []: 密码为空</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">An optional company name []: 公司为空</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">[root@ca ~]# cat /etc/nginx/ssl/server.csr </span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-----BEGIN CERTIFICATE REQUEST-----</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">MIIB3DCCAUUCAQAwgZsxCzAJBgNVBAYTAkNOMRAwDgYDVQQIDAdCZWlqaW5nMRAw</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">DgYDVQQHDAdCZWlqaW5nMRgwFgYDVQQKDA9ZVU5KSVNVQU5HT05HU0kxEjAQBgNV</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">BAsMCVlVTkpJU1VBTjEYMBYGA1UEAwwPbmdpbngubGludXguY29tMSAwHgYJKoZI</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">hvcNAQkBFhEyNjc4ODg1NjQ2QHFxLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAw</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">gYkCgYEAnrV0OjV5kWO1qCIDdOVaXt1lsrGgp+79/QINUYWrlFsfJVqaQwfidD/a</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">X6F6rnqv/ddvDjOR4AYNg6ENuKVr+51a6KHJ6pkF/gOWuA8OENLnt27U5Pf9kXLg</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">u4g85ZVua68nc4N4N6vhaufYOvWcI7IweCuiceHNMxwfJJvR5FUCAwEAAaAAMA0G</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">CSqGSIb3DQEBCwUAA4GBAGYOzfcCO5pEJIXJbSnkL9nHiRbC4y2kZYmzILD3C+WN</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">3Jt8BVp3+EGEHNgBCLNz3aOY9oq79E+FEKrUeJjN/CR9Go8Cj+He04RqUCyaVEiq</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">24gUPxPp5/bDuVM+uAy77Lby1f4XxsMohYFL3wMMQk3uMvwLFX15GkwjU04D9h/r</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-----END CERTIFICATE REQUEST-----</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">2.3  生成CA证书</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">[root@ca ~]# openssl req -x509  -key /etc/nginx/ssl/server.key -days 365  -in  /etc/nginx/ssl/server.csr &gt; /etc/nginx/ssl/server.crt</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">openssl </span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-x509 证书的格式：固定的</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-days 证书的有效期，生产生活中时间不同，价格不同</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-key 指定密钥文件 私钥</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-in 指定证书的申请文件 公钥</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">[root@ca ~]# cat /etc/nginx/ssl/server.crt </span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-----BEGIN CERTIFICATE-----</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">MIIDBjCCAm+gAwIBAgIJANOEcMZNxlhlMA0GCSqGSIb3DQEBCwUAMIGbMQswCQYD</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">VQQGEwJDTjEQMA4GA1UECAwHQmVpamluZzEQMA4GA1UEBwwHQmVpamluZzEYMBYG</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">A1UECgwPWVVOSklTVUFOR09OR1NJMRIwEAYDVQQLDAlZVU5KSVNVQU4xGDAWBgNV</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">BAMMD25naW54LmxpbnV4LmNvbTEgMB4GCSqGSIb3DQEJARYRMjY3ODg4NTY0NkBx</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">cS5jb20wHhcNMjExMTEwMDkzODUzWhcNMjIxMTEwMDkzODUzWjCBmzELMAkGA1UE</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">BhMCQ04xEDAOBgNVBAgMB0JlaWppbmcxEDAOBgNVBAcMB0JlaWppbmcxGDAWBgNV</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">BAoMD1lVTkpJU1VBTkdPTkdTSTESMBAGA1UECwwJWVVOSklTVUFOMRgwFgYDVQQD</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">DA9uZ2lueC5saW51eC5jb20xIDAeBgkqhkiG9w0BCQEWETI2Nzg4ODU2NDZAcXEu</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">Y29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCetXQ6NXmRY7WoIgN05Vpe</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">3WWysaCn7v39Ag1RhauUWx8lWppDB+J0P9pfoXqueq/9128OM5HgBg2DoQ24pWv7</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">nVroocnqmQX+A5a4Dw4Q0ue3btTk9/2RcuC7iDzllW5rrydzg3g3q+Fq59g69Zwj</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">sjB4K6Jx4c0zHB8km9HkVQIDAQABo1AwTjAdBgNVHQ4EFgQU50nM+gTczFyWbgZO</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">7fFfS1zoFMAwHwYDVR0jBBgwFoAU50nM+gTczFyWbgZO7fFfS1zoFMAwDAYDVR0T</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOBgQBtQwX1KFOYjxkhOG6xe+6OKDp0wbrr</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">RzGKuAYfzZclP1LDOEiTpZBGu0WixLFKATbJIidNmn28cbebCxX9RGPTQhZp+nla</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">ZGasn9JLbTzFZeuNZ88NFV6ZAAHEA/hq9Du4cfp1XVYBFD+/KqFVb6N912wqyxd+</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">k39n3uBQkxT60A==</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">-----END CERTIFICATE-----</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>生成客户端证书】 4. 生成客户端证书</p><p>生成客户端证书与生成CA证书相似。</p><p>4.1. 先要生成私钥</p><p>使用命令：</p><p>openssl genrsa -out client.key 2048</p><p>如下图所示：</p><p><img src="`+e+'" alt="img"></p><p>4.2 生成请求文件</p><p>使用命令：</p><p>openssl req -new -key client.key -out client.csr</p><p>如下图所示：</p><p><img src="'+l+'" alt="img"></p><p>4.3 发给ca签名</p><p>使用命令：</p><p>openssl x509 -req -days 365 -in client.csr -signkey client.key -out client.crt</p><p>如下图所示：</p><p><img src="'+t+`" alt="img"></p><p>部署</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">http</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">{</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    listen</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 80</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    server_name</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> nginx.linux.com</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    return</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 301</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> https://..../</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">$request_uri</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    # rewrite .* https://..../$request_uri permanent;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  	listen</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 443</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  	# server_name nginx.linux.com;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  	</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  	ssl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> on</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  	ssl_certificate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/nginx/ssl/server.crt</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  	ssl_cretificate_key</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/nginx/ssl/server.key</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  	</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    location</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> {</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">      root</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /bj</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">      index</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> index.html</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>2、私有CA的https部署实战</p><h4 id="公网ca" tabindex="-1"><a class="header-anchor" href="#公网ca"><span>公网CA</span></a></h4><p>···</p><h2 id="nginx平滑升级" tabindex="-1"><a class="header-anchor" href="#nginx平滑升级"><span>Nginx平滑升级</span></a></h2><p>编译安装nginx1.12</p><pre><code>1. 获取源码包：wget https://nginx.org/download/nginx-1.12.2.tar.gz
2. 解压缩指定目录：tar -xvzf nginx-1.12.2.tar.gz -C /usr/local/src/
3. 进入nginx目录：cd /usr/local/src/nginx-1.12.2/
4. 配置编译安装：./configure --user=nginx --group=nginx --prefix=/usr/local/nginx12 --with-http_stub_status_module --with-http_ssl_module &amp;&amp; make &amp;&amp; make install
</code></pre><p>编译安装nginx1.14</p><pre><code>1. 获取源码包：wget https://nginx.org/download/nginx-1.14.2.tar.gz
2. 解压缩指定目录：tar -xvzf nginx-1.14.2.tar.gz -C /usr/local/src/
3. 进入nginx目录：cd /usr/local/src/nginx-1.14.2/
4. 配置编译安装：./configure --user=nginx --group=nginx --prefix=/usr/local/nginx14 --with-http_stub_status_module --with-http_ssl_module &amp;&amp; make &amp;&amp; make install
</code></pre><p>进行平滑升级</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">kill</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -USR2</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 旧版本的主进程号</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> （让旧版本的worker进程不再接受请求）</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">kill</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -WINCH</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 旧版本的主进程号</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> （关闭旧版本的worker进程）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">1.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ps</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> aux</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ngin[x]</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">     #查看nginx的主进程号和工作进程号</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">2.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> mv</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/nginx12/sbin/nginx{,.bak}</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">     #重命名nginx12的执行程序</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">3.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> cp</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/nginx14/sbin/nginx</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">  /usr/local/nginx12/sbin/nginx</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">                #复制nginx14的执行程序给nginx12</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">4.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/nginx12/sbin/nginx</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -V</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">     #查看版本信息</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    nginx</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> version:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> nginx/1.14.2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">5.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 查看进程号：ps</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> aux</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ngin[x]</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">root</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">      17266</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  0.0</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  0.0</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  45948</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  1124</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ?</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">        Ss</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">   01:11</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">   0:00</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> nginx:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> master</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">6.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 给主进程发送User2信号：kill</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -USR2</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 旧进程号</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">17266</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">   相对应</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ls</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> nginx12/logs/nginx.pid.oldbin</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    #pid文件被重命名</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">7.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 发送WINCH信号：</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> kill</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -WINCH</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 旧进程号</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">17266</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">8.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 重启nginx:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> pkill</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> nignx</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">             /usr/local/nginx12/sbin/nginx</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">9.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 访问网站查看版本号：curl</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -i</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> http://IP</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">HTTP/1.1</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 200</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> OK</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Server:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> nginx/1.14.2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>回退版本</p><p>Kill –HUP 旧的主进程号:Nginx将在不重载配置文件的情况下启动它的工作进程;</p><p>Kill –QUIT 新的主进程号:从容关闭其他工作进程(woker process);</p><p>Kill –TERM 新的主进程号:强制退出;</p><pre><code>1. 先查看进程：ps aux|grep nginx
root      17266(旧)  0.0  0.0  46092  1904 ?        Ss   00:47   0:00 nginx:
root      17279(新)  0.0  0.0  45956  3248 ?        S    00:53   0:00 nginx:
nginx     17280  0.0  0.0  46404  1872 ?        S    00:53   0:00 nginx:.. 

2. 开启旧进程：kill -HUP 17266

3. 关闭新进程：kill -QUIT 17279

4. 查看进程：ps aux|grep ngin[x]

5. 恢复原来的执行文件：rm -rf  nginx12/sbin/nginx
                    mv nginx12/sbin/nginx.bak  nginx12/sbin/nginx

6. 重启nginx: pkill nginx
             /usr/local/nginx12/sbin/nginx

7. 访问网站查看版本号：curl -i http://IP
HTTP/1.1 200 OK
Server: nginx/1.12.2 
</code></pre><p>总结</p><p>平滑升级</p><pre><code>作用：为nginx添加新的模块优化,版本性能、稳定性

平滑升级也可以说是&quot;热升级&quot; =&gt; 在不停止对User的服务进行升级版本,继续对外服务,不受影响。
原理：
1. 在不停掉旧版本程序的运行进程的情况下,启动新版本的进程。
2. 旧版本的进程负责处理之间没有处理完成的请求,但不接受任何请求
3. 由新版本的进程接受用户的请求
4. 当旧程序处理完之前的请求后,关闭所有连接、停止服务。
</code></pre><p>平滑回退</p><pre><code>作用：将新版本回滚至旧版本,主要是新本的稳定性与漏洞,在有些场景对版本的要求很高

1. 将旧版本的进程重新拉起来
2. 再将新版本的进程停止掉
</code></pre><p>技术总结</p><pre><code>-----------平滑升级-----------
1. 先重命名旧版本的二进制.bak结尾的文件后,在将新版本的二进制执行文件复制到旧版本中。
2. 给旧版本的进程发送USR2指令,让其不在接受请求后
3. 再给旧版本的进程发送WINCH指令,让其停止服务,关闭
4. 使得新版本来接受用户的请求

-----------平滑回退-----------
1. 使用HUP指令将旧版本的进程拉起来
2. 使用QUIT指令将新版本的进程关闭
3. 在将旧版本的二进制文件替换回来
4. 使得旧版本重新对外提供服务
</code></pre>`,149)]))}const c=n(h,[["render",r]]),g=JSON.parse('{"path":"/note-book/Nginx-OpenResty/nginx03.html","title":"Nginx Web架构实战","lang":"zh-CN","frontmatter":{"description":"Nginx Web架构实战 动态网站架构 LNMP动态网站环境部署 ··· Linux Nginx php-fpm mysql php-fpm php接收动态请求的程序 php-mysql php连接mysql的程序 php-gd 图形库程序 gd库可以处理图片，或者生成图片 fastcgi & php-fpm 模块：ngx_fastcgi_modul...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Nginx Web架构实战\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-04-11T02:13:31.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Nginx-OpenResty/nginx03.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"Nginx Web架构实战"}],["meta",{"property":"og:description","content":"Nginx Web架构实战 动态网站架构 LNMP动态网站环境部署 ··· Linux Nginx php-fpm mysql php-fpm php接收动态请求的程序 php-mysql php连接mysql的程序 php-gd 图形库程序 gd库可以处理图片，或者生成图片 fastcgi & php-fpm 模块：ngx_fastcgi_modul..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-04-11T02:13:31.000Z"}],["meta",{"property":"article:modified_time","content":"2025-04-11T02:13:31.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1744337611000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":4,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":1,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"4f5d306b7085d639c6ebe401af5124eac0f820e0","time":1744337611000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Firefox密码提取"},{"hash":"778212293d6896093099055c108cdd9e5f1a8c0b","time":1726163060000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"markdown format"},{"hash":"16fb25c92a173306ab9fbefc5d1dc98da6d7d961","time":1709976583000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"rename"},{"hash":"cddba0ef1a45120da05a0b063970ad18863ba0b8","time":1705981137000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"add OpenResty directory"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":22.1,"words":6630},"filePathRelative":"note-book/Nginx-OpenResty/nginx03.md","excerpt":"\\n<h2>动态网站架构</h2>\\n<table>\\n<thead>\\n<tr>\\n<th>文件</th>\\n<th>语言</th>\\n<th>架构</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>index.py</td>\\n<td>开源python</td>\\n<td>apache+python+mysql</td>\\n</tr>\\n<tr>\\n<td>index.jsp</td>\\n<td>商业java</td>\\n<td>tomcat+jdk+oracle</td>\\n</tr>\\n<tr>\\n<td>index.asp</td>\\n<td>商业C#</td>\\n<td>iis+asp.net+sqlserver/oracle/mongodb</td>\\n</tr>\\n<tr>\\n<td>index.html</td>\\n<td>html</td>\\n<td>html</td>\\n</tr>\\n<tr>\\n<td>index.php</td>\\n<td>开源php</td>\\n<td>nginx+php+mysql</td>\\n</tr>\\n</tbody>\\n</table>","autoDesc":true}');export{c as comp,g as data};
