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