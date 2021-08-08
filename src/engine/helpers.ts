import Ratio from './Ratio'

export interface Step {
  digit: number
  next: Ratio
  orig: Ratio
}

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
 * Modular inverse of a under modulo m
 * https://www.geeksforgeeks.org/multiplicative-inverse-under-modulo-m/
 * Check Fermat Little Theorem implementation
 * @param a
 * @param mod prime number
 */
export function modInverse(a: number, mod: number): number {
  {
    const m0 = mod
    let y = 0
    let x = 1

    if (mod == 1) return 0

    while (a > 1) {
      // q is quotient
      const q = parseInt((a / mod).toString())
      let t = mod

      // m is remainder now, process same as Euclid's algo
      mod = a % mod
      a = t
      t = y

      // Update y and x
      y = x - q * y
      x = t
    }

    // Make x positive
    if (x < 0) x += m0

    return x
  }
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
 * https://en.wikipedia.org/wiki/Modular_exponentiation
 * @param b base
 * @param exp exponent
 * @param mod modulus
 * @returns number
 */
export function modPower(b: number, exp: number, mod: number): number {
  let r = 1
  for (; exp > 0; b = (b * b) % mod, exp >>= 1) {
    if (exp & 1) {
      r = (r * b) % mod
    }
  }
  return r
}

/**
 * Double cursor window cycle detection
 * @param arr
 * @returns offset and repeated window
 */
export function repeatedSequencePattern(arr: number[]): { offset: number; size: number } {
  // Increasing offset
  for (let offset = 0; offset < arr.length / 2; offset++) {
    const str = arr.slice(offset)
    // Window size
    for (let size = 1; size < str.length / 2; size++) {
      const window = str.slice(0, size)
      const repetitions = Math.ceil(str.length / size)
      let repeated: number[] = []
      // Create repeated window array
      for (let i = 0; i < repetitions; i++) {
        repeated = repeated.concat(window)
      }
      repeated = repeated.slice(0, str.length)
      // Array equality test
      if (arraysEqual(repeated, str)) {
        return { offset, size }
      }
    }
  }
  return { offset: 0, size: 0 }
}

/**
 * Equality check for number[]
 * @param a number[]
 * @param b number[]
 * @returns boolean
 */
function arraysEqual(a: number[], b: number[]): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}
