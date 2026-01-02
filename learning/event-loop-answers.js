/**
 * EVENT LOOP PRACTICE - ANSWER KEY
 * 
 * Don't peek until you've tried the problems!
 */

console.log('========== ANSWERS ==========\n');

console.log('PROBLEM 1:');
console.log('Answer: Start, End, Timeout');
console.log('Explanation: Synchronous code runs first, then setTimeout callback from queue\n');

console.log('PROBLEM 2:');
console.log('Answer: 1, 4, 3, 2');
console.log('Explanation: Sync (1, 4) → Microtask/Promise (3) → Macrotask/setTimeout (2)\n');

console.log('PROBLEM 3:');
console.log('Answer: A, C, B, D');
console.log('Explanation: First .then() of each promise runs (A, C), then second .then() of each (B, D)');
console.log('Each .then() creates a new microtask that goes to the back of the microtask queue\n');

console.log('PROBLEM 4:');
console.log('Answer: 1, 6, 4, 2, 5, 3');
console.log('Explanation:');
console.log('  - Sync: 1, 6');
console.log('  - Microtask: 4 (also queues setTimeout for 5)');
console.log('  - Macrotask: 2 (also queues Promise for 3)');
console.log('  - Macrotask: 5');
console.log('  - Microtask: 3 (runs before next macrotask)\n');

console.log('PROBLEM 5:');
console.log('Answer: Start, A, End, B, D, C');
console.log('Explanation:');
console.log('  - Sync: Start, A (before await), End');
console.log('  - After await (microtask): B, D');
console.log('  - Macrotask: C\n');

console.log('PROBLEM 6:');
console.log('Answer: 3, 6, 1, 2, 5, 4');
console.log('Explanation:');
console.log('  - Microtasks first: 3, 6 (also queue setTimeout for 4)');
console.log('  - Macrotask: 1 (queues Promise for 2)');
console.log('  - Microtask: 2 (runs immediately after 1)');
console.log('  - Macrotask: 5');
console.log('  - Macrotask: 4\n');

console.log('PROBLEM 7:');
console.log('Answer: 3, 3, 3');
console.log('Explanation: var is function-scoped. By the time callbacks run, loop finished and i = 3\n');

console.log('PROBLEM 8 - THREE SOLUTIONS:');
console.log('\nSolution 1: Use let (block-scoped)');
console.log('for (let i = 0; i < 3; i++) {');
console.log('  setTimeout(() => console.log(i), 0);');
console.log('}\n');

console.log('Solution 2: Use IIFE (Immediately Invoked Function Expression)');
console.log('for (var i = 0; i < 3; i++) {');
console.log('  (function(j) {');
console.log('    setTimeout(() => console.log(j), 0);');
console.log('  })(i);');
console.log('}\n');

console.log('Solution 3: Pass parameter to setTimeout');
console.log('for (var i = 0; i < 3; i++) {');
console.log('  setTimeout((j) => console.log(j), 0, i);');
console.log('}\n');

console.log('PROBLEM 9:');
console.log('Answer: 1, 3, 4, 2');
console.log('Explanation: Returning Promise.resolve() adds an extra microtask tick');
console.log('  - First round: 1, 3');
console.log('  - Second round: 4 (next .then())');
console.log('  - Third round: 2 (delayed by returned Promise)\n');

console.log('PROBLEM 10 (HARDEST):');
console.log('Answer: Start, 1, 3, End, 4, 9, 5, 2, 7, 6, 8');
console.log('Explanation:');
console.log('  - Sync: Start, 1, 3 (inside Promise constructor), End');
console.log('  - Microtask (after await): 4, 9');
console.log('  - Microtask (from Promise.resolve): 5 (also queues setTimeout for 6)');
console.log('  - Macrotask: 2');
console.log('  - Macrotask: 7 (queues Promise for 8)');
console.log('  - Macrotask: 6');
console.log('  - Microtask: 8 (runs after 7 completes)\n');

console.log('========================================');
console.log('KEY CONCEPTS TO REMEMBER:');
console.log('1. Execution order: Synchronous → Microtasks → Macrotasks');
console.log('2. Microtasks can queue more microtasks (they all run before next macrotask)');
console.log('3. Code after await is treated like a .then() callback');
console.log('4. Promise constructor executes synchronously');
console.log('5. Each .then() creates a new microtask');
console.log('========================================\n');
