---
title: miscwp
date: 2025-12-31 14:34:06
tags: misc wp
---

#  qctfweek1(misc)

# **1《关于我穿越到CTF的异世界这档事:序》**

我是逆向手，这里顺带做点misc，可能有些菜

也是看到题就蒙了

看了官方wp才知道是base64隐写

什么是base64隐写

先说base64加密吧，base64是将3字节（3乘8位）变为（4*6位）

那么这就给了可乘之机

A的二进制为010000 01

这样base64加密为010000    01000000 000000 000000

   对应base64表         Q               Q              =                 =             

这里看第二个q我把010000改成011000其并不会影响base解密

而其多的那些就是隐写字符

当然我现在只会c语言，不会python，然后用了官方wp的python脚本

```
import base64
def get_diff(s1, s2):
   base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
   for i in range(len(s2)):
       if s1[i] != s2[i]:
           return abs(base64chars.index(s1[i]) - base64chars.index(s2[i]))
   return 0
def decode_base64_stego(file_path):
   with open("yileina.txt", "rb") as file:
       lines = file.readlines()
       binary_str = ""
       for line in lines:
           stego = line.decode("utf-8").strip()
           realtext = base64.b64encode(base64.b64decode(stego)).decode("utf-8")
           diff = get_diff(stego, realtext)              //接受差值
           padding_count = stego.count('=')
           if diff:
               binary_str += bin(diff)[2:].zfill(padding_count * 2)
           else:
               binary_str += '0' * (padding_count * 2)

       hidden_message = ''.join([chr(int(binary_str[i:i+8], 2)) for i in range(0, len(binary_str), 8)])
       print("隐藏信息:", hidden_message)

if __name__ == "__main__":
   decode_base64_stego("flag.txt")
   
```

 with open("yileina.txt", "rb") as file:中的"yileina.txt"（伊雷娜）要改成你的那个放到的文本

虽然不会写吧，但我大概说一下了逻辑

1 打开base64所在的文件，然后以而二进制形式只读（一行行）

2 计算隐写字符与正常base64加密的差值（base64隐写并不影响文件的base64解密）

3 转换为二进制串，并按8位分割还原为ascii码

4 得到隐写信息

![wp1](/misc/wp1.jpg)

?CTFmisc

接着看base8（编码位数为3）

用网站解失败了（直接改官方wp的代码，这里不知为什么直接粘贴总有错让ai修改一下就好了）

```
def base8_custom_decode(cipher_text, alphabet):
    mapping = {ch: i for i, ch in enumerate(alphabet)}
    bits = ''.join(f"{mapping[ch]:03b}" for ch in cipher_text if ch in mapping)
    bytes_list = [int(bits[i:i+8], 2) for i in range(0, len(bits), 8) if len(bits[i:i+8]) == 8]
    return bytes(bytes_list).decode(errors="ignore")

if __name__ == "__main__":
    alphabet = "?CTFmisc"  # 直接固定字母表
    cipher = "Tsmssic?FT?ii?sFFi?iTimCTC?mcCmsTiTmmCCCFs?sCCiiTFTcmCmFTCscFicTTs?ciC?TFFTim?s?TTmsmCmFCmmiFCmsTFTimCCsFCmiTicTT?msFCTTTs?c??ssFCmi?mciCcT====="
    result = base8_custom_decode(cipher, alphabet)
    print("解密结果：", result)
```

得到ZmxhZ3tUaDNfUHIxbmMxcGwzXzBmX0Jhc2VfMXNfUzBfRXp6fQ==（典型base64加密，cyberchef直接用）

得到flag{Th3_Pr1nc1pl3_0f_Base_1s_S0_Ezz}

# 2**[Week1] 俱乐部之旅(1) - 邀请函**

![wp3](/misc/wp3.jpg)

一开始由于我将zip解压缩软件全删了，然后直接解压，见到要输入密码然后直接什么都不知到了，之后看官方wp，在描述中有掩码，由于我没有zip解压缩软件，然后就一直找不到描述，一开始才在题目描述中，现在看来还是太蠢了（后来用bandizip打开）

接着我了解了一下掩码爆破（知道部分密码?表示占位符）

c5im????是掩码，接下来爆破用archpr

得到口令c5im8467（一定要选所有可打印字符否则爆不出来）

接下来解开压缩包的密码发现什么，我正文呢，这是大概率是要更换字体颜色才显示正文

![wp4](/misc/wp4.jpg)

先看第一部分重要内容在注释，我一开始去文件夹中对文件右键找属性，但显然这是不对的，因为我什么都没找到

![wp5](/misc/wp5.jpg)

这才是正确操作

得到标准ASCII码使用‌7位二进制数‌表示字符（cyberchef启动）还有注释

![wp6](/misc/wp6.jpg)

flag{W0rd_5t3g_is_1z

不豪又是拼装

![wp7](/misc/wp7.jpg)

奥秘藏在正文中，XML为基础并以ZIP格式压缩的电子文件规范（关键）Office Open XML含.docx；.pptx；.xlsx

改名将docx改为zip，解压缩

![wp8](/misc/wp8.jpg)

一开始以为是加密，结果就是简单字符串，还是太菜了

得到&Welc0me_t0_th3_c5im_C1ub}

#  3不好有黑客

这是pcapng（packet Caputrue next generation），保存数据包的一种形式，有网络、硬件、操作系统等信息。（最近在备考期末，好久没打ctf了，现在手感冰凉，所以只做个misc），这明显是抓包，但是作为misc的菜鸟（我是路边夜），显然并不知道该怎么做就看到flag.zip

算了还是备考期末去了，等我考完再写

期末结束了也是回来学安全了

这是道流量分析题，先学了一下前置只是

其忘关上http协议，http本质上是明文传输这就很不安全，https才是加密的

在期末备考期间闲的没事是就翻大佬的blog，大佬没还是tql，距离大佬还是很远

先说流量分析吧，先要了解网络协议（tcp（3次握手4次告别），http协议（明文传输，要注意请求方式get（获取数据），udp（无连接，不可靠）），之后是wireshark软件的使用

![wp9](/misc/wp9.jpg)

直接找http协议的get请求

![wp10](/misc/wp10.jpg)

追踪http流，得到?CTF2025这很可能就是密码

![wp11](/misc/wp11.jpg)

这界面就可以看出来（上面是http请求，中间是http响应，下面就是数据）

上下翻动流这是乱码阿，一看就是显示的语言不对

直接转换为源代码，打开010editor，将最下面哪个是文本内容以导入到16进制文本中

![wp12](/misc/wp12.jpg)

注意ctrl+shirft+v（导入成源码）ctrl+v（导入成文本），之后再导入zip模板（因为原来就是flag.zip）

输入前面得到的密码

得到flag{Wireshark_1s_4wes0m3}

# 4 **[Week1] 文化木的侦探委托(一)**

图片隐写

先写一下.jpg文件的魔法数字，89 50 4E 47 0D 0A 1A 0A

89检验是否8位编码，减少误认为jpg文件的机会

50 4E 47 PNG的ascii码

0D 0A dos风格的换行符

1A 在DOS命令行下，用于阻止文件显示的文件结束符

0A：Unix风格的换行符，用于Unix-DOS换行符的转换

我一开始次猜测是要该长宽 

看提示（这里的zip文件前往不要像我一样经常逆向题直接解压缩包，misc很多提示都写在注释中）

![wp13](/misc/wp13.jpg)

这里提示折叠，就是要改图片的长宽

![wp14](/misc/wp14.jpg)

这就需要crc（循环冗余检验）（相当于数据身份）（长度与宽度均有自己的字节）

```python
import os
import binascii
import struct

crcbp = open("photo.png", "rb").read()  # 打开图片
crc32frombp = int(crcbp[29:33].hex(), 16)  # 读取图片中的CRC校验值
print(crc32frombp)

for i in range(4000):  # 宽度1-4000进行枚举
    for j in range(4000):  # 高度1-4000进行枚举
        data = crcbp[12:16] + \
               struct.pack('>i', i) + struct.pack('>i', j) + crcbp[24:29]
        crc32 = binascii.crc32(data) & 0xffffffff
        # print(crc32)
        if (crc32 == crc32frombp):  # 计算当图片大小为i:j时的CRC校验值，与图片中的CRC比较，当相同，则图片大小已经确定
            print(i, j)
            print('hex:', hex(i), hex(j))
```

通过crc找出原来的长宽

运行结果
3606542166（crc校验值）
3456 2600（宽*高）
hex: 0xd80 0xa28

其实就是宽3456高2600原图高明显少了，这里要通过010editor修改

第二行前4位是宽度后4位是高度

![wp15](/misc/wp15.jpg)

红色地方就为修改的地方，也是见到了庐山真面目

提示是颜色信道用StegSolve

java -jar "C:\用户名\Downloads\Stegsolve.jar" "D:\zuoti\192943_奇怪的图片\photo2.png"

java -jar Stegsolve.jar "D:\zuoti\192943_奇怪的图片\photo2.png"
Error: Unable to access jarfile Stegsolve.jar

这是由于用文件夹并不同所以找不到，要用绝对路径

![wp16](/misc/wp16.jpg)

flag{Ple ase_Find_ME}

# 5.**维吉尼亚朋友的来信**

好久没做misc，主要都去学reverse，今天就把week1结了，是音频隐写，我以前遇到音频隐写就没做出来过

不豪这音乐好熟悉，我初中好像放过这音乐，不过太过久远就无从考证

直接使用audactivity去看一下频谱图

波形图：横坐标是时间，纵坐标是信号的幅度（如电压、声压、光强等，单位取决于具体物理量），反映信号在某一时刻的瞬时强度

频谱图：横坐标的赫兹（hz）表现所含的频率成分，纵坐标是幅度（或者功率/能量），解释频率的组成

![10](/qctf3/10.jpg)

得到key{deppsound}，不豪是key，逆向手特有的看见密钥就走不动路了，是这密钥害了我，其实应该是key（关键）提醒你使用deepsound软件(提取音频文件和音频轨道的隐藏文件)，其实题目中的发现信件从深处的声音中来，就是音频中隐藏着文件信息

根据题目维吉尼亚，是维吉尼亚加密，密钥就是deepsound

[维吉尼亚加密/解密 - Bugku CTF平台](https://ctf.bugku.com/tool/vigenere)

得到

```
Dear new friend,
  Welcome to the thrilling world of CTF!This isn’t just a game—it’s a playground where curiosity meets challenge, where every line of code, every hidden clue, and every puzzle holds a secret waiting to be uncovered. Here, you’ll stretch your mind, learn to see patterns in chaos, and turn "I don’t know" into "I figured it out."
  Don’t worry if things feel overwhelming at first. We’ve all been there—staring at a problem, scratching our heads, wondering where to start. But that’s the magic of it: every mistake is a lesson, every small win a rush. And you’re not alone. This community thrives on collaboration, on sharing ideas, and lifting each other up.
  So dive in. Explore. Experiment. Ask questions. Celebrate the tiny victories, and don’t fear the stumbles. The CTF world is brighter with you in it, and we can’t wait to see where your journey takes you.
Flag is "funny letter to you". Remember wrap the flag content in flag{} and use underline‘_' to replace space character' '.

Best wishes!
```

确实是ctf道路上，有很多挑战，也足够令人惊喜，也需要请教他人与交流

得到flag{funny_letter_to_you}

![weijiniyamima](/misc/weijiniyamima.png)

这是映射表，一一对应，其实每一行比上一行循环左移一个数

