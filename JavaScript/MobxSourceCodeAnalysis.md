# Mobx

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
          // ...
        )
    // Should not be possible to change observed state outside strict mode, except during initialization, see #563
    if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "strict"))
        fail(
          // ...
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

    // ...

    while (allReactions.length > 0) {
        if (++iterations === MAX_REACTION_ITERATIONS) {
            console.error(
                `Reaction doesn't converge to a stable state after ${MAX_REACTION_ITERATIONS} iterations.` +
                    ` Probably there is a cycle in the reactive function: ${allReactions[0]}`
            )
            allReactions.splice(0) // clear reactions
        }

        // ...
  
    }
    globalState.isRunningReactions = false
}
```

### 将类的属性直接定义再构造函数的参数中 仅在typescript有效

```js
export class Reaction implements IDerivation, IReactionPublic {

    // ...

    constructor(
        public name: string = "Reaction@" + getNextId(),
        private onInvalidate: () => void,
        private errorHandler?: (error: any, derivation: IDerivation) => void
    ) {}
}
```

## 思想

![流程图](https://pic1.zhimg.com/80/v2-0f09f47435d29ac7a01a12228e0f73b4_hd.jpg)

观察对象 observable 身兼多种能力。数据变更前，会执行 interceptor 拦截函数；数据变更后，执行 listener 监听函数，并将变更信息上报给全局监听器。在全局监听器中，startBatch, endBatch 用于开启、结束事务。事务执行过程中，将统计哪些观察者 observer 所观察的数据发生了变更、需要重新执行；在事务的尾端，通过 runAction 方法调用这些观察者的实际处理逻辑。

## Obaservable

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
reportChanged
  -> propagateChanged
  -> propagateMaybeChanged
  -> runReaction
  -> track
  -> get
  -> computeValue
  -> bindDependencies
```

## autorun

## shouldCompute

Derivation 的 dependenciesState 属性  
Observable 的 lowestObserverState 属性  
4个枚举值：

1. `NOT_TRACKING`：在执行之前，或事务之外，或未被观察(计算值)时，所处的状态。此时 Derivation 没有任何关于依赖树的信息。枚举值 `-1`
2. `UP_TO_DATE`：表示所有依赖都是最新的，这种状态下不会重新计算。枚举值 `0`
3. `POSSIBLY_STALE`：计算值才有的状态，表示深依赖发生了变化，但不能确定浅依赖是否变化，在重新计算之前会检查。枚举值 `1`
4. `STALE`：过期状态，即浅依赖发生了变化，Derivation 需要重新计算。枚举值 `2`

shouldCompute 则依据这四个状态执行相应的调整策略

### only autorun

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

```js
(O1) reportChange
  -> (O1) startBatch
    -> (O1) propagateChanged
    -> (R1) onBecomeStale
  -> (O1) endBatch
    -> (R1) runReaction（到这里才让探长执行 `runReaction`）
      -> (R1) trackDerivedFunction
        -> fn(即执行 autorun 中的回调)
```

### 1 compute

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

```js
(O1) reportChange
-> (O1) startBatch
  -> (O1) propagateChanged （O1.l -1 -> 2，C1.d 0 -> 2）
    -> (C1) propagateMaybeChanged （C1.l 0 -> 1， R1.d 0 -> 1）
    -> (R1) onBecomeStale（这里并不会让探长 `runReaction`）
-> (O1) endBatch
  -> (R1) runReaction（到这里才让探长执行 `runReaction`）
    -> (C1) get
      -> (C1) reportObserved
      -> (C1) shouldCompute
        -> (C1) trackAndCompute
          -> (C1) trackDerivedFunction （C1.d 2 -> 0 O1.l 2 -> 0）
        -> (C1) propagateChangeConfirmed （C1.l 1 -> 2，R1.d 1 -> 2）
      -> (R1) trackDerivedFunction （R1.d 2 -> 0，C1.l 2 -> 0）
        -> fn(即执行 autorun 中的回调)
```

### 2 compute

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

```js
(O2) reportChange
  -> (O2) propagateChanged（O2.l -1 -> 2，C1.d 0 -> 2）
    -> (C1) propagateMaybeChanged（C1.l 0 -> 1， C2.d 0 -> 1）
    -> (C2) propagateMaybeChanged（C2.l 0 -> 1， R1.d 0 -> 1）
    -> (R1) onBecomeStale（这里并不会让探长 `runReaction`）
-> (O2) endBatch
  -> (R1) runReaction（到这里才让探长执行 `runReaction`）
    -> (R1) shouldCompute
      -> (C2) shouldCompute
        -> (C1) shouldCompute
        -> (C1) trackAndCompute（C1.d 2 -> 0 O1.l 2 -> 0）
        -> (C1) propagateChangeConfirmed（C1.l 1 -> 2，C2.d 1 -> 2）
      -> (C2) trackAndCompute（C2.d 2 -> 0 C1.l 2 -> 0）
      -> (C2) propagateChangeConfirmed（C2.l 1 -> 2，R1.d 1 -> 2）
    -> (R1)trackDerivedFunction（R1.d 2 -> 0，C2.l 2 -> 0）
      -> fn(即执行 autorun 中的回调)
```

## 参考资料

[郭琛 Mobx 源码解读 系列](https://zhuanlan.zhihu.com/p/31704920)

[修范 Mobx 源码分析 系列](https://zhuanlan.zhihu.com/p/42150181)

[用故事解读 Mobx 源码 系列](https://segmentfault.com/a/1190000013682735#articleHeader13)