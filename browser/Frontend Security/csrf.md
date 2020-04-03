# 前端安全

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

限制 http 请求主要是为了防止 CSRF 攻击

### 如何解决

#### cookie

页面可以改变本身的源，但是会有一些限制。脚本可以将 `document.domain` 设置为当前域或者当前域的超级域，该较短的域会用于后续源检查。

#### DOM

h5 的 `window.postMessage` api

#### http 请求

HTTP访问控制（CORS）

后端代理访问

JSONP

nginx 转发

postmessage

WebSocket

#### localStorage、indexDB

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

### 什么是 CSRF 攻击

CSRF 攻击是黑客借助受害者的 cookie 骗取服务器的信任，但是黑客并不能拿到 cookie，也看不到 cookie 的内容。另外，对于服务器返回的结果，由于**浏览器同源策略**的限制，黑客也无法进行解析。因此，黑客无法从返回的结果中得到任何东西，他所能做的就是给服务器发送请求，以执行请求中所描述的命令，在服务器端直接改变数据的值，而非窃取服务器中的数据。

### 常见 CSRF 攻击类型

+ GET 类型的 CSRF

```html
 <img src="http://bank.example/withdraw?amount=10000&for=hacker" >
```

+ POST 类型的 CSRF

```html
<form action="http://bank.example/withdraw" method=POST>
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script>
```

+ 链接类型的 CSRF

```html
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
</a>
```

### 有哪些防御方案

1. 同源检测
2. token验证机制，比如请求数据字段中添加一个token，响应请求时校验其有效性
3. somesite

**token验证的CSRF防御机制是公认最合适的方案**，也是本文讨论的重点。

### token

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

#### token 防御更新

正确的做法应该是在登入的时候服务端返回 token ，之后客户端登入每携带 token。如果直接将 token 放在 dom 中，攻击者可以通过 xss 攻击获取 token，或者通过攻击者的服务器模拟浏览器获取被攻击的页面，进而得到 dom 中的 token

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

### 同源检测

#### Origin Header

+ IE 11 不会在跨站 cors 上添加请求头 origin
+ 302 重定向不会携带 origin

#### Referer Header

+ refere policy
+ refere 可被修改

同时验证 origin 与 refere，如果 refere 和 origin 都不存在直接拒绝

[跨站请求伪造与 Same-Site Cookie](https://www.jianshu.com/p/66f77b8f1759)

[SameSite Cookie attribute?](https://medium.com/compass-security/samesite-cookie-attribute-33b3bfeaeb95)

[前端安全系列之二：如何防止CSRF攻击？](https://juejin.im/post/5bc009996fb9a05d0a055192)

## websocket 劫持

websocket 升级请求协议

```http
GET ws://echo.websocket.org/?encoding=text HTTP/1.1
Host: echo.websocket.org
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
Origin: http://www.websocket.org
Sec-WebSocket-Version: 13
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) Chrome/49.0.2623.110
Accept-Encoding: gzip, deflate, sdch
Accept-Language: en-US,en;q=0.8,zh-CN;q=0.6
Cookie: _gat=1; _ga=GA1.2.2904372.1459647651; JSESSIONID=1A9431CF043F851E0356F5837845B2EC
Sec-WebSocket-Key: 7ARps0AjsHN8bx5dCI1KKQ==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
```

websocket 协议升级响应

```http
HTTP/1.1 101 Web Socket Protocol Handshake
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: content-type
Access-Control-Allow-Headers: authorization
Access-Control-Allow-Headers: x-websocket-extensions
Access-Control-Allow-Headers: x-websocket-version
Access-Control-Allow-Headers: x-websocket-protocol
Access-Control-Allow-Origin: http://www.websocket.org
Connection: Upgrade
Date: Sun, 03 Apr 2016 03:09:21 GMT
Sec-WebSocket-Accept: wW9Bl95VtfJDbpHdfivy7csOaDo=
Server: Kaazing Gateway
Upgrade: websocket
```

一旦服务器端返回 101 响应，即可完成 WebSocket 协议切换。服务器端即可基于相同端口，将通信协议从 `http://` 或 `https://` 切换到 `ws://` 或 `wss://`，协议切换完成后，浏览器和服务器端就可以使用 WebSocket Api 互相发送文本和二进制消息。

WebSocket 协议不受浏览器同源策略限制，跨域 WebSocket 可以直接连接。而且 WebSocket 协议没有规定服务器在握手阶段如何认证客户端身份，这个需要使用过程中自行设置。

1. http 协议头 origin 字段监测，是否在白名单列表
2. token 客户端将 token 作为 WebSocket 连接参数，或者放在连接请求头 auth 字段里，发送到服务器端

[小心 ！跨站点websocket劫持！](https://juejin.im/entry/5c497d8b51882525c55fcd4c)

[深入理解跨站点 WebSocket 劫持漏洞的原理及防范](https://www.ibm.com/developerworks/cn/java/j-lo-websocket-cross-site/index.html)

## jsonp 劫持

jsonp 中没有校验请求方，导致攻击者的请求也会得到正常返回。对于 jsonp 的防御没有绝对

1. token
2. 验证 refere
3. 请求返回严格设置 `Content-Type : application/json; charset=utf-8`
4. 严格过滤 callback 函数名
