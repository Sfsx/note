# JavaScript 执行机制

## 并发模型与事件循环

### 栈

函数执行时，会创建一个栈帧，栈帧中包含了函数的参数和局部变量（这里的变量不包含引用类型的变量）。当函数返回时帧就被弹出栈（实际上是栈顶指针，移向从栈顶开始计数的第二个栈帧）。将其称之为执行上下文栈，又称调用栈。

### 堆

**对象（引用类型数据）**被分配在一个堆中，即用以表示一大块非结构化的内存区域。

### 队列

一个 JavaScript 运行时包含了一个待处理的消息队列。每一个消息都关联着一个用以处理这个消息的函数。

### 代码执行

+ 变量声明和函数声明，添加至内存堆
+ 当函数执行，创建函数调用栈帧，向栈帧中添加执行上下文，最后压入执行栈。进入执行上下文环境执行函数，若函数内部调用其它函数，则创建第二个栈帧重复上述步骤，压栈。当内部函数返回时，最上层的栈帧就被弹出栈，直到栈为空（所有的代码都是从全局环境开始执行，所以**栈底必然是全局执行上下文**）

### 事件循环

1. 当有任务时
   + 从最先进入的任务开始执行
2. 休眠到有新的任务进入，然后到第 1 步

事件循环中对于**任务队列**这块还可以展开细说分为**宏任务队列（macrotask queue）**和**微任务队列（microtask queue）**。对于不同的运行环境，有不一样的处理方式，这里运行环境可以分为浏览器环境 nodeJs 环境。下面我们继续深入讲解不同环境下事件队列的细分

### 浏览器中的 event loop

![avatar](http://lynnelv.github.io/img/article/event-loop/ma(i)crotask.png)

#### macrotask queue and microtask queue

`macro-tasks: script(整体代码),setTimeout, setInterval, setImmediate, I/O, UI rendering, requestAnimationFrame`

`micro-tasks:Promises, MutationObserver`

#### `MutationObserver` 介绍

```js
let counter = 1
const observer = new MutationObserver(callbacks)
const textNode = document.createTextNode(String(counter))
observer.observe(textNode, {
  characterData: true
})

// 执行下面的代码就能够触发回调函数
counter = (counter + 1) % 2
textNode.data = String(counter)
```

[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)

#### queueMicrotask

如果我们想异步执行一个函数（在当前代码之后），但是在呈现更改或处理新事件之前，我们可以使用 queueMicrotask 对其进行调度

```html
<div id="progress"></div>

<script>
  let i = 0;

  function count() {

    // do a piece of the heavy job (*)
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e6) {
      queueMicrotask(count);
    }

  }

  count();
</script>
```

#### 浏览器执行过程

1. 从 macrotask queue 中出列第一个任务，并执行
2. 执行所有 microtask
   + 当 microtask queue 不为空
     + 出列第一个任务，并执行。
3. 如果有需要渲染的更改，则渲染。
4. 如果 macrotask queue 为空，则等待 macrotask 出现
5. 回到步骤1

[Event loop: microtasks and macrotasks](https://javascript.info/event-loop)

### nodejs 中的 event loop

`macro-tasks: script(整体代码),setTimeout, setInterval, setImmediate, I/O`

`micro-tasks:Promises`

这里有一点要强调一下就是 `process.nextTick()` 这个**不属于事件循环**。可以理解为底层 c++ 中在微任务开始前的一个操作。可以参考[官方文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick)

![avatar](http://lynnelv.github.io/img/article/event-loop/ma(i)crotask-in-node.png)

nodejs 的 event loop分为6个阶段，`MicroTask Queue` 在6个阶段结束的时候都会执行。

#### event loop 的6个阶段

+ `timers`：执行 `setTimeout()` 和 `setInterval()` 中到期的 `callback`
+ `I/O callback`：上一轮循环中有少数的 `I/O callback` 会被延迟到这一轮的这一阶段执行。
+ `idle, prepare`： 仅内部使用
+ `poll`：最为重要的几段， 执行除了以下之外的所有 `callback`
  + close 事件的 `callbacks`
  + `timers` （定时器，`setTimeout`、`setInterval` 等）设定的 `callbacks`
  + `setImmediate()` 设定的 `callbacks`
+ `check`：执行 `setImmediate` 的 `callback`
+ `close callback`：执行 close 事件的 `callback`，例如 `socket.on("close", func)`

**event loop 的每一次循环都需要一次经过上述的阶段**。每个阶段都有自己的 `callback` 队列，每当进入某个阶段，都会从所属的队列中取出 `callback` 来执行，当队列为空或者被执行 `callback` 的数量达到系统的最大数量时，进入下一个阶段。**六个阶段执行完成称为一轮事件循环**。

#### nodejs执行过程

外部输入数据 --> 轮询阶段(`poll`) --> 检查阶段(`check`) --> 关闭事件回调阶段(`close callback`) --> 定时器检测阶段(`timer`) --> I/O 事件回调阶段(`I/O callback`) --> 闲置阶段(`idle, prepare`) --> 轮询阶段...

#### `poll` 阶段

在 node.js 里，任何异步方法（除 `timer,close,setImmediate` 之外）完成时，都会将其 `callback` 加到 `poll queue` 里,并立即执行。

poll 阶段有两个主要的功能：

+ 处理 poll 队列（poll quenue）的事件（callback）；
+ 执行 timers 的 callback，当到达 timers 指定的时间时；

1. 如果 event loop 进入了 poll 阶段，且代码未设定 timer，将会发生下面情况：

   + 如果 poll queue 不为空，event loop 将同步的执行 queue 里的`callback` ,直至 queue 为空，或执行的 `callback` 数量到达系统上限；
   + 如果 poll queue 为空，将会发生下面情况：

     + 如果代码已经被 `setImmediate()` 设定了 callback, event loop 将结束 poll 阶段进入 check 阶段，并执行 check 阶段的 queue （check 阶段的 queue 是 `setImmediate` 设定的）；
     + 如果代码没有设定 `setImmediate(callback)`，event loop 将阻塞在该阶段等待 `callbacks` 加入 poll queue；

2. 如果 event loop 进入了 poll 阶段，且代码设定了 timer：

   + 如果 poll queue 进入空状态时（即poll 阶段为空闲状态），event loop 将检查 timers，如果有1个或多个 timers 时间时间已经到达，event loop 将按循环顺序进入 timers 阶段，并执行 timer queue。

#### 参考资料

[宏队列 和 微队列](https://www.jianshu.com/p/3ed992529cfc)

[event loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

[JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)

[nodejs中的event loop](https://www.jianshu.com/p/deedcbf68880)

[Event Loop 必知必会（六道题）](https://zhuanlan.zhihu.com/p/34182184)

[不要混淆nodejs和浏览器中的event loop](https://cnodejs.org/topic/5a9108d78d6e16e56bb80882#5a98d9a2ce1c90bc44c445af)

[理解nodejs的事件循环](http://coolcao.com/2016/12/22/node-js-event-loop/)

[* 深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs)

## async/await 经典题目

**实际上 `await` 是一个让出线程的标志。** `await` 后面的函数会先执行一遍，然后就会跳出整个 `async` 函数来执行后面js栈的代码

node 遇到 await 先执行后面的函数，将 resolve 压进回调队列再让出线程  
chrome 遇到 await 先执行后面的函数，先让出线程，再将 resolve 压进回调队列

上面这段说法有误，当年年轻不懂事，不打算删了，**引以为戒**

```js
/**
 * 异步试题
 * 重点在于 promise2 和 async1 end 谁先输出
 * 异步任务是丢入任务队列的，队列先进先出。执行栈从任务队列加载任务并
 * 执行，由于执行栈一次只抓取一个异步回调函数，所以没有改变任务队列中
 * 的任务顺序，还是先进先出。
 */
(async function() {
    async function async1() {
        console.log('async1 start');
        await async2();
        console.log('async1 end');
    }
    async function async2() {
        console.log('async2');
    }

    async1();

    new Promise(function(resolve) {
        console.log("promise1");
        resolve();
    }).then(function() {
        console.log("promise2");
    });
})();
```

遇到 `await` 先执行后面的函数，先中断 `async` 运行外部代码，再执行 `await Promiese.resolve(undefined)`。这段代码类似于 `Promise.resolve(undefined).then((undefined) => { })`。故将 `then` 的第一个回调参数 `(undefined) => {}` 推入微任务队列。

第一次宏任务到此执行完毕。开始执行微任务。

补充 **node v10.0.0 与浏览器运行结果一致。**

[详细答案](https://zhuanlan.zhihu.com/p/52000508)

### async 做一件什么事情

带 `async` 关键字的函数，它使得你的函数的返回值必定是 `promise` 对象

如果 `async` 关键字函数返回的不是 `promise` ，会自动用 `Promise.resolve()` 包装

如果 `async` 关键字函数显式地返回 `promise` ，那就以你返回的 `promise` 为准

## 作用域链以及词法作用域

词法作用域就是指作用域是由代码中**函数声明的位置**来决定的，所以词法作用域是静态的作用域，通过它就能够预测代码在执过程中如何查找标识符。

词法作用域是代码阶段就决定好的，**和函数是怎么调用的没有关系**。

javascript 的函数作用域链就是词法作用域链

```js
function bar() {
  console.log(a);
}

function foo() {
  var a = 'fs';
  bar();
}

var a = 'fsx';
foo();
// 输出 fsx
```

bar 执行上下文 outer -> 全局作用域

foo 执行上下文 outer -> 全局作用域
