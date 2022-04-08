# vscode

vscode 架构非常复杂，但源码非常清晰，极少第三方依赖，核心模块都是自己实现的，这点我非常喜欢。包括依赖注入、模块加载（拦截加载器）、插件系统、语言服务、调试器前端及调试器协议

## 服务注册，与依赖注入

```ts
class SyncDescriptor<T> {

	readonly ctor: any;
	readonly staticArguments: any[];
	readonly supportsDelayedInstantiation: boolean;

	constructor(ctor: new (...args: any[]) => T, staticArguments: any[] = [], supportsDelayedInstantiation: boolean = false) {
		this.ctor = ctor;
		this.staticArguments = staticArguments;
		this.supportsDelayedInstantiation = supportsDelayedInstantiation;
	}
}
```

```ts
class InstantiationService implements IInstantiationService {
  ...

  invokeFunction<R, TS extends any[] = []>(fn: (accessor: ServicesAccessor, ...args: TS) => R, ...args: TS): R {
		let _trace = Trace.traceInvocation(fn);
		let _done = false;
		try {
			const accessor: ServicesAccessor = {
				get: <T>(id: ServiceIdentifier<T>, isOptional?: typeof optional) => {

					if (_done) {
						throw illegalState('service accessor is only valid during the invocation of its target method');
					}
          // _getOrCreateServiceInstance
					const result = this._getOrCreateServiceInstance(id, _trace);
					if (!result && isOptional !== optional) {
						throw new Error(`[invokeFunction] unknown service '${id}'`);
					}
					return result;
				}
			};
			return fn(accessor, ...args);
		} finally {
			_done = true;
			_trace.stop();
		}
	}
  ...
}
```

这里 `_getOrCreateServiceInstance` 最终调用 `_createAndCacheServiceInstance`

```ts
class InstantiationService implements IInstantiationService {
  ...
  private _createAndCacheServiceInstance<T>(id: ServiceIdentifier<T>, desc: SyncDescriptor<T>, _trace: Trace): T {

		type Triple = { id: ServiceIdentifier<any>, desc: SyncDescriptor<any>, _trace: Trace; };
		const graph = new Graph<Triple>(data => data.id.toString());

		let cycleCount = 0;
		const stack = [{ id, desc, _trace }];
    // 遍历 Service 的依赖存放在 graph 中
		while (stack.length) {
			const item = stack.pop()!;
			graph.lookupOrInsertNode(item);

			// a weak but working heuristic for cycle checks
			if (cycleCount++ > 1000) {
				throw new CyclicDependencyError(graph);
			}

			// check all dependencies for existence and if they need to be created first
			for (let dependency of _util.getServiceDependencies(item.desc.ctor)) {

				let instanceOrDesc = this._getServiceInstanceOrDescriptor(dependency.id);
				if (!instanceOrDesc && !dependency.optional) {
					console.warn(`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`);
				}

				if (instanceOrDesc instanceof SyncDescriptor) {
					const d = { id: dependency.id, desc: instanceOrDesc, _trace: item._trace.branch(dependency.id, true) };
					graph.insertEdge(item, d);
					stack.push(d);
				}
			}
		}

    // 遍历 graph 初始化依赖 Service
		while (true) {
			const roots = graph.roots();

			// if there is no more roots but still
			// nodes in the graph we have a cycle
			if (roots.length === 0) {
				if (!graph.isEmpty()) {
					throw new CyclicDependencyError(graph);
				}
				break;
			}

			for (const { data } of roots) {
				// Repeat the check for this still being a service sync descriptor. That's because
				// instantiating a dependency might have side-effect and recursively trigger instantiation
				// so that some dependencies are now fullfilled already.
				const instanceOrDesc = this._getServiceInstanceOrDescriptor(data.id);
				if (instanceOrDesc instanceof SyncDescriptor) {
					// create instance and overwrite the service collections
					const instance = this._createServiceInstanceWithOwner(data.id, data.desc.ctor, data.desc.staticArguments, data.desc.supportsDelayedInstantiation, data._trace);
					this._setServiceInstance(data.id, instance);
				}
				graph.removeNode(data);
			}
		}
		return <T>this._getServiceInstanceOrDescriptor(id);
  }
  ...
}
```

## 基本方法封装

### 事件

```ts
function once<T extends Function>(this: unknown, fn: T): T {
  const _this = this;
  let didCall = false;
  let result: unknown;

  return function() {
    if (didCall) {
      return result;
    }

    didCall = true;
    result = fn.apply(_this, arguments);
    
    return result;
  } as unknown as T;
}
```

