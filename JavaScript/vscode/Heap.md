# 最小堆

```ts
class Heap {
  constructor(min = true) {
    this.heap = [];
    this.size = 0;
    this.min;
  }
  
  push(value) {
    this.size += 1;
    this.heap[this.size] = value;
    this.swim(this.size);
  }

  swim(index) {
    while(index > 1 && this.more(parseInt(index / 2), index)) {
      const mid = parseInt(index / 2);
      this.swap(mid, index);
      index = mid;
    }
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  pop() {
    if (this.size === 0) {
      return undefined;
    }
    this.swap(1, this.size - 1);
    const top = this.heap.pop();
    this.sink(1);
    this.size -= 1;
    return top;
  }

  sink(index) {
    while(2 * index <= this.size) {
      let child = 2 * index;
      if (child < this.size && this.more(child, child + 1)) {
        child += 1;
      }
      if (!this.more(index, child)) {
        break;
      }
      this.swap(index, child);
      index = child;
    }
  }

  more(i, j) {
    const ret = this.heap[i] > this.heap[j];
    return this.min ? ret : !ret;
  }
}
```