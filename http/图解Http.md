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

HTTP HEAD 方法请求资源的头部信息，并且这些头部与 HTTP GET 方法请求时返回的一致。该请求方法的一个使用场景是在下载一个大文件前先获取其大小再决定是否要下载，以此可以节约带宽资源。

#### DELETE: 删除文件

#### OPTION: 询问支持的方法

#### TRACE: 追踪路径

TRACE 方法是让 Web 服务器端将之前的请求通信返回给客户端的方法。

#### CONNNECT: 要求用隧道协议连接代理

在 HTTP 协议中，CONNECT 方法可以开启一个客户端与所请求资源之间的双向沟通的通道。它可以用来创建隧道（ CONNECT 的作用就是将服务器作为代理，让服务器代替用户去访问其他网页）。

例如，CONNECT 可以用来访问采用了 SSL (HTTPS)  协议的站点。客户端要求代理服务器将 TCP 连接作为通往目的主机隧道。之后该服务器会代替客户端与目的主机建立连接。连接建立好之后，代理服务器会转发客户端与目的主机后续产生消息流。

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

### 4.3 3XX 重定向

#### 为什么需要重定向

重定向使用场景：

+ 域名到期不想续费（或者发现了更适合网站的域名），想换个域名
+ 登录后重定向到指定的页面
+ http 连接更改为 https
+ 自动刷新页面，比如5秒后回到订单详细页面之类
+ 进行升级或者切换某些功能时，需要临时更换地址

这种情况下如果不做重定向，则用户收藏夹或搜索引擎数据库中旧地址只能让访问客户得到一个 404 页面错误信息，访问流量白白丧失；

多域名的网站，也需要通过重定向让访问这些域名的用户自动跳转到主站。

#### 301 Moved Permanently

永久性重定向

#### 302 Found

临时性重定向

302 和 301 对于用户来说是没有区别的，对于搜索引擎会有些许差异。302 会出现 url 劫持

url 劫持：一个不道德的人在他自己的网址 A 做一个 302 重定向到你的网址 B，出于某种原因，Google 搜索结果所显示的仍然是网址 A，但是所有的网页内容确实的网址 B 上的内容。

#### 301 与 302 的区别

301重定向是永久的重定向，**搜索引擎在抓取新的内容的同时也将旧的网址替换为重定向之后的网址**，浏览器会对 301 跳转进行缓存（可以通过添加 `Cache-Control:no-cache` 来控制浏览器不缓存）。

302 重定向是临时的重定向，**搜索引擎会抓取新的内容而保留旧的网址**。因为服务器返回 302 代码，搜索引擎任务新的网址只是暂时的。

#### 301 与 302 在选择上注意的问题

301 适用场景

+ 域名变更
+ 网页后缀变更（例如：.php 改为 .index）
+ http 重定向到 https

302 适用场景

+ 未登录用户重定向到登录页面。
+ 临时页面（临时活动页面，网站升级临时资源页面）

#### 为什么 302 重定向和网址劫持有关联

> 302 重定向和网址劫持（URL hijacking） 从网址A 做一个 302 重定向到网址B 时，主机服务器的隐含意思是网址 A 随时有可能改主意，重新显示本身的内容或转向其他的地方。大部分的搜索引擎在大部分情况下，当收到 302 重定向时，一般只要去抓取目标网址就可以了，也就是说网址B。如果搜索引擎在遇到 302 转向时，百分之百的都抓取目标网址 B 的话，就不用担心网址 URL劫持了。问题就在于，有的时候搜索引擎，尤其是 Google，并不能总是抓取目标网址。比如说，有的时候A网址很短，但是它做了一个302重定向到B网址，而B网址是一个很长的乱七八糟的URL网址，甚至还有可能包含一些问号之类的参数。很自然的，A网址更加用户友好，而B网址既难看，又不用户友好。这时 Google 很有可能会仍然显示网址A。由于搜索引擎排名算法只是程序而不是人，在遇到302 重定向的时候，并不能像人一样的去准确判定哪一个网址更适当，这就造成了网址URL劫持的可能性。也就是说，一个不道德的人在他自己的网址A做一个302重定向到你的网址B，出于某种原因，Google 搜索结果所显示的仍然是网址A，但是所用的网页内容却是你的网址B上的内容，这种情况就叫做网址URL劫持。你辛辛苦苦所写的内容就这样被别人偷走了。302 重定向所造成的网址URL劫持现象，已经存在一段时间了。不过到目前为止，似乎也没有什么更好的解决方法。在正在进行的谷歌大爸爸数据中心转换中，302 重定向问题也是要被解决的目标之一。从一些搜索结果来看，网址劫持现象有所改善，但是并没有完全解决。

我的理解：

从网站A上做一个 302 跳转到网站B。这时候搜索引擎会使用 B 的内容，而使用网站A的地址，那么网站B就在为网站A作贡献，网站A的排名就考前了。302 重定向很容易被搜索引擎误认为是利用多个域名指向同一网站，那么你的网站就会被封掉或者降权，罪名是“利用重复的内容来干扰Google搜索结果的网站排名”。

#### 常见 302 url 劫持攻击方式

1. 配合 DNS 劫持

    访问 `http://www.baidu.com` 时 DNS 服务器本应该返回 a 网站的 ip，而在遭 DNS 劫持后，会返回一个运营商中间服务器的 ip，之后通过 302 重定向让用户访问到他们预设的目标 ip。

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

[RFC2616](https://tools.ietf.org/html/rfc2616)

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

#### 二进制分帧层

在应用层（HTTP/2）和传输层（TCP or UDP）之间增加一个二进制分帧层。

![二进制分帧](https://user-gold-cdn.xitu.io/2019/3/1/16937284bf9b1d57?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在二进制分帧层中，HTTP/2 会将所有传输的信息分割为更小的消息和帧（frame），并对他们采用二进制格式的编码，其中 HTTP/1.x 的首部信息会被封装到 HEADER frame，而相应的 Request Body 则封装到 DATA frame 里面

HTTP/2 的三个概念：

+ **帧**：HTTP/2 通信的最小单位，每个帧都包含帧头，至少也会标识出当前帧所属的数据流。
+ **消息**：与逻辑请求或响应消息对应的完整的一系列帧。
+ **数据流**：已建立的连接内的双向字节流，可以承载一条或多条消息。

这些概念的关系总结如下：

+ 所有通信都在一个 TCP 连接上完成，此连接可以承载任意数量的双向数据流。
+ 每个数据流都有一个唯一的标识符和可选的优先级信息，用于承载双向消息。
+ 每条消息都是一条逻辑 HTTP 消息（例如请求或响应），包含一个或多个帧。
+ 帧是最小的通信单位，承载着特定类型的数据，例如 HTTP 标头、消息负载等等。 来自不同数据流的帧可以交错发送，然后再根据每个帧头的数据流标识符重新组装。

#### 多路复用

多路复用，代替原来的序列和阻塞机制。所有就是请求的都是通过一个 TCP连接并发完成。因此，所有 HTTP/2 连接都是永久的

HTTP 1.x 中，如果想并发多个请求，必须使用多个 TCP 链接，且浏览器为了控制资源，还会对单个域名有 6-8个的TCP链接请求限制

![浏览器连接限制](https://pic3.zhimg.com/80/faedeb3dae59455f6520d6a5dbf436e5_hd.jpg)

HTTP 1.x

![http/1.x](https://pic3.zhimg.com/80/da14f0743605dfd3162b709adbb601b4_hd.jpg)

HTTP/2

![http/2](https://pic3.zhimg.com/80/cf8b9bbee7dc03970829ef722be61492_hd.jpg)

#### 首部压缩

HTTP/2 对消息头采用 HPACK 进行压缩，能够节省消息头占用的网络的流量。

HTTP/1.x 每次请求，都会携带大量冗余头部信息，如 `User-Agent`、`Cookie` 等。浪费了很多带宽资源。为了减少这块的资源消耗，HTTP/2 采用以下策略：

+ HTTP/2 在客户端和服务端使用“**首部表**”来跟踪和存储之前发送的间 - 值对，对于相同的数据、不再通过每次请求和响应发送
+ 首部表在 HTTP/2 的连接存续期内始终存在，由客户端和服务器共同渐进地更新
+ 每个新的首部键 - 值对要么被追加到当前表的末尾、要么替换表中之前的值

![首部表](https://pic3.zhimg.com/80/v2-1573194744d005dd110bbeac3a9b5246_hd.jpg)

#### 服务的推送

服务端可以在发送页面 HTML 时主动推送其它资源，而不用等到浏览器解析到相应位置，发起请求在响应。例如服务端可以主动把 JS 和 CSS 文件推送给客户端，而不需要客户端解析 HTML 时再发送这些请求。

#### 为什么 http2 会更好、为什么会出现 HTTP/3

HTTP/2 的多路复用充分利用了 TCP 慢启动的特性。但同时也是 HTTP/2 的缺点，所有数据都在同一个 TCP 链接中发送，若该链接出现丢包，由于 TCP 是可靠传输会重传丢包数据，导致之后的数据被阻塞，而使用 HTTP/1.1 时，浏览器为每个域名开启 6 个 TCP 链接，其中一个阻塞另外 5 个链接依然可以继续传输数据。有测试数据表明，系统的丢包率达到 2% 时，HTTP/1.1的传输效率反而比HTTP/2表现得更好。

### HTTP/3

#### 0-RTT

+ 0-RTT 实现握手
+ 0-RTT 实现加密链接

#### 多路复用（udp）

QUIC 协议控制完成多路复用，同 HTTP/2 一样将数据拆分成二进制流发送，由于 udp 连接上多个 stream 没有依赖，所以不存在 HTTP/2 中的阻塞问题

#### 加密报文认证

TCP 报文的头部没有任何加密和认证，QUIC 下报文的头部经过认证，报文主体都经过加密

#### 向前纠错机制

这是 QUIC 协议非常独特的特性，每个 QUIC 下的每个数据包除了它本身的内容之外，还包括了部分其他数据的包的数据，因此**少量**的丢包可以通过其他包的冗余数据直接组装而无需重传。

#### 参考资料

+ [一文读懂 HTTP/2 特性](https://zhuanlan.zhihu.com/p/26559480)
+ [HTTP/2.0 相比1.0有哪些重大改进？](https://www.zhihu.com/question/34074946)

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
