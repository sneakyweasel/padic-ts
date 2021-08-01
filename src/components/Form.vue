<template>
  <div class="container w-300 mx-auto my-6 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ prime }}-adic number expansion
    </h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

    <form @submit.prevent="">
      <!-- Prime & Precision -->
      <div class="flex items-center">
        <div class="w-1/2 mr-3">
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
        </div>
        <div class="w-1/2">
          <label class="my-2 text-center" for="uname">Precision (k)</label>
          <input
            type="number"
            v-model.number="precision"
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
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

      <!-- Rational numbers -->
      <div class="flex items-center">
        <!-- Left -->
        <div class="flex w-1/2 items-center mr-3">
          <div class="w-1/3">
            <label class="block" for="psw">Rational</label>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model.number="ratio_n"
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
        <div class="w-1/2 h-full">
          <KatexFactors :a="ratio_n" :b="ratio_d" :p="prime" />
        </div>
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

      <div class="flex items-center">
        <!-- Ratio Prime Factors -->
        <div class="w-1/2 mr-3">
          <label class="block" for="psw">{{ prime }}-adic expansion</label>
          <input
            type="text"
            v-model="padic_str"
            class="
              w-full
              h-full
              mt-1
              mb-3
              text-3xl text-center
              shadow-md
              border-none
              focus:ring-transparent
              rounded-sm
              bg-gray-100
              text-pink-500
            "
          />
        </div>
        <div class="w-1/2 mr-3 text-2xl text-center">
          <div class="flex-1" v-katex:display="katexNorm"></div>
        </div>
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

      <!-- Table -->

      <!-- Table -->
      <!-- <div class="flex-1">
        <PadicTable :padic="padic" />
      </div> -->

      <!-- Katex Sum -->
      <!-- <div class="flex-1">
        <KatexSum :padic="padic" />
      </div> -->

      <!-- Katex Expansion -->
      <!-- <div class="flex-1">
        <KatexExpansion :padic="padic" />
      </div> -->

      <!-- Button -->
      <div class="flex-1">
        <div class="text-center mt-8 flex-1">
          <button
            type="submit"
            @click="handleConvertPadic"
            class="px-7 py-2 mr-1 mx-auto text-xl font-semibold text-white bg-pink-600 rounded"
          >
            Convert to p-adic
          </button>
          <button
            type="submit"
            @click="handleConvertRatio"
            class="px-7 py-2 ml-1 mx-auto text-xl font-semibold text-white bg-pink-600 rounded"
          >
            Convert to ratio
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Padic from '../engine/Padic'
import Ratio from '../engine/Ratio'
import { padicNorm } from '../engine/helpers'
import PadicTable from '@/components/PadicTable.vue'
import KatexSum from '@/components/KatexSum.vue'
import KatexExpansion from '@/components/KatexExpansion.vue'
import KatexFactors from '@/components/KatexFactors.vue'

@Component({
  components: {
    PadicTable,
    KatexSum,
    KatexFactors,
    KatexExpansion,
  },
})
export default class App extends Vue {
  // Data
  ratio_n = 63
  ratio_d = 550
  prime = 11
  precision = 7
  padic = new Padic(this.prime, this.precision)
  padic_str = ''
  padic_dsum = 0

  mounted(): void {
    this.handleConvertPadic()
  }

  get norm(): string {
    return padicNorm(this.ratio_n, this.ratio_d, this.prime)
  }
  get katexNorm(): string {
    return `\\lvert\\frac{${this.ratio_n}}{${this.ratio_d}}\\lvert_{${this.prime}} = ${this.norm}`
  }

  @Watch('prime')
  @Watch('precision')
  @Watch('ratio_n')
  @Watch('ratio_d')
  handleConvertPadic(): void {
    if (
      Number.isInteger(this.ratio_n) &&
      Number.isInteger(this.ratio_d) &&
      Number.isInteger(this.prime) &&
      Number.isInteger(this.precision) &&
      this.ratio_n !== 0 &&
      this.ratio_d !== 0 &&
      this.prime > 0 &&
      this.precision > 0
    ) {
      const ratio = new Ratio(this.ratio_n, this.ratio_d)
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
      console.log('---')
      console.log('PADIC')
      console.log(this.padic.toString())
      console.log(this.padic.toArray())
      console.log('RATIO')
      let ratio = this.padic.convertToRatio()
      console.log(ratio.toString())
    }
  }
}
</script>

<style></style>
