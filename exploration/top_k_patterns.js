/**
 * TOP-K PATTERNS (Priority Queue / Heap Thinking)
 *
 * This file is a mini "workbook" for getting comfortable with Top-K style problems.
 *
 * Focus ideas:
 * - We rarely need a FULL sort for Top-K.
 * - We typically maintain:
 *    - a MIN-HEAP of size k for "k largest" things, or
 *    - a MAX-HEAP of size k for "k smallest" things.
 * - Or we sort only once after aggregating (e.g. frequencies).
 *
 * Run from project root:
 *   node exploration/top_k_patterns.js
 */

// ------------------------------------------------------------
// 0. Tiny MinHeap Implementation (for practice)
// ------------------------------------------------------------

class MinHeap {
  constructor() {
    this.data = [];
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    this.data.push(value);
    this.#heapifyUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this.#heapifyDown(0);
    }
    return top;
  }

  #heapifyUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.data[parent] <= this.data[idx]) break;
      [this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]];
      idx = parent;
    }
  }

  #heapifyDown(idx) {
    const n = this.data.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < n && this.data[left] < this.data[smallest]) {
        smallest = left;
      }
      if (right < n && this.data[right] < this.data[smallest]) {
        smallest = right;
      }
      if (smallest === idx) break;
      [this.data[smallest], this.data[idx]] = [this.data[idx], this.data[smallest]];
      idx = smallest;
    }
  }
}

// ------------------------------------------------------------
// 1. TOP-K LARGEST ELEMENTS (Array)
// ------------------------------------------------------------

/**
 * Simple baseline: sort and take last k.
 * TIME:  O(n log n)
 * SPACE: O(1) extra (if sort in place)
 */
export function topKLargest_sort(nums, k) {
  if (k <= 0) return [];
  if (k >= nums.length) return [...nums].sort((a, b) => b - a);
  const arr = [...nums].sort((a, b) => a - b); // ascending
  return arr.slice(-k).reverse();             // last k, in descending order
}

/**
 * Heap-based: keep a min-heap of size k containing the current k largest.
 *
 * IDEA:
 * - Push numbers into min-heap.
 * - If heap grows bigger than k, pop the smallest.
 * - After processing all numbers, heap contains the k largest (unordered).
 *
 * TIME:  O(n log k)  (better when k << n)
 * SPACE: O(k)
 */
export function topKLargest_heap(nums, k) {
  if (k <= 0) return [];
  if (k >= nums.length) return [...nums].sort((a, b) => b - a);

  const heap = new MinHeap();

  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) {
      heap.pop(); // remove smallest; keep only k largest
    }
  }

  // Now heap.data has the k largest, but not sorted.
  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop());
  }
  // result is ascending smallest→largest; reverse to get largest→smallest
  return result.reverse();
}

// ------------------------------------------------------------
// 2. TOP-K FREQUENT ELEMENTS
// ------------------------------------------------------------

/**
 * Top-K frequent using hashmap + sort.
 *
 * STEPS:
 * 1) Count frequencies in a Map.
 * 2) Convert Map entries to array.
 * 3) Sort by frequency descending.
 * 4) Take first k keys.
 */
export function topKFrequent_sort(nums, k) {
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  const entries = [...freq.entries()]; // [value, count]
  entries.sort((a, b) => b[1] - a[1]); // sort by count descending

  return entries.slice(0, k).map(([val]) => val);
}

/**
 * EXERCISE 1:
 * Implement topKFrequent_heap:
 *  - Use a MIN-HEAP of pairs [count, value].
 *  - Keep heap size <= k.
 *  - At the end, extract the k most frequent values.
 *
 * HINT:
 *  - You can re-use MinHeap but store numbers that encode both count and value
 *    OR modify MinHeap to take a custom comparator (advanced).
 *
 * For now, this function uses the sort-based version directly.
 * Your task: replace the body with a true heap-based solution.
 */
export function topKFrequent_heap(nums, k) {
  // TODO (exercise): implement heap-based version.
  return topKFrequent_sort(nums, k);
}

// ------------------------------------------------------------
// 3. STREAMING K-TH LARGEST (LeetCode 703 style)
// ------------------------------------------------------------

/**
 * KthLargest:
 *  - Initialize with k and an initial array.
 *  - Each `add(val)` inserts a number and returns the current k-th largest value.
 *
 * PATTERN:
 *  - Maintain a MIN-HEAP of size k containing the k largest numbers seen so far.
 *  - The root of the heap is the k-th largest.
 */
export class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = new MinHeap();

    for (const num of nums) {
      this.add(num);
    }
  }

  add(val) {
    this.heap.push(val);
    if (this.heap.size() > this.k) {
      this.heap.pop();
    }
    return this.heap.peek();
  }
}

// ------------------------------------------------------------
// 4. DEMO + PRACTICE RUNNER
// ------------------------------------------------------------

function demoTopK() {
  console.log('===== TOP-K LARGEST DEMO =====');
  const arr = [3, 1, 5, 12, 2, 11];
  const k = 3;
  console.log('Array:', arr, 'k =', k);
  console.log('Sort-based: ', topKLargest_sort(arr, k));
  console.log('Heap-based: ', topKLargest_heap(arr, k));
}

function demoTopKFrequent() {
  console.log('\n===== TOP-K FREQUENT DEMO =====');
  const arr = [1, 1, 1, 2, 2, 3, 3, 3, 3];
  const k = 2;
  console.log('Array:', arr, 'k =', k);
  console.log('Sort-based: ', topKFrequent_sort(arr, k));
  console.log('Heap-based (exercise placeholder): ', topKFrequent_heap(arr, k));
}

function demoKthLargestStream() {
  console.log('\n===== K-th LARGEST STREAM DEMO =====');
  const kth = new KthLargest(3, [4, 5, 8, 2]);
  console.log('Initial stream [4,5,8,2], k=3');
  console.log('add(3)  ->', kth.add(3));  // [2,3,4,5,8] -> 3rd largest = 4
  console.log('add(5)  ->', kth.add(5));  // [2,3,4,5,5,8] -> 3rd largest = 5
  console.log('add(10) ->', kth.add(10)); // [2,3,4,5,5,8,10] -> 3rd largest = 5
  console.log('add(9)  ->', kth.add(9));  // -> 8
  console.log('add(4)  ->', kth.add(4));  // -> 8
}

function runExercisesHint() {
  console.log('\n===== EXERCISES =====');
  console.log('1) Implement topKFrequent_heap(nums, k) using a MinHeap of [count, value].');
  console.log('2) Change topKLargest_heap to instead return the k SMALLEST elements (what changes?).');
  console.log('3) Modify KthLargest to be KthSmallest by flipping the heap logic.');
  console.log('4) (Paper exercise) For arr = [7, 10, 4, 3, 20, 15], k=3, simulate the heap contents step by step.');
  console.log('   - Show heap after each insertion and pop.');
}

// Run demos when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demoTopK();
  demoTopKFrequent();
  demoKthLargestStream();
  runExercisesHint();
}


