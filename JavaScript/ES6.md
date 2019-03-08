# ECMAScript 6

## 第5章 正则的扩展

### 3. u 修饰符

### 5. y 修饰符

y修饰符的设计本意，就是让头部匹配的标志^在全局匹配中都有效。

### 6. RegExp.prototype.sticky 属性

表示是否设置 y 修饰符

### 7. RegExp.prototype.flags 属性

返回正则表达式的修饰符

### 8. s 修饰符

正则表达式中`.`是一个特殊字符，可以匹配任意单字符，但是有两个例外。
一个是四字节的 UTF-16 字符。另一个是行终止符 `\n`

使得 `.` 可以匹配任意单个字符。

### 9 后行断言

先行断言：

+ `x` 只有在 `y` 前面才匹配
+ 正则表达式 `/x(?=y)/`

先行否定断言：

+ `x` 只有不在 `y` 前面才匹配
+ 正则表达式 `/x(?!y)/`

后行断言：

+ `x` 只有在 `y` 后面才匹配
+ `/(?<=y)x/`

后行否定断言：

+ `x` 只有不在 `y` 后面才匹配
+ `/(?<!y)x/`

### 10. Unicode 属性

写法 `\p{...}` 匹配符合 Unicode 的某种属性

```js
// 匹配希腊文字母
const regexGreekSymbol = /\p{Script=Greek}/u
regexGreekSymbol.test('π') // true
```

### 10. 具名

### 11. String.prototype.matchAll

```js
const string = 'test1test2test3';

// g 修饰符加不加都可以
const regex = /t(e)(st(\d?))/g;

for (const match of string.matchAll(regex)) {
  console.log(match);
}
```

## 第6章 数值的扩展

### 1. 二进制和八进制表示法

二进制 0b ，八进制 0o

```js
0b111110111 === 503 // true
0o767 === 503 // true
```

### 2. `Number.isFinite(), Number.isNaN()`

`Number.isFinite()` 用来检测一个数值是否为有限的，既不是 `Infinite`

`Number.isNaN()` 用来检查一个值是否为 `NaN`

### 3. `Number.parseInt(), Number.parseFloat()`

ES6 将全局方法 `parseInt()` 和 `parseFloat()` ，移植到 `Number` 对象上面，行为完全保持不变。

```js
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
```

### 4. `Number.isInteger()`

判断一个数是否为整数，但是存在很多误判，不建议使用

### 5. `Number.EPSILON`

ES6 在 `Number` 中新增一个极小常量。表示 1 与大于 1 的最小浮点数之差

`Number.EPSILON` 实际上是 JavaScript 能够表示的最小精度。误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了。

### 6. 安全整数和 `Number.isSafeInteger()`

JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。

`Number.isSafeInteger()` 则是用来判断一个整数是否落在这个范围之内。

ES6 引入了 `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 这两个常量，用来表示这个范围的上下限。

### 7. Math 对象拓展

#### `Math.trunc()`

用于除去一个数的小数部分，返回整数部分

#### `Math.sign()`

判断一个数是正数、负数还是零

#### `Math.cbrt()`

计算立方根

#### `Math.clz32()`

将参数转为32为无符号整数时，前面有多少个前导零

#### `Math.imul()`

#### `Math.fround()`

#### `Math.hypot()`

返回所有参数的平方和的平方根(目测用于计算标准差)

#### 对数方法

+ `Math.expm1()` 等同于 `Math.exp(x) - 1`
+ `Math.log1p()` 等同于 `Math.log(1 + x)`
+ `Math.log10()`
+ `Math.log2()`

#### 双曲线方法

### 8. 指数原算符

`**`

V8 引擎的指数运算符与 `Math.pow` 的实现不相同，对于特别大的运算结果，两者会有细微的差异。

## 第7章 函数的扩展

### 1. 函数参数的默认值

#### 基本用法

#### 与解构赋值默认值结合使用

#### 参数默认值的位置

#### 函数的 length 属性

指定了默认值以后，函数的 `length` 属性，将返回没有指定默认值的参数个数。

#### 作用域

一旦设置默认参数默认值，函数进行声明初始化时，参数会形成一个单独的作用域。等初始化结束，这个作用域就会消失。

#### 应用

### 2. rest 参数

`...变量名` 代替 `arguments` 对象。

### 3. 严格模式

ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显示设定为严格模式，否则会报错

### 4. name 属性

函数的 `name` 属性，返回该函数的函数名。

### 5. 箭头函数

#### 基本用法

#### 使用注意点

+ 函数体内的 `this` 对象，就是定义是所在的对象，而不是使用时所在的对象。
+ 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会跑出一个错误。
+ 不可以使用 `arguments` 对象，该对象在构造函数体内不存在。
+ 不可以使用 `yield` 命令，因此箭头函数不能用作 Generator 函数

#### 不适用场合

+ 第一个场合是定义函数的方法，且该方法内部包括this。
+ 第二个场合是需要动态this的时候，也不应使用箭头函数。

#### 嵌套箭头函数

下面是一个部署管道机制（pipeline）的例子，即前一个函数的输出是后一个函数的输入。

```js
const pipeline = (...funcs) =>
  val => funcs.reduce((a, b) => b(a), val);

const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5)
// 12
```

### 6. 双冒号运算符

函数绑定运算符是并排的两个冒号（`::`），双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境（即 `this` 对象），绑定到右边的函数上。

node环境还未实现需要bable

```js
foo::bar;
// 等同于
bar.bind(foo);
```

### 7.尾调用优化

#### 什么是尾调用

尾调用（Tail Call）：某个函数的最后一步是调用另一个函数

#### 尾调用优化

注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

#### 尾递归

函数调用自身，称为递归。函数尾调用自身，称为尾递归

递归非常消耗内存，因为需要同时保存成千上百个调用帧，很容易发生栈溢出(stack overflow)。

#### 递归函数改写

#### 严格模式

ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。

这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。

+ `func.arguments`：返回调用时函数的参数。
+ `func.caller`：返回调用当前函数的那个函数。

#### 尾递归优化实现

将递归改为循环

### 8. 函数参数的尾逗号

ES2017 允许函数的最后一个参数有逗号（trailing comma）。

## 数组的扩展

### 1. 拓展运算符

#### 含义

拓展运算符（spread）就是三个点（`...`）。将一个数组转化为逗号间隔的参数序列。

#### 代替函数的 apply 方法

#### 拓展运算符的应用

1. 复制数组

    注意这里的操作本质都是 **数组浅拷贝**

2. 合并数组

    `[...arr1, ...arr2]`

3. 与结构和赋值相结合
4. 字符串 将字符串转为真正的数组（字符串是类数组的 `object`）
5. 实现了 Iterator 接口的对象

    任何定义了遍历器（Iterator）接口的对象，都可以用拓展运算符转化为真正的数组。

    `querySelectorAll` 方法返回的是一个 `NodeList` 对象。它不是数组，而是一个类似数组的对象。这时，扩展运算符可以将其转为真正的数组，原因就在于 `NodeList` 对象实现了 Iterator 。

6. Map 和 Set 结构，Generator 函数

    ```js
    let map = new Map([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ]);

    let arr = [...map.keys()]; // [1, 2, 3]
    ```

### 2. `Array.from()`

`Array.from()` 将两类对象转为真正的数组：类数组对象（array-like-object）和可遍历对象（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

`Array.from()` 也是浅拷贝

### 3. `Array.of()`

`Array.of()` 将一组（逗号间隔的）值转化为数组。

`Array.of` 基本上可以用来替代 `Array()` 或 `new Array()`，并且不存在由于参数不同而导致的重载。它的行为非常统一。

### 4. 数组实例的 `copyWithin()`

在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。该方法会修改当前数组。

```js
Array.prototype.copyWithin(target, start = 0, end = this.length)
```

### 5. 数组实例的 `find()` 和 `findIndex()`

### 6. 数组实例的 `fill()`

### 7. 数组实例的 `entries()`，`keys()` 和 `values()`

ES6 提供三个新的方法 — — `entries()`， `keys()` 和 `values()`用于数组遍历，它们都返回一个遍历对象。

`keys()` 对键名的遍历

`valuse()` 对键值的遍历

`enterise()` 对键值对的遍历

### 8. 数组实例的 `includes()`

### 9. 数组实例的 `flat()`，`flatMap()`

`Array.prototype.flat()` 用于将嵌套数组“拉平”，变成一维数组。

参数为需要拉平的层数。

特殊参数 `Infinity` 可以无视数组层数，将其拉平为一维数组。

`Array.prototype.flatMap()` 相当于先 `map()` 在 `flat()`

### 10. 数组的空位

ES6 中的数组方法会将空位转换为 `undefined`

## 对象的扩展

### 1.属性的简洁表示法

访问器属性的简洁表示法（在 ES5 中访问器属性不能直接定义需要 `Object.defineProperty()` 方法才能定义）。

```js
const cart = {
  _wheels: 4,

  get wheels () {
    return this._wheels;
  },

  set wheels (value) {
    if (value < this._wheels) {
      throw new Error('数值太小了！');
    }
    this._wheels = value;
  }
}
```

### 2. 属性名表达式

### 3. 方法的 name 属性

如果对象的方法是一个 Symbol 值，那么 name 属性返回的是这个 Symbol 值的描述

```js
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
  [key1]() {},
  [key2]() {},
};
obj[key1].name // "[description]"
obj[key2].name // ""
```

### 4.属性的可枚举性和遍历

#### 可枚举性

目前有4个操作会忽略 enumerable 为 false 的属性

+ `for...in`
+ `Object.keys()`
+ `JSON.stringfiy()`
+ `Object.assign()`

这四个操作之中，前三个是 ES5 就有的，最后一个是 ES6 新增的。其中，只有 `for...in` 会返回继承的属性，其他三个方法都会忽略继承的属性。当只关心对象自身的属性时，尽量使用 `Object.keys()` 而不要使用 `for...in`

ES6 规定，所有 class 的原型的方法都是**不可枚举**的

#### 属性的遍历

1. `for...in`
2. `Object.keys(obj)`
3. `Object.getOwnPropertyNames(obj)`
4. `Object.getOwnPropertySymbols(obj)`
5. `Reflect.ownKeys(obj)`

### 5. `super` 关键字

`super` 关键字指向当前对象的原型对象。只能用在当前对象的方法之中。

```js
// 报错
const obj = {
  foo: super.foo
}

// 报错
const obj = {
  foo: () => super.foo
}

// 报错
const obj = {
  foo: function() {
    return super.foo
  }
}
```

这三种 `super` 的用法都会报错。其中后两种的写法是 `super` 用在一个函数里面，然后复制给 `foo` 属性。目前，只有对象方法地简写可以让 JavaScript 引擎确认，定义的是对象的方法。

这里的 `super.foo` 等同于 `Object.getPrototypeOf(this).foo` （属性）或 `Object.getPrototypeOf(this).foo.call(this)` （方法）

### 6. 对象的扩展运算符

#### 解构赋值

结构赋值的等号右边不能是 `underfined` 或 `null`。

而且**拓展运算符的**解构赋值必须是最后一个参数。

结构赋值为浅拷贝。

**拓展运算符的**结构赋值不能复制继承自原型的对象的属性。但是**单纯的**解构赋值可以。

拓展运算符后面必须是一个变量名

```js
let { x, ...{ y, z } } = o;
```

#### 扩展运算符

对象的扩展运算符（`...`）用于去除参数对象的所有可遍历属性，拷贝到当前对象之中。

对象的扩展运算符等同于使用 `Object.assign()` 方法

完整克隆对象，包括其原型属性的方法

```js
// 写法一
const clone1 = {
  __proto__: Object.getPrototypeOf(obj),
  ...obj
};

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
```

扩展运算符的参数对象之中，如果有取值函数 `get`，这个函数是会执行的。

## 对象的新增方法

### `Object.is()`

`==` 与 `===` 它们都有缺点，前者会自动转换数据类型，后者的 `NaN` 不等于自身，以及 `+0` 不等于 `-0`

ES6 提出 "Same-value equality" 算法，用来解决上述问题。 `Object.is()` 就是部署这个算法的新方法。

```js
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### `Object.assign()`

#### 基本用法

```js
const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```

#### 注意点

1. 浅拷贝
2. 同名属性替换
3. 数组处理
4. 取值函数处理

    `Object.assign()` 不会复制取值函数（`get`），只会执行函数拿到值，对值进行复制。

#### 常见用途

1. 为对象添加属性
2. 为对象添加方法
3. 克隆对象
4. 合并多个对象
5. 为属性指定默认属性

### 3. `Object.getOwnPropertyDescriptors()`

ES5 `Object.getOwnPropertyDescriptor()` 方法会返回某个对象的描述对象

ES2107 引入了 `Object.getOwnPropertyDescriptors()` 方法，会返回指定对象所有自身方法的描述对象

由于 `Object.assign()` 无法复制 `get` 和 `set` 属性。这时 `Object.getOwnPropertyDescriptors()` 方法配合 `Object.defineProperties()` 方法可以实现正确拷贝

```js
const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }
```

### 4. `__proto__` 属性，`Object.setPrototypeOf()`，`Object.getPrototypeOf()`

#### `__proto__` 属性

所有浏览器都部署这个属性。不建议使用。

使用以下函数代替  
`Object.setPrototypeOf()`,`Object.getPrototypeOf()`,`Object.create()`

#### `Object.setPrototypeOf()`

```js
Object.setPrototypeOf(object, prototype)
```

#### `Object.getPrototypeOf()`

### 5. `Object.keys()`, `Object.values`, `Object.entries()`

#### `Object.keys()`

```js
var obj = { foo: 'bar', baz: 42 };
Object.keys(obj)
// ["foo", "baz"]
```

#### `Object.values()`

```js
const obj = { foo: 'bar', baz: 42 };
Object.values(obj)
// ["bar", 42]
```

#### `Object.entries()`

```js
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]
```

### 6. `Object.fromEntries()`

`Object.fromEntries()` 是 `Object.entries()` 的逆操作，用于将键值对数组转化成对象。

```js
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```

该方法的一个用处就是配合 `URLSearchParams` 对象，将查询字符串转为对象

```js
Object.fromEntries(new URLSearchParams('foo=bar&baz=qux'))
// { foo: "bar", baz: "qux" }
```

## Symbol

### 1. 概述

属性名为字符串时容易冲突，故引入 `Symbol`

### 2. 作为属性名的 `Symbol`

`Symbol` 值作为对象属性名时，不能用点运算符。因为点运算符后面总是字符串。

在对象内部，使用 `Symbol` 值定义属性时，`Symbol` 值必须放在方括号中。

```js
let obj = {
  [s](arg) { ... }
};
```

定义常量

```js
const log = {};

log.levels = {
  DEBUG: Symbol('debug'),
  INFO: Symbol('info'),
  WARN: Symbol('warn')
};

// or

const COLOR_RED    = Symbol();
const COLOR_GREEN  = Symbol();
```

### 3. 实例：消除魔术字符串

魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或数值。良好风格的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。

### 4. 属性名的遍历

`Symbol` 作为属性名，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回

只能使用 `Object.getOwnPropertySymbols(obj)` 方法，或者 `Reflect.ownKeys` 方法。

由于以 `Symbol` 值作为名称的属性，不会被常规方法遍历到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

### 5. `Symbol.for()`, `Symbol.keyFor()`

```js
// 为了使用同一个 Symbol 值
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```

`Symbol.keyFor` 方法返回一个已登记的 `Symbol` 类型值的`key`。

```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```

### 6. 实例：模块的 Singleton 模式

Singleton 模式指的是电泳一个类，任何时候返回的都是同一个实例。

实际运用：在 Node 中模块文件可以看成是一个 Singleton 类。

```js
// mod.js
const FOO_KEY = Symbol.for('foo');

function A() {
  this.foo = 'hello';
}

if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A();
}

module.exports = global[FOO_KEY];

// index.js
const a = require('./mod.js');
console.log(a.foo);
```

### 7. 内置的 Symbol 值

#### Symbol.hasInstance

`foo instanceof Foo` 在语言内部，实际调用的是 `Foo[Symbol.instanceof](foo)`

```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true
```

#### Symbol.isConcatSpreadable

#### Symbol.species

对象的 `Symbol.species` 属性，指向一个构造函数。用于 `instanceof` 判断

#### Symbol.match

#### Symbol.replace

#### Symbol.search

#### Symbol.split

#### Symbol.iterator

#### Symbol.toPrimitive

对象的 `Symbol.toPrimitive` 属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

#### Symbol.toStringTag

`Symbol.toStringTag` 定义的是一个对象的 `Object.prototype.toString` 方法。（注意是原型上的toString方法）

对象调用 `toString` 方法返回 `[object Object]` 或 `[object Array]`，对象的这个属性可以改变 `object`后面的那个字符串

```js
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"
```

#### Symbol.unscopables

对象的 `Symbol.unscopables` 属性，指向一个对象。该对象知道了使用 `with` 关键字时，哪些属性会被 `with` 环境排除。

## Set 和 Map 数据结构

### 1.Set

#### 基本用法

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set { 1, 2, 3, 4 }

// 交集
let insersect = new Set([...a].filter(x => b.has(x)));
// Set { 2, 3 }

// 差
let defference = new Set([...a].filter(x => !b.has(x)));
// Set { 1 }
```

#### Set 实例的属性和方法

+ `add(value)`：添加某个值，返回 Set 结构本身。
+ `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
+ `has(value)`：返回一个布尔值，表示该值是否为Set的成员。
+ `clear()`：清除所有成员，没有返回值。

#### 遍历操作

+ keys()：返回键名的遍历器
+ values()：返回键值的遍历器
+ entries()：返回键值对的遍历器
+ forEach()：使用回调函数遍历每个成员

### 2.WeakSet

#### 含义

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

+ 首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
+ 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

#### 语法

+ `WeakSet.prototype.add(value)`
+ `WeakSet.prototype.delete(value)`
+ `WeakSet.prototype.has(value)`

### 3. Map

#### 含义和基本用法

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构）。但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。

Object 结构提供了 **字符串——值** 的对应

Map 结构提供了 **值——值** 的对应

#### 实例的属性和操作方法

>（1）size属性  
>（2）`set(key, value)`  
>（3）`get(key)`  
>（4）`has(key)`  
>（5）`delete(key)`  
>（6）`clear()`

#### 遍历方法

+ `keys()`
+ `values()`
+ `entries()`
+ `forEach()`

#### 与其他结构互转

Map -> Array

Array -> Map

Map -> Object

Object -> Map

Map -> JSON

JSON -> Map

### 4. WeakMap

`WeakMap` 和 `Map` 结构类似，也是用于生产键值对的集合。但有两点区别

+ `WeakMap` 只接受对象作为键名（ `null` 除外）
+ `WeakMap` 对对象的引用为弱引用

#### WeakMap 的语法

+ `get()`
+ `set()`
+ `has()`
+ `delete()`

## Proxy

### 1.概述

### 2.Proxy 实例的方法

#### get()

拦截某个属性的读取操作，可以接收三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象）

#### set()

#### apply()

`apply`方法拦截函数的调用、`call` 和 `apply` 操作。

#### has()

has 方法拦截的是 `HasProperty` 操作，而不是`HasOwnProperty` 操作

#### contruct()

拦截 `new` 命令

#### deleteProperty()

#### defineProperty()

#### getOwnPropertyDescrptor()

#### getPropertyOf()

拦截获取对象原型

#### isExtensible()

拦截 `Object.isExtensible()`

#### ownKeys()

拦截对象自身属性读取操作

#### preventExtensions()

拦截 `Object.preventExtensions()`

#### setPrototypeOf()

### 3.Proxy.revocable()

该方法可以返回一个可以取消的 Proxy 实例

### 4.this 问题

在 Proxy 代理的情况下，目标对象内部的 `this` 关键字会指向 Proxy 代理。

```js
const _name = new WeakMap();

class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get(this);
  }
}

const jane = new Person('Jane');
jane.name // 'Jane'

const proxy = new Proxy(jane, {});
proxy.name // undefined
```

## Reflect

### 1. 概述

> （1）将 `Object` 对象的一些明显属于语言内部的方法，放到 `Reflect` 对象上  
> （2）修改某些 `Object` 方法的返回结果，让其变得更合理。  
> （3）让 `Object` 操作变成函数行为。  
> （4）`Reflect` 对象的方法和 `Proxy` 对象的方法一一对应。

### 2. 静态方法

+ `Reflect.apply(target, thisArg, args)`
+ `Reflect.construct(target, args)`
+ `Reflect.get(target, name, receiver)`
+ `Reflect.set(target, name, value, receiver)`
+ `Reflect.defineProperty(target, name, desc)`
+ `Reflect.deleteProperty(target, name)`
+ `Reflect.has(target, name)`
+ `Reflect.ownKeys(target)`
+ `Reflect.isExtensible(target)`
+ `Reflect.preventExtensions(target)`
+ `Reflect.getOwnPropertyDescriptor(target, name)`
+ `Reflect.getPrototypeOf(target)`
+ `Reflect.setPrototypeOf(target, prototype)`

### 3. 实例：使用 Proxy 实现观察者模式

```js
const queueObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target. key, value, receiver);
  queueObservers.forEach(observer => observer());
}
```

## Promise 对象

### 1. Promise 的含义

### 2. 基本用法

### 3. Promise.prototype.then()

### 4. Promise.prototype.catch()

`Promise.prototype.catch()` 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名，用于指定发生错误时的回调函数。

一般来说，不要在 `then` 方法里面定义 Reject 状态的回调函数（即 `then` 的第二个参数），总是使用 `catch` 方法。理由是第二种写法可以铺货前面 `then` 方法中执行的错误，也更接近同步的写法（`try/catch`）。

```js
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```

在浏览器中 “Promise 会吃掉内部的错误” （会打印错误，但不会退出进程、终止脚本执行，2 秒之后还是会输出123。）。但是在 node 环境中，Node 有一个 `unhandleRejection` 事件，专门监听未捕获的是 `reject` 错误。并抛出错误。

```js
process.on('unhandledRejection', function (err, p) {
  throw err;
});
```

注意，Node 有计划在未来废除 `unhandledRejection` 事件。如果 Promise 内部有未捕获的错误，会直接终止进程，并且进程的退出码不为 0。

### 5. Promise.prototype.

## Iterator 和 for...of 循环

## Generator 函数的语法

## Generator 函数的异步应用

## async 函数

## class 的基本语法
