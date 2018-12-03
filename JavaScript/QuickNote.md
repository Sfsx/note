# QucikNote

## koa源码有感
```js
function createServer(res, req) {
    // ....
}

createServer(callback())

function callback(){
    
    const handleRequest = function (res, req) {
        // ....
    };

    reutrn handleRequest;
}
```

## npm bluebird

一个 `promise` 的第三方库 其中一个api:  `Promise.promisify` 将 `node` 的函数转换为 `promise` 封装
```js
/**
Promise.promisify(
    function(any arguments..., function callback) nodeFunction,
    [Object {
        multiArgs: boolean=false,
        context: any=this
    } options]
) -> function
*/

var readFile = Promise.promisify(require("fs").readFile);

readFile("myfile.js", "utf8").then(function(contents) {
    return eval(contents);
}).then(function(result) {
    console.log("The result of evaluating myfile.js", result);
}).catch(SyntaxError, function(e) {
    console.log("File had syntax error", e);
//Catch any other error
}).catch(function(e) {
    console.log("Error reading file", e);
});
```