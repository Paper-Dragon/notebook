import{ah as n,ai as a,ar as i,am as e}from"./app-CUpJcGV8.js";const l={};function p(d,s){return e(),a("div",null,s[0]||(s[0]=[i(`<h1 id="awk案例入门" tabindex="-1"><a class="header-anchor" href="#awk案例入门"><span>Awk案例入门</span></a></h1><h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介"><span>简介</span></a></h2><ul><li>awk 擅长对列进行操作/进行数据信息操作</li><li>awk 的基本使用（高级使用在shell)</li><li>awk把文本文档看作是数据库，每一行看作一条数据库中的记录，可以指定数据列的分隔符，默认的分隔符是”\\t”,即Tab。</li><li>awk工作流程是这样的：读入有’\\n’换行符分割的一条记录，然后将记录按指定的域分隔符划分域，填充域，$0则表示所有域, 1 表 示</li><li>第 一 个 域 , 1表示第一个域, 1表示第一个域,n表示第n个域。默认域分隔符是”空白键” 或 “[tab]键”</li><li>awk的执行模式是： awk &#39;{pattern + action}&#39; {filenames}</li></ul><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sed</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [参数] ‘条件-处理方式 文件</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sed</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [参数]  ’模式-动作</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;  文件</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">awk [-F|-f|-v] ‘BEGIN{} //{command1; command2} END{}’ file</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-变量" tabindex="-1"><a class="header-anchor" href="#awk-变量"><span>awk 变量</span></a></h2><table><thead><tr><th>变量</th><th>描述</th></tr></thead><tbody><tr><td>$n</td><td>当前记录的第n个字段，字段间由FS分隔</td></tr><tr><td>$0</td><td>完整的输入记录（默认就是文本的每一行）</td></tr><tr><td>ARGC</td><td>命令行参数的数目</td></tr><tr><td>ARGIND</td><td>命令行中当前文件的位置(从0开始算)</td></tr><tr><td>ARGV</td><td>包含命令行参数的数组</td></tr><tr><td>CONVFMT</td><td>数字转换格式(默认值为%.6g)ENVIRON环境变量关联数组</td></tr><tr><td>ERRNO</td><td>最后一个系统错误的描述</td></tr><tr><td>FIELDWIDTHS</td><td>字段宽度列表(用空格键分隔)</td></tr><tr><td>FILENAME</td><td>当前文件名</td></tr><tr><td>FS</td><td>字段分隔符(默认是任何空格) Field Separator</td></tr><tr><td>IGNORECASE</td><td>如果为真，则进行忽略大小写的匹配</td></tr><tr><td>NF</td><td>一条记录的字段的数目 Number for Field，表示的是浏览记录的域的个数，即被分隔符切开以后，一共有多少列</td></tr><tr><td>$NF</td><td>从后往前数， N F 表 示 的 最 后 一 个 F i e l d （ 列 ） ， 即 输 出 最 后 一 个 字 段 的 内 容 ， 倒 数 第 二 列 ‘ NF 表示的最后一个Field（列），即输出最后一个字段的内容，倒数第二列<code>NF表示的最后一个Field（列），即输出最后一个字段的内容，倒数第二列‘(NF-1)</code></td></tr><tr><td>NR</td><td>已经读出的记录数，就是行号，从1开始 Number of Record</td></tr><tr><td>FNR</td><td>各文件分别计数的行号 FILE Number of Record</td></tr><tr><td>OFMT</td><td>数字的输出格式(默认值是%.6g)</td></tr><tr><td>OFS</td><td>输出记录分隔符（输出换行符），输出时用指定的符号代替换行符 Output Field Separator</td></tr><tr><td>ORS</td><td>输出记录分隔符(默认值是一个换行符) Output Record Separator</td></tr><tr><td>RLENGTH</td><td>由match函数所匹配的字符串的长度</td></tr><tr><td>RS</td><td>记录分隔符(默认是一个换行符) Record Separator</td></tr><tr><td>RSTART</td><td>由match函数所匹配的字符串的第一个位置</td></tr><tr><td>SUBSEP</td><td>数组下标分隔符(默认值是/034)</td></tr><tr><td>~</td><td>匹配，与==相比不是精确比较</td></tr><tr><td>!~</td><td>不匹配，不精确比较</td></tr><tr><td>==</td><td>等于，必须全部相等，精确比较</td></tr><tr><td>!=</td><td>不等于，精确比较</td></tr><tr><td>&amp;&amp;</td><td>逻辑与</td></tr><tr><td>||</td><td>逻辑或</td></tr><tr><td>+</td><td>匹配时表示1个或1个以上</td></tr><tr><td>/[0-9][0-9]+/</td><td>两个或两个以上数字</td></tr><tr><td>/[0-9][0-9]*/</td><td>一个或一个以上数字</td></tr></tbody></table><h3 id="n" tabindex="-1"><a class="header-anchor" href="#n"><span>$n</span></a></h3><p>$1这种内置变量的外侧不能加入双引号，否则$1会被当做文本输出</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# cat test </span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{print $1}&#39; test </span></span>
<span class="line"><span>abc</span></span>
<span class="line"><span>8ua</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{print &quot;$1&quot;}&#39; test</span></span>
<span class="line"><span>$1</span></span>
<span class="line"><span>$1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;{print $1; print $2}&#39; test</span></span>
<span class="line"><span>=</span></span>
<span class="line"><span>awk &#39;{print $1} {print $2}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    1</span></span>
<span class="line"><span>    2</span></span>
<span class="line"><span>    3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ofs" tabindex="-1"><a class="header-anchor" href="#ofs"><span>OFS</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# cat test </span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -v FS=&#39; &#39; -v OFS=&#39;---&#39; &#39;{print $1,$2}&#39; test</span></span>
<span class="line"><span>abc---123</span></span>
<span class="line"><span>8ua---456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="fnr" tabindex="-1"><a class="header-anchor" href="#fnr"><span>FNR</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# cat test test1</span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span># awk处理多个文件的时候，如果使用NR显示行号，那么，多个文件的所有行会按照顺序进行排序</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{print NR,$0}&#39; test test1</span></span>
<span class="line"><span>1 abc 123 iuy ddd</span></span>
<span class="line"><span>2 8ua 456 auv php 7y7</span></span>
<span class="line"><span>3 abc 123 iuy ddd</span></span>
<span class="line"><span>4 8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span># FNR的作用就是当awk处理多个文件时，分别对每个文件的行数进行计数</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{print FNR,$0}&#39; test test1</span></span>
<span class="line"><span>1 abc 123 iuy ddd</span></span>
<span class="line"><span>2 8ua 456 auv php 7y7</span></span>
<span class="line"><span>1 abc 123 iuy ddd</span></span>
<span class="line"><span>2 8ua 456 auv php 7y7</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rs" tabindex="-1"><a class="header-anchor" href="#rs"><span>RS</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># RS是输入行分隔符，如果不指定，默认的”行分隔符”就是我们所理解的”回车换行</span></span>
<span class="line"><span># 假设，我们不想以默认的”回车换行”作为”行分隔符”，而是想使用空格作为所谓的行分隔符，也就是说，我们想让awk认为，每遇到一个空格，就换行，换句话说，我们想让awk以为每次遇到一个空格就是新的一行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{print NR,$0}&#39; test </span></span>
<span class="line"><span>1 abc 123 iuy ddd</span></span>
<span class="line"><span>2 8ua 456 auv php 7y7</span></span>
<span class="line"><span>[root@boy ~]# awk -v  RS=&quot; &quot; &#39;{print NR,$0}&#39; test </span></span>
<span class="line"><span>1 abc</span></span>
<span class="line"><span>2 123</span></span>
<span class="line"><span>3 iuy</span></span>
<span class="line"><span>4 ddd</span></span>
<span class="line"><span>8ua</span></span>
<span class="line"><span>5 456</span></span>
<span class="line"><span>6 auv</span></span>
<span class="line"><span>7 php</span></span>
<span class="line"><span>8 7y7</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ors" tabindex="-1"><a class="header-anchor" href="#ors"><span>ORS</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># awk将人类眼中的”回车换行”，当做”输出行分隔符”，此时，awk的”世界观”与人类的”世界观”是相同的。现在，我们改变一下awk的想法，我们让awk认为，”+++”才是真正的输出行分隔符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{print NR,$0}&#39; test </span></span>
<span class="line"><span>1 abc 123 iuy ddd</span></span>
<span class="line"><span>2 8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -v ORS=&quot;+++&quot; &#39;{print NR,$0}&#39; test</span></span>
<span class="line"><span>1 abc 123 iuy ddd+++2 8ua 456 auv php 7y7+++[root@boy ~]#</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -v RS=&quot; &quot; -v ORS=&quot;+++&quot; &#39;{print NR,$0}&#39; test</span></span>
<span class="line"><span>1 abc+++2 123+++3 iuy+++4 ddd</span></span>
<span class="line"><span>8ua+++5 456+++6 auv+++7 php+++8 7y7</span></span>
<span class="line"><span>+++[root@boy ~]#</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="filename" tabindex="-1"><a class="header-anchor" href="#filename"><span>FILENAME</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># FILENAME这个内置变量，从字面上，就能看出是什么意思，没错，就是显示文件名，演示效果如下</span></span>
<span class="line"><span>[root@boy ~]# cat test test1</span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{print FILENAME,FNR,$0}&#39; test test1</span></span>
<span class="line"><span>test 1 abc 123 iuy ddd</span></span>
<span class="line"><span>test 2 8ua 456 auv php 7y7</span></span>
<span class="line"><span>test1 1 abc 123 iuy ddd</span></span>
<span class="line"><span>test1 2 8ua 456 auv php 7y7</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="argc-argv" tabindex="-1"><a class="header-anchor" href="#argc-argv"><span>ARGC&amp;ARGV</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># ARGV内置变量表示的是一个数组，这个数组中保存的是命令行所给定的参数</span></span>
<span class="line"><span># ARGV内置变量表示的是一个数组，既然是数组，就需要用下标的方式，引用对应元素的值，因为数组的索引都是从0开始的，所以，ARGV[1]表示引用ARGV数组中的第二个元素的值，从返回结果可以看出，ARGV[1]对应的值为test，同理，我们又使用第三条命令，多打印了一个ARGV[2]的值，发现ARGV[2]对应的值为test1，这个时候，你明白ARGV内置变量的含义了吗，说白了，ARGV内置变量表示的是：所有参数组成的数组,ARGV[0]: awk本身</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{print &quot;aaa&quot;}&#39; test test1</span></span>
<span class="line"><span>aaa</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{print &quot;aaa&quot;,ARGV[1]}&#39; test test1</span></span>
<span class="line"><span>aaa test</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{print &quot;aaa&quot;,ARGV[1],ARGV[2]}&#39; test test1</span></span>
<span class="line"><span>aaa test test1</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{print &quot;aaa&quot;,ARGV[1],ARGV[2],ARGV[0]}&#39; test test1</span></span>
<span class="line"><span>aaa test test1 awk</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># awk、test1、test2，这三个参数作为数组的元素存放于ARGV中，现在，而ARGC则表示参数的数量，也可以理解为ARGV数组的长度</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{print &quot;aaa&quot;,ARGV[1],ARGV[2],ARGV[0],ARGC}&#39; test test1</span></span>
<span class="line"><span>aaa test test1 awk 3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自定义变量" tabindex="-1"><a class="header-anchor" href="#自定义变量"><span>自定义变量</span></a></h3><p>有两种方法可以自定义变量</p><ul><li>-v varname=value 变量名区分字符大小写</li><li>在program中直接定义</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># -v varname=value 自定义变量</span></span>
<span class="line"><span>[root@boy ~]# awk -v myVar=&quot;test var&quot; &#39;BEGIN{print myVar}&#39;</span></span>
<span class="line"><span>test var</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 当我们需要在awk中引用shell中的变量的时候，则可以通过方法一间接的引用</span></span>
<span class="line"><span>[root@boy ~]# aaa=111</span></span>
<span class="line"><span>[root@boy ~]# awk -v myvar=$aaa &#39;BEGIN{print myvar}&#39;</span></span>
<span class="line"><span>111</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 直接在program中定义即可，但是注意，变量定义与动作之间需要用分号”;”隔开</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{myvar=&quot;ttt&quot;; print myvar}&#39;</span></span>
<span class="line"><span>ttt</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 定义多个变量</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{myvar1=&quot;ttt&quot;; myvar2=&quot;ttt&quot;;  print myvar1,myvar2}&#39;</span></span>
<span class="line"><span>ttt ttt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-f" tabindex="-1"><a class="header-anchor" href="#awk-f"><span>awk -f</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>-f指定脚本文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -f script.awk  file</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BEGIN{</span></span>
<span class="line"><span>FS=&quot;:&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{print $1}               //效果与awk -F&quot;:&quot; &#39;{print $1}&#39;相同,只是分隔符使用FS在代码自身中指定</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-f-1" tabindex="-1"><a class="header-anchor" href="#awk-f-1"><span>awk -F</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 选取二个作为分隔符,用:和,二个作为分隔符</span></span>
<span class="line"><span>awk -F &quot;:|,&quot; XXX  </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将每一行的前二个字段，分行输出，进一步理解一行一行处理文本</span></span>
<span class="line"><span>awk -F: &#39;{print $1; print $2}&#39;   /etc/passwd                   </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出字段1,3,6，以制表符作为分隔符</span></span>
<span class="line"><span>awk  -F: &#39;{print $1,$3,$6}&#39; OFS=&quot;\\t&quot; /etc/passwd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># -F指定分隔符,$1 指指定分隔符后，第一个字段，$3第三个字段， \\t是制表符</span></span>
<span class="line"><span># 一个或多个连续的空格或制表符看做一个定界符，即多个空格看做一个空格</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 姓氏是zhang的人,显示他的第二次捐款金额及他的名字,[ :]+这个是正则表达式，+表示一个或多个，这里就表示一个或多个空格或冒号</span></span>
<span class="line"><span>awk -F &quot;[ :]+&quot; &#39;/Zhang/{print $1,$2,$(NF-1)}&#39; reg.txt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;{print $1 $3}&#39;  /etc/passwd                       # $1与$3相连输出，不分隔</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;{print $1,$3}&#39;  /etc/passwd                      # 多了一个逗号，$1与$3使用空格分隔</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;{print $1 &quot; &quot; $3}&#39;  /etc/passwd                  # $1与$3之间手动添加空格分隔</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;{print &quot;Username:&quot; $1 &quot;\\t\\t Uid:&quot; $3 }&#39; /etc/passwd   # 自定义输出  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{print NF}&#39; /etc/passwd                                 # 显示每行有多少字段</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{print $NF}&#39; /etc/passwd                               # 将每行第NF个字段的值打印出来</span></span>
<span class="line"><span></span></span>
<span class="line"><span> awk -F: &#39;NF==4 {print }&#39; /etc/passwd                       # 显示只有4个字段的行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;NF&gt;2{print $0}&#39; /etc/passwd                        # 显示每行字段数量大于2的行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;{print NR,$0}&#39; /etc/passwd                             # 输出每行的行号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{print NR,NF,$NF,&quot;\\t&quot;,$0}&#39; /etc/passwd             # 依次打印行号，字段数，最后字段值，制表符，每行内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;NR==5{print}&#39;  /etc/passwd                         # 显示第5行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;NR==5 || NR==6{print}&#39;  /etc/passwd                # 显示第5行和第6行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>awk -F: &#39;{if($3&gt;100) print &quot;large&quot;; else print &quot;small&quot;}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#  ID大于100,A加1，否则B加1</span></span>
<span class="line"><span>awk -F: &#39;BEGIN{A=0;B=0} {if($3&gt;100) {A++; print &quot;large&quot;} else {B++; print &quot;small&quot;}} END{print A,&quot;\\t&quot;,B}&#39; /etc/passwd                         </span></span>
<span class="line"><span>awk -F: &#39;{if($3&lt;100) next; else print}&#39; /etc/passwd                         # 小于100跳过，否则显示</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;BEGIN{i=1} {if(i&lt;NF) print NR,NF,i++ }&#39; /etc/passwd   </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;BEGIN{i=1} {if(i&lt;NF) {print NR,NF} i++ }&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 另一种形式</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{print ($3&gt;100 ? &quot;yes&quot;:&quot;no&quot;)}&#39;  /etc/passwd </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{print ($3&gt;100 ? $3&quot;:\\tyes&quot;:$3&quot;:\\tno&quot;)}&#39;  /etc/passwd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>awk -F&#39;[:#]&#39; &#39;{print NF}&#39;  helloworld.sh          # 指定多个分隔符: #，输出每行多少字段</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&#39;[:#]&#39; &#39;{print $1,$2,$3,$4,$5,$6,$7}&#39; OFS=&#39;\\t&#39; helloworld.sh   //制表符分隔输出多字段</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-匹配" tabindex="-1"><a class="header-anchor" href="#awk-匹配"><span>awk 匹配</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 第一种语法是正则模式的语法，表示被正则表达式匹配到的行，将会执行对应的动作</span></span>
<span class="line"><span> awk &#39;/正则表达式/{动作}&#39;  /xxx/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 二种语法是行范围模式的语法，它表示，从被正则1匹配到的行开始，到被正则2匹配到的行结束，之间的所有行都会执行对应的动作，所以，这种模式被称为行范围模式，因为它对应的是一个范围以内的所有行，但是需要注意的是，在行范围模式中，不管是正则1，还是正则2，都以第一次匹配到的行为准，就像上述示例中，即使Lee在第2行与第3行中都出现了，但是由于正则1先匹配到第2行中的lee，所以，最终打印出的内容从第2行开始，即使Kevin在第5行与第7行中都出现了，但是由于Kevin第一次出现在第5行，所以最终打印出的内容到第5行结束，也就是说，最终打印出了第2行到第5行以内的所有行</span></span>
<span class="line"><span> awk &#39;/正则1/,/正则2/{动作}&#39;  /xxx/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 匹配代码块，//纯字符匹配   !//纯字符不匹配   ~//字段值匹配    !~//字段值不匹配   ~/a1|a2/字段值匹配a1或a2   </span></span>
<span class="line"><span></span></span>
<span class="line"><span>cat /etc/passwd | awk &#39;$NF !~/nologin|sync|shutdown|halt/&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>lastlog | awk &#39;$1 ~/&#39;$i&#39;/ {printf &quot;用户名: %5s 端口：%5s 源IP：%5s 最后登录时间：%s-%s-%s日 %s\\n&quot;,$1,$2,$3,$NF,$(NF-4),$(NF-3),$(NF-2)}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;/mysql/&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;/mysql/{print }&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;/mysql/{print $0}&#39; /etc/passwd                   //三条指令结果一样</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;!/mysql/{print $0}&#39; /etc/passwd                  //输出不匹配mysql的行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;/mysql|mail/{print}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;!/mysql|mail/{print}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;/mail/,/mysql/{print}&#39; /etc/passwd         //区间匹配</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;/[2][7][7]*/{print $0}&#39; /etc/passwd               //匹配包含27为数字开头的行，如27，277，2777...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$1~/mail/{print $1}&#39; /etc/passwd           //$1匹配指定内容才显示</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{if($1~/mail/) print $1}&#39; /etc/passwd     //与上面相同</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$1!~/mail/{print $1}&#39; /etc/passwd          //不匹配</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$1!~/mail|mysql/{print $1}&#39; /etc/passwd        </span></span>
<span class="line"><span></span></span>
<span class="line"><span># ~//字段值匹配</span></span>
<span class="line"><span>awk -F: &#39;$1~/mail/&#39; /etc/passwd#显示$1字段匹配mail的行</span></span>
<span class="line"><span>awk -F: &#39;$1~/mail|sshd/&#39; /etc/passwd#显示$1字段匹配mail或sshd的行</span></span>
<span class="line"><span></span></span>
<span class="line"><span># !~//字段值不匹配</span></span>
<span class="line"><span>awk -F: &#39;$1!~/mail/&#39; /etc/passwd#显示$1字段不匹配mail的行</span></span>
<span class="line"><span>awk -F: &#39;$1!~/mail|sshd/&#39; /etc/passwd#显示$1字段不匹配mail或sshd的行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-begin-end" tabindex="-1"><a class="header-anchor" href="#awk-begin-end"><span>awk begin&amp;end</span></a></h2><ul><li>BEGIN 模式：读入第一行文本之前执行的语句，一般用来初始化操作(后续读取不会执行了，只第一次执行)</li><li>END 模式：处理完最后以行文本后执行，一般用来处理输出结果：被放置在所有的数据读取完成以后执行</li><li>{}: 逐行处理</li></ul><h3 id="exit" tabindex="-1"><a class="header-anchor" href="#exit"><span>exit</span></a></h3><pre><code>它表示不再执行awk命令，相当于退出了当前的awk命，当在awk中使用了END模式时，exit的作用并不是退出整个awk命令，而是直接执行END模式中的动作
</code></pre><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 当在awk中执行了exit语句以后，之后的所有动作都不会再被执行，相当于退出了整个awk命令</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{print 1 ; exit ; print 2 ; print 3 }&#39;</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 在awk中使用了END模式时，exit的作用并不是退出整个awk命令，而是直接执行END模式中的动作</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{print &quot;start&quot;; exit} { print &quot;123&quot; } END{ print &quot;456&quot; }&#39;</span></span>
<span class="line"><span>start</span></span>
<span class="line"><span>456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="next" tabindex="-1"><a class="header-anchor" href="#next"><span>next</span></a></h3><pre><code>next命令即可让awk直接从下一行开始处理，换句话说就是，next命令可以促使awk不对当前行执行对应的动作，而是直接处理下一行
next与continue有些类似，只是，continue是针对”循环”而言的，continue的作用是结束”本次循环”，而next是针对”逐行处理”而言的，next的作用是结束”对当前行的处理”，从而直接处理”下一行”，其实，awk的”逐行处理”也可以理解成为一种”循环”，因为awk一直在”循环”处理着”每一行”
</code></pre><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# awk &#39;{ if(NR&gt;1){ next } print $0 }&#39; /etc/passwd</span></span>
<span class="line"><span>root:x:0:0:root:/root:/bin/bash</span></span>
<span class="line"><span>=</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{ if(NR&gt;1){ next } ; print $0 }&#39; /etc/passwd</span></span>
<span class="line"><span>root:x:0:0:root:/root:/bin/bash</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实例" tabindex="-1"><a class="header-anchor" href="#实例"><span>实例</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 文件开头加REDHAT，末尾加WESTOS，打印行号和内容</span></span>
<span class="line"><span> awk -F: &#39;BEGIN {print &quot;REDHAT&quot;} {print NR;print} END {print &quot;WESTOS&quot;}&#39; passwd </span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@server19 mnt]# awk &#39;BEGIN{i=0}{i+=NF}END{print i}&#39; test.txt </span></span>
<span class="line"><span>7 </span></span>
<span class="line"><span># 统计Nginx连接数</span></span>
<span class="line"><span> netstat -n | awk &#39;/^tcp/ {++S[$NF]} END {for(a in S) print a,S[a]}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-if" tabindex="-1"><a class="header-anchor" href="#awk-if"><span>awk if</span></a></h2><h3 id="if-分支" tabindex="-1"><a class="header-anchor" href="#if-分支"><span>if 分支</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># IF语句,必须用在{}中，且比较内容用()扩起来</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{if($1~/mail/) print $1}&#39; /etc/passwd                                       //简写</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{if($1~/mail/) {print $1}}&#39;  /etc/passwd                                   //全写</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{if($1~/mail/) {print $1} else {print $2}}&#39; /etc/passwd            //if...else...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 统计登录shell为bash的用户</span></span>
<span class="line"><span> awk -F: &#39;BEGIN{i=0}{if($7~/bash$/){i++}}END{print i}&#39; /etc/passwd</span></span>
<span class="line"><span># 统计/etc/passwd下uid小于500的用户个数</span></span>
<span class="line"><span> awk -F: &#39;BEGIN{i=0}{if($3&lt;500){i++}}END{print i}&#39; /etc/passwd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="if-双分支" tabindex="-1"><a class="header-anchor" href="#if-双分支"><span>if 双分支</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 统计uid小于等于500和大于500的用户个数</span></span>
<span class="line"><span> awk -F: &#39;BEGIN{i=0;j=0}{if($3&lt;=500){i++}else{j++}}END{print i,j}&#39; /etc/passwd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实例-1" tabindex="-1"><a class="header-anchor" href="#实例-1"><span>实例</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># ”if”对应的大括号中有多条语句，所以”if”语法中的大括号不能省略，但是，如果”if”对应的大括号中只有一条命令，那么”if”对应的大括号则可以省略</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;{ if(NR == 1){ print $0 }}&#39; xxx</span></span>
<span class="line"><span>=</span></span>
<span class="line"><span>awk &#39;{ if(NR == 1) print $0}&#39;  xxx</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 判断出/etc/passwd文件中的哪些用户属于系统用户，哪些用户属于普通用户</span></span>
<span class="line"><span>awk -F &quot;:&quot; &#39;{ if($3 &lt; 500) {print $1,&quot;系统用户&quot;}} else{ print $1,&quot;普通用户&quot;}&#39; xxx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;NR != 1 {if($2 &lt;= 30){print $1,&quot;年轻人&quot;} else if($2&gt;=30 &amp;&amp; $2&lt;=50){print $1,&quot;中年人&quot;} else{print $1,&quot;老年人&quot;}}&#39; xxx</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-for" tabindex="-1"><a class="header-anchor" href="#awk-for"><span>awk for</span></a></h2><ul><li><p>continue的作用：跳出”当前”循环</p></li><li><p>break的作用：跳出”整个”循环</p></li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 生成1-5序列</span></span>
<span class="line"><span> awk &#39;BEGIN{for(i=1;i&lt;=5;i++){print i}}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># </span></span>
<span class="line"><span> awk &#39;BEGIN{ for(i=1;i&lt;=6;i++){print i}}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{ for(i=0;i&lt;=6;i++){if(i==3){continue}; print i}}&#39;</span></span>
<span class="line"><span>0</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span>6</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-while" tabindex="-1"><a class="header-anchor" href="#awk-while"><span>awk while</span></a></h2><ul><li>continue的作用：跳出”当前”循环</li><li>break的作用：跳出”整个”循环</li></ul><h3 id="while" tabindex="-1"><a class="header-anchor" href="#while"><span>while</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 实例一：</span></span>
<span class="line"><span> awk &#39;i=1 {} BEGIN {while (i&lt;3) {++i;print i}}&#39; test.txt </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 实例二：</span></span>
<span class="line"><span> awk &#39;BEGIN {do {++i;print i} while (i&lt;3)}&#39; test.txt </span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;BEGIN{i=1} {while(i&lt;NF) print NF,$i,i++}&#39; /etc/passwd </span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -v i=1 &#39;BEGIN{ while(i&lt;=5){print i; i++}}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{i=1;while(i&lt;=5){print i;i++}}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="do-while" tabindex="-1"><a class="header-anchor" href="#do-while"><span>do while</span></a></h3><p>do…while循环则是无论是否满足条件，都会先执行一遍do对应的代码，然后再判断是否满足while中对应的条件，满足条件，则执行do对应的代码，如果不满足条件，则不再执行do对应的代码</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# awk &#39;BEGIN{i=1; do{print &quot;test&quot;,i;i++}while(i&lt;=5)}&#39;</span></span>
<span class="line"><span>test 1</span></span>
<span class="line"><span>test 2</span></span>
<span class="line"><span>test 3</span></span>
<span class="line"><span>test 4</span></span>
<span class="line"><span>test 5</span></span>
<span class="line"><span></span></span>
<span class="line"><span># i如果没有默认赋值，初始为空，i++后从1开始</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{do{print &quot;test&quot;,i;i++}while(i&lt;=5)}&#39;</span></span>
<span class="line"><span>test </span></span>
<span class="line"><span>test 1</span></span>
<span class="line"><span>test 2</span></span>
<span class="line"><span>test 3</span></span>
<span class="line"><span>test 4</span></span>
<span class="line"><span>test 5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-条件表达式" tabindex="-1"><a class="header-anchor" href="#awk-条件表达式"><span>awk 条件表达式</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 条件表达式    ==   !=   &gt;   &gt;=  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;$1==&quot;mysql&quot;{print $3}&#39; /etc/passwd  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;{if($1==&quot;mysql&quot;) print $3}&#39; /etc/passwd          //与上面相同 </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;$1!=&quot;mysql&quot;{print $3}&#39; /etc/passwd                 //不等于</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;$3&gt;1000{print $3}&#39; /etc/passwd                      //大于</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;$3&gt;=100{print $3}&#39; /etc/passwd                     //大于等于</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;$3&lt;1{print $3}&#39; /etc/passwd                            //小于</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F&quot;:&quot; &#39;$3&lt;=1{print $3}&#39; /etc/passwd                         //小于等于</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-逻辑运算符" tabindex="-1"><a class="header-anchor" href="#awk-逻辑运算符"><span>awk 逻辑运算符</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 逻辑运算符 ，&amp;&amp;　|| </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$1~/mail/ &amp;&amp; $3&gt;8 {print }&#39; /etc/passwd         //逻辑与，$1匹配mail，并且$3&gt;8</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{if($1~/mail/ &amp;&amp; $3&gt;8) print }&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$1~/mail/ || $3&gt;1000 {print }&#39; /etc/passwd       //逻辑或</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;{if($1~/mail/ || $3&gt;1000) print }&#39; /etc/passwd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-数值运算" tabindex="-1"><a class="header-anchor" href="#awk-数值运算"><span>awk 数值运算</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$3 &gt; 100&#39; /etc/passwd    </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$3 &gt; 100 || $3 &lt; 5&#39; /etc/passwd  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;$3+$4 &gt; 200&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;/mysql|mail/{print $3+10}&#39; /etc/passwd                    # 第三个字段加10打印 </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;/mysql/{print $3-$4}&#39; /etc/passwd                         # 减法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F: &#39;/mysql/{print $3*$4}&#39; /etc/passwd                         # 求乘积</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;/MemFree/{print $2/1024}&#39; /proc/meminfo                       # 除法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;/MemFree/{print int($2/1024)}&#39; /proc/meminfo                  # 取整</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 计算/home目录下，普通文件的大小，使用KB作为单位</span></span>
<span class="line"><span>ls -l|awk &#39;BEGIN{sum=0} !/^d/{sum+=$5} END{print &quot;total size is:&quot;,sum/1024,&quot;KB&quot;}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ls -l|awk &#39;BEGIN{sum=0} !/^d/{sum+=$5} END{print &quot;total size is:&quot;,int(sum/1024),&quot;KB&quot;}&#39;      # int是取整的意思</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 统计netstat -anp 状态为LISTEN和CONNECT的连接数量分别是多少</span></span>
<span class="line"><span>netstat -anp|awk &#39;$6~/LISTEN|CONNECTED/{sum[$6]++} END{for (i in sum) printf &quot;%-10s %-6s %-3s \\n&quot;, i,&quot; &quot;,sum[i]}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 统计/home目录下不同用户的普通文件的总数是多少？</span></span>
<span class="line"><span>ls -l|awk &#39;NR!=1 &amp;&amp; !/^d/{sum[$3]++} END{for (i in sum) printf &quot;%-6s %-5s %-3s \\n&quot;,i,&quot; &quot;,sum[i]}&#39;   </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 统计/home目录下不同用户的普通文件的大小总size是多少？</span></span>
<span class="line"><span>ls -l|awk &#39;NR!=1 &amp;&amp; !/^d/{sum[$3]+=$5} END{for (i in sum) printf &quot;%-6s %-5s %-3s %-2s \\n&quot;,i,&quot; &quot;,sum[i]/1024/1024,&quot;MB&quot;}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 输出成绩表</span></span>
<span class="line"><span>[root@localhost home]# cat test0 </span></span>
<span class="line"><span>Marry   2143 78 84 77</span></span>
<span class="line"><span>Jack    2321 66 78 45</span></span>
<span class="line"><span>Tom     2122 48 77 71</span></span>
<span class="line"><span>Mike    2537 87 97 95</span></span>
<span class="line"><span>Bob     2415 40 57 62</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;BEGIN{math=0;eng=0;com=0;printf &quot;Lineno.   Name    No.    Math   English   Computer    Total\\n&quot;;printf &quot;------------------------------------------------------------\\n&quot;}{math+=$3; eng+=$4; com+=$5;printf &quot;%-8s %-7s %-7s %-7s %-9s %-10s %-7s \\n&quot;,NR,$1,$2,$3,$4,$5,$3+$4+$5} END{printf &quot;------------------------------------------------------------\\n&quot;;printf &quot;%-24s %-7s %-9s %-20s \\n&quot;,&quot;Total:&quot;,math,eng,com;printf &quot;%-24s %-7s %-9s %-20s \\n&quot;,&quot;Avg:&quot;,math/NR,eng/NR,com/NR}&#39; test0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-数组" tabindex="-1"><a class="header-anchor" href="#awk-数组"><span>awk 数组</span></a></h2><h3 id="数组遍历" tabindex="-1"><a class="header-anchor" href="#数组遍历"><span>数组遍历</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# cat test.sh </span></span>
<span class="line"><span>#!/bin/awk</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BEGIN{</span></span>
<span class="line"><span> array[1]=&quot;boy1&quot;;</span></span>
<span class="line"><span> array[2]=&quot;boy2&quot;;</span></span>
<span class="line"><span> array[3]=&quot;boy3&quot;;</span></span>
<span class="line"><span> for(key in array)</span></span>
<span class="line"><span>  print key,array[key];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>[root@boy ~]# awk -f test.sh </span></span>
<span class="line"><span>1 boy1</span></span>
<span class="line"><span>2 boy2</span></span>
<span class="line"><span>3 boy3</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 和下面效果一样，如果for只有后边只有一条命令{}可以不用加</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{ array[1]=&quot;boy1&quot;; array[2]=&quot;boy2&quot;; array[3]=&quot;boy3&quot;; for(key in array){print key,array[key]}}&#39;</span></span>
<span class="line"><span>1 boy1</span></span>
<span class="line"><span>2 boy2</span></span>
<span class="line"><span>3 boy3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# cat test</span></span>
<span class="line"><span>1 test1</span></span>
<span class="line"><span>2 test2</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{S[$1]=$2}END{for(key in S) print key,S[key]}&#39; test</span></span>
<span class="line"><span>1 test1</span></span>
<span class="line"><span>2 test2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 统计每个域名次数</span></span>
<span class="line"><span>[root@boy ~]# cat test</span></span>
<span class="line"><span>http://www.a.com/index.html</span></span>
<span class="line"><span>http://www.x.com/index.html</span></span>
<span class="line"><span>http://www.y.com/index.html</span></span>
<span class="line"><span>http://www.z.com/index.html</span></span>
<span class="line"><span>http://www.z.com/index.html</span></span>
<span class="line"><span>http://www.a.com/index.html</span></span>
<span class="line"><span>http://www.b.com/index.html</span></span>
<span class="line"><span>http://www.d.com/index.html</span></span>
<span class="line"><span>http://www.c.com/index.html</span></span>
<span class="line"><span>http://www.r.com/index.html</span></span>
<span class="line"><span>http://www.r.com/index.html</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -F&quot;/&quot; &#39;{S[$3]=S[$3]+1}END{for(key in S) print S[key],key}&#39; test</span></span>
<span class="line"><span>1 www.c.com</span></span>
<span class="line"><span>1 www.y.com</span></span>
<span class="line"><span>2 www.r.com</span></span>
<span class="line"><span>1 www.x.com</span></span>
<span class="line"><span>1 www.d.com</span></span>
<span class="line"><span>2 www.z.com</span></span>
<span class="line"><span>1 www.b.com</span></span>
<span class="line"><span>2 www.a.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -F&quot;/&quot; &#39;{S[$3]++}END{for(key in S) print S[key],key}&#39; test</span></span>
<span class="line"><span>1 www.c.com</span></span>
<span class="line"><span>1 www.y.com</span></span>
<span class="line"><span>2 www.r.com</span></span>
<span class="line"><span>1 www.x.com</span></span>
<span class="line"><span>1 www.d.com</span></span>
<span class="line"><span>2 www.z.com</span></span>
<span class="line"><span>1 www.b.com</span></span>
<span class="line"><span>2 www.a.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 统计网络套接字情况</span></span>
<span class="line"><span>[root@boy ~]# netstat -tunlp | awk &#39;NR&gt;2 &amp;&amp; NF==7 &amp;&amp; /^tcp/ {S[$6]++}END{for(key in S){print key,S[key]}}&#39; | sort -rn -k2 | head</span></span>
<span class="line"><span>LISTEN 4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实例-2" tabindex="-1"><a class="header-anchor" href="#实例-2"><span>实例</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>netstat -anp|awk &#39;NR!=1{a[$6]++} END{for (i in a) print i,&quot;\\t&quot;,a[i]}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>netstat -anp|awk &#39;NR!=1{a[$6]++} END{for (i in a) printf &quot;%-20s %-10s %-5s \\n&quot;, i,&quot;\\t&quot;,a[i]}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-分隔符" tabindex="-1"><a class="header-anchor" href="#awk-分隔符"><span>awk 分隔符</span></a></h2><ul><li>awk内置变量FS可以用于指定输入分隔符，但是在使用变量时，需要使用-v选项，用于指定对应的变量，比如 -v FS=’#’，效果与-F一样</li><li>内置变量OFS来设定awk的输出分隔符，当然，使用变量的时候要配合使用-v选项</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# cat test </span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -v FS=&#39; &#39; -v OFS=&#39;---&#39; &#39;{print $1,$2}&#39; test</span></span>
<span class="line"><span>abc---123</span></span>
<span class="line"><span>8ua---456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 输出分隔符OFS,输出字段6匹配WAIT的行，其中输出每行行号，字段4，5,6，并使用制表符分割字段</span></span>
<span class="line"><span>awk &#39;$6 ~ /FIN/ || NR==1 {print NR,$4,$5,$6}&#39; OFS=&quot;\\t&quot; netstat.txt</span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;$6 ~ /WAIT/ || NR==1 {print NR,$4,$5,$6}&#39; OFS=&quot;\\t&quot; netstat.txt</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-内置函数" tabindex="-1"><a class="header-anchor" href="#awk-内置函数"><span>awk 内置函数</span></a></h2><h4 id="awk-三目运算符" tabindex="-1"><a class="header-anchor" href="#awk-三目运算符"><span>awk 三目运算符</span></a></h4><ul><li>条件 ？ 结果1 ： 结果2</li><li>在awk中，0或者空字符串表示”假”，非0值或者非空字符串表示”真”</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># ”$3&lt;500″就是上述语法中的”条件”，”系统用户”就是上述语法中”?”后面的”结果1″，”普通用户”就是上述语法中”:”后面的”结果2″  ，同时，在上例中我们使用usertype变量接收了三元运算后的返回值，所以，当条件成立时，usertype变量被赋值为”系统用户”，当条件不成立时，usertype变量被赋值为”普通用户”</span></span>
<span class="line"><span>[root@boy ~]# awk -F: &#39;{ usertype=$3&lt;500?&quot;系统用户&quot;:&quot;普通用户&quot;; print $1,usertype}&#39; /etc/passwd</span></span>
<span class="line"><span>root 系统用户</span></span>
<span class="line"><span>bin 系统用户</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 可见a,b默认是空的</span></span>
<span class="line"><span>[root@boy ~]# awk -F: &#39;BEGIN{print a;b} {$3&lt;500?a++:b++;print $0,a,b}END{print a,b}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>root:x:0:0:root:/root:/bin/bash 1 </span></span>
<span class="line"><span>bin:x:1:1:bin:/bin:/sbin/nologin 2 </span></span>
<span class="line"><span>daemon:x:2:2:daemon:/sbin:/sbin/nologin 3 </span></span>
<span class="line"><span>adm:x:3:4:adm:/var/adm:/sbin/nologin 4 </span></span>
<span class="line"><span>lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin 5 </span></span>
<span class="line"><span>sync:x:5:0:sync:/sbin:/bin/sync 6 </span></span>
<span class="line"><span>shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown 7 </span></span>
<span class="line"><span>halt:x:7:0:halt:/sbin:/sbin/halt 8 </span></span>
<span class="line"><span>mail:x:8:12:mail:/var/spool/mail:/sbin/nologin 9 </span></span>
<span class="line"><span>operator:x:11:0:operator:/root:/sbin/nologin 10 </span></span>
<span class="line"><span>games:x:12:100:games:/usr/games:/sbin/nologin 11 </span></span>
<span class="line"><span>ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin 12 </span></span>
<span class="line"><span>nobody:x:99:99:Nobody:/:/sbin/nologin 13 </span></span>
<span class="line"><span>systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin 14 </span></span>
<span class="line"><span>dbus:x:81:81:System message bus:/:/sbin/nologin 15 </span></span>
<span class="line"><span>polkitd:x:999:998:User for polkitd:/:/sbin/nologin 15 1</span></span>
<span class="line"><span>sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin 16 1</span></span>
<span class="line"><span>postfix:x:89:89::/var/spool/postfix:/sbin/nologin 17 1</span></span>
<span class="line"><span>chrony:x:998:996::/var/lib/chrony:/sbin/nologin 17 2</span></span>
<span class="line"><span>17 2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# awk &#39;1{print $0}&#39; test </span></span>
<span class="line"><span>name   sex    age</span></span>
<span class="line"><span>jack   men    18</span></span>
<span class="line"><span>cnm    women  18</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;0{print $0}&#39; test</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;!0{print $0}&#39; test</span></span>
<span class="line"><span>name   sex    age</span></span>
<span class="line"><span>jack   men    18</span></span>
<span class="line"><span>cnm    women  18</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;0&#39; test </span></span>
<span class="line"><span>[root@boy ~]# awk &#39;!0&#39; test </span></span>
<span class="line"><span>name   sex    age</span></span>
<span class="line"><span>jack   men    18</span></span>
<span class="line"><span>cnm    women  18</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># 当awk开始处理第一行时，变量 i 被初始化，变量 i 在被初始化时，值为”空”，而awk中，数字0或者”空字符串”表示假，所以可以认为模式为假，但是 i 直接取反了，对假取反后的值为真，将取反后的值又赋值给了变量i，此刻，变量i的值为真，所以当awk处理第一行文本时，变量i的值被赋值为真，模式成立则需要执行对应的动作，而上例中又省略了动作，所以默认动作为”{print $0}”，所以，第一行被整行打印了</span></span>
<span class="line"><span># 当第一行文本处理完毕后，awk开始处理第二行文本，此时，i 为真，但是取反后，i 为假，所以第二行没有被输出，依次类推，最终只打印了奇数行</span></span>
<span class="line"><span>[root@boy ~]# awk &#39;i=!i{print NR}&#39; /etc/passwd</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span>7</span></span>
<span class="line"><span>9</span></span>
<span class="line"><span>11</span></span>
<span class="line"><span>13</span></span>
<span class="line"><span>15</span></span>
<span class="line"><span>17</span></span>
<span class="line"><span>19</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-printf" tabindex="-1"><a class="header-anchor" href="#awk-printf"><span>awk printf</span></a></h2><h4 id="printf" tabindex="-1"><a class="header-anchor" href="#printf"><span>printf</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 格式</span></span>
<span class="line"><span> %s 字符串</span></span>
<span class="line"><span> %f 浮点格式（也就是我们概念中的float或者double）</span></span>
<span class="line"><span> %b 相对应的参数中包含转义字符时，可以使用此替换符进行替换，对应的转义字符会被转义。</span></span>
<span class="line"><span> %c ASCII字符。显示相对应参数的第一个字符</span></span>
<span class="line"><span> %d, %i 十进制整数</span></span>
<span class="line"><span> %o 不带正负号的八进制值</span></span>
<span class="line"><span> %u 不带正负号的十进制值</span></span>
<span class="line"><span> %x 不带正负号的十六进制值，使用a至f表示10至15</span></span>
<span class="line"><span> %X 不带正负号的十六进制值，使用A至F表示10至15</span></span>
<span class="line"><span> %% 表示”%”本身</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 转义字符</span></span>
<span class="line"><span>    \\a 警告字符，通常为ASCII的BEL字符</span></span>
<span class="line"><span>    \\b 后退</span></span>
<span class="line"><span>    \\c 抑制（不显示）输出结果中任何结尾的换行字符（只在%b格式指示符控制下的参数字符串中有效），而且，任何留在参数里的字符、任何接下来的参数以及任何留在格式字符串中的字符，都被忽略</span></span>
<span class="line"><span>    \\f 换页（formfeed）</span></span>
<span class="line"><span>    \\n 换行</span></span>
<span class="line"><span>    \\r 回车（Carriage return）</span></span>
<span class="line"><span>    \\t 水平制表符</span></span>
<span class="line"><span>    \\v 垂直制表符</span></span>
<span class="line"><span>    \\\\ 一个字面上的反斜杠字符，即”\\”本身。</span></span>
<span class="line"><span>    \\ddd 表示1到3位数八进制值的字符，仅在格式字符串中有效</span></span>
<span class="line"><span>    \\0ddd 表示1到3位的八进制值字符</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 对齐</span></span>
<span class="line"><span> ”-“：表示左对齐，默认不加”-“时表示右对齐，其实”-“也是修饰符</span></span>
<span class="line"><span> “+”：在默认没有添加”+”作为修饰符时，烈火兽的体温输出为180，而使用了”+”修饰符以后，烈火兽的体温输出为+180，看到这里你应该明白了，当替换符对应的参数为数字时，可以使用”+”作为修饰符，输出”正数”前面的”正号”</span></span>
<span class="line"><span> “%12.3”：第一条命令的数字修饰符为12，表示对应的替换符”%f”的输出宽度为12个字符，第二条命令的数字修饰符为12.3 ，表示对应的替换符”%f”的输出宽度为12个字符，并且小数点的精度为3</span></span>
<span class="line"><span> ”%d”：如果数字修饰符带有小数点，则数字修饰符小数点后的数字表示整数的长度，长度不够时，高位用0补全</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[root@boy ~]# printf &quot;(%s)&quot; 1 19 18 16 ; echo &quot;&quot;</span></span>
<span class="line"><span>(1)(19)(18)(16)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# printf &quot;%s %s\\n&quot; a b c d e f</span></span>
<span class="line"><span>a b</span></span>
<span class="line"><span>c d</span></span>
<span class="line"><span>e f</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 我们只是在原来的”格式替换符”中间加入了特定的数字，貌似显示效果就比刚才好了一点，起码年龄字段对应数字与”年龄”两个字对齐了。那么这些数字是什么意思呢？上图中第一个”%7s”中间的7表示当前替换符对应的输出宽度为7个字符宽，如果对应的输出不足7个字符，则用空格补全，如果输出的长度超过7个字符，超出的部分也会显示。同理”%5s”表示当前替换符对应的输出宽度为5个字符的宽度。而这些数字，我们可以将其称之为”修饰符”，修饰符会对相应的”替换符”进行修饰</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# printf &quot;%s %s %s\\n&quot; 姓名 性别 年龄 尼玛 男 20 你妹 女 18</span></span>
<span class="line"><span>姓名 性别 年龄</span></span>
<span class="line"><span>尼玛 男 20</span></span>
<span class="line"><span>你妹 女 18</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# printf &quot;%7s %5s %4s\\n&quot; 姓名 性别 年龄 尼玛 男 20 你妹 女 18</span></span>
<span class="line"><span> 姓名 性别 年龄</span></span>
<span class="line"><span> 尼玛   男   20</span></span>
<span class="line"><span> 你妹   女   18</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="awk" tabindex="-1"><a class="header-anchor" href="#awk"><span>awk</span></a></h4><p>我们来总结一下，在awk中使用printf动作时，需要注意以下3点。</p><ul><li><p>使用printf动作输出的文本不会换行，如果需要换行，可以在对应的”格式替换符”后加入”\\n”进行转义。</p></li><li><p>使用printf动作时，”指定的格式” 与 “被格式化的文本” 之间，需要用”逗号”隔开。</p></li><li><p>使用printf动作时，”格式”中的”格式替换符”必须与 “被格式化的文本” 一一对应</p></li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>netstat -anp|awk &#39;{printf &quot;%-8s %-8s %-10s\\n&quot;,$1,$2,$3}&#39; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>printf表示格式输出</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%格式化输出分隔符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-8长度为8个字符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>s表示字符串类型</span></span>
<span class="line"><span></span></span>
<span class="line"><span>打印每行前三个字段，指定第一个字段输出字符串类型(长度为8)，第二个字段输出字符串类型(长度为8),</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第三个字段输出字符串类型(长度为10)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>netstat -anp|awk &#39;$6==&quot;LISTEN&quot; || NR==1 {printf &quot;%-10s %-10s %-10s \\n&quot;,$1,$2,$3}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>netstat -anp|awk &#39;$6==&quot;LISTEN&quot; || NR==1 {printf &quot;%-3s %-10s %-10s %-10s \\n&quot;,NR,$1,$2,$3}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 查看文件</span></span>
<span class="line"><span>[root@boy ~]# cat test</span></span>
<span class="line"><span>abc 123 iuy ddd</span></span>
<span class="line"><span>8ua 456 auv php 7y7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;{printf &quot;%s\\n&quot;,$1}&#39; test</span></span>
<span class="line"><span>abc</span></span>
<span class="line"><span>8ua</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk &#39;BEGIN{printf &quot;%s\\n%s\\n%s\\n&quot;,1,2,3}&#39;</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@boy ~]# awk -v FS=&quot;:&quot; &#39;BEGIN{printf &quot;%-10s\\t %s\\n&quot;,&quot;用户名称&quot;,&quot;用户ID&quot;} {printf &quot;%-10s\\t %s\\n&quot;,$1,$3}&#39; /etc/passwd</span></span>
<span class="line"><span>用户名称        用户ID</span></span>
<span class="line"><span>root        0</span></span>
<span class="line"><span>bin         1</span></span>
<span class="line"><span>daemon      2</span></span>
<span class="line"><span>adm         3</span></span>
<span class="line"><span>lp          4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出处理结果到文件</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 输出处理结果到文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>①在命令代码块中直接输出    route -n|awk &#39;NR!=1{print &gt; &quot;./fs&quot;}&#39;   </span></span>
<span class="line"><span></span></span>
<span class="line"><span>②使用重定向进行输出           route -n|awk &#39;NR!=1{print}&#39;  &gt; ./fs</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="awk-替换" tabindex="-1"><a class="header-anchor" href="#awk-替换"><span>awk 替换</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># sub匹配第一次出现的符合模式的字符串，相当于 sed &#39;s//&#39; </span></span>
<span class="line"><span># gsub匹配所有的符合模式的字符串，相当于 sed &#39;s//g&#39; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk -F &#39;|&#39;  &#39;{sub(/[0-9]+/,&quot;&quot;,$2);print $0}&#39; data.test </span></span>
<span class="line"><span></span></span>
<span class="line"><span>awk &#39;{sub(/Mac/,&quot;Macintosh&quot;);print}&#39; urfile    用Macintosh替换Mac</span></span>
<span class="line"><span>awk &#39;{sub(/Mac/,&quot;MacIntosh&quot;,$1); print}&#39; file    第一个域内用Macintosh替换Mac</span></span>
<span class="line"><span></span></span>
<span class="line"><span># sub函数匹配指定域/记录中最大、最靠左边的子字符串的正则表达式，并用替换字符串替换这些字符串,如果没有指定目标字符串就默认使用整个记录。替换只发生在第一次匹配的时候。格式如下</span></span>
<span class="line"><span>    sub (regular expression, substitution string):</span></span>
<span class="line"><span>    sub (regular expression, substitution string, target string)</span></span>
<span class="line"><span>    $ awk &#39;{ sub(/test/, &quot;mytest&quot;); print }&#39; testfile  #在整个记录中匹配，替换只发生在第一次匹配发生的时候</span></span>
<span class="line"><span>    $ awk &#39;{ sub(/test/, &quot;mytest&quot;, $1); print }&#39; testfile #在整个记录的第一个域中进行匹配，替换只发生在第一次匹配发生的时候</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>​ </span></span>
<span class="line"><span># 如要在整个文件中进行匹配需要用到gsubgsub函数作用如sub，但它在整个文档中进行匹配。格式如下：</span></span>
<span class="line"><span> gsub (regular expression, substitution string)</span></span>
<span class="line"><span> gsub (regular expression, substitution string, target string)</span></span>
<span class="line"><span> $ awk &#39;{ gsub(/test/, &quot;mytest&quot;); print }&#39; testfile #在整个文档中匹配test，匹配的都被替换成mytest</span></span>
<span class="line"><span> $ awk &#39;{ gsub(/test/, &quot;mytest&quot;, $1); print }&#39; testfile #在整个文档的第一个域中匹配，所有匹配的都被替换成mytest</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>​ </span></span>
<span class="line"><span># 删除所有空白：（空格、TAB等）【注：三条语句等效】：</span></span>
<span class="line"><span>    [oracle@localhost 201402261951.script]$ echo &#39;a bc  d&#39; | awk &#39;{gsub(/[[:blank:]]/, &quot;&quot;,$0)}&#39;</span></span>
<span class="line"><span>    abcd</span></span>
<span class="line"><span>    [oracle@localhost 201402261951.script]$ echo &#39;a bc  d&#39; | awk &#39;gsub(/[[:blank:]]/, &quot;&quot;,$0)&#39;</span></span>
<span class="line"><span>abcd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,104)]))}const c=n(l,[["render",p]]),r=JSON.parse(`{"path":"/note-book/Linux%E4%B8%89%E5%89%91%E5%AE%A2/Gawk/Awk%E6%A1%88%E4%BE%8B%E5%85%A5%E9%97%A8.html","title":"Awk案例入门","lang":"zh-CN","frontmatter":{"description":"Awk案例入门 简介 awk 擅长对列进行操作/进行数据信息操作 awk 的基本使用（高级使用在shell) awk把文本文档看作是数据库，每一行看作一条数据库中的记录，可以指定数据列的分隔符，默认的分隔符是”\\\\t”,即Tab。 awk工作流程是这样的：读入有’\\\\n’换行符分割的一条记录，然后将记录按指定的域分隔符划分域，填充域，$0则表示所有域, 1...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Awk案例入门\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-25T08:29:56.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Linux%E4%B8%89%E5%89%91%E5%AE%A2/Gawk/Awk%E6%A1%88%E4%BE%8B%E5%85%A5%E9%97%A8.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"Awk案例入门"}],["meta",{"property":"og:description","content":"Awk案例入门 简介 awk 擅长对列进行操作/进行数据信息操作 awk 的基本使用（高级使用在shell) awk把文本文档看作是数据库，每一行看作一条数据库中的记录，可以指定数据列的分隔符，默认的分隔符是”\\\\t”,即Tab。 awk工作流程是这样的：读入有’\\\\n’换行符分割的一条记录，然后将记录按指定的域分隔符划分域，填充域，$0则表示所有域, 1..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-25T08:29:56.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-25T08:29:56.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1711355396000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":1,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":2,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"b1df1de0f82c85fe7f9afc5937f0b8af9255a5dc","time":1711355396000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"修正Markdown语法错误"},{"hash":"4dc3f471bd7834191f2c210ac6535b23224a8452","time":1710833914000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"awk"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":24.83,"words":7449},"filePathRelative":"note-book/Linux三剑客/Gawk/Awk案例入门.md","excerpt":"\\n<h2>简介</h2>\\n<ul>\\n<li>awk 擅长对列进行操作/进行数据信息操作</li>\\n<li>awk 的基本使用（高级使用在shell)</li>\\n<li>awk把文本文档看作是数据库，每一行看作一条数据库中的记录，可以指定数据列的分隔符，默认的分隔符是”\\\\t”,即Tab。</li>\\n<li>awk工作流程是这样的：读入有’\\\\n’换行符分割的一条记录，然后将记录按指定的域分隔符划分域，填充域，$0则表示所有域, 1 表 示</li>\\n<li>第 一 个 域 , 1表示第一个域, 1表示第一个域,n表示第n个域。默认域分隔符是”空白键” 或 “[tab]键”</li>\\n<li>awk的执行模式是： awk '{pattern + action}' {filenames}</li>\\n</ul>","autoDesc":true}`);export{c as comp,r as data};
