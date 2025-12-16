/**
 * DP PRACTICE: LIS & LCS
 *
 * This file is meant for PRACTICE.
 * - It re-uses the reference implementations from:
 *     - ./dp_lis.js
 *     - ./dp_lcs.js
 * - It also defines small exercise functions for you to fill in.
 *
 * Run from project root:
 *   node exploration/dp_lis_lcs_exercises.js
 */

import { lengthOfLIS, constructLIS } from './dp_lis.js';
import { lcsLength, lcs } from './dp_lcs.js';

// ------------------------------------------------------------
// 1. LIS PRACTICE HELPERS
// ------------------------------------------------------------

/**
 * Example driver: shows LIS length and one LIS sequence.
 */
function demoLIS() {
  const examples = [
    [0, 8, 4, 12, 2],
    [3, 4, -1, 0, 6, 2, 3],
    [5, 4, 3, 2, 1],          // strictly decreasing
  ];

  console.log('===== LIS DEMOS =====');
  for (const arr of examples) {
    const len = lengthOfLIS(arr);
    const seq = constructLIS(arr);
    console.log('Array:     ', arr);
    console.log('LIS length:', len);
    console.log('One LIS:   ', seq);
    console.log('--------------------------');
  }
}

/**
 * EXERCISE 1 (LIS):
 * Re-implement lengthOfLIS yourself WITHOUT looking at dp_lis.js.
 *
 * Hints:
 *  - dp[i] = length of LIS that ends at index i
 *  - initialize dp[i] = 1
 *  - for each i, look at all j < i, and if nums[j] < nums[i],
 *    try to extend from j
 *
 * Try writing your own version in the body of this function.
 */
export function lengthOfLIS_exercise(nums) {
  const n = nums.length;
  if (n === 0) return 0;

  // TODO: Replace this with your own DP implementation.
  // 1. Create dp array of length n, filled with 1
  // 2. Double loop: i from 0..n-1, j from 0..i-1
  // 3. If nums[j] < nums[i], update dp[i]
  // 4. Return the maximum value in dp

  const dp = new Array(n).fill(1);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

/**
 * EXERCISE 2 (LIS):
 * Fill dp[] for a given array and RETURN the whole dp array.
 *
 * This helps you see how the DP table is built.
 *
 * Example:
 *   nums = [0, 8, 4, 12, 2]
 *   dp   = [1, 2, 2, 3, 2]
 */
export function lisDPTable(nums) {
  const n = nums.length;
  if (n === 0) return [];

  const dp = new Array(n).fill(1);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return dp;
}

// ------------------------------------------------------------
// 2. LCS PRACTICE HELPERS
// ------------------------------------------------------------

function demoLCS() {
  const examples = [
    ['ABCBDAB', 'BDCABA'],
    ['AGGTAB', 'GXTXAYB'],
    ['ABCDEF', 'FBDAMN'],
  ];

  console.log('===== LCS DEMOS =====');
  for (const [s1, s2] of examples) {
    const len = lcsLength(s1, s2);
    const seq = lcs(s1, s2);
    console.log(`s1 = "${s1}", s2 = "${s2}"`);
    console.log('LCS length:', len);
    console.log('One LCS:   ', seq);
    console.log('--------------------------');
  }
}

/**
 * EXERCISE 3 (LCS):
 * Implement the standard 2D DP for LCS length.
 *
 * Hints:
 *  - m = s1.length, n = s2.length
 *  - dp is (m+1) x (n+1), filled with 0
 *  - if s1[i-1] === s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
 *  - else: dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
 */
export function lcsLength_exercise(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * EXERCISE 4 (LCS):
 * Return the FULL dp table for LCS.
 *
 * This is very useful for understanding how choices propagate.
 */
export function lcsDPTable(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

// ------------------------------------------------------------
// 3. SMALL EXERCISE RUNNER
// ------------------------------------------------------------

function runExercises() {
  console.log('===== RUNNING LIS/LCS EXERCISES =====');

  // LIS DP table exercise
  const lisExample = [0, 8, 4, 12, 2];
  console.log('\nLIS dp[] for', lisExample);
  console.log('dp =', lisDPTable(lisExample));

  // LCS DP table exercise
  const s1 = 'ABCBDAB';
  const s2 = 'BDCABA';
  console.log(`\nLCS dp[][] for s1="${s1}", s2="${s2}"`);
  const table = lcsDPTable(s1, s2);
  console.table(table);
}

// Run demos + exercises when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demoLIS();
  demoLCS();
  runExercises();
}


