---
title: polarisctf招新赛-2026~
date: 2026-05-20 20:43:08
tags: reverse
---

# 1.Illusion

这标着是简单题，我倒要看看是怎么样的

用detect it easy看了一下并没有加壳

![1](/pctf/1.jpg)

开头就有个字符串验证LABEL_12有exit(0)一看就是有异常退出

所以	

```c
 if ( n28024[0] != 'x' )
    goto LABEL_12;{}
  if ( *(_WORD *)&n28024[1] != 'cm' )
    goto LABEL_12;
  if ( n116 != 't' )
    goto LABEL_12;
  if ( n102 != 'f' )
    goto LABEL_12;
  if ( n123 != '{' )
    goto LABEL_12;
  if ( Source[18] != '}' )
    goto LABEL_12;
```

可以看出来最后一个下标18为}所以猜测字符串长为19

这道题应该有反调试首先是

输入之后直接来这个沉浸在幻术之中吧，那么main函数真的是程序的主逻辑所在吗

题目名称是illusion幻觉

```cpp
int func(void)
{
    return 3;
}
int gi = func();
int main()
{
    return gi;
}
```

c不允许这代码，它不允许常数表达式的函数调用

c规定静态存储期变量必须用常数表达式初始化，函数调用不是常量表达式

执行main/Wmain函数前，c/c++运行时库会进行一系列初始化,

![2](/pctf/2.jpg)

在初始化时回到用_initterm与\_initterm\_，按表顺序遍历并调用，批量调用前置的初始化函数

```c
_initterm(&_initterm_ptr, &_initterm_ptr_end)
```

发现调用sub_7FF7ABB81000//这简单题就有inlinehook，发现以前学的还是太浅了

 VirtualProtect(MessageBoxA, 0xEu, 0x40u, &flOldProtect)

为什么是0xe这个14字节，因为jmp函数在汇编中jmp指令是ff 25 00 00 00 00 +8字节

指令由操作码(opcode)与操作数组成(oprand)

接着是关键hook函数

```c
 MessageBoxA = (int (__stdcall *)(HWND, LPCSTR, LPCSTR, UINT))NtCurrentPeb();
  if ( (*((_BYTE *)MessageBoxA + 188) & 0x70) == 0 )
  {
    MessageBoxA = (int (__stdcall *)(HWND, LPCSTR, LPCSTR, UINT))GetModuleHandleA("user32.dll");
    if ( MessageBoxA )
    {
      MessageBoxA = (int (__stdcall *)(HWND, LPCSTR, LPCSTR, UINT))GetProcAddress((HMODULE)MessageBoxA, "MessageBoxA");
      ::lpAddress = MessageBoxA;
      if ( MessageBoxA )
      {
        VirtualProtect(MessageBoxA, 0xEu, 0x40u, &flOldProtect);
        lpAddress = ::lpAddress;
        LOWORD(v3) = 0xB848;
        WORD5(v3) = 0xE0FF;
        qword_7FF7ABBA8AE8 = *(_QWORD *)::lpAddress;//8字节
        dword_7FF7ABBA8AF0 = *((_DWORD *)::lpAddress + 2);//8字节后的4字节
        word_7FF7ABBA8AF4 = *((_WORD *)::lpAddress + 6);//8+4+2共14字节
        lpAddress_0 = (__int64)::lpAddress;
        *(_QWORD *)((char *)&v3 + 2) = sub_7FF7ABB810F0;//16字节后
        *(_QWORD *)::lpAddress = v3;
        lpAddress[2] = DWORD2(v3);
        *((_WORD *)lpAddress + 6) = 0;
        LODWORD(MessageBoxA) = VirtualProtect(::lpAddress, 0xEu, flOldProtect, &flOldProtect);
      }
    }
  }
  return (int)MessageBoxA;
}
```

知道提hook在内存中是

0~2字节0x48 0xB8（mov rax, xxx）

2~10字节  sub_7FF7ABB810F0

10~12字节 0xFF 0xE0(jmp rax)

lpAddress是MessageBoxA板块执行流hook到了sub_7FF7ABB810F0函数

`MessageBoxA` 本身的功能

它就是 Windows 最基础的**弹窗函数**：

```
int MessageBoxA(
    HWND   hWnd,       // 父窗口句柄
    LPCSTR lpText,     // 消息正文
    LPCSTR lpCaption,  // 标题栏
    UINT   uType       // 按钮/图标类型
);
```

![3](/pctf/3.jpg)

很明显v8对明文进行加密，下面全是对v8的检验，v8一看就是很重要，直接追进去看看究竟是什么

![3](/pctf/4.jpg)

进去一看很明显最后是

sub_7FF7ABB819F0((__int64)v76, (__int64)v77);为AES加密

而v77就是密钥，看一眼密钥

```c
 v77[0] = 0x34123412;
  v77[1] = 0x34123412;
  v77[2] = 0x34123412;
  v77[3] = 0x21534541;
```

刚好是16字节，128位

memset(&v9[Size + n0x10_1], (unsigned __int8)n0x10, (unsigned int)(n0x10 - n0x10_1));这个明显是PKCS#7 / PKCS#5 填充
缺了多少字节，每个填充的字节就是多少

```python
from Crypto.Cipher import AES
from Crypto.Cipher.ARC2 import MODE_ECB
from Crypto.Util.Padding import pad, unpad
key = b'\x12\x34\x12\x34\x12\x34\x12\x34\x12\x34\x12\x34AES!'
data = bytes([
    0xF2, 0x7B, 0x7E, 0x75, 0xB4, 0x5C, 0x08, 0xFA,
    0x19, 0x3C, 0x8A, 0x4A, 0x04, 0xF8, 0x1F, 0x67,
    0x1B, 0x05, 0x9C, 0xE7, 0x27, 0x40, 0x78, 0x6D,
    0x28, 0xF6, 0xA8, 0xB8, 0x06, 0xC6, 0xC5, 0x51
])
cipher = AES.new(key, AES.MODE_ECB)
decode = unpad(cipher.decrypt(data),16)
print(decode)

```



## 题中的部分汇编指令

1.movaps  [rsp+48h+var_18], xmm6

将128为的XMM6寄存器保存到栈上(movaps要求16字节对齐，栈帧要严格对其)

2.cdq

符号位拓展，将EAX的符号位复制到EDX的所有位

3.and(位与&)

4.sar r8d, 4

算数右移4(R8D = R8D >> 4（算术右移，等效除以16）)



## CRT初始化

程序的默认入口点是CRT提供的函数：

控制台程序：mainCRTStartup

程序窗口:WinMainCRTStartup

主要完成

1.操作系统底层对接与安全环境准备（安全环境cookie初始化）

2.操作系统参数的翻译

3.CRT本身核心组件的初始化（Heap init, I/O系统与标准流，区域设置）

4.执行C++全局/静态对象的构造

5.执行main函数

## Windows的API

GetModuleHandle：获取模块句柄，获取加载DLL的及地址

GetProcAdress:获取函数地址，从指定DLL中导出函数地址

VirtualProtect:修改内存保护属性，改变一快内存的权限

```
Bool VirtualProtect(

[in] LPVOID lpAddress,
[in] SIZE_T dwSize,
[in] DWORD flNewProtect,
[out] PDWORD lpfloldProtect

);
```

[in] LPVOID lpAddres是访问保护属性的页区域的起始页的地址

[in]SIZE_T dwSize：区域的大小

[in] flNewProtect内存保护选项

- **0x01** (`PAGE_NOACCESS`)：完全禁止访问。
- **0x02** (`PAGE_READONLY`)：只允许读取。
- **0x04** (`PAGE_READWRITE`)：允许读写，但不可执行。
- **0x20** (`PAGE_EXECUTE_READ`)：允许执行和读取（大多数代码段的默认状态）。
- **0x40** (`PAGE_EXECUTE_READWRITE`)：**允许执行、读取和写入**（你用的这个）。

[out] lpfloldProtect指向变量的指针，接受第一页先前的访问保存值(备份原来的值)

## inlinehook

通过修改原函数开头的汇编指令，直接跳转到指定函数

## ## peb

```
typedef struct _PEB {
  BYTE                          Reserved1[2];
  BYTE                          BeingDebugged;
  BYTE                          Reserved2[1];
  PVOID                         Reserved3[2];
  PPEB_LDR_DATA                 Ldr;
  PRTL_USER_PROCESS_PARAMETERS  ProcessParameters;
  PVOID                         Reserved4[3];
  PVOID                         AtlThunkSListPtr;
  PVOID                         Reserved5;
  ULONG                         Reserved6;
  PVOID                         Reserved7;
  ULONG                         Reserved8;
  ULONG                         AtlThunkSListPtr32;
  PVOID                         Reserved9[45];
  BYTE                          Reserved10[96];
  PPS_POST_PROCESS_INIT_ROUTINE PostProcessInitRoutine;
  BYTE                          Reserved11[128];
  PVOID                         Reserved12[1];
  ULONG                         SessionId;
} PEB, *PPEB;
```

 BeingDebugged检测debugg是返回1

# 2.FunPyVM

解开attchment(用pyinstxtractor)就看见python程序，这就开启python逆向

[pychaos | pyc file | decompile python | pyc to py](https://pychaos.io/)
python3.13反编译网站

反编译main函数

```python
import sys
import os
import bitstring
from kernelVM import CustomVM
if __name__ == '__main__':
  if getattr(sys,'frozen',False):
    current_dir = os.path.dirname(sys.executable)#反回目录部分，打包后
  else:
    current_dir = os.path.dirname(os.path.abspath(__file__))#源代码(os.path.abspath将相对路径转换为绝对路径

  filename = os.path.join(current_dir,'opcode.bin')#path拼接
  try:
    stream = bitstring.ConstBitStream(filename=filename)#以只读打开文件
    bytecode = stream.tobytes()
  except Exception as e:
    print('Error: Could not read \'opcode.bin\' in the current directory.')
    print('Please ensure \'opcode.bin\' is placed next to the executable.')
    sys.exit(1)

  vm = CustomVM()
  print('--- VM Start ---')
  vm.run(bytecode)
  print('\n--- VM End ---')
```

getattr(sys, 'frozen', False)获取对象的 'frozen'属性，不存在返回Fasle

sys是与解释器及运行环境交互的窗口

os是系统库
