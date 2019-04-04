# Mobx

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