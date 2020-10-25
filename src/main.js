import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import i18n from './i18n'
import { Input, Button, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Input)
Vue.use(Button)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
// Vue.use(Notification)

// Vue.prototype.$notify = Notification
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
