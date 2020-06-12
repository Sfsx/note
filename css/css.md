# CSS

## Block Formatting Contexts

BFC(Block Formatting Contexts)直译为"块级格式化上下文"

## Inline Formatting Contexts

IFC(Inline Formatting Contexts)直译为"内联格式化上下文"

那么IFC一般有什么用呢？

+ 水平居中：当一个块要在环境中水平居中时，设置其为 `display: inline-block` 则会在外层产生 IFC，通过 `text-align` 则可以使其水平居中。
+ 垂直居中：创建一个 IFC，用其中一个元素撑开父元素的高度，然后设置其 `vertical-align: middle`，**其他行内元素**则可以在此父元素下垂直居中

## GridLayout Formatting Contexts

GFC(GridLayout Formatting Contexts)直译为"网格布局格式化上下文"

当为一个元素设置 `display` 值为 `grid` 的时候，此元素将会获得一个独立的渲染区域，我们可以通过在网格容器（grid container）上定义网格定义行（grid definition rows）和网格定义列（grid definition columns）属性各在网格项目（grid item）上定义网格行（grid row）和网格列（grid columns）为每一个网格项目（grid item）定义位置和空间。

## Flex Formatting Contexts

FFC(Flex Formatting Contexts)直译为"自适应格式化上下文"

## Block box

一个被定义成块级的（`block`）盒子会表现出以下行为:

+ 盒子会在内联方向上扩展并占据父容器在该方向上所有的可用空间，在绝大多数情况下意味着盒子会和父容器一样宽。
+ 每个盒子都会换行
+ `width` 和 `height` 属性可以发挥作用
+ 内边距（`padding`），外边距（`margin`）和边框（`border`）会将其他元素从当前盒子周围“推开”（在 css 标准盒模型下）  

## Inline box

如果一个盒子对外显示为 `inline`，那么他的行为如下:

+ 盒子不会产生换行
+ `width` 和 `height` 属性将不起作用
+ 内边距，外边距以及边框会被应用但是不会把其他处于 `inline` 状态的盒子推开。

## 层叠顺序（stacking level）

z-index

![stacking level](https://images2015.cnblogs.com/blog/608782/201609/608782-20160923104742809-2054066790.png)

1. the background and borders of the element forming the stacking context.
2. the child stacking contexts with negative stack levels (most negative first).
3. the in-flow, non-inline-level, non-positioned descendants.
4. the non-positioned floats.
5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
7. the child stacking contexts with positive stack levels (least positive first).

翻译：

1. 形成堆叠上下文环境的元素的背景与边框
2. 拥有负 z-index 的子堆叠上下文元素 （负的越高越堆叠层级越低）
3. 正常流式布局，非 inline-block，无 position 定位（static除外）的子元素
4. 无 position 定位（static除外）的 float 浮动元素
5. 正常流式布局， inline-block元素，无 position 定位（static除外）的子元素（包括 display:table 和 display:inline ）
6. 拥有 z-index:0 的子堆叠上下文元素
7. 拥有正 z-index: 的子堆叠上下文元素（正的越低越堆叠层级越低）
