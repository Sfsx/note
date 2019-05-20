# JavaScript 设计模式

## 单例模式

### 单例模式定义

确保一个类仅有一个实例，并提供一个访问它的全局访问点。

### 单例模式实现

```js
// 单例构造函数
function CreateSingleton (name) {
    this.name = name;
    this.getName();
};

// 获取实例的名字
CreateSingleton.prototype.getName = function() {
    console.log(this.name)
};
// 单例对象
var Singleton = (function(){
    var instance;
    return function (name) {
        if(!instance) {
            instance = new CreateSingleton(name);
        }
        return instance;
    }
})();

// 创建实例对象1
var a = new Singleton('a');
// 创建实例对象2
var b = new Singleton('b');

console.log(a===b);
```

### JavaScript惰性单例模式

```js
// fn 为构造函数
var singleton = function(fn) {
    var instance;
    return function() {
        return instance || (instance = fn.apply(this, arguments));
    }
};

var createLogin = function(param) {
  ...
};

// 创建实例对象1
var a = singleton(createLogin)(param);
// 创建实例对象2
var b = singleton(createLogin)(param);

console.log(a===b); // true
```

### ES6版本

```js
// http://stackoverflow.com/a/26227662/1527470
const singleton = Symbol();
const singletonEnforcer = Symbol();

class SingletonEnforcer {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot construct singleton');
    }

    this._type = 'SingletonEnforcer';
  }

  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new SingletonEnforcer(singletonEnforcer);
    }

    return this[singleton];
  }

  singletonMethod() {
    return 'singletonMethod';
  }

  static staticMethod() {
    return 'staticMethod';
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }
}

export default SingletonEnforcer;

// ...

// index.js
import SingletonEnforcer from './SingletonEnforcer';

// Instantiate
// console.log(new SingletonEnforcer); // Cannot construct singleton

// Instance
const instance3 = SingletonEnforcer.instance;

// Prototype Method
console.log(instance3.type, instance3.singletonMethod());

// Getter/Setter
instance3.type = 'type updated';
console.log(instance3.type);

// Static method
console.log(SingletonEnforcer.staticMethod());
```

[Singleton pattern in ES6](https://medium.com/@dmnsgn/singleton-pattern-in-es6-d2d021d150ae)