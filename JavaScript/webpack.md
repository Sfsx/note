# webpack

## webpack 编译后的 bundle.js

```js
(function(modules) {

  // 模拟 require 语句
  function __webpack_require__() {
    ...
  }

  // 执行存放所有模块对象中的第1个模块，这里的路径为 webpack.config.js 里面配置的 entry
  return __webpack_require__(__webpack_require__.s = "./src/index.js");

})({/*存放所有模块的对象*/
  // 相对于webpack.config.js的相对路径作为 key
  './src/index.js': function() {
    eval("文件中的具体代码 ...")
  }
})
```

bundle.js 的实质是一个匿名自执行函数（IIFE），函数参数是我们写的各个模块组成的对象，只不过我们的代码被 webpack 包装在了一个函数的内部，也就是说我们的模块，在这里就是一个函数。为什么要这样做，是因为浏览器本身不支持模块化，那么 webpack 就用函数作用域来 hack 模块化的效果。

[output.libraryTarget](https://www.webpackjs.com/configuration/output/#output-librarytarget) 属性可以设置打包后的模块用何种模块化规范

将模块加载后放在一个对象上面

### 对于 commonjs 规范的代码编译

除去了 `__webpack_require__.r()` 的调用。

对于 module.export 没有用到 `__webpack_exports__` 去替换 export。也没有在 module.export 上添加 default 属性

### 对于懒加载的编译

生成 bundle.js 和 0.bundle.js

我们先看 bundle.js

```js
(function(modules) {
  function webpackJsonpCallback(data) {
  var chunkIds = data[0];
  var moreModules = data[1];


  // add "moreModules" to the modules object,
  // then flag all "chunkIds" as loaded and fire callback
  var moduleId, chunkId, i = 0, resolves = [];
  for(;i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
      // 加载函数为 promise 将该 promise 的 resolve 函数推入数组
      resolves.push(installedChunks[chunkId][0]);
    }
    // 0 标志该模块已加载
    installedChunks[chunkId] = 0;
  }
  for(moduleId in moreModules) {
    if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      // 挂载到 modules 对象上
      modules[moduleId] = moreModules[moduleId];
    }
  }
  if(parentJsonpFunction) parentJsonpFunction(data);

  while(resolves.length) {
    resolves.shift()();
  }

};
  // 模拟 require 语句
  function __webpack_require__() {
    ...
  }

  // This file contains only the entry chunk.
  // The chunk loading function for additional chunks
  // 处理异步加载
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];


    // JSONP chunk loading for javascript

    var installedChunkData = installedChunks[chunkId];
    if(installedChunkData !== 0) { // 0 means "already installed".

      // a Promise means "currently loading".
      if(installedChunkData) {
        promises.push(installedChunkData[2]);
      } else {
        // setup Promise in chunk cache
        var promise = new Promise(function(resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push(installedChunkData[2] = promise);

        // start chunk loading
        var script = document.createElement('script');
        var onScriptComplete;

        script.charset = 'utf-8';
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }
        script.src = jsonpScriptSrc(chunkId);

        // create error before stack unwound to get useful stacktrace later
        var error = new Error();
        onScriptComplete = function (event) {
          // avoid mem leaks in IE.
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          var chunk = installedChunks[chunkId];
          if(chunk !== 0) { // webpackJsonpCallback 中加载完成后会修改为 0 标志加载成功
            if(chunk) {
              var errorType = event && (event.type === 'load' ? 'missing' : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
              error.name = 'ChunkLoadError';
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function(){
          onScriptComplete({ type: 'timeout', target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises);
  };

  // 将 window["webpackJsonp"] 数组的 push 替换为 webpackJsonpCallback 函数
  var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;

  // 执行存放所有模块对象中的第1个模块，这里的路径为 webpack.config.js 里面配置的 entry
  return __webpack_require__(__webpack_require__.s = "./src/index.js");

})({/*存放所有模块的对象*/
  // 相对于webpack.config.js的相对路径作为 key
    eval("文件中的具体代码 ...")
  }
})
```

[webpack-打包后代码分析](http://echizen.github.io/tech/2019/03-17-webpack-bundle-code)

## webpack 对于 es6 module 打包与 commonJS 打包的区别

### commonJS

```js
/***/ "./src/commonJS/bar.js":
/*!*****************************!*\
  !*** ./src/commonJS/bar.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function bar(value) {\r\n  console.log(value)\r\n}\n\n//# sourceURL=webpack:///./src/commonJS/bar.js?");

/***/ }),
```

直接将值放在 module.exports 对象上，如果这个值是一个非 Object 的基本类型变量，那么就符合 commonJS 规范中的模块输出为值的拷贝，一旦输出一个值，模块内部的编号就影响不到这个值

### es6 module

```js
/***/ "./src/es6Module/b.js":
/*!****************************!*\
  !*** ./src/es6Module/b.js ***!
  \****************************/
/*! exports provided: foo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"foo\", function() { return foo; });\nlet foo = 1;\r\nsetTimeout(() => {\r\n  foo = 2;\r\n  console.log('b:', foo);\r\n}, 500);\r\n\n\n//# sourceURL=webpack:///./src/es6Module/b.js?");

/***/ }),


// define getter function for harmony exports
__webpack_require__.d = function(exports, name, getter) {
  if(!__webpack_require__.o(exports, name)) {
    Object.defineProperty(exports, name, { enumerable: true, get: getter });
  }
};
```

请注意这里的 `__webpack_require__.d` 方法将 `function() { return foo; }` 设置对象属性的访问器属性，虽然与 commonJS 的访问方式是一直的，但是当内部变量改变时，函数返回结果也会跟着改变，所以 es6module 输出的是值的引用

## 既然模块规范有很多，webpack 是如何去解析不同的规范呢

webpack 根据 webpack.config.js 中的入口文件，自动递归模块依赖，无论这里的模块依赖使用 CommonJS、ES6 Module、或 AMD 规范写的，webpack 都会自动进行分析，并通过转换、编译代码，打包成最终的文件。
**最终文件中的模块实现是基于 webpack 自己实现的 webpack_require （ es5 代码，就是上一节中的 IIFE 模式，这也是为什么 webpack 打包后）**

[webpack-打包后代码分析](http://echizen.github.io/tech/2019/03-17-webpack-bundle-code)

## 为什么需要模块化

前端开发和其他开发工作的主要区别，首先是前端是基于多语言、多层次的编码和组织工作，其次前端产品的交付是基于浏览器，这些资源是通过增量加载的方式运行到浏览器端，如何在开发环境组织好这些碎片化的代码和资源，并且保证他们在浏览器端快速、优雅的加载和更新，就需要一个模块化系统

## webpack 与 gulp 的不同

都是前端自动化构建工具，但侧重点不同。

gulp 侧重于前端开发的**整个过程**的控制管理（像是流水线），通过配置一系列 task 来让 gulp 实现不同的功能，从而构建整个前端开发流程。

webpack 侧重于模块打包，将开发中的所有资源（图片、js文件、css文件等）都看成模块、通过 loader 和 plugins 对资源进行处理，打包成符合生成环境部署的前端资源。

## 与 webpack 类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用 webpack

## 有哪些常见的 loader ？他们是解决什么问题的

+ file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
+ url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
+ source-map-loader：加载额外的 Source Map 文件，以方便断点调试
+ image-loader：加载并且压缩图片文件
+ babel-loader：把 ES next 转换成 ES5
+ css-loader：加载css，支持模块化、压缩、文件导入等特性
+ style-loader：把 css 代码注入到 JavaScript 中，通过 DOM 操作去加载 css
+ eslint-loader：通过 ESLint 检测 JavaScript 代码

## 有哪些常见的 plugin ？他们是解决什么问题的

+ UglifyJsPlugin：通过 UglifyES 压缩 ES6 代码
+ HotModuleReplacementPlugin: 热更新
+ happypack：通过多进程模型，来加速代码构建
+ compression-webpack-plugin：生产环境可采用gzip压缩JS和CSS
+ DefinePlugin：编译时配置全局变量

## Loader 和 Plugin 的不同

+ loader：webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，如果需要将其他文件也打包的话，就会用到 loader。loader 的作用就是让 webpack 拥有了**加载和解析非 JavaScript 文件的能力**
+ plugin：是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它给 Webpack 带来了很大的灵活性。 通过plugin（插件）webpack 可以实 loader 所不能完成的复杂功能，使用 plugin 丰富的自定义 API 以及生命周期事件，可以控制 webpack 打包流程的每个环节，实现对 webpack 的自定义功能扩展。

## webpack 的构建流程是什么？ 请详述从读取配置到输出文件这个过程

1. 初始化参数：从配置文件和 Shell 语句中读取参数，合并两边的参数，得出最终的配置结果。
2. 开始编译(compile)：用上一个得到的参数初始化 Cmopiler 对象，注册所有配置的插件，让插件监听webpack构建生命周期的事件节点。
3. 确定入口：根据配置的 entry 入口文件开始解析文件构建 AST 语法树，递归所有入口依赖的文件
4. 模块编译：在解析文件递归的过程中根据文件类型和 loader 配置招数时候的 loader 对文件进行转换
5. 输出资源：根据 entry 配置生成许多模块 chunk，再把每个 chunk 转换成一个单独文件加入的输出列表，这也是可以修改输出内容的最后机会
6. 输出完成：根据配置确定输出的路径和文件名，吧文件内容写入文件系统。

## 抽象语法树 AST

### 什么是 抽象语法树

抽象语法树（Abstract Syntax Tree）也称为AST语法树，指的是源代码语法所对应的树状结构。通俗的讲就是将 JavaScript 代码解析成一个 json 对象

### AST 的三板斧

+ 通过 esprima 生成 AST
+ 通过 estraverse 遍历和更新 AST
+ 通过 escodegen 将 AST 重新生成源码

[一看就懂的JS抽象语法树](https://juejin.im/post/5a2bf2dd6fb9a044fd11b0d2)

### 常用解析代码构建抽象语法树的工具

+ Esprima
+ recast
+ UglifyJS2
+ Traceur
+ acorn
+ espree eslint
+ Shift

## 是否写过 Loader 和 Plugin ？描述一下编写 loader 或 plugin 的思路

## webpack 的热更新如何做到的？说明其原理

## 如何利用 webpack 来优化前端性能

+ 压缩代码文件。
+ 利用 CDN 加速，要注意部署环境是否有网络支持，不支持则不能使用该方法
+ 删除死代码（Tree Shaking）
+ 自己编写代码时要注意避免重复写重复功能的代码，利用设计模式去提炼代码

## 如何提高 webpack 的构建速度

+ 多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
+ 通过 externals 配置来提取常用库

[Webpack 4 构建大型项目实践 / 优化](https://juejin.im/post/5d2450c6f265da1ba64813a4)

## 怎么配置单页应用？怎么配置多页应用

## npm 打包时需要注意哪些？如何利用 webpack 来更好的构建

## 如何在 vue 项目中实现按需加载

## tree shaking

tree shaking 之所以能够实现的原因是得益于 ES module 的提出，因为 ES 的模块规范是只允许 import 时的模块名是字符串常量，且模块的引用是一种强绑定，一种动态只读引用，也就是说 ES 的模块规范不依赖于运行时的状态，这使得静态分析能够是可靠的。

+ tree shaking 对于函数有效
+ tree shaking 对于类方法有效
+ tree shaking 能像传统的 DCE 一样清除不能达到的代码
+ import * as ( export default )可以被 tree shaking 优化

### import * as 可以被 tree shaking 优化吗

可以的。前提条件是 `import * as` 赋值的变量名，在代码中没有被引用。具体可以看下面的例子

```js
import * as util from './util'

const util2 = util

function main() {
  const name = util.getName()
  console.log(name)
}

main()
```

这个例子中由于 util 赋值给了 util2 这个操作会导致 tree shaking 失效

[webpack 之 tree shaking](https://github.com/huruji/blog/issues/66)

### 如何使用

webpack4 中只要将 mode 设置为 production 模式即可开启 tree shaking

### 原理

Tree-shaking 的本质是消除无用的js代码。无用代码消除在广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为 DCE（dead code elimination）。

### 副作用 （side effects）

`side effects` 是指那些当 `import` 的时候会执行一些动作，但是不一定会有任何 `export`。比如 `polyfill`，我们 `import 'polyfill'` 就会导致模块内的方法执行，虽然没有 `export` 任何方法，但是这个 `import` 动作会产生副作用，使原本当前环境不具备的方法得以运行。

所以 tree shaking 对于有副作用的 `import` 不能够简单消除这些方法。而且 tree shaking 无法静态分析 `import` 是否有副作用所以，对于 `import` 无法自动优化

目前可以在 package.json 文件中的 sideEffects 属性来配置。`false` 表示所有代码都不包含副作用。如果有一些代码有一些副作用，那么可以将这个属性改为提供一个数组

```json
{
  "name": "tree-shaking",
  "sideEffects": [
    "./src/common/polyfill.js"
  ]
}
```

[Tree-Shaking性能优化实践 - 原理篇](https://juejin.im/post/5a4dc842518825698e7279a9)

[你的Tree-Shaking并没什么卵用](https://juejin.im/post/5a5652d8f265da3e497ff3de#heading-3) 这篇文章中提到的问题目前已被优化。

## webpack 原理之提取公共文件

[webpack学习(七) -- 提取公共js代码](https://juejin.im/post/5caff6556fb9a068b03756c6)

## hard-source-webpack-plugin

HardSourceWebpackPlugin是webpack的插件，可为模块提供中间缓存步骤。 为了查看结果，您需要使用此插件运行两次webpack：第一次构建将花费正常时间。 第二个版本将明显更快

[HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin)

## SplitChunks

### splitChunks.chunks

chunks: 表示哪些代码需要优化，有三个可选值：`initial`(初始块)、`async` (按需加载块)、`all` (全部块)，默认为 `async`

里面有提到 `initial` 模式下会分开优化打包异步和非异步模块。而all会把异步和非异步同时进行优化打包。也就是说 moduleA 在indexA 中异步引入，indexB 中同步引入，`initial` 下 moduleA 会出现在两个打包块中，而 `all` 只会出现一个。

[webpack SplitChunksPlugin实用指南](https://juejin.im/post/5b99b9cd6fb9a05cff32007a)

## Runtime

在浏览器运行过程中，webpack 用来连接模块化应用程序所需的所有代码。

## Manifest

当编译器（compiler）开始执行、解析和映射应用程序时，它会保留所有模块的详细要点，这个数据集合称之为 Manifest
