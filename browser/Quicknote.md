# browsers

## 浏览器加载页面过程

1. URL 解析
2. DNS 查询
3. TCP 握手
4. TLS 协商
5. 浏览器发起 HTTP 请求
6. 服务器响应 HTTP 请求
7. TCP 慢启动/ 14KB 规则
8. 浏览器解析渲染页面

参考资料

[浏览器的工作原理](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work)

### 关键渲染路径

从收到 HTML、CSS 和 JavaScript 字节到对其进行必需的处理，从而将它们转变成渲染的像素这一过程中有一些中间步骤，优化性能其实就是了解这些步骤中发生了什么 - 即**关键渲染路径**

1. 处理 HTML 标记并构建 DOM 树
2. 处理 CSS 标记并构建 CSSOM 树
3. 将 DOM 与 CSSOM 合并成一个渲染树（render tree）
4. 布局（layout），根据渲染树计算每个节点的位置大小等信息
5. 将布局绘制（paint）在屏幕上

![webkit main flow](https://images0.cnblogs.com/blog/118511/201303/30174613-aea0f7a683574d87a7fa049dc52f5ae3.png)

![Gecko main flow](https://images0.cnblogs.com/blog/118511/201303/30174629-d2e8eba07c05420dbc3a049a0de099a7.jpg)

其中 1、2、3 非常快，但是 4 和 5 比较耗时，有三个术语：

>4 和 5 统称为“渲染”（render）  
>“重排”指的是重新执行步骤 4  
>“重绘”指重新执行步骤 5

“重排”意味着重新计算节点的位置大小等信息，重新再草稿本上画了草图，所以一定会“重绘”。但“重绘”不一定会“重排”，比如背景颜色变化。

#### reflow 重排

1. 页面第一次渲染（初始化）
2. DOM 树变化（如：增删节点，改变元素内容）
3. Render 树变化（如：padding 改变、元素位置改变、元素字体大小改变）
4. 浏览器窗口 resize
5. 获取元素的某些属性：浏览器为了获得正确的值也会提前触发重排，这样就使得浏览器的优化失效了，这些属性包括offsetLeft、offsetTop、offsetWidth、offsetHeight、 scrollTop/Left/Width/Height、clientTop/Left/Width/Height、调用了getComputedStyle()或者IE的currentStyle

#### repaint 重绘

1. reflow回流必定引起repaint重绘，重绘可以单独触发
2. 背景色、颜色、字体改变（注意：字体大小发生变化时，会触发 reflow）

#### 优化reflow、repaint触发次数

1. 使用 DocumentFragment 将需要多次修改的 DOM 元素缓存，最后一次性 append 到真实 DOM 中渲染。或者使用 `cloneNode()` 方法，在克隆的节点上进行操作，然后再用克隆的节点替换原始节点。
2. 可以将需要多次修改的DOM元素设置 `display: none`，操作完再显示。（因为隐藏元素不在render树内，因此修改隐藏元素不会触重排重绘）
3. 避免多次读取某些属性（见上）
4. 避免多个 DOM 读写操作交叉在一起，某些读操作会要求浏览器强制重排
5. 将复杂的节点元素脱离文档流，降低回流成本
6. 不要逐条修改样式，通过改变 class 一次性的改变样式

#### 使用 `window.requestAnimationFrame()`、`window.requestIdleCallback()` 这两个方法调节重新渲染

[How browsers work](http://taligarsiel.com/Projects/howbrowserswork1.htm)

#### HTML 解析

解析HTML到构建出DOM当然过程可以简述如下：

```mark
Bytes → characters → tokens → nodes → DOM
```

![解析](https://user-gold-cdn.xitu.io/2018/8/30/16589bedac1b0c18?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. Conversion 转换：浏览器将获得的HTML内容（Bytes）基于他的编码转换为单个字符

2. Tokenizing 分词：浏览器按照HTML规范标准将这些字符转换为不同的标记 token。每个token都有自己独特的含义以及规则集

3. Lexing 词法分析：分词的结果是得到一堆的 token，此时把他们转换为对象，这些对象分别定义他们的属性和规则

4. DOM 构建：因为 HTML 标记定义的就是不同标签之间的关系，这个关系就像是一个树形结构一样

例如：body对象的父节点就是HTML对象，然后段略p对象的父节点就是body对象

#### CSS 解析

CSS规则树的生成也是类似。简述为：

```mark
Bytes → characters → tokens → nodes → CSSOM
```

要了解 CSS 处理所需的时间，您可以在 DevTools 中记录时间线并寻找“Recalculate Style”事件：与 DOM 解析不同，该时间线不显示单独的“Parse CSS”条目，而是在这一个事件下一同捕获解析和 CSSOM 树构建，以及计算的样式的递归计算。

![devtool](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/cssom-timeline.png?hl=zh-cn)

##### 什么是 CSSOM

+ CSSOM是 CSS Object Model 的缩写
+ 大体上来说，CSSOM是一个建立在web页面上的 CSS 样式的映射
+ 它和DOM类似，但是只针对CSS而不是HTML
+ 浏览器将DOM和CSSOM结合来渲染web页面

##### 如何优化

你不必为了优化你的 Web 页面而去了解 CSSOM 是怎样工作的，这里有几个关于 CSSOM 的关键点你需要知道，利用这些关键点可以优化页面的加载速度。

1. CSSOM 阻止任何东西渲染

    所有的CSS都是阻塞渲染的（意味着在CSS没处理好之前所有东西都不会展示）。

    由于CSSOM被用作创建render tree，那么如果不能高效的利用CSS会有一些严重的后果。即页面在加载时白屏。

2. CSSOM 在加载一个新页面时必须重新构建

    这意味着即使你的CSS文件被缓存了，也并不意味着这个已经构建好了的CSSOM可以应用到每一个页面。

    也就是说，如果你的CSS文件写得很蹩脚，或者体积很大，这也会对你页面加载产生负面的影响。

3. 页面中CSS的加载和页面中 javascript 的加载是有关系的

    如果你的javascript阻塞了CSSOM的构建，你的用户就会面对更长时间的白屏。

优化方式：

+ No more than one external CSS stylesheet of an reasonable size (less than 75k or so)
+ Inline small CSS into HTML using style tags for above the fold content
+ No @import calls for CSS
+ No CSS in HTML things like your divs or your h1s (in element CSS)

+ 如果我们有一些 CSS 样式只在特定条件下（例如显示网页或将网页投影到大型显示器上时）使用，又该如何？如果这些资源不阻塞渲染，该有多好。

    我们可以通过 CSS“媒体类型”和“媒体查询”来解决这类用例：

    ```html
    <link href="style.css" rel="stylesheet">
    <link href="print.css" rel="stylesheet" media="print">
    <link href="other.css" rel="stylesheet" media="(min-width: 40em)">
    ```

+ 尽早在 HTML 文档内指定所有 CSS 资源，以便浏览器尽早发现 `<link>` 标记并尽早发出 CSS 请求。

[Critical rendering path](https://varvy.com/pagespeed/critical-render-path.html)

[CSS and javascript order](https://varvy.com/pagespeed/style-script-order.html)

[Optimize CSS delivery](https://varvy.com/pagespeed/optimize-css-delivery.html)

[【译】CSSOM 介绍](https://juejin.im/entry/58a6957d128fe10064768930)

#### 布局

布局流程的输出是一个“盒模型”，它会精确地捕获每个元素在视口内的确切位置和尺寸：所有相对测量值都转换为屏幕上的绝对像素。

![盒模型](http://taligarsiel.com/Projects/image046.jpg)

[Web Fundamentals](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)

## 浏览器介绍

1. 浏览器主进程
2. 渲染进程
3. GPU进程
4. 网络进程
5. 插件进程

### 浏览器进程

### 浏览器渲染进程

GUI 渲染线程

JS 引擎线程

事件触发线程

异步 HTTP 请求线程

定时器触发线程

当 JS 引擎线程执行任务的时候，会挂起其他一切线程。JS 引擎线程为单线程。执行机制就是 JavaScript 事件循环。

[浏览器的加载过程](http://wuduoyi.com/note/what-happen-when-browser-loading-the-page/)

## JSONP

目前 jsonp 可以正常使用。

+ 前端发送一个请求，请求内容为全局注册的回调函数名。例如 `foo`
+ 后端构造一个 javascript 文件，内容为回调函数调用，并且将数据填入回调函数的参数。例如 `foo(data)`

## 后端路由

带 `.asp` 或 `.html` 的路径，这就是所谓的 SSR(Server Side Render)，通过服务端渲染，直接返回页面。

## Hash 路由

看看这个路由 [https://react-1251415695.cos-website.ap-chengdu.myqcloud.com/docs/react-api.html#reactmemo](https://react-1251415695.cos-website.ap-chengdu.myqcloud.com/docs/react-api.html#reactmemo)。大家肯定会发现：这串 url 的最后有以 # 号开始的一串标识。

修改 hash 值直接在 `window.location.hash` 对象上赋值字符串

在支持 HTML5 的浏览器中，当 URL 的 hash 值变化时会触发 hashchange 事件，我们可以通过监听这个事件来说一些处理：

```js
// 在 window 下监听 hashchange 事件
window.onhashchange = function() {
  // 当事件触发时输出当前的 hash 值
  console.log(window.location.hash)
}
```

### hash 定位文档片段

在 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a) 官方文档中 `<a>` 标签的 herf 属性可以是 url 或 url 片段。这里的 url 片段就是哈希标记（#），哈希标记指定当前文档中的内部目标位置（HTML 元素 ID）。

[前端路由是什么东西？](https://www.zhihu.com/question/53064386)

## history

在history中向后跳转：

```js
window.history.back();
```

向前跳转

```js
window.history.forward();
```

前进或后退多个页面

```js
window.history.go(-2);
```

您可以通过查看长度属性的值来确定的历史堆栈中页面的数量:

```js
let numberOfEntries = window.history.length;
```

HTML5引入的 `history.pushState()` 和 `history.replaceState()` 方法，他们分别可以添加和修改历史记录条目。这些方法通常与 `window.onpopstate` 配合使用。

使用 `history.pushState()` 可以改变 referrer，它在用户发送 XMLHttpRequest 请求时在 HTTP 头部使用，改变 state 后创建的 XMLHttpRequest 对象的 referrer 都会别改变。因为 referrer 是标识创建 XMLHttpRequest 对象时 this 所代表的 window 对象中 document 的 URL

### `history.pushState()`

`history.pushState()` 方法有三个参数

+ 状态对象——状态对象 state 是一个 JavaScript 对象（我们规定了状态对象在序列化表示后有 640k 的大小限制。），通过 `pushState()` 创建新的历史记录条目。无论什么时候用户导航到新的状态，`popstate` 事件就会被触发，且该事件的 state 属性包含该历史记录条目状态对象的副本。
+ 标题
+ URL。调用 `pushState()` 后浏览器并不会立即加载这个 URL，但可能会在稍后某些情况下加载这个 URL，比如在用户重新打开浏览器时。新 URL 不必须为绝对路径。如果新 URL 是相对路径，那么它将被作为相对于当前 URL 处理。新 URL 必须与当前 URL 同源，否则 `pushState()` 会抛出一个异常。该参数是可选的，缺省为当前 URL。

### `history.replaceState()`

`history.replaceState()` 方法与 `history.pushState()` 区别在于 `replaceState()`  是修改了当前的历史记录项而不是新建一个。 注意这并不会阻止其在全局浏览器历史记录中创建一个新的历史记录项。

### 获取当前状态

你可以读取当前历史记录项的状态对象 state，而不必等待`popstate` 事件， 只需要这样使用 `history.state` 属性

## hash 路由和 history 路由的区别

+ pushState 设置的 url 可以是同源下的任意 url ；而 hash 只能修改 # 后面的部分，因此只能设置当前 url 同文档的 url
+ pushState 设置的新的 url 可以与当前 url 一样，这样也会把记录添加到栈中；hash 设置的新值不能与原来的一样，一样的值不会触发动作将记录添加到栈中pushState 通过 stateObject 参数可以将任何数据类型添加到记录中；hash 只能添加短字符串
+ pushState 可以设置额外的 title 属性供后续使用

+ history 在刷新页面时，如果服务器中没有相应的响应或资源，就会出现404。因此，如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面
+ hash 模式下，仅 # 之前的内容包含在 http 请求中，对后端来说，即使没有对路由做到全面覆盖，也不会报 404

[history与hash路由的区别](https://juejin.im/post/5b31a4f76fb9a00e90018cee)

## WebAssembly

WebAssembly 是一种运行在现代网络浏览器中的新型代码，并且提供新的性能特性和效果。它设计的目的不是为了手写代码而是为诸如 C、C++ 和 Rust 等低级源语言提供一个高效的编译目标。

对于网络平台而言，这具有巨大的意义——这为客户端 app 提供了一种在网络平台以接近本地速度的方式运行多种语言编写的代码的方式；在这之前，客户端 app 是不可能做到的。

而且，你在不知道如何编写 WebAssembly 代码的情况下就可以使用它。 WebAssembly 的模块可以被导入的到一个网络 app（或Node.js）中，并且暴露出供 JavaScript 使用的 WebAssembly 函数。JavaScript 框架不但可以使用 WebAssembly 获得巨大性能优势和新特性，而且还能使得各种功能保持对网络开发者的易用性。

[WebAssembly概念
](https://developer.mozilla.org/zh-CN/docs/WebAssembly/Concepts)

## TCP为什么需要3次握手与4次挥手

### 为什么需要3次握手

为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误

client 发出的第一个连接请求报文段并没有丢失，而是在某个网络结点长时间的滞留了，以致延误到连接释放以后的某个时间才到达 server。本来这是一个早已失效的报文段。但 server 收到此失效的连接请求报文段后，就误认为是 client 再次发出的一个新的连接请求。于是就向 client 发出确认报文段，同意建立连接。假设不采用“三次握手”，那么只要 server 发出确认，新的连接就建立了。由于现在 client 并没有发出建立连接的请求，因此不会理睬 server 的确认，也不会向 server 发送数据。但 server 却以为新的运输连接已经建立，并一直等待 client 发来数据。这样，server 的很多资源就白白浪费掉了。采用“三次握手”的办法可以防止上述现象发生。

### 为什么需要4次挥手

tcp 是全双工模式。接收到 FIN 时意味将没有数据再发来，但是还是可以继续发送数据

[TCP为什么需要3次握手与4次挥手](https://blog.csdn.net/xifeijian/article/details/12777187)

## script 标签的 defer 和 async

### defer

这个布尔属性被设定用来通知浏览器该脚本将在文档完成解析后，触发 `DOMContentLoaded` 事件前顺序执行，相当于告诉浏览器立即下载，但延迟执行。如果缺少 `src` 属性，该属性不生效。对动态嵌入的脚本使用 `async=false` 来达到类似效果

### async

这个属性与 `defer` 类似，都用于改变处理脚本的行为。同样与 `defer` 类似，`async` 只适用于外部脚本文件。但与 `defer` 不同的是，标记为 `async` 的当脚本下载完成后立即执行，并不保证按照它们的先后顺序执行，执行阶段也不确定，可能在 `DOMContentLoaded` 事件前后。

### 总结

但由于这两个属性目前还存在浏览器兼容性问题，最稳妥的方法还是将 `script` 标签放在 `body` 标签的底部

用 js 创建的 `script` 标签默认是 async 模式

[浅谈script标签的defer和async](https://juejin.im/entry/5a7ad55ef265da4e81238da9)

## document load 和 document DOMContentLoaded

### load

load是当页面所有资源全部加载完成后（包括DOM文档树，css文件，js文件，图片资源等），执行一个函数

### DOMContentLoaded

当初始的 HTML 文档被完全加载和解析完成之后，`DOMContentLoaded` 事件被触发，而无需等待样式表、图像和子框架的完成加载。

`DOMContentLoaded` 事件并不影响首屏时间，该事件有可能在首屏之后发生，也有可能在首屏之前发生。

正常来说在 css 放在头部，将 js 文件放在尾部的 html 文件里，js 加载会阻塞文档解析，而脚本需要等位于脚本前面的css加载完才能执行。过程就是 html 加载 -> html 解析 -> css 加载，js 加载 -> js 执行, css 解析 -> html 解析 -> DOMContentLoaded

### 为什么 css 放在 head 标签，将 js 放在 body 标签尾部

大部人会这么回答

我们再来看一下 chrome 在页面渲染过程中的，绿色标志线是First Paint 的时间。纳尼，为什么会出现 firstpaint，页面的 paint 不是在渲染树生成之后吗？其实现代浏览器为了更好的用户体验,渲染引擎将尝试尽快在屏幕上显示的内容。它不会等到所有 HTML 解析之前开始构建和布局渲染树。部分的内容将被解析并显示。也就是说浏览器能够渲染不完整的 dom 树和 cssom，尽快的减少白屏的时间。假如我们将 js 放在 header，js 将阻塞解析 dom，dom 的内容会影响到 First Paint，导致 First Paint 延后。所以说我们会将 js 放在后面，以减少 First Paint 的时间，但是不会减少 DOMContentLoaded 被触发的时间。

但实际测试发现

如果这两个资源都存在，在网络条件好的s情况下，并不会影响首屏时间。如果网络环境比较差，其中一个资源下载时间过长，则会导致浏览器先渲染解析一半的 dom 作为首屏。

#### css

1. css 放在 head 标签中，先下载 html 文件 -> 构建 dom，同时下载 css -> 构建 cssom -> 合并成为渲染树 -> 布局 -> paint 绘制
2. css 放在 body 标签中，先下载 html 文件 -> 构建 dom，绘制页面（首次绘制），下载css -> 构建 cssom -> 合并成为渲染树 -> 布局 -> paint 绘制（第二次绘制）

css 放在 body 会导致浏览器解析 html 的时候，遇到 css 资源，会立即绘制一次页面。

![load & DOMContentLoaded](https://images2015.cnblogs.com/blog/746387/201704/746387-20170407181151019-499554025.png)

[JS 一定要放在 Body 的最底部么？聊聊浏览器的渲染机制](https://segmentfault.com/a/1190000004292479)

## localStorage、sessionStorage、cookie

`sessionStorage`

+ 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话
+ 打开多个相同的 URL 的 Tabs 页面，会创建各自的 sessionStorage
+ 在新标签（`<iframe>`）或窗口打开一个页面时会复制顶级浏览会话上下文作为新的会话上下文

区别：

+ 除非用户人为清除，否则存储在 `localStorage` 的数据可以长期保留
+ 当页面被关闭时，存储在 `sessionStorage` 的数据会被清除，并且重新加载或恢复页面仍会保持原来的页面会话

相同点

+ 存储大小一般均为5M左右（`cookie` 只有 4K，每个浏览器的限制数量不同）
+ 都有同源限制，跨域无法访问
+ 数据仅在客户端中保进行存储，并不参与和服务器的通信（与 `cookie` 不同）

### session级存储中，session cookie 和 sessionStorage 有哪些区别

+ session cookie 存在周期是依赖与服务器设置，而 sessionStorage 只依赖与页面标签
+ session cookie 会随 http 请求发送到服务器，而 sessionStorage 不会如果需要上传需要自己操作
+ session cookie 可以跨标签访问，而 sessionStorage 不能跨标签访问

### 限制

处于浏览器的同源策略，相同的协议、相同的主机名、相同的端口下才能访问相同的 `localStorage`、`sessionStorage` 中的数据，这点跟 `cookie` 的差别还是蛮大的

### 数据结构

`key - value` 键值对（键值对总是以字符串的形式存储意味着数值类型会自动转化为字符串类型）

## 浏览器缓存

### 强制缓存

强制缓存就是向浏览器缓存查找该请求的结果，并根据该结果的缓存规则来决定是否使用该缓存结果的过程，强制缓存的情况有三种：

+ 不存在该缓存结果、不存在该缓存标识、强制缓存失效则直接向服务器发起请求
+ 存在该缓存结果或存在该缓存标识，但该结果已失效，强制缓存失效，则使用协商缓存
+ 存在该缓存结果或存在该缓存标识，且该结果尚未失效，强制缓存生效

当浏览器向服务器发起请求时，服务器会将缓存规则放入 HTTP 响应报文的 HTTP 头中和请求结果一起返回给浏览器，控制强制缓存的字段分别是 Expires（Expires 是 HTTP/1.0 控制网页缓存的字段） 和 Cache-Control（在 HTTP/1.1 中，Expire 已经被 Cache-Control 替代），其中 Cache-Control 优先级比 Expires 高。

+ expires: 告知客户端资源缓存失效的绝对时间
+ cache-control:告诉客户端或是服务器如何处理缓存。
  + private: cache-control 里的响应指令.表示客户端可以缓存
  + public: cache-control 里的响应指令.表示客户端和代理服务器都可缓存.如果没有明确指定 private，则默认为 public。
  + no-cache: cache-control 里的指令.表示需要可以缓存，但每次用应该去向服务器验证缓存是否可用
  + no-store: cache-control 字段里的指令.表示所有内容都不会缓存，强制缓存，对比缓存都不会触发.
  + max-age=xxx: cache-control 字段里的指令.表示缓存的内容将在 xxx 秒后失效

### 协商缓存

协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，主要有以下两种情况

#### Last-Modified / If-Modified-Since

Last-Modified 是服务器响应请求时，返回该资源文件在服务器最后被修改的时间。

If-Modified-Since 是客户端再次发起请求时，携带上次请求返回的 Last-Modified 值。

若服务器的资源最后被修改时间大于 If-Modified-Since 值，则重新返回该资源，状态码为 200。若服务器的资源无更新，则返回 304。

#### Etag / If-None-Match

Etag 是服务器响应请求时，返回当前资源文件的唯一标识符（由服务器生成）

If-None-Match 是客户端再次发起请求时，携带上次请求返回的唯一标识 Etag 值。

若服务器资源的 Etag 值和 If-None-Match 的字段值一致则返回 304，若不一致则重新返回资源文件，状态码为 200。

[彻底理解浏览器的缓存机制](https://juejin.im/entry/5ad86c16f265da505a77dca4)

## 浏览器渲染优化

[简化绘制的复杂度、减小绘制区域](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas?hl=zh-CN)

## fetch vs XMLHttpRequest

### XMLHttpRequest

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'json';
xhr.timeout = 3000;

xhr.onload = function() {
  console.log(xhr.response);
};

xhr.onerror = function() {
  console.log("Oops, error");
};

xhr.ontimeout= function() {
  console.log('Oops, timeout');
}

// 发出请求
xhr.send();
```

很长一段时间我们都是通过 XHR 来与服务器建立异步通信。然而在使用的过程中，我们发现 XHR 是基于事件的异步模型，在设计上将输入、输出和事件监听混杂在一个对象里，且必须通过实例化方式来发请求。配置和调用方式混乱，不符合关注分点离原则。

>关注点分离原则所描述的是系统的元素应该表现出互不相干的目的。也就是说，没有会分担另外一个元素职责的，或者其它不相干职责的元素。

### fetch

```js
fetch(url, {
  credentials: 'include',
  headers: {
    'Accept': 'application/json, text/plain, */*'
  }
})
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log('data', data);
  })
  .catch(function(error) {
    console.log('Fetch Error: ', error);
  });
```
