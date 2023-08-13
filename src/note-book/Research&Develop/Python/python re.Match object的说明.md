# re.match()到底会返回什么?

## re.match()到底会返回什么?

现在我们通过python编程实验来看看到底会返回什么：

```python
import re
print(re.match('www', 'www.runoob.com'))  # 在起始位置匹配
print(re.match('com', 'www.runoob.com'))  # 不在起始位置匹配
```

返回结果如下：

```python
<re.Match object; span=(0, 3), match='www'>
None
```

可以看出：当re.match()在起始位置上匹配上的话，会返回"<re.Match object; span=(0, 3), match=‘www’>"，这里返回的是一个 MatchObject

## 那么什么是：MatchObject呢？

Match object是re方法match()和seatch()返回的对象。
MatchObject 实例也有几个方法和属性；最重要的那些如下所示：

- group() 返回被 RE 匹配的字符串
- start() 返回匹配开始的位置
- end() 返回匹配结束的位置
- span()返回一个元组包含匹配 (开始,结束) 的位置

## 该如何处理MatchObject呢

处理这样的返回内容：<re.Match object; span=(0, 3), match=‘www’>
 我们可以使用span()方法与group()方法进行处理，这也是我们在编程时常用见到的。
 具体操作过程如下：
 span方法操作：

```python
import re
print(re.match('www', 'www.runoob.com').span())  # 在起始位置匹配，这里将返回一个元组包含(开始,结束) 的位置
print(re.match('com', 'www.runoob.com'))  # 不在起始位置匹配

```

返回结果如下：

```python
(0, 3)
None

```

group（）方法操作如下：

```python
import re
print(re.match('www', 'www.runoob.com').group())  # 在起始位置匹配，这里将返回我们匹配成功的内容
print(re.match('com', 'www.runoob.com'))  # 不在起始位置匹配
```

返回结果：

```python
www
None

```

