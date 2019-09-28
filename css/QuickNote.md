# CSS

## 选择器类型优先级

1. **类型选择器** ( `h1` ) 和 **伪元素** ( `::befor` )
2. **类选择器** ( `.example` ) 和 **属性选择器** ( `[type="redio"]` ) 或者 **伪类** ( `:hover` )
3. **ID选择器** ( `#example` )
4. **通配选择符** ( `*` )，**关系选择符** ( `+`， `>`， `~`，  )
5. **内联样式** ( `style="font-weight:bold"` )

### 特例

当在一个属性上声明中使用一个 `!important` 规则时，此声明将覆盖任何其他声明。
使用 `!importanr` 是一个坏习惯，应该尽量避免，因为这个破坏了样式表中固有级联规则，不利于调试

### 一些经验法则

+ 一定要考虑使用样式规则的优先级来解决问题而非 `!important`
+ 只有在需要覆盖全栈或外部 CSS 的特定页面中使用 `!important`
+ 永远不要在全站范围使用 `!important`
+ 永远不要在你的插件上使用 `!important`

[原文链接](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)

---

## 脱离文档流

### float

### position absolute

    可以使用 top left 相对浏览器窗口进行定位
    可以使用 margin-top margin-left 相对父节点进行定位

### position fixed

## flex

`flex` 布局时，若某个子元素没有设置 `width`，当这个子元素的内部某个字体文本特别长时，就会导致该子元素撑大超出父元素宽度

解决方案为设置该子元素 `width: 0;` 即可保证该子元素不超出父元素。

## display

### inline

设置了该属性之后设置高度、宽度都无效，同时 `text-align` 属性设置也无效，但是设置了 `line-height` 会让 `inline` 元素居中

### block

设置元素为块状元素，如果不指定宽高，默认会继承父元素的宽度，并且独占一行，即使宽度有剩余也会独占一行，高度一般以子元素撑开的高度为准，当然也可以自己设置宽度和高度。

### inline-block

`inline-block` 既具有 `block` 的宽高特性又具有 `inline` 的同行元素特性。 通过 `inline-block` 结合 `text-align: justify` 还可以实现固定宽高的列表两端对齐布局

## BFC

### 触发条件或者说哪些元素会生成BFC

1. 根元素，即 HTML 元素
2. 浮动元素 float 的值不为 none
3. 绝对定位元素 position 的值为 absolute 或 fixed
4. 行内块元素 display 为 inline-block
5. 表格单元格 display 为 table-cell
6. 表格标题 display 为 table-caption
7. overflow 的值不为 visible
8. display 为 flow-root
9. 弹性元素 display 为 flex 或 inline-flex 元素的直接子元素
10. 网格元素 display 为 grid 或 inline-grid 元素的直接子元素

### BFC 布局规则

1. 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）；
2. 处于同一个 BFC 中的元素相互影响，可能会发生 margin collapse；
3. 每个元素的 margin box 的左边，与容器块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此；
4. BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然；
5. 计算 BFC 的高度时，考虑 BFC 所包含的所有元素，连浮动元素也参与计算；
6. 浮动盒区域不叠加到 BFC 上；

## 图片文字居中

方案一

`vertical-align: middle;`

该方法适用于：当图片处于 `display: inline-block;` 文字处于 `display: inline;`

方案二

图片的 `height` 与文字的 `line-height` 相等

该方法适用于：图片与文字都处于 `display: block;`

[实例](http://cocoscript.com/lab/detail/55afc4c5cec07270384d87fa)
