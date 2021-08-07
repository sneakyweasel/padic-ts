<template>
  <div>
    <div class="flex-1 flex text-xl">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic expansion</div>
      <div class="w-1/3 text-left bg-gray-200" v-katex:display="explainKatex"></div>
      <div class="w-1/3 text-left bg-gray-200">
        {{ padic.toString() }}
      </div>
    </div>
    <div class="flex-1 flex text-xl">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic expansion steps</div>
      <div class="w-2/3 text-left bg-gray-200">
        <table class="text-xl border-4 w-full text-center">
          <tr v-for="(tup, index) of padicExpansion" :key="'tr_' + index">
            <td>
              <span class="text-pink-600">{{ tup.digit }}</span>
              .
              <span class="text-red-600">{{ prime }}</span>
              <sup>{{ index }}</sup>
            </td>
            <td>
              <div v-katex:display="fractionKatex(tup)"></div>
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
export default class KatexSum extends Vue {
  @Prop() readonly n!: number
  @Prop() readonly d!: number
  @Prop() readonly prime!: number

  get ratio(): Ratio {
    return new Ratio(this.n, this.d)
  }

  get padic(): Padic {
    return this.ratio.toPadic(this.prime)
  }

  get explainKatex(): string {
    return `x = \\sum_{k=n}^{\\infin} a_{k} \\cdot p^{k}`
  }

  fractionKatex(step: Step): string {
    return `${step.orig.toKatex()} = \\textcolor{magenta}{${step.digit}} + \\textcolor{red}{${
      this.prime
    }} \\cdot ${step.next.toKatex()}`
  }

  get padicExpansion(): Step[] {
    return this.ratio.toPadicExpansion(this.prime, 10)
  }

  get padicStr(): string {
    return this.padic.toArray().toString()
  }
}
</script>

<style lang="scss" scoped></style>
