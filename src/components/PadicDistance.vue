<template>
  <div>
    <h2 class="text-black-600 mb-3 font-bold font-sans text-2xl text-center">
      {{ prime }}-adic distance: a new way to measure distance!
    </h2>

    <!-- Prime decomposition -->
    <p class="text-center text-gray-600 font-bold mt-6">
      Any fraction can be written as the multiplication of its prime factors
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">Prime factorization of numerator (n)</div>
      <div class="w-2/3 text-left bg-gray-200 rounded-md" v-katex:display="factorsNKatex"></div>
    </div>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">Prime factorization of denominator (d)</div>
      <div class="w-2/3 text-left bg-gray-200 rounded-md" v-katex:display="factorsDKatex"></div>
    </div>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">Prime factorization of the fraction (x)</div>
      <div class="w-2/3 text-left bg-gray-200 rounded-md" v-katex:display="factorsNDKatex"></div>
    </div>

    <!-- Prime isolation form -->
    <p class="text-center text-gray-600 font-bold mt-6">
      We rewrite the fraction to highlight its relation with the selected prime p={{ prime }}
      (shown in blue)
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">Any fraction can be expressed as</div>
      <div
        class="w-1/3 text-left bg-gray-100 rounded-md mr-2"
        v-katex:display="isolationExplainKatex"
      ></div>
      <div class="w-1/3 text-left bg-gray-200 rounded-md" v-katex:display="isolationKatex"></div>
    </div>

    <!-- P-valuation -->
    <p class="text-center text-gray-600 font-bold mt-6">
      We call p-adic valuation v<sub>p</sub>(x) the exponent of the selected prime p={{ prime }}
      (shown in magenta)
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic valuation of x</div>
      <div
        class="w-1/3 text-left bg-gray-100 rounded-md mr-2"
        v-katex:display="pValuationExplainKatex"
      ></div>
      <div class="w-1/3 text-left bg-gray-200 rounded-md" v-katex:display="pValuationKatex"></div>
    </div>

    <!-- Padic absolute value -->
    <p class="text-center text-gray-600 font-bold mt-6">
      This gives us a new notion of distance between numbers in relation with p={{ prime }}
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic absolute value</div>
      <div
        class="w-1/3 items-left bg-gray-100 rounded-md mr-2"
        v-katex:display="absExplainKatex"
      ></div>
      <div class="w-1/3 items-left bg-gray-200 rounded-md" v-katex:display="absKatex"></div>
    </div>

    <!-- Distance compare -->
    <p class="text-center text-gray-600 font-bold mt-6">
      Let's compare the classical distance and the {{ prime }}-adic distance with the random number
      {{ randomRatio.n }}/{{ randomRatio.d }}, you can modify the first fraction and see how the
      difference between those two distances changes
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">Classical distance</div>
      <div
        class="w-2/3 items-left bg-gray-200 rounded-md"
        v-katex:display="classicalDistanceKatex"
      ></div>
    </div>
    <div class="flex items-center mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic distance</div>
      <div
        class="w-2/3 items-left bg-gray-200 rounded-md"
        v-katex:display="padicDistanceKatex"
      ></div>
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
    return `x = \\textcolor{blue}{p}^{\\textcolor{magenta}{v_{p}(x)}} \\cdot \\frac{a}{b}`
  }

  get isolationKatex(): string {
    const pri = this.ratio.factor(this.prime)
    const rat = this.ratio.reconstructWithoutPrime(this.prime)
    let result = this.ratio.toKatex() + ' = '
    if (this.ratio.sign === -1) {
      result += '-'
    }
    result += `\\textcolor{blue}{${this.prime}}^{\\textcolor{magenta}{${
      pri[1]
    }}} \\cdot ${rat.toKatex()}`
    return result
  }

  get pValuationExplainKatex(): string {
    return `\\textcolor{magenta}{v_{p}}(\\frac{n}{d}) = \\textcolor{magenta}{v_{p}}(n) - \\textcolor{magenta}{v_{p}}(d)`
  }

  get pValuationKatex(): string {
    const pvaln = new Ratio(this.ratio.n).padicValuation(this.prime)
    const pvald = new Ratio(this.ratio.d).padicValuation(this.prime)
    return `\\textcolor{magenta}{v_{${this.prime}}}(${this.ratio.toKatex()}) 
    = \\textcolor{magenta}{${pvaln}} - \\textcolor{magenta}{${pvald}}
    = \\textcolor{magenta}{${pvaln - pvald}}`
  }

  get absExplainKatex(): string {
    return `|x|_{\\textcolor{blue}{p}} 
    = \\frac{1}{
      \\textcolor{blue}{p}^{\\textcolor{magenta}{v_{p}(x)}}}
    `
  }

  get absKatex(): string {
    const frac = this.ratio.padicAbs(this.prime).toKatex()
    const pri = this.ratio.factor(this.prime)
    return `|${this.ratio.toKatex()}|_{\\textcolor{blue}{${
      this.prime
    }}} = \\frac{1}{\\textcolor{blue}{${pri[0]}}^{\\textcolor{magenta}{${pri[1]}}}} = ${frac}`
  }

  get classicalDistanceKatex(): string {
    let rat1 = this.ratio.clone()
    let rat2 = this.randomRatio.clone()
    let res = rat1.sub(rat2).reduce()
    return `|x - y| = |${rat1.toKatex()} - ${rat2.toKatex()}| = |${res.toKatex()}| = ${res
      .abs()
      .toFixed()}...`
  }

  get padicDistanceKatex(): string {
    let rat1 = this.ratio.clone()
    let rat2 = this.randomRatio.clone()
    let res = rat1.sub(rat2).reduce()
    return `|x - y|_{\\textcolor{blue}{${this.prime}}} = 
    |${res.toKatex()}|_{\\textcolor{blue}{${this.prime}}} = 
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
