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
  + 'object'     如果这个值是对象或null
  + 'function'   如果这个值是函数

## 第4章 变量，作用域和内存问题

+ 当从一个变量向另一个变量复制引用类型的值时，同样也会将存储在变量对象中的值复制一份放到
为新变量分配的空间中。不同的是，这个值的副本实际上是一个指针，而这个指针指向存储在堆中的一
个对象。复制操作结束后，两个变量实际上将引用同一个对象。
+ 函数参数传递为按值传递

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
1. 没有重载

    ```js
    function addSomeNumber(num) { return num + 100 }
    function addSomeNumber(num) { return num + 200 }
    // 等价于
    const addSomeNumber = function (num) { return num + 100 }
    addSomeNumber = function (num) { return num + 200 }
    ```

2. 函数声明函数表达式

    ```js
    // 函数声明
    function addSomeNumber(num) { return num + 100 }
    // 函数表达式
    const addSomeNumber = function (num) { return num + 100 }
    ```

3. 作为值得函数

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

4. 函数内部属性

   + 函数内部有两个对象：arguments和this。其中arguments有一个callee的属性，该属性是一个指针，指向拥有这个arguments对象的函数

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

### 5.6 基本包装类型

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

1. Global 对象
    + isNaN()
    + isFinite()
    + parseInt()
    + parseFloat()
    + encodeURI()
    + eval()

2. Math 对象
   + math 对象属性
   + min()和max()

      ```javascript
      // Math.max()函数原本参数为字符串
      var values = [1, 2, 3, 4, 5, 6, 7, 8];
      var max = Math.max.apply(Math, values);
      // es6写法
      max = Math.max(...values);
      ```
   + 舍入方法
      + Math.cell()
      + Math.floor()
      + Math.round()
   + random()方法
      Math.random()方法返回大于等于 0小于 1的一个随机数。
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

## 第6章 面向对向程序设计

### 6.1 理解对象

1. 属性类型

    + 数据属性

        + Configurable  
        表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性
        + Enumerable   
        表示能否通过 for-in 循环返回属性
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

      在调用 Object.defineProperty()方法时，如果不指定，configurable、enumerable 和 writable 特性的默认值都是 false

    + 访问器属性

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
        Configurable: true,
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
2. 定义多个属性
3. 读取属性的特性

    ```js 
    /**
     * descript即为key属性的特性，可能是数据属性或者访问属性
     */
    const descript = Object.getOwnPropertyDescriptor(obj, key)
    ```

### 6.2 创建对象

1. 工厂模式

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
2. 构造函数  
    
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
    要创建 Person 的新实例，必须使用 new 操作符。以这种方式调用构造函数实际上会经历以下 4 个步骤：  
    >(1) 创建一个新的对象  
    >(2) 将构造函数的作用域传给新的对象  
    >(3) 执行构造函数，为这个新对象添加属性  
    >(4) 返回新的对象   
    
    构造函数模式虽然好用，但也并非没有缺点。使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。在前面的例子中， person1 和 person2 都有一个名为 sayName()的方法，但那两个方法不是同一个 Function 的实例。这样如果创建多个实例会造成内存浪费

3. 原型模式

    ```js
    function Person(){ };

    Person.prototype.name = "Nicholas";
    Person.prototype.age = 29;
    Person.prototype.job = "Software Engineer";
    Person.prototype.sayName = function () {
      alert(this.name);
    };
    ```
    与构造函数模式不同的是，新对象的这些属性和方法是由所有实例共享的。换句话说，person1 和 person2 访问的都是同一组属性和同一个 sayName()函数。

    + 理解原型对象  

    + 原型与`in`操作符  

    + 更简单的原型语法  

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

    + 原型的动态性  

      调用构造函数时会为实例添加一个指向初始原型的`[[Prototype]]`指针，此时将原型改为另外一个对象会切断构造函数与最初原型的联系，使构造函数指向新的原型。但实例还是指向最初的原型
      ```js
      function Person(){ }
      var friend = new Person();
      Person.prototype = {
        constructor: Person,
        name : "Nicholas",
      };
      friend.name; //undefined
      ```
    + 原生对象的原型

      不推荐在程序开发过程中修改原生对象的原型

    + 原型对象的问题 

      原型模式中所有属性是被很多实例共享的，对于包含基本值的属性也无伤大雅，通过在实例中添加同名属性，可以隐藏原型中对应的属性。  
      但是如果包含引用类型值的属性，会造成多个实际修改同一个引用类型值，将导致比较多的问题。
      
4. 组合使用构造函数模式和原型模式

    构造函数用于定义实例的属性,而原型模式定义实例共享的方法

5. 动态原型模式

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

6. 寄生构造函数模式

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
    这个模式和工厂模式其实是一模一样的，就是调用的时候用`new`关键字。  
    同工厂模式一样，无法用`instanceof`来判断对象的类型。不建议使用

7. 稳妥构造函数模式

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

1. 原型链
2. 借用构造函数
3. 组合继承

    组合继承（combination inheritance），有时候也叫做伪经典继承，指的是将原型链和借用构造函数的 技术组合到一块，从而发挥二者之长的一种继承模式

2. 原型继承

    `Object.create()`即为原型继承。这个方法接收两个参数：一 个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。

3. 寄生式继承
4. 寄生组合式继承

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

## 第7章 函数表达式

### 7.1 递归
### 7.2 闭包