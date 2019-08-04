# Vue

## 实例

```js
var vm = new Vue({
  data: function () {
    return {
      a: 1
    }
  }
})
// `vm.a` 现在是响应式的

vm.b = 2
// `vm.b` 不是响应式的
```

## 巧妙改进

```js
var vm = new Vue({
  data: function () {
    return {
      count: 0
      a: 1
    }
  }
})
// `vm.a` 现在是响应式的

vm.count++
vm.b = 2
// 由于 `vm.count` 是响应式的，会触发视图更新，`vm.b` 也会更新
```
