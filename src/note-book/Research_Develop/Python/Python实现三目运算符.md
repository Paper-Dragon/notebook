# Python实现三目运算符

都知道Python中没有三目运算符，但是熟练C等语言写作方式，如何去实现三目运算符呢？



## 实现

这时一段C语言的三目运算符代码

```c
c = a > b? a : b
```

用Python实现如下

```python
c = a if a > b else b
```



公式：在Python中需要将条件和和条件为True的表达是位置交换