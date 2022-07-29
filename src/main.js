import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Localbase from 'localbase'
import DatetimePicker from 'vuetify-datetime-picker'

Vue.prototype.$localdb = new Localbase('db')
// Vue.prototype.$localdb.config.debug = false

Vue.use(DatetimePicker)
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
