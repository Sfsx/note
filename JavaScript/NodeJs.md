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

## 内存泄漏

```js
var theThing = null;
var replaceThing = function () {
    var originalThing = theThing;
    var unused = function () {
    if (originalThing)
        console.log("hi");
    };
    theThing = {
        longStr: new Array(1000000).join('*'),
        someMethod: function () {
            console.log(someMessage);
        }
    };
};
setInterval(replaceThing, 1000);
```

同一个函数内部的闭包作用域只有一个，所有闭包共享。在执行函数的时候，如果遇到闭包，会创建闭包作用域内存空间，将该闭包所用到的局部变量添加进去，然后再遇到闭包，会在之前创建好的作用域空间添加此闭包会用到而前闭包没用到的变量。函数结束，清除没有被闭包作用域引用的变量。

上述代码中 `replaceThing` 函数内部创建了两个闭包（`unused`、`someMethod`），`unused` 这个闭包引用了父作用域的 `originalThing` 变量，如果没有后面的 `theThing` 变量，则在函数 `replaceThing` 执行后清除。而 `theThing` 是全局变量，它引用了闭包作用域（包含了 `unused` 所引用的 `originLeakObject`）不会释放，所以会造成内存泄漏。
