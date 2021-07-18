<template>
  <div id="app">
    <!-- <Navbar :links="['Weasel', 'Contact']" /> -->
    <Form />
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Form from './components/Form.vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

@Component({
  components: {
    Form,
    Navbar,
    Footer,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss"></style>
