---
title: opencode的使用与一个对话式AI的下载
date: 2026-03-21 10:11:07
tags: misc
---

# opencode的下载与使用

opencode是在终端的AI编程助手，它可以读懂项目，修改代码，自动完成任务

## AI 编程工具的两大类型

### IDE 类

**代表产品**：Cursor、Windsurf、GitHub Copilot、Trae

**特点**：

- 图形界面，所见即所得
- AI 作为编辑器的"副驾驶"
- 你还是主要操作者，需要盯着屏幕

**适合**：习惯 IDE、需要边看边改的场景

### TUI 类（终端界面工具）

**代表产品**：Claude Code、Codex CLI、OpenCode

**特点**：

- 终端原生，轻量快速
- AI 是主要执行者，你是指挥官
- 可以开多个任务并行，不用盯着屏幕
- 可编程、可自动化、可嵌入 CI/CD

**适合**：Vibe Coding、习惯终端、需要自动化的场景

**OpenCode 属于 TUI 类。**

[连接 DeepSeek（首选推荐） - AI 编程助手实战指南](https://learnopencode.com/1-start/04b-deepseek)

下载
[OpenCode | 开源 AI 编程代理](https://opencode.ai/zh)

这就结束了

build模式的AI可以修改创建文档，而plan就是纯对话

# 接着是一个对话式AI使用

![1](/qctf3/1.jpg)

.env是配置API的接口

先开虚拟环境

python -m venv .venv

cd .\\.venv\

cd .\\Scripts\ 

.\activate

cd ../

cd../

pip install -r .\xxx.txt

python .\main.py

# 特此鸣谢

徐✌
