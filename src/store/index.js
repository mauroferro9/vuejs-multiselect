import Vue from 'vue'
import Vuex from 'vuex'
import appStore from './app/appStore'
import citiesStore from './cities/citiesStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app: appStore,
    cities: citiesStore
  },
  strict: process.env.NODE_ENV !== 'production'
})
