<template>
  <div>
    <h2 class="text-black-600 font-bold font-sans text-2xl text-center mb-3 mt-6">
      {{ prime }}-adic expansion: a new way to write numbers!
    </h2>

    <!-- Prime factorization -->
    <p class="text-center text-gray-600 font-bold mt-6">
      With our new distance idea we can now rewrite numbers by their closeness to p={{ prime }}
    </p>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic infinite sum</div>
      <div
        class="w-2/3 text-left bg-gray-100 rounded-md"
        v-katex:display="explainSumKatex + '=' + expandedSumKatex"
      ></div>
    </div>

    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic expansion (ltr)</div>
      <div class="w-2/3 text-left bg-gray-200 rounded-md" v-katex:display="padic.toKatex()"></div>
    </div>

    <!-- Computation steps -->
    <p class="text-center text-gray-600 font-bold mt-6">
      Steps will repeat after some time in a infinite loop like a classical decimal expansion
    </p>
    <div class="flex items-center text-xl mt-3">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic expansion steps</div>
      <div class="w-2/3 text-left bg-gray-200">
        <table class="text-xl border-4 w-full text-center">
          <tr
            class="border-white border-2"
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
    <div class="flex text-xl mt-3">
      <div class="w-1/3 text-right mr-3">Repeated expansion</div>
      <div class="w-2/3 text-center text-lg bg-gray-200 rounded-md p-4">
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
export default class KatexExpansion extends Vue {
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

<style lang="scss" scoped></style>
