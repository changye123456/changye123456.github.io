---
title: Js逆向
date: 2026-04-26 20:12:00
tags: reverse
---

# 杂谈

还久没写blog

最近还是摆了点

# 概念

可以破解前端加密、绕过反爬机制、模拟运行行为等

# 基础

## 语法基础

* 基本数据类型

字符串 String
数字  Number
布尔 Boolean
空值 Null
未定义 Undefined
独一无二的值 Symbol

* 引用数据类型

对象 Object

函数 Function

数组 Array

* 语句标识符

声明块作用域的变量 let(也可以全局作用域，推荐)

声明变量 var

断点调试  debugger

当前所属对象 this

* 比较运算符

==尝试将等号两边转为相同的类型

===是要类型与值完全相等

在js逆向的==是，可以传入一个通过类型转换后能匹配上的值俩进行绕过

null == undefined返回true

null ==== undefined返回NULL

NaN == NaN返回fasle（其实在在JavaScript中，**NaN**（Not-a-Number）是一个全局属性，用于表示一个非数字的值。它通常出现在数学运算失败或将非数字字符串转换为数字时。）

```
alert('Hello')
```

弹窗警告函数

* //表示注释
* ``用于多行字符串

* 函数

```js
function abs()
{
    if(x>=0)
        return x;
    else
        return -x;
}
```

函数也是对象，abs()是函数对象，abs是指向函数的变量(类似于c++的指向函数的指针int (* ptr)(形参表))

既然我函数也是对象，那么就可以整个匿名函数

```
let abs = function(x){
    if(x>=0)
        return x;
    else
        return -x;
}
console.dir(abs);
```

这里终端中仅能[Function: abs]，但在浏览器可以直接展开，这是因为

浏览器中是图形界面可以展开/折叠树状结构，终端仅是文字界面，尽可以输出静态字符，无法实现交互展开

```
const util = require('util');
let abs  =  function(x){
    if(x >= 0) return x;
    else return -x;
}
console.log(util.inspect((abs),{showHidden:true, depth:null, colors:false}));
```

<ref *1> [Function: abs] {

[length]: 1,
[name]: 'abs',
[arguments]: null,
[caller]: null,
[prototype]: { [constructor]: [Circular *1] }
}

<ref *1> 表示引用标记，标号为1，用于后面的表示引用

[arguments]显示形参个数

[prototype]: { [constructor]: [Circular *1]除箭头函数外都有的属性，函数作为构造函数使用

#### `[Circular *1]` 是什么意思？

- **循环引用**：`prototype.constructor` 指向了函数本身
- `*1` 表示指向之前标记的 `<ref *1>`

### `[caller]: null`

- **含义**：指向调用当前函数的函数





\**** js允许传入任意个数个函数不受影响

abs(3, 5)返回3

abs()返回NaN

## 作用域

变量、函数、对象的可访问性，不同作用域下同名变量不会有冲突。

作用域分为全局作用域、和函数作用域和块作用域

全局作用域：不在任何函数或块内、没有定义直接赋值(没有let、var)、windows对象的属性

块作用域:if、switch、for、while循环，块作用域可以用let\const声明

函数作用域是只能在函数内部可以被访问

变量在指定作用域外无法访问

# JS中的对象

```JS
var person = {firstname:"man",
    eyecolor:"blue"
}
```

JavaScript的对象可以跨越多行，空格和换行不是必须

对象属性(name:value)键值对,

访问对象属性的两种方式

```js
console.log(person.firstname, ' ', person['firstname']);
```

# 窗口对象属性

Window表示浏览器当前打开的窗口(以下为windows对象的属性(子对象))

|        Document对象        |   documnet   |
| :------------------------: | :----------: |
|        History对象         |   history    |
|        Location对象        |   location   |
|       Navigator对象        |  navigator   |
|         Screen对象         |              |
| 按照指定的像素值来滚动内容 |  scrollBY()  |
|     把内容滚到指定坐标     |  scrollTO()  |
|           定时器           | setTimeout() |
|          弹出警告          |   alert()    |
|         弹出对话框         |   prompt()   |
|         打开新页面         |    open()    |
|          关闭页面          |   close()    |
|                            |              |

## Document(载入浏览器的HTML文档)

| &#x3c;body>元素          | body                  |
| ------------------------ | --------------------- |
| 当前cookie               | cookie                |
| 文档域名                 | domain                |
| 文档最后修改日期和时间   | lastModified          |
| 访问来源                 | referer               |
| 文档标题                 | title                 |
| 当前URL                  | URL                   |
| 返回指定id的引用对象     | getElementById()      |
| 返回指定名称的对象集合   | getElementByName()    |
| 返回指定标签名的对象集合 | getElementByTagName() |
| 打开流接收输入输出       | open()                |
| 向文档输入               | write()               |

## Navigator对象包含的属性描述了当前使用的浏览器，可以用这些属性进行平台的专用的配置

| 户代理                     | userAgent           |
| -------------------------- | ------------------- |
| 浏览器代码名字             | AppcodeName         |
| 浏览器名称                 | AppName             |
| 浏览器版本                 | AppVersion          |
| 浏览器语言                 | browserLanguage     |
| 指明是否启用cookie的布尔值 | cookieEnabled       |
| 浏览器系统的cpu等级        | cpuClass            |
| 是否处于脱机模式           | onLine              |
| 浏览器的操作系统平台       | platform            |
| 插件，所有嵌入式对象的引用 | plugins             |
| 是否启用驱动               | webdriver           |
| 引擎名                     | product             |
| 硬件支持并发数             | hardwareConcurrency |
| 网络信息                   | connection          |
| 是否启用java               | javaEnable()        |
| 是否启用数据污点           | taintEnabled()      |

## Location对象(location对象包含当前的URL信息)

| URL锚              | hash      |
| ------------------ | --------- |
| 当前主机名和端口号 | host      |
| 当前主机名         | hostname  |
| 当前URL            | href      |
| 当前URL的路径      | pathname  |
| 当前URL的端口号    | port      |
| 当前URL的协议      | protocol  |
| 设置URL查询部分    | search    |
| 加载新文件         | assign()  |
| 重新加载文件       | reload()  |
| 替换当前文档       | replace() |

## Screen(Screen对象中存放着有关显示浏览器的信息)

| 屏幕高度             | availHeight          |
| -------------------- | -------------------- |
| 屏幕宽度             | availWidth           |
| 调色版比特深度       | bufferDepth          |
| 显示屏每英寸水平点数 | deviceXDPI           |
| 显示屏每英寸垂直点数 | deviceYDPI           |
| 是否启用字体平滑     | fontSmoothingEnabled |
| 显示屏高度           | height               |
| 显示屏分辨率         | pixelDepth           |
| 屏幕刷新率           | updateInterval       |
| 显示屏宽度           | width                |

# History(对象在浏览器访问的URL)

| 浏览器中的URL个数 | length    |
| ----------------- | --------- |
| 加载前一个url     | back()    |
| 加载下一个URL     | forward() |
| 加载某个具体页面  | go()      |

# 事件

HTML事件是发生在HTML元素上的事件（HTML界面上使用JS时，JavaScript可以触发）

既可以是浏览器行为，也可以是用户行为

以下是 HTML 事件的实例：

- HTML 页面完成加载
- HTML input 字段改变时
- HTML 按钮被点击

事件触发时JavaScript可以执行一些代码

**HTML是标记语言，主要是语义描述(对文本和结构标注，赋予其含义)，核心元素标签(Tags)、元素(Elements)、属性(Attribute)**

事件可以处理表单验证，用户输入、用户行为以及浏览器动作：

# Js中的类与对象

由于frida的脚本是js脚本，所以写的时候就探寻到了新的知识，于是就写了这些

python有\__init__函数，JS有constructor函数

```js
class Person{
    constructor(name, age)
    {
        this.name = name;//实例成员
        this.age = age;//实例成员
    }
    //实例方法
    greet()
    {
        return `hello my name is ${this.name} and I am ${this.age} years old`;
    }


};
const person1 = new Person('wuye', 18);
const person2 = new Person('man', 18);

console.log(person1.greet());

console.log(person2.greet());
```

``为模板字符串

const也是声明变量，只是让变量的引用不变

- 实例成员绑定到具体的对象上

- 在类内部通过this关键字来引用

- 每次创建是实例时，会多次调用

## 静态数据成员

依旧static关键字

```js
class Conter{
    static counter = 0;
    constructor()
    {
        Conter.counter++;
    }
    static getCounter()
    {
        return Conter.counter;
    }
};
const a1 = new Conter();
const a2 = new Conter();

console.log(Conter.getCounter());
```

绑定类

由static声明的类为ES6类类静态成员

# console对象

1.assert方法

```js
console.assert(0, "man")
```

第一个参数是表达式，当第一个参数为false是放回第二个字符串参数

这个的输出就是Assertion failed: man

2.clear方法

清空控制台的输出，将光标返回第一行

```js
console.clear()
```

3.count()函数

用于技术，输出其被调用了多少次

```js
(function() {
  for (var i = 0; i < 5; i++) { 
    console.count('count'); 
  }
})();
VM214:3 count: 1
VM214:3 count: 2
VM214:3 count: 3
VM214:3 count: 4
VM214:3 count: 5
undefined
function a()
{
    for(var i = 1; i<5; i++)
        console.count("count")
}
undefined
a()
VM223:4 count: 6
VM223:4 count: 7
VM223:4 count: 8
VM223:4 count: 9
undefined
```

4.error输出信息是在最前面加个红色的❌，表示出错，同时显示

错误发生的栈

console.error("%d", 30)

5.group()

用于将信息分组，可以将信息折叠与会者展开

```js
console.group('第一层');
  console.log('伊雷娜');
    console.group("第二层");
      console.log("11111");
    console.groupEnd();
console.groupEnd();
```

而groupCollapsed()与group()不同之处在于第一次显示时收起的(collapsed)
即使也是groupEnd()[结束内联分组]

6.console.log()与console.info()均是输出信息

7.table函数将复杂的对象变量转为表格

7.console.time()与console.timeEnd()计时器的开始与结束

```js
console.time('计时器');
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");

console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");


console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");

console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");

console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");


console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");
console.info("伊雷娜小姐真可爱");

console.timeEnd("计时器");
```

```
[Running] node "d:\js\5.js"
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
伊雷娜小姐真可爱
计时器: 3.026ms

```

9.tracce()追踪函数的调用过程

```
function d(a){
    console.trace();
    return a;
}
function b(a) { 
  return c(a);
}
function c(a) { 
  return d(a);
}
var a = b('123');
```

trace是调用栈追踪机制

从上到下从最近调用一直到最远的调用

# js中的对象

