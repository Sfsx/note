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

## module 模式

模块是任何强大应用程序架构中不可或缺的一部分，它通常能够帮助我们清晰地分离和组织项目中的代码单元。

在 JavaScript 中，有几种用于实现模块的方法，包括：

+ 对象字面量
+ Module 模式
+ AMD 模块
+ CommonJS 模块
+ ES6 模块化

优点：

+ 分离： 代码需要分离成小块，以便能为人所理解。
+ 可组合性： 在一个文件中编码，被许多其他文件重复使用。这提升了代码库的灵活性。
+ 解决全局变量重名问题
+ 提高复用性

### 无模块化时代  前端js代码较少

```html
<script>
if(true) {
    ...
} else {
    ...
}
for(var i=0; i< 100; i++){
    ...
}
document.getElementById('button').onClick = function () {
    ...
}
</script>
```

### 全局function模式 : 将不同的功能封装成不同的全局函数

```js
function m1(){
    //...
}
function m2(){
    //...
}
```

### 对象自变量模式 : 简单对象封装

```js
let myModule = {
    data: 'www.baidu.com',
    foo() {
    console.log(`foo() ${this.data}`)
    },
    bar() {
    console.log(`bar() ${this.data}`)
    }
}
myModule.data = 'other data' //能直接修改模块内部的数据
myModule.foo() // foo() other data
```

### IIFE模式（module模式）：匿名函数自调用(闭包)

### IIFE模式增强 : 引入依赖

```js
// module.js文件
(function(window, $) {
    let data = 'www.baidu.com'
    //操作数据的函数
    function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`)
    $('body').css('background', 'red')
    }
    function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`)
    otherFun() //内部调用
    }
    function otherFun() {
    //内部私有的函数
    console.log('otherFun()')
    }
    //暴露行为
    window.myModule = { foo, bar }
})(window, jQuery)
```

### 模块化规范

#### CommonJS规范简介

同步加载

#### AMD

异步加载

#### CMD

异步加载

#### ES6模块化

ES6在语言规格层面上实现了模块功能，是编译时加载，完全可以取代现有的CommonJS和AMD规范，可以成为浏览器和服务器通用的模块解决方案。

#### ES6模块与CommonJS模块加载区别

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

    + CommonJS 模块的输出的是值的拷贝，也就是说，一旦输出一个值，模块内部变化就影响不到这个值
    + ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候遇到 `import` 命令，就会生成一个只读引用。等到脚本真正执行的时候，再根据这个只读引用到被加载的模块里去取值。换句话说，ES6 的 `import` 有点像 Unix 系统的“符号连接”，原始值变了，`import` 加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存其中的值，模块里面的变量绑定其所在的命令。

2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

    + 运行时加载：CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上读取方法，这种加载称之为“运行时加载”。
    + 编译时加载：ES6 模块不是对象，而是通过 `export` 命令显示的指定输出的代码，`import` 时采用静态命令的形式。即在 `import` 时可以指定加载某个输出的值，而不是加载整个模块，这种加载称之为“编译时加载”。

[前端模块化详解(完整版)](https://juejin.im/post/5c17ad756fb9a049ff4e0a62)

[前端模块化一——规范详述](https://zhuanlan.zhihu.com/p/41568986)

[前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.im/post/5aaa37c8f265da23945f365c)

## MVC MVP MVVM 概念

### MVC

MVC模式的意思是，软件可以分成三个部分: model view controller

user  
-> view 触法事件  
-> controller 处理事件，触发数据更新  
-> Model 更新数据，触发页面渲染  
-> view 重新渲染

![mvc](https://pic3.zhimg.com/80/a1c71efe626f7affc1bec2be6600b67f_hd.jpg)

view 和 model 之间的观察者模式，view 观察 model，事先在此 model 上注册，以便 view 可以了解在数据 model 上发生的改变。view 和 controller 之间的策略模式

缺点

可以明显感觉到，MVC 模式的业务逻辑主要集中在 Controller，而前端的View 其实已经具备了独立处理用户事件的能力，**当每个事件都流经Controller 时，这层会变得十分臃肿**。而且 MVC 中 View 和 Controller 一般是一一对应的，捆绑起来表示一个组件，视图与控制器间的过于紧密的连接让 Controller 的复用性成了问题

### MVP

View 与 Model 不发生联系，都通过 Presenter 传递

![MVP](https://raw.githubusercontent.com/Draveness/analyze/master/contents/architecture/images/mvx/Standard-MVP.jpg)

进化为 MVP 的切入点是修改 controller-view 的捆绑关系，为了解决controller-view 的捆绑关系，将进行改造，使 view 不仅拥有 UI 组件的结构，还拥有处理用户事件的能力，这样就能将 controller 独立出来。为了对用户事件进行统一管理，view 只负责将用户产生的事件传递给controller，由 controller 来统一处理，这样的好处是多个 view 可共用同一个 controller。此时的 controller 也由组件级别上升到了应用级别，然而更新 view 的方式仍然与经典 MVC 一样：通过 Presenter 更新 model，通过观察者模式更新 view。

缺点

Presenter 作为 View 和 Model 之间的“中间人”，除了基本的业务逻辑外，还有大量代码需要对从 View 到 Model 和从 Model 到 View 的数据进行“手动同步”，**这样 Presenter 显得很重，维护起来会比较困难**。而且由于没有数据绑定，如果 Presenter 对视图渲染的需求增多，它不得不过多关注特定的视图，一旦视图需求发生改变，Presenter 也需要改动。

### MVVM

MVVM 模式，顾名思义即 Model-View-ViewModel 模式。它萌芽于2005年微软推出的基于 Windows 的用户界面框架 WPF ，前端最早的 MVVM 框架 knockout 在2010年发布。

#### Model

Model 层，对应数据层的域模型，它主要做域模型的同步。通过 Ajax/fetch 等 API 完成客户端和服务端业务 Model 的同步。在层间关系里，它主要用于抽象出 ViewModel 中视图的 Model。

#### View

View 层，作为视图模板存在，在 MVVM 里，整个 View 是一个动态模板。除了定义结构、布局外，它展示的是 ViewModel 层的数据和状态。View 层不负责处理状态，View 层做的是 数据绑定的声明、 指令的声明、 事件绑定的声明。

#### ViewModel

ViewModel 层把 View 需要的层数据暴露，并对 View 层的 数据绑定声明、 指令声明、 事件绑定声明负责，也就是处理 View 层的具体业务逻辑。ViewModel 底层会做好绑定属性的监听。当 ViewModel 中数据变化，View 层会得到更新；而当 View 中声明了数据的双向绑定（通常是表单元素），框架也会监听 View 层（表单）值的变化。一旦值变化，View 层绑定的 ViewModel 中的数据也会得到自动更新。

![MVVM](https://raw.githubusercontent.com/Draveness/analyze/master/contents/architecture/images/mvx/Model-View-ViewModel.jpg)

首先，view 和 model 不知道彼此的存在，同 MVP 一样，将 view 和 model 清晰的分离开，是一个非常松散耦合的设计。

数据绑定你可以认为是 Observer 模式或者是 Publish/Subscribe 模式，原理都是为了用一种统一的集中的方式实现频繁需要被实现的数据更新问题。

缺点

实现MVVM的开销对于简单的UI操作是“过度的”。他说，对于更大的应用来说，推广ViewModel变得更加困难。而且，他说明了非常大的应用程序中的数据绑定会导致相当大的内存消耗。

[什么是MVVM](https://segmentfault.com/a/1190000010756245)

[MVC，MVP 和 MVVM 的图示](http://www.ruanyifeng.com/blog/2015/02/mvcmvp_mvvm.html)

[浅析前端开发中的 MVC/MVP/MVVM 模式](https://juejin.im/post/593021272f301e0058273468)