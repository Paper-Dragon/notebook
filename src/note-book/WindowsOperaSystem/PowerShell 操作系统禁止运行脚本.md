# PowerShell 操作系统禁止运行脚本

>  在使用 VS code 自带终端的时会报出"系统禁止脚本运行的错误"，原因是因为 PowerShell 执行策略的问题。

## 解决方法：

    管理员身份运行 PowerShell
    执行：get-ExecutionPolicy，若显示 Restricted 表示状态是禁止的
    执行：set-ExecutionPolicy，会提示输入参数
    输入 RemoteSigned 会提示进行选择
    输入：Y，回车
