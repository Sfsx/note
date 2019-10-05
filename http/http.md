# http

[Hypertext Transfer Protocol -- HTTP/1.1](https://www.w3.org/Protocols/rfc2616/rfc2616.html)

## header

[header](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)

### Standard request fields

### Standard response fields

## cookie

### secure

### httpOnly

## statue code

[Status Code Definitions](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

### 1XX 信息性

#### 100 continue

信息型状态响应码表示目前为止一切正常，客户端应该继续请求，如果已完成请求则忽略。

为了让服务器检查请求的首部，客户端必须在发送请求实体前，在初始化请求中发送 Expect: 100-continue 首部并接收 100 Continue 响应状态码。

#### 101 Switching Protocols

状态码表示服务器应客户端升级协议的请求（ Upgrade 请求头）正在进行协议切换。
服务器会发送一个 Upgrade 响应头来表示其正在切换过去的协议。

### 2XX 成功

#### 200 OK

#### 201 Created

表示请求已经被成功处理，并且创建了新的资源。新的资源在应答返回之前已经被创建。同时新增的资源会在应答消息体中返回，其地址或者是原始请求的路径，或者是 `Location` 首部的值。

这个状态码的常规使用场景是作为 `POST` 请求的返回值。

#### 202 Accepted

表示服务器端已经收到请求消息，但是尚未处理。这个状态码被设计用来将请求交由另外一个进程或者服务器来进行处理，或者是对请求进行批处理的情形。

#### 203 Non-Authoritative Information

表示请求已经成功被响应，但是经过拥有转换功能的代理服务器的转换。

203 状态码有点类似 `Warning` 首部的 214（Transformation Applied）警告码。后者的优势在于可以应用于任何状态码。

#### 204 No Content

表示请求成功，但客户端不需要更新其现有页面。204 响应默认是可以被缓存的。在响应头中需要包含头信息 `ETag`。

使用习惯是，在 `PUT` 请求中进行资源更新，但是不需要改变当前展示给用户的页面，那么返回 204 No Content。如果创建了新的资源，那么返回 201 Created。如果页面需要更新以反映更新后的资源，那么需要返回 200。

### 205 Reset Content

用来通知客户端重置文档视图，比如清空表单内容、重置 canvas 状态或刷新用户界面。

### 206 Partial Content

表示请求已经成功，并且主体包含所请请求的数据区间，该数据区间是在请求 `Range` 首部指定的。

如果只包含一个数据区间，那么整个响应的 `Content-Type` 首部值为所请求的文件类型，同时包含 `Content-Range` 首部。

如果包含多个数据区间，那么整个响应的 `Content-Type` 首部的值为 `multipart/byteranges`，其中一个片段对于一个数据区间，并提供 `Content-Range` 和 `Content-Type` 描述信息

## HTTP 请求相关问题

### 现代浏览器在与服务器简历了一个 TCP 连接后是否会在一个 HTTP 请求完成后断开

在 HTTP/1.0 中，一个服务器在发送完一个 HTTP 响应后，会断开 TCP 链接。但是这样每次请求都会重新建立和后端的 TCP 连接，代价过大。为了减少资源消耗，缩短响应时间，引入了重用连接的机制，就是在http请求头中加入 `Connection: keep-alive` 来告诉对方这个请求响应完成后不要关闭，下一次咱们还用这个请求继续交流。

协议规定 HTTP/1.0 如果想要保持长连接，需要在请求头中加上 `Connection: keep-alive`

HTTP/1.1 默认是支持长连接的，有没有这个请求头都行

HTTP/2 拥有二进制分帧层，将所有传输的信息分割为更小的消息和帧（frame），并对他们采用二进制格式的编码。HTTP/2 通信都在一个连接上完成，这个连接可以承载任意数量的双向数据流。

### keep-alive 模式下客户端如何判断请求所得到的响应数据已经接受完成

非 keep-alive 模式下，服务器通常在发送回所请求的数据之后就关闭连接。这样客户端读数据时会返回 EOF（-1），就知道数据已经接受完全了。

keep-alive 模式下，tcp 连接能够复用，但同一个 tcp 连接中请求不能并行发送，只能串行发送。

使用消息首部字段 Content-Length 字段。Content-Length 表示实体内容长度，当客户端向服务器请求一个静态页面或者一张图片时，服务器可以很清楚的知道内容大小。

使用消息首部 Transfer-Encoding 字段。 如果是动态数据，服务器是不可能预先知道数据的大小。这时如果想要知道准确的数据大小，只能开一个足够大的 buffer，等内容全部生成好在计算。但这种方式一方面需要更大的内存开销，另一方面也会让客户端等待更久。Content-Length 就失效了。这时可以使用 Transfer-Encoding 字段，即 `Transfer-Encoding: chunked`。具体方法：

1. 在头部加入 Transfer-Encoding: chunked 之后，就代表这个报文采用了分块编码。这时，报文中的实体需要改为用一系列分块来传输。
2. 每个分块包含十六进制的长度值和数据，长度值独占一行，长度不包括它结尾的 CRLF(\r\n)，也不包括分块数据结尾的 CRLF。
3. 最后一个分块长度值必须为 0，对应的分块数据没有内容，表示实体结束。
4. Content-Encoding 和 Transfer-Encoding 二者经常会结合来用，其实就是针对 Transfer-Encoding 的分块再进行 Content-Encoding压缩。

例子：

```html
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

25\r\n
This is the data in the first chunk\r\n

1C\r\n
and this is the second one\r\n

3\r\n
con\r\n

8\r\n
sequence\r\n

0\r\n
\r\n
```

### 一个TCP连可以对于几个 HTTP 请求

了解了第一个问题之后，其实这个问题已经有了答案，如果维持连接，一个 TCP 连接是可以发送过个 HTTP 请求的。

### 为什么有的时候刷新页面不需要重新建立 SSL 连接

问题一中的答案，TCP 连接会被浏览器和服务器维持一段时间。这个时间由 header 中的 `Keep-Alive: timeout=5, max=100` 字段控制。意思为：过期时间5秒（对应httpd.conf里的参数是：KeepAliveTimeout），max是最多一百次请求，强制断掉连。

### 浏览器对同一个 HOST 建立 TCP 连接的数量有没有限制

![流浪器连接限制](https://pic2.zhimg.com/80/ea606d016e8ab77db9d8a8dfa5243a1b_hd.jpg)

### 收到的 HTML 如果包含几十个图片标签，这些图片是以什么方式、什么顺序、建立了多少连接、使用什么协议被下载下来的呢

浏览器就会在一个 HOST 上建立多个 TCP 连接，连接数量的最大限制取决于浏览器设置，这些连接会在空闲的时候被浏览器用来发送新的请求，如果所有的连接都正在发送请求呢？那其他的请求就只能等等了。

[你猜一个 TCP 连接上面能发多少个 HTTP 请求](https://zhuanlan.zhihu.com/p/61423830)
