import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import common from '../locales/common'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'es',
  // messages: common,
  silentTranslationWarn: process.env.NODE_ENV === 'production'
})
