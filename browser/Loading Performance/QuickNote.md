# loading performance

## 概念

### 性能指标

+ FP（First Paint）： 首次绘制，标记浏览器渲染任何在视觉上不同于导航前屏幕内容的时间点
+ FCP（First Contentful Paint）：首次内容绘制，标记渲染第一帧 DOM 的时间点
+ LCP（Largest Contentfel Paint）最大内容绘制
+ FMP（First Meaning Paint）：首次有效绘制，标记主角元素渲染完成的时间点。对于这个时间如何取值目前并没有官方的规定，所以用户可以自行调用 `performance.mark` 进行标记（如 vue 中就可以在用户认为的主要组建的 mounted 方法中进行标记）
+ TTI（Time to Interactive）可交互时间

![avatar](https://upload-images.jianshu.io/upload_images/5328979-ac2f8427d599a9a8.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

### 渲染方式

+ CSR 客户端渲染
+ Prerendering 预渲染
  
  用户请求前的服务器渲染即为「预渲染」，就是在 webpack 构建阶段生成匹配预渲染路径的 html 文件

+ SSR 服务端渲染

  用户请求后的服务器渲染即为「服务端渲染」

+ 同构

## performace API

+ `navigationStart`: 表示从上一个文档卸载结束时的 unix 时间戳，如果没有上一个文档，这个值将和 fetchStart 相等。
+ `unloadEventStart`: 表示前一个网页（与当前页面同域）unload 的时间戳，如果无前一个网页 unload 或者前一个网页与当前页面不同域，则值为 0。
+ `unloadEventEnd`: 返回前一个页面 unload 时间绑定的回掉函数执行完毕的时间戳。
+ `redirectStart`: 第一个 HTTP 重定向发生时的时间。有跳转且是同域名内的重定向才算，否则值为 0。
+ `redirectEnd`: 最后一个 HTTP 重定向完成时的时间。有跳转且是同域名内部的重定向才算，否则值为 0。
+ fetchStart: 浏览器准备好使用 HTTP 请求抓取文档的时间，这发生在检查本地缓存之前。
+ `domainLookupStart/domainLookupEnd`: DNS 域名查询开始/结束的时间，如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
+ `connectStart`: HTTP（TCP）开始/重新 建立连接的时间，如果是持久连接，则与 fetchStart 值相等。
+ `connectEnd`: HTTP（TCP） 完成建立连接的时间（完成握手），如果是持久连接，则与 fetchStart 值相等。
+ `secureConnectionStart`: HTTPS 连接开始的时间，如果不是安全连接，则值为 0。
+ `requestStart`: HTTP 请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存。
+ `responseStart`: HTTP 开始接收响应的时间（获取到第一个字节），包括从本地读取缓存。
+ `responseEnd`: HTTP 响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存。
+ `domLoading`: 开始解析渲染 DOM 树的时间，此时 Document.readyState 变为 loading，并将抛出 readystatechange 相关事件。
+ `domInteractive`: 完成解析 DOM 树的时间，Document.readyState 变为 interactive，并将抛出 readystatechange 相关事件，注意只是 DOM 树解析完成，这时候并没有开始加载网页内的资源。
+ `domContentLoadedEventStart`: DOM 解析完成后，网页内资源加载开始的时间，在 DOMContentLoaded 事件抛出前发生。
+ `domContentLoadedEventEnd`: DOM 解析完成后，网页内资源加载完成的时间（如 JS 脚本加载执行完毕）。
+ `domComplete`: DOM 树解析完成，且资源也准备就绪的时间，Document.readyState 变为 complete，并将抛出 readystatechange 相关事件。
+ `loadEventStart`: load 事件发送给文档，也即 load 回调函数开始执行的时间。
+ `loadEventEnd`: load 事件的回调函数执行完毕的时间。

```js
// 计算加载时间
function getPerformanceTiming() {
  var t = performance.timing
  var times = {}
  // 页面加载完成的时间，用户等待页面可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart
  // 解析 DOM 树结构的时间
  times.domReady = t.domComplete - t.responseEnd
  // 重定向的时间
  times.redirect = t.redirectEnd - t.redirectStart
  // DNS 查询时间
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart
  // 读取页面第一个字节的时间
  times.ttfb = t.responseStart - t.navigationStart
  // 资源请求加载完成的时间
  times.request = t.responseEnd - t.requestStart
  // 执行 onload 回调函数的时间
  times.loadEvent = t.loadEventEnd - t.loadEventStart
  // DNS 缓存时间
  times.appcache = t.domainLookupStart - t.fetchStart
  // 卸载页面的时间
  times.unloadEvent = t.unloadEventEnd - t.unloadEventStart
  // TCP 建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart
  return times
}
```

[5 分钟撸一个前端性能监控工具](https://juejin.im/post/5b7a50c0e51d4538af60d995)

## css 优化

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

## 图片优化

### webp

WebP 的优势体现在它具有更优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量；同时具备了无损和有损的压缩模式、Alpha 透明以及动画的特性，在 JPEG 和 PNG 上的转化效果都相当优秀、稳定和统一。

libwebp

### svg

svgo

[SVGOMG - SVGO's Missing GUI](https://jakearchibald.github.io/svgomg/)

### jpeg

jpegtran 和 jpegoptim

### png

OptiPNG 和 PNGOUT

### gif

+ lossy GIF，gifsicle 或 giflossy 来给 gif 进行有损压缩
+ 使用 webp
+ 使用 apng(animated png)
+ 循环播放的 HTML5 video 进行代替，但是使用 vedio 处理时候，要注意 vedio 不像图片，浏览器不会对其进行预加载，无法右键单击保存

### image sprites （背景精灵图/雪碧图）

一种网页图片应用处理方式，将一个页面涉及到的所有零星图片或者图标都包含到一张大图里面，这样就只需要加载这个一个图片，而不是很多个图片了，这样就减少了很多 `http` 的请求

### 使用 css 和 css3 制作简单的图标

### 字体图库代替图标

### 图片懒加载

先默认加载低质量的图片，用模糊效果展示。当滚动展示的时候再请求高质量的图片。

## 工具链接

[Web.dev](https://web.dev/) 检测的四大项目分別是：效能、可用性、最佳化和 SEO。由 Google 推出

## 视频优化

+ 调整视频码率
+ 浏览器支持的视频编码为 h.264
+ 压缩视频文件
+ 裁剪视频声道
+ 服务器能够处理视频文件的 range 请求
+ 将 moov atom 移动到视频头部，使浏览器尽快能够播放视频而不需要等待整个视频文件都被载入
+ 转为 webm 格式
+ 在视频加载的初始阶段使用低分辨率的视频，根据用户网络状况逐渐过渡到高质量视频
+ 使用 `preload="auto"` 如果视频被观看的可能性比较大。通常，使用 `preload="metadata"` 在数据使用与视频播放前加载时常中提供一个良好的平衡。

## 字体

+ 使用 [glyphhanger](https://github.com/filamentgroup/glyphhanger) 生成优化后的字体子集
+ 使用 preload 如 `<link rel="preload" href="FILE_PATH.woff2" as="font" type="font/woff2" crossorigin>` 但是 preload 最好配合 http2 使用，因为 preload 会占用页面加载时的网络资源。
+ 使用 Servic Worker 缓存字体。
+ 通过设置 `font-display: swap or optional`使字体资源不阻止页面渲染，在字体资源加载完成后，刷新页面字体
+ 未完待续。。。

## 构建优化

+ 减少 JavaScript 脚本大小
+ 使用轻量级的替换库，例如：Moment.js可以用 date-fns 或 Luxon 代替
+ priority hints 提案

    ```html
    <link rel="preload" as="style" importance="low">

    <script src="async_but_important.js" async importance="high"></script>

    <img src="/images/in_viewport_but_not_important.svg" importance="low" alt="I'm an unimportant image!">

    <script>
    fetch("https://example.com/", {importance: "low"}).then(data => {
      // Do whatever you normally would with fetch data
    });
    </script>
    ```

+ 预加载页面中链接页面的资源，例如使用 `quicklink`

## 交互优化

+ 使用 intersetion observer 延迟加载昂贵的组件
+ 图片加载
  + 使用 svg 占位符，图片的边缘绘制，参考 [José M. Pérez](https://jmperezperez.com/svg-placeholders/) 的博客
  + 使用 webp 占位符，例如 medium 使用模糊效果图片作为占位图，可以通过 webp 生成轻量级模糊效果图片。

## 链接优化

+ HTTP2、HTTP3
+ DNS 预解析，DNS 预读取是一项浏览器主动去执行域名解析的功能，其范围包括文档的所有链接，无论是图片的，CSS 的，还是 JavaScript 等其他用户能够点击的 URL

    ```html
    <!-- 打开 DNS 预读取 -->
    <meta http-equiv="x-dns-prefetch-control" content="on">

    <!-- 强制查询特定主机名 -->
    <link rel="dns-prefetch" href="http://www.spreadfirefox.com/">
    ```

+ TSL/SSL 握手加速。TSL v1.2 的版本握手需要两个 RTT
