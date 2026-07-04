---
title: VNctf
date: 2026-02-02 15:48:37
tags: reverse
---

# ez_maze

这回v&N也是爆零了，等我有实力第一个投的绝对就是v&n，所以也是来wp大学习这是mfc逆向，mfc是微软提供的一种c++的类库，当然这道题还有upx壳

![4](/buuctf/4.jpg)

![5](/buuctf/5.jpg)

红了一片，upx0,upx1,upx2，upx!，upx的各种标志全没有了

一边来说运行两次然后找push就行了但这道题upx代码与源代码在

![6](/buuctf/6.jpg)

但是这道题并非常见的在两次运行，跳过前面的系统代码，并没见到pushad（通用寄存器），pushfd（标志寄存器），push，还有lea但是三次运行找到了jmp 112419_ezre.7FF6518D102A这一看就是主程序入口，

进去一看这题将显示的push  rax等给整没了

```
LEA 目标寄存器, [内存寻址表达式]   //通过内存地址（相对地址，偏移量）计算出有效地址
```

不过还后留下了lea与push rdx，下访问断点，运行程序，直接到一堆pop这太对了

![7](/buuctf/7.jpg)

首先得用cff-exploer改配置

![10](/buuctf/10.jpg)

在头文件的characteristics选上executable

再在可选头文件的dllcharacteristics去除dll可移动

![11](/buuctf/11.jpg)

之后一直步过，找到大跳，进入后用scylla，脱壳结束（基本上是在千位上差，16进制的），因为版本的问题，所以xspy一开始演了我一把

![12](/buuctf/12.jpg)

找基址和偏移

![13](/buuctf/13.jpg)

这就是最后的迷宫函数

一开始一串赋值为0，不难看出起始点为（0，0）

srand(100u);这还有一个种子生成，参数为100

```
do
  {
    *((_DWORD *)v7 + 152) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 612) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 616) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 620) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 624) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 628) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 632) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 636) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 640) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 644) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 648) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 652) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 656) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 660) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 664) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 668) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 672) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 676) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 680) = 1;
    *(_DWORD *)((char *)a1 + n1600 + 684) = 1;
    n1600 += 80;
    v7 = (CWnd *)((char *)v7 + 80);
  }
  while ( n1600 < 1600 );
```

看这个一看就是迷宫生成，先全赋值为1，之后部分赋值零，在循环中的列中刚好20，循环中的行也是0~19

也就是长20宽20

```
*((_DWORD *)a1 + 152) = 0;
```

将(0,0)位置置为0

```
#include<stdio.h>    //顺序右下左上
int a[10][10];
void f(int x, int y, int k)
{
    a[x][y] = k;
    if(y+1<=4&&a[x][y+1]  == 0)
    {
        f(x, y+1, k+1);
    }
    if(x+1<=4&&a[x+1][y] == 0)
    {
        f(x+1, y,k+1);
    }
    if(y-1>0&&a[x][y-1]==0)
    {
        f(x, y-1, k+1);
    }
    if(x-1 >=1&&a[x-1][y]==0)
    {
        f(x-1, y, k+1);
    }
}
int main(void)
{
    f(1, 1, 1);
    for(int i = 1; i<=4; i++)
    {
        for(int j = 1; j<=4;j++)
        {
            printf("%d ", a[i][j]);
        }
        printf("\n");
    }
}
```

深度优先搜索,如果是自定义的迷宫，先要创建char a\[10][10]（int的全局变量会直接赋值为0，之后创建path函数\[430][2]主要是存x与y）

迷宫生成两个算法：1.将墙当为线，将路当为网格2.把路和墙均当为网格（其实就是第一种的线变粗成网格）
所谓**完美迷宫**，就是没有回路（循环路），没有不可达区域的迷宫，并且迷宫中任意两个网格间都有唯一的路径。

直接dump首先在开始初始化的打断点去找地图位置（注意一个占四字节）

最后在最后要返回是打断点，在g跳到对应区域得到第图，然后深度搜索

得到

![14](/buuctf/14.jpg)

## 方法二

[VNCTF2026 WP by YHalo - YHalo's Blog](https://yhalo.cn/900/vnctf2026-wp-by-yhalo/)

感谢大佬的方法，直接一个x64dbg解决，感觉我对x64dbg了解的还是太少了

![8](/buuctf/8.jpg)

先在内存布局中找到主模块，找到ezre（这一看就是主程序，直接在text下断点），之后运行

之后多点几次运行直到程序出来这时就可以去找text节区（存代码）

补冲data（存放已初始化的全局变量和局部静态变量）,rdata（全局常量和字符串常量）,arch（系统内部使用）

bss段（存放未始化的全局变量和局部静态变量）

找到后搜索当前模块的字符串

![9](/buuctf/9.jpg)

看到wsad这一看就是迷宫题，迷宫要找到起始点和迷宫的具体内容

00007FF7BCBE1953 |  | xor ebx,ebx                            关键操作将ebx寄存器归零

汇编dec为-1，inc为加1

根据汇编知道rsi(64位寄存器),rdi,r12d,r14,r15d

接下来

00007FF7BCBE1A7E |  | cmp rsi,13                             |
00007FF7BCBE1A82 |  | ja 112419_ezre.7FF7BCBE1B01            |
00007FF7BCBE1A84 |  | cmp rdi,13 （16进制数）                            |

也就是坐标的范围不可能超过19，所以坐标为0~19      //这里要注意x64dbg的数字均用16进制

```
00007FF7BCBE1A36 |  | call qword ptr ds:[<&Ordinal#4913>]    |
00007FF7BCBE1A3C |  | cmp ax,61                              | 61:'a'
00007FF7BCBE1A40 |  | je 112419_ezre.7FF7BCBE1A76            |
00007FF7BCBE1A42 |  | cmp ax,64                              | 64:'d'
00007FF7BCBE1A46 |  | je 112419_ezre.7FF7BCBE1A6C            |
00007FF7BCBE1A48 |  | cmp ax,73                              | 73:'s'
00007FF7BCBE1A4C |  | je 112419_ezre.7FF7BCBE1A60            |
00007FF7BCBE1A4E |  | cmp ax,77                              | 77:'w'
00007FF7BCBE1A52 |  | jne 112419_ezre.7FF7BCBE1A7E           |    //这里是jne
00007FF7BCBE1A54 |  | inc r15d                               |     //‘w’
00007FF7BCBE1A57 |  | inc rdi                                |
00007FF7BCBE1A5A |  | add r14,14                             |
00007FF7BCBE1A5E |  | jmp 112419_ezre.7FF7BCBE1A7E           |
00007FF7BCBE1A60 |  | dec r15d                               |      //'s'
00007FF7BCBE1A63 |  | dec rdi                                |
00007FF7BCBE1A66 |  | sub r14,14                             |
00007FF7BCBE1A6A |  | jmp 112419_ezre.7FF7BCBE1A7E           |
00007FF7BCBE1A6C |  | dec ebx                                |       //'d'
00007FF7BCBE1A6E |  | dec rbp                                |
00007FF7BCBE1A71 |  | dec rsi                                |
00007FF7BCBE1A74 |  | jmp 112419_ezre.7FF7BCBE1A7E           |
00007FF7BCBE1A76 |  | inc ebx                                |        //‘a’
00007FF7BCBE1A78 |  | inc rbp                                |
00007FF7BCBE1A7B |  | inc rsi                                |
00007FF7BCBE1A7E |  | cmp rsi,13                             |   
```

接下来就是w，a，s，d的对坐标的影响根据以上可知r14是纵坐标，一回w/s变0x14可知横长为20，一看rbp就是横坐标

接着看汇编

```
00007FF7BCBE1A8A |  | lea rax,qword ptr ds:[r14+rbp]         |
00007FF7BCBE1A8E |  | mov rcx,qword ptr ss:[rsp+20]          | rcx:KiUserCallbackDispatcher
00007FF7BCBE1A93 |  | cmp dword ptr ds:[rcx+rax*4+260],1     | rcx+rax*4+260:RtlCallEnclaveReturn+65
00007FF7BCBE1A9B |  | je 112419_ezre.7FF7BCBE1B01            |    //跳动error
```

所以1就是墙，这是撞墙逻辑，我们要去找地图，由于dword所以4字节一组，所以将rax也就是将地图展平后的位置

那rcx是什么前面是mov rcx, [rsp+20]，最前面是mov [rsp+20], rcx这是this（c++中的隐式指针，成员被调用时，编译器会隐式的传送该对象的地址作为this指针），第一个参数是对象的地址（this指针,用于区分·不同的变量），其实就是rcx的值，rcx就是基址（参考的起点），在没对rcx进行别的操作前一开始存的就是对象的地址

接下来看终点

```
00007FF6953D1AAA |  | cmp ebx,13                             |
00007FF6953D1AAD |  | jne 112419_ezre.7FF6953D1B01           |
00007FF6953D1AAF |  | cmp r15d,ebx                           |
00007FF6953D1AB2 |  | jne 112419_ezre.7FF6953D1B01           |
00007FF6953D1AB4 |  | lea rcx,qword ptr ss:[rsp+40]          |
00007FF6953D1AB9 |  | call qword ptr ds:[<&Ordinal#296>]     |
00007FF6953D1ABF |  | nop                                    |
00007FF6953D1AC0 |  | mov r8,qword ptr ds:[r13]              |
00007FF6953D1AC4 |  | lea rdx,qword ptr ds:[7FF6953D4DF0]    | 00007FF6953D4DF0:L"correct! your flag is VNCTF{%s} "
```

ebx也就是横坐标为19， cmp r15d,ebx 也就是横纵坐标与横坐标相同，也就是终点为（19，19）

maze从rcx+0x260开始

00007FF9E5485E20

## mfc逆向学习

mfc程序是由mfc类库编写的c++程序，图形界面通常是检验，用ida

由于是消息映射所以点进去也是看不懂，用xspy看最下面的消息

一般看oncommand

```
virtual BOOL OnCommand(WPARAM wParam, LPARAM lParam);
 
 
//定义
BOOL CDlgTest::OnCommand(WPARAM wParam, LPARAM lParam)
{
 
	return CDialog::OnCommand(wParam, lParam);
}

```

主要接受菜单项，控件与快捷键，而按钮则是控件，所以主要找确认就是找Oncommand，找偏移地址，

然后通过detect it easy找到文件基址，而ida中的地址是sub_xxxx，xxxx即为实际地址

mfc使用消息映射基机制，即一个消息与消息处理函数（对应的消息映射表，消息处理函数的声明和实现）

窗口消息分为三个部分：1.无符号整数，即消息指2.消息附带的WPARAM类型的参数（传递标识、标志位、小数据）3.消息附带的LPARAM类型的参数（传递复杂数据、结构指针和坐标数据）

通过导入结构体将消息映射表（类）

```
DECLARE_MESSAGE_MAP	声明将在类中使用消息映射来将消息映射到函数（必须在类声明中使用）。
BEGIN_MESSAGE_MAP	开始消息映射的定义（必须在类实现中使用）。
BEGIN_TEMPLATE_MESSAGE_MAP	开始在包含单个模板参数的类类型上定义消息映射。
END_MESSAGE_MAP	结束消息映射的定义（必须在类实现中使用）。
```

声明与实现类似函数的声明与定义

可以通过导入结构体将

```
struct AFX_MSGMAP_ENTRY
{
    UINT nMessage;
    UINT nCode;
    UINT nID; // ID号
    UINT nLastID;
    UINT_PTR nSig;
    void (*pfn)(void); // 该ID号的消息处理函数
};

struct AFX_MSGMAP
{
    const AFX_MSGMAP *(__stdcall *pfnGetBaseMap)();
    const AFX_MSGMAP_ENTRY *lpEntries; // 消息处理函数映射表
};

```

在view->open sibview -> local type(本地类型)存的就是各种函数、类和空间的内部定义的类型别名或类型定义

（map为映射），add type的将两个结构体导入导入，找到消息映射表的偏移（xspy）找到偏移，在detedct找到机制，然后找到消息映射表，按g跳到对应地址，按alt+q导入struct AFX_MSGMAP，之后对应xspy的表的各个指令，有几个就是几个struct AFX_MSGMAP_ENTRY



