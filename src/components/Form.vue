<template>
  <div class="container w-300 mx-auto my-6 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ prime }}-adic number expansion
    </h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

    <form @submit.prevent="onSubmit">
      <!-- Prime & Precision -->
      <div class="flex">
        <div class="flex-1 flex items-center">
          <div class="w-1/3"></div>
          <div class="w-1/3">
            <label class="my-2 text-center" for="uname">Prime (p)</label>
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
          <div class="w-1/3"></div>
        </div>
        <div class="flex-1 flex items-center">
          <div class="w-1/3"></div>
          <div class="w-1/3">
            <label class="my-2 text-center" for="uname">Precision (k)</label>
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
          <div class="w-1/3"></div>
        </div>
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

      <!-- Rational numbers -->
      <div class="flex">
        <!-- Rational number 1 -->
        <div class="flex-1 my-5">
          <div class="flex items-center mb-6">
            <div class="w-1/3"></div>
            <div class="w-1/3">
              <label class="my-2 block" for="psw">Fraction a</label>
              <input
                type="number"
                v-model.number="ratio1_n"
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
                v-model.number="ratio1_d"
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
          <div class="flex-1 w-full h-full m-4">
            <div class="mt-10">
              <p class="text-2xl text-center font-semibold">
                ... {{ padic1_str }}
                <sub>{{ prime }}</sub>
              </p>
            </div>
          </div>
        </div>

        <!-- Rational number 2 -->
        <div class="flex-1 my-5">
          <div class="flex items-center mb-6">
            <div class="w-1/3"></div>
            <div class="w-1/3">
              <label class="my-2 block" for="psw">Fraction b</label>
              <input
                type="number"
                v-model.number="ratio2_n"
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
                v-model.number="ratio2_d"
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
          <div class="flex-1 w-full h-full m-4">
            <div class="mt-10">
              <p class="text-2xl text-center font-semibold">
                ... {{ padic2_str }}
                <sub>{{ prime }}</sub>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex">
        <div class="text-center mt-2 flex-1">
          <button
            type="submit"
            class="px-7 py-2 mx-auto text-xl font-semibold text-white bg-pink-600 rounded"
          >
            Convert
          </button>
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
  ratio1_n = -517
  ratio1_d = 1477
  ratio2_n = -517
  ratio2_d = 1477
  prime = 7
  precision = 11
  padic1_str = ''
  padic2_str = ''
  padic_dsum = 0
  padic_cmpt = ''

  mounted(): void {
    this.onSubmit()
  }

  @Watch('prime')
  @Watch('precision')
  @Watch('ratio1_n')
  @Watch('ratio1_d')
  @Watch('ratio2_n')
  @Watch('ratio2_d')
  onSubmit(): void {
    if (
      Number.isInteger(this.ratio1_n) &&
      Number.isInteger(this.ratio1_d) &&
      Number.isInteger(this.ratio2_n) &&
      Number.isInteger(this.ratio2_d) &&
      Number.isInteger(this.prime) &&
      Number.isInteger(this.precision) &&
      this.ratio1_n !== 0 &&
      this.ratio1_d !== 0 &&
      this.ratio2_n !== 0 &&
      this.ratio2_d !== 0 &&
      this.prime > 0 &&
      this.precision > 0
    ) {
      const ratio1 = new Ratio(this.ratio1_n, this.ratio1_d)
      const padic1 = ratio1.convertToPadic(this.prime, this.precision)
      this.padic1_str = padic1.toString()

      const ratio2 = new Ratio(this.ratio2_n, this.ratio2_d)
      const padic2 = ratio2.convertToPadic(this.prime, this.precision)
      this.padic2_str = padic2.toString()
    }
  }
}
</script>

<style></style>
