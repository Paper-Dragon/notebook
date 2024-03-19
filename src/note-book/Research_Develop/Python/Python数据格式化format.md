# Python数据格式化format

format从python 2.6开始支持



```python
s = "name {}, age {}, occupatical {}".format("lucy", 18, "developer")
# s = "name {0}, age {2}, occupatical {1}".format("lucy", 18, "developer")

print(s)

# {参数序列：格式控制标记}
# <填充> <对其> <宽度> <千分位分隔符> <精度> <类型>
a = "Hello"
print("{0:c<20}".format(a))
print("{0: }".format(1))
print("{0:15}".format(1))

# 对其 <>^
print("{0:>15}".format(1))
print("{0:*^15}".format(1))  # 居中对其
print("{0:*^3}".format(a))  # 居中对其

# 千分分割位
a = 20231012
print("{:,}".format(a))
print("{:#>18,}".format(a))

# 精度
# 对于浮点数是小数位数
print("{0:.2f}".format(3.1415926))

# 对于字符串是输出的最大长度
print("{:.2}".format("Hello"))

# 格式类型的标志
print('{:b}'.format(a))  # 二进制
print('{:d}'.format(a))  # 十进制
print('{:o}'.format(a))  # 八进制
print('{:x}'.format(a))  # 十六进制 b
print('{:X}'.format(a))  # 十六进制 B

print("{0:.2e}".format(3.1415926))  # 科学计数法
print("{0:.2E}".format(3.1415926))  # 科学计数法
print("{0:.2%}".format(3.1415926))  # 百分比

```

