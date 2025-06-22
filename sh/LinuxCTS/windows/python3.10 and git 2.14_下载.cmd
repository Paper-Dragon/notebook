cd .

set exename=python-3.10.6-amd64.exe
set downurl=https://registry.npmmirror.com/-/binary/python/3.11.6/python-3.11.6-amd64.exe
 
if not exist %exename% (
      powershell curl -o "%exename%" "%downurl%"

    ) else (
        echo "%exename% done"
        timeout /nobreak /t 3
    )


set exename=Git-2.41.0.2-64-bit.exe
set downurl=https://registry.npmmirror.com/-/binary/git-for-windows/v2.41.0.windows.2/Git-2.41.0.2-64-bit.exe

if not exist %exename% (
      powershell curl -o "%exename%" "%downurl%"

    ) else (
        echo "%exename% done"
        timeout /nobreak /t 3
        echo ""
    )
