# CSS

## 选择器类型优先级

以下排列由低到高

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

#### 清除浮动的三种方法

1. 在浮动元素的同级添加一个**块级元素**其 css 设置 `clear: both`
2. 在浮动元素的父级设置 `overflow: hidden` 利用 BFC
3. 在浮动元素的父级添加 after 伪类 设置其 css 为
  
    ```css
    :after {
      content: "";
      height: 0;
      display: block;
      clear: both;
    }
    ```

### position absolute

  >可以使用 top left 相对浏览器窗口进行定位  
  >可以使用 margin-top margin-left 相对父节点进行定位

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

### 常用添加产生 BFC

overflow: hidden

display: flow-root

### BFC 的作用

1. 不和浮动元素重叠
2. 清除元素内部浮动
3. 防止垂直 margin 重叠

## 图片文字居中

方案一

`vertical-align: middle;`

该方法适用于：当图片处于 `display: inline-block;` 文字处于 `display: inline;`，如果图片 `height` 大于文字高度，则只需要文字设置`vertical-align: middle;`，否则两者都设置 `vertical-align: middle;`

方案二

图片的 `height` 与文字的 `line-height` 相等

该方法适用于：图片与文字都处于 `display: block;`

[实例](http://cocoscript.com/lab/detail/55afc4c5cec07270384d87fa)

## css module vs bem

我觉得还是 BEM 好，直接使用 BEM 配合条件判断直接使用

```js
render(){
    return <div className={ this.state.isShow ? 'box-show' : 'box-hide' }>hello world</div>
}
```

这里介绍一下 BEM。BEM 的意思就是块（block）、元素（element）、修饰符（modifier）。

```shell
.block 代表了更高级别的抽象或组件。
.block__element 代表 .block 的后代，用于形成一个完整的.block的整体。
.block–modifier 代表 .block 的不同状态或不同版本。
.block__element–modifier 代表 .element 的不同状态或不同版本。
```

实际例子

```html
<ul class="xxx">
  <li class="xxx__item">第一项
    <div class="xxx__product-name">我是名称</div>
    <span class="xxx__ming-zi-ke-yi-hen-chang">看类名</span>
    <a href="#" class="xxx__link">我是link</a>
  <li>
  <li class="xxx__item xxx__item_current">第二项 且 当前选择项
    <div class="xxx__product-name">我是名称</div>
    <a href="#" class="xxx__item-link">我是link</a>
  <li>
  <li class="xxx__item xxx__item_hightlight">第三项 且 特殊高亮
    <div class="xxx__product-name">我是名称</div>
    <a href="#" class="xxx__item-link">我是link</a>
  <li>
</ul>
```

推荐 react 中使用 BEM 命名规范 + Classnames 库

[鱼和熊掌的故事 - CSS Modules还是BEM鱼和熊掌的故事 - CSS Modules还是BEM](http://benweizhu.github.io/blog/2015/12/05/css-modules-or-bem/)

## reseting 和 normalizing 浏览器默认样式重置

### css reset

```html
* { outline: 0; padding: 0; margin: 0; border: 0; }
```

由于 `*` 会匹配所有的元素，所以当浏览器解析到 `*` 时，会将页面内的所有标签都进行如上的样式重置， 这样会影响网页渲染的时间，所以使用 `*` 时一定要慎重，尽量不要在样式重置时应用 `*` 。

+ 喜欢众生平等，磨平所有元素的棱角

解决方式找到其中有用的自行添加，而不是整个引入。

### Normalize.css

Normalize.css 只是一个很小的 CSS 文件，但它在默认的 HTML 元素样式上 提供了跨浏览器的高度一致性。相比于传统的CSS reset，Normalize.css 是一种现代的、为 HTML5 准备的优质替代方案。Normalize.css 现在已经被 用于 Twitter Bootstrap、HTML5 Boilerplate、GOV.UK、Rdio、CSS Tricks 以及许许多多其他框架、工具和网站上。

+ 保护有用的浏览器默认样式而不是完全去掉它们
+ 一般化的样式：为大部分HTML元素提供
+ 修复浏览器自身的bug并保证各浏览器的一致性
+ 优化CSS可用性：用一些小技巧
+ 解释代码：用注释和详细的文档来

Normalize.css 是模块化的，你也可以只引入你需要的。

## CSS 盒模型

### W3C 标准盒模型

属性 `width`、`height` 只包含内容 `content`、不包含 `border` 和 `padding`

```css
box-sizing: content-box;
```

### IE 盒模型

属性 `width`、`height` 包含 `border` 和 `padding`，指的是 `content` + `padding` + `border`

```css
box-sizing: border-box;
```

![盒模型](https://user-gold-cdn.xitu.io/2017/10/25/9cb491d4bd5d326aeb16632280411283?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 打印 CSS 优化

通过流媒体将打印样式写在一个 css 文件中

```css
@media print {}{
   h1 {
     color: black;
   }
   h2 {}{
     color: gray;
   }
 }
```

## 高效 CSS

## the shapes of css

```css
  #rss {
    width: 20em;
    height: 20em;
    border-radius: 3em;
    background-color: #ff0000;
    font-size: 14px;
  }
  #rss:before {
    content: '';
    z-index: 1;
    display: block;
    height: 5em;
    width: 5em;
    background: #fff;
    border-radius: 50%;
    position: relative;
    top: 11.5em;
    left: 3.5em;
  }
  #rss:after {
    content: '';
    display: block;
    background: #ff0000;
    width: 13em;
    height: 13em;
    top: -2em;
    left: 3.8em;
    border-radius: 2.5em;
    position: relative;
    box-shadow:
      -2em 2em 0 0 #fff inset,
      -4em 4em 0 0 #ff0000 inset,
      -6em 6em 0 0 #fff inset
  }
```  

## 发现新属性

### `object-fit`

### `justify-content: space-evenly;`

### `clip-path`

### `mix-blend-mode`

1. 任何颜色和黑色执行滤色，还是呈现原来的颜色；
2. 任何颜色和白色执行滤色得到的是白色；
3. 任何颜色和其他颜色执行滤色模式混合后的颜色会更浅，有点类似漂白的效果。

```css
mix-blend-mode: normal;          //正常
mix-blend-mode: multiply;        //正片叠底
mix-blend-mode: screen;          //滤色
mix-blend-mode: overlay;         //叠加
mix-blend-mode: darken;          //变暗
mix-blend-mode: lighten;         //变亮
mix-blend-mode: color-dodge;     //颜色减淡
mix-blend-mode: color-burn;      //颜色加深
mix-blend-mode: hard-light;      //强光
mix-blend-mode: soft-light;      //柔光
mix-blend-mode: difference;      //差值
mix-blend-mode: exclusion;       //排除
mix-blend-mode: hue;             //色相
mix-blend-mode: saturation;      //饱和度
mix-blend-mode: color;           //颜色
mix-blend-mode: luminosity;      //亮度

mix-blend-mode: initial;         //初始
mix-blend-mode: inherit;         //继承
mix-blend-mode: unset;           //复原
```

### backdrop-filter

## fixed

元素会被移除文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动的时候不会改变。fixed 属性会创建新的层叠上下文。当元素祖先的 `transform`、`perspective` 或 `filter` 属性非 `none`，容器由视口改为该先祖。

### stacking context 层叠上下文

我们假定用户正面向视窗或者浏览器，而 HTML 元素沿着其相对与用户的一条虚构的 z 轴排开，层叠上下文就是对这些 HTML 元素的一个三维构想。

文档中的层叠上下文由满足以下任意一个条件的元素形成：

+ 文档元素 `<html>`
+ position 为 `absolute` 或 `relative` 且 `z-index` 值不为 `auto`
+ position 为 `fixed` 或 `sticky`
+ flex
+ grid
+ 以下元素值不为 `none`
  + transform
  + filter
  + perspective
  + clip-path
  + mask / mask-image / mask-border
+ opacity 属性值小于 1 的元素
+ mix-blend-mode 属性值不为 normal 的元素
+ will-chang 设定任意一属性
+ contain 属性为 layout、paint 或包含它们其中之一的合成值
+ isolation 属性值为 isolate 的元素
