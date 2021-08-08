<template>
  <div class="container w-300 mx-auto my-6 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">P-adic numbers</h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

    <div class="text-center">
      <p>
        <b>Why should I care?</b>
        <br />
        The p-adics are another way to represent numbers which proved crucial for solving Fermat's
        last theorem, an unsolved problem for 350 years and has led to lots of progress in Number
        Theory. It is fascinating because it gives us a new notion of distance between numbers.
      </p>
      <p>
        <br />
        <b>Choose a fraction and a prime number!</b>
      </p>
    </div>

    <form @submit.prevent="">
      <!-- Prime & Precision -->
      <!-- <div class="flex items-center">
        <div class="w-1/3">
          <label class="block text-center" for="psw">Preset</label>
        </div>
        <div class="w-2/3">
          <input
            type="number"
            v-model.number="preset_id"
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
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div> -->

      <div class="flex">
        <div class="flex w-1/2 items-center mr-3">
          <div class="w-1/3">
            <label class="block text-center" for="psw">Fraction (x)</label>
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
        <div class="flex w-1/2 items-center ml-3">
          <div class="w-1/3">
            <label class="my-2 text-center" for="uname">Prime number (p)</label>
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
          {{ prime }}-adic distance: a new way to measure distance!
        </h2>
        <div class="flex-1 flex">
          <div class="w-full ml-3">
            <KatexValuation :n="n" :d="d" :prime="prime" letter="x" />
          </div>
        </div>
        <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

        <!-- Padic expansion -->
        <div class="flex-1 mt-6">
          <h2 class="text-pink-600 font-bold font-sans text-2xl text-center mb-3">
            {{ prime }}-adic expansion: a new way to write numbers!
          </h2>
          <div class="flex-1 flex">
            <div class="w-full ml-3">
              <KatexExpansion :n="n" :d="d" :prime="prime" :precision="precision" />
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
import { presets } from '../engine/data'
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
  preset_id = 1
  n = 2
  d = 5
  prime = 3
  primeCheck = true
  precision = 8
  padic = new Padic(this.prime, this.precision)
  padic_str = ''
  padic_dsum = 0

  mounted(): void {
    this.handleConvertPadic()
  }

  @Watch('preset_id')
  loadPreset(): void {
    const preset = presets[this.preset_id]
    this.n = preset.n1
    this.d = preset.d1
    this.prime = preset.p
    this.precision = preset.k
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
