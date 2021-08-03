/**
 * Get a random integer
 * @param min
 * @param max
 * @returns random integer
 */
export function getRandomInt(min = -100, max = 100): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Primality tester
 * http://rosettacode.org/wiki/Primality_by_trial_division
 * @param prime
 * @returns boolean
 */
export function isPrime(n: number): boolean {
  if (n == 2 || n == 3 || n == 5 || n == 7) {
    return true
  } else if (n < 2 || n % 2 == 0) {
    return false
  } else {
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i == 0) return false
    }
    return true
  }
}

/**
 * Recursive Extended Euclidean Algorithm
 * https://www.geeksforgeeks.org/euclidean-algorithms-basic-and-extended/
 */
export function gcd(a: number, b: number, x = 0, y = 0): number {
  // Base Case
  if (a == 0) {
    x = 0
    y = 1
    return b
  }
  // To store results of recursive call
  const res = gcd(b % a, a, x, y)
  // Update x and y using results of recursive call
  x = y - (b / a) * x
  y = x
  return res
}

/**
 * -Exponent of p in b
 */
export function negExp(b: number, p: number): number {
  for (let i = 0; b % p === 0; i--) {
    b = b / p
  }
  return b
}

/**
 * Prime factors of a number
 * https://rosettacode.org/wiki/Prime_decomposition
 * @param num: number
 * @returns dict with prime and their exponents
 */
export function factors(n: number): Record<number, number> {
  // Retrieve absolute value
  if (n < 0) {
    n = Math.abs(n)
  }
  if (!n || n < 2) return {}
  const facs = []
  for (let i = 2; i <= n; i++) {
    while (n % i === 0) {
      facs.push(i)
      n /= i
    }
  }
  // Group and count by occurences
  const occurrences = facs.reduce(function (acc: Record<string, number>, curr: number) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})
  return occurrences
}

/**
 * Modular inverse bruteforce
 * @param a
 * @param b
 * @returns number
 */
export function modInv(a: number, b: number): number {
  a %= b
  for (let x = 1; x < b; x++) {
    if ((a * x) % b == 1) {
      return x
    }
  }
  throw new Error('Impossible mod inv')
}

/**
 * Longest repeating and non-overlapping substring
 * https://www.geeksforgeeks.org/longest-repeating-and-non-overlapping-substring/
 */
export function getRepeatedSequence(str: string): string {
  {
    const n = str.length
    const LCSRe = new Array(n + 1)
    for (let i = 0; i < n + 1; i++) {
      LCSRe[i] = new Array(n + 1)
    }
    for (let i = 0; i < n + 1; i++) {
      for (let j = 0; j < n + 1; j++) {
        LCSRe[i][j] = 0
      }
    }

    let res = '' // To store result
    let res_length = 0 // To store length of result

    // building table in bottom-up manner
    let i,
      index = 0
    for (i = 1; i <= n; i++) {
      for (let j = i + 1; j <= n; j++) {
        // (j-i) > LCSRe[i-1][j-1] to remove
        // overlapping
        if (str[i - 1] == str[j - 1] && LCSRe[i - 1][j - 1] < j - i) {
          LCSRe[i][j] = LCSRe[i - 1][j - 1] + 1

          // updating maximum length of the
          // substring and updating the finishing
          // index of the suffix
          if (LCSRe[i][j] > res_length) {
            res_length = LCSRe[i][j]
            index = Math.max(i, index)
          }
        } else {
          LCSRe[i][j] = 0
        }
      }
    }

    // If we have non-empty result, then insert all
    // characters from first character to last
    // character of String
    if (res_length > 0) {
      for (i = index - res_length + 1; i <= index; i++) {
        res += str.charAt(i - 1)
      }
    }

    return res
  }
}

/**
 * Modular power
 * @param b
 * @param exp
 * @param mod
 * @returns number
 */
export function modpow(b: number, exp: number, mod: number): number {
  let r = 1
  for (; exp > 0; b = (b * b) % mod, exp >>= 1) {
    if (exp & 1) {
      r = (r * b) % mod
    }
  }
  return r
}
