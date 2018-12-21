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