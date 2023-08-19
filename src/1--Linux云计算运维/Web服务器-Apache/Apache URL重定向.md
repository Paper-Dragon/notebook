## 一、URL重写介绍

Apached的重写功能，即是mod_rewrite模块功能，它是apache的一个模块。它的功能非常强大，可以操作URL中的所有部分。通过改写url，给用户提供一个简介大方的url，当用户访问时可以通过mod_rewrite模块功能转换为真正的资源路径。通过mod_rewrite能实现的功能还有很多，例如隐藏真实地址、实现URL跳转、域名跳转、防盗链、限制访问资源类型等等。

URL重写在生产环境中被广大运维大牛们运用的淋漓尽致，那么什么是URL重写呢？**URL重写其实就是改写用户浏览器中的URL地址**。

比如说京东,google、亚马逊都在使用:

|      域名      |    重写后域名     |
| :------------: | :---------------: |
|    www.z.cn    |   www.amazon.cn   |
|    www.g.cn    | www.google.com.cn |
| www.360buy.com |    www.jd.com     |

当用户在浏览器中输入：www.360buy.com域名回车以后，你会发现浏览器中的域名变成了:www.jd.com。这是怎么回事呢？

那是因为运维在web服务器上设置了URL重写，在你访问服务器的一瞬间改写了你地址栏中的域名。

#### URL重写应用场景

域名变更：比如京东

伪静态：便于CDN缓存页面

域名伪装：隐藏URI真实路径

## 二、URL重写

#### 1）重写指令介绍

RewriteEngine on #开启mod_rewrite模块功能

RewriteBase 路径 #基准URL（使用alias设置别名则需使用这个）

RewriteCond TestString CondPattern [flags] #重写条件（可以多个）

RewriteRule Pattern Substitution [flags] #重写规则

```
RewriteCond及RewriteRule行可以可以多个
按顺序一个一个执行RewriteRule（[flags不终止情况下]）
```

#### 2）指令标志位

**RewriteRule [flags]**

[flags]，标志符，多个则用逗号隔开。

标志符(摘抄于网上)：

redirect|R [=code] (强制重定向 redirect)

以 [http://thishost[:thisport]/(使新的URL成为一个URI](http://thishost[:thisport]/%28使新的URL成为一个URI%29%29 为前缀的Substitution可以强制性执行一个外部重定向。 如果code没有指定，则产生一个HTTP响应代码302%28临时性移动%29。如果需要使用在300-400范围内的其他响应代码，只需在此指定这个数值即可， 另外，还可以使用下列符号名称之一: temp %28默认的), permanent, seeother. 用它可以把规范化的URL反馈给客户端，如, 重写“/~”为 “/u/”，或对/u/user加上斜杠，等等。

注意: 在使用这个标记时，必须确保该替换字段是一个有效的URL! 否则，它会指向一个无效的位置! 并且要记住，此标记本身只是对URL加上 http://thishost[:thisport]/的前缀，重写操作仍然会继续。通常，你会希望停止重写操作而立即重定向，则还需要使用’L’标记.

forbidden|F (强制URL为被禁止的 forbidden)

强制当前URL为被禁止的，即，立即反馈一个HTTP响应代码403(被禁止的)。使用这个标记，可以链接若干RewriteConds以有条件地阻塞某些URL。

gone|G(强制URL为已废弃的 gone)

强制当前URL为已废弃的，即，立即反馈一个HTTP响应代码410(已废弃的)。使用这个标记，可以标明页面已经被废弃而不存在了.

proxy|P (强制为代理 proxy)

此标记使替换成分被内部地强制为代理请求，并立即(即， 重写规则处理立即中断)把处理移交给代理模块。你必须确保此替换串是一个有效的(比如常见的以 [http://hostname开头的)能够为Apache代理模块所处理的URI。使用这个标记，可以把某些远程成分映射到本地服务器名称空间，](http://xn--hostname-p30ox77bb66d)能够为apache代理模块所处理的uri。使用这个标记，可以把某些远程成分映射到本地服务器名称空间，/) 从而增强了ProxyPass指令的功能。

注意: 要使用这个功能，代理模块必须编译在Apache服务器中。 如果你不能确定，可以检查“httpd -l”的输出中是否有mod_proxy.c。 如果有，则mod_rewrite可以使用这个功能；如果没有，则必须启用mod_proxy并重新编译“httpd”程序。

last|L (最后一个规则 last)

立即停止重写操作，并不再应用其他重写规则。 它对应于Perl中的last命令或C语言中的break命令。这个标记可以阻止当前已被重写的URL为其后继的规则所重写。 举例，使用它可以重写根路径的URL(’/’)为实际存在的URL, 比如, ‘/e/www/’.

next|N (重新执行 next round)

重新执行重写操作(从第一个规则重新开始). 这时再次进行处理的URL已经不是原始的URL了，而是经最后一个重写规则处理的URL。它对应于Perl中的next命令或C语言中的continue命令。 此标记可以重新开始重写操作，即, 立即回到循环的头部。

但是要小心，不要制造死循环!

chain|C (与下一个规则相链接 chained)

此标记使当前规则与下一个(其本身又可以与其后继规则相链接的， 并可以如此反复的)规则相链接。 它产生这样一个效果: 如果一个规则被匹配，通常会继续处理其后继规则， 即，这个标记不起作用；如果规则不能被匹配，则其后继的链接的规则会被忽略。比如，在执行一个外部重定向时， 对一个目录级规则集，你可能需要删除“.www” (此处不应该出现“.www”的)。

type|T=MIME-type(强制MIME类型 type)

强制目标文件的MIME类型为MIME-type。 比如，它可以用于模拟mod_alias中的ScriptAlias指令，以内部地强制被映射目录中的所有文件的MIME类型为“application/x-httpd-cgi”。

nosubreq|NS (仅用于不对内部子请求进行处理 no internal sub-request)

在当前请求是一个内部子请求时，此标记强制重写引擎跳过该重写规则。比如，在mod_include试图搜索可能的目录默认文件(index.xxx)时， Apache会内部地产生子请求。对子请求，它不一定有用的，而且如果整个规则集都起作用，它甚至可能会引发错误。所以，可以用这个标记来排除某些规则。

根据你的需要遵循以下原则: 如果你使用了有CGI脚本的URL前缀，以强制它们由CGI脚本处理，而对子请求处理的出错率(或者开销)很高，在这种情况下，可以使用这个标记。

nocase|NC (忽略大小写 no case)

它使Pattern忽略大小写，即, 在Pattern与当前URL匹配时，’A-Z’ 和’a-z’没有区别。

qsappend|QSA (追加请求串 query string append)

此标记强制重写引擎在已有的替换串中追加一个请求串，而不是简单的替换。如果需要通过重写规则在请求串中增加信息，就可以使用这个标记。

noescape|NE (在输出中不对URI作转义 no URI escaping)

此标记阻止mod_rewrite对重写结果应用常规的URI转义规则。 一般情况下，特殊字符(如’%’, ‘$’, ‘;’等)会被转义为等值的十六进制编码。 此标记可以阻止这样的转义，以允许百分号等符号出现在输出中，如：

RewriteRule /foo/(.*) /bar?arg=P1=$1 [R,NE] 可以使’/foo/zed’转向到一个安全的请求’/bar?arg=P1=zed’.

passthrough|PT (移交给下一个处理器 pass through)

此标记强制重写引擎将内部结构request_rec中的uri字段设置为 filename字段的值，它只是一个小修改，使之能对来自其他URI到文件名翻译器的 Alias，ScriptAlias, Redirect 等指令的输出进行后续处理。举一个能说明其含义的例子：如果要通过mod_rewrite的重写引擎重写/abc为/def，然后通过mod_alias使/def转变为/ghi，可以这样:

RewriteRule ^/abc(.*) /def$1 [PT]

Alias /def /ghi

如果省略了PT标记，虽然mod_rewrite运作正常， 即, 作为一个使用API的URI到文件名翻译器，它可以重写uri=/abc/…为filename=/def/…，但是，后续的mod_alias在试图作URI到文件名的翻译时，则会失效。

注意: 如果需要混合使用不同的包含URI到文件名翻译器的模块时， 就必须使用这个标记。。混合使用mod_alias和mod_rewrite就是个典型的例子。

For Apache hackers

如果当前Apache API除了URI到文件名hook之外，还有一个文件名到文件名的hook， 就不需要这个标记了! 但是，如果没有这样一个hook，则此标记是唯一的解决方案。 Apache Group讨论过这个问题，并在Apache 2.0 版本中会增加这样一个hook。

skip|S=num (跳过后继的规则 skip)

此标记强制重写引擎跳过当前匹配规则后继的num个规则。 它可以实现一个伪if-then-else的构造: 最后一个规则是then从句，而被跳过的skip=N个规则是else从句. (它和’chain|C’标记是不同的!)

env|E=VAR:VAL (设置环境变量 environment variable)

此标记使环境变量VAR的值为VAL, VAL可以包含可扩展的反向引用的正则表达式$N和%N。 此标记可以多次使用以设置多个变量。这些变量可以在其后许多情况下被间接引用，但通常是在XSSI (via ) or CGI (如 $ENV{’VAR’})中， 也可以在后继的RewriteCond指令的pattern中通过%{ENV:VAR}作引用。使用它可以从URL中剥离并记住一些信息。

cookie|CO=NAME:VAL:domain[:lifetime[:path]] (设置cookie)

它在客户端浏览器上设置一个cookie。 cookie的名称是NAME，其值是VAL。 domain字段是该cookie的域，比如’.apache.org’, 可选的lifetime是cookie生命期的分钟数，可选的path是cookie的路径。

**RewriteCond [flags]**

’nocase|NC’ (不区分大小写) 　　在扩展后的TestString和CondPattern中，比较时不区分文本的大小写。注意，这个标志对文件系统和subrequest检查没有影响.

’ornext|OR’ (建立与下一个条件的或的关系) 　　默认的情况下，二个条件之间是AND的关系，用这个标志将关系改为OR。

## 二、URL重写案例

LoadModule rewrite_module modules/mod_rewrite.so

RewriteEngine on

**1)将域名重写为**[**http://www.baidu.com**](http://www.baidu.com/)** R 强制重定向 L匹配到此截止**

\#RewriteRule “^/$” “[http://www.baidu.com](http://www.baidu.com/)” [R]

**2)浏览器匹配，chrome 和 elinks浏览器**

\#RewriteCond “%{HTTP_USER_AGENT}” “chrome” [NC,OR]

\#RewriteCond %{HTTP_USER_AGENT} “^elinks” [NC]

**#强制重写为403禁止 -不重写 F 403标记**

\#RewriteRule “^/$” - [F]

**3)PC端 移动端分流**

RewriteCond “%{HTTP_USER_AGENT}” “(iPhone|Blackberry|Android|ipad)” [NC]

RewriteRule “^/$” “[http://m.ayitula.com](http://m.ayitula.com/)” [L]

RewriteRule “^/$” “[http://book.ayitula.com](http://book.ayitula.com/)” [L]