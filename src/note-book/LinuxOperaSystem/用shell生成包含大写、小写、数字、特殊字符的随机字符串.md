# 用shell生成包含大写、小写、数字、特殊字符的随机字符串

# **tr命令**

```bash
# </dev/urandom tr -dc  'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' | head -c 15 ; echo

# tr -dc   'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~'   </dev/urandom | head -c 15; echo
```









