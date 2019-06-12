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

#### 4.2.1 200 OK

#### 4.2.2 204 No Content

#### 4.2.3 206 Partial Content

该状态码表示客户端进行了范围请求（报文含有 Range 首部），而服务器成功执行了这部分的 GET 请求。

#### 4.3.1 301 Moved Permanently

永久性重定向

#### 4.3.2 302 Found

临时性重定向

302 和 301 对于用户来说是没有区别的，对于搜索引擎会有些许差异。302 会出现url 劫持

#### 4.3.3 303 See Other

该状态码表示由于请求对应的资源存在另一个 url，使用 get 方法重定向获取资源。（事实上 几乎所有浏览器在遇到 301，302，303 时都会把 POST 请求 改成 GET，并删除请求报文主体，之后请求会自动再次发送）

#### 4.3.4 304 Not Modified

资源未过期，客户端直接使用缓存，304返回步包含任何响应的主体部分。

#### 4.3.5 307 Temporary Redirect

重定向时不会从 POST 转为 GET，但是对于处理响应时的行为，每种浏览器有可能出现不同的情况。
