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

```js
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

```js
let foo = 'outer'

function bar(func = () => foo) {
  let foo = 'inner';
  console.log(func());
}

bar(); // outer
```

#### 应用

### 2. rest 参数

`...变量名` 代替 `arguments` 对象。

### 3. 严格模式

ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显示设定为严格模式，否则会报错

### 4. name 属性

函数的 `name` 属性，返回该函数的函数名。

### 5. 箭头函数

#### 箭头函数基本用法

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

`Array.from()` 将两类对象转为真正的数组：类数组对象（array-like-object）和可遍历对象（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。**所谓类似数组的对象，本质特征只有一点，即必须有 length 属性。**

`Array.from()` 也是浅拷贝

`Array.from()` 还可以接受第二个参数，作用类似于数组的 map 方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

```js
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]

Array.form({ length: 3 }, () => ({}))
// [{}, {}, {}]
```

尤其注意上面最后一个例子得到的数组，其中每个 {} 都是独立。不同于 `new Array(3).fill({})` 这里生成的每个 {} 都是指向同一个 object，只要修改其中某一个数组中的另外两个会跟着一起变化。

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

#### `Object.assign()` 基本用法

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

### 1. Symbol概述

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

#### Set 基本用法

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

#### WeakSet 含义

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

注意调用 `resulve` 或 `reject` 并不会终结 Promise 的参数函数执行。

### 3. `Promise.prototype.then()`

`then` 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。

### 4. `Promise.prototype.catch()`

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

### 5. `Promise.prototype.finally()`

原理实现

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

### 6. `Promise.all()`

`Promise.all()` 中的参数如果不是 `Promise` 的实例，就会先调用 `Promise.resolve` 方法，将参数转化为 `Promise` 实例，再进一步处理。

### 7. `Promise.race()`

`Promise.race` 方法同样是将多个 `Promise` 实例，包装成一个新的 Pro

```js
const p = Promise.race([p1, p2, p3]);
```

上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p` 的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给 `p` 的回调函数。

### 8. `Promise.resolve()`

`Promise.resolve` 方法的参数分为四种情况。

1. 参数是一个 `Promise` 实例

    不作修改，返回该实例

2. 参数是一个 `thenable` 对象

    转化为 `Promise` 对象，然后立即执行该实例的 `then` 方法

3. 参数不是具有 `then` 方法的对象，或者根本不是对象

    返回一个新的 Promise 对象，状态为 `resolved`

4. 不带有任何参数

    同 3。返回一个新的 Promise 对象，状态为 `resolved`

### 9. `Promise.reject()`

`Promise.reject(reason)` 方法返回一个新的 Promise 实例，该实例状态为 `rejected`

reject 方法的参数会原封不动的传递给后续方法作为参数

```js
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true
```

### 10. 应用

### 11. `Promise.try()`

无论函数 `f` 是同步或者异步，都用 Promise 来处理它

```js
// 这种写法会导致 f 在本轮事件循环末尾才执行
Promise.resolve().then(f)

// async 封装
;(async () => f())()
.then(...)
.catch(...)

// new Promise() 封装
;(
  () => new Promise(
    resolve => resolve(f())
  )
)()

// 新提案
Promise.try(f)
```

## Iterator 和 for...of 循环

### 1. Iterator（遍历器）的概念

JavaScript 原有的标示 “集合” 的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了 Map 和 Set。

遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。

Iterator 的作用有三个：

1. 为各种数据结构，提供一个统一的、简便的访问接口
2. 使得结构数据成员能够按某种次序排列
3. ES6 创造了 `for...of` 循环，Iterator 接口主要提供 `for...of` 消费

Iterator 遍历过程：

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历对象本质上，就是一个指针对象。
2. 第一次调用指针对象的 `next` 方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的 `next` 方法，可以将指针指向数据结构的第二个成员。
4. 不断调用指针对象的 `next` 方法，直到它指向数据结构的结束位置。

`next` 方法返回一个对象，具有 `value` 和 `done` 两个属性，其中 `done` 属性是一个布尔值表示遍历是否结束。

### 2. 默认 Iterator 接口

ES6 规定，默认的 Iterator 接口部署在数据结构的 `Symbol.iterator` 属性。

```js
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```

原生具备 Iterator 接口的数据结构如下

+ Array
+ Map
+ Set
+ String
+ TypedArray
+ 函数的 arguments 对象
+ NodeList 对象

对于类似数组的对象（存在数值键名和`length`属性），部署 Iterator 接口，有一个简便方法，就是 `Symbol.iterator` 方法直接引用数组的 Iterator 接口。

```js
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];

[...document.querySelectorAll('div')] // 可以执行了
```

`NodeList` 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历。上面代码中，我们将它的遍历接口改成数组的`Symbol.iterator` 属性，可以看到没有任何影响。

### 3. 调用 Iterator 接口的场合

1. 解构赋值
2. 扩展运算符
3. `yield*`
4. 其他场合

    数组作为参数的场合

### 4. 字符串的 Iterator 接口

### 5. Iterator 接口与 Generator 函数

```js
let myIterator = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
}
[...myIterator] // [1, 2, 3]

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};
```

### 6. 遍历器对象的 retrun()，throw()

`return` 方法的试用场合是，如果 `for...of` 循环提前退出（通常是因为出错，或者有 `break` 语句），就会调用 `return` 方法。

```js
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}

// 情况一
for (let line of readLinesSync(fileName)) {
  console.log(line);
  break;
}

// 情况二
for (let line of readLinesSync(fileName)) {
  console.log(line);
  throw new Error();
}
```

上面代码中，情况一输出文件的第一行以后，就会执行 `return` 方法，关闭这个文件；情况二会在执行 `return` 方法关闭文件之后，再抛出错误。

### 7. `for...of` 循环

`for...of` 修复了 `for...in` 的缺陷和不足。`for...in` 循环除了遍历数组元素以外,还会遍历自定义属性。

`for...of` 不能遍历普通对象的 key 或 value（不是 Iterator ）

#### 数组

#### Set 和 Map 结构

#### 计算生成的数据结构

以下方法返回

+ `entries()`
+ `keys()`
+ `values()`

#### 类似数组的对象

DOM NodeList对象、`arguments` 对象。

#### 对象

先 `Object.keys()` 在用 `for...of` 循环

#### 与其他遍历语法的比较

`for...in` 循环有几个缺点

+ 数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
+ for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
+ 某些情况下，for...in循环会以任意顺序遍历键名。

    ```js
    const aArray = [1, 2, 3]
    aArray.name = 'demo'

    for(let index in aArray){
        console.log(`${aArray[index]}`); //Notice!!aArray.name也被循环出来了
    }
    for(var value of aArray){
        console.log(value);
    }
    ```

`for...of` 优点

+ 有着同 `for...in` 一样的简洁语法，但是没有 `for...in` 那些缺点。
+ 不同于 `forEach` 方法，它可以与`break`、`continue`和`return`配合使用。
+ 提供了遍历所有数据结构的统一操作接口。

## Generator 函数的语法

### 1. 简介

#### 基本概念

#### yield 表达式

#### 与 Iterator 接口的关系

```js
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```

### 2. next 方法的参数

遍历器对象的next方法的运行逻辑如下:

1. 遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值。

2. 下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。

3. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。

4. 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`。

`yield` 表达式本身没有返回值，或者说总是返回 `underfined`。`next` 方法可以带一个参数，该参数被当作上一个 `yield` 表达式的返回值。

### 3. `for...of` 循环

### 4. Generator.prototype.throw()

Generator 函数返回的遍历器对象，都有一个 `throw` 方法，可以在**函数体外抛出错误**，然后在 Generator **函数体内捕获**。

`throw()` 方法会自动执行一次 `next()` 方法

### 5. Generator.prototype.return()

`return` 方法，可以返回给定的值，并且终结遍历 Generator 函数。

如果 Generator 函数内部有 `try...finally` 代码块，且正在执行 `try`代码块，那么执行 `return` 方法会推迟到`finally` 代码块执行完再执行。

```js
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

### 6. `next()`、`throw()`、`return()` 方法的共同点

这三个方法本质上是同一件事，让 Generator 函数恢复执行，并使用不同的语句替换 `yield` 表达式。

+ `next()` 是将 `yield` 表达式替换成一个值
+ `throw()` 是将 `yield` 表达式替换成一个 `throw` 语句
+ `return()` 是将 `yield` 表达式替换成一个 `return` 语句

### 7. yield* 表达式

`yield*` 表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数

```js
function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
// The result
// 值为 [ 'a', 'b' ]
```

上面这段代码，存在两次遍历。

1. 是扩展运算符遍历函数 `logReturned` 返回的遍历器对象
2. `yield*` 语句遍历 `genFuncWithReturn` 返回的遍历器对象。

两次遍历的效果是叠加的，最终表现为拓展运算符遍历函数 `genFuncWithReturn` 返回的遍历器对象。但是，函数`genFuncWithReturn` 的 `return` 语句的返回值 `The result` 会返回给函数 `logReturned` 内部的 `result` 变量，因此会有终端输出。

### 8. 作为对象属性的 Generator 函数

```js
// 第一种写法
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
// 第二种写法
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

### 9. Generator 函数的 this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的 `prototype` 对象上的方法。

```js
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

var f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

### 10. 含义

1. Generator 与**状态机**

    ```js
    var clock = function* () {
      while (true) {
        console.log('Tick!');
        yield;
        console.log('Tock!');
        yield;
      }
    };
    ```

2. Generator 与协成

    Generator 函数是 ES6 对协程的实现，但属于不完全实现。Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

    如果将 Generator 函数当作协程，完全可以将多个需要互相协作的任务写成 Generator 函数，它们之间使用yield表达式交换控制权。

3. Generator 与上下文

    Generator 函数不同于普通的 JavaScript 函数。它的执行产生的上下文环境，一旦遇到 `yield` 命令，就会暂时退出堆栈，但是上下文环境并不消失，里面的所有变量和对象都会冻结在当前状态。等到对它执行 `next` 命令时，这个上下文环境优惠重新加入到调用栈，冻结的变量和对象恢复执行。

### 11. 应用

#### 异步操作的同步化表达式

Generator 函数的暂停执行的效果，意味着可以把异步操作写在 `yield` 表达式里面，等到调用 `next` 方法时再往后执行。这实际上等同于不需要写回调函数了，因为异步操作的后续操作可以放在 `yield` 表达式下面，反正要等到调用 `next` 方法时再执行。

按上述所说，Generator 就是一种回调的改写。目前没有找到良好使用的例子，感觉华而不实，具体应用看下一章

#### 控制流管理

改写回调为 Generator 函数形式

```js
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});

function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```

#### 部署 Iterator 接口

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

感觉很鸡肋

#### 作为数据结构

Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。

```js
function* doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
```

## Generator 函数的异步应用

## async 函数

### 1. async 含义

### 2. async 基本用法

### 3. 语法

#### 返回 promise 对象

#### Promise 对象状态变化

#### await 命令

内部 `try...catch` 的另一种写法

```js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```

#### 错误处理

#### async 使用注意点

1. 前面已经说过，await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中。
2. 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。

    ```js
    // 写法一
    let [foo, bar] = await Promise.all([getFoo(), getBar()]);

    // 写法二
    let fooPromise = getFoo();
    let barPromise = getBar();
    let foo = await fooPromise;
    let bar = await barPromise;
    ```

3. await命令只能用在async函数之中，如果用在普通函数，就会报错。
4. async 函数可以保留运行堆栈。

    ```js
    const a = async () => {
      await b();
      c();
    };
    ```

### 4. async 函数实现的原理

```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}

function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```

### 5. 与其他异步方法比较

### 6. 实例：按顺序完成异步操作

### 7. 异步遍历器

#### 异步遍历的接口

异步遍历器接口，部署在`Symbol.asyncIterator`属性上面

```js
async function f() {
  const asyncIterable = createAsyncIterable(['a', 'b']);
  const asyncIterator = asyncIterable[Symbol.asyncIterator]();
  console.log(await asyncIterator.next());
  // { value: 'a', done: false }
  console.log(await asyncIterator.next());
  // { value: 'b', done: false }
  console.log(await asyncIterator.next());
  // { value: undefined, done: true }
}
```

#### `for await...of`

```js
async function f() {
  for await (const x of createAsyncIterable(['a', 'b'])) {
    console.log(x);
  }
}
// a
// b
```

如果 `next` 方法返回的 Promis 对象被 `reject`，`for await...of` 就会报错，要用 `try...catch` 捕捉

```js
async function () {
  try {
    for await (const x of createRejectingIterable()){
      console.log(x);
    }
  } catch (e) {
    console.error(e);
  }
}
```

Node V10 支持异步遍历器，Stream 就部署了这个接口。

```js
// 传统写法
function main(inputFilePath) {
  const readStream = fs.createReadStream(
    inputFilePath,
    { encoding: 'utf8', highWaterMark: 1024 }
  );
  readStream.on('data', (chunk) => {
    console.log('>>> '+chunk);
  });
  readStream.on('end', () => {
    console.log('### DONE ###');
  });
}

// 异步遍历器写法
async function main(inputFilePath) {
  const readStream = fs.createReadStream(
    inputFilePath,
    { encoding: 'utf8', highWaterMark: 1024 }
  );

  for await (const chunk of readStream) {
    console.log('>>> '+chunk);
  }
  console.log('### DONE ###');
}
```

#### 异步 Generator 函数

在语法上，异步 Generator 函数就是 async 函数与 Generator 函数的结合

```js
async function* gen() {
  yield await Promise.resolve().then(()=> { return 'hello' });
}
const genObj = gen();
genObj.next().then(x => console.log(x));
// { value: 'hello', done: false }
```

JavaScript 就有了四种函数形式：普通函数、async 函数、Generator 函数和异步 Generator 函数。

#### yield* 语句

`yield*` 语句也可以跟一个异步遍历器。

## class 的基本语法

### 1. class 简介

#### 类的由来

ES6 的类，完全可以看作构造函数的另一种写法。类的数据类型就是函数，类本身就指向构造

```js
class Fsx { }

typeof Fsx // "function"
Point === Point.prototype.construcror
```

类的所有方法都定义在类的 `prototype` 属性上面。类实例上面调用的方法，其实就是调用 `prototype` 上的方法

```js
class B {}
let b = new B();

b.constructor = B.prototype.constructor
```

类的内部所有定义的方法都是不可枚举的（non-enumerable）

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

#### constructor 方法

`constructor` 方法是类的默认方法，如果没有显示定义，一个空的 `constructor` 方法会被默认添加

类必须使用 `new` 调用，否则会报错。这是它和普通构造函数的一个主要区别。普通构造函数可以不用 `new`

#### 类的实例

与 ES5 一样，实例的属性除非显式定义在其本身（即定义在 `this` 对象上），否则都是定义在原型上（即定义在 `class` 上）

#### 取值函数（getter）和存值函数（setter）

存值函数和取值函数是设置在属性的 Descriptor 对象上。可以用 `Object.getOwnPropertyDescriptor()` 获取

#### 属性表达式

`[methodName]() { }`

#### Class 表达式

```JS
let sfsx = class FSX { }
```

这个类的名字为 FSX 但只能在类的内部使用，在外部只能使用 sfsx

#### calss 注意点

1. 严格模式

    类和模块的内部，默认就是严格模式，所以不需要用 `use strict` 指定运行模式。ES6 实际上把整个语言升级到了严格模式。

2. 不存在提升

    `class` 声明不存在变量提升，为了满足继承，必须保证子类在父类之后定义

3. name 属性
4. Generator 方法

    在某个方法之前加上星号（`*`）,表示该方法是一个 Generator 函数。

5. this 的指向

    类的方法内部如果有 `this`，它默认指向累的实例。但是如果单独使用该方法，很可能会报错。

    ```js
    class Logger {
      printName(name = 'there') {
        this.print(`Hello ${name}`);
      }

      print(text) {
        console.log(text);
      }
    }

    const logger = new Logger();
    const { printName } = logger;
    printName(); // TypeError: Cannot read property 'print' of undefined
    ```

    上面代码中，`printName` 方法中的 `this`, 默认指向 `Logger` 类的实例。但是，如果将这个方法单独提取出来用，`this` 会指向该方法运行时所在的环境（由于 class 内部严格模式，所以 `this` 实际指向是 `underfined`），从而导致找不到 `print` 方法而报错

    ```js
    // 方法一 构造函数中绑定 this
    class Logger {
      constructor() {
        this.printName = this.printName.bind(this);
      }
    }

    // 方法二 使用箭头函数
    class Obj {
      constructor() {
        this.getThis = () => this;
        this.printName = (name = 'there') => this.print(`Hello ${name}`);
      }
    }

    const myObj = new Obj();
    myObj.getThis() === myObj // true

    // 方法三 使用 proxy 这方法太骚 需要仔细研究一下它的姿势
    function selfish (target) {
      const cache = new WeakMap();
      const handler = {
        get (target, key) {
          const value = Reflect.get(target, key);
          if (typeof value !== 'function') {
            return value;
          }
          if (!cache.has(value)) {
            cache.set(value, value.bind(target));
          }
          return cache.get(value);
        }
      };
      const proxy = new Proxy(target, handler);
      return proxy;
    }

    const logger = selfish(new Logger());
    ```

### 2. class 静态方法

加上 `static` 关键字。

如果静态方法包含 `this` 关键字，这个 `this` **指的是类，而不是实例**。

静态方法可以与非静态方法重名

父类静态方法，可以被子类继承

静态方法也可以从 `super` 对象上调用

### 3. 实例属性的新写法

实例的属性可以定义在 `constructor()` 方法里面的 `this` 上面，也可以定义在类的最顶层

### 4. 静态属性

```js
class Fsx {}

Fsx.prop = 1;
Fsx.prop // 1
```

目前只有这种方法可行。有提案在属性前面加上 `static` 关键字（未实现）。这种方式在 Typescript 中已经实现

### 5. 私有方法和私有属性

#### 现有解决方案

1. 在命名上加以区别，简单来说就是加入 `_` 下划线
2. 将方法移除模块，因为模块内部所有方法都是对外可见
3. 利用 `Symbol` 值的唯一性，将私有方法名字定义为一个 `Symbol` 值。

#### 私有属性提案

在属性名前加上 `#` 表示私有。（未实现）

### 6. `new.target` 属性

ES6 为 `new` 命令引入了一个 `new.target` 属性，该属性一般用在构造函数之中，返回 `new` 命令作用域的那个构造函数。如果构造函数不是通过 `new` 命令或 `Reflect.construct()` 调用的，`new.target` 会返回 `underfined`，因此这个属性可以用来确定构造函数是怎么调用的。

```js
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

## Class 的继承

### 1. Class 的继承简介

继承关键字 `extends`

子类必须在 `constructor` 方法中调用 `super` 方法，如果子类没有定义

```js
class Child extends Parent { }

// 等同于
class Child extends Parent {
  construct(...arg) {
    super(...arg);
  }
}
```

继承的构造函数中必须调用 `super()` 。并且只有调用了 `super()` 才可以使用 `this` 关键字，否则会报错。

ES5 的继承，实际是先创造子类的实例对象 `this`，再将父类的方法添加到 `this` 上面 （`Parent.apply(this)`）。ES6 的继承机制完全不一样，实质是先将父类实例对象的属性和方法，添加到 `this` 上面（先调用 `super()`），然后在用子类的构造函数修改 `this`。

### 2 `Object.getPrototypeOf()`

`Object.getPrototypeOf()` 方法可以用来从子类上获取父类

### 3. super 关键字

`super` 这个关键字，既可以当作函数使用，也可以当作对象使用。

+ 作为函数时 `super()` 相当于 `A.prototype.constructor.call(this)`
+ 作为对象时 `super` 相当于 `A.prototype`。当通过`super` 调用父类的方法时，方法内部的 `this` 指向当前子类。如果对 `super` 的某个属性赋值，就是对 `this` 的某个属性赋值

在子类的构造函数中必须调用 `super()` 否则JavaScript引擎会报错。

在子类的静态方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类。

### 4. 类的 `prototype` 属性和 `__proto__` 属性

对象的 `__proto__` 属性，指向对应的构造函数的 `prototype` 属性。Class 作为构造函数的语法糖，同时有 `prototype` 属性和 `__proto__` 属性，因此**同时存在两条继承链**。

1. 子类的 `__proto__` 属性表示构造函数的继承，总是指向父类
2. 子类的 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 `prototype`

`extends` 关键字后面可以跟多种类型的值。只要是一个有 `prototype`属性的函数，就能被继承。

以下有两种情况

1. 继承于 `Object` 类

    ```js
    class A extends Object { }

    A.__proto__ === Object // true
    A.prototype.__proto__ === Object.prototype // true
    ```

    这种情况下 `A` 就是 `Object` 的赋值，`A` 的实例就是 `Object` 的实例

2. 不存在任何继承

    ```js
    class A { }

    A.__proto__ === Function.prototype // true
    A.prototype.__proto__ === Object.prototype // true
    ```

#### 实例的 `__proto__` 属性

子类实例的 `__proto__`属性的 `__proto__`，指向父类实例的 `__proto__`

```js
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true

// 因
p2.__proto__ === ColorPoint.prototype // true
// 故
p2.__proto__.__proto__ = ColorPoint.prototype.__proto__ = Point.prototype = p1.__proto__
```

### 5. 原生构造函数的继承

+ Boolean()
+ Number()
+ String()
+ Array()
+ Date()
+ Function()
+ RegExp()
+ Error()
+ Object()

在 ES6 之前以上原生构造函数是无法继承的，比如，不能自己定义一个 `Array` 的子类。

```js
function MyArray() {
  Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
});
```

通过 `Array.apply()` 或者分配给原型对象都不行。原生构造函数会忽略 `apply` 传入的 `this`，也就是说，原生构造函数的 `this` 无法绑定，导致拿不到内部属性。

**ES5 是先建子类的实例对象 `this`，再将父类的属性添加到子类上**，由于父类构造函内部属性无法获取，导致无法继承原生的构造函数。

**ES6 是先建父类的实例对象 `this` ，再用子类的构造函数修饰 `this`**，使得父类的所有行为都可以继承。

注意，继承 `Object` 的子类，有一个行为差异

```js
// 这也说明了 consrtuctor 函数的特殊性 既可以使用 ...arg 参数结构又可以使用 arguments 关键字
class NewObj extends Object {
  constructor() {
    super(...arguments);
  }
}
var o = new NewObj({attr: true});
o.attr === true // false
```

因为 ES6 改变了构造函数的行为，一旦发现 `Object` 方法不是通过 `new Object()` 这种形式调用的，ES6 规定 `Object` 构造函数会自动忽略参数。

### 6. Mixin 模式的实现

```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```

## Module 语法

### 1. Module 概述

CommonJS 模块为运行时加载，即加载整个文件，生成一个对象，运行时在从这个对象上面取方法。

ES6 则是通过 export 命令显示指定输出代码，再通过 import 命令指定输入，而不是加载整个模块，这个称为“编译时加载”或者静态加载

### 2. 严格模式

ES6 模块自动采用严格模式，不管你有没有在模块头部加上 `"user seript"` （目前node v10.15.0 版本还没有实现 ES6 模块规则，如果要使用严格模式需要在script中加上 `"user seript"`）

+ 变量必须声明后再使用
+ 函数的参数不能有同名属性
+ 不能使用 `with` 语句
+ 不能对只读属性赋值
+ 不能使用前缀 0 表示八进制数
+ 不能删除不可删除的属性
+ 不能删除变量
+ `eval` 不会再它的外层作用域引入变量
+ `eval` 和 `arguments` 不能被重新赋值
+ `arguments` 不会自动反应函参数的变化
+ 不能使用 `arguments.callee`
+ 不能使用 `arguments.caller`
+ 禁止 `this` 指向全局对象
+ 不能使用 `fn.caller` 和 `fn.arguments` 获取函数调用的堆栈
+ 增加保留字段 `protected`, `static`, `interface`

ES6 中顶层 `this` 指向 `underfined`

### 3. export 命令

`export` 命令只能处于模块的顶层，不能处于块级作用域内。

### 4. import 命令

`import` 命令具有提升效果，会自动提升到模块的头部

```js
import 'lodash'
```

`import` 命令会运行所加载的模块，上面代码仅仅执行 `lodash` 模块，但是不输入任何值。

```js
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```

上面代码中，虽然 `foo` 和 `bar` 在两个语句中加载，但是它们对应的是同一个 `my_module` 实例。也就是说，`import` 语句是 `Singleton` 模式。

### 5. 模块的整体加载

```js
import * as circle from 'circle'
```

### 6. export default 命令

`export default` 命令只能使用一次

### 7. export 和 import 的复合写法

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

```js
export { es6 as default } from './someModule';

// 等同于
import { es6 } from './someModule';
export default es6;
```

### 8. 模块的继承

假设有一个 `circleplus` 模块，继承了 `circle` 模块。

```js
// circleplus.js

export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```

### 9. 模块常量

可以建一个专门的 `constants` 目录，将各种常量写在不同的文件里面，保存在该目录下。

### 10. import()

引入 `import()` 函数，完成动态加载。

```js
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});
```

`import()` 返回一个 `Promise` 对象。

## Module 的加载实现

### 1. 浏览器加载

#### 传统方法

```html
<script src="" defer></script>
<script src="" async></script>
```

`<script>` 标签打开 `defer` 或 `async` 属性，脚本就会异步加载

`defer`: 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行。多个 `defer` 脚本会按顺序执行

`async`：一旦下载完，渲染引擎就会终端渲染，执行这个脚本以后，再继续渲染。多个 `async` 不能保证按顺序执行

#### 加载规则

浏览器加载 ES6 模块，也是用 `<script>` 标签，但是要加入 `type="module"` 属性。

```html
<script type="module" src="./foo.js"></script>
```

浏览器对于带有 `type="module"` 的 `<script>`，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本

当然也可在 `type="module"` 中添加 `async` 属性。

对于外部模块脚本（上例是 `foo.js`），有几点需要注意。

+ 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
+ 模块脚本自动采用严格模式，不管有没有声明 `use strict`
+ 模块之中，可以使用 `import` 命令加载其他模块（`.js` 后缀不可省略，需要提供绝对 URL 或相对 URL），也可使用 `export` 命令输出对外接口。
+ 模块之中，顶层的 `this` 关键字返回 `underfined`
+ 同一个模块如果加载多次，将只执行一次。

### 2. ES6 模块与 CommonJS 模块的差异

+ CommonJS 模块输出的是值得拷贝，ES6 模块输出的是值的引用
+ CommonJS 模块是运行时加载，ES6 模块是编译时加载

### 3. Node 加载

#### Node 加载概述

由于 ES6 模块与 CommonJS 模块格式是不兼容的，目前 Node 是分开加载。

ES6 模块采用 `.mjs` 后缀的文件名。

目前，这项功能还在试验阶段。安装 Node v8.5.0 或以上版本，要用 `--experimental-modules` 参数才能打开该功能。

```sh
node --experimental-modules my-app.mjs
```

为了与浏览器的 `import` 加载规则相同，Node 的 `.mjs` 文件支持 URL 路径。

```js
import './foo?query=1'; // 加载 ./foo 传入参数 ?query=1
```

故当文件名存在 `:`、`%`、`#`、`?`等特殊字符最好进行转译。

目前，Node 的 `import` 命令只支持加载本地模块（ `file:` 协议），不支持加载远程模块。

如果脚本文件省略了后缀名。Node 会一次尝试四个后缀名：`./**.mjs`、`./**.js`、`./**.json`、`./**.node`。如果这些脚本文件都不存在，Node 就会去加载 `./foo/package.json` 的 `main` 字段指定的脚本。如果 `./foo/package.json` 不存在或者没有 `main` 字段，那么就会依次加载 `./foo/index.mjs`、`./foo/index.js`、`./foo/index.json`、`./foo/index.node`。如果以上四个文件还是都不存在，就会抛出错误。

#### 内部变量

为了保证 ES6 模块不用修改，即可在浏览器环境使用也可在服务器环境使用。Node 规定，ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量。

首先是 ES6 中 `this` 指向 `undefined`；CommonJS 模块的顶层 `this` 指向当前模块。

这些变量在 ES6 模块之中都不存在的

+ arguments
+ require
+ module
+ exports
+ __filename
+ __dirname

#### ES6 模块加载 CommonJS 模块

CommonJS 模块的输出都定义在 `module.exports` 这个属性上面。Node 的 `import` 命令加载 CommonJS 模块，Node 会自动将 `module.exports` 属性，当作模块的默认输出，即等同于 `export default xxx`

`import` 命令加载 CommonJS 模块，实际上拿到的是 `{ default: module.exports }`

```js
// 写法一
import baz from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法二
import {default as baz} from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法三
import * as baz from './a';
// baz = {
//   get default() {return module.exports;},
//   get foo() {return this.default.foo}.bind(baz),
//   get bar() {return this.default.bar}.bind(baz)
// }
```

由于 ES6 模块是编译时确定输出接口，CommonJS 模块是运行时确定输出接口，所以采用 `import` 命令加载 CommonJS 模块时，不允许采用下面的写法。

```js
import { redFile } from 'fs';
```

#### CommonJS 模块加载 ES6 模块

CommonJS 模块加载 ES6 模块，不能使用 `require` 命令，而要使用 `import()` 函数。ES6 模块的所有输出接口，会成为输入对象的属性。

```js
// es.mjs
let foo = { bar: 'my-default' };
export default foo;

// cjs.js
const es_namespace = await import('./es.mjs');
// es_namespace = {
//   get default() {
//     ...
//   }
// }
console.log(es_namespace.default);
// { bar:'my-default' }
```

### 4. 循环加载

#### CommonJS 模块的加载原理

CommonJS 的一个模块，就是一个脚本文件。`require` 命令第一次加载该脚本，就会执行整个脚本，然后生成一个内存对象。

需要用到这个模块的时候，就会到对象的 `exports` 属性上面取值。即使再次执行 `require` 命令，也不会再次执行该模块。

#### ES6 模块的循环加载

### 5. ES6 模块的转码

## 修饰器

### 1. 类的修饰器

```js
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true;
}

MyTestableClass.isTestable // true

// 可以这么理解

@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;

// 如果觉得一个参数不够用，可以在修饰器外面再封装一层函数。

function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```

注意，修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。

### 2. 方法的修饰

```js
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);
```

修饰器的本意是要“修饰”类的实例，但是这个时候实例还没生成，所以只能去修饰原型。方法的修饰器的第一个参数为**类的原型**，第二个参数为所要修饰的**属性名**，第三个参数是该**属性的描述对象**。

### 3. 为什么修饰器不能用于函数

```js
var counter = 0;

var add = function () {
  counter++;
};

@add
function foo() { }

// 上面代码的意图是执行后 counter 等于 1，但实际结果是 counter 等于 0。因为函数提升。实际执行代码如下

@add
function foo() {}

var counter
var add

counter = 0;

add = function () {
  counter++;
}
```

### 4. core-decorators.js

一个第三方模块

### 5. 使用修饰器实现自动发布事件

```js
const postal = require("postal/lib/postal.lodash");

export default function publish(topic, channel) {
  const channelName = channel || '/';
  const msgChannel = postal.channel(channelName);
  msgChannel.subscribe(topic, v => {
    console.log('频道: ', channelName);
    console.log('事件: ', topic);
    console.log('数据: ', v);
  });

  return function(target, name, descriptor) {
    const fn = descriptor.value;

    descriptor.value = function() {
      let value = fn.apply(this, arguments);
      msgChannel.publish(topic, value);
    };
  };
}
```

请参考 mobx 源码解析

### 6. Mixin

### 7. Trait

traits-decorator 第三方库

### 8. bable 转码器的支持
