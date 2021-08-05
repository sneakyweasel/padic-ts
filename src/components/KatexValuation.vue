<template>
  <div>
    <!-- Prime decomposition -->
    <div class="flex-1 flex text-xl">
      <div class="w-1/3 text-right mr-3">Prime decomposition of n</div>
      <div class="w-2/3 text-left bg-gray-200" v-katex:display="factorsNKatex"></div>
    </div>
    <div class="flex-1 flex text-xl mt-2">
      <div class="w-1/3 text-right mr-3">Prime decomposition of d</div>
      <div class="w-2/3 text-left bg-gray-200" v-katex:display="factorsDKatex"></div>
    </div>
    <!-- Prime isolation form -->
    <div class="flex-1 flex text-xl mt-2">
      <div class="w-1/3 text-right mr-3">Any ratio can be expressed as</div>
      <div class="w-1/3 text-left bg-gray-100 mr-2" v-katex:display="isolationExplainKatex"></div>
      <div class="w-1/3 text-left bg-gray-200" v-katex:display="isolationKatex"></div>
    </div>
    <!-- P-valuation -->
    <div class="flex-1 flex text-xl mt-2">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic valuation of x</div>
      <div class="w-1/3 text-left bg-gray-100 mr-2" v-katex:display="pValuationExplainKatex"></div>
      <div class="w-1/3 text-left bg-gray-200" v-katex:display="pValuationKatex"></div>
    </div>
    <!-- Padic absolute value -->
    <div class="flex-1 flex text-xl mt-2">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic absolute value</div>
      <div class="w-1/3 items-left bg-gray-100 mr-2" v-katex:display="absExplainKatex"></div>
      <div class="w-1/3 items-left bg-gray-200" v-katex:display="absKatex"></div>
    </div>
    <!-- Padic mirror -->
    <div class="flex-1 flex text-xl mt-2">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic absolute value</div>
      <div class="w-1/3 items-left bg-gray-100 mr-2" v-katex:display="absExplainKatex"></div>
      <div class="w-1/3 items-left bg-gray-200" v-katex:display="absKatex"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import Ratio from '../engine/Ratio'

@Component
export default class KatexFactors extends Vue {
  @Prop() readonly a!: number
  @Prop() readonly b!: number
  @Prop() readonly prime!: number
  @Prop() readonly letter!: string

  get ratio(): Ratio {
    return new Ratio(this.a, this.b)
  }

  get factorsNKatex(): string {
    const factors = new Ratio(this.a).factorsKatex(this.prime)
    return `${this.a} = ` + factors
  }

  get factorsDKatex(): string {
    const factors = new Ratio(this.b).factorsKatex(this.prime, true)
    return `1/${this.b} = ` + factors
  }

  get isolationExplainKatex(): string {
    return `x = p^{v_{p}(x)} \\cdot \\frac{m}{n}`
  }

  get isolationKatex(): string {
    const rat = this.ratio.absReconstruct(this.prime)
    const pri = this.ratio.primeReconstruct(this.prime)
    let result = 'x = '
    if (this.ratio.sign === -1) {
      result += '-'
    }
    result += `\\textcolor{red}{${pri[0]}}^{\\textcolor{red}{${pri[1]}}} \\cdot ${rat.toKatex()}`
    return result
  }

  get pValuationExplainKatex(): string {
    return `v_{p}(\\frac{a}{b}) = v_{p}(a)-v_{p}(b)`
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
    const pri = this.ratio.primeReconstruct(this.prime)
    return `|x|_{\\textcolor{red}{${this.prime}}} = \\frac{1}{\\textcolor{red}{${pri[0]}}^{\\textcolor{red}{${pri[1]}}}} = ${frac}`
  }
}
</script>

<style lang="scss" scoped></style>
