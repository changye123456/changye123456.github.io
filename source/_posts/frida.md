---
title: frida
date: 2026-03-27 14:57:13
tags: reverse
---

# 0x00

frida是即使没有原始代码，也可以动态插入自己的代码，本质是将原来指向对象的指针指向hook的代码

frida可以：

1.拦截函数调用

2.观察与调整（查看/修改参数，篡改返回值，追踪内存读写，调用任意函数（主动调用APP的私有方法））

3.调试与逆向工程

4.动态分析

## 初始化

android端

```
adb shell
su
cd data/local/tmp
./frida-server &
ps -A | grep frida #检测是否启动成功，ps -A显示系统的所有进程， | 将前面的输出做为输入传递给后面,ps是进程的状态命令
```

```
frida-ps -U   #frida-ps自带的进程检测

```

## 启动

众所周知frida有两种启动方式。

一种是spawn，另一种是attch

spawn模式：将启动APP的权利交由Frida来控制，即使程序已经启动，在使用Frida注入程序时还是会重启App

优点：hook时间早，可以在程序刚启动时就执行

```
frida -U -f 包名 -l hook.js
```

-f是full launch的意思

-l是加载的脚本

attch模式：在APP已经启动的情况下，Frida通过ptrace注入程序从而执行Hook操作（其实是附加）

**优点**：稳定

**缺点**：早期函数 hook 不到

例如：

- Application.attach
- JNI_OnLoad
- native 初始化
- 早期检测函数

这些可能已经执行完了。{}

 注入代码

```
frida -U -n "Appname(进程名)" -l hook.js
```

# 0x01说到frida，怎么能少了API

## java层的API

反射是在Java在运行时动态的获取类信息、访问字段、调用方法、创建实例的机制的机制，是java层hook的基础

### 先写Java.perform(() => {...})

Frida注入程序后，ART（android runtime）不一定就绪

Java.perform是等JVM完全初始化后，再执行回调里的代码，所有java层的代码

回调函数是一种特殊的函数，它作为参数传递给另一个函数，并在被调用函数执行完毕后被调用（回调指的是被传入到另一个函数的函数）

### 接着是修改方法

实例方法

```javascript
const Clazz = Java.use("android.widget.Clazz")
Clazz.method1.overload("java.lang.CharSequence").implementaion = 
function(para1){
    //your hook js
    //return value
}
```

1.Java.use("包名.类名")获取一个包装过的javascript代理对象(Wrapper)(是类的抽象代理)，

相当于 Java 里的 `Class.forName()`，但返回的是 Frida 可操作的对象

参数是完整类名，包括包路径

2.Clazz.method 拿到method1这个方法

3./////     .overload("java.lang.CharSequence")指定重载版本----如果方法有多个重载（接收 String、int、CharSequence 等）（这里补充一下CharSequence是可读的字符序列，String 继承于CharSequence，其主要几个接口是length,()subsequence(int start, int end)(提取字符串的一部分),charAT(int index)）,要指明重载的类型，否则frida不知道hook什么

4.//     .implementation = function(...)相当于将原来的整体替换成自己的函数

5.参数para1对应原来方法的参数

6.如果方法有返回值，不写return，原始的method1就不会执行(相当于吞掉调用)











静态方法

```
StaticUtil.getkey.implementation() = function(){3
    return this.getKey();    //this = 类本身，不是实例
};
//实例方法
Activity.onCreate.implementation = functuion(bundle){3
   this.onCreate(bundle);   //this = 当前ACtivity实例
};
```

静态方法和实例方法写法一样，Frida会自动区分

静态方法类似于c++中的静态函数成员(oop是相通的)，所有对象共同拥有

古人云： hook静态方法和实例方法要什么不同？不创建实例怎么hook静态方法？

AI云：“hook”不是“调用”是“替换”，并不需要实例，hook要做的事是：将JVM里这个方法的函数指针替换掉->(接着在调用这个方法)，仅需要找到方法在内存中的位置，跟这个方法没有任何关系

静态与实例的差别：

静态方法在JVNM类加载时就去定地址，属于类，在c++中可以直接通过类访问为所有对象共有的特征，

静态方法在JVM里是

```
类加载时就确定，有固定的地址
调用时直接 invokestatic->跳到固定的地址
```

invoke可以让人们在不知道具体方法的情况下执行

实例方法在JVM里是

```-
通过对象的vtable(虚函数表)分派         //每个方法
调用时，invokevirtual  ->查对象的vtable->跳转
```

虚函数表存放的是虚函数地址表，这张表解决了继承覆盖问题

一日，魔女问：虚函数和和一般函数有什么区别

主要在调用机制上不同，一般函数在编译时就确定了调用地址(静态绑定)，而虚函数在运行时才确定调用哪个版本

```
Base * ptr = new Derived()
ptr -> func()
```

无virtual直接跳转到Base::func(),对象中仅有数据占据内存空间，虚函数先查表找到地址然后跳转

Frida有做的事在ART把方法的入口地址替换掉，无论哪个方法，替换地址这个动作都不需要实例

实例方法在被触发时，Frida会把真是调用者对象作为this交给你，这是和静态方法最核心的

### 还有主动调用方法

Frida里操作java有两种模式

|       操作        |                             方法                             |
| :---------------: | :----------------------------------------------------------: |
| 调用静态方法/字段 |             Java.use("类名").静态方法()直接调用              |
| 调用实例方法/字段 | 必须拿到一个对象实例才行(修改可以在类中修改，一般函数的实现在对象，声明与定义在类中) |

Java.use只是给了个“句柄”(标识符就相当于句柄，相当于反射的Class对象)，不是实例

对于非静态方法，要用Class.$new构造一个对象obj，再obj.method调用，或者Java.choose去堆上找已存在的实例

**静态方法**

```js
const Utils = Java.use("com.eample.app.Utils");
const result = Utils.decrypt("encryptedString");
consle.log("Decrypted", result)
```

不用写implementation，与普通函数调用一样

这里仅是调用静态方法，实例方法要先创建对象(与c++很像，果然语言之间是互通的)

**实例方法，先构造对象**

```
const Foo = Java.use("com.example.Foo");
const instance = Foo.$new("构造参数");   //相当于c++的构造函数，new Foo("构造参数")
const result = instance.someMethod("arg");
```

### 找内存中已经有的实例  -----Java.choose

Java.choose的作用是在Java的堆内存中搜索某个类的所有实例，然后让你对每个实例执行操作

**堆 vs 栈：职能拆解**

| **维度**     | **栈 (Stack)**                                               | **堆 (Heap)**                                 |
| ------------ | ------------------------------------------------------------ | --------------------------------------------- |
| **存储内容** | **局部变量**、方法调用的**栈帧**、基本类型变量、对象的**引用地址**。 | **对象实例**（所有 `new` 出来的东西）、数组。 |
| **存取速度** | **极快**。仅次于寄存器。                                     | **较慢**。需要动态分配内存。                  |
| **空间大小** | 空间较小，由系统自动分配。                                   | 空间很大，由垃圾回收器（GC）管理。            |
| **生命周期** | 随方法调用而生，随方法结束而亡。                             | 只要没有被引用，就会被 GC 回收。              |
| **私有性**   | **线程私有**。每个线程都有自己的栈。                         | **线程共享**。所有线程共用一个堆。            |

```js
Java.choose("完整的类名",{
    onMatch:function(instance){
         //找到一个实例时触发
    },
    onComplete:function(){
        //搜索完成时触发
    }


});
```

本质上是在扫描JVM/ART的堆，找出该类型的对象引用

### js中的对象

函数是对象，函数是JS的"一等公民"，本质上是Function类型的对象

- **原始类型**（不是对象）：`string`、`number`、`boolean`、`Null(仅有一个null值，空对象指针)`、`undefined（表示变量未初始化和赋值）`、`Symbol`（用于创建唯一的标识符）、`bigint`

  是引用

- **对象类型**（是对象）：`Object`、`Array`、`Function`、`Date`、`RegExp` 等

### 补充一下console(控制台)可以干什么

1.基础日志的打印(Logging)

console.log()/console.info()打印普通信息

```
console.log("Value: %d, String: %s", 1024, "Hello Frida");
console.log("man","what can I say")
```

console.warn()/console.error在控制台以醒目的颜色（通常是黄色或红色）显示，适合用来标记异常流程。

2.深度对象查看(Inspecting)

Hook一个复杂对象，log只能打印出[object Object]

console.dir(object):将对象以层级形式展开，打印出其所有可枚举的属性

3.调用栈回溯(Stack  Tracing)

console.trace()：在当前Hook的点打引出完整的JavaScript调用栈

4.记时操作(Profiling)

console.time(label)&console.timeEnd(label):

```js
console.time("HeavyTask");
// 执行耗时操作...
console.timeEnd("HeavyTask"); // 输出: HeavyTask: 12.345ms
```

## native层的API

### 一、获取native层函数对象（找函数）

1.按导出符号查找(最简单)

```
// 有符号名直接找
const addr = Module.getExportByName("libnative.so",
"Java_com_example_MainActivity_check"
);
console.log("地址",addr)
```

Java_com_example_MainActivity_check为标准的JNI函数命名

libnative.so为目标动态链接库名称



2.按模块基址+偏移(IDA里看到的偏移)

```js
const base = Module.getBaseAddress("libnative.so")
//ida显示的是虚拟内存，也就是偏移量,注意 thumb 函数要 +1（最低为是1是自动转为thumb汇编）
const funcAddr = base.add(0x1234)
```

3.枚举所有的导出符号

```js
Module.enumerateExports("libnative.so").forEach(exp=>{
    if(exp.name.includes("verify")||exp.name.includes("check"))
     {
         console.log(exp.name, exp.adress);
     }
});
```

### 二、修改函数   -----Interceptor.attach

```
Interceptor.attach(targetAddr,{
    onEnter(args){
        //args[0],args[1]对应函数参数
        console.log("[+]进入函数");
        console.log("arg[0]", args[0]);   //打印指针的值，指向的地址值
        console.log("arg[0] int:", args[0].toIn32());  //作为int读，将地址值转为 32 位整数，当参数本身就是一个普通的 int 类型（而非指针）时使用。
        console.log("arg0 str", args[0].readUtf8String());   //追踪地址指向的内容
          //保存参数给onLeave使用
        this.arg0 = arg[0];
        args[1] = ptr(0x1);   //将数值 0x1 转换成一个 NativePointer（原生指针）
    },
    //函数返回时触发
    onLeave(retval){
        console.log("[+] 返回值:", retval.toInt32());
        retval.replace(1);
    }
});
```

例子：模板hookJNI函数

```
JNI 函数签名固定：前两个参数是 JNIEnv* 和 jobject/jclass
javascript// 目标：Java_com_ctf_MainActivity_verify(JNIEnv*, jobject, jstring input)
const verify = Module.getExportByName("libnative.so", "Java_com_ctf_MainActivity_verify");

Interceptor.attach(verify, {
    onEnter(args) {
        // args[0] = JNIEnv*
        // args[1] = jobject (this)
        // args[2] = jstring (第一个 Java 参数)

        // 用 Java.vm.getEnv() 读 jstring 内容
        const env = Java.vm.getEnv();
        const input = env.getStringUtfChars(args[2], null).readCString();
        console.log("[*] 输入:", input);
    },
    onLeave(retval) {
        console.log("[*] 结果:", retval.toInt32());
        retval.replace(1); // 强制返回 true
    }
});
```

### 三、主动调用   -----NativeFunction

导出函数

```
const  add = new NativeFunction(
     Module.getExportByname("libnative.so", "add"),
     'int',   //返回值类型
     ['int', 'int']  //参数类型
     
     
);
const result = add(3, 5);
console.log("结果:", result);
```

| C/JNI 类型                      | NativeFunction 中写法 |
| :------------------------------ | :-------------------- |
| `void`                          | `'void'`              |
| `int` / `jint`                  | `'int'`               |
| `unsigned int`                  | `'uint'`              |
| `long`                          | `'long'`              |
| `int64_t` / `jlong`             | `'int64'`             |
| `uint64_t`                      | `'uint64'`            |
| `float`                         | `'float'`             |
| `double`                        | `'double'`            |
| `char` / `uint8_t` / `jboolean` | `'uint8'`             |
| `xxx*` / 任何指针               | `'pointer'`           |
| `size_t`                        | `'size_t'`            |

对于非导出函数，只能在IDA中看偏移

```
Java.perform(() => {
    // 1. 获取模块基址，建议增加 null 检查
    const moduleName = "libnative.so";
    const base = Module.findBaseAddress(moduleName);
    if (base === null) {
        console.error(`[-] 找不到模块: ${moduleName}`);
        return;
    }

    // 2. 修正地址计算逻辑
    // 错误点：(0x2A40 | 1) 会先做位运算再加。正确做法是基址 + 偏移，再对结果 OR 1
    // 仅在 32 位 ARM 且确定是 Thumb 函数时才需要 .or(1)
    const offset = 0x2A40;
    let funcAddr = base.add(offset);

    // 如果是 32 位 ARM 且是 Thumb 指令集，必须补 1
    if (Process.arch === 'arm') {
        funcAddr = funcAddr.or(1); 
        console.log("[+] 32位ARM检测，已补1以适配Thumb模式");
    }

    console.log(`[+] 最终 Hook 地址: ${funcAddr}`);

    // 3. 定义 NativeFunction
    const decrypt = new NativeFunction(
        funcAddr,
        'pointer',           // 返回值类型
        ['pointer', 'int']    // 参数类型列表
    );

    try {
        // 4. 分配内存并调用
        const inputStr = "encrypted";
        const input = Memory.allocUtf8String(inputStr);
        
        // 调用函数
        const resultPtr = decrypt(input, inputStr.length);

        // 5. 检查返回值是否为空指针
        if (!resultPtr.isNull()) {
            console.log("解密结果:", resultPtr.readUtf8String());
        } else {
            console.log("[-] 解密失败，返回空指针");
        }
    } catch (e) {
        console.error("[-] 调用函数崩溃:", e);
    }
});
```

怎么知道是不是thumb(地址存在对其现象)

#### 方法 A：看 IDA 状态栏

在 IDA 中点击该函数名，看右下角的状态栏。

- 如果显示 **`CODE16`** 或 **`T`** 这是 Thumb 函数，**必须 | 1**。
- 如果显示 **`CODE32`** 或 A 这是 ARM 函数，**直接用，不要 | 1**。

#### 方法 B：看指令长度

- Thumb 指令：通常每行占用 2 个字节（例如地址从 `0x2A40` 跳到 `0x2A42`）。
- ARM 指令：严格每行占用 4 个字节（例如地址从 `0x2A40` 跳到 `0x2A44`）。

------

### 4. 重点：ARM64 (AArch64) 不需要补 1

如果你分析的是 64 位手机（现代 Android 几乎全是），这个问题就简单了：

- **ARM64 砍掉了 Thumb 模式。**
- 所有指令都是 4 字节对齐。
- **永远不需要 `| 1`**。如果你强行给 64 位地址补 1，反而会因为地址未对齐（Alignment Fault）导致崩溃。

# 常见的检测

ptrace进程占用,会有frida-server进程，内存映射(读取proc/self/maps)，残留字符，对27042端口的监听

# 0x0

frida的常见用法:frida-ps -Uai

frida-ps:显示Android设备上的进程信息

-U该选项作用与连接的设备(一看就是在电脑命令行中的)

-a:列出所有的进程

-i:包含每个进程的详细信息(进程名（Name）和进程id（PID）,Identifier包名)

```
frida-ps -Uai | grep '<name_of_application>'
```

用以获取应用的包名



```
frida -U -f 包名
```

附加应用

 

# 0x01

可以先pip list看一下过来什么东西，发现现在已经下了不少东西了

先连接设备运行frida

```
adb shell
su
cd data/local/tmp
./frida-server --version

```

id查看用户身份

ls -l列出文件列表与属性(-l表示long format)展示文件的类型与权限

模板

```JS
Java.perform(function()
{
    //声明变量表示映射的Java类
    //packagename程序的包名,<class>目标方法所在类
    var claz = Java.use("packagename.<class>");
    claz.method.implementation = function(args)
    {
        
    }
})
```

想知道进程怎么样可以frida-ps -Uai(i表示详细信息)

找到mainactivity

刚进去就发现关键函数

```java
Button button = (Button) findViewById(R.id.button);
button.setOnClickListener(new View.OnClickListener() { // from class: com.ad2001.frida0x1.MainActivity.1
            @Override // android.view.View.OnClickListener
            public void onClick(View view) {
                String string = editText.getText().toString();
                if (TextUtils.isDigitsOnly(string)) {
                    MainActivity.this.check(i, Integer.parseInt(string));
                } else {
                    Toast.makeText(MainActivity.this.getApplicationContext(), "Enter a valid number !!", 1).show();
                }
            }
        });
    }


```

button对象有onClick方法，

如果仅是有效数字才触发check函数

看这个函数MainActivity.this.check(i, Integer.parseInt(string));

已经知道了一个参数nteger.parseInt(string))将字符串转换为整数，i来自get_random()

```
  int get_random() {
        return new Random().nextInt(100);
    }
```

nextInt生成0~99之间

接着验证是

随机数*2+4 == 输入

(1)关键是要patch出来随机数

直接./frida-server会占到前台，干不了别的事

./frida-server &将程序挂到后台，当前程序可以进行其他操作

前台可以ctrl +z先暂停，之后bg都到后台运行

fg  %n(n是作业号)将后台丢到到前台

```js
Java.perform(function()
{
    var MA = Java.use("com.ad2001.frida0x1.MainActivity");
    MA.get_random.implementation = function(){
        var get = this.get_random();
        console.log("get_random的返回值是", get*2+4);
        return get;
    }
}
)
```

```
frida -U -f com.ad2001.frida0x1 -l ./2.js
```

然后就对了

frida -U -f  ./2.js就是页面程序的attch模式

(2)接着也可以hook关键函数

```js
Java.perform(function()
{
    var MA = Java.use("com.ad2001.frida0x1.MainActivity");
    MA.get_random.implementation = function(){
        return 1;
    }
}
)
```

直接篡改返回值

(3)还可以hookcheck函数

```js
Java.perform(function()
{
    var MA = Java.use("com.ad2001.frida0x1.MainActivity");
    MA.check.overload('int', 'int').implementation = function(a, b)
    {
        this.check(1,6);
    }

}
);
```

# 0X02

直接明摆着hookme，我倒要hook一下

![1](/new/1.jpg)

直接看a = 4919时触发解密操作

```js
Java.perform(function() {
    var a = Java.use("com.ad2001.frida0x2.MainActivity");
    a.get_flag(4919);
  });
settime(函数名,1000);//单位毫秒
```

直接frida -UF -l hook.js(以attch模式运行)[程序必须在前台运行]

用spawn模式有些不一定加载完成

frida -U -n "Frida 0x2" -l 3.js(注意-n的是进程名，可以通过frida-ps -U列出进程名)

# 0x03

![2](/new/2.jpg)

关键函数是让Check的code属性成员为512

```java
package com.ad2001.frida0x3;

/* loaded from: classes3.dex */
public class Checker {
    static int code = 0;

    public static void increase() {
        code += 2;
    }
}
```

直捣黄龙发现是个静态变量，这个好

直接脚本启动

```js
Java.perform(function(){
    let a = Java.use('com.ad2001.frida0x3.Checker');
    a.code.value = 512;

}
);
```

```
frida -U -n "Frida 0x3" -l 4.js
```

得到flag

Java.use()` 返回的是类包装对象，其中的value属性供读写

# 0x04

![3](/new/3.jpg)

分析一下左面这些分层都是什么

1.源代码:显示从class.dex文件反编译出来的Java/Kotlin的源码（按包名组织）

2.资源文件（res）：布局文件（`layout/`）、图片（`drawable/`）、字符串（`values/strings.xml`）、颜色、样式、动画等

3.AndroidMaindext.xml全局配置文件

包含报名，权限。最低SDK版本，四大组件(Activity,Service,Broadcastreceiver,ContentProvider)

```c
package com.ad2001.frida0x4;

/* loaded from: classes3.dex */
public class Check {
    public String get_flag(int a) {
        if (a == 1337) {
            byte[] decoded = new byte["I]FKNtW@]JKPFA\\[NALJr".getBytes().length];
            for (int i = 0; i < "I]FKNtW@]JKPFA\\[NALJr".getBytes().length; i++) {
                decoded[i] = (byte) ("I]FKNtW@]JKPFA\\[NALJr".getBytes()[i] ^ 15);
            }
            return new String(decoded);
        }
        return "";
    }
}
```

关键代码，只要调用check函数参数为1337就解密

```js
Java.perform(
 function()
 {
    var a = Java.use("com.ad2001.frida0x4.Check");
    var b = a.$new();
    var str = b.get_flag(1337);
    console.info("flag点击即送", str);
 }
);
```

flag点击即送 FRIDA{XORED_INSTANCE}

当然str前不加var本应声明为全局变量，可是无事发生，这表明frida与常规的环境还是有区别的

# 0x05

又是意义不明的开屏

依旧公式化找activity标签

这里的

```js
public class MainActivity extends AppCompatActivity {
    TextView t1;

    @Override // androidx.fragment.app.FragmentActivity, androidx.activity.ComponentActivity, androidx.core.app.ComponentActivity, android.app.Activity
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);//继承父类
        setContentView(R.layout.activity_main);
        this.t1 = (TextView) findViewById(R.id.textview);//控件
    }

    public void flag(int code) throws BadPaddingException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, InvalidKeyException, InvalidAlgorithmParameterException {
        if (code == 1337) {
            try {
                SecretKeySpec secretKeySpec = new SecretKeySpec("WILLIWOMNKESAWEL".getBytes(), "AES");
                Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
                IvParameterSpec iv = new IvParameterSpec(new byte[16]);
                cipher.init(2, secretKeySpec, iv);
                byte[] decodedEnc = Base64.getDecoder().decode("2Y2YINP9PtJCS/7oq189VzFynmpG8swQDmH4IC9wKAY=");
                byte[] decryptedBytes = cipher.doFinal(decodedEnc);
                String decryptedText = new String(decryptedBytes);
                this.t1.setText(decryptedText);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

```

t1是在Oncreate是创建，有其继承空间使用导致不能直接创建实例，缺少了父类的初始化

```js
Java.perform(
function()
{
    Java.choose("com.ad2001.frida0x5.MainActivity",{
        onMatch:function(a){
            console.log("Found instance: " );
            a.flag(1337)
        },
        onComplete:function(){}
    })
}
);
```

## Activity



是一个窗口/界面

其生命周期是启动Activity->Oncreate（首次创建时调用，仅一次）,onStart(界面可见但还未在前台)-》onResume获得焦点，用户可以交互-> 跳转到其他界面->onPause失去焦点，但是还不分拣

# 0x06

打开程序又是Hello world什么都看不出来

![4](/new/4.jpg)

主要是hook

getclass()获取获取当前class的对象其有方法`getDeclaredFields()`包含**该类自身声明的所有字段**（public、protected、default、private），但不包括从父类继承的字段



```js
Java.perform(function()
{
   
    Java.choose("com.ad2001.frida0x6.MainActivity",{
        onMatch: function(c)
        {
            var a = Java.use("com.ad2001.frida0x6.Checker");
            var t = a.$new();
            t.num1.value = 0x4D2;
            t.num2.value = 0x10E1;
            console.log("找到实例");
            c.get_flag(t);
            
        },
        onComplete:function()
        {

        }
    })
}
);
```

对之进行修改要hookvalue属性，t.num1是对象

# 0x07

```js
Java.perform(function()
{
   
    Java.choose("com.ad2001.frida0x7.MainActivity",{
        onMatch: function(c)
        {
            var a = Java.use("com.ad2001.frida0x7.Checker");
            var t = a.$new(513,513);
            console.log("找到实例");
            c.flag(t);
            
        },
        onComplete:function()
        {

        }
    })
}
);
```

和上道题差不多
