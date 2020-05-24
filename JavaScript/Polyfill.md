# Polyfill

## 对象深拷贝

简单 Array、Object 符合数据结构深度复制

```js
function deepCopy(obj) {
  if(Object.prototype.toString.call(arg) === '[object Array]') {
    var newArr = []
    for(var i = 0; i < obj.length; i++) newArr.push(deepCopy(obj[i]))
    return newArr
  } else if (Object.prototype.toString.call(arg) === '[object Object]') {
    var newObj = {}
    for(var key in obj) {
      obj.hasOwnProperty(key) && (newObj[key] = deepCopy(obj[key]))
    }
    return newObj
  } else {
    return obj
  }
}
```

复杂

```js
function checkType(obj: any): string {

  const type = Object.prototype.toString.call(obj);
  return type.slice(8, -1);
}

// 深拷贝（hash = new WeakMap()考虑循环引用的问题）
export function deepClone(obj: any, hash = new WeakMap()) : any{
  if(checkType(obj) === 'RegExp') {
    // regExp.source 正则对象的源模式文本;
    // regExp.flags 正则表达式对象的标志字符串;
    // regExp.lastIndex 下次匹配开始的字符串索引位置
    let temp =  new RegExp(obj.source, obj.flags);
    temp.lastIndex = obj.lastIndex;
    return temp;
  }
  if(checkType(obj) === 'Date') {
      return new Date(obj);
  }
  // 非复杂类型(null、undefined、string、number、symbol、boolean、function)
  if(obj === null || typeof obj !== 'object') {
      return obj;
  }
  // 还可以扩展其他类型。。。
  // 与后面hash.set()防止循环引用
  if(hash.has(obj)) {
      return hash.get(obj);
  }

  let newObj = new obj.constructor();
  hash.set(obj, newObj);
  // Object.keys(obj)类型于 for in 和 obj.hasOwnProperty
  // 是否应该拷贝自身属性（可枚举的和不可枚举的以及symbol）
  Reflect.ownKeys(obj).forEach(function(key) {
      if(typeof obj[key] === 'object' && obj[key] !== null) {
          newObj[key] = deepClone(obj[key], hash);
      }else{
          // 直接赋值
          // newObj[key] = obj[key];
          // 是否应该保留属性描述符
          Object.defineProperty(newObj, key, Object.getOwnPropertyDescriptor(obj, key));
      }
  });

  return newObj;
}
```

## async 原理

```js
function spawn(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF();
    function step(nextF) {
      let next;
      try() {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(
        function(value) {
          step(function() { return gen.next(value); });
        },
        function(e) {
          step(function() { return gen.throw(e); });
        }
      )
    }
    step(function() { return gen.next(undefined); });
  })
}
```

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

### 手动计时

```js
function throttle(fn, timeOut) {
  let last = Date.now();
  return function() {
    const now = Date.now();
    if(now - last > timeOut) {
      fn.apply(this, arguments);
      last = Date.now();
    }
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

## Object.create() 和 new 区别

### Object.create()

```js
Object.create = function(o) {
    var F = function() {}; // 隐式构造函数
    F.prototype = o;
    return new F(); // 返回一个new
}

// ES6
Object.create = function(o) {
    var newObj = {};
    Object.setPrototypeOf(b, o);
    return newObj;
}
```

### new

1. 创建一个空的对象
2. 将构造函数的 `prototype` 属性赋给新对象的 `__proto__`
3. 将步骤 1 新创建的对象作为 `this` 的上下文，并执行构造函数生成新对象
4. 当构造函数返回类型不是引用类型时（即返回类型为 `null`，`underfined`，`Number`，`String`，`Boolean`，`Symbol`类型时），返回这个新对象

```js
/**
 * 模拟实现 new 操作符
 * @param  {Function} ctor [构造函数]
 * @param  {} param [构造函数的参数]
 * @return {Object|Function|Regex|Date|Error}      [返回结果]
 */
function newOperator(ctor) {
  if (typeof ctor !== 'function') {
    throw new TypeError('newOperator function the first param must be a function')
  }
  // ES6 new.target 是指向构造函数
  newOperator.target = ctor;
  // 1.创建一个全新的对象，
  // 2.并且执行[[Prototype]]链接
  var newObj = Object.create(ctor.prototype);
  // 获得 newOperator 除去 ctor 的其余参数的数组
  var argsArr = [].slice.call(arguments, 1);
  // 3.将步骤 1 新创建的对象作为 this 的上下文，并执行构造函数生成新对象
  var ctorReturnResult = ctor.apply(newObj, argsArr);
  // 小结4 中这些类型中合并起来只有 Object 和 Function两种类型 typeof null 也是 object 所以要不等于 null，排除 null
  var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
  var isFunction = typeof ctorReturnResult === 'function';
  if(isObject || isFunction){
    return ctorReturnResult;
  }
  // 4.如果函数没有返回对象类型 Object (包含 Functoin, Array, Date, RegExg, Error)，那么 new 表达式中的函数调用会自动返回这个新的对象。
  return newObj;
}
```

### 区别

两者都能生成一个继承于构造函数的实例，但 `new` 命令需要执行构造函数，而 `Object.create()` 没有执行构造函数，`new` 创建的对象是构造函数生成的，而 `Object.create()` 创建的是一个空对象。

[面试官问：能否模拟实现JS的new操作符](https://juejin.im/post/5bde7c926fb9a049f66b8b52)

[JavaScript Object.create vs new Function() 的区别](http://fe2x.cc/2017/10/14/Object-create-and-new-JavaScript/)

## 柯里化

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

## instanceof

```js
function instanceof(child, parent) {
  let __proto__ =  Object.getPrototypeOf(child);
  const protorype = parent.prototype;
  // 最坏情况递归查到 Object.prototype = null
  while(__proto__) {
    // 两个对象指向同一个内存地址，则为同一个对象
    if(__proto__ === protorype) {
      return true;
    }
    __proto__ = Object.getPrototypeOf(__proto__);
  }
  return false;
}
```
