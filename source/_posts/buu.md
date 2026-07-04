---
title: buu
date: 2026-01-27 10:43:02
tags: reverse mis buu
---

# 魔法师的逆向之旅

#  1.revese2

一道简单的字符替换

# 2.内涵的软件

DBAPP{49d3c93df25caad81232130f3d2ebfad}

我还以为有什么加密，结果找半天没找着，直接将DBAPP改为flag就过了

# 3.新年快乐

打开一看内容很少，查壳，为upx壳

# 4.xor



```
#include<stdio.h>
int main(void)
{

​     char arry[] = {0x66,0xA,0x6B,0xC,0x77,0x26,0x4F,0x2E,0x40,0x11,0x78,0xD,0x5A,0x3B,0x55,0x11,0x70,0x19,0x46,0x1F,0x76,0x22,0x4D,0x23,0x44,0xE,0x67,0x6,0x68,0xF,0x47,0x32,0x4F,0x0};
​    //char arry[] = "f\nk\x0cw&O.@\x11x\rZ;U\x11p\x19F\x1fv\"M#D\x0eg\x06h\x0fG2O\x00";
​    for(int i = 32; i>=1; i--)
​    {
​        arry[i]^= arry[i-1];
​    }
​    printf("%s", arry);
​    return 0;
}
```

注意一下\x19F\x会匹配之后紧跟的16进制数直到第一个非16进制数，所以还是直接粘贴对应的16进制ascii码

# 5.reverse3

ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=（base64）

```
#include<stdio.h>
#include<string.h>
int main(void)
{
    char temp[] = "e3nifIH9b_C@n@dH";
    for(int i = strlen(temp)-1; i>=0; i--)
    {
        temp[i] -=i;
    }
    printf("%s", temp);
}
```

之后cyberchef

# 6.helloword

简单的android逆向，正好最近也在学anroid逆向

直接去androidmainfest找清单文件，然后进入主程序

# 7.不一样的flag

确实不太一样，这道题看了wp才明白

```
puts("1 up");
puts("2 down");
puts("3 left");
printf("4 right\n:");
```

这种上下作于一看就是迷宫，这就去找迷宫为何

*(_DWORD *)&_11110100001010000101111__[25]掌握上下

v4左右，一开始均置为0，掌左右为纵坐标

![1](/buuctf/1.jpg)

看这个判断的49这是'1'的ascii码，也就是1不可走，#结束

5 * *(_DWORD *)&_11110100001010000101111__[25] - 41 + v4

这是5*纵坐标，这说明宽度为5，也刚好5乘5

*1111

01000

01010

00010

1111#

所以为222441144222就得到结束

# 8.SimpleRev

![2](/buuctf/2.jpg)

v11 = __readfsqword(0x28u)：读取线程局部存储（TLS）中的金丝雀值（canary），用于检测栈溢出攻击。(有栈溢出，canary会修改)

这道题的关键是大小端序

 text = join((const char *)key3, (const char *)s_);// "kills"
  strcpy(key, key1);                            // "ADSFK"
进去看的data由于是字符串所以不存在端序问题，按d将其变为data后就会出现小端序

  *(_QWORD *)src = 'SLCDN';

_QWORD s_[2]虽然输入的是字符串，但均转为8字节的数据，也均使用小端序存内存中是NDCL

text为密文（根据if ( !strcmp(text, str2) )
    puts("Congratulation!\n");）

text是killshadow

密钥为ADSFKNDCL

```
for ( i = 0; i < v7; ++i )
  {
    if ( key[v5 % v7] > 64 && key[v5 % v7] <= 90 )
      key[i] = key[v5 % v7] + 32;
    ++v5;
  }
```

这一看就是就是大小写转换

```
if ( char <= 96 || char > 'z' )
      {
        if ( char > '@' && char <= 'Z' )
        {
          str2[v4] = (char - 39 - key[v5 % i_1] + 97) % 26 + 97;
          ++v5;
        }
      }
      else
      {
        str2[v4] = (char - 39 - key[v5 % i_1] + 97) % 26 + 97;
        ++v5;
      }
```

所以解密就是

```
#include<stdio.h>
#include<string.h>
#define base58_size 58
int main(void)
{
    char arry[] = "killshadow";
    char key[] = "adsfkndcls";
    int temp;
    for(int i = 0; i<strlen(arry); i++)
    {
        temp = arry[i] - 97;
        printf("%d ", temp);
    }
    printf("\n");
    for(int i = 0; i<strlen(key); i++)
    {
        temp = -key[i] + 97 - 39;
        printf("%d ", temp);
    }
    return 0;
}
#include<stdio.h>
int main(void)
{
	int arry[] = {10 ,8 ,11 ,11 ,18 ,7 ,0 ,3 ,14 ,22 };
    int temp[] = {-39, -42, -57, -44, -49, -52, -42, -41, -50, -57};
	for(int i = 0; i<10; i++)
	{
	for(char num = 'A'; num<='Z'; num++)
		{
			if(arry[i] == (num+temp[i])%26)
			{
				      printf("%c", num);
		           
			}
		}
	
	}
}
	
```

stract函数仅是关心内存中存的值，其他的并不关心

## 查看小端序方法

(1)deteceasy中LE小端序，BE大端序

(2)将数值赋给字符串

(3



      temp(void)
      {int num = 1;
       return (*(char*)&num == 1); // 1为小端序，0为大端序
        }



(4)小端序：x86/AMD64 架构（Windows/Linux）、ARM 架构

​     大端序：网络协议、Java 字节码、部分嵌入式系统（如 PowerPC）PNG 为大端序

#  9.[GXYCTF2019]luck_guy1

程序有个伪随机数生成，所以有固定顺序

```
#include<string.h>
#include<tsdio.h>
int main(void)

{

  char arry[] = {0x69, 0x63, 0x75, 0x67, 0x60, 0x6F, 0x66, 0x7F};

  for(int i = 0; i<=7; i++)

  {

    if(i%2==1)

      arry[i] -= 2;

   else 

      arry[i]--;

  }

  for(int i = 0; i<=7; i++)

     printf("%c", arry[i]);

}
```

得到hate_me}

# 10.Java逆向解密

注意的是^优先级低于-

# 11. JustRE

sprintf(char * buffer, const char * format,  )

例如sprintf(buffer, "Age: %d, Height: %.2f", age, height);
不想python中的格式字符串"%d", 3

# 12.刮开有奖

一开始没有思路，这道题的加密挺复杂的，想打断点调试的发现直接运行程序后根本不经过断电所在的程序，看了网上的wp后豁然开朗

又是刮开无奖

```c
 v7[0] = 90;
      v7[1] = 74;
      n_S_ = 83;
      n_E_ = 69;
      n_C_ = 67;
      n_a_ = 97;
      n_N_ = 78;
      n_H_ = 72;
      n_3_ = 51;
      n_n_ = 110;
      n_g_ = 103;
```

这一看就是字符串

紧跟着 sub_9110F0(v7, 0, 10);
这里使用了直接将代码粘贴到

```c
#include<stdio.h>
#include<stdint.h>
int sub_9110F0(uint8_t *a1, int nuberis0, int n10)
{
  int n10_1; // eax
  int n10_2; // esi
  int n10_3; // ecx
  int v6; // edx

  n10_1 = n10;
  for ( n10_2 = nuberis0; n10_2 <= n10; nuberis0 = n10_2 )
  {
    n10_3 = n10_2;
    v6 = a1[n10_2];
    if ( nuberis0 < n10_1 && n10_2 < n10_1 )
    {
      do
      {
        if ( v6 > a1[n10_1] )
        {
          if ( n10_2 >= n10_1 )
            break;
          ++n10_2;
          a1[n10_3] = a1[n10_1];
          if ( n10_2 >= n10_1 )
            break;
          while ( a1[n10_2] <= v6 )
          {
            if ( ++n10_2 >= n10_1 )
              goto LABEL_13;
          }
          if ( n10_2 >= n10_1 )
            break;
          n10_3 = n10_2;
          a1[n10_1] = a1[n10_2];
        }
        --n10_1;
      }
      while ( n10_2 < n10_1 );
    }
LABEL_13:
    a1[n10_1] = v6;
    sub_9110F0(a1, nuberis0, n10_2 - 1);
    n10_1 = n10;
    ++n10_2;
  }
  return n10_1;
}
int main(void)
{
    char temp[12] = "ZJSECaNH3ng";
    sub_9110F0(temp, 0, 10);
    printf("%s\n", temp);
}
```

直接将解密解出，下面就是标准的base64加密

```c
 v18[0] = String[5];
      v18[2] = String[7];
      v18[1] = String[6];
      v4 = sub_911000((int)v18, strlen(v18));
      memset(v18, 0, 0xFFFFu);
      v18[1] = String[3];
      v18[0] = String[2];
      v18[2] = String[4];
 if ( String[0] == v7[0] + 34
        && String[1] == n_C_
        && 4 * String[2] - 141 == 3 * n_S_
        && String[3] / 4 == 2 * (n_H_ / 9)
        && !strcmp(v4, "ak1w")
        && !strcmp(v5, "V1Ax") )
      {
        MessageBoxA(hDlg, "U g3t 1T!", "@_@", 0);
      }
    }
```

这下知道v4与v5的原来是什么，当然注意v4与v5被赋值的字符串下标的顺序

# 13.maz

这道题是要找到迷宫怎么样

上线及看见upx壳

```python
maze = '*******+********* ******    ****   ******* **F******    **************'
end = maze.index('F')
end_x = 5
end_y = 4
width = (end-end_x)//end_y
length = len(maze)//width
for i in range(length):
    print(maze[(width*i):(width * (i+1))])

```

