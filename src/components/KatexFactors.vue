<template>
  <div>
    <div class="text-2xl mt-3">
      <div class="flex-1" v-katex:display="katex"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { ratioFactorsKatex } from '../engine/helpers'

@Component
export default class KatexFactors extends Vue {
  @Prop() readonly a!: number
  @Prop() readonly b!: number

  get katex(): string {
    const primes = ratioFactorsKatex(this.a, this.b)
    return `\\frac{${this.a}}{${this.b}} = ` + primes
  }
}
</script>

<style lang="scss" scoped></style>
