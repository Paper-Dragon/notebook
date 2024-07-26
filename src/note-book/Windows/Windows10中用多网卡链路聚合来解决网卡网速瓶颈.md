# Windows10中用多网卡链路聚合来解决网卡网速瓶颈

在Windows 10中，可以利用双网卡链路聚合（NIC Teaming）来提升网速解决网卡瓶颈，这篇文章记录了设置链路聚合的方法。

在Windows 10 1809之前版本，可以使用PowerShell 小工具`New-NetLbfoTeam` 命令来创建网卡组。

在Windows 10 1809之后的版本，这个命令已经不再支持，只能在Windows Server操作系统上使用。我们只能求其次通过`New-NetSwitchTeam`命令来实现类似的功能。

## Windows 10 1809版本之前

### 配置NIC Teaming

#### 启动PowerShell

打开PowerShell: 在搜索框中输入“PowerShell”，右键点击“Windows PowerShell”，选择“以管理员身份运行”。

#### 列出网络适配器

查看网卡：输入以下命令查看计算机上的网络适配器：

```powershell
Get-NetAdapter
```

记下需要加入网卡组的网卡名称,例如，`Ethernet` 和 `Ethernet 2`。

#### 创建网卡组

创建网卡组：使用以下命令创建网卡组 Team1：

```powershell
New-NetLbfoTeam -Name "Team1" -TeamMembers "Ethernet","Ethernet 2"
```

如果命令成功执行且没有报错，则表示网卡组创建成功。

#### **验证网卡组**

验证网卡组：使用以下命令确认网卡组是否创建成功：

```powershell
Get-NetLbfoTeam
```

如果看到新创建的网卡组信息，则表示配置成功。

### 配置网络设置

#### 设置静态IP地址

更改适配器设置：

- 在“网络和共享中心”中，点击左侧的“更改适配器设置”。

配置网络桥接：

- 在“网络连接”窗口中，你会看到新创建的网络适配器。
- 右键点击网络适配器，选择“属性”。
- 选择“Internet 协议版本 4 (TCP/IPv4)”并点击“属性”。
- 选择“使用下面的IP地址”。
- 输入适当的IP地址、子网掩码和默认网关。
- 点击“确定”，保存设置。

#### 测试和验证

测试网络连接：

- 打开命令提示符，使用 ping  命令测试网络连通性。例如：

```powershell
ping 8.8.8.8  # 测试外网连通性
```

带宽测试工具：浏览器访问带宽测试网站 [Speedtest](https://www.speedtest.net) 测速

### 删除NIC Teaming

删除网卡组：如果需要删除已创建的网卡组，可以使用以下命令：

```powershell
Remove-NetLbfoTeam -Name "Team1"
```

## Windows 10 1809版本之后

> https://blog.csdn.net/ytlzq0228/article/details/118071224
>
> 在Windows 10 1809版本之后，`New-NetLbfoTeam` 方式创建聚合组，LACP功能也被限制。但是依然可以使用NetSwitchTeam创建聚合链路，不过只能使用独立网卡模式，等同于NetLbfoTeam模式里的`-teamingMode SwitchIndependent`

使用刚才的配置名零会得到下面的报错，解决方法继续看。

```bash
PS C:\windows\system32> New-NetLbfoTeam -name aaa -TeamMembers "以太网"
New-NetLbfoTeam : The LBFO feature is not currently enabled, or LBFO is not supported on this SKU.
所在位置 行:1 字符: 1
+ New-NetLbfoTeam -name aaa -TeamMembers "以太网"
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (MSFT_NetLbfoTeam:root/StandardCimv2/MSFT_NetLbfoTeam) [New-NetLbfoTeam],
   CimException
    + FullyQualifiedErrorId : MI RESULT 1,New-NetLbfoTeam

```

### 配置NIC Teaming

#### 启动PowerShell

打开PowerShell：在搜索框中输入“PowerShell”，右键点击“Windows PowerShell”，选择“以管理员身份运行”。

#### 列出网络适配器

查看网卡: 输入以下命令查看计算机上的网络适配器：

```powershell
Get-NetAdapter
```

记下需要加入网卡组的网卡名称，例如，`Ethernet` 和 `Ethernet 2`。

#### 创建网卡组

创建网卡组：使用以下命令创建网卡组 名为“2Gbps”：

```powershell
New-NetSwitchTeam -Name "2Gbps" -TeamMembers "Ethernet","Ethernet 2"
```

如果命令成功执行且没有报错，则表示网卡组创建成功。

#### 验证网卡组

验证网卡组：使用以下命令确认网卡组是否创建成功：

```powershell
Get-NetSwitchTeam
```

如果看到新创建的网卡组信息，则表示配置成功。

### 配置网络设置

#### 设置静态IP地址

配置网络桥接：

- 在“网络连接”窗口中，有新的网络适配器。
- 右键点击网络适配器，选择“属性”。
- 选择“Internet 协议版本 4 (TCP/IPv4)”并点击“属性”。
- 选择“使用下面的IP地址”。
- 输入适当的IP地址、子网掩码和默认网关。
- 点击“确定”，保存设置。

#### 测试和验证

测试网络连接：

- 打开cmd，使用 ping  命令测试网络连通性。例如：

```powershell
ping 8.8.8.8  # 测试外网连通性
```

使用带宽测试工具：浏览器访问带宽测试网站 [Speedtest](https://www.speedtest.net)

###  删除NIC Teaming

删除网卡组：如果需要删除已创建的网卡组，可以使用以下命令：

```powershell
Remove-NetSwitchTeam -Name "2Gbps"
```