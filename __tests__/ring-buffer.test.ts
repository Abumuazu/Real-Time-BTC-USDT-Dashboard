import { RingBuffer } from "../app/shared/lib/ring-buffer";
test("ring buffer keeps only capacity and shifts in order", () => {
  const buf = new RingBuffer<number>(3);
  buf.push(1); buf.push(2); buf.push(3); buf.push(4);
  const out = buf.shiftAll();
  expect(out).toEqual([2,3,4]);
});
