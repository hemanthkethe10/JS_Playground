## Dynamic Programming: LIS & LCS Cheat Sheet

This document explains:
- **LIS (Longest Increasing Subsequence)**
- **LCS (Longest Common Subsequence)**

Files:
- `exploration/dp_lis.js` – LIS implementations + demos
- `exploration/dp_lcs.js` – LCS implementations + demos

Run from project root:

```bash
node exploration/dp_lis.js
node exploration/dp_lcs.js
```

---

### 1. Core DP Mindset

Dynamic Programming is about:

- **Subproblems**: break the big problem into smaller ones
- **State**: define what each `dp[...]` entry MEANS in words
- **Recurrence**: how to build `dp[...]` from smaller entries
- **Reuse**: fill a table/array once, reuse answers many times

If you can clearly say “`dp[i]` means ___” or “`dp[i][j]` means ___”,
you are already close to the solution.

---

### 2. LIS – Longest Increasing Subsequence

**Problem**: Given an array `nums`, find the **length** (and optionally one example) of the
longest **strictly increasing** subsequence. A subsequence can skip elements but must keep order.

Example:

```text
nums = [10, 9, 2, 5, 3, 7, 101, 18]
One LIS: [2, 3, 7, 18]  (length 4)
```

#### 2.1 DP Definition

We define:

- **`dp[i] = length of the LIS that ENDS at index i`**

Interpretation:

- Look only at `nums[0..i]` (prefix up to i)
- Consider subsequences that **end exactly at `i`**

#### 2.2 Transition

Minimum LIS ending at `i` is always 1 (the element itself).

For each `i` from 0..n-1:
- Start with `dp[i] = 1`
- For all `j < i`:
  - If `nums[j] < nums[i]`, we can append `nums[i]` after an LIS ending at `j`
  - Update:

  \[
    dp[i] = \max(dp[i], dp[j] + 1)
  \]

Final answer:

\[
  \text{LIS length} = \max_i dp[i]
\]

See implementation and a reconstruction version in `dp_lis.js`.

#### 2.3 Exercises

1. Manually compute `dp` for:
   - `[0, 8, 4, 12, 2]`
   - `[3, 4, -1, 0, 6, 2, 3]`

   For each index `i`, write:
   - `dp[i]`
   - one LIS that ends at `i`.

2. Modify `constructLIS` to return **all** LIS sequences (harder).
3. Think: when array is strictly decreasing (e.g. `[5, 4, 3, 2, 1]`),
   what does `dp` look like and why?

---

### 3. LCS – Longest Common Subsequence

**Problem**: Given two strings `s1` and `s2`, find the length (and optionally one string)
of their **longest common subsequence**.

Example:

```text
s1 = "ABCBDAB"
s2 = "BDCABA"
One LCS: "BCBA" (length 4)
```

A subsequence keeps order but can skip characters.

#### 3.1 DP Definition

We define a 2D table:

- **`dp[i][j] = length of LCS of s1[0..i-1] and s2[0..j-1]`**

Notes:
- `i` = how many characters we take from `s1` prefix
- `j` = how many characters we take from `s2` prefix
- Rows: from 0..m (where `m = s1.length`)
- Cols: from 0..n (where `n = s2.length`)

Base cases:
- `dp[0][j] = 0` for all `j` (empty `s1`)
- `dp[i][0] = 0` for all `i` (empty `s2`)

#### 3.2 Transition

For `i = 1..m`, `j = 1..n`:

- If `s1[i-1] === s2[j-1]` (last chars of prefixes match):

  \[
    dp[i][j] = 1 + dp[i-1][j-1]
  \]

- Else (last chars differ):

  \[
    dp[i][j] = \max(dp[i-1][j], dp[i][j-1])
  \]

Final answer:

\[
  \text{LCS length} = dp[m][n]
\]

Implementation and reconstruction are in `dp_lcs.js`.

#### 3.3 Reconstructing One LCS

Once `dp` is filled, we can walk **backwards** from `(m, n)`:

- If `s1[i-1] === s2[j-1]`:
  - This char is part of LCS → add it and move diagonally: `(i-1, j-1)`
- Else:
  - Move to the neighbor `(i-1, j)` or `(i, j-1)` that has the
    larger `dp` value (we are following the max choices we made)

We collect characters in reverse, then reverse at the end.

---

### 4. Summary: DP Patterns in LIS & LCS

**LIS**
- 1D DP
- `dp[i]` depends on all `dp[j]` with `j < i`
- State meaning: “best increasing subsequence ending *here*”

**LCS**
- 2D DP
- `dp[i][j]` depends on `dp[i-1][j]`, `dp[i][j-1]`, and `dp[i-1][j-1]`
- State meaning: “best common subsequence up to prefixes of length i and j”

In both cases:

- Clearly defining **what `dp[...]` means** is the key.
- The recurrence follows from considering **choices**:
  - LIS: extend from smaller element or start new
  - LCS: match last char, or drop last char from one of the strings

Practice filling small tables/arrays by hand to build intuition, then
use the JS files here to confirm your results.


