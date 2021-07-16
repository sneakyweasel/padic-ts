<template>
  <div class="container w-300 mx-auto my-20 px-6 py-6 shadow">
    <h1 class="text-pink-600 font-bold font-sans text-4xl text-center">{{ prime }}-adic number expansion</h1>
    <div class="h-0.5 bg-gray-200 w-36 mx-auto mt-2.5"></div>
    <form action="" method="post">
      <div class="flex flex-col my-5">
        <label class="my-2" for="uname">Prime (p)</label>
        <input
          type="number"
          v-model="prime"
          class="mt-1 mb-3 shadow-md border-none focus:ring-transparent rounded-sm bg-gray-100 text-pink-500 w-36"
        />
        <label class="my-2" for="psw">Rational number</label>

        <input
          type="number"
          v-model="ratio_n"
          class="mt-1 mb-3 shadow-md border-none focus:ring-transparent rounded-sm bg-gray-100 text-pink-500 w-36"
        />
        <p class="mt-3 ml-2 mr-2">/</p>
        <input
          type="number"
          v-model="ratio_d"
          class="mt-1 mb-3 shadow-md border-none focus:ring-transparent rounded-sm bg-gray-100 text-pink-500 w-36"
        />
      </div>
      <div class="text-center mt-3">
        <button type="reset" class="px-7 py-2 mx-2 font-semibold text-gray-800 bg-gray-100 rounded">Reset</button>
        <button type="submit" class="px-7 py-2 mx-2 font-semibold text-white bg-pink-600 rounded">Submit</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  // Data
  prime = 7
  ratio_n = 7
  ratio_d = 2
}
</script>

<style></style>
