

# 新版VSCode中Python设置自动补全函数括号

> https://blog.csdn.net/w11231/article/details/123586558


# 前言

在网上能找到的关于如何让VSCode中Python自动补全函数括号的方法都是同样的，但基本上都是几年前的方法了，在VSCode更新后引入了Pylance，使得之前的设置项不存在了。在自己摸索了很久后终于发现了相同功能的选项👇

如果不确定自己用的哪种，可以都试一下，在Settings.json中如果有不存在的设置项会报错

## 一、旧版的方法(Jedi)

设置文件settings.json中添加"python.autoComplete.addBrackets": true

## 二、新版的方法(Pylance)

设置 -> 扩展 -> Pylance -> 将 python.analysis.completeFunctionParens 下方的选项打勾
或着
直接在settings.json中添加"python.analysis.completeFunctionParens": true

## 提示

这里说的自动补全函数括号是指，在输入完函数回车后，VSCode默认只会补全函数，但函数后面没有括号。当开启上面的设置后输入函数再回车，将会给补全的函数自动加上括号