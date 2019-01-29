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

