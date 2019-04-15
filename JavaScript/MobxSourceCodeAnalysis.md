# Mobx

## 代码风格

### 使用 Object.freeze() 用来冻结配置项

### 条件判断封装成语义化的函数

```js
const res = isPlainObject(v)
  ? observable.object(v, arg2, arg3)
  : Array.isArray(v)
    ? observable.array(v, arg2)
    : isES6Map(v)
      ? observable.map(v, arg2)
      : isES6Set(v)
        ? observable.set(v, arg2)
        : v
```

### 先将方法与处理逻辑分开写，将方法写在一个对象中，逻辑写在函数中，再将对象方法注入进函数

```js
// weird trick to keep our typings nicely with our funcs, and still extend the observable function
Object.keys(observableFactories).forEach(name => (observable[name] = observableFactories[name]))
```

### 错误处理

Mobx 从 React 借鉴了 invariant，在条件为 false 时抛出错误：

```js
export function invariant(check: false, message?: string | boolean): never
export function invariant(check: true, message?: string | boolean): void
export function invariant(check: any, message?: string | boolean): void
export function invariant(check: boolean, message?: string | boolean) {
    if (!check) throw new Error("[mobx] " + (message || OBFUSCATED_ERROR))
}
```

还有基于 invariant 的 fail：

```js
export function fail(message: string | boolean): never {
    invariant(false, message)
    throw "X" // unreachable
}
```

对于一些逻辑检测可以写的很简单，不用考虑中断程序，直接写好自己预想的错误信息即可

```js
export function checkIfStateModificationsAreAllowed(atom: IAtom) {
    const hasObservers = atom.observers.size > 0
    // Should never be possible to change an observed observable from inside computed, see #798
    if (globalState.computationDepth > 0 && hasObservers)
        fail(
          // ...
        )
    // Should not be possible to change observed state outside strict mode, except during initialization, see #563
    if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "strict"))
        fail(
          // ...
        )
}
```

## 思想

![流程图](https://pic1.zhimg.com/80/v2-0f09f47435d29ac7a01a12228e0f73b4_hd.jpg)

观察对象 observable 身兼多种能力。数据变更前，会执行 interceptor 拦截函数；数据变更后，执行 listener 监听函数，并将变更信息上报给全局监听器。在全局监听器中，startBatch, endBatch 用于开启、结束事务。事务执行过程中，将统计哪些观察者 observer 所观察的数据发生了变更、需要重新执行；在事务的尾端，通过 runAction 方法调用这些观察者的实际处理逻辑。

## obaservable

1. 使用 Object.freeze() 用来冻结配置项
2. 条件判断封装成语义化的函数

    ```js
    const res = isPlainObject(v)
      ? observable.object(v, arg2, arg3)
      : Array.isArray(v)
        ? observable.array(v, arg2)
        : isES6Map(v)
          ? observable.map(v, arg2)
          : isES6Set(v)
            ? observable.set(v, arg2)
            : v
    ```

3. 魔术。通过 `forEach` 将 `observableFactories` 中的方法注入到 `observable`。

    ```js
    // weird trick to keep our typings nicely with our funcs, and still extend the observable function
    Object.keys(observableFactories).forEach(name => (observable[name] = observableFactories[name]))
    ```

4. 通过 `asObservableObject` 方法创建一个空对象。 `ObservableObjectAdministration` 里面封装了后续被拦截的原生方法的改写，并存放于空对象的 `Symbol('mobx administration')` 属性中
5. 通过 `createDynamicObservableObject` 对空对象进行代理
6. `extendObservableObjectWithProperties`,最终会给原始对象的属性进行装饰，最后调用`ObservableObjectAdministration` 的 `addObservableProp` 方法，针对每一个原始对象的 `key` 生成一个 `ObservableValue`对象，并保存在 `ObservableObjectAdministration` 对象的 `values` 中

## 参考资料

[郭琛 Mobx 源码解读 系列](https://zhuanlan.zhihu.com/p/31704920)

[修范 Mobx 源码分析 系列](https://zhuanlan.zhihu.com/p/42150181)