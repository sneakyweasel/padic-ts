<template>
  <div>
    <h2 class="title">{{ prime }}-adic expansion: a new way to write numbers!</h2>

    <!-- Classical sum -->
    <p class="intro">We usually represent fractions using decimal representation in base ten</p>
    <!-- Fraction input -->
    <div class="flex items-center mr-3">
      <div class="w-1/3 definition">Decimal expansion</div>
      <div class="w-2/3 dynamic" v-katex:display="decimalKatex"></div>
    </div>
    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">Infinite sum of 10<sup>x</sup></div>
      <div class="w-2/3 dynamic" v-katex:display="classicalSumKatex"></div>
    </div>

    <!-- Padic sum -->
    <p class="intro">
      With our new distance idea we can now rewrite numbers by their closeness to p={{ prime }}
    </p>
    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">{{ prime }}-adic expansion (ltr)</div>
      <div class="w-2/3 dynamic" v-katex:display="padic.toKatex()"></div>
    </div>
    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">{{ prime }}-adic infinite sum</div>
      <div class="w-2/3 dynamic" v-katex:display="expandedSumKatex"></div>
    </div>
    <div class="flex items-center mt-3">
      <div class="w-1/3 definition">{{ prime }}-adic valuation</div>
      <div class="w-2/3 dynamic" v-katex:display="padicValuation"></div>
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

  get num(): string {
    return this.ratio.toFixed(4)
  }

  get padic(): Padic {
    return this.ratio.toPadic(this.prime)
  }

  get padicValuation(): string {
    return this.ratio.padicValuation(this.prime).toString()
  }

  get padicExpansion(): Step[] {
    return this.ratio.toPadicSteps(this.prime, this.precision)
  }

  get padicStr(): string {
    return this.padic.toArray().join(' ')
  }

  get decimalKatex(): string {
    return `${this.ratio.toKatex()} \\approx \\textcolor{purple}{${this.num}}`
  }

  get classicalSumKatex(): string {
    let result = `\\sum_{\\textcolor{red}{k}=n}^{\\infin} \\textcolor{purple}{digit}_{\\textcolor{red}{k}} \\cdot \\textcolor{blue}{10}^{\\textcolor{red}{k}} =`
    let intPart = ''
    let decPart = ''
    if (this.num.toString().includes('.')) {
      intPart = this.num.toString().split('.')[0]
      decPart = this.num.toString().split('.')[1]
    } else {
      intPart = this.num.toString().split('.')[0]
    }
    intPart.split('').forEach((digit, index) => {
      result += `\\textcolor{purple}{${digit}} \\cdot \\textcolor{blue}{10}^{\\textcolor{red}{${
        intPart.length - index - 1
      }}} + `
    })
    decPart.split('').forEach((digit, index) => {
      result += `\\textcolor{purple}{${digit}} \\cdot \\textcolor{blue}{10}^{\\textcolor{red}{-${
        index + 1
      }}} + `
    })
    return result.slice(0, -3)
  }

  get expandedSumKatex(): string {
    let result = `\\sum_{\\textcolor{red}{k}=n}^{\\infin} \\textcolor{purple}{digit}_{\\textcolor{red}{k}} \\cdot \\textcolor{blue}{p}^{\\textcolor{red}{k}} = `
    this.padicExpansion.slice(0, 5).forEach((step, index) => {
      result += this.sumKatex(step, index)
      result += ' + '
    })
    result += '...'
    return result
  }

  stepKatex(step: Step, index: number): string {
    return `Digit \\space \\textcolor{red}{${index}}`
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
