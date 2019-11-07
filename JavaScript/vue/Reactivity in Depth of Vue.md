# Vue 双向绑定

## 数据属性与访问器属性

```js
var obj = {name:"percy"};
console.log(obj.name);    // percy
obj.name = "zyj";
console.log(obj.name);    // zyj

console.log(Math.PI);    // 3.1415926...
Math.PI = 1234;
console.log(Math.PI);    // 3.1415926...
```

看到了吗？同样是 Object 的实例，obj 对象的属性却可以被改写，而 Math 对象的属性去不能被改写。好，让我们来码一行，从而让 obj 对象的属性也不能被改写

```js
var obj = {name:"percy"};
console.log(obj.name);    // percy

Object.defineProperty(obj,"name",{ writable:false });

obj.name = "zyj";
console.log(obj.name);    // percy
```

### 数据属性

数据属性有4个描述其行为的特性：

+ `[[Configurable]]`：表示能否通过 `delete` 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。
+ `[[Enumerable]]`：表示能否通过 `for-in` 循环返回属性。
+ `[[Writable]]`：表示能否修改属性的值。
+ `[[Value]]`：包含这个属性的数据值。读取属性值的时候，从这个位置读；写入属性值时，把新值保存在这个位置。默认值是 `undefined`。

### 访问器属性

访问器属性不包含数据值，它们包含一对儿 `getter` 和 `setter` 函数（不过，这两个函数都不是必需的）。在读取访问器属性时，会调用 `getter` 函数，在写入访问器属性时，又会调用 `setter` 函数并传入新值。

+ `[[Configurable]]`：表示能否通过 `delete` 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。
+ `[[Enumerable]]`：表示能否通过 `for-in` 循环返回属性。
+ `[[Get]]`：在读取属性时调用的函数。默认值为 `undefined`。
+ `[[Set]]`：在写入属性时调用的函数。默认值为 `undefined`。

**访问器属性不能直接定义，必须使用 `Object.defineProperty()` 来定义。**

## 工具函数

```js
// ES5 一个对象上定义一个新属性，或者修改该对象的现有属性，并返回这个对象。
Object.defineProperty(obj, prop, descriptor)
// ES5 一个对象上定义新的属性或修改现有属性，并返回该对象。
Object.defineProperties(obj, props)
// ES5 某个对象属性的描述属性
Object.getOwnPropertyDescriptor(obj, prop)
// ES8 返回指定对象所有自身属性（非继承属性）的描述对象
Object.getOwnPropertyDescriptors(obj, prop)
```

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
      configurable: true,
    get: function reactiveGetter() {
      console.log('getting ' + key + '!');
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log('setting new: ' + newVal + ' old: ' + val);
      val = newVal;
    }
  })
  return obj
}
```

## 实例

```js
var vm = new Vue({
  data: function () {
    return {
      a: 1
    }
  }
})
// `vm.a` 现在是响应式的

vm.b = 2
// `vm.b` 不是响应式的
```

## 巧妙改进

```js
var vm = new Vue({
  data: function () {
    return {
      count: 0
      a: 1
    }
  }
})
// `vm.a` 现在是响应式的

vm.count++
vm.b = 2
// 由于 `vm.count` 是响应式的，会触发视图更新，`vm.b` 也会更新
```

## Proxy

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```js
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
```

### Proxy 实例也可以作为其他对象的原型对象

```js
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
```

+ get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
+ set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
+ has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
+ deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
+ ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
+ getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
+ defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
+ preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
+ getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
+ isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
+ setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
+apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
+ construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

## AOP 编程

在软件业，AOP为Aspect Oriented Programming的缩写，意为：面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。AOP是OOP的延续，是软件开发中的一个热点，也是Spring框架中的一个重要内容，是函数式编程的一种衍生范型。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

如果把 “对象变更” 作为事件，那么我们可以在 事件发生之前 和 事件方法之后 这两个 “切面” 分别可以安插回调函数（callback），方便程序动态扩展，这属于 面向切面编程的思想。
