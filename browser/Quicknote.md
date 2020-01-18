# browsers

## 浏览器加载页面过程

1. URL 解析
2. DNS 查询
3. TCP 连接
4. 流浪器发起 HTTP 请求
5. 服务器响应 HTTP 请求
6. 浏览器解析渲染页面

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

需要服务器设置 `Access-Control-Allow-Origin: *` 响应头

img 标签的 crossOrigin 属性。该属性有两个值

+ `anonymous` 表示：元素的跨域资源请求不需要凭证标志设置。
+ `use-credentials` 表示：元素的跨域资源请求需要凭证标志设置，意味着该请求需要提供凭证，即请求会提供 cookie，服务器得配置 `Access-Control-Allow-Credentials`

## csrf

### 1、什么是CSRF攻击

CSRF 攻击是黑客借助受害者的 cookie 骗取服务器的信任，但是黑客并不能拿到 cookie，也看不到 cookie 的内容。另外，对于服务器返回的结果，由于**浏览器同源策略**的限制，黑客也无法进行解析。因此，黑客无法从返回的结果中得到任何东西，他所能做的就是给服务器发送请求，以执行请求中所描述的命令，在服务器端直接改变数据的值，而非窃取服务器中的数据。

2011年的解决方案：

[CSRF 攻击的应对之道](https://www.ibm.com/developerworks/cn/web/1102_niugang_csrf/)

### 2、有哪些防御方案

1. 用户操作限制，比如验证码；
2. 请求来源限制，比如限制HTTP Referer才能完成操作；
3. token验证机制，比如请求数据字段中添加一个token，响应请求时校验其有效性；

**token验证的CSRF防御机制是公认最合适的方案**，也是本文讨论的重点。

### 实现思路

#### 1、可行性方案

token防御的整体思路是：

+ 第一步：后端随机产生一个 token，把这个 token 保存在 SESSION 状态中；然后将该 token 植入到返回的页面中。你可以参考下面示例代码：

    ```html
    <!DOCTYPE html>
    <html>
    <body>
        <form action="https://time.geekbang.org/sendcoin" method="POST">
          <input type="hidden" name="csrf-token" value="nc98P987bcpncYhoadjoiydc9ajDlcn">
          <input type="text" name="user">
          <input type="text" name="number">
          <input type="submit">
        </form>
    </body>
    </html>
    ```

+ 第二步：下次前端需要发起请求（比如发帖）的时候把这个 token 加入到请求数据或者头信息中，一起传给后端；
+ 第三步：后端校验前端请求带过来的 token 和 SESSION 里的 token 是否一致；
+ 第四步：定时更新 token 防止 token 被解析，每5分钟更新一次

这里依旧有个细节值得提一下：**Nodejs 的上层一般是 nginx，而 nginx 默认会过滤头信息中不合法的字段（比如头信息字段名包含“_”的），这里在写头信息的时候需要注意。**

### "One more thing..."

上文也提到，通过cookie及http头信息传递加密token会有很多弊端；有没有更优雅的实现方案呢？

#### 1、cookie中samesite属性

回溯下 CSRF 产生的根本原因：cookie 会被第三方发起的跨站请求携带，这本质上是 HTTP 协议设计的漏洞。

那么，我们能不能通过 cookie 的某个属性禁止 cookie 的这个特性呢？

好消息是，在最新的 RFC规范中已经加入了 `samesite` 属性。细节这里不再赘述，可以参考：

1. [SameSite Cookie，防止 CSRF 攻击](http://www.cnblogs.com/ziyunfei/p/5637945.html)
2. [Same-site Cookies](https://tools.ietf.org/html/draft-west-first-party-cookies-07#page-8)

### 实践

#### axios csrf

`headers: { 'X-CSRF-TOKEN': 获取上面csrf返回的数据 }`

开坑待填。。。

#### fetch csrf

开坑代填。。。

[前后端分离架构下CSRF防护机制](https://github.com/xiongwilee/blog/issues/7)

#### SameSite

已验证

##### Strict

Strict 为严格模式，另一个域发起的任何请求都不会携带该类型的 cookie，能够完美的阻止 CSRF 攻击。通过一个导航网站的超链接打开另一个域的网页也不能携带该类型的 cookie

##### Lax

Lax 相对于 Strict 模式来说，放宽了一些。简单来说就是，用**安全的 HTTP 方法（GET、HEAD、OPTIONS 和 TRACE）改变了当前页面或者打开了新页面时**，可以携带该类型的 cookie。

[跨站请求伪造与 Same-Site Cookie](https://www.jianshu.com/p/66f77b8f1759)

[SameSite Cookie attribute?](https://medium.com/compass-security/samesite-cookie-attribute-33b3bfeaeb95)

[「每日一题」CSRF 是什么？](https://zhuanlan.zhihu.com/p/22521378)

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

正常来说在 css 放在头部，将 js 文件放在尾部的 html 文件里，js 加载会阻塞文档解析，而脚本需要等位于脚本前面的css加载完才能执行。过程就是 css 加载 -> html 解析 -> js 加载 -> html 解析 -> DOMContentLoaded

### 为什么 css 放在 head 标签，将 js 放在 body 标签尾部

我们再来看一下 chrome 在页面渲染过程中的，绿色标志线是First Paint 的时间。纳尼，为什么会出现 firstpaint，页面的 paint 不是在渲染树生成之后吗？其实现代浏览器为了更好的用户体验,渲染引擎将尝试尽快在屏幕上显示的内容。它不会等到所有 HTML 解析之前开始构建和布局渲染树。部分的内容将被解析并显示。也就是说浏览器能够渲染不完整的 dom 树和 cssom，尽快的减少白屏的时间。假如我们将 js 放在 header，js 将阻塞解析 dom，dom 的内容会影响到 First Paint，导致 First Paint 延后。所以说我们会将 js 放在后面，以减少 First Paint 的时间，但是不会减少 DOMContentLoaded 被触发的时间

![load & DOMContentLoaded](https://images2015.cnblogs.com/blog/746387/201704/746387-20170407181151019-499554025.png)

## iframe

## localStorage

`localStorage` 类似 `sessionStorage`，但其区别在于：存储在 `localStorage` 的数据可以长期保留；而当页面会话结束——也就是说，当页面被关闭时，存储在 `sessionStorage` 的数据会被清除

### 限制

处于浏览器的同源策略，相同的协议、相同的主机名、相同的端口下才能访问相同的 `localStorage` 中的数据，这点跟 `cookie` 的差别还是蛮大的

### 容量限制

目前业界基本上统一为5M，已经比 `cookie` 的4K要大很多了。

### 数据结构

`key - value` 键值对（键值对总是以字符串的形式存储意味着数值类型会自动转化为字符串类型）

## 浏览器缓存

### http 常见 header 字段

+ expires: 告知客户端资源缓存失效的绝对时间
+ last-modified: 资源最后一次修改的时间
+ Etag: 文件的特殊标识
+ cache-control:告诉客户端或是服务器如何处理缓存。
+ private: cache-control里的响应指令.表示客户端可以缓存
+ public: cache-control里的响应指令.表示客户端和代理服务器都可缓存.如果没有明确指定private，则默认为public。
+ no-cache: cache-control里的指令.表示需要可以缓存，但每次用应该去向服务器验证缓存是否可用
+ no-store: cache-control字段里的指令.表示所有内容都不会缓存，强制缓存，对比缓存都不会触发.
+ max-age=xxx: cache-control字段里的指令.表示缓存的内容将在 xxx 秒后失效

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

## XSS

### 攻击

XSS 全称是 Cross Site Scripting，为了与 `CSS` 区分开来，故简称 XSS，翻译过来就是“跨站脚本”。

#### 1. 储存型 XSS

+ 首先黑客利用站点漏洞将一段恶意JavaScript代码提交到网站的数据库中；
+ 然后用户向网站请求包含了恶意JavaScript脚本的页面；
+ 当用户浏览该页面的时候，恶意脚本就会将用户的Cookie信息等数据上传到服务器。

例子：[喜马拉雅存储性 XSS](https://shuimugan.com/bug/view?bug_no=138479)

#### 2. 反射型 XSS

基本无用

#### 3. 基于 DOM 的XSS

黑客通过各种手段将恶意脚本注入用户的页面中，比如通过网络劫持在页面传输过程中修改HTML页面的内容，这种劫持类型很多，有通过WiFi路由器劫持的，有通过本地恶意软件来劫持的，它们的共同点是在Web资源传输过程或者在用户使用页面的过程中修改Web页面的数据。

### 防御

#### 输入过滤

#### 静态脚本拦截

我们假定现在页面上被注入了一个 `<script src="http://attack.com/xss.js">` 脚本，我们的目标就是拦截这个脚本的执行。

```js
// MutationObserver 的不同兼容性写法
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver ||
window.MozMutationObserver;
// 该构造函数用来实例化一个新的 Mutation 观察者对象
// Mutation 观察者对象能监听在某个范围内的 DOM 树变化
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // 返回被添加的节点,或者为null.
    var nodes = mutation.addedNodes;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (/xss/i.test(node.src))) {
        try {
          node.parentNode.removeChild(node);
          console.log('拦截可疑静态脚本:', node.src);
        } catch (e) {}
      }
    }
  });
});

// 传入目标节点和观察选项
// 如果 target 为 document 或者 document.documentElement
// 则当前文档中所有的节点添加与删除操作都会被观察到
observer.observe(document, {
  attributes: false,
  subtree: true,
  childList: true
});
```

该方法可以监听拦截到动态脚本的生成，但是无法在脚本执行之前，使用 removeChild 将其移除，所以我们还需要想想其他办法

#### CSP

```html
<meta http-equiv="Content-Security-Policy" content="default-src https://cdn.example.net; child-src 'none'; object-src 'none'">
```

详细属性请参考 [内容安全策略( CSP ) - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Security/CSP/CSP_policy_directives)

参考资料

[【前端安全】JavaScript防http劫持与XSS](https://www.cnblogs.com/coco1s/p/5777260.html)

[内容安全政策](https://developers.google.com/web/fundamentals/security/csp?hl=zh-CN)
