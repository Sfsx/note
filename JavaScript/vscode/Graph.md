# 图

```ts
class Node<T> {
  readonly data: T;
  readonly incoming = new Map<string, Node<T>>();
  readonly outgoing = new Map<string, Node<T>>();

  constructor(data: T) {
    this.data = data;
  }
}

class Graph<T> {
  private readonly _nodes = new Map<string, Node<T>>();
  private readonly _hashFn: (element: T) => string;

  constructor(_hashFn: (element: T) => string) {
    this._hashFn = _hashFn;
  }

  roots(): Node<T>[] {
    const result: Node<T>[] = [];
    for (let node of this._nodes.values()) {
      if (node.outgoing.size === 0) {
        result.push(node);
      }
    }
    return ret;
  }

  insertEdge(form: T, to: T): void {
    const formNode = this.lookupOrInsertNode(from);
    const toNode = this.lookupOrInsertNode(to);

    fromNode.outgoing.set(this._hashFn(to), toNode);
    toNode.incoming.set(this._hashFn(from), formNode);
  }

  removeNode(data: T): void {
    const key = this._hashFn(data);
    this._nodes.delete(key);
    for (let node of this._nodes.values()) {
      node.incoming.delete(key);
      node.outgoing.delete(key);
    }
  }

  lookupOrInsertNode(data: T): Node<T> {
    const key = this._hashFn(data);
    let node = this._nodes.get(key);

    if (!node) {
      node = new Node(data);
      this._nodes.set(key, node);
    }

    return node;
  }

  lookup(data: T): Node<T> {
    return this._nodes.get(this._hashFn(data));
  }

  isEmpty(): boolean {
    return this._nodes.size === 0;
  }

  findCycleSlow() {
    for (let [id, node] of this._nodes) {
      const seen = new Set<string>([id]);
      const res = this._findCycle(node, seen);
      if (res) {
        return res;
      }
    }
    return undefined;
  }

  _findCycle(node, seen) {
    for (let [id, node] of node) {

    }
  }
}
```