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