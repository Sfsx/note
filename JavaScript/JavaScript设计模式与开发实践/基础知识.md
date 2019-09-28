# 第一部分 基础知识

## 第一章 面向对象的 JavaScript

### 1.2 多态

多态最根本的好处在于，你不必再向对象询问“你是什么类型”而后根据得到的答案调用对象的某个行为——你只要调用给行为就是了，其他的一切多状态机制都会为你安排妥当。

换句话说，多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。

```js
var googleMap = {
    show: function() {
        console.log('开始渲染谷歌地图');
    }
}

var baiduMap = {
    show: function() {
        console.log('开始渲染百度地图');
    }
}

var renderMap = function (type) {
    if (type === 'google') {
        googleMap.show();
    } else if (type === 'baidu') {
        baiduMap.show();
    }
};

renderMap('google');
renderMap('baidu');
```

可以看出来，虽然 renderMap 函数目前保持了一定的弹性，但这种弹性是很脆弱的，一旦需要替换成高德地图，那无疑必须改动 renderMap 函数。

```js
var renderMap = function (map) {
    if (map.show instanceof Function) {
        map.show();
    }
}
```

将经常需要变动的 renderMap 函数进行封装。充分利用多态性，无论什么地图都会调用他们的 show 方法。

### 1.3 封装

#### 1.3.1 封装数据

数据私有性

#### 1.3.2 封装实现

#### 1.3.3 封装类型

#### 1.3.4 封装变化

在不重新设计的情况下进行改变，找到变化并封装之。

设计模式从意图上区分，分为

+ 创建型模式
  + 创建型模式的目的是封装创建对象的变化
+ 结构型模式
  + 结构型模式的目的是封装对象之间的组合关系
+ 行为型模式
  + 行为型模式的目的是封装对象的行为变化

**通过封装变化的方式，把系统中稳定不变的部分和容易变化的部分隔离开来**，在系统的演变过程中，我们只需要替换哪些容易变化的部分，如果这些部分已经分装好，替换起来也相对容易。这个可以最大程度地保证程序的稳定性和可扩展性。

### 1.4 原型模式和基于原型继承的JavaScript对象系统

JavaScript 是**基于原型的面向对象系统**，并不是设计者因为时间匆忙，它设计起来相对简单，而是因为从一开始，设计者就没有打算在 JavaScript 中加入类的概念。

#### 1.4.1 使用克隆的原型模式

没有累的概念，每一个对象都是基于另外一个对象的克隆

#### 1.4.2 克隆是创建对象的手段

#### 1.4.3 体验Io语言

#### 1.4.4 原型编程范型的一些规则

通过原型链实现对象之间继承关系

#### 1.4.5 JavaScript中的原型继承

+ 所有数据都是对象
  + JavaScript中绝大部分数据都是对象。
+ 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
  + 先克隆 Object.prototype 对象，再进行一些额外的操作
+ 对象会记住它的原型
  + `__proto__`
+ 如果对象无法响应某个请求，他会把这个请求委托给自己的原型
  + 原型链

new 主要运算过程

```js
var objectFactory = function(){
    var obj = new Object(),    // 从Object.prototype上克隆一个空的对象
        Constructor = [].shift.call( arguments );    // 取得外部传入的构造器，此例是Person

    obj.__proto__ = Constructor.prototype;    // 指向正确的原型
    var ret = Constructor.apply( obj, arguments );    // 借用外部传入的构造器给obj设置属性

    return typeof ret === 'object' ? ret : obj;     // 确保构造器总是会返回一个对象
};
```

#### 1.4.6 原型继承和未来

ES 6 提供了 Class 语法

## 第二章 this、call 和 apply

### 2.1 this

JavaScript 的 `this` 总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环节动态绑定的，而非函数被声明时的环境。（与 ES6 的箭头函数恰恰相反，ES6 的箭头函数中的 `this` 指向定义时所在的对象，而不是使用时所在的对象）

#### 2.1.1 this的指向

1. 作为对象的方法调用
2. 作为普通函数调用
3. 构造器调用
4. Function.prototype.call 或 Function.prototype.apply

#### 2.1.2 丢失的this

### 2.2 call 和 apply

ES3 给 Function 的原型定义了两个方法，Function.prototype.call 和 Function.prototype.apply

### 2.2.2 call 和 apply 的用途

1. 改变 this 指向
2. Function.prototype.bind

   大部分浏览器都实现了内置，没有内置则可以用 apply 手动实现

   ```js
    Function.prototype.mybind = function (oThis) {
        if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
        }

        var aArgs = Array.prototype.slice.call(arguments, 1)
        var fToBind = this
        // var FNOP = function () {}
        var fBound = function () {
        return fToBind.apply(this instanceof fBound
            ? this
            : oThis, aArgs.concat(Array.prototype.slice.call(arguments))
        )
        };
        // if (this.prototype) {
        //   FNOP.prototype = this.prototype
        // }
        // fBound.prototype = new FNOP();
        fBound.prototype = this.prototype
        return fBound
    }
   ```

3. 借用其他对象的方法

    ```js
    Array.prototype.slice.call(arguments)
    ```

## 第三章 闭包和高阶函数

### 3.1 闭包

#### 3.1.1 变量的作用域

函数才有块级作用域 `{ }`

#### 3.1.3 闭包的更多作用

1. 封装变量（私有变量）
2. 延续局部变量的寿命

#### 3.1.4 闭包和面向对象

```js
var extent = function(){
    var value = 0;
    return {
        call: function(){
            value++;
            console.log( value );
        }
    }
};

var extent = extent();

extent.call();     // 输出：1
extent.call();     // 输出：2
extent.call();     // 输出：3
```

#### 3.1.5 用闭包实现命令模式

没有理解透彻 todo

#### 3.1.6 闭包与内存管理

### 3.2 高阶函数

高阶函数是指至少满足下列条件之一的函数

+ 函数可以作为参数被传递
+ 函数可以作为返回值被输出

#### 3.2.1 函数作为参数被传递

1. 回调函数
2. Array.prototype.sort

#### 3.2.2 函数作为返回值

1. 判断数据的类型

    ```js
    var isType = function( type ) {
        return function( obj ) {
            return Object.prototype.toString.call( obj ) === '[object '+ type +']';
        }
    }

    var isString = isType( 'String' );
    var isArray = isType( 'Array' );
    var isNumber = isType( 'Number' );

    console.log( isArray( [ 1, 2, 3 ] ) );     // 输出：true
    ```

2. getSingle（单例）

#### 3.2.3 高阶函数实现AOP

AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能（日志统计、安全控制、异常处理等）抽离出来，再通过“动态织入”的方式掺入业务逻辑模块中。这样做的好处首先是可以保存业务逻辑模块的纯净性和高内聚性，其次是可以很方便地复用日志统计功能等模块。

```js
Function.prototype.before = function( beforefn ) {
    var self = this;
    return function() {
        beforefn.apply(this, arguments); // 2
        // 执行原函数
        return self.apply(this, arguments); // 3
    }
}

Function.prototype.after = function( afterfn ) {
    var self = this;
    return function() {
        // 执行 before 函数
        var ret = self.apply(this, arguments); // 1
        afterfn.apply(this, arguments); // 4
        return ret // 5
    }
}

var func = function(value) {
    console.log(2, value);
}

var aop = func.before(function(value) {
    console.log(1, value);
}).after(function(value) {
    console.log(3, value);
})

func('cat')
// 1cat
// 2cat
// 3cat
```

#### 3.2.4 高阶函数的其他应用

1. curry

    ```js
    const curry = (fn, ...arr) => (...args) => (
        arg => arg.length <= fn.length
            ? curry(fn, ...arg)
            : fn(...arg)
    )([...arr, ...args])
    ```

2. uncurrying

    ```js
    Function.prototype.uncurrying = function () {
        var self = this;
        return function() {
            var obj = Array.prototype.shift.call(arguments);
            return self.apply(obj, arguments);
        }
    }

    var push = Array.prototype.push.uncurrying();

    (function() {
        push(arguments, 4);
        console.log(arguments); // [1, 2, 3, 4]
    })(1, 2, 3);
    ```

    通过 `uncrrying` 的方式，`Array.prototype.push.call` 变成了一个通用的 `push` 函数。

    下面是 `uncrrying` 的另一种实现方式

    ```js
    Function.prototype.uncrrying = function() {
        var self = this;
        return function() {
            return Function.prototype.call.apply(self, arguments);
        }
    }
    ```

3. 函数节流

    场景

    + window.onresize 事件
    + mousemove 事件
    + scroll 事件
    + 上传进度

    原理

    setTimeout

    实现

    ```js
    function throttle (fn, time) {
        var canDo = true;
        return function() {
            var self = this;
            if (!canDo) return;
            canDo = false;
            setTimeout(function() {
                fn.apply(self, arguments);
                canDo = true;
            }, time)
        }
    }
    ```

4. 分时函数

    这里的分时函数我理解为与防抖函数一致

5. 惰性加载函数

    在第一次进入分支条件后，在函数内部重写这个函数，之后就会避免不必要的分支判断。

    ```js
    var addEvent = function(elem, type, handler) {
        if (window.addEventListener) {
            addEvent = function(elem, type, handler) {
                elem.addEventListener(type, handler, false);
            }
        } else if (window.attachEvent) {
            addEvent = function(elem, type, handler) {
                elem.attachEvent('on' + type, handler);
            }
        }
    }
    ```
