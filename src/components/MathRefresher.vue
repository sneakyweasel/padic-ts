<template>
  <div>
    <h2 class="title">Math refresher</h2>

    <!-- Exponent -->
    <p class="intro">
      Exponentiation x<sup>y</sup> is a repeated multiplication of x just like multiplication is a
      repeated addition
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/2 flex definition">
        <div class="w-1/2 definition">
          <input type="number" v-model.number="base" class="number-input text-xl mt-5" />
        </div>
        <div class="w-1/2 definition">
          <input type="number" v-model.number="exp" class="number-input text-xl" />
        </div>
      </div>
      <div class="w-1/2 dynamic" v-katex:display="expKatex"></div>
    </div>

    <!-- Prime number -->
    <p class="intro">
      A prime number p is a natural number greater than 1 that is not the multiplication of two
      smaller numbers
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/2 flex definition">
        <div class="w-1/2 definition">
          <input type="number" v-model.number="prime" class="number-input text-xl" />
        </div>
        <div class="w-1/2 text-left mt-3">
          {{ isPrimeKatex }}
        </div>
      </div>
      <div class="w-1/2 dynamic" v-katex:display="primeKatex"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { getRandomInt, isPrime } from '@/engine/helpers'
import { Component, Vue } from 'vue-property-decorator'
import Ratio from '@/engine/Ratio'

@Component({})
export default class ExponentRefresher extends Vue {
  base = 2
  exp = 3
  prime = getRandomInt(2, 500)

  get expKatex(): string {
    let result = `${this.base}^{${this.exp}} =`
    const expResult = this.base ** Math.abs(this.exp)
    if (this.exp > 0) {
      result += `${this.base} \\cdot `.repeat(Math.abs(this.exp)).slice(0, -6)
      result += `= ${expResult}`
    } else {
      result += `\\frac{1}{${this.base}} \\cdot `.repeat(Math.abs(this.exp)).slice(0, -6)
      result += ` = \\frac{1}{${expResult}}`
    }
    return result
  }

  get isPrimeKatex(): string {
    if (isPrime(this.prime)) {
      return 'is a prime number'
    }
    return 'is not a prime number'
  }

  get primeKatex(): string {
    let ratio = new Ratio(this.prime)
    return ratio.factorsKatex(1)
  }
}
</script>

<style></style>
