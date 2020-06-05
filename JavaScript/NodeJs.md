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
        if (originalThing) console.log("hi");
    };
    theThing = {
        longStr: new Array(1000000).join('*'),
        someMethod: function () {
            console.log("someMessage");
        }
    };
};
setInterval(replaceThing, 1000);
```

同一个函数内部的闭包作用域只有一个，所有闭包共享。在执行函数的时候，如果遇到闭包，会创建闭包作用域内存空间，将该闭包所用到的局部变量添加进去，然后再遇到闭包，会在之前创建好的作用域空间添加此闭包会用到而前闭包没用到的变量。函数结束，清除没有被闭包作用域引用的变量。

### 为什么会泄漏

上述代码中 `replaceThing` 函数内部创建了两个闭包（`unused`、`someMethod`），`unused` 这个闭包引用了父作用域的 `originalThing` 变量，如果没有后面的 `theThing` 变量，则在函数 `replaceThing` 执行后清除。而 `theThing` 是全局变量，它引用了闭包作用域（包含了 `unused` 所引用的 `originLeakObject`）不会释放，所以会造成内存泄漏。

### 为什么内存会越来越大

theThing -> someMethod -> originalThing -> 上一次的 theThing -> ...

以此循环导致 replaceThing 函数每次执行都会导致更多的内存泄漏

## 加密

[使用node.js的crypto库生成公私钥](https://www.leeguangxing.cn/blog_post_41.html)

## node 多线程与多进程

进程是资源分配的最小单位，线程是 CPU 调度的最小单位

线程：多线程可以并行处理任务，但是线程是不能单独存在的，它是由进程来启动和管理的。

进程：一个进程就是一个程序的运行实例

1. 进程中任意一线程出错，都会导致整个进程的崩溃
2. 线程之间共享进程中的数据
3. 当一个进程关闭之后，操作系统会回收进程所占用的内存
4. 进程之间的内存相互隔离，进程间通讯需要使用进程通讯机制（IPC）

### 多进程与多线程比较

| 属性      | 多进程                                           | 多线程                                   | 比较       |
| --------- | ------------------------------------------------ | ---------------------------------------- | ---------- |
| 数据      | 数据共享复杂，需要使用 IPC数据是分开的，同步简单 | 因为共享进程数据，数据共享简单，同步复杂 | 各有千秋   |
| CPU、内存 | 占用内存多，切换复杂，CPU 利用率低               | 占用内存少切换简单，CPU利用率高          | 多线程更好 |
| 可靠性    | 进程独立运行，不会互相影响                       | 线程同呼吸共命运                         | 多进程更好 |
| 分布式    | 可用于多机多核分布式，易于扩展                   | 只能用于多核分布式                       | 多进程更好 |

### 多进程

node 中子进程之间相互通信只有通过 ipc 的方式，属于半双工通信。

node 并没有提供共享内存，我们可以通过数据库（比如 redis）来解决这个问题

cluster 意为集群，集成了两个方面，第一个方面就是集成了`child_process.fork()` 方法创建 node 子进程的方式，第二个方面就是集成了根据多核 CPU 创建子进程后，自动控制负载均衡的方式（ round-robin 时间片轮转法）。

### 多线程

多线程间的通讯是基于发布订阅模式的消息通道实现的。

+ 生成一个 worker，执行它的代码，然后将结果发送给父线程。使用这种方法，每次出现新任务时，我们都必须重新创建一个 worker。
+ 生成一堆 worker 监听 ondata 事件，收到消息后直接执行相应处理，完成后返回对应的结果。

[Node.js的线程和进程详解](https://github.com/xiongwilee/blog/issues/9)

[真-Node多线程](https://juejin.im/post/5c63b5676fb9a049ac79a798)
