# VUE

## 随记

父子 created 和 mounted 执行顺序

```shell
father created
son created
son mounted
father mounted
```

但是如果子组建是动态引入 `() => import(/***/)`，则执行顺序改为

```shell
father created
father mounted
son created
son mounted
```
