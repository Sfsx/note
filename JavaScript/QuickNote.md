```
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