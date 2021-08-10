<template>
  <div>
    <h2 class="title">{{ prime }}-adic expansion: a new way to write numbers!</h2>

    <!-- Prime factorization -->
    <p class="intro">
      With our new distance idea we can now rewrite numbers by their closeness to p={{ prime }}
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">{{ prime }}-adic infinite sum</div>
      <div class="w-2/3 dynamic" v-katex:display="explainSumKatex + '=' + expandedSumKatex"></div>
    </div>

    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">{{ prime }}-adic expansion (ltr)</div>
      <div class="w-2/3 dynamic" v-katex:display="padic.toKatex()"></div>
    </div>

    <!-- Computation steps -->
    <p class="intro">
      Steps will repeat after some time in a infinite loop like a classical decimal expansion
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">{{ prime }}-adic expansion steps</div>
      <div class="w-2/3 dynamic">
        <table class="w-full text-center">
          <tr
            class="border-white border-4"
            v-for="(tup, index) of padicExpansion"
            :key="'tr_' + index"
          >
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
    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">Repeated expansion</div>
      <div class="w-2/3 dynamic p-4">
        {{ padic.toStringLTR() }}
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
export default class PadicExpansion extends Vue {
  @Prop() readonly ratio!: Ratio
  @Prop() readonly prime!: number
  @Prop() readonly precision!: number

  get padic(): Padic {
    return this.ratio.toPadic(this.prime)
  }

  get padicExpansion(): Step[] {
    return this.ratio.toPadicSteps(this.prime, this.precision)
  }

  get padicStr(): string {
    return this.padic.toArray().join(' ')
  }

  get expandedSumKatex(): string {
    let result = ''
    this.padicExpansion.slice(0, 5).forEach((step, index) => {
      result += this.sumKatex(step, index)
      result += ' + '
    })
    result += '...'
    return result
  }

  get explainSumKatex(): string {
    return `\\sum_{\\textcolor{red}{k}=n}^{\\infin} a_{\\textcolor{red}{k}} \\cdot \\textcolor{blue}{p}^{\\textcolor{red}{k}}`
  }

  stepKatex(step: Step, index: number): string {
    return `Step \\space \\textcolor{red}{${index}}`
  }

  sumKatex(step: Step, index: number): string {
    return `\\textcolor{purple}{${step.digit}}_{\\textcolor{red}{${index}}} \\cdot \\textcolor{blue}{${this.prime}}^{\\textcolor{red}{${index}}}`
  }

  fractionKatex(step: Step): string {
    return `${step.orig.toKatex()} = \\textcolor{purple}{${step.digit}} + \\textcolor{blue}{${
      this.prime
    }} \\cdot ${step.next.toKatex()}`
  }
}
</script>

<style></style>
