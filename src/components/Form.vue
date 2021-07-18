<template>
  <div class="container w-300 mx-auto my-6 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">
      {{ prime }}-adic number expansion
    </h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5 mb-3"></div>

    <form @submit.prevent="onSubmit">
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
              v-model.number="ratio1_n"
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
              v-model.number="ratio1_d"
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
          <input
            type="text"
            v-model.number="padic1_str"
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
      </div>
      <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-3 mb-3"></div>

      <!-- Table -->
      <div class="flex-1">
        <PadicTable :padic="padic1" />
      </div>

      <!-- Button -->
      <div class="flex-1">
        <div class="text-center mt-8 flex-1">
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
import { Ratio, Padic } from '../engine/Padic'
import PadicTable from '@/components/PadicTable.vue'

@Component({
  components: {
    PadicTable,
  },
})
export default class App extends Vue {
  // Data
  ratio1_n = 1
  ratio1_d = 3
  ratio2_n = 123
  ratio2_d = -5
  prime = 5
  precision = 7
  padic1 = new Padic(this.prime, this.precision)
  padic1_str = ''
  padic1_dsum = 0
  padic2_str = ''
  padic_result = ''

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
      this.padic1 = ratio1.convertToPadic(this.prime, this.precision)
      this.padic1_dsum = this.padic1.dsum()
      this.padic1_str = this.padic1.toString()

      const ratio2 = new Ratio(this.ratio2_n, this.ratio2_d)
      const padic2 = ratio2.convertToPadic(this.prime, this.precision)
      this.padic2_str = padic2.toString()

      this.padic_result = this.padic1.add(padic2).toString()
    }
  }
}
</script>

<style></style>
