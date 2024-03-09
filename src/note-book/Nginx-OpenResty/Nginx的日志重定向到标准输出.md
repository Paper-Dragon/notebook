# Nginx的日志重定向到标准输出

## 背景

静态站点使用docker部署时，希望`nginx前台启动`的同时可以将错误日志和访问日志全部重定向到标准输出



## 方法

```bash
daemon off;
error_log /dev/stdout warn;

access_log /dev/stdout main;
```

