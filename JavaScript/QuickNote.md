# QucikNote

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
/**
Promise.promisify(
    function(any arguments..., function callback) nodeFunction,
    [Object {
        multiArgs: boolean=false,
        context: any=this
    } options]
) -> function
*/

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

[原文链接](https://stackoverflow.com/questions/26546352/why-would-one-use-array-prototype-foreach-callarray-cb-over-array-foreachcb)

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

## es6

没有块级作用域回来带很多难以理解的问题，比如 `for` 循环 `var` 变量泄露，变量覆盖等问题。`let` 声明的变量拥有自己的块级作用域，且修复了 `var` 声明变量带来的变量提升问题。

## `MediaDevices.getUserMedia()`

HTML5 调用摄像头，音频媒体api