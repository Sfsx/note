# 缓存淘汰算法

```ts
class LRUCache<K, V> {
  private map: Map<K, V>;
  private limit: Number;
  private ratio: Number;

  constructor(limit: Number, ratio: Number = 1) {
    this.map = new Map<K, V>();
    this._limit = limit;
    this._ratio = Math.min(Math.max(ratio, 0), 1);
  }

  get limit(): Number {
    return this._limit;
  }

  set limit(limit: number) {
		this._limit = limit;
		this.checkTrim();
	}

  get ratio(): number {
		return this._ratio;
	}

  set ratio(ratio: Number) {
    this._ratio = Math.min(Math.max(ratio, 0), 1);
    this.checkTrim();
  }

  get size(): Number {
    return this.map.size();
  }

  set(key: K, value: V): this {
    this.map.set(key, value);
    this.checkTrim();
    return this;
  }

  get(key: K): V | undefined {
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  checkTrim() {
    if (this.size() > this._limit) {
      
    }
  }
}
```