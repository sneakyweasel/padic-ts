<template>
  <div>
    <div class="mt-3">
      <div class="flex-1 text-2xl" v-katex:display="katex"></div>
      <ul>
        <li>x is a nonzero rational number</li>
        <li>p is a prime number</li>
        <li>r is a an integer non divisible by p</li>
        <li>s is a an integer non divisible by p</li>
      </ul>
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
    return `x = ${this.padic.prime}^a.\\frac{r}{s}`
  }
}
</script>

<style lang="scss" scoped></style>
