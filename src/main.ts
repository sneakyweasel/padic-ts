import Vue from 'vue'
import App from './App.vue'
import './main.css'

import VueKatex from 'vue-katex'
import 'katex/dist/katex.min.css'

Vue.use(VueKatex, {
  globalOptions: {
    //... Define globally applied KaTeX options here
  },
})

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
