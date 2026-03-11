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

Lisp 的根源 --> 2001年5月

（我写这篇文章是为了帮助我自己准确理解麦卡锡的发现。你不需要了解这些东西就能用 Lisp 编程，但它应该对任何想要理解 Lisp 本质的人有所帮助——既包括它的起源，也包括它的语义核心。拥有这样一个核心的事实是 Lisp 的显著特征之一，也是为什么与其他语言不同，Lisp 会有方言的原因。）

1960年，约翰·麦卡锡发表了一篇非凡的论文，他在编程领域所做的，就像欧几里得在几何学领域所做的那样。他展示了如何仅凭少数几个简单的运算符和一种函数表示法，就能构建一门完整的编程语言。他将这门语言称为 Lisp，即"列表处理"（List Processing），因为他的一个核心思想是使用一种称为列表的简单数据结构，同时用于代码和数据。

理解麦卡锡的发现是值得的，不仅因为它在计算机历史上是一个里程碑，还因为它可以作为我们自己这个时代编程发展趋势的模型。在我看来，到目前为止，有两种真正清晰、一致的编程模型：C 模型和 Lisp 模型。这两者是高地，中间是沼泽低地。随着计算机变得越来越强大，新开发的编程语言一直在稳步向 Lisp 模型靠拢。

过去20年里，新编程语言的一个流行配方是采用 C 计算模型，然后逐步添加从 Lisp 模型借鉴来的部分，比如运行时类型和垃圾回收。

在本文中，我将尝试用最简单的术语解释麦卡锡的发现。重点不仅仅是学习某人四十年前发现的一个有趣的理论结果，而是展示编程语言的发展方向。

Lisp 的不寻常之处——事实上，Lisp 的定义性特征——是它可以用自身来编写。为了理解麦卡锡这句话的意思，我们将追溯他的步骤，将他的数学符号翻译成可运行的 Common Lisp 代码。

完整文章（Postscript）
什么让 Lisp 与众不同
代码
中文翻译
日文翻译
葡萄牙文翻译
韩文翻译

## 英文原文

The Roots of Lisp --> May 2001 (I wrote this article to help myself understand exactly what McCarthy discovered. You don't need to know this stuff to program in Lisp, but it should be helpful to anyone who wants to understand the essence of Lisp — both in the sense of its origins and its semantic core. The fact that it has such a core is one of Lisp's distinguishing features, and the reason why, unlike other languages, Lisp has dialects.) In 1960, John McCarthy published a remarkable paper in which he did for programming something like what Euclid did for geometry. He showed how, given a handful of simple operators and a notation for functions, you can build a whole programming language. He called this language Lisp, for "List Processing," because one of his key ideas was to use a simple data structure called a list for both code and data. It's worth understanding what McCarthy discovered, not just as a landmark in the history of computers, but as a model for what programming is tending to become in our own time. It seems to me that there have been two really clean, consistent models of programming so far: the C model and the Lisp model. These two seem points of high ground, with swampy lowlands between them. As computers have grown more powerful, the new languages being developed have been moving steadily toward the Lisp model. A popular recipe for new programming languages in the past 20 years has been to take the C model of computing and add to it, piecemeal, parts taken from the Lisp model, like runtime typing and garbage collection. In this article I'm going to try to explain in the simplest possible terms what McCarthy discovered. The point is not just to learn about an interesting theoretical result someone figured out forty years ago, but to show where languages are heading. The unusual thing about Lisp — in fact, the defining quality of Lisp — is that it can be written in itself. To understand what McCarthy meant by this, we're going to retrace his steps, with his mathematical notation translated into running Common Lisp code. Complete Article (Postscript) What Made Lisp Different The Code Chinese Translation Japanese Translation Portuguese Translation Korean Translation

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