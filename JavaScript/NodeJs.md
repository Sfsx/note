# 深入浅出NodeJs

## Node 简介

## 模块机制

模块分为两类，一类为原生核心模块。一类为文件模块。

文件模块又细分为三类

+ .js
+ .nide
+ .json

### 模块查找策略

1. 查找文件模块缓存
2. 查找原生模块缓存
3. 查找原生模块
4. 查找文件模块
   + node_modules 目录
   + NODE_PATH 环境变量

## 异步 I/O

`process.nextTick()`

```js
var http = require('http');
var wait = function (mils) {
    var now = new Date;
    while (new Date - now <= mils);
};
function compute() {
    // performs complicated calculations continuously
    console.log('start computing');
    wait(1000);
    console.log('working for 1s, nexttick');
    process.nextTick(compute);
}
http.createServer(function (req, res) {
    console.log('new request');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
}).listen(5000, '127.0.0.1');
```

其中compute是一个密集计算的函数，我们把它变为可递归的，每一步需要1秒（使用wait来代替密集运行）。执行完一次后，通过process.nextTick把下一次的执行放在队列的尾部，转而去处理已经处于等待中的客户端请求。这样就可以同时兼顾两种任务，让它们都有机会执行。

## 异步编程

## node 调试

