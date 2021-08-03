<template>
  <div class="container w-300 mx-auto my-6 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">P-adic number tools</h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

    <form @submit.prevent="">
      <!-- Prime & Precision -->
      <div class="flex">
        <div class="w-1/2 mr-6">
          <label class="my-2 text-center" for="uname">Prime (p)</label>
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
        <div class="w-1/2"></div>
      </div>
      <!-- Rational numbers -->
      <div class="flex">
        <!-- Ratio x -->
        <div class="flex w-1/2 items-center mr-3">
          <div class="w-1/3">
            <label class="block" for="psw">Ratio (x)</label>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model.number="ratio_a"
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
              v-model.number="ratio_b"
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
        <!-- Ratio y -->
        <div class="flex w-1/2 items-center ml-3">
          <div class="w-1/3">
            <label class="block" for="psw">Ratio (y)</label>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model.number="ratio_c"
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
              v-model.number="ratio_d"
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
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

      <!-- Toggle if not prime -->
      <div v-if="primeCheck">
        <!-- Padic absolute value -->
        <h2 class="text-pink-600 mb-3 font-bold font-sans text-2xl text-center">
          {{ prime }}-adic absolute value
        </h2>
        <div class="flex-1 flex">
          <div class="w-1/2 ml-3">
            <KatexFactors :a="ratio_a" :b="ratio_b" :p="prime" letter="x" />
          </div>
          <div class="w-1/2 ml-3">
            <KatexFactors :a="ratio_c" :b="ratio_d" :p="prime" letter="y" />
          </div>
        </div>
        <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

        <!-- Padic distance -->
        <h2 class="text-pink-600 font-bold font-sans text-2xl text-center">
          {{ prime }}-adic distance
        </h2>
        <div class="flex-1 flex mt-3">
          <KatexDistance :a="ratio_a" :b="ratio_b" :c="ratio_c" :d="ratio_d" :p="prime" />
        </div>
        <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

        <!-- Padic expansion -->
        <div class="flex-1">
          <h2 class="text-pink-600 font-bold font-sans text-2xl text-center">
            {{ prime }}-adic expansion
          </h2>
          <div class="w-full mr-3 text-xl items-center">
            <input
              type="text"
              v-model="padic_str"
              class="
                w-full
                h-full
                mt-1
                mb-3
                text-2xl text-center
                shadow-md
                border-none
                focus:ring-transparent
                rounded-sm
                bg-gray-100
                text-pink-500
              "
            />
          </div>
          <div class="w-1/2 mr-3 text-2xl text-center"></div>
        </div>
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getRandomInt } from '../engine/helpers'
import Padic from '../engine/Padic'
import Ratio from '../engine/Ratio'
import { isPrime } from '../engine/helpers'
import PadicTable from '@/components/PadicTable.vue'
import KatexSum from '@/components/KatexSum.vue'
import KatexExpansion from '@/components/KatexExpansion.vue'
import KatexFactors from '@/components/KatexFactors.vue'
import KatexDistance from '@/components/KatexDistance.vue'

@Component({
  components: {
    PadicTable,
    KatexSum,
    KatexFactors,
    KatexExpansion,
    KatexDistance,
  },
})
export default class App extends Vue {
  // Data
  ratio_a = getRandomInt()
  ratio_b = getRandomInt()
  ratio_c = getRandomInt()
  ratio_d = getRandomInt()
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
  @Watch('ratio_a')
  @Watch('ratio_b')
  @Watch('ratio_c')
  @Watch('ratio_d')
  handleConvertPadic(): void {
    this.primeCheck = isPrime(this.prime)
    if (
      Number.isInteger(this.ratio_a) &&
      Number.isInteger(this.ratio_b) &&
      Number.isInteger(this.ratio_c) &&
      Number.isInteger(this.ratio_d) &&
      Number.isInteger(this.prime) &&
      Number.isInteger(this.precision) &&
      this.ratio_a !== 0 &&
      this.ratio_b !== 0 &&
      this.ratio_c !== 0 &&
      this.ratio_d !== 0 &&
      this.prime > 0 &&
      this.precision > 0 &&
      this.primeCheck
    ) {
      const ratio = new Ratio(this.ratio_a, this.ratio_b)
      this.padic = ratio.convertToPadic(this.prime, this.precision)
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
