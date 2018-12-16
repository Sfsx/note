# JavaScript

## 异步循环

```javascript
// 并发异步循环
let tasks = data.map(item => {
  // 一些步骤....
  return promise;
})
await Promise.all(tasks);

// 继发异步循环
for (let item of data) {
  await promise;
}
```

## 内存

    JavaScript


# JavaScript高级程序设计

## 第3章 基础数据类型

### 3.1 Null
### 3.2 Undefined
### 3.3 Boolean
### 3.4 String
### 3.5 Number
### 3.6 Object
### 3.7 Symbol

  ES6引入了一种新的原始数据类型，表示独一无二的值。它是JavaScript的第七种数据类型
  ```javascript
  var sym = new Symbol(); // TypeError
  ```
  需要注意的事 `typeof` 返回值可能是
  + 'undefined'  如果这个值未定义
  + 'string'     如果这个值是字符串
  + 'boolean'    如果这个值是布尔值
  + 'number'     如果这个值是数值
  + 'object'     如果这个值是对象或 `null`
  + 'function'   如果这个值是函数

---

## 第4章 变量，作用域和内存问题

+ 当从一个变量向另一个变量复制引用类型的值时，同样也会将存储在变量对象中的值复制一份放到
为新变量分配的空间中。不同的是，这个值的副本实际上是一个指针，而这个指针指向存储在堆中的一
个对象。复制操作结束后，两个变量实际上将引用同一个对象。
+ 函数参数传递为按值传递

---

## 第5章 引用类型

### 5.1 Object

### 5.2 Date

### 5.3 Regexp

### 5.4 Array

```javascript
// 数组类型判断
Array.isArray(value)

// 指定数组长度
let name = []
name.length = 100

let array = [1,2,3]
// 栈
array.push(4)
array.pop()

// 队列
array.push(4)
array.shift()
```

### 5.5 Function
#### 5.5.1 没有重载

```js
function addSomeNumber(num) { return num + 100 }
function addSomeNumber(num) { return num + 200 }
// 等价于
const addSomeNumber = function (num) { return num + 100 }
addSomeNumber = function (num) { return num + 200 }
```

#### 5.5.2 函数声明函数表达式

```js
// 函数声明
function addSomeNumber(num) { return num + 100 }
// 函数表达式
const addSomeNumber = function (num) { return num + 100 }
```

#### 5.5.3 作为值得函数

```js
//比较object中的某一个属性
function createComparisonFunction(propertyName) {
  return function(object1, object2){
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}

var data = [{name: "Zachary", age: 28}, {name: "Nicholas",age: 29}];

// 对数组元素的name属性进行排序

data.sort(createComparisonFunction("name"));
alert(data[0].name);  //Nicholas

// 对数组元素的age属性进行排序

data.sort(createComparisonFunction("age"));
alert(data[0].name);  //Zachary
```

#### 5.5.4 函数内部属性

1. 函数内部有两个对象：`arguments` 和 `this` 。其中 `arguments` 有一个 `callee` 的属性，该属性是一个指针，指向拥有这个 `arguments` 对象的函数

    ```javascript
    function factorial(num) {
      if (num <=1) {
        return 1;
      } else {
        return num * factorial(num-1)
      }
    }

    // 等价于 这样改写的好处是实现更松散的耦合，使函数与函数名factorial解耦，可以随意改变函数名（函数名仅是一个指向函数的指针）
    function factorial(num){
      if (num <=1) {
        return 1;
      } else {
        return num * arguments.callee(num-1)
      }
    }
    ```

2. this 引用的是函数据以执行的环境对象——或者也可以说是 `this` 值（当在网页的全局作用域中调用函数时， `this` 对象引用的就是 `window` ）

    ```javascript
    window.color = "red";
    var o = { color: "blue" };
    function sayColor(){
      alert(this.color);
    }

    sayColor(); //"red"

    o.sayColor = sayColor;
    o.sayColor();   //"blue"
    ```

3. 每个函数都包含两个非继承而来的方法：`apply()` 和 `call()`。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 `this` 对象的值
    + `call()` 第一个参数是在其中运行函数的作用域，其余参数都直接传递给函数。`(this, .., .., .., ..)`
    + `apply()` 第一个参数是在其中运行函数的作用域，另一个是参数数组。`(this, arguements)`
    + bind() 这个方法会创建一个函数的实例，其 `this` 值会被绑 定到传给 `bind()` 函数的值。
      ```javascript
      window.color = "red";
      var o = { color: "blue" };
      function sayColor() {
        alert(this.color);
      }

      sayColor();                //red

      sayColor.call(this);       //red
      sayColor.call(window);     //red
      sayColor.call(o);          //blue
      var objectSayColor = sayColor.bind(o);
      objectSayColor();    //blue
      ```

### 5.6 基本包装类型

引用类型与基本包装类型的主要区别就是对象的生存期。使用 `new` 操作符创建的引用类型的实例， 在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。这意味着我们不能在运行时为基本类型值添加属性和方法。

```javascript
var s1 = "some text";
s1.color = "red";  //执行之后被销毁
alert(s1.color);  //undefined

var value = "25";
var number = Number(value);  //转型函数
alert(typeof number);        //"number"

var obj = new Number(value); //构造函数
alert(typeof obj);           //"object"
```

#### 5.6.1 Boolean  

建议是永远不要使用 `Boolean` 对象。

#### 5.6.2 Number  

不建议直接实例化 `Number` 类型，而原因与显式创建 `Boolean` 对象一样。具体来讲，就是在使用 `typeof` 和 `instanceof` 操作符测试基本类型数值与引用类型数值时，得到的结果完全不同，如下面的例子所示。

#### 5.6.3 String

```js
// replace 第二个参数为字符串时可以使用特殊的字符序列 $$, $&, $', $`, $n, $nn 参考书中P127 
const text = "cat, bat, sat, fat";
result = text.replace(/(.at)/g, "world ($1)");
console.log(result); // "world (cat), world (bat), world (sat), world (fat)"

// replace 第二个参数也可以为函数 三个参数分别为 匹配项，匹配项的位置和原始字符串
function htmlEscape(text) {
  return text.replace(/[<>"&]/g, function(match, pos, originalText) {
    switch(match){
      case "<":                
        return "&lt;";
      case ">":                 
        return "&gt;";             
      case "&":                 
        return "&amp;";             
      case "\"":                 
        return "&quot;";         
    }                  
  }); 
} 

console.log(htmlEscape("<p class=\"greeting\">Hello world!</p>"));  //&lt;p class=&quot;greeting&quot;&gt;Hello world!&lt;/p&gt
```

### 5.7 单体内置对象

#### 5.7.1 Global 对象

+ `isNaN()`
+ `isFinite()`
+ `parseInt()`
+ `parseFloat()`
+ `encodeURI()`
+ `eval()`

#### 5.7.2 Math 对象
+ `math` 对象属性
+ `min()` 和 `max()`

  ```javascript
  // Math.max()函数原本参数为字符串
  var values = [1, 2, 3, 4, 5, 6, 7, 8];
  var max = Math.max.apply(Math, values);
  // es6写法
  max = Math.max(...values);
  ```

+ 舍入方法
  + `Math.ceil()`
  + `Math.floor()`
  + `Math.round()`

+ `random()` 方法  
  `Math.random()`方法返回大于等于 `0` 小于 `1` 的一个随机数。
  ```javascript
  // 值 = Math.floor(Math.random() * 可能值的总数 + 第一个可能的值)
  function selectFrom(lowerValue, upperValue) {
    var choices = upperValue - lowerValue + 1;
    return Math.floor(Math.random() * choices + lowerValue);
  }

  var num = selectFrom(2, 10); alert(num);   // 介于 2 和 10 之间（包括 2 和 10）的一个数值

  // 生成随机字符串
  Math.random().toString(36).substr(2)
  ```

---

## 第6章 面向对向程序设计

### 6.1 理解对象

#### 6.1.1 属性类型

1. 数据属性

    + Configurable  
    表示能否通过 `delete` 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性
    + Enumerable   
    表示能否通过 `for-in` 循环返回属性
    + Writable  
    表示能否修改属性的值
    + Value  
    表示属性的值

    ```javascript
    var person = {};
    Object.defineProperty(person, "name", {
      writable: true,   
      configurable: true,   
      Enumerable: true,    
      value: "Nicholas",
    });
    ```

    在调用 `Object.defineProperty()` 方法时，如果不指定，`configurable`、`enumerable` 和 `writable` 特性的默认值都是 `false`

2. 访问器属性

    + Configurable
    + Enumerable
    + Get
    + Set
    ```javascript
    var book = {
      _year: 2004,
      edition: 1
    };
    Object.defineProperty(book, "year", {
      Configurable: true,s
      Enumerable: true,
      get: function(){
        return this._year;
      },
      set: function(newValue){
        if (newValue > 2004) {
          this._year = newValue;
          this.edition += newValue - 2004;
        }
      }
    });

    book.year = 2005;
    console.log(book.edition);  //2
    ```

#### 6.1.2 定义多个属性

#### 6.1.3 读取属性的特性

  ```js 
  /**
  * descript即为key属性的特性，可能是数据属性或者访问属性
  */
  const descript = Object.getOwnPropertyDescriptor(obj, key)
  ```

### 6.2 创建对象

#### 6.2.1 工厂模式

```js
function createPerson(name, age, job){
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function(){
    alert(this.name);
  };
  return o;
}
var person1 = createPerson("Nicholas", 29, "Software Engineer");
```
工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）

#### 6.2.2 构造函数  
    
```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function(){
    alert(this.name);
  };
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

// 作为普通函数调用
Person("Greg", 27, "Doctor"); // 添加到 window
window.sayName(); //"Greg"
```
要创建 `Person` 的新实例，必须使用 `new` 操作符。以这种方式调用构造函数实际上会经历以下 4 个步骤：  
>(1) 创建一个新的对象  
>(2) 将构造函数的作用域传给新的对象  
>(3) 执行构造函数，为这个新对象添加属性  
>(4) 返回新的对象   

构造函数模式虽然好用，但也并非没有缺点。使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。在前面的例子中， `person1` 和 `person2` 都有一个名为 `sayName()`的方法，但那两个方法不是同一个 `Function` 的实例。这样如果创建多个实例会造成内存浪费

#### 6.2.3 原型模式

```js
function Person(){ };

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
  alert(this.name);
};
```
与构造函数模式不同的是，新对象的这些属性和方法是由所有实例共享的。换句话说，`person1` 和 `person2` 访问的都是同一组属性和同一个 `sayName()` 函数。

1. 理解原型对象  

2. 原型与`in`操作符  

3. 更简单的原型语法  

    ```js
    function Person(){ };

    Person.prototype = {
      name : "Nicholas",
      age : 29,
      job: "Software Engineer",
      sayName : function () {
        alert(this.name);
      }
    };
    /**
      * 添加不可枚举的 constructor 属性并指向 原构造函数 Person
      */
    Object.defineProperty(Person.prototype, "constructor", {
      enumerable: false,
      value: Person
    });
    ```

4. 原型的动态性  

    调用构造函数时会为实例添加一个指向初始原型的 `[[Prototype]]` 指针，此时将原型改为另外一个对象会切断构造函数与最初原型的联系，使构造函数指向新的原型。但实例还是指向最初的原型
    ```js
    function Person(){ }
    var friend = new Person();
    Person.prototype = {
      constructor: Person,
      name : "Nicholas",
    };
    friend.name; //undefined
    ```
5. 原生对象的原型

    不推荐在程序开发过程中修改原生对象的原型

6. 原型对象的问题 

    原型模式中所有属性是被很多实例共享的，对于包含基本值的属性也无伤大雅，通过在实例中添加同名属性，可以隐藏原型中对应的属性。  
    但是如果包含引用类型值的属性，会造成多个实际修改同一个引用类型值，将导致比较多的问题。
      
#### 6.2.4 组合使用构造函数模式和原型模式

构造函数用于定义实例的属性,而原型模式定义实例共享的方法

#### 6.2.5 动态原型模式

```js
function Person(name) {
  this.name = name

  if (typeof this.sayName !== 'function') {
    Person.prototype.sayName = function () {
      alert(this.name);
    };
  }
}
```

#### 6.2.6 寄生构造函数模式

```js
function Person(name) {
  var o = {}
  o.name = name;
  o.sayName = function () {
    alert(this.name);
  };
  return o;
}
var friend = new Person('Sfsx');
```
这个模式和工厂模式其实是一模一样的，就是调用的时候用 `new` 关键字。  
同工厂模式一样，无法用 `instanceof` 来判断对象的类型。不建议使用

#### 6.2.7 稳妥构造函数模式

```js
function Person(name) {
  var o = {}
  o.name = name;
  o.sayName = function () {
    alert(name);
  };
  return o;
}
var friend = Person("Nicholas", 29, "Software Engineer");
```
稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：一是新创建对象的实例方法不引用 this；二是不使用 new 操作符调用构造函数。  
无法用`instanceof`来判断对象的类型。不建议使用

### 6.3 继承

#### 6.3.1 原型链

```js
function SuperType(){
  this.property = true;
}
SuperType.prototype.getSuperValue = function(){
  return this.property;
};
function SubType(){
  this.subproperty = false;
}
//继承了 SuperType
SubType.prototype = new SuperType();
//修改 constructor 指向
SubType.prototype.constructor = SubType;
SubType.prototype.getSubValue = function (){
  return this.subproperty;
};
var instance = new SubType();
alert(instance.getSuperValue()); //true
```

`A` 类型的原型是 `B` 类型的实例，而 `B` 类型原型又是 `C` 类型的实例，那么 `A` 类型则继承了 `B` 类型和 `C` 类型原型上的所有方法。如此层层递进，则形成原型链。

1. 别忘记默认原型

    所有引用类型默认都继承了 `Object`，而这个继承也是通过原型链实现的。所有函数的默认原型都是 `Object` 的实例，因此默认原型都会包含一个内部指针，指向 `Object.prototype`。  
    **所有对象都是通过函数创建，所有函数都是对象。**
    

2. 确定原型链与实例的关系

    + `instanceof`
    + `isPrototypeOf()`

3. 谨慎地定义方法

    理解原型的继承关系，要清楚知道什么时候形成原型链，什么时候可以改写原型中的方法，注意原型中的 `constructor` 属性， `[[Prototype]]` 属性和`prototype` 属性

4. 原型链问题

    **包含引用类型值的原型属性会被所有实例共享**

#### 6.3.2 借用构造函数

**函数只不过是在特定环境中执行代码的对象，
因此通过使用 `apply()` 和 `call()` 方法也可以在（将来）新创建的对象上执行构造函数**
```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}

function SubType() {
  SuperType.call(this);
}

var instancel = new SubType();
instancel.colors.push("black");
alert(instancel.colors); //"red, blue, green, black"
```

1. 传递参数

    ```js
    function SuperType(name){
      this.name = name;
    }
    function SubType(){
      //继承了 SuperType，同时还传递了参数
      SuperType.call(this, "Nicholas");
      //实例属性
      this.age = 29;
    }
    var instance = new SubType();
    ```
    为了确保 `SuperType` 构造函数不会重写子类型的属性，可以在调用超类型构造函数后，再添加应该在子类型中定义的属性。

2. 借用构造函数的问题

    方法都在构造函数中定义，那么函数复用无从谈起
    超类型的原型中定义的方法，对子类型也是不可见的，结果所有子类都都只能使用构造函数模式。

#### 6.3.3 组合继承

组合继承，有时候也叫做伪经典继承，指的是将原型链和借用构造函数的 技术组合到一块，从而发挥二者之长的一种继承模式

```js
function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function() {
  alert(this.name);
}
function SubType(){
  //继承了 SuperType，同时还传递了参数
  SuperType.call(this, "Nicholas");
  //实例属性
  this.age = 29;
}
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
  alert(this.age);
}
var instance = new SubType();
```

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 JavaScript 中常用的继承模式。而且，`instanceof` 和 `isPrototypeOf()` 也能够用于识别基于组合继承创建的对象。  
但是**组合继承会调用2次超类型的构造函数**，改进方法看 6.3.6 这一节

#### 6.3.4 原型式继承

`Object.create()`即为原型继承。这个方法接收两个参数：一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。
```js
var superType = {
  color: ["red", "blue", "green"]
};

var subType = Object.create(superType);
subType.color.push("black");
var anotherSubType = Object.create(superType);
anotherSubType.color.push("white");
alert(anotherSubType.color) // "red, blue, green, black, white"
```
但是，当对象包含引用类型值的属性时，通过`Object.create()`创建的对象会始终共享其值，就像原型模式一样。

#### 6.3.5 寄生式继承

寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，后再像真地是它做了所有工作一样返回对象

```js
function createAnother(original){
  var clone = object(original);  //通过调用函数创建一个新对象
  clone.sayHi = function(){      //以某种方式来增强这个对象
    alert("hi");     
  };
  return clone;                  //返回这个对象
}
var person = {     
  name: "Nicholas",     
  friends: ["Shelby", "Court", "Van"]
}; 
 
var anotherPerson = createAnother(person); anotherPerson.sayHi(); //"hi"
```

#### 6.3.6 寄生组合式继承

```javascript
function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
  alert(this.name);
};

function SubType(name, age){
  SuperType.call(this, name);
  this.age = age;
}

/**
 * 跳过父类的构造函数，直接复制其原型，并修改constructor属性
 * 最后将复制的结果作为子类的原型
 */
function inheritPrototype(subType, superType){
  var prototype = object(superType.prototype);     //创建对象
  prototype.constructor = subType;              //增强对象
  subType.prototype = prototype;               //指定对象
}

inheritPrototype(SubType, SuperType);
```

这个例子的高效率体现在它只调用了一次 `SuperType` 构造函数，并且因此避免了在 `SubType.prototype` 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 `instanceof` 和 `isPrototypeOf()`。**开发人员普遍认为寄生组合式继承是引用类型理想的继承范式。**

---

## 第7章 函数表达式

+ 函数表达式的特征
+ 使用函数实现递归
+ 使用闭包定义私有变量
 
### 7.1 递归

严格模式下，不能通过脚本访问 `arguments.callee`，访问这个属性会导致错误。不过，可以使用命名函数表达式来达成相同的结果。
```js
"use strict";
var factorial = (function f(num){
  if (num <= 1){
    return 1;
  } else {
    return num * f(num-1);
  }
})
alert(f); // undefined 
```
### 7.2 闭包

**闭包是指一个函数有权访问另一个函数作用域中的变量**

#### 7.2.1 闭包与变量

+ 闭包所保存的是整个变量对象，而不是某个特殊的变量。  
+ 闭包的副作用，闭包只能取得包含函数所有变量的最后一个值。若包含函数的变量在包含函数执行过程中发生改变，闭包只能取得最终改变的结果。

```js
function createFunction() {
  var result = new Array();
  for (var i = 0; i < 10; i++) {
    resutl[i] = function () {
      return i;
    }
    return result;
  }
}
```

#### 7.2.2 关于this对象

如果要访问外部作用域中的this对象，必须将this的引用保存到另一个闭包能够访问的变量中。

#### 7.2.3 内存泄漏

闭包会引用包含另一个函数作用域中的整个活动对象（包含这个作用域中所有的变量）。若想指定内存，请将引用该内存的变量置为 `null`

### 7.3 模仿块级作用域

匿名自执行函数可以模仿块级作用域。

### 7.4 私有变量

在构造函数中定义私有变量和特权方法
```js
function Person(name){
  var age = 29;
  this.getName = function() {
    return name;
  };
  this.setName = function(value) {
    name = value;
  };
  this.getAge = function() {
    return age;
  }
}
```
但是这种方法存在构造函数模式继承所存在的问题: 针对每一个实例都会创建同样的一组新方法

#### 7.4.1 静态私有变量

```js
(function() {
  var name = "Sfsx";
  Person = function() {}
  Person.prototype.getName = function() {
    return name;
  }
})()

var student = new Person();
alert(student.getName()); // "Sfsx"
```

在非严格模式下，Person前不加var关键字，使其从私有作用域升级为全局变量。**这个模式下私有变量是所有实例共有的**

#### 7.4.2 模块模式

前面的两种模式是为自定义类型建立私有变量和特权方法。而模块模式则是为单例创建私有变量和特权方法。

```js
var person = function() {
  var name = "Sfsx";
  var age = 28;

  return {
    publicProperty: true,
    getName: function() {
      return name;
    },
    setName: function(newName) {
      name = newName;
    }
  } 
}() 
```
因为是单例所以

#### 7.4.3 增强模块模式

有人进一步改进模块模式，使其返回的单例是属于某种类型，同时还添加某种属性和方法对其加以增强。

```js
var singleton = function() {
  var name = "Sfsx";
  var age = 29;
  function isStudent() {
    reutrn false;
  }

  var object = new CustomType();
  
  object.publicProperty = true;
  object.publicGetName = function() {
    return name;
  }
  return object;
}()
```
---

## 第8章 BOM

BOM 浏览器对象模型

+ 理解 window 对象——BOM核心
+ 控制窗口、框架和弹出窗口
+ 利用 location 对象中的页面信息
+ 使用 navigation 对象了解浏览器

### 8.1 window

#### 8.1.1 全局作用域

在全局作用域中申明的变量、函数会变成 `window` 对象的属性和函数。
定义在全局作用域中的变量和函数与直接定义在 `window` 对象上的属性与函数还是有区别，`window` 对象的属性是可以通过 `delete` 删除的
```js
var age = 29;
delete window.age; // 报错
```
`var` 关键字表示在 `window` 上建立一个 `[[Configurable]]` 特性为 `false` 的属性，所以 `delete` 该属性会报错

#### 8.1.2 窗口关系及框架

#### 8.1.3 窗口位置

#### 8.1.4 窗口大小

#### 8.1.5 导航和打开窗口

#### 8.1.6 间歇调用和超时调用

+ 间歇调用：`setInterval()`
```js
var num = 0;
var max = 10;
var intervalId = null;

function incrementNumber() {
  if (num > max) {
    clearInterval(intervalId);
    alert("done");
  }
}

intervalId = setInterval(incrementNumber, 500);
``` 
+ 超时调用：`setTimeout()`
```js
var num = 0;
var max = 10;
function increamentNumber() {
  num ++;
  if(num < max) {
    setTimeout(increamentNumber, 500);
  } else {
    alert("done");
  }
}
setTimeout(increamentNumber, 500);
```
使用超时调用来模拟间歇调用是一种最佳模式，在开发环境中，后一个间歇调用有可能在在前一个间歇调用完成之前启动。所以最好不要使用间歇调用。

#### 8.1.7 系统对话框

+ `alert()`
+ `confirm()`
+ `promp()`

### 8.2 location

+ hash
+ host
+ hostname
+ href
+ pathname
+ port
+ protocol
+ serach

#### 8.2.1 查询字符串参数

#### 8.2.2 位置操作

+ `assign()`  
页面跳转 `location.assign("https://www.google.com");` 如果将 `window.location` 或 `location.herf` 赋值也会调用 `assign()` 方法。
+ `replace()`  
修改 `location` 其他属性（除 `hash` 外）也会发生页面跳转，并且能够通过后退操作回到前一个页面。可以通过调用 `replace()` 方法来改变后退的页面
+ `reload()`  
刷新页面

### 8.3 navigator

#### 8.3.1 检测插件

`navigator.plugin` 是一个数组，数组每个对象都有 `name`, `description`, `filename`, `length` 属性

但是在IE中检测插件的唯一方式就是使用专有的 `ActiveXObejct` 类型

#### 8.3.2 注册处理程序

### 8.4 screen 对象

### 8.5 history 对象

+ `history.go()`
+ `history.back()`
+ `history.forward()`

---

## 第9章 客户端检测

+ 使用能力检测
+ 用户代理检测的历史
+ 选择检测方式

### 9.1 能力检测

识别浏览器能力

#### 9.1.1 更可靠的能力检测

#### 9.1.2 能力检测不是浏览器检测

### 9.2 怪癖检测

识别浏览器特殊行为

### 9.3 用户代理检测

http herader User-Agent

#### 9.3.1 用户代理字符串的历史

1. 早期浏览器

    mosaic浏览器  
    User-Agent: `Mosaic/0.9`

2. Netspace Navigator 3 和 Internet Explorer 3

    Mozilla/版本号 (平台; 加密类型 [; 操作系统或 CPU 说明])  
    + NN  
    User-Agent: `Mozilla/3.0 (Win95; U)`  
    + IE  
    User-Agent: `Mozilla/2.0 (compatible; MSIE 3.02; Windows 95)`

3. Netspace Navigator 4 和 IE 4 ~ 8

    + NC  
    User-Agent: `Mozilla/4.0 (Win98; I)`
    + IE 4  
    User-Agent: `Mozilla/4.0 (compatible; MSIE 4.0; Windows 98)`
    + IE 9 兼容模式  
    User-Agent: `Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)`

4. Gecko

    Gecko 是 Firefox 的呈现引擎。当初的 Gecko 是作为通用 Mozilla 浏览器的一部分开发的，而第一个采用 Gecko 引擎的浏览器是 Netscape 6。

    Mozilla/Mozilla 版本号 (平台; 加密类型; 操作系统或 CPU; 语言; 预先发行版本) Gecko/Gecko 版本号 应用程序或产品/应用程序或产品版本号

    + Windows XP 下的 Firefox 2.0.0.11  
    User-Agent: `Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11`

5. WebKit

    2003 年， Apple 公司宣布要发布自己的 Web 浏览器，名字定为 Safari。 Safari 的呈现引擎叫 WebKit，是 Linux 平台中 Konqueror 浏览器的呈现引擎 KHTML 的一个分支。几年后， WebKit 独立出来成为了一个开源项目，专注于呈现引擎的开发。

    + Mac OS X 下的 Safari  
    User-Agent: `Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/124 (KHTML, like Gecko)Safari/125.1`

#### 9.3.2 用户代理字符串检查技术

#### 9.3.3 完整代码

#### 9.3.4 使用方法

---

## 第10章 DOM

**DOM(文档对象类型) 是针对html和xml文档的一个 API。它提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构，样式和内容。DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。简言之，它会将 web 页面和脚本或程序语言连接起来。**

+ 理解包含不同层次的dom
+ 使用不同的节点类型
+ 克服浏览器兼容问题以及各种缺陷

### 10.1 节点层次

#### 10.1.1 Node 类型

`DOM1` 定义了一个 `Node` 接口，该接口将由 `DOM` 中的所有节点类型实现。`Node` 对象是整个 `DOM` 的主要数据类型。这个 `Node` 接口在 `JavaScript` 中是作为node类型实；除IE外所有浏览器都可以访问这个类型。`JavaScritp` 中的所有节点类型都继承自 `node` 接口，所以他们都共享着相同的属性和方法

+ `Node.ELEMENT_NODE(1)`
+ `Node.ATTRIBUTE_NODE(2)`
+ `Node.TEXT_NODE(3)`
+ `Node.CDATA_SECTION_NODE(4)`
+ `Node.ENTITY_REFERENCE_NODE(5)`
+ `Node.ENTITY_NODE(6)`
+ `Node.PROCESSING_INSTRUCTION_NODE(7)`
+ `Node.COMMENT_NODE(8)`
+ `Node.DOCUMENT_NODE(9)`
+ `Node.DOCUMENT_TYPE_NODE(10)`
+ `Node.DOCUMENT_FRAGMENT_NODE(11)`
+ `Node.NOTATION_NODE(12)`

1. `nodeName` 和 `nodeValue` 属性
2. 节点关系
3. 操作节点
    
    + `appendChild(newNode)`
    + `insertBefor(newNode, someNode)`
    + `replaceChild(newNode, someNode)`

4. 其他方法

#### 10.1.2 Document 类型

`JavaScript` 通过 `Document` 类型表示文档。 在浏览器中 `Document` 对象是 `HTMLDocument` 的一个实例，表示整个 `HTML` 页面。而且 `Document` 对象是 `window` 的一个属性。`Document` 节点具有以下特征：

+ nodeType `9`
+ nodeName `"#document"`
+ nodeValue `null`
+ parentNode `null`

1. 文档的子节点

    `document`
    + `documentElement` -> `<html>`
    + `firstChild` -> `<html>`
    + `childNodes[0]` -> `<html>`
    + `body` -> `<body>`
    + `doctype` -> `<!DOCTYPE>`

2. 文档信息

    作为 `HTMLDocument` 的一个实例，`document` 对象还有一些标准的 `Document` 对象所没有的属性。   
    + `title` -> 浏览器标签标题
    + `URL` -> 地址栏 url
    + `domain` -> 域名
    + `referrer` -> 来源页面 url

3. 查找元素

    以下三个方法均返回 `HTMLCollectioin` 存在性能问题比较耗时，避免多次调用
    + `getElementById()`
    + `getElementsByTagName()`
    + `getElementsByName()`
    
4. 特殊集合

    除了属性和方法，`document` 对象还有一些特殊的集合。这些集合都是 `HTMLCollection` 对象， 为访问文档常用的部分提供了快捷方式

5. `DOM` 一致性检测

    由于 `DOM` 分为多个级别，也包含多个部分，因此检测浏览器实现了 `DOM` 的哪些部分就十分必要 了。`document.implementation` 属性就是为此提供相应信息和功能的对象，与浏览器对 DOM的实现 直接对应。DOM1级只为 `document.implementation` 规定了一个方法，即 `hasFeature()`。这个方 法接受两个参数：要检测的 DOM功能的名称及版本号。如果浏览器支持给定名称和版本的功能，则该 方法返回 `true`，如下面的例子所示

6. 文档写入

#### 10.1.3 Element 类型

`Element` 类型用于表现XML或HTML元素，提供了对元素标签和子节点特性的访问。`Element` 具有以下特征：

+ nodeType `1`
+ nodeName 元素标签名
+ nodeValue `null`
+ parentNode `Document` 或 `Element` 

1. HTML 元素

    所有 `HTML` 元素都由 `HTMLElement` 类型表示，不是直接通过这个类型，也是通过它的子类型来表示。`HTMLElement` 类型直接继承自 `Element` 并添加了一些属性。添加的这些属性分别对应于每个 `HTML` 元素中都存在的下列标准特性

    + id
    + title
    + lang
    + dir 语言方向
    + className

2. 取得特性

    `getAttribute()`

3. 设置特性

    `setAttribute()`

4. `attribute` 属性

    `attributes` 属性中包含一个 `NamedNodeMap`，与 `NodeList` 类似，也是一个“动态”的集合。元素的每一个特性都由一个 `Attr` 节点表示，每个节点都保存在 `NamedNodeMap` 对象中。

5. 创建元素
6. 元素中的子节点

#### 10.1.4 Text 类型

文本节点由 `Text` 类型表示，包含的是可以照字面解释的纯文本内容。纯文本可以包含转义后的 `html` 代码，但不能包含 `html` 代码，`Text` 节点具有以下特征：
+ nodeType 3
+ nodeName "#text"
+ nodeValue 节点所包含的文本
+ parentNode Element
+ 没有子节点
+ `appendData(text)`
+ `deleteData(offset, count)`
+ `insertData(offset, text)`
+ `replaceData(offset, count, text)`
+ `splitText(offset)`
+ `substringData(offset, count)`

在默认情况下，每个可以包含内容的元素最多只能有一个文本节点，而且必须确实有内容存在。来看几个例子。

```html
<!-- 没有内容，也就没有文本节点 -->
<div></div>
<!-- 有空格，因而有一个文本节点 -->
<div> </div>
<!-- 有内容，因而有一个文本节点 -->
<div>Hello World!</div>
```

1. 创建文本节点

    ```js
    var element = document.createElement("div"); element.className = "message"; 
    
    var textNode = document.createTextNode("Hello world!"); 
    element.appendChild(textNode); 
    
    document.body.appendChild(element);
    ```

2. 规范化文本节点

    `element.normalize()` 合并element中相邻文本节点

3. 分割文本节点

    `element.splitText(5)` 切割文本节点

#### 10.1.5 Comment 类型

注释在DOM中是通过 `Comment` 类型来表示的。`Commnet` 具有一下特征：
+ nodeType 8
+ nodeName "#comment"
+ nodeValue 注释的内容
+ parentNode Element 或者 Document
+ 没有子节点

`Comment` 类型与 `Text` 类型继承自相同的基类

`document.createComment()` 并为其传递注释文本也可以创建注释节点

#### 10.1.6 CDATASection 类型

`CDATASection` 类型只针对基于 `XML` 的文档，表示的是 `CDATA` 区域。与 `Comment` 类似，`CDATASection` 类型继承自 `Text` 类型，因此拥有除 `splitText()` 之外的所有字符串操作方法。`CDATASection` 具有以下特征：
+ nodeType 4
+ nodeName "#cdata-section"
+ nodeValue CDATA 区域中的内容
+ parentNode Element 或 Document
+ 没有子节点

在 `XML` 文档中只有 `document.createCDATASection()` 来创建

#### 10.1.7 DocumentType 类型

`DocumentType` 在浏览器中并不常用，仅有 Fiefox、Safari和Opera支持。`DocumentType`包含着与文档的doctype有关的所有信息，它具有一下特性：
+ nodeType 10
+ nodeName doctype 的名称
+ parentNode Document
+ 不支持子节点

在 `DOM1` 中，`DocmentType` 不能动态创建，而只能通过解析文档代码的方式来创建。浏览器会把 `DocumentType` 对象储存在 `document.doctype` 中。这个对象，只有name属性是有用的，其中保存着文档的类型名称，也就是 `<!DOCTYPE` 之后的文本

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<script type="text/javascript">
  alert(document.doctype.name); //"HTML"
</script>
```

#### 10.1.8 DocumentFragment 类型

在所有节点类型中，只有 `DocumentFragment` 在文档中没有对应的标记。`DOM` 规定文档片段是一种 “轻量级” 的文档，可以包含和控制节点。`DocumentFragment` 节点具有一下特征：
+ nodeValue 11
+ nodeName "#document-fragment"
+ nodeValue null
+ 子节点 Element Comment Text CDATASection EntityReference或 ProcessingInstruction

`DocumentFragment` 类似一个仓库，可以在里面保存将来可能会添加到文档中的节点。假设我们要向 `<ul>` 元素添加三个列表项，就可以将三个列表项存在`DocumentFragment` 中，在一次性添加到 `<ul>` 元素中避免浏览器过度渲染。

#### 10.1.9 Attr 类型

元素的特性在 `DOM` 中以 `Attr` 类型表示。在所有浏览器中都可以访问 `Attr` 类型的构造函数和原型。特性就是存在与元素的 `attributes` 属性中的节点。特性节点具有以下特征：
+ nodeType 2
+ nodeName 特性的名称
+ nodeValue 特性的值
+ parentNode null
+ 在html中没有子节点
+ 在xml中子节点可以是 Text 或 EntityReference

他们也是节点，但是特性却不被认为是 `DOM` 文档树中的一部分。`Attr` 对象有三个属性 `name`, `value`, `specified`

### 10.2 DOM操作技术

#### 10.2.1 动态元素脚本

创建动态脚本有两种方式: 插入外部文件和直接插入 `JavaScript` 代码

```js
function loadScript(url) {
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.src = url;
  // script.text = "function sayHi(){alert('hi');}"
  document.body.appendChild(script);
}
```

#### 10.2.2 动态样式

动态加载不存在的样式

#### 10.2.3 操作表格

#### 10.2.4 使用NodeList

+ `NodeList`， `NameNodeMap`， `HTMLCollection` 这三者是动态的，每当文档发生变化的时候，这三者都会得到更新。
+ `document.getElementsByTagName("div")` 将获取文档中所有 `<div>` 元素的 `HTMLCollection`。由于这个集合是 “动态的”，因此只要有 `<div>` 被添加到页面中，这个元素也会被添加到集合中。
+ 尽量减少 `NodeList` 的访问次数，每次访问都会运行一次基于文档的查询。所以可以考虑将其缓存起来。

---

## 第11章 DOM 扩展

+ 理解 Selectors API
+ 使用 HTML5 DOM 扩展
+ 了解专有 DOM 扩展

### 11.1 选择符API

`Jquery` 的核心就是通过CSS选择符查询 DOM 文档获得元素引用，从而抛开`getElementById()` 和 `getElementByTagName()`
 
`Selectors API` 是由W3C发起制定的一个标准，致力于让浏览器支持元素 `CSS` 查询。所有实现这一功能的 `JavaScript` 库都会写一个基础 `CSS` 解析器，然后在使用以有 `DOM` 方法并查询文档并找到匹配的节点。但是现在这个解析功能变成原生 `API` 之后，解析和查询操作可以由浏览器内部通过编译后的代码来完成，极大的改善了性能。

#### 11.1.1 `querySelector()`方法

```js
//取得 body 元素
var body = document.querySelector("body"); 
 
//取得 ID 为"myDiv"的元素
var myDiv = document.querySelector("#myDiv"); 
 
//取得类为"selected"的第一个元素
var selected = document.querySelector(".selected"); 
 
//取得类为"button"的第一个图像元素
var img = document.body.querySelector("img.button");
```

#### 11.1.2 `querySelectAll()`方法

接受参数和 `querySelector()` 一样，但返回是一个 `NodeList` 的实例

具体来说，返回的值实际上是带有所有属性和方法的 `NodeList`，而其底层实现则类似于一组元素的快照，而非不断对文档进行搜索的动态查询。这样实现可以避免使用 `NodeList` 对象通常会引起的大多数性能问题

#### 11.1.3 `matchesSelector()`方法

`Selectors API Level 2` 规范为 `Element` 类型新增了一个方法 `matchesSelector()`。这个方法接受一个参数 `CSS` 选择符，如果调用元素与选择符匹配，返回 `true` 否则 `false`。

#### 11.2 元素遍历

对于元素之间的空格，不同浏览器处理方式不一样，导致使用 `childNodes` 和 `firstChild` 等属性时行为不一致

`Element Traversal API` 为 `DOM` 添加5个特性：
+ childElementCount
+ firstElementChild
+ lastElementChild
+ previousElementSibling
+ nextElementSibling

### 11.3 HTML5

本节重点介绍 HTML5 与 DOM 相关的内容

#### 11.3.1 与类相关的扩充

1. `getElementByClassName()`  
   
    在 `document` 对象上调用会返回与类名匹配的所有元素，在元素上调用会返回后代元素中匹配的元素。返回为 `NodeList` 故该方法存在性能问题

2. classList 属性

    `classList` 属性是新集合类型 `DOMTokenList` 的实例。存储元素的 `className` 中所有的类名
    + `length`
    + `add(value)`
    + `contains(value)`
    + `remove(value)`
    + `toggle(value)`

#### 11.3.2 焦点管理

+ `document.activeElement` 这个属性返回当前 `DOM` 中获得焦点的元素。文档加载期间值为null，文档刚加载完成值为 `document.body`
+ `document.hasFocus()` 

#### 11.3.3 HTMLDocument 变化

HTML5 扩展了 HTMLDocument, 增加了新功能

1. `document.readyState` 属性——文档加载状态 
    + loading 文档正在加载
    + complete 文档加载完成

2. `document.compatMode` 属性——兼容模式
    + CSS1Compat 标准模式渲染
    + BackCompat 兼容模式渲染

3. `document.head` 属性——`<head>`标签

#### 11.3.4 字符集属性

`document.charset` 这个属性的值为 `"UTF-16"`，但可以通过 `<meta>` 元素、响应头部或直接设置 `charset` 属性修改这个值。

#### 11.3.5 自定义数据属性

+ HTML5 规定可以为元素添加非标准属性。但是属性名要加上前缀 `data-` 目的是为元素提供渲染无关的信息
+ 可以通过元素的 `dataset` 属性访问，`dataset` 属性的
值是 `DOMStringMap` 的一个实例。内部是键值对

#### 11.3.6 插入标记

1. `innerHTML` 属性

    + 读 `innerHTML` 返回元素所有子节点
    + 写 `innerHTML` 的值会被解析为 `DOM` 子树，替换调用元素原来的所有子节点。
    + 插入`<script>`元素后脚本并不会被执行。
    + `<col>`、 `<colgroup>`、`<frameset>`、 `<head>`、 `<html>`、 `<style>`、 `<table>`、 `<tbody>`、 `<thead>`、 `<tfoot>`和`<tr>`不支持 `innerHTML` 属性

2. `outerHTML` 属性

    + 读 `outerHTML` 返回当前元素及所有子节点的 `HTML` 标签
    + 写 `outerHTML` 会根据指定的 HTML 字符串生成 `DOM` 树，并替换当前元素

3. `insertAdjacentHTML()` 方法

    两个参数：插入位置和要插入的 HTML 文本

4. 内存与性能问题

    使用本节介绍的方法替换子节点可能会导致浏览器的内存占用问题，尤其是在 IE 中，问题更加明显。在删除带有事件处理程序或者引用其他 `JavaScript` 对象子树时，就有可能导致内存占用问题。当元素带有事件处理程序（或者引用了一个 `JavaScript` 对象作为属性），当元素被上述方法删除后，元素与处理程序（或 `JavaScript` 对象）之间的绑定程序并没有从内存中一并删除。如果该情况频繁出现，页面占用内存数就会明显增加。
    最好在删除前，先手动删除元素绑定的处理事件或者元素引用的`JavaScript` 对象。

#### 11.3.7 `scrollIntoView()` 方法

`scrollIntoView()`可以在所有 `HTML` 元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现在视口中。如果给这个方法传入 `true` 作为参数，或者不传入任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。如果传入 `false` 作为参数，调用元素会尽可能全部出现在视口中，（可能的话，调用元素的底部会与视口顶部平齐。）不过顶部不一定平齐

### 11.4 专有扩展

不同的浏览器都会向 `DOM` 添加专有扩展，以弥补功能上的不足，这些专有扩展中就有一部分在HTML5规范中成为标准。

#### 11.4.1 文档模式

`IE8` 引入了一个新的概念叫"文档模式"(`document mode`)。页面的文档模式决定了可以使用什么功能。换句话说，文档模式决定了你可以使用哪个级别的 `CSS`，可以在 `JavasCript` 中使用哪些 `API`，以及如何对待文档类型(`doctype`)
```html
<meta http-equiv="X-UA-Compatible" content="IE=IEVersion"> 
``` 
`document.documentMode ` 可以确定当前页面使用的是什么文档模式

#### 11.4.2 `children` 属性

是 `HTMLCollection` 的实例，只包含元素中同样还是元素的子节点，除此之外和 `childNodes` 没有什么区别。（当元素的子节点中间有空格时 `childNodes` 会将空白符计数为文本节点）

#### 11.4.3 `contains()`

判断一个节点是不是另一个节点的后代
```js
alert(document.documentElement.contains(document.body));    //true 
```
`DOM3` 中的 `compareDocumentPosition()` 也能够确定节点间的关系。

#### 11.4.4 插入文本

`innerHTML` 和 `outerHTML` 已经被 `HTML5` 纳入规范。 但另外两个插入文本的专有属性 `innerText` 和 `outerText` 没有被 `HTML5` 看中。
1. `innerText` 属性

    设置该属性后会替换调用元素的所有内容（元素下原有的子节点都会被替换成文本，并且会过滤HTML标签）。设置 `innerText` 永远只会生成当前节点的一个子文本节点
    ```js
    div.innerText = div.innerText;
    ``` 
    能够清除 div 下所有子节点。

2. `outerText` 属性

    除了作用范围扩大到包含调用他的节点之外，`outerText` 与 `innerText` 基本没有太大的区别。

#### 11.4.5 滚动

除 HTML5 的 `scrollIntoView()` 之外的滚动方法。他们都是对 `HTMLElement` 类型的扩展，因此在所有元素中都能调用。

+ `scrollIntoViewIfNeeded(alignCenter)`:  
  当前元素在视口中不可见的情况下，才滚动浏览器窗口或容器元素，直至元素可见。如果元素可见则什么都不做。如果将可选的  `alignCenter` 参数设置为 `true`，则表示尽量将元素显示在视口中部（垂直方向）。 
+ `scrollByLine(lineCount)`:  
  将元素的内容滚动指定的高度，lineCount可以是正值也可以是负值。
+ `scrollByPage(pageCount)`:  
  将元素的内容滚动指定的页面高度，具体高度由元素而定。

注意 `scrollIntoView()` 和 `scrollIntoViewIfNeeded()` 的作用对象是元素的容器，而 `scrollByLines()` 和 `scrollByPages()` 影响的则是元素自身。

## 第12章 DOM2 和 DOM3

+ DOM2 和 DOM3 的变化
+ 操作样式的DOM API
+ DOM遍历与范围

DOM1 主要定义的是 HTML 和 XML 文档的底层结构。DOM2 和 DOM3 则在这个结构的基础上引入了更多交互能力，也支持更高级的 XML 特性。
DOM2 模块：
+ DOM2 核心
+ DOM2 视图
+ DOM2 事件
+ DOM2 遍历和范围
+ DOM2 HTML

### 12.1 DOM 变化

本章只讨论那些已经有浏览器实现的部分，任何浏览器都没有实现的部分不做讨论

#### 12.1.1 针对XML命名空间的变化

有了 `XML` 命名空间，不同 `XML` 文档的元素就可以混合在一起，共同构成良好的文档。`HTML` 不支持 `XML` 命名空间，但 `XHTML` 支持 `XML` 命名空间。本节主要介绍 `XHTML`

```html
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xhtml:head>
    <xhtml:title>Example XHTML page</xhtml:title>
  </xhtml:head>
  <xhtml:body xhtml:class="home">
    Hello world!
  </xhtml:body>
</xhtml:html>
```
这是一个 `XHTML` 命名空间，其中 `xhtml` 为命名空间前缀（非必需）。该命名空间是 `http://www.w3.org/1999/xhtml` 由 `xmlns` 来指定

1. `Node` 类型变化

    在 `DOM2` 中，`Node` 类型包含下列特定于命名空间的属性
    + localName 不带命名空间前缀的节点名称
    + namespaceURI 命名空间URI(default: null)
    + prefix 命名空间前缀(default: null)

2. `Document` 类型变化

    新增方法：
    + `createElementNS(namespaceURI, tagName)`
    + `createAttributeNS(namespaceURI, attributeName)`
    + `getElementByTagNameNS(namespaceURI, tagName)`

3. `Element` 类型变化

    新增方法
    + `getAttributeNs(namespaceURI, localName)`
    + `getAttributeNodeNS(namespaceURI, localName)`
    + `getElementsByTagNameNS(namespaceURI, tagName)`
    + `hasAttributeNS(namespaceURI, localName)`
    + `removeAttriubteNS(namespaceURI, localName)`
    + `setAttributeNS(namespaceURI, qualifiedName, value)`
    + `setAttributeNodeNS(attNode)`

4. `NameNodeMap` 类型变化

    新增方法
    + `getNamedItemNS(namespaceURI, localName)`
    + `removeNamedItemNS(namespaceURI, localName)`
    + `setNamedItemNS(node)`

#### 12.1.2 其他方面变化

1. `DocumentType` 类型变化

    新增属性能够完整访问  
    ```html
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"     "http://www.w3.org/TR/html4/strict.dtd">
    ```
    中的信息

2. `Document` 类型变化

    + `importNode()` 这个方法的用途是从一个 文档中取得一个节点，然后将其导入到另一个文档
    + `defaultView` 属性确定文档所属的视图窗口
    + `document.implementation.createDocumentType()`
    + `document.implementation.createDocument()`
    + `document.implementation.createHTMLDocument()`

3. `Node` 类型变化

    + `isSupported()` 但这个方法不实用
    + `isSomeNode()`
    + `isEqualNode()`
    + `setUserData()` 处理函数会在带有数据的节点被复制、删除、重命名或引入一个文档时调用，因而你可以事先决定在上述操作发生时如何处理用户数据。处理函数接受 5 个参数：表示操作类型的数值（1 表示复制，2 表示导入，3 表示删除，4 表示重命名）、数据键、数据值、源节点和目标节点

4. 框架的变化 
    
    框架和内嵌框架分别用 `HTMLFrameElement` 和 `HTMLIFrameElement` 表示，他们的新属性是 `contenDocument` 这个属性包含一个指针，指向表示框架内容的文档对象。

### 12.2 样式

在HTML 中定义样式的方式有三种
+ `<link/>` 元素包含外部样式文件
+ `<style/>` 元素定义嵌入式样式
+ 使用 `style` 特性针对特定元素定义特定样式
DOM2 围绕这三种样式的机制提供一套API

#### 12.2.1 访问元素样式

任何支持 `style` 特性的 HTML 元素在 JavaScript 中都有一个对应的 style 属性。这个 style 对象是 CSSStyleDecaration 实例, 包含通过 HTML 的 style 特性指定的所有信息，但不包含与外部样式表或嵌入样式表经过层叠而来的样式。

对于使用短划线的CSS属性，需要转变成驼峰式，JavaScript才能访问，并且在设置属性值时需要指定度量单位

其中不能直接转换的为 float 属性，float 是 JavaScript 保留的关键字，需要转换成 styleFloat

1. DOM 样式属性和方法

    DOM2 对 style 对象还定义了一些属性和方法
    + `cssText`
    + `length`
    + `parenRule` 表示 CSS 信息的 `CSSRule` 对象，这个对象包含两个属性 `cssText` 和 `cssValueType`。其中 `cssValueType` 属性则是一个数值常量，表示值的类型：0表示继承的值，1表示基本的值，2表示 值列表，3表示自定义的值
    + `getPropertyCssValue(propertyName)`
    + `getPropertyProprity(propertyName)` 如果给定对象的属性使用了 `!important` 设置则返回 `"important"` 否则返回空字符串
     + `getProtpertyValue(propertyName)`
     + `item(index)` 返回指定位置的 CSS 属性名称是带短划线
     + `removeProperty(propertyName)`
     + `setProperty(propertyName, value, proprity)` 

2. 计算的样式

    `getComputedStyle("elementName", "伪元素字符串")` 第二个参数可以为 `null`。方法返回一 个 CSSStyleDeclaration 对象（与 style 属性的类型相同）  

    `var myDiv = document.getElementById("myDiv");`可以获得元素计算后的样式

#### 12.2.2 操作样式表

CSSStyleSheet 类型表示的是样式表，包括 `<link/>` (HTMLLinkElement 类型) 和 `<style/>` (HTMLStyleElement 类型)。该对象上只有**只读**接口(有一个属性例外)

CSSStyleSheet 继承自 StyleSheet 属性如下：
+ `disabled`
+ `herf`： `<link>`的样式URL
+ `media`
+ `ownerNode`
+ `parentStyleSheet`：在当前样式表是通过@import 导入的情况下，这个属性是一个指向导入 它的样式表的指针。
+ `title`：`ownerNode` 中 title 属性的值
+ `type`：`"type/css"`
+ `cssRule`
+ `ownerRule`：如果样式表是通过@import 导入的，这个属性就是一个指针，指向表示导入的规 则；否则，值为 null
+ `insertRule`
  
1. CSS 规则
 
    CSSStyleRuyle 类型包含下列属性：
    + cssText
    + parentRule
    + parentStyleSheet
    + selectorText
    + style
    + type

    ```js
    var sheet = document.styleSheets[0];
    var rules = sheet.cssRules || sheet.rules;
    ```

2. 创建规则

    `inserRule()` 该函数接受两个参数，规则文本和插入的规则索引
    ```js
    sheet.insertRule("body { background-color: silver }", 0); 
    ```

3. 删除规则

    `deleteRule()` 参数为删除样式的索引

#### 12.2.3 元素大小

1. 偏移量

    + offsetHeight
    + offsetWidth
    + offsetLeft
    + offsetTop

2. 客户区大小
3. 滚动大小
4. 确定元素大小

### 12.3 遍历

“DOM2 遍历和范围” 模块定义了两个用于辅助完成顺序遍历 DOM结构的类型：`NodeIterator` 和 `TreeWalker`

对 dom 树进行右子树优先 深度优先 的遍历

#### 12.3.1 `NodeIterator`

`document.createNodeIterator()` 方法创建。该方法有四个参数：
+ root
+ whatToShow
+ filter： NodeFilter 对象或者是一个表示应该接受还是拒绝某种特定节点的函数
+ entityReferenceExpansion： 该参数在 HTML 页面中没有用

#### 12.3.2 `TreeWalker`

`TreeWalker` 是 `NodeIterator` 的高级版本。用`document.createTreeWalker()`方法创建，参数与`document.createNodeIterator()`相同。除了包括 `nextNode()` 和 `previousNode()` 还有以下方法：
+ `parentNode()`
+ `firstChild()`
+ `lastChild()`
+ `nextSilbing()`
+ `previousSlibing()`

### 12.4 范围

“DOM2 遍历和范围” 模块定义了“范围”接口。

#### 12.4.1 DOM 中的范围

DOM2 在 `Document` 类型中定义了 `createRange()` 方法

+ `startContainer`
+ `startOffset`  
  范围在 `startContainer` 中的偏移量
+ `endCountainer`
+ `endOffset`
+ `commonAncestorContainer`  
  `startContainer` 和 `endContainer` 共同的祖先节点在文档树中位置最深的那个

1. 用 DOM 范围实现简单选择

    `selectNode()` 选择整个节点，包括子节点  
    `selectNodeContents()` 只选择节点的子节点  
    这两个方法都接受一个参数，即一个 DOM 节点。
    ```js
    document.createRange().selectNode()
    document.createRange().selectNodeContents()
    ```

2. 用 DOM 范围实现复杂选择

    `setStart()`
    `setEnd()`

3. 操作 DOM 范围中的内容

    `deleteContents()` 方法相似，`extractContents()` 也会从文档中移除范围选区。但这两个方法的区别在于，`extractContents()` 会返回范围的文档片段。利用这个返回的值，可以将范围的内容插入到文档中的其他地方。

4. 插入 DOM 范围中的内容
5. 折叠 DOM 范围

    `collapse()`

6. 比较 DOM 范围

    `compareBoundaryPoints()` 确定范围是否有公共的边界

7. 复制 DOM 范围

    `cloneRange()`

8. 清理 DOM 范围

    `detach()`

#### 12.4.8 IE8以及更早版本的范围

1. 使用 IE 范围实现简单的选择
2. 使用 IE 范围实现复杂的选择
3. 操作 IE 范围中的内容
4. 折叠 IE 范围
5. 比较 IE 范围
6. 复制 IE 范围
 