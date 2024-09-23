# 重装MicroSoft Store

## 起因

我再安装iCloud Windows版本却怎么也安装不上，报错是WindowsAppRuntime没有安装，我从Windows官方安装了最新版Runtime后仍然无法安装，于是最后的解决方法是重装Windows 应用商店。

```powershell
PS C:\windows\system32> Add-AppxPackage -Path C:\Users\xxxxx\Downloads\AppleInc.iCloud_15.2.157.0_x64__nzyj5cx40ttqa.Appx
Add-AppxPackage : 部署失败，原因是 HRESULT: 0x80073CF3, 包无法进行更新、相关性或冲突验证。
Windows 无法安装程序包 AppleInc.iCloud_15.2.157.0_x64__nzyj5cx40ttqa，因为此程序包依赖于一个找不到的框架。请随要安装的
此程序包一起提供由“CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US”发布的框架“Micro
soft.WindowsAppRuntime.1.1”(具有中性或 x64 处理器体系结构，最低版本为 1002.543.1943.0)。当前已安装的名称为“Microsoft.
WindowsAppRuntime.1.1”的框架为: {}
注意: 有关其他信息，请在事件日志中查找 [ActivityId] a9195122-f754-0002-738a-93aa54f7da01，或使用命令行 Get-AppPackageLo
g -ActivityID a9195122-f754-0002-738a-93aa54f7da01
所在位置 行:1 字符: 1
+ Add-AppxPackage -Path C:\Users\xxxxx\Downloads\AppleInc.iCloud_1 ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : WriteError: (C:\Users\xxx...j5cx40ttqa.Appx:String) [Add-AppxPackage], IOException
    + FullyQualifiedErrorId : DeploymentError,Microsoft.Windows.Appx.PackageManager.Commands.AddAppxPackageCommand
```

## 以管理员身份打开 PowerShell

按 `Win + X` 键，选择“Windows PowerShell (管理员)”或“Windows 终端 (管理员)”，这取决于您的 Windows 版本。

如果出现用户账户控制 (UAC) 提示，请点击“是”以继续。

## 卸载 Microsoft Store

执行卸载命令

在打开的“管理员：Windows PowerShell”窗口中输入以下命令，并按回车键执行：

```powershell
Get-AppxPackage *WindowsStore* | Remove-AppxPackage
```

这条命令会卸载所有与 Microsoft Store 相关的包。

## 重新注册 Microsoft Store

重新注册 Microsoft Store

在同一 PowerShell 窗口中输入以下命令，并按回车键执行：

```powershell
add-appxpackage -register "C:\Program Files\WindowsApps\*Store*\AppxManifest.xml" -disabledevelopmentmode
```

上述命令中的 `*.appx` 是一个通配符，用于匹配 Microsoft Store 的安装文件。

默认路径是这个，如果路径不同，您需要手动找到正确的文件路径。