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
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import Padic from '../engine/Padic'

@Component
export default class App extends Vue {
  @Prop() readonly padic!: Padic

  get padic_arr(): number[] {
    return this.padic.toArray()
  }
}
</script>

<style lang="scss" scoped></style>
