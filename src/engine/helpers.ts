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
 * Longest repeating substring
 * https://gist.github.com/codediodeio/24319b9b17cba57e7a34002228abaaaf
 */
export function getRepeatedSequence(str: string): {
  index: number
  length: number
  subString: string
} {
  if (!str.trim()) {
    throw new Error('Blank string')
  }
  const strArray = str.trim().split(' ')
  let count = 0
  let maxLength = 0
  let index = 0
  for (let i = 0; i < strArray.length; i++) {
    if (strArray[i] === strArray[i + 1]) {
      count++
    } else {
      if (count > maxLength) {
        maxLength = count
        index = i
      }
      count = 0
    }
  }

  const subStrIndex: number = index - maxLength
  const subString: string = str.slice(subStrIndex, subStrIndex + maxLength + 1)

  if (subString) {
    return { index: subStrIndex, length: maxLength + 1, subString: subString }
  }
  return { index: -1, length: 0, subString: '' }
}
