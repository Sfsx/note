+ 前端使用固定 salt 加密后送给后端
+ 后端生成强大的 salt 将前端送来的值加密储存
+ 使用安全的 hash 函数
+ 如果可能，使用 HTTPS
+ npm delegates 用于管理伪属性类型
+ 有时需要允许访问返回动态计算值的属性，或者你可能需要反映内部变量的状态，而不需要使用显式方法调用。在JavaScript中，可以使用 getter 来实现。虽然可以使用 getter 和 setter 来创建一个伪属性类型，但是不可能同时将一个 getter 绑定到一个属性并且该属性实际上具有一个值。

+ What is the difference between using `<Link to="/page">` and `<a href="page">`On the surface, you seem to be comparing apples and oranges here. The path in your anchor tag is a relative path while that one in the Link is absolute (rightly so, I don't think react-router supports relative paths yet). The problem this creates is say you are on `/blah`, while clicking on your Link will go to `/page`, clicking on the `<a href='page' />` will take you to `/blah/page`. This may not be an issue though since you confirmed the correctness of the url, but thought to note.A bit deeper difference, which is just an addon to @Dennis answer (and the docs he pointed to), is when you are already in a route that matches what the Link points to. Say we are currently on `/page` and the Link points to `/page` or even `/page/:id`, this won't trigger a full page refresh while an `<a />` tag naturally will. See issue on Github.

+ flutter框架
+ polyfills
+ PWA
+ webpacke
+ redis
  + key - value 数据库 value 可以是: `string hash list set sortedSet`
  + `user:fsx:email` 相当于key的前缀，方便进行业务切割
  + redis服务是一个cs模式的tcp server，使用和http类似的请求响应协议
  + 优化
    + 精简键名和键值
    + 当业务场景不需要数据持久化时，关闭所有的持久化方式可以获得最佳的性能
    + 限制 `redis` 的内存大小如果不限制内存，当物理内存使用完之后，会使用 `swap` 分区，这样性能较低，如果限制了内存，当到达指定内存之后就不能添加数据了，否则会报 `OOM` 错误。
    + Redis是个单线程模型，客户端过来的命令是按照顺序执行的，所以想要一次添加多条数据的时候可以使用管道(可以理解为批处理)，或者使用一次可以添加多条数据的命令
    + reids模糊查询性能不如mysql
+ `WebSocket`
  + TCP 是第四层传输层协议
  + WebSocket Http 是第七层应用层协议
  + 对于 `WebSocket` 来说，它必须依赖 `HTTP` 协议进行一次握手 ，握手成功后，数据就直接从 `TCP` 通道传输，与 `HTTP` 无关了