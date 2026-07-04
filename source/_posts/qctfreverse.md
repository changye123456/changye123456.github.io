---
title: reverseweekn
date: 2026-01-01 10:11:50
tags: reverse
---

  # 1**[Week2] CPPReverse**

一开始n个小时我直接看着c++原程序，结果抽象的一批（附带PDB文件），这个提醒

pdb存着什么（源代码文件路径与行号信息，局部变量、全局变量和类型，函数名和参数信息，类、结构体的成员信息）其实其实映射表（可以类比Android逆向的so层处理）

当然由于笨蛋的我并未发现这点，导致ida程序十分抽象，难度直线飙升，所以先来个禁pdb的

![wp1](/Qctf/wp1.jpg)

进来直接被一堆不知道什么的东西吓哭了,直接开始动调

![wp2](/Qctf/wp2.jpg)

这明显是输入，按n改名，一定要改名，后面再次出现就知道他是干什么的

 v13 = (unsigned __int8)sub_7FF626234970(v16, "flag{") || *(_BYTE *)sub_7FF626233C10(v30) != 125;

注意这个 *(_BYTE *)明显是字符125按r变成'}'

这很明显是输入验证

不妨输入flag{123456}123456最白不要是000000那么反序就看不出来了

![wp3](/Qctf/wp3.jpg)

接下来是重头戏

![wp4](/Qctf/wp4.jpg)

这是输入突然被推入栈顶，多半是要进行操作了

![wp5](/Qctf/wp5.jpg)

下一步flag{}没了，这事就知道sub_7FF6262317B0是脱去flag{}改为脱去

改名为tuoqu

![wp6](/Qctf/wp6.jpg)

又过去两步注意寄存器的地址000000F6A712F870和00000F6A712F7F0均指向123456（输入），他总不会什么都不干，接着深入这两个函数，但这里面也太抽象了，直接说是获得指向开头和结束的指针（果然不导入pdb文件抽象的要命）

![wp7](/Qctf/wp7.jpg)

![wp8](/Qctf/wp8.jpg)

注意栈的变化

![wp9](/Qctf/wp9.jpg)

寄存器接受了倒数的改变

std::shared_ptr<__ExceptionPtr>::operator为使其倒这输出

改成daoxu

接下来是if条件(关注条件)

![wp10](/Qctf/wp10.jpg)

isxdigit是检验是不是16进制（'A'-'F', 'a'-''f', 0-9）

很好123456都是16进制在（ctype.h(c语言)cctype（c++））

![wp11](/Qctf/wp11.jpg)

![wp12](/Qctf/wp12.jpg)

注意寄存器上变成了eC!

字符 e的16进制ascii码为0x65

C为0x43， !为0x21（这不就是反序后两两一组变成16进制吗）

![wp13](/Qctf/wp13.jpg)

sub_7FF626233530之后寄存器就变了

这是加密啊

![wp14](/Qctf/wp14.jpg)

又到了条件验证

![wp17](/Qctf/wp17.jpg)

![wp15](/Qctf/wp15.jpg)

找出&byte_7FF62623A768重藏的密文

这好像什么都没有，看上面的byte_7FF62623A760

这边直接字符串查找找到EE1A9B5AFA59AF28DE5D594F8FB990B1D1345590（一看就是密文）

接着分析加密，还是太抽象了

# 接着展示正确解法

![wp19](/Qctf/wp19.jpg)

导入pdb

![wp20](/Qctf/wp20.jpg)

这就正常多了

![wp21](/Qctf/wp21.jpg)

这是sotoi将（字符串变为整数）stoi(&Str, 0, 16);（第三个参数为进制基数）（如35变成0x35）

push_back放末尾

i += 2是两个一组

接着看上面未完成的解密

![wp23](/Qctf/wp23.jpg)

![wp22](/Qctf/wp22.jpg)

这是先加密再将16进制写入字符串

![wp24](/Qctf/wp24.jpg)

![wp25](/Qctf/wp25.jpg)

比较左右很明显left变量是加密EE1A9B5AFA59AF28DE5D594F8FB990B1D1345590为密文

开始两次反转（一次加密前，一次加密后）（与端序无关，我还在想为什么），所以还是正常顺序

pe文件字节序LE小端序，be大端序

elf则是小端序LSB，大端序MSB

```
#include<stdio.h>
#include<string.h>
#include<stdlib.h>
#include<stdint.h>
int main(void)
{
    char arry[] = "EE1A9B5AFA59AF28DE5D594F8FB990B1D1345590";
    char arry2[41];
    int temp = 0;
    for(int i = 39; i>=0; i--)
    {
        arry2[temp++] = arry[i];
    }
    arry[40] = '\0';
    char  * ew;
    ew = arry2;
    uint8_t num[20];
    for (int  i = 0; i < 20; i++)
    {
        sscanf((ew+2*i), "%2x", &num[i]);           //注意要为地址
    }
    for(int  i = 19; i >= 0; i--)
    {
       if(!(i % 2))
           num[i]^=7u;
        if(i>0)
        {
            num[i]^=num[i-1]-1;
        }
        num[i] -= i+7;    
     
    }
    ew = arry;
    for (int  i = 0; i < 20; i++)
    {
        sprintf((ew+2*i),"%02x",num[i]);
    }
    temp = 0;
    for(int i = 39; i>=0; i--)
    {
        arry2[temp++] = arry[i];
    }
    arry2[40] = '\0';
    printf("%s\n", arry2);
    return 0;   
}
```

思路是先反再拆再加密再拼上再反

得4350505f526576657253655f4578705f55705570

再套上flag{}即可

# **2Do you like to drink Tea?**

又来喝茶了

包是tea家族的成员

于是我果断派出ida大将迎接敌，是要破除tea敌

其实是魔女小姐请逆向手喝茶

![wp26](/Qctf/wp26.jpg)

开局就是Ciallo~，不好还有二次元，这种敌人一看就不好对付

浅尝一口，居然是上个与下一个有关，是类xxtea

接下来是逆向魔法师的喝茶打法

先看

```
void *__fastcall sub_401530(const char *a1, size_t *p)
{
  void *v3; // [rsp+28h] [rbp-18h]
  size_t v4; // [rsp+30h] [rbp-10h]
  size_t i; // [rsp+38h] [rbp-8h]

  v4 = strlen(a1);
  *p = (v4 + 3) >> 2;          //对于不足32位的代码块补上（刚好可以3/4==0，之后4/4==1，都多开一个）
  v3 = malloc(4 * *p);
  if ( !v3 )
    return 0;
  memset(v3, 0, 4 * *p);
  for ( i = 0; i < v4; ++i )
    *((_DWORD *)v3 + (i >> 2)) |= (unsigned __int8)a1[i] << (8 * (i & 3));//(i >> 2)是在四个一组，这是将字符串4个一组去装32uint的包//ABCD输入存成DCBA由于小端序内存ABCD%c
  return v3;
}
```

接下来就是tea家族的

解密代码

```
#include<stdio.h>
#include<stdint.h>
int main(void)
{
    uint32_t flag[7] = {0xF05D46E8, 0x4785FFEF, 0xF401BF82, 0xE5FCC60A, 0xBE70045D, 0x20788733, 0x933BA369};
    uint32_t key[4] = {0x12345678, 0xABCDEF01, 0x11451419, 0x19198101};
    uint32_t v19, v18, v16;
    for(int i = 5; i>=0;i--)
    {
        v19 = flag[i];
        v18 = flag[i+1];
        v16 = 0 - 0x61C88647 * 32;
        for(int j = 0; j<32; j++)
        {
            v16 += 0x61C88647;
            v18 += ((v19 << 6) + key[2]) ^ (v16 + v19 + 20) ^ ((v19 >> 9) + key[3]); 
            v19 += ((v18 << 6) + key[0]) ^ (v16 + v18 + 11) ^ ((v18 >> 9) + key[1]);
        }
        flag[i+1] = v18;
        flag[i] = v19;
    }
    for(int i = 0; i<7; i++)
    {
        for(int j = 0; j<4; j++)
             printf("%c", ((flag[i]>>8*j)&0xFF));
    }
    return 0;
}
```

先说代码一开始错的原因，flag[0]粘贴错了，将dword没有认为是uint32_t，i = 5没--，我都点想笑了

得flag{OH_I_L0VE_D3inK_Te4!!!}

也是喝上好茶了

# **3[Week2] Pyc**

前面一天由于·不小心请电脑喝水（奶茶撒电脑上）导致送修去，就去学了点python，用idle跟devc++太像了，当然也下了pycharm

算了先看题这是由python编写的程序，先将pyhthon程序拆违.pyc文件才能分析

![wp27](/Qctf/wp27.jpg)

这是pyc的程序先将其拆解(terminal操作)

```
python pyinstxtractor <file的路径>
```

![wp28](/Qctf/wp28.jpg)

这么多文件就一个叫pyc.pyc一看就是核心加密文件(terminal操作)

```
uncompyle6 <路径>
```

这里直接回推码点显然不现实，直接爆破（ascii码与码点在小于等于127史一样）

怎么判断一个数组的元素个数

```
sizeof(数组)/sizeof(数据类型)
```

```
#include<stdio.h>
int main(void)
{
    int flag[] = {0xba,0xc6,0xb0,0xbc,0x86,0x10b,0x126,0xe4,0x6a,0xc0,0x40,0x6a,0xda,0x3f,0xd2,0xe0,0x6a,0xb8,0x3f,0xd4,0xe0,0x89,0x88};
    for(int i = 0; i<23; i++)
    {
        for(int j = 48; j<127; j++)
        {
            int aa = j;
            if(aa>='a'&&aa<='z')
            {
                aa = (aa - 12) * 2 + 6;
            }
            else if('A' <= aa &&aa <= 'Z')
            {
                aa = (aa + 6) * 3 + 9;
            }
            else
            {
                aa = aa + 11;
            }
            if(aa==flag[i])
                printf("%c", j);
        }
    }
    return 0;
}
```

每个都试一下，写爆破脚本

![wp29](/Qctf/wp29.jpg)

flag{PYC_i5_v4ry_e4sy~}

# 3**题目信息** **-** **[Week2] UPX**

直接手托，好久没手托upx壳了，有点小忘记了，找scylla插件找了半天，发现就在工具栏

先编个背景故事：话说小夜魔法师在喝完茶后又到了一个新的国家，这个国家面临一个怪物，于是小夜翻看了《魔女之旅》找到欲破这类怪物必先击破其甲壳

于是小夜打开x64dbg，添加scylla插件，先将敌人罩在x64书中于是开启吟诵

先点击两下运行(f9)，去跳过一些系统代码，就到了将原内容和环境压栈的地方，在栈顶（注意一下）下访问断点之后运行，找长跳

![wp32](/Qctf/wp32.jpg)

直接到长跳的地方，就是oep（即入口点）

![wp33](/Qctf/wp33.jpg)

记着把红的删去

这样拖并没脱好（找长跳不够精确）

这里写一个方法，到eop附近一直f8直到到一个地方要输入了，这才是更精确的eop

要记住周围汇编是什么，下次步入f7,再用scylla插件就找到了

![wp34](/Qctf/wp34.jpg)

这就是对输入简单加密的密文，仅对大小写字母操作

写个c代码

![wp35](/Qctf/wp35.jpg)

```c
#include<stdio.h>
#include<string.h>
int main(void)
{
    char arry[] = "fkyd{YNek_SD_AB@ars_OKT}";
    for(int i = 0; i<strlen(arry); i++)
    {
        if(arry[i]>64&&arry[i]<=90)
        {
            for(char temp = 'A'; temp<='Z'; temp++)
            {
                if(((temp - 65 + i + 26) % 26 + 65)==arry[i])
                {
                    arry[i] = temp;
                    break;
                }
            }
        }
        if(arry[i]>96&&arry[i]<=122)
        {
            for(char temp = 'a'; temp<='z'; temp++)
            {
                if(((temp - 97 - i + 26) % 26 + 97)==arry[i])
                {
                    arry[i] = temp;
                    break;
                }
            }
        }
    }
    printf("%s", arry);
    return 0;
}
```

flag{THls_IS_NN@qik_UPX}

没想到这道题upx头还给改了

那就有必要研究一下改头了

使用010editor会有55 50 58 30（upx0,源程序）55 50 58 31（upx1，压缩的源程序和解压代码）（upx2， 保留原资源的头和未压缩的程序），接下来就是 33 2E 39 31 00（upx的版本号）55 50 58 21(upx！) 0D 09 08 0A（主版本号，副版本号，压缩等级与方式）

65 CA B4 66 Da 4A 5B A3（压缩前后hash值）EE 0B 01 00（压缩前大小，p文件）F4 23 00 00（压缩后大小）00 E0 01 00 24 00 00 20（crc校验）

# 4.**base**

爆零复爆零，爆零何奇多，何时不爆零，何时不爆零，加油吧，现在还是只会写简单题，差的还是太多了

base58是在base64上去除了比较混淆的字符（0和O，小写字母l与大写字母I，+与/）

剩下的按0~9A~Za~z排列

无法用整字节转换，所以要将一串转为base58

常见到len*138/100

这其实是len*log(256) = log(100)乘以base58所需的最大长度

![wp36](/Qctf/wp36.jpg)

先通过base58解码得user_alphabet为abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/这是变换的base64表，接下来去看base64

![wp37](/Qctf/wp37.jpg)

直接解出flag

这里又详细了解base58的字符串加密

```
 while ( leading_zeros < len )
        {
          rem = 0;
          for ( i = leading_zeros; i < len; ++i )
          {
            temp = (rem << 8) + buffer[i];
            buffer[i] = temp / 58;
            rem = temp % 58;
          }
```

每次内层循环都更新leading_zeros~到数组最后一个元素的数并用于下一次的循环再while循环中每次循环都会让bufer数组内容变换，并将for循环数组的对应首元素置零

# 5.floweer

在被vnctf和lilactf爆零后我又回来了，这道题将画指令直接写到脸上了，还没有壳

太亲切了，先回忆一下花指令的类型：（1）无用指令（2）直接跳转（3）间接跳转（例如 jump eax）（4）指令服用（5）破坏栈平衡

![wp38](/Qctf/wp38.jpg)

是直接跳转

![wp40](/Qctf/wp40.jpg)

栈并非平衡，call相当于push+jump，retn相当于pop+jump

很多花从下到上的有jump loacal166666+1

enc函数也有花指令，遇见数字不要想别的直接c+force（大概率是汇编代码）

![wp40](/Qctf/wp41.jpg)

修好后大概这个样子

```
_int64 __fastcall sub_14000150B(__int64 p_input)
{
  unsigned int i; // [rsp+Ch] [rbp-4h]

  for ( i = 0; *(_BYTE *)((int)i + p_input); ++i )
    ;
  return i;
}
```

这个是找出\0也就是最后字符串末尾的下标

加密就是tea加密

解密代码我给整没了

简单来说关键就是key0x1234567,0x89ABCDEF,0xFEDCBA98,0x76543210要使用小端序

关键deenc((uint32_t *)&ans[8\*j], key);

![wp42](/Qctf/wp4.jpg)

得到如上flag

# 6.rc4（对称加密）

rc4加密作为流加密，核心加密就是简单的异或，所以有以下方法

具体操作

(1)输入后，将输入patch修改为密文

![wp43](/Qctf/wp43.jpg)

打断点后点击data右键patch-change bytes（选中第一个字节）将输入修改为密文

然后在加密后面下断点就得到了明文

(2)写出密钥生成流/直接dump出密钥，然后让密文异或密钥，这道题有些特殊还多了一个k

```
#include<stdio.h>
#include<stdint.h>
int main(void)
{
    uint8_t data[] = {0xA0,0x2,0x2A,0x97,0x17,0x56,0xDA,0xA9,0x50,0xAC,0x1B,0x4E,0x8C,0xE4,0xB4,0x35,0xF5,0x39,0xC9,0x4A,0xCC,0x9B,0x58,0xAF,0xA,0x2C,0x12,0x31,0x0};
    uint8_t s[28];
    for(unsigned int i = 0; i<=27; i++)
    {
        s[i] = 0x31^i^data[i];
    }
    uint8_t data1[] = {0xF7,0x5F,0x7A,0xC1,0x5D,0x34,0xDB,0xD6,0x2F,0xD8,0x75,0x2D,0xDE,0xE1,0xDA,0x68,0xE0,0x57,0x9B,0x4A,0xCE,0xEA,0x7,0xF9,0x5E,0x79,0x5E};
    for(unsigned int i = 0; i<=27; i++)
    {
        data1   [i] = data1[i] ^ s[i] ^ i;
    } 
    for(unsigned int i = 0; i<=27; i++)
    {
        printf("%c", data1[i]);
    }
}
```

得到flag{S0NNE_Rc4_l$_c13@nged}

# 7.**螺旋密码机**

![wp44](/Qctf/wp44.jpg)

调用lib库，太好了是native也就是so层逆向

这道题一开始没什么思路

先看if条件的条件

![wp45](/Qctf/wp45.jpg)

正如其名，上面是生成数列，下面是计算得到的结果与3137相同都是十分麻烦的

返回原程序，发现decrptflag是解密代码直接看解密

由于a3并不知道所以要爆破

```
temp = [0xEE,0xE4,0xE9,0xEF,0xF3,0xCC,0xF1,0xE6,0xBC,0xE5,0xB9,0xEB,0xD7,0xC4,0xB8,0xBC,0xEC,0xBB,0xFA,0xD7,0xC5,0xBC,0xFB,0xFC,0xBB,0xFA,0xF5]
for i in range(0, 256):
    pt = bytes([(j^0x42^3137&0xFF^i)&0xFF for j in temp])
    if all(32<=c<=127  for c in pt):
        st = pt.decode("ascii")
        if st.lower() == "flag" or "{" in st:
            print(i, st)
```

```
130 oehnrMpg=d8jVE9=m:{VD=z}:{t
131 ndiosLqf<e9kWD8<l;zWE<{|;zu
132 icnhtKva;b>lPC?;k<}PB;|{<}r
137 dnceyF{l6o3a]N26f1p]O6qv1p
139 flag{Dyn4m1c_L04d3r_M4st3r}
141 `jga}Bh2k7eYJ62b5tYK2ur5t{
145 |v{}a^ct.w+yEV*.~)hEW.in)hg
147 ~tyc\av,u){GT(,|+jGU,kl+je
148 ys~xd[fq+r.|@S/+{,m@R+lk,mb
150 {q|zfYds)p,~BQ-)y.oBP)ni.o`
151 zp}{gXer(q-CP,(x/nCQ(oh/na
156 q{vplSny#z&tH['#s$eHZ#dc$ej
157 pzwqmRox"{'uIZ&"r%dI["eb%dk
158 sytrnQl{!x$vJY%!q&gJX!fa&gh
```

得到flag{Dyn4m1c_L04d3r_M4st3r}

week2逆向结束
