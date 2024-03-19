

# PyInstaller 带静态依赖文件打包教程

## 方法一：通过命令行参数

    --add-data "欲打包的源文件路径（可以是相对路径，也可以是绝对路径）;.（打包后对应的程序内的路径，一个.代表打包至程序运行时根目录）"
    
    --add-data 参数 可以多次使用，注意格式为引号里面有一个文件名，有一个分号，一个点。
    
    例： pyinstaller -F --add-data '.\32x32.ico;.' '.\main.py'

## 方法二：通过修改 spec 打包配置脚本文件

### 通过命令生成 spec 文件
#### OneFolder 单文件夹模式

```bash
pyi-makespec filename
# pyi-makespec 后跟欲打包python文件
```

#### OneFile 单文件文件
```bash
pyi-makespec -F filename
# 与pyinstaller 打包单文件相同，均使用 -F 参数
# pyi-makespec -F 后跟欲打包python文件
```

### 修改生成的 spec 文件

```bash
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None
a = Analysis(['main.py'],
             pathex=[],
             binaries=[],
             datas=[],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)

# 在 a 中 datas 列表内添加如下格式配置项
# ('欲打包的源文件路径（相对、绝对均可）', '.（打包后对应的程序内的路径，一个.代表打包至程序运行时根目录）')

# 例如：
# 	a = Analysis(['main.py'],
#		pathex=[],
#    	binaries=[],
#       datas=[('.\\excel.ico', '.')],
#       hiddenimports=[],
#       hookspath=[],
#       runtime_hooks=[],
#       excludes=[],
#       win_no_prefer_redirects=False,
#       win_private_assemblies=False,
#       cipher=block_cipher,
#       noarchive=False)

```



注意：路径中需要用 双反斜杠！！

### 使用该 spec 文件打包

```bash
pyinstaller ***.spec
```



## 调用方法

#### 不能在代码中直接使用相对路径调用文件

```bash
# 先获取当前运行时临时目录路径
if getattr(sys, 'frozen', None):
    basedir = sys._MEIPASS
else:
    basedir = path.dirname(__file__)
# 使用 os.path.join() 方法，将 临时目录路径与文件相对路径拼接
with open(path.join(basedir, 'file.txt'), 'r') as fp:
    pass
```



#### 备注：

    单文件模式下，运行可执行文件时，程序会先将可执行文件进行解压缩，解压缩的位置在 /temp目录 下，再执行，所以被打包进去的数据文件在被解压的路径下，而，程序是在运行的路径下搜索，即可执行文件的目录下，所以找不到数据文件