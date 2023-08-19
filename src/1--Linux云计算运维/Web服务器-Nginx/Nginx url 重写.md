## 一、URL重写介绍

和apache等web服务软件一样，rewrite的主要功能是实现URL地址的重定向。Nginx的rewrite功能需要PCRE软件的支持，即通过perl兼容正则表达式语句进行规则匹配的。默认参数编译nginx就会支持rewrite的模块，但是也必须要PCRE的支持。

Rewrite功功能是Nginx服务器提供的一个重要功能。几乎是所有的web产品必备技能，用于实现URL重写。URL重写是非常有用的功能，比如它可以在我们在改变网站结构后，不需要客户端修改原来的书签，也不需要其他网站修改对我们网站的友情链接，还可以在一定程度上提高网站的安全性，能够让我们的网站显得更专业。

## 二、应用场景

域名变更 （京东）

用户跳转 （从某个连接跳到另一个连接）

伪静态场景 （便于CDN缓存动态页面数据）

## 三、URL重写原理

![URL重写原理.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/19/1603105353682.png)

## 四、URL重写

#### URL 模块语法

- set 设置变量
- if 负责语句中的判断
- return 返回返回值或URL
- break 终止后续的rewrite规则
- rewrite 重定向URL

##### set指令 自定义变量

Syntax:

set $variable value;

Default:

—

Context:

server, location, if

```
将http://www.ayitula.com  重写为 http://www.ayitula.com/baism
location / {
                set $name baism;
                rewrite ^(.*)$ http://www.ayitula.com/$name;
        }
```

##### if 指令 负责判断

Syntax:

if (condition) { … }

Default:

—

Context:

server, location

条件匹配

\#模糊匹配 ~匹配 !~不匹配 ~* 不区分大小写的匹配

\#精确匹配 = !=

```
location / {
                root html;
                index index.html index.htm;
                if ($http_user_agent ~* 'Chrome') {
                        break;
                        return 403;
                        #return http://www.jd.com;
                }
        }
```

##### return 指令 定义返回数据

Syntax: return code [text];

return code URL;

return URL;

Default: —

Context: server, location, if

```
location / {
                root html;
                index index.html index.htm;
                if ($http_user_agent ~* 'Chrome') {
                        return 403;
                        #return http://www.jd.com;
                }
        }
```

##### break 指令 停止执行当前虚拟主机的后续rewrite指令集

Syntax: break;

Default:—

Context:server, location, if

```
location / {
                root html;
                index index.html index.htm;
                if ($http_user_agent ~* 'Chrome') {
                        break;
                        return 403;
     }
        }
```

##### rewrite指令 实现重写url

**rewrite <regex> <replacement> [flag];**

**关键字 正则 替代内容 flag标记**

**flag:**

- last #本条规则匹配完成后，继续向下匹配新的location URI规则
- break #本条规则匹配完成即终止，不再匹配后面的任何规则
- redirect #返回302临时重定向，浏览器地址会显示跳转后的URL地址
- permanent #返回301永久重定向，浏览器地址栏会显示跳转后的URL地址

**重定向就是将网页自动转向重定向，permanent和redirect从定向的区别**

301永久性重定向：新网址完全继承旧网址，旧网址的排名等完全清零

301重定向是网页更改地址后对搜索引擎友好的最好方法，只要不是暂时搬移的情况，都建议使用301来做转址。

302临时性重定向：对旧网址没有影响，但新网址不会有排名

搜索引擎会抓取新的内容而保留旧的网址

**permanent标志：永久重定向**

```
域名跳转
www.ayitula.com     重写为  www.jd.com
server {
        listen        80;
        server_name www.ayitula.com;
        location / {
            rewrite ^/$ http://www.jd.com permanent;

          }
}
```

**redirect标志：临时重定向**

```
域名跳转
www.ayitula.com     重写为  www.jd.com
server {
        listen        80;
        server_name www.ayitula.com;
        location / {
            rewrite ^/$ http://www.jd.com redirect;

          }
}
```

**break标志： 类似临时重定向**

```
域名跳转
www.ayitula.com     重写为  www.jd.com
server {
        listen        80;
        server_name www.ayitula.com;
        location / {
            rewrite ^/$ http://www.jd.com break;

          }
}
```

**last标志：**

url重写后，马上发起一个新的请求，再次进入server块，重试location匹配，超过10次匹配不到报500错误，地址栏url不变

last 一般出现在server或if中

根据用户浏览器重写访问目录

```
如果是chrome浏览器  就将  
http://192.168.10.42/$URI
   重写为  
http://http://192.168.10.42/chrome/$URI

实现 步骤
1）URL重写
2）请求转给本机location



location / {
.....
if ($http_user_agent ~* 'chrome'){
          #^ 以什么开头 ^a
          #$ 以什么结尾 c$
          #. 除了回车以外的任意一个字符
          #* 前面的字符可以出现多次或者不出现
          #更多内容看正则表达式 re
          rewrite ^(.*)$ /chrome/$1 last;
          }


       location /chrome {
          root html ;
          index index.html;
        }
}
```