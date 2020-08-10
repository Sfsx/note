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

## 源码问题

### 为什么 render 属性需要写成一个函数，在利用 call 绑定函数作用域为 vm._renderProxy 并将 vm.$createElement 作为默认参数进行调用

```js
render: function (createElement) {
  return createElement('div', {
    attrs: {
      id: 'app'
    },
  }, this.message)
}

vnode = render.call(vm._renderProxy, vm.$createElement)

export function initRender (vm: Component) {
  // ...
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}
```

### 组件注册

这里先看看 `Vue.component` 函数的定义

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```

**这里需要特别注意这里组件的构造函数是挂载在 Vue 对象上**，
而执行

```js
new Vue({ /* ... */ })
```

时会执行

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

在 `mergeOptions` 中对于 `option.component` 的合并方法如下

```js
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})
```

通过 `Object.create` 将 `Vue.options.components` 作为构造函数原型创建其实例，这个实例作为 `vm.$options.component` 的值

## 组建 patch 时判断新旧组建的 vnode 是否一致

```js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

`sameVnode` 的逻辑非常简单，如果两个 `vnode` 的 `key` 不相等，则是不同的；否则继续判断对于同步组件，则判断 `isComment`、`data`、`input` 类型等是否相同，对于异步组件，则判断 `asyncFactory` 是否相同。

## vue 组件通信

+ vuex 使用 vuex npm 包
+ pubsub-js 使用 pubsub-js npm 包
+ emit / on，vue 原生
+ props，vue 原生
+ event bus 将一个无关 dom 的 vue 实例作为事件中心，通过该实例发送和接受消息，在需要通信的组件中引入该实例即可
