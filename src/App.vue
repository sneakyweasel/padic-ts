<template>
  <div id="app">
    <Navbar />
    <Main />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Main from './components/Main.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

@Component({
  components: {
    Main,
    Navbar,
    Footer,
  },
})
export default class App extends Vue {}
</script>

<style></style>
