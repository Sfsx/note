# 快速笔记

+ 前端使用固定 salt 加密后送给后端
+ 后端生成强大的 salt 将前端送来的值加密储存
+ 使用安全的 hash 函数
+ 如果可能，使用 HTTPS
+ npm delegates 用于管理伪属性类型
+ 有时需要允许访问返回动态计算值的属性，或者你可能需要反映内部变量的状态，而不需要使用显式方法调用。在JavaScript中，可以使用 getter 来实现。虽然可以使用 getter 和 setter 来创建一个伪属性类型，但是不可能同时将一个 getter 绑定到一个属性并且该属性实际上具有一个值。

+ What is the difference between using `<Link to="/page">` and `<a href="page">`On the surface, you seem to be comparing apples and oranges here. The path in your anchor tag is a relative path while that one in the Link is absolute (rightly so, I don't think react-router supports relative paths yet). The problem this creates is say you are on `/blah`, while clicking on your Link will go to `/page`, clicking on the `<a href='page' />` will take you to `/blah/page`. This may not be an issue though since you confirmed the correctness of the url, but thought to note.A bit deeper difference, which is just an addon to @Dennis answer (and the docs he pointed to), is when you are already in a route that matches what the Link points to. Say we are currently on `/page` and the Link points to `/page` or even `/page/:id`, this won't trigger a full page refresh while an `<a />` tag naturally will. See issue on Github.

+ flutter框架
+ polyfills
+ PWA
+ webpacke
+ redis
  + key - value 数据库 value 可以是: `string hash list set sortedSet`
  + `user:fsx:email` 相当于key的前缀，方便进行业务切割
  + redis服务是一个cs模式的tcp server，使用和http类似的请求响应协议
  + 优化。应用程序优化部分主要是客户端和Redis交互的一些建议。主要思想是尽可能减少操作Redis往返的通信次数。
    + 精简键名
    + 当业务场景不需要数据持久化时，关闭所有的持久化方式可以获得最佳的性能
    + 限制 `redis` 的内存大小如果不限制内存，当物理内存使用完之后，会使用 `swap` 分区，这样性能较低，如果限制了内存，当到达指定内存之后就不能添加数据了，否则会报 `OOM` 错误。
    + 尽可能使用时间复杂度为O(1)的操作，避免使用复杂度为O(N)的操作。避免使用这些O(N)命令主要有几个办法：(1)不要把List当做列表使用，仅当做队列来使用;(2)通过机制严格控制Hash、Set、Sorted Set的大小;(3)可能的话，将排序、并集、交集等操作放在客户端执行;(4)绝对禁止使用KEYS命令;(5)避免一次性遍历集合类型的所有成员，而应使用SCAN类的命令进行分批的，游标式的遍历
    + 使用mset、lpush、zadd等批量操作数据。它的原理同非事务性流行线操作。
    + 使用流水线操作。Redis支持流水线(pipeline)操作，其中包括了事务流水线和非事务流水线。Redis提供了WATCH命令与事务搭配使用，实现CAS乐观锁的机制。WATCH的机制是：在事务EXEC命令执行时，Redis会检查被WATCH的key，只有被WATCH的key从WATCH起始时至今没有发生过变更，EXEC才会被执行。如果WATCH的key在WATCH命令到EXEC命令之间发生过变化，则EXEC命令会返回失败。使用事务的一个好处是被MULTI和EXEC包裹的命令在执行时不会被其它客户端打断。但是事务会消耗资源，随着负载不断增加，由WATCH、MULTI、EXEC组成的事务(CAS)可能会进行大量重试，严重影响程序性能。
    如果用户需要向Redis发送多个命令，且一个命令的执行结果不会影响另一个命令的输入，那么我们可以使用非事务流水线来代替事务性流水线。非事务流水线主要作用是将待执行的命令一次性全部发送给Redis，减少来回通信的次数，以此来提升性能。
    + 不要让你的Redis所在机器物理内存使用超过实际内存总量的60%。
+ `WebSocket`
  + TCP 是第四层传输层协议
  + WebSocket Http 是第七层应用层协议
  + 对于 `WebSocket` 来说，它必须依赖 `HTTP` 协议进行一次握手 ，握手成功后，数据就直接从 `TCP` 通道传输，与 `HTTP` 无关了
+ 一个 WebIDE 工具
  + CodeSandbox 容器。支持在线编写前端demo，可以将编写好的demo链接嵌入博文。
  + [首页](https://codesandbox.io/)

## SVG 在线制作工具

[SVG图标制作指南](https://zhuanlan.zhihu.com/p/20753791?refer=FrontendMagazine)

[SVG在线制作工具](https://svg.wxeditor.com/)

## 2018 js报告

[2018 js报告](https://2018.stateofjs.com/cn/introduction/)

## redis 主从哨兵模式

## flux

### flux 核心概念

+ View
+ Store
+ Action
+ Dispatcher

#### Action Creattor

Action creator 负责创建 action。一旦创建了action 信息, Action creator 就会将 action 传送给 dispatcher（调度员）。可以将 action 理解为修改数据的 api，也可以将 action 理解为 event（触发状态改变的事件）

#### Dispatcher

将 action 分发到对应的 store 中，是一个分发中心。对每一个 action 进行记录，使得数据修改的来源可以被记录。

#### Store

Store 存储应用所有的 state，控制所有业务逻辑和数据处理。它和 View 是一个观察者模式，store 更新完成之后，会触发 change 事件通知视图

#### View

View 是视图，使用户看得见摸得着的地方，同事也是产生用户交互的主要地方。它应该是一个纯函数，一个纯粹的展示者，只在意传到他手的数据，并将这些数据展示出来。它能够触发数据修改，触发 action，但不能在 View 直接修改 Store

### 对比传统 MVC

![mvc](http://cc.cocimg.com/api/uploads/20150928/1443408397390295.jpg)

传统 MVC 中在 View 层直接修改 model 层，当应用比较简单时，还可以维护。但是当应付复杂度提高之后，model 修改有可能触发其他 model 修改，model 之间错综复杂的联系导致很难发现状态的修改是由谁造成的，难以 debug。

![flux](http://cc.cocimg.com/api/uploads/20150928/1443408411494724.jpg)

1. Action 不仅仅把修改 Store 的方式约束了起来，同时还加大了 Store 操作的颗粒度，让琐碎的数据变更变得清晰有意义

2. 所有的数据变更都发生在 Store 里，所以可以根据 Action 的历史记录确定 Store 的状态。这个让很多撤销恢复管理等场景成为了可能。

3. 数据的渲染是自上而下的

    ```mark
    Action -> Dispatch -> Store -> View
    ```

4. view层变得很薄，真正的组件化由于2、3两条原因，View 自身需要做的事情就变得很少了。业务逻辑被 Store 做了，状态变更被 controller-view 做了，View 自己需要做的只是根据交互触发不同的 Action，仅此而已。这样带来的好处就是，整个 View 层变得很薄很纯粹，完全的只关注 ui 层的交互，各个 View 组件之前完全是松耦合的，大大提高了 View 组件的复用性。

5. 中心化管理数据，避免数据孤立，一旦数据被孤立，就需要通过其它程序做串联，导致复杂。这是避免各路行为乱改数据导致混乱的一个潜在条件，或者说这是一个结论

### 参考资料

[我理解的 Flux 架构](https://yq.aliyun.com/articles/59357)

[[译]看漫画理解Flux](https://medium.com/@icyfish/%E8%AF%91-%E7%9C%8B%E6%BC%AB%E7%94%BB%E7%90%86%E8%A7%A3flux-4e4aa508eade)

## linux nc 命令

ncat 或者说 nc 是一款功能类似 cat 的工具，但是是用于网络的。它是一款拥有多种功能的 CLI 工具，可以用来在网络上读、写以及重定向数据。 它被设计成可以被脚本或其他程序调用的可靠的后端工具。同时由于它能创建任意所需的连接，因此也是一个很好的网络调试工具。

## 浏览器加载页面过程

1. URL 解析
2. DNS 查询
3. TCP 连接
4. 流浪器发起 HTTP 请求
5. 服务器响应 HTTP 请求
6. 浏览器解析渲染页面

### 客户端渲染

1. 处理 HTML 标记并构建 DOM tree
2. 处理 CSS 标记并构建 CSSOM tree
3. 将 DOM 与 CSSOM 合并成一个 render tree
4. 布局（layout），根据 render tree 计算每个节点的位置大小等信息
5. 绘制 render tree

![webkit main flow](https://images0.cnblogs.com/blog/118511/201303/30174613-aea0f7a683574d87a7fa049dc52f5ae3.png)

![Gecko main flow](https://images0.cnblogs.com/blog/118511/201303/30174629-d2e8eba07c05420dbc3a049a0de099a7.jpg)

其中 1、2、3 非常快，但是 4 和 5 比较耗时，有三个术语：

“重排”和“回流” 值的是重新执行步骤 4

“重绘”至重新执行步骤 5

重排意味着重新计算节点的位置大小等信息，重新再草稿本上画了草图，所以一定会重绘。但重绘不一定会重排，比如背景颜色变化。

#### reflow 重排

1. 页面第一次渲染（初始化）
2. DOM 树变化（如：增删节点，改变元素内容）
3. Render 树变化（如：padding 改变、元素位置改变、元素字体大小改变）
4. 浏览器窗口 resize
5. 获取元素的某些属性：浏览器为了获得正确的值也会提前触发回流，这样就使得浏览器的优化失效了，这些属性包括offsetLeft、offsetTop、offsetWidth、offsetHeight、 scrollTop/Left/Width/Height、clientTop/Left/Width/Height、调用了getComputedStyle()或者IE的currentStyle

#### repaint 重绘

1. reflow回流必定引起repaint重绘，重绘可以单独触发
2. 背景色、颜色、字体改变（注意：字体大小发生变化时，会触发 reflow）

#### 优化reflow、repaint触发次数

1. 避免逐个修改节点样式，尽量一次性修改
2. 使用DocumentFragment将需要多次修改的DOM元素缓存，最后一次性append到真实DOM中渲染
3. 可以将需要多次修改的DOM元素设置display: none，操作完再显示。（因为隐藏元素不在render树内，因此修改隐藏元素不会触发回流重绘）
4. 避免多次读取某些属性（见上）
5. 将复杂的节点元素脱离文档流，降低回流成本

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

[Critical rendering path](https://varvy.com/pagespeed/critical-render-path.html)

[CSS and javascript order](https://varvy.com/pagespeed/style-script-order.html)

[Optimize CSS delivery](https://varvy.com/pagespeed/optimize-css-delivery.html)

[【译】CSSOM 介绍](https://juejin.im/entry/58a6957d128fe10064768930)

#### 布局

布局流程的输出是一个“盒模型”，它会精确地捕获每个元素在视口内的确切位置和尺寸：所有相对测量值都转换为屏幕上的绝对像素。

![盒模型](http://taligarsiel.com/Projects/image046.jpg)

[Web Fundamentals](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)

## 浏览器介绍

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

目前 jsonp 返回是 json 数据，刚好符合 chrome 的 CSRB 拦截。无法使用

测试在 edge 下可以正常使用

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

## 浏览器同源策略

### 同源的概念

+ 协议相同
+ 域名相同
+ 端口相同

举例来说，`http://www.example.com/dir/page.html` 这个网址，协议是 `http://`，域名是 `www.example.com`，端口是 `80`

+ `http://www.example.com/dir2/other.html`：同源
+ `http://example.com/dir/other.html`：不同源（域名不同）
+ `http://v2.www.example.com/dir/other.html`：不同源（域名不同）
+ `http://www.example.com:81/dir/other.html`：不同源（端口不同）

### 限制范围

#### 1. cookie、localStorage、indexDB 无法获取

csrf 跨站伪造请求

#### 2. DOM 无法获得

如果没有 DOM 同源策略，也就是说不同域的 iframe 之间可以相互访问，那么黑客可以这样进行攻击：

1. 做一个假网站，里面用 iframe 嵌套一个银行网站 `http://mybank.com`。
2. 把 iframe 宽高啥的调整到页面全部，这样用户进来除了域名，别的部分和银行的网站没有任何差别。
3. 这时如果用户输入账号密码，我们的主网站可以跨域访问到 `http://mybank.com` 的 dom 节点，就可以拿到用户的账户密码了。

#### 3. http 请求无法发送

1. 做个假网站，通过跨域请求 GET，获取某个银行网站的 `http://mybank.com` html 文档。
2. 将文档展示在自己的页面中
3. 这时如果用户输入账号密码，就可以拿到用户的账户密码了。

### cookie

页面可以改变本身的源，但是会有一些限制。脚本可以将 `document.domain` 设置为当前域或者当前域的超级域，该较短的域会用于后续源检查。

### DOM

h5 的 `window.postMessage` api

### http 请求

HTTP访问控制（CORS）

可以让服务器支持跨域访问或者使用后端代理访问

### WebSocket

协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

### localStorage、indexDB

目前无解

[Same Origin Policy](https://github.com/acgotaku/WebSecurity/blob/master/docs/content/Browser_Security/Same-Origin-Policy.md)

[为什么浏览器要限制跨域访问?](https://www.zhihu.com/question/26379635)

[浏览器同源策略及跨域的解决方法](https://juejin.im/post/5ba1d4fe6fb9a05ce873d4ad)

## CORS

Cross-Origin Sharing Standard (CORS)

浏览器将 CORS 请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

请求方法是以下三种方法之一：

+ HEAD
+ GET
+ POST

HTTP的头信息不超出以下几种字段：

+ Accept
+ Accept-Language
+ Content-Language
+ DPR
+ Downlink
+ Save-Data
+ Viewport-Width
+ Width
+ Content-Type：
  + application/x-www-form-urlencoded
  + multipart/form-data
  + text/plain

凡是不同时满足上面两个条件，就属于非简单请求。

浏览器对这两种请求的处理，是不一样的。

>注意：这些跨域请求与浏览器发出的其他跨域请求并无二致。如果服务器未返回正确的响应首部，则请求方不会收到任何数据。因此，那些不允许跨域请求的网站无需为这一新的 HTTP 访问控制特性担心。

### 简单请求

头部

```html
Origin: http://www.laixiangran.cn
```

服务器返回

```html
Access-Control-Allow-Origin：http://www.laixiangran.cn
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers：Content-Language, Content-Type
```

Access-Control-Allow-Origin

该字段是必须的。它的值要么是请求时 Origin 字段的值，要么是一个 *，表示接受任意域名的请求。

Access-Control-Allow-Credentials

该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。默认情况下，Cookie 不包括在 CORS 请求之中。设为true，即表示服务器明确许可，Cookie 可以包含在请求中，一起发给服务器。这个值也只能设为 true，如果服务器不要浏览器发送 Cookie，删除该字段即可。

Access-Control-Expose-Headers

该字段可选。表示服务器允许请求携带的首部字段

### 非简单请求

浏览器在发送真正的请求之前，会先发送一个 Preflight 请求给服务器，这种请求使用 OPTIONS 方法，发送下列头部

```html
Origin: http://www.laixiangran.cn
Access-Control-Request-Method: POST
Access-Control-Request-Headers: NCZ
```

服务器返回

```html
Access-Control-Allow-Origin: http://www.laixiangran.cn
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: NCZ
Access-Control-Max-Age: 1728000
```

#### OPTIONS 预检的优化

```html
Access-Control-Max-Age:
```

这个头部加上后，可以缓存此次请求的秒数。

在这个时间范围内，所有同类型的请求都将不再发送预检请求而是直接使用此次返回的头作为判断依据。

非常有用，可以大幅优化请求次数

[HTTP访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

### img 标签与跨域

js 创建的 img 标签跨域请求图片时。若图片数据需要用 canvas 读取，则按以下配置

1. 需要服务器设置 `Access-Control-Allow-Origin: *` 响应头
2. img 标签的 crossOrigin 属性。该属性有两个值 
   + `anonymous` 表示：元素的跨域资源请求不需要凭证标志设置。
   + `use-credentials` 表示：元素的跨域资源请求需要凭证标志设置，意味着该请求需要提供凭证，即请求会提供 cookie，服务器得配置 `Access-Control-Allow-Credentials`

## virtual dom

### 什么是 virtual dom

virtual dom 的本质是 JavaScript 对象（该对象的属性描述了真实 dom 的部分属性）。它最少会包含 tag（标签）、props（属性） 和 children（子元素对象） 三个属性。它的作用就是在 js 和 dom 之间做了一个缓存

### 为什么需要 virtual dom

dom 操作是比较昂贵的。当创建一个 dom 除了需要网页重排重绘之外还需要注册相应的 Event listener，加上大量的 dom 属性，这些都很耗时。加之如果你的 JavaScript 操作 DOM 的方式还非常不合理，那就更糟糕了。（以下是 dom 属性图）

![dom prototype](https://upload-images.jianshu.io/upload_images/1959053-409c2c86d78baa71.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

和 dom 操作比起来 js 计算是非常便宜的。将数据修改引起的改变，先修改 virtual dom 再使用 diff 算法进行比较前后差异，这样我们就可以对 DOM 进行最小化修改，跳过中间一些无用的改动。

+ 如果一次修改中单次修改只是更改一个 label 表情值，那么直接操作 dom 是更快的。

+ 但是在现实应用场景中，一个数据更改，往往会触发页面多处变动。这个时候如果是直接修改 dom 那么每一次操作都可能会触发浏览器的重排与重绘。这时如果运用 virtual dom 机制，在 virtual dom 中进行修改，通过 diff 算法将其中一些 dom 操作进行合并，最后通过框架去修改真实 dom。即减少了 dom 操作又保证了 JavaScript 操作 DOM 方式的合理性

### diff 算法

## script 标签的 defer 和 async

### defer

这个布尔属性被设定用来通知浏览器该脚本将在文档完成解析后，触发 `DOMContentLoaded` 事件前顺序执行，相当于告诉浏览器立即下载，但延迟执行。如果缺少 `src` 属性，该属性不生效。对动态嵌入的脚本使用 `async=false` 来达到类似效果

### async

这个属性与 `defer` 类似，都用于改变处理脚本的行为。同样与 `defer` 类似，`async` 只适用于外部脚本文件。但与 `defer` 不同的是，标记为 `async` 的当脚本下载完成后立即执行，并不保证按照它们的先后顺序执行，执行阶段也不确定，可能在 `DOMContentLoaded` 事件前后。

## 总结

但由于这两个属性目前还存在浏览器兼容性问题，最稳妥的方法还是将 `script` 标签放在 `body` 标签的底部

用 js 创建的 `script` 标签默认是 async 模式

[浅谈script标签的defer和async](https://juejin.im/entry/5a7ad55ef265da4e81238da9)

## document load 和 document DOMContentLoaded

### load

load是当页面所有资源全部加载完成后（包括DOM文档树，css文件，js文件，图片资源等），执行一个函数

### DOMContentLoaded

当初始的 HTML 文档被完全加载和解析完成之后，`DOMContentLoaded` 事件被触发，而无需等待样式表、图像和子框架的完成加载。

正常来说在 css 放在头部，将 js 文件放在尾部的 html 文件里，js 加载会阻塞文档解析，而脚本需要等位于脚本前面的css加载完才能执行。过程就是 css 加载 -> html 解析 -> js 加载 -> html 解析 -> DOMContentLoaded

### 为什么 css 放在 head 标签，将 js 放在 body 标签尾部

我们再来看一下 chrome 在页面渲染过程中的，绿色标志线是First Paint 的时间。纳尼，为什么会出现 firstpaint，页面的 paint 不是在渲染树生成之后吗？其实现代浏览器为了更好的用户体验,渲染引擎将尝试尽快在屏幕上显示的内容。它不会等到所有 HTML 解析之前开始构建和布局渲染树。部分的内容将被解析并显示。也就是说浏览器能够渲染不完整的 dom 树和 cssom，尽快的减少白屏的时间。假如我们将 js 放在 header，js 将阻塞解析 dom，dom 的内容会影响到 First Paint，导致 First Paint 延后。所以说我们会将 js 放在后面，以减少 First Paint 的时间，但是不会减少 DOMContentLoaded 被触发的时间

![load & DOMContentLoaded](https://images2015.cnblogs.com/blog/746387/201704/746387-20170407181151019-499554025.png)
