# XSS

## 攻击

XSS 全称是 Cross Site Scripting，为了与 `CSS` 区分开来，故简称 XSS，翻译过来就是“跨站脚本”。

### 1. 储存型 XSS

+ 首先黑客利用站点漏洞将一段恶意 JavaScript 代码提交到网站的数据库中；
+ 然后用户向网站请求包含了恶意 JavaScript 脚本的页面；
+ 当用户浏览该页面的时候，恶意脚本就会执行。

例子：[喜马拉雅存储性 XSS](https://shuimugan.com/bug/view?bug_no=138479)

### 2. 反射型 XSS

恶意脚本本身作为请求参数发送到站点页面存在的地方（通常是搜索框），然后脚本反射（出现）在新渲染（或者部分刷新）的页面并执行。

例子：

某个网站有个错误页面

```url
https://www.Sfsx.com/error?message=Sorry,%20an%20error%20occurred.
```

跳转后页面内容为

```html
<p>Sorry, an error occurred.</p>
```

这个时候如果请求地址改为

```url
https://www.Sfsx.com/error?message=%3Cscript%3Ealert(%22xss%22);%3C/script%3E
```

那么页面就会是

```html
<p><script>alert("xss");</script></p>
```

js 代码就会被执行

### 3. 基于 DOM 的 XSS

黑客通过各种手段将恶意脚本注入用户的页面中，比如通过网络劫持在页面传输过程中修改 HTML 页面的内容，这种劫持类型很多，有通过 WiFi 路由器劫持的，有通过本地恶意软件来劫持的，它们的共同点是在Web资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据。

当页面中的 js 会根据页面 url 生成 dom。这时如果没有对 url 进行检测，那么 url 中如果有 js 代码，就会生成 `<script></script>` 节点，从而执行恶意脚本。基于 DOM 的 XSS 可以说是反射型 XSS 的一种。

例子：

```html
<script>
  document.write("<b>Currnet URL</b>" + document.baseURI);
</script>
```

这段代码会在网页里生成 DOM 节点，如果按下述地址请求

```url
http://网页url地址#<script>alert(1)</script>
```

那么网页就会注入恶意脚本并执行。

+ `document.referer` 属性
+ `window.name` 属性
+ `location` 属性
+ `innerHTML` 属性
+ `documen.write` 属性

## 常用防范方法

### 输入过滤

### 转义HTML

### httpOnly

### 静态脚本拦截

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

参考资料

[【前端安全】JavaScript防http劫持与XSS](https://www.cnblogs.com/coco1s/p/5777260.html)

### 预防存储型和反射型 XSS 攻击

+ 改用前端渲染
+ 输入过滤

### 预防基于 DOM 型 XSS 攻击

DOM 中的内联事件监听器 `onclick`、`onerror`、`onload`

`<a>` 标签的 `herf` 属性

js 中直接插入 HTML 的方法 `innerHTML`，`location`，`document.write`

js 中的 `eval()`，`setTimeout()`，`setInterval()` 等能把字符串作为代码运行的方法

在使用以上方法要特别小心，不能直接将用户输入数据作为参数，需要对其进行转译。

## 内容安全策略 CSP

CSP 的主要目标是减少和报告 XSS 攻击 ，XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行。

CSP 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，开发者只需提供配置。

### 使用 CSP

两种制定 CSP 策略的方法：

使用 `Content-Security-Policy` HTTP 头部来制定你的策略

```http
Content-Security-Policy: policy
```

使用 `<meta>` 元素也可以用来配置该策略

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
```

### 策略指令

+ child-src
  
  child-src 指定定义了 web workers 以及嵌套的浏览上下文（如 `<frame>` 和 `<iframe>` ）的源。推荐使用该指令，而不是被废弃的 frame-src 指令。对于 web workers，不符合要求的请求会被当做致命网络错误。

+ connect-src

  connect-src 指令定义了请求、XMLHttpRequest、WebSocket 和 EventSource 的连接来源。

+ font-src
+ img-src
+ media-src
+ object-src

  object-src 指定了 `<object>`, `<embed>`, 和 `<applet>` 标签的源地址。

+ script-src
+ style-src

### 报告模式

CSP 可以使用报告模式，在此模式下，CSP 策略不是强制性的，但是任何违规行为将会报告给一个指定的 URI 地址。此外，一个报告模式的头部可以用来测试一个新修订的策略

```http
Content-Security-Policy-Report-Only: policy
```

### 启用违例报告

默认情况下，违规报告不会发送，为启用发送违规报告，你需要指定 `repoet-uri` 策略指令，并提供至少一个 URI 地址用于提交报告

```http
Content-Security-Policy: default-src 'self'; report-uri http://reportcollector.example.com/collector.cgi
```

[内容安全策略( CSP )](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
