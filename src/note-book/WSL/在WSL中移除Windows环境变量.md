# 在WSL中移除Windows环境变量

在 WSL (Windows Subsystem for Linux) 中使用一个不包含 Windows 环境变量的更干净环境时，可以通过配置 `/etc/wsl.conf` 文件来实现。

## 步骤 1: 创建并编辑 `/etc/wsl.conf`

1. **编辑 `/etc/wsl.conf` 文件**：

   - 如果文件不存在，需要创建它。
   - 使用 `vim` 编辑器编辑文件：

     ```bash
     sudo vim /etc/wsl.conf
     ```

2. **添加以下内容**到文件中以禁用自动追加 Windows 路径到 WSL 的 PATH 变量：

    ```bash
    [interop]
    appendWindowsPath = false
    ```

3. **保存并关闭文件**：

   - 在 `vim` 中，按 `Esc` 键进入正常模式。
   - 输入 `:wq` 并按 `Enter` 键保存并退出。

## 步骤 2: 重启 WSL

1. **在 PowerShell 或 CMD 中执行命令**来终止特定的 WSL 发行版。将 `<distro>` 替换为您实际使用的发行版名称，如 `Ubuntu-20.04`：

    ```powershell
    wsl --terminate <distro>
    ```

2. **重新启动 WSL**：再次打开您的 WSL 发行版，这次它不会自动附加 Windows 的 PATH 环境变量了。

## 注意事项

- 修改 `/etc/wsl.conf` 后，仅对新启动的 WSL 会话生效。
- 如果您在多个发行版中都需要这个设置，需要在每个发行版中分别进行配置。

## 参考文献

- [GitHub Issue 关于 WSL 的讨论](https://github.com/microsoft/WSL/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%2Fconfiguration)