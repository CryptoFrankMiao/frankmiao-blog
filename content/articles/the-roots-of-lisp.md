---
slug: the-roots-of-lisp
title: The Roots of Lisp
titleZh: Lisp的根源
subtitle: McCarthy's 1960 paper showed how to build a complete programming language from a handful of simple operators.
date: 2026-03-09
tags: [编程, Lisp, 历史]
excerpt: McCarthy 1960年的论文展示了如何用少量简单操作构建完整的编程语言。Lisp的核心理念是用列表同时表示代码和数据。
originalUrl: http://paulgraham.com/rootsoflisp.html
---

## 中文翻译

1960年，John McCarthy发表了一篇论文，展示了如何用少量简单操作构建完整的编程语言。

Lisp的核心理念是：用列表（list）同时表示代码和数据。这被称为"同像性"（homoiconicity）。

有两种清晰的编程模型：C模型和Lisp模型。C模型关注内存布局和性能，Lisp模型关注表达能力和抽象。

新语言正稳步向Lisp模型移动：运行时类型、垃圾回收、闭包、元编程——这些曾经是Lisp独有的特性，现在已经成为主流。

Lisp可以写自己。这是Lisp的标志性特征：用Lisp写的Lisp解释器只有几页代码。

McCarthy的论文不仅是技术文档，更是关于如何设计优雅系统的案例研究。

## 英文原文

In 1960, John McCarthy published a paper showing how to build a complete programming language from a handful of simple operators.

The core idea of Lisp: using lists to represent both code and data. This is called "homoiconicity."

There are two clear programming models: the C model and the Lisp model. The C model focuses on memory layout and performance; the Lisp model focuses on expressiveness and abstraction.

New languages are steadily moving toward the Lisp model: runtime typing, garbage collection, closures, metaprogramming—these were once unique to Lisp but are now mainstream.

Lisp can write itself. This is Lisp's signature feature: a Lisp interpreter written in Lisp is only a few pages of code.

McCarthy's paper is not just a technical document, but a case study in how to design elegant systems.

## 学习笔记

**核心洞察：**

这篇文章是技术性的，但核心思想很清晰：Lisp的优雅在于它的简洁性和自举能力。

**最有力的段落：**

> "He showed how, given a handful of simple operators and a notation for functions, you can build a whole programming language."

（他展示了如何仅凭少量简单操作和函数表示法，就能构建完整的编程语言。）

> "A popular recipe for new programming languages in the past 20 years has been to take the C model of computing and add to it, piecemeal, parts taken from the Lisp model."

（过去20年新编程语言的流行配方是：采用C的计算模型，然后逐步添加从Lisp模型借鉴的部件。）

**个人反思：**

这也解释了为什么PG如此推崇Lisp——它代表了编程语言设计的理想形态。对于投资者来说，理解这些技术演进的底层逻辑，有助于判断哪些技术有长期价值。