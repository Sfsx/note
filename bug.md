# bug

## 使用 import() 在生产环境无法找到模块 code：MODULE_NOT_FOUND

如果代码被 webpack 打包，那么代码中的 `import(foo)` 就会报错，因为

[Dynamic expressions in import()
](https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import)

## redis keys 正则匹配操作引起性能问题

redis 是单线程的，其所有操作都是源自的，不会因为并发产生数据异常

1. 线上 redis 禁止使用 Key 正则匹配操作

    redis 是单线程处理，在现实 Key 数量较多时，keys 正则匹配效率极低（时间复杂度为 O(N)），该命令一旦执行会严重阻塞线程导致，其他请求无法正常处理，在高QPS情况下会直接造成 Redis 服务崩溃！

    可以使用 scan 命令，或者将正则表达式作为 key，将其模糊匹配结果作为 value，当作是一条记录存放在 redis 中。

2. 冷热数据分离，不要将所有数据全部放到 redis 中
3. 不同的业务数据要分开存储
4. 存储的 Key 一定要设置超时时间
5. 对于必须要存储的大文本数据一定要压缩后存储

    对于大文本（>500kb）
