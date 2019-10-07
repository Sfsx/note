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

#### 再说说为什么网页编码要从html>>xhtml>>xml这么发展

话说早起的网页使用html语言编写的，但是它拥有三个严重的缺点：

1. 编码不规范，结构混乱臃肿，需要智能的终端才能很好的显示
2. 表现和结构混乱，不利于开发和维护
3. 不能使用更多的网络设备，比如手机、PDA等因此HTML需要发展才能解决这个问题，于是W3C又制定了XHTML，XHTML是HTML向XML 过度的一个桥梁。而xml是web发展的趋势。

### EngLish

#### What are HTML, XML and XHTML

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

#### What determines if my document is HTML or XHTML

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

CharacterData 抽象接口（abstract interface）代表 Node 对象包含的字符。这是一个抽象接口，意味着没有 CharacterData 类型的对象。 它是在其他接口中被实现的，如 Text、Comment 或 ProcessingInstruction 这些非抽象接口。

The CharacterData abstract interface represents a Node object that contains characters. This is an abstract interface, meaning there aren't any object of type CharacterData: it is implemented by other interfaces, like Text, Comment, or ProcessingInstruction which aren't abstract.

### ProcessingInstruction

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

查看内存使用状态`process.memoryUsage()`

常驻内存由以下部分组成：

1. 代码区（Code Segment）：存放即将执行的代码片段
2. 栈（Stack）：存放局部变量
3. 堆（Heap）：存放对象、闭包上下文
4. 堆外内存：不通过V8分配，也不受V8管理。Buffer对象的数据就存放于此。

Buffer对象本身属于普通对象，保存在堆，由V8管理，但是其储存的数据，则是保存在堆外内存，是有C++申请分配的，因此不受V8管理，也不需要被V8垃圾回收，一定程度上节省了V8资源，也不必在意堆内存限制。

[原文链接](https://www.jianshu.com/p/4129a3fce7bb)

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

### 什么是 `this`

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

ES5 中在严格模式下 `this` 是 `undefined`。

1. 在函数中的 `this` 只有在**调用的时候才能确定**，指向调用它的对象。
2. 多层嵌套的对象，内部方法的this指向离被调用函数最近的对象

但在 ES6 的箭头函数按**词法作用域**来绑定它的上下文，所以 `this` 实际上会引用到原来的上下文（词法作用域：函数的作用域在函数定义的时候就决定了，无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定）

箭头函数 无法使用 `call`，`apply`，`bind` 方法修改里面的 `this`

```js
function myFunction() {
  return this;
}
```

### 在事件处理中

#### 内联事件

1. 当代码被内联处理函数调用时，它的 `this` 指向监听器所在的DOM元素
2. 当代码被包括在函数内部执行时，其 `this` 指向等同于**函数直接调用**的情况，即在非严格模式指向全局对象 `window`， 在严格模式指向 `undefined`

```html
<button onclick="this.style.display='none'">
  Click to Remove Me!
</button>
<button onclick="(function () {console.log(this);})();">
  use strict
</button>
```

#### 事件处理函数

当函数被当做监听事件处理函数时， 其 `this` 指向触发该事件的元素

```js
function bluify(e){
  // 在控制台打印出所点击元素
  console.log(this);
  // 阻止捕获和冒泡阶段中当前事件的进一步传播
  e.stopPropagation();
  // 阻止事件的默认动作
  e.preventDefault();
  // 阻止事件冒泡并且阻止相同事件的其他侦听器被调用
  e.stopImmediatePropagation();
  this.style.backgroundColor = '#A5D9F3';
}
var elements = document.getElementById('this');
elements.addEventListener('click', bluify, false);
```

**小知识**（`addEventListener` 的第三个参数为布尔值，指定事件是否在捕获或冒泡阶段执行。事件监听可以使用对应的 `removeEventListener` 来移除）

#### setTimeout & setInterval

对于演示函数内部的回调函数的 `this` 指向全局对象 `window`

#### 函数绑定

[原文链接](https://www.w3schools.com/js/js_this.asp)

[深入理解JavaScript this](http://caibaojian.com/deep-in-javascript-this.html)

[this 指向详细解析（箭头函数）](https://www.cnblogs.com/dongcanliang/p/7054176.html)

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
const curry = (fn, ...arr) => (...args) => (
  arg => arg.length >= fn.length
    ? fn(...arg)
    : curry(fn, ...arg)
)([...arr, ...args])
```

#### 为什么扼要柯里化

##### 移除重复

```js
const createURL = (baseURL, path) => {
  const protocol = "https";
  return `${protocol}://${baseURL}/${path}`;
};

// create URLs for our main site
const homeURL = createURL("mysite.com", "");
const loginURL = createURL("mysite.com", "login");
const productsURL = createURL("mysite.com", "products");
const contactURL = createURL("mysite.com", "contact-us");

// create URLs for our careers site
const careersHomeURL = createURL("mysite-careers.com", "");
const careersLoginURL = createURL("mysite-careers.com", "login");
```

柯里化

```js
const createURL = baseURL => {
  const protocol = "https";

  // we now return a function, that accepts a 'path' as an argument
  return path => {
    return `${protocol}://${baseURL}/${path}`;
  };
};

// we create a new functions with the baseURL value in it's closure scope
const createSiteURL = createURL("mysite.com");
const createCareersURL = createURL("mysite-careers.com");

// create URLs for our main site
const homeURL = createSiteURL("");
const loginURL = createSiteURL("login");
const productsURL = createSiteURL("products");
const contactURL = createSiteURL("contact-us");

// create URLs for our career site
const careersHomeURL = createCareersURL("");
const careersLoginURL = createCareersURL("login");
```

##### 隔离昂贵程序

```js
// given a database of global parcels like this...
const allGlobalParcels = [
  {
    created: 576424800000,
    location: "aus",
    properties: { ... },
  },
  {
    created: 1558163267311,
    location: "us",
    properties: { ... },
  },
  ...2701201201 more items
];

const sortParcelsByCountry = (parcels, country, order) => {
  // 1. Filter our list to only include parcels from 'country;
  const countryParcels = parcels.filter(parcel => parcel.location === country);

  // 2. Sort the list of parcels by date created
  const sortedResult = [...countryParcels].sort((a, b) => {
    if (order === "ascending") return a.created - b.created;
    // by default return packages by descending order
    return b.created - a.created;
  });

  return sortedResult;
};

const ausParcelsAsc = sortParcelsByCountry(allGlobalParcels, "aus", "ascending");
const ausParcelsDsc = sortParcelsByCountry(allGlobalParcels, "aus", "descending");
```

柯里化（实际上就是将中间步骤的结果进行缓存，然后在交给不同的分支，直到得出最终结果）

```js
// given a database of global parcels like this...
const allGlobalParcels = [
  {
    created: 576424800000,
    location: "aus",
    properties: { ... },
  },
  {
    created: 1558163267311,
    location: "us",
    properties: { ... },
  },
  ...2701201201 more items
];

const sortParcelsByCountry = parcels => country => {
  // 1. Filter our list to only include parcels from 'country;
  const countryParcels = parcels.filter(parcel => parcel.location === country);

  // we now return a function that sorts the parcels by date created
  return order => {
    // 2. Sort the list of packages by date
    const sortedResult = [...countryParcels].sort((a, b) => {
      if (order === "ascending") return a.created - b.created;

      // by default return packages by descending order
      return b.created - a.created;
    });

    return sortedResult;
  };
};

// we create a new function with the filtered list of parcels by country in it's closure scope
const sortAusParcelsBy = sortParcelsByCountry(allGlobalParcels)("aus");

const ausParcelsAsc = sortAusParcelsBy("ascending");
const ausParcelsDsc = sortAusParcelsBy("descending");
```

#### 语义化

获取 object 中某个键名对应的健值

```js
var objects = [{ id: 1, title: 'sward' }, { id: 2, title: 'art' }, { id: 3, title: 'online' }]

objects.map(function(o){ return o.id })
```

柯里化

```js
var get = curry(function(property, object){ return object[property] })

objects.map(get('id')) // [1, 2, 3]
objects.map(get('title')) // [sward, art, online]
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
var splitBySpace = str => str.split(' '));

var f = compose(splitBySpace, toUpperCase);
f("abdf efgh");
```

可以看到，整个运算由两个步骤构成，每个步骤都有语义化的名称，非常的清晰。这就是 Pointfree 风格的优势

再看一个例子

```js
// 下面是一个字符串，请问其中最长的单词有多少个字符？
var str = 'Lorem ipsum dolor sit amet consectetur adipiscing elit';

// 以空格分割单词
var splitBySpace = s => s.split(' ');

// 每个单词的长度
var getLength = w => w.length;

// 词的数组转换成长度的数组
var getLengthArr = arr => R.map(getLength, arr);

// 返回较大的数字
var getBiggerNumber = (a, b) => a > b ? a : b;

// 返回最大的一个数字
var findBiggestNumber =
  arr => R.reduce(getBiggerNumber, 0, arr);

var getLongestWordLength = R.pipe(
  splitBySpace,
  getLengthArr,
  findBiggestNumber
);

getLongestWordLength(str) // 11
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

## RxJs

### 用于 JavaScript 的 ReactiveX 库

RxJS 是使用 Observables 的响应式编程的库， 它使编写一部或基于回调的代码更容易。

ReactiveX 结合了 观察者模式、迭代器模式 和 使用集合的函数式编程，以满足以一种理想方式来管理事件序列所需要的一切。

[中文官网](https://cn.rx.js.org/)

[RxJS 入门指引和初步应用](https://zhuanlan.zhihu.com/p/25383159)

## 动态语言和静态语言

对于动态语言与静态语言的区分，套用一句流行的话就是： Static typing when possible, dynamic type when need

### 动态语言

动态类型语言是指在运行时期间才去做数据类型检测的语言，也就是说，在用动态语言编程时，永远不会给任何变量指定数据类型，该预约会在你第一次赋值给变量时，在内部将数据类型记录下来。

### 静态语言

静态类型语言和动态类型语言恰好相反，它的数据类型是在编译期间检查的，也就是说在写程序时要声明所有变量的类型。

## 强类型定义语言和弱类型定义语言

### 强类型语言

强制数据类型定义的语言，也就是说，一旦一个变量被指定了某个数据类型，如果不经过强制转换，那么就永远是这个数据类型了。

#### 弱类型语言

数据类型可以被忽略的语言，它与强类型语言相反，一个变量可以赋不同数据类型的值

## JavaScript 中的 `null` 和 `undefined`

### `null` 表示“没有对象”，即该处不应该有值

1. 作为函数的参数，表示该函数的参数不是对象
2. 原型链的终点

    ```js
    Object.getPrototypeOf(Object.prototype) // null
    ```

### `underfined` 表示“缺少值”，即该处应该有一个值，但是还没有定义

1. 变量被声明了，但是还没有赋值
2. 调用函数式，应该提高的参数没有提供，该参数等于 `underfined`
3. 对象没有赋值的属性，该属性的值为 `underfined`
4. 函数没有返回值时，默认返回 `underfined`

## querySelectorAll 方法相比 getElementsBy 系列方法有什么区别

### 1. W3C 标准

querySelectorAll 属于 W3C 中的 Selectores API 规范[1]。而 getElemenetsBy 系列则属于 W3C 的 DOM 规范[2]

### 2. 浏览器兼容

querySelectorAll 已被 IE 8+、FF 3.5+、Safari 3.1+、Chrome 和 Opera 10+ 良好支持 。getElementsBy 系列，以最迟添加到规范中的 getElementsByClassName 为例，IE 9+、FF 3 +、Safari 3.1+、Chrome 和 Opera 9+ 都已经支持该方法了。

### 3. 接收参数

querySelectorAll 方法接收的参数是一个 CSS 选择符。而 getElementsBy 系列接收的参数只能是单一的className、tagName 和 name。代码如下

```js
var c1 = document.querySelectorAll('.b1 .c');
var c2 = document.getElementsByClassName('c');
var c3 = document.getElementsByClassName('b2')[0].getElementsByClassName('c');
```

**小知识**（CSS 选择器中的元素名，类和 ID 均不能以数字为开头。）

### 4. querySelectorAll 返回的是一个 Static Node List，而 getElementsBy 系列的返回的是一个 Live Node List

```js
// Demo 1
var ul = document.querySelectorAll('ul')[0],
    lis = ul.querySelectorAll("li");
for(var i = 0; i < lis.length ; i++){
    ul.appendChild(document.createElement("li"));
}

// Demo 2
var ul = document.getElementsByTagName('ul')[0],
    lis = ul.getElementsByTagName("li");
for(var i = 0; i < lis.length ; i++){
    ul.appendChild(document.createElement("li"));
}
```

因为 Demo 2 中的 lis 是一个动态的 Node List， 每一次调用 `lis.length` 都会重新对文档进行查询，导致无限循环的问题。

而 Demo 1 中的 lis 是一个静态的 Node List，是一个 li 集合的快照，对文档的任何操作都不会对其产生影响。

在浏览器中

```js
document.querySelectorAll('a').toString();    // return "[object NodeList]"
document.getElementsByTagName('a').toString();    // return "[object HTMLCollection]"
```

这里又多了一个 HTMLCollection 对象出来，那 HTMLCollection 又是什么？

```js
var ul = document.getElementsByTagName('ul')[0],
    lis1 = ul.childNodes,
    lis2 = ul.children;
console.log(lis1.toString(), lis1.length);    // "[object NodeList]" 11
console.log(lis2.toString(), lis2.length);    // "[object HTMLCollection]" 4
```

NodeList 对象会包含文档中的所有节点，如 `Element`、`Text` 和 `Comment` 等。
HTMLCollection 对象只会包含文档中的 `Element` 节点。

### 参考链接

[原文链接](https://www.zhihu.com/question/24702250)

## csrf

### 1、什么是CSRF攻击

CSRF 攻击是黑客借助受害者的 cookie 骗取服务器的信任，但是黑客并不能拿到 cookie，也看不到 cookie 的内容。另外，对于服务器返回的结果，由于**浏览器同源策略**的限制，黑客也无法进行解析。因此，黑客无法从返回的结果中得到任何东西，他所能做的就是给服务器发送请求，以执行请求中所描述的命令，在服务器端直接改变数据的值，而非窃取服务器中的数据。

2011年的解决方案：

[CSRF 攻击的应对之道](https://www.ibm.com/developerworks/cn/web/1102_niugang_csrf/)

### 2、有哪些防御方案

1. 用户操作限制，比如验证码；
2. 请求来源限制，比如限制HTTP Referer才能完成操作；
3. token验证机制，比如请求数据字段中添加一个token，响应请求时校验其有效性；

**token验证的CSRF防御机制是公认最合适的方案**，也是本文讨论的重点。

### 3、前后端分离下有何不同

这个基本过时，现在 nodejs 配合 redis 拥有完美的 session 解决方案。

### 实现思路

#### 1、可行性方案

token防御的整体思路是：

+ 第一步：后端随机产生一个 token，把这个 token 保存在 SESSION 状态中；同时，后端把这个 token 交给前端页面；
+ 第二步：下次前端需要发起请求（比如发帖）的时候把这个 token 加入到请求数据或者头信息中，一起传给后端；
+ 第三步：后端校验前端请求带过来的 token 和 SESSION 里的 token 是否一致；
+ 第四步：定时更新 token 防止 token 被解析，每5分钟更新一次

这里依旧有个细节值得提一下：**Nodejs 的上层一般是 nginx，而 nginx 默认会过滤头信息中不合法的字段（比如头信息字段名包含“_”的），这里在写头信息的时候需要注意。**

### "One more thing..."

上文也提到，通过cookie及http头信息传递加密token会有很多弊端；有没有更优雅的实现方案呢？

#### 1、cookie中samesite属性

回溯下 CSRF 产生的根本原因：cookie 会被第三方发起的跨站请求携带，这本质上是 HTTP 协议设计的漏洞。

那么，我们能不能通过 cookie 的某个属性禁止 cookie 的这个特性呢？

好消息是，在最新的 RFC规范中已经加入了 `samesite` 属性。细节这里不再赘述，可以参考：

1. [SameSite Cookie，防止 CSRF 攻击](http://www.cnblogs.com/ziyunfei/p/5637945.html)
2. [Same-site Cookies](https://tools.ietf.org/html/draft-west-first-party-cookies-07#page-8)

### 实践

#### axios csrf

`headers: { 'X-CSRF-TOKEN': 获取上面csrf返回的数据 }`

开坑待填。。。

#### fetch csrf

开坑代填。。。

[前后端分离架构下CSRF防护机制](https://github.com/xiongwilee/blog/issues/7)

#### SameSite

已验证

##### Strict

Strict 为严格模式，另一个域发起的任何请求都不会携带该类型的 cookie，能够完美的阻止 CSRF 攻击。通过一个导航网站的超链接打开另一个域的网页也不能携带该类型的 cookie

##### Lax

Lax 相对于 Strict 模式来说，放宽了一些。简单来说就是，用**安全的 HTTP 方法（GET、HEAD、OPTIONS 和 TRACE）改变了当前页面或者打开了新页面时**，可以携带该类型的 cookie。

[跨站请求伪造与 Same-Site Cookie](https://www.jianshu.com/p/66f77b8f1759)

[SameSite Cookie attribute?](https://medium.com/compass-security/samesite-cookie-attribute-33b3bfeaeb95)

## CORB

Cross-Origin Read Blocking (CORB)

### 什么是 CORB

CORB 是一种判断是否要在跨站资源数据到达页面之前阻断其到达当前站点进程中的算法，降低了敏感数据暴露的风险。

[Cross-Origin Read Blocking (CORB)](https://juejin.im/post/5cc2e3ecf265da03904c1e06)

## 浏览器同源策略

### 同源的概念

+ 协议相同
+ 域名相同
+ 端口相同

举例来说，`http://www.example.com/dir/page.html` 这个网址，协议是 `http://`，域名是 `www.example.com`，端口是 `80`

+ `http://www.example.com/dir2/other.html`：同源
+ `http://example.com/dir/other.html`：不同源（域名不同）
+ `http://v2.www.example.com/dir/other.html`：不同源（域名不同）
+ `http://www.example.com:81/dir/other.html`：不同源（端口不同）

### 限制范围

#### 1. cookie、localStorage、indexDB 无法获取

csrf 跨站伪造请求

#### 2. DOM 无法获得

如果没有 DOM 同源策略，也就是说不同域的 iframe 之间可以相互访问，那么黑客可以这样进行攻击：

1. 做一个假网站，里面用 iframe 嵌套一个银行网站 `http://mybank.com`。
2. 把 iframe 宽高啥的调整到页面全部，这样用户进来除了域名，别的部分和银行的网站没有任何差别。
3. 这时如果用户输入账号密码，我们的主网站可以跨域访问到 `http://mybank.com` 的 dom 节点，就可以拿到用户的账户密码了。

#### 3. http 请求无法发送

1. 做个假网站，通过跨域请求 GET，获取某个银行网站的 `http://mybank.com` html 文档。
2. 将文档展示在自己的页面中
3. 这时如果用户输入账号密码，就可以拿到用户的账户密码了。

### cookie

页面可以改变本身的源，但是会有一些限制。脚本可以将 `document.domain` 设置为当前域或者当前域的超级域，该较短的域会用于后续源检查。

### DOM

h5 的 `window.postMessage` api

### http 请求

#### CORS

Cross-Origin Sharing Standard (CORS)

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

1. 请求方法是以下三种方法之一：

    + HEAD
    + GET
    + POST

2. HTTP的头信息不超出以下几种字段：

   + Accept
   + Accept-Language
   + Content-Language
   + Last-Event-ID
   + Content-Type：
     + application/x-www-form-urlencoded
     + multipart/form-data
     + text/plain

凡是不同时满足上面两个条件，就属于非简单请求。

浏览器对这两种请求的处理，是不一样的。

##### 简单请求

头部

```html
Origin: http://www.laixiangran.cn
Access-Control-Request-Headers: authorization
```

服务器返回

```html
Access-Control-Allow-Origin：http://www.laixiangran.cn
Access-Control-Allow-Credentials: true
```

##### 非简单请求

浏览器在发送真正的请求之前，会先发送一个 Preflight 请求给服务器，这种请求使用 OPTIONS 方法，发送下列头部

```html
Origin: http://www.laixiangran.cn
Access-Control-Request-Method: POST
Access-Control-Request-Headers: NCZ
```

服务器返回

```html
Access-Control-Allow-Origin: http://www.laixiangran.cn
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: NCZ
Access-Control-Max-Age: 1728000
```

#### WebSocket

协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

### localStorage、indexDB

目前无解

[Same Origin Policy](https://github.com/acgotaku/WebSecurity/blob/master/docs/content/Browser_Security/Same-Origin-Policy.md)

[为什么浏览器要限制跨域访问?](https://www.zhihu.com/question/26379635)

[浏览器同源策略及跨域的解决方法](https://juejin.im/post/5ba1d4fe6fb9a05ce873d4ad)

[HTTP访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

## 节流函数与防抖函数

### 节流函数

#### setTimeout

```js
function throttle(fn, delay) {
  let canRun = true;
  return function() {
    if (!canRun) return;
    canRun = false
    setTimeout(() => {
      fn.apply(this, arguments);
      canRun = true;
    }, delay)
  }
}
```

#### requestAnimationFrame

```js
var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
  // do something with the scroll position
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position);
      ticking = false;
    });
  }
  ticking = true;
});
```

### 防抖函数

```js
function debounce(fn, interval = 300) {
  let timeout = null;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, interval);
  };
}
```

## window.requestAnimationFrame()

[原文链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

## window.requestIdleCallback()

[原文链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

## `Object.freeze()` vs `Object.seal()`

### `Object.freeze()`

1. 给对象 `obj` 设置，`Object.preventExtension(obj)`，**禁止更改原型，禁止添加属性**
2. 为对象的每一个属性设置，`writable: false`，**禁止更改属性值**
3. 为对象的每一个属性设置，`configurable: false`，**禁止删除属性，禁止更改 `writable` 为 `true` ，禁止更改 `enumerable` 为 `false`, 禁止更改 `configuable` 为 `true`**

### `Object.seal()`

1. 给对象 `obj` 设置，`Object.preventExtension(obj)`，**禁止更改原型，禁止添加属性**
2. 为对象的每一个属性设置，`configurable: false`，**禁止删除属性**

与 `Object.freeze` 不同的是，`Object.seal` 后的对象是可写的 `writable: true`。

## Document.createDocumentFragment()

创建一个新的空白的文档片段

[原文链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment)

## 重定向

当浏览器请求一个地址，服务端返回302，浏览器会再次请求一次返回头中 Location 字段的地址（页面直接请求的响应的重定向地址，当前页面是要跳转的）。

ajax 或 fetch 请的响应的重定向，当前页面是不会跳转的，浏览器页面不会发生跳转。而是用 ajax 或 fetch 再一次请求返回头中 Location 字段的地址。

## isPlainObject

### jQuery

jQuery 3.4.1 版本中的 [`isPlainObject`](https://github.com/jquery/jquery/blob/3.4.1/src/core.js#L211) 。

```js
function isPlainObject(obj) {
  var proto, Ctor;

  if (!obj || ({}).prototype.call(obj) !== '[object Object]') {
    return false;
  }

  proto = Object.getPrototypeOf(obj);

  Ctor = ({}).hasOwnProperty.call(proto, 'constructor') && proto.construcor;
  return typeof Ctor === 'funciton' && Function.prototyp.toString.call(Ctor) === Function.prototype.toString.call(Object)
}
```

### lodash

lodash 4.17.15 版本中的 [`isPlainObject`](https://github.com/lodash/lodash/blob/4.17.15-npm/isPlainObject.js#L49)

基本与 jQuery 版本相同，多了一个 `Ctor instanceof Ctor` 的条件，满足此条件的仅有 `Function` 和 `Object` 两个函数。

```js
function isPlainObject(value) {
  if (!value || typeof value !== 'object' || ({}).toString.call(value) != '[object Object]') {
    return false;
  }
  var proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
}
```

### redux

```js
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  // proto = null
  return Object.getPrototypeOf(obj) === proto
}
```

## `toString` 与 `valueOf`

+ `valueOf()` 返回最适合该对象类型的原始值
+ `toString()` 将该对象的原始值以字符串形式返回

这两个方法一般是交由 JS 去隐式调用，以满足不同的运算情况。

在数值运算里，会优先调用 `valueOf()`，在字符串运算里，会优先调用 `toString()`。

```js
let e2 = {
    n : 2,
    toString : function (){
        console.log('this is toString')
        return this.n
    },
    valueOf : function(){
        console.log('this is valueOf')
        return this.n*2
    }
}
alert(e2) //  2  this is toString
alert(+e2)  // 4 this is valueOf
alert(''+e2) // 4 this is valueOf
alert(String(e2)) // 2 this is toString
alert(Number(e2)) // 4 this is valueOf
alert(e2 == '4') // true this is valueOf
alert(e2 === 4) //false === 操作符不进行隐式转换
```

**在有运算操作符的情况下，`valueOf()` 的优先级高于`toString()`**

**哪个修改先调用哪个**，哪个方法在实例中有自定义，则优先调用

[浅析toString与valueOf](https://segmentfault.com/a/1190000009132264)

## 洗牌算法

### Knuth-Durstenfeld Shuffle

```js
function shuffle(arr){
    var length = arr.length,
        temp,
        random;
    while(0 != length){
        random = Math.floor(Math.random() * length)
        length--;
        // swap
        temp = arr[length];
        arr[length] = arr[random];
        arr[random] = temp;
    }
    return arr;
}
```

### Other

```js
[1,2,3,4,5,6].sort(function(){
    return .5 - Math.random();
})
```

### ES6

```js
function shuffle(arr){
    let n = arr.length, random;
    while(0!=n){
        random =  (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
        [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的结构赋值实现变量互换
    }
    return arr;
}
```

[洗牌算法(shuffle)的js实现](https://github.com/ccforward/cc/issues/44)

## 二叉树遍历

开坑待填。。。

## 浏览器加载页面的详细过程

开坑待填。。。

## 类数组对象

方法一

```js
Array.prototype.slice.call(NodeList)
```

方法二

```js
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

// 或者

NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];
```

## DOM 删除孩子节点

### 方案一

```js
const myNode = document.getElementById("foo");
myNode.innerHTML = '';
```

### 方案二

```js
const myNode = document.getElementById("foo");
while (myNode.firstChild) {
  myNode.removeChild(myNode.firstChild);
}
```

[Remove all child elements of a DOM node in JavaScript](https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript)

[skeletonScreen]:data:image/gif;base64,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
