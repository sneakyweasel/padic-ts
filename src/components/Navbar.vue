<template>
  <ul class="text-right p-4 pr-4 font-semibold bg-gray-100">
    <li class="inline mx-2 text-pink-600 hover:text-pink-400 cursor-pointer">
      <a href="https://github.com/sneakyweasel/padic">Github</a>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class NavBar extends Vue {
  @Prop() readonly links: Array<string> | undefined
}
</script>

<style></style>
