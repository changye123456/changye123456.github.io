---
title: python学习之旅
date: 2026-03-08 19:49:26
tags: misc python
---

# python学习（持续更新）（对于一些发病的废话请主动忽略）

# 入门

python作为编写agent的基础，随着AI的发展，传统的码农将会走向没落，所以才开了这篇python学习的帖子，说不定哪天这帖子就写一些agent开发，当然以后还会有一些mcp的建立，ai是个好工具（被ai大人吓哭了），传统的写代码会被AI取代，只有在维度上胜过AI才可以，当然练习与实战是必不可少的（理论结合实战才能学好代码）

- **第一层：数学基础（地基）**
  所有技术的根本。包括线性代数（向量、矩阵）、微积分（梯度下降）、概率论（不确定性推理）和最优化理论。没有它，上层建筑无法稳固。
- **第二层：机器学习 & 深度学习（核心框架）**
  这是技术主体。机器学习是“让计算机从数据中学习”的通用范式；深度学习（基于神经网络）是其中最强大的一个分支。Agent和提示词所依赖的大语言模型（LLM），本身就是深度学习在NLP领域的产物。
- **第三层：提示词工程（交互接口）**
  这是**使用**大语言模型的“编程语言”。它不改变模型内部（不改变第二层的参数），而是通过精心设计的输入，来引导、约束和激发模型的能力。它是在**应用层**操作深度学习模型。
- **第四层：Agent（复杂系统）**
  这是基于大语言模型构建的**自主智能体**。它利用提示词工程来规划任务、调用工具、进行反思。一个Agent通常包含：LLM（深度学习产物）+ 提示词（定义角色、目标、流程）+ 工具调用（如搜索、计算）。

## 工具

python3，idle（python也有自己的devc++，初学时先不用轮椅，这样才能更好锻炼代码能力），pycharm(python自己的vscode，更好用)，AI(deepseek, coplit, gemini,chatgptm,AI时代肯定要好好使用AI，让AI成为自己的助手，而不是替代AI让你学习),bilibili,互联网(各种人的blog与帖子)，github（找项目与笔记）

1.一切开始之前先说一下程序规范

<一>编码部分

(1)编程

(2)代码规范

缩进、行宽（垂直方向）、引号、空行、编码

(3)import语句

(4)空格

(5)换行

(6)docstring（文档字符串"""          """）

<二>注释

块注释、行注释、建议、文档注释

看看注释，注释肯定分为单行与多行注释

单行注释使用‘#’

```python
# 这是学习python的开始
```

多行注释使用多行字符串('''或者""",毕竟python与c++不同并不怎么区分“”与‘’的区别)

```
"""
这是一个多行注释
"""
```

<三>命名规范

模块、类名、函数、变量名、常量

1./与c语言/c++不同的是python中的/会产生浮点数(12/6 = 2.0)

```python
print("Hello World!")
```

依旧是神秘hello world

## 基本语法

作为一门语言有词法与语法（语文了一波，遥想当年语文，一直拖后退，最后也是惨淡收场）

### 编码

一般来说python的编码都是UTF-8编码（8为一个编码单元），所有字符都是Unicode字符

，但是你要想用以前的区域性语言字符集也是可以用Windows1512

```
# -*- coding: cp-1252 -*-
```

### 字符集、标识符（词法记号）

![1](/pythonlearn/1.jpg)

这下知道イレイナ是怎么样的，当然这是说python与c++不同，python可以有中文的变量

当然关键字并不能是关键字

同时数字还是不能作为标识符的开头

What's more 还不能有连字符(-)

### 当然说字符就不得不提python保留字符（关键字）

| and      | exec    | not    |
| -------- | ------- | ------ |
| assert   | finally | or     |
| break    | for     | pass   |
| class    | from    | print  |
| continue | global  | raise  |
| def      | if      | return |
| del      | import  | try    |
| elif     | in      | while  |
| else     | is      | with   |
| except   | lambda  | yield  |

| **类别**         | **关键字** | **说明**                               |
| :--------------- | :--------- | :------------------------------------- |
| **逻辑值**       | True       | 布尔真值                               |
| (bool值)         | `False`    | 布尔假值                               |
|                  | `None`     | 表示空值或无值                         |
| **逻辑运算**     | `and       | 逻辑与运算                             |
|                  | `or`       | 逻辑或运算                             |
|                  | `not       | 逻辑非运算                             |
| **条件控制**     | `if`       | 条件判断语句                           |
|                  | `elif`     | 否则如果（else if 的缩写）             |
|                  | `else`     | 否则分支                               |
| **循环控制**     | `for`      | 迭代循环                               |
|                  | `while`    | 条件循环                               |
|                  | `break`    | 跳出循环                               |
|                  | `continue` | 跳过当前循环的剩余部分，进入下一次迭代 |
| **异常处理**     | `try`      | 尝试执行代码块                         |
| (逆向上异常处理) | except     | 捕获异常                               |
|                  | `finally`  | 无论是否发生异常都会执行的代码块       |
|                  | `raise`    | 抛出异常                               |
| **函数定义**     | `def`      | 定义函数                               |
|                  | `return`   | 从函数返回值                           |
|                  | `lambda`   | 创建匿名函数                           |
| **类与对象**     | `class`    | 定义类                                 |
| (python是oop)    | `del`      | 删除对象引用                           |
| **模块导入**     | `import`   | 导入模块                               |
|                  | `from`     | 从模块导入特定部分                     |
|                  | `as`       | 为导入的模块或对象创建别名             |
| **作用域**       | `global`   | 声明全局变量                           |
|                  | `nonlocal` | 声明非局部变量（用于嵌套函数）         |
| **异步编程**     | `async`    | 声明异步函数（主线程空闲时再执行）     |
|                  | `await`    | 等待异步操作完成                       |
| **其他**         | `assert`   | 断言，用于测试条件是否为真             |
|                  | `in`       | 检查成员关系                           |
|                  | `is`       | 检查对象身份（是否是同一个对象）       |
|                  | `pass`     | 空语句，用于占位                       |
|                  | `with`     | 上下文管理器，用于资源管理             |
|                  | `yield`    | 从生成器函数返回值                     |

```
>>import keyword
>>c
['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']
```

kwlist是个列表

### python的行与缩进

关于python其有严格的代码规范，其不用{}来控制类，python最大的特点是用缩进来写块（虽然是特点，我认为这点python不如c/c++灵活）

```python
if True:
    print("man")
else:
    print("out")
```

运行得到结

```

```

果

如果缩进有误，迎接你的belike:

SyntaxError: unindent does not match any outer indentation level

(syntax语法，identation行缩进，缺口，unident减少缩进，要学好英语啊，计算机不少报错都是英语，国际交流也要英语，ba国际服要英语（虽然可以繁中），毕业也要四级，保研要6级，当然语文也是博大精深)



### 多行语句与单行显示多行

如果同一行显示多条语句，语句之间以分号分割

```
x = 3; x+=2; print(x)
```

有一行显示多条语句就有一个语句以多行显示也就是多行语句

```
x = 3

x = 4 + \
    5 + \
    6
print(x)
    
```

以反斜杠'\\'表示行连续

当然[],{},或者()中的多行语句，并不需要反斜杠

### 数字(Number)的类型

int(整数)，bool（布尔），float（浮点数），复数（complex）

### 字符串（String）

1.python中的'与“完全相同(c++中字符常量用''而""用与字符串，'0'与"0"的区别是"0"相当于{'0','\0'})

2.而三引号"""是用于多行字符串

3.转义字符\

4.r可以打印原始字符串

```
r"man\\"
'man\\\\'
r"man\n"
'man\\n'

```

大概就是让\变为\\转义序列

5.按字面意义关联字符串,可以将几个字符串拼接在一起

python会自动拼接相邻的字符串

print('this''is''string')
thisisstring

```python
>>'this''is''string'
'thisisstring'
>>text = (
    "This is "
    "a long "
    "string"
)
>>text
'This is a long string'
```

6.+是拼接，乘是复制

7.python的字符串有两种索引方式，从左往右以0开始，从右往左以-1开始

字符串切片str[start​\:end:step]start包含，end不包含，

## 代码组

缩进相同一组语句构成一个代码块，称为代码组

if、while、def和class这样的复合语句，首行以关键字开始，以冒号( : )结束，该行之后的一行或多行代码构成代码组。

我们将首行及后面的代码组称为一个子句(clause)。

## 导入

python用import与from ……import来导入相应的模块

将整个模块(somemodule)导入，格式为import somemodule

从某个模块导入某个函数，from somemodule import somefunction

从某个模块导入多个函数：**rom somemodule import firstfunc, secondfunc, thirdfunc**

从某个模块导入全部函数：from somemodule import *



# 数据类型

计算机能处理各种数据，不同数据要定义不同的数据类型

```
str = "whatcanisay"
str[0:-1]
'whatcanisa'
```



## 整数

python可以处理个任意大小的整数(而c++要声明不同的数据类型)，计算机由于是由二进制组成，所以有时用16进制更方便(0x前缀)

对于很大的数的数可以在数中插入"    _    "分隔符

```
>>c = 10_0000_00
>>c
10000000

```

## 浮点数

浮点数就是小数，由于按照科学记数法时小数点的位置可以变化，比如1.23 * 10<sup>9</sup>与12.3*10对于很大或者很小的浮点数要用科学计数法

整数是精准的，但是浮点数可能要4舍5（这里举个c++的例子，要保留两位小数,floor(x*100+0.5)/100,四舍五入）

```
3.6+4.2
7.800000000000001
4.6-4.2
0.39999999999999947

```

这种也可以解决的

可以导入decimal库

```python
>>>import decimal
>>>a = decimal.Decimal('3.6')
>>>b = decimal.Decimal('4.2')
>>>a + b
Decimal('7.8')
>>>print(a + b)
7.8
```



## 布尔值

布尔值和布尔代数的表示一直，一个布尔值只有True,False两种值，要么是True要么是False

python中用True、False表示布尔值，也看通过布尔运算(c++是true，false)

```
>>True == 1
True
>>3>5
False
```

布尔值可以用and、or和not运算，and是与运算，or是或运算，not是非运算(True变为False)

## 字符串

上面已经写的够详细

## 空值

空值是个特殊的值，用None表示，None与0不同，None是个特殊的空值

还有列表，字典等多种数据类型，还允许自建数据类型

# 变量（不具备内存，仅是指针）

其变量可以不固定类型（类似于c++的auto类型数据），变量可以是任意数据类型

```
a = 123
print(a)
a = 'ABC'
print(a)


```

变量本身类型不固定的语言是动态语言(python)

而静态语言在定义是必须指定数据类型(c++/c,Java)

如

```
#include<iostream>
int main(void)
{
    int a = 6;
    a = "6";//不能将字符串常量赋值给整型数
}
```

和静态语言一比较，动态语言就很灵活，就是这个原因

最后理解变量在计算机内存中的表示也非常重要。

```
a = 'ABC'
```

python解释器干了两件事：

1.在内存中和=创建了一个'ABC'字符串

2.在内存中创建了一个名为a变量，并将其指向‘ABC’

也可以将一个变量的值赋给另一个变量b，实际上是把b指向a所指向的数据

```
a = 'ABC'
b = a
a = 'XYZ'
print(b)
```

打印的结果是ABC，所以b指向的不是a而是a一开始所指的数据

# 常量

常量是不能变的变量，python通常用大写表示（PI = 3.1415926，当然PI本身是变量，可以改变）

python有两种除法，一种是/，这也是精确的

```
>>10/3
3.3333333333333335
```

另一种是//（地板除，取整）

%取余

python的整数与浮点数都没有大小限制，超出一定范围表示inf(无限大)

# 字符串的编码（ASCII->Unicode->UTF-8）

主要是ASCII码(0~122， 空到‘z’)

显然ASCii表示的有限，所以就有了Unicode(通常2字节，UCS-16编码)

但是有时候列入ASCII表中的字符编码成UCS-16会浪费空间,在存储和传输上就十分不划算

Unicode编码转化为“可变长编码”的`UTF-8`编码。UTF-8编码把一个Unicode字符根据不同的数字大小编码成1-6个字节，常用的英文字母被编码成1个字节，汉字通常是3个字节，只有很生僻的字符才会被编码成4-6个字节。

| 字符 | ASCII    | Unicode           | UTF-8                      |
| ---- | -------- | ----------------- | -------------------------- |
| A    | 01000001 | 00000000 01000001 | 01000001                   |
| 中   |          | 01001110 00101101 | 11100100 10111000 10101101 |

在内存中统一使用Unicode编码，在传输和储存使用UTF-8

浏览网页时，服务器会把动态生成的Unicode内容转换为UTF-8再传输到浏览器：

# python中的字符串和编码

python的ord()获取字符的整数表示，chr()函数把编码转为转为对应字符

知道字符的整数，可以用16进制这么写str；

```
>>'\u4e2d'
'中'
```

python的字符串类型是str，在内存中以Unicode表示，一个字符串对应若干个字节，如果要在网络上传输，或者保存到磁盘上，要将str变为以字节为单位的bytes

Python对`bytes`类型的数据用带`b`前缀的单引号或双引号表示：

```
x = b'ABC'
```

'ABC'与b‘ABC’去别在每个元素所占的字节大小

Unicode表示的str通过encode方法可以变为指定的bytes

```
>>'ABC'.encode('ascii')
b'ABC'
>>'ABC'.encode('utf-8')
b'ABC'

```

在`bytes`中，无法显示为ASCII字符的字节，用`\x##`显示。

当然decode方法可以解密（在网络或磁盘读取了字节流）





```
>>b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8')
'中文‘

```

bytes的数据无效会报错，仅小部分字节无效（可以忽略）

```
>>> b'\xe4\xb8\xad\xff'.decode('utf-8', errors='ignore')
```

字符串str含多少个字符，用len方法

bytes类型的字符串，len就仅计算字符串数

python源代码是文本文件，要保存成utf-8编码，Python解释器读取源代码时，为了让它按UTF-8编码读取，我们通常在文件开头写上这两行：

```
#!/user/bin/enc python3
# -*- coding: utf-8 -*-
```

第一是注释给Linuc/OS系统的，这是个python文件.

第二行注释是为了告诉Python解释器，按照UTF-8编码读取源代码，否则会有乱码

如果`.py`文件本身使用UTF-8编码，并且也申明了`# -*- coding: utf-8 -*-`，打开命令提示符测试就可以正常显示中文：

## 格式化

%运算符来格式化(c的转换说明)有几个`%?`占位符，后面就跟几个变量或者值

```
>>'hello %s, %x'%('man', 0xf4)
'hello man, f4'

```



| 占位符 | 替换内容     |
| ------ | ------------ |
| %d     | 整数         |
| %f     | 浮点数       |
| %s     | 字符串       |
| %x     | 十六进制整数 |

字符串里面的`%`是一个普通字符怎么办？这个时候就需要转义，用`%%`来表示一个`%`









**另一种是format()来格式字符化,传入占位符{0}, {1}**

```
>>>'{}'.format(1)   //基本 
'1'
>>>“网站名： {name}, 地址： {url}".format(name="1", url="www")   //变量引导
》》》"{:.2f}".format(3.1415926)    //数字格式化
"{:x<4d}".format(5)
# 百分比格式
"{:.2%}".format(0.25) # 输出: '25.00%'
# 二进制
'{:b}'.format(11) # 输出: '1011'

# 八进制
'{:o}'.format(11) # 输出: '13'

# 十六进制
'{:x}'.format(11) # 输出: 'b'
'{:#x}'.format(11) # 输出: '0xb'

```

### 标准格式规范完整语法

text

```
[[fill]align][sign][#][0][width][,][.precision][type]
```



### 必须遵守的先后顺序表

| 顺序位置 | 成分            | 作用                | 是否必需 | 举例                     |
| :------- | :-------------- | :------------------ | :------- | :----------------------- |
| **1**    | `[[fill]align]` | 填充字符 + 对齐方式 | 否       | `*^`（星号填充并居中）   |
| **2**    | `[sign]`        | 正负号处理          | 否       | `+`（强制显示正号）      |
| **3**    | `[#]`           | 进制标识前缀        | 否       | `#`（显示 0x、0b 等）    |
| **4**    | `[0]`           | 用 0 填充（仅数字） | 否       | `0`（与 width 配合用）   |
| **5**    | `[width]`       | 最小输出宽度        | 否       | `10`（至少占 10 字符）   |
| **6**    | `[,]`           | 千位分隔符          | 否       | `,`（1,000,000）         |
| **7**    | `[.precision]`  | 小数精度 / 截断长度 | 否       | `.2`（保留 2 位小数）    |
| **8**    | `[type]`        | 展示类型            | 否       | `f`（浮点）、`d`（整数） |

### 



**f-string**

```
>>> r = 2.5
>>> s = 3.14 * r ** 2
>>> print(f'The area of a circle with radius {r} is {s:.2f}')
The area of a circle with radius 2.5 is 19.62
```

`{r}`被变量`r`的值替换

# 列表与元组(list and tuple)

**list**

列表名打印出整个列表

```
>>>clas = [1, 2, 3]
>>>len(clas)
3
>>>clas[-1]
3
```

列表是有序集合

下标索引从0开始

超出范围有IndexError，最后一个元素为len(clas) - 1

负数下标索引从最后一个开始

list是个可变的有序列表,可以在末尾添加

```
>>>clas.append('man')
clas
[1, 2, 3, 'man']
```

也可以将元素插入指定位置

```
>>>clas.insert(1, 'joker')
>>>clas
[1, 'joker', 2, 3, 'man']
```

删去末尾元素

```
>>>clas.pop()
'man'

>>>clas
[1, 'joker', 2, 3]
```

list元素可以是另一个list(虽然嵌套的list可以有好多元素，但他只算外面list的一个元素)，list元素的数据类型不一定相同

空列表也是必须的

```
>>>len([])
0
```

**tuple**

元组也是有序列表， **初始化后不能修改**

由于其不可变更安全

```
>>>t = (1, 2)
>>>t
(1, 2)
```

空元组:   ()

python规定列表仅有一个元素，要加上逗号，否则仅仅是个数字(1个不加逗号默认为小括号)

```
>>>(1)
1
>>>(1,)
(1,)
```

由于python全是引用，touple可变(但是指向的对象是不可以变，有些绕，举个栗子，魔法于此显现)

```
>>>t = (1, 2, [3, 4])
t[2][0] = 5
>>>t
(1, 2, [5, 4])

```

指向的list没变，list元素改变

# 条件判断

if 、elif、else, 没有括号， 有冒号

```
age = 3
if age>3:
    print('man')
elif age == 3:
    print('out')
else:
    print('6')

```

elif可有多个，其他最多一个

从上往下，先True结束

还有简写

```
if x:
    print('True')
```

x只要非0数值，非空字符串、非空list等，就为True否则False

# 再论input

input返回的值为str类型

int()可将字符串转变为整数，类似于c的atoi

int(‘abc’)会报错

```
>>>x = input()
3
>>>y = int(x)
>>>x
'3'
>>>y
3
```

```
height = 1.75
weight = 80.5

bmi = 80.5 /( 1.75 * 1.75)

if bmi>32:
    print('严重肥胖')
elif bmi<=32 and bmi>28:
    print("肥胖")
elif bmi<= 25 and bmi>18.5:
    print('正常')
else:
    print('过轻')
```

# 模式匹配

match case语句(类似于c的switch case)

```
score = 'D'

match score:
    case 'A':
        print('A')
    case 'B':
        print('B')
    case 'c':
        print('c')
    case _:  #表示匹配到其他任意情况
        print("????")

```

match 的复杂匹配:

匹配多值  case 15 | 46 | 47:

匹配一定范围   case x if x<16:



**匹配列表**

```
args = ['gcc', 'hello.c', 'new.c']

match args:
    case ['gcc']:
        print('gcc: missing source file(s).')
    case ['gcc', file1, *files]:
        print('gcc' + file1 + ',' + ','.join(files))
    case _:
        print('invalid command.')

```

case ['gcc', file1, *files]:  表示列表第一个为'gcc',第二个字符串绑定变量file1， 后面的任意个字符串绑定到`*files`它实际上表示至少指定一个文件(绑定)

# 循环

python循环有二:

**for...in...**

一种是in对list和tuple进行迭代

```python
names = ['A', 'B', 'C']
for name in names:
    print(name)
```

list(range(5))从0开始到小于5的数打包进入列表

```python
sum = 0
for i in range(101):
    sum += i
print(sum)
```

**while**循环

条件不满足时退出循环

```python
sum = 0
n = 98
while n>0:
    sum += n
    n -= 1
print(sum)
```



**break**

提前结束当前循环

```
break
```

**continue**

结束当前循环，进入下一个循环

```
continue
```

#  python经典的切片语法

1.左闭右开

2.默认值(起点默认为0，结束默认为序列恶的长度结束，步长默认为1)

3.负数索引

索引为负数，表示从右往左数，-1是最后一个元素

```
lst = [10, 20, 30, 40, 50, 60]
#索引正向： 0   1   2   3   4   5
#索引反向：-6  -5  -4  -3  -2  -1
```

lst[::]整个列表

# dict和set(字典和集合)

## dict全名dictionary，其他语言又叫map(用键-值对)

```
>>d = {'man':3, 'key':4}
>>d['man']
3

```

类似于是先在字典的索引表里（比如部首表）查这个字对应的页码，然后直接翻到该页，找到这个字。无论找哪个字，这种查找速度都非常快，不会随着字典大小的增加而变慢。

除了初始化，还可通过key放入value

```
>>d = {'man':3, 'key':4}
>>d['man']
3
>>d['man'] = 9
>>d
{'man': 9, 'key': 4}
```

key不存在会报错

为了避免key不存在:

一是in判断

```
'man' in d
```

二是get()方法，key不存在，默认返回None，也可以是自己定义的值

```
>>d.get('han')
>>d.get('han',-7)
-7
```

删除pop(key)

```
d.pop('man')
```

list占用内存少

dict查找和插入快，不随key的增加而增加

当然同一个key得到的结果相同。这个通过key计算位置的算法称为哈希算法，为了保证hash正确，key对象不能变，字符串、整数等都是不可变的，因此，可以放心地作为key。而list是可变的

## set

仅有key，没有value

```
s = {1, 2, 3}
s = set([1,2, 3])
```

set无序，且自动忽略定义是的重复

```
s.add(4)
```

添加元素

```
s.remove(4)
```

删除

s1 & s2 交集, s1| s2并集

# 再谈不可变对象

列表的sort方法str是不变对象，而list是可变对象。

对于可变对象，比如list，对list进行操作，list内部的内容是会变化的，比如

```
>>a = [3, 2, 1]
>>a.sort()  #同种数据类型可用
a
[1, 2, 3]
```

对于str(不可变对象)

a = 'abs'

a.replace('a', 'A')

replace仅是创建新的字符串对象并返回，并没有做出改变原有的引用。

# 函数

类对象（抽象基类库）、异步io

## 函数的调用

help函数可以查找参数

typeError在参数个数不对实时exactly x argument在类型不对是是bad operand 

max函数可以接受多个参数返回最大的

函数名仅仅只是指向函数对象的引用，完全可以赋值给另一个变量的，先当与别名(类似于c++的引用)

## 函数定义

```
def myabs(x):
    if x>=0:
        return x
    else:
        return -x
```

执行到return后函数执行完毕，如果没有return函数执行完后会返回None，return None可以写成return

如果将函数定义保存到另一个文件abstest.py文件，在文件当前文件的当前目录下启动python解释器

from abstest import abs

定义一个空函数

```python
def nop():
    pass
```

pass并不是什么都没有，这跟打麻将3缺一，随便拉上一个才可以开一把，这就是让程序正常跑起来

## 参数检验

参数个数不对是python解释器自动检验，并抛出typeerror

类型不对是无法检测的，但是自定义参数内部的函数是可能会报错

```python
def myabs(x):
    if not isinstance(x, (int , float)):
        raise TypeError('bad oprand type')
        
```

isinstance是检验变量的数据类型



**返回多个值**

```
def move(x, y, step,angle = 0):
    nx = x + step * math.cos(angle)
    ny = y + step * math.sin(angle)
    return nx, ny

move(3, 1, 1)
(4.0, 1.0)
```

```
import math

def quadratic(a, b, c):
    x = (-b + math.sqrt(b*b - 4*a * c))/(2*a)
    y = (-b - math.sqrt(b*b - 4*a*c))/(2*a)
    return x, y
   
# 测试:
print('quadratic(2, 3, 1) =', quadratic(2, 3, 1))
print('quadratic(1, 3, -4) =', quadratic(1, 3, -4))

if quadratic(2, 3, 1) != (-0.5, -1.0):
    print('测试失败')
elif quadratic(1, 3, -4) != (1.0, -4.0):
    print('测试失败')
else:
    print('测试成功')

```

## 函数的参数

### 位置参数

所谓的位置参数就是一般的自定义函数，按位置**依次**只复制

### 默认参数

power(x, n= 2)

n就有默认参数，当n不传入值是就赋值为2

**注意**

一是必选参数在前，默认参数在后

二是默认参数一般选取变化较小的参数

多个默认参数及对其中部分赋值时

```
enroll('Adrom', 'M', city = 'Shanghai')
```

默认参数必须指向不变对象

```python
#例如

def add_end(L = []):
    L.append(666)
    return L
```

调用add_end()
add_end()
[666]
add_end()
[666, 666]
add_end([3])
[3, 666]
add_end()
[666, 666, 666]

不对啊我默认参数明明是[]，c++不是这样的，你应该先销毁再创建个新的，但是这是python，默认参数L一开始就被计算出来的，指向一个位置

**所以默认参数要指向不变对象**

### 可变参数

参数个数是可变的

```python
def kebian(* numbers):
    for i in nubers:
        pass

```

将所有参数打包成tuple赋值给numbers

kebian(1, 2, 3)

那么我list/tuple该怎么传入的呢

kebian(* numbers)

### 关键字参数

所谓的关键字参数允许传入0~max的含参数名的参数并打包成dic

```python
def test(**kw):
    print(kw)

    
test(man = 3)
{'man': 3}

```

除了必填，其他均为可选项，满足不同的需求

当然也有简化的

```python
>>> extra = {'city': 'Beijing', 'job': 'Engineer'}
>>> person('Jack', 24, **extra)
name: Jack age: 24 other: {'city': 'Beijing', 'job': 'Engineer'}

```

**extra将dict所有的key-value对作为参数传入\*\*kw

### 命名的关键字参数

def person(name,*, city, job):

*后面的表示命名的关键字参数，如果有可变参数后面的自动化为关键字参数

def person(name, age, *,args, city, job):
    print(name, age, args, city, job)

关键字参数传参数时一定要带关键字，例如x = 6 

### 练习

```python
def mul(x, y = 1, *kw):
    z = x * y
    if kw:
        for i in kw:
            z *= i
    return z
# 测试
print('mul(5) =', mul(5))
print('mul(5, 6) =', mul(5, 6))
print('mul(5, 6, 7) =', mul(5, 6, 7))
print('mul(5, 6, 7, 9) =', mul(5, 6, 7, 9))
if mul(5) != 5:
    print('mul(5)测试失败!')
elif mul(5, 6) != 30:
    print('mul(5, 6)测试失败!')
elif mul(5, 6, 7) != 210:
    print('mul(5, 6, 7)测试失败!')
elif mul(5, 6, 7, 9) != 1890:
    print('mul(5, 6, 7, 9)测试失败!')
else:
    try:
        mul()
        print('mul()测试失败!')
    except TypeError:
        print('测试成功!')

```

mul(5) = 5
mul(5, 6) = 30
mul(5, 6, 7) = 210
mul(5, 6, 7, 9) = 1890
测试成功!

使用了位置参数，默认值参数，还有可变参数（这段代码没使用关键字参数）

## 函数的递归

就比如求n的阶乘

```python
def fact(n):
    if n == 1:
        return 1
    else:
        return n * fact(n-1)

    
>>>fact(3)
6

```

函数调用是通过栈(stack)来实现的，每当进入函数调用，栈就会加一层栈帧，当函数返回时就会减少一层栈帧。但栈大小毕竟是有限的，递归次数太多就会栈溢出

当然这种栈溢出可以通过尾递归优化，尾递归是指函数返回时调用自身本身并且return语句布恩那个包含表达式

```python
def fact(n):
    return fact_inter(n, 1)
def fact_inter(num, product):
    if num == 1:
        return product
    else:
        return fact_inter(num-1, product * num)
```

**不好python.没对尾递归进行优化，所以该溢出还是溢出**

```python
def move(n, a, b, c):
    if n == 1:
        print(a, '-->', c)
    else:
        move(n-1, a, c, b)
        print(a, '->', c)
        move(n-1, b , a, c)

```

经典汉洛塔问题

move(n-1, a, c, b)(上面n-1个移动到)
        print(a, '->', c)（将最下面一个移动到c）
        move(n-1, b , a, c)(将剩下的移动到c)

# 面向对象的编程

oop的对象有属性(Property)和方法(Method)两部分

```python
class Student(object):#括号中的是继承的类
    def _init_(self, name, score):
        self.name = name#self表示实例本身
        self.source = score
    def print_scorce(self):
       print('%s %s'%(self.name, self.source)) 
```

当然其也有与c++中相同的三个特点封装、继承、多态

## 类和instance

实例是通过类名+()来实现的

```python
>>>bart = Student()
bart
<__main__.Student object at 0x0000017F1F17ACF0>
```

可以给实例变量绑定属性

bart.name = 'Bart Simpson'

—init—方法是类似c++的构造函数，但是第一个参数永远是self，self不需要传，创建\_init_函数必须要与形参相对应的参数

```python
class Student(object):
    def __init__(self, name, source):
        self.name = name#self表示实例本身
        self.source = source
    def get_grade(self):
        if self.source>=90:
            return 'A'
        elif self.source>=60:
            return 'B'
        else:
            return 'C'


    
Lisa = Student('Lisa', 99)
print(Lisa.name)

```

得到Lisa

python允许实例变量绑定任何数据成员，所以同类对象的属性可能不同

初始化\__init__(是双下划线)

## 访问限制

变量名以___开始代表其访问其为私有变量

如self.__name

但对于__xxx\_\_来说是特殊变量

对于但单下划线一般也约定为私有变量

class内部的例如__name在类外部其实是解析成其他的名字，例如有的版本将私有变量\_Student\_\_name

```python
class Student(object):
    def __init__(self, name, gender):
        self.name = name
        self.__gender = gender
    def get_gender(self):
        return self.__gender

    def set_gender(self, gender):
        self.__gender = gender

# 测试:
bart = Student('Bart', 'male')
if bart.get_gender() != 'male':
    print('测试失败!')
else:
    bart.set_gender('female')
    if bart.get_gender() != 'female':
        print('测试失败!')
    else:
        print('测试成功!')
```

## 继承

```python
class Animal(object):
    def run(self):
        print('Animal is running...')
class Dog(Animal):
    pass
```

Animal是父类，Dog是它的子类

子类获得父类的全部功能，自动拥有run()方法

第一子类可能增加一些方法

```python
class Animal(object):
    def run(self):
        print('Animal is running...')

        
class Dog(Animal):
    def eat(self):
        print('Eatingt meat.')

        
>>>a = Dog()
>>>a.eat()
Eatingt meat.
>>>a.run()
Animal is running...

```

第二是子类与父类有相同函数名的对象会覆盖(多态)

创建实例是其的数据类型即是Dog也是Animal,子类可以看成是父类

```python
>>>isinstance(a, Animal)
True
```

当参数是父类数据类型

```python
def run_twice(animal):
    animal.run()
class Dog(Animal):
    def run(self):
        print('Dog is running...')
    def eat(self):
        print('Eatingt meat.')

        
>>>run_twice(Dog())
Dog is running...

```

这是动态语言，仅需def传入的参数的数据类型有run方法就行的

# 获取对象信息

type函数反会的是数据类型()

```python
>>>type(33)
<class 'int'>
>>>type(None)
<class 'NoneType'>
```

变量指向函数或者类，也可以用type()判断

# python中的with语句

with可以通过上下文管理协议(Context Management Protocol)进行自动资源释放

```python
with expression [as variable]:
    #代码块
```

 expression 返回上下文管理协议的对象

as variable` 是可选的，用于将表达式结果赋值给变量



