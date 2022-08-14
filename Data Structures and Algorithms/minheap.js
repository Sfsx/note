class MiniHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) {
    return (i - 1) >> 1;
  }

  getLeftChildIndex(i) {
    return i * 2 + 1;
  }

  getRightChildIndex(i) {
    return i * 2 + 2;
  }

  pop() {
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
    return this.heap[0];
  }

  insert(data) {
    this.heap.push(data);
    this.shiftUp(this.heap.length - 1);
  }

  swap(a, b) {
    [b, a] = [a, b]
  }

  shiftUp(i) {
    while(i > 0 && this.heap[i] < this.heap[this.getParentIndex(i)]) {
      this.swap(this.heap[i], this.heap[this.getParentIndex(i)]);
      i = this.getRightChildIndex(i);
    }
  }

  shiftDown(i) {
    while(this.heap[i] > this.heap[this.getLeftChildIndex(i)]) {
      this.swap(this.heap[i], this.heap[this.getLeftChildIndex(i)]);
      i = this.getLeftChildIndex(i);
    }
    while(this.heap[i] > this.heap[this.getRightChildIndex(i)]) {
      this.swap(this.heap[i], this.heap[this.getRightChildIndex(i)]);
      i = this.this.getRightChildIndex(i);
    }
  }

  getHeap() {
    return this.heap;
  }
}