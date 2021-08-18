import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vClickOutside from 'v-click-outside'
import VueSweetalert2 from 'vue-sweetalert2'
import { firestorePlugin } from 'vuefire'
import 'sweetalert2/dist/sweetalert2.min.css'
import './assets/animations.css'
import './assets/tailwind.css'

Vue.config.productionTip = false

const sweetAlertConfig = {
  showClass: {
    popup: 'fade',
  },
  customClass: {
    confirmButton: 'bg-green-500',
  },
}

Vue.use(vClickOutside)
Vue.use(VueSweetalert2, sweetAlertConfig)
Vue.use(firestorePlugin)

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
