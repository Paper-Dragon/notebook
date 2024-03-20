# ACLLib

- 是一个基于Win32API的函数库，提供了相对较为简单的方式来做Windows程序
- 实际提供了一个c和两个h文件，可以在msvc和dev c++（MingGW）中使用
- 以GPL的方式开源放在了github中
- 纯教学用途，但是变成模型和思想开源借鉴



## main()?

- main() 成为c语言的入口函数其实和c语言本身无关，你的代码是被一小段叫做启动代码的程序所调用的，它需要一个叫main的地方
- 操作系统把你的可执行程序装载到内存里，启动运行，然后调用你的main函数

## WinMain()

- As main() is the entry function of an ordinary C program,WinMain() is the one in Win32API program.
- Windows applications have a different "startup" code that needs a function "WinMain()"

```c
#include <windows.h>


int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow){
    MessageBox(NULL,"Goodbay , Cruel world!", "Note", MB_OK);
    
    return 0;
}

```

## ?

- 如何产生一个窗口
  - 窗口结构
- 日和在窗口中画东西
  - DC设备无关上下文
- 如何获得用户的鼠标和键盘操作
  - 消息循环和消息处理代码
- 如何画出标准的界面：菜单、按钮、输入框、
- acllib目前不能做

