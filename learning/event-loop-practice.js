/**
 * EVENT LOOP PRACTICE PROBLEMS
 * 
 * Try to predict the output BEFORE running the code!
 * Write your answer as a comment, then run to verify.
 * 
 * To run: node learning/event-loop-practice.js
 */

console.log('\n========== PROBLEM 1: WARM UP ==========');
console.log('Predict the output order:\n');

// Problem 1
function problem1() {
  console.log('Start');
  
  setTimeout(() => {
    console.log('Timeout');
  }, 0);
  
  console.log('End');
}

// YOUR ANSWER: 
// Start, End, Timeout

// Uncomment to test:
 //problem1();


console.log('\n========== PROBLEM 2: PROMISES ENTER THE CHAT ==========');
console.log('Predict the output order:\n');

// Problem 2
function problem2() {
  console.log('1');
  
  setTimeout(() => console.log('2'), 0);
  
  Promise.resolve().then(() => console.log('3'));
  
  console.log('4');
}

// YOUR ANSWER:
// 1, 4 , 3 , 2

// Uncomment to test:
//problem2();


console.log('\n========== PROBLEM 3: MULTIPLE PROMISES ==========');
console.log('Predict the output order:\n');

// Problem 3
function problem3() {
  Promise.resolve().then(() => {
    console.log('A');
  }).then(() => {
    console.log('B');
  });
  
  Promise.resolve().then(() => {
    console.log('C');
  }).then(() => {
    console.log('D');
  });
}

// YOUR ANSWER:
//  A, C, B, D

// Uncomment to test:
//problem3();


console.log('\n========== PROBLEM 4: THE TRICKY ONE ==========');
console.log('Predict the output order:\n');

// Problem 4
function problem4() {
  console.log('1');
  
  setTimeout(() => {
    console.log('2');
    Promise.resolve().then(() => console.log('3'));
  }, 0);
  
  Promise.resolve().then(() => {
    console.log('4');
    setTimeout(() => console.log('5'), 0);
  });
  
  console.log('6');
}

// YOUR ANSWER:
// 

// Uncomment to test:
//problem4();


console.log('\n========== PROBLEM 5: ASYNC/AWAIT ==========');
console.log('Predict the output order:\n');

// Problem 5
async function problem5() {
  console.log('A');
  
  await Promise.resolve();
  
  console.log('B');
  
  setTimeout(() => console.log('C'), 0);
  
  console.log('D');
}

function runProblem5() {
  console.log('Start');
  problem5();
  console.log('End');
}

// YOUR ANSWER:
// 

// Uncomment to test:
//runProblem5();


console.log('\n========== PROBLEM 6: NESTED CHAOS ==========');
console.log('Predict the output order:\n');

// Problem 6
function problem6() {
  setTimeout(() => {
    console.log('1');
    Promise.resolve().then(() => console.log('2'));
  }, 0);
  
  Promise.resolve().then(() => {
    console.log('3');
    setTimeout(() => console.log('4'), 0);
  });
  
  setTimeout(() => console.log('5'), 0);
  
  Promise.resolve().then(() => console.log('6'));
}

// YOUR ANSWER:
// 

// Uncomment to test:
 //problem6();


console.log('\n========== PROBLEM 7: THE LOOP TRAP ==========');
console.log('Predict the output:\n');

// Problem 7
function problem7() {
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
  }
}

// YOUR ANSWER:
// 

// Uncomment to test:
//problem7();


console.log('\n========== PROBLEM 8: FIX THE LOOP ==========');
console.log('Fix problem7 to print 0, 1, 2 instead\n');

// Problem 8 - Fix this!
function problem8() {
  // TODO: Fix this to print 0, 1, 2
  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
  }
}

// Uncomment to test:
//problem8();


console.log('\n========== PROBLEM 9: PROMISE CHAIN ==========');
console.log('Predict the output order:\n');

// Problem 9
function problem9() {
  Promise.resolve()
    .then(() => {
      console.log('1');
      return Promise.resolve();
    })
    .then(() => console.log('2'));
  
  Promise.resolve()
    .then(() => console.log('3'))
    .then(() => console.log('4'));
}

// YOUR ANSWER:
// 

// Uncomment to test:
problem9();


console.log('\n========== PROBLEM 10: THE ULTIMATE CHALLENGE ==========');
console.log('Predict the output order:\n');

// Problem 10
async function problem10() {
  console.log('1');
  
  setTimeout(() => console.log('2'), 0);
  
  await new Promise(resolve => {
    console.log('3');
    resolve();
  });
  
  console.log('4');
  
  Promise.resolve().then(() => {
    console.log('5');
    setTimeout(() => console.log('6'), 0);
  });
  
  setTimeout(() => {
    console.log('7');
    Promise.resolve().then(() => console.log('8'));
  }, 0);
  
  console.log('9');
}

function runProblem10() {
  console.log('Start');
  problem10();
  console.log('End');
}

// YOUR ANSWER:
// 

// Uncomment to test:
 runProblem10();


console.log('\n========================================');
console.log('INSTRUCTIONS:');
console.log('1. Uncomment ONE problem at a time');
console.log('2. Write your predicted answer in the comment');
console.log('3. Run: node learning/event-loop-practice.js');
console.log('4. Compare your answer with the actual output');
console.log('========================================\n');
