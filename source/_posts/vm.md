---
title: vm
date: 2026-05-30 17:05:30
tags: reverse
top:
---

# 原理

程序运行时通过解释操作码，选择对应的函数(handle)执行

本质上是作者自己实现了一套指令集

比如x86汇编中的0xFF是jmp，而0xE0， 0x48 mov

在虚拟机中既可以自定义指令对应的操作码

还可以自定义数组实现cpu的功能

![5](/pctf/5.jpg)

pc指针是程序计数器，指向下一条指令

原始代码->前端编译器->虚拟指令(vmcode)->虚拟cpu解释执行->计算结果

# 0x01从零到一实现虚拟机

先从正向了解虚拟机

**1.常量定义**

```c
#define REG_COUNT 8/*通用寄存器的数量*/
#define MEM_SIZE 256/*内存大小(字节)*/
#define STACK_SIZE 64 /*栈深度*/
#define INSN_SIZE 4 /*每条指令的字节数(定长编译)*/
/*标志寄存器可能的取值，由CMP指令设置*/
#define FLAG_EQ 0/*两个操作数相等*/
#define FLAG_LT 1/*dst<src*/
#define FLAG_GT 2/*dst>src*/ 
```

**2.指令集定定义(Opcode枚举)**

最基础的操作码，ida常见于汇编

将在后面给出每个指令的具体实现

```python
typedef enum {
    OP_NOP   = 0x00,  /* 什么也不做，常用作填充 */
    OP_MOV   = 0x01,  /* r[dst] = r[src1]              寄存器间赋值 */
    OP_LDI   = 0x02,  /* r[dst] = (src1<<8)|src2       加载16位立即数 */
    OP_LOAD  = 0x03,  /* r[dst] = mem[r[src1]] ，mem是memory(内存)        从内存读取数据 */
    OP_STORE = 0x04,  /* mem[r[dst]] = r[src1]         写入内存 */
    OP_ADD   = 0x05,  /* r[dst] = r[src1] + r[src2] */
    OP_SUB   = 0x06,  /* r[dst] = r[src1] - r[src2] */
    OP_XOR   = 0x07,  /* r[dst] = r[src1] ^ r[src2] */
    OP_AND   = 0x08,  /* r[dst] = r[src1] & r[src2] */
    OP_OR    = 0x09,  /* r[dst] = r[src1] | r[src2] */
    OP_SHL   = 0x0A,  /* r[dst] = r[src1] << src2      左移，src2是立即数 */
    OP_SHR   = 0x0B,  /* r[dst] = r[src1] >> src2      右移 */
    OP_CMP   = 0x0C,  /* flag = cmp(r[dst], r[src1])   比较，设置标志位 */
    OP_JMP   = 0x0D,  /* pc = (src1<<8)|src2            无条件跳转（绝对地址） */
    OP_JEQ   = 0x0E,  /* if flag==FLAG_EQ: pc = (src1<<8)|src2 */
    OP_JNE   = 0x0F,  /* if flag!=FLAG_EQ: pc = (src1<<8)|src2 */
    OP_PUSH  = 0x10,  /* stack[sp++] = r[dst] */
    OP_POP   = 0x11,  /* r[dst] = stack[--sp] */
    OP_CALL  = 0x12,  /* push(pc+INSN_SIZE); pc = addr  子程序调用 */
    OP_RET   = 0x13,  /* pc = pop()                    从子程序返回 */
    OP_IN    = 0x14,  /* r[dst] = getchar()            读一个字节输入 */
    OP_OUT   = 0x15,  /* putchar(r[dst])               输出一个字节 */
    OP_HALT  = 0xFF,  /* 停机 */
} Opcode;
```

flag是标志寄存器，用于存储CMP的比较结果

```
// OP_CMP: r[dst] 与 r[src1] 比较
if      (reg[dst] == reg[src1])  flag = FLAG_EQ;  // 0
else if (reg[dst] <  reg[src1])  flag = FLAG_LT;  // 1
else                             flag = FLAG_GT;  // 2
```

pc是程序计数器：指向下一条指令的地址

| **正常执行** | `pc += INSN_SIZE`（即 +4，取下一条指令） |
| ------------ | ---------------------------------------- |
| **跳转**     | `pc = target`（强制改道）                |
| **CALL**     | 先压栈返回地址，再 `pc = target`         |
| **RET**      | 从栈弹出返回地址，`pc = 返回地址`        |
| **HALT**     | 停止，pc 不再前进                        |

**3.状态结构体**

```c
typedef struct{
    uint32_t regs[REG_COUNT];/*通用寄存器r0~r8*/
    uint32_t pc; /*pc是程序计数器：指向下一条指令的地址*/
    uint8_t flag /*flag是标志寄存器，用于存储CMP的比较结果*/
    uint8_t mem[MEM_SIZE];/*内存区域：可存数据(输入、中间值、密文)*/
    uint32_t stack[STACK_SIZE];/*调用栈*/
    int sp;/*栈指针，指向栈的下一个空位*/
    int halted;/*是否已经停机(执行了HALT或出错)*/
}VM;
```

**4.核心的执行函数:vm_step()**

先取指：从内存中读取数据(类似code段，code段(代码段)就是存放程序指令的地方)

再执行：用switch+case匹配数据与对应字节码的操作，执行后移动指针向后推进一条指令(类似cs(代码段寄存器)、IP(指令指针寄存器

)的执行方式)

```
void vm_step(VM *vm, const uint8_t *bytecode, size_t code_len) {

    /* ---- 取指阶段（Fetch）----
     * 从字节码数组中读出当前 PC 处的 4 个字节。
     * 在 IDA 里，这行代码通常长这样：
     *  rax = vm->pc; opcode = bytecode[rax]; (感觉很类似于链表删除其中一个元素)
     * 找到这行，向上追 bytecode 数组的来源，就能定位字节码。
     */
    if (vm->pc + INSN_SIZE > code_len) {
        fprintf(stderr, "[VM] PC 越界：0x%04X\n", vm->pc);
        vm->halted = 1;
        return;
    }

    uint8_t opcode = bytecode[vm->pc];     /* 操作码 */
    uint8_t dst    = bytecode[vm->pc + 1]; /* 目标操作数 */
    uint8_t src1   = bytecode[vm->pc + 2]; /* 第一源操作数 */
    uint8_t src2   = bytecode[vm->pc + 3]; /* 第二源操作数 */
    //操作码 目标操作数 源操作数1，源操作数2
    /* 解码阶段（Decode）：提前算好常用组合 */
    uint32_t imm16 = ((uint32_t)src1 << 8) | src2; /* 16 位立即数 */

    /* 边界检查：寄存器编号合法性 */
#define CHECK_REG(r) do { \
    if ((r) >= REG_COUNT) { \
        fprintf(stderr, "[VM] 非法寄存器编号 %d\n", (r)); \
        vm->halted = 1; return; \
    } \
} while(0)

    /* ---- 执行阶段（Execute）——大 switch ----
     * PC 默认向后推进一条指令，跳转指令会覆盖这个值。
     */
    vm->pc += INSN_SIZE;

    switch (opcode) {

    /* --------------------------------------------------
     * NOP：空操作，PC 已经前进，什么都不做
     * 常见用途：占位、对齐、迷惑逆向者
     * -------------------------------------------------- */
    case OP_NOP:
        break;

    /* --------------------------------------------------
     * MOV r[dst], r[src1]
     * 寄存器间赋值，最基础的指令
     * -------------------------------------------------- */
    case OP_MOV:
        CHECK_REG(dst); CHECK_REG(src1);
        vm->regs[dst] = vm->regs[src1];
        break;

    /* --------------------------------------------------
     * LDI r[dst], imm16
     * 加载一个 16 位立即数到寄存器
     * CTF 题用它把密钥/密文常量嵌入字节码
     * -------------------------------------------------- */
    case OP_LDI:
        CHECK_REG(dst);
        vm->regs[dst] = imm16;
        break;

    /* --------------------------------------------------
     * LOAD r[dst], [r[src1]]
     * 从内存地址 r[src1] 读一个字节到 r[dst]
     * 用于读取预先存在 mem[] 里的 flag 字符
     * -------------------------------------------------- */
    case OP_LOAD:
        CHECK_REG(dst); CHECK_REG(src1);
        if (vm->regs[src1] >= MEM_SIZE) {
            fprintf(stderr, "[VM] 内存越界读：addr=0x%X\n", vm->regs[src1]);
            vm->halted = 1; return;
        }
        vm->regs[dst] = vm->mem[vm->regs[src1]];
        break;

    /* --------------------------------------------------
     * STORE [r[dst]], r[src1]
     * 把 r[src1] 的值写入内存地址 r[dst]
     * -------------------------------------------------- */
    case OP_STORE:
        CHECK_REG(dst); CHECK_REG(src1);
        if (vm->regs[dst] >= MEM_SIZE) {
            fprintf(stderr, "[VM] 内存越界写：addr=0x%X\n", vm->regs[dst]);
            vm->halted = 1; return;
        }
        vm->mem[vm->regs[dst]] = (uint8_t)vm->regs[src1];
        break;

    /* --------------------------------------------------
     * 算术 / 逻辑运算
     * CTF 题的 flag 验证几乎都由这几条组成
     * -------------------------------------------------- */
    case OP_ADD:
        CHECK_REG(dst); CHECK_REG(src1); CHECK_REG(src2);
        vm->regs[dst] = vm->regs[src1] + vm->regs[src2];
        break;

    case OP_SUB:
        CHECK_REG(dst); CHECK_REG(src1); CHECK_REG(src2);
        vm->regs[dst] = vm->regs[src1] - vm->regs[src2];
        break;

    case OP_XOR:
        CHECK_REG(dst); CHECK_REG(src1); CHECK_REG(src2);
        vm->regs[dst] = vm->regs[src1] ^ vm->regs[src2];
        break;

    case OP_AND:
        CHECK_REG(dst); CHECK_REG(src1); CHECK_REG(src2);
        vm->regs[dst] = vm->regs[src1] & vm->regs[src2];
        break;

    case OP_OR:
        CHECK_REG(dst); CHECK_REG(src1); CHECK_REG(src2);
        vm->regs[dst] = vm->regs[src1] | vm->regs[src2];
        break;

    /* --------------------------------------------------
     * SHL / SHR：移位，src2 直接作立即数（移位量）
     * -------------------------------------------------- */
    case OP_SHL:
        CHECK_REG(dst); CHECK_REG(src1);
        vm->regs[dst] = vm->regs[src1] << src2;
        break;

    case OP_SHR:
        CHECK_REG(dst); CHECK_REG(src1);
        vm->regs[dst] = vm->regs[src1] >> src2;
        break;

    /* --------------------------------------------------
     * CMP r[dst], r[src1]
     * 比较两个寄存器，结果存入 flag。
     * 这是逆向时的关键分支——flag 决定后续跳转方向。
     * 如果你在 IDA 看到 "if (reg_a != reg_b) goto fail_label"，
     * 那就是这条指令 + JNE 的组合。
     * -------------------------------------------------- */
    case OP_CMP:
        CHECK_REG(dst); CHECK_REG(src1);
        if      (vm->regs[dst] == vm->regs[src1]) vm->flag = FLAG_EQ;
        else if (vm->regs[dst] <  vm->regs[src1]) vm->flag = FLAG_LT;
        else                                       vm->flag = FLAG_GT;
        break;

    /* --------------------------------------------------
     * 跳转指令：JMP / JEQ / JNE
     * 注意：跳转目标是字节码的绝对字节偏移，
     * 所以目标地址 = imm16（不需要乘以 INSN_SIZE）
     * -------------------------------------------------- */
    case OP_JMP:
        vm->pc = imm16;
        break;

    case OP_JEQ:  /* 相等时跳转 */
        if (vm->flag == FLAG_EQ) vm->pc = imm16;
        break;

    case OP_JNE:  /* 不相等时跳转（最常用：任何一位不对就 fail） */
        if (vm->flag != FLAG_EQ) vm->pc = imm16;
        break;

    /* --------------------------------------------------
     * 栈操作：PUSH / POP
     * 用于保存临时值或实现子程序调用约定
     * -------------------------------------------------- */
    case OP_PUSH:
        CHECK_REG(dst);
        if (vm->sp >= STACK_SIZE) {
            fprintf(stderr, "[VM] 栈溢出\n");
            vm->halted = 1; return;
        }
        vm->stack[vm->sp++] = vm->regs[dst];
        break;

    case OP_POP:
        CHECK_REG(dst);
        if (vm->sp <= 0) {
            fprintf(stderr, "[VM] 栈下溢\n");
            vm->halted = 1; return;
        }
        vm->regs[dst] = vm->stack[--vm->sp];
        break;

    /* --------------------------------------------------
     * CALL addr / RET
     * 实现子程序：CALL 把返回地址压栈，RET 弹出跳回。
     * 有些 CTF VM 用 CALL 来调用内置的"检查函数"，
     * 这时函数体本身也是字节码。
     * -------------------------------------------------- */
    case OP_CALL:
        if (vm->sp >= STACK_SIZE) {
            fprintf(stderr, "[VM] CALL：栈溢出\n");
            vm->halted = 1; return;
        }
        vm->stack[vm->sp++] = vm->pc; /* 压入 CALL 之后的下一条地址 */
        vm->pc = imm16;               /* 跳转到被调函数 */
        break;

    case OP_RET:
        if (vm->sp <= 0) {
            fprintf(stderr, "[VM] RET：栈下溢\n");
            vm->halted = 1; return;
        }
        vm->pc = vm->stack[--vm->sp]; /* 恢复返回地址 */
        break;

    /* --------------------------------------------------
     * I/O 指令
     * IN  r[dst]     : 从 stdin 读一个字节（即读 flag 字符）
     * OUT r[dst]     : 向 stdout 输出一个字节（打印 "Correct!" 等）
     * CTF 题通常会有一段循环：每次 IN 读一个 flag 字符 → 验证
     * -------------------------------------------------- */
    case OP_IN:
        CHECK_REG(dst);
        vm->regs[dst] = (uint8_t)getchar();
        break;

    case OP_OUT:
        CHECK_REG(dst);
        putchar((int)vm->regs[dst]);
        break;

    /* --------------------------------------------------
     * HALT：停机指令
     * VM 执行到这里时，主循环退出。
     * 验证成功和失败分支最终都会跳到 HALT，
     * 区别在于跳之前有没有输出 "Correct" 或 "Wrong"。
     * -------------------------------------------------- */
    case OP_HALT:
        vm->halted = 1;
        break;

    /* --------------------------------------------------
     * 未知 opcode：通常是被混淆的 NOP
     * -------------------------------------------------- */
    default:
        fprintf(stderr, "[VM] 未知 opcode: 0x%02X at PC=0x%04X\n",
                opcode, vm->pc - INSN_SIZE);
        vm->halted = 1;
        break;
    }
}
```

int fprintf(FILE *stream, const char *format, ...);(格式字符串输出)

# reference

[CTF 逆向 VM 题型：从零到一认识与逆向虚拟机 - wes1's blog](https://www.wes1.cn/posts/vm/wp/#0x01-从零到一自实现一个虚拟机)
