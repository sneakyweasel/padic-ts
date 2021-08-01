/**
 * Absolute value
 */
export function abs(a: number): number {
  return a >= 0 ? a : -a
}

/**
 * Minimum
 */
export function min(a: number, b: number): number {
  return a < b ? a : b
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
export function gcdExtended(a: number, b: number, x = 0, y = 0): number {
  // Base Case
  if (a == 0) {
    x = 0
    y = 1
    return b
  }
  // To store results of recursive call
  const gcd = gcdExtended(b % a, a, x, y)
  // Update x and y using results of recursive call
  x = y - (b / a) * x
  y = x
  return gcd
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
 * Ratio factors and their exponents
 * @param a
 * @param b
 * @returns dict of prime and their exponents
 */
export function ratioFactors(a: number, b: number): Record<string, number> {
  const factorsA: Record<string, number> = factors(a)
  const factorsB: Record<string, number> = factors(b)
  // get unique keys
  const keys = [...Object.keys(factorsA), ...Object.keys(factorsB)]
  const uniq = [...new Set(keys)]
  // perform addition
  const result: Record<string, number> = {}
  uniq.forEach((key: string) => {
    let counter = 0
    if (key in factorsA) {
      counter += factorsA[key]
    }
    if (key in factorsB) {
      counter -= factorsB[key]
    }
    if (counter !== 0) {
      result[key] = counter
    }
  })
  return result
}

/**
 * Ratio factors in sorted array form
 * @param a
 * @param b
 * @returns
 */
export function ratioFactorsArray(a: number, b: number): [number, number][] {
  const ratioFacs = ratioFactors(a, b)
  const result: [number, number][] = []
  Object.keys(ratioFacs)
    .map((key) => {
      return parseInt(key)
    })
    .map(function (key) {
      result.push([key, ratioFacs[key.toString()]])
      return result
    })
  return result
}

/**
 * Reconstruct rational part without prime used for padic norm
 * @param a
 * @param b
 * @param p
 * @returns ratio
 */
export function ratioNormReconstruct(a: number, b: number, p: number): [number, number] {
  const ratioFacs = ratioFactorsArray(a, b)
  let num = 1
  let denum = 1
  ratioFacs.forEach((factor) => {
    if (factor[0] !== p) {
      if (factor[1] > 0) {
        num *= factor[0] ** Math.abs(factor[1])
      } else {
        denum *= factor[0] ** Math.abs(factor[1])
      }
    }
  })
  return [num, denum]
}

/**
 * Reconstruct prime part used for padic norm
 * @param a
 * @param b
 * @param p
 * @returns ratio
 */
export function ratioPrimeReconstruct(a: number, b: number, p: number): [number, number] {
  const ratioFacs = ratioFactors(a, b)
  if (p in ratioFacs) {
    return [p, ratioFacs[p]]
  }
  return [p, 0]
}

/**
 * Ratio factors in sorted array form
 * @param a
 * @param b
 * @returns katex formatted string of prime factors and their exponents
 */
export function ratioFactorsKatex(a: number, b: number, p: number): string {
  const ratioFacs = ratioFactorsArray(a, b)
  let result = ' = '
  ratioFacs.forEach((tuple) => {
    if (tuple[0] === p) {
      result += `\\textcolor{red}{${tuple[0]}^{${tuple[1] !== 1 ? tuple[1] : ''}}}\\:*\\:`
    } else {
      result += `${tuple[0]}^{${tuple[1] !== 1 ? tuple[1] : ''}}\\:*\\:`
    }
  })
  result = result.substring(0, result.length - 3)
  return result
}

/**
 * Padic Norm
 * https://codegolf.stackexchange.com/questions/63629/calculate-the-p-adic-norm-of-a-rational-number
 * @param a
 * @param b
 * @returns padic distance
 */
export function padicNorm(a: number, b: number, p: number): string {
  if (a === 0) {
    return '0'
  }
  const factors = ratioFactors(a, b)
  // check if prime is included in prime factorization
  const keys = [...Object.keys(factors)]
  const uniq = [...new Set(keys)]
  if (!uniq.includes(p.toString())) {
    return '1'
  }
  // in factors
  const factor = factors[p.toString()]
  const res = p ** Math.abs(factors[p.toString()])
  if (factor > 0) {
    return '1 / ' + res
  } else {
    return '' + res
  }
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
