## 一、静态缓存介绍

用户每次访问网站都会将页面中的所有元素都请求一遍，全部下载后通过浏览器渲染，展示到浏览器中。但是，网站中的某些元素我们一般都是固定不变的，比如logo，框架文件等元。，用户每次访问都需要加载这些元素。这样做好处是保证了数据的新鲜，可是这些数据不是常变化的，很久才变化一次。每次都请求、下载浪费了用户时间和公司带宽。

所以我们通过静态缓存的方式，将这些不常变化的数据缓存到用户本地磁盘，用户以后再访问这些请求，直接从本地磁盘打开加载，这样的好处是加载速度快，且节约公司带宽及成本。

#### **应用场景：数据缓存**

#### **优化目的：提升用户访问页面加载速度，节约带宽**

## 二、静态缓存实现

1）修改apache主配置文件，加载缓存模块

LoadModule expires_module modules/mod_expires.so

2）针对虚拟主机或者目录设置缓存策略

```
<IfModule expires_module>
    #开启缓存
    ExpiresActive on
    #针对不同类型元素设置缓存时间
    ExpiresByType image/gif  "access plus 1 days"
    ExpiresByType image/jpeg "access plus 24 hours"
    ExpiresByType image/png "access plus 24 hours"
    ExpiresByType text/css "now plus 2 hour"
    ExpiresByType application/x-javascript "now plus 2 hours"
    ExpiresByType application/x-shockwave-flash "now plus 2 hours”
    #其他数据不缓存
    ExpiresDefault "now plus 0 min"
</IfModule>



缓存起始点
access   从当前访问时间开始
now (equivalent to 'access')  相当于access
modification   从修改时间算起

缓存时间单位
years
months
weeks
days
hours
minutes
seconds
```

## 三、验证测试

**缓存没有生效前*
![no_expires.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603015493018.png)

**缓存生效后测试**
![apache_expires.png](https://www.zutuanxue.com:8000/static/media/images/2020/10/18/1603015511691.png)
响应头中加载了缓存字段

Cache-control 和 Expires，并且缓存的时间和我们预设的一致，成功啦。