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

将模块加载后放在一个对象上面

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

+ loader：webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，如果需要将其他文件也打包的话，就会用到 loader。loader 的作用就是让 webpack 拥有了加载和**解析非JavaScript文件**的能力
+ plugin：在 webpack 运行的什么周期中会广播出许多事件，plugin 可以监听这些事件，通过 webpack 提供的 API 改变输出结果。可以打包优化，资源管理和注入环境变量和全局变量

## webpack 的构建流程是什么？ 请详述从读取配置到输出文件这个过程

1. 初始化参数：从配置文件和 Shell 语句中读取参数，合并两边的参数，得出最终的配置结果。
2. 开始编译：用上一个得到的参数初始化 Cmopiler 对象，注册所有配置的插件，让插件监听webpack构建生命周期的事件节点。
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

## 如何提高 webpack 的构建速度

## 怎么配置单页应用？怎么配置多页应用

## npm 打包时需要注意哪些？如何利用 webpack 来更好的构建

## 如何在 vue 项目中实现按需加载
