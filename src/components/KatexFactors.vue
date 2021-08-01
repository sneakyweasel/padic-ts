<template>
  <div>
    <div class="text-2xl mt-3">
      <p>Prime decomposition of x</p>
      <div class="flex-1" v-katex:display="factorsKatex"></div>
      <p>Isolate {{ p }}-adic prime</p>
      <div class="flex-1" v-katex:display="reconstructKatex"></div>
      <p>{{ p }}-adic norm</p>
      <div class="flex-1" v-katex:display="normKatex"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import {
  padicNorm,
  ratioFactorsKatex,
  ratioPrimeReconstruct,
  ratioNormReconstruct,
} from '../engine/helpers'

@Component
export default class KatexFactors extends Vue {
  @Prop() readonly a!: number
  @Prop() readonly b!: number
  @Prop() readonly p!: number

  get factorsKatex(): string {
    return '|x| ' + ratioFactorsKatex(this.a, this.b, this.p)
  }

  get reconstructKatex(): string {
    const rat = ratioNormReconstruct(this.a, this.b, this.p)
    const pri = ratioPrimeReconstruct(this.a, this.b, this.p)
    return `|x| = \\textcolor{red}{${pri[0]}^{${pri[1]}}} * \\frac{${rat[0]}}{${rat[1]}}`
  }

  get norm(): string {
    const frac = padicNorm(this.a, this.b, this.p)
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
    const pri = ratioPrimeReconstruct(this.a, this.b, this.p)
    return `|x|_{${this.p}} = 
    \\textcolor{red}{${pri[0]}^{-(${pri[1]})}} = 
    ${this.norm}`
  }
}
</script>

<style lang="scss" scoped></style>
