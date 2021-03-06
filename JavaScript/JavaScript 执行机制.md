# JavaScript 执行机制

## 进程、线程和协程

### 线程

线程（thread）是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位

+ 任务1 是计算A=1+2；
+ 任务2 是计算B=20/5；
+ 任务3 是计算C=7*8；
+ 任务4 是显示最后计算的结果。

正常情况下程序可以使用单线程来处理，也就是分四步按照顺序分别执行这四个任务。

如果采用多线程，会怎么样呢？我们只需分“两步走”：第一步，使用三个线程同时执行前三个任务，第二步，在执行第四个任务

多线程可以并行处理任务，但是线程是不能单独存在的，它是由进程来启动和管理的。那什么又是进程呢？

### 进程

进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。在早期面向进程设计的计算机结构中，进程是程序的基本执行实体；在当代面向线程设计的计算机结构中，进程是线程的容器。

线程是依附于进程的，而进程中使用多线程并行处理能提升运算效率

进程与线程之间的关系

1. 进程中的任意一线程执行出错，都会导致整个进程的崩溃。
2. 线程直接共享进程中的数据。
3. 当一个进程关闭后，操作系统会回收进程所占用的内存。
4. 进程之间的内容相互隔离

### 协程

协程（Coroutine），又称微线程，纤程。协程的调度完全由用户控制。协程拥有自己的调用栈。协程调度切换时，将调用栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器调用栈，直接操作栈则基本没有内核切换的开销，可以不加锁的访问全局变量，所以调用栈的切换非常快。

其实在 JavaScript 中，生成器（Generator）就是协程的一种实现方式

```js
function* gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true }
```

上面代码中，调用 Generator 函数，会放会一个内部指针（即遍历器）g。这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回制作对象。调用指针 g 的 next 方法，会移动内部指针，指向第一个遇到的 yield 语句。

1. `var g = gen(1);` 创建了 `g` 协程
2. 然后在父协程中通过执行 `g.next` 把主线程的控制权交给 `g` 协程。上例是执行到 `x + 2` 为止，y 的赋值操作还未开始。此时返回值为 x + 2（即3）。
3. 当函数遇到 `yield` 时交出主线程控制权，回到父协程
4. 父协程恢复后执行 `g.next(2)` 把主线程的控制权交给 `g` 协程。并传递参数 2，这个参数会将上一次中断的 yield 表达式的值设为 2，因此 y 等于 2
5. 子协程执行遇到 `return` 结束生成器函数，返回 `return` 的值，并把 `done` 标志为 `true`。主线程控制权重新回到父协程
6. 父协程执行完所有代码，程序结束。

```js

function* gen(){
  var result = yield new Promise((resolve) => {
    resolve('prmoise')
  });
  console.log(result);
}

var g = gen();
var result = g.next(); // 线程执行权交给子协程

result.value.then(function(data) {
  g.next(data); // 线程执行权交给子协程
})
```

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

例子：

```js
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };
/*
1. a.x ，先在 { n: 1 } 中创建一个 x 的属性，属性值为 undefined，原来对中的对象就变成了 { n: 1, x: undefined }, 等式挂起
2. 进行 a = { n: 2 } 的赋值操作，{ n: 2 } 这是一个新的对象了，所以 a 的指针指向了这个新对象，此时该 a 与 a.x 中的 a 已经指向不同的对象。
3. a.x = a 也是赋值操作，把 { n: 1, x: undefined } 的 x 进行赋值操作
*/
```

### 事件循环

1. 当有任务时
   + 从最先进入的任务开始执行
2. 休眠到有新的任务进入，然后到第 1 步

事件循环中对于**任务队列**这块还可以展开细说分为**宏任务队列（macrotask queue）**和**微任务队列（microtask queue）**。对于不同的运行环境，有不一样的处理方式，这里运行环境可以分为浏览器环境 nodeJs 环境。下面我们继续深入讲解不同环境下事件队列的细分

### 浏览器中的 event loop

![avatar](http://lynnelv.github.io/img/article/event-loop/ma(i)crotask.png)

#### macrotask queue and microtask queue

`macro-tasks: script(整体代码), setTimeout, setInterval, 网络请求(I/O), UI rendering, dom事件回调`

`micro-tasks: Promises, MutationObserver`

**注意**：

1. 当 script 脚本内部触发 dom 事件时，这个条件下的 dom 回调是**同步执行**。
2. MutationObserver 对同一个事件回调，在微任务队列中只能存在一个。在微任务队列未清空的条件下，只能存在一个 MutationObserver 微任务回调，该微任务回调为最早添加至微任务队列的那一个

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

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

#### setTimeout

使用注意事项

1. 如果当前任务执行时间过久，会影响定时器到期回调函数的执行
2. 如果 setTimeout存在嵌套调用，那么浏览器会设置最短间隔为 4 ms
3. 未激活的页面，setTimeout 执行的最小间隔是 1000ms
4. 延迟执行时间有最大值 2147483647ms
5. 使用 setTimeout 设置的回调函数中的 this 默认指向全局环境

#### requestAnimationFrame 比 setTimeout 更适合动画

+ 浏览器在下次重绘之前调用指定的回调函数更新动画
+ 每一个都会接受到一个相同的时间戳

#### 浏览器执行过程

1. 从 macrotask queue 中出列第一个任务，并执行
2. 执行所有 microtask
   + 当 microtask queue 不为空
     + 出列第一个任务，并执行。
3. 如果有需要渲染的更改，则渲染。
4. 如果 macrotask queue 为空，则等待 macrotask 出现
5. 回到步骤1

+ 在执行微任务过程中产生的新的微任务并不会推迟到下个事件循环再执行，而是在当前事件循环继续执行
+ 如果微任务执行时产生过多的微任务，则会导致事件循环卡在清口微任这一步，导致宏任务无法得到及时的执行

[Event loop: microtasks and macrotasks](https://javascript.info/event-loop)

### nodejs 中的 event loop

`macro-tasks: script(整体代码),setTimeout, setInterval, setImmediate, I/O`

`micro-tasks:Promises`

这里有一点要强调一下就是 `process.nextTick()` 这个**不属于事件循环**。可以理解为底层 c++ 中在微任务开始前的一个操作。可以参考[官方文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick)

![avatar](http://lynnelv.github.io/img/article/event-loop/ma(i)crotask-in-node.png)

nodejs 的 event loop分为6个阶段，`MicroTask Queue` 在6个阶段结束的时候都会执行。

#### event loop 的6个阶段

+ `timers`：执行 `setTimeout()` 和 `setInterval()` 中到期的 `callback`
+ `pending callback`：上一轮循环中有少数的 `pending callback` 会被延迟到这一轮的这一阶段执行。
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

#### nodejs 事件循环趋势

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function() {
    console.log('promise1');
  });
}, 0);
setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(function() {
    console.log('promise2');
  });
}, 0);
```

node 10 结果

```html
timer1
timer2
promise1
promise2
```

node 11 结果

```html
timer1
promise1
timer2
promise2
```

为什么会有不同，是为了和浏览器更加趋同，通过版本跌代靠近浏览器事件循环。在生产环境建议还是不要特意的去利用 node 和浏览器不同的一些特性。即使是 node 和浏览器相同的特性，但规范没确定的一些特性，也建议小心使用。否则一次小小的 node 升级可能就会造成一次线上事故，而不只是啪啪打脸这么简单了。

#### 参考资料

[宏队列 和 微队列](https://www.jianshu.com/p/3ed992529cfc)

[event loop](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

[JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)

[nodejs中的event loop](https://www.jianshu.com/p/deedcbf68880)

[Event Loop 必知必会（六道题）](https://zhuanlan.zhihu.com/p/34182184)

[不要混淆nodejs和浏览器中的event loop](https://cnodejs.org/topic/5a9108d78d6e16e56bb80882#5a98d9a2ce1c90bc44c445af)

[理解nodejs的事件循环](http://coolcao.com/2016/12/22/node-js-event-loop/)

**[深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs)**

**[一次弄懂Event Loop（彻底解决此类面试问题）](https://juejin.im/post/5c3d8956e51d4511dc72c200)**

## async/await 经典题目

~~**实际上 `await` 是一个让出线程的标志。** `await` 后面的函数会先执行一遍，然后就会跳出整个 `async` 函数来执行后面 js 栈的代码~~

~~node 遇到 await 先执行后面的函数，将 resolve 压进回调队列再让出线程~~

~~chrome 遇到 await 先执行后面的函数，先让出线程，再将 resolve 压进回调队列~~

上面这段说法有误，当年年轻不懂事，不打算删了，**引以为戒**

### 起因

异步编程

1. 回调函数
   >嵌套地狱
2. `promise`
   >代码冗余，代码里包含一堆的 `then`，语义不够清晰
3. `Generator`
   >需要人为处理执行权交替，需要执行器，例如 `co`
4. `async/await`
   >更好的语义，`async` 和 `await`，比起星号和 `yield`，语义更清楚了。`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果。
   >更广的适用性 `yield` 后面必须是 `Promise` 对象 `await` 关键字后面，可以是 `Promise` 对象、thenable 对象（具有 `then` 方法的对象）和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）。

### async

带 `async` 关键字的函数，它使得你的函数的返回值必定是 `promise` 对象

如果 `async` 关键字函数返回的不是 `promise` ，会自动用 `Promise.resolve()` 包装

如果 `async` 关键字函数显式地返回 `promise` ，那就以你返回的 `promise` 为准

### await

`await` 关键字后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）。`await` 关键字就是内部 `then` 命令的语法糖。我的理解是协程交换执行权的那部分代码的语法糖

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

补充 **node v10.0.0 与浏览器运行结果一致。**

[详细答案](https://zhuanlan.zhihu.com/p/52000508)

### 关于73以下版本和73版本的区别

+ 在老版本版本以下，先执行 promise2，再执行 async1 end
+ 在73版本，先执行 async1 end 再执行 promise2

## 结合 dom 事件变态加强版

### 例子一

html：

```html
<div class="outer">
  <div class="inner"></div>
</div>
```

script：

```js
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the
// outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
```

点击 inner 方块来触发点击事件

### 上述例子稍加改造

上述例子 script 中添加下面的代码

```js
inner.click();
```

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

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

## 自执行函数

在非匿名自执行函数中，函数变量为只读状态无法修改

```js
var b = 10;
(function b() {
  b = 20;
  console.log(b) // ƒ b() { b = 20; console.log(b) }
})()

c();
function c() {
  c = 20;
  console.log(c) // 20
}
```
