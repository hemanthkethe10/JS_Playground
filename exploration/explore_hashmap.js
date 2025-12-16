/**
 * HASHMAP IN JAVASCRIPT/NODE.JS
 * 
 * JavaScript has multiple ways to implement key-value storage:
 * 1. Map - True hashmap (recommended)
 * 2. Object {} - Simple but limited
 * 3. WeakMap - For memory-sensitive scenarios
 */

console.log('═══════════════════════════════════════════');
console.log('         HASHMAP IN NODE.JS');
console.log('═══════════════════════════════════════════\n');

// ============================================
// 1. MAP - The True Hashmap
// ============================================
console.log('1️⃣  MAP (Recommended)\n');

const userMap = new Map();

// Add entries
userMap.set('john', { age: 30, city: 'NYC' });
userMap.set('jane', { age: 25, city: 'LA' });
userMap.set(123, 'numeric key works!');      // Numbers as keys
userMap.set({ id: 1 }, 'objects as keys!');  // Objects as keys

console.log('Get value:', userMap.get('john'));
console.log('Has key:', userMap.has('john'));
console.log('Size:', userMap.size);

// Iterate over Map
console.log('\nIterating Map:');
for (const [key, value] of userMap) {
    console.log(`  ${JSON.stringify(key)} => ${JSON.stringify(value)}`);
}

// Map from array of pairs
const map2 = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);
console.log('\nMap from array:', map2);

// ============================================
// 2. OBJECT - Simple Key-Value (strings only)
// ============================================
console.log('\n2️⃣  OBJECT {} (Simple)\n');

const userObj = {
    john: { age: 30, city: 'NYC' },
    jane: { age: 25, city: 'LA' }
};

// Add/update
userObj['bob'] = { age: 35, city: 'Chicago' };
userObj.alice = { age: 28, city: 'Seattle' };

console.log('Get value:', userObj['john']);
console.log('Has key:', 'john' in userObj);
console.log('Keys:', Object.keys(userObj));

// Iterate
console.log('\nIterating Object:');
for (const [key, value] of Object.entries(userObj)) {
    console.log(`  ${key} => ${JSON.stringify(value)}`);
}

// ============================================
// 3. COMMON HASHMAP OPERATIONS
// ============================================
console.log('\n3️⃣  COMMON OPERATIONS\n');

const scores = new Map();

// Count occurrences (like Python's Counter)
const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];

for (const word of words) {
    scores.set(word, (scores.get(word) || 0) + 1);
}
console.log('Word count:', scores);
// Map(3) { 'apple' => 3, 'banana' => 2, 'cherry' => 1 }

// Get with default value
function getOrDefault(map, key, defaultValue) {
    return map.has(key) ? map.get(key) : defaultValue;
}
console.log('Get with default:', getOrDefault(scores, 'orange', 0));

// ============================================
// 4. PERFORMANCE COMPARISON
// ============================================
console.log('\n4️⃣  PERFORMANCE COMPARISON\n');

const ITERATIONS = 1_000_000;

// Map performance
console.time('Map - Insert 1M');
const perfMap = new Map();
for (let i = 0; i < ITERATIONS; i++) {
    perfMap.set(`key${i}`, i);
}
console.timeEnd('Map - Insert 1M');

console.time('Map - Lookup 1M');
for (let i = 0; i < ITERATIONS; i++) {
    perfMap.get(`key${i}`);
}
console.timeEnd('Map - Lookup 1M');

// Object performance
console.time('Object - Insert 1M');
const perfObj = {};
for (let i = 0; i < ITERATIONS; i++) {
    perfObj[`key${i}`] = i;
}
console.timeEnd('Object - Insert 1M');

console.time('Object - Lookup 1M');
for (let i = 0; i < ITERATIONS; i++) {
    perfObj[`key${i}`];
}
console.timeEnd('Object - Lookup 1M');

// ============================================
// 5. WEAKMAP - Garbage Collection Friendly
// ============================================
console.log('\n5️⃣  WEAKMAP (Memory-Sensitive)\n');

const weakMap = new WeakMap();

let obj1 = { name: 'Object 1' };
let obj2 = { name: 'Object 2' };

weakMap.set(obj1, 'metadata for obj1');
weakMap.set(obj2, 'metadata for obj2');

console.log('Get from WeakMap:', weakMap.get(obj1));

// When obj1 is no longer referenced anywhere,
// it will be garbage collected AND removed from WeakMap automatically!
obj1 = null; // Now the entry can be garbage collected

console.log('WeakMap is useful for:');
console.log('  - Caching computed values');
console.log('  - Storing private data');
console.log('  - DOM element metadata');

// ============================================
// 6. SET - Unique Values (Like HashSet)
// ============================================
console.log('\n6️⃣  SET (HashSet equivalent)\n');

const uniqueNumbers = new Set([1, 2, 3, 2, 1, 4, 3, 5]);
console.log('Set (auto-deduped):', uniqueNumbers);
// Set(5) { 1, 2, 3, 4, 5 }

uniqueNumbers.add(6);
console.log('Has 3?', uniqueNumbers.has(3));  // true - O(1) lookup!
uniqueNumbers.delete(1);
console.log('After delete:', uniqueNumbers);

// ============================================
// 7. PRACTICAL EXAMPLES
// ============================================
console.log('\n7️⃣  PRACTICAL EXAMPLES\n');

// Example 1: Two Sum (LeetCode classic)
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}
console.log('Two Sum [2,7,11,15] target=9:', twoSum([2, 7, 11, 15], 9));

// Example 2: Group by key
function groupBy(array, keyFn) {
    const map = new Map();
    for (const item of array) {
        const key = keyFn(item);
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(item);
    }
    return map;
}

const people = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Alice', age: 25 }
];

const groupedByAge = groupBy(people, p => p.age);
console.log('Grouped by age:', groupedByAge);

// Example 3: LRU Cache (simplified)
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // Map maintains insertion order!
    }
    
    get(key) {
        if (!this.cache.has(key)) return -1;
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // Remove oldest (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}

const lru = new LRUCache(3);
lru.put('a', 1);
lru.put('b', 2);
lru.put('c', 3);
console.log('LRU get b:', lru.get('b')); // 2
lru.put('d', 4); // evicts 'a'
console.log('LRU cache:', lru.cache);

console.log('\n═══════════════════════════════════════════');
console.log('✅ Summary: Use Map for hashmaps in Node.js!');
console.log('═══════════════════════════════════════════');

