---
title: wp
date: 2025-12-21 21:34:52
tags: reverse
toc: true
toc_depth: 5
---

# MOECTF

#  如何上传图片

将图片文件夹放在source文件夹下面，一定不要与文件名字一样，

之后mark语法即可(赞美徐✌)

# 1.upx_revange

![wp1](/mywp/wp1.jpg)

显然上面版本号下面0D将upx！扣掉

加上55 50 58 21（upx！）通过编辑中的插入字节

之后 upx -d脱壳0

lY7bW=\\ck?eyjX7]TZ\\}CVbh\\tOyTH6>jH7XmFifG]H7明显为密文

sub_7FF6F2A61000直接就是base64标准表

![wp2](/mywp/wp2.jpg)

Block = ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_;

![wp3](/mywp/wp3.jpg)

这个block是指针，指向的偏移地址就是base64表

  t = *ptr ^ 0xE;证明base64异或0xe之后进行base64加密

OLMJKHIFGDEBC@A^_\]Z[XYVWTolmjkhifgdebc`a~|}z{xyvwt>?<=:;8967%!这是标准base64表异或然后加密的结果

这里插一句一开始让ai干的结果生成的新的base64表示错的，导致否定了这个正确的思路，又整了半天

![wp4](/mywp/wp4.jpg)

这已经能看见flag的形状，那为什么不对呢， 因为这是字符串其中\\表示\

得出答案moectf{Y0u_Re4l1y_G00d_4t_Upx!!!}
# 2**ezandroid.pro**

![wp5](/mywp/wp5.jpg)

这里补充一下看s0文件先导入c头文件，之后将第一个参数结构体变为JNEVN

这里有loadlib加载native库，这一看就是用ida看so文件

![wp6](/mywp/wp6.jpg)

着长长的东西一看就是密文

sm4Encrypt是sm4加密

这里我浅浅的看一下sm4加密的原理

sm4是分组加密，一组明文（128位，16字节，4字）（X0,X1,X2,X3）

密钥（128位，16字节，4字）

得到的密文也是（128位，16字节，4字）

加密32次轮迭代，1次反序变换

<1>32次轮加密

每轮要1字，轮函数接受4字密文与1字密钥

接着x4 = F（x0， x1, x2, x3, rk0）

​          x5 = F(x1, x2, x3, x4, rk)以此类推得到36个字

<2>一次反序变换

​    将得到的sm4最后4个字反序

​    (Y0,Y1,Y2,Y3) = (X35, X34, X33, X32)

回到这个题moectf2025!!!!!!（4字）一看就是密钥

这里没看见iv（参见明文中）

这里猜一下是标准用ecb（电子密码本）：使用同一密钥，无iv

raw（不做任何处理）当时做时选的hex没选raw导致flag全变为16进制的

![wp7](/mywp/wp7.jpg)

moectf{SM4_Android_I5_Funing!!!}

# **rusty_sudoku**（数独）（moectf的逆向终章）

我一开始并不知道数独是什么，前了解一下数读为9乘以9（每个3乘以3不重复）一行一列全含1-9
![wp8](/mywp/wp8.jpg)

这***一看就是数独原来的棋盘找个求解器
![wp9](/mywp/wp9.jpg)

导入数据‘.’换为0

然后
![wp10](/mywp/wp10.jpg)

有个细节一定要打断点再输入，否则直接关了

# <2>?ctf（排序规则先week的reverse再misc）（本文仅week1）

# Reverse

# 1**PlzDebugMe**

![wp11](/mywp/wp11.jpg)

开局找main函数，然后并没找到main函数，这说明他在藏，直接（shift+f12）找字符串，定位到相应区域

![wp12](/mywp/wp12.jpg)

![wp13](/mywp/wp13.jpg)

简单的异或，所以只要将密文当输入，再异或，就可知明文

这里的条件很麻烦，存在两步验证，这里可以绕过条件(其实简单法是change bytes, 密文当输入patch进去)(本方法是绕过+找密钥)

![wp14](/mywp/wp14.jpg)

显然是要比较的，jz要cmp返回值全为0

这里直接修改第一个jnz为jmp loc_401735，直接将改为必然

```
sub_401648(123456);
  for ( n31 = 0; n31 <= 31; ++n31 )
  {
    byte_415060[n31] = sub_40167D((unsigned __int8)byte_415060[n31]);
    if ( byte_415060[n31] != byte_410020[n31] )
    {
      sub_40160C("Pity! Wrong flag!\n");
      return 0;
    }
  }
```

这里由于其为1个1个比较，本体解题思路是提取通过加密后的到密文与input异或得密钥，然后与标准密钥异或的明文

这里一个个比较只要有一个不对就退出，那我就让其恒等就行这里由于其为1个1个比较，本体解题思路是提取通过加密后的到密文与input异或得密钥，然后与标准密钥异或的明文

![wp16](/mywp/wp16.jpg)

对着条件中的！按tab键，将jz改为jmp

![wp17](/mywp/wp17.jpg)

一定要再patch后应用到原文件，要不然原来的程序并不会进行修改，动调就会失败（ida在进行分析时是对复制产生的文件分析，而非原文件）

![wp18](/mywp/wp18.jpg)

摘取加密的密文，接下来该找flag加密成的密文

对for循环按tab
![wp19](/mywp/wp19.jpg)

因为for循环原来就是比较(比较的dl为byte_415060为input加密)

offset byte_410020这是flag加密成的密文的偏移地址

找到flag加密成的密文

```
#include<stdio.h>
int main(void)
{
    char ew[] = {0xC,0xD,0xF1,0x73,0xCE,0xE6,0x60,0x80,0x5,0xC1,0xF1,0x4,0x4D,0xA8,0x44,0x43,0x1C,0x95,0x84,0xC8,0x20,0x9C,0x8F,0x3,0xD5,0xD1,0x97,0x34,0xBD,0xBF,0xC5，0x7A};
    char e[] = "1111111111111111111111111111111111111111111111111111111111111111111111111";
    char temp[32] = {0};
    char c[32] = {0x5B,0x50,0xA1,0x25,0x84,0x8E,0x61,0xC4,0x6B,0xBB,0xAE,0x5,0xB,0xC6,0x3D,0x42,0x5A,0xFB,0xC1,0xC9,0x4E,0xE9,0x8D,0x50,0x91,0x87,0x87,0x24,0xAD,0xAF,0xD5,0x36};
    for(int i=0; i<32; i++)
    {
        temp[i] = ew[i]^e[i];

        printf("%c", temp[i]^c[i]);
        
    }
 }
```

结果为flag{Y0u_Kn0w_H0w_t0_D3bug!!!!!}

![wp21](/mywp/wp21.jpg)

# 2**ezCSharp**

用ida看

![wp22](/mywp/wp22.jpg)

这很抽象，并且用字符串查找什么都没有

看函数名EncodedFlagAttribute__get_EncodedValue	 EncodedFlagAttribute__.ctor	seg000	 FlagContainer__.ctor	 Program__Main	 Program__DecodeFlag	 Program__.ctor	 Program__.cctor

使用__（双下划线）很明显是c#/.net命名原则.ctor（实例构造函数）/.cctor（静态构造函数）

首先寻找main函数，也就是入口点

![wp25](/mywp/wp25.jpg)

这附件直接给了入口点，进入发现文件的主题逻辑

flag Container里

![wp26](/mywp/wp26.jpg)

找到密文

之后找到解密函数

```
private static string DecodeFlag(string encoded)
	{
		char[] array = encoded.ToCharArray();
		for (int i = 0; i < array.Length; i++)
		{
			char c = array[i];
			char c2 = c;
			if (c2 != '!')
			{
				switch (c2)
				{
				case 'a':
					array[i] = 'z';
					break;
				case 'b':
				case 'c':
				case 'd':
				case 'e':
				case 'f':
				case 'g':
				case 'h':
				case 'i':
				case 'j':
				case 'k':
				case 'l':
				case 'm':
				case 'n':
				case 'o':
				case 'p':
				case 'q':
				case 'r':
				case 's':
				case 't':
				case 'u':
				case 'v':
				case 'w':
				case 'x':
				case 'y':
				case 'z':
					array[i] -= '\u0001';
					break;
				}
			}
			else
			{
				array[i] = '_';
			}
		}
		return new string(array);
	}
```

很明显是类似于凯撒加密

\u0001（\u后跟4个16进制）表示unicode字符，通常写作U+0001（码点），一个码点对应一个字符，这里强制类型转换为整型

```
#include<stdio.h>
#include<string.h>
int main(void)
{
    char array[] = "D1ucj0u!tqjwf!fohjoffsjoh!xj!epspqz!ju!gvo!2025"; 
    for (int i = 0; i < strlen(array); i++)
		{
			
			if (array[i] != '!')
			{
				switch (array[i])
				{
				case 'a':
					array[i] = 'z';
					break;
				case 'b':
				case 'c':
				case 'd':
				case 'e':
				case 'f':
				case 'g':
				case 'h':
				case 'i':
				case 'j':
				case 'k':
				case 'l':
				case 'm':
				case 'n':
				case 'o':
				case 'p':
				case 'q':
				case 'r':
				case 's':
				case 't':
				case 'u':
				case 'v':
				case 'w':
				case 'x':
				case 'y':
				case 'z':
					array[i] -= 1;
					break;
				default :
					 break;
				}
			}
			else
			{
				array[i] = '_';
		    }

	
}
   printf("%s", array);
   return 0;
}
```

运行得D1tbi0t_spive_engineering_wi_doropy_it_fun_2025（套上flag{}就是正确flag）

# 3.ezcalculate

![wp28](/mywp/wp28.jpg)

打断点是加密的逻辑

很明显先加上再异或之后减去key

逆回去就是先加再异或再减；

这样我们将密文当输入输进去

![wp29](/mywp/wp29.jpg)

![wp30](/mywp/wp30.jpg)

注意要对齐第一个输入的元素按change byte

如果多选了地址就不是修改数据了

之后的

![wp32](/mywp/wp32.jpg)

当然由于有长度限制导致输入少了一个

这里还是写了个解密代码

```
#include<stdio.h>
#include<string.h>
int main(void)
{
    unsigned char decrpty[] = {0x33, 0x1D, 0x32, 0x44, 0x2A, 0x54, 0x45, 0x2C,0x2E, 0x74, 0x8C, 0x4B, 0x40, 0x42, 0x43, 0x73,0x71, 0x82, 0x24, 0x35, 0x10, 0x00, 0x00, 0x00,0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
    char key[] = "wwqessgxsddkaao123wms";
    for(int i = 0; i<strlen(decrpty); i++)
    {
        decrpty[i] += key[i%strlen(key)];
        decrpty[i] ^= key[i%strlen(key)];
        decrpty[i] -= key[i%strlen(key)];
    }
    printf("%s\n", decrpty);
    return 0;
}
```

flag{Add_X0r_and_Sub}

# 4 **jvav**

这题是安卓逆向（差个闲话，ciscn打了半天结果没做出什么题来，感觉还是差很多，什么时候才能成为逆向大魔法师）

![wp33](/mywp/wp33.jpg)

注意这main函数是被 compiled（编译） from: MainActivity.kt

这个main什么都没有，这时就要去翻源码找MainActivity.kt

看com.example.jvav.MainActivity（mainfext.xml下面的）找com文件夹下面的example.xml（我找了半天才注意到这个映射关系）

转到MainActivity.kt

![wp34](/mywp/wp34.jpg)（接下来是解密)（这里的checker一看就是检验条件，逆向中的检验条件一定要注意)

写解密代码Base64，(~((input[i] + 32) ^ 11)); bArr[i] = input[(i + 5) % input.length];

密文{-89, 96, 102, 118, -89, -122, 103, -103, -125, -95, 114, 117, -116, -102, 114, -115, -125, 108, 110, 118, -91, -83, 101, -115, -116, -114, 124, 114, -123, -87, -87, -114, 121, 108, 124, -114};

```c
#include<stdio.h>
#include<stdint.h>
int main(void)
{
    int8_t bArr[] = {-89, 96, 102, 118, -89, -122, 103, -103, -125, -95, 114, 117, -116, -102, 114, -115, -125, 108, 110, 118, -91, -83, 101, -115, -116, -114, 124, 114, -123, -87, -87, -114, 121, 108, 124, -114};
    int8_t input[37];
    for(int i = 0; i<36; i++)
    {
        input[i]  = bArr[(i+36-5)%36];

    }
    for (int  i = 0; i < 36; i++)
    {
        input[i] = ~(input[i]^11)-32;
    }
    input[37] = '\0';
    printf("%s\n", input);
    
}
```

得到的结果为ZmxhZ3trb3RsMW5faXNfYWxzb19qYXZhfQ==

直接cyberchef

![wp35](/mywp/wp35.jpg)

 

# 5**rand**

rand在c语言中是生成伪随机数的函数，为什么是伪随机数呢，因为是由固定公式算出的，而srand是种子生成函数，生成种子由rand函数生成随机数

![wp36](/mywp/wp36.jpg)

这找到srand_w找到seed

 这道题我一开始写出代码怎么运行都是乱码，看了官方wp才知道这与windows系统与linux系统c库差异导致，

接着我用detect it easy看了一下

![wp38](/mywp/wp38.jpg)

是elf文件（linux）pe文件（windows）



#  <插入>如何使用vscode远程连接wsl以在windows系统中进行linux系统下的c编程

在wsl中进行命令行操作

```
 sudo sshd -T | grep port
```

 这是去检验有无ssh的配置文件（如果找不到配置文件要进行接下来的操作）

```
sudo apt install openssh-server -y          # Ubuntu/Debian
```

```
sudo yum install openssh-server               # Ubuntu/Debian
```

这两个都是下载ssh（安全外壳协议）

之后

```
 sudo sshd -T | grep port
```

这是他会爆出来   /xxx/xxx（我的是/run/sshd）

接下来提升一些权限

```
sudo mkdir -p /run/sshd               （创建文件夹，自动创建不存在的父目录）
sudo chmod 0755 /run/sshd
sudo chown root:root /run/sshd
```

 接下来查端口

```
 sudo sshd -T | grep -i port
```

一般都是都是port 22这一默认端口

```
sudo service ssh start
```

```
sudo service ssh status               //查看当前状态
```

```
sudo ss-tlnp | grep sshd               //检验是否监听端口成功
```

vscode要下扩展remote - ssh  + remote - development + remote exploer

之后在远程资源管理器上点击ssh那个配置文件.ssh->config添加

```
 Host wsl-local
    HostName localhost
    User 你自己的用户名
    Port 22
```

之后要将c文件放在linux文件下面我是在linux -> unbtun->home->我的用户名—>

运行后

```
#include<stdio.h>
#include<stdlib.h>
int main(void)
{
    srand(12345);
    int temp[539];
    for(int i = 0; i<539; i++)
    {
        temp[i] = rand();
    }
    char ar[27] = {0x5A,0x66,0x86,0xCE,0x46,0x23,0x75,0x30,0x18,0x6F,0x5B, 0x7D,0x4D,0x4F,0xF7,0xC4,0x4A,0xD,0x45,0xAE,0x36,0xEF,0x6B,0x81,0xC1,0x82,0x03};
    int num = 538;
    for(int i = 26; i>=0; i--)
    {
        ar[i] ^= (unsigned char)temp[num--];
    }
    for(int i = 0; i<256; i++)
    {
        int v6 = temp[num--]%27;
        int v5 = temp[num--]%27;
        char yln;
        yln = ar[v6];
        ar[v6] = ar[v5];
        ar[v5] = yln;
    }
    for(int i = 0; i<27; i++)
        printf("%c", ar[i]);
}

```

![wp37](/mywp/wp37jpg.jpg)

逆向的week1这就解完了，时间很快，转眼2025年就要结束了，马上就要2026年了，现在我距离逆向大魔法师还差很远，仍需努力啊
