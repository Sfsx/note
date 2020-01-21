# html 快速笔记

## HTML5

HTML5 是定义 HTML 标准的最新版本。该术语通过两个不同的概念来表现：

+ 它是一个新版本的 HTML 语言

+ 语义：能够让你更恰当地描述你的内容是什么。
+ 连通性：能够让你和服务器之间通过创新的新技术方法进行通信。
+ 离线 & 存储：能够让网页在客户端本地存储数据以及更高效地离线运行。
+ 多媒体：使 video 和 audio 成为了在所有 Web 中的一等公民。
+ 2D/3D 绘图 & 效果：提供了一个更加分化范围的呈现选择。
+ 性能 & 集成：提供了非常显著的性能优化和更有效的计算机硬件使用。
+ 设备访问 Device Access：能够处理各种输入和输出设备。
+ 样式设计: 让作者们来创作更加复杂的主题吧！

## HTML5 语义

### HTML5 中的区块和段落元素

#### `<header>` 元素

`<header>` 元素里，应该包含**介绍性的内容**。介绍性的内容可能包括：Logo、公司名、导航栏、作者信息等等。

一般出现在 `<section>`、`<article>`、`<body>` 的开头

#### `<nav>` 元素

`<nav>` 元素定义导航链接的部分

#### `<footer>` 元素

`<footer>` 元素描述了稳定的底部区域。有的网页中也会吧 `<nav>` 放到 `<footer>` 里。

#### `<article>` 元素

`<article>` 元素定义网页中**独立**内容。`<article>` 元素就像一个个**独立**的页面通常有自己的 `<header>` 和 `<footer>`。这里所说的独立是指：即使删除某个 `<article>` 元素不会对网页整体布局造成影响，也不会影响到其他 `<article>` 元素

#### `<section>` 元素

`<section>` 元素定义文档中的独立部分。section 的例子包括书的章节回目、多 tab 对话框的每个 tab 页、论文以数字编号的小节。网站的主页可能分成介绍、最新内容、联系信息等section。

可以把它形容成带语义的 `<div>`。用来有意义的划分空间。同时，`<section>` 一般来说会有包含一个标题 `<h1> - <h6>`，通常不推荐哪些没有标题的内容用 section。

注意：网页作者应使用 article 而不是 section 元素的情况，如果其内容是用于聚合（syndicate）。比如blog首页上的每篇blog。又如论坛帖子的一楼、二楼、三楼……n楼。通常这样的每部分内容形式上是类似的，但是来源是独立的。

注意：`<section>` 不是通用容器元素。如果仅仅是用于设置样式或脚本处理，应用 `<div>` 元素。一条简单的准则是，只有元素内容会被列在文档大纲中时，才适合用 `<section>` 元素

#### `<aside>` 元素

`<aside>` 标签定义页面主区域内容无关的部分，被认为是独立于该内容的一部分并且可以被单独的拆分出来而不会使整体受影响（比如侧边栏）。

### 新的语义元素

#### `<figure>` 元素

包含图像、图表、照片、表格和代码

#### `<figcaption>` 元素

`<figure>` 的说明标题

#### `<details>` 元素

额外信息。可创建一个挂件，仅在被切换成展开状态时，它才会显示内含的信息。`<summary>` 元素可为该部件提供概要或者标签

#### `<summary>` 元素

为 `<details>` 元素定义一个可见的标题

#### `<time>` 元素

HTML time 标签(`<time>`) 用来表示24小时制时间或者公历日期，若表示日期则也可包含时间和时区。

#### `<data>` 元素

HTML `<data>` 元素将一个指定内容和机器可读的翻译联系在一起。但是，如果内容是与时间或者日期相关的，则一定要使用 `<time>`。

```html
<p>新产品</p>
<ul>
 <li><data value="398">迷你番茄酱</data></li>
 <li><data value="399">巨无霸番茄酱</data></li>
 <li><data value="400">超级巨无霸番茄酱</data></li>
</ul>
```

#### `<output>` 元素

HTML `<output>` 标签表示计算或用户操作的结果。

```html
<form oninput="result.value=parseInt(a.value)+parseInt(b.value)">
    <input type="range" name="b" value="50" /> +
    <input type="number" name="a" value="10" /> =
    <output name="result"></output>
</form>
```

#### `<strong>` 元素

重要文本 加粗

#### `<em>` 元素

强调文本 斜体

#### `<progress>` 元素

```html
<progress value="70" max="100">70 %</progress>
```

### 使用 HTML5 的音频和视频

#### `<audio>`

#### `<video>`

+ [HTML语义化 & 网页布局](https://zhuanlan.zhihu.com/p/32990471)
+ [你如何理解 HTML5 的 section？会在什么场景使用？为什么这些场景使用 section 而不是 div？](https://www.zhihu.com/question/20227599)

## HTML 连通性

### Web Socket

### Server-sent events

`EventSource` 接口用于接收服务器发送的事件。它通过 HTTP 连接到一个服务器，以 `text/event-stream` 格式接收事件, 不关闭连接。服务器收到连接后，不关闭连接，在该连接内，向客户端传递事件消息。

```js
var evtSource = new EventSource("api/v1/eventsource");
```

开始监听消息

```js
evtSource.onmessage = function(e) {
  var newElement = document.createElement("li");
  
  newElement.innerHTML = "message: " + e.data;
  eventList.appendChild(newElement);
}
```

或者

```js
evtSource.addEventListener("ping", function(e) {
  var newElement = document.createElement("li");
  
  var obj = JSON.parse(e.data);
  newElement.innerHTML = "ping at " + obj.time;
  eventList.appendChild(newElement);
}, false);
```

服务器推送的事件流为 UTF-8 编码的文本，每条消息是由多个字段组成的，每个字段由字段名，一个冒号，以及字段值组成。

```string
event: userconnect
data: {"username": "bobby", "time": "02:33:48"}

data: Here's a system message of some kind that will get used
data: to accomplish some task.
```

[使用服务器发送事件](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events)

[利用WebSocket和EventSource实现服务端推送](https://juejin.im/post/5c121c77f265da614a3a5e07)

### WebRTC

## 离线 & 存储

### 在线和离线事件

`navigator.onLine`

### WHATWG 客户端会话和持久化存储（又名 DOM 存储）

因此和 DOM 访问一样，受浏览器同源策略的限制。目前几乎所有浏览器都支持。

#### sessionStorage

sessionStorage 是个全局对象，它维护着在页面会话期间有效地存储空间。只要浏览器开着，页面会话周期会一直持续。当页面重新载入或者被恢复时，页面会话也是一直存在的。每在新标签或者新传开中打开一个新页面，都会初始化一个新的会话。

#### localStorage

当页面会话结束，存储在 localStorage 的数据可以长期保留。

## 性能 & 集成

### XMLHttpRequest Level 2

开坑待填

### 基于 Web 的协议处理程序

web 中发起其他协议请求，可以用

```js
window.open('mailto:someone@yoursite.com') // mailto 协议为启动系统默认电子邮件软件发送电子邮件
```

或者

```html
<a href="mailto:someone@yoursite.com">Email Us</a>  
```

当然我们也可以通过网站接管该协议，使得某个 web 应用程序成为某种协议的处理者，而不是使用系统默认软件作为协议的处理者。

设置一个 web 应用程序作为一个协议处理器不是一个很麻烦的过程。web 应用程序可以使用 `registerProtocolHandler()` 注册到浏览器上，从而对于一个给定的协议来讲，作为一个潜在的处理程序。例如:

```js
navigator.registerProtocolHandler("mailto",
                                  "https://www.example.com/?uri=%s",
                                  "Example Mail");
```

+ 协议名称.
+ url模板。%s用来替换链接的href属性，之后通过这个url来发起一个GET请求.
+ 一个对用户友好的协议处理器的名字.

## XHTML HTML XML 联系以及区别

### XML

XML 被设计用来传输和存储数据。XML 不是对 HTML 的替代而是对 HTML 的补充

### HTML

HTML 被设计用来显示数据。

### xhtml

XHTML 是更严格更纯净的 HTML 代码。

+ XHTML 指可扩展超文本标签语言（EXtensible HyperText Markup Language）。
+ XHTML 的目标是取代 HTML。
+ XHTML 与 HTML 4.01 几乎是相同的。
+ XHTML 是更严格更纯净的 HTML 版本。
+ XHTML 是作为一种 XML 应用被重新定义的 HTML。
+ XHTML 是一个 W3C 标准。

XML 是一种标记化语言，其中所有的东西都要被正确的标记，以产生形式良好的文档。

XML 用来描述数据，而 HTML 则用来显示数据。

今天的市场中存在着不同的浏览器技术，某些浏览器运行在计算机中，某些浏览器则运行在移动电话和手持设备上。而后者没有能力和手段来解释糟糕的标记语言。

因此，通过把 HTML 和 XML 各自的长处加以结合，我们得到了在现在和未来都能派上用场的标记语言 - XHTML。

### html 和 xhtml 和 xml 的区别

1. html 即是超文本标记语言（Hyper Text Markup Language），是最早写网页的语言，但是由于时间早，规范不是很好，大小写混写且编码不规范；
2. xhtml 是更严谨更纯净的 html 版本（Extensible Hyper Text Markup Language）。对html进行了规范，编码更加严谨纯洁，也是一种过渡语言，html 向 xml 过渡的语言；
3. xml 即时可扩展标记语言（Extensible Markup Language），是一种跨平台语言，编码更自由，可以自由创建标签。xml 设计用来传送及携带数据信息，不用来表现或展示数据

### html 与 xhtml 之间的区别

1. xhtml 对比与 html，xhtml 文档具有良好完整的排版
   + 元素必须要有结束标签
   + 元素必须嵌套
2. 对于 html 的元素和属性，xhtml必须小写，因为xml是严格区分大小写的，`<li>`和`<LI>`是不同的标签
3. xhtml 的属性值必须在引号之中
4. xhtml 不支持属性最小化，什么是属性最小化了？
    + 正确:非最小化属性(unminimized attributes)  
    `<input checked="checked">`
    + 不正确:最小化属性(minimized attributes)  
    `<input checked>`
5. 在 xhtml 中，name 属性是不赞成使用的，在以后的版本中将被删除。

## 发展历程

1. HTML1.0 IETE(internet engineering tesk force，因特网工程任务组)
2. HTML2.0 IETE官方规范
3. HTML3.2 W3C官方规范
4. HTML4.01 1997-1999 从3.2发展到4.0， 进而到4.01。（从此进入了漫长的发展期）
5. 2000年，W3C 发布 HTML 4.01 的 XML 版命名为 XHTML1.0
6. 2004年，由于 W3C 提出的 XHTML2.0 无法向后兼容，某用户更新了浏览器，打开了从前某个网址，打不开了。用户体验不好了，就直接等价于浏览器要流失用户了。开发者也不支持，更加严格的写法就意味着要遵循更加严格的规范，但凡有一点出入浏览器就解析不出来了。浏览器厂商联合成立组织 WHATWG 来推动 HTML5 标准。
7. 2006年，W3C 与 WHATWG 达成协议
8. 2008年，发布了 HTML5 的工作草案
9. 2009年，W3C 停止对 XHTML2.0 的更新
10. 2014年，HTML5 标准完成

[HTML5发展简史](https://zhuanlan.zhihu.com/p/44164232)

## <!DOCTYPE>

`<!DOCTYPE>` 声明必须是 HTML 文档的第一行，位于 `<html>` 标签之前。

`<!DOCTYPE>` 声明不是 HTML 标签；它是指示 web 浏览器关于也没使用哪个 HTML 版本进行编写的指令。

### HTML 4.01

在 HTML 4.01 中，`<!DOCTYPE>` 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。

HTML 4.01 的三种 `<IDOCTYPE>` 声明如下：

#### HTML 4.01 Strict

该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

#### HTML 4.01 Transitional

该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。

```html
<!DOCTYPE HTML PUBLIC "-//W#C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

#### HTML 4.01 Frameset

该 DTD 等同于 HTML 4.01 Transitional，但允许框架集内容。

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

### HTML 5

```html
<!DOCTYPE html>
```
