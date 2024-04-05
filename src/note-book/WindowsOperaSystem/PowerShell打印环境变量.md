# PowerShell打印环境变量

```powershell
PS C:\Users\IT-Desktop> Get-ChildItem -Path Env:

Name                           Value
----                           -----
ALLUSERSPROFILE                C:\ProgramData
APPDATA                        C:\Users\IT-Desktop\AppData\Roaming
CLion                          C:\Program Files\JetBrains\CLion 2022.2\bin;
CommonProgramFiles             C:\Program Files\Common Files
CommonProgramFiles(x86)        C:\Program Files (x86)\Common Files
CommonProgramW6432             C:\Program Files\Common Files
COMPUTERNAME                   SHOULONG-DESK
ComSpec                        C:\Windows\system32\cmd.exe
DriverData                     C:\Windows\System32\Drivers\DriverData
FPS_BROWSER_APP_PROFILE_STRING Internet Explorer
FPS_BROWSER_USER_PROFILE_ST... Default
HOMEDRIVE                      C:
HOMEPATH                       \Users\IT-Desktop
LOCALAPPDATA                   C:\Users\IT-Desktop\AppData\Local
LOGONSERVER                    \\SHOULONG-DESK
NUMBER_OF_PROCESSORS           4
OneDrive                       C:\Users\IT-Desktop\OneDrive
OS                             Windows_NT
Path                           C:\Program Files (x86)\VMware\VMware Workstation\bin\;C:\Program Files\Python37\Scrip...
PATHEXT                        .COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.PY;.PYW;.CPL
PROCESSOR_ARCHITECTURE         AMD64
PROCESSOR_IDENTIFIER           Intel64 Family 6 Model 158 Stepping 9, GenuineIntel
PROCESSOR_LEVEL                6
PROCESSOR_REVISION             9e09
ProgramData                    C:\ProgramData
ProgramFiles                   C:\Program Files
ProgramFiles(x86)              C:\Program Files (x86)
ProgramW6432                   C:\Program Files
PSModulePath                   C:\Users\IT-Desktop\Documents\WindowsPowerShell\Modules;C:\Program Files\WindowsPower...
PUBLIC                         C:\Users\Public
PyCharm                        C:\Program Files\JetBrains\PyCharm 2022.2.2\bin;
SESSIONNAME                    Console
SystemDrive                    C:
SystemRoot                     C:\Windows
TEMP                           C:\Users\IT-DES~1\AppData\Local\Temp
TMP                            C:\Users\IT-DES~1\AppData\Local\Temp
USERDOMAIN                     SHOULONG-DESK
USERDOMAIN_ROAMINGPROFILE      SHOULONG-DESK
USERNAME                       IT-Desktop
USERPROFILE                    C:\Users\IT-Desktop
windir                         C:\Windows
ZES_ENABLE_SYSMAN              1

```

