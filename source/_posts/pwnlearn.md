---
title: pwnlearn
date: 2026-05-03 15:49:54
tags: pwn
---

# 序言

最近学逆向有些倦了，想多看看别的方向

# moectf**ez_u64**

在雪豹大佬的指导下尝试的这道题

现在vscode，ctrl+shift+p或者直接输入>输入wsl连接到wsl，要整出flag肯定要远程

```python
from pwn import *#导入pwntools全部模块
context(os = 'linux', arch = 'amd64', level = 'debug')#设置配置和环境
p = remote('网址', 端口)#启动本地程序(Pwntools提供remote和process两种方法)
def itob(x):
    return str(x).encode()
p.recvuntil('hint.')#程序输出直到知道到hint,将接收到的所有内容抛弃
code = p.recv(8)#接着接受8字节
ans = u64(code)#将接受的的8字节按照小端序解包为64位整数
log.debug(ans)#在debug层级输出
p.sendline(itob(ans))#将整数字符串字节发送给程序
p.interactive()  #将控制权交给用户，手动与程序交互
```

直接python temp.py报了下先是[ERROR] './pwn' is not marked as executable (+x)exit

要切换到对应的文件夹cd，

linux每个文件均有读(r),写(w),执行(x)三种模式

要chmod +x temp.py

首先要搭建pwn的虚拟环境,vim ~/.bashrc设置一下

alias gopwn="source /home/用户名/pwner/bin/activate"

运行后cat flag直接抓住远端flag

ls可以列出来

对不起，不小心做毒wp了，感谢雪豹大佬的指正

```python
from pwn import *#导入pwntools全部模块
context(os = 'linux', arch = 'amd64', level = 'debug')#设置配置和环境
p = remote('网址', 端口)#   ** 连接远程服务**     程序(Pwntools提供remote和process两种方法)
def itob(x):
    return str(x).encode()
p.recvuntil('hint.')#程序输出直到知道到hint,将接收到的所有内容抛弃
code = p.recv(8)#接着接受8字节
ans = u64(code)#将接受的的8字节按照小端序解包为64位整数
log.debug(ans)#在debug层级输出
p.sendline(itob(ans))#将整数字符串字节发送给程序
p.interactive()  #将控制权交给用户，手动与程序交互
```

