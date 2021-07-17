<template>
  <div class="container w-300 mx-auto my-6 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ prime }}-adic number expansion
    </h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

    <form @submit.prevent="onSubmit">
      <div class="flex">
        <div class="flex-1 my-5">
          <div class="flex items-center mb-6">
            <div class="w-1/3">
              <label class="my-2 block" for="psw">Rational number</label>
            </div>
            <div class="w-2/3">
              <input
                type="number"
                v-model.number="ratio_n"
                class="
                  w-full
                  mt-1
                  mb-3
                  shadow-md
                  border-none
                  focus:ring-transparent
                  rounded-sm
                  bg-gray-100
                  text-pink-500
                "
              />
              <hr class="border-black" />
              <input
                type="number"
                v-model.number="ratio_d"
                class="
                  w-full
                  mt-1
                  mb-3
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
          <div class="flex items-center">
            <div class="w-1/3">
              <label class="my-2" for="uname">Prime (p)</label>
            </div>
            <div class="w-2/3">
              <input
                type="number"
                v-model.number="prime"
                class="
                  w-full
                  mt-1
                  mb-3
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

          <div class="flex items-center mb-6">
            <div class="w-1/3">
              <label class="my-2" for="uname">Precision (k)</label>
            </div>
            <div class="w-2/3">
              <input
                type="number"
                v-model.number="precision"
                class="
                  w-full
                  mt-1
                  mb-3
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
          <div class="text-right mt-2">
            <button
              type="submit"
              class="px-7 py-2 mx-auto font-semibold text-white bg-pink-600 rounded"
            >
              Convert
            </button>
          </div>
        </div>

        <div class="flex-1 w-full h-full m-4">
          <div class="mt-10">
            <p class="text-4xl text-center font-semibold">
              ... {{ padic_str }}
              <sub>{{ prime }}</sub>
            </p>
            <div v-katex:auto>\(\frac{a_i}{1+x}\)</div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Ratio } from '../engine/Padic'

@Component
export default class App extends Vue {
  // Data
  ratio_n = -517
  ratio_d = 1477
  prime = 7
  precision = 11
  padic_str = '1 2 3 4 3 5 4 6 4 1. 1'

  @Watch('prime')
  @Watch('precision')
  @Watch('ratio_n')
  @Watch('ratio_d')
  onSubmit(): void {
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
      const padic = ratio.convertToPadic(this.prime, this.precision)
      this.padic_str = padic.toString()
    }
  }
}
</script>

<style></style>
