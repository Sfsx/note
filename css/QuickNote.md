# CSS

## 选择器类型优先级

1. **类型选择器** ( `h1` ) 和 **伪元素** ( `::befor` )
2. **类选择器** ( `.example` ) 和 **属性选择器** ( `[type="redio"]` ) 或者 **伪类** ( `:hover` )
3. **ID选择器** ( `#example` )
4. **通配选择符** ( `*` )，**关系选择符** ( `+`， `>`， `~`， ` `)
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
