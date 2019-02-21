# QucikNote

## 异步循环

```javascript
// 并发异步循环
let tasks = data.map(item => {
  // 一些步骤....
  return promise;
})
await Promise.all(tasks);

// 继发异步循环
for (let item of data) {
  await promise;
}
```

## 内存

    JavaScript

## koa源码

```js
function createServer(res, req) {
    // ....
}

createServer(callback())

function callback(){

    const handleRequest = function (res, req) {
        // ....
    };

    return handleRequest;
}
```

## npm bluebird

一个 `promise` 的第三方库 其中一个api:  `Promise.promisify` 将 `node` 的函数转换为 `promise` 封装

```js

Promise.promisify(
    function(any arguments..., function callback) nodeFunction,
    [Object {
        multiArgs: boolean=false,
        context: any=this
    } options]
) -> function


var readFile = Promise.promisify(require("fs").readFile);

readFile("myfile.js", "utf8").then(function(contents) {
    return eval(contents);
}).then(function(result) {
    console.log("The result of evaluating myfile.js", result);
}).catch(SyntaxError, function(e) {
    console.log("File had syntax error", e);
//Catch any other error
}).catch(function(e) {
    console.log("Error reading file", e);
});
```

## 为什么要用Array.prototype.forEach.call(array, cb)而不直接使用array.forEach(cb)

有一些看起来很像数组的对象：

+ `argument`
+ `children` and `childNodes` collections
+ NodeList collections returned by methods like `document.getElementsByClassName` and `document.querySelectorAll`
+ jQuery collections
+ and even strings.

[StackOverflow 链接](https://stackoverflow.com/questions/26546352/why-would-one-use-array-prototype-foreach-callarray-cb-over-array-foreachcb)

## Object.prototype.hasOwnProperty.call()

JavaScript 并没有保护 `hasOwnProperty` 属性名，因此某个对象是有可能存在使用这个属性名的属性。

```js
var foo = {
    hasOwnProperty: function() {
        return false;
    },
    bar: 'Here be dragons'
};

foo.hasOwnProperty('bar'); // 始终返回 false

// 如果担心这种情况，可以直接使用原型链上真正的 hasOwnProperty 方法
({}).hasOwnProperty.call(foo, 'bar'); // true

// 也可以使用 Object 原型上的 hasOwnProperty 属性
Object.prototype.hasOwnProperty.call(foo, 'bar'); // true
```

## ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。（未验证）

## JavaScript 执行机制

**实际上 `await` 是一个让出线程的标志。** `await` 后面的函数会先执行一遍，然后就会跳出整个 `async` 函数来执行后面js栈的代码

node 遇到 await 先执行后面的函数，将 resolve 压进回调队列再让出线程  
chrome 遇到 await 先执行后面的函数，先让出线程，再将 resolve 压进回调队列

### 上面这段说法有误，当年年轻不懂事，不打算删了，引以为戒。

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

### async 做一件什么事情？

带 `async` 关键字的函数，它使得你的函数的返回值必定是 `promise` 对象

如果 `async` 关键字函数返回的不是 `promise` ，会自动用 `Promise.resolve()` 包装

如果 `async` 关键字函数显式地返回 `promise` ，那就以你返回的 `promise` 为准

### 浏览器中的 event loop

![avatar](http://lynnelv.github.io/img/article/event-loop/ma(i)crotask.png)

#### macrotask queue and microtask queue

`macro-tasks: script(整体代码),setTimeout, setInterval, setImmediate, I/O, UI rendering`

`micro-tasks: process.nextTick, Promises, Object.observe, MutationObserver`

#### 执行过程

1. JavaScript引擎首先从macrotask queue中取出第一个任务，执行完毕。
2. 将microtask queue中的所有任务取出，按顺序全部执行。
3. 然后再从macrotask queue中取下一个，执行完毕。
4. 再次将microtask queue中的全部取出，按顺序全部执行。
5. 循环往复，直到两个queue中的任务都取完。

### nodejs 中的 event loop

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

event loop 的每一次循环都需要一次经过上述的阶段。每个阶段都有自己的 `callback` 队列，每当进入某个阶段，都会从所属的队列中取出 `callback` 来执行，当队列为空或者被执行 `callback` 的数量达到系统的最大数量时，进入下一个阶段。六个阶段执行完成称为一轮事件循环。

#### 执行过程

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
## HTML5 调用摄像头 （未完成demo）

`MediaDevices.getUserMedia()`

## import

```js
import defaultMember from "module-name";
import * as name from "module-name";
import { member } from "module-name";
import { member as alias } from "module-name";
import { member1 , member2 } from "module-name";
import { member1 , member2 as alias2 , [...] } from "module-name";
import defaultMember, { member [ , [...] ] } from "module-name";
import defaultMember, * as name from "module-name";
import "module-name";
```

## XHTML HTML XML 联系以及区别

### Chinese

#### html 和 xhtml 和 xml 的区别

1. html 即是超文本标记语言（Hyper Text Markup Language），是最早写网页的语言，但是由于时间早，规范不是很好，大小写混写且编码不规范；
2. xhtml 即是升级版的html（Extensible Hyper Text Markup Language），对html进行了规范，编码更加严谨纯洁，也是一种过渡语言，html 向 xml 过渡的语言；
3. xml 即时可扩展标记语言（Extensible Markup Language），是一种跨平台语言，编码更自由，可以自由创建标签。
4. 网页编码从 html >> xhtml >> xml 这个过程发展。

#### html 与 xhtml 之间的区别

1. xhtml 对比与 html，xhtml 文档具有良好完整的排版
   + 元素必须要有结束标签
   + 元素必须嵌套
2. 对于 html 的元素和属性，xhtml必须小写，因为xml是严格区分大小写的，`<li>`和`<LI>`是不同的标签
3. xhtml 的属性值必须在引号之中
4. xhtml 不支持属性最小化，什么是属性最小化了？
    + 正确:非最小化属性(unminimized attributes)  
    `<input checked="checked">`
    + 不正确:最小化属性(minimized attributes)  
    `<input checked>`
5. 在 xhtml 中，name 属性是不赞成使用的，在以后的版本中将被删除。

#### 再说说为什么网页编码要从html>>xhtml>>xml这么发展？

话说早起的网页使用html语言编写的，但是它拥有三个严重的缺点：

1. 编码不规范，结构混乱臃肿，需要智能的终端才能很好的显示
2. 表现和结构混乱，不利于开发和维护
3. 不能使用更多的网络设备，比如手机、PDA等因此HTML需要发展才能解决这个问题，于是W3C又制定了XHTML，XHTML是HTML向XML 过度的一个桥梁。而xml是web发展的趋势。

### EngLish

#### What are HTML, XML and XHTML?

1. HTML

    HTML was originally an application of SGML (Standard Generalized Markup Language), a sort of meta-language for making markup languages

2. XML

    XML (eXtensible Markup Language) grew out of a desire to be able to use more than just the fixed vocabulary of HTML on the web. It is a meta-markup language, like SGML, but one that simplifies many aspects to make it easier to make a generic parser.

3. XHTML

    XHTML (eXtensible HyperText Markup Language) is a reformulation of HTML in XML syntax. While very similar in many respects, it has a few key differences.

First, XML always needs close tags, and has a special syntax for tags that don’t need a close tag. In XML (including XHTML), any tag can be made self-closing by putting a slash before the code angle bracket, for example `<img src="funfun.jpg"/>`. In HTML that would just be `<img src="funfun.jpg">`

Second, XML has draconian error-handling rules.

#### HTML-compatible XHTML

To enable at least partial use of XHTML, the W3C came up with something called “HTML-compatible XHTML”. This is a set of guidelines for making valid XHTML documents that can still more or less be processed as HTML

#### What determines if my document is HTML or XHTML?

So what really determines if a document is HTML or XHTML? The one and only thing that controls whether a document is HTML or XHTML is the MIME type. If the document is served with a `text/html` MIME type, it is treated as HTML. If it is served as `application/xhtml+xml` or `text/xml`, it gets treated as XHTML. In particular, none of the following things will cause your document to be treated as XHTML:

+ Using an XHTML doctype declaration
+ Putting an XML declaration at the top
+ Using XHTML-specific syntax like self-closing tags
+ Validating it as XHTML

[原文链接](https://webkit.org/blog/68/understanding-html-xml-and-xhtml/)

## promise 问题

### promise 错误能不能上抛 当有一个函数返回 promise 这个函数内部再调用另一个函数，这个函数也会返回 promise, 这个 promise 被 reject，那么上级 promise 会不会被reject

```js
(async function () {
  function async1() {
    return new Promise((resolve, reject) => {
      reject('async1 error');
    })
  }

  function async2() {
    return new Promise((resolve, reject) => {
      resolve('async2 success');
    })
  }

  async function async3() {
    await async2()
    await async1()
  }

  const promises = [];
  promises.push(async3());
  try {
    await Promise.all(promises);
  } catch (e) {
    console.log(e);
  }
})()
```

结论：**上级会被reject**

## DOM 相关知识点

### CharacterData

#### 翻译：  

CharacterData 抽象接口（abstract interface）代表 Node 对象包含的字符。这是一个抽象接口，意味着没有 CharacterData 类型的对象。 它是在其他接口中被实现的，如 Text、Comment 或 ProcessingInstruction 这些非抽象接口。

#### 原文：

The CharacterData abstract interface represents a Node object that contains characters. This is an abstract interface, meaning there aren't any object of type CharacterData: it is implemented by other interfaces, like Text, Comment, or ProcessingInstruction which aren't abstract.

### ProcessingInstruction

#### 原文：

A processing instruction embeds application-specific instructions in XML which can be ignored by other applications that don't recognize them. Even if an XML processor ignores processing instructions, it will give them a place in the DOM.

A processing instruction is different from the XML declaration, which supplies information about the document such as character encoding, and can only appear as the first item in a document.

User-defined processing instructions cannot begin with 'xml', as these are reserved (such as `<?xml-stylesheet ?>`).

Processing instructions inherit methods and properties from `Node`.

### XSTL

样式转换标记语言。可以将XML数据档转换为另外的XML或其它格式，如HTML网页，纯文字。

Use XSLT to transform XML into HTML
XSLT (eXtensible Stylesheet Language Transformations) is the recommended style sheet language for XML.

XSLT is far more sophisticated than CSS. With XSLT you can add/remove elements and attributes to or from the output file. You can also rearrange and sort elements, perform tests and make decisions about which elements to hide and display, and a lot more.

XSLT uses XPath to find information in an XML document.

```xml
<?xml-stylesheet type="text/xsl" href="example.xsl"?>
```

### Comment

翻译：  
Comment 接口代表标签（markup）之间的文本符号（textual notations）。尽管它通常不显示出来，但是在查看源码里面可以看到。在 HTML 和 XML 里，注释（Comments）为 `'<!--' 和 '-->'` 之间的内容。在 XML 里，字符序列 `'--'` 不能用于一个注释中。

原文：  
The Comment interface represents textual notations within markup; although it is generally not visually shown, such comments are available to be read in the source view. Comments are represented in HTML and XML as content between `'<!--' and '-->'`. In XML, the character sequence `'--'` cannot be used within a comment.

## react 性能问题

1. 问题：

    我们应用需要每个 tab 内容显示 1000 个列表条目，每个条目显示一个文本状态和背景颜色，1000 个条目里随机每秒有一个改变文本状态。使用react渲染非常慢，一次渲染要 4~5s。

    问题理解：

    生成 2000 个 div，每个 div 有一个随机的字符串和背景色，每 100 毫秒随机修改其中一个 div 的字符串和背景色

    尝试结果：

    + 网友

        [demo](https://codesandbox.io/s/l7kow2rp5l/)

    + 自己

        已测。照着网友的demo自己敲了一遍

    [原文链接](https://www.v2ex.com/t/519999#reply176)

## 深入理解Node.js垃圾回收与内存管理（待测试）

Node程序运行中，此进程占用的所有内存称为**常驻内存**（Resident Set）。

常驻内存由以下部分组成：

1. 代码区（Code Segment）：存放即将执行的代码片段
2. 栈（Stack）：存放局部变量
3. 堆（Heap）：存放对象、闭包上下文
4. 堆外内存：不通过V8分配，也不受V8管理。Buffer对象的数据就存放于此。

Buffer对象本身属于普通对象，保存在堆，由V8管理，但是其储存的数据，则是保存在堆外内存，是有C++申请分配的，因此不受V8管理，也不需要被V8垃圾回收，一定程度上节省了V8资源，也不必在意堆内存限制。

[原文链接](https://www.jianshu.com/p/4129a3fce7bb)

## MVC MVP MVVM 概念

MVC

c -> m -> v

[相关文章](http://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)

[相关文章](https://juejin.im/post/593021272f301e0058273468)

## vue 双向绑定

[原文链接](https://jiongks.name/blog/vue-code-review/)

## 《nodeJS 设计模式》

[简介](https://zhuanlan.zhihu.com/p/29786710)

## 页面加载

### 1. Progress Indicator（进度指示器）

1. 使用 NProgress.js 库

### 2. Skeleton Screen（加载占位图）

1. 先写好 Skeleton Screen Loading 组件

   ![avatar][skeletonScreen]

   在加载数据时先使用 Skeleton Screen Loading 组件进行页面展示

2. 先写好 Skeleton Screen 的 CSS 样式，加载完数据后移除 Skeleton Screen 样式
3. 利用 CSS :empty 伪类辅助实现

最终我选择用 CSS :empty 伪元素实现

[原文链接](https://zhuanlan.zhihu.com/p/41605338)

### 3. 图片加载

1. svg占位
2. 模糊图像
3. 完全加载

## JavaScript `this`

### 什么是 `this` ?

JavaScript 的 `this` 关键字指向它所属的对象

> 在方法中，`this` 指向它所属的对象  
> 单独 `this` 指向全局对象  
> 在函数中 `this` 指向全局对象  
> 在函数中，严格模式下，`this` 是 `undefined`  
> 在事件中，`this` 指向接收事件的元素
> 方法`call()`、`applay()` 可以改变 `this` 指向任意对象

### 在方法中的 `this`

```js
var preson = {
    firstName: '',
    lastName: '',
    fullName : function() {
    return this.firstName + " " + this.lastName;
    }
}
```

### 单独的 `this`

这时所有者为全局对象，严格模式下也一样

```js
var x = this;
```

### 在函数中的 `this`

在严格模式下 `this` 是 `undefined`。在函数中的 `this` 只有在调用的时候才能确定，指向调用它的对象。

```js
function myFunction() {
  return this;
}
```

### 在事件处理中

```html
<button onclick="this.style.display='none'">
  Click to Remove Me!
</button>
```

### 函数绑定

[原文链接](https://www.w3schools.com/js/js_this.asp)

## JavaScript 高阶函数

以下两个特征只要符合其中一项就可以称为高阶函数

+ 以一个或多个函数作为参数
+ 返回结果是一个函数

## 函数式编程

### 纯函数

对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态

优点：

+ 可缓存性（Cacheable）
+ 可移植性／自文档化（Portable / Self-Documenting）
+ 可测试性（Testable）
+ 合理性（Reasonable）
+ 并行代码（Parallel Code）

### 柯里化

传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数

```js
// ES5
var curry = function curry (fn, arr) {
  arr = arr || []

  return function () {
    var args = [].slice.call(arguments)
    var arg = arr.concat(args)

    return arg.length >= fn.length
      ? fn.apply(null, arg)
      : curry(fn, arg)
  }
}

// ES6
const curry = (fn, arr = []) => (...args) => (
  arg => arg.length >= fn.length
    ? fn(...arg)
    : curry(fn, arg)
)([...arr, ...args])
```

### 组合函数

将多个函数的能力合并，创造一个新的函数。

$y = f(w), w = g(x), y = f(g(x))$

一个应用其实就是一个长时间运行的进程，并将一系列异步的事件转换为对应结果。( pipline )

函数组合的意义就在于完成一条完整的 pipline，存在于 start 与 end 之间的数据变换 ( transformations )。

### point free

`Pointfree` 风格能够有效减少大量中间变量的命名。

不要命名转瞬即逝的中间变量（其实就是通过 `compose` 函数组合函数，去掉中间变量）

```js
// bad
var f = str => str.toUpperCase().split(' ');

// good
var toUpperCase = word => word.toUpperCase();
var split = x => (str => str.split(x));

var f = compose(split(' '), toUpperCase);
f("abdf efgh");
```

### Hindley-Milner 类型签名

这个东西有点类似 typescript 的强类型定义

```js
// strLength :: String -> Number
const strLength = s => s.length

// join :: String -> [String] -> String
const join = curry((what, xs) => xs.join(what))

// match :: Regex -> String -> [String]
const match = curry((reg, s) => s.match(reg))

// replace :: Regex -> String -> String -> String
const replace = curry((reg, sub, s) => s.replace(reg, sub))
```

总结一下类型签名的作用就是：

+ 声明函数的输入和输出
+ 让函数保持通用和抽象
+ 可以用于编译时候检查
+ 代码最好的文档

### 实际体验

#### 容器

```js
const Box = x => ({
    map: f => Box(f(x)),        // 返回容器为了链式调用
    flod: f => f(x),            // 将元素从容器中取出
    inspect: () => `Box(${x})`  // 看容器里有啥
})
```

#### Either / Maybe

```js
// Either 由 Right 和 Left 组成
// monad 单子
const Left = (x) => ({
  map: f => Left(x),            // 忽略传入的 f 函数
  fold: (f, g) => f(x),         // 使用左边的函数
  inspect: () => `Left(${x})`,  // 看容器里有啥
  chain: f => Left(x)           // 和 map 一样，直接返回 Left
})

// monad 单子
const Right = (x) => ({
  map: f => Right(f(x)),        // 返回容器为了链式调用
  fold: (f, g) => g(x),         // 使用右边的函数
  inspect: () => `Right(${x})`, // 看容器里有啥
  chain: f => f(x)
})

// 来测试看看~
const right = Right(4)
  .map(x => x * 7 + 1)
  .map(x => x / 2)

right.inspect() // Right(14.5)
right.fold(e => 'error', x => x) // 14.5

const left = Left(4)
  .map(x => x * 7 + 1)
  .map(x => x / 2)

left.inspect() // Left(4)
left.fold(e => 'error', x => x) // error
```

实际使用，其中 formNullable 为 Either

```js
const fromNullable = (x) => x == null
  ? Left(null)
  : Right(x)

const findColor = (name) => fromNullable(({
  red: '#ff4444',
  blue: '#3b5998',
  yellow: '#fff68f',
})[name])

findColor('green')
  .map(c => c.slice(1))
  .fold(
    e => 'no color',
    c => c.toUpperCase()
  ) // no color
```

+ [函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)
+ [原文链接](https://zhuanlan.zhihu.com/p/21714695)
+ [JavaScript 函数式编程（一）](https://juejin.im/post/5b7014d5518825612d6441f8)
## SSR vs CSR

SSR (server-side-rendering)

CSR (client-side-rendering)

SEO (Search Engine Optimization)

TTFP (Time To First Page)

### the same

+ React will need to be downloaded
+ the same process of building a virtual dom
+ attaching events to make the page interactive

### the different

+ The main difference is that for SSR your server’s response to the browser is the HTML of your page that is ready to be rendered, while for CSR the browser gets a pretty empty document with links to your javascript. That means your browser will start rendering the HTML from your server without having to wait for all the JavaScript to be downloaded and executed.

### The Critical Issues

SSR 能够让用户更早看到页面，但是整个页面加载完成的总时间比 CSR 长。

加载的js文件大小都比较大

Next.js, by design, serves up static files to be not cached. To be honest, this is a bit of a deal-breaker for me (have not found a good solution here).

很关键的一点 Next.js 中，**服务端静态文件没有缓存**

### Pre-Rendering with Create React App

> If you’re hosting your build with a static hosting provider you can use react-snapshot or react-snap to generate HTML pages for each route, or relative link, in your application. These pages will then seamlessly become active, or “hydrated”, when the JavaScript bundle has loaded.

属于官方提供的一种新方法

+ 在有图片的网页，渲染速度比 Next.js 较快，但页面总加载时间比 Next.js 快，js 文件的大小比 Next.js 更小
+ 在没有图片的网页，渲染速度比 Next.js 慢。因为预渲染需要等待css文件（1KB）加载完成

— Create React App — [Pre-Rendering into Static HTML](https://facebook.github.io/create-react-app/docs/pre-rendering-into-static-html-files)

具体使用就是添加 react-snapshot 这个npm包，并将原有代码修改两行即可

Following the instructions provided in [react-snapshot](https://github.com/geelen/react-snapshot); just changing one line in each of two files.

如果要在 typescript 中使用这个库

For those using TypeScript, react-snapshot does not supply type definitions (neither is there a DefinitelyTyped version). The good news is that because it is just a drop-in replacement for react-dom, it can be easily typed; just drop the following at the end of your:

./src/react-app-env.d.ts

```js
...
declare module 'react-snapshot' {
  import * as ReactDOM from 'react-dom';
  var render: ReactDOM.Renderer;
}
```

参考资料

+ [“服务端渲染”吊打“客户端渲染”的那些事](https://www.w3ctech.com/topic/2005)
+ [Next.js (SSR) vs. Create React App (CSR)](https://codeburst.io/next-js-ssr-vs-create-react-app-csr-7452f71599f6)

[skeletonScreen]:data:image/gif;base64,UklGRuoPAABXRUJQVlA4WAoAAAASAAAAUQMAoQAAQU5JTQYAAAAAAAAAAABBTk1GtAIAAAAAAAAAAFEDAKEAAEYAAAJWUDggnAIAABA6AJ0BKlIDogA+kUieSyWkoqGksMpQsBIJaW7hbw5PxQBkaD+gAfOooDK15LRsQxVOQ1xUGKpyGuKgxVOQ1xUGKpyGuKgxVOQ1xUGKpyGuKgxVOPTy4GPHtOClDMjJiRtswqNPFD4FRZeJBxuJG2zCo08UPgVFlpfGQZ0EtAtq0oX6DJiRtswqNPFD4FRZeJBxuJG2zCo07uVAxn9qemqio08UPgVFl4kHG4kbbMKjTxQ+BUWXiEHAmNZExGqWVqiawgws1fUxznksiSwIJAENYQYWawOsc5vBE1Fl4j76O5TTtkn/WYEOHD77RnirmvOleTbekrNY5r6SLYhbTZF3/OFIZfNvoG6NdqCJe6O5Bv8EEKaE5Mfjr4u7rQif3Wo0+WtCJ/0ucN6QxE7VEi3Rrn5FAQ/IoqLLS+MhENT7Xkr/D4DxNRZeJBxuJG2zCo08UPgVFl4kHFq5d7S1BMSNtmFRp4ofAqLLxIONxI22YVGnih8CnVjYL9YoqoibX5E3Rrn5FAQ/Im6Nc/IoCH5E3Rrn5FAQ/Im6NwQx6lB/FI2C4H/l4ybgvxk3BfjJuC/GTcF+Mm4L8ZNwX4ybgvxk3BfjJuC/GTcF+Mm4L8ZNwX4ybCXS1YfwAP7/sMlAAv78HAsLNKOu4decaADXGD/3OiAEKTjbXACGfvE9oOfOr67ZqAp1P3pcIMQST+zDN2Gs2yea1u7ba8YxdEy2k5OA/ceqP9TzwiR1xaAhk1thC9vwH6K0j0Wc3eF2WqzP1R3QvWpTmnOHAhvh0qW5SGRPX0g+ZydZo7G/08EZ2zWr4AAABk2JIajTS5nf2KXdiv3b2+xX7t7fYr927k6VpAAFN1zmKrNNEc1RNluAAAAAAAAQ/W5780C3cFAAQU5NRvwAAABQAAAgAADDAQAnAAA8AAAAQUxQSCkAAAABDzD/ERFCTRtJzjI4/mjj56+mi+j/BPi3BonGFyQg9CsQZ2e+zYsTAwBWUDggsgAAANQLAJ0BKsQBKAA+kUSdSoJfIKQAASCWlu3QACixjWsl6BSDOXbALraSmB1kwOlm04G6+iAh0b+y3JKhN6u/hxbKCwq2YWJmU7Ct5xkX+sngCJuL+tSyYTGTCGliG7Cn5y6nPxrWFAAA/vX4HAsPj3VhRdZyHMg3COuQWWZJLXYM4ybTYxO5jBaYF+iicZL/Se3RKAAX4EqAH/lYb1pDACjcc8ShZ0K5xaIiQ0KvqGCwAABBTk1G3gAAAIYAACAAAIcBACcAAEYAAABBTFBIJwAAAAEPMP8REcJIBDXfgP4taYDlppiL6P8E5A2FSwLw1q57WE5TbxDtDQBWUDgglgAAANQJAJ0BKogBKAA+kUCbSoJ1D7cAASCWlu4MAAAAGeL4JI9VO5l0SM3N+Erx6R/mnkssssosony/mg/oSzZrYPJ0Lt+XhNjjc34SviTn77777777775lAAD+dXZlLUrSPVhCbBW3P+G7RxXr08YZX171Lm+LyWje/ovDA42t83sLiPHwAZF3amzXwPXPXcRO6tiPIUAAAEFOTUbEAAAAxgAAIAAABwEAJwAARgAAAEFMUEgnAAAAAQ8w/xERQkkjScw6OP8uz8GzhgqL6P8ExBkK9wgAvKppL8qR1v8BAFZQOCB8AAAAdAcAnQEqCAEoAD6RQJ1LAkckq4ABIJaQAABPRIBrnNvOVpFCMn38t/jUh6zHV1ahb0U/31E4EnAlf12pmujVCufof4AA/vXZ2haRc33b97jxkK9hTCa6Zh0uRcfYL83xeS0bg1pIv2IaggAJbxggCZuHAFjpRprQAAAAAEFOTUaIAAAAJAAAIAAASwIADwAAEgIAAEFMUEgbAAAAAQ8w/xERgkiAhAf+X+sATaSI/k9Af0YDTCsBAFZQOCBMAAAAVAUAnQEqTAIQAD6RRp9MAitVgAABIJaQAABwi0z/UKV8ku/uIClfJLv7iAhjnaB76rwAAP71f7LCbMtW/elqAni9qiv4AAAAAAAAAEFOTUZaAgAAAAAAAAAAUQMAoQAARgAAAlZQOCBCAgAAsDgAnQEqUgOiAD6RSJ5KpaeioaQRinDwEglpbuFzQRvzygCdtyh8yZwWmd9HC1a8WKaYy0CwtM76OFq14sU0xloFhaZ30cLVrxYppjLQK6two8k3c1RVqapkxIqDJiRUGTEioMmJFQZMSKgyYkVBkxIqAnQedN1mjdGK1FY0GTEioMmJFQZMSKgyYkVBkxIqDJiRStLW//pDs80WXiQf7iRUGTEioMmJFQZMSKgyYkVAToPPWGcnzGGn+PXixTTGWgWFpnfRwtWvFimmMtAsLS6iqi/3EioMjwrpLbJudy7tdaZtg6RNtzFhaZ30cLVrxYppjLQLC0zqQYNpC6teLFNMDUPGVFl3sI2WGNyKuRPyBf0cLVrxYppjLQLC0zvo4TnNvDLxIP9xIqDJiQ7fnPKM7WaEjIXh7lzXPKHjKiy8SD/cSKgyYkVBkxIqDJiRUGSBrJGTEioMmJFQZMSKgyYkVBkxIqDJiRUGTEioMBLuqouCTJiRUGTEioMmJFQZMSKgyYkVBkxIqDJiRUF+GCgvFuLQcRQUfGR4yPGR4yPGR4yPGR4yPGR4yPGR4yPGR4yPGR4yPGR4yPGR4yPGR4yPGR4yPGR2IZ/JYn8AAP7/FTXaN8yWGAJx+CW/QsuqmQ8ffgA7LXtTfixuqkAiab6BNvYyhwb9AE/l1p7CZfydQFDq4bRpl3rAI3PTKHpTj+NhvZLtAVG3dACsZ0giOA2pWkADY1+EAU9bEx6/zfIA0RFz+ENFZBYhragPdwUAAABBTk1GvAAAAB4AABYAAJMAAE8AADwAAABBTFBILgAAAAEPMP8REUJJI0nSOhj/LtdBoUX3woj+TwAAANkAqfGjNMhHGS+kQT7K+E0AshBWUDggbgAAADQHAJ0BKpQAUAA+kUSdSgJdqqiAASCWkAAB27ltaVbYNLJMt/HvMGrN5D1hNLi/miOnGffOP8etolhelMXhTzj/wAD+8f6SGE7hLR+Ps6poKFL3ojBVc1Z0QXjbgAwLNy8k+Pjsu1rhFMIAAAAAQU5NRggBAAAeAAAWAAAMAQBPAABGAAAAQUxQSEQAAAABDzD/ERGCTSNJjprBLIPlz24YTHT33kYR/Z+AbN9XIgCLlesv4Ahn1X5q+G1wxMr1wMTAWVOvQ/rJrVzPS7wNm/dVAFZQOCCkAAAAtAsAnQEqDQFQAD6RPptIgpdwtQABIJaW7gwQALHKCKF2T9hVPxdnLahfTPjRlcKTxMdebfX1ggjZ8BUF3m+plG5Vbt27Yq3PI3tUKpwaPl86cKXIeOjcCfMYSvn7F9DF71WTxUQAAP6Ar962X6N+iWr9RAxc7JqJXU3hLIt56dkiyksOt9BOB6SYnmwJIu4NzMX+GL/qbWyvkGXl2FYU4dAAAABBTk1GMAEAAB4AABYAAIsBAE8AAEYAAABBTFBIPQAAAAEPMP8REYJRJEmKxkH5d9kOlhkOXhH9nwA3P/eDzfrnk8uSyHXnhXOYyX0Cs75pcikZue78+Wb9703LrQAAVlA4INIAAAB0DgCdASqMAVAAPpFAm0iCrSS9gAEglpbuDBd/gC1AbuGCRPVMHzA7qf03BocEzyLmZby9B5m+kxykcqOArMMLPYoyoyDmwxuQ/Avoof+UMo/1FkEt6ocfU/pQHwkvMefZjO4ZzE/7f2K9iT1Vsv+hClChAihdHFPiiiegAPw2/DlAAl9afeK4W1X/knOH6gpvl4QtWlOPtjAE8/4YiwGqlq0aRtneew2nHJ41p4dcUEKz/H2Ueyz1zPG9yb+gprN+sZiOlFvbT+ZatpEAAAAAAABBTk1GcgIAAAAAAAAAAFEDAKEAADwAAAJWUDggWgIAADA4AJ0BKlIDogA+kUieSqWkoyGksSpQsBIJaW7hcKvAl9wueAVn0LfhjnPJaNiGKpyGuKgxVOQ1xUGKpyGuKgxVOQ1xUGKpyGuKgxVOQ1xUGKTpgAtSviLK6B+iQcbiRtswqNPFD4FRZeJBxuJG2zCo08UPgUyGI/ktf/oB21Zp4ofAqLLxIONxI22YVGnih8CosvEgz16w8roefgQ+BUWXiQcbiRtswqNPFD4FRZeJBxuBv/izHGmqfwWnGxDFMxuWdJFTkNcVBdT6042GkTPaaMRDYQRNRZd5KiGmWZAHztrJvqLznktGw/Wi3DWIDiYw+yAoD+sCgxpwI/Wi1iXExWgyYkbZ9IBkJSHm9uS8lo2IYqWqmOBunH6poL5d04777rVBD4FRZeJBxuIsbGiOiOn2vJYykzrRkm2zCo08UPgVFl4kHG4kbbMKjTxQ97DngVGniYgUIImosvEg43EjbZhUaeKHwKiy8SDiUNlgxjgDjZ/kTfCosvEg43EjbZhUaeKHwKiy8SDjcSKQ31Eo5oXF+0rtQW7xfqmgvl3eL9U0F8u7xfqmgvl3eL9U0F8u7xfqmgvl3eL9U0F8u7xfqmgvjpLAHbQAAP7/SB9ZhQTWgB6NdsqcK14gwxkTb0kAKe3d6wBSC4pxAE8S/gb3++V+XX63AiX67X93xJdHL4jSqO9xUZhuXeOTlPN2BOwQoOBi2PUCjaEMaawAbhpoUTH+270GMe3erRc9N3P2oBEQABet3WbzwB8v+AAZFu0vQNhxObMVZHd4AAd2NdRQ5x17wqHcFAAAQU5NRtYAAACUAAAgAABrAQAnAABGAAAAQUxQSCQAAAABDzD/ERHCaNs2/mD/X1s6DVVDEf2fgNyeTgF65XSHVkGSHwZWUDggkgAAAHQIAJ0BKmwBKAA+kUSeSoJDOaiAASCWlu3QADRzYVbHSphap8GVIlPINJ3MDekdRQZP4pNYbaLKMhdxWQ1LEkS9PfJN1Xm/pUwtTIAA/vU7DTQrxYY2C27fnw5bHbwdIMkihnqwcPkX/VFtGNsKgE6LP3GB2fm/m4Q+UpRg12AAhSBS65v69BCvK+8HrVAAAAAAQU5NRrAAAADCAAAgAAAPAQAnAABGAAAAQUxQSCYAAAABDzD/ERFCTSRJyjlY/y7PAcN/RFFE/ydALiko5RMDbefTkjG+A1ZQOCBqAAAAdAYAnQEqEAEoAD6RRJ5LAilAqIABIJaW7dAAI8RIRafMAiQhmSMi4MpEjdggimKp5bs0+YBCYPfmAQUAAP71Oin7WojcAipRYYco/gqL6eGXq9lj7uB1SU0JLe4N9wyIPSk2v8K/GwAAAEFOTUY+AAAAEAEAIAAAcwAADwAAkAEAAFZQOCAmAAAAlAIAnQEqdAAQAD6RPpdLgkAAASCWkAAB9Xs6NAAA/vU6LWMoAAA=