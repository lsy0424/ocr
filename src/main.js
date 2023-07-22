import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vconsole from 'vconsole'
const vConsole = new Vconsole()
Vue.use(vConsole)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
