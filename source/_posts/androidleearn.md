---
title: androidleearn
date: 2026-02-02 15:48:54
tags: reverse
---

# 一段dex文件的smali代码分析

```
     修饰符  /* 私有   静态   不可修改*/  方法名              参数
.method private static final onCreate$lambda-2(Lkotlin/jvm/internal/Ref$IntRef;Lcom/zj/wuaipojie/ui/ChallengeSecond;Landroid/widget/ImageView;Landroid/widget/ImageView;Landroid/widget/ImageView;Landroid/view/View;)Z（返回值的类型）
    .registers 7   //寄存器的数量

                              .line 33    //代码的行数
    00719444: 5211 0098               0000: iget                v1, v1, Lkotlin/jvm/internal/Ref$IntRef;->element:I # field@9800        //提取v1   iget  <目标寄存器><对象寄存器><字段描述符>
    00719448: 1216                    0002: const/4             v6, 0x1  //v6复制1，4位字面量（-8到7）
    0071944a: 1300 0a00               0003: const/16            v0, 0xa
    0071944e: 3501 1000               0005: if-ge               v1, v0, :cond_0015   //v1>=10跳转
                              .line 34// 常见的toast弹窗代码
    00719452: 0721                    0007: move-object         v1, v2   //只用于对象的复制
    00719454: 1f01 6300               0008: check-cast          v1, Landroid/content/Context; # type@0063
   //检查是否对象引用     
    00719458: 1a00 77ed               000a: const-string        v0, "请先获取10个硬币哦" # string@ed77
   //将弹窗文本写入
   0071945c: 1f00 ee14               000c: check-cast          v0, Ljava/lang/CharSequence; # type@14ee
   //检查CharSequence引用对象的使用
   00719460: 7130 b111 0106          000e: invoke-static       {v1, v0, v6}, Landroid/widget/Toast;->makeText(Landroid/content/Context;, Ljava/lang/CharSequence;, I)Landroid/widget/Toast; # method@11b1
   //将弹窗信息和时间等传递，invoke_static调用静态方法的指令
   // Android源码中的定义
public class Toast {
    public static final int LENGTH_SHORT = 0;  // 短时间显示（约2秒）
    public static final int LENGTH_LONG = 1;   // 长时间显示（约3.5秒）
}//
   00719466: 0c01                    0011: move-result-object  v1
   //将结果传给v1
    00719468: 6e10 b211 0100          0012: invoke-virtual      {v1}, Landroid/widget/Toast;->show()V # method@11b2   //弹窗显示
                              .line 36      //会员检验
                            cond_0015:
    0071946e: 6e10 c49c 0200          0015: invoke-virtual      {v2}, Lcom/zj/wuaipojie/ui/ChallengeSecond;->isvip()Z # method@9cc4      //invoke-virtual调用虚拟方法，检验是否为vip
    00719474: 0a01                    0018: move-result         v1   //将结果放v1
    00719476: 3801 2a00               0019: if-eqz              v1, :cond_0043  //如果为0则跳转
                              .line 37
    0071947a: 1f02 6300               001b: check-cast          v2, Landroid/content/Context; # type@0063
    0071947e: 1a01 6ced               001d: const-string        v1, "当前已经是大会员了哦！" # string@ed6c
    00719482: 1f01 ee14               001f: check-cast          v1, Ljava/lang/CharSequence; # type@14ee
    00719486: 7130 b111 1206          0021: invoke-static       {v2, v1, v6}, Landroid/widget/Toast;->makeText(Landroid/content/Context;, Ljava/lang/CharSequence;, I)Landroid/widget/Toast; # method@11b1
    0071948c: 0c01                    0024: move-result-object  v1
    0071948e: 6e10 b211 0100          0025: invoke-virtual      {v1}, Landroid/widget/Toast;->show()V # method@11b2
    00719494: 1401 1c00 0d7f          0028: const               v1, 0x7f0d001c
                              .line 38
    0071949a: 6e20 e40f 1300          002b: invoke-virtual      {v3, v1}, Landroid/widget/ImageView;->setImageResource(I)V # method@0fe4
    007194a0: 1401 0900 0d7f          002e: const               v1, 0x7f0d0009
                              .line 39
    007194a6: 6e20 e40f 1400          0031: invoke-virtual      {v4, v1}, Landroid/widget/ImageView;->setImageResource(I)V # method@0fe4
    007194ac: 1401 0b00 0d7f          0034: const               v1, 0x7f0d000b
                              .line 40
    007194b2: 6e20 e40f 1500          0037: invoke-virtual      {v5, v1}, Landroid/widget/ImageView;->setImageResource(I)V # method@0fe4   //再有10枚硬币且为大会员
                              .line 41
    007194b8: 6201 8f95               003a: sget-object         v1, Lcom/zj/wuaipojie/util/SPUtils;->INSTANCE:Lcom/zj/wuaipojie/util/SPUtils; # field@958f
    007194bc: 1223                    003c: const/4             v3, 0x2         //p2赋值为1
    007194be: 1a04 96b1               003d: const-string        v4, "level" # string@b196  
//SP为SHAREDPREFERENCE用于存储简单的键对数据，key对应的value， sp的索引
    007194c2: 6e40 729d 2134          003f: invoke-virtual      {v1, v2, v4, v3}, Lcom/zj/wuaipojie/util/SPUtils;->saveInt(Landroid/content/Context;, Ljava/lang/String;, I)V # method@9d72
    //sp数据的写入
    007194c8: 280e                    0042: goto                :goto_0050  //跳转地址
                              .line 44
                            cond_0043:
    007194ca: 1f02 6300               0043: check-cast          v2, Landroid/content/Context; # type@0063
    007194ce: 1a01 75ed               0045: const-string        v1, "请先充值大会员哦！" # string@ed75
    007194d2: 1f01 ee14               0047: check-cast          v1, Ljava/lang/CharSequence; # type@14ee
    007194d6: 7130 b111 1206          0049: invoke-static       {v2, v1, v6}, Landroid/widget/Toast;->makeText(Landroid/content/Context;, Ljava/lang/CharSequence;, I)Landroid/widget/Toast; # method@11b1
    007194dc: 0c01                    004c: move-result-object  v1
    007194de: 6e10 b211 0100          004d: invoke-virtual      {v1}, Landroid/widget/Toast;->show()V # method@11b2
                            goto_0050:
    007194e4: 0f06                    0050: return              v6//方法的结束
    
.end method
.method public final isvip()Z
    .registers 2

    007194f8: 1200                    0000: const/4             v0, 0
    007194fa: 0f00                    0001: return              v0
    
.end method

```

这是一个方法从开始时到结束

# 拦窗（开屏广告）去除

## 法一：修改弹窗时间（class.dex）

## 法二：activity的切换

直接找androidmainfest.xml

```
//必须声明可视化界面的activity，必须用mainfest.xml中的<activity>表示所有的的activity(声明、注册、定义)，系统并不会识别和运行任何未生命的activity
<activity
            android:name="com.zj.wuaipojie.ui.ChallengeSixth"
            android:exported="false" />
        <activity
            android:name="com.zj.wuaipojie.ui.ChallengeFifth"
            android:exported="true" />
        <activity
            android:name="com.zj.wuaipojie.ui.ChallengeFourth"
            android:exported="true" />
        <activity
            android:name="com.zj.wuaipojie.ui.ChallengeThird"
            android:exported="false" />
        <activity
            android:name="com.zj.wuaipojie.ui.ChallengeSecond"
            android:exported="false" />
        <activity android:name="com.zj.wuaipojie.ui.AdActivity" />
        <activity
            android:label="@7F10001B"
            android:name="com.zj.wuaipojie.ui.MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name="com.zj.wuaipojie.ui.ChallengeFirst" />
    </application>
</manifest>

```

# 2. io重定向

io重定向定义是在读A文件时指向b文件

主要干的是1.禁止访问文件2.文件只读3.路径替换

具体应用：1.过签名检测2.风控对抗（检测文件打开次数）3.对root和xposed的检测（文件不可取）

[《安卓逆向这档事》六、校验的N次方-签名校验对抗、PM代{过}{滤}理、IO重定向 - 吾爱破解 - 52pojie.cn](https://www.52pojie.cn/thread-1731181-1-1.html)

```
using namespace std;  
string packname;  
string origpath;  
string fakepath;  

int (*orig_open)(const char *pathname, int flags, ...);  
int (*orig_openat)(int,const char *pathname, int flags, ...);  
FILE *(*orig_fopen)(const char *filename, const char *mode);  
static long (*orig_syscall)(long number, ...);  
int (*orig__NR_openat)(int,const char *pathname, int flags, ...);  

void* (*orig_dlopen_CI)(const char *filename, int flag);  
void* (*orig_dlopen_CIV)(const char *filename, int flag, const void *extinfo);  
void* (*orig_dlopen_CIVV)(const char *name, int flags, const void *extinfo, void *caller_addr);  

static inline bool needs_mode(int flags) {  
    return ((flags & O_CREAT) == O_CREAT) || ((flags & O_TMPFILE) == O_TMPFILE);  
}  
bool startsWith(string str, string sub){  
    return str.find(sub)==0;  
}  

bool endsWith(string s,string sub){  
    return s.rfind(sub)==(s.length()-sub.length());  
}  
bool isOrigAPK(string  path){  

    if(path==origpath){  
        return true;  
    }  
    return false;  
}  
//该函数的功能是在打开一个文件时进行拦截，并在满足特定条件时将文件路径替换为另一个路径  

//fake_open 函数有三个参数：  
//pathname：一个字符串，表示要打开的文件的路径。  
//flags：一个整数，表示打开文件的方式，例如只读、只写、读写等。  
//mode（可选参数）：一个整数，表示打开文件时应用的权限模式。  
int fake_open(const char *pathname, int flags, ...) {  
    mode_t mode = 0;  
    if (needs_mode(flags)) {  
        va_list args;  
        va_start(args, flags);  
        mode = static_cast<mode_t>(va_arg(args, int));  
        va_end(args);  
    }  
    //LOGI("open,  path: %s, flags: %d, mode: %d",pathname, flags ,mode);  
    string cpp_path= pathname;  
    if(isOrigAPK(cpp_path)){  
        LOGI("libc_open, redirect: %s, --->: %s",pathname, fakepath.data());  
        return orig_open("/data/user/0/com.zj.wuaipojie/files/base.apk", flags, mode);  
    }  
    return  orig_open(pathname, flags, mode);  

}  

//该函数的功能是在打开一个文件时进行拦截，并在满足特定条件时将文件路径替换为另一个路径  

//fake_openat 函数有四个参数：  
//fd：一个整数，表示要打开的文件的文件描述符。  
//pathname：一个字符串，表示要打开的文件的路径。  
//flags：一个整数，表示打开文件的方式，例如只读、只写、读写等。  
//mode（可选参数）：一个整数，表示打开文件时应用的权限模式。  
//openat 函数的作用类似于 open 函数，但是它使用文件描述符来指定文件路径，而不是使用文件路径本身。这样，就可以在打开文件时使用相对路径，而不必提供完整的文件路径。  
//例如，如果要打开相对于当前目录的文件，可以使用 openat 函数，而不是 open 函数，因为 open 函数只能使用绝对路径。  
//  
int fake_openat(int fd, const char *pathname, int flags, ...) {  
    mode_t mode = 0;  
    if (needs_mode(flags)) {  
        va_list args;  
        va_start(args, flags);  
        mode = static_cast<mode_t>(va_arg(args, int));  
        va_end(args);  
    }  
    LOGI("openat, fd: %d, path: %s, flags: %d, mode: %d",fd ,pathname, flags ,mode);  
    string cpp_path= pathname;  
    if(isOrigAPK(cpp_path)){  
        LOGI("libc_openat, redirect: %s, --->: %s",pathname, fakepath.data());  
        return  orig_openat(fd,fakepath.data(), flags, mode);  
    }  
    return orig_openat(fd,pathname, flags, mode);  

}  
FILE *fake_fopen(const char *filename, const char *mode) {  

    string cpp_path= filename;  
    if(isOrigAPK(cpp_path)){  
        return  orig_fopen(fakepath.data(), mode);  
    }  
    return orig_fopen(filename, mode);  
}  
//该函数的功能是在执行系统调用时进行拦截，并在满足特定条件时修改系统调用的参数。  
//syscall 函数是一个系统调用，是程序访问内核功能的方法之一。使用 syscall 函数可以调用大量的系统调用，它们用于实现操作系统的各种功能，例如打开文件、创建进程、分配内存等。  
//  
static long fake_syscall(long number, ...) {  
    void *arg[7];  
    va_list list;  

    va_start(list, number);  
    for (int i = 0; i < 7; ++i) {  
        arg[i] = va_arg(list, void *);  
    }  
    va_end(list);  
    if (number == __NR_openat){  
        const char *cpp_path = static_cast<const char *>(arg[1]);  
        LOGI("syscall __NR_openat, fd: %d, path: %s, flags: %d, mode: %d",arg[0] ,arg[1], arg[2], arg[3]);  
        if (isOrigAPK(cpp_path)){  
            LOGI("syscall __NR_openat, redirect: %s, --->: %s",arg[1], fakepath.data());  
            return orig_syscall(number,arg[0], fakepath.data() ,arg[2],arg[3]);  
        }  
    }  
    return orig_syscall(number, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6]);  

}  

//函数的功能是获取当前应用的包名、APK 文件路径以及库文件路径，并将这些信息保存在全局变量中  
//函数调用 GetObjectClass 和 GetMethodID 函数来获取 context 对象的类型以及 getPackageName 方法的 ID。然后，函数调用 CallObjectMethod 函数来调用 getPackageName 方法，获取当前应用的包名。最后，函数使用 GetStringUTFChars 函数将包名转换为 C 字符串，并将包名保存在 packname 全局变量中  
//接着，函数使用 fakepath 全局变量保存了 /data/user/0/<packname>/files/base.apk 这样的路径，其中 <packname> 是当前应用的包名。  
//然后，函数再次调用 GetObjectClass 和 GetMethodID 函数来获取 context 对象的类型以及 getApplicationInfo 方法的 ID。然后，函数调用 CallObjectMethod 函数来调用 getApplicationInfo 方法，获取当前应用的 ApplicationInfo 对象。  
//它先调用 GetObjectClass 函数获取 ApplicationInfo 对象的类型，然后调用 GetFieldID 函数获取 sourceDir 字段的 ID。接着，函数使用 GetObjectField 函数获取 sourceDir 字段的值，并使用 GetStringUTFChars 函数将其转换为 C 字符串。最后，函数将 C 字符串保存在 origpath 全局变量中，表示当前应用的 APK 文件路径。  
//最后，函数使用 GetFieldID 和 GetObjectField 函数获取 nativeLibraryDir 字段的值，并使用 GetStringUTFChars 函数将其转换为 C 字符串。函数最后调用 LOGI 函数打印库文件路径，但是并没有将其保存在全局变量中。  

extern "C" JNIEXPORT void JNICALL  
Java_com_zj_wuaipojie_util_SecurityUtil_hook(JNIEnv *env, jclass clazz, jobject context) {  
    jclass conext_class = env->GetObjectClass(context);  
    jmethodID methodId_pack = env->GetMethodID(conext_class, "getPackageName",  
                                               "()Ljava/lang/String;");  
    auto packname_js = reinterpret_cast<jstring>(env->CallObjectMethod(context, methodId_pack));  
    const char *pn = env->GetStringUTFChars(packname_js, 0);  
    packname = string(pn);  

    env->ReleaseStringUTFChars(packname_js, pn);  
    //LOGI("packname: %s", packname.data());  
    fakepath= "/data/user/0/"+ packname +"/files/base.apk";  

    jclass conext_class2 = env->GetObjectClass(context);  
    jmethodID methodId_pack2 = env->GetMethodID(conext_class2,"getApplicationInfo","()Landroid/content/pm/ApplicationInfo;");  
    jobject application_info = env->CallObjectMethod(context,methodId_pack2);  
    jclass pm_clazz = env->GetObjectClass(application_info);  

    jfieldID package_info_id = env->GetFieldID(pm_clazz,"sourceDir","Ljava/lang/String;");  
    auto sourceDir_js = reinterpret_cast<jstring>(env->GetObjectField(application_info,package_info_id));  
    const char *sourceDir = env->GetStringUTFChars(sourceDir_js, 0);  
    origpath = string(sourceDir);  
    LOGI("sourceDir: %s", sourceDir);  

    jfieldID package_info_id2 = env->GetFieldID(pm_clazz,"nativeLibraryDir","Ljava/lang/String;");  
    auto nativeLibraryDir_js = reinterpret_cast<jstring>(env->GetObjectField(application_info,package_info_id2));  
    const char *nativeLibraryDir = env->GetStringUTFChars(nativeLibraryDir_js, 0);  
    LOGI("nativeLibraryDir: %s", nativeLibraryDir);  
    //LOGI("%s", "Start Hook");  

    //启动hook  
    void *handle = dlopen("libc.so",RTLD_NOW);  
    auto pagesize = sysconf(_SC_PAGE_SIZE);  
    auto addr = ((uintptr_t)dlsym(handle,"open") & (-pagesize));  
    auto addr2 = ((uintptr_t)dlsym(handle,"openat") & (-pagesize));  
    auto addr3 = ((uintptr_t)fopen) & (-pagesize);  
    auto addr4 = ((uintptr_t)syscall) & (-pagesize);  

    //解除部分机型open被保护  
    mprotect((void*)addr, pagesize, PROT_READ | PROT_WRITE | PROT_EXEC);  
    mprotect((void*)addr2, pagesize, PROT_READ | PROT_WRITE | PROT_EXEC);  
    mprotect((void*)addr3, pagesize, PROT_READ | PROT_WRITE | PROT_EXEC);  
    mprotect((void*)addr4, pagesize, PROT_READ | PROT_WRITE | PROT_EXEC);  

    DobbyHook((void *)dlsym(handle,"open"), (void *)fake_open, (void **)&orig_open);  
    DobbyHook((void *)dlsym(handle,"openat"), (void *)fake_openat, (void **)&orig_openat);  
    DobbyHook((void *)fopen, (void *)fake_fopen, (void**)&orig_fopen);  
    DobbyHook((void *)syscall, (void *)fake_syscall, (void **)&orig_syscall);  
}

```

```
        sget-object p10, Lcom/zj/wuaipojie/util/ContextUtils;->INSTANCE:Lcom/zj/wuaipojie/util/ContextUtils;  

    invoke-virtual {p10}, Lcom/zj/wuaipojie/util/ContextUtils;->getContext()Landroid/content/Context;  

    move-result-object p10  

    invoke-static {p10}, Lcom/zj/wuaipojie/util/SecurityUtil;->hook(Landroid/content/Context;)V
    #smali代码主要是获取文本，并传入hook方法
```



先找到check_crc方法的位置（dex文件方法名搜索），之后找到调用，在在最开始的方法下站下上面两个代码下面的哪个，然后在

数据目录一中新建files文件夹再将原包转移过来，之后命名为base.apk

# android的so入门

先介绍一下静态库与动态库(静态库是直接装载到代码中，使得程序的内存变得很大，动态库是运行时加载)

在windows中的静态库是.lib，动态库.dll

在linux的静态库时.a，动态库是.so

在java中调用c/c++的lib库()     ->nativec++的工程, 有两种方法

```
static{
    System.loadlibrary("example");       //example是字符串名称
}
public static native    void Mthod()                   //注册native接口
```

so（lib库）的代码在main->cpp->native-lib.cpp,在旁边的txt文件是编译后结果（有源文件、库名，还有其他库能不能用这个库（shared表示能））而find

loadlibrary函数发现在程序中是找不到源码的，是在android源码中定义的



首先是loadlibrary函数，接着执行loadlibrary0，通过映射得到新类，然后传入名字，之后接着是findlibrary函数找到库的地址，之后判断这个结果是否为空，之后是nativeload函数为c/c++函数，为静态绑定函数

静态绑定是程序编译过程中，把函数（方法或过程）与响应的代码结合的过程（前面是路径名后面是类名）

从java层到native层默认传两个参数JNIEnv * env与jclass

关心path与lib，最后是检验JNI_onload的符号

最先调用是elf文件的initarry函数（）

so会在linker中装载，call_arry会调用initarry的所有函数

![2](/pythonlearn/2.jpg)

c/c++中的工具ndk（原生工具），java是sdk

反射调用时参数首先是调用的静态函数，调用的方法，调用方法的参数

jnitrace（基于frida），pip install jnitrace（动态跟踪）

jnitrace -l libndk.so xxx.ndkn

# frida

```
adb shell
su
```



```
cd /data/local/tmp
./frida-server &
ps -A | grep frida #检验是否启动成功
```

```
frida-ps -U   #检测连接，再开个窗口（检测服务是否正常）
adb forward tcp:27042 tcp:27042    #有必要端口转发
```

## 注入模式

frida -f 启动程序比frida -n进程早的多

spawn模式：将启动APP的权利交由Frida来控制，即使程序已经启动，在使用Frida注入程序时还是会重启App

优点：hook时间早，可以在程序刚启动时就执行

比如：

- JNI_Omload

- Application.attch

- Activity.Oncreate

- 反调试代码

- root检验

- anti-frida

缺点是：有些APP检测spawn行为

例如

- anti-debug

- anti-frida

- ptrace检测

接着是脚本注入代码

```
frida -U -f 包名 -l hook.js
```

-f 是在启动一个新进程并附加

-n是在原有的进程中附加

attch模式：在APP已经启动的情况下，Frida通过ptrace注入程序从而执行Hook操作

**优点**：稳定

**缺点**：早期函数 hook 不到

例如：

- Application.attach
- JNI_OnLoad
- native 初始化
- 早期检测函数

这些可能已经执行完了。

 注入代码

```
frida -U -n 包名 -l hook.js
```

## 常用的API

模板

```js
Java.perform(function() {

  var <class_reference> = Java.use("<package_name>.<class>");
  <class_reference>.<method_to_hook>.implementation = function(<args>) {

   
  }

})
```

1.java.performance：Frida的context函数（js代码在执行前，会有个预加载的过程，目的是建立当前js代码的执行环境，而这个执行环境就是上下文，上下文有三种首先是全局上下文，一旦代码被载入，引擎最先进入的就是这个环境。接着是函数执行上下文：当执行一个函数时，运行函数体中的代码，eval上下文，在eval函数中运行的代码）（另一种上下文是函数上下文）

2.Frida在Android提供的Java API如 `Java.use()`、`Java.perform()` 等）

实际上是在native层调用ART/Dalvik（类似于一个虚拟机）的内部接口，实现Java反射等功能

3.`var <class_reference> = Java.use("<package_name>.<class>");`

<class_reference>表明是android应用程序的java类。`Java.use`，该函数以类名作为参数。<package_name>.\<class>中的package_name表示包名，\<class>表示您要与之交互的类

4.<class_reference>.<method_to_hook>.implementation = function(<args>) {}`

在选定类中，可以使用hook语法范围要hook挂钩的方法，并指定要挂勾的<class_reference>.<method_to_hook>。可以指定要执行的自定义逻辑。`arguments``<args>`表示传递给函数的参数。

### java hook

1.hook普通的方法，打印参数和修改返回值，替换参数

```
function hookTest1(){
    Java.perform(function(){
        //获取一个名为"类名"的Java类，并将其实例赋值给JavaScript变量utils
    var utils = Java.use("类名");
    //修改"类名"的"method"方法的实现。这个新的实现会接收两个参数（a和b）
    utils.$init.overload.......
    utils.method.overload('int','int').implementation = function(a, b){
            //将参数a和b的值改为123和456。
        a = 123;
        b = 456;
        //调用修改过的"method"方法，并将返回值存储在`retval`变量中
        var retval = this.method(a, b);
        //在控制台上打印参数a，b的值以及"method"方法的返回值
        console.log(a, b, retval);
        //返回"method"方法的返回值
        return retval;
        //替换参数
        this.method(xxx,xxx);
    }
        })
}

```

java中的this关键字表示对当前对象的引用，可以构造函数，由无参构造函数调用有参构造函数（构造函数指的是方法名与类名相同的方法）

2.Hook静态方法和字段

```
//静态方法的主动调用
function hookTest9(){
    Java.perform(function(){
       var ClassName=Java.use("类名");
       ClassName.privateFunc("6666");
    })
}
```

```js
function hookTest5(){
    Java.perform(function(){
        //静态字段的修改
        var utils = Java.use("类名");
        //修改类的静态字段"flag"的值
        utils.staticField.value = "我是被修改的静态变量";
        console.log(utils.staticField.value);
        //非静态字段的修改
        // 使用`Java.choose()`枚举类的所有实例
        Java.choose("类名", {
            onMatch: function(obj){
                    //修改实例的非静态字段"_privateInt"的值为"123456"，并修改非静态字段"privateInt"的值为9999。
                obj._privateInt.value = "123456"; //字段名与函数名相同 前面加个下划线
                obj.privateInt.value = 9999;
            },
            onComplete: function(){

            }
        });
    });

}
```

3.主动调用

非静态方法

```
function hooktest(){
    Java.perform(function() {

  var check = Java.use("类名");
  var check_obj = check.$new(); // Class Object
  var res = check_obj.get_flag('value'); // Calling the method
  console.log("FLAG " + res);

})

}
```

```
function hookTest10(){
    Java.perform(function () {
    var ret = null;
    Java.choose("类名",{    //要hook的类
            onMatch:function(instance){
                ret=instance.privateFunc("aaaaaaa"); //要hook的方法
            },//choose方法会扫描堆扫描java栈内存，instance是对象的句柄（表示对象的标识符）
            onComplete:function(){
                    //console.log("result: " + ret);
            }
        });  
    })
    //return ret;
}
```

4.hook内部类

```javascript
function hookTest6(){
    Java.perform(function(){
        //内部类
        var innerClass = Java.use("类名$InnerClass");//$拼接内部类名
        console.log(innerClass);
        innerClass.$init.implementation = function(){//获取到内部类
            //后续操作
            console.log("eeeeeeee");
        }

    });
}
```

### nativehook

首先是so加载流程

System.loadlibrary()/System.load()      ->android_dlopen_exit()/dlopen()  ->

do_dlopen()    ->findlibrary()   ->call_constructors()  -> init()  ->init_arry() ->

jni_onloadf()

什么是android_dlopen_exit()/dlopen() ：”dynamic link“动态装载库，windows存在dll文件的动态加载类型，在linux中有so文件，dlopen就是重要的函数

以下方法去获取Frida中特定函数的地址

- 使用FridaAPI :Module.enumerateExports()

- 使用Frida API：Module.getExportByName().

- 使用Frida API: Module.findExportByName()

- 计算偏移量并将add()其映射到Module.getAddress()地址       [其实相当于绝对地址 = base address + offset]

- 使用Frida API: Module.enumerateImports()

native的基本Hook打印

```js
function hookTest2() {
    Java.perform(function() {
        // 根据导出函数名打印地址
        var helloAddr = Module.findExportByName("so文件名", "函数名");
        console.log(helloAddr); 
        if (helloAddr != null) {
            // Interceptor.attach是Frida里的一个拦截器
            Interceptor.attach(helloAddr, {
                // onEnter里可以打印和修改参数
                onEnter: function(args) {  // args传入参数
                    console.log(args[0]);  // 打印第一个参数的值
                    console.log(this.context.x1);  // 打印寄存器内容
                    console.log(args[1].toInt32()); // toInt32()转十进制
                    console.log(args[2].readCString()); // 读取字符串 char类型
                    console.log(hexdump(args[2])); // 内存dump
                },
                // onLeave里可以打印和修改返回值
                onLeave: function(retval) {  // retval返回值
                    console.log(retval);
                    console.log("retval", retval.toInt32());
                }
            });
        } // 这里添加了缺失的闭合括号
    });
}
```

动态注册函数

```
function hookTest6(){
    Java.perform(function(){
        //根据导出函数名打印基址
        var soAddr = Module.findBaseAddress("lib52pojie.so");
        console.log(soAddr);
        var funcaddr = soAddr.add(0x1071C);  
        console.log(funcaddr);
        if(funcaddr != null){
            Interceptor.attach(funcaddr,{
                onEnter: function(args){  //args参数

                },
                onLeave: function(retval){  //retval返回值
                    console.log(retval.toInt32());
                    retval.replace('value');
                }
            })
        }
    })
}
```

## frida的检测与对抗

### 文件/端口检测

frida默认端口（默认 `27042` 和 `27043`），可以端口转发

修改文件名

```
./fsl -l 0.0.0.0:6666     #启动frida-server，监听所有网络接口(0.0.0是指所有网卡)的6666端口
adb forward tcp:6666 tcp:6666 #建立 ADB 端口转发，将电脑的 6666 端口映射到手机的 6666 端口
frida -H 127.0.0.1:6666 进程名 -l hook.js
```

使用脚本定位

```js
function hook_dlopen() {  var android_dlopen_ext = Module.findExportByName(null, "android_dlopen_ext");
  console.log("addr_android_dlopen_ext", android_dlopen_ext);
  Interceptor.attach(android_dlopen_ext, {
    onEnter: function (args) {
      var pathptr = args[0];
      if (pathptr != null && pathptr != undefined) {
        var path = ptr(pathptr).readCString();
        console.log("android_dlopen_ext:", path)
 
 
      }
    },
    onLeave: function (retvel) {
    }
  })
}

setImmediate(hook_dlopen);

```

### 检测map

什么是map：

/proc/self/maps是一个特殊的文件，它包含了当前进程的内存映射信息。当你打开这个文件时，它会显示一个列表，其中包含了进程中每个内存区域的详细信息。这些信息包含：

1.起始地址(Start Adress)

2.结束地址(End Address)

3.权限(如可读、可写、可执行)

4.共享/私有标志（Shared or Private）

5.关联的文件或设备(如果内存区域是文件映射的)

6.内存区域的偏移量

7.内存区域的类型(如匿名映射、文件映射，设备映射)

当注入frida后，map文件就存在frida-agent-64.so,frida-agent-32.so等文件

检测逻辑

```js
bool check_maps() {
    // 定义一个足够大的字符数组line，用于存储读取的行
    char line[512];
    // 打开当前进程的内存映射文件/proc/self/maps进行读取
    FILE* fp = fopen("/proc/self/maps", "r");
    if (fp) {
        // 如果文件成功打开，循环读取每一行
        while (fgets(line, sizeof(line), fp)) {
            // 使用strstr函数检查当前行是否包含"frida"字符串
            if (strstr(line, "frida") || strstr(line, "gadget")) {
                // 如果找到了"frida"，关闭文件并返回true，表示检测到了恶意库
                fclose(fp);
                return true; // Evil library is loaded.
            }
        }
        // 遍历完文件后，关闭文件
        fclose(fp);
    } else {
        // 如果无法打开文件，记录错误。这可能意味着系统状态异常
        // 注意：这里的代码没有处理错误，只是注释说明了可能的情况
    }
    // 如果没有在内存映射文件中找到"frida"，返回false，表示没有检测到恶意库
    return false; // No evil library detected.
}

```

```js
// 定义一个函数anti_maps，用于阻止特定字符串的搜索匹配，避免检测到敏感内容如"Frida"或"REJECT"
function anti_maps() {
    // 查找libc.so库中strstr函数的地址，strstr用于查找字符串中首次出现指定字符序列的位置
    var pt_strstr = Module.findExportByName("libc.so", 'strstr');
    // 查找libc.so库中strcmp函数的地址，strcmp用于比较两个字符串
    var pt_strcmp = Module.findExportByName("libc.so", 'strcmp');
    // 使用Interceptor模块附加到strstr函数上，拦截并修改其行为
    Interceptor.attach(pt_strstr, {
        // 在strstr函数调用前执行的回调
        onEnter: function (args) {
            // 读取strstr的第一个参数（源字符串）和第二个参数（要查找的子字符串）
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            // 检查子字符串是否包含"REJECT"或"frida"，如果包含则设置hook标志为true
            if (str2.indexOf("REJECT") !== -1  || str2.indexOf("frida") !== -1) {
                this.hook = true;
            }
        },
        // 在strstr函数调用后执行的回调
        onLeave: function (retval) {
            // 如果之前设置了hook标志，则将strstr的结果替换为0（表示未找到），从而隐藏敏感信息
            if (this.hook) {
                retval.replace(0);
            }
        }
    });

    // 对strcmp函数做类似的处理，防止通过字符串比较检测敏感信息
    Interceptor.attach(pt_strcmp, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (str2.indexOf("REJECT") !== -1  || str2.indexOf("frida") !== -1) {
                this.hook = true;
            }
        },
        onLeave: function (retval) {
            if (this.hook) {
                // strcmp返回值为0表示两个字符串相等，这里同样替换为0以避免匹配成功
                retval.replace(0);
            }
        }
    });
}

```

### status(线程)检测

在/proc/pid/task目录下，可以通过查看不同进程的县城子目录，从而获取调试时的信息

在某些app中就会去读取 `/proc/stask/线程ID/status` 文件，如果监测是frida产生的则进行反调试，。例如：`gmain/gdbus/gum-js-loop/pool-frida`等

1.gmain:frida使用的Glib库，其主事循环被称为GMainLoop。在Frida中的gmain表示GMainLoop线程

2.gdbbus：GDBus 是 Glib 提供的一个用于 D-Bus 通信的库。在 Frida 中，gdbus 表示 GDBus 相关的线程。

3.gum-js-loop:Gum是Frida的运行时引擎，用于执行注入的JavaScript代码。gum-js-loop 表示 Gum 引擎执行 JavaScript 代码的线程。

4.pool-frida:Frida中的某些功能可用于线程池来处理任务，pool-frida表示Frida中的线程池

5.linjector: 是一种用于 Android 设备的开源工具，它允许用户在运行时向 Android 应用程序注入动态链接库（DLL）文件。通过注入 DLL 文件，用户可以修改应用程序的行为、调试应用程序、监视函数调用等，这在逆向工程、安全研究和动态分析中是非常有用的。

frida可以随时附加，所以检测要覆盖APP的全周期，或者至少是敏感函数执行前

检测逻辑

```
bool check_status() {
    DIR *dir = opendir("/proc/self/task/");
    struct dirent *entry;
    char status_path[MAX_PATH];
    char buffer[MAX_BUFFER];
    int found = false;

    if (dir) {
        while ((entry = readdir(dir)) != NULL) {
            if (entry->d_type == DT_DIR) {
                if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
                    continue;
                }
                snprintf(status_path, sizeof(status_path), "/proc/self/task/%s/status", entry->d_name);
                if (read_file(status_path, buffer, sizeof(buffer)) == -1) {
                    continue;
                }
                if (strcmp(buffer, "null") == 0) {
                    continue;
                }
                char *line = strtok(buffer, "\n");
                while (line) {
                    if (strstr(line, "Name:") != NULL) {
                        const char *frida_name = strstr(line, "gmain");
                        if (frida_name || strstr(line, "gum-js-loop") || strstr(line, "pool-frida") || strstr(line, "gdbus")) {
                            found = true;
                            break;
                        }
                    }
                    line = strtok(NULL, "\n");
                }
                if (found) break; 
            }
        }
        closedir(dir);
    }
    return found;
}
```

anti脚本

```
function replace_str() {
    var pt_strstr = Module.findExportByName("libc.so", 'strstr');
    var pt_strcmp = Module.findExportByName("libc.so", 'strcmp');

    Interceptor.attach(pt_strstr, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("gdbus") !== -1 ||
                str2.indexOf("pool-frida") !== -1||
                str2.indexOf("linjector") !== -1) {
                //console.log("strcmp-->", str1, str2);
                this.hook = true;
            }
        }, onLeave: function (retval) {
            if (this.hook) {
                retval.replace(0);
            }
        }
    });

    Interceptor.attach(pt_strcmp, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("gdbus") !== -1 ||
                str2.indexOf("pool-frida") !== -1||
                str2.indexOf("linjector") !== -1) {
                //console.log("strcmp-->", str1, str2);
                this.hook = true;
            }
        }, onLeave: function (retval) {
            if (this.hook) {
                retval.replace(0);
            }
        }
    })

}
```

### inline hook 检测

通过Frida查看一个函数hook之前和之后的机器码，以此来判断是否被Frida的inlinehook注入

```
#include <jni.h>
#include <string>
#include <dlfcn.h>
#include "dlfcn/local_dlfcn.h"

bool check_inlinehook() {
    // 根据系统架构选择对应的libc.so库路径
    const char *lib_path;
    #ifdef __LP64__
    lib_path = "/system/lib64/libc.so";
    #else
    lib_path = "/system/lib/libc.so";
    #endif

    // 定义要比较的字节数
    const int CMP_COUNT = 8;
    // 指定要查找的符号名，这里是"open"函数
    const char *sym_name = "open";

    // 使用local_dlopen函数打开指定的共享库，并获取操作句柄
    struct local_dlfcn_handle *handle = static_cast<local_dlfcn_handle *>(local_dlopen(lib_path));
    if (!handle) {
        return JNI_FALSE; // 如果无法打开共享库，返回false
    }

    // 获取"open"函数在libc.so中的偏移量
    off_t offset = local_dlsym(handle, sym_name);

    // 关闭handle，因为我们接下来使用标准的dlopen/dlsy来获取函数地址
    local_dlclose(handle);

    // 打开libc.so文件，准备读取数据
    FILE *fp = fopen(lib_path, "rb");
    if (!fp) {
        return JNI_FALSE; // 如果无法打开文件，返回false
    }

    // 定义一个缓冲区，用于存储读取的文件内容
    char file_bytes[CMP_COUNT] = {0};
    // 读取指定偏移量处的CMP_COUNT个字节
    fseek(fp, offset, SEEK_SET);
    fread(file_bytes, 1, CMP_COUNT, fp);
    fclose(fp);

    // 使用dlopen函数打开libc.so共享库，并获取操作句柄
    void *dl_handle = dlopen(lib_path, RTLD_NOW);
    if (!dl_handle) {
        return JNI_FALSE; // 如果无法打开共享库，返回false
    }

    // 使用dlsym函数获取"open"函数的地址
    void *sym = dlsym(dl_handle, sym_name);
    if (!sym) {
        dlclose(dl_handle);
        return JNI_FALSE; // 如果无法找到符号，返回false
    }

    // 比较原libc.so中的"open"函数内容与通过dlsym获取的"open"函数内容是否一致
    int is_hook = memcmp(file_bytes, sym, CMP_COUNT) != 0;

    // 关闭dlopen打开的共享库句柄
    dlclose(dl_handle);

    // 返回比较结果，如果函数被hook则返回JNI_TRUE，否则返回JNI_FALSE
    return is_hook ? JNI_TRUE : JNI_FALSE;
}

```

```

function hook_memcmp_addr(){
    //hook反调试
    var memcmp_addr = Module.findExportByName("libc.so", "fread");
    if (memcmp_addr !== null) {
        console.log("fread address: ", memcmp_addr);
        Interceptor.attach(memcmp_addr, {
        onEnter: function (args) {
            this.buffer = args[0];   // 保存 buffer 参数
            this.size = args[1];     // 保存 size 参数
            this.count = args[2];    // 保存 count 参数
            this.stream = args[3];   // 保存 FILE* 参数
        },
        onLeave: function (retval) {
            // 这里可以修改 buffer 的内容，假设我们知道何时 fread 被用于敏感操作
            console.log(this.count.toInt32());
            if (this.count.toInt32() == 8) {
                // 模拟 fread 读取了预期数据，伪造返回值
                Memory.writeByteArray(this.buffer, [0x50, 0x00, 0x00, 0x58, 0x00, 0x02, 0x1f, 0xd6]);
                retval.replace(8); // 填充前8字节
                console.log(hexdump(this.buffer));
            }
        }
    });
    } else {
        console.log("Error: memcmp function not found in libc.so");
    }
}

```

