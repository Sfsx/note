
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
      if (num <= 1) {
        return 1;
      } else {
        return num * factorial(num - 1)
      }
    }

    // 等价于 这样改写的好处是实现更松散的耦合，使函数与函数名factorial解耦，可以随意改变函数名（函数名仅是一个指向函数的指针）
    function factorial(num){
      if (num <= 1) {
        return 1;
      } else {
        return num * arguments.callee(num - 1)
      }
    }
    ```

2. this 引用的是函数据以执行的环境对象——或者也可以说是 `this` 值（当在网页的全局作用域中调用函数时， `this` 对象引用的就是 `window` ）

    ```javascript
    window.color = "red";
    var o = { color: "blue" };
    function sayColor() {
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

  ```js
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

闭包**是指一个函数有权访问另一个函数作用域中的变量**

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

`window.frame[0]` 或者 `window.frame["frameName"]`

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

**DOM(文档对象类型) 是针对html和xml文档的一个 API**。它提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构，样式和内容。DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。简言之，它会将 web 页面和脚本或程序语言连接起来。

+ 理解包含不同层次的dom
+ 使用不同的节点类型
+ 克服浏览器兼容问题以及各种缺陷

### 10.1 节点层次

#### 10.1.1 Node 类型

`DOM1` 定义了一个 `Node` 接口，许多 `DOM` 类型从这个接口**对象**继承。`Node` 的父类为 `EventTarget` 类型（也是一个对象，参考第6章的知识点）

`Node` 对象是整个 `DOM` 的主要数据类型。这个 `Node` 接口在 `JavaScript` 中是作为 `node` 类型实；除 IE 外所有浏览器都可以访问这个类型。`JavaScritp` 中的所有节点类型都继承自 `node` 接口，所以他们都共享着相同的属性和方法

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

    `cloneNode()`

#### 10.1.2 Document 类型

`JavaScript` 通过 `Document` 类型表示文档。 在浏览器中 `Document` 对象是 `HTMLDocument` 的一个实例，表示整个 `HTML` 页面。而且 `Document` 对象是 `window` 的一个属性。`Document` 节点具有以下特征：

+ nodeType `9`
+ nodeName `"#document"`
+ nodeValue `null`
+ parentNode `null`
+ ownerDocument `null`
+ 子节点：
  + DocumentType（最多一个）
  + Element（最多一个）
  + ProcessingInstruction （XML 声明，XML 声明包含了准备 XML 处理器解析 XML 文档的详细信息。它是可选的，但在使用时，它必须出现在 XML 文档中的第一行）
  + Comment （html注释）

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

    由于 `DOM` 分为多个级别，也包含多个部分。需要检测浏览器 DOM 具体实现。即使用 `document.implementation` 属性的 `hasFeature()` 方法，有两个参数：要检测的 DOM 功能的名称及版本号。下面是一个例子：

    ```js
    var hasXmlDom = document.implementation.hasFeature("XML", "1.0");
    ```

6. 文档写入

#### 10.1.3 Element 类型

Element 是非常通用的基类，所有 `Document` 对象下的对象都继承它. 这个接口描述了所有相同种类的元素所普遍具有的方法和属性。`Element` 具有以下特征：

+ nodeType `1`
+ nodeName 元素标签名
+ nodeValue `null`
+ parentNode `Document` 或 `Element`
+ 子节点
  + Element
  + Text
  + Comment
  + ProcessingInstruction
  + CDATASection
  + EntityReference （`<!ENTITY name "value">`）

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

`Comment` 类型与 `Text` 类型继承自相同的基类 `CharacterData`

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
    第一个参数可选值：
    + `"beforebegin"`：在当前元素之前插入一个紧邻的同辈元素
    + `"afterbegin"`：作为当前元素的第一个子元素插入
    + `"beforeend"`：作为当前元素的最后一个子元素插入
    + `"afterend"`：在当前元素之后插入一个紧邻的同辈元素

    ```js
    element.insertAdjacentHTML("beforebegin", "<p>Hello world!</p>");
    ```

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

`document.documentMode` 可以确定当前页面使用的是什么文档模式

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

---

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

---

## 第13章 事件

+ 理解事件流
+ 使用事件处理程序
+ 不同的事件类型

### 13.1 事件流

事件流描述的是从页面中接收事件的顺序。IE 的事件流为事件冒泡。Netspace Communicator 的事件流为事件捕获

#### 13.1.1 事件冒泡

事件开始时由最具体的元素（文档中嵌套层次最深的节点）接收，然后逐级向上传播到较为不具体的节点

#### 13.1.2 事件捕获

与事件冒泡相反，不太具体的节点最早接收事件，而最具体的节点应该最后接收到事件。

#### 13.1.3 DOM事件流

“DOM2 事件” 规定的事件流包括三个阶段：

+ 事件捕获阶段  
  从Document 向下传递事件，对象事件并没有触发
+ 处于目标阶段  
  触发具体对象事件
+ 事件冒泡阶段

目前浏览器都会在事件捕获阶段触发事件对象上的事件，导致在一个完整的事件流上，有两次机会在目标对象上面操作事件

### 13.2 事件处理程序

#### 13.2.1 HTML事件处理程序

在 HTML 中指定事件处理程序有两个缺点：

+ 时差，用户可能在 HTML 元素一出现在页面上就触发该事件，而这时页面还没有加载完成，绑定的 JavaScript 函数还没完成加载
+ 以这种方式拓展的事件处理程序的作用域链在不同浏览器中是不同的。不同的 JavaScript 引擎遵循的标识符解析规则略有差异，很可能在访问非限定对象时出错
+ HTML 与 JavaScript 代码紧密耦合，如果更换程序需要更换两个地方

#### 13.2.2 DOM0 事件处理程序

```js
var btn = document.getElementById("myBtn");
btn.onclick = function(){
  alert("Clicked");
};
```

DOM0方法指定的事件处理程序被认为是元素的方法，此时事件处理程序是在元素的作用域中执行的

#### 13.2.3 DOM2 事件处理程序

“DOM2 事件” 模块定义的方法 `addEventListener()` 和 `removeEventListener()`，这两个函数都接受3个参数：

+ 要处理的事件名
+ 事件处理函数
+ Boolean
  + true表示在捕获阶段调用事件处理程序
  + flase表示在冒泡阶段调用事件处理程序

同 DOM0 一样处理函数是在元素的作用域中执行，能够多次添加，顺序执行

```js
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function(){
  alert(this.id);
}, false);
```

#### 13.2.4 IE 事件处理程序

`attachEvent()` 和 `detachEvent()` 这两个参数接受相同的两个参数：

+ 事件处理程序名称
+ 事件处理函数

```js
var btn = document.getElementById("myBtn");
btn.attachEvent("onclick", function(){
  alert("Clicked");
});
```

全局作用域

#### 13.2.5 跨浏览器的事件处理程序

### 13.3 事件对象

event 对象

#### 13.3.1 DOM中的事件对象

event 都具有的属性和方法（以下属性均为只读不可修改）：

+ bubbles 事件是否冒泡
+ cancelable 是否取消事件默认行为
+ cuurentTarget 处理事件的那个元素
+ defaultPrevented
+ detail
+ eventPhase 事件处理的阶段 1表示捕获 2表示处于目标 3表示冒泡
+ preventDefault() 取消事件默认行为
+ stopImmediatePropagation() 取消事件进一步捕获或者冒泡，同事阻止任何事件处理函数
+ stopPropagation() 取消事件冒泡
+ target
+ trusted 事件是浏览器生成 还是 JavaScript 创建
+ type
+ view

只有在事件处理期间，event对象才会存在，一旦事件处理程序执行完成，event对象就会被销毁

#### 13.3.2 IE 中的事件对象

若使用 DOM0 添加事件处理程序 event 作为 window 对象的一个属性存在  
若使用 `attachEvent()` 添加事件处理函数， event 作为 window 对象的一个属性存在， 并且作为处理函数的参数

IE event 都具有的属性和方法：

+ cancelBubble
+ returnValue
+ srcElemnet
+ type

#### 13.3.3 跨浏览器的事件对象

### 13.4 事件类型

“DOM3 事件”模块定义一下事件类型：

+ UI 当用户与页面上的元素交互时发生
+ 焦点事件
+ 鼠标事件
+ 滚轮事件
+ 文本事件
+ 键盘事件
+ 合成事件
+ 变动事件
+ 变动名称事件

#### 13.4.1 UI 事件

现有UI事件如下：

+ load
+ unload
+ abort
+ error
+ select
+ resize
+ scroll

1. load

    当页面 **完全** 加载后就会触发 window 上的 load 事件

    在向文档添加新图像元素时，新图像元素不一定要从添加到文档后才开始 下载，只要设置了 src 属性就会开始下载

2. unload

    只要用户从一个页面切 换到另一个页面，就会发生 unload 事件

    unload 事件是在一切 都被卸载之后才触发，那么在页面加载后存在的那些对象，此时就不一定存在了。

3. resize

    当浏览器窗口被调整到一个新的高度或宽度时，就会触发 resize 事件

    与其他发生在 window 上的事件类似，在兼容 DOM 的浏览器中，传入事件处理程序中的 event 对象有一个 target 属性，值为 document

4. scroll

    scroll 事件虽然是在 window 上发生的，但他实际表示的是页面中对象发生的变化

    与 resize 事件类似，scroll 事件也会在文档被滚动期间重复被触发，所以有必要尽量保持事件处理程序的代码简单

#### 13.4.2 焦点事件

焦点事件会在页面元素获得焦点时触发，配合 documnet.hasFocus() 以及 document.activeElement 属性配合可获取用户行踪。

+ blur 在元素失去焦点时触发，不会冒泡
+ focus 在元素获得焦点时触发，不会冒泡
+ focusout 在元素获得焦点时触发，这个事件与 HTML 的 focus 等价，会冒泡

当焦点从页面一个元素移动到另一个元素会触发以下事件

1. focusout 失去焦点的元素
2. focusin 获得焦点的元素
3. blur 失去焦点的元素
4. focus 获得焦点的元素

#### 13.4.3 鼠标与滚轮事件

鼠标事件如下：

+ click
+ dblclick
+ mousedown
+ mouseenter
+ mouseleave
+ mousemove 鼠标指针在元素中移动时重复触发
+ mouseout
+ mouseover 鼠标从元素外部，首次移入另一个元素的边界之内时触发
+ mouseup

mousedown + mouseup = click  
click + click = dblclick

1. 客户区坐标位置

    `event.clientX` 和 `event.clientY`

2. 页面坐标位置

    `event.pageX` 和 `event.pageY`

    在页面没有滚动的情况下，pageX 和 pageY 的值与 clientX 和 clientY 的值相等

3. 屏幕坐标位置

    `event.screenX` 和 `event.screenY`

4. 修改键

    `evnet.shiftKey`
    `event.ctrlKey`
    `event.altKey`
    `event.metaKey` (win -> win, mac -> cmd)

5. 相关元素

    mouseover mouseout 这两事件发生时会有相关元素

6. 鼠标按钮

    `event.button` 0表示主鼠标按钮 1表示中间的鼠标按钮 2表示次鼠标按钮

7. 更多的事件信息

    `event.detail` 中包含了一个数值，表示在给定位置上发生了多少次单击（移动鼠标则计数请零）

8. 鼠标滚轮事件

    wheeldelta 事件  
    `event.wheelDelta` 表示滚轮滚动方向

9. 触摸设备

    + 不支持 dblclick 双击窗口放大
    + 轻击可单击元素会触发 mouseove 事件。如果此操作会导致内容变化，则不再有其他事件发生。若屏幕没有变化，会依次发生 mousedown, mouseup, click事件
    + 两个个手指滚动页面会触发 mousewheel 和 scroll 事件

10. 无障碍性问题

    + 使用 click 事件执行代码，通过 mousedown 事件执行代码会让人感觉过快
    + 不要使用 onmouseover 向用户展示新的选项。原因同上
    + 不要时 dblclick 事件执行重要操作，因为键盘无法触发这个事件

#### 13.4.4 键盘与文本事件

键盘事件有三个：

+ keydown 按下任意键触发，按住不放重复触发
+ keypress 按下字符键触发，按住不放重复触发
+ keyup 释放按键触发

文本事件：

+ textInput 文本插入文本框之前触发

1. 键码

    `event.keyCode` 属性值与 ASCII 码中对应小写字母或数字的编码相同

2. 字符编码

    keypress 事件意味着按下会影响到屏幕中显示的文本

    keypress 事件才有的属性 `event.charCode` 表示按下那个键所代表字符的 ASCII 编码

3. DOM3 变化

    DOM3 事件中的键盘事件，不再包含 `charCode` 属性，而是包含两个新属性：`key` 和 `char`。`key` 属性是按下键相应的文本字符， `char` 属性是按下那个键所代表字符的 ASCII 编码（自测chrome既有 `charCode` 也有 `key` 和 `char`）

    DOM3 还添加了 `location` 的属性，这是一个数值，表示按下了什么位置的键。0表示键盘，1表示左侧键（左 alt），2表示右侧位置，3表示数字小键盘，4表示移动设备键盘，5表示手柄（浏览器支持不多，自测chrome支持）

    DOM3 添加 `event.getModifierState()` 但只有 IE9 支持（自测chrome支持）

4. textInput 事件

    “DOM3 事件”引入的新事件，名叫 textInput。该事件与 keypress 事件的区别在于：
    1. 任何可以获得焦点的元素都可以触发 keypress 事件，而 textInput 只有在可编辑区域才能触发
    2. textInput 事件只会在用户按下能够输入实际字符键时才能够触发，keypress 是在能够影响文本显示就会触发（例如退格键）

    `event.inputMethod` 目前只有 IE 实现（自测确实）

5. 设备中的键盘事件

#### 13.4.5 复合事件

复合事件用于处理 IME 的输入序列。IME（Input Method Editor，输入法编辑器）可以让用户输入在物理键盘上找不到的字符。（仅 IE9 支持）

#### 13.4.6 事件变动

+ DOMSubtreeModified：DOM 结构发生变化，这个事件在其他任何事件触发后都会触发
+ DOMNodeInserted
+ DOMNodeRemoved
+ DOMNodeInsertedIntoDocument：这个事件在 DOMNodeInserted 事件之后触发
+ DOMNodeRemovedFromDocument：这个事件在 DOMNodeRemoved 事件之后触发
+ DOMAttrModified
+ DOMCharacterDataModified：文本节点的值发生变化时触发

1. 删除节点

    在使用 `removeChild()` 和 `replaceChild()` 从 DOM 中删除节点时，会首先触发 DOMNodeRemoved 事件

    如果删除的节点包含子节点，则子节点触发 DOMNodeRemovedFromDocument 事件。不会冒泡且事件的目标是相应的子节点或者那个被移除的节点，除此之外 event 对象中不包含其他内容

2. 插入节点

    在使用 `appendChild()`，`replaceChild()`和`insertBefor()` 向 DOM 中插入节时，首先会触发 DOMNodeInserted 事件。这个事件的目标是被插入的节点，事件触发时节点已经被插到了新的父节点中。这个事件是冒泡的

    紧接着，会在插入的节点上触发 DOMNodeInsertedDocument 事件，该事件不冒泡，事件的目标是被插入的节点，除此之外 event 不包含任何对象

#### 13.4.7 HTML5 事件

1. contextmenu 事件

    鼠标右键单机在调出上下文菜单之前触发的事件，可阻止事件冒泡，并设置自定义右键菜单菜单

2. beforunload 事件

    不能取消该事件，只是在页面卸载之前，显示的消息告知用户页面行将被卸载，询问用户是否真的要关闭页面，还是希望继续留下来

3. DOMContentLoaded 事件

    window 的 load 表示页面一切都加载完成时触发。而 DOMContentLoaded 事件则会在形成完整的 DOM 树时触发

4. readyStateChange 事件

    支持 readyStateChange 事件的每一个对象都有一个 `readyState` 属性，该属性有5个可能值：
    + uninitialized（未初始化）：对象存在但未初始化。
    + loading
    + loaded
    + interactive （交互）：可以操作对象了，但还没有完全加载。
    + complete

    redayStateChange 事件的 interactive 状态会与 DOMContentChange 事件大致相同时间发生。

5. pageshow 和 pagehide 事件

    使用浏览器后退按钮，页面从bfcache加载时不会触发 load 事件。

    pageshow 事件页面显示时触发。如果页面从 bfcache 加载，页面状态完全恢复的那一刻触发。如果页面重新加载，则在 load 事件后触发。该事件 evnet.persisted 标志页面是否从 bfcache 加载。

    pagehide 事件会在浏览器卸载页面时触发，而且是在 unload 事件前触发。其 evnet.persisted 表示卸载页面是否会存入缓存。

6. hashchange 事件

    在 URL 的参数列表（及 URL 中 "#" 号后面的字符串）发生变化时通知开发人员。

    必须把 hashchange 事件处理函数添加到 window 对象。其 event 包含两个属性 `oldURL` 和 `newURL`。

#### 13.4.8 设备事件

1. orientationchange 事件

    设备切换横纵向查看模式时触发。 其中 `window.orientation` 值区别横纵方向

2. Mozorientation 事件

    当设备的加速计检测到设备方向改变时，就会触发这个事 件

3. deviceorientation 事件

    在加速计检测到设备方向变化时在 window 对象上触发，事件的意图是告诉开发人员设备在空间中朝向哪儿，而不是如何移动。

4. devicemotion 事件

    通过 devicemotion 能够检测到设备是不是正在 往下掉，或者是不是被走着的人拿在手里。

#### 13.4.9 触摸与手势事件

1. 触摸事件

    + touchstart
    + touchmove
    + touchcancel
    + touches
    + targetTouchs
    + changeTouches

    touch对象包含以下属性

    + clientX
    + clientY
    + identifier
    + pageX
    + pageY
    + screenX
    + screenY
    + target

2. 手势事件

### 13.5 内存和性能

在 JavaScript 中，添加到页面上的事件处理程序数量将直接影响页面的整体性能。首先，每个函数都是对象，都会占用内存；内存占用越多，性能越差。其次，必须事先指定所有事件的处理程序而导致 DOM 访问次数增多，会延迟整个页面的交互就绪时间。

#### 13.5.1 事件委托

对 “事件处理程序过多” 问题的解决方案就是**事件委托**。利用事件冒泡，可以只在 document 层次处理事件。优点有下

+ document 对象很快能够访问，可以在页面生命周期任何事件点添加事件处理程序
+ 在页面中设置处理程序的所需的时间更少。
+ 整个页面占用内存空间更少

#### 13.5.2 移除事件处理程序

先移除元素上的事件在移除元素

### 13.6 事件模拟

#### 13.6.1 DOM中的事件模拟

document 对象上使用 `createEvent()` 方法创建事件

+ UIEvent
+ MouseEvent
+ MutationEvents
+ HTMLEvents

1. 模拟鼠标事件

    ```js
    var btn = document.getElementById("myBtn");

    //创建事件对象
    var event = document.createEvent("MouseEvents");
    //初始化事件对象
    event.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //触发事件
    btn.dispatchEvent(event);
    ```

2. 模拟键盘事件

    ```js
    var event = document.createEvent("KeyboardEvent");

    //初始化事件对象
    event.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
    ```

3. 模拟其他事件

    `createEvent("MutationEvents")` 创建一个包含 `initMutationEvent()` 方法的变动事件对象。

4. 自定义DOM事件

    `createEvent("CustomEvent")` 返回的对象有一个名为 `initCustomEvent()` 的方法，接收如下 4个参数
    + type
    + bubbles
    + cancelable
    + detail

#### 13.6.2 IE 中的事件模拟

---

## 第14章 表单脚本

+ 理解表单
+ 文本框验证与交互
+ 使用其他表单控制

### 14.1 表单的基础知识

HTML 标签的 `<form>` 在 JavaScript 中，对应的是 HTMLFormElement 类型。 HTMLFromElement 继承了 HTMLElement，因此与 HTML 元素具有相同的属性。但本身还有以下独特的属性和方法：

+ accetpCharset -> HTML accept-charset 属性
+ action -> HTML action 属性
+ elements -> 表单中所有控件的集合
+ enctype -> HTML enctype 属性
+ length -> 表单中控件的数量
+ method -> HTML method 属性
+ name -> HTML name 属性
+ reset() -> 将表单域重置为默认值
+ submit() -> 提交表单
+ target -> HTML target 属性

#### 14.1.1 提交表单

避免重复提交：在第一次提交后禁用表单按钮，或者利用 onsubmit 事件处理程序取消后续的表单操作

#### 14.1.2 重置表单

```html
<!-- 通用重置按钮 -->
<input type="reset" value="Reset Form">

<!-- 自定义重置按钮 -->
<button type="reset">Reset Form</button>
```

#### 14.1.3 表单字段

`form.elements` 该属性是表单中所有表单元素（字段）的集合

1. 共有的表单字段属性

    除了 `<fieldset>` 元素，所有的表单字段都拥有相同的属性。

    + disabled
    + form
    + name
    + readOnly
    + tabIndex tab键切换的序号
    + type
    + value

    `<select>` 元素的 `type` 属性可以是 `"select-one"`，`"select-multipe"`

2. 共有的表单字段方法

    `focus()` 和 `blur()`。其中 `bler()` 会将焦点从元素上移走。

    HTML5 新增 `autofocus` 属性。自动将焦点移动到表单相应字段。

3. 共有的表单字段事件

    + blur
    + change 对于 `<input>` 和 `<textarea>` 元素，在他们**失去焦点**且 **`value` 值改变**时触发
    + focus

### 14.2 文本框脚本

`<textarea>` 不能设置最大字符数

不要使用 `setAttribut()` 设置 `<input>` 元素的 value 特性，也不要去修改 `<textarea>` 元素的第一个子节点。原因是：对 value 修改，不一定会反映在 DOM 中，在处理文本框值时，最好不要使用 DOM 方法

#### 14.2.1 选择文本

`select()` 方法选择文本框中所有文本

1. 选择（select）事件
2. 取得选择的文本

    HTML5 给文本框元素添加了两个属性 `selectionStart` 和 `selectionEnd`

    ```js
    function getSelectedText(textDom) {
      return textDom.value.substring(text.selectionStart, text.selectionEnd);
    }
    ```

3. 选择部分文本

    HTML5 为文本框添加的 `setSelectionRange()` 方法。该方法接受两个参数：要选择的第一个字符的索引和要选择的最后一个字符的索引。

    ```js
    // 选择所有文本
    textDom.setSelectionRange(0, textDom.value.length);
    ```

#### 14.2.2 过滤输入

1. 屏蔽字符
2. 操作剪贴板

剪贴板事件：

+ beforecopy
+ copy
+ beforecut
+ cut
+ beforepaste
+ paste

取消 before 开头这些事件并不会取消对剪贴板的操作——只有取消 copy，cut和paste 事件

可以通过 window.clipboardData 对象访问剪贴板数据，最好只在发生剪贴板事件期间使用这个对象

该对象有三个方法：

+ getData()：只有一个参数为取得的数据格式：`"text/plain"`
+ setData()：只有一个参数也是数据类型，返回 `boolean` 判断操作是否成功
+ clearData()

#### 14.2.3 自动切换焦点

只是在输入框达到既定数据的最大长度时自动切换焦点，使用方法为 `from.element[i].focus()`

#### 14.2.4 HTML5 约束验证API

1. 必填字段

    表单元素的 `required` 属性

2. 其他输入字段

    input 元素的 type 新增 `"email"` 和 `"url"`

3. 数值范围

    数值类型输入的元素：number，range，datetime，datetime-local，date，month，week，time。这些元素可以指定 max 和 min 属性

4. 输入模式

    HTML5 为文本字段新增了pattern属性。这个属性的值是一个正则表达式，用于匹配文本框中的值。

5. 检测有消性

    使用元素的 `checkValidity()` 返回值 `boolean` 表示是是否通过前面所介绍的表单校验

    `checkValidity()` 方法告诉你字段是否有效，而 validity 属性则会告诉你为什么字段有效或无效。这个对象包含一些属性，每个属性都会返回一个`boolean` 值
    + customError： 如果设置了 `setCustomValidity()` 则返回 `true`
    + patternMismatch
    + rangeOverflow： 是否比 max 大
    + rangeUnderflow： 是否比 min 小
    + stepMisMatch： mix 和 max 之间的步长值合不合理
    + tooLong
    + typeMismatch
    + valid： 与 `checkValidity()` 返回值相同
    + valueMissing：required 字段是否没有值

6. 禁用验证

    novalidate 属性

#### 14.3 选择脚本

选择框是通过 `<select>` 和 `<option>` 元素创建的。属于 HTMLSelectElement 类型，该类型提供了下列属性和方法：

+ `add(newOption, relOption)`：向元素的 reloption（选项）之前插入新的 `<option>`
+ multiple
+ options： 控件中所有 `<option>` 元素的 HTMLCollection
+ `remove(index)`
+ selectedIndex
+ size：选择框中可见行数
+ value
  + 未选择 空字符串
  + 有一个选中的项
    + 且该项的 value 特性已经在 HTML 中指定，则value 等于选中项的 value 特性
    + 若该项的 value 特性未指定，则 value 属性等于该项文本
  + 有多个选择项，则 value 会根据之前的规则取得第一个选项中的值

`<option>` 元素都有一个 HTMLOptionElement 对象表示。该对象具有以下属性：

+ index
+ label
+ selected 表示是否被选中
+ text
+ value

其他表单的 change 事件是在值被修改且焦点离开当前字段时触发。而选择框的  change 事件只要选中了选项就会触发。

#### 14.3.1 选择选项

对于只允许选择一项的选择框，直接访问选择框的 selectedIndex 属性，即可访问选择选项。

对于允许多选的选择框，循环访问每个选项的 `select.options[i].selected` 即可得到选中选项的一个数组

#### 14.3.2 添加选项

```js
// 第一种方案
var newOption = document.createElement("option");
newOption.appendChild(documnet.createTextNode("Option text"));
newOption.setAttribute("value", "Option value");

selectBox.appendChild(newOption);

// 第二种方案
var newOption = new Option("Option text", "Option value"); selectbox.add(newOption, undefined); //最佳方案
```

#### 14.3.3 移除选项

DOM 的 `removeChild(optionDom)` 或者选择框的 `remove(index)` 方法

#### 14.3.4 移动和重排选项

```js
var optionToMove = selectbox.options[1];
selectbox.insertBefore(optionToMove, selectbox.options[optionToMove.index+2]);
```

### 14.4 表单序列化

在 JavaScript 中利用表单字段的 type 属性，连同 name 和 value 属性一起实现对表单的序列化，然后通过 http 请求发送给服务器

### 14.5 富文本编辑器

在页面中嵌入一个包含**空 HTML 页面**的 iframe。通过设置 designMode 属性，这个空白的 HTML 页面可被编辑，而编辑对象则是该页面 `<body>` 元素的 HTML 代码

#### 14.5.1 使用 `contenteditable` 属性

另一种编辑富文本内容的方式是使用名为 contenteditable 的特殊属性。IE 最早实现。可以把 contenteditable 属性应用给页面中的任何元素，然后用户立即就可以编辑该元素。

#### 14.5.2 操作富文本

使用 `document.execCommand()` 方法，参数有三个：要执行的命令名称，表示浏览器是否应该为当前命令提供用户界面的一个布尔值和执行命令必须的一个值（如果不需要值，则传递 `null` ）

+ backcolor
+ bold
+ copy
+ createlink
  + 第三参数 URL 字符串
+ cut
+ delete
+ fontname
+ fontsize
+ forecolor
+ formatblock
  + 第三参数 HTML 标签
  + 使用指定标签来格式化字符串
+ indent

`document.queryCommandEnabled()` 参数为命令，返回值为命令是否可用
`document.queryCommandState()` 参数为命令，返回值为命令是否成功
`document.queryCommandValue()` 参数为命令，返回值为命令执行函数的第三个参数

#### 14.5.3 富文本选区

`iframe.getSelection()` 这个方法是 window 对象和 document 对象的属性，调用会返回一个表示当前选择文本的 Selection 对象。该对象具有以下属性：

+ anchorNode：选区起点所在的节点
+ anchorOffset：偏移节点的量
+ focusNode：选区终点所在的节点
+ focusOffset：focusNode 中包含在选区之内的数量
+ isCollapsed：布尔值，选区起点和终点是否重合
+ rangeCount：选区中包含的 DOM 范围的数量
+ `addRange(range)`：将指定的 DOM 范围添加到选区中
+ `collapse(node, offset)`：
+ `collapseToEnd()`：将选区折叠到重点位置
+ `collapseToStart()`：将选取折叠到指定节点的相应文本偏移位置
+ `containsNode(node)`：确定节点是否包含在选区中
+ `deleteFromDocument()`
+ `extend(node, offset)`：通过将 focusNode 和 focusOffset 移动到指定的值来扩展选区。
+ `getRangeAt(index)`：返回索引对应的选区中的 DOM 范围
+ `removeAllRanges()`
+ `removeRange(range)`
+ `selectAllChildren(node)`：清除选区并选择指定节点的所有子节点
+ `toString()`

#### 14.5.4 表单与富文本

在表单提交前将富文本中的 HTML 插入表单的隐藏字段，同样适用于 contenteditable 元素

```js
EventUtil.addHandler(form, "submit", function(event){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);

    target.elements["comments"].value = frames["richedit"].document.body.innerHTML;

    // contenteditable
    target.elemnets["comments"].value = document.getElementById("richehit").innerHTML;
});
```

---

## 第15章 使用 Canvas 绘图

+ 理解 `<canvas>` 元素
+ 绘制简单2D图形
+ 使用 WebGl 绘制3D图形

HTML5 中添加的元素中最受欢迎的元素就是 `<canves>` 元素。`<canvas>` 除了具备基本绘图能力的2D上下文，还建议了一个名为 WebGL 的3D上下文，但只有很少的浏览器支持。

### 15.1 基本用法

在 `<canvas>` 的开始标签和结束标签设置内容，若浏览器不支持 `<canvas>` 则会显示该段内容。

`getContex()` 无参。获取2D上下文。

`toDataURL()` 参数为图像 MIME 类型。例如，

```js
var imgURI = drawing.toDataURL("image/png");
```

### 15.2 2D上下文

`<canvas>` 左上角为坐标原点(0,0)。

#### 15.2.1 填充和描边

`ctx.strokStyle` 设置描边颜色

`ctx.fillStyle` 设置填充颜色

#### 15.2.2 绘制矩形

`ctx.strokRect(x, y, width, height)`
`ctx.clearRect(x, y, width, height)`
`ctx.fillRect(x, y, width, heigth)`

#### 15.2.3 绘制路径

要绘制路径首先要调用 `beginPath()` 方法。然后调用以下方法：

+ `arc(x, y, radius, startAngle, endAngle, counterclockwise)`：以 (x，y) 为圆心，radius 为半径，startAngle为起始弧度，endAngle为结束弧度，counterclockwise为布尔值表示方向为顺时针还是逆时针。
+ `acrTo(x1, y1, x2, y2, radius)`：从上一点开始绘制一条弧线，到 (x2, y2) 为止，并且以给定半径 radius 穿过 (x1, y1)
+ `bezierCurveTo(c1x, c1y, c2x, c2y, x, y)`：从上一点开始绘制曲线，到(x,y)为止，并且以 (c1x, c1y) 和 (c2x, c2y) 为控制点。
+ `lineTo(x, y)`
+ `moveTo(x, y)`：将绘图游标移动到指定点
+ `quadraticCurveTo(cx, cy, x, y)`：从上一点开始绘制一条二次曲线，到 (x, y) 为止，(cx, cy) 作为控制点。
+ `rect(x, y, width, height)`：绘制矩形。

#### 15.2.4 绘制文本

`fillText()` 和 `strokText()` 这两个方法都接受4个参数：文本，x，y和可选的最大像素宽度。并基于以下三个属性

+ font
+ textAlign
+ textBaseline
  + 可能值："top"、"hanging"、"middle"、"alphabetic"、 "ideographic"和"bottom"。

```js
context.font = "bold 14px Arial";
context.textAlign = "center";
context.textBaseline = "middle";
context.fillText("12", 100, 20);
```

#### 15.2.5 变换

+ `rotate(angle)`：围绕远点旋转图像 angle 弧度
+ `scale(scaleX, scaleY)`：缩放图像，`x*scaleX`， `y*csaleY`
+ `translate(x, y)`：将坐标原点移动到 (x, y)。
+ `transform(m11, m12, m21, m22, dx, dy)`：直接修改变换矩阵，方式是矩阵相乘：
    $$
    \begin{matrix}
    m11 & m12 & dx \\
    m21 & m22 & dy \\
    0 & 0 & 1
    \end{matrix} \tag{1}
    $$
+ `setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy)`：将变化矩阵重置为默认状态在调用 `transform()`

`save()` 将当前上下文中的变化与属性压栈保存

`restore()` 将之前保存的上午中的变化与属性出栈使用

#### 15.2.6 绘制图像

```js
var image = document.images[0];
/**
 * @param 图像
 * @param x
 * @param y
 */  
context.drawImage(image, 10, 10);

/**
 * @param 图像
 * @param x
 * @param y
 * @param 目标图像的宽度
 * @param 目标图像的高度
 */
context.drawImage(image, 50, 10, 20, 30);

/**
 * @param 图像
 * @param 源图像的x坐标
 * @param 源图像的y坐标
 * @param 源图像的宽度
 * @param 源图像的高度
 * @param 目标图像的x坐标
 * @param 目标图像的y坐标
 * @param 目标图像的宽度
 * @param 目标图像的高度
 */
context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60);
```

#### 15.2.7 阴影

以下属性用于绘制阴影：

+ shadowColor
+ shadowOffsetX：阴影x方向偏移量
+ shadowOffsetY
+ shadowBlur：模糊的像素

#### 15.2.8 渐变

线性渐变：

`createLinearGradient(startX, startY, endX, endY)` 返回`CanvasGradient` 对象。然后用 `addColorStop()` 方法来指定色标。该方法接受2个参数：色标位置和 CSS 颜色。位置是 0（开始位置） ~ 1 （结束位置）之间的数字。

```js
var gradient = context.createLinearGradient(30, 30, 70, 70);

gradient.addColorStop(0, "white");
gradient.addColorStop(1, "black");

context.fillStyle = gradient;
context.storkStyle = gradient;
```

径向渐变：

`createRadialGradient(x1, y1, r1, x2, y2, r2)` 前三个参数为起点圆心 (x, y) 和半径r。后三个参数为终点圆心 (x2, y2) 和半径r2

#### 15.2.9 模式

`createPattern(image, repeat)` 其中第二个参数与 CSS 的 background-repeat 属性相同，包括"repeat"、"repeat-x"、 "repeat-y"和"no-repeat"。

#### 15.2.10 使用图像数据

`getImageData(x, y, width, height)` 方法获取原始图像数据。方法返回 ImageData 类型的实例，每个 ImageData 对象有三个属性：width，height和data。其中data是数组保存图像每一个像素的数据。每一个像素用4个元素来保存，分别是红，绿，蓝和透明度。data的数据是可以修改的

`putImageData(ImageData, x, y)` 方法将 ImageData 实例绘制在画布上。

#### 15.2.11 合成

`globalAlpha`： 0 ~ 1 之间的值指定所有绘制的透明度，可修改

`globalCompositionOperation`：表示后绘制的图形怎么样与先绘制的图形结合。可能值如下

+ source-over：后者位于前者上方
+ source-in：两者重叠可见，其他部分透明
+ source-out：两者不重叠部分可见，前者透明
+ source-atop：后者与前者重叠部分可见，后者其他部分透明
+ destination-over：后者位于前者下方
+ destination-in：后者位于前者下方，重叠可见，其他透明
+ destination-out：后者擦除与前者重叠部分
+ destination-atop：后者位于下方，重叠可见，前者其他部分透明
+ lighter：后者于前者重叠部分的值相加，使该部分变亮
+ copy：后者完全代替与之重叠的前者
+ xor：后者与前者重叠部分执行“异或”操作。

### 15.3 WebGL

WebGL 是针对 `<canvas>` 的 3D 上下文。是基于 OpenGL ES 2.0 制定的。

#### 15.3.1 类型化数组

WebGL 涉及复杂的计算需要提前知道数值的精度，而标准 JavaScript 数值无法满足要求。所以引入**类型化数组**。这是元素被设置为特定类型的值的数组。是 ArrayBuffer 类型。

```js
// 这段代码会分配20B的内存空间
var buffer = new ArrayBuffer(20);
```

1. 视图

    `DataView(ArrayBuffer, offset, length)`

    ```js
    //创建一个从字节 9 开始到字节 18 的新视图
    var view = new DataView(buffer, 9, 10);

    alert(view.byteOffset); // 输出 9
    alert(view.byteLength); // 输出 10

    var buffer = new ArrayBuffer(20),
        view = new DataView(buffer),
        value;

    view.setUint16(0, 25);
    value = view.getInt8(0);

    alert(value); //0
    ```

    虽然 DataView 能让我们在字节级别上读写数组缓冲器中的数据，但我们必须自己记住要将数据保存到哪里，需要占多少子节

2. 类型化视图

    类型化视图也被称作类型化数组。继承于 DataView，除了必须规定元素是某种特定的数据类型之外与常规数组无异。以下就是各种类型化数组

    + Int8Array
    + Uint8Array
    + Int16Array
    + Uint16Array
    + Int32Array
    + Float32Array
    + Float64Array

    以上每个视图的构造函数都有一个名为 `BYTES_PRE_ELEMENT` 的属性，表示该类型化数组一个元素需要多少字节。

    还有一个 `subarray(startIndex, endIndex)` 方法基于底层数组缓冲器的子集创建一个新视图。其中第二个参数可选。

    ```js
    //需要 10 个元素空间
    var int8s = new Int8Array(buffer, 0, 10 * Int8Array.BYTES_PER_ELEMENT);

    //需要 5 个元素空间
    var uint16s = new Uint16Array(
      buffer,
      int8s.byteOffset + int8s.byteLength,
      5 * Uint16Array.BYTES_PER_ELEMENT
    );

    //创建一个数组保存 10 个 16 位整数（20 字节）
    var int16s = new Int16Array(10);

    //创建一个数组保存 5 个 8 位整数（10 字节）
    var int8s = new Int8Array([10, 20, 30, 40, 50]);
    ```

#### 15.3.2 WebGL 上下文

```js
var gl = drawing.getContext("experimental-webgl");
```

通过给 `getContext()` 传递第二个参数，可以为 WebGL 上下文设置一些选项。

+ alpha：为上下文创建一个 alpha 缓冲区。默认 true
+ depth：可以使用16位深缓冲区。默认 true
+ stencil：可以使用8位缓冲区。默认 true
+ antialias：使用默认机制执行抗锯齿操作。默认 true
+ premultipliedAlpha：绘图缓冲区有预乘 Alpha。默认 true
+ preserverDrawingBuffer：在绘制完成后是否保留绘图缓冲区。默认 false

1. 常量

    与 OpenGL 对比 WebGL 的常量去掉 `GL_` 开头。

2. 方法命名
3. 准备绘图

    ```js
    // 用黑色清理缓冲区
    gl.clearColor(0,0,0,1);   //black
    gl.clear(gl.COLOR_BUFFER_BIT);
    ```

4. 视口与坐标

    这里的视口坐标原点在 `<canvas>` 左下角

    ```js
    gl.viewport(0, 0, drawing.width, drawing.height);
    ```

    而视口内部的坐标原点 (0, 0) 为视口中心点

5. 缓冲区

    ```js
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0.5, 1]), gl.STATIC_DRAW);
    ```

    `gl.bufferData()` 的最后一个参数用于指定使用缓冲区的方式。
    + gl.STATIC_DRAW 数据只加载一次，在多次绘图中使用
    + gl.STREAM_DRAW 数据只加载一次，在几次绘图中使用
    + gl.DYNAMIC_DRAW 数据动态改变，在多次绘图中使用

    `gl.deleteBuffer(buffer)` 释放缓冲区

6. 错误

    JavaScript 与 WebGL 之间最大的区别就是，WebGL 不会抛出错误。所以需要在调用 WebGL 方法后，手工调用 gl.getError() 方法。该方法返回一个表示错误类型的常量。
    + gl.NO_ERROR
    + gl.INVALID_ENUM 应该传入 WebGL 常量，却传错了参数
    + gl.INVALID_VALUE 在需要无符号数的地方传入负值
    + gl.INVALID_OPERATION 在当前状态下不能完成操作
    + gl.OUT_OF_MEMORY 没有足够的内存
    + gl.CONTEXT_LOST_WEBGL 由于外部事件（如断电）干扰丢失当前上下文

7. 着色器

    WebGL 的着色器并不是用 JavaScript 写的，是用 GLSL 写的。

8. 编写着色器
9. 编写着色器程序
10. 为着色器传入值
11. 调试着色器和程序
12. 绘图
13. 纹理

---

## 第16章 HTML5 编程脚本

+ 使用跨文档消息传递
+ 拖放 API
+ 音频与视频

### 16.1 跨文档消息传递

跨文档消息传递简称 XDM。主要是向当前页面中的 `<iframe>` 元素发送消息。

`postMessage(message, domain)` 该方法接受两个参数：一条消息和一个表示消息接收方来自哪个域的字符串

```js
var iframeWindow = document.getElementById("myframe").contentWindow;
iframeWindow.postMessage("A secret", "http://www.wrox.com");
```

```js
EventUtil.addHandler(window, "message", function(event){

  //确保发送消息的域是已知的域
  if (event.origin == "http://www.wrox.com"){

    //处理接收到的数据
    processMessage(event.data);

    //可选：向来源窗口发送回执
    event.source.postMessage("Received!", "http://p2p.wrox.com");
  }
});
```

### 16.2 原生托放

#### 16.2.1 托放事件

托动某元素时依次触发以下事件：

+ dragstart
+ drag
+ dragend

dragstart 触发后会持续触发 drag 事件

当某个元素被拖动到一个有效的放置目标上时，下列事件会依次发生：

+ dragenter
+ dragover
+ dragleave

只要有元素被拖动到放置目标上，就会触发 dragenter 事件，然后是持续的 dragover 事件，当目标被移出放置目标时，会触发dragleave

#### 16.2.2 自定义托放目标

重写目标的 dragenter 和 dragover 事件阻止其默认行为即可将目标变成有效放置对象。

#### 16.2.3 dataTransfer 对象

通过 dataTransfer 对象，实现数据交换

+ `dataTransfer.setData()`
+ `dataTransfer.getData()`

其中 `setData()` 的第一个参数也是 `getData()` 方法唯一的一个参数，是 一个字符串，表示保存的数据类型，可以指定各种 MIME 类型。

#### 16.2.4 dorpEffect 和 effectAllowed

`dataTransfer.dorpEffect` 被拖动元素能够执行哪种放置行为

+ `"none"`：不能把拖动元素放在这里，这是除文本框之外所有元素的默认值。
+ `"move"`：应该把目标元素移动到放置目标
+ `"copy"`：应该把目标元素复制到放置目标
+ `"link"`：表示放置目标会打开拖动的元素(拖动元素必须是一个 url )

`dataTransfer.effectAllowed` 表示允许被拖动元素的哪种 `dorpEffect`

+ "uninitialized"：没有给被拖动的元素设置任何放置行为。
+ "none"：被拖动的元素不能有任何行为。
+ "copy"：只允许值为"copy"的 dropEffect。
+ "link"：只允许值为"link"的 dropEffect。
+ "move"：只允许值为"move"的 dropEffect。
+ "copyLink"：允许值为"copy"和"link"的 dropEffect。
+ "copyMove"：允许值为"copy"和"move"的 dropEffect。
+ "linkMove"：允许值为"link"和"move"的 dropEffect。
+ "all"：允许任意 dropEffect。

#### 16.2.5 可被拖动

HTML5 为所有 HTML 元素规定了一个 `draggable` 属性，表示元素是否可以拖动。图像和链接的 `draggable` 属性自动被设置成了 `true`，而其他元素这个属性的默认值都是 `false`。

#### 16.2.6 其他成员

+ `addElement(element)`
+ `clearData(formt)`
+ `setDragImage(element, x, y)`
+ `types`

### 16.3 媒体元素

`<audio>` 和 `<video>`

```html
<!-- 嵌入视频 -->
<video src="conference.mpg" id="myVideo">Video player not available.</video>
<!-- 嵌入音频 -->
<audio src="song.mp3" id="myAudio">Audio player not available.</audio>
```

#### 16.3.1 属性

#### 16.3.2 事件

#### 16.3.3 自定义媒体播放器

#### 16.3.4 检测编码器的支持状情况

`audio.canPlayType(MIME)` 将MIME 类型和编解码器作为参返回值有三种 `"probably"`， `"maybe"`， `""`(空字符串)

```js
//可能是"probably"
if (audio.canPlayType("audio/ogg; codecs=\"vorbis\"")){
//进一步处理
}
```

| 音频   | 字符串                        |
| ------ | ----------------------------- |
| AAC    | audio/mp4; codecs="mp4a.40.2" |
| MP3    | audio/mpeg                    |
| Vorbis | audio/ogg; codecs="vorbis"    |
| WAV    | audio/wav; codecs="1"         |

| 视频   | 字符串                                     |
| ------ | ------------------------------------------ |
| H.264  | video/mp4; codecs="avc1.42E01E, mp4a.40.2" |
| Theora | video/ogg; codecs="theora"                 |
| WebM   | video/webm; codecs="vp8, vorbis"           |

#### 16.3.5 Audio类型

`<audio>` 元素还有一个原生的 JavaScript 构造函数 Audio，可以在任何时候播放音频

```js
var audio = new Audio("sound.mp3");
EventUtil.addHandler(audio, "canplaythrough", function(event) {
    audio.play();
});
```

### 16.4 历史状态管理

不加载新页面的情况下改变浏览器的 URL，可以使用`history.pushState()` 方法。该方法接受三个参数状态对象，新状态的标题和可选的相对 URL。

```js
history.pushState({name: "Sfsx"}, "Sfsx page", "sfsx.html");
```

因为pushState()会创建新的历史状态，所以按下后退会触发 window 的 popstate 事件

```js
EventUtil.addHandler(window, "popstate", function(event){
  var state = event.state;
  if (state){   //第一个页面加载时 state 为空
    processState(state);
  }
});
```

`replaceState()` 方法重写当前状态，参数为 `pushState()` 方法的前两个参数。

---

## 第17章 错误处理与调试

+ 理解浏览器报告的错误
+ 处理错误
+ 调试 JavaScript 代码

### 17.1 浏览器报告的错误

#### 17.1.1 IE

#### 17.1.2 Firefox

#### 17.1.3 Safari

#### 17.1.4 Opera

#### 17.1.5 Chrome

### 17.2 错误处理

#### 17.2.1 try-catch 语句

1. finally

    finally 子句一经使用，其代码无论如何都会执行

2. 错误类型

    + Error
    + EvalError
    + RangeError
    + ReferenceError
    + SytnaxError
    + TypeError
    + URIError
  
    其中Error是基类，其他错误类型都继承自该类型。

3. 合理使用 try-catch

#### 17.2.2 抛出错误

1. 抛出错误的时机
2. 抛出错误与使用 try-catch

#### 17.2.3 错误（error）事件

任何没有通过 try-catch 处理的错误都会触发 window 对象的 error 事件。

```js
window.onerror = function(message, url, line) {
  alert(message);
};
```

图像的 src 特性中的 url 不能返回可以被识别的图像格式，也会触发 error 事件

#### 17.2.4 处理错误的策略

1. 类型转换错误

    建议使用 `===`  
    `if` 条件判断时发生的自动类型转换

2. 数据类型错误

    使用 `typeof` 检测
  
3. 通讯错误

#### 17.2.6 区分致命错误和非致命错误

非致命错误

+ 不影响用户的主要任务
+ 只影响页面的一部分
+ 可以恢复
+ 重复相同操作可以消除错误

致命错误

+ 程序无法运行
+ 用户无法操作
+ 会导致其他连带错误

#### 17.2.7 把错误记录到服务器

### 17.3 调试技术

#### 17.3.1 将消息记录到控制台

#### 17.3.2 将消息记录到当前页面

#### 17.3.3 抛出错误

### 17.4 常见IE错误

#### 17.4.1 操作终止

IE8 之前的版本在页面加载未完成时使用 `appendClhild()` 方法出错。

#### 17.4.2 无效字符

无效字符，就是 JavaScript 语法中未定义的字符。例如 `\u2013`

#### 17.4.3 未找到成员

IE 中的所有 DOM对象都是以 COM 对象，而非原生 JavaScript对象的形式实现的。

在对象被销毁之后，又给该对象赋值，就会导致未找到成员错误。而导致这个错误的，一定是 COM 对象

#### 17.4.4 未知运行时错误

Unknown runtime error

#### 17.4.5 语法错误

#### 17.4.6 系统无法找到指定资源

---

## 第18章 JavaScript 与 XML

+ 检测浏览器对 XML DOM的支持
+ 理解 JavaScript 中的 XPath
+ 使用 XSTL 处理器

### 18.1 浏览器对 XML DOM 的支持

DOM2 是第一个提到动态创建 XML DOM 概念的规范，DOM3 进一步增强了 XML DOM，新增了解析和序列化的特性。

#### 18.1.1 DOM2级核心

```js
var xmldom = document.implementation.createDocument(namespaceUri, root, doctype);

//  JavaScrip中管理命名空间比较困难，所以一般不用。root 表示根元素
var xmldom = document.implementation.createDocument("", "root", null);
```

#### 18.1.2 DOMParser 类型

```js
var parser = new DOMParser(); var xmldom = parser.parseFromString("<root><child/></root>", "text/xml");

alert(xmldom.documentElement.tagName);    //"root"
alert(xmldom.documentElement.firstChild.tagName);    //"child"

var anotherChild = xmldom.createElement("child"); xmldom.documentElement.appendChild(anotherChild);

var children = xmldom.getElementsByTagName("child"); alert(children.length);     //2
```

如果解析出错, 则仍然会返回一个 Document 对象，这个对象的文档元素是 `<parsererror>`

#### 18.1.3 XMLSerializer

将 DOM 文档序列化为 XML字符串。

```js
var serializer = new XMLSerializer();
var xml = serializer.serializeToString(xmldom);
alert(xml);
```

#### 18.1.4 IE8 及之前版本中的XML

1. 序列化 XML
2. 加载 XML 文件

#### 18.1.5 跨浏览器处理XML

### 18.2 浏览器对 XPath 的支持

XPath 是设计用来在 DOM 文档中查找节点的一种手段，因而对 XML 处理也很重要

#### 18.2.1 DOM3 级XPath

DOM3 的 XPath 规范定义的类型中，最重要的两个类型是 XPathEvaluator 和 XPathResult。

+ `createExpression(expression, nsresolver)`：XPath表达式及相应的命名空间信息转 换成一个 XPathExpression。
+ `createNSResolve(node)`：根据 node 的命名空间信息创建一个新的 XPathNSResolver 对象。
+ `evaluate(expression, context, nsresolver, type, result)`：在给定的上下文中， 基于特定的命名空间信息来对 XPath表达式求值。

其中 `evaluate()` 是最常用的。这个方法接收 5 个参数：XPath 表达式、上下文节点、命名空间求解器、返回结果的类型和保存结果的 XPathResult 对象

第四个参数（返 回结果的类型）的取值范围是 XPathResult 对象上定义的常量。

```js
var result = xmldom.evaluate("employee/name", xmldom.documentElement, null,                                   XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

if (result !== null) {
  var node = result.iterateNext();
  while(node) {
    alert(node.tagName);
    node = node.iterateNext();
  }
}
if (result !== null) {
  for (var i = 0, len=result.snapshotLength; i < len; i++){
    alert(result.snapshotItem(i).tagName);
  }
}
```

1. 单节点结果

    ```js
    var result = xmldom.evaluate("employee/name", xmldom.documentElement, null,                                   XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    if (result !== null) {
      alert(result.singleNodeValue.tagName);
    }
    ```

2. 简单类型结果

     + XPathResult.BOOLEAN_TYPE
       + result.booleanValue
     + XPathResult.NUMBER_TYPE
       + result.numberValue
     + XPathResult.STRING_TYPE
       + result.stringValue

3. 默认类型结果

    XPathResult.ANY_TYPE
    检测结果的 resultType 属性，可能的结果是
    + XPathResult.STRING_TYPE
    + XPathResult.NUMBER_TYPE
    + XPathResult.BOOLEAN_TYPE
    + XPathResult.UNORDERED_NODE_ITERATOR_TYPE 节点集合，但顺序混乱

4. 命名空间支持

```js
//  createNSResolver() 先创建一个 XPathNSResolver 对象，作为参数传递给 evaluate() 方法
var nsresolver = xmldom.createNSResolver(xmldom.documentElement);

var result = xmldom.evaluate("wrox:book/wrox:author",                              xmldom.documentElement, nsresolver,                              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

alert(result.snapshotLength);
```

#### 18.2.2 IE中的 XPath

#### 18.2.3 跨浏览器使用 XPath

### 18.3 浏览器对 XSLT 的支持

XSLT 是与 XML 相关的一种技术，它利用 XPath 将文档从一种表现形式转换成另一种表现形式。

#### 18.3.1 IE中的 XSLT

#### 18.3.2 XSLTProcessor类型

#### 18.3.3 跨浏览器使用XSLT

---

## 第19章 E4X

+ E4X 新增类型
+ 使用 E4X 操作XML
+ 语法的变化

### 19.1 E4X 的类型

作为对ECMAScript的扩展，E4X定义了如下几个新的全局类型

+ XML
+ XMLList
+ Namespace
+ QName

#### 19.1.1 XML 类型

XML 类型是 E4X 中定义的一个重要的新类型，可以用它来表现 XML 结构中任何独立的部分。XML 类型继承自 Object 类型。

#### 19.1.2 XMLList 类型

XMLList 类型表现 XML 的有序集合。XMLList 的 DOM对等类型是 NodeList，但与 Node 和 NodeList 之间的区别相比，XML 和 XMLList 之间的区别是有意设计得比较小的。

#### 19.1.3 Namespace 类型

E4X 中使用 Namespace 对象来表现命名空间。通常，Namespace 对象是用来映射命名空间前缀和 命名空间 URI 的，不过有时候并不需要前缀。

#### 19.1.4 QName 类型

QName 类型表现的是 XML 对象的限定名，即命名空间与内部名称的组合。

### 19.2 一般用法

```js
var employee = <employee position="Software Engineer">
                 <name>Nicholas C. Zakas</name>
               </employee>;
alert(employee.name); //"Nicholas C. Zakas"
```

#### 19.2.1 访问特性

```js
var employees = <employees>
                  <employee position="Software Engineer">  
                    <name>Nicholas C. Zakas</name>
                  </employee>  
                  <employee position="Salesperson">
                    <name>Jim Smith</name>
                  </employee>
                </employees>;
// 访问特性在使用  @特性名称 的语法
alert(employees.employee[0].@position); //"Software Engineer"
```

#### 19.2.2 其他节点类型

在默认情况上，E4X不会解 析注释或处理指令，因此这些部分不会出现在终的对象层次中。如果想让解析器解析这些部分，可以 像下面这样设置 XML构造函数的下列两个属性。

```js
XML.ignoreComments = false;
XML.ignoreProcessingInstructions = false;
```

XMLList 上可以调用以下方法

+ `attributes()`
+ `comments()`
+ `elements(tagName)`
+ `processingInstructions(name)`
+ `text()`

#### 19.2.3 查询

#### 19.2.4 构建和操作 XML

```js
var tagName = "color";
var color = "red";
var xml = <{tagName}>{color}</{tagName}>;

alert(xml.toXMLString());     //"<color>red</color>

// 第二种构建方式
var employees = <employees/>;
employees.employee.name = "Nicholas C. Zakas";
employees.employee.@position = "Software Engineer";
```

#### 19.2.5 解析和序列化

```js
var settings = XML.settings();
alert(settings.ignoreWhitespace);     // true  默认忽略元素间的空格
alert(settings.ignoreComments);       // true  默认忽略标记中的注释。
alert(settings.ignoreProcessingInstructions);     // true  默认忽略标记中的处理指令。
alert(settings.prettyIndent);         // 2     默认缩进
alert(settings.prettyPrinting);       // true  默认每个元素重启一行
```

#### 19.2.6 命名空间

引入 for-each-in

#### 19.4 全面启用 E4X

```js
<script type="text/javascript;e4x=1" src="e4x_file.js"></script>
```

---

## 第20章 JSON

+ 理解 JSON 语法
+ 解析 JSON
+ 序列化 JSON

由于 XML 过于繁琐、冗长。提出一种新的解决方案 JSON。

XML 创建必须创建 DOM 对象，而 JSON 不用。

关于 JSON，重要的是要理解它是一种数据格式，不是一种编程语言。

### 20.1 语法

+ 简单值
+ 对象
+ 数组

#### 20.1.1 简单值

#### 20.1.2 对象

JSON和对象的区别 1.属性名加引号 2.没有声明变量 3.末尾没有分号

#### 20.1.3 数组

### 20.2 解析与序列化

#### 20.2.1 JSON对象

`stringify()` 和 `parse()`

#### 20.2.2 序列化选项

`JSON.stringify()` 方法两个**可选**参数：第一个参数是个过滤器，可以是一个数组，也可以是一个函数；第二个参数是一个选项，表示是否在 JSON 字符串中保留缩进，这个参数可以是数字，也可以是特殊字符

1. 过滤结果

    单第二个参数为函数

    ```js
    var jsonText = JSON.stringify(book, function(key, value) {
      // 表示忽略
      return undefined;
      // 表示返回值
      return value
    });
    ```

2. 字符串缩进

    ```js
    var jsonText = JSON.stringify(book, null, "--");  

    {
    --"title": "Professional JavaScript",
    --"authors": [
    ----"Nicholas C. Zakas"
    --],
    --"edition": 3,
    --"year": 2011
    }
    ```

3. `toJSON()`

    给对象定义 `toJSON()` 方法，返回其自定义的 JSON 数据格式。可以让这个方法返回 `undefined`，此时如果包含它的对象嵌入在另一个对象中，会导致 它的值变成 `null`，而如果它是顶级对象，结果就是 `undefined`。

`JSON.stringify()` 序列化该对象的顺序如下：

1. 如果存在 `toJSON()` 方法且能够通过它取得有效值，则调用该方法。否则，返回对象本身。
2. 如果提供了第二个参数，应用这个函数过滤器，传入函数过滤器的值是第 1 步的返回值。
3. 对第 2 步返回的每个值进行相应的序列化。
4. 如果提供了第三个参数，执行相应的格式化。

#### 20.2.3 解析选项

`JSON.parse()` 方法也可以接收另一个参数，该参数是一个函数，将在每个键值对儿上调用。该函数接收两个参数，一个键和一个值，而且都需要返回一个值。 如果还原函数返回 `undefined`，则表示要从结果中删除相应的键；如果返回其他值，则将该值插入到结果中。

---

## 第21章 Ajax 与 Comet

+ 使用 XMLHttpRequest 对象
+ 使用 XMLHttpRequest 事件
+ 跨域 Ajax 通信的限制

### 21.1 XMLHttpRequest 对象

```js
new ActiveXObject(versions);
```

#### 21.1.1 XHR 的用法

`open()` 方法接受3个参数，要发送的请求的类型 （"get"、"post"等）、请求的 URL和表示是否异步发送请求的布尔值。

```js
xhr.open("get", "example.php", false);
xhr.send(null);
```

`send()` 该方法接受一个参数：作为请求主体发送的数据。

收到响应后，响应数据会自动填充到XHR对象的属性

+ responseText
+ responseXML
+ status
+ statusText

异步发送时检测 XHR 的 readyState 属性，该属性可取值如下：

+ 0：尚未调用 open()方法
+ 1：已经调用 open()方法，但尚未调用 send()方法。
+ 2：已经调用 send()方法，但尚未接收到响应。
+ 3：已经接收到部分响应数据。
+ 4：已经接收到全部响应数据，而且已经可以在客户端使用了。

#### 21.1.2 HTTP 头部信息

+ Accept 浏览器能够处理的内容类型
+ Accept-Charset 浏览器能够显示的字符集
+ Accept-Encoding 浏览器能够处理的压缩码
+ Accept-Language 浏览器当前设置的语言
+ Connection 浏览器与服务器之间的链接类型
+ Cookie 当前页面设置的任何 Cookie
+ Host 发出请求的页面所在域
+ Referer 发出请求的页面所在的域
+ User-Agent 浏览器的用户代理字符串

`setRequestHeader("字段名", "字段值")` 设置头部信息

#### 21.1.3 GET 请求

#### 21.1.4 POST 请求

### 21.2 XMLHttpRequset 2

#### 21.2.1 FormData

XMLHttpRequest 2 定义了 FormData 类型

```js
// 第一种
var data = new FormData();
data.append("name", "Sfsx");

// 第二种
var data = new FormData(document.forms[0]);

// 通过 XHR 发送
xhr.send(data);
```

#### 21.2.2 超时设定

XMLHttpRequest 2 新增属性 timeout。单位为毫秒的数字

#### 21.2.3 `overriderMimeType()` 方法

这个方法重写 XHR 响应的 MIME 类型。且这个方法需要在 `sned()` 方法之前调用。

### 21.3 进度事件

Progress Event 有以下6个事件：

+ loadstart：在接收到响应数据的第一个子节时触发
+ progress：在接受响应期间不断触发
+ error：在请求发生错误时触发
+ abort：在调用 `abort()` 方法而终止连接时触发。
+ load：在接收到完整数据响应数据时触发。
+ loadend：在通信完成或触发 error，abort，load 事件后触发。

#### 21.3.1 load 事件

onload 事件处理程序会接收到一个 event 对象，其 target 属性就指向 XHR 对象实例。

#### 21.3.2 progress 事件

onprogress 事件处理程序会接收到一个 event 对象，其 target 属性是 XHR 对象，但 包含着三个额外的属性：`lengthComputable`、`position` 和 `totalSize`。

+ lengthComputable： 布尔值表示进度信息是否可用
+ position： 表示已接受的字节数
+ totalSize： Conten-Length 的值

### 21.4 跨源资源共享

CORS（Cross-Origin Resource Sharing，跨源资源共享）是 W3C的一个工作草案，定义了在必须访 问跨源资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想，就是使用自定义的 HTTP头部 让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是应该失败。

#### 21.4.1 IE 对CORS的实现

IE 中引入了XDR类型。这个对象与XHR类似，但能实现可靠的跨域通信

#### 21.4.2 其他浏览器对CORS的实现

跨域XHR对象也有一些限制

+ 不能使用 setRequestHeader()设置自定义头部。
+ 不能发送和接收 cookie。
+ 调用 getAllResponseHeaders()方法总会返回空字符串。

#### 21.4.3 Preflighted Requests

这种请求的方法为 options，头部为：

+ Origin
+ Acess-Control-Request-Method：请求自身使用的发放。
+ Acess-Control-Request-Header：（可选）自定义头部信息

服务器对于这种请求，通过在响应种发送如下头部与浏览器进行沟通：

+ Access-Control-Allow-Origin
+ Access-Control-Allow-Methods
+ Access-Control-Allow-Headers
+ Access-Control-Max-age：应该将这个 Preflight 请求缓冲多长时间

#### 21.4.4 带凭据的请求

将XHR的 `withCredentials` 属性改为 `true`。  
如果服务器接受带凭证的请求，会用下面的 HTTP 头部来响应

Access-Control-Allow-Credentials: true

#### 21.4.5 跨浏览器的CORS

### 21.5 其他跨域技术

#### 21.5.1 图像 Ping

```js
var img = new Image();
img.onload = img.onerror = function(){
    alert("Done!");
};
img.src = "http://www.example.com/test?name=Nicholas";
```

#### 21.5.2 JSONP

```js
function handleResponse(response){
    alert("You’re at IP address " + response.ip + ", which is in " +  response.city + ", " + response.region_name);
}

var script = document.createElement("script");
script.src = "http://freegeoip.net/json/?callback=handleResponse";
document.body.insertBefore(script, document.body.firstChild);
```

#### 21.5.3 Comet

+ 长轮询
+ 流 浏览器向服务器发送一个请求，服务器保持连接打开，然后周期性的向浏览器发送数据。这种方式只有一个 http 请求。

#### 21.5.4 服务器发送事件

1. SSE API

    ```js
    var source = new EventSource("myevents.php");
    ```

    该类型具有 readyState 属性还有另外三个事件
    + open
    + message
    + error

2. 事件流

    这个API同样是一个持久的 HTTP 请求，这个响应的 MEMI 类型为 text/event-stream。数据为纯文本。

#### 21.5.5 Web Socket

1. Web Sockets API

    ```js
    var socket = new WebSocket("ws://www.example.com/server.php");
    ```

    该类型也有 readyState 属性，具有以下属性值
    + WebSocket.OPENING (0)
    + WebSocket.OPEN (0)
    + WebSocket.CLOSEING (0)
    + WebSocket.CLOSE (0)
2. 发送和接收数据

    `socket.send(string)`

3. 其他事件
    + open
    + error
    + close

#### 21.5.6 SEE 与 Web Sockets

### 21.6 安全

对于未被授权的系统有权访问某个资源的情况，我们称之为**CSRF**

为确保通过 XHR 访问的 URL 安全，通行的做法就是验证发送请求者是否有权限访问相应的资源。 有下列几种方式可供选择。

+ 要以SSL连接来访问请求资源
+ 要求每一次请求都要附带经过相应算法计算得到的验证码

下列措施对防范 CSRF 攻击不起作用

+ 要求发送 POST 而不是 GET 请求 —— 很容易改变
+ 检查来源 URL 是否可靠 —— 来源记录很容易伪造
+ 基于 cookie 信息进行验证 —— 同样很容易伪造

---

## 第22章 高级技巧

+ 使用高级函数
+ 防篡改对象
+ Yielding Timers

### 22.1 高级函数

#### 22.1.1 安全类型检测

```js
Object.prototype.toString.call(value) == "[object Array]"
```

#### 22.1.2 作用域安全的构造函数

```js
function Person(name, age, job){
    if (this instanceof Person) {
        this.name = name;
        this.age = age;
        this.job = job;
    } else {
        return new Person(name, age, job);
    }
}

var person1 = Person("Nicholas", 29, "Software Engineer");
```

#### 22.1.3 惰性载入函数

#### 22.1.4 函数绑定

#### 22.1.5 函数柯里化

与函数绑定紧密相关的主题是柯里化，它用于创建已经设置好的一个或多个参数的函数。函数柯里化的基本方法和函数绑定是一样的：使用一个闭包返回一个函数。两者的区别在于，柯里化时当函数被调用时，返回的函数还需要设置一些传入的参数。

```js
function curry(fn){
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.apply(null, finalArgs);
    };
}
```

ECMAScript 5的 `bind()` 方法也实现函数柯里化，只要在 `this` 的值之后再传入另一个参数即可。其原理类似下面的代码，要注意的是 `fn` 的参数**顺序**，**排在前面**的是 `bind()` 中传入的，**排在后面**的是调用时传入的参数。

```js
function bind(fn, context) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.apply(context, finalArgs);
    };
}
```

### 22.2 防篡改对象

#### 22.2.1 不可扩展对象

`Object.preventExtensions(object)` 使你不能够再给对象添加属性和方法。

`Object.istExtensible()` 确定对象是否可被扩展。

#### 22.2.2 密封的对象

密封对象不可扩展，而且以有成员的的 `[[Congfigurable]]` 特性将被设置为 `false`。这就以为着不能删除属性和方法，也不能使用 `Object.defineProperty()`

`Object.seal()`

`Object.isSeal()`

#### 22.2.3 冻结对象

最严格的防篡改级别是冻结对象。既不可扩展，又是密封的，而且对象的`[[Writable]]` 特性会被置为 `false`。如果定义 `[[Set]]` 函数，访问器属性仍然是可写的。

`Object.freeze()`

`Object.isFrozen()`

### 22.3 高级定时器

对于定时器，指定的时间间隔表示何时将定时器的代码添加到队列，而不 是何时实际执行代码。

#### 22.3.1 重复的定时器

```js
setTimeout(function() {

    // 处理

    setTimeout(arguments.callee, interval);

}, interval)
```

#### 22.3.2 Yielding Processes

数据分组处理

```js
function chunk(array, process, context){
    setTimeout(function(){
        var item = array.shift();
        process.call(context, item);

        if (array.length > 0){
            setTimeout(arguments.callee, 100);
        }
    }, 100);
}
```

#### 22.3.3 函数节流

让函数延迟执行，在延迟的时间段中只会执行一次。

### 22.4 自定义事件

事件是一种叫做观察者的设计模式，这是一种创建松散耦合代码的技术。

### 22.5 托放

#### 22.5.1 修缮拖动功能

#### 22.5.2 添加自定义事件

---

## 第23章 离线应用于客户端存储

+ 进行离线检测
+ 使用离线缓存
+ 在浏览器中保存数据

### 23.1 离线检测

HTML5 规定了 `navigator.onLine` 属性表示设备是否能连接网络。

HTML5 还规定了 online 和 offline 事件。这两个事件在 window 对象上触发。

### 23.2 应用缓存

HTML5 的应用缓存，简称为 appcache。下面是一个简单的文件缓存示例，假设文件名为 offline.manifest。

```text
CACHE MANIFEST
#Comment

file.js
file.cs
```

```html
<html manifest="/offline.manifest">
```

其 API 核心为 applicationCache 对象，该对象有一个 status 属性，其值为一下常量：

+ 0 无缓存
+ 1 闲置 缓存未得到更新
+ 2 检查中 正在下载描述文件并检查更新
+ 3 下载中 正在下载描述文件中指定的资源
+ 4 更新完成
+ 5 废弃 应用缓存描述文件不存在

该对象还有以下事件：

+ checking 应用缓存查找更新时触发
+ error 检查更新或下载资源期间发生错误触发
+ noupdate
+ downloading
+ progress 下载应用缓存持续触发
+ updateready
+ cached

`applicationCache.update();` 手动更新

```js
EventUtil.addHandler(applicationCache, "updateready", function() {
    applicationCache.swapCache();
});
```

### 23.3 数据存储

#### 23.3.1 Cookie

1. 限制

    cookie 是绑定在特定的域名之下

    cookie 长度为 4096B
2. cookie 构成

    + 名称
    + 值
    + 域 domain
    + 路径 path
    + 失效时间 expires
    + 安全标志 secure
3. JavaScript 中的 cookie

    BOM 接口的 `document.cookie`
4. 子 cookie

    ```js
    name=name1=value1&name2=value2&name3=value3&name4=value4&name5=value5
    ```

5. 关于 cookie 的思考

#### 23.3.2 IE用户数据

#### 23.3.3 Web存储机制

HTML5 规范中的 Web Storage，他的主要目标是

+ 提供一种在 cookie 之外存储会话数据的途径
+ 提供一种存储大量可以夸会话存在的数据的机制

Web Storage 规范包含了两种对象的定义：sessionStorage 和 globalStorage。这两个对象以 window 对象属性的形式存在。

1. Storage 类型
   + `clear()`
   + `getItem()`
   + `key(index)`
   + `removeItem(name)`
   + `setItem(name, value)`
2. sessionStorage 对象
   sessionStorage 对象存储特定于某个会话的数据，也就是该数据只保持到浏览器关闭。
3. globalStorage 对象
    这个对象的目的是跨越会话存储数据，但有特定的访问限制。

    ```js
    globalStorage["sfsx.com"].name = "sfsx"
    ```

    这个对象上存储的数据如果未删除，或者用户未清除缓存，则会一直存储在磁盘上。
4. localStorage 对象
    该对象在修订过的 HTML5 规范中作为持久保存客户端数据的方案取代了 globalStorage。该对象不能指定任何访问规则；规则事先就定好了，要访问同一个 localStorage 对象，页面必须来自同一个域名（子域名无效），使用同一种协议，在同一个端口上。
5. storage 事件
    该事件的 event 对象具有以下属性：
    + domain 发生变化的存储空间域名
    + key 设置或者删除键名
    + newValue 设置键值为新值，删除键值为 null
    + oldValue 修改之前的键值
6. 限制

    每个来源（域名，端口，协议）都有固定大小的空间用于保存自己的数据

#### 23.3.4 IndexedDB

1. 数据库

    ```js
    var request, database;

    request = indexedDB.open("admin"); request.onerror = function(event){
        alert("Something bad happened while trying to open: " + event.target.errorCode);
    };
    request.onsuccess = function(event){
        database = event.target.result;
    };
    ```

2. 对象存储空间

    ```js
    // users 相当于表名称 keyPath 相当于 primekey
    var store = db.createObjectStore("users", { keyPath: "username" });
    request = store.add(user);
    request.onerror = function(){
        //处理错误
    };
    request.onsuccess = function(){
        //处理成功
    };
    ```

3. 事务

    ```js
    // 创建事务只加载 users 空间中的数据
    var transaction = db.transaction("users")
    // 访问特定的存储空间
    var request = transaction.objectStore("users").get("007");
    ```

4. 使用游标查询

    ```js
    var store = db.transaction("users").objectStore("users"),
        request = store.openCursor();
    request.onsuccess = function(event) {
        //处理成功
        var cursor = event.target.result
        var value = cursor.value;
    };

    request.onerror = function(event) {
        //处理失败
    };
    ```

5. 键范围
6. 设定游标方向
7. 索引

    ```js
    var store = db.transaction("users").objectStore("users");
    // 参数 索引名 属性名 unique
    var index = store.createIndex("username", "username", { unique: false });
    ```

8. 并发问题
9. 限制

---

## 第24章 最佳实践

+ 可维护的代码
+ 保证代码的性能
+ 部署代码

### 24.1 可维护性

#### 24.1.1 什么是可维护的代码

+ 可理解性
+ 直观性
+ 可适应性
+ 可扩展性
+ 可调试性

#### 24.1.2 代码约定

1. 可读性
    以下代码块需要注释
    + 函数和方法
    + 大段代码
    + 复杂算法
    + Hack
2. 变量和函数命名
    + 变量名应为名词
    + 函数名应该以动词开始
    + 变量和函数都应使用合乎逻辑的名字，不要担心长度
3. 变量类型透明
    初始化时就指定类型

    ```js
    var found = false;  //布尔型
    var count = -1;     //数字
    var name = "";      //字符串
    var person = null;  //对象
    ```

#### 24.1.3 松散耦合

1. 解耦 HTML / JavaScript
2. 解耦 CSS / JavaScript
3. 解耦应用逻辑 / 事件处理程序
    + 勿将 event 对象传给其他方法，只传来自 event 对象中所需的数据
    + 任何可以在应用层面的动作都应该可以在不执行任何事件处理程序的情况下进行
    + 任何事件处理程序都应该处理事件，然后将处理转交给应用逻辑。

#### 24.1.4 编程实践

1. 尊重对象所有权
    + 不要为实例或原型添加属性
    + 不要为实例或原型添加方法
    + 不要重定义已经存在的方法

    + 创建包含所需功能的新对象，并用它与相关对象进行交互
    + 创建自定义类型，继承需要进行修改的类型。然后可以为自定义类型添加额外功能
2. 避免全局变量
3. 避免与 `null` 进行比较

    ```js
        if (values != null){           //避免

        }
    ```

4. 使用常量
    + 重复值——任何在多处用到的值都应抽取为一个常量。这就限制了当一个值变了而另一个没变的时候会造成的错误。这也包含了 CSS 类名。
    + 用户界面字符串——任何用于显示给用户的字符串，都应被抽取出来以方便国际化。
    + URLs——在 Web 应中，资源位置很容易变更，所以推荐用一个公共地方存放所有的URL。
    + 任意可能会更改的值

### 24.2 性能

#### 24.2.1 注意作用域

1. 避免全局查找
    使用全局变量的函数肯定要比局部的开销更大，因为要涉及作用域链上的查找。
2. 避免 with 语句
    with 会创建自己的作用域，因此会增加其中执行代码的作用域链的长度。

#### 24.2.2 选择正确的方法

1. 避免不必要的属性查找

    ```js
    // 这段代码时间复杂度为 O(1)
    var values = [5, 10];
    var sum = values[0] + values[1];
    alert(sum);

    // 这段代码的时间复杂度为 O(n)
    // 对象上任何查找都要比访问变量或者数组花费更长的时间，因为必须在原型链中对拥有该名称的属性进行一次搜索。
    var values = { first: 5, second: 10};
    var sum = values.first + values.second;
    alert(sum);

    // 该语句包含很多属性查找
    var query = window.location.href.substring(window.location.href.indexOf("?"));
    // 可以进行如下优化
    var url = window.location.href;
    var query = url.substring(url.indexOf("?"));
    ```

2. 优化循环
    1. 减值迭代
    2. 简化终止条件
    3. 简化循环体
    4. 使用后测试循环体
3. 展开循环
    处理大数据集时比较有用，利用一种叫Duff装置将循环展开。
4. 避免双重解释
    别用`new Function("alert('Hello world!')");`这种句子。
5. 性能的其他注意事项
    + 原生方法较快
    + Switch 语句较快
    + 位运算符较快

#### 24.2.3 最小化语句数

1. 多个变量声明
2. 插入迭代值
3. 使用数组和对象字面量

#### 24.2.4 优化DOM交互

1. 最小化现场更新
2. 使用innerHTML
3. 使用事件代理
4. 注意HTMLCollection
   + 进行了 `getElementsByTagName()`
   + 获取了元素的 `ChildNode()`
   + 获取了元素的 `attribute()`
   + 访问元素集合 document.forms、document.images

### 24.3 部署

#### 24.3.2 验证

#### 24.3.3 压缩

---

## 第25章

+ 创建平滑的动画
+ 操作文件
+ 使用 Web Works 在后台执行 JavaScript

### 25.1 requestAnimationFrame()

### 25.2 Page Visibility API

+ document.hidden
+ document.visibilityState
+ visibilitychange事件

### 25.3 Geolocation API

### 25.4 File API

### 25.5 Web 计时

### 25.6 Web Workers
