# Uvicorn修改headers内的server名字

原有的uvicorn的server会显示一些uvicron的信息，这个服务器并不是很专业的web服务器，安全性较低，如何从代码里修改呢？下面是主要的额步骤

## 举例

剔除 server: uvicorn, 减少信息泄露。
```bash
Response headers

 content-length: 168  
 content-type: application/json  
 date: Thu,10 Aug 2023 05:52:06 GMT  
 server: uvicorn # 要剔除这行
```
## 实例代码

```python
import uvicorn
from fastapi import FastAPI

app = FastAPI(
    title="uvicorn",
    description="uvicorn教程",
    version="beta 0.1",
)


if __name__ == "__main__":
    uvicorn.run(
        "run:app",
        host="127.0.0.1",
        port=8000,
        log_level="info",
        reload=True,
        workers=8,
        debug=True,
        headers=[("server", "2678885646@qq.com.server")]
    )


```

然后重启整个uvicorn服务器，自动重新加载无效。

## 结果
```bash

 content-length: 168  
 content-type: application/json  
 date: Thu,10 Aug 2023 05:55:20 GMT  
 server: 2678885646@qq.com.server 
```

## 举例

剔除 server: uvicorn, 减少信息泄露
```bash
Response headers

 content-length: 168  
 content-type: application/json  
 date: Thu,10 Aug 2023 05:52:06 GMT  
 server: uvicorn # 要剔除这行
```
## 实例代码

```python
import uvicorn
from fastapi import FastAPI

app = FastAPI(
    title="uvicorn",
    description="uvicorn教程",
    version="beta 0.1",
)


if __name__ == "__main__":
    uvicorn.run(
        "run:app",
        host="127.0.0.1",
        port=8000,
        log_level="info",
        reload=True,
        workers=8,
        debug=True,
        headers=[("server", "2678885646@qq.com.server")]
    )


```

然后重启整个uvicorn服务器，自动重新加载无效。

## 结果
```bash
 content-length: 168  
 content-type: application/json  
 date: Thu,10 Aug 2023 05:55:20 GMT  
 server: 2678885646@qq.com.server 
```