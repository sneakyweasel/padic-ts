<template>
  <div class="container w-300 mx-auto my-6 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">P-adic number tools</h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

    <form @submit.prevent="">
      <!-- Prime & Precision -->
      <div class="flex">
        <div class="flex w-1/2 items-center mr-3">
          <div class="w-1/3">
            <label class="block text-center" for="psw">Ratio (x)</label>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model.number="n"
              class="
                w-full
                mt-1
                mb-3
                text-xl text-center
                shadow-md
                border-none
                focus:ring-transparent
                rounded-sm
                bg-gray-100
                text-pink-500
              "
            />
            <hr class="bg-black h-0.5" />
            <input
              type="number"
              v-model.number="d"
              class="
                w-full
                mt-1
                mb-3
                text-xl text-center
                shadow-md
                border-none
                focus:ring-transparent
                rounded-sm
                bg-gray-100
                text-pink-500
              "
            />
          </div>
        </div>
        <div class="flex w-1/2 items-center mr-6">
          <div class="w-1/3">
            <label class="my-2 text-center" for="uname">Prime (p)</label>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model.number="prime"
              class="
                w-full
                mt-1
                mb-3
                text-xl text-center
                shadow-md
                border-none
                focus:ring-transparent
                rounded-sm
                bg-gray-100
                text-pink-500
              "
            />
            <p class="text-red-500" v-if="!primeCheck">{{ prime }} is not a prime number.</p>
          </div>
        </div>
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

      <!-- Toggle if not prime -->
      <div v-if="primeCheck">
        <!-- Padic absolute value -->
        <h2 class="text-pink-600 mb-3 font-bold font-sans text-2xl text-center">
          {{ prime }}-adic valuation and absolute value
        </h2>
        <div class="flex-1 flex">
          <div class="w-full ml-3">
            <KatexValuation :n="n" :d="d" :prime="prime" letter="x" />
          </div>
        </div>
        <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

        <!-- Padic expansion -->
        <div class="flex-1">
          <h2 class="text-pink-600 font-bold font-sans text-2xl text-center">
            {{ prime }}-adic expansion
          </h2>
          <div class="flex-1 flex">
            <div class="w-full ml-3">
              <KatexExpansion :n="n" :d="d" :prime="prime" letter="x" />
            </div>
          </div>
        </div>
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Padic from '../engine/Padic'
import Ratio from '../engine/Ratio'
import { isPrime } from '../engine/helpers'
import PadicTable from '@/components/PadicTable.vue'
import KatexSum from '@/components/KatexSum.vue'
import KatexExpansion from '@/components/KatexExpansion.vue'
import KatexValuation from '@/components/KatexValuation.vue'
import KatexDistance from '@/components/KatexDistance.vue'

@Component({
  components: {
    PadicTable,
    KatexSum,
    KatexValuation,
    KatexExpansion,
    KatexDistance,
  },
})
export default class App extends Vue {
  // Data
  n = 2
  d = 5
  prime = 3
  primeCheck = true
  precision = 16
  padic = new Padic(this.prime, this.precision)
  padic_str = ''
  padic_dsum = 0

  mounted(): void {
    this.handleConvertPadic()
  }

  @Watch('prime')
  @Watch('precision')
  @Watch('n')
  @Watch('d')
  handleConvertPadic(): void {
    this.primeCheck = isPrime(this.prime)
    if (
      Number.isInteger(this.n) &&
      Number.isInteger(this.d) &&
      Number.isInteger(this.prime) &&
      Number.isInteger(this.precision) &&
      this.n !== 0 &&
      this.d !== 0 &&
      this.prime > 0 &&
      this.precision > 0 &&
      this.primeCheck
    ) {
      const ratio = new Ratio(this.n, this.d)
      this.padic = ratio.toPadic(this.prime, this.precision)
      this.padic_dsum = this.padic.dsum()
      this.padic_str = this.padic.toString()
    }
  }

  @Watch('padic_str')
  handleConvertRatio(): void {
    if (
      Number.isInteger(this.prime) &&
      Number.isInteger(this.precision) &&
      this.prime > 0 &&
      this.precision > 0
    ) {
      // console.log('---')
      // console.log('PADIC')
      // console.log(this.padic.toString())
      // console.log(this.padic.toArray())
      // console.log('RATIO')
      // let ratio = this.padic.convertToRatio()
      // console.log(ratio.toString())
    }
  }
}
</script>

<style></style>
