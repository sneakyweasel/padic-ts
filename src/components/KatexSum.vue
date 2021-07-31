<template>
  <div>
    <div class="text-2xl mt-3">
      <div class="flex-1" v-katex:display="katex"></div>
      <div class="flex-1" v-katex:display="katexPadicNorm"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import Padic from '../engine/Padic'

@Component
export default class KatexSum extends Vue {
  @Prop() readonly padic!: Padic

  get katex(): string {
    return `r = \\sum_{i=${this.padic.precision}}^\\infty a_i${
      this.padic.prime
    }^i = ${this.padic.dsum()}`
  }

  get katexPadicNorm(): string {
    return `|x|_p = ${this.padic.prime}^{-a}`
  }
}
</script>

<style lang="scss" scoped></style>
