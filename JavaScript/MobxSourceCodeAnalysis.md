# Mobx

## 思想

![流程图](https://pic1.zhimg.com/80/v2-0f09f47435d29ac7a01a12228e0f73b4_hd.jpg)

观察对象 observable 身兼多种能力。数据变更前，会执行 interceptor 拦截函数；数据变更后，执行 listener 监听函数，并将变更信息上报给全局监听器。在全局监听器中，startBatch, endBatch 用于开启、结束事务。事务执行过程中，将统计哪些观察者 observer 所观察的数据发生了变更、需要重新执行；在事务的尾端，通过 runAction 方法调用这些观察者的实际处理逻辑。

## Obaservable

### createObservable

**策略设计模式**：将多种数据类型（Object、Array、Map）情况的转换封装起来，好让调用者不需要关心实现细节

```js
function createObservable(v: any, arg2?: any, arg3?: any) {
    ...
    // something that can be converted and mutated?
    const res = isPlainObject(v)
        ? observable.object(v, arg2, arg3)
        : Array.isArray(v)
            ? observable.array(v, arg2)
            : isES6Map(v)
                ? observable.map(v, arg2)
                : isES6Set(v)
                    ? observable.set(v, arg2)
                    : v

    // this value could be converted to a new observable data structure, return it
    if (res !== v) return res
    ...
}
```

魔术。通过 `forEach` 将 `observableFactories` 中的方法注入到 `observable`。并将 `createObservable` 赋给 `observable`。

```js
export const observable: IObservableFactory &
    IObservableFactories & {
        enhancer: IEnhancer<any>
    } = createObservable as any

// weird trick to keep our typings nicely with our funcs, and still extend the observable function
Object.keys(observableFactories).forEach(name => (observable[name] = observableFactories[name]))
```

### observable.box

```js
box<T = any>(value?: T, options?: CreateObservableOptions): IObservableValue<T> {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("box")
    const o = asCreateObservableOptions(options)
    return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals)
}
```

仅仅只是返回 `ObservableValue` 实例

#### ObservableValue

##### Atom

`ObservableValue` 继承于 `Atom`

`Atom` 实例有两项重大的使命：

+ `reportObserved()`
+ `reportChanged()`

##### Intercept & Observe

`ObservableValue` 其实就是继承一下 `Atom` 这个类，然后再添加许多辅助的方法和属性就可以了。我们讲一下其中比较有意思的 `Intercept()` 和 `Observe()` 方法

如果把 “对象变更” 作为事件，那么我们可以在 **事件发生之前** 和 **事件方法之后** 这两个 “切面” 分别可以安插回调函数（callback），方便程序动态扩展，这属于 **[面向切面编程的思想](https://www.zhihu.com/question/24863332)**。

+ `intercept`: change 事件发生之前
+ `observe`: change 事件发生之后

Intercept & Observe 这两个函数返回一个 disposer 函数，这个函数是 解绑函数，调用该函数就可以取消拦截器或者监听器 了。这里有一个最佳实践，如果不需要某个拦截器或者监听器了，记得要及时清理自己绑定的监听函数 永远要清理 reaction —— 即调用 disposer 函数

##### enhancer

```js
export class ObservableValue<T> extends Atom
    implements IObservableValue<T>, IInterceptable<IValueWillChange<T>>, IListenable {
    ...
    constructor(
        value: T,
        public enhancer: IEnhancer<T>,
        public name = "ObservableValue@" + getNextId(),
        notifySpy = true,
        private equals: IEqualsComparer<any> = comparer.default
    ) {
        super(name)
        this.value = enhancer(value, undefined, name)
        if (notifySpy && isSpyEnabled() && process.env.NODE_ENV !== "production") {
            // only notify spy if this is a stand-alone observable
            spyReport({ type: "create", name: this.name, newValue: "" + this.value })
        }
    }
    ...
}
```

### observable.object

```js
object<T = any>(
        props: T,
        decorators?: { [K in keyof T]: Function },
        options?: CreateObservableOptions
    ): T & IObservableObject {
        if (typeof arguments[1] === "string") incorrectlyUsedAsDecorator("object")
        const o = asCreateObservableOptions(options)
        if (o.proxy === false) {
            return extendObservable({}, props, decorators, o) as any
        } else {
            const defaultDecorator = getDefaultDecoratorFromObjectOptions(o)
            const base = extendObservable({}, undefined, undefined, o) as any
            const proxy = createDynamicObservableObject(base)
            extendObservableObjectWithProperties(proxy, props, decorators, defaultDecorator)
            return proxy
        }
    }
```

上面代码可知主要调用了三个方法，分别是：`createDynamicObservableObject` 、`createDynamicObservableObject` 和 `extendObservableObjectWithProperties` 下面我们来分析一下这三个方法。

#### `extendObservable()`

```js
export function extendObservable<A extends Object, B extends Object>(
    target: A,
    properties?: B,
    decorators?: { [K in keyof B]?: Function },
    options?: CreateObservableOptions
): A & B {
    ...
    initializeInstance(target) // Fixes #1740
    asObservableObject(target, options.name, defaultDecorator.enhancer) // make sure object is observable, even without initial props
    ...
}
```

通过 `extendObservable` 函数的调用参数可以看出，target 是一个空对象，即该函数主要目的就是装饰这个空对象。实际执行的语句只有上图所示的两句。

`asObservableObject` 通过 `ObservableObjectAdministration` 里面封装了后续被拦截的原生方法的改写，并存放于空对象的 `Symbol('mobx administration')` 属性中

#### `createDynamicObservableObject()`

将 `objectProxyTraps` 对象通过 `proxy` 代理到上一步生成的对象。

查看源码可以发现 `objectProxyTraps` 对象中，封装了对 `get`、`has`、`set`、`deleteProperty`、`ownKeys` 操作的代理，这个代理的本质就是调用对象 `Symbol('mobx administration')` 属性上的 `ObservableObjectAdministration` 对象中封装的相应方法，来代替对象的原生操作。

#### `extendObservableObjectWithProperties`

`extendObservableObjectWithProperties`，挨个让原始对象的每个属性经过 `decorator` 改造后重新安装到 `target` 上

## Derivation

Derivation 即能够从当前状态「衍生」出来的对象，包括计算值和 Reaction。Mobx 中通过 Derivation 注册响应函数，响应函数中所使用到的 Observable 称为它的依赖，依赖过期时 Derivation 会重新执行，更新依赖。

```js
export interface IDerivation extends IDepTreeNode {
    observing: IObservable[]
    newObserving: null | IObservable[]
    dependenciesState: IDerivationState
    /**
     * Id of the current run of a derivation. Each time the derivation is tracked
     * this number is increased by one. This number is globally unique
     */
    runId: number
    /**
     * amount of dependencies used by the derivation in this run, which has not been bound yet.
     */
    unboundDepsCount: number
    __mapid: string
    onBecomeStale(): void
    isTracing: TraceMode
}
```

## computed

computed 具体流程

```js
(O1) reportChange
-> (O1) startBatch
  -> (O1) propagateChanged // O1.l -1 -> 2，C1.d 0 -> 2
    -> (C1) propagateMaybeChanged // C1.l 0 -> 1， R1.d 0 -> 1
    -> (R1) onBecomeStale // 这里并不会让探长 runReaction
-> (O1) endBatch
  -> (R1) runReaction // 到这里才让探长执行 runReaction
    -> (C1) get
      -> (C1) reportObserved
      -> (C1) shouldCompute
        -> (C1) trackAndCompute
          -> (C1) trackDerivedFunction // C1.d 2 -> 0 O1.l 2 -> 0
        -> (C1) propagateChangeConfirmed // C1.l 1 -> 2，R1.d 1 -> 2
      -> (R1) trackDerivedFunction // R1.d 2 -> 0，C1.l 2 -> 0
        -> fn() // 即执行 autorun 中的回调
```

## autorun

## shouldCompute

`Derivation` 的 `dependenciesState` 属性  
`Observable` 的 `lowestObserverState` 属性  
4个枚举值：

1. `NOT_TRACKING`：在执行之前，或事务之外，或未被观察(计算值)时，所处的状态。此时 `Derivation` 没有任何关于依赖树的信息。枚举值 `-1`
2. `UP_TO_DATE`：表示所有依赖都是最新的，这种状态下不会重新计算。枚举值 `0`
3. `POSSIBLY_STALE`：计算值才有的状态，表示深依赖发生了变化，但不能确定浅依赖是否变化，在重新计算之前会检查。枚举值 `1`
4. `STALE`：过期状态，即浅依赖发生了变化，`Derivation` 需要重新计算。枚举值 `2`

`shouldCompute` 则依据这四个状态执行相应的调整策略

### case only autorun

code 代码:

```js
var bankUser = mobx.observable({
  income: 3,
  debit: 2
});

mobx.autorun(() => {
  console.log('张三的存贷：', income);
});

bankUser.income = 4;
```

flow 流程:

```js
(O1) reportChange
    -> (O1) startBatch
      -> (O1) propagateChanged
        -> (R1) onBecomeStale
    -> (O1) endBatch
      -> (R1) runReaction // 到这里才让探长执行 runReaction
        -> (R1) trackDerivedFunction
          -> fn() // 即执行 autorun 中的回调
```

### case 1 compute

code 代码:

```js
var bankUser = mobx.observable({
  income: 3,
  debit: 2
});

var divisor = mobx.computed(() => {
  return bankUser.income / bankUser.debit;
});

mobx.autorun(() => {
  console.log('张三的 divisor：', divisor);
});

bankUser.income = 4;
```

flow 流程:

```js
(O1) reportChange
-> (O1) startBatch
  -> (O1) propagateChanged // O1.l -1 -> 2，C1.d 0 -> 2
    -> (C1) propagateMaybeChanged // C1.l 0 -> 1， R1.d 0 -> 1
    -> (R1) onBecomeStale // 这里并不会让探长 runReaction
-> (O1) endBatch
  -> (R1) runReaction // 到这里才让探长执行 runReaction
    -> (C1) get
      -> (C1) reportObserved
      -> (C1) shouldCompute
        -> (C1) trackAndCompute
          -> (C1) trackDerivedFunction // C1.d 2 -> 0 O1.l 2 -> 0
        -> (C1) propagateChangeConfirmed // C1.l 1 -> 2，R1.d 1 -> 2
      -> (R1) trackDerivedFunction // R1.d 2 -> 0，C1.l 2 -> 0
        -> fn() // 即执行 autorun 中的回调
```

### case 2 compute

code 代码:

```js
var bankUser = mobx.observable({
  income: 3,
  debit: 2
});

var divisor = mobx.computed(() => {
  return bankUser.income / bankUser.debit;
});

var indication = mobx.computed(() => {
  return divisor / (bankUser.income + 1);
});

mobx.autorun(() => {
  console.log('张三的 indication', indication);
});

bankUser.debit = 4;
```

flow 流程:

```js
(O2) reportChange
  -> (O2) propagateChanged // O2.l -1 -> 2，C1.d 0 -> 2）
    -> (C1) propagateMaybeChanged // C1.l 0 -> 1， C2.d 0 -> 1）
    -> (C2) propagateMaybeChanged // C2.l 0 -> 1， R1.d 0 -> 1）
    -> (R1) onBecomeStale // 这里并不会让探长 runReaction
-> (O2) endBatch
  -> (R1) runReaction // 到这里才让探长执行runReaction
    -> (R1) shouldCompute
      -> (C2) shouldCompute
        -> (C1) shouldCompute
        -> (C1) trackAndCompute // C1.d 2 -> 0 O1.l 2 -> 0
        -> (C1) propagateChangeConfirmed // C1.l 1 -> 2，C2.d 1 -> 2
      -> (C2) trackAndCompute // C2.d 2 -> 0 C1.l 2 -> 0
      -> (C2) propagateChangeConfirmed // C2.l 1 -> 2，R1.d 1 -> 2
    -> (R1)trackDerivedFunction // R1.d 2 -> 0，C2.l 2 -> 0
      -> fn() // 即执行 autorun 中的回调
```

## 代码姿势

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
          ...
        )
    // Should not be possible to change observed state outside strict mode, except during initialization, see #563
    if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "strict"))
        fail(
          ...
        )
}
```

### 将计数和判断写在同一行

```js
if (++iterations === MAX_REACTION_ITERATIONS) {
  // ...
}
```

```js
function runReactionsHelper() {
    ...
    while (allReactions.length > 0) {
        if (++iterations === MAX_REACTION_ITERATIONS) {
            console.error(
                `Reaction doesn't converge to a stable state after ${MAX_REACTION_ITERATIONS} iterations.` +
                    ` Probably there is a cycle in the reactive function: ${allReactions[0]}`
            )
            allReactions.splice(0) // clear reactions
        }
        ...
    }
    globalState.isRunningReactions = false
}
```

### 将类的属性直接定义再构造函数的参数中 仅在typescript有效

```js
export class Reaction implements IDerivation, IReactionPublic {
    ...
    constructor(
        public name: string = "Reaction@" + getNextId(),
        private onInvalidate: () => void,
        private errorHandler?: (error: any, derivation: IDerivation) => void
    ) {}
    ...
}
```

### 闭包运用

```js
export function registerListener(listenable: IListenable, handler: Function): Lambda {
    const listeners = listenable.changeListeners || (listenable.changeListeners = [])
    listeners.push(handler)
    return once(() => {
        const idx = listeners.indexOf(handler)
        if (idx !== -1) listeners.splice(idx, 1)
    })
}

function once(func) {
  var invoked = false;
  return function() {
    if (invoked) return;
    invoked = true;
    return func.apply(this, arguments);
  };
}
```

上面的代码中有两个闭包

+ 通过闭包保存标识符 `handler`，返回一个删除函数，使用者无需知道标识符，只要调用删除函数，就能删除监听队列中的 `handler`
+ `once` 函数，将闭包的精髓运用到恰到好处

## 参考资料

[郭琛 Mobx 源码解读 系列](https://zhuanlan.zhihu.com/p/31704920)

[修范 Mobx 源码分析 系列](https://zhuanlan.zhihu.com/p/42150181)

[用故事解读 Mobx 源码 系列](https://segmentfault.com/a/1190000013682735#articleHeader13)

## 相关补充

### 策略模式

策略模式指的是定义一系列的算法，把它们一个个封装起来，将不变的部分和变化的部分隔开，实际就是将算法的使用和实现分离出来

```js
var calculateBouns = function(salary,level) {
    if(level === 'A') {
        return salary * 4;
    }
    if(level === 'B') {
        return salary * 3;
    }
    if(level === 'C') {
        return salary * 2;
    }
};
// 调用如下：
console.log(calculateBouns(4000,'A')); // 16000
console.log(calculateBouns(2500,'B')); // 7500
```

代码缺点如下：

1. calculateBouns 函数包含了很多if-else语句。
2. calculateBouns 函数缺乏弹性，假如还有D等级的话，那么我们需要在calculateBouns 函数内添加判断等级D的if语句；
3. 算法复用性差，如果在其他的地方也有类似这样的算法的话，但是规则不一样，我们这些代码不能通用。

Javascript版本的策略模式重构：

```js
var obj = {
    "A": function(salary) {
        return salary * 4;
    },
    "B" : function(salary) {
        return salary * 3;
    },
    "C" : function(salary) {
        return salary * 2;
    }
};
var calculateBouns =function(level, salary) {
    return obj[level](salary);
};
console.log(calculateBouns('A', 10000)); // 40000
```

可以看到代码更加简单明了；

[深入理解JavaScript系列（33）：设计模式之策略模式](http://www.cnblogs.com/TomXu/archive/2012/03/05/2358552.html)

[理解 JavaScript 中的策略模式](https://juejin.im/entry/59e565f35188250989512689)
