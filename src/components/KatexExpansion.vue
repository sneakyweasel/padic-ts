<template>
  <div>
    <div class="flex-1 flex text-xl">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic expansion (rtl)</div>
      <div class="w-1/3 text-left bg-gray-200" v-katex:display="explainKatex"></div>
      <div class="w-1/3 text-left text-2xl bg-gray-200" v-katex:display="padic.toKatex()"></div>
    </div>
    <div class="flex-1 flex text-xl mt-3">
      <div class="w-1/3 text-right mr-3">Repeated expansion sequence</div>
      <div class="w-2/3 text-center text-lg bg-gray-200">
        {{ padic.toStringLTR() }}
      </div>
    </div>
    <div class="flex-1 flex text-xl mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic valuation</div>
      <div class="w-2/3 text-center bg-gray-200">
        {{ padic.valuation }}
      </div>
    </div>
    <div class="flex-1 flex text-xl mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic expansion steps</div>
      <div class="w-2/3 text-left bg-gray-200">
        <table class="text-xl border-4 w-full text-center">
          <tr v-for="(tup, index) of padicExpansion" :key="'tr_' + index">
            <td>
              <div v-katex:display="stepKatex(tup, index)"></div>
            </td>
            <td>
              <div v-katex:display="fractionKatex(tup)"></div>
            </td>
            <td>
              <div v-katex:display="sumKatex(tup, index)"></div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Step } from '@/engine/helpers'
import Ratio from '@/engine/Ratio'
import Padic from '@/engine/Padic'
import { Prop, Component, Vue } from 'vue-property-decorator'

@Component
export default class KatexExpansion extends Vue {
  @Prop() readonly n!: number
  @Prop() readonly d!: number
  @Prop() readonly prime!: number
  @Prop() readonly precision!: number

  get ratio(): Ratio {
    return new Ratio(this.n, this.d)
  }

  get padic(): Padic {
    return this.ratio.toPadic(this.prime)
  }

  get explainKatex(): string {
    return `x = \\sum_{k=n}^{\\infin} a_{k} \\cdot p^{k}`
  }

  stepKatex(step: Step, index: number): string {
    return `Step \\space \\textcolor{blue}{${index}}`
  }

  sumKatex(step: Step, index: number): string {
    return `\\textcolor{magenta}{${step.digit}} \\cdot \\textcolor{red}{${this.prime}}^{\\textcolor{blue}{${index}}}`
  }

  fractionKatex(step: Step): string {
    return `${step.orig.toKatex()} = \\textcolor{magenta}{${step.digit}} + \\textcolor{red}{${
      this.prime
    }} \\cdot ${step.next.toKatex()}`
  }

  get padicExpansion(): Step[] {
    return this.ratio.toPadicSteps(this.prime, this.precision)
  }

  get padicStr(): string {
    return this.padic.toArray().join(' ')
  }
}
</script>

<style lang="scss" scoped></style>
