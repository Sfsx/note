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

***

## 基础数据类型

1. Null
2. Undefined
3. Boolean
4. String
5. Number
6. Object
7. Symbol

    ES6引入了一种新的原始数据类型，表示独一无二的值。它是JavaScript的第七种数据类型
    ```javascript
    var sym = new Symbol(); // TypeError
    ```
    需要注意的事 ```typeof``` 返回值可能是 
    + 'undefined'  如果这个值未定义
    + 'string'     如果这个值是字符串
    + 'boolean'    如果这个值是布尔值
    + 'number'     如果这个值是数值
    + 'object'     如果这个值是对象或null
    + 'function'   如果这个值是函数

## 引用类型

### Object

### Date

### Regexp

### Array

```javascript
let array = [1,2,3]
// 栈
array.push(4)
array.pop()

// 队列
array.push(4)
array.shift()
```

### Function

1. 作为值得函数

    ```javascript
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

2. 函数内部属性

   + 函数内部有两个对象：arguments和this。其中arguments有一个callee的属性，该属性是一个指针，指向拥有这个arguments对象的函数

      ```javascript
      function factorial(num) {
        if (num <=1) {
          return 1;
        } else {
          return num * factorial(num-1)
        }
      }

      // 等价于

      function factorial(num){
        if (num <=1) {
          return 1;
        } else {
          return num * arguments.callee(num-1)
        }
      }
      ```

   + this 引用的是函数据以执行的环境对象——或者也可以说是 this 值（当在网页的全局作用域中调用函数时， this 对象引用的就是 window）

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

   + 每个函数都包含两个非继承而来的方法：apply()和 call()。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 this 对象的值
      + call() 第一个参数是在其中运行函数的作用域，其余参数都直接传递给函数。(this, .., .., .., ..)
      + apply() 第一个参数是在其中运行函数的作用域，另一个是参数数组。(this, arguements)
      + bind() 这个方法会创建一个函数的实例，其 this 值会被绑 定到传给 bind()函数的值。
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

### 基本包装类型

引用类型与基本包装类型的主要区别就是对象的生存期。使用 new 操作符创建的引用类型的实例， 在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一 行代码的执行瞬间，然后立即被销毁。这意味着我们不能在运行时为基本类型值添加属性和方法。

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

1. Boolean
   建议是永远不要使 用 Boolean 对象。
2. Number
   不建议直接实例化 Number 类型，而原因与显式创建 Boolean 对象一样。具体来讲，就是在使用 typeof 和 instanceof 操作符测试基本类型数值与引用类型数值时，得到的结果完全不同，如下面的 例子所示。
3. String

### 单体内置对象

1. Global 对象

2. Math 对象
   + math 对象属性
   + min()和max()

      ```javascript
      var values = [1, 2, 3, 4, 5, 6, 7, 8];
      var max = Math.max.apply(Math, values);
      ```
   + 舍入方法
      + Math.cell()
      + Math.floor()
      + Math.round()
   + random()方法
      Math.random()方法返回大于等于 0小于 1的一个随机数。
      ```javascript
      值 = Math.floor(Math.random() * 可能值的总数 + 第一个可能的值)
      function selectFrom(lowerValue, upperValue) {
        var choices = upperValue - lowerValue + 1;
        return Math.floor(Math.random() * choices + lowerValue);
      }

      var num = selectFrom(2, 10); alert(num);   // 介于 2 和 10 之间（包括 2 和 10）的一个数值
      ```

## 面向对向程序设计

1. 理解对象

   1.1 属性类型

   + 数据属性

      ```javascript
      var person = {};
      Object.defineProperty(person, "name", {
        writable: true,   //表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性
        configurable: true,   //表示能否通过 for-in 循环返回属性
        Enumerable: true    //表示能否修改属性的值
        value: "Nicholas",
      });
      ```

      在调用 Object.defineProperty()方法时，如果不指定，configurable、enumerable 和 writable 特性的默认值都是 false

   + 访问器属性

      ```javascript
      var book = {
        _year: 2004,
        edition: 1
      };
      Object.defineProperty(book, "year", {
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
      alert(book.edition);  //2
      ```

   1.3 读取属性的特性
   Object.getOwnPropertyDescriptor()

2. 创建对象

   1. 工厂模式
   2. 构造函数
   3. 原型模式

      ```javascript
      function Person(){ }

      Person.prototype = {
        name : "Nicholas",
        age : 29,
        job: "Software Engineer",
        sayName : function () {
          alert(this.name);
        }
      };
      ```

   4. 原型的动态性
   5. 原生对象的原型

      不推荐在程序开发过程中修改原生对象的原型

3. 继承
   1. 原型链
   2. 借用构造函数
   3. 组合继承

      组合继承（combination inheritance），有时候也叫做伪经典继承，指的是将原型链和借用构造函数的 技术组合到一块，从而发挥二者之长的一种继承模式

   4. 原型继承

      `Object.create()`即为原型继承。这个方法接收两个参数：一 个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。

   5. 寄生式继承
   6. 寄生组合式继承

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

      function inheritPrototype(subType, superType){
        var prototype = object(superType.prototype);     //创建对象
        prototype.constructor = subType;              //增强对象
        subType.prototype = prototype;               //指定对象
      }

      inheritPrototype(SubType, SuperType);
      ```

## 函数表达式

1. 递归
2. 闭包