# 图解Http

## 第一章 了解Web及网络基础

### 1.1 使用 HTTP 协议访问 Web

### 1.2 HTTP 诞生

#### 1.2.1 为知识共享而规划 Web

欧洲原子核研究组织的蒂姆·伯纳斯—李博士提出了一种能让两地的研究者们共享知识的设想。

#### 1.2.3 驻足不前的 HTTP

##### HTTP/0.9

1990 ~ 1996 年 HTTP 没有作为正式标准被建立

##### HTTP/1.0

1996 年 5 月 HTTTP 正式作为标准被公布。

##### HTTP/1.1

1997 年 1 月 公布的 HTTP/1.1 是目前主流的 HTTP 协议版本。当初的标准是 RFC 2068。

##### HTTTP/2.0

2015 年 5 月 HTTP/2 标准以 RFC 7540 正式发布。

### 1.3 网络基础 TCP/IP

#### 1.3.2 TCP/IP 的分层管理

不同于计算书网络的分层协议。TCP/IP协议族按层次分别分为以下4层：

+ 应用层
  + HTTP 协议
  + FTP 协议
  + DNS 服务等
+ 传输层
  + TCP
  + UDP
+ 网络层
  + 网络层起的作用就是在众多的选项内选择一条传输路线。
+ 数据链路层

### 1.4 与 HTTP 关系密切的协议：IP、TCP 和 DNS

#### 1.4.1 负责传输的IP协议

按层次分，IP 网际协议位于网络层。

为了保证传输，其中重要的两个条件就是 IP 地址 和 MAC 地址。

IP 地址指明了介蒂安被分配的地址， MAC 地址是指网卡网卡所属的固定地址。IP 地址可以和 MAC 地址进行配对。IP 地址可变换，但 MAC 地址基本上不会更改。

在网络中转过程中，先通过 ARP 协议解析目标 IP 的 MAC 地址，比对下一站中转设备的 MAC 地址来搜索下一个中转目标。

#### 1.4.2 确保可靠性的 TCP 协议

TCP 位于传输层，提供可靠的字节流服务。

##### 三次握手

发送端首先发送过一个带 SYN 标志的数据包给对方。接收端收到后，回传一个带有 SYN/ACK 标志的数据包以示传达确认信息。最后，发送端再回传一个带 ACK 标志的数据包，代表“握手”结束

### 1.5 负责域名解析的 DNS 服务

### 1.6 各种协议与 HTTP 协议的关系

### 1.7 URI 和 URL

URI 用字符串标识某一互联网资源，而 URL 表示资源的地点，可见 URL 是 URI 的子集。

## 第二章 简单 HTTP 协议

### 2.1 HTTP 协议用于客户端和服务器之间的通信

### 2.2 通过请求和响应的交换达成通信

### 2.3 HTTP 是不保存状态的协议

HTTP 协议自身不对请求和响应之间的用性状态进行保存。

HTTP/1.1 虽然是无状态协议，但是为了保存状态功能于是引入了 Cookie

### 2.4 请求 URI 定位资源

下面的 `http://hackr.jp/index.htm` 即为一个 URI

```html
GET http://hackr.jp/index.htm HTTP/1.1
```

仅对服务器发起请求

```html
OPTIONS * HTTP/1.1
```

### 2.5 告知服务器意图的 HTTP 方法

这里不是指RESTful API

#### GET: 获取资源

#### POST: 传输实体主体

#### PUT: 传输文件

#### HEAD: 获得报文首部

```html
HADE /index.html HTTP/1.1
```

#### DELETE: 删除文件

#### OPTION: 询问支持的方法

#### TRACE: 追踪路径

TRACE 方法是让 Web 服务器端将之前的请求通信返回给客户端的方法。

#### CONNNECT: 要求用隧道协议连接代理

### 2.6 使用方法下达命令

### 2.7 持久连接节省通信

#### 2.7.1 持久连接

HTTP keep-alive

在 HTTP/1.1 中所有的连接默认都是持久连接。

#### 2.7.2 管线化

持久连接使得多数连接请求以管线化（pipelining）方式发送成为可能。

### 2.8 使用 cookie 管理状态

## 第三章 HTTP 报文内的 HTTP 信息

### 3.1 HTTP 报文

报文首部  
空行（CR+LF）  
报文主体  

### 3.2 请求报文以及响应报文的结构

请求报文

```html
GET /search?hl=zh-CN&source=hp&q=domety&aq=f&oq= HTTP/1.1  
Accept: image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, application/vnd.ms-excel, application/vnd.ms-powerpoint,
application/msword, application/x-silverlight, application/x-shockwave-flash, */*  
Referer: http://www.google.cn/
Accept-Language: zh-cn  
Accept-Encoding: gzip, deflate  
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727; TheWorld)  
Host: www.google.cn  
Connection: Keep-Alive  
Cookie: PREF=ID=80a06da87be9ae3c:U=f7167333e2c3b714:NW=1:TM=1261551909:LM=1261551917:S=ybYcq2wpfefs4V9g;
NID=31=ojj8d-IygaEtSxLgaJmqSjVhCspkviJrB6omjamNrSm8lZhKy_yMfO2M4QMRKcH1g0iQv9u-2hfBW7bUFwVh7pGaRUb0RnHcJU37y-
FxlRugatx63JLv7CWMD6UB_O_r
```

响应报文

```html
HTTP/1.1 200 OK
Server: bfe/1.0.8.18
Date: Wed, 04 Apr 2018 02:39:19 GMT
Content-Type: text/html
Content-Length: 2381
Last-Modified: Mon, 23 Jan 2017 13:27:56 GMT
Connection: Keep-Alive
ETag: "588604dc-94d"
Cache-Control: private, no-cache, no-store, proxy-revalidate, no-transform
Pragma: no-cache
Set-Cookie: BDORZ=27315; max-age=86400; domain=.baidu.com; path=/
Accept-Ranges: bytes

<!DOCTYPE html>
<!--STATUS OK--><html> <head>...
```

### 3.3 编码提升传输速率

#### 3.3.1 报文主体和实体的差异

+ 报文
  
    是 HTTP 通信的基本单位，由8位组字节流组成，通过HTTP通信传输

+ 实体

    作为请求或响应的有效载荷数据被传输，其内容由实体首部和实体主体组成。

#### 3.3.2 压缩传输的内容编码

+ gzip（GUN zip）
+ compress（UNIX 系统的标志压缩）
+ deflate（zlib）
+ identity（不进行编码）

#### 3.3.3 分割发送的分块传输编码

### 3.4 发送多种数据的多部分对象集合

Content-type 为以下值时可以分块。其中 boundary 属性值表示分割字符串

+ `multipart/form-data; boundary=AaBo3x`
+ `multipart/byteranges; bondary=THIS_STRING_SEPARATES`

RFC2046

### 3.5 获取部分内容的范围请求

首部字段 Range。

### 3.6 内容协商返回最合适的内容

+ Accept
+ Accept-Charset
+ Accept-Encoding
+ Accept-Language

## 第四章 返回结果的HTTP状态码

### 4.1 状态码告知从服务器端返回的请求结果

### 4.2 2XX 成功

#### 200 OK

#### 204 No Content

#### 206 Partial Content

该状态码表示客户端进行了范围请求（报文含有 Range 首部），而服务器成功执行了这部分的 GET 请求。

#### 301 Moved Permanently

永久性重定向

#### 302 Found

临时性重定向

302 和 301 对于用户来说是没有区别的，对于搜索引擎会有些许差异。302 会出现url 劫持

#### 303 See Other

该状态码表示由于请求对应的资源存在另一个 url，使用 get 方法重定向获取资源。（事实上 几乎所有浏览器在遇到 301，302，303 时都会把 POST 请求 改成 GET，并删除请求报文主体，之后请求会自动再次发送）

#### 304 Not Modified

资源未过期，客户端直接使用缓存，304返回步包含任何响应的主体部分。

#### 307 Temporary Redirect

重定向时不会从 POST 转为 GET，但是对于处理响应时的行为，每种浏览器有可能出现不同的情况。

### 4.4 4XX 客户端错误

#### 400 Bad Request

请求报文中存在语法错误

#### 401 Unanthorized

客户为认证，或未登入。

#### 403 Forbidden

服务器拒绝访问，但不需要给出具体理由。

#### 404 Not Found

### 4.5 5XX 服务器错误

#### 500 Internal Server Error

#### 503 Service Unavaliable

服务器超过负载，或正在停机维护

## 第5章 与 HTTP 协作的 Web 服务器

### 5.1 单台虚拟主机实现多个域名

由于 DNS 解析后 IP 是一样的，所以在发送 HTTP 请求时，必须在 Host 首部内完整指定主机名或域名 URI

### 5.2 通信数据转发程序：代理、网关、隧道

#### 代理

代理服务器的基本行为就是接收客户端发送的请求后转发给其他服务器。

+ 缓存代理
+ 透明代理

    转发请求时不对报文做任何处理

+ 非透明代理

    转发请求时会对报文进行处理

#### 网关

网关能使通信线路上的服务器提供非 HTTP 协议服务（特指：网关 -> 服务器，这一段）

#### 隧道

隧道是指建里服务器与客户端之间的通信线路，届时使用 SSL 等加密手段进行通信。

### 5.3 保存资源的缓存

#### 缓存的有效期

#### 客户端缓存

## 第6章 HTTP 首部

### 6.1 HTTP 报文首部

+ HTTP 请求报文
  + 请求行
  + 请求首部字段
  + 通用首部字段
  + 实体首部字段
+ HTTP 响应报文
  + 状态行
  + 响应首部字段
  + 通用首部字段
  + 实体首部字段

### 6.2 HTTP 首部字段

#### HTTP/1.1 首部字段表

RFC2616

#### 非 HTTP/1.1 首部字段

Cookie、Set-Cookie、Conten-Disposition

#### End-to-end 首部和 Hop-by-hop 首部

1. 端到端首部 (End-to-end Header)

    在此分类中的首部会转发给请求/响应对应的最终接受目标。且必须保存正在由缓存生成的响应中，另外规定他必须被转发。

2. 逐跳首部 (Hop-by-hop Header)

    此类中的首部只对单次转发有效，会因为通过缓存或代理而不在转发。HTTP/1.1 和之后的版本中，如果要使用 Hop-by-hop 首部，需提供 Connection 首部字段。

    + Connection
    + Keep-alive
    + Proxy-Authenticate
    + Proxy-Authorization
    + Trailer
    + TE
    + Transfer-Encoding
    + Upgrade

### 通用首部字段

### 请求首部字段

### 响应首部字段

### 实体首部字段

### 为 cookie 服务的首部字段

### 其他首部字段

## 第7章 确保 Web 安全的 HTTPS

## 第8章 确认访问用的身份的认证

+ BASIC 认证

    被动认证，客户端发送资源请求或访问请求，服务器返回 401 状态码，客户端发送账户密码认证

+ DIGEST 认证

    服务器会给一段质询码，客户端根据质询码计算生成响应码，再返回给客户端认证

+ SSL 客户端认证

    证书认证，首先颁发证书给客户端，通过 HTTPS 再进行账户密码认证

+ FormBase 认证

    账户密码认证

## 第9章 基于 HTTP 的功能追加协议

### 9.2 消除 HTTP 瓶颈的 SPDY

#### HTTP 瓶颈

+ 一条连接上只可发送一条请求
+ 请求只能从客户端开始，客户端不能收到除响应以外的指令
+ 请求 / 响应首部未经压缩就发送。首部信息越大延迟越大。
+ 发送冗长的首部，每次相互发送相同的首部造成的浪费就越多。
+ 可任意选择数据压缩格式。非强制压缩。

#### SPDY

1. 多路复用流

    通过单一的 TCP 连接，可以处理多个 HTTP 请求。

2. 赋予请求优先级
3. 压缩 HTTP 首部
4. 推送功能
5. 服务器提示功能

SPDY 协议已被 HTTP/2 协议取代。

### 9.3 webSocket

握手请求

```html
GET / HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Host: example.com
Origin: http://example.com
Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
Sec-WebSocket-Version: 13
```

握手响应

```html
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Location: ws://example.com/
```

在这里之所以提到 socket.io 而未说 websocket 服务，是因为 socket.io 在封装 websocket 基础上又保证了可用性。**在客户端未提供 websocket 功能的基础上使用 xhr polling、jsonp 或 forever iframe 的方式进行兼容**，**同时在建立 ws 连接前往往通过几次 http 轮训确保ws服务可用**，**因此 socket.io 并不等于 websocket**。再往底层深入研究，socket.io 其实并没有做真正的 websocket 兼容，而是提供了上层的接口以及 namespace 服务，真正的逻辑则是在“engine.io”模块。该模块实现握手的 http 代理、连接升级、心跳、传输方式等，因此研究 engine.io 模块才能清楚的了解socket.io 实现机制。

### 9.4 HTTP/2.0

HTTP/2.0 致力于突破上一代标准众所周知的性能限制，但它也是对之前1.x 标准的扩展，**而非替代**。之所以要递增一个大版本到2.0，主要是因为它改变了客户端与服务器之间交换数据的方式，HTTP 2.0 增加了新的二进制分帧数据层

+ SPDY

    Google 主导

+ HTTP Speed + Mobility

    微软起草

+ Network-Friendly HTTP Upgrade

HTTP-WG（HTTP Working Group）在2012 年初把HTTP/2.0提到了议事日程，吸收`SPDY` 、`HTTP Speed + Mobility`、`Network-Friendly HTTP Upgrade`，并在此基础上制定官方标准

1. 多路复用

    多路复用允许同时通过单一的 HTTP/2 连接发起多重的请求-响应消息。

2. 二进制分帧层
3. 首部压缩
4. 服务的推送

二进制分帧

![二进制分帧](https://user-gold-cdn.xitu.io/2019/3/1/16937284bf9b1d57?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

+ HTTP2.0 将所有传输的信息分割为更小的消息和帧，并对它们采用二进制格式的编码。
+ HTTP 2.0 的所有帧都采用二进制编码，所有首部数据都会被压缩。
+ 所有通信都在一个 TCP 连接上完成。
+ HTTP 2.0 把HTTP协议通信的基本单位缩小为一个一个的帧，这些帧对应着逻辑流中的消息。相应地，很多流可以并行地在同一个TCP 连接上交换消息
+ 把HTTP 消息分解为独立的帧，交错发送，然后在另一端重新组装。

这个机制会在整个Web 技术栈中引发一系列连锁反应，从而带来巨大的性能提升。

> 可以并行交错地发送请求，请求之间互不影响；  
可以并行交错地发送响应，响应之间互不干扰；  
只使用一个连接即可并行发送多个请求和响应；  
消除不必要的延迟，从而减少页面加载的时间；  
不必再为绕过 HTTP 1.x 限制而多做很多工作；

### 9.5 Web 服务器管理文件的 WebDAV

新增方法

+ PROPFIND 获取属性
+ PROPPATCH 修改属性
+ MKCOL 创建集合
+ COPY 复制资源及属性
+ MOVE 移动资源
+ LOCK 资源加锁
+ UNLOCK 资源解锁

新增状态码

+ 102 Processing: 可正常处理请求，但目前是处理中状态
+ 207 Multi-Status: 存在多种状态
+ 422 Unprocessible Entity: 格式正确，内容有误
+ 423 Locked: 资源已被加锁
+ 424 Failed Dependency: 处理与某请求关联的请求失败，因此不在维护依赖关系
+ 507 Insufficient Storage: 保存空间不足
