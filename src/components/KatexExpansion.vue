<template>
  <div>
    <div class="flex-1 flex text-xl">
      <div class="w-1/3 text-right mr-3">{{ prime }}-adic expansion</div>
      <div class="w-1/3 text-left bg-gray-200" v-katex:display="explainKatex"></div>
      <div class="w-1/3 text-left bg-gray-200">
        {{ padicExpansion }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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

  get padicExpansion(): string {
    return this.padic.toString()
  }
}
</script>

<style lang="scss" scoped></style>
