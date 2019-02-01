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

目前有4个操作会忽略 enumerable 为 false 的属性
+ `for...in`
+ `Object.keys()`
+ `JSON.stringfiy()`
+ `Object.assign()`

这四个操作之中，前三个是 ES5 就有的，最后一个是 ES6 新增的。其中，只有 `for...in` 会返回继承的属性，其他三个方法都会忽略继承的属性。当只关心对象自身的属性时，尽量使用 `Object.keys()` 而不要使用 `for...in`

ES6 规定，所有 class 的原型的方法都是不可枚举的

### 5. 属性的遍历

1. `for...in`
2. `Object.keys(obj)`
3. `Object.getOwnPropertyNames(obj)`
4. `Object.getOwnPropertySymbols(obj)`
5. `Reflect.ownKeys(obj)`