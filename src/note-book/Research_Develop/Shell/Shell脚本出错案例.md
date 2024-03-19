# Shell脚本出错案例

## 01bad substitution

初接触shell脚本，在vim中写代码，出现了好几次 Bad substitution。

我的错误有两种：

    开始的的指定脚本环境 应该是#!/bin/bash
    在编译运行时 也应该用 bash
    ${}的使用错误，$() 是引用（）中运行的结果。
    ${} 仅仅是用{}中的内容，是参数，不执行