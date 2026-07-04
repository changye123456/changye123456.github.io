---
title: qctfweek3
date: 2026-02-20 15:54:17
tags: reverse
---

# **1.Fisher**

题目有提示是我要一个好点的钩子，这是要hook得好的鱼饵吗

![1](/qctf3/1.jpg)

这是main函数的主逻辑

tAZ5tAZ5tAZ5vg7F2RZF2RZQ0gv5yCfAxSZKzq==一眼就是密文，很可能是base64加密，

进sub_7FF62A7214B0加密函数去追

然后有映射表，解出NO_NO_NO_This_is_the_bad_one，果然是fake flag，sparkctf也有几个看到汇编直接没绷住，100%跳转错误

The fisherman doesn't like your bait.\n，

我有一计即使要看base64加密后是不是还干了些什么，就要给str打硬件断点

![2](/qctf3/2.jpg)

![3](/qctf3/3.jpg)

快进到加密结束

![4](/qctf3/4.jpg)

直接就是下硬件断点

![5](/qctf3/5.jpg)

果然寻到另一处加密，核心是tea加密，这是老熟人了

写一下解密

```c
#include<stdio.h>
#include<stdint.h>
int main(void)
{
    char v5[64];
    v5[0] = 0x8;
    v5[1] = 0xEE;
    v5[2] = 0x59;
    v5[3] = 0x4D;
    v5[4] = 0xD;
    v5[5] = 0xE0;
    v5[6] = 0xC0;
    v5[7] = 0x89;
    v5[8] = 0xA1;
    v5[9] = 0x98;
    v5[10] = 0xB2;
    v5[11] = 0xBB;
    v5[12] = 0xCF;
    v5[13] = 0x70;
    v5[14] = 0x7F;
    v5[15] = 0xE5;
    v5[16] = 0xE8;
    v5[17] = 0x2F;
    v5[18] = 0x9A;
    v5[19] = 0x8A;
    v5[20] = 0x20;
    v5[21] = 0xCB;
    v5[22] = 0x74;
    v5[23] = 0x12;
    v5[24] = 0xF2;
  v5[25] = 0x30;
  v5[26] = 0x78;
  v5[27] = 0x1F;
  v5[28] = 0xE;
  v5[29] = 0xEB;
  v5[30] = 0x1F;
  v5[31] = 0x88;
  v5[32] = 0xC8;
  v5[33] = 0xBC;
  v5[34] = 0x4E;
  v5[35] = 0xF8;
  v5[36] = 0x52;
  v5[37] = 0x13;
  v5[38] = 0x53;
  v5[39] = 0x8B;
  v5[40] = 0x9D;
  v5[41] = 0xBF;
  v5[42] = 0x66;
  v5[43] = 0xB;
  v5[44] = 0x6A;
  v5[45] = 0xAC;
  v5[46] = 0x21;
  v5[47] = 0x4F;
  v5[48] = 0xE9;
  v5[49] = 0x1F;
  v5[50] = 0x46;
  v5[51] = 0x46;
  v5[52] = 0x9E;
  v5[53] = 0xCB;
  v5[54] = 0xFA;
  v5[55] = 0x63;
  v5[56] = 0xA3;
  v5[57] = 0x85;
  v5[58] = 0x14;
  v5[59] = 0xC9;
  v5[60] = 0x2E;
  v5[61] = 0xF7;
  v5[62] = 0x10;
  v5[63] = 0xC5;
  uint32_t key[4];
     key[2] = 0;
     key[3] = 0;
     key[0] = 0x44332211;
     key[1] = 0x88776655;
  int temp;
  for(int i = 7; i>=0; i--)
  {
    temp = 0x6D6DD6D7*(-32);
    unsigned int v3, v4;
    v3 = * ((uint32_t *)&v5[i*8]);
    v4 = * ((uint32_t *)&v5[i*8+4]);
    for(int j = 0; j<32; j++)
    {
        v4 -= (key[3] + (v3 >> 5)) ^ (temp + v3) ^ (key[2] + 16 * v3);
        v3 -= (key[1] + (v4 >> 5)) ^ (temp + v4) ^ (key[0]+ 16 * v4);
        temp += 0x6D6DD6D7;    
    }
    * ((uint32_t *)&v5[i*8]) = v3;
    * ((uint32_t *)&v5[i*8+4]) = v4;
  }
  for(int i = 0; i<64; i++)
      printf("%c", v5[i]);
}
```

注意密文和密钥均是无符号的32位数，key剩下8位

得到zCN7zTJg0xnEzxjJywV50xn53CvO4vZPyxrF2SzFzwr53SBQ0fZV1TvOxSj70xrZ
前面还有一个base58加密

![6](/qctf3/6.jpg)

flag{Fisherman_is_very_satisfied_with_your_bait}
## 原理分析

于是我又探究了一下为什么会在base64加密后跳转到tea加密所在地

它是将strcmp命令进行改写

.原理是使用inlinehook（拦截运行程序内的某个现有函数体），其可以通过修改内存代码的汇编以达到拦截任何函数的目的，包括系统的api（非内核）

其即可以拦截API的调用，也可以修改参数继续原函数逻辑，或者直接拦截返回失败

### 其基本原理

windows执行下的dll和exe的代码段会text以及其他程序整理后加载在内存，以一定顺序排列在内存空间中

```
xx.exe, 0xc80000
abseil_dll.dll, 0x6ca0000
AcLayers.dll, 0x7b9d0000
AddrSearch.dll, 0x46a0000
```

dll和exe的内存空间首地址被称为基地址，运行中可对其修改，windows使用VirtualProtect函数可以修改虚拟内存地址的保护属性，使其标记为可读写

本题

```
char sub_7FF6F2661020()
{
  HMODULE hModule; // [rsp+20h] [rbp-18h]

  hModule = GetModuleHandleA("ucrtbase.dll");
  strcmp_0 = (int (__cdecl *)(const char *, const char *))GetProcAddress(hModule, "strcmp");
  sub_7FF6F2661070(strcmp_0, (__int64)sub_7FF6F2661150);
  return 1;
}
```

```
char __fastcall sub_7FF6F2661070(void *strcmp, __int64 p_sub_7FF62A721150)
{
  DWORD flOldProtect; // [rsp+20h] [rbp-28h] BYREF
  _QWORD Src[2]; // [rsp+28h] [rbp-20h] BYREF

  LODWORD(Src[0]) = 0x25FF;
  WORD2(Src[0]) = 0;
  *(_QWORD *)((char *)Src + 6) = p_sub_7FF62A721150;
  VirtualProtect(strcmp, 0xEu, 0x40u, &flOldProtect);
  memcpy(&lpAddress_, strcmp, 0xEu);
  memcpy(strcmp, Src, 0xEu);
  VirtualProtect(strcmp, 0xEu, flOldProtect, &flOldProtect);
  return 1;
}
```

先加载了dll文件的地址
而FF 25是jmp qword ptr [RIP + 偏移量]（）

先找到地址，在修改初始代码为jmp，但个函数名本质上是地址，跳转到对应函数

# 2.**Trap**（陷阱）

这一看就有坑，容我跳两下试一下

![8](/qctf3/8.jpg)

![7](/qctf3/7.jpg)

直接去找核心加密代码，发现密钥dst_并不知道，直接按x查找引用

![9](/qctf3/9.jpg)

找到密钥生成函数，这个原来v1其实是Isdebugger（）不过被我patch掉了，调试为真时执行以下逻辑证明下面是不对的，这题不止一处反调试，所以上面就是真实的密钥

```
#include<stdio.h>
#include<stdint.h>
int main(void)
{
  uint8_t temp[] = {0x57,0x51,0x4,0x3B,0xD9,0xB6,0xF1,0x96,0xFF,0xC4,0xF2,0x96,0xCC,0xA6,0xB4,0x1B,0x4D,0x1,0x60,0x32,0x4,0x2C,0x5B,0x43,0x47,0x72,0xB4,0xB5,0xB0,0x96,0xD0,0xFE};
  uint8_t arry[11] = {'1', 'i', '4', 'W', 0x99, 0x35, 0x77,  0x11, '6','R', 'v'};

  for(int i = 31; i>=0; i--)
  {
    if(i>0)
    {
      temp[i] ^= temp[i-1];
    }
    if(i%2)
    {
        temp[i]^=arry[i%11] + 1;
    }
    else
    {
      temp[i]^=arry[i%11];
    }
  }
  for(int i = 0; i<32; i++)
  {
    printf("%c", temp[i]);
  }
}
```

得到flag{Y0u_h@V3_E5c4ped_Fr0m_7r4p}

一开始密钥的‘w’大小写整错了，导致一直出的不对，还有在c语言中的''表示单个字符，而“”是字符串，相当于多了个‘\0’

# 3.babyre

一道简单的混淆，让我品尝一下

## 先前前写几个常见混淆

1.数据转化(Data transformation)

改变数据的格式，将数字转换为二进制，修改数据的存储方式，用表达式替代之（使用复杂的数学表达式替代常量，所欲以代码和数学都要好）

2.代码流混淆

（1）调整程序执行语句的顺序

（2）插入任意跳转指令，改变程序的控制图

（3）将树状的条件语句转换为平坦的switch语句

3.针对**Objective-C** 代码的混淆（**Objective-C** 为基于c的面向对象语言，是超集）

（1）混淆消息调用（文本加密）

（2）加密元数据

4.源码级混淆

(1)标识符重命名

将代码中的各个元素改变成毫无意义的名字，将函数、变量、类改编成单个字母或者数字

(2)等价表达式

重写代码中的部分逻辑，使其功能等价，但是更难理解，如将循环变为递归，精简中间变量

(3)代码重排

打乱原有代码格式

(4)花指令

(5)自解密

对源程序进行加密，在即将运行代码是解密

5.机器码混淆

(1)控制流平坦化

将原有的顺序、选择、循环统一重构成Switch结构，使得程序从原来的正常章台变为扁平化

(2)伪造控制流

构造出根本不执行的块

(3)指令替换

将原来的几条能够形成魔种功能的指令替换为大量指令

(4)混淆器

对JS进行混淆的工具有YUi Compressor, Gogle Closure Compiler, UglifyJS, JScrambler

在windows下混淆最出名的是VMPROTECT（将部分代码转换为自身才能解释执行的代码）

OLLVM混淆器

## reference

[逆向反混淆OLLVM-先知社区](https://xz.aliyun.com/news/17017)

## 回归本题

这道题代码较短直接ida就整出主逻辑，是个RC4加密，当然出题人想要考的是ollvm混淆的解决（Obfuscated(混淆) LLVM）是LLVM(Low - Level Virtual Machine)编译器框架的一种拓展，它是用来代码混淆（让你逆不出来），故意是源代码或二进制代码变得难以理解

ollvm的混淆方案：

1.控制流平坦化：将真实块处理成while和switch结构（循环和平坦化）

2.虚假的控制流：克隆真实块，随机替换指令，建立分支，分支条件为永真或永假，克隆后的快不会被执行

3.指令替换：将指令替换成更复杂的指令，反向优化

4.基本块分割：利用随机数产生分割点，将一个基本块分割成两个，使用绝对跳转连接

接下来为ollvm控制流平坦化的标准流程图

![12](/qctf3/12.jpg)

1.首先一切开始的地方，函数开始的地址为序言的地址

2.接着序言后继（即承先帝遗志）就是主分发器

3.以主分发器为后继的是预处理器

4.以预处理器为后继的是相关块

5.无后继的块是retn块（函数出口）

6.剩下的块是无关块

逻辑就是进入函数

然后就是主分发器，接着由于平坦化所以各个块并不相互联系所以主分发器控制相关块的执行顺序，在执行完一个块后进入预处理器，通过预处理器跳转到主分发器一次循环最后到retn块

## 解决方法

思路一：代码较短的动调（但这道题并非一个可执行程序）

思路二：插件脚本法

一个是default.py： [GitHub - cq674350529/deflat: use angr to deobfuscation](https://github.com/cq674350529/deflat)

基于angr框架（anger是个支持多框架的二进制文件分析的数据包，它提供了动态符号执行的能力以及多种静态分析），anger使用符号执行技术，将程序的输入表示为符号变量，而不是具体的值。它会跟踪这些符号变量在程序中的传播和变化，并生成一系列约束条件。通过约束求解器（如z3求解器），angr可以找到满足特定条件的输入（找到特定的正确数值后进入正确的分支，符号常量会进入全部的分支，对全部条件进行约束，找到达到目标状态的值），例如触发程序的某个分支或绕过安全检测

先要下载anger库,所以在cmd

```
pip install angr
```

还要下载[CQ674350529/Deflat：使用ANGr来解混淆](https://github.com/cq674350529/deflat?tab=readme-ov-file)

上面是去除空制流平坦化的脚本

```
python deflat.py -f "./attch" --addr 0x00400620
```

其中的attch是绝对路径，而0x00400620在不同的程序中要换成

由于这是ELF文件先下载CQ674350529/Deflat：使用ANGr来解混淆
在flat_control_flow文件夹中的deflat.py脚本放到与主文件夹一样

之后再cmd中打开wsl系统之后

```
 python3 -m venv angr-env//创建虚拟环境
 source angr-env/bin/activate  //激活虚拟环境
 pip install angr
 python3 deflat.py --file ./babyre --addr 0x0000000000401650//baybere为文件名而最后为混淆开始的地方
```

接着出场的是windows选手

```
python -m venv angr-env
angr-env\Scripts\activate
```

接着就是使用d810插件

使用前是

![14](/qctf3/14.jpg)

还是插件下的太多了，或者是ida性能太好了，直接就出来了是RC4加密

```c
#include<stdio.h>
#include<stdint.h>
int main(void)
{
    uint8_t src[23] = {0xC6,0xAC,0xEE,0x8B,0x57,0x4,0x64,0x3A,0xA7,0x3B,0x84,0x67,0xAC,0xD7,0x8E,0xD8,0x1D,0x3,0x85,0x55,0xF6,0x51,0x90};
    uint8_t key[8] = {0x12,0x34,0x56,0x78,0x90,0xAB,0xCD,0xEF};
    for(int i = 0; i<23; i++)
    {
        src[i]   = (src[i]>>3) | (src[i]<<5);
    }
    uint8_t temp[256];
    for(int i = 0; i<256; i++)
    {
        temp[i] = i;
    }
    int j = 0;
    for(int i = 0; i<256; i++)
    {
        j = (j + temp[i] + key[i%8])%256; 
        uint8_t temp2 = temp[i];
        temp[i] = temp[j];
        temp[j] = temp2;
    }
    int i = 0;
    j = 0;
    for(int k = 0; k<23; k++)
    {
        i = (i+1)%256;
        j = (j + temp[i])%256;
        uint8_t temp2 = temp[i];
        temp[i] = temp[j];
        temp[j] = temp2;
        src[k]^= temp[(temp[i]+temp[j])%256]; 
    }
    for(int i = 0; i<23; i++)
    {
        printf("%c", src[i]);
    }
}
```

得到flag{Ju4t_4_S1mpl3_RC4}
主要就是RC4与循环左移3

# 4.**[Week3] ezmath**

![15](/qctf3/15.jpg)

ida的图不应该这样的，你应该成树状，层次清晰

这一看就是ollvm混淆，首先条件是输入长度是80字节

![16](/qctf3/16.jpg)

这个条件判断要永真，其对应一段子分发器

例如

```
loc_4314:
cmp     [rbp+var_68], 55h ; 'U'
jz      short loc_4333
```

要么跳到相关块，若真则跳到下一个子分发器

一开始想按照控制流平坦化去做的，但是失败了，无论是deflat.py脚本还是d810插件均失败

一些数学的运算，数学，运算，这就要清楚z3求解器

## z3-solver的使用(可满足性模理论求解器)

这里介绍一下z3应用于逻辑推理，约束求解与程序验证

```
pip install z3-solver
```

z3理论基础

| Order | Mnmonics(助计符) | Description     |
| :---: | ---------------- | --------------- |
|   0   | True             | 真              |
|   1   | Flase            | 假              |
|   2   | =                | 相等            |
|   3   | distinct         | 不同            |
|   4   | ite              | if-then-else    |
|   5   | and              | n元和并         |
|   6   | or               | n元折取         |
|   7   | iff              | implication     |
|   8   | xor              | 异或            |
|   9   | not              | 否定            |
|  10   | implies          | Bi-implications |

接下是部分的作用

Distinct不同

```
s.add(Distinct(varibles))    #要求所有的变量互不相同
```

ite（if-then-else） 语法为ite condition then_expr  else_expr(如果说condition返回then_expr如果为假返回else_expr)

```python
ite  x>0 y z
想当于condition = x>0
      expr = If(condition, y, z)
```

接着是And和Or

```python
s.add(And(a!=1, b!=2))    #这是条件调用的并集
s.add(Or(a!=1, a!=2))
```

接着是implies(蕴含)

```
Implies(p, q)    #等价于(not p) or q,也就是p=>q
```

p为真， q为真  =>真

p为真， q为假=>假

p为假， q为真=>真

p为假， q为假=>真





接着是iff（当且仅当）

```
iff(p, q)或这p==q
```

逻辑上相当于p=>q and q=>p







首先导入z3库

```python
from z3 import *       #这是将z3库所有的所有内容导入这个命名空间
```

创建求解器

```python
s = Solver()
```

添加求解条件（关键一步）

```python
s.add()
```

对于布尔类型的表达式，可以用z3库的内置函数And, Or,implies,not方法

判断解是否存在

```python
if(s.check() == sat)
```

有解返回sat， 无解返回unsat

可以通过model方法获得一组解

```
print(s.model())
```

最后最关键的变量声明还没说

声明的变量为整型(interger, 长度不限实型(Real number，不限长度)向量(bit vector， 长度需要在创立时指定)，布尔类型(bool)

```
   x = z3.Int(name = 'x') #这种写法是没将z3库直接导入到程序中
   x, y = Ints('x y')
   x = Real('x')
   y = BitVec(name = 'y', bv = 32)        #z is  a 32-bit vector
   p = Bool(name = 'p')
   
```

接下来是关于位向量的代码（位向量是来定义某种未知数）

```python
from z3 import * 
#   测试位向量
def is_power_of_two(x):
    return And(x!=0, 0 == x&(x-1))
x = BitVec("x", 4)
prove(is_power_of_two == or([x = 2**i for i in range(4)]))


```

最后是声明数组变量

```python
for i in range(16):
    z[i] = Ints("x" + "[" + "str(i)"+"]")
```

str()函数是将对象变为字符串，括号中输入对象

![18](/qctf3/18.jpg)

```python
from z3 import *
solver = Solver()
s = [ BitVec(f'v{i}', 8) for i in range(80)]
v82 = s[1]
v81 = s[2]
v80 = s[3]
v79 = s[4]
v78 = s[5]
v77 = s[6]
v76 = s[7]
v75 = s[8]
v74 = s[9]
v73 = s[10]
v72 = s[11]
v71 = s[12]
v70 = s[13]
v69 = s[14]
v68 = s[15]
v67 = s[16]
v66 = s[17]
v65 = s[18]
v64 = s[19]
v63 = s[20]
v62 = s[21]
v61 = s[22]
v60 = s[23]
v59 = s[24]
v58 = s[25]
v57 = s[26]
v56 = s[27]
v55 = s[28]
v54 = s[29]
v53 = s[30]
v52 = s[31]
v51 = s[32]
v50 = s[33]
v49 = s[34]
v48 = s[35]
v47 = s[36]
v46 = s[37]
v45 = s[38]
v44 = s[39]
v43 = s[40]
v42 = s[41]
v41 = s[42]
v40 = s[43]
v39 = s[44]
v38 = s[45]
v37 = s[46]
v36 = s[47]
v35 = s[48]
v34 = s[49]
v33 = s[50]
v32 = s[51]
v31 = s[52]
v30 = s[53]
v29 = s[54]
v28 = s[55]
v27 = s[56]
v26 = s[57]
v25 = s[58]
v24 = s[59]
v23 = s[60]
v22 = s[61]
v21 = s[62]
v20 = s[63]
v19 = s[64]
v18 = s[65]
v17 = s[66]
v16 = s[67]
v15 = s[68]
v14 = s[69]
v13 = s[70]
v12 = s[71]
v11 = s[72]
v10 = s[73]
v9 = s[74]
v8 = s[75]
v7 = s[76]
v6 = s[77]
v5 = s[78]
v4 = s[79]
solver.add(69 * v29 + 123 * v4 == 3)
solver.add(91 * v29 + 9 * v24 == 0xBB)
solver.add( 65 * v63 + 69 * v82 + 108 * v24 + 126 * v29 == 0x82)
solver.add(3 * s[0] - 85 * v63 + -49 * v24 + 14 * v29 == 97)
solver.add(-5 * s[0] - 12 * v80 + 9 * v63 + 61 * v79 + 2 * v24 - 121 * v29 == 113)
solver.add( 43 * v49 - 52 * v63 + 29 * s[0] - 123 * v79 + 126 * v24 + 61 * v29 == 6)
solver.add(20 * v49 - 45 * v63 + -80 * s[0] - 3 * v79 + -121 * v24 - 94 * v29 + 87 * v17 == 121)
solver.add(101 * v49 - 78 * v63 + 14 * s[0] - 17 * v79 + -94 * v24 + 122 * v29 + -107 * v14 + 10 * v17 == 59)
solver.add(-61 * v79 + 12 * s[0] + 125 * v49 - 35 * v63 + -63 * v26 - 55 * v29 + -5 * v17 + 125 * v24 - 75 * v14 == 0x9B)
solver.add(-35 * v17 + 116 * v24 + 123 * v47 - 4 * v49 + 35 * s[0] + 123 * v79 + 102 * v26 - 30 * v29 - 2 * v14 == 29)
solver.add(-75 * v47 + 91 * v49 + -85 * s[0] + 3 * v79 + 79 * v63 + 13 * v70 + -63 * v24 - (v29 << 6) - 34 * v14 == 118)
solver.add(-73 * v29 + 109 * v42 + 65 * s[0] - 87 * v70 - v79 + -16 * v47 - 57 * v49 + -2 * v17 - 31 * v24 == 0xC2)
solver.add(-7 * v17 - 125 * v29 + 69 * s[0] + 83 * v79 + -9 * v49 + 36 * v70 + -95 * v42 + 69 * v47 - 55 * v8 == 0xE7)
solver.add( 35 * v63 - 75 * v70 + 41 * v81 + 43 * v79 + -6 * v42 - 52 * v47 + -85 * v26 + 3 * v29 - 48 * v14 == 90)
solver.add(74 * v81 + 84 * v79 + 50 * v63 + 117 * v70 + -3 * v42 + 105 * v47 + 3 * v24 + 4 * v26 + 101 * v12 == 42)
solver.add(105 * v26 + 74 * v29 + 95 * v39 + 106 * v49 + 4 *s[0]+ 82 * v63 + 33 * v12 + 18 * v24 + 104 * v8 == 0xB6)
solver.add (-13 * v14 - 74 * v17 + -88 * v81 - 67 * v79 + 69 * v49 + 105 * v63 + -21 * v32 + 40 * v39 - 56 * v8 == 0xC1)
solver.add( -67 * v74- 120 * v79+ 113 * v47+ 22 * v67+ -125 * v29- 2 * v32+ -50 * v17- 63 * v26+ -21 * v12+ 7 * v14 == 58)
solver.add( -95 * v28 - 27 * v29 + 54 * v63 - 113 * v74 + 49 * s[0] + 74 * v79 + -73 * v17 - 21 * v26 - 104 * v12 == 0xFD)
solver.add(125 * v47 - 17 * v49 + 3 * v55 - 100 * v74 + -56 * v79 + 70 * v81 + 103 * v24 - 45 * v26 - 88 * v12 == 72)
solver.add(-44 * v24 + 119 * v32 + -95 * v70 + 82 * v74 + -116 * s[0] - 29 * v76 + 71 * v14 + 55 * v17 + 104 * v8 == 0x99)
solver.add( -105 * v44 + 99 * v47 + 68 * v74 + 23 * v70 + 21 * v39 - 10 * v42 + -121 * v26 + 96 * v29 + 56 * v17 == 0xA0)
solver.add (103 * v32 - 83 * v33 + 78 * v55 - 12 * v70 + 17 * s[0] + 103 * v79 + 78 * v39 + 73 * v42 + 81 * v26 == 0xE5)
solver.add (-85 * v26 - 118 * v32 + 44 * v42 + 61 * v54 + 42 * v81 - 35 * v76 + -106 * v17 + 115 * v24 - 109 * v14 == 97)
solver.add(-28 * v42 + 85 * v76 + 3 * v79 + 39 * s[0] + -17 * v32 + 92 * v39 + -121 * v21 + 18 * v28 - 108 * v8 == 0x97)
solver.add (71 * v78 - 98 * v74 + 55 * v55 - 5 * v63 + -21 * v49 + 68 * v54 - v44 + 58 * v14 + 16 * v24 == 81)
solver.add (-11 * v47 - 29 * v49 + 79 * v79 + 87 * v70 + 100 * v55 + 9 * v66 + -4 * v28 - 80 * v44 - 45 * v8 == 49)
solver.add (73 * v74 + 27 * v81 + 99 * v63 - 119 * v71 + 100 * v33 + 127 * v42 + 38 * v21 - 50 * v28 + 59 * v12 == 0xA9)
solver.add (77 * v74 - 11 * v76 + -82 * v81 - 72 * v79 + -14 * v44 + 39 * v61 + 28 * v21 - 124 * v24 - 81 * v14 == 110)
solver.add (-38 * v39 + 83 * v43 + -25 * v54 + 50 * v63 + 29 * v81 - 8 * v74 + 14 * v29 + (v32 << 6) - 47 * v26 == 0xF9)
solver.add (-95 * v75 + 94 * v74 + -62 * v61 - 47 * v71 - v49 + -121 * v21 + 30 * v44 + 57 * v14 + 118 * v17 == 0xEF)
solver.add (110 * v78 - 109 * v68 + 123 * v42 - 5 * v44 + 55 * v33 - 94 * v39 - v28 + -98 * v17 + 61 * v26 == 0xD4)
solver.add (-82 * v8 - 37 * v14 + 54 * s[0] + 50 * v76 + -79 * v49 - 119 * v75 + -19 * v17 + 19 * v26 + 37 * v7 == 0x8D)
solver.add (-108 * v75 + 126 * v71 + 62 * v61 + 103 * v66 + 123 * v52 - 28 * v55 + -17 * v21 - 80 * v24 - 38 * v17 == 45)
solver.add (-33 * v21 + 28 * v28 + 11 * v54 - 7 * v55 + 123 * v66 - 10 * v68 + 55 * v76 + 123 * v70 + 3 * v9 == 0xBC)
solver.add (43 * v78 + 60 * v76 + 39 * v61 - 37 * v75 + 39 * v36 + 36 * v54 + 33 * v14 + 24 * v17 + 99 * v8 == 14)
solver.add(124 * v81 + 123 * v74 + 57 * v49 - 60 * v68 + -120 * v43 + 127 * v48 + -19 * v32 - 8 * v42 - 77 * v14 == 79)
solver.add (105 * v63 + 13 * v68 + -87 * v75 - 35 * v69 + 112 * v33 - 5 * v39 + -48 * v17 + 80 * v32 + 87 * v12 == 0xBB)
solver.add( -26 * v28 + 108 * v32 + 105 * v44 + 123 * v59 + 91 * v63 - 62 * v81 + 110 * v17 + 90 * v26 + 30 * v12 == 89)
solver.add( -101 * v43 - 9 * v48 + 80 * v59 - 101 * v50 + 51 * v21 + 31 * v39 + -92 * v12 + 26 * v17 + 44 * v7 == 55)
solver.add( 93 * v55 - 77 * v65 + 119 * v75 - 38 * v76 + 25 * v81 + 43 * v78 + 57 * v42 - 18 * v47 + 112 * v9 == 0x8E)
solver.add(-56 * v39 - 85 * v40 + -71 * v44 - 23 * v49 + 80 * v63 - 66 * v71 + 51 * v9 + 68 * v29 + 79 * v7 == 56)
solver.add( -69 * v66 + 127 * v52 + -73 * v33 - 24 * v50 + -18 * v26 - 70 * v32 + 89 * v20 + 6 * v21 + 101 * v12 == 0xDA)
solver.add (53 * v33- 98 * v41+ -94 * v71+ 80 * v76+ -110 * v61+ 22 * v68+ -80 * v44- 56 * v52+ 9 * v9+ 121 * v19 == 97)
solver.add(50 * v81 + 94 * v79 + -90 * v70 - 101 * v74 + -122 * v54 + 96 * v68 + 25 * v24 + (v40 << 7) - 77 * v11 == 92)
solver.add (116 * s[0] - 81 * v71 + -117 * v61 + 3 * v63 + 37 * v47 + 73 * v59 + 26 * v40 + 65 * v45 + 124 * v28 == 99)
solver.add (125 * v43 - 118 * v48 + -74 * v61 + 67 * v63 + -95 * v74 + 38 * v71 + 12 * v21 - 17 * v22 + 107 * v20 == 17)
solver.add(-89 * v65 - 34 * v61 + 107 * v48 + 36 * v50 + 73 * v39 - 48 * v43 + -51 * v20 + 81 * v28 - 113 * v10 == 117)
solver.add (74 * v47 + 104 * v48 + 92 * v59 - 52 * v61 + 107 * v70 + 46 * v68 + -89 * v36 - 53 * v40 - 37 * v25 == 0xCE)
solver.add (9 * v64 - 36 * v75 + -43 * v79 + 111 * v76 + 33 * v48 - 31 * v55 + 45 * v26 - 9 * v39 + 13 * v12 == 22)
solver.add (39 * v22 - 45 * v26 + 34 * v33 + 23 * v44 + -124 * v48 + 78 * v78 + 87 * v14 - 57 * v18 - 20 * v12 == 0x9E)
solver.add (-70 * s[0] - 52 * v49 + -38 * v39 - 45 * v42 + -111 * v30 - 32 * v36 - v28 + 114 * v18 + 82 * v22 == 17)
solver.add(-15 * v22 - 56 * v61 + -65 * v62 + 86 * v65 + 98 * v66 + 43 * v70 + -72 * s[0] + 110 * v71 - 32 * v18 == 25)
solver.add (-8 * v42 - 30 * v48 + -54 *s[0]- 116 * v76 + -112 * v30 + 100 * v39 + 70 * v24 - 126 * v29 + 127 * v6 == 0xEB)
solver.add (-95 * v19 + 85 * v20 + -46 * v22 - 50 * v48 + 21 * v56 + 39 * v59 + 15 * v8 + 52 * v11 + 85 * v6 == 43)
solver.add (-72 * v18 + 85 * v42 + 91 * v49 - 101 * v51 + 65 * v69 - 59 * v75 + 82 * v10 + 114 * v11 - 104 * v9 == 15)
solver.add (62 * v30 + 8 * v32 + 125 * v34 - 76 * v39 + 57 * v69 + 124 * v65 + 6 * v24 - 100 * v26 - 20 * v11 == 49)
solver.add (108 * v45 + 51 * v69 + 114 * v81 - 121 * v79 + -5 * v37 + 69 * v42 + -45 * v20 - 120 * v30 + 123 * v14 == 0x95)
solver.add (-39 * v45 + 56 * v61 + -102 * v63 + 51 * v62 + 51 * v42 - 39 * v44 + 4 * v11 + 53 * v38 - 60 * v7 == 0x8D)
solver.add (-114 * v42 - 44 * v43 + 126 * v45 + 98 * v56 + (v70 << 6) - 85 * v60 + 127 * v22 + 105 * v34 + 43 * v18 == 0xCC)
solver.add (111 * v49 + -126 * v69 + 56 * v81 + 17 * v54 + 117 * v62 + v45 + -87 * v28 + 107 * v31 - 23 * v10 == 0xE4)
solver.add (-113 * v38 - 35 * v49 + -83 * v70 + 70 * v74 + 30 * s[0] + 119 * v78 + 9 * v23 + 76 * v34 + 23 * v18 == 0xDB)
solver.add (47 * v42 + 106 * v44 + -121 * v49 + 89 * v72 + -54 * v79 - 88 * v76 + -51 * v37 + 114 * v40 - 72 * v28 == 0x88)
solver.add (79 * v27 + 21 * v34 + -72 * v54 - 96 * v66 + 108 * v72 - 127 * v70 + 52 * v23 + 19 * v26 + 7 * v7 == 77)
solver.add(-24 * v36 + 84 * v42 + 67 * v46 + 91 * v51 + -56 * v68 + 17 * v79 + -86 * v20 - 75 * v24 - 92 * v18 == 70)
solver.add(-44 * v79 + 75 * v62 + -28 * v48 + 92 * v52 + -95 * v40 + 7 * v46 + -93 * v25 - 25 * v35 + 98 * v12 == 112)
solver.add(-35 * v40 - 90 * v50 + -41 * v58 - 104 * v63 + -60 * v68 - 116 * v78 + -13 * v14 + 32 * v32 - 94 * v8 == 0xBA)
solver.add(41 * v73 + 16 * v64 + -43 * v46 + 56 * v60 + 32 * v35 + 119 * v38 + 68 * v24 + 111 * v33 - 23 * v19 == 0xA0)
solver.add (-111 * v16- 123 * v17+ -101 * v25- 26 * v28+ -98 * v29 - 75 * v41+ -114 * v74- 82 * v45+ 16 * v12+ 65 * v14 == 0x88)
solver.add( 31 * v22+ 71 * v24+ -90 * v42- 110 * v49+ -86 * v62+ 76 * v68+ 45 * v77- 127 * v73+ 86 * v15+ 97 * v17 == 62)
solver.add(-85 * v31 + 102 * v46 + -64 * v49 + 97 * v63 + 96 * v79 - 123 * v75 + 29 * v65 + 81 * v67 - 60 * v22 == 0xB6)
solver.add( 101 * v31 + 75 * v43 + 36 * v46 - 9 * v49 + 13 * v56 + 99 * v57 + -111 * v75 + 7 * v77 + 105 * v13 + 28 * v28 == 0xEA)
solver.add ( 108 * v44 - 38 * v49 + 68 * v61 + 74 * v75 + -58 * v77 - 56 * v81 + -46 * v17 - 42 * v33 - 71 * v4 == 63)
solver.add( -45 * v46 - 74 * v52 + 73 * v53 - 56 * v56 + 114 * v76 - 36 * v66 + 112 * v34 + 97 * v43 - 71 * v7 == 0xCB)
solver.add ( 118 * v21 - 113 * v49 + -64 * v57 + 47 * v60 + 84 * v68 - 4 * v77 + -45 * v6 - 125 * v14 - 33 * v5 == 2)
solver.add ( -62 * v77 - 92 * v52 + -9 * v47 + 80 * v50 + (v45 << 7) - 113 * v46 + 105 * v13 + 125 * v23 - 13 * v12 == 0xF1)
solver.add ( -126 * v60 - 63 * v65 + 19 * v66 + 73 * v73 + -12 * v74 - 109 * v76 + 97 * v16 + 51 * v59 - 13 * v10 == 0x94)
solver.add  (-36 * v40 + 78 * v52 + -7 * v58 - 32 * v62 + 59 * v80 + 87 * v78 + 122 * v23 - 118 * v35 - 11 * v11 == 88)
solver.add (15 * v53 + 28 * v58 + -51 * v82 + 95 * v63 + 90 * v47 + 44 * v49 + -31 * v29 + 60 * v30 + 6 * v27 == 0xB5)
solver.add (107 * v15 + 28 * v25 + 108 * v57 - 112 * v59 + 52 * v45 - 38 * v55 + -15 * v26 + 90 * v42 + -71 * v5 + 2 * v7 == 0xA0 )
for v in s:
    solver.add(And(v>=32, v<=126))   #可打印字符的ascii码从32到126
if solver.check() == sat:
    model = solver.model()
    flag = ''.join([chr(model[i].as_long()) for i in s])
    print(flag)

```

得到flag{we1cOmE_TO_th3_z3_woR1D_HoPe_Y0U_EnjOY_it_6JJ1zXmdYzhewjDArycY4RmpKlB?dskT}

要注意的是约束条件别错了‘’.join([char(model[i].as_long()) for i in s ])

这里的model对象里的属性有键值对（所以传入i为键，返回值）

#  5.**strangeEnc**

![18](/qctf3/18.jpg)

根据题目描述是写错了某种加密（应该是改了部分的des加密）

分析题目，最开始将不足8字节的输入，补充成8字节

什么加密要密文与密钥均为8字节（64位），那当然是des加密（des加密是对称加密）

"Koishi__"一看就是初始密钥

sub_140001CC0(p_input_1, "Koishi__");就是核心加密函数

![20](/qctf3/20.jpg)

 v3 = sub_140001360(*Koishi_);
  sub_140001550(v3);

这两个函数进去看了一下sub_140001360是去8位校验位

而sub_140001550是先左旋(循环左移)之后拼接，然后变为48位

![21](/qctf3/21.jpg)

接下来这个循环始是典型的ip置换

```
v9 = *(_QWORD *)p_Keys;
    v10 = 0;
    v29 = 0x504050403020120LL;
    v31 = 0x11100F0E0D0C0D0CLL;
    v30 = 0xB0A090809080706LL;
    v33 = 0x1B1A191819181716LL;
    v32 = 0x1514151413121110LL;
    v34 = 0x1201F1E1D1C1D1CLL;
    v11 = &v29;
    do
    {
      v12 = (unsigned __int8)&v29 + 47 - (_BYTE)v11;
      v13 = ((unsigned int)v2 >> (32 - *(_BYTE *)v11)) & 1;
      v11 = (__int64 *)((char *)v11 + 1);
      v10 |= v13 << v12;
    }
```

看这段代码，发现什么，这是核心加密时festial网络的加密函数，先将32位的明文拓展为48位

我还在想认真分析代码，因为des加密本质上是对称加密

动调吧

des加密密钥要倒放

结果

![23](/qctf3/23.jpg)

前面几个flag对上后面对不上乐，不知道什么原因，就是按照wp的手法，算了先这样吧，思想学到了

最后flag{Fun_Fact_its_littleEndian_DES}###

# 6.**[Week3] wtf**

![24](/qctf3/24.jpg)

我也要爆破网页？这是js逆向
这里请教了个web佬，按住f12可以打开chrome Dev tools/开发者工具，可以实时编辑页面，调试代码，分析性能，监控网络请求
然后找到源码

![25](/qctf3/25.jpg)

根据源码先运行src.js文件再运行div.js

div.js使用jsfuck混淆，是将js代码通过6种字符表示的一种混淆

将这段代码输入consloe直接输入+enter



![26](/qctf3/26.jpg)

得到

```
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;___Key = 'K0meji_K0ishi';
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;___Key.toString = function() {
    return 'Komeji Satori';
}
;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;var Ori = console.log;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;console.log = function(...args) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] == ___Key) {
            args[i] = 'Komeji Satori';
        }
    }
    Ori(...args);
}
;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
```

___Key.toString = function() {
    return 'Komeji Satori';
}
在将key转为字符串时会发生hook，console.log是在控制台打印，而f12的console与Element面板往往是运行时状态导致你看到的是被修改后的（专门防止逆向）

![27](/qctf3/27.jpg)

这一看就是xxtea加密，ans一看就是密文
 for (var i = 0; i < bytes.length; i++) {
        bytes[i] ^= ___Key[i % ___Key.length].charCodeAt(0);
    }
charCodeAt用于返回字符串的指定位置的unicode
TextEncoder().encode(input)是用来将字符串转为UTF-8编码

\>\>\>0是javascript的无符号右移0位，转为32位无符号数

```
#include<iostream>
#include<stdint.h>
#include<string.h>
using namespace std;
int main(void)
{
    unsigned char ans[] = {235, 108, 61, 245, 117, 157, 118, 92, 33, 218, 113, 75, 240, 104, 31, 79, 246, 48, 185, 255, 140, 102, 133, 47};
    char key[] = "K0meji_K0ishi";
    char keybyte[] = "K0meji_K0ishiK0m";
    for(int i = 23; i>=0; i--)
    {
        ans[i] ^=key[i%strlen(key)];
    }
    uint32_t k[4];
    for(int i = 0; i<4; i++)
    {
        k[i] = (keybyte[i*4]<<24)|(keybyte[i*4+1]<<16)|(keybyte[i*4+2]<<8)|(keybyte[i*4+3]);
    }
    for(int i = 16; i>=0; i-=8)
    {
        uint32_t v0 =  (ans[i] << 24) | (ans[i + 1] << 16) | (ans[i + 2] << 8) |ans[i + 3];
        uint32_t v1 =  (ans[i+4] << 24) | (ans[i + 5] << 16) | (ans[i + 6] << 8) |ans[i + 7];
        uint32_t delat = 0x9e3779b9 *32;
        for(int j = 31; j >= 0; j--)
        {
            v1 -=  (((v0 << 4) + k[2]) ^ (v0 + delat) ^ ((v0 >> 5) + k[3]));
            v0 -=  (((v1 << 4) + k[0]) ^ (v1 + delat) ^ ((v1 >> 5) + k[1]));
            delat -= 0x9e3779b9;
        }
        ans[i] = (v0>>24)&0xFF;
        ans[i+1] = (v0>>16)&0xFF;
        ans[i+2] = (v0>>8)&0xFF;
        ans[i+3] = v0&0xFF;
         ans[i+4] = (v1>>24)&0xFF;
        ans[i+5] = (v1>>16)&0xFF;
        ans[i+6] = (v1>>8)&0xFF;
        ans[i+7] = v1&0xFF;
    }
    ans[0] ^= 0x12;
    ans[1] ^= 0x34;
    ans[2] ^= 0x56;
    ans[3] ^= 0x78;
    cout << hex << ans;
    return 0;
}
```

得到flag{Js_Is_vErY_DyNam1c}

## html(超文本标记语言)中的div标签

css是指Cascading Style Sheets(层叠样式表)，是网页样式控制技术

div标签可以划分html结构，从而配合CSS控制某一块的样式

## jsfunck技术

false ⇒ ![]

true  ⇒!![]

undefined ⇒ \[][[]]

NAN  ⇒ +[![]]

0 ⇒ +[]

1  ⇒  +!+[]

Arry ⇒ []

Function ⇒  \[]["fiter"]

创建数字2只需!+[]+!+[]
