<template>
  <div class="container w-300 mx-auto my-6 px-6 shadow">
    <h1 class="title text-4xl">Introduction to p-adic numbers</h1>
    <div class="separator"></div>

    <!-- Introduction -->
    <p class="text-center mt-6 text-gray-600">
      <b>Why should I care?</b>
    </p>
    <p>
      The p-adics are another way to represent numbers which proved crucial for solving Fermat's
      last theorem, an unsolved problem for 350 years and has led to lots of progress in Number
      Theory. It is fascinating because it gives us a new notion of distance between numbers and a
      new way to write numbers.
    </p>

    <!-- Form -->
    <p class="text-center text-gray-600 mt-6">
      <b>Choose a fraction and a prime number!</b>
    </p>
    <form class="mt-2" @submit.prevent="">
      <div class="flex">
        <!-- Fraction input -->
        <div class="flex w-1/2 items-center mr-3">
          <div class="w-1/3">
            <label class="block text-center" for="psw">Fraction (x)</label>
          </div>
          <div class="w-2/3">
            <input type="number" v-model.number="n" class="number-input text-xl bg-gray-100" />
            <hr class="bg-black h-0.5" />
            <input type="number" v-model.number="d" class="number-input text-xl bg-gray-100" />
            <p class="text-red-500" v-if="!zeroDivCheck">Can't divide by zero.</p>
          </div>
        </div>
        <!-- Prime input -->
        <div class="flex w-1/2 items-center ml-3">
          <div class="w-1/3">
            <label class="my-2 text-center" for="uname">Prime number (p)</label>
          </div>
          <div class="w-2/3">
            <input
              type="number"
              v-model.number="prime"
              class="number-input bg-gray-100 text-xl text-blue-500"
            />
            <p class="text-red-500" v-if="!primeCheck">{{ prime }} is not a prime number.</p>
          </div>
        </div>
      </div>
    </form>
    <div class="separator"></div>

    <!-- Hide if p is not prime -->
    <div v-if="primeCheck && zeroDivCheck">
      <PadicDistance :ratio="ratio" :prime="prime" :precision="precision" />
      <div class="separator"></div>

      <PadicExpansion :ratio="ratio" :prime="prime" :precision="precision" />
      <div class="separator"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { presets } from '@/engine/data'
import { isPrime } from '@/engine/helpers'
import Ratio from '@/engine/Ratio'
import PadicDistance from '@/components/PadicDistance.vue'
import PadicExpansion from '@/components/PadicExpansion.vue'

@Component({
  components: {
    PadicDistance,
    PadicExpansion,
  },
})
export default class Form extends Vue {
  primeCheck = true
  zeroDivCheck = true
  preset_id = 1
  n = 71
  d = 9
  prime = 3
  precision = 8
  ratio = new Ratio(this.n, this.d)

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
    this.zeroDivCheck = this.d !== 0
    if (
      Number.isInteger(this.n) &&
      Number.isInteger(this.d) &&
      Number.isInteger(this.prime) &&
      Number.isInteger(this.precision) &&
      this.prime > 0 &&
      this.precision > 0 &&
      this.primeCheck &&
      this.zeroDivCheck
    ) {
      this.ratio = new Ratio(this.n, this.d)
    }
  }
}
</script>
<style lang="scss">
.title {
  @apply text-black mb-3 font-bold font-sans text-2xl text-center;
}
.separator {
  @apply h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3;
}
.number-input {
  @apply w-full mt-1 mb-3 text-xl text-black text-center shadow-md border-none rounded-md bg-gray-100 focus:ring-2 focus:ring-purple-600 hover:bg-gray-200;
}
.intro {
  @apply text-center text-gray-800 font-semibold text-lg mt-6;
}
.definition {
  @apply text-right text-gray-600 text-lg mr-3;
}
.static {
  @apply bg-gray-100 rounded-md text-lg;
}
.dynamic {
  @apply bg-gray-200 rounded-md text-lg;
}
</style>
