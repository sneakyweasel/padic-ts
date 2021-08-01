<template>
  <div>
    <div class="text-2xl mt-3">
      <p>Prime decomposition of a/b</p>
      <div class="flex-1" v-katex:display="factorsKatex"></div>
      <p>Prime exponent isolation</p>
      <div class="flex-1" v-katex:display="reconstructKatex"></div>
      <p>Padic norm</p>
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
    return ratioFactorsKatex(this.a, this.b, this.p)
  }
  get reconstructKatex(): string {
    const rat = ratioNormReconstruct(this.a, this.b, this.p)
    const pri = ratioPrimeReconstruct(this.a, this.b, this.p)
    return `= \\textcolor{red}{${pri[0]}^{${pri[1]}}} \\cdot \\frac{${rat[0]}}{${rat[1]}}`
  }
  get normKatex(): string {
    return `\\lvert\\frac{${this.a}}{${this.b}}\\lvert_{${this.p}} = ${padicNorm(
      this.a,
      this.b,
      this.p,
    )}`
  }
}
</script>

<style lang="scss" scoped></style>
