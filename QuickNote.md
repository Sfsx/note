# 快速笔记

+ 前端使用固定 salt 加密后送给后端
+ 后端生成强大的 salt 将前端送来的值加密储存
+ 使用安全的 hash 函数
+ 如果可能，使用 HTTPS
+ npm delegates 用于管理伪属性类型
+ 有时需要允许访问返回动态计算值的属性，或者你可能需要反映内部变量的状态，而不需要使用显式方法调用。在JavaScript中，可以使用 getter 来实现。虽然可以使用 getter 和 setter 来创建一个伪属性类型，但是不可能同时将一个 getter 绑定到一个属性并且该属性实际上具有一个值。

+ What is the difference between using `<Link to="/page">` and `<a href="page">`On the surface, you seem to be comparing apples and oranges here. The path in your anchor tag is a relative path while that one in the Link is absolute (rightly so, I don't think react-router supports relative paths yet). The problem this creates is say you are on `/blah`, while clicking on your Link will go to `/page`, clicking on the `<a href='page' />` will take you to `/blah/page`. This may not be an issue though since you confirmed the correctness of the url, but thought to note.A bit deeper difference, which is just an addon to @Dennis answer (and the docs he pointed to), is when you are already in a route that matches what the Link points to. Say we are currently on `/page` and the Link points to `/page` or even `/page/:id`, this won't trigger a full page refresh while an `<a />` tag naturally will. See issue on Github.

## 规范

[W3C](https://www.w3.org/TR/)

[ECMAScript](https://tc39.es/ecma262/)

[TC39历年提案](https://prop-tc39.now.sh/)

[HTML Living Standard](https://html.spec.whatwg.org/)

## 知识网站

[The Modern JavaScript Tutorial](https://javascript.info/)

## 优秀文章

### chrome 性能分析介绍

[全新Chrome Devtool Performance使用指南](https://zhuanlan.zhihu.com/p/29879682)

## redis

+ key - value 数据库 value 可以是: `string hash list set sortedSet`
+ `user:fsx:email` 相当于key的前缀，方便进行业务切割
+ redis服务是一个cs模式的tcp server，使用和http类似的请求响应协议

### 优化

应用程序优化部分主要是客户端和Redis交互的一些建议。主要思想是尽可能减少操作Redis往返的通信次数。

+ 精简键名
+ 当业务场景不需要数据持久化时，关闭所有的持久化方式可以获得最佳的性能
+ 限制 `redis` 的内存大小如果不限制内存，当物理内存使用完之后，会使用 `swap` 分区，这样性能较低，如果限制了内存，当到达指定内存之后就不能添加数据了，否则会报 `OOM` 错误。
+ 尽可能使用时间复杂度为O(1)的操作，避免使用复杂度为O(N)的操作。避免使用这些O(N)命令主要有几个办法：(1)不要把List当做列表使用，仅当做队列来使用;(2)通过机制严格控制Hash、Set、Sorted Set的大小;(3)可能的话，将排序、并集、交集等操作放在客户端执行;(4)绝对禁止使用KEYS命令;(5)避免一次性遍历集合类型的所有成员，而应使用SCAN类的命令进行分批的，游标式的遍历
+ 使用mset、lpush、zadd等批量操作数据。它的原理同非事务性流行线操作。
+ 使用流水线操作。Redis支持流水线(pipeline)操作，其中包括了事务流水线和非事务流水线。Redis提供了WATCH命令与事务搭配使用，实现CAS乐观锁的机制。WATCH的机制是：在事务EXEC命令执行时，Redis会检查被WATCH的key，只有被WATCH的key从WATCH起始时至今没有发生过变更，EXEC才会被执行。如果WATCH的key在WATCH命令到EXEC命令之间发生过变化，则EXEC命令会返回失败。使用事务的一个好处是被MULTI和EXEC包裹的命令在执行时不会被其它客户端打断。但是事务会消耗资源，随着负载不断增加，由WATCH、MULTI、EXEC组成的事务(CAS)可能会进行大量重试，严重影响程序性能。
如果用户需要向Redis发送多个命令，且一个命令的执行结果不会影响另一个命令的输入，那么我们可以使用非事务流水线来代替事务性流水线。非事务流水线主要作用是将待执行的命令一次性全部发送给Redis，减少来回通信的次数，以此来提升性能。
+ 不要让你的Redis所在机器物理内存使用超过实际内存总量的60%。

## `WebSocket`

+ WebSocket Http 是第七层应用层协议
+ 对于 `WebSocket` 来说，它必须依赖 `HTTP` 协议进行一次握手 ，握手成功后，数据就直接从 `TCP` 通道传输，与 `HTTP` 无关了

## CodeSandbox

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

4. view 层变得很薄，真正的组件化由于2、3两条原因，View 自身需要做的事情就变得很少了。业务逻辑被 Store 做了，状态变更被 controller-view 做了，View 自己需要做的只是根据交互触发不同的 Action，仅此而已。这样带来的好处就是，整个 View 层变得很薄很纯粹，完全的只关注 ui 层的交互，各个 View 组件之前完全是松耦合的，大大提高了 View 组件的复用性。

5. 中心化管理数据，避免数据孤立，一旦数据被孤立，就需要通过其它程序做串联，导致复杂。这是避免各路行为乱改数据导致混乱的一个潜在条件，或者说这是一个结论

### flux 理解

flux 的核心：视图无法直接修改状态，视图必须通过触发 action 来更改状态。组件不允许拥有自己的状态，状态必须独立出来，放在 store 中，监听 action 来进行状态变更。

优点：

1. 视图层会变的很薄，只负责渲染逻辑和触发 action 两个职责，这样视图组件之间就是松耦合的真正做到复用
2. 所有 action 都流经 dispatch，这样所有状态更改就可以做一个记录，我们就可以利用这个特性来制作 debug 工具，实现历史回滚等功能。
3. 要理解一个 store 可能发生的状态变化，只要看他的 action 回调即可

### 参考资料

[我理解的 Flux 架构](https://yq.aliyun.com/articles/59357)

[[译]看漫画理解Flux](https://medium.com/@icyfish/%E8%AF%91-%E7%9C%8B%E6%BC%AB%E7%94%BB%E7%90%86%E8%A7%A3flux-4e4aa508eade)

[如何理解 Facebook 的 flux 应用架构？](https://www.zhihu.com/question/33864532)

## linux nc 命令

ncat 或者说 nc 是一款功能类似 cat 的工具，但是是用于网络的。它是一款拥有多种功能的 CLI 工具，可以用来在网络上读、写以及重定向数据。 它被设计成可以被脚本或其他程序调用的可靠的后端工具。同时由于它能创建任意所需的连接，因此也是一个很好的网络调试工具。

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

## node stream 手动销毁

根据官方的 [Backpressuring in Streams](https://nodejs.org/en/docs/guides/backpressuring-in-streams/) 推荐，我们应该使用 pump 模块来配合 Stream 模式编程，由 pump 来完成这些 Stream 的清理工作。

[基于 Node.js 实现压缩和解压缩](https://zhuanlan.zhihu.com/p/33783583)

## node 相关文档

[guides](https://nodejs.org/en/docs/guides/)

## webpack 打包内存分配失败

node 存在内存限制，32 位系统 0.7 gb，64 位系统 1.5 gb，当引用所需内存超出时就会导致内存分配失败，错误日志如下

```log
<--- Last few GCs --->

[16772:00000000003C8F40] 13003561 ms: Mark-sweep 1366.3 (1417.9) -> 1362.5 (1416.8) MB, 764.6 / 0.1 ms  (average mu = 0.092, current mu = 0.016) allocation failure scavenge might not succeed
[16772:00000000003C8F40] 13003623 ms: Scavenge 1363.6 (1416.8) -> 1363.4 (1417.3) MB, 57.8 / 0.0 ms  (average mu = 0.092, current mu =
0.016) allocation failure


<--- JS stacktrace --->

==== JS stack trace =========================================

    0: ExitFrame [pc: 000001B78F25C5C1]
Security context: 0x01dc93e9e6e9 <JSObject>
    1: substr [000001DC93E8E361](this=0x033c8272d591 <String[321]: ,CAA0B,SAACC,GAAD,CAAMC,EAAN,CAAa,CACrCA,IAAMA,GAAGC,QAAT,EAAqBD,GAAGC,QAAH,CAAYC,KAAZ,CAAkBH,KAAOA,IAAII,OAAX,EAAsBJ,GAAxC,CAArB,CACD,CAFD,CAIA,2BAEA,GAAMK,OAAQ,GAAItD,IAAJ,CAAQ,CACpB2C,GAAI,MADgB,CAEpBnB,aAFoB,CAGpB+B,WAAY,CAAEhD,OAAF,CAHQ,CAIpBiD,OAAQ,yBAAKC,GAAE,KAAF,CAAL,EAJY,CAAR,CAAd...

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 000000013FB4C6AA v8::internal::GCIdleTimeHandler::GCIdleTimeHandler+4506
 2: 000000013FB27416 node::MakeCallback+4534
 3: 000000013FB27D90 node_module_register+2032
 4: 000000013FE4189E v8::internal::FatalProcessOutOfMemory+846
 5: 000000013FE417CF v8::internal::FatalProcessOutOfMemory+639
 6: 0000000140027F94 v8::internal::Heap::MaxHeapGrowingFactor+9620
 7: 000000014001EF76 v8::internal::ScavengeJob::operator=+24550
 8: 000000014001D5CC v8::internal::ScavengeJob::operator=+17980
 9: 0000000140026317 v8::internal::Heap::MaxHeapGrowingFactor+2327
10: 0000000140026396 v8::internal::Heap::MaxHeapGrowingFactor+2454
11: 0000000140150637 v8::internal::Factory::NewFillerObject+55
12: 00000001401CD826 v8::internal::operator<<+73494
13: 000001B78F25C5C1
```

解决办法给 node 分配更大的内存。启动参数添加 `--max_old_space_size=8192` 给 node 设置更大的老生代内存空间。

参考链接

[Angular 7/8 FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory](https://github.com/angular/angular-cli/issues/13734)

## git commit 类型

```doc
feat：新功能
fix：修补 bug
improvement: 对当前功能进行改进
docs：修改文档，比如 README, CHANGELOG, CONTRIBUTE 等等
style： 不改变代码逻辑 (仅仅修改了空格、格式缩进、逗号等等)
refactor：重构（既不修复错误也不添加功能）
perf: 优化相关，比如提升性能、体验
test：增加测试，包括单元测试、集成测试等
build: 构建系统或外部依赖项的更改
ci：自动化流程配置或脚本修改
chore: 非 src 和 test 的修改
revert: 恢复先前的提交
```

## 首屏症候群

### FP FCP FMP

+ FP（First Paint）： 首次绘制，标记浏览器渲染任何在视觉上不同于导航前屏幕内容的时间点
+ FCP（First Contentful Paint）：首次内容绘制，标记渲染第一帧 DOM 的时间点
+ FMP（First Meaning Paint）：首次有效绘制，标记主角元素渲染完成的时间点。

### css 解析优化

避免使用一些昂贵的属性（也只能是尽量，ui设计好了该用还是得用）：

border-radius
box-shadow
opacity
transform
filter
position:fixed

避免复杂 css 选择器：

```css
body > main.container > section.intro h2:nth-of-type(odd) + p::first-line a[href$=".pdf"] {
    /* …… */
}
```

或者（使用 sass、less 时避免以下情况）

```css
.list {
    .item {
        .product {
            .intro {
                .pic {
                    height: 200px;
                }
            }
        }
    }
}

/* 上述代码等价于 */
.list .item .product .intro .pic {
  height: 200px;
}
```

### css 加载

#### css 资源较小时，直接插入到 HTML 文档中，这称为“内嵌”

#### css 文件较大时，内嵌用于呈现首屏内容的css，暂缓加载其余样式，直到首屏内容显现出来为止

目前需要使用 javascript 来支持，但在未来可以使用 `<link>` 标签的 `import` 属性，类似 `<script>` 标签的 `async` 属性。

如果 HTML 文档如下所示:

```html
<html>
  <head>
    <link rel="stylesheet" href="small.css">
  </head>
  <body>
    <div class="blue">
      Hello, world!
    </div>
  </body>
</html>
```

并且 `small.css` 资源如下所示：

```css
  .yellow {background-color: yellow;}
  .blue {color: blue;}
  .big { font-size: 8em; }
  .bold { font-weight: bold; }
```

就可以按照如下方式内嵌关键的 CSS：

```html
<html>
  <head>
    <style>
      .blue{color:blue;}
    </style>
    </head>
  <body>
    <div class="blue">
      Hello, world!
    </div>
    <noscript id="deferred-styles">
      <link rel="stylesheet" type="text/css" href="small.css"/>
    </noscript>
    <script>
      var loadDeferredStyles = function() {
        var addStylesNode = document.getElementById("deferred-styles");
        var replacement = document.createElement("div");
        replacement.innerHTML = addStylesNode.textContent;
        document.body.appendChild(replacement)
        addStylesNode.parentElement.removeChild(addStylesNode);
      };
      var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
          window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      if (raf) raf(function() { window.setTimeout(loadDeferredStyles, 0); });
      else window.addEventListener('load', loadDeferredStyles);
    </script>
  </body>
</html>
```

注意：

+ 请勿内嵌较大数据 URI
+ 请勿内嵌 CSS 属性（在 HTML 中使用 style 属性）

##### 还有一种技巧

```html
<link href="style.css" rel="stylesheet" media="print" onload="this.media='all'">
```

上面的代码先把媒体查询属性设置成 `print`，将这个资源设置成非阻塞的资源。然后等这个资源加载完毕后，在将媒体查询属性设置成 `all` 让它对当前页面立即生效。

##### 通过 `rel="preload"` 进行内容预加载

```html
<head>
  <meta charset="utf-8">
  <title>JS and CSS preload example</title>

  <link rel="preload" href="style.css" as="style" onload="this.rel='stylesheet'">
  <link rel="preload" href="main.js" as="script">

  <link rel="stylesheet" href="style.css">
</head>

<body>
  <h1>bouncing balls</h1>
  <canvas></canvas>

  <!-- <script src="main.js"></script> -->
</body>
```

目前该方法兼容性较低（firefox、ie 均不支持）

##### 通过 `rel="prefetch"` 进行内容预加载

```html
<head>
  <meta charset="utf-8">
  <title>JS and CSS prefetch example</title>

  <link rel="prefetch" href="style.css" as="style" onload="this.rel='stylesheet'">
  <link rel="prefetch" href="main.js" as="script">

  <link rel="stylesheet" href="style.css">
</head>

<body>
  <h1>bouncing balls</h1>
  <canvas></canvas>

  <!-- <script src="main.js"></script> -->
</body>
```

目前该方法兼容性不高

prefetch 和 preload 的区别

+ preload chunk 会在父 chunk 加载时，以并行的方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
+ preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
+ preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来某个时刻。
+ 浏览器支持程度不同

#### 在 `<link>` 标签中使用 media 属性

这种做法告诉浏览器只有在条件满足的情况下才加载这些资源（例如指定了print，则在打印环境下才会加载这些资源）。

```html
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="print.css" media="print">
```

[优化 CSS 发送过程](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)

[渐进式加载](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps/%E5%8A%A0%E8%BD%BD)

## flex 布局在页面加载时引起的页面跳动

```css
.container {
  display: flex;
  flex-flow: row;
}

nav {
  flex: 1;
  min-width: 118px;
  max-width: 160px;
}

main {
  order: 1;
  flex: 1;
  min-width: 510px;
}

aside {
  flex: 1;
  order: 2;
  min-width: 150px;
  max-width: 210px;
}
```

在页面加载过程中，container 容器开始接收第一个孩子节点 main 。在这个时间点，对于 container 来说只有一个孩子节点，并且带有 `flex: 1` 所以它会充满整个 container 节点。当 nav 节点到达时，main 节点就会重新调整大小，以便让出空间给 nav 节点，这个时候就会导致页面重新布局。

总结：

> 开发过程中慎重使用 `flex: 1` 这种自动撑开的特性

## linux c100k

不过我觉得可能没什么用，毕竟有些修改只用于维持 tcp 连接，是不是有些过了。不过这个配置应该是极致压榨服务器性能以维持 tcp 连接。

```doc
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.core.netdev_max_backlog = 4096
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 20480
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_tw_buckets = 360000
net.ipv4.tcp_no_metrics_save = 1
net.ipv4.tcp_syn_retries = 2
net.ipv4.tcp_synack_retries = 2
```

使用情况还有待考虑

## AMP

AMP is a simple and robust format to ensure your website is fast, user-first, and makes money. AMP provides long-term success for your web strategy with distribution across popular platforms and reduced operating and development costs.

一个 react ui 组件框架

[amp](https://amp.dev/)

## webp

WebP 的优势体现在它具有更优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量；同时具备了无损和有损的压缩模式、Alpha 透明以及动画的特性，在 JPEG 和 PNG 上的转化效果都相当优秀、稳定和统一。

## svg

在 svg 使用 `xlink:href` 属性时会报错: `SVG Namespace prefix xlink for href on textpath is not defined`

需要在根 svg 元素上添加 `xmlns:xlink="http://www.w3.org/1999/xlink` 属性，如下图所示

```html
<svg version="1.1"
    baseProfile="full"
    width="20" height="600"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
```

## setInterval, setTimeout, requestAnimationFrame

为了提高性能和电池寿命，因此在大多数浏览器里，当requestAnimationFrame() 运行在后台标签页或者隐藏的 `<iframe>` 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命

FireFox / Chrome 浏览器对 `setInterval`, `setTimeout` 做了优化，页面处于闲置状态的时候，如果定时间隔小于1秒钟(1000ms)，则停止了定时器。与 `requestAnimationFrame` 有类似行为

|         | setInterval | requestAnimationFrame |
| ------- | ----------- | --------------------- |
| IE      | 无影响      | 暂停                  |
| Safari  | 无影响      | 暂停                  |
| Firefox | >=1s        | 1s - 3s               |
| Chrome  | >=1s        | 暂停                  |
| Opera   | 无影响      | 暂停                  |

## 字符画

[链接](http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20)

```console
  ______   ________   ______   ____  ____  
.' ____ \ |_   __  |.' ____ \ |_  _||_  _|
| (___ \_|  | |_ \_|| (___ \_|  \ \  / /
 _.____`.   |  _|    _.____`.    > `' <
| \____) | _| |_    | \____) | _/ /'`\ \_  
 \______.'|_____|    \______.'|____||____|

```

## 移动端适配问题

### 概念

+ 物理像素（设备物理分辨率，physical pixel）：手机屏幕上显示的最小单员

+ 逻辑分辨率（设备独立像素，device-independent pixel）：css 中设置的像素指的就是该像素。

+ 设备像素比（device pixel ratio）：设备像素比 = 物理像素 / css像素。可以通过JS来获取：`window.devicePixelRatio`

以 iphone6 为例

+ 物理像素为：750 x 1334
+ 逻辑分辨率为：375 x 667
+ 设备像素比为：2

### 视口的基本概念

+ 布局视口（layout viewport）：在浏览器窗口css的布局区域。移动设备上的浏览器都会把自己默认的 viewport 的 width 设为 980px 或其他值

+ 视觉视口（visual viewport）：用户通过屏幕看到的页面区域，用户手动缩放后的显示内容区域，在移动端缩放不会改变布局视口的宽度，仅仅只是放大和缩小。

+ 理想视口：这个视口不是真实存在的，理想视口即最理想布局视口尺寸，就是将布局视口的宽度设置为设备独立像素的宽度

### viewport

设置理想视口

```html
<meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
```

注意：我们在进行媒体查询的时候，查询的宽度值其实也是布局视口的宽度值。

| 属性          | 取值                                                | 含义                         |
| ------------- | --------------------------------------------------- | ---------------------------- |
| width         | 定义视口的宽度，单位为像素                          | 正整数或设备宽度device-width |
| height        | 定义视口的高度，单位为像素                          | 正整数或device-height        |
| initial-scale | 定义初始缩放值                                      | 整数或小数                   |
| minimum-scale | 定义缩小最小比例，它必须小于或等于maximum-scale设置 | 整数或小数                   |
| maximum-scale | 定义放大最大比例，它必须大于或等于minimum-scale设置 | 整数或小数                   |
| user-scalable | 定义是否允许用户手动缩放页面，默认值yes             | yes/no                       |

### 适配方案

1. rem
2. vm、vh 布局
3. flex

用户使用更大的屏幕，是想看到更多的内容，而不是更大的字。

最佳方案：

1. 字体是不需要去根据分辨率改变大小直接固定 px.
2. 使用 flex 弹性布局
