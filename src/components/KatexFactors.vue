<template>
  <div>
    <div class="flex items-center text-xl">
      <!-- Left -->
      <div class="w-1/2 text-right mr-3">Prime decomposition of x</div>
      <!-- Right -->
      <div class="w-1/2 text-right mr-3">
        <div v-katex:display="factorsKatex"></div>
      </div>
    </div>

    <div class="flex items-center text-xl">
      <!-- Left -->
      <div class="w-1/2 text-right mr-3">Isolate {{ p }}-adic prime</div>
      <!-- Right -->
      <div class="w-1/2 text-right mr-3">
        <div v-katex:display="reconstructKatex"></div>
      </div>
    </div>

    <div class="flex items-center text-xl">
      <!-- Left -->
      <div class="w-1/2 text-right mr-3">{{ p }}-adic norm</div>
      <!-- Right -->
      <div class="w-1/2 text-right mr-3">
        <div v-katex:display="normKatex"></div>
      </div>
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
  @Prop() readonly p!: number

  get ratio(): Ratio {
    return new Ratio(this.a, this.b)
  }

  get factorsKatex(): string {
    return '|x| ' + this.ratio.factorsKatex(this.p)
  }

  get reconstructKatex(): string {
    const rat = this.ratio.normReconstruct(this.p)
    const pri = this.ratio.primeReconstruct(this.p)
    return `|x| = \\textcolor{red}{${pri[0]}^{${pri[1]}}} \\cdot \\frac{${rat[0]}}{${rat[1]}}`
  }

  get norm(): string {
    const frac = this.ratio.padicNorm(this.p)
    let result = ''
    if (frac[0] === 0) {
      result += '0'
    } else if (frac[1] === 1) {
      result += frac[0]
    } else {
      result += `\\frac{${frac[0]}}{${frac[1]}}`
    }
    return result
  }

  get normKatex(): string {
    const pri = this.ratio.primeReconstruct(this.p)
    return `|x|_{${this.p}} = 
    \\textcolor{red}{${pri[0]}^{-(${pri[1]})}} = 
    ${this.norm}`
  }
}
</script>

<style lang="scss" scoped></style>
