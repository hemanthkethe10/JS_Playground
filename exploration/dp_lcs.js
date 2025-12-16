/**
 * DP: LONGEST COMMON SUBSEQUENCE (LCS)
 *
 * Goal: Given two strings s1 and s2, find the length (and optionally
 *       one actual string) of their longest common subsequence.
 *
 * DP DEFINITION
 *  - dp[i][j] = length of LCS of prefixes s1[0..i-1] and s2[0..j-1]
 *
 * TRANSITION
 *  - If s1[i-1] === s2[j-1]:
 *        dp[i][j] = 1 + dp[i-1][j-1]
 *  - Else:
 *        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
 *
 * BASE CASES
 *  - dp[0][j] = 0 for all j  (empty s1)
 *  - dp[i][0] = 0 for all i  (empty s2)
 *
 * TIME:  O(m * n)
 * SPACE: O(m * n)
 */

export function lcsLength(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

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
 * Reconstruct one actual LCS string using the filled dp table.
 */
export function lcs(s1, s2) {
  const m = s1.length;
  const n = s2.length;

  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // Fill dp table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct LCS string by walking backwards
  let i = m;
  let j = n;
  const result = [];

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      result.push(s1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result.reverse().join('');
}

// ---------- DEMO ----------
if (import.meta.url === `file://${process.argv[1]}`) {
  const examples = [
    ['ABCBDAB', 'BDCABA'],
    ['AGGTAB', 'GXTXAYB'],
    ['ABCDEF', 'FBDAMN']
  ];

  for (const [s1, s2] of examples) {
    const len = lcsLength(s1, s2);
    const seq = lcs(s1, s2);
    console.log(`s1 = "${s1}", s2 = "${s2}"`);
    console.log('LCS length:', len);
    console.log('One LCS:   ', seq);
    console.log('--------------------------');
  }
}


