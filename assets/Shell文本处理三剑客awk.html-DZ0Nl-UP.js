import{ah as n,ai as a,ar as i,am as e}from"./app-GrhoROuM.js";const l={};function p(d,s){return e(),a("div",null,[...s[0]||(s[0]=[i(`<h1 id="shell文本处理三剑客awk" tabindex="-1"><a class="header-anchor" href="#shell文本处理三剑客awk"><span>Shell文本处理三剑客awk</span></a></h1><h2 id="_2-1awk简介" tabindex="-1"><a class="header-anchor" href="#_2-1awk简介"><span><strong>2.1awk简介</strong></span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-text"><span class="line"><span>awk 是一种编程语言，用于在linux/unix下对文本和数据进行处理。数据可以来自标准输入、一个或多个文件，或其它命令的输出。它支持用户自定义函数和动态正则表达式等先进功能，是linux/unix下的一个强大编程工具。它在命令行中使用，但更多是作为脚本来使用。awk的处理文本和数据的方式是这样的，它逐行扫描文件，从第一行到最后一行，寻找匹配的特定模式的行，并在这些行上进行你想要的操作。如果没有指定处理动作，则把匹配的行显示到标准输出(屏幕)，如果没有指定模式，则所有被操作所指定的行都被处理。awk分别代表其作者姓氏的第一个字母。因为它的作者是三个人，分别是Alfred Aho、Brian Kernighan、Peter Weinberger。gawk是awk的GNU版本，它提供了Bell实验室和GNU的一些扩展。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="_2-2awk的语法格式" tabindex="-1"><a class="header-anchor" href="#_2-2awk的语法格式"><span><strong>2.2awk的语法格式</strong></span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-text"><span class="line"><span>awk [options] &#39;commands&#39; filenames</span></span>
<span class="line"><span>awk [options] -f awk-script-file filenames</span></span>
<span class="line"><span></span></span>
<span class="line"><span>options：</span></span>
<span class="line"><span>-F   定义输入字段分隔符，默认的分隔符是空格或制表符(tab)</span></span>
<span class="line"><span>command：</span></span>
<span class="line"><span>BEGIN{}       {}                END{}</span></span>
<span class="line"><span>行处理前      行处理       行处理后</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;BEGIN{print 1/2} {print &quot;ok&quot;} END{print &quot;-----------&quot;}&#39; /etc/hosts</span></span>
<span class="line"><span>0.5</span></span>
<span class="line"><span>ok</span></span>
<span class="line"><span>ok</span></span>
<span class="line"><span>ok</span></span>
<span class="line"><span>-----------</span></span>
<span class="line"><span>BEGIN{} 通常用于定义一些变量，例如BEGIN{FS=&quot;:&quot;;OFS=&quot;---&quot;}</span></span>
<span class="line"><span>awk命令格式：</span></span>
<span class="line"><span>awk &#39;pattern&#39; filename</span></span>
<span class="line"><span>示例：awk -F: &#39;/root/&#39; /etc/passwd</span></span>
<span class="line"><span>awk &#39;{action}&#39; filename</span></span>
<span class="line"><span>示例：awk -F: &#39;{print $1}&#39; /etc/passwd</span></span>
<span class="line"><span>awk &#39;pattern {action}&#39; filename</span></span>
<span class="line"><span>示例：awk -F: &#39;/root/{print $1,$3}&#39; /etc/passwd</span></span>
<span class="line"><span>示例：awk &#39;BEGIN{FS=&quot;:&quot;} /root/{print $1,$3}&#39; /etc/passwd</span></span>
<span class="line"><span>command |awk &#39;pattern {action}&#39;</span></span>
<span class="line"><span>示例：df -P| grep  &#39;/&#39; |awk &#39;$4 &gt; 25000 {print $4}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-3awk工作原理" tabindex="-1"><a class="header-anchor" href="#_2-3awk工作原理"><span><strong>2.3awk工作原理</strong></span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-text"><span class="line"><span>[root@xulei ~}# awk -F: &#39;{print $1,$3}&#39; /etc/passwd</span></span>
<span class="line"><span>(1)awk使用一行作为输入，并将这一行赋给内部变量$0，每一行也可称为一个记录，以换行符结束</span></span>
<span class="line"><span>(2)然后，行被:（默认为空格或制表符）分解成字段（或域），每个字段存储在已编号的变量中，从$1开始，</span></span>
<span class="line"><span>最多达100个字段</span></span>
<span class="line"><span>(3)awk如何知道用空格来分隔字段的呢？ 因为有一个内部变量FS来确定字段分隔符。初始时，FS赋为空格</span></span>
<span class="line"><span>(4)awk打印字段时，将以设置的方法使用print函数打印，awk在打印的字段间加上空格，因为$1,$3之间有一个逗号。逗号比较特殊，它映射为另一个内部变量，称为输出字段分隔符OFS，OFS默认为空格</span></span>
<span class="line"><span>(5)awk输出之后，将从文件中获取另一行，并将其存储在$0中，覆盖原来的内容，然后将新的字符串分隔成字段并进行处理。该过程将持续到所有行处理完毕</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-4记录与字段相关内部变量-man-awk" tabindex="-1"><a class="header-anchor" href="#_2-4记录与字段相关内部变量-man-awk"><span><strong>2.4记录与字段相关内部变量：man awk</strong></span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-text"><span class="line"><span>$0：     awk变量$0保存当前记录的内容                             [root@xulei ~]# awk -F: &#39;{print $0}&#39; /etc/passwd</span></span>
<span class="line"><span>NR：     The total number of input records seen so far.      [root@xulei ~]# awk -F: &#39;{print NR, $0}&#39; /etc/passwd /etc/hosts</span></span>
<span class="line"><span>FNR：   The input record number in the current input file    [root@xulei ~]# awk -F: &#39;{print FNR, $0}&#39; /etc/passwd /etc/hosts</span></span>
<span class="line"><span>NF：     保存记录的字段数，$1,$2...$100                           [root@xulei ~]# awk -F: &#39;{print $0,NF}&#39; /etc/passwd</span></span>
<span class="line"><span>FS：     输入字段分隔符，默认空格                                 [root@xulei ~]# awk -F: &#39;/alice/{print $1, $3}&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F&#39;[ :\\t]&#39; &#39;{print $1,$2,$3}&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;BEGIN{FS=&quot;:&quot;} {print $1,$3}&#39; /etc/passwd</span></span>
<span class="line"><span>OFS：     输出字段分隔符                                       [root@xulei ~]# awk -F: &#39;/alice/{print $1,$2,$3,$4}&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;BEGIN{FS=&quot;:&quot;; OFS=&quot;+++&quot;} /^root/{print $1,$2,$3,$4}&#39; passwd</span></span>
<span class="line"><span>RS:       The input record separator, by default a newline. [root@xulei ~]# awk -F: &#39;BEGIN{RS=&quot; &quot;} {print $0}&#39; a.txt</span></span>
<span class="line"><span>ORS:      The output record separator, by default a newline. [root@xulei ~]# awk -F: &#39;BEGIN{ORS=&quot;&quot;} {print $0}&#39; passwd</span></span>
<span class="line"><span>区别：</span></span>
<span class="line"><span>字段分隔符: FS OFS  默认空格或制表符</span></span>
<span class="line"><span>记录分隔符: RS ORS 默认换行符</span></span>
<span class="line"><span></span></span>
<span class="line"><span>lab1:</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;BEGIN{ORS=&quot; &quot;} {print $0}&#39; /etc/passwd</span></span>
<span class="line"><span>将文件每一行合并为一行,ORS默认输出一条记录应该回车，加了一个空格</span></span>
<span class="line"><span>lab2:</span></span>
<span class="line"><span>[root@xulei ~]# head -1 /etc/passwd &gt; passwd1</span></span>
<span class="line"><span>[root@xulei ~]# cat passwd1</span></span>
<span class="line"><span>root:x:0:0:root:/root:/bin/bash</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;BEGIN{RS=&quot;:&quot;} {print $0}&#39; passwd1</span></span>
<span class="line"><span>root</span></span>
<span class="line"><span>x</span></span>
<span class="line"><span>0</span></span>
<span class="line"><span>0</span></span>
<span class="line"><span>root</span></span>
<span class="line"><span>/root</span></span>
<span class="line"><span>/bin/bas</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;BEGIN{RS=&quot;:&quot;} {print $0}&#39; passwd1 |grep -v &#39;^$&#39; &gt; passwd2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-5格式化输出" tabindex="-1"><a class="header-anchor" href="#_2-5格式化输出"><span><strong>2.5格式化输出</strong></span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-text"><span class="line"><span>print函数</span></span>
<span class="line"><span>[root@xulei ~]# date |awk &#39;{print &quot;Month: &quot; $2 &quot;\\nYear: &quot; $NF}&#39;</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{print &quot;username is: &quot; $1 &quot;\\t uid is: &quot; $3}&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{print &quot;\\tusername and uid: &quot; $1,$3 &quot;!&quot;}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>printf函数</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{printf &quot;%-15s %-10s %-15s\\n&quot;, $1,$2,$3}&#39;  /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{printf &quot;|%-15s| %-10s| %-15s|\\n&quot;, $1,$2,$3}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>%s 字符类型</span></span>
<span class="line"><span>%d 数值类型</span></span>
<span class="line"><span>%f 浮点类型</span></span>
<span class="line"><span>占15字符</span></span>
<span class="line"><span>- 表示左对齐，默认是右对齐</span></span>
<span class="line"><span>printf默认不会在行尾自动换行，加\\n</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-6awk模式和动作" tabindex="-1"><a class="header-anchor" href="#_2-6awk模式和动作"><span><strong>2.6awk模式和动作</strong></span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-text"><span class="line"><span>    任何awk语句都由模式和动作组成。模式部分决定动作语句何时触发及触发事件。处理即对数据进行的操作。如果省略模式部分，动作将时刻保持执行状态。模式可以是任何条件语句或复合语句或正则表达式。模式包括两个特殊字段 BEGIN和END。使用BEGIN语句设置计数和打印头。BEGIN语句使用在任何文本浏览动作之前，之后文本浏览动作依据输入文本开始执行。END语句用来在awk完成文本浏览动作后打印输出文本总数和结尾状态。</span></span>
<span class="line"><span>模式可以是：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.正则表达式：</span></span>
<span class="line"><span>匹配记录（整行）：</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;/^alice/&#39;  /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;$0 ~ /^alice/&#39;  /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;!/alice/&#39; passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;$0 !~ /^alice/&#39;  /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>匹配字段：匹配操作符（~ !~）</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$1 ~ /^alice/&#39;  /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$NF !~ /bash$/&#39;  /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>比较表达式：</span></span>
<span class="line"><span>比较表达式采用对文本进行比较，只有当条件为真，才执行指定的动作。比较表达式使用关系运算符,用于比较数字与字符串。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>关系运算符</span></span>
<span class="line"><span>运算符         含义                           示例</span></span>
<span class="line"><span>&lt;             小于                           x&lt;y</span></span>
<span class="line"><span>&lt;=          小于或等于                        x&lt;=y</span></span>
<span class="line"><span>==            等于                           x==y</span></span>
<span class="line"><span>!=           不等于                           x!=y</span></span>
<span class="line"><span>&gt;=          大于等于                          x&gt;=y</span></span>
<span class="line"><span>&gt;             大于                            x&gt;y</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$3 == 0&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$3 &lt; 10&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$NF == &quot;/bin/bash&quot;&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$1 == &quot;alice&quot;&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$1 ~ /alic/ &#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$1 !~ /alic/ &#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# df -P | grep  &#39;/&#39; |awk &#39;$4 &gt; 25000&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>条件表达式：</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$3&gt;300 {print $0}&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{ if($3&gt;300) print $0 }&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{ if($3&gt;300) {print $0} }&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{ if($3&gt;300) {print $3} else{print $1} }&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>算术运算：+ - * / %(模) ^(幂2^3)</span></span>
<span class="line"><span>可以在模式中执行计算，awk都将按浮点数方式执行算术运算</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$3 * 10 &gt; 500&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{ if($3*10&gt;500){print $0} }&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>逻辑操作符和复合模式</span></span>
<span class="line"><span>&amp;&amp;          逻辑与     a&amp;&amp;b</span></span>
<span class="line"><span>||          逻辑或     a||b</span></span>
<span class="line"><span>!           逻辑非     !a</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$1~/root/ &amp;&amp; $3&lt;=15&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;$1~/root/ || $3&lt;=15&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;!($1~/root/ || $3&lt;=15)&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>范围模式</span></span>
<span class="line"><span>[root@xulei ~]# awk &#39;/Tom/,/Suzanne/&#39; filename</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-7awk脚本编程" tabindex="-1"><a class="header-anchor" href="#_2-7awk脚本编程"><span><strong>2.7awk脚本编程</strong></span></a></h2><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-text"><span class="line"><span>条件判断</span></span>
<span class="line"><span>if语句：</span></span>
<span class="line"><span>格式</span></span>
<span class="line"><span>{if(表达式)｛语句;语句;...｝}</span></span>
<span class="line"><span>awk -F: &#39;{if($3==0) {print $1 &quot; is administrator.&quot;}}&#39; /etc/passwd</span></span>
<span class="line"><span>awk -F: &#39;{if($3&gt;0 &amp;&amp; $3&lt;1000){count++;}}  END{print count}&#39; /etc/passwd 　　//统计系统用户数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if...else语句:</span></span>
<span class="line"><span>格式</span></span>
<span class="line"><span>{if(表达式)｛语句;语句;...｝else{语句;语句;...}}</span></span>
<span class="line"><span>awk -F: &#39;{if($3==0){print $1} else {print $7}}&#39; /etc/passwd</span></span>
<span class="line"><span>awk -F: &#39;{if($3==0) {count++} else{i++} }&#39; /etc/passwd</span></span>
<span class="line"><span>awk -F: &#39;{if($3==0){count++} else{i++}} END{print &quot;管理员个数: &quot;count ; print &quot;系统用户数: &quot;i}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if...else if...else语句：</span></span>
<span class="line"><span>格式</span></span>
<span class="line"><span>{if(表达式1)｛语句;语句；...｝else if(表达式2)｛语句;语句；...｝else if(表达式3)｛语句;语句；...｝else｛语句;语句；...｝}</span></span>
<span class="line"><span>awk -F: &#39;{if($3==0){i++} else if($3&gt;999){k++} else{j++}} END{print i; print k; print j}&#39; /etc/passwd</span></span>
<span class="line"><span>awk -F: &#39;{if($3==0){i++} else if($3&gt;999){k++} else{j++}} END{print &quot;管理员个数: &quot;i; print &quot;普通用个数: &quot;k; print &quot;系统用户: &quot;j}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>循环</span></span>
<span class="line"><span>while:</span></span>
<span class="line"><span>[root@blackmed ~]# awk &#39;BEGIN{ i=1; while(i&lt;=10){print i; i++}  }&#39;</span></span>
<span class="line"><span>[root@blackmed ~]# awk -F: &#39;/^root/{i=1; while(i&lt;=7){print $i; i++}}&#39; passwd</span></span>
<span class="line"><span>[root@blackmed ~]# awk  &#39;{i=1; while(i&lt;=NF){print $i; i++}}&#39; /etc/hosts</span></span>
<span class="line"><span>[root@blackmed ~]# awk -F: &#39;{i=1; while(i&lt;=10) {print $0;  i++}}&#39; /etc/passwd      //将每行打印10次</span></span>
<span class="line"><span>[root@blackmed ~]# cat b.txt</span></span>
<span class="line"><span>111 222</span></span>
<span class="line"><span>333 444 555</span></span>
<span class="line"><span>666 777 888 999</span></span>
<span class="line"><span>[root@blackmed ~]# awk &#39;{i=1; while(i&lt;=NF){print $i; i++}}&#39; b.txt                       //分别打印每行的每列</span></span>
<span class="line"><span>111</span></span>
<span class="line"><span>222</span></span>
<span class="line"><span>333</span></span>
<span class="line"><span>444</span></span>
<span class="line"><span>555</span></span>
<span class="line"><span>666</span></span>
<span class="line"><span>777</span></span>
<span class="line"><span>888</span></span>
<span class="line"><span>999</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for:</span></span>
<span class="line"><span>[root@blackmed ~]# awk &#39;BEGIN{for(i=1;i&lt;=5;i++){print i} }&#39; //C风格for</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>2</span></span>
<span class="line"><span>3</span></span>
<span class="line"><span>4</span></span>
<span class="line"><span>5</span></span>
<span class="line"><span>[root@blackmed ~]# awk -F: &#39;{ for(i=1;i&lt;=10;i++) {print $0} }&#39; /etc/passwd          //将每行打印10次</span></span>
<span class="line"><span>[root@blackmed ~]# awk -F: &#39;{ for(i=1;i&lt;=NF;i++) {print $i} }&#39; passwd               //分别打印每行的每列</span></span>
<span class="line"><span>root</span></span>
<span class="line"><span>x</span></span>
<span class="line"><span>0</span></span>
<span class="line"><span>0</span></span>
<span class="line"><span>root</span></span>
<span class="line"><span>/root</span></span>
<span class="line"><span>/bin/bash</span></span>
<span class="line"><span>bin</span></span>
<span class="line"><span>x</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>1</span></span>
<span class="line"><span>bin</span></span>
<span class="line"><span>/bin</span></span>
<span class="line"><span>/sbin/nologin</span></span>
<span class="line"><span></span></span>
<span class="line"><span>数组</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{username[++i]=$1} END{print username[1]}&#39; /etc/passwd</span></span>
<span class="line"><span>root</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{username[i++]=$1} END{print username[1]}&#39; /etc/passwd</span></span>
<span class="line"><span>bin</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{username[i++]=$1} END{print username[0]}&#39; /etc/passwd</span></span>
<span class="line"><span>root</span></span>
<span class="line"><span></span></span>
<span class="line"><span>数组遍历：</span></span>
<span class="line"><span>1. 按索引遍历</span></span>
<span class="line"><span>2. 按元数个数遍历</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按元数个数遍历</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{username[x++]=$1} END{for(i=0;i&lt;x;i++) print i,username[i]}&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{username[++x]=$1} END{for(i=1;i&lt;=x;i++) print i,username[i]}&#39; /etc/passwd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>按索引遍历</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{username[x++]=$1} END{for(i in username) {print i,username[i]} }&#39; /etc/passwd</span></span>
<span class="line"><span>[root@xulei ~]# awk -F: &#39;{username[++x]=$1} END{for(i in username) {print i,username[i]} }&#39; /etc/passwd</span></span>
<span class="line"><span>注：变量i是索引</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15)])])}const r=n(l,[["render",p]]),t=JSON.parse('{"path":"/note-book/Linux%E4%B8%89%E5%89%91%E5%AE%A2/Gawk/Shell%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2awk.html","title":"Shell文本处理三剑客awk","lang":"zh-CN","frontmatter":{"description":"Shell文本处理三剑客awk 2.1awk简介 2.2awk的语法格式 2.3awk工作原理 2.4记录与字段相关内部变量：man awk 2.5格式化输出 2.6awk模式和动作 2.7awk脚本编程","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Shell文本处理三剑客awk\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-09-14T02:56:50.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Paper-Dragon\\",\\"url\\":\\"https://github.com/Paper-Dragon\\",\\"email\\":\\"2678885646@qq.com\\"}]}"],["meta",{"property":"og:url","content":"https://www.geekery.cn/note-book/Linux%E4%B8%89%E5%89%91%E5%AE%A2/Gawk/Shell%E6%96%87%E6%9C%AC%E5%A4%84%E7%90%86%E4%B8%89%E5%89%91%E5%AE%A2awk.html"}],["meta",{"property":"og:site_name","content":"运维开发绿皮书"}],["meta",{"property":"og:title","content":"Shell文本处理三剑客awk"}],["meta",{"property":"og:description","content":"Shell文本处理三剑客awk 2.1awk简介 2.2awk的语法格式 2.3awk工作原理 2.4记录与字段相关内部变量：man awk 2.5格式化输出 2.6awk模式和动作 2.7awk脚本编程"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-09-14T02:56:50.000Z"}],["meta",{"property":"article:modified_time","content":"2025-09-14T02:56:50.000Z"}]]},"git":{"createdTime":1691939318000,"updatedTime":1757818610000,"contributors":[{"name":"Paper-Dragon","username":"Paper-Dragon","email":"2678885646@qq.com","commits":2,"url":"https://github.com/Paper-Dragon"},{"name":"PaperDragon-SH","username":"PaperDragon-SH","email":"2678885646@qq.com","commits":2,"url":"https://github.com/PaperDragon-SH"}],"changelog":[{"hash":"608627034a98fa57e3d2f98dd7cb92b89d7c386c","time":1757818610000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"使用pretter进行语法重写"},{"hash":"b1df1de0f82c85fe7f9afc5937f0b8af9255a5dc","time":1711355396000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"修正Markdown语法错误"},{"hash":"4dc3f471bd7834191f2c210ac6535b23224a8452","time":1710833914000,"email":"2678885646@qq.com","author":"PaperDragon-SH","message":"awk"},{"hash":"392a519398b2e846f316619fbe831e100164de7c","time":1691939318000,"email":"2678885646@qq.com","author":"Paper-Dragon","message":"Create The Worid!"}]},"readingTime":{"minutes":7.3,"words":2190},"filePathRelative":"note-book/Linux三剑客/Gawk/Shell文本处理三剑客awk.md","excerpt":"\\n<h2><strong>2.1awk简介</strong></h2>\\n<div class=\\"language-text line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"text\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-text\\"><span class=\\"line\\"><span>awk 是一种编程语言，用于在linux/unix下对文本和数据进行处理。数据可以来自标准输入、一个或多个文件，或其它命令的输出。它支持用户自定义函数和动态正则表达式等先进功能，是linux/unix下的一个强大编程工具。它在命令行中使用，但更多是作为脚本来使用。awk的处理文本和数据的方式是这样的，它逐行扫描文件，从第一行到最后一行，寻找匹配的特定模式的行，并在这些行上进行你想要的操作。如果没有指定处理动作，则把匹配的行显示到标准输出(屏幕)，如果没有指定模式，则所有被操作所指定的行都被处理。awk分别代表其作者姓氏的第一个字母。因为它的作者是三个人，分别是Alfred Aho、Brian Kernighan、Peter Weinberger。gawk是awk的GNU版本，它提供了Bell实验室和GNU的一些扩展。</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{r as comp,t as data};
