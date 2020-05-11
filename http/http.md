# http

互联网工程任务组（IETF）发布的由委员会创建的草案中的协议规范，叫作 RFC（Request for Comments，请求注解）。委员会对所有人开放，前提是你有时间和意愿参与。HTTP/1.1 最早在 RFC 2068 中定义，之后被 RFC 2616 取代，最终在 RFC 7230 到 RFC 7235 中增补和修订。

别去研究 [RFC 2616](https://www.w3.org/Protocols/rfc2616/rfc2616.html)，更别去研究 [RFC 2068](https://tools.ietf.org/html/rfc2068)，真正有用的是 [RFC 7231](https://tools.ietf.org/html/rfc7231)。

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

表示服务器端已经收到请求消息，但是尚未处理。这个状态码被设计用来将请求交由另外一个进程或者服务器来进行处理，（也许是每天仅运行一次的面向批处理的进程），而无需用户与服务器的连接一直持续到该进程完成为止。

#### 203 Non-Authoritative Information

表示请求已经成功被响应，但是经过拥有转换功能的代理服务器的转换。

203 状态码有点类似 `Warning` 首部的 214（Transformation Applied）警告码。后者的优势在于可以应用于任何状态码。

#### 204 No Content

表示请求成功，但客户端不需要更新其现有页面。204 响应默认是可以被缓存的。在响应头中需要包含头信息 `ETag`。

使用习惯是，在 `PUT` 请求中进行资源更新，但是不需要改变当前展示给用户的页面，那么返回 204 No Content。如果创建了新的资源，那么返回 201 Created。如果页面需要更新以反映更新后的资源，那么需要返回 200。

#### 205 Reset Content

用来通知客户端重置文档视图，比如清空表单内容、重置 canvas 状态或刷新用户界面。

#### 206 Partial Content

表示请求已经成功，并且主体包含所请请求的数据区间，该数据区间是在请求 `Range` 首部指定的。

如果只包含一个数据区间，那么整个响应的 `Content-Type` 首部值为所请求的文件类型，同时包含 `Content-Range` 首部。

如果包含多个数据区间，那么整个响应的 `Content-Type` 首部的值为 `multiPart/byteranges`，其中一个片段对于一个数据区间，并提供 `Content-Range` 和 `Content-Type` 描述信息

除去上述所说，该返回首部必须包含以下字段 `Date`，`ETag / Content-Location`，`Cache-Control`

### 3xx 重定向

#### 300 Multiple Choices

`300 Multiple Choices` 是一个用来表示重定向的响应状态码，表示该请求拥有多种可能的响应。用户代理或者用户自身应该从中选择一个。由于没有如何进行选择的标准方法，这个状态码极少使用。

#### 301 Moved Permanently

HTTP 301 永久重定向 说明请求的资源已经被移动到了由 `Location` 头部指定的 url 上，是固定的不会在改变。搜索引擎会根据该响应修正。

尽管标准要求浏览器在收到响应并进行重定向时不应该修改 method 和 body，但是有的一些浏览器会有问题。所以最好是在 `GET` 或 `HEAD` 请求的时候用 `301` 其他情况用 `308` 来代替 `301`

#### 302 Found

HTTP 302 Found 重定向状态码表示请求的资源被**暂时**移动到了由 `Location` 头部指定的 `URL` 上。浏览器会重定向到这个 `URL`，但是搜索引擎不会将资源的链接进行更新

尽管标准要求浏览器在收到响应并进行重定向时不应该修改 method 和 body，但是有的一些浏览器会有问题。所以最好是在 `GET` 或 `HEAD` 请求的时候用 `302` 其他情况用 `307` 来代替 `302`

#### 303 See Other

通常作为 `PUT` 或 `POST` 操作的返回结果，重定向页面的方法要总是使用 `GET`

#### 304 Not Modifined

说明无需再次传输请求的内容，也就是说可以使用缓存的内容。这通常是在一些安全的方法，例如 `GET` 或 `HEAD` 在请求头部附带头部信息 `If-None-Match` 或 `If-Modified-Since`

如果是 `200 Ok` 响应会带有头部 `Cache-Control`、`Content-Location`、`Date`、`ETag`、`Expires` 和 `Vary`

#### 307 Temporary Redirect

临时重定向状态码。`307` 与 `302` 很像，他们之间的唯一区别就是，当发送重定向请求时，`307` 状态码可以确保请求方法和消息主体不会发生改变。当响应状态码为 `302` 的时候，一些旧有的用户代理会错误地将请求方法转换为 `GET`：使用非 `GET` 请求方法而返回 `302` 状态码，Web 应用的运行状况是不可预测的；而返回 `307` 状态码时则是可预测的。

#### 308 Permanent Redirect

永久重定向状态码。`308` 与 `301` 很像，区别在于返回 `308` 状态码时，请求方法和消息主体不会发生改变，然而在返回 `301` 状态码时，请求方法会被客户端错误的修改为 `GET` 方法

### 4xx 客户端错误

#### 400 Bad Request

状态码 `400 Bad Request` 响应状态码表示由于语法无效，服务器无法理解该请求。客户端不应该在未经修改的情况下重复此请求。

#### 401 Unauthorized

状态码 `401 Unauthorized` 代表客户端错误，指的是由于缺乏目标资源要求的身份验证凭证，发送的请求未得到满足。

这个状态类似于 `403` 但是在该情况下，依然可以进行身份验证。

#### 403 Forbidden

状态码 403 Forbidden 代表客户端错误，指的是服务器端有能力处理该请求，但是拒绝授权访问。

这个状态类似于 `401` 但进入该状态后不能再继续进行验证。该访问是长期禁止的，并且与应用逻辑密切相关。

#### 404 Not Found

状态码 `4040 Not Found` 代表客户端错误，指的是服务器端无法找到所请求的资源。返回该响应的链接通常称为坏链（broken link）或死链（dead link），他们会导向 404 页面。

404 状态码并不能说明请求的资源是临时丢失还是永久丢失。如果服务器知道资源永久丢失，那么应该返回 `410 Gone` 而不是 404

#### 405 Method Not Allowed

状态码 `405 Method Not Allowed` 表明服务器禁止了使用当前 HTTP 方法请求。需要注意的是 `GET` 和 `HEAD` 两个方法不能被禁止，当然也不得返回状态码 405。

#### 406 Not Acceptable

状态码 `406 Not Acceptable` 表示客户端错误，指代服务器端无法提供与 `Accept-Charset` 以及 `Accept-Language` 消息头指定的值相匹配的响应。

在实际应用中，这个错误状态码极少使用。

#### 408 Request Timeout

响应状态码 `408 Request Timeout` 表示服务器想要将没有在使用的连接关闭。一些服务器会在空闲连接上发送此消息，**即便是在客户端没有发送任何请求的情况下**

服务器应该在此类响应中将 `Connection` 首部的值设置为“close”，因为 `408` 意味服务器已经决定将连接关闭，而不是等待。

#### 409 Confilct

响应状态码 `409 Confilct` 表示请求与服务器端目标资源冲突

冲突最有可能发生在 `PUT` 请求的响应中。例如，当上传文件的版本比服务器上已存在的要旧，从而导致版本冲突的时候，那么就有可能收到状态码为 409 的响应。

#### 410 Gone

状态码 `410 Gone` 说明请求的内容在服务器上已经不存在了，同时是永久丢失。如果不清楚是否为永久丢失或临时丢失，应该使用状态码 `404`

#### 413 Payload Too Large

响应状态码 `413 Payload Too Large` 表示请求主体的大小超过了服务器愿意或有能力处理的限度，服务器可能会关闭连接以防止客户端继续请求

如果超出限度是暂时性的，服务器应返回 `Retry-After` 首部字段，说明是暂时性的，以及客户端可以在什么时间后重试。

#### 414 URI Too Long

响应码 `414 URI Too Long` 表示客户端所请求的 `URI` 超过了服务器允许的范围。

+ 客户端勿将 `POST` 请求当作 `GET` 请求时
+ 当客户端对服务器进行攻击，试图寻找漏洞时

#### 415 Unsupported Media Type

响应码 `415 Unsupported Media Type` 表示服务器由于不持支其有效载荷的格式，从而拒绝接受客户端的请求。

客户端 `Content-Type` 或 `Content-Encoding` 首部格式不正确，也可能是直接对负载数据进行检测fuwuqi发现格式不对。

#### 422 Unprocessable Entity

响应状态码 `422 Unprocessable Entity` 表示服务器理解请求实体内容类型，并且请求实体的语法正确，但是服务器无法处理所包含的指令。

在 Restful API 中表示，请求数据参数校验不通过。

#### 429 Too Many Requests

响应状态码 `429 Too Many Requests` 表示在一定时间内用户发送了太多请求，即超出了“频次限制”。

在响应中，可以提供一个 `Retry-After` 首部来提示用户需要等待多长时间之后再次发送。

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

问题一中的答案，TCP 连接会被浏览器和服务器维持一段时间。这个时间由 header 中的 `Keep-Alive: timeout=5, max=100` 字段控制。意思为：过期时间5秒（对应httpd.conf里的参数是：KeePaliveTimeout），max是最多一百次请求，强制断掉连。

### 浏览器对同一个 HOST 建立 TCP 连接的数量有没有限制

![流浪器连接限制](https://pic2.zhimg.com/80/ea606d016e8ab77db9d8a8dfa5243a1b_hd.jpg)

### 收到的 HTML 如果包含几十个图片标签，这些图片是以什么方式、什么顺序、建立了多少连接、使用什么协议被下载下来的呢

浏览器就会在一个 HOST 上建立多个 TCP 连接，连接数量的最大限制取决于浏览器设置，这些连接会在空闲的时候被浏览器用来发送新的请求，如果所有的连接都正在发送请求呢？那其他的请求就只能等等了。

[你猜一个 TCP 连接上面能发多少个 HTTP 请求](https://zhuanlan.zhihu.com/p/61423830)

## https 握手过程

+ SSL（Secure Sockets Layer，安全套接层）
+ TLS（Transport Layer Security Protocol，传输层安全协议）
+ TLS 则是标准化之后的 SSL

### rsa 密钥协商

#### Client Hello（客户端）

客户端向服务端发送 client hello 消息，这个消息包含一个客户端随机数（client random），客户端支持的加密方法（Cipher Suites）和 SSL 版本号。

#### Server Hello（服务端）

服务端向客户端发送 server hello 消息，这个消息包含一个服务端随机数（server random），服务器选取的加密套件，以及服务器选择的 SSL 版本号。

#### Certificate（服务端）

服务器将CA证书发送给客户端。

#### Server Hello Done（服务端）

通知客户端 Server Hello 过程结束。（Server hello、Certificat、Server Hello Done）

#### Certificate Verify（客户端）

客户端通过浏览器的根证书验证服务端证书的合法性，然后从 CA证书中取出公钥，再生成一个随机数，使用公钥对其进行加密生成 PreMaster Key

#### Client Key Exchange（客户端）

服务端和客户端用三个随机数以及约定好的方法生成对话密钥（session key），用来加密整个对话过程

#### Change Cipher Spec（客户端）

这一步是客户端通知服务端后面再发送的消息都会使用前面协商出来的秘钥加密了，是一条事件消息

#### Change Cipher Spec（服务端）

这一步是服务端通知客户端后面再发送的消息都会使用前面协商出来的秘钥加密了，是一条事件消息

#### Finished（Encrypted Handshake Message）

​Encrypted Handshake Message 这是由客户端服务器之间协商的算法和密钥保护的第一个消息。

![tls handshake](https://i0.hdslb.com/bfs/article/bffa2a2eca17c96a4816d60b53179674a4d44d8a.png@1320w_2306h.webp)

### DHE 密钥协商

1. 客户端向服务器发送 Client Hello，告诉服务器，我支持的协议版本，加密套件等信息。

2. 服务端收到响应，选择双方都支持的协议，套件，向客户端发送Server Hello。同时服务器也将自己的证书发送到客户端(Certificate)。

3. 服务端向客户端发送服务器 DHE 参数：模数 $p$，基数 $g$ 和服务端公钥 $Pb$（$Pb = g^{Xb}\ mod\ p$，其中 $Xb$ 为 DH 算法的服务器私钥）。使用服务器私钥对参数生成的签名，客户端在收到服务端参数后使用 ca证书 中的公钥验证这个签名(Server Key Exchange)。

4. 客户端向服务端发送客户端 DHE 参数 $Pa$，客户端生成一个随机数 $Xa$ 作为自己的私钥，然后根据算法计算出公钥 $Pa$，$Pa = g^{Xa}\ mod\ p$（Client Key Exchange）。

#### 注意点

DH类 密钥交换与 DHE类 密钥交换，字面上少了一个E，E代表了“临时”，即在握手过程中，作为服务器端，DH类 少了计算 $Pb$ 的过程，**$Pb$ 用证书中的公钥代替**，**而证书对应的私钥就是 $Xb$**。

加上 EC 前缀，例如：ECDH。将模幂运算变为点乘运算，原理为椭圆曲线上的离散对数的分解问题。降低运算耗时。

#### DH 算法原理

算法参数：

+ 模数 $p$ (至少300位)
+ 基数 $g$

通过 $g, p$ 和 $g^a\ mod\ p$ 中计算出 $a$ 这个问题就是著名的离散对数问题（DLP），这是非常困难的

b: $Pb = g^{Xb}\ mod\ p$; ($Pb$ b端公钥 $Xb$ b端私钥)

a: $Pa = g^{Xa}\ mod\ p$; ($Pa$ a端公钥 $Xa$ a端私钥)

a: $Sa = Pb^{Xa}\ mod\ p$;

b: $Sb = Pa^{Xb}\ mod\ p$

#### ECDH 算法原理

算法参数：

+ 一个质数 $p$ 用于描述有限域的大小（p 当然越大越安全，但越大，计算速度会变慢，200位左右可以满足一般安全要求）
+ 椭圆曲线方程的参数 $a$ 和 $b$。

    $$\{(x,y) \in (F_p)^2 \ | \ y^2 = x^3 + ax + b \ (mod \ p),\ 4a^3+27b^2 \neq 0 \ (mod \ p)\} \cup \{0\}$$

+ 一个用于生成循环子群的基点 $G(x, y)$ （椭圆线上任意点）
+ 子群的阶数 $n$

从 $\{1,...,n-1\}$ 中随机选择一个整数 $Xb$ 作为私钥（$n$ 为子群的阶数）。ab 交换 $Pa, Pb$ 后计算出共同的迷药 $Sa$。由于已知 $Pb, G$ 反求 $Xb$ 是求解椭圆曲线离散对数问题（ECDLP），这是个非常困难的问题，从而保证了私钥的有效性。

b: $Pb(x,y) = Xb \cdot G(x,y)$

a: $Pa(x,y) = Xa \cdot G(x,y)$

b: $Sb(x,y) = Xb \cdot Pa(x,y) = Xb \cdot Xa \cdot G(x,y)$

a: $Sa(x,y) = Xa \cdot Pb(x,y) = Xa \cdot Xb \cdot G(x,y)$

##### ECDSA 签名原理

### TLS 加密套件

TLS_ECDHE_ECDSA_WITCH_AES_128_GCM_SHA256

使用 ECDHE 交换密钥，交换时使用 ECDSA 进行签名。交换密钥之后得到共同私钥，使用 AES_128_GCM 进行对称加密，使用 SHA256 哈希算法进行数据完整性检查。

### 浏览器证书校验

1. 证书是否过期

    CRL（Certificate Revocation List）即 **证书撤销名单**，保存在浏览器中定期更新

    OCSP （Online Certificate Status Protocol）即 **证书在线状态协议**，用于实时查询证书是否有效

2. 证书是否被篡改

    通过上级证书的公钥，对当前服务器发来的证书进行签名，比对计算签名与服务器证书中签名是否一致。

### HSTS

HSTS（HTTP Strict Transport Security） 是一个安全功能，它告诉浏览器只能通过 HTTPS 访问当前资源，而不是 HTTP

```http
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
Strict-Transport-Security: max-age=<expire-time>; preload
```

注意：`Strict-Transport-Security` 在通过 http 访问时会被忽略，因为攻击者也可以通过中间人的方式在连接中修改、注入或删除他。只有在你的网站通过 HTTPS 访问并且没有证书错误的时候，浏览器才会认为你的站点支持 HTTPS 然后使用 `Strict-Transport-Security`

### TLS 1.3

+ 存在兼容性问题
+ 只需要一个 RTT 即可完成握手。TLS 1.3 的握手不再支持静态的 RSA 密钥交换，这意味着必须使用带有前向安全的 Diffie-Hellman 进行全面握手
+ 相比过去的的版本，引入了新的密钥协商机制 — PSK
+ 废弃了 3DES、RC4、AES-CBC 等加密组件，废弃了 SHA1、MD5 等哈希算法
+ Server Hello 之后的所有握手消息采取了加密操作，可见明文大大减少
+ 不再允许对加密报文进行压缩、不再允许双方发起重协商
+ DSA 证书不再允许在 TLS 1.3 中使用

[图解SSL/TLS协议](https://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)

[SSL/TLS 握手过程详解](https://www.bilibili.com/read/cv1003133/)

[TLS 1.3 VS TLS 1.2，让你明白 TLS 1.3 的强大](https://www.jianshu.com/p/efe44d4a7501)
