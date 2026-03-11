---
slug: the-hundred-year-language
title: The Hundred-Year Language
titleZh: 百年语言
subtitle: Predicting the programming language of 100 years from now can help us make better choices today.
date: 2026-03-09
tags: [编程, 技术, 预测]
excerpt: 预测100年后的编程语言，可以帮助我们现在的选择。语言像物种一样形成进化树，有死胡同和主干。Lisp走在正确的道路上。
originalUrl: http://paulgraham.com/hundred.html
---

## 中文翻译

编程语言像物种一样形成进化树。有些语言是死胡同（如Cobol），有些可能成为主干（如Lisp）。

核心公理应该少而精。Lisp走在正确的道路上——它用极少数的基本操作构建了整个语言。

未来的趋势是：更快的硬件允许更"浪费"但更简单的设计。程序员的时间才是真正的效率，不是机器时间。

数据类型会简化。字符串只是列表的特例，数组只是哈希表的子集。未来的语言会有更统一的数据模型。

并行计算对普通程序员将是可选的，不是强制的。大多数人不需要关心多线程，语言应该自动处理。

预测100年后的语言很难，但思考这个问题可以帮助我们做出更好的选择。如果某个特性在100年后还会存在，那它可能是值得学习的。

## 英文原文

Programming languages form evolutionary trees like species. Some languages are dead ends (like Cobol), some may become main trunks (like Lisp).

Core axioms should be few and elegant. Lisp is on the right path—it builds the entire language from a minimal set of primitive operations.

The future trend: faster hardware allows more "wasteful" but simpler designs. Programmer time is the real efficiency, not machine time.

Data types will simplify. Strings are just a special case of lists, arrays are just subsets of hash tables. Future languages will have more unified data models.

Parallel computing will be optional for ordinary programmers, not mandatory. Most people don't need to care about multithreading; languages should handle it automatically.

Predicting the language of 100 years from now is hard, but thinking about this problem can help us make better choices. If a feature will still exist in 100 years, it's probably worth learning.

## 学习笔记

**核心洞察：**

PG对语言进化的预测很有说服力。他指出了Lisp的核心优势（简洁的核心公理）和未来的趋势（牺牲机器效率换取程序员效率）。

**最有力的段落：**

> "Inefficient software isn't gross. What's gross is a language that makes programmers do needless work. Wasting programmer time is the true inefficiency, not wasting machine time."

（低效的软件并不恶心。恶心的是让程序员做不必要工作的语言。浪费程序员的时间才是真正的低效，而不是浪费机器时间。）

**个人反思：**

这也解释了为什么现代语言（Python、Ruby、JavaScript）都在向Lisp模型靠拢。它们都采用了：
- 运行时类型
- 垃圾回收
- 函数作为一等公民
- 动态特性

投资者视角：技术趋势往往比人们想象的更慢，但一旦确定就很难逆转。识别这些长期趋势是投资的关键。