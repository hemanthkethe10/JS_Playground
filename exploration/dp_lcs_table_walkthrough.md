## LCS DP Table Walkthrough (Step by Step)

We will fill the entire DP table for **LCS (Longest Common Subsequence)** using this example:

- **s1** = `"ABCBDAB"` (length 7)
- **s2** = `"BDCABA"` (length 6)

We already know from the code that:

- One LCS is `"BCBA"`
- LCS length is `4`

Here we will see exactly **how every `dp[i][j]` cell is computed**.

---

### 1. DP Definition (Reminder)

We define:

- **`dp[i][j] = length of LCS of s1[0..i-1] and s2[0..j-1]`**

Indices:

- `i` ranges from `0..m` where `m = s1.length = 7`
- `j` ranges from `0..n` where `n = s2.length = 6`

Base cases:

- `dp[0][j] = 0` for all `j`  (empty prefix of `s1`)
- `dp[i][0] = 0` for all `i`  (empty prefix of `s2`)

Transition:

- If `s1[i-1] === s2[j-1]`:
  \[
    dp[i][j] = 1 + dp[i-1][j-1]
  \]
- Else:
  \[
    dp[i][j] = \max(dp[i-1][j], dp[i][j-1])
  \]

---

### 2. Strings with Indices

We’ll index characters starting from 1 (to match `i` and `j`), but remember the code uses `s1[i-1]` and `s2[j-1]`.

```text
s1 index:  1  2  3  4  5  6  7
           A  B  C  B  D  A  B

s2 index:  1  2  3  4  5  6
           B  D  C  A  B  A
```

We will build an `(m+1) x (n+1)` table: `8 x 7`.  
Row `0` and column `0` correspond to **empty prefixes**.

---

### 3. Initial DP Table (All Zeros)

We start with all zeros:

```text
      j →   0  1  2  3  4  5  6
            -  B  D  C  A  B  A   (s2)
  i
  ↓
  0  -     0  0  0  0  0  0  0
  1  A     0  0  0  0  0  0  0
  2  B     0  0  0  0  0  0  0
  3  C     0  0  0  0  0  0  0
  4  B     0  0  0  0  0  0  0
  5  D     0  0  0  0  0  0  0
  6  A     0  0  0  0  0  0  0
  7  B     0  0  0  0  0  0  0
```

Row 0 and column 0 stay 0 forever.

---

### 4. Fill Row by Row

We iterate `i = 1..7`, `j = 1..6`.

#### Row i = 1  (s1[1] = 'A')

- Compare `'A'` with each char of `s2`:

1. `j = 1`: s2[1] = `'B'` → no match  
   `dp[1][1] = max(dp[0][1], dp[1][0]) = max(0, 0) = 0`

2. `j = 2`: s2[2] = `'D'` → no match  
   `dp[1][2] = max(dp[0][2], dp[1][1]) = max(0, 0) = 0`

3. `j = 3`: s2[3] = `'C'` → no match  
   `dp[1][3] = max(dp[0][3], dp[1][2]) = 0`

4. `j = 4`: s2[4] = `'A'` → match!  
   `dp[1][4] = 1 + dp[0][3] = 1`

5. `j = 5`: s2[5] = `'B'` → no match  
   `dp[1][5] = max(dp[0][5], dp[1][4]) = max(0, 1) = 1`

6. `j = 6`: s2[6] = `'A'` → match!  
   `dp[1][6] = 1 + dp[0][5] = 1`
   But note `dp[1][5] = 1`, `dp[0][6] = 0`, so still `1`.

Row 1 now:

```text
      -  B  D  C  A  B  A
  0   0  0  0  0  0  0  0
  1A  0  0  0  0  1  1  1
```

#### Row i = 2  (s1[2] = 'B')

1. `j = 1`: s2[1] = `'B'` → match  
   `dp[2][1] = 1 + dp[1][0] = 1`

2. `j = 2`: s2[2] = `'D'` → no match  
   `dp[2][2] = max(dp[1][2], dp[2][1]) = max(0, 1) = 1`

3. `j = 3`: s2[3] = `'C'` → no match  
   `dp[2][3] = max(dp[1][3], dp[2][2]) = max(0, 1) = 1`

4. `j = 4`: s2[4] = `'A'` → no match  
   `dp[2][4] = max(dp[1][4], dp[2][3]) = max(1, 1) = 1`

5. `j = 5`: s2[5] = `'B'` → match  
   `dp[2][5] = 1 + dp[1][4] = 1 + 1 = 2`

6. `j = 6`: s2[6] = `'A'` → no match  
   `dp[2][6] = max(dp[1][6], dp[2][5]) = max(1, 2) = 2`

Rows 0–2:

```text
      -  B  D  C  A  B  A
  0   0  0  0  0  0  0  0
  1A  0  0  0  0  1  1  1
  2B  0  1  1  1  1  2  2
```

#### Row i = 3  (s1[3] = 'C')

1. `j = 1`: s2[1] = `'B'` → no match  
   `dp[3][1] = max(dp[2][1], dp[3][0]) = max(1, 0) = 1`

2. `j = 2`: s2[2] = `'D'` → no match  
   `dp[3][2] = max(dp[2][2], dp[3][1]) = max(1, 1) = 1`

3. `j = 3`: s2[3] = `'C'` → match  
   `dp[3][3] = 1 + dp[2][2] = 1 + 1 = 2`

4. `j = 4`: s2[4] = `'A'` → no match  
   `dp[3][4] = max(dp[2][4], dp[3][3]) = max(1, 2) = 2`

5. `j = 5`: s2[5] = `'B'` → no match  
   `dp[3][5] = max(dp[2][5], dp[3][4]) = max(2, 2) = 2`

6. `j = 6`: s2[6] = `'A'` → no match  
   `dp[3][6] = max(dp[2][6], dp[3][5]) = max(2, 2) = 2`

Rows 0–3:

```text
      -  B  D  C  A  B  A
  0   0  0  0  0  0  0  0
  1A  0  0  0  0  1  1  1
  2B  0  1  1  1  1  2  2
  3C  0  1  1  2  2  2  2
```

#### Row i = 4  (s1[4] = 'B')

1. `j = 1`: `'B'` vs `'B'` → match  
   `dp[4][1] = 1 + dp[3][0] = 1`

2. `j = 2`: `'B'` vs `'D'` → no match  
   `dp[4][2] = max(dp[3][2], dp[4][1]) = max(1, 1) = 1`

3. `j = 3`: `'B'` vs `'C'` → no match  
   `dp[4][3] = max(dp[3][3], dp[4][2]) = max(2, 1) = 2`

4. `j = 4`: `'B'` vs `'A'` → no match  
   `dp[4][4] = max(dp[3][4], dp[4][3]) = max(2, 2) = 2`

5. `j = 5`: `'B'` vs `'B'` → match  
   `dp[4][5] = 1 + dp[3][4] = 1 + 2 = 3`

6. `j = 6`: `'B'` vs `'A'` → no match  
   `dp[4][6] = max(dp[3][6], dp[4][5]) = max(2, 3) = 3`

Rows 0–4:

```text
      -  B  D  C  A  B  A
  0   0  0  0  0  0  0  0
  1A  0  0  0  0  1  1  1
  2B  0  1  1  1  1  2  2
  3C  0  1  1  2  2  2  2
  4B  0  1  1  2  2  3  3
```

#### Row i = 5  (s1[5] = 'D')

1. `j = 1`: `'D'` vs `'B'` → no match  
   `dp[5][1] = max(dp[4][1], dp[5][0]) = max(1, 0) = 1`

2. `j = 2`: `'D'` vs `'D'` → match  
   `dp[5][2] = 1 + dp[4][1] = 1 + 1 = 2`

3. `j = 3`: `'D'` vs `'C'` → no match  
   `dp[5][3] = max(dp[4][3], dp[5][2]) = max(2, 2) = 2`

4. `j = 4`: `'D'` vs `'A'` → no match  
   `dp[5][4] = max(dp[4][4], dp[5][3]) = max(2, 2) = 2`

5. `j = 5`: `'D'` vs `'B'` → no match  
   `dp[5][5] = max(dp[4][5], dp[5][4]) = max(3, 2) = 3`

6. `j = 6`: `'D'` vs `'A'` → no match  
   `dp[5][6] = max(dp[4][6], dp[5][5]) = max(3, 3) = 3`

Rows 0–5:

```text
      -  B  D  C  A  B  A
  0   0  0  0  0  0  0  0
  1A  0  0  0  0  1  1  1
  2B  0  1  1  1  1  2  2
  3C  0  1  1  2  2  2  2
  4B  0  1  1  2  2  3  3
  5D  0  1  2  2  2  3  3
```

#### Row i = 6  (s1[6] = 'A')

1. `j = 1`: `'A'` vs `'B'` → no match  
   `dp[6][1] = max(dp[5][1], dp[6][0]) = max(1, 0) = 1`

2. `j = 2`: `'A'` vs `'D'` → no match  
   `dp[6][2] = max(dp[5][2], dp[6][1]) = max(2, 1) = 2`

3. `j = 3`: `'A'` vs `'C'` → no match  
   `dp[6][3] = max(dp[5][3], dp[6][2]) = max(2, 2) = 2`

4. `j = 4`: `'A'` vs `'A'` → match  
   `dp[6][4] = 1 + dp[5][3] = 1 + 2 = 3`

5. `j = 5`: `'A'` vs `'B'` → no match  
   `dp[6][5] = max(dp[5][5], dp[6][4]) = max(3, 3) = 3`

6. `j = 6`: `'A'` vs `'A'` → match  
   `dp[6][6] = 1 + dp[5][5] = 1 + 3 = 4`

Rows 0–6:

```text
      -  B  D  C  A  B  A
  0   0  0  0  0  0  0  0
  1A  0  0  0  0  1  1  1
  2B  0  1  1  1  1  2  2
  3C  0  1  1  2  2  2  2
  4B  0  1  1  2  2  3  3
  5D  0  1  2  2  2  3  3
  6A  0  1  2  2  3  3  4
```

#### Row i = 7  (s1[7] = 'B')

1. `j = 1`: `'B'` vs `'B'` → match  
   `dp[7][1] = 1 + dp[6][0] = 1`

2. `j = 2`: `'B'` vs `'D'` → no match  
   `dp[7][2] = max(dp[6][2], dp[7][1]) = max(2, 1) = 2`

3. `j = 3`: `'B'` vs `'C'` → no match  
   `dp[7][3] = max(dp[6][3], dp[7][2]) = max(2, 2) = 2`

4. `j = 4`: `'B'` vs `'A'` → no match  
   `dp[7][4] = max(dp[6][4], dp[7][3]) = max(3, 2) = 3`

5. `j = 5`: `'B'` vs `'B'` → match  
   `dp[7][5] = 1 + dp[6][4] = 1 + 3 = 4`

6. `j = 6`: `'B'` vs `'A'` → no match  
   `dp[7][6] = max(dp[6][6], dp[7][5]) = max(4, 4) = 4`

Final table:

```text
      -  B  D  C  A  B  A
  0   0  0  0  0  0  0  0
  1A  0  0  0  0  1  1  1
  2B  0  1  1  1  1  2  2
  3C  0  1  1  2  2  2  2
  4B  0  1  1  2  2  3  3
  5D  0  1  2  2  2  3  3
  6A  0  1  2  2  3  3  4
  7B  0  1  2  2  3  4  4
```

So:

- **LCS length = `dp[7][6] = 4`**

This matches what your `lcsLength` implementation returns.

---

### 5. How This Relates to the Code

Your implementation in `exploration/dp_lcs.js` does exactly these steps:

```24:42:exploration/dp_lcs.js
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
```

Now when you read this code, you can literally see **which neighbors each cell depends on**:

- Diagonal `(i-1, j-1)` if characters match
- Top `(i-1, j)` or left `(i, j-1)` if they don’t

---

### 6. Next Step Exercise

Try to:

1. Pick your own small strings, e.g.:
   - `s1 = "ABCDE"`
   - `s2 = "AECBD"`
2. Draw an empty `(len(s1)+1) x (len(s2)+1)` table.
3. Fill it **exactly like above**, row by row.
4. Then:
   - Run `node exploration/dp_lis_lcs_exercises.js`
   - Temporarily modify `s1`, `s2` in `runExercises()` to your strings
   - Compare your table with the `console.table` output.

This hand–table exercise is the fastest way to make DP “click” for LCS.


