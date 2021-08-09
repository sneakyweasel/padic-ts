<template>
  <div>
    <h2 class="text-pink-600 mb-3 font-bold font-sans text-2xl text-center">
      {{ prime }}-adic distance: a new way to measure distance!
    </h2>

    <!-- Prime decomposition -->
    <p class="text-center mt-6">
      <b> Every integer is a multiplication of its prime factors</b>
    </p>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">Prime factorization of numerator</div>
      <div class="w-2/3 text-left bg-gray-200" v-katex:display="factorsNKatex"></div>
    </div>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">Prime factorization of denominator</div>
      <div class="w-2/3 text-left bg-gray-200" v-katex:display="factorsDKatex"></div>
    </div>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">Prime factorization of the fraction</div>
      <div class="w-2/3 text-left bg-gray-200" v-katex:display="factorsNDKatex"></div>
    </div>

    <!-- Prime isolation form -->
    <p class="text-center mt-6">
      <b>
        The fraction can be written in a way that shows its relation with the selected prime p={{
          prime
        }}
      </b>
    </p>

    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">Any fraction can be expressed as</div>
      <div class="w-1/3 text-left bg-gray-100 mr-2" v-katex:display="isolationExplainKatex"></div>
      <div class="w-1/3 text-left bg-gray-200" v-katex:display="isolationKatex"></div>
    </div>

    <!-- P-valuation -->
    <p class="text-center mt-6">
      <b> This "closeness" to p={{ prime }} is called the p-adic valuation v<sub>p</sub>(x)</b>
    </p>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic valuation of x</div>
      <div class="w-1/3 text-left bg-gray-100 mr-2" v-katex:display="pValuationExplainKatex"></div>
      <div class="w-1/3 text-left bg-gray-200" v-katex:display="pValuationKatex"></div>
    </div>

    <!-- Padic absolute value -->
    <p class="text-center mt-6">
      <b> This gives us a new notion of distance between numbers in relation with p={{ prime }}</b>
    </p>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic absolute value</div>
      <div class="w-1/3 items-left bg-gray-100 mr-2" v-katex:display="absExplainKatex"></div>
      <div class="w-1/3 items-left bg-gray-200" v-katex:display="absKatex"></div>
    </div>

    <!-- Distance compare -->
    <p class="text-center mt-6">
      <b>
        Let's compare the classical distance and the {{ prime }}-adic distance with the random
        number {{ randomRatio.n }}/{{ randomRatio.d }}, you can modify the first fraction and see
        how the difference between those two distances change</b
      >
    </p>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/2 items-left bg-gray-100 mr-2" v-katex:display="classicalDistanceKatex"></div>
      <div class="w-1/2 items-left bg-gray-200" v-katex:display="padicDistanceKatex"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { getRandomInt } from '../engine/helpers'
import Ratio from '../engine/Ratio'

@Component({})
export default class KatexFactors extends Vue {
  @Prop() readonly ratio!: Ratio
  @Prop() readonly prime!: number

  randomRatio = new Ratio(getRandomInt(-100, 100), getRandomInt(0, 50)).reduce()

  get factorsNKatex(): string {
    const factors = new Ratio(this.ratio.n).factorsKatex(this.prime)
    return `${this.ratio.n} = ` + factors
  }

  get factorsDKatex(): string {
    const factors = new Ratio(this.ratio.d).factorsKatex(this.prime, true)
    return `\\frac{1}{${this.ratio.d}} = ` + factors
  }

  get factorsNDKatex(): string {
    const factors = new Ratio(this.ratio.n, this.ratio.d).factorsKatex(this.prime)
    return `\\frac{${this.ratio.n}}{${this.ratio.d}} = ` + factors
  }

  get isolationExplainKatex(): string {
    return `x = p^{v_{p}(x)} \\cdot \\frac{a}{b}`
  }

  get isolationKatex(): string {
    const rat = this.ratio.reconstructWithoutPrime(this.prime)
    const pri = this.ratio.factor(this.prime)
    let result = 'x = '
    if (this.ratio.sign === -1) {
      result += '-'
    }
    result += `\\textcolor{red}{${pri[0]}}^{\\textcolor{red}{${pri[1]}}} \\cdot ${rat.toKatex()}`
    return result
  }

  get pValuationExplainKatex(): string {
    return `v_{p}(\\frac{n}{d}) = v_{p}(n)-v_{p}(d)`
  }

  get pValuationKatex(): string {
    const pvaln = new Ratio(this.ratio.n).padicValuation(this.prime)
    const pvald = new Ratio(this.ratio.d).padicValuation(this.prime)
    return `v_{\\textcolor{red}{${this.prime}}}(${this.ratio.toKatex()}) 
    = \\textcolor{red}{${pvaln} - ${pvald}}
    = \\textcolor{red}{${pvaln - pvald}}`
  }

  get absExplainKatex(): string {
    return `|x|_{p} = \\frac{1}{p^{v_{p}(x)}}`
  }

  get absKatex(): string {
    const frac = this.ratio.padicAbs(this.prime).toKatex()
    const pri = this.ratio.factor(this.prime)
    return `|x|_{\\textcolor{red}{${this.prime}}} = \\frac{1}{\\textcolor{red}{${pri[0]}}^{\\textcolor{red}{${pri[1]}}}} = ${frac}`
  }

  get classicalDistanceKatex(): string {
    let rat1 = this.ratio.clone()
    let rat2 = this.randomRatio.clone()
    let res = rat1.sub(rat2)
    return `|x - y| = |${rat1.toKatex()} - ${rat2.toKatex()}| = |${res.toKatex()}| = ${res
      .abs()
      .toFixed()}...`
  }

  get padicDistanceKatex(): string {
    let rat1 = this.ratio.clone()
    let rat2 = this.randomRatio.clone()
    let res = rat1.sub(rat2)
    return `|x - y|_{${this.prime}} = 
    |${res.toKatex()}|_{${this.prime}} = 
    ${res.padicAbs(this.prime).toKatex()}`
  }

  get ostrowskiExplainKatex(): string {
    return `|\\frac{n}{d}| \\cdot  \\prod_{p \\geq 2}^{\\infin} |\\frac{n}{d}|_{p} = 1`
  }
  get ostrowskiKatex(): string {
    let result = ''
    result += new Ratio(this.ratio.n, this.ratio.d).factorsKatex(this.prime, true)
    result += '\\cdot 1 ... 1'

    return `|\\frac{${this.ratio.n}}{${this.ratio.d}}| \\cdot ${result} = 1`
  }
}
</script>

<style lang="scss" scoped></style>