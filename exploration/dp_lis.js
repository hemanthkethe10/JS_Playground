/**
 * DP: LONGEST INCREASING SUBSEQUENCE (LIS)
 *
 * Goal: Given an array of numbers, find the length of the longest
 *       strictly increasing subsequence (not necessarily contiguous).
 *
 * DP DEFINITION
 *  - dp[i] = length of the LIS that ENDS at index i
 *  - answer = max(dp[i]) for all i
 *
 * TRANSITION
 *  - Base: dp[i] starts at 1 (the element itself)
 *  - For each j < i:
 *      if nums[j] < nums[i], we can append nums[i] after an LIS ending at j
 *      dp[i] = Math.max(dp[i], dp[j] + 1)
 *
 * TIME:  O(n^2)
 * SPACE: O(n)
 */

export function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;

  // dp[i] = length of LIS ending at i
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
 * Reconstruct one actual LIS (not just its length).
 * Uses a parent array to remember where each LIS came from.
 */
export function constructLIS(nums) {
  const n = nums.length;
  if (n === 0) return [];

  const dp = new Array(n).fill(1);
  const parent = new Array(n).fill(-1); // parent[i] = index of previous element in LIS ending at i

  let bestLen = 1;
  let bestEndIndex = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;
      }
    }
    if (dp[i] > bestLen) {
      bestLen = dp[i];
      bestEndIndex = i;
    }
  }

  // Reconstruct by walking backwards using parent[]
  const sequence = [];
  let idx = bestEndIndex;
  while (idx !== -1) {
    sequence.push(nums[idx]);
    idx = parent[idx];
  }

  return sequence.reverse();
}

// ---------- DEMO ----------
if (import.meta.url === `file://${process.argv[1]}`) {
  const examples = [
    [3, 10, 2, 1, 20],
    [10, 9, 2, 5, 3, 7, 101, 18],
    [0, 8, 4, 12, 2],
    [3, 4, -1, 0, 6, 2, 3]
  ];

  for (const arr of examples) {
    const len = lengthOfLIS(arr);
    const seq = constructLIS(arr);
    console.log('Array:     ', arr);
    console.log('LIS length:', len);
    console.log('One LIS:   ', seq);
    console.log('--------------------------');
  }
}


