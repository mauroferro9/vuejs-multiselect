import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import i18n from './i18n'
import {
  Input,
  Button,
  Loading,
  Avatar,
  Tag,
  Popconfirm,
  RadioGroup,
  RadioButton,
  Notification
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(Input)
Vue.use(Button)
Vue.use(Loading)
Vue.use(Avatar)
Vue.use(Tag)
Vue.use(Popconfirm)
Vue.use(RadioGroup)
Vue.use(RadioButton)

Vue.prototype.$notify = Notification

ElementLocale.i18n((key, value) => i18n.t(key, value))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
