<template>
  <!-- Prime decomposition -->
  <div class="flex flex-1">
    <div class="flex-1 flex items-center text-xl">
      <div class="w-1/2 text-right mr-3">Euclidean distance</div>
      <div class="w-1/2 text-left bg-gray-200" v-katex:display="euclideanDistance"></div>
    </div>
    <div class="flex-1 flex items-center text-xl">
      <div class="w-1/2 text-right mr-3">{{ p }}-adic distance</div>
      <div class="w-1/2 text-left bg-gray-200" v-katex:display="padicDistance"></div>
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
  @Prop() readonly c!: number
  @Prop() readonly d!: number
  @Prop() readonly p!: number
  @Prop() readonly letter!: string

  get ratio1(): Ratio {
    return new Ratio(this.a, this.b)
  }
  get ratio2(): Ratio {
    return new Ratio(this.c, this.d)
  }
  get euclideanDistance(): string {
    let dist = this.ratio1.euclideanDistance(this.ratio2)
    return `|x-y| = ${dist.toKatex()}`
  }
  get padicDistance(): string {
    let dist = this.ratio1.padicDistance(this.ratio2, this.p)
    return `|x-y|_{${this.p}} = ${dist.toKatex()}`
  }
}
</script>

<style lang="scss" scoped></style>
