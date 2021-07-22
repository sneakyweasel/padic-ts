<template>
  <div>
    <table class="text-2xl border-4 w-full text-center">
      <tr>
        <td class="border-2" v-for="(num, i) in padic_arr" :key="'td1_' + i">
          {{ padic.prime }}<sup>{{ i }}</sup>
        </td>
      </tr>
      <tr>
        <td class="border-2" v-for="(num, i) in padic_arr" :key="'td2_' + i">
          {{ num }}
        </td>
      </tr>
      <tr>
        <td class="border-2" v-for="(num, i) in padic_arr" :key="'td3_' + i">
          {{ num * padic.prime ** i }}
        </td>
      </tr>
    </table>
    <div class="text-2xl mt-3">
      <div class="flex-1" v-katex:display="katex"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Padic } from '../engine/Padic'

@Component
export default class App extends Vue {
  @Prop() readonly padic!: Padic

  get padic_arr(): number[] {
    return this.padic.toArray()
  }

  get katex(): string {
    return `r = \\sum_{i=${this.padic.precision}}^\\infty a_i${
      this.padic.prime
    }^i = ${this.padic.dsum()}`
  }
}
</script>

<style lang="scss" scoped></style>
