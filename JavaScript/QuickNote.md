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

## koa源码有感

```js
function createServer(res, req) {
    // ....
}

createServer(callback())

function callback(){

    const handleRequest = function (res, req) {
        // ....
    };

    reutrn handleRequest;
}
```

---

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

---

## 为什么要用Array.prototype.forEach.call(array, cb)而不直接使用array.forEach(cb)

有一些看起来很像数组的对象：

+ `argument`
+ `children` and `childNodes` collections
+ NodeList collections returned by methods like `document.getElementsByClassName` and `document.querySelectorAll`
+ jQuery collections
+ and even strings.

[StackOverflow 链接](https://stackoverflow.com/questions/26546352/why-would-one-use-array-prototype-foreach-callarray-cb-over-array-foreachcb)

---

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

---

## ES6的尾调用优化只在严格模式下开启，正常模式是无效的。（未验证）

---

## 异步

**实际上 `await` 是一个让出线程的标志。** `await` 后面的函数会先执行一遍，然后就会跳出整个 `async` 函数来执行后面js栈的代码

node 遇到 await 先执行后面的函数，将 resolve 压进回调队列再让出线程  
chrome 遇到 await 先执行后面的函数，先让出线程，再将 resolve 压进回调队列

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

+ [JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)

## es6

没有块级作用域回来带很多难以理解的问题，比如 `for` 循环 `var` 变量泄露，变量覆盖等问题。`let` 声明的变量拥有自己的块级作用域，且修复了 `var` 声明变量带来的变量提升问题。

## `MediaDevices.getUserMedia()`

HTML5 调用摄像头，音频媒体api

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

---

## XHTML HTML XML 联系以及区别

## Chinese

### html 和 xhtml 和 xml 的区别

1. html 即是超文本标记语言（Hyper Text Markup Language），是最早写网页的语言，但是由于时间早，规范不是很好，大小写混写且编码不规范；
2. xhtml 即是升级版的html（Extensible Hyper Text Markup Language），对html进行了规范，编码更加严谨纯洁，也是一种过渡语言，html 向 xml 过渡的语言；
3. xml 即时可扩展标记语言（Extensible Markup Language），是一种跨平台语言，编码更自由，可以自由创建标签。
4. 网页编码从 html >> xhtml >> xml 这个过程发展。

### html 与 xhtml 之间的区别

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

### 再说说为什么网页编码要从html>>xhtml>>xml这么发展？

话说早起的网页使用html语言编写的，但是它拥有三个严重的缺点：

1. 编码不规范，结构混乱臃肿，需要智能的终端才能很好的显示
2. 表现和结构混乱，不利于开发和维护
3. 不能使用更多的网络设备，比如手机、PDA等因此HTML需要发展才能解决这个问题，于是W3C又制定了XHTML，XHTML是HTML向XML 过度的一个桥梁。而xml是web发展的趋势。

## EngLish

### What are HTML, XML and XHTML?

1. HTML

    HTML was originally an application of SGML (Standard Generalized Markup Language), a sort of meta-language for making markup languages

2. XML

    XML (eXtensible Markup Language) grew out of a desire to be able to use more than just the fixed vocabulary of HTML on the web. It is a meta-markup language, like SGML, but one that simplifies many aspects to make it easier to make a generic parser.

3. XHTML

    XHTML (eXtensible HyperText Markup Language) is a reformulation of HTML in XML syntax. While very similar in many respects, it has a few key differences.

First, XML always needs close tags, and has a special syntax for tags that don’t need a close tag. In XML (including XHTML), any tag can be made self-closing by putting a slash before the code angle bracket, for example `<img src="funfun.jpg"/>`. In HTML that would just be `<img src="funfun.jpg">`

Second, XML has draconian error-handling rules.

### HTML-compatible XHTML

To enable at least partial use of XHTML, the W3C came up with something called “HTML-compatible XHTML”. This is a set of guidelines for making valid XHTML documents that can still more or less be processed as HTML

### What determines if my document is HTML or XHTML?

So what really determines if a document is HTML or XHTML? The one and only thing that controls whether a document is HTML or XHTML is the MIME type. If the document is served with a `text/html` MIME type, it is treated as HTML. If it is served as `application/xhtml+xml` or `text/xml`, it gets treated as XHTML. In particular, none of the following things will cause your document to be treated as XHTML:

+ Using an XHTML doctype declaration
+ Putting an XML declaration at the top
+ Using XHTML-specific syntax like self-closing tags
+ Validating it as XHTML

[原文链接](https://webkit.org/blog/68/understanding-html-xml-and-xhtml/)

---

## promise 错误能不能上抛 当有一个函数返回 promise 这个函数内部再调用另一个函数，这个函数也会返回 promise, 这个 promise 被 reject，那么上级 promise 会不会被reject 

```js
(async function () {
  function async1() {
    return new Promise((resolve, reject) => {
      reject('async1 error');
    })
  }

  function async2() {
    return new Promise((resolve, reject)=>{
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

**结论上级会被reject**

---

## DOM 相关知识点

### CharacterData

翻译：  
CharacterData 抽象接口（abstract interface）代表 Node 对象包含的字符。这是一个抽象接口，意味着没有 CharacterData 类型的对象。 它是在其他接口中被实现的，如 Text、Comment 或 ProcessingInstruction 这些非抽象接口。

原文：
The CharacterData abstract interface represents a Node object that contains characters. This is an abstract interface, meaning there aren't any object of type CharacterData: it is implemented by other interfaces, like Text, Comment, or ProcessingInstruction which aren't abstract.

### ProcessingInstruction

原文：  
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

---

## react 性能优化

问题：

我们应用需要每个 tab 内容显示 1000 个列表条目，每个条目显示一个文本状态和背景颜色，1000 个条目里随机每秒有一个改变文本状态。使用react渲染非常慢，一次渲染要 4~5s。

问题理解：

生成 2000 个 div，每个 div 有一个随机的字符串和背景色，每 100 毫秒随机修改其中一个 div 的字符串和背景色

尝试结果：

+ 网友
  
    [demo](https://codesandbox.io/s/l7kow2rp5l/)

+ 自己

    **待测试**

[原文链接](https://www.v2ex.com/t/519999#reply176)

---

## 深入理解Node.js垃圾回收与内存管理

Node程序运行中，此进程占用的所有内存称为**常驻内存**（Resident Set）。

常驻内存由以下部分组成：

1. 代码区（Code Segment）：存放即将执行的代码片段
2. 栈（Stack）：存放局部变量
3. 堆（Heap）：存放对象、闭包上下文
4. 堆外内存：不通过V8分配，也不受V8管理。Buffer对象的数据就存放于此。

Buffer对象本身属于普通对象，保存在堆，由V8管理，但是其储存的数据，则是保存在堆外内存，是有C++申请分配的，因此不受V8管理，也不需要被V8垃圾回收，一定程度上节省了V8资源，也不必在意堆内存限制。

**待测试**

[原文链接](https://www.jianshu.com/p/4129a3fce7bb)

---

## V8实现中，两个队列各包含不同的任务

```js
macrotasks: script(整体代码),setTimeout, setInterval, setImmediate, I/O, UI rendering

microtasks: process.nextTick, Promises, Object.observe, MutationObserver
```

[JavaScript 运行机制](https://zhuanlan.zhihu.com/p/52000508)

[原文链接](https://www.jianshu.com/p/3ed992529cfc)

---

## MVC MVP MVVM 概念

[相关文章](http://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)

[相关文章](https://juejin.im/post/593021272f301e0058273468)

---

## vue 双向绑定

[原文链接](https://jiongks.name/blog/vue-code-review/)

---

## 《nodeJS 设计模式》

[简介](https://zhuanlan.zhihu.com/p/29786710)