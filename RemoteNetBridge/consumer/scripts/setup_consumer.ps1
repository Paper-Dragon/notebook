param(
    [string]$Server,
    [int]$Port = 1080,
    [int]$RDPPort = 3389,
    [string]$ForwardIP = "127.0.0.1"
)

# 清除旧端口映射
netsh interface portproxy delete v4tov4 listenport=$RDPPort listenaddress=0.0.0.0

# 创建新端口转发规则
netsh interface portproxy add v4tov4 listenport=$RDPPort listenaddress=0.0.0.0 connectport=$RDPPort connectaddress=$ForwardIP

# 配置防火墙
if (-not (Get-NetFirewallRule -DisplayName "RDP Forward" -ErrorAction SilentlyContinue)) {
    New-NetFirewallRule -DisplayName "RDP Forward" -Direction Inbound -Protocol TCP -LocalPort $RDPPort -Action Allow
}

# 定义Clash路径
$defaultPath = "provider/mihomo-windows-amd64-v1.18.9/mihomo-windows-amd64.exe"
$compatiblePath = "provider/mihomo-windows-amd64-compatible-v1.18.9/mihomo-windows-amd64-compatible.exe"

# 启动Clash服务
try {
    & $defaultPath "-d ../resources"
    if ($LASTEXITCODE -ne 0) { throw "默认版本启动失败" }
}
catch {
    try {
        & $compatiblePath "-d ../resources"
        if ($LASTEXITCODE -ne 0) { throw "兼容版本启动失败" }
    }
    catch {
        Write-Error "所有启动尝试失败: $_"
        exit 1
    }
}

# 验证配置
Start-Sleep -Seconds 3
netsh interface portproxy show all
Get-NetFirewallRule -DisplayName "RDP Forward" | Format-Table -Property DisplayName,Enabled,Action
