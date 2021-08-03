<template>
  <div>
    <!-- Prime decomposition -->
    <div class="flex items-center text-xl">
      <div class="w-1/2 text-right mr-3">Prime decomposition of {{ letter }}</div>
      <div class="w-1/2 text-left bg-gray-200" v-katex:display="factorsKatex"></div>
    </div>
    <!-- Padic form -->
    <div class="flex items-center text-xl">
      <div class="w-1/2 text-right mr-3">Isolate {{ p }}-adic prime</div>
      <div class="w-1/2 text-left bg-gray-200" v-katex:display="reconstructKatex"></div>
    </div>
    <!-- Padic norm -->
    <div class="flex items-center text-xl">
      <div class="w-1/2 text-right mr-3">{{ p }}-adic absolute value</div>
      <div class="w-1/2 items-left bg-gray-200" v-katex:display="absKatex"></div>
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
  @Prop() readonly letter!: string

  get ratio(): Ratio {
    return new Ratio(this.a, this.b)
  }

  get factorsKatex(): string {
    return `|${this.letter}| = ` + this.ratio.factorsKatex(this.p)
  }

  get reconstructKatex(): string {
    const rat = this.ratio.absReconstruct(this.p)
    const pri = this.ratio.primeReconstruct(this.p)
    return `|${this.letter}| = \\textcolor{red}{${pri[0]}^{${pri[1]}}} \\cdot ${rat.toKatex()}`
  }

  get abs(): string {
    const frac = this.ratio.padicNorm(this.p)
    return frac.toKatex()
  }

  get absKatex(): string {
    const pri = this.ratio.primeReconstruct(this.p)
    return `|${this.letter}|_{${this.p}} = 
    \\textcolor{red}{${pri[0]}^{-(${pri[1]})}} = 
    ${this.abs}`
  }
}
</script>

<style lang="scss" scoped></style>
