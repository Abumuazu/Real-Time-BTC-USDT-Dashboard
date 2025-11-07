export class RingBuffer<T> {
  private buf: Array<T | undefined>
  private head = 0
  private size = 0
  constructor(private capacity: number) {
    this.buf = new Array(capacity)
  }
  push(item: T) {
    this.buf[(this.head + this.size) % this.capacity] = item
    if (this.size < this.capacity) {
      this.size++
    } else {
      this.head = (this.head + 1) % this.capacity
    }
  }
  shiftAll(): T[] {
    const out: T[] = []
    for (let i = 0; i < this.size; i++) {
      const idx = (this.head + i) % this.capacity
      const v = this.buf[idx]
      if (v !== undefined) out.push(v as T)
      this.buf[idx] = undefined
    }
    this.head = 0
    this.size = 0
    return out
  }
  clear() {
    this.head = 0
    this.size = 0
    this.buf.fill(undefined)
  }
}
